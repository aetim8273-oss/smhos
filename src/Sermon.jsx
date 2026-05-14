import { useState, useEffect, useRef, useCallback } from "react";
import { href, Link } from "react-router-dom";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const sermons = [
  {
    id: 1,
    title: "Faith for All-Round Possibilities",
    date: "10 April, 2025",
    views: 373,
    category: "Topical",
    image: "https://smhos.org/wp-content/uploads/2023/02/sddefault-5.jpg",
    videoId: "_ZicjWXp1w0",
    featured: true,
  },
  {
    id: 2,
    title: "Faith for Supernatural Supplies",
    date: "10 April, 2025",
    views: 152,
    category: "Narrative",
    image: "https://smhos.org/wp-content/uploads/2023/02/sddefault-4.jpg",
    videoId: "LwmkhbxU2YY",
    featured: false,
  },
  {
    id: 3,
    title: "Impartation Of The Spirit Of Faith",
    date: "10 April, 2025",
    views: 79,
    category: "Expository",
    image: "https://smhos.org/wp-content/uploads/2023/02/sddefault-2.jpg",
    videoId: "Iuby7IPz6Uw",
    featured: false,
  },
  {
    id: 4,
    title: "Operating The Spirit Of Faith",
    date: "16 February, 2023",
    views: 85,
    category: "Textual",
    image: "https://smhos.org/wp-content/uploads/2023/02/sddefault-3.jpg",
    videoId: "RG_thGfgJ7c",
    featured: false,
  },
  {
    id: 5,
    title: "The Faith That Works",
    date: "16 February, 2023",
    views: 84,
    category: "Expository",
    image: "https://smhos.org/wp-content/uploads/2023/02/sddefault-1.jpg",
    videoId: "nv06niUnUeQ",
    featured: false,
  },
  {
    id: 6,
    title: "Moving God to Act Through Your Faith-Provoked Praise",
    date: "16 February, 2023",
    views: 340,
    category: "Topical",
    image: "https://smhos.org/wp-content/uploads/2023/02/sddefault.jpg",
    videoId: "ngRxurDVW7o",
    featured: false,
  },
];

const categories = ["All", "Topical", "Expository", "Narrative", "Textual"];

const categoryMeta = {
  Topical: {
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.12)",
    border: "rgba(201,168,76,0.35)",
  },
  Narrative: {
    color: "#5DCAA5",
    bg: "rgba(93,202,165,0.12)",
    border: "rgba(93,202,165,0.35)",
  },
  Expository: {
    color: "#A9A9EC",
    bg: "rgba(123,111,212,0.12)",
    border: "rgba(123,111,212,0.35)",
  },
  Textual: {
    color: "#F0997B",
    bg: "rgba(240,153,123,0.12)",
    border: "rgba(240,153,123,0.35)",
  },
};

const noiseUrl = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────
   BREAKPOINT HOOK
   xs < 480 | sm 480-767 | md 768-1023 | lg 1024+
───────────────────────────────────────── */
function useBreakpoint() {
  const getBreakpoint = useCallback(() => {
    if (typeof window === "undefined") return "lg";
    const w = window.innerWidth;
    if (w < 480) return "xs";
    if (w < 768) return "sm";
    if (w < 1024) return "md";
    return "lg";
  }, []);

  const [bp, setBp] = useState(getBreakpoint);

  useEffect(() => {
    const handler = () => setBp(getBreakpoint());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [getBreakpoint]);

  return {
    bp,
    isMobile: bp === "xs" || bp === "sm",
    isTablet: bp === "md",
    isDesktop: bp === "lg",
  };
}

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const PlayIcon = ({ size = 10 }) => (
  <svg width={size} height={size} viewBox="0 0 10 12" fill="none">
    <path d="M1 1L9 6L1 11V1Z" fill="currentColor" />
  </svg>
);

const EyeIcon = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─────────────────────────────────────────
   VIDEO MODAL
───────────────────────────────────────── */
function VideoModal({ sermon, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(4,4,12,0.94)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 840,
          background: "#0F0F1E",
          borderRadius: 16,
          border: "1px solid rgba(201,168,76,0.25)",
          overflow: "hidden",
          animation: "slideUp 0.25s ease",
        }}
      >
        <div
          style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1`}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={sermon.title}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 10,
                color: "#C9A84C",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {sermon.category}
            </div>
            <div
              style={{
                fontSize: "clamp(13px, 2.5vw, 15px)",
                fontWeight: 600,
                color: "#F0EDE8",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {sermon.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#9A95A8",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SERMON CARD
───────────────────────────────────────── */
function SermonCard({ sermon, index, featured, isMobile, isTablet }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const cat = categoryMeta[sermon.category];
  const showOverlay = isMobile || hovered;

  return (
    <>
      {modalOpen && (
        <VideoModal sermon={sermon} onClose={() => setModalOpen(false)} />
      )}
      <div
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onClick={() => setModalOpen(true)}
        style={{
          background: "linear-gradient(160deg, #13132A 0%, #0E0E1D 100%)",
          border: `1px solid ${hovered ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
          borderRadius: isMobile ? 14 : 16,
          overflow: "hidden",
          cursor: "pointer",
          height: "100%",
          transition:
            "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s",
          transform: hovered
            ? "translateY(-5px) scale(1.01)"
            : "translateY(0) scale(1)",
          boxShadow: hovered
            ? "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.1)"
            : "0 4px 16px rgba(0,0,0,0.3)",
          animation: "cardIn 0.5s ease both",
          animationDelay: `${index * 60}ms`,
        }}
      >
        {/* Thumbnail */}
        <div
          style={{
            position: "relative",
            aspectRatio: featured ? "16/9" : isMobile ? "16/9" : "4/3",
            overflow: "hidden",
          }}
        >
          <img
            src={sermon.image}
            alt={sermon.title}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.5s ease, filter 0.3s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              filter: showOverlay
                ? "brightness(0.6) saturate(0.75)"
                : "brightness(0.85) saturate(0.7)",
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(4,4,16,0.9) 0%, rgba(4,4,16,0.15) 55%, transparent 100%)",
              opacity: showOverlay ? 1 : 0.5,
              transition: "opacity 0.3s ease",
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%,-50%) scale(${showOverlay ? 1 : 0.8})`,
              width: isMobile ? 44 : 50,
              height: isMobile ? 44 : 50,
              borderRadius: "50%",
              background: "rgba(201,168,76,0.92)",
              border: "2px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0A0A14",
              opacity: showOverlay ? 1 : 0,
              transition:
                "opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              pointerEvents: "none",
            }}
          >
            <PlayIcon size={isMobile ? 10 : 12} />
          </div>

          {/* Category badge */}
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 100,
              background: cat.bg,
              color: cat.color,
              border: `1px solid ${cat.border}`,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {sermon.category}
          </div>

          {/* Views */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "rgba(240,237,232,0.8)",
              opacity: showOverlay ? 1 : 0,
              transition: "opacity 0.25s",
            }}
          >
            <EyeIcon size={11} />
            {sermon.views.toLocaleString()}
          </div>
        </div>

        {/* Body */}
        <div
          style={{ padding: featured ? "18px 22px 20px" : "12px 14px 16px" }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#C9A84C",
              marginBottom: 6,
              fontWeight: 600,
              opacity: 0.8,
            }}
          >
            {sermon.date}
          </div>
          <div
            style={{
              fontSize: featured ? 17 : isMobile ? 14 : 14,
              fontWeight: 600,
              color: "#F0EDE8",
              lineHeight: 1.35,
              marginBottom: 12,
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {sermon.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#6B6880",
              }}
            >
              <EyeIcon size={11} />
              <span>{sermon.views.toLocaleString()} views</span>
            </div>
            <div
              style={{
                fontSize: 10,
                padding: "5px 12px",
                borderRadius: 100,
                border: "1px solid rgba(201,168,76,0.3)",
                color: "#C9A84C",
                background: hovered ? "rgba(201,168,76,0.1)" : "transparent",
                transition: "background 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Watch now
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   MOBILE NAV DRAWER
───────────────────────────────────────── */
function MobileDrawer({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(4,4,12,0.75)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(300px, 82vw)",
          background: "#0F0F1E",
          borderLeft: "1px solid rgba(201,168,76,0.15)",
          padding: "20px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          animation: "slideInRight 0.25s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9A95A8",
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <Link
          href="/"
          onClick={onClose}
          style={{
            padding: "14px 16px",
            fontSize: 13,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#9A95A8",
            textDecoration: "none",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.04)",
            transition: "all 0.2s",
          }}
        >
          Home
        </Link>
        <Link
          href="/sermons"
          onClick={onClose}
          style={{
            padding: "14px 16px",
            fontSize: 13,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#9A95A8",
            textDecoration: "none",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.04)",
            transition: "all 0.2s",
          }}
        >
          Sermons
        </Link>
        <Link
          href="/give"
          onClick={onClose}
          style={{
            padding: "14px 16px",
            fontSize: 13,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#9A95A8",
            textDecoration: "none",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.04)",
            transition: "all 0.2s",
          }}
        >
          Give
        </Link>
        <Link
          href="/contact"
          onClick={onClose}
          style={{
            padding: "14px 16px",
            fontSize: 13,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#9A95A8",
            textDecoration: "none",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.04)",
            transition: "all 0.2s",
          }}
        >
          Contact
        </Link>
        {/* {["Home", "Sermons", "Give", "Contact"].map((link) => (
          <a
            key={link}
            href="#"
            onClick={onClose}
            style={{
              padding: "14px 16px",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#9A95A8",
              textDecoration: "none",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.04)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#C9A84C";
              e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9A95A8";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
            }}
          >
            {link}
          </a>
        ))} */}

        <div style={{ marginTop: 12 }}>
          <button
            className="cta-btn"
            style={{ width: "100%", padding: "13px", fontSize: 12 }}
          >
            Join Livestream
          </button>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ fontSize: 11, color: "#3A3850", lineHeight: 1.6 }}>
            Salvation Ministries
            <br />
            Port Harcourt, Nigeria
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function SermonsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const containerRef = useRef(null);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 50);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    activeFilter === "All"
      ? sermons
      : sermons.filter((s) => s.category === activeFilter);
  const totalViews = sermons.reduce((a, s) => a + s.views, 0);

  /* Responsive values */
  const px = isMobile ? "16px" : isTablet ? "28px" : "48px";
  const gridCols = isDesktop
    ? "repeat(3, 1fr)"
    : isTablet
      ? "repeat(2, 1fr)"
      : "1fr";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Syne:wght@400;500;600;700&display=swap');

        @keyframes fadeIn        { from{opacity:0}           to{opacity:1} }
        @keyframes slideUp       { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes cardIn        { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer       { 0%{background-position:-200% center} 100%{background-position:200% center} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        ::-webkit-scrollbar         { width:4px }
        ::-webkit-scrollbar-track   { background:#080814 }
        ::-webkit-scrollbar-thumb   { background:rgba(201,168,76,.2); border-radius:99px }

        .filter-pill {
          font-size:11px; padding:6px 16px; border-radius:100px;
          border:1px solid rgba(201,168,76,.2); background:transparent;
          color:rgba(154,149,168,.85); cursor:pointer;
          transition:all .2s; font-family:'Syne',sans-serif;
          font-weight:500; letter-spacing:.5px; white-space:nowrap; flex-shrink:0;
          -webkit-tap-highlight-color:transparent; touch-action:manipulation;
        }
        .filter-pill:hover,.filter-pill:focus {
          border-color:rgba(201,168,76,.5); color:#C9A84C;
          background:rgba(201,168,76,.06); outline:none;
        }
        .filter-pill.active {
          background:linear-gradient(135deg,#C9A84C 0%,#E8C86A 50%,#C9A84C 100%);
          background-size:200% auto; border-color:transparent;
          color:#0A0A14; font-weight:700;
          animation:shimmer 2.5s linear infinite;
        }
        .cta-btn {
          font-family:'Syne',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:1px; text-transform:uppercase; padding:9px 20px;
          border-radius:100px;
          background:linear-gradient(135deg,#C9A84C 0%,#E8C86A 50%,#C9A84C 100%);
          background-size:200% auto; color:#0A0A14; border:none; cursor:pointer;
          transition:background-position .4s, transform .2s;
          animation:shimmer 3s linear infinite;
          -webkit-tap-highlight-color:transparent; touch-action:manipulation;
        }
        .cta-btn:hover  { transform:translateY(-1px); }
        .cta-btn:active { transform:scale(.98); }

        /* hide scrollbar on filter strip */
        .filter-strip::-webkit-scrollbar { display:none }
        .filter-strip { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div
        ref={containerRef}
        style={{
          minHeight: "100vh",
          background: "#07070F",
          fontFamily: "'Syne',sans-serif",
          overflowY: "auto",
          overflowX: "hidden",
          color: "#F0EDE8",
          backgroundImage: noiseUrl,
        }}
      >
        {/* ══ NAV ══ */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 500,
            background: scrolled ? "rgba(7,7,15,.97)" : "transparent",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled
              ? "1px solid rgba(201,168,76,.1)"
              : "1px solid transparent",
            transition: "all .3s ease",
            padding: `0 ${px}`,
            height: isMobile ? 56 : 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg,#C9A84C,#8B6914)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: "#0A0A14",
                fontWeight: 800,
              }}
            >
              SM
            </div>
            <span
              style={{
                fontSize: isMobile ? 11 : 13,
                fontWeight: 700,
                letterSpacing: isMobile ? 1 : 1.5,
                textTransform: "uppercase",
                color: "#F0EDE8",
                whiteSpace: "nowrap",
              }}
            >
              {isMobile ? "Salvation Min." : "Salvation Ministries"}
            </span>
          </div>

          {/* Desktop links */}
          <Link
            to="/"
            style={{
              fontSize: 11,
              color: "rgba(154,149,168,.7)",
              textDecoration: "none",
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 500,
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(154,149,168,.7)")
            }
          >
            Home
          </Link>
          <Link
            to="/sermons"
            style={{
              fontSize: 11,
              color: "rgba(154,149,168,.7)",
              textDecoration: "none",
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 500,
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(154,149,168,.7)")
            }
          >
            Sermons
          </Link>
          <Link
            to="/give"
            style={{
              fontSize: 11,
              color: "rgba(154,149,168,.7)",
              textDecoration: "none",
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 500,
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(154,149,168,.7)")
            }
          >
            Give
          </Link>
          <Link
            to="/contact"
            style={{
              fontSize: 11,
              color: "rgba(154,149,168,.7)",
              textDecoration: "none",
              letterSpacing: 1,
              textTransform: "uppercase",
              fontFamily: "'Syne',sans-serif",
              fontWeight: 500,
              transition: "color .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(154,149,168,.7)")
            }
          >
            Contact
          </Link>
          {/* {isDesktop && (
            <div style={{ display: "flex", gap: 28 }}>
              {["Home", "Sermons", "Give", "Contact"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: 11,
                    color: "rgba(154,149,168,.7)",
                    textDecoration: "none",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 500,
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#C9A84C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(154,149,168,.7)")
                  }
                >
                  {l}
                </a>
              ))}
            </div>
          )} */}

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {(isMobile || isTablet) && (
              <button
                onClick={() => setDrawerOpen(true)}
                style={{
                  background: "rgba(255,255,255,.05)",
                  border: "1px solid rgba(201,168,76,.15)",
                  borderRadius: 10,
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C9A84C",
                  cursor: "pointer",
                }}
              >
                <MenuIcon />
              </button>
            )}
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <div
          style={{
            position: "relative",
            padding: isMobile
              ? "48px 16px 36px"
              : isTablet
                ? "60px 28px 48px"
                : "80px 48px 64px",
            overflow: "hidden",
          }}
        >
          {/* Glow orbs */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              pointerEvents: "none",
              width: isMobile ? 240 : 440,
              height: isMobile ? 240 : 440,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(201,168,76,.07) 0%,transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: isMobile ? "5%" : "20%",
              pointerEvents: "none",
              width: isMobile ? 180 : 300,
              height: isMobile ? 180 : 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(123,111,212,.05) 0%,transparent 70%)",
            }}
          />

          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              animation: "fadeIn .6s ease",
            }}
          >
            <div
              style={{
                width: 28,
                height: 1,
                background: "linear-gradient(90deg,transparent,#C9A84C)",
              }}
            />
            <span
              style={{
                fontSize: 9,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#C9A84C",
                fontWeight: 600,
              }}
            >
              Word of Faith
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: isMobile
                ? "clamp(36px,10vw,50px)"
                : isTablet
                  ? "clamp(44px,7vw,62px)"
                  : "clamp(54px,5.5vw,80px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-.5px",
              marginBottom: 14,
              animation: "slideUp .6s ease .1s both",
              maxWidth: isMobile ? "100%" : 620,
            }}
          >
            Latest{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg,#C9A84C 0%,#F0D080 40%,#C9A84C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sermons
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: isMobile ? 14 : 15,
              color: "#6B6880",
              maxWidth: 420,
              lineHeight: 1.7,
              marginBottom: 24,
              animation: "slideUp .6s ease .2s both",
            }}
          >
            Timeless messages to build your faith and transform your life.
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 20 : 36,
              marginBottom: 24,
              flexWrap: "wrap",
              animation: "slideUp .6s ease .3s both",
            }}
          >
            {[
              { num: sermons.length, label: "Messages" },
              { num: `${totalViews.toLocaleString()}+`, label: "Total views" },
              { num: "4", label: "Series" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: isMobile ? 26 : 32,
                    fontWeight: 700,
                    color: "#F0EDE8",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#6B6880",
                    marginTop: 3,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Filter strip — horizontally scrollable on mobile */}
          <div
            className="filter-strip"
            style={{
              display: "flex",
              gap: 8,
              overflowX: isMobile ? "auto" : "visible",
              flexWrap: isMobile ? "nowrap" : "wrap",
              paddingBottom: isMobile ? 4 : 0,
              animation: "slideUp .6s ease .35s both",
              /* let it bleed slightly on mobile for scroll affordance */
              marginRight: isMobile ? "-16px" : 0,
              paddingRight: isMobile ? "16px" : 0,
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill${activeFilter === cat ? " active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ══ DIVIDER ══ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: `0 ${px} 18px`,
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#3A3850",
              whiteSpace: "nowrap",
            }}
          >
            {activeFilter === "All" ? "All messages" : activeFilter}
          </div>
          <div
            style={{ flex: 1, height: 1, background: "rgba(201,168,76,.07)" }}
          />
          <div style={{ fontSize: 10, color: "#3A3850" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* ══ SERMON GRID ══ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: isMobile ? 14 : isTablet ? 18 : 20,
            padding: `0 ${px} ${isMobile ? "48px" : "64px"}`,
          }}
        >
          {filtered.map((sermon, idx) => {
            /* Featured card only spans 2 cols on desktop 3-col grid */
            const isFeatured =
              sermon.featured && activeFilter === "All" && isDesktop;
            return (
              <div
                key={sermon.id}
                style={{ gridColumn: isFeatured ? "span 2" : "span 1" }}
              >
                <SermonCard
                  sermon={sermon}
                  index={idx}
                  featured={isFeatured}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </div>
            );
          })}
        </div>

        {/* ══ FOOTER ══ */}
        <footer
          style={{
            borderTop: "1px solid rgba(201,168,76,.08)",
            padding: `${isMobile ? "28px" : "32px"} ${px}`,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: isMobile ? 20 : 12,
            background: "rgba(255,255,255,.01)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#C9A84C",
              }}
            >
              Salvation Ministries
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#3A3850",
                marginTop: 4,
                lineHeight: 1.6,
              }}
            >
              Plot 17 Birabi Street, GRA Phase 1,
              <br />
              Port Harcourt, Rivers, Nigeria
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 12 : 16,
              alignItems: isMobile ? "stretch" : "center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              {["Facebook", "Instagram"].map((name) => (
                <a
                  key={name}
                  href={`https://www.${name.toLowerCase()}.com/smhosglobal`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#6B6880",
                    textDecoration: "none",
                    fontSize: 11,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    transition: "color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#C9A84C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#6B6880")
                  }
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
/* <iframe
            src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1`}
            allow="autoplay; fullscreen"*/
