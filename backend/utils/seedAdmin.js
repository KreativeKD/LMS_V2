const User = require('../models/User');
const logger = require('./logger');

const seedAdmin = async () => {
    try {
        const username = 'admin';
        const password = 'adminpassword123';
        const role = 'admin';

        let admin = await User.findOne({ username });
        const legacyAdmin = await User.findOne({ username: 'admin@admin', role });

        if (!admin && legacyAdmin) {
            legacyAdmin.username = username;
            await legacyAdmin.save();
            logger.info('Default Admin username migrated', { username });
            return;
        }

        if (!admin) {
            admin = new User({
                username,
                password,
                role
            });
            await admin.save();
            logger.info('Default Admin created', { username, password });
        } else {
            logger.info('Admin account already exists', { username });
            // Optional: You could update the password here if you want to ensure it matches
            // but usually it's better to log that it exists.
        }
    } catch (e) {
        logger.error('Error seeding admin', { error: e.message, stack: e.stack });
    }
};

module.exports = seedAdmin;
