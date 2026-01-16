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

    const getDashboardPath = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'admin': return '/admin';
            case 'teacher': return '/teacher';
            case 'student': return '/student';
            default: return '/';
        }
    };

    if (!user) return null;

    return (
        <>
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                        src="/logo.png"
                        alt="CourseZ Logo"
                        style={{ height: '60px', width: 'auto', cursor: 'pointer' }}
                        onClick={() => navigate(getDashboardPath())}
                    />
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to={getDashboardPath()} style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '2rem' }}>
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
                top: '92px',
                zIndex: 99,
                marginTop: '0'
            }}>
                Learn • Apply • Grow
            </div>
        </>
    );
};

export default Navbar;
