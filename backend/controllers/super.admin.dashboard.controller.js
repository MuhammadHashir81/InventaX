// import { User } from "../models/user.auth.model.js"
import Stripe from "stripe"

const createStripeClient = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing')
    }

    return new Stripe(process.env.STRIPE_SECRET_KEY)
}


function getDateRange(filter) {

    let now = new Date()

    let start = new Date(now)
    let end = new Date(now)

    end.setHours(23, 59, 59, 999);

    switch (filter) {

        case 'Today': {
            start = new Date(now)
            start.setHours(0, 0, 0, 0)
            break;
        }
        case 'Last 7 Days': {
            start = new Date(now)
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0)
            break;
        }
        case 'Last 30 Days': {
            start = new Date(now);
            start.setDate(start.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            break;
        }

        case 'This Month': {
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        }

        case 'Last Month': {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;
        }

        case 'Last 3 Months': {
            start = new Date(now);
            start.setMonth(start.getMonth() - 3);
            start.setHours(0, 0, 0, 0);
            break;
        }

        case 'Last 6 Months': {
            start = new Date(now);
            start.setMonth(start.getMonth() - 6);
            start.setHours(0, 0, 0, 0);
            break;
        }

        case 'Last 9 Months': {
            start = new Date(now);
            start.setMonth(start.getMonth() - 9);
            start.setHours(0, 0, 0, 0);
            break;
        }

        case 'Last 12 Months': {
            start = new Date(now);
            start.setMonth(start.getMonth() - 12);
            start.setHours(0, 0, 0, 0);
            break;
        }

        case 'This Year': {
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        }

        case 'Last Year': {
            start = new Date(now.getFullYear() - 1, 0, 1);
            end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;
        }

        case 'All Time': {
            start = null; // no lower bound
            end = null;
            break;
        }

        default:
            throw new Error(`Unknown filter: "${filter}"`);
    }

      return { start, end };

}


export const getSuperDashboardContext = async (req, res) => {
    try {
        const { range, startDate, endDate } = req.body;

        const stripe = createStripeClient();

        let start;
        let end;

        // Custom dates take priority
        if (startDate || endDate) {
            start = startDate ? new Date(startDate) : null;
            end = endDate ? new Date(endDate) : null;

            if (end) {
                end.setHours(23, 59, 59, 999);
            }
        } else {
            ({ start, end } = getDateRange(range));
        }

        // Build Stripe created filter
        const created = {};

        if (start) {
            created.gte = Math.floor(start.getTime() / 1000);
        }

        if (end) {
            created.lte = Math.floor(end.getTime() / 1000);
        }


        const sessionParams = {
            limit: 100,
        };

        if (Object.keys(created).length > 0) {
            sessionParams.created = created;
        }

        const sessions = await stripe.checkout.sessions.list(sessionParams);

        const totalRevenue = sessions.data.reduce((sum, session) => {
            return sum + (session.amount_total || 0);
        }, 0);

        const dashboardData = {
            totalRevenue: totalRevenue / 100, // cents -> dollars
            totalOrders: sessions.data.length,
            start,
            end,
        };

        return res.status(200).json({
            success: true,
            data: dashboardData,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};  