import {Router} from 'express'
import { verifyUser } from '../middlware/UserMiddleware.js'
import { handleAddInvoices, handleGetAllInvoices,handlePdfDownload,handleSearchInvoices,handleUpdateInvoice } from '../controllers/invoice.controller.js'
import { subscriptionCheck } from '../middlware/SubscriptionCheck.js'

const invoiceRouter = Router()

invoiceRouter.post('/create/:customerId', verifyUser,  subscriptionCheck, handleAddInvoices)
invoiceRouter.get('/get-all',verifyUser,  subscriptionCheck, handleGetAllInvoices)
invoiceRouter.put('/edit/:id',verifyUser,  subscriptionCheck, handleUpdateInvoice)
invoiceRouter.get('/search',verifyUser,  subscriptionCheck, handleSearchInvoices)
invoiceRouter.post('/generate-bill',verifyUser, subscriptionCheck, handlePdfDownload)
export { invoiceRouter }
