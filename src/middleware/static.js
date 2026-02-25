'use strict';

const fs = require('fs');
const path = require('path');
const MIME = require('../config/mime');

/**
 * Serves a static file from disk.
 * Falls back to 404 if the file doesn't exist.
 */
function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}

/**
 * Resolves the requested URL to an absolute file path inside `publicDir`.
 * Handles:
 *   - Directory requests  → index.html inside that directory
 *   - Extension-less URLs → tries appending .html
 *
 * Returns null if the resolved path escapes `publicDir` (path traversal guard).
 */
function resolvePublicPath(url, publicDir) {
    let filePath = path.join(publicDir, url);

    // Security: prevent path traversal outside public/
    if (!filePath.startsWith(publicDir + path.sep) && filePath !== publicDir) {
        return null;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    if (!path.extname(filePath) && !fs.existsSync(filePath)) {
        filePath += '.html';
    }

    return filePath;
}

module.exports = { serveFile, resolvePublicPath };
