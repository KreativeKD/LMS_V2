import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import PublicFooter from '../components/PublicFooter';
import { Button, Card, Pagination } from '../components';
import { spacing, colors, typography, borderRadius, shadows } from '../theme';
import { fetchAcademicCourses } from '../api/api';

const CoursesPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourseType, setSelectedCourseType] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const branches = ['All', 'EXTC', 'COMP', 'IT', 'MECH', 'CIVIL', 'AI-DS', 'Other'];
    const itemsPerPage = 8;

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAcademicCourses();
                setCoursesData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const normalizeCourseType = (courseType) => {
        if (['professional', 'short-term', 'projects'].includes(courseType)) return courseType;
        return 'academic';
    };

    const typeFilteredCourses = coursesData.filter((course) => {
        const type = normalizeCourseType(course.courseType);
        if (selectedCourseType === 'all') return true;
        if (selectedCourseType === 'academic') return type === 'academic';
        if (selectedCourseType === 'professional') return type === 'professional';
        if (selectedCourseType === 'projects') return type === 'projects';
        return type === 'short-term';
    });

    const filteredCourses = selectedBranch === 'All'
        ? typeFilteredCourses
        : typeFilteredCourses.filter(course => course.branch === selectedBranch);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBranch, selectedCourseType]);

    const totalPages = Math.max(1, Math.ceil(filteredCourses.length / itemsPerPage));
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="landing-page">
            {/* Courses Section */}
            <section style={{ padding: `${spacing['4xl']} ${spacing.xl} ${spacing['3xl']}` }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: spacing['4xl'] }}>
                    <h2 className="section-title">
                        {selectedCourseType === 'all'
                            ? 'All Available Courses'
                            : (selectedCourseType === 'academic'
                                ? 'Academic Courses'
                                : (selectedCourseType === 'professional'
                                    ? 'Professional Courses'
                                    : (selectedCourseType === 'projects' ? 'Projects' : 'Short Term Courses')))}
                    </h2>
                    <p className="section-subtitle">Choose your learning path and start building expertise</p>
                    <div style={{ display: 'inline-flex', gap: spacing.sm, padding: spacing.xs, background: '#fff', border: `1px solid ${colors.border}`, borderRadius: 999, marginTop: spacing.md }}>
                        <Button
                            variant={selectedCourseType === 'all' ? 'primary' : 'ghost'}
                            size="sm"
                            style={{ textTransform: 'none' }}
                            onClick={() => setSelectedCourseType('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={selectedCourseType === 'academic' ? 'primary' : 'ghost'}
                            size="sm"
                            style={{ textTransform: 'none' }}
                            onClick={() => setSelectedCourseType('academic')}
                        >
                            Academic
                        </Button>
                        <Button
                            variant={selectedCourseType === 'professional' ? 'primary' : 'ghost'}
                            size="sm"
                            style={{ textTransform: 'none' }}
                            onClick={() => setSelectedCourseType('professional')}
                        >
                            Professional
                        </Button>
                        <Button
                            variant={selectedCourseType === 'projects' ? 'primary' : 'ghost'}
                            size="sm"
                            style={{ textTransform: 'none' }}
                            onClick={() => setSelectedCourseType('projects')}
                        >
                            Projects
                        </Button>
                        <Button
                            variant={selectedCourseType === 'short-term' ? 'primary' : 'ghost'}
                            size="sm"
                            style={{ textTransform: 'none' }}
                            onClick={() => setSelectedCourseType('short-term')}
                        >
                            Short Term
                        </Button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: spacing.xl, maxWidth: '1400px', margin: '0 auto', alignItems: 'flex-start' }}>
                    {/* Sidebar Toggle Button */}
                    <Button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        variant="secondary"
                        size="sm"
                        style={{
                            position: 'sticky',
                            top: '100px',
                            zIndex: 10,
                            padding: spacing.sm,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: isSidebarOpen ? '-1rem' : '0',
                            minWidth: '40px',
                            minHeight: '40px',
                            boxShadow: shadows.md
                        }}
                    >
                        {isSidebarOpen ? <LucideIcons.ChevronLeft size={20} /> : <LucideIcons.ChevronRight size={20} />}
                    </Button>

                    {/* Sidebar */}
                    <aside style={{
                        width: isSidebarOpen ? '280px' : '0px',
                        flexShrink: 0,
                        background: colors.background,
                        backdropFilter: 'blur(20px)',
                        borderRadius: borderRadius.xl,
                        padding: isSidebarOpen ? spacing.lg : '0',
                        border: isSidebarOpen ? `1px solid ${colors.border}` : 'none',
                        position: 'sticky',
                        top: '100px',
                        boxShadow: isSidebarOpen ? shadows.md : 'none',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        opacity: isSidebarOpen ? 1 : 0
                    }}>
                        <h3 style={{ ...typography.label, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: spacing.lg, paddingLeft: spacing.sm, whiteSpace: 'nowrap' }}>Branches</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                            {branches.map(branch => (
                                <Button
                                    key={branch}
                                    onClick={() => setSelectedBranch(branch)}
                                    variant={selectedBranch === branch ? 'primary' : 'ghost'}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: spacing.sm,
                                        width: '100%',
                                        textAlign: 'left',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <Sparkles size={18} style={{ opacity: selectedBranch === branch ? 1 : 0.5 }} />
                                    {branch}
                                </Button>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div style={{ flex: 1 }}>
                        <div className="courses-page-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: spacing.lg
                        }}>
                            {paginatedCourses.map((course, index) => {
                                const IconComponent = LucideIcons[course.iconName] || LucideIcons.Book;
                                const colors = ['sticky-yellow', 'sticky-cyan', 'sticky-pink', 'sticky-lime'];
                                const rotations = ['rotate-1', 'rotate-2', 'rotate-3'];
                                const colorClass = colors[index % colors.length];
                                const rotationClass = rotations[index % rotations.length];
                                const courseCategory = normalizeCourseType(course.courseType);
                                const categoryLabel = courseCategory === 'projects'
                                    ? 'Projects'
                                    : (courseCategory === 'professional'
                                        ? 'Professional'
                                        : (courseCategory === 'short-term' ? 'Short Term' : 'Academic'));

                                return (
                                    <Card key={course._id} className={`${colorClass} ${rotationClass}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
                                            <IconComponent size={32} className="sticky-icon" style={{ margin: 0 }} />
                                            <h3 style={{ ...typography.h4, margin: 0 }}>{course.title}</h3>
                                        </div>
                                        <p style={{ ...typography.bodySmall, marginBottom: spacing.lg, flexGrow: 1 }}>{course.description}</p>

                                        <div style={{
                                            background: 'rgba(255, 255, 255, 0.3)',
                                            padding: spacing.md,
                                            borderRadius: borderRadius.sm,
                                            ...typography.small,
                                            marginBottom: spacing.lg,
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            <p style={{ margin: '0.2rem 0' }}><strong>Professor:</strong> {course.professor || '-'}</p>
                                            <p style={{ margin: '0.2rem 0' }}><strong>Category:</strong> {categoryLabel}</p>
                                            <p style={{ margin: '0.2rem 0', fontWeight: 700 }}>
                                                Enrolled Students:
                                                <span className="tag" style={{ marginLeft: '0.5rem' }}>
                                                    {course.linkedCourse && Number.isFinite(course.linkedCourse.studentsCount) ? course.linkedCourse.studentsCount : '-'}
                                                </span>
                                            </p>
                                        </div>

                                        <Button
                                            variant="primary"
                                            fullWidth
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: spacing.sm,
                                                marginTop: 'auto'
                                            }}
                                            onClick={() => navigate('/login')}
                                        >
                                            <span>Enroll Now</span>
                                            <ArrowRight size={18} />
                                        </Button>
                                    </Card>
                                );
                            })}
                            {filteredCourses.length === 0 && !loading && (
                                <Card style={{ gridColumn: '1/-1', textAlign: 'center', padding: spacing['4xl'], background: 'rgba(255,255,255,0.5)', borderRadius: borderRadius.xl, border: `1px dashed ${colors.border}` }}>
                                    <BookOpen size={48} color={colors.accent} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
                                    <h2>No Courses Found</h2>
                                    <p style={{ color: colors.textMuted }}>
                                        We couldn't find {selectedCourseType} courses for the <strong>{selectedBranch}</strong> branch.
                                    </p>
                                    <Button
                                        variant="secondary"
                                        style={{ marginTop: spacing.lg, textTransform: 'none' }}
                                        onClick={() => {
                                            setSelectedBranch('All');
                                            setSelectedCourseType('all');
                                        }}
                                    >
                                        View All Courses
                                    </Button>
                                </Card>
                            )}
                            {loading && (
                                <Card style={{ gridColumn: '1/-1', textAlign: 'center', padding: spacing['4xl'] }}>
                                    <div className="loading-spinner"></div>
                                    <p>Loading course catalogue...</p>
                                </Card>
                            )}
                        </div>
                        {!loading && filteredCourses.length > itemsPerPage && (
                            <div style={{ marginTop: spacing.xl, display: 'flex', justifyContent: 'center' }}>
                                <Pagination
                                    current={currentPage}
                                    total={totalPages}
                                    onPageChange={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredCourses.length}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default CoursesPage;
