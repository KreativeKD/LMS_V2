import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Book, Trash2, Edit, X, Layout, User, Eye, CheckCircle, Settings, Calendar } from 'lucide-react';
import { fetchCourses, createCourse, deleteCourse, addTeacher, fetchTeachers, deleteTeacher, updateCourse, fetchEnrolledStudents, fetchStudents, deleteStudent, fetchRegistrationRequests, approveRequest, fetchSettings, updateSettings, unfreezeStudent } from '../api/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [view, setView] = useState('courses'); // 'courses', 'teachers', 'students', 'requests', 'settings'
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('course'); // 'course' or 'teacher'

    // Form States
    const [courseForm, setCourseForm] = useState({ title: '', description: '' });
    const [teacherForm, setTeacherForm] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [enrolledStudents, setEnrolledStudents] = useState([]);

    // New States
    const [requests, setRequests] = useState([]);
    const [semesterDate, setSemesterDate] = useState('');

    useEffect(() => {
        loadCourses();
        loadTeachers();
        loadStudents();
        loadRequests();
        loadSettings();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await fetchRegistrationRequests();
            setRequests(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadSettings = async () => {
        try {
            const data = await fetchSettings();
            if (data.semesterCompletionDate) {
                // Format for input type="date"
                setSemesterDate(new Date(data.semesterCompletionDate).toISOString().split('T')[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await fetchCourses();
            setCourses(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadTeachers = async () => {
        try {
            const data = await fetchTeachers();
            setTeachers(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadStudents = async () => {
        try {
            const data = await fetchStudents();
            setStudents(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCourse(courseForm);
            setCourseForm({ title: '', description: '' });
            setShowModal(false);
            loadCourses();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addTeacher(teacherForm.name, teacherForm.password);
            setTeacherForm({ name: '', password: '' });
            setShowModal(false);
            alert('Teacher added successfully!');
            loadTeachers();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this course?')) {
            try {
                await deleteCourse(id);
                loadCourses();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleDeleteTeacher = async (id) => {
        if (window.confirm('Delete this teacher? They will no longer be able to log in.')) {
            try {
                await deleteTeacher(id);
                loadTeachers();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleDeleteStudent = async (id) => {
        if (window.confirm('Delete this student account? This action cannot be undone.')) {
            try {
                await deleteStudent(id);
                loadStudents();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveRequest(id);
            loadRequests();
            alert('Student approved!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await updateSettings({ semesterCompletionDate: semesterDate });
            alert('Settings updated successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUnfreeze = async (id) => {
        if (window.confirm('Unfreeze this student account? They will be able to login even if the semester is over.')) {
            try {
                await unfreezeStudent(id);
                loadStudents();
                alert('Student unfrozen successfully');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setCourseForm({ title: course.title, description: course.description });
        setModalType('course');
        setShowModal(true);
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateCourse(editingCourse._id, courseForm);
            setCourseForm({ title: '', description: '' });
            setEditingCourse(null);
            setShowModal(false);
            loadCourses();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
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
                <h1 className="gradient-text">Admin Control Center</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={view === 'courses' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setView('courses')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Book size={18} /> Courses
                    </button>
                    <button
                        className={view === 'teachers' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setView('teachers')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Users size={18} /> Teachers
                    </button>
                    <button
                        className={view === 'students' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setView('students')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Users size={18} /> Students
                    </button>
                    <button
                        className={view === 'requests' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setView('requests')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}
                    >
                        <User size={18} /> Requests
                        {requests.length > 0 && (
                            <span style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', fontSize: '0.7rem', borderRadius: '50%', padding: '2px 6px' }}>
                                {requests.length}
                            </span>
                        )}
                    </button>
                    <button
                        className={view === 'settings' ? 'btn-primary' : 'btn-secondary'}
                        onClick={() => setView('settings')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Settings size={18} /> Settings
                    </button>
                    {view !== 'students' && (
                        <button
                            className="btn-accent"
                            onClick={() => {
                                setModalType(view === 'courses' ? 'course' : 'teacher');
                                setShowModal(true);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={18} /> {view === 'courses' ? 'Add Course' : 'Add Teacher'}
                        </button>
                    )}
                </div>
            </header>

            {view === 'courses' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {courses.map(course => (
                        <div key={course._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{course.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    {course.description}
                                </p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => handleEditCourse(course)}
                                    title="Edit Course Details"
                                    style={{ background: '#333', color: 'var(--primary)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => navigate(`/course/read/${course._id}`)}
                                    title="View Content"
                                    style={{ background: '#333', color: 'var(--text-main)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Eye size={16} /> Read
                                </button>
                                <button
                                    onClick={() => handleViewStudents(course._id)}
                                    title="View Students"
                                    style={{ background: '#333', color: 'var(--secondary)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Users size={16} /> Students
                                </button>
                                <button
                                    onClick={() => navigate(`/course/edit/${course._id}`)}
                                    title="Edit Curriculum"
                                    style={{ background: '#333', color: 'var(--accent)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Layout size={16} /> Edit Curriculum
                                </button>
                                <button
                                    onClick={() => handleDelete(course._id)}
                                    style={{ background: '#333', color: '#ff4d4d', padding: '8px' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && <p className="read-the-docs">No courses found. Start by creating one!</p>}
                </div>
            ) : view === 'teachers' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {teachers.map(teacher => (
                        <div key={teacher._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '50%' }}>
                                    <User size={24} color="var(--primary)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{teacher.username?.split('@')[0] || 'Unknown'}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{teacher.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteTeacher(teacher._id)}
                                style={{ background: 'transparent', color: '#ff4d4d', padding: '8px' }}
                                title="Delete teacher"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {teachers.length === 0 && (
                        <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                            <Users size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                            <h2>No Teachers Registered</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                                Use the "Add Teacher" button above to register your faculty.
                            </p>
                        </div>
                    )}
                </div>
            ) : view === 'requests' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 className="gradient-text">Pending Registration Requests</h2>
                    {requests.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No pending requests.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {requests.map(req => (
                                <div key={req._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{req.firstName} {req.lastName}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requested: {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleApprove(req._id)}
                                        style={{ background: '#22c55e', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : view === 'settings' ? (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 className="gradient-text" style={{ marginBottom: '1.5rem' }}>System Settings</h2>
                    <form onSubmit={handleUpdateSettings}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Semester Completion Date</label>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                    After this date, student logins will be automatically frozen.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input
                                        type="date"
                                        value={semesterDate}
                                        onChange={e => setSemesterDate(e.target.value)}
                                        style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'white' }}
                                    />
                                    <button className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                                        Save Date
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {students.map(student => (
                        <div key={student._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '50%' }}>
                                    <User size={24} color="var(--accent)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{student.username?.split('@')[0] || 'Student'}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.username}</p>
                                    {student.isFrozen && <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>[FROZEN]</span>}
                                    {student.unfrozenByAdmin && <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 'bold' }}>[UNFROZEN BY ADMIN]</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => handleUnfreeze(student._id)}
                                    style={{ background: '#333', color: '#60a5fa', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    title="Unfreeze Account"
                                >
                                    Unfreeze
                                </button>
                                <button
                                    onClick={() => handleDeleteStudent(student._id)}
                                    style={{ background: '#333', color: '#ff4d4d', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    title="Delete student"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && (
                        <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                            <Users size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                            <h2>No Students Registered</h2>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                                Students can register themselves or you can add them.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="gradient-text">
                                {modalType === 'course' ? (editingCourse ? 'Edit Course' : 'Create New Course') : 'Add Teacher Account'}
                            </h2>
                            <button onClick={() => { setShowModal(false); setEditingCourse(null); setCourseForm({ title: '', description: '' }); }} style={{ background: 'transparent', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={modalType === 'course' ? (editingCourse ? handleUpdateCourse : handleCreateCourse) : handleAddTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {modalType === 'course' ? (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Course Title</label>
                                        <input
                                            placeholder="e.g. Modern Web Development"
                                            value={courseForm.title}
                                            onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
                                        <textarea
                                            placeholder="What will students learn?"
                                            style={{ background: '#18181b', color: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '120px', outline: 'none' }}
                                            value={courseForm.description}
                                            onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                                        <input
                                            placeholder="e.g. Sarah Johnson"
                                            value={teacherForm.name}
                                            onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                                        <input
                                            type="password"
                                            placeholder="Set a secure password"
                                            value={teacherForm.password}
                                            onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                                            required
                                        />
                                        <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.5rem' }}>
                                            Teacher can login using: <strong>{teacherForm.name || 'name'}@teacher</strong>
                                        </p>
                                    </div>
                                </>
                            )}
                            <button className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }} disabled={loading}>
                                {loading ? 'Processing...' : (modalType === 'course' && editingCourse ? 'Update Course' : 'Save Changes')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

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

export default AdminDashboard;
