import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import CursorSmoke from "../Components/Cursorsmoke";
import '../styles/Aboutpage.css';

gsap.registerPlugin(ScrollTrigger);

// ── Floating 3D ring background ───────────────────────────────────────
function ThreeRings({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 8;

    // Lights
    const amb = new THREE.AmbientLight(0xfff5cc, 0.4);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0xffd060, 3);
    key.position.set(5, 6, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe8a0, 1.5);
    fill.position.set(-5, 2, 3);
    scene.add(fill);
    const pt = new THREE.PointLight(0xd4af37, 2.5, 14);
    pt.position.set(0, 0, 5);
    scene.add(pt);

    const goldMat = (r = 0.2) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d4af37"),
        emissive: new THREE.Color("#6a4c00"),
        emissiveIntensity: 0.15,
        roughness: r,
        metalness: 1.0,
      });

    // Create multiple rings at different angles
    const rings = [];
    const configs = [
      { rx: 0.4, ry: 0.2, rz: 0, r: 2.8, t: 0.06, rough: 0.18, speed: 0.09 },
      { rx: 1.1, ry: 0.6, rz: 0.3, r: 2.1, t: 0.045, rough: 0.3, speed: -0.13 },
      { rx: 0.8, ry: 1.4, rz: 0.7, r: 3.4, t: 0.03, rough: 0.4, speed: 0.06 },
      { rx: 0.2, ry: 0.8, rz: 1.2, r: 1.6, t: 0.055, rough: 0.22, speed: -0.1 },
    ];

    configs.forEach(({ rx, ry, rz, r, t, rough, speed }) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 20, 140),
        goldMat(rough),
      );
      mesh.rotation.set(rx, ry, rz);
      mesh.userData.speed = speed;
      mesh.scale.set(0.01, 0.01, 0.01);
      scene.add(mesh);
      rings.push(mesh);
    });

    // Central gem
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.55, 0),
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        emissive: "#7a5c00",
        emissiveIntensity: 0.3,
        roughness: 0.08,
        metalness: 1,
      }),
    );
    gem.scale.set(0.01, 0.01, 0.01);
    scene.add(gem);

    // Particles
    const pCount = 200;
    const pArr = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r2 = 3 + Math.random() * 4;
      const t2 = Math.random() * Math.PI * 2;
      const p2 = Math.acos(2 * Math.random() - 1);
      pArr[i * 3] = r2 * Math.sin(p2) * Math.cos(t2);
      pArr[i * 3 + 1] = r2 * Math.sin(p2) * Math.sin(t2);
      pArr[i * 3 + 2] = r2 * Math.cos(p2);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
      }),
    );
    scene.add(particles);

    // Spring-in entrance
    const allMeshes = [...rings, gem];
    gsap.to(
      allMeshes.map((m) => m.scale),
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.15,
        delay: 0.3,
      },
    );

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      rings.forEach((r) => {
        r.rotation.y += r.userData.speed * 0.012;
        r.rotation.x += r.userData.speed * 0.007;
      });
      gem.rotation.y = t * 0.4;
      gem.rotation.x = t * 0.25;
      pt.intensity = 2.5 + Math.sin(t * 1.6) * 0.8;
      particles.rotation.y = t * 0.03;

      // Parallax group
      scene.rotation.y += (mouse.x * 0.25 - scene.rotation.y) * 0.04;
      scene.rotation.x += (mouse.y * 0.15 - scene.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = canvas.clientWidth,
        h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pGeo.dispose();
    };
  }, []);

  return null;
}

// ── Stat counter ──────────────────────────────────────────────────────
function StatCard({ value, label, suffix = "", ref: cardRef }) {
  return (
    <div className="ap-stat" ref={cardRef}>
      <span className="ap-stat-value">
        {value}
        {suffix}
      </span>
      <span className="ap-stat-label">{label}</span>
    </div>
  );
}

// ── Value card ────────────────────────────────────────────────────────
function ValueCard({ icon, title, desc, index }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.1 * index,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  }, [index]);
  return (
    <div className="ap-value-card" ref={ref}>
      <div className="ap-value-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

// ── Timeline item ─────────────────────────────────────────────────────
function TimelineItem({ year, title, desc, align, index }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, x: align === "left" ? -50 : 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "expo.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      },
    );
  }, [align, index]);
  return (
    <div className={`ap-timeline-item ap-timeline-${align}`} ref={ref}>
      <div className="ap-timeline-content">
        <span className="ap-timeline-year">{year}</span>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <div className="ap-timeline-dot" />
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────
const values = [
  {
    icon: "◆",
    title: "Unmatched Craftsmanship",
    desc: "Every piece passes through the hands of master artisans with decades of experience, ensuring perfection in every curve and setting.",
  },
  {
    icon: "✦",
    title: "Ethical Sourcing",
    desc: "We trace every gemstone and precious metal to responsible origins, so your jewellery carries no hidden cost.",
  },
  {
    icon: "⬡",
    title: "Certified Purity",
    desc: "BIS Hallmarked gold, IGI/GIA certified diamonds — we never compromise on the standards that protect your investment.",
  },
  {
    icon: "◈",
    title: "Personalised Service",
    desc: "From bespoke bridal sets to everyday elegance, our consultants guide every customer to the piece made for them.",
  },
  {
    icon: "❖",
    title: "Timeless Design",
    desc: "Our design studio blends centuries-old Maharashtrian motifs with contemporary silhouettes for jewellery that transcends trends.",
  },
  {
    icon: "✧",
    title: "After-Sales Care",
    desc: "Free cleaning, resizing, and polishing for life — because your relationship with us doesn't end at the counter.",
  },
];

const timeline = [
  {
    year: "1994",
    title: "The Foundation",
    desc: "Kabane Jewellers opens its first showroom in Pune, establishing a reputation for honest gold trade.",
    align: "left",
  },
  {
    year: "2001",
    title: "Giriraj Jewellers Born",
    desc: "A second pillar rises — Giriraj Jewellers earns its name in the diamond quarter of east Pune.",
    align: "right",
  },
  {
    year: "2009",
    title: "Diamond Division Launched",
    desc: "The first dedicated diamond jewellery floor opens, bringing IGI-certified brilliance to local customers.",
    align: "left",
  },
  {
    year: "2017",
    title: "5500 sq.ft. Flagship",
    desc: "The grand Chandan Nagar showroom opens — a destination for bridal, contemporary, and collector pieces.",
    align: "right",
  },
  {
    year: "2023",
    title: "Kabane Jewellers Born",
    desc: "Two legacies merge into one: Kabane Jewellers Private Limited — 30 years of trust, one iconic name.",
    align: "left",
  },
];

const stats = [
  { value: "30", suffix: "+", label: "Years of Trust" },
  { value: "5500", suffix: " sq.ft", label: "Showroom Space" },
  { value: "10K", suffix: "+", label: "Happy Families" },
  { value: "100", suffix: "%", label: "BIS Certified" },
];

// ── Page ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  const canvasRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroCaptionRef = useRef(null);
  const heroSubRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    // Hero entrance
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      heroCaptionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
    )
      .fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out" },
        "-=0.3",
      )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5",
      );

    // Stats count-up
    const statData = [30, 5500, 10000, 100];
    statsRef.current.forEach((el, i) => {
      const valEl = el?.querySelector(".ap-stat-value");
      if (!valEl) return;
      const suffixes = ["+", " sq.ft", "+", "%"];
      const obj = { v: 0 };
      gsap.to(obj, {
        v: statData[i],
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate() {
          const v = Math.round(obj.v);
          valEl.textContent =
            (i === 2 && v >= 1000 ? Math.round(v / 1000) + "K" : v) +
            suffixes[i];
        },
      });
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }, []);

  return (
    <div className="ap-page">
      {/* Smoke cursor trail */}
      <CursorSmoke />
      {/* ── 3D canvas background ── */}
      <div className="ap-three-bg">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        <ThreeRings canvasRef={canvasRef} />
      </div>

      {/* ── Dark overlay ── */}
      <div className="ap-overlay" />

      {/* ── Header ── */}
      <Header dark />

      <div className="ap-content">
        {/* ═══ HERO ═══ */}
        <section className="ap-hero">
          <div className="ap-ornament-row">
            <span className="ap-line" />
            <span className="ap-diamond">◆</span>
            <span className="ap-line" />
          </div>
          <span ref={heroCaptionRef} className="ap-eyebrow">
            Est. 1994 · Solapur, Maharashtra
          </span>
          <h1 ref={heroTitleRef} className="ap-hero-title">
            A Legacy
            <br />
            <em>Forged in Gold</em>
          </h1>
          <p ref={heroSubRef} className="ap-hero-sub">
            Thirty years of mastery, one unbreakable promise — jewellery that
            moves through generations.
          </p>
          <div className="ap-scroll-hint">
            <span />
            <p>Scroll to explore</p>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="ap-stats-section">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="ap-stat"
              ref={(el) => (statsRef.current[i] = el)}
            >
              <span className="ap-stat-value">
                {s.value}
                {s.suffix}
              </span>
              <span className="ap-stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ═══ STORY ═══ */}
        <section className="ap-story-section">
          <div className="ap-section-header">
            <div className="ap-section-bar" />
            <h2>Our Story</h2>
          </div>
          <div className="ap-story-grid">
            <div className="ap-story-text">
              <p>
                When two of Pune's most trusted names — Kabane Jewellers
                and Giriraj Jewellers — chose to unite their three-decade
                heritage, Kabane Jewellers was born. More than a merger, it was
                the coming together of two philosophies: absolute purity and
                timeless design.
              </p>
              <p>
                Today, our 5500 sq.ft. flagship showroom in Chandan Nagar stands
                as a sanctuary for those who understand that jewellery is not
                merely ornament — it is memory, it is legacy, it is love made
                tangible.
              </p>
              <p>
                From the Maharashtrian bride seeking her nath and thushi, to the
                modern woman curating her everyday gold — every visitor walks
                out with something that feels as though it was made only for
                her.
              </p>
            </div>
            <div className="ap-story-quote">
              <div className="ap-quote-box">
                <span className="ap-quote-mark">"</span>
                <blockquote>
                  Gold is just the beginning. What we truly offer is the trust
                  of thirty years, the precision of master craftsmen, and the
                  warmth of a family that treats every customer as its own.
                </blockquote>
                <cite>— Founder, Sidramappa Somanappa Kabane</cite>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TIMELINE ═══ */}
        <section className="ap-timeline-section">
          <div className="ap-section-header">
            <div className="ap-section-bar" />
            <h2>Our Journey</h2>
          </div>
          <div className="ap-timeline">
            <div className="ap-timeline-spine" />
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} {...item} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ VALUES ═══ */}
        <section className="ap-values-section">
          <div className="ap-section-header">
            <div className="ap-section-bar" />
            <h2>What We Stand For</h2>
          </div>
          <div className="ap-values-grid">
            {values.map((v, i) => (
              <ValueCard key={v.title} {...v} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="ap-cta-section">
          <div className="ap-ornament-row">
            <span className="ap-line" />
            <span className="ap-diamond">◆</span>
            <span className="ap-line" />
          </div>
          <h2>Visit Our Showroom</h2>
          <p>Chandan Nagar, East Pune · Open 10 AM – 8:30 PM · Mon–Sun</p>
          <div className="ap-cta-actions">
            <Link to="/" className="ap-btn ap-btn-primary">
              Explore Collections
            </Link>
            <a href="tel:+919766810462" className="ap-btn ap-btn-outline">
              +91 9766810462
            </a>
          </div>
          <div className="ap-bottom-ornament">
            <span className="ap-line long" />
            <span className="ap-diamond small">◆</span>
            <span className="ap-line long" />
          </div>
        </section>
      </div>
    </div>
  );
}
