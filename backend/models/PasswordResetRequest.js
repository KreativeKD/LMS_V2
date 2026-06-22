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
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'expired'],
        default: 'pending'
    },
    expiresAt: {
        type: Date
    },
    resetToken: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Automatically set expiration to 1 hour from creation
passwordResetRequestSchema.pre('save', function() {
    if (this.isNew && !this.expiresAt) {
        this.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    }
});

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
