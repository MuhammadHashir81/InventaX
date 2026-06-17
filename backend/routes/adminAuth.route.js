import { Router } from "express";
import { verifyUser } from "../middlware/UserMiddleware.js";
import { loginUser } from "../controllers/user.auth.controller.js";

export const adminRouter = Router()


adminRouter.post('/auth/login',loginUser)
