"use client";

import { useState } from "react";

/** Liten linjegraf över förbrukningen. En serie, titeln står utanför. Hovra för värde. */
export function UsageChart({
  values,
  unit,
  label,
}: {
  values: number[];
  unit: string;
  label: string;
}) {
  const w = 300;
  const h = 84;
  const pad = { t: 8, b: 14, l: 0, r: 30 };
  const max = Math.max(4, Math.ceil(Math.max(...values) + 0.5));
  const x = (i: number) => pad.l + (i / Math.max(1, values.length - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (h - pad.t - pad.b);
  const line = values
    .map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(values.length - 1)} ${h - pad.b} L${x(0)} ${h - pad.b} Z`;
  const [hover, setHover] = useState<number | null>(null);
  const last = values[values.length - 1];
  const shown = hover ?? values.length - 1;

  return (
    <figure className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`${label}: senaste värdet ${last.toFixed(1)} ${unit}, högsta ${Math.max(...values).toFixed(1)} ${unit} de senaste minuterna.`}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - r.left) / r.width) * w;
          const i = Math.round((rel / (w - pad.r)) * (values.length - 1));
          setHover(Math.max(0, Math.min(values.length - 1, i)));
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[0, max / 2, max].map((v) => (
          <g key={v}>
            <line x1={0} x2={w - pad.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
            <text
              x={w - pad.r + 4}
              y={y(v) + 3.5}
              fontSize="10"
              fill="var(--ink-2)"
              className="num"
            >
              {v.toFixed(v % 1 ? 1 : 0)}
            </text>
          </g>
        ))}
        <path d={area} fill="var(--copper-graphic)" fillOpacity="0.08" />
        <path
          d={line}
          fill="none"
          stroke="var(--copper-graphic)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line
          x1={x(shown)}
          x2={x(shown)}
          y1={pad.t}
          y2={h - pad.b}
          stroke="var(--ink-2)"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity={hover === null ? 0 : 1}
        />
        <circle
          cx={x(shown)}
          cy={y(values[shown])}
          r="4"
          fill="var(--copper-graphic)"
          stroke="var(--paper)"
          strokeWidth="2"
        />
        <text x={0} y={h - 2} fontSize="10" fill="var(--ink-2)">
          för en stund sedan
        </text>
        <text x={w - pad.r} y={h - 2} fontSize="10" fill="var(--ink-2)" textAnchor="end">
          nu
        </text>
      </svg>
      <figcaption className="num text-ink mt-1 text-sm">
        <span className="font-semibold">
          {values[shown].toFixed(2)} {unit}
        </span>
        <span className="text-ink-2"> {hover === null ? "just nu" : "vid markören"}</span>
      </figcaption>
    </figure>
  );
}
