import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, ChevronDown, Save, Upload } from 'lucide-react';
import { fetchCurrentUser, updateUserProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input, PageLayout } from '../components';
import { borderRadius, colors, spacing, typography } from '../theme';
import { COUNTRIES } from '../constants/countries';

const stripRoleSuffix = (username = '') => username.replace(/@(admin|teacher|student)$/i, '');

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, login } = useAuth();
  const fileInputRef = useRef(null);
  const countryDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    username: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchCurrentUser();
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          city: data.city || '',
          country: data.country || '',
          username: data.username || '',
        });
        setCountrySearch(data.country || '');
      } catch (error) {
        console.error('Failed to load user data:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter((country) => country.toLowerCase().includes(query));
  }, [countrySearch]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBack = () => {
    if (authUser?.role === 'admin') navigate('/admin');
    else if (authUser?.role === 'teacher') navigate('/teacher');
    else navigate('/student');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country }));
    setCountrySearch(country);
    setShowCountryDropdown(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSubmit = {};

      // Only include fields that have values
      if (formData.firstName) dataToSubmit.firstName = formData.firstName;
      if (formData.lastName) dataToSubmit.lastName = formData.lastName;
      if (formData.email) dataToSubmit.email = formData.email;
      if (formData.phone) dataToSubmit.phone = formData.phone;
      if (formData.city) dataToSubmit.city = formData.city;
      if (formData.country) dataToSubmit.country = formData.country;

      // If a new photo is selected, use the already-generated preview
      if (photoPreview) {
        dataToSubmit.profilePhoto = photoPreview;
      }

      // Ensure at least one field is being updated
      if (Object.keys(dataToSubmit).length === 0) {
        setMessage({ type: 'error', text: 'Please make changes to save' });
        setSaving(false);
        return;
      }

      const updatedUser = await updateUserProfile(dataToSubmit);
      login(updatedUser, localStorage.getItem('token'));
      setPhotoPreview(null);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const displayName =
    formData.firstName && formData.lastName
      ? `${formData.firstName} ${formData.lastName}`
      : stripRoleSuffix(formData.username || '') || 'User';

  if (loading) {
    return (
      <PageLayout title="My Profile">
        <Card>
          <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>Loading profile...</p>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="My Profile">
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
          <Button variant="secondary" onClick={handleBack}>
            <ArrowLeft size={16} /> Back
          </Button>
        </div>

        <Card>
          {/* Header Section */}
          <div style={{ display: 'block', width: '100%', marginBottom: spacing.xl * 2, paddingBottom: spacing.xl, borderBottom: `1px solid ${colors.border}` }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.lg,
              }}
            >
              <div
                onClick={handlePhotoClick}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: borderRadius.full,
                  background: photoPreview || authUser?.profilePhoto ? 'transparent' : colors.gradient,
                  color: colors.textInverse,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow: `0 4px 12px rgba(79, 70, 229, 0.25)`,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: `2px solid transparent`,
                  borderColor: photoPreview || authUser?.profilePhoto ? colors.primary : 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.borderColor = photoPreview || authUser?.profilePhoto ? colors.primary : 'transparent';
                }}
              >
                {photoPreview || authUser?.profilePhoto ? (
                  <>
                    <img
                      src={photoPreview || authUser?.profilePhoto}
                      alt="Profile"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: borderRadius.full,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: borderRadius.full,
                      }}
                    >
                      <Upload size={32} color={colors.textInverse} />
                    </div>
                  </>
                ) : (
                  (formData.firstName?.[0] || formData.username?.[0] || 'U').toUpperCase()
                )}
              </div>
              <div>
                <h1 style={{ ...typography.h2, marginBottom: spacing.xs, marginTop: 0 }}>{displayName}</h1>
                <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                  {formData.username} •{' '}
                  <span
                    style={{
                      display: 'inline-block',
                      background: colors.primary,
                      color: colors.textInverse,
                      padding: `2px ${spacing.sm}`,
                      borderRadius: borderRadius.sm,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      marginLeft: spacing.sm,
                    }}
                  >
                    {authUser?.role?.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: spacing.lg }}>
            {/* Personal Information Section */}
            <h3 style={{ ...typography.bodyMedium, fontWeight: 600, marginTop: 0, marginBottom: spacing.md, color: colors.textSecondary }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
              <Input
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
              <Input
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </div>

            {/* Contact Details Section */}
            <h3 style={{ ...typography.bodyMedium, fontWeight: 600, marginBottom: spacing.md, color: colors.textSecondary }}>Contact Details</h3>
            <Input
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              style={{ marginBottom: spacing.md }}
            />

            <Input
              fullWidth
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              style={{ marginBottom: spacing.lg }}
            />

            {/* Location Section */}
            <h3 style={{ ...typography.bodyMedium, fontWeight: 600, marginBottom: spacing.md, color: colors.textSecondary }}>Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginBottom: spacing.lg }}>
              <Input
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
              />
              <div ref={countryDropdownRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <label style={{ ...typography.label, color: colors.text, fontWeight: 600, marginBottom: spacing.sm, display: 'block' }}>
                  Country
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    value={countrySearch}
                    onFocus={() => setShowCountryDropdown(true)}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCountrySearch(value);
                      setFormData((prev) => ({ ...prev, country: value }));
                      setShowCountryDropdown(true);
                    }}
                    placeholder="Search your country"
                    style={{
                      width: '100%',
                      minHeight: '40px',
                      padding: `${spacing.md} ${spacing.lg}`,
                      paddingRight: spacing['2xl'],
                      background: colors.surface,
                      color: colors.text,
                      border: `2px solid ${colors.border}`,
                      borderRadius: borderRadius.md,
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: typography.label.fontSize,
                      lineHeight: typography.label.lineHeight,
                      boxSizing: 'border-box'
                    }}
                  />
                  <ChevronDown
                    size={16}
                    style={{
                      position: 'absolute',
                      right: spacing.md,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: colors.textMuted,
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {showCountryDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      width: '100%',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      background: '#fff',
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.md,
                      boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                      zIndex: 20
                    }}
                  >
                    {filteredCountries.length === 0 ? (
                      <div style={{ padding: spacing.md, ...typography.small, color: colors.textMuted }}>
                        No country found
                      </div>
                    ) : (
                      filteredCountries.map((country) => (
                        <button
                          key={country}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: `1px solid ${colors.borderLight}`,
                            background: formData.country === country ? 'rgba(16,185,129,0.08)' : '#fff',
                            boxShadow: 'none',
                            textTransform: 'none',
                            letterSpacing: 'normal',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            textAlign: 'left',
                            padding: `${spacing.sm} ${spacing.md}`,
                            cursor: 'pointer',
                            color: colors.text
                          }}
                        >
                          <span>{country}</span>
                          {formData.country === country && <Check size={14} color={colors.primary} />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {message.text && (
              <div
                style={{
                  ...typography.bodySmall,
                  marginBottom: spacing.md,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${message.type === 'success' ? colors.success : colors.danger}`,
                  background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: message.type === 'success' ? colors.success : colors.danger,
                }}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" fullWidth loading={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>

          {/* Hidden file input for photo upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
        </Card>
      </div>
    </PageLayout>
  );
};

export default UserProfile;
