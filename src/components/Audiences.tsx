"use client";

import { useRef, useState } from "react";
import { audiences } from "@/content/sv";

export function Audiences() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = audiences.items[active];
  const move = (i: number) => {
    const n = (i + audiences.items.length) % audiences.items.length;
    setActive(n);
    tabs.current[n]?.focus();
  };
  return (
    <div className="grid-12 gap-y-8">
      <div
        role="tablist"
        aria-label={audiences.tablistLabel}
        className="border-line col-span-12 flex gap-1 overflow-x-auto border-b md:col-span-3 md:flex-col md:border-b-0 md:border-l"
      >
        {audiences.items.map((a, i) => (
          <button
            key={a.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${a.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${a.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(i + 1);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(i - 1);
              }
            }}
            className="text-ink-2 hover:text-ink aria-selected:border-copper aria-selected:text-ink -mb-px shrink-0 border-b-2 border-transparent px-3 py-3 text-left text-[1.05rem] transition-colors duration-200 aria-selected:font-semibold md:-mb-0 md:-ml-px md:border-b-0 md:border-l-2 md:pl-5"
          >
            {a.tab}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${item.id}`}
        aria-labelledby={`tab-${item.id}`}
        tabIndex={0}
        className="col-span-12 grid grid-cols-1 gap-8 md:col-span-9 md:col-start-4 md:grid-cols-9"
      >
        <div className="md:col-span-5">
          <p className="text-ink-2">{item.kicker}</p>
          <p className="eyebrow text-copper mt-6">{audiences.scenarioLabel}</p>
          <p className="measure mt-2 font-serif text-[1.3rem] leading-snug md:text-[1.45rem]">
            {item.scenario}
          </p>
        </div>
        <div className="md:col-span-4">
          <p className="eyebrow text-ink-2">{audiences.youGetLabel}</p>
          <ul className="border-line mt-3 border-t">
            {item.gets.map((g) => (
              <li key={g} className="border-line flex gap-3 border-b py-2.5">
                <span aria-hidden className="bg-copper mt-[0.7em] h-px w-3 shrink-0" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
