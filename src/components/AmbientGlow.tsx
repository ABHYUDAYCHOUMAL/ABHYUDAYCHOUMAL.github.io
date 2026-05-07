import { useEffect, useRef } from "react";
import "./styles/AmbientGlow.css";

/**
 * Soft radial light that follows the cursor. Implemented as a fixed
 * pre-rendered gradient div moved with translate3d — the GPU compositor
 * handles the motion with no paint or layout work, which is dramatically
 * cheaper than re-rasterizing a viewport-sized radial gradient every
 * frame via CSS variables. Inert on touch and reduced-motion.
 */
const AmbientGlow = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      // Light easing for a soft trailing motion.
      current.x += (target.x - current.x) * 0.12;
      current.y += (target.y - current.y) * 0.12;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div className="ambient-glow" aria-hidden ref={ref} />;
};

export default AmbientGlow;
