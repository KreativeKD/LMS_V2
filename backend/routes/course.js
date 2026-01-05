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
            .populate('assignedTeachers', 'username')
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
            .populate('assignedTeachers', 'username')
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
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).send();

        // Permission Check: Admin, Instructor, or Assigned Teacher
        const isInstructor = course.instructor.equals(req.user._id);
        const isAssigned = course.assignedTeachers && course.assignedTeachers.some(t => t.equals(req.user._id));
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isInstructor && !isAssigned) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to edit this course.' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedCourse);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Delete Course
router.delete('/:id', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        // Permission Check (Only Admin or Instructor can likely delete, but let's stick to prompt: "work (update-edit or delete)")
        const isInstructor = course.instructor.equals(req.user._id);
        const isAssigned = course.assignedTeachers && course.assignedTeachers.some(t => t.equals(req.user._id));
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isInstructor && !isAssigned) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to delete this course.' });
        }

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

// Student: Request Enrollment
router.post('/:courseId/enroll', auth, authorize('student'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        // Check if already enrolled (pending or approved)
        // Ensure e.course exists before accessing properties
        const existingEnrollment = req.user.enrolledCourses.find(
            e => e.course && e.course.toString() === course._id.toString()
        );

        if (existingEnrollment) {
            return res.status(400).send({ error: 'Already enrolled or request pending' });
        }

        // Add to enrolledCourses with 'pending' status
        req.user.enrolledCourses.push({
            course: course._id,
            status: 'pending' // Default is pending, but being explicit
        });
        await req.user.save();

        res.send({ message: 'Enrollment request submitted. Waiting for approval.' });
    } catch (e) {
        console.error("Enrollment Error:", e);
        res.status(400).send({ error: e.message });
    }
});

// Admin/Teacher: Approve Enrollment
router.post('/:courseId/approve-enrollment', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { studentId, action } = req.body; // action: 'approve' or 'reject'
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        // Permission Check
        // Permission Check
        const isInstructor = String(course.instructor) === String(req.user._id);
        const isAssigned = course.assignedTeachers && course.assignedTeachers.some(t => String(t) === String(req.user._id));
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isInstructor && !isAssigned) {
            return res.status(403).send({ error: 'Access denied' });
        }

        const User = require('../models/User'); // Ensure User model is available
        const student = await User.findById(studentId);
        if (!student) return res.status(404).send({ error: 'Student not found' });

        // Check for enrollment safely
        const enrollment = student.enrolledCourses.find(e => e.course && e.course.toString() === course._id.toString());
        if (!enrollment) return res.status(400).send({ error: 'Student has not requested enrollment' });

        if (action === 'approve') {
            enrollment.status = 'approved';
            // Add to course.students only upon approval
            if (!course.students.includes(studentId)) {
                course.students.push(studentId);
                await course.save();
            }
        } else if (action === 'reject') {
            // Remove from enrolledCourses safely
            student.enrolledCourses = student.enrolledCourses.filter(e => e.course && e.course.toString() !== course._id.toString());
        } else {
            return res.status(400).send({ error: 'Invalid action' });
        }

        await student.save();
        res.send({ message: `Enrollment ${action}ed` });
    } catch (e) {
        console.error("Enrollment Approval Error:", e);
        res.status(400).send({ error: e.message });
    }
});

// Admin: Assign Teacher to Course
router.post('/:courseId/assign-teacher', auth, authorize('admin'), async (req, res) => {
    try {
        const { teacherId } = req.body;
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        if (course.assignedTeachers.includes(teacherId)) {
            return res.status(400).send({ error: 'Teacher already assigned' });
        }

        course.assignedTeachers.push(teacherId);
        await course.save();
        res.send({ message: 'Teacher assigned successfully', course });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Get Enrollment Requests for a Course
router.get('/:courseId/requests', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        // Permission Check
        const isInstructor = String(course.instructor) === String(req.user._id);
        const isAssigned = course.assignedTeachers && course.assignedTeachers.some(t => String(t) === String(req.user._id));
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isInstructor && !isAssigned) {
            return res.status(403).send({ error: 'Access denied' });
        }

        const User = require('../models/User');
        // Find students who have this course in enrolledCourses with status 'pending'
        const students = await User.find({
            'enrolledCourses': { $elemMatch: { course: course._id, status: 'pending' } }
        }, 'username _id enrolledCourses'); // Return only necessary fields

        res.send(students);
    } catch (e) {
        res.status(500).send(e.message);
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
