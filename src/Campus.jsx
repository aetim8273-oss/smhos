import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════ CSS ══ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=Bebas+Neue&family=DM+Sans:wght@200;300;400;500;600;700&family=Cinzel:wght@400;500;600;700;900&display=swap');

@property --border-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --holo-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}

:root{
  --black:#04040B;
  --deep:#070710;
  --dark:#0C0C1A;
  --mid:#131325;
  --panel:#0F0F1F;
  --card:#16162A;
  --lift:#1C1C32;

  --gold:#C49A3C;
  --gold2:#DDB96A;
  --gold3:#EDD08A;
  --gold4:#FFF3C4;
  --crimson:#7B1C30;
  --scarlet:#A52840;

  --border:rgba(196,154,60,0.18);
  --border2:rgba(196,154,60,0.42);
  --glow:rgba(196,154,60,0.12);

  --white:#FDFAF2;
  --cream:#F2E8CC;
  --muted:#807060;
  --faint:#2E2C20;

  --f-display:'Bebas Neue',sans-serif;
  --f-serif:'Cormorant Garamond',serif;
  --f-title:'Cinzel',serif;
  --f-body:'DM Sans',sans-serif;
  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
}

body{background:var(--black);color:var(--white);font-family:var(--f-body);overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--deep);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--gold3));border-radius:2px;}

/* ── GRAIN ── */
.grain{position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:120px;opacity:0.028;mix-blend-mode:overlay;
  animation:grainDrift 0.35s steps(3) infinite;}
@keyframes grainDrift{0%{transform:translate(0,0);}33%{transform:translate(-2px,3px);}66%{transform:translate(3px,-2px);}100%{transform:translate(-1px,2px);}}

/* ── CURSOR ── */
.c-dot{position:fixed;pointer-events:none;z-index:99999;width:5px;height:5px;background:var(--gold3);border-radius:50%;transform:translate(-50%,-50%);}
.c-ring{position:fixed;pointer-events:none;z-index:99998;width:36px;height:36px;border:1px solid var(--border2);border-radius:50%;transform:translate(-50%,-50%);transition:width 0.3s var(--ease),height 0.3s var(--ease),border-color 0.3s,background 0.3s;}
.c-ring.h{width:60px;height:60px;border-color:var(--gold);background:var(--glow);}

/* ── LOADER ── */
.loader{position:fixed;inset:0;z-index:99990;background:var(--black);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 1s var(--ease),visibility 1s;}
.loader.out{opacity:0;visibility:hidden;}
.ldr-cross{position:relative;width:80px;height:80px;margin-bottom:44px;}
.ldr-svg{position:absolute;inset:0;}
.ldr-c{fill:none;stroke:var(--gold);stroke-width:1;stroke-dasharray:251;stroke-dashoffset:251;animation:ldrDraw 1.8s var(--ease) infinite;}
.ldr-x{fill:none;stroke:var(--gold3);stroke-width:2;stroke-linecap:round;stroke-dasharray:160;stroke-dashoffset:160;animation:ldrDraw 1.8s var(--ease) 0.25s infinite;}
@keyframes ldrDraw{0%{stroke-dashoffset:251;opacity:0;}25%{opacity:1;}75%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-251;opacity:0;}}
.ldr-glow{position:absolute;inset:-20px;border-radius:50%;background:radial-gradient(circle,rgba(196,154,60,0.25) 0%,transparent 70%);animation:ldrGlow 1.8s ease-in-out infinite;}
@keyframes ldrGlow{0%,100%{transform:scale(1);opacity:0.5;}50%{transform:scale(1.4);opacity:1;}}
.ldr-txt{font-family:var(--f-title);font-size:11px;letter-spacing:0.55em;color:var(--gold);text-transform:uppercase;animation:ldrPulse 1.8s ease-in-out infinite;}
.ldr-sub{font-family:var(--f-body);font-size:10px;letter-spacing:0.4em;color:var(--muted);margin-top:8px;text-transform:uppercase;}
.ldr-bar{width:160px;height:1px;background:var(--faint);margin-top:24px;overflow:hidden;}
.ldr-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:200%;animation:ldrBar 1.6s ease-in-out infinite;}
@keyframes ldrBar{0%{width:0;margin-left:0;}50%{width:100%;margin-left:0;}100%{width:0;margin-left:100%;}}
@keyframes ldrPulse{0%,100%{opacity:1;}50%{opacity:0.35;}}

/* ══ NAV ══════════════════════════════════════════════════════════ */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:28px 72px;display:flex;align-items:center;justify-content:space-between;transition:all 0.5s var(--ease);}
.nav::after{content:'';position:absolute;inset:0;transition:all 0.5s;pointer-events:none;}
.nav.s{padding:16px 72px;}
.nav.s::after{background:rgba(4,4,11,0.96);backdrop-filter:blur(30px);border-bottom:1px solid var(--border);}
.nav-logo{text-decoration:none;}
.nav-logo img{height:44px;object-fit:contain;position:relative;z-index:1;filter:drop-shadow(0 0 12px rgba(196,154,60,0.35));transition:filter 0.4s;display:block;}
.nav-logo img:hover{filter:drop-shadow(0 0 28px rgba(196,154,60,0.7));}
.nav-links{display:flex;align-items:center;gap:48px;position:relative;z-index:1;}
.nav-a{font-family:var(--f-body);font-size:11px;font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:rgba(253,250,242,0.5);text-decoration:none;position:relative;padding:4px 0;transition:color 0.3s;}
.nav-a::after{content:'';position:absolute;bottom:-2px;left:50%;right:50%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transition:left 0.4s var(--ease),right 0.4s var(--ease);}
.nav-a:hover{color:var(--gold3);}
.nav-a:hover::after{left:0;right:0;}
.nav-give{font-family:var(--f-title);font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:14px 30px;position:relative;overflow:hidden;box-shadow:0 4px 24px rgba(196,154,60,0.3);transition:transform 0.3s,box-shadow 0.3s;}
.nav-give::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.nav-give:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(196,154,60,0.55);}
.nav-give:hover::after{left:150%;}

/* ── BURGER ── */
.burger{display:none;flex-direction:column;gap:6px;cursor:pointer;background:none;border:none;padding:8px;z-index:1;}
.b-ln{width:26px;height:1.5px;background:var(--white);transition:all 0.4s var(--ease);transform-origin:center;}
.burger.open .b-ln:nth-child(1){transform:translateY(7.5px) rotate(45deg);}
.burger.open .b-ln:nth-child(2){opacity:0;transform:scaleX(0);}
.burger.open .b-ln:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);}
.mob-nav{position:fixed;inset:0;z-index:999;background:var(--deep);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:translateX(100%);transition:transform 0.7s var(--ease2);}
.mob-nav.open{transform:translateX(0);}
.mob-nav::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(196,154,60,0.05) 0%,transparent 70%);}
.mob-links{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;}
.mob-a{font-family:var(--f-display);font-size:clamp(38px,8vw,72px);color:var(--white);text-decoration:none;letter-spacing:0.05em;opacity:0;transform:translateX(40px);transition:color 0.3s,opacity 0.5s,transform 0.5s;}
.mob-nav.open .mob-a{opacity:1;transform:none;}
.mob-nav.open .mob-a:nth-child(1){transition-delay:0.08s;}
.mob-nav.open .mob-a:nth-child(2){transition-delay:0.15s;}
.mob-nav.open .mob-a:nth-child(3){transition-delay:0.22s;}
.mob-nav.open .mob-a:nth-child(4){transition-delay:0.29s;}
.mob-nav.open .mob-a:nth-child(5){transition-delay:0.36s;}
.mob-a:hover{color:var(--gold);}
.mob-cta{font-family:var(--f-body);font-size:12px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:18px 56px;margin-top:32px;opacity:0;transform:translateY(20px);transition:opacity 0.5s 0.42s,transform 0.5s 0.42s;}
.mob-nav.open .mob-cta{opacity:1;transform:none;}

/* ══ HERO ══════════════════════════════════════════════════════════ */
.hero{min-height:100vh;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--black);}
.hero-canvas{position:absolute;inset:0;width:100%;height:100%;}

.aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.aurora::before{content:'';position:absolute;width:140%;height:140%;top:-20%;left:-20%;
  background:radial-gradient(ellipse 70% 35% at 25% 25%,rgba(196,154,60,0.07) 0%,transparent 60%),
             radial-gradient(ellipse 50% 45% at 80% 75%,rgba(123,28,48,0.04) 0%,transparent 60%),
             radial-gradient(ellipse 90% 55% at 55% 45%,rgba(196,154,60,0.03) 0%,transparent 70%);
  animation:auroraDrift 22s ease-in-out infinite alternate;}
@keyframes auroraDrift{0%{transform:translate(0,0)scale(1);}100%{transform:translate(2%,1.5%)scale(1.05);}}

.god-rays{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.god-rays::before{content:'';position:absolute;top:-50%;left:50%;transform-origin:top center;width:260%;height:180%;transform:translateX(-50%);
  background:conic-gradient(from 270deg at 50% 0%,
    transparent 0deg,rgba(196,154,60,0.04) 2deg,transparent 4deg,
    transparent 14deg,rgba(255,220,100,0.03) 16deg,transparent 18deg,
    transparent 30deg,rgba(196,154,60,0.045) 32deg,transparent 34deg,
    transparent 50deg,rgba(255,235,130,0.025) 52deg,transparent 54deg,
    transparent 68deg,rgba(196,154,60,0.035) 70deg,transparent 72deg,
    transparent 84deg,rgba(255,220,100,0.03) 86deg,transparent 88deg,
    transparent 96deg
  );animation:godRot 100s linear infinite;}
.god-rays::after{content:'';position:absolute;top:-50%;left:50%;transform-origin:top center;width:260%;height:180%;transform:translateX(-50%);
  background:conic-gradient(from 90deg at 50% 0%,transparent 0deg,rgba(196,154,60,0.025) 2deg,transparent 4deg,transparent 22deg,rgba(255,230,100,0.02) 24deg,transparent 26deg,transparent 46deg,rgba(196,154,60,0.03) 48deg,transparent 50deg,transparent 90deg);
  animation:godRot 70s linear infinite reverse;}
@keyframes godRot{from{transform:translateX(-50%)rotate(0);}to{transform:translateX(-50%)rotate(360deg);}}

.geo-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.geo{opacity:0.04;filter:drop-shadow(0 0 6px rgba(196,154,60,0.4));}
.geo-out{animation:geoOut 200s linear infinite;}
.geo-in{animation:geoIn 130s linear infinite reverse;}
@keyframes geoOut{from{transform:rotate(0);}to{transform:rotate(360deg);}}
@keyframes geoIn{from{transform:rotate(0);}to{transform:rotate(360deg);}}

.rings{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid var(--border);transform:translate(-50%,-50%);animation:ringPulse 12s ease-in-out infinite;}
.ring:nth-child(1){width:260px;height:260px;border:1.5px solid rgba(196,154,60,0.4);animation-delay:0s;box-shadow:0 0 60px rgba(196,154,60,0.1),inset 0 0 40px rgba(196,154,60,0.05);}
.ring:nth-child(2){width:460px;height:460px;animation-delay:2s;}
.ring:nth-child(3){width:700px;height:700px;border-color:rgba(196,154,60,0.07);animation-delay:4s;}
.ring:nth-child(4){width:980px;height:980px;border-color:rgba(196,154,60,0.035);animation-delay:6s;}
@keyframes ringPulse{0%,100%{opacity:1;transform:translate(-50%,-50%)scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%)scale(1.025);}}

.hero-glow{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(196,154,60,0.09) 0%,transparent 65%);pointer-events:none;animation:glowBreathe 8s ease-in-out infinite;}
@keyframes glowBreathe{0%,100%{transform:translate(-50%,-50%)scale(1);opacity:1;}50%{transform:translate(-50%,-50%)scale(1.15);opacity:0.5;}}

.prism{background:linear-gradient(90deg,var(--gold) 0%,var(--gold4) 15%,var(--gold2) 28%,#fffbe0 42%,var(--gold3) 56%,var(--gold2) 70%,#ffeead 84%,var(--gold) 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:prismShift 7s linear infinite;filter:drop-shadow(0 0 50px rgba(196,154,60,0.5));}
@keyframes prismShift{0%{background-position:0% center;}100%{background-position:300% center;}}

.glitch{position:relative;}
.glitch::before,.glitch::after{content:attr(data-t);position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;}
.glitch::before{animation:glB 8s infinite 3s;color:rgba(255,0,80,0.65);clip-path:polygon(0 12%,100% 12%,100% 38%,0 38%);}
.glitch::after{animation:glA 8s infinite 3.2s;color:rgba(0,200,255,0.45);clip-path:polygon(0 62%,100% 62%,100% 82%,0 82%);}
@keyframes glB{0%,91%,100%{opacity:0;transform:translate(0);}92%{opacity:1;transform:translate(-4px,-2px);}93%{opacity:0;}94%{opacity:1;transform:translate(4px,2px);}95%{opacity:0;}}
@keyframes glA{0%,89%,100%{opacity:0;transform:translate(0);}90%{opacity:1;transform:translate(4px,1px);}91%{opacity:0;}92%{opacity:1;transform:translate(-3px,-1px);}93%{opacity:0;}}

.neon-f{animation:neonF 9s ease-in-out infinite;}
@keyframes neonF{0%,100%{text-shadow:0 0 40px rgba(196,154,60,0.4),0 0 80px rgba(196,154,60,0.15);}91%{text-shadow:0 0 40px rgba(196,154,60,0.4);}92%{text-shadow:none;}93%{text-shadow:0 0 50px rgba(196,154,60,0.5);}94%{text-shadow:none;}95%{text-shadow:0 0 60px rgba(196,154,60,0.7),0 0 120px rgba(196,154,60,0.3);}}

/* hero content */
.hero-cnt{position:relative;z-index:5;text-align:center;padding:0 24px;max-width:1200px;display:flex;flex-direction:column;align-items:center;}
.hero-eyebrow{font-family:var(--f-title);font-size:11px;letter-spacing:0.7em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:18px;margin-bottom:36px;opacity:0;animation:fadeUp 0.9s 0.5s var(--ease) forwards;}
.eyebrow-line{height:1px;width:48px;background:linear-gradient(90deg,transparent,var(--gold));}
.eyebrow-line.r{background:linear-gradient(90deg,var(--gold),transparent);}

.hero-t1{font-family:var(--f-display);font-size:clamp(72px,13vw,210px);font-weight:400;line-height:0.86;color:var(--white);letter-spacing:0.08em;opacity:0;animation:fadeUp 1s 0.7s var(--ease) forwards;position:relative;}
.hero-t2{font-family:var(--f-display);font-size:clamp(72px,13vw,210px);font-weight:400;line-height:0.86;letter-spacing:0.08em;opacity:0;animation:fadeUp 1s 0.9s var(--ease) forwards;}
.hero-tagline{font-family:var(--f-serif);font-size:clamp(15px,2vw,26px);font-style:italic;color:rgba(253,250,242,0.4);letter-spacing:0.18em;margin-top:22px;opacity:0;animation:fadeUp 0.9s 1.1s var(--ease) forwards;}

/* ── verse box — clean bordered, no spinning shimmer ── */
.hero-verse{margin:52px 0;max-width:760px;width:100%;opacity:0;animation:fadeUp 0.9s 1.3s var(--ease) forwards;}
.verse-box{padding:40px 56px;position:relative;background:linear-gradient(135deg,rgba(196,154,60,0.06),transparent);border:1px solid var(--border);}
.verse-corner{position:absolute;width:18px;height:18px;border-color:var(--gold3);border-style:solid;}
.verse-corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.verse-corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.verse-txt{font-family:var(--f-serif);font-size:19px;font-style:italic;color:rgba(196,154,60,0.9);line-height:1.85;margin-bottom:16px;}
.verse-ref{font-family:var(--f-body);font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);}

.hero-ctas{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;opacity:0;animation:fadeUp 0.9s 1.5s var(--ease) forwards;}
.hero-scroll{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:fadeUp 0.9s 2.2s var(--ease) forwards;}
.scroll-lbl{font-family:var(--f-body);font-size:9px;letter-spacing:0.6em;text-transform:uppercase;color:var(--muted);}
.scroll-track{width:1px;height:64px;background:var(--faint);overflow:hidden;position:relative;}
.scroll-fill{position:absolute;top:-100%;width:100%;height:100%;background:linear-gradient(var(--gold3),transparent);animation:scrollFill 2.4s ease-in-out infinite;}
@keyframes scrollFill{0%{top:-100%;}100%{top:200%;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}

/* ══ TICKER ══════════════════════════════════════════════════════════ */
.ticker{overflow:hidden;padding:14px 0;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:300% 100%;animation:tickerShimmer 6s linear infinite;}
@keyframes tickerShimmer{0%{background-position:0% 0%;}100%{background-position:300% 0%;}}
.ticker-inner{display:flex;white-space:nowrap;animation:tickX 30s linear infinite;}
.t-item{display:flex;align-items:center;gap:28px;padding:0 28px;font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--black);flex-shrink:0;}
.t-dot{width:4px;height:4px;background:var(--black);border-radius:50%;opacity:0.3;}
@keyframes tickX{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ══ BUTTONS ══════════════════════════════════════════════════════ */
.btn-g{display:inline-flex;align-items:center;gap:14px;font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);text-decoration:none;padding:18px 44px;position:relative;overflow:hidden;box-shadow:0 6px 36px rgba(196,154,60,0.32);transition:transform 0.3s var(--ease),box-shadow 0.3s;}
.btn-g::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold4),var(--gold3));opacity:0;transition:opacity 0.3s;}
.btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.btn-g:hover{transform:translateY(-3px);box-shadow:0 18px 60px rgba(196,154,60,0.55);}
.btn-g:hover::before{opacity:1;}
.btn-g:hover::after{left:150%;}
.btn-g span,.btn-h span{position:relative;z-index:1;}
.btn-arr{position:relative;z-index:1;transition:transform 0.3s;}
.btn-g:hover .btn-arr,.btn-h:hover .btn-arr{transform:translateX(5px);}
.btn-h{display:inline-flex;align-items:center;gap:14px;font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.32em;text-transform:uppercase;background:transparent;color:var(--gold3);text-decoration:none;padding:17px 44px;border:1px solid var(--border2);position:relative;overflow:hidden;transition:all 0.3s var(--ease);}
.btn-h::before{content:'';position:absolute;inset:0;background:rgba(196,154,60,0.06);opacity:0;transition:opacity 0.3s;}
.btn-h:hover{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 30px rgba(196,154,60,0.12);}
.btn-h:hover::before{opacity:1;}

/* ══ REVEAL ══════════════════════════════════════════════════════ */
.rev{opacity:0;transform:translateY(52px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev.v{opacity:1;transform:translateY(0);}
.rev-l{opacity:0;transform:translateX(-52px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-l.v{opacity:1;transform:translateX(0);}
.rev-r{opacity:0;transform:translateX(52px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-r.v{opacity:1;transform:translateX(0);}

/* ══ SECTION SHARED ══════════════════════════════════════════════ */
.s-wrap{max-width:1440px;margin:0 auto;padding:0 72px;}
.s-lbl{display:flex;align-items:center;gap:14px;font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:18px;}
.s-lbl-ln{flex:0 0 36px;height:1px;background:var(--border2);}
.s-h2{font-family:var(--f-display);font-size:clamp(44px,7vw,108px);font-weight:400;line-height:0.9;color:var(--white);letter-spacing:0.05em;margin-bottom:24px;}
.s-h2 em{font-style:italic;font-family:var(--f-serif);background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-size:0.82em;}
.s-orn{position:relative;width:60px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:30px 0;}
.s-orn::after{content:'✦';position:absolute;top:50%;left:68px;transform:translateY(-50%);font-size:9px;color:var(--gold);opacity:0.5;animation:spinSlow 8s linear infinite;}
@keyframes spinSlow{from{transform:translateY(-50%)rotate(0);}to{transform:translateY(-50%)rotate(360deg);}}

/* ══ STATS BAND ══════════════════════════════════════════════════ */
.stats{background:var(--panel);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:80px 0;display:grid;grid-template-columns:repeat(4,1fr);position:relative;overflow:hidden;}
.stats::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(196,154,60,0.025) 1px,transparent 1px),linear-gradient(-45deg,rgba(196,154,60,0.025) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}
.stats-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1000px;height:350px;background:radial-gradient(ellipse,rgba(196,154,60,0.07) 0%,transparent 70%);pointer-events:none;}
.stat{text-align:center;padding:20px;position:relative;transition:transform 0.4s var(--ease3);}
.stat:hover{transform:translateY(-12px);}
.stat::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:var(--border);}
.stat:last-child::after{display:none;}
.stat-n{font-family:var(--f-display);font-size:clamp(44px,5vw,84px);letter-spacing:0.04em;line-height:1;background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:filter 0.4s;}
.stat:hover .stat-n{filter:drop-shadow(0 0 24px rgba(196,154,60,0.7));}
.stat-l{font-family:var(--f-body);font-size:10px;font-weight:600;letter-spacing:0.45em;text-transform:uppercase;color:var(--muted);margin-top:14px;}

/* ══ MARQUEE ══════════════════════════════════════════════════════ */
.marquee-row{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:18px 0;background:var(--deep);}
.marquee-inner{display:flex;gap:0;white-space:nowrap;animation:marqX 22s linear infinite;}
.marq-item{font-family:var(--f-display);font-size:clamp(48px,8vw,120px);color:transparent;-webkit-text-stroke:1px var(--border2);letter-spacing:0.08em;padding:0 44px;flex-shrink:0;transition:color 0.3s,-webkit-text-stroke 0.3s;}
.marq-item:hover{color:var(--gold);-webkit-text-stroke:1px var(--gold);text-shadow:0 0 50px rgba(196,154,60,0.4);}
@keyframes marqX{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ══ MANDATE / ABOUT ══════════════════════════════════════════════ */
.mandate{background:var(--dark);padding:160px 0;overflow:hidden;position:relative;}
.mandate::before{content:'CAMPUS';position:absolute;bottom:-60px;right:-40px;font-family:var(--f-display);font-size:clamp(100px,18vw,300px);color:transparent;-webkit-text-stroke:1px rgba(196,154,60,0.04);pointer-events:none;line-height:1;user-select:none;}
.mandate::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 380px 280px at 8% 18%,rgba(196,154,60,0.04) 0%,transparent 100%),radial-gradient(ellipse 280px 380px at 92% 82%,rgba(123,28,48,0.03) 0%,transparent 100%);pointer-events:none;}
.mandate-in{display:grid;grid-template-columns:5fr 6fr;gap:128px;align-items:center;}

.img-wrap{position:relative;overflow:hidden;}
.img-frame{position:absolute;top:-22px;left:-22px;right:22px;bottom:22px;border:1px solid var(--border);pointer-events:none;z-index:0;}
.img-frame::before,.img-frame::after{content:'';position:absolute;width:22px;height:22px;border-color:var(--gold);border-style:solid;}
.img-frame::before{top:-1px;left:-1px;border-width:2.5px 0 0 2.5px;}
.img-frame::after{bottom:-1px;right:-1px;border-width:0 2.5px 2.5px 0;}
.img-main{width:100%;height:600px;object-fit:cover;display:block;position:relative;z-index:1;filter:brightness(0.88)contrast(1.06)saturate(1.1);transition:transform 0.8s var(--ease),filter 0.6s;}
.img-wrap:hover .img-main{transform:scale(1.03);filter:brightness(1)contrast(1.1)saturate(1.2);}
.img-wrap::after{content:'';position:absolute;top:-50%;left:-150%;width:60%;height:200%;background:linear-gradient(to right,transparent,rgba(196,154,60,0.05),transparent);transform:skewX(-20deg);transition:left 0.9s var(--ease);z-index:2;pointer-events:none;}
.img-wrap:hover::after{left:160%;}
.img-tag{position:absolute;bottom:-18px;right:-18px;z-index:3;background:var(--gold);color:var(--black);font-family:var(--f-body);font-size:9px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;padding:14px 22px;}

.m-year{font-family:var(--f-display);font-size:clamp(80px,11vw,170px);line-height:1;color:transparent;-webkit-text-stroke:1px rgba(196,154,60,0.16);margin-bottom:-14px;display:block;letter-spacing:0.04em;}
.m-body{font-family:var(--f-serif);font-size:18px;font-weight:400;line-height:2;color:var(--muted);margin-bottom:22px;}

/* ══ CALLING CARDS ══════════════════════════════════════════════════ */
.calling{background:var(--black);padding:160px 0;position:relative;overflow:hidden;}
.calling-bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--f-display);font-size:clamp(160px,28vw,420px);color:transparent;-webkit-text-stroke:1px rgba(196,154,60,0.025);white-space:nowrap;pointer-events:none;user-select:none;}
.calling-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:84px;}
.calling-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--faint);}

.holo-card{background:var(--panel);padding:60px 44px 56px;text-decoration:none;display:block;position:relative;overflow:hidden;transition:background 0.4s,transform 0.15s ease-out,box-shadow 0.4s;transform-style:preserve-3d;}
.holo-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform:scaleX(0);transform-origin:left;transition:transform 0.55s var(--ease);}
.holo-card:hover::before{transform:scaleX(1);}
.holo-inner{position:absolute;inset:0;opacity:0;transition:opacity 0.4s;pointer-events:none;mix-blend-mode:screen;background:conic-gradient(from var(--holo-angle,220deg) at var(--hx,50%) var(--hy,50%),rgba(255,0,100,0.04) 0deg,rgba(255,200,0,0.06) 60deg,rgba(0,255,140,0.04) 120deg,rgba(0,180,255,0.05) 180deg,rgba(140,0,255,0.04) 240deg,rgba(255,80,0,0.05) 300deg,rgba(255,0,100,0.04) 360deg);}
.holo-bg{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse 130% 130% at 50% 115%,rgba(196,154,60,0.13) 0%,transparent 70%);transition:opacity 0.5s;pointer-events:none;}
.holo-card:hover{background:var(--card);box-shadow:0 28px 70px rgba(0,0,0,0.55),0 0 60px rgba(196,154,60,0.06),inset 0 1px 0 rgba(196,154,60,0.1);}
.holo-card:hover .holo-bg{opacity:1;}
.holo-card:hover .holo-inner{opacity:1;}

.c-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:56px;}
.c-num{font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.45em;color:var(--gold);}
.c-icon{width:36px;height:36px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:15px;transition:all 0.4s;}
.holo-card:hover .c-icon{border-color:var(--gold);background:rgba(196,154,60,0.1);transform:rotate(45deg);box-shadow:0 0 18px rgba(196,154,60,0.3);}
.c-lbl{font-family:var(--f-body);font-size:9px;font-weight:600;letter-spacing:0.5em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
.c-title{font-family:var(--f-display);font-size:28px;color:var(--white);line-height:1.12;margin-bottom:36px;letter-spacing:0.04em;transition:color 0.3s;}
.holo-card:hover .c-title{color:var(--gold3);}
.c-div{width:28px;height:1.5px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:20px;transition:width 0.5s var(--ease);}
.holo-card:hover .c-div{width:60px;}
.c-cta{font-family:var(--f-body);font-size:9px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:10px;transition:gap 0.3s;}
.holo-card:hover .c-cta{gap:18px;}

/* ══ VERSE BANNER ══════════════════════════════════════════════════ */
.verse-banner{background:var(--panel);padding:128px 0;text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.verse-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 180% at 50% 50%,rgba(196,154,60,0.06) 0%,transparent 100%);}
.starburst{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1000px;height:1000px;pointer-events:none;
  background:conic-gradient(from 0deg,transparent 0deg,rgba(196,154,60,0.025) 1.5deg,transparent 3deg,transparent 28.5deg,rgba(196,154,60,0.02) 30deg,transparent 31.5deg,transparent 58.5deg,rgba(196,154,60,0.025) 60deg,transparent 61.5deg,transparent 88.5deg,rgba(196,154,60,0.02) 90deg,transparent 91.5deg,transparent 118.5deg,rgba(196,154,60,0.025) 120deg,transparent 121.5deg,transparent 148.5deg,rgba(196,154,60,0.02) 150deg,transparent 151.5deg,transparent 178.5deg,rgba(196,154,60,0.025) 180deg,transparent 181.5deg,transparent 208.5deg,rgba(196,154,60,0.02) 210deg,transparent 211.5deg,transparent 238.5deg,rgba(196,154,60,0.025) 240deg,transparent 241.5deg,transparent 268.5deg,rgba(196,154,60,0.02) 270deg,transparent 271.5deg,transparent 298.5deg,rgba(196,154,60,0.025) 300deg,transparent 301.5deg,transparent 328.5deg,rgba(196,154,60,0.02) 330deg,transparent 331.5deg,transparent 360deg);
  animation:starSpin 35s linear infinite;}
@keyframes starSpin{from{transform:translate(-50%,-50%)rotate(0);}to{transform:translate(-50%,-50%)rotate(360deg);}}
.banner-q{font-family:var(--f-serif);font-size:clamp(18px,3.2vw,44px);font-style:italic;font-weight:400;color:var(--white);line-height:1.45;max-width:980px;margin:0 auto 32px;position:relative;z-index:1;}
.banner-q::before{content:'"';font-family:var(--f-display);font-size:160px;color:rgba(196,154,60,0.12);position:absolute;top:-60px;left:-20px;line-height:1;pointer-events:none;}
.banner-attr{font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--gold);position:relative;z-index:1;}

/* ══ SCHEDULE + PASTOR ══════════════════════════════════════════ */
.panel-sec{background:var(--dark);padding:160px 0;position:relative;overflow:hidden;}
.panel-sec::before{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);}
.panel-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--faint);}

.sched-panel{background:var(--panel);padding:72px 60px;position:relative;overflow:hidden;}
.sched-panel::before{content:'';position:absolute;top:0;left:0;bottom:0;width:3px;background:linear-gradient(var(--gold),var(--gold3),transparent);}
.sched-panel::after{content:'';position:absolute;top:0;right:0;width:1px;height:100%;background:linear-gradient(transparent,rgba(196,154,60,0.25),transparent);animation:svcShimmer 5s ease-in-out infinite;}
@keyframes svcShimmer{0%,100%{opacity:0.3;}50%{opacity:1;}}
.sched-item{display:flex;align-items:flex-start;gap:28px;padding:28px 0;border-bottom:1px solid var(--border);position:relative;overflow:hidden;transition:background 0.3s;}
.sched-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(196,154,60,0.04);transition:width 0.4s var(--ease);}
.sched-item:hover::before{width:100%;}
.sched-date{flex-shrink:0;width:72px;text-align:center;border:1px solid var(--border);padding:14px 8px;background:rgba(196,154,60,0.04);transition:all 0.3s;}
.sched-item:hover .sched-date{background:rgba(196,154,60,0.1);border-color:var(--gold);box-shadow:0 0 20px rgba(196,154,60,0.15);}
.sched-day{font-family:var(--f-display);font-size:38px;line-height:1;color:var(--gold);letter-spacing:0.04em;}
.sched-mon{font-family:var(--f-body);font-size:9px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--muted);margin-top:4px;}
.sched-info{flex:1;}
.sched-name{font-family:var(--f-serif);font-size:18px;font-weight:700;color:var(--white);margin-bottom:6px;transition:color 0.3s;}
.sched-item:hover .sched-name{color:var(--gold3);}
.sched-time{font-family:var(--f-body);font-size:10px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--muted);}
.sched-arr{font-size:20px;color:var(--gold);align-self:center;opacity:0;transform:translateX(-8px);transition:all 0.3s;}
.sched-item:hover .sched-arr{opacity:1;transform:translateX(0);}

.office-block{margin-top:48px;padding:32px;background:rgba(196,154,60,0.04);border:1px solid var(--border);position:relative;}
.office-block::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}
.office-lbl{font-family:var(--f-body);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;}
.office-addr{font-family:var(--f-serif);font-size:16px;font-style:italic;color:var(--muted);line-height:1.9;}

.pastor-panel{background:var(--card);padding:72px 60px;position:relative;overflow:hidden;}
.pastor-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),transparent);}
.p-img-wrap{position:relative;margin-bottom:40px;}
.p-img{width:100%;height:300px;object-fit:cover;object-position:top;display:block;filter:brightness(0.8)contrast(1.05);transition:filter 0.5s;}
.p-img-wrap:hover .p-img{filter:brightness(0.95);}
.p-img-badge{position:absolute;bottom:0;right:0;background:var(--gold);padding:10px 18px;font-family:var(--f-body);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--black);}
.p-qmark{font-family:var(--f-display);font-size:90px;color:rgba(196,154,60,0.18);line-height:1;margin-bottom:-26px;display:block;}
.p-quote{font-family:var(--f-serif);font-size:18px;font-style:italic;color:var(--white);line-height:1.88;margin-bottom:36px;border-left:2.5px solid var(--gold);padding-left:28px;}
.p-name{font-family:var(--f-display);font-size:42px;letter-spacing:0.05em;color:var(--white);}
.p-role{font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);margin-top:6px;}

/* ══ GALLERY ══════════════════════════════════════════════════════ */
.gallery-sec{background:var(--black);padding:160px 0;position:relative;overflow:hidden;}
.gallery-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:80px;}
.gallery-grid{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:auto auto;gap:3px;background:var(--faint);}
.g-cell{position:relative;overflow:hidden;cursor:pointer;display:block;text-decoration:none;}
.g-cell:first-child{grid-row:span 2;}
.g-cell-img{width:100%;height:100%;object-fit:cover;min-height:280px;display:block;filter:brightness(0.7)saturate(0.85);transition:transform 0.9s var(--ease),filter 0.6s;}
.g-cell:first-child .g-cell-img{min-height:560px;}
.g-cell:hover .g-cell-img{transform:scale(1.1);filter:brightness(0.45)saturate(0.6);}
.g-cell-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(4,4,11,0.92) 0%,transparent 50%);pointer-events:none;}
.g-cell-glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 100%,rgba(196,154,60,0.2) 0%,transparent 70%);opacity:0;transition:opacity 0.5s;pointer-events:none;}
.g-cell:hover .g-cell-glow{opacity:1;}
.g-gline{position:absolute;bottom:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);transform:scaleX(0);transform-origin:center;transition:transform 0.6s var(--ease);}
.g-cell:hover .g-gline{transform:scaleX(1);}
.g-content{position:absolute;bottom:0;left:0;right:0;padding:44px 40px;transform:translateY(12px);transition:transform 0.5s var(--ease);}
.g-cell:hover .g-content{transform:translateY(0);}
.g-lbl{font-family:var(--f-body);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;opacity:0;transform:translateY(10px);transition:opacity 0.4s 0.1s,transform 0.4s 0.1s;}
.g-cell:hover .g-lbl{opacity:1;transform:translateY(0);}
.g-title{font-family:var(--f-display);font-size:clamp(20px,2.2vw,36px);color:var(--white);letter-spacing:0.05em;}
.g-arr{display:inline-flex;align-items:center;gap:12px;font-family:var(--f-body);font-size:9px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);margin-top:16px;opacity:0;transform:translateY(10px);transition:opacity 0.4s 0.15s,transform 0.4s 0.15s;}
.g-cell:hover .g-arr{opacity:1;transform:translateY(0);}
.g-arr-line{width:28px;height:1.5px;background:var(--gold);}

/* ══ TESTIMONIALS ══════════════════════════════════════════════════ */
.test-sec{background:var(--panel);padding:160px 0;position:relative;overflow:hidden;}
.test-bg{position:absolute;inset:0;background:radial-gradient(ellipse 45% 45% at 50% 50%,rgba(196,154,60,0.05) 0%,transparent 100%);pointer-events:none;}
.t-card{background:rgba(16,16,28,0.65);border:1px solid rgba(196,154,60,0.14);padding:80px;position:relative;overflow:hidden;min-height:340px;backdrop-filter:blur(28px)saturate(1.6);box-shadow:0 0 0 1px rgba(196,154,60,0.07),0 12px 60px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,255,255,0.04);transition:border-color 0.4s,box-shadow 0.4s;}
.t-card:hover{border-color:rgba(196,154,60,0.32);box-shadow:0 0 0 1px rgba(196,154,60,0.14),0 24px 90px rgba(0,0,0,0.55),0 0 100px rgba(196,154,60,0.06);}
.t-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,var(--gold3),var(--gold),var(--gold3),transparent);background-size:200%;animation:topBorder 4s linear infinite;}
@keyframes topBorder{0%{background-position:0% 0%;}100%{background-position:200% 0%;}}
.t-card::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px);pointer-events:none;}
.t-glow-orb{position:absolute;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(196,154,60,0.06) 0%,transparent 70%);top:-80px;left:-80px;animation:tOrbDrift 14s ease-in-out infinite alternate;pointer-events:none;}
@keyframes tOrbDrift{0%{transform:translate(0,0);}100%{transform:translate(180px,140px);}}
.t-qm{font-family:var(--f-display);font-size:180px;line-height:1;color:rgba(196,154,60,0.06);position:absolute;top:-30px;left:32px;pointer-events:none;}
.t-txt{font-family:var(--f-serif);font-size:21px;font-style:italic;color:var(--white);line-height:1.85;margin-bottom:48px;position:relative;z-index:1;}
.t-auth{display:flex;align-items:center;gap:20px;position:relative;z-index:1;}
.t-line{width:40px;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--gold3));}
.t-name{font-family:var(--f-body);font-size:11px;font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--gold);}
.t-loc{font-size:12px;font-family:var(--f-body);color:var(--muted);margin-top:4px;letter-spacing:0.2em;}
.t-nav{display:flex;align-items:center;justify-content:space-between;margin-top:44px;}
.t-nav-btns{display:flex;gap:12px;}
.t-btn{width:52px;height:52px;border:1px solid var(--border);background:transparent;color:var(--gold);cursor:pointer;font-size:22px;display:flex;align-items:center;justify-content:center;transition:all 0.3s;font-family:serif;}
.t-btn:hover{background:rgba(196,154,60,0.1);border-color:var(--gold);box-shadow:0 0 20px rgba(196,154,60,0.2);}
.t-dots-row{display:flex;gap:8px;}
.t-dot-btn{width:24px;height:2px;background:var(--faint);cursor:pointer;transition:all 0.4s;border:none;padding:0;}
.t-dot-btn.on{background:linear-gradient(90deg,var(--gold),var(--gold3));width:48px;}

/* ══ CTA SECTION ══════════════════════════════════════════════════ */
.cta-sec{background:var(--panel);padding:180px 0;text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--border);}
.cta-sec::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(196,154,60,0.025) 1px,transparent 1px),linear-gradient(-45deg,rgba(196,154,60,0.025) 1px,transparent 1px);background-size:64px 64px;}
.cta-sec::after{content:'';position:absolute;bottom:0;left:0;right:0;height:320px;background:radial-gradient(ellipse 80% 100% at 50% 100%,rgba(196,154,60,0.07) 0%,transparent 70%);pointer-events:none;}
.cta-cross-v{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1px;height:800px;background:linear-gradient(transparent,rgba(196,154,60,0.07),transparent);pointer-events:none;}
.cta-cross-h{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:1px;background:linear-gradient(transparent,rgba(196,154,60,0.07),transparent);pointer-events:none;}
.cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:600px;background:radial-gradient(ellipse,rgba(196,154,60,0.08) 0%,transparent 70%);pointer-events:none;animation:ctaPulse 7s ease-in-out infinite;}
@keyframes ctaPulse{0%,100%{transform:translate(-50%,-50%)scale(1);opacity:1;}50%{transform:translate(-50%,-50%)scale(1.12);opacity:0.55;}}
.corner-orn{position:absolute;pointer-events:none;}
.corner-orn.tl{top:32px;left:32px;width:44px;height:44px;border-top:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.tr{top:32px;right:32px;width:44px;height:44px;border-top:1px solid var(--border2);border-right:1px solid var(--border2);}
.corner-orn.bl{bottom:32px;left:32px;width:44px;height:44px;border-bottom:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.br{bottom:32px;right:32px;width:44px;height:44px;border-bottom:1px solid var(--border2);border-right:1px solid var(--border2);}
.cta-eyebrow{font-family:var(--f-body);font-size:10px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:18px;}
.cta-eyebrow-ln{height:1px;width:44px;background:linear-gradient(90deg,transparent,var(--gold));}
.cta-eyebrow-ln.r{background:linear-gradient(90deg,var(--gold),transparent);}
.cta-title{font-family:var(--f-display);font-size:clamp(56px,10vw,150px);line-height:0.88;letter-spacing:0.05em;margin-bottom:20px;}
.cta-title em{font-style:normal;display:block;background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 40px rgba(196,154,60,0.4));}
.cta-sub{font-family:var(--f-serif);font-size:19px;font-style:italic;color:var(--muted);margin-bottom:80px;max-width:660px;margin-left:auto;margin-right:auto;}
.cta-btns{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;}

/* ══ FOOTER ══════════════════════════════════════════════════════ */
.footer{background:var(--deep);border-top:1px solid var(--border);padding:120px 0 0;position:relative;}
.footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);}
.ft-grid{display:grid;grid-template-columns:2.5fr 1fr 1fr 1.5fr;gap:80px;padding-bottom:80px;border-bottom:1px solid var(--border);}
.ft-logo{height:44px;margin-bottom:28px;filter:drop-shadow(0 0 10px rgba(196,154,60,0.22));display:block;}
.ft-desc{font-family:var(--f-serif);font-size:15px;font-style:italic;color:var(--muted);line-height:1.95;max-width:300px;margin-bottom:32px;}
.ft-socials{display:flex;gap:12px;}
.ft-soc{width:44px;height:44px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px;text-decoration:none;font-family:var(--f-body);font-weight:700;letter-spacing:0.05em;transition:all 0.3s var(--ease3);}
.ft-soc:hover{border-color:var(--gold);color:var(--gold);background:rgba(196,154,60,0.07);box-shadow:0 0 24px rgba(196,154,60,0.22);transform:translateY(-3px)scale(1.08);}
.ft-col-h{font-family:var(--f-body);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:32px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:16px;}
.ft-link{font-family:var(--f-serif);font-size:14px;color:var(--muted);text-decoration:none;transition:color 0.3s;display:flex;align-items:center;gap:10px;}
.ft-link::before{content:'';width:0;height:1px;background:linear-gradient(90deg,var(--gold),var(--gold3));transition:width 0.3s;}
.ft-link:hover{color:var(--gold3);}
.ft-link:hover::before{width:18px;}
.ft-ci{font-family:var(--f-serif);font-size:14px;color:var(--muted);margin-bottom:14px;line-height:1.7;}
.ft-ci a{color:inherit;text-decoration:none;transition:color 0.3s;}
.ft-ci a:hover{color:var(--gold3);}
.ft-cl{font-family:var(--f-body);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:rgba(196,154,60,0.28);margin-bottom:4px;}
.ft-bot{display:flex;justify-content:space-between;align-items:center;padding:32px 0;gap:20px;}
.ft-copy{font-family:var(--f-body);font-size:9px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--faint);}
.ft-orn{display:flex;align-items:center;gap:14px;}
.ft-orn-ln{height:1px;width:44px;background:var(--border);}
.ft-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 8px rgba(196,154,60,0.4);animation:spinSlow 6s linear infinite;}
.ft-bot-links{display:flex;gap:32px;}
.ft-bot-a{font-family:var(--f-body);font-size:9px;font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:var(--faint);text-decoration:none;transition:color 0.3s;}
.ft-bot-a:hover{color:var(--gold);}

/* ══ SPARKLES ══════════════════════════════════════════════════════ */
@keyframes sparkA{0%{opacity:0;transform:translateY(0)scale(0)rotate(0deg);}15%{opacity:1;transform:translateY(-20px)scale(1)rotate(90deg);}85%{opacity:1;}100%{opacity:0;transform:translateY(var(--sy,-80px))scale(0.5)rotate(var(--sr,360deg));}}
.sp{position:absolute;pointer-events:none;font-size:var(--spz,10px);color:var(--gold);animation:sparkA var(--spdur,3s) var(--spd,0s) ease-in-out infinite;opacity:0;}

/* ══ RESPONSIVE ══════════════════════════════════════════════════ */
@media(max-width:1280px){
  .mandate-in{gap:72px;}
  .ft-grid{grid-template-columns:1fr 1fr;gap:48px;}
}
@media(max-width:1100px){
  .mandate-in{grid-template-columns:1fr;}
  .panel-grid{grid-template-columns:1fr;}
  .gallery-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto;}
  .gallery-grid .g-cell:first-child{grid-row:span 1;}
  .g-cell-img,.g-cell:first-child .g-cell-img{min-height:240px;}
  .calling-grid{grid-template-columns:1fr 1fr;}
  .stats{grid-template-columns:repeat(2,1fr);}
  .stats .stat::after{display:none;}
  .stats .stat:nth-child(odd)::after{content:'';display:block;position:absolute;right:0;top:20%;bottom:20%;width:1px;background:var(--border);}
}
@media(max-width:900px){
  .nav{padding:18px 28px;}
  .nav.s{padding:14px 28px;}
  .nav-links{display:none;}
  .burger{display:flex;}
  .s-wrap{padding:0 28px;}
  .mandate,.calling,.panel-sec,.gallery-sec,.test-sec{padding:96px 0;}
  .cta-sec{padding:96px 28px;}
  .footer{padding:80px 0 0;}
  .ft-grid{padding:0 28px 60px;}
  .ft-bot{padding:24px 28px;flex-direction:column;text-align:center;}
  .gallery-grid{grid-template-columns:1fr;}
  .calling-grid{grid-template-columns:1fr;}
  .calling-hdr{flex-direction:column;align-items:flex-start;gap:24px;}
  .gallery-hdr{flex-direction:column;align-items:flex-start;gap:24px;}
  .t-card{padding:44px 32px;}
  .t-txt{font-size:17px;}
  .stats{padding:48px 0;}
  .verse-banner{padding:80px 28px;}
  .sched-panel,.pastor-panel{padding:48px 32px;}
  .mandate-in{gap:48px;}
  .img-main{height:380px;}
  .img-frame{display:none;}
}
@media(max-width:640px){
  .ft-grid{grid-template-columns:1fr;}
  .hero-ctas{gap:12px;}
  .btn-g,.btn-h{padding:16px 20px;font-size:9px;}
  .hero-verse .verse-box{padding:28px 22px;}
  .verse-txt{font-size:16px;}
  .cta-sec{padding:72px 20px;}
  .cta-sub{margin-bottom:48px;}
  .calling-grid{gap:0;}
  .holo-card{padding:40px 28px 36px;}
  .t-card{padding:36px 24px;}
  .ft-bot-links{gap:20px;}
  .s-wrap{padding:0 20px;}
  .stats{padding:36px 0;}
  .stat{padding:16px 8px;}
  .sched-panel,.pastor-panel{padding:36px 24px;}
  .marq-item{font-size:clamp(36px,10vw,80px);padding:0 24px;}
  .panel-sec{padding:72px 0;}
  .gallery-sec,.mandate,.calling{padding:72px 0;}
  .test-sec{padding:72px 0;}
  .footer{padding:60px 0 0;}
  .banner-q::before{font-size:100px;top:-40px;left:-10px;}
  .mob-a{font-size:clamp(32px,9vw,60px);}
}
@media(max-width:400px){
  .hero-t1,.hero-t2{font-size:clamp(58px,17vw,90px);}
  .s-h2{font-size:clamp(36px,10vw,60px);}
}
img{max-width:100%;height:auto;}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.001ms!important;animation-iteration-count:1!important;transition-duration:0.001ms!important;}
}
`;

/* ═══════════════════════════════════════════ CONSTANTS ══ */
const NAV = [
  { l: "Home", to: "/" },
  { l: "About", to: "/about" },
  { l: "Events", to: "/events" },
  { l: "Sermons", to: "/sermons" },
  { l: "Contact", to: "/contact" },
];

const GALLERY_IMGS = [
  "https://smhos.org/wp-content/uploads/2023/02/G88A7449-scaled.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/IMG_9857-scaled.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/DSC01705-scaled.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/DSC01765-scaled.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/DSC01726-1-scaled.jpg",
];

const CALLING_CARDS = [
  {
    num: "01",
    icon: "✦",
    label: "Grow in Faith",
    title: "WEEKLY\nFELLOWSHIP",
    to: "/events",
    desc: "Engaging sessions of worship, the Word and community bonding.",
  },
  {
    num: "02",
    icon: "◈",
    label: "Lead & Serve",
    title: "LEADERSHIP\nDEVELOPMENT",
    to: "/forms",
    desc: "Unlock your God-given potential to lead with purpose and excellence.",
  },
  {
    num: "03",
    icon: "✧",
    label: "Excel & Thrive",
    title: "ACADEMIC\nSUPPORT",
    to: "/forms",
    desc: "Resources and mentorship to excel both academically and spiritually.",
  },
];

const TESTIMONIALS = [
  {
    text: "Since joining Campus Ministry, my prayer life has transformed completely. I went from struggling academically to graduating with honours. The community here truly pushes you to be everything God designed you to be.",
    author: "Tolu Adeyemi",
    location: "University of Lagos",
  },
  {
    text: "The leadership training I received changed the trajectory of my life. I was a shy first-year student who barely spoke in class. Now I lead a fellowship of over 200 students. God's grace is truly real here.",
    author: "Chukwuemeka Eze",
    location: "University of Port Harcourt",
  },
  {
    text: "I came to Port Harcourt alone, knowing nobody. Campus Ministry became my family. The weekly fellowship, the mentorship, the genuine love — I have never felt so seen and so championed in my entire life.",
    author: "Chiamaka Obi",
    location: "Rivers State University",
  },
];

const SCHEDULE = [
  { day: "MON", name: "Campus Fellowship", time: "5:00 PM — On Campus" },
  { day: "TUE", name: "Unique Fellowship", time: "6:00 PM – 7:00 PM" },
  { day: "SUN", name: "Main Service", time: "6:30 AM · 8:00 AM · 9:30 AM" },
];

const TICKER_ITEMS = [
  "Campus Ministry — Salvation Ministries",
  "Monday Fellowships — 5:00 PM On Campus",
  "Tuesday Unique Fellowship — 6:00 PM",
  "Leadership Development · Faith Growth",
  "Transforming Students for Kingdom Impact",
  "Port Harcourt, Rivers State, Nigeria",
];

/* ════════════════════════════════════════════ HOOKS ══ */
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
            e.target.classList.add("v");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -36px 0px" },
    );
    document
      .querySelectorAll(".rev,.rev-l,.rev-r")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useCountUp(target, dur = 2000, suffix = "") {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started || isNaN(target)) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, dur]);
  return { ref, display: isNaN(target) ? target : `${count}${suffix}` };
}

/* ════════════════════════════════════════ COMPONENTS ══ */

/* Sacred Geometry */
function SacredGeo({ size = 940 }) {
  const c = size / 2,
    r = size * 0.44;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  });
  const tri1 = pts
    .filter((_, i) => i % 2 === 0)
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
  const tri2 = pts
    .filter((_, i) => i % 2 === 1)
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
  const mr = r * 0.57;
  const mpts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [c + mr * Math.cos(a), c + mr * Math.sin(a)];
  });
  return (
    <div className="geo-wrap">
      <svg
        className="geo"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <g className="geo-out" style={{ transformOrigin: `${c}px ${c}px` }}>
          <polygon
            points={tri1}
            fill="none"
            stroke="#C49A3C"
            strokeWidth="0.75"
            opacity="0.7"
          />
          <polygon
            points={tri2}
            fill="none"
            stroke="#DDB96A"
            strokeWidth="0.75"
            opacity="0.6"
          />
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="#C49A3C"
            strokeWidth="0.5"
            opacity="0.45"
          />
          <circle
            cx={c}
            cy={c}
            r={r * 0.57}
            fill="none"
            stroke="#C49A3C"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <circle
            cx={c}
            cy={c}
            r={r * 0.28}
            fill="none"
            stroke="#DDB96A"
            strokeWidth="0.5"
            opacity="0.55"
          />
          {pts.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r * 0.44}
              fill="none"
              stroke="#C49A3C"
              strokeWidth="0.35"
              opacity="0.22"
            />
          ))}
        </g>
        <g className="geo-in" style={{ transformOrigin: `${c}px ${c}px` }}>
          {mpts.map(([x, y], i) => (
            <line
              key={i}
              x1={c}
              y1={c}
              x2={x}
              y2={y}
              stroke="#C49A3C"
              strokeWidth="0.35"
              opacity="0.28"
            />
          ))}
          {pts.map(([x, y], i) => {
            const nx = pts[(i + 1) % 6];
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={nx[0]}
                y2={nx[1]}
                stroke="#DDB96A"
                strokeWidth="0.35"
                opacity="0.22"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* Particle Canvas */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf,
      particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 80; i++) {
      const isStar = Math.random() < 0.18;
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        r: Math.random() * (isStar ? 2.5 : 1.4) + 0.3,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.32 + 0.07),
        alpha: Math.random() * 0.45 + 0.08,
        life: Math.random(),
        isStar,
      });
    }
    const drawStar = (cx, x, y, r, a) => {
      cx.save();
      cx.translate(x, y);
      cx.rotate(Math.PI / 4);
      cx.fillStyle = `rgba(196,154,60,${a})`;
      for (let i = 0; i < 4; i++) {
        cx.fillRect(-r / 2, -r * 2, r, r * 4);
        cx.rotate(Math.PI / 4);
      }
      cx.restore();
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.0028;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 0;
          p.alpha = Math.random() * 0.45 + 0.08;
        }
        const fade = Math.sin(p.life * Math.PI);
        if (p.isStar) drawStar(ctx, p.x, p.y, p.r * 0.9, p.alpha * fade * 0.7);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,154,60,${p.alpha * fade})`;
          ctx.fill();
        }
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

/* Holographic Card — uses React Router Link for internal routes */
function HoloCard({ children, className, style, to }) {
  const ref = useRef(null);
  const holoRef = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(800px) rotateY(${(x - 0.5) * 14}deg) rotateX(${-(y - 0.5) * 14}deg) scale3d(1.03,1.03,1.03)`;
    if (holoRef.current) {
      holoRef.current.style.setProperty("--hx", `${x * 100}%`);
      holoRef.current.style.setProperty("--hy", `${y * 100}%`);
      holoRef.current.style.setProperty("--holo-angle", `${x * 360}deg`);
    }
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  }, []);
  return (
    <Link
      ref={ref}
      to={to}
      className={className}
      style={{
        ...style,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={holoRef} className="holo-inner" />
      {children}
    </Link>
  );
}

/* Cursor */
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
        "h",
        !!e.target.closest("a,button,[role='button']"),
      );
    };
    const loop = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
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

/* Loader */
function Loader({ done }) {
  return (
    <div className={`loader${done ? " out" : ""}`}>
      <div className="ldr-cross">
        <div className="ldr-glow" />
        <svg className="ldr-svg" width="80" height="80" viewBox="0 0 80 80">
          <circle className="ldr-c" cx="40" cy="40" r="39" />
          <path className="ldr-x" d="M40 12 L40 68 M16 40 L64 40" />
        </svg>
      </div>
      <div className="ldr-txt">Campus Ministry</div>
      <div className="ldr-sub">Salvation Ministries</div>
      <div className="ldr-bar">
        <div className="ldr-fill" />
      </div>
    </div>
  );
}

/* Sparkles */
function Sparkles({ count = 10 }) {
  const [sparks] = useState(() =>
    Array.from({ length: count }, () => ({
      left: `${10 + Math.random() * 80}%`,
      bottom: `${Math.random() * 45}%`,
      sy: `${-(40 + Math.random() * 65)}px`,
      sr: `${180 + Math.random() * 360}deg`,
      spz: `${8 + Math.random() * 6}px`,
      spdur: `${2.5 + Math.random() * 2.5}s`,
      spd: `${Math.random() * 3.5}s`,
      symbol: ["✦", "✧", "◆", "·", "★"][Math.floor(Math.random() * 5)],
    })),
  );
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {sparks.map((s, i) => (
        <span
          key={i}
          className="sp"
          style={{
            left: s.left,
            bottom: s.bottom,
            "--sy": s.sy,
            "--sr": s.sr,
            "--spz": s.spz,
            "--spdur": s.spdur,
            "--spd": s.spd,
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

/* Stat Card */
function StatCard({ num, label, delay }) {
  const raw = parseInt(num.replace(/\D/g, ""), 10);
  const suffix = num.replace(/[0-9]/g, "");
  const { ref, display } = useCountUp(isNaN(raw) ? NaN : raw, 2200, suffix);
  return (
    <div
      className="stat rev"
      style={{ transitionDelay: `${delay}s` }}
      ref={ref}
    >
      <div className="stat-n">{isNaN(raw) ? num : display}</div>
      <div className="stat-l">{label}</div>
    </div>
  );
}

/**
 * MagBtn — magnetic button with React Router support.
 *  - Pass `to` for internal Link navigation
 *  - Pass `href` for external <a> links
 */
function MagBtn({ href, to, className, children }) {
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

  const shared = {
    ref,
    className,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    style: {
      transition: "transform 0.4s var(--ease3),box-shadow 0.3s",
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
    },
  };

  if (to) {
    return (
      <Link to={to} {...shared}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" {...shared}>
      {children}
    </a>
  );
}

/* ════════════════════════════════════ MAIN EXPORT ══ */
export default function CampusMinistry() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [testIdx, setTestIdx] = useState(0);
  const scrolled = useScrolled();
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () => setTestIdx((i) => (i + 1) % TESTIMONIALS.length),
      7500,
    );
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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

      {/* ══ NAV ══ */}
      <nav className={`nav${scrolled ? " s" : ""}`}>
        <Link to="/" className="nav-logo">
          <img
            src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
            alt="Salvation Ministries"
          />
        </Link>

        <div className="nav-links">
          {NAV.map((l, i) => (
            <Link key={i} to={l.to} className="nav-a">
              {l.l}
            </Link>
          ))}
          <Link to="/give" className="nav-give">
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

      {/* MOBILE NAV */}
      <div className={`mob-nav${menuOpen ? " open" : ""}`}>
        <div className="mob-links">
          {[
            ...NAV,
            { l: "Store", to: null, href: "https://smhosstore.com" },
          ].map((l, i) =>
            l.href ? (
              <a
                key={i}
                href={l.href}
                className="mob-a"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
              >
                {l.l}
              </a>
            ) : (
              <Link
                key={i}
                to={l.to}
                className="mob-a"
                onClick={() => setMenuOpen(false)}
              >
                {l.l}
              </Link>
            ),
          )}
        </div>
        <Link to="/give" className="mob-cta" onClick={() => setMenuOpen(false)}>
          Give Online
        </Link>
      </div>

      {/* ══ HERO ══ */}
      <section className="hero">
        <ParticleCanvas />
        <div className="aurora" />
        <div className="god-rays" />
        <SacredGeo size={960} />
        <div className="rings">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="ring" />
          ))}
        </div>
        <div className="hero-glow" />

        <div className="hero-cnt">
          <div className="hero-eyebrow">
            <div className="eyebrow-line" />
            Salvation Ministries
            <div className="eyebrow-line r" />
          </div>
          <h1>
            <div className="hero-t1 glitch neon-f" data-t="CAMPUS">
              CAMPUS
            </div>
            <div className="hero-t2 prism">MINISTRY</div>
          </h1>
          <p className="hero-tagline">Where Faith Meets Excellence</p>

          {/* ── Clean bordered verse box — no spinning shimmer ── */}
          <div className="hero-verse">
            <div className="verse-box">
              <div className="verse-corner tl" />
              <div className="verse-corner br" />
              <p className="verse-txt">
                "But on Mount Zion there shall be deliverance, and there shall
                be holiness; the house of Jacob shall possess their
                possessions."
              </p>
              <div className="verse-ref">Obadiah 1:17 · NKJV</div>
            </div>
          </div>

          <div className="hero-ctas">
            <MagBtn to="/events" className="btn-g">
              <span>Join Fellowship</span>
              <span className="btn-arr">→</span>
            </MagBtn>
            <MagBtn to="/forms" className="btn-h">
              <span>Get Connected</span>
              <span className="btn-arr">→</span>
            </MagBtn>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-lbl">Scroll</div>
          <div className="scroll-track">
            <div className="scroll-fill" />
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

      {/* STATS */}
      <div className="stats">
        <div className="stats-glow" />
        {[
          { num: "50+", label: "Campus Chapters" },
          { num: "5000+", label: "Student Members" },
          { num: "27+", label: "Years of Ministry" },
          { num: "100%", label: "Kingdom Focused" },
        ].map((s, i) => (
          <StatCard key={i} num={s.num} label={s.label} delay={i * 0.1} />
        ))}
      </div>

      {/* MARQUEE */}
      <div className="marquee-row">
        <div className="marquee-inner">
          {[
            "CAMPUS",
            "FAITH",
            "GLORY",
            "LEADERSHIP",
            "VICTORY",
            "GRACE",
            "CAMPUS",
            "FAITH",
            "GLORY",
            "LEADERSHIP",
            "VICTORY",
            "GRACE",
          ].map((w, i) => (
            <span key={i} className="marq-item">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* ══ MANDATE ══ */}
      <section className="mandate">
        <div className="s-wrap">
          <div className="mandate-in">
            <div className="rev-l">
              <div className="img-wrap">
                <div className="img-frame" />
                <img
                  src="https://smhos.org/wp-content/uploads/2023/02/IMG_0109-scaled.jpg"
                  alt="Campus Ministry"
                  className="img-main"
                />
                <div className="img-tag">Est. 1997 · Port Harcourt</div>
              </div>
            </div>
            <div className="rev-r">
              <span className="m-year">FAITH</span>
              <div className="s-lbl">
                <div className="s-lbl-ln" />
                Our Mission
              </div>
              <h2 className="s-h2">
                WHERE STUDENTS DISCOVER
                <br />
                <em>Their Purpose</em>
              </h2>
              <div className="s-orn" />
              <p className="m-body">
                At Salvation Ministries, Campus Ministry serves as a vibrant hub
                for students across universities and polytechnics. It's a place
                where young minds are nurtured, faith is deepened, and
                leadership qualities are honed for kingdom impact.
              </p>
              <p className="m-body">
                We believe every student carries a divine mandate — and our
                calling is to help you discover, develop and deploy it for God's
                glory on campus and beyond.
              </p>
              <div
                style={{
                  marginTop: 56,
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <MagBtn to="/forms" className="btn-g">
                  <span>Join Us Today</span>
                  <span className="btn-arr">→</span>
                </MagBtn>
                <MagBtn to="/livestream" className="btn-h">
                  <span>Watch Livestream</span>
                </MagBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CALLING CARDS ══ */}
      <section className="calling">
        <div className="calling-bg" aria-hidden>
          FAITH
        </div>
        <div className="s-wrap">
          <div className="calling-hdr">
            <div>
              <div className="s-lbl rev">
                <div className="s-lbl-ln" />
                What We Offer
              </div>
              <h2 className="s-h2 rev" style={{ transitionDelay: "0.1s" }}>
                BUILT TO TRANSFORM
                <br />
                <em>Every Student</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <p
                style={{
                  fontFamily: "var(--f-serif)",
                  fontSize: 17,
                  fontStyle: "italic",
                  color: "var(--muted)",
                  lineHeight: 1.9,
                  maxWidth: 340,
                }}
              >
                Join us to experience a journey that balances academic
                excellence with spiritual growth.
              </p>
            </div>
          </div>
          <div className="calling-grid">
            {CALLING_CARDS.map((c, i) => (
              <HoloCard
                key={i}
                to={c.to}
                className="holo-card rev"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div className="holo-bg" />
                <div className="c-top">
                  <div className="c-num">{c.num}</div>
                  <div className="c-icon">{c.icon}</div>
                </div>
                <div className="c-lbl">{c.label}</div>
                <div className="c-title">
                  {c.title.split("\n").map((l, j) => (
                    <span key={j} style={{ display: "block" }}>
                      {l}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "var(--f-serif)",
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                    marginBottom: 28,
                  }}
                >
                  {c.desc}
                </div>
                <div className="c-div" />
                <div className="c-cta">
                  Explore <span>→</span>
                </div>
              </HoloCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VERSE BANNER ══ */}
      <div className="verse-banner">
        <div className="starburst" />
        <div className="s-wrap">
          <div className="rev">
            <blockquote className="banner-q">
              "Join us to experience a transformative journey that balances
              academic pursuits with spiritual growth — because excellence and
              faith are not opposites."
            </blockquote>
            <div className="banner-attr">
              — Campus Ministry · Salvation Ministries
            </div>
          </div>
        </div>
      </div>

      {/* ══ SCHEDULE + PASTOR ══ */}
      <section className="panel-sec">
        <div className="s-wrap">
          <div className="s-lbl rev" style={{ marginBottom: 56 }}>
            <div className="s-lbl-ln" />
            Be Part of the Community
          </div>
          <div className="panel-grid">
            {/* Schedule */}
            <div className="sched-panel rev-l">
              <div className="s-lbl" style={{ marginBottom: 36 }}>
                <div className="s-lbl-ln" />
                Meeting Times
              </div>
              <h3
                style={{
                  fontFamily: "var(--f-display)",
                  fontSize: "clamp(32px,4vw,60px)",
                  color: "var(--white)",
                  letterSpacing: "0.05em",
                  marginBottom: 48,
                  lineHeight: 0.9,
                }}
              >
                WEEKLY
                <br />
                <span style={{ color: "var(--gold)" }}>SCHEDULE</span>
              </h3>

              {SCHEDULE.map((s, i) => (
                <div key={i} className="sched-item">
                  <div className="sched-date">
                    <div className="sched-day">{s.day}</div>
                    <div className="sched-mon">Weekly</div>
                  </div>
                  <div className="sched-info">
                    <div className="sched-name">{s.name}</div>
                    <div className="sched-time">{s.time}</div>
                  </div>
                  <div className="sched-arr">→</div>
                </div>
              ))}

              <div className="office-block" style={{ marginTop: 48 }}>
                <div className="office-lbl">Ministry Office</div>
                <div className="office-addr">
                  Plot 17 Birabi Street,
                  <br />
                  GRA Phase 1, Port Harcourt,
                  <br />
                  Rivers State, Nigeria.
                </div>
              </div>

              <div
                style={{
                  marginTop: 48,
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <MagBtn to="/events" className="btn-g">
                  <span>View All Events</span>
                  <span className="btn-arr">→</span>
                </MagBtn>
                <MagBtn to="/forms" className="btn-h">
                  <span>Contact Us</span>
                </MagBtn>
              </div>
            </div>

            {/* Pastor */}
            <div className="pastor-panel rev-r">
              <div className="p-img-wrap">
                <img
                  src="https://smhos.org/wp-content/uploads/2023/02/1623931033724.jpeg"
                  alt="Pst. David Bob-Manuel"
                  className="p-img"
                />
                <div className="p-img-badge">Campus Ministry Pastor</div>
              </div>
              <span className="p-qmark">"</span>
              <blockquote className="p-quote">
                Every student on campus carries the seed of greatness. Our
                mandate is to water that seed with the Word of God until it
                becomes an unshakeable tree of righteousness that transforms
                their generation.
              </blockquote>
              <div style={{ marginBottom: 8 }}>
                <div className="p-name">DAVID BOB-MANUEL</div>
              </div>
              <div className="p-role">
                Campus Ministry Pastor · Salvation Ministries
              </div>
              <div style={{ marginTop: 40 }}>
                <MagBtn to="/forms" className="btn-h">
                  <span>Connect with Pastor</span>
                  <span className="btn-arr">→</span>
                </MagBtn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section className="gallery-sec">
        <div className="s-wrap">
          <div className="gallery-hdr">
            <div>
              <div className="s-lbl rev">
                <div className="s-lbl-ln" />
                Campus Life
              </div>
              <h2 className="s-h2 rev" style={{ transitionDelay: "0.1s" }}>
                MOMENTS OF
                <br />
                <em>Kingdom Impact</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <p
                style={{
                  fontFamily: "var(--f-serif)",
                  fontSize: 16,
                  fontStyle: "italic",
                  color: "var(--muted)",
                  lineHeight: 1.9,
                  maxWidth: 300,
                }}
              >
                Every gathering is a holy moment — lives being transformed one
                campus at a time.
              </p>
            </div>
          </div>
          <div className="gallery-grid">
            {GALLERY_IMGS.map((src, i) => (
              <div
                key={i}
                className="g-cell rev"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <img src={src} alt="" className="g-cell-img" />
                <div className="g-cell-ov" />
                <div className="g-cell-glow" />
                <div className="g-gline" />
                <div className="g-content">
                  <div className="g-lbl">Campus Fellowship</div>
                  <div className="g-title">COMMUNITY</div>
                  <div className="g-arr">
                    <span className="g-arr-line" />
                    View
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="test-sec">
        <div className="test-bg" />
        <Sparkles count={14} />
        <div className="s-wrap">
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div className="s-lbl rev" style={{ justifyContent: "center" }}>
              <div className="s-lbl-ln" />
              Testimonials
              <div className="s-lbl-ln" style={{ transform: "scaleX(-1)" }} />
            </div>
            <h2
              className="s-h2 rev"
              style={{ textAlign: "center", transitionDelay: "0.1s" }}
            >
              LIVES <em>Transformed</em>
            </h2>
          </div>
          <div className="rev" style={{ transitionDelay: "0.2s" }}>
            <div className="t-card">
              <div className="t-glow-orb" />
              <div className="t-qm">"</div>
              <p className="t-txt">{TESTIMONIALS[testIdx].text}</p>
              <div className="t-auth">
                <div className="t-line" />
                <div>
                  <div className="t-name">{TESTIMONIALS[testIdx].author}</div>
                  <div className="t-loc">{TESTIMONIALS[testIdx].location}</div>
                </div>
              </div>
            </div>
            <div className="t-nav">
              <div className="t-dots-row">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    className={`t-dot-btn${i === testIdx ? " on" : ""}`}
                    onClick={() => setTestIdx(i)}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <div className="t-nav-btns">
                <button
                  className="t-btn"
                  onClick={() =>
                    setTestIdx(
                      (i) =>
                        (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                    )
                  }
                >
                  ‹
                </button>
                <button
                  className="t-btn"
                  onClick={() =>
                    setTestIdx((i) => (i + 1) % TESTIMONIALS.length)
                  }
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ RELATED MINISTRIES ══ */}
      <section style={{ background: "var(--dark)", padding: "160px 0" }}>
        <div className="s-wrap">
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="s-lbl rev" style={{ justifyContent: "center" }}>
              <div className="s-lbl-ln" />
              Explore More
              <div className="s-lbl-ln" style={{ transform: "scaleX(-1)" }} />
            </div>
            <h2
              className="s-h2 rev"
              style={{ textAlign: "center", transitionDelay: "0.1s" }}
            >
              RELATED <em>Ministries</em>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 3,
              background: "var(--faint)",
            }}
          >
            {[
              {
                label: "LEADING LIGHTS",
                sub: "Children's Ministry",
                img: "https://smhos.org/wp-content/uploads/2023/02/IMG_7682x-768x512.jpg",
                to: "/ministry/children",
              },
              {
                label: "YOUTH MINISTRY",
                sub: "Youth Ministry",
                img: "https://smhos.org/wp-content/uploads/2023/02/IMG_2568-scaled-1-1536x1024-1-768x512.jpeg",
                to: "/ministry/youth",
              },
            ].map((m, i) => (
              <Link
                key={i}
                to={m.to}
                className="g-cell rev"
                style={{ transitionDelay: `${i * 0.15}s`, aspectRatio: "4/3" }}
              >
                <img
                  src={m.img}
                  alt={m.label}
                  className="g-cell-img"
                  style={{ height: "100%", minHeight: "unset" }}
                />
                <div className="g-cell-ov" />
                <div className="g-cell-glow" />
                <div className="g-gline" />
                <div className="g-content">
                  <div className="g-lbl">{m.sub}</div>
                  <div className="g-title">{m.label}</div>
                  <div className="g-arr">
                    <span className="g-arr-line" />
                    Learn More
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-sec">
        <div className="cta-cross-v" />
        <div className="cta-cross-h" />
        <div className="cta-glow" />
        <div className="starburst" />
        <div className="corner-orn tl" />
        <div className="corner-orn tr" />
        <div className="corner-orn bl" />
        <div className="corner-orn br" />
        <Sparkles count={18} />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 980,
            margin: "0 auto",
          }}
        >
          <div className="cta-eyebrow rev">
            <div className="cta-eyebrow-ln" />
            Experience God Here
            <div className="cta-eyebrow-ln r" />
          </div>
          <h2 className="cta-title rev" style={{ transitionDelay: "0.1s" }}>
            JOIN
            <em>
              THE CAMPUS
              <br />
              FAMILY
            </em>
          </h2>
          <p className="cta-sub rev" style={{ transitionDelay: "0.2s" }}>
            Step into a community of believers who are passionate about faith,
            academic excellence and kingdom purpose.
          </p>
          <div className="cta-btns rev" style={{ transitionDelay: "0.3s" }}>
            <MagBtn to="/events" className="btn-g">
              <span>Join Fellowship</span>
              <span className="btn-arr">→</span>
            </MagBtn>
            <MagBtn to="/livestream" className="btn-h">
              <span>Watch Livestream</span>
            </MagBtn>
            <MagBtn to="/give" className="btn-h">
              <span>Give Online</span>
            </MagBtn>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="footer">
        <div className="s-wrap">
          <div className="ft-grid">
            {/* Brand */}
            <div>
              <Link to="/">
                <img
                  src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
                  alt="Salvation Ministries"
                  className="ft-logo"
                />
              </Link>
              <p className="ft-desc">
                Campus Ministry — Salvation Ministries. Transforming students
                for kingdom impact across universities and polytechnics in
                Nigeria and beyond.
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
                <Link to="/livestream" className="ft-soc">
                  ▶
                </Link>
              </div>
            </div>

            {/* Navigate */}
            <div>
              <div className="ft-col-h">Navigate</div>
              <ul className="ft-links">
                {[
                  ["Home", "/"],
                  ["About Us", "/about"],
                  ["Events", "/events"],
                  ["Sermons", "/sermons"],
                  ["Forms", "/forms"],
                  ["Livestream", "/livestream"],
                ].map(([l, to]) => (
                  <li key={l}>
                    <Link to={to} className="ft-link">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ministries */}
            <div>
              <div className="ft-col-h">Ministries</div>
              <ul className="ft-links">
                <li>
                  <Link to="/ministry/campus" className="ft-link">
                    Campus Ministry
                  </Link>
                </li>
                <li>
                  <Link to="/ministry/children" className="ft-link">
                    Leading Lights
                  </Link>
                </li>
                <li>
                  <Link to="/ministry/youth" className="ft-link">
                    Youth Ministry
                  </Link>
                </li>
                <li>
                  <a
                    href="https://learn.swolbi.org"
                    className="ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    SWOLBI
                  </a>
                </li>
                <li>
                  <a
                    href="https://chokhmah.org.ng"
                    className="ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chokhmah
                  </a>
                </li>
                <li>
                  <Link to="/locator" className="ft-link">
                    Church Locator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="ft-col-h">Contact</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {[
                  [
                    "Phone",
                    <a href="tel:+2348033123743">+234 (803) 312 3743</a>,
                  ],
                  ["Email", <a href="mailto:info@smhos.org">info@smhos.org</a>],
                  [
                    "Address",
                    "Plot 17 Birabi Street,\nGRA Phase 1,\nPort Harcourt, Rivers, Nigeria",
                  ],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="ft-cl">{label}</div>
                    <div className="ft-ci" style={{ whiteSpace: "pre-line" }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ft-bot">
            <div className="ft-copy">
              © 2026 Salvation Ministries. All Rights Reserved.
            </div>
            <div className="ft-orn">
              <div className="ft-orn-ln" />
              <div className="ft-diamond" />
              <div className="ft-orn-ln" />
            </div>
            <div className="ft-bot-links">
              {[
                ["Contact", "/contact"],
                ["Give", "/give"],
                ["Forms", "/forms"],
              ].map(([l, to]) => (
                <Link key={l} to={to} className="ft-bot-a">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
