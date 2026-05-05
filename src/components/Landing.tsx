import { lazy, Suspense, useEffect, useState } from "react";
import { profile, bio, env } from "../data/site";
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

  const hasAvatar = !!env.rpmAvatarUrl;

  return (
    <section
      className={"landing" + (hasAvatar ? " landing--with-avatar" : "")}
      id="top"
    >
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
            <a className="landing__cta" href="#work">
              View work
              <span aria-hidden>→</span>
            </a>
            <a
              className="landing__cta landing__cta--ghost"
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Résumé
            </a>
            <span className="landing__location mono">
              <span className="landing__location-dot" />
              {profile.location}
            </span>
          </div>
        </div>

        {hasAvatar && (
          <div className="landing__avatar">
            <CanvasErrorBoundary>
              <Suspense fallback={null}>
                <AvatarCanvas />
              </Suspense>
            </CanvasErrorBoundary>
          </div>
        )}
      </div>

      <div className="landing__grid" aria-hidden />
      <div className="landing__glow landing__glow--a" aria-hidden />
      <div className="landing__glow landing__glow--b" aria-hidden />
    </section>
  );
};

export default Landing;
