const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    dept: { type: String },
    institution: { type: String },
    photo: { type: String },
    stats: {
        experience: { type: String },
        publications: { type: String },
        patents: { type: String },
        startups: { type: String }
    },
    contact: {
        website: { type: String },
        linkedin: { type: String },
        email: { type: String }
    },
    expertise: [{ type: String }],
    leadership: [{
        title: { type: String },
        org: { type: String }
    }],
    achievements: [{
        title: { type: String },
        desc: { type: String }
    }],
    ventures: [{
        title: { type: String },
        desc: { type: String }
    }],
    courses: [{
        id: { type: String },
        title: { type: String },
        description: { type: String },
        chapters: [{ type: String }]
    }],
    testimonials: [{
        text: { type: String },
        author: { type: String },
        role: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Professor', professorSchema);
