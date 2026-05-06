import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { profile, bio } from "../data/site";
import CanvasErrorBoundary from "./CanvasErrorBoundary";
import "./styles/Landing.css";

const AvatarCanvas = lazy(() => import("./AvatarCanvas"));

const Landing = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % profile.taglineWords.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  // Mouse-driven tilt on the portrait container — adds 3D depth to the
  // 2D halo behind the avatar canvas. Direct DOM transforms (no React
  // re-renders), capped to a tasteful angle so it never feels gimmicky.
  useEffect(() => {
    const el = portraitRef.current;
    if (!el) return;
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { rx: 0, ry: 0 };
    const current = { rx: 0, ry: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      target.ry = dx * 6;
      target.rx = -dy * 4;
    };
    const onLeave = () => {
      target.rx = 0;
      target.ry = 0;
    };

    const tick = () => {
      current.rx += (target.rx - current.rx) * 0.08;
      current.ry += (target.ry - current.ry) * 0.08;
      el.style.transform = `perspective(1100px) rotateX(${current.rx}deg) rotateY(${current.ry}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="landing landing--with-avatar" id="top">
      <div className="container landing__inner">
        <div className="landing__copy">
          <p className="eyebrow">{profile.title}</p>

          <h1 className="landing__name">
            <span className="landing__name-line">Abhyuday</span>
            <span className="landing__name-line landing__name-line--accent">
              Choumal
            </span>
          </h1>

          <div className="landing__role">
            <span className="landing__role-prefix">I'm</span>{" "}
            <span
              key={profile.taglineWords[wordIndex]}
              className="landing__role-word"
            >
              {/^[aeiou]/i.test(profile.taglineWords[wordIndex]) ? "an " : "a "}
              <strong>{profile.taglineWords[wordIndex]}</strong>.
            </span>
          </div>

          <p className="landing__bio">{bio.short}</p>

          <div className="landing__meta">
            <a className="landing__cta magnetic" href="#work" data-cursor="hover">
              View work
              <span aria-hidden>→</span>
            </a>
            <a
              className="landing__cta landing__cta--ghost magnetic"
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
            >
              Résumé
            </a>
            <span className="landing__location mono">
              <span className="landing__location-dot" />
              {profile.location}
            </span>
          </div>
        </div>

        <div className="landing__portrait" ref={portraitRef}>
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <AvatarCanvas />
            </Suspense>
          </CanvasErrorBoundary>
        </div>
      </div>

      <div className="landing__grid" aria-hidden />
      <div className="landing__glow landing__glow--a" aria-hidden />
      <div className="landing__glow landing__glow--b" aria-hidden />
    </section>
  );
};

export default Landing;
