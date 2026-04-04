const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true, trim: true, maxlength: 1000 }
    },
    { timestamps: true }
);

const unitSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    type: {
        type: String,
        enum: ['video', 'pdf', 'text', 'quiz'],
        required: true
    },
    content: {
        videoUrl: { type: String }, // YouTube link
        pdfUrl: { type: String },   // File path/URL
        text: { type: String },     // Description or content
        coverImage: { type: String }, // Intro/preview image shown before opening the unit
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
    },
    likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }, // Array of user IDs who liked this unit
    comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
