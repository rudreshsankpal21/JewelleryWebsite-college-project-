import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

const paragraphs = [
  "When the highly reputable Shree Laxmi Jewellers and Giriraj Jewellers come together, Kabane Jewellers Private Limited is born! Recently launched at Chandan Nagar in east Pune, Kabane Jewellers is built on a 30-year legacy of trust and customer confidence.",
  "The glittering 5500 sq.ft. showroom is a treasure trove of spectacular traditional jewellery for the Maharashtrian bride, and alluring silver, gold and diamond jewellery for the contemporary woman.",
  "Every piece is artistically designed and meticulously crafted to create a masterpiece that blends style with substance, novelty with timelessness.",
];

const AboutUs = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphsRef = useRef([]);
  const rightRef = useRef(null);
  const btnRef = useRef(null);
  const cancelFns = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      gsap.to(paragraphsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      gsap.to(rightRef.current, {
        opacity: 1,
        x: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      // Button entrance — slightly after paragraphs
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
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

  // Button magnetic hover
  const handleBtnMove = useCallback((e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.25;
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
      ease: "elastic.out(1, 0.5)",
    });
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="about-left">
        <div className="about-title">
          <h1 ref={titleRef}>About Us</h1>
        </div>

        <div className="about-description">
          {paragraphs.map((text, i) => (
            <p
              key={i}
              ref={(el) => (paragraphsRef.current[i] = el)}
              onMouseEnter={(e) => handleEnter(e.currentTarget, i)}
              onMouseLeave={(e) => handleLeave(e.currentTarget, i)}
            >
              {text}
            </p>
          ))}
        </div>

        {/* ── Learn More button ── */}
        <button
          ref={btnRef}
          className="about-learn-btn"
          onClick={() => navigate("/about")}
          onMouseMove={handleBtnMove}
          onMouseLeave={handleBtnLeave}
        >
          <span className="about-learn-btn__label">Learn More</span>
          <span className="about-learn-btn__icon">◆</span>
          <span className="about-learn-btn__shimmer" />
        </button>
      </div>

      <div className="about-right" ref={rightRef}>
        <img src="./src/assets/about-right.png" alt="About Kabane Jewellers" />
      </div>
    </div>
  );
};

export default AboutUs;
