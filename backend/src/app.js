import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import quizRoutes from './routes/quiz.js';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const _defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5500',
    'http://localhost:5501',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5501',
    'https://gdg.codershubinc.com',
];

const allowedOrigins = process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim())
    : _defaultOrigins;

app.use(cors({
    origin: (origin, cb) => {
        // Allow same-origin requests (no Origin header) and listed origins
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
}));

// ── Body & cookie parsers ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);
app.get('/api/ping', (_req, res) => res.json({ ok: true }));

// Root health check
app.get('/', (_req, res) => res.json({ name: 'GDG Campus CSMU API', status: 'running' }));

export default app;
