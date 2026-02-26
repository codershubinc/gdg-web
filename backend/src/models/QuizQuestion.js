import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
    {
        quiz: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        question: {
            type: String,
            required: true,
            trim: true,
        },
        options: {
            type: [String],
            required: true,
            validate: v => v.length === 4,
        },
        answer: {
            type: Number,   // index into options (0-3)
            required: true,
            min: 0,
            max: 3,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

quizQuestionSchema.index({ quiz: 1, order: 1 });

export default mongoose.model('QuizQuestion', quizQuestionSchema);
