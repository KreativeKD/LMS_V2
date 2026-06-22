import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { requestPasswordReset } from '../api/api';
import { validateUsernameWithRole } from '../utils/authFormValidation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { borderRadius, colors, spacing, typography } from '../theme';
import { showToast } from '../utils/toast';

const ForgotPassword = () => {
  const [step, setStep] = useState('request'); // request | success
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '' });
  const navigate = useNavigate();

  const validateRequestStep = () => {
    const usernameError = validateUsernameWithRole(username);
    setFieldErrors((prev) => ({ ...prev, username: usernameError }));
    return !usernameError;
  };

  const handleSubmitRequest = async (event) => {
    event.preventDefault();
    setError('');
    if (!validateRequestStep()) return;

    setLoading(true);
    try {
      const data = await requestPasswordReset(username.trim());
      showToast.success(data.message);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Failed to submit request');
      showToast.error(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.background,
        padding: spacing.xl,
        position: 'relative'
      }}
    >
      <Button
        onClick={() => navigate('/login')}
        variant="ghost"
        size="sm"
        style={{ position: 'absolute', top: spacing.xl, left: spacing.xl, color: colors.textMuted }}
      >
        <ArrowLeft size={16} /> Back to Login
      </Button>

      <div style={{ width: '100%', maxWidth: '460px' }}>
        {step === 'request' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Forgot Password?</h2>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                Enter your username to request a password reset link.
              </p>
            </div>
            <Card style={{ padding: spacing.xl }}>
              <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <Input
                  fullWidth
                  id="username"
                  label="Username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    if (fieldErrors.username) {
                      setFieldErrors((prev) => ({ ...prev, username: '' }));
                    }
                  }}
                  error={fieldErrors.username}
                />
                {error && (
                  <div style={{ color: colors.danger, background: 'rgba(239, 68, 68, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, ...typography.small }}>
                    {error}
                  </div>
                )}
                <Button type="submit" fullWidth loading={loading}>Send Reset Link</Button>
              </form>
            </Card>
          </>
        )}

        {step === 'success' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Check Your Email</h2>
            </div>
            <Card style={{ padding: spacing.xl }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle size={40} color="white" />
                </div>
                <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                  If an account exists for <strong>{username}</strong>, a password reset link has been sent to the associated email address.
                </p>
                <p style={{ ...typography.small, color: colors.textMuted, margin: 0, marginTop: spacing.sm }}>
                  Please check your inbox and spam folder.
                </p>
                <Button onClick={() => navigate('/login')} fullWidth style={{ marginTop: spacing.md }}>Return to Login</Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
