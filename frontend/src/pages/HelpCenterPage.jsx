import React, { useEffect } from 'react';
import {
    BookOpen,
    CheckCircle2,
    HelpCircle,
    LifeBuoy,
    Mail,
    ShieldCheck,
    Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';

const deletionSteps = [
    'Log in to your CourseZ account.',
    'Open your Profile page from the account menu or dashboard.',
    'Go to the account deletion area and select Delete Account.',
    'Read the confirmation message carefully, then confirm the deletion request.',
    'After confirmation, your account and eligible personal data will be deleted or anonymized within a reasonable period.',
];

const retainedData = [
    'Course certificates, payment references, academic records, fraud-prevention logs, or legal compliance records may be retained where required.',
    'Messages or records already needed for support, dispute resolution, security, or audit purposes may be retained for a limited period.',
    'Deleted accounts may lose access to courses, quizzes, certificates, dashboards, and learning history.',
];

const faqs = [
    {
        question: 'How do I register as a student?',
        answer: 'Use the Login / Signup button, complete the student registration form, and wait for CourseZ approval if approval is required for your course.',
    },
    {
        question: 'Why can I not access a course after registration?',
        answer: 'Course access may depend on enrollment approval, payment verification, instructor approval, or admin activation. Contact support with your registered email address.',
    },
    {
        question: 'Can I change my profile details?',
        answer: 'Yes. Log in and update available profile fields from your account area. For fields you cannot edit, contact support.',
    },
    {
        question: 'How do I delete my account?',
        answer: 'Log in to CourseZ, open your Profile page, and use the Delete Account option. If you cannot log in, contact support from your registered email address.',
    },
    {
        question: 'How do I reset my password?',
        answer: 'Use the Forgot Password option on the login page and follow the instructions sent to your registered email address.',
    },
    {
        question: 'Can I download or share course content?',
        answer: 'Course content is for personal learning only unless CourseZ gives written permission. Do not copy, resell, upload, or redistribute protected content.',
    },
    {
        question: 'How do I report a technical issue?',
        answer: 'Email talelesir@gmail.com with your registered email, device/browser, page name, screenshot if possible, and a short description of what happened.',
    },
];

const supportTopics = [
    {
        title: 'Account Help',
        description: 'Registration, login, password reset, profile updates, and account deletion requests.',
        icon: LifeBuoy,
    },
    {
        title: 'Course Access',
        description: 'Enrollment approval, missing courses, quiz access, course progress, and certificates.',
        icon: BookOpen,
    },
    {
        title: 'Privacy and Safety',
        description: 'Data requests, correction, deletion, cookies, and privacy policy questions.',
        icon: ShieldCheck,
    },
];

const HelpCenterPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="landing-page">
            <section className="help-hero">
                <div className="help-container">
                    <div className="section-badge">
                        <HelpCircle size={16} />
                        <span>Help Center</span>
                    </div>
                    <h1 className="help-title">CourseZ Help Center</h1>
                    <p className="help-subtitle">
                        Find account deletion steps, common answers, support contacts, and privacy resources for CourseZ.
                    </p>
                </div>
            </section>

            <section className="help-section">
                <div className="help-container help-content">
                    <article className="help-panel help-panel-featured">
                        <div className="help-panel-header">
                            <div className="help-icon help-icon-danger">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h2>How to Delete Your Account</h2>
                                <p>Follow these steps to delete your CourseZ account and eligible personal data directly from your profile.</p>
                            </div>
                        </div>

                        <ol className="help-steps">
                            {deletionSteps.map((step) => (
                                <li key={step}>{step}</li>
                            ))}
                        </ol>

                        <div className="help-note">
                            <CheckCircle2 size={20} />
                            <p>
                                If you cannot access your account, email <a href="mailto:talelesir@gmail.com">talelesir@gmail.com</a> from your registered email address for help. For privacy details, see the <Link to="/policies#privacy">Privacy Policy</Link>.
                            </p>
                        </div>
                    </article>

                    <article className="help-panel">
                        <div className="help-panel-header">
                            <div className="help-icon">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h2>What May Be Retained</h2>
                                <p>Some records may need to remain after account deletion for valid reasons.</p>
                            </div>
                        </div>
                        <ul className="help-list">
                            {retainedData.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    <section className="help-grid">
                        {supportTopics.map(({ title, description, icon: Icon }) => (
                            <article key={title} className="help-topic">
                                <div className="help-icon">
                                    <Icon size={22} />
                                </div>
                                <h3>{title}</h3>
                                <p>{description}</p>
                            </article>
                        ))}
                    </section>

                    <article className="help-panel">
                        <div className="help-panel-header">
                            <div className="help-icon">
                                <HelpCircle size={24} />
                            </div>
                            <div>
                                <h2>Frequently Asked Questions</h2>
                                <p>Quick answers for common CourseZ questions.</p>
                            </div>
                        </div>

                        <div className="help-faq-list">
                            {faqs.map(({ question, answer }) => (
                                <div key={question} className="help-faq-item">
                                    <h3>{question}</h3>
                                    <p>{answer}</p>
                                </div>
                            ))}
                        </div>
                    </article>

                    <div className="help-contact">
                        <Mail size={22} />
                        <div>
                            <h3>Need more help?</h3>
                            <p>
                                Email <a href="mailto:talelesir@gmail.com">talelesir@gmail.com</a> or call <a href="tel:+919987030881">+91 99870 30881</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default HelpCenterPage;
