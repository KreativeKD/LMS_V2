const mongoose = require('mongoose');

const academicCourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    professor: { type: String },
    duration: { type: String },
    level: { type: String },
    students: { type: String },
    icon: { type: String }, // Store Lucide icon name as string
    chapters: { type: Number },
    branch: { type: String, default: 'EXTC' }, // Engineering branch
}, { timestamps: true });

module.exports = mongoose.model('AcademicCourse', academicCourseSchema);
