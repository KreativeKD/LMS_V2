/**
 * Custom Hook: useCourses
 * Reusable logic for fetching and managing courses
 * Eliminates duplicate code across AdminDashboard, TeacherDashboard, StudentDashboard
 */

import { useState, useEffect } from 'react';
import { fetchCourses } from '../api/api';
import { showToast, handleApiError } from '../utils/toast';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const loadCourses = async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses(page, limit);
      setCourses(data.courses || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      const errorMsg = 'Failed to load courses';
      setError(err.message || errorMsg);
      handleApiError(err, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    setCourses,
    loading,
    error,
    pagination,
    loadCourses,
    refetch: () => loadCourses(pagination.page, pagination.limit)
  };
};

export default useCourses;
