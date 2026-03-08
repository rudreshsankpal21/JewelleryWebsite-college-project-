import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Header from "../Components/Header";
import ThreeBackground from "../Components/ThreeBackground";
import "../styles/MetalRates.css";
import CursorSmoke from "../Components/Cursorsmoke";

// ── Helpers ────────────────────────────────────────────────────────────
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDateTime = (str) => {
  const d = new Date(str);
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRateDate = (str) =>
  new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const groupByMetal = (data) => {
  const map = {};
  data.forEach((item) => {
    if (!map[item.metal_name]) map[item.metal_name] = [];
    map[item.metal_name].push(item);
  });
  return map;
};

const METAL_CONFIG = {
  Gold: {
    accent: "#d4af37",
    accentLight: "#f5e6b8",
    symbol: "Au",
  },
  Silver: {
    accent: "#c0c0c0",
    accentLight: "#eaeaea",
    symbol: "Ag",
  },
  Platinum: {
    accent: "#e5e4e2",
    accentLight: "#f5f5f5",
    symbol: "Pt",
  },
};

// ── Metal Card ─────────────────────────────────────────────────────────
const MetalCard = ({ metal, index }) => {
  const cardRef = useRef(null);
  const config = METAL_CONFIG[metal.metal_name] || METAL_CONFIG.Gold;

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 36, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        delay: 0.4 + index * 0.1,
        ease: "power3.out",
      },
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="mr-card"
      style={{
        "--card-accent": config.accent,
        "--card-accent-light": config.accentLight,
        opacity: 0,
      }}
    >
      {/* Top accent line */}
      <div className="mr-card-topline" />

      {/* Header row */}
      <div className="mr-card-head">
        <span className="mr-card-metal">{metal.metal_name}</span>
        <span className="mr-card-symbol">{config.symbol}</span>
      </div>

      {/* Purity badge */}
      {metal.purity && <div className="mr-card-purity">{metal.purity}</div>}

      {/* Rate */}
      <div className="mr-card-rate-wrap">
        <span className="mr-card-rate">{formatINR(metal.rate)}</span>
        <span className="mr-card-unit">per {metal.unit}</span>
      </div>

      {/* Footer */}
      <div className="mr-card-footer">
        <span className="mr-card-date">{formatRateDate(metal.rate_date)}</span>
        <div className="mr-card-live">
          <span className="mr-card-live-dot" />
          LIVE
        </div>
      </div>
    </div>
  );
};

// ── Metal Section ──────────────────────────────────────────────────────
const MetalSection = ({ metalName, metals }) => {
  const sectionRef = useRef(null);
  const config = METAL_CONFIG[metalName] || METAL_CONFIG.Gold;

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 },
    );
  }, []);

  return (
    <div ref={sectionRef} className="mr-section" style={{ opacity: 0 }}>
      <div className="mr-section-header">
        <div
          className="mr-section-indicator"
          style={{ background: config.accent }}
        />
        <h2 className="mr-section-title" style={{ color: config.accent }}>
          {metalName}
        </h2>
        <div
          className="mr-section-line"
          style={{
            background: `linear-gradient(to right, ${config.accent}, transparent)`,
          }}
        />
        <span className="mr-section-count">{metals.length} variants</span>
      </div>
      <div className="mr-cards-grid">
        {metals.map((m, i) => (
          <MetalCard key={m.metal_id} metal={m} index={i} />
        ))}
      </div>
    </div>
  );
};

// ── MetalRatesPage ────────────────────────────────────────────────────
const MetalRatesPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const captionRef = useRef(null);
  const updatedRef = useRef(null);

  // Fetch
  useEffect(() => {
    fetch("/.netlify/functions/metal-rates")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        if (json.status) setData(json);
        else setError("Failed to fetch metal rates.");
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Hero animations
  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      captionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.4",
      )
      .fromTo(
        updatedRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5",
      );
  }, [loading]);

  const grouped = data ? groupByMetal(data.data) : {};
  // Render Gold first, then others
  const metalOrder = ["Gold", "Silver", "Platinum"];
  const orderedEntries = metalOrder
    .filter((m) => grouped[m])
    .map((m) => [m, grouped[m]])
    .concat(Object.entries(grouped).filter(([m]) => !metalOrder.includes(m)));

  return (
    <div className="mr-page">
      {/* Smoke cursor trail */}
      <CursorSmoke />

      {/* 3D Background */}
      <ThreeBackground />

      {/* Radial overlay for readability */}
      <div className="mr-overlay" />

      {/* Nav */}
      <Header dark />

      {/* ── Page Content ── */}
      <div className="mr-content">
        {/* Hero */}
        <div className="mr-hero" ref={heroRef}>
          <div className="mr-hero-ornament">
            <span className="mr-ornament-line" />
            <span className="mr-ornament-diamond">◆</span>
            <span className="mr-ornament-line" />
          </div>

          <span ref={captionRef} className="mr-caption" style={{ opacity: 0 }}>
            Live Market Data · Updated Daily
          </span>

          <h1 ref={titleRef} className="mr-title" style={{ opacity: 0 }}>
            Metal Rates
          </h1>

          <p ref={updatedRef} className="mr-updated" style={{ opacity: 0 }}>
            {data
              ? `Last updated: ${formatDateTime(data.rate_updated)}`
              : "\u00a0"}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mr-loading">
            <div className="mr-spinner" />
            <span>Fetching live rates…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mr-error">
            <span className="mr-error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Rates */}
        {!loading && !error && (
          <div className="mr-sections">
            {orderedEntries.map(([metalName, metals]) => (
              <MetalSection
                key={metalName}
                metalName={metalName}
                metals={metals}
              />
            ))}
          </div>
        )}

        {/* Bottom ornament */}
        <div className="mr-bottom-ornament">
          <span className="mr-ornament-line long" />
          <span className="mr-ornament-diamond small">◆</span>
          <span className="mr-ornament-line long" />
        </div>
      </div>
    </div>
  );
};

export default MetalRatesPage;
