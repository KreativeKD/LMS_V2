import toast from 'react-hot-toast';

let lastErrorToast = {
    message: null,
    timestamp: 0
};

const shouldSkipDuplicateErrorToast = (message) => {
    const now = Date.now();
    const isDuplicate = lastErrorToast.message === message;
    const isWithinWindow = now - lastErrorToast.timestamp < 2000;

    if (isDuplicate && isWithinWindow) {
        return true;
    }

    lastErrorToast = { message, timestamp: now };
    return false;
};

/**
 * Toast notification utilities with consistent styling
 */
export const showToast = {
    success: (message) => {
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#10B981',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
        });
    },

    error: (message) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#EF4444',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
        });
    },

    info: (message) => {
        toast(message, {
            duration: 3000,
            position: 'top-right',
            icon: 'ℹ️',
            style: {
                background: '#3B82F6',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
        });
    },

    loading: (message) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#6366F1',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
            },
        });
    },

    promise: (promise, messages) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading || 'Processing...',
                success: messages.success || 'Success!',
                error: messages.error || 'Something went wrong',
            },
            {
                position: 'top-right',
                style: {
                    padding: '16px',
                    borderRadius: '8px',
                },
            }
        );
    },

    dismiss: (toastId) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    }
};

/**
 * Parse and format error messages from API responses
 */
export const parseError = (error) => {
    const responseData = error?.response?.data;

    // Handle backend validation details from response payload
    if (Array.isArray(responseData?.details) && responseData.details.length > 0) {
        return responseData.details.join('. ');
    }

    // Handle standard response message shape
    if (responseData?.error && typeof responseData.error === 'string') {
        return responseData.error;
    }

    if (responseData?.message && typeof responseData.message === 'string') {
        return responseData.message;
    }

    // Handle validation errors (array of messages)
    if (error.details && Array.isArray(error.details)) {
        return error.details.join('. ');
    }

    // Handle standard error message
    if (error.error) {
        return error.error;
    }

    // Handle error message
    if (error.message) {
        return error.message;
    }

    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Network error. Please check your connection and try again.';
    }

    // Fallback
    return 'An unexpected error occurred. Please try again.';
};

/**
 * User-friendly error message mappings
 */
export const ERROR_MESSAGES = {
    // Authentication errors
    'Invalid login credentials': 'Invalid username or password. Please check and try again.',
    'Please authenticate.': 'Your session has expired. Please login again.',
    'Account is frozen': 'Your account has been temporarily suspended. Please contact support.',
    'Access denied': 'You do not have permission to perform this action.',
    
    // Validation errors
    'All fields are required': 'Please fill in all required fields.',
    'Invalid username format': 'Username must be in the format: name@role (e.g., john@student)',
    'Username already taken': 'This username is already in use. Please choose a different one.',
    'Invalid email': 'Please provide a valid email address.',
    
    // Rate limiting
    'Too many': 'Too many attempts. Please wait a moment and try again.',
    
    // Network errors
    'Failed to fetch': 'Connection error. Please check your internet and try again.',
    'Network request failed': 'Unable to connect to server. Please try again.',
    
    // General errors
    'not found': 'The requested resource was not found.',
    'already exists': 'This item already exists.',
    
    // Default
    'default': 'Something went wrong. Please try again later.'
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyError = (error) => {
    const errorText = parseError(error);
    
    // Check for known error messages
    for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
        if (errorText.toLowerCase().includes(key.toLowerCase())) {
            return message;
        }
    }
    
    // Return the parsed error or default message
    return errorText || ERROR_MESSAGES.default;
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, customMessage = null) => {
    const parsedMessage = getUserFriendlyError(error);
    const friendlyMessage = customMessage && parsedMessage && parsedMessage !== customMessage
        ? `${customMessage}. ${parsedMessage}`
        : (customMessage || parsedMessage);

    if (shouldSkipDuplicateErrorToast(friendlyMessage)) {
        console.error('API Error (duplicate suppressed):', error);
        return;
    }

    showToast.error(friendlyMessage);
    console.error('API Error:', error); // Keep for debugging
};

/**
 * Success message handler
 */
export const handleSuccess = (message) => {
    showToast.success(message);
};
