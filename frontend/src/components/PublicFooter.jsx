import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap, Award, Mail, Phone, ExternalLink,
    Linkedin, Facebook, Play
} from 'lucide-react';

const PublicFooter = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-main">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <GraduationCap size={32} />
                            <h3><span className="brand-course">Course</span><span className="brand-z">Z</span></h3>
                        </div>
                        <p className="footer-description">
                            Empowering students and professionals worldwide with expert-led education
                            from Dr. Kiran TALELE, Associate Professor at SPIT Mumbai.
                        </p>
                        <div className="footer-creator">
                            <Award size={18} />
                            <div>
                                <strong>Created by Dr. Kiran TALELE</strong>
                                <p>Associate Professor, EXTC Department</p>
                                <p>Sardar Patel Institute of Technology</p>
                            </div>
                        </div>
                    </div>

                    <div className="footer-links-grid">
                        <div className="footer-column">
                            <h4>Platform</h4>
                            <ul>
                                <li><Link to="/#features">Features</Link></li>
                                <li><Link to="/#pricing">Pricing</Link></li>
                                <li><Link to="/#testimonials">Testimonials</Link></li>
                                <li><Link to="/professor">About Professor</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="https://www.youtube.com/@kirantalele8875" target="_blank" rel="noopener noreferrer">YouTube Channel</a></li>
                                <li><a href="https://www.talelesir.com" target="_blank" rel="noopener noreferrer">Official Website</a></li>
                                <li><a href="/#help">Help Center</a></li>
                                <li><a href="/#blog">Blog & Updates</a></li>
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
                                <a href="https://www.youtube.com/@kirantalele8875" target="_blank" rel="noopener noreferrer" className="social-link-large">
                                    <Play size={20} />
                                    <span>YouTube</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2025 <span className="brand-course">Course</span><span className="brand-z">Z</span>. Created by Dr. Kiran TALELE. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <a href="/#privacy">Privacy Policy</a>
                            <span>•</span>
                            <a href="/#terms">Terms of Service</a>
                            <span>•</span>
                            <a href="/#cookies">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;
