import {Router} from 'express'
import { cancelSubscription, createPayment, getSubscribedUserDetails } from '../controllers/payment.controller.js'
import { verifyUser } from '../middlware/UserMiddleware.js'
import express from 'express'
export const paymentRouter = Router()

paymentRouter.post('/create',verifyUser, createPayment)
paymentRouter.post('/cancel-subscription',verifyUser, cancelSubscription)
paymentRouter.get('/get-user-details',verifyUser, getSubscribedUserDetails)