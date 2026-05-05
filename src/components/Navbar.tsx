import { useEffect, useState } from "react";
import HoverLinks from "./HoverLinks";
import { profile } from "../data/site";
import "./styles/HoverLinks.css";
import "./styles/Navbar.css";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Career", href: "#career" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" aria-label={profile.name}>
          <span className="nav__brand-mark">{profile.initials}</span>
          <span className="nav__brand-name">{profile.shortName}</span>
        </a>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          <ul>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)}>
                  <HoverLinks text={label} />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="nav__cta" href={`mailto:${profile.email}`}>
          <HoverLinks text="Get in touch" />
        </a>

        <button
          type="button"
          className={`nav__burger ${open ? "nav__burger--open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
