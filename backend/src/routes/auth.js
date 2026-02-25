'use strict';

const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = Router();

// Cookie options — httpOnly prevents JS access (XSS protection)
const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

function signToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function userPayload(u) {
    return {
        id: u._id,
        name: u.name,
        email: u.email,
        college: u.college,
        role: u.role,
        createdAt: u.createdAt,
    };
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { name, email, password, college = '' } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(409).json({ error: 'An account with that email already exists.' });
        }
        const user = await User.create({ name: name.trim(), email: email.trim(), password, college: college.trim() });
        const token = signToken(user._id);
        res.cookie('token', token, COOKIE_OPTS);
        res.status(201).json({ user: userPayload(user) });
    } catch (err) {
        console.error('[register]', err.message);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email: email.trim() }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        const token = signToken(user._id);
        res.cookie('token', token, COOKIE_OPTS);
        res.json({ user: userPayload(user) });
    } catch (err) {
        console.error('[login]', err.message);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (_req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out.' });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
    res.json({ user: userPayload(req.user) });
});

module.exports = router;
