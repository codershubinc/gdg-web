/**
 * api.js — Vercel Serverless entry point
 *
 * Wraps the Express app for Vercel's Node.js runtime.
 * MongoDB is connected lazily and reused across warm invocations.
 */

const mongoose = require('mongoose');
const app = require('./src/app');

// 404 handler — registered once at module load (module is cached by Node)
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Reuse existing connection across warm lambda containers
let _connected = false;

async function connectDB() {
    if (_connected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    _connected = true;
}

module.exports = async (req, res) => {
    await connectDB();
    return app(req, res);
};
