import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";
import prod1 from "../assets/products/img1.png";
import prod2 from "../assets/products/img2.png";
import prod3 from "../assets/products/img3.png";
import prod4 from "../assets/products/img4.png";
import prod5 from "../assets/products/img5.png";
import prod6 from "../assets/products/img6.png";

import titleLeft from "../assets/products/product-title-left.png";
import titleRight from "../assets/products/product-title-right.png";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { src: prod1, label: "Earrings" },
  { src: prod2, label: "Necklaces" },
  { src: prod3, label: "Rings" },
  { src: prod4, label: "Mangalsutra" },
  { src: prod5, label: "Bangles" },
  { src: prod6, label: "Pendants" },
];

const Products = () => {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const cursorRef = useRef(null);
  const btnRef = useRef(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState("");
  const navigate = useNavigate();

  // Smooth cursor follow
  useEffect(() => {
    const onMove = (e) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    const animate = () => {
      if (cursorRef.current)
        gsap.set(cursorRef.current, {
          x: cursorPos.current.x,
          y: cursorPos.current.y,
        });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll-triggered card entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imagesRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
          delay: 0.7,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Magnetic button
  const handleBtnMove = useCallback((e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.22;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.22;
    gsap.to(btnRef.current, {
      x: dx,
      y: dy,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleBtnLeave = useCallback(() => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1,0.5)",
    });
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${cursorVisible ? "visible" : ""}`}
      >
        <span>{hoveredLabel || "View"}</span>
      </div>

      <div ref={containerRef}>
        <div className="product-container">
          <div className="product-header">
            <img src={titleLeft} alt="" />
            <h1>Our Products</h1>
            <img src={titleRight} alt="" />
          </div>

          <div
            className="product-img-container"
            onMouseEnter={() => setCursorVisible(true)}
            onMouseLeave={() => {
              setCursorVisible(false);
              setHoveredLabel("");
            }}
          >
            {products.map(({ src, label }, i) => (
              <div
                key={label}
                className="images"
                ref={(el) => (imagesRef.current[i] = el)}
                onMouseEnter={() => setHoveredLabel(label)}
                onMouseLeave={() => setHoveredLabel("")}
              >
                <div className="img-wrap">
                  <img src={src} alt={label} />
                </div>
                <h3>{label}</h3>
              </div>
            ))}
          </div>

          {/* ── View More button ── */}
          <div className="product-view-more-wrap">
            <button
              ref={btnRef}
              className="product-view-more-btn"
              onClick={() => navigate("/products")}
              onMouseMove={handleBtnMove}
              onMouseLeave={handleBtnLeave}
            >
              <span className="pvmb-label">View All Collections</span>
              <span className="pvmb-icon">◆</span>
              <span className="pvmb-shimmer" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
