import { MdArrowOutward } from "react-icons/md";
import { projects } from "../data/site";
import "./styles/Work.css";

const Work = () => {
  return (
    <section className="work section" id="work">
      <div className="container work__inner">
        <header className="work__header">
          <span className="eyebrow">Selected work</span>
          <h2 className="section-title">
            Things I've <em>built &amp; shipped.</em>
          </h2>
        </header>

        <div className="work__grid">
          {projects.map((p, i) => {
            const linkHref = p.link ?? p.repo;
            const linkLabel = p.link ? "Visit" : p.repo ? "GitHub" : null;
            return (
              <article className="work-card" key={p.name}>
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

                {linkHref && (
                  <a
                    className="work-card__link"
                    href={linkHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{linkLabel}</span>
                    <MdArrowOutward />
                  </a>
                )}

                <span className="work-card__shine" aria-hidden />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Work;
