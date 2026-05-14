import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

@property --shimmer-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --holo-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --border-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

:root {
  --black: #05050A;
  --deep: #08080F;
  --dark: #0F0F1A;
  --mid: #1A1A2E;
  --panel: #12121E;
  --card: #161625;

  --gold: #C8A84B;
  --gold2: #E2C06A;
  --gold3: #F5D98A;
  --gold4: #FFF0BB;
  --glow: rgba(200,168,75,0.15);
  --glow2: rgba(200,168,75,0.06);
  --border: rgba(200,168,75,0.2);
  --border2: rgba(200,168,75,0.45);

  --white: #FDFAF4;
  --cream: #F5EDDA;
  --muted: #8A8070;
  --faint: #3A3830;

  --crimson: #9B1B30;
  --scarlet: #C0392B;
  --electric: #00FFAA;
  --neon: #FFD700;

  --f-display: 'Bebas Neue', sans-serif;
  --f-serif: 'Playfair Display', serif;
  --f-body: 'Libre Baskerville', serif;
  --f-ui: 'Montserrat', sans-serif;

  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ease2: cubic-bezier(0.76, 0, 0.24, 1);
  --ease3: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Fluid spacing scale */
  --sp-xs: clamp(8px, 1.5vw, 16px);
  --sp-sm: clamp(14px, 2.5vw, 28px);
  --sp-md: clamp(24px, 4vw, 48px);
  --sp-lg: clamp(40px, 6vw, 80px);
  --sp-xl: clamp(60px, 9vw, 148px);
  --sp-2xl: clamp(80px, 12vw, 200px);

  /* Fluid container padding */
  --pad: clamp(16px, 5vw, 64px);
}

body {
  background: var(--black);
  color: var(--white);
  font-family: var(--f-body);
  overflow-x: hidden;
}

::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--deep);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--gold3));border-radius:2px;}

.grain-overlay{
  position:fixed;inset:0;z-index:99994;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-repeat:repeat;background-size:128px 128px;
  opacity:0.032;mix-blend-mode:overlay;
  animation:grainShift 0.4s steps(3) infinite;
}
@keyframes grainShift{
  0%{transform:translate(0,0);}33%{transform:translate(-3px,2px);}
  66%{transform:translate(3px,-2px);}100%{transform:translate(-1px,3px);}
}

.cur-dot{position:fixed;pointer-events:none;z-index:99999;width:6px;height:6px;background:var(--gold3);border-radius:50%;transform:translate(-50%,-50%);transition:transform 0.08s;mix-blend-mode:difference;}
.cur-ring{position:fixed;pointer-events:none;z-index:99998;width:38px;height:38px;border:1.5px solid var(--border2);border-radius:50%;transform:translate(-50%,-50%);transition:width 0.3s var(--ease),height 0.3s var(--ease),border-color 0.3s,background 0.3s;}
.cur-ring.h{width:64px;height:64px;border-color:var(--gold);background:rgba(200,168,75,0.06);}
.cur-trail{position:fixed;pointer-events:none;z-index:99997;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(200,168,75,0.15) 0%,transparent 70%);transition:width 0.5s var(--ease),height 0.5s var(--ease);}

/* ── LOADER ── */
.sm-loader{position:fixed;inset:0;z-index:99990;background:var(--black);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.9s var(--ease),visibility 0.9s;padding:20px;}
.sm-loader.gone{opacity:0;visibility:hidden;}
.ldr-emblem{position:relative;margin-bottom:40px;width:clamp(60px,12vw,90px);height:clamp(60px,12vw,90px);}
.ldr-svg{position:absolute;inset:0;width:100%;height:100%;}
.ldr-circle-path{fill:none;stroke:var(--gold);stroke-width:1;stroke-dasharray:283;stroke-dashoffset:283;animation:circleDraw 2s var(--ease) infinite;}
@keyframes circleDraw{0%{stroke-dashoffset:283;opacity:0;}20%{opacity:1;}70%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-283;opacity:0;}}
.ldr-cross-path{fill:none;stroke:var(--gold3);stroke-width:2;stroke-linecap:round;stroke-dasharray:200;stroke-dashoffset:200;animation:crossDraw 2s var(--ease) 0.3s infinite;}
@keyframes crossDraw{0%{stroke-dashoffset:200;opacity:0;}20%{opacity:1;}70%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-200;opacity:0;}}
.ldr-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:80%;border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,0.3) 0%,transparent 70%);animation:glowPulse 2s ease-in-out infinite;}
@keyframes glowPulse{0%,100%{opacity:0.5;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.4);}}
.ldr-name{font-family:var(--f-display);font-size:clamp(14px,4vw,22px);letter-spacing:0.5em;color:var(--gold);animation:pulse 2s ease-in-out infinite;text-align:center;}
.ldr-bar{width:clamp(140px,50vw,200px);height:1px;background:var(--faint);margin-top:20px;overflow:hidden;}
.ldr-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:200% 100%;animation:loadBar 1.6s ease-in-out infinite;}
@keyframes loadBar{0%{width:0;margin-left:0;}50%{width:100%;margin-left:0;}100%{width:0;margin-left:100%;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}

/* ── NAV ── */
.sm-nav{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  padding:clamp(12px,2vw,24px) var(--pad);
  display:flex;align-items:center;justify-content:space-between;
  transition:all 0.5s var(--ease);
}
.sm-nav::after{content:'';position:absolute;inset:0;background:transparent;backdrop-filter:blur(0px);transition:all 0.5s;pointer-events:none;}
.sm-nav.scrolled{padding:clamp(10px,1.5vw,16px) var(--pad);}
.sm-nav.scrolled::after{background:rgba(5,5,10,0.94);backdrop-filter:blur(28px);border-bottom:1px solid var(--border);}
.nav-logo img{height:clamp(30px,5vw,46px);object-fit:contain;position:relative;z-index:1;filter:drop-shadow(0 0 14px rgba(200,168,75,0.4));transition:filter 0.4s;}
.nav-logo img:hover{filter:drop-shadow(0 0 28px rgba(200,168,75,0.7)) drop-shadow(0 0 60px rgba(200,168,75,0.3));}
.nav-links{display:flex;align-items:center;gap:clamp(16px,3vw,44px);position:relative;z-index:1;}
.nav-a{font-family:var(--f-ui);font-size:clamp(9px,1vw,11px);font-weight:600;letter-spacing:0.25em;text-transform:uppercase;color:rgba(253,250,244,0.6);text-decoration:none;position:relative;padding:4px 0;transition:color 0.3s;cursor:pointer;white-space:nowrap;}
.nav-a::after{content:'';position:absolute;bottom:-2px;left:50%;right:50%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transition:left 0.4s var(--ease),right 0.4s var(--ease);}
.nav-a:hover{color:var(--gold3);}
.nav-a:hover::after{left:0;right:0;}
.nav-sep{width:1px;height:22px;background:var(--border);}
.nav-give{font-family:var(--f-ui);font-size:clamp(9px,1vw,11px);font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:clamp(10px,1.5vw,14px) clamp(18px,2.5vw,32px);position:relative;overflow:hidden;transition:transform 0.3s,box-shadow 0.3s;box-shadow:0 4px 28px rgba(200,168,75,0.35);cursor:pointer;white-space:nowrap;}
.nav-give::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold4),var(--gold3));opacity:0;transition:opacity 0.3s;}
.nav-give::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.nav-give:hover{transform:translateY(-2px);box-shadow:0 10px 48px rgba(200,168,75,0.6);}
.nav-give:hover::before{opacity:1;}
.nav-give:hover::after{left:150%;}
.nav-give span{position:relative;z-index:1;}

/* Hide nav links on smaller screens, show burger */
.burger{display:none;flex-direction:column;gap:6px;cursor:pointer;background:none;border:none;padding:8px;z-index:1001;min-width:44px;min-height:44px;align-items:center;justify-content:center;}
.burger-ln{width:26px;height:1.5px;background:var(--white);transition:all 0.4s var(--ease);transform-origin:center;display:block;}
.burger.open .burger-ln:nth-child(1){transform:translateY(7.5px) rotate(45deg);}
.burger.open .burger-ln:nth-child(2){opacity:0;transform:scaleX(0);}
.burger.open .burger-ln:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);}

/* ── MOBILE NAV ── */
.mob-nav{
  position:fixed;inset:0;z-index:999;background:var(--deep);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  transform:translateX(100%);transition:transform 0.7s var(--ease2);
  overflow-y:auto;overflow-x:hidden;
  padding:clamp(70px,12vh,100px) clamp(20px,6vw,40px) clamp(30px,5vh,50px);
}
.mob-nav.open{transform:translateX(0);}
.mob-nav::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(200,168,75,0.06) 0%,transparent 70%);}
.mob-links{display:flex;flex-direction:column;align-items:center;gap:clamp(8px,2vh,14px);width:100%;}
.mob-a{font-family:var(--f-display);font-size:clamp(32px,10vw,72px);color:var(--white);text-decoration:none;letter-spacing:0.05em;opacity:0;transform:translateX(40px);transition:color 0.3s,opacity 0.5s,transform 0.5s;cursor:pointer;line-height:1.1;}
.mob-nav.open .mob-a{opacity:1;transform:translateX(0);}
.mob-nav.open .mob-a:nth-child(1){transition-delay:0.08s;}
.mob-nav.open .mob-a:nth-child(2){transition-delay:0.14s;}
.mob-nav.open .mob-a:nth-child(3){transition-delay:0.2s;}
.mob-nav.open .mob-a:nth-child(4){transition-delay:0.26s;}
.mob-nav.open .mob-a:nth-child(5){transition-delay:0.32s;}
.mob-nav.open .mob-a:nth-child(6){transition-delay:0.38s;}
.mob-nav.open .mob-a:nth-child(7){transition-delay:0.42s;}
.mob-nav.open .mob-a:nth-child(8){transition-delay:0.46s;}
.mob-a:hover{color:var(--gold);}
.mob-give{
  font-family:var(--f-ui);font-size:clamp(11px,2.5vw,13px);font-weight:700;letter-spacing:0.3em;
  text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));
  text-decoration:none;padding:clamp(14px,2.5vw,18px) clamp(36px,8vw,56px);
  margin-top:clamp(16px,3vh,28px);
  opacity:0;transform:translateY(20px);
  transition:opacity 0.5s 0.5s,transform 0.5s 0.5s;cursor:pointer;
}
.mob-nav.open .mob-give{opacity:1;transform:translateY(0);}

/* ── HERO ── */
.sm-hero{min-height:100svh;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--black);}
.hero-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}

.god-rays{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.god-rays::before{
  content:'';position:absolute;top:-60%;left:50%;transform-origin:top center;
  width:300%;height:200%;transform:translateX(-50%);
  background:conic-gradient(from 270deg at 50% 0%,transparent 0deg,rgba(200,168,75,0.035) 2.5deg,transparent 5deg,transparent 13deg,rgba(255,230,120,0.028) 15.5deg,transparent 18deg,transparent 26deg,rgba(200,168,75,0.04) 28.5deg,transparent 31deg,transparent 44deg,rgba(255,240,150,0.022) 46.5deg,transparent 49deg,transparent 58deg,rgba(200,168,75,0.035) 60.5deg,transparent 63deg,transparent 72deg,rgba(255,220,100,0.025) 74.5deg,transparent 77deg,transparent 88deg,rgba(200,168,75,0.03) 90.5deg,transparent 93deg,transparent 100deg);
  animation:godRaysRotate 120s linear infinite;
}
.god-rays::after{
  content:'';position:absolute;top:-60%;left:50%;transform-origin:top center;
  width:300%;height:200%;transform:translateX(-50%);
  background:conic-gradient(from 90deg at 50% 0%,transparent 0deg,rgba(200,168,75,0.025) 2deg,transparent 4deg,transparent 20deg,rgba(255,230,100,0.02) 22deg,transparent 24deg,transparent 42deg,rgba(200,168,75,0.03) 44deg,transparent 46deg,transparent 100deg);
  animation:godRaysRotate 80s linear infinite reverse;
}
@keyframes godRaysRotate{from{transform:translateX(-50%) rotate(0deg);}to{transform:translateX(-50%) rotate(360deg);}}

.lens-flare{position:absolute;top:28%;left:62%;pointer-events:none;animation:flareFloat 14s ease-in-out infinite;}
.lens-flare-core{width:10px;height:10px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.95) 0%,rgba(200,168,75,0.7) 30%,transparent 70%);box-shadow:0 0 30px 12px rgba(200,168,75,0.25),0 0 80px 30px rgba(200,168,75,0.1);position:relative;}
.lens-flare-streak{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(var(--a,0deg));width:220px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,0.12),rgba(255,255,255,0.06),transparent);}
.lens-flare-streak:nth-child(2){--a:30deg;width:160px;background:linear-gradient(90deg,transparent,rgba(200,168,75,0.08),transparent);}
.lens-flare-streak:nth-child(3){--a:-20deg;width:140px;}
.lens-flare-halo{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;border-radius:50%;border:1px solid rgba(200,168,75,0.15);animation:flareHalo 4s ease-in-out infinite;}
@keyframes flareFloat{0%,100%{transform:translate(0,0);opacity:0.7;}50%{transform:translate(-18px,-28px);opacity:1;}}
@keyframes flareHalo{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1;}50%{transform:translate(-50%,-50%) scale(1.6);opacity:0;}}

.aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.aurora::before{
  content:'';position:absolute;width:150%;height:150%;top:-25%;left:-25%;
  background:radial-gradient(ellipse 80% 40% at 20% 30%,rgba(200,168,75,0.05) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 80% 70%,rgba(155,27,48,0.035) 0%,transparent 60%),radial-gradient(ellipse 100% 60% at 50% 50%,rgba(200,168,75,0.025) 0%,transparent 70%);
  animation:auroraDrift 18s ease-in-out infinite alternate;
}
@keyframes auroraDrift{0%{transform:translate(0,0) scale(1);}100%{transform:translate(3%,2%) scale(1.06);}}

.hero-bg-img{position:absolute;inset:0;background:url('https://smhos.org/wp-content/uploads/2025/03/DSC02290-819x1024.jpg') center/cover;opacity:0.1;filter:saturate(0.3);}
.hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse 70% 100% at 50% 60%,rgba(200,168,75,0.07) 0%,var(--black) 70%);}

.sacred-geo-wrap{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;overflow:hidden;}
.sacred-geo{opacity:0.045;filter:drop-shadow(0 0 8px rgba(200,168,75,0.4));}
.sacred-geo-outer{animation:sacredOuter 180s linear infinite;}
.sacred-geo-inner{animation:sacredInner 120s linear infinite reverse;}
@keyframes sacredOuter{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes sacredInner{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

.hero-rings{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.h-ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid var(--border);transform:translate(-50%,-50%);animation:ringPulse 10s ease-in-out infinite;}
.h-ring:nth-child(1){width:clamp(160px,30vw,300px);height:clamp(160px,30vw,300px);border:2px solid rgba(200,168,75,0.35);animation-delay:0s;box-shadow:0 0 40px rgba(200,168,75,0.15),inset 0 0 40px rgba(200,168,75,0.05);}
.h-ring:nth-child(2){width:clamp(260px,50vw,520px);height:clamp(260px,50vw,520px);animation-delay:1.5s;}
.h-ring:nth-child(3){width:clamp(380px,75vw,780px);height:clamp(380px,75vw,780px);border-color:rgba(200,168,75,0.08);animation-delay:3s;}
.h-ring:nth-child(4){width:clamp(500px,100vw,1100px);height:clamp(500px,100vw,1100px);border-color:rgba(200,168,75,0.04);animation-delay:4.5s;}
@keyframes ringPulse{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.4;transform:translate(-50%,-50%) scale(1.03);}}

.hero-rays{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.h-ray{position:absolute;top:0;left:50%;width:1px;height:110%;transform-origin:top center;background:linear-gradient(var(--gold),transparent 60%);}
.h-ray:nth-child(1){transform:translateX(-50%) rotate(-45deg);opacity:0.08;}
.h-ray:nth-child(2){transform:translateX(-50%) rotate(-22deg);opacity:0.06;}
.h-ray:nth-child(3){transform:translateX(-50%) rotate(0deg);width:2px;opacity:0.14;}
.h-ray:nth-child(4){transform:translateX(-50%) rotate(22deg);opacity:0.06;}
.h-ray:nth-child(5){transform:translateX(-50%) rotate(45deg);opacity:0.08;}
.hero-glow{position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);width:clamp(300px,60vw,700px);height:clamp(300px,60vw,700px);border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,0.1) 0%,transparent 65%);pointer-events:none;animation:glowBrth 7s ease-in-out infinite;}
@keyframes glowBrth{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1;}50%{transform:translate(-50%,-50%) scale(1.15);opacity:0.6;}}

.prism{
  background:linear-gradient(90deg,var(--gold) 0%,var(--gold4) 12%,var(--gold2) 22%,#fffbe8 35%,var(--gold3) 48%,var(--gold2) 60%,#ffeead 72%,var(--gold4) 82%,var(--gold) 100%);
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  animation:prismShift 6s linear infinite;
  filter:drop-shadow(0 0 40px rgba(200,168,75,0.5));
}
@keyframes prismShift{0%{background-position:0% center;}100%{background-position:300% center;}}

.hero-content{
  position:relative;z-index:5;text-align:center;
  padding:clamp(80px,12vh,120px) clamp(16px,5vw,40px) clamp(60px,8vh,80px);
  max-width:min(1200px,100%);width:100%;
  display:flex;flex-direction:column;align-items:center;
}
.hero-tag{font-family:var(--f-ui);font-size:clamp(9px,2vw,12px);font-weight:700;letter-spacing:0.6em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:clamp(8px,2vw,16px);margin-bottom:clamp(16px,3vw,32px);opacity:0;animation:fadeUp 0.9s 0.5s var(--ease) forwards;flex-wrap:wrap;justify-content:center;}
.hero-tag-line{height:1px;width:clamp(28px,5vw,50px);background:linear-gradient(90deg,transparent,var(--gold));flex-shrink:0;}
.hero-tag-line.r{background:linear-gradient(90deg,var(--gold),transparent);}

.hero-t1{font-family:var(--f-display);font-size:clamp(52px,14vw,200px);font-weight:400;line-height:0.88;color:var(--white);letter-spacing:0.06em;opacity:0;animation:fadeUp 1s 0.7s var(--ease) forwards;text-shadow:0 0 120px rgba(200,168,75,0.3);position:relative;}
.hero-t1::before,.hero-t1::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;}
.hero-t1::before{animation:glitchBefore 6s infinite 2s;color:rgba(255,0,80,0.7);clip-path:polygon(0 15%,100% 15%,100% 40%,0 40%);}
.hero-t1::after{animation:glitchAfter 6s infinite 2.2s;color:rgba(0,200,255,0.5);clip-path:polygon(0 60%,100% 60%,100% 80%,0 80%);}
@keyframes glitchBefore{0%,92%,100%{opacity:0;transform:translate(0);}93%{opacity:1;transform:translate(-4px,-2px);}94%{opacity:0;}95%{opacity:1;transform:translate(4px,2px);}96%{opacity:0;}}
@keyframes glitchAfter{0%,90%,100%{opacity:0;transform:translate(0);}91%{opacity:1;transform:translate(4px,1px);}92%{opacity:0;}93%{opacity:1;transform:translate(-3px,-1px);}94%{opacity:0;}}

.hero-t2{font-family:var(--f-display);font-size:clamp(36px,8vw,200px);font-weight:400;line-height:0.88;letter-spacing:0.06em;opacity:0;animation:fadeUp 1s 0.9s var(--ease) forwards;}
.hero-sub{font-family:var(--f-serif);font-size:clamp(14px,3vw,28px);font-style:italic;font-weight:400;color:rgba(253,250,244,0.45);letter-spacing:0.15em;margin-top:clamp(10px,2vw,20px);opacity:0;animation:fadeUp 0.9s 1.1s var(--ease) forwards;}

.hero-verse{
  margin:clamp(24px,4vw,48px) 0;
  max-width:min(720px,100%);width:100%;
  opacity:0;animation:fadeUp 0.9s 1.3s var(--ease) forwards;
}
.hero-verse-inner{
  border:none;padding:clamp(18px,4vw,36px) clamp(18px,4vw,48px);position:relative;
  background:linear-gradient(135deg,rgba(200,168,75,0.07),transparent);
}
.hero-verse-inner::before{content:'';position:absolute;inset:-1.5px;z-index:-1;border-radius:2px;background:conic-gradient(from var(--shimmer-angle),transparent 0%,var(--gold3) 8%,var(--gold) 16%,transparent 24%,transparent 50%,var(--gold3) 58%,transparent 66%);animation:shimmerSpin 4s linear infinite;}
@keyframes shimmerSpin{from{--shimmer-angle:0deg;}to{--shimmer-angle:360deg;}}
.hero-verse-inner::after{content:'';position:absolute;inset:1px;background:rgba(5,5,10,0.9);z-index:-1;}
.hero-verse-corner{position:absolute;width:16px;height:16px;border-color:var(--gold3);border-style:solid;}
.hero-verse-corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.hero-verse-corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.hero-vt{font-family:var(--f-body);font-size:clamp(14px,2.5vw,18px);font-style:italic;color:rgba(200,168,75,0.9);line-height:1.8;margin-bottom:12px;}
.hero-vr{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);letter-spacing:0.45em;text-transform:uppercase;color:var(--gold);}

.hero-ctas{display:flex;gap:clamp(10px,2vw,20px);flex-wrap:wrap;justify-content:center;opacity:0;animation:fadeUp 0.9s 1.5s var(--ease) forwards;}
.hero-scroll{position:absolute;bottom:clamp(20px,4vw,36px);left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:fadeUp 0.9s 2.2s var(--ease) forwards;}
.hero-scroll-lbl{font-family:var(--f-ui);font-size:9px;letter-spacing:0.6em;text-transform:uppercase;color:var(--muted);}
.hero-scroll-track{width:1px;height:clamp(40px,5vw,60px);background:var(--faint);overflow:hidden;position:relative;}
.hero-scroll-fill{position:absolute;top:-100%;width:100%;height:100%;background:linear-gradient(var(--gold3),transparent);animation:scrollDown 2.4s ease-in-out infinite;}
@keyframes scrollDown{0%{top:-100%;}100%{top:200%;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}

/* ── TICKER ── */
.ticker{padding:clamp(10px,1.5vw,14px) 0;overflow:hidden;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:300% 100%;animation:tickerShimmer 5s linear infinite;}
@keyframes tickerShimmer{0%{background-position:0% 0%;}100%{background-position:300% 0%;}}
.ticker-inner{display:flex;white-space:nowrap;animation:tick 28s linear infinite;}
.t-item{display:flex;align-items:center;gap:clamp(14px,3vw,28px);padding:0 clamp(14px,3vw,28px);font-family:var(--f-ui);font-size:clamp(9px,1.5vw,11px);font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--black);flex-shrink:0;}
.t-dot{width:5px;height:5px;background:var(--black);border-radius:50%;opacity:0.35;}
@keyframes tick{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── STATS ── */
.stats{
  background:var(--panel);border-top:1px solid var(--border);border-bottom:1px solid var(--border);
  padding:clamp(40px,6vw,72px) var(--pad);
  display:grid;grid-template-columns:repeat(4,1fr);
  position:relative;overflow:hidden;
}
.stats-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:300px;background:radial-gradient(ellipse,rgba(200,168,75,0.08) 0%,transparent 70%);pointer-events:none;}
.stats::after{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(200,168,75,0.03) 1px,transparent 1px),linear-gradient(-45deg,rgba(200,168,75,0.03) 1px,transparent 1px);background-size:50px 50px;pointer-events:none;}
.stat{text-align:center;padding:clamp(10px,2vw,16px);position:relative;transition:transform 0.4s var(--ease3);}
.stat:hover{transform:translateY(-10px);}
.stat::after{content:'';position:absolute;right:0;top:20%;bottom:20%;width:1px;background:var(--border);}
.stat:last-child::after{display:none;}
.stat-n{font-family:var(--f-display);font-size:clamp(32px,5vw,80px);letter-spacing:0.04em;line-height:1;background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;transition:filter 0.4s;}
.stat:hover .stat-n{filter:drop-shadow(0 0 20px rgba(200,168,75,0.7));}
.stat-l{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,11px);font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:var(--muted);margin-top:8px;}

/* ── COMMON SECTION LABELS & HEADINGS ── */
.s-lbl{display:flex;align-items:center;gap:14px;font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;flex-wrap:wrap;}
.s-lbl-line{flex:0 0 36px;height:1px;background:var(--border2);}
.s-h2{font-family:var(--f-display);font-size:clamp(36px,7vw,100px);font-weight:400;line-height:0.92;color:var(--white);letter-spacing:0.04em;margin-bottom:24px;}
.s-h2 em{font-style:italic;font-family:var(--f-serif);background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-size:0.85em;}
.s-body{font-family:var(--f-body);font-size:clamp(14px,2vw,17px);font-weight:400;line-height:2;color:var(--muted);max-width:560px;}
.s-orn{position:relative;width:64px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:clamp(16px,2vw,28px) 0;}
.s-orn::after{content:'✦';position:absolute;top:50%;left:70px;transform:translateY(-50%);font-size:10px;color:var(--gold);opacity:0.5;animation:diamondSpin 8s linear infinite;}
@keyframes diamondSpin{from{transform:translateY(-50%) rotate(0deg);}to{transform:translateY(-50%) rotate(360deg);}}

/* ── BUTTONS ── */
.grad-border{position:relative;}
.grad-border::before{content:'';position:absolute;inset:-2px;z-index:-1;background:conic-gradient(from var(--border-angle),transparent 0%,var(--gold3) 10%,var(--gold) 20%,transparent 30%,transparent 50%,var(--gold3) 60%,transparent 70%);border-radius:inherit;opacity:0;animation:borderSpin 4s linear infinite;transition:opacity 0.4s;}
.grad-border:hover::before{opacity:1;}
@keyframes borderSpin{from{--border-angle:0deg;}to{--border-angle:360deg;}}

.btn-g{
  display:inline-flex;align-items:center;gap:clamp(8px,1.5vw,14px);
  font-family:var(--f-ui);font-size:clamp(9px,1.5vw,11px);font-weight:700;letter-spacing:0.3em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);text-decoration:none;
  padding:clamp(14px,2vw,18px) clamp(22px,3.5vw,44px);
  position:relative;overflow:hidden;transition:transform 0.3s var(--ease),box-shadow 0.3s;
  box-shadow:0 6px 36px rgba(200,168,75,0.35);cursor:pointer;white-space:nowrap;
  min-height:44px;
}
.btn-g::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold4),var(--gold3));opacity:0;transition:opacity 0.3s;}
.btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.btn-g:hover{transform:translateY(-3px);box-shadow:0 16px 64px rgba(200,168,75,0.55),0 0 80px rgba(200,168,75,0.2);}
.btn-g:hover::before{opacity:1;}
.btn-g:hover::after{left:150%;}
.btn-g span,.btn-gh span{position:relative;z-index:1;}
.btn-arr{position:relative;z-index:1;transition:transform 0.3s;}
.btn-g:hover .btn-arr,.btn-gh:hover .btn-arr{transform:translateX(5px);}

.btn-gh{
  display:inline-flex;align-items:center;gap:clamp(8px,1.5vw,14px);
  font-family:var(--f-ui);font-size:clamp(9px,1.5vw,11px);font-weight:700;letter-spacing:0.3em;text-transform:uppercase;
  background:transparent;color:var(--gold3);text-decoration:none;
  padding:clamp(13px,2vw,17px) clamp(22px,3.5vw,44px);
  border:1.5px solid var(--border2);
  position:relative;overflow:hidden;transition:all 0.3s var(--ease);cursor:pointer;white-space:nowrap;
  min-height:44px;
}
.btn-gh::before{content:'';position:absolute;inset:0;background:rgba(200,168,75,0.07);opacity:0;transition:opacity 0.3s;}
.btn-gh:hover{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 30px rgba(200,168,75,0.15);}
.btn-gh:hover::before{opacity:1;}

/* ── REVEAL ANIMATIONS ── */
.rev{opacity:0;transform:translateY(48px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev.vis{opacity:1;transform:translateY(0);}
.rev-l{opacity:0;transform:translateX(-48px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-l.vis{opacity:1;transform:translateX(0);}
.rev-r{opacity:0;transform:translateX(48px);transition:opacity 0.9s var(--ease),transform 0.9s var(--ease);}
.rev-r.vis{opacity:1;transform:translateX(0);}

/* ── MANDATE ── */
.mandate{background:var(--dark);padding:var(--sp-xl) 0;overflow:hidden;position:relative;}
.mandate::before{content:'SINCE 1997';position:absolute;bottom:-40px;right:-40px;font-family:var(--f-display);font-size:clamp(80px,18vw,280px);color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.04);white-space:nowrap;pointer-events:none;line-height:1;user-select:none;}
.mandate::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 400px 300px at 10% 20%,rgba(200,168,75,0.04) 0%,transparent 100%),radial-gradient(ellipse 300px 400px at 90% 80%,rgba(155,27,48,0.025) 0%,transparent 100%);animation:meshPulse 20s ease-in-out infinite alternate;pointer-events:none;}
@keyframes meshPulse{0%{opacity:1;}100%{opacity:0.6;}}
.mandate-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);display:grid;grid-template-columns:5fr 6fr;gap:clamp(40px,8vw,120px);align-items:center;}
.m-img-wrap{position:relative;overflow:hidden;}
.m-img-frame{position:absolute;top:-24px;left:-24px;right:24px;bottom:24px;border:1px solid var(--border);pointer-events:none;z-index:0;}
.m-img-frame::before,.m-img-frame::after{content:'';position:absolute;width:24px;height:24px;border-color:var(--gold);border-style:solid;}
.m-img-frame::before{top:-1px;left:-1px;border-width:2.5px 0 0 2.5px;}
.m-img-frame::after{bottom:-1px;right:-1px;border-width:0 2.5px 2.5px 0;}
.m-img{width:100%;height:clamp(320px,50vw,640px);object-fit:cover;display:block;position:relative;z-index:1;filter:brightness(0.9) contrast(1.05) saturate(1.1);transition:transform 0.8s var(--ease),filter 0.6s;}
.m-img-wrap:hover .m-img{transform:scale(1.03);filter:brightness(1) contrast(1.08) saturate(1.2);}
.m-img-wrap::after{content:'';position:absolute;top:-50%;left:-150%;width:60%;height:200%;background:linear-gradient(to right,transparent,rgba(200,168,75,0.06),transparent);transform:skewX(-20deg);transition:left 0.9s var(--ease);z-index:2;pointer-events:none;}
.m-img-wrap:hover::after{left:160%;}
.m-tag{position:absolute;bottom:-20px;right:-20px;z-index:2;background:var(--gold);color:var(--black);font-family:var(--f-ui);font-size:clamp(7px,1.5vw,9px);font-weight:700;letter-spacing:0.45em;text-transform:uppercase;padding:clamp(10px,1.5vw,14px) clamp(14px,2vw,22px);}
.m-year{font-family:var(--f-display);font-size:clamp(70px,12vw,180px);font-weight:400;line-height:1;color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.18);margin-bottom:-16px;display:block;letter-spacing:0.04em;}
.m-p{font-family:var(--f-body);font-size:clamp(14px,2vw,18px);font-weight:400;line-height:2;color:var(--muted);margin-bottom:20px;}

.diag-top{clip-path:polygon(0 0,100% 0,100% 92%,0 100%);margin-bottom:-4px;}
.diag-bot{clip-path:polygon(0 8%,100% 0,100% 100%,0 100%);margin-top:-4px;padding-top:calc(var(--sp-xl) + 4%);}

/* ── FAITH ── */
.faith{background:var(--black);padding:var(--sp-xl) 0;position:relative;overflow:hidden;}
.faith-bg-txt{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--f-display);font-size:clamp(150px,30vw,400px);font-weight:400;color:transparent;-webkit-text-stroke:1px rgba(200,168,75,0.03);white-space:nowrap;pointer-events:none;letter-spacing:0.08em;user-select:none;}
.faith-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);}
.faith-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:clamp(40px,6vw,80px);gap:24px;flex-wrap:wrap;}
.faith-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:var(--faint);}

.f-card{background:var(--panel);padding:clamp(32px,4vw,56px) clamp(22px,3vw,40px) clamp(30px,4vw,52px);text-decoration:none;display:block;position:relative;overflow:hidden;transition:background 0.4s,transform 0.4s var(--ease3),box-shadow 0.4s;}
.f-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transform:scaleX(0);transform-origin:left;transition:transform 0.5s var(--ease);}
.f-card:hover::before{transform:scaleX(1);}
.f-card-holo{position:absolute;inset:0;opacity:0;transition:opacity 0.4s;pointer-events:none;mix-blend-mode:screen;background:conic-gradient(from var(--holo-angle,220deg) at var(--holo-x,50%) var(--holo-y,50%),rgba(255,0,100,0.04) 0deg,rgba(255,200,0,0.06) 60deg,rgba(0,255,140,0.04) 120deg,rgba(0,180,255,0.05) 180deg,rgba(140,0,255,0.04) 240deg,rgba(255,80,0,0.05) 300deg,rgba(255,0,100,0.04) 360deg);}
.f-card-bg{position:absolute;inset:0;opacity:0;background:radial-gradient(ellipse 140% 140% at 50% 110%,rgba(200,168,75,0.14) 0%,transparent 70%);transition:opacity 0.5s;}
.f-card:hover{background:var(--card);transform:translateY(-6px);box-shadow:0 24px 64px rgba(0,0,0,0.5),0 0 50px rgba(200,168,75,0.07),inset 0 1px 0 rgba(200,168,75,0.1);}
.f-card:hover .f-card-bg{opacity:1;}
.f-card:hover .f-card-holo{opacity:1;}
.f-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:clamp(28px,4vw,52px);}
.f-num{font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:0.45em;color:var(--gold);}
.f-icon{width:38px;height:38px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:16px;transition:all 0.4s;flex-shrink:0;}
.f-card:hover .f-icon{border-color:var(--gold);background:rgba(200,168,75,0.12);transform:rotate(45deg);box-shadow:0 0 20px rgba(200,168,75,0.3);}
.f-lbl{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:0.5em;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}
.f-title{font-family:var(--f-display);font-size:clamp(20px,2.5vw,26px);font-weight:400;color:var(--white);line-height:1.15;margin-bottom:clamp(18px,3vw,32px);letter-spacing:0.04em;transition:color 0.3s;}
.f-card:hover .f-title{color:var(--gold3);}
.f-div{width:28px;height:1.5px;background:linear-gradient(90deg,var(--gold),transparent);margin-bottom:20px;transition:width 0.5s var(--ease);}
.f-card:hover .f-div{width:60px;}
.f-cta{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:10px;transition:gap 0.3s;}
.f-card:hover .f-cta{gap:18px;}

/* ── VERSE BANNER ── */
.v-banner{background:var(--panel);padding:clamp(60px,8vw,112px) var(--pad);text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.v-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 200% at 50% 50%,rgba(200,168,75,0.06) 0%,transparent 100%);}
.v-banner::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);pointer-events:none;}
.v-banner-starburst{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.v-banner-starburst::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:900px;background:conic-gradient(from 0deg,transparent 0deg,rgba(200,168,75,0.03) 1deg,transparent 2deg,transparent 29deg,rgba(200,168,75,0.025) 30deg,transparent 31deg,transparent 59deg,rgba(200,168,75,0.03) 60deg,transparent 61deg,transparent 89deg,rgba(200,168,75,0.025) 90deg,transparent 91deg,transparent 119deg,rgba(200,168,75,0.03) 120deg,transparent 121deg,transparent 149deg,rgba(200,168,75,0.025) 150deg,transparent 151deg,transparent 179deg,rgba(200,168,75,0.03) 180deg,transparent 181deg,transparent 209deg,rgba(200,168,75,0.025) 210deg,transparent 211deg,transparent 239deg,rgba(200,168,75,0.03) 240deg,transparent 241deg,transparent 269deg,rgba(200,168,75,0.025) 270deg,transparent 271deg,transparent 299deg,rgba(200,168,75,0.03) 300deg,transparent 301deg,transparent 329deg,rgba(200,168,75,0.025) 330deg,transparent 331deg,transparent 360deg);animation:starburstSpin 30s linear infinite;}
@keyframes starburstSpin{from{transform:translate(-50%,-50%) rotate(0deg);}to{transform:translate(-50%,-50%) rotate(360deg);}}
.v-q{font-family:var(--f-serif);font-size:clamp(18px,4vw,46px);font-style:italic;font-weight:400;color:var(--white);line-height:1.4;max-width:min(1000px,100%);margin:0 auto clamp(20px,3vw,32px);position:relative;z-index:1;}
.v-q::before{content:'\\201C';font-family:var(--f-display);font-size:clamp(70px,12vw,140px);color:rgba(200,168,75,0.15);position:absolute;top:clamp(-30px,-5vw,-50px);left:-16px;line-height:1;pointer-events:none;}
.v-attr{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--gold);position:relative;z-index:1;}

/* ── EVENTS ── */
.events{background:var(--dark);padding:var(--sp-xl) 0;}
.events-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);}
.events-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,7vw,100px);align-items:center;}
.ev-list{display:flex;flex-direction:column;gap:0;}
.ev-item{display:flex;align-items:flex-start;gap:clamp(16px,2.5vw,28px);padding:clamp(16px,2.5vw,28px) 0;border-bottom:1px solid var(--border);text-decoration:none;position:relative;overflow:hidden;transition:background 0.3s;cursor:pointer;}
.ev-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(200,168,75,0.04);transition:width 0.4s var(--ease);}
.ev-item:hover::before{width:100%;}
.ev-item::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,168,75,0.04),transparent);transform:skewX(-20deg);transition:left 0.7s var(--ease);}
.ev-item:hover::after{left:150%;}
.ev-date-block{flex-shrink:0;width:clamp(54px,8vw,68px);text-align:center;border:1px solid var(--border);padding:clamp(8px,1.5vw,12px) 8px;background:rgba(200,168,75,0.04);transition:background 0.3s,border-color 0.3s,box-shadow 0.3s;}
.ev-item:hover .ev-date-block{background:rgba(200,168,75,0.1);border-color:var(--gold);box-shadow:0 0 20px rgba(200,168,75,0.15);}
.ev-day{font-family:var(--f-display);font-size:clamp(24px,4vw,36px);line-height:1;color:var(--gold);letter-spacing:0.04em;}
.ev-mon{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--muted);margin-top:4px;}
.ev-info{flex:1;padding-right:8px;min-width:0;}
.ev-name{font-family:var(--f-serif);font-size:clamp(14px,2vw,18px);font-weight:700;color:var(--white);line-height:1.3;margin-bottom:8px;transition:color 0.3s;}
.ev-item:hover .ev-name{color:var(--gold3);}
.ev-time{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--muted);}
.ev-arrow{font-size:clamp(16px,3vw,22px);color:var(--gold);align-self:center;opacity:0;transform:translateX(-8px);transition:opacity 0.3s,transform 0.3s;flex-shrink:0;}
.ev-item:hover .ev-arrow{opacity:1;transform:translateX(0);}
.ev-skeleton{padding:28px 0;border-bottom:1px solid var(--border);}
.ev-skel-line{background:linear-gradient(90deg,rgba(200,168,75,0.05) 25%,rgba(200,168,75,0.12) 50%,rgba(200,168,75,0.05) 75%);background-size:200% 100%;animation:skelShimmer 1.5s infinite;border-radius:2px;height:14px;margin-bottom:8px;}
.ev-skel-line.wide{width:70%;}
.ev-skel-line.narrow{width:40%;}
@keyframes skelShimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

.car-frame{position:relative;border:1px solid var(--border);}
.car-frame::before,.car-frame::after{content:'';position:absolute;width:18px;height:18px;border-color:var(--gold);border-style:solid;z-index:2;}
.car-frame::before{bottom:-1px;left:-1px;border-width:0 0 2.5px 2.5px;}
.car-frame::after{top:-1px;right:-1px;border-width:2.5px 2.5px 0 0;}
.car-img-wrap{overflow:hidden;width:100%;aspect-ratio:3/4;position:relative;}
.car-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.8s var(--ease),opacity 0.4s;}
.car-img.switching{opacity:0.3;}
.car-over{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,10,0.5) 0%,transparent 50%);}
.car-cnt{position:absolute;bottom:18px;right:18px;font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);letter-spacing:0.3em;color:var(--gold3);background:rgba(5,5,10,0.75);padding:8px 16px;border:1px solid var(--border);backdrop-filter:blur(8px);}
.car-nav{display:flex;align-items:center;gap:14px;margin-top:20px;}
.car-btn{width:clamp(44px,6vw,52px);height:clamp(44px,6vw,52px);border:1px solid var(--border);background:transparent;color:var(--gold);cursor:pointer;font-size:clamp(18px,3vw,22px);display:flex;align-items:center;justify-content:center;transition:all 0.3s;font-family:serif;flex-shrink:0;}
.car-btn:hover{background:rgba(200,168,75,0.1);border-color:var(--gold);box-shadow:0 0 20px rgba(200,168,75,0.2);}
.car-dots{display:flex;gap:10px;flex:1;}
.car-dot{height:2px;flex:1;background:var(--faint);cursor:pointer;transition:background 0.4s;}
.car-dot.active{background:var(--gold);}

/* ── PASTOR ── */
.pastor{background:var(--panel);padding:var(--sp-xl) 0;position:relative;overflow:hidden;}
.pastor::before{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);z-index:1;}
.pastor::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.025) 3px,rgba(0,0,0,0.025) 4px);pointer-events:none;}
.pastor-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);display:grid;grid-template-columns:6fr 5fr;gap:clamp(40px,8vw,120px);align-items:center;position:relative;z-index:1;}
.p-qmark{font-family:var(--f-display);font-size:clamp(60px,8vw,100px);color:rgba(200,168,75,0.2);line-height:1;margin-bottom:-30px;display:block;}
.p-quote{font-family:var(--f-body);font-size:clamp(14px,2vw,20px);font-style:italic;font-weight:400;color:var(--white);line-height:1.85;margin-bottom:40px;border-left:2.5px solid var(--gold);padding-left:clamp(16px,2.5vw,32px);}
.p-name{font-family:var(--f-display);font-size:clamp(28px,4vw,44px);letter-spacing:0.04em;color:var(--white);}
.p-role{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);font-weight:700;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);}
.p-div{width:52px;height:1.5px;background:var(--border2);margin:18px 0;}
.vid-wrap{position:relative;}
.vid-frame{position:relative;cursor:pointer;overflow:hidden;border:1px solid var(--border);}
.vid-frame::before,.vid-frame::after{content:'';position:absolute;width:22px;height:22px;border-color:var(--gold);border-style:solid;z-index:2;}
.vid-frame::before{top:-1px;left:-1px;border-width:2.5px 0 0 2.5px;}
.vid-frame::after{bottom:-1px;right:-1px;border-width:0 2.5px 2.5px 0;}
.vid-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block;filter:brightness(0.65);transition:filter 0.6s,transform 0.6s;}
.vid-frame:hover .vid-img{filter:brightness(0.4);transform:scale(1.04);}
.vid-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(to top,rgba(5,5,10,0.7) 0%,transparent 60%);transition:background 0.4s;}
.vid-frame:hover .vid-ov{background:linear-gradient(to top,rgba(5,5,10,0.9) 0%,rgba(5,5,10,0.2) 100%);}
.play-outer{width:clamp(70px,10vw,100px);height:clamp(70px,10vw,100px);border-radius:50%;border:1.5px solid rgba(253,250,244,0.4);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);background:rgba(253,250,244,0.06);transition:all 0.4s;box-shadow:0 0 60px rgba(200,168,75,0.15);}
.vid-frame:hover .play-outer{transform:scale(1.12);border-color:var(--gold);background:rgba(200,168,75,0.15);box-shadow:0 0 80px rgba(200,168,75,0.4);}
.play-inner{width:clamp(46px,7vw,66px);height:clamp(46px,7vw,66px);border-radius:50%;background:var(--white);display:flex;align-items:center;justify-content:center;font-size:clamp(16px,2.5vw,22px);color:var(--black);padding-left:4px;transition:background 0.3s;}
.vid-frame:hover .play-inner{background:var(--gold);}
.vid-lbl{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:var(--gold3);white-space:nowrap;}

/* ── TESTIMONIALS ── */
.test-sec{background:var(--black);padding:var(--sp-xl) 0;position:relative;overflow:hidden;}
.test-bg{position:absolute;inset:0;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(200,168,75,0.05) 0%,transparent 100%);}
.test-in{max-width:min(1100px,100%);margin:0 auto;padding:0 var(--pad);}
.test-hdr{text-align:center;margin-bottom:clamp(40px,6vw,80px);}
.t-card{
  background:rgba(22,22,37,0.6);border:1px solid rgba(200,168,75,0.15);
  padding:clamp(28px,5vw,72px);position:relative;overflow:hidden;min-height:clamp(200px,30vw,320px);
  backdrop-filter:blur(24px) saturate(1.5);-webkit-backdrop-filter:blur(24px) saturate(1.5);
  box-shadow:0 0 0 1px rgba(200,168,75,0.08),0 8px 48px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.04),inset 0 -1px 0 rgba(0,0,0,0.2);
  transition:border-color 0.4s,box-shadow 0.4s;
}
.t-card:hover{border-color:rgba(200,168,75,0.35);box-shadow:0 0 0 1px rgba(200,168,75,0.15),0 20px 80px rgba(0,0,0,0.5),0 0 80px rgba(200,168,75,0.06),inset 0 1px 0 rgba(255,255,255,0.06);}
.t-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,var(--gold3),var(--gold),var(--gold3),transparent);animation:topBorderShift 4s linear infinite;}
@keyframes topBorderShift{0%{background-position:0% 0%;}100%{background-position:200% 0%;}}
.t-card::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.03) 3px,rgba(0,0,0,0.03) 4px);pointer-events:none;}
.t-card-glow{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,0.06) 0%,transparent 70%);top:-100px;left:-100px;animation:tCardGlowDrift 12s ease-in-out infinite alternate;pointer-events:none;}
@keyframes tCardGlowDrift{0%{transform:translate(0,0);}100%{transform:translate(200px,150px);}}
.t-qm{font-family:var(--f-display);font-size:clamp(80px,12vw,150px);line-height:1;color:rgba(200,168,75,0.07);position:absolute;top:-20px;left:40px;pointer-events:none;}
.t-txt{font-family:var(--f-body);font-size:clamp(14px,2vw,20px);font-style:italic;font-weight:400;color:var(--white);line-height:1.8;margin-bottom:clamp(24px,4vw,44px);position:relative;z-index:1;}
.t-auth-row{display:flex;align-items:center;gap:20px;position:relative;z-index:1;}
.t-auth-dot{width:36px;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--gold3));flex-shrink:0;}
.t-auth-name{font-family:var(--f-ui);font-size:clamp(9px,1.5vw,11px);font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--gold);}
.t-auth-loc{font-size:clamp(10px,1.5vw,12px);font-family:var(--f-ui);color:var(--muted);margin-top:4px;letter-spacing:0.2em;}
.t-nav-row{display:flex;align-items:center;justify-content:space-between;margin-top:clamp(20px,3vw,40px);}
.t-nav-btns{display:flex;gap:12px;}
.t-nav-btn{width:clamp(44px,5vw,52px);height:clamp(44px,5vw,52px);border:1px solid var(--border);background:transparent;color:var(--gold);cursor:pointer;font-size:clamp(18px,3vw,22px);display:flex;align-items:center;justify-content:center;transition:all 0.3s;font-family:serif;}
.t-nav-btn:hover{background:rgba(200,168,75,0.1);border-color:var(--gold);box-shadow:0 0 20px rgba(200,168,75,0.2);}
.t-dots{display:flex;gap:8px;flex-wrap:wrap;}
.t-dot{width:22px;height:2px;background:var(--faint);cursor:pointer;transition:all 0.4s;}
.t-dot.active{background:linear-gradient(90deg,var(--gold),var(--gold3));width:44px;}

/* ── SERMONS ── */
.sermons{padding:var(--sp-xl) 0;background:var(--dark);}
.sermons-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);}
.sermons-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,7vw,100px);align-items:start;}
.sermons-list{display:flex;flex-direction:column;gap:0;}
.s-item{display:flex;align-items:center;gap:clamp(12px,2vw,20px);padding:clamp(14px,2vw,24px) 0;border-bottom:1px solid var(--border);text-decoration:none;position:relative;overflow:hidden;transition:background 0.3s;cursor:pointer;}
.s-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(200,168,75,0.04);transition:width 0.4s var(--ease);}
.s-item:hover::before{width:100%;}
.s-item-thumb{width:clamp(60px,8vw,80px);height:clamp(60px,8vw,80px);flex-shrink:0;object-fit:cover;filter:brightness(0.8);transition:filter 0.3s,transform 0.5s;}
.s-item:hover .s-item-thumb{filter:brightness(1);transform:scale(1.06);}
.s-item-info{flex:1;min-width:0;}
.s-item-title{font-family:var(--f-serif);font-size:clamp(13px,1.8vw,16px);font-weight:700;color:var(--white);line-height:1.3;margin-bottom:6px;transition:color 0.3s;}
.s-item:hover .s-item-title{color:var(--gold3);}
.s-item-date{font-family:var(--f-ui);font-size:clamp(7px,1.2vw,9px);font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:var(--muted);}
.s-item-play{width:clamp(32px,4vw,36px);height:clamp(32px,4vw,36px);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gold);font-size:12px;padding-left:2px;transition:all 0.3s;flex-shrink:0;}
.s-item:hover .s-item-play{background:var(--gold);color:var(--black);border-color:var(--gold);box-shadow:0 0 20px rgba(200,168,75,0.4);}
.s-visual{position:relative;display:flex;align-items:center;justify-content:center;}
.s-rings{position:relative;width:clamp(240px,40vw,420px);height:clamp(240px,40vw,420px);flex-shrink:0;}
.s-ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid var(--border);transform:translate(-50%,-50%);}
.s-ring:nth-child(1){width:clamp(80px,13vw,130px);height:clamp(80px,13vw,130px);border:2px solid var(--gold);background:rgba(200,168,75,0.06);display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(200,168,75,0.2),inset 0 0 20px rgba(200,168,75,0.08);}
.s-ring:nth-child(2){width:clamp(133px,22vw,220px);height:clamp(133px,22vw,220px);animation:ringSpin 20s linear infinite;}
.s-ring:nth-child(3){width:clamp(194px,32vw,320px);height:clamp(194px,32vw,320px);border-color:rgba(200,168,75,0.08);animation:ringSpin 35s linear infinite reverse;}
.s-ring:nth-child(4){width:clamp(240px,40vw,420px);height:clamp(240px,40vw,420px);border-color:rgba(200,168,75,0.04);animation:ringSpin 50s linear infinite;}
@keyframes ringSpin{from{transform:translate(-50%,-50%) rotate(0);}to{transform:translate(-50%,-50%) rotate(360deg);}}
.s-ring-dot{position:absolute;top:0;left:50%;transform:translateX(-50%) translateY(-50%);width:7px;height:7px;background:var(--gold);border-radius:50%;box-shadow:0 0 8px rgba(200,168,75,0.8);}
.s-center-icon{font-family:var(--f-display);font-size:clamp(20px,3vw,32px);color:var(--gold);position:relative;z-index:1;letter-spacing:0.05em;text-shadow:0 0 20px rgba(200,168,75,0.6);}
.s-tags{position:absolute;inset:0;pointer-events:none;}
.s-tag{position:absolute;padding:clamp(7px,1.2vw,10px) clamp(12px,2vw,18px);background:var(--panel);border:1px solid var(--border);font-family:var(--f-ui);font-size:clamp(7px,1.2vw,9px);font-weight:700;letter-spacing:0.35em;text-transform:uppercase;color:var(--gold);backdrop-filter:blur(8px);white-space:nowrap;}
.s-tag:nth-child(1){top:8%;right:0;animation:tagFloat 6s ease-in-out infinite;}
.s-tag:nth-child(2){bottom:18%;right:4%;animation:tagFloat 8s ease-in-out infinite 1s;}
.s-tag:nth-child(3){top:32%;left:0;animation:tagFloat 7s ease-in-out infinite 2s;}
@keyframes tagFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}

/* ── MINISTRIES ── */
.mins{background:var(--panel);padding:var(--sp-xl) 0;}
.mins-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);}
.mins-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:clamp(32px,5vw,64px);gap:24px;flex-wrap:wrap;}
.min-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;}
.min-card{position:relative;overflow:hidden;cursor:pointer;text-decoration:none;display:block;aspect-ratio:3/4;}
.min-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(0.55) saturate(0.8);transition:transform 0.9s var(--ease),filter 0.6s;}
.min-card:hover .min-img{transform:scale(1.1);filter:brightness(0.35) saturate(0.6);}
.min-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,10,0.96) 0%,rgba(5,5,10,0.3) 55%,transparent 100%);}
.min-card::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 100%,rgba(200,168,75,0.2) 0%,transparent 70%);opacity:0;transition:opacity 0.5s;}
.min-card:hover::after{opacity:1;}
.min-gline{position:absolute;bottom:0;left:0;right:0;height:2.5px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);transform:scaleX(0);transform-origin:center;transition:transform 0.6s var(--ease);}
.min-card:hover .min-gline{transform:scaleX(1);}
.min-content{position:absolute;bottom:0;left:0;right:0;padding:clamp(28px,4vw,52px) clamp(20px,3vw,44px);transform:translateY(16px);transition:transform 0.5s var(--ease);}
.min-card:hover .min-content{transform:translateY(0);}
.min-lbl{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;opacity:0;transform:translateY(10px);transition:opacity 0.4s 0.1s,transform 0.4s 0.1s;}
.min-card:hover .min-lbl{opacity:1;transform:translateY(0);}
.min-title{font-family:var(--f-display);font-size:clamp(20px,3vw,40px);font-weight:400;color:var(--white);margin-bottom:20px;line-height:1.1;letter-spacing:0.05em;}
.min-arr{display:inline-flex;align-items:center;gap:14px;font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.4em;text-transform:uppercase;color:var(--gold);opacity:0;transform:translateY(10px);transition:opacity 0.4s 0.15s,transform 0.4s 0.15s;}
.min-card:hover .min-arr{opacity:1;transform:translateY(0);}
.min-arr-line{width:32px;height:1.5px;background:var(--gold);}

/* ── SERVICES ── */
.services{background:var(--black);padding:var(--sp-xl) 0;}
.services-in{max-width:min(1100px,100%);margin:0 auto;padding:0 var(--pad);text-align:center;}
.svc-loc{font-family:var(--f-body);font-size:clamp(13px,2vw,16px);font-style:italic;color:var(--muted);margin-bottom:clamp(40px,6vw,72px);}
.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin:clamp(36px,5vw,64px) 0;}
.svc-card{background:var(--panel);border:1px solid var(--border);padding:clamp(40px,6vw,72px) clamp(28px,4vw,52px);position:relative;overflow:hidden;transition:background 0.4s,box-shadow 0.4s;}
.svc-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:2.5px;background:linear-gradient(var(--gold),var(--gold3),transparent);}
.svc-card::after{content:'';position:absolute;top:0;right:0;width:1px;height:100%;background:linear-gradient(transparent,rgba(200,168,75,0.3),transparent);animation:svcShimmer 4s ease-in-out infinite;}
@keyframes svcShimmer{0%,100%{opacity:0.3;}50%{opacity:1;}}
.svc-card:hover{background:var(--dark);box-shadow:inset 0 0 60px rgba(200,168,75,0.03),0 0 40px rgba(200,168,75,0.06);}
.svc-day{font-family:var(--f-display);font-size:clamp(32px,5vw,68px);font-weight:400;color:var(--gold);margin-bottom:24px;line-height:1;letter-spacing:0.06em;}
.svc-times{font-family:var(--f-body);font-size:clamp(14px,2vw,18px);font-weight:400;color:var(--muted);line-height:2.1;}
.svc-tz{font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:0.4em;color:var(--faint);margin-top:12px;}
.svc-sep{display:flex;align-items:center;gap:20px;justify-content:center;margin:clamp(24px,4vw,40px) 0;}
.svc-sep-line{flex:0 0 clamp(40px,6vw,80px);height:1px;background:linear-gradient(90deg,transparent,var(--border2));}
.svc-sep-line.r{background:linear-gradient(90deg,var(--border2),transparent);}
.svc-sep-icon{color:var(--gold);font-size:18px;animation:diamondSpin 6s linear infinite;text-shadow:0 0 12px rgba(200,168,75,0.5);}

/* ── PODCAST ── */
.podcast{background:var(--dark);padding:var(--sp-xl) 0;}
.pod-in{max-width:1440px;margin:0 auto;padding:0 var(--pad);display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,7vw,100px);align-items:center;}
.pod-plats{display:flex;gap:clamp(8px,1.5vw,14px);flex-wrap:wrap;margin:clamp(20px,3vw,32px) 0;}
.pod-plat{display:flex;align-items:center;gap:10px;padding:clamp(10px,1.5vw,12px) clamp(14px,2vw,22px);border:1px solid var(--border);background:rgba(200,168,75,0.05);font-family:var(--f-ui);font-size:clamp(8px,1.5vw,9px);font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold3);transition:background 0.3s,border-color 0.3s,box-shadow 0.3s;min-height:44px;}
.pod-plat:hover{background:rgba(200,168,75,0.1);border-color:var(--gold);box-shadow:0 0 20px rgba(200,168,75,0.15);}
.pod-plat-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);box-shadow:0 0 8px rgba(200,168,75,0.6);flex-shrink:0;}
.pod-embed{border:1px solid var(--border);overflow:hidden;background:var(--panel);}
.pod-embed-hdr{padding:clamp(14px,2vw,20px) clamp(16px,2.5vw,24px);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.pod-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.pod-embed iframe{display:block;width:100%;height:clamp(200px,30vw,352px);}

/* ── CTA ── */
.cta-sec{background:var(--panel);padding:clamp(80px,12vw,168px) var(--pad);text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--border);}
.cta-sec::before{content:'';position:absolute;inset:0;background-image:linear-gradient(45deg,rgba(200,168,75,0.03) 1px,transparent 1px),linear-gradient(-45deg,rgba(200,168,75,0.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none;}
.cta-sec::after{content:'';position:absolute;bottom:0;left:0;right:0;height:300px;background:radial-gradient(ellipse 80% 100% at 50% 100%,rgba(200,168,75,0.07) 0%,transparent 70%);pointer-events:none;}
.cta-cross-v{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1px;height:700px;background:linear-gradient(transparent,rgba(200,168,75,0.08),transparent);}
.cta-cross-h{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:1px;background:linear-gradient(transparent,rgba(200,168,75,0.08),transparent);}
.cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:600px;background:radial-gradient(ellipse,rgba(200,168,75,0.08) 0%,transparent 70%);pointer-events:none;animation:ctaGlowPulse 6s ease-in-out infinite;}
@keyframes ctaGlowPulse{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}50%{opacity:0.6;transform:translate(-50%,-50%) scale(1.1);}}
.cta-starburst{position:absolute;top:50%;left:50%;pointer-events:none;width:min(1200px,200vw);height:min(1200px,200vw);transform:translate(-50%,-50%);background:conic-gradient(from 0deg,transparent 0deg,rgba(200,168,75,0.025) 1.5deg,transparent 3deg,transparent 14.5deg,rgba(200,168,75,0.02) 16deg,transparent 17.5deg,transparent 29deg,rgba(200,168,75,0.025) 30.5deg,transparent 32deg,transparent 44.5deg,rgba(200,168,75,0.02) 46deg,transparent 47.5deg,transparent 59deg,rgba(200,168,75,0.025) 60.5deg,transparent 62deg,transparent 89deg,rgba(200,168,75,0.025) 90.5deg,transparent 92deg,transparent 119deg,rgba(200,168,75,0.025) 120.5deg,transparent 122deg,transparent 179deg,rgba(200,168,75,0.025) 180.5deg,transparent 182deg,transparent 239deg,rgba(200,168,75,0.025) 240.5deg,transparent 242deg,transparent 299deg,rgba(200,168,75,0.025) 300.5deg,transparent 302deg,transparent 359deg,rgba(200,168,75,0.025) 359.5deg,transparent 360deg);animation:starburstSpin 40s linear infinite;}
.cta-inner{position:relative;z-index:2;max-width:min(960px,100%);margin:0 auto;}
.cta-eyebrow{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,10px);font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;}
.cta-eyebrow-line{height:1px;width:44px;background:linear-gradient(90deg,transparent,var(--gold));}
.cta-eyebrow-line.r{background:linear-gradient(90deg,var(--gold),transparent);}
.cta-title{font-family:var(--f-display);font-size:clamp(42px,10vw,140px);font-weight:400;color:var(--white);line-height:0.9;letter-spacing:0.05em;margin-bottom:16px;}
.cta-title em{font-style:normal;display:block;background:linear-gradient(135deg,var(--gold3),var(--gold));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 30px rgba(200,168,75,0.4));}
.cta-sub{font-family:var(--f-body);font-size:clamp(14px,2vw,18px);font-style:italic;font-weight:400;color:var(--muted);margin-bottom:clamp(40px,6vw,72px);}
.cta-tgrid{display:flex;justify-content:center;margin-bottom:clamp(40px,6vw,72px);border:1px solid var(--border);flex-wrap:wrap;}
.cta-tcard{padding:clamp(28px,4vw,44px) clamp(36px,6vw,72px);flex:1;min-width:clamp(150px,30vw,200px);position:relative;overflow:hidden;}
.cta-tcard::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,168,75,0.04),transparent);animation:tCardSweep 6s linear infinite;}
@keyframes tCardSweep{0%{left:-100%;}100%{left:200%;}}
.cta-tcard+.cta-tcard{border-left:1px solid var(--border);}
.cta-tday{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,9px);font-weight:700;letter-spacing:0.5em;text-transform:uppercase;color:var(--gold);margin-bottom:14px;}
.cta-thrs{font-family:var(--f-body);font-size:clamp(14px,2vw,17px);font-style:italic;color:var(--muted);line-height:2.1;}
.cta-btns{display:flex;gap:clamp(10px,2vw,20px);justify-content:center;flex-wrap:wrap;}

/* ── FOOTER ── */
.sm-footer{background:var(--deep);border-top:1px solid var(--border);padding:clamp(60px,8vw,112px) var(--pad) 0;position:relative;}
.sm-footer::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);}
.ft-top{max-width:1440px;margin:0 auto;display:grid;grid-template-columns:2.5fr 1fr 1fr 1.5fr;gap:clamp(32px,5vw,80px);padding-bottom:clamp(40px,6vw,80px);border-bottom:1px solid var(--border);}
.ft-logo{height:clamp(30px,5vw,46px);margin-bottom:28px;filter:drop-shadow(0 0 10px rgba(200,168,75,0.25));}
.ft-desc{font-family:var(--f-body);font-size:clamp(13px,1.8vw,15px);font-weight:400;font-style:italic;color:var(--muted);line-height:1.9;max-width:300px;margin-bottom:32px;}
.ft-socials{display:flex;gap:12px;flex-wrap:wrap;}
.ft-soc{width:44px;height:44px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:13px;text-decoration:none;transition:all 0.3s var(--ease3);font-family:var(--f-ui);font-weight:700;letter-spacing:0.05em;}
.ft-soc:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,168,75,0.08);box-shadow:0 0 24px rgba(200,168,75,0.25);transform:translateY(-3px) scale(1.1);}
.ft-col-title{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:0.55em;text-transform:uppercase;color:var(--gold);margin-bottom:clamp(20px,3vw,32px);padding-bottom:16px;border-bottom:1px solid var(--border);}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:clamp(10px,1.5vw,16px);}
.ft-link{font-family:var(--f-body);font-size:clamp(12px,1.8vw,14px);font-weight:400;color:var(--muted);text-decoration:none;transition:color 0.3s;display:flex;align-items:center;gap:10px;cursor:pointer;min-height:36px;}
.ft-link::before{content:'';width:0;height:1px;background:linear-gradient(90deg,var(--gold),var(--gold3));transition:width 0.3s;}
.ft-link:hover{color:var(--gold3);}
.ft-link:hover::before{width:18px;}
.ft-ci{font-family:var(--f-body);font-size:clamp(12px,1.8vw,14px);font-weight:400;color:var(--muted);margin-bottom:12px;line-height:1.7;}
.ft-ci a{color:inherit;text-decoration:none;transition:color 0.3s;}
.ft-ci a:hover{color:var(--gold3);}
.ft-cl{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:0.45em;text-transform:uppercase;color:rgba(200,168,75,0.3);margin-bottom:4px;}
.ft-bot{max-width:1440px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:clamp(20px,3vw,32px) 0;gap:clamp(12px,2vw,20px);flex-wrap:wrap;}
.ft-copy{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,9px);font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:var(--faint);text-align:center;}
.ft-bot-orn{display:flex;align-items:center;gap:14px;}
.ft-bot-line{height:1px;width:40px;background:var(--border);}
.ft-bot-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 8px rgba(200,168,75,0.4);animation:diamondSpin 6s linear infinite;}
.ft-bot-links{display:flex;gap:clamp(16px,3vw,32px);flex-wrap:wrap;}
.ft-bot-link{font-family:var(--f-ui);font-size:clamp(8px,1.5vw,9px);font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:var(--faint);text-decoration:none;transition:color 0.3s;cursor:pointer;min-height:36px;display:flex;align-items:center;}
.ft-bot-link:hover{color:var(--gold);}

/* ── VIDEO MODAL ── */
.v-modal{position:fixed;inset:0;z-index:99990;background:rgba(5,5,10,0.97);display:flex;align-items:center;justify-content:center;padding:clamp(12px,3vw,20px);animation:modalFade 0.4s var(--ease);}
@keyframes modalFade{from{opacity:0;}to{opacity:1;}}
.v-close{position:fixed;top:clamp(14px,2.5vw,28px);right:clamp(14px,3vw,36px);z-index:99991;width:clamp(44px,6vw,52px);height:clamp(44px,6vw,52px);border:1px solid var(--border);background:transparent;color:var(--gold3);cursor:pointer;font-size:22px;display:flex;align-items:center;justify-content:center;transition:all 0.3s;font-family:serif;}
.v-close:hover{border-color:var(--gold);background:rgba(200,168,75,0.1);box-shadow:0 0 20px rgba(200,168,75,0.2);}
.v-iframe{width:min(1040px,96vw);height:calc(min(1040px,96vw)*9/16);border:none;border:1px solid var(--border);}

/* ── MARQUEE ── */
.marquee-row{overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:clamp(14px,2.5vw,20px) 0;background:var(--deep);}
.marquee-inner{display:flex;gap:0;white-space:nowrap;animation:marqueeX 20s linear infinite;}
.marquee-item{font-family:var(--f-display);font-size:clamp(40px,8vw,110px);color:transparent;-webkit-text-stroke:1px var(--border2);letter-spacing:0.08em;padding:0 clamp(20px,4vw,40px);flex-shrink:0;transition:color 0.3s,-webkit-text-stroke 0.3s,text-shadow 0.3s;}
.marquee-item:hover{color:var(--gold);-webkit-text-stroke:1px var(--gold);text-shadow:0 0 40px rgba(200,168,75,0.4);}
@keyframes marqueeX{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── DECORATIVE ── */
.corner-orn{position:absolute;pointer-events:none;}
.corner-orn.tl{top:28px;left:28px;width:40px;height:40px;border-top:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.tr{top:28px;right:28px;width:40px;height:40px;border-top:1px solid var(--border2);border-right:1px solid var(--border2);}
.corner-orn.bl{bottom:28px;left:28px;width:40px;height:40px;border-bottom:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.br{bottom:28px;right:28px;width:40px;height:40px;border-bottom:1px solid var(--border2);border-right:1px solid var(--border2);}
.orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;animation:orbDrift 20s ease-in-out infinite;}
.orb-1{width:clamp(200px,40vw,500px);height:clamp(200px,40vw,500px);background:radial-gradient(circle,rgba(200,168,75,0.07) 0%,transparent 70%);top:-200px;right:-100px;}
.orb-2{width:clamp(160px,30vw,400px);height:clamp(160px,30vw,400px);background:radial-gradient(circle,rgba(155,27,48,0.05) 0%,transparent 70%);bottom:-200px;left:-100px;animation-delay:7s;}
@keyframes orbDrift{0%,100%{transform:translate(0,0);}33%{transform:translate(30px,-20px);}66%{transform:translate(-20px,30px);}}

@keyframes sparkleAnim{
  0%{opacity:0;transform:translateY(0) scale(0) rotate(0deg);}
  15%{opacity:1;transform:translateY(-20px) scale(1) rotate(90deg);}
  85%{opacity:1;}
  100%{opacity:0;transform:translateY(var(--sy,-80px)) scale(0.5) rotate(var(--sr,360deg));}
}
.sparkle-particle{position:absolute;pointer-events:none;font-size:var(--spz,10px);color:var(--gold);animation:sparkleAnim var(--spdur,3s) var(--spdelay,0s) ease-in-out infinite;opacity:0;}

.neon-flicker{animation:neonFlicker 8s ease-in-out infinite;}
@keyframes neonFlicker{
  0%,100%{text-shadow:0 0 30px rgba(200,168,75,0.4),0 0 60px rgba(200,168,75,0.2);}
  92%{text-shadow:0 0 30px rgba(200,168,75,0.4),0 0 60px rgba(200,168,75,0.2);}
  93%{text-shadow:0 0 2px rgba(200,168,75,0.2);}
  94%{text-shadow:0 0 30px rgba(200,168,75,0.4),0 0 60px rgba(200,168,75,0.2);}
  95%{text-shadow:0 0 4px rgba(200,168,75,0.2);}
  96%{text-shadow:0 0 40px rgba(200,168,75,0.6),0 0 100px rgba(200,168,75,0.35);}
}

/* ════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS — TOP TO BOTTOM
   ════════════════════════════════════════════ */

/* ── 1400px: trim extreme nav gaps ── */
@media(max-width:1400px){
  .nav-links{gap:clamp(14px,2vw,32px);}
}

/* ── 1200px: switch 2-col grids to 1-col ── */
@media(max-width:1200px){
  .mandate-in{grid-template-columns:1fr;gap:clamp(48px,6vw,72px);}
  .pastor-in{grid-template-columns:1fr;gap:clamp(40px,6vw,64px);}
  .pod-in{grid-template-columns:1fr;gap:clamp(40px,6vw,64px);}
  .events-grid{grid-template-columns:1fr;gap:clamp(40px,6vw,72px);}
  .sermons-grid{grid-template-columns:1fr;gap:clamp(40px,6vw,72px);}
  .s-visual{display:none;} /* hide decorative rings when stacked — saves vertical space */
  .ft-top{grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,48px);}
  .stats{grid-template-columns:repeat(2,1fr);}
  .stat::after{display:none;}
  .stat:nth-child(odd)::after{content:'';display:block;position:absolute;right:0;top:20%;bottom:20%;width:1px;background:var(--border);}
  .m-img{height:clamp(280px,40vw,500px);}
}

/* ── 1024px: hide desktop nav, show burger ── */
@media(max-width:1024px){
  .nav-links{display:none;}
  .burger{display:flex;}
  .faith-grid{grid-template-columns:repeat(2,1fr);}
}

/* ── 900px: further tighten ── */
@media(max-width:900px){
  .min-grid{grid-template-columns:1fr 1fr;}
  .min-card{aspect-ratio:4/5;}
  .cta-tcard+.cta-tcard{border-left:1px solid var(--border);}
  .faith-hdr{flex-direction:column;align-items:flex-start;}
  .mins-hdr{flex-direction:column;align-items:flex-start;}
  .lens-flare{display:none;}
  .hero-rings .h-ring:nth-child(4){display:none;}
}

/* ── 768px: tablet portrait ── */
@media(max-width:768px){
  /* Faith grid: 2 cols or 1 — keep 2 as long as space allows */
  .faith-grid{grid-template-columns:repeat(2,1fr);}

  /* Footer: 2 col then 1 col */
  .ft-top{grid-template-columns:1fr 1fr;}

  /* Service grid: 1 col */
  .svc-grid{grid-template-columns:1fr;}

  /* Stats: 2 col */
  .stats{grid-template-columns:repeat(2,1fr);}

  /* CTA tgrid stack */
  .cta-tgrid{flex-direction:column;}
  .cta-tcard+.cta-tcard{border-left:none;border-top:1px solid var(--border);}
  .cta-tcard{min-width:unset;width:100%;}

  /* Verse banner quote */
  .v-q::before{display:none;}

  /* Podcast embed */
  .pod-embed iframe{height:clamp(180px,40vw,280px);}

  /* Mandate image */
  .m-img-frame{display:none;}
  .m-tag{bottom:10px;right:10px;}

  /* Footer bottom */
  .ft-bot{flex-direction:column;text-align:center;gap:12px;}
  .ft-bot-links{justify-content:center;}
  .ft-bot-orn{display:none;}

  /* Diagonals can cause rendering issues on small viewports */
  .diag-top{clip-path:none;margin-bottom:0;}
  .diag-bot{clip-path:none;margin-top:0;padding-top:var(--sp-xl);}
}

/* ── 600px: mobile landscape / large phone ── */
@media(max-width:600px){
  .faith-grid{grid-template-columns:1fr;}
  .ft-top{grid-template-columns:1fr;}
  .min-grid{grid-template-columns:1fr;}
  .min-card{aspect-ratio:16/9;}

  /* Hero — single line titles */
  .hero-t2{font-size:clamp(28px,9vw,60px);letter-spacing:0.03em;}
  .hero-t1{font-size:clamp(40px,11vw,80px);}

  /* Verse box  */
  .hero-verse-inner{padding:clamp(16px,4vw,28px);}

  /* Buttons full-width on very small */
  .hero-ctas{flex-direction:column;align-items:center;width:100%;}
  .hero-ctas .btn-g,.hero-ctas .btn-gh{width:100%;max-width:320px;justify-content:center;}

  /* Events button row */
  .ev-btns{flex-direction:column;align-items:flex-start;}

  /* Sermons button row */
  .s-btn-row{flex-direction:column;align-items:flex-start;}

  /* Stats */
  .stats{grid-template-columns:1fr;}
  .stat::after,.stat:nth-child(odd)::after{display:none;}
  .stat{border-bottom:1px solid var(--border);padding-bottom:clamp(14px,3vw,20px);}
  .stat:last-child{border-bottom:none;}

  /* CTA buttons */
  .cta-btns{flex-direction:column;align-items:center;}
  .cta-btns .btn-g,.cta-btns .btn-gh{width:100%;max-width:320px;justify-content:center;}

  /* Mandate buttons */
  .mandate-btns{flex-direction:column;align-items:flex-start;}

  /* Pastor section */
  .p-quote{padding-left:clamp(12px,3vw,20px);}
  .pastor-btns{flex-direction:column;align-items:flex-start;}

  /* Podcast platforms */
  .pod-plats{gap:8px;}

  /* Footer desc */
  .ft-desc{max-width:100%;}

  /* Carousel aspect */
  .car-img-wrap{aspect-ratio:1/1;}

  /* Corner ornaments at small sizes */
  .corner-orn{width:24px;height:24px;}
  .corner-orn.tl{top:16px;left:16px;}
  .corner-orn.tr{top:16px;right:16px;}
  .corner-orn.bl{bottom:16px;left:16px;}
  .corner-orn.br{bottom:16px;right:16px;}

  /* sacred geo smaller */
  .sacred-geo-wrap{overflow:hidden;width:100vw;height:100vw;}
}

/* ── 420px: small phone ── */
@media(max-width:420px){
  .hero-t1{font-size:clamp(36px,12vw,60px);}
  .hero-t2{font-size:clamp(24px,8vw,48px);}
  .hero-sub{letter-spacing:0.08em;}

  .mob-a{font-size:clamp(28px,10vw,44px);}

  .ev-name{font-size:13px;}
  .ev-time{font-size:8px;letter-spacing:0.2em;}

  .t-card{padding:clamp(20px,5vw,32px);}

  .s-h2{font-size:clamp(28px,8vw,48px);}
  .cta-title{font-size:clamp(36px,10vw,72px);}

  .marquee-item{font-size:clamp(32px,9vw,56px);}

  .ft-top{gap:24px;}
}

/* ── Ensure images never overflow ── */
img{max-width:100%;height:auto;}

/* ── Reduce motion ── */
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.001ms !important;animation-iteration-count:1 !important;transition-duration:0.001ms !important;scroll-behavior:auto !important;}
}
`;

/* ─────────────────────────────────────── CONSTANTS ── */
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Ministries", to: "/ministry/campus" },
  { label: "Events", to: "/events" },
  { label: "Sermons", to: "/sermons" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
];

const FALLBACK_EVENTS = [
  {
    day: "28",
    mon: "APR",
    name: "Homecell Fellowship",
    time: "6:00 PM – 7:00 PM",
  },
  {
    day: "30",
    mon: "APR",
    name: "The Secret Of Power",
    time: "5:00 PM – 8:00 PM",
  },
  { day: "02", mon: "MAY", name: "Global Mass Evangelism", time: "All Day" },
  {
    day: "03",
    mon: "MAY",
    name: "Mountain Moving Praise",
    time: "6:30 AM – 2:00 PM",
  },
  {
    day: "05",
    mon: "MAY",
    name: "May Week Of Spiritual Renewal",
    time: "5:00 PM – 8:00 PM",
  },
  {
    day: "10",
    mon: "MAY",
    name: "Global Anointing Service",
    time: "5:00 PM – 8:00 PM",
  },
];

const FAITH_CARDS = [
  {
    num: "01",
    icon: "✦",
    label: "Begin Your Journey",
    title: "LEARN ABOUT\nTHE CHURCH",
    to: "/about",
  },
  {
    num: "02",
    icon: "♱",
    label: "Come & Worship",
    title: "VIEW SERVICE\nTIMES",
    to: null,
    hash: "#services",
  },
  {
    num: "03",
    icon: "✧",
    label: "Take The Next Step",
    title: "UPCOMING\nPROGRAMS",
    to: "/events",
  },
  {
    num: "04",
    icon: "◈",
    label: "Support The Kingdom",
    title: "GIVE\nOFFERINGS",
    to: "/give",
  },
];

const TESTIMONIALS = [
  {
    text: "Praise the Lord — since joining the online morning devotion, I prayed and asked the Holy Spirit for help. The next morning I felt this sudden inner peace that I cannot explain. I have been very happy and joyful ever since. Thank you Lord.",
    author: "Aliche Merit",
    location: "Port Harcourt, Nigeria",
  },
  {
    text: "Since I joined the online morning devotion, my prayer life has improved tremendously and I keep enjoying ceaseless favors all round. Truly serving God pays, and I have come to give God all the glory for every good thing in my life.",
    author: "Nancy Obijiaku",
    location: "Lagos, Nigeria",
  },
  {
    text: "I joined the morning devotion when it was introduced. I kept believing God for monetization on my page and engagements. I wrote it in my request form and kept praying. God has answered my prayers — I have come to return all glory to His name.",
    author: "Furo Otarinyu",
    location: "Abuja, Nigeria",
  },
  {
    text: "I prayed to God that I don't want any extra year. To God be the glory — all my exams went successfully and I am a graduate now. Since I started the morning devotion, I have been enjoying financial breakthrough beyond what I can contain.",
    author: "Adobu Tari",
    location: "Port Harcourt, Nigeria",
  },
];

const MINISTRIES = [
  {
    label: "CAMPUS MINISTRY",
    img: "https://smhos.org/wp-content/uploads/2023/02/IMG_0109-768x512.jpg",
    to: "/ministry/campus",
  },
  {
    label: "LEADING LIGHTS",
    img: "https://smhos.org/wp-content/uploads/2023/02/IMG_7682x-768x512.jpg",
    to: "/ministry/children",
  },
  {
    label: "YOUTH MINISTRY",
    img: "https://smhos.org/wp-content/uploads/2023/02/IMG_2568-scaled-1-1536x1024-1-768x512.jpeg",
    to: "/ministry/youth",
  },
];

const CAROUSEL = [
  "https://smhos.org/wp-content/uploads/2026/04/ANNIVERSARY-IG-819x1024.png",
  "https://smhos.org/wp-content/uploads/2026/04/Care-Day-IG-APRIL.jpg-819x1024.jpeg",
  "https://smhos.org/wp-content/uploads/2026/04/Thur-16th-April-2026-IG-819x1024.png",
  "https://smhos.org/wp-content/uploads/2026/04/Sun-19th-April-2026-IG.jpg-819x1024.jpeg",
];

const SERMONS = [
  {
    title: "Faith for All-Round Possibilities",
    date: "10 April, 2025",
    thumb: "https://smhos.org/wp-content/uploads/2023/02/sddefault-5.jpg",
  },
  {
    title: "Faith for Supernatural Supplies",
    date: "10 April, 2025",
    thumb: "https://smhos.org/wp-content/uploads/2023/02/sddefault-4.jpg",
  },
  {
    title: "Impartation Of The Spirit Of Faith",
    date: "10 April, 2025",
    thumb: "https://smhos.org/wp-content/uploads/2023/02/sddefault-2.jpg",
  },
  {
    title: "Moving God To Act Through Faith-Provoked Praise",
    date: "16 February, 2023",
    thumb: "https://smhos.org/wp-content/uploads/2023/02/sddefault.jpg",
  },
];

const TICKER_ITEMS = [
  "Sunday Services — 6:30am · 8:00am · 9:30am · 11:00am",
  "Thursday Service — 5:00pm GMT+1",
  "Salvation Ministries — Home of Success",
  "Watch Live at smhos.com/livestream",
  "Give Online at smhos.com/give",
  "Founded 1997 — Port Harcourt, Nigeria",
];

/* ──────────────────────────────────── LIVE EVENTS FETCH ── */
async function fetchLiveEvents() {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system:
          "You are a data extractor. After searching, reply ONLY with a raw JSON array and nothing else — no markdown, no fences, no explanation.",
        messages: [
          {
            role: "user",
            content:
              'Search smhos.com/events for the next 6 upcoming events. Return ONLY this JSON array format: [{"day":"28","mon":"APR","name":"Event Name","time":"5:00 PM – 8:00 PM"}]. Use real event data from the website. Today is May 4 2026.',
          },
        ],
      }),
    });
    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");
    const match = text.match(/\[[\s\S]*?\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

/* ──────────────────────────────────────────── HOOKS ── */
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
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" },
    );
    document
      .querySelectorAll(".rev,.rev-l,.rev-r")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useCountUp(target, duration = 1800, suffix = "") {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started || isNaN(target)) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return { ref, display: isNaN(target) ? target : `${count}${suffix}` };
}

/* ─────────────────────────────────── COMPONENTS ── */
function SacredGeometry({ size = 700 }) {
  const c = size / 2,
    r = size * 0.44;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  });
  const outerStar = `${pts[0][0]},${pts[0][1]} ${pts[2][0]},${pts[2][1]} ${pts[4][0]},${pts[4][1]}`;
  const innerStar = `${pts[1][0]},${pts[1][1]} ${pts[3][0]},${pts[3][1]} ${pts[5][0]},${pts[5][1]}`;
  const midR = r * 0.58;
  const midPts = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    return [c + midR * Math.cos(a), c + midR * Math.sin(a)];
  });
  return (
    <div className="sacred-geo-wrap">
      <svg
        className="sacred-geo"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: "100vw", maxHeight: "100vw" }}
      >
        <g
          className="sacred-geo-outer"
          style={{ transformOrigin: `${c}px ${c}px` }}
        >
          <polygon
            points={outerStar}
            fill="none"
            stroke="#C8A84B"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <polygon
            points={innerStar}
            fill="none"
            stroke="#E2C06A"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="#C8A84B"
            strokeWidth="0.5"
            opacity="0.4"
          />
          <circle
            cx={c}
            cy={c}
            r={r * 0.58}
            fill="none"
            stroke="#C8A84B"
            strokeWidth="0.5"
            opacity="0.35"
          />
          <circle
            cx={c}
            cy={c}
            r={r * 0.29}
            fill="none"
            stroke="#E2C06A"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {pts.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r * 0.44}
              fill="none"
              stroke="#C8A84B"
              strokeWidth="0.4"
              opacity="0.2"
            />
          ))}
        </g>
        <g
          className="sacred-geo-inner"
          style={{ transformOrigin: `${c}px ${c}px` }}
        >
          {midPts.map(([x, y], i) => (
            <line
              key={i}
              x1={c}
              y1={c}
              x2={x}
              y2={y}
              stroke="#C8A84B"
              strokeWidth="0.4"
              opacity="0.25"
            />
          ))}
          {pts.map(([x, y], i) => {
            const next = pts[(i + 1) % 6];
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={next[0]}
                y2={next[1]}
                stroke="#E2C06A"
                strokeWidth="0.4"
                opacity="0.2"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
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
    const N = 60;
    for (let i = 0; i < N; i++) {
      const isStar = Math.random() < 0.2;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * (isStar ? 3 : 1.5) + 0.3,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.35 + 0.08),
        alpha: Math.random() * 0.5 + 0.1,
        life: Math.random(),
        isStar,
      });
    }
    const drawStar = (ctx, x, y, r, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = `rgba(200,168,75,${alpha})`;
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(-r / 2, -r * 2, r, r * 4);
        ctx.rotate(Math.PI / 4);
      }
      ctx.restore();
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.003;
        if (p.y < -10 || p.life > 1) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = 0;
          p.alpha = Math.random() * 0.5 + 0.1;
        }
        const fade = Math.sin(p.life * Math.PI);
        if (p.isStar) {
          drawStar(ctx, p.x, p.y, p.r * 0.8, p.alpha * fade * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,168,75,${p.alpha * fade})`;
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
  return <canvas ref={canvasRef} className="hero-canvas" />;
}

function HoloCard({ children, className, style, to, hash, onClick }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const holoRef = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    const holo = holoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(700px) rotateY(${(x - 0.5) * 14}deg) rotateX(${-(y - 0.5) * 14}deg) scale3d(1.03,1.03,1.03)`;
    if (holo) {
      holo.style.setProperty("--holo-x", `${x * 100}%`);
      holo.style.setProperty("--holo-y", `${y * 100}%`);
      holo.style.setProperty("--holo-angle", `${x * 360}deg`);
    }
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(700px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  }, []);
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (to) navigate(to);
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
        cursor: "pointer",
      }}
      onClick={handleClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={holoRef} className="f-card-holo" />
      {children}
    </div>
  );
}

function MagBtn({ to, href, className, children, onClick }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.3}px,${(e.clientY - rect.top - rect.height / 2) * 0.3}px) translateY(-3px)`;
  }, []);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (href) {
      window.open(href, "_blank", "noreferrer");
      return;
    }
    if (to) navigate(to);
  };
  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
      style={{
        transition: "transform 0.4s var(--ease3), box-shadow 0.3s",
        display: "inline-flex",
        alignItems: "center",
        gap: "clamp(8px,1.5vw,14px)",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
}

function Cursor() {
  const dot = useRef(null),
    ring = useRef(null),
    trail = useRef(null);
  useEffect(() => {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      raf;
    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const over = (e) => {
      const isLink = e.target.closest(
        "a,button,[role='button'],div[onClick],div[style*='pointer']",
      );
      ring.current?.classList.toggle("h", !!isLink);
    };
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      if (dot.current) dot.current.style.cssText = `left:${mx}px;top:${my}px;`;
      if (ring.current)
        ring.current.style.cssText = `left:${rx}px;top:${ry}px;`;
      if (trail.current)
        trail.current.style.cssText = `left:${tx}px;top:${ty}px;width:80px;height:80px;`;
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
      <div className="cur-trail" ref={trail} />
    </>
  );
}

function Loader({ done }) {
  return (
    <div className={`sm-loader${done ? " gone" : ""}`}>
      <div className="ldr-emblem">
        <div className="ldr-glow" />
        <svg className="ldr-svg" viewBox="0 0 90 90">
          <circle className="ldr-circle-path" cx="45" cy="45" r="44" />
          <path className="ldr-cross-path" d="M45 15 L45 75 M20 45 L70 45" />
        </svg>
      </div>
      <div className="ldr-name">SALVATION MINISTRIES</div>
      <div className="ldr-bar">
        <div className="ldr-fill" />
      </div>
    </div>
  );
}

function Sparkles({ count = 8, style }) {
  const [sparks] = useState(() =>
    Array.from({ length: count }, () => ({
      left: `${10 + Math.random() * 80}%`,
      bottom: `${Math.random() * 40}%`,
      sy: `${-(40 + Math.random() * 60)}px`,
      sr: `${180 + Math.random() * 360}deg`,
      spz: `${8 + Math.random() * 6}px`,
      spdur: `${2.5 + Math.random() * 2}s`,
      spdelay: `${Math.random() * 3}s`,
      symbol: ["✦", "✧", "◆", "·", "★"][Math.floor(Math.random() * 5)],
    })),
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
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

function StatCard({ num, label, delay }) {
  const raw = parseInt(num.replace(/\D/g, ""), 10);
  const suffix = num.replace(/[0-9]/g, "");
  const { ref, display } = useCountUp(isNaN(raw) ? NaN : raw, 2000, suffix);
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

/* ─────────────────────────────────── MAIN EXPORT ── */
export default function SalvationMinistries() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [carIdx, setCarIdx] = useState(0);
  const [testIdx, setTestIdx] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [events, setEvents] = useState(null);
  const navigate = useNavigate();
  const scrolled = useScrolled();
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () => setCarIdx((i) => (i + 1) % CAROUSEL.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(
      () => setTestIdx((i) => (i + 1) % TESTIMONIALS.length),
      7000,
    );
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen || videoOpen ? "hidden" : "";
  }, [menuOpen, videoOpen]);
  useEffect(() => {
    fetchLiveEvents().then((data) => setEvents(data || FALLBACK_EVENTS));
  }, []);

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="grain-overlay" />
      {!isTouch && <Cursor />}
      <Loader done={loaded} />

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
            <Link key={i} to={l.to} className="nav-a">
              {l.label}
            </Link>
          ))}
          <div className="nav-sep" />
          <Link to="/give" className="nav-give">
            <span>Give Online</span>
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
            <Link
              key={i}
              to={l.to}
              className="mob-a"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/give"
          className="mob-give"
          onClick={() => setMenuOpen(false)}
        >
          Give Online
        </Link>
      </div>

      {/* HERO */}
      <section id="home" className="sm-hero">
        <ParticleCanvas />
        <div className="hero-bg-img" />
        <div className="aurora" />
        <div className="hero-overlay" />
        <div className="god-rays" />
        <SacredGeometry size={700} />
        <div className="hero-rays">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-ray" />
          ))}
        </div>
        <div className="hero-rings">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-ring" />
          ))}
        </div>
        <div className="hero-glow" />
        <div className="lens-flare">
          <div className="lens-flare-core">
            <div className="lens-flare-streak" />
            <div className="lens-flare-streak" />
            <div className="lens-flare-streak" />
            <div className="lens-flare-halo" />
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-tag">
            <div className="hero-tag-line" />
            Welcome to
            <div className="hero-tag-line r" />
          </div>
          <h1>
            <div className="hero-t1 neon-flicker" data-text="SALVATION">
              SALVATION
            </div>
            <div className="hero-t2 prism">SALVATION MINISTRIES</div>
          </h1>
          <p className="hero-sub">Home of Success</p>
          <div className="hero-verse">
            <div className="hero-verse-inner">
              <div className="hero-verse-corner tl" />
              <div className="hero-verse-corner br" />
              <p className="hero-vt">
                "But on Mount Zion there shall be deliverance, and there shall
                be holiness; the house of Jacob shall possess their
                possessions."
              </p>
              <div className="hero-vr">
                Obadiah 1:17 · New King James Version
              </div>
            </div>
          </div>
          <div className="hero-ctas">
            <MagBtn href="/livestream" className="btn-g">
              <span>Watch Livestream</span>
              <span className="btn-arr">→</span>
            </MagBtn>
            <MagBtn to="/give" className="btn-gh">
              <span>Give Online</span>
              <span className="btn-arr">→</span>
            </MagBtn>
          </div>
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

      {/* STATS */}
      <div className="stats">
        <div className="stats-glow" />
        {[
          { num: "27+", label: "Years of Ministry" },
          { num: "100+", label: "Church Branches" },
          { num: "Millions", label: "Lives Transformed" },
          { num: "Global", label: "Kingdom Reach" },
        ].map((s, i) => (
          <StatCard key={i} num={s.num} label={s.label} delay={i * 0.1} />
        ))}
      </div>

      {/* MARQUEE */}
      <div className="marquee-row">
        <div className="marquee-inner">
          {[
            "SALVATION",
            "FAITH",
            "GLORY",
            "VICTORY",
            "GRACE",
            "POWER",
            "SALVATION",
            "FAITH",
            "GLORY",
            "VICTORY",
            "GRACE",
            "POWER",
          ].map((w, i) => (
            <span key={i} className="marquee-item">
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* MANDATE */}
      <section id="about" className="mandate diag-top">
        <div className="corner-orn tl" />
        <div className="corner-orn br" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="mandate-in">
          <div className="rev-l">
            <div className="m-img-wrap">
              <div className="m-img-frame" />
              <img
                src="https://smhos.org/wp-content/uploads/2025/03/DSC02290-819x1024.jpg"
                alt=""
                className="m-img"
              />
              <div className="m-tag">Est. 1997 · Port Harcourt</div>
            </div>
          </div>
          <div className="rev-r">
            <span className="m-year">1997</span>
            <div className="s-lbl">
              <div className="s-lbl-line" />
              The Mandate
            </div>
            <h2 className="s-h2">
              TO ESTABLISH THE KINGDOM OF GOD
              <br />
              <em>Here on Earth</em>
            </h2>
            <div className="s-orn" />
            <p className="m-p">
              From 1997 to date, God has authored every chapter of our story —
              increasingly bringing the Gospel to the unsaved, transforming the
              lives of people, and raising disciples for Christ across the
              globe.
            </p>
            <p className="m-p">
              What started as a small gathering of believers has grown into a
              worldwide movement of faith, driven by the unyielding mandate to
              see God's Kingdom established in every nation.
            </p>
            <div
              className="mandate-btns"
              style={{
                marginTop: "clamp(32px,5vw,52px)",
                display: "flex",
                gap: "clamp(10px,2vw,16px)",
                flexWrap: "wrap",
              }}
            >
              <MagBtn to="/about" className="btn-g">
                <span>Learn More</span>
                <span className="btn-arr">→</span>
              </MagBtn>
              <MagBtn to="/locator" className="btn-gh">
                <span>Find A Church</span>
              </MagBtn>
            </div>
          </div>
        </div>
      </section>

      {/* FAITH CARDS */}
      <section className="faith diag-bot">
        <div className="faith-bg-txt" aria-hidden>
          FAITH
        </div>
        <div className="faith-in">
          <div className="faith-hdr">
            <div>
              <div className="s-lbl rev">
                <div className="s-lbl-line" />
                Your Faith Walk
              </div>
              <h2 className="s-h2 rev" style={{ transitionDelay: "0.1s" }}>
                No matter where you are,
                <br />
                there is always <em>a next step</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <p className="s-body" style={{ maxWidth: 320 }}>
                Take your next step in your journey with God. Every path leads
                to purpose.
              </p>
            </div>
          </div>
          <div className="faith-grid">
            {FAITH_CARDS.map((c, i) => (
              <HoloCard
                key={i}
                to={c.to}
                hash={c.hash}
                className="f-card rev"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="f-card-bg" />
                <div className="f-top">
                  <div className="f-num">{c.num}</div>
                  <div className="f-icon">{c.icon}</div>
                </div>
                <div className="f-lbl">{c.label}</div>
                <div className="f-title">
                  {c.title.split("\n").map((l, j) => (
                    <span key={j} style={{ display: "block" }}>
                      {l}
                    </span>
                  ))}
                </div>
                <div className="f-div" />
                <div className="f-cta">
                  Explore <span>→</span>
                </div>
              </HoloCard>
            ))}
          </div>
        </div>
      </section>

      {/* VERSE BANNER */}
      <div className="v-banner">
        <div className="v-banner-starburst" />
        <div className="rev">
          <blockquote className="v-q">
            "Every promise of God requires your corresponding faith for it to be
            accomplished."
          </blockquote>
          <div className="v-attr">
            — Pastor David Ibiyeomie · Quote of the Month
          </div>
        </div>
      </div>

      {/* EVENTS */}
      <section id="events" className="events">
        <div className="events-in">
          <div className="events-grid">
            <div className="rev-l">
              <div className="s-lbl">
                <div className="s-lbl-line" />
                Upcoming Events
                {events === null && (
                  <span
                    style={{
                      fontFamily: "var(--f-ui)",
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      color: "var(--gold)",
                      marginLeft: 8,
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  >
                    · LOADING LIVE DATA
                  </span>
                )}
                {events && events !== FALLBACK_EVENTS && (
                  <span
                    style={{
                      fontFamily: "var(--f-ui)",
                      fontSize: 9,
                      letterSpacing: "0.3em",
                      color: "#00cc88",
                      marginLeft: 8,
                    }}
                  >
                    · LIVE
                  </span>
                )}
              </div>
              <h2 className="s-h2">
                JOIN OUR SERVICES
                <br />
                AND <em>Programs</em>
              </h2>
              <div className="s-orn" />
              <div className="ev-list">
                {events === null
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="ev-skeleton">
                          <div className="ev-skel-line wide" />
                          <div className="ev-skel-line narrow" />
                        </div>
                      ))
                  : events.map((ev, i) => (
                      <div
                        key={i}
                        className="ev-item"
                        onClick={() => navigate("/events")}
                      >
                        <div className="ev-date-block">
                          <div className="ev-day">{ev.day}</div>
                          <div className="ev-mon">{ev.mon}</div>
                        </div>
                        <div className="ev-info">
                          <div className="ev-name">{ev.name}</div>
                          <div className="ev-time">{ev.time}</div>
                        </div>
                        <div className="ev-arrow">→</div>
                      </div>
                    ))}
              </div>
              <div
                className="ev-btns"
                style={{
                  marginTop: "clamp(24px,4vw,40px)",
                  display: "flex",
                  gap: "clamp(10px,2vw,16px)",
                  flexWrap: "wrap",
                }}
              >
                <MagBtn to="/events" className="btn-g">
                  <span>View All Events</span>
                  <span className="btn-arr">→</span>
                </MagBtn>
                <MagBtn href="/livestream" className="btn-gh">
                  <span>Watch Livestream</span>
                </MagBtn>
              </div>
            </div>
            <div className="rev-r">
              <div className="car-frame">
                <div className="car-img-wrap">
                  <img
                    src={CAROUSEL[carIdx]}
                    alt=""
                    className="car-img"
                    key={carIdx}
                  />
                  <div className="car-over" />
                </div>
                <div className="car-cnt">
                  {String(carIdx + 1).padStart(2, "0")} /{" "}
                  {String(CAROUSEL.length).padStart(2, "0")}
                </div>
              </div>
              <div className="car-nav">
                <button
                  className="car-btn"
                  onClick={() =>
                    setCarIdx(
                      (i) => (i - 1 + CAROUSEL.length) % CAROUSEL.length,
                    )
                  }
                >
                  ‹
                </button>
                <div className="car-dots">
                  {CAROUSEL.map((_, i) => (
                    <div
                      key={i}
                      className={`car-dot${i === carIdx ? " active" : ""}`}
                      onClick={() => setCarIdx(i)}
                    />
                  ))}
                </div>
                <button
                  className="car-btn"
                  onClick={() => setCarIdx((i) => (i + 1) % CAROUSEL.length)}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PASTOR */}
      <section className="pastor">
        <div className="pastor-in">
          <div className="rev-l">
            <div className="s-lbl">
              <div className="s-lbl-line" />
              Presiding Pastor
            </div>
            <span className="p-qmark">"</span>
            <blockquote className="p-quote">
              David Ibiyeomie serves at Salvation Ministries as the Presiding
              Pastor. A prolific author and love-motivated philanthropist, his
              passion for soul-winning is only surpassed by his deep love for
              God. He is married to Peace Ibiyeomie, and together they have a
              thriving, glorious family.
            </blockquote>
            <div className="p-div" />
            <div className="p-name">DAVID IBIYEOMIE</div>
            <div className="p-role">
              Presiding Pastor · Salvation Ministries
            </div>
            <div
              className="pastor-btns"
              style={{
                marginTop: "clamp(28px,4vw,44px)",
                display: "flex",
                gap: "clamp(10px,2vw,16px)",
                flexWrap: "wrap",
              }}
            >
              <MagBtn to="/about" className="btn-g">
                <span>Our Story</span>
                <span className="btn-arr">→</span>
              </MagBtn>
            </div>
          </div>
          <div className="rev-r">
            <div className="vid-wrap">
              <div className="vid-frame" onClick={() => setVideoOpen(true)}>
                <img
                  src="https://smhos.org/wp-content/uploads/2025/03/Blue-and-White-3D-Modern-Delivery-Service-Feature-Poster.png"
                  alt=""
                  className="vid-img"
                />
                <div className="vid-ov">
                  <div className="play-outer">
                    <div className="play-inner">▶</div>
                  </div>
                </div>
                <div className="vid-lbl">Watch Inspiring Message</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="test-sec">
        <div className="test-bg" />
        <Sparkles count={12} />
        <div className="test-in">
          <div className="test-hdr">
            <div className="s-lbl rev" style={{ justifyContent: "center" }}>
              <div className="s-lbl-line" />
              Testimonials
              <div className="s-lbl-line" style={{ transform: "scaleX(-1)" }} />
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
              <div className="t-card-glow" />
              <div className="t-qm">"</div>
              <p className="t-txt">{TESTIMONIALS[testIdx].text}</p>
              <div className="t-auth-row">
                <div className="t-auth-dot" />
                <div>
                  <div className="t-auth-name">
                    {TESTIMONIALS[testIdx].author}
                  </div>
                  <div className="t-auth-loc">
                    {TESTIMONIALS[testIdx].location}
                  </div>
                </div>
              </div>
            </div>
            <div className="t-nav-row">
              <div className="t-dots">
                {TESTIMONIALS.map((_, i) => (
                  <div
                    key={i}
                    className={`t-dot${i === testIdx ? " active" : ""}`}
                    onClick={() => setTestIdx(i)}
                  />
                ))}
              </div>
              <div className="t-nav-btns">
                <button
                  className="t-nav-btn"
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
                  className="t-nav-btn"
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

      {/* SERMONS */}
      <section className="sermons">
        <div className="sermons-in">
          <div className="sermons-grid">
            <div className="rev-l">
              <div className="s-lbl">
                <div className="s-lbl-line" />
                Sermons
              </div>
              <h2 className="s-h2">
                LISTEN TO GOD'S
                <br />
                WORD <em>for You</em>
              </h2>
              <div className="s-orn" />
              <div className="sermons-list">
                {SERMONS.map((s, i) => (
                  <div
                    key={i}
                    className="s-item"
                    onClick={() => navigate("/sermons")}
                  >
                    <img src={s.thumb} alt="" className="s-item-thumb" />
                    <div className="s-item-info">
                      <div className="s-item-title">{s.title}</div>
                      <div className="s-item-date">{s.date}</div>
                    </div>
                    <div className="s-item-play">▶</div>
                  </div>
                ))}
              </div>
              <div
                className="s-btn-row"
                style={{
                  marginTop: "clamp(28px,4vw,44px)",
                  display: "flex",
                  gap: "clamp(10px,2vw,16px)",
                  flexWrap: "wrap",
                }}
              >
                <MagBtn to="/sermons" className="btn-g">
                  <span>All Sermons</span>
                  <span className="btn-arr">→</span>
                </MagBtn>
              </div>
            </div>
            <div className="rev-r">
              <div className="s-visual">
                <div className="s-rings">
                  <div className="s-ring">
                    <div className="s-center-icon">✦</div>
                  </div>
                  <div className="s-ring">
                    <div className="s-ring-dot" />
                  </div>
                  <div className="s-ring">
                    <div className="s-ring-dot" />
                  </div>
                  <div className="s-ring">
                    <div className="s-ring-dot" />
                  </div>
                </div>
                <div className="s-tags">
                  <div className="s-tag">Faith Provoked Praise</div>
                  <div className="s-tag">The Power of Prayer</div>
                  <div className="s-tag">Kingdom Living</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MINISTRIES */}
      <section id="ministries" className="mins">
        <div className="mins-in">
          <div className="mins-hdr">
            <div>
              <div className="s-lbl rev">
                <div className="s-lbl-line" />
                Fellowship · Experience · Grow
              </div>
              <h2 className="s-h2 rev" style={{ transitionDelay: "0.1s" }}>
                BE PART OF
                <br />
                <em>Our Ministries</em>
              </h2>
            </div>
            <div className="rev" style={{ transitionDelay: "0.2s" }}>
              <p className="s-body" style={{ maxWidth: 340 }}>
                No matter where you are in the world, there is a place for you
                in our kingdom family.
              </p>
            </div>
          </div>
          <div className="min-grid">
            {MINISTRIES.map((m, i) => (
              <Link
                key={i}
                to={m.to}
                className="min-card rev"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <img src={m.img} alt={m.label} className="min-img" />
                <div className="min-overlay" />
                <div className="min-gline" />
                <div className="min-content">
                  <div className="min-lbl">Ministry</div>
                  <div className="min-title">{m.label}</div>
                  <div className="min-arr">
                    <span className="min-arr-line" />
                    Explore
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services">
        <div className="services-in">
          <div className="s-lbl rev" style={{ justifyContent: "center" }}>
            <div className="s-lbl-line" />
            Join Us In Person
            <div className="s-lbl-line" style={{ transform: "scaleX(-1)" }} />
          </div>
          <h2
            className="s-h2 rev"
            style={{ textAlign: "center", transitionDelay: "0.1s" }}
          >
            GROW DEEPER THIS
            <br />
            <em>Week with God</em>
          </h2>
          <p className="svc-loc rev" style={{ transitionDelay: "0.2s" }}>
            Plot 17 Birabi Street, GRA Phase 1, Port Harcourt, Rivers, Nigeria
          </p>
          <div className="svc-grid rev" style={{ transitionDelay: "0.3s" }}>
            <div className="svc-card">
              <div className="svc-day">SUNDAY</div>
              <div className="svc-times">
                6:30 am
                <br />
                8:00 am
                <br />
                9:30 am
                <br />
                11:00 am
              </div>
              <div className="svc-tz">GMT +1</div>
            </div>
            <div className="svc-card">
              <div className="svc-day">THURSDAY</div>
              <div className="svc-times">5:00 pm</div>
              <div className="svc-tz">GMT +1</div>
            </div>
          </div>
          <div className="svc-sep rev" style={{ transitionDelay: "0.4s" }}>
            <div className="svc-sep-line" />
            <div className="svc-sep-icon">✦</div>
            <div className="svc-sep-line r" />
          </div>
          <div
            className="rev"
            style={{ transitionDelay: "0.5s", textAlign: "center" }}
          >
            <MagBtn to="/locator" className="btn-g">
              <span>Get Directions</span>
              <span className="btn-arr">→</span>
            </MagBtn>
          </div>
        </div>
      </section>

      {/* PODCAST */}
      <section className="podcast">
        <div className="pod-in">
          <div className="rev-l">
            <div className="s-lbl">
              <div className="s-lbl-line" />
              Listen Now
            </div>
            <h2 className="s-h2">
              FILL YOUR HEART WITH
              <br />
              <em>Life-Transforming</em>
              <br />
              MESSAGES
            </h2>
            <div className="s-orn" />
            <p className="s-body">
              The David Ibiyeomie Podcast delivers anointed, faith-building
              messages directly to your ears, wherever you are in the world.
            </p>
            <div className="pod-plats">
              {["Spotify", "Apple Podcasts", "Google Podcasts"].map((p) => (
                <div key={p} className="pod-plat">
                  <div className="pod-plat-dot" />
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className="rev-r">
            <div className="pod-embed">
              <div className="pod-embed-hdr">
                <div className="pod-dot" style={{ background: "#ff5f57" }} />
                <div className="pod-dot" style={{ background: "#ffbd2e" }} />
                <div className="pod-dot" style={{ background: "#28c941" }} />
                <span
                  style={{
                    fontFamily: "var(--f-ui)",
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    color: "var(--muted)",
                    marginLeft: 8,
                    fontWeight: 600,
                  }}
                >
                  DAVID IBIYEOMIE PODCAST
                </span>
              </div>
              <iframe
                src="https://open.spotify.com/embed/episode/0acNKGA2fw4YG5B3Qvi8xB?utm_source=generator&t=0"
                width="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="David Ibiyeomie Podcast"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-cross-v" />
        <div className="cta-cross-h" />
        <div className="cta-glow" />
        <div className="cta-starburst" />
        <div className="corner-orn tl" />
        <div className="corner-orn tr" />
        <div className="corner-orn bl" />
        <div className="corner-orn br" />
        <Sparkles count={16} />
        <div className="cta-inner">
          <div className="cta-eyebrow rev">
            <div className="cta-eyebrow-line" />
            Experience God Here
            <div className="cta-eyebrow-line r" />
          </div>
          <h2 className="cta-title rev" style={{ transitionDelay: "0.1s" }}>
            SEE YOU<em>IN CHURCH</em>
          </h2>
          <p className="cta-sub rev" style={{ transitionDelay: "0.2s" }}>
            Join thousands of believers every week and experience the
            transforming presence of God
          </p>
          <div className="cta-tgrid rev" style={{ transitionDelay: "0.3s" }}>
            <div className="cta-tcard">
              <div className="cta-tday">Sunday</div>
              <div className="cta-thrs">
                6:30 am
                <br />
                8:00 am
                <br />
                9:30 am
                <br />
                11:00 am
              </div>
            </div>
            <div className="cta-tcard">
              <div className="cta-tday">Thursday</div>
              <div className="cta-thrs">5:00 pm</div>
            </div>
          </div>
          <div className="cta-btns rev" style={{ transitionDelay: "0.4s" }}>
            <MagBtn to="/locator" className="btn-g">
              <span>Get Directions</span>
              <span className="btn-arr">→</span>
            </MagBtn>
            <MagBtn href="/livestream" className="btn-gh">
              <span>Watch Online</span>
            </MagBtn>
            <MagBtn to="/give" className="btn-gh">
              <span>Give Online</span>
            </MagBtn>
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
              Salvation Ministries — Home of Success. Founded 1997. A global
              movement of faith, raising disciples for Christ and establishing
              the Kingdom of God on earth.
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
                to="/livestream"
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
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Sermons", to: "/sermons" },
                { label: "Events", to: "/events" },
                { label: "Forms", to: "/forms" },
                { label: "Store", href: "https://smhosstore.com" },
                { label: "SWOLBI", href: "https://learn.swolbi.org" },
              ].map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="ft-link">
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="ft-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-title">Ministries</div>
            <ul className="ft-links">
              {[
                { label: "Campus Ministry", to: "/ministry/campus" },
                { label: "Leading Lights", to: "/ministry/children" },
                { label: "Youth Ministry", to: "/ministry/youth" },
                { label: "Church Locator", to: "/locator" },
                { label: "SWOLBI", href: "https://learn.swolbi.org" },
                { label: "Chokhmah", href: "https://chokhmah.org.ng" },
              ].map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="ft-link">
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="ft-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-title">Contact</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(12px,2vw,20px)",
              }}
            >
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
              <div>
                <div className="ft-cl">Address</div>
                <div className="ft-ci" style={{ lineHeight: 1.85 }}>
                  Plot 17 Birabi Street,
                  <br />
                  GRA Phase 1,
                  <br />
                  Port Harcourt, Rivers, Nigeria
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ft-bot">
          <div className="ft-copy">
            © 2026 Salvation Ministries. All Rights Reserved.
          </div>
          <div className="ft-bot-orn">
            <div className="ft-bot-line" />
            <div className="ft-bot-diamond" />
            <div className="ft-bot-line" />
          </div>
          <div className="ft-bot-links">
            <Link to="/contact" className="ft-bot-link">
              Contact
            </Link>
            <Link to="/give" className="ft-bot-link">
              Give
            </Link>
            <Link to="/forms" className="ft-bot-link">
              Forms
            </Link>
          </div>
        </div>
      </footer>

      {/* VIDEO MODAL */}
      {videoOpen && (
        <div className="v-modal" onClick={() => setVideoOpen(false)}>
          <button className="v-close" onClick={() => setVideoOpen(false)}>
            ✕
          </button>
          <iframe
            className="v-iframe"
            src="https://www.youtube.com/embed/ROgy5NqIzLU?autoplay=1&rel=0"
            title="Salvation Ministries"
            allow="autoplay; fullscreen"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
