import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import "../styles/Contactpage.css";
import CursorSparkles from "../Components/Cursorsmoke";

function JewelScene({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.clientWidth,
      H = canvas.clientHeight;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 2.2, 7);
    camera.lookAt(0, 0, 0);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0xffe8cc, 0.5));
    const spot = new THREE.SpotLight(0xffd060, 8, 20, Math.PI / 6, 0.4, 1.5);
    spot.position.set(0, 8, 3);
    spot.castShadow = true;
    spot.shadow.mapSize.set(1024, 1024);
    scene.add(spot);
    const rimL = new THREE.PointLight(0x9a263d, 3, 12);
    rimL.position.set(-4, 1, 2);
    scene.add(rimL);
    const rimR = new THREE.PointLight(0xd4af37, 2.5, 10);
    rimR.position.set(4, 1, 2);
    scene.add(rimR);
    const bot = new THREE.PointLight(0xd4af37, 1.5, 8);
    bot.position.set(0, -3, 1);
    scene.add(bot);

    /* ── Velvet box base ── */
    const boxGeo = new THREE.BoxGeometry(4.2, 0.3, 3.0);
    const velvetMat = new THREE.MeshStandardMaterial({
      color: "#1a0a0a",
      roughness: 0.95,
      metalness: 0.0,
    });
    const boxBase = new THREE.Mesh(boxGeo, velvetMat);
    boxBase.position.y = -1.5;
    boxBase.receiveShadow = true;
    scene.add(boxBase);

    // Box walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: "#120606",
      roughness: 0.9,
      metalness: 0.05,
    });
    [
      { size: [4.2, 1.4, 0.08], pos: [0, -0.75, -1.46] },
      { size: [4.2, 1.4, 0.08], pos: [0, -0.75, 1.46] },
      { size: [0.08, 1.4, 3.0], pos: [-2.06, -0.75, 0] },
      { size: [0.08, 1.4, 3.0], pos: [2.06, -0.75, 0] },
    ].forEach(({ size, pos }) => {
      const w = new THREE.Mesh(new THREE.BoxGeometry(...size), wallMat);
      w.position.set(...pos);
      scene.add(w);
    });

    // Gold rim on box edges
    const rimMat = new THREE.MeshStandardMaterial({
      color: "#d4af37",
      roughness: 0.15,
      metalness: 1,
    });
    [
      { size: [4.4, 0.05, 0.05], pos: [0, -0.04, -1.46] },
      { size: [4.4, 0.05, 0.05], pos: [0, -0.04, 1.46] },
      { size: [0.05, 0.05, 3.1], pos: [-2.06, -0.04, 0] },
      { size: [0.05, 0.05, 3.1], pos: [2.06, -0.04, 0] },
    ].forEach(({ size, pos }) => {
      const r = new THREE.Mesh(new THREE.BoxGeometry(...size), rimMat);
      r.position.set(...pos);
      scene.add(r);
    });

    /* ── Box lid (hinged at back) ── */
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, -0.04, -1.46); // hinge point at back edge
    scene.add(lidGroup);

    const lidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.22, 3.0),
      new THREE.MeshStandardMaterial({
        color: "#1a0a0a",
        roughness: 0.92,
        metalness: 0,
      }),
    );
    lidMesh.position.set(0, 0, 1.5); // offset so lid rotates from back
    lidGroup.add(lidMesh);

    // Gold rim on lid
    const lidRim = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.05, 3.1),
      rimMat.clone(),
    );
    lidRim.position.set(0, 0.135, 1.5);
    lidGroup.add(lidRim);

    // Lid starts closed (rotX = 0), opens to ~-110deg
    lidGroup.rotation.x = 0;

    /* ── Main gem: custom faceted diamond ── */
    const gemGroup = new THREE.Group();
    gemGroup.position.set(0, -0.4, 0);
    gemGroup.scale.setScalar(0.01); // starts tiny, springs in
    scene.add(gemGroup);

    // Crown (top) - octahedron upper half stretched
    const crownGeo = new THREE.ConeGeometry(0.72, 0.7, 8);
    const gemMat = new THREE.MeshStandardMaterial({
      color: "#d4af37",
      emissive: "#7a5000",
      emissiveIntensity: 0.3,
      roughness: 0.03,
      metalness: 1.0,
      transparent: true,
      opacity: 0.92,
    });
    const crown = new THREE.Mesh(crownGeo, gemMat);
    crown.position.y = 0.35;
    gemGroup.add(crown);

    // Pavillion (bottom) - inverted cone
    const pavGeo = new THREE.ConeGeometry(0.72, 1.0, 8);
    const pav = new THREE.Mesh(pavGeo, gemMat.clone());
    pav.rotation.z = Math.PI;
    pav.position.y = -0.5;
    gemGroup.add(pav);

    // Table (top flat face highlight)
    const tableGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 8);
    const tableMat = new THREE.MeshStandardMaterial({
      color: "#fff8dc",
      emissive: "#d4af37",
      emissiveIntensity: 0.6,
      roughness: 0.0,
      metalness: 1,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = 0.72;
    gemGroup.add(table);

    // Girdle ring
    const girdleGeo = new THREE.TorusGeometry(0.72, 0.03, 8, 8);
    const girdleMat = new THREE.MeshStandardMaterial({
      color: "#f5e6b8",
      roughness: 0.05,
      metalness: 1,
    });
    const girdle = new THREE.Mesh(girdleGeo, girdleMat);
    girdle.position.y = 0;
    girdle.rotation.x = Math.PI / 2;
    gemGroup.add(girdle);

    // Facet highlight planes — 8 around the crown
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const facetGeo = new THREE.PlaneGeometry(0.28, 0.28);
      const facetMat = new THREE.MeshStandardMaterial({
        color: "#fff5cc",
        emissive: "#d4af37",
        emissiveIntensity: 0.15 + Math.random() * 0.25,
        roughness: 0.0,
        metalness: 1,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const facet = new THREE.Mesh(facetGeo, facetMat);
      facet.position.set(Math.cos(angle) * 0.42, 0.42, Math.sin(angle) * 0.42);
      facet.rotation.y = -angle;
      facet.rotation.x = 0.5;
      gemGroup.add(facet);
    }

    // Gem stand — thin gold pin
    const pinGeo = new THREE.CylinderGeometry(0.025, 0.04, 0.6, 8);
    const pin = new THREE.Mesh(pinGeo, rimMat.clone());
    pin.position.set(0, -1.0, 0);
    pin.castShadow = true;
    gemGroup.add(pin);
    const baseGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.06, 16);
    const base = new THREE.Mesh(baseGeo, rimMat.clone());
    base.position.set(0, -1.28, 0);
    gemGroup.add(base);

    /* ── Surrounding small gems ── */
    const smallGems = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sg = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.14, 0),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? "#d4af37" : "#9a263d",
          emissive: i % 2 === 0 ? "#5a3000" : "#3a0010",
          emissiveIntensity: 0.4,
          roughness: 0.04,
          metalness: 1,
        }),
      );
      sg.position.set(
        Math.cos(a) * 1.4,
        -0.35 + Math.sin(a * 2) * 0.08,
        Math.sin(a) * 1.4,
      );
      sg.scale.setScalar(0.01);
      scene.add(sg);
      smallGems.push({
        mesh: sg,
        angle: a,
        baseY: -0.35 + Math.sin(a * 2) * 0.08,
      });
    }

    /* ── Light scatter effect: thin lines from gem ── */
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(a) * 1.8,
          0.3 + Math.random() * 0.4,
          Math.sin(a) * 1.8,
        ),
      ];
      const lg = new THREE.BufferGeometry().setFromPoints(points);
      const lm = new THREE.LineBasicMaterial({
        color: "#d4af37",
        transparent: true,
        opacity: 0.08 + Math.random() * 0.1,
      });
      scene.add(new THREE.Line(lg, lm));
    }

    /* ── GSAP opening sequence ── */
    // 1. lid opens
    gsap.to(lidGroup.rotation, {
      x: -1.95,
      duration: 1.8,
      ease: "power3.inOut",
      delay: 0.4,
    });
    // 2. gem springs up & scales in
    gsap.to(gemGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.4,
      ease: "elastic.out(1,0.5)",
      delay: 1.2,
    });
    // 3. small gems pop in
    smallGems.forEach((sg, i) => {
      gsap.to(sg.mesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: "elastic.out(1,0.6)",
        delay: 1.6 + i * 0.09,
      });
    });

    /* ── Mouse parallax ── */
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    /* ── Animate ── */
    const clock = new THREE.Clock();
    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      gemGroup.rotation.y = t * 0.45;
      gemGroup.position.y = -0.4 + Math.sin(t * 1.1) * 0.08;

      smallGems.forEach((sg) => {
        sg.angle += 0.005;
        sg.mesh.position.set(
          Math.cos(sg.angle) * 1.4,
          sg.baseY + Math.sin(t * 1.2) * 0.06,
          Math.sin(sg.angle) * 1.4,
        );
        sg.mesh.rotation.y = t * 1.5;
      });

      rimL.intensity = 3 + Math.sin(t * 2.1) * 1;
      rimR.intensity = 2.5 + Math.sin(t * 1.7 + 1) * 0.8;

      // Camera orbit follows mouse gently
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (2.2 + mouse.y * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(0, -0.2, 0);

      renderer.render(scene, camera);
    };
    tick();

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
    };
  }, []);
  return null;
}

/* ─── Magnetic Input Field ─────────────────────────────────────────── */
function Field({
  label,
  type = "text",
  name,
  placeholder,
  textarea = false,
  required = false,
  value,
  onChange,
}) {
  const wrapRef = useRef(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      ref={wrapRef}
      className={`cp-field ${focused || value ? "cp-field--active" : ""}`}
    >
      <label className="cp-label">
        {label}
        {required && <em>*</em>}
      </label>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={5}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="cp-input cp-textarea"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="cp-input"
        />
      )}
      <span className="cp-field-line" />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function ContactPage() {
  const canvasRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const titleRef = useRef(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  // Force body dark
  useEffect(() => {
    document.body.style.background = "#060402";
    document.body.style.backgroundColor = "#060402";
    const root = document.getElementById("root");
    if (root) root.style.background = "#060402";
    return () => {
      document.body.style.background = "";
      if (root) root.style.background = "";
    };
  }, []);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1, ease: "expo.out" },
    )
      .fromTo(
        rightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: "expo.out" },
        "-=0.9",
      )
      .fromTo(
        titleRef.current?.children ? [...titleRef.current.children] : [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
        "-=0.7",
      );
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate send
    gsap.to(".cp-submit-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });
    setTimeout(() => setSent(true), 400);
  };

  return (
    <div className="cp-page">
      {/* Body bg hack */}
      <style>{`html:has(.cp-page),body:has(.cp-page){background:#060402!important}`}</style>

      <Header dark />
      <CursorSparkles />

      <div className="cp-layout">
        {/* ── LEFT: 3D JEWEL ── */}
        <div ref={leftRef} className="cp-left">
          <div className="cp-canvas-wrap">
            <canvas ref={canvasRef} className="cp-canvas" />
            <JewelScene canvasRef={canvasRef} />
          </div>

          {/* Info cards below the 3D */}
          <div className="cp-info-cards">
            {[
              {
                icon: "◎",
                label: "Visit Us",
                val: "Purva Mangalvar Peth, Varad Bol , Solapur – 413   014",
              },
              { icon: "◈", label: "Call Us", val: "+91 97668 10462" },
              { icon: "◇", label: "Open Hours", val: "Mon–Sat · 10am – 8pm" },
            ].map((c) => (
              <div key={c.label} className="cp-info-card">
                <span className="cp-info-icon">{c.icon}</span>
                <div>
                  <p className="cp-info-label">{c.label}</p>
                  <p className="cp-info-val">{c.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: FORM ── */}
        <div ref={rightRef} className="cp-right">
          <div className="cp-form-wrap">
            <div ref={titleRef} className="cp-form-head">
              <span className="cp-eyebrow">◆ &nbsp; Get In Touch</span>
              <h1 className="cp-form-title">
                Begin Your
                <br />
                <em>Journey</em>
              </h1>
              <p className="cp-form-sub">
                Tell us what you're looking for — we'll craft an experience as
                exceptional as the jewellery itself.
              </p>
            </div>

            {!sent ? (
              <form className="cp-form" onSubmit={handleSubmit} noValidate>
                <div className="cp-row">
                  <Field
                    label="Full Name"
                    name="name"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                  <Field
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="cp-row">
                  <Field
                    label="Phone"
                    type="tel"
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <div className="cp-field">
                    <label className="cp-label">Interest</label>
                    <select
                      name="interest"
                      className="cp-input cp-select"
                      value={form.interest}
                      onChange={handleChange}
                    >
                      <option value="">Select category…</option>
                      {[
                        "Mangalsutras",
                        "Bangles",
                        "Earrings",
                        "Rings",
                        "Necklaces",
                        "Pendants",
                        "Custom / Bridal",
                      ].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <span className="cp-field-line" />
                  </div>
                </div>
                <Field
                  label="Message"
                  name="message"
                  placeholder="Describe your dream piece…"
                  textarea
                  required
                  value={form.message}
                  onChange={handleChange}
                />

                <button type="submit" className="cp-submit-btn">
                  <span className="cp-btn-text">Send Enquiry</span>
                  <span className="cp-btn-arrow">◆</span>
                  <span className="cp-btn-shimmer" />
                </button>
              </form>
            ) : (
              <div className="cp-success">
                <div className="cp-success-gem">◆</div>
                <h2>Thank you, {form.name || "friend"}</h2>
                <p>
                  We've received your message and will reach out within 24
                  hours.
                </p>
                <Link to="/" className="cp-back-btn">
                  ← Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
