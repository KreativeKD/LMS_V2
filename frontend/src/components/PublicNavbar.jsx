import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const PublicNavbar = ({ scrolled }) => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <GraduationCap size={28} className="logo-icon" />
                <span>CourseZ</span>
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/professor" className="nav-link">Professor</Link>
                <Link to="/courses" className="nav-link">Courses</Link>
                <Link to="/scholarship" className="nav-link">Funding and Scholarship</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
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
    );
};

export default PublicNavbar;
