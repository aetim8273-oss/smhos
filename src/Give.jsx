import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const banks = [
  { title: "Guaranty Trust Bank", content: "0039292132" },
  { title: "Zenith Bank", content: "1014529383" },
  { title: "First Bank", content: "2002682996" },
  { title: "Sterling Bank", content: "0063509730" },
  { title: "Premium Trust Bank", content: "0040020743" },
  { title: "UBA", content: "1003814234" },
  { title: "Standard Bank", content: "0000590435" },
  { title: "Access Bank", content: "0033415191" },
  { title: "FCMB", content: "2348978011" },
  { title: "Wema Bank", content: "0121207742" },
  { title: "Unity Bank", content: "0023483525" },
  { title: "Stanbic IBTC", content: "0020657560" },
  { title: "Fidelity Bank", content: "5210008108" },
  { title: "Globus Bank", content: "1000242670" },
];

const fxBanks = [
  {
    title: "Access Bank",
    name: "Salvation Ministries",
    swift: "ABNGNGLA",
    account_number: "0036568847",
    routing_number: "021000089",
    branch: "PH Trans Amadi Branch, Port Harcourt",
    intermediary_bank: "Citibank New York",
    intermediary_swift: "CITIUS33",
    beneficiary_bank: "Access Bank Plc",
    beneficiary_bank_account_number: "36145842",
  },
  {
    title: "Guaranty Trust Bank",
    name: "Salvation Ministries",
    swift: "GTBINGLA",
    sort_code: "058215025",
    account_number: "0039292204",
  },
];

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      style={{ width: 16, height: 16, display: "inline" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      style={{ width: 14, height: 14, display: "inline" }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

function ChevronDown({ open }) {
  return (
    <svg
      style={{
        width: 16,
        height: 16,
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
        flexShrink: 0,
      }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      onClick={copy}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: copied ? "#4ade80" : "rgba(255,255,255,0.5)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        transition: "color 0.2s",
        padding: "2px 6px",
        borderRadius: 6,
        flexShrink: 0,
      }}
    >
      {copied ? (
        <>
          <CheckIcon /> Copied!
        </>
      ) : (
        <>
          <CopyIcon /> Copy
        </>
      )}
    </button>
  );
}

function BankAccordion({ banks, fx = false }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {banks.map((bank, i) => (
        <div
          key={i}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              background: open === i ? "rgba(220,38,38,0.12)" : "transparent",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.9)",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s",
              gap: 8,
            }}
          >
            <span style={{ textAlign: "left" }}>{bank.title}</span>
            <ChevronDown open={open === i} />
          </button>
          {open === i && (
            <div
              style={{
                padding: "12px 18px 16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {!fx ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "clamp(16px, 4vw, 22px)",
                      fontWeight: 600,
                      color: "#fff",
                      letterSpacing: 2,
                    }}
                  >
                    {bank.content}
                  </span>
                  <CopyButton text={bank.content} />
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {[
                    ["Account Name", bank.name],
                    ["Swift Code", bank.swift],
                    ["Sort Code", bank.sort_code],
                    ["Account Number", bank.account_number],
                    ["Routing Number", bank.routing_number],
                    ["Branch", bank.branch],
                    ["Intermediary Bank", bank.intermediary_bank],
                    ["Intermediary Swift", bank.intermediary_swift],
                    ["Beneficiary Bank", bank.beneficiary_bank],
                    [
                      "Beneficiary Acct No.",
                      bank.beneficiary_bank_account_number,
                    ],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.4)",
                            minWidth: 110,
                            paddingTop: 2,
                            flexShrink: 0,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 13,
                            color: "#e2e8f0",
                            flex: 1,
                            wordBreak: "break-all",
                          }}
                        >
                          {value}
                        </span>
                        <CopyButton text={value} />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PaymentCard({ href, icon, title, description, external = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 20,
        border: `1px solid ${hovered ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.08)"}`,
        background: hovered ? "rgba(220,38,38,0.07)" : "rgba(255,255,255,0.03)",
        padding: 24,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 60px rgba(220,38,38,0.15)" : "none",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 0%, rgba(220,38,38,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "rgba(220,38,38,0.12)",
            border: "1px solid rgba(220,38,38,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "'DM Sans', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {description}
        <svg
          style={{ width: 14, height: 14, flexShrink: 0 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              external
                ? "m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                : "M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            }
          />
        </svg>
      </div>
    </a>
  );
}

const PayULogo = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    height="22px"
    viewBox="0 0 120.9 43"
    style={{ fill: "none" }}
  >
    <g>
      <path
        fill="#dc2626"
        d="M73.7,16c-0.6,0-1-0.4-1-1v-4.4h-0.4c-2.3,0-3.1,0.4-3.1,2.5V18l0,0v1v0.1V26c0,0.8-0.2,1.5-0.5,2c-0.6,1-1.9,1.4-3.8,1.4c-2,0-3.2-0.4-3.8-1.4c-0.3-0.5-0.5-1.2-0.5-2v-6.8v-0.1V18l0,0v-4.9c0-2.1-0.8-2.5-3.1-2.5h-0.7c-2.3,0-3.1,0.4-3.1,2.5V26c0,2.1,0.5,3.8,1.4,5.2c1.7,2.7,5.1,4.2,9.9,4.2l0,0l0,0c4.8,0,8.2-1.5,9.9-4.2c0.9-1.4,1.4-3.2,1.4-5.2V16H73.7L73.7,16z"
      />
      <path
        fill="#dc2626"
        d="M9.7,10.6H4.2c-2.9,0-4.2,1.3-4.2,4.2v18.8c0,1.1,0.4,1.5,1.5,1.5h0.4c1.1,0,1.5-0.4,1.5-1.5v-7.3h6.3c5.6,0,8.3-2.5,8.3-7.9S15.3,10.6,9.7,10.6z M14.6,18.4c0,3.1-0.8,4.7-4.9,4.7H3.4v-7.9c0-1.1,0.4-1.5,1.5-1.5h4.8C12.8,13.8,14.6,14.5,14.6,18.4z"
      />
      <path
        fill="#dc2626"
        d="M25,16c-2.2,0-3.5,0.3-4,0.4c-0.9,0.2-1.3,0.4-1.3,1.5v0.3c0,0.4,0.1,0.7,0.2,0.9c0.2,0.2,0.4,0.3,0.7,0.3c0.2,0,0.3,0,0.6-0.1c0.5-0.1,2.2-0.4,4-0.4c3.3,0,4.6,0.9,4.6,3.1v2h-4.1c-5.3,0-7.8,1.8-7.8,5.6s2.6,5.8,7.2,5.8c5.5,0,8-1.9,8-6.1V22C33,18,30.4,16,25,16z M29.8,26.6v2.6c0,2.1-0.8,3.3-4.8,3.3c-2.6,0-3.9-0.9-3.9-2.9c0-2.1,1.3-3,4.6-3H29.8z"
      />
      <path
        fill="#dc2626"
        d="M112.2,17.6H89.4c-4.8,0-8.8,3.9-8.8,8.8s3.9,8.8,8.8,8.8h22.7c4.8,0,8.8-3.9,8.8-8.8S117,17.6,112.2,17.6z"
      />
    </g>
  </svg>
);

const CardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#dc2626"
    style={{ width: 24, height: 24 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
    />
  </svg>
);

const PayPalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    fill="none"
    strokeWidth={30}
    stroke="#dc2626"
    style={{ width: 22, height: 22 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
    />
  </svg>
);

function FloatingOrb({ style }) {
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(220,38,38,0.12)",
          border: "1px solid rgba(220,38,38,0.25)",
          borderRadius: 100,
          padding: "5px 14px",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#dc2626",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#ef4444",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </span>
      </div>
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: "clamp(20px, 4vw, 26px)",
          fontWeight: 700,
          color: "#fff",
          fontFamily: "'DM Serif Display', serif",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      {open ? (
        <>
          <line x1="4" y1="4" x2="18" y2="18" />
          <line x1="18" y1="4" x2="4" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="19" y2="6" />
          <line x1="3" y1="11" x2="19" y2="11" />
          <line x1="3" y1="16" x2="19" y2="16" />
        </>
      )}
    </svg>
  );
}

export default function SMHOSGivePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (mobileOpen) {
      const close = () => setMobileOpen(false);
      window.addEventListener("scroll", close, { once: true });
      return () => window.removeEventListener("scroll", close);
    }
  }, [mobileOpen]);

  const navLinks = [
    {
      href: "https://membership.smhos.org/member/testimonies",
      label: "Testimonies",
    },
    {
      href: "https://membership.smhos.org/member/messages",
      label: "Message Extract",
    },
    { href: "https://membership.smhos.org/member/blog", label: "Blog" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04021a",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }
        ::selection { background: rgba(220,38,38,0.3); }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #04021a; } ::-webkit-scrollbar-thumb { background: #dc2626; border-radius: 4px; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .anim-fadeup { animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards; }
        .anim-fadeup-2 { animation: fadeUp 0.7s 0.15s cubic-bezier(0.4,0,0.2,1) both; }
        .anim-fadeup-3 { animation: fadeUp 0.7s 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        .float-orb { animation: float 7s ease-in-out infinite; }
        .pulse-orb { animation: pulse-glow 4s ease-in-out infinite; }

        /* Nav links */
        .nav-link { color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500; transition: color 0.2s; padding: 6px 12px; border-radius: 8px; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .give-btn { background: #dc2626; color: #fff; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em; display: inline-block; }
        .give-btn:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(220,38,38,0.35); }
        .login-btn { color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; transition: color 0.2s; border: 1px solid rgba(255,255,255,0.12); padding: 8px 16px; border-radius: 10px; display: inline-block; }
        .login-btn:hover { color: #fff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

        /* Desktop nav links - hidden on mobile */
        .desktop-nav-links { display: flex; align-items: center; gap: 4; }
        .desktop-auth { display: flex; align-items: center; gap: 12; }

        /* Mobile hamburger - hidden on desktop */
        .hamburger-btn { display: none; background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; padding: 6px; border-radius: 8px; }

        /* Payment grid */
        .payment-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        /* Bank grid */
        .bank-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }

        /* Image mosaic */
        .mosaic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .mosaic-full { grid-column: 1 / -1; }

        /* Footer grid */
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }

        /* Mobile menu */
        .mobile-menu { display: none; }

        /* ===== TABLET (max 900px) ===== */
        @media (max-width: 900px) {
          .payment-grid { grid-template-columns: repeat(2, 1fr); }
          .bank-grid { grid-template-columns: 1fr; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ===== MOBILE (max 640px) ===== */
        @media (max-width: 640px) {
          .desktop-nav-links { display: none; }
          .desktop-auth { display: none; }
          .hamburger-btn { display: flex; align-items: center; justify-content: center; }
          .mobile-menu { display: block; }
          .payment-grid { grid-template-columns: 1fr; }
          .bank-grid { grid-template-columns: 1fr; }
          .mosaic-grid { grid-template-columns: 1fr; }
          .mosaic-full { grid-column: auto; }
          .footer-grid { grid-template-columns: 1fr; gap: 36px; }
          .hero-padding { padding-left: 20px !important; padding-right: 20px !important; }
          .main-padding { padding-left: 20px !important; padding-right: 20px !important; }
          .footer-padding { padding-left: 20px !important; padding-right: 20px !important; }
          .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 16px; }
        }

        /* ===== SMALL MOBILE (max 400px) ===== */
        @media (max-width: 400px) {
          .payment-grid { gap: 12px; }
        }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          right: 0,
          zIndex: 100,
          padding: "0 32px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            scrolled || mobileOpen ? "rgba(4,2,26,0.95)" : "transparent",
          backdropFilter: scrolled || mobileOpen ? "blur(20px)" : "none",
          borderBottom:
            scrolled || mobileOpen
              ? "1px solid rgba(255,255,255,0.06)"
              : "none",
          transition: "all 0.4s ease",
          maxWidth: 1280,
          width: "100%",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -1,
              flexShrink: 0,
            }}
          >
            SM
          </div>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 0.3,
            }}
          >
            SMHOS
          </span>
        </a>

        <div className="desktop-nav-links">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </div>

        <div className="desktop-auth">
          <Link to="/login" className="login-btn">
            Log In
          </Link>
          <Link to="/give" className="give-btn">
            Give Now
          </Link>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <HamburgerIcon open={mobileOpen} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className="mobile-menu"
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 99,
          background: "rgba(4,2,26,0.98)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: mobileOpen ? "20px 20px 28px" : "0 20px",
          maxHeight: mobileOpen ? 400 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 15,
                fontWeight: 500,
                padding: "10px 4px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transition: "color 0.2s",
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Link
              to="/login"
              className="login-btn"
              style={{ flex: 1, textAlign: "center" }}
            >
              Log In
            </Link>
            <Link
              to="/give"
              className="give-btn"
              style={{ flex: 1, textAlign: "center" }}
            >
              Give Now
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div
        ref={heroRef}
        className="hero-padding"
        style={{
          position: "relative",
          paddingTop: 130,
          paddingBottom: 60,
          paddingLeft: 32,
          paddingRight: 32,
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <FloatingOrb
          style={{
            width: 500,
            height: 500,
            background: "rgba(220,38,38,0.12)",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "pulse-glow 6s ease-in-out infinite",
          }}
        />
        <FloatingOrb
          style={{
            width: 300,
            height: 300,
            background: "rgba(127,29,29,0.2)",
            top: 0,
            left: "10%",
            animation: "float 9s ease-in-out infinite",
          }}
        />
        <FloatingOrb
          style={{
            width: 200,
            height: 200,
            background: "rgba(220,38,38,0.08)",
            top: 80,
            right: "10%",
            animation: "float 11s ease-in-out infinite reverse",
          }}
        />

        <div
          className="anim-fadeup"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 36,
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <a
            href="/"
            style={{
              color: "rgba(255,255,255,0.35)",
              transition: "color 0.2s",
            }}
          >
            Home
          </a>
          <span>›</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Give</span>
        </div>

        <div
          className="anim-fadeup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 24,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#ef4444",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Salvation Ministries · Home of Success
          </span>
        </div>

        <h1
          className="anim-fadeup-2"
          style={{
            fontSize: "clamp(36px, 8vw, 72px)",
            fontWeight: 700,
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.08,
            marginBottom: 20,
            letterSpacing: -1,
          }}
        >
          Give to the{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #f97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Kingdom
          </span>
        </h1>

        <p
          className="anim-fadeup-3"
          style={{
            fontSize: "clamp(15px, 2.5vw, 18px)",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto 48px",
            fontWeight: 400,
          }}
        >
          Your generosity fuels the work of God. Every seed sown here is a
          testament of your faith and love.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              height: 1,
              width: 60,
              background:
                "linear-gradient(to right, transparent, rgba(220,38,38,0.4))",
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#dc2626",
              boxShadow: "0 0 16px rgba(220,38,38,0.6)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              height: 1,
              width: 60,
              background:
                "linear-gradient(to left, transparent, rgba(220,38,38,0.4))",
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="main-padding"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 100px" }}
      >
        {/* Online Payment Options */}
        <div style={{ marginBottom: 64 }}>
          <SectionHeader
            label="Online Giving"
            title="Give Instantly, Securely"
            subtitle="Choose your preferred payment method to give online."
          />
          <div className="payment-grid">
            <PaymentCard
              href="https://membership.smhos.org/give/payu"
              icon={<PayULogo />}
              title="PayU"
              description="Give via PayU"
            />
            <PaymentCard
              href="https://membership.smhos.org/member/give/payu/multiple"
              icon={<PayULogo />}
              title="PayU — Multiple Categories"
              description="Give to multiple categories (Login required)"
            />
            <PaymentCard
              href="https://pay.squadco.com/link/salvationministries"
              icon={<CardIcon />}
              title="Squad — Visa / Mastercard"
              description="Give with Squad Pay"
              external
            />
            <PaymentCard
              href="https://www.paypal.com/donate/?cmd=_s-xclick&hosted_button_id=A9NK7RG84P5WC"
              icon={<PayPalIcon />}
              title="PayPal"
              description="Give with PayPal"
              external
            />
          </div>
        </div>

        {/* Bank Transfers */}
        <div className="bank-grid" style={{ marginBottom: 64 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
              padding: "clamp(20px, 4vw, 32px)",
            }}
          >
            <SectionHeader
              label="Naira Transfers"
              title="Banking Details"
              subtitle="Bank transfers in Nigerian Naira"
            />
            <BankAccordion banks={banks} />
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
              padding: "clamp(20px, 4vw, 32px)",
            }}
          >
            <SectionHeader
              label="FX Transfers"
              title="Foreign Currency"
              subtitle="International bank transfer details (USD)"
            />
            <BankAccordion banks={fxBanks} fx />
          </div>
        </div>

        {/* Glory Reign Sacrifice Mosaic */}
        <div style={{ marginBottom: 64 }}>
          <SectionHeader
            label="Glory Reign"
            title="The Sacrifice"
            subtitle="A testament of worship and consecration."
          />
          <div className="mosaic-grid">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                  aspectRatio: "4/3",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`https://membership.smhos.org/images/GR-SACRIFICE-${n}.png`}
                  alt={`Glory Reign Sacrifice ${n}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
            <div
              className="mosaic-full"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <img
                src="https://membership.smhos.org/images/GR-SACRIFICE-5.png"
                alt="Glory Reign Sacrifice 5"
                style={{ width: "100%", display: "block" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#020110",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "60px 32px 40px",
        }}
      >
        <div
          className="footer-padding"
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          <div className="footer-grid" style={{ marginBottom: 56 }}>
            {/* Newsletter */}
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 8,
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                Stay in the Word
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Subscribe to receive goodnews, straight to your inbox.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: "#fff",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  onClick={() => {
                    if (email) setSubscribed(true);
                  }}
                  style={{
                    background: subscribed ? "#16a34a" : "#dc2626",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    fontFamily: "'DM Sans', sans-serif",
                    flexShrink: 0,
                  }}
                >
                  {subscribed ? "✓ Done" : "Subscribe"}
                </button>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Explore
              </h3>
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/livestream", label: "Livestream" },
                { href: "/locator", label: "Church Locator" },
                { href: "https://chokhmah.org.ng/", label: "Chokmah" },
                { href: "https://smhosstore.com/", label: "Store" },
                { href: "https://learn.swolbi.org/", label: "SWOLBI" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 14,
                    marginBottom: 10,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.55)")
                  }
                >
                  {l.label} ↗
                </a>
              ))}
            </div>

            {/* Social */}
            <div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Follow
              </h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  {
                    href: "https://www.facebook.com/smhosglobal",
                    label: "Facebook",
                  },
                  {
                    href: "https://www.instagram.com/smhosglobal",
                    label: "Instagram",
                  },
                  {
                    href: "https://open.spotify.com/show/4GcFIHa7G0rm3oSlIx4djG",
                    label: "Spotify",
                  },
                  {
                    href: "https://www.youtube.com/@smhosglobal",
                    label: "YouTube",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.45)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#fff";
                      e.target.style.borderColor = "rgba(255,255,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(255,255,255,0.45)";
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="footer-bottom"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #dc2626, #7f1d1d)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                SM
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                © {new Date().getFullYear()} Salvation Ministries
              </span>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { href: "terms", label: "Terms of Use" },
                { href: "privacy", label: "Privacy Policy" },
              ].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.35)",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "rgba(255,255,255,0.35)")
                  }
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
