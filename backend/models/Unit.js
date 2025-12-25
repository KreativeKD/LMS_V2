const mongoose = require('mongoose');

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
        quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);
