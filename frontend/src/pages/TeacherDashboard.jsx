import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Book, ChevronRight, Layout, Users, X, Calendar, Eye } from 'lucide-react';
import { fetchCourses, createCourse, fetchEnrolledStudents, fetchSettings, fetchEnrollmentRequests, approveEnrollment } from '../api/api';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        if (user) {
            loadCourses();
        }
    }, [user]);

    const loadCourses = async () => {
        try {
            const data = await fetchCourses();
            // Filter courses: Instructor OR Assigned Teacher
            if (user && data) {
                const myCourses = data.filter(c =>
                    (c.instructor && String(c.instructor._id) === String(user._id)) ||
                    (c.assignedTeachers && c.assignedTeachers.some(t => String(t._id) === String(user._id)))
                );
                setCourses(myCourses);
            }
        } catch (err) {
            console.error(err);
        }
    };


    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await createCourse({
                title: courseTitle,
                description: 'New course by teacher',
                completionDate: completionDate // Pass the date from state
            });
            setCourseTitle('');
            setCompletionDate('');
            setShowCourseForm(false);
            loadCourses();
        } catch (err) { alert(err.message); }
    };

    const handleViewStudents = async (courseId) => {
        try {
            const students = await fetchEnrolledStudents(courseId);
            setEnrolledStudents(students);
            setShowStudentsModal(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleViewRequests = async (courseId) => {
        try {
            const reqs = await fetchEnrollmentRequests(courseId);
            setRequests(reqs);
            setShowRequestsModal(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleApproveRequest = async (studentId, action) => {
        try {
            await approveEnrollment(selectedCourse._id, studentId, action);
            // Refresh requests
            const reqs = await fetchEnrollmentRequests(selectedCourse._id);
            setRequests(reqs);
            // Refresh course details (student count might change)
            loadCourses();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="gradient-text">Teacher Studio</h1>
                <button className="btn-accent" onClick={() => setShowCourseForm(true)}>
                    <Plus size={18} /> New Course
                </button>
            </header>


            {showCourseForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleCreateCourse} style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            placeholder="Enter Course Title"
                            style={{ flex: 1 }}
                            value={courseTitle}
                            onChange={e => setCourseTitle(e.target.value)}
                            required
                        />
                        <input
                            type="date"
                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                            value={completionDate}
                            onChange={e => setCompletionDate(e.target.value)}
                        />
                        <button className="btn-primary">Create</button>
                        <button type="button" className="btn-secondary" onClick={() => setShowCourseForm(false)}>Cancel</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Course List */}
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>My Courses</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {courses.map(course => (
                            <div
                                key={course._id}
                                onClick={() => setSelectedCourse(course)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: selectedCourse?._id === course._id ? 'rgba(79, 70, 229, 0.1)' : 'var(--glass)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: selectedCourse?._id === course._id ? '1px solid var(--primary)' : '1px solid transparent'
                                }}
                            >
                                <div>
                                    <span>{course.title}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Teachers: {[
                                            course.instructor?.username?.split('@')[0],
                                            ...(course.assignedTeachers?.map(t => t.username?.split('@')[0]) || [])
                                        ].filter(Boolean).join(', ')}
                                    </div>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Summary */}
                <div className="card">
                    {selectedCourse ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ color: 'var(--text-accent)' }}>{selectedCourse.title} Details</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => navigate(`/course/read/${selectedCourse._id}`)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Eye size={18} /> View Content
                                    </button>
                                    <button
                                        className="btn-accent"
                                        onClick={() => navigate(`/course/edit/${selectedCourse._id}`)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Layout size={18} /> Edit Curriculum
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '1rem', background: 'var(--glass)', borderRadius: '8px', marginTop: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)' }}>{selectedCourse.description}</p>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                                    <div>
                                        <span style={{ color: 'var(--text-accent)', fontWeight: 'bold' }}>{selectedCourse.chapters?.length || 0}</span> Chapters
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--text-accent)', fontWeight: 'bold' }}>{selectedCourse.students?.length || 0}</span> Enrolled Students
                                        <button
                                            className="btn-secondary"
                                            onClick={() => handleViewStudents(selectedCourse._id)}
                                            style={{ marginLeft: '1rem', padding: '4px 8px', fontSize: '0.8rem' }}
                                        >
                                            VIEW STUDENTS
                                        </button>
                                        <button
                                            className="btn-primary"
                                            onClick={() => handleViewRequests(selectedCourse._id)}
                                            style={{ marginLeft: '1rem', padding: '4px 8px', fontSize: '0.8rem' }}
                                        >
                                            REQUESTS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <Book size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Select a course from the left to manage curriculum and view progress.</p>
                        </div>
                    )}
                </div>
            </div>

            {showStudentsModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 className="gradient-text">Enrolled Students</h2>
                            <button onClick={() => setShowStudentsModal(false)} style={{ background: 'transparent', color: 'var(--text-main)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {enrolledStudents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {enrolledStudents.map(student => (
                                    <div key={student._id} style={{
                                        padding: '1rem',
                                        background: 'var(--glass)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ background: 'var(--glass)', padding: '0.8rem', borderRadius: '50%' }}>
                                            <Users size={20} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{student.username.split('@')[0]}</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.username}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No students enrolled yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showRequestsModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 className="gradient-text">Enrollment Requests</h2>
                            <button onClick={() => setShowRequestsModal(false)} style={{ background: 'transparent', color: 'var(--text-main)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {requests.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {requests.map(student => (
                                    <div key={student._id} style={{
                                        padding: '1rem',
                                        background: 'var(--glass)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ background: 'var(--glass)', padding: '0.8rem', borderRadius: '50%' }}>
                                                <Users size={20} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0 }}>{student.username.split('@')[0]}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.username}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleApproveRequest(student._id, 'approve')}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                onClick={() => handleApproveRequest(student._id, 'reject')}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: 'red', color: 'red' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <p>No pending requests.</p>
                            </div>
                        )}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default TeacherDashboard;
