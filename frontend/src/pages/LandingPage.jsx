import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, BarChart2, Shield, Users, Globe } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content animate-fade-in">
                    <div className="badge-container">
                        <span className="badge">New: AI-Powered Learning</span>
                    </div>
                    <h1 className="hero-title">
                        Master Your Future with <span className="gradient-text">LMS Pro</span>
                    </h1>
                    <p className="hero-subtitle">
                        Experience the next generation of online learning. Interactive courses,
                        real-time progress tracking, and a community that drives you forward.
                    </p>
                    <div className="hero-buttons">
                        <button
                            className="btn-primary"
                            onClick={() => navigate('/login')}
                        >
                            Get Started Now
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Features
                        </button>
                    </div>
                </div>

                <div className="hero-stats animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-card">
                        <Users className="icon-accent" size={24} />
                        <h3>10k+</h3>
                        <p>Active Students</p>
                    </div>
                    <div className="stat-card">
                        <BookOpen className="icon-accent" size={24} />
                        <h3>500+</h3>
                        <p>Expert Courses</p>
                    </div>
                    <div className="stat-card">
                        <Award className="icon-accent" size={24} />
                        <h3>95%</h3>
                        <p>Success Rate</p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <h2 className="section-title">Why Choose LMS Pro?</h2>
                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <BarChart2 size={32} />
                        </div>
                        <h3>Smart Progress Tracking</h3>
                        <p>Visualize your learning journey with detailed analytics and real-time performance insights.</p>
                    </div>

                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Shield size={32} />
                        </div>
                        <h3>Secure & Reliable</h3>
                        <p>Enterprise-grade security ensures your data and certification achievements are always safe.</p>
                    </div>

                    <div className="feature-card card">
                        <div className="icon-wrapper">
                            <Globe size={32} />
                        </div>
                        <h3>Learn Anywhere</h3>
                        <p>Access your high-quality course material from any device, anytime, anywhere in the world.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-card">
                    <h2>Ready to Start Your Journey?</h2>
                    <p>Join thousands of students transforming their careers today.</p>
                    <button
                        className="btn-accent"
                        onClick={() => navigate('/login')}
                    >
                        Create Free Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2025 LMS Pro. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
