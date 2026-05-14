import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
/* ═══════════════════════════════════════════ CSS ═══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Syncopate:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

@property --fire-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --pulse-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --orb-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

:root{
  --void:#030305;
  --abyss:#06060C;
  --deep:#0A0A14;
  --dark:#0E0E1C;
  --mid:#141428;
  --panel:#181830;
  --card:#1C1C38;
  --lift:#222244;

  --fire:#FF6B1A;
  --fire2:#FF8C44;
  --fire3:#FFAA70;
  --ember:#FF4500;
  --gold:#E8A020;
  --gold2:#F0BC50;
  --gold3:#FAD880;

  --electric:#00F5C8;
  --glow-e:rgba(0,245,200,0.12);

  --white:#FEFCF8;
  --cream:#F5EDDA;
  --muted:#8A8070;
  --dim:#4A4560;
  --faint:#2A2A48;

  --f-display:'Syncopate',sans-serif;
  --f-serif:'Cormorant Garamond',serif;
  --f-ui:'DM Sans',sans-serif;

  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
}

body{background:var(--void);color:var(--white);font-family:var(--f-ui);overflow-x:hidden;}

::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--abyss);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--fire),var(--fire3));border-radius:2px;}

/* ── GRAIN ─────────────────────────────────────────── */
.grain{position:fixed;inset:0;z-index:99994;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:128px;opacity:0.028;mix-blend-mode:overlay;
  animation:grainDrift 0.4s steps(3) infinite;}
@keyframes grainDrift{0%{transform:translate(0,0);}33%{transform:translate(-3px,2px);}66%{transform:translate(3px,-2px);}100%{transform:translate(-1px,3px);}}

/* ── CURSOR ─────────────────────────────────────────── */
.c-dot{position:fixed;pointer-events:none;z-index:99999;width:5px;height:5px;background:var(--fire2);border-radius:50%;transform:translate(-50%,-50%);mix-blend-mode:screen;}
.c-ring{position:fixed;pointer-events:none;z-index:99998;width:32px;height:32px;border:1px solid rgba(255,107,26,0.5);border-radius:50%;transform:translate(-50%,-50%);transition:width 0.3s var(--ease),height 0.3s var(--ease),border-color 0.3s;}
.c-ring.h{width:56px;height:56px;border-color:var(--fire);background:rgba(255,107,26,0.05);}

/* ── LOADER ─────────────────────────────────────────── */
.ldr{position:fixed;inset:0;z-index:99990;background:var(--void);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.8s var(--ease),visibility 0.8s;}
.ldr.gone{opacity:0;visibility:hidden;}
.ldr-flame{width:60px;height:80px;position:relative;margin-bottom:36px;}
.ldr-flame svg{width:100%;height:100%;}
.ldr-name{font-family:var(--f-display);font-size:11px;letter-spacing:0.5em;color:var(--fire2);animation:flamePulse 1.8s ease-in-out infinite;margin-bottom:20px;}
.ldr-track{width:180px;height:1px;background:var(--faint);overflow:hidden;}
.ldr-fill{height:100%;background:linear-gradient(90deg,var(--ember),var(--fire),var(--fire2),var(--fire3));background-size:200%;animation:ldrFill 1.4s ease-in-out infinite;}
@keyframes ldrFill{0%{width:0;margin-left:0;}50%{width:100%;margin-left:0;}100%{width:0;margin-left:100%;}}
@keyframes flamePulse{0%,100%{opacity:1;filter:drop-shadow(0 0 8px var(--fire));}50%{opacity:0.5;filter:none;}}

/* ── NAV ─────────────────────────────────────────────── */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:22px 60px;transition:all 0.5s var(--ease);}
.nav::before{content:'';position:absolute;inset:0;background:transparent;backdrop-filter:blur(0px);transition:all 0.5s;}
.nav.sc{padding:14px 60px;}
.nav.sc::before{background:rgba(3,3,5,0.92);backdrop-filter:blur(32px);border-bottom:1px solid rgba(255,107,26,0.1);}
.nav-logo{position:relative;z-index:1;}
.nav-logo img{height:42px;object-fit:contain;filter:drop-shadow(0 0 12px rgba(255,107,26,0.3));transition:filter 0.4s;}
.nav-logo img:hover{filter:drop-shadow(0 0 24px rgba(255,107,26,0.7));}
.nav-links{display:flex;align-items:center;gap:38px;position:relative;z-index:1;}
.nav-a{font-family:var(--f-ui);font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:rgba(254,252,248,0.55);text-decoration:none;position:relative;padding:3px 0;transition:color 0.3s;}
.nav-a::after{content:'';position:absolute;bottom:-1px;left:50%;right:50%;height:1px;background:var(--fire);transition:left 0.4s var(--ease),right 0.4s var(--ease);}
.nav-a:hover{color:var(--fire2);}
.nav-a:hover::after,.nav-a.active::after{left:0;right:0;}
.nav-a.active{color:var(--fire2);}
.nav-back{display:inline-flex;align-items:center;gap:10px;font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:0.28em;text-transform:uppercase;color:var(--void);background:linear-gradient(135deg,var(--fire2),var(--fire));text-decoration:none;padding:13px 28px;position:relative;overflow:hidden;transition:transform 0.3s,box-shadow 0.3s;box-shadow:0 4px 24px rgba(255,107,26,0.4);}
.nav-back::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);transform:skewX(-20deg);transition:left 0.6s var(--ease);}
.nav-back:hover{transform:translateY(-2px);box-shadow:0 8px 40px rgba(255,107,26,0.6);}
.nav-back:hover::after{left:150%;}

/* ── BURGER ─────────────────────────────────────────── */
.burger{display:none;flex-direction:column;gap:6px;cursor:pointer;background:none;border:none;padding:6px;z-index:1;}
.b-ln{width:26px;height:1.5px;background:var(--white);transition:all 0.4s var(--ease);transform-origin:center;}
.burger.open .b-ln:nth-child(1){transform:translateY(7.5px) rotate(45deg);}
.burger.open .b-ln:nth-child(2){opacity:0;transform:scaleX(0);}
.burger.open .b-ln:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);}
.mob-nav{position:fixed;inset:0;z-index:999;background:var(--abyss);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:translateX(100%);transition:transform 0.7s var(--ease2);}
.mob-nav.open{transform:none;}
.mob-links{display:flex;flex-direction:column;align-items:center;gap:8px;}
.mob-a{font-family:var(--f-display);font-size:clamp(36px,7vw,64px);color:var(--white);text-decoration:none;letter-spacing:0.06em;opacity:0;transform:translateX(40px);transition:color 0.3s,opacity 0.5s,transform 0.5s;}
.mob-nav.open .mob-a{opacity:1;transform:none;}
.mob-nav.open .mob-a:nth-child(1){transition-delay:0.06s;}
.mob-nav.open .mob-a:nth-child(2){transition-delay:0.12s;}
.mob-nav.open .mob-a:nth-child(3){transition-delay:0.18s;}
.mob-nav.open .mob-a:nth-child(4){transition-delay:0.24s;}
.mob-nav.open .mob-a:nth-child(5){transition-delay:0.3s;}
.mob-a:hover{color:var(--fire2);}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
.hero{min-height:100vh;position:relative;display:flex;align-items:center;overflow:hidden;background:var(--void);}
.hero-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}

/* fire godray */
.fire-rays{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
.fire-rays::before{content:'';position:absolute;bottom:-20%;left:50%;transform-origin:bottom center;width:400%;height:180%;transform:translateX(-50%);
  background:conic-gradient(from 270deg at 50% 100%,transparent 0deg,rgba(255,69,0,0.04) 2deg,transparent 4deg,transparent 12deg,rgba(255,107,26,0.05) 14deg,transparent 16deg,transparent 25deg,rgba(255,140,68,0.04) 27deg,transparent 29deg,transparent 38deg,rgba(255,69,0,0.05) 40deg,transparent 42deg,transparent 52deg,rgba(255,107,26,0.035) 54deg,transparent 56deg,transparent 66deg,rgba(255,140,68,0.04) 68deg,transparent 70deg,transparent 80deg,rgba(255,69,0,0.045) 82deg,transparent 84deg,transparent 95deg);
  animation:fireRaysRot 100s linear infinite;}
.fire-rays::after{content:'';position:absolute;bottom:-20%;left:50%;transform-origin:bottom center;width:400%;height:180%;transform:translateX(-50%);
  background:conic-gradient(from 90deg at 50% 100%,transparent 0deg,rgba(255,107,26,0.035) 2.5deg,transparent 5deg,transparent 20deg,rgba(255,140,68,0.03) 22.5deg,transparent 25deg,transparent 48deg,rgba(255,69,0,0.04) 50.5deg,transparent 53deg,transparent 78deg);
  animation:fireRaysRot 65s linear infinite reverse;}
@keyframes fireRaysRot{from{transform:translateX(-50%) rotate(0deg);}to{transform:translateX(-50%) rotate(360deg);}}

.hero-bg{position:absolute;inset:0;background:url('https://smhos.org/wp-content/uploads/2023/02/IMG_2568-scaled-1-1536x1024-1.jpeg') center/cover;opacity:0.08;filter:saturate(0.2);}
.hero-fog{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 100%,rgba(255,69,0,0.1) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 50% 50%,rgba(3,3,5,0.7) 0%,transparent 100%);}

/* pulsing rings from bottom */
.pulse-rings{position:absolute;bottom:0;left:50%;transform:translateX(-50%);pointer-events:none;}
.p-ring{position:absolute;bottom:0;left:50%;transform:translateX(-50%);border-radius:50% 50% 0 0;border:1px solid rgba(255,107,26,0.15);animation:pulseRing 6s ease-out infinite;}
.p-ring:nth-child(1){width:320px;height:160px;animation-delay:0s;border-color:rgba(255,107,26,0.35);}
.p-ring:nth-child(2){width:600px;height:300px;animation-delay:1s;}
.p-ring:nth-child(3){width:900px;height:450px;animation-delay:2s;border-color:rgba(255,107,26,0.08);}
.p-ring:nth-child(4){width:1300px;height:650px;animation-delay:3s;border-color:rgba(255,107,26,0.04);}
@keyframes pulseRing{0%,100%{opacity:1;}50%{opacity:0.3;}}

.hero-content{position:relative;z-index:5;max-width:1400px;margin:0 auto;padding:140px 60px 100px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;width:100%;}

/* left */
.hero-tag{display:flex;align-items:center;gap:14px;margin-bottom:28px;opacity:0;animation:fadeUp 0.9s 0.5s var(--ease) forwards;}
.h-tag-cross{display:flex;align-items:center;gap:8px;font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:0.55em;text-transform:uppercase;color:var(--fire2);}
.h-tag-line{height:1px;width:40px;background:linear-gradient(90deg,var(--fire),transparent);}
.breadcrumb{font-family:var(--f-ui);font-size:10px;letter-spacing:0.25em;color:var(--muted);margin-bottom:36px;opacity:0;animation:fadeUp 0.9s 0.3s var(--ease) forwards;}
.breadcrumb a{color:var(--muted);text-decoration:none;transition:color 0.3s;}
.breadcrumb a:hover{color:var(--fire2);}
.breadcrumb span{color:var(--dim);}

.hero-t1{font-family:var(--f-display);font-size:clamp(48px,7vw,100px);font-weight:700;line-height:0.9;color:var(--white);letter-spacing:0.04em;text-transform:uppercase;opacity:0;animation:fadeUp 1s 0.7s var(--ease) forwards;}
.hero-t1 .fire-word{background:linear-gradient(135deg,var(--ember) 0%,var(--fire) 30%,var(--fire2) 55%,var(--fire3) 80%,var(--gold2) 100%);background-size:200%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:fireShift 4s linear infinite;filter:drop-shadow(0 0 30px rgba(255,107,26,0.5));}
@keyframes fireShift{0%{background-position:0%;}100%{background-position:200%;}}

.hero-sub{font-family:var(--f-serif);font-size:clamp(20px,2.5vw,30px);font-weight:300;font-style:italic;color:rgba(254,252,248,0.4);letter-spacing:0.12em;margin:16px 0 40px;opacity:0;animation:fadeUp 0.9s 0.9s var(--ease) forwards;}
.hero-ctas{display:flex;gap:16px;flex-wrap:wrap;opacity:0;animation:fadeUp 0.9s 1.1s var(--ease) forwards;}
.hero-scroll{display:flex;align-items:center;gap:14px;margin-top:48px;opacity:0;animation:fadeUp 0.9s 1.4s var(--ease) forwards;}
.h-scroll-label{font-family:var(--f-ui);font-size:9px;letter-spacing:0.55em;text-transform:uppercase;color:var(--dim);}
.h-scroll-track{width:48px;height:1px;background:var(--faint);overflow:hidden;position:relative;}
.h-scroll-fill{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,var(--fire),var(--fire3));animation:scrollFill 2.2s ease-in-out infinite;}
@keyframes scrollFill{0%{left:-100%;}100%{left:200%;}}

/* right — hero visual */
.hero-visual{position:relative;display:flex;align-items:center;justify-content:center;opacity:0;animation:fadeRight 1s 0.8s var(--ease) forwards;}
@keyframes fadeRight{from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:none;}}

.hero-img-frame{position:relative;width:100%;max-width:520px;}
.h-img-border{position:absolute;inset:-16px;border:1px solid rgba(255,107,26,0.2);pointer-events:none;z-index:0;}
.h-img-border::before,.h-img-border::after{content:'';position:absolute;width:20px;height:20px;border-color:var(--fire2);border-style:solid;}
.h-img-border::before{top:-1px;right:-1px;border-width:2px 2px 0 0;}
.h-img-border::after{bottom:-1px;left:-1px;border-width:0 0 2px 2px;}
.h-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;position:relative;z-index:1;filter:brightness(0.85) contrast(1.08) saturate(1.1);}
.h-img-glow{position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(3,3,5,0.7) 0%,transparent 50%);pointer-events:none;}

/* floating badge on image */
.h-badge{position:absolute;bottom:-20px;right:-20px;z-index:3;background:var(--fire);padding:16px 22px;display:flex;flex-direction:column;gap:2px;}
.h-badge-main{font-family:var(--f-display);font-size:11px;letter-spacing:0.3em;color:var(--void);font-weight:700;}
.h-badge-sub{font-family:var(--f-ui);font-size:9px;letter-spacing:0.3em;color:rgba(3,3,5,0.6);font-weight:600;text-transform:uppercase;}

/* pastor pill on image */
.h-pastor{position:absolute;top:20px;left:-20px;z-index:3;background:rgba(6,6,12,0.9);border:1px solid rgba(255,107,26,0.3);backdrop-filter:blur(16px);padding:14px 18px;display:flex;align-items:center;gap:12px;}
.h-pastor-dot{width:8px;height:8px;background:var(--fire);border-radius:50%;box-shadow:0 0 10px rgba(255,107,26,0.8);animation:blink 2s ease-in-out infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
.h-pastor-info{display:flex;flex-direction:column;gap:2px;}
.h-pastor-name{font-family:var(--f-ui);font-size:11px;font-weight:600;color:var(--white);}
.h-pastor-role{font-family:var(--f-ui);font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:var(--fire2);}

@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:none;}}

/* ── REVEAL ────────────────────────────────────────── */
.rev{opacity:0;transform:translateY(44px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev.vis{opacity:1;transform:none;}
.rev-l{opacity:0;transform:translateX(-44px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-l.vis{opacity:1;transform:none;}
.rev-r{opacity:0;transform:translateX(44px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-r.vis{opacity:1;transform:none;}

/* ── TICKER ────────────────────────────────────────── */
.ticker{padding:13px 0;overflow:hidden;background:linear-gradient(90deg,var(--ember),var(--fire),var(--fire2),var(--fire3),var(--fire2),var(--fire),var(--ember));background-size:300%;animation:tickerShimmer 5s linear infinite;}
@keyframes tickerShimmer{0%{background-position:0%;}100%{background-position:300%;}}
.ticker-inner{display:flex;white-space:nowrap;animation:tickX 22s linear infinite;}
.t-item{display:flex;align-items:center;gap:24px;padding:0 24px;font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--void);flex-shrink:0;}
.t-sep{width:4px;height:4px;background:rgba(3,3,5,0.35);border-radius:50%;}
@keyframes tickX{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── SECTION COMMONS ───────────────────────────────── */
.sec-lbl{display:flex;align-items:center;gap:12px;font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--fire2);margin-bottom:14px;}
.sec-lbl-line{flex:0 0 32px;height:1px;background:var(--fire);}
.sec-h{font-family:var(--f-display);font-size:clamp(40px,6vw,80px);font-weight:700;line-height:0.9;letter-spacing:0.04em;color:var(--white);margin-bottom:20px;}
.sec-h em{font-style:normal;font-family:var(--f-serif);font-weight:400;font-style:italic;font-size:0.9em;background:linear-gradient(135deg,var(--fire2),var(--fire3));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
.sec-div{width:52px;height:2px;background:linear-gradient(90deg,var(--fire),transparent);margin:24px 0;position:relative;}
.sec-div::after{content:'✦';position:absolute;left:58px;top:50%;transform:translateY(-50%);font-size:9px;color:var(--fire2);opacity:0.5;}
.sec-body{font-family:var(--f-ui);font-size:16px;font-weight:300;line-height:1.9;color:var(--muted);}

/* ── BUTTONS ───────────────────────────────────────── */
.btn-fire{display:inline-flex;align-items:center;gap:12px;font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--void);background:linear-gradient(135deg,var(--fire2),var(--fire));text-decoration:none;padding:17px 40px;position:relative;overflow:hidden;transition:transform 0.3s var(--ease),box-shadow 0.3s;box-shadow:0 6px 32px rgba(255,107,26,0.4);}
.btn-fire::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--fire3),var(--fire2));opacity:0;transition:opacity 0.3s;}
.btn-fire::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.btn-fire:hover{transform:translateY(-3px);box-shadow:0 14px 56px rgba(255,107,26,0.6);}
.btn-fire:hover::before{opacity:1;}
.btn-fire:hover::after{left:150%;}
.btn-fire span,.btn-ghost span{position:relative;z-index:1;}
.btn-arr{position:relative;z-index:1;transition:transform 0.3s;}
.btn-fire:hover .btn-arr,.btn-ghost:hover .btn-arr{transform:translateX(5px);}
.btn-ghost{display:inline-flex;align-items:center;gap:12px;font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--fire2);text-decoration:none;padding:16px 40px;border:1.5px solid rgba(255,107,26,0.4);background:transparent;position:relative;overflow:hidden;transition:all 0.3s var(--ease);}
.btn-ghost::before{content:'';position:absolute;inset:0;background:rgba(255,107,26,0.07);opacity:0;transition:opacity 0.3s;}
.btn-ghost:hover{border-color:var(--fire);color:var(--fire3);box-shadow:0 0 28px rgba(255,107,26,0.15);}
.btn-ghost:hover::before{opacity:1;}

/* ── ABOUT / MANDATE ───────────────────────────────── */
.about{background:var(--deep);padding:140px 0;position:relative;overflow:hidden;}
.about::before{content:'YOUTH';position:absolute;bottom:-60px;right:-40px;font-family:var(--f-display);font-size:clamp(140px,20vw,260px);color:transparent;-webkit-text-stroke:1px rgba(255,107,26,0.04);pointer-events:none;line-height:1;user-select:none;letter-spacing:0.08em;}
.about-in{max-width:1400px;margin:0 auto;padding:0 60px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;}
.a-img-wrap{position:relative;}
.a-img-frame{position:absolute;top:-20px;left:-20px;right:20px;bottom:20px;border:1px solid rgba(255,107,26,0.15);}
.a-img-frame::before,.a-img-frame::after{content:'';position:absolute;width:18px;height:18px;border-color:var(--fire2);border-style:solid;}
.a-img-frame::before{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.a-img-frame::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.a-img{width:100%;height:580px;object-fit:cover;display:block;position:relative;z-index:1;filter:brightness(0.88) contrast(1.05);}
.a-img-wrap:hover .a-img{filter:brightness(1) contrast(1.08) saturate(1.1);}
.a-img-wrap{overflow:visible;}
.a-img-wrap::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,107,26,0.06),transparent);z-index:2;pointer-events:none;}
.a-tag{position:absolute;bottom:-16px;right:-16px;z-index:3;background:linear-gradient(135deg,var(--fire),var(--ember));color:var(--void);font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;padding:13px 20px;}
.highlight-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:40px;}
.h-item{padding:24px 20px;background:rgba(255,107,26,0.05);border:1px solid rgba(255,107,26,0.12);position:relative;overflow:hidden;transition:background 0.4s,border-color 0.4s;}
.h-item::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,var(--fire),transparent);transform:scaleX(0);transform-origin:left;transition:transform 0.5s var(--ease);}
.h-item:hover::before{transform:scaleX(1);}
.h-item:hover{background:rgba(255,107,26,0.09);border-color:rgba(255,107,26,0.25);}
.h-icon{font-size:20px;margin-bottom:12px;display:block;}
.h-title{font-family:var(--f-ui);font-size:13px;font-weight:600;color:var(--fire2);letter-spacing:0.15em;margin-bottom:8px;text-transform:uppercase;}
.h-desc{font-family:var(--f-ui);font-size:13px;font-weight:300;color:var(--muted);line-height:1.7;}

/* ── GALLERY / CAROUSEL ────────────────────────────── */
.gallery{background:var(--abyss);padding:120px 0;overflow:hidden;}
.gallery-in{max-width:1400px;margin:0 auto;padding:0 60px;}
.gallery-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:56px;}
.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:auto auto;gap:3px;}
.g-item{position:relative;overflow:hidden;cursor:pointer;}
.g-item:nth-child(1){grid-row:span 2;aspect-ratio:2/3;}
.g-item:nth-child(2),.g-item:nth-child(3),.g-item:nth-child(4){aspect-ratio:4/3;}
.g-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.75) saturate(0.85);transition:transform 0.8s var(--ease),filter 0.5s;}
.g-item:hover .g-img{transform:scale(1.08);filter:brightness(0.5) saturate(0.6);}
.g-over{position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,5,0.9) 0%,transparent 50%);}
.g-fire-line{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--fire),var(--fire2),var(--fire),transparent);transform:scaleX(0);transform-origin:center;transition:transform 0.5s var(--ease);}
.g-item:hover .g-fire-line{transform:scaleX(1);}
.g-label{position:absolute;bottom:20px;left:20px;font-family:var(--f-display);font-size:14px;letter-spacing:0.2em;color:var(--white);opacity:0;transform:translateY(10px);transition:opacity 0.4s,transform 0.4s;}
.g-item:hover .g-label{opacity:1;transform:none;}
.g-counter{position:absolute;top:16px;right:16px;font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:0.35em;color:var(--fire2);background:rgba(3,3,5,0.7);padding:6px 12px;border:1px solid rgba(255,107,26,0.2);backdrop-filter:blur(8px);opacity:0;transition:opacity 0.4s;}
.g-item:hover .g-counter{opacity:1;}

/* ── HIGHLIGHTS / CARDS ────────────────────────────── */
.highlights{background:var(--dark);padding:140px 0;position:relative;overflow:hidden;}
.highlights::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(255,107,26,0.04) 0%,transparent 70%);}
.highlights-bg-txt{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--f-display);font-size:clamp(180px,28vw,360px);color:transparent;-webkit-text-stroke:1px rgba(255,107,26,0.025);white-space:nowrap;pointer-events:none;user-select:none;letter-spacing:0.08em;}
.highlights-in{max-width:1400px;margin:0 auto;padding:0 60px;}
.hl-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:72px;}
.hl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--faint);}

/* ── FIRE CARDS ────────────────────────────────────── */
.f-card{background:var(--panel);padding:52px 40px 48px;position:relative;overflow:hidden;transition:background 0.4s,transform 0.4s var(--ease3);}
.f-card-inner-glow{position:absolute;inset:0;background:radial-gradient(ellipse 120% 120% at 50% 110%,rgba(255,107,26,0.12) 0%,transparent 60%);opacity:0;transition:opacity 0.5s;}
.f-card:hover{background:var(--card);transform:translateY(-5px);}
.f-card:hover .f-card-inner-glow{opacity:1;}
.f-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--fire),transparent);transform:scaleX(0);transform-origin:left;transition:transform 0.6s var(--ease);}
.f-card:hover::before{transform:scaleX(1);}
.f-num{font-family:var(--f-display);font-size:9px;letter-spacing:0.5em;color:var(--fire);margin-bottom:40px;display:block;}
.f-icon-wrap{width:52px;height:52px;border:1px solid rgba(255,107,26,0.25);display:flex;align-items:center;justify-content:center;margin-bottom:36px;transition:all 0.4s;color:var(--fire2);font-size:22px;}
.f-card:hover .f-icon-wrap{border-color:var(--fire);background:rgba(255,107,26,0.1);transform:rotate(45deg);box-shadow:0 0 24px rgba(255,107,26,0.3);}
.f-title{font-family:var(--f-display);font-size:20px;color:var(--white);line-height:1.2;margin-bottom:16px;letter-spacing:0.06em;transition:color 0.3s;}
.f-card:hover .f-title{color:var(--fire2);}
.f-desc{font-family:var(--f-ui);font-size:14px;font-weight:300;color:var(--muted);line-height:1.8;margin-bottom:28px;}
.f-bar{width:28px;height:1.5px;background:linear-gradient(90deg,var(--fire),transparent);transition:width 0.5s var(--ease);}
.f-card:hover .f-bar{width:52px;}

/* ── SCHEDULE / INFO ───────────────────────────────── */
.schedule{background:var(--panel);padding:0;border-top:1px solid rgba(255,107,26,0.1);border-bottom:1px solid rgba(255,107,26,0.1);}
.schedule-in{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;}
.sched-block{padding:72px 60px;position:relative;overflow:hidden;}
.sched-block+.sched-block{border-left:1px solid rgba(255,107,26,0.08);}
.sched-block::after{content:'';position:absolute;top:0;right:0;bottom:0;width:1px;background:linear-gradient(transparent,rgba(255,107,26,0.2),transparent);animation:schedLine 4s ease-in-out infinite;}
@keyframes schedLine{0%,100%{opacity:0.3;}50%{opacity:1;}}
.sched-block:last-child::after{display:none;}
.sched-lbl{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--fire2);margin-bottom:18px;display:flex;align-items:center;gap:10px;}
.sched-dot{width:6px;height:6px;background:var(--fire);border-radius:50%;box-shadow:0 0 8px rgba(255,107,26,0.6);}
.sched-value{font-family:var(--f-serif);font-size:clamp(26px,3.5vw,42px);color:var(--white);line-height:1.3;font-weight:400;}
.sched-note{font-family:var(--f-ui);font-size:12px;font-weight:300;color:var(--dim);margin-top:12px;letter-spacing:0.1em;}
.sched-addr{font-family:var(--f-ui);font-size:14px;font-weight:300;color:var(--muted);line-height:1.9;}

/* ── PASTOR ────────────────────────────────────────── */
.pastor-sec{background:var(--abyss);padding:140px 0;position:relative;overflow:hidden;}
.pastor-sec::before{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--fire),var(--fire2),var(--fire),transparent);}
.pastor-in{max-width:1400px;margin:0 auto;padding:0 60px;display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;}
.p-img-frame{position:relative;}
.p-img-corner{position:absolute;width:22px;height:22px;border-color:var(--fire);border-style:solid;z-index:2;}
.p-img-corner.tl{top:-1px;left:-1px;border-width:2.5px 0 0 2.5px;}
.p-img-corner.br{bottom:-1px;right:-1px;border-width:0 2.5px 2.5px 0;}
.p-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;filter:brightness(0.8) saturate(0.9);transition:filter 0.6s;}
.p-img-frame:hover .p-img{filter:brightness(0.92) saturate(1);}
.p-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,5,0.6) 0%,transparent 60%);}
.p-name-over{position:absolute;bottom:24px;left:24px;z-index:2;}
.p-name-over-n{font-family:var(--f-display);font-size:20px;letter-spacing:0.1em;color:var(--white);}
.p-name-over-r{font-family:var(--f-ui);font-size:9px;letter-spacing:0.4em;text-transform:uppercase;color:var(--fire2);margin-top:4px;}
.p-quote-mark{font-family:var(--f-serif);font-size:100px;color:rgba(255,107,26,0.18);line-height:1;margin-bottom:-24px;display:block;}
.p-quote{font-family:var(--f-serif);font-size:clamp(18px,2.2vw,26px);font-style:italic;font-weight:300;color:var(--white);line-height:1.8;border-left:2.5px solid var(--fire);padding-left:28px;margin-bottom:36px;}
.p-sig{display:flex;flex-direction:column;gap:4px;}
.p-sig-name{font-family:var(--f-display);font-size:22px;letter-spacing:0.06em;color:var(--white);}
.p-sig-role{font-family:var(--f-ui);font-size:9px;letter-spacing:0.4em;text-transform:uppercase;color:var(--fire2);}
.p-sig-div{width:44px;height:1.5px;background:rgba(255,107,26,0.4);margin:14px 0;}

/* ── VERSE BANNER ──────────────────────────────────── */
.v-banner{background:var(--deep);padding:100px 60px;text-align:center;position:relative;overflow:hidden;border-top:1px solid rgba(255,107,26,0.08);border-bottom:1px solid rgba(255,107,26,0.08);}
.v-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 200% at 50% 50%,rgba(255,107,26,0.05) 0%,transparent 100%);}
.v-banner::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 3px);pointer-events:none;}
.v-inner{max-width:900px;margin:0 auto;position:relative;z-index:1;}
.v-icon{font-family:var(--f-serif);font-size:120px;color:rgba(255,107,26,0.12);line-height:1;margin-bottom:-30px;display:block;}
.v-text{font-family:var(--f-serif);font-size:clamp(22px,3.5vw,40px);font-style:italic;font-weight:300;color:var(--white);line-height:1.5;margin-bottom:28px;}
.v-ref{font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:0.5em;text-transform:uppercase;color:var(--fire2);}

/* ── CTA ───────────────────────────────────────────── */
.cta-sec{background:var(--void);padding:160px 60px;text-align:center;position:relative;overflow:hidden;}
.cta-sec::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(255,107,26,0.025) 1px,transparent 1px),linear-gradient(-45deg,rgba(255,107,26,0.025) 1px,transparent 1px);background-size:56px 56px;}
.cta-glow-floor{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:1000px;height:400px;background:radial-gradient(ellipse 80% 100% at 50% 100%,rgba(255,107,26,0.1) 0%,transparent 70%);pointer-events:none;}
.cta-inner{position:relative;z-index:2;max-width:900px;margin:0 auto;}
.cta-eyebrow{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--fire2);margin-bottom:20px;display:flex;align-items:center;justify-content:center;gap:16px;}
.cta-e-line{height:1px;width:40px;background:linear-gradient(90deg,transparent,var(--fire));}
.cta-e-line.r{background:linear-gradient(90deg,var(--fire),transparent);}
.cta-title{font-family:var(--f-display);font-size:clamp(52px,9vw,120px);font-weight:700;line-height:0.9;letter-spacing:0.04em;color:var(--white);margin-bottom:14px;text-transform:uppercase;}
.cta-title em{font-style:normal;display:block;background:linear-gradient(135deg,var(--fire2),var(--fire3));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 30px rgba(255,107,26,0.45));}
.cta-sub{font-family:var(--f-serif);font-size:20px;font-style:italic;font-weight:300;color:var(--muted);margin-bottom:64px;}
.cta-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;}

/* ── RELATED MINISTRIES ────────────────────────────── */
.related{background:var(--deep);padding:120px 0;}
.related-in{max-width:1400px;margin:0 auto;padding:0 60px;}
.rel-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin-top:64px;}
.rel-card{position:relative;overflow:hidden;display:block;text-decoration:none;aspect-ratio:16/9;}
.rel-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.5) saturate(0.7);transition:transform 0.9s var(--ease),filter 0.6s;}
.rel-card:hover .rel-img{transform:scale(1.08);filter:brightness(0.3) saturate(0.5);}
.rel-over{position:absolute;inset:0;background:linear-gradient(to top,rgba(3,3,5,0.95) 0%,transparent 60%);}
.rel-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 100%,rgba(255,107,26,0.18) 0%,transparent 70%);opacity:0;transition:opacity 0.5s;}
.rel-card:hover .rel-glow{opacity:1;}
.rel-fire-line{position:absolute;bottom:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,var(--fire),var(--fire2),var(--fire),transparent);transform:scaleX(0);transform-origin:center;transition:transform 0.6s var(--ease);}
.rel-card:hover .rel-fire-line{transform:scaleX(1);}
.rel-content{position:absolute;bottom:0;left:0;right:0;padding:44px 40px;}
.rel-min-lbl{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--fire2);margin-bottom:12px;opacity:0;transform:translateY(8px);transition:opacity 0.4s 0.1s,transform 0.4s 0.1s;}
.rel-card:hover .rel-min-lbl{opacity:1;transform:none;}
.rel-title{font-family:var(--f-display);font-size:clamp(24px,3vw,36px);letter-spacing:0.06em;color:var(--white);}
.rel-arr{display:flex;align-items:center;gap:12px;font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;color:var(--fire);margin-top:16px;opacity:0;transform:translateY(8px);transition:opacity 0.4s 0.15s,transform 0.4s 0.15s;}
.rel-card:hover .rel-arr{opacity:1;transform:none;}
.rel-arr-line{width:28px;height:1.5px;background:var(--fire);}

/* ── FOOTER ────────────────────────────────────────── */
.footer{background:var(--abyss);border-top:1px solid rgba(255,107,26,0.12);padding:100px 60px 0;position:relative;}
.footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--fire),var(--fire2),var(--fire),transparent);}
.ft-top{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2.5fr 1fr 1fr 1fr;gap:72px;padding-bottom:72px;border-bottom:1px solid rgba(255,107,26,0.08);}
.ft-logo{height:42px;margin-bottom:24px;filter:drop-shadow(0 0 8px rgba(255,107,26,0.2));}
.ft-desc{font-family:var(--f-ui);font-size:14px;font-weight:300;font-style:italic;color:var(--muted);line-height:1.9;max-width:280px;margin-bottom:28px;}
.ft-socials{display:flex;gap:10px;}
.ft-soc{width:42px;height:42px;border:1px solid rgba(255,107,26,0.2);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:11px;text-decoration:none;transition:all 0.3s;font-family:var(--f-ui);font-weight:700;}
.ft-soc:hover{border-color:var(--fire);color:var(--fire);background:rgba(255,107,26,0.08);transform:translateY(-3px);}
.ft-col-title{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--fire2);margin-bottom:28px;padding-bottom:14px;border-bottom:1px solid rgba(255,107,26,0.1);}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:14px;}
.ft-link{font-family:var(--f-ui);font-size:14px;font-weight:300;color:var(--muted);text-decoration:none;transition:color 0.3s;display:flex;align-items:center;gap:8px;}
.ft-link::before{content:'';width:0;height:1px;background:var(--fire);transition:width 0.3s;}
.ft-link:hover{color:var(--fire2);}
.ft-link:hover::before{width:16px;}
.ft-bot{max-width:1400px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:28px 0;gap:16px;}
.ft-copy{font-family:var(--f-ui);font-size:9px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:var(--dim);}
.ft-orn{display:flex;align-items:center;gap:12px;}
.ft-orn-line{height:1px;width:36px;background:rgba(255,107,26,0.15);}
.ft-orn-cross{font-size:10px;color:var(--fire);opacity:0.6;}
.ft-bot-links{display:flex;gap:28px;}
.ft-bot-link{font-family:var(--f-ui);font-size:9px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:var(--dim);text-decoration:none;transition:color 0.3s;}
.ft-bot-link:hover{color:var(--fire2);}

/* ── MARQUEE ───────────────────────────────────────── */
.marquee-row{overflow:hidden;border-top:1px solid rgba(255,107,26,0.08);border-bottom:1px solid rgba(255,107,26,0.08);padding:18px 0;background:var(--abyss);}
.marquee-inner{display:flex;gap:0;white-space:nowrap;animation:marqueeX 18s linear infinite;}
.m-item{font-family:var(--f-display);font-size:clamp(56px,8vw,100px);color:transparent;-webkit-text-stroke:1px rgba(255,107,26,0.15);letter-spacing:0.08em;padding:0 36px;flex-shrink:0;transition:color 0.3s,-webkit-text-stroke 0.3s;}
.m-item:hover{color:var(--fire2);-webkit-text-stroke:1px var(--fire);}
@keyframes marqueeX{0%{transform:none;}100%{transform:translateX(-50%);}}

/* ── SPARKLES ──────────────────────────────────────── */
@keyframes spkAnim{0%{opacity:0;transform:translateY(0) scale(0);}15%{opacity:1;transform:translateY(-16px) scale(1);}85%{opacity:0.8;}100%{opacity:0;transform:translateY(var(--sy,-70px)) scale(0.4);}}
.spk{position:absolute;pointer-events:none;color:var(--fire2);animation:spkAnim var(--dur,3s) var(--del,0s) ease-in-out infinite;opacity:0;font-size:var(--sz,10px);}

/* ── RESPONSIVE ────────────────────────────────────── */
@media(max-width:1200px){
  .hero-content,.about-in,.pastor-in{grid-template-columns:1fr;gap:64px;}
  .hero-visual{justify-content:flex-start;}
  .hl-grid{grid-template-columns:1fr 1fr;}
  .schedule-in{grid-template-columns:1fr;}
  .sched-block+.sched-block{border-left:none;border-top:1px solid rgba(255,107,26,0.08);}
  .ft-top{grid-template-columns:1fr 1fr;gap:40px;}
  .rel-grid{grid-template-columns:1fr;}
}
@media(max-width:900px){
  .nav{padding:16px 24px;}.nav.sc{padding:12px 24px;}
  .nav-links{display:none;}.burger{display:flex;}
  .about-in,.gallery-in,.highlights-in,.related-in,.pastor-in{padding:0 24px;}
  .about,.highlights,.pastor-sec,.related{padding:90px 0;}
  .cta-sec,.footer{padding:90px 24px 0;}
  .hl-grid,.rel-grid{grid-template-columns:1fr;}
  .gallery-grid{grid-template-columns:1fr 1fr;}.g-item:nth-child(1){grid-row:auto;aspect-ratio:4/3;}
  .ft-top{grid-template-columns:1fr;}.ft-bot{flex-direction:column;text-align:center;padding:24px;}
  .hero-content{padding:120px 24px 80px;gap:40px;}
  .hero-t1{font-size:clamp(40px,10vw,72px);}
  .v-banner{padding:72px 24px;}
  .schedule-in>*{padding:52px 24px;}
}
@media(max-width:600px){
  .hl-grid{grid-template-columns:1fr;}
  .hero-ctas{gap:10px;}
  .btn-fire,.btn-ghost{padding:15px 22px;}
  .ft-top{grid-template-columns:1fr;}
}
img{max-width:100%;height:auto;}
@media(prefers-reduced-motion:reduce){*{animation-duration:0.001ms !important;transition-duration:0.001ms !important;}}
`;

/* ──────────────── CONSTANTS ─────────────────── */
const NAV = [
  { label: "Home", href: "/" },
  { label: "Ministries", href: "#" },
  { label: "Events", href: "/events" },
  { label: "Sermons", href: "/sermons" },
  { label: "Contact", href: "/contacts" },
];

const GALLERY_IMGS = [
  {
    src: "https://smhos.org/wp-content/uploads/2023/02/G88A7357-1024x683.jpg",
    label: "Worship Night",
  },
  {
    src: "https://smhos.org/wp-content/uploads/2023/02/DSC01674-1024x683.jpg",
    label: "Youth Sessions",
  },
  {
    src: "https://smhos.org/wp-content/uploads/2023/02/IMG_9734-1024x683.jpg",
    label: "Community",
  },
  {
    src: "https://smhos.org/wp-content/uploads/2023/02/IMG_9710x-1024x683.jpg",
    label: "Empowerment",
  },
];

const HIGHLIGHTS = [
  {
    num: "01",
    icon: "⚡",
    title: "INTERACTIVE SESSIONS",
    desc: "Discussions and teachings that address real-life challenges young people face daily.",
  },
  {
    num: "02",
    icon: "✦",
    title: "SKILL DEVELOPMENT",
    desc: "Workshops and programs designed to harness your God-given talents and abilities.",
  },
  {
    num: "03",
    icon: "◈",
    title: "COMMUNITY ENGAGEMENT",
    desc: "Initiatives that encourage giving back, making a difference where you are.",
  },
];

const RELATED = [
  {
    label: "Campus Ministry",
    img: "https://smhos.org/wp-content/uploads/2023/02/IMG_0109-1024x683.jpg",
    href: "/ministry/campus/",
  },
  {
    label: "Leading Lights",
    img: "https://smhos.org/wp-content/uploads/2023/02/IMG_7682x-1024x683.jpg",
    href: "/ministry/children/",
  },
];

const TICKERS = [
  "Youth Ministry",
  "Home of Success",
  "Salvation Ministries",
  "Live. Bold. Fearless.",
  "Empowered for Purpose",
  "Port Harcourt · Nigeria",
  "Since 1997",
];

const SPARKLE_DATA = Array.from({ length: 12 }, (_, i) => ({
  left: `${8 + i * 8}%`,
  bottom: `${10 + Math.random() * 30}%`,
  sy: `${-(40 + i * 5)}px`,
  sz: `${8 + (i % 3) * 3}px`,
  dur: `${2.5 + (i % 4) * 0.7}s`,
  del: `${(i % 5) * 0.6}s`,
  sym: ["✦", "✧", "◆", "·", "★"][i % 5],
}));

/* ─────────────────── HOOKS ─────────────────── */
function useScrolled(t = 50) {
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

/* ─────────────────── PARTICLE CANVAS ──────── */
function ParticleCanvas() {
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
    const N = 55;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.3 + 0.06),
      alpha: Math.random() * 0.45 + 0.1,
      life: Math.random(),
      hue: 15 + Math.random() * 25,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.0025;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * c.width;
          p.y = c.height + 5;
          p.life = 0;
        }
        const fade = Math.sin(p.life * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,65%,${p.alpha * fade})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="hero-canvas" />;
}

/* ─────────────────── FLAME SVG ───────────── */
function FlameSVG({ size = 48, animate = false }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 48 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="fg1"
          x1="24"
          y1="62"
          x2="24"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="40%" stopColor="#FF6B1A" />
          <stop offset="75%" stopColor="#FF8C44" />
          <stop offset="100%" stopColor="#FFAA70" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient
          id="fg2"
          x1="24"
          y1="62"
          x2="24"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#E8A020" />
          <stop offset="60%" stopColor="#F0BC50" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FAD880" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M24 2C24 2 38 16 38 30C38 42.15 32.08 50 24 50C15.92 50 10 42.15 10 30C10 16 24 2 24 2Z"
        fill="url(#fg1)"
        style={
          animate ? { animation: "flamePulse 1.8s ease-in-out infinite" } : {}
        }
      />
      <path
        d="M24 18C24 18 32 26 32 34C32 39.52 28.42 44 24 44C19.58 44 16 39.52 16 34C16 26 24 18 24 18Z"
        fill="url(#fg2)"
        opacity="0.85"
      />
      <ellipse cx="24" cy="50" rx="12" ry="4" fill="#FF4500" opacity="0.3" />
    </svg>
  );
}

/* ─────────────────── CURSOR ────────────────── */
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
      const is = e.target.closest("a,button,[role='button']");
      ring.current?.classList.toggle("h", !!is);
    };
    const loop = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
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
      <div className="c-dot" ref={dot} />
      <div className="c-ring" ref={ring} />
    </>
  );
}

/* ─────────────────── LOADER ────────────────── */
function Loader({ done }) {
  return (
    <div className={`ldr${done ? " gone" : ""}`}>
      <div className="ldr-flame">
        <FlameSVG size={60} animate />
      </div>
      <div className="ldr-name">Youth Ministry</div>
      <div className="ldr-track">
        <div className="ldr-fill" />
      </div>
    </div>
  );
}

/* ─────────────────── SPARKLES ──────────────── */
function Sparkles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {SPARKLE_DATA.map((s, i) => (
        <span
          key={i}
          className="spk"
          style={{
            left: s.left,
            bottom: s.bottom,
            "--sy": s.sy,
            "--sz": s.sz,
            "--dur": s.dur,
            "--del": s.del,
          }}
        >
          {s.sym}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────── MAGNETIC BTN ──────────── */
function MagBtn({ href, className, children, target = "_blank" }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    el.style.transform = `translate(${x}px,${y}px) translateY(-3px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      target={target}
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 0.4s var(--ease3),box-shadow 0.3s",
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {children}
    </a>
  );
}

/* ═══════════════ MAIN EXPORT ════════════════ */
export default function YouthMinistry() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2200);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="grain" />
      {!isTouch && <Cursor />}
      <Loader done={loaded} />

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " sc" : ""}`}>
        <div className="nav-logo">
          <Link to="/">
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
            />
          </Link>
        </div>
        <div className="nav-links">
          {NAV.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="nav-a"
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/give"
            className="nav-back"
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
          <span className="b-ln" />
          <span className="b-ln" />
          <span className="b-ln" />
        </button>
      </nav>

      {/* ── MOBILE NAV ── */}
      <div className={`mob-nav${menuOpen ? " open" : ""}`}>
        <div className="mob-links">
          {[...NAV, { label: "Give", href: "/give" }].map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="mob-a"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero">
        <ParticleCanvas />
        <div className="hero-bg" />
        <div className="fire-rays" />
        <div className="hero-fog" />
        <div className="pulse-rings">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-ring" />
          ))}
        </div>

        <div className="hero-content">
          {/* LEFT */}
          <div>
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span> │ </span>
              <span>Youth Ministry</span>
            </div>
            <div className="hero-tag">
              <div className="h-tag-cross">
                <div className="h-tag-line" />
                Salvation Ministries
                <div
                  className="h-tag-line"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,var(--fire))",
                    transform: "scaleX(-1)",
                  }}
                />
              </div>
            </div>
            <h1 className="hero-t1">
              YOUTH
              <br />
              <span className="fire-word">MINISTRY</span>
            </h1>
            <p className="hero-sub">
              Empowered for Purpose. Ignited for Glory.
            </p>
            <div className="hero-ctas">
              <MagBtn href="/events" className="btn-fire">
                <span>Join Us</span>
                <span className="btn-arr">→</span>
              </MagBtn>
              <MagBtn href="/live" className="btn-ghost">
                <span>Watch Live</span>
                <span className="btn-arr">→</span>
              </MagBtn>
            </div>
            <div className="hero-scroll">
              <div className="h-scroll-label">Scroll</div>
              <div className="h-scroll-track">
                <div className="h-scroll-fill" />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-visual">
            <div className="hero-img-frame">
              <div className="h-img-border" />
              <img
                src="https://smhos.org/wp-content/uploads/2023/02/G88A7357-1024x683.jpg"
                alt="Youth Ministry"
                className="h-img"
              />
              <div className="h-img-glow" />
              <div className="h-badge">
                <div className="h-badge-main">EST. 1997</div>
                <div className="h-badge-sub">Port Harcourt · Nigeria</div>
              </div>
              <div className="h-pastor">
                <div className="h-pastor-dot" />
                <div className="h-pastor-info">
                  <div className="h-pastor-name">Pst. Christian George</div>
                  <div className="h-pastor-role">Youth Ministry Pastor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...TICKERS, ...TICKERS].map((item, i) => (
            <div key={i} className="t-item">
              <span className="t-sep" />
              {item}
              <span className="t-sep" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section className="about">
        <div className="about-in">
          <div className="rev-l">
            <div className="a-img-wrap">
              <div className="a-img-frame" />
              <img
                src="https://smhos.org/wp-content/uploads/2023/02/DSC01674-1024x683.jpg"
                alt="Youth Ministry"
                className="a-img"
              />
              <div className="a-tag">Ignited · Equipped · Sent</div>
            </div>
          </div>
          <div className="rev-r">
            <div className="sec-lbl">
              <div className="sec-lbl-line" />
              Welcome
            </div>
            <h2 className="sec-h">
              YOUNG. BOLD.
              <br />
              <em>On Fire for God.</em>
            </h2>
            <div className="sec-div" />
            <p className="sec-body" style={{ marginBottom: 28 }}>
              Our Youth Ministry is a dynamic space where energy meets purpose.
              Designed for young individuals navigating life's pivotal stages,
              we focus on empowering youths to live out their faith boldly.
            </p>
            <p className="sec-body" style={{ marginBottom: 40 }}>
              Be part of a community that inspires, equips, and propels you
              towards your God-given destiny. This is not just a ministry — it's
              a movement.
            </p>
            <div className="highlight-grid">
              {HIGHLIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="h-item rev"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <span className="h-icon">{h.icon}</span>
                  <div className="h-title">{h.title}</div>
                  <div className="h-desc">{h.desc}</div>
                </div>
              ))}
              <div
                className="h-item rev"
                style={{
                  transitionDelay: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <FlameSVG size={36} />
                </div>
                <div
                  className="h-title"
                  style={{ textAlign: "center", fontSize: 11 }}
                >
                  Join the Fire
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-row">
        <div className="marquee-inner">
          {[
            "FAITH",
            "FIRE",
            "GLORY",
            "PURPOSE",
            "VICTORY",
            "POWER",
            "FAITH",
            "FIRE",
            "GLORY",
            "PURPOSE",
            "VICTORY",
            "POWER",
          ].map((w, i) => (
            <span key={i} className="m-item">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════ GALLERY ═══════════════ */}
      <section className="gallery">
        <div className="gallery-in">
          <div className="gallery-hdr">
            <div>
              <div className="sec-lbl rev">
                <div className="sec-lbl-line" />
                Our Moments
              </div>
              <h2 className="sec-h rev" style={{ transitionDelay: "0.1s" }}>
                LIFE IN THE
                <br />
                <em>Youth Ministry</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <p
                className="sec-body"
                style={{ maxWidth: 320, textAlign: "right" }}
              >
                Real moments. Real transformation. Real community.
              </p>
            </div>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMGS.map((img, i) => (
              <div
                key={i}
                className="g-item rev"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <img src={img.src} alt={img.label} className="g-img" />
                <div className="g-over" />
                <div className="g-fire-line" />
                <div className="g-label">{img.label}</div>
                <div className="g-counter">0{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HIGHLIGHTS ═══════════════ */}
      <section className="highlights">
        <div className="highlights-bg-txt" aria-hidden>
          FIRE
        </div>
        <div className="highlights-in">
          <div className="hl-hdr">
            <div>
              <div className="sec-lbl rev">
                <div className="sec-lbl-line" />
                What We Do
              </div>
              <h2 className="sec-h rev" style={{ transitionDelay: "0.1s" }}>
                MINISTRY
                <br />
                <em>Highlights</em>
              </h2>
            </div>
            <MagBtn
              href="/events"
              className="btn-ghost rev"
              style={{ transitionDelay: "0.2s" }}
            >
              <span>See All Events</span>
              <span className="btn-arr">→</span>
            </MagBtn>
          </div>
          <div className="hl-grid">
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={i}
                className="f-card rev"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="f-card-inner-glow" />
                <span className="f-num">{h.num}</span>
                <div className="f-icon-wrap">{h.icon}</div>
                <div className="f-title">{h.title}</div>
                <div className="f-desc">{h.desc}</div>
                <div className="f-bar" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SCHEDULE / INFO ═══════════════ */}
      <div className="schedule">
        <div className="schedule-in">
          <div className="sched-block rev">
            <div className="sched-lbl">
              <div className="sched-dot" />
              Meeting Times
            </div>
            <div className="sched-value">Coming Soon</div>
            <div className="sched-note">Stay connected for updates</div>
          </div>
          <div className="sched-block rev" style={{ transitionDelay: "0.1s" }}>
            <div className="sched-lbl">
              <div className="sched-dot" />
              Schedule
            </div>
            <div className="sched-value">Coming Soon</div>
            <div className="sched-note">Programs are being planned</div>
          </div>
          <div className="sched-block rev" style={{ transitionDelay: "0.2s" }}>
            <div className="sched-lbl">
              <div className="sched-dot" />
              Office Location
            </div>
            <div className="sched-addr">
              Plot 17 Birabi Street,
              <br />
              GRA Phase 1, Port Harcourt,
              <br />
              Rivers, Nigeria
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ VERSE BANNER ═══════════════ */}
      <div className="v-banner">
        <Sparkles />
        <div className="v-inner rev">
          <span className="v-icon">"</span>
          <p className="v-text">
            But on Mount Zion there shall be deliverance, and there shall be
            holiness; the house of Jacob shall possess their possessions.
          </p>
          <div className="v-ref">Obadiah 1:17 · NKJV</div>
        </div>
      </div>

      {/* ═══════════════ PASTOR ═══════════════ */}
      <section className="pastor-sec">
        <div className="pastor-in">
          <div className="rev-l">
            <div className="p-img-frame">
              <div className="p-img-corner tl" />
              <div className="p-img-corner br" />
              <img
                src="https://smhos.org/wp-content/uploads/2023/02/488198091_695897653098091_8122781049977009072_n-150x150.jpg"
                alt="Pst. Christian George"
                className="p-img"
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  display: "block",
                  filter: "brightness(0.85) contrast(1.05)",
                }}
              />
              <div className="p-img-overlay" />
              <div className="p-name-over">
                <div className="p-name-over-n">PST. CHRISTIAN GEORGE</div>
                <div className="p-name-over-r">Youth Ministry Pastor</div>
              </div>
            </div>
          </div>
          <div className="rev-r">
            <div className="sec-lbl">
              <div className="sec-lbl-line" />
              Your Pastor
            </div>
            <span className="p-quote-mark">"</span>
            <blockquote className="p-quote">
              We are raising a generation that is not just passionate about God,
              but equipped to transform every sphere of society with the
              Kingdom's power and wisdom.
            </blockquote>
            <div className="p-sig">
              <div className="p-sig-name">PST. CHRISTIAN GEORGE</div>
              <div className="p-sig-div" />
              <div className="p-sig-role">
                Youth Ministry Pastor · Salvation Ministries
              </div>
            </div>
            <div
              style={{
                marginTop: 48,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <MagBtn href="/contacts" className="btn-fire">
                <span>Get In Touch</span>
                <span className="btn-arr">→</span>
              </MagBtn>
              <MagBtn href="/live" className="btn-ghost">
                <span>Watch Live</span>
              </MagBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ RELATED MINISTRIES ═══════════════ */}
      <section className="related">
        <div className="related-in">
          <div className="sec-lbl rev">
            <div className="sec-lbl-line" />
            Explore More
          </div>
          <h2 className="sec-h rev" style={{ transitionDelay: "0.1s" }}>
            RELATED
            <br />
            <em>Ministries</em>
          </h2>
          <div className="rel-grid">
            {RELATED.map((r, i) => (
              <a
                key={i}
                href={r.href}
                className="rel-card rev"
                style={{ transitionDelay: `${i * 0.15}s` }}
                target="_blank"
                rel="noreferrer"
              >
                <img src={r.img} alt={r.label} className="rel-img" />
                <div className="rel-over" />
                <div className="rel-glow" />
                <div className="rel-fire-line" />
                <div className="rel-content">
                  <div className="rel-min-lbl">Ministry</div>
                  <div className="rel-title">{r.label}</div>
                  <div className="rel-arr">
                    <span className="rel-arr-line" />
                    Explore
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="cta-sec">
        <div className="cta-glow-floor" />
        <Sparkles />
        <div className="cta-inner">
          <div className="cta-eyebrow rev">
            <div className="cta-e-line" />
            Be Part of Something Greater
            <div className="cta-e-line r" />
          </div>
          <h2 className="cta-title rev" style={{ transitionDelay: "0.1s" }}>
            JOIN THE<em>MOVEMENT</em>
          </h2>
          <p className="cta-sub rev" style={{ transitionDelay: "0.2s" }}>
            A community that inspires, equips, and propels you towards your
            God-given destiny.
          </p>
          <div className="cta-btns rev" style={{ transitionDelay: "0.3s" }}>
            <MagBtn href="/events" className="btn-fire">
              <span>Upcoming Events</span>
              <span className="btn-arr">→</span>
            </MagBtn>
            <MagBtn href="/church-locator" className="btn-ghost">
              <span>Find A Church</span>
            </MagBtn>
            <MagBtn href="/give" className="btn-ghost">
              <span>Give Online</span>
            </MagBtn>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="footer">
        <div className="ft-top">
          <div>
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
              className="ft-logo"
            />
            <p className="ft-desc">
              Youth Ministry — Salvation Ministries. Empowering a generation to
              live boldly for God.
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
                { l: "Home", h: "/" },
                { l: "About Us", h: "/about" },
                { l: "Sermons", h: "/sermons" },
                { l: "Events", h: "/events" },
                { l: "Store", h: "https://smhosstore.com" },
              ].map((x) => (
                <li key={x.l}>
                  <a
                    href={x.h}
                    className="ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {x.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-title">Ministries</div>
            <ul className="ft-links">
              {[
                {
                  l: "Campus Ministry",
                  h: "/ministry/campus/",
                },
                {
                  l: "Leading Lights",
                  h: "/ministry/children/",
                },
                { l: "Youth Ministry", h: "/ministry/youth/" },
                { l: "SWOLBI", h: "https://learn.swolbi.org" },
                { l: "Chokhmah", h: "https://chokhmah.org.ng" },
              ].map((x) => (
                <li key={x.l}>
                  <a
                    href={x.h}
                    className="ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {x.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-title">Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    color: "var(--fire2)",
                    marginBottom: 6,
                  }}
                >
                  Phone
                </div>
                <a
                  href="tel:+2348033123743"
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 14,
                    fontWeight: 300,
                    color: "var(--muted)",
                    textDecoration: "none",
                  }}
                >
                  +234 (803) 312 3743
                </a>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    color: "var(--fire2)",
                    marginBottom: 6,
                  }}
                >
                  Email
                </div>
                <a
                  href="mailto:info@smhos.org"
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 14,
                    fontWeight: 300,
                    color: "var(--muted)",
                    textDecoration: "none",
                  }}
                >
                  info@smhos.org
                </a>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.45em",
                    textTransform: "uppercase",
                    color: "var(--fire2)",
                    marginBottom: 6,
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 13,
                    fontWeight: 300,
                    color: "var(--muted)",
                    lineHeight: 1.85,
                  }}
                >
                  Plot 17 Birabi Street,
                  <br />
                  GRA Phase 1, Port Harcourt,
                  <br />
                  Rivers, Nigeria
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">
            © 2026 Salvation Ministries. All Rights Reserved.
          </div>
          <div className="ft-orn">
            <div className="ft-orn-line" />
            <div className="ft-orn-cross">✦</div>
            <div className="ft-orn-line" />
          </div>
          <div className="ft-bot-links">
            <a
              href="/contacts/"
              className="ft-bot-link"
              target="_blank"
              rel="noreferrer"
            >
              Contact
            </a>
            <a
              href="/give"
              className="ft-bot-link"
              target="_blank"
              rel="noreferrer"
            >
              Give
            </a>
            <a
              href="/forms/"
              className="ft-bot-link"
              target="_blank"
              rel="noreferrer"
            >
              Forms
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
