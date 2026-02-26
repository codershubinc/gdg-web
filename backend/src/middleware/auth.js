import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verifies the JWT stored in the httpOnly cookie.
 * Attaches `req.user` on success, otherwise returns 401.
 */
async function protect(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }
}

export { protect };
