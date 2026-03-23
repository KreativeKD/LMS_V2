import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkStatus } from '../api/api';
import { validateName } from '../utils/authFormValidation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { borderRadius, colors, spacing, typography } from '../theme';

const CompleteSetup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors = {
      firstName: validateName(firstName, 'First name'),
      lastName: validateName(lastName, 'Last name')
    };
    setFieldErrors(nextErrors);
    return !nextErrors.firstName && !nextErrors.lastName;
  };

  const handleCheck = async (event) => {
    event.preventDefault();
    setError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data = await checkStatus(firstName.trim(), lastName.trim());
      if (data.status === 'approved') {
        navigate('/student-registration', {
          state: { firstName: firstName.trim(), lastName: lastName.trim() }
        });
      } else if (data.status === 'pending') {
        setError('Your request is still pending admin approval.');
      } else if (data.status === 'completed') {
        setError('Account already set up. Please login.');
      } else {
        setError(`Request status: ${data.status}`);
      }
    } catch (err) {
      setError(err.message || 'Unable to verify status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', background: colors.background, color: colors.text, padding: spacing.xl }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: spacing.lg }}>
          <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>Activate Account</h2>
          <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
            Enter your requested name to verify approval.
          </p>
        </div>

        <Card style={{ padding: spacing.xl }}>
          <form onSubmit={handleCheck} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <Input
              label="First Name"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
                if (fieldErrors.firstName) setFieldErrors((prev) => ({ ...prev, firstName: '' }));
              }}
              error={fieldErrors.firstName}
              placeholder="Name used in request"
              fullWidth
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                if (fieldErrors.lastName) setFieldErrors((prev) => ({ ...prev, lastName: '' }));
              }}
              error={fieldErrors.lastName}
              placeholder="Surname used in request"
              fullWidth
            />

            {error && (
              <div style={{ color: colors.danger, background: 'rgba(239, 68, 68, 0.1)', padding: spacing.sm, borderRadius: borderRadius.sm, ...typography.small }}>
                {error}
              </div>
            )}

            <Button type="submit" loading={isSubmitting} fullWidth>
              Verify & Continue
            </Button>

            <div style={{ textAlign: 'center', marginTop: spacing.sm }}>
              <span style={{ color: colors.accent, ...typography.small, cursor: 'pointer' }} onClick={() => navigate('/request-access')}>
                I haven't requested yet
              </span>
              <span style={{ margin: '0 0.5rem', color: colors.border }}>|</span>
              <span style={{ color: colors.textMuted, ...typography.small, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                Login
              </span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CompleteSetup;
