import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Collection.css";

import img1 from "../assets/collections/img1.png";
import img2 from "../assets/collections/img2.png";
import img3 from "../assets/collections/img3.png";
import img4 from "../assets/collections/img4.png";

import titleLeft from "../assets/products/product-title-left.png";
import titleRight from "../assets/products/product-title-right.png";

gsap.registerPlugin(ScrollTrigger);

const collections = [img1, img2, img3, img4];

const Collection = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const fromX = i % 2 === 0 ? -70 : 70;

        gsap.fromTo(
          card,
          { opacity: 0, x: fromX, y: 30 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.0,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );

        const inner = card.querySelector(".inner");
        if (inner) {
          gsap.to(inner, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div className="collection-container">
        <div className="collection-header" ref={headerRef}>
          <img src={titleLeft} alt="" />
          <h1>Our Collections</h1>
          <img src={titleRight} alt="" />
        </div>

        <div className="collection-img-container">
          {collections.map((src, i) => (
            <div
              key={i}
              className="collection-images"
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <div className="outer">
                <div className="inner">
                  <img src={src} alt={`Collection ${i + 1}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
