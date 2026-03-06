import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "../styles/Loader.css";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function scrambleTo(el, finalText, duration = 0.6) {
  const frames = Math.round(duration * 60);
  let f = 0;
  const raf = { id: null };
  const tick = () => {
    const resolved = Math.floor((f / frames) * finalText.length);
    let out = "";
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === " ") {
        out += " ";
        continue;
      }
      out +=
        i < resolved
          ? finalText[i]
          : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = out;
    f++;
    if (f <= frames) raf.id = requestAnimationFrame(tick);
    else el.textContent = finalText;
  };
  raf.id = requestAnimationFrame(tick);
}

export default function Loader({ onComplete }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const brandRef = useRef(null);
  const taglineRef = useRef(null);
  const barRef = useRef(null);
  const barFillRef = useRef(null);
  const countRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ── Three.js ────────────────────────────────────────────────────
    const canvas = canvasRef.current;
    const W = canvas.clientWidth,
      H = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 6;

    // Lights
    scene.add(new THREE.AmbientLight(0xfff5cc, 0.5));
    const key = new THREE.DirectionalLight(0xffd060, 4);
    key.position.set(4, 5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe8a0, 2);
    fill.position.set(-5, 2, 3);
    scene.add(fill);
    const rim = new THREE.PointLight(0xd4af37, 3, 15);
    rim.position.set(0, 0, 4);
    scene.add(rim);

    // Gold material
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#d4af37"),
      emissive: new THREE.Color("#7a5c00"),
      emissiveIntensity: 0.2,
      roughness: 0.15,
      metalness: 1.0,
    });

    // Main torus knot
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.0, 0.34, 200, 32, 2, 3),
      goldMat,
    );
    scene.add(knot);

    // Orbital ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.045, 24, 100),
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        roughness: 0.3,
        metalness: 0.95,
      }),
    );
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Particles
    const pCount = 260;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r = 2.4 + Math.random() * 2.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pPos[i * 3 + 2] = r * Math.cos(p);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0xd4af37,
        size: 0.035,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      }),
    );
    scene.add(particles);

    // Start tiny, spring-scale in
    knot.scale.set(0.01, 0.01, 0.01);
    ring.scale.set(0.01, 0.01, 0.01);
    gsap.to([knot.scale, ring.scale], {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.4,
      ease: "elastic.out(1, 0.5)",
      delay: 0.3,
    });

    // Render loop
    const clock = new THREE.Clock();
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.22;
      knot.rotation.y = t * 0.31;
      knot.rotation.z = t * 0.11;
      ring.rotation.y = t * 0.14;
      particles.rotation.y = t * 0.05;
      rim.intensity = 3 + Math.sin(t * 2) * 1;
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

    // ── UI timeline ─────────────────────────────────────────────────
    const tl = gsap.timeline();

    // Brand name scramble in
    tl.add(() => scrambleTo(brandRef.current, "KABANE JEWELLERS", 1.0), 0.6);

    // Tagline fade
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      1.2,
    );

    // Progress bar fill over 4.2s
    tl.fromTo(
      barFillRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 4.0,
        ease: "power1.inOut",
        transformOrigin: "left",
      },
      0.5,
    );

    // Counter 0 → 100
    const counter = { val: 0 };
    tl.to(
      counter,
      {
        val: 100,
        duration: 4.0,
        ease: "power1.inOut",
        onUpdate() {
          if (countRef.current) {
            countRef.current.textContent = Math.round(counter.val) + "%";
          }
        },
      },
      0.5,
    );

    // Exit: fade + scale up overlay at t=5s
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        scale: 1.04,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: onComplete,
      },
      4.8,
    );

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      tl.kill();
      renderer.dispose();
      pGeo.dispose();
    };
  }, [onComplete]);

  return (
    <div className="loader-overlay" ref={overlayRef}>
      <canvas className="loader-canvas" ref={canvasRef} />

      <div className="loader-ui">
        <p className="loader-brand" ref={brandRef}>
          &nbsp;
        </p>
        <p className="loader-tagline" ref={taglineRef}>
          Crafted in Gold · Worn with Pride
        </p>

        <div className="loader-bar-wrap" ref={barRef}>
          <div className="loader-bar-track">
            <div className="loader-bar-fill" ref={barFillRef} />
          </div>
          <span className="loader-count" ref={countRef}>
            0%
          </span>
        </div>
      </div>

      {/* Decorative corners */}
      <div className="loader-corner loader-corner--tl" />
      <div className="loader-corner loader-corner--tr" />
      <div className="loader-corner loader-corner--bl" />
      <div className="loader-corner loader-corner--br" />
    </div>
  );
}
