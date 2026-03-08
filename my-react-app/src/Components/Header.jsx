import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

// ── Scramble Engine ───────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

function scramble(el, original, duration = 0.5) {
  const totalFrames = Math.round(duration * 60);
  let frame = 0;
  const raf = { id: null };
  const tick = () => {
    const resolved = Math.floor((frame / totalFrames) * original.length);
    let out = "";
    for (let i = 0; i < original.length; i++) {
      if (original[i] === " ") {
        out += " ";
        continue;
      }
      out +=
        i < resolved
          ? original[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = out;
    frame++;
    if (frame <= totalFrames) raf.id = requestAnimationFrame(tick);
    else el.textContent = original;
  };
  raf.id = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf.id);
    el.textContent = original;
  };
}

// ── Magnetic Nav Item ─────────────────────────────────────────────────
function NavItem({ label, to, innerRef, onClick, onHoverChange }) {
  const visibleRef = useRef(null);
  const liRef = useRef(null);
  const cancelRef = useRef(null);

  const handleEnter = useCallback(
    (e) => {
      if (cancelRef.current) cancelRef.current();
      cancelRef.current = scramble(visibleRef.current, label, 0.5);
      onHoverChange(liRef.current);

      // Magnetic float up
      gsap.to(liRef.current, { y: -3, duration: 0.3, ease: "power2.out" });
    },
    [label, onHoverChange],
  );

  const handleLeave = useCallback(() => {
    gsap.to(liRef.current, { y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
  }, []);

  // Magnetic pull toward cursor within the element
  const handleMove = useCallback((e) => {
    const rect = liRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.18;
    const dy = (e.clientY - cy) * 0.18;
    gsap.to(liRef.current, {
      x: dx,
      y: dy - 3,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleMoveLeave = useCallback(() => {
    gsap.to(liRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    onHoverChange(null);
  }, [onHoverChange]);

  const inner = (
    <li
      ref={(el) => {
        liRef.current = el;
        if (innerRef) innerRef(el);
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleMoveLeave}
      onMouseMove={handleMove}
    >
      <span className="nav-label-spacer">{label}</span>
      <span className="nav-label-visible" ref={visibleRef}>
        {label}
      </span>
    </li>
  );

  return to ? (
    <Link to={to} onClick={onClick}>
      {inner}
    </Link>
  ) : (
    <a href="#" onClick={onClick}>
      {inner}
    </a>
  );
}

// ── Nav config ────────────────────────────────────────────────────────
const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Metal Rates", to: "/metal-rates" },
  { label: "CONTACT US", to: "/contact" }
];

// ── Header ────────────────────────────────────────────────────────────
const Header = ({ dark = false }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const gliderRef = useRef(null);
  const pulseRef = useRef(null);
  const linksRef = useRef([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // ── Entry animation ──
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      navRef.current,
      { y: -110, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1 },
    )
      .fromTo(
        logoRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.7 },
        "-=0.6",
      )
      .fromTo(
        linksRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 },
        "-=0.4",
      )
      .fromTo(
        pulseRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
        "-=0.5",
      );
  }, []);

  // ── 3D perspective tilt on mouse move ──
  useEffect(() => {
    const nav = navRef.current;
    const onMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * 3;
      const ry = ((e.clientX - cx) / rect.width) * -4;
      gsap.to(nav, {
        rotateX: rx,
        rotateY: ry,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 1200,
        transformOrigin: "center center",
      });
    };
    const onLeave = () => {
      gsap.to(nav, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.6)",
      });
    };
    nav.addEventListener("mousemove", onMove);
    nav.addEventListener("mouseleave", onLeave);
    return () => {
      nav.removeEventListener("mousemove", onMove);
      nav.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Scroll ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Resize ──
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  // ── Body scroll lock ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ── Liquid glider — follows hovered nav item ──
  const handleHoverChange = useCallback((el) => {
    const glider = gliderRef.current;
    if (!el) {
      gsap.to(glider, { opacity: 0, duration: 0.25 });
      return;
    }
    const rect = el.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    gsap.to(glider, {
      opacity: 1,
      x: rect.left - navRect.left,
      width: rect.width,
      duration: 0.4,
      ease: "power3.out",
    });
  }, []);

  const navClass = [scrolled ? "scrolled" : "", dark ? "dark" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav ref={navRef} className={navClass}>
        {/* ── Liquid gold glider pill ── */}
        <div ref={gliderRef} className="nav-glider" />

        {/* ── Bottom pulse line ── */}
        <div ref={pulseRef} className="nav-pulse-line" />

        {/* ── Logo ── */}
        <div className="nav-left" ref={logoRef}>
          <div className="logo-wrap" onClick={() => navigate("/")}>
            <img src="../src/assets/logo.png" alt="Logo" />
            <div className="logo-shimmer" />
          </div>
        </div>

        {/* ── Desktop links ── */}
        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          <ul>
            {navItems.map((item, i) => (
              <NavItem
                key={item.label}
                label={item.label}
                to={item.to}
                innerRef={(el) => (linksRef.current[i] = el)}
                onClick={() => setMenuOpen(false)}
                onHoverChange={handleHoverChange}
              />
            ))}
          </ul>
        </div>

        {/* ── Mobile overlay ── */}
        <div
          className={`mobile-overlay ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* ── Hamburger ── */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </>
  );
};

export default Header;
