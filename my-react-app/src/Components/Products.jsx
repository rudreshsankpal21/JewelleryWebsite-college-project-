import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Products.css";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { src: "./src/assets/products/img1.png", label: "Earrings" },
  { src: "./src/assets/products/img2.png", label: "Rings" },
  { src: "./src/assets/products/img3.png", label: "Necklaces" },
  { src: "./src/assets/products/img4.png", label: "Mangalsutra" },
  { src: "./src/assets/products/img5.png", label: "Bangles" },
  { src: "./src/assets/products/img6.png", label: "Pendants" },
];

const Products = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const leftDecoRef = useRef(null);
  const rightDecoRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header decorative images slide in from sides ──
      gsap.fromTo(
        leftDecoRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        rightDecoRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Title clip-path reveal ──
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30, clipPath: "inset(100% 0% 0% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Product cards stagger with scale ──
      gsap.fromTo(
        imagesRef.current,
        { opacity: 0, y: 60, scale: 0.94 },
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

      // ── Subtle parallax on each product image ──
      imagesRef.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector("img");
        if (!img) return;
        gsap.to(img, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div className="product-container">
        <div className="product-header" ref={headerRef}>
          <img
            ref={leftDecoRef}
            src="./src/assets/products/product-title-left.png"
            alt=""
          />
          <h1 ref={titleRef}>Our Products</h1>
          <img
            ref={rightDecoRef}
            src="./src/assets/products/product-title-right.png"
            alt=""
          />
        </div>

        <div className="product-img-container">
          {products.map(({ src, label }, i) => (
            <div
              key={label}
              className="images"
              ref={(el) => (imagesRef.current[i] = el)}
              data-cursor-image
              data-cursor-label={label}
            >
              <div className="img-wrap">
                <img src={src} alt={label} />
              </div>
              <h3>{label}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
