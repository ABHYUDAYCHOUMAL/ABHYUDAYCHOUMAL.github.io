import { lazy, Suspense, useEffect, useState } from "react";
import { profile, bio } from "../data/site";
import CanvasErrorBoundary from "./CanvasErrorBoundary";
import "./styles/Landing.css";

const AvatarCanvas = lazy(() => import("./AvatarCanvas"));

const Landing = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % profile.taglineWords.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="landing landing--with-avatar" id="top">
      {/* Decorative frame: corner brackets, side rail labels, scroll cue.
          These sit OUTSIDE the content container so they hug the viewport
          edges, not the centred 1240px column. */}
      <div className="landing__frame" aria-hidden>
        <span className="landing__bracket landing__bracket--tl" />
        <span className="landing__bracket landing__bracket--tr" />
        <span className="landing__bracket landing__bracket--bl" />
        <span className="landing__bracket landing__bracket--br" />
      </div>

      <span className="landing__rail landing__rail--left mono" aria-hidden>
        <span className="landing__rail-dot" />
        Architect · Designer · Developer · Engineer
      </span>
      <span className="landing__rail landing__rail--right mono" aria-hidden>
        Built in India · Shipped worldwide
      </span>

      <div className="container landing__inner">
        <div className="landing__copy">
          <span className="landing__status mono">
            <span className="landing__status-dot" />
            Available for new work
          </span>
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

        <div className="landing__portrait">
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <AvatarCanvas />
            </Suspense>
          </CanvasErrorBoundary>
        </div>
      </div>

      <a className="landing__scroll mono" href="#about" aria-label="Scroll down">
        <span>Scroll</span>
        <span className="landing__scroll-line" aria-hidden />
      </a>

      <div className="landing__grid" aria-hidden />
      <div className="landing__glow landing__glow--a" aria-hidden />
      <div className="landing__glow landing__glow--b" aria-hidden />
    </section>
  );
};

export default Landing;