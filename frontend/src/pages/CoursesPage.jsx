import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart2, Zap, Sparkles, Clock, Users, Award, ArrowRight } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const CoursesPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const coursesData = [
        {
            id: 'dsp',
            title: 'Digital Signal Processing (DSP)',
            description: 'Master the fundamentals of processing discrete-time signals and systems. This course covers everything from basic signal theory to advanced filter design and implementation.',
            professor: 'Dr. Kiran TALELE',
            duration: '12 weeks',
            level: 'Intermediate',
            students: '150+',
            icon: BarChart2,
            chapters: 7
        },
        {
            id: 'dip',
            title: 'Digital Image Processing (DIP)',
            description: 'Dive into the world of digital image processing. Learn how to manipulate, enhance, and extract information from digital images using state-of-the-art algorithms.',
            professor: 'Dr. Kiran TALELE',
            duration: '10 weeks',
            level: 'Intermediate',
            students: '120+',
            icon: Sparkles,
            chapters: 7
        },
        {
            id: 'ai-ml',
            title: 'Artificial Intelligence and Machine Learning',
            description: 'Comprehensive course covering AI fundamentals, machine learning algorithms, and practical applications in various domains.',
            professor: 'Dr. Sarah Johnson',
            duration: '16 weeks',
            level: 'Advanced',
            students: '200+',
            icon: Zap,
            chapters: 7
        },
        {
            id: 'nlp',
            title: 'Natural Language Processing',
            description: 'Learn to process and understand human language using computational methods and deep learning techniques.',
            professor: 'Dr. Sarah Johnson',
            duration: '14 weeks',
            level: 'Advanced',
            students: '180+',
            icon: BookOpen,
            chapters: 7
        },
        {
            id: 'embedded',
            title: 'Embedded Systems Design',
            description: 'Design and implement embedded systems for real-world applications, covering hardware-software integration and optimization.',
            professor: 'Dr. Michael Chen',
            duration: '12 weeks',
            level: 'Intermediate',
            students: '100+',
            icon: Zap,
            chapters: 7
        },
        {
            id: 'iot',
            title: 'Internet of Things (IoT)',
            description: 'Explore the world of connected devices and IoT ecosystems, learning to build scalable and secure IoT solutions.',
            professor: 'Dr. Michael Chen',
            duration: '10 weeks',
            level: 'Intermediate',
            students: '90+',
            icon: Sparkles,
            chapters: 7
        }
    ];

    return (
        <div className="landing-page">
            <PublicNavbar scrolled={scrolled} />

            {/* Courses Section */}
            <section style={{ padding: '8rem 4rem 4rem' }}>
                <div className="section-header">
                    <h2 className="section-title">Academic Courses</h2>
                    <p className="section-subtitle">Choose your learning path and start building expertise</p>
                </div>

                <div className="courses-page-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', maxWidth: '1400px', margin: '0 auto' }}>
                    {coursesData.map((course, index) => {
                        const IconComponent = course.icon;
                        const colors = ['sticky-yellow', 'sticky-cyan', 'sticky-pink', 'sticky-lime'];
                        const rotations = ['rotate-1', 'rotate-2', 'rotate-3'];
                        const colorClass = colors[index % colors.length];
                        const rotationClass = rotations[index % rotations.length];

                        return (
                            <div key={course.id} className={`course-sticky-note ${colorClass} ${rotationClass}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <IconComponent size={32} className="sticky-icon" style={{ margin: 0 }} />
                                    <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: '700' }}>{course.title}</h3>
                                </div>
                                <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1 }}>{course.description}</p>

                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    marginBottom: '1.5rem',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <p style={{ margin: '0.2rem 0' }}><strong>Professor:</strong> {course.professor}</p>
                                    <p style={{ margin: '0.2rem 0' }}><strong>Duration:</strong> {course.duration}</p>
                                    <p style={{ margin: '0.2rem 0' }}><strong>Level:</strong> {course.level}</p>
                                </div>

                                <button
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        marginTop: 'auto'
                                    }}
                                    onClick={() => navigate('/login')}
                                >
                                    <span>Enroll Now</span>
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default CoursesPage;
