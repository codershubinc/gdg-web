/**
 * GDG Campus CSMU — API Backend Server
 *
 * Stack: Express + MongoDB (Mongoose) + JWT (httpOnly cookies)
 *
 * Routes:
 *   GET  /api/health          — liveness check
 *   POST /api/auth/register   — create account
 *   POST /api/auth/login      — login → sets JWT cookie
 *   POST /api/auth/logout     — clears JWT cookie
 *   GET  /api/auth/me         — current user (auth required)
 *   PATCH /api/user/name      — update name (auth required)
 *   PATCH /api/user/password  — update password (auth required)
 *
 * Run:
 *   bun --hot src/server.js   (dev, hot-reload)
 *   node src/server.js        (production)
 */

'use strict';

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const corsMiddleware = require('./middleware/cors');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('./config/db');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const healthRouter = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND = path.resolve(__dirname, '..', '..', 'frontend');

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// ── Serve frontend static files ───────────────────────────────────────────────
app.use(express.static(FRONTEND));

// SPA fallback — serve index.html for any unmatched GET
app.get('*', (_req, res) => {
    res.sendFile(path.join(FRONTEND, 'index.html'));
});

// ── Connect DB then start listening ──────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  GDG Campus CSMU`);
    console.log(`  ➜  Frontend    http://localhost:${PORT}`);
    console.log(`  ➜  API         http://localhost:${PORT}/api`);
    console.log(`  ➜  Health      http://localhost:${PORT}/api/health\n`);
});

// Connect to MongoDB in background — server stays up even if DB is slow to connect
connectDB().catch(err => {
    console.error('  ✗  MongoDB connection failed:', err.message);
    console.error('     Set MONGODB_URI in backend/.env (e.g. a free MongoDB Atlas URI)\n');
});
