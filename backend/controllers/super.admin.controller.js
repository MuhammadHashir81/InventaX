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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim()



  try {

    const matchStage = {
      role: "user",
      ...(search && { username: { $regex: search, $options: "i" } }),
    };

    const tenants = await User.find({
      'role': 'user'
    })
    const totalTenants = await User.countDocuments(matchStage)
    //  count total pages 
    const totalPages = Math.ceil(totalTenants / limit)

    const activeSubscribers = await User.countDocuments({
      'role': 'user',
      'subscription.plan': 'pro',
      'subscription.status': 'active',
    })

    // aggregation for tenantSnapshot

    const tenantSnapshot = await User.aggregate([
      {
        $match: matchStage
      },
      {
        $lookup: {
          from: 'customers', // MongoDB collection name
          localField: '_id',
          foreignField: 'tenantId',
          as: 'customers'
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          role: 1,
          subscription: 1,
          customerCount: { $size: '$customers' },
          customers: 1
        }
      },

      { $skip: skip },
      { $limit: limit }

    ]);


    res.status(200).json({
      tenants: tenants,
      message: 'all the tenants',
      totalTenants,
      activeSubscribers,
      tenantSnapshot,
      totalPages
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


    const allTimeInvoices = []
    for await (const invoice of stripe.invoices.list({ status: 'paid' })) {
      allTimeInvoices.push(invoice)
    }

    const monthlyInvoices = []
    for await (const invoice of stripe.invoices.list({
      status: 'paid',
      created: { gte: startOfMonth, lt: endOfMonth },
    })) {
      monthlyInvoices.push(invoice)
    }


    // Now sum directly over the arrays, not .data
    const sum = (invoices) =>
      invoices.reduce((acc, inv) => acc + inv.amount_paid, 0) / 100

    res.status(200).json({
      monthlyRevenue: sum(monthlyInvoices),
      totalRevenue: sum(allTimeInvoices),
    })


  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
}