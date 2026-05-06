import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  duration?: number;
};

/**
 * Counts up from 0 to the numeric portion of `value` once the element
 * enters the viewport. Preserves any non-numeric prefix/suffix in the
 * input ("18k+", "70%", "450%") so the visual format stays exact.
 *
 * No-op on `prefers-reduced-motion` — the final value is rendered
 * directly without animation.
 */
const StatCounter = ({ value, duration = 1400 }: Props) => {
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const prefix = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const isFloat = match[2].includes(".");

    setDisplay(`${prefix}0${suffix}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          const current = target * eased;
          const formatted = isFloat ? current.toFixed(1) : Math.round(current);
          setDisplay(`${prefix}${formatted}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
};

export default StatCounter;
