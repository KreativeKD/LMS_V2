const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const username = 'admin@admin';
        const password = 'adminpassword123';
        const role = 'admin';

        let admin = await User.findOne({ username });

        if (!admin) {
            admin = new User({
                username,
                password,
                role
            });
            await admin.save();
            console.log(`Default Admin created: ${username} / ${password}`);
        } else {
            console.log(`Admin account ${username} already exists.`);
            // Optional: You could update the password here if you want to ensure it matches
            // but usually it's better to log that it exists.
        }
    } catch (e) {
        console.error('Error seeding admin:', e);
    }
};

module.exports = seedAdmin;
