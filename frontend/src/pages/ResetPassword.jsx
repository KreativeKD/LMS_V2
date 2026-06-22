import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { resetPasswordWithToken } from '../api/api';
import { validateConfirmPassword, validatePasswordMin6 } from '../utils/authFormValidation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { borderRadius, colors, spacing, typography } from '../theme';
import { showToast } from '../utils/toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState('reset'); // reset | success
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ newPassword: '', confirmPassword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing password reset token.');
    }
  }, [token]);

  const validateResetStep = () => {
    const nextErrors = {
      newPassword: validatePasswordMin6(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword)
    };
    setFieldErrors((prev) => ({ ...prev, ...nextErrors }));
    return !nextErrors.newPassword && !nextErrors.confirmPassword;
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!token) {
      setError('Missing reset token. Please check the link from your email.');
      return;
    }

    if (!validateResetStep()) return;

    setLoading(true);
    try {
      const data = await resetPasswordWithToken(token, newPassword);
      showToast.success(data.message || 'Password reset successful');
      setStep('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      showToast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token && step !== 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: colors.background, padding: spacing.xl }}>
        <Card style={{ padding: spacing.xl, maxWidth: '460px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ ...typography.h2, marginBottom: spacing.md, color: colors.danger }}>Invalid Link</h2>
          <p style={{ ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.lg }}>
            No reset token found in the URL. Please click the exact link from your email.
          </p>
          <Button onClick={() => navigate('/login')} fullWidth>Go to Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.background,
        padding: spacing.xl
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {step === 'reset' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Reset Your Password</h2>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                Enter your new password below.
              </p>
            </div>
            <Card style={{ padding: spacing.xl }}>
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
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

                <Button type="submit" fullWidth loading={loading}>Change Password</Button>
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

export default ResetPassword;
