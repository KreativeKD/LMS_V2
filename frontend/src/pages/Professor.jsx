import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, Star,
    Mail, ExternalLink, Linkedin, BarChart2, Zap,
    ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import PublicFooter from '../components/PublicFooter';
import { fetchCourses, fetchPublicProfessors } from '../api/api';
import { showToast } from '../utils/toast';

const Professor = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [professorsData, setProfessorsData] = useState([]);
    const [liveCourses, setLiveCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProfId, setActiveProfId] = useState(null);

    const normalizeCourseTitle = (title) =>
        String(title || '')
            .toLowerCase()
            .replace(/\([^)]*\)/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();

    const normalizeProfessorName = (name) =>
        String(name || '')
            .toLowerCase()
            .split('@')[0]
            .replace(/\b(dr|prof|professor)\.?\s*/g, '')
            .replace(/\b(teacher|student|admin)\b/g, '')
            .replace(/[^a-z]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

    const isSameProfessorName = (left, right) => {
        const a = normalizeProfessorName(left);
        const b = normalizeProfessorName(right);
        if (!a || !b) return false;
        return a === b || a.includes(b) || b.includes(a);
    };

    const getPreferredProfessorRecord = (existing, incoming) => {
        if (!existing) return incoming;

        const existingPriority = Number(Boolean(existing?.teacherId && existing?.isProfileComplete));
        const incomingPriority = Number(Boolean(incoming?.teacherId && incoming?.isProfileComplete));
        if (incomingPriority !== existingPriority) {
            return incomingPriority > existingPriority ? incoming : existing;
        }

        const existingUpdatedAt = new Date(existing?.updatedAt || 0).getTime();
        const incomingUpdatedAt = new Date(incoming?.updatedAt || 0).getTime();
        return incomingUpdatedAt >= existingUpdatedAt ? incoming : existing;
    };

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
        } catch (error) {
            console.error('Failed to open PDF:', error);
            showToast.error('Failed to open description PDF');
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const [data, coursesResponse] = await Promise.all([
                    fetchPublicProfessors(),
                    fetchCourses(1, 100)
                ]);
                const filteredData = (data || []).filter(
                    (prof) => !(prof?.name || '').toLowerCase().includes('michael chen')
                );
                const uniqueByName = new Map();
                filteredData.forEach((prof) => {
                    const normalizedName = normalizeProfessorName(prof?.name);
                    if (!normalizedName) return;
                    const preferred = getPreferredProfessorRecord(uniqueByName.get(normalizedName), prof);
                    uniqueByName.set(normalizedName, preferred);
                });
                const uniqueProfessors = Array.from(uniqueByName.values());
                setProfessorsData(uniqueProfessors);
                setLiveCourses(coursesResponse?.courses || []);
                if (uniqueProfessors.length > 0) setActiveProfId(uniqueProfessors[0]._id);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const selectedProf = professorsData.find(p => p._id === activeProfId) || professorsData[0];
    const selectedProfTeacherId = String(selectedProf?.teacherId?._id || selectedProf?.teacherId || '');
    const selectedProfNormalizedName = normalizeProfessorName(selectedProf?.name);
    const professorBioParagraphs = String(selectedProf?.bio || '')
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
    const experienceStat = selectedProf?.stats?.experience || 'N/A';
    const publicationsStat = selectedProf?.stats?.publications || 'N/A';
    const patentsStat = selectedProf?.stats?.patents || 'N/A';
    const startupsStat = selectedProf?.stats?.startups || 'N/A';
    const profileCourses = selectedProf?.courses || [];
    const fallbackCourses = liveCourses
        .filter((course) => {
            const instructorId = String(course?.instructor?._id || course?.instructor || '');
            const assignedTeacherIds = (course?.assignedTeachers || []).map((teacher) => String(teacher?._id || teacher || ''));
            const isTeacherLinked = selectedProfTeacherId && (instructorId === selectedProfTeacherId || assignedTeacherIds.includes(selectedProfTeacherId));
            if (isTeacherLinked) return true;

            const instructorNames = [
                course?.instructor?.username,
                ...(course?.assignedTeachers || []).map((teacher) => teacher?.username)
            ];

            return instructorNames.some((name) => isSameProfessorName(name, selectedProfNormalizedName));
        })
        .map((course) => ({
            id: course?._id || course?.id || course?.title,
            title: course?.title || 'Untitled Course',
            description: course?.description || 'Course details will be available soon.'
        }));
    const displayedCourses = profileCourses.length > 0 ? profileCourses : fallbackCourses;


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleKnowMore = (course) => {
        const matchedCourse = liveCourses.find(
            (liveCourse) => normalizeCourseTitle(liveCourse.title) === normalizeCourseTitle(course.title)
        );

        if (!matchedCourse?.descriptionPdf) {
            showToast.error('Description PDF is not available for this course');
            return;
        }

        openPdfDocument(matchedCourse.descriptionPdf);
    };

    return (
        <div className="landing-page">
            <div className={`professor-page-layout ${isCollapsed ? 'collapsed' : ''}`} style={{ paddingTop: '5.5rem' }}>
                {/* Left Sidebar */}
                <aside className={`professor-sidebar animate-slide-left ${isCollapsed ? 'collapsed' : ''}`}>
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <MoreHorizontal size={14} style={{ marginBottom: '-4px' }} />
                        {isCollapsed ? <ChevronRight size={18} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={3} />}
                    </button>

                    <h3 className="sidebar-title">Faculty Directory</h3>
                    <div className="professor-list-nav">
                        {professorsData.map((prof) => (
                            <button
                                key={prof._id}
                                className={`prof-nav-item ${activeProfId === prof._id ? 'active' : ''}`}
                                onClick={() => setActiveProfId(prof._id)}
                            >
                                <img src={prof.photo || '/default-prof.png'} alt={prof.name} className="prof-nav-thumb" />
                                <div className="prof-nav-info">
                                    <h4>{prof.name}</h4>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="professor-content-area animate-fade-in">
                    {!loading && selectedProf ? (
                        <>
                            <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                                <div className="section-badge">
                                    <Award size={16} />
                                    <span>Professor Profile</span>
                                </div>
                                <h2 className="section-title" style={{ fontSize: '2.3rem' }}>{selectedProf.name}</h2>
                            </div>

                            <div className="professor-card" style={{ padding: '2rem' }}>
                                {/* Top Section: Photo and Name with Paragraph */}
                                <div className="professor-photo-section" style={{ gap: '2rem', marginBottom: '2rem' }}>
                                    <div className="photo-wrapper" style={{ maxWidth: '250px' }}>
                                        <img src={selectedProf.photo || '/default-prof.png'} alt={selectedProf.name} className="professor-photo" style={{ width: '100%', height: '250px' }} />
                                    </div>

                                    <div className="professor-quick-info">
                                        {/* Professor Information Paragraph */}
                                        <div style={{ marginTop: 0, lineHeight: '1.6', color: '#555' }}>
                                            {professorBioParagraphs.length > 0 ? (
                                                professorBioParagraphs.map((paragraph, index) => (
                                                    <p key={`bio-${index}`} style={{ fontSize: '0.95rem' }}>{paragraph}</p>
                                                ))
                                            ) : (
                                                <p style={{ fontSize: '0.95rem' }}>Instructor biography will appear here once published from the Instructor Profile page.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section - Below Photo and Paragraph */}
                                <div style={{ marginBottom: '2rem' }}>
                                    <div className="quick-stats">
                                        <div className="quick-stat">
                                            <strong>{experienceStat}</strong>
                                            <span>Years Experience</span>
                                        </div>
                                        <div className="quick-stat">
                                            <strong>{publicationsStat}</strong>
                                            <span>Publications</span>
                                        </div>
                                        <div className="quick-stat">
                                            <strong>{patentsStat}</strong>
                                            <span>Patents</span>
                                        </div>
                                        <div className="quick-stat">
                                            <strong>{startupsStat}</strong>
                                            <span>Startups</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="contact-buttons" style={{ marginBottom: '2rem' }}>
                                    {selectedProf.contact?.website && selectedProf.contact.website !== '#' && (
                                        <a href={selectedProf.contact.website} target="_blank" rel="noopener noreferrer" className="contact-btn">
                                            <ExternalLink size={18} />
                                            <span>Website</span>
                                        </a>
                                    )}
                                    {selectedProf.contact?.linkedin && selectedProf.contact.linkedin !== '#' && (
                                        <a href={selectedProf.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-btn">
                                            <Linkedin size={18} />
                                            <span>LinkedIn</span>
                                        </a>
                                    )}
                                    {selectedProf.contact?.email && (
                                        <a href={`mailto:${selectedProf.contact.email}`} className="contact-btn">
                                            <Mail size={18} />
                                            <span>Email</span>
                                        </a>
                                    )}
                                </div>

                                {/* Courses Section */}
                                <div className="professor-courses-section" style={{ margin: '2rem 0' }}>
                                    <h4 className="courses-section-title">Courses by {selectedProf.name}</h4>
                                    <div className="courses-grid">
                                        {displayedCourses.map(course => (
                                            <div key={course.id} className="landing-course-card">
                                                <div className="course-card-content">
                                                    <div className="course-icon">
                                                        {course.id === 'dsp' ? <BarChart2 size={32} /> : <Zap size={32} />}
                                                    </div>
                                                    <h3>{course.title}</h3>
                                                    <p>{String(course.description || '').substring(0, 100)}...</p>
                                                    <button
                                                        className="know-more-btn"
                                                        onClick={() => handleKnowMore(course)}
                                                    >
                                                        <ExternalLink size={16} />
                                                        Know More
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {displayedCourses.length === 0 && (
                                            <p style={{ color: '#666', textAlign: 'left' }}>
                                                No courses linked yet. Assign this instructor to courses to show them here.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="professor-details" style={{ gap: '1.5rem' }}>




                                    {selectedProf.testimonials && selectedProf.testimonials.length > 0 && (
                                        <div className="detail-section">
                                            <div className="detail-header">
                                                <Star size={24} className="detail-icon" />
                                                <h4>Student Feedback</h4>
                                            </div>
                                            <div className="testimonial-card" style={{ margin: 0 }}>
                                                <div className="testimonial-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={16} fill="currentColor" />
                                                    ))}
                                                </div>
                                                <p className="testimonial-text">"{selectedProf.testimonials[0].text}"</p>
                                                <div className="testimonial-author">
                                                    <div className="author-avatar">
                                                        {selectedProf.testimonials[0].author.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <h4>{selectedProf.testimonials[0].author}</h4>
                                                        <p>{selectedProf.testimonials[0].role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>
                            <div className="loading-spinner"></div>
                            <p>Loading faculty profiles...</p>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', width: '100%' }}>
                            <h3>No faculty profiles found.</h3>
                        </div>
                    )}
                </main>
            </div>

            <PublicFooter />
        </div>
    );
};

export default Professor;
