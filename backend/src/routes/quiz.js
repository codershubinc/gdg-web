import express from 'express';
import QuizScore from '../models/QuizScore.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All quiz routes require authentication
router.use(protect);

// ── POST /api/quiz/score ─────────────────────────────────────────────────────
// Submit a quiz attempt. Saves the score and returns best score for that quiz.

router.post('/score', async (req, res) => {
    const { quiz, score, total, timeTaken } = req.body;

    if (!quiz || typeof score !== 'number' || typeof total !== 'number') {
        return res.status(400).json({ error: 'quiz, score, and total are required' });
    }
    if (score < 0 || score > total) {
        return res.status(400).json({ error: 'score must be between 0 and total' });
    }
    if (total < 1 || total > 100) {
        return res.status(400).json({ error: 'total must be between 1 and 100' });
    }

    try {
        const attempt = await QuizScore.create({
            user: req.user._id,
            quiz: quiz.toLowerCase().trim(),
            score,
            total,
            timeTaken: timeTaken ?? null,
        });

        // Calculate best score for this quiz
        const best = await QuizScore.findOne({ user: req.user._id, quiz: attempt.quiz })
            .sort({ score: -1, timeTaken: 1 })
            .lean();

        return res.status(201).json({ attempt, best });
    } catch (err) {
        console.error('Quiz score save error:', err);
        return res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ── GET /api/quiz/scores ─────────────────────────────────────────────────────
// Get all best scores (one per quiz) for the logged-in user.

router.get('/scores', async (req, res) => {
    try {
        // Aggregate: for each quiz, return best score attempt
        const bests = await QuizScore.aggregate([
            { $match: { user: req.user._id } },
            { $sort: { score: -1, timeTaken: 1, createdAt: -1 } },
            {
                $group: {
                    _id: '$quiz',
                    score: { $first: '$score' },
                    total: { $first: '$total' },
                    timeTaken: { $first: '$timeTaken' },
                    attempts: { $sum: 1 },
                    lastPlayed: { $max: '$createdAt' },
                },
            },
            { $sort: { lastPlayed: -1 } },
        ]);

        return res.json({ scores: bests });
    } catch (err) {
        console.error('Fetch scores error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
});

// ── GET /api/quiz/history/:quiz ───────────────────────────────────────────────
// Get all attempts for a specific quiz (latest 20).

router.get('/history/:quiz', async (req, res) => {
    const quiz = req.params.quiz.toLowerCase().trim();
    try {
        const history = await QuizScore.find({ user: req.user._id, quiz })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();
        return res.json({ history });
    } catch (err) {
        console.error('Fetch history error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
});

// ── GET /api/quiz/leaderboard/:quiz ──────────────────────────────────────────
// Top 10 best scores across all users for a quiz.

router.get('/leaderboard/:quiz', async (req, res) => {
    const quiz = req.params.quiz.toLowerCase().trim();
    try {
        const board = await QuizScore.aggregate([
            { $match: { quiz } },
            { $sort: { score: -1, timeTaken: 1 } },
            {
                $group: {
                    _id: '$user',
                    score: { $first: '$score' },
                    total: { $first: '$total' },
                    timeTaken: { $first: '$timeTaken' },
                },
            },
            { $sort: { score: -1, timeTaken: 1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 0,
                    name: '$userInfo.name',
                    avatar: '$userInfo.avatar',
                    score: 1,
                    total: 1,
                    timeTaken: 1,
                },
            },
        ]);

        return res.json({ leaderboard: board });
    } catch (err) {
        console.error('Leaderboard error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
