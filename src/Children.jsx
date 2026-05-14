import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────────── CSS STRING ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Montserrat:wght@300;400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}

:root{
  --black:#04040A;
  --deep:#070710;
  --dark:#0D0D1C;
  --panel:#111120;
  --card:#161628;
  --gold:#C8A84B;
  --gold2:#E2C06A;
  --gold3:#F5D98A;
  --gold4:#FFF0BB;
  --sky:#4FC3F7;
  --sky2:#81D4FA;
  --mint:#A5F3C4;
  --mint2:#6EE7B7;
  --coral:#FF8A80;
  --violet2:#CE93D8;
  --sun:#FFD54F;
  --white:#FDFAF4;
  --cream:#F5EDDA;
  --muted:#7A7468;
  --faint:#2E2C28;
  --border:rgba(200,168,75,0.18);
  --border2:rgba(200,168,75,0.4);
  --glow:rgba(200,168,75,0.12);
  --ease:cubic-bezier(0.16,1,0.3,1);
  --ease3:cubic-bezier(0.34,1.56,0.64,1);
  --nav-h:72px;
}

body{
  background:var(--black);
  color:var(--white);
  font-family:'Montserrat',sans-serif;
  overflow-x:hidden;
}

::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--deep);}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--gold),var(--gold3));}

/* ── GRAIN ── */
.ll-grain{
  position:fixed;inset:0;z-index:9999;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size:128px;opacity:0.028;mix-blend-mode:overlay;
  animation:grain .4s steps(3) infinite;
}
@keyframes grain{
  0%{transform:translate(0,0);}33%{transform:translate(-3px,2px);}
  66%{transform:translate(3px,-2px);}100%{transform:translate(-1px,3px);}
}

/* ── NAV ── */
.ll-nav{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  height:var(--nav-h);
  padding:0 56px;
  display:flex;align-items:center;justify-content:space-between;
  transition:all .45s var(--ease);
}
.ll-nav.sc{
  background:rgba(4,4,10,.96);
  backdrop-filter:blur(28px) saturate(1.4);
  -webkit-backdrop-filter:blur(28px) saturate(1.4);
  border-bottom:1px solid var(--border);
  box-shadow:0 8px 40px rgba(0,0,0,.4);
}
.ll-nav-logo img{
  height:36px;
  filter:drop-shadow(0 0 10px rgba(200,168,75,.3));
  transition:filter .3s;
}
.ll-nav-logo img:hover{filter:drop-shadow(0 0 18px rgba(200,168,75,.55));}
.ll-nav-links{display:flex;align-items:center;gap:36px;}
.ll-nav-a{
  font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;
  color:rgba(253,250,244,.55);text-decoration:none;
  transition:color .3s;position:relative;padding:4px 0;
}
.ll-nav-a::after{
  content:'';position:absolute;bottom:-3px;left:50%;right:50%;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  transition:left .4s var(--ease),right .4s var(--ease);
}
.ll-nav-a:hover{color:var(--gold3);}
.ll-nav-a:hover::after{left:0;right:0;}
.ll-nav-cta{
  font-size:10px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;
  color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));
  text-decoration:none;padding:11px 24px;
  transition:all .3s;box-shadow:0 4px 20px rgba(200,168,75,.3);
}
.ll-nav-cta:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(200,168,75,.55);}

/* Mobile menu toggle */
.ll-nav-toggle{
  display:none;
  background:transparent;border:1px solid var(--border);
  color:var(--gold);cursor:pointer;
  width: 44px;height:44px;
  flex-direction:column;align-items:center;justify-content:center;
  gap:5px;
  position: relative;
  left: -20%;
  transition:all .3s;padding:0;
}
.ll-nav-toggle:hover{border-color:var(--gold);background:rgba(200,168,75,.08);}
.ll-nav-toggle span{
  display:block;width:20px;height:1.5px;
  background:var(--gold);transition:all .35s var(--ease);
  transform-origin:center;
}
.ll-nav-toggle.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg);}
.ll-nav-toggle.open span:nth-child(2){opacity:0;transform:scaleX(0);}
.ll-nav-toggle.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg);}

/* Mobile drawer */
.ll-mobile-menu{
  position:fixed;top:var(--nav-h);left:0;right:0;z-index:999;
  background:rgba(4,4,10,.98);
  backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);
  border-bottom:1px solid var(--border);
  transform:translateY(-110%);
  transition:transform .45s var(--ease);
  padding:32px 24px 40px;
}
.ll-mobile-menu.open{transform:translateY(0);}
.ll-mob-link{
  display:block;font-size:13px;font-weight:700;letter-spacing:.22em;
  text-transform:uppercase;color:rgba(253,250,244,.65);text-decoration:none;
  padding:16px 0;border-bottom:1px solid rgba(200,168,75,.08);
  transition:color .3s,padding-left .3s;
}
.ll-mob-link:hover{color:var(--gold3);padding-left:8px;}
.ll-mob-cta{
  display:block;margin-top:24px;text-align:center;
  font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;
  color:var(--black);background:linear-gradient(135deg,var(--gold2),var(--gold));
  text-decoration:none;padding:15px;
  box-shadow:0 4px 24px rgba(200,168,75,.35);
}

/* ── HERO ── */
.ll-hero{
  min-height:100svh;position:relative;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;background:var(--black);
  padding-top:var(--nav-h);
}
.ll-hero-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;}
.ll-hero-glow-1{
  position:absolute;top:20%;left:30%;
  width:min(600px,80vw);height:min(600px,80vw);border-radius:50%;
  background:radial-gradient(circle,rgba(79,195,247,.07) 0%,transparent 65%);
  animation:glowDrift 12s ease-in-out infinite alternate;pointer-events:none;
}
.ll-hero-glow-2{
  position:absolute;bottom:10%;right:20%;
  width:min(500px,70vw);height:min(500px,70vw);border-radius:50%;
  background:radial-gradient(circle,rgba(200,168,75,.08) 0%,transparent 65%);
  animation:glowDrift 16s ease-in-out infinite alternate-reverse;pointer-events:none;
}
@keyframes glowDrift{
  0%{transform:translate(0,0) scale(1);}
  100%{transform:translate(30px,-40px) scale(1.1);}
}
.ll-hero-rings{
  position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);pointer-events:none;
}
.ll-h-ring{
  position:absolute;top:50%;left:50%;
  border-radius:50%;transform:translate(-50%,-50%);
}
.ll-h-ring:nth-child(1){
  width:min(280px,60vw);height:min(280px,60vw);
  border:1.5px solid rgba(200,168,75,.3);
  animation:ringPulse 8s ease-in-out infinite;
  box-shadow:0 0 30px rgba(200,168,75,.1),inset 0 0 30px rgba(200,168,75,.04);
}
.ll-h-ring:nth-child(2){
  width:min(480px,90vw);height:min(480px,90vw);
  border:1px solid rgba(200,168,75,.12);
  animation:ringPulse 10s ease-in-out infinite 1.5s;
}
.ll-h-ring:nth-child(3){
  width:min(720px,130vw);height:min(720px,130vw);
  border:1px solid rgba(200,168,75,.06);
  animation:ringPulse 12s ease-in-out infinite 3s;
}
@keyframes ringPulse{
  0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}
  50%{opacity:.4;transform:translate(-50%,-50%) scale(1.04);}
}
.ll-hero-stars{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.ll-h-star{
  position:absolute;border-radius:50%;background:var(--gold3);
  animation:starTwinkle var(--dur,3s) ease-in-out var(--del,0s) infinite;
}
@keyframes starTwinkle{
  0%,100%{opacity:.2;transform:scale(1);}
  50%{opacity:1;transform:scale(1.4);}
}
.ll-hero-content{
  position:relative;z-index:5;text-align:center;
  padding:48px 20px 80px;width:100%;max-width:1100px;
  display:flex;flex-direction:column;align-items:center;
}
.ll-hero-eyebrow{
  font-size:9px;font-weight:700;letter-spacing:.5em;text-transform:uppercase;
  color:var(--gold);display:flex;align-items:center;gap:12px;margin-bottom:24px;
  flex-wrap:wrap;justify-content:center;
  opacity:0;animation:fadeUp .9s .4s var(--ease) forwards;
}
.ll-hero-eyebrow-line{height:1px;width:36px;background:linear-gradient(90deg,transparent,var(--gold));flex-shrink:0;}
.ll-hero-eyebrow-line.r{background:linear-gradient(90deg,var(--gold),transparent);}
.ll-hero-t1{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(64px,16vw,180px);
  font-weight:400;line-height:.88;letter-spacing:.06em;color:var(--white);
  opacity:0;animation:fadeUp 1s .6s var(--ease) forwards;
  text-shadow:0 0 100px rgba(200,168,75,.2);
}
.ll-hero-t2{
  font-family:'Playfair Display',serif;
  font-size:clamp(26px,7vw,64px);
  font-style:italic;font-weight:400;letter-spacing:.04em;
  opacity:0;animation:fadeUp 1s .8s var(--ease) forwards;
}
.ll-prism{
  background:linear-gradient(
    90deg,
    var(--gold) 0%,var(--gold4) 15%,var(--sky2) 30%,
    var(--gold3) 48%,var(--mint2) 62%,var(--gold2) 78%,var(--gold) 100%
  );
  background-size:300% auto;
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  animation:prism 5s linear infinite;
  filter:drop-shadow(0 0 30px rgba(200,168,75,.4));
}
@keyframes prism{
  0%{background-position:0% center;}100%{background-position:300% center;}
}
.ll-hero-verse{
  margin:36px 0;width:100%;max-width:640px;
  opacity:0;animation:fadeUp .9s 1s var(--ease) forwards;
}
.ll-verse-box{
  position:relative;padding:28px 36px;
  background:linear-gradient(135deg,rgba(200,168,75,.06),transparent);
  border:1px solid var(--border);
}
.ll-verse-box::before{
  content:'';position:absolute;inset:-1.5px;z-index:-1;
  background:conic-gradient(from 0deg,transparent,var(--gold3) 10%,var(--gold) 18%,transparent 26%,transparent 50%,var(--gold3) 60%,transparent 68%);
  animation:spinBorder 5s linear infinite;
}
.ll-verse-box::after{content:'';position:absolute;inset:1px;background:rgba(4,4,10,.92);z-index:-1;}
.ll-vc-tl,.ll-vc-br{position:absolute;width:12px;height:12px;border-color:var(--gold3);border-style:solid;}
.ll-vc-tl{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.ll-vc-br{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
@keyframes spinBorder{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
.ll-verse-text{
  font-family:'Playfair Display',serif;font-size:clamp(14px,3.5vw,17px);
  font-style:italic;color:rgba(200,168,75,.9);line-height:1.85;margin-bottom:12px;
}
.ll-verse-ref{font-size:8px;font-weight:700;letter-spacing:.45em;text-transform:uppercase;color:var(--gold);}
.ll-hero-ctas{
  display:flex;gap:14px;flex-wrap:wrap;justify-content:center;
  opacity:0;animation:fadeUp .9s 1.2s var(--ease) forwards;
}
.ll-hero-scroll{
  position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  opacity:0;animation:fadeUp .9s 2s var(--ease) forwards;
}
.ll-hero-scroll-lbl{font-size:8px;letter-spacing:.6em;text-transform:uppercase;color:var(--muted);}
.ll-scroll-track{width:1px;height:48px;background:var(--faint);overflow:hidden;position:relative;}
.ll-scroll-fill{
  position:absolute;top:-100%;width:100%;height:100%;
  background:linear-gradient(var(--gold3),transparent);
  animation:scrollDown 2.2s ease-in-out infinite;
}
@keyframes scrollDown{0%{top:-100%;}100%{top:200%;}}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}

/* ── TICKER ── */
.ll-ticker{
  padding:12px 0;overflow:hidden;
  background:linear-gradient(90deg,var(--gold),var(--gold3),var(--gold4),var(--gold3),var(--gold));
  background-size:300%;animation:tickerGlow 4s linear infinite;
}
@keyframes tickerGlow{0%{background-position:0%;}100%{background-position:300%;}}
.ll-ticker-inner{display:flex;white-space:nowrap;animation:tick 24s linear infinite;}
.ll-t-item{
  display:flex;align-items:center;gap:20px;padding:0 20px;
  font-size:9px;font-weight:700;letter-spacing:.35em;text-transform:uppercase;
  color:var(--black);flex-shrink:0;
}
.ll-t-dot{width:3px;height:3px;background:var(--black);border-radius:50%;opacity:.35;}
@keyframes tick{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── SECTION COMMON ── */
.ll-sec-in{max-width:1320px;margin:0 auto;padding:0 64px;}
.ll-s-lbl{
  display:flex;align-items:center;gap:12px;
  font-size:9px;font-weight:700;letter-spacing:.5em;text-transform:uppercase;
  color:var(--gold);margin-bottom:14px;
}
.ll-s-lbl-line{flex:0 0 28px;height:1px;background:var(--border2);}
.ll-s-h2{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(38px,7vw,90px);
  font-weight:400;line-height:.92;color:var(--white);
  letter-spacing:.04em;margin-bottom:20px;
}
.ll-s-h2 em{
  font-style:italic;font-family:'Playfair Display',serif;
  background:linear-gradient(135deg,var(--sky2),var(--mint2));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  font-size:.82em;
}
.ll-s-body{font-size:clamp(14px,1.8vw,16px);font-weight:400;line-height:2;color:var(--muted);margin-bottom:18px;}
.ll-s-orn{position:relative;width:48px;height:2px;background:linear-gradient(90deg,var(--gold),transparent);margin:24px 0;}

/* ── WELCOME ── */
.ll-welcome{background:var(--dark);padding:clamp(80px,10vw,130px) 0;position:relative;overflow:hidden;}
.ll-welcome::before{
  content:'LEADING LIGHTS';position:absolute;bottom:-60px;right:-60px;
  font-family:'Bebas Neue',sans-serif;font-size:clamp(80px,16vw,240px);
  color:transparent;-webkit-text-stroke:1px rgba(200,168,75,.04);
  white-space:nowrap;pointer-events:none;line-height:1;
}
.ll-welcome-grid{display:grid;grid-template-columns:6fr 5fr;gap:80px;align-items:center;}
.ll-img-stack{position:relative;height:clamp(300px,50vw,580px);}
.ll-img-frame-outer{
  position:absolute;top:-14px;left:-14px;right:14px;bottom:14px;
  border:1px solid var(--border);pointer-events:none;
}
.ll-img-frame-outer::before,.ll-img-frame-outer::after{
  content:'';position:absolute;width:18px;height:18px;
  border-color:var(--gold);border-style:solid;
}
.ll-img-frame-outer::before{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.ll-img-frame-outer::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.ll-img-main{
  width:100%;height:100%;object-fit:cover;
  filter:brightness(.88) contrast(1.06);
  transition:transform .9s var(--ease),filter .6s;
  position:relative;z-index:1;
}
.ll-img-stack:hover .ll-img-main{transform:scale(1.03);filter:brightness(.95) contrast(1.1);}
.ll-img-badge{
  position:absolute;bottom:-16px;right:-16px;z-index:2;
  background:linear-gradient(135deg,var(--gold2),var(--gold));
  color:var(--black);font-size:8px;font-weight:800;letter-spacing:.4em;
  text-transform:uppercase;padding:12px 18px;
}
.ll-img-float{
  position:absolute;top:40px;right:-28px;z-index:3;
  background:var(--card);border:1px solid var(--border);
  padding:16px 20px;backdrop-filter:blur(12px);
}
.ll-img-float-val{font-family:'Bebas Neue',sans-serif;font-size:34px;color:var(--gold);line-height:1;}
.ll-img-float-lbl{font-size:8px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--muted);margin-top:4px;}

/* ── FEATURES ── */
.ll-features{background:var(--black);padding:clamp(80px,10vw,130px) 0;position:relative;}
.ll-feat-bg{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  font-family:'Bebas Neue',sans-serif;font-size:clamp(120px,22vw,360px);
  color:transparent;-webkit-text-stroke:1px rgba(79,195,247,.025);
  white-space:nowrap;pointer-events:none;letter-spacing:.1em;user-select:none;
}
.ll-features-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:60px;gap:32px;flex-wrap:wrap;}
.ll-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;background:var(--faint);}
.ll-feat-card{
  background:var(--panel);padding:clamp(32px,4vw,52px) clamp(24px,3vw,38px) clamp(28px,4vw,48px);
  position:relative;overflow:hidden;cursor:default;
  transition:background .4s,transform .4s var(--ease3),box-shadow .4s;
}
.ll-feat-card:hover{
  background:var(--card);transform:translateY(-6px);
  box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 40px rgba(200,168,75,.05);
}
.ll-feat-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--card-accent,var(--gold)),transparent);
  transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease);
}
.ll-feat-card:hover::before{transform:scaleX(1);}
.ll-feat-card-bg{
  position:absolute;inset:0;opacity:0;transition:opacity .5s;pointer-events:none;
  background:radial-gradient(ellipse 120% 120% at 50% 110%,var(--card-glow,rgba(200,168,75,.1)) 0%,transparent 70%);
}
.ll-feat-card:hover .ll-feat-card-bg{opacity:1;}
.ll-feat-num{
  font-size:9px;font-weight:700;letter-spacing:.45em;color:var(--gold);
  margin-bottom:36px;display:flex;justify-content:space-between;align-items:center;
}
.ll-feat-icon{
  width:42px;height:42px;border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;font-size:18px;
  transition:all .4s;background:rgba(200,168,75,.04);
}
.ll-feat-card:hover .ll-feat-icon{
  border-color:var(--card-accent,var(--gold));
  transform:rotate(15deg) scale(1.1);
  background:rgba(200,168,75,.1);
}
.ll-feat-lbl{font-size:8px;font-weight:700;letter-spacing:.5em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
.ll-feat-title{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(20px,2.2vw,26px);color:var(--white);
  line-height:1.15;margin-bottom:18px;letter-spacing:.04em;transition:color .3s;
}
.ll-feat-card:hover .ll-feat-title{color:var(--gold3);}
.ll-feat-div{
  width:26px;height:1.5px;
  background:linear-gradient(90deg,var(--card-accent,var(--gold)),transparent);
  margin-bottom:14px;transition:width .5s var(--ease);
}
.ll-feat-card:hover .ll-feat-div{width:52px;}
.ll-feat-desc{font-size:clamp(12px,1.3vw,13px);font-weight:400;line-height:1.85;color:var(--muted);}

/* ── PASTOR ── */
.ll-pastor{background:var(--panel);padding:clamp(80px,10vw,130px) 0;position:relative;overflow:hidden;}
.ll-pastor::before{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);
}
.ll-pastor-grid{display:grid;grid-template-columns:5fr 6fr;gap:90px;align-items:center;}
.ll-pastor-img-wrap{position:relative;}
.ll-pastor-img-frame{
  position:absolute;top:-14px;left:-14px;right:14px;bottom:14px;
  border:1px solid var(--border);
}
.ll-pastor-img-frame::before,.ll-pastor-img-frame::after{
  content:'';position:absolute;width:16px;height:16px;
  border-color:var(--gold);border-style:solid;
}
.ll-pastor-img-frame::before{top:-1px;left:-1px;border-width:2px 0 0 2px;}
.ll-pastor-img-frame::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0;}
.ll-pastor-img{
  width:100%;height:clamp(280px,45vw,460px);
  object-fit:cover;object-position:top center;
  position:relative;z-index:1;filter:brightness(.85) contrast(1.05);
}
.ll-p-qmark{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,8vw,90px);
  color:rgba(200,168,75,.18);line-height:1;margin-bottom:-18px;display:block;
}
.ll-p-quote{
  font-size:clamp(14px,2vw,17px);font-style:italic;font-family:'Playfair Display',serif;
  color:var(--white);line-height:1.9;margin-bottom:32px;
  border-left:2.5px solid var(--gold);padding-left:24px;
}
.ll-p-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,40px);letter-spacing:.04em;color:var(--white);}
.ll-p-role{font-size:9px;font-weight:700;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);}
.ll-p-div{width:44px;height:1.5px;background:var(--border2);margin:14px 0;}

/* ── GALLERY ── */
.ll-gallery{background:var(--dark);padding:clamp(80px,10vw,130px) 0;overflow:hidden;}
.ll-gallery-hdr{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:52px;gap:24px;flex-wrap:wrap;}
.ll-gallery-strip{
  display:flex;gap:3px;overflow:hidden;position:relative;
  touch-action:pan-y;
}
.ll-gal-slide{
  flex-shrink:0;width:calc(33.333% - 2px);position:relative;
  overflow:hidden;aspect-ratio:4/3;transition:flex .6s var(--ease);cursor:pointer;
}
.ll-gal-slide.active{flex:0 0 50%;}
.ll-gal-img{width:100%;height:100%;object-fit:cover;transition:transform .7s var(--ease),filter .6s;}
.ll-gal-slide:hover .ll-gal-img{transform:scale(1.06);}
.ll-gal-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(4,4,10,.85) 0%,transparent 60%);
  opacity:.7;transition:opacity .4s;
}
.ll-gal-slide.active .ll-gal-overlay{opacity:1;}
.ll-gal-num{
  position:absolute;top:14px;left:14px;
  font-family:'Bebas Neue',sans-serif;font-size:clamp(32px,5vw,48px);
  color:rgba(200,168,75,.2);line-height:1;
}
.ll-gal-nav{display:flex;align-items:center;gap:12px;margin-top:24px;}
.ll-gal-btn{
  width:48px;height:48px;border:1px solid var(--border);background:transparent;
  color:var(--gold);cursor:pointer;font-size:22px;
  display:flex;align-items:center;justify-content:center;
  transition:all .3s;font-family:serif;flex-shrink:0;
}
.ll-gal-btn:hover{background:rgba(200,168,75,.1);border-color:var(--gold);}
.ll-gal-dots{display:flex;gap:8px;flex:1;}
.ll-gal-dot{height:2px;flex:1;background:var(--faint);cursor:pointer;transition:background .4s;}
.ll-gal-dot.active{background:linear-gradient(90deg,var(--gold),var(--gold3));}

/* ── VERSE BANNER ── */
.ll-v-banner{
  background:var(--panel);padding:clamp(72px,9vw,100px) clamp(24px,5vw,56px);
  text-align:center;position:relative;overflow:hidden;
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
}
.ll-v-banner::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse 60% 200% at 50% 50%,rgba(79,195,247,.05) 0%,transparent 100%);
}
.ll-v-q{
  font-family:'Playfair Display',serif;
  font-size:clamp(18px,3.5vw,40px);font-style:italic;font-weight:400;
  color:var(--white);line-height:1.6;max-width:900px;
  margin:0 auto 24px;position:relative;z-index:1;
}
.ll-v-q::before{
  content:'\\201C';font-family:'Bebas Neue',sans-serif;font-size:clamp(60px,10vw,120px);
  color:rgba(79,195,247,.12);position:absolute;top:clamp(-24px,-4vw,-44px);left:-14px;
  line-height:1;pointer-events:none;
}
.ll-v-attr{
  font-size:9px;font-weight:700;letter-spacing:.45em;text-transform:uppercase;
  color:var(--sky2);position:relative;z-index:1;
}

/* ── INVOLVEMENT ── */
.ll-involve{background:var(--black);padding:clamp(80px,10vw,130px) 0;}
.ll-involve-grid{display:grid;grid-template-columns:5fr 6fr;gap:90px;align-items:start;}
.ll-cards-stack{display:flex;flex-direction:column;gap:3px;}
.ll-inv-card{
  display:flex;align-items:center;gap:20px;padding:24px 28px;
  background:var(--panel);border-left:3px solid var(--card-col,var(--gold));
  text-decoration:none;position:relative;overflow:hidden;
  transition:background .3s,transform .3s var(--ease3);
}
.ll-inv-card::before{
  content:'';position:absolute;right:0;top:0;bottom:0;width:0;
  background:linear-gradient(90deg,transparent,var(--card-glow2,rgba(200,168,75,.06)));
  transition:width .4s var(--ease);
}
.ll-inv-card:hover::before{width:100%;}
.ll-inv-card:hover{background:var(--card);transform:translateX(6px);}
.ll-inv-icon-wrap{
  width:52px;height:52px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-size:22px;
  flex-shrink:0;border:1px solid var(--card-col,var(--gold));
  background:rgba(0,0,0,.2);
}
.ll-inv-info{flex:1;min-width:0;}
.ll-inv-title{
  font-family:'Bebas Neue',sans-serif;font-size:clamp(18px,2.2vw,22px);color:var(--white);
  letter-spacing:.04em;margin-bottom:4px;transition:color .3s;
}
.ll-inv-card:hover .ll-inv-title{color:var(--card-col,var(--gold3));}
.ll-inv-sub{font-size:clamp(10px,1.3vw,12px);font-weight:500;color:var(--muted);letter-spacing:.08em;}
.ll-inv-arr{
  font-size:18px;color:var(--card-col,var(--gold));
  opacity:0;transform:translateX(-8px);transition:all .3s;flex-shrink:0;
}
.ll-inv-card:hover .ll-inv-arr{opacity:1;transform:translateX(0);}
.ll-info-box{
  background:var(--panel);border:1px solid var(--border);
  padding:clamp(28px,4vw,44px);margin-top:3px;
  position:relative;overflow:hidden;
}
.ll-info-box::before{
  content:'';position:absolute;top:0;left:0;width:3px;height:100%;
  background:linear-gradient(var(--gold),var(--gold3),transparent);
}
.ll-info-box-title{
  font-size:9px;font-weight:700;letter-spacing:.5em;text-transform:uppercase;
  color:var(--gold);margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);
}
.ll-info-box-body{font-size:clamp(12px,1.5vw,14px);font-weight:400;line-height:2;color:var(--muted);}

/* ── ENROLL CTA ── */
.ll-enroll{
  background:var(--dark);padding:clamp(100px,13vw,160px) clamp(24px,5vw,64px);
  text-align:center;position:relative;overflow:hidden;
}
.ll-enroll::before{
  content:'';position:absolute;inset:0;
  background-image:
    linear-gradient(45deg,rgba(200,168,75,.025) 1px,transparent 1px),
    linear-gradient(-45deg,rgba(200,168,75,.025) 1px,transparent 1px);
  background-size:56px 56px;
}
.ll-enroll-glow{
  position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:min(800px,100vw);height:min(600px,80vw);border-radius:50%;
  background:radial-gradient(ellipse,rgba(79,195,247,.07) 0%,transparent 65%);
  animation:glowPulse 7s ease-in-out infinite;
}
@keyframes glowPulse{
  0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}
  50%{opacity:.5;transform:translate(-50%,-50%) scale(1.1);}
}
.ll-enroll-inner{position:relative;z-index:2;max-width:880px;margin:0 auto;}
.ll-enroll-eyebrow{
  font-size:9px;font-weight:700;letter-spacing:.5em;text-transform:uppercase;
  color:var(--sky2);margin-bottom:20px;
  display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;
}
.ll-enroll-ey-line{height:1px;width:36px;background:linear-gradient(90deg,transparent,var(--sky2));flex-shrink:0;}
.ll-enroll-ey-line.r{background:linear-gradient(90deg,var(--sky2),transparent);}
.ll-enroll-title{
  font-family:'Bebas Neue',sans-serif;
  font-size:clamp(52px,11vw,130px);font-weight:400;color:var(--white);
  line-height:.9;letter-spacing:.05em;margin-bottom:12px;
}
.ll-enroll-title em{
  font-style:normal;display:block;
  background:linear-gradient(135deg,var(--sky2),var(--mint2));
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 24px rgba(79,195,247,.3));
}
.ll-enroll-sub{
  font-size:clamp(14px,2vw,17px);font-style:italic;font-family:'Playfair Display',serif;
  color:var(--muted);margin-bottom:48px;max-width:600px;margin-left:auto;margin-right:auto;
}
.ll-enroll-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}

/* ── FOOTER ── */
.ll-footer{background:var(--deep);border-top:1px solid var(--border);padding:clamp(64px,8vw,90px) clamp(24px,5vw,64px) 0;position:relative;}
.ll-footer::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),var(--gold3),var(--gold),transparent);
}
.ll-footer-top{
  max-width:1320px;margin:0 auto;
  display:grid;grid-template-columns:2fr 1fr 1fr 1.2fr;gap:64px;
  padding-bottom:64px;border-bottom:1px solid var(--border);
}
.ll-ft-logo{height:36px;margin-bottom:20px;filter:drop-shadow(0 0 8px rgba(200,168,75,.2));}
.ll-ft-desc{font-size:13px;font-style:italic;color:var(--muted);line-height:1.9;max-width:260px;margin-bottom:24px;}
.ll-ft-socials{display:flex;gap:8px;}
.ll-ft-soc{
  width:40px;height:40px;border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  color:var(--muted);font-size:11px;text-decoration:none;
  transition:all .3s;font-weight:800;
}
.ll-ft-soc:hover{border-color:var(--gold);color:var(--gold);background:rgba(200,168,75,.08);}
.ll-ft-col-title{
  font-size:8px;font-weight:700;letter-spacing:.55em;text-transform:uppercase;
  color:var(--gold);margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid var(--border);
}
.ll-ft-links{list-style:none;display:flex;flex-direction:column;gap:12px;}
.ll-ft-link{
  font-size:13px;color:var(--muted);text-decoration:none;transition:color .3s;
  display:flex;align-items:center;gap:8px;
}
.ll-ft-link::before{
  content:'';width:0;height:1px;
  background:linear-gradient(90deg,var(--gold),var(--gold3));transition:width .3s;
}
.ll-ft-link:hover{color:var(--gold3);}
.ll-ft-link:hover::before{width:14px;}
.ll-ft-contact-item{font-size:13px;color:var(--muted);margin-bottom:10px;line-height:1.7;}
.ll-ft-contact-item a{color:inherit;text-decoration:none;transition:color .3s;}
.ll-ft-contact-item a:hover{color:var(--gold3);}
.ll-footer-bot{
  max-width:1320px;margin:0 auto;
  display:flex;justify-content:space-between;align-items:center;
  padding:24px 0;gap:16px;
}
.ll-ft-copy{font-size:8px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--faint);}
.ll-ft-diamond{width:5px;height:5px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 6px rgba(200,168,75,.4);flex-shrink:0;}
.ll-ft-bot-links{display:flex;gap:24px;}
.ll-ft-bot-link{
  font-size:8px;font-weight:600;letter-spacing:.35em;text-transform:uppercase;
  color:var(--faint);text-decoration:none;transition:color .3s;
}
.ll-ft-bot-link:hover{color:var(--gold);}

/* ── BUTTONS ── */
.ll-btn-g{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-size:10px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--gold2),var(--gold));color:var(--black);
  text-decoration:none;padding:clamp(14px,2vw,17px) clamp(28px,4vw,40px);
  position:relative;overflow:hidden;
  transition:transform .3s,box-shadow .3s;box-shadow:0 6px 28px rgba(200,168,75,.3);
  white-space:nowrap;
}
.ll-btn-g::after{
  content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
  transform:skewX(-20deg);transition:left .7s var(--ease);
}
.ll-btn-g:hover{transform:translateY(-3px);box-shadow:0 14px 50px rgba(200,168,75,.55);}
.ll-btn-g:hover::after{left:160%;}
.ll-btn-sky{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-size:10px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;
  background:linear-gradient(135deg,var(--sky),var(--sky2));color:var(--black);
  text-decoration:none;padding:clamp(14px,2vw,17px) clamp(28px,4vw,40px);
  position:relative;overflow:hidden;
  transition:transform .3s,box-shadow .3s;box-shadow:0 6px 28px rgba(79,195,247,.25);
  white-space:nowrap;
}
.ll-btn-sky:hover{transform:translateY(-3px);box-shadow:0 14px 50px rgba(79,195,247,.5);}
.ll-btn-ghost{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  font-size:10px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;
  background:transparent;color:var(--gold3);text-decoration:none;
  padding:clamp(13px,2vw,16px) clamp(28px,4vw,40px);
  border:1.5px solid var(--border2);transition:all .3s;white-space:nowrap;
}
.ll-btn-ghost:hover{border-color:var(--gold);color:var(--gold2);background:rgba(200,168,75,.06);}

/* ── REVEAL ── */
.ll-rev{opacity:0;transform:translateY(40px);transition:opacity .9s var(--ease),transform .9s var(--ease);}
.ll-rev.vis{opacity:1;transform:translateY(0);}
.ll-rev-l{opacity:0;transform:translateX(-40px);transition:opacity .9s var(--ease),transform .9s var(--ease);}
.ll-rev-l.vis{opacity:1;transform:translateX(0);}
.ll-rev-r{opacity:0;transform:translateX(40px);transition:opacity .9s var(--ease),transform .9s var(--ease);}
.ll-rev-r.vis{opacity:1;transform:translateX(0);}

/* ═══════════════════════════════ RESPONSIVE BREAKPOINTS ═══ */

/* ── 1200px — comfortable desktop ── */
@media(max-width:1200px){
  .ll-sec-in{padding:0 44px;}
  .ll-nav{padding:0 44px;}
  .ll-footer{padding-left:44px;padding-right:44px;}
  .ll-footer-top{gap:48px;}
  .ll-welcome-grid{gap:60px;}
  .ll-pastor-grid{gap:60px;}
  .ll-involve-grid{gap:60px;}
}

/* ── 1024px — small desktop / large tablet landscape ── */
@media(max-width:1024px){
  .ll-sec-in{padding:0 36px;}
  .ll-nav{padding:0 36px;}
  .ll-footer{padding-left:36px;padding-right:36px;}
  .ll-footer-top{grid-template-columns:1fr 1fr;gap:44px;}
  .ll-feat-grid{grid-template-columns:1fr 1fr;}
  .ll-img-float{right:-16px;}
}

/* ── 860px — tablet portrait / large phone landscape ── */
@media(max-width:860px){
  :root{--nav-h:64px;}
  .ll-nav{padding:0 28px;}
  .ll-nav-links{display:none;}
  .ll-nav-toggle{display:flex;}
  .ll-sec-in{padding:0 28px;}
  .ll-footer{padding-left:28px;padding-right:28px;}

  .ll-welcome-grid{grid-template-columns:1fr;gap:56px;}
  .ll-img-stack{height:340px;}
  .ll-img-frame-outer{top:-10px;left:-10px;right:10px;bottom:10px;}
  .ll-img-float{top:24px;right:-12px;}
  .ll-img-badge{right:-10px;bottom:-10px;}

  .ll-pastor-grid{grid-template-columns:1fr;gap:48px;}
  .ll-pastor-img{height:320px;}

  .ll-involve-grid{grid-template-columns:1fr;gap:48px;}

  .ll-features-hdr{flex-direction:column;align-items:flex-start;gap:16px;margin-bottom:44px;}
  .ll-features-hdr > div:last-child p{max-width:100%;}

  .ll-gallery-hdr{flex-direction:column;align-items:flex-start;gap:20px;margin-bottom:36px;}

  .ll-footer-top{grid-template-columns:1fr 1fr;gap:36px;padding-bottom:44px;}
}

/* ── 640px — phone landscape / small tablet ── */
@media(max-width:640px){
  :root{--nav-h:60px;}
  .ll-nav{padding:0 20px;}
  .ll-sec-in{padding:0 20px;}

  .ll-hero-content{padding:36px 16px 72px;}
  .ll-hero-verse{margin:28px 0;}
  .ll-verse-box{padding:22px 24px;}
  .ll-hero-eyebrow{font-size:8px;letter-spacing:.4em;gap:8px;}
  .ll-hero-eyebrow-line{width:24px;}

  .ll-ticker-inner .ll-t-item:nth-child(n+9){display:none;}

  .ll-feat-grid{grid-template-columns:1fr;}
  .ll-feat-card{padding:32px 24px;}

  .ll-gallery-strip{
    overflow-x:auto;
    -webkit-overflow-scrolling:touch;
    scroll-snap-type:x mandatory;
    cursor:grab;
  }
  .ll-gallery-strip:active{cursor:grabbing;}
  .ll-gal-slide{
    flex:0 0 80vw !important;
    scroll-snap-align:start;
    width:80vw;
  }
  .ll-gal-slide.active{flex:0 0 80vw !important;}

  .ll-inv-card{padding:20px 20px;}
  .ll-inv-icon-wrap{width:44px;height:44px;font-size:18px;}

  .ll-footer{padding:56px 20px 0;}
  .ll-footer-top{grid-template-columns:1fr;gap:32px;padding-bottom:40px;}
  .ll-ft-desc{max-width:100%;}

  .ll-enroll-btns{flex-direction:column;align-items:center;}
  .ll-enroll-btns a{width:100%;max-width:320px;text-align:center;}

  .ll-footer-bot{flex-direction:column;text-align:center;gap:12px;}
  .ll-ft-bot-links{gap:16px;}
}

/* ── 480px — standard phone ── */
@media(max-width:480px){
  :root{--nav-h:56px;}
  .ll-nav{padding:0 16px;}
  .ll-nav-logo img{height:30px;}
  .ll-sec-in{padding:0 16px;}

  .ll-hero-content{padding:32px 12px 64px;}
  .ll-verse-box{padding:18px 20px;}

  .ll-img-stack{height:260px;}
  .ll-img-float{display:none;}

  .ll-hero-ctas{gap:10px;}
  .ll-hero-ctas a{width:100%;max-width:280px;}

  .ll-pastor-img{height:260px;}

  .ll-p-quote{padding-left:18px;font-size:14px;}

  .ll-gal-slide{flex:0 0 90vw !important;}

  .ll-welcome-grid{gap:40px;}
  .ll-pastor-grid{gap:40px;}
  .ll-involve-grid{gap:40px;}

  .ll-info-box{padding:24px 20px;}

  .ll-ft-socials{gap:6px;}
  .ll-ft-soc{width:36px;height:36px;font-size:10px;}

  .ll-footer{padding:48px 16px 0;}
  .ll-footer-top{padding-bottom:32px;}
  .ll-footer-bot{padding:20px 0;}
}

/* ── 360px — small phone ── */
@media(max-width:360px){
  .ll-hero-t1{font-size:56px;}
  .ll-hero-t2{font-size:22px;}
  .ll-enroll-title{font-size:48px;}
  .ll-s-h2{font-size:34px;}
  .ll-feat-title{font-size:18px;}
  .ll-verse-box{padding:16px;}
  .ll-verse-text{font-size:13px;}
  .ll-gal-slide{flex:0 0 94vw !important;}
  .ll-inv-card{padding:16px;}
}

img{max-width:100%;height:auto;}
`;

/* ─────────────────────────────────────── CONSTANTS ── */
const GALLERY_IMGS = [
  "https://smhos.org/wp-content/uploads/2023/02/IMG_3956-1024x683.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/IMG_3661-1024x683.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/IMG_3746-1024x683.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/IMG_3780-1024x683.jpg",
  "https://smhos.org/wp-content/uploads/2023/02/DSC04247-1024x683.jpg",
];

const FEATURES = [
  {
    num: "01",
    icon: "📖",
    label: "Learning & Faith",
    title: "AGE-APPROPRIATE TEACHINGS",
    desc: "Lessons carefully tailored to engage children at every stage — making the Word of God accessible, alive, and deeply meaningful.",
    accentColor: "var(--gold)",
    glowColor: "rgba(200,168,75,.12)",
  },
  {
    num: "02",
    icon: "🎨",
    label: "Fun & Discovery",
    title: "CREATIVE ACTIVITIES",
    desc: "Interactive sessions filled with art, music, games, and drama — making learning about God unforgettable and truly joyful.",
    accentColor: "var(--sky2)",
    glowColor: "rgba(79,195,247,.1)",
  },
  {
    num: "03",
    icon: "⭐",
    label: "Growth & Values",
    title: "CHARACTER BUILDING",
    desc: "Intentional programs that instill godly virtues, biblical values, and a strong spiritual identity that lasts a lifetime.",
    accentColor: "var(--mint2)",
    glowColor: "rgba(110,231,183,.1)",
  },
];

const INVOLVE_CARDS = [
  {
    icon: "👶",
    title: "Early Years",
    sub: "Ages 0 – 6  ·  Inclusion Model",
    col: "var(--gold)",
    glow: "rgba(200,168,75,.06)",
  },
  {
    icon: "📚",
    title: "Elementary",
    sub: "1st – 6th Grade  ·  Inclusion Model",
    col: "var(--sky2)",
    glow: "rgba(79,195,247,.07)",
  },
  {
    icon: "💜",
    title: "Breakthrough",
    sub: "1st Grade – 18yrs  ·  Sensory-Sensitive",
    col: "var(--violet2)",
    glow: "rgba(206,147,216,.07)",
  },
  {
    icon: "🙏",
    title: "Enroll Today",
    sub: "Register your child online",
    col: "var(--mint2)",
    glow: "rgba(110,231,183,.07)",
  },
];

const TICKER_ITEMS = [
  "Children's Ministry · Port Harcourt",
  "Ages 0 – 18 Welcome",
  "Sundays at all service times",
  "Leading Lights — Shine Brightly",
  "Nurturing Young Hearts for God",
  "Plot 17 Birabi Street, GRA Phase 1",
];

const NAV_LINKS = [
  ["Home", "/"],
  ["Ministries", "/ministry/children"],
  ["Sermons", "/sermons/"],
  ["Events", "/events/"],
  ["Contact", "/contact"],
];

/* ──────────────────────────────────────────── HOOKS ── */
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" },
    );
    document
      .querySelectorAll(".ll-rev,.ll-rev-l,.ll-rev-r")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ──────────────────────────────────── COMPONENTS ── */

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    const colors = [
      "rgba(200,168,75,",
      "rgba(79,195,247,",
      "rgba(165,243,196,",
      "rgba(255,213,79,",
    ];
    const count = window.innerWidth < 480 ? 28 : 55;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.3 + 0.07),
      r: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      life: Math.random(),
      col: colors[Math.floor(Math.random() * colors.length)],
    }));
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
        ctx.fillStyle = `${p.col}${p.alpha * fade})`;
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
  return <canvas ref={ref} className="ll-hero-canvas" />;
}

function HeroStars() {
  const stars = Array.from({ length: 20 }, () => ({
    left: `${Math.random() * 95}%`,
    top: `${Math.random() * 90}%`,
    size: `${Math.random() * 3 + 1}px`,
    dur: `${2 + Math.random() * 4}s`,
    del: `${Math.random() * 4}s`,
    opacity: Math.random() * 0.7 + 0.2,
  }));
  return (
    <div className="ll-hero-stars">
      {stars.map((s, i) => (
        <div
          key={i}
          className="ll-h-star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            "--dur": s.dur,
            "--del": s.del,
            opacity: s.opacity,
            boxShadow: `0 0 ${parseInt(s.size) * 3}px rgba(200,168,75,.6)`,
          }}
        />
      ))}
    </div>
  );
}

function Gallery() {
  const [active, setActive] = useState(0);
  const [switching, setSwitching] = useState(false);
  const stripRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setSwitching(true);
      setTimeout(() => {
        setActive((i) => (i + 1) % GALLERY_IMGS.length);
        setSwitching(false);
      }, 300);
    }, 5200);
    return () => clearInterval(t);
  }, []);

  const go = useCallback((dir) => {
    setSwitching(true);
    setTimeout(() => {
      setActive((i) => (i + dir + GALLERY_IMGS.length) % GALLERY_IMGS.length);
      setSwitching(false);
    }, 300);
  }, []);

  return (
    <section className="ll-gallery">
      <div className="ll-sec-in">
        <div className="ll-gallery-hdr ll-rev">
          <div>
            <div className="ll-s-lbl">
              <div className="ll-s-lbl-line" />
              Memories &amp; Moments
            </div>
            <h2 className="ll-s-h2">
              OUR LEADING
              <br />
              <em>Lights in Action</em>
            </h2>
          </div>
          <a
            href="/ministry/children/"
            className="ll-btn-ghost"
            target="_blank"
            rel="noreferrer"
          >
            View All Photos →
          </a>
        </div>

        <div
          ref={stripRef}
          className="ll-gallery-strip ll-rev"
          style={{ transitionDelay: ".1s" }}
        >
          {GALLERY_IMGS.map((img, i) => (
            <div
              key={i}
              className={`ll-gal-slide${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img
                src={img}
                alt={`Leading Lights moment ${i + 1}`}
                className="ll-gal-img"
                loading="lazy"
                style={{
                  opacity: switching && i === active ? 0.4 : 1,
                  transition: "opacity .3s",
                }}
              />
              <div className="ll-gal-overlay" />
              <div className="ll-gal-num">0{i + 1}</div>
            </div>
          ))}
        </div>

        <div className="ll-gal-nav ll-rev" style={{ transitionDelay: ".2s" }}>
          <button
            className="ll-gal-btn"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <div className="ll-gal-dots">
            {GALLERY_IMGS.map((_, i) => (
              <div
                key={i}
                className={`ll-gal-dot${i === active ? " active" : ""}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button
            className="ll-gal-btn"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────── MAIN PAGE COMPONENT ── */
export default function LeadingLights() {
  useReveal();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    };
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style>{CSS}</style>
      <div className="ll-grain" aria-hidden />

      {/* ── NAVIGATION ── */}
      <nav className={`ll-nav${scrolled ? " sc" : ""}`}>
        <div className="ll-nav-logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
            />
          </Link>
        </div>
        <div className="ll-nav-links">
          {NAV_LINKS.map(([label, href], i) => (
            <a
              key={i}
              href={href}
              className="ll-nav-a"
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          ))}
          <a
            href="/give"
            className="ll-nav-cta"
            target="_blank"
            rel="noreferrer"
          >
            Give Online
          </a>
        </div>
        <button
          className={`ll-nav-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        className={`ll-mobile-menu${menuOpen ? " open" : ""}`}
        role="navigation"
      >
        {NAV_LINKS.map(([label, href], i) => (
          <a
            key={i}
            href={href}
            className="ll-mob-link"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
        <a
          href="/give"
          className="ll-mob-cta"
          target="_blank"
          rel="noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Give Online
        </a>
      </div>

      {/* ── HERO ── */}
      <section className="ll-hero">
        <ParticleCanvas />
        <HeroStars />
        <div className="ll-hero-glow-1" aria-hidden />
        <div className="ll-hero-glow-2" aria-hidden />
        <div className="ll-hero-rings" aria-hidden>
          {[1, 2, 3].map((i) => (
            <div key={i} className="ll-h-ring" />
          ))}
        </div>

        <div className="ll-hero-content">
          <div className="ll-hero-eyebrow">
            <div className="ll-hero-eyebrow-line" />
            Salvation Ministries · Children&apos;s Ministry
            <div className="ll-hero-eyebrow-line r" />
          </div>
          <h1 className="ll-hero-t1">LEADING</h1>
          <div className="ll-hero-t2">
            <span className="ll-prism">Lights</span>
          </div>
          <div className="ll-hero-verse">
            <div className="ll-verse-box">
              <div className="ll-vc-tl" />
              <div className="ll-vc-br" />
              <p className="ll-verse-text">
                "Train up a child in the way he should go, and when he is old he
                will not depart from it."
              </p>
              <div className="ll-verse-ref">
                Proverbs 22:6 · New King James Version
              </div>
            </div>
          </div>
          <div className="ll-hero-ctas">
            <Link
              to="/contact"
              className="ll-btn-sky"
              target="_blank"
              rel="noreferrer"
            >
              Enroll Your Child
            </Link>
            <Link
              to="/contact"
              className="ll-btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="ll-hero-scroll" aria-hidden>
          <div className="ll-hero-scroll-lbl">Scroll</div>
          <div className="ll-scroll-track">
            <div className="ll-scroll-fill" />
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ll-ticker" aria-hidden>
        <div className="ll-ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ll-t-item">
              <span className="ll-t-dot" />
              {item}
              <span className="ll-t-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ── WELCOME ── */}
      <section className="ll-welcome">
        <div className="ll-sec-in">
          <div className="ll-welcome-grid">
            <div className="ll-rev-l">
              <div className="ll-s-lbl">
                <div className="ll-s-lbl-line" />
                Welcome
              </div>
              <h2 className="ll-s-h2">
                SHINING STARS
                <br />
                ARE BORN <em>Here</em>
              </h2>
              <div className="ll-s-orn" />
              <p className="ll-s-body">
                Leading Lights is our dedicated ministry for children — a sacred
                space where young hearts are nurtured, young minds are shaped,
                and young spirits are set ablaze with the love of God.
              </p>
              <p className="ll-s-body">
                We believe that spiritual foundations built in childhood become
                unshakeable pillars for life. Every child is a star waiting to
                shine.
              </p>
              <div
                style={{
                  marginTop: 36,
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <a
                  href="/contact"
                  className="ll-btn-ghost"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get In Touch
                </a>
              </div>
            </div>
            <div className="ll-rev-r">
              <div className="ll-img-stack">
                <div className="ll-img-frame-outer" />
                <img
                  src="https://smhos.org/wp-content/uploads/2023/02/IMG_3956-1024x683.jpg"
                  alt="Leading Lights children in worship"
                  className="ll-img-main"
                  loading="lazy"
                />
                <div className="ll-img-badge">Est. 1997 · Leading Lights</div>
                <div className="ll-img-float">
                  <div className="ll-img-float-val">100+</div>
                  <div className="ll-img-float-lbl">Churches Worldwide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="ll-features">
        <div className="ll-feat-bg" aria-hidden>
          CHILDREN
        </div>
        <div className="ll-sec-in">
          <div className="ll-features-hdr">
            <div>
              <div className="ll-s-lbl ll-rev">
                <div className="ll-s-lbl-line" />
                What We Offer
              </div>
              <h2 className="ll-s-h2 ll-rev" style={{ transitionDelay: ".1s" }}>
                EVERYTHING YOUR
                <br />
                CHILD NEEDS TO <em>Flourish</em>
              </h2>
            </div>
            <div className="ll-rev" style={{ transitionDelay: ".2s" }}>
              <p
                style={{
                  fontSize: "clamp(13px,1.6vw,15px)",
                  lineHeight: 2,
                  color: "var(--muted)",
                  maxWidth: 300,
                }}
              >
                Three pillars of a world-class children&apos;s ministry, built
                on faith and love.
              </p>
            </div>
          </div>
          <div className="ll-feat-grid">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="ll-feat-card ll-rev"
                style={{
                  transitionDelay: `${i * 0.12}s`,
                  "--card-accent": f.accentColor,
                  "--card-glow": f.glowColor,
                }}
              >
                <div className="ll-feat-card-bg" />
                <div className="ll-feat-num">
                  {f.num}
                  <div className="ll-feat-icon">{f.icon}</div>
                </div>
                <div className="ll-feat-lbl">{f.label}</div>
                <div className="ll-feat-title">{f.title}</div>
                <div className="ll-feat-div" />
                <div className="ll-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PASTOR ── */}
      <section className="ll-pastor">
        <div className="ll-sec-in">
          <div className="ll-pastor-grid">
            <div className="ll-rev-l">
              <div className="ll-pastor-img-wrap">
                <div className="ll-pastor-img-frame" />
                <img
                  src="https://smhos.org/wp-content/uploads/2023/02/472208133_489260920875051_7916238657200289113_n.jpg"
                  alt="Pastor Fortune Dokubo"
                  className="ll-pastor-img"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="ll-rev-r">
              <div className="ll-s-lbl">
                <div className="ll-s-lbl-line" />
                Children&apos;s Ministry Pastor
              </div>
              <span className="ll-p-qmark">&ldquo;</span>
              <blockquote className="ll-p-quote">
                Every child that walks through our doors carries the fingerprint
                of God. Our calling is to help them discover that fingerprint —
                and shine with it for all their days.
              </blockquote>
              <div className="ll-p-div" />
              <div className="ll-p-name">PST. FORTUNE DOKUBO</div>
              <div className="ll-p-role">
                Children&apos;s Ministry Pastor · Salvation Ministries
              </div>
              <div style={{ marginTop: 36 }}>
                <a
                  href="/contact"
                  className="ll-btn-g"
                  target="_blank"
                  rel="noreferrer"
                >
                  Connect With Us →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <Gallery />

      {/* ── VERSE BANNER ── */}
      <div className="ll-v-banner">
        <blockquote className="ll-v-q ll-rev">
          &ldquo;Let the little children come to me, and do not forbid them; for
          of such is the kingdom of heaven.&rdquo;
        </blockquote>
        <div className="ll-v-attr ll-rev" style={{ transitionDelay: ".1s" }}>
          Matthew 19:14 · The Words of Jesus Christ
        </div>
      </div>

      {/* ── INVOLVEMENT ── */}
      <section className="ll-involve">
        <div className="ll-sec-in">
          <div className="ll-involve-grid">
            <div className="ll-rev-l">
              <div className="ll-s-lbl">
                <div className="ll-s-lbl-line" />
                Programs &amp; Groups
              </div>
              <h2 className="ll-s-h2">
                A PLACE FOR
                <br />
                EVERY <em>Child</em>
              </h2>
              <div className="ll-s-orn" />
              <p className="ll-s-body">
                We believe our church is richer for every child who walks
                through its doors. We partner with parents and caregivers to
                find the very best fit — including our Breakthrough program for
                neurodiverse and special-needs children.
              </p>
              <div style={{ marginTop: 36 }}>
                <Link
                  to="/contact"
                  className="ll-btn-sky"
                  target="_blank"
                  rel="noreferrer"
                >
                  Register A Child →
                </Link>
              </div>
            </div>
            <div>
              <div className="ll-cards-stack">
                {INVOLVE_CARDS.map((c, i) => (
                  <Link
                    key={i}
                    to="/contact"
                    className="ll-inv-card ll-rev"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      "--card-col": c.col,
                      "--card-glow2": c.glow,
                      transitionDelay: `${i * 0.1}s`,
                      borderLeftColor: c.col,
                    }}
                  >
                    <div
                      className="ll-inv-icon-wrap"
                      style={{ borderColor: c.col }}
                    >
                      {c.icon}
                    </div>
                    <div className="ll-inv-info">
                      <div className="ll-inv-title">{c.title}</div>
                      <div className="ll-inv-sub">{c.sub}</div>
                    </div>
                    <div className="ll-inv-arr">→</div>
                  </Link>
                ))}
              </div>
              <div
                className="ll-info-box ll-rev"
                style={{ transitionDelay: ".4s" }}
              >
                <div className="ll-info-box-title">
                  Meeting Times &amp; Location
                </div>
                <div className="ll-info-box-body">
                  Leading Lights meets during all Sunday services at Salvation
                  Ministries.
                  <br />
                  <br />
                  <strong style={{ color: "var(--white)", fontWeight: 600 }}>
                    Plot 17 Birabi Street, GRA Phase 1,
                    <br />
                    Port Harcourt, Rivers, Nigeria.
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENROLL CTA ── */}
      <section className="ll-enroll">
        <div className="ll-enroll-glow" aria-hidden />
        <div className="ll-enroll-inner">
          <div className="ll-enroll-eyebrow ll-rev">
            <div className="ll-enroll-ey-line" />
            Join Leading Lights Today
            <div className="ll-enroll-ey-line r" />
          </div>
          <h2
            className="ll-enroll-title ll-rev"
            style={{ transitionDelay: ".1s" }}
          >
            LET YOUR CHILD
            <em>SHINE BRIGHT</em>
          </h2>
          <p
            className="ll-enroll-sub ll-rev"
            style={{ transitionDelay: ".2s" }}
          >
            Enroll your child in Leading Lights and watch them grow into the
            shining star they are meant to be.
          </p>
          <div
            className="ll-enroll-btns ll-rev"
            style={{ transitionDelay: ".3s" }}
          >
            <Link
              to="/contact"
              className="ll-btn-sky"
              target="_blank"
              rel="noreferrer"
            >
              Enroll Your Child →
            </Link>
            <Link
              to="/give"
              className="ll-btn-g"
              target="_blank"
              rel="noreferrer"
            >
              Support This Ministry
            </Link>
            <a
              href="/ministry/children"
              className="ll-btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ll-footer">
        <div className="ll-footer-top">
          <div>
            <img
              src="https://smhos.org/wp-content/uploads/2025/03/Logo-Light-1-948x500-1.png"
              alt="Salvation Ministries"
              className="ll-ft-logo"
            />
            <p className="ll-ft-desc">
              Salvation Ministries — Home of Success. Nurturing leading lights
              since 1997 across Port Harcourt and the world.
            </p>
            <div className="ll-ft-socials">
              {[
                ["Fb", "https://www.facebook.com/smhosglobal"],
                ["Ig", "https://www.instagram.com/smhosglobal"],
                ["▶", "/livestream"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="ll-ft-soc"
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="ll-ft-col-title">Navigate</div>
            <ul className="ll-ft-links">
              {[
                ["Home", "/"],
                ["About Us", "/about/"],
                ["Sermons", "/sermons/"],
                ["Events", "/events/"],
                ["Give", "/give"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="ll-ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ll-ft-col-title">Ministries</div>
            <ul className="ll-ft-links">
              {[
                ["Leading Lights", "/ministry/children/"],
                ["Youth Ministry", "/ministry/youth"],
                ["Campus Ministry", "/ministry/campus/"],
                ["Church Locator", "/locator/"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="ll-ft-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="ll-ft-col-title">Contact</div>
            <div className="ll-ft-contact-item">
              <a href="tel:+2348033123743">+234 (803) 312 3743</a>
            </div>
            <div className="ll-ft-contact-item">
              <a href="mailto:info@smhos.org" target="_blank" rel="noreferrer">
                info@smhos.org
              </a>
            </div>
            <div
              className="ll-ft-contact-item"
              style={{ marginTop: 14, lineHeight: 1.85 }}
            >
              Plot 17 Birabi Street,
              <br />
              GRA Phase 1, Port Harcourt,
              <br />
              Rivers, Nigeria.
            </div>
          </div>
        </div>
        <div className="ll-footer-bot">
          <div className="ll-ft-copy">
            © 2026 Salvation Ministries. All Rights Reserved.
          </div>
          <div className="ll-ft-diamond" />
          <div className="ll-ft-bot-links">
            {[
              ["Contact", "/contact"],
              ["Give", "/give"],
              ["Forms", "/forms/"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="ll-ft-bot-link"
                target="_blank"
                rel="noreferrer"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
