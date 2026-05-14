import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const EVENTS = [
  {
    id: 1,
    day: "02",
    mon: "MAY",
    weekday: "SAT",
    year: "2026",
    name: "Global Mass Evangelism",
    time: "All Day",
    timeEnd: null,
    isAllDay: true,
    venue: null,
    address: null,
    category: "Evangelism",
    img: "https://smhos.org/wp-content/uploads/2026/04/GME-IG-may.png",
    href: "https://smhos.org/event/global-mass-evangelism-4/",
    about:
      "Join Salvation Ministries as we go into the streets, communities, and public spaces with the life-changing Gospel of Jesus Christ. Global Mass Evangelism is a Spirit-led outreach that spans across all our branches worldwide — one day, one mission, one heart.",
  },
  {
    id: 2,
    day: "03",
    mon: "MAY",
    weekday: "SUN",
    year: "2026",
    name: "Mountain Moving Praise",
    time: "6:30 AM",
    timeEnd: "2:00 PM",
    isAllDay: false,
    venue: "Salvation Ministries HQ, And All Her Branches Globally.",
    address: "Plot 17, Birabi Street, Port Harcourt, Rivers, Nigeria",
    category: "Sunday Service",
    img: "https://smhos.org/wp-content/uploads/2026/04/Sun-3rd-May-2026-IG.png",
    href: "https://smhos.org/event/mountain-moving-praise/",
    about:
      "Experience a powerful Sunday of exuberant praise and worship that moves mountains. This service is a celebration of faith where every voice unites in glory. Come expecting a breakthrough — God inhabits the praises of His people. All branches participating simultaneously across the globe.",
  },
  {
    id: 3,
    day: "05",
    mon: "MAY",
    weekday: "TUE",
    year: "2026",
    name: "May Week Of Spiritual Renewal",
    time: "5:00 PM",
    timeEnd: "8:00 PM",
    isAllDay: false,
    venue: "Salvation Ministries HQ, And All Her Branches Globally.",
    address: "Plot 17, Birabi Street, Port Harcourt, Rivers, Nigeria",
    category: "Week of Renewal",
    img: "https://smhos.org/wp-content/uploads/2026/04/WOSR-MAY-IG-scaled.png",
    href: "https://smhos.org/event/may-week-of-spiritual-renewal/",
    about:
      "The Week of Spiritual Renewal is a dedicated season of intensive prayer, deep worship, and the Word — designed to refresh your spirit and reignite your passion for God. Running across multiple evenings, each session carries a fresh impartation from Heaven.",
  },
  {
    id: 4,
    day: "10",
    mon: "MAY",
    weekday: "SUN",
    year: "2026",
    name: "Global Anointing Service",
    time: "5:00 PM",
    timeEnd: "8:00 PM",
    isAllDay: false,
    venue: "Salvation Ministries HQ, And All Her Branches Globally.",
    address: "Plot 17, Birabi Street, Port Harcourt, Rivers, Nigeria",
    category: "Sunday Service",
    img: "https://smhos.org/wp-content/uploads/2026/04/Global-Anointing-Service-IG.png",
    href: "https://smhos.org/event/global-anointing-service/",
    about:
      "The Global Anointing Service is a special service of consecration and divine impartation. Under the leadership of Pastor David Ibiyeomie, the Holy Spirit moves in healing, restoration, and a fresh anointing for every believer. Come ready to receive and be transformed.",
  },
];

const MONTHS = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getEventDate(ev) {
  return new Date(parseInt(ev.year), MONTHS[ev.mon], parseInt(ev.day));
}
function getStatus(ev) {
  const evDate = getEventDate(ev);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (evDate < today) return "past";
  if (evDate.getTime() === today.getTime()) return "today";
  return "upcoming";
}
function getCountdown(ev) {
  const evDate = getEventDate(ev);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((evDate - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Happening today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1) return `In ${diff} days`;
  if (diff === -1) return "1 day ago";
  return `${Math.abs(diff)} days ago`;
}
function getDuration(start, end) {
  try {
    const parse = (t) => {
      const [time, mod] = t.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (!m) m = 0;
      if (mod === "PM" && h !== 12) h += 12;
      if (mod === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };
    const diff = parse(end) - parse(start);
    const hrs = Math.floor(diff / 60),
      mins = diff % 60;
    return hrs > 0 ? `${hrs}h${mins > 0 ? " " + mins + "m" : ""}` : `${mins}m`;
  } catch {
    return "";
  }
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #07060E;
  --void: #0A0912;
  --dusk: #100F1C;
  --panel: #13121F;
  --card: #1A1927;
  --lift: #211F31;
  --gold: #C9A84C;
  --gold2: #DDB96A;
  --gold3: #F0D08C;
  --gold4: #FFF3C4;
  --border: rgba(201,168,76,0.15);
  --border2: rgba(201,168,76,0.35);
  --border3: rgba(201,168,76,0.55);
  --white: #FDFBF6;
  --cream: #F0E8D5;
  --muted: #7A7265;
  --dim: #4A4540;
  --green: #4ade80;
  --green-bg: rgba(74,222,128,0.1);
  --green-border: rgba(74,222,128,0.25);
  --ff-display: 'Bebas Neue', sans-serif;
  --ff-serif: 'Cormorant Garamond', serif;
  --ff-ui: 'DM Sans', sans-serif;
  --ease: cubic-bezier(0.16,1,0.3,1);
  --ease2: cubic-bezier(0.76,0,0.24,1);
}

html, body { background: var(--void); color: var(--white); font-family: var(--ff-ui); }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

.app {
  min-height: 100vh;
  background: var(--void);
  position: relative;
}
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 20% 10%, rgba(201,168,76,0.04) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 90%, rgba(100,70,200,0.03) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* ── HEADER ── */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: rgba(10,9,18,0.88);
  border-bottom: 1px solid var(--border);
  padding: 0 clamp(20px, 5vw, 60px);
}
.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
  gap: 14px;
}
.logo-mark {
  width: 38px;
  height: 38px;
  border: 1px solid var(--border2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.logo-mark::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--border);
}
.logo-mark span {
  font-family: var(--ff-display);
  font-size: 16px;
  color: var(--gold);
  letter-spacing: 0.05em;
}
.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.logo-name {
  font-family: var(--ff-display);
  font-size: 15px;
  letter-spacing: 0.25em;
  color: var(--white);
}
.logo-tag {
  font-family: var(--ff-ui);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.7;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.header-tag {
  font-family: var(--ff-ui);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── PAGE ── */
.page {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(32px,6vw,72px) clamp(16px,5vw,60px);
}

/* ── HERO TEXT ── */
.hero {
  margin-bottom: clamp(40px, 6vw, 72px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--ff-ui);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--gold);
}
.hero-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--gold);
  opacity: 0.5;
}
.hero-title {
  font-family: var(--ff-display);
  font-size: clamp(52px, 8vw, 110px);
  line-height: 0.9;
  letter-spacing: 0.04em;
  color: var(--white);
}
.hero-title em {
  color: var(--gold2);
  font-style: normal;
}
.hero-sub {
  font-family: var(--ff-serif);
  font-size: clamp(15px, 1.8vw, 19px);
  font-style: italic;
  color: var(--muted);
  max-width: 460px;
  line-height: 1.7;
}
.hero-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}
.hero-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border2), transparent);
  max-width: 200px;
}
.hero-divider-gem {
  width: 6px;
  height: 6px;
  background: var(--gold);
  transform: rotate(45deg);
  opacity: 0.6;
}

/* ── EVENT LIST ── */
.ev-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ev-item {
  display: grid;
  grid-template-columns: 80px 1fr;
  border: 1px solid var(--border);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.35s, transform 0.3s var(--ease), box-shadow 0.35s;
  background: var(--panel);
}
.ev-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--gold), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.ev-item:hover { border-color: var(--border2); box-shadow: 0 12px 40px rgba(0,0,0,0.5); transform: translateY(-1px); }
.ev-item:hover::before { opacity: 1; }
.ev-item:active { transform: translateY(0); }

.ev-item-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 10px;
  border-right: 1px solid var(--border);
  background: rgba(201,168,76,0.025);
  transition: background 0.3s;
  gap: 4px;
}
.ev-item:hover .ev-item-date { background: rgba(201,168,76,0.06); }
.ev-date-day { font-family: var(--ff-display); font-size: 44px; line-height: 1; color: var(--gold); }
.ev-date-mon { font-family: var(--ff-ui); font-size: 7px; font-weight: 700; letter-spacing: 0.45em; text-transform: uppercase; color: var(--muted); }
.ev-date-wk { font-family: var(--ff-ui); font-size: 6px; font-weight: 600; letter-spacing: 0.35em; text-transform: uppercase; color: var(--dim); margin-top: 3px; }

.ev-item-main {
  display: flex;
  align-items: stretch;
  min-height: 0;
}
.ev-item-img {
  flex-shrink: 0;
  width: 110px;
  overflow: hidden;
  position: relative;
}
.ev-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.55) saturate(0.6);
  transition: filter 0.5s, transform 0.5s;
}
.ev-item:hover .ev-item-img img { filter: brightness(0.45) saturate(0.7); transform: scale(1.04); }

.ev-item-body {
  flex: 1;
  padding: clamp(18px,3vw,28px) clamp(18px,3vw,32px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}
.ev-cat {
  font-family: var(--ff-ui);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.8;
}
.ev-name {
  font-family: var(--ff-display);
  font-size: clamp(22px, 2.8vw, 34px);
  line-height: 1.05;
  letter-spacing: 0.04em;
  color: var(--white);
  transition: color 0.3s;
}
.ev-item:hover .ev-name { color: var(--gold3); }
.ev-time {
  font-family: var(--ff-ui);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}
.ev-item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding: clamp(14px,2vw,28px) clamp(14px,2vw,28px);
  gap: 12px;
  flex-shrink: 0;
}

/* STATUS PILLS */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--ff-ui);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;
}
.pill-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pill.upcoming { background: rgba(201,168,76,0.1); color: var(--gold3); border: 1px solid rgba(201,168,76,0.25); }
.pill.upcoming .pill-dot { background: var(--gold); box-shadow: 0 0 6px var(--gold); }
.pill.today { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
.pill.today .pill-dot { background: var(--green); box-shadow: 0 0 6px var(--green); animation: blink 1.4s ease-in-out infinite; }
.pill.past { background: rgba(120,112,100,0.1); color: var(--muted); border: 1px solid rgba(120,112,100,0.2); }
.pill.past .pill-dot { background: var(--dim); }
@keyframes blink { 0%,100%{opacity:1}50%{opacity:0.3} }

.ev-arrow {
  color: var(--gold);
  font-size: 18px;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.3s, transform 0.3s;
}
.ev-item:hover .ev-arrow { opacity: 1; transform: translateX(0); }

/* ── OVERLAY ── */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(5,4,12,0.82);
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.45s var(--ease);
}
.overlay.open { opacity: 1; pointer-events: all; }

/* ── DETAIL PANEL ── */
.detail {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  z-index: 600;
  width: min(740px, 100vw);
  background: var(--dusk);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.55s var(--ease);
  overflow-y: auto;
}
.detail::-webkit-scrollbar { width: 3px; }
.detail::-webkit-scrollbar-thumb { background: var(--gold); }
.detail.open { transform: translateX(0); }

/* panel top bar */
.detail-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 28px;
  background: rgba(10,9,18,0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.detail-bar-crumb { font-family: var(--ff-ui); font-size: 9px; font-weight: 600; letter-spacing: 0.4em; text-transform: uppercase; color: var(--muted); }
.detail-bar-logo { font-family: var(--ff-display); font-size: 15px; letter-spacing: 0.35em; color: var(--gold); opacity: 0.6; }
.detail-close {
  width: 42px; height: 42px;
  background: rgba(201,168,76,0.06);
  border: 1px solid var(--border);
  color: var(--gold3);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.25s;
}
.detail-close:hover { background: rgba(201,168,76,0.14); border-color: var(--gold); }

/* hero */
.detail-img-wrap {
  position: relative;
  aspect-ratio: 16/8;
  overflow: hidden;
  flex-shrink: 0;
}
.detail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45) saturate(0.55);
  transition: filter 1s;
}
.detail-img.loaded { filter: brightness(0.52) saturate(0.65); }
.detail-img-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--dusk) 0%, rgba(10,9,18,0.4) 45%, transparent 100%);
}
.detail-badge {
  position: absolute;
  top: 20px; left: 20px;
  font-family: var(--ff-ui);
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.42em;
  text-transform: uppercase;
  padding: 7px 14px;
  background: rgba(5,4,12,0.78);
  border: 1px solid var(--border);
  color: var(--gold3);
  backdrop-filter: blur(10px);
}
.detail-date-box {
  position: absolute;
  top: 20px; right: 20px;
  background: rgba(5,4,12,0.84);
  border: 1px solid var(--border2);
  padding: 14px 18px;
  text-align: center;
  backdrop-filter: blur(14px);
}
.detail-date-day { font-family: var(--ff-display); font-size: 54px; line-height: 1; color: var(--gold); }
.detail-date-mon { font-family: var(--ff-ui); font-size: 8px; font-weight: 700; letter-spacing: 0.45em; text-transform: uppercase; color: var(--muted); margin-top: 3px; }
.detail-date-yr { font-family: var(--ff-ui); font-size: 7px; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--dim); margin-top: 5px; }

/* corner ornaments */
.c-orn { position: absolute; pointer-events: none; }
.c-orn.tl { top: 10px; left: 10px; width: 22px; height: 22px; border-top: 1px solid var(--border2); border-left: 1px solid var(--border2); }
.c-orn.br { bottom: 10px; right: 10px; width: 22px; height: 22px; border-bottom: 1px solid var(--border2); border-right: 1px solid var(--border2); }

/* content */
.detail-content { padding: clamp(28px, 5vw, 44px) clamp(20px, 5vw, 40px) 64px; flex: 1; }

.detail-status-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}
.detail-countdown {
  font-family: var(--ff-ui);
  font-size: 9px; font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--muted);
}

.detail-title {
  font-family: var(--ff-display);
  font-size: clamp(38px, 6.5vw, 70px);
  line-height: 0.93;
  letter-spacing: 0.04em;
  color: var(--white);
  margin-bottom: 10px;
}
.detail-sub {
  font-family: var(--ff-serif);
  font-size: 15px;
  font-style: italic;
  color: var(--muted);
  margin-bottom: 34px;
}

.detail-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--border2), rgba(201,168,76,0.04), transparent);
  margin: 26px 0;
}

/* info grid */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
}
.info-block {
  background: rgba(201,168,76,0.03);
  border: 1px solid var(--border);
  padding: 20px 22px;
  position: relative;
  overflow: hidden;
}
.info-block::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 30px; height: 30px;
  border-bottom: 1px solid var(--border);
  border-left: 1px solid var(--border);
  opacity: 0.5;
}
.info-label { font-family: var(--ff-ui); font-size: 7px; font-weight: 700; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(201,168,76,0.45); margin-bottom: 10px; }
.info-value { font-family: var(--ff-ui); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; color: var(--gold3); }
.info-sub { font-family: var(--ff-serif); font-size: 12px; font-style: italic; color: var(--muted); margin-top: 6px; line-height: 1.6; }

/* venue */
.venue-block {
  background: rgba(201,168,76,0.025);
  border: 1px solid var(--border);
  border-left: 2px solid var(--gold);
  padding: 22px 24px;
  margin-bottom: 26px;
}
.venue-icon { font-size: 14px; color: var(--gold); margin-bottom: 10px; }
.venue-name { font-family: var(--ff-ui); font-size: 13px; font-weight: 600; letter-spacing: 0.12em; color: var(--white); margin-bottom: 6px; }
.venue-addr { font-family: var(--ff-serif); font-size: 13px; font-style: italic; color: var(--muted); line-height: 1.7; }

/* about */
.about-label {
  font-family: var(--ff-ui);
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--gold);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.about-label::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }
.about-text {
  font-family: var(--ff-serif);
  font-size: 15px;
  color: rgba(253,251,246,0.68);
  line-height: 2;
  font-style: italic;
}

/* actions */
.action-group { display: flex; flex-direction: column; gap: 10px; margin-top: 34px; }
.action-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 19px 22px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--white);
  text-decoration: none;
  cursor: pointer;
  font-family: var(--ff-ui);
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}
.action-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(201,168,76,0.04));
  opacity: 0;
  transition: opacity 0.3s;
}
.action-btn:hover::before { opacity: 1; }
.action-btn.primary { background: linear-gradient(130deg, var(--gold2), var(--gold)); color: var(--ink); border-color: var(--gold); font-weight: 800; }
.action-btn.primary:hover { box-shadow: 0 6px 32px rgba(201,168,76,0.4); transform: translateY(-1px); }
.action-btn.secondary:hover { border-color: var(--gold); background: rgba(201,168,76,0.07); color: var(--gold3); }
.action-btn.ghost { border-color: var(--dim); color: var(--muted); }
.action-btn.ghost:hover { border-color: var(--border2); color: var(--white); }
.action-icon { font-size: 15px; transition: transform 0.3s; }
.action-btn:hover .action-icon { transform: translateX(4px); }

/* share */
.share-row { display: flex; align-items: center; gap: 10px; margin-top: 22px; }
.share-label { font-family: var(--ff-ui); font-size: 8px; font-weight: 600; letter-spacing: 0.4em; text-transform: uppercase; color: var(--muted); }
.share-btn {
  width: 36px; height: 36px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-family: var(--ff-ui);
  font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s;
}
.share-btn:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.06); }

/* ── RESPONSIVE ── */
@media (max-width: 680px) {
  .ev-item { grid-template-columns: 64px 1fr; }
  .ev-item-img { width: 80px; }
  .ev-date-day { font-size: 34px; }
  .ev-item-body { padding: 14px 14px; }
  .ev-name { font-size: 20px; }
  .ev-item-right { padding: 14px 12px; }
  .ev-arrow { display: none; }
  .detail-grid { grid-template-columns: 1fr; }
  .detail-content { padding: 24px 18px 48px; }
  .detail-bar { padding: 14px 18px; }
}
@media (max-width: 480px) {
  .ev-item-img { display: none; }
  .hero-title { font-size: 52px; }
  .detail-date-day { font-size: 40px; }
  .detail-title { font-size: 38px; }
  .logo-text { display: none; }
}
@media (max-width: 360px) {
  .ev-item { grid-template-columns: 56px 1fr; }
  .ev-date-day { font-size: 28px; }
  .ev-item-body { padding: 12px 10px; }
  .ev-name { font-size: 17px; }
  .pill { font-size: 7px; padding: 4px 8px; }
}
`;

function StatusPill({ status }) {
  const map = { upcoming: "Upcoming", today: "Today", past: "Past Event" };
  return (
    <span className={`pill ${status}`}>
      <span className="pill-dot" />
      {map[status]}
    </span>
  );
}

function EventItem({ ev, onClick }) {
  const status = getStatus(ev);
  return (
    <div
      className="ev-item"
      onClick={() => onClick(ev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(ev)}
    >
      <div className="ev-item-date">
        <div className="ev-date-day">{ev.day}</div>
        <div className="ev-date-mon">{ev.mon}</div>
        <div className="ev-date-wk">{ev.weekday}</div>
      </div>
      <div className="ev-item-main">
        <div className="ev-item-img">
          <img
            src={ev.img}
            alt={ev.name}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
        <div className="ev-item-body">
          <div className="ev-cat">{ev.category}</div>
          <div className="ev-name">{ev.name}</div>
          <div className="ev-time">
            {ev.isAllDay
              ? "All Day Event"
              : ev.time + (ev.timeEnd ? " — " + ev.timeEnd : "")}
          </div>
        </div>
        <div className="ev-item-right">
          <StatusPill status={status} />
          <div className="ev-arrow">→</div>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ ev, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const open = !!ev;

  useEffect(() => {
    setImgLoaded(false);
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, ev]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const status = ev ? getStatus(ev) : "upcoming";
  const evDate = ev ? getEventDate(ev) : null;
  const fullDate = evDate
    ? `${WEEKDAYS[evDate.getDay()]}, ${MONTH_NAMES[evDate.getMonth()]} ${ev.day}`
    : "";
  const countdown = ev ? getCountdown(ev) : "";
  const duration =
    ev && !ev.isAllDay && ev.timeEnd ? getDuration(ev.time, ev.timeEnd) : "";

  const encName = ev ? encodeURIComponent(ev.name) : "";
  const encHref = ev ? encodeURIComponent(ev.href) : "";

  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} onClick={onClose} />
      <div
        className={`detail${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="detail-bar">
          <div className="detail-bar-crumb">Events &amp; Programs</div>
          <div className="detail-bar-logo">SM</div>
          <button className="detail-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {ev && (
          <>
            <div className="detail-img-wrap">
              <img
                className={`detail-img${imgLoaded ? " loaded" : ""}`}
                src={ev.img}
                alt={ev.name}
                onLoad={() => setImgLoaded(true)}
              />
              <div className="detail-img-grad" />
              <div className="detail-badge">{ev.category}</div>
              <div className="detail-date-box">
                <div className="detail-date-day">{ev.day}</div>
                <div className="detail-date-mon">{ev.mon}</div>
                <div className="detail-date-yr">{ev.year}</div>
              </div>
              <div className="c-orn tl" />
              <div className="c-orn br" />
            </div>

            <div className="detail-content">
              <div className="detail-status-row">
                <StatusPill status={status} />
                {status !== "today" && (
                  <div className="detail-countdown">{countdown}</div>
                )}
              </div>

              <div className="detail-title">{ev.name}</div>
              <div className="detail-sub">
                {ev.category} · Salvation Ministries
              </div>

              <div className="detail-divider" />

              <div className="detail-grid">
                <div className="info-block">
                  <div className="info-label">Day &amp; Date</div>
                  <div className="info-value">{fullDate}</div>
                  <div className="info-sub">{ev.year}</div>
                </div>
                <div className="info-block">
                  <div className="info-label">Time</div>
                  <div className="info-value">
                    {ev.isAllDay
                      ? "All Day"
                      : ev.time + (ev.timeEnd ? " – " + ev.timeEnd : "")}
                  </div>
                  <div className="info-sub">
                    {ev.isAllDay
                      ? "Full day event"
                      : duration
                        ? `Duration: approx. ${duration}`
                        : "Start time"}
                  </div>
                </div>
              </div>

              {ev.venue && (
                <div className="venue-block">
                  <div className="venue-icon">⬡</div>
                  <div className="venue-name">{ev.venue}</div>
                  <div className="venue-addr">{ev.address}</div>
                </div>
              )}

              <div className="about-label">About This Event</div>
              <div className="about-text">{ev.about}</div>

              <div className="action-group">
                <Link
                  to="/livestream"
                  className="action-btn secondary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Watch Live Stream</span>
                  <span className="action-icon">▶</span>
                </Link>
                <Link
                  className="action-btn ghost"
                  to="/give"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Give Online</span>
                  <span className="action-icon">✦</span>
                </Link>
              </div>

              <div className="share-row">
                <div className="share-label">Share</div>
                <a
                  className="share-btn"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encHref}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Fb
                </a>
                <a
                  className="share-btn"
                  href={`https://twitter.com/intent/tweet?text=${encName}&url=${encHref}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Tw
                </a>
                <a
                  className="share-btn"
                  href={`https://wa.me/?text=${encName}%20${encHref}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Wa
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-mark">
                <span>SM</span>
              </div>
              <div className="logo-text">
                <div className="logo-name">SALVATION MINISTRIES</div>
                <div className="logo-tag">Home of Success</div>
              </div>
            </div>
            <div className="header-right">
              <div className="header-tag">Events &amp; Programs</div>
            </div>
          </div>
        </header>

        <main className="page">
          <div className="hero">
            <div className="hero-eyebrow">Upcoming Events</div>
            <div className="hero-title">
              WHAT'S
              <br />
              <em>HAPPENING</em>
            </div>
            <div className="hero-sub">
              Join us as we gather in faith, worship, and purpose — across all
              branches, worldwide.
            </div>
            <div className="hero-divider">
              <div className="hero-divider-line" />
              <div className="hero-divider-gem" />
            </div>
          </div>

          <div className="ev-list">
            {EVENTS.map((ev) => (
              <EventItem key={ev.id} ev={ev} onClick={setSelected} />
            ))}
          </div>
        </main>

        <DetailPanel ev={selected} onClose={handleClose} />
      </div>
    </>
  );
}
