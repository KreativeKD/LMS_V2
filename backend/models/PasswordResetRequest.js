const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    approvedAt: {
        type: Date
    },
    expiresAt: {
        type: Date
    },
    resetToken: {
        type: String
    }
}, { timestamps: true });

// Automatically set expiration when approved (24 hours)
passwordResetRequestSchema.pre('save', function() {
    if (this.isModified('status') && this.status === 'approved' && !this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
});

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
