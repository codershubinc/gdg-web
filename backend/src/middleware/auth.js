'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: verifies the JWT from the httpOnly cookie (or Authorization header).
 * Attaches the full user document (minus password) to req.user.
 */
module.exports = async function requireAuth(req, res, next) {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ error: 'User not found.' });
        req.user = user;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
};
