import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── Inline CSS ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --black: #080808;
    --deep: #0e0e12;
    --surface: #141418;
    --card: #1a1a20;
    --accent-red: #e63946;
    --accent-gold: #f4a226;
    --text-primary: #f2f2f0;
    --text-muted: #8a8a96;
    --text-dim: #52525e;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.15);
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 22px;
    --radius-xl: 32px;
  }

  .ls-page * { box-sizing: border-box; margin: 0; padding: 0; }

  .ls-page {
    background: var(--black);
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── Animations ── */
  @keyframes ls-fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ls-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ls-slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ls-pulse-ring {
    0%   { transform: scale(1); opacity: 0.8; }
    70%  { transform: scale(1.6); opacity: 0; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes ls-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes ls-scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes ls-ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes ls-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(230,57,70,0.3); }
    50%       { box-shadow: 0 0 40px rgba(230,57,70,0.6); }
  }
  @keyframes ls-spin { to { transform: rotate(360deg); } }

  /* ── Live Ticker ── */
  .ls-live-ticker {
    background: var(--accent-red);
    height: 32px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }
  .ls-ticker-label {
    background: #c0242e;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0 16px;
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;
    border-right: 1px solid rgba(255,255,255,0.2);
  }
  .ls-ticker-track {
    overflow: hidden;
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .ls-ticker-inner {
    display: flex;
    gap: 80px;
    white-space: nowrap;
    animation: ls-ticker 25s linear infinite;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.9);
    text-transform: uppercase;
  }
  .ls-ticker-dot { color: rgba(255,255,255,0.5); margin: 0 8px; }

  /* ── Hero ── */
  .ls-hero {
    padding: 5rem 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .ls-hero::before {
    content: '';
    position: absolute;
    top: -100px; left: 50%;
    transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(ellipse, rgba(230,57,70,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .ls-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(230,57,70,0.1);
    border: 1px solid rgba(230,57,70,0.25);
    color: var(--accent-red);
    border-radius: 999px;
    padding: 6px 16px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    animation: ls-fadeUp 0.6s ease both;
  }
  .ls-live-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent-red);
    position: relative;
  }
  .ls-live-dot::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    border: 1px solid var(--accent-red);
    animation: ls-pulse-ring 1.8s ease-out infinite;
  }
  .ls-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 7vw, 6rem);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.02em;
    animation: ls-fadeUp 0.7s 0.1s ease both;
    margin-bottom: 1.5rem;
  }
  .ls-hero h1 span { color: var(--accent-red); }
  .ls-hero p {
    font-size: 1.1rem;
    color: var(--text-muted);
    max-width: 540px;
    margin: 0 auto 3rem;
    line-height: 1.7;
    animation: ls-fadeUp 0.7s 0.2s ease both;
  }

  /* ── Main Player ── */
  .ls-main-player-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 5rem;
    animation: ls-fadeUp 0.8s 0.3s ease both;
  }
  .ls-main-player-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    position: relative;
    transition: border-color 0.3s;
    animation: ls-glow 3s ease-in-out infinite;
  }
  .ls-main-player-card:hover { border-color: rgba(230,57,70,0.3); }
  .ls-player-video-wrap {
    position: relative;
    aspect-ratio: 16/9;
    background: #000;
    overflow: hidden;
  }
  .ls-player-video-wrap iframe {
    width: 100%; height: 100%;
    border: none;
    display: block;
  }
  .ls-player-scanline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(230,57,70,0.6), transparent);
    animation: ls-scanline 4s linear infinite;
    pointer-events: none;
  }
  .ls-no-stream {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--text-dim);
    background: radial-gradient(ellipse at center, #1a1a1e 0%, #0a0a0d 100%);
    font-size: 0.9rem;
  }
  .ls-no-stream-icon {
    width: 56px; height: 56px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
  .ls-player-meta {
    padding: 1.75rem 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-start;
    justify-content: space-between;
  }
  .ls-player-meta-left { flex: 1; min-width: 200px; }
  .ls-player-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  .ls-player-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  .ls-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
  }
  .ls-tag-live {
    background: rgba(230,57,70,0.12);
    color: var(--accent-red);
    border: 1px solid rgba(230,57,70,0.25);
  }
  .ls-tag-location {
    background: rgba(255,255,255,0.05);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .ls-player-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  /* ── Buttons ── */
  .ls-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 999px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.25s;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }
  .ls-btn-primary {
    background: var(--accent-red);
    color: #fff;
  }
  .ls-btn-primary:hover {
    background: #d62f3c;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(230,57,70,0.35);
  }
  .ls-btn-ghost {
    background: rgba(255,255,255,0.06);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .ls-btn-ghost:hover {
    background: rgba(255,255,255,0.1);
    color: var(--text-primary);
    border-color: var(--border-hover);
  }
  .ls-btn-back {
    background: rgba(255,255,255,0.06);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .ls-btn-back:hover {
    background: rgba(255,255,255,0.1);
    color: var(--text-primary);
    transform: translateX(-2px);
  }

  /* ── Section heading ── */
  .ls-section-header {
    max-width: 1200px;
    margin: 0 auto 2.5rem;
    padding: 0 2rem;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .ls-section-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 700;
    line-height: 1.15;
  }
  .ls-section-header h2 em {
    font-style: normal;
    color: var(--accent-red);
  }
  .ls-section-header p {
    color: var(--text-muted);
    font-size: 0.9rem;
    max-width: 320px;
    line-height: 1.6;
  }

  /* ── Channels grid ── */
  .ls-channels-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 6rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }
  .ls-channel-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s;
    position: relative;
    animation: ls-fadeUp 0.6s ease both;
  }
  .ls-channel-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: rgba(230,57,70,0.35);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  }
  .ls-channel-card-thumb {
    position: relative;
    aspect-ratio: 16/9;
    background: #0a0a0c;
    overflow: hidden;
  }
  .ls-channel-card-thumb iframe {
    width: 100%; height: 100%;
    border: none;
    pointer-events: none;
    transition: transform 0.4s;
  }
  .ls-channel-card:hover .ls-channel-card-thumb iframe { transform: scale(1.03); }
  .ls-channel-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0) 60%);
    display: flex;
    align-items: flex-end;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ls-channel-card:hover .ls-channel-card-overlay { opacity: 1; }
  .ls-overlay-btn {
    background: var(--accent-red);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 8px 18px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  .ls-overlay-btn:hover { transform: scale(1.04); }
  .ls-channel-card-body { padding: 1.1rem 1.25rem 1.25rem; }
  .ls-channel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .ls-status-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
  }
  .ls-status-online {
    background: rgba(22,163,74,0.12);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.2);
  }
  .ls-status-offline {
    background: rgba(255,255,255,0.05);
    color: var(--text-dim);
    border: 1px solid var(--border);
  }
  .ls-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
  .ls-status-online .ls-status-dot { animation: ls-pulse-ring 1.5s ease-out infinite; }
  .ls-channel-country {
    font-size: 0.75rem;
    color: var(--text-dim);
    font-weight: 500;
    letter-spacing: 0.04em;
  }
  .ls-channel-title {
    font-size: 0.95rem;
    font-weight: 500;
    line-height: 1.4;
    color: var(--text-primary);
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ls-channel-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ls-cta-text {
    font-size: 0.72rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }
  .ls-cta-arrow {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--accent-red);
    letter-spacing: 0.04em;
  }

  /* ── Loading ── */
  .ls-loading-screen {
    min-height: 60vh;
    background: var(--black);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }
  .ls-loader-ring {
    width: 56px; height: 56px;
    border: 2px solid var(--border);
    border-top-color: var(--accent-red);
    border-radius: 50%;
    animation: ls-spin 0.8s linear infinite;
  }
  .ls-loading-label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  /* ── Back bar ── */
  .ls-back-bar {
    max-width: 1200px;
    margin: 0 auto 1.5rem;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    animation: ls-slideDown 0.4s ease both;
  }
  .ls-back-bar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* ── Divider ── */
  .ls-divider {
    max-width: 1200px;
    margin: 0 auto 5rem;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .ls-divider-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .ls-divider-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-dim);
    white-space: nowrap;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .ls-channels-grid { grid-template-columns: 1fr; }
    .ls-hero { padding: 3rem 1.5rem 2rem; }
    .ls-hero h1 { font-size: 2.8rem; }
    .ls-section-header { flex-direction: column; gap: 0.5rem; }
    .ls-player-meta { flex-direction: column; }
    .ls-back-bar { flex-direction: column; align-items: flex-start; }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .ls-channels-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  ArrowLeft: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Play: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  Gift: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  ),
};

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_STREAMS = [
  {
    _id: "1",
    videoId: "UCH7KHtVTI91GcN6yuwvaFvQ",
    type: "stream-channel-id",
    info: "Main Service — English",
    country: "Nigeria",
    status: "Online",
  },
  {
    _id: "2",
    videoId: "UC_demo1",
    type: "stream-channel-id",
    info: "Service Française — Côte d'Ivoire",
    country: "Côte d'Ivoire",
    status: "Online",
  },
  {
    _id: "3",
    videoId: "UC_demo2",
    type: "stream-channel-id",
    info: "Service Português — Brasil",
    country: "Brazil",
    status: "Online",
  },
  {
    _id: "4",
    videoId: "UC_demo3",
    type: "stream-channel-id",
    info: "Hausa Language Service — Northern Nigeria",
    country: "Nigeria (North)",
    status: "Online",
  },
  {
    _id: "5",
    videoId: "UC_demo4",
    type: "stream-channel-id",
    info: "Sign Language Interpretation Service",
    country: "International",
    status: "Online",
  },
  {
    _id: "6",
    videoId: "UC_demo5",
    type: "stream-channel-id",
    info: "Pidgin Service — West Africa",
    country: "West Africa",
    status: "Online",
  },
];

function getEmbedUrl(stream, autoplay = false) {
  if (!stream?.videoId) return "";
  if (stream.type === "stream-channel-id") {
    return `https://www.youtube.com/embed/live_stream?channel=${stream.videoId}${autoplay ? "&autoplay=1" : ""}`;
  }
  return `https://www.youtube.com/embed/${stream.videoId}${autoplay ? "?autoplay=1" : ""}`;
}

// ─── Live Ticker ──────────────────────────────────────────────────────────────
function LiveTicker({ streams }) {
  const items =
    streams.length > 0
      ? streams.map((s) => s.info || s.country || "Live Now")
      : [
          "Salvation Ministries — Home of Success",
          "Live Services 24/7",
          "Watch & Be Blessed",
        ];

  const content = [...items, ...items].map((t, i) => (
    <span key={i}>
      {t}
      {i < items.length * 2 - 1 && <span className="ls-ticker-dot">·</span>}
    </span>
  ));

  return (
    <div className="ls-live-ticker">
      <div className="ls-ticker-label">🔴 Live Now</div>
      <div className="ls-ticker-track">
        <div className="ls-ticker-inner">{content}</div>
      </div>
    </div>
  );
}

// ─── Channel Card ─────────────────────────────────────────────────────────────
function ChannelCard({ stream, onSelect, delay }) {
  return (
    <div
      className="ls-channel-card"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onSelect(stream)}
    >
      <div className="ls-channel-card-thumb">
        {stream.videoId ? (
          <iframe
            src={getEmbedUrl(stream)}
            title={stream.info}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-dim)",
              fontSize: "0.8rem",
              background: "var(--surface)",
            }}
          >
            No Preview
          </div>
        )}
        <div className="ls-channel-card-overlay">
          <button className="ls-overlay-btn">
            <Icon.Play /> Watch Live
          </button>
        </div>
      </div>
      <div className="ls-channel-card-body">
        <div className="ls-channel-header">
          <span
            className={`ls-status-badge ${stream.status === "Online" ? "ls-status-online" : "ls-status-offline"}`}
          >
            <span className="ls-status-dot" />
            {stream.status}
          </span>
          <span className="ls-channel-country">{stream.country}</span>
        </div>
        <div className="ls-channel-title">{stream.info}</div>
        <div className="ls-channel-cta">
          <span className="ls-cta-text">Click to expand</span>
          <span className="ls-cta-arrow">
            Watch Live <Icon.ArrowRight />
          </span>
        </div>
      </div>
    </div>
  );
}

function ChannelGrid({ streams, onSelect }) {
  return (
    <div className="ls-channels-grid">
      {streams.map((stream, i) => (
        <ChannelCard
          key={stream._id}
          stream={stream}
          onSelect={onSelect}
          delay={i * 60}
        />
      ))}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LiveStream() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch(
          "https://smhosapp-api.smhosapps.org/api/v1/all-live-stream",
          { credentials: "include" },
        );
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const live = (data?.live || [])
          .filter((s) => s.status === "Online")
          .map((s) => ({ ...s, source: "channel" }));
        setStreams(live.length > 0 ? live : DEMO_STREAMS);
      } catch {
        setStreams(DEMO_STREAMS);
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
  }, []);

  const mainStream =
    streams.find((s) => s.videoId === "UCH7KHtVTI91GcN6yuwvaFvQ") || streams[0];
  const otherStreams = streams.filter((s) => s !== mainStream);

  const handleSelect = (stream) => {
    setSelected(stream);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  const handleBack = () => setSelected(null);

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="ls-page">
          <div className="ls-loading-screen">
            <div className="ls-loader-ring" />
            <span className="ls-loading-label">Loading streams…</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ls-page">
        <LiveTicker streams={streams} />

        {/* ── Hero ── */}
        <section className="ls-hero">
          <div className="ls-hero-badge">
            <span className="ls-live-dot" />
            Services streaming live
          </div>
          <h1>
            Watch <span>Live</span>
            <br />
            Services
          </h1>
          <p>
            Experience the Presence of God — anytime, anywhere. Join thousands
            worshipping live across the globe.
          </p>
        </section>

        {/* ── Selected stream view ── */}
        {selected ? (
          <>
            <div className="ls-back-bar">
              <button className="ls-btn ls-btn-back" onClick={handleBack}>
                <Icon.ArrowLeft /> Back to all channels
              </button>
              <div className="ls-back-bar-right">
                <span className="ls-tag ls-tag-live">
                  <span
                    className="ls-live-dot"
                    style={{ width: 6, height: 6 }}
                  />
                  Live Now · {selected.country}
                </span>
              </div>
            </div>

            <div className="ls-main-player-wrap">
              <div className="ls-main-player-card">
                <div className="ls-player-video-wrap">
                  {selected.videoId ? (
                    <>
                      <iframe
                        src={getEmbedUrl(selected, true)}
                        title={selected.info}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="ls-player-scanline" />
                    </>
                  ) : (
                    <div className="ls-no-stream">
                      <div className="ls-no-stream-icon">📡</div>
                      <span>Stream unavailable</span>
                    </div>
                  )}
                </div>
                <div className="ls-player-meta">
                  <div className="ls-player-meta-left">
                    <div className="ls-player-title">{selected.info}</div>
                    <div className="ls-player-tags">
                      <span className="ls-tag ls-tag-live">
                        <Icon.Play /> Live Stream
                      </span>
                      <span className="ls-tag ls-tag-location">
                        <Icon.Globe /> {selected.country}
                      </span>
                    </div>
                  </div>
                  <div className="ls-player-actions">
                    <Link to="/expectation" className="ls-btn ls-btn-primary">
                      <Icon.Gift /> Expectation Form
                    </Link>
                    <Link to="/give" className="ls-btn ls-btn-ghost">
                      Give
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {otherStreams.filter((s) => s !== selected).length > 0 && (
              <>
                <div className="ls-divider">
                  <div className="ls-divider-line" />
                  <span className="ls-divider-label">More channels</span>
                  <div className="ls-divider-line" />
                </div>
                <ChannelGrid
                  streams={otherStreams.filter((s) => s !== selected)}
                  onSelect={handleSelect}
                />
              </>
            )}
          </>
        ) : (
          <>
            {/* ── Featured main stream ── */}
            {mainStream && (
              <div className="ls-main-player-wrap">
                <div className="ls-main-player-card">
                  <div className="ls-player-video-wrap">
                    <iframe
                      src={getEmbedUrl(mainStream, true)}
                      title={mainStream.info}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <div className="ls-player-scanline" />
                  </div>
                  <div className="ls-player-meta">
                    <div className="ls-player-meta-left">
                      <div className="ls-player-title">{mainStream.info}</div>
                      <div className="ls-player-tags">
                        <span className="ls-tag ls-tag-live">
                          <span
                            className="ls-live-dot"
                            style={{ width: 6, height: 6 }}
                          />{" "}
                          Live Now
                        </span>
                        <span className="ls-tag ls-tag-location">
                          <Icon.Globe /> {mainStream.country}
                        </span>
                      </div>
                    </div>
                    <div className="ls-player-actions">
                      <Link to="/expectation" className="ls-btn ls-btn-primary">
                        <Icon.Gift /> Expectation Form
                      </Link>
                      <Link to="/give" className="ls-btn ls-btn-ghost">
                        Give
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Other channels ── */}
            {otherStreams.length > 0 && (
              <>
                <div className="ls-section-header">
                  <div>
                    <h2>
                      Streams by <em>Language</em>
                    </h2>
                  </div>
                  <p>Click any channel to expand and watch in full focus.</p>
                </div>
                <ChannelGrid streams={otherStreams} onSelect={handleSelect} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
