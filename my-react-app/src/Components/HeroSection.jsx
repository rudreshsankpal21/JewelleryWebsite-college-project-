import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroBanner1 from "../assets/hero-banner.png";
import heroBanner2 from "../assets/hero-banner2.png";
import "../styles/HeroSection.css";

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    image: heroBanner2,
    num: "02",
    caption: "Signature Series · 2026",
    title: "Crafted Forever",
    sub: "Every detail, a masterpiece",
  },
  {
    image: heroBanner1,
    num: "02",
    caption: "New Collection · 2026",
    title: "Timeless Elegance",
    sub: "Where art meets luxury",
  },
];

const SLIDE_DURATION = 6; // seconds per slide

const HeroSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const heroRef = useRef(null);
  const slideRefs = useRef([]);
  const imgRefs = useRef([]);
  const textRefs = useRef([]);
  const progressFillRef = useRef(null);
  const scrollHintRef = useRef(null);

  // Imperative refs — avoid stale closures inside GSAP callbacks
  const currentIdx = useRef(0);
  const isTransitioning = useRef(false);
  const progressTween = useRef(null);

  // Expose goToSlide to JSX event handlers without stale-closure risk
  const goToSlideRef = useRef(null);

  useEffect(() => {
    /* ── Progress bar: fills over SLIDE_DURATION, then triggers next slide ── */
    function startProgress() {
      gsap.set(progressFillRef.current, { scaleX: 0 });
      progressTween.current = gsap.to(progressFillRef.current, {
        scaleX: 1,
        duration: SLIDE_DURATION,
        ease: "none",
        onComplete: () => {
          if (!isTransitioning.current) {
            goToSlideRef.current((currentIdx.current + 1) % SLIDES.length);
          }
        },
      });
    }

    /* ── Slide transition: clip-path wipe left→right ── */
    function goToSlide(nextIdx) {
      if (isTransitioning.current || nextIdx === currentIdx.current) return;
      isTransitioning.current = true;

      const fromIdx = currentIdx.current;
      const fromSlide = slideRefs.current[fromIdx];
      const toSlide = slideRefs.current[nextIdx];
      const fromTextEl = textRefs.current[fromIdx];
      const toTextEl = textRefs.current[nextIdx];

      // Kill running progress tween
      if (progressTween.current) progressTween.current.kill();

      // Layer incoming slide on top (clipped — invisible)
      gsap.set(toSlide, { zIndex: 2, clipPath: "inset(0 100% 0 0)" });
      gsap.set(fromSlide, { zIndex: 1 });

      // Reset incoming image for Ken Burns
      gsap.set(imgRefs.current[nextIdx], { scale: 1.08, y: 0 });

      // ── Exit text on current slide ──
      if (fromTextEl) {
        gsap.to(Array.from(fromTextEl.children), {
          opacity: 0,
          y: -14,
          duration: 0.38,
          stagger: 0.055,
          ease: "power2.in",
        });
      }

      // ── Clip-path reveal of incoming slide ──
      gsap.to(toSlide, {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.4,
        ease: "expo.inOut",
        onComplete: () => {
          currentIdx.current = nextIdx;
          setActiveIdx(nextIdx);
          isTransitioning.current = false;

          // Push old slide behind
          gsap.set(fromSlide, { zIndex: 0 });

          // Ken Burns on new slide
          gsap.to(imgRefs.current[nextIdx], {
            scale: 1,
            duration: SLIDE_DURATION * 1.5,
            ease: "power1.out",
          });

          // ── Enter text on new slide ──
          if (toTextEl) {
            gsap.fromTo(
              Array.from(toTextEl.children),
              { opacity: 0, y: 22 },
              {
                opacity: 1,
                y: 0,
                duration: 0.72,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.08,
              }
            );
          }

          // Restart progress bar
          startProgress();
        },
      });
    }

    // Expose for dot-click handlers
    goToSlideRef.current = goToSlide;

    /* ── GSAP context ── */
    const ctx = gsap.context(() => {
      // Initial layer + clip setup
      gsap.set(slideRefs.current[0], { zIndex: 1, clipPath: "inset(0 0% 0 0)" });
      gsap.set(slideRefs.current[1], { zIndex: 0, clipPath: "inset(0 100% 0 0)" });

      // All images start slightly zoomed in
      gsap.set(imgRefs.current, { scale: 1.08 });

      // Hide all text children (GSAP will animate them in)
      SLIDES.forEach((_, i) => {
        const el = textRefs.current[i];
        if (el) gsap.set(Array.from(el.children), { opacity: 0, y: 22 });
      });

      /* ── Hero container entrance ── */
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.15 }
      );

      /* ── Ken Burns on first slide (entrance) ── */
      gsap.to(imgRefs.current[0], {
        scale: 1,
        duration: SLIDE_DURATION * 1.5,
        ease: "power1.out",
        delay: 0.15,
      });

      /* ── Staggered text entrance for slide 0 ── */
      const firstText = textRefs.current[0];
      if (firstText) {
        gsap.to(Array.from(firstText.children), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.7,
        });
      }

      /* ── Scroll parallax on both images ── */
      gsap.to(imgRefs.current, {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* ── Scroll hint fades out as user scrolls ── */
      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          y: -16,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "25% top",
            scrub: true,
          },
        });
      }
    }, heroRef);

    /* ── Start progress bar after entrance settles ── */
    const timer = setTimeout(startProgress, 900);

    return () => {
      ctx.revert();
      clearTimeout(timer);
      if (progressTween.current) progressTween.current.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={heroRef} className="hero" style={{ opacity: 0 }}>

      {/* ── Slide images ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          ref={(el) => (slideRefs.current[i] = el)}
          className="hero-slide"
        >
          <img
            ref={(el) => (imgRefs.current[i] = el)}
            src={slide.image}
            alt={slide.title}
          />
        </div>
      ))}

      {/* ── Text overlays — stacked at same position, GSAP controls visibility ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          ref={(el) => (textRefs.current[i] = el)}
          className="hero-text"
        >
          <div className="hero-text-line" />
          <span className="hero-caption">{slide.caption}</span>
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-sub">{slide.sub}</p>
        </div>
      ))}

      {/* ── Slide counter — top right ── */}
      <div className="hero-counter">
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            className={`hero-dot${activeIdx === i ? " active" : ""}`}
            onClick={() => goToSlideRef.current?.(i)}
          >
            {slide.num}
          </button>
        ))}
        <span className="hero-counter-sep" />
      </div>

      {/* ── Progress / video loading bar — bottom ── */}
      <div className="hero-progress">
        <span className="hero-prog-label current">
          {SLIDES[activeIdx].num}
        </span>
        <div className="hero-prog-track">
          <div ref={progressFillRef} className="hero-prog-fill" />
        </div>
        <span className="hero-prog-label">
          {SLIDES[(activeIdx + 1) % SLIDES.length].num}
        </span>
      </div>

      {/* ── Scroll hint — bottom right, fades on scroll ── */}
      <div ref={scrollHintRef} className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </div>
  );
};

export default HeroSection;
