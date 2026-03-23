const mongoose = require('mongoose');

const generalTestimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 600
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedAt: {
        type: Date,
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('GeneralTestimonial', generalTestimonialSchema);
