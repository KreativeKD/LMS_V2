import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, Video as VideoIcon, HelpCircle, Save, ArrowLeft, X, Edit, GripVertical } from 'lucide-react';
import { fetchCourseFull, addChapter, addUnit, createQuiz, deleteChapter, deleteUnit, updateChapter, updateUnit, updateQuiz, fetchQuizById, reorderChapters, reorderUnits, updateCourse } from '../api/api';
import { showToast, handleApiError } from '../utils/toast';
import { Button, Input, Card, PageLayout, Breadcrumb } from '../components';
import { spacing, colors, typography, borderRadius } from '../theme';

const CourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [expandedChapters, setExpandedChapters] = useState({});

    // Quiz State
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [activeChapterId, setActiveChapterId] = useState(null);
    const [quizData, setQuizData] = useState({
        title: '',
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });

    // Unit Modal State
    const [showUnitModal, setShowUnitModal] = useState(false);
    const [unitType, setUnitType] = useState('video');
    const [unitForm, setUnitForm] = useState({ title: '', contentValue: '' });
    const [pdfFileName, setPdfFileName] = useState('');

    // Edit Modal States
    const [showEditChapterModal, setShowEditChapterModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [editingChapterPdfFileName, setEditingChapterPdfFileName] = useState('');
    const [showEditUnitModal, setShowEditUnitModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [editingPdfFileName, setEditingPdfFileName] = useState('');
    const [editingQuiz, setEditingQuiz] = useState(null);

    // Student Progress State
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [studentProgress] = useState([]);
    const [draggedChapterId, setDraggedChapterId] = useState(null);
    const [dragOverChapterId, setDragOverChapterId] = useState(null);
    const [isReorderingChapters, setIsReorderingChapters] = useState(false);
    const [draggedUnitInfo, setDraggedUnitInfo] = useState(null);
    const [dragOverUnitInfo, setDragOverUnitInfo] = useState(null);
    const [isReorderingUnits, setIsReorderingUnits] = useState(false);
    const [selectedCourseType, setSelectedCourseType] = useState('academic');
    const [isSavingCourseMeta, setIsSavingCourseMeta] = useState(false);

    useEffect(() => {
        loadCourseData();
    }, [id]);

    const loadCourseData = async () => {
        setLoading(true);
        try {
            const data = await fetchCourseFull(id);
            setCourse(data);
            setSelectedCourseType(data?.courseType || 'academic');
        } catch (err) { 
            console.error(err);
            handleApiError(err, 'Failed to load course');
        }
        finally { setLoading(false); }
    };

    const handleAddChapter = async (e) => {
        e.preventDefault();
        try {
            await addChapter(id, { title: newChapterTitle });
            setNewChapterTitle('');
            loadCourseData();
            showToast.success('Chapter added successfully!');
        } catch (err) { handleApiError(err, 'Failed to add chapter'); }
    };

    const getReorderedChapters = (chapters, fromChapterId, toChapterId) => {
        const fromIndex = chapters.findIndex((chapter) => chapter._id === fromChapterId);
        const toIndex = chapters.findIndex((chapter) => chapter._id === toChapterId);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return chapters;

        const updated = [...chapters];
        const [movedChapter] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedChapter);
        return updated;
    };

    const handleChapterDragStart = (chapterId) => {
        setDraggedChapterId(chapterId);
    };

    const handleChapterDrop = async (targetChapterId) => {
        if (!course || !draggedChapterId || draggedChapterId === targetChapterId || isReorderingChapters) {
            setDraggedChapterId(null);
            setDragOverChapterId(null);
            return;
        }

        const currentChapters = course.chapters || [];
        const reordered = getReorderedChapters(currentChapters, draggedChapterId, targetChapterId);
        if (reordered === currentChapters) {
            setDraggedChapterId(null);
            setDragOverChapterId(null);
            return;
        }

        const previousChapters = currentChapters;
        setCourse((prev) => ({ ...prev, chapters: reordered }));
        setIsReorderingChapters(true);
        try {
            await reorderChapters(id, reordered.map((chapter) => chapter._id));
            showToast.success('Chapter order updated');
        } catch (err) {
            setCourse((prev) => ({ ...prev, chapters: previousChapters }));
            handleApiError(err, 'Failed to reorder chapters');
        } finally {
            setIsReorderingChapters(false);
            setDraggedChapterId(null);
            setDragOverChapterId(null);
        }
    };

    const getReorderedUnits = (units, fromUnitId, toUnitId) => {
        const fromIndex = units.findIndex((unit) => unit._id === fromUnitId);
        const toIndex = units.findIndex((unit) => unit._id === toUnitId);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return units;

        const updated = [...units];
        const [movedUnit] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedUnit);
        return updated;
    };

    const handleUnitDragStart = (chapterId, unitId) => {
        setDraggedUnitInfo({ chapterId, unitId });
    };

    const handleUnitDrop = async (chapterId, targetUnitId) => {
        if (!course || !draggedUnitInfo || draggedUnitInfo.chapterId !== chapterId || isReorderingUnits) {
            setDraggedUnitInfo(null);
            setDragOverUnitInfo(null);
            return;
        }

        if (draggedUnitInfo.unitId === targetUnitId) {
            setDraggedUnitInfo(null);
            setDragOverUnitInfo(null);
            return;
        }

        const chapter = (course.chapters || []).find((item) => item._id === chapterId);
        if (!chapter) {
            setDraggedUnitInfo(null);
            setDragOverUnitInfo(null);
            return;
        }

        const currentUnits = chapter.units || [];
        const reorderedUnits = getReorderedUnits(currentUnits, draggedUnitInfo.unitId, targetUnitId);
        if (reorderedUnits === currentUnits) {
            setDraggedUnitInfo(null);
            setDragOverUnitInfo(null);
            return;
        }

        const previousUnits = currentUnits;
        setCourse((prev) => ({
            ...prev,
            chapters: (prev.chapters || []).map((item) =>
                item._id === chapterId ? { ...item, units: reorderedUnits } : item
            )
        }));

        setIsReorderingUnits(true);
        try {
            await reorderUnits(chapterId, reorderedUnits.map((unit) => unit._id));
            showToast.success('Unit order updated');
        } catch (err) {
            setCourse((prev) => ({
                ...prev,
                chapters: (prev.chapters || []).map((item) =>
                    item._id === chapterId ? { ...item, units: previousUnits } : item
                )
            }));
            handleApiError(err, 'Failed to reorder units');
        } finally {
            setIsReorderingUnits(false);
            setDraggedUnitInfo(null);
            setDragOverUnitInfo(null);
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (window.confirm('Delete this chapter?')) {
            try {
                await deleteChapter(chapterId);
                loadCourseData();
                showToast.success('Chapter deleted successfully');
            } catch (err) { handleApiError(err, 'Failed to delete chapter'); }
        }
    };

    const openUnitModal = (chapterId, type) => {
        setActiveChapterId(chapterId);
        setUnitType(type);
        setUnitForm({ title: '', contentValue: '' });
        setPdfFileName('');
        if (type === 'quiz') {
            setQuizData({
                title: '',
                questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
            });
            setShowQuizModal(true);
        } else {
            setShowUnitModal(true);
        }
    };

    const handleUnitSubmit = async (e) => {
        e.preventDefault();
        try {
            if (unitType === 'pdf' && !unitForm.contentValue) {
                showToast.error('Please upload a PDF file');
                return;
            }

            const content = {};
            if (unitType === 'video') content.videoUrl = unitForm.contentValue;
            else if (unitType === 'pdf') content.pdfUrl = unitForm.contentValue;
            else content.text = unitForm.contentValue;

            await addUnit(activeChapterId, { title: unitForm.title, type: unitType, content });
            setShowUnitModal(false);
            setPdfFileName('');
            loadCourseData();
            showToast.success('Unit added successfully!');
        } catch (err) { handleApiError(err, 'Failed to add unit'); }
    };

    const handleDeleteUnit = async (unitId) => {
        if (window.confirm('Delete this unit?')) {
            try {
                await deleteUnit(unitId);
                loadCourseData();
                showToast.success('Unit deleted successfully');
            } catch (err) { handleApiError(err, 'Failed to delete unit'); }
        }
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setEditingChapterPdfFileName(chapter.moduleDescriptionPdf ? 'Current uploaded PDF' : '');
        setShowEditChapterModal(true);
    };

    const handleUpdateChapter = async (e) => {
        e.preventDefault();
        try {
            await updateChapter(editingChapter._id, {
                title: editingChapter.title,
                moduleDescriptionPdf: editingChapter.moduleDescriptionPdf || ''
            });
            setShowEditChapterModal(false);
            setEditingChapter(null);
            setEditingChapterPdfFileName('');
            loadCourseData();
            showToast.success('Chapter updated successfully!');
        } catch (err) { handleApiError(err, 'Failed to update chapter'); }
    };

    const handleChapterPdfUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const isPdfMime = file.type === 'application/pdf';
        const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');
        if (!isPdfMime && !hasPdfExtension) {
            showToast.error('Please upload a valid PDF file');
            return;
        }

        const maxSizeBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            showToast.error('PDF must be smaller than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const fileDataUrl = reader.result;
            if (typeof fileDataUrl !== 'string') {
                showToast.error('Failed to read PDF file');
                return;
            }
            setEditingChapter((prev) => ({ ...prev, moduleDescriptionPdf: fileDataUrl }));
            setEditingChapterPdfFileName(file.name);
        };
        reader.onerror = () => showToast.error('Failed to read PDF file');
        reader.readAsDataURL(file);
    };

    const handleEditUnit = (unit) => {
        setEditingUnit({
            ...unit,
            contentValue: unit.content?.videoUrl || unit.content?.pdfUrl || unit.content?.text || ''
        });
        setEditingPdfFileName(unit.type === 'pdf' && unit.content?.pdfUrl ? 'Current uploaded PDF' : '');
        setShowEditUnitModal(true);
    };

    const handleUpdateUnit = async (e) => {
        e.preventDefault();
        try {
            const content = {};
            if (editingUnit.type === 'video') content.videoUrl = editingUnit.contentValue;
            else if (editingUnit.type === 'pdf') content.pdfUrl = editingUnit.contentValue;
            else content.text = editingUnit.contentValue;

            await updateUnit(editingUnit._id, { title: editingUnit.title, content });
            setShowEditUnitModal(false);
            setEditingUnit(null);
            setEditingPdfFileName('');
            loadCourseData();
            showToast.success('Unit updated successfully!');
        } catch (err) { handleApiError(err, 'Failed to update unit'); }
    };

    const handlePdfFileUpload = (event, mode = 'create') => {
        const file = event.target.files?.[0];
        if (!file) return;

        const isPdfMime = file.type === 'application/pdf';
        const hasPdfExtension = file.name.toLowerCase().endsWith('.pdf');
        if (!isPdfMime && !hasPdfExtension) {
            showToast.error('Please upload a valid PDF file');
            return;
        }

        const maxSizeBytes = 10 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            showToast.error('PDF must be smaller than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const fileDataUrl = reader.result;
            if (typeof fileDataUrl !== 'string') {
                showToast.error('Failed to read PDF file');
                return;
            }

            if (mode === 'create') {
                setUnitForm((prev) => ({ ...prev, contentValue: fileDataUrl }));
                setPdfFileName(file.name);
            } else {
                setEditingUnit((prev) => ({ ...prev, contentValue: fileDataUrl }));
                setEditingPdfFileName(file.name);
            }
        };
        reader.onerror = () => showToast.error('Failed to read PDF file');
        reader.readAsDataURL(file);
    };

    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        try {
            const quiz = await createQuiz(quizData);
            await addUnit(activeChapterId, {
                title: quizData.title,
                type: 'quiz',
                content: { quiz: quiz._id }
            });
            setShowQuizModal(false);
            loadCourseData();
            showToast.success('Quiz created successfully!');
        } catch (err) { handleApiError(err, 'Failed to create quiz'); }
    };

    const handleEditQuiz = async (unit) => {
        try {
            const quizData = await fetchQuizById(unit.content.quiz);

            setEditingQuiz({ ...quizData, unitId: unit._id });
            setQuizData({
                title: quizData.title,
                questions: quizData.questions
            });
            setShowQuizModal(true);
        } catch (err) {
            handleApiError(err, 'Failed to load quiz');
        }
    };

    const handleUpdateQuiz = async (e) => {
        e.preventDefault();
        try {
            await updateQuiz(editingQuiz._id, quizData);
            setShowQuizModal(false);
            setEditingQuiz(null);
            setQuizData({
                title: '',
                questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
            });
            loadCourseData();
            showToast.success('Quiz updated successfully!');
        } catch (err) { handleApiError(err, 'Failed to update quiz'); }
    };

    const addQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [...prev.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
        }));
    };

    const updateQuestion = (idx, field, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[idx][field] = value;
        setQuizData(prev => ({ ...prev, questions: newQuestions }));
    };

    const updateOption = (qIdx, oIdx, value) => {
        const newQuestions = [...quizData.questions];
        newQuestions[qIdx].options[oIdx] = value;
        setQuizData(prev => ({ ...prev, questions: newQuestions }));
    };

    const deleteQuestion = (idx) => {
        const newQuestions = quizData.questions.filter((_, i) => i !== idx);
        setQuizData(prev => ({ ...prev, questions: newQuestions }));
    };

    const toggleChapter = (chapterId) => {
        setExpandedChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    const handleSaveCourseType = async () => {
        if (!course) return;

        setIsSavingCourseMeta(true);
        try {
            const payload = {
                title: course.title || 'Untitled Course',
                description: course.description || '',
                descriptionPdf: course.descriptionPdf || '',
                contentHours: Number.isFinite(course.contentHours) ? course.contentHours : 0,
                image: course.image || '',
                courseType: selectedCourseType
            };

            if (course.completionDate) {
                payload.completionDate = course.completionDate;
            }

            const updated = await updateCourse(course._id, payload);
            setCourse((prev) => ({ ...prev, ...updated }));
            showToast.success('Course type updated');
        } catch (err) {
            handleApiError(err, 'Failed to update course type');
        } finally {
            setIsSavingCourseMeta(false);
        }
    };

    if (loading) return <PageLayout title="Course Editor"><p style={{ ...typography.bodySmall, color: colors.textMuted }}>Loading Editor...</p></PageLayout>;
    if (!course) return <PageLayout title="Course Editor"><p style={{ ...typography.bodySmall, color: colors.textMuted }}>Course not found.</p></PageLayout>;

    const breadcrumbs = [
        { label: 'Teacher Dashboard', onClick: () => navigate('/teacher') },
        { label: course.title, current: true }
    ];

    return (
        <PageLayout title="Course Editor" breadcrumbs={<Breadcrumb items={breadcrumbs} />}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: spacing['3xl'] }}>
            <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                style={{ color: colors.accent, display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </Button>

            <Card style={{ marginBottom: spacing.xl, borderLeft: `4px solid ${colors.primary}` }}>
                <h1 style={{ ...typography.h2, margin: 0 }}>{course.title}</h1>
                <p style={{ ...typography.bodySmall, color: colors.textMuted, marginTop: spacing.sm }}>{course.description}</p>
                <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '240px' }}>
                        <label style={{ ...typography.label, display: 'block', marginBottom: spacing.sm }}>Course Type</label>
                        <select
                            value={selectedCourseType}
                            onChange={(event) => setSelectedCourseType(event.target.value)}
                            style={{
                                width: '100%',
                                padding: spacing.md,
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                background: '#fff',
                                color: colors.text,
                                fontFamily: 'inherit'
                            }}
                        >
                            <option value="academic">Academic</option>
                            <option value="professional">Professional</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                    <Button
                        onClick={handleSaveCourseType}
                        variant="primary"
                        loading={isSavingCourseMeta}
                        disabled={(course.courseType || 'academic') === selectedCourseType}
                    >
                        <Save size={16} /> Save Type
                    </Button>
                </div>
            </Card>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg, flexWrap: 'wrap', gap: spacing.sm }}>
                    <h2>Curriculum (Chapters & Units)</h2>
                    <form onSubmit={handleAddChapter} style={{ display: 'flex', gap: spacing.sm }}>
                        <Input
                            placeholder="New Chapter Title"
                            value={newChapterTitle}
                            onChange={e => setNewChapterTitle(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="primary"><Plus size={16} /> Add</Button>
                    </form>
                </div>
                <p style={{ ...typography.small, color: colors.textMuted, marginBottom: spacing.md }}>
                    Drag chapters up or down to reorder them.
                    {isReorderingChapters ? ' Saving new order...' : ''}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {course.chapters?.map((chapter, idx) => (
                        <Card
                            key={chapter._id}
                            draggable={!isReorderingChapters}
                            onDragStart={() => handleChapterDragStart(chapter._id)}
                            onDragOver={(e) => {
                                e.preventDefault();
                                if (dragOverChapterId !== chapter._id) {
                                    setDragOverChapterId(chapter._id);
                                }
                            }}
                            onDragEnd={() => {
                                setDraggedChapterId(null);
                                setDragOverChapterId(null);
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleChapterDrop(chapter._id);
                            }}
                            style={{
                                padding: 0,
                                border: dragOverChapterId === chapter._id
                                    ? `1px solid ${colors.accent}`
                                    : `1px solid ${colors.border}`,
                                boxShadow: dragOverChapterId === chapter._id
                                    ? '0 0 0 3px rgba(79,70,229,0.12)'
                                    : undefined,
                                opacity: draggedChapterId === chapter._id ? 0.6 : 1
                            }}
                        >
                            <div
                                onClick={() => toggleChapter(chapter._id)}
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: colors.surfaceHover,
                                    borderRadius: borderRadius.sm,
                                    borderBottom: expandedChapters[chapter._id] ? `1px solid ${colors.border}` : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <GripVertical size={16} color={colors.textMuted} />
                                    <span style={{ color: 'gray', fontWeight: 'bold' }}>{idx + 1}</span>
                                    <h3 style={{ fontSize: '1.1rem' }}>{chapter.title}</h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); handleEditChapter(chapter); }}
                                        variant="ghost"
                                        size="sm"
                                        title="Edit chapter"
                                    >
                                        <Edit size={18} />
                                    </Button>
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter._id); }}
                                        variant="ghost"
                                        size="sm"
                                        style={{ color: colors.danger }}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                    {expandedChapters[chapter._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                            </div>

                            {expandedChapters[chapter._id] && (
                                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ ...typography.xsmall, color: colors.textMuted, marginBottom: spacing.sm }}>
                                        Drag units within this chapter to reorder.
                                        {isReorderingUnits ? ' Saving unit order...' : ''}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                        {chapter.units?.map(unit => (
                                            <div
                                                key={unit._id}
                                                draggable={!isReorderingUnits}
                                                onDragStart={() => handleUnitDragStart(chapter._id, unit._id)}
                                                onDragOver={(e) => {
                                                    e.preventDefault();
                                                    const dragKey = `${chapter._id}:${unit._id}`;
                                                    if (dragOverUnitInfo?.key !== dragKey) {
                                                        setDragOverUnitInfo({ key: dragKey, chapterId: chapter._id, unitId: unit._id });
                                                    }
                                                }}
                                                onDragEnd={() => {
                                                    setDraggedUnitInfo(null);
                                                    setDragOverUnitInfo(null);
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    handleUnitDrop(chapter._id, unit._id);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    padding: '0.8rem',
                                                    background: 'var(--glass)',
                                                    borderRadius: '6px',
                                                    border: dragOverUnitInfo?.chapterId === chapter._id && dragOverUnitInfo?.unitId === unit._id
                                                        ? `1px solid ${colors.accent}`
                                                        : '1px solid var(--border)',
                                                    boxShadow: dragOverUnitInfo?.chapterId === chapter._id && dragOverUnitInfo?.unitId === unit._id
                                                        ? '0 0 0 2px rgba(79,70,229,0.12)'
                                                        : 'none',
                                                    opacity: draggedUnitInfo?.unitId === unit._id ? 0.6 : 1
                                                }}
                                            >
                                                <GripVertical size={14} color={colors.textMuted} />
                                                {unit.type === 'video' ? <VideoIcon size={16} color="var(--primary)" /> :
                                                    unit.type === 'pdf' ? <FileText size={16} color="var(--secondary)" /> :
                                                        <HelpCircle size={16} color="var(--accent)" />}
                                                <span style={{ flex: 1 }}>{unit.title}</span>
                                                <span className="tag" style={{ color: unit.type === 'quiz' ? 'var(--accent)' : 'gray' }}>{unit.type}</span>
                                                {unit.type === 'quiz' && (
                                                    <button
                                                        onClick={() => handleEditQuiz(unit)}
                                                        style={{ background: 'transparent', color: 'var(--text-accent)', padding: '4px' }}
                                                        title="Edit quiz"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                )}
                                                {unit.type !== 'quiz' && (
                                                    <button
                                                        onClick={() => handleEditUnit(unit)}
                                                        style={{ background: 'transparent', color: 'var(--text-accent)', padding: '4px' }}
                                                        title="Edit unit"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUnit(unit._id)}
                                                    style={{ background: 'transparent', color: '#ff4d4d', padding: '4px' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!chapter.units || chapter.units.length === 0) && (
                                            <p style={{ color: 'gray', fontSize: '0.9rem', textAlign: 'center' }}>No units yet.</p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
                                        <Button onClick={() => openUnitModal(chapter._id, 'video')} variant="secondary" size="sm"><VideoIcon size={14} /> +Video</Button>
                                        <Button onClick={() => openUnitModal(chapter._id, 'pdf')} variant="secondary" size="sm"><FileText size={14} /> +PDF</Button>
                                        <Button onClick={() => openUnitModal(chapter._id, 'text')} variant="secondary" size="sm"><Save size={14} /> +Text</Button>
                                        <Button onClick={() => openUnitModal(chapter._id, 'quiz')} variant="primary" size="sm"><HelpCircle size={14} /> +Quiz</Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                    {(!course.chapters || course.chapters.length === 0) && (
                        <p className="read-the-docs" style={{ textAlign: 'center', marginTop: '2rem' }}>No chapters created yet. Start building your curriculum!</p>
                    )}
                </div>
            </section>

            {/* Unit Modal */}
            {showUnitModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="gradient-text">Add {unitType.charAt(0).toUpperCase() + unitType.slice(1)} Unit</h2>
                            <Button onClick={() => { setShowUnitModal(false); setPdfFileName(''); }} variant="ghost" size="sm">
                                <X size={24} />
                            </Button>
                        </div>
                        <form onSubmit={handleUnitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Input
                                label="Unit Title"
                                placeholder="Enter unit title"
                                value={unitForm.title}
                                onChange={e => setUnitForm({ ...unitForm, title: e.target.value })}
                                required
                                fullWidth
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {unitType === 'video' ? 'YouTube/Video URL' : unitType === 'pdf' ? 'PDF File' : 'Content Text'}
                                </label>
                                {unitType === 'text' ? (
                                    <textarea
                                        placeholder="Enter content here..."
                                        style={{ background: '#f9fafb', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '120px', outline: 'none' }}
                                        value={unitForm.contentValue}
                                        onChange={e => setUnitForm({ ...unitForm, contentValue: e.target.value })}
                                        required
                                    />
                                ) : unitType === 'pdf' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(event) => handlePdfFileUpload(event, 'create')}
                                            required
                                            style={{
                                                background: '#f9fafb',
                                                color: 'var(--text-main)',
                                                border: '1px dashed var(--border)',
                                                borderRadius: '10px',
                                                padding: '12px'
                                            }}
                                        />
                                        <span style={{ ...typography.small, color: colors.textMuted }}>
                                            {pdfFileName ? `Selected: ${pdfFileName}` : 'No PDF selected'}
                                        </span>
                                    </div>
                                ) : (
                                    <Input
                                        placeholder={`Enter ${unitType} link`}
                                        value={unitForm.contentValue}
                                        onChange={e => setUnitForm({ ...unitForm, contentValue: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                )}
                            </div>
                            <Button type="submit" variant="primary" fullWidth style={{ marginTop: spacing.md }}>
                                Add Unit
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Quiz Modal */}
            {showQuizModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 className="gradient-text">{editingQuiz ? 'Edit MCQ Quiz' : 'Create MCQ Quiz'}</h2>
                            <Button onClick={() => { setShowQuizModal(false); setEditingQuiz(null); setQuizData({ title: '', questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }] }); }} variant="ghost" size="sm"><X color={colors.text} /></Button>
                        </div>

                        <form onSubmit={editingQuiz ? handleUpdateQuiz : handleQuizSubmit}>
                            <Input
                                placeholder="Quiz Title"
                                style={{ width: '100%', marginBottom: '1.5rem' }}
                                value={quizData.title}
                                onChange={e => setQuizData({ ...quizData, title: e.target.value })}
                                required
                                fullWidth
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                {quizData.questions.map((q, qIdx) => (
                                    <div key={qIdx} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4 style={{ color: 'var(--text-accent)', margin: 0 }}>Question {qIdx + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => deleteQuestion(qIdx)}
                                                style={{ background: 'transparent', color: '#ff4d4d', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                title="Delete Question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <Input
                                            placeholder="Question Text"
                                            style={{ width: '100%', marginBottom: '1rem' }}
                                            value={q.questionText}
                                            onChange={e => updateQuestion(qIdx, 'questionText', e.target.value)}
                                            required
                                            fullWidth
                                        />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                            {q.options.map((opt, oIdx) => (
                                                <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIdx}`}
                                                        checked={q.correctAnswer === oIdx}
                                                        onChange={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                                                    />
                                                    <Input
                                                        placeholder={`Option ${oIdx + 1}`}
                                                        style={{ flex: 1, padding: '8px' }}
                                                        value={opt}
                                                        onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: spacing.md }}>
                                <Button type="button" onClick={addQuestion} variant="secondary" style={{ flex: 1 }}>+ Add Question</Button>
                                <Button type="submit" variant="primary" style={{ flex: 1 }}>{editingQuiz ? 'Update Quiz' : 'Save Quiz'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Chapter Modal */}
            {showEditChapterModal && editingChapter && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="gradient-text">Edit Chapter</h2>
                            <Button
                                onClick={() => {
                                    setShowEditChapterModal(false);
                                    setEditingChapterPdfFileName('');
                                }}
                                variant="ghost"
                                size="sm"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                        <form onSubmit={handleUpdateChapter} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Input
                                label="Chapter Title"
                                placeholder="Enter chapter title"
                                value={editingChapter.title}
                                onChange={e => setEditingChapter({ ...editingChapter, title: e.target.value })}
                                required
                                fullWidth
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    Module Description PDF (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleChapterPdfUpload}
                                    style={{
                                        background: '#f9fafb',
                                        color: 'var(--text-main)',
                                        border: '1px dashed var(--border)',
                                        borderRadius: '10px',
                                        padding: '12px'
                                    }}
                                />
                                <span style={{ ...typography.small, color: colors.textMuted }}>
                                    {editingChapterPdfFileName
                                        ? `Selected: ${editingChapterPdfFileName}`
                                        : (editingChapter.moduleDescriptionPdf ? 'Using existing PDF' : 'No PDF selected')}
                                </span>
                            </div>
                            <Button type="submit" variant="primary" fullWidth style={{ marginTop: spacing.md }}>
                                Update Chapter
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Unit Modal */}
            {showEditUnitModal && editingUnit && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="gradient-text">Edit {editingUnit.type.charAt(0).toUpperCase() + editingUnit.type.slice(1)} Unit</h2>
                            <Button onClick={() => { setShowEditUnitModal(false); setEditingUnit(null); setEditingPdfFileName(''); }} variant="ghost" size="sm">
                                <X size={24} />
                            </Button>
                        </div>
                        <form onSubmit={handleUpdateUnit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Input
                                label="Unit Title"
                                placeholder="Enter unit title"
                                value={editingUnit.title}
                                onChange={e => setEditingUnit({ ...editingUnit, title: e.target.value })}
                                required
                                fullWidth
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {editingUnit.type === 'video' ? 'YouTube/Video URL' : editingUnit.type === 'pdf' ? 'PDF File' : 'Content Text'}
                                </label>
                                {editingUnit.type === 'text' ? (
                                    <textarea
                                        placeholder="Enter content here..."
                                        style={{ background: '#f9fafb', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '120px', outline: 'none' }}
                                        value={editingUnit.contentValue}
                                        onChange={e => setEditingUnit({ ...editingUnit, contentValue: e.target.value })}
                                        required
                                    />
                                ) : editingUnit.type === 'pdf' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(event) => handlePdfFileUpload(event, 'edit')}
                                            style={{
                                                background: '#f9fafb',
                                                color: 'var(--text-main)',
                                                border: '1px dashed var(--border)',
                                                borderRadius: '10px',
                                                padding: '12px'
                                            }}
                                        />
                                        <span style={{ ...typography.small, color: colors.textMuted }}>
                                            {editingPdfFileName ? `Selected: ${editingPdfFileName}` : 'No new PDF selected (keeps current PDF)'}
                                        </span>
                                    </div>
                                ) : (
                                    <Input
                                        placeholder={`Enter ${editingUnit.type} link`}
                                        value={editingUnit.contentValue}
                                        onChange={e => setEditingUnit({ ...editingUnit, contentValue: e.target.value })}
                                        required
                                        fullWidth
                                    />
                                )}
                            </div>
                            <Button type="submit" variant="primary" fullWidth style={{ marginTop: spacing.md }}>
                                Update Unit
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Progress Modal */}
            {showProgressModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in" style={{ maxWidth: '800px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h2 className="gradient-text">Student Progress</h2>
                            <Button onClick={() => setShowProgressModal(false)} variant="ghost" size="sm">
                                <X size={24} />
                            </Button>
                        </div>

                        {studentProgress.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No students enrolled yet.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-accent)' }}>Student</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-accent)' }}>Progress</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-accent)' }}>Units</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-accent)' }}>Quiz Avg</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-accent)' }}>Last Active</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentProgress.map((student, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '1rem' }}>{student.studentName}</td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${student.completionPercentage}%`, height: '100%', background: 'var(--primary)' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '40px' }}>{student.completionPercentage}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    {student.completedUnits}/{student.totalUnits}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center', color: student.quizAverage > 0 ? 'var(--text-accent)' : 'var(--text-muted)' }}>
                                                    {student.quizAverage > 0 ? `${student.quizAverage}%` : 'N/A'}
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {student.lastAccessed ? new Date(student.lastAccessed).toLocaleDateString() : 'Never'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
        </PageLayout>
    );
};

export default CourseEditor;
