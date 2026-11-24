/** Statisk axonometrisk ritning av modellerna, visas utan WebGL och medan 3D laddas. */
export function FallbackIllustration({
  scene,
  dark = false,
  className = "",
}: {
  scene: "villa" | "building";
  dark?: boolean;
  className?: string;
}) {
  const stroke = dark ? "#F6F2EA" : "#14202E";
  const fillA = dark ? "#17324F" : "#ECE5D8";
  const fillB = dark ? "#0E2238" : "#F6F2EA";
  const roof = dark ? "#24405F" : "#D9CDB8";
  const accent = dark ? "#E58A5B" : "#B4532A";
  if (scene === "villa")
    return (
      <svg
        viewBox="0 0 400 260"
        className={className}
        role="img"
        aria-label="Ritning av villan: två plan med sadeltak, solceller och carport"
      >
        <g stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" fill="none">
          <path d="M20 200 L200 250 L380 200 L200 150 Z" fill={fillB} strokeOpacity="0.4" />
          <path d="M80 190 L80 120 L200 152 L200 222 Z" fill={fillA} />
          <path d="M200 222 L200 152 L310 122 L310 192 Z" fill={fillB} />
          <path d="M80 120 L140 60 L250 90 L200 152 Z" fill={roof} />
          <path d="M200 152 L250 90 L310 122" fill={fillA} />
          <path
            d="M100 116 L140 76 L190 89 L152 130 Z"
            fill={accent}
            fillOpacity="0.85"
            stroke="none"
          />
          <path
            d="M120 103 L170 116 M110 112 L160 125 M130 94 L180 107"
            stroke={fillB}
            strokeWidth="0.8"
          />
          <path d="M100 172 v-24 l22 6 v24 z M140 182 v-24 l22 6 v24 z M232 196 v-24 l20 -5 v24 z M270 186 v-24 l20 -5 v24 z" />
          <path
            d="M310 192 L310 146 L360 133 L360 180 M310 146 L320 140 L370 127 L360 133"
            strokeOpacity="0.7"
          />
          <circle cx="306" cy="168" r="4" fill={accent} stroke="none" />
        </g>
      </svg>
    );
  const floors = [0, 1, 2, 3, 4];
  return (
    <svg
      viewBox="0 0 400 280"
      className={className}
      role="img"
      aria-label="Ritning av flerbostadshuset: fem våningar med solceller och ventilationsaggregat på taket"
    >
      <g stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" fill="none">
        <path d="M10 236 L170 272 L390 214 L230 178 Z" fill={fillB} strokeOpacity="0.4" />
        {floors.map((f) => (
          <g key={f} transform={`translate(0 ${-f * 30})`}>
            <path d="M40 230 L40 202 L180 236 L180 264 Z" fill={fillA} />
            <path d="M180 264 L180 236 L360 188 L360 216 Z" fill={fillB} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path
                key={i}
                d={`M${196 + i * 23} ${245 - i * 6.1} v-12 l10 -2.7 v12 z`}
                strokeOpacity="0.7"
              />
            ))}
          </g>
        ))}
        <path d="M40 82 L220 40 L360 68 L180 116 Z" fill={roof} />
        <path d="M80 82 L110 75 L130 79 L100 87 Z" fill={accent} stroke="none" />
        <path
          d="M160 70 L280 46 M175 78 L295 54 M190 86 L310 62"
          stroke={stroke}
          strokeOpacity="0.5"
        />
      </g>
    </svg>
  );
}
