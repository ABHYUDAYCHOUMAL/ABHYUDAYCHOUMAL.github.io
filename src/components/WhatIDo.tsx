import { useEffect, useState } from "react";
import { skillBuckets } from "../data/site";
import "./styles/WhatIDo.css";

const WhatIDo = () => {
  // On touch devices the cards have no hover state to reveal them, so
  // we let the user tap to toggle. -1 means no card is selected.
  const [active, setActive] = useState(-1);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouch(
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    );
  }, []);

  const onCardClick = (i: number) => {
    if (!isTouch) return;
    setActive((prev) => (prev === i ? -1 : i));
  };

  return (
    <section className="whatido section" id="what">
      <div className="container whatido__inner">
        <header className="whatido__header">
          <span className="eyebrow" data-reveal="fade">
            What I do
          </span>
          <h2 className="section-title" data-reveal="title">
            Two ways I show up in <em>code.</em>
          </h2>
        </header>

        <div className="whatido__grid" data-reveal="stagger">
          {skillBuckets.map((bucket, i) => {
            const isActive = active === i;
            const isMuted = active !== -1 && !isActive;
            const cls =
              "bucket" +
              (isTouch ? " bucket--tap" : "") +
              (isActive ? " bucket--active" : "") +
              (isMuted ? " bucket--muted" : "");
            return (
              <article
                className={cls}
                key={bucket.title}
                onClick={() => onCardClick(i)}
                role={isTouch ? "button" : undefined}
                tabIndex={isTouch ? 0 : undefined}
              >
                <span className="bucket__index mono">0{i + 1}</span>
                <header className="bucket__head">
                  <h3 className="bucket__title">{bucket.title}</h3>
                  <p className="bucket__tagline mono">{bucket.tagline}</p>
                </header>
                <p className="bucket__desc">{bucket.description}</p>
                <ul className="bucket__skills">
                  {bucket.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <span className="bucket__corner" aria-hidden />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
