import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/Footer.css";

gsap.registerPlugin(ScrollTrigger);

const footerItems = [
  {
    icon: "",
    subtitle: "CHECK OUR",
    title: "COLLECTIONS",
  },
  {
    icon: "",
    subtitle: "10 AM - 8:30 PM",
    title: "+91 9766810462",
  },
  {
    icon: "",
    subtitle: "SEE OUR",
    title: "LATEST OFFERS",
  },
];

const Footer = () => {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(itemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="footer-container" ref={containerRef} data-cursor-invert>
      <div className="footer-header">
        {footerItems.map(({ icon, subtitle, title }, i) => (
        <div key={i} ref={(el) => (itemsRef.current[i] = el)} data-cursor-hover>
            {icon && <img src={icon} alt="" />}
            <h3>{subtitle}</h3>
            <h1>{title}</h1>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Kabane Jewellers Pvt. Ltd. — All
          Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
