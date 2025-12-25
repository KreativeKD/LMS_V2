import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerStudent } from '../api/api';
import { useNavigate } from 'react-router-dom';

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
                const data = await registerStudent(name, password);
                login(data.user, data.token);
                navigate('/student');
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

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <div className="card animate-fade-in" style={{ width: '450px', textAlign: 'center' }}>
                <h1 className="gradient-text" style={{ marginBottom: '2rem' }}>
                    {isRegister ? 'Student Registration' : 'LMS Login'}
                </h1>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isRegister ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem' }}>
                                    Your username will be: <strong>{name || 'name'}@student</strong>
                                </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="username@role"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </>
                    )}

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.9rem' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                            setName('');
                            setUsername('');
                            setPassword('');
                        }}
                        style={{ background: 'transparent', color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.9rem' }}
                    >
                        {isRegister ? 'Already have an account? Sign In' : 'New student? Create an account'}
                    </button>
                    {!isRegister && (
                        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Format: name@admin | name@teacher | name@student
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
