const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    completionDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
