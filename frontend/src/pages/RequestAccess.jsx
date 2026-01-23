import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../api/api';
import { useAuth } from '../context/AuthContext';

const RequestAccess = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        username: '',
        password: ''
    });
    const [status, setStatus] = useState(''); // 'success', 'error'
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registerStudent(formData);
            setStatus('success');
            login(data.user, data.token);
            setMessage('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/student');
            }, 2000);
        } catch (err) {
            setStatus('error');
            setMessage(err.message);
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border)',
        background: '#f9fafb', color: 'var(--text-main)', outline: 'none'
    };

    return (
        <div style={{
            display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center',
            background: 'var(--background)', color: 'var(--text-main)', padding: '2rem'
        }}>
            <div style={{
                background: 'white', padding: '2rem', borderRadius: '12px',
                width: '100%', maxWidth: '500px', border: '1px solid var(--border)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Student Registration</h2>

                {status === 'success' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--text-accent)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            {message}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>First Name</label>
                            <input name="firstName" style={inputStyle} value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Last Name (Surname)</label>
                            <input name="lastName" style={inputStyle} value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email ID</label>
                            <input name="email" type="email" style={inputStyle} value={formData.email} onChange={handleChange} required />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Phone Number</label>
                            <input name="phone" style={inputStyle} value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>City</label>
                            <input name="city" style={inputStyle} value={formData.city} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Country</label>
                            <input name="country" style={inputStyle} value={formData.country} onChange={handleChange} required />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Choose Username</label>
                            <input name="username" style={inputStyle} value={formData.username} onChange={handleChange} required />
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Your login will be: <strong>{formData.username}@student</strong></div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
                            <input name="password" type="password" style={inputStyle} value={formData.password} onChange={handleChange} required />
                        </div>

                        {status === 'error' && (
                            <div style={{ gridColumn: 'span 2', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                gridColumn: 'span 2', background: 'var(--primary)', color: 'white', border: 'none', padding: '0.9rem',
                                borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem'
                            }}
                        >
                            Register Now
                        </button>

                        <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '1rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => navigate('/login')}>
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
