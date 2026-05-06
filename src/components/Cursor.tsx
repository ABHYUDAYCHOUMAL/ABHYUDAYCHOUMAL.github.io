import { useEffect, useRef } from "react";
import { isTouchDevice, prefersReducedMotion } from "../lib/gsap";
import "./styles/Cursor.css";

/**
 * Custom cursor — a small disc that follows the pointer with a soft
 * lerp delay, expanding into a ring when hovering interactive elements.
 *
 * Skipped entirely on touch devices (no pointer to follow) and on
 * reduced-motion preference (a hovering circle is, technically, motion).
 * On these paths the OS cursor remains untouched and the component
 * renders nothing.
 *
 * Attribute hooks consumers can use to control behavior:
 *   data-cursor="hover"   → cursor expands into a ring on hover
 *   data-cursor="hide"    → cursor fades out (use on text inputs etc.)
 */
const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    // Dot follows the pointer near-instantly so the cursor feels
    // responsive; the ring trails behind with a soft ease, providing
    // the elastic visual without dragging the actual focus point.
    const tick = () => {
      dotPos.x += (target.x - dotPos.x) * 0.85;
      dotPos.y += (target.y - dotPos.y) * 0.85;
      ringPos.x += (target.x - ringPos.x) * 0.28;
      ringPos.y += (target.y - ringPos.y) * 0.28;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover state — apply on enter, remove on leave.
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a, button, input, textarea, [data-cursor]") as
          | HTMLElement
          | null;
      if (!interactive) {
        ring.classList.remove("cursor__ring--hover", "cursor__ring--hide");
        return;
      }
      const intent = interactive.getAttribute("data-cursor");
      ring.classList.toggle("cursor__ring--hide", intent === "hide");
      ring.classList.toggle("cursor__ring--hover", intent !== "hide");
    };

    const onOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (!related) {
        ring.classList.remove("cursor__ring--hover", "cursor__ring--hide");
      }
    };

    const onLeaveWindow = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnterWindow = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  // Render nothing on touch / reduced-motion — the effect bails before
  // creating refs, but returning DOM is fine: it's invisible and idle.
  return (
    <>
      <div className="cursor cursor__ring" ref={ringRef} aria-hidden />
      <div className="cursor cursor__dot" ref={dotRef} aria-hidden />
    </>
  );
};

export default Cursor;
