/**
 * Magnetic effect — buttons (or any element with class `.magnetic`)
 * gently follow the cursor when it's nearby, then return to rest when
 * the pointer leaves their proximity zone.
 *
 * Activates each `.magnetic` element on first pointerenter so we don't
 * pay event-listener cost for elements the user never reaches. No-op
 * on touch and reduced-motion.
 */

const STRENGTH = 0.3;
const SOFT = 0.18;

function attach(el: HTMLElement) {
  let raf = 0;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let active = false;

  const tick = () => {
    current.x += (target.x - current.x) * SOFT;
    current.y += (target.y - current.y) * SOFT;
    el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    if (active || Math.hypot(current.x, current.y) > 0.1) {
      raf = requestAnimationFrame(tick);
    } else {
      el.style.transform = "";
    }
  };

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    target.x = (e.clientX - cx) * STRENGTH;
    target.y = (e.clientY - cy) * STRENGTH;
  };

  const onEnter = () => {
    active = true;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const onLeave = () => {
    active = false;
    target.x = 0;
    target.y = 0;
  };

  el.addEventListener("pointerenter", onEnter);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
}

export function initMagnetic(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll<HTMLElement>(".magnetic").forEach(attach);
}
