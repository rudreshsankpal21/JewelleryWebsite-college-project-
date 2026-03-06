import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import "../styles/Golddivider.css";

gsap.registerPlugin(ScrollTrigger);

// ── Gold material helper ──────────────────────────────────────────────
function createGoldMaterial(roughness = 0.25, metalness = 1.0) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d4af37"),
    emissive: new THREE.Color("#7a5c00"),
    emissiveIntensity: 0.18,
    roughness,
    metalness,
  });
}

export default function GoldDivider() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ── Text reveal on scroll ──
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => setVisible(true),
    });

    // ── Three.js setup ────────────────────────────────────────────────
    const canvas = canvasRef.current;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 7);

    // ── Lighting ──────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xfff5cc, 0.4);
    scene.add(ambient);

    // Key light — warm gold
    const keyLight = new THREE.DirectionalLight(0xffd060, 3.5);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill light — cool accent
    const fillLight = new THREE.DirectionalLight(0xffe8a0, 1.5);
    fillLight.position.set(-5, 2, 3);
    scene.add(fillLight);

    // Rim light — back highlight
    const rimLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    rimLight.position.set(0, -4, -4);
    scene.add(rimLight);

    // Point light — inner glow
    const pointLight = new THREE.PointLight(0xd4af37, 2.5, 12);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // ── Main jewel — Torus Knot ───────────────────────────────────────
    const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.38, 200, 32, 2, 3);
    const knotMat = createGoldMaterial(0.18, 1.0);
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.castShadow = true;
    scene.add(knot);

    // ── Outer ring ────────────────────────────────────────────────────
    const ringGeo = new THREE.TorusGeometry(2.1, 0.055, 24, 120);
    const ringMat = createGoldMaterial(0.3, 0.95);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    scene.add(ring);

    // Second ring — tilted
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.03, 16, 100),
      createGoldMaterial(0.4, 0.9),
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.z = Math.PI / 5;
    scene.add(ring2);

    // ── Floating diamond-like octahedrons (orbiting gems) ─────────────
    const gemGroup = new THREE.Group();
    const gemPositions = [
      [2.5, 0.4, 0],
      [-2.5, -0.4, 0],
      [0, 2.5, 0.3],
      [0, -2.5, -0.3],
      [1.8, -1.8, 0.5],
      [-1.8, 1.8, -0.5],
    ];

    gemPositions.forEach(([x, y, z]) => {
      const geo = new THREE.OctahedronGeometry(0.18, 0);
      const mat = createGoldMaterial(0.1, 1.0);
      mat.emissiveIntensity = 0.35;
      const gem = new THREE.Mesh(geo, mat);
      gem.position.set(x, y, z);
      gemGroup.add(gem);
    });
    scene.add(gemGroup);

    // ── Sparkle particles ─────────────────────────────────────────────
    const particleCount = 320;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── GSAP scroll-driven entrance ───────────────────────────────────
    const enterGroup = new THREE.Group();
    enterGroup.add(knot, ring, ring2, gemGroup);
    scene.add(enterGroup);
    // Remove individually added meshes (they're now in enterGroup)
    scene.remove(knot, ring, ring2, gemGroup);

    // Start invisible, animate in
    enterGroup.scale.set(0.01, 0.01, 0.01);
    gsap.to(enterGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.6,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    // ── Mouse parallax ────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Render loop ───────────────────────────────────────────────────
    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate main knot
      knot.rotation.x = t * 0.18;
      knot.rotation.y = t * 0.27;
      knot.rotation.z = t * 0.09;

      // Counter-rotate rings
      ring.rotation.y = t * 0.12;
      ring2.rotation.y = -t * 0.09;
      ring2.rotation.x = Math.PI / 3 + Math.sin(t * 0.3) * 0.1;

      // Orbit gems
      gemGroup.rotation.y = t * 0.22;
      gemGroup.rotation.x = t * 0.08;

      // Sparkles drift
      particles.rotation.y = t * 0.04;
      particles.rotation.x = t * 0.02;

      // Pulsing point light
      pointLight.intensity = 2.5 + Math.sin(t * 1.8) * 0.8;

      // Mouse parallax on whole scene
      enterGroup.rotation.y += (mouse.x * 0.4 - enterGroup.rotation.y) * 0.04;
      enterGroup.rotation.x += (mouse.y * 0.2 - enterGroup.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ────────────────────────────────────────────────
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ───────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      trigger.kill();
      renderer.dispose();
      knotGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
    };
  }, []);

  return (
    <section className="gold-divider-section" ref={sectionRef} data-cursor-invert>
      <canvas className="gold-canvas" ref={canvasRef} />

      <div
        className={`gold-divider-text ${visible ? "visible" : ""}`}
        ref={textRef}
      >
        <span className="eyebrow">Since 1994</span>
        <h2>
          Crafted in <em>Gold</em>,<br />
          Worn with Pride
        </h2>
        <div className="divider-line" />
      </div>

      <div className="gold-bottom-fade" />
    </section>
  );
}
