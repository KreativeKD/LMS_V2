const express = require('express');
const Quiz = require('../models/Quiz');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Get all quizzes (Public/Student)
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.send(quizzes);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get single quiz
router.get('/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).send({ error: 'Quiz not found' });
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
