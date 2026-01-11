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
                    <h2 className="section-title">Available Courses</h2>
                    <p className="section-subtitle">Choose your learning path and start building expertise</p>
                </div>

                <div className="courses-page-grid">
                    {coursesData.map(course => {
                        const IconComponent = course.icon;
                        return (
                            <div key={course.id} className="feature-card">
                                <div className="feature-icon-wrapper">
                                    <IconComponent size={32} />
                                </div>
                                <h3>{course.title}</h3>
                                <p>{course.description}</p>
                                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <p><strong>Professor:</strong> {course.professor}</p>
                                    <p><strong>Duration:</strong> {course.duration}</p>
                                    <p><strong>Level:</strong> {course.level}</p>
                                    <p><strong>Students:</strong> {course.students}</p>
                                    <p><strong>Chapters:</strong> {course.chapters}</p>
                                </div>
                                <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => navigate('/login')}>
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
