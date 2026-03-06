import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import "../styles/Customcursor.css";

const TEXT_SELECTORS =
  "p, h1, h2, h3, h4, h5, h6, span, li, blockquote, label";
const LINK_SELECTORS = "a, button, [role='button'], [data-cursor-hover]";
const IMAGE_SELECTORS = "[data-cursor-image], .img-wrap, .images, .collection-images .inner";

const CustomCursor = () => {
  const ballRef = useRef(null);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef(null);
  const [ready, setReady] = useState(false);
  const [state, setState] = useState("default"); // default | on-text | on-link | on-image
  const [label, setLabel] = useState("");
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    // ── Smooth position tracking ──
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!ready) setReady(true);
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      if (ballRef.current) {
        gsap.set(ballRef.current, { x: pos.current.x, y: pos.current.y });
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    // ── Hover state detection ──
    const enter = (e) => {
      const el = e.target;

      // Dark background section detection
      setInverted(!!el.closest("[data-cursor-invert]"));

      // Image / product card
      if (el.closest(IMAGE_SELECTORS)) {
        const cardLabel =
          el.closest("[data-cursor-label]")?.dataset.cursorLabel || "";
        setLabel(cardLabel);
        setState("on-image");
        return;
      }

      // Links / buttons
      if (el.closest(LINK_SELECTORS)) {
        setState("on-link");
        setLabel("");
        return;
      }

      // Text nodes
      if (el.matches(TEXT_SELECTORS)) {
        setState("on-text");
        setLabel("");
        return;
      }

      setState("default");
      setLabel("");
    };

    const leave = (e) => {
      setState("default");
      setLabel("");
      // Check if moving to a non-inverted element
      if (e.relatedTarget) {
        setInverted(!!e.relatedTarget.closest?.("[data-cursor-invert]"));
      } else {
        setInverted(false);
      }
    };

    document.addEventListener("mouseover", enter, { passive: true });
    document.addEventListener("mouseout", leave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
      cancelAnimationFrame(raf.current);
    };
  }, [ready]);

  return createPortal(
    <div
      ref={ballRef}
      className={`cursor-ball ${ready ? "ready" : ""} ${
        state !== "default" ? state : ""
      } ${inverted ? "inverted" : ""}`}
    >
      {label && <span className="cursor-label">{label}</span>}
    </div>,
    document.body
  );
};

export default CustomCursor;