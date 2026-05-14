import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// ─── Floating Particle ────────────────────────────────────────────────────────
const Particle = ({ style }) => (
  <div
    className="particle"
    style={{
      position: "absolute",
      borderRadius: "50%",
      pointerEvents: "none",
      ...style,
    }}
  />
);

// ─── Animated Number ──────────────────────────────────────────────────────────
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = display;
    const end = value;
    if (start === end) return;
    const step = end > start ? 1 : -1;
    const timer = setInterval(() => {
      start += step;
      setDisplay(start);
      if (start === end) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SalvationMinistries2026() {
  const STORAGE_KEY = "salvation_2026_expectations";

  const [name, setName] = useState("");
  const [expectations, setExpectations] = useState([
    {
      id: Date.now().toString(),
      text: "",
      category: "spiritual",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [savedData, setSavedData] = useState(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const [particles, setParticles] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const printRef = useRef(null);

  const categories = [
    {
      value: "spiritual",
      label: "Spiritual Growth",
      color: "#a855f7",
      bg: "rgba(168,85,247,0.12)",
    },
    {
      value: "ministry",
      label: "Ministry",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.12)",
    },
    {
      value: "personal",
      label: "Personal Dev",
      color: "#22c55e",
      bg: "rgba(34,197,94,0.12)",
    },
    {
      value: "family",
      label: "Family",
      color: "#ec4899",
      bg: "rgba(236,72,153,0.12)",
    },
    {
      value: "career",
      label: "Career/Education",
      color: "#eab308",
      bg: "rgba(234,179,8,0.12)",
    },
    {
      value: "financial",
      label: "Financial",
      color: "#6366f1",
      bg: "rgba(99,102,241,0.12)",
    },
    {
      value: "health",
      label: "Health",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
    },
    {
      value: "general",
      label: "General",
      color: "#94a3b8",
      bg: "rgba(148,163,184,0.12)",
    },
  ];

  const getCat = (val) =>
    categories.find((c) => c.value === val) || categories[7];

  // Spawn particles on save/action
  const spawnParticles = useCallback(() => {
    const newP = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: ["#fbbf24", "#a855f7", "#3b82f6", "#22c55e", "#ec4899"][
        Math.floor(Math.random() * 5)
      ],
      duration: Math.random() * 1.5 + 0.8,
      delay: Math.random() * 0.4,
    }));
    setParticles(newP);
    setTimeout(() => setParticles([]), 3000);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    setTimeout(() => setFormVisible(true), 400);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const d = JSON.parse(stored);
        setSavedData(d);
        setName(d.name);
        setExpectations(d.expectations);
        setHasSaved(true);
      }
    } catch {}
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const addExpectation = () => {
    if (expectations.length >= 15) {
      showToast("info", "Maximum 15 expectations");
      return;
    }
    setExpectations([
      ...expectations,
      {
        id: Date.now().toString(),
        text: "",
        category: "general",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const removeExpectation = (id) => {
    if (expectations.length <= 1) {
      showToast("error", "At least one expectation required");
      return;
    }
    setExpectations(expectations.filter((e) => e.id !== id));
  };

  const updateText = (id, text) =>
    setExpectations(
      expectations.map((e) => (e.id === id ? { ...e, text } : e)),
    );
  const updateCategory = (id, category) =>
    setExpectations(
      expectations.map((e) => (e.id === id ? { ...e, category } : e)),
    );

  const validate = () => {
    if (!name.trim()) {
      showToast("error", "Please enter your name");
      return false;
    }
    if (expectations.some((e) => !e.text.trim())) {
      showToast("error", "Fill in all expectation fields");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      id: savedData?.id || Date.now().toString(),
      name: name.trim(),
      expectations: expectations.map((e) => ({ ...e, text: e.text.trim() })),
      submittedAt: savedData?.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedData(data);
      setHasSaved(true);
      spawnParticles();
      showToast(
        "success",
        hasSaved ? "Expectations updated!" : "Saved successfully! 🙌",
      );
    } catch {
      showToast("error", "Failed to save");
    }
  };

  const handleDelete = () => {
    if (
      !window.confirm("Delete all saved expectations? This cannot be undone.")
    )
      return;
    localStorage.removeItem(STORAGE_KEY);
    setSavedData(null);
    setName("");
    setExpectations([
      {
        id: Date.now().toString(),
        text: "",
        category: "spiritual",
        createdAt: new Date().toISOString(),
      },
    ]);
    setHasSaved(false);
    showToast("info", "Cleared successfully");
  };

  const handlePrint = () => {
    if (!savedData) {
      showToast("error", "Save first before printing");
      return;
    }
    const w = window.open("", "_blank");
    if (!w) {
      showToast("error", "Allow pop-ups to print");
      return;
    }
    const html = `<!DOCTYPE html><html><head><title>2026 Expectations - ${savedData.name}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
      body{font-family:'Inter',sans-serif;max-width:780px;margin:0 auto;padding:40px;color:#1a1a2e;background:#fff}
      .header{text-align:center;padding-bottom:30px;border-bottom:3px solid #2563eb;margin-bottom:35px}
      h1{font-family:'Playfair Display',serif;font-size:36px;color:#1d4ed8;margin:0 0 8px}
      h2{font-size:20px;color:#64748b;font-weight:400;margin:0}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:30px}
      .meta-item strong{display:block;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
      .meta-item span{font-size:16px;font-weight:600;color:#1e293b}
      .name{font-family:'Playfair Display',serif;font-size:28px;color:#1d4ed8;margin-bottom:20px}
      .scripture{text-align:center;font-style:italic;color:#4b5563;background:#eff6ff;border-left:4px solid #3b82f6;padding:14px 20px;border-radius:0 8px 8px 0;margin:24px 0}
      .card{border:1px solid #e5e7eb;border-radius:12px;padding:18px;margin-bottom:16px;page-break-inside:avoid}
      .card-num{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#1d4ed8;color:#fff;border-radius:50%;font-weight:700;font-size:14px;margin-right:10px}
      .card-text{font-size:15px;line-height:1.7;color:#374151;margin-top:12px;white-space:pre-wrap}
      .footer{margin-top:50px;padding-top:20px;border-top:2px dashed #e5e7eb;text-align:center;color:#9ca3af;font-size:13px}
      @media print{@page{margin:.5in}body{padding:0}}
    </style></head><body>
    <div class="header"><h1>Salvation Ministries</h1><h2>2026 Expectation Form</h2></div>
    <div class="meta">
      <div class="meta-item"><strong>Name</strong><span>${savedData.name}</span></div>
      <div class="meta-item"><strong>Submitted</strong><span>${new Date(savedData.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
      <div class="meta-item"><strong>Updated</strong><span>${new Date(savedData.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></div>
      <div class="meta-item"><strong>Total</strong><span>${savedData.expectations.length} Expectations</span></div>
    </div>
    <div class="scripture">"For surely there is an end; And thine expectation shall not be cut off." — Proverbs 23:18 (KJV)</div>
    ${savedData.expectations
      .map(
        (e, i) => `
      <div class="card">
        <div><span class="card-num">${i + 1}</span><strong>${getCat(e.category).label}</strong></div>
        <div class="card-text">${e.text}</div>
      </div>`,
      )
      .join("")}
    <div class="footer"><p><strong>Salvation Ministries 2026 Vision</strong><br>May God grant you the desires of your heart according to His will.</p></div>
    </body></html>`;
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.focus();
      w.print();
    }, 500);
  };

  const toastColors = {
    success: { bg: "linear-gradient(135deg,#059669,#34d399)", icon: "✓" },
    error: { bg: "linear-gradient(135deg,#dc2626,#f87171)", icon: "✕" },
    info: { bg: "linear-gradient(135deg,#2563eb,#60a5fa)", icon: "ℹ" },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #c9a227;
          --gold-light: #f0d060;
          --blue-deep: #0a0e2e;
          --blue-mid: #0f1a4a;
          --blue-bright: #1d4ed8;
          --blue-glow: #3b82f6;
          --white: #f0f4ff;
          --glass: rgba(255,255,255,0.06);
          --glass-border: rgba(255,255,255,0.12);
          --radius: 16px;
          --shadow-gold: 0 0 40px rgba(201,162,39,0.25);
        }

        body { background: var(--blue-deep); color: var(--white); font-family: 'Lato', sans-serif; }

        /* ── SCROLLBAR ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--blue-deep); }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

        /* ── PARTICLES ── */
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(0.2); opacity: 0; }
        }
        .particle { animation: floatUp var(--dur, 1.2s) var(--delay, 0s) ease-out forwards; }

        /* ── HERO ── */
        .sm-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #060a20 0%, #0d1842 50%, #0a1535 100%);
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sm-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(201,162,39,0.12) 0%, transparent 60%);
        }

        /* Stars */
        .stars-layer {
          position: absolute; inset: 0; overflow: hidden;
        }
        .star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: twinkle var(--tw-dur, 3s) var(--tw-delay, 0s) ease-in-out infinite alternate;
        }
        @keyframes twinkle {
          0%   { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.9; transform: scale(1.2); }
        }

        /* Gold beams */
        .beam {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(201,162,39,0.5), transparent);
          animation: beamPulse var(--b-dur, 4s) var(--b-delay, 0s) ease-in-out infinite;
        }
        @keyframes beamPulse {
          0%, 100% { opacity: 0; height: 0; }
          50%       { opacity: 1; height: var(--b-height, 200px); }
        }

        /* Hero content */
        .hero-inner {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 60px 20px 80px;
          max-width: 800px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .hero-inner.visible { opacity: 1; transform: translateY(0); }

        .hero-logo {
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          box-shadow: 0 0 30px rgba(201,162,39,0.4), 0 0 60px rgba(201,162,39,0.15);
          margin: 0 auto 24px;
          overflow: hidden;
          background: var(--blue-mid);
          display: flex; align-items: center; justify-content: center;
          animation: pulseRing 3s ease-in-out infinite;
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 20px rgba(201,162,39,0.3), 0 0 50px rgba(201,162,39,0.1); }
          50%       { box-shadow: 0 0 40px rgba(201,162,39,0.6), 0 0 80px rgba(201,162,39,0.25); }
        }

        .hero-badge {
          display: inline-block;
          border: 1px solid rgba(201,162,39,0.4);
          background: rgba(201,162,39,0.08);
          color: var(--gold-light);
          font-size: 11px;
          letter-spacing: .2em;
          text-transform: uppercase;
          padding: 6px 18px;
          border-radius: 40px;
          margin-bottom: 20px;
          backdrop-filter: blur(8px);
        }

        .hero-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.08;
          background: linear-gradient(135deg, #f0d060 0%, #c9a227 30%, #f9f1c0 55%, #c9a227 80%, #f0d060 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
          text-shadow: none;
          filter: drop-shadow(0 2px 20px rgba(201,162,39,0.4));
        }

        .hero-sub {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.1rem, 2.5vw, 1.6rem);
          color: rgba(200,220,255,0.85);
          font-weight: 400;
          margin-bottom: 20px;
          letter-spacing: .05em;
        }

        .hero-verse {
          font-style: italic;
          color: rgba(200,220,255,0.65);
          font-size: 0.95rem;
          max-width: 500px;
          margin: 0 auto 30px;
          line-height: 1.7;
          border-left: 2px solid var(--gold);
          padding-left: 16px;
          text-align: left;
        }

        .hero-wave {
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 80px;
        }

        /* ── NAV ── */
        .sm-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(10,14,46,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,162,39,0.2);
          padding: 14px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { display: flex; align-items: center; gap: 12px; }
        .nav-logo img { height: 40px; width: auto; }
        .nav-title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--gold-light);
          letter-spacing: .08em;
        }
        .nav-links { display: flex; gap: 8px; align-items: center; }
        .nav-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(200,220,255,0.8);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
          transition: all .25s;
          font-family: 'Lato', sans-serif;
        }
        .nav-btn:hover {
          background: rgba(201,162,39,0.12);
          border-color: var(--gold);
          color: var(--gold-light);
        }
        .nav-btn.gold {
          background: linear-gradient(135deg, rgba(201,162,39,0.25), rgba(240,208,96,0.15));
          border-color: var(--gold);
          color: var(--gold-light);
        }
        .nav-btn.gold:hover {
          background: linear-gradient(135deg, rgba(201,162,39,0.4), rgba(240,208,96,0.25));
          box-shadow: 0 0 20px rgba(201,162,39,0.3);
        }

        /* ── MAIN LAYOUT ── */
        .sm-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 20px 80px;
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .sm-main { grid-template-columns: 1fr; }
        }

        /* ── GLASS CARD ── */
        .glass-card {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius);
          backdrop-filter: blur(16px);
          padding: 28px;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .card-section-title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--gold-light);
          letter-spacing: .1em;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .card-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(201,162,39,0.4), transparent);
        }

        /* ── SIDEBAR STATS ── */
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .stat-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all .3s;
        }
        .stat-item:hover { background: rgba(201,162,39,0.08); border-color: rgba(201,162,39,0.3); }
        .stat-num {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label { font-size: 11px; color: rgba(200,220,255,0.5); text-transform: uppercase; letter-spacing: .1em; margin-top: 2px; }

        /* How it works steps */
        .step-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .step-item:last-child { border: none; }
        .step-num {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          color: #0a0e2e;
          flex-shrink: 0;
        }
        .step-text { font-size: 14px; color: rgba(200,220,255,0.75); line-height: 1.5; padding-top: 4px; }

        /* PDF download card */
        .pdf-card {
          background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.05));
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: var(--radius);
          padding: 24px;
          margin-top: 20px;
        }
        .pdf-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #059669, #34d399);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .06em;
          cursor: pointer;
          margin-top: 16px;
          text-decoration: none;
          transition: all .3s;
          box-shadow: 0 4px 20px rgba(5,150,105,0.3);
        }
        .pdf-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(5,150,105,0.4);
        }

        /* Saved summary card */
        .saved-card {
          background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(29,78,216,0.06));
          border: 1px solid rgba(59,130,246,0.25);
          border-radius: var(--radius);
          padding: 24px;
          margin-top: 20px;
        }
        .saved-name {
          font-family: 'Cinzel', serif;
          font-size: 1.3rem;
          color: var(--gold-light);
          margin-bottom: 8px;
        }
        .saved-meta { font-size: 13px; color: rgba(200,220,255,0.55); margin-bottom: 16px; }
        .action-row { display: flex; gap: 8px; }
        .action-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          transition: all .25s;
          font-family: 'Lato', sans-serif;
          font-weight: 600;
        }
        .action-btn.outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(200,220,255,0.7);
        }
        .action-btn.outline:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); color: #fff; }
        .action-btn.primary {
          background: linear-gradient(135deg, rgba(59,130,246,0.3), rgba(29,78,216,0.2));
          border: 1px solid rgba(59,130,246,0.4);
          color: #93c5fd;
        }
        .action-btn.primary:hover { background: linear-gradient(135deg, rgba(59,130,246,0.45), rgba(29,78,216,0.3)); box-shadow: 0 4px 20px rgba(59,130,246,0.25); }

        /* ── FORM PANEL ── */
        .form-panel {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity .8s ease .3s, transform .8s ease .3s;
        }
        .form-panel.visible { opacity: 1; transform: translateY(0); }

        .form-header { margin-bottom: 32px; }
        .form-title {
          font-family: 'Cinzel', serif;
          font-size: 1.8rem;
          color: var(--gold-light);
          margin-bottom: 6px;
        }
        .form-subtitle { font-size: 14px; color: rgba(200,220,255,0.55); }

        /* Name input */
        .field-group { margin-bottom: 28px; }
        .field-label {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: rgba(200,220,255,0.55);
          margin-bottom: 10px;
        }
        .field-label .edit-link {
          color: var(--gold);
          cursor: pointer;
          font-size: 12px;
          text-transform: none;
          letter-spacing: 0;
          transition: color .2s;
        }
        .field-label .edit-link:hover { color: var(--gold-light); text-decoration: underline; }

        .text-input {
          width: 100%;
          padding: 14px 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #fff;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          outline: none;
          transition: all .25s;
        }
        .text-input::placeholder { color: rgba(200,220,255,0.25); }
        .text-input:focus {
          border-color: var(--blue-glow);
          background: rgba(59,130,246,0.08);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }
        .text-input:read-only {
          color: rgba(200,220,255,0.4);
          cursor: not-allowed;
        }

        .name-error {
          margin-top: 8px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          font-size: 13px;
          color: #fca5a5;
          display: flex; align-items: center; gap: 8px;
        }

        /* ── EXPECTATION CARDS ── */
        .expectations-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .expectations-title {
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          color: rgba(200,220,255,0.9);
        }
        .add-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 18px;
          background: linear-gradient(135deg, rgba(201,162,39,0.2), rgba(240,208,96,0.12));
          border: 1px solid rgba(201,162,39,0.4);
          border-radius: 10px;
          color: var(--gold-light);
          font-size: 13px;
          cursor: pointer;
          transition: all .25s;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
        }
        .add-btn:hover {
          background: linear-gradient(135deg, rgba(201,162,39,0.35), rgba(240,208,96,0.2));
          box-shadow: 0 4px 20px rgba(201,162,39,0.25);
          transform: translateY(-1px);
        }

        .exp-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all .3s ease;
          position: relative;
          overflow: hidden;
        }
        .exp-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: var(--cat-color, var(--gold));
          border-radius: 3px 0 0 3px;
          transition: width .3s;
        }
        .exp-card:focus-within {
          border-color: var(--cat-color, rgba(255,255,255,0.2));
          background: rgba(255,255,255,0.06);
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        }
        .exp-card:focus-within::before { width: 4px; }

        .exp-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .exp-number {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, var(--cat-color, var(--gold)), rgba(255,255,255,0.2));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .exp-header-left { display: flex; align-items: center; }

        .cat-select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(200,220,255,0.8);
          font-size: 13px;
          padding: 6px 10px;
          cursor: pointer;
          outline: none;
          font-family: 'Lato', sans-serif;
          transition: all .2s;
        }
        .cat-select:focus { border-color: var(--blue-glow); }

        .remove-btn {
          background: transparent;
          border: 1px solid rgba(239,68,68,0.2);
          color: rgba(239,68,68,0.5);
          width: 28px; height: 28px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
          flex-shrink: 0;
        }
        .remove-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.5); color: #f87171; }

        .exp-textarea {
          width: 100%;
          min-height: 100px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #e2e8f0;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          transition: all .25s;
        }
        .exp-textarea::placeholder { color: rgba(200,220,255,0.2); }
        .exp-textarea:focus {
          border-color: var(--blue-glow);
          background: rgba(59,130,246,0.06);
        }

        .exp-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .cat-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .05em;
          background: var(--cat-bg, rgba(255,255,255,0.08));
          color: var(--cat-color, rgba(200,220,255,0.7));
        }
        .char-count { font-size: 11px; color: rgba(200,220,255,0.3); }

        /* Add more button full width */
        .add-full-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(255,255,255,0.12);
          border-radius: 12px;
          color: rgba(200,220,255,0.4);
          font-size: 14px;
          cursor: pointer;
          transition: all .25s;
          margin-top: 4px;
          font-family: 'Lato', sans-serif;
        }
        .add-full-btn:hover {
          background: rgba(201,162,39,0.06);
          border-color: rgba(201,162,39,0.3);
          color: var(--gold);
        }

        /* ── SAVE BUTTON ── */
        .save-section {
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .btn-row { display: flex; gap: 12px; }
        .save-btn {
          flex: 2;
          padding: 16px;
          background: linear-gradient(135deg, #1d4ed8, #2563eb, #1d4ed8);
          background-size: 200% 200%;
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Cinzel', serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: .08em;
          cursor: pointer;
          transition: all .3s;
          box-shadow: 0 6px 30px rgba(29,78,216,0.4);
          position: relative;
          overflow: hidden;
          animation: shimmer 3s linear infinite;
        }
        .save-btn::before {
          content: '';
          position: absolute;
          top: -50%; left: -60%;
          width: 50%; height: 200%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg);
          animation: shimmerSlide 3s ease-in-out infinite;
        }
        @keyframes shimmerSlide {
          0%   { left: -60%; }
          100% { left: 120%; }
        }
        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(29,78,216,0.55);
        }
        .save-btn:disabled {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(200,220,255,0.25);
          cursor: not-allowed;
          box-shadow: none;
          transform: none;
          animation: none;
        }
        .save-btn:disabled::before { display: none; }

        .clear-btn {
          flex: 1;
          padding: 16px;
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          color: rgba(248,113,113,0.8);
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all .25s;
        }
        .clear-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.4); color: #f87171; }

        .delete-link {
          display: block;
          margin-top: 14px;
          font-size: 12px;
          color: rgba(248,113,113,0.5);
          cursor: pointer;
          transition: color .2s;
          text-align: center;
          background: none; border: none; width: 100%;
          font-family: 'Lato', sans-serif;
        }
        .delete-link:hover { color: #f87171; text-decoration: underline; }

        /* ── MINI STATS BAR ── */
        .mini-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }
        .mini-stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all .3s;
        }
        .mini-stat:hover { background: rgba(201,162,39,0.07); border-color: rgba(201,162,39,0.2); }
        .mini-stat-num {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mini-stat-label { font-size: 10px; color: rgba(200,220,255,0.4); text-transform: uppercase; letter-spacing: .1em; margin-top: 2px; }

        /* ── TOAST ── */
        .toast {
          position: fixed;
          top: 80px;
          right: 24px;
          z-index: 9999;
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Lato', sans-serif;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          animation: slideInToast .4s cubic-bezier(0.175,0.885,0.32,1.275);
          max-width: 340px;
        }
        @keyframes slideInToast {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .toast-icon {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        /* ── PREVIEW MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn .25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .modal {
          background: linear-gradient(160deg, #0d1842, #0a1535);
          border: 1px solid rgba(201,162,39,0.2);
          border-radius: 20px;
          width: 100%; max-width: 640px;
          max-height: 88vh;
          overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(201,162,39,0.08);
          animation: scaleIn .3s cubic-bezier(0.175,0.885,0.32,1.275);
        }
        @keyframes scaleIn {
          from { transform: scale(0.88); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          padding: 24px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .modal-title {
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          color: var(--gold-light);
        }
        .modal-close {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(200,220,255,0.7);
          width: 36px; height: 36px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          transition: all .2s;
        }
        .modal-close:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171; }

        .modal-body { flex: 1; overflow-y: auto; padding: 24px 28px; }
        .preview-name {
          font-family: 'Cinzel', serif;
          font-size: 1.6rem;
          color: var(--gold-light);
          margin-bottom: 4px;
        }
        .preview-meta { font-size: 13px; color: rgba(200,220,255,0.45); margin-bottom: 20px; }
        .preview-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .preview-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .preview-num {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--cat-color, var(--gold));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
        }
        .preview-text { font-size: 14px; color: rgba(200,220,255,0.8); line-height: 1.65; white-space: pre-wrap; }

        .modal-footer {
          padding: 18px 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; gap: 10px;
          flex-shrink: 0;
        }

        /* ── FOOTER ── */
        .sm-footer {
          background: linear-gradient(to bottom, #0a0e2e, #060a1a);
          border-top: 1px solid rgba(201,162,39,0.15);
          padding: 60px 24px 40px;
        }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-verse {
          text-align: center;
          font-style: italic;
          color: rgba(200,220,255,0.5);
          font-size: 1rem;
          max-width: 600px;
          margin: 0 auto 50px;
          line-height: 1.8;
        }
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-bottom: 40px; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 28px; } }
        .footer-col-title {
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          color: var(--gold);
          letter-spacing: .1em;
          margin-bottom: 14px;
        }
        .footer-link {
          display: block;
          font-size: 13px;
          color: rgba(200,220,255,0.45);
          text-decoration: none;
          margin-bottom: 8px;
          transition: color .2s;
        }
        .footer-link:hover { color: rgba(200,220,255,0.8); }
        .footer-copy {
          text-align: center;
          font-size: 12px;
          color: rgba(200,220,255,0.25);
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* Social icons row */
        .social-row { display: flex; gap: 10px; margin-top: 6px; }
        .social-link {
          width: 34px; height: 34px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(200,220,255,0.45);
          text-decoration: none;
          transition: all .2s;
          font-size: 14px;
        }
        .social-link:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,162,39,0.08); }
      `}</style>

      {/* ── PARTICLE BURST ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        {particles.map((p) => (
          <Particle
            key={p.id}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              "--dur": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div
          className="toast"
          style={{ background: toastColors[toast.type]?.bg }}
        >
          <div className="toast-icon">{toastColors[toast.type]?.icon}</div>
          {toast.message}
        </div>
      )}

      {/* ── NAV ── */}
      <nav className="sm-nav">
        <div className="nav-logo">
          <img
            src="https://smhos.org/wp-content/uploads/2023/03/SMHOS-Logo-White.png"
            alt="Salvation Ministries"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="nav-title">Salvation Ministries</span>
        </div>
        <div className="nav-links">
          <Link href="/contact" style={{ textDecoration: "none" }}>
            <button className="nav-btn">Contact</button>
          </Link>
          <button className="nav-btn gold" onClick={handlePrint}>
            ↓ Print
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="sm-hero">
        {/* Stars */}
        <div className="stars-layer">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                "--tw-dur": `${Math.random() * 3 + 2}s`,
                "--tw-delay": `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Light beams */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="beam"
            style={{
              left: `${10 + i * 12}%`,
              top: 0,
              "--b-height": `${150 + Math.random() * 200}px`,
              "--b-dur": `${3 + Math.random() * 3}s`,
              "--b-delay": `${i * 0.5}s`,
            }}
          />
        ))}

        <div className={`hero-inner ${heroVisible ? "visible" : ""}`}>
          <div className="hero-badge">✦ Glory Reign 2026 ✦</div>
          <h1 className="hero-title">
            2026 Expectation
            <br />
            Form
          </h1>
          <p className="hero-sub">Salvation Ministries</p>
          <p className="hero-verse">
            "For surely there is an end; And thine expectation shall not be cut
            off."
            <br />
            <strong>— Proverbs 23:18 (KJV)</strong>
          </p>
        </div>

        <svg
          className="hero-wave"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="var(--blue-deep)"
          />
        </svg>
      </section>

      {/* ── MAIN ── */}
      <main className="sm-main">
        {/* ─── SIDEBAR ─── */}
        <aside>
          {/* Stats */}
          <div className="glass-card">
            <div className="card-section-title">✦ Overview</div>
            <div className="stat-grid">
              <div className="stat-item">
                <div className="stat-num">
                  <AnimatedNumber value={expectations.length} />
                </div>
                <div className="stat-label">Expectations</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">
                  <AnimatedNumber
                    value={new Set(expectations.map((e) => e.category)).size}
                  />
                </div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item" style={{ gridColumn: "span 2" }}>
                <div className="stat-num" style={{ fontSize: "1.2rem" }}>
                  {hasSaved ? "✓ Saved" : "Draft"}
                </div>
                <div className="stat-label">Status</div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="glass-card" style={{ marginTop: "16px" }}>
            <div className="card-section-title">◎ How It Works</div>
            {[
              "Enter your full name in the form",
              "Write your expectations for 2026",
              "Choose a category for each one",
              "Save and update anytime",
            ].map((s, i) => (
              <div className="step-item" key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-text">{s}</div>
              </div>
            ))}
          </div>

          {/* PDF Download */}
          <div className="pdf-card">
            <div
              style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
            >
              <div style={{ fontSize: "28px" }}>📄</div>
              <div>
                <div
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "0.95rem",
                    color: "#86efac",
                    marginBottom: "4px",
                  }}
                >
                  Prefer Paper?
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "rgba(200,220,255,0.55)",
                    lineHeight: "1.5",
                  }}
                >
                  Download and fill the printable PDF form by hand.
                </div>
              </div>
            </div>
            <a
              href="/assets/EXPECTATION%20FORM-DxWKm-Io.pdf"
              download="Salvation-Ministries-2026-Expectation-Form.pdf"
              className="pdf-btn"
            >
              ↓ Download PDF Form
            </a>
          </div>

          {/* Saved Summary */}
          {hasSaved && savedData && (
            <div className="saved-card">
              <div
                className="card-section-title"
                style={{ marginBottom: "12px" }}
              >
                ✓ Submitted
              </div>
              <div className="saved-name">{savedData.name}</div>
              <div className="saved-meta">
                Updated{" "}
                {new Date(savedData.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="action-row">
                <button className="action-btn outline" onClick={handlePrint}>
                  ↓ Print
                </button>
                <button
                  className="action-btn primary"
                  onClick={() => setShowPreview(true)}
                >
                  ◎ Preview
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* ─── FORM PANEL ─── */}
        <div className={`form-panel ${formVisible ? "visible" : ""}`}>
          <div className="glass-card">
            <div className="form-header">
              <h2 className="form-title">
                {hasSaved
                  ? "Edit Your Expectations"
                  : "Share Your Expectations"}
              </h2>
              <p className="form-subtitle">
                {hasSaved
                  ? "Update your 2026 expectations below"
                  : "What do you expect God to do for you in 2026?"}
              </p>
            </div>

            {/* Name */}
            <div className="field-group">
              <div className="field-label">
                <span>Your Name</span>
                {hasSaved && (
                  <span
                    className="edit-link"
                    onClick={() => setIsEditingName(!isEditingName)}
                  >
                    {isEditingName ? "💾 Save Name" : "✏ Edit Name"}
                  </span>
                )}
              </div>
              <input
                type="text"
                className="text-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                readOnly={hasSaved && !isEditingName}
              />
              {!name.trim() && (
                <div className="name-error">
                  <span>⚠</span>
                  <span>
                    Name is required to {hasSaved ? "update" : "create"} your
                    form
                  </span>
                </div>
              )}
            </div>

            {/* Expectations */}
            <div className="expectations-header">
              <div className="expectations-title">
                My Expectations ({expectations.length})
              </div>
              <button className="add-btn" onClick={addExpectation}>
                + Add Expectation
              </button>
            </div>

            {expectations.map((exp, idx) => {
              const cat = getCat(exp.category);
              return (
                <div
                  key={exp.id}
                  className="exp-card"
                  style={{ "--cat-color": cat.color, "--cat-bg": cat.bg }}
                  onFocus={() => setActiveCard(exp.id)}
                  onBlur={() => setActiveCard(null)}
                >
                  <div className="exp-card-header">
                    <div className="exp-header-left">
                      <div className="exp-number">{idx + 1}</div>
                      <select
                        className="cat-select"
                        value={exp.category}
                        onChange={(e) => updateCategory(exp.id, e.target.value)}
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {expectations.length > 1 && (
                      <button
                        className="remove-btn"
                        onClick={() => removeExpectation(exp.id)}
                        title="Remove"
                      >
                        −
                      </button>
                    )}
                  </div>
                  <textarea
                    className="exp-textarea"
                    value={exp.text}
                    onChange={(e) => updateText(exp.id, e.target.value)}
                    placeholder={`Describe your ${cat.label.toLowerCase()} expectation for 2026...`}
                    rows={4}
                  />
                  <div className="exp-footer">
                    <span className="cat-badge">{cat.label}</span>
                    <span className="char-count">{exp.text.length} chars</span>
                  </div>
                </div>
              );
            })}

            <button className="add-full-btn" onClick={addExpectation}>
              + Add Another Expectation
            </button>

            {/* Mini stats */}
            <div className="mini-stats">
              <div className="mini-stat">
                <div className="mini-stat-num">
                  <AnimatedNumber value={expectations.length} />
                </div>
                <div className="mini-stat-label">Written</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-num">
                  <AnimatedNumber
                    value={new Set(expectations.map((e) => e.category)).size}
                  />
                </div>
                <div className="mini-stat-label">Categories</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-num">
                  <AnimatedNumber
                    value={expectations.filter((e) => e.text.trim()).length}
                  />
                </div>
                <div className="mini-stat-label">Complete</div>
              </div>
            </div>

            {/* Save */}
            <div className="save-section">
              <div className="btn-row">
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={!name.trim()}
                >
                  {hasSaved ? "Update Expectations" : "Save Expectations"}
                </button>
                <button
                  className="clear-btn"
                  onClick={() => {
                    setName("");
                    setSavedData(null);
                    setHasSaved(false);
                    setIsEditingName(false);
                    setExpectations([
                      {
                        id: Date.now().toString(),
                        text: "",
                        category: "spiritual",
                        createdAt: new Date().toISOString(),
                      },
                    ]);
                    showToast("info", "Form cleared");
                  }}
                >
                  Clear
                </button>
              </div>
              {hasSaved && (
                <button className="delete-link" onClick={handleDelete}>
                  Delete all saved expectations
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── PREVIEW MODAL ── */}
      {showPreview && savedData && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowPreview(false)}
        >
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">◎ Your Expectations Preview</span>
              <button
                className="modal-close"
                onClick={() => setShowPreview(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="preview-name">{savedData.name}</div>
              <div className="preview-meta">
                {savedData.expectations.length} expectations · Updated{" "}
                {new Date(savedData.updatedAt).toLocaleDateString()}
              </div>
              <div
                style={{
                  background: "rgba(201,162,39,0.06)",
                  border: "1px solid rgba(201,162,39,0.18)",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "0 10px 10px 0",
                  padding: "12px 16px",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: "rgba(200,220,255,0.6)",
                  marginBottom: "20px",
                  lineHeight: "1.7",
                }}
              >
                "For surely there is an end; And thine expectation shall not be
                cut off." — Proverbs 23:18
              </div>
              {savedData.expectations.map((exp, i) => {
                const cat = getCat(exp.category);
                return (
                  <div
                    key={exp.id}
                    className="preview-card"
                    style={{ "--cat-color": cat.color }}
                  >
                    <div className="preview-card-header">
                      <div
                        className="preview-num"
                        style={{ background: cat.color }}
                      >
                        {i + 1}
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: cat.color,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: ".08em",
                        }}
                      >
                        {cat.label}
                      </span>
                    </div>
                    <div className="preview-text">{exp.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button
                className="save-btn"
                style={{ flex: "1" }}
                onClick={handlePrint}
              >
                ↓ Download & Print
              </button>
              <button
                className="clear-btn"
                style={{ flex: "none", padding: "16px 20px" }}
                onClick={() => setShowPreview(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="sm-footer">
        <div className="footer-inner">
          <p className="footer-verse">
            "For surely there is an end; And thine expectation shall not be cut
            off."
            <br />
            <strong style={{ color: "var(--gold)", fontStyle: "normal" }}>
              — Proverbs 23:18 (KJV)
            </strong>
          </p>
          <div className="footer-grid">
            <div>
              <div className="footer-col-title">Salvation Ministries</div>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(200,220,255,0.4)",
                  lineHeight: "1.6",
                  marginBottom: "14px",
                }}
              >
                Bringing hope and transformation to communities worldwide.
              </p>
              <div className="social-row">
                <a
                  href="https://www.facebook.com/smhosglobal"
                  className="social-link"
                  title="Facebook"
                >
                  f
                </a>
                <a
                  href="https://www.instagram.com/smhosglobal/"
                  className="social-link"
                  title="Instagram"
                >
                  in
                </a>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Contact</div>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(200,220,255,0.4)",
                  lineHeight: "1.9",
                }}
              >
                Email: info@smhos.org
                <br />
                Phone: +234 (803) 312 3743
                <br />
                Hours: Mon–Fri, 9am–4pm
              </p>
            </div>
            <div>
              <div className="footer-col-title">Quick Links</div>
              {[
                ["Home", "/"],
                ["Find a Branch", "/locator"],
                ["Contact Us", "/contact"],
              ].map(([label, url]) => (
                <a key={label} href={url} className="footer-link">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-copy">
            © 2026 Salvation Ministries. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
