import { career } from "../data/site";
import "./styles/Career.css";

const Career = () => {
  return (
    <section className="career section" id="career">
      <div className="container career__inner">
        <header className="career__header">
          <span className="eyebrow">Experience</span>
          <h2 className="section-title">
            Where I've <em>shipped.</em>
          </h2>
        </header>

        <ol className="career__timeline">
          {career.map((entry, i) => (
            <li key={i} className="career__item">
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
