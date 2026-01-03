import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.headers
    
    console.log('🔐 Auth middleware check: token present?', !!token, 'path:', req.path);
    
    if (!token) {
        console.log('❌ No token in headers');
        return res.json({ success: false, message: 'Not Authorized. Login Again!' })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified for userId:', tokenDecode.id);
        if (tokenDecode) {
            req.userId = tokenDecode.id
            next();
        } else {
            console.log('❌ Token decode failed');
            return res.json({ success: false, message: 'Token Verification Failed!' })
        }
    } catch (err) {
        console.log('❌ JWT verification error:', err.message);
        res.json({ success: false, message: err.message })
    }
}

export default userAuth;