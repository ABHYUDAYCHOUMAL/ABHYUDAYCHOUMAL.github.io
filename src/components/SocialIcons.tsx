import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { social } from "../data/site";
import "./styles/SocialIcons.css";

const ICONS = [
  { href: social.github, label: "GitHub", Icon: FaGithub },
  { href: social.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  { href: social.leetcode, label: "LeetCode", Icon: SiLeetcode },
  { href: social.twitter, label: "Twitter / X", Icon: FaXTwitter },
  { href: social.instagram, label: "Instagram", Icon: FaInstagram },
];

const SocialIcons = () => (
  <aside className="social-rail" aria-label="Social links">
    <ul>
      {ICONS.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            title={label}
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
    <span className="social-rail__line" aria-hidden />
  </aside>
);

export default SocialIcons;
