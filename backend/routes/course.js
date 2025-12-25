const express = require('express');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Unit = require('../models/Unit');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all courses (Public/Student)
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'username')
            .populate({
                path: 'chapters',
                populate: { path: 'units' }
            });
        res.send(courses);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get single course details
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username')
            .populate({
                path: 'chapters',
                populate: { path: 'units' }
            });
        if (!course) return res.status(404).send();
        res.send(course);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin/Teacher: Create Course
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            instructor: req.user._id
        });
        await course.save();
        res.status(201).send(course);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Update Course
router.patch('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(course);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Delete Course
router.delete('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.send({ message: 'Course deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin/Teacher: Add Chapter
router.post('/:courseId/chapters', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const chapter = new Chapter({
            ...req.body,
            courseId: req.params.courseId
        });
        await chapter.save();

        await Course.findByIdAndUpdate(req.params.courseId, {
            $push: { chapters: chapter._id }
        });

        res.status(201).send(chapter);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Update Chapter
router.patch('/chapters/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title },
            { new: true }
        );
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });
        res.send(chapter);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Delete Chapter
router.delete('/chapters/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        await Course.findByIdAndUpdate(chapter.courseId, { $pull: { chapters: req.params.id } });
        res.send({ message: 'Chapter deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin/Teacher: Add Unit to Chapter
router.post('/chapters/:chapterId/units', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const unit = new Unit({
            ...req.body,
            chapterId: req.params.chapterId
        });
        await unit.save();

        await Chapter.findByIdAndUpdate(req.params.chapterId, {
            $push: { units: unit._id }
        });

        res.status(201).send(unit);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Update Unit
router.patch('/units/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!unit) return res.status(404).send({ error: 'Unit not found' });
        res.send(unit);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// Delete Unit
router.delete('/units/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);
        await Chapter.findByIdAndUpdate(unit.chapterId, { $pull: { units: req.params.id } });
        res.send({ message: 'Unit deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Student: Enroll in Course
router.post('/:courseId/enroll', auth, authorize('student'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        if (req.user.enrolledCourses.includes(course._id)) {
            return res.status(400).send({ error: 'Already enrolled' });
        }

        req.user.enrolledCourses.push(course._id);
        await req.user.save();

        course.students.push(req.user._id);
        await course.save();

        res.send({ message: 'Enrolled successfully' });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Get Enrolled Students
router.get('/:courseId/students', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('students', 'username');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        res.send(course.students);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;
