/**
 * Vercel Serverless Function — GET /api/config
 * Mirrors src/routes/config.js for the Vercel deployment.
 *
 * Set these in Vercel project settings → Environment Variables:
 *   APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_DB_ID, APPWRITE_USERS_COL
 */
export default function handler(req, res) {
    const config = {
        APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
        APPWRITE_PROJECT: process.env.APPWRITE_PROJECT || '',
        APPWRITE_DB_ID: process.env.APPWRITE_DB_ID || '',
        APPWRITE_USERS_COL: process.env.APPWRITE_USERS_COL || 'users',
    };

    const body = `window.__GDG_CONFIG__ = ${JSON.stringify(config)};`;
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(body);
}
