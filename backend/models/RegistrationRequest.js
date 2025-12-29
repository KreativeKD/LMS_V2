const mongoose = require('mongoose');

const registrationRequestSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    approvedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('RegistrationRequest', registrationRequestSchema);
