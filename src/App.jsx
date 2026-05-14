import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Import all your pages
import Home from "./Home";
import About from "./About";
import LiveStream from "./LiveStream";
import Give from "./Give";
import Campus from "./Campus";
import Children from "./Children";
import Youth from "./Youth";
import Expectation from "./Expectation";
import Forms from "./Forms";
import Sermon from "./Sermon";
import Events from "./Events";
import ChurchLocator from "./ChurchLocator";
import Contact from "./Contact";
import Login from "./Login";
import Details from "./Details";

// ─── Shared Layout Component ───────────────────────────────────────────────
function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isCampusPage = location.pathname.startsWith("/ministry/campus");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/livestream", label: "Livestream" },
    { to: "/sermons", label: "Sermons" },
    { to: "/events", label: "Events" },
    { to: "/locator", label: "Locator" },
    { to: "/expectation", label: "Expectation" },
    { to: "/forms", label: "Forms" },
    { to: "/give", label: "Give" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

       .sm-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: rgba(5,5,10,0.7);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201,162,39,0.15);
          padding: 18px 5%;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s ease;
        }
       .sm-nav.scrolled {
          background: rgba(5,5,10,0.95);
          padding: 14px 5%;
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }

       .nav-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
        }
       .nav-logo img { height: 42px; width: auto; }
       .nav-title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: #f0d060;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

       .nav-links {
          display: flex; gap: 8px; align-items: center;
        }
       .nav-link {
          background: transparent;
          border: 1px solid rgba(255,255,0.12);
          color: rgba(200,220,255,0.8);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Lato', sans-serif;
          text-decoration: none;
          transition: all 0.25s;
          cursor: pointer;
        }
       .nav-link:hover {
          background: rgba(201,162,39,0.12);
          border-color: #c9a227;
          color: #f0d060;
        }
       .nav-link.active {
          background: linear-gradient(135deg, rgba(201,162,39,0.25), rgba(240,208,96,0.15));
          border-color: #c9a227;
          color: #f0d060;
        }
       .nav-link.gold {
          background: linear-gradient(135deg, rgba(201,162,39,0.25), rgba(240,208,96,0.15));
          border-color: #c9a227;
          color: #f0d060;
        }
       .nav-link.gold:hover {
          background: linear-gradient(135deg, rgba(201,162,39,0.4), rgba(240,208,96,0.25));
          box-shadow: 0 0 20px rgba(201,162,39,0.3);
        }

       .burger {
          display: none; flex-direction: column; gap: 6px;
          background: none; border: none; cursor: pointer; padding: 8px;
        }
          .overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 998;
}
       .burger span {
          width: 26px; height: 2px; background: #f0d060;
          transition: all 0.3s ease;
        }
       .burger.open span:nth-child(1) { transform: rotate(45deg) translate(7px, 7px); }
       .burger.open span:nth-child(2) { opacity: 0; }
       .burger.open span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }

       .mobile-menu {
          position: fixed; top: 0; right: -100%;
          width: 80%; max-width: 320px; height: 100vh;
          background: rgba(10,14,46,0.98);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(201,162,39,0.2);
          padding: 80px 24px 24px;
          transition: right 0.4s ease;
          z-index: 999;
          overflow-y: auto;
        }
       .mobile-menu.open { right: 0; }
       .mobile-menu a {
          display: block;
          padding: 14px 16px;
          margin-bottom: 8px;
          color: rgba(200,220,255,0.85);
          text-decoration: none;
          border-radius: 8px;
          border: 1px solid rgba(255,255,0.08);
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          transition: all 0.2s;
        }
       .mobile-menu a:hover,.mobile-menu a.active {
          background: rgba(201,162,39,0.15);
          border-color: #c9a227;
          color: #f0d060;
        }

       .content-wrapper {
          padding-top: 78px;
          min-height: 100vh;
        }

        @media (max-width: 1024px) {
         .nav-links { display: none; }
         .burger { display: flex; }
        }
        @media (max-width: 640px) {
         .sm-nav { padding: 14px 20px; }
         .nav-title { font-size: 0.9rem; }
         .content-wrapper { padding-top: 70px; }
        }
      `}</style>
      ;
      <nav className={`sm-nav ${scrolled ? "scrolled" : ""}`}>
        <NavLink to="/" className="nav-logo">
          <span className="nav-title">Salvation Ministries</span>
        </NavLink>

        <div className="nav-links">
          {navLinks.map((link) => {
            // const isActive = location.pathname === link.to;
            // return (
            //   <NavLink
            //     key={link.to}
            //     to={link.to}
            //     end
            //     className={({ isActive }) =>
            //       isCampusPage
            //         ? "nav-link"
            //         : `nav-link ${isActive ? "active" : ""}`
            //     }
            //   >
            //     {link.label}
            //   </NavLink>
            // );
          })}
        </div>
      </nav>
      {/* ✅ Overlay (fixes weird sidebar feel) */}
      {/* ✅ Sidebar */}
      <div className="content-wrapper">
        <Outlet />
      </div>
    </>
  );
}

// ─── Main App with Router ──────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="livestream" element={<LiveStream />} />
          <Route path="give" element={<Give />} />
          <Route path="sermons" element={<Sermon />} />
          <Route path="events" element={<Events />} />
          <Route path="contact" element={<Contact />} />
          <Route path="details" element={<Details />} />
          <Route path="locator" element={<ChurchLocator />} />
          <Route path="expectation" element={<Expectation />} />
          <Route path="forms" element={<Forms />} />
          <Route path="login" element={<Login />} />

          <Route path="ministry">
            <Route path="campus" element={<Campus />} />
            <Route path="children" element={<Children />} />
            <Route path="youth" element={<Youth />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
