/**
 * Central GSAP plugin registration. Importing this module once at app
 * boot ensures every component that uses gsap.* APIs sees the plugins
 * already attached.
 *
 * Plugins registered:
 *   - ScrollTrigger      → scroll-driven timelines and triggers
 *   - ScrollSmoother     → page-level inertia-smoothed scrolling
 *   - SplitText          → splits headings/paragraphs into chars/words/lines
 *
 * Note on environment guards: every consumer should still check for
 * `prefers-reduced-motion` and run on the client only.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

/** True if the user prefers no animation. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/** True if the device's primary input is touch (no precise pointer). */
export const isTouchDevice = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: none) and (pointer: coarse)").matches === true;

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };