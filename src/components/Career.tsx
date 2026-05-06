import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { career } from "../data/site";
import "./styles/Career.css";

const Career = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Vertical timeline guide grows alongside the user's scroll position
  // through the section. Cards and dots animate independently via the
  // per-element data-reveal system below, so each item enters as it
  // personally crosses the viewport instead of all firing at once.
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".career__timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 75%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="career section" id="career" ref={sectionRef}>
      <div className="container career__inner">
        <header className="career__header">
          <span className="eyebrow" data-reveal="fade">
            Experience
          </span>
          <h2 className="section-title" data-reveal="title">
            Where I've <em>shipped.</em>
          </h2>
        </header>

        <ol className="career__timeline">
          <span className="career__timeline-line" aria-hidden />
          {career.map((entry, i) => (
            <li
              key={i}
              className="career__item"
              data-reveal="fade"
              data-reveal-from="right"
            >
              <span className="career__dot" aria-hidden />

              <div className="career__card">
                <header className="career__top">
                  <div>
                    <h3 className="career__role">{entry.role}</h3>
                    <p className="career__company">
                      <span>{entry.company}</span>
                      {entry.location && (
                        <span className="career__loc"> · {entry.location}</span>
                      )}
                    </p>
                  </div>
                  <span className="career__period mono">{entry.period}</span>
                </header>

                {entry.highlight && (
                  <p className="career__highlight">{entry.highlight}</p>
                )}

                <ul className="career__bullets">
                  {entry.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>

                {entry.tech && entry.tech.length > 0 && (
                  <ul className="career__tech">
                    {entry.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Career;
