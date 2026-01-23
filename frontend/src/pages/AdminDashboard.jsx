import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Book, Trash2, Edit, X, Layout, User, Eye, CheckCircle, Settings, Calendar } from 'lucide-react';
import { fetchCourses, createCourse, deleteCourse, addTeacher, fetchTeachers, deleteTeacher, updateCourse, fetchEnrolledStudents, fetchStudents, deleteStudent, fetchRegistrationRequests, approveRequest, fetchSettings, updateSettings, unfreezeStudent, freezeStudent, assignTeacher, fetchEnrollmentRequests, approveEnrollment, fetchPublicProfessors, createProfessor, updateProfessor, deleteProfessor, fetchAcademicCourses, createAcademicCourse, updateAcademicCourse, deleteAcademicCourse, updateStudentAdmin } from '../api/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [view, setView] = useState('courses'); // 'courses', 'teachers', 'students', 'requests'
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('course'); // 'course' or 'teacher'

    // Form States
    const [courseForm, setCourseForm] = useState({ title: '', description: '', completionDate: '' });
    const [teacherForm, setTeacherForm] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [showCourseRequestsModal, setShowCourseRequestsModal] = useState(false);
    const [courseRequests, setCourseRequests] = useState([]);
    const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    // New States
    const [requests, setRequests] = useState([]);
    const [semesterDate, setSemesterDate] = useState('');
    const [publicProfessors, setPublicProfessors] = useState([]);
    const [publicCourses, setPublicCourses] = useState([]);
    const [profForm, setProfForm] = useState({ name: '', designation: '', dept: '', institution: '' });
    const [academicCourseForm, setAcademicCourseForm] = useState({ title: '', description: '', professor: '', duration: '', level: '', students: '', icon: 'BookOpen', chapters: 7, branch: 'EXTC' });
    const [editingProf, setEditingProf] = useState(null);
    const [editingAcademicCourse, setEditingAcademicCourse] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', country: '', isFrozen: false });

    useEffect(() => {
        loadCourses();
        loadTeachers();
        loadStudents();
        loadRequests();
        loadRequests();
        loadPublicData();
    }, []);

    const loadPublicData = async () => {
        try {
            const profs = await fetchPublicProfessors();
            const courses = await fetchAcademicCourses();
            setPublicProfessors(profs);
            setPublicCourses(courses);
        } catch (err) {
            console.error(err);
        }
    };

    const loadRequests = async () => {
        try {
            const data = await fetchRegistrationRequests();
            setRequests(data || []);
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
            await createCourse(courseForm);
            setCourseForm({ title: '', description: '', completionDate: '' });
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

    const handleFreeze = async (id) => {
        if (window.confirm('Freeze this student account? They will no longer be able to login.')) {
            try {
                await freezeStudent(id);
                loadStudents();
                alert('Student frozen successfully');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setCourseForm({
            title: course.title,
            description: course.description,
            completionDate: course.completionDate ? new Date(course.completionDate).toISOString().split('T')[0] : ''
        });
        setModalType('course');
        setShowModal(true);
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateCourse(editingCourse._id, courseForm);
            await updateCourse(editingCourse._id, courseForm);
            setCourseForm({ title: '', description: '', completionDate: '' });
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

    const handleViewCourseRequests = async (course) => {
        try {
            setEditingCourse(course);
            const reqs = await fetchEnrollmentRequests(course._id);
            setCourseRequests(reqs);
            setShowCourseRequestsModal(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleApproveEnrollment = async (studentId, action) => {
        try {
            await approveEnrollment(editingCourse._id, studentId, action);
            const reqs = await fetchEnrollmentRequests(editingCourse._id);
            setCourseRequests(reqs);
            loadCourses();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleOpenAssignTeacher = (course) => {
        setEditingCourse(course);
        setShowAssignTeacherModal(true);
    };

    const handleAssignTeacher = async (e) => {
        e.preventDefault();
        try {
            await assignTeacher(editingCourse._id, selectedTeacherId);
            alert('Teacher assigned successfully');
            setShowAssignTeacherModal(false);
            loadCourses();
        } catch (err) {
            alert(err.message);
        }
    };

    // Public Data Handlers
    const handleSaveProfessor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProf) {
                await updateProfessor(editingProf._id, profForm);
            } else {
                await createProfessor(profForm);
            }
            setProfForm({ name: '', designation: '', dept: '', institution: '' });
            setEditingProf(null);
            setShowModal(false);
            loadPublicData();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProf = async (id) => {
        if (window.confirm('Delete this professor?')) {
            try {
                await deleteProfessor(id);
                loadPublicData();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleSaveAcademicCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingAcademicCourse) {
                await updateAcademicCourse(editingAcademicCourse._id, academicCourseForm);
            } else {
                await createAcademicCourse(academicCourseForm);
            }
            setAcademicCourseForm({ title: '', description: '', professor: '', duration: '', level: '', students: '', icon: 'BookOpen', chapters: 7, branch: 'EXTC' });
            setEditingAcademicCourse(null);
            setShowModal(false);
            loadPublicData();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setStudentForm({
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.email || '',
            phone: student.phone || '',
            city: student.city || '',
            country: student.country || '',
            isFrozen: student.isFrozen || false
        });
        setModalType('student');
        setShowModal(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateStudentAdmin(editingStudent._id, studentForm);
            setStudentForm({ firstName: '', lastName: '', email: '', phone: '', city: '', country: '', isFrozen: false });
            setEditingStudent(null);
            setShowModal(false);
            loadStudents();
            alert('Student details updated successfully.');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: 'var(--background)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--border)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'sticky',
                top: '80px',
                height: 'calc(100vh - 80px)',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Menu</h3>
                </div>

                <button
                    className={view === 'courses' ? 'btn-sidebar active' : 'btn-sidebar'}
                    onClick={() => setView('courses')}
                    style={sidebarBtnStyle(view === 'courses')}
                >
                    <Book size={20} /> Courses
                </button>
                <button
                    className={view === 'teachers' ? 'btn-sidebar active' : 'btn-sidebar'}
                    onClick={() => setView('teachers')}
                    style={sidebarBtnStyle(view === 'teachers')}
                >
                    <Users size={20} /> Teachers
                </button>
                <button
                    className={view === 'students' ? 'btn-sidebar active' : 'btn-sidebar'}
                    onClick={() => setView('students')}
                    style={sidebarBtnStyle(view === 'students')}
                >
                    <Users size={20} /> Students
                </button>
                <button
                    className={view === 'requests' ? 'btn-sidebar active' : 'btn-sidebar'}
                    onClick={() => setView('requests')}
                    style={sidebarBtnStyle(view === 'requests')}
                >
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <User size={20} /> Requests
                        {requests.length > 0 && (
                            <span style={{
                                background: '#ef4444',
                                color: 'white',
                                fontSize: '0.7rem',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {requests.length}
                            </span>
                        )}
                    </div>
                </button>

                <div style={{ marginTop: '2rem', padding: '0 1rem' }}>
                    <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Public Portal</h3>
                </div>

                <button
                    className={view === 'faculty' ? 'btn-sidebar active' : 'btn-sidebar'}
                    onClick={() => setView('faculty')}
                    style={sidebarBtnStyle(view === 'faculty')}
                >
                    <Users size={20} /> Faculty
                </button>
                <button
                    className={view === 'academic-courses' ? 'btn-sidebar active' : 'btn-sidebar'}
                    onClick={() => setView('academic-courses')}
                    style={sidebarBtnStyle(view === 'academic-courses')}
                >
                    <Book size={20} /> Public Courses
                </button>

                <div style={{ marginTop: 'auto', padding: '1rem' }}>
                    <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged in as</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Administrator</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem 3rem', maxWidth: '1400px' }}>
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Control Centre</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage your institution's courses, faculty, and students.</p>
                    </div>

                    {view !== 'students' && view !== 'requests' && (
                        <button
                            className="btn-primary"
                            onClick={() => {
                                if (view === 'courses') setModalType('course');
                                else if (view === 'teachers') setModalType('teacher');
                                else if (view === 'faculty') setModalType('faculty');
                                else if (view === 'academic-courses') setModalType('academic-course');
                                setShowModal(true);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem', borderRadius: '14px' }}
                        >
                            <Plus size={20} /> {
                                view === 'courses' ? 'Add Course' :
                                    view === 'teachers' ? 'Add Teacher' :
                                        view === 'faculty' ? 'Add Faculty' : 'Add Public Course'
                            }
                        </button>
                    )}
                </header>

                {view === 'courses' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {courses.map(course => (
                            <div key={course._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-accent)' }}>{course.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                        {course.description}
                                    </p>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'var(--glass)', padding: '0.5rem', borderRadius: '4px' }}>
                                        <strong>Teachers: </strong>
                                        {[
                                            course.instructor?.username?.split('@')[0],
                                            ...(course.assignedTeachers?.map(t => t.username?.split('@')[0]) || [])
                                        ].filter(Boolean).join(', ')}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <strong>Ends: </strong>
                                        {course.completionDate ? new Date(course.completionDate).toLocaleDateString() : 'No date set'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => handleEditCourse(course)}
                                        title="Edit Course Details"
                                        style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Edit size={10} /> Edit
                                    </button>
                                    <button
                                        onClick={() => navigate(`/course/read/${course._id}`)}
                                        title="View Content"
                                        style={{ background: 'var(--glass)', color: 'var(--text-main)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Eye size={16} /> Read
                                    </button>
                                    <button
                                        onClick={() => handleViewStudents(course._id)}
                                        title="View Students"
                                        style={{ background: 'var(--glass)', color: 'var(--text-main)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Users size={16} /> Students
                                    </button>
                                    <button
                                        onClick={() => navigate(`/course/edit/${course._id}`)}
                                        title="Edit Curriculum"
                                        style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <Layout size={16} /> Edit Curriculum
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        style={{ background: 'var(--glass)', color: '#ff4d4d', padding: '8px' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={() => handleOpenAssignTeacher(course)}
                                        style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px', fontSize: '0.8rem' }}
                                    >
                                        Assign Teacher
                                    </button>
                                    <button
                                        onClick={() => handleViewCourseRequests(course)}
                                        style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px', fontSize: '0.8rem' }}
                                    >
                                        Enrollments
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
                ) : view === 'students' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {students.sort((a, b) => (a.isFrozen === b.isFrozen) ? 0 : a.isFrozen ? -1 : 1).map(student => {
                            // Calculate Effective Freeze State
                            const isManualFrozen = student.isFrozen;
                            let isDateFrozen = false;
                            if (semesterDate && !student.unfrozenByAdmin) {
                                const completionDate = new Date(semesterDate);
                                isDateFrozen = new Date() > completionDate;
                            }
                            const isEffectiveFrozen = isManualFrozen || isDateFrozen;

                            return (
                                <div key={student._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: 'var(--glass)', padding: '1rem', borderRadius: '50%' }}>
                                            <User size={24} color="var(--accent)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem' }}>{student.username?.split('@')[0] || 'Student'}</h3>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.username}</p>

                                            {isEffectiveFrozen && (
                                                <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    [FROZEN {isManualFrozen ? '(ADMIN)' : '(DATE)'}]
                                                </span>
                                            )}
                                            {student.unfrozenByAdmin && !isManualFrozen && (
                                                <span style={{ color: 'var(--text-accent)', fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '0.5rem' }}>
                                                    [Active (Immune)]
                                                </span>
                                            )}
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                                <div>{student.firstName} {student.lastName}</div>
                                                <div>{student.email}</div>
                                                <div>{student.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        {isEffectiveFrozen ? (
                                            <button
                                                onClick={() => handleUnfreeze(student._id)}
                                                style={{ background: 'var(--glass)', color: '#1d4ed8', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                                title="Unfreeze Account"
                                            >
                                                Unfreeze
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleFreeze(student._id)}
                                                style={{ background: 'var(--glass)', color: '#b45309', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                                title="Freeze Account"
                                            >
                                                Freeze
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleEditStudent(student)}
                                            style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                            title="Edit Student"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStudent(student._id)}
                                            style={{ background: 'var(--glass)', color: '#ff4d4d', padding: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                            title="Delete student"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
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
                ) : view === 'faculty' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {publicProfessors.map(prof => (
                            <div key={prof._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <img src={prof.photo || '/default-prof.png'} alt={prof.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div>
                                        <h3>{prof.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{prof.designation}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <button onClick={() => { setEditingProf(prof); setProfForm({ ...prof }); setModalType('faculty'); setShowModal(true); }} style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px' }}><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteProf(prof._id)} style={{ background: 'var(--glass)', color: '#ff4d4d', padding: '8px' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : view === 'academic-courses' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {publicCourses.map(course => (
                            <div key={course._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <h3>{course.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prof: {course.professor}</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <button onClick={() => { setEditingAcademicCourse(course); setAcademicCourseForm({ ...course }); setModalType('academic-course'); setShowModal(true); }} style={{ background: 'var(--glass)', color: 'var(--text-accent)', padding: '8px' }}><Edit size={16} /></button>
                                    <button onClick={() => handleDeleteAcademicCourse(course._id)} style={{ background: 'var(--glass)', color: '#ff4d4d', padding: '8px' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="gradient-text">
                                {modalType === 'course' ? (editingCourse ? 'Edit Course' : 'Create New Course') :
                                    modalType === 'teacher' ? 'Add Teacher Account' :
                                        modalType === 'faculty' ? (editingProf ? 'Edit Faculty' : 'Add Faculty') :
                                            modalType === 'student' ? 'Edit Student Details' :
                                                (editingAcademicCourse ? 'Edit Public Course' : 'Add Public Course')}
                            </h2>
                            <button onClick={() => {
                                setShowModal(false);
                                setEditingCourse(null);
                                setEditingProf(null);
                                setEditingAcademicCourse(null);
                                setEditingStudent(null);
                                setCourseForm({ title: '', description: '', completionDate: '' });
                                setProfForm({ name: '', designation: '', photo: '', about: '' });
                                setAcademicCourseForm({ title: '', description: '', professor: '', iconName: '', branch: 'EXTC' });
                            }} style={{ background: 'transparent', color: 'var(--text-main)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (modalType === 'course') editingCourse ? handleUpdateCourse(e) : handleCreateCourse(e);
                            else if (modalType === 'teacher') handleAddTeacher(e);
                            else if (modalType === 'faculty') handleSaveProfessor(e);
                            else if (modalType === 'academic-course') handleSaveAcademicCourse(e);
                            else if (modalType === 'student') handleUpdateStudent(e);
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
                                            style={{ background: '#f9fafb', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '120px', outline: 'none' }}
                                            value={courseForm.description}
                                            onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Completion Date</label>
                                        <input
                                            type="date"
                                            value={courseForm.completionDate}
                                            onChange={e => setCourseForm({ ...courseForm, completionDate: e.target.value })}
                                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: '#f9fafb', color: 'black' }}
                                        />
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student access to this course may be restricted after this date.</p>
                                    </div>
                                </>
                            ) : modalType === 'teacher' ? (
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
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-accent)', marginTop: '0.5rem' }}>
                                            Teacher can login using: <strong>{teacherForm.name || 'name'}@teacher</strong>
                                        </p>
                                    </div>
                                </>
                            ) : modalType === 'student' ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>First Name</label>
                                            <input value={studentForm.firstName} onChange={e => setStudentForm({ ...studentForm, firstName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last Name</label>
                                            <input value={studentForm.lastName} onChange={e => setStudentForm({ ...studentForm, lastName: e.target.value })} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email</label>
                                            <input value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone</label>
                                            <input value={studentForm.phone} onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>City</label>
                                            <input value={studentForm.city} onChange={e => setStudentForm({ ...studentForm, city: e.target.value })} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Country</label>
                                            <input value={studentForm.country} onChange={e => setStudentForm({ ...studentForm, country: e.target.value })} />
                                        </div>
                                    </div>
                                </>
                            ) : modalType === 'faculty' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    <input placeholder="Name" value={profForm.name} onChange={e => setProfForm({ ...profForm, name: e.target.value })} required />
                                    <input placeholder="Designation" value={profForm.designation} onChange={e => setProfForm({ ...profForm, designation: e.target.value })} required />
                                    <input placeholder="Photo URL" value={profForm.photo} onChange={e => setProfForm({ ...profForm, photo: e.target.value })} />
                                    <textarea placeholder="About" value={profForm.about} onChange={e => setProfForm({ ...profForm, about: e.target.value })} required />
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input placeholder="Title" value={academicCourseForm.title} onChange={e => setAcademicCourseForm({ ...academicCourseForm, title: e.target.value })} required />
                                    <textarea placeholder="Description" value={academicCourseForm.description} onChange={e => setAcademicCourseForm({ ...academicCourseForm, description: e.target.value })} required />
                                    <input placeholder="Professor Name" value={academicCourseForm.professor} onChange={e => setAcademicCourseForm({ ...academicCourseForm, professor: e.target.value })} required />
                                    <input placeholder="Icon Name (Lucide)" value={academicCourseForm.iconName} onChange={e => setAcademicCourseForm({ ...academicCourseForm, iconName: e.target.value })} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Branch</label>
                                        <select
                                            value={academicCourseForm.branch}
                                            onChange={e => setAcademicCourseForm({ ...academicCourseForm, branch: e.target.value })}
                                            style={{ padding: '0.8rem', borderRadius: '8px', background: '#f9fafb', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                                            required
                                        >
                                            <option value="EXTC">EXTC</option>
                                            <option value="COMP">COMP</option>
                                            <option value="IT">IT</option>
                                            <option value="MECH">MECH</option>
                                            <option value="CIVIL">CIVIL</option>
                                            <option value="AI-DS">AI-DS</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                            <button className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }} disabled={loading}>
                                {loading ? 'Processing...' : (editingCourse || editingProf || editingAcademicCourse ? 'Update' : 'Create')}
                            </button>
                        </form>
                    </div>
                </div>
            )
            }

            {
                showStudentsModal && (
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
                )
            }

            {
                showCourseRequestsModal && (
                    <div className="modal-overlay">
                        <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 className="gradient-text">Course Enrollment Requests</h2>
                                <button onClick={() => setShowCourseRequestsModal(false)} style={{ background: 'transparent', color: 'var(--text-main)' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            {courseRequests.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {courseRequests.map(student => (
                                        <div key={student._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{student.username}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleApproveEnrollment(student._id, 'approve')} className="btn-primary" style={{ padding: '0.5rem' }}>Approve</button>
                                                <button onClick={() => handleApproveEnrollment(student._id, 'reject')} className="btn-secondary" style={{ padding: '0.5rem', color: 'red', borderColor: 'red' }}>Reject</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : <p>No pending requests.</p>}
                        </div>
                    </div>
                )
            }

            {
                showAssignTeacherModal && (
                    <div className="modal-overlay">
                        <div className="modal-content animate-fade-in" style={{ maxWidth: '400px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 className="gradient-text">Assign Teacher</h2>
                                <button onClick={() => setShowAssignTeacherModal(false)} style={{ background: 'transparent', color: 'var(--text-main)' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAssignTeacher}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <label>Select Teacher</label>
                                    <select
                                        value={selectedTeacherId}
                                        onChange={e => setSelectedTeacherId(e.target.value)}
                                        style={{ padding: '0.8rem', borderRadius: '8px', background: '#f9fafb', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                                        required
                                    >
                                        <option value="">-- Select --</option>
                                        {teachers.map(t => (
                                            <option key={t._id} value={t._id}>{t.username}</option>
                                        ))}
                                    </select>
                                    <button className="btn-primary">Assign</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

// Helper style for sidebar buttons
const sidebarBtnStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    border: 'none',
    background: isActive ? 'var(--text-gradient)' : 'transparent',
    color: isActive ? 'white' : 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
});

export default AdminDashboard;
