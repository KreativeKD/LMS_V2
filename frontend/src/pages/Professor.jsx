import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, Briefcase, Star, Lightbulb, Building, CheckCircle,
    Mail, Phone, ExternalLink, Linkedin, ArrowRight, BarChart2, Zap, Users,
    ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { fetchPublicProfessors } from '../api/api';

const Professor = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [professorsData, setProfessorsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProfId, setActiveProfId] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchPublicProfessors();
                setProfessorsData(data);
                if (data.length > 0) setActiveProfId(data[0]._id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const selectedProf = professorsData.find(p => p._id === activeProfId) || professorsData[0];


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="landing-page">
            <PublicNavbar scrolled={scrolled} />

            <div className={`professor-page-layout ${isCollapsed ? 'collapsed' : ''}`}>
                {/* Left Sidebar */}
                <aside className={`professor-sidebar animate-slide-left ${isCollapsed ? 'collapsed' : ''}`}>
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <MoreHorizontal size={14} style={{ marginBottom: '-4px' }} />
                        {isCollapsed ? <ChevronRight size={18} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={3} />}
                    </button>

                    <h3 className="sidebar-title">Faculty Directory</h3>
                    <div className="professor-list-nav">
                        {professorsData.map((prof) => (
                            <button
                                key={prof._id}
                                className={`prof-nav-item ${activeProfId === prof._id ? 'active' : ''}`}
                                onClick={() => setActiveProfId(prof._id)}
                            >
                                <img src={prof.photo || '/default-prof.png'} alt={prof.name} className="prof-nav-thumb" />
                                <div className="prof-nav-info">
                                    <h4>{prof.name}</h4>
                                    <p>{prof.designation}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="professor-content-area animate-fade-in">
                    {!loading && selectedProf ? (
                        <>
                            <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <div className="section-badge">
                                    <Award size={16} />
                                    <span>Professor Profile</span>
                                </div>
                                <h2 className="section-title">Meet {selectedProf.name}</h2>
                                <p className="section-subtitle" style={{ margin: '0' }}>
                                    {selectedProf.designation} at {selectedProf.institution}
                                </p>
                            </div>

                            <div className="professor-card" style={{ padding: '2rem' }}>
                                {/* Top Section: Photo and Name with Paragraph */}
                                <div className="professor-photo-section" style={{ gap: '2rem', marginBottom: '2rem' }}>
                                    <div className="photo-wrapper" style={{ maxWidth: '250px' }}>
                                        <img src={selectedProf.photo} alt={selectedProf.name} className="professor-photo" style={{ width: '100%', height: '250px' }} />
                                    </div>

                                    <div className="professor-quick-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <h3>{selectedProf.name}</h3>
                                        </div>


                                        {/* Professor Information Paragraph */}
                                        <div style={{ marginTop: '1.5rem', lineHeight: '1.6', color: '#555' }}>
                                            {/* PROFESSOR INFORMATION HERE - Paste the professor's paragraph/bio here */}
                                            <p style={{ fontSize: '0.95rem' }}>
                                                Dr. Kiran Talele is an academician, entrepreneur, and mentor dedicated to fostering innovation
                                                and professional excellence. With a strong focus on student development and entrepreneurial mindset,
                                                he has contributed significantly to academic programs, startups, and skill-building initiatives.
                                                Dr. Talele combines 36+ years of experience with a passion for teaching, guiding students and
                                                professionals to achieve meaningful growth and career success.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section - Below Photo and Paragraph */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <div className="quick-stats">
                                        <div className="quick-stat">
                                            <strong>{selectedProf.stats.experience}</strong>
                                            <span>Years Experience</span>
                                        </div>
                                        <div className="quick-stat">
                                            <strong>{selectedProf.stats.publications}</strong>
                                            <span>Publications</span>
                                        </div>
                                        <div className="quick-stat">
                                            <strong>{selectedProf.stats.patents}</strong>
                                            <span>Patents</span>
                                        </div>
                                        <div className="quick-stat">
                                            <strong>{selectedProf.stats.startups}</strong>
                                            <span>Number of Startups Mentored</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="contact-buttons" style={{ marginBottom: '2rem' }}>
                                    {selectedProf.contact.website !== '#' && (
                                        <a href={selectedProf.contact.website} target="_blank" rel="noopener noreferrer" className="contact-btn">
                                            <ExternalLink size={18} />
                                            <span>Website</span>
                                        </a>
                                    )}
                                    {selectedProf.contact.linkedin !== '#' && (
                                        <a href={selectedProf.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-btn">
                                            <Linkedin size={18} />
                                            <span>LinkedIn</span>
                                        </a>
                                    )}
                                    <a href={`mailto:${selectedProf.contact.email}`} className="contact-btn">
                                        <Mail size={18} />
                                        <span>Email</span>
                                    </a>
                                </div>

                                {/* Courses Section */}
                                <div className="professor-courses-section" style={{ margin: '2rem 0' }}>
                                    <h4 className="courses-section-title">Courses Taught by {selectedProf.name}</h4>
                                    <div className="courses-grid">
                                        {selectedProf.courses.map(course => (
                                            <div key={course.id} className="landing-course-card">
                                                <div className="course-card-content">
                                                    <div className="course-icon">
                                                        {course.id === 'dsp' ? <BarChart2 size={32} /> : <Zap size={32} />}
                                                    </div>
                                                    <h3>{course.title}</h3>
                                                    <p>{course.description.substring(0, 100)}...</p>
                                                    <button
                                                        className="know-more-btn"
                                                        onClick={() => setSelectedCourse(course)}
                                                    >
                                                        <ExternalLink size={16} />
                                                        Know More
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="professor-details" style={{ gap: '1.5rem' }}>




                                    {selectedProf.testimonials && selectedProf.testimonials.length > 0 && (
                                        <div className="detail-section">
                                            <div className="detail-header">
                                                <Star size={24} className="detail-icon" />
                                                <h4>Student Feedback</h4>
                                            </div>
                                            <div className="testimonial-card" style={{ margin: 0 }}>
                                                <div className="testimonial-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} fill="currentColor" />
                                                    ))}
                                                </div>
                                                <p className="testimonial-text">"{selectedProf.testimonials[0].text}"</p>
                                                <div className="testimonial-author">
                                                    <div className="author-avatar">
                                                        {selectedProf.testimonials[0].author.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <h4>{selectedProf.testimonials[0].author}</h4>
                                                        <p>{selectedProf.testimonials[0].role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>
                            <div className="loading-spinner"></div>
                            <p>Loading faculty profiles...</p>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>
                            <h3>No faculty profiles found.</h3>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal for Course Details */}
            {selectedCourse && (
                <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
                    <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedCourse.title}</h2>
                            <button className="close-btn" onClick={() => setSelectedCourse(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="course-full-description">{selectedCourse.description}</p>
                            {selectedCourse.chapters && (
                                <div className="chapters-section">
                                    <h4>Course Chapters</h4>
                                    <ul className="chapters-list">
                                        {selectedCourse.chapters.map((chapter, index) => (
                                            <li key={index}>
                                                <CheckCircle size={16} className="check-icon" />
                                                {chapter}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="modal-actions">
                                <button
                                    className="btn-primary btn-large"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Enroll Now
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <PublicFooter />
        </div>
    );
};

export default Professor;
