import { useState, useEffect, useRef } from "react";
import ChatWidget from "./Components/ChatWidget";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────
   BRANCH DATA
   ───────────────────────────────────────────────────────────────────────── */

const BRANCHES = [
  {
    id: 1,
    tag: "hq",
    tagLabel: "Global HQ",
    name: "Port Harcourt Headquarters",
    city: "Port Harcourt",
    state: "Rivers",
    country: "Nigeria",
    address:
      "Plot 17 Birabi Street, GRA Phase 1, Port Harcourt, Rivers, Nigeria",
    phone: "+234 803 312 3743",
    email: "info@smhos.org",
    lat: 4.8156,
    lng: 7.0498,
  },
  {
    id: 2,
    tag: "branch",
    tagLabel: "Branch",
    name: "Lagos Branch",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    address: "Victoria Island, Lagos, Nigeria",
    phone: "",
    email: "",
    lat: 6.4281,
    lng: 3.4219,
  },
  {
    id: 3,
    tag: "branch",
    tagLabel: "Branch",
    name: "Abuja Branch",
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    address: "Central Business District, Abuja, FCT, Nigeria",
    phone: "",
    email: "",
    lat: 9.0765,
    lng: 7.3986,
  },
  {
    id: 4,
    tag: "branch",
    tagLabel: "Branch",
    name: "Warri Branch",
    city: "Warri",
    state: "Delta",
    country: "Nigeria",
    address: "Warri, Delta State, Nigeria",
    phone: "",
    email: "",
    lat: 5.5167,
    lng: 5.75,
  },
  {
    id: 5,
    tag: "branch",
    tagLabel: "Branch",
    name: "Benin City Branch",
    city: "Benin City",
    state: "Edo",
    country: "Nigeria",
    address: "Benin City, Edo State, Nigeria",
    phone: "",
    email: "",
    lat: 6.335,
    lng: 5.6278,
  },
  {
    id: 6,
    tag: "branch",
    tagLabel: "Branch",
    name: "Enugu Branch",
    city: "Enugu",
    state: "Enugu",
    country: "Nigeria",
    address: "Enugu, Enugu State, Nigeria",
    phone: "",
    email: "",
    lat: 6.4509,
    lng: 7.5086,
  },
  {
    id: 7,
    tag: "branch",
    tagLabel: "Branch",
    name: "Owerri Branch",
    city: "Owerri",
    state: "Imo",
    country: "Nigeria",
    address: "Owerri, Imo State, Nigeria",
    phone: "",
    email: "",
    lat: 5.4836,
    lng: 7.0332,
  },
  {
    id: 8,
    tag: "branch",
    tagLabel: "Branch",
    name: "Uyo Branch",
    city: "Uyo",
    state: "Akwa Ibom",
    country: "Nigeria",
    address: "Uyo, Akwa Ibom State, Nigeria",
    phone: "",
    email: "",
    lat: 5.051,
    lng: 7.9328,
  },
  {
    id: 9,
    tag: "branch",
    tagLabel: "Branch",
    name: "Calabar Branch",
    city: "Calabar",
    state: "Cross River",
    country: "Nigeria",
    address: "Calabar, Cross River State, Nigeria",
    phone: "",
    email: "",
    lat: 4.95,
    lng: 8.325,
  },
  {
    id: 10,
    tag: "intl",
    tagLabel: "International",
    name: "UK International Chapter",
    city: "London",
    state: "England",
    country: "United Kingdom",
    address: "London, United Kingdom",
    phone: "",
    email: "",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    id: 11,
    tag: "intl",
    tagLabel: "International",
    name: "USA International Chapter",
    city: "Houston",
    state: "Texas",
    country: "United States",
    address: "Houston, Texas, USA",
    phone: "",
    email: "",
    lat: 29.7604,
    lng: -95.3698,
  },
  {
    id: 12,
    tag: "intl",
    tagLabel: "International",
    name: "Canada Chapter",
    city: "Toronto",
    state: "Ontario",
    country: "Canada",
    address: "Toronto, Ontario, Canada",
    phone: "",
    email: "",
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    id: 13,
    tag: "intl",
    tagLabel: "International",
    name: "South Africa Chapter",
    city: "Johannesburg",
    state: "Gauteng",
    country: "South Africa",
    address: "Johannesburg, Gauteng, South Africa",
    phone: "",
    email: "",
    lat: -26.2041,
    lng: 28.0473,
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   UTILITIES
   ───────────────────────────────────────────────────────────────────────── */

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getNearestBranch(lat, lng) {
  let best = null;
  let bestDist = Infinity;
  for (const b of BRANCHES) {
    const d = haversine(lat, lng, b.lat, b.lng);
    if (d < bestDist) {
      bestDist = d;
      best = { ...b, dist: d };
    }
  }
  return best;
}

async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!res.ok) throw new Error("reverse geocode failed");
  return res.json();
}

async function forwardGeocode(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!res.ok) throw new Error("geocode failed");
  const data = await res.json();
  return data.length ? data[0] : null;
}

/* ─────────────────────────────────────────────────────────────────────────
   FIX 1 — getNearbyChurchesOSM (was called but never defined — crashed app)
   Uses the free Overpass API to query OpenStreetMap for Christian churches
   within a given radius (metres) of a lat/lng point.
   ───────────────────────────────────────────────────────────────────────── */
async function getNearbyChurchesOSM(lat, lng, radiusMeters = 5000) {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="place_of_worship"]["religion"="christian"](around:${radiusMeters},${lat},${lng});
      way["amenity"="place_of_worship"]["religion"="christian"](around:${radiusMeters},${lat},${lng});
    );
    out center 30;
  `;
  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });
    const data = await res.json();
    return (data.elements || [])
      .map((el) => ({
        id: `osm-${el.id}`,
        tag: "external",
        tagLabel: "Nearby",
        name: el.tags?.name || "Unnamed Church",
        address:
          [el.tags?.["addr:street"], el.tags?.["addr:city"]]
            .filter(Boolean)
            .join(", ") || "Address unavailable",
        denomination: el.tags?.denomination || null,
        phone: el.tags?.phone || null,
        lat: el.lat ?? el.center?.lat,
        lng: el.lon ?? el.center?.lon,
      }))
      .filter((c) => c.lat && c.lng);
  } catch {
    return [];
  }
}

function formatPlace(address) {
  const a = address || {};
  return [
    a.city || a.town || a.village || a.county || "",
    a.state || a.region || "",
    a.country || "",
  ]
    .filter(Boolean)
    .join(", ");
}

/* ─────────────────────────────────────────────────────────────────────────
   STYLES
   ───────────────────────────────────────────────────────────────────────── */

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.cl-root {
  font-family: 'DM Sans', sans-serif;
  background: #07090e;
  color: #e8e2d9;
  min-height: 100vh;
  overflow-x: hidden;
}

.cl-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 75% -5%, rgba(255,145,25,0.09) 0%, transparent 60%),
    radial-gradient(ellipse 55% 45% at -5% 85%, rgba(255,110,15,0.06) 0%, transparent 55%);
}

.cl-grid-overlay {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.025;
  background-image:
    linear-gradient(rgba(255,163,47,1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,163,47,1) 1px, transparent 1px);
  background-size: 72px 72px;
}

.cl-wrap {
  position: relative; z-index: 1;
  max-width: 980px; margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
}

/* ── Hero ── */
.cl-hero { text-align: center; margin-bottom: 4rem; }

.cl-overline {
  display: inline-flex; align-items: center; gap: 12px;
  font-size: 10.5px; font-weight: 600; letter-spacing: 0.3em;
  text-transform: uppercase; color: #b87828; margin-bottom: 1.25rem;
}
.cl-overline::before, .cl-overline::after {
  content: ''; display: block; width: 28px; height: 1px;
  background: linear-gradient(90deg, transparent, #b87828);
}
.cl-overline::after { transform: scaleX(-1); }

.cl-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.6rem, 6.5vw, 4.6rem);
  font-weight: 400; line-height: 1.06;
  color: #f2ece0; letter-spacing: -0.02em;
  margin-bottom: 1.25rem;
}
.cl-title i {
  font-style: italic;
  background: linear-gradient(135deg, #e8a030 0%, #c06818 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cl-ornament {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; margin: 0 auto 1.25rem;
}
.cl-orn-line { width: 44px; height: 0.5px; background: linear-gradient(90deg, transparent, #b87828); }
.cl-orn-line:last-child { transform: scaleX(-1); }
.cl-orn-gem {
  width: 7px; height: 7px; border: 1px solid #b87828; transform: rotate(45deg);
}

.cl-hero-p {
  font-size: 15.5px; font-weight: 300; line-height: 1.8;
  color: rgba(232,226,217,0.5); max-width: 480px; margin: 0 auto;
}

/* ── GPS Bar ── */
.cl-gps-row {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; flex-wrap: wrap; margin-bottom: 3rem;
}
.cl-gps-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.03);
  border: 0.5px solid rgba(184,120,40,0.22);
  border-radius: 40px; padding: 9px 18px;
  font-size: 12.5px; color: rgba(232,226,217,0.55);
  transition: border-color 0.3s, color 0.3s; max-width: 340px;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
.cl-gps-pill.gps-ok    { border-color: rgba(80,200,120,0.35); color: rgba(160,230,180,0.85); }
.cl-gps-pill.gps-error { border-color: rgba(220,80,60,0.35);  color: rgba(230,140,120,0.8); }

.cl-dot {
  width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  background: rgba(184,120,40,0.5);
}
.cl-dot.dot-pulse  { background: #50c878; animation: cl-ping 1.8s ease-out infinite; }
.cl-dot.dot-spin   { background: #b87828; animation: cl-ping 1.2s ease-out infinite; }
.cl-dot.dot-error  { background: #dc5040; }

@keyframes cl-ping {
  0%   { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
  70%  { box-shadow: 0 0 0 7px transparent; opacity: 0.6; }
  100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
}

.cl-gps-btn {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(184,120,40,0.1);
  border: 0.5px solid rgba(184,120,40,0.32);
  border-radius: 40px; padding: 9px 20px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px; font-weight: 500; color: #c8882c;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.cl-gps-btn:hover:not(:disabled) {
  background: rgba(184,120,40,0.18); border-color: rgba(184,120,40,0.5);
}
.cl-gps-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Panel ── */
.cl-panel {
  background: rgba(255,255,255,0.022);
  border: 0.5px solid rgba(184,120,40,0.16);
  border-radius: 24px; overflow: hidden; margin-bottom: 2rem;
}
.cl-panel-head {
  padding: 1.6rem 2rem 1.3rem;
  border-bottom: 0.5px solid rgba(184,120,40,0.1);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.cl-panel-head-text {}
.cl-ph-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.35rem; font-weight: 400; color: #f0e8d8;
  margin-bottom: 3px;
}
.cl-ph-sub { font-size: 12.5px; color: rgba(232,226,217,0.38); font-weight: 300; }
.cl-panel-ico {
  width: 42px; height: 42px; border-radius: 12px;
  background: rgba(184,120,40,0.1);
  border: 0.5px solid rgba(184,120,40,0.22);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}

.cl-panel-body { padding: 1.75rem 2rem; }

.cl-fields {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 12px; margin-bottom: 14px;
}
@media (max-width: 640px) { .cl-fields { grid-template-columns: 1fr; } }

.cl-field label {
  display: block; font-size: 10.5px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(184,120,40,0.72); margin-bottom: 7px;
}
.cl-field input {
  width: 100%;
  background: rgba(255,255,255,0.035);
  border: 0.5px solid rgba(255,255,255,0.09);
  border-radius: 10px; padding: 11px 14px;
  font-family: 'DM Sans', sans-serif; font-size: 14px;
  color: #e8e2d9; outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.cl-field input::placeholder { color: rgba(232,226,217,0.22); }
.cl-field input:focus {
  border-color: rgba(184,120,40,0.48);
  background: rgba(255,255,255,0.055);
}

.cl-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #c47020, #9a5010);
  border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
  letter-spacing: 0.04em; color: #fff; cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 9px;
}
.cl-btn:hover:not(:disabled) { opacity: 0.86; transform: translateY(-1px); }
.cl-btn:active:not(:disabled) { transform: scale(0.99); }
.cl-btn:disabled { opacity: 0.42; cursor: not-allowed; }

/* ── Alerts ── */
.cl-alert {
  margin-top: 1rem; border-radius: 12px; padding: 14px 16px;
  font-size: 13.5px; line-height: 1.65;
  animation: cl-rise 0.35s ease;
  display: flex; gap: 12px; align-items: flex-start;
}
.cl-alert.al-warn {
  background: rgba(220,80,60,0.07);
  border: 0.5px solid rgba(220,80,60,0.28);
  color: #e8a898;
}
.cl-alert.al-info {
  background: rgba(80,160,220,0.07);
  border: 0.5px solid rgba(80,160,220,0.22);
  color: rgba(180,215,245,0.85);
}
.cl-alert-ico { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.cl-alert strong { color: #f0c070; }

.cl-real-loc {
  display: flex; align-items: center; gap: 10px;
  margin-top: 10px; padding: 12px 16px;
  background: rgba(80,200,120,0.06);
  border: 0.5px solid rgba(80,200,120,0.22);
  border-radius: 10px; font-size: 13px;
  color: rgba(160,230,180,0.8);
  animation: cl-rise 0.3s ease;
}
.cl-real-loc strong { color: rgba(180,240,200,0.95); font-weight: 500; }

.cl-from-strip {
  display: flex; align-items: center; gap: 10px;
  margin-top: 10px; padding: 11px 16px;
  background: rgba(255,255,255,0.02);
  border: 0.5px solid rgba(255,255,255,0.07);
  border-radius: 10px; font-size: 12.5px;
  color: rgba(232,226,217,0.5);
  animation: cl-rise 0.3s ease;
}
.cl-from-strip strong { color: rgba(232,226,217,0.82); font-weight: 500; }

@keyframes cl-rise {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Result ── */
.cl-result {
  margin-top: 1.25rem;
  border-top: 0.5px solid rgba(184,120,40,0.12);
  padding-top: 1.25rem;
  animation: cl-rise 0.4s ease;
}
.cl-result-lbl {
  font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
  text-transform: uppercase; color: rgba(184,120,40,0.6); margin-bottom: 12px;
}
.cl-result-card {
  background: linear-gradient(135deg, rgba(184,120,40,0.1) 0%, rgba(184,120,40,0.03) 100%);
  border: 0.5px solid rgba(184,120,40,0.3);
  border-radius: 16px; padding: 1.4rem;
  display: flex; justify-content: space-between;
  align-items: flex-start; gap: 1.25rem;
  position: relative; overflow: hidden;
}
.cl-result-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(184,120,40,0.75), transparent);
}
.cl-rc-badge {
  font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; display: inline-block;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 9px;
  background: rgba(184,120,40,0.16); color: #d4891e;
  border: 0.5px solid rgba(184,120,40,0.32);
}
.cl-rc-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.28rem; font-weight: 400; color: #f2ece0; margin-bottom: 5px;
}
.cl-rc-addr { font-size: 13px; color: rgba(232,226,217,0.48); line-height: 1.65; font-weight: 300; }
.cl-rc-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.cl-chip {
  font-size: 11px; color: rgba(232,226,217,0.52);
  background: rgba(255,255,255,0.055);
  border: 0.5px solid rgba(255,255,255,0.09);
  border-radius: 20px; padding: 3px 11px;
}

.cl-dist-block { text-align: right; flex-shrink: 0; }
.cl-dist-num {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem; font-weight: 400; line-height: 1;
  background: linear-gradient(135deg, #e8a030, #b86820);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.cl-dist-unit {
  font-size: 10px; color: rgba(232,226,217,0.36);
  letter-spacing: 0.14em; text-transform: uppercase; margin-top: 3px;
}

/* ── Map embed ── */
.cl-map-frame {
  display: block; width: 100%; border: none;
  border-radius: 0 0 24px 24px;
}

/* ── Section heading ── */
.cl-sec {
  display: flex; align-items: center; gap: 14px; margin-bottom: 1.5rem; margin-top: 0.5rem;
}
.cl-sec h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem; font-weight: 400; color: #f0e8d8; white-space: nowrap;
}
.cl-sec-line {
  flex: 1; height: 0.5px;
  background: linear-gradient(90deg, rgba(184,120,40,0.38), transparent);
}

/* ── Branch grid ── */
.cl-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
  gap: 14px; margin-bottom: 3.5rem;
}
.cl-b {
  background: rgba(255,255,255,0.02);
  border: 0.5px solid rgba(255,255,255,0.065);
  border-radius: 18px; padding: 1.3rem;
  transition: border-color 0.25s, background 0.25s, transform 0.2s;
  position: relative; overflow: hidden;
}
.cl-b:hover { border-color: rgba(184,120,40,0.26); transform: translateY(-2px); }
.cl-b.is-hq {
  border-color: rgba(184,120,40,0.2);
  background: rgba(184,120,40,0.035);
}
.cl-b.is-hq::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(184,120,40,0.55), transparent);
}
.cl-b.is-nearest {
  border-color: rgba(80,200,120,0.28) !important;
  background: rgba(80,200,120,0.035) !important;
}
.cl-b.is-nearest::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(80,200,120,0.5), transparent);
}

.cl-btags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
.cl-btag {
  font-size: 9.5px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; padding: 3px 9px; border-radius: 20px;
  display: inline-block;
}
.cl-btag.t-hq      { background: rgba(184,120,40,0.15); color: #d4891e; border: 0.5px solid rgba(184,120,40,0.32); }
.cl-btag.t-branch  { background: rgba(255,255,255,0.055); color: rgba(232,226,217,0.48); border: 0.5px solid rgba(255,255,255,0.09); }
.cl-btag.t-intl    { background: rgba(80,130,200,0.12); color: #7aace8; border: 0.5px solid rgba(80,130,200,0.26); }
.cl-btag.t-nearest { background: rgba(80,200,120,0.12); color: #5cc87a; border: 0.5px solid rgba(80,200,120,0.28); }

.cl-bname {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem; font-weight: 400; color: #ece5d8;
  margin-bottom: 5px; line-height: 1.3;
}
.cl-baddr { font-size: 12.5px; color: rgba(232,226,217,0.38); line-height: 1.6; font-weight: 300; }
.cl-bdist { margin-top: 8px; font-size: 12px; color: rgba(212,137,30,0.75); font-weight: 500; }
.cl-bchips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }

/* ── Footer ── */
.cl-footer {
  border-top: 0.5px solid rgba(184,120,40,0.1);
  padding-top: 2rem;
  display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 1rem;
}
.cl-footer-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1rem; font-weight: 400;
  color: rgba(232,226,217,0.35); letter-spacing: 0.03em;
}
.cl-footer-nav { display: flex; gap: 20px; flex-wrap: wrap; }
.cl-footer-nav a {
  font-size: 12px; color: rgba(232,226,217,0.3);
  text-decoration: none; letter-spacing: 0.06em; transition: color 0.2s;
}
.cl-footer-nav a:hover { color: #c47020; }

/* ── Spinner ── */
.cl-spinner {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.18);
  border-top-color: rgba(255,255,255,0.9);
  animation: cl-rotate 0.65s linear infinite; flex-shrink: 0;
}
@keyframes cl-rotate { to { transform: rotate(360deg); } }
`;

/* ─────────────────────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────────────────────── */

export default function ChurchLocator() {
  // GPS
  const [gpsStatus, setGpsStatus] = useState("idle"); // idle|loading|ok|denied|error
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsPlace, setGpsPlace] = useState(null);

  // Inputs
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  // Search
  const [searching, setSearching] = useState(false);
  const [nearest, setNearest] = useState(null);
  const [fromPlace, setFromPlace] = useState(null);
  const [alert, setAlert] = useState(null); // {type, html}
  const [showRealLoc, setShowRealLoc] = useState(false);

  const [externalChurches, setExternalChurches] = useState([]);
  const [showExternal, setShowExternal] = useState(false);

  // Inject styles once
  useEffect(() => {
    if (document.getElementById("cl-global-style")) return;
    const style = document.createElement("style");
    style.id = "cl-global-style";
    style.innerHTML = STYLE;
    document.head.appendChild(style);
  }, []);

  /* ── GPS Detection ── */
  const watchRef = useRef(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsStatus("error");
      return;
    }

    setGpsStatus("loading");

    if (watchRef.current) {
      navigator.geolocation.clearWatch(watchRef.current);
    }

    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setGpsCoords({ lat, lng });
        setGpsStatus("ok");

        try {
          const data = await reverseGeocode(lat, lng);
          const place = formatPlace(data.address);
          setGpsPlace(place);

          // Find nearest SMHOS branch
          const nb = getNearestBranch(lat, lng);
          setNearest(nb);
          setFromPlace(place);

          // FIX 1: fetch nearby churches from OpenStreetMap (was undefined before)
          const osmChurches = await getNearbyChurchesOSM(lat, lng, 5000);
          const withDistance = osmChurches
            .map((c) => ({
              ...c,
              dist: haversine(lat, lng, c.lat, c.lng),
            }))
            .sort((a, b) => a.dist - b.dist);

          setExternalChurches(withDistance);
          setAlert(null);
          setShowRealLoc(false);
        } catch {
          const nb = getNearestBranch(lat, lng);
          setNearest(nb);
        }
      },
      (err) => {
        setGpsStatus(err.code === 1 ? "denied" : "error");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  };

  // Auto-trigger GPS on mount
  useEffect(() => {
    startTracking();
    return () => {
      if (watchRef.current) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Manual Search ── */
  const handleSearch = async () => {
    const query = [city, region, country].filter(Boolean).join(", ").trim();
    if (!query) {
      setAlert({
        type: "al-warn",
        html: "Please enter at least a city or country to search.",
      });
      return;
    }

    setSearching(true);
    setAlert(null);
    setNearest(null);
    setFromPlace(null);
    setShowRealLoc(false);

    try {
      const geo = await forwardGeocode(query);

      if (!geo) {
        // Invalid / unrecognised location
        const realMsg = gpsPlace
          ? `Your actual GPS-detected location is <strong>${gpsPlace}</strong>.`
          : `We could not detect your real location automatically. Please enable location access and click "Use My Location".`;

        setAlert({
          type: "al-warn",
          html: `⚠️ <strong>"${query}"</strong> is not a recognised real-world location. ${realMsg}`,
        });
        setShowRealLoc(!!gpsPlace);

        // Still show nearest based on GPS if available
        if (gpsCoords) {
          const nb = getNearestBranch(gpsCoords.lat, gpsCoords.lng);
          setNearest(nb);
          setFromPlace(gpsPlace + " (your real GPS location)");
        }
        setSearching(false);
        return;
      }

      // Valid location
      const lat = parseFloat(geo.lat);
      const lng = parseFloat(geo.lon);
      const name = (geo.display_name || query)
        .split(",")
        .slice(0, 3)
        .join(",")
        .trim();

      const nb = getNearestBranch(lat, lng);
      setNearest(nb);
      setFromPlace(name);
      setAlert(null);
      setShowRealLoc(false);
    } catch {
      setAlert({
        type: "al-warn",
        html: "Network error — please check your internet connection and try again.",
      });
    }

    setSearching(false);
  };

  const onKey = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  /* ── GPS label / class helpers ── */
  const gpsLabel = {
    idle: 'Click "Use My Location" to get started',
    loading: "Detecting your location…",
    ok: gpsPlace || "Location detected",
    denied: "Location access was denied",
    error: "Geolocation unavailable in this browser",
  }[gpsStatus];

  const pillClass =
    gpsStatus === "ok"
      ? "gps-ok"
      : gpsStatus === "denied" || gpsStatus === "error"
        ? "gps-error"
        : "";

  const dotClass =
    gpsStatus === "loading"
      ? "dot-spin"
      : gpsStatus === "ok"
        ? "dot-pulse"
        : gpsStatus === "denied" || gpsStatus === "error"
          ? "dot-error"
          : "";

  /* ── Map URL — centres on nearest branch ── */
  const mapEmbedUrl = nearest
    ? `https://maps.google.com/maps?q=${nearest.lat},${nearest.lng}&z=13&output=embed`
    : null;

  return (
    <div className="cl-root">
      <div className="cl-bg" />
      <div className="cl-grid-overlay" />

      <div className="cl-wrap">
        {/* ── Hero ── */}
        <header className="cl-hero">
          <div className="cl-overline">Salvation Ministries</div>
          <h1 className="cl-title">
            Find Your <i>Nearest</i> Branch
          </h1>
          <div className="cl-ornament">
            <div className="cl-orn-line" />
            <div className="cl-orn-gem" />
            <div className="cl-orn-line" />
          </div>
          <p className="cl-hero-p">
            We use your real GPS position to locate the Salvation Ministries
            congregation closest to you — anywhere in the world.
          </p>
        </header>

        {/* ── GPS Bar ── */}
        <div className="cl-gps-row">
          <div className={`cl-gps-pill ${pillClass}`}>
            <span className={`cl-dot ${dotClass}`} />
            {gpsLabel}
          </div>
          {gpsStatus !== "loading" && (
            <button
              className="cl-gps-btn"
              onClick={startTracking}
              disabled={gpsStatus === "loading"}
            >
              📍 {gpsStatus === "ok" ? "Refresh GPS" : "Use My Location"}
            </button>
          )}
        </div>

        {/* ── Finder Panel ── */}
        <div className="cl-panel">
          <div className="cl-panel-head">
            <div className="cl-panel-head-text">
              <div className="cl-ph-title">Location Search</div>
              <div className="cl-ph-sub">
                Enter any location — we validate it's real before searching
              </div>
            </div>
            <div className="cl-panel-ico">🧭</div>
          </div>

          <div className="cl-panel-body">
            <div className="cl-fields">
              {[
                {
                  label: "Country",
                  val: country,
                  set: setCountry,
                  ph: "e.g. Nigeria",
                },
                {
                  label: "State / Region",
                  val: region,
                  set: setRegion,
                  ph: "e.g. Rivers",
                },
                {
                  label: "City",
                  val: city,
                  set: setCity,
                  ph: "e.g. Port Harcourt",
                },
              ].map(({ label, val, set, ph }) => (
                <div className="cl-field" key={label}>
                  <label>{label}</label>
                  <input
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    onKeyDown={onKey}
                    placeholder={ph}
                  />
                </div>
              ))}
            </div>

            <button
              className="cl-btn"
              onClick={handleSearch}
              disabled={searching}
            >
              {searching ? (
                <>
                  <div className="cl-spinner" />
                  <span>Validating location…</span>
                </>
              ) : (
                <span>Find Nearest Branch →</span>
              )}
            </button>

            {/* Alert */}
            {alert && (
              <div className={`cl-alert ${alert.type}`}>
                <span className="cl-alert-ico">
                  {alert.type === "al-warn" ? "⚠️" : "ℹ️"}
                </span>
                <span dangerouslySetInnerHTML={{ __html: alert.html }} />
              </div>
            )}

            {/* Real GPS location strip (shown after fake input) */}
            {showRealLoc && gpsPlace && (
              <div className="cl-real-loc">
                📍 Your real GPS location: <strong>&nbsp;{gpsPlace}</strong>
              </div>
            )}

            {/* Searching-from strip */}
            {fromPlace && !showRealLoc && (
              <div className="cl-from-strip">
                📍 Searching from: <strong>&nbsp;{fromPlace}</strong>
              </div>
            )}

            {/* ── FIX 2: was gpsStatus === "ok" && nearest — now just nearest
                so the card also appears after a successful manual text search ── */}
            {nearest && (
              <div className="cl-result">
                <div className="cl-result-lbl">Nearest Branch to You</div>
                <div className="cl-result-card">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cl-rc-badge">{nearest.tagLabel}</div>
                    <div className="cl-rc-name">{nearest.name}</div>
                    <div className="cl-rc-addr">{nearest.address}</div>
                    <div className="cl-rc-chips">
                      {nearest.phone && (
                        <span className="cl-chip">📞 {nearest.phone}</span>
                      )}
                      {nearest.email && (
                        <span className="cl-chip">✉️ {nearest.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="cl-dist-block">
                    <div className="cl-dist-num">
                      {nearest.dist.toLocaleString()}
                    </div>
                    <div className="cl-dist-unit">km away</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FIX 3: Map embed — mapEmbedUrl was computed but never rendered ── */}
        {mapEmbedUrl && (
          <div className="cl-panel" style={{ marginBottom: "2rem" }}>
            <div className="cl-panel-head">
              <div className="cl-panel-head-text">
                <div className="cl-ph-title">Branch Map</div>
                <div className="cl-ph-sub">
                  {nearest?.name} — click the map to open directions
                </div>
              </div>
              <div className="cl-panel-ico">🗺️</div>
            </div>
            <iframe
              title="Nearest Branch Map"
              src={mapEmbedUrl}
              className="cl-map-frame"
              height="320"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* ── Branch / External toggle ── */}
        <div className="cl-sec" style={{ marginTop: "2rem" }}>
          <h2>{showExternal ? "All Nearby Churches" : "SMHOS Branches"}</h2>
          <div className="cl-sec-line" />
          <button
            className="cl-gps-btn"
            onClick={() => setShowExternal(!showExternal)}
            style={{ marginLeft: "auto" }}
          >
            {showExternal ? "Show SMHOS Only" : ""}
          </button>
        </div>

        <div className="cl-grid">
          {(showExternal ? externalChurches : BRANCHES).map((b) => {
            const isNearest = nearest && b.id === nearest.id && !showExternal;
            const dist = gpsCoords
              ? haversine(gpsCoords.lat, gpsCoords.lng, b.lat, b.lng)
              : null;
            const isExternalNearest =
              showExternal && externalChurches[0]?.id === b.id;

            return (
              <div
                key={b.id}
                className={[
                  "cl-b",
                  b.tag === "hq" ? "is-hq" : "",
                  isNearest || isExternalNearest ? "is-nearest" : "",
                ]
                  .join(" ")
                  .trim()}
              >
                <div className="cl-btags">
                  <span className={`cl-btag t-${b.tag}`}>{b.tagLabel}</span>
                  {(isNearest || isExternalNearest) && (
                    <span className="cl-btag t-nearest">Nearest to you</span>
                  )}
                </div>
                <div className="cl-bname">{b.name}</div>
                <div className="cl-baddr">{b.address}</div>
                {dist !== null && (
                  <div className="cl-bdist">
                    ≈ {dist.toLocaleString()} km from you
                  </div>
                )}
                {b.denomination && (
                  <div className="cl-bdist">⛪ {b.denomination}</div>
                )}
                <div className="cl-bchips">
                  {b.phone && <span className="cl-chip">📞 {b.phone}</span>}
                  {showExternal && gpsCoords && (
                    <a
                      href={`https://www.openstreetmap.org/directions?from=${gpsCoords.lat},${gpsCoords.lng}&to=${b.lat},${b.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="cl-chip"
                      style={{ textDecoration: "none" }}
                    >
                      🧭 Directions
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <span style={{ fontSize: 13, color: "rgba(232,226,217,0.35)" }}>
          Having some issues with the locator? Use the AI chatbot →
        </span>

        {/* ── Footer ── */}
        <footer className="cl-footer">
          <div className="cl-footer-brand">
            Salvation Ministries · House of Success
          </div>
          <nav className="cl-footer-nav">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              Home
            </Link>
            <a href="/contact" target="_blank" rel="noopener noreferrer">
              Contact
            </a>
            <a href="/livestream" target="_blank" rel="noopener noreferrer">
              Livestream
            </a>
            <a href="/give" target="_blank" rel="noopener noreferrer">
              Give
            </a>
          </nav>
        </footer>
      </div>

      {/* FIX 4: Pass nearest branch as context so the AI knows where you are */}
      <ChatWidget context={nearest} />
    </div>
  );
}
