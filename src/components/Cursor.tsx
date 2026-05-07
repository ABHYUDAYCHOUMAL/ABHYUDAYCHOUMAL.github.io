import { useEffect, useRef } from "react";
import { isTouchDevice, prefersReducedMotion } from "../lib/gsap";
import "./styles/Cursor.css";

/**
 * Custom cursor — two layers painted with `mix-blend-mode: difference`
 * so the cursor stays visible on any background colour (light or dark).
 *
 *   Inner dot    → tracks the pointer near-instantly for precision.
 *   Outer ring   → trails behind with a soft ease for the elastic
 *                  visual; morphs into different states on hover.
 *
 * State hooks (set as `data-cursor` on any element):
 *   data-cursor="hover" → ring expands into a translucent fill
 *                         (default for `<a>` and `<button>`)
 *   data-cursor="view"  → ring expands further, shows "VIEW" inside
 *                         (use on project cards / images)
 *   data-cursor="hide"  → cursor fades out (use on text inputs)
 *
 * Skipped entirely on touch devices and on reduced-motion preference.
 *
 * Why `document.addEventListener("mousemove")` instead of `pointermove`
 * on window? ScrollSmoother's `normalizeScroll` re-routes pointer
 * events for its own gesture handling, which mutes window-level
 * pointermove listeners. Document-level mousemove is unaffected.
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

    // Initial position — center of viewport. Will snap to actual mouse
    // location on the first mousemove.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dotPos = { ...target };
    const ringPos = { ...target };
    let raf = 0;
    let mounted = true;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const tick = () => {
      if (!mounted) return;
      // Dot is sharp (0.7 lerp = ~30 ms catch-up); ring is softer
      // (0.2 lerp = elastic trail). Both translate3d so the GPU
      // compositor handles motion without paint.
      dotPos.x += (target.x - dotPos.x) * 0.7;
      dotPos.y += (target.y - dotPos.y) * 0.7;
      ringPos.x += (target.x - ringPos.x) * 0.2;
      ringPos.y += (target.y - ringPos.y) * 0.2;

      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Resolve the cursor state based on what the pointer is over.
    // Default rule: anchors and buttons get "hover" automatically; an
    // explicit data-cursor on any ancestor wins.
    const setState = (intent: string | null) => {
      ring.classList.toggle("cursor__ring--hover", intent === "hover");
      ring.classList.toggle("cursor__ring--view", intent === "view");
      ring.classList.toggle("cursor__ring--hide", intent === "hide");
      dot.classList.toggle("cursor__dot--hide", intent === "hide");
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest(
        "a, button, input, textarea, [data-cursor]"
      ) as HTMLElement | null;
      if (!interactive) {
        setState(null);
        return;
      }
      const explicit = interactive.getAttribute("data-cursor");
      if (explicit === "hide" || explicit === "view" || explicit === "hover") {
        setState(explicit);
        return;
      }
      // Implicit defaults
      const tag = interactive.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || interactive.isContentEditable) {
        setState("hide");
      } else if (tag === "A" || tag === "BUTTON") {
        setState("hover");
      } else {
        setState(null);
      }
    };

    const onOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (!related) setState(null);
    };

    const onLeaveWindow = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };
    const onEnterWindow = () => {
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <div className="cursor cursor__ring" ref={ringRef} aria-hidden>
        <span className="cursor__label">View</span>
      </div>
      <div className="cursor cursor__dot" ref={dotRef} aria-hidden />
    </>
  );
};

export default Cursor;
