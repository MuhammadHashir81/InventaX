import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: {
            type: String,
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        subscription: {
            plan: {
                type: String,
                enum: ['free_trial', 'pro', 'expired', 'cancelled'],
                default: 'free_trial'
            },
            status: {
                type: String,
                enum: ['active', 'inactive', 'cancelled', 'past_due'],
                default: 'active'
            },
            trialStartDate: { type: Date, default: Date.now },
            trialEndDate: {
                type: Date,
                default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            stripeCustomerId: { type: String, default: null },
            stripeSubscriptionId: { type: String, default: null },
            currentPeriodStart: { type: Date, default: null },
            currentPeriodEnd: { type: Date, default: null },
            cancelAtPeriodEnd: { type: Boolean, default: false },
        }


    }, { timestamps: true })

    export const User = mongoose.model('User', userSchema)