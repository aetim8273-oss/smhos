import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

/* ═══════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Cinzel:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root {
  min-height: 100vh;
  background: #04030A;
  font-family: 'Jost', sans-serif;
  overflow-x: hidden;
  color: #EFE8D4;
}

:root {
  --gold:     #C9A86C;
  --gold2:    #E2C17D;
  --gold3:    #F5DFA0;
  --gold4:    #FDF5E4;
  --crimson:  #9B2335;
  --ink:      #04030A;
  --deep:     #08061A;
  --card:     #0D0A1F;
  --panel:    #110D26;
  --border:   rgba(201,168,108,0.13);
  --border2:  rgba(201,168,108,0.38);
  --cream:    #EFE8D4;
  --muted:    rgba(239,232,212,0.42);
  --muted2:   rgba(239,232,212,0.68);
  --error:    #E05555;
  --success:  #5BAF7A;
  --f-display:'Cinzel', serif;
  --f-serif:  'Playfair Display', serif;
  --f-body:   'Jost', sans-serif;
  --ease:     cubic-bezier(0.16,1,0.3,1);
  --ease2:    cubic-bezier(0.34,1.56,0.64,1);
  --r:        16px;
  --r2:       24px;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--deep); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

@keyframes fadeUp    { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
@keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn   { from { opacity:0; transform:scale(0.91) translateY(14px); } to { opacity:1; transform:none; } }
@keyframes checkDraw { to   { stroke-dashoffset:0; } }
@keyframes glow      { 0%,100%{opacity:0.45;transform:scale(1);} 50%{opacity:1;transform:scale(1.14);} }
@keyframes ripple    { from{transform:scale(0.5);opacity:0.9;} to{transform:scale(2.4);opacity:0;} }
@keyframes float1    { 0%,100%{transform:translate(0,0);} 40%{transform:translate(20px,-16px);} 70%{transform:translate(-12px,20px);} }
@keyframes float2    { 0%,100%{transform:translate(0,0);} 30%{transform:translate(-18px,14px);} 65%{transform:translate(16px,-18px);} }
@keyframes particleRise { 0%{transform:translateY(0) scale(1);opacity:var(--op);} 100%{transform:translateY(-100px) scale(0.2);opacity:0;} }
@keyframes shimmer { from{background-position:-300% center;} to{background-position:300% center;} }
@keyframes rotate360 { to { transform: rotate(360deg); } }
@keyframes pulseBorder { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,108,0.0);} 50%{box-shadow:0 0 0 4px rgba(201,168,108,0.18);} }
@keyframes slideDown { from{opacity:0;transform:translateY(-12px);} to{opacity:1;transform:none;} }
@keyframes ping { 0%{transform:scale(1);opacity:0.7;} 100%{transform:scale(2.2);opacity:0;} }

.field-input {
  width:100%; background:rgba(255,255,255,0.032);
  border:1.5px solid rgba(201,168,108,0.13);
  border-radius:var(--r); padding:1.1rem 1rem 0.4rem;
  color:var(--cream); font-family:var(--f-serif); font-size:0.96rem; font-weight:400;
  outline:none; appearance:none; caret-color:var(--gold);
  transition:border-color .25s, background .25s, box-shadow .25s;
}
.field-input:focus {
  border-color:rgba(201,168,108,0.55) !important;
  background:rgba(201,168,108,0.032) !important;
  box-shadow:0 0 0 3px rgba(201,168,108,0.09) !important;
}
.field-input.has-error {
  border-color:rgba(224,85,85,0.45) !important;
  box-shadow:0 0 0 3px rgba(224,85,85,0.08) !important;
}
::placeholder { color:rgba(239,232,212,0.2) !important; font-style:italic; }
select option { background:#08061A; color:#EFE8D4; }

.btn-gold {
  width:100%; padding:1.1rem 2rem;
  background: linear-gradient(135deg,#6A3A08 0%,#C9A86C 45%,#F5DFA0 100%);
  border:none; border-radius:var(--r); color:#04030A;
  font-family:var(--f-display); font-size:0.7rem; font-weight:600;
  letter-spacing:0.24em; text-transform:uppercase; cursor:pointer;
  transition:transform .3s var(--ease), box-shadow .3s;
  position:relative; overflow:hidden;
}
.btn-gold:hover { transform:translateY(-3px); box-shadow:0 20px 60px rgba(201,168,108,0.38); }
.btn-gold:active { transform:translateY(-1px); }
.btn-gold:disabled { opacity:0.55; cursor:not-allowed; transform:none !important; box-shadow:none !important; }
.btn-gold::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
  background-size:200% auto; opacity:0;
  transition:opacity .3s;
}
.btn-gold:hover::after { opacity:1; animation:shimmer 1.4s linear infinite; }

.tab-btn {
  flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;
  padding:.85rem .3rem; border:none; border-radius:14px; cursor:pointer;
  font-family:var(--f-display); transition:all .3s var(--ease);
  background:none; color:rgba(201,168,108,0.32);
}
.tab-btn.active {
  background:linear-gradient(145deg,rgba(201,168,108,0.15),rgba(90,55,165,0.18));
  color:var(--gold3); box-shadow:0 0 0 1px rgba(201,168,108,0.26),0 10px 32px rgba(0,0,0,0.6);
}
.tab-btn:hover:not(.active) { color:rgba(201,168,108,0.6); background:rgba(201,168,108,0.04); }

.radio-opt {
  flex:1; display:flex; align-items:center; justify-content:center; gap:.55rem;
  padding:.78rem .6rem; background:rgba(255,255,255,0.025);
  border:1.5px solid rgba(201,168,108,0.13); border-radius:var(--r);
  cursor:pointer; color:var(--muted); font-size:.85rem; font-family:var(--f-serif); font-weight:400;
  transition:all .25s var(--ease); user-select:none;
}
.radio-opt.selected {
  background:rgba(201,168,108,0.09); border-color:var(--gold); color:var(--gold3);
}
.radio-dot {
  width:14px; height:14px; border-radius:50%; border:1.5px solid currentColor;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.radio-dot-inner {
  width:5px; height:5px; border-radius:50%; background:var(--gold);
  transition:transform .22s var(--ease2);
}

.network-banner {
  position:fixed; top:0; left:0; right:0; z-index:9000;
  padding:.6rem 1rem; text-align:center;
  font-family:var(--f-display); font-size:.6rem; letter-spacing:.18em; text-transform:uppercase;
  animation:slideDown .35s var(--ease);
}
.network-banner.offline { background:rgba(30,10,10,0.97); color:#F09090; border-bottom:1px solid rgba(224,85,85,0.3); }
.network-banner.online  { background:rgba(10,30,15,0.97); color:#90F0B0; border-bottom:1px solid rgba(91,175,122,0.3); }
`;

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const FORMSPREE = "https://formspree.io/f/xpqbjjer";

const COUNTRY_PHONE_DATA = {
  Afghanistan: { code: "+93", flag: "🇦🇫", digits: [9], pattern: "XX XXX XXXX" },
  Albania: { code: "+355", flag: "🇦🇱", digits: [9], pattern: "XX XXX XXXX" },
  Algeria: { code: "+213", flag: "🇩🇿", digits: [9], pattern: "XXX XX XX XX" },
  Angola: { code: "+244", flag: "🇦🇴", digits: [9], pattern: "XXX XXX XXX" },
  Argentina: { code: "+54", flag: "🇦🇷", digits: [10], pattern: "XXX XXX XXXX" },
  Armenia: { code: "+374", flag: "🇦🇲", digits: [8], pattern: "XX XXX XXX" },
  Australia: { code: "+61", flag: "🇦🇺", digits: [9], pattern: "X XXXX XXXX" },
  Austria: {
    code: "+43",
    flag: "🇦🇹",
    digits: [10, 11],
    pattern: "XXX XXXXXXX",
  },
  Azerbaijan: {
    code: "+994",
    flag: "🇦🇿",
    digits: [9],
    pattern: "XX XXX XX XX",
  },
  Bahrain: { code: "+973", flag: "🇧🇭", digits: [8], pattern: "XXXX XXXX" },
  Bangladesh: {
    code: "+880",
    flag: "🇧🇩",
    digits: [10],
    pattern: "XXXX-XXXXXX",
  },
  Belgium: { code: "+32", flag: "🇧🇪", digits: [9], pattern: "XXX XX XX XX" },
  Bolivia: { code: "+591", flag: "🇧🇴", digits: [8], pattern: "X XXX XXXX" },
  Brazil: {
    code: "+55",
    flag: "🇧🇷",
    digits: [10, 11],
    pattern: "XX XXXXX-XXXX",
  },
  Canada: { code: "+1", flag: "🇨🇦", digits: [10], pattern: "(XXX) XXX-XXXX" },
  Chile: { code: "+56", flag: "🇨🇱", digits: [9], pattern: "X XXXX XXXX" },
  China: { code: "+86", flag: "🇨🇳", digits: [11], pattern: "XXX XXXX XXXX" },
  Colombia: { code: "+57", flag: "🇨🇴", digits: [10], pattern: "XXX XXX XXXX" },
  "Czech Republic": {
    code: "+420",
    flag: "🇨🇿",
    digits: [9],
    pattern: "XXX XXX XXX",
  },
  Denmark: { code: "+45", flag: "🇩🇰", digits: [8], pattern: "XXXX XXXX" },
  Egypt: { code: "+20", flag: "🇪🇬", digits: [10], pattern: "XXX XXX XXXX" },
  Ethiopia: { code: "+251", flag: "🇪🇹", digits: [9], pattern: "XX XXX XXXX" },
  Finland: {
    code: "+358",
    flag: "🇫🇮",
    digits: [9, 10],
    pattern: "XX XXX XXXX",
  },
  France: { code: "+33", flag: "🇫🇷", digits: [9], pattern: "XX XX XX XX XX" },
  Germany: {
    code: "+49",
    flag: "🇩🇪",
    digits: [10, 11],
    pattern: "XXXX XXXXXXX",
  },
  Ghana: { code: "+233", flag: "🇬🇭", digits: [9], pattern: "XX XXX XXXX" },
  Greece: { code: "+30", flag: "🇬🇷", digits: [10], pattern: "XX XXXX XXXX" },
  Hungary: { code: "+36", flag: "🇭🇺", digits: [9], pattern: "XX XXX XXXX" },
  India: { code: "+91", flag: "🇮🇳", digits: [10], pattern: "XXXXX XXXXX" },
  Indonesia: {
    code: "+62",
    flag: "🇮🇩",
    digits: [9, 10, 11],
    pattern: "XXX XXXX XXXX",
  },
  Iran: { code: "+98", flag: "🇮🇷", digits: [10], pattern: "XXX XXX XXXX" },
  Iraq: { code: "+964", flag: "🇮🇶", digits: [10], pattern: "XXX XXX XXXX" },
  Ireland: { code: "+353", flag: "🇮🇪", digits: [9], pattern: "XX XXX XXXX" },
  Israel: { code: "+972", flag: "🇮🇱", digits: [9], pattern: "XX-XXX-XXXX" },
  Italy: { code: "+39", flag: "🇮🇹", digits: [9, 10], pattern: "XXX XXX XXXX" },
  Japan: { code: "+81", flag: "🇯🇵", digits: [10, 11], pattern: "XX-XXXX-XXXX" },
  Jordan: { code: "+962", flag: "🇯🇴", digits: [9], pattern: "X XXXX XXXX" },
  Kenya: { code: "+254", flag: "🇰🇪", digits: [9], pattern: "XXX XXX XXX" },
  Lebanon: { code: "+961", flag: "🇱🇧", digits: [7, 8], pattern: "XX XXX XXX" },
  Malaysia: {
    code: "+60",
    flag: "🇲🇾",
    digits: [9, 10],
    pattern: "XX-XXXX XXXX",
  },
  Mexico: { code: "+52", flag: "🇲🇽", digits: [10], pattern: "XXX XXX XXXX" },
  Morocco: { code: "+212", flag: "🇲🇦", digits: [9], pattern: "XXX-XXXXXX" },
  Mozambique: { code: "+258", flag: "🇲🇿", digits: [9], pattern: "XX XXX XXXX" },
  Myanmar: { code: "+95", flag: "🇲🇲", digits: [8, 9], pattern: "X XXX XXXX" },
  Nepal: { code: "+977", flag: "🇳🇵", digits: [10], pattern: "XX-XXXXXXX" },
  Netherlands: { code: "+31", flag: "🇳🇱", digits: [9], pattern: "XX XXX XXXX" },
  "New Zealand": {
    code: "+64",
    flag: "🇳🇿",
    digits: [8, 9],
    pattern: "XX XXX XXXX",
  },
  Nigeria: { code: "+234", flag: "🇳🇬", digits: [10], pattern: "XXX XXX XXXX" },
  Norway: { code: "+47", flag: "🇳🇴", digits: [8], pattern: "XXX XX XXX" },
  Pakistan: { code: "+92", flag: "🇵🇰", digits: [10], pattern: "XXX XXXXXXX" },
  Peru: { code: "+51", flag: "🇵🇪", digits: [9], pattern: "XXX XXX XXX" },
  Philippines: {
    code: "+63",
    flag: "🇵🇭",
    digits: [10],
    pattern: "XXX XXX XXXX",
  },
  Poland: { code: "+48", flag: "🇵🇱", digits: [9], pattern: "XXX XXX XXX" },
  Portugal: { code: "+351", flag: "🇵🇹", digits: [9], pattern: "XXX XXX XXX" },
  Qatar: { code: "+974", flag: "🇶🇦", digits: [8], pattern: "XXXX XXXX" },
  Romania: { code: "+40", flag: "🇷🇴", digits: [9], pattern: "XXX XXX XXX" },
  Russia: { code: "+7", flag: "🇷🇺", digits: [10], pattern: "XXX XXX XX XX" },
  Rwanda: { code: "+250", flag: "🇷🇼", digits: [9], pattern: "XXX XXX XXX" },
  "Saudi Arabia": {
    code: "+966",
    flag: "🇸🇦",
    digits: [9],
    pattern: "XX XXX XXXX",
  },
  Senegal: { code: "+221", flag: "🇸🇳", digits: [9], pattern: "XX XXX XX XX" },
  Serbia: { code: "+381", flag: "🇷🇸", digits: [9], pattern: "XX XXX XXXX" },
  Singapore: { code: "+65", flag: "🇸🇬", digits: [8], pattern: "XXXX XXXX" },
  "South Africa": {
    code: "+27",
    flag: "🇿🇦",
    digits: [9],
    pattern: "XX XXX XXXX",
  },
  "South Korea": {
    code: "+82",
    flag: "🇰🇷",
    digits: [9, 10],
    pattern: "XX-XXXX-XXXX",
  },
  Spain: { code: "+34", flag: "🇪🇸", digits: [9], pattern: "XXX XXX XXX" },
  "Sri Lanka": { code: "+94", flag: "🇱🇰", digits: [9], pattern: "XX XXX XXXX" },
  Sudan: { code: "+249", flag: "🇸🇩", digits: [9], pattern: "XXX XXX XXXX" },
  Sweden: { code: "+46", flag: "🇸🇪", digits: [9], pattern: "XX-XXX XXXX" },
  Switzerland: {
    code: "+41",
    flag: "🇨🇭",
    digits: [9],
    pattern: "XX XXX XX XX",
  },
  Taiwan: { code: "+886", flag: "🇹🇼", digits: [9], pattern: "X XXXX XXXX" },
  Tanzania: { code: "+255", flag: "🇹🇿", digits: [9], pattern: "XXX XXX XXX" },
  Thailand: { code: "+66", flag: "🇹🇭", digits: [9], pattern: "XX XXX XXXX" },
  Tunisia: { code: "+216", flag: "🇹🇳", digits: [8], pattern: "XX XXX XXX" },
  Turkey: { code: "+90", flag: "🇹🇷", digits: [10], pattern: "XXX XXX XX XX" },
  Uganda: { code: "+256", flag: "🇺🇬", digits: [9], pattern: "XXX XXX XXX" },
  Ukraine: { code: "+380", flag: "🇺🇦", digits: [9], pattern: "XX XXX XX XX" },
  "United Arab Emirates": {
    code: "+971",
    flag: "🇦🇪",
    digits: [9],
    pattern: "XX XXX XXXX",
  },
  "United Kingdom": {
    code: "+44",
    flag: "🇬🇧",
    digits: [10],
    pattern: "XXXX XXXXXX",
  },
  "United States": {
    code: "+1",
    flag: "🇺🇸",
    digits: [10],
    pattern: "(XXX) XXX-XXXX",
  },
  Uruguay: { code: "+598", flag: "🇺🇾", digits: [8], pattern: "X XXX XXXX" },
  Venezuela: { code: "+58", flag: "🇻🇪", digits: [10], pattern: "XXX-XXXXXXX" },
  Vietnam: {
    code: "+84",
    flag: "🇻🇳",
    digits: [9, 10],
    pattern: "XXX XXX XXXX",
  },
  Yemen: { code: "+967", flag: "🇾🇪", digits: [9], pattern: "XXX XXX XXX" },
  Zambia: { code: "+260", flag: "🇿🇲", digits: [9], pattern: "XXX XXX XXX" },
  Zimbabwe: { code: "+263", flag: "🇿🇼", digits: [9], pattern: "XX XXX XXXX" },
};
const COUNTRIES = Object.keys(COUNTRY_PHONE_DATA).sort();

/* ═══════════════════════════════════════════
   PERSISTENCE
═══════════════════════════════════════════ */
const STORE = "sm_submitted_v2";
const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(STORE) || "{}");
  } catch {
    return {};
  }
};
const hasSubmitted = (k) => !!getSaved()[k];
const markSubmitted = (k) => {
  const o = getSaved();
  o[k] = Date.now();
  try {
    localStorage.setItem(STORE, JSON.stringify(o));
  } catch {}
};

/* ═══════════════════════════════════════════
   VALIDATION
═══════════════════════════════════════════ */
function validatePhone(phone, country) {
  if (!phone?.trim()) return { valid: false, msg: "Phone number is required" };
  const digits = phone.replace(/\D/g, "");
  if (!digits.length) return { valid: false, msg: "Phone number is required" };
  if (!/^\+?[\d\s\-().]+$/.test(phone.trim()))
    return {
      valid: false,
      msg: "Only digits, spaces, dashes & brackets allowed",
    };
  if (country && COUNTRY_PHONE_DATA[country]) {
    const { digits: allowed, code } = COUNTRY_PHONE_DATA[country];
    if (!allowed.includes(digits.length)) {
      const exp =
        allowed.length === 1
          ? `${allowed[0]} digits`
          : `${allowed.join(" or ")} digits`;
      return {
        valid: false,
        msg: `${country} needs ${exp} after ${code} — you entered ${digits.length}`,
      };
    }
  } else if (digits.length < 6)
    return { valid: false, msg: "Phone number seems too short" };
  return { valid: true };
}

function validateBase(fields) {
  const errs = {};
  const n = (fields.fullName || "").trim();
  if (!n) errs.fullName = "Full name is required";
  else if (n.length < 3) errs.fullName = "Name is too short";
  else if (n.split(/\s+/).length < 2)
    errs.fullName = "Please enter first and last name";
  else if (/\d/.test(n)) errs.fullName = "Name should not contain numbers";
  if (!fields.country) errs.country = "Please select your country";
  const ph = validatePhone(fields.phone, fields.country);
  if (!ph.valid) errs.phone = ph.msg;
  const st = (fields.street || "").trim();
  if (!st) errs.street = "Street address is required";
  else if (st.length < 5) errs.street = "Please enter your full address";
  const ci = (fields.city || "").trim();
  if (!ci) errs.city = "City is required";
  else if (/\d/.test(ci)) errs.city = "City name should not contain numbers";
  const sv = (fields.state || "").trim();
  if (!sv) errs.state = "State / Province is required";
  return errs;
}

function getAlerts(errs) {
  const L = {
    fullName: "Full Name",
    phone: "Phone Number",
    country: "Country",
    street: "Street Address",
    city: "City",
    state: "State / Province",
    testimony: "Testimony",
    prayer: "Prayer Request",
    shareConsent: "Sharing Preference",
  };
  const missingWords = ["required", "select", "indicate", "enter"];
  return Object.entries(errs).map(([k, msg]) => ({
    type: missingWords.some((w) => msg.toLowerCase().includes(w))
      ? "missing"
      : "invalid",
    label: L[k] || k,
    detail: msg,
  }));
}

/* ═══════════════════════════════════════════
   API
═══════════════════════════════════════════ */
async function postForm(data, files = [], onError) {
  try {
    const formData = new FormData();

    // append normal fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // append files
    files.forEach((file) => {
      if (file) formData.append("attachments", file);
    });

    const res = await fetch(FORMSPREE, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const d = await res.json();
      onError?.([
        {
          type: "invalid",
          label: "Submission Failed",
          detail: d.error || "Please try again",
        },
      ]);
      return false;
    }

    return true;
  } catch {
    onError?.([
      {
        type: "invalid",
        label: "Network Error",
        detail: "Check your connection and try again",
      },
    ]);
    return false;
  }
}

/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useVW() {
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 768,
  );
  useEffect(() => {
    const h = () => setVw(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return vw;
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    const go = () => {
      setOnline(true);
      setBanner("online");
      setTimeout(() => setBanner(null), 3000);
    };
    const no = () => {
      setOnline(false);
      setBanner("offline");
    };
    window.addEventListener("online", go);
    window.addEventListener("offline", no);
    return () => {
      window.removeEventListener("online", go);
      window.removeEventListener("offline", no);
    };
  }, []);
  return { online, banner };
}

function useFields() {
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    testimony: "",
    prayer: "",
    shareConsent: null,
  });
  const [errors, setErrors] = useState({});
  const set = useCallback((k, v) => {
    setFields((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k];
      return n;
    });
  }, []);
  return { fields, errors, setErrors, set };
}

/* ═══════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════ */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf;
    const ps = [];
    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    class P {
      reset(r) {
        this.x = Math.random() * W;
        this.y = r ? Math.random() * H : H + 10;
        this.vx = (Math.random() - 0.5) * 0.28;
        this.vy = -(0.16 + Math.random() * 0.5);
        this.r = 0.45 + Math.random() * 1.55;
        this.maxA = 0.08 + Math.random() * 0.38;
        this.a = r ? Math.random() * this.maxA : 0;
        this.t = 0;
        this.maxT = 200 + Math.random() * 280;
        this.gold = Math.random() < 0.6;
      }
      constructor() {
        this.reset(true);
      }
      tick() {
        this.t++;
        this.x += this.vx;
        this.y += this.vy;
        const rt = this.t / this.maxT;
        this.a =
          rt < 0.15
            ? (rt / 0.15) * this.maxA
            : rt > 0.75
              ? ((1 - rt) / 0.25) * this.maxA
              : this.maxA;
        if (this.t >= this.maxT || this.y < -12) this.reset(false);
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.a;
        const col = this.gold ? "#C9A86C" : "#F5DFA0";
        ctx.fillStyle = col;
        ctx.shadowBlur = this.r * 6;
        ctx.shadowColor = col;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    for (let i = 0; i < 90; i++) ps.push(new P());
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p) => {
        p.tick();
        p.draw();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   NETWORK BANNER
═══════════════════════════════════════════ */
function NetworkBanner({ banner }) {
  if (!banner) return null;
  return (
    <div className={`network-banner ${banner}`}>
      {banner === "offline"
        ? "⚠  You are offline — form submissions will not go through"
        : "✓  Connection restored — you're back online"}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ERROR DIALOG
═══════════════════════════════════════════ */
function ErrDialog({ alerts, onClose }) {
  const vw = useVW();
  if (!alerts?.length) return null;
  const isInvalid = alerts.some((a) => a.type === "invalid");
  const accent = isInvalid ? "#E05555" : "#C9A86C";
  const ab = isInvalid ? "rgba(224,85,85,0.22)" : "rgba(201,168,108,0.22)";
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9990,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(4,3,10,0.9)",
        backdropFilter: "blur(16px)",
        padding: "1rem",
        animation: "fadeIn .2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(13,10,28,0.99)",
          border: `1px solid ${ab}`,
          borderRadius: vw < 420 ? 20 : 28,
          padding: vw < 420 ? "1.8rem 1.4rem" : "2.8rem 2.4rem 2.2rem",
          maxWidth: 460,
          width: "100%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 60px 120px rgba(0,0,0,0.95)",
          animation: "scaleIn .3s var(--ease)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg,transparent,${accent},transparent)`,
          }}
        />
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 1.6rem",
            borderRadius: "50%",
            border: `1.5px solid ${ab}`,
            background: isInvalid
              ? "rgba(224,85,85,0.07)"
              : "rgba(201,168,108,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {isInvalid ? (
              <>
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke={accent}
                  strokeWidth="1.5"
                />
                <line
                  x1="12"
                  y1="7"
                  x2="12"
                  y2="13"
                  stroke={accent}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1.2" fill={accent} />
              </>
            ) : (
              <>
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke={accent}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="9"
                  x2="12"
                  y2="13"
                  stroke={accent}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1.2" fill={accent} />
              </>
            )}
          </svg>
        </div>
        <h3
          style={{
            fontFamily: "var(--f-display)",
            fontSize: vw < 420 ? "1.05rem" : "1.25rem",
            fontWeight: 500,
            color: "var(--cream)",
            textAlign: "center",
            letterSpacing: ".07em",
            marginBottom: ".4rem",
          }}
        >
          {isInvalid ? "Please Fix These Errors" : "Required Fields Missing"}
        </h3>
        <p
          style={{
            color: "var(--muted)",
            fontSize: ".82rem",
            textAlign: "center",
            fontFamily: "var(--f-serif)",
            fontStyle: "italic",
            lineHeight: 1.65,
            marginBottom: "1.4rem",
          }}
        >
          {isInvalid
            ? "Please review and correct the details below."
            : "Please fill in all required fields before submitting."}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".45rem",
            marginBottom: "1.4rem",
          }}
        >
          {alerts.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: ".7rem",
                padding: ".65rem .85rem",
                background:
                  a.type === "invalid"
                    ? "rgba(224,85,85,0.06)"
                    : "rgba(201,168,108,0.05)",
                border: `1px solid ${a.type === "invalid" ? "rgba(224,85,85,0.16)" : "rgba(201,168,108,0.13)"}`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  flexShrink: 0,
                  marginTop: 1,
                  background:
                    a.type === "invalid"
                      ? "rgba(224,85,85,0.14)"
                      : "rgba(201,168,108,0.1)",
                  border: `1px solid ${a.type === "invalid" ? "rgba(224,85,85,0.3)" : "rgba(201,168,108,0.28)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {a.type === "invalid" ? (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path
                      d="M1.5 1.5l5 5M6.5 1.5l-5 5"
                      stroke="#E05555"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "var(--gold)",
                    }}
                  />
                )}
              </div>
              <div>
                <p
                  style={{
                    fontSize: ".74rem",
                    fontWeight: 600,
                    fontFamily: "var(--f-body)",
                    color: a.type === "invalid" ? "#F0A0A0" : "var(--gold3)",
                    marginBottom: ".1rem",
                  }}
                >
                  {a.label}
                </p>
                <p
                  style={{
                    fontSize: ".7rem",
                    color: "var(--muted)",
                    fontFamily: "var(--f-serif)",
                    fontStyle: "italic",
                    lineHeight: 1.45,
                  }}
                >
                  {a.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: ".9rem",
            background: isInvalid
              ? "linear-gradient(135deg,#8B1A1A,#E05555 55%,#F08080)"
              : "linear-gradient(135deg,#6A3A08,#C9A86C 55%,#F5DFA0)",
            border: "none",
            borderRadius: 12,
            color: "#04030A",
            fontFamily: "var(--f-display)",
            fontSize: ".66rem",
            fontWeight: 600,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "transform .25s,box-shadow .25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 12px 40px ${isInvalid ? "rgba(224,85,85,0.4)" : "rgba(201,168,108,0.4)"}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {isInvalid ? "Fix Errors →" : "Got It →"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COUNTRY SELECTOR
═══════════════════════════════════════════ */
function CountrySelect({ value, onChange, hasError }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const sRef = useRef(null);
  const vw = useVW();
  const filtered = useMemo(
    () =>
      COUNTRIES.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => {
    if (open && vw >= 640 && sRef.current)
      setTimeout(() => sRef.current?.focus(), 50);
  }, [open, vw]);
  const d = value ? COUNTRY_PHONE_DATA[value] : null;
  return (
    <div ref={ref} style={{ position: "relative", marginBottom: "1.4rem" }}>
      <div
        style={{
          fontSize: ".6rem",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "var(--gold)",
          opacity: 0.7,
          marginBottom: ".48rem",
          fontFamily: "var(--f-display)",
          fontWeight: 400,
        }}
      >
        Country <span style={{ color: "var(--gold)" }}>*</span>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: ".6rem",
          background: "rgba(255,255,255,0.032)",
          border: `1.5px solid ${open ? "rgba(201,168,108,0.55)" : hasError ? "rgba(224,85,85,0.42)" : "rgba(201,168,108,0.13)"}`,
          borderRadius: "var(--r)",
          padding: ".92rem 1rem",
          cursor: "pointer",
          color: value ? "var(--cream)" : "var(--muted)",
          fontFamily: "var(--f-serif)",
          fontSize: "1rem",
          fontWeight: 400,
          textAlign: "left",
          transition: "all .3s",
          boxShadow: open
            ? "0 0 0 3px rgba(201,168,108,0.09)"
            : hasError
              ? "0 0 0 3px rgba(224,85,85,0.08)"
              : "none",
        }}
      >
        {d && (
          <span style={{ fontSize: "1.1rem", lineHeight: 1, flexShrink: 0 }}>
            {d.flag}
          </span>
        )}
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "Select your country"}
        </span>
        {d && (
          <span
            style={{
              fontSize: ".7rem",
              color: "var(--gold)",
              fontFamily: "var(--f-body)",
              flexShrink: 0,
            }}
          >
            {d.code}
          </span>
        )}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(201,168,108,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .25s",
            flexShrink: 0,
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 7px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "rgba(10,7,22,0.99)",
            border: "1px solid rgba(201,168,108,0.2)",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 32px 72px rgba(0,0,0,0.85)",
            backdropFilter: "blur(30px)",
            animation: "scaleIn .2s var(--ease)",
          }}
        >
          <div style={{ padding: ".55rem .55rem .3rem" }}>
            <div style={{ position: "relative" }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(201,168,108,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  position: "absolute",
                  left: 9,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={sRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country…"
                className="field-input"
                style={{
                  paddingLeft: "2rem",
                  paddingTop: ".52rem",
                  paddingBottom: ".52rem",
                  fontSize: ".82rem",
                }}
              />
            </div>
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.map((c) => {
              const cd = COUNTRY_PHONE_DATA[c];
              const sel = value === c;
              return (
                <div
                  key={c}
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".6rem",
                    padding: ".58rem .9rem",
                    cursor: "pointer",
                    background: sel ? "rgba(201,168,108,0.1)" : "transparent",
                    color: sel ? "var(--gold3)" : "var(--muted2)",
                    fontSize: ".85rem",
                    fontFamily: "var(--f-body)",
                    fontWeight: 300,
                    transition: "background .14s",
                  }}
                  onMouseEnter={(e) => {
                    if (!sel)
                      e.currentTarget.style.background =
                        "rgba(201,168,108,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!sel) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}
                  >
                    {cd.flag}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c}
                  </span>
                  <span
                    style={{
                      fontSize: ".68rem",
                      color: "var(--gold)",
                      opacity: 0.6,
                      flexShrink: 0,
                    }}
                  >
                    {cd.code}
                  </span>
                </div>
              );
            })}
            {!filtered.length && (
              <div
                style={{
                  padding: "1.2rem",
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: ".82rem",
                }}
              >
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
      {hasError && (
        <p
          style={{
            marginTop: ".3rem",
            fontSize: ".64rem",
            color: "var(--error)",
            fontFamily: "var(--f-body)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ErrIcon /> Please select your country
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════ */
const ErrIcon = () => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 10 10"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <circle cx="5" cy="5" r="4.5" stroke="var(--error)" strokeWidth="1" />
    <line
      x1="5"
      y1="3"
      x2="5"
      y2="5.5"
      stroke="var(--error)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="5" cy="7" r=".6" fill="var(--error)" />
  </svg>
);

function FloatField({ label, required, isTextarea, error, children }) {
  const [focused, setFocused] = useState(false);
  const [hasVal, setHasVal] = useState(false);
  const raised = focused || hasVal;
  const child = React.cloneElement(children, {
    onFocus: (e) => {
      setFocused(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e) => {
      setFocused(false);
      setHasVal(!!e.target.value);
      children.props.onBlur?.(e);
    },
    onChange: (e) => {
      setHasVal(!!e.target.value);
      children.props.onChange?.(e);
    },
  });
  return (
    <div
      style={{
        position: "relative",
        marginBottom: error ? "2.1rem" : "1.45rem",
      }}
    >
      {child}
      <span
        style={{
          position: "absolute",
          left: "1rem",
          pointerEvents: "none",
          zIndex: 1,
          fontFamily: "var(--f-body)",
          fontWeight: 300,
          transition: "all .22s cubic-bezier(.4,0,.2,1)",
          ...(raised
            ? {
                top: ".22rem",
                fontSize: ".56rem",
                color: error ? "var(--error)" : "var(--gold)",
                letterSpacing: ".14em",
                textTransform: "uppercase",
              }
            : isTextarea
              ? { top: "1.15rem", fontSize: ".88rem", color: "var(--muted)" }
              : {
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: ".88rem",
                  color: "var(--muted)",
                }),
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: error ? "var(--error)" : "var(--gold)",
              marginLeft: 2,
            }}
          >
            *
          </span>
        )}
      </span>
      {error && (
        <p
          style={{
            position: "absolute",
            bottom: -18,
            left: 4,
            fontSize: ".63rem",
            color: "var(--error)",
            fontFamily: "var(--f-body)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            maxWidth: "100%",
            textOverflow: "ellipsis",
          }}
        >
          <ErrIcon />
          {error}
        </p>
      )}
    </div>
  );
}

const iBase = (err) => ({
  width: "100%",
  background: "rgba(255,255,255,0.032)",
  border: `1.5px solid ${err ? "rgba(224,85,85,0.42)" : "rgba(201,168,108,0.13)"}`,
  borderRadius: "var(--r)",
  padding: "1.1rem 1rem 0.4rem",
  color: "var(--cream)",
  fontFamily: "var(--f-serif)",
  fontSize: ".96rem",
  fontWeight: 400,
  outline: "none",
  appearance: "none",
  caretColor: "var(--gold)",
  transition: "border-color .25s,background .25s,box-shadow .25s",
  boxShadow: err ? "0 0 0 3px rgba(224,85,85,0.08)" : "none",
});

function Divider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: ".65rem",
        margin: "1rem 0",
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: 52,
          height: 1,
          background:
            "linear-gradient(90deg,transparent,rgba(201,168,108,0.38))",
        }}
      />
      {[0.2, 0.65, 0.2].map((o, i) => (
        <div
          key={i}
          style={{
            width: i === 1 ? 5 : 4,
            height: i === 1 ? 5 : 4,
            background: "var(--gold)",
            transform: "rotate(45deg)",
            opacity: o,
            margin: i !== 1 ? "0 -2px" : 0,
          }}
        />
      ))}
      <div
        style={{
          flex: 1,
          maxWidth: 52,
          height: 1,
          background:
            "linear-gradient(90deg,rgba(201,168,108,0.38),transparent)",
        }}
      />
    </div>
  );
}

function ProgressBar({ fields, extras = [] }) {
  const keys = [
    "fullName",
    "phone",
    "country",
    "street",
    "city",
    "state",
    ...extras,
  ];
  const filled = keys.filter(
    (k) =>
      fields[k] && (typeof fields[k] === "string" ? fields[k].trim() : true),
  ).length;
  const pct = Math.round((filled / keys.length) * 100);
  const full = pct === 100;
  return (
    <div style={{ marginBottom: "1.8rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".4rem",
        }}
      >
        <span
          style={{
            fontSize: ".58rem",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            color: "rgba(201,168,108,0.42)",
            fontFamily: "var(--f-display)",
          }}
        >
          Form completion
        </span>
        <span
          style={{
            fontSize: ".66rem",
            fontFamily: "var(--f-body)",
            fontWeight: full ? 600 : 300,
            color: full ? "var(--gold)" : "var(--muted)",
            transition: "color .3s",
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        style={{
          height: 2.5,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 4,
            width: `${pct}%`,
            background: full
              ? "linear-gradient(90deg,#6A3A08,#F5DFA0)"
              : "linear-gradient(90deg,#6A3A08,#C9A86C)",
            transition: "width .5s cubic-bezier(.4,0,.2,1)",
            boxShadow: pct > 0 ? "0 0 14px rgba(201,168,108,0.42)" : "none",
          }}
        />
      </div>
    </div>
  );
}

function RadioGroup({ label, options, value, onChange }) {
  const vw = useVW();
  return (
    <div style={{ marginBottom: "1.4rem" }}>
      <p
        style={{
          fontSize: ".59rem",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "var(--gold)",
          opacity: 0.7,
          marginBottom: ".7rem",
          fontFamily: "var(--f-display)",
          fontWeight: 400,
        }}
      >
        {label}
      </p>
      <div
        style={{
          display: "flex",
          gap: ".55rem",
          flexDirection: vw < 380 ? "column" : "row",
        }}
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`radio-opt${value === opt.value ? " selected" : ""}`}
          >
            <div className="radio-dot">
              <div
                className="radio-dot-inner"
                style={{
                  transform: value === opt.value ? "scale(1)" : "scale(0)",
                }}
              />
            </div>
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function FileUpload({ label, accept, onFileChange }) {
  const [file, setFile] = useState(null);
  return (
    <div style={{ marginBottom: "1.3rem" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: ".75rem",
          padding: ".82rem 1rem",
          background: file
            ? "rgba(201,168,108,0.04)"
            : "rgba(255,255,255,0.02)",
          border: `1.5px ${file ? "solid" : "dashed"} ${file ? "rgba(201,168,108,0.4)" : "rgba(201,168,108,0.18)"}`,
          borderRadius: "var(--r)",
          cursor: "pointer",
          color: file ? "var(--gold3)" : "var(--muted)",
          fontSize: ".85rem",
          fontFamily: "var(--f-body)",
          fontWeight: 300,
          transition: "all .25s",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {file ? `✓ ${file}` : `Upload ${label}`}
        </span>
        {file && (
          <span
            onClick={(e) => {
              e.preventDefault();
              setFile(null);
              onFileChange?.(null);
            }}
            style={{
              fontSize: ".68rem",
              opacity: 0.5,
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            ✕ Remove
          </span>
        )}
        <input
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files[0];
            setFile(f);
            setFileName(f?.name || null);
            onFileChange?.(f || null);
          }}
        />
      </label>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BASE FIELDS
═══════════════════════════════════════════ */
function BaseFields({ fields, errors, set }) {
  const vw = useVW();
  const mob = vw < 520;
  const cd = fields.country ? COUNTRY_PHONE_DATA[fields.country] : null;
  return (
    <>
      <FloatField label="Full Name" required error={errors.fullName}>
        <input
          type="text"
          value={fields.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          className={`field-input${errors.fullName ? " has-error" : ""}`}
          style={iBase(!!errors.fullName)}
        />
      </FloatField>

      <FloatField label="Email Address" error={errors.email}>
        <input
          type="email"
          value={fields.email}
          onChange={(e) => set("email", e.target.value)}
          className="field-input"
          style={iBase(false)}
        />
      </FloatField>

      <CountrySelect
        value={fields.country}
        onChange={(v) => set("country", v)}
        hasError={!!errors.country}
      />

      <div style={{ marginBottom: "1.45rem" }}>
        <p
          style={{
            fontSize: ".6rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--gold)",
            opacity: 0.7,
            marginBottom: ".48rem",
            fontFamily: "var(--f-display)",
            fontWeight: 400,
            display: "flex",
            flexWrap: "wrap",
            gap: ".3rem .5rem",
            alignItems: "center",
          }}
        >
          <span>
            Phone / Mobile <span style={{ color: "var(--gold)" }}>*</span>
          </span>
          {cd && (
            <span
              style={{
                color: "rgba(201,168,108,0.4)",
                letterSpacing: ".04em",
                fontSize: ".56rem",
                textTransform: "none",
                fontWeight: 300,
                fontFamily: "var(--f-body)",
              }}
            >
              {cd.code} · {cd.pattern}
            </span>
          )}
        </p>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: errors.phone
                ? "rgba(224,85,85,0.07)"
                : "rgba(201,168,108,0.07)",
              border: `1.5px solid ${errors.phone ? "rgba(224,85,85,0.35)" : "rgba(201,168,108,0.2)"}`,
              borderRight: "none",
              borderRadius: "var(--r) 0 0 var(--r)",
              padding: "0 .7rem",
              minWidth: cd ? 58 : 50,
              flexShrink: 0,
              color: errors.phone ? "#F09090" : "var(--gold2)",
              fontSize: vw < 380 ? ".74rem" : ".8rem",
              fontFamily: "var(--f-body)",
              fontWeight: 400,
              transition: "all .3s",
            }}
          >
            {cd?.code || "+–"}
          </div>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder={
              cd
                ? `e.g. ${cd.pattern.replace(/X/g, "0")}`
                : "Select country first"
            }
            className={`field-input${errors.phone ? " has-error" : ""}`}
            style={{
              ...iBase(!!errors.phone),
              borderRadius: "0 var(--r) var(--r) 0",
              borderLeft: "none",
              flex: 1,
              padding: ".92rem .9rem",
            }}
          />
        </div>
        {errors.phone && (
          <p
            style={{
              marginTop: ".3rem",
              fontSize: ".63rem",
              color: "var(--error)",
              fontFamily: "var(--f-body)",
              display: "flex",
              alignItems: "flex-start",
              gap: 4,
              lineHeight: 1.4,
            }}
          >
            <ErrIcon />
            {errors.phone}
          </p>
        )}
      </div>

      <p
        style={{
          fontSize: ".6rem",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "var(--gold)",
          opacity: 0.55,
          margin: ".1rem 0 .8rem",
          fontFamily: "var(--f-display)",
          fontWeight: 400,
        }}
      >
        Address Information
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: ".8rem",
        }}
      >
        <FloatField label="Street Address" required error={errors.street}>
          <input
            type="text"
            value={fields.street}
            onChange={(e) => set("street", e.target.value)}
            className={`field-input${errors.street ? " has-error" : ""}`}
            style={iBase(!!errors.street)}
          />
        </FloatField>
        <FloatField label="City" required error={errors.city}>
          <input
            type="text"
            value={fields.city}
            onChange={(e) => set("city", e.target.value)}
            className={`field-input${errors.city ? " has-error" : ""}`}
            style={iBase(!!errors.city)}
          />
        </FloatField>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: ".8rem",
        }}
      >
        <FloatField label="State / Province" required error={errors.state}>
          <input
            type="text"
            value={fields.state}
            onChange={(e) => set("state", e.target.value)}
            className={`field-input${errors.state ? " has-error" : ""}`}
            style={iBase(!!errors.state)}
          />
        </FloatField>
        <FloatField label="Zip / Postal (optional)">
          <input
            type="text"
            value={fields.zip}
            onChange={(e) => set("zip", e.target.value)}
            className="field-input"
            style={iBase(false)}
          />
        </FloatField>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS SCREEN
═══════════════════════════════════════════ */
function SuccessScreen({ title, body, onReset, blocked }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem 0",
        animation: "scaleIn .5s var(--ease) both",
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          margin: "0 auto 2rem",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(201,168,108,0.28),transparent 70%)",
            animation: "glow 3s ease-in-out infinite",
          }}
        />
        {[0, 0.55, 1.1].map((d) => (
          <div
            key={d}
            style={{
              position: "absolute",
              inset: -7,
              borderRadius: "50%",
              border: "1px solid rgba(201,168,108,0.18)",
              animation: `ripple 2.9s ease-out ${d}s infinite`,
            }}
          />
        ))}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1.5px solid rgba(201,168,108,0.42)",
            background: "rgba(201,168,108,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24">
            <polyline
              points="20 6 9 17 4 12"
              stroke="var(--gold3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 55,
                strokeDashoffset: 55,
                animation: "checkDraw .7s .2s ease forwards",
              }}
            />
          </svg>
        </div>
      </div>
      <h3
        style={{
          fontFamily: "var(--f-display)",
          fontSize: "clamp(1.5rem,5vw,2.2rem)",
          fontWeight: 500,
          color: "var(--cream)",
          marginBottom: ".65rem",
          letterSpacing: ".09em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--muted)",
          fontSize: ".9rem",
          fontFamily: "var(--f-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.8,
          maxWidth: 300,
          margin: "0 auto",
        }}
      >
        {body}
      </p>
      {!blocked && (
        <button
          onClick={onReset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".4rem",
            marginTop: "1.8rem",
            padding: ".55rem 1.4rem",
            background: "none",
            border: "1px solid rgba(201,168,108,0.2)",
            borderRadius: 10,
            color: "var(--gold)",
            fontFamily: "var(--f-display)",
            fontSize: ".63rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all .25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(201,168,108,0.5)";
            e.currentTarget.style.color = "var(--gold3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(201,168,108,0.2)";
            e.currentTarget.style.color = "var(--gold)";
          }}
        >
          ← Submit another
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SPINNER
═══════════════════════════════════════════ */
function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        border: "2px solid rgba(4,3,10,0.3)",
        borderTopColor: "rgba(4,3,10,0.85)",
        borderRadius: "50%",
        animation: "rotate360 .7s linear infinite",
        verticalAlign: "middle",
        marginRight: 8,
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   FORM CARD
═══════════════════════════════════════════ */
function FormCard({
  eyebrow,
  title,
  description,
  submitLabel,
  successTitle,
  successBody,
  formKey,
  children,
  onSubmit,
  online,
}) {
  const [done, setDone] = useState(false);
  const [blocked] = useState(() => hasSubmitted(formKey));
  const [loading, setLoading] = useState(false);
  const vw = useVW();
  const pad =
    vw < 400 ? "1.6rem 1.2rem" : vw < 560 ? "2rem 1.6rem" : "2.8rem 2.6rem";

  const handleSubmit = async () => {
    if (!online) return;
    setLoading(true);
    const ok = await onSubmit();
    setLoading(false);
    if (ok) {
      markSubmitted(formKey);
      setDone(true);
    }
  };

  return (
    <div
      style={{
        background: "rgba(13,10,28,0.97)",
        border: "1px solid rgba(201,168,108,0.16)",
        borderRadius: vw < 400 ? 20 : 28,
        padding: pad,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(50px)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02) inset,0 60px 120px rgba(0,0,0,0.75)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg,transparent 4%,#5A2A06 20%,#F5DFA0 50%,#5A2A06 80%,transparent 96%)",
          opacity: 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "60%",
          background:
            "radial-gradient(ellipse,rgba(201,168,108,0.04) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {vw >= 480 &&
        [
          { top: 14, left: 14 },
          { top: 14, right: 14, transform: "scaleX(-1)" },
          { bottom: 14, left: 14, transform: "scaleY(-1)" },
          { bottom: 14, right: 14, transform: "scale(-1)" },
        ].map((pos, i) => (
          <div key={i} style={{ position: "absolute", opacity: 0.28, ...pos }}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 34 34"
              fill="none"
              stroke="var(--gold)"
            >
              <path d="M2 32 L2 2 L32 2" strokeWidth=".9" />
              <path d="M7 27 L7 7 L27 7" strokeWidth=".6" opacity=".4" />
              <circle cx="2" cy="2" r="1.4" fill="var(--gold)" opacity=".5" />
            </svg>
          </div>
        ))}
      {done ? (
        <SuccessScreen
          title={successTitle}
          body={successBody}
          onReset={() => setDone(false)}
          blocked={blocked}
        />
      ) : (
        <>
          <div
            style={{
              textAlign: "center",
              marginBottom: vw < 480 ? "1.8rem" : "2.4rem",
            }}
          >
            <p
              style={{
                fontSize: ".6rem",
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "var(--gold)",
                opacity: 0.6,
                marginBottom: ".6rem",
                fontFamily: "var(--f-display)",
                fontWeight: 400,
              }}
            >
              {eyebrow}
            </p>
            <h2
              style={{
                fontFamily: "var(--f-serif)",
                fontSize: `clamp(${vw < 400 ? "1.7rem" : "2rem"},5vw,2.9rem)`,
                fontWeight: 400,
                color: "var(--cream)",
                lineHeight: 1.08,
                letterSpacing: ".02em",
              }}
            >
              {title}
            </h2>
            {description && (
              <p
                style={{
                  marginTop: ".45rem",
                  color: "var(--muted)",
                  fontSize: vw < 400 ? ".82rem" : ".88rem",
                  fontFamily: "var(--f-serif)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                }}
              >
                {description}
              </p>
            )}
            <Divider />
          </div>
          {children}
          {!online && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".55rem",
                padding: ".8rem 1rem",
                background: "rgba(224,85,85,0.06)",
                border: "1px solid rgba(224,85,85,0.2)",
                borderRadius: 12,
                marginBottom: "1.2rem",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E05555"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
              </svg>
              <span
                style={{
                  fontSize: ".72rem",
                  color: "#F09090",
                  fontFamily: "var(--f-body)",
                  fontWeight: 300,
                }}
              >
                You're offline. Please reconnect before submitting.
              </span>
            </div>
          )}
          <div style={{ marginTop: "1.8rem" }}>
            <button
              type="button"
              className="btn-gold"
              onClick={handleSubmit}
              disabled={loading || !online}
            >
              {loading ? (
                <>
                  <Spinner />
                  {submitLabel.replace("→", "")}
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   THE FOUR FORMS
═══════════════════════════════════════════ */
function AltarCallForm({ online }) {
  const { fields, errors, setErrors, set } = useFields();
  const [alert, setAlert] = useState(null);

  const validate = useCallback(() => {
    const errs = validateBase(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setAlert(getAlerts(errs));
      return false;
    }
    return true;
  }, [fields]);

  const submit = async () => {
    if (!validate()) return false;
    return postForm(
      {
        form_type: "Altar Call",
        full_name: fields.fullName,
        email: fields.email,
        phone: `${COUNTRY_PHONE_DATA[fields.country]?.code || ""}${fields.phone}`,
        country: fields.country,
        street: fields.street,
        city: fields.city,
        state: fields.state,
        zip: fields.zip,
        submitted_at: new Date().toISOString(),
      },
      setAlert,
    );
  };

  return (
    <>
      <ErrDialog alerts={alert} onClose={() => setAlert(null)} />
      <FormCard
        eyebrow="Take the first step"
        title={
          <>
            Welcome{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold2)" }}>Home</em>
          </>
        }
        description="Begin your journey of faith with Salvation Ministries today."
        submitLabel="Let's Get You Started →"
        successTitle="Welcome Home"
        successBody="God bless you as you keep on serving the Lord in Salvation Ministries."
        formKey="altar_call_v2"
        onSubmit={submit}
        online={online}
      >
        <ProgressBar fields={fields} />
        <BaseFields fields={fields} errors={errors} set={set} />
      </FormCard>
    </>
  );
}

function FirstTimerForm({ online }) {
  const { fields, errors, setErrors, set } = useFields();
  const [alert, setAlert] = useState(null);

  const validate = useCallback(() => {
    const errs = validateBase(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setAlert(getAlerts(errs));
      return false;
    }
    return true;
  }, [fields]);

  const submit = async () => {
    if (!validate()) return false;
    return postForm(
      {
        form_type: "First Timer",
        full_name: fields.fullName,
        email: fields.email,
        phone: `${COUNTRY_PHONE_DATA[fields.country]?.code || ""}${fields.phone}`,
        country: fields.country,
        street: fields.street,
        city: fields.city,
        state: fields.state,
        zip: fields.zip,
        share_consent: fields.shareConsent,
        submitted_at: new Date().toISOString(),
      },
      setAlert,
    );
  };

  return (
    <>
      <ErrDialog alerts={alert} onClose={() => setAlert(null)} />
      <FormCard
        eyebrow="We're so glad you joined us"
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--gold2)" }}>
              First
            </em>{" "}
            Timer
          </>
        }
        description="It was a blessing having you worship with us today."
        submitLabel="I'm Glad To Worship Here →"
        successTitle="So Glad You're Here"
        successBody="Thank you for worshipping with us. We'd love to welcome you home again."
        formKey="first_timer_v2"
        onSubmit={submit}
        online={online}
      >
        <ProgressBar fields={fields} />
        <BaseFields fields={fields} errors={errors} set={set} />
        <RadioGroup
          label="May we follow up with you this week?"
          options={[
            { value: "yes", label: "Yes, please" },
            { value: "no", label: "Not yet" },
          ]}
          value={fields.shareConsent}
          onChange={(v) => set("shareConsent", v)}
        />
      </FormCard>
    </>
  );
}

function TestimonyForm({ online }) {
  const { fields, errors, setErrors, set } = useFields();
  const [alert, setAlert] = useState(null);
  const [pic, setPic] = useState(null);
  const [att, setAtt] = useState(null);

  const validate = useCallback(() => {
    const errs = validateBase(fields);
    if (!fields.testimony.trim())
      errs.testimony = "Please share your testimony";
    if (!fields.shareConsent)
      errs.shareConsent = "Please indicate your sharing preference";
    if (Object.keys(errs).length) {
      setErrors(errs);
      setAlert(getAlerts(errs));
      return false;
    }
    return true;
  }, [fields]);

  const submit = async () => {
    if (!validate()) return false;
    return postForm(
      {
        form_type: "Testimony",
        full_name: fields.fullName,
        email: fields.email,
        phone: `${COUNTRY_PHONE_DATA[fields.country]?.code || ""}${fields.phone}`,
        country: fields.country,
        street: fields.street,
        city: fields.city,
        state: fields.state,
        zip: fields.zip,
        testimony: fields.testimony,
        share_consent: fields.shareConsent,
        submitted_at: new Date().toISOString(),
      },
      [pic, att],
      setAlert,
    );
  };

  return (
    <>
      <ErrDialog alerts={alert} onClose={() => setAlert(null)} />
      <FormCard
        eyebrow="Share what God has done"
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--gold2)" }}>Your</em>{" "}
            Testimony
          </>
        }
        description="Your story of faith carries power. Share it and let it inspire others."
        submitLabel="Share My Testimony →"
        successTitle="Thank You for Sharing"
        successBody="Your testimony is powerful. We are honoured you trusted us with your story."
        formKey="testimony_v2"
        onSubmit={submit}
        online={online}
      >
        <ProgressBar fields={fields} extras={["testimony"]} />
        <BaseFields fields={fields} errors={errors} set={set} />
        <FloatField
          label="Your Testimony"
          required
          isTextarea
          error={errors.testimony}
        >
          <textarea
            value={fields.testimony}
            onChange={(e) => set("testimony", e.target.value)}
            className={`field-input${errors.testimony ? " has-error" : ""}`}
            rows={4}
            style={{
              ...iBase(!!errors.testimony),
              paddingTop: "1.55rem",
              minHeight: 120,
              resize: "vertical",
              lineHeight: 1.7,
            }}
          />
        </FloatField>
        <FileUpload
          label="Your Picture (optional)"
          accept="image/*"
          onFileChange={setPic}
        />
        <FileUpload label="Related Files (optional)" onFileChange={setAtt} />
        <RadioGroup
          label="I agree my testimony may be shared on Salvation Ministries platforms."
          options={[
            { value: "yes", label: "Yes, I agree" },
            { value: "no", label: "Keep private" },
          ]}
          value={fields.shareConsent}
          onChange={(v) => set("shareConsent", v)}
        />
        {errors.shareConsent && (
          <p
            style={{
              marginTop: "-.9rem",
              marginBottom: ".8rem",
              fontSize: ".63rem",
              color: "var(--error)",
              fontFamily: "var(--f-body)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <ErrIcon />
            {errors.shareConsent}
          </p>
        )}
      </FormCard>
    </>
  );
}

function PrayerForm({ online }) {
  const { fields, errors, setErrors, set } = useFields();
  const [alert, setAlert] = useState(null);

  const validate = useCallback(() => {
    const errs = validateBase(fields);
    if (!fields.prayer.trim()) errs.prayer = "Please share your prayer request";
    if (Object.keys(errs).length) {
      setErrors(errs);
      setAlert(getAlerts(errs));
      return false;
    }
    return true;
  }, [fields]);

  const submit = async () => {
    if (!validate()) return false;
    return postForm(
      {
        form_type: "Prayer Request",
        full_name: fields.fullName,
        email: fields.email,
        phone: `${COUNTRY_PHONE_DATA[fields.country]?.code || ""}${fields.phone}`,
        country: fields.country,
        street: fields.street,
        city: fields.city,
        state: fields.state,
        zip: fields.zip,
        prayer_request: fields.prayer,
        submitted_at: new Date().toISOString(),
      },
      setAlert,
    );
  };

  return (
    <>
      <ErrDialog alerts={alert} onClose={() => setAlert(null)} />
      <FormCard
        eyebrow="Bring your need before God"
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--gold2)" }}>
              Prayer
            </em>{" "}
            Request
          </>
        }
        description="Our intercession team is standing with you in faith. Nothing is too big for God."
        submitLabel="Send My Prayer →"
        successTitle="Prayer Received"
        successBody="Your request is in faithful hands. Our prayer team will stand in agreement with you."
        formKey="prayer_v2"
        onSubmit={submit}
        online={online}
      >
        <ProgressBar fields={fields} extras={["prayer"]} />
        <BaseFields fields={fields} errors={errors} set={set} />
        <FloatField
          label="Your Prayer Request"
          required
          isTextarea
          error={errors.prayer}
        >
          <textarea
            value={fields.prayer}
            onChange={(e) => set("prayer", e.target.value)}
            className={`field-input${errors.prayer ? " has-error" : ""}`}
            rows={4}
            style={{
              ...iBase(!!errors.prayer),
              paddingTop: "1.55rem",
              minHeight: 120,
              resize: "vertical",
              lineHeight: 1.7,
            }}
          />
        </FloatField>
      </FormCard>
    </>
  );
}

/* ═══════════════════════════════════════════
   CROSS ICON
═══════════════════════════════════════════ */
function Cross({ size = 46 }) {
  return (
    <div
      style={{
        position: "relative",
        width: size + 12,
        height: size + 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {["-8px", "-18px", "-30px"].map((inset, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "50%",
            border: "1px solid rgba(201,168,108,0.28)",
            inset,
            opacity: i === 0 ? 1 : i === 1 ? 0.3 : 0.1,
            animation: `glow 3s ease-in-out ${i * 0.9}s infinite`,
          }}
        />
      ))}
      <svg width={size} height={size} viewBox="0 0 46 46" fill="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6A3A08" />
            <stop offset="50%" stopColor="#F5DFA0" />
            <stop offset="100%" stopColor="#C9A86C" />
          </linearGradient>
        </defs>
        <rect x="19" y="3" width="8" height="40" rx="4" fill="url(#cg)" />
        <rect x="3" y="17" width="40" height="8" rx="4" fill="url(#cg)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TABS
═══════════════════════════════════════════ */
const TABS = [
  {
    id: "altar",
    icon: "✝",
    label: "Altar Call",
    short: "Altar",
    Component: AltarCallForm,
  },
  {
    id: "first",
    icon: "★",
    label: "First Timer",
    short: "1st Timer",
    Component: FirstTimerForm,
  },
  {
    id: "testi",
    icon: "◈",
    label: "Testimony",
    short: "Testify",
    Component: TestimonyForm,
  },
  {
    id: "prayer",
    icon: "◎",
    label: "Prayer",
    short: "Prayer",
    Component: PrayerForm,
  },
];

/* ═══════════════════════════════════════════
   SCROLL-TO-TOP
═══════════════════════════════════════════ */
function ScrollTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!vis) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        position: "fixed",
        bottom: "1.8rem",
        right: "1.8rem",
        zIndex: 8000,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(13,10,28,0.9)",
        border: "1px solid rgba(201,168,108,0.3)",
        color: "var(--gold)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        transition: "all .3s var(--ease)",
        animation: "scaleIn .3s var(--ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,108,0.65)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(201,168,108,0.3)";
        e.currentTarget.style.transform = "none";
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useState("altar");
  const [renderKey, setRenderKey] = useState(0);
  const { online, banner } = useOnline();
  const vw = useVW();
  const tiny = vw < 360;
  const small = vw < 560;

  const switchTab = useCallback((id) => {
    setActiveTab(id);
    setRenderKey((k) => k + 1);
  }, []);
  const { Component } = TABS.find((t) => t.id === activeTab);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <NetworkBanner banner={banner} />
      <Particles />
      <ScrollTop />

      {/* Ambient orbs */}
      <div
        style={{
          position: "fixed",
          top: -220,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(900px,140vw)",
          height: "min(520px,72vw)",
          background:
            "radial-gradient(ellipse,rgba(90,50,200,0.3) 0%,rgba(201,168,108,0.03) 50%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -170,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(650px,95vw)",
          height: "min(430px,58vw)",
          background:
            "radial-gradient(ellipse,rgba(201,168,108,0.065) 0%,transparent 68%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "32%",
          left: "-8%",
          width: "min(460px,68vw)",
          height: "min(460px,68vw)",
          background:
            "radial-gradient(circle,rgba(85,40,165,0.13) 0%,transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          animation: "float1 30s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "58%",
          right: "-5%",
          width: "min(330px,50vw)",
          height: "min(330px,50vw)",
          background:
            "radial-gradient(circle,rgba(201,168,108,0.045) 0%,transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          animation: "float2 36s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          padding: `0 ${tiny ? ".75rem" : small ? "1rem" : "1.25rem"} 5rem`,
        }}
      >
        {/* HEADER */}
        <header
          style={{
            textAlign: "center",
            padding: `${small ? "3.5rem" : "5.5rem"} 1rem ${small ? "2.2rem" : "3.8rem"}`,
            animation: "fadeUp 1s var(--ease) both",
            width: "100%",
            maxWidth: 600,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1.6rem",
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 72,
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(201,168,108,0.38))",
              }}
            />
            <Cross size={tiny ? 36 : 46} />
            <div
              style={{
                flex: 1,
                maxWidth: 72,
                height: 1,
                background:
                  "linear-gradient(90deg,rgba(201,168,108,0.38),transparent)",
              }}
            />
          </div>
          <h1
            style={{
              fontFamily: "var(--f-serif)",
              fontSize: `clamp(${tiny ? "2rem" : small ? "2.4rem" : "2.9rem"},8vw,5.5rem)`,
              fontWeight: 400,
              color: "var(--cream)",
              lineHeight: 1.04,
              letterSpacing: ".01em",
            }}
          >
            Salvation
            <strong
              style={{
                display: "block",
                fontWeight: 700,
                letterSpacing: ".04em",
              }}
            >
              Ministries
            </strong>
            <em
              style={{
                display: "block",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--gold2)",
                fontSize: ".52em",
                letterSpacing: ".14em",
                marginTop: ".3em",
                fontFamily: "var(--f-serif)",
              }}
            >
              Port Harcourt, Nigeria
            </em>
          </h1>
          <div
            style={{
              marginTop: "1.1rem",
              fontSize: tiny ? ".56rem" : ".63rem",
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(201,168,108,0.35)",
              fontFamily: "var(--f-display)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".75rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: 22,
                height: 1,
                background: "var(--gold)",
                opacity: 0.25,
                display: "inline-block",
              }}
            />
            Connect · Grow · Testify
            <span
              style={{
                width: 22,
                height: 1,
                background: "var(--gold)",
                opacity: 0.25,
                display: "inline-block",
              }}
            />
          </div>
          {/* Online indicator dot */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".45rem",
              marginTop: ".9rem",
            }}
          >
            <div style={{ position: "relative", width: 8, height: 8 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: online ? "#5BAF7A" : "#E05555",
                  animation: online ? "ping 2.2s ease-out infinite" : "none",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: online ? "#5BAF7A" : "#E05555",
                }}
              />
            </div>
            <span
              style={{
                fontSize: ".56rem",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: online
                  ? "rgba(91,175,122,0.65)"
                  : "rgba(224,85,85,0.65)",
                fontFamily: "var(--f-display)",
              }}
            >
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </header>

        {/* TABS */}
        <nav
          style={{
            width: "100%",
            maxWidth: 600,
            marginBottom: "2.6rem",
            padding: `0 ${tiny ? "0" : ".25rem"}`,
            animation: "fadeUp 1s .15s var(--ease) both",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: tiny ? 3 : 5,
              background: "rgba(255,255,255,0.022)",
              border: "1px solid rgba(201,168,108,0.16)",
              borderRadius: 20,
              padding: tiny ? 4 : 6,
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`tab-btn${activeTab === t.id ? " active" : ""}`}
              >
                <span
                  style={{
                    fontSize: tiny ? ".9rem" : "1.05rem",
                    lineHeight: 1,
                  }}
                >
                  {t.icon}
                </span>
                <span
                  style={{
                    fontSize: tiny ? ".5rem" : small ? ".57rem" : ".62rem",
                    letterSpacing: tiny ? ".04em" : ".09em",
                    textTransform: "uppercase",
                    fontWeight: 400,
                    display: "block",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: tiny ? 48 : 85,
                  }}
                >
                  {tiny ? t.short : t.label}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* FORM */}
        <main
          style={{
            width: "100%",
            maxWidth: 600,
            animation: "fadeUp 1s .28s var(--ease) both",
          }}
        >
          <div
            key={renderKey}
            style={{ animation: "scaleIn .4s var(--ease) both" }}
          >
            <Component online={online} />
          </div>
        </main>

        {/* FOOTER */}
        <footer
          style={{
            marginTop: "4rem",
            color: "rgba(201,168,108,0.25)",
            fontSize: tiny ? ".54rem" : ".62rem",
            letterSpacing: ".13em",
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.9,
            padding: "0 1rem",
            maxWidth: "min(100%,560px)",
            animation: "fadeUp 1s .5s both",
            fontFamily: "var(--f-display)",
          }}
        >
          © {new Date().getFullYear()} Salvation Ministries
          {!tiny && (
            <>
              <span style={{ opacity: 0.35 }}> · </span>Plot 17 Birabi Street,
              GRA Phase 1, Port Harcourt
            </>
          )}
          <span style={{ opacity: 0.35 }}> · </span>All Rights Reserved
        </footer>
      </div>
    </>
  );
}
