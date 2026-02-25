'use strict';

const { Router } = require('express');

const router = Router();

/**
 * GET /api/health
 * Simple liveness check for uptime monitors and CI pipelines.
 */
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
