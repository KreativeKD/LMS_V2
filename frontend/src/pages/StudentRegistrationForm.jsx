import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { registerStudent } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components';
import { colors, spacing, typography, shadows } from '../theme';
import { COUNTRIES } from '../constants/countries';

const StudentRegistrationForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'country', 'username', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !form[field] || !form[field].trim());

    if (missingFields.length > 0) {
      setError('Please fill in all compulsory fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        username: form.username.trim(),
        password: form.password,
      };

      const data = await registerStudent(payload);
      login(data.user, data.token);
      navigate('/student');
    } catch (err) {
      const details = err?.response?.data?.details;
      setError(Array.isArray(details) && details.length > 0 ? details.join('. ') : (err.message || 'Registration failed'));
    } finally {
      setIsSubmitting(false);
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
        padding: spacing['2xl'],
      }}
    >
      <style>
        {`
          @media (max-width: 900px) {
            .student-registration-form {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      <div style={{ width: '100%', maxWidth: '760px' }}>
        <Card style={{ padding: spacing['2xl'], boxShadow: shadows.lg }}>
          <div style={{ width: '100%' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              style={{
                color: colors.text,
                background: colors.surfaceHover,
                border: `1px solid ${colors.border}`,
                marginBottom: spacing.md,
                alignSelf: 'flex-start'
              }}
            >
              <ArrowLeft size={16} /> Back to Login
            </Button>
            <div style={{ marginBottom: spacing.lg }}>
              <h2 style={{ ...typography.h2, margin: 0 }}>Create Student Account</h2>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: `${spacing.sm} 0 0 0` }}>
                Sign up once and start learning immediately.
              </p>
            </div>

            <form className="student-registration-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: spacing.md }}>
              <Input
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                required
              />
              <Input
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                required
              />
              <Input
                fullWidth
                type="email"
                label="Email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
                required
              />
              <Input
                fullWidth
                label="Phone"
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="+91 9876543210"
                required
              />
              <Input
                fullWidth
                label="City"
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                required
              />
              <Input
                fullWidth
                type="select"
                label="Country"
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
                placeholder="Select your country"
                options={COUNTRIES}
                required
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <Input
                  fullWidth
                  label="Username"
                  value={form.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  placeholder="letters and numbers only"
                  required
                />
                <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                  This will be your login username.
                </p>
              </div>
              <Input
                fullWidth
                type="password"
                label="Password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Minimum 8 chars, mixed case, number, special char"
                required
              />
              <Input
                fullWidth
                type="password"
                label="Confirm Password"
                value={form.confirmPassword}
                onChange={(event) => updateField('confirmPassword', event.target.value)}
                required
              />

              {error && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    ...typography.small,
                    color: colors.danger,
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: spacing.md,
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: spacing.md, marginTop: spacing.sm }}>
                <Button type="button" variant="secondary" onClick={() => navigate('/login')} fullWidth>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting} fullWidth>
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
