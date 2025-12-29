import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User, Settings, Play } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid #333',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 className="gradient-text" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                    CourseZ
                </h2>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={18} color="var(--primary)" /> Courses
                </Link>

                {user.role === 'admin' && (
                    <Link to="/admin" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={18} color="var(--secondary)" /> Admin
                    </Link>
                )}

                {(user.role === 'admin' || user.role === 'teacher') && (
                    <Link to="/teacher" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Play size={18} color="var(--accent)" /> Teaching
                    </Link>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid #333', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={18} />
                        <span style={{ fontSize: '0.9rem' }}>{user.username.split('@')[0]}</span>
                    </div>
                    <button onClick={handleLogout} style={{ padding: '8px', background: 'transparent', color: '#ff4d4d' }}>
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
