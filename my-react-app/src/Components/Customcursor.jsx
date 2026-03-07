import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import "../styles/Customcursor.css";

const TEXT_SELECTORS = "p, h1, h2, h3, h4, h5, h6, span, li, blockquote, label";
const LINK_SELECTORS = "a, button, [role='button'], [data-cursor-hover]";
const IMAGE_SELECTORS =
  "[data-cursor-image], .img-wrap, .images, .collection-images .inner";

const CustomCursor = () => {
  const ballRef = useRef(null);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    const pos = { x: -200, y: -200 };
    let rafId;

    // ── Direct DOM class helpers (zero React re-renders) ──
    const setClass = (state, inverted, label) => {
      ball.className = [
        "cursor-ball",
        "ready", // always visible once mouse enters
        state !== "default" ? state : "", // on-text | on-link | on-image
        inverted ? "inverted" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const labelEl = ball.querySelector(".cursor-label");
      if (labelEl) labelEl.textContent = label || "";
    };

    // ── RAF position loop ──
    const tick = () => {
      gsap.set(ball, { x: pos.x, y: pos.y });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── Mouse move ──
    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(ball, { x: e.clientX, y: e.clientY }); // instant snap too

      // Inversion check
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const inv = !!el?.closest("[data-cursor-invert]");
      // Only update if changed to avoid classList churn
      if (inv !== ball.classList.contains("inverted")) {
        ball.classList.toggle("inverted", inv);
      }
    };

    // ── Page enter: show cursor immediately ──
    const onEnterPage = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(ball, { x: e.clientX, y: e.clientY });
      ball.classList.add("ready");
    };

    // ── Page leave: hide cursor ──
    const onLeavePage = () => {
      ball.classList.remove("ready");
    };

    // ── Hover detection ──
    const onEnter = (e) => {
      const el = e.target;
      const inv = ball.classList.contains("inverted");

      if (el.closest(IMAGE_SELECTORS)) {
        const lbl =
          el.closest("[data-cursor-label]")?.dataset.cursorLabel || "";
        setClass("on-image", inv, lbl);
        return;
      }
      if (el.closest(LINK_SELECTORS)) {
        setClass("on-link", inv, "");
        return;
      }
      if (el.matches(TEXT_SELECTORS)) {
        setClass("on-text", inv, "");
        return;
      }
      setClass("default", inv, "");
    };

    const onLeave = () => {
      setClass("default", ball.classList.contains("inverted"), "");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseenter", onEnterPage);
    document.documentElement.addEventListener("mouseleave", onLeavePage);
    document.addEventListener("mouseover", onEnter, { passive: true });
    document.addEventListener("mouseout", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnterPage);
      document.documentElement.removeEventListener("mouseleave", onLeavePage);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []); // ← empty deps: runs ONCE, never tears down

  return createPortal(
    <div ref={ballRef} className="cursor-ball">
      <span className="cursor-label" />
    </div>,
    document.body,
  );
};

export default CustomCursor;
