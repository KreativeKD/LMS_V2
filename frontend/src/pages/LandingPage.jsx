import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, Award, BarChart2, Shield, Users, Globe, 
    Star, Check, Zap, Target, TrendingUp, Sparkles,
    Clock, Trophy, Rocket, Heart, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

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

            {/* Navigation */}
            <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-logo">CourseZ</div>
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
                        <span className="badge">
                            <Sparkles size={16} />
                            Brought By SPIT Faculty
                        </span>
                    </div>
                    <h1 className="hero-title">
                        Master Your Future with <span className="gradient-text">CourseZ</span>
                    </h1>
                    <p className="hero-subtitle">
                        Transform your career with cutting-edge courses, personalized AI guidance, 
                        and a thriving community of passionate learners worldwide.
                        Personalized Lecture by Dr. Kiran Talele for SPIT Students.
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="btn-primary"
                            onClick={() => handleNavigation('/login')}
                        >
                            Get Started Free
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Features
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <Users className="icon-accent" size={28} />
                            <h3>500+</h3>
                            <p>Active Learners</p>
                        </div>
                        <div className="stat-card">
                            <BookOpen className="icon-accent" size={28} />
                            <h3>10+</h3>
                            <p>Expert Cirriculum Based Courses</p>
                        </div>
                        <div className="stat-card">
                            <Award className="icon-accent" size={28} />
                            <h3>98%</h3>
                            <p>Success Rate</p>
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
                            <h4>Achievement Unlocked!</h4>
                            <p>Course completed With Certificates</p>
                        </div>
                    </div>
                    <div className="floating-card floating-card-2">
                        <div className="floating-icon">
                            <Rocket size={20} />
                        </div>
                        <div>
                            <h4>Learning Streak</h4>
                            <p>15 days in a row</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">Your journey to mastery in three simple steps</p>
                
                <div className="steps-grid">
                    <div className="step-card animate-fade-in">
                        <div className="step-number">1</div>
                        <Target className="step-icon" size={48} />
                        <h3>Choose Your Path</h3>
                        <p>
                            Select your course, start by completing modules.
                            Quiz will test your knowledge and help you to learn better.
                        </p>
                    </div>

                    <div className="step-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="step-number">2</div>
                        <BookOpen className="step-icon" size={48} />
                        <h3>Learn & Practice</h3>
                        <p>
                            Engage with interactive content, hands-on projects, and real-world 
                            challenges designed by industry experts.
                        </p>
                    </div>

                    <div className="step-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="step-number">3</div>
                        <TrendingUp className="step-icon" size={48} />
                        <h3>Achieve & Grow</h3>
                        <p>
                            Earn industry-recognized certificates, build your portfolio, 
                            and accelerate your career with confidence.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <h2 className="section-title">Powerful Features</h2>
                <p className="section-subtitle">Everything you need to succeed in your learning journey</p>
                
                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <BarChart2 size={32} />
                        </div>
                        <h3>Smart Analytics</h3>
                        <p>
                            Track your progress with detailed insights, performance metrics, 
                            and personalized recommendations to stay on track.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Shield size={32} />
                        </div>
                        <h3>Enterprise Security</h3>
                        <p>
                            Bank-level encryption and security protocols ensure your data 
                            and achievements are always protected.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Globe size={32} />
                        </div>
                        <h3>Learn Anywhere</h3>
                        <p>
                            Access premium content on any device.
                            Just one login for all devices.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Users size={32} />
                        </div>
                        <h3>Global Community</h3>
                        <p>
                            Connect with thousands of learners and mentors worldwide. 
                            Collaborate, share, and grow together.
                        </p>
                    </div>

                    {/* <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Zap size={32} />
                        </div>
                        <h3>AI Assistant</h3>
                        <p>
                            Get instant help with 24/7 AI tutoring, personalized study plans, 
                            and smart content recommendations.
                        </p>
                    </div> */}

                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Award size={32} />
                        </div>
                        <h3>Certifications</h3>
                        <p>
                            Earn industry-recognized credentials that boost your resume 
                            and open doors to new opportunities.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="testimonials-container">
                    <h2 className="section-title">Loved by Learners</h2>
                    <p className="section-subtitle">See what our students have to say</p>
                    
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <div className="testimonial-avatar">🎓</div>
                                <div className="testimonial-info">
                                    <h4>Sarah Chen</h4>
                                    <p>Full Stack Developer</p>
                                </div>
                            </div>
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="testimonial-text">
                                "LMS Pro completely transformed my career. The courses are practical, 
                                the community is supportive, and I landed my dream job in just 6 months!"
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <div className="testimonial-avatar">🎨</div>
                                <div className="testimonial-info">
                                    <h4>Marcus Rodriguez</h4>
                                    <p>UX Designer</p>
                                </div>
                            </div>
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="testimonial-text">
                                "The AI-powered learning paths adapted perfectly to my pace. 
                                Best investment in my education I've ever made!"
                            </p>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-header">
                                <div className="testimonial-avatar">📊</div>
                                <div className="testimonial-info">
                                    <h4>Emily Watson</h4>
                                    <p>Data Scientist</p>
                                </div>
                            </div>
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="testimonial-text">
                                "From beginner to professional in months. The structured approach 
                                and real-world projects made all the difference."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section">
                <h2 className="section-title">Choose Your Plan</h2>
                <p className="section-subtitle">Start free, scale as you grow</p>
                
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h3>Starter</h3>
                        <div className="pricing-price">Free</div>
                        <p className="pricing-period">Forever</p>
                        <ul className="pricing-features">
                            <li><Check className="check-icon" size={20} /> 50+ courses</li>
                            <li><Check className="check-icon" size={20} /> Basic tracking</li>
                            <li><Check className="check-icon" size={20} /> Community access</li>
                            <li><Check className="check-icon" size={20} /> Mobile app</li>
                        </ul>
                        <button className="btn-secondary" style={{ width: '100%' }}>
                            Get Started
                        </button>
                    </div>

                    <div className="pricing-card featured">
                        <div className="pricing-badge">Most Popular</div>
                        <h3>Pro</h3>
                        <div className="pricing-price">$29</div>
                        <p className="pricing-period">per month</p>
                        <ul className="pricing-features">
                            <li><Check className="check-icon" size={20} /> Unlimited courses</li>
                            <li><Check className="check-icon" size={20} /> AI recommendations</li>
                            <li><Check className="check-icon" size={20} /> 1-on-1 mentorship</li>
                            <li><Check className="check-icon" size={20} /> Certificates</li>
                            <li><Check className="check-icon" size={20} /> Priority support</li>
                        </ul>
                        <button className="btn-primary" style={{ width: '100%' }}>
                            Start Free Trial
                        </button>
                    </div>

                    <div className="pricing-card">
                        <h3>Enterprise</h3>
                        <div className="pricing-price">Custom</div>
                        <p className="pricing-period">Contact us</p>
                        <ul className="pricing-features">
                            <li><Check className="check-icon" size={20} /> Custom paths</li>
                            <li><Check className="check-icon" size={20} /> Team analytics</li>
                            <li><Check className="check-icon" size={20} /> Account manager</li>
                            <li><Check className="check-icon" size={20} /> API access</li>
                            <li><Check className="check-icon" size={20} /> SSO integration</li>
                        </ul>
                        <button className="btn-secondary" style={{ width: '100%' }}>
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Ready to Start Your Journey?</h2>
                        <p>Join 50,000+ learners transforming their careers today.</p>
                        <button
                            className="btn-accent"
                            onClick={() => handleNavigation('/login')}
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>CourseZ</h3>
                        <p>
                            Empowering learners worldwide with cutting-edge education 
                            and career-focused training programs.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>Product</h4>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#enterprise">Enterprise</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#press">Press Kit</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Support</h4>
                        <ul className="footer-links">
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#status">Status</a></li>
                            <li><a href="#community">Community</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 CourseZ. All rights reserved.</p>
                    <div className="footer-social">
                        <a href="#" className="social-link"><Facebook size={18} /></a>
                        <a href="#" className="social-link"><Twitter size={18} /></a>
                        <a href="#" className="social-link"><Instagram size={18} /></a>
                        <a href="#" className="social-link"><Linkedin size={18} /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;