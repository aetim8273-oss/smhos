import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
/* ═══════════════════════════════════════════════════════════ CSS ══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700;1,900&family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap');

@property --shimmer-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --border-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --sweep-pos{syntax:'<percentage>';initial-value:0%;inherits:false;}
@property --hue-rot{syntax:'<angle>';initial-value:0deg;inherits:false;}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

:root {
  --black:#03030A;
  --deep:#06060F;
  --dark:#0C0C1A;
  --mid:#161628;
  --panel:#10101E;
  --card:#13132A;
  --void:#01010A;

  --gold:#C8A84B;
  --gold2:#E2C06A;
  --gold3:#F5D98A;
  --gold4:#FFF0BB;
  --gold5:#FFE082;
  --glow:rgba(200,168,75,0.18);
  --glow2:rgba(200,168,75,0.35);
  --border:rgba(200,168,75,0.15);
  --border2:rgba(200,168,75,0.42);
  --border3:rgba(200,168,75,0.65);

  --white:#FDFAF4;
  --cream:#F5EDDA;
  --muted:#8A8070;
  --faint:#3A3830;

  --crimson:#9B1B30;
  --crimson2:#C42041;

  --f-display:'Bebas Neue',sans-serif;
  --f-serif:'Playfair Display',serif;
  --f-body:'Libre Baskerville',serif;
  --f-ui:'Montserrat',sans-serif;

  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
  --ease4:cubic-bezier(0.22,1,0.36,1);
}

body{background:var(--black);color:var(--white);font-family:var(--f-body);overflow-x:hidden;}
a{text-decoration:none;color:inherit;}

::-webkit-scrollbar{width:2px;}
::-webkit-scrollbar-track{background:var(--void);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--gold3));border-radius:2px;}

/* ── SCROLL PROGRESS ──────────────────────────────────────── */
.ab-progress{
  position:fixed;top:0;left:0;height:2px;z-index:99999;
  background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold));
  background-size:200% auto;
  transition:width 0.1s linear;
  box-shadow:0 0 12px rgba(200,168,75,0.9),0 0 30px rgba(200,168,75,0.5);
  animation:progressShimmer 3s linear infinite;
}
@keyframes progressShimmer{0%{background-position:0% center;}100%{background-position:200% center;}}

/* ── GRAIN ────────────────────────────────────────────────── */
.ab-grain{
  position:fixed;inset:0;z-index:9990;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:128px;opacity:0.028;mix-blend-mode:overlay;
  animation:grainShift 0.35s steps(3) infinite;
}
@keyframes grainShift{0%{transform:translate(0,0);}33%{transform:translate(-4px,3px);}66%{transform:translate(4px,-3px);}100%{transform:translate(-2px,4px);}}

/* ── VIGNETTE OVERLAY ─────────────────────────────────────── */
.ab-vignette{
  position:fixed;inset:0;z-index:9989;pointer-events:none;
  background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 60%,rgba(3,3,10,0.4) 100%);
}

/* ── CURSOR ───────────────────────────────────────────────── */
.ab-cur-dot{
  position:fixed;pointer-events:none;z-index:99997;
  width:5px;height:5px;background:var(--gold4);border-radius:50%;
  transform:translate(-50%,-50%);mix-blend-mode:difference;
  transition:background 0.2s;
}
.ab-cur-ring{
  position:fixed;pointer-events:none;z-index:99996;
  width:36px;height:36px;border:1px solid var(--border2);border-radius:50%;
  transform:translate(-50%,-50%);
  transition:width 0.4s var(--ease),height 0.4s var(--ease),border-color 0.4s,background 0.3s;
}
.ab-cur-ring.h{
  width:64px;height:64px;border-color:var(--gold);
  background:rgba(200,168,75,0.06);
}
.ab-cur-ring.click{width:20px;height:20px;background:rgba(200,168,75,0.3);}

/* ── BACK BUTTON ─────────────────────────────────────────── */
.ab-back{
  position:fixed;top:28px;left:36px;z-index:1000;
  display:flex;align-items:center;gap:10px;
  font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;
  color:var(--gold3);cursor:pointer;padding:13px 22px;
  border:1px solid var(--border);background:rgba(3,3,10,0.92);
  backdrop-filter:blur(28px);transition:all 0.4s var(--ease);
}
@keyframes borderSpin{from{--border-angle:0deg;}to{--border-angle:360deg;}}
.ab-back::before{
  content:'';position:absolute;inset:-1px;z-index:-1;
  background:conic-gradient(from var(--border-angle),transparent 0%,var(--gold3) 10%,transparent 20%);
  opacity:0;animation:borderSpin 3s linear infinite;transition:opacity 0.4s;
}
.ab-back:hover::before{opacity:1;}
.ab-back:hover{border-color:var(--gold2);color:var(--gold2);background:rgba(200,168,75,0.07);}
.ab-back-arrow{font-size:16px;transition:transform 0.3s var(--ease3);}
.ab-back:hover .ab-back-arrow{transform:translateX(-6px);}

/* ══════════════════════════════════════════════════════════
   HERO — Cinematic Split Layout (Enhanced)
   ══════════════════════════════════════════════════════════ */
.ab-hero{
  min-height:100vh;position:relative;display:grid;
  grid-template-columns:1fr 1fr;overflow:hidden;background:var(--void);
}

.ab-hero-left{
  position:relative;z-index:5;display:flex;flex-direction:column;
  justify-content:center;padding:120px 80px 120px 100px;
  border-right:1px solid var(--border);
  background:linear-gradient(135deg,var(--void) 0%,rgba(12,12,26,0.7) 100%);
}
/* Subtle mesh behind left panel */
.ab-hero-left::before{
  content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(ellipse 60% 40% at 10% 80%,rgba(200,168,75,0.05) 0%,transparent 70%),
    radial-gradient(ellipse 40% 60% at 90% 20%,rgba(155,27,48,0.04) 0%,transparent 60%);
}
/* Animated hex grid lines */
.ab-hero-hexgrid{
  position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;opacity:0.04;
}

.ab-hero-right{position:relative;overflow:hidden;}
.ab-hero-img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  filter:brightness(0.4) saturate(0.6) contrast(1.15);
  transition:transform 22s ease;
}
.ab-hero-right:hover .ab-hero-img{transform:scale(1.08);}
.ab-hero-img-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to right,var(--void) 0%,rgba(3,3,10,0.35) 40%,transparent 100%),
    linear-gradient(to top,var(--void) 0%,transparent 45%);
}
/* Split line animated */
.ab-hero-split-line{
  position:absolute;left:-1px;top:0;bottom:0;width:1px;z-index:10;
  background:linear-gradient(to bottom,transparent 0%,var(--gold) 20%,var(--gold3) 50%,var(--gold) 80%,transparent 100%);
  animation:splitLinePulse 4s ease-in-out infinite;
  filter:blur(0.3px);
}
.ab-hero-split-line::after{
  content:'';position:absolute;left:-3px;top:0;bottom:0;width:7px;
  background:inherit;filter:blur(4px);opacity:0.5;
}
@keyframes splitLinePulse{0%,100%{opacity:0.6;}50%{opacity:1;filter:drop-shadow(0 0 8px rgba(200,168,75,0.9));}}

.ab-hero-img-tag{
  position:absolute;top:44px;right:44px;z-index:6;
  background:rgba(3,3,10,0.88);border:1px solid var(--border2);
  backdrop-filter:blur(20px);padding:14px 22px;
  font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold3);
}
.ab-hero-img-year{
  position:absolute;bottom:44px;left:44px;z-index:6;
  font-family:var(--f-display);font-size:clamp(80px,10vw,160px);font-weight:400;
  color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.3);line-height:1;
  letter-spacing:0.05em;pointer-events:none;user-select:none;
  text-shadow:0 0 80px rgba(200,168,75,0.15);
}
.ab-hero-canvas{position:absolute;inset:0;pointer-events:none;z-index:3;}

/* Hero eyebrow */
.ab-hero-eyebrow{
  display:flex;align-items:center;gap:14px;
  font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.6em;text-transform:uppercase;color:var(--gold);
  margin-bottom:22px;opacity:0;animation:abFadeUp 0.8s 0.3s var(--ease) forwards;
}
.ab-hero-eyebrow-line{height:1px;width:40px;background:linear-gradient(90deg,transparent,var(--gold));}
.ab-hero-eyebrow-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);animation:dotPulse 2s ease-in-out infinite;box-shadow:0 0 8px var(--gold);}
@keyframes dotPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.15;transform:scale(0.4);}}

/* GLITCH title */
.ab-hero-title{
  font-family:var(--f-display);
  font-size:clamp(80px,11vw,160px);
  font-weight:400;line-height:0.86;letter-spacing:0.06em;
  color:var(--white);
  opacity:0;animation:abFadeUp 1s 0.45s var(--ease) forwards;
  position:relative;
}
.ab-hero-title-gold{
  display:block;
  background:linear-gradient(135deg,var(--gold3) 0%,var(--gold2) 40%,var(--gold4) 70%,var(--gold) 100%);
  background-size:200% auto;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 50px rgba(200,168,75,0.6));
  animation:abFadeUp 1s 0.45s var(--ease) forwards,prismShift 5s linear 1.5s infinite;
}
@keyframes prismShift{0%{background-position:0% center;}100%{background-position:200% center;}}

/* Glitch effect on title text */
.ab-hero-title-word{
  display:inline-block;position:relative;
}
.ab-hero-title-word::before,.ab-hero-title-word::after{
  content:attr(data-text);
  position:absolute;top:0;left:0;
  font-family:var(--f-display);font-size:inherit;letter-spacing:inherit;
  -webkit-text-fill-color:transparent;background-clip:text;-webkit-background-clip:text;
}
.ab-hero-title-word::before{
  background:linear-gradient(var(--crimson),var(--crimson));
  clip-path:polygon(0 0,100% 0,100% 45%,0 45%);
  animation:glitch1 8s infinite steps(1);
}
.ab-hero-title-word::after{
  background:linear-gradient(var(--gold3),var(--gold3));
  clip-path:polygon(0 60%,100% 60%,100% 100%,0 100%);
  animation:glitch2 8s infinite steps(1);
}
@keyframes glitch1{
  0%,94%,100%{transform:none;opacity:0;}
  95%{transform:translate(-3px,0) skewX(-4deg);opacity:0.6;}
  96%{transform:translate(3px,-1px) skewX(2deg);opacity:0.4;}
  97%{transform:none;opacity:0;}
}
@keyframes glitch2{
  0%,94%,100%{transform:none;opacity:0;}
  95%{transform:translate(3px,0) skewX(4deg);opacity:0.5;}
  96%{transform:translate(-3px,1px);opacity:0.3;}
  97%{transform:none;opacity:0;}
}

.ab-hero-rules{margin:28px 0 30px;opacity:0;animation:abFadeUp 0.7s 0.7s var(--ease) forwards;}
.ab-hero-rule{height:1px;width:0;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:5px;}
.ab-hero-rule:nth-child(1){animation:ruleExpand 1.2s 0.9s var(--ease) forwards;}
.ab-hero-rule:nth-child(2){opacity:0.5;animation:ruleExpand 1s 1.05s var(--ease) forwards;}
.ab-hero-rule:nth-child(3){opacity:0.2;animation:ruleExpand 0.8s 1.2s var(--ease) forwards;}
@keyframes ruleExpand{from{width:0;}to{width:100%;}}

.ab-hero-subtitle{
  font-family:var(--f-serif);font-size:clamp(16px,1.8vw,22px);font-style:italic;font-weight:400;
  color:rgba(253,250,244,0.38);letter-spacing:0.12em;margin-bottom:48px;
  opacity:0;animation:abFadeUp 0.8s 0.8s var(--ease) forwards;
}

/* Hero stats — animated counters */
.ab-hero-stats{
  display:grid;grid-template-columns:repeat(2,1fr);gap:1px;
  background:var(--faint);border:1px solid var(--border);
  opacity:0;animation:abFadeUp 0.8s 1s var(--ease) forwards;
}
.ab-hero-stat{
  background:var(--void);padding:22px 24px;text-align:center;position:relative;overflow:hidden;
  cursor:default;transition:background 0.5s var(--ease);
}
.ab-hero-stat::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 80% 120% at 50% 110%,rgba(200,168,75,0.14) 0%,transparent 70%);
  opacity:0;transition:opacity 0.6s;
}
.ab-hero-stat::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  transform:scaleX(0);transition:transform 0.5s var(--ease);
}
.ab-hero-stat:hover{background:var(--panel);}
.ab-hero-stat:hover::before{opacity:1;}
.ab-hero-stat:hover::after{transform:scaleX(1);}
.ab-hero-stat-n{
  font-family:var(--f-display);font-size:clamp(36px,4vw,56px);letter-spacing:0.04em;line-height:1;
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  transition:filter 0.3s;
}
.ab-hero-stat:hover .ab-hero-stat-n{filter:drop-shadow(0 0 20px rgba(200,168,75,0.9));}
.ab-hero-stat-l{font-family:var(--f-ui);font-size:8px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:var(--muted);margin-top:6px;}

.ab-hero-scroll{
  position:absolute;bottom:36px;left:100px;
  display:flex;align-items:center;gap:12px;
  opacity:0;animation:abFadeUp 0.8s 1.4s var(--ease) forwards;
}
.ab-hero-scroll-lbl{font-family:var(--f-ui);font-size:8px;letter-spacing:0.55em;text-transform:uppercase;color:var(--muted);}
.ab-hero-scroll-track{width:1px;height:50px;background:var(--faint);overflow:hidden;position:relative;}
.ab-hero-scroll-fill{position:absolute;top:-100%;width:100%;height:100%;background:linear-gradient(var(--gold3),transparent);animation:scrollDown 2.2s ease-in-out infinite;}
@keyframes scrollDown{0%{top:-100%;}100%{top:200%;}}

@keyframes abFadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}

/* ── FLOATING ORBS in hero bg ──────────────────────────────── */
.ab-hero-orb{
  position:absolute;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(200,168,75,0.08) 0%,transparent 70%);
  animation:orbFloat var(--dur,12s) ease-in-out infinite;
}
@keyframes orbFloat{
  0%,100%{transform:translate(0,0) scale(1);}
  33%{transform:translate(var(--tx,20px),var(--ty,-15px)) scale(1.05);}
  66%{transform:translate(var(--tx2,-10px),var(--ty2,10px)) scale(0.95);}
}

/* ── GOLD SHIMMER DIVIDER ──────────────────────────────────── */
.ab-divider{height:1px;background:linear-gradient(90deg,transparent,var(--gold) 20%,var(--gold3) 50%,var(--gold) 80%,transparent);position:relative;}
.ab-divider::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,var(--gold4) 50%,transparent);
  animation:divSweep 4s ease-in-out infinite;
}
@keyframes divSweep{0%{clip-path:inset(0 100% 0 0);}50%{clip-path:inset(0 0% 0 0);}100%{clip-path:inset(0 0% 0 100%);}}

/* ── SECTION COMMON ───────────────────────────────────────── */
.ab-s-lbl{
  display:inline-flex;align-items:center;gap:14px;
  font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);
  margin-bottom:14px;
}
.ab-s-lbl-line{flex:0 0 36px;height:1px;background:var(--border2);}
.ab-s-h2{
  font-family:var(--f-display);font-size:clamp(52px,7vw,110px);font-weight:400;
  line-height:0.88;color:var(--white);letter-spacing:0.04em;margin-bottom:22px;
}
.ab-s-h2 em{
  font-style:italic;font-family:var(--f-serif);font-weight:400;
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-size:0.83em;
}
.ab-orn{position:relative;width:60px;height:1.5px;background:linear-gradient(90deg,var(--gold),transparent);margin:22px 0;}
.ab-orn::after{content:'✦';position:absolute;top:50%;left:70px;transform:translateY(-50%);font-size:9px;color:var(--gold);opacity:0.5;animation:ornSpin 8s linear infinite;}
@keyframes ornSpin{from{transform:translateY(-50%) rotate(0deg);}to{transform:translateY(-50%) rotate(360deg);}}
.ab-p{font-family:var(--f-body);font-size:17px;font-weight:400;line-height:2;color:var(--muted);margin-bottom:18px;}
.ab-p em{color:var(--gold3);font-style:italic;}

/* ── REVEAL ───────────────────────────────────────────────── */
.rev{opacity:0;transform:translateY(60px);transition:opacity 1.1s var(--ease4),transform 1.1s var(--ease4);}
.rev.vis{opacity:1;transform:translateY(0);}
.rev-l{opacity:0;transform:translateX(-60px);transition:opacity 1.1s var(--ease4),transform 1.1s var(--ease4);}
.rev-l.vis{opacity:1;transform:translateX(0);}
.rev-r{opacity:0;transform:translateX(60px);transition:opacity 1.1s var(--ease4),transform 1.1s var(--ease4);}
.rev-r.vis{opacity:1;transform:translateX(0);}

/* ══════════════════════════════════════════════════════════
   STORY — Immersive Layout (Enhanced)
   ══════════════════════════════════════════════════════════ */
.ab-story{padding:160px 0;background:var(--dark);position:relative;overflow:hidden;}
.ab-story::before{
  content:'1997';position:absolute;bottom:-80px;right:-40px;
  font-family:var(--f-display);font-size:clamp(200px,28vw,380px);
  color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.035);
  pointer-events:none;line-height:1;user-select:none;
}
.ab-story::after{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse 60% 80% at 10% 20%,rgba(200,168,75,0.055) 0%,transparent 70%),
    radial-gradient(ellipse 50% 60% at 90% 80%,rgba(155,27,48,0.04) 0%,transparent 70%);
  pointer-events:none;
}
.ab-story-in{max-width:1440px;margin:0 auto;padding:0 100px;display:grid;grid-template-columns:5fr 6fr;gap:130px;align-items:center;position:relative;z-index:1;}

/* Image frame system — ENHANCED */
.ab-story-img-wrap{position:relative;}
.ab-story-img-border{
  position:absolute;top:-24px;left:-24px;right:24px;bottom:24px;
  border:1px solid var(--border);pointer-events:none;z-index:0;
}
.ab-story-img-border::before,.ab-story-img-border::after{
  content:'';position:absolute;width:24px;height:24px;border-color:var(--gold3);border-style:solid;
  transition:width 0.7s var(--ease3),height 0.7s var(--ease3);
}
.ab-story-img-border::before{top:-1px;left:-1px;border-width:2.5px 0 0 2.5px;}
.ab-story-img-border::after{bottom:-1px;right:-1px;border-width:0 2.5px 2.5px 0;}
.ab-story-img-wrap:hover .ab-story-img-border::before,.ab-story-img-wrap:hover .ab-story-img-border::after{width:50px;height:50px;}

.ab-story-img{
  width:100%;height:620px;object-fit:cover;display:block;position:relative;z-index:1;
  filter:brightness(0.82) contrast(1.1) saturate(1.1);
  transition:transform 0.9s var(--ease),filter 0.7s;
}
.ab-story-img-wrap:hover .ab-story-img{transform:scale(1.05);filter:brightness(1) contrast(1.12);}

/* Cinematic scanlines on image hover */
.ab-story-scanlines{
  position:absolute;inset:0;z-index:3;pointer-events:none;opacity:0;
  background:repeating-linear-gradient(0deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 3px);
  transition:opacity 0.5s;
}
.ab-story-img-wrap:hover .ab-story-scanlines{opacity:1;}

.ab-story-shine{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden;}
.ab-story-shine::after{
  content:'';position:absolute;top:-50%;left:-150%;width:60%;height:200%;
  background:linear-gradient(to right,transparent,rgba(200,168,75,0.1),transparent);
  transform:skewX(-20deg);transition:left 1.2s var(--ease);
}
.ab-story-img-wrap:hover .ab-story-shine::after{left:160%;}

.ab-story-badge{
  position:absolute;bottom:-20px;right:-20px;z-index:4;
  background:linear-gradient(135deg,var(--gold),var(--gold3),var(--gold2));
  color:var(--black);font-family:var(--f-ui);font-size:8px;font-weight:800;
  letter-spacing:0.5em;text-transform:uppercase;padding:14px 22px;
  box-shadow:0 8px 40px rgba(200,168,75,0.6),0 0 0 1px rgba(200,168,75,0.3);
  animation:badgePulse 3s ease-in-out infinite;
}
@keyframes badgePulse{0%,100%{box-shadow:0 8px 40px rgba(200,168,75,0.6),0 0 0 1px rgba(200,168,75,0.3);}50%{box-shadow:0 8px 60px rgba(200,168,75,0.9),0 0 0 3px rgba(200,168,75,0.2);}}

.ab-story-year{
  font-family:var(--f-display);font-size:clamp(80px,10vw,130px);font-weight:400;line-height:1;
  color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.18);
  margin-bottom:-10px;display:block;letter-spacing:0.05em;
}

/* ── BUTTONS ─────────────────────────────────────────────── */
.btn-g{
  display:inline-flex;align-items:center;gap:14px;
  font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);
  text-decoration:none;padding:17px 42px;position:relative;overflow:hidden;
  transition:transform 0.35s var(--ease3),box-shadow 0.35s;
  box-shadow:0 6px 36px rgba(200,168,75,0.4);
}
.btn-g::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold4),var(--gold3));opacity:0;transition:opacity 0.3s;}
.btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.btn-g:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 20px 70px rgba(200,168,75,0.65);}
.btn-g:hover::before{opacity:1;}
.btn-g:hover::after{left:150%;}
.btn-g span,.btn-gh span{position:relative;z-index:1;}
.btn-arr{position:relative;z-index:1;transition:transform 0.35s var(--ease3);}
.btn-g:hover .btn-arr{transform:translateX(6px);}
.btn-gh{
  display:inline-flex;align-items:center;gap:14px;
  font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;
  background:transparent;color:var(--gold3);text-decoration:none;
  padding:16px 42px;border:1.5px solid var(--border2);
  position:relative;overflow:hidden;transition:all 0.35s var(--ease);
}
.btn-gh::before{content:'';position:absolute;inset:0;background:rgba(200,168,75,0.08);opacity:0;transition:opacity 0.3s;}
.btn-gh:hover{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 40px rgba(200,168,75,0.22),inset 0 0 20px rgba(200,168,75,0.05);transform:translateY(-2px);}
.btn-gh:hover::before{opacity:1;}
.btn-gh:hover .btn-arr{transform:translateX(6px);}

/* ══════════════════════════════════════════════════════════
   VERSE STRIP — Enhanced
   ══════════════════════════════════════════════════════════ */
.ab-verse{
  padding:120px 80px;text-align:center;background:var(--panel);
  position:relative;overflow:hidden;
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
}
.ab-verse::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 70% 200% at 50% 50%,rgba(200,168,75,0.07) 0%,transparent 100%);
}
/* Double starburst */
.ab-verse-star{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1000px;height:1000px;pointer-events:none;background:conic-gradient(from 0deg,transparent 0deg,rgba(200,168,75,0.025) 1.5deg,transparent 3deg,transparent 29.5deg,rgba(200,168,75,0.02) 30.5deg,transparent 31.5deg,transparent 59.5deg,rgba(200,168,75,0.025) 60.5deg,transparent 61.5deg,transparent 89.5deg,rgba(200,168,75,0.02) 90.5deg,transparent 91.5deg,transparent 119.5deg,rgba(200,168,75,0.025) 120.5deg,transparent 121.5deg,transparent 149.5deg,rgba(200,168,75,0.02) 150.5deg,transparent 151.5deg,transparent 179.5deg,rgba(200,168,75,0.025) 180.5deg,transparent 181.5deg,transparent 209.5deg,rgba(200,168,75,0.02) 210.5deg,transparent 211.5deg,transparent 239.5deg,rgba(200,168,75,0.025) 240.5deg,transparent 241.5deg,transparent 269.5deg,rgba(200,168,75,0.02) 270.5deg,transparent 271.5deg,transparent 299.5deg,rgba(200,168,75,0.025) 300.5deg,transparent 301.5deg,transparent 329.5deg,rgba(200,168,75,0.02) 330.5deg,transparent 331.5deg,transparent 360deg);animation:starSpin 40s linear infinite;}
.ab-verse-star2{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:700px;pointer-events:none;background:conic-gradient(from 22deg,transparent 0deg,rgba(200,168,75,0.015) 1deg,transparent 2deg,transparent 43.5deg,rgba(200,168,75,0.015) 44.5deg,transparent 45.5deg,transparent 88.5deg,rgba(200,168,75,0.015) 89.5deg,transparent 90.5deg,transparent 133.5deg,rgba(200,168,75,0.015) 134.5deg,transparent 135.5deg,transparent 178.5deg,rgba(200,168,75,0.015) 179.5deg,transparent 180.5deg,transparent 223.5deg,rgba(200,168,75,0.015) 224.5deg,transparent 225.5deg,transparent 268.5deg,rgba(200,168,75,0.015) 269.5deg,transparent 270.5deg,transparent 313.5deg,rgba(200,168,75,0.015) 314.5deg,transparent 315.5deg,transparent 360deg);animation:starSpin 25s linear infinite reverse;}
@keyframes starSpin{from{transform:translate(-50%,-50%) rotate(0deg);}to{transform:translate(-50%,-50%) rotate(360deg);}}
.ab-verse-inner{position:relative;z-index:1;max-width:900px;margin:0 auto;}
.ab-verse-q{
  font-family:var(--f-serif);font-size:clamp(22px,3.5vw,42px);font-style:italic;font-weight:400;
  color:var(--white);line-height:1.55;margin-bottom:28px;letter-spacing:0.02em;position:relative;
}
.ab-verse-q::before{content:'\\201C';font-family:var(--f-display);font-size:clamp(80px,12vw,180px);color:rgba(200,168,75,0.1);position:absolute;top:-60px;left:-10px;line-height:1;pointer-events:none;}
.ab-verse-ref{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);}

/* ══════════════════════════════════════════════════════════
   TIMELINE — Enhanced gold track
   ══════════════════════════════════════════════════════════ */
.ab-timeline{padding:160px 0;background:var(--black);position:relative;overflow:hidden;}
.ab-timeline::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
/* Animated grid bg */
.ab-timeline::after{
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(200,168,75,0.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(200,168,75,0.025) 1px,transparent 1px);
  background-size:80px 80px;
  mask-image:radial-gradient(ellipse 70% 70% at 50% 50%,black 0%,transparent 100%);
}
.ab-tl-in{max-width:1440px;margin:0 auto;padding:0 100px;}
.ab-tl-hdr{text-align:center;margin-bottom:110px;}

.ab-tl-track{position:relative;padding-left:80px;}
.ab-tl-track::before{content:'';position:absolute;left:24px;top:0;bottom:0;width:1px;background:linear-gradient(to bottom,transparent,var(--border2) 5%,var(--border2) 95%,transparent);}
.ab-tl-track::after{content:'';position:absolute;left:24px;top:0;width:1px;background:linear-gradient(to bottom,var(--gold3),var(--gold),transparent);animation:tl-fill 3s ease-in-out infinite alternate;}
@keyframes tl-fill{0%{height:0%;opacity:0;}30%{opacity:1;}100%{height:100%;opacity:0.7;}}

.ab-tl-item{display:grid;grid-template-columns:200px 1fr;gap:72px;align-items:start;padding-bottom:100px;position:relative;}
.ab-tl-item:last-child{padding-bottom:0;}

/* Diamond dot — enhanced */
.ab-tl-dot{
  position:absolute;left:-63px;top:16px;
  width:22px;height:22px;
  background:var(--black);border:2px solid var(--gold);
  transform:rotate(45deg);
  box-shadow:0 0 20px rgba(200,168,75,0.5),0 0 50px rgba(200,168,75,0.2);
  transition:all 0.5s var(--ease);
}
.ab-tl-item:hover .ab-tl-dot{
  background:var(--gold);
  box-shadow:0 0 0 6px rgba(200,168,75,0.12),0 0 40px rgba(200,168,75,1),0 0 90px rgba(200,168,75,0.6);
}
.ab-tl-dot-ring{position:absolute;top:50%;left:50%;width:44px;height:44px;transform:translate(-50%,-50%) rotate(-45deg);border:1px solid rgba(200,168,75,0.2);animation:dotRingPulse 3.5s ease-in-out infinite;}
.ab-tl-dot-ring2{position:absolute;top:50%;left:50%;width:66px;height:66px;transform:translate(-50%,-50%) rotate(-45deg);border:1px solid rgba(200,168,75,0.08);animation:dotRingPulse 3.5s ease-in-out infinite 0.5s;}
@keyframes dotRingPulse{0%,100%{transform:translate(-50%,-50%) rotate(-45deg) scale(1);opacity:0.5;}50%{transform:translate(-50%,-50%) rotate(-45deg) scale(2.2);opacity:0;}}

.ab-tl-year{
  font-family:var(--f-display);font-size:clamp(60px,8vw,110px);letter-spacing:0.04em;line-height:1;
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  transition:filter 0.5s;
}
.ab-tl-item:hover .ab-tl-year{filter:drop-shadow(0 0 32px rgba(200,168,75,0.9));}
.ab-tl-tag{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:flex;align-items:center;gap:10px;}
.ab-tl-tag::before{content:'';width:24px;height:1px;background:var(--gold);}
.ab-tl-title{font-family:var(--f-display);font-size:clamp(24px,3vw,40px);font-weight:400;color:var(--white);letter-spacing:0.05em;margin-bottom:14px;line-height:1.05;transition:color 0.4s;}
.ab-tl-item:hover .ab-tl-title{color:var(--gold3);}
.ab-tl-text{font-family:var(--f-body);font-size:16px;line-height:2;color:var(--muted);}
.ab-tl-chip{
  display:inline-flex;align-items:center;gap:8px;
  margin-top:18px;padding:10px 20px;
  background:rgba(200,168,75,0.06);border:1px solid var(--border);
  font-family:var(--f-ui);font-size:8px;letter-spacing:0.45em;text-transform:uppercase;color:var(--gold);
  transition:all 0.3s;
}
.ab-tl-chip::before{content:'';width:4px;height:4px;border-radius:50%;background:var(--gold);animation:dotPulse 2s ease-in-out infinite;}
.ab-tl-item:hover .ab-tl-chip{background:rgba(200,168,75,0.1);border-color:var(--border2);}

/* ══════════════════════════════════════════════════════════
   VALUES — Enhanced accordion
   ══════════════════════════════════════════════════════════ */
.ab-values{padding:160px 0;background:var(--panel);position:relative;overflow:hidden;}
.ab-values::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 85% 50%,rgba(200,168,75,0.07) 0%,transparent 70%);pointer-events:none;}
.ab-values-in{max-width:1440px;margin:0 auto;padding:0 100px;display:grid;grid-template-columns:4fr 5fr;gap:110px;align-items:start;}

.ab-vals-list{display:flex;flex-direction:column;gap:0;}
.ab-val{border-bottom:1px solid var(--border);overflow:hidden;transition:background 0.4s;}
.ab-val:first-child{border-top:1px solid var(--border);}
.ab-val-head{display:flex;align-items:center;gap:18px;padding:24px 0;cursor:pointer;user-select:none;}
.ab-val-num{font-family:var(--f-display);font-size:16px;letter-spacing:0.08em;color:var(--gold);min-width:36px;transition:filter 0.3s;font-weight:400;}
.ab-val.open .ab-val-num{filter:drop-shadow(0 0 14px rgba(200,168,75,1));}
.ab-val-name{font-family:var(--f-ui);font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--white);flex:1;line-height:1.4;transition:color 0.3s;}
.ab-val.open .ab-val-name{color:var(--gold3);}
.ab-val-icon{width:30px;height:30px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:13px;transition:all 0.5s var(--ease3);flex-shrink:0;}
.ab-val.open .ab-val-icon{background:rgba(200,168,75,0.14);border-color:var(--gold);transform:rotate(45deg);box-shadow:0 0 22px rgba(200,168,75,0.4);}
.ab-val-body{max-height:0;overflow:hidden;transition:max-height 0.6s var(--ease);}
.ab-val.open .ab-val-body{max-height:260px;}
.ab-val-body-inner{padding:0 0 24px 54px;font-family:var(--f-body);font-size:16px;line-height:2;color:var(--muted);}

/* Orb visual — Enhanced sacred geometry */
.ab-vals-visual{display:flex;align-items:center;justify-content:center;min-height:500px;position:relative;}
.ab-orb{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid var(--border);transform:translate(-50%,-50%);animation:orbPulse 7s ease-in-out infinite;}
.ab-orb:nth-child(1){width:100px;height:100px;border:2px solid rgba(200,168,75,0.6);box-shadow:0 0 50px rgba(200,168,75,0.2),inset 0 0 25px rgba(200,168,75,0.1);animation-delay:0s;}
.ab-orb:nth-child(2){width:210px;height:210px;animation-delay:1.2s;border-color:rgba(200,168,75,0.22);}
.ab-orb:nth-child(3){width:340px;height:340px;border-color:rgba(200,168,75,0.1);animation-delay:2.4s;}
.ab-orb:nth-child(4){width:480px;height:480px;border-color:rgba(200,168,75,0.05);animation-delay:3.6s;}
@keyframes orbPulse{0%,100%{opacity:1;}50%{opacity:0.18;}}
.ab-orb-spin{position:absolute;top:50%;left:50%;width:150px;height:150px;transform:translate(-50%,-50%);border-radius:50%;border:1px dashed rgba(200,168,75,0.28);animation:spinCW 20s linear infinite;}
.ab-orb-spin2{position:absolute;top:50%;left:50%;width:280px;height:280px;transform:translate(-50%,-50%);border-radius:50%;border:1px dashed rgba(200,168,75,0.1);animation:spinCW 35s linear infinite reverse;}
@keyframes spinCW{from{transform:translate(-50%,-50%) rotate(0deg);}to{transform:translate(-50%,-50%) rotate(360deg);}}
.ab-orb-cross-v{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1px;height:340px;background:linear-gradient(transparent,rgba(200,168,75,0.2),transparent);}
.ab-orb-cross-h{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:340px;height:1px;background:linear-gradient(transparent,rgba(200,168,75,0.2),transparent);}
.ab-orb-cross-d1{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg);width:1px;height:340px;background:linear-gradient(transparent,rgba(200,168,75,0.07),transparent);}
.ab-orb-cross-d2{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-45deg);width:1px;height:340px;background:linear-gradient(transparent,rgba(200,168,75,0.07),transparent);}
.ab-orb-center{position:relative;z-index:2;text-align:center;}
.ab-orb-icon{font-family:var(--f-display);font-size:26px;color:var(--gold);text-shadow:0 0 30px rgba(200,168,75,0.8),0 0 80px rgba(200,168,75,0.4);animation:iconGlow 5s ease-in-out infinite;letter-spacing:0.1em;}
@keyframes iconGlow{0%,100%{text-shadow:0 0 30px rgba(200,168,75,0.7),0 0 80px rgba(200,168,75,0.3);}50%{text-shadow:0 0 60px rgba(200,168,75,1),0 0 130px rgba(200,168,75,0.6);}}
.ab-orb-label{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.55em;color:var(--gold);margin-top:10px;text-transform:uppercase;}
.ab-val-float{position:absolute;font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--gold);padding:9px 16px;background:var(--panel);border:1px solid var(--border);backdrop-filter:blur(8px);}
.ab-val-float:nth-child(6){top:0;left:50%;transform:translateX(-50%);animation:floatUD 5s ease-in-out infinite;}
.ab-val-float:nth-child(7){bottom:0;left:50%;transform:translateX(-50%);animation:floatUD 6s ease-in-out infinite 0.7s;}
.ab-val-float:nth-child(8){left:-10px;top:50%;transform:translateY(-50%);animation:floatLR 7s ease-in-out infinite 1s;}
.ab-val-float:nth-child(9){right:-10px;top:50%;transform:translateY(-50%);animation:floatLR 5.5s ease-in-out infinite 1.5s;}
@keyframes floatUD{0%,100%{transform:translateX(-50%) translateY(0);}50%{transform:translateX(-50%) translateY(-14px);}}
@keyframes floatLR{0%,100%{transform:translateY(-50%) translateX(0);}50%{transform:translateY(-50%) translateX(-10px);}}

/* ══════════════════════════════════════════════════════════
   VIDEO SECTION — Enhanced
   ══════════════════════════════════════════════════════════ */
.ab-video{padding:160px 0;background:var(--dark);position:relative;overflow:hidden;}
.ab-video::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(200,168,75,0.05) 0%,transparent 70%);}
.ab-video-in{max-width:1440px;margin:0 auto;padding:0 100px;}
.ab-video-hdr{text-align:center;margin-bottom:72px;}
.ab-video-frame{
  position:relative;cursor:pointer;overflow:hidden;
  border:1px solid var(--border);max-width:1160px;margin:0 auto;
  transition:border-color 0.5s,box-shadow 0.5s;
}
.ab-video-frame:hover{border-color:var(--gold);box-shadow:0 0 80px rgba(200,168,75,0.18),0 40px 100px rgba(0,0,0,0.8);}
.ab-video-frame::before,.ab-video-frame::after{content:'';position:absolute;width:28px;height:28px;border-color:var(--gold);border-style:solid;z-index:2;transition:width 0.5s var(--ease),height 0.5s var(--ease);}
.ab-video-frame::before{top:-1px;left:-1px;border-width:2.5px 0 0 2.5px;}
.ab-video-frame::after{bottom:-1px;right:-1px;border-width:0 2.5px 2.5px 0;}
.ab-video-frame:hover::before,.ab-video-frame:hover::after{width:56px;height:56px;}
.ab-vid-img{width:100%;aspect-ratio:21/9;object-fit:cover;display:block;filter:brightness(0.38) saturate(0.7);transition:filter 0.8s,transform 0.9s;}
.ab-video-frame:hover .ab-vid-img{filter:brightness(0.22) saturate(0.6);transform:scale(1.04);}
.ab-vid-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(to top,rgba(3,3,10,0.8) 0%,transparent 60%);}
/* Play button — cinematic */
.ab-play-ring{
  width:120px;height:120px;border-radius:50%;
  border:1.5px solid rgba(253,250,244,0.25);
  display:flex;align-items:center;justify-content:center;
  backdrop-filter:blur(12px);background:rgba(253,250,244,0.04);
  transition:all 0.5s var(--ease3);
  box-shadow:0 0 80px rgba(200,168,75,0.25);
  animation:playRingPulse 3s ease-in-out infinite;
}
@keyframes playRingPulse{0%,100%{box-shadow:0 0 60px rgba(200,168,75,0.2);}50%{box-shadow:0 0 100px rgba(200,168,75,0.4),0 0 0 15px rgba(200,168,75,0.05);}}
.ab-video-frame:hover .ab-play-ring{transform:scale(1.15);border-color:var(--gold);background:rgba(200,168,75,0.18);box-shadow:0 0 120px rgba(200,168,75,0.6),0 0 0 20px rgba(200,168,75,0.08);}
.ab-play-btn{width:72px;height:72px;border-radius:50%;background:var(--white);display:flex;align-items:center;justify-content:center;font-size:22px;color:var(--black);padding-left:5px;transition:background 0.3s,transform 0.3s;}
.ab-video-frame:hover .ab-play-btn{background:var(--gold);transform:scale(1.08);}
.ab-vid-meta{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);text-align:center;}
.ab-vid-tag{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold3);}
.ab-vid-title{font-family:var(--f-display);font-size:clamp(28px,4vw,52px);color:var(--white);letter-spacing:0.06em;margin-top:8px;}

/* ══════════════════════════════════════════════════════════
   JOIN US — Enhanced fellowship section
   ══════════════════════════════════════════════════════════ */
.ab-join{padding:160px 0;background:var(--black);position:relative;overflow:hidden;}
.ab-join::before{content:'';position:absolute;right:0;top:0;width:55%;height:100%;background:linear-gradient(to left,rgba(200,168,75,0.03),transparent);clip-path:polygon(40% 0,100% 0,100% 100%,0 100%);}
.ab-join-in{max-width:1440px;margin:0 auto;padding:0 100px;display:grid;grid-template-columns:6fr 5fr;gap:130px;align-items:center;position:relative;z-index:1;}

.ab-join-img-wrap{position:relative;overflow:hidden;}
.ab-join-img-border{position:absolute;top:-22px;right:-22px;bottom:22px;left:22px;border:1px solid var(--border);pointer-events:none;z-index:0;}
.ab-join-img-border::before,.ab-join-img-border::after{content:'';position:absolute;width:28px;height:28px;border-color:var(--gold3);border-style:solid;transition:width 0.6s var(--ease),height 0.6s var(--ease);}
.ab-join-img-border::before{bottom:-1px;left:-1px;border-width:0 0 2.5px 2.5px;}
.ab-join-img-border::after{top:-1px;right:-1px;border-width:2.5px 2.5px 0 0;}
.ab-join-img-wrap:hover .ab-join-img-border::before,.ab-join-img-wrap:hover .ab-join-img-border::after{width:52px;height:52px;}
.ab-join-img{width:100%;height:540px;object-fit:cover;position:relative;z-index:1;display:block;filter:brightness(0.78);transition:transform 0.9s var(--ease),filter 0.7s;}
.ab-join-img-wrap:hover .ab-join-img{transform:scale(1.05);filter:brightness(1);}

/* Fellowship cards — ENHANCED with 3D tilt effect */
.ab-fellow-grid{display:flex;flex-direction:column;gap:3px;margin:36px 0;}
.ab-fellow{
  background:var(--panel);border:1px solid var(--border);
  padding:26px 30px;position:relative;overflow:hidden;
  transition:all 0.5s var(--ease);
  transform-style:preserve-3d;perspective:600px;
}
.ab-fellow::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  background:linear-gradient(var(--gold),var(--gold3),transparent);
  transform:scaleY(0);transform-origin:top;transition:transform 0.5s var(--ease);
}
.ab-fellow::after{
  content:attr(data-n);position:absolute;bottom:-10px;right:16px;
  font-family:var(--f-display);font-size:64px;color:rgba(200,168,75,0.04);
  pointer-events:none;line-height:1;
}
/* Light reflect shimmer inside card */
.ab-fellow-shine{
  position:absolute;inset:0;opacity:0;pointer-events:none;
  background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(200,168,75,0.08) 0%,transparent 60%);
  transition:opacity 0.3s;
}
.ab-fellow:hover .ab-fellow-shine{opacity:1;}
.ab-fellow:hover{background:var(--card);transform:translateX(10px);box-shadow:0 12px 60px rgba(0,0,0,0.6),inset 0 1px 0 rgba(200,168,75,0.08);}
.ab-fellow:hover::before{transform:scaleY(1);}
.ab-fellow-icon{font-size:18px;margin-bottom:8px;}
.ab-fellow-title{font-family:var(--f-display);font-size:22px;font-weight:400;letter-spacing:0.05em;color:var(--white);margin-bottom:6px;transition:color 0.3s;}
.ab-fellow:hover .ab-fellow-title{color:var(--gold3);}
.ab-fellow-text{font-family:var(--f-body);font-size:14px;line-height:1.9;color:var(--muted);}

/* ══════════════════════════════════════════════════════════
   BOOKS — 3D Tilt Card System
   ══════════════════════════════════════════════════════════ */
.ab-books{padding:160px 0;background:var(--dark);position:relative;overflow:hidden;}
.ab-books::before{content:'BOOKS';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--f-display);font-size:clamp(160px,22vw,300px);color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.022);pointer-events:none;white-space:nowrap;user-select:none;}
.ab-books-in{max-width:1440px;margin:0 auto;padding:0 100px;position:relative;z-index:1;}
.ab-books-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:80px;}
.ab-books-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;}

/* 3D Tilt Book Card */
.ab-book{
  position:relative;cursor:pointer;display:block;text-decoration:none;
  transition:transform 0.6s var(--ease3);
  transform-style:preserve-3d;
  perspective:800px;
}
/* JS handles the 3D tilt via inline style, CSS just transitions */
.ab-book:hover{transform:translateY(-22px);}
.ab-book-cover{
  position:relative;overflow:hidden;aspect-ratio:2/3;
  border:1px solid var(--border);
  box-shadow:0 4px 20px rgba(0,0,0,0.5);
  transition:box-shadow 0.5s;
}
.ab-book:hover .ab-book-cover{box-shadow:0 28px 80px rgba(0,0,0,0.8),0 0 60px rgba(200,168,75,0.1);}
.ab-book-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.85);transition:transform 0.9s var(--ease),filter 0.6s;}
.ab-book:hover .ab-book-img{transform:scale(1.1);filter:brightness(1);}
.ab-book-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,10,0.95) 0%,transparent 55%);transition:background 0.5s;}
.ab-book:hover .ab-book-overlay{background:linear-gradient(to top,rgba(3,3,10,1) 0%,rgba(3,3,10,0.28) 100%);}
/* Animated gold top line */
.ab-book-gline{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),transparent);transform:scaleX(0);transform-origin:left;transition:transform 0.6s var(--ease);}
.ab-book:hover .ab-book-gline{transform:scaleX(1);}
/* Bottom line too */
.ab-book-gline-b{position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,0.4),transparent);transform:scaleX(0);transform-origin:right;transition:transform 0.6s var(--ease) 0.1s;}
.ab-book:hover .ab-book-gline-b{transform:scaleX(1);}

.ab-book-actions{position:absolute;bottom:20px;left:16px;right:16px;display:flex;gap:8px;opacity:0;transform:translateY(16px);transition:all 0.4s 0.1s;}
.ab-book:hover .ab-book-actions{opacity:1;transform:translateY(0);}
.ab-book-btn{flex:1;padding:12px 0;font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;transition:all 0.3s;}
.ab-book-btn.buy{background:var(--gold);color:var(--black);}
.ab-book-btn.buy:hover{background:var(--gold4);transform:scale(1.03);}
.ab-book-btn.view{background:transparent;color:var(--gold3);border:1px solid var(--border2);}
.ab-book-btn.view:hover{background:rgba(200,168,75,0.1);}
.ab-book-info{padding:18px 4px 0;}
.ab-book-title{font-family:var(--f-serif);font-size:15px;font-weight:700;color:var(--white);margin-bottom:6px;line-height:1.35;transition:color 0.3s;}
.ab-book:hover .ab-book-title{color:var(--gold3);}
.ab-book-author{font-family:var(--f-ui);font-size:8px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:var(--muted);}
.ab-book-line{width:0;height:1.5px;background:linear-gradient(90deg,var(--gold),transparent);margin-top:12px;transition:width 0.6s var(--ease);}
.ab-book:hover .ab-book-line{width:100%;}

/* ══════════════════════════════════════════════════════════
   SERVICES / WORSHIP — Enhanced
   ══════════════════════════════════════════════════════════ */
.ab-worship{padding:160px 0;background:var(--panel);position:relative;overflow:hidden;}
.ab-worship::before{content:'';position:absolute;left:0;top:0;width:50%;height:100%;background:linear-gradient(to right,rgba(200,168,75,0.03),transparent);clip-path:polygon(0 0,80% 0,40% 100%,0 100%);}
.ab-worship-in{max-width:1440px;margin:0 auto;padding:0 100px;display:grid;grid-template-columns:1fr 1fr;gap:110px;align-items:center;position:relative;z-index:1;}

.ab-svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;}
.ab-svc-card{
  background:var(--dark);border:1px solid var(--border);padding:60px 44px;
  position:relative;overflow:hidden;transition:background 0.5s,box-shadow 0.5s;
}
.ab-svc-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(var(--gold),var(--gold3),transparent);}
/* Animated glow corner */
.ab-svc-card::after{
  content:'';position:absolute;bottom:0;right:0;width:80px;height:80px;
  background:radial-gradient(circle at 100% 100%,rgba(200,168,75,0.1) 0%,transparent 70%);
  opacity:0;transition:opacity 0.5s;
}
.ab-svc-card:hover{background:var(--black);box-shadow:inset 0 0 100px rgba(200,168,75,0.05),0 0 60px rgba(200,168,75,0.08);}
.ab-svc-card:hover::after{opacity:1;}
.ab-svc-day{
  font-family:var(--f-display);font-size:clamp(40px,5vw,72px);
  background:linear-gradient(135deg,var(--gold3),var(--gold));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:20px;line-height:1;letter-spacing:0.07em;
  filter:drop-shadow(0 0 20px rgba(200,168,75,0.3));
  transition:filter 0.4s;
}
.ab-svc-card:hover .ab-svc-day{filter:drop-shadow(0 0 35px rgba(200,168,75,0.8));}
.ab-svc-times{font-family:var(--f-body);font-size:17px;color:var(--muted);line-height:2.5;}
.ab-svc-tz{font-family:var(--f-ui);font-size:8px;font-weight:600;letter-spacing:0.45em;color:var(--faint);margin-top:12px;}

.ab-contact-extras{display:flex;flex-direction:column;gap:14px;margin-top:44px;}
.ab-contact-extra{display:flex;align-items:center;gap:18px;padding:18px 22px;background:rgba(200,168,75,0.03);border:1px solid var(--border);transition:all 0.4s var(--ease);}
.ab-contact-extra:hover{background:rgba(200,168,75,0.08);border-color:var(--border2);transform:translateX(6px);}
.ab-contact-icon{width:36px;height:36px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:14px;flex-shrink:0;transition:all 0.3s;}
.ab-contact-extra:hover .ab-contact-icon{border-color:var(--gold);background:rgba(200,168,75,0.1);}
.ab-contact-text{font-family:var(--f-body);font-size:15px;color:var(--muted);line-height:1.8;}
.ab-contact-text strong{color:var(--gold3);font-weight:700;}

.ab-confession{margin-top:40px;padding:36px 40px;background:rgba(200,168,75,0.03);border:1px solid var(--border);position:relative;overflow:hidden;}
.ab-confession::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
.ab-confession-lbl{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
.ab-confession-q{font-family:var(--f-body);font-size:17px;font-style:italic;color:var(--muted);line-height:1.9;}
.ab-confession-ref{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:rgba(200,168,75,0.35);margin-top:14px;}

/* ── VIDEO MODAL — Enhanced ──────────────────────────────── */
.ab-modal{
  position:fixed;inset:0;z-index:99990;
  background:rgba(3,3,10,0.97);
  display:flex;align-items:center;justify-content:center;padding:20px;
  animation:modalFade 0.5s var(--ease);backdrop-filter:blur(20px);
}
@keyframes modalFade{from{opacity:0;backdrop-filter:blur(0px);}to{opacity:1;backdrop-filter:blur(20px);}}
.ab-modal-close{
  position:fixed;top:24px;right:32px;z-index:99991;
  width:52px;height:52px;border:1px solid var(--border);
  background:transparent;color:var(--gold3);cursor:pointer;font-size:20px;
  display:flex;align-items:center;justify-content:center;
  transition:all 0.4s;font-family:serif;
}
.ab-modal-close:hover{border-color:var(--gold);background:rgba(200,168,75,0.12);transform:rotate(90deg);}
.ab-modal iframe{width:min(1060px,93vw);height:calc(min(1060px,93vw)*9/16);border:none;border:1px solid var(--border);}

/* ── RESPONSIVE ───────────────────────────────────────────── */
@media(max-width:1200px){
  .ab-hero{grid-template-columns:1fr;}
  .ab-hero-right{height:50vh;}
  .ab-story-in,.ab-join-in,.ab-worship-in,.ab-values-in{grid-template-columns:1fr;gap:80px;}
  .ab-books-grid{grid-template-columns:repeat(2,1fr);}
  .ab-tl-item{grid-template-columns:140px 1fr;gap:40px;}
  .ab-hero-left{padding:120px 60px 80px;}
}
@media(max-width:900px){
  .ab-hero-left{padding:120px 28px 60px;}
  .ab-story-in,.ab-tl-in,.ab-values-in,.ab-books-in,.ab-join-in,.ab-worship-in,.ab-video-in{padding:0 28px;}
  .ab-story,.ab-timeline,.ab-values,.ab-books,.ab-join,.ab-worship,.ab-video{padding:100px 0;}
  .ab-verse{padding:80px 28px;}
  .ab-books-grid{grid-template-columns:1fr 1fr;}
  .ab-svc-grid{grid-template-columns:1fr;}
  .ab-tl-item{grid-template-columns:1fr;gap:10px;}
  .ab-tl-year{font-size:52px;}
  .ab-vals-visual{display:none;}
  .ab-back{top:14px;left:14px;padding:10px 14px;}
}
@media(max-width:520px){.ab-books-grid{grid-template-columns:1fr;}}
img{max-width:100%;height:auto;}
@media(prefers-reduced-motion:reduce){*{animation-duration:0.001ms !important;transition-duration:0.001ms !important;}}
`;

/* ═════════════════════════════════════════════════ CONSTANTS ══ */
const TIMELINE = [
  {
    year: "1997",
    tag: "The Beginning",
    title: "A DIVINE COMMISSION IS BORN",
    text: 'On April 13th, 1997, the mandate "To Establish the Kingdom of God here on Earth" manifested as Salvation Ministries. From just over 30 persons at the first gathering, a global movement was ignited.',
    chip: "April 13, 1997 · Port Harcourt, Nigeria",
  },
  {
    year: "2011",
    tag: "Groundbreaking Expansion",
    title: "A RECORD IN CHURCH HISTORY",
    text: "On February 13th, 2011, Salvation Ministries set a groundbreaking record by expanding from one focal point to 14 satellite churches — all running five services simultaneously. A feat evidently sponsored by God Himself.",
    chip: "February 13, 2011 · 14 Satellite Churches",
  },
  {
    year: "2024",
    tag: "Global Reach",
    title: "1,500+ CHURCHES WORLDWIDE",
    text: "From one gathering to over 1,500 churches both local and international — the Kingdom continues to expand. Services and programs are transmitted in 8 languages including English, French, Spanish, Arabic, German, Italian, Portuguese and indigenous Nigerian languages.",
    chip: "1,500+ Churches · 8 Languages",
  },
  {
    year: "2026",
    tag: "29 Years of Glory",
    title: "A TESTAMENT TO GOD'S GRACE",
    text: "Twenty-nine years of unbroken divine favour. The story of Salvation Ministries is a testament to the multifaceted grace and help of God, continuously bringing the Gospel to millions around the world.",
    chip: "29th Anniversary · Home of Success",
  },
];
const VALUES = [
  {
    num: "01",
    title: "The Lordship of Jesus Christ",
    body: "We acknowledge Jesus Christ as the head of our church and fully submit ourselves to His will. In every aspect of our ministry our goal is always to honor and glorify the Lord Jesus Christ.",
  },
  {
    num: "02",
    title: "Bible-Centered Preaching & Teaching",
    body: "We believe the Bible is God's inspired, authoritative and trustworthy rule of faith and practice for Christians. We submit ourselves to its teaching and commit ourselves to do what it says.",
  },
  {
    num: "03",
    title: "The Power of Prayer",
    body: "We believe in the power of prayer. The ministries and activities of our church will be characterized by a reliance on personal and corporate prayer in all areas of our lives and ministry.",
  },
  {
    num: "04",
    title: "Evangelism & World Missions",
    body: "We believe in the Great Commission commanded to us by Jesus Christ and are committed to reaching unsaved and unchurched people locally, nationally and worldwide using every available Christ-honoring means.",
  },
  {
    num: "05",
    title: "The Sacred Family",
    body: "We believe God ordained the family to glorify Him. We cultivate an atmosphere that promotes spiritual growth within the family, discipling members in Christ-like character and teaching each to fulfill their God-given role.",
  },
];
const BOOKS = [
  {
    title: "Making Exploits in Life",
    author: "David Ibiyeomie",
    img: "https://smhos.org/wp-content/uploads/2025/04/Screenshot-2025-01-25-at-17.48.38-668x1024.png",
    buyHref: "https://smhosstore.com/product/making-exploits-in-life/",
  },
  {
    title: "Knowing the Person of the Holy Spirit",
    author: "David Ibiyeomie",
    img: "https://smhos.org/wp-content/uploads/2025/04/Knowing-The-Person-Of-The-Holy-Spirit-Cover-2021-jpeg-3-scaled-2-684x1024.jpg",
    buyHref:
      "https://smhosstore.com/product/knowing-the-person-of-the-holy-spirit/",
  },
  {
    title: "The Art of Receiving",
    author: "David Ibiyeomie",
    img: "https://smhos.org/wp-content/uploads/2025/04/THE-ART-OF-RECEIVING-00000000-1-1382x2048-1-691x1024.png",
    buyHref: "https://smhosstore.com/product/the-art-of-receiving-3/",
  },
  {
    title: "Man's Transformation Cycle for Excellent Living",
    author: "David Ibiyeomie",
    img: "https://smhos.org/wp-content/uploads/2025/04/man-tranfrommation-newcover_page-0001-1-e1689610317293-671x1024.jpg",
    buyHref: "https://smhosstore.com/product/mans-transformation-cycle/",
  },
];
const FELLOWSHIPS = [
  {
    icon: "🏡",
    title: "HOME FELLOWSHIP",
    text: "Intimate gatherings in homes for families and individuals seeking deeper connection with God and other believers.",
  },
  {
    icon: "🎓",
    title: "CAMPUS FELLOWSHIP",
    text: "Dedicated gatherings for students on campuses, nurturing the faith of the next generation of believers.",
  },
  {
    icon: "💼",
    title: "CORPORATE FELLOWSHIP",
    text: "Structured for offices and business places, bringing the Kingdom of God into your professional sphere.",
  },
];

/* ═══════════════════════════════════════════════════ HOOKS ══ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.07, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".rev,.rev-l,.rev-r")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handle = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  return progress;
}

/* ═══════════════════════════════════════════════ COMPONENTS ══ */

/* Custom cursor with click effect */
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
      const isLink = e.target.closest("a,button,[role='button']");
      ring.current?.classList.toggle("h", !!isLink);
    };
    const down = () => ring.current?.classList.add("click");
    const up = () => ring.current?.classList.remove("click");
    const loop = () => {
      rx += (mx - rx) * 0.09;
      ry += (my - ry) * 0.09;
      if (dot.current) dot.current.style.cssText = `left:${mx}px;top:${my}px;`;
      if (ring.current)
        ring.current.style.cssText = `left:${rx}px;top:${ry}px;`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    loop();
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div className="ab-cur-dot" ref={dot} />
      <div className="ab-cur-ring" ref={ring} />
    </>
  );
}

/* Enhanced particle canvas with gold dust + shooting stars */
function HeroParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    // Regular gold dust particles
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 800 + Math.random() * 200,
      r: Math.random() * 1.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.16,
      vy: -(Math.random() * 0.35 + 0.06),
      alpha: Math.random() * 0.5 + 0.07,
      life: Math.random(),
    }));
    // Shooting star
    let shootX = -100,
      shootY = -100,
      shootVX = 0,
      shootVY = 0,
      shootAlpha = 0,
      shootTimer = 0;
    const spawnShoot = () => {
      shootX = Math.random() * c.width;
      shootY = 0;
      const angle = Math.PI / 4 + Math.random() * 0.4;
      const spd = 6 + Math.random() * 6;
      shootVX = Math.cos(angle) * spd;
      shootVY = Math.sin(angle) * spd;
      shootAlpha = 1;
    };
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.002;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * c.width;
          p.y = c.height + 10;
          p.life = 0;
        }
        const fade = Math.sin(p.life * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,168,75,${p.alpha * fade})`;
        ctx.fill();
      });
      // Shooting star logic
      shootTimer++;
      if (shootTimer > 220) {
        spawnShoot();
        shootTimer = 0;
      }
      if (shootAlpha > 0) {
        ctx.save();
        const grad = ctx.createLinearGradient(
          shootX - shootVX * 12,
          shootY - shootVY * 12,
          shootX,
          shootY,
        );
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, `rgba(245,217,138,${shootAlpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootX - shootVX * 16, shootY - shootVY * 16);
        ctx.lineTo(shootX, shootY);
        ctx.stroke();
        ctx.restore();
        shootX += shootVX;
        shootY += shootVY;
        shootAlpha -= 0.022;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="ab-hero-canvas"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

/* 3D Tilt Book Card component */
function BookCard({ book, delay }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translateY(-22px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translateY(0) rotateY(0deg) rotateX(0deg)`;
  }, []);
  return (
    <div
      className="ab-book rev"
      style={{ transitionDelay: `${delay}s` }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="ab-book-cover">
        <img src={book.img} alt={book.title} className="ab-book-img" />
        <div className="ab-book-overlay" />
        <div className="ab-book-gline" />
        <div className="ab-book-gline-b" />
        <div className="ab-book-actions">
          <a
            href={book.buyHref}
            className="ab-book-btn buy"
            target="_blank"
            rel="noreferrer"
          >
            🛒 Buy Now
          </a>
          <a
            href={book.buyHref}
            className="ab-book-btn view"
            target="_blank"
            rel="noreferrer"
          >
            👁 View
          </a>
        </div>
      </div>
      <div className="ab-book-info">
        <div className="ab-book-title">{book.title}</div>
        <div className="ab-book-author">{book.author}</div>
        <div className="ab-book-line" />
      </div>
    </div>
  );
}

/* Fellowship card with mousemove shine */
function FellowCard({ f, i }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const shine = el.querySelector(".ab-fellow-shine");
    if (!shine) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    shine.style.setProperty("--mx", `${x}%`);
    shine.style.setProperty("--my", `${y}%`);
  }, []);
  return (
    <div
      className="ab-fellow"
      key={i}
      data-n={`0${i + 1}`}
      ref={ref}
      onMouseMove={handleMouseMove}
    >
      <div className="ab-fellow-shine" />
      <div className="ab-fellow-icon">{f.icon}</div>
      <div className="ab-fellow-title">{f.title}</div>
      <p className="ab-fellow-text">{f.text}</p>
    </div>
  );
}

/* ════════════════════════════════════════ MAIN EXPORT ══ */
export default function AboutPage({ onBack }) {
  const [openVal, setOpenVal] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    document.body.style.overflow = videoOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [videoOpen]);

  return (
    <>
      <style>{CSS}</style>

      {/* SCROLL PROGRESS */}
      <div className="ab-progress" style={{ width: `${scrollProgress}%` }} />

      {/* OVERLAYS */}
      <div className="ab-grain" />
      <div className="ab-vignette" />
      {!isTouch && <Cursor />}

      {/* BACK */}
      <button className="ab-back" onClick={onBack}>
        <span className="ab-back-arrow">←</span>
        <Link to="/">
          <span>Back to Home</span>
        </Link>
      </button>

      {/* ══════════════════════════════════════════════ HERO ══ */}
      <section className="ab-hero">
        {/* Floating ambient orbs */}
        {[
          {
            w: 600,
            h: 600,
            t: "5%",
            l: "5%",
            dur: 16,
            tx: "30px",
            ty: "-20px",
            tx2: "-15px",
            ty2: "25px",
          },
          {
            w: 400,
            h: 400,
            t: "50%",
            l: "40%",
            dur: 20,
            tx: "-20px",
            ty: "15px",
            tx2: "10px",
            ty2: "-10px",
          },
        ].map((o, i) => (
          <div
            key={i}
            className="ab-hero-orb"
            style={{
              width: o.w,
              height: o.h,
              top: o.t,
              left: o.l,
              "--dur": o.dur + "s",
              "--tx": o.tx,
              "--ty": o.ty,
              "--tx2": o.tx2,
              "--ty2": o.ty2,
            }}
          />
        ))}

        {/* LEFT */}
        <div className="ab-hero-left">
          <div className="ab-hero-eyebrow">
            <div className="ab-hero-eyebrow-line" />
            <span className="ab-hero-eyebrow-dot" />
            Salvation Ministries · Home of Success
          </div>
          <h1 className="ab-hero-title">
            <span className="ab-hero-title-word" data-text="ABOUT">
              ABOUT
            </span>
            <span className="ab-hero-title-gold">THE CHURCH</span>
          </h1>
          <div className="ab-hero-rules">
            <div className="ab-hero-rule" />
            <div className="ab-hero-rule" />
            <div className="ab-hero-rule" />
          </div>
          <p className="ab-hero-subtitle">
            A Global Family of Believers Since 1997
          </p>
          <div className="ab-hero-stats">
            {[
              { n: "1997", l: "Founded" },
              { n: "1,500+", l: "Churches" },
              { n: "Millions", l: "Transformed" },
              { n: "Global", l: "Kingdom Reach" },
            ].map((s, i) => (
              <div className="ab-hero-stat" key={i}>
                <div className="ab-hero-stat-n">{s.n}</div>
                <div className="ab-hero-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="ab-hero-scroll">
            <span className="ab-hero-scroll-lbl">Scroll</span>
            <div className="ab-hero-scroll-track">
              <div className="ab-hero-scroll-fill" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ab-hero-right">
          <HeroParticles />
          <img
            src="https://smhos.org/wp-content/uploads/2025/04/Highlights-from-todays-service-–-a-time-of-worship-the-Word-and-the-supernatural.-Relive-the-moments-and-be-blessedSMHOS-smhosglobal-highlights.jpg"
            alt=""
            className="ab-hero-img"
            onError={(e) =>
              (e.target.src =
                "https://smhos.org/wp-content/uploads/2025/03/DSC02290-819x1024.jpg")
            }
          />
          <div className="ab-hero-img-overlay" />
          <div className="ab-hero-split-line" />
          <div className="ab-hero-img-tag">Est. 1997 · Port Harcourt</div>
          <div className="ab-hero-img-year">1997</div>
        </div>
      </section>

      <div className="ab-divider" />

      {/* ═══════════════════════════════════════════ STORY ══ */}
      <section className="ab-story">
        <div className="ab-story-in">
          <div className="rev-l">
            <div className="ab-story-img-wrap">
              <div className="ab-story-img-border" />
              <img
                src="https://smhos.org/wp-content/uploads/2025/04/Highlights-from-todays-service-%E2%80%93-a-time-of-worship-the-Word-and-the-supernatural.-Relive-the-moments-and-be-blessedSMHOS-smhosglobal-highlights.jpg"
                alt="Salvation Ministries Service"
                className="ab-story-img"
                onError={(e) =>
                  (e.target.src =
                    "https://smhos.org/wp-content/uploads/2025/03/DSC02290-819x1024.jpg")
                }
              />
              <div className="ab-story-shine" />
              <div className="ab-story-scanlines" />
              <div className="ab-story-badge">Est. 1997 · Port Harcourt</div>
            </div>
          </div>
          <div className="rev-r">
            <span className="ab-story-year">1997</span>
            <div className="ab-s-lbl">
              <div className="ab-s-lbl-line" />
              Our Story
            </div>
            <h2 className="ab-s-h2">
              A GLOBAL FAMILY
              <br />
              OF <em>Believers</em>
            </h2>
            <div className="ab-orn" />
            <p className="ab-p">
              <em>"To Establish the Kingdom of God here on Earth."</em> This was
              the mandate given to David Ibiyeomie that manifested as Salvation
              Ministries on the <em>13th of April, 1997</em>.
            </p>
            <p className="ab-p">
              From a little over 30 persons in attendance at the first
              gathering, the Commission has become an ever-growing global family
              of believers who are passionate about Christ and bringing the
              Gospel to the unsaved.
            </p>
            <p className="ab-p">
              A revolutionary point in our chronicles was the remarkable
              expansion from one focal point at Plot 17, Birabi Street to an
              additional <em>14 satellite churches</em>, all running five
              services — a groundbreaking record set on February 13, 2011.
            </p>
            <div
              style={{
                marginTop: 52,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/locator"
                className="btn-g"
                target="_blank"
                rel="noreferrer"
              >
                <span>Find A Church</span>
                <span className="btn-arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ VERSE ══ */}
      <div className="ab-verse">
        <div className="ab-verse-star" />
        <div className="ab-verse-star2" />
        <div className="ab-verse-inner rev">
          <blockquote className="ab-verse-q">
            "I will build my church; and the gates of hell shall not prevail
            against it."
          </blockquote>
          <div className="ab-verse-ref">Matthew 16:18b · The Holy Bible</div>
        </div>
      </div>

      {/* ════════════════════════════════════════ TIMELINE ══ */}
      <section className="ab-timeline">
        <div className="ab-tl-in">
          <div className="ab-tl-hdr rev">
            <div className="ab-s-lbl" style={{ justifyContent: "center" }}>
              <div className="ab-s-lbl-line" />
              Our Journey Through Time
              <div
                className="ab-s-lbl-line"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
            <h2 className="ab-s-h2" style={{ textAlign: "center" }}>
              FROM <em>Small Beginnings</em>
              <br />
              TO GLOBAL IMPACT
            </h2>
          </div>
          <div className="ab-tl-track">
            {TIMELINE.map((item, i) => (
              <div
                className="ab-tl-item rev"
                key={i}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="ab-tl-dot">
                  <div className="ab-tl-dot-ring" />
                  <div className="ab-tl-dot-ring2" />
                </div>
                <div className="ab-tl-year">{item.year}</div>
                <div className="ab-tl-content">
                  <div className="ab-tl-tag">{item.tag}</div>
                  <div className="ab-tl-title">{item.title}</div>
                  <p className="ab-tl-text">{item.text}</p>
                  <div className="ab-tl-chip">{item.chip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════ VALUES ══ */}
      <section className="ab-values">
        <div className="ab-values-in">
          <div>
            <div className="ab-s-lbl rev">
              <div className="ab-s-lbl-line" />
              What We Stand For
            </div>
            <h2 className="ab-s-h2 rev" style={{ transitionDelay: "0.1s" }}>
              OUR
              <br />
              <em>Core Values</em>
            </h2>
            <div className="ab-orn rev" style={{ transitionDelay: "0.15s" }} />
            <p
              className="ab-p rev"
              style={{ transitionDelay: "0.2s", marginBottom: 40 }}
            >
              At Salvation Ministries, our foundation is Christ, the Solid Rock.
              These values guide everything we do.
            </p>
            <div className="ab-vals-list">
              {VALUES.map((v, i) => (
                <div
                  className={`ab-val${openVal === i ? " open" : ""}`}
                  key={i}
                >
                  <div
                    className="ab-val-head"
                    onClick={() => setOpenVal(openVal === i ? -1 : i)}
                  >
                    <span className="ab-val-num">{v.num}</span>
                    <span className="ab-val-name">{v.title}</span>
                    <div className="ab-val-icon">
                      {openVal === i ? "−" : "+"}
                    </div>
                  </div>
                  <div className="ab-val-body">
                    <div className="ab-val-body-inner">{v.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rev-r" style={{ transitionDelay: "0.2s" }}>
            <div className="ab-vals-visual">
              <div className="ab-orb-cross-v" />
              <div className="ab-orb-cross-h" />
              <div className="ab-orb-cross-d1" />
              <div className="ab-orb-cross-d2" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="ab-orb" />
              ))}
              <div className="ab-orb-spin" />
              <div className="ab-orb-spin2" />
              <div className="ab-orb-center">
                <div className="ab-orb-icon">✦</div>
                <div className="ab-orb-label">Our Values</div>
              </div>
              <div className="ab-val-float">Faith</div>
              <div className="ab-val-float">Prayer</div>
              <div
                className="ab-val-float"
                style={{
                  left: "-10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  animation: "floatLR 7s ease-in-out infinite 1s",
                }}
              >
                Scripture
              </div>
              <div
                className="ab-val-float"
                style={{
                  right: "-10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  animation: "floatLR 5.5s ease-in-out infinite 1.5s",
                }}
              >
                Mission
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ VIDEO ══ */}
      <section className="ab-video">
        <div className="ab-video-in">
          <div className="ab-video-hdr rev">
            <div className="ab-s-lbl" style={{ justifyContent: "center" }}>
              <div className="ab-s-lbl-line" />
              29th Anniversary Documentary
              <div
                className="ab-s-lbl-line"
                style={{ transform: "scaleX(-1)" }}
              />
            </div>
            <h2 className="ab-s-h2" style={{ textAlign: "center" }}>
              LISTEN
              <br />
              <em>
                To <b>God's</b> Word briefly
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--f-body)",
                fontSize: 17,
                fontStyle: "italic",
                color: "var(--muted)",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              Listen to God's word that will change your life for the better
            </p>
          </div>
          <div
            className="ab-video-frame rev"
            style={{ transitionDelay: "0.2s" }}
            onClick={() => setVideoOpen(true)}
          >
            <img
              src="https://i.ytimg.com/vi/d1edivtoa28/maxresdefault.jpg"
              alt="Listen To God's Word"
              className="ab-vid-img"
              onError={(e) =>
                (e.target.src =
                  "https://smhos.org/wp-content/uploads/2025/03/DSC02290-819x1024.jpg")
              }
            />
            <div className="ab-vid-overlay">
              <div className="ab-play-ring">
                <div className="ab-play-btn">▶</div>
              </div>
              <div className="ab-vid-meta">
                <div className="ab-vid-tag">
                  Master the Principles of Kingdom Authority and Success with
                  David Ibiyeomie
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ JOIN US ══ */}
      <section className="ab-join">
        <div className="ab-join-in">
          <div className="rev-r">
            <div className="ab-s-lbl">
              <div className="ab-s-lbl-line" />
              Belong & Grow
            </div>
            <h2 className="ab-s-h2">
              JOIN
              <br />
              <em>Our Family</em>
            </h2>
            <div className="ab-orn" />
            <p className="ab-p">
              At Salvation Ministries, our foundation is Christ, the Solid Rock.
              We maintain the values of love, faith, fellowship and impact,
              exhibited in everything we do.
            </p>
            <p className="ab-p">
              Currently, our services and programs are transmitted in English,
              French, Spanish, Arabic, German, Italian, Portuguese, and
              indigenous Nigerian languages.
            </p>
            <div className="ab-fellow-grid">
              {FELLOWSHIPS.map((f, i) => (
                <FellowCard key={i} f={f} i={i} />
              ))}
            </div>
          </div>
          <div className="rev-l">
            <div className="ab-join-img-wrap">
              <div className="ab-join-img-border" />
              <img
                src="https://smhos.org/wp-content/uploads/2025/04/Highlights-from-todays-service-%E2%80%93-a-time-of-worship-the-Word-and-the-supernatural.-Relive-the-moments-and-be-blessedSMHOS-smhosglobal-highlights-1.jpg"
                alt="Join Us"
                className="ab-join-img"
                onError={(e) =>
                  (e.target.src =
                    "https://smhos.org/wp-content/uploads/2023/02/IMG_0109-768x512.jpg")
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ BOOKS ══ */}
      <section className="ab-books">
        <div className="ab-books-in">
          <div className="ab-books-hdr">
            <div>
              <div className="ab-s-lbl rev">
                <div className="ab-s-lbl-line" />
                Knowledge Centre
              </div>
              <h2 className="ab-s-h2 rev" style={{ transitionDelay: "0.1s" }}>
                BOOKS BY
                <br />
                <em>David Ibiyeomie</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <a
                href="https://smhosstore.com"
                className="btn-gh"
                target="_blank"
                rel="noreferrer"
              >
                <span>Visit the Store</span>
                <span className="btn-arr">→</span>
              </a>
            </div>
          </div>
          <div className="ab-books-grid">
            {BOOKS.map((b, i) => (
              <BookCard key={i} book={b} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ WORSHIP ══ */}
      <section className="ab-worship">
        <div className="ab-worship-in">
          <div className="rev-l">
            <div className="ab-s-lbl">
              <div className="ab-s-lbl-line" />
              Come & Worship
            </div>
            <h2 className="ab-s-h2">
              WORSHIP
              <br />
              <em>With Us</em>
            </h2>
            <div className="ab-orn" />
            <p className="ab-p">
              Join us every week and experience the transforming presence of
              God. In-person or online — there is a place for you.
            </p>
            <p className="ab-p" style={{ marginBottom: 0 }}>
              <em>
                Plot 17 Birabi Street, GRA Phase 1, Port Harcourt, Rivers,
                Nigeria
              </em>
            </p>
            <div className="ab-contact-extras">
              {[
                {
                  icon: "📞",
                  content: (
                    <>
                      <strong>
                        <a href="tel:+2348033123743">+234 (803) 312 3743</a>
                      </strong>{" "}
                      — Call us anytime
                    </>
                  ),
                },
                {
                  icon: "✉️",
                  content: (
                    <>
                      <strong>info@smhos.org</strong> — Reach out by email
                    </>
                  ),
                },
                {
                  icon: "🌐",
                  content: (
                    <>
                      <strong>smhos.com/livestream</strong> — Watch services
                      worldwide
                    </>
                  ),
                },
              ].map((e, i) => (
                <div className="ab-contact-extra" key={i}>
                  <div className="ab-contact-icon">{e.icon}</div>
                  <div className="ab-contact-text">{e.content}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginTop: 40,
              }}
            >
              <Link
                to="/locator"
                className="btn-g"
                target="blank"
                rel="noreferrer"
              >
                <span>Get Directions</span>
                <span className="btn-arr">→</span>
              </Link>
              <Link
                to="/livestream"
                className="btn-gh"
                target="_blank"
                rel="noreferrer"
              >
                <span>Watch Online</span>
                <span className="btn-arr">→</span>
              </Link>
            </div>
          </div>
          <div className="rev-r">
            <div className="ab-svc-grid">
              <div className="ab-svc-card">
                <div className="ab-svc-day">SUNDAY</div>
                <div className="ab-svc-times">
                  6:30 am
                  <br />
                  8:00 am
                  <br />
                  9:30 am
                  <br />
                  11:00 am
                </div>
                <div className="ab-svc-tz">GMT +1</div>
              </div>
              <div className="ab-svc-card">
                <div className="ab-svc-day">THURS</div>
                <div className="ab-svc-times">5:00 pm</div>
                <div className="ab-svc-tz">GMT +1</div>
              </div>
            </div>
            <div className="ab-confession">
              <div className="ab-confession-lbl">Our Confession</div>
              <blockquote className="ab-confession-q">
                "For every house is builded by some man; but he that built all
                things is God."
              </blockquote>
              <div className="ab-confession-ref">Hebrews 3:4</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════ VIDEO MODAL ══ */}
      {videoOpen && (
        <div className="ab-modal" onClick={() => setVideoOpen(false)}>
          <button
            className="ab-modal-close"
            onClick={() => setVideoOpen(false)}
          >
            ✕
          </button>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/IGOgB0IiBRg?si=hi07FcJBmn-Y5BM4&autoplay=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
