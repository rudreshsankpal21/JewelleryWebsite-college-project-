import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import CursorSmoke from "../Components/Cursorsmoke";
import "../styles/Productspage.css";

gsap.registerPlugin(ScrollTrigger);

const U = (id, w = 600, h = 750) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=88`;

/* ── DATA ─────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "mangalsutras",
    num: "01",
    title: "Mangalsutras",
    sub: "Sacred bonds forged in gold & tradition",
    hero: U("1601821765780-754fa98637c1", 1400, 700),
    products: [
      {
        id: 1,
        name: "Vaibhav Tanmani",
        karat: "22K",
        weight: "5.2g",
        price: "₹32,500",
        tag: "Bestseller",
        img: U("1601821765780-754fa98637c1"),
      },
      {
        id: 2,
        name: "Classic Kolhapuri Sutra",
        karat: "22K",
        weight: "7.8g",
        price: "₹49,200",
        tag: "Traditional",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 3,
        name: "Diamond Pendant Sutra",
        karat: "18K",
        weight: "3.9g",
        price: "₹68,000",
        tag: "Diamond",
        img: U("1599643478518-a784e5dc4c8f"),
      },
      {
        id: 4,
        name: "Veni Gold Mangalsutra",
        karat: "22K",
        weight: "6.4g",
        price: "₹40,100",
        img: U("1603561596112-0a132b757442"),
      },
      {
        id: 5,
        name: "Panchpatti Sutra",
        karat: "22K",
        weight: "9.0g",
        price: "₹57,500",
        tag: "New",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 6,
        name: "Lakshmi Pearl Sutra",
        karat: "22K",
        weight: "5.8g",
        price: "₹37,200",
        img: U("1586158291851-0cce1ad5ab0e"),
      },
      {
        id: 7,
        name: "Black Bead Rani Sutra",
        karat: "22K",
        weight: "4.3g",
        price: "₹27,400",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 8,
        name: "Diamond Pavé Sutra",
        karat: "18K",
        weight: "4.1g",
        price: "₹88,500",
        tag: "Diamond",
        img: U("1601821765780-754fa98637c1"),
      },
      {
        id: 9,
        name: "Narayani Gold Sutra",
        karat: "22K",
        weight: "7.2g",
        price: "₹45,800",
        img: U("1599643478518-a784e5dc4c8f"),
      },
      {
        id: 10,
        name: "Bridal Haar Sutra",
        karat: "22K",
        weight: "12.4g",
        price: "₹78,600",
        tag: "Bridal",
        img: U("1603561596112-0a132b757442"),
      },
    ],
  },
  {
    id: "bangles",
    num: "02",
    title: "Bangles",
    sub: "The rhythm of gold echoing at your wrist",
    hero: U("1611652022419-a9419f74343d", 1400, 700),
    products: [
      {
        id: 11,
        name: "Paisley Kangan Pair",
        karat: "22K",
        weight: "18.4g",
        price: "₹1,16,000",
        tag: "Bridal",
        img: U("1611652022419-a9419f74343d"),
      },
      {
        id: 12,
        name: "Plain Pola Set of 4",
        karat: "22K",
        weight: "12.0g",
        price: "₹75,800",
        tag: "Set of 4",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 13,
        name: "Diamond Bangle Duo",
        karat: "18K",
        weight: "9.8g",
        price: "₹1,48,000",
        tag: "Diamond",
        img: U("1611652022419-a9419f74343d"),
      },
      {
        id: 14,
        name: "Filigree Kangan",
        karat: "22K",
        weight: "14.2g",
        price: "₹89,900",
        img: U("1586158291851-0cce1ad5ab0e"),
      },
      {
        id: 15,
        name: "Antique Chooda Set",
        karat: "22K",
        weight: "22.0g",
        price: "₹1,39,500",
        tag: "Bridal",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 16,
        name: "Meenakari Enamel Bangle",
        karat: "22K",
        weight: "11.6g",
        price: "₹73,200",
        tag: "Enamel",
        img: U("1611652022419-a9419f74343d"),
      },
      {
        id: 17,
        name: "Broad Temple Kangan",
        karat: "22K",
        weight: "16.8g",
        price: "₹1,06,400",
        img: U("1586158291851-0cce1ad5ab0e"),
      },
      {
        id: 18,
        name: "Twisted Rope Bangle",
        karat: "22K",
        weight: "8.4g",
        price: "₹52,900",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 19,
        name: "Half-Diamond Kangan",
        karat: "18K",
        weight: "10.2g",
        price: "₹1,22,000",
        tag: "Diamond",
        img: U("1611652022419-a9419f74343d"),
      },
      {
        id: 20,
        name: "Daily Wear Bangle",
        karat: "22K",
        weight: "4.6g",
        price: "₹29,100",
        tag: "Everyday",
        img: U("1586158291851-0cce1ad5ab0e"),
      },
    ],
  },
  {
    id: "earrings",
    num: "03",
    title: "Earrings",
    sub: "Light‑catching gold — frame your face in radiance",
    hero: U("1535632066927-ab7c9ab60908", 1400, 700),
    products: [
      {
        id: 21,
        name: "Jhumka Chandelier",
        karat: "22K",
        weight: "7.4g",
        price: "₹46,800",
        tag: "Bestseller",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 22,
        name: "Diamond Tops",
        karat: "18K",
        weight: "2.1g",
        price: "₹58,500",
        tag: "Diamond",
        img: U("1596944924616-7b38e7cfac36"),
      },
      {
        id: 23,
        name: "Rani Haar Drop Earrings",
        karat: "22K",
        weight: "9.8g",
        price: "₹62,000",
        tag: "Bridal",
        img: U("1588444650733-d0c9b9c01e59"),
      },
      {
        id: 24,
        name: "Pearl Jhumki",
        karat: "22K",
        weight: "6.2g",
        price: "₹39,400",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 25,
        name: "Lotus Stud Earrings",
        karat: "22K",
        weight: "3.8g",
        price: "₹24,100",
        img: U("1596944924616-7b38e7cfac36"),
      },
      {
        id: 26,
        name: "Chandbali Hoops",
        karat: "22K",
        weight: "8.6g",
        price: "₹54,600",
        tag: "Traditional",
        img: U("1588444650733-d0c9b9c01e59"),
      },
      {
        id: 27,
        name: "Solitaire Diamond Drops",
        karat: "18K",
        weight: "2.8g",
        price: "₹76,200",
        tag: "Diamond",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 28,
        name: "Peacock Jhumka",
        karat: "22K",
        weight: "10.2g",
        price: "₹64,500",
        tag: "Bridal",
        img: U("1596944924616-7b38e7cfac36"),
      },
      {
        id: 29,
        name: "Bali Hoop Earrings",
        karat: "22K",
        weight: "4.4g",
        price: "₹27,900",
        img: U("1588444650733-d0c9b9c01e59"),
      },
      {
        id: 30,
        name: "Long Tassel Earrings",
        karat: "22K",
        weight: "11.0g",
        price: "₹69,800",
        tag: "New",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 31,
        name: "Rose Gold Studs",
        karat: "14K",
        weight: "2.2g",
        price: "₹18,500",
        tag: "Everyday",
        img: U("1596944924616-7b38e7cfac36"),
      },
    ],
  },
  {
    id: "rings",
    num: "04",
    title: "Rings",
    sub: "Every finger a story — every stone a promise",
    hero: U("1605100804763-247f67b3557e", 1400, 700),
    products: [
      {
        id: 32,
        name: "Solitaire Diamond Ring",
        karat: "18K",
        weight: "3.2g",
        price: "₹1,24,000",
        tag: "Diamond",
        img: U("1605100804763-247f67b3557e"),
      },
      {
        id: 33,
        name: "Floral Gold Band",
        karat: "22K",
        weight: "4.8g",
        price: "₹30,400",
        img: U("1515562141207-7a88fb7ce338"),
      },
      {
        id: 34,
        name: "Eternity Band",
        karat: "18K",
        weight: "3.6g",
        price: "₹98,000",
        tag: "Diamond",
        img: U("1610694955574-d3d22f7e9cc6"),
      },
      {
        id: 35,
        name: "Maharashtrian Anguthi",
        karat: "22K",
        weight: "5.4g",
        price: "₹34,200",
        tag: "Traditional",
        img: U("1605100804763-247f67b3557e"),
      },
      {
        id: 36,
        name: "Rose Gold Halo Ring",
        karat: "14K",
        weight: "3.9g",
        price: "₹72,500",
        tag: "Diamond",
        img: U("1515562141207-7a88fb7ce338"),
      },
      {
        id: 37,
        name: "Twisted Vine Ring",
        karat: "22K",
        weight: "4.2g",
        price: "₹26,700",
        img: U("1610694955574-d3d22f7e9cc6"),
      },
      {
        id: 38,
        name: "Cocktail Gemstone Ring",
        karat: "18K",
        weight: "6.8g",
        price: "₹1,56,000",
        tag: "Bestseller",
        img: U("1605100804763-247f67b3557e"),
      },
      {
        id: 39,
        name: "Plain Sadé Band",
        karat: "22K",
        weight: "3.0g",
        price: "₹19,000",
        tag: "Everyday",
        img: U("1515562141207-7a88fb7ce338"),
      },
      {
        id: 40,
        name: "Meenakari Statement Ring",
        karat: "22K",
        weight: "7.2g",
        price: "₹45,600",
        tag: "New",
        img: U("1610694955574-d3d22f7e9cc6"),
      },
      {
        id: 41,
        name: "Antique Nakshi Ring",
        karat: "22K",
        weight: "5.8g",
        price: "₹36,800",
        img: U("1605100804763-247f67b3557e"),
      },
    ],
  },
  {
    id: "necklaces",
    num: "05",
    title: "Necklaces",
    sub: "The centrepiece of your bridal ensemble",
    hero: U("1599643478518-a784e5dc4c8f", 1400, 700),
    products: [
      {
        id: 42,
        name: "Rani Haar Bridal Set",
        karat: "22K",
        weight: "48.2g",
        price: "₹3,04,000",
        tag: "Bridal",
        img: U("1599643478518-a784e5dc4c8f"),
      },
      {
        id: 43,
        name: "Diamond Rivière",
        karat: "18K",
        weight: "12.4g",
        price: "₹2,84,000",
        tag: "Diamond",
        img: U("1603561596112-0a132b757442"),
      },
      {
        id: 44,
        name: "Layered Thushi",
        karat: "22K",
        weight: "22.6g",
        price: "₹1,42,800",
        tag: "Traditional",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 45,
        name: "Mangal Pohe Necklace",
        karat: "22K",
        weight: "18.8g",
        price: "₹1,18,600",
        img: U("1599643478518-a784e5dc4c8f"),
      },
      {
        id: 46,
        name: "Simple Gold Chain",
        karat: "22K",
        weight: "6.2g",
        price: "₹39,200",
        tag: "Everyday",
        img: U("1603561596112-0a132b757442"),
      },
      {
        id: 47,
        name: "Peacock Pendant Haar",
        karat: "22K",
        weight: "28.4g",
        price: "₹1,79,400",
        tag: "Bestseller",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 48,
        name: "Temple Lakshmi Necklace",
        karat: "22K",
        weight: "32.0g",
        price: "₹2,01,600",
        tag: "Traditional",
        img: U("1599643478518-a784e5dc4c8f"),
      },
      {
        id: 49,
        name: "Polki Diamond Haar",
        karat: "22K",
        weight: "36.4g",
        price: "₹2,56,000",
        tag: "Diamond",
        img: U("1603561596112-0a132b757442"),
      },
    ],
  },
  {
    id: "pendants",
    num: "06",
    title: "Pendants",
    sub: "Wear what moves your soul — close to your heart",
    hero: U("1601821765780-754fa98637c1", 1400, 700),
    products: [
      {
        id: 50,
        name: "Ganesh Gold Pendant",
        karat: "22K",
        weight: "3.4g",
        price: "₹21,500",
        tag: "Devotional",
        img: U("1601821765780-754fa98637c1"),
      },
      {
        id: 51,
        name: "Diamond Heart Pendant",
        karat: "18K",
        weight: "2.8g",
        price: "₹64,800",
        tag: "Diamond",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 52,
        name: "Om Pendant Large",
        karat: "22K",
        weight: "4.6g",
        price: "₹29,100",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 53,
        name: "Evil Eye Pendant",
        karat: "18K",
        weight: "2.2g",
        price: "₹38,500",
        tag: "New",
        img: U("1601821765780-754fa98637c1"),
      },
      {
        id: 54,
        name: "Laxmi Coin Pendant",
        karat: "22K",
        weight: "5.0g",
        price: "₹31,700",
        tag: "Devotional",
        img: U("1535632066927-ab7c9ab60908"),
      },
      {
        id: 55,
        name: "Star Diamond Pendant",
        karat: "18K",
        weight: "2.4g",
        price: "₹52,200",
        tag: "Diamond",
        img: U("1573408301185-9521ef7d5d7f"),
      },
      {
        id: 56,
        name: "Feather Delicate Pendant",
        karat: "14K",
        weight: "1.8g",
        price: "₹14,900",
        tag: "Everyday",
        img: U("1601821765780-754fa98637c1"),
      },
      {
        id: 57,
        name: "Lotus Bloom Pendant",
        karat: "22K",
        weight: "3.2g",
        price: "₹20,300",
        img: U("1535632066927-ab7c9ab60908"),
      },
    ],
  },
];

/* ── 3D SCENE ─────────────────────────────────────────────────────────── */
function ThreeBg({ canvasRef }) {
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
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 10;

    scene.add(new THREE.AmbientLight(0xfff0cc, 0.3));
    const key = new THREE.DirectionalLight(0xffd060, 4);
    key.position.set(5, 8, 5);
    scene.add(key);
    const pt = new THREE.PointLight(0xd4af37, 4, 20);
    pt.position.set(0, 0, 7);
    scene.add(pt);
    const rim = new THREE.PointLight(0x9a263d, 1.5, 14);
    rim.position.set(-5, -3, 4);
    scene.add(rim);

    const goldMat = (r = 0.14) =>
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        emissive: "#4a2e00",
        emissiveIntensity: 0.2,
        roughness: r,
        metalness: 1,
      });

    const rings = [];
    [
      [3.0, 0.048, 0.4, 0.3, 0.1, 0.065, 0, 0, 0],
      [2.0, 0.038, 1.1, 0.8, 0.35, -0.1, 1.2, 0.4, 0],
      [3.6, 0.026, 0.15, 1.4, 0.7, 0.05, -1.2, 0, 0.4],
      [1.5, 0.044, 0.8, 0.2, 1.0, -0.08, 0, -0.9, 0],
      [2.3, 0.032, 0.5, 1.6, 0.25, 0.06, 0.6, 0.3, -0.4],
      [1.1, 0.055, 1.3, 0.4, 0.8, -0.11, -0.4, 0.5, 0.2],
    ].forEach(([r, t, rx, ry, rz, spd, ox, oy, oz]) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, t, 20, 160),
        goldMat(0.1 + Math.random() * 0.22),
      );
      m.rotation.set(rx, ry, rz);
      m.position.set(ox, oy, oz);
      m.userData.speed = spd;
      m.scale.setScalar(0.01);
      scene.add(m);
      rings.push(m);
    });

    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.MeshStandardMaterial({
        color: "#d4af37",
        emissive: "#7a5c00",
        emissiveIntensity: 0.5,
        roughness: 0.03,
        metalness: 1,
      }),
    );
    gem.scale.setScalar(0.01);
    scene.add(gem);

    const orbiters = [];
    [
      [6, 2.5, 0.2, 0.004, 0],
      [4, 1.5, 0.15, -0.007, 0.4],
    ].forEach(([count, radius, size, spd, tilt], ring) => {
      const mat =
        ring === 0
          ? new THREE.MeshStandardMaterial({
              color: "#9a263d",
              emissive: "#3a0010",
              emissiveIntensity: 0.4,
              roughness: 0.08,
              metalness: 0.95,
            })
          : goldMat(0.1);
      for (let i = 0; i < count; i++) {
        const o = new THREE.Mesh(new THREE.OctahedronGeometry(size, 0), mat);
        o.scale.setScalar(0.01);
        o.userData = {
          angle: (i / count) * Math.PI * 2,
          radius,
          speed: spd,
          tilt,
        };
        scene.add(o);
        orbiters.push(o);
      }
    });

    const pN = 500,
      pPos = new Float32Array(pN * 3),
      pCol = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) {
      const r = 5 + Math.random() * 6,
        t = Math.random() * Math.PI * 2,
        p = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pPos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pPos[i * 3 + 2] = r * Math.cos(p);
      const g = Math.random() > 0.28;
      pCol[i * 3] = g ? 0.83 : 0.6;
      pCol[i * 3 + 1] = g ? 0.69 : 0.15;
      pCol[i * 3 + 2] = g ? 0.21 : 0.24;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const parts = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
      }),
    );
    scene.add(parts);

    const all = [...rings, gem, ...orbiters];
    gsap.to(
      all.map((m) => m.scale),
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 2.6,
        ease: "elastic.out(1,0.4)",
        stagger: 0.07,
        delay: 0.3,
      },
    );

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const clock = new THREE.Clock();
    let rafId;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      rings.forEach((r) => {
        r.rotation.y += r.userData.speed * 0.013;
        r.rotation.x += r.userData.speed * 0.008;
      });
      gem.rotation.y = t * 0.28;
      gem.rotation.x = Math.sin(t * 0.35) * 0.25;
      orbiters.forEach((o) => {
        o.userData.angle += o.userData.speed;
        const a = o.userData.angle,
          tl = o.userData.tilt;
        o.position.set(
          Math.cos(a) * o.userData.radius,
          Math.sin(a) * o.userData.radius * Math.cos(tl),
          Math.sin(a) * o.userData.radius * Math.sin(tl),
        );
        o.rotation.y = t * 1.1;
      });
      pt.intensity = 4 + Math.sin(t * 1.9) * 1.1;
      rim.intensity = 1.5 + Math.sin(t * 1.3 + 1) * 0.5;
      parts.rotation.y = t * 0.02;
      scene.rotation.y += (mouse.x * 0.28 - scene.rotation.y) * 0.036;
      scene.rotation.x += (mouse.y * 0.16 - scene.rotation.x) * 0.036;
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
      pGeo.dispose();
    };
  }, []);
  return null;
}

/* ── 3D TILT CARD ─────────────────────────────────────────────────────── */
function TiltCard({ product }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    gsap.to(el, {
      rotateX: rx,
      rotateY: ry,
      transformPerspective: 800,
      scale: 1.04,
      duration: 0.35,
      ease: "power2.out",
    });
    // Move shine based on cursor
    const shine = el.querySelector(".tc-shine");
    if (shine) {
      const sx = ((e.clientX - rect.left) / rect.width) * 100;
      const sy = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
    }
  }, []);

  const onLeave = useCallback(() => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.6)",
    });
    const shine = ref.current?.querySelector(".tc-shine");
    if (shine) shine.style.background = "none";
  }, []);

  return (
    <Link
      to={`/product/${product.id}`}
      state={{ product }}
      className="tc-card"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {product.tag && <span className="tc-tag">{product.tag}</span>}
      <div className="tc-img-wrap">
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&h=750&q=80";
          }}
        />
        <div className="tc-shine" />
        <div className="tc-reveal">
          <span>
            {product.karat} · {product.weight}
          </span>
          <span>View Details ◆</span>
        </div>
      </div>
      <div className="tc-foot">
        <h3>{product.name}</h3>
        <span className="tc-price">{product.price}</span>
      </div>
    </Link>
  );
}

/* ── HORIZONTAL SCROLL STRIP ──────────────────────────────────────────── */
function HScrollStrip({ products }) {
  const stripRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - stripRef.current.offsetLeft;
    scrollLeft.current = stripRef.current.scrollLeft;
    stripRef.current.style.cursor = "grabbing";
  };
  const onUp = () => {
    isDragging.current = false;
    stripRef.current.style.cursor = "grab";
  };
  const onMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4;
    stripRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={stripRef}
      className="tc-strip"
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onMouseMove={onMove}
    >
      {products.map((p) => (
        <TiltCard key={p.id} product={p} />
      ))}
    </div>
  );
}

/* ── SECTION TITLE REVEAL ─────────────────────────────────────────────── */
function SectionTitle({ num, title, sub }) {
  const wrapRef = useRef(null);
  const numRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
    tl.fromTo(
      numRef.current,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.9, ease: "expo.out" },
    )
      .fromTo(
        titleRef.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.0, ease: "expo.out" },
        "-=0.6",
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.5",
      )
      .fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "expo.out", transformOrigin: "left" },
        "-=0.6",
      );
  }, []);

  return (
    <div ref={wrapRef} className="st-wrap">
      <span ref={numRef} className="st-num">
        {num}
      </span>
      <div className="st-body">
        <div className="st-title-clip">
          <h2 ref={titleRef} className="st-title">
            {title}
          </h2>
        </div>
        <p ref={subRef} className="st-sub">
          {sub}
        </p>
        <div ref={lineRef} className="st-line" />
      </div>
    </div>
  );
}

/* ── CINEMATIC CATEGORY INTRO ─────────────────────────────────────────── */
function CatIntro({ cat }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const txtRef = useRef(null);

  useEffect(() => {
    // Parallax on the background image
    gsap.to(imgRef.current, {
      yPercent: 25,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
    // Text reveal
    gsap.fromTo(
      txtRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      },
    );
  }, []);

  return (
    <div ref={ref} className="ci-wrap">
      <div className="ci-img-pan">
        <img ref={imgRef} src={cat.hero} alt={cat.title} />
        <div className="ci-tint" />
      </div>
      <div ref={txtRef} className="ci-text">
        <span className="ci-num">{cat.num} / 06</span>
        <h2 className="ci-title">{cat.title}</h2>
        <p className="ci-sub">{cat.sub}</p>
        <div className="ci-ornament">
          <span />
          <span className="ci-dot">◆</span>
          <span />
        </div>
      </div>
    </div>
  );
}

/* ── SCROLL PROGRESS BAR ───────────────────────────────────────────────── */
function ProgressBar() {
  const barRef = useRef(null);
  useEffect(() => {
    const update = () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      if (barRef.current) barRef.current.style.width = pct + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="pp-progress">
      <div ref={barRef} className="pp-progress-fill" />
    </div>
  );
}

/* ── MAIN PAGE ─────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const canvasRef = useRef(null);
  const h1LineARef = useRef(null);
  const h1LineBRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroPillRef = useRef(null);
  const [activeNav, setActiveNav] = useState(CATEGORIES[0].id);
  const [menuOpen, setMenuOpen] = useState(false);

  // ── NUCLEAR: force body + root dark on this page ──────────────────
  useEffect(() => {
    const prev = document.body.style.background;
    const prevRoot = document.getElementById("root")?.style.background;
    document.body.style.background = "#060402";
    document.body.style.backgroundColor = "#060402";
    const root = document.getElementById("root");
    if (root) {
      root.style.background = "#060402";
      root.style.backgroundColor = "#060402";
    }
    return () => {
      document.body.style.background = prev;
      document.body.style.backgroundColor = "";
      if (root) {
        root.style.background = prevRoot || "";
        root.style.backgroundColor = "";
      }
    };
  }, []);

  // Hero entrance — clip-path per line
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(
      [h1LineARef.current, h1LineBRef.current],
      { yPercent: 110 },
      { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" },
    )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5",
      )
      .fromTo(
        heroPillRef.current?.children ? [...heroPillRef.current.children] : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        "-=0.4",
      );
  }, []);

  // Scrollspy
  useEffect(() => {
    const ts = CATEGORIES.map((c) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setActiveNav(c.id),
        onEnterBack: () => setActiveNav(c.id),
      }),
    );
    return () => ts.forEach((t) => t.kill());
  }, []);

  const goto = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div className="pp-page">
      {/* Scroll progress */}
      <ProgressBar />

      {/* 3D canvas */}
      <div className="pp-three-bg">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
        <ThreeBg canvasRef={canvasRef} />
      </div>

      {/* Full-page dark scrim */}
      <div className="pp-scrim" />

      {/* Sparkle cursor */}
      <CursorSmoke />

      <Header dark />

      {/* ── SIDE DOT NAV ── */}
      <nav className="pp-dots" aria-label="Sections">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`pp-dot ${activeNav === c.id ? "active" : ""}`}
            onClick={() => goto(c.id)}
            title={c.title}
          >
            <span className="pp-dot-label">{c.title}</span>
          </button>
        ))}
      </nav>

      {/* ── FLOATING MENU ── */}
      <div className={`pp-float-menu ${menuOpen ? "open" : ""}`}>
        <button className="pp-float-btn" onClick={() => setMenuOpen((p) => !p)}>
          <span />
          <span />
          <span />
        </button>
        {menuOpen && (
          <ul className="pp-float-list">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button onClick={() => goto(c.id)}>
                  <em>{c.num}</em>
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pp-body">
        {/* ══ HERO ══ */}
        <section className="pp-hero">
          <div className="pp-hero-inner" style={{ background: "transparent" }}>
            <div className="pp-line-clip">
              <span ref={h1LineARef} className="pp-h-line pp-h-line--a">
                The
              </span>
            </div>
            <div className="pp-line-clip">
              <span ref={h1LineBRef} className="pp-h-line pp-h-line--b">
                <em>Collections</em>
              </span>
            </div>
          </div>
          <p ref={heroSubRef} className="pp-hero-sub">
            Six categories &nbsp;·&nbsp; 57 pieces &nbsp;·&nbsp; One standard —
            perfection
          </p>
          <div ref={heroPillRef} className="pp-pills">
            {CATEGORIES.map((c) => (
              <button key={c.id} className="pp-pill" onClick={() => goto(c.id)}>
                {c.title}
              </button>
            ))}
          </div>
          <div className="pp-hero-scroll">
            <span className="pp-hero-scroll-line" />
            <p>scroll to explore</p>
          </div>
        </section>

        {/* ══ CATEGORIES ══ */}
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id} className="pp-section">
            {/* Cinematic intro */}
            <CatIntro cat={cat} />

            {/* Section title */}
            <div className="pp-section-inner">
              <SectionTitle num={cat.num} title={cat.title} sub={cat.sub} />

              {/* Horizontal drag strip */}
              <HScrollStrip products={cat.products} />

              {/* Count badge */}
              <div className="pp-count-badge">
                {String(cat.products.length).padStart(2, "0")} pieces
              </div>
            </div>
          </section>
        ))}

        {/* ══ CTA ══ */}
        <section className="pp-end">
          <div className="pp-end-orn">
            <span />
            <em>◆</em>
            <span />
          </div>
          <h2 className="pp-end-title">Visit Our Showroom</h2>
          <p className="pp-end-sub">
            Mangalvar Peth , Solapur · 5500 sq.ft of pure gold
          </p>
          <div className="pp-end-btns">
            <Link to="/" className="pp-ebtn pp-ebtn--gold">
              ← Back to Home
            </Link>
            <a href="tel:+919766810462" className="pp-ebtn pp-ebtn--ghost">
              Call Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
