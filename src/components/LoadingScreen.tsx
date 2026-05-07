import { useEffect, useState } from "react";
import MarqueeImport from "react-fast-marquee";
import { profile } from "../data/site";
import "./styles/LoadingScreen.css";

const Marquee = (MarqueeImport as unknown as { default?: typeof MarqueeImport })
  .default ?? MarqueeImport;

/**
 * Premium splash that hides the heavy first-paint cost (font swap, lazy
 * chunks, 3D init) and gives the page a deliberate entry moment.
 *
 * Layers from back to front:
 *   - Slowly pulsing radial glow that gives the dark stage warmth.
 *   - Subtle dot grid that fades in from below and bleeds into the
 *     edges, anchoring the composition.
 *   - Two-row marquee: top row scrolls left at full size, bottom row
 *     scrolls right at smaller size with the accent colour. Counter-
 *     direction motion creates rhythm without competing for attention.
 *   - Corner brackets (top-left, bottom-right) frame the stage.
 *   - Centred pill with a thin progress fill behind the label.
 *
 * On click (or after auto-dismiss), the pill scales up massively to
 * wipe the screen with the accent colour, then the panel slides off
 * the top — a single continuous motion.
 */
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let finishedAt = 0;

    const handleLoad = () => {
      finishedAt = performance.now();
    };
    if (document.readyState === "complete") {
      finishedAt = performance.now();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }
    const safety = window.setTimeout(() => {
      finishedAt = finishedAt || performance.now();
    }, 4500);

    const tick = (now: number) => {
      const elapsed = now - start;
      const fake = Math.min(
        95,
        70 * (1 - Math.exp(-elapsed / 800)) +
          25 * (1 - Math.exp(-elapsed / 2400))
      );
      const real = finishedAt > 0
        ? Math.min(100, fake + ((now - finishedAt) / 400) * (100 - fake))
        : fake;
      setProgress(Math.round(real));
      if (real >= 100) {
        setReveal(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (!reveal) return;
    const t = window.setTimeout(() => fire(), 1700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal]);

  function fire() {
    if (clicked) return;
    setClicked(true);
    window.setTimeout(() => setDone(true), 700);
  }

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      className={
        "loading-screen" +
        (clicked ? " loading-screen--clicked" : "") +
        (done ? " loading-screen--done" : "")
      }
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="loading-screen__pulse" aria-hidden />
      <div className="loading-screen__grid" aria-hidden />
      <div className="loading-screen__brackets" aria-hidden>
        <span /> <span /> <span /> <span />
      </div>

      <header className="loading-screen__top">
        <span className="loading-screen__mark">{profile.initials}</span>
        <div className="loading-screen__id">
          <span className="loading-screen__name mono">
            {profile.shortName.toLowerCase()}.dev
          </span>
          <span className="loading-screen__role mono">{profile.title}</span>
        </div>
      </header>

      <div className="loading-screen__marquees" aria-hidden>
        <div className="loading-screen__marquee loading-screen__marquee--top">
          <Marquee speed={70} gradient={false} pauseOnHover={false}>
            <span>Backend</span>
            <span>Architecture</span>
            <span>Distributed Systems</span>
            <span>FastAPI</span>
            <span>RAG · LLM</span>
          </Marquee>
        </div>
        <div className="loading-screen__marquee loading-screen__marquee--bottom">
          <Marquee
            speed={45}
            direction="right"
            gradient={false}
            pauseOnHover={false}
          >
            <span>Open to Work</span>
            <span>Builder</span>
            <span>Designer</span>
            <span>iOS · Android</span>
            <span>Integrations</span>
          </Marquee>
        </div>
      </div>

      <div
        className="loading-screen__wrap"
        onMouseMove={onMove}
        onClick={fire}
      >
        <span className="loading-screen__hover" aria-hidden />
        <button
          type="button"
          className={
            "loading-screen__pill" +
            (reveal ? " loading-screen__pill--ready" : "")
          }
          aria-label={reveal ? "Enter the site" : `Loading ${progress}%`}
        >
          {/* Thin progress fill behind the label */}
          <span
            className="loading-screen__fill"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
          <span className="loading-screen__label">
            <span className="loading-screen__loading">
              <span className="loading-screen__dot" aria-hidden />
              Loading
              <em className="loading-screen__pct mono">{progress}%</em>
            </span>
            <span className="loading-screen__enter">
              Enter <span aria-hidden>→</span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;