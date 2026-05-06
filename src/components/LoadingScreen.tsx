import { useEffect, useState } from "react";
import { profile } from "../data/site";
import "./styles/LoadingScreen.css";

/**
 * Initial splash that hides the heavy first-paint cost (font swap,
 * lazy chunks, 3D init). It fades out in two phases: the progress fills
 * to 100, then the panel slides off the top.
 *
 * Auto-dismisses after `window.load` fires or a max timeout, whichever
 * comes first. Marks itself with `data-done="1"` so any consumers can
 * synchronize animations to this signal.
 */
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
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

    // Even if `load` never fires (rare — usually means a third-party
    // script is hung), force the screen off after this safety cap.
    const safety = window.setTimeout(() => {
      finishedAt = finishedAt || performance.now();
    }, 4500);

    const tick = (now: number) => {
      const elapsed = now - start;
      // Fake-progress curve: rises quickly to 70, then asymptotes
      // toward 95 until the page actually finishes loading.
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
        setTimeout(() => setDone(true), 320);
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

  return (
    <div
      className={"loading-screen" + (done ? " loading-screen--done" : "")}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      data-done={done ? "1" : "0"}
    >
      <div className="loading-screen__inner">
        <span className="loading-screen__mark">{profile.initials}</span>
        <span className="loading-screen__name">{profile.name}</span>
        <div className="loading-screen__bar" aria-hidden>
          <span
            className="loading-screen__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="loading-screen__pct mono">
          {String(progress).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;
