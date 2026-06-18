import Stripe from 'stripe'
import { User } from "../models/user.auth.model.js"


const createStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing')
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY)
}


// get all the tenants/ active subscribers
export const getAllTenants = async (req, res) => {
    try {
        const tenants = await User.find({
            'role': 'user'
        })
        const totalTenants = await User.countDocuments({
            'role': 'user'
        })
        const activeSubscribers = await User.countDocuments({
            'role': 'user',
            'subscription.plan': 'pro',
            'subscription.status': 'active',
        })

        
        res.status(200).json({
            tenants: tenants,
            message: 'all the tenants',
            totalTenants,
            activeSubscribers,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error)
    }

}


// get all time and monthly revenue
export const getRevenueStats = async (req, res) => {
  try {
    const stripe = createStripeClient()

    const now = new Date()
    const startOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000)
const endOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000)

    // Fetch all paid invoices from Stripe (auto-paginates)
    const [monthlyInvoices, allTimeInvoices] = await Promise.all([
      stripe.invoices.list({
        status: 'paid',
        created: { gte: startOfMonth, lt: endOfMonth },
        limit: 100,
      }),
      stripe.invoices.list({
        status: 'paid',
        limit: 100,
      }),
    ])

    const sum = (invoices) =>
      invoices.data.reduce((acc, inv) => acc + inv.amount_paid, 0) / 100 // convert from cents

    const monthlyRevenue = sum(monthlyInvoices)
    const allTimeRevenue = sum(allTimeInvoices)

    res.status(200).json({ monthlyRevenue, allTimeRevenue })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}