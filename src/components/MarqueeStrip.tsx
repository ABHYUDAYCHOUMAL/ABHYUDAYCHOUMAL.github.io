import MarqueeImport from "react-fast-marquee";
import "./styles/MarqueeStrip.css";

// react-fast-marquee ships as CJS with `exports.default = Marquee`. Some
// bundlers expose that as `{ default: Component }` instead of unwrapping
// the default automatically, so unwrap defensively.
const Marquee = (MarqueeImport as unknown as { default?: typeof MarqueeImport })
  .default ?? MarqueeImport;

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
