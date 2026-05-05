import { profile, social } from "../data/site";
import "./styles/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="mono">© {year}</span>
          <span>{profile.name}</span>
        </div>
        <div className="footer__links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <span aria-hidden>·</span>
          <a href={social.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span aria-hidden>·</span>
          <a href={social.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <p className="footer__credit mono">
          Built with React, GSAP, Three.js. Hosted on GitHub Pages.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
