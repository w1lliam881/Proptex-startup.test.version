"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/content/sv";
import { Wordmark } from "./Wordmark";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="on-marin bg-marin text-paper relative z-20">
      <a
        href="#innehall"
        className="focus:bg-paper focus:text-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
      >
        {nav.skipLink}
      </a>
      <div className="wrap flex items-center justify-between py-5">
        <Link href="/" className="text-paper" aria-label="Proptex, till startsidan">
          <Wordmark className="h-7 w-auto" title="Proptex" />
        </Link>
        <nav aria-label="Huvudmeny" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {nav.items.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className="text-paper-muted hover:text-paper transition-colors duration-200"
                >
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#kontakt"
                className="border-copper-light/70 text-paper hover:bg-copper-light hover:text-marin rounded-[3px] border px-4 py-2 font-semibold transition-colors duration-200"
              >
                {nav.cta}
              </Link>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className="text-paper -mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobilmeny"
          aria-label={open ? nav.menuClose : nav.menuOpen}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
            {open ? (
              <path
                d="M6 6l14 14M20 6L6 20"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 9h18M4 17h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav
          id="mobilmeny"
          aria-label="Huvudmeny"
          className="wrap border-line-dark border-t pb-6 md:hidden"
        >
          <ul className="flex flex-col pt-2 text-lg">
            {nav.items.map((i) => (
              <li key={i.href} className="border-line-dark border-b">
                <Link href={i.href} className="block py-3" onClick={() => setOpen(false)}>
                  {i.label}
                </Link>
              </li>
            ))}
            <li className="pt-5">
              <Link
                href="/#kontakt"
                onClick={() => setOpen(false)}
                className="bg-copper-light text-marin inline-block rounded-[3px] px-5 py-3 font-semibold"
              >
                {nav.cta}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
