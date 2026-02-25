'use strict';

const { Router } = require('express');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = Router();
router.use(requireAuth); // all /api/user/* routes require a valid session

// ── PATCH /api/user/name ──────────────────────────────────────────────────────
router.patch('/name', async (req, res) => {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name: name.trim() },
            { new: true, runValidators: true }
        );
        res.json({ user: { id: user._id, name: user.name, email: user.email, college: user.college, role: user.role } });
    } catch (err) {
        console.error('[user/name]', err.message);
        res.status(500).json({ error: 'Could not update name.' });
    }
});

// ── PATCH /api/user/password ──────────────────────────────────────────────────
router.patch('/password', async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new passwords are required.' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }

    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.comparePassword(oldPassword))) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }
        user.password = newPassword;
        await user.save(); // triggers bcrypt pre-save hook
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('[user/password]', err.message);
        res.status(500).json({ error: 'Could not update password.' });
    }
});

module.exports = router;
