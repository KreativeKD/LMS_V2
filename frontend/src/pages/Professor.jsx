import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, Briefcase, Star, Lightbulb, Building, CheckCircle,
    Mail, Phone, ExternalLink, Linkedin, ArrowRight, BarChart2, Zap, Users,
    ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const Professor = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const professorsData = [
        {
            id: 'kiran-talele',
            name: 'Dr. Kiran TALELE',
            designation: 'PhD, Associate Professor',
            dept: 'Electronics & Telecommunication Engineering',
            institution: 'Sardar Patel Institute of Technology, Mumbai',
            photo: '/ktalele.png',
            stats: {
                experience: '33+',
                publications: '85+',
                patents: '22'
            },
            contact: {
                website: 'https://www.talelesir.com',
                linkedin: 'https://www.linkedin.com/in/k-t-v-talele/',
                email: 'talelesir@gmail.com'
            },
            expertise: [
                'Digital Signal Processing', 'Image Processing', 'Computer Vision',
                'Machine Learning', 'Multimedia Systems', 'AI & Deep Learning'
            ],
            leadership: [
                {
                    title: 'Dean of Students, Alumni & External Relations',
                    org: 'Sardar Patel Institute of Technology (Since 2022)'
                },
                {
                    title: 'Director - SP-TBI',
                    org: 'Sardar Patel Technology Business Incubator (2025)'
                },
                {
                    title: 'Treasurer',
                    org: 'IEEE Bombay Section (Since 2020)'
                },
                {
                    title: 'Mentor',
                    org: 'Startup Incubation & Intellectual Asset Creation'
                }
            ],
            achievements: [
                {
                    title: '85+ Research Publications',
                    desc: 'Published in prestigious national and international conferences & journals'
                },
                {
                    title: '22 Patents Filed',
                    desc: 'Including utility patent granted by India (2021) and design patent by UK (2025)'
                },
                {
                    title: 'Excellence Awards',
                    desc: 'Recognized by SPIT Management (2008-09) & IEEE Bombay Outstanding Volunteer (2019)'
                }
            ],
            ventures: [
                {
                    title: 'Co-founder & Director - Anudaan Jagruti (2024)',
                    desc: 'Empowering communities through education and innovation'
                },
                {
                    title: 'Co-founder & Director - CerenitySphere (2025)',
                    desc: 'Advancing mental health through technology'
                }
            ],
            courses: [
                {
                    id: 'dsp',
                    title: 'Digital Signal Processing (DSP)',
                    description: 'Master the fundamentals of processing discrete-time signals and systems. This course covers everything from basic signal theory to advanced filter design and implementation.',
                    chapters: [
                        'Discrete-time Signals and Systems',
                        'Z-Transform and its Applications',
                        'Discrete Fourier Transform (DFT)',
                        'Fast Fourier Transform (FFT) Algorithms',
                        'Design of Digital IIR Filters',
                        'Design of Digital FIR Filters',
                        'Finite Word Length Effects'
                    ]
                },
                {
                    id: 'dip',
                    title: 'Digital Image Processing (DIP)',
                    description: 'Dive into the world of digital image processing. Learn how to manipulate, enhance, and extract information from digital images using state-of-the-art algorithms.',
                    chapters: [
                        'Digital Image Fundamentals',
                        'Image Enhancement in Spatial Domain',
                        'Image Enhancement in Frequency Domain',
                        'Image Restoration and Reconstruction',
                        'Morphological Image Processing',
                        'Image Segmentation Techniques',
                        'Representation and Description'
                    ]
                }
            ]
        }
    ];

    const [activeProfId, setActiveProfId] = useState(professorsData[0].id);
    const selectedProf = professorsData.find(p => p.id === activeProfId) || professorsData[0];

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
                                key={prof.id}
                                className={`prof-nav-item ${activeProfId === prof.id ? 'active' : ''}`}
                                onClick={() => setActiveProfId(prof.id)}
                            >
                                <img src={prof.photo} alt={prof.name} className="prof-nav-thumb" />
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

                    <div className="professor-card">
                        <div className="professor-photo-section">
                            <div className="photo-wrapper">
                                <img src={selectedProf.photo} alt={selectedProf.name} className="professor-photo" />
                            </div>

                            <div className="professor-quick-info">
                                <h3>{selectedProf.name}</h3>
                                <p className="professor-designation">{selectedProf.designation}</p>
                                <p className="professor-dept">{selectedProf.dept}</p>
                                <p className="professor-institution">{selectedProf.institution}</p>

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
                                </div>

                                <div className="contact-buttons">
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
                            </div>
                        </div>

                        {/* Courses Section */}
                        <div className="professor-courses-section">
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

                        <div className="professor-details">
                            {selectedProf.leadership && selectedProf.leadership.length > 0 && (
                                <div className="detail-section">
                                    <div className="detail-header">
                                        <Briefcase size={24} className="detail-icon" />
                                        <h4>Leadership Positions</h4>
                                    </div>
                                    <ul className="detail-list">
                                        {selectedProf.leadership.map((item, idx) => (
                                            <li key={idx}>
                                                <CheckCircle size={16} className="list-icon" />
                                                <div>
                                                    <strong>{item.title}</strong>
                                                    <p>{item.org}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {selectedProf.achievements && selectedProf.achievements.length > 0 && (
                                <div className="detail-section">
                                    <div className="detail-header">
                                        <Award size={24} className="detail-icon" />
                                        <h4>Research & Achievements</h4>
                                    </div>
                                    <ul className="detail-list">
                                        {selectedProf.achievements.map((item, idx) => (
                                            <li key={idx}>
                                                <Star size={16} className="list-icon" />
                                                <div>
                                                    <strong>{item.title}</strong>
                                                    <p>{item.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="detail-section">
                                <div className="detail-header">
                                    <Lightbulb size={24} className="detail-icon" />
                                    <h4>Areas of Expertise</h4>
                                </div>
                                <div className="expertise-tags">
                                    {selectedProf.expertise.map((tag, idx) => (
                                        <span key={idx} className="expertise-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {selectedProf.ventures && selectedProf.ventures.length > 0 && (
                                <div className="detail-section">
                                    <div className="detail-header">
                                        <Building size={24} className="detail-icon" />
                                        <h4>Professional Ventures</h4>
                                    </div>
                                    <ul className="detail-list">
                                        {selectedProf.ventures.map((item, idx) => (
                                            <li key={idx}>
                                                <CheckCircle size={16} className="list-icon" />
                                                <div>
                                                    <strong>{item.title}</strong>
                                                    <p>{item.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
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
