/**
 * GDG Campus CSMU — Static File Server
 * Works with: node src/server.js  |  bun src/server.js
 *
 * Structure:
 *   src/config/mime.js        — MIME type map
 *   src/routes/config.js      — /js/config.js dynamic route (env → browser)
 *   src/middleware/static.js  — static file resolution + serving
 */

'use strict';

const http = require('http');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { handleConfigRoute } = require('./routes/config');
const { serveFile, resolvePublicPath } = require('./middleware/static');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, '..', 'public');

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0]; // strip query string

    // Dynamic config route — injects env vars into window.__GDG_CONFIG__
    if (url === '/js/config.js') {
        handleConfigRoute(res);
        return;
    }

    // Resolve and validate the path
    const filePath = resolvePublicPath(url, PUBLIC);

    if (!filePath) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    // Serve static file (handles 404 internally)
    serveFile(filePath, res);
});

server.listen(PORT, () => {
    console.log(`\n  GDG Campus CSMU server running`);
    console.log(`  ➜  http://localhost:${PORT}\n`);
});
