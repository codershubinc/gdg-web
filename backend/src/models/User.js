import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: false,          // not required for Google OAuth users
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // never returned in queries by default
        },
        googleId: {
            type: String,
            default: null,
            select: false,
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        },
        college: {
            type: String,
            trim: true,
            default: '',
        },
        role: {
            type: String,
            enum: ['member', 'admin'],
            default: 'member',
        },
    },
    { timestamps: true }
);

// Hash password before saving (skip for OAuth users without a password)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare plain-text password to stored hash
userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// Strip sensitive fields from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};

export default mongoose.model('User', userSchema);
