import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, BarChart2, Shield, Users, Globe,
    Star, Check, Target, TrendingUp, Sparkles,
    Clock, Trophy, Rocket, Heart, Zap,
    GraduationCap, FileText, Phone, Megaphone, CalendarDays,
    ArrowRight, Building, MessageCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PublicFooter from '../components/PublicFooter';
import {
    fetchAcademicCourses,
    fetchPublicAnnouncements,
    fetchPublicTestimonials,
    fetchPublicTicker,
    fetchPublicStats
} from '../api/api';

const FALLBACK_ANNOUNCEMENTS = [
    { date: '10-Mar-2026', text: 'New module description PDFs are now available in course outlines.' },
    { date: '08-Mar-2026', text: 'Student self-registration is live. No admin approval required for signup.' },
    { date: '05-Mar-2026', text: 'Course access now follows 6-month validity from your enrollment date.' },
    { date: '01-Mar-2026', text: 'Drag-and-drop curriculum ordering for chapters and subchapters is enabled.' }
];

const FALLBACK_BREAKING_UPDATES = [
    'New batch enrollment opens on 15-Mar-2026',
    'Seminar registrations are now live for April faculty sessions',
    'Course outline now supports module description PDFs',
    'Student self-registration is active with instant account creation'
];

const FALLBACK_TESTIMONIALS = [
    {
        _id: 'fallback-1',
        text: "Dr. TALELE's courses are exceptional. The curriculum is industry-aligned, and his teaching style makes complex concepts easy to understand.",
        rating: 5,
        author: 'Sanika Chandorkar',
        initials: 'SC',
        role: 'Student',
        courseTitle: 'Digital Signal Processing'
    },
    {
        _id: 'fallback-2',
        text: 'The best investment in my education. The structure and depth of the modules helped me move from theory to real implementation confidently.',
        rating: 5,
        author: 'Rahul Patil',
        initials: 'RP',
        role: 'Student',
        courseTitle: 'Digital Image Processing'
    },
    {
        _id: 'fallback-3',
        text: 'CourseZ transformed my understanding of signal processing. The lessons bridge theory and practice in a way that actually sticks.',
        rating: 5,
        author: 'Priya Mehta',
        initials: 'PM',
        role: 'Student',
        courseTitle: 'Digital Signal Processing'
    }
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [publicCourses, setPublicCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [breakingUpdates, setBreakingUpdates] = useState([]);
    const [publicTestimonials, setPublicTestimonials] = useState([]);
    const [platformStats, setPlatformStats] = useState({
        studentsEnrolled: null,
        coursesPlanned: null,
        expertProfessors: null
    });

    const showcaseSlides = [
        {
            image: '/generated/img1.png',
            title: 'Launch Your Engineering Career',
            subtitle: 'Industry-ready learning pathways with guided progress.'
        },
        {
            image: '/generated/img2.png',
            title: 'Learn from Academic Experts',
            subtitle: 'Structured modules designed by experienced faculty.'
        },
        {
            image: '/generated/img3.png',
            title: 'Build Skills That Matter',
            subtitle: 'From foundations to advanced topics, all in one place.'
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                const [courses, announcementData, tickerData, stats, testimonials] = await Promise.all([
                    fetchAcademicCourses(),
                    fetchPublicAnnouncements(),
                    fetchPublicTicker(),
                    fetchPublicStats(),
                    fetchPublicTestimonials(12)
                ]);
                setPublicCourses(courses);
                setPublicTestimonials(Array.isArray(testimonials) ? testimonials : []);
                setPlatformStats({
                    studentsEnrolled: Number.isFinite(stats?.studentsEnrolled) ? stats.studentsEnrolled : null,
                    coursesPlanned: Number.isFinite(stats?.coursesPlanned) ? stats.coursesPlanned : null,
                    expertProfessors: Number.isFinite(stats?.expertProfessors) ? stats.expertProfessors : null
                });
                setAnnouncements(
                    (announcementData || []).map((item) => ({
                        date: item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })
                            : 'Latest',
                        text: item.message
                    }))
                );
                setBreakingUpdates(
                    (tickerData || []).map((item) => item.tickerText || item.title || item.message).filter(Boolean)
                );
            } catch (err) {
                console.error("Failed to load landing page data", err);
                setAnnouncements(FALLBACK_ANNOUNCEMENTS);
                setBreakingUpdates(FALLBACK_BREAKING_UPDATES);
                setPublicTestimonials([]);
            } finally {
                setLoading(false);
            }
        };
        loadData();

        // Handle initial hash scroll
        if (window.location.hash === '#testimonials') {
            const element = document.getElementById('testimonials');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
        }, 4500);
        return () => clearInterval(timer);
    }, [showcaseSlides.length]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const getCoursePriority = (title = '') => {
        const normalizedTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (normalizedTitle.includes('image') && normalizedTitle.includes('processing')) {
            return 0;
        }

        if (normalizedTitle.includes('signal') && normalizedTitle.includes('processing')) {
            return 1;
        }

        return Number.MAX_SAFE_INTEGER;
    };

    const getCourseTileDescription = (course) => {
        const rawDescription = (course?.description || '').trim();
        const normalizedTitle = (course?.title || '').toLowerCase();
        const looksPlaceholder = !rawDescription || rawDescription.toLowerCase().includes('new course by instructor');

        if (looksPlaceholder && normalizedTitle.includes('signal') && normalizedTitle.includes('processing')) {
            return 'Learn sampling, transforms, filtering, and practical signal analysis for real systems.';
        }

        if (looksPlaceholder && normalizedTitle.includes('image') && normalizedTitle.includes('processing')) {
            return 'Master enhancement, segmentation, and feature extraction using modern image processing techniques.';
        }

        if (rawDescription.length > 80) {
            return `${rawDescription.substring(0, 80)}...`;
        }

        return rawDescription || 'Explore this course with structured modules and practical learning outcomes.';
    };

    const featuredCourses = publicCourses
        .map((course, index) => ({ course, index }))
        .sort((a, b) => {
            const rankA = getCoursePriority(a.course.title);
            const rankB = getCoursePriority(b.course.title);

            if (rankA !== rankB) return rankA - rankB;
            return a.index - b.index;
        })
        .map((item) => item.course)
        .slice(0, 3);

    const formatStatValue = (value, withPlus = false) => {
        if (!Number.isFinite(value)) return '--';
        return withPlus && value > 0 ? `${value}+` : String(value);
    };

    return (
        <div className="landing-page">
            {/* Background Gradient Orbs */}
            <div className="bg-gradient-orb bg-gradient-orb-1"></div>
            <div className="bg-gradient-orb bg-gradient-orb-2"></div>
            <div className="bg-gradient-orb bg-gradient-orb-3"></div>

            {/* Home Showcase: Slider + Announcements */}
            <section className="home-showcase-section">
                <div className="home-showcase-grid">
                    <div className="home-showcase-slider">
                        <div className="showcase-badge">
                            <Sparkles size={16} />
                            Brought to you by Academic Experts
                        </div>
                        <div className="showcase-image-wrap">
                            {showcaseSlides.map((slide, index) => (
                                <img
                                    key={slide.image}
                                    src={slide.image}
                                    alt={slide.title}
                                    className={`showcase-image ${index === activeSlide ? 'active' : ''}`}
                                />
                            ))}
                            <div className="showcase-overlay">
                                <h1>
                                    {showcaseSlides[activeSlide].title} with <span className="brand-course">Course</span><span className="brand-z">Z</span>
                                </h1>
                                <p>{showcaseSlides[activeSlide].subtitle}</p>
                            </div>
                        </div>
                        <div className="showcase-dots">
                            {showcaseSlides.map((_, index) => (
                                <button
                                    key={`dot-${index}`}
                                    type="button"
                                    className={`showcase-dot ${activeSlide === index ? 'active' : ''}`}
                                    onClick={() => setActiveSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <aside className="home-announcements-panel">
                        <div className="announcements-header">
                            <Megaphone size={20} />
                            <h3>Announcements</h3>
                        </div>
                        <div className="announcements-list">
                            {(announcements.length ? announcements : FALLBACK_ANNOUNCEMENTS).map((item, idx) => (
                                <div className="announcement-item" key={`${item.date}-${idx}`}>
                                    <div className="announcement-date">
                                        <CalendarDays size={14} />
                                        {item.date}
                                    </div>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>

            <section className="breaking-ticker-wrap" aria-label="Breaking updates">
                <div className="breaking-label">
                    <Megaphone size={16} />
                    <span>Breaking</span>
                </div>
                <div className="breaking-track">
                    <div className="breaking-content">
                        {(breakingUpdates.length ? breakingUpdates : FALLBACK_BREAKING_UPDATES).map((item, idx) => (
                            <span key={`breaking-a-${idx}`} className="breaking-item">
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className="breaking-content" aria-hidden="true">
                        {(breakingUpdates.length ? breakingUpdates : FALLBACK_BREAKING_UPDATES).map((item, idx) => (
                            <span key={`breaking-b-${idx}`} className="breaking-item">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* CourseZ Intro Paragraph Section */}
            <section className="coursez-description-section" style={{ textAlign: 'left' }}>
                <div className="animate-slide-up" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem' }}>
                    <p className="hero-subtitle" style={{ fontSize: '1.18rem', lineHeight: '1.75', color: 'var(--text-main)', margin: 0 }}>
                        <span className="brand-course">Course</span><span className="brand-z">Z</span> is an online learning platform designed to provide high-quality, structured education in a flexible and
                        accessible way. It enables learners to gain knowledge, develop practical skills, and improve professional
                        competence through well-organized digital courses.

                        The platform offers courses across technology, management, entrepreneurship, and professional development.
                        Each course is created by academic experts and includes video lectures, assessments, and certificates to ensure clear
                        and measurable learning outcomes.

                        Blending proven educational methods with modern digital tools, <span className="brand-course">Course</span><span className="brand-z">Z</span> enables learners to build practical
                        skills, enhance professional competence, and advance their careers with confidence.
                    </p>
                    <p className="hero-subtitle" style={{ fontStyle: 'italic', marginTop: '1.25rem', color: 'var(--primary)', fontWeight: '600', fontSize: '1.02rem' }}>
                        Don't just study engineering—become the engineer companies fight to hire.
                    </p>
                </div>
            </section>

            {/* Buttons and Stats Section */}
            <section className="hero-cta-section" style={{ textAlign: 'center' }}>
                <div className="hero-buttons animate-slide-up" style={{ justifyContent: 'center', display: 'flex', gap: '1rem', marginBottom: '1.5rem', animationDelay: '0.2s' }}>
                    <button
                        className="btn-primary btn-large"
                        onClick={() => handleNavigation('/login')}
                        style={{ fontSize: '1rem', padding: '12px 24px' }}
                    >
                        <span>Start Learning Today</span>
                        <ArrowRight size={20} />
                    </button>
                    <button
                        className="btn-outline btn-large"
                        onClick={() => handleNavigation('/professor')}
                        style={{ fontSize: '1rem', padding: '12px 24px' }}
                    >
                        <Users size={18} />
                        <span>Meet the Faculty</span>
                    </button>
                </div>

                <div className="hero-stats animate-slide-up" style={{ justifyContent: 'center', display: 'flex', gap: '2rem', flexWrap: 'wrap', animationDelay: '0.4s' }}>
                    <div className="stat-card" style={{ minWidth: '200px' }}>
                        <div className="stat-icon">
                            <Users size={32} />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '2rem' }}>{formatStatValue(platformStats.studentsEnrolled, true)}</h3>
                            <p>Students Enrolled</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ minWidth: '200px' }}>
                        <div className="stat-icon">
                            <BookOpen size={32} />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '2rem' }}>{formatStatValue(platformStats.coursesPlanned, true)}</h3>
                            <p>Courses Planned</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ minWidth: '200px' }}>
                        <div className="stat-icon">
                            <Award size={32} />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '2rem' }}>{formatStatValue(platformStats.expertProfessors)}</h3>
                            <p>Expert Professors</p>
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
                            Select from expertly designed, curriculum-based courses by academic experts.
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
                            <li>Video lectures by academic experts</li>
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
                            Learn from courses designed by SPIT's elite faculty, with 50+ years of combined teaching experience
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
                            Earn recognized certificates signed by SPIT faculty that validate your skills
                            and enhance your resume.
                        </p>
                        <div className="feature-badge">Verified Credentials</div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="courses-section" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.02) 50%, transparent 100%)' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Be First to Access Premium Engineering Courses</h2>
                    <p className="section-subtitle">Secure your spot for exclusive courses launching Q1 2025. Led by SPIT faculty with industry experience.</p>
                </div>
                <div className="courses-container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="courses-preview" style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                            {featuredCourses.map((course, index) => {
                                const Icon = LucideIcons[course.iconName] || BarChart2;
                                const themes = ['sticky-yellow', 'sticky-cyan', 'sticky-pink'];
                                const rotations = ['rotate-1', 'rotate-2', 'rotate-3'];
                                return (
                                    <div key={course._id} className={`course-sticky-note ${themes[index % 3]} ${rotations[index % 3]}`}>
                                        <Icon size={40} className="sticky-icon" />
                                        <h4>{index === 2 ? 'Drone Design' : course.title}</h4>
                                        <p>
                                            {index === 2
                                                ? 'Design UAV systems with aerodynamics, flight control, onboard electronics, and mission-ready prototypes.'
                                                : getCourseTileDescription(course)}
                                        </p>
                                    </div>
                                );
                            })}
                            {!loading && publicCourses.length === 0 && (
                                <>
                                    <div className="course-sticky-note sticky-yellow rotate-1">
                                        <BarChart2 size={40} className="sticky-icon" />
                                        <h4>Digital Image Processing</h4>
                                        <p>Learn image enhancement, feature extraction, and practical vision workflows.</p>
                                    </div>
                                    <div className="course-sticky-note sticky-cyan rotate-2">
                                        <Sparkles size={40} className="sticky-icon" />
                                        <h4>Digital Signal Processing</h4>
                                        <p>Master advanced signal processing techniques with industry-standard tools.</p>
                                    </div>
                                    <div className="course-sticky-note sticky-pink rotate-3">
                                        <Zap size={40} className="sticky-icon" />
                                        <h4>Drone Design</h4>
                                        <p>Design UAV systems with aerodynamics, flight control, onboard electronics, and mission-ready prototypes.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <div className="testimonials-container">
                    <div className="section-header">
                        <h2 className="section-title">Testimonials</h2>
                        <p className="section-subtitle">Real results from real students</p>
                    </div>

                    <div className="testimonials-grid">
                        {(publicTestimonials.length ? publicTestimonials : FALLBACK_TESTIMONIALS).map((testimonial) => (
                            <div className="testimonial-card" key={testimonial._id}>
                                <div className="testimonial-rating">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < (testimonial.rating || 0) ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>
                                <p className="testimonial-text">
                                    "{testimonial.text}"
                                </p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{testimonial.initials}</div>
                                    <div>
                                        <h4>{testimonial.author}</h4>
                                        <p>{testimonial.courseTitle ? `${testimonial.role} | ${testimonial.courseTitle}` : testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {false && (
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


            </section>
            )}

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="faq-container">
                    <div className="section-header">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-subtitle">Everything you need to know about <span className="brand-course">Course</span><span className="brand-z">Z</span></p>
                    </div>

                    <div className="faq-grid">
                        <div className="faq-item">
                            <div className="faq-question">
                                <MessageCircle size={24} className="faq-icon" />
                                <h4>Who is this platform for?</h4>
                            </div>
                            <p className="faq-answer">
                                <span className="brand-course">Course</span><span className="brand-z">Z</span> is designed for SPIT students, engineering students, and professionals looking to
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
                                Yes! All certificates are signed by Dr. Kiran TALELE and include verification codes.
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
                                <h4>Can I interact with Dr. TALELE?</h4>
                            </div>
                            <p className="faq-answer">
                                Pro members get access to monthly live Q&A sessions, discussion forums moderated by Dr. TALELE,
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
                                Dr. TALELE adds new modules quarterly, and Pro members get immediate access to all new
                                content and updates at no additional cost.
                            </p>
                        </div>
                    </div>

                </div>
            </section>



            {/* Footer */}
            <PublicFooter />
        </div>
    );
};

export default LandingPage;



