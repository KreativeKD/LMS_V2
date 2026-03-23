const express = require('express');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Unit = require('../models/Unit');
const Testimonial = require('../models/Testimonial');
const { auth, authorize } = require('../middleware/auth');
const { validate, courseSchema, chapterSchema, unitSchema, updateUnitSchema } = require('../middleware/validation');
const { apiLimiter } = require('../middleware/rateLimiters');
const { cacheMiddleware, invalidateCache, CACHE_DURATIONS } = require('../middleware/cache');
const { canAccessCourseContent } = require('../utils/accessControl');
const { createNotification } = require('../utils/notifications');
const { createCourseCreatedAnnouncement } = require('../utils/announcements');
const router = express.Router();

const sanitizePdfUnitTitle = (title) => {
    if (typeof title !== 'string') return title;
    const cleaned = title.trim().replace(/\s+pdf\s+content\s*$/i, '').trim();
    return cleaned || 'PDF Document';
};

const ensureInstructorFallback = (course) => {
    if (!course) return course;

    if (!course.instructor && Array.isArray(course.assignedTeachers) && course.assignedTeachers.length > 0) {
        course.instructor = course.assignedTeachers[0];
    }

    return course;
};

const isAssociatedTeacherForCourse = (course, user) => {
    if (!course || !user) return false;
    if (user.role !== 'teacher') return false;

    const userId = String(user._id);
    const isInstructor = course.instructor && String(course.instructor) === userId;
    const isAssigned = Array.isArray(course.assignedTeachers) &&
        course.assignedTeachers.some((teacherId) => String(teacherId) === userId);

    return isInstructor || isAssigned;
};

const canManageCourse = (course, user) => {
    if (!course || !user) return false;
    if (user.role === 'admin') return true;
    return isAssociatedTeacherForCourse(course, user);
};

const resolveDisplayName = (person) => {
    if (!person) return 'Anonymous';

    const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
    const fallbackName = person.username ? person.username.split('@')[0] : '';
    return fullName || fallbackName || 'Anonymous';
};

const resolveInitials = (name) => {
    const parts = String(name || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);

    if (!parts.length) return 'U';
    return parts.map((part) => part[0].toUpperCase()).join('');
};

const resolveRoleLabel = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'teacher') return 'Teacher';
    return 'Student';
};

const serializeTestimonial = (testimonial) => {
    const authorName = resolveDisplayName(testimonial.user);
    const courseTitle = testimonial.course?.title || '';
    const overallRating = Number(testimonial.overallRating || testimonial.rating || 0);

    return {
        _id: testimonial._id,
        text: testimonial.text,
        rating: overallRating,
        overallRating,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
        course: testimonial.course?._id || testimonial.course,
        courseTitle,
        author: {
            _id: testimonial.user?._id || testimonial.user,
            name: authorName,
            initials: resolveInitials(authorName),
            role: resolveRoleLabel(testimonial.user?.role)
        }
    };
};

const isValidHalfStepRating = (value) => Number.isFinite(value) && value >= 0 && value <= 5 && Math.round(value * 2) === value * 2;

const getAccessibleCourseAndUnit = async (courseId, unitId, user) => {
    const [course, unit] = await Promise.all([
        Course.findById(courseId).select('students instructor assignedTeachers').lean(),
        Unit.findById(unitId)
    ]);

    if (!course) {
        return { error: { status: 404, body: { error: 'Course not found' } } };
    }

    if (!canAccessCourseContent(course, user)) {
        return { error: { status: 403, body: { error: 'Access denied. You are not allowed to access this course content.' } } };
    }

    if (!unit) {
        return { error: { status: 404, body: { error: 'Unit not found' } } };
    }

    const chapter = await Chapter.findById(unit.chapterId).select('courseId').lean();
    if (!chapter || String(chapter.courseId) !== String(courseId)) {
        return { error: { status: 400, body: { error: 'Unit does not belong to this course' } } };
    }

    return { course, unit };
};

// Apply general API rate limiting to all course routes
router.use(apiLimiter);

// Apply caching to GET requests
router.get('*', cacheMiddleware(CACHE_DURATIONS.COURSES_LIST));

// GET endpoints (will be cached automatically)
router.get('/', async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Get total count for pagination metadata
        const total = await Course.countDocuments();

        // Fetch courses with pagination and minimal populate (no chapters/units)
        const courses = await Course.find()
            .select('title description courseType descriptionPdf contentHours image instructor assignedTeachers students chapters completionDate createdAt')
            .populate('instructor', 'username')
            .populate('assignedTeachers', 'username')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance

        // Add chapter count without loading full chapter data
        const coursesWithCount = courses.map((course) => {
            const hydrated = ensureInstructorFallback(course);
            const { students, ...rest } = hydrated;
            return {
                ...rest,
                chapterCount: rest.chapters?.length || 0,
                studentsCount: students?.length || 0
            };
        });

        res.send({
            courses: coursesWithCount,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get single course details (Basic info only, chapters loaded separately)
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .select('title description courseType descriptionPdf contentHours image instructor assignedTeachers students chapters completionDate createdAt')
            .populate('instructor', 'username')
            .populate('assignedTeachers', 'username')
            .lean();
        
        if (!course) return res.status(404).send({ error: 'Course not found' });
        
        ensureInstructorFallback(course);

        // Add counts without exposing student ID list
        course.chapterCount = course.chapters?.length || 0;
        course.studentsCount = course.students?.length || 0;
        delete course.students;
        
        res.send(course);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get course with full chapter/unit details (for editing)
router.get('/:id/full', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'username')
            .populate('assignedTeachers', 'username')
            .populate({
                path: 'chapters',
                select: 'title moduleDescriptionPdf courseId units',
                populate: { 
                    path: 'units',
                    select: 'title type content chapterId'
                }
            })
            .lean();
        
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canAccessCourseContent(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to view this course content.' });
        }
        ensureInstructorFallback(course);
        res.send(course);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get chapters for a course (lazy loading)
router.get('/:id/chapters', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .select('chapters students instructor assignedTeachers')
            .populate({
                path: 'chapters',
                select: 'title moduleDescriptionPdf courseId units',
                options: { sort: { createdAt: 1 } }
            })
            .lean();
        
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canAccessCourseContent(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to view this course content.' });
        }
        
        // Return chapters with unit count but not full unit data
        const chaptersWithCount = course.chapters.map(chapter => ({
            ...chapter,
            unitCount: chapter.units?.length || 0,
            units: undefined // Remove units array
        }));
        
        res.send(chaptersWithCount);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Get units for a chapter (lazy loading)
router.get('/chapters/:chapterId/units', auth, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId)
            .select('title units courseId')
            .populate({
                path: 'units',
                select: 'title type content chapterId'
            })
            .lean();
        
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(chapter.courseId)
            .select('students instructor assignedTeachers')
            .lean();

        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canAccessCourseContent(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to view this course content.' });
        }

        res.send(chapter.units || []);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

router.get('/:courseId/testimonials', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .select('title students instructor assignedTeachers')
            .lean();

        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        if (!canAccessCourseContent(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to view this course content.' });
        }

        const testimonials = await Testimonial.find({ course: req.params.courseId })
            .sort({ updatedAt: -1, createdAt: -1 })
            .populate('user', 'firstName lastName username role')
            .populate('course', 'title')
            .lean();

        res.send({
            testimonials: testimonials.map(serializeTestimonial)
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.post('/:courseId/testimonials', auth, authorize('student'), async (req, res) => {
    try {
        const text = String(req.body?.text || '').trim();
        const overallRating = Number(req.body?.overallRating ?? req.body?.rating);
        if (text.length < 12) {
            return res.status(400).send({ error: 'Feedback must be at least 12 characters long.' });
        }
        if (text.length > 600) {
            return res.status(400).send({ error: 'Feedback must be 600 characters or less.' });
        }
        if (!isValidHalfStepRating(overallRating)) {
            return res.status(400).send({ error: 'Overall rating must be between 0 and 5 in 0.5 steps.' });
        }

        const course = await Course.findById(req.params.courseId)
            .select('title students instructor assignedTeachers')
            .lean();

        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        if (!canAccessCourseContent({ ...course, _id: req.params.courseId }, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to submit feedback for this course.' });
        }

        const testimonial = await Testimonial.findOneAndUpdate(
            { course: req.params.courseId, user: req.user._id },
            {
                $set: {
                    text,
                    rating: overallRating,
                    overallRating,
                    course: req.params.courseId,
                    user: req.user._id
                },
                $unset: {
                    courseContentRating: '',
                    coursePresentationRating: ''
                }
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        )
            .populate('user', 'firstName lastName username role')
            .populate('course', 'title');

        res.status(201).send({
            testimonial: serializeTestimonial(testimonial)
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.delete('/:courseId/testimonials', auth, authorize('student'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .select('title students instructor assignedTeachers')
            .lean();

        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        if (!canAccessCourseContent({ ...course, _id: req.params.courseId }, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to delete feedback for this course.' });
        }

        const deleted = await Testimonial.findOneAndDelete({
            course: req.params.courseId,
            user: req.user._id
        });

        if (!deleted) {
            return res.status(404).send({ error: 'Feedback not found' });
        }

        res.send({ message: 'Feedback deleted' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

router.delete('/:courseId/testimonials/:testimonialId', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .select('title students instructor assignedTeachers')
            .lean();

        if (!course) {
            return res.status(404).send({ error: 'Course not found' });
        }

        if (!canManageCourse({ ...course, _id: req.params.courseId }, req.user)) {
            return res.status(403).send({ error: 'Access denied. You are not allowed to moderate feedback for this course.' });
        }

        const deleted = await Testimonial.findOneAndDelete({
            _id: req.params.testimonialId,
            course: req.params.courseId
        });

        if (!deleted) {
            return res.status(404).send({ error: 'Feedback not found' });
        }

        res.send({ message: 'Feedback deleted' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Admin/Teacher: Create Course
router.post('/', auth, authorize('admin', 'teacher'), validate(courseSchema), async (req, res) => {
    try {
        const course = new Course({
            ...req.body,
            instructor: req.user._id
        });
        await course.save();
        await createCourseCreatedAnnouncement({ course, actorId: req.user._id });
        // Invalidate cache after creating course
        invalidateCache('GET:/api/courses*');
        res.status(201).send(course);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Teacher: Update Course
router.patch('/:id', auth, authorize('admin', 'teacher'), validate(courseSchema), async (req, res) => {
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
        // Invalidate cache after updating
        invalidateCache(`GET:/api/courses*`);
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
        // Invalidate cache after deleting
        invalidateCache('GET:/api/courses*');
        res.send({ message: 'Course deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin/Teacher: Add Chapter
router.post('/:courseId/chapters', auth, authorize('admin', 'teacher'), validate(chapterSchema), async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).select('instructor assignedTeachers');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to add chapters to this course.' });
        }

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

// Admin/Associated Teacher: Reorder Chapters in a Course
router.patch('/:courseId/chapters/reorder', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { chapterIds } = req.body;
        if (!Array.isArray(chapterIds) || chapterIds.length === 0) {
            return res.status(400).send({ error: 'chapterIds must be a non-empty array' });
        }

        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        const isInstructor = String(course.instructor) === String(req.user._id);
        const isAssigned = Array.isArray(course.assignedTeachers) &&
            course.assignedTeachers.some((teacherId) => String(teacherId) === String(req.user._id));
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isInstructor && !isAssigned) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to reorder chapters for this course.' });
        }

        const existingChapterIds = (course.chapters || []).map((chapterId) => String(chapterId));
        const requestedChapterIds = chapterIds.map((chapterId) => String(chapterId));

        if (existingChapterIds.length !== requestedChapterIds.length) {
            return res.status(400).send({ error: 'Invalid chapter order payload length' });
        }

        const existingSet = new Set(existingChapterIds);
        const requestedSet = new Set(requestedChapterIds);

        if (existingSet.size !== requestedSet.size) {
            return res.status(400).send({ error: 'Invalid chapter order payload' });
        }

        for (const chapterId of requestedSet) {
            if (!existingSet.has(chapterId)) {
                return res.status(400).send({ error: 'Chapter order contains invalid chapter IDs' });
            }
        }

        course.chapters = requestedChapterIds;
        await course.save();

        invalidateCache('GET:/api/courses*');
        res.send({ message: 'Chapter order updated successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Admin/Teacher: Update Chapter
router.patch('/chapters/:id', auth, authorize('admin', 'teacher'), validate(chapterSchema), async (req, res) => {
    try {
        const existingChapter = await Chapter.findById(req.params.id).select('courseId');
        if (!existingChapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(existingChapter.courseId).select('instructor assignedTeachers');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to update this chapter.' });
        }

        const chapter = await Chapter.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                moduleDescriptionPdf: req.body.moduleDescriptionPdf || ''
            },
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
        const chapter = await Chapter.findById(req.params.id).select('courseId');
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(chapter.courseId).select('instructor assignedTeachers');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to delete this chapter.' });
        }

        await Chapter.findByIdAndDelete(req.params.id);
        await Course.findByIdAndUpdate(chapter.courseId, { $pull: { chapters: req.params.id } });
        res.send({ message: 'Chapter deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Admin/Teacher: Add Unit to Chapter
router.post('/chapters/:chapterId/units', auth, authorize('admin', 'teacher'), validate(unitSchema), async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId).select('courseId');
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(chapter.courseId).select('instructor assignedTeachers');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to add units to this chapter.' });
        }

        const payload = {
            ...req.body,
            chapterId: req.params.chapterId
        };

        if (payload.type === 'pdf') {
            payload.title = sanitizePdfUnitTitle(payload.title);
        }

        const unit = new Unit(payload);
        await unit.save();

        await Chapter.findByIdAndUpdate(req.params.chapterId, {
            $push: { units: unit._id }
        });

        res.status(201).send(unit);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin/Associated Teacher: Reorder Units in a Chapter
router.patch('/chapters/:chapterId/units/reorder', auth, authorize('admin', 'teacher'), async (req, res) => {
    try {
        const { unitIds } = req.body;
        if (!Array.isArray(unitIds) || unitIds.length === 0) {
            return res.status(400).send({ error: 'unitIds must be a non-empty array' });
        }

        const chapter = await Chapter.findById(req.params.chapterId);
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(chapter.courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        const isInstructor = String(course.instructor) === String(req.user._id);
        const isAssigned = Array.isArray(course.assignedTeachers) &&
            course.assignedTeachers.some((teacherId) => String(teacherId) === String(req.user._id));
        const isAdmin = req.user.role === 'admin';

        if (!isAdmin && !isInstructor && !isAssigned) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to reorder units for this chapter.' });
        }

        const existingUnitIds = (chapter.units || []).map((unitId) => String(unitId));
        const requestedUnitIds = unitIds.map((unitId) => String(unitId));

        if (existingUnitIds.length !== requestedUnitIds.length) {
            return res.status(400).send({ error: 'Invalid unit order payload length' });
        }

        const existingSet = new Set(existingUnitIds);
        const requestedSet = new Set(requestedUnitIds);

        if (existingSet.size !== requestedSet.size) {
            return res.status(400).send({ error: 'Invalid unit order payload' });
        }

        for (const unitId of requestedSet) {
            if (!existingSet.has(unitId)) {
                return res.status(400).send({ error: 'Unit order contains invalid unit IDs' });
            }
        }

        chapter.units = requestedUnitIds;
        await chapter.save();

        invalidateCache('GET:/api/courses*');
        res.send({ message: 'Unit order updated successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Admin/Teacher: Update Unit
router.patch('/units/:id', auth, authorize('admin', 'teacher'), validate(updateUnitSchema), async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const existingUnit = await Unit.findById(req.params.id).select('chapterId type');
        if (!existingUnit) return res.status(404).send({ error: 'Unit not found' });

        const chapter = await Chapter.findById(existingUnit.chapterId).select('courseId');
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(chapter.courseId).select('instructor assignedTeachers');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to update this unit.' });
        }

        const updatedType = type || existingUnit.type;
        const updatePayload = {};
        if (title !== undefined) {
            updatePayload.title = updatedType === 'pdf' ? sanitizePdfUnitTitle(title) : title;
        }
        if (content !== undefined) {
            updatePayload.content = content;
        }
        if (type !== undefined) {
            updatePayload.type = type;
        }

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            updatePayload,
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
        const unit = await Unit.findById(req.params.id).select('chapterId');
        if (!unit) return res.status(404).send({ error: 'Unit not found' });

        const chapter = await Chapter.findById(unit.chapterId).select('courseId');
        if (!chapter) return res.status(404).send({ error: 'Chapter not found' });

        const course = await Course.findById(chapter.courseId).select('instructor assignedTeachers');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied. You do not have permission to delete this unit.' });
        }

        await Unit.findByIdAndDelete(req.params.id);
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
            return res.status(400).send({ error: 'Already enrolled in this course' });
        }

        // Add to enrolledCourses with 'approved' status (instant enrollment)
        req.user.enrolledCourses.push({
            course: course._id,
            status: 'approved' // Auto-approved for instant access
        });
        await req.user.save();

        // Immediately add student to course
        if (!course.students.includes(req.user._id)) {
            course.students.push(req.user._id);
            await course.save();
        }

        res.send({ message: 'Successfully enrolled in course!' });
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

            await createNotification({
                recipientId: student._id,
                actorId: req.user._id,
                type: 'enrollment_approved',
                title: 'Enrollment Approved',
                message: `Your enrollment in "${course.title}" was approved.`,
                link: `/course/read/${course._id}`,
                metadata: { courseId: course._id }
            });
        } else if (action === 'reject') {
            // Remove from enrolledCourses safely
            student.enrolledCourses = student.enrolledCourses.filter(e => e.course && e.course.toString() !== course._id.toString());

            await createNotification({
                recipientId: student._id,
                actorId: req.user._id,
                type: 'enrollment_rejected',
                title: 'Enrollment Rejected',
                message: `Your enrollment in "${course.title}" was rejected.`,
                link: '/student',
                metadata: { courseId: course._id }
            });
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

        if (!course.instructor) {
            course.instructor = teacherId;
        }

        await course.save();
        res.send({ message: 'Teacher assigned successfully', course });
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Admin: Unassign Teacher from Course
router.delete('/:courseId/assigned-teachers/:teacherId', auth, authorize('admin'), async (req, res) => {
    try {
        const { courseId, teacherId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        const assignedTeacherIds = (course.assignedTeachers || []).map((id) => String(id));
        if (!assignedTeacherIds.includes(String(teacherId))) {
            return res.status(404).send({ error: 'Teacher is not assigned to this course' });
        }

        const remainingAssigned = assignedTeacherIds.filter((id) => id !== String(teacherId));

        // Ensure course keeps a valid primary instructor.
        if (course.instructor && String(course.instructor) === String(teacherId)) {
            if (remainingAssigned.length === 0) {
                return res.status(400).send({
                    error: 'Cannot unassign the primary instructor without assigning another teacher first'
                });
            }
            course.instructor = remainingAssigned[0];
        }

        course.assignedTeachers = remainingAssigned;
        await course.save();

        invalidateCache('GET:/api/courses*');
        res.send({ message: 'Teacher unassigned successfully', course });
    } catch (e) {
        res.status(500).send({ error: e.message });
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
        const course = await Course.findById(req.params.courseId).select('students instructor assignedTeachers').populate('students', 'username');
        if (!course) return res.status(404).send({ error: 'Course not found' });
        if (!canManageCourse(course, req.user)) {
            return res.status(403).send({ error: 'Access denied' });
        }
        res.send(course.students);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Toggle Like on Unit
router.post('/:courseId/unit/:unitId/like', auth, async (req, res) => {
    try {
        const accessResult = await getAccessibleCourseAndUnit(req.params.courseId, req.params.unitId, req.user);
        if (accessResult.error) {
            return res.status(accessResult.error.status).send(accessResult.error.body);
        }

        const { unit } = accessResult;

        // Initialize likes array if it doesn't exist (for existing units)
        if (!unit.likes) {
            unit.likes = [];
        }

        const userId = req.user._id;
        const hasLiked = unit.likes.some(id => id.equals(userId));

        if (hasLiked) {
            // Unlike
            unit.likes = unit.likes.filter(id => !id.equals(userId));
        } else {
            // Like
            unit.likes.push(userId);
        }

        await unit.save();
        res.send({ liked: !hasLiked, likes: unit.likes.length });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Get Likes for Unit
router.get('/:courseId/unit/:unitId/likes', auth, async (req, res) => {
    try {
        const accessResult = await getAccessibleCourseAndUnit(req.params.courseId, req.params.unitId, req.user);
        if (accessResult.error) {
            return res.status(accessResult.error.status).send(accessResult.error.body);
        }

        const { unit } = accessResult;

        // Initialize likes array if it doesn't exist (for existing units)
        if (!unit.likes) {
            unit.likes = [];
        }

        const userId = req.user._id;
        const userLiked = unit.likes.some(id => id.equals(userId));

        res.send({ likes: unit.likes.length, userLiked });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Get comments for a video unit
router.get('/:courseId/unit/:unitId/comments', auth, async (req, res) => {
    try {
        const accessResult = await getAccessibleCourseAndUnit(req.params.courseId, req.params.unitId, req.user);
        if (accessResult.error) {
            return res.status(accessResult.error.status).send(accessResult.error.body);
        }

        const { unit } = accessResult;
        if (unit.type !== 'video') {
            return res.status(400).send({ error: 'Comments are only supported for video units' });
        }

        await unit.populate('comments.user', 'username role');

        const comments = (unit.comments || [])
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((comment) => ({
                _id: comment._id,
                text: comment.text,
                user: comment.user ? {
                    _id: comment.user._id,
                    username: comment.user.username,
                    role: comment.user.role
                } : null,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            }));

        res.send({ comments });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Create comment on a video unit
router.post('/:courseId/unit/:unitId/comments', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const cleanText = typeof text === 'string' ? text.trim() : '';

        if (!cleanText) {
            return res.status(400).send({ error: 'Comment text is required' });
        }
        if (cleanText.length > 1000) {
            return res.status(400).send({ error: 'Comment must be at most 1000 characters' });
        }

        const accessResult = await getAccessibleCourseAndUnit(req.params.courseId, req.params.unitId, req.user);
        if (accessResult.error) {
            return res.status(accessResult.error.status).send(accessResult.error.body);
        }

        const { unit } = accessResult;
        if (unit.type !== 'video') {
            return res.status(400).send({ error: 'Comments are only supported for video units' });
        }

        unit.comments.push({ user: req.user._id, text: cleanText });
        await unit.save();

        await unit.populate('comments.user', 'username role');
        const created = unit.comments[unit.comments.length - 1];

        res.status(201).send({
            comment: {
                _id: created._id,
                text: created.text,
                user: created.user ? {
                    _id: created.user._id,
                    username: created.user.username,
                    role: created.user.role
                } : null,
                createdAt: created.createdAt,
                updatedAt: created.updatedAt
            }
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Edit own comment
router.patch('/:courseId/unit/:unitId/comments/:commentId', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const cleanText = typeof text === 'string' ? text.trim() : '';

        if (!cleanText) {
            return res.status(400).send({ error: 'Comment text is required' });
        }
        if (cleanText.length > 1000) {
            return res.status(400).send({ error: 'Comment must be at most 1000 characters' });
        }

        const accessResult = await getAccessibleCourseAndUnit(req.params.courseId, req.params.unitId, req.user);
        if (accessResult.error) {
            return res.status(accessResult.error.status).send(accessResult.error.body);
        }

        const { unit } = accessResult;
        if (unit.type !== 'video') {
            return res.status(400).send({ error: 'Comments are only supported for video units' });
        }

        const comment = unit.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        if (String(comment.user) !== String(req.user._id)) {
            return res.status(403).send({ error: 'You can only edit your own comments' });
        }

        comment.text = cleanText;
        await unit.save();
        await unit.populate('comments.user', 'username role');

        const updated = unit.comments.id(req.params.commentId);
        res.send({
            comment: {
                _id: updated._id,
                text: updated.text,
                user: updated.user ? {
                    _id: updated.user._id,
                    username: updated.user.username,
                    role: updated.user.role
                } : null,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt
            }
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

// Delete comment (own comment OR admin OR associated teacher)
router.delete('/:courseId/unit/:unitId/comments/:commentId', auth, async (req, res) => {
    try {
        const accessResult = await getAccessibleCourseAndUnit(req.params.courseId, req.params.unitId, req.user);
        if (accessResult.error) {
            return res.status(accessResult.error.status).send(accessResult.error.body);
        }

        const { course, unit } = accessResult;
        if (unit.type !== 'video') {
            return res.status(400).send({ error: 'Comments are only supported for video units' });
        }

        const comment = unit.comments.id(req.params.commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        const isOwner = String(comment.user) === String(req.user._id);
        const isAdmin = req.user.role === 'admin';
        const isAssociatedTeacher = isAssociatedTeacherForCourse(course, req.user);

        if (!isOwner && !isAdmin && !isAssociatedTeacher) {
            return res.status(403).send({ error: 'You do not have permission to delete this comment' });
        }

        unit.comments.pull(req.params.commentId);
        await unit.save();

        res.send({ message: 'Comment deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

module.exports = router;
