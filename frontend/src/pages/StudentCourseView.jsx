import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourse } from '../api/api';
import { ArrowLeft, PlayCircle, FileText, FileType, HelpCircle, ChevronRight, Menu } from 'lucide-react';

const StudentCourseView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            const data = await fetchCourse(id);
            setCourse(data);
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
                width: isSidebarOpen ? '320px' : '0',
                background: '#1a1a1a',
                borderRight: '1px solid #333',
                transition: 'width 0.3s ease',
                overflowY: 'auto',
                flexShrink: 0
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #333' }}>
                    <h3 className="gradient-text" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                    <button
                        onClick={() => navigate('/student')}
                        style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: 0 }}
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                </div>

                <div style={{ padding: '1rem' }}>
                    {course.chapters?.map((chapter, idx) => (
                        <div key={chapter._id} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem', paddingLeft: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Chapter {idx + 1}: {chapter.title}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {chapter.units?.map(unit => (
                                    <button
                                        key={unit._id}
                                        onClick={() => setSelectedUnit(unit)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.8rem',
                                            padding: '0.8rem',
                                            width: '100%',
                                            background: selectedUnit?._id === unit._id ? 'rgba(92, 107, 192, 0.1)' : 'transparent',
                                            color: selectedUnit?._id === unit._id ? 'var(--primary)' : 'var(--text-main)',
                                            borderLeft: selectedUnit?._id === unit._id ? '3px solid var(--primary)' : '3px solid transparent',
                                            borderRadius: '0 4px 4px 0',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {unit.type === 'video' ? <PlayCircle size={16} /> :
                                            unit.type === 'pdf' ? <FileText size={16} /> :
                                                unit.type === 'text' ? <FileType size={16} /> :
                                                    <HelpCircle size={16} />}
                                        <span style={{ fontSize: '0.9rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {unit.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#0a0a0a', position: 'relative' }}>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '8px', borderRadius: '4px' }}
                >
                    <Menu size={20} />
                </button>

                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
                    {selectedUnit ? (
                        <>
                            <header style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
                                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedUnit.title}</h1>
                                <span style={{
                                    background: 'var(--glass)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: 'var(--primary)',
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
