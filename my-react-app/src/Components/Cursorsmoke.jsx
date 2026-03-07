import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function CursorSparkles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const sparks = [];
    let rafId;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    const onMove = (e) => {
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2 + 0.3;
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: Math.random() * 7 + 5, // arm length 5–12px
          rot: Math.random() * Math.PI, // random rotation
          alpha: 0.9 + Math.random() * 0.1,
          decay: Math.random() * 0.07 + 0.07, // dies in ~10-14 frames
          color: Math.random() > 0.4 ? "212,175,55" : "255,245,200",
        });
      }
    };

    // ✦ Elongated 4-arm sparkle — long thin cross with tapered arms
    const drawSparkle = (x, y, size, rot, alpha, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;

      // Glow halo
      ctx.shadowColor = `rgba(${color}, ${alpha})`;
      ctx.shadowBlur = size * 1.8;

      const long = size; // long arm length
      const short = size * 0.4; // cross arm length
      const w = size * 0.07; // arm width at base (very thin)

      // Draw 2 elongated diamond shapes crossed at 90°
      for (let pass = 0; pass < 2; pass++) {
        if (pass === 1) ctx.rotate(Math.PI / 2);

        ctx.beginPath();
        ctx.moveTo(0, -long); // top tip
        ctx.quadraticCurveTo(w, -long * 0.15, short * 0.25, 0);
        ctx.quadraticCurveTo(w, long * 0.15, 0, long); // bottom tip
        ctx.quadraticCurveTo(-w, long * 0.15, -short * 0.25, 0);
        ctx.quadraticCurveTo(-w, -long * 0.15, 0, -long);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, -long, 0, long);
        grad.addColorStop(0, `rgba(${color}, 0)`);
        grad.addColorStop(0.3, `rgba(${color}, ${alpha})`);
        grad.addColorStop(0.5, `rgba(255,255,255, ${alpha})`);
        grad.addColorStop(0.7, `rgba(${color}, ${alpha})`);
        grad.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Bright center dot
      ctx.shadowBlur = size * 3;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      rafId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, W, H);

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.size *= 0.96;
        s.rot += 0.04;

        if (s.alpha <= 0 || s.size < 0.5) {
          sparks.splice(i, 1);
          continue;
        }
        drawSparkle(s.x, s.y, s.size, s.rot, s.alpha, s.color);
      }
    };

    render();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return createPortal(
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99998,
      }}
    />,
    document.body,
  );
}
