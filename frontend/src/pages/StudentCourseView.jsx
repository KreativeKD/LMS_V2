import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourse, toggleHiddenContent } from '../api/api';
import { ArrowLeft, PlayCircle, FileText, FileType, HelpCircle, ChevronRight, Menu, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedChapter, setExpandedChapter] = useState(null);
    const { login } = useAuth(); // To update user state

    const getHiddenContent = () => {
        if (!user || !user.enrolledCourses) return [];
        const enrollment = user.enrolledCourses.find(e => e.course === id || e.course?._id === id);
        return enrollment?.hiddenContent || [];
    };

    const isHidden = (contentId) => {
        const hiddenList = getHiddenContent();
        return hiddenList.includes(contentId);
    };

    const handleToggleHide = async (e, contentId) => {
        e.stopPropagation(); // Prevent triggering other click events
        try {
            const updatedUser = await toggleHiddenContent(id, contentId);
            // We need to re-construct the token or just update the user object if the context allows
            // existing login function expects (userData, userToken). We reuse the current token.
            login(updatedUser, localStorage.getItem('token'));
        } catch (err) {
            console.error(err);
            alert('Failed to update visibility preference');
        }
    };

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            const data = await fetchCourse(id);
            setCourse(data);

            // Access Control
            const isEnrolled = data.students?.some(s => String(s) === String(user?._id));
            const isAdmin = user?.role === 'admin';
            const isInstructor = user?.role === 'teacher' && (data.instructor?._id === user?._id || data.assignedTeachers?.includes(user?._id));

            if (!isEnrolled && !isAdmin && !isInstructor) {
                alert('You must be enrolled and approved to view this course content.');
                const path = user?.role === 'admin' ? '/admin' : (user?.role === 'teacher' ? '/teacher' : '/student');
                navigate(path);
                return;
            }

            // Select first unit of first chapter by default
            if (data.chapters?.[0]?.units?.[0]) {
                setSelectedUnit(data.chapters[0].units[0]);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to load course content');
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    if (!course) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading course content...</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{
                width: isSidebarOpen ? '400px' : '0',
                background: '#f9fafb',
                borderRight: '1px solid var(--border)',
                transition: 'width 0.3s ease',
                overflowY: 'auto',
                flexShrink: 0
            }}>
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#f9fafb',
                    zIndex: 10
                }}>
                    <h3 className="gradient-text" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h3>

                    {/* Teacher Visibility */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <strong>Teachers: </strong>
                        {[
                            course.instructor?.username?.split('@')[0],
                            ...(course.assignedTeachers?.map(t => t.username?.split('@')[0]) || [])
                        ].filter(Boolean).join(', ')}
                    </div>


                </div>

                <div style={{ padding: '1rem' }}>
                    {course.chapters?.map((chapter, idx) => (
                        <div key={chapter._id} style={{ marginBottom: '1rem' }}>
                            <button
                                onClick={() => {
                                    if (!isHidden(chapter._id)) {
                                        setExpandedChapter(expandedChapter === chapter._id ? null : chapter._id);
                                    }
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    padding: '1rem',
                                    background: expandedChapter === chapter._id ? 'rgba(79, 70, 229, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                                    color: isHidden(chapter._id) ? 'var(--text-muted)' : 'var(--text-main)',
                                    borderRadius: '8px',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    border: expandedChapter === chapter._id ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                    opacity: isHidden(chapter._id) ? 0.6 : 1
                                }}
                            >
                                <span style={{ textDecoration: isHidden(chapter._id) ? 'line-through' : 'none' }}>
                                    Chapter {idx + 1}: {chapter.title}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        onClick={(e) => handleToggleHide(e, chapter._id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: isHidden(chapter._id) ? 'var(--text-muted)' : 'var(--primary)',
                                            padding: '4px',
                                            display: 'flex', // Always visible now
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.8rem'
                                        }}
                                        title={isHidden(chapter._id) ? "Unhide Content" : "Hide Content"}
                                    >
                                        {isHidden(chapter._id) ? (
                                            <>
                                                <Eye size={18} /> Unhide
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff size={18} /> Hide
                                            </>
                                        )}
                                    </button>
                                    {!isHidden(chapter._id) && (
                                        <ChevronRight
                                            size={18}
                                            style={{
                                                transform: expandedChapter === chapter._id ? 'rotate(90deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.2s ease'
                                            }}
                                        />
                                    )}
                                </div>
                            </button>

                            {expandedChapter === chapter._id && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    marginTop: '0.5rem',
                                    paddingLeft: '0.5rem'
                                }}>
                                    {chapter.units?.map(unit => (
                                        <div
                                            key={unit._id}
                                            onClick={() => {
                                                if (!isHidden(unit._id)) {
                                                    setSelectedUnit(unit);
                                                }
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.8rem',
                                                padding: '0.8rem',
                                                width: '100%',
                                                background: selectedUnit?._id === unit._id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                                color: isHidden(unit._id) ? 'var(--text-muted)' : (selectedUnit?._id === unit._id ? 'var(--text-accent)' : 'var(--text-main)'),
                                                borderLeft: selectedUnit?._id === unit._id ? '3px solid var(--primary)' : '3px solid transparent',
                                                borderRadius: '0 4px 4px 0',
                                                textAlign: 'left',
                                                opacity: isHidden(unit._id) ? 0.6 : 1,
                                                cursor: isHidden(unit._id) ? 'default' : 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
                                                {unit.type === 'video' ? <PlayCircle size={16} /> :
                                                    unit.type === 'pdf' ? <FileText size={16} /> :
                                                        unit.type === 'text' ? <FileType size={16} /> :
                                                            <HelpCircle size={16} />}
                                                <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: isHidden(unit._id) ? 'line-through' : 'none' }}>
                                                    {unit.title}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => handleToggleHide(e, unit._id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: '4px',
                                                    cursor: 'pointer',
                                                    color: isHidden(unit._id) ? 'var(--text-muted)' : 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    opacity: 0.8
                                                }}
                                                className="hide-btn"
                                                title={isHidden(unit._id) ? "Unhide" : "Hide"}
                                            >
                                                {isHidden(unit._id) ? <Eye size={16} /> : <EyeOff size={16} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', background: 'var(--background)', position: 'relative' }}>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, background: 'var(--glass)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
                >
                    <Menu size={20} />
                </button>

                {/* Back to Dashboard Button on Right */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1.5rem',
                    zIndex: 10
                }}>
                    <button
                        onClick={() => {
                            const path = user?.role === 'admin' ? '/admin' : (user?.role === 'teacher' ? '/teacher' : '/student');
                            navigate(path);
                        }}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            padding: '10px 18px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                            transition: 'all 0.3s ease'
                        }}
                        className="hover-scale"
                    >
                        <ArrowLeft size={16} /> <span>Back to Dashboard</span>
                    </button>
                </div>

                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
                    {selectedUnit ? (
                        <>
                            <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedUnit.title}</h1>
                                <span style={{
                                    background: 'var(--glass)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-accent)',
                                    textTransform: 'uppercase'
                                }}>
                                    {selectedUnit.type} content
                                </span>
                            </header>

                            <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                                {selectedUnit.type === 'video' && selectedUnit.content?.videoUrl && (
                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                        <iframe
                                            src={getYouTubeEmbedUrl(selectedUnit.content.videoUrl)}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '8px' }}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={selectedUnit.title}
                                        />
                                    </div>
                                )}

                                {selectedUnit.type === 'text' && selectedUnit.content?.text && (
                                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                                        {selectedUnit.content.text}
                                    </div>
                                )}

                                {selectedUnit.type === 'pdf' && selectedUnit.content?.pdfUrl && (
                                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                                        <FileText size={64} style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }} />
                                        <h3 style={{ marginBottom: '1rem' }}>PDF Document Available</h3>
                                        <a
                                            href={selectedUnit.content.pdfUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                        >
                                            Open PDF Document
                                        </a>
                                    </div>
                                )}

                                {selectedUnit.type === 'quiz' && (
                                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                                        <HelpCircle size={64} style={{ marginBottom: '1.5rem', color: 'var(--accent)' }} />
                                        <h3 style={{ marginBottom: '1rem' }}>Quiz Assessment</h3>
                                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Test your knowledge of this section.</p>
                                        <button
                                            onClick={() => navigate(`/quiz/${selectedUnit.content.quiz}`)}
                                            className="btn-accent"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <p>Select a unit from the sidebar to begin learning.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentCourseView;
