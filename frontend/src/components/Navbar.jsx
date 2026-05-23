import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import { LogOut, Bell, CheckCheck, Trash2 } from 'lucide-react';

const stripRoleSuffix = (username = '') => username.replace(/@(admin|teacher|student)$/i, '');

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const {
        notifications,
        unreadCount,
        loading,
        markOneRead,
        markAllRead,
        deleteNotification
    } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const notificationRef = useRef(null);

    const onPublicPage = ['/', '/professor', '/courses', '/scholarship', '/contact'].includes(location.pathname);

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

    useEffect(() => {
        if (!onPublicPage) return undefined;

        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [onPublicPage]);

    useEffect(() => {
        const onOutsideClick = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', onOutsideClick);
        return () => document.removeEventListener('mousedown', onOutsideClick);
    }, []);

    const notificationLabel = useMemo(() => {
        if (!unreadCount) return 'No unread notifications';
        if (unreadCount === 1) return '1 unread notification';
        return `${unreadCount} unread notifications`;
    }, [unreadCount]);

    const formatWhen = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const onTestimonialsClick = (event) => {
        if (window.location.pathname === '/') {
            event.preventDefault();
            const element = document.getElementById('testimonials');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, null, '#testimonials');
            }
        }
    };

    const isPathActive = (path) => location.pathname === path;
    const isTestimonialsActive = location.pathname === '/' && location.hash === '#testimonials';

    return (
        <nav className={`nav-bar unified-navbar ${onPublicPage ? `public-navbar ${scrolled ? 'scrolled' : ''}` : 'auth-navbar'}`}>
            <div className="nav-logo" onClick={() => navigate(isAuthenticated ? getDashboardPath() : '/')} style={{ cursor: 'pointer' }}>
                <img src="/logo.jpeg" alt="CourseZ Logo" style={{ height: '40px', width: 'auto' }} />
            </div>

            <div className="nav-links">
                <Link to="/" className={`nav-link ${isPathActive('/') ? 'active' : ''}`}>Home</Link>
                <Link to="/professor" className={`nav-link ${isPathActive('/professor') ? 'active' : ''}`}>Instructor</Link>
                <a href="/#testimonials" className={`nav-link ${isTestimonialsActive ? 'active' : ''}`} onClick={onTestimonialsClick}>Testimonials</a>
                <a
                    href="https://anudaanjagruti.com/#/pages/home"
                    className="nav-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Scholarships
                </a>

                {/* Mobile App link removed */}

                {isAuthenticated && (
                    <>
                        <Link to={getDashboardPath()} className={`nav-link auth-nav-link ${isPathActive(getDashboardPath()) ? 'active' : ''}`}>
                            Courses
                        </Link>

                        {user?.role === 'student' && (
                            <Link to="/my-courses" className={`nav-link auth-nav-link ${isPathActive('/my-courses') ? 'active' : ''}`}>
                                My Courses
                            </Link>
                        )}

                        {(user?.role === 'admin' || user?.role === 'teacher') && (
                            <Link to="/teacher" className={`nav-link auth-nav-link ${isPathActive('/teacher') ? 'active' : ''}`}>
                                Teaching
                            </Link>
                        )}
                    </>
                )}

                <Link to="/contact" className={`nav-link ${isPathActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </div>

            <div className={`nav-actions ${isAuthenticated ? 'auth-nav-actions' : ''}`}>
                {!isAuthenticated ? (
                    <button className="btn-primary public-login-btn" onClick={() => navigate('/login')}>
                        Login / Signup
                    </button>
                ) : (
                    <>
                        <div ref={notificationRef} style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                aria-label={notificationLabel}
                                className="auth-bell-btn"
                            >
                                <Bell size={18} style={{ display: 'block' }} />
                                {unreadCount > 0 && (
                                    <span className="auth-bell-badge">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {isOpen && (
                                <div className="auth-notification-panel">
                                    <div className="auth-notification-header">
                                        <strong>Notifications</strong>
                                        <button
                                            type="button"
                                            onClick={markAllRead}
                                            disabled={!unreadCount}
                                            className="auth-notification-mark-all"
                                            style={{
                                                color: unreadCount ? 'var(--primary)' : 'var(--text-muted)',
                                                cursor: unreadCount ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            <CheckCheck size={14} /> Mark all
                                        </button>
                                    </div>

                                    {loading && (
                                        <div style={{ padding: '0.9rem', color: 'var(--text-muted)' }}>
                                            Loading notifications...
                                        </div>
                                    )}

                                    {!loading && notifications.length === 0 && (
                                        <div style={{ padding: '0.9rem', color: 'var(--text-muted)' }}>
                                            You are all caught up.
                                        </div>
                                    )}

                                    {!loading && notifications.map((item) => (
                                        <div
                                            key={item._id}
                                            style={{
                                                padding: '0.85rem 0.9rem',
                                                borderBottom: '1px solid #f1f3f5',
                                                background: item.read ? 'white' : '#f8fbff'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                                                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.message}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                        {formatWhen(item.createdAt)}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                    {!item.read && (
                                                        <button
                                                            type="button"
                                                            onClick={() => markOneRead(item._id)}
                                                            style={{
                                                                border: '1px solid var(--border)',
                                                                borderRadius: 8,
                                                                background: 'white',
                                                                fontSize: '0.72rem',
                                                                padding: '4px 6px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteNotification(item._id)}
                                                        style={{
                                                            border: 'none',
                                                            borderRadius: 8,
                                                            background: '#fef2f2',
                                                            color: '#b91c1c',
                                                            fontSize: '0.72rem',
                                                            padding: '4px 6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4
                                                        }}
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/profile" className="auth-profile-link">
                            {user?.profilePhoto ? (
                                <img
                                    src={user.profilePhoto}
                                    alt="Profile"
                                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}
                                />
                            ) : (
                                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#5b21b6,#6366f1)', color: '#fff', fontWeight: 700 }}>
                                    {user?.firstName ? user.firstName[0].toUpperCase() : (user?.username ? user.username[0].toUpperCase() : 'U')}
                                </div>
                            )}
                            <span className="auth-profile-name">
                                {stripRoleSuffix(user?.username || 'user')}
                            </span>
                        </Link>

                        <button onClick={handleLogout} className="auth-logout-btn">
                            <LogOut size={18} />
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
