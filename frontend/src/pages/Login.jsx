import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerStudent } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegister) {
                // Navigate to the Request Access page instead of calling api immediately
                navigate('/request-access');
            } else {
                const data = await loginUser(username, password);
                login(data.user, data.token);

                if (data.user.role === 'admin') navigate('/admin');
                else if (data.user.role === 'teacher') navigate('/teacher');
                else navigate('/student');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    // Shared styles for inputs
    const inputStyle = {
        width: '100%',
        padding: '0.85rem 1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
    };

    return (
        <>
            {/* Responsive CSS */}
            <style>
                {`
                    @media (max-width: 900px) {
                        .split-container {
                            flex-direction: column;
                        }
                        .hero-section {
                            display: none;
                        }
                        .form-section {
                            width: 100% !important;
                            padding: 2rem !important;
                        }
                    }
                `}
            </style>

            <div className="split-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

                {/* LEFT SIDE: Professional Landing / Hero Section */}
                <div className="hero-section" style={{
                    flex: '1.2',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '4rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Circle */}
                    <div style={{
                        position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px',
                        background: 'rgba(255,255,255,0.05)', borderRadius: '50%'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h1 style={{ fontSize: '3rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '1.5rem' }}>
                            Empowering the <br />
                            <span style={{ color: '#60a5fa' }}>Next Generation</span>
                        </h1>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#94a3b8', maxWidth: '500px', marginBottom: '2.5rem' }}>
                            A secure, reliable, and intuitive learning management system designed for educators and students to achieve excellence.
                        </p>

                        {/* Trust Indicators */}
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>10k+</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Active Students</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>99.9%</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Uptime</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Secure</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Encrypted Data</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Form Section */}
                <div className="form-section" style={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem',
                    backgroundColor: '#ffffff',
                    position: 'relative'
                }}>
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            left: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                            zIndex: 10
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f1f5f9';
                            e.currentTarget.style.color = '#1e293b';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </button>

                    <div style={{ width: '100%', maxWidth: '420px' }}>

                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                                {isRegister ? 'Join the Classroom' : 'Welcome Back'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                {isRegister ? 'Create your student account to get started.' : 'Enter your credentials to access your portal.'}
                            </p>
                        </div>

                        {/* Form Card */}
                        <div style={{
                            background: '#fff',
                            // border: '1px solid #e2e8f0', 
                            borderRadius: '12px',
                        }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                                {isRegister ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                                            <p style={{ color: '#64748b' }}>Select your status:</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/request-access')}
                                            style={{
                                                background: 'white',
                                                border: '1px solid #e2e8f0',
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                textAlign: 'left',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                        >
                                            <div style={{ background: '#dbeafe', padding: '0.8rem', borderRadius: '50%', color: '#2563eb' }}>
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>I am a New Student</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Request access to join the platform</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/complete-setup')}
                                            style={{
                                                background: 'white',
                                                border: '1px solid #e2e8f0',
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                textAlign: 'left',
                                                transition: 'all 0.2s',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; }}
                                        >
                                            <div style={{ background: '#dcfce7', padding: '0.8rem', borderRadius: '50%', color: '#16a34a' }}>
                                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>I have been Approved</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Complete account setup & password</div>
                                            </div>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Username</label>
                                            <input
                                                style={inputStyle}
                                                type="text"
                                                placeholder="username@role"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Password</label>
                                            <input
                                                style={inputStyle}
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {error && (
                                    <div style={{
                                        color: '#dc2626',
                                        fontSize: '0.85rem',
                                        background: '#fef2f2',
                                        padding: '0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #fecaca',
                                        marginTop: '-0.5rem'
                                    }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    style={{
                                        background: 'var(--primary)', // Or #2563eb
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.9rem',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        marginTop: '0.5rem'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                                >
                                    {isRegister ? '' : 'Sign In Securely'}
                                </button>
                            </form>

                            {/* Toggle Switch */}
                            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                                {isRegister ? 'Already have an account?' : 'New student?'}{' '}
                                <button
                                    onClick={() => {
                                        setIsRegister(!isRegister);
                                        setError('');
                                        setName('');
                                        setUsername('');
                                        setPassword('');
                                    }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#2563eb',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {isRegister ? 'Sign In' : 'Create an account'}
                                </button>
                            </div>

                            {!isRegister && (
                                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                                    <p>Format: <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>name@admin</span> | <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>name@teacher</span> | <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>name@student</span></p>
                                </div>
                            )}
                        </div>

                        {/* Trust Badge */}
                        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                            </svg>
                            Secured by 256-bit SSL Encryption
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;