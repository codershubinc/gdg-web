import express from 'express';
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

export default router;
