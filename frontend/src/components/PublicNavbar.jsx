import React from 'react';
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
                    <img src="/logo.jpeg" alt="CourseZ Logo" style={{ height: '40px', width: 'auto' }} />
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
                    <button className="btn-primary public-login-btn" onClick={() => handleNavigation('/login')}>
                        Login / Signup
                    </button>
                </div>
            </nav>
        </>
    );
};

export default PublicNavbar;
