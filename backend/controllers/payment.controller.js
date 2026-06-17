import Stripe from 'stripe'
import { User } from '../models/user.auth.model.js'

const createStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing')
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

// create payment
export const createPayment = async (req, res) => {
  try {
    const { priceId } = req.body
    const userId = req.userId

    const stripe = createStripeClient()
    const user = await User.findById(userId)

    if (!user) return res.status(404).json({ error: 'User not found' })

    const sub = user.subscription

    // ─── GUARD 1: Already on active pro plan ──────────────────────────
    if (sub?.plan === 'pro' && sub?.status === 'active' && !sub?.cancelAtPeriodEnd) {
      return res.status(400).json({
        error: 'You already have an active subscription.',
      })
    }

    // ─── GUARD 2: Active but scheduled to cancel ──────────────────────
    // User cancelled but period hasn't ended yet — they want to re-enable it
    if (sub?.plan === 'pro' && sub?.cancelAtPeriodEnd === true) {
      // Don't create new checkout — just reactivate the existing subscription
      await stripe.subscriptions.update(sub.stripeSubscriptionId, {
        cancel_at_period_end: false
      })

      await User.findByIdAndUpdate(userId, {
        'subscription.cancelAtPeriodEnd': false,
        'subscription.status': 'active'
      })

      return res.status(200).json({
        message: 'Your subscription has been reactivated.',
      })
    }

    // ─── GUARD 3: Past due — send to billing portal to fix payment ─────
    if (sub?.status === 'past_due') {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: sub.stripeCustomerId,
        return_url: 'http://localhost:5173/dashboard',
      })

      return res.status(200).json({
        message: 'Please update your payment method.',
        code: 'PAST_DUE',
        url: portalSession.url   // Redirect user here to fix their card
      })
    }

    // ─── GUARD 4: Expired — allow fresh checkout (re-subscribe) ───────
    // plan === 'expired' falls through to normal checkout below
    // stripeCustomerId is reused so Stripe links to same customer

    // ─── Normal checkout for: free_trial, expired ─────────────────────
    const sessionConfig = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
        success_url: 'http://localhost:5173/payment-success',
      metadata: { userId: userId.toString() },
      cancel_url: 'http://localhost:5173/payment-failed',
    }

    // Reuse existing Stripe customer if available
    if (sub?.stripeCustomerId) {
      sessionConfig.customer = sub.stripeCustomerId
    } else {
      sessionConfig.customer_email = user.email
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return res.status(201).json({
      message: 'Stripe checkout session created',
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}


// cancel subscription
export const cancelSubscription = async (req,res)=>{
  try {
    const userId = req.userId 

    const user = await User.findById(userId)

    if(!user) {
      return res.status(400).json({message:'user not found'})
    }

    const sub = user.subscription

    if(!sub?.stripeSubscriptionId){
      return res.status(200).json({
        error:'you have no active subscription'
      })
      }

       if (sub?.plan === 'expired' || sub?.status === 'inactive') {
      return res.status(400).json({
        error: 'Your subscription is already expired.',
      })

    }
      if (sub?.cancelAtPeriodEnd === true) {
      return res.status(400).json({
        error: 'Your subscription is already scheduled for cancellation.',
        code: 'ALREADY_CANCELLED',
        cancelDate: sub.currentPeriodEnd   // tell frontend when it ends
      })
    }


    const stripe = createStripeClient()

    await stripe.subscriptions.update(sub.stripeSubscriptionId,{
      cancel_at_period_end:true
    })

    await User.findByIdAndUpdate(userId, {
      'subscription.cancelAtPeriodEnd': true
    })

    console.log('subscription ended')

     return res.status(200).json({
      message: 'Subscription cancelled. You will have access until your billing period ends ',
      code: 'CANCELLED',
      accessUntil: sub.currentPeriodEnd    // show this date on frontend
    })

  } catch (error) {
    console.log(error)
    
  }
}


// get subscribed users details 

export const getSubscribedUserDetails = async (req,res)=>{
  const userId = req.userId
  try {
    const user = await User.findById(userId)

    if(!user) {
      return res.status(400).json({message:'please login'})
    }

    return res.status(200).json({
      name:user.username,
      email:user.email,
      plan: user.subscription.plan,
      status:user.subscription.status,
      trialStartDate:user.subscription.trialStartDate,
      trialEndDate:user.subscription.trialEndDate,
      currentPeriodStart:user.subscription.currentPeriodStart,
      currentPeriodEnd:user.subscription.currentPeriodEnd,
    })



  
  } catch (error) {
    console.log(error)
    return res.status(500).json({error:error.message})
    
  }
}


// webhook endpoint 
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY

export const handleWebhook = async (req, res) => {
  const stripe = createStripeClient()
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,           // Must be raw buffer — see note below
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    )
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  // Always acknowledge immediately — handle async
  res.status(200).json({ received: true })

  try {
    switch (event.type) {

      // ─── SCENARIO 1: Successful Payment ──────────────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        if (!userId) break

        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        const item = subscription.items?.data?.[0]

        await User.findByIdAndUpdate(userId, {
          'subscription.plan': 'pro',
          'subscription.status': 'active',
          'subscription.stripeCustomerId': session.customer,
          'subscription.stripeSubscriptionId': subscription.id,
          'subscription.currentPeriodStart': item?.current_period_start
            ? new Date(item.current_period_start * 1000) : null,
          'subscription.currentPeriodEnd': item?.current_period_end
            ? new Date(item.current_period_end * 1000) : null,
          'subscription.cancelAtPeriodEnd': false,
        })
        console.log(` Payment success — userId: ${userId}`)
        break
      }

      // Fired every billing cycle renewal
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        if (invoice.billing_reason === 'subscription_create') break // already handled above

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        const item = subscription.items?.data?.[0]

        // Find user by stripeCustomerId
        await User.findOneAndUpdate(
          { 'subscription.stripeCustomerId': invoice.customer },
          {
            'subscription.plan': 'pro',
            'subscription.status': 'active',
            'subscription.currentPeriodStart': item?.current_period_start
              ? new Date(item.current_period_start * 1000) : null,
            'subscription.currentPeriodEnd': item?.current_period_end
              ? new Date(item.current_period_end * 1000) : null,
            'subscription.cancelAtPeriodEnd': false,
          }
        )
        console.log(`Subscription renewed — customer: ${invoice.customer}`)
        break
      }

      // ─── SCENARIO 2: Cancellation ─────────────────────────────────────
      // Fired when user cancels — but they still have access until period ends
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const cancelAtPeriodEnd = subscription.cancel_at_period_end
        const item = subscription.items?.data?.[0]

        await User.findOneAndUpdate(
          { 'subscription.stripeSubscriptionId': subscription.id },
          {
            'subscription.cancelAtPeriodEnd': cancelAtPeriodEnd,
            // If they cancelled, flag it but keep plan active until period ends
            'subscription.status': cancelAtPeriodEnd ? 'active' : 'active',
            'subscription.currentPeriodEnd': item?.current_period_end
              ? new Date(item.current_period_end * 1000) : null,
          }
        )

        if (cancelAtPeriodEnd) {
          console.log(`⚠️ Subscription will cancel at period end — sub: ${subscription.id}`)
          // TODO: Send "your plan ends on X date" email here
        }
        break
      }

      // ─── SCENARIO 3: Plan Expired / Subscription Ended ────────────────
      // Fired when subscription fully ends (after cancellation period ends,
      // or after all payment retries fail)
      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await User.findOneAndUpdate(
          { 'subscription.stripeSubscriptionId': subscription.id },
          {
            'subscription.plan': 'expired',
            'subscription.status': 'inactive',
            'subscription.cancelAtPeriodEnd': false,
            'subscription.stripeSubscriptionId': null, // clear so they can resubscribe
            
          }
        )
        console.log(`❌ Subscription expired/deleted — sub: ${subscription.id}`)
        // TODO: Send "your plan has ended" email here
        break
      }

      // ─── SCENARIO 4: Payment Retry Failed (past_due) ──────────────────
      // Fired when Stripe tries to charge but card fails
      case 'invoice.payment_failed': {
        const invoice = event.data.object

        await User.findOneAndUpdate(
          { 'subscription.stripeCustomerId': invoice.customer },
          {
            'subscription.status': 'past_due',
            // Keep plan active during retry window — Stripe retries automatically
          }
        )
        console.log(`💳 Payment failed — customer: ${invoice.customer}`)
        // TODO: Send "update your payment method" email here
        break
      }

    }
  } catch (error) {
    console.error('Webhook handler error:', error.message)
    // Don't re-send 400 — Stripe already got 200
  }
}




