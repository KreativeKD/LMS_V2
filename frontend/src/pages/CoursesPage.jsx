import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Zap, Sparkles, Clock, Users, Award, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { fetchAcademicCourses } from '../api/api';

const CoursesPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const branches = ['All', 'EXTC', 'COMP', 'IT', 'MECH', 'CIVIL', 'AI-DS', 'Other'];

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAcademicCourses();
                setCoursesData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredCourses = selectedBranch === 'All'
        ? coursesData
        : coursesData.filter(course => course.branch === selectedBranch);

    return (
        <div className="landing-page">
            <PublicNavbar scrolled={scrolled} />

            {/* Courses Section */}
            <section style={{ padding: '5rem 2rem 4rem' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 className="section-title">Academic Courses</h2>
                    <p className="section-subtitle">Choose your learning path and start building expertise</p>
                </div>

                <div style={{ display: 'flex', gap: '2rem', maxWidth: '1400px', margin: '0 auto', alignItems: 'flex-start' }}>
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{
                            position: 'sticky',
                            top: '100px',
                            zIndex: 10,
                            padding: '0.5rem',
                            background: 'white',
                            border: '1px solid var(--border)',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: isSidebarOpen ? '-1rem' : '0',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {isSidebarOpen ? <LucideIcons.ChevronLeft size={20} /> : <LucideIcons.ChevronRight size={20} />}
                    </button>

                    {/* Sidebar */}
                    <aside style={{
                        width: isSidebarOpen ? '280px' : '0px',
                        flexShrink: 0,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: isSidebarOpen ? '1.5rem' : '0',
                        border: isSidebarOpen ? '1px solid var(--border)' : 'none',
                        position: 'sticky',
                        top: '100px',
                        boxShadow: isSidebarOpen ? '0 8px 32px rgba(0, 0, 0, 0.05)' : 'none',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        opacity: isSidebarOpen ? 1 : 0
                    }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', paddingLeft: '0.5rem', whiteSpace: 'nowrap' }}>Branches</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {branches.map(branch => (
                                <button
                                    key={branch}
                                    onClick={() => setSelectedBranch(branch)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        width: '100%',
                                        padding: '0.8rem 1.2rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: selectedBranch === branch ? 'var(--text-gradient)' : 'transparent',
                                        color: selectedBranch === branch ? 'white' : 'var(--text-muted)',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'left',
                                        textTransform: 'none',
                                        boxShadow: selectedBranch === branch ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <Sparkles size={18} style={{ opacity: selectedBranch === branch ? 1 : 0.5 }} />
                                    {branch}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div style={{ flex: 1 }}>
                        <div className="courses-page-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // Fits approx 4-5 on desktop
                            gap: '1.5rem'
                        }}>
                            {filteredCourses.map((course, index) => {
                                const IconComponent = LucideIcons[course.iconName] || LucideIcons.Book;
                                const colors = ['sticky-yellow', 'sticky-cyan', 'sticky-pink', 'sticky-lime'];
                                const rotations = ['rotate-1', 'rotate-2', 'rotate-3'];
                                const colorClass = colors[index % colors.length];
                                const rotationClass = rotations[index % rotations.length];

                                return (
                                    <div key={course._id} className={`course-sticky-note ${colorClass} ${rotationClass}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <IconComponent size={32} className="sticky-icon" style={{ margin: 0 }} />
                                            <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: '700' }}>{course.title}</h3>
                                        </div>
                                        <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1 }}>{course.description}</p>

                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.3)',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            marginBottom: '1.5rem',
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            <p style={{ margin: '0.2rem 0' }}><strong>Professor:</strong> {course.professor}</p>
                                            <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>
                                                Enrolled Students:
                                                <span className="tag" style={{ marginLeft: '0.5rem' }}>
                                                    {course.linkedCourse && course.linkedCourse.students ? course.linkedCourse.students.length : '-'}
                                                </span>
                                            </p>
                                        </div>

                                        <button
                                            className="btn-primary"
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                marginTop: 'auto'
                                            }}
                                            onClick={() => navigate('/login')}
                                        >
                                            <span>Enroll Now</span>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                );
                            })}
                            {filteredCourses.length === 0 && !loading && (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.5)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
                                    <BookOpen size={48} color="var(--accent)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <h2>No Courses Found</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>We couldn't find any courses for the <strong>{selectedBranch}</strong> branch.</p>
                                    <button
                                        className="btn-secondary"
                                        style={{ marginTop: '1.5rem', textTransform: 'none' }}
                                        onClick={() => setSelectedBranch('All')}
                                    >
                                        View All Courses
                                    </button>
                                </div>
                            )}
                            {loading && (
                                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                                    <div className="loading-spinner"></div>
                                    <p>Loading course catalogue...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default CoursesPage;
