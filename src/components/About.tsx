import { bio, profile } from "../data/site";
import "./styles/About.css";

const STATS: { value: string; label: string }[] = [
  { value: "5+", label: "Production systems shipped" },
  { value: "18k+", label: "LOC monolith refactored" },
  { value: "10k+", label: "iOS users served" },
  { value: "450%", label: "Faster than scoped" },
];

const About = () => {
  return (
    <section className="about section" id="about">
      <div className="container about__inner">
        <header className="about__header">
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            A backend engineer who keeps shipping <em>across stacks.</em>
          </h2>
        </header>

        <div className="about__body">
          <div className="about__copy">
            <p>{bio.long}</p>
            <p className="about__copy-meta">
              <span className="mono">Based in</span>{" "}
              <strong>{profile.location.split(",")[0]}.</strong>{" "}
              <span className="mono">Reach me at</span>{" "}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          </div>

          <ul className="about__stats">
            {STATS.map((s) => (
              <li key={s.label}>
                <span className="about__stat-value">{s.value}</span>
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
