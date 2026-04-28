import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Book, ChevronRight, Layout, Users, X, Eye, Menu, FileText, ExternalLink } from 'lucide-react';
import {
  fetchCourses,
  createCourse,
  fetchEnrolledStudents,
  fetchCourseTestimonials,
  deleteCourseFeedbackById,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import { showToast, handleApiError } from '../utils/toast';
import { Button, Input, Card, PageLayout, SkeletonLoader } from '../components';
import { spacing, colors, typography } from '../theme';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [descriptionPdf, setDescriptionPdf] = useState('');
  const [courseType, setCourseType] = useState('academic');
  const [contentHours, setContentHours] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [courseFeedback, setCourseFeedback] = useState([]);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      const coursesList = data.courses || data || [];

      if (user && coursesList) {
        const myCourses = coursesList.filter(
          (course) =>
            (course.instructor && String(course.instructor._id) === String(user._id)) ||
            (course.assignedTeachers &&
              course.assignedTeachers.some((teacher) => String(teacher._id) === String(user._id)))
        );
        setCourses(myCourses);

        if (selectedCourse) {
          const updatedSelectedCourse = myCourses.find(
            (course) => String(course._id) === String(selectedCourse._id)
          );
          setSelectedCourse(updatedSelectedCourse || null);
        }
      }
    } catch (err) {
      handleApiError(err, 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        title: courseTitle,
        description: '',
        courseType,
        descriptionPdf,
        contentHours: Number(contentHours),
      };

      if (completionDate) {
        payload.completionDate = completionDate;
      }

      await createCourse(payload);

      setCourseTitle('');
      setDescriptionPdf('');
      setCourseType('academic');
      setContentHours('');
      setCompletionDate('');
      setShowCourseForm(false);
      await loadCourses();
      showToast.success('Course created successfully');
    } catch (err) {
      handleApiError(err, 'Failed to create course');
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const students = await fetchEnrolledStudents(courseId);
      setEnrolledStudents(students || []);
      setShowStudentsModal(true);
    } catch (err) {
      handleApiError(err, 'Failed to load students');
    }
  };

  const handleDescriptionPdfChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      showToast.error('Please upload a valid PDF file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setDescriptionPdf(e.target.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const loadCourseFeedback = async () => {
      if (!selectedCourse?._id) {
        setCourseFeedback([]);
        return;
      }

      setIsFeedbackLoading(true);
      try {
        const data = await fetchCourseTestimonials(selectedCourse._id);
        setCourseFeedback(data?.testimonials || []);
      } catch (err) {
        handleApiError(err, 'Failed to load feedback');
      } finally {
        setIsFeedbackLoading(false);
      }
    };

    loadCourseFeedback();
  }, [selectedCourse?._id]);

  const openPdfDocument = (pdfSource) => {
    if (!pdfSource) {
      showToast.error('Description PDF is not available');
      return;
    }

    try {
      if (typeof pdfSource === 'string' && pdfSource.startsWith('data:application/pdf')) {
        const [meta, base64Data] = pdfSource.split(',');
        if (!base64Data || !meta.includes(';base64')) {
          showToast.error('Invalid PDF data');
          return;
        }

        const byteChars = atob(base64Data);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i += 1) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }

        const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60 * 1000);
        return;
      }

      window.open(pdfSource, '_blank', 'noopener,noreferrer');
    } catch {
      showToast.error('Failed to open description PDF');
    }
  };

  // Sidebar content: compact list with search
  const [query, setQuery] = useState('');

  const filteredCourses = courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
  const dashboardStats = useMemo(() => {
    let totalStudents = 0;
    let chapterCount = 0;

    courses.forEach((course) => {
      chapterCount += course.chapters?.length || 0;
      totalStudents += Number.isFinite(course.studentsCount)
        ? course.studentsCount
        : (course.students?.length || 0);
    });

    return {
      totalCourses: courses.length,
      totalStudents,
      totalChapters: chapterCount,
    };
  }, [courses]);

  const handleDeleteFeedback = async (feedbackId) => {
    if (!selectedCourse?._id || !feedbackId) return;
    if (!window.confirm('Delete this feedback?')) return;

    setDeletingFeedbackId(feedbackId);
    try {
      await deleteCourseFeedbackById(selectedCourse._id, feedbackId);
      setCourseFeedback((prev) => prev.filter((item) => item._id !== feedbackId));
      showToast.success('Feedback deleted');
    } catch (err) {
      handleApiError(err, 'Failed to delete feedback');
    } finally {
      setDeletingFeedbackId(null);
    }
  };

  const sidebar = (
    <div>
      <div style={{ marginBottom: spacing.md }}>
        <h3 style={{ ...typography.h4, margin: `0 0 ${spacing.sm} 0` }}>My Courses</h3>
      </div>
      <div style={{ display: 'flex', gap: spacing.sm, marginBottom: spacing.md, alignItems: 'center' }}>
        <Input
          placeholder="Search courses"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button variant="ghost" onClick={() => setShowCourseForm(true)} aria-label="Create course">
          <Plus size={18} />
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {loading ? (
          <SkeletonLoader type="course-item" count={3} />
        ) : filteredCourses.length === 0 ? (
          <Card variant="ghost">
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Book size={30} color={colors.textMuted} style={{ opacity: 0.5, marginBottom: spacing.sm }} />
              <p style={{ ...typography.label, margin: `0 0 ${spacing.xs} 0` }}>No courses yet</p>
              <p style={{ ...typography.small, color: colors.textMuted, margin: `0 0 ${spacing.md} 0` }}>
                Create your first course to start teaching.
              </p>
              <Button size="sm" variant="primary" onClick={() => setShowCourseForm(true)}>
                <Plus size={14} /> Create Course
              </Button>
            </div>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course._id}
              onClick={() => setSelectedCourse(course)}
              style={{
                display: 'flex',
                gap: spacing.md,
                alignItems: 'center',
                padding: spacing.sm,
                borderRadius: 8,
                cursor: 'pointer',
                background: selectedCourse?._id === course._id ? 'rgba(79, 70, 229, 0.06)' : 'transparent',
                border: selectedCourse?._id === course._id ? `1px solid ${colors.primary}` : '1px solid transparent',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg,#eef2ff,#e9d5ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: colors.primary,
                }}
              >
                {course.title?.charAt(0)?.toUpperCase() || 'C'}
              </div>

                <div style={{ flex: 1 }}>
                  <div style={{ ...typography.label }}>{course.title}</div>
                <div style={{ ...typography.small, color: colors.textMuted }}>
                  {Number.isFinite(course.studentsCount) ? course.studentsCount : (course.students || []).length} students
                </div>
                </div>

              <ChevronRight size={16} color={colors.textMuted} />
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Main content (right)
  const mainContent = (
    <div>
      <Card
        style={{
          marginBottom: spacing.lg,
          background: 'linear-gradient(120deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.08))',
          border: `1px solid ${colors.border}`,
        }}
      >
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: spacing.md }}>
            <h2 style={{ ...typography.h3, margin: 0 }}>Instructor Studio</h2>
            <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
              Manage curriculum and monitor enrollment from one place.
            </p>
            <div style={{ marginTop: spacing.sm }}>
              <Button
                variant="secondary"
                onClick={() => navigate('/teacher/instructor-profile')}
              >
                Setup Instructor Profile
              </Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: spacing.md }}>
            <div style={{ padding: spacing.md, borderRadius: 10, background: colors.surface, border: `1px solid ${colors.border}` }}>
              <div style={{ ...typography.small, color: colors.textMuted }}>Courses</div>
              <div style={{ ...typography.h4, color: colors.primary }}>{dashboardStats.totalCourses}</div>
            </div>
            <div style={{ padding: spacing.md, borderRadius: 10, background: colors.surface, border: `1px solid ${colors.border}` }}>
              <div style={{ ...typography.small, color: colors.textMuted }}>Students</div>
              <div style={{ ...typography.h4, color: colors.primary }}>{dashboardStats.totalStudents}</div>
            </div>
            <div style={{ padding: spacing.md, borderRadius: 10, background: colors.surface, border: `1px solid ${colors.border}` }}>
              <div style={{ ...typography.small, color: colors.textMuted }}>Chapters</div>
              <div style={{ ...typography.h4, color: colors.primary }}>{dashboardStats.totalChapters}</div>
            </div>
          </div>
        </div>
      </Card>

      {showCourseForm && (
        <Card style={{ marginBottom: spacing.xl }}>
          <h3 style={{ ...typography.h4, marginTop: 0, marginBottom: spacing.md }}>Create New Course</h3>
          <form onSubmit={handleCreateCourse} style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
            <Input placeholder="Enter Course Title" style={{ flex: 1, minWidth: '260px' }} value={courseTitle} onChange={(event) => setCourseTitle(event.target.value)} required />
            <Input
              type="number"
              min="0"
              step="0.5"
              placeholder="No. of Course Hours"
              value={contentHours}
              onChange={(event) => setContentHours(event.target.value)}
              required
            />
            <div style={{ minWidth: '220px' }}>
              <label style={{ display: 'block', marginBottom: spacing.sm, ...typography.label }}>Course Type</label>
              <select
                value={courseType}
                onChange={(event) => setCourseType(event.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: colors.surface,
                  color: colors.text,
                  fontFamily: 'inherit'
                }}
              >
                <option value="academic">Academic</option>
                <option value="professional">Professional</option>
                <option value="short-term">Short Term</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: spacing.sm, ...typography.label }}>Description PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleDescriptionPdfChange}
                required
                style={{
                  width: '100%',
                  padding: spacing.md,
                  borderRadius: '8px',
                  border: `2px dashed ${colors.border}`,
                  background: colors.surface,
                }}
              />
              {descriptionPdf && (
                <div style={{ ...typography.small, color: colors.textMuted, marginTop: spacing.xs }}>
                  PDF uploaded successfully.
                </div>
              )}
            </div>
            <Input type="date" value={completionDate} onChange={(event) => setCompletionDate(event.target.value)} />
            <Button type="submit" variant="primary">Create</Button>
            <Button type="button" variant="secondary" onClick={() => { setShowCourseForm(false); setDescriptionPdf(''); setCourseType('academic'); setContentHours(''); }}>Cancel</Button>
          </form>
        </Card>
      )}

      <Card>
        {selectedCourse ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.lg
              }}
            >
              <div>
                <h2
                  style={{
                    ...typography.h3,
                    color: colors.primary,
                    margin: 0,
                    lineHeight: 1.2,
                    wordBreak: 'break-word'
                  }}
                >
                  {selectedCourse.title}
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: spacing.sm,
                  maxWidth: isMobile ? 'calc(100% - 16px)' : '360px',
                  paddingRight: isMobile ? spacing.sm : spacing.md,
                  boxSizing: 'border-box'
                }}
              >
                {selectedCourse.descriptionPdf ? (
                  <Button
                    variant="secondary"
                    onClick={() => openPdfDocument(selectedCourse.descriptionPdf)}
                    fullWidth
                    style={{ justifyContent: 'center', minHeight: '46px', padding: '10px 14px' }}
                  >
                    <FileText size={16} /> <ExternalLink size={14} /> Open Description PDF
                  </Button>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      minHeight: '46px',
                      padding: `10px ${spacing.md}`,
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                      background: colors.surfaceAlt,
                      color: colors.textMuted,
                      ...typography.small
                    }}
                  >
                    {selectedCourse.description || 'No description available'}
                  </div>
                )}
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/course/read/${selectedCourse._id}`)}
                  fullWidth
                  style={{ justifyContent: 'center', minHeight: '46px', padding: '10px 14px' }}
                >
                  <Eye size={16} /> View Course
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/course/edit/${selectedCourse._id}`)}
                  fullWidth
                  style={{ justifyContent: 'center', minHeight: '46px', padding: '10px 14px' }}
                >
                  <Layout size={16} /> Edit Curriculum
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleViewStudents(selectedCourse._id)}
                  fullWidth
                  style={{ justifyContent: 'center', minHeight: '46px', padding: '10px 14px' }}
                >
                  <Users size={16} /> Students
                </Button>
              </div>
            </div>

            <Card style={{ marginTop: spacing.lg }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div>
                  <p style={{ ...typography.small, color: colors.primary, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                    Feedback
                  </p>
                  <h3 style={{ ...typography.h4, margin: `${spacing.xs} 0 0 0` }}>Student course feedback</h3>
                </div>

                {isFeedbackLoading ? (
                  <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>Loading feedback...</p>
                ) : courseFeedback.length === 0 ? (
                  <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                    No feedback has been submitted for this course yet.
                  </p>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      {courseFeedback.map((item) => (
                        <div
                          key={item._id}
                          style={{
                            border: `1px solid ${colors.border}`,
                            borderRadius: 12,
                            padding: spacing.md,
                            background: colors.surface
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: spacing.md, alignItems: 'flex-start' }}>
                            <div>
                              <p style={{ ...typography.label, margin: 0 }}>{item.author?.name || 'Student'}</p>
                              <p style={{ ...typography.xsmall, color: colors.textMuted, margin: `${spacing.xs} 0 0 0` }}>
                                {new Date(item.updatedAt || item.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div style={{ display: 'grid', gap: '8px', justifyItems: 'end' }}>
                              <div
                                style={{
                                  minWidth: '72px',
                                  padding: '6px 10px',
                                  borderRadius: 999,
                                  background: 'rgba(79, 70, 229, 0.08)',
                                  color: colors.accent,
                                  fontSize: typography.xsmall.fontSize,
                                  fontWeight: 700,
                                  textAlign: 'center'
                                }}
                              >
                                {Number(item.overallRating || item.rating || 0).toFixed(Number(item.overallRating || item.rating || 0) % 1 === 0 ? 0 : 1)} / 5
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFeedback(item._id)}
                                disabled={deletingFeedbackId === item._id}
                                style={{ color: colors.danger, paddingLeft: 0, paddingRight: 0 }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <p style={{ ...typography.bodySmall, margin: `${spacing.sm} 0 0 0`, whiteSpace: 'pre-wrap' }}>
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </>
        ) : (
          <div style={{ width: '100%', minHeight: '300px', display: 'grid', placeItems: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '620px',
                border: `1px dashed ${colors.border}`,
                borderRadius: 14,
                padding: spacing.xl,
                textAlign: 'center',
                background: 'rgba(79, 70, 229, 0.03)',
              }}
            >
              <Book size={42} color={colors.primary} style={{ opacity: 0.7, marginBottom: spacing.md }} />
              <h3 style={{ ...typography.h3, margin: `0 0 ${spacing.sm} 0` }}>No course selected</h3>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: `0 0 ${spacing.lg} 0` }}>
                Choose a course from the left panel to edit curriculum, manage enrollments, and review student activity.
              </p>
              <Button variant="primary" onClick={() => setShowCourseForm(true)}>
                <Plus size={16} /> Create Course
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  // FAB (Floating Action Button) for creating new course
  const fab = (
    <button
      onClick={() => setShowCourseForm(true)}
      style={{
        position: 'fixed',
        bottom: spacing.xl,
        right: spacing.xl,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        color: 'white',
        border: 'none',
        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 40,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(79, 70, 229, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.4)';
      }}
      aria-label="Create new course"
      title="Create new course"
    >
      <Plus size={24} />
    </button>
  );

  // Mobile header with hamburger menu
  const mobileHeader = isMobile ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
      <Button
        variant="ghost"
        onClick={() => setShowMobileSidebar(!showMobileSidebar)}
        aria-label="Toggle sidebar"
        style={{ padding: spacing.sm }}
      >
        <Menu size={20} />
      </Button>
    </div>
  ) : null;

  // Mobile sidebar overlay
  const mobileSidebarOverlay = isMobile && showMobileSidebar ? (
    <div
      onClick={() => setShowMobileSidebar(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 20,
      }}
    />
  ) : null;

  // Mobile sidebar slide-over
  const mobileSidebarPanel = isMobile && showMobileSidebar ? (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '280px',
        background: colors.surface,
        borderRight: `1px solid ${colors.border}`,
        padding: spacing.lg,
        overflowY: 'auto',
        zIndex: 30,
        animation: 'slideInLeft 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
        <h3 style={{ ...typography.h4, margin: 0 }}>My Courses</h3>
        <Button variant="ghost" onClick={() => setShowMobileSidebar(false)} aria-label="Close sidebar">
          <X size={20} />
        </Button>
      </div>
      {sidebar}
    </div>
  ) : null;

  return (
    <>
      <style>{`@keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }`}</style>
      <PageLayout
        title="Instructor Studio"
        header={mobileHeader}
        sidebar={!isMobile ? sidebar : null}
        hasSidebar={!isMobile}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>{mainContent}</div>
      </PageLayout>
      {mobileSidebarOverlay}
      {mobileSidebarPanel}
      {!isMobile && courses.length > 0 ? null : fab}

      {showStudentsModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" style={{ maxWidth: '500px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}
            >
              <h2 className="gradient-text">Enrolled Students</h2>
              <Button onClick={() => setShowStudentsModal(false)} variant="ghost" size="sm">
                <X size={20} />
              </Button>
            </div>

            {enrolledStudents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {enrolledStudents.map((student) => (
                  <Card key={student._id} variant="ghost">
                    <div style={{ ...typography.label }}>{student.username?.split('@')[0]}</div>
                    <div style={{ ...typography.small, color: colors.textMuted }}>{student.username}</div>
                  </Card>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: colors.textMuted }}>No students enrolled yet.</p>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default TeacherDashboard;
