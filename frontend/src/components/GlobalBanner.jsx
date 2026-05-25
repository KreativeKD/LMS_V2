import React from "react";
import { useLocation } from "react-router-dom";

const routeHeadings = {
  "/": "Learn. Build. Grow.",
  "/professor": "Meet Your Instructor",
  "/courses": "Explore Our Courses",
  "/scholarship": "Unlock Scholarship Support",
  "/contact": "We Are Here To Help",
  "/admin": "Admin Dashboard",
  "/teacher": "Teaching Workspace",
  "/student": "Student Dashboard",
  "/my-courses": "My Learning Journey",
};

const resolveHeading = (pathname) => {
  if (routeHeadings[pathname]) {
    return routeHeadings[pathname];
  }

  if (pathname.startsWith("/course/edit/")) {
    return "Course Editor";
  }

  if (pathname.startsWith("/course/read/")) {
    return "Course Overview";
  }

  if (pathname.startsWith("/quiz/")) {
    return "Quiz Session";
  }

  return "CourseZ Learning Portal";
};

const GlobalBanner = () => {
  const { pathname } = useLocation();

  return (
    <section className="global-page-banner" aria-label="Page header banner">
      <div className="global-page-banner__overlay" aria-hidden="true" />
      <div className="global-page-banner__content">
        <h2>{resolveHeading(pathname)}</h2>
      </div>
    </section>
  );
};

export default GlobalBanner;
