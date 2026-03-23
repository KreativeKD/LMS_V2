const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 600
    },
    overallRating: {
        type: Number,
        min: 0,
        max: 5
    },
    courseContentRating: {
        type: Number,
        min: 0,
        max: 5
    },
    coursePresentationRating: {
        type: Number,
        min: 0,
        max: 5
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
}, { timestamps: true });

testimonialSchema.index({ course: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
