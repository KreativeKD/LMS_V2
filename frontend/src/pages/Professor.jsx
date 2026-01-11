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
            ],
            testimonials: [
                {
                    text: "Dr. Talele's expertise in DSP transformed my understanding of signal processing. His teaching style is exceptional and his guidance was invaluable for my research.",
                    author: "Priya Sharma",
                    role: "PhD Student, IIT Bombay"
                },
                {
                    text: "The courses offered by Dr. Talele are comprehensive and industry-relevant. His mentorship helped me secure a position at a leading tech company.",
                    author: "Rahul Mehta",
                    role: "Alumni, Software Engineer"
                }
            ]
        },
        {
            id: 'sarah-johnson',
            name: 'Dr. Sarah Johnson',
            designation: 'PhD, Professor',
            dept: 'Computer Science',
            institution: 'Stanford University',
            photo: '/default-prof.png',
            stats: {
                experience: '28+',
                publications: '150+',
                patents: '18'
            },
            contact: {
                website: 'https://www.sarahjohnson.stanford.edu',
                linkedin: 'https://www.linkedin.com/in/sarah-johnson/',
                email: 'sarah.johnson@stanford.edu'
            },
            expertise: [
                'Artificial Intelligence', 'Machine Learning', 'Natural Language Processing',
                'Computer Vision', 'Robotics', 'Data Mining'
            ],
            leadership: [
                {
                    title: 'Director of AI Research Lab',
                    org: 'Stanford University (Since 2018)'
                },
                {
                    title: 'Chair of Computer Science Department',
                    org: 'Stanford University (2020-2023)'
                }
            ],
            achievements: [
                {
                    title: '150+ Research Publications',
                    desc: 'Published in top-tier conferences like NeurIPS, ICML, and CVPR'
                },
                {
                    title: '18 Patents Granted',
                    desc: 'In AI and machine learning technologies'
                },
                {
                    title: 'Turing Award Nominee',
                    desc: 'Recognized for contributions to AI research (2022)'
                }
            ],
            ventures: [
                {
                    title: 'Co-founder - AI Startup Inc.',
                    desc: 'Developing next-generation AI solutions for healthcare'
                }
            ],
            courses: [
                {
                    id: 'ai-ml',
                    title: 'Artificial Intelligence and Machine Learning',
                    description: 'Comprehensive course covering AI fundamentals, machine learning algorithms, and practical applications in various domains.',
                    chapters: [
                        'Introduction to AI',
                        'Machine Learning Basics',
                        'Supervised Learning',
                        'Unsupervised Learning',
                        'Deep Learning',
                        'Reinforcement Learning',
                        'AI Ethics and Applications'
                    ]
                },
                {
                    id: 'nlp',
                    title: 'Natural Language Processing',
                    description: 'Learn to process and understand human language using computational methods and deep learning techniques.',
                    chapters: [
                        'Text Processing Fundamentals',
                        'Language Models',
                        'Named Entity Recognition',
                        'Sentiment Analysis',
                        'Machine Translation',
                        'Question Answering Systems',
                        'NLP Applications'
                    ]
                }
            ],
            testimonials: [
                {
                    text: "Dr. Johnson's AI course opened my eyes to the possibilities of machine learning. Her research insights and teaching methodology are unparalleled.",
                    author: "Alex Chen",
                    role: "Research Assistant, Stanford"
                },
                {
                    text: "Working under Dr. Johnson's guidance on NLP projects was transformative. Her expertise in deep learning is exceptional.",
                    author: "Maria Rodriguez",
                    role: "Graduate Student, Stanford"
                }
            ]
        },
        {
            id: 'michael-chen',
            name: 'Dr. Michael Chen',
            designation: 'PhD, Assistant Professor',
            dept: 'Electrical Engineering',
            institution: 'University of California, Berkeley',
            photo: '/default-prof.png',
            stats: {
                experience: '15+',
                publications: '60+',
                patents: '8'
            },
            contact: {
                website: 'https://www.michaelchen.berkeley.edu',
                linkedin: 'https://www.linkedin.com/in/michael-chen/',
                email: 'michael.chen@berkeley.edu'
            },
            expertise: [
                'Embedded Systems', 'IoT', 'Cyber-Physical Systems',
                'Control Systems', 'Robotics', 'Sensor Networks'
            ],
            leadership: [
                {
                    title: 'Director of Embedded Systems Lab',
                    org: 'UC Berkeley (Since 2020)'
                }
            ],
            achievements: [
                {
                    title: '60+ Publications',
                    desc: 'In journals and conferences on embedded systems and IoT'
                },
                {
                    title: '8 Patents',
                    desc: 'Related to IoT devices and sensor technologies'
                },
                {
                    title: 'Best Paper Award',
                    desc: 'IEEE IoT Conference (2021)'
                }
            ],
            ventures: [
                {
                    title: 'Founder - IoT Solutions LLC',
                    desc: 'Providing innovative IoT solutions for smart cities'
                }
            ],
            courses: [
                {
                    id: 'embedded',
                    title: 'Embedded Systems Design',
                    description: 'Design and implement embedded systems for real-world applications, covering hardware-software integration and optimization.',
                    chapters: [
                        'Embedded System Fundamentals',
                        'Microcontrollers and Microprocessors',
                        'Real-Time Operating Systems',
                        'Sensor Integration',
                        'Communication Protocols',
                        'Power Management',
                        'System Optimization'
                    ]
                },
                {
                    id: 'iot',
                    title: 'Internet of Things (IoT)',
                    description: 'Explore the world of connected devices and IoT ecosystems, learning to build scalable and secure IoT solutions.',
                    chapters: [
                        'IoT Architecture',
                        'Sensor Networks',
                        'Data Analytics for IoT',
                        'Security in IoT',
                        'Edge Computing',
                        'IoT Protocols',
                        'Case Studies'
                    ]
                }
            ],
            testimonials: [
                {
                    text: "Dr. Chen's embedded systems course provided me with practical skills that I use daily in my IoT projects. His hands-on approach is outstanding.",
                    author: "James Wilson",
                    role: "IoT Engineer, TechCorp"
                },
                {
                    text: "The IoT course under Dr. Chen was incredibly insightful. His industry connections and real-world examples made learning engaging.",
                    author: "Lisa Park",
                    role: "Graduate Student, UC Berkeley"
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

                    <div className="professor-card" style={{ padding: '2rem' }}>
                        <div className="professor-photo-section" style={{ gap: '2rem', marginBottom: '2rem' }}>
                            <div className="photo-wrapper" style={{ maxWidth: '250px' }}>
                                <img src={selectedProf.photo} alt={selectedProf.name} className="professor-photo" style={{ width: '100%', height: '250px' }} />
                            </div>

                            <div className="professor-quick-info">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h3>{selectedProf.name}</h3>
                                    <div className="badge" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                                        <CheckCircle size={14} />
                                        <span>Verified Professor</span>
                                    </div>
                                </div>
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
                            <div className="detail-section">
                                <div className="detail-header">
                                    <Award size={24} className="detail-icon" />
                                    <h4>Key Achievements</h4>
                                </div>
                                <ul className="detail-list">
                                    {selectedProf.achievements.slice(0, 2).map((item, idx) => (
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

                            <div className="detail-section">
                                <div className="detail-header">
                                    <Lightbulb size={24} className="detail-icon" />
                                    <h4>Areas of Expertise</h4>
                                </div>
                                <div className="expertise-tags">
                                    {selectedProf.expertise.slice(0, 4).map((tag, idx) => (
                                        <span key={idx} className="expertise-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>

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
