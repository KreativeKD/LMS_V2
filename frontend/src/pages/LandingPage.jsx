import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Award,
  BarChart2,
  Shield,
  Users,
  Globe,
  Star,
  Check,
  Target,
  TrendingUp,
  Sparkles,
  Clock,
  Trophy,
  Rocket,
  Heart,
  Zap,
  GraduationCap,
  FileText,
  Phone,
  Megaphone,
  CalendarDays,
  ArrowRight,
  Building,
  MessageCircle,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import PublicFooter from "../components/PublicFooter";
import StatCard from "../components/StatCard";
import {
  fetchPublicAnnouncements,
  fetchPublicTestimonials,
  fetchPublicTicker,
  fetchPublicStats,
  fetchSettings,
  API_BASE,
} from "../api/api";
import { fetchPublicProfessors } from "../api/api";

const FALLBACK_ANNOUNCEMENTS = [
  {
    date: "10-Mar-2026",
    text: "New module description PDFs are now available in course outlines.",
  },
  {
    date: "08-Mar-2026",
    text: "Student self-registration is live. No admin approval required for signup.",
  },
  {
    date: "05-Mar-2026",
    text: "Course access now follows 6-month validity from your enrollment date.",
  },
  {
    date: "01-Mar-2026",
    text: "Drag-and-drop curriculum ordering for chapters and subchapters is enabled.",
  },
];

const FALLBACK_BREAKING_UPDATES = [
  "New batch enrollment opens on 15-Mar-2026",
  "Seminar registrations are now live for April faculty sessions",
  "Course outline now supports module description PDFs",
  "Student self-registration is active with instant account creation",
];

const FALLBACK_TESTIMONIALS = [
  {
    _id: "fallback-1",
    text: "Dr. TALELE's courses are exceptional. The curriculum is industry-aligned, and his teaching style makes complex concepts easy to understand.",
    rating: 5,
    author: "Sanika Chandorkar",
    initials: "SC",
    role: "Student",
    courseTitle: "Digital Signal Processing",
  },
  {
    _id: "fallback-2",
    text: "The best investment in my education. The structure and depth of the modules helped me move from theory to real implementation confidently.",
    rating: 5,
    author: "Rahul Patil",
    initials: "RP",
    role: "Student",
    courseTitle: "Digital Image Processing",
  },
  {
    _id: "fallback-3",
    text: "CourseZ transformed my understanding of signal processing. The lessons bridge theory and practice in a way that actually sticks.",
    rating: 5,
    author: "Priya Mehta",
    initials: "PM",
    role: "Student",
    courseTitle: "Digital Signal Processing",
  },
];

const DEFAULT_SHOWCASE_SLIDES = [
  {
    image: "/generated/img1.png",
    title: "Kickstart Your Engineering Career",
    subtitle: "Industry-ready learning pathways with guided progress.",
  },
  {
    image: "/generated/img2.png",
    title: "Learn from Academic Experts",
    subtitle: "Structured modules designed by experienced faculty.",
  },
  {
    image: "/generated/img3.png",
    title: "Build Skills That Matter",
    subtitle: "From foundations to advanced topics, all in one place.",
  },
  {
    image: "/generated/img4.png",
    title: "Unlock the power of Machine intelligence",
    subtitle:
      "Practical pathways for intelligent systems and real-world innovation.",
  },
  {
    image: "/generated/img5.png",
    title: "Master New Technologies",
    subtitle: "Stay ahead with cutting-edge curriculum.",
  },
  {
    image: "/generated/img6.jpeg",
    title: "Expert Guidance",
    subtitle: "Get mentored by industry professionals.",
  },
  {
    image: "/generated/img7.jpeg",
    title: "Interactive Learning",
    subtitle: "Engage with hands-on projects and assignments.",
  },
  {
    image: "/generated/img8.png",
    title: "Achieve Your Goals",
    subtitle: "Turn your ambitions into reality with CourseZ.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [breakingUpdates, setBreakingUpdates] = useState([]);
  const [publicTestimonials, setPublicTestimonials] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    studentsEnrolled: null,
    coursesPlanned: null,
    expertProfessors: null,
  });

  const [showcaseSlides, setShowcaseSlides] = useState(DEFAULT_SHOWCASE_SLIDES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [announcementData, tickerData, stats, testimonials, professors, settingsData] =
          await Promise.all([
            fetchPublicAnnouncements(),
            fetchPublicTicker(),
            fetchPublicStats(),
            fetchPublicTestimonials(12),
            fetchPublicProfessors(),
            fetchSettings().catch(() => ({})),
          ]);
        setPublicTestimonials(Array.isArray(testimonials) ? testimonials : []);
        // Prefer authoritative count from professors list but fall back to stats endpoint
        const spitProfessorsCount = Array.isArray(professors)
          ? professors.filter((p) =>
              /sardar patel|spit/i.test(String(p.institution || "")),
            ).length
          : null;

        setPlatformStats({
          studentsEnrolled: Number.isFinite(stats?.studentsEnrolled)
            ? stats.studentsEnrolled
            : null,
          coursesPlanned: Number.isFinite(stats?.coursesPlanned)
            ? stats.coursesPlanned
            : null,
          expertProfessors:
            Number.isFinite(spitProfessorsCount) && spitProfessorsCount > 0
              ? spitProfessorsCount
              : Number.isFinite(stats?.expertProfessors)
                ? stats.expertProfessors
                : null,
        });
        setAnnouncements(
          (announcementData || []).map((item) => ({
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "Latest",
            text: item.message,
          })),
        );
        setBreakingUpdates(
          (tickerData || [])
            .map((item) => item.tickerText || item.title || item.message)
            .filter(Boolean),
        );

        if (settingsData && Array.isArray(settingsData.bannerImages) && settingsData.bannerImages.length > 0) {
          const resolvedBanners = settingsData.bannerImages
            .filter(Boolean)
            .map((p) => {
              if (p.startsWith('http://') || p.startsWith('https://')) return p;
              const normalized = p.startsWith('/') ? p : `/${p}`;
              return `${API_BASE}${normalized}`;
            });

          const customSlides = resolvedBanners.map((imgUrl, index) => {
            const fallbackSlide = DEFAULT_SHOWCASE_SLIDES[index % DEFAULT_SHOWCASE_SLIDES.length];
            return {
              image: imgUrl,
              title: fallbackSlide.title,
              subtitle: fallbackSlide.subtitle,
            };
          });

          setShowcaseSlides([...customSlides, ...DEFAULT_SHOWCASE_SLIDES]);
        }
      } catch (err) {
        console.error("Failed to load landing page data", err);
        setAnnouncements(FALLBACK_ANNOUNCEMENTS);
        setBreakingUpdates(FALLBACK_BREAKING_UPDATES);
        setPublicTestimonials([]);
      }
    };
    loadData();

    // Poll stats periodically so the figures update dynamically
    const pollInterval = 30000; // 30s
    let pollId = null;
    const pollStats = async () => {
      try {
        const [stats, professors] = await Promise.all([
          fetchPublicStats(),
          fetchPublicProfessors(),
        ]);

        const spitProfessorsCount = Array.isArray(professors)
          ? professors.filter((p) =>
              /sardar patel|spit/i.test(String(p.institution || "")),
            ).length
          : null;

        setPlatformStats((prev) => ({
          studentsEnrolled: Number.isFinite(stats?.studentsEnrolled)
            ? stats.studentsEnrolled
            : prev.studentsEnrolled,
          coursesPlanned: Number.isFinite(stats?.coursesPlanned)
            ? stats.coursesPlanned
            : prev.coursesPlanned,
          expertProfessors:
            Number.isFinite(spitProfessorsCount) && spitProfessorsCount > 0
              ? spitProfessorsCount
              : Number.isFinite(stats?.expertProfessors)
                ? stats.expertProfessors
                : prev.expertProfessors,
        }));
      } catch (err) {
        // ignore polling errors silently
      }
    };

    pollId = setInterval(pollStats, pollInterval);

    // Handle initial hash scroll
    if (window.location.hash === "#testimonials") {
      const element = document.getElementById("testimonials");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    return () => {
      if (pollId) clearInterval(pollId);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcaseSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [showcaseSlides.length]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formatStatValue = (value, withPlus = false) => {
    if (!Number.isFinite(value)) return "--";
    return withPlus && value > 0 ? `${value}+` : String(value);
  };

  return (
    <div className="landing-page">
      {/* Background Gradient Orbs */}
      <div className="bg-gradient-orb bg-gradient-orb-1"></div>
      <div className="bg-gradient-orb bg-gradient-orb-2"></div>
      <div className="bg-gradient-orb bg-gradient-orb-3"></div>

      {/* Home Showcase: Slider + Announcements */}
      <section className="home-showcase-section">
        <div className="home-showcase-grid">
          <div className="home-showcase-slider">
            <div className="showcase-badge">
              <Sparkles size={16} />
              Brought to you by Academic Experts
            </div>
            <div className="showcase-image-wrap">
              {showcaseSlides.map((slide, index) => (
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.title}
                  className={`showcase-image ${index === activeSlide ? "active" : ""}`}
                />
              ))}
              <div className="showcase-overlay">
                <h1>
                  {showcaseSlides[activeSlide].title} with{" "}
                  <span className="brand-course">Course</span>
                  <span className="brand-z">Z</span>
                </h1>
                <p>{showcaseSlides[activeSlide].subtitle}</p>
              </div>
            </div>
            <div className="showcase-dots">
              {showcaseSlides.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  className={`showcase-dot ${activeSlide === index ? "active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <aside className="home-announcements-panel">
            <div className="announcements-header">
              <Megaphone size={20} />
              <h3>Announcements</h3>
            </div>
            <div className="announcements-list">
              {(announcements.length
                ? announcements
                : FALLBACK_ANNOUNCEMENTS
              ).map((item, idx) => (
                <div className="announcement-item" key={`${item.date}-${idx}`}>
                  <div className="announcement-date">
                    <CalendarDays size={14} />
                    {item.date}
                  </div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="breaking-ticker-wrap" aria-label="Breaking updates">
        <div className="breaking-label">
          <Megaphone size={16} />
          <span>Breaking</span>
        </div>
        <div className="breaking-track">
          <div className="breaking-content">
            {(breakingUpdates.length
              ? breakingUpdates
              : FALLBACK_BREAKING_UPDATES
            ).map((item, idx) => (
              <span key={`breaking-a-${idx}`} className="breaking-item">
                {item}
              </span>
            ))}
          </div>
          <div className="breaking-content" aria-hidden="true">
            {(breakingUpdates.length
              ? breakingUpdates
              : FALLBACK_BREAKING_UPDATES
            ).map((item, idx) => (
              <span key={`breaking-b-${idx}`} className="breaking-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CourseZ Intro Paragraph Section */}
      <section
        className="coursez-description-section"
        style={{ textAlign: "left" }}
      >
        <div
          className="animate-slide-up"
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.25rem" }}
        >
          <p
            className="hero-subtitle"
            style={{
              fontSize: "1.18rem",
              lineHeight: "1.75",
              color: "var(--text-main)",
              textAlign: "justify",
              textJustify: "auto",
              hyphens: "auto",
              WebkitHyphens: "auto",
              margin: 0,
            }}
          >
            <span className="brand-course">Course</span>
            <span className="brand-z">Z</span> is an online learning platform
            designed to provide high-quality, structured education in a flexible
            and accessible way. It enables learners to gain knowledge, develop
            practical skills, and improve professional competence through
            well-organized digital courses. The platform offers courses across
            technology, management, entrepreneurship, and professional
            development. Each course is created by academic experts and includes
            video lectures, assessments, and certificates to ensure clear and
            measurable learning outcomes. Blending proven educational methods
            with modern digital tools,{" "}
            <span className="brand-course">Course</span>
            <span className="brand-z">Z</span> enables learners to build
            practical skills, enhance professional competence, and advance their
            careers with confidence.
          </p>
          <p
            className="hero-subtitle"
            style={{
              fontStyle: "italic",
              marginTop: "1.25rem",
              color: "var(--primary)",
              fontWeight: "600",
              fontSize: "1.02rem",
            }}
          >
            Don't just study engineering—become the engineer companies fight to
            hire.
          </p>
        </div>
      </section>

      {/* Buttons and Stats Section */}
      <section className="hero-cta-section" style={{ textAlign: "center" }}>
        <div
          className="hero-buttons animate-slide-up"
          style={{
            justifyContent: "center",
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            animationDelay: "0.2s",
          }}
        >
          <button
            className="btn-primary btn-large"
            onClick={() => handleNavigation("/login")}
            style={{ fontSize: "1rem", padding: "12px 24px" }}
          >
            <span>Start Learning Today</span>
            <ArrowRight size={20} />
          </button>
          <button
            className="btn-outline btn-large"
            onClick={() => handleNavigation("/professor")}
            style={{ fontSize: "1rem", padding: "12px 24px" }}
          >
            <Users size={18} />
            <span>Meet the Faculty</span>
          </button>
        </div>

        <div
          className="hero-stats animate-slide-up"
          style={{
            justifyContent: "center",
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            animationDelay: "0.4s",
          }}
        >
          <StatCard
            Icon={Users}
            label="Students Enrolled"
            value={platformStats.studentsEnrolled}
            withPlus={true}
          />
          <StatCard
            Icon={BookOpen}
            label="Courses Planned"
            value={platformStats.coursesPlanned}
            withPlus={true}
          />
          <StatCard
            Icon={Award}
            label="Expert Professors"
            value={platformStats.expertProfessors}
            withPlus={false}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2 className="section-title">Testimonials</h2>
            <p className="section-subtitle">Real results from real students</p>
          </div>

          <div className="testimonials-grid">
            {(publicTestimonials.length
              ? publicTestimonials
              : FALLBACK_TESTIMONIALS
            ).map((testimonial) => (
              <div className="testimonial-card" key={testimonial._id}>
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={
                        i < (testimonial.rating || 0) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initials}</div>
                  <div>
                    <h4>{testimonial.author}</h4>
                    <p>
                      {testimonial.courseTitle
                        ? `${testimonial.role} | ${testimonial.courseTitle}`
                        : testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {false && (
        <section id="pricing" className="pricing-section">
          <div className="section-header">
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">Start free, upgrade as you grow</p>
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Free</h3>
                <p>Perfect for getting started</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">₹0</span>
                <span className="price-period">/forever</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={20} /> Access to 10+ courses
                </li>
                <li>
                  <Check size={20} /> Basic progress tracking
                </li>
                <li>
                  <Check size={20} /> Community access
                </li>
                <li>
                  <Check size={20} /> Mobile & desktop apps
                </li>
                <li>
                  <Check size={20} /> Course completion badges
                </li>
              </ul>
              <button
                className="pricing-btn btn-secondary"
                onClick={() => handleNavigation("/login")}
              >
                Get Started Free
              </button>
            </div>

            <div className="pricing-card pricing-featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Pro</h3>
                <p>For serious learners</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">₹2,499</span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={20} /> Everything in Free
                </li>
                <li>
                  <Check size={20} /> Unlimited course access
                </li>
                <li>
                  <Check size={20} /> Advanced analytics & insights
                </li>
                <li>
                  <Check size={20} /> 1-on-1 mentorship sessions
                </li>
                <li>
                  <Check size={20} /> Verified certificates
                </li>
                <li>
                  <Check size={20} /> Priority support
                </li>
                <li>
                  <Check size={20} /> Exclusive webinars
                </li>
              </ul>
              <button
                className="pricing-btn btn-primary"
                onClick={() => handleNavigation("/login")}
              >
                Start 14-Day Free Trial
              </button>
              <p className="pricing-note">No credit card required</p>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <p>For institutions & teams</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">Custom</span>
                <span className="price-period">/year</span>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={20} /> Everything in Pro
                </li>
                <li>
                  <Check size={20} /> Custom learning paths
                </li>
                <li>
                  <Check size={20} /> Team analytics dashboard
                </li>
                <li>
                  <Check size={20} /> Dedicated account manager
                </li>
                <li>
                  <Check size={20} /> API access & integrations
                </li>
                <li>
                  <Check size={20} /> SSO & SAML support
                </li>
                <li>
                  <Check size={20} /> On-site training available
                </li>
              </ul>
              <button className="pricing-btn btn-secondary">
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FAQ section removed per request */}

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default LandingPage;
