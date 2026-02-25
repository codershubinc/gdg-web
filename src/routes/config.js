'use strict';

/**
 * Route: GET /js/config.js
 *
 * Dynamically generates a JS snippet that injects server-side
 * environment variables into window.__GDG_CONFIG__ so that the
 * browser-side appwrite.js can read project credentials without
 * them being hard-coded in any static file.
 */
function handleConfigRoute(res) {
    const config = {
        APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
        APPWRITE_PROJECT: process.env.APPWRITE_PROJECT || '',
        APPWRITE_DB_ID: process.env.APPWRITE_DB_ID || '',
        APPWRITE_USERS_COL: process.env.APPWRITE_USERS_COL || 'users',
    };

    const body = `window.__GDG_CONFIG__ = ${JSON.stringify(config)};`;
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    res.end(body);
}

module.exports = { handleConfigRoute };
