/** Textbaserad wordmark. Ritad som SVG-text i Fraunces, ingen påhittad symbol. */
export function Wordmark({
  className = "",
  title = "Proptex",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg viewBox="0 0 116 34" className={className} role="img" aria-label={title}>
      <text
        x="0"
        y="26"
        fill="currentColor"
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          fontVariationSettings: '"SOFT" 100, "opsz" 48',
        }}
      >
        Proptex
      </text>
      <rect x="106" y="21" width="5" height="5" fill="var(--copper-graphic)" />
    </svg>
  );
}
