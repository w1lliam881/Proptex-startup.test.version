import type { ReactNode } from "react";
import type { Status } from "@/data/demo";
import { demo } from "@/content/sv";

export function SectionHead({
  number,
  label,
  title,
  dark = false,
  id,
}: {
  number?: string;
  label: string;
  title: string;
  dark?: boolean;
  id?: string;
}) {
  return (
    <header className="grid-12 mb-10 gap-y-4 md:mb-16">
      <p
        className={`eyebrow num col-span-12 flex items-center gap-3 md:col-span-3 md:pt-3 ${dark ? "text-paper-muted" : "text-ink-2"}`}
      >
        {number && <span className={dark ? "text-copper-light" : "text-copper"}>{number}</span>}
        {number && <span aria-hidden className={`h-px w-8 ${dark ? "bg-line-dark" : "bg-line"}`} />}
        <span>{label}</span>
      </p>
      <h2 id={id} className="display h-lg col-span-12 max-w-[18ch] md:col-span-9 md:col-start-4">
        {title}
      </h2>
    </header>
  );
}

const statusIcon: Record<Status, ReactNode> = {
  ok: (
    <path
      d="M3.5 8.5l3 3 6-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  warn: (
    <>
      <path
        d="M8 2.5l6 11H2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.5v3.2M8 11.6v.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  bad: (
    <>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.8v3.8M8 11v.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
};

/** Status visas alltid med ikon + text, aldrig bara färg. */
export function StatusBadge({
  status,
  text,
  dark = false,
  className = "",
}: {
  status: Status;
  text?: string;
  dark?: boolean;
  className?: string;
}) {
  const color = dark
    ? { ok: "text-ok-light", warn: "text-warn-light", bad: "text-bad-light" }[status]
    : { ok: "text-ok", warn: "text-warn", bad: "text-bad" }[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${color} ${className}`}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden className="shrink-0">
        {statusIcon[status]}
      </svg>
      {text ?? demo.status[status]}
    </span>
  );
}

export function SimulatedTag({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`eyebrow inline-flex items-center gap-2 ${dark ? "text-paper-muted" : "text-ink-2"} ${className}`}
    >
      <span
        aria-hidden
        className={`inline-block h-1.5 w-1.5 rounded-full ${dark ? "bg-copper-light" : "bg-copper"}`}
      />
      {demo.simulated}
    </p>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  dark = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "quiet";
  dark?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-[3px] px-5 py-3 text-[0.95rem] font-semibold transition-colors duration-200";
  const styles =
    variant === "primary"
      ? dark
        ? "bg-copper-light text-marin hover:bg-paper"
        : "bg-copper text-paper hover:bg-ink"
      : dark
        ? "text-paper underline decoration-line-dark decoration-1 underline-offset-[6px] hover:decoration-copper-light px-1"
        : "text-ink underline decoration-line decoration-1 underline-offset-[6px] hover:decoration-copper px-1";
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}
