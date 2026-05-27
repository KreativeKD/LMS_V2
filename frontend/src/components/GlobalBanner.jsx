import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchSettings, API_BASE } from "../api/api";

const PAGE_TITLES = {
  "/": "Welcome to CourseZ",
  "/login": "Login",
  "/forgot-password": "Reset Password",
  "/request-access": "Request Access",
  "/complete-setup": "Complete Setup",
  "/student-registration": "Student Registration",
  "/admin": "Admin Dashboard",
  "/teacher": "Instructor Studio",
  "/student": "Student Dashboard",
  "/my-courses": "My Courses",
  "/courses": "Courses",
  "/professor": "Faculty",
  "/scholarship": "Scholarships",
  "/contact": "Contact",
};

const GlobalBanner = () => {
  const location = useLocation();
  const basePath = location.pathname;
  const dynamicTitle =
    PAGE_TITLES[basePath] ||
    (basePath.startsWith("/course/read/") ? "Course View" : null) ||
    (basePath.startsWith("/course/edit/") ? "Course Editor" : null) ||
    (basePath.startsWith("/quiz/") ? "Quiz" : null) ||
    "CourseZ";

  const renderTitle = (title) => {
    if (!title) return null;
    // Replace occurrences of 'CourseZ' with styled spans matching the logo colors
    const parts = title.split(/(CourseZ)/g);
    return parts.map((part, idx) => {
      if (part === "CourseZ") {
        return (
          <span key={idx} aria-hidden="true">
            <span className="brand-course">Course</span>
            <span className="brand-z">Z</span>
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSettings();
        if (mounted && Array.isArray(data.bannerImages)) {
          // Resolve backend-hosted paths to absolute URLs so images load correctly
          const resolved = data.bannerImages.map((p) => {
            if (!p) return p;
            if (p.startsWith('http://') || p.startsWith('https://')) return p;
            // support both /uploads/... and uploads/...
            const normalized = p.startsWith('/') ? p : `/${p}`;
            return `${API_BASE}${normalized}`;
          });
          setBanners(resolved);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!banners || banners.length <= 1) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  const bgStyle = banners && banners.length ? { backgroundImage: `url(${banners[index]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <section className="global-page-banner" aria-label="Page banner" style={bgStyle}>
      <div className="global-page-banner__overlay" />
      <div className="global-page-banner__content">
        <h2>{renderTitle(dynamicTitle)}</h2>
      </div>
    </section>
  );
};

export default GlobalBanner;
