const NAME_REGEX = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const USERNAME_ROLE_REGEX = /^[A-Za-z0-9._\-\s]{1,40}@(admin|teacher|student)$/i;

export const validateName = (value, fieldLabel = 'Name') => {
  const trimmed = (value || '').trim();
  if (!trimmed) return `${fieldLabel} is required`;
  if (trimmed.length < 2) return `${fieldLabel} must be at least 2 characters`;
  if (trimmed.length > 50) return `${fieldLabel} must be at most 50 characters`;
  if (!NAME_REGEX.test(trimmed)) return `${fieldLabel} contains invalid characters`;
  return '';
};

export const validateRequired = (value, fieldLabel = 'This field') => {
  const trimmed = (value || '').trim();
  if (!trimmed) return `${fieldLabel} is required`;
  return '';
};

export const validateUsernameWithRole = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Username is required';
  if (!USERNAME_ROLE_REGEX.test(trimmed)) {
    return 'Use format name@role (role: admin, teacher, or student)';
  }
  return '';
};

export const validatePasswordMin6 = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters long';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export default {
  validateName,
  validateRequired,
  validateUsernameWithRole,
  validatePasswordMin6,
  validateConfirmPassword
};
