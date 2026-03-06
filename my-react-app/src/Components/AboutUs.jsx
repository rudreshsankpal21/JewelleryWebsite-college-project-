import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphsRef = useRef([]);
  const rightRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Decorative left border line draw ──
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Title clip-path reveal ──
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60, clipPath: "inset(100% 0% 0% 0%)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.0,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Paragraphs stagger in ──
      gsap.fromTo(
        paragraphsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Right image slide in ──
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 70 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // ── Right image parallax on scroll ──
      gsap.to(rightRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const paragraphs = [
    "When the highly reputable Shree Laxmi Jewellers and Giriraj Jewellers come together, Kabane Jewellers Private Limited is born! Recently launched at Chandan Nagar in east Pune, Kabane Jewellers Private Limited is built on a 30-year legacy of trust and customer confidence.",
    "The glittering 5500 sq.ft. Kabane Jewellers showroom is a treasure trove of spectacular traditional jewellery for the Maharashtrian bride, and alluring silver, gold and diamond jewellery for the contemporary, cosmopolitan woman.",
    "Kabane  Jewellers Private Limited offers an unbelievable range and exquisite styles in varying budgets to win the heart of every woman, young and young-at-heart. Every piece is artistically designed and meticulously crafted to create a masterpiece that blends style with substance, novelty with timelessness.",
    "We invite you to come, explore our world of breath-taking beauty. Welcome to Kabane  Jewellers Private Limited.",
  ];

  return (
    <div className="container" ref={containerRef}>
      {/* Animated decorative line — controlled by GSAP */}
      <div className="about-line-draw" ref={lineRef} />

      <div className="about-left">
        <div className="about-title">
          <h1 ref={titleRef}>About Us</h1>
        </div>
        <div className="about-description">
          {paragraphs.map((text, i) => (
            <p key={i} ref={(el) => (paragraphsRef.current[i] = el)}>
              {text}
            </p>
          ))}
        </div>
      </div>
      <div className="about-right" ref={rightRef}>
        <img
          src="./src/assets/about-right.png"
          alt="About Kabane Jewellers"
        />
      </div>
    </div>
  );
};

export default AboutUs;
