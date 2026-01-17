import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, BarChart2, Shield, Users, Globe,
    Star, Check, Target, TrendingUp, Sparkles,
    Clock, Trophy, Rocket, Heart, Zap,
    GraduationCap, FileText, Mail, Phone,
    CheckCircle, ArrowRight, Building, MessageCircle
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Handle initial hash scroll
        if (window.location.hash === '#testimonials') {
            const element = document.getElementById('testimonials');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }

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
            <PublicNavbar scrolled={scrolled} />

            {/* Title Section */}
            <section className="hero-title-section" style={{ padding: '8rem 4rem 4rem', textAlign: 'center', background: 'var(--background)' }}>
                <div className="animate-slide-up">
                    <div className="badge-container" style={{ justifyContent: 'center', marginBottom: '1.0rem' }}>
                        <span className="badge badge-premium">
                            <Sparkles size={16} />
                            <span>Brought to you by Academic Experts</span>
                        </span>
                    </div>
                    <h1 className="hero-title" style={{ fontSize: '4rem', maxWidth: '1200px', margin: '0 auto', lineHeight: '1.0' }}>
                        Launch Your Engineering Career with <span className="gradient-text">CourseZ</span>
                    </h1>
                </div>
            </section>

            {/* Top Banner Images (Stacked Vertically) */}
            <section className="top-banner-images" style={{ width: '100%', padding: '0' }}>
  <div style={{ 
    display: 'flex', 
    flexDirection: 'row', // Changed from column to row
    width: '100%', 
    gap: '1rem' 
  }}>
    {/* Width changed to 33.33% so three items fit in one row */}
    <div className="animate-fade-in" style={{ width: '33.33%', height: '50vh', minHeight: '500px', overflow: 'hidden' }}>
      <img src="/generated/img1.png" alt="Engineering Hub" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
    
    <div className="animate-fade-in" style={{ width: '33.33%', height: '50vh', minHeight: '500px', overflow: 'hidden', animationDelay: '0.2s' }}>
      <img src="/generated/img2.png" alt="Advanced Learning" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
    
    <div className="animate-fade-in" style={{ width: '33.33%', height: '50vh', minHeight: '500px', overflow: 'hidden', animationDelay: '0.4s' }}>
      <img src="/generated/img3.png" alt="Future of Engineering" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  </div>
</section>

            {/* CourseZ Intro Paragraph Section */}
            <section className="coursez-description-section" style={{ padding: '6rem 4rem 2rem', textAlign: 'center' }}>
                <div className="animate-slide-up" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p className="hero-subtitle" style={{ fontSize: '1.5rem', lineHeight: '1.8', color: 'var(--text-main)', margin: 0 }}>
                        CourseZ is an online learning platform designed to provide high-quality, structured education in a flexible and 
                        accessible way. It enables learners to gain knowledge, develop practical skills, and improve professional 
                        competence through well-organized digital courses.
                        <br /><br />
                        The platform offers courses across technology, management, entrepreneurship, and professional development. 
                        Each course is created by experts and includes video lectures, assessments, and certificates to ensure clear 
                        and measurable learning outcomes.
                        <br /><br />
                        Blending proven educational methods with modern digital tools, CourseZ enables learners to build practical 
                        skills, enhance professional competence, and advance their careers with confidence.
                    </p>
                    <p className="hero-subtitle" style={{ fontStyle: 'italic', marginTop: '2rem', color: 'var(--primary)', fontWeight: '600', fontSize: '1.25rem' }}>
                        Don't just study engineering—become the engineer companies fight to hire.
                    </p>
                </div>
            </section>

            {/* Buttons and Stats Section */}
            <section className="hero-cta-section" style={{ padding: '2rem 4rem 6rem', textAlign: 'center' }}>
                <div className="hero-buttons animate-slide-up" style={{ justifyContent: 'center', display: 'flex', gap: '1.5rem', marginBottom: '5rem', animationDelay: '0.2s' }}>
                    <button
                        className="btn-primary btn-large"
                        onClick={() => handleNavigation('/login')}
                        style={{ fontSize: '1.2rem', padding: '18px 40px' }}
                    >
                        <span>Start Learning Today</span>
                        <ArrowRight size={22} />
                    </button>
                    <button
                        className="btn-outline btn-large"
                        onClick={() => handleNavigation('/professor')}
                        style={{ fontSize: '1.2rem', padding: '18px 40px' }}
                    >
                        <Users size={20} />
                        <span>Meet the Faculty</span>
                    </button>
                </div>

                <div className="hero-stats animate-slide-up" style={{ justifyContent: 'center', display: 'flex', gap: '3rem', flexWrap: 'wrap', animationDelay: '0.4s' }}>
                    <div className="stat-card" style={{ minWidth: '200px' }}>
                        <div className="stat-icon">
                            <Users size={32} />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '2rem' }}>500+</h3>
                            <p>Students Enrolled</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ minWidth: '200px' }}>
                        <div className="stat-icon">
                            <BookOpen size={32} />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '2rem' }}>6+</h3>
                            <p>Courses Planned</p>
                        </div>
                    </div>
                    <div className="stat-card" style={{ minWidth: '200px' }}>
                        <div className="stat-icon">
                            <Award size={32} />
                        </div>
                        <div className="stat-content">
                            <h3 style={{ fontSize: '2rem' }}>3</h3>
                            <p>Expert Professors</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Faculty Preview Section */}
            <section className="faculty-preview-section" style={{ padding: '3rem 4rem', background: 'var(--background)' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Meet Your Expert Faculty</h2>
                    <p className="section-subtitle">Learn from industry veterans with decades of experience</p>
                </div>
                <div className="faculty-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                    <div className="faculty-preview-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => handleNavigation('/professor')}>
                        <img src="/ktalele.png" alt="Dr. Kiran TALELE" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid var(--primary)' }} />
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Dr. Kiran TALELE</h3>
                        <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>PhD, Associate Professor</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>33+ years experience • 85+ publications • 22 patents</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>Signal Processing</span>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>AI & ML</span>
                        </div>
                    </div>
                    <div className="faculty-preview-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => handleNavigation('/professor')}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid var(--primary)', background: 'var(--text-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>SJ</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Dr. Sarah Johnson</h3>
                        <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>PhD, Professor</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>28+ years experience • 150+ publications • 18 patents</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>AI & ML</span>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>NLP</span>
                        </div>
                    </div>
                    <div className="faculty-preview-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }} onClick={() => handleNavigation('/professor')}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', border: '3px solid var(--primary)', background: 'var(--text-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>MC</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Dr. Michael Chen</h3>
                        <p style={{ color: 'var(--primary)', marginBottom: '1rem' }}>PhD, Assistant Professor</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>15+ years experience • 60+ publications • 8 patents</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>Embedded Systems</span>
                            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>IoT</span>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button className="btn-secondary" onClick={() => handleNavigation('/professor')}>
                        <Users size={18} />
                        <span>View All Faculty</span>
                    </button>
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
                            Select from expertly designed, curriculum-based courses created by Dr. Kiran TALELE.
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
                            <li>Video lectures by Dr. TALELE</li>
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
            <section className="courses-section" style={{ padding: '3rem 4rem', background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.02) 50%, transparent 100%)' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title">Be First to Access Premium Engineering Courses</h2>
                    <p className="section-subtitle">Secure your spot for exclusive courses launching Q1 2025. Led by SPIT faculty with industry experience.</p>
                </div>
                <div className="courses-container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="courses-preview" style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', marginBottom: '2rem' }}>
                            <div className="course-sticky-note sticky-yellow rotate-1">
                                <BarChart2 size={40} className="sticky-icon" />
                                <h4>Digital Signal Processing</h4>
                                <p>Master advanced signal processing techniques with industry-standard tools.</p>
                            </div>
                            <div className="course-sticky-note sticky-cyan rotate-2">
                                <Sparkles size={40} className="sticky-icon" />
                                <h4>AI & Machine Learning</h4>
                                <p>Build cutting-edge AI solutions from neural networks to deep learning models.</p>
                            </div>
                            <div className="course-sticky-note sticky-pink rotate-3">
                                <Zap size={40} className="sticky-icon" />
                                <h4>Embedded Systems & IoT</h4>
                                <p>Design next-gen connected devices using high-performance microcontrollers.</p>
                            </div>
                        </div>
                        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '2rem' }}>Positions limited. Early access guarantees premium mentorship opportunities.</p>
                    </div>
                    <div className="email-capture" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Join 500+ Students on the Waitlist</h3>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Get notified when courses launch and receive exclusive early access.</p>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! We\'ll notify you when courses launch.'); }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <input type="email" placeholder="Enter your email" required style={{ flex: '1', minWidth: '250px' }} />
                            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                                <Mail size={18} />
                                <span>Notify Me</span>
                            </button>
                        </form>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>No spam, unsubscribe anytime.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section" style={{ padding: '3rem 4rem' }}>
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
                                "Dr. TALELE's courses are exceptional. The curriculum is industry-aligned,
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
                                "The best investment in my education. Dr. TALELE's real-world experience
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
                                "CourseZ transformed my understanding of signal processing. Dr. TALELE's
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

                    <div className="faq-cta">
                        <p>Still have questions?</p>
                        <button className="btn-primary" onClick={() => window.location.href = 'mailto:talelesir@gmail.com'}>
                            <Mail size={18} />
                            <span>Contact Dr. TALELE</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" style={{ padding: '3rem 4rem' }}>
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Launch Your Engineering Career Today</h2>
                        <p>
                            Join 500+ ambitious students learning from SPIT's elite faculty.
                            Transform theory into industry-ready skills that companies demand.
                        </p>
                        <div className="cta-buttons">
                            <button className="btn-accent" onClick={() => handleNavigation('/login')}>
                                <span>Create Account</span>
                                <ArrowRight size={20} />
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


            {/* Footer */}
            <PublicFooter />
        </div>
    );
};

export default LandingPage;