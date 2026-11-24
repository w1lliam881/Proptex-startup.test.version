/** De tre handritade detaljerna på sidan. Ojämna med flit. */
export function ScribbleUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 18"
      preserveAspectRatio="none"
      className={`scribble ${className}`}
      aria-hidden
    >
      <path
        d="M3 12.5 C 48 6.8, 102 9.4, 151 7.6 S 246 4.2, 297 8.9 M 18 15.6 C 80 12.2, 160 13.4, 231 11.4"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScribbleArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={`scribble ${className}`} aria-hidden>
      <path
        d="M6 12 C 30 4, 66 8, 84 30 C 94 42, 96 52, 95 62 M 84 52 C 89 57, 92 61, 95 63.5 C 98 59, 101 55, 106 51"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ScribbleCircle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 80"
      preserveAspectRatio="none"
      className={`scribble ${className}`}
      aria-hidden
    >
      <path
        d="M120 6 C 60 3, 8 16, 6 40 C 5 62, 62 76, 118 74 C 176 72, 214 58, 213 38 C 212 18, 168 6, 104 9"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
