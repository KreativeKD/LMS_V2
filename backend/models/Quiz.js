const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true } // Index of options array
    }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
