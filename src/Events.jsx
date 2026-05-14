import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────────────── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

@property --shimmer-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}
@property --border-angle{syntax:'<angle>';initial-value:0deg;inherits:false;}

:root {
  --black:#05050A;--deep:#08080F;--dark:#0F0F1A;--mid:#1A1A2E;
  --panel:#12121E;--card:#161625;
  --gold:#C8A84B;--gold2:#E2C06A;--gold3:#F5D98A;--gold4:#FFF0BB;
  --glow:rgba(200,168,75,0.15);--glow2:rgba(200,168,75,0.06);
  --border:rgba(200,168,75,0.18);--border2:rgba(200,168,75,0.42);
  --white:#FDFAF4;--cream:#F5EDDA;--muted:#8A8070;--faint:#3A3830;
  --crimson:#9B1B30;--scarlet:#C0392B;
  --f-display:'Bebas Neue',sans-serif;
  --f-serif:'Playfair Display',serif;
  --f-body:'Libre Baskerville',serif;
  --f-ui:'Montserrat',sans-serif;
  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease2:cubic-bezier(0.76,0,0.24,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
  --nav-h:80px;
  --ctrl-h:74px;
}

body{background:var(--black);color:var(--white);font-family:var(--f-body);overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--deep);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--gold3));border-radius:2px;}

/* ── GRAIN ─────────────────────────────────────────────── */
.grain{position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:128px 128px;opacity:0.03;mix-blend-mode:overlay;
  animation:grainShift .4s steps(3) infinite;}
@keyframes grainShift{0%{transform:translate(0,0);}33%{transform:translate(-3px,2px);}66%{transform:translate(3px,-2px);}100%{transform:translate(-1px,3px);}}

/* ── CURSOR ─────────────────────────────────────────────── */
.cur-dot{position:fixed;pointer-events:none;z-index:99999;width:6px;height:6px;background:var(--gold3);border-radius:50%;transform:translate(-50%,-50%);mix-blend-mode:difference;}
.cur-ring{position:fixed;pointer-events:none;z-index:99998;width:38px;height:38px;border:1.5px solid var(--border2);border-radius:50%;transform:translate(-50%,-50%);transition:width .3s var(--ease),height .3s var(--ease),border-color .3s,background .3s;}
.cur-ring.h{width:64px;height:64px;border-color:var(--gold);background:rgba(200,168,75,0.06);}

/* ── LOADER ─────────────────────────────────────────────── */
.sm-loader{position:fixed;inset:0;z-index:9990;background:var(--black);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .9s var(--ease),visibility .9s;}
.sm-loader.gone{opacity:0;visibility:hidden;}
.ldr-emblem{position:relative;margin-bottom:40px;width:90px;height:90px;}
.ldr-svg{position:absolute;inset:0;}
.ldr-circle-path{fill:none;stroke:var(--gold);stroke-width:1;stroke-dasharray:283;stroke-dashoffset:283;animation:circleDraw 2s var(--ease) infinite;}
@keyframes circleDraw{0%{stroke-dashoffset:283;opacity:0;}20%{opacity:1;}70%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-283;opacity:0;}}
.ldr-cross-path{fill:none;stroke:var(--gold3);stroke-width:2;stroke-linecap:round;stroke-dasharray:200;stroke-dashoffset:200;animation:crossDraw 2s var(--ease) .3s infinite;}
@keyframes crossDraw{0%{stroke-dashoffset:200;opacity:0;}20%{opacity:1;}70%{stroke-dashoffset:0;opacity:1;}100%{stroke-dashoffset:-200;opacity:0;}}
.ldr-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,.3) 0%,transparent 70%);animation:glowPulse 2s ease-in-out infinite;}
@keyframes glowPulse{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1);}50%{opacity:1;transform:translate(-50%,-50%) scale(1.4);}}
.ldr-name{font-family:var(--f-display);font-size:clamp(14px,4vw,22px);letter-spacing:.5em;color:var(--gold);animation:pulse 2s ease-in-out infinite;text-align:center;padding:0 16px;}
.ldr-bar{width:min(200px,60vw);height:1px;background:var(--faint);margin-top:20px;overflow:hidden;}
.ldr-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:200% 100%;animation:loadBar 1.6s ease-in-out infinite;}
@keyframes loadBar{0%{width:0;margin-left:0;}50%{width:100%;margin-left:0;}100%{width:0;margin-left:100%;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}

/* ── NAV ─────────────────────────────────────────────────── */
.sm-nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:0 clamp(20px,4vw,64px);height:var(--nav-h);display:flex;align-items:center;justify-content:space-between;transition:all .5s var(--ease);}
.sm-nav::after{content:'';position:absolute;inset:0;background:transparent;backdrop-filter:blur(0px);transition:all .5s;pointer-events:none;}
.sm-nav.scrolled{height:68px;}
.sm-nav.scrolled::after{background:rgba(5,5,10,.94);backdrop-filter:blur(28px);border-bottom:1px solid var(--border);}
.nav-logo img{height:clamp(34px,5vw,46px);object-fit:contain;position:relative;z-index:1;filter:drop-shadow(0 0 14px rgba(200,168,75,.4));transition:filter .4s;}
.nav-logo img:hover{filter:drop-shadow(0 0 28px rgba(200,168,75,.7));}
.nav-links{display:flex;align-items:center;gap:clamp(20px,3vw,44px);position:relative;z-index:1;}
.nav-a{font-family:var(--f-ui);font-size:11px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:rgba(253,250,244,.6);text-decoration:none;position:relative;padding:4px 0;transition:color .3s;white-space:nowrap;}
.nav-a.active{color:var(--gold);}
.nav-a::after{content:'';position:absolute;bottom:-2px;left:50%;right:50%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);transition:left .4s var(--ease),right .4s var(--ease);}
.nav-a:hover,.nav-a.active{color:var(--gold3);}
.nav-a:hover::after,.nav-a.active::after{left:0;right:0;}
.nav-give{font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:12px 28px;position:relative;overflow:hidden;transition:transform .3s,box-shadow .3s;box-shadow:0 4px 28px rgba(200,168,75,.35);white-space:nowrap;}
.nav-give::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);transform:skewX(-20deg);transition:left .7s var(--ease);}
.nav-give:hover{transform:translateY(-2px);box-shadow:0 10px 48px rgba(200,168,75,.6);}
.nav-give:hover::after{left:150%;}
.burger{display:none;flex-direction:column;gap:6px;cursor:pointer;background:none;border:none;padding:8px;z-index:1001;flex-shrink:0;}
.burger-ln{width:26px;height:1.5px;background:var(--white);transition:all .4s var(--ease);transform-origin:center;display:block;}
.burger.open .burger-ln:nth-child(1){transform:translateY(7.5px) rotate(45deg);}
.burger.open .burger-ln:nth-child(2){opacity:0;transform:scaleX(0);}
.burger.open .burger-ln:nth-child(3){transform:translateY(-7.5px) rotate(-45deg);}
.mob-nav{position:fixed;inset:0;z-index:999;background:var(--deep);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:translateX(100%);transition:transform .7s var(--ease2);overflow:auto;padding:80px 20px 40px;}
.mob-nav.open{transform:translateX(0);}
.mob-nav::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 50% 50%,rgba(200,168,75,.06) 0%,transparent 70%);}
.mob-links{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;}
.mob-a{font-family:var(--f-display);font-size:clamp(36px,9vw,72px);color:var(--white);text-decoration:none;letter-spacing:.05em;opacity:0;transform:translateX(40px);transition:color .3s,opacity .5s,transform .5s;}
.mob-nav.open .mob-a{opacity:1;transform:translateX(0);}
.mob-nav.open .mob-a:nth-child(1){transition-delay:.08s;}
.mob-nav.open .mob-a:nth-child(2){transition-delay:.14s;}
.mob-nav.open .mob-a:nth-child(3){transition-delay:.2s;}
.mob-nav.open .mob-a:nth-child(4){transition-delay:.26s;}
.mob-nav.open .mob-a:nth-child(5){transition-delay:.32s;}
.mob-a:hover{color:var(--gold);}
.mob-give{font-family:var(--f-ui);font-size:13px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));text-decoration:none;padding:16px 48px;margin-top:24px;opacity:0;transform:translateY(20px);transition:opacity .5s .44s,transform .5s .44s;}
.mob-nav.open .mob-give{opacity:1;transform:translateY(0);}

/* ── HERO ────────────────────────────────────────────────── */
.ev-hero{min-height:clamp(55vh,70vh,85vh);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;background:var(--black);}
.ev-hero-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
.ev-hero-bg{position:absolute;inset:0;background:url('https://smhos.org/wp-content/uploads/2025/03/DSC02290-819x1024.jpg') center/cover;opacity:.07;filter:saturate(.2);}
.ev-hero-overlay{position:absolute;inset:0;background:radial-gradient(ellipse 70% 100% at 50% 60%,rgba(200,168,75,.07) 0%,var(--black) 70%);}
.aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.aurora::before{content:'';position:absolute;width:150%;height:150%;top:-25%;left:-25%;
  background:radial-gradient(ellipse 80% 40% at 20% 30%,rgba(200,168,75,.06) 0%,transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 70%,rgba(155,27,48,.04) 0%,transparent 60%);
  animation:auroraDrift 18s ease-in-out infinite alternate;}
@keyframes auroraDrift{0%{transform:translate(0,0) scale(1);}100%{transform:translate(3%,2%) scale(1.06);}}

.god-rays{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.god-rays::before{content:'';position:absolute;top:-60%;left:50%;transform-origin:top center;width:300%;height:200%;transform:translateX(-50%);
  background:conic-gradient(from 270deg at 50% 0%,transparent 0deg,rgba(200,168,75,.035) 2.5deg,transparent 5deg,transparent 13deg,rgba(255,230,120,.028) 15.5deg,transparent 18deg,transparent 26deg,rgba(200,168,75,.04) 28.5deg,transparent 31deg,transparent 44deg,rgba(255,240,150,.022) 46.5deg,transparent 49deg,transparent 100deg);
  animation:godRaysRotate 120s linear infinite;}
@keyframes godRaysRotate{from{transform:translateX(-50%) rotate(0deg);}to{transform:translateX(-50%) rotate(360deg);}}

.ev-rings{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.ev-ring{position:absolute;top:50%;left:50%;border-radius:50%;border:1px solid var(--border);transform:translate(-50%,-50%);animation:ringPulse 10s ease-in-out infinite;}
.ev-ring:nth-child(1){width:min(260px,70vw);height:min(260px,70vw);border:2px solid rgba(200,168,75,.3);animation-delay:0s;}
.ev-ring:nth-child(2){width:min(460px,95vw);height:min(460px,95vw);animation-delay:1.5s;}
.ev-ring:nth-child(3){width:min(700px,140vw);height:min(700px,140vw);border-color:rgba(200,168,75,.07);animation-delay:3s;}
@keyframes ringPulse{0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}50%{opacity:.4;transform:translate(-50%,-50%) scale(1.03);}}

.hero-glow{position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);width:min(600px,100vw);height:min(600px,100vw);border-radius:50%;background:radial-gradient(circle,rgba(200,168,75,.09) 0%,transparent 65%);pointer-events:none;animation:glowBrth 7s ease-in-out infinite;}
@keyframes glowBrth{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1;}50%{transform:translate(-50%,-50%) scale(1.15);opacity:.6;}}

.ev-hero-content{position:relative;z-index:5;text-align:center;padding:clamp(80px,12vh,120px) clamp(16px,5vw,40px) clamp(40px,6vh,80px);max-width:1100px;display:flex;flex-direction:column;align-items:center;}
.hero-tag{font-family:var(--f-ui);font-size:clamp(9px,1.5vw,12px);font-weight:700;letter-spacing:.6em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:clamp(8px,2vw,16px);margin-bottom:clamp(16px,3vh,32px);opacity:0;animation:fadeUp .9s .3s var(--ease) forwards;white-space:nowrap;}
.hero-tag-line{height:1px;width:clamp(24px,4vw,50px);background:linear-gradient(90deg,transparent,var(--gold));}
.hero-tag-line.r{background:linear-gradient(90deg,var(--gold),transparent);}
.ev-hero-t1{font-family:var(--f-display);font-size:clamp(56px,13vw,180px);font-weight:400;line-height:.88;color:var(--white);letter-spacing:.06em;opacity:0;animation:fadeUp 1s .5s var(--ease) forwards;text-shadow:0 0 120px rgba(200,168,75,.3);}
.prism{background:linear-gradient(90deg,var(--gold) 0%,var(--gold4) 12%,var(--gold2) 22%,#fffbe8 35%,var(--gold3) 48%,var(--gold2) 60%,#ffeead 72%,var(--gold4) 82%,var(--gold) 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:prismShift 6s linear infinite;filter:drop-shadow(0 0 40px rgba(200,168,75,.5));}
@keyframes prismShift{0%{background-position:0% center;}100%{background-position:300% center;}}
.ev-hero-sub{font-family:var(--f-serif);font-size:clamp(13px,2.5vw,22px);font-style:italic;color:rgba(253,250,244,.4);letter-spacing:.15em;margin-top:clamp(10px,2vh,18px);opacity:0;animation:fadeUp .9s .8s var(--ease) forwards;}
.ev-hero-breadcrumb{display:flex;align-items:center;gap:12px;margin-top:clamp(16px,3vh,32px);font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:.35em;text-transform:uppercase;color:var(--muted);opacity:0;animation:fadeUp .9s 1s var(--ease) forwards;}
.bc-sep{color:var(--gold);opacity:.6;}
.bc-cur{color:var(--gold3);}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}

/* ── TICKER ─────────────────────────────────────────────── */
.ticker{padding:13px 0;overflow:hidden;background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));background-size:300% 100%;animation:tickerShimmer 5s linear infinite;}
@keyframes tickerShimmer{0%{background-position:0% 0%;}100%{background-position:300% 0%;}}
.ticker-inner{display:flex;white-space:nowrap;animation:tick 28s linear infinite;}
.t-item{display:flex;align-items:center;gap:clamp(16px,3vw,28px);padding:0 clamp(16px,3vw,28px);font-family:var(--f-ui);font-size:clamp(9px,1.5vw,11px);font-weight:700;letter-spacing:.35em;text-transform:uppercase;color:var(--black);flex-shrink:0;}
.t-dot{width:4px;height:4px;background:var(--black);border-radius:50%;opacity:.35;}
@keyframes tick{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── CONTROLS BAR ───────────────────────────────────────── */
.ev-controls{background:rgba(18,18,30,0.97);border-bottom:1px solid var(--border);padding:0 clamp(16px,4vw,64px);position:sticky;top:0;z-index:100;backdrop-filter:blur(24px);}
.ev-controls-inner{max-width:1440px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:16px 0;}
.ev-search-wrap{display:flex;align-items:center;gap:12px;flex:1;min-width:180px;max-width:420px;background:rgba(200,168,75,.04);border:1px solid var(--border);padding:0 16px;position:relative;transition:border-color .3s;}
.ev-search-wrap:focus-within{border-color:var(--gold);}
.ev-search-icon{color:var(--gold);font-size:14px;flex-shrink:0;}
.ev-search{background:transparent;border:none;outline:none;font-family:var(--f-ui);font-size:12px;font-weight:500;letter-spacing:.12em;color:var(--white);width:100%;padding:13px 0;}
.ev-search::placeholder{color:var(--muted);}
.ev-filters{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.ev-filter-btn{font-family:var(--f-ui);font-size:clamp(8px,1.2vw,10px);font-weight:700;letter-spacing:.28em;text-transform:uppercase;padding:9px clamp(10px,2vw,20px);border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;transition:all .3s var(--ease3);white-space:nowrap;}
.ev-filter-btn.active{background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);border-color:var(--gold);}
.ev-filter-btn:hover:not(.active){border-color:var(--gold);color:var(--gold3);}
.ev-ctrl-right{display:flex;align-items:center;gap:12px;flex-shrink:0;}
.ev-view-btns{display:flex;gap:3px;}
.ev-view-btn{width:38px;height:38px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .3s;}
.ev-view-btn.active{background:rgba(200,168,75,.12);border-color:var(--gold);color:var(--gold);}
.ev-count{font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);white-space:nowrap;}
.ev-count span{color:var(--gold3);}

/* ── MAIN LAYOUT ───────────────────────────────────────── */
.ev-main{max-width:1440px;margin:0 auto;padding:clamp(48px,6vw,80px) clamp(16px,4.5vw,64px) clamp(80px,10vw,140px);position:relative;}

/* ── SECTION HEADINGS ──────────────────────────────────── */
.ev-month-head{display:flex;align-items:center;gap:clamp(14px,2.5vw,24px);margin-bottom:clamp(28px,4vw,48px);margin-top:clamp(48px,6vw,80px);}
.ev-month-head:first-child{margin-top:0;}
.ev-month-txt{font-family:var(--f-display);font-size:clamp(40px,7vw,88px);font-weight:400;color:var(--white);letter-spacing:.05em;line-height:1;}
.ev-month-num{font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-top:6px;}
.ev-month-line{flex:1;height:1px;background:linear-gradient(90deg,var(--border2),transparent);}
.ev-month-count{font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);white-space:nowrap;}

/* ── GRID VIEW ─────────────────────────────────────────── */
.ev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(340px,100%),1fr));gap:3px;}

/* ── EVENT CARD ─────────────────────────────────────────── */
.ev-card{background:var(--panel);position:relative;overflow:hidden;text-decoration:none;display:block;transition:background .4s,transform .4s var(--ease3),box-shadow .4s;cursor:pointer;}

.ev-card::before{content:'';position:absolute;inset:-2px;z-index:-1;background:conic-gradient(from var(--border-angle,0deg),transparent 0%,var(--gold3) 8%,var(--gold) 16%,transparent 24%,transparent 50%,var(--gold3) 58%,transparent 66%);opacity:0;animation:borderSpin 4s linear infinite;transition:opacity .4s;}
@keyframes borderSpin{from{--border-angle:0deg;}to{--border-angle:360deg;}}
.ev-card:hover::before{opacity:1;}

.ev-card-top-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),transparent);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease);}
.ev-card:hover .ev-card-top-line{transform:scaleX(1);}

.ev-card:hover{background:var(--card);transform:translateY(-4px);box-shadow:0 24px 64px rgba(0,0,0,.5),0 0 50px rgba(200,168,75,.07),inset 0 1px 0 rgba(200,168,75,.1);}

.ev-card-img-wrap{position:relative;aspect-ratio:4/5;overflow:hidden;}
.ev-card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .9s var(--ease),filter .6s;filter:brightness(.85) saturate(.9);}
.ev-card:hover .ev-card-img{transform:scale(1.06);filter:brightness(.7) saturate(.7);}
.ev-card-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(5,5,10,.95) 0%,rgba(5,5,10,.3) 45%,transparent 100%);}

.ev-card-cat{position:absolute;top:clamp(14px,2vw,24px);left:clamp(14px,2vw,24px);font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;padding:7px 14px;background:rgba(5,5,10,.8);border:1px solid var(--border);color:var(--gold3);backdrop-filter:blur(10px);transition:background .3s,border-color .3s;}
.ev-card:hover .ev-card-cat{background:rgba(200,168,75,.15);border-color:var(--gold);}

.ev-card-date-tag{position:absolute;top:clamp(14px,2vw,24px);right:clamp(14px,2vw,24px);text-align:center;background:rgba(5,5,10,.85);border:1px solid var(--border);padding:10px 14px;backdrop-filter:blur(10px);transition:border-color .3s,background .3s,box-shadow .3s;}
.ev-card:hover .ev-card-date-tag{border-color:var(--gold);background:rgba(200,168,75,.12);box-shadow:0 0 20px rgba(200,168,75,.2);}
.ev-card-day{font-family:var(--f-display);font-size:clamp(28px,4vw,38px);line-height:1;color:var(--gold);letter-spacing:.04em;}
.ev-card-mon{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.45em;text-transform:uppercase;color:var(--muted);margin-top:2px;}

.ev-card-body{padding:clamp(20px,3vw,36px) clamp(20px,3vw,36px) clamp(24px,3.5vw,40px);}
.ev-card-meta{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
.ev-card-weekday{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);background:rgba(200,168,75,.08);border:1px solid var(--border);padding:6px 12px;}
.ev-card-time-badge{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:var(--muted);}
.ev-card-title{font-family:var(--f-display);font-size:clamp(22px,3vw,36px);font-weight:400;color:var(--white);line-height:1.1;letter-spacing:.04em;margin-bottom:16px;transition:color .3s;}
.ev-card:hover .ev-card-title{color:var(--gold3);}
.ev-card-venue{display:flex;align-items:flex-start;gap:10px;margin-bottom:22px;}
.ev-venue-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);margin-top:5px;flex-shrink:0;box-shadow:0 0 8px rgba(200,168,75,.5);}
.ev-venue-txt{font-family:var(--f-body);font-size:13px;font-weight:400;color:var(--muted);line-height:1.6;font-style:italic;}
.ev-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:18px;border-top:1px solid var(--border);}
.ev-card-cta{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:10px;transition:gap .3s;}
.ev-card:hover .ev-card-cta{gap:16px;}
.ev-card-arr{transition:transform .3s;}
.ev-card:hover .ev-card-arr{transform:translateX(4px);}
.ev-card-type{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--faint);}

/* ── LIST VIEW ─────────────────────────────────────────── */
.ev-list-view{display:flex;flex-direction:column;gap:0;}
.ev-list-item{display:flex;align-items:stretch;gap:0;text-decoration:none;position:relative;overflow:hidden;border-bottom:1px solid var(--border);transition:background .3s;min-height:120px;}
.ev-list-item::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(200,168,75,.04);transition:width .4s var(--ease);}
.ev-list-item:hover::before{width:100%;}
.ev-list-item::after{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,168,75,.04),transparent);transform:skewX(-20deg);transition:left .7s var(--ease);}
.ev-list-item:hover::after{left:150%;}
.ev-list-date{flex-shrink:0;width:clamp(80px,12vw,110px);text-align:center;border-right:1px solid var(--border);padding:clamp(20px,3vw,32px) clamp(8px,1.5vw,16px);background:rgba(200,168,75,.025);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:background .3s,border-color .3s;}
.ev-list-item:hover .ev-list-date{background:rgba(200,168,75,.08);border-color:var(--border2);}
.ev-list-day{font-family:var(--f-display);font-size:clamp(36px,6vw,52px);line-height:1;color:var(--gold);letter-spacing:.04em;}
.ev-list-mon{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.45em;text-transform:uppercase;color:var(--muted);margin-top:4px;}
.ev-list-wk{font-family:var(--f-ui);font-size:8px;font-weight:600;letter-spacing:.35em;text-transform:uppercase;color:var(--faint);margin-top:6px;}
.ev-list-img-wrap{flex-shrink:0;width:clamp(80px,10vw,130px);overflow:hidden;}
.ev-list-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.7) saturate(.8);transition:filter .5s,transform .6s;}
.ev-list-item:hover .ev-list-img{filter:brightness(.5) saturate(.6);transform:scale(1.05);}
.ev-list-body{flex:1;padding:clamp(18px,2.5vw,32px) clamp(16px,2.5vw,36px);display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1;min-width:0;}
.ev-list-cat{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;}
.ev-list-title{font-family:var(--f-display);font-size:clamp(18px,3vw,32px);font-weight:400;color:var(--white);line-height:1.15;letter-spacing:.04em;margin-bottom:10px;transition:color .3s;}
.ev-list-item:hover .ev-list-title{color:var(--gold3);}
.ev-list-time{font-family:var(--f-ui);font-size:10px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;}
.ev-list-venue{font-family:var(--f-body);font-size:13px;font-style:italic;color:var(--faint);line-height:1.5;}
.ev-list-arrow{flex-shrink:0;display:flex;align-items:center;padding:0 clamp(16px,2.5vw,36px);color:var(--gold);font-size:22px;opacity:0;transform:translateX(-12px);transition:opacity .3s,transform .3s;position:relative;z-index:1;}
.ev-list-item:hover .ev-list-arrow{opacity:1;transform:translateX(0);}

/* ── SUBSCRIBE PANEL ───────────────────────────────────── */
.ev-subscribe{margin-top:clamp(48px,6vw,80px);position:relative;overflow:hidden;}
.ev-subscribe-inner{background:var(--panel);border:1px solid var(--border);padding:clamp(36px,5vw,72px) clamp(24px,5vw,80px);display:grid;grid-template-columns:1fr 1fr;gap:clamp(36px,5vw,80px);align-items:center;position:relative;}

.ev-subscribe-inner::before{content:'';position:absolute;inset:-1.5px;z-index:-1;background:conic-gradient(from var(--shimmer-angle,0deg),transparent 0%,var(--gold3) 8%,var(--gold) 16%,transparent 24%,transparent 50%,var(--gold3) 58%,transparent 66%);animation:shimmerSpin 6s linear infinite;}
@keyframes shimmerSpin{from{--shimmer-angle:0deg;}to{--shimmer-angle:360deg;}}
.ev-subscribe-inner::after{content:'';position:absolute;inset:1px;background:var(--panel);z-index:-1;}

.ev-sub-corner{position:absolute;width:16px;height:16px;border-color:var(--gold3);border-style:solid;}
.ev-sub-corner.tl{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.ev-sub-corner.br{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.ev-sub-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(200,168,75,.05) 0%,transparent 100%);pointer-events:none;}
.ev-sub-lbl{font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:.5em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.ev-sub-lbl-line{height:1px;width:28px;background:linear-gradient(90deg,var(--border2),transparent);}
.ev-sub-title{font-family:var(--f-display);font-size:clamp(30px,4.5vw,60px);font-weight:400;color:var(--white);line-height:.95;letter-spacing:.04em;margin-bottom:14px;}
.ev-sub-body{font-family:var(--f-body);font-size:clamp(13px,1.5vw,16px);font-style:italic;color:var(--muted);line-height:1.9;}
.ev-sub-links{display:flex;flex-direction:column;gap:10px;}
.ev-sub-link{display:flex;align-items:center;gap:16px;padding:clamp(14px,2vw,20px) clamp(16px,2vw,28px);border:1px solid var(--border);background:rgba(200,168,75,.03);text-decoration:none;transition:background .3s,border-color .3s,box-shadow .3s;position:relative;overflow:hidden;}
.ev-sub-link::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(200,168,75,.05),transparent);transform:skewX(-20deg);transition:left .7s var(--ease);}
.ev-sub-link:hover::after{left:150%;}
.ev-sub-link:hover{border-color:var(--gold);background:rgba(200,168,75,.08);box-shadow:0 0 24px rgba(200,168,75,.1);}
.ev-sub-link-icon{width:38px;height:38px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;color:var(--gold);transition:border-color .3s,background .3s,transform .4s;}
.ev-sub-link:hover .ev-sub-link-icon{border-color:var(--gold);background:rgba(200,168,75,.12);transform:rotate(15deg);}
.ev-sub-link-info{flex:1;min-width:0;}
.ev-sub-link-name{font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--white);margin-bottom:3px;transition:color .3s;}
.ev-sub-link:hover .ev-sub-link-name{color:var(--gold3);}
.ev-sub-link-desc{font-family:var(--f-ui);font-size:9px;font-weight:500;letter-spacing:.15em;color:var(--muted);}
.ev-sub-link-arr{color:var(--gold);opacity:0;transform:translateX(-8px);transition:opacity .3s,transform .3s;flex-shrink:0;}
.ev-sub-link:hover .ev-sub-link-arr{opacity:1;transform:translateX(0);}
.ev-sub-btns{display:flex;gap:14px;flex-wrap:wrap;margin-top:clamp(20px,3vw,36px);}

/* ── VERSE BANNER ──────────────────────────────────────── */
.v-banner{background:var(--dark);padding:clamp(56px,8vw,96px) clamp(20px,6vw,60px);text-align:center;position:relative;overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.v-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 200% at 50% 50%,rgba(200,168,75,.06) 0%,transparent 100%);}
.v-q{font-family:var(--f-serif);font-size:clamp(16px,3vw,40px);font-style:italic;color:var(--white);line-height:1.6;max-width:880px;margin:0 auto 28px;position:relative;z-index:1;}
.v-q::before{content:'\\201C';font-family:var(--f-display);font-size:clamp(60px,12vw,120px);color:rgba(200,168,75,.12);position:absolute;top:-30px;left:-10px;line-height:1;pointer-events:none;}
.v-attr{font-family:var(--f-ui);font-size:10px;font-weight:700;letter-spacing:.45em;text-transform:uppercase;color:var(--gold);position:relative;z-index:1;}

/* ── EMPTY STATE ───────────────────────────────────────── */
.ev-empty{text-align:center;padding:clamp(60px,10vw,100px) clamp(20px,5vw,40px);display:flex;flex-direction:column;align-items:center;gap:20px;}
.ev-empty-icon{font-family:var(--f-display);font-size:clamp(48px,10vw,80px);color:var(--faint);}
.ev-empty-title{font-family:var(--f-display);font-size:clamp(28px,5vw,40px);color:var(--muted);letter-spacing:.05em;}
.ev-empty-body{font-family:var(--f-body);font-size:clamp(13px,1.8vw,16px);font-style:italic;color:var(--faint);max-width:400px;line-height:1.8;}

/* ── BUTTONS ─────────────────────────────────────────────── */
.btn-g{display:inline-flex;align-items:center;gap:12px;font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);text-decoration:none;padding:clamp(14px,2vw,18px) clamp(24px,4vw,44px);position:relative;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s;box-shadow:0 6px 36px rgba(200,168,75,.35);}
.btn-g::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold4),var(--gold3));opacity:0;transition:opacity .3s;}
.btn-g::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-20deg);transition:left .7s var(--ease);}
.btn-g:hover{transform:translateY(-3px);box-shadow:0 16px 64px rgba(200,168,75,.55);}
.btn-g:hover::before{opacity:1;}
.btn-g:hover::after{left:150%;}
.btn-g span,.btn-gh span{position:relative;z-index:1;}
.btn-arr{position:relative;z-index:1;transition:transform .3s;}
.btn-g:hover .btn-arr{transform:translateX(5px);}
.btn-gh{display:inline-flex;align-items:center;gap:12px;font-family:var(--f-ui);font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;background:transparent;color:var(--gold3);text-decoration:none;padding:clamp(13px,2vw,17px) clamp(24px,4vw,44px);border:1.5px solid var(--border2);position:relative;overflow:hidden;transition:all .3s var(--ease);}
.btn-gh::before{content:'';position:absolute;inset:0;background:rgba(200,168,75,.07);opacity:0;transition:opacity .3s;}
.btn-gh:hover{border-color:var(--gold);color:var(--gold2);box-shadow:0 0 30px rgba(200,168,75,.15);}
.btn-gh:hover::before{opacity:1;}

/* ── CORNER ORNAMENTS ─────────────────────────────────── */
.corner-orn{position:absolute;pointer-events:none;}
.corner-orn.tl{top:clamp(16px,2.5vw,28px);left:clamp(16px,2.5vw,28px);width:clamp(24px,3.5vw,40px);height:clamp(24px,3.5vw,40px);border-top:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.tr{top:clamp(16px,2.5vw,28px);right:clamp(16px,2.5vw,28px);width:clamp(24px,3.5vw,40px);height:clamp(24px,3.5vw,40px);border-top:1px solid var(--border2);border-right:1px solid var(--border2);}
.corner-orn.bl{bottom:clamp(16px,2.5vw,28px);left:clamp(16px,2.5vw,28px);width:clamp(24px,3.5vw,40px);height:clamp(24px,3.5vw,40px);border-bottom:1px solid var(--border2);border-left:1px solid var(--border2);}
.corner-orn.br{bottom:clamp(16px,2.5vw,28px);right:clamp(16px,2.5vw,28px);width:clamp(24px,3.5vw,40px);height:clamp(24px,3.5vw,40px);border-bottom:1px solid var(--border2);border-right:1px solid var(--border2);}

/* ── S-ORN ─────────────────────────────────────────────── */
.s-orn{position:relative;width:64px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:clamp(16px,2.5vw,28px) 0;}
.s-orn::after{content:'✦';position:absolute;top:50%;left:70px;transform:translateY(-50%);font-size:10px;color:var(--gold);opacity:.5;animation:diamondSpin 8s linear infinite;}
@keyframes diamondSpin{from{transform:translateY(-50%) rotate(0deg);}to{transform:translateY(-50%) rotate(360deg);}}

/* ── REVEAL ─────────────────────────────────────────────── */
.rev{opacity:0;transform:translateY(40px);transition:opacity .9s var(--ease),transform .9s var(--ease);}
.rev.vis{opacity:1;transform:translateY(0);}

/* ── SPARKLE ─────────────────────────────────────────────── */
@keyframes sparkleAnim{0%{opacity:0;transform:translateY(0) scale(0) rotate(0deg);}15%{opacity:1;transform:translateY(-20px) scale(1) rotate(90deg);}85%{opacity:1;}100%{opacity:0;transform:translateY(var(--sy,-80px)) scale(.5) rotate(var(--sr,360deg));}}
.sparkle-particle{position:absolute;pointer-events:none;font-size:var(--spz,10px);color:var(--gold);animation:sparkleAnim var(--spdur,3s) var(--spdelay,0s) ease-in-out infinite;opacity:0;}

/* ── FOOTER ─────────────────────────────────────────────── */
.sm-footer{background:var(--deep);border-top:1px solid var(--border);padding:clamp(48px,6vw,80px) clamp(16px,4.5vw,64px) 0;}
.sm-footer::before{content:'';display:block;position:relative;height:1px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);margin-bottom:0;margin-top:-1px;}
.ft-bot{max-width:1440px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:clamp(24px,3vw,40px) 0;gap:20px;border-top:1px solid var(--border);flex-wrap:wrap;}
.ft-copy{font-family:var(--f-ui);font-size:9px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--faint);}
.ft-bot-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 8px rgba(200,168,75,.4);animation:diamondSpin 6s linear infinite;flex-shrink:0;}
.ft-top-row{max-width:1440px;margin:0 auto;padding:0 0 clamp(40px,5vw,60px);display:grid;grid-template-columns:2fr 1fr 1fr;gap:clamp(36px,5vw,80px);}
.ft-logo{height:clamp(34px,4vw,44px);margin-bottom:20px;filter:drop-shadow(0 0 10px rgba(200,168,75,.25));}
.ft-desc{font-family:var(--f-body);font-size:clamp(13px,1.5vw,14px);font-style:italic;color:var(--muted);line-height:1.9;max-width:280px;margin-bottom:24px;}
.ft-socials{display:flex;gap:10px;flex-wrap:wrap;}
.ft-soc{width:42px;height:42px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px;text-decoration:none;font-family:var(--f-ui);font-weight:700;letter-spacing:.05em;transition:all .3s var(--ease3);}
.ft-soc:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,168,75,.08);transform:translateY(-3px);}
.ft-col-title{font-family:var(--f-ui);font-size:9px;font-weight:700;letter-spacing:.55em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid var(--border);}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:12px;}
.ft-link{font-family:var(--f-body);font-size:clamp(13px,1.5vw,14px);color:var(--muted);text-decoration:none;transition:color .3s;display:flex;align-items:center;gap:10px;}
.ft-link::before{content:'';width:0;height:1px;background:linear-gradient(90deg,var(--gold),var(--gold3));transition:width .3s;}
.ft-link:hover{color:var(--gold3);}
.ft-link:hover::before{width:16px;}
.ft-contact-label{font-family:var(--f-ui);font-size:8px;font-weight:700;letter-spacing:.45em;text-transform:uppercase;color:rgba(200,168,75,.3);margin-bottom:4px;}
.ft-contact-val{font-family:var(--f-body);font-size:clamp(13px,1.5vw,14px);color:var(--muted);text-decoration:none;line-height:1.85;}

/* ── RESPONSIVE ─────────────────────────────────────────── */

/* Large desktop: 1200–1440px — mostly handled by clamp() */
@media(max-width:1200px){
  .ev-subscribe-inner{grid-template-columns:1fr;gap:40px;}
}

/* Tablet landscape + small desktop: 900–1200px */
@media(max-width:960px){
  .sm-nav{padding:0 clamp(16px,3vw,32px);}
  .nav-links{display:none;}
  .burger{display:flex;}
  .ft-top-row{grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,48px);}
  .ft-top-col-brand{grid-column:1/-1;}
}

/* Tablet portrait: 600–900px */
@media(max-width:768px){
  :root{--nav-h:68px;}
  .ev-controls-inner{flex-wrap:wrap;gap:10px;}
  .ev-search-wrap{max-width:100%;flex:1 1 100%;}
  .ev-filters{flex:1 1 auto;}
  .ev-ctrl-right{margin-left:auto;}
  .ev-grid{grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr));}
  .ev-list-img-wrap{width:90px;}
  .ev-list-arrow{padding:0 16px;}
  .ft-top-row{grid-template-columns:1fr;gap:36px;}
  .ft-top-col-brand{grid-column:auto;}
  .ev-sub-btns{flex-direction:column;align-items:flex-start;}
  .btn-g,.btn-gh{width:100%;justify-content:center;}
}

/* Mobile: <600px */
@media(max-width:599px){
  :root{--nav-h:60px;}
  .ev-hero-t1{font-size:clamp(48px,15vw,80px);}
  .hero-tag{font-size:10px;letter-spacing:.4em;}
  .hero-tag-line{width:20px;}
  .ev-controls{padding:0 14px;}
  .ev-controls-inner{padding:12px 0;gap:8px;}
  .ev-search{padding:11px 0;font-size:11px;}
  .ev-filters{gap:5px;}
  .ev-filter-btn{padding:8px 10px;font-size:8px;letter-spacing:.2em;}
  .ev-main{padding:36px 14px 72px;}
  .ev-grid{grid-template-columns:1fr;gap:2px;}
  .ev-card-img-wrap{aspect-ratio:3/2;}
  .ev-card-body{padding:18px 18px 22px;}
  .ev-card-title{font-size:clamp(20px,6vw,28px);}
  .ev-list-date{width:72px;}
  .ev-list-day{font-size:clamp(28px,8vw,38px);}
  .ev-list-body{padding:16px 14px;}
  .ev-list-title{font-size:clamp(16px,5vw,22px);}
  .ev-list-venue{display:none;}
  .ev-list-arrow{display:none;}
  .ev-list-img-wrap{display:none;}
  .ev-subscribe-inner{padding:28px 18px;}
  .ev-sub-title{font-size:clamp(28px,9vw,42px);}
  .v-banner{padding:48px 16px;}
  .sm-footer{padding:48px 16px 0;}
  .ft-bot{flex-direction:column;align-items:flex-start;gap:14px;}
  .ft-bot-diamond{display:none;}
  .ft-bot-links{display:flex;gap:20px;flex-wrap:wrap;}
  .ev-month-head{gap:12px;}
  .ev-month-line{display:none;}
  .ev-month-count{display:none;}
}

/* Extra small: <380px */
@media(max-width:380px){
  .hero-tag{display:none;}
  .ev-hero-t1{font-size:clamp(42px,16vw,68px);}
  .ev-hero-sub{font-size:12px;letter-spacing:.08em;}
  .ev-filter-btn{padding:7px 9px;letter-spacing:.1em;}
  .ev-card-day{font-size:clamp(24px,7vw,32px);}
  .ev-card-cat{font-size:8px;padding:6px 10px;}
}

img{max-width:100%;height:auto;}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;}
}
`;

/* ──────────────────────────── EVENT DATA ── */
const EVENTS_DATA = [
  {
    id: 1,
    day: "02",
    mon: "MAY",
    weekday: "SAT",
    year: "2026",
    name: "Global Mass Evangelism",
    time: "All Day",
    timeEnd: null,
    venue: null,
    address: null,
    category: "Evangelism",
    catSlug: "midweek-service",
    img: "https://smhos.org/wp-content/uploads/2026/04/GME-IG-may.png",
    href: "https://smhos.org/event/global-mass-evangelism-4/",
    isAllDay: true,
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
    venue: "Salvation Ministries HQ, And All Her Branches Globally.",
    address: "Plot 17, Birabi Street, Port Harcourt, Rivers, Nigeria",
    category: "Sunday Service",
    catSlug: "sunday-service",
    img: "https://smhos.org/wp-content/uploads/2026/04/Sun-3rd-May-2026-IG.png",
    href: "https://smhos.org/event/mountain-moving-praise/",
    isAllDay: false,
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
    venue: "Salvation Ministries HQ, And All Her Branches Globally.",
    address: "Plot 17, Birabi Street, Port Harcourt, Rivers, Nigeria",
    category: "Week of Renewal",
    catSlug: "wosr",
    img: "https://smhos.org/wp-content/uploads/2026/04/WOSR-MAY-IG-scaled.png",
    href: "https://smhos.org/event/may-week-of-spiritual-renewal/",
    isAllDay: false,
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
    venue: "Salvation Ministries HQ, And All Her Branches Globally.",
    address: "Plot 17, Birabi Street, Port Harcourt, Rivers, Nigeria",
    category: "Sunday Service",
    catSlug: "sunday-service",
    img: "https://smhos.org/wp-content/uploads/2026/04/Global-Anointing-Service-IG.png",
    href: "https://smhos.org/event/global-anointing-service/",
    isAllDay: false,
  },
];

const SUBSCRIBE_LINKS = [
  {
    icon: "G",
    name: "Google Calendar",
    desc: "Add to Google Calendar",
    href: "https://www.google.com/calendar/render?cid=webcal%3A%2F%2Fsmhos.org%2F%3Fpost_type%3Dtribe_events%26ical%3D1%26eventDisplay%3Dlist",
  },
  {
    icon: "♦",
    name: "iCalendar",
    desc: "Subscribe with Apple Calendar / iCal",
    href: "webcal://smhos.org/?post_type=tribe_events&ical=1&eventDisplay=list",
  },
  {
    icon: "O",
    name: "Outlook 365",
    desc: "Add to Microsoft Outlook 365",
    href: "https://outlook.office.com/owa?path=/calendar/action/compose&rru=addsubscription&url=webcal%3A%2F%2Fsmhos.org%2F%3Fpost_type%3Dtribe_events%26ical%3D1%26eventDisplay%3Dlist&name=Salvation+Ministries+Events",
  },
  {
    icon: "↓",
    name: "Export .ics File",
    desc: "Download calendar file for any app",
    href: "https://smhos.org/events/list/?ical=1",
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

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ministries", href: "/ministry/campus" },
  { label: "Events", href: "/events" },
  { label: "Sermons", href: "/sermons" },
  { label: "Contact", href: "/contact" },
];

const FILTERS = ["All", "Sunday Service", "Week of Renewal", "Evangelism"];

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
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".rev").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ─────────────────────────────────── COMPONENTS ── */

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

function Loader({ done }) {
  return (
    <div className={`sm-loader${done ? " gone" : ""}`}>
      <div className="ldr-emblem">
        <div className="ldr-glow" />
        <svg className="ldr-svg" width="90" height="90" viewBox="0 0 90 90">
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
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.3 + 0.06),
        alpha: Math.random() * 0.45 + 0.1,
        life: Math.random(),
      });
    }
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
        }
        const fade = Math.sin(p.life * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,168,75,${p.alpha * fade})`;
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
  return <canvas ref={canvasRef} className="ev-hero-canvas" />;
}

function Sparkles({ count = 10 }) {
  const [sparks] = useState(() =>
    Array.from({ length: count }, () => ({
      left: `${10 + Math.random() * 80}%`,
      bottom: `${Math.random() * 50}%`,
      sy: `${-(40 + Math.random() * 60)}px`,
      sr: `${180 + Math.random() * 360}deg`,
      spz: `${8 + Math.random() * 5}px`,
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

/* ── EVENT CARD (Grid) ── */
function EventCard({ ev, delay }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--hx", `${x * 100}%`);
    el.style.setProperty("--hy", `${y * 100}%`);
  }, []);

  return (
    <Link
      to="/Details"
      className="ev-card rev"
      target="_blank"
      rel="noreferrer"
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      onMouseMove={onMove}
    >
      <div className="ev-card-top-line" />
      <div className="ev-card-img-wrap">
        <img
          src={ev.img}
          alt={ev.name}
          className="ev-card-img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="ev-card-img-overlay" />
        <div className="ev-card-cat">{ev.category}</div>
        <div className="ev-card-date-tag">
          <div className="ev-card-day">{ev.day}</div>
          <div className="ev-card-mon">{ev.mon}</div>
        </div>
      </div>
      <div className="ev-card-body">
        <div className="ev-card-meta">
          <div className="ev-card-weekday">
            {ev.weekday} · {ev.year}
          </div>
          {!ev.isAllDay && (
            <div className="ev-card-time-badge">
              {ev.time}
              {ev.timeEnd ? ` — ${ev.timeEnd}` : ""}
            </div>
          )}
          {ev.isAllDay && <div className="ev-card-time-badge">All Day</div>}
        </div>
        <h3 className="ev-card-title">{ev.name}</h3>
        {ev.venue && (
          <div className="ev-card-venue">
            <div className="ev-venue-dot" />
            <div className="ev-venue-txt">{ev.venue}</div>
          </div>
        )}
        <div className="ev-card-footer">
          <div className="ev-card-cta">
            View Details <span className="ev-card-arr">→</span>
          </div>
          <div className="ev-card-type">{ev.category}</div>
        </div>
      </div>
    </Link>
  );
}

/* ── EVENT LIST ITEM ── */
function EventListItem({ ev, delay }) {
  return (
    <a
      href={ev.href}
      className="ev-list-item rev"
      target="_blank"
      rel="noreferrer"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="ev-list-date">
        <div className="ev-list-day">{ev.day}</div>
        <div className="ev-list-mon">{ev.mon}</div>
        <div className="ev-list-wk">{ev.weekday}</div>
      </div>
      <div className="ev-list-img-wrap">
        <img
          src={ev.img}
          alt={ev.name}
          className="ev-list-img"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
      <div className="ev-list-body">
        <div className="ev-list-cat">{ev.category}</div>
        <div className="ev-list-title">{ev.name}</div>
        <div className="ev-list-time">
          {ev.isAllDay
            ? "All Day Event"
            : `${ev.time}${ev.timeEnd ? ` — ${ev.timeEnd}` : ""}`}
        </div>
        {ev.venue && <div className="ev-list-venue">{ev.venue}</div>}
      </div>
      <div className="ev-list-arrow">→</div>
    </a>
  );
}

/* ──────────────────────────────────── MAIN EXPORT ── */
export default function EventsPage() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const scrolled = useScrolled();
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const filteredEvents = EVENTS_DATA.filter((ev) => {
    const matchFilter = activeFilter === "All" || ev.category === activeFilter;
    const matchSearch =
      !searchQuery ||
      ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const groupedByMonth = filteredEvents.reduce((acc, ev) => {
    const key = `${ev.mon} ${ev.year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="grain" />
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
            <a
              key={i}
              href={l.href}
              className={`nav-a${l.active ? " active" : ""}`}
              target={
                l.href.startsWith("http") && !l.active ? "_blank" : undefined
              }
              rel={
                l.href.startsWith("http") && !l.active
                  ? "noreferrer"
                  : undefined
              }
            >
              {l.label}
            </a>
          ))}
          <div style={{ width: 1, height: 22, background: "var(--border)" }} />
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
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <Link
          to="/give"
          className="mob-give"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Give Online
        </Link>
      </div>

      {/* HERO */}
      <section className="ev-hero">
        <ParticleCanvas />
        <div className="ev-hero-bg" />
        <div className="aurora" />
        <div className="ev-hero-overlay" />
        <div className="god-rays" />
        <div className="ev-rings">
          <div className="ev-ring" />
          <div className="ev-ring" />
          <div className="ev-ring" />
        </div>
        <div className="hero-glow" />
        <Sparkles count={14} />
        <div className="corner-orn tl" />
        <div className="corner-orn tr" />
        <div className="corner-orn bl" />
        <div className="corner-orn br" />
        <div className="ev-hero-content">
          <div className="hero-tag">
            <div className="hero-tag-line" />
            Salvation Ministries
            <div className="hero-tag-line r" />
          </div>
          <h1 className="ev-hero-t1 prism">
            EVENTS &amp;
            <br />
            PROGRAMS
          </h1>
          <p className="ev-hero-sub">Come and encounter the Living God</p>
          <div className="ev-hero-breadcrumb">
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
            <span className="bc-sep">✦</span>
            <span className="bc-cur">Events</span>
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

      {/* CONTROLS */}
      <div className="ev-controls">
        <div className="ev-controls-inner">
          <div className="ev-search-wrap">
            <span className="ev-search-icon">⌕</span>
            <input
              className="ev-search"
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontSize: 15,
                  padding: "0 4px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="ev-filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`ev-filter-btn${activeFilter === f ? " active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="ev-ctrl-right">
            <div className="ev-count">
              <span>{filteredEvents.length}</span> events
            </div>
            <div className="ev-view-btns">
              <button
                className={`ev-view-btn${viewMode === "grid" ? " active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                ⊞
              </button>
              <button
                className={`ev-view-btn${viewMode === "list" ? " active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN EVENTS */}
      <main className="ev-main">
        {filteredEvents.length === 0 ? (
          <div className="ev-empty">
            <div className="ev-empty-icon">✦</div>
            <div className="ev-empty-title">NO EVENTS FOUND</div>
            <p className="ev-empty-body">
              No events match your current search or filter. Try a different
              keyword or select "All" to see everything upcoming.
            </p>
            <button
              className="btn-gh"
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
            >
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          Object.entries(groupedByMonth).map(([monthKey, monthEvents], gi) => (
            <div key={monthKey}>
              <div
                className="ev-month-head rev"
                style={{ transitionDelay: `${gi * 0.05}s` }}
              >
                <div>
                  <div className="ev-month-txt">{monthKey.split(" ")[0]}</div>
                  <div className="ev-month-num">
                    {monthKey.split(" ")[1]} · {monthEvents.length} event
                    {monthEvents.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="ev-month-line" />
                <div className="ev-month-count">
                  {monthEvents.length} upcoming
                </div>
              </div>

              {viewMode === "grid" ? (
                <div className="ev-grid">
                  {monthEvents.map((ev, i) => (
                    <EventCard key={ev.id} ev={ev} delay={i * 0.1} />
                  ))}
                </div>
              ) : (
                <div className="ev-list-view">
                  {monthEvents.map((ev, i) => (
                    <EventListItem key={ev.id} ev={ev} delay={i * 0.08} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* SUBSCRIBE */}
        <div className="ev-subscribe rev" style={{ transitionDelay: "0.2s" }}>
          <div className="ev-subscribe-inner">
            <div className="ev-sub-corner tl" />
            <div className="ev-sub-corner br" />
            <div className="ev-sub-glow" />
            <div>
              <div className="ev-sub-lbl">
                <div className="ev-sub-lbl-line" />
                Never Miss A Moment
              </div>
              <h2 className="ev-sub-title">
                SUBSCRIBE TO
                <br />
                <span style={{ color: "var(--gold3)" }}>CALENDAR</span>
              </h2>
              <div className="s-orn" />
              <p className="ev-sub-body">
                Stay connected with every service, program, and special event.
                Add our calendar to your favourite app and receive automatic
                updates.
              </p>
              <div className="ev-sub-btns">
                <Link
                  href="/events"
                  className="btn-g"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>View All Events</span>
                  <span className="btn-arr">→</span>
                </Link>
                <Link
                  to="/livestream"
                  className="btn-gh"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>Watch Live</span>
                </Link>
              </div>
            </div>
            <div className="ev-sub-links">
              {SUBSCRIBE_LINKS.map((sl, i) => (
                <a
                  key={i}
                  href={sl.href}
                  className="ev-sub-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="ev-sub-link-icon">{sl.icon}</div>
                  <div className="ev-sub-link-info">
                    <div className="ev-sub-link-name">{sl.name}</div>
                    <div className="ev-sub-link-desc">{sl.desc}</div>
                  </div>
                  <span className="ev-sub-link-arr">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* VERSE BANNER */}
      <div className="v-banner">
        <div className="rev">
          <blockquote className="v-q">
            "But on Mount Zion there shall be deliverance, and there shall be
            holiness; the house of Jacob shall possess their possessions."
          </blockquote>
          <div className="v-attr">Obadiah 1:17 · New King James Version</div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="sm-footer">
        <div className="ft-top-row">
          <div className="ft-top-col-brand">
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
              className="ft-logo"
            />
            <p className="ft-desc">
              Salvation Ministries — Home of Success. Founded 1997. A global
              movement of faith, raising disciples for Christ.
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
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Sermons", href: "/sermons" },
                { label: "Events", href: "#" },
                { label: "Store", href: "https://smhosstore.com" },
                { label: "Give", href: "/give" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="ft-link"
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ft-col-title">Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <div className="ft-contact-label">Phone</div>
                <a href="tel:+2348033123743" className="ft-contact-val">
                  +234 (803) 312 3743
                </a>
              </div>
              <div>
                <div className="ft-contact-label">Email</div>
                <a href="mailto:info@smhos.org" className="ft-contact-val">
                  info@smhos.org
                </a>
              </div>
              <div>
                <div className="ft-contact-label">Address</div>
                <div className="ft-contact-val">
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
          <div className="ft-bot-diamond" />
          <div
            className="ft-bot-links"
            style={{ display: "flex", gap: 24, flexWrap: "wrap" }}
          >
            {[
              { label: "Contact", href: "/contact" },
              { label: "Give", href: "/give" },
              { label: "Forms", href: "/forms/" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--f-ui)",
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: ".35em",
                  textTransform: "uppercase",
                  color: "var(--faint)",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
