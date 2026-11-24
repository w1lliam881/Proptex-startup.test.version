"use client";

import { useEffect } from "react";
import { hero } from "@/content/sv";
import { DemoFrame } from "./demo/DemoFrame";
import { useVillaState } from "./demo/state";

export function HeroDemo() {
  const [state, actions] = useVillaState({
    lights: {
      vardagsrum: true,
      kok: true,
      matplats: false,
      hall: true,
      sovrum1: false,
      sovrum2: true,
      allrum: false,
      sovrum3: false,
    },
  });
  useEffect(() => {
    const t = setTimeout(() => actions.setRoof(true), 1400);
    return () => clearTimeout(t);
  }, [actions]);

  const chip =
    "rounded-[3px] border border-line-dark bg-marin/70 px-3 py-1.5 text-sm text-paper transition-colors duration-200 hover:border-copper-light aria-pressed:border-copper-light aria-pressed:text-copper-light";
  return (
    <DemoFrame
      scene="villa"
      variant="hero"
      villaState={state}
      villaActions={actions}
      dark
      className="h-[62vh] min-h-[380px] w-full md:h-[min(78vh,760px)]"
      overlay={
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-wrap items-end justify-between gap-3 px-1 md:bottom-6">
          <div
            className="pointer-events-auto flex flex-wrap gap-2"
            role="group"
            aria-label="Styr modellen"
          >
            <button
              type="button"
              className={chip}
              aria-pressed={state.roofLifted}
              onClick={() => actions.setRoof(!state.roofLifted)}
            >
              {state.roofLifted ? hero.lowerRoof : hero.liftRoof}
            </button>
            <button
              type="button"
              className={chip}
              aria-pressed={state.flow}
              onClick={() => actions.setFlow(!state.flow)}
            >
              {state.flow ? hero.hideFlow : hero.showFlow}
            </button>
          </div>
          <p className="text-paper-muted text-xs">{hero.hint}</p>
        </div>
      }
    />
  );
}
