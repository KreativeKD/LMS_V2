import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * FormInput Component
 * Reusable form input with validation, error display, and accessibility
 * 
 * Props:
 * - label: Field label
 * - type: input type (text, email, password, etc.)
 * - placeholder: placeholder text
 * - value: current value
 * - onChange: change handler
 * - error: error message to display
 * - required: if field is required
 * - disabled: if field is disabled
 * - autoComplete: autocomplete attribute
 * - maxLength: max characters
 * - minLength: min characters
 * - pattern: regex pattern for validation
 * - helpText: helpful hint below field
 */
export const FormInput = ({
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  required = false,
  disabled = false,
  autoComplete = 'off',
  maxLength = null,
  minLength = null,
  pattern = null,
  helpText = '',
  id = null,
  onBlur = null,
}) => {
  const fieldId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column' }}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            fontSize: '0.95rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {label}
          {required && (
            <span
              style={{ color: '#ef4444', fontSize: '1.1rem' }}
              aria-label="required"
              title="This field is required"
            >
              *
            </span>
          )}
        </label>
      )}

      {/* Input */}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        required={required}
        aria-label={label || placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : null}
        style={{
          padding: '0.75rem 1rem',
          fontSize: '0.95rem',
          border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
          borderRadius: '8px',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
          backgroundColor: disabled ? '#f3f4f6' : '#fff',
          color: disabled ? '#9ca3af' : '#1f2937',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => {
          if (!error && !disabled) {
            e.target.style.borderColor = 'var(--text-accent)';
            e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
          e.target.style.boxShadow = 'none';
          onBlur?.(e);
        }}
      />

      {/* Help Text */}
      {helpText && !error && (
        <p
          id={`${fieldId}-help`}
          style={{
            fontSize: '0.85rem',
            color: '#6b7280',
            marginTop: '0.4rem',
            marginLeft: '0.25rem',
          }}
        >
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div
          id={`${fieldId}-error`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: '#ef4444',
            marginTop: '0.4rem',
            marginLeft: '0.25rem',
          }}
          role="alert"
        >
          <AlertCircle size={16} aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;
