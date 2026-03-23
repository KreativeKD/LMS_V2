const normalizeId = (value) => {
    if (!value) return null;
    if (typeof value === 'object' && value._id) return String(value._id);
    return String(value);
};

const COURSE_ACCESS_DURATION_MONTHS = 6;

const isEnrollmentActive = (enrollment) => {
    if (!enrollment || enrollment.status !== 'approved') return false;
    if (!enrollment.enrolledAt) return true;

    const enrolledAt = new Date(enrollment.enrolledAt);
    if (Number.isNaN(enrolledAt.getTime())) return false;

    const expiresAt = new Date(enrolledAt);
    expiresAt.setMonth(expiresAt.getMonth() + COURSE_ACCESS_DURATION_MONTHS);

    return new Date() <= expiresAt;
};

const canAccessCourseContent = (course, user) => {
    if (!course || !user) return false;

    const userId = normalizeId(user._id);
    if (!userId) return false;

    if (user.role === 'admin') return true;

    const instructorId = normalizeId(course.instructor);
    const isInstructor = instructorId === userId;
    const isAssignedTeacher = Array.isArray(course.assignedTeachers) &&
        course.assignedTeachers.some((teacher) => normalizeId(teacher) === userId);

    if (user.role === 'teacher') {
        return isInstructor || isAssignedTeacher;
    }

    if (user.role === 'student') {
        const hasActiveEnrollment = Array.isArray(user.enrolledCourses) &&
            user.enrolledCourses.some((enrollment) => {
                if (!enrollment) return false;
                if (normalizeId(enrollment.course) !== normalizeId(course._id)) return false;
                return isEnrollmentActive(enrollment);
            });

        return hasActiveEnrollment;
    }

    return false;
};

module.exports = {
    canAccessCourseContent,
    normalizeId
};
