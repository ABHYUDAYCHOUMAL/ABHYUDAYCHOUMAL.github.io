import { skillBuckets } from "../data/site";
import "./styles/WhatIDo.css";

const WhatIDo = () => {
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
          {skillBuckets.map((bucket, i) => (
            <article className="bucket" key={bucket.title}>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
