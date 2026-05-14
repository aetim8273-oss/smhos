import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import {
  signInWithRedirect,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

/* ═══════════════════════════════════════════════════════════════
   SMHOS MEMBER PORTAL — LOGIN PAGE  (v2 · All bugs fixed)
   Salvation Ministries · Home of Success
   ═══════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

@property --sb-angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
@property --glow-x { syntax:'<percentage>'; initial-value:50%; inherits:false; }
@property --glow-y { syntax:'<percentage>'; initial-value:50%; inherits:false; }

:root {
  --black:#03030A;
  --deep:#060610;
  --dark:#0B0B18;
  --mid:#13132A;
  --panel:#0D0D1E;
  --card:#080814;

  --gold:#C8A84B;
  --gold2:#D4B45E;
  --gold3:#E8CB80;
  --gold4:#F8E8B0;
  --gold5:#FFF6DC;

  --crimson:#7B1424;
  --crimson2:#9B1B30;

  --border:rgba(200,168,75,0.14);
  --border2:rgba(200,168,75,0.38);
  --border3:rgba(200,168,75,0.6);
  --glow:rgba(200,168,75,0.10);

  --white:#FDFAF6;
  --cream:#F4EDD8;
  --muted:#7A7060;
  --faint:#1E1D17;

  --f-display:'Cinzel',serif;
  --f-serif:'Cormorant Garamond',serif;
  --f-ui:'Raleway',sans-serif;

  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
  --easeback:cubic-bezier(0.36,0.07,0.19,0.97);

  --sp-xs:8px; --sp-sm:16px; --sp-md:24px; --sp-lg:40px; --sp-xl:64px;
  --card-pad-h:52px;
  --card-pad-v:56px;
  --title-size:clamp(32px,5vw,52px);
  --hero-title:clamp(56px,8vw,100px);
  --radius:2px;
}

html,body,#root{min-height:100vh;width:100%;}
body{
  background:var(--black);
  color:var(--white);
  font-family:var(--f-ui);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
}

::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--deep);}
::-webkit-scrollbar-thumb{background:linear-gradient(180deg,var(--gold),var(--gold3));border-radius:2px;}

/* ── GRAIN OVERLAY ── */
.grain{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:128px;
  opacity:0.030;
  mix-blend-mode:overlay;
  animation:grainShift 0.35s steps(3) infinite;
}
@keyframes grainShift{
  0%{transform:translate(0,0);}
  33%{transform:translate(-4px,2px);}
  66%{transform:translate(3px,-3px);}
  100%{transform:translate(-1px,4px);}
}

/* ── CUSTOM CURSOR ── */
.cur-dot{
  position:fixed;pointer-events:none;z-index:99999;
  width:5px;height:5px;
  background:var(--gold3);
  border-radius:50%;
  transform:translate(-50%,-50%);
  mix-blend-mode:difference;
}
.cur-ring{
  position:fixed;pointer-events:none;z-index:99998;
  width:34px;height:34px;
  border:1.5px solid var(--border2);
  border-radius:50%;
  transform:translate(-50%,-50%);
  transition:width 0.35s var(--ease),height 0.35s var(--ease),border-color 0.35s,background 0.35s;
}
.cur-ring.hover{width:56px;height:56px;border-color:var(--gold);background:rgba(200,168,75,0.04);}

/* ── BACKGROUND SYSTEM ── */
.bg-wrap{position:fixed;inset:0;z-index:0;overflow:hidden;}

.bg-gradient{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse 90% 60% at 15% 20%, rgba(200,168,75,0.065) 0%, transparent 55%),
    radial-gradient(ellipse 60% 70% at 85% 80%, rgba(123,20,36,0.045) 0%, transparent 55%),
    radial-gradient(ellipse 110% 80% at 50% 50%, rgba(200,168,75,0.025) 0%, transparent 65%),
    radial-gradient(ellipse 50% 50% at 75% 15%, rgba(200,168,75,0.038) 0%, transparent 50%);
  animation:gradientDrift 24s ease-in-out infinite alternate;
}
@keyframes gradientDrift{
  0%{transform:scale(1) translate(0,0);}
  100%{transform:scale(1.08) translate(3%,2%);}
}

.god-rays{position:absolute;inset:0;overflow:hidden;}
.god-rays::before{
  content:'';position:absolute;
  top:-50%;left:50%;
  width:280%;height:180%;
  transform-origin:top center;
  transform:translateX(-50%);
  background:conic-gradient(
    from 270deg at 50% 0%,
    transparent 0deg, rgba(200,168,75,0.028) 2.5deg, transparent 5deg,
    transparent 15deg, rgba(200,168,75,0.022) 17deg, transparent 19deg,
    transparent 30deg, rgba(200,168,75,0.035) 32deg, transparent 34deg,
    transparent 48deg, rgba(200,168,75,0.018) 50deg, transparent 52deg,
    transparent 63deg, rgba(200,168,75,0.030) 65deg, transparent 67deg,
    transparent 80deg, rgba(200,168,75,0.020) 82deg, transparent 84deg,
    transparent 95deg
  );
  animation:raysRotate 140s linear infinite;
}
.god-rays::after{
  content:'';position:absolute;
  top:-50%;left:50%;
  width:280%;height:180%;
  transform-origin:top center;
  transform:translateX(-50%);
  background:conic-gradient(
    from 90deg at 50% 0%,
    transparent 0deg, rgba(200,168,75,0.018) 2deg, transparent 4deg,
    transparent 25deg, rgba(200,168,75,0.015) 27deg, transparent 29deg,
    transparent 50deg, rgba(200,168,75,0.022) 52deg, transparent 54deg,
    transparent 105deg
  );
  animation:raysRotate 90s linear infinite reverse;
}
@keyframes raysRotate{
  from{transform:translateX(-50%) rotate(0deg);}
  to{transform:translateX(-50%) rotate(360deg);}
}

.bg-rings{position:absolute;top:50%;left:50%;}
.bg-ring{
  position:absolute;top:50%;left:50%;
  border-radius:50%;
  border:1px solid var(--border);
  transform:translate(-50%,-50%);
  animation:ringBreath 14s ease-in-out infinite;
}
.bg-ring:nth-child(1){
  width:320px;height:320px;
  border:1.5px solid rgba(200,168,75,0.11);
  animation-delay:0s;
  box-shadow:0 0 50px rgba(200,168,75,0.05), inset 0 0 50px rgba(200,168,75,0.025);
}
.bg-ring:nth-child(2){width:600px;height:600px;animation-delay:2.5s;}
.bg-ring:nth-child(3){width:950px;height:950px;border-color:rgba(200,168,75,0.055);animation-delay:5s;}
.bg-ring:nth-child(4){width:1450px;height:1450px;border-color:rgba(200,168,75,0.025);animation-delay:7.5s;}
@keyframes ringBreath{0%,100%{opacity:1;}50%{opacity:0.2;}}

.bg-glow{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  width:650px;height:650px;
  border-radius:50%;
  background:radial-gradient(circle, rgba(200,168,75,0.07) 0%, transparent 65%);
  animation:glowBreathe 9s ease-in-out infinite;
}
@keyframes glowBreathe{
  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1;}
  50%{transform:translate(-50%,-50%) scale(1.22);opacity:0.45;}
}

.bg-vignette{
  position:absolute;inset:0;
  background:radial-gradient(ellipse 75% 100% at 50% 50%, transparent 25%, rgba(3,3,10,0.75) 100%);
  pointer-events:none;
}

/* ── SACRED GEOMETRY ── */
.bg-sacred{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  opacity:0.032;
  pointer-events:none;
}
.sac-outer{transform-origin:450px 450px;animation:sacOuter 210s linear infinite;}
.sac-inner{transform-origin:450px 450px;animation:sacInner 150s linear infinite reverse;}
@keyframes sacOuter{to{transform:rotate(360deg);}}
@keyframes sacInner{to{transform:rotate(360deg);}}

/* ── PARTICLES ── */
.particle{
  position:fixed;pointer-events:none;border-radius:50%;
  animation:particleRise linear infinite;
  opacity:0;
}
@keyframes particleRise{
  0%{transform:translateY(105vh) scale(0) rotate(0deg);opacity:0;}
  8%{opacity:var(--p-op);}
  88%{opacity:var(--p-op);}
  100%{transform:translateY(-80px) scale(1) rotate(540deg);opacity:0;}
}

/* ── PAGE WRAPPER ── */
.page{
  position:relative;z-index:10;
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;
  padding:clamp(16px,2.5vw,32px) clamp(16px,4vw,48px) clamp(48px,6vw,96px);
}

/* ── TOP NAV ── */
.sm-nav{
  width:100%;max-width:1300px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 0 clamp(24px,3vw,40px);
  border-bottom:1px solid var(--border);
  margin-bottom:clamp(20px,3vw,36px);
}
.nav-logo{display:flex;align-items:center;gap:12px;}
.nav-logo img{height:clamp(32px,4vw,42px);width:auto;object-fit:contain;}
.nav-logo-fallback{
  font-family:var(--f-display);
  font-size:clamp(16px,2vw,22px);
  letter-spacing:0.18em;
  color:var(--gold);
  text-shadow:0 0 20px rgba(200,168,75,0.4);
}
.nav-links{display:flex;align-items:center;gap:clamp(20px,3vw,40px);}
.nav-a{
  font-family:var(--f-ui);
  font-size:9px;font-weight:600;
  letter-spacing:0.42em;text-transform:uppercase;
  color:rgba(253,250,244,0.38);
  text-decoration:none;
  transition:color 0.3s;
}
.nav-a:hover{color:var(--gold3);}
.nav-give{
  font-family:var(--f-ui);
  font-size:9px;font-weight:700;
  letter-spacing:0.42em;text-transform:uppercase;
  color:var(--black);
  text-decoration:none;
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  padding:10px 22px;
  transition:all 0.3s var(--ease);
  position:relative;
  overflow:hidden;
  box-shadow:0 4px 24px rgba(200,168,75,0.28);
}
.nav-give::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--gold4),var(--gold3));
  opacity:0;transition:opacity 0.3s;
}
.nav-give:hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(200,168,75,0.42);}
.nav-give:hover::after{opacity:1;}
.nav-give span{position:relative;z-index:1;}

/* ── BREADCRUMB ── */
.breadcrumb{
  width:100%;max-width:1300px;
  display:flex;align-items:center;gap:10px;
  margin-bottom:clamp(28px,4vw,56px);
}
.bc{
  font-family:var(--f-ui);
  font-size:9px;font-weight:600;
  letter-spacing:0.38em;text-transform:uppercase;
  color:var(--muted);text-decoration:none;
  transition:color 0.3s;
}
.bc:hover{color:var(--gold3);}
.bc-sep{color:rgba(200,168,75,0.22);font-size:12px;}
.bc-active{color:rgba(253,250,244,0.18);}

/* ── MAIN GRID ── */
.main-grid{
  width:100%;max-width:1300px;
  display:grid;
  grid-template-columns:1fr 480px;
  gap:clamp(48px,7vw,110px);
  align-items:center;
}

/* ── LEFT PANEL ── */
.left-panel{display:flex;flex-direction:column;}

.lp-eyebrow{
  font-family:var(--f-ui);
  font-size:9px;font-weight:700;
  letter-spacing:0.65em;text-transform:uppercase;
  color:var(--gold);
  display:flex;align-items:center;gap:14px;
  margin-bottom:18px;
  opacity:0;animation:fadeUp 0.8s 0.2s var(--ease) forwards;
}
.lp-eye-line{height:1px;width:38px;background:linear-gradient(90deg,var(--gold),transparent);}

.lp-title{
  font-family:var(--f-display);
  font-size:var(--hero-title);
  font-weight:600;
  line-height:0.86;
  letter-spacing:0.06em;
  margin-bottom:18px;
  opacity:0;animation:fadeUp 0.9s 0.35s var(--ease) forwards;
}
.lp-title-grad{
  background:linear-gradient(105deg, var(--gold) 0%, var(--gold4) 20%, var(--gold2) 38%, #fff9e0 55%, var(--gold3) 72%, var(--gold) 100%);
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:prismShift 6.5s linear infinite;
  filter:drop-shadow(0 0 32px rgba(200,168,75,0.22));
}
@keyframes prismShift{0%{background-position:0% center;}100%{background-position:300% center;}}

.lp-sub{
  font-family:var(--f-serif);
  font-size:clamp(16px,1.6vw,21px);
  font-style:italic;
  color:rgba(253,250,244,0.3);
  letter-spacing:0.1em;
  line-height:1.6;
  margin-bottom:44px;
  opacity:0;animation:fadeUp 0.8s 0.5s var(--ease) forwards;
}

.verse-block{
  border:1px solid var(--border);
  padding:clamp(22px,2.8vw,34px) clamp(22px,2.8vw,38px);
  position:relative;
  background:linear-gradient(135deg, rgba(200,168,75,0.04) 0%, transparent 55%);
  margin-bottom:48px;
  opacity:0;animation:fadeUp 0.8s 0.65s var(--ease) forwards;
  overflow:hidden;
}
.verse-block::before{
  content:'\\201C';
  position:absolute;top:-18px;left:20px;
  font-family:var(--f-serif);font-size:90px;
  color:rgba(200,168,75,0.08);
  line-height:1;pointer-events:none;
}
.verse-accent-tl{position:absolute;top:-1px;left:-1px;width:20px;height:20px;border-top:2px solid var(--gold3);border-left:2px solid var(--gold3);}
.verse-accent-br{position:absolute;bottom:-1px;right:-1px;width:20px;height:20px;border-bottom:2px solid var(--gold3);border-right:2px solid var(--gold3);}
.verse-shimmer{
  position:absolute;inset:0;
  background:linear-gradient(105deg,transparent 35%,rgba(200,168,75,0.04) 50%,transparent 65%);
  transform:translateX(-100%);
  animation:verseShimmer 5s 2s ease-in-out infinite;
}
@keyframes verseShimmer{
  0%,100%{transform:translateX(-120%);}
  50%{transform:translateX(120%);}
}
.verse-text{
  font-family:var(--f-serif);
  font-size:clamp(15px,1.5vw,18px);
  font-style:italic;
  color:rgba(200,168,75,0.82);
  line-height:1.85;
  margin-bottom:16px;
  position:relative;z-index:1;
}
.verse-ref{
  font-family:var(--f-ui);
  font-size:9px;font-weight:700;
  letter-spacing:0.52em;text-transform:uppercase;
  color:var(--gold);
  position:relative;z-index:1;
}

.stats-row{
  display:flex;gap:clamp(18px,3vw,38px);
  opacity:0;animation:fadeUp 0.8s 0.8s var(--ease) forwards;
  flex-wrap:wrap;
}
.stat{text-align:left;}
.stat-n{
  font-family:var(--f-display);
  font-size:clamp(28px,3.5vw,42px);
  letter-spacing:0.05em;
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  line-height:1;
}
.stat-l{
  font-family:var(--f-ui);
  font-size:8.5px;font-weight:600;
  letter-spacing:0.42em;text-transform:uppercase;
  color:var(--muted);margin-top:4px;
}
.stat-sep{width:1px;background:var(--border);align-self:stretch;}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(30px);}
  to{opacity:1;transform:translateY(0);}
}

/* ══════════════════════
   LOGIN CARD
══════════════════════ */
.card-outer{
  position:relative;
  opacity:0;animation:fadeUp 0.9s 0.15s var(--ease) forwards;
}

/* Animated border shimmer */
.shimmer-border{
  position:absolute;inset:-1.5px;z-index:0;overflow:hidden;
  border-radius:var(--radius);
}
.shimmer-border::before{
  content:'';position:absolute;inset:0;
  background:conic-gradient(
    from var(--sb-angle),
    transparent 0%, var(--gold3) 6%, var(--gold4) 12%, var(--gold) 18%, transparent 24%,
    transparent 48%, var(--gold3) 54%, var(--gold) 62%, transparent 68%
  );
  animation:sbSpin 5s linear infinite;
}
@keyframes sbSpin{from{--sb-angle:0deg;}to{--sb-angle:360deg;}}

.card-accent{position:absolute;z-index:5;pointer-events:none;}
.ca-tl{top:-1px;left:-1px;width:24px;height:24px;border-top:2.5px solid var(--gold3);border-left:2.5px solid var(--gold3);}
.ca-tr{top:-1px;right:-1px;width:24px;height:24px;border-top:2.5px solid var(--gold3);border-right:2.5px solid var(--gold3);}
.ca-bl{bottom:-1px;left:-1px;width:24px;height:24px;border-bottom:2.5px solid var(--gold3);border-left:2.5px solid var(--gold3);}
.ca-br{bottom:-1px;right:-1px;width:24px;height:24px;border-bottom:2.5px solid var(--gold3);border-right:2.5px solid var(--gold3);}

.login-card{
  position:relative;z-index:1;
  background:rgba(5,5,14,0.97);
  border:1px solid rgba(200,168,75,0.12);
  padding:var(--card-pad-v) var(--card-pad-h) calc(var(--card-pad-v) * 0.85);
  overflow:hidden;
  backdrop-filter:blur(60px) saturate(1.5);
  -webkit-backdrop-filter:blur(60px) saturate(1.5);
  box-shadow:
    0 48px 128px rgba(0,0,0,0.85),
    0 0 0 1px rgba(200,168,75,0.05),
    inset 0 1px 0 rgba(255,255,255,0.025),
    inset 0 -1px 0 rgba(200,168,75,0.05);
  border-radius:var(--radius);
}
.login-card::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 130% 60% at 50% -8%, rgba(200,168,75,0.065) 0%, transparent 58%);
  pointer-events:none;
}
.login-card::after{
  content:'';position:absolute;inset:0;
  background:repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.028) 3px, rgba(0,0,0,0.028) 4px);
  pointer-events:none;
}

/* Scanning light */
.scan-line{
  position:absolute;left:0;width:100%;height:1px;
  background:linear-gradient(90deg, transparent 0%, rgba(200,168,75,0.4) 25%, rgba(255,240,160,0.65) 50%, rgba(200,168,75,0.4) 75%, transparent 100%);
  animation:scanDown 6s ease-in-out infinite;
  pointer-events:none;z-index:10;
}
@keyframes scanDown{
  0%{top:0%;opacity:0;}
  4%{opacity:1;}
  90%{opacity:0.5;}
  100%{top:100%;opacity:0;}
}

/* Ambient card glow */
.card-glow{
  position:absolute;width:380px;height:380px;border-radius:50%;
  background:radial-gradient(circle,rgba(200,168,75,0.055) 0%,transparent 68%);
  top:-130px;left:-100px;
  animation:cardGlowDrift 16s ease-in-out infinite alternate;
  pointer-events:none;
}
@keyframes cardGlowDrift{
  0%{transform:translate(0,0);}
  100%{transform:translate(230px,180px);}
}

/* ── CARD HEADER ── */
.card-head{text-align:center;margin-bottom:clamp(22px,3vw,36px);position:relative;}

.emblem{
  width:clamp(58px,7vw,74px);height:clamp(58px,7vw,74px);
  position:relative;margin:0 auto clamp(16px,2vw,24px);
}
.emblem-ring{
  position:absolute;top:50%;left:50%;
  border-radius:50%;
  transform:translate(-50%,-50%);
  animation:ringPulse 4.5s ease-in-out infinite;
}
.er-1{
  width:clamp(58px,7vw,74px);height:clamp(58px,7vw,74px);
  border:2px solid rgba(200,168,75,0.55);
  box-shadow:0 0 26px rgba(200,168,75,0.16), inset 0 0 18px rgba(200,168,75,0.06);
  animation-delay:0s;
}
.er-2{
  width:clamp(76px,9.5vw,96px);height:clamp(76px,9.5vw,96px);
  border:1px solid rgba(200,168,75,0.22);
  animation-delay:0.7s;
}
.er-3{
  width:clamp(94px,12vw,120px);height:clamp(94px,12vw,120px);
  border:1px solid rgba(200,168,75,0.09);
  animation-delay:1.4s;
}
@keyframes ringPulse{
  0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}
  50%{opacity:0.3;transform:translate(-50%,-50%) scale(1.05);}
}
.emblem-cross{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);
  font-family:var(--f-display);
  font-size:clamp(20px,3vw,28px);
  color:var(--gold);
  text-shadow:0 0 22px rgba(200,168,75,0.7);
  line-height:1;
  animation:crossGlow 4.5s ease-in-out infinite;
}
@keyframes crossGlow{
  0%,100%{text-shadow:0 0 22px rgba(200,168,75,0.7);}
  50%{text-shadow:0 0 50px rgba(200,168,75,1), 0 0 90px rgba(200,168,75,0.35);}
}

.eyebrow-row{
  font-family:var(--f-ui);
  font-size:8.5px;font-weight:700;
  letter-spacing:0.65em;text-transform:uppercase;
  color:var(--gold);
  display:flex;align-items:center;justify-content:center;
  gap:14px;margin-bottom:14px;
}
.ey-line{height:1px;width:34px;background:linear-gradient(90deg,transparent,var(--gold));}
.ey-line.r{background:linear-gradient(90deg,var(--gold),transparent);}

.card-title{
  font-family:var(--f-display);
  font-size:var(--title-size);
  font-weight:600;
  letter-spacing:0.09em;
  line-height:0.9;
  margin-bottom:10px;
  background:linear-gradient(105deg, var(--gold) 0%, var(--gold4) 20%, var(--gold2) 38%, #fff9e0 54%, var(--gold3) 72%, var(--gold) 100%);
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:prismShift 5.5s linear infinite;
  filter:drop-shadow(0 0 28px rgba(200,168,75,0.22));
}
.card-sub{
  font-family:var(--f-serif);
  font-size:clamp(12px,1.3vw,13.5px);
  font-style:italic;
  color:rgba(253,250,244,0.28);
  letter-spacing:0.2em;
}

/* ── DIVIDER ── */
.gold-div{display:flex;align-items:center;gap:14px;margin:clamp(18px,2.5vw,28px) 0 clamp(20px,3vw,30px);}
.gd-l{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--border2));}
.gd-l.r{background:linear-gradient(90deg,var(--border2),transparent);}
.gd-gem{
  width:8px;height:8px;
  background:var(--gold);
  transform:rotate(45deg);
  box-shadow:0 0 14px rgba(200,168,75,0.65);
  flex-shrink:0;
  animation:gemSpin 8s linear infinite;
}
@keyframes gemSpin{from{transform:rotate(45deg);}to{transform:rotate(405deg);}}

/* ── FORM ELEMENTS ── */
.form-group{margin-bottom:clamp(14px,2vw,20px);}
.form-label{
  display:block;
  font-family:var(--f-ui);
  font-size:8.5px;font-weight:700;
  letter-spacing:0.52em;text-transform:uppercase;
  color:rgba(253,250,244,0.3);
  margin-bottom:9px;
  transition:color 0.3s;
}
.form-group.active .form-label{color:var(--gold);}
.form-group.err .form-label{color:rgba(255,120,120,0.8);}

.input-wrap{position:relative;}
.form-input{
  width:100%;
  padding:clamp(12px,1.8vw,15px) 48px clamp(12px,1.8vw,15px) 18px;
  background:rgba(200,168,75,0.035);
  border:1px solid rgba(200,168,75,0.12);
  color:var(--white);
  font-family:var(--f-ui);
  font-size:clamp(12.5px,1.4vw,13.5px);
  font-weight:500;
  letter-spacing:0.04em;
  outline:none;
  transition:all 0.35s var(--ease);
  border-radius:var(--radius);
  -webkit-appearance:none;
}
.form-input::placeholder{color:rgba(200,168,75,0.2);font-style:italic;font-weight:400;letter-spacing:0.06em;}
.form-input:focus{
  background:rgba(200,168,75,0.07);
  border-color:rgba(200,168,75,0.48);
  box-shadow:0 0 0 1px rgba(200,168,75,0.16), 0 0 36px rgba(200,168,75,0.06), inset 0 0 20px rgba(200,168,75,0.025);
}
.form-input.err{border-color:rgba(255,100,100,0.45);background:rgba(255,80,80,0.035);}
.input-icon{
  position:absolute;right:16px;top:50%;transform:translateY(-50%);
  color:rgba(200,168,75,0.25);font-size:14px;
  transition:color 0.3s;pointer-events:none;user-select:none;
}
.form-group.active .input-icon{color:rgba(200,168,75,0.65);}
.input-icon.btn{pointer-events:all;cursor:pointer;}
.input-bar{
  position:absolute;bottom:0;left:0;
  height:2px;width:0;
  background:linear-gradient(90deg,var(--gold3),var(--gold));
  transition:width 0.45s var(--ease);
  border-radius:0 0 2px 2px;
}
.form-group.active .input-bar{width:100%;}
.form-err-msg{
  font-family:var(--f-ui);
  font-size:9px;font-weight:600;
  letter-spacing:0.2em;
  color:#ff8080;
  margin-top:7px;
  display:flex;align-items:center;gap:6px;
  opacity:0;max-height:0;overflow:hidden;
  transition:opacity 0.3s,max-height 0.3s;
}
.form-err-msg.show{opacity:1;max-height:28px;}
.err-dot{width:4px;height:4px;border-radius:50%;background:#ff8080;flex-shrink:0;}

/* ── REMEMBER / FORGOT ── */
.remember-row{
  display:flex;align-items:center;justify-content:space-between;
  margin:6px 0 clamp(20px,3vw,32px);
  flex-wrap:wrap;gap:10px;
}
.remember-left{display:flex;align-items:center;gap:12px;cursor:pointer;user-select:none;}
.check-box{
  width:17px;height:17px;
  border:1.5px solid rgba(200,168,75,0.25);
  position:relative;flex-shrink:0;
  cursor:pointer;
  transition:all 0.3s;
  border-radius:1px;
}
.check-box.on{border-color:var(--gold);background:rgba(200,168,75,0.09);box-shadow:0 0 10px rgba(200,168,75,0.18);}
.check-inner{
  position:absolute;top:3px;left:3px;right:3px;bottom:3px;
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  transform:scale(0) rotate(-30deg);
  transition:transform 0.28s var(--ease3),opacity 0.28s;
  opacity:0;
}
.check-box.on .check-inner{transform:scale(1) rotate(0deg);opacity:1;}
.remember-txt{
  font-family:var(--f-ui);
  font-size:10.5px;font-weight:500;
  letter-spacing:0.16em;
  color:rgba(253,250,244,0.38);
  cursor:pointer;
  transition:color 0.3s;
}
.remember-txt:hover{color:var(--gold3);}
.forgot-btn{
  font-family:var(--f-ui);
  font-size:9.5px;font-weight:700;
  letter-spacing:0.24em;text-transform:uppercase;
  color:rgba(200,168,75,0.45);
  background:none;border:none;cursor:pointer;
  padding:0;
  transition:color 0.3s,text-shadow 0.3s;
}
.forgot-btn:hover{color:var(--gold3);text-shadow:0 0 14px rgba(200,168,75,0.3);}

/* ── SUBMIT BUTTON ── */
.submit-btn{
  width:100%;
  padding:clamp(15px,2.2vw,20px) 44px;
  background:linear-gradient(135deg,var(--gold2),var(--gold));
  color:var(--black);
  border:none;cursor:pointer;
  font-family:var(--f-ui);
  font-size:10.5px;font-weight:700;
  letter-spacing:0.46em;text-transform:uppercase;
  position:relative;overflow:hidden;
  transition:transform 0.35s var(--ease),box-shadow 0.35s;
  box-shadow:0 8px 38px rgba(200,168,75,0.36);
  margin-bottom:clamp(16px,2.5vw,24px);
  border-radius:var(--radius);
}
.submit-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--gold4),var(--gold3));
  opacity:0;transition:opacity 0.3s;
}
.submit-btn::after{
  content:'';position:absolute;
  top:0;left:-130%;
  width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent);
  transform:skewX(-20deg);
  transition:left 0.8s var(--ease);
}
.submit-btn:hover{transform:translateY(-3px);box-shadow:0 18px 60px rgba(200,168,75,0.55),0 0 80px rgba(200,168,75,0.10);}
.submit-btn:hover::before{opacity:1;}
.submit-btn:hover::after{left:170%;}
.submit-btn:active{transform:translateY(1px);box-shadow:0 4px 18px rgba(200,168,75,0.28);}
.submit-btn:disabled{opacity:0.65;cursor:not-allowed;transform:none;}
.btn-inner{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:14px;}
.btn-arrow{display:inline-block;transition:transform 0.3s;}
.submit-btn:hover .btn-arrow{transform:translateX(6px);}
.btn-spinner{
  width:18px;height:18px;
  border:2px solid rgba(5,5,14,0.2);
  border-top-color:var(--black);
  border-radius:50%;
  animation:spin 0.7s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}

/* ── OR DIVIDER ── */
.or-div{display:flex;align-items:center;gap:14px;margin:clamp(10px,1.8vw,18px) 0;}
.or-l{flex:1;height:1px;background:var(--border);}
.or-txt{
  font-family:var(--f-ui);
  font-size:8.5px;font-weight:700;
  letter-spacing:0.42em;text-transform:uppercase;
  color:rgba(200,168,75,0.28);
  white-space:nowrap;
}

/* ── SOCIAL BUTTONS ── */
.social-row{display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:clamp(16px,2.5vw,24px);}
.social-btn{
  padding:clamp(11px,1.5vw,14px) 16px;
  background:rgba(200,168,75,0.035);
  border:1px solid rgba(200,168,75,0.12);
  color:rgba(253,250,244,0.45);
  font-family:var(--f-ui);
  font-size:9.5px;font-weight:700;
  letter-spacing:0.26em;text-transform:uppercase;
  cursor:pointer;
  transition:all 0.3s var(--ease);
  display:flex;align-items:center;justify-content:center;gap:10px;
  border-radius:var(--radius);
  position:relative;overflow:hidden;
}
.social-btn::before{
  content:'';position:absolute;inset:0;
  background:rgba(200,168,75,0.04);
  opacity:0;transition:opacity 0.3s;
}
.social-btn:hover{
  border-color:rgba(200,168,75,0.38);
  color:var(--gold3);
  transform:translateY(-2px);
  box-shadow:0 8px 28px rgba(200,168,75,0.1);
}
.social-btn:hover::before{opacity:1;}
.social-btn:active{transform:translateY(0);}
.social-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
.s-icon{font-size:15px;line-height:1;font-weight:700;flex-shrink:0;}
.s-google{
  font-family:'Arial',sans-serif;
  background:linear-gradient(135deg,#4285F4,#34A853,#FBBC05,#EA4335);
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
  font-size:16px;font-weight:900;
}

/* ── REGISTER LINK ── */
.register-row{
  text-align:center;
  font-family:var(--f-ui);
  font-size:10px;font-weight:500;
  letter-spacing:0.2em;
  color:rgba(253,250,244,0.28);
}
.reg-link{
  color:var(--gold3);text-decoration:none;
  font-weight:700;margin-left:6px;
  transition:color 0.3s,text-shadow 0.3s;
}
.reg-link:hover{color:var(--gold4);text-shadow:0 0 14px rgba(200,168,75,0.35);}

/* ── CARD FOOTER ── */
.card-foot{margin-top:clamp(20px,3vw,34px);text-align:center;}
.cf-orn{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:16px;}
.cf-l{height:1px;width:48px;background:linear-gradient(90deg,transparent,var(--border));}
.cf-l.r{background:linear-gradient(90deg,var(--border),transparent);}
.cf-gem{font-size:10px;color:rgba(200,168,75,0.38);animation:gemSpin 10s linear infinite;}
.cf-links{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;}
.cf-link{
  font-family:var(--f-ui);
  font-size:8px;font-weight:700;
  letter-spacing:0.44em;text-transform:uppercase;
  color:rgba(200,168,75,0.18);text-decoration:none;
  transition:color 0.3s;
}
.cf-link:hover{color:var(--gold);}

/* ── SUCCESS OVERLAY ── */
.success-overlay{
  position:absolute;inset:0;z-index:20;
  background:rgba(3,3,10,0.97);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;
  opacity:0;pointer-events:none;
  transition:opacity 0.5s var(--ease);
  backdrop-filter:blur(16px);
  padding:24px;
  border-radius:var(--radius);
}
.success-overlay.show{opacity:1;pointer-events:all;}
.success-cross{
  font-size:clamp(44px,8vw,62px);
  color:var(--gold);
  text-shadow:0 0 50px rgba(200,168,75,0.85);
  animation:successPop 0.6s var(--ease3) both;
}
@keyframes successPop{
  from{transform:scale(0) rotate(-90deg);opacity:0;}
  to{transform:scale(1) rotate(0deg);opacity:1;}
}
.success-title{
  font-family:var(--f-display);
  font-size:clamp(26px,5vw,38px);
  letter-spacing:0.12em;
  color:var(--white);
  text-align:center;
}
.success-sub{
  font-family:var(--f-serif);
  font-size:clamp(14px,2vw,17px);
  font-style:italic;
  color:var(--muted);
  text-align:center;
}
.success-track{width:190px;height:1px;background:var(--faint);margin-top:6px;overflow:hidden;}
.success-fill{height:100%;background:linear-gradient(90deg,var(--gold3),var(--gold));animation:sFill 2s ease-in-out forwards;}
@keyframes sFill{from{width:0;}to{width:100%;}}

/* ── TOAST ── */
.toast{
  position:fixed;
  bottom:clamp(16px,3vw,32px);right:clamp(16px,3vw,32px);
  z-index:99999;
  background:rgba(6,6,16,0.97);
  border:1px solid rgba(200,168,75,0.28);
  padding:15px 20px;
  max-width:300px;
  display:flex;align-items:center;gap:12px;
  transform:translateY(16px) scale(0.98);
  opacity:0;
  transition:transform 0.42s var(--ease),opacity 0.42s;
  pointer-events:none;
  backdrop-filter:blur(24px);
  box-shadow:0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,168,75,0.05);
  border-radius:var(--radius);
}
.toast.show{transform:translateY(0) scale(1);opacity:1;}
.toast.error-toast{border-color:rgba(255,100,100,0.3);}
.toast-icon{font-size:17px;color:var(--gold);flex-shrink:0;}
.toast.error-toast .toast-icon{color:#ff8080;}
.toast-msg{
  font-family:var(--f-ui);
  font-size:10.5px;font-weight:600;
  letter-spacing:0.14em;
  color:rgba(253,250,244,0.65);
  line-height:1.4;
}

/* ── PAGE FOOTER ── */
.page-footer{
  width:100%;max-width:1300px;
  margin-top:clamp(40px,6vw,80px);
  padding-top:clamp(18px,2.5vw,28px);
  border-top:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:16px;
}
.pf-copy{
  font-family:var(--f-ui);
  font-size:8px;font-weight:600;
  letter-spacing:0.36em;text-transform:uppercase;
  color:rgba(200,168,75,0.18);
}
.pf-orn{display:flex;align-items:center;gap:12px;}
.pf-l{height:1px;width:32px;background:var(--border);}
.pf-d{width:5px;height:5px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 8px rgba(200,168,75,0.4);animation:gemSpin 7s linear infinite;}
.pf-links{display:flex;gap:clamp(12px,2vw,22px);flex-wrap:wrap;}
.pf-link{
  font-family:var(--f-ui);
  font-size:8px;font-weight:600;
  letter-spacing:0.36em;text-transform:uppercase;
  color:rgba(200,168,75,0.18);text-decoration:none;
  transition:color 0.3s;
}
.pf-link:hover{color:var(--gold);}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .main-grid{grid-template-columns:1fr 440px;gap:clamp(32px,4vw,56px);}
  :root{--hero-title:clamp(52px,8vw,86px);--card-pad-h:42px;}
}
@media(max-width:900px){
  .main-grid{grid-template-columns:1fr;max-width:500px;gap:0;}
  .left-panel{display:none;}
  :root{--card-pad-h:40px;--card-pad-v:48px;--title-size:clamp(36px,8vw,52px);}
}
@media(max-width:600px){
  :root{--card-pad-h:clamp(20px,5.5vw,34px);--card-pad-v:clamp(32px,6vw,44px);}
  .main-grid{max-width:100%;}
  .nav-a{display:none;}
  .nav-give{padding:9px 16px;letter-spacing:0.18em;}
  .breadcrumb{padding:12px 0 24px;}
}
@media(max-width:400px){
  :root{--card-pad-h:16px;--card-pad-v:28px;}
  .card-title{font-size:32px;}
  .emblem{width:52px;height:52px;}
  .er-1{width:52px;height:52px;}
  .er-2{width:68px;height:68px;}
  .er-3{width:84px;height:84px;}
  .emblem-cross{font-size:18px;}
  .remember-row{flex-direction:column;align-items:flex-start;gap:10px;}
  .pf-orn{display:none;}
}
@media(max-width:320px){
  :root{--card-pad-h:12px;--card-pad-v:24px;}
  .card-title{font-size:28px;}
}
`;

/* ─── SACRED GEOMETRY ─── */
function SacredGeometry() {
  const c = 450,
    r = 396;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  });
  const outer = pts
    .filter((_, i) => i % 2 === 0)
    .map((p) => p.join(","))
    .join(" ");
  const inner = pts
    .filter((_, i) => i % 2 === 1)
    .map((p) => p.join(","))
    .join(" ");
  const midR = r * 0.58;
  const mid = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [c + midR * Math.cos(a), c + midR * Math.sin(a)];
  });
  return (
    <div className="bg-sacred">
      <svg
        width="900"
        height="900"
        viewBox="0 0 900 900"
        fill="none"
        stroke="#C8A84B"
      >
        <g className="sac-outer">
          <circle cx={c} cy={c} r={r} strokeWidth="0.7" opacity="0.7" />
          <polygon points={outer} strokeWidth="0.8" opacity="0.65" />
          <polygon points={inner} strokeWidth="0.8" opacity="0.6" />
          <circle cx={c} cy={c} r={r * 0.58} strokeWidth="0.5" opacity="0.5" />
          <circle cx={c} cy={c} r={r * 0.33} strokeWidth="0.5" opacity="0.45" />
          {pts.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r * 0.42}
              strokeWidth="0.3"
              opacity="0.16"
            />
          ))}
        </g>
        <g className="sac-inner">
          {mid.map(([x, y], i) => (
            <line
              key={i}
              x1={c}
              y1={c}
              x2={x}
              y2={y}
              strokeWidth="0.3"
              opacity="0.3"
            />
          ))}
          {pts.map(([x, y], i) => {
            const nxt = pts[(i + 1) % 6];
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={nxt[0]}
                y2={nxt[1]}
                strokeWidth="0.28"
                opacity="0.2"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* ─── CURSOR ─── */
function Cursor() {
  const dot = useRef(null),
    ring = useRef(null);
  useEffect(() => {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      raf;
    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const over = (e) => {
      ring.current?.classList.toggle(
        "hover",
        !!e.target.closest("a,button,[role='button'],input,label,[tabindex]"),
      );
    };
    const loop = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      if (dot.current) dot.current.style.cssText = `left:${mx}px;top:${my}px;`;
      if (ring.current)
        ring.current.style.cssText = `left:${rx}px;top:${ry}px;`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div className="cur-dot" ref={dot} />
      <div className="cur-ring" ref={ring} />
    </>
  );
}

/* ─── PARTICLES ─── */
function Particles() {
  const items = useState(() =>
    Array.from({ length: 20 }, () => ({
      size: 1 + Math.random() * 3,
      left: Math.random() * 100,
      dur: 15 + Math.random() * 24,
      delay: Math.random() * 22,
      op: 0.08 + Math.random() * 0.18,
    })),
  )[0];
  return (
    <>
      {items.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            background: `rgba(200,168,75,${p.op * 0.55})`,
            "--p-op": p.op,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function SMHOSLogin() {
  const navigate = useNavigate();

  /* — state — */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", error: false });

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  /* — toast helper — */
  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  };

  /* — auth state listener: runs after Google redirect — */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
              lastLogin: serverTimestamp(),
            },
            { merge: true },
          );
          setSuccess(true);
          // FIX: redirect to dashboard, not /login
          setTimeout(() => navigate("/"), 1800);
        } catch (err) {
          console.error("Firestore write error:", err);
          showToast("Profile sync failed. Please try again.", true);
        }
      }
    });
    return () => unsub();
  }, [navigate]);

  /* — validation — */
  const validateEmail = (val) => {
    if (!val) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      return "Please enter a valid email";
    return "";
  };
  const validatePassword = (val) => {
    if (!val) return "Password is required";
    if (val.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  /* — email + password sign in — */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailErr(eErr);
    setPwErr(pErr);
    if (eErr || pErr) return;

    try {
      setLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle success + redirect
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : err.code === "auth/wrong-password"
            ? "Incorrect password. Please try again."
            : err.code === "auth/invalid-credential"
              ? "Invalid email or password."
              : err.code === "auth/too-many-requests"
                ? "Too many attempts. Please wait a moment."
                : "Sign-in failed. Please try again.";
      showToast(msg, true);
    } finally {
      setLoading(false);
    }
  };

  /* — Google sign in — */
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await setPersistence(auth, browserLocalPersistence);
      // Use popup on desktop, redirect on mobile
      if (isTouch) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
        // onAuthStateChanged handles success
      }
    } catch (err) {
      console.error("Google login error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        showToast("Google sign-in failed. Please try again.", true);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  /* — forgot password — */
  const handleForgotPassword = async () => {
    const eErr = validateEmail(email);
    if (eErr) {
      setEmailErr("Enter your email above first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent. Check your inbox.");
    } catch (err) {
      console.error("Reset error:", err);
      showToast("Could not send reset email. Please try again.", true); 
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="grain" />
      {!isTouch && <Cursor />}
      <Particles />

      {/* TOAST */}
      <div
        className={`toast${toast.show ? " show" : ""}${toast.error ? " error-toast" : ""}`}
      >
        <span className="toast-icon">{toast.error ? "✕" : "✦"}</span>
        <span className="toast-msg">{toast.msg}</span>
      </div>

      {/* BACKGROUND */}
      <div className="bg-wrap">
        <div className="bg-gradient" />
        <div className="god-rays" />
        <div className="bg-rings">
          <div className="bg-ring" />
          <div className="bg-ring" />
          <div className="bg-ring" />
          <div className="bg-ring" />
        </div>
        <div className="bg-glow" />
        <SacredGeometry />
        <div className="bg-vignette" />
      </div>

      {/* PAGE */}
      <div className="page">
        {/* NAV */}
        <nav className="sm-nav">
          <div className="nav-logo">
            {!logoError ? (
              <img
                src="https://membership.smhos.org/images/logo-light.png"
                alt="SMHOS"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="nav-logo-fallback">SMHOS</span>
            )}
          </div>
          <div className="nav-links">
            <a
              href="https://membership.smhos.org/member/testimonies"
              className="nav-a"
            >
              Testimonies
            </a>
            <a
              href="https://membership.smhos.org/member/messages"
              className="nav-a"
            >
              Messages
            </a>
            <a
              href="https://membership.smhos.org/member/blog"
              className="nav-a"
            >
              Blog
            </a>
            <Link to="/give" className="nav-give">
              <span>Give Online</span>
            </Link>
          </div>
        </nav>

        {/* BREADCRUMB */}
        <div className="breadcrumb">
          <a href="/" className="bc">
            Home
          </a>
          <span className="bc-sep">›</span>
          <span className="bc bc-active">Member Portal</span>
          <span className="bc-sep">›</span>
          <span className="bc bc-active">Sign In</span>
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <div className="lp-eyebrow">
              <div className="lp-eye-line" />
              Welcome Back
            </div>
            <div className="lp-title">
              <span className="lp-title-grad">
                SALVATION
                <br />
                MINISTRIES
              </span>
            </div>
            <div className="lp-sub">
              Home of Success · Member Portal
              <br />
              You'll be notified when there is a new program. God bless you.
            </div>
            <div className="verse-block">
              <div className="verse-shimmer" />
              <div className="verse-accent-tl" />
              <div className="verse-accent-br" />
              <p className="verse-text">
                "But seek first the kingdom of God and His righteousness, and
                all these things will be added to you."
              </p>
              <div className="verse-ref">Matthew 6:33 · NKJV</div>
            </div>
            <div className="stats-row">
              <div className="stat">
                <div className="stat-n">29+</div>
                <div className="stat-l">Years of Ministry</div>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <div className="stat-n">100+</div>
                <div className="stat-l">Church Branches</div>
              </div>
              <div className="stat-sep" />
              <div className="stat">
                <div className="stat-n">Global</div>
                <div className="stat-l">Kingdom Reach</div>
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="card-outer">
            <div className="shimmer-border" />
            <div className="card-accent ca-tl" />
            <div className="card-accent ca-tr" />
            <div className="card-accent ca-bl" />
            <div className="card-accent ca-br" />

            <div className="login-card">
              <div className="scan-line" />
              <div className="card-glow" />

              {/* SUCCESS */}
              <div className={`success-overlay${success ? " show" : ""}`}>
                <div className="success-cross">✝</div>
                <div className="success-title">WELCOME BACK</div>
                <div className="success-sub">Redirecting to your portal…</div>
                <div className="success-track">
                  <div className="success-fill" />
                </div>
              </div>

              {/* HEADER */}
              <div className="card-head">
                <div className="emblem">
                  <div className="emblem-ring er-1" />
                  <div className="emblem-ring er-2" />
                  <div className="emblem-ring er-3" />
                  <div className="emblem-cross">✝</div>
                </div>
                <div className="eyebrow-row">
                  <div className="ey-line" />
                  Member Portal
                  <div className="ey-line r" />
                </div>
                <div className="card-title">SIGN IN</div>
                <div className="card-sub">
                  Salvation Ministries · Home of Success
                </div>
              </div>

              {/* DIVIDER */}
              <div className="gold-div">
                <div className="gd-l" />
                <div className="gd-gem" />
                <div className="gd-l r" />
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} noValidate>
                {/* EMAIL */}
                <div
                  className={`form-group${emailFocus ? " active" : ""}${emailErr ? " err" : ""}`}
                >
                  <label className="form-label">Email Address</label>
                  <div className="input-wrap">
                    <input
                      className={`form-input${emailErr ? " err" : ""}`}
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      autoComplete="email"
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => {
                        setEmailFocus(false);
                        setEmailErr(validateEmail(email));
                      }}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailErr) setEmailErr("");
                      }}
                    />
                    <span className="input-icon">✉</span>
                    <div className="input-bar" />
                  </div>
                  <div className={`form-err-msg${emailErr ? " show" : ""}`}>
                    <div className="err-dot" />
                    {emailErr}
                  </div>
                </div>

                {/* PASSWORD */}
                <div
                  className={`form-group${pwFocus ? " active" : ""}${pwErr ? " err" : ""}`}
                >
                  <label className="form-label">Password</label>
                  <div className="input-wrap">
                    <input
                      className={`form-input${pwErr ? " err" : ""}`}
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      autoComplete="current-password"
                      onFocus={() => setPwFocus(true)}
                      onBlur={() => {
                        setPwFocus(false);
                        setPwErr(validatePassword(password));
                      }}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (pwErr) setPwErr("");
                      }}
                    />
                    <span
                      className="input-icon btn"
                      onClick={() => setShowPw((v) => !v)}
                      title={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? "○" : "●"}
                    </span>
                    <div className="input-bar" />
                  </div>
                  <div className={`form-err-msg${pwErr ? " show" : ""}`}>
                    <div className="err-dot" />
                    {pwErr}
                  </div>
                </div>

                {/* REMEMBER + FORGOT */}
                <div className="remember-row">
                  <div
                    className="remember-left"
                    onClick={() => setRemember((v) => !v)}
                  >
                    <div className={`check-box${remember ? " on" : ""}`}>
                      <div className="check-inner" />
                    </div>
                    <span className="remember-txt">Remember me</span>
                  </div>
                  {/* FIX: forgot password now calls sendPasswordResetEmail */}
                  <button
                    type="button"
                    className="forgot-btn"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* SIGN IN BTN */}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || success}
                >
                  <span className="btn-inner">
                    {loading ? (
                      <>
                        <div className="btn-spinner" /> Signing in…
                      </>
                    ) : (
                      <>
                        Sign In <span className="btn-arrow">→</span>
                      </>
                    )}
                  </span>
                </button>

                {/* OR */}
                <div className="or-div">
                  <div className="or-l" />
                  <span className="or-txt">or continue with</span>
                  <div className="or-l" />
                </div>

                {/* GOOGLE */}
                <div className="social-row">
                  <button
                    type="button"
                    className="social-btn"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || loading || success}
                  >
                    {googleLoading ? (
                      <>
                        <div className="btn-spinner" /> Connecting…
                      </>
                    ) : (
                      <>
                        <span className="s-icon s-google">G</span> Continue with
                        Google
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* CARD FOOTER */}
              <div className="card-foot">
                <div className="cf-orn">
                  <div className="cf-l" />
                  <span className="cf-gem">✦</span>
                  <div className="cf-l r" />
                </div>
                <div className="cf-links">
                  <a href="#" className="cf-link">
                    Privacy
                  </a>
                  <a href="#" className="cf-link">
                    Terms
                  </a>
                  <a href="#" className="cf-link">
                    Help
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE FOOTER */}
        <div className="page-footer">
          <div className="pf-copy">
            © 2026 Salvation Ministries. All Rights Reserved.
          </div>
          <div className="pf-orn">
            <div className="pf-l" />
            <div className="pf-d" />
            <div className="pf-l" />
          </div>
          <div className="pf-links">
            <Link to="/contact" className="pf-link">
              Contact
            </Link>
            <Link to="/give" className="pf-link">
              Give
            </Link>
            <Link to="/" className="pf-link">
              smhos.com.ng
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
