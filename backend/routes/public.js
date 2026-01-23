const express = require('express');
const router = express.Router();
const Professor = require('../models/Professor');
const AcademicCourse = require('../models/AcademicCourse');
const { auth, authorize } = require('../middleware/auth');

// --- Public Routes ---

// Get all professors
router.get('/professors', async (req, res) => {
    try {
        const professors = await Professor.find({});
        res.send(professors);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get all academic courses
router.get('/academic-courses', async (req, res) => {
    try {
        const courses = await AcademicCourse.find({});
        res.send(courses);
    } catch (err) {
        res.status(500).send(err);
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
