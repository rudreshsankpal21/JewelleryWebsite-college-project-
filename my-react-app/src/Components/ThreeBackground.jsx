import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // ── Scene ──────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#060402");
    scene.fog = new THREE.FogExp2("#060402", 0.055);

    // ── Camera ─────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    // ── Renderer ───────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── Materials ──────────────────────────────────────────────────────
    const goldMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#c8a800"),
      specular: new THREE.Color("#fffce0"),
      shininess: 280,
      emissive: new THREE.Color("#5a4400"),
      emissiveIntensity: 0.25,
    });

    const goldWireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#d4af37"),
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    const platinumMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#dcdcdc"),
      specular: new THREE.Color("#ffffff"),
      shininess: 350,
      emissive: new THREE.Color("#303030"),
      emissiveIntensity: 0.12,
    });

    const gemMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#d4af37"),
      specular: new THREE.Color("#ffffff"),
      shininess: 500,
      emissive: new THREE.Color("#7a5f00"),
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.92,
    });

    const gemWireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f5e6b8"),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    // ── Main Gold Ring ─────────────────────────────────────────────────
    const mainRingGeo = new THREE.TorusGeometry(2.2, 0.28, 48, 160);
    const mainRing = new THREE.Mesh(mainRingGeo, goldMat);
    mainRing.rotation.x = Math.PI / 4;
    mainRing.rotation.z = Math.PI / 8;
    mainRing.castShadow = true;
    scene.add(mainRing);

    // Wireframe overlay on main ring
    const mainRingWireGeo = new THREE.TorusGeometry(2.2, 0.285, 12, 80);
    const mainRingWire = new THREE.Mesh(mainRingWireGeo, goldWireMat);
    mainRingWire.rotation.copy(mainRing.rotation);
    scene.add(mainRingWire);

    // ── Inner Platinum Ring ────────────────────────────────────────────
    const innerRingGeo = new THREE.TorusGeometry(1.1, 0.1, 24, 100);
    const innerRing = new THREE.Mesh(innerRingGeo, platinumMat);
    innerRing.rotation.x = -Math.PI / 5;
    innerRing.rotation.y = Math.PI / 7;
    scene.add(innerRing);

    // ── Central Diamond Gem ────────────────────────────────────────────
    const gemGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const gem = new THREE.Mesh(gemGeo, gemMat);
    scene.add(gem);

    const gemWireGeo = new THREE.IcosahedronGeometry(0.57, 1);
    const gemWire = new THREE.Mesh(gemWireGeo, gemWireMat);
    scene.add(gemWire);

    // ── Orbiting Gem Satellites ────────────────────────────────────────
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const satelliteData = [
      { radius: 3.2, speed: 0.38, phase: 0, size: 0.2, tilt: 0.3 },
      { radius: 3.8, speed: 0.25, phase: 2.1, size: 0.14, tilt: -0.5 },
      { radius: 2.8, speed: 0.5, phase: 4.2, size: 0.16, tilt: 0.8 },
      { radius: 4.2, speed: 0.18, phase: 1.0, size: 0.11, tilt: -0.2 },
      { radius: 3.5, speed: 0.32, phase: 3.3, size: 0.13, tilt: 1.1 },
    ];

    const satellites = satelliteData.map(({ size }) => {
      const geo = new THREE.IcosahedronGeometry(size, 0);
      const mesh = new THREE.Mesh(geo, goldMat);
      orbitGroup.add(mesh);
      return mesh;
    });

    // ── Torus Knot accent ──────────────────────────────────────────────
    const knotGeo = new THREE.TorusKnotGeometry(0.4, 0.08, 80, 12, 2, 3);
    const knot = new THREE.Mesh(knotGeo, platinumMat);
    knot.position.set(3.5, 1.5, -2);
    scene.add(knot);

    // ── Particle System ────────────────────────────────────────────────
    const particleCount = 700;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const r = 6 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 0.04 + 0.01;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: "#d4af37",
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Close-in sparkles (brighter, smaller cluster)
    const sparkCount = 120;
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      const r = 2.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sparkPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sparkPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sparkPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: "#f5e6b8",
      size: 0.055,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkles);

    // ── Lights ─────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight("#180f00", 1.2);
    scene.add(ambient);

    const goldLight = new THREE.PointLight("#d4af37", 5, 25);
    goldLight.position.set(5, 4, 5);
    scene.add(goldLight);

    const rimLight = new THREE.PointLight("#7090c8", 3, 20);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const topLight = new THREE.PointLight("#f5e6b8", 2.5, 18);
    topLight.position.set(0, 7, 3);
    scene.add(topLight);

    const fillLight = new THREE.PointLight("#8a5500", 1.5, 15);
    fillLight.position.set(-3, 1, 5);
    scene.add(fillLight);

    // ── Mouse parallax ─────────────────────────────────────────────────
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2.5;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2.5;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // ── Animation loop ─────────────────────────────────────────────────
    const animId = { current: null };
    const clock = new THREE.Clock();

    const animate = () => {
      animId.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Main ring rotation — slow, majestic precession
      mainRing.rotation.z = t * 0.12;
      mainRing.rotation.y = Math.sin(t * 0.08) * 0.4;
      mainRingWire.rotation.copy(mainRing.rotation);

      // Inner ring counter-rotation
      innerRing.rotation.z = -t * 0.18;
      innerRing.rotation.x = -Math.PI / 5 + Math.sin(t * 0.1) * 0.2;

      // Central gem spin
      gem.rotation.x = t * 0.25;
      gem.rotation.y = t * 0.35;
      gemWire.rotation.x = t * 0.18;
      gemWire.rotation.y = -t * 0.28;

      // Satellites orbit
      satellites.forEach((sat, i) => {
        const d = satelliteData[i];
        const angle = t * d.speed + d.phase;
        sat.position.x = Math.cos(angle) * d.radius;
        sat.position.y = Math.sin(angle * 0.7) * d.radius * 0.4 + d.tilt;
        sat.position.z = Math.sin(angle) * d.radius * 0.5;
        sat.rotation.x = t * 0.4 + i;
        sat.rotation.y = t * 0.3;
      });

      // Torus knot spin
      knot.rotation.x = t * 0.3;
      knot.rotation.y = t * 0.2;
      knot.position.y = 1.5 + Math.sin(t * 0.4) * 0.5;

      // Particles slow drift
      particles.rotation.y = t * 0.018;
      particles.rotation.x = t * 0.009;

      sparkles.rotation.y = -t * 0.025;
      sparkles.rotation.z = t * 0.012;

      // Pulsing gold light
      goldLight.intensity = 4.5 + Math.sin(t * 1.8) * 1.2;

      // Mouse parallax smooth follow
      currentMouseX += (targetMouseX - currentMouseX) * 0.03;
      currentMouseY += (targetMouseY - currentMouseY) * 0.03;
      camera.position.x = currentMouseX * 1.2;
      camera.position.y = -currentMouseY * 0.8;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ─────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup ────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-bg" />;
};

export default ThreeBackground;
