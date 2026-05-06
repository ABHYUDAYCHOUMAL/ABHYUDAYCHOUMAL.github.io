import { useEffect, useRef } from "react";
import "./styles/AmbientGlow.css";

/**
 * A soft radial glow that follows the cursor across the page. Updates
 * via CSS variables on the body (no React re-renders), throttled to
 * the browser's animation frame. Inert on touch and reduced-motion.
 */
const AmbientGlow = () => {
  const raf = useRef(0);
  const target = useRef({ x: -1, y: -1 });

  useEffect(() => {
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.add("has-ambient-glow");

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const tick = () => {
      const { x, y } = target.current;
      if (x >= 0) {
        document.body.style.setProperty("--glow-x", `${x}px`);
        document.body.style.setProperty("--glow-y", `${y}px`);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onMove);
      document.body.classList.remove("has-ambient-glow");
    };
  }, []);

  return null;
};

export default AmbientGlow;
