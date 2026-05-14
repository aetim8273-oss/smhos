import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import churchHQ from "./assets/churchImage.png";
/* ─────────────────────────────────────────────────────────── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

@property --shimmer-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --border-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

:root {
  --black:#05050A;
  --deep:#08080F;
  --dark:#0F0F1A;
  --mid:#1A1A2E;
  --panel:#12121E;
  --card:#161625;
  --gold:#C8A84B;
  --gold2:#E2C06A;
  --gold3:#F5D98A;
  --gold4:#FFF0BB;
  --glow:rgba(200,168,75,0.15);
  --glow2:rgba(200,168,75,0.06);
  --border:rgba(200,168,75,0.2);
  --border2:rgba(200,168,75,0.45);
  --white:#FDFAF4;
  --cream:#F5EDDA;
  --muted:#8A8070;
  --faint:#3A3830;
  --crimson:#9B1B30;
  --f-display:'Bebas Neue',sans-serif;
  --f-serif:'Playfair Display',serif;
  --f-body:'Libre Baskerville',serif;
  --f-ui:'Montserrat',sans-serif;
  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
}

body{background:var(--black);color:var(--white);font-family:var(--f-body);overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--deep);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--gold3));border-radius:2px;}
img{max-width:100%;height:auto;display:block;}
a{color:var(--gold);text-decoration:none;}

/* ── GRAIN OVERLAY ─── */
.grain-overlay{position:fixed;inset:0;z-index:99994;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-repeat:repeat;background-size:128px 128px;opacity:0.032;mix-blend-mode:overlay;
  animation:grainShift 0.4s steps(3) infinite;}
@keyframes grainShift{0%{transform:translate(0,0);}33%{transform:translate(-3px,2px);}66%{transform:translate(3px,-2px);}100%{transform:translate(-1px,3px);}}

/* ── CURSOR ─── */
.cur-dot{position:fixed;pointer-events:none;z-index:99999;width:6px;height:6px;background:var(--gold3);border-radius:50%;transform:translate(-50%,-50%);transition:transform 0.08s;mix-blend-mode:difference;}
.cur-ring{position:fixed;pointer-events:none;z-index:99998;width:38px;height:38px;border:1.5px solid var(--border2);border-radius:50%;transform:translate(-50%,-50%);transition:width 0.3s var(--ease),height 0.3s var(--ease),border-color 0.3s,background 0.3s;}
.cur-ring.h{width:64px;height:64px;border-color:var(--gold);background:rgba(200,168,75,0.06);}

/* ── NAV ─── */
.sm-nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:24px 64px;display:flex;align-items:center;justify-content:space-between;transition:all 0.5s var(--ease);}
.sm-nav::after{content:'';position:absolute;inset:0;background:transparent;backdrop-filter:blur(0px);transition:all 0.5s;pointer-events:none;}
.sm-nav.scrolled{padding:16px 64px;}
.sm-nav.scrolled::after{background:rgba(5,5,10,0.94);backdrop-filter:blur(28px);border-bottom:1px solid var(--border);}
.nav-logo img{height:46px;object-fit:contain;position:relative;z-index:1;filter:drop-shadow(0 0 14px rgba(200,168,75,0.4));transition:filter 0.4s;}
.nav-logo img:hover{filter:drop-shadow(0 0 28px rgba(200,168,75,0.7)) drop-shadow(0 0 60px rgba(200,168,75,0.3));}
.nav-links{display:flex;align-items:center;gap:44px;position:relative;z-index:1;}
.nav-a{font-family:var(--f-ui);font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:rgba(253,250,244,0.6);text-decoration:none;position:relative;padding:4px 0;transition:color 0.3s;}
.nav-a::after{content:'';position:absolute;bottom:-2px;left:50%;right:50%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transition:left 0.4s var(--ease),right 0.4s var(--ease);}
.nav-a:hover,.nav-a.active{color:var(--gold3);}
.nav-a:hover::after,.nav-a.active::after{left:0;right:0;}
.nav-sep{width:1px;height:22px;background:var(--border);}
.nav-give{font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:14px 32px;position:relative;overflow:hidden;transition:transform 0.3s,box-shadow 0.3s;box-shadow:0 4px 28px rgba(200,168,75,0.35);}
.nav-give::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.nav-give:hover{transform:translateY(-2px);box-shadow:0 10px 48px rgba(200,168,75,0.6);}
.nav-give:hover::after{left:150%;}
.burger{display:none;flex-direction:column;gap:7px;cursor:pointer;background:none;border:none;padding:8px;z-index:1;}
.burger-ln{width:28px;height:1.5px;background:var(--white);transition:all 0.4s var(--ease);transform-origin:center;}
.burger.open .burger-ln:nth-child(1){transform:translateY(8.5px) rotate(45deg);}
.burger.open .burger-ln:nth-child(2){opacity:0;transform:scaleX(0);}
.burger.open .burger-ln:nth-child(3){transform:translateY(-8.5px) rotate(-45deg);}
.mob-nav{position:fixed;inset:0;z-index:999;background:var(--deep);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:translateX(100%);transition:transform 0.7s var(--ease2);overflow:auto;padding:80px 20px 40px;}
.mob-nav.open{transform:translateX(0);}
.mob-nav::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(200,168,75,0.06) 0%,transparent 70%);}
.mob-links{display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;}
.mob-a{font-family:var(--f-display);font-size:clamp(40px,8vw,72px);color:var(--white);text-decoration:none;letter-spacing:0.05em;opacity:0;transform:translateX(40px);transition:color 0.3s,opacity 0.5s,transform 0.5s;}
.mob-nav.open .mob-a{opacity:1;transform:translateX(0);}
.mob-nav.open .mob-a:nth-child(1){transition-delay:0.08s;}
.mob-nav.open .mob-a:nth-child(2){transition-delay:0.14s;}
.mob-nav.open .mob-a:nth-child(3){transition-delay:0.2s;}
.mob-nav.open .mob-a:nth-child(4){transition-delay:0.26s;}
.mob-nav.open .mob-a:nth-child(5){transition-delay:0.32s;}
.mob-nav.open .mob-a:nth-child(6){transition-delay:0.38s;}
.mob-a:hover{color:var(--gold);}
.mob-give{font-family:var(--f-ui);font-size:13px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:18px 56px;margin-top:24px;opacity:0;transform:translateY(20px);transition:opacity 0.5s 0.44s,transform 0.5s 0.44s;}
.mob-nav.open .mob-give{opacity:1;transform:translateY(0);}

/* ── HERO ─── */
.contact-hero{min-height:70vh;position:relative;display:flex;align-items:flex-end;padding:160px 0 100px;overflow:hidden;background:var(--black);}
.contact-hero-bg{position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.45) 100%),
  url('https://smhos.org/wp-content/uploads/2025/04/DSC09497-scaled.jpg') center/cover fixed;
}
.contact-hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse 70% 100% at 50% 60%,rgba(200,168,75,0.07) 0%,var(--black) 75%);}
.god-rays{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.god-rays::before{content:'';position:absolute;top:-60%;left:50%;transform-origin:top center;width:300%;height:200%;transform:translateX(-50%);
  background:conic-gradient(from 270deg at 50% 0%,transparent 0deg,rgba(200,168,75,0.035) 2.5deg,transparent 5deg,transparent 13deg,rgba(255,230,120,0.028) 15.5deg,transparent 18deg,transparent 26deg,rgba(200,168,75,0.04) 28.5deg,transparent 31deg,transparent 44deg,rgba(255,240,150,0.022) 46.5deg,transparent 49deg,transparent 58deg,rgba(200,168,75,0.035) 60.5deg,transparent 63deg,transparent 88deg,rgba(200,168,75,0.03) 90.5deg,transparent 93deg,transparent 100deg);
  animation:godRaysRotate 120s linear infinite;}
@keyframes godRaysRotate{from{transform:translateX(-50%) rotate(0deg);}to{transform:translateX(-50%) rotate(360deg);}}
.hero-rings{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.h-ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid var(--border);transform:translate(-50%,-50%);animation:ringPulse 10s ease-in-out infinite;}
.h-ring:nth-child(1){width:220px;height:220px;border:2px solid rgba(200,168,75,0.25);animation-delay:0s;}
.h-ring:nth-child(2){width:440px;height:440px;animation-delay:2s;}
.h-ring:nth-child(3){width:700px;height:700px;border-color:rgba(200,168,75,0.06);animation-delay:4s;}
@keyframes ringPulse{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.35;transform:translate(-50%,-50%) scale(1.04);}}
.hero-content{position:relative;z-index:5;padding:0 64px;width:100%;max-width:1440px;margin:0 auto;}
.hero-breadcrumb{display:flex;align-items:center;gap:14px;margin-bottom:28px;opacity:0;animation:fadeUp 0.9s 0.3s var(--ease) forwards;}
.hero-breadcrumb a{font-family:var(--f-ui);font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(253,250,244,0.5);transition:color 0.3s;}
.hero-breadcrumb a:hover{color:var(--gold3);}
.hero-breadcrumb span{color:var(--gold);font-size:10px;}
.hero-breadcrumb .current{font-family:var(--f-ui);font-size:11px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold3);}
.hero-title{font-family:var(--f-display);font-size:clamp(80px,12vw,180px);font-weight:400;line-height:0.88;color:var(--white);letter-spacing:0.06em;opacity:0;animation:fadeUp 1s 0.5s var(--ease) forwards;text-shadow:0 0 80px rgba(200,168,75,0.25);}
.hero-title-gold{background:linear-gradient(90deg,var(--gold) 0%,var(--gold4) 25%,var(--gold2) 50%,var(--gold3) 75%,var(--gold) 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:prismShift 6s linear infinite;}
@keyframes prismShift{0%{background-position:0% center;}100%{background-position:300% center;}}
.hero-sub{font-family:var(--f-serif);font-size:clamp(16px,2vw,22px);font-style:italic;color:rgba(253,250,244,0.45);letter-spacing:0.15em;margin-top:16px;opacity:0;animation:fadeUp 0.9s 0.8s var(--ease) forwards;}
.hero-scroll{position:absolute;bottom:36px;right:64px;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:fadeUp 0.9s 1.2s var(--ease) forwards;}
.hero-scroll-lbl{font-family:var(--f-ui);font-size:9px;letter-spacing:0.6em;text-transform:uppercase;color:var(--muted);}
.hero-scroll-track{width:1px;height:60px;background:var(--faint);overflow:hidden;position:relative;}
.hero-scroll-fill{position:absolute;top:-100%;width:100%;height:100%;background:linear-gradient(var(--gold3),transparent);animation:scrollDown 2.4s ease-in-out infinite;}
@keyframes scrollDown{0%{top:-100%;}100%{top:200%;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}

/* ── TICKER ─── */
.ticker{padding:14px 0;overflow:hidden;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:300% 100%;animation:tickerShimmer 5s linear infinite;}
@keyframes tickerShimmer{0%{background-position:0% 0%;}100%{background-position:300% 0%;}}
.ticker-inner{display:flex;white-space:nowrap;animation:tick 28s linear infinite;}
.t-item{display:flex;align-items:center;gap:28px;padding:0 28px;font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--black);flex-shrink:0;}
.t-dot{width:5px;height:5px;background:var(--black);border-radius:50%;opacity:0.35;}
@keyframes tick{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── SECTION COMMON ─── */
.s-lbl{display:flex;align-items:center;gap:14px;font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
.s-lbl-line{flex:0 0 36px;height:1px;background:var(--border2);}
.s-h2{font-family:var(--f-display);font-size:clamp(44px,6vw,88px);font-weight:400;line-height:0.92;color:var(--white);letter-spacing:0.04em;margin-bottom:24px;}
.s-h2 em{font-style:italic;font-family:var(--f-serif);background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-size:0.85em;}
.s-body{font-family:var(--f-body);font-size:17px;font-weight:400;line-height:2;color:var(--muted);}
.s-orn{position:relative;width:64px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:28px 0;}
.s-orn::after{content:'✦';position:absolute;top:50%;left:70px;transform:translateY(-50%);font-size:10px;color:var(--gold);opacity:0.5;animation:diamondSpin 8s linear infinite;}
@keyframes diamondSpin{from{transform:translateY(-50%) rotate(0deg);}to{transform:translateY(-50%) rotate(360deg);}}

/* ── REVEAL ─── */
.rev{opacity:0;transform:translateY(48px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev.vis{opacity:1;transform:translateY(0);}
.rev-l{opacity:0;transform:translateX(-48px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-l.vis{opacity:1;transform:translateX(0);}
.rev-r{opacity:0;transform:translateX(48px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-r.vis{opacity:1;transform:translateX(0);}

/* ── CONTACT MAIN ─── */
.contact-section{background:var(--dark);padding:140px 0;position:relative;overflow:hidden;}
.contact-section::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(200,168,75,0.025) 1px,transparent 1px),linear-gradient(-45deg,rgba(200,168,75,0.025) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;}
.contact-section::after{content:'CONTACT';position:absolute;bottom:-40px;right:-40px;font-family:var(--f-display);font-size:clamp(120px,18vw,260px);color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.035);white-space:nowrap;pointer-events:none;line-height:1;user-select:none;}
.contact-in{max-width:1440px;margin:0 auto;padding:0 64px;display:grid;grid-template-columns:5fr 6fr;gap:120px;align-items:start;position:relative;z-index:1;}

/* ── INFO SIDE ─── */
.info-divider{width:100%;height:1px;background:linear-gradient(90deg,var(--border2),transparent);margin:44px 0;}
.contact-info-card{margin-bottom:32px;padding:32px;position:relative;background:rgba(22,22,37,0.6);border:1px solid rgba(200,168,75,0.12);transition:all 0.4s var(--ease);backdrop-filter:blur(12px);}
.contact-info-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:2.5px;background:linear-gradient(var(--gold),var(--gold3),transparent);transform:scaleY(0);transform-origin:top;transition:transform 0.5s var(--ease);}
.contact-info-card:hover::before{transform:scaleY(1);}
.contact-info-card:hover{border-color:rgba(200,168,75,0.3);background:rgba(22,22,37,0.8);transform:translateX(6px);box-shadow:0 8px 40px rgba(0,0,0,0.4),0 0 30px rgba(200,168,75,0.05);}
.contact-info-card h6{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;}
.contact-info-card p{font-family:var(--f-body);font-size:15px;color:var(--muted);line-height:1.9;}
.contact-info-card .icon{font-size:22px;margin-bottom:16px;display:block;filter:drop-shadow(0 0 8px rgba(200,168,75,0.4));}

/* ── MAP ─── */
.map-wrap{position:relative;border:1px solid var(--border);overflow:hidden;margin-top:40px;}
.map-wrap::before{content:'';position:absolute;inset:-1.5px;z-index:0;background:conic-gradient(from var(--shimmer-angle),transparent 0%,var(--gold3) 8%,var(--gold) 16%,transparent 24%,transparent 50%,var(--gold3) 58%,transparent 66%);opacity:0.6;animation:shimmerSpin 5s linear infinite;}
@keyframes shimmerSpin{from{--shimmer-angle:0deg;}to{--shimmer-angle:360deg;}}
.map-wrap::after{content:'';position:absolute;inset:1.5px;background:var(--deep);z-index:0;}
.map-wrap iframe{position:relative;z-index:1;width:100%;height:280px;border:0;filter:saturate(0.4) brightness(0.7);}
.map-corners .c{position:absolute;width:18px;height:18px;border-color:var(--gold3);border-style:solid;z-index:2;}
.map-corners .tl{top:6px;left:6px;border-width:2px 0 0 2px;}
.map-corners .tr{top:6px;right:6px;border-width:2px 2px 0 0;}
.map-corners .bl{bottom:6px;left:6px;border-width:0 0 2px 2px;}
.map-corners .br{bottom:6px;right:6px;border-width:0 2px 2px 0;}

/* ── SOCIAL ROW ─── */
.social-row{display:flex;gap:12px;margin-top:32px;}
.soc-btn{width:48px;height:48px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-family:var(--f-ui);font-size:12px;font-weight:700;letter-spacing:0.05em;text-decoration:none;transition:all 0.3s var(--ease3);}
.soc-btn:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,168,75,0.08);box-shadow:0 0 24px rgba(200,168,75,0.2);transform:translateY(-3px) scale(1.1);}

/* ── FORM SIDE ─── */
.form-glass{background:rgba(22,22,37,0.55);border:1px solid rgba(200,168,75,0.15);padding:64px;position:relative;overflow:hidden;backdrop-filter:blur(24px) saturate(1.5);}
.form-glass::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,var(--gold3),var(--gold),var(--gold3),transparent);animation:borderShimmer 4s linear infinite;}
@keyframes borderShimmer{0%{background-position:0% 0%;}100%{background-position:200% 0%;}}
.form-corner{position:absolute;width:20px;height:20px;border-color:var(--gold3);border-style:solid;}
.form-corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.form-corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.form-glow{position:absolute;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,0.05) 0%,transparent 70%);top:-100px;right:-100px;pointer-events:none;animation:glowDrift 12s ease-in-out infinite alternate;}
@keyframes glowDrift{0%{transform:translate(0,0);}100%{transform:translate(-80px,80px);}}

.form-label{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:block;}
.form-input{width:100%;padding:18px 22px;background:rgba(5,5,10,0.7);border:1.5px solid rgba(200,168,75,0.15);font-family:var(--f-body);font-size:15px;color:var(--white);transition:all 0.3s var(--ease);outline:none;}
.form-input::placeholder{color:rgba(138,128,112,0.5);}
.form-input:focus{border-color:var(--gold);box-shadow:0 0 0 4px rgba(200,168,75,0.08),0 0 30px rgba(200,168,75,0.05);background:rgba(5,5,10,0.85);}
.form-input:hover:not(:focus){border-color:rgba(200,168,75,0.3);}
select.form-input{cursor:pointer;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23C8A84B' d='M6 8L0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 20px center;}
select.form-input option{background:var(--dark);color:var(--white);}
textarea.form-input{resize:vertical;min-height:140px;line-height:1.8;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.form-field{display:flex;flex-direction:column;gap:0;}
.form-group{margin-bottom:28px;}

/* ── BUTTONS ─── */
.btn-g{display:inline-flex;align-items:center;gap:14px;font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);text-decoration:none;padding:18px 44px;position:relative;overflow:hidden;transition:transform 0.3s var(--ease),box-shadow 0.3s;box-shadow:0 6px 36px rgba(200,168,75,0.35);border:none;cursor:pointer;width:100%;}
.btn-g::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold4),var(--gold3));opacity:0;transition:opacity 0.3s;}
.btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.btn-g:hover{transform:translateY(-3px);box-shadow:0 16px 64px rgba(200,168,75,0.55),0 0 80px rgba(200,168,75,0.2);}
.btn-g:hover::before{opacity:1;}
.btn-g:hover::after{left:150%;}
.btn-g span,.btn-arr{position:relative;z-index:1;}
.btn-arr{transition:transform 0.3s;}
.btn-g:hover .btn-arr{transform:translateX(5px);}
.btn-g:disabled{opacity:0.5;cursor:not-allowed;}
.btn-g:disabled:hover{transform:none;box-shadow:0 6px 36px rgba(200,168,75,0.35);}

/* ── SUCCESS ─── */
.success-state{text-align:center;padding:80px 40px;position:relative;}
.success-icon{width:80px;height:80px;border:2px solid var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 32px;position:relative;box-shadow:0 0 40px rgba(200,168,75,0.3),inset 0 0 20px rgba(200,168,75,0.08);}
.success-icon::before{content:'';position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(200,168,75,0.2);animation:successRing 2s ease-in-out infinite;}
@keyframes successRing{0%,100%{transform:scale(1);opacity:0.7;}50%{transform:scale(1.1);opacity:0;}}
.success-icon svg{width:36px;height:36px;color:var(--gold);stroke-width:2;}
.success-title{font-family:var(--f-display);font-size:52px;letter-spacing:0.04em;color:var(--white);margin-bottom:16px;}
.success-sub{font-family:var(--f-body);font-size:16px;font-style:italic;color:var(--muted);line-height:1.9;}
.success-verse{margin-top:40px;padding:28px;border:1px solid var(--border);font-family:var(--f-body);font-size:14px;font-style:italic;color:rgba(200,168,75,0.8);line-height:1.8;position:relative;}
.success-verse::before{content:'"';font-family:var(--f-display);font-size:80px;color:rgba(200,168,75,0.1);position:absolute;top:-10px;left:12px;line-height:1;}

/* ── LOCATE SECTION ─── */
.locate-section{background:var(--panel);padding:140px 0;position:relative;overflow:hidden;border-top:1px solid var(--border);}
.locate-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(200,168,75,0.04) 0%,transparent 70%);}
.locate-in{max-width:1440px;margin:0 auto;padding:0 64px;position:relative;z-index:1;}
.locate-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:80px;}
.locate-card{background:rgba(22,22,37,0.6);border:1px solid rgba(200,168,75,0.15);overflow:hidden;backdrop-filter:blur(12px);transition:border-color 0.4s,box-shadow 0.4s;}
.locate-card:hover{border-color:rgba(200,168,75,0.35);box-shadow:0 0 60px rgba(200,168,75,0.06);}
.locate-img-wrap{overflow:hidden;height:380px;position:relative;}
.locate-img{width:100%;height:100%;object-fit:cover;filter:brightness(0.7) saturate(0.8);transition:transform 0.9s var(--ease),filter 0.6s;}
.locate-card:hover .locate-img{transform:scale(1.05);filter:brightness(0.8) saturate(1);}
.locate-img-over{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,10,0.7) 0%,transparent 50%);}
.locate-body{padding:52px;}
.locate-meta{display:grid;grid-template-columns:1fr 1fr;gap:52px;margin:36px 0;}
.locate-col h6{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
.locate-col p{font-family:var(--f-body);font-size:15px;color:var(--muted);line-height:1.9;margin-bottom:24px;}
.btn-gh{display:inline-flex;align-items:center;gap:14px;font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;background:transparent;color:var(--gold3);text-decoration:none;padding:17px 36px;border:1.5px solid var(--border2);position:relative;overflow:hidden;transition:all 0.3s var(--ease);}
.btn-gh::before{content:'';position:absolute;inset:0;background:rgba(200,168,75,0.07);opacity:0;transition:opacity 0.3s;}
.btn-gh:hover{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 30px rgba(200,168,75,0.15);}
.btn-gh:hover::before{opacity:1;}

/* ── CONNECT SECTION ─── */
.connect-section{background:var(--black);padding:140px 0;text-align:center;position:relative;overflow:hidden;}
.connect-section::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(200,168,75,0.03) 1px,transparent 1px),linear-gradient(-45deg,rgba(200,168,75,0.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;}
.connect-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(200,168,75,0.07) 0%,transparent 70%);pointer-events:none;animation:connectGlowPulse 7s ease-in-out infinite;}
@keyframes connectGlowPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1;}50%{transform:translate(-50%,-50%) scale(1.1);opacity:0.6;}}
.connect-cross-v{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1px;height:600px;background:linear-gradient(transparent,rgba(200,168,75,0.07),transparent);}
.connect-cross-h{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:1px;background:linear-gradient(transparent,rgba(200,168,75,0.07),transparent);}
.connect-in{position:relative;z-index:1;max-width:700px;margin:0 auto;padding:0 64px;}
.corner-orn{position:absolute;pointer-events:none;}
.corner-orn.tl{top:28px;left:28px;width:40px;height:40px;border-top:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.tr{top:28px;right:28px;width:40px;height:40px;border-top:1px solid var(--border2);border-right:1px solid var(--border2);}
.corner-orn.bl{bottom:28px;left:28px;width:40px;height:40px;border-bottom:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.br{bottom:28px;right:28px;width:40px;height:40px;border-bottom:1px solid var(--border2);border-right:1px solid var(--border2);}

/* ── FOOTER ─── */
.sm-footer{background:var(--deep);border-top:1px solid var(--border);padding:112px 64px 0;position:relative;}
.sm-footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);}
.ft-top{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:2.5fr 1fr 1fr 1.5fr;gap:80px;padding-bottom:80px;border-bottom:1px solid var(--border);}
.ft-logo{height:46px;margin-bottom:28px;filter:drop-shadow(0 0 10px rgba(200,168,75,0.25));}
.ft-desc{font-family:var(--f-body);font-size:15px;font-style:italic;color:var(--muted);line-height:1.9;max-width:300px;margin-bottom:32px;}
.ft-socials{display:flex;gap:12px;}
.ft-soc{width:44px;height:44px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;text-decoration:none;transition:all 0.3s var(--ease3);font-family:var(--f-ui);font-weight:700;letter-spacing:0.05em;}
.ft-soc:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,168,75,0.08);box-shadow:0 0 24px rgba(200,168,75,0.25);transform:translateY(-3px) scale(1.1);}
.ft-col-title{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:16px;}
.ft-link{font-family:var(--f-body);font-size:14px;color:var(--muted);text-decoration:none;transition:color 0.3s;display:flex;align-items:center;gap:10px;}
.ft-link::before{content:'';width:0;height:1px;background:linear-gradient(90deg,var(--gold),var(--gold3));transition:width 0.3s;}
.ft-link:hover{color:var(--gold3);}
.ft-link:hover::before{width:18px;}
.ft-ci{font-family:var(--f-body);font-size:14px;color:var(--muted);margin-bottom:12px;line-height:1.7;}
.ft-ci a{color:inherit;text-decoration:none;transition:color 0.3s;}
.ft-ci a:hover{color:var(--gold3);}
.ft-cl{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:rgba(200,168,75,0.3);margin-bottom:4px;}
.ft-bot{max-width:1440px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:32px 0;gap:20px;}
.ft-copy{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--faint);}
.ft-bot-orn{display:flex;align-items:center;gap:14px;}
.ft-bot-line{height:1px;width:40px;background:var(--border);}
.ft-bot-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 8px rgba(200,168,75,0.4);animation:diamondSpin 6s linear infinite;}
.ft-bot-links{display:flex;gap:32px;}
.ft-bot-link{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:var(--faint);text-decoration:none;transition:color 0.3s;}
.ft-bot-link:hover{color:var(--gold);}

/* ── SPARKLE ─── */
@keyframes sparkleAnim{0%{opacity:0;transform:translateY(0) scale(0) rotate(0deg);}15%{opacity:1;transform:translateY(-20px) scale(1) rotate(90deg);}85%{opacity:1;}100%{opacity:0;transform:translateY(var(--sy,-80px)) scale(0.5) rotate(var(--sr,360deg));}}
.sparkle-particle{position:absolute;pointer-events:none;font-size:var(--spz,10px);color:var(--gold);animation:sparkleAnim var(--spdur,3s) var(--spdelay,0s) ease-in-out infinite;opacity:0;}

/* ── RESPONSIVE ─── */
@media(max-width:1200px){
  .contact-in{grid-template-columns:1fr;gap:80px;}
  .ft-top{grid-template-columns:1fr 1fr;gap:48px;}
}
@media(max-width:900px){
  .sm-nav{padding:18px 28px;}.sm-nav.scrolled{padding:14px 28px;}
  .nav-links{display:none;}.burger{display:flex;}
  .contact-in,.locate-in{padding:0 28px;}
  .contact-section,.locate-section,.connect-section{padding:90px 0;}
  .form-glass{padding:40px 28px;}
  .hero-content{padding:0 28px;}
  .hero-scroll{right:28px;}
  .locate-meta{grid-template-columns:1fr;}
  .form-row{grid-template-columns:1fr;}
  .ft-top{grid-template-columns:1fr;gap:40px;padding:0 28px 60px;}
  .sm-footer{padding:80px 28px 0;}
  .ft-bot{padding:28px 28px;flex-direction:column;text-align:center;}
  .connect-in{padding:0 28px;}
}
@media(max-width:600px){
  .locate-hdr{flex-direction:column;align-items:flex-start;gap:24px;}
  .form-glass{padding:32px 20px;}
}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.001ms !important;animation-iteration-count:1 !important;transition-duration:0.001ms !important;}
}
`;

/* ── NAV LINKS ── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Livestream", href: "/livestream" },
  { label: "Give", href: "/give" },
  { label: "About Us", href: "/about" },
  { label: "Store", href: "https://smhosstore.com" },
  { label: "Contact", href: "/contact", active: true },
];

const TICKER_ITEMS = [
  "Contact Us — We Are Available 24/7",
  "Sunday Services — 6:30am · 8:00am · 9:30am · 11:00am",
  "Thursday Service — 5:00pm GMT+1",
  "Plot 17 Birabi Street, GRA Phase 1, Port Harcourt",
  "+234 (803) 312 3743 · info@smhos.org",
];

const COUNTRIES = [
  { code: "", label: "Select Country" },
  { code: "NG", label: "Nigeria" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "GH", label: "Ghana" },
  { code: "ZA", label: "South Africa" },
  { code: "KE", label: "Kenya" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
];

/* ── HOOKS ── */
function useScrolled(t = 60) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > t);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [t]);
  return s;
}

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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".rev,.rev-l,.rev-r")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── CURSOR ── */
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
      const isLink = e.target.closest(
        "a,button,[role='button'],input,textarea,select",
      );
      ring.current?.classList.toggle("h", !!isLink);
    };
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
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

/* ── SPARKLES ── */
function Sparkles({ count = 8 }) {
  const [sparks] = useState(() =>
    Array.from({ length: count }, () => ({
      left: `${10 + Math.random() * 80}%`,
      bottom: `${Math.random() * 50}%`,
      sy: `${-(40 + Math.random() * 60)}px`,
      sr: `${180 + Math.random() * 360}deg`,
      spz: `${7 + Math.random() * 6}px`,
      spdur: `${2.5 + Math.random() * 2}s`,
      spdelay: `${Math.random() * 3}s`,
      symbol: ["✦", "✧", "◆", "·", "★"][Math.floor(Math.random() * 5)],
    })),
  );
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {sparks.map((s, i) => (
        <span
          key={i}
          className="sparkle-particle"
          style={{
            left: s.left,
            bottom: s.bottom,
            "--sy": s.sy,
            "--sr": s.sr,
            "--spz": s.spz,
            "--spdur": s.spdur,
            "--spdelay": s.spdelay,
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

/* ── MAIN EXPORT ── */
export default function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const scrolled = useScrolled();
  useReveal();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSending(true);

    try {
      const response = await fetch("https://formspree.io/f/mykojrez", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);

        setFormData({
          name: "",
          email: "",
          phone: "",
          city: "",
          country: "",
          message: "",
        });

        setTimeout(() => {
          setSubmitted(false);
        }, 6000);
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setSending(false);
    }
  };

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="grain-overlay" />
      {!isTouch && <Cursor />}

      {/* NAV */}
      <nav className={`sm-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">
          <Link to="/">
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
            />
          </Link>
        </div>
        <div className="nav-links">
          {NAV_LINKS.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className={`nav-a${l.active ? " active" : ""}`}
              target="_blank"
              rel="noreferrer"
            >
              {l.label}
            </a>
          ))}
          <div className="nav-sep" />
          <Link
            to="/give"
            className="nav-give"
            target="_blank"
            rel="noreferrer"
          >
            Give Online
          </Link>
        </div>
        <button
          className={`burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="burger-ln" />
          <span className="burger-ln" />
          <span className="burger-ln" />
        </button>
      </nav>

      {/* MOBILE NAV */}
      <div className={`mob-nav${menuOpen ? " open" : ""}`}>
        <div className="mob-links">
          {NAV_LINKS.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="mob-a"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <Link
          href="/give"
          className="mob-give"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Give Online
        </Link>
      </div>

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="contact-hero-overlay" />
        <div className="god-rays" />
        <div className="hero-rings">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-ring" />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-breadcrumb">
            <a href="/">Home</a>
            <span>✦</span>
            <span className="current">Contact</span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-gold">CONTACT</span>
            <br />
            <span
              style={{
                color: "rgba(253,250,244,0.15)",
                WebkitTextStroke: "1px rgba(253,250,244,0.25)",
              }}
            >
              US
            </span>
          </h1>
          <p className="hero-sub">
            God bless you · Reach out · We are available 24 / 7
          </p>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-lbl">Scroll</div>
          <div className="hero-scroll-track">
            <div className="hero-scroll-fill" />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="t-item">
              <span className="t-dot" />
              {item}
              <span className="t-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTACT SECTION */}
      <section className="contact-section">
        <div className="contact-in">
          {/* LEFT: INFO */}
          <div className="rev-l">
            <div className="s-lbl">
              <div className="s-lbl-line" />
              Get In Touch
            </div>
            <h2 className="s-h2">
              LET'S
              <br />
              <em>Talk</em>
            </h2>
            <div className="s-orn" />
            <p className="s-body" style={{ marginBottom: 52 }}>
              No matter where you are in the world, we want to hear from you.
              Our team is always available to help, pray with you, and point you
              to God's purpose for your life.
            </p>

            <div className="contact-info-card">
              <span className="icon">📍</span>
              <h6>Address</h6>
              <p>
                Plot 17, Birabi Street, GRA, Phase 1,
                <br />
                Port Harcourt, Rivers State, Nigeria.
              </p>
            </div>

            <div className="contact-info-card">
              <span className="icon">📞</span>
              <h6>Phone</h6>
              <p>
                <a href="tel:+2348033123743" style={{ color: "var(--gold3)" }}>
                  +234 (803) 312 3743
                </a>
              </p>
            </div>

            <div className="contact-info-card">
              <span className="icon">✉️</span>
              <h6>Email</h6>
              <p>
                <a
                  href="mailto:info@smhos.org"
                  style={{ color: "var(--gold3)" }}
                >
                  info@smhos.org
                </a>
              </p>
            </div>

            <div className="contact-info-card">
              <span className="icon">🕐</span>
              <h6>Service Times</h6>
              <p>
                Thursdays — 5:00pm (GMT +1)
                <br />
                Sundays — 6:30am, 8:00am, 9:30am & 11:00am (GMT +1)
              </p>
            </div>

            <div className="info-divider" />

            {/* MAP */}
            <div className="map-wrap rev">
              <div className="map-corners">
                <div className="c tl" />
                <div className="c tr" />
                <div className="c bl" />
                <div className="c br" />
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.5696671455!2d6.995433614761891!3d4.829107642143528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cfaf80b63961%3A0xab2218e4b62db1f5!2sSalvation%20Ministries%20(Home%20Of%20Success)!5e0!3m2!1sen!2sng!4v1663244567890"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Salvation Ministries Location"
              />
            </div>

            {/* SOCIAL */}
            <div className="social-row rev">
              <a
                href="https://www.facebook.com/smhosglobal"
                target="_blank"
                rel="noreferrer"
                className="soc-btn"
              >
                Fb
              </a>
              <a
                href="https://www.instagram.com/smhosglobal"
                target="_blank"
                rel="noreferrer"
                className="soc-btn"
              >
                Ig
              </a>
              <Link
                href="/livestream"
                target="_blank"
                rel="noreferrer"
                className="soc-btn"
              >
                ▶
              </Link>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="rev-r">
            <div className="form-glass">
              <div className="form-glow" />
              <div className="form-corner tl" />
              <div className="form-corner br" />

              {submitted ? (
                <div className="success-state">
                  <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="success-title">MESSAGE SENT</div>
                  <p className="success-sub">
                    Thank you for reaching out.
                    <br />
                    We'll respond within 24 hours.
                  </p>
                  <div className="success-verse">
                    "Call to Me, and I will answer you, and show you great and
                    mighty things, which you do not know."
                    <br />
                    <br />
                    <span
                      style={{
                        fontFamily: "var(--f-ui)",
                        fontSize: "9px",
                        letterSpacing: "0.45em",
                        color: "var(--gold)",
                      }}
                    >
                      JEREMIAH 33:3
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="s-lbl" style={{ marginBottom: 8 }}>
                    <div className="s-lbl-line" />
                    Ask A Question
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--f-display)",
                      fontSize: "clamp(36px,4vw,56px)",
                      fontWeight: 400,
                      letterSpacing: "0.04em",
                      color: "var(--white)",
                      marginBottom: 40,
                      lineHeight: 1.1,
                    }}
                  >
                    WE'D LOVE TO
                    <br />
                    <span
                      style={{
                        fontStyle: "italic",
                        fontFamily: "var(--f-serif)",
                        background:
                          "linear-gradient(135deg,var(--gold3),var(--gold))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "0.85em",
                      }}
                    >
                      Hear From You
                    </span>
                  </h3>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-input"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-row form-group">
                      <div>
                        <label className="form-label" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-input"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="phone">
                          Phone / Mobile
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="form-input"
                          placeholder="+234 000 000 0000"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row form-group">
                      <div>
                        <label className="form-label" htmlFor="city">
                          City of Residence *
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="form-input"
                          placeholder="Your city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label" htmlFor="country">
                          Country *
                        </label>
                        <select
                          id="country"
                          className="form-input"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        >
                          {COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="message">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        className="form-input"
                        rows="5"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-g" disabled={sending}>
                      {sending ? (
                        <span
                          style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            style={{
                              animation: "diamondSpin 1s linear infinite",
                            }}
                          >
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          SENDING...
                        </span>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <span className="btn-arr">→</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATE SECTION */}
      <section className="locate-section">
        <div className="locate-in">
          <div className="locate-hdr">
            <div>
              <div className="s-lbl rev">
                <div className="s-lbl-line" />
                Find Us
              </div>
              <h2 className="s-h2 rev" style={{ transitionDelay: "0.1s" }}>
                LOCATE
                <br />
                <em>Our Church</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <Link href="/locator" className="btn-gh">
                Find A Branch Near You
              </Link>
            </div>
          </div>

          <div className="locate-card rev">
            <div className="locate-img-wrap">
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAH_zYE5LJf-hftZd9LmJUWKDYdHUtjGKlD8bKUxLupzGB9MdOV4WQO6MhFzd6kNhUbBuaNhnBwNYs19l7rKb9ynhylmB8WAQ10c8vXW8qdoLLx3cH-IAKccDPZofbkWIK8RTvc=s680-w680-h510-rw"
                alt="Salvation Ministries Global HQ"
                className="locate-img"
              />
              <div className="locate-img-over" />
            </div>
            <div className="locate-body">
              <div className="s-lbl">
                <div className="s-lbl-line" />
                Global Headquarters
              </div>
              <h3
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(28px,3.5vw,48px)",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "var(--white)",
                  marginBottom: 8,
                }}
              >
                SALVATION MINISTRIES
              </h3>
              <p
                style={{
                  fontFamily: "var(--f-serif)",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--gold)",
                  marginBottom: 32,
                }}
              >
                Home of Success — Port Harcourt
              </p>
              <div className="locate-meta">
                <div className="locate-col">
                  <h6>Address</h6>
                  <p>
                    Plot 17, Birabi Street, GRA, Phase 1,
                    <br />
                    Port Harcourt, Rivers State, Nigeria.
                  </p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Salvation+Ministries+Plot+17+Birabi+Street+Port+Harcourt"
                    className="btn-gh"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Directions →
                  </a>
                </div>
                <div className="locate-col">
                  <h6>Service Times</h6>
                  <p>
                    Thursdays — 5:00pm (GMT +1)
                    <br />
                    Sundays — 6:30am, 8:00am, 9:30am & 11:00am (GMT +1)
                  </p>
                  <Link
                    to="/locator"
                    className="btn-gh"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Locate A Branch →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT SECTION */}
      <section className="connect-section">
        <div className="connect-glow" />
        <div className="connect-cross-v" />
        <div className="connect-cross-h" />
        <div className="corner-orn tl" />
        <div className="corner-orn tr" />
        <div className="corner-orn bl" />
        <div className="corner-orn br" />
        <Sparkles count={14} />
        <div className="connect-in">
          <div className="s-lbl rev" style={{ justifyContent: "center" }}>
            <div className="s-lbl-line" />
            Follow Us
            <div className="s-lbl-line" style={{ transform: "scaleX(-1)" }} />
          </div>
          <h2
            className="s-h2 rev"
            style={{ textAlign: "center", transitionDelay: "0.1s" }}
          >
            CONNECT WITH
            <br />
            <em>the Kingdom</em>
          </h2>
          <p
            className="s-body rev"
            style={{
              textAlign: "center",
              marginBottom: 48,
              transitionDelay: "0.2s",
            }}
          >
            Check out what we've been up to within the church and our community
            on our Instagram page.
          </p>
          <div className="rev" style={{ transitionDelay: "0.3s" }}>
            <a
              href="https://www.instagram.com/smhosglobal"
              className="btn-gh"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                gap: 14,
                fontSize: 11,
                padding: "20px 52px",
              }}
            >
              Follow @smhosglobal →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sm-footer">
        <div className="ft-top">
          <div>
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
              className="ft-logo"
            />
            <p className="ft-desc">
              Salvation Ministries — Home of Success. Founded 1997. Bringing the
              Kingdom of God to every nation.
            </p>
            <div className="ft-socials">
              <a
                href="https://www.facebook.com/smhosglobal"
                target="_blank"
                rel="noreferrer"
                className="ft-soc"
              >
                Fb
              </a>
              <a
                href="https://www.instagram.com/smhosglobal"
                target="_blank"
                rel="noreferrer"
                className="ft-soc"
              >
                Ig
              </a>
              <Link
                href="/livestream"
                target="_blank"
                rel="noreferrer"
                className="ft-soc"
              >
                ▶
              </Link>
            </div>
          </div>
          <div>
            <div className="ft-col-title">Navigate</div>
            <ul className="ft-links">
              {[
                ["Home", "/"],
                ["Livestream", "/livestream"],
                ["Sermons", "/sermons"],
                ["Events", "/events/"],
                ["Store", "https://smhosstore.com"],
              ].map(([l, h]) => (
                <li key={l}>
                  <a
                    href={h}
                    className="ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-title">Location</div>
            <div className="ft-ci">Plot 17 Birabi Street,</div>
            <div className="ft-ci">GRA Phase 1, Port Harcourt,</div>
            <div className="ft-ci">Rivers, Nigeria.</div>
          </div>
          <div>
            <div className="ft-col-title">Contact</div>
            <div>
              <div className="ft-cl">Phone</div>
              <div className="ft-ci">
                <a href="tel:+2348033123743">+234 (803) 312 3743</a>
              </div>
            </div>
            <div>
              <div className="ft-cl">Email</div>
              <div className="ft-ci">
                <a href="mailto:info@smhos.org">info@smhos.org</a>
              </div>
            </div>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">
            © 2026 Salvation Ministries · All Rights Reserved
          </div>
          <div className="ft-bot-orn">
            <div className="ft-bot-line" />
            <div className="ft-bot-diamond" />
            <div className="ft-bot-line" />
          </div>
          <div className="ft-bot-links">
            <Link
              to="/contact"
              className="ft-bot-link"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </Link>
            <Link
              to="/give"
              className="ft-bot-link"
              target="_blank"
              rel="noreferrer"
            >
              Give
            </Link>
            <a
              href="/about"
              className="ft-bot-link"
              target="_blank"
              rel="noreferrer"
            >
              About
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
