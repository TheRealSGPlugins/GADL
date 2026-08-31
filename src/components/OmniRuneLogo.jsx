const LOGO_SRC = `${import.meta.env.BASE_URL}omnirune-logo.webp`;

export default function OmniRuneLogo({ className = "", style, ...props }) {
  return (
    <img
      src={LOGO_SRC}
      alt="OmniRune"
      draggable="false"
      className={className}
      style={style}
      {...props}
    />
  );
}
