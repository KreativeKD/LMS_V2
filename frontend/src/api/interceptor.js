import { showToast } from "../utils/toast";

// Not being used (kept for reference)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Centralized error handler for all API requests
 * Handles retries, status codes, and user-friendly error messages
 */
export const handleApiError = (error, customMessage = null) => {
  // Network error - request failed to reach server
  if (!error.response) {
    if (error.message === "Failed to fetch") {
      showToast.error(
        customMessage ||
          "Network connection error. Please check your internet.",
      );
    } else {
      showToast.error(customMessage || error.message || "An error occurred.");
    }
    return;
  }

  const status = error.response.status;
  const data = error.response.data;
  const message =
    data?.error?.message || data?.error || data?.message || "Unknown error";

  // Handle specific status codes
  switch (status) {
    case 400:
      showToast.error(customMessage || message || "Bad request.");
      break;
    case 401:
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      showToast.error("Your session has expired. Please login again.");
      window.location.href = "/login";
      break;
    case 403:
      showToast.error(
        customMessage || "You do not have permission for this action.",
      );
      break;
    case 404:
      showToast.error(customMessage || message || "Resource not found.");
      break;
    case 429:
      showToast.error("Too many requests. Please wait a moment and try again.");
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      showToast.error(customMessage || "Server error. Please try again later.");
      break;
    default:
      showToast.error(
        customMessage || message || "An error occurred. Please try again.",
      );
  }
};

/**
 * Wrapper for fetch with automatic retries for network failures
 * Uses exponential backoff for retry delays
 */
export const fetchWithRetry = async (
  url,
  options = {},
  retries = 3,
  onRetry = null,
) => {
  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...getHeaders(), ...options.headers },
      });
      return response;
    } catch (err) {
      lastError = err;

      const isNetworkError =
        err?.name === "TypeError" ||
        err?.message === "Failed to fetch" ||
        err?.message === "Network request failed";

      if (!isNetworkError) {
        throw err;
      }

      // Don't retry if this is the last attempt
      if (i === retries - 1) {
        throw err;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry(i + 1, retries, err.message);
      }

      // Wait before retrying (exponential backoff: 1s, 2s, 4s)
      const delayMs = 1000 * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
};

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = async (response) => {
  try {
    return await response.json();
  } catch (err) {
    return {
      error: `Failed to parse response: ${err.message}`,
      statusCode: response.status,
    };
  }
};

/**
 * Create an error object from a response
 */
export const createErrorFromResponse = (status, data) => {
  const error = new Error(
    data?.error?.message || data?.error || data?.message || "Unknown error",
  );
  error.response = {
    status,
    data,
  };
  return error;
};

export default {
  handleApiError,
  fetchWithRetry,
  safeJsonParse,
  createErrorFromResponse,
};
