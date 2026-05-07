import { useEffect, useRef, type PropsWithChildren } from "react";
import {
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "../lib/gsap";
import { initReveal, refreshReveal, destroyReveal } from "../lib/reveal";

/**
 * Wraps the scrollable region of the page with ScrollSmoother and boots
 * the reveal animation system.
 *
 * Behavior:
 * - On reduced-motion preference, smoother is skipped entirely; reveals
 *   are also skipped (initReveal no-ops). The page falls back to native
 *   browser scroll, which is the accessible default.
 * - On touch devices, smoother is created with `smoothTouch: false`
 *   (the GSAP recommended setting) so iOS/Android keep their native
 *   momentum scroll. ScrollTriggers still work — only the ease is
 *   skipped on touch.
 * - Lazy-loaded sections (3D canvases, etc.) eventually mount and grow
 *   the document height; `ScrollTrigger.refresh()` is called whenever
 *   that happens via a ResizeObserver on the content node.
 *
 * Fixed-position elements (Navbar, social rail, custom cursor) must
 * live OUTSIDE this wrapper. ScrollSmoother applies a CSS transform to
 * the content node, which would re-anchor `position: fixed` to that
 * transformed parent and break their fixed layout.
 */
const SmoothScroll = ({ children }: PropsWithChildren) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!wrapperRef.current || !contentRef.current) return;

    // Take over scroll restoration from the browser. Without this, a
    // refresh restores the previous scroll position before the smoother
    // is initialized, leaving the page in an inconsistent state where
    // mid-page sections render with broken layout transforms.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    window.scrollTo(0, 0);

    let smoother: ScrollSmoother | undefined;
    try {
      // Pair `smooth` (inertia duration) with `speed` (distance multiplier).
      // Equal values around 1.5–1.7 give a fluid, momentum-rich feel —
      // each wheel tick travels far enough that the smoothing never feels
      // like a delay, just a graceful glide.
      smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        // Lower inertia, higher speed multiplier — page responds to wheel
        // ticks fast (less perceived weight) while keeping a soft glide
        // instead of a hard pixel-stepped scroll.
        smooth: 1.1,
        speed: 1.6,
        effects: true,
        smoothTouch: false,
        normalizeScroll: true,
        ignoreMobileResize: true,
      });
      smoother.scrollTop(0);
    } catch {
      // Bail silently if the platform refuses to set up smoother
      // (rare, mostly older Safari quirks). Native scroll still works.
      smoother = undefined;
    }

    initReveal();

    // Re-scan for late-mounted [data-reveal] nodes (lazy chunks like
    // TechStack) ONCE after a short delay. We deliberately don't use a
    // MutationObserver here — ScrollTrigger.pin modifies the DOM, which
    // would re-fire the observer, which would refresh pins, which would
    // modify DOM again. That feedback loop freezes the main thread.
    const lateScan = window.setTimeout(() => {
      initReveal();
      refreshReveal();
    }, 1500);

    // Refresh ScrollTriggers on window load (catches font swaps + image
    // dimension settles) and on resize. ScrollTrigger has its own
    // built-in resize handling, so we just add a coarse fallback.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.clearTimeout(lateScan);
      window.removeEventListener("load", onLoad);
      destroyReveal();
      smoother?.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;
