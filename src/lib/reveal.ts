/**
 * Scroll-reveal animations driven by data attributes.
 *
 *   data-reveal="title"   → split into chars, rise + blur clear, stagger
 *   data-reveal="text"    → split into words, rise + fade, stagger
 *   data-reveal="fade"    → simple opacity + offset on viewport enter
 *   data-reveal="stagger" → children animate in sequentially
 *
 *   data-reveal-from="right"|"left"|"up"|"down"
 *     Direction the element travels from. Defaults: "up" for fade,
 *     "right" for stagger.
 *
 *   data-reveal-start="top 85%"      → custom ScrollTrigger start
 *   data-reveal-delay="0.2"          → delay in seconds
 *
 * Reveals are reversible — they replay forward when the user scrolls
 * back up past the trigger and forward again. Call `initReveal()` once
 * after mount; it's idempotent (already-hooked nodes are skipped) so it
 * is safe to call again after lazy-loaded sections appear.
 *
 * No-ops on `prefers-reduced-motion`. On window resize, splits are
 * rebuilt automatically by ScrollTrigger.
 */
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "./gsap";

const HOOKED = "data-reveal-hooked";

type Direction = "up" | "down" | "left" | "right";
type FromVars = { x?: number; y?: number };

const SLIDE_DISTANCE = 60;

function offsetFor(dir: Direction): FromVars {
  switch (dir) {
    case "left":
      return { x: -SLIDE_DISTANCE };
    case "right":
      return { x: SLIDE_DISTANCE };
    case "down":
      return { y: -SLIDE_DISTANCE };
    case "up":
    default:
      return { y: SLIDE_DISTANCE };
  }
}

function readDirection(el: HTMLElement, fallback: Direction): Direction {
  const raw = el.getAttribute("data-reveal-from");
  if (raw === "left" || raw === "right" || raw === "up" || raw === "down") {
    return raw;
  }
  return fallback;
}

type Cleanup = () => void;
const cleanups: Cleanup[] = [];

function reveal(el: HTMLElement) {
  if (el.getAttribute(HOOKED) === "1") return;
  el.setAttribute(HOOKED, "1");

  const kind = el.getAttribute("data-reveal");
  const start = el.getAttribute("data-reveal-start") ?? "top 85%";
  const delay = parseFloat(el.getAttribute("data-reveal-delay") ?? "0") || 0;

  // Symmetric scroll trigger — animations play in BOTH directions.
  //   onEnter      → play  (scrolling down, element enters from below)
  //   onLeave      → reverse (scrolling down, element leaves up top)
  //   onEnterBack  → play  (scrolling up, element re-enters from above)
  //   onLeaveBack  → reverse (scrolling up, element exits down bottom)
  // The user sees content animate in/out as they scroll either direction.
  const trigger = {
    trigger: el,
    start,
    toggleActions: "play reverse play reverse" as const,
  };

  switch (kind) {
    case "title": {
      // Chars rise from below the line with a blur clear.
      const split = new SplitText(el, {
        type: "chars,lines",
        linesClass: "split-line",
      });
      const tween = gsap.fromTo(
        split.chars,
        { autoAlpha: 0, y: 60, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.025,
          delay,
          scrollTrigger: trigger,
        }
      );
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      });
      break;
    }

    case "text": {
      // Words rise from below — paragraphs read in order.
      const split = new SplitText(el, {
        type: "lines,words",
        linesClass: "split-line",
      });
      const tween = gsap.fromTo(
        split.words,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.018,
          delay,
          scrollTrigger: trigger,
        }
      );
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      });
      break;
    }

    case "stagger": {
      // Each child gets its own ScrollTrigger so it slides in only when
      // it personally crosses the entry threshold. Visually the cards
      // appear one-by-one as the viewport reaches them, instead of all
      // firing together when the container hits the trigger.
      const direction = readDirection(el, "right");
      const offset = offsetFor(direction);
      const children = Array.from(el.children) as HTMLElement[];
      children.forEach((child, i) => {
        const tween = gsap.fromTo(
          child,
          { autoAlpha: 0, ...offset },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            delay: delay + i * 0.04,
            scrollTrigger: {
              trigger: child,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
        cleanups.push(() => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      });
      break;
    }

    case "fade":
    default: {
      // Single element ease in. Default direction is from below.
      const direction = readDirection(el, "up");
      const offset = offsetFor(direction);
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, ...offset },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay,
          scrollTrigger: trigger,
        }
      );
      cleanups.push(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      break;
    }
  }
}

/**
 * Walks the document for `[data-reveal]` elements and wires up animations.
 * Safe to call multiple times — already-hooked nodes are skipped.
 */
export function initReveal(root: ParentNode = document): void {
  if (prefersReducedMotion()) return;
  const nodes = root.querySelectorAll<HTMLElement>("[data-reveal]");
  nodes.forEach(reveal);
}

/**
 * Refresh ScrollTriggers — call after dynamic content (lazy chunks,
 * font swaps, late images) changes the document height.
 */
export function refreshReveal(): void {
  ScrollTrigger.refresh();
}

/** Tear down every scroll-driven animation we created. */
export function destroyReveal(): void {
  while (cleanups.length) {
    const fn = cleanups.pop();
    try {
      fn?.();
    } catch {
      /* swallow — best-effort teardown */
    }
  }
}
