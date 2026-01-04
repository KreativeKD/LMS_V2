const mongoose = require('mongoose');
const User = require('./backend/models/User');
const SystemSetting = require('./backend/models/SystemSetting');
require('dotenv').config({ path: './backend/.env' });

async function debug() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db');
        console.log('Connected to DB');

        const setting = await SystemSetting.findOne({ key: 'semesterCompletionDate' });
        console.log('System Setting:', setting);

        if (setting) {
            const d = new Date(setting.value);
            console.log('Parsed Date:', d);
            console.log('Date.now():', new Date());
            console.log('Is Frozen Condition (Date.now() > d):', Date.now() > d);
        }

        const student = await User.findOne({ role: 'student' });
        console.log('Sample Student:', student);
        if (student) {
            console.log('unfrozenByAdmin:', student.unfrozenByAdmin);
            console.log('Condition (!unfrozenByAdmin):', !student.unfrozenByAdmin);
        }

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
}

debug();
