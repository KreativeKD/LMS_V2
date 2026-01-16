import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PublicNavbar = ({ scrolled }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/logo.png" alt="CourseZ Logo" style={{ height: '60px', width: 'auto' }} />
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/professor" className="nav-link">Professor</Link>
                    <Link to="/courses" className="nav-link">Academic Courses</Link>
                    <Link to="/scholarship" className="nav-link">Funding and Scholarship</Link>
                    <a href="/#testimonials" className="nav-link" onClick={(e) => {
                        if (window.location.pathname === '/') {
                            e.preventDefault();
                            const element = document.getElementById('testimonials');
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                window.history.pushState(null, null, '#testimonials');
                            }
                        }
                    }}>Testimonials</a>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>
                <div className="nav-actions">
                    <button className="btn-primary" onClick={() => handleNavigation('/login')}>
                        Login / Signup
                    </button>
                </div>
            </nav>
            <div style={{
                textAlign: 'center',
                padding: '0.75rem 0',
                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1), rgba(157, 80, 187, 0.1))',
                borderBottom: '1px solid var(--border)',
                fontSize: '1.1rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                color: 'var(--primary)',
                position: 'sticky',
                top: scrolled ? '92px' : '108px',
                zIndex: 99,
                marginTop: '0'
            }}>
                Learn • Apply • Grow
            </div>
        </>
    );
};

export default PublicNavbar;
