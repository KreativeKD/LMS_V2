import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/api';
import { validateRequired } from '../utils/authFormValidation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { spacing, colors, typography, shadows } from '../theme';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Opening the login page should always start a fresh unauthenticated session.
    logout();
  }, [logout]);

  const validateForm = () => {
    const nextErrors = {
      username: validateRequired(username, 'Username'),
      password: validateRequired(password, 'Password')
    };
    setFieldErrors(nextErrors);
    return !nextErrors.username && !nextErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isRegister) {
        navigate('/request-access');
        return;
      }

      const data = await loginUser(username, password);
      login(data.user, data.token);

      if (data.user.role === 'admin') navigate('/admin');
      else if (data.user.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      const details = err?.response?.data?.details;
      setError(Array.isArray(details) && details.length > 0 ? details.join('. ') : (err.message || 'Login failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 900px) {
            .split-container { flex-direction: column; }
            .hero-section { display: none; }
            .form-section { width: 100% !important; padding: 2rem !important; }
          }
        `}
      </style>

      <div className="split-container" style={{ display: 'flex', minHeight: '100vh', background: colors.background }}>
        <div
          className="hero-section"
          style={{
            flex: '0.6',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: spacing['2xl'],
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: spacing.md }}>
            Empowering the
            <br />
            <span style={{ color: '#60a5fa' }}>Next Generation</span>
          </h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#94a3b8' }}>
            A secure, reliable, and intuitive learning management system for educators and students.
          </p>
        </div>

        <div
          className="form-section"
          style={{
            flex: '1.4',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing['2xl'],
            background: colors.background,
            position: 'relative',
          }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            style={{ position: 'absolute', top: spacing.xl, left: spacing.xl, color: colors.textMuted }}
          >
            <ArrowLeft size={16} /> Back to Home
          </Button>

          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: spacing.xs, color: colors.text }}>
                {isRegister ? 'Join the Classroom' : 'Welcome Back'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: colors.textMuted, marginTop: spacing.sm }}>
                {isRegister
                  ? 'Create your student account to get started.'
                  : 'Enter your credentials to access your portal.'}
              </p>
            </div>

            <Card style={{ padding: '28px 24px', boxShadow: shadows.lg }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {isRegister ? (
                    <>
                      <Button type="button" onClick={() => navigate('/request-access')} fullWidth>
                        Register Now
                      </Button>
                      <p style={{ ...typography.small, color: colors.textMuted, textAlign: 'center' }}>
                        Submit request first. Complete signup after admin approval.
                      </p>
                    </>
                  ) : (
                    <>
                      <Input
                        fullWidth
                        id="username"
                        label="Email or Username"
                        type="text"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(event) => {
                          setUsername(event.target.value);
                          if (fieldErrors.username) {
                            setFieldErrors((prev) => ({ ...prev, username: '' }));
                          }
                        }}
                        error={fieldErrors.username}
                        style={{ minHeight: '44px', fontSize: '15px' }}
                        required
                      />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
                        <label htmlFor="password" style={{ ...typography.label, color: colors.text, fontWeight: 600 }}>
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => navigate('/forgot-password')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: colors.primary,
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            padding: 0,
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                          Forgot password?
                        </button>
                      </div>

                      <Input
                        fullWidth
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (fieldErrors.password) {
                            setFieldErrors((prev) => ({ ...prev, password: '' }));
                          }
                        }}
                        error={fieldErrors.password}
                        style={{ minHeight: '44px', fontSize: '15px' }}
                        required
                      />
                    </>
                  )}

                  {error && (
                    <div
                      style={{
                        ...typography.small,
                        color: colors.danger,
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        padding: spacing.md,
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {!isRegister && (
                    <Button type="submit" fullWidth loading={isSubmitting}>
                      Sign In
                    </Button>
                  )}
                </form>

                {!isRegister && (
                  <div style={{ marginTop: spacing.lg, textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: colors.textMuted }}>
                      New student?{' '}
                    </span>
                    <button
                      onClick={() => {
                        setError('');
                        setUsername('');
                        setPassword('');
                        setFieldErrors({ username: '', password: '' });
                        navigate('/student-registration');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.primary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: 0,
                        textDecoration: 'none',
                      }}
                    >
                      Create an account
                    </button>
                  </div>
                )}

                {isRegister && (
                  <div style={{ marginTop: spacing.md, paddingTop: spacing.md, borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', color: colors.textMuted }}>
                      Already have an account?{' '}
                    </span>
                    <button
                      onClick={() => {
                        setIsRegister(!isRegister);
                        setError('');
                        setUsername('');
                        setPassword('');
                        setFieldErrors({ username: '', password: '' });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.primary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: 0,
                        textDecoration: 'none',
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
