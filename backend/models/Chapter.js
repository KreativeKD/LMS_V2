const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    moduleDescriptionPdf: { type: String }, // Base64 data URL for module-level description PDF
    moduleImage: { type: String }, // Base64 encoded image or URL for module preview
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }]
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
