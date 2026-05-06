import { MdArrowOutward } from "react-icons/md";
import { FaApple, FaGithub } from "react-icons/fa6";
import { projects } from "../data/site";
import "./styles/Work.css";

type LinkDef = {
  label: string;
  href: string;
  Icon: React.ComponentType;
};

const Work = () => {
  return (
    <section className="work section" id="work">
      <div className="container work__inner">
        <header className="work__header">
          <span className="eyebrow" data-reveal="fade">
            Selected work
          </span>
          <h2 className="section-title" data-reveal="title">
            Things I've <em>built &amp; shipped.</em>
          </h2>
        </header>

        <div className="work__grid" data-reveal="stagger">
          {projects.map((p, i) => {
            const links: LinkDef[] = [];
            if (p.link)
              links.push({ label: "Visit", href: p.link, Icon: MdArrowOutward });
            if (p.appStore)
              links.push({ label: "App Store", href: p.appStore, Icon: FaApple });
            if (p.repo)
              links.push({ label: "GitHub", href: p.repo, Icon: FaGithub });

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
    </section>
  );
};

export default Work;
