const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');
const AcademicCourse = require('../models/AcademicCourse');
const Course = require('../models/Course');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const GeneralTestimonial = require('../models/GeneralTestimonial');
const { auth, authorize } = require('../middleware/auth');

// --- Public Routes ---

const PUBLIC_PROFESSOR_EXCLUDE_REGEX = /michael chen/i;
const getPublicProfessorQuery = () => ({
    name: { $not: PUBLIC_PROFESSOR_EXCLUDE_REGEX },
    $or: [
        { teacherId: { $exists: false } },
        { teacherId: null },
        { isProfileComplete: true }
    ]
});

const stripRoleSuffix = (username = '') =>
    String(username || '').replace(/@(admin|teacher|student)$/i, '');

const titleCaseCountry = (country = '') =>
    String(country || '')
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : '')
        .join(' ');

const serializeGeneralTestimonial = (item) => {
    const fullName = [item.user?.firstName, item.user?.lastName].filter(Boolean).join(' ').trim();
    const fallbackName = item.user?.username ? stripRoleSuffix(item.user.username) : 'Anonymous';
    const authorName = fullName || fallbackName;
    const initials = authorName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || 'U';

    return {
        _id: item._id,
        text: item.text,
        rating: item.rating,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        approvedAt: item.approvedAt,
        author: authorName,
        initials,
        role: item.user?.role === 'teacher' ? 'Teacher' : item.user?.role === 'admin' ? 'Admin' : 'Student',
    };
};

// Get all professors
router.get('/professors', async (req, res) => {
    try {
        const professors = await Professor.find(getPublicProfessorQuery());
        res.send(professors);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get all academic courses
router.get('/academic-courses', async (req, res) => {
    try {
        const courses = await AcademicCourse.find({}).populate('linkedCourse', 'students');
        const sanitized = courses.map((courseDoc) => {
            const course = courseDoc.toObject ? courseDoc.toObject() : courseDoc;
            if (!course.linkedCourse) return course;

            const studentsCount = Array.isArray(course.linkedCourse.students)
                ? course.linkedCourse.students.length
                : 0;

            return {
                ...course,
                linkedCourse: {
                    ...course.linkedCourse,
                    studentsCount,
                    students: undefined
                }
            };
        });

        res.send(sanitized);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get latest active announcements for landing panel
router.get('/announcements', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(20, parseInt(req.query.limit, 10) || 8));
        const announcements = await Announcement.find({ isActive: true })
            .select('title message createdAt type tickerText isTicker courseId')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.send(announcements);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch announcements' });
    }
});

// Get active ticker announcements
router.get('/ticker', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(30, parseInt(req.query.limit, 10) || 12));
        const tickerItems = await Announcement.find({ isActive: true, isTicker: true })
            .select('title message tickerText createdAt')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.send(tickerItems);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch ticker updates' });
    }
});

// Get dynamic platform stats for landing page cards
router.get('/stats', async (req, res) => {
    try {
        const [studentsEnrolled, liveCoursesCount, academicCoursesCount, expertProfessors] = await Promise.all([
            User.countDocuments({ role: 'student', 'enrolledCourses.status': 'approved' }),
            Course.countDocuments({}),
            AcademicCourse.countDocuments({}),
            Professor.countDocuments(getPublicProfessorQuery())
        ]);

        res.send({
            studentsEnrolled,
            coursesPlanned: liveCoursesCount || academicCoursesCount,
            expertProfessors
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch public stats' });
    }
});

// Get public, privacy-safe enrolled student country counts for the landing page map
router.get('/student-locations', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 20));
        const locations = await User.aggregate([
            {
                $match: {
                    role: 'student',
                    'enrolledCourses.status': 'approved'
                }
            },
            {
                $project: {
                    country: { $trim: { input: { $ifNull: ['$country', ''] } } },
                    normalizedCountry: { $toLower: { $trim: { input: { $ifNull: ['$country', ''] } } } }
                }
            },
            {
                $project: {
                    country: {
                        $cond: [{ $eq: ['$normalizedCountry', ''] }, 'India', '$country']
                    },
                    normalizedCountry: {
                        $cond: [{ $eq: ['$normalizedCountry', ''] }, 'india', '$normalizedCountry']
                    }
                }
            },
            {
                $group: {
                    _id: '$normalizedCountry',
                    country: { $first: '$country' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1, country: 1 } },
            { $limit: limit }
        ]);

        res.send(locations.map((item) => ({
            country: titleCaseCountry(item.country),
            count: item.count
        })));
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch student locations' });
    }
});

router.get('/testimonials', async (req, res) => {
    try {
        const limit = Math.max(1, Math.min(12, parseInt(req.query.limit, 10) || 3));
        const testimonials = await GeneralTestimonial.find({ status: 'approved' })
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(limit)
            .populate('user', 'firstName lastName username role')
            .lean();

        res.send(testimonials.map(serializeGeneralTestimonial));
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch testimonials' });
    }
});

router.get('/testimonials/me', auth, authorize('student'), async (req, res) => {
    try {
        const testimonial = await GeneralTestimonial.findOne({ user: req.user._id })
            .populate('user', 'firstName lastName username role')
            .lean();

        res.send({
            testimonial: testimonial ? serializeGeneralTestimonial(testimonial) : null
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch your testimonial' });
    }
});

router.post('/testimonials', auth, authorize('student'), async (req, res) => {
    try {
        const text = String(req.body?.text || '').trim();
        const rating = Number(req.body?.rating);

        if (text.length < 12) {
            return res.status(400).send({ error: 'Testimonial must be at least 12 characters long.' });
        }
        if (text.length > 600) {
            return res.status(400).send({ error: 'Testimonial must be 600 characters or less.' });
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return res.status(400).send({ error: 'Rating must be an integer between 1 and 5.' });
        }

        const testimonial = await GeneralTestimonial.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: {
                    user: req.user._id,
                    text,
                    rating,
                    status: 'pending',
                    approvedAt: null,
                    reviewedAt: null
                }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        ).populate('user', 'firstName lastName username role');

        res.status(201).send({
            testimonial: serializeGeneralTestimonial(testimonial),
            message: 'Testimonial submitted for admin approval.'
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to submit testimonial' });
    }
});

router.get('/admin/testimonials', auth, authorize('admin'), async (req, res) => {
    try {
        const testimonials = await GeneralTestimonial.find({})
            .sort({ createdAt: -1 })
            .populate('user', 'firstName lastName username role')
            .lean();

        res.send({
            testimonials: testimonials.map(serializeGeneralTestimonial)
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch testimonial requests' });
    }
});

router.patch('/admin/testimonials/:id/approve', auth, authorize('admin'), async (req, res) => {
    try {
        const testimonial = await GeneralTestimonial.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: 'approved',
                    approvedAt: new Date(),
                    reviewedAt: new Date()
                }
            },
            { new: true }
        ).populate('user', 'firstName lastName username role');

        if (!testimonial) {
            return res.status(404).send({ error: 'Testimonial not found' });
        }

        res.send({
            testimonial: serializeGeneralTestimonial(testimonial),
            message: 'Testimonial approved'
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to approve testimonial' });
    }
});

router.patch('/admin/testimonials/:id/reject', auth, authorize('admin'), async (req, res) => {
    try {
        const testimonial = await GeneralTestimonial.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: 'rejected',
                    reviewedAt: new Date(),
                    approvedAt: null
                }
            },
            { new: true }
        ).populate('user', 'firstName lastName username role');

        if (!testimonial) {
            return res.status(404).send({ error: 'Testimonial not found' });
        }

        res.send({
            testimonial: serializeGeneralTestimonial(testimonial),
            message: 'Testimonial rejected'
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to reject testimonial' });
    }
});

router.delete('/admin/testimonials/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const testimonial = await GeneralTestimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).send({ error: 'Testimonial not found' });
        }

        res.send({ message: 'Testimonial deleted' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete testimonial' });
    }
});

// --- Admin Management Routes ---

// Create/Update Professor
router.post('/professors', auth, authorize('admin'), async (req, res) => {
    try {
        const professor = new Professor(req.body);
        await professor.save();
        res.status(201).send(professor);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/professors/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const professor = await Professor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!professor) return res.status(404).send();
        res.send(professor);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/professors/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const professor = await Professor.findByIdAndDelete(req.params.id);
        if (!professor) return res.status(404).send();
        res.send(professor);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create/Update Academic Course
router.post('/academic-courses', auth, authorize('admin'), async (req, res) => {
    try {
        const course = new AcademicCourse(req.body);
        await course.save();
        res.status(201).send(course);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put('/academic-courses/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const course = await AcademicCourse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) return res.status(404).send();
        res.send(course);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/academic-courses/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const course = await AcademicCourse.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).send();
        res.send(course);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
