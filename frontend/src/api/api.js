const API_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }
    return response.json();
};

export const registerStudent = async (name, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
    }
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

export const fetchCourses = async () => {
    const response = await fetch(`${API_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
};

export const createCourse = async (courseData) => {
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
};

export const updateCourse = async (courseId, courseData) => {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to update course');
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
    const response = await fetch(`${API_URL}/quizzes`);
    if (!response.ok) throw new Error('Failed to fetch quizzes');
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
    const response = await fetch(`${API_URL}/auth/admin/settings`, {
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
