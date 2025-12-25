import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, ChevronDown, ChevronRight, FileText, Video as VideoIcon, HelpCircle, Save, ArrowLeft, X, Edit } from 'lucide-react';
import { fetchCourses, addChapter, addUnit, deleteCourse, createQuiz, deleteChapter, deleteUnit, updateChapter, updateUnit, updateQuiz } from '../api/api';

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

    // Edit Modal States
    const [showEditChapterModal, setShowEditChapterModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [showEditUnitModal, setShowEditUnitModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [editingQuiz, setEditingQuiz] = useState(null);

    // Student Progress State
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [studentProgress, setStudentProgress] = useState([]);

    useEffect(() => {
        loadCourseData();
    }, [id]);

    const loadCourseData = async () => {
        try {
            const data = await fetchCourses();
            const found = data.find(c => c._id === id);
            setCourse(found);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAddChapter = async (e) => {
        e.preventDefault();
        try {
            await addChapter(id, { title: newChapterTitle });
            setNewChapterTitle('');
            loadCourseData();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (window.confirm('Delete this chapter?')) {
            try {
                await deleteChapter(chapterId);
                loadCourseData();
            } catch (err) { alert(err.message); }
        }
    };

    const openUnitModal = (chapterId, type) => {
        setActiveChapterId(chapterId);
        setUnitType(type);
        setUnitForm({ title: '', contentValue: '' });
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
            const content = {};
            if (unitType === 'video') content.videoUrl = unitForm.contentValue;
            else if (unitType === 'pdf') content.pdfUrl = unitForm.contentValue;
            else content.text = unitForm.contentValue;

            await addUnit(activeChapterId, { title: unitForm.title, type: unitType, content });
            setShowUnitModal(false);
            loadCourseData();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteUnit = async (unitId) => {
        if (window.confirm('Delete this unit?')) {
            try {
                await deleteUnit(unitId);
                loadCourseData();
            } catch (err) { alert(err.message); }
        }
    };

    const handleEditChapter = (chapter) => {
        setEditingChapter(chapter);
        setShowEditChapterModal(true);
    };

    const handleUpdateChapter = async (e) => {
        e.preventDefault();
        try {
            await updateChapter(editingChapter._id, { title: editingChapter.title });
            setShowEditChapterModal(false);
            setEditingChapter(null);
            loadCourseData();
        } catch (err) { alert(err.message); }
    };

    const handleEditUnit = (unit) => {
        setEditingUnit({
            ...unit,
            contentValue: unit.content?.videoUrl || unit.content?.pdfUrl || unit.content?.text || ''
        });
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
            loadCourseData();
        } catch (err) { alert(err.message); }
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
        } catch (err) { alert(err.message); }
    };

    const handleEditQuiz = async (unit) => {
        try {
            const response = await fetch(`http://localhost:5000/api/quizzes/${unit.content.quiz}`);
            const quizData = await response.json();

            setEditingQuiz({ ...quizData, unitId: unit._id });
            setQuizData({
                title: quizData.title,
                questions: quizData.questions
            });
            setShowQuizModal(true);
        } catch (err) {
            alert('Failed to load quiz: ' + err.message);
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
        } catch (err) { alert(err.message); }
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

    if (loading) return <div className="read-the-docs">Loading Editor...</div>;
    if (!course) return <div className="read-the-docs">Course not found.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'transparent', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <header className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                <h1 className="gradient-text">{course.title}</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{course.description}</p>
            </header>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Curriculum (Chapters & Units)</h2>
                    <form onSubmit={handleAddChapter} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            placeholder="New Chapter Title"
                            style={{ padding: '8px', fontSize: '0.9rem' }}
                            value={newChapterTitle}
                            onChange={e => setNewChapterTitle(e.target.value)}
                            required
                        />
                        <button className="btn-accent" style={{ padding: '8px 16px' }}><Plus size={16} /> Add</button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {course.chapters?.map((chapter, idx) => (
                        <div key={chapter._id} className="card" style={{ padding: '0' }}>
                            <div
                                onClick={() => toggleChapter(chapter._id)}
                                style={{
                                    padding: '1.5rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#1a1a1a',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ color: 'gray', fontWeight: 'bold' }}>{idx + 1}</span>
                                    <h3 style={{ fontSize: '1.1rem' }}>{chapter.title}</h3>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditChapter(chapter); }}
                                        style={{ background: 'transparent', color: 'var(--primary)', padding: '4px' }}
                                        title="Edit chapter"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter._id); }}
                                        style={{ background: 'transparent', color: '#ff4d4d', padding: '4px' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    {expandedChapters[chapter._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                            </div>

                            {expandedChapters[chapter._id] && (
                                <div style={{ padding: '1.5rem', borderTop: '1px solid #333' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                        {chapter.units?.map(unit => (
                                            <div key={unit._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', background: '#252525', borderRadius: '6px' }}>
                                                {unit.type === 'video' ? <VideoIcon size={16} color="var(--primary)" /> :
                                                    unit.type === 'pdf' ? <FileText size={16} color="var(--secondary)" /> :
                                                        <HelpCircle size={16} color="var(--accent)" />}
                                                <span style={{ flex: 1 }}>{unit.title}</span>
                                                <span className="tag" style={{ color: unit.type === 'quiz' ? 'var(--accent)' : 'gray' }}>{unit.type}</span>
                                                {unit.type === 'quiz' && (
                                                    <button
                                                        onClick={() => handleEditQuiz(unit)}
                                                        style={{ background: 'transparent', color: 'var(--primary)', padding: '4px' }}
                                                        title="Edit quiz"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                )}
                                                {unit.type !== 'quiz' && (
                                                    <button
                                                        onClick={() => handleEditUnit(unit)}
                                                        style={{ background: 'transparent', color: 'var(--primary)', padding: '4px' }}
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

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <button onClick={() => openUnitModal(chapter._id, 'video')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><VideoIcon size={14} /> +Video</button>
                                        <button onClick={() => openUnitModal(chapter._id, 'pdf')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><FileText size={14} /> +PDF</button>
                                        <button onClick={() => openUnitModal(chapter._id, 'text')} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><Save size={14} /> +Text</button>
                                        <button onClick={() => openUnitModal(chapter._id, 'quiz')} className="btn-accent" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><HelpCircle size={14} /> +Quiz</button>
                                    </div>
                                </div>
                            )}
                        </div>
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
                            <button onClick={() => setShowUnitModal(false)} style={{ background: 'transparent', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUnitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unit Title</label>
                                <input
                                    placeholder="Enter unit title"
                                    value={unitForm.title}
                                    onChange={e => setUnitForm({ ...unitForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {unitType === 'video' ? 'YouTube/Video URL' : unitType === 'pdf' ? 'PDF URL' : 'Content Text'}
                                </label>
                                {unitType === 'text' ? (
                                    <textarea
                                        placeholder="Enter content here..."
                                        style={{ background: '#18181b', color: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '120px', outline: 'none' }}
                                        value={unitForm.contentValue}
                                        onChange={e => setUnitForm({ ...unitForm, contentValue: e.target.value })}
                                        required
                                    />
                                ) : (
                                    <input
                                        placeholder={`Enter ${unitType} link`}
                                        value={unitForm.contentValue}
                                        onChange={e => setUnitForm({ ...unitForm, contentValue: e.target.value })}
                                        required
                                    />
                                )}
                            </div>
                            <button className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                                Add Unit
                            </button>
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
                            <button onClick={() => { setShowQuizModal(false); setEditingQuiz(null); setQuizData({ title: '', questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }] }); }} style={{ background: 'none' }}><X color="white" /></button>
                        </div>

                        <form onSubmit={editingQuiz ? handleUpdateQuiz : handleQuizSubmit}>
                            <input
                                placeholder="Quiz Title"
                                style={{ width: '100%', marginBottom: '1.5rem' }}
                                value={quizData.title}
                                onChange={e => setQuizData({ ...quizData, title: e.target.value })}
                                required
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                                {quizData.questions.map((q, qIdx) => (
                                    <div key={qIdx} style={{ padding: '1rem', background: '#1c1c1c', borderRadius: '12px', border: '1px solid #333' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4 style={{ color: 'var(--primary)', margin: 0 }}>Question {qIdx + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => deleteQuestion(qIdx)}
                                                style={{ background: 'transparent', color: '#ff4d4d', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                title="Delete Question"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <input
                                            placeholder="Question Text"
                                            style={{ width: '100%', marginBottom: '1rem' }}
                                            value={q.questionText}
                                            onChange={e => updateQuestion(qIdx, 'questionText', e.target.value)}
                                            required
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
                                                    <input
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

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={addQuestion} className="btn-secondary" style={{ flex: 1 }}>+ Add Question</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{editingQuiz ? 'Update Quiz' : 'Save Quiz'}</button>
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
                            <button onClick={() => setShowEditChapterModal(false)} style={{ background: 'transparent', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateChapter} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Chapter Title</label>
                                <input
                                    placeholder="Enter chapter title"
                                    value={editingChapter.title}
                                    onChange={e => setEditingChapter({ ...editingChapter, title: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                                Update Chapter
                            </button>
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
                            <button onClick={() => setShowEditUnitModal(false)} style={{ background: 'transparent', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUnit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unit Title</label>
                                <input
                                    placeholder="Enter unit title"
                                    value={editingUnit.title}
                                    onChange={e => setEditingUnit({ ...editingUnit, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {editingUnit.type === 'video' ? 'YouTube/Video URL' : editingUnit.type === 'pdf' ? 'PDF URL' : 'Content Text'}
                                </label>
                                {editingUnit.type === 'text' ? (
                                    <textarea
                                        placeholder="Enter content here..."
                                        style={{ background: '#18181b', color: 'white', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', minHeight: '120px', outline: 'none' }}
                                        value={editingUnit.contentValue}
                                        onChange={e => setEditingUnit({ ...editingUnit, contentValue: e.target.value })}
                                        required
                                    />
                                ) : (
                                    <input
                                        placeholder={`Enter ${editingUnit.type} link`}
                                        value={editingUnit.contentValue}
                                        onChange={e => setEditingUnit({ ...editingUnit, contentValue: e.target.value })}
                                        required
                                    />
                                )}
                            </div>
                            <button className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                                Update Unit
                            </button>
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
                            <button onClick={() => setShowProgressModal(false)} style={{ background: 'transparent', color: 'white' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {studentProgress.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No students enrolled yet.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #333' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--primary)' }}>Student</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--primary)' }}>Progress</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--primary)' }}>Units</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--primary)' }}>Quiz Avg</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--primary)' }}>Last Active</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentProgress.map((student, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #222' }}>
                                                <td style={{ padding: '1rem' }}>{student.studentName}</td>
                                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ flex: 1, height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${student.completionPercentage}%`, height: '100%', background: 'var(--primary)' }} />
                                                        </div>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '40px' }}>{student.completionPercentage}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                                    {student.completedUnits}/{student.totalUnits}
                                                </td>
                                                <td style={{ padding: '1rem', textAlign: 'center', color: student.quizAverage > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
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
    );
};

export default CourseEditor;
