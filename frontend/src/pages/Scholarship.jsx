import React, { useState, useEffect } from 'react';
import { ExternalLink, GraduationCap, Coins, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const Scholarship = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scholarshipLink = "https://www.anudaanjagruti.com/#/pages/myschemes";

    return (
        <div className="landing-page">
            <PublicNavbar scrolled={scrolled} />

            <section className="scholarship-hero" style={{ paddingTop: '10rem', paddingBottom: '6rem' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div className="scholarship-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'center' }}>
                        <div className="hero-text animate-slide-left">
                            <div className="section-badge">
                                <Sparkles size={16} />
                                <span>Empowering Your Future</span>
                            </div>
                            <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                                Funding & Scholarships
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                                We believe financial constraints should never stand in the way of excellence.
                                Discover various funding opportunities and government schemes curated to
                                support your academic journey.
                            </p>
                            <a
                                href={scholarshipLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary btn-large"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
                            >
                                <span>Access Scholarship Portal</span>
                                <ExternalLink size={20} />
                            </a>
                        </div>
                        <div className="hero-image animate-fade-in" style={{ position: 'relative' }}>
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(157, 80, 187, 0.2))',
                                borderRadius: '30px',
                                padding: '1rem',
                                border: '1px solid var(--border)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <img
                                    src="/scholarship_hero.png"
                                    alt="Scholarship Hero"
                                    style={{ width: '100%', borderRadius: '20px', display: 'block', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features-section" style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.2)' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div className="section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
                        <h2 className="section-title">Why Apply for Scholarships?</h2>
                        <p className="section-subtitle">Investing in your education is the single best decision for your career growth.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="stat-card" style={{ padding: '2.5rem' }}>
                            <GraduationCap size={40} className="stat-icon" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }} />
                            <h3>Financial Independence</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Focus entirely on your studies without the burden of financial stress.</p>
                        </div>
                        <div className="stat-card" style={{ padding: '2.5rem' }}>
                            <Coins size={40} className="stat-icon" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }} />
                            <h3>Full Coverage</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Opportunities covering tuition fees, books, and living expenses.</p>
                        </div>
                        <div className="stat-card" style={{ padding: '2.5rem' }}>
                            <ShieldCheck size={40} className="stat-icon" style={{ marginBottom: '1.5rem', color: 'var(--primary)' }} />
                            <h3>Verified Schemes</h3>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Access only verified and trusted government and private funding schemes.</p>
                        </div>
                    </div>
                </div>
            </section>


            <PublicFooter />
        </div>
    );
};

export default Scholarship;
