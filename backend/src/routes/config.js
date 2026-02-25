'use strict';

const { Router } = require('express');

const router = Router();

/**
 * GET /api/config
 *
 * Returns public Appwrite configuration as JSON.
 * The frontend fetches this once on load to initialise the Appwrite SDK,
 * so credentials never need to be hard-coded in static files.
 */
router.get('/config', (_req, res) => {
    const config = {
        APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
        APPWRITE_PROJECT: process.env.APPWRITE_PROJECT || '',
        APPWRITE_DB_ID: process.env.APPWRITE_DB_ID || '',
        APPWRITE_USERS_COL: process.env.APPWRITE_USERS_COL || 'users',
    };

    res.setHeader('Cache-Control', 'no-store');
    res.json(config);
});

module.exports = router;
