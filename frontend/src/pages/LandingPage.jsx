import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, BarChart2, Shield, Users, Globe,
    Star, Check, Target, TrendingUp, Sparkles,
    Clock, Trophy, Rocket, Heart,
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

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-slide-left">
                    {/*to be removed*/}
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
                        Learn from Dr. Kiran TALELE, an award-winning professor with 85+ research publications
                        and 22 patents. Experience curriculum-designed courses that transform students into
                        industry-ready professionals.
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="btn-primary btn-large"
                            onClick={() => handleNavigation('/login')}
                        >
                            <span>Start Learning</span>
                            <ArrowRight size={20} />
                        </button>
                        <button
                            className="btn-secondary btn-large"
                            onClick={() => handleNavigation('/professor')}
                        >
                            <Users size={18} />
                            <span>Meet the Professors</span>
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>500+</h3>
                                <p>Students Enrolled</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <BookOpen size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>2</h3>
                                <p>Courses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Award size={28} />
                            </div>
                            <div className="stat-content">
                                <h3>1</h3>
                                <p>Professors</p>
                            </div>
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
                            Learn from courses designed by Dr. Kiran TALELE, with 33+ years of teaching experience
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
                            Earn recognized certificates signed by Dr. TALELE that validate your skills
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
            <section className="cta-section">
                <div className="cta-card">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Career?</h2>
                        <p>
                            Join 500+ students learning from  expert-led courses.
                            Start your journey today with our free plan.
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