/**
 * Vercel Serverless — GET /api/health
 * Simple liveness check (renamed from config.js — no Appwrite config needed).
 */
export default function handler(_req, res) {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
}
