import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// ── PATCH /api/user/name ────────────────────────────────────────────────────

router.patch('/name', async (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }

    if (name.trim().length > 100) {
        return res.status(400).json({ error: 'Name cannot exceed 100 characters' });
    }

    try {
        req.user.name = name.trim();
        await req.user.save();
        return res.json({ user: req.user });
    } catch (err) {
        console.error('Update name error:', err);
        return res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ── PATCH /api/user/password ────────────────────────────────────────────────

router.patch('/password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    try {
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        user.password = newPassword; // pre-save hook will hash it
        await user.save();
        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Update password error:', err);
        return res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ── PATCH /api/user/sync-avatar ────────────────────────────────────────────────
// Accepts a fresh Google ID token, verifies it, confirms the email matches
// the logged-in user, then persists the Google profile picture as avatar.

router.patch('/sync-avatar', async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ error: 'Google credential token is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google OAuth is not configured on the server' });
    }

    try {
        const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, picture, sub: googleId } = ticket.getPayload();

        // Security: the Google account must belong to the logged-in user
        if (email.toLowerCase() !== req.user.email.toLowerCase()) {
            return res.status(403).json({ error: 'Google account does not match your account email' });
        }

        if (!picture) {
            return res.status(400).json({ error: 'No profile picture found on your Google account' });
        }

        req.user.avatar = picture;
        // Also link googleId if this is a local account connecting for the first time
        if (!req.user.googleId) {
            req.user.googleId = googleId;
            req.user.authProvider = 'google';
        }
        await req.user.save();
        return res.json({ user: req.user });
    } catch (err) {
        console.error('Sync avatar error:', err);
        return res.status(401).json({ error: 'Invalid or expired Google token' });
    }
});

export default router;
