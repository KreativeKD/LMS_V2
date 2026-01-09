import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, Briefcase, Star, Lightbulb, Building, CheckCircle,
    Mail, Phone, ExternalLink, Linkedin, ArrowRight, BarChart2, Zap
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const Professor = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const courses = [
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
    ];

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

            {/* About Professor Section */}
            <section style={{ paddingTop: '8rem' }} className="about-professor-section">
                <div className="about-professor-container">
                    <div className="section-header">
                        <div className="section-badge">
                            <Award size={16} />
                            <span>About the Professor</span>
                        </div>
                        <h2 className="section-title">Meet Dr. Kiran TALELE</h2>
                        <p className="section-subtitle">
                            An award-winning professor with three decades of academic excellence and real-world expertise.
                        </p>
                    </div>

                    <div className="professor-card">
                        <div className="professor-photo-section">
                            <div className="photo-wrapper">
                                <img src="/ktalele.png" alt="Dr. Kiran Talele" className="professor-photo" />
                            </div>

                            <div className="professor-quick-info">
                                <h3>Dr. Kiran TALELE</h3>
                                <p className="professor-designation">PhD, Associate Professor</p>
                                <p className="professor-dept">Electronics & Telecommunication Engineering</p>
                                <p className="professor-institution">Sardar Patel Institute of Technology, Mumbai</p>

                                <div className="quick-stats">
                                    <div className="quick-stat">
                                        <strong>33+</strong>
                                        <span>Years Experience</span>
                                    </div>
                                    <div className="quick-stat">
                                        <strong>85+</strong>
                                        <span>Publications</span>
                                    </div>
                                    <div className="quick-stat">
                                        <strong>22</strong>
                                        <span>Patents</span>
                                    </div>
                                </div>

                                <div className="contact-buttons">
                                    <a href="https://www.talelesir.com" target="_blank" rel="noopener noreferrer" className="contact-btn">
                                        <ExternalLink size={18} />
                                        <span>Website</span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/k-t-v-talele/" target="_blank" rel="noopener noreferrer" className="contact-btn">
                                        <Linkedin size={18} />
                                        <span>LinkedIn</span>
                                    </a>
                                    <a href="mailto:talelesir@gmail.com" className="contact-btn">
                                        <Mail size={18} />
                                        <span>Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Courses Section within Professor Card */}
                        <div className="professor-courses-section">
                            <h4 className="courses-section-title">Expert-Led Courses</h4>
                            <div className="courses-grid">
                                {courses.map(course => (
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
                            <div className="detail-section">
                                <div className="detail-header">
                                    <Briefcase size={24} className="detail-icon" />
                                    <h4>Current Leadership Positions</h4>
                                </div>
                                <ul className="detail-list">
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Dean of Students, Alumni & External Relations</strong>
                                            <p>Sardar Patel Institute of Technology (Since 2022)</p>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Director - SP-TBI</strong>
                                            <p>Sardar Patel Technology Business Incubator (2025)</p>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Treasurer</strong>
                                            <p>IEEE Bombay Section (Since 2020)</p>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Mentor</strong>
                                            <p>Startup Incubation & Intellectual Asset Creation</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="detail-section">
                                <div className="detail-header">
                                    <Award size={24} className="detail-icon" />
                                    <h4>Research & Achievements</h4>
                                </div>
                                <ul className="detail-list">
                                    <li>
                                        <Star size={16} className="list-icon" />
                                        <div>
                                            <strong>85+ Research Publications</strong>
                                            <p>Published in prestigious national and international conferences & journals</p>
                                        </div>
                                    </li>
                                    <li>
                                        <Star size={16} className="list-icon" />
                                        <div>
                                            <strong>22 Patents Filed</strong>
                                            <p>Including utility patent granted by India (2021) and design patent by UK (2025)</p>
                                        </div>
                                    </li>
                                    <li>
                                        <Star size={16} className="list-icon" />
                                        <div>
                                            <strong>Excellence Awards</strong>
                                            <p>Recognized by SPIT Management (2008-09) & IEEE Bombay Outstanding Volunteer (2019)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="detail-section">
                                <div className="detail-header">
                                    <Lightbulb size={24} className="detail-icon" />
                                    <h4>Areas of Expertise</h4>
                                </div>
                                <div className="expertise-tags">
                                    <span className="expertise-tag">Digital Signal Processing</span>
                                    <span className="expertise-tag">Image Processing</span>
                                    <span className="expertise-tag">Computer Vision</span>
                                    <span className="expertise-tag">Machine Learning</span>
                                    <span className="expertise-tag">Multimedia Systems</span>
                                    <span className="expertise-tag">AI & Deep Learning</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <div className="detail-header">
                                    <Building size={24} className="detail-icon" />
                                    <h4>Professional Ventures</h4>
                                </div>
                                <ul className="detail-list">
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Co-founder & Director - Anudaan Jagruti (2024)</strong>
                                            <p>Empowering communities through education and innovation</p>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Co-founder & Director - CerenitySphere (2025)</strong>
                                            <p>Advancing mental health through technology</p>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircle size={16} className="list-icon" />
                                        <div>
                                            <strong>Vice Chair - Educational Committee</strong>
                                            <p>Trans Asian Chamber of Commerce & Industry (2025)</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
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
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default Professor;
