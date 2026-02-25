/**
 * Appwrite Client Configuration
 * GDG Campus CSMU
 *
 * Uses Appwrite Web SDK (v16) loaded via CDN in HTML.
 * Configure your .env (or src/config/appwrite.js) and replace the
 * APPWRITE_ constants below, or expose them as window globals
 * from a generated config.js if you run the Node/Bun server.
 */

// ─── Runtime Config ────────────────────────────────────────────────────────
// When served by the Node/Bun server, /js/config.js is auto-generated
// with window.__GDG_CONFIG__. Fall back to placeholder values so the
// frontend still loads without errors during static development.
const _cfg = window.__GDG_CONFIG__ || {};

export const APPWRITE_ENDPOINT = _cfg.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
export const APPWRITE_PROJECT = _cfg.APPWRITE_PROJECT || 'YOUR_PROJECT_ID';
export const APPWRITE_DB_ID = _cfg.APPWRITE_DB_ID || 'YOUR_DATABASE_ID';
export const APPWRITE_USERS_COL = _cfg.APPWRITE_USERS_COL || 'users';

// ─── Appwrite SDK instances ─────────────────────────────────────────────────
// Appwrite SDK is loaded via CDN: <script src="...appwrite/iife/sdk.js"></script>
// which exposes window.Appwrite
const { Client, Account, Databases, Avatars, Storage, ID, Query, OAuthProvider } = window.Appwrite;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
export { ID, Query, OAuthProvider };
