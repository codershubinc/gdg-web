'use strict';

const mongoose = require('mongoose');

/**
 * Connect to MongoDB using MONGODB_URI from environment.
 * Throws if the env var is missing.
 */
async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set in .env');

    await mongoose.connect(uri);
    console.log('  ✓  MongoDB connected:', mongoose.connection.name);
}

module.exports = connectDB;
