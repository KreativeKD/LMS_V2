import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkStatus, completeRegistration } from '../api/api';
import { useAuth } from '../context/AuthContext';

const CompleteSetup = () => {
    const [step, setStep] = useState(1); // 1: Check, 2: Setup
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleCheck = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await checkStatus(firstName, lastName);
            if (data.status === 'approved') {
                setStep(2);
                setUsername(firstName.toLowerCase() + lastName.toLowerCase()); // Default suggestion
            } else if (data.status === 'pending') {
                setError('Your request is still pending admin approval.');
            } else if (data.status === 'completed') {
                setError('Account already set up. Please login.');
            } else {
                setError(`Request status: ${data.status}`);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSetup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // username passed here is just the prefix
            const data = await completeRegistration({ firstName, lastName, username, password });
            login(data.user, data.token);
            navigate('/student');
        } catch (err) {
            setError(err.message);
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.8rem', borderRadius: '6px', border: 'none',
        background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none'
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
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                    {step === 1 ? 'Activate Account' : 'Finalize Setup'}
                </h2>

                {step === 1 && (
                    <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Enter your name to verify your admin approval.
                    </p>
                )}

                {step === 1 ? (
                    <form onSubmit={handleCheck} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>First Name</label>
                            <input style={inputStyle} value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="Name used in request" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Last Name</label>
                            <input style={inputStyle} value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Name used in request" />
                        </div>

                        {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>{error}</div>}

                        <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
                            Verify & Continue
                        </button>

                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/request-access')}>
                                I haven't requested yet
                            </span>
                            <span style={{ margin: '0 0.5rem', color: '#64748b' }}>|</span>
                            <span style={{ color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>
                                Login
                            </span>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: 'rgba(34, 197, 94, 0.15)', padding: '1rem', borderRadius: '8px', color: '#4ade80', fontSize: '0.9rem', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                            <strong>Success!</strong> You are approved. Please create your credentials.
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Choose Username</label>
                            <input style={inputStyle} value={username} onChange={e => setUsername(e.target.value)} required />
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>Your login will be: <strong>{username}@student</strong></div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>Create Password</label>
                            <input style={inputStyle} type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="New password" />
                        </div>

                        {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>{error}</div>}

                        <button type="submit" style={{ background: '#22c55e', color: 'white', border: 'none', padding: '0.9rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
                            Complete & Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CompleteSetup;
