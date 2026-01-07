import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, BarChart2, Shield, Users, Globe,
    Star, Check, Zap, Target, TrendingUp, Sparkles,
    Clock, Trophy, Rocket, Heart, Facebook, Twitter, Instagram, Linkedin,
    GraduationCap, Briefcase, FileText, Mail, Phone, ExternalLink,
    CheckCircle, ArrowRight, Play, Building, Lightbulb, MessageCircle
} from 'lucide-react';

const LandingPage = () => {
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
            id: 'isp',
            title: 'Image Signal Processing (ISP)',
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="landing-page">
            {/* Background Gradient Orbs */}
            <div className="bg-gradient-orb bg-gradient-orb-1"></div>
            <div className="bg-gradient-orb bg-gradient-orb-2"></div>
            <div className="bg-gradient-orb bg-gradient-orb-3"></div>

            {/* Navigation */}
            <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-logo">
                    <GraduationCap size={28} className="logo-icon" />
                    <span>CourseZ</span>
                </div>
                <div className="nav-links">
                    <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
                    <a href="#professors" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('professors')?.scrollIntoView({ behavior: 'smooth' }); }}>Professors</a>
                    <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
                </div>
                <div className="nav-actions">
                    <button className="btn-secondary" onClick={() => handleNavigation('/login')}>
                        Sign In
                    </button>
                    <button className="btn-primary" onClick={() => handleNavigation('/login')}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-slide-left">
                    <div className="badge-container">
                        <span className="badge badge-premium">
                            <Sparkles size={16} />
                            <span>By SPIT Faculty • 33+ Years Experience</span>
                        </span>
                    </div>
                    <h1 className="hero-title">
                        Master Your Future with <span className="gradient-text">CourseZ</span>
                    </h1>
                    <p className="hero-subtitle">
                        Learn from Dr. Kiran Talele, an award-winning professor with 85+ research publications
                        and 22 patents. Experience curriculum-designed courses that transform students into
                        industry-ready professionals.
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="btn-primary btn-large"
                            onClick={() => handleNavigation('/login')}
                        >
                            <span>Start Learning Free</span>
                            <ArrowRight size={20} />
                        </button>
                        <button
                            className="btn-secondary btn-large"
                            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Play size={18} />
                            <span>Meet the Professor</span>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>500+</h3>
                                <p>Active Students</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <BookOpen size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>10+</h3>
                                <p>Expert Courses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Award size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>98%</h3>
                                <p>Success Rate</p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="trust-indicators">
                        <div className="trust-item">
                            <CheckCircle size={20} className="trust-icon" />
                            <span>IEEE Bombay Section Treasurer</span>
                        </div>
                        <div className="trust-item">
                            <CheckCircle size={20} className="trust-icon" />
                            <span>SP-TBI Director</span>
                        </div>
                        <div className="trust-item">
                            <CheckCircle size={20} className="trust-icon" />
                            <span>Industry Recognized</span>
                        </div>
                    </div>
                </div>

                <div className="hero-image-container animate-slide-right">
                    <div className="image-glow"></div>
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                        alt="Students Learning"
                        className="hero-image"
                    />
                    <div className="floating-card floating-card-1">
                        <div className="floating-icon">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <h4>Certified Programs</h4>
                            <p>Industry-recognized certificates</p>
                        </div>
                    </div>
                    <div className="floating-card floating-card-2">
                        <div className="floating-icon">
                            <Rocket size={20} />
                        </div>
                        <div>
                            <h4>Career Growth</h4>
                            <p>Land your dream job</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Professor Section with Photo */}
            <section id="professors" className="about-professor-section">
                <div className="about-professor-container">
                    <div className="section-header">
                        <div className="section-badge">
                            <Award size={16} />
                            <span>Meet Your Instructor</span>
                        </div>
                        <h2 className="section-title">Learn from an Industry Leader</h2>
                        <p className="section-subtitle">
                            Dr. Kiran Talele brings three decades of academic excellence and real-world expertise
                            to create courses that transform careers
                        </p>
                    </div>

                    <div className="professor-card">
                        <div className="professor-photo-section">
                            <div className="photo-wrapper">
                                {/* Replace the src below with the actual path to Dr. Talele's photo in your project */}
                                <img src="/ktalele.png" alt="Dr. Kiran Talele" className="professor-photo" />
                                {/* If image doesn't load, the placeholder below will show */}
                                {/* <div className="photo-placeholder">
                                    <div className="photo-frame">
                                        <GraduationCap size={80} className="photo-icon" />
                                        <p className="photo-text">Add Dr. Talele's Photo Here</p>
                                    </div>
                                </div> */}
                            </div>

                            <div className="professor-quick-info">
                                <h3>Dr. Kiran Talele</h3>
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

                    {/* Educational Philosophy */}
                    <div className="philosophy-section">
                        <div className="philosophy-card">
                            <MessageCircle size={48} className="philosophy-icon" />
                            <h3>Teaching Philosophy</h3>
                            <p>
                                "Education is not just about transferring knowledge—it's about igniting curiosity,
                                fostering innovation, and preparing students to solve real-world challenges. With CourseZ,
                                I bring my three decades of academic and industry experience to create courses that don't
                                just teach concepts, but transform careers and lives."
                            </p>
                            <div className="philosophy-signature">
                                <span>— Dr. Kiran Talele</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Credentials Section */}
            <section id="credentials" className="credentials-section">
                <div className="credentials-container">
                    <div className="section-header">
                        <h2 className="section-title">Proven Track Record</h2>
                        <p className="section-subtitle">Decades of excellence in education, research, and innovation</p>
                    </div>

                    <div className="credentials-grid">
                        <div className="credential-card">
                            <div className="credential-number">1997</div>
                            <h4>Joined SPIT</h4>
                            <p>Started journey as faculty member in Electronics & Telecommunication Engineering</p>
                        </div>
                        <div className="credential-card">
                            <div className="credential-number">2008</div>
                            <h4>Excellence Award</h4>
                            <p>Received incentive for outstanding performance in academics and research from SPIT Management</p>
                        </div>
                        <div className="credential-card">
                            <div className="credential-number">2015-2025</div>
                            <h4>SP-TBI Leadership</h4>
                            <p>Co-Ordinator and now Director of Sardar Patel Technology Business Incubator</p>
                        </div>
                        <div className="credential-card">
                            <div className="credential-number">2019</div>
                            <h4>IEEE Recognition</h4>
                            <p>P.R. Bapat IEEE Bombay Section Outstanding Volunteer Award</p>
                        </div>
                        <div className="credential-card">
                            <div className="credential-number">2020</div>
                            <h4>IEEE Treasurer</h4>
                            <p>Appointed as Treasurer of IEEE Bombay Section</p>
                        </div>
                        <div className="credential-card">
                            <div className="credential-number">2022</div>
                            <h4>Dean Position</h4>
                            <p>Elevated to Dean of Students, Alumni & External Relations at SPIT</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact & Recognition Section */}
            <section className="impact-section">
                <div className="impact-container">
                    <div className="section-header">
                        <div className="section-badge">
                            <Trophy size={16} />
                            <span>Measurable Impact</span>
                        </div>
                        <h2 className="section-title">Making a Real Difference</h2>
                        <p className="section-subtitle">Numbers that showcase commitment to education and innovation</p>
                    </div>

                    <div className="impact-stats-grid">
                        <div className="impact-stat-card">
                            <div className="impact-icon">
                                <Users size={32} />
                            </div>
                            <div className="impact-number">5000+</div>
                            <div className="impact-label">Students Mentored</div>
                            <p className="impact-desc">Across 33+ years of teaching</p>
                        </div>

                        <div className="impact-stat-card">
                            <div className="impact-icon">
                                <Award size={32} />
                            </div>
                            <div className="impact-number">85+</div>
                            <div className="impact-label">Research Papers</div>
                            <p className="impact-desc">Published in top conferences</p>
                        </div>

                        <div className="impact-stat-card">
                            <div className="impact-icon">
                                <Lightbulb size={32} />
                            </div>
                            <div className="impact-number">22</div>
                            <div className="impact-label">Patents Filed</div>
                            <p className="impact-desc">Including granted patents</p>
                        </div>

                        <div className="impact-stat-card">
                            <div className="impact-icon">
                                <Building size={32} />
                            </div>
                            <div className="impact-number">3</div>
                            <div className="impact-label">Startups Founded</div>
                            <p className="impact-desc">Driving innovation & impact</p>
                        </div>
                    </div>

                    {/* Recognition Badges */}
                    <div className="recognition-section">
                        <h3 className="recognition-title">Recognized By</h3>
                        <div className="recognition-grid">
                            <div className="recognition-badge">
                                <div className="recognition-logo">
                                    <Building size={28} />
                                </div>
                                <div className="recognition-text">
                                    <strong>SPIT Mumbai</strong>
                                    <p>Premier Institute</p>
                                </div>
                            </div>
                            <div className="recognition-badge">
                                <div className="recognition-logo">
                                    <Award size={28} />
                                </div>
                                <div className="recognition-text">
                                    <strong>IEEE</strong>
                                    <p>Bombay Section</p>
                                </div>
                            </div>
                            <div className="recognition-badge">
                                <div className="recognition-logo">
                                    <Rocket size={28} />
                                </div>
                                <div className="recognition-text">
                                    <strong>SP-TBI</strong>
                                    <p>Govt. of India Funded</p>
                                </div>
                            </div>
                            <div className="recognition-badge">
                                <div className="recognition-logo">
                                    <Globe size={28} />
                                </div>
                                <div className="recognition-text">
                                    <strong>UK Patent Office</strong>
                                    <p>Design Patent 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="section-header">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Your journey to mastery in three simple steps</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card animate-fade-in">
                        <div className="step-number">1</div>
                        <Target className="step-icon" size={48} />
                        <h3>Choose Your Path</h3>
                        <p>
                            Select from expertly designed, curriculum-based courses created by Dr. Kiran Talele.
                            Each course is structured to build practical skills progressively.
                        </p>
                        <ul className="step-features">
                            <li>Structured learning modules</li>
                            <li>Interactive quizzes</li>
                            <li>Real-world applications</li>
                        </ul>
                    </div>

                    <div className="step-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="step-number">2</div>
                        <BookOpen className="step-icon" size={48} />
                        <h3>Learn & Practice</h3>
                        <p>
                            Engage with content backed by 33+ years of teaching experience. Benefit from
                            industry-aligned curriculum and hands-on projects.
                        </p>
                        <ul className="step-features">
                            <li>Video lectures by Dr. Talele</li>
                            <li>Practical assignments</li>
                            <li>Expert guidance</li>
                        </ul>
                    </div>

                    <div className="step-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="step-number">3</div>
                        <TrendingUp className="step-icon" size={48} />
                        <h3>Achieve & Grow</h3>
                        <p>
                            Earn recognized certificates and build a portfolio that demonstrates your expertise.
                            Join successful alumni in top companies.
                        </p>
                        <ul className="step-features">
                            <li>Professional certificates</li>
                            <li>Portfolio projects</li>
                            <li>Career advancement</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">Everything you need to succeed in your learning journey</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <GraduationCap size={32} />
                        </div>
                        <h3>Expert-Led Curriculum</h3>
                        <p>
                            Learn from courses designed by Dr. Kiran Talele, with 33+ years of teaching experience
                            and deep industry connections.
                        </p>
                        <div className="feature-badge">PhD Instructor</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <BarChart2 size={32} />
                        </div>
                        <h3>Progress Analytics</h3>
                        <p>
                            Track your learning with comprehensive dashboards showing module completion,
                            quiz scores, and skill development.
                        </p>
                        <div className="feature-badge">Real-time Tracking</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Shield size={32} />
                        </div>
                        <h3>Secure Platform</h3>
                        <p>
                            Your data and progress are protected with enterprise-grade security.
                            Focus on learning without worries.
                        </p>
                        <div className="feature-badge">Bank-level Security</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Globe size={32} />
                        </div>
                        <h3>Learn Anywhere</h3>
                        <p>
                            Access courses on any device with one login. Study at your pace,
                            whether you're at home or on the go.
                        </p>
                        <div className="feature-badge">Multi-device</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Users size={32} />
                        </div>
                        <h3>Student Community</h3>
                        <p>
                            Connect with SPIT students and learners worldwide. Collaborate on projects
                            and grow together.
                        </p>
                        <div className="feature-badge">500+ Students</div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-wrapper">
                            <Award size={32} />
                        </div>
                        <h3>Industry Certificates</h3>
                        <p>
                            Earn recognized certificates signed by Dr. Talele that validate your skills
                            and enhance your resume.
                        </p>
                        <div className="feature-badge">Verified Credentials</div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <div className="testimonials-container">
                    <div className="section-header">
                        <h2 className="section-title">Student Success Stories</h2>
                        <p className="section-subtitle">Real results from real students</p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>
                            <p className="testimonial-text">
                                "Dr. Talele's courses are exceptional. The curriculum is industry-aligned,
                                and his teaching style makes complex concepts easy to understand. Landed my
                                dream job at a top tech company!"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">SC</div>
                                <div>
                                    <h4>Sanika Chandorkar</h4>
                                    <p>Software Engineer, Google</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>
                            <p className="testimonial-text">
                                "The best investment in my education. Dr. Talele's real-world experience
                                and mentorship helped me transition from student to professional seamlessly.
                                Highly recommend!"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">RP</div>
                                <div>
                                    <h4>Rahul Patil</h4>
                                    <p>ML Engineer, Microsoft</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" />
                                ))}
                            </div>
                            <p className="testimonial-text">
                                "CourseZ transformed my understanding of signal processing. Dr. Talele's
                                teaching methodology bridges theory and practice perfectly. Now working on
                                cutting-edge AI projects!"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">PM</div>
                                <div>
                                    <h4>Priya Mehta</h4>
                                    <p>Data Scientist, Amazon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="social-proof">
                        <div className="social-proof-item">
                            <Building size={24} />
                            <div>
                                <strong>SPIT Affiliated</strong>
                                <p>Premier engineering institution</p>
                            </div>
                        </div>
                        <div className="social-proof-item">
                            <Award size={24} />
                            <div>
                                <strong>IEEE Member</strong>
                                <p>Global professional organization</p>
                            </div>
                        </div>
                        <div className="social-proof-item">
                            <Users size={24} />
                            <div>
                                <strong>500+ Alumni</strong>
                                <p>Working at top companies</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <div className="section-header">
                    <h2 className="section-title">Choose Your Plan</h2>
                    <p className="section-subtitle">Start free, upgrade as you grow</p>
                </div>

                <div className="pricing-grid">
                    <div className="pricing-card">
                        <div className="pricing-header">
                            <h3>Free</h3>
                            <p>Perfect for getting started</p>
                        </div>
                        <div className="pricing-price">
                            <span className="price-amount">₹0</span>
                            <span className="price-period">/forever</span>
                        </div>
                        <ul className="pricing-features">
                            <li><Check size={20} /> Access to 10+ courses</li>
                            <li><Check size={20} /> Basic progress tracking</li>
                            <li><Check size={20} /> Community access</li>
                            <li><Check size={20} /> Mobile & desktop apps</li>
                            <li><Check size={20} /> Course completion badges</li>
                        </ul>
                        <button className="pricing-btn btn-secondary" onClick={() => handleNavigation('/login')}>
                            Get Started Free
                        </button>
                    </div>

                    <div className="pricing-card pricing-featured">
                        <div className="pricing-badge">Most Popular</div>
                        <div className="pricing-header">
                            <h3>Pro</h3>
                            <p>For serious learners</p>
                        </div>
                        <div className="pricing-price">
                            <span className="price-amount">₹2,499</span>
                            <span className="price-period">/month</span>
                        </div>
                        <ul className="pricing-features">
                            <li><Check size={20} /> Everything in Free</li>
                            <li><Check size={20} /> Unlimited course access</li>
                            <li><Check size={20} /> Advanced analytics & insights</li>
                            <li><Check size={20} /> 1-on-1 mentorship sessions</li>
                            <li><Check size={20} /> Verified certificates</li>
                            <li><Check size={20} /> Priority support</li>
                            <li><Check size={20} /> Exclusive webinars</li>
                        </ul>
                        <button className="pricing-btn btn-primary" onClick={() => handleNavigation('/login')}>
                            Start 14-Day Free Trial
                        </button>
                        <p className="pricing-note">No credit card required</p>
                    </div>

                    <div className="pricing-card">
                        <div className="pricing-header">
                            <h3>Enterprise</h3>
                            <p>For institutions & teams</p>
                        </div>
                        <div className="pricing-price">
                            <span className="price-amount">Custom</span>
                            <span className="price-period">/year</span>
                        </div>
                        <ul className="pricing-features">
                            <li><Check size={20} /> Everything in Pro</li>
                            <li><Check size={20} /> Custom learning paths</li>
                            <li><Check size={20} /> Team analytics dashboard</li>
                            <li><Check size={20} /> Dedicated account manager</li>
                            <li><Check size={20} /> API access & integrations</li>
                            <li><Check size={20} /> SSO & SAML support</li>
                            <li><Check size={20} /> On-site training available</li>
                        </ul>
                        <button className="pricing-btn btn-secondary">
                            Contact Sales
                        </button>
                    </div>
                </div>

                {/* Money-back guarantee */}
                <div className="guarantee-badge">
                    <Shield size={20} />
                    <span>30-day money-back guarantee • Cancel anytime</span>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="faq-container">
                    <div className="section-header">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-subtitle">Everything you need to know about CourseZ</p>
                    </div>

                    <div className="faq-grid">
                        <div className="faq-item">
                            <div className="faq-question">
                                <MessageCircle size={24} className="faq-icon" />
                                <h4>Who is this platform for?</h4>
                            </div>
                            <p className="faq-answer">
                                CourseZ is designed for SPIT students, engineering students, and professionals looking to
                                enhance their skills in Electronics, Signal Processing, Machine Learning, and related fields.
                                Whether you're a beginner or advanced learner, our curriculum adapts to your level.
                            </p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <Award size={24} className="faq-icon" />
                                <h4>Are the certificates recognized?</h4>
                            </div>
                            <p className="faq-answer">
                                Yes! All certificates are signed by Dr. Kiran Talele and include verification codes.
                                They are recognized by employers and can be added to your LinkedIn profile and resume.
                                Pro members receive additional verified digital credentials.
                            </p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <Clock size={24} className="faq-icon" />
                                <h4>How much time do I need to invest?</h4>
                            </div>
                            <p className="faq-answer">
                                Courses are self-paced! Most students spend 3-5 hours per week. Complete courses at your
                                own speed, with lifetime access to all materials. Our mobile app lets you learn on the go,
                                making it easy to fit learning into your schedule.
                            </p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <Users size={24} className="faq-icon" />
                                <h4>Can I interact with Dr. Talele?</h4>
                            </div>
                            <p className="faq-answer">
                                Pro members get access to monthly live Q&A sessions, discussion forums moderated by Dr. Talele,
                                and can book 1-on-1 mentorship sessions. Free members can participate in community discussions
                                and attend select webinars.
                            </p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <Shield size={24} className="faq-icon" />
                                <h4>What if I'm not satisfied?</h4>
                            </div>
                            <p className="faq-answer">
                                We offer a 30-day money-back guarantee for Pro subscriptions. If you're not completely
                                satisfied with the quality and value, contact us within 30 days for a full refund.
                                No questions asked!
                            </p>
                        </div>

                        <div className="faq-item">
                            <div className="faq-question">
                                <Rocket size={24} className="faq-icon" />
                                <h4>How often is content updated?</h4>
                            </div>
                            <p className="faq-answer">
                                Courses are regularly updated to reflect the latest industry trends and technologies.
                                Dr. Talele adds new modules quarterly, and Pro members get immediate access to all new
                                content and updates at no additional cost.
                            </p>
                        </div>
                    </div>

                    <div className="faq-cta">
                        <p>Still have questions?</p>
                        <button className="btn-primary" onClick={() => window.location.href = 'mailto:talelesir@gmail.com'}>
                            <Mail size={18} />
                            <span>Contact Dr. Talele</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Career?</h2>
                        <p>
                            Join 500+ students learning from Dr. Kiran Talele's expert-led courses.
                            Start your journey today with our free plan.
                        </p>
                        <div className="cta-buttons">
                            <button className="btn-accent" onClick={() => handleNavigation('/login')}>
                                <span>Create Free Account</span>
                                <ArrowRight size={20} />
                            </button>
                            <button className="btn-outline" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                                Learn More
                            </button>
                        </div>
                        <div className="cta-trust">
                            <CheckCircle size={16} />
                            <span>No credit card required</span>
                            <span>•</span>
                            <CheckCircle size={16} />
                            <span>Start learning in minutes</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="contact-section">
                <div className="contact-container">
                    <div className="section-header">
                        <div className="section-badge">
                            <MessageCircle size={16} />
                            <span>Get In Touch</span>
                        </div>
                        <h2 className="section-title">Contact Us</h2>
                        <p className="section-subtitle">Have questions? We're here to help you on your learning journey.</p>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info-card card">
                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <Mail size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Email</h4>
                                    <p><a href="mailto:talelesir@gmail.com">talelesir@gmail.com</a></p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <Phone size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Phone</h4>
                                    <p><a href="tel:+919987030881">+91 99870 30881</a></p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon-wrapper">
                                    <Globe size={24} />
                                </div>
                                <div className="contact-text">
                                    <h4>Website</h4>
                                    <p><a href="https://www.talelesir.com" target="_blank" rel="noopener noreferrer">www.talelesir.com</a></p>
                                </div>
                            </div>

                            <div className="social-connect">
                                <h4>Follow Us</h4>
                                <div className="social-btns">
                                    <a href="https://www.linkedin.com/in/k-t-v-talele/" target="_blank" rel="noopener noreferrer" className="social-btn">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href="https://www.facebook.com/Kiran-Talele-1711929555720263" target="_blank" rel="noopener noreferrer" className="social-btn">
                                        <Facebook size={20} />
                                    </a>
                                    <a href="https://www.youtube.com/@midnight-masterclass" target="_blank" rel="noopener noreferrer" className="social-btn">
                                        <Play size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form-card card">
                            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Your Name" required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="Your Email" required />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea placeholder="How can we help you?" rows="4"></textarea>
                                </div>
                                <button type="submit" className="btn-primary btn-large">
                                    Send Message
                                    <Rocket size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <GraduationCap size={32} />
                                <h3>CourseZ</h3>
                            </div>
                            <p className="footer-description">
                                Empowering students and professionals worldwide with expert-led education
                                from Dr. Kiran Talele, Associate Professor at SPIT Mumbai.
                            </p>
                            <div className="footer-creator">
                                <Award size={18} />
                                <div>
                                    <strong>Created by Dr. Kiran Talele</strong>
                                    <p>Associate Professor, EXTC Department</p>
                                    <p>Sardar Patel Institute of Technology</p>
                                </div>
                            </div>
                        </div>

                        <div className="footer-links-grid">
                            <div className="footer-column">
                                <h4>Platform</h4>
                                <ul>
                                    <li><a href="#features">Features</a></li>
                                    <li><a href="#pricing">Pricing</a></li>
                                    <li><a href="#testimonials">Testimonials</a></li>
                                    <li><a href="#about">About Professor</a></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="https://www.youtube.com/@midnight-masterclass" target="_blank" rel="noopener noreferrer">YouTube Channel</a></li>
                                    <li><a href="https://www.talelesir.com" target="_blank" rel="noopener noreferrer">Official Website</a></li>
                                    <li><a href="#help">Help Center</a></li>
                                    <li><a href="#blog">Blog & Updates</a></li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4>Contact</h4>
                                <ul>
                                    <li>
                                        <Mail size={16} />
                                        <a href="mailto:talelesir@gmail.com">talelesir@gmail.com</a>
                                    </li>
                                    <li>
                                        <Phone size={16} />
                                        <a href="tel:+919987030881">+91 99870 30881</a>
                                    </li>
                                    <li>
                                        <ExternalLink size={16} />
                                        <a href="https://www.talelesir.com" target="_blank" rel="noopener noreferrer">www.talelesir.com</a>
                                    </li>
                                </ul>
                            </div>

                            <div className="footer-column">
                                <h4>Connect</h4>
                                <div className="footer-social-links">
                                    <a href="https://www.linkedin.com/in/k-t-v-talele/" target="_blank" rel="noopener noreferrer" className="social-link-large">
                                        <Linkedin size={20} />
                                        <span>LinkedIn</span>
                                    </a>
                                    <a href="https://www.facebook.com/Kiran-Talele-1711929555720263" target="_blank" rel="noopener noreferrer" className="social-link-large">
                                        <Facebook size={20} />
                                        <span>Facebook</span>
                                    </a>
                                    <a href="https://www.youtube.com/@midnight-masterclass" target="_blank" rel="noopener noreferrer" className="social-link-large">
                                        <Play size={20} />
                                        <span>YouTube</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="footer-bottom-content">
                            <p>&copy; 2025 CourseZ. Created by Dr. Kiran Talele. All rights reserved.</p>
                            <div className="footer-bottom-links">
                                <a href="#privacy">Privacy Policy</a>
                                <span>•</span>
                                <a href="#terms">Terms of Service</a>
                                <span>•</span>
                                <a href="#cookies">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;