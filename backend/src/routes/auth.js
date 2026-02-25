const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ── Cookie options ──────────────────────────────────────────────────────────

function cookieOptions() {
    return {
        httpOnly: true,                          // not accessible from JS
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in ms
        path: '/',
    };
}

function signToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
}

// ── POST /api/auth/register ─────────────────────────────────────────────────

router.post('/register', async (req, res) => {
    const { name, email, password, college } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const user = await User.create({ name, email, password, college: college || '' });
        const token = signToken(user._id);

        res.cookie('token', token, cookieOptions());
        return res.status(201).json({ user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }
        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors).map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Explicitly select password (it is excluded by default in the schema)
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = signToken(user._id);
        res.cookie('token', token, cookieOptions());
        return res.json({ user });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────

router.get('/me', protect, (req, res) => {
    return res.json({ user: req.user });
});

// ── POST /api/auth/logout ───────────────────────────────────────────────────

router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    return res.json({ message: 'Logged out' });
});

module.exports = router;
