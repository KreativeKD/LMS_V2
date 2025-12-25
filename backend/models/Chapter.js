const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }]
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
