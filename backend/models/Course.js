const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    courseType: {
        type: String,
        enum: ['academic', 'professional', 'short-term'],
        default: 'academic'
    },
    descriptionPdf: { type: String }, // Base64 data URL for course description PDF
    contentHours: { type: Number, min: 0, default: 0 },
    image: { type: String }, // Base64 encoded image or URL
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    displayOrder: { type: Number, min: 0 },
    completionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
