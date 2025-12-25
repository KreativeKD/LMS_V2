import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Book, ChevronRight, Layout, Users, X } from 'lucide-react';
import { fetchCourses, createCourse, fetchEnrolledStudents } from '../api/api';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [courseTitle, setCourseTitle] = useState('');
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [enrolledStudents, setEnrolledStudents] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await fetchCourses();
            setCourses(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await createCourse({ title: courseTitle, description: 'New course by teacher' });
            setCourseTitle('');
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
                                    background: selectedCourse?._id === course._id ? '#333' : '#252525',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    border: selectedCourse?._id === course._id ? '1px solid var(--primary)' : '1px solid transparent'
                                }}
                            >
                                <span>{course.title}</span>
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
                                <h2 style={{ color: 'var(--primary)' }}>{selectedCourse.title} Details</h2>
                                <button
                                    className="btn-accent"
                                    onClick={() => navigate(`/course/edit/${selectedCourse._id}`)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Layout size={18} /> Edit Curriculum
                                </button>
                            </div>

                            <div style={{ padding: '1rem', background: '#252525', borderRadius: '8px', marginTop: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)' }}>{selectedCourse.description}</p>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                                    <div>
                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedCourse.chapters?.length || 0}</span> Chapters
                                    </div>
                                    <div>
                                        <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{selectedCourse.students?.length || 0}</span> Enrolled Students
                                        <button
                                            className="btn-secondary"
                                            onClick={() => handleViewStudents(selectedCourse._id)}
                                            style={{ marginLeft: '1rem', padding: '4px 8px', fontSize: '0.8rem' }}
                                        >
                                            VIEW STUDENTS
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
                            <button onClick={() => setShowStudentsModal(false)} style={{ background: 'transparent', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {enrolledStudents.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {enrolledStudents.map(student => (
                                    <div key={student._id} style={{
                                        padding: '1rem',
                                        background: '#252525',
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
        </div>
    );
};

export default TeacherDashboard;
