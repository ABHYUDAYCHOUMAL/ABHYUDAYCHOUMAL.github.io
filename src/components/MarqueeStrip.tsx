import Marquee from "react-fast-marquee";
import "./styles/MarqueeStrip.css";

type Props = {
  items: string[];
  /** Animation speed in pixels per second. */
  speed?: number;
  /** "left" or "right" — direction of travel. */
  direction?: "left" | "right";
};

/**
 * Edge-to-edge horizontal text strip used as a divider between content
 * sections. Each item is separated by a small accent dot. The marquee
 * package handles infinite scroll, pause-on-hover, and reduced-motion
 * (it stops animating when the OS preference is set).
 */
const MarqueeStrip = ({ items, speed = 60, direction = "left" }: Props) => {
  return (
    <div className="marquee-strip" aria-hidden>
      <Marquee speed={speed} direction={direction} gradient={false} pauseOnHover>
        {items.map((label, i) => (
          <span className="marquee-strip__item" key={`${label}-${i}`}>
            {label}
            <span className="marquee-strip__dot" />
          </span>
        ))}
      </Marquee>
    </div>
  );
};

export default MarqueeStrip;
