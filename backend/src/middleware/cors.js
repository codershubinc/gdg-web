'use strict';

const cors = require('cors');

/**
 * CORS middleware.
 * Development:  allow all origins (CORS_ORIGIN is empty/unset).
 * Production:   set CORS_ORIGIN to your frontend domain, e.g.
 *               CORS_ORIGIN=https://gdg-csmu.vercel.app
 */
module.exports = cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
