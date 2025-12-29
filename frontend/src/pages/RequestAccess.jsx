import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAccess } from '../api/api';

const RequestAccess = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [status, setStatus] = useState(''); // 'success', 'error'
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestAccess(firstName, lastName);
            setStatus('success');
            setMessage('Request submitted! Please wait for admin approval.');
            // Optional: navigate back to home or show success message
        } catch (err) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    return (
        <div style={{
            display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '12px',
                backdropFilter: 'blur(10px)', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Request Access</h2>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            {message}
                        </div>
                        <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
                            Once approved, you can complete your registration.
                        </p>
                        <button
                            onClick={() => navigate('/complete-setup')}
                            style={{
                                background: 'white', color: '#0f172a', border: 'none', padding: '0.8rem 1.5rem',
                                borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Complete Setup
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>First Name</label>
                            <input
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '6px', border: 'none',
                                    background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
                                }}
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Last Name</label>
                            <input
                                style={{
                                    width: '100%', padding: '0.8rem', borderRadius: '6px', border: 'none',
                                    background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
                                }}
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        {status === 'error' && (
                            <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                background: '#3b82f6', color: 'white', border: 'none', padding: '0.9rem',
                                borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem'
                            }}
                        >
                            Submit Request
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/complete-setup')}>
                                Check Status
                            </span>
                            <span style={{ margin: '0 0.5rem', color: '#64748b' }}>|</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                                Back to Login
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RequestAccess;
