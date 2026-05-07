import { bio, profile } from "../data/site";
import StatCounter from "./StatCounter";
import "./styles/About.css";

const STATS: { value: string; label: string }[] = [
  { value: "13", label: "Phase restructure shipped (zero downtime)" },
  { value: "18k+", label: "LOC monolith refactored" },
  { value: "23 days", label: "From scope to live CEO demo" },
  { value: "200+", label: "Students mentored at IIIT Raichur" },
];

const About = () => {
  return (
    <section className="about section" id="about">
      <div className="container about__inner">
        <header className="about__header">
          <span className="eyebrow" data-reveal="fade">
            About
          </span>
          <h2 className="section-title" data-reveal="title">
            A backend engineer who keeps shipping <em>across stacks.</em>
          </h2>
        </header>

        <div className="about__body">
          <div className="about__copy">
            <p data-reveal="text">{bio.long}</p>
            <p className="about__copy-meta" data-reveal="fade">
              <span className="mono">Based in</span>{" "}
              <strong>{profile.location.split(",")[0]}.</strong>{" "}
              <span className="mono">Reach me at</span>{" "}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          </div>

          <ul className="about__stats" data-reveal="stagger">
            {STATS.map((s) => (
              <li key={s.label}>
                <span className="about__stat-value">
                  <StatCounter value={s.value} />
                </span>
                <span className="about__stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
