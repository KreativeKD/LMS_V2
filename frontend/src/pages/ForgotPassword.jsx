import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { requestPasswordReset, fetchPasswordResetStatusByUsername, submitPasswordReset } from '../api/api';
import { validateConfirmPassword, validatePasswordMin6, validateUsernameWithRole } from '../utils/authFormValidation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { borderRadius, colors, spacing, typography } from '../theme';
import { showToast } from '../utils/toast';

const ForgotPassword = () => {
  const [step, setStep] = useState('request'); // request | waiting | reset | success
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  const validateRequestStep = () => {
    const usernameError = validateUsernameWithRole(username);
    setFieldErrors((prev) => ({ ...prev, username: usernameError }));
    return !usernameError;
  };

  const validateResetStep = () => {
    const nextErrors = {
      newPassword: validatePasswordMin6(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword)
    };
    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    return !nextErrors.newPassword && !nextErrors.confirmPassword;
  };

  const handleSubmitRequest = async (event) => {
    event.preventDefault();
    setError('');
    if (!validateRequestStep()) return;

    setLoading(true);
    try {
      const data = await requestPasswordReset(username.trim());
      showToast.success(data.message);
      if (data.approved) {
        setRequestId(data.requestId);
        setStep('reset');
      } else {
        setRequestId(data.requestId);
        setStep('waiting');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit request');
      showToast.error(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchPasswordResetStatusByUsername(username.trim());
      if (data.approved) {
        showToast.success('Your request has been approved! You can now reset your password.');
        setRequestId(data.requestId);
        setStep('reset');
      } else {
        showToast.info('Your request is still pending. Please wait for admin approval.');
      }
    } catch (err) {
      setError(err.message || 'Failed to check status');
      showToast.error(err.message || 'Failed to check status');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    if (!validateResetStep()) return;

    setLoading(true);
    try {
      const data = await submitPasswordReset({
        username: username.trim(),
        newPassword,
        requestId
      });
      showToast.success(data.message || 'Password reset successful');
      setStep('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      showToast.error(err.message || 'Failed to reset password');
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
                Enter your username to request password reset approval.
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
                <Button type="submit" fullWidth loading={loading}>Submit Request</Button>
              </form>
            </Card>
          </>
        )}

        {step === 'waiting' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Request Submitted</h2>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                Admin approval is required before you can reset your password.
              </p>
            </div>
            <Card style={{ padding: spacing.xl }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <p style={{ ...typography.bodySmall, margin: 0, color: colors.textMuted }}>
                  Username: <strong style={{ color: colors.text }}>{username}</strong>
                </p>
                {error && (
                  <div style={{ color: colors.danger, background: 'rgba(239, 68, 68, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, ...typography.small }}>
                    {error}
                  </div>
                )}
                <Button onClick={handleCheckStatus} fullWidth loading={loading}>Check Status</Button>
                <Button variant="ghost" onClick={() => navigate('/login')}>Back to Login</Button>
              </div>
            </Card>
          </>
        )}

        {step === 'reset' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Reset Your Password</h2>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                Your request is approved. Set a new password.
              </p>
            </div>
            <Card style={{ padding: spacing.xl }}>
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div style={{ padding: spacing.sm, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: borderRadius.sm, ...typography.small, color: '#15803d' }}>
                  Request approved for: <strong>{username}</strong>
                </div>

                <Input
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    if (fieldErrors.newPassword) {
                      setFieldErrors((prev) => ({ ...prev, newPassword: '' }));
                    }
                  }}
                  error={fieldErrors.newPassword}
                />
                <Input
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    if (fieldErrors.confirmPassword) {
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }
                  }}
                  error={fieldErrors.confirmPassword}
                />

                {error && (
                  <div style={{ color: colors.danger, background: 'rgba(239, 68, 68, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, ...typography.small }}>
                    {error}
                  </div>
                )}

                <Button type="submit" fullWidth loading={loading}>Reset Password</Button>
              </form>
            </Card>
          </>
        )}

        {step === 'success' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Password Reset Successful</h2>
            </div>
            <Card style={{ padding: spacing.xl }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle size={40} color="white" />
                </div>
                <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                  You can now login with your new password.
                </p>
                <Button onClick={() => navigate('/login')} fullWidth>Go to Login</Button>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
