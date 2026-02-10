import React, { useState, useEffect } from 'react';
import { Mail, Phone, Globe, Linkedin, Facebook, Play, MessageCircle, Rocket } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const ContactPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page">
            <PublicNavbar scrolled={scrolled} />

            <section id="contact" className="contact-section" style={{ paddingTop: '5rem' }}>
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

            <PublicFooter />
        </div>
    );
};

export default ContactPage;
