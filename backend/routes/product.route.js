
import { handleAddProduct, handleDeleteProduct, handleGetAllProducts, handleSearchedProducts, handleUpdateProduct } from "../controllers/product.controller.js";
import { Router } from "express";
import { verifyUser } from "../middlware/UserMiddleware.js";
import { productSchema } from "../validations/product.validation.js";
import { subscriptionCheck } from "../middlware/SubscriptionCheck.js";

const productRouter = Router()

productRouter.post('/add', verifyUser, subscriptionCheck, handleAddProduct)
productRouter.get('/get-all', verifyUser, subscriptionCheck, handleGetAllProducts)
productRouter.put('/edit/:id', verifyUser, subscriptionCheck, handleUpdateProduct)
productRouter.delete('/delete/:id', verifyUser, subscriptionCheck, handleDeleteProduct)
productRouter.get('/search', verifyUser, subscriptionCheck, handleSearchedProducts)

export { productRouter }