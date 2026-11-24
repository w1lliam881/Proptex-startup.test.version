"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";
import { demo } from "@/content/sv";
import { villa, building } from "@/data/demo";
import { SimulatedTag } from "../ui";
import { ScribbleArrow } from "../Scribbles";
import { DemoFrame } from "./DemoFrame";
import { useBuildingState, useVillaState } from "./state";
import { VillaPanel } from "./VillaPanel";
import { BuildingPanel } from "./BuildingPanel";

export function DemoSection() {
  const [scene, setScene] = useState<"villa" | "building">("villa");
  const [vState, vActions] = useVillaState({
    roofLifted: true,
    lights: {
      vardagsrum: true,
      kok: false,
      matplats: false,
      hall: false,
      sovrum1: false,
      sovrum2: false,
      allrum: false,
      sovrum3: false,
    },
  });
  const [bState, bActions] = useBuildingState();
  const info = scene === "villa" ? villa : building;

  return (
    <div>
      <div className="grid-12 items-end gap-y-4">
        <Reveal className="relative col-span-12 md:col-span-5">
          <p id="demo-switch" className="eyebrow text-ink-2">
            {demo.switchLabel}
          </p>
          <div
            role="radiogroup"
            aria-labelledby="demo-switch"
            className="border-ink mt-2 inline-flex rounded-[4px] border p-1"
          >
            {(["villa", "building"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={scene === s}
                onClick={() => setScene(s)}
                onKeyDown={(e) => {
                  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    const next = s === "villa" ? "building" : "villa";
                    setScene(next);
                    (
                      e.currentTarget.parentElement?.querySelector(
                        `[data-s=${next}]`,
                      ) as HTMLElement | null
                    )?.focus();
                  }
                }}
                tabIndex={scene === s ? 0 : -1}
                data-s={s}
                className="aria-checked:bg-ink aria-checked:text-paper rounded-[3px] px-5 py-2 text-[0.95rem] font-semibold transition-colors duration-200"
              >
                {s === "villa" ? demo.villa : demo.building}
              </button>
            ))}
          </div>
          <ScribbleArrow className="text-copper-graphic pointer-events-none absolute -top-6 left-[15.5rem] hidden h-14 w-24 rotate-[8deg] md:block" />
        </Reveal>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <p className="font-serif text-xl">{info.name}</p>
          <p className="text-ink-2">{info.summary}</p>
        </div>
      </div>

      <p className="sr-only">{demo.srDescription}</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 lg:gap-8">
        <div className="border-line bg-paper-deep relative overflow-hidden rounded-[4px] border lg:col-span-8">
          <DemoFrame
            key={scene}
            scene={scene}
            variant="full"
            villaState={vState}
            villaActions={vActions}
            buildingState={bState}
            buildingActions={bActions}
            className="h-[58vh] min-h-[360px] lg:h-[680px]"
          />
          <SimulatedTag className="bg-paper/85 pointer-events-none absolute top-3 left-4 rounded-[3px] px-2 py-1" />
        </div>
        <aside
          aria-label={
            scene === "villa" ? "Villans reglage och status" : "Flerbostadshusets lägen och status"
          }
          className="border-line bg-paper-deep relative -mt-4 rounded-t-[10px] border px-5 pt-6 pb-6 shadow-[0_-8px_24px_rgba(7,20,38,0.08)] lg:col-span-4 lg:mt-0 lg:max-h-[680px] lg:overflow-y-auto lg:rounded-[4px] lg:shadow-none"
        >
          <span
            aria-hidden
            className="bg-line absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full lg:hidden"
          />
          {scene === "villa" ? (
            <VillaPanel state={vState} actions={vActions} />
          ) : (
            <BuildingPanel state={bState} actions={bActions} />
          )}
        </aside>
      </div>
    </div>
  );
}
