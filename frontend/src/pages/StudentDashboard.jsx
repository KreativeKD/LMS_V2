import React, { useState, useEffect } from 'react';
import { fetchCourses, enrollInCourse } from '../api/api';
import { PlayCircle, CheckCircle, BookOpen, Video, FileText, HelpCircle, ArrowLeft, ExternalLink, FileType } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedUnits, setExpandedUnits] = useState({});

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

    const handleEnroll = async (courseId) => {
        if (user.role !== 'student') {
            alert('Only students can enroll in courses.');
            return;
        }
        setLoading(true);
        try {
            await enrollInCourse(courseId);
            alert('Successfully enrolled!');
            loadCourses();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleUnitContent = (unitId) => {
        setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    if (selectedCourse) {
        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    onClick={() => setSelectedCourse(null)}
                    style={{ background: 'transparent', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
                >
                    <ArrowLeft size={18} /> Back to My Courses
                </button>

                <header className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h1 className="gradient-text">{selectedCourse.title}</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{selectedCourse.description}</p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {selectedCourse.chapters?.map((chapter, idx) => (
                        <div key={chapter._id} className="card">
                            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: 'var(--primary)', opacity: 0.5 }}>{idx + 1}</span> {chapter.title}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {chapter.units?.map(unit => (
                                    <div key={unit._id} className="card" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                                        <div
                                            onClick={() => {
                                                if (unit.type === 'quiz') {
                                                    navigate(`/quiz/${unit.content.quiz}`);
                                                } else {
                                                    toggleUnitContent(unit._id);
                                                }
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                cursor: 'pointer',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            {unit.type === 'video' ? <Video size={18} color="var(--primary)" /> :
                                                unit.type === 'pdf' ? <FileText size={18} color="var(--secondary)" /> :
                                                    unit.type === 'text' ? <FileType size={18} color="var(--accent)" /> :
                                                        <HelpCircle size={18} color="var(--accent)" />}
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '500' }}>{unit.title}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                                    {unit.type}
                                                </span>
                                            </div>
                                            {unit.type === 'quiz' && <button className="btn-accent" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Take Quiz</button>}
                                        </div>

                                        {/* Unit Content Display */}
                                        {expandedUnits[unit._id] && unit.type !== 'quiz' && (
                                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#0f0f0f', borderRadius: '8px', borderTop: '1px solid #333' }}>
                                                {unit.type === 'video' && unit.content?.videoUrl && (
                                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                                        <iframe
                                                            src={getYouTubeEmbedUrl(unit.content.videoUrl)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                border: 'none',
                                                                borderRadius: '8px'
                                                            }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title={unit.title}
                                                        />
                                                    </div>
                                                )}

                                                {unit.type === 'pdf' && unit.content?.pdfUrl && (
                                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                                        <FileText size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                                                        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>PDF Document</p>
                                                        <a
                                                            href={unit.content.pdfUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn-primary"
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                                                        >
                                                            <ExternalLink size={16} /> Open PDF
                                                        </a>
                                                    </div>
                                                )}

                                                {unit.type === 'text' && unit.content?.text && (
                                                    <div style={{ padding: '1rem', lineHeight: '1.8', color: 'var(--text-main)' }}>
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>{unit.content.text}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>
                {user.role === 'student' ? 'My Learning Journey' : 'Course Catalog'}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {courses.map(course => {
                    const enrolled = course.students?.some(id => String(id) === String(user?._id)) || user?.role === 'admin';
                    return (
                        <div key={course._id} className="card" style={{ transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                padding: '1.5rem',
                                borderRadius: '12px 12px 0 0',
                                marginBottom: '1rem'
                            }}>
                                <BookOpen size={32} color="white" />
                            </div>

                            <div style={{ padding: '0 1rem', flex: 1 }}>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{course.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    {course.description}
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>{course.chapters?.length || 0} chapters</span>
                                </div>
                            </div>

                            <div style={{ padding: '1rem', borderTop: '1px solid #333', marginTop: 'auto' }}>
                                {enrolled ? (
                                    <button
                                        onClick={() => navigate(`/course/read/${course._id}`)}
                                        className="btn-primary"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <PlayCircle size={18} /> View Content
                                    </button>
                                ) : user.role === 'student' ? (
                                    <button
                                        onClick={() => handleEnroll(course._id)}
                                        disabled={loading}
                                        className="btn-accent"
                                        style={{ width: '100%' }}
                                    >
                                        {loading ? 'Enrolling...' : 'Enroll Now'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedCourse(course)}
                                        className="btn-secondary"
                                        style={{ width: '100%' }}
                                    >
                                        View Mode
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentDashboard;
