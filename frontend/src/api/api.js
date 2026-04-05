import { fetchWithRetry, safeJsonParse } from './interceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const loginUser = async (username, password) => {
    const response = await fetchWithRetry(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        const data = await safeJsonParse(response);
        const detailsText = Array.isArray(data?.details) ? data.details.join('. ') : null;
        const error = new Error(detailsText || data?.error || 'Login failed');
        error.response = { status: response.status, data };
        throw error;
    }

    return response.json();
};

export const registerStudent = async (data) => {
    const response = await fetchWithRetry(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const responseData = await safeJsonParse(response);
        const detailsText = Array.isArray(responseData?.details) ? responseData.details.join('. ') : null;
        const error = new Error(detailsText || responseData?.error || 'Registration failed');
        error.response = { status: response.status, data: responseData };
        throw error;
    }

    return response.json();
};

export const updateStudentAdmin = async (studentId, data) => {
    const response = await fetch(`${API_URL}/auth/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
};

export const addTeacher = async (name, password) => {
    const response = await fetch(`${API_URL}/auth/admin/add-teacher`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, password })
    });
    if (!response.ok) throw new Error('Failed to add teacher');
    return response.json();
};

export const deleteTeacher = async (teacherId) => {
    const response = await fetch(`${API_URL}/auth/admin/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete teacher');
    return response.json();
};

export const fetchCourses = async (page = 1, limit = 20) => {
    const response = await fetchWithRetry(`${API_URL}/courses?page=${page}&limit=${limit}`);

    if (!response.ok) {
        const data = await safeJsonParse(response);
        const error = new Error(data?.error || 'Failed to fetch courses');
        error.response = { status: response.status, data };
        throw error;
    }

    return response.json();
};

export const createCourse = async (courseData) => {
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(courseData)
    });

    if (!response.ok) {
        const data = await safeJsonParse(response);
        const detailsText = Array.isArray(data?.details) ? data.details.join('. ') : null;
        const error = new Error(detailsText || data?.error || 'Failed to create course');
        error.response = { status: response.status, data };
        throw error;
    }

    return response.json();
};

export const updateCourse = async (courseId, courseData) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(courseData)
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        const detailsText = Array.isArray(data?.details) ? data.details.join('. ') : null;
        const error = new Error(detailsText || data?.error || 'Failed to update course');
        error.response = { status: response.status, data };
        throw error;
    }
    return response.json();
};

export const deleteCourse = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete course');
};

export const addChapter = async (courseId, chapterData) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/chapters`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(chapterData)
    });
    if (!response.ok) throw new Error('Failed to add chapter');
    return response.json();
};

export const reorderChapters = async (courseId, chapterIds) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/chapters/reorder`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ chapterIds })
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to reorder chapters');
    }
    return response.json();
};

export const addUnit = async (chapterId, unitData) => {
    const response = await fetch(`${API_URL}/courses/chapters/${chapterId}/units`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(unitData)
    });
    if (!response.ok) throw new Error('Failed to add unit');
    return response.json();
};

export const enrollInCourse = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to enroll');
    }
    return response.json();
};

export const fetchQuizzes = async () => {
    const response = await fetch(`${API_URL}/quizzes`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch quizzes');
    return response.json();
};

export const reorderUnits = async (chapterId, unitIds) => {
    const response = await fetch(`${API_URL}/courses/chapters/${chapterId}/units/reorder`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ unitIds })
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to reorder units');
    }
    return response.json();
};

export const fetchQuizById = async (quizId) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch quiz');
    return response.json();
};

export const createQuiz = async (quizData) => {
    const response = await fetch(`${API_URL}/quizzes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(quizData)
    });
    if (!response.ok) throw new Error('Failed to create quiz');
    return response.json();
};

export const updateQuiz = async (quizId, quizData) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(quizData)
    });
    if (!response.ok) throw new Error('Failed to update quiz');
    return response.json();
};

export const deleteQuiz = async (quizId) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete quiz');
};

export const fetchTeachers = async () => {
    const response = await fetch(`${API_URL}/auth/admin/teachers`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
};

export const updateChapter = async (chapterId, data) => {
    const response = await fetch(`${API_URL}/courses/chapters/${chapterId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update chapter');
    return response.json();
};

export const deleteChapter = async (chapterId) => {
    const response = await fetch(`${API_URL}/courses/chapters/${chapterId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete chapter');
};

export const updateUnit = async (unitId, data) => {
    const response = await fetch(`${API_URL}/courses/units/${unitId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update unit');
    return response.json();
};

export const deleteUnit = async (unitId) => {
    const response = await fetch(`${API_URL}/courses/units/${unitId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete unit');
};

export const fetchEnrolledStudents = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/students`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch enrolled students');
    return response.json();
};

export const fetchStudents = async () => {
    const response = await fetch(`${API_URL}/auth/admin/students`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
};

export const deleteStudent = async (studentId) => {
    const response = await fetch(`${API_URL}/auth/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete student');
    return response.json();
};

export const fetchCourse = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
};

// Fetch course with full chapters and units data (for editing/viewing)
export const fetchCourseFull = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/full`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
};

export const fetchCourseTestimonials = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/testimonials`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to fetch feedback');
    }
    return response.json();
};

export const createCourseTestimonial = async (courseId, payload) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/testimonials`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to save feedback');
    }
    return response.json();
};

export const deleteCourseTestimonial = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/testimonials`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to delete feedback');
    }
    return response.json();
};

export const deleteCourseFeedbackById = async (courseId, feedbackId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/testimonials/${feedbackId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to delete feedback');
    }
    return response.json();
};

export const requestAccess = async (firstName, lastName) => {
    const response = await fetch(`${API_URL}/auth/request-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
    }
    return response.json();
};

export const checkStatus = async (firstName, lastName) => {
    const response = await fetch(`${API_URL}/auth/check-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Check status failed');
    }
    return response.json();
};

export const completeRegistration = async (data) => {
    const response = await fetch(`${API_URL}/auth/complete-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }
    return response.json();
};

export const fetchRegistrationRequests = async () => {
    const response = await fetch(`${API_URL}/auth/admin/registration-requests`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
};

export const approveRequest = async (id) => {
    const response = await fetch(`${API_URL}/auth/admin/approve-request/${id}`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to approve request');
    return response.json();
};

export const fetchSettings = async () => {
    const response = await fetch(`${API_URL}/auth/settings`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
};

export const updateSettings = async (settings) => {
    const response = await fetch(`${API_URL}/auth/admin/settings`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
};

export const unfreezeStudent = async (id) => {
    const response = await fetch(`${API_URL}/auth/admin/unfreeze-student/${id}`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to unfreeze student');
    return response.json();
};

export const freezeStudent = async (id) => {
    const response = await fetch(`${API_URL}/auth/admin/freeze-student/${id}`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to freeze student');
    return response.json();
};

export const fetchEnrollmentRequests = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/requests`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch enrollment requests');
    return response.json();
};

export const approveEnrollment = async (courseId, studentId, action) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/approve-enrollment`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ studentId, action })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update enrollment');
    }
    return response.json();
};

export const assignTeacher = async (courseId, teacherId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/assign-teacher`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ teacherId })
    });
    if (!response.ok) throw new Error('Failed to assign teacher');
    return response.json();
};

export const unassignTeacher = async (courseId, teacherId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/assigned-teachers/${teacherId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to unassign teacher');
    }
    return response.json();
};

export const fetchCurrentUser = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        const error = new Error(data?.error || 'Failed to fetch user');
        error.response = { status: response.status, data };
        throw error;
    }
    return response.json();
};

export const updateUserProfile = async (data) => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await safeJsonParse(response);
        throw new Error(errorData?.error || 'Failed to update profile');
    }
    return response.json();
};

export const fetchMyInstructorProfile = async () => {
    const response = await fetch(`${API_URL}/auth/me/instructor-profile`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to fetch instructor profile');
    }
    return response.json();
};

export const updateMyInstructorProfile = async (data) => {
    const response = await fetch(`${API_URL}/auth/me/instructor-profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });

    const responseData = await safeJsonParse(response);
    if (!response.ok) {
        const error = new Error(responseData?.error || 'Failed to update instructor profile');
        error.profile = responseData?.profile;
        throw error;
    }

    return responseData;
};

// --- Public Data API ---

export const fetchPublicProfessors = async () => {
    const response = await fetch(`${API_URL}/public/professors`);
    if (!response.ok) throw new Error('Failed to fetch professors');
    return response.json();
};

export const createProfessor = async (data) => {
    const response = await fetch(`${API_URL}/public/professors`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create professor');
    return response.json();
};

export const updateProfessor = async (id, data) => {
    const response = await fetch(`${API_URL}/public/professors/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update professor');
    return response.json();
};

export const deleteProfessor = async (id) => {
    const response = await fetch(`${API_URL}/public/professors/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete professor');
    return response.json();
};

export const fetchAcademicCourses = async () => {
    const response = await fetch(`${API_URL}/public/academic-courses`);
    if (!response.ok) throw new Error('Failed to fetch academic courses');
    return response.json();
};

export const createAcademicCourse = async (data) => {
    const response = await fetch(`${API_URL}/public/academic-courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create academic course');
    return response.json();
};

export const updateAcademicCourse = async (id, data) => {
    const response = await fetch(`${API_URL}/public/academic-courses/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update academic course');
    return response.json();
};

export const deleteAcademicCourse = async (id) => {
    const response = await fetch(`${API_URL}/public/academic-courses/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete academic course');
    return response.json();
};

export const toggleHiddenContent = async (courseId, contentId) => {
    const response = await fetch(`${API_URL}/auth/toggle-hidden-content`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ courseId, contentId })
    });
    if (!response.ok) throw new Error('Failed to toggle content visibility');
    return response.json();
};

export const likeUnit = async (courseId, unitId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/unit/${unitId}/like`, {
        method: 'POST',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
};

export const getLikes = async (courseId, unitId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/unit/${unitId}/likes`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch likes');
    return response.json();
};

export const fetchPublicAnnouncements = async (limit = 8) => {
    const response = await fetch(`${API_URL}/public/announcements?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return response.json();
};

export const fetchPublicTicker = async (limit = 12) => {
    const response = await fetch(`${API_URL}/public/ticker?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch ticker updates');
    return response.json();
};

export const fetchPublicStats = async () => {
    const response = await fetch(`${API_URL}/public/stats`);
    if (!response.ok) throw new Error('Failed to fetch public stats');
    return response.json();
};

export const fetchPublicTestimonials = async (limit = 3) => {
    const response = await fetch(`${API_URL}/public/testimonials?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return response.json();
};

export const fetchMyPublicTestimonial = async () => {
    const response = await fetch(`${API_URL}/public/testimonials/me`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to fetch your testimonial');
    }
    return response.json();
};

export const createPublicTestimonial = async (payload) => {
    const response = await fetch(`${API_URL}/public/testimonials`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to submit testimonial');
    }
    return response.json();
};

export const fetchAdminTestimonials = async () => {
    const response = await fetch(`${API_URL}/public/admin/testimonials`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to fetch testimonial requests');
    }
    return response.json();
};

export const approveAdminTestimonial = async (testimonialId) => {
    const response = await fetch(`${API_URL}/public/admin/testimonials/${testimonialId}/approve`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to approve testimonial');
    }
    return response.json();
};

export const rejectAdminTestimonial = async (testimonialId) => {
    const response = await fetch(`${API_URL}/public/admin/testimonials/${testimonialId}/reject`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to reject testimonial');
    }
    return response.json();
};

export const deleteAdminTestimonial = async (testimonialId) => {
    const response = await fetch(`${API_URL}/public/admin/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const data = await safeJsonParse(response);
        throw new Error(data?.error || 'Failed to delete testimonial');
    }
    return response.json();
};

export const fetchAdminAnnouncements = async () => {
    const response = await fetch(`${API_URL}/announcements`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch announcements');
    return response.json();
};

export const createAnnouncement = async (data) => {
    const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const parsed = await safeJsonParse(response);
        throw new Error(parsed?.error || 'Failed to create announcement');
    }
    return response.json();
};

export const updateAnnouncement = async (id, data) => {
    const response = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const parsed = await safeJsonParse(response);
        throw new Error(parsed?.error || 'Failed to update announcement');
    }
    return response.json();
};

export const deleteAnnouncement = async (id) => {
    const response = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) {
        const parsed = await safeJsonParse(response);
        throw new Error(parsed?.error || 'Failed to delete announcement');
    }
    return response.json();
};

export const fetchUnitComments = async (courseId, unitId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/unit/${unitId}/comments`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
};

export const createUnitComment = async (courseId, unitId, text) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/unit/${unitId}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
};

export const updateUnitComment = async (courseId, unitId, commentId, text) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/unit/${unitId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('Failed to update comment');
    return response.json();
};

export const deleteUnitComment = async (courseId, unitId, commentId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/unit/${unitId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete comment');
    return response.json();
};

// Lazy Loading APIs - Fetch chapters only when needed
export const fetchChapters = async (courseId) => {
    const response = await fetch(`${API_URL}/courses/${courseId}/chapters`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch chapters');
    return response.json();
};

// Lazy Loading APIs - Fetch units for a chapter only when expanded
export const fetchChapterUnits = async (chapterId) => {
    const response = await fetch(`${API_URL}/courses/chapters/${chapterId}/units`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch units');
    return response.json();
};

// Password Reset APIs
export const fetchPasswordResetRequests = async () => {
    const response = await fetch(`${API_URL}/auth/admin/password-reset-requests`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch password reset requests');
    return response.json();
};

export const approvePasswordResetRequest = async (requestId) => {
    const response = await fetch(`${API_URL}/auth/admin/password-reset-requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to approve password reset request');
    return response.json();
};

export const rejectPasswordResetRequest = async (requestId) => {
    const response = await fetch(`${API_URL}/auth/admin/password-reset-requests/${requestId}/reject`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to reject password reset request');
    return response.json();
};

export const deletePasswordResetRequest = async (requestId) => {
    const response = await fetch(`${API_URL}/auth/admin/password-reset-requests/${requestId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete password reset request');
    return response.json();
};

export const requestPasswordReset = async (username) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });

    const data = await safeJsonParse(response);
    if (!response.ok) {
        const error = new Error(data?.error || 'Failed to submit request');
        error.response = { status: response.status, data };
        throw error;
    }

    return data;
};

export const fetchPasswordResetStatusByUsername = async (username) => {
    const response = await fetch(`${API_URL}/auth/password-reset-status/${encodeURIComponent(username)}`);

    const data = await safeJsonParse(response);
    if (!response.ok) {
        const error = new Error(data?.error || 'Failed to check status');
        error.response = { status: response.status, data };
        throw error;
    }

    return data;
};

export const submitPasswordReset = async ({ username, newPassword, requestId }) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword, requestId })
    });

    const data = await safeJsonParse(response);
    if (!response.ok) {
        const error = new Error(data?.error || 'Failed to reset password');
        error.response = { status: response.status, data };
        throw error;
    }

    return data;
};

// Notification APIs
export const fetchNotifications = async (limit = 15) => {
    const response = await fetch(`${API_URL}/notifications?limit=${limit}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
};

export const fetchUnreadNotificationCount = async () => {
    const response = await fetch(`${API_URL}/notifications/unread-count`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch unread count');
    return response.json();
};

export const markNotificationRead = async (notificationId) => {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
};

export const markAllNotificationsRead = async () => {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return response.json();
};

export const deleteNotification = async (notificationId) => {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete notification');
    return response.json();
};
