import jwt from 'jsonwebtoken'

export const verifyUser = (req, res, next) => {
    try {
        // works for both user and admin — one cookie, one secret
        const token = req.cookies.accessToken
        console.log('this is token in middleware',token)

        if (!token) {
            return res.status(401).json({ error: 'please login', tokenExpired: true })
        }

        const decoded = jwt.verify(token, process.env.USER_ACCESS_TOKEN)
        req.userId = decoded.id
        req.role = decoded.role
        next()

    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ error: error.message, tokenExpired: true })
    }
}

export const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient permissions' })
    }
    next()
}