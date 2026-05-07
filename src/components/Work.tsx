import { useEffect, useRef } from "react";
import { MdArrowOutward } from "react-icons/md";
import { FaApple, FaGithub } from "react-icons/fa6";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { projects } from "../data/site";
import "./styles/Work.css";

type LinkDef = {
  label: string;
  href: string;
  Icon: React.ComponentType;
};

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Pin the section while the user scrolls vertically; translate the
  // horizontal track so projects flow sideways across the viewport.
  // Distance to travel = (track width) − (visible viewport width), so
  // the scroll ends exactly when the last card has reached the right
  // edge of the screen — no awkward empty space.
  //
  // gsap.matchMedia auto-creates the ScrollTrigger only when the
  // viewport matches `(min-width: 1024px)` and tears it down when the
  // user resizes below that — preventing inline translate values from
  // leaking onto the mobile vertical-stack layout.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const distance = () => track.scrollWidth - window.innerWidth + 80;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        // matchMedia cleanup runs when the viewport leaves the desktop
        // range. Kill the tween + trigger AND clear any inline x
        // transform so the mobile stack layout starts from zero.
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="work" id="work" ref={sectionRef}>
      <div className="work__inner">
        <header className="work__header container">
          <span className="eyebrow" data-reveal="fade">
            Selected work
          </span>
          <h2 className="section-title" data-reveal="title">
            Things I've <em>built &amp; shipped.</em>
          </h2>
        </header>

        <div className="work__viewport">
          <div className="work__track" ref={trackRef}>
            {projects.map((p, i) => {
              const links: LinkDef[] = [];
              if (p.link)
                links.push({ label: "Visit", href: p.link, Icon: MdArrowOutward });
              if (p.appStore)
                links.push({ label: "App Store", href: p.appStore, Icon: FaApple });
              if (p.repo)
                links.push({ label: "GitHub", href: p.repo, Icon: FaGithub });

              return (
                <article
                  className="work-card"
                  key={p.name}
                  data-cursor="view"
                >
                  <div className="work-card__index mono">
                    <span>0{i + 1}</span>
                    <span className="work-card__cat">{p.category}</span>
                  </div>

                  <h3 className="work-card__title">{p.name}</h3>
                  <p className="work-card__desc">{p.description}</p>

                  <ul className="work-card__tech">
                    {p.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>

                  {links.length > 0 && (
                    <div className="work-card__links">
                      {links.map(({ label, href, Icon }) => (
                        <a
                          key={label}
                          className="work-card__link"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{label}</span>
                          <Icon />
                        </a>
                      ))}
                    </div>
                  )}

                  <span className="work-card__shine" aria-hidden />
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
