import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Book, Users, User, CheckSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { spacing, colors, typography } from '../theme';
import { Button } from '../components/Button';
import { PageLayout } from '../components/PageLayout';
import { AdminCoursesTab } from '../components/AdminCoursesTab';
import { AdminTeachersTab } from '../components/AdminTeachersTab';
import { AdminStudentsTab } from '../components/AdminStudentsTab';
import { AdminRequestsTab } from '../components/AdminRequestsTab';
import { AdminSettingsTab } from '../components/AdminSettingsTab';
import {
  fetchCourses,
  fetchTeachers,
  fetchStudents,
  fetchRegistrationRequests,
  fetchSettings,
  approveRequest
} from '../api/api';
import { handleApiError, handleSuccess } from '../utils/toast';

const TABS = {
  courses: 'courses',
  teachers: 'teachers',
  students: 'students',
  requests: 'requests',
  settings: 'settings',
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(TABS.courses);
  const [loading, setLoading] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [semesterDate, setSemesterDate] = useState('');
  const [commandQuery, setCommandQuery] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

  const commandRef = useRef(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    courses: '',
    teachers: '',
    students: '',
    requests: '',
    settings: ''
  });

  const loadCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data?.courses || data || []);
      setErrors((prev) => ({ ...prev, courses: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, courses: error?.message || 'Failed to load courses' }));
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await fetchTeachers();
      setTeachers(data || []);
      setErrors((prev) => ({ ...prev, teachers: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, teachers: error?.message || 'Failed to load teachers' }));
    }
  };

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data || []);
      setErrors((prev) => ({ ...prev, students: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, students: error?.message || 'Failed to load students' }));
    }
  };

  const loadRequests = async () => {
    try {
      const data = await fetchRegistrationRequests();
      setRequests(data || []);
      setErrors((prev) => ({ ...prev, requests: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, requests: error?.message || 'Failed to load registration requests' }));
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchSettings();
      setSemesterDate(data?.semesterCompletionDate || '');
      setErrors((prev) => ({ ...prev, settings: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, settings: error?.message || 'Failed to load settings' }));
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await Promise.all([
        loadCourses(),
        loadTeachers(),
        loadStudents(),
        loadRequests(),
        loadSettings(),
      ]);
      setLoading(false);
    };

    run();
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (commandRef.current && !commandRef.current.contains(event.target)) {
        setIsCommandOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const isMobile = viewportWidth < 768;

  const tabs = useMemo(
    () => [
      { key: TABS.courses, label: 'Courses', icon: Book },
      { key: TABS.teachers, label: 'Teachers', icon: Users },
      { key: TABS.students, label: 'Students', icon: User },
      { key: TABS.requests, label: 'Requests', icon: CheckSquare },
      { key: TABS.settings, label: 'Settings', icon: Settings },
    ],
    []
  );

  const commandResults = useMemo(() => {
    const q = commandQuery.trim().toLowerCase();
    if (!q) return [];

    const courseResults = (courses || [])
      .filter((course) => (course.title || '').toLowerCase().includes(q))
      .slice(0, 4)
      .map((course) => ({
        id: `course-${course._id}`,
        type: 'course',
        label: course.title,
        subtitle: 'Open course editor',
        onSelect: () => navigate(`/course/edit/${course._id}`)
      }));

    const studentResults = (students || [])
      .filter((student) => (student.username || '').toLowerCase().includes(q))
      .slice(0, 4)
      .map((student) => ({
        id: `student-${student._id}`,
        type: 'student',
        label: student.username,
        subtitle: 'Jump to Students tab',
        onSelect: () => setActiveTab(TABS.students)
      }));

    const teacherResults = (teachers || [])
      .filter((teacher) => (teacher.username || '').toLowerCase().includes(q))
      .slice(0, 4)
      .map((teacher) => ({
        id: `teacher-${teacher._id}`,
        type: 'teacher',
        label: teacher.username,
        subtitle: 'Jump to Teachers tab',
        onSelect: () => setActiveTab(TABS.teachers)
      }));

    const requestResults = (requests || [])
      .filter((request) => `${request.firstName || ''} ${request.lastName || ''}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((request) => ({
        id: `request-${request._id}`,
        type: 'request',
        label: `${request.firstName} ${request.lastName}`,
        subtitle: 'Approve request from search',
        onSelect: async () => {
          try {
            await approveRequest(request._id);
            handleSuccess('Registration request approved');
            await loadRequests();
            setActiveTab(TABS.requests);
          } catch (error) {
            handleApiError(error);
          }
        }
      }));

    return [...courseResults, ...studentResults, ...teacherResults, ...requestResults].slice(0, 8);
  }, [commandQuery, courses, students, teachers, requests, navigate]);

  const typeStyle = (type) => {
    switch (type) {
      case 'course':
        return { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8', label: 'Course' };
      case 'student':
        return { bg: 'rgba(16,185,129,0.12)', color: '#047857', label: 'Student' };
      case 'teacher':
        return { bg: 'rgba(139,92,246,0.12)', color: '#6d28d9', label: 'Teacher' };
      case 'request':
        return { bg: 'rgba(245,158,11,0.16)', color: '#92400e', label: 'Request' };
      default:
        return { bg: colors.surface, color: colors.textSecondary, label: 'Item' };
    }
  };

  const onCommandKeyDown = async (event) => {
    if (!isCommandOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setIsCommandOpen(true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResultIndex((prev) => Math.min(prev + 1, Math.max(commandResults.length - 1, 0)));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResultIndex((prev) => Math.max(prev - 1, 0));
    }

    if (event.key === 'Escape') {
      setIsCommandOpen(false);
    }

    if (event.key === 'Enter' && commandResults[activeResultIndex]) {
      event.preventDefault();
      const action = commandResults[activeResultIndex];
      await action.onSelect();
      setIsCommandOpen(false);
      setCommandQuery('');
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case TABS.courses:
        return (
          <AdminCoursesTab
            courses={courses}
            teachers={teachers}
            onCoursesUpdate={loadCourses}
            loading={loading}
            error={errors.courses}
            onRetry={loadCourses}
          />
        );
      case TABS.teachers:
        return (
          <AdminTeachersTab
            teachers={teachers}
            courses={courses}
            onTeachersUpdate={loadTeachers}
            loading={loading}
            error={errors.teachers}
            onRetry={loadTeachers}
          />
        );
      case TABS.students:
        return (
          <AdminStudentsTab
            students={students}
            semesterDate={semesterDate}
            onStudentsUpdate={loadStudents}
            loading={loading}
            error={errors.students}
            onRetry={loadStudents}
          />
        );
      case TABS.requests:
        return (
          <AdminRequestsTab
            requests={requests}
            onRequestsUpdate={loadRequests}
            loading={loading}
            error={errors.requests}
            onRetry={loadRequests}
          />
        );
      case TABS.settings:
        return <AdminSettingsTab loading={loading} />;
      default:
        return null;
    }
  };

  const summaryItems = [
    { label: 'Courses', value: courses?.length || 0 },
    { label: 'Teachers', value: teachers?.length || 0 },
    { label: 'Students', value: students?.length || 0 },
    { label: 'Requests', value: requests?.length || 0 }
  ];

  const tabBar = (
    <div
      style={{
        display: 'flex',
        gap: spacing.sm,
        overflowX: 'auto',
        flexWrap: 'nowrap',
        paddingBottom: spacing.xs
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <Button
            key={tab.key}
            variant={isActive ? 'primary' : 'secondary'}
            size={isMobile ? 'md' : 'sm'}
            onClick={() => setActiveTab(tab.key)}
            style={{
              minWidth: isMobile ? 124 : 112,
              justifyContent: 'center'
            }}
          >
            <Icon size={16} />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <PageLayout
      title="Admin Dashboard"
      header={
        <div
          style={{
            marginTop: spacing.md,
            padding: isMobile ? spacing.md : spacing.lg,
            border: `1px solid ${colors.border}`,
            borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(79,70,229,0.05), rgba(255,255,255,0.92))'
          }}
        >
          <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
            Manage courses, users, requests, and system settings.
          </p>

          <div ref={commandRef} style={{ marginTop: spacing.md, position: 'relative' }}>
            <input
              value={commandQuery}
              onChange={(event) => {
                setCommandQuery(event.target.value);
                setIsCommandOpen(true);
                setActiveResultIndex(0);
              }}
              onFocus={() => setIsCommandOpen(true)}
              onKeyDown={onCommandKeyDown}
              placeholder="Quick find: student, teacher, course, request..."
              style={{
                width: '100%',
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: '0.7rem 0.9rem',
                background: '#fff',
                fontSize: isMobile ? '0.9rem' : '0.95rem'
              }}
            />

            {isCommandOpen && commandQuery.trim() && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '100%',
                  maxHeight: 320,
                  overflowY: 'auto',
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  background: '#fff',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                  zIndex: 20
                }}
              >
                {commandResults.length === 0 && (
                  <div style={{ padding: spacing.md, color: colors.textMuted, ...typography.small }}>
                    No match found. Try a different keyword.
                  </div>
                )}

                {commandResults.map((result, index) => {
                  const tag = typeStyle(result.type);
                  const isActive = index === activeResultIndex;
                  return (
                    <button
                      key={result.id}
                      type="button"
                      onMouseEnter={() => setActiveResultIndex(index)}
                      onClick={async () => {
                        await result.onSelect();
                        setCommandQuery('');
                        setIsCommandOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left',
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: 0,
                        borderBottom: `1px solid ${colors.borderLight}`,
                        background: isActive ? 'rgba(79,70,229,0.06)' : '#fff',
                        boxShadow: 'none',
                        textTransform: 'none',
                        minHeight: 54
                      }}
                    >
                      <div>
                        <div style={{ ...typography.label, color: colors.text }}>{result.label}</div>
                        <div style={{ ...typography.xsmall, color: colors.textMuted }}>{result.subtitle}</div>
                      </div>
                      <span
                        style={{
                          ...typography.xsmall,
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: 999,
                          background: tag.bg,
                          color: tag.color,
                          fontWeight: 700
                        }}
                      >
                        {tag.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.sm }}>
            {summaryItems.map((item) => (
              <div
                key={item.label}
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: 999,
                  border: `1px solid ${colors.border}`,
                  background: '#fff',
                  fontSize: typography.xsmall.fontSize,
                  color: colors.textSecondary,
                  fontWeight: 600
                }}
              >
                {item.label}: <span style={{ color: colors.text }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: spacing.md }}>{tabBar}</div>
        </div>
      }
      maxWidth="1400px"
    >
      {renderActiveTab()}
    </PageLayout>
  );
};

export default AdminDashboard;
