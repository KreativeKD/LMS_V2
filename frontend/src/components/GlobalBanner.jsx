import React from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
    '/': 'Welcome to CourseZ',
    '/login': 'Login',
    '/forgot-password': 'Reset Password',
    '/request-access': 'Request Access',
    '/complete-setup': 'Complete Setup',
    '/student-registration': 'Student Registration',
    '/admin': 'Admin Dashboard',
    '/teacher': 'Teacher Studio',
    '/student': 'Student Dashboard',
    '/my-courses': 'My Courses',
    '/courses': 'Courses',
    '/professor': 'Faculty',
    '/scholarship': 'Scholarships',
    '/contact': 'Contact'
};

const GlobalBanner = () => {
    const location = useLocation();
    const basePath = location.pathname;
    const dynamicTitle =
        PAGE_TITLES[basePath] ||
        (basePath.startsWith('/course/read/') ? 'Course View' : null) ||
        (basePath.startsWith('/course/edit/') ? 'Course Editor' : null) ||
        (basePath.startsWith('/quiz/') ? 'Quiz' : null) ||
        'CourseZ';

    return (
        <section className="global-page-banner" aria-label="Page banner">
            <div className="global-page-banner__overlay" />
            <div className="global-page-banner__content">
                <h2>{dynamicTitle}</h2>
            </div>
        </section>
    );
};

export default GlobalBanner;
