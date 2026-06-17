import {  cookieOptions, userAccessToken, userRefreshToken } from "../utils/Generate_Token.js"
import bcrypt from 'bcryptjs'
import { loginSchema, signUpSchema } from "../validations/user.auth.validation.js"
import { User } from '../models/user.auth.model.js'
import jwt from 'jsonwebtoken'
import { response } from "express"
// seed admin 
export const seedAdmin = async (req, res) => {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' })

        if (existingAdmin) {
            return
        }
        const email = 'admin@gmail.com'
        const password = 'admin123admin'
        const hashedPassword = await bcrypt.hash(password, 10)
        const createAdmin = await User.create({
            email,
            password: hashedPassword,
            role: 'admin'
        })
        console.log('admin has been created ')

    } catch (error) {
        console.log(error)
    }
}


export const signUpUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        console.log(username, email, password)

        const result = signUpSchema.safeParse(req.body)

        if (!result.success) {
            const err = result.error.issues.map((e) => e.message)
            return res.status(400).json({
                success: false,
                error: err
            })
        }


        const isEmailExists = await User.findOne({ email })
        if (isEmailExists) {
            return res.status(400).json({
                success: false,
                error: "email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            data: user,
            success: true,
            message: 'sign up successfully'
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

// admin auth controller
export const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const result = loginSchema.safeParse(req.body)

        if (!result.success) {
            const err = result.error.issues.map((e) => e.message)
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        const user = await User.findOne({ email })

        if (user) {
            const userPassword = await bcrypt.compare(password, user.password)

            if (!userPassword) {
                return res.status(400).json({ error: 'invalid password' })
            }
                const accessToken = userAccessToken(user._id, user.role)
                const refreshToken = userRefreshToken(user._id)

                res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
                res.cookie('refreshToken', refreshToken, cookieOptions)

                return res.status(200).json({
                    success: 'log in successfully',
                    role: user.role,
                    user: user.username
                })

        }
        else {
            return res.status(400).json({ error: 'invalid credentials' })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'internal server error ' })

    }
}


// ─── Logout 
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return res.status(200).json({ message: 'logged out successfully' })

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


// refresh access token 
export const refreshAccessToken = async (req, res) => {
    try {
        const userRefreshToken = req.cookies.refreshToken

        if (!userRefreshToken) {
            return res.status(400).json({ error: 'login please' })
        }

        const decoded = jwt.verify(userRefreshToken, process.env.USER_REFRESH_TOKEN_SECRET)

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(400).json({ error: 'admin does not exist please login' })
        }
        const accessToken = userAccessToken(user._id)

        res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })

        return res.status(200).json({ success: 'access token refreshed successfully' })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message })
    }
}


// checking Auth 
export const checkingUserAuth = async (req, res) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)
        console.log("this is user in checking auth controller", user)

        if (!user) {
            return res.status(400).json({ error: 'please login' })

        }
        return res.status(200).json({ user: user.username, role: user.role })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
    }
}

