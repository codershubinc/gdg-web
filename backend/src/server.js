require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3001;

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── MongoDB → Start server ────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () =>
            console.log(`Server running → http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
