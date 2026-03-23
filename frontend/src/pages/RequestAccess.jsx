import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestAccess } from '../api/api';
import { validateName } from '../utils/authFormValidation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { borderRadius, colors, spacing, typography } from '../theme';

const RequestAccess = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [fieldErrors, setFieldErrors] = useState({ firstName: '', lastName: '' });
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors = {
      firstName: validateName(formData.firstName, 'First name'),
      lastName: validateName(formData.lastName, 'Last name')
    };
    setFieldErrors(nextErrors);
    return !nextErrors.firstName && !nextErrors.lastName;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setMessage('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = await requestAccess(formData.firstName.trim(), formData.lastName.trim());
      setStatus('success');
      setMessage(data.message || 'Request submitted successfully. Wait for admin approval, then complete setup.');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: colors.background, color: colors.text, padding: spacing.xl }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Request Student Access</h2>
          <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
            Submit your name for admin approval. After approval, complete account setup.
          </p>
        </div>

        <Card style={{ padding: spacing.xl }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: colors.success, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.lg }}>
                {message}
              </div>
              <Button onClick={() => navigate('/complete-setup')}>
                Check Status / Complete Setup
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <Input
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={fieldErrors.firstName}
                placeholder="Enter your first name"
                fullWidth
              />
              <Input
                name="lastName"
                label="Last Name (Surname)"
                value={formData.lastName}
                onChange={handleChange}
                error={fieldErrors.lastName}
                placeholder="Enter your surname"
                fullWidth
              />

              {status === 'error' && (
                <div style={{ color: colors.danger, background: 'rgba(239, 68, 68, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, ...typography.small }}>
                  {message}
                </div>
              )}

              <Button type="submit" loading={isSubmitting} fullWidth>
                Submit Access Request
              </Button>

              <div style={{ textAlign: 'center', marginTop: spacing.sm }}>
                <span style={{ color: colors.textMuted, ...typography.small, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                  Back to Login
                </span>
                <span style={{ margin: '0 0.5rem', color: colors.border }}>|</span>
                <span style={{ color: colors.accent, ...typography.small, cursor: 'pointer' }} onClick={() => navigate('/complete-setup')}>
                  Already approved? Complete setup
                </span>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RequestAccess;
