type Props = { text: string };

const HoverLinks = ({ text }: Props) => (
  <span className="hover-link">
    <span className="hover-link__top" data-text={text}>
      {text}
    </span>
    <span className="hover-link__bottom" data-text={text}>
      {text}
    </span>
  </span>
);

export default HoverLinks;
