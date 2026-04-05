const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Professor = require('../models/Professor');
const RegistrationRequest = require('../models/RegistrationRequest');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const SystemSetting = require('../models/SystemSetting');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { createNotification, createNotificationsForRecipients } = require('../utils/notifications');
const logger = require('../utils/logger');
const { auth, authorize } = require('../middleware/auth');
const { validate, loginSchema, requestAccessSchema, completeRegistrationSchema, registerSchema, updateProfileSchema } = require('../middleware/validation');
const { loginLimiter, registrationLimiter, authLimiter } = require('../middleware/rateLimiters');
const router = express.Router();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeUsernameAlias = (value = '') => {
    const trimmed = String(value || '').trim();
    const atIndex = trimmed.lastIndexOf('@');

    if (atIndex === -1) {
        return trimmed.toLowerCase().replace(/\s+/g, '');
    }

    const localPart = trimmed.slice(0, atIndex).toLowerCase().replace(/\s+/g, '');
    const rolePart = trimmed.slice(atIndex + 1).toLowerCase().replace(/\s+/g, '');
    return `${localPart}@${rolePart}`;
};

const findUserByUsernameAlias = async (username, projection = '') => {
    const trimmed = String(username || '').trim();
    if (!trimmed) return null;

    let query = User.findOne({ username: trimmed });
    if (projection) {
        query = query.select(projection);
    }
    let user = await query;
    if (user) return user;

    const atIndex = trimmed.lastIndexOf('@');
    if (atIndex === -1) return null;

    const role = trimmed.slice(atIndex + 1).trim().toLowerCase();
    if (!['admin', 'teacher', 'student'].includes(role)) return null;

    let candidatesQuery = User.find({ role });
    if (projection) {
        candidatesQuery = candidatesQuery.select(projection);
    }
    const candidates = await candidatesQuery;
    const normalizedInput = normalizeUsernameAlias(trimmed);

    return candidates.find((candidate) => normalizeUsernameAlias(candidate.username) === normalizedInput) || null;
};

const findUserByLoginIdentifier = async (identifier, projection = '') => {
    const trimmed = String(identifier || '').trim();
    if (!trimmed) return null;

    const userByUsername = await findUserByUsernameAlias(trimmed, projection);
    if (userByUsername) return userByUsername;

    const emailRegex = new RegExp(`^${escapeRegex(trimmed)}$`, 'i');
    let query = User.findOne({ role: 'student', email: emailRegex });
    if (projection) {
        query = query.select(projection);
    }

    return await query;
};

const isInstructorProfileComplete = (profile = {}) => {
    const hasName = String(profile.name || '').trim().length > 0;
    const hasDesignation = String(profile.designation || '').trim().length > 0;
    const hasPhoto = String(profile.photo || '').trim().length > 0;
    const hasBio = String(profile.bio || '').trim().length >= 50;
    const stats = profile.stats || {};
    const hasStats = ['experience', 'publications', 'patents', 'startups']
        .every((key) => String(stats[key] || '').trim().length > 0);

    return hasName && hasDesignation && hasPhoto && hasBio && hasStats;
};

// Login route supporting username aliases and student email addresses
router.post('/toggle-hidden-content', auth, async (req, res) => {
    try {
        const { courseId, contentId } = req.body;
        logger.debug('Toggle hidden content', { courseId, contentId });

        const user = await User.findById(req.user._id);

        if (!user) {
            logger.error('User not found in toggle-hidden-content', { userId: req.user._id });
            return res.status(404).send({ error: 'User not found' });
        }

        // Check if enrolledCourses exists
        if (!user.enrolledCourses) {
            logger.error('No enrolledCourses for user', { userId: user._id });
            return res.status(404).send({ error: 'No enrollments found' });
        }

        const enrollment = user.enrolledCourses.find(e => e.course && e.course.toString() === courseId);

        if (!enrollment) {
            const available = user.enrolledCourses.map(e => e.course ? e.course.toString() : 'null').join(', ');
            logger.error('Enrollment not found for course', { courseId, available });
            return res.status(404).send({ error: 'Course enrollment not found' });
        }

        // Initialize if undefined (for old records)
        if (!enrollment.hiddenContent) {
            enrollment.hiddenContent = [];
        }

        // Use findIndex with toString() for robust comparison
        const index = enrollment.hiddenContent.findIndex(id => id && id.toString() === contentId);

        if (index > -1) {
            // Unhide
            logger.debug('Unhiding content', { courseId, contentId });
            enrollment.hiddenContent.splice(index, 1);
        } else {
            // Hide
            logger.debug('Hiding content', { courseId, contentId });
            enrollment.hiddenContent.push(contentId);
        }

        await user.save();

        // Return fully populated user to keep frontend state consistent
        const populatedUser = await User.findById(user._id).select('-password').populate('enrolledCourses.course');
        res.send(populatedUser);

    } catch (e) {
        logger.error('Error in toggle-hidden-content', { error: e.message, stack: e.stack });
        res.status(500).send({ error: e.message });
    }
});

router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
    try {
        const { username, password } = req.body;
        logger.info('Login attempt', { identifier: username });

        const user = await findUserByLoginIdentifier(username, '+password');

        if (!user) {
            logger.error('User authentication failed', { identifier: username });
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            logger.error('User authentication failed: invalid password', { identifier: username, role: user.role });
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        // Check for Manual Freeze (Admin imposed)
        if (user.isFrozen) {
            return res.status(403).send({ error: 'Account is frozen by admin. Contact support.' });
        }

        user.lastLogin = Date.now();
        await user.save();

        logger.info('User login successful', { identifier: username, role: user.role, userId: user._id });
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        res.send({ user: { _id: user._id, username: user.username, role: user.role }, token });
    } catch (e) {
        logger.error('Login error', { error: e.message, stack: e.stack });
        res.status(500).send(e.message);
    }
});

// Get Current User Profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('enrolledCourses.course');
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Update User Profile
router.patch('/me', auth, validate(updateProfileSchema), async (req, res) => {
    try {
        const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'city', 'country', 'profilePhoto'];
        const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
        
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send({ error: 'User not found' });

        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();
        
        const populatedUser = await User.findById(user._id).select('-password').populate('enrolledCourses.course');
        res.send(populatedUser);
    } catch (e) {
        console.error('Profile update error:', e);
        res.status(400).send({ error: e.message || 'Failed to update profile' });
    }
});

router.get('/me/instructor-profile', auth, authorize('teacher'), async (req, res) => {
    try {
        const teacher = await User.findById(req.user._id).select('username email');
        if (!teacher) return res.status(404).send({ error: 'Instructor not found' });

        let profile = await Professor.findOne({ teacherId: teacher._id });
        if (!profile) {
            const fallbackName = String(teacher.username || '').split('@')[0] || 'Instructor';
            profile = await Professor.create({
                teacherId: teacher._id,
                name: fallbackName,
                designation: 'Professor',
                contact: {
                    email: teacher.email || ''
                },
                stats: {
                    experience: '',
                    publications: '',
                    patents: '',
                    startups: ''
                },
                isProfileComplete: false
            });
        }

        res.send(profile);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.put('/me/instructor-profile', auth, authorize('teacher'), async (req, res) => {
    try {
        const teacher = await User.findById(req.user._id);
        if (!teacher) return res.status(404).send({ error: 'Instructor not found' });

        const payload = {
            teacherId: teacher._id,
            name: String(req.body?.name || '').trim() || String(teacher.username || '').split('@')[0],
            designation: String(req.body?.designation || '').trim() || 'Professor',
            dept: String(req.body?.dept || '').trim(),
            institution: String(req.body?.institution || '').trim(),
            photo: String(req.body?.photo || '').trim(),
            bio: String(req.body?.bio || '').trim(),
            stats: {
                experience: String(req.body?.stats?.experience || '').trim(),
                publications: String(req.body?.stats?.publications || '').trim(),
                patents: String(req.body?.stats?.patents || '').trim(),
                startups: String(req.body?.stats?.startups || '').trim()
            },
            contact: {
                website: String(req.body?.contact?.website || '').trim(),
                linkedin: String(req.body?.contact?.linkedin || '').trim(),
                email: String(req.body?.contact?.email || teacher.email || '').trim()
            }
        };

        payload.isProfileComplete = isInstructorProfileComplete(payload);

        const profile = await Professor.findOneAndUpdate(
            { teacherId: teacher._id },
            { $set: payload },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        if (!profile.isProfileComplete) {
            return res.status(400).send({
                error: 'Complete all required profile fields before publishing to the Professor tab.',
                profile
            });
        }

        res.send(profile);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// NEW: Request Access (Step 1)
router.post('/request-access', registrationLimiter, validate(requestAccessSchema), async (req, res) => {
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
            // Self-healing: If request is dead (rejected or abandoned completed), allow fresh request
            if (existing.status === 'completed') {
                const user = await User.findOne({
                    $or: [
                        { _id: existing.userId },
                        {
                            firstName: { $regex: new RegExp(`^${firstName}$`, 'i') },
                            lastName: { $regex: new RegExp(`^${lastName}$`, 'i') }
                        }
                    ],
                    role: 'student'
                });
                if (!user) {
                    await RegistrationRequest.deleteOne({ _id: existing._id });
                } else {
                    return res.status(400).send({ error: 'A request for this name already exists and the student is active.' });
                }
            } else if (existing.status === 'rejected') {
                await RegistrationRequest.deleteOne({ _id: existing._id });
            } else {
                return res.status(400).send({ error: 'A request for this name already exists and is being processed.' });
            }
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
router.post('/complete-registration', authLimiter, validate(completeRegistrationSchema), async (req, res) => {
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

        const user = new User({
            username: finalUsername,
            password,
            role: 'student',
            firstName: request.firstName,
            lastName: request.lastName
        });
        await user.save();

        request.status = 'completed';
        request.userId = user._id;
        await request.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).send({ user, token });

    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Direct Registration (Skip Approval)
router.post('/register', registrationLimiter, validate(registerSchema), async (req, res) => {
    try {
        const { firstName, lastName, email, phone, city, country, username, password } = req.body;

        if (!firstName || !lastName || !email || !phone || !city || !country || !username || !password) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        const finalUsername = `${username}@student`;
        const existingUser = await User.findOne({ username: finalUsername });
        if (existingUser) {
            return res.status(400).send({ error: 'Username already taken.' });
        }

        const user = new User({
            username: finalUsername,
            password,
            role: 'student',
            firstName,
            lastName,
            email,
            phone,
            city,
            country
        });
        await user.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).send({ user: { _id: user._id, username: user.username, role: user.role }, token });

    } catch (e) {
        res.status(400).send({ error: e.message });
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

        const admins = await User.find({ role: 'admin' }).select('_id').lean();
        await createNotificationsForRecipients({
            recipientIds: admins.map((admin) => admin._id),
            actorId: req.user._id,
            type: 'registration_request_approved',
            title: 'Registration Request Approved',
            message: `${request.firstName} ${request.lastName}'s registration request was approved.`,
            link: '/admin',
            metadata: { requestId: request._id }
        });

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

        user.unfrozenByAdmin = true; // Grant immunity so they can login despite date
        user.isFrozen = false;
        await user.save();

        await createNotification({
            recipientId: user._id,
            actorId: req.user._id,
            type: 'account_unfrozen',
            title: 'Account Unfrozen',
            message: 'Your account has been unfrozen by admin. You can now continue learning.',
            link: '/student'
        });

        const admins = await User.find({ role: 'admin' }).select('_id').lean();
        await createNotificationsForRecipients({
            recipientIds: admins.map((admin) => admin._id),
            actorId: req.user._id,
            type: 'student_unfrozen',
            title: 'Student Unfrozen',
            message: `${user.username} has been unfrozen.`,
            link: '/admin',
            metadata: { studentId: user._id }
        });

        res.send({ message: 'Student account unfrozen' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin: Freeze Student
router.post('/admin/freeze-student/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send({ error: 'User not found' });

        user.isFrozen = true;
        user.unfrozenByAdmin = false; // Reset this if manually frozen
        await user.save();

        await createNotification({
            recipientId: user._id,
            actorId: req.user._id,
            type: 'account_frozen',
            title: 'Account Frozen',
            message: 'Your account has been frozen by admin. Contact support for help.',
            link: '/login'
        });

        const admins = await User.find({ role: 'admin' }).select('_id').lean();
        await createNotificationsForRecipients({
            recipientIds: admins.map((admin) => admin._id),
            actorId: req.user._id,
            type: 'student_frozen',
            title: 'Student Frozen',
            message: `${user.username} has been frozen.`,
            link: '/admin',
            metadata: { studentId: user._id }
        });

        res.send({ message: 'Student account frozen' });
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

        await Professor.findOneAndUpdate(
            { teacherId: user._id },
            {
                $setOnInsert: {
                    teacherId: user._id,
                    name,
                    designation: 'Professor',
                    stats: {
                        experience: '',
                        publications: '',
                        patents: '',
                        startups: ''
                    },
                    isProfileComplete: false
                }
            },
            { upsert: true, new: true }
        );

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

        await Notification.deleteMany({
            $or: [{ recipient: teacher._id }, { actor: teacher._id }]
        });

        await Professor.deleteOne({ teacherId: teacher._id });

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
        const studentId = req.params.id;
        const student = await User.findOneAndDelete({
            _id: studentId,
            role: 'student'
        });

        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        // Cleanup: Delete registration requests associated with this student
        // We use userId link AND name-based search (fallback for older records)
        const usernamePrefix = student.username.split('@')[0];
        const nameQuery = [];
        if (student.firstName && student.lastName) {
            nameQuery.push({
                firstName: { $regex: new RegExp(`^${student.firstName}$`, 'i') },
                lastName: { $regex: new RegExp(`^${student.lastName}$`, 'i') }
            });
        }

        await RegistrationRequest.deleteMany({
            $or: [
                { userId: studentId },
                ...nameQuery,
                // Robust fallback for old students: Match concatenated firstName + lastName with username
                {
                    status: 'completed',
                    $expr: {
                        $or: [
                            { $eq: [{ $toLower: { $concat: ["$firstName", "$lastName"] } }, usernamePrefix.toLowerCase()] },
                            { $eq: [{ $toLower: { $concat: ["$firstName", " ", "$lastName"] } }, usernamePrefix.toLowerCase()] }
                        ]
                    }
                }
            ]
        });

        // Cleanup: Remove student from all course lists
        await Course.updateMany(
            { students: studentId },
            { $pull: { students: studentId } }
        );

        await Notification.deleteMany({
            $or: [{ recipient: studentId }, { actor: studentId }]
        });

        res.send({ message: 'Student deleted successfully and associated data cleaned up' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Admin ONLY: Update student details
router.patch('/admin/students/:id', auth, authorize('admin'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'city', 'country', 'isFrozen'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const student = await User.findOne({ _id: req.params.id, role: 'student' });

        if (!student) {
            return res.status(404).send({ error: 'Student not found' });
        }

        updates.forEach((update) => student[update] = req.body[update]);
        await student.save();
        res.send(student);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Password Reset Request - User submits request
router.post('/forgot-password', authLimiter, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username || !username.trim()) {
            return res.status(400).send({ error: 'Username is required' });
        }

        const user = await findUserByUsernameAlias(username);

        if (!user) {
            // Don't reveal if user exists or not for security
            return res.status(200).send({ 
                message: 'If your account exists, a password reset request has been submitted to the admin.'
            });
        }

        if (user.isFrozen) {
            return res.status(403).send({
                error: 'Your account is frozen by admin. Password reset is disabled while account is frozen.'
            });
        }

        // Check if there's already a pending request
        const existingRequest = await PasswordResetRequest.findOne({
            userId: user._id,
            status: { $in: ['pending', 'approved'] }
        });

        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                return res.status(400).send({ 
                    error: 'You already have a pending password reset request. Please wait for admin approval.' 
                });
            }
            if (existingRequest.status === 'approved' && existingRequest.expiresAt > new Date()) {
                return res.status(200).send({ 
                    message: 'Your password reset request is already approved. You can reset your password now.',
                    approved: true,
                    requestId: existingRequest._id
                });
            }
        }

        // Create new password reset request
        const resetRequest = new PasswordResetRequest({
            username: user.username,
            email: user.email || '',
            userId: user._id,
            status: 'pending'
        });

        await resetRequest.save();

        const admins = await User.find({ role: 'admin' }).select('_id').lean();
        await createNotificationsForRecipients({
            recipientIds: admins.map((admin) => admin._id),
            actorId: user._id,
            type: 'password_reset_requested',
            title: 'Password Reset Requested',
            message: `${user.username} requested a password reset.`,
            link: '/admin',
            metadata: { requestId: resetRequest._id, username: user.username }
        });

        res.status(201).send({ 
            message: 'Password reset request submitted successfully. Please wait for admin approval.',
            requestId: resetRequest._id
        });
    } catch (e) {
        logger.error('Forgot password error', { error: e.message, stack: e.stack });
        res.status(500).send({ error: 'Failed to submit password reset request' });
    }
});

// Get all password reset requests - Admin only
router.get('/admin/password-reset-requests', auth, authorize('admin'), async (req, res) => {
    try {
        const requests = await PasswordResetRequest.find()
            .populate('userId', 'username firstName lastName email role')
            .sort({ createdAt: -1 });
        res.send(requests);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Approve password reset request - Admin only
router.patch('/admin/password-reset-requests/:id/approve', auth, authorize('admin'), async (req, res) => {
    try {
        const request = await PasswordResetRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).send({ error: 'Password reset request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).send({ error: 'Request has already been processed' });
        }

        request.status = 'approved';
        request.approvedAt = new Date();
        // expiresAt will be set by the pre-save hook (24 hours)
        
        await request.save();

        await createNotification({
            recipientId: request.userId,
            actorId: req.user._id,
            type: 'password_reset_approved',
            title: 'Password Reset Approved',
            message: 'Your password reset request was approved. You can reset your password now.',
            link: '/forgot-password',
            metadata: { requestId: request._id }
        });

        res.send({ 
            message: 'Password reset request approved. User can now reset their password.',
            request
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Reject password reset request - Admin only
router.patch('/admin/password-reset-requests/:id/reject', auth, authorize('admin'), async (req, res) => {
    try {
        const request = await PasswordResetRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).send({ error: 'Password reset request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).send({ error: 'Request has already been processed' });
        }

        request.status = 'rejected';
        await request.save();

        await createNotification({
            recipientId: request.userId,
            actorId: req.user._id,
            type: 'password_reset_rejected',
            title: 'Password Reset Rejected',
            message: 'Your password reset request was rejected. Please contact support if needed.',
            link: '/forgot-password',
            metadata: { requestId: request._id }
        });

        res.send({ 
            message: 'Password reset request rejected.',
            request
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Check password reset status - User checks if their request is approved
router.get('/password-reset-status/:username', authLimiter, async (req, res) => {
    try {
        const { username } = req.params;

        const user = await findUserByUsernameAlias(username);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        const request = await PasswordResetRequest.findOne({
            userId: user._id,
            status: 'approved',
            expiresAt: { $gt: new Date() }
        });

        if (!request) {
            return res.send({ approved: false });
        }

        res.send({ 
            approved: true,
            requestId: request._id,
            expiresAt: request.expiresAt
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Reset password - User resets password after admin approval
router.post('/reset-password', authLimiter, async (req, res) => {
    try {
        const { username, newPassword, requestId } = req.body;

        if (!username || !newPassword || !requestId) {
            return res.status(400).send({ error: 'Username, new password, and request ID are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        const user = await findUserByUsernameAlias(username);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (user.isFrozen) {
            return res.status(403).send({
                error: 'Your account is frozen by admin. You cannot reset password until the account is unfrozen.'
            });
        }

        const request = await PasswordResetRequest.findOne({
            _id: requestId,
            userId: user._id,
            status: 'approved'
        });

        if (!request) {
            return res.status(404).send({ error: 'No approved password reset request found' });
        }

        if (request.expiresAt < new Date()) {
            request.status = 'rejected';
            await request.save();
            return res.status(400).send({ error: 'Password reset request has expired. Please submit a new request.' });
        }

        // Update password
        user.password = newPassword;
        await user.save(); // Password hashing happens in User model's pre-save hook

        // Mark request as completed
        request.status = 'completed';
        await request.save();

        await createNotification({
            recipientId: user._id,
            actorId: user._id,
            type: 'password_reset_completed',
            title: 'Password Updated',
            message: 'Your password was reset successfully.',
            link: '/login',
            metadata: { requestId: request._id }
        });

        res.send({ 
            message: 'Password reset successfully. You can now login with your new password.',
            success: true
        });
    } catch (e) {
        logger.error('Reset password error', { error: e.message, stack: e.stack });
        res.status(500).send({ error: 'Failed to reset password' });
    }
});

// Delete password reset request - Admin only
router.delete('/admin/password-reset-requests/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const request = await PasswordResetRequest.findByIdAndDelete(req.params.id);
        
        if (!request) {
            return res.status(404).send({ error: 'Password reset request not found' });
        }

        res.send({ message: 'Password reset request deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Get system settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await SystemSetting.findOne();
        if (!settings) {
            return res.status(404).send({ error: 'Settings not found' });
        }
        res.send({
            semesterCompletionDate: settings.semesterCompletionDate || null,
            maintenanceMode: settings.maintenanceMode || false
        });
    } catch (e) {
        logger.error('Error fetching settings', { error: e.message });
        res.status(500).send({ error: e.message });
    }
});

// Update system settings - Admin only
router.post('/admin/settings', auth, authorize('admin'), async (req, res) => {
    try {
        const { semesterCompletionDate, maintenanceMode } = req.body;
        
        // Create or update settings
        let settings = await SystemSetting.findOne();
        if (!settings) {
            settings = new SystemSetting();
        }
        
        if (semesterCompletionDate !== undefined) {
            settings.semesterCompletionDate = semesterCompletionDate;
        }
        if (maintenanceMode !== undefined) {
            settings.maintenanceMode = maintenanceMode;
        }
        
        await settings.save();
        logger.info('Settings updated', { updatedBy: req.user._id });
        
        res.send({
            message: 'Settings updated successfully',
            semesterCompletionDate: settings.semesterCompletionDate,
            maintenanceMode: settings.maintenanceMode
        });
    } catch (e) {
        logger.error('Error updating settings', { error: e.message });
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
