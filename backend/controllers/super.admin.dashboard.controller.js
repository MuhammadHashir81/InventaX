import { User } from "../models/user.auth.model.js"
import Stripe from "stripe"


const DEFAULT_RANGE = "Last 30 Days";
const DAILY_RANGES = [
    "Today",
    "This Week",
    "Last Week",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
];

const startOfDay = (date) => {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
};


const endOfDay = (date) => {
    const value = new Date(date);
    value.setHours(23, 59, 59, 999);
    return value;
};

const startOfMonth = (date) => {
    const value = new Date(date);
    value.setDate(1);
    value.setHours(0, 0, 0, 0);
    return value;
};


const endOfMonth = (date) => {
    const value = startOfMonth(date);
    value.setMonth(value.getMonth() + 1);
    value.setDate(0);
    value.setHours(23, 59, 59, 999);
    return value;
};


const createStripeClient = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing')
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export const getSuperDashboardContext = async () => {
    try {
        const stripe = createStripeClient()
        const now = new Date()

        const startOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000)
        const endOfMonth = Math.floor(new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime() / 1000)

        const 



    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }
}