    import { Router } from "express";
    import {  checkingUserAuth, loginUser, logoutUser, refreshAccessToken, signUpUser } from "../controllers/user.auth.controller.js";
    import { verifyUser } from "../middlware/UserMiddleware.js";
    export const authRouter = Router()



    authRouter.post('/login',loginUser)
    authRouter.get('/check',verifyUser, checkingUserAuth)
    authRouter.post('/signup', signUpUser)
    authRouter.post('/refresh-access-token', refreshAccessToken)
    authRouter.get('/logout', verifyUser, logoutUser)



