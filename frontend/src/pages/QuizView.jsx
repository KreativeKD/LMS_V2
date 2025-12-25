import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizzes, fetchCourses } from '../api/api';
import { CheckCircle, XCircle, ArrowLeft, Loader } from 'lucide-react';

const QuizView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    useEffect(() => {
        loadQuiz();
    }, [id]);

    const loadQuiz = async () => {
        try {
            const data = await fetchQuizzes();
            const found = data.find(q => q._id === id);
            setQuiz(found);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let score = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                score++;
            }
        });
        setResult({
            score,
            total: quiz.questions.length,
            percentage: (score / quiz.questions.length) * 100
        });
    };

    if (loading) return <div className="modal-overlay"><Loader className="animate-spin" /></div>;
    if (!quiz) return <div className="read-the-docs">Quiz not found.</div>;

    if (result) {
        return (
            <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="card animate-fade-in text-center">
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{result.percentage.toFixed(0)}%</h1>
                <h2 style={{ marginBottom: '2rem' }}>You scored {result.score} out of {result.total}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {quiz.questions.map((q, idx) => (
                        <div key={idx} style={{ padding: '1rem', background: '#252525', borderRadius: '8px', textAlign: 'left', border: answers[idx] === q.correctAnswer ? '1px solid var(--accent)' : '1px solid #ff4d4d' }}>
                            <p style={{ fontWeight: 'bold' }}>{q.questionText}</p>
                            <p style={{ fontSize: '0.9rem', color: answers[idx] === q.correctAnswer ? 'var(--accent)' : '#ff4d4d' }}>
                                Your answer: {q.options[answers[idx]] || 'None'}
                            </p>
                            {answers[idx] !== q.correctAnswer && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>
                                    Correct answer: {q.options[q.correctAnswer]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <button className="btn-primary" onClick={() => navigate(-1)}>Back to Course</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ background: 'transparent', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
            >
                <ArrowLeft size={18} /> Exit Quiz
            </button>

            <header className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--accent)' }}>
                <h1 className="gradient-text">{quiz.title}</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Good luck! Answer all questions to see your results.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
                    {quiz.questions.map((q, qIdx) => (
                        <div key={qIdx} className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>{qIdx + 1}. {q.questionText}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {q.options.map((opt, oIdx) => (
                                    <label key={oIdx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem',
                                        background: answers[qIdx] === oIdx ? '#333' : '#252525',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        border: answers[qIdx] === oIdx ? '1px solid var(--primary)' : '1px solid transparent'
                                    }}>
                                        <input
                                            type="radio"
                                            name={`q-${qIdx}`}
                                            checked={answers[qIdx] === oIdx}
                                            onChange={() => setAnswers({ ...answers, [qIdx]: oIdx })}
                                            required
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem' }}>Submit Quiz</button>
            </form>
        </div>
    );
};

export default QuizView;
