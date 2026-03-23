const Announcement = require('../models/Announcement');
const logger = require('./logger');

const createCourseCreatedAnnouncement = async ({ course, actorId }) => {
    if (!course || !actorId) return null;

    try {
        const title = `New Course Added: ${course.title}`;
        const message = `${course.title} is now available on CourseZ. Explore the curriculum and enroll now.`;

        const announcement = await Announcement.create({
            title,
            message,
            tickerText: `New course launched: ${course.title}`,
            type: 'course',
            isTicker: true,
            courseId: course._id,
            createdBy: actorId
        });

        return announcement;
    } catch (error) {
        logger.error('Failed to create course announcement', {
            error: error.message,
            courseId: course?._id,
            actorId
        });
        return null;
    }
};

module.exports = {
    createCourseCreatedAnnouncement
};
