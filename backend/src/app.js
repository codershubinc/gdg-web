const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const _defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5500',
    'http://localhost:5501',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
];

const allowedOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim())
    : _defaultOrigins;

app.use(cors({
    origin: (origin, cb) => {
        // Allow same-origin requests (no Origin header) and listed origins
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

// ── Body & cookie parsers ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.get('/api/ping', (_req, res) => res.json({ ok: true }));

module.exports = app;
