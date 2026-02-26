import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// ── GET /api/auth/config ────────────────────────────────────────────────────
// Exposes the Google OAuth Client ID so the frontend never needs it hardcoded.

router.get('/config', (_req, res) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || null;
    return res.json({ googleClientId });
});

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

// ── POST /api/auth/google ──────────────────────────────────────────────────
// Accepts a Google ID token from the frontend (Google Identity Services),
// verifies it, then finds-or-creates the user and issues a JWT cookie.

router.post('/google', async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ error: 'Google credential token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google OAuth is not configured on the server' });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, email_verified, picture } = payload;

        if (!email_verified) {
            return res.status(400).json({ error: 'Google account email is not verified' });
        }

        // Find existing user by googleId or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] }).select('+googleId');

        if (user) {
            // Update avatar and link googleId if this email existed as a local account
            let dirty = false;
            if (!user.googleId) { user.googleId = googleId; user.authProvider = 'google'; dirty = true; }
            if (picture && user.avatar !== picture) { user.avatar = picture; dirty = true; }
            if (dirty) await user.save();
        } else {
            // New user — create without a password
            user = await User.create({
                name,
                email,
                googleId,
                authProvider: 'google',
                avatar: picture || null,
            });
        }

        const token = signToken(user._id);
        res.cookie('token', token, cookieOptions());
        return res.json({ user });
    } catch (err) {
        console.error('Google OAuth error:', err);
        return res.status(401).json({ error: 'Invalid or expired Google token' });
    }
});

// ── POST /api/auth/logout ───────────────────────────────────────────────────

router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    return res.json({ message: 'Logged out' });
});

export default router;
