const express = require('express');
const Quiz = require('../models/Quiz');
const Unit = require('../models/Unit');
const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const { auth, authorize } = require('../middleware/auth');
const { canAccessCourseContent } = require('../utils/accessControl');
const router = express.Router();

// Get all quizzes (Admin/Teacher only)
router.get('/', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.send(quizzes);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get single quiz
router.get('/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).lean();
        if (!quiz) return res.status(404).send({ error: 'Quiz not found' });

        if (req.user.role !== 'admin') {
            const quizUnit = await Unit.findOne({
                type: 'quiz',
                'content.quiz': quiz._id
            }).select('chapterId').lean();

            if (!quizUnit) {
                return res.status(404).send({ error: 'Quiz is not linked to a course unit' });
            }

            const chapter = await Chapter.findById(quizUnit.chapterId).select('courseId').lean();
            if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

            const course = await Course.findById(chapter.courseId)
                .select('students instructor assignedTeachers')
                .lean();
            if (!course) return res.status(404).send({ error: 'Course not found' });

            if (!canAccessCourseContent(course, req.user)) {
                return res.status(403).send({ error: 'Access denied. You are not allowed to view this quiz.' });
            }
        }

        res.send(quiz);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin/Teacher: Create Quiz
router.post('/', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        await quiz.save();
        res.status(201).send(quiz);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Update Quiz
router.patch('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!quiz) return res.status(404).send({ error: 'Quiz not found' });
        res.send(quiz);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Delete Quiz
router.delete('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) return res.status(404).send({ error: 'Quiz not found' });
        res.send({ message: 'Quiz deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;
