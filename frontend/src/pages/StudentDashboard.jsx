import React, { useState, useEffect } from 'react';
import { fetchCourses, enrollInCourse, fetchCurrentUser, fetchMyPublicTestimonial, createPublicTestimonial } from '../api/api';
import { PlayCircle, CheckCircle, BookOpen, Video, FileText, HelpCircle, ArrowLeft, ExternalLink, FileType, Calendar, Star, MessageSquareQuote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast, handleApiError, handleSuccess } from '../utils/toast';
import { Button, Card, PageLayout, Input } from '../components';
import { spacing, colors, typography } from '../theme';

const stripRoleSuffix = (username = '') => username.replace(/@(admin|teacher|student)$/i, '');

const isAdminIdentity = (person) => {
    if (!person) return false;
    if (person.role === 'admin') return true;
    const username = stripRoleSuffix(person.username || '').trim().toLowerCase();
    return username === 'admin';
};

const getDisplayName = (person) => {
    if (!person) return null;
    const fullName = [person.firstName, person.lastName].filter(Boolean).join(' ').trim();
    const fallbackName = person.username ? stripRoleSuffix(person.username) : null;
    const resolvedName = fullName || fallbackName;

    if (!resolvedName) return null;
    if (resolvedName.toLowerCase() === 'kiran talele') return 'Dr. Kiran TALELE';
    return resolvedName;
};

const getTeacherNames = (course) => {
    const people = [course.instructor, ...(course.assignedTeachers || [])].filter(Boolean);
    const filtered = people.filter((person) => !isAdminIdentity(person));

    const seen = new Set();
    const uniqueNames = [];
    filtered.forEach((person) => {
        const idKey = person._id ? String(person._id) : null;
        const name = getDisplayName(person);
        const nameKey = name ? name.toLowerCase() : null;
        const key = idKey || nameKey;
        if (!name || !key || seen.has(key)) return;
        seen.add(key);
        uniqueNames.push(name);
    });

    return uniqueNames.join(', ') || 'Unassigned';
};

const formatDateWithShortMonth = (value) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const COURSE_SECTIONS = [
    { id: 'academic', title: 'Academic Courses', label: 'Academic' },
    { id: 'short-term', title: 'Short-term Courses', label: 'Short Term' },
    { id: 'projects', title: 'Projects', label: 'Projects' },
    { id: 'professional', title: 'Professional Courses', label: 'Professional' }
];

const StudentDashboard = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [expandedUnits, setExpandedUnits] = useState({});
    const [userData, setUserData] = useState(null);
    const [selectedCourseType, setSelectedCourseType] = useState('academic');
    const [searchQuery, setSearchQuery] = useState('');
    const [publicTestimonial, setPublicTestimonial] = useState(null);
    const [testimonialText, setTestimonialText] = useState('');
    const [testimonialRating, setTestimonialRating] = useState(0);
    const [testimonialLoading, setTestimonialLoading] = useState(false);

    const isMyCoursesPage = location.pathname === '/my-courses';

    useEffect(() => {
        loadCourses();
        loadUser();
    }, []);

    useEffect(() => {
        if (user?.role === 'student') {
            loadMyTestimonial();
        }
    }, [user]);

    const loadUser = async () => {
        try {
            const data = await fetchCurrentUser();
            setUserData(data);
            login(data, localStorage.getItem('token'));
        } catch (err) {
            console.error(err);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await fetchCourses();
            setCourses(data.courses || data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadMyTestimonial = async () => {
        try {
            const data = await fetchMyPublicTestimonial();
            const testimonial = data?.testimonial || null;
            setPublicTestimonial(testimonial);
            setTestimonialText(testimonial?.text || '');
            setTestimonialRating(testimonial?.rating || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitPublicTestimonial = async (event) => {
        event.preventDefault();
        const trimmed = testimonialText.trim();

        if (trimmed.length < 12) {
            showToast.error('Testimonial must be at least 12 characters long');
            return;
        }
        if (!testimonialRating) {
            showToast.error('Please select a rating');
            return;
        }

        setTestimonialLoading(true);
        try {
            const data = await createPublicTestimonial({
                text: trimmed,
                rating: testimonialRating
            });
            const saved = data?.testimonial || null;
            setPublicTestimonial(saved);
            setTestimonialText(saved?.text || trimmed);
            setTestimonialRating(saved?.rating || testimonialRating);
            handleSuccess(saved?.status === 'approved' ? 'Testimonial updated' : 'Testimonial submitted for admin approval');
        } catch (err) {
            handleApiError(err);
        } finally {
            setTestimonialLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (user.role !== 'student') {
            showToast.error('Only students can enroll in courses.');
            return;
        }
        setLoading(true);
        try {
            await enrollInCourse(courseId);
            handleSuccess('Successfully enrolled!');
            await loadCourses();
            const updatedUser = await fetchCurrentUser();
            setUserData(updatedUser);
            login(updatedUser, localStorage.getItem('token'));
            // Navigate to the course page
            navigate(`/course/read/${courseId}`);
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUnitContent = (unitId) => {
        setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    const openPdfDocument = (pdfSource) => {
        if (!pdfSource) {
            showToast.error('PDF file is not available');
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
        } catch (error) {
            console.error('Failed to open PDF:', error);
            showToast.error('Failed to open PDF');
        }
    };

    const normalizeCourseType = (courseType) => {
        if (['professional', 'short-term', 'projects'].includes(courseType)) return courseType;
        return 'academic';
    };

    const courseMatchesType = (course, courseType) => {
        const type = normalizeCourseType(course.courseType);
        if (courseType === 'academic') return type === 'academic';
        if (courseType === 'professional') return type === 'professional';
        if (courseType === 'projects') return type === 'projects';
        return type === 'short-term';
    };

    const displayedCourses = courses.filter((course) => {
        const enrollmentRecord = userData?.enrolledCourses?.find((entry) => {
            const enrolledId = entry.course?._id || entry.course;
            return String(enrolledId) === String(course._id);
        });
        const isEnrolled = enrollmentRecord?.status === 'approved';

        if (isMyCoursesPage) {
            return isEnrolled;
        }

        return true;
    });

    const searchedCourses = isMyCoursesPage
        ? displayedCourses
        : displayedCourses.filter((course) => {
            const query = searchQuery.trim().toLowerCase();
            if (!query) return true;

            const title = (course.title || '').toLowerCase();
            const description = (course.description || '').toLowerCase();
            const teachers = getTeacherNames(course).toLowerCase();
            return title.includes(query) || description.includes(query) || teachers.includes(query);
        });

    const groupedCourseSections = COURSE_SECTIONS.map((section) => ({
        ...section,
        courses: searchedCourses.filter((course) => courseMatchesType(course, section.id))
    })).filter((section) => section.courses.length > 0);

    const handleCategoryJump = (courseType) => {
        setSelectedCourseType(courseType);
        const sectionElement = document.getElementById(`course-section-${courseType}`);
        if (sectionElement) {
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const testimonialCard = !isMyCoursesPage && user?.role === 'student' ? (
        <Card style={{ padding: spacing.md }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                        <MessageSquareQuote size={18} color={colors.primary} />
                        <p style={{ ...typography.small, color: colors.primary, margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Testimonials
                        </p>
                    </div>
                    <h3 style={{ ...typography.h5, margin: 0 }}>Share a general testimonial</h3>
                    <p style={{ ...typography.small, color: colors.textMuted, margin: `${spacing.sm} 0 0 0`, lineHeight: 1.5 }}>
                        This testimonial goes to admin for approval and may appear on the landing page.
                    </p>
                </div>

                {publicTestimonial?.status && (
                    <div
                        style={{
                            alignSelf: 'flex-start',
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: '999px',
                            background:
                                publicTestimonial.status === 'approved'
                                    ? 'rgba(16, 185, 129, 0.12)'
                                    : publicTestimonial.status === 'rejected'
                                        ? 'rgba(239, 68, 68, 0.12)'
                                        : 'rgba(245, 158, 11, 0.14)',
                            color:
                                publicTestimonial.status === 'approved'
                                    ? colors.success
                                    : publicTestimonial.status === 'rejected'
                                        ? colors.danger
                                        : colors.warning,
                            ...typography.small,
                            fontWeight: 700
                        }}
                    >
                        {publicTestimonial.status === 'approved'
                            ? 'Approved'
                            : publicTestimonial.status === 'rejected'
                                ? 'Rejected'
                                : 'Pending approval'}
                    </div>
                )}

                <form onSubmit={handleSubmitPublicTestimonial} style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                        <span style={{ ...typography.small, color: colors.text, fontWeight: 600 }}>Rating</span>
                        <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                            {[1, 2, 3, 4, 5].map((value) => {
                                const active = value <= testimonialRating;
                                return (
                                    <button
                                        key={`public-testimonial-star-${value}`}
                                        type="button"
                                        onClick={() => setTestimonialRating(value)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'transparent',
                                            border: 'none',
                                            padding: 0,
                                            color: active ? '#fbbf24' : 'rgba(148, 163, 184, 0.75)'
                                        }}
                                    >
                                        <Star size={22} fill={active ? 'currentColor' : 'none'} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <textarea
                        value={testimonialText}
                        onChange={(event) => setTestimonialText(event.target.value)}
                        rows={4}
                        maxLength={600}
                        placeholder="Write a testimonial..."
                        style={{
                            width: '100%',
                            resize: 'vertical',
                            borderRadius: '12px',
                            border: `1px solid ${colors.border}`,
                            padding: spacing.sm,
                            fontFamily: 'inherit',
                            fontSize: typography.bodySmall.fontSize,
                            lineHeight: 1.6
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                        <span style={{ ...typography.small, color: colors.textMuted }}>
                            {testimonialText.trim().length}/600
                        </span>
                        <Button type="submit" loading={testimonialLoading} fullWidth>
                            {publicTestimonial ? 'Update Testimonial' : 'Submit Testimonial'}
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    ) : null;

    if (selectedCourse) {
        return (
            <PageLayout title="My Courses">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <Button
                    onClick={() => setSelectedCourse(null)}
                    variant="ghost"
                    style={{ color: colors.accent, display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}
                >
                    <ArrowLeft size={18} /> Back to My Courses
                </Button>

                <Card style={{ marginBottom: spacing.xl, borderLeft: `4px solid ${colors.primary}` }}>
                    <h1 style={{ ...typography.h2, margin: 0 }}>{selectedCourse.title}</h1>
                    {selectedCourse.descriptionPdf ? (
                        <div style={{ marginTop: spacing.sm }}>
                            <Button
                                onClick={() => openPdfDocument(selectedCourse.descriptionPdf)}
                                variant="secondary"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}
                            >
                                <FileText size={16} /> <ExternalLink size={14} /> Open Description PDF
                            </Button>
                        </div>
                    ) : (
                        <p style={{ ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.sm }}>{selectedCourse.description}</p>
                    )}
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {selectedCourse.chapters?.map((chapter, idx) => (
                        <Card key={chapter._id}>
                            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: colors.accent, opacity: 0.5 }}>{idx + 1}</span> {chapter.title}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {chapter.units?.map(unit => (
                                    <Card key={unit._id} style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
                                        <div
                                            onClick={() => {
                                                if (unit.type === 'quiz') {
                                                    navigate(`/quiz/${unit.content.quiz}`);
                                                } else {
                                                    toggleUnitContent(unit._id);
                                                }
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                cursor: 'pointer',
                                                padding: '0.5rem'
                                            }}
                                        >
                                            {unit.type === 'video' ? <Video size={18} color={colors.primary} /> :
                                                unit.type === 'pdf' ? <FileText size={18} color={colors.info} /> :
                                                    unit.type === 'text' ? <FileType size={18} color={colors.accent} /> :
                                                        <HelpCircle size={18} color={colors.accent} />}
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '500' }}>{unit.title}</p>
                                                <span style={{ fontSize: '0.75rem', color: colors.textMuted, textTransform: 'uppercase' }}>
                                                    {unit.type}
                                                </span>
                                            </div>
                                            {unit.type === 'quiz' && <Button variant="primary" size="sm" style={{ fontSize: '0.8rem' }}>Take Quiz</Button>}
                                        </div>

                                        {/* Unit Content Display */}
                                        {expandedUnits[unit._id] && unit.type !== 'quiz' && (
                                            <div style={{ marginTop: spacing.md, padding: spacing.md, background: colors.surfaceHover, borderRadius: '8px', borderTop: `1px solid ${colors.border}` }}>
                                                {unit.type === 'video' && unit.content?.videoUrl && (
                                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                                        <iframe
                                                            src={getYouTubeEmbedUrl(unit.content.videoUrl)}
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                border: 'none',
                                                                borderRadius: '8px'
                                                            }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            title={unit.title}
                                                        />
                                                    </div>
                                                )}

                                                {unit.type === 'pdf' && unit.content?.pdfUrl && (
                                                    <div style={{ textAlign: 'center', padding: spacing.xl }}>
                                                        <FileText size={48} color={colors.info} style={{ marginBottom: spacing.md }} />
                                                        <p style={{ marginBottom: spacing.md, color: colors.textMuted }}>PDF Document</p>
                                                        <Button
                                                            onClick={() => openPdfDocument(unit.content.pdfUrl)}
                                                            variant="primary"
                                                            href={unit.content.pdfUrl}
                                                            style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}
                                                        >
                                                            <ExternalLink size={16} /> Open PDF
                                                        </Button>
                                                    </div>
                                                )}

                                                {unit.type === 'text' && unit.content?.text && (
                                                    <div style={{ padding: spacing.md, lineHeight: '1.8', color: colors.text }}>
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>{unit.content.text}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title={isMyCoursesPage ? 'My Courses' : (user.role === 'student' ? 'Courses' : 'Course Catalog')}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {userData?.semesterCompletionDate && (
                <Card style={{ marginBottom: spacing.xl, display: 'flex', alignItems: 'center', gap: spacing.md, borderLeft: `4px solid ${colors.accent}` }}>
                    <Calendar size={24} color={colors.accent} />
                    <div>
                        <h4 style={{ margin: 0, color: colors.accent }}>Course Completion Deadline</h4>
                        <p style={{ margin: 0, color: colors.textMuted }}>All coursework must be completed by <strong>{userData.semesterCompletionDate}</strong>. Accounts will be frozen after this date.</p>
                    </div>
                </Card>
            )}

            <div className="student-dashboard-layout" style={{ gap: spacing.lg, alignItems: 'start', gridTemplateColumns: isMyCoursesPage ? '1fr' : undefined }}>
                {!isMyCoursesPage && (
                    <div className="student-dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, top: '106px' }}>
                        <Card>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                                <h3 style={{ ...typography.h5, margin: 0 }}>Search & Filter</h3>
                                <Input
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    fullWidth
                                />

                                {user.role === 'student' && (
                                    <div>
                                        <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.sm }}>Category</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.sm }}>
                                            {COURSE_SECTIONS.map((section) => (
                                                <Button
                                                    key={section.id}
                                                    variant={selectedCourseType === section.id ? 'primary' : 'ghost'}
                                                    size="sm"
                                                    style={{ textTransform: 'none', width: '100%', justifyContent: 'center' }}
                                                    onClick={() => handleCategoryJump(section.id)}
                                                >
                                                    {section.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                        {testimonialCard}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
                {groupedCourseSections.map((courseSection) => (
                    <section
                        key={courseSection.id}
                        id={`course-section-${courseSection.id}`}
                        className="student-dashboard-course-section"
                    >
                        <h2 style={{ ...typography.h4, margin: `0 0 ${spacing.md} 0`, color: colors.text }}>
                            {courseSection.title}
                        </h2>
                        <div className="student-dashboard-courses-grid" style={{ gap: spacing.lg }}>
                {courseSection.courses.map(course => {
                    const enrollmentRecord = userData?.enrolledCourses?.find((entry) => {
                        const enrolledId = entry.course?._id || entry.course;
                        return String(enrolledId) === String(course._id);
                    });
                    const enrolled = enrollmentRecord?.status === 'approved' || user?.role === 'admin';
                    const enrollmentDate = enrollmentRecord?.enrolledAt ? new Date(enrollmentRecord.enrolledAt) : null;
                    const expiresAt = enrollmentDate && !Number.isNaN(enrollmentDate.getTime())
                        ? (() => {
                            const expiry = new Date(enrollmentDate);
                            expiry.setMonth(expiry.getMonth() + 6);
                            return expiry;
                        })()
                        : null;
                    const isExpired = !!(expiresAt && new Date() > expiresAt && user?.role !== 'admin');
                    const enrolledAtText = enrollmentRecord?.enrolledAt
                        ? formatDateWithShortMonth(enrollmentRecord.enrolledAt)
                        : null;
                    const expiresAtText = formatDateWithShortMonth(expiresAt);
                    const enrolledStudentsCount = Number.isFinite(course.studentsCount)
                        ? course.studentsCount
                        : (Array.isArray(course.students) ? course.students.length : 0);
                    return (
                        <div
                            key={course._id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                background: colors.surface,
                                borderRadius: '12px',
                                border: `1px solid ${colors.border}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease',
                                height: '100%'
                            }}
                        >
                            {/* Image Section */}
                            <div style={{
                                height: '130px',
                                background: course.image ? 'transparent' : colors.gradient,
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {course.image ? (
                                    <img 
                                        src={course.image} 
                                        alt={course.title}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover'
                                        }} 
                                    />
                                ) : (
                                    <BookOpen size={32} color="rgba(255, 255, 255, 0.8)" />
                                )}
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: spacing.md, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Course Title */}
                                <h3 style={{ 
                                    margin: '0 0 ' + spacing.sm + ' 0',
                                    fontSize: '1.08rem',
                                    fontWeight: 600,
                                    color: colors.accent,
                                    lineHeight: '1.3'
                                }}>
                                    {course.title}
                                </h3>

                                {/* Course Description */}
                                {course.descriptionPdf ? (
                                    <Button
                                        onClick={() => openPdfDocument(course.descriptionPdf)}
                                        variant="ghost"
                                        size="sm"
                                        style={{
                                            justifyContent: 'flex-start',
                                            padding: '0',
                                            margin: '0 0 ' + spacing.md + ' 0',
                                            color: colors.primary,
                                            fontWeight: 600
                                        }}
                                    >
                                        <FileText size={14} /> Open Description PDF
                                    </Button>
                                ) : (
                                    <p style={{
                                        margin: '0 0 ' + spacing.md + ' 0',
                                        fontSize: '0.8rem',
                                        color: colors.textMuted,
                                        lineHeight: '1.4'
                                    }}>
                                        {course.description}
                                    </p>
                                )}

                                <div style={{ 
                                    fontSize: '0.86rem', 
                                    color: colors.text,
                                    fontWeight: 600,
                                    marginBottom: spacing.sm
                                }}>
                                    <span>No. of hours - {Number.isFinite(course.contentHours) ? course.contentHours : 0}</span>
                                </div>

                                <div style={{ 
                                    fontSize: '0.86rem',
                                    color: colors.text,
                                    fontWeight: 600,
                                    marginBottom: spacing.sm
                                }}>
                                    <span>No. of enrollments - {enrolledStudentsCount}</span>
                                </div>

                                {/* Instructor Info */}
                                <p style={{ 
                                    ...typography.small,
                                    margin: '0 0 ' + spacing.md + ' 0',
                                    color: colors.text,
                                    fontSize: '0.86rem',
                                    fontWeight: 600 
                                }}>
                                    <span style={{ color: colors.text, fontWeight: 700 }}>Instructor:</span>{' '}
                                    <span style={{ color: colors.text }}>{getTeacherNames(course)}</span>
                                </p>

                                {/* Spacer */}
                                <div style={{ flex: 1 }} />

                                {/* Enrollment Status and Action Button */}
                                <div>
                                    {enrolled ? (
                                        <>
                                            {enrolledAtText && (
                                                <div style={{
                                                    ...typography.small,
                                                    color: colors.text,
                                                    fontWeight: 700,
                                                    marginBottom: spacing.sm
                                                }}>
                                                    Enrolled on: <strong style={{ color: colors.text, fontWeight: 700 }}>{enrolledAtText}</strong>
                                                </div>
                                            )}
                                            {expiresAtText && (
                                                <div style={{
                                                    ...typography.small,
                                                    color: isExpired ? colors.danger : colors.text,
                                                    fontWeight: 700,
                                                    marginBottom: spacing.sm
                                                }}>
                                                    Expires on: <strong style={{ color: isExpired ? colors.danger : colors.text, fontWeight: 700 }}>{expiresAtText}</strong>
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', marginBottom: spacing.sm }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: spacing.sm,
                                                    padding: spacing.sm,
                                                    background: isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                    borderRadius: '6px',
                                                    border: isExpired ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                                                    flex: '0 0 auto'
                                                }}>
                                                    <CheckCircle size={16} color={isExpired ? colors.danger : colors.success} />
                                                    <span style={{ 
                                                        fontSize: '0.85rem', 
                                                        fontWeight: 600,
                                                        color: isExpired ? colors.danger : colors.success 
                                                    }}>
                                                        {isExpired ? 'Course Expired' : 'Enrolled'}
                                                    </span>
                                                </div>
                                                <Button
                                                    onClick={() => !isExpired && navigate(`/course/read/${course._id}`)}
                                                    variant="primary"
                                                    disabled={isExpired}
                                                    size="sm"
                                                    style={{ flex: '1 1 auto' }}
                                                >
                                                    <PlayCircle size={16} /> {isExpired ? 'Access Expired' : 'Go to Course'}
                                                </Button>
                                            </div>
                                        </>
                                    ) : user.role === 'student' ? (
                                        (() => {
                                            const enrollment = userData?.enrolledCourses?.find(e => {
                                                const enrolledId = e.course?._id || e.course;
                                                return String(enrolledId) === String(course._id);
                                            });
                                        const isPending = enrollment?.status === 'pending';

                                        return (
                                            <Button
                                                onClick={() => !isPending && handleEnroll(course._id)}
                                                disabled={loading || isPending}
                                                variant={isPending ? 'secondary' : 'primary'}
                                                size="sm"
                                                fullWidth
                                                style={{ width: '100%' }}
                                            >
                                                {loading ? 'Enrolling...' : isPending ? 'Pending Approval' : 'Enroll'}
                                            </Button>
                                        );
                                    })()
                                ) : (
                                    <Button
                                        onClick={() => setSelectedCourse(course)}
                                        variant="secondary"
                                        size="sm"
                                        fullWidth
                                        style={{ width: '100%' }}
                                    >
                                        View Mode
                                    </Button>
                                )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                        </div>
                    </section>
                ))}

                {!loading && searchedCourses.length === 0 && (
                    <Card style={{ textAlign: 'center', padding: spacing.xl }}>
                        <p style={{ ...typography.bodySmall, color: colors.textMuted, margin: 0 }}>
                            {isMyCoursesPage
                                ? 'You have not enrolled in any courses yet.'
                                : searchQuery.trim()
                                    ? 'No courses matched your search.'
                                    : 'No courses are available right now.'}
                        </p>
                    </Card>
                )}

                </div>
            </div>
        </div>
        </PageLayout>
    );
};

export default StudentDashboard;
