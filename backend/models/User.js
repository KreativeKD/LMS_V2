const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        required: true
    },
    enrolledCourses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
        enrolledAt: { type: Date, default: Date.now },
        hiddenContent: [{ type: mongoose.Schema.Types.ObjectId }],
        lastViewedUnit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', default: null },
        lastViewedAt: { type: Date, default: null }
    }],
    isFrozen: {
        type: Boolean,
        default: false
    },
    unfrozenByAdmin: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String,
        default: null
    },
    lastLogin: {
        type: Date
    }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
