import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const CoursesPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page">
            <PublicNavbar scrolled={scrolled} />

            <section style={{
                padding: '12rem 4rem',
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <div className="section-badge" style={{ marginBottom: '2rem' }}>
                    <BookOpen size={16} />
                    <span>Coming Soon</span>
                </div>
                <h1 className="hero-title">Our <span className="gradient-text">Courses</span></h1>
                <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    We are currently cataloging our expert-led courses. Check back soon for the full list of available programs in Digital Signal Processing, Image Processing, and more.
                </p>
                <div className="hero-image-container" style={{ marginTop: '4rem', opacity: 0.5 }}>
                    <BookOpen size={120} className="logo-icon" />
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default CoursesPage;
