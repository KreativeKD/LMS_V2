import React, { useEffect } from 'react';
import { Cookie, FileText, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PublicFooter from '../components/PublicFooter';

const policySections = [
    {
        id: 'privacy',
        title: 'Privacy Policy',
        icon: LockKeyhole,
        updated: 'Last updated: June 5, 2026',
        intro: 'CourseZ is an education and learning management platform created by Dr. Kiran TALELE. This Privacy Policy explains what data we collect, why we collect it, how it is used, and how students can request help, correction, or deletion.',
        groups: [
            {
                heading: 'Information We Collect',
                items: [
                    'Account information such as full name, email address, phone number, password, role, profile details, and country or location information provided during registration or profile updates.',
                    'Enrollment information such as selected courses, approval status, course progress, quiz attempts, submissions, certificates, attendance-related records, and learning activity.',
                    'Communication information such as messages, support requests, feedback, contact form details, and emails sent to CourseZ.',
                    'Technical information such as device type, browser, operating system, IP address, app or website usage logs, crash information, and authentication/session data needed to operate and secure the service.',
                    'Payment or scholarship-related references may be recorded if a course, access approval, receipt, scholarship, or funding process requires verification. CourseZ does not intentionally store full card or banking details unless a separate authorized payment provider is used.',
                ],
            },
            {
                heading: 'How We Use Information',
                items: [
                    'To create and manage student, instructor, and administrator accounts.',
                    'To approve enrollments, provide course access, track learning progress, show dashboards, conduct quizzes, and issue academic or course-related records.',
                    'To send course updates, administrative notices, support replies, security alerts, and important platform communication.',
                    'To improve CourseZ content, reliability, security, performance, and user experience.',
                    'To prevent fraud, unauthorized access, misuse, duplicate accounts, and violations of platform rules.',
                ],
            },
            {
                heading: 'Data Sharing and Disclosure',
                items: [
                    'We do not sell personal data.',
                    'Student information may be visible to authorized CourseZ administrators and instructors only where needed for course delivery, enrollment approval, academic support, or platform administration.',
                    'We may use trusted service providers for hosting, email, analytics, storage, authentication, payments, or technical support. These providers are expected to handle information only for the requested service.',
                    'We may disclose information when required by law, legal process, government request, safety concern, or to protect CourseZ, students, instructors, and the public.',
                    'External links, including YouTube, scholarship portals, or third-party websites, are governed by their own privacy policies.',
                ],
            },
            {
                heading: 'Security, Retention, and Deletion',
                items: [
                    'We use reasonable technical and organizational safeguards such as restricted access, authentication controls, and secure hosting practices to protect user information.',
                    'Personal data is retained only as long as needed for account operation, course records, support, legal compliance, dispute resolution, and legitimate academic or administrative purposes.',
                    'Students may request access, correction, account deletion, or deletion of eligible personal data by emailing talelesir@gmail.com from their registered email address.',
                    'Some information may be retained where required for legal, security, payment, certification, academic record, or fraud-prevention reasons.',
                    'After a deletion request is verified, CourseZ will take reasonable steps to delete or anonymize eligible personal information within a reasonable period.',
                ],
            },
            {
                heading: 'Children and Student Privacy',
                items: [
                    'CourseZ is intended for students and learners who can lawfully use an online education platform in their region.',
                    'If a learner is below the age required to provide independent consent, a parent, guardian, school, or authorized adult should provide consent and supervision.',
                    'If we learn that a child has provided personal information without proper consent where consent is required, we will take reasonable steps to remove that information.',
                ],
            },
            {
                heading: 'Contact for Privacy Requests',
                items: [
                    'Privacy contact: talelesir@gmail.com.',
                    'Phone: +91 99870 30881.',
                    'Website: www.talelesir.com.',
                    'Please include your registered email address and the exact request, such as data access, correction, account deletion, or privacy question.',
                ],
            },
        ],
    },
    {
        id: 'terms',
        title: 'Terms of Service',
        icon: FileText,
        updated: 'Effective date: June 5, 2026',
        intro: 'These Terms of Service govern access to CourseZ through the website, app, dashboards, learning materials, course pages, communication tools, and related services.',
        groups: [
            {
                heading: 'Account and Access Rules',
                items: [
                    'Users must provide accurate registration details and keep account information updated.',
                    'Login credentials are personal and must not be shared with another person.',
                    'Course access may require approval from CourseZ administrators or instructors.',
                    'CourseZ may reject, suspend, or remove access if information is false, access is misused, payment or approval requirements are not met, or platform rules are violated.',
                ],
            },
            {
                heading: 'Learning Content and Intellectual Property',
                items: [
                    'Course videos, notes, quizzes, assignments, downloads, images, branding, layout, and platform content belong to CourseZ, Dr. Kiran TALELE, instructors, or their respective owners.',
                    'Students may use course content for personal learning only unless written permission is given.',
                    'Users must not copy, record, sell, upload, redistribute, publicly display, or share paid or protected course content without authorization.',
                    'CourseZ logos, names, and branding may not be used in a misleading or unauthorized way.',
                ],
            },
            {
                heading: 'User Conduct',
                items: [
                    'Users must not upload harmful files, attempt unauthorized access, interfere with platform security, abuse support channels, impersonate others, or misuse another user account.',
                    'Users must not post illegal, abusive, hateful, misleading, spam, or infringing content.',
                    'Students are responsible for completing courses, quizzes, and submissions honestly.',
                    'CourseZ may remove content or restrict accounts that violate these terms.',
                ],
            },
            {
                heading: 'Courses, Availability, and Changes',
                items: [
                    'Course schedules, instructors, lessons, fees, scholarships, features, and platform availability may change over time.',
                    'CourseZ may update, pause, replace, or remove features or content for academic, technical, legal, or operational reasons.',
                    'We try to keep the platform reliable, but we do not guarantee uninterrupted or error-free access.',
                ],
            },
            {
                heading: 'Payments, Refunds, and Scholarships',
                items: [
                    'Any payment, refund, scholarship, discount, or funding process is subject to the rules communicated for that course or program.',
                    'External payment providers, scholarship portals, or government funding websites may have their own terms and policies.',
                    'CourseZ may require proof, verification, or approval before granting course access, scholarship support, or certificates.',
                ],
            },
            {
                heading: 'Liability and Disclaimers',
                items: [
                    'CourseZ provides educational content and platform tools for learning support. It does not guarantee specific exam results, admissions, employment, salary, or professional outcome.',
                    'Users are responsible for how they apply the learning material and for complying with their local academic, professional, and legal requirements.',
                    'To the maximum extent permitted by law, CourseZ is not liable for indirect, incidental, or consequential losses arising from platform use.',
                ],
            },
        ],
    },
    {
        id: 'cookies',
        title: 'Cookie Policy',
        icon: Cookie,
        updated: 'Last updated: June 5, 2026',
        intro: 'CourseZ uses cookies, local storage, and similar technologies to operate login, security, preferences, performance, and learning features.',
        groups: [
            {
                heading: 'Types of Cookies and Storage We Use',
                items: [
                    'Essential cookies or local storage for login sessions, authentication tokens, account security, course access, and dashboard operation.',
                    'Preference storage for user settings, interface choices, and smoother navigation.',
                    'Performance and analytics data to understand errors, page usage, app reliability, and feature performance.',
                    'Security-related storage to detect suspicious activity, protect accounts, and prevent unauthorized access.',
                ],
            },
            {
                heading: 'Third-Party Cookies',
                items: [
                    'Embedded or linked services such as YouTube, scholarship portals, payment providers, analytics tools, or external websites may use their own cookies.',
                    'CourseZ does not control third-party cookies used outside the CourseZ platform.',
                    'Users should review the privacy and cookie policies of any external service they open from CourseZ.',
                ],
            },
            {
                heading: 'Managing Cookies',
                items: [
                    'Users can control or block cookies from browser or device settings.',
                    'Blocking essential cookies, local storage, or authentication storage may prevent login, course access, dashboard loading, quiz progress, or security features from working correctly.',
                    'Continuing to use CourseZ means you accept the use of necessary cookies and similar technologies required for platform operation.',
                ],
            },
        ],
    },
];

const PoliciesPage = () => {
    const location = useLocation();

    useEffect(() => {
        const targetId = location.hash.replace('#', '');

        if (!targetId) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const timer = window.setTimeout(() => {
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);

        return () => window.clearTimeout(timer);
    }, [location.hash]);

    return (
        <div className="landing-page">
            <section className="policies-hero">
                <div className="policies-container">
                    <div className="section-badge">
                        <ShieldCheck size={16} />
                        <span>CourseZ Policies</span>
                    </div>
                    <h1 className="policies-title">Privacy, Terms, and Cookies</h1>
                    <p className="policies-subtitle">
                        Clear platform rules, app data practices, user rights, and contact details for students, instructors, visitors, and app store review.
                    </p>

                    <div className="policies-jump-links" aria-label="Policy sections">
                        {policySections.map(({ id, title, icon: Icon }) => (
                            <Link key={id} to={`/policies#${id}`} className="policies-jump-link">
                                <Icon size={18} />
                                <span>{title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="policies-section">
                <div className="policies-container policies-content">
                    {policySections.map(({ id, title, icon: Icon, updated, intro, groups }) => (
                        <article key={id} id={id} className="policy-panel">
                            <div className="policy-panel-header">
                                <div className="policy-icon">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h2>{title}</h2>
                                    <p>{updated}</p>
                                </div>
                            </div>
                            <p className="policy-intro">{intro}</p>
                            <div className="policy-groups">
                                {groups.map(({ heading, items }) => (
                                    <section key={heading} className="policy-group">
                                        <h3>{heading}</h3>
                                        <ul className="policy-list">
                                            {items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        </article>
                    ))}

                    <div className="policy-contact">
                        <Mail size={22} />
                        <div>
                            <h3>Questions about these policies?</h3>
                            <p>
                                Contact CourseZ at <a href="mailto:talelesir@gmail.com">talelesir@gmail.com</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default PoliciesPage;
