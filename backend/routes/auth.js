const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
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

// Student registration route
router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).send({ error: 'Name and password are required' });
        }

        const username = `${name}@student`;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ error: 'Student account already exists with this name' });
        }

        const user = new User({ username, password, role: 'student' });
        await user.save();

        console.log(`Student registered: ${username}`);

        // Auto-login after registration
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET || 'fallback_secret_key_123'
        );

        res.status(201).send({
            message: 'Registration successful',
            user: { username: user.username, role: user.role },
            token
        });
    } catch (e) {
        console.error('Registration error:', e);
        res.status(400).send({ error: e.message });
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
