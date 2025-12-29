const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RegistrationRequest = require('../models/RegistrationRequest');
const SystemSetting = require('../models/SystemSetting');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Login route with name@role logic
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Login attempt for: ${username}`);

        // The username is expected to be name@role
        const parts = username.split('@');
        if (parts.length !== 2) {
            console.log(`Invalid format for: ${username}`);
            return res.status(400).send({ error: 'Invalid username format. Use name@role' });
        }

        const [name, role] = parts;
        const user = await User.findOne({ username, role });

        if (!user) {
            console.log(`User not found: ${username} with role ${role}`);
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Password mismatch for: ${username}`);
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        // Check for Semester Freeze (Only for students)
        if (user.role === 'student' && !user.unfrozenByAdmin) {
            const setting = await SystemSetting.findOne({ key: 'semesterCompletionDate' });
            if (setting && setting.value) {
                const completionDate = new Date(setting.value);
                if (Date.now() > completionDate) {
                    return res.status(403).send({ error: 'Account is frozen due to semester completion. Contact admin.' });
                }
            }
        }

        user.lastLogin = Date.now();
        await user.save();

        console.log(`Login successful: ${username}`);
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET || 'fallback_secret_key_123'
        );
        res.send({ user: { _id: user._id, username: user.username, role: user.role }, token });
    } catch (e) {
        console.error('Login error:', e);
        res.status(500).send(e.message);
    }
});

// NEW: Request Access (Step 1)
router.post('/request-access', async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).send({ error: 'First and Last name are required' });
        }

        // Use case-insensitive search to prevent duplicates
        const existing = await RegistrationRequest.findOne({
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (existing) {
            return res.status(400).send({ error: 'A request for this name already exists.' });
        }

        const request = new RegistrationRequest({ firstName, lastName });
        await request.save();
        res.status(201).send({ message: 'Request submitted successfully. Please wait for admin approval.' });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// NEW: Check Status (Step 3a)
router.post('/check-status', async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const request = await RegistrationRequest.findOne({
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
        });

        if (!request) {
            return res.status(404).send({ error: 'No request found for this name.' });
        }
        res.send(request);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// NEW: Complete Registration (Step 3b)
router.post('/complete-registration', async (req, res) => {
    try {
        const { firstName, lastName, username, password } = req.body; // username is just the part before @

        // Verify Approval
        const request = await RegistrationRequest.findOne({
            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') },
            status: 'approved'
        });

        if (!request) {
            return res.status(400).send({ error: 'Registration not approved or not found.' });
        }

        const finalUsername = `${username}@student`;
        const existingUser = await User.findOne({ username: finalUsername });
        if (existingUser) {
            return res.status(400).send({ error: 'Username already taken.' });
        }

        const user = new User({ username: finalUsername, password, role: 'student' });
        await user.save();

        request.status = 'completed';
        await request.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'fallback_secret_key_123');
        res.status(201).send({ user, token });

    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Admin: Get Settings
router.get('/admin/settings', auth, authorize('admin'), async (req, res) => {
    try {
        const setting = await SystemSetting.findOne({ key: 'semesterCompletionDate' });
        res.send({ semesterCompletionDate: setting ? setting.value : null });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin: Set Settings
router.post('/admin/settings', auth, authorize('admin'), async (req, res) => {
    try {
        const { semesterCompletionDate } = req.body;
        await SystemSetting.findOneAndUpdate(
            { key: 'semesterCompletionDate' },
            { value: semesterCompletionDate },
            { upsert: true, new: true }
        );
        res.send({ message: 'Settings updated' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin: Get Registration Requests
router.get('/admin/registration-requests', auth, authorize('admin'), async (req, res) => {
    try {
        const requests = await RegistrationRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.send(requests);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin: Approve Request
router.post('/admin/approve-request/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const request = await RegistrationRequest.findById(req.params.id);
        if (!request) return res.status(404).send({ error: 'Request not found' });

        request.status = 'approved';
        request.approvedAt = Date.now();
        await request.save();
        res.send({ message: 'Request approved' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin: Unfreeze Student
router.post('/admin/unfreeze-student/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ error: 'User not found' });

        user.unfrozenByAdmin = true;
        // Also ensure isFrozen is false if you were using that, but logic relies on date check vs unfrozen flag
        await user.save();
        res.send({ message: 'Student account unfrozen' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// Admin ONLY: Create teacher
router.post('/admin/add-teacher', auth, authorize('admin'), async (req, res) => {
    try {
        const { name, password } = req.body;
        const username = `${name}@teacher`;
        const user = new User({ username, password, role: 'teacher' });
        await user.save();
        res.status(201).send({ message: 'Teacher added successfully', username });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin ONLY: Create student
router.post('/admin/add-student', auth, authorize('admin'), async (req, res) => {
    try {
        const { name, password } = req.body;
        const username = `${name}@student`;
        const user = new User({ username, password, role: 'student' });
        await user.save();
        res.status(201).send({ message: 'Student added successfully', username });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin ONLY: Get all teachers
router.get('/admin/teachers', auth, authorize('admin'), async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.send(teachers);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin ONLY: Delete teacher
router.delete('/admin/teachers/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const teacher = await User.findOneAndDelete({
            _id: req.params.id,
            role: 'teacher'
        });

        if (!teacher) {
            return res.status(404).send({ error: 'Teacher not found' });
        }

        res.send({ message: 'Teacher deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Admin ONLY: Get all students
router.get('/admin/students', auth, authorize('admin'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.send(students);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin ONLY: Delete student
router.delete('/admin/students/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const student = await User.findOneAndDelete({
            _id: req.params.id,
            role: 'student'
        });

        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        res.send({ message: 'Student deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
