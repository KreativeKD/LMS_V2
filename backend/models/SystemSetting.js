const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        default: null
    },
    semesterCompletionDate: {
        type: String,
        default: null
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    bannerImages: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
