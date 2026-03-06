import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

// ── Scramble Engine ───────────────────────────────────────────────────
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

function scramble(el, original, duration = 0.55) {
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
    if (frame <= totalFrames) {
      raf.id = requestAnimationFrame(tick);
    } else {
      el.textContent = original;
    }
  };

  raf.id = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf.id);
    el.textContent = original;
  };
}

// ── Scramble Nav Item ─────────────────────────────────────────────────
function NavItem({ label, to, innerRef, onClick }) {
  const visibleRef = useRef(null);
  const cancelRef = useRef(null);

  const handleEnter = useCallback(() => {
    if (cancelRef.current) cancelRef.current();
    cancelRef.current = scramble(visibleRef.current, label, 0.55);
  }, [label]);

  const inner = (
    <li ref={innerRef} onMouseEnter={handleEnter}>
      <span className="nav-label-spacer">{label}</span>
      <span className="nav-label-visible" ref={visibleRef}>
        {label}
      </span>
    </li>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  return (
    <a href="#" onClick={onClick}>
      {inner}
    </a>
  );
}

// ── Nav config ────────────────────────────────────────────────────────
const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us" },
  { label: "Products" },
  { label: "Metal Rates", to: "/metal-rates" },
  { label: "Contact Us" },
];

// ── Header ────────────────────────────────────────────────────────────
const Header = ({ dark = false }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
    )
      .fromTo(
        logoRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6 },
        "-=0.5",
      )
      .fromTo(
        linksRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        "-=0.4",
      );

    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navClass = [
    scrolled ? "scrolled" : "",
    dark ? "dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav ref={navRef} className={navClass}>
        <div className="nav-left" ref={logoRef}>
          <img
            src="../src/assets/logo.png"
            alt="Logo"
            height="100px"
            width="200px"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          <ul>
            {navItems.map((item, i) => (
              <NavItem
                key={item.label}
                label={item.label}
                to={item.to}
                innerRef={(el) => (linksRef.current[i] = el)}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </ul>
        </div>

        <div
          className={`mobile-overlay ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(false)}
        />

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
