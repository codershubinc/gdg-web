import mongoose from 'mongoose';

const quizScoreSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        quiz: {
            type: String,           // e.g. "javascript", "python", "web"
            required: true,
            lowercase: true,
            trim: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 1,
        },
        timeTaken: {
            type: Number,           // seconds
            default: null,
        },
    },
    { timestamps: true }
);

// Compound index so we can quickly fetch a user's best score per quiz
quizScoreSchema.index({ user: 1, quiz: 1 });

export default mongoose.model('QuizScore', quizScoreSchema);
