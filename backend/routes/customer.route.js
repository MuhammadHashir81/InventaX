import { Router } from "express";
import { handleAddCustomers, handleDeleteCustomer, handleGetAllCustomers, handleSearchedCustomers, handleUpdateCustomers } from "../controllers/customers.controller.js";
import { verifyUser } from "../middlware/UserMiddleware.js";
import { subscriptionCheck } from "../middlware/SubscriptionCheck.js";


const customerRoute = Router()

customerRoute.post('/add', verifyUser, subscriptionCheck, handleAddCustomers)
customerRoute.get('/get-all', verifyUser, subscriptionCheck , handleGetAllCustomers)
customerRoute.get('/search', verifyUser, subscriptionCheck, handleSearchedCustomers)
customerRoute.put('/edit/:id', verifyUser, subscriptionCheck ,handleUpdateCustomers)
customerRoute.delete('/delete/:id', verifyUser, subscriptionCheck ,handleDeleteCustomer)

export { customerRoute }

