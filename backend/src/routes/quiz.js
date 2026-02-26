import express from 'express';
import QuizScore from '../models/QuizScore.js';
import QuizQuestion from '../models/QuizQuestion.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── GET /api/quiz/questions/:quiz ─────────────────────────────────────────────
// Public — returns all questions for a quiz track (with answers for client-side checking).

router.get('/questions/:quiz', async (req, res) => {
    const quiz = req.params.quiz.toLowerCase().trim();
    try {
        const questions = await QuizQuestion.find({ quiz })
            .sort({ order: 1 })
            .select('question options answer order')
            .lean();

        if (!questions.length) {
            return res.status(404).json({ error: 'No questions found for this quiz track.' });
        }

        return res.json({ quiz, questions });
    } catch (err) {
        console.error('Fetch questions error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
});

// All routes below require authentication
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

// ── GET /api/quiz/global-rank ─────────────────────────────────────────────────
// Compute the logged-in user's global rank across ALL users and ALL quizzes.
// Composite rating = sum of (score/total * 100) across best attempts,
//                    with a speed bonus: -0.5 pt per 10s saved vs 200s max.
// Tiebreak: lower total time = better.

router.get('/global-rank', async (req, res) => {
    try {
        // Build per-user composite ratings using best attempt per quiz
        const allRatings = await QuizScore.aggregate([
            // Sort so $first picks the best attempt per user+quiz
            { $sort: { score: -1, timeTaken: 1 } },
            {
                $group: {
                    _id: { user: '$user', quiz: '$quiz' },
                    score: { $first: '$score' },
                    total: { $first: '$total' },
                    timeTaken: { $first: '$timeTaken' },
                },
            },
            {
                $group: {
                    _id: '$_id.user',
                    quizzesDone: { $sum: 1 },
                    // accuracy points: (correct/total)*100 per quiz
                    accuracySum: {
                        $sum: { $multiply: [{ $divide: ['$score', '$total'] }, 100] },
                    },
                    // speed bonus: max 5 pts per quiz for finishing in < 200s
                    speedBonus: {
                        $sum: {
                            $cond: [
                                { $gt: ['$timeTaken', 0] },
                                {
                                    $multiply: [
                                        {
                                            $max: [
                                                0,
                                                { $subtract: [5, { $divide: ['$timeTaken', 40] }] },
                                            ],
                                        },
                                        1,
                                    ],
                                },
                                0,
                            ],
                        },
                    },
                    totalTime: {
                        $sum: { $ifNull: ['$timeTaken', 0] },
                    },
                },
            },
            {
                $addFields: {
                    rating: { $add: ['$accuracySum', '$speedBonus'] },
                },
            },
            { $sort: { rating: -1, totalTime: 1 } },
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
                    userId: '$_id',
                    name: '$userInfo.name',
                    avatar: '$userInfo.avatar',
                    quizzesDone: 1,
                    rating: { $round: ['$rating', 1] },
                    totalTime: 1,
                },
            },
        ]);

        const totalUsers = allRatings.length;
        const myIdx = allRatings.findIndex(
            r => String(r.userId) === String(req.user._id)
        );
        const myRank = myIdx === -1 ? null : myIdx + 1;
        const myStats = myIdx === -1 ? null : allRatings[myIdx];
        const top10 = allRatings.slice(0, 10).map((r, i) => ({ ...r, rank: i + 1 }));

        return res.json({ rank: myRank, total: totalUsers, stats: myStats, top10 });
    } catch (err) {
        console.error('Global rank error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
});

export default router;
