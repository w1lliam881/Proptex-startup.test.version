"use client";

import { useState } from "react";
import { building, aptTypes, type Status } from "@/data/demo";
import { demo } from "@/content/sv";
import { StatusBadge } from "../ui";
import type { BuildingActions, BuildingMode, BuildingState } from "./state";

const u = demo.buildingUi;
const modes: BuildingMode[] = ["overview", "energy", "compliance", "maintenance"];

function energyStatus(v: number): { status: Status; text: string } {
  if (v > 1.2) return { status: "warn", text: `${Math.round((v - 1) * 100)} % över snittet` };
  if (v < 0.95) return { status: "ok", text: `${Math.round((1 - v) * 100)} % under snittet` };
  return { status: "ok", text: "Nära snittet" };
}

function Selection({ state }: { state: BuildingState }) {
  const sel = state.selected;
  if (!sel) return <p className="text-ink-2">{u.pickHint}</p>;
  if (sel.kind === "ftx") {
    const v = building.ventilation;
    return (
      <div>
        <p className="font-serif text-xl">{v.name}</p>
        <StatusBadge status={v.status} text={v.statusText} className="mt-1" />
        <p className="text-ink-2 mt-2 text-sm">{v.detail}</p>
      </div>
    );
  }
  if (sel.kind === "floor") {
    if (sel.floor === 0)
      return (
        <div>
          <p className="font-serif text-xl">{building.floorNames[0]}</p>
          <ul className="mt-2 space-y-2 text-sm">
            {building.basement.map((b) => (
              <li key={b.id}>
                <span className="font-semibold">{b.name}.</span>{" "}
                <span className="text-ink-2">{b.note}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    const apts = building.apartments.filter((a) => a.floor === sel.floor);
    const avg = apts.reduce((s, a) => s + a.energyIndex, 0) / apts.length;
    const open = apts.filter((a) => a.status !== "ok").length;
    return (
      <div>
        <p className="font-serif text-xl">{building.floorNames[sel.floor]}</p>
        <p className="text-ink-2 mt-1 text-sm">8 lägenheter, två trapphus.</p>
        <dl className="num mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-ink-2">Energi mot snitt</dt>
            <dd className="font-semibold">{Math.round(avg * 100)} %</dd>
          </div>
          <div>
            <dt className="text-ink-2">Att titta på</dt>
            <dd>
              <StatusBadge status={open ? "warn" : "ok"} text={open ? `${open} st` : "Inget"} />
            </dd>
          </div>
        </dl>
      </div>
    );
  }
  if (sel.kind === "type") {
    const ty = aptTypes.find((t) => t.id === sel.typeId)!;
    const n = building.apartments.filter((a) => a.typeId === ty.id).length;
    return (
      <div>
        <p className="font-serif text-xl">
          {ty.name}, {ty.area} m²
        </p>
        <p className="text-ink-2 mt-2 text-sm">
          Ritad en gång, placerad {n} gånger. Ändrar vi typen följer alla {n} lägenheter med.
        </p>
      </div>
    );
  }
  const a = building.apartments.find((x) => x.id === sel.id)!;
  const ty = aptTypes.find((t) => t.id === a.typeId)!;
  const e = energyStatus(a.energyIndex);
  return (
    <div>
      <p className="font-serif text-xl">
        {u.aptLabel} {a.id}
      </p>
      <p className="num text-ink-2 mt-1 text-sm">
        {ty.name}, {ty.area} m² · {building.floorNames[a.floor]}
      </p>
      <div className="mt-2 flex flex-col gap-1">
        <StatusBadge
          status={a.status}
          text={a.status === "ok" ? "Inget att anmärka" : "Att titta på"}
        />
        {state.mode === "energy" && <StatusBadge status={e.status} text={`Värme: ${e.text}`} />}
      </div>
      <p className="text-ink-2 mt-2 text-sm">{a.note}</p>
    </div>
  );
}

function AskHouse() {
  const [active, setActive] = useState<number | null>(null);
  const q = active === null ? null : building.questions[active];
  return (
    <div className="border-line border-t pt-4">
      <p className="font-serif text-xl">{u.askTitle}</p>
      <div className="border-line bg-paper mt-3 rounded-[3px] border p-3" aria-live="polite">
        {q ? (
          <div className="space-y-3 text-sm">
            <p className="bg-ink text-paper ml-auto w-fit max-w-[90%] rounded-[3px] px-3 py-2">
              {q.q}
            </p>
            <div className="max-w-[95%]">
              <p className="text-ink">{q.a}</p>
              <p className="text-ink-2 mt-1.5 text-xs">
                <span className="font-semibold">{u.sourceLabel}:</span> {q.source}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-ink-2 text-sm">{u.askPlaceholder}</p>
        )}
      </div>
      <ul className="mt-3 flex flex-col gap-1">
        {building.questions.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className="text-ink decoration-line hover:decoration-copper aria-pressed:bg-paper-deep w-full rounded-[3px] px-2 py-1.5 text-left text-sm underline underline-offset-4 transition-colors duration-200 aria-pressed:no-underline"
            >
              {item.q}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-ink-2 mt-2 text-xs">{u.askNote}</p>
    </div>
  );
}

export function BuildingPanel({
  state,
  actions,
}: {
  state: BuildingState;
  actions: BuildingActions;
}) {
  const sel = state.selected;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="eyebrow text-ink-2" id="bmodes">
          {u.modesLabel}
        </p>
        <div
          className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-2"
          role="group"
          aria-labelledby="bmodes"
        >
          {modes.map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={state.mode === m}
              onClick={() => actions.setMode(m)}
              className="border-line bg-paper hover:border-copper aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper rounded-[3px] border px-3 py-1.5 text-sm transition-colors duration-200"
            >
              {u.modes[m]}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={state.exploded}
          onClick={() => actions.setExploded(!state.exploded)}
          className="border-copper text-copper hover:bg-copper hover:text-paper aria-pressed:bg-copper aria-pressed:text-paper mt-2 w-full rounded-[3px] border px-3 py-1.5 text-sm font-semibold transition-colors duration-200"
        >
          {state.exploded ? u.implode : u.explode}
        </button>
      </div>

      <div className="border-line border-t pt-4 lg:min-h-[8rem]" aria-live="polite">
        <Selection state={state} />
      </div>

      {state.mode === "overview" && (
        <div className="border-line border-t pt-4">
          <p className="font-serif text-xl">{u.typesTitle}</p>
          <p className="text-ink-2 mt-1 text-sm">{u.typesText}</p>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {aptTypes.map((ty) => {
              const n = building.apartments.filter((a) => a.typeId === ty.id).length;
              const on = sel?.kind === "type" && sel.typeId === ty.id;
              return (
                <li key={ty.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => actions.select(on ? null : { kind: "type", typeId: ty.id })}
                    className="num border-line bg-paper hover:border-copper aria-pressed:border-copper w-full rounded-[3px] border px-2 py-2 text-left transition-colors duration-200"
                  >
                    <span className="block font-semibold">{ty.name}</span>
                    <span className="text-ink-2 block text-xs">1 ritning · ×{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="eyebrow text-ink-2 mt-4">{u.floorLabel}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {building.floorNames.map((n, i) => (
              <li key={n}>
                <button
                  type="button"
                  aria-pressed={sel?.kind === "floor" && sel.floor === i}
                  onClick={() => {
                    actions.select({ kind: "floor", floor: i });
                    if (i === 0 && !state.exploded) actions.setExploded(true);
                  }}
                  className="decoration-line hover:decoration-copper aria-pressed:bg-ink aria-pressed:text-paper rounded-[3px] px-2 py-1 text-sm underline underline-offset-4 aria-pressed:no-underline"
                >
                  {n}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.mode === "energy" && (
        <div className="border-line border-t pt-4">
          <p className="eyebrow text-ink-2">{u.legendEnergy}</p>
          <ul className="mt-2 flex gap-4 text-sm">
            {[
              ["#8ea7bb", u.legendLow, "▼"],
              ["#e6dac6", u.legendNormal, "●"],
              ["#c25a2a", u.legendHigh, "▲"],
            ].map(([c, l, g]) => (
              <li key={l} className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="text-ink grid h-4 w-4 place-items-center rounded-[2px] text-[9px]"
                  style={{ background: c }}
                >
                  {g}
                </span>
                {l}
              </li>
            ))}
          </ul>
          <p className="text-ink-2 mt-3 text-sm">
            Lägenhet 1203 sticker ut. Klicka på den, eller på aggregatet på taket.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => actions.select({ kind: "apartment", id: "1203" })}
              className="text-copper text-sm font-semibold underline underline-offset-4"
            >
              Visa lgh 1203
            </button>
            <button
              type="button"
              onClick={() => actions.select({ kind: "ftx" })}
              className="text-copper text-sm font-semibold underline underline-offset-4"
            >
              Visa aggregatet
            </button>
          </div>
        </div>
      )}

      {state.mode === "compliance" && (
        <div className="border-line border-t pt-4">
          <p className="font-serif text-xl">{u.complianceTitle}</p>
          <p className="text-ink-2 mt-1 text-xs font-semibold">{u.complianceNote}</p>
          <ul className="divide-line border-line mt-3 divide-y border-y">
            {building.compliance.map((c) => (
              <li key={c.id} className="py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{c.name}</span>
                  <StatusBadge status={c.status} text={c.statusText} className="shrink-0" />
                </div>
                <p className="num text-ink-2 mt-0.5 text-sm">
                  {u.nextDate}: {c.next}
                  {c.last !== "–" && <> · Senast: {c.last}</>}
                </p>
                <p className="text-ink-2 text-sm">{c.note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.mode === "maintenance" && (
        <div className="border-line border-t pt-4">
          <p className="font-serif text-xl">{u.maintenanceTitle}</p>
          <p className="text-ink-2 mt-1 text-sm">
            Exempel: <span className="text-ink">”{building.ticket.title}”</span>, från{" "}
            {building.ticket.from.toLowerCase()}.
          </p>
          <ol className="border-line mt-3 border-l">
            {building.ticket.steps.map((s, i) => (
              <li key={i} className="relative pb-3 pl-5 last:pb-0">
                <span
                  aria-hidden
                  className={`border-paper-deep absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full border-2 ${i === building.ticket.steps.length - 1 ? "bg-ok" : "bg-copper"}`}
                />
                <p className="num text-ink-2 text-xs font-semibold">{s.time}</p>
                <p className="text-sm">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <AskHouse />
    </div>
  );
}
