import jwt from 'jsonwebtoken'


export const userAccessToken = (userId,role) => {
    return jwt.sign({ 
        id: userId,
        role: role
        }, process.env.USER_ACCESS_TOKEN, { expiresIn: '15m' })
}

export const userRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.USER_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}


