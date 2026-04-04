import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCourseTestimonial,
  createUnitComment,
  deleteCourseTestimonial,
  deleteUnitComment,
  fetchCourseFull,
  fetchCourseTestimonials,
  fetchUnitComments,
  getLikes,
  likeUnit,
  saveCurrentUnitProgress,
  toggleHiddenContent,
  updateUnitComment,
} from '../api/api';
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Menu,
  Play,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import { Button, Card, PageLayout } from '../components';
import { borderRadius, colors, spacing, typography } from '../theme';

const StudentCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [course, setCourse] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [likes, setLikes] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [courseTestimonials, setCourseTestimonials] = useState([]);
  const [testimonialText, setTestimonialText] = useState('');
  const [testimonialRating, setTestimonialRating] = useState(0);
  const [isTestimonialsLoading, setIsTestimonialsLoading] = useState(false);
  const [isTestimonialSubmitting, setIsTestimonialSubmitting] = useState(false);
  const [showEntryPreview, setShowEntryPreview] = useState(false);
  const [entryPreviewImage, setEntryPreviewImage] = useState('');
  const [entryPreviewTitle, setEntryPreviewTitle] = useState('');
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const ratingMarks = useMemo(() => Array.from({ length: 11 }, (_, index) => (index * 0.5).toFixed(index % 2 === 0 ? 0 : 1)), []);

  const getDisplayName = (person) => {
    if (!person) return null;

    const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
    const fallbackName = person.username ? person.username.split('@')[0] : null;
    const resolvedName = fullName || fallbackName;

    if (!resolvedName) return null;
    if (resolvedName.toLowerCase() === 'kiran talele') return 'Dr. Kiran TALELE';
    return resolvedName;
  };

  const hiddenContent = useMemo(() => {
    if (!user?.enrolledCourses) return [];
    const enrollment = user.enrolledCourses.find(
      (entry) => String(entry.course?._id || entry.course) === String(id)
    );
    return enrollment?.hiddenContent || [];
  }, [id, user]);

  const hiddenContentSet = useMemo(
    () => new Set((hiddenContent || []).map((item) => String(item))),
    [hiddenContent]
  );

  const isHidden = (contentId) => hiddenContentSet.has(String(contentId));

  const sortHiddenToEnd = (items = []) => {
    const visible = [];
    const hidden = [];
    items.forEach((item) => {
      if (isHidden(item._id)) hidden.push(item);
      else visible.push(item);
    });
    return [...visible, ...hidden];
  };

  const instructorNames = useMemo(() => {
    if (!course) return [];

    const seen = new Set();
    const uniqueNames = [];
    const people = [course.instructor, ...(course.assignedTeachers || [])];

    people.forEach((person) => {
      if (!person) return;

      const idKey = person._id ? String(person._id) : null;
      const name = getDisplayName(person);
      const nameKey = name ? name.toLowerCase() : null;
      const key = idKey || nameKey;

      if (!name || !key || seen.has(key)) return;
      seen.add(key);
      uniqueNames.push(name);
    });

    return uniqueNames;
  }, [course]);

  const instructorLabel = instructorNames.join(', ') || 'Unknown';
  const myTestimonial = useMemo(
    () => courseTestimonials.find((testimonial) => String(testimonial.author?._id) === String(user?._id)) || null,
    [courseTestimonials, user]
  );
  const currentEnrollment = useMemo(
    () => user?.enrolledCourses?.find((entry) => String(entry.course?._id || entry.course) === String(id)) || null,
    [id, user]
  );

  const canModerateComments = useMemo(() => {
    if (!course || !user) return false;
    if (user.role === 'admin') return true;
    if (user.role !== 'teacher') return false;

    const userId = String(user._id);
    const isInstructor = String(course.instructor?._id || course.instructor) === userId;
    const isAssigned = (course.assignedTeachers || []).some(
      (teacher) => String(teacher?._id || teacher) === userId
    );

    return isInstructor || isAssigned;
  }, [course, user]);

  const getBackPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'teacher') return '/teacher';
    return '/student';
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const getUnitTypeLabel = (type) => {
    if (type === 'pdf') return 'PDF';
    if (type === 'video') return 'Video';
    if (type === 'text') return 'Text';
    if (type === 'quiz') return 'Quiz';
    return type || 'Content';
  };

  const openPdfDocument = (pdfSource) => {
    if (!pdfSource) {
      showToast.error('PDF file is not available');
      return;
    }

    try {
      // Uploaded PDFs are stored as data URLs. Convert to Blob URL for reliable opening.
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
    } catch (error) {
      console.error('Failed to open PDF:', error);
      showToast.error('Failed to open PDF');
    }
  };

  const getPreviewForEntry = (unit, loadedCourse, hasSavedProgress) => {
    if (!unit) {
      return { image: '', title: '' };
    }

    if (hasSavedProgress) {
      return {
        image: unit.content?.coverImage || '',
        title: unit.title || 'Continue learning'
      };
    }

    return {
      image: loadedCourse?.image || '',
      title: loadedCourse?.title || 'Welcome back'
    };
  };

  const persistCurrentUnit = async (unitId) => {
    if (user?.role !== 'student' || !unitId) return;

    setIsSavingProgress(true);
    try {
      const updatedUser = await saveCurrentUnitProgress(id, unitId);
      login(updatedUser, localStorage.getItem('token'));
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to save your current module');
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleSelectUnit = async (unit) => {
    if (!unit) return;
    setSelectedUnit(unit);
    setShowEntryPreview(false);
    await persistCurrentUnit(unit._id);
  };

  const handleContinueFromPreview = async () => {
    if (!selectedUnit?._id) return;
    setShowEntryPreview(false);
    await persistCurrentUnit(selectedUnit._id);
  };

  const loadUnitLikes = async (unitId) => {
    try {
      const data = await getLikes(id, unitId);
      setLikes((prev) => ({ ...prev, [unitId]: data.likes }));
      setUserLikes((prev) => {
        const next = new Set(prev);
        if (data.userLiked) next.add(unitId);
        else next.delete(unitId);
        return next;
      });
    } catch (error) {
      console.error('Failed to load likes:', error);
    }
  };

  const loadUnitComments = async (unitId) => {
    setIsCommentsLoading(true);
    try {
      const data = await fetchUnitComments(id, unitId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
      showToast.error('Failed to load comments');
    } finally {
      setIsCommentsLoading(false);
    }
  };

  const handleLikeToggle = async (unitId) => {
    try {
      const data = await likeUnit(id, unitId);
      setLikes((prev) => ({ ...prev, [unitId]: data.likes }));
      setUserLikes((prev) => {
        const next = new Set(prev);
        if (data.liked) next.add(unitId);
        else next.delete(unitId);
        return next;
      });
    } catch (error) {
      console.error('Failed to update like:', error);
      showToast.error('Failed to update like');
    }
  };

  const handleToggleHide = async (event, contentId) => {
    event.stopPropagation();
    try {
      const updatedUser = await toggleHiddenContent(id, contentId);
      login(updatedUser, localStorage.getItem('token'));
      showToast.success('Visibility updated');
    } catch (error) {
      console.error(error);
      showToast.error('Failed to update visibility preference');
    }
  };

  const handleCreateComment = async (event) => {
    event.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed || !selectedUnit?._id) return;

    setIsCommentSubmitting(true);
    try {
      const data = await createUnitComment(id, selectedUnit._id, trimmed);
      setComments((prev) => [...prev, data.comment]);
      setCommentText('');
      showToast.success('Comment added');
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to add comment');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleStartEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.text);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleUpdateComment = async (commentId) => {
    const trimmed = editingCommentText.trim();
    if (!trimmed || !selectedUnit?._id) return;

    setIsCommentSubmitting(true);
    try {
      const data = await updateUnitComment(id, selectedUnit._id, commentId, trimmed);
      setComments((prev) => prev.map((comment) => (
        comment._id === commentId ? data.comment : comment
      )));
      handleCancelEditComment();
      showToast.success('Comment updated');
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to update comment');
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!selectedUnit?._id) return;
    if (!window.confirm('Delete this comment?')) return;

    setDeletingCommentId(commentId);
    try {
      await deleteUnitComment(id, selectedUnit._id, commentId);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      if (editingCommentId === commentId) {
        handleCancelEditComment();
      }
      showToast.success('Comment deleted');
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to delete comment');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const loadCourseTestimonials = async () => {
    setIsTestimonialsLoading(true);
    try {
      const data = await fetchCourseTestimonials(id);
      const testimonials = data?.testimonials || [];
      setCourseTestimonials(testimonials);

      const mine = testimonials.find((testimonial) => String(testimonial.author?._id) === String(user?._id));
      setTestimonialText(mine?.text || '');
      setTestimonialRating(mine?.overallRating || mine?.rating || 0);
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to load testimonials');
    } finally {
      setIsTestimonialsLoading(false);
    }
  };

  const handleSaveTestimonial = async (event) => {
    event.preventDefault();
    const trimmed = testimonialText.trim();

    if (trimmed.length < 12) {
      showToast.error('Testimonial must be at least 12 characters long');
      return;
    }
    if (!testimonialRating) {
      showToast.error('Please provide an overall rating');
      return;
    }

    setIsTestimonialSubmitting(true);
    try {
      const data = await createCourseTestimonial(id, {
        text: trimmed,
        overallRating: testimonialRating
      });
      const saved = data?.testimonial;

      setCourseTestimonials((prev) => {
        const others = prev.filter((testimonial) => testimonial._id !== saved._id);
        return [saved, ...others];
      });
      setTestimonialText(saved?.text || trimmed);
      setTestimonialRating(saved?.overallRating || saved?.rating || testimonialRating);
      showToast.success(myTestimonial ? 'Feedback updated' : 'Feedback submitted');
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to save testimonial');
    } finally {
      setIsTestimonialSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async () => {
    if (!myTestimonial) return;
    if (!window.confirm('Delete your testimonial?')) return;

    setIsTestimonialSubmitting(true);
    try {
      await deleteCourseTestimonial(id);
      setCourseTestimonials((prev) => prev.filter((testimonial) => String(testimonial.author?._id) !== String(user?._id)));
      setTestimonialText('');
      setTestimonialRating(0);
      showToast.success('Feedback deleted');
    } catch (error) {
      console.error(error);
      showToast.error(error?.message || 'Failed to delete testimonial');
    } finally {
      setIsTestimonialSubmitting(false);
    }
  };

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await fetchCourseFull(id);

        const isEnrolled = data.students?.some(
          (studentId) => String(studentId) === String(user?._id)
        );
        const assignedTeacherIds = (data.assignedTeachers || []).map((teacher) =>
          String(teacher?._id || teacher)
        );
        const isInstructor =
          user?.role === 'teacher' &&
          (String(data.instructor?._id) === String(user?._id) ||
            assignedTeacherIds.includes(String(user?._id)));
        const isAdmin = user?.role === 'admin';

        if (!isEnrolled && !isAdmin && !isInstructor) {
          showToast.error('You must be enrolled and approved to view this course content.');
          navigate(getBackPath());
          return;
        }

        setCourse(data);
        await loadCourseTestimonials();

        const flattenedUnits = (data.chapters || []).flatMap((chapter) => chapter.units || []);
        const savedUnitId = currentEnrollment?.lastViewedUnit ? String(currentEnrollment.lastViewedUnit) : null;
        const savedUnit = savedUnitId
          ? flattenedUnits.find((unit) => String(unit._id) === savedUnitId)
          : null;
        const firstChapter = data.chapters?.[0];
        const firstUnit = firstChapter?.units?.[0];
        const initialUnit = savedUnit || firstUnit || null;
        const initialChapterId = savedUnit
          ? (data.chapters || []).find((chapter) => (chapter.units || []).some((unit) => String(unit._id) === String(savedUnit._id)))?._id
          : firstChapter?._id;

        if (initialChapterId) setExpandedChapter(initialChapterId);
        if (initialUnit) {
          setSelectedUnit(initialUnit);
          if (user?.role === 'student') {
            const preview = getPreviewForEntry(initialUnit, data, Boolean(savedUnit));
            setEntryPreviewImage(preview.image || '');
            setEntryPreviewTitle(preview.title || '');
            setShowEntryPreview(Boolean(preview.image));
          } else {
            setEntryPreviewImage('');
            setEntryPreviewTitle('');
            setShowEntryPreview(false);
          }
        }
      } catch (error) {
        console.error(error);
        showToast.error('Failed to load course content');
      }
    };

    loadCourse();
  }, [currentEnrollment?.lastViewedUnit, id, navigate, user]);

  useEffect(() => {
    if (selectedUnit?._id) {
      loadUnitLikes(selectedUnit._id);
      if (selectedUnit.type === 'video') {
        loadUnitComments(selectedUnit._id);
      } else {
        setComments([]);
      }
      setCommentText('');
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  }, [selectedUnit]);

  const formatCommentTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString();
  };

  if (!course) {
    return (
      <PageLayout title="Course Content">
        <Card>
          <p style={{ ...typography.bodySmall, margin: 0 }}>Loading course content...</p>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={course.title}>
      <div style={{ display: 'flex', gap: spacing.lg, minHeight: '70vh' }}>
        {isSidebarOpen && (
          <div style={{ width: '320px', flexShrink: 0, alignSelf: 'flex-start' }}>
            <div style={{ ...typography.small, color: colors.textMuted, marginBottom: '14px' }}>
              <p style={{ margin: 0, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, color: colors.accent, opacity: 0.85 }}>
                Instructor
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '22px', fontWeight: 700, color: colors.text, letterSpacing: '0.15px', lineHeight: 1.2 }}>
                {instructorLabel}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {sortHiddenToEnd(course.chapters || []).map((chapter) => {
                const chapterHidden = isHidden(chapter._id);
                const isExpanded = expandedChapter === chapter._id;
                const chapterTitle = chapter.title === '4.' ? 'Chapter 4' : chapter.title === '5.' ? 'Chapter 5' : chapter.title;

                return (
                  <div key={chapter._id}>
                    <button
                      onClick={() => !chapterHidden && setExpandedChapter(isExpanded ? null : chapter._id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        cursor: chapterHidden ? 'default' : 'pointer',
                        opacity: chapterHidden ? 0.6 : 1,
                        textAlign: 'left',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: chapterHidden ? 'line-through' : 'none'
                        }}
                      >
                        <Star size={14} fill="currentColor" style={{ opacity: 0.85, flexShrink: 0 }} />
                        {chapterTitle}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(event) => handleToggleHide(event, chapter._id)}
                          title={chapterHidden ? 'Unhide chapter' : 'Hide chapter'}
                        >
                          {chapterHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        </Button>
                        {!chapterHidden && (
                          <ChevronRight
                            size={18}
                            style={{ 
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              opacity: 0.8,
                              transition: 'transform 0.2s ease'
                            }}
                          />
                        )}
                      </div>
                    </button>

                    {isExpanded && !chapterHidden && (
                      <div style={{ marginTop: spacing.xs, marginLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {chapter.moduleDescriptionPdf && (
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.08)',
                              border: `1px solid rgba(59, 130, 246, 0.25)`,
                              borderRadius: borderRadius.sm,
                              padding: '8px 10px',
                              marginBottom: spacing.xs
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPdfDocument(chapter.moduleDescriptionPdf)}
                              style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                color: colors.info,
                                padding: 0,
                                fontWeight: 600
                              }}
                            >
                              <FileText size={14} /> Open Module Description PDF
                            </Button>
                          </div>
                        )}
                        {sortHiddenToEnd(chapter.units || []).map((unit) => {
                          const unitHidden = isHidden(unit._id);
                          const active = selectedUnit?._id === unit._id;

                          return (
                            <div
                              key={unit._id}
                              onClick={() => !unitHidden && handleSelectUnit(unit)}
                              style={{
                                borderLeft: `3px solid ${active ? colors.primary : 'transparent'}`,
                                background: active ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                                borderRadius: borderRadius.sm,
                                padding: '6px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '6px',
                                opacity: unitHidden ? 0.6 : 1,
                                cursor: unitHidden ? 'default' : 'pointer',
                                fontSize: '14px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                <span
                                  aria-hidden="true"
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '999px',
                                    background: colors.primary,
                                    opacity: active ? 0.9 : 0.65,
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    ...typography.small,
                                    textDecoration: unitHidden ? 'line-through' : 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '14px',
                                  }}
                                >
                                  {unit.title}
                                </span>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(event) => handleToggleHide(event, unit._id)}
                                title={unitHidden ? 'Unhide unit' : 'Hide unit'}
                              >
                                {unitHidden ? <Eye size={12} /> : <EyeOff size={12} />}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Card style={{ marginTop: spacing.md, padding: spacing.md, background: 'linear-gradient(180deg, #ffffff 0%, rgba(16, 185, 129, 0.04) 100%)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.accent, fontWeight: 700 }}>
                    Feedback
                  </p>
                  <h3 style={{ margin: '6px 0 0 0', fontSize: '18px', lineHeight: 1.2, color: colors.text }}>
                    Share your feedback
                  </h3>
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', lineHeight: 1.5, color: colors.textMuted }}>
                    Your feedback is shared with the course instructor inside the instructor dashboard.
                  </p>
                </div>

                {user?.role === 'student' && (
                  <form onSubmit={handleSaveTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                      <span style={{ fontSize: '13px', color: colors.text, fontWeight: 600 }}>
                        Rating
                      </span>
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
                          <span style={{ fontSize: '12px', color: colors.textMuted }}>0</span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.primary }}>
                            {testimonialRating.toFixed(testimonialRating % 1 === 0 ? 0 : 1)} / 5
                          </span>
                          <span style={{ fontSize: '12px', color: colors.textMuted }}>5</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={testimonialRating}
                          onChange={(event) => setTestimonialRating(Number(event.target.value))}
                          style={{
                            width: '100%',
                            accentColor: colors.accent,
                            cursor: 'pointer',
                            margin: 0
                          }}
                        />
                        <div
                          style={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
                            gap: '2px',
                            fontSize: '10px',
                            color: colors.textMuted,
                            textAlign: 'center'
                          }}
                        >
                          {ratingMarks.map((mark) => (
                            <span key={`rating-mark-${mark}`}>{mark}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <textarea
                      value={testimonialText}
                      onChange={(event) => setTestimonialText(event.target.value)}
                      placeholder="Write your feedback about this course..."
                      rows={4}
                      maxLength={600}
                      style={{
                        width: '100%',
                        resize: 'vertical',
                        borderRadius: borderRadius.md,
                        border: '1px solid rgba(15, 23, 42, 0.12)',
                        padding: '12px 14px',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        color: colors.text,
                        background: '#ffffff'
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: spacing.sm }}>
                      <span style={{ fontSize: '12px', color: colors.textMuted }}>
                        {testimonialText.trim().length}/600
                      </span>
                      <div style={{ display: 'flex', alignItems: 'stretch', gap: spacing.sm, flexWrap: 'wrap' }}>
                        {myTestimonial && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleDeleteTestimonial}
                            disabled={isTestimonialSubmitting}
                            style={{ color: colors.danger, paddingLeft: 0, paddingRight: 0 }}
                          >
                            Delete
                          </Button>
                        )}
                        <Button type="submit" disabled={isTestimonialSubmitting} fullWidth style={{ flex: '1 1 100%' }}>
                          {isTestimonialSubmitting ? 'Saving...' : myTestimonial ? 'Update Feedback' : 'Submit Feedback'}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}

                {user?.role !== 'student' && (
                  <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>
                    Only students can submit feedback from this page.
                  </p>
                )}

              </div>
            </Card>
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.md, gap: spacing.md }}>
            <Button variant="secondary" onClick={() => setIsSidebarOpen((prev) => !prev)}>
              <Menu size={16} /> {isSidebarOpen ? 'Hide Outline' : 'Show Outline'}
            </Button>
            <Button variant="primary" onClick={() => navigate(getBackPath())}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Button>
          </div>

          {selectedUnit ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <div style={{ marginBottom: spacing.sm }}>
                <h2 style={{ ...typography.h2, marginBottom: spacing.sm }}>{selectedUnit.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      ...typography.label,
                      background: colors.accent,
                      color: '#ffffff',
                      borderRadius: borderRadius.md,
                      padding: `8px 14px`,
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {getUnitTypeLabel(selectedUnit.type)}
                  </span>
                  <p style={{ ...typography.small, color: colors.textMuted, margin: 0 }}>
                    <strong>Instructor:</strong> {instructorLabel}
                  </p>
                </div>
              </div>

              {showEntryPreview && entryPreviewImage && (
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <img
                      src={entryPreviewImage}
                      alt={entryPreviewTitle || selectedUnit.title}
                      style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{ padding: spacing.lg, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      <div>
                        <p style={{ ...typography.label, color: colors.accent, margin: 0 }}>
                          {currentEnrollment?.lastViewedUnit ? 'Resume your current module' : 'Start with this course intro'}
                        </p>
                        <h3 style={{ ...typography.h4, margin: `${spacing.xs} 0 0 0` }}>
                          {entryPreviewTitle || selectedUnit.title}
                        </h3>
                        <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: `${spacing.sm} 0 0 0` }}>
                          {currentEnrollment?.lastViewedUnit
                            ? 'You are returning to the module you were studying last time.'
                            : 'This image is shown the first time you enter the course before you begin the first module.'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                        <Button onClick={handleContinueFromPreview} disabled={isSavingProgress}>
                          <Play size={16} /> {isSavingProgress ? 'Opening...' : selectedUnit.type === 'video' ? 'Continue to Video' : 'Open Module'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {!showEntryPreview && (
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {selectedUnit.type === 'video' && selectedUnit.content?.videoUrl && (
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={getYouTubeEmbedUrl(selectedUnit.content.videoUrl)}
                      title={selectedUnit.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                )}

                {(selectedUnit.type !== 'video' || !selectedUnit.content?.videoUrl) && (
                  <div style={{ padding: spacing.md }}>
                    {selectedUnit.type === 'text' && selectedUnit.content?.text && (
                      <div style={{ ...typography.body, whiteSpace: 'pre-wrap' }}>{selectedUnit.content.text}</div>
                    )}

                    {selectedUnit.type === 'pdf' && selectedUnit.content?.pdfUrl && (
                      <div style={{ textAlign: 'center', padding: spacing.lg }}>
                        <FileText size={56} color={colors.info} style={{ marginBottom: spacing.md }} />
                        <h3 style={{ ...typography.h4, marginBottom: spacing.sm }}>PDF Document Available</h3>
                        <Button
                          onClick={() => openPdfDocument(selectedUnit.content.pdfUrl)}
                        >
                          Open PDF Document
                        </Button>
                      </div>
                    )}

                    {selectedUnit.type === 'quiz' && (
                      <div style={{ textAlign: 'center', padding: spacing.lg }}>
                        <HelpCircle size={56} color={colors.accent} style={{ marginBottom: spacing.md }} />
                        <h3 style={{ ...typography.h4, marginBottom: spacing.sm }}>Quiz Assessment</h3>
                        <p style={{ ...typography.bodySmall, color: colors.textMuted, marginBottom: spacing.lg }}>
                          Test your knowledge of this section.
                        </p>
                        <Button onClick={() => navigate(`/quiz/${selectedUnit.content.quiz}`)}>Start Quiz</Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
              )}

              {!showEntryPreview && selectedUnit.type === 'video' && selectedUnit.content?.videoUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm }}>
                  <Button
                    variant={userLikes.has(selectedUnit._id) ? 'primary' : 'secondary'}
                    onClick={() => handleLikeToggle(selectedUnit._id)}
                    style={{ padding: '10px 18px', fontSize: '14px' }}
                  >
                    <ThumbsUp size={18} fill={userLikes.has(selectedUnit._id) ? 'currentColor' : 'none'} />
                    {likes[selectedUnit._id] || 0} {(likes[selectedUnit._id] || 0) === 1 ? 'Like' : 'Likes'}
                  </Button>
                </div>
              )}

              {!showEntryPreview && selectedUnit.type === 'video' && selectedUnit.content?.videoUrl && (
                <Card>
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <h3 style={{ ...typography.h4, margin: 0 }}>Comments</h3>

                    <form onSubmit={handleCreateComment} style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                      <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Write your comment..."
                        rows={3}
                        maxLength={1000}
                        style={{
                          width: '100%',
                          resize: 'vertical',
                          border: `1px solid ${colors.border}`,
                          borderRadius: borderRadius.md,
                          padding: spacing.sm,
                          fontFamily: 'inherit',
                          fontSize: typography.bodySmall.fontSize
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm }}>
                        <span style={{ ...typography.xsmall, color: colors.textMuted }}>
                          {commentText.length}/1000
                        </span>
                        <Button
                          type="submit"
                          size="sm"
                          disabled={isCommentSubmitting || !commentText.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </form>

                    {isCommentsLoading ? (
                      <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>Loading comments...</p>
                    ) : comments.length === 0 ? (
                      <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>No comments yet. Be the first to comment.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                        {comments.map((comment) => {
                          const isOwner = String(comment.user?._id) === String(user?._id);
                          const canDelete = isOwner || canModerateComments;
                          const isEditing = editingCommentId === comment._id;

                          return (
                            <div
                              key={comment._id}
                              style={{
                                border: `1px solid ${colors.border}`,
                                borderRadius: borderRadius.md,
                                padding: spacing.sm,
                                background: colors.surface
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm }}>
                                <div>
                                  <p style={{ ...typography.label, margin: 0 }}>
                                    {comment.user?.username?.split('@')[0] || 'Unknown user'}
                                  </p>
                                  <p style={{ ...typography.xsmall, margin: 0, color: colors.textMuted }}>
                                    {formatCommentTime(comment.updatedAt || comment.createdAt)}
                                  </p>
                                </div>
                                <div style={{ display: 'flex', gap: spacing.xs }}>
                                  {isOwner && !isEditing && (
                                    <Button size="sm" variant="ghost" onClick={() => handleStartEditComment(comment)}>
                                      Edit
                                    </Button>
                                  )}
                                  {canDelete && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteComment(comment._id)}
                                      disabled={deletingCommentId === comment._id}
                                      style={{ color: colors.danger }}
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {isEditing ? (
                                <div style={{ marginTop: spacing.sm, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                  <textarea
                                    value={editingCommentText}
                                    onChange={(event) => setEditingCommentText(event.target.value)}
                                    rows={3}
                                    maxLength={1000}
                                    style={{
                                      width: '100%',
                                      resize: 'vertical',
                                      border: `1px solid ${colors.border}`,
                                      borderRadius: borderRadius.md,
                                      padding: spacing.sm,
                                      fontFamily: 'inherit',
                                      fontSize: typography.bodySmall.fontSize
                                    }}
                                  />
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm }}>
                                    <Button size="sm" variant="secondary" onClick={handleCancelEditComment}>
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateComment(comment._id)}
                                      disabled={isCommentSubmitting || !editingCommentText.trim()}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p style={{ ...typography.bodySmall, margin: `${spacing.sm} 0 0 0`, whiteSpace: 'pre-wrap' }}>
                                  {comment.text}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                Select a unit from the outline to begin learning.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentCourseView;
