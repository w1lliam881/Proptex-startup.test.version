"use client";

import { useEffect, useState } from "react";
import { villa } from "@/data/demo";
import { demo } from "@/content/sv";
import { StatusBadge } from "../ui";
import type { VillaActions, VillaState } from "./state";
import { UsageChart } from "./UsageChart";

const u = demo.villaUi;

function useUsage(state: VillaState) {
  const [hist, setHist] = useState<number[]>(() =>
    Array.from({ length: 36 }, (_, i) => 1.1 + Math.sin(i / 4) * 0.25),
  );
  const [now, setNow] = useState({ solar: 2.6, house: 1.2, car: 0 });
  useEffect(() => {
    const tick = () => {
      const lamps = Object.values(state.lights).filter(Boolean).length;
      const heat = Object.values(state.temps).reduce((s, t) => s + Math.max(0, t - 17), 0);
      const house =
        villa.usage.baseKw +
        lamps * villa.usage.lampKw +
        heat * villa.usage.perDegreeKw * 0.12 +
        Math.random() * 0.12;
      const car = state.flow ? villa.usage.chargerKw : 0;
      const solar = villa.usage.solarPeakKw * (0.62 + Math.random() * 0.06);
      setNow({ solar, house, car });
      setHist((h) => [...h.slice(1), house + car]);
    };
    tick();
    const id = setInterval(tick, 1600);
    return () => clearInterval(id);
  }, [state.lights, state.temps, state.flow]);
  return { hist, now };
}

function Toggle({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="border-line bg-paper text-ink hover:border-copper aria-pressed:border-copper aria-pressed:bg-copper aria-pressed:text-paper rounded-[3px] border px-3 py-1.5 text-sm transition-colors duration-200"
    >
      {children}
    </button>
  );
}

function TempControl({
  roomId,
  state,
  actions,
}: {
  roomId: string;
  state: VillaState;
  actions: VillaActions;
}) {
  const v = state.temps[roomId];
  return (
    <div className="mt-4">
      <label htmlFor={`temp-${roomId}`} className="flex items-baseline justify-between text-sm">
        <span className="text-ink-2">{u.tempLabel}</span>
        <span className="num font-semibold">{v.toFixed(1)} °C</span>
      </label>
      <input
        id={`temp-${roomId}`}
        type="range"
        min={16}
        max={25}
        step={0.5}
        value={v}
        onChange={(e) => {
          actions.setTemp(roomId, Number(e.target.value));
          if (!state.heatmap) actions.setHeatmap(true);
        }}
        className="mt-2 w-full accent-[var(--copper)]"
      />
    </div>
  );
}

export function VillaPanel({ state, actions }: { state: VillaState; actions: VillaActions }) {
  const { hist, now } = useUsage(state);
  const sel = state.selected;
  const device = sel?.kind === "device" ? villa.devices.find((d) => d.id === sel.id) : undefined;
  const room =
    sel?.kind === "room"
      ? villa.rooms.find((r) => r.id === sel.id)
      : device?.roomId
        ? villa.rooms.find((r) => r.id === device.roomId)
        : undefined;
  const leakHere = state.leak && device?.id === "leak-tvatt";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Styr villan">
        <Toggle pressed={state.roofLifted} onClick={() => actions.setRoof(!state.roofLifted)}>
          {state.roofLifted ? u.lowerRoof : u.liftRoof}
        </Toggle>
        <Toggle pressed={state.flow} onClick={() => actions.setFlow(!state.flow)}>
          {u.flow}
        </Toggle>
        <Toggle pressed={state.heatmap} onClick={() => actions.setHeatmap(!state.heatmap)}>
          Värmekarta
        </Toggle>
        <Toggle pressed={state.leak} onClick={() => actions.setLeak(!state.leak)}>
          {state.leak ? u.leakStop : u.leak}
        </Toggle>
      </div>

      <div aria-live="polite">
        {state.leak && (
          <div role="alert" className="border-bad bg-paper border-l-2 px-4 py-3">
            <StatusBadge status="bad" text={u.leakAlert} />
            <p className="text-ink mt-1 text-sm">{u.leakAlertText}</p>
          </div>
        )}
      </div>

      <div className="border-line border-t pt-4 lg:min-h-[9rem]" aria-live="polite">
        {!device && !room && <p className="text-ink-2">{u.nothingSelected}</p>}
        {device && (
          <div>
            <p className="font-serif text-xl">{device.name}</p>
            <StatusBadge
              status={leakHere ? "bad" : device.status}
              text={
                leakHere
                  ? "Fukt upptäckt"
                  : device.status === "ok" && device.type === "thermostat"
                    ? `${state.temps[device.roomId!].toFixed(1)} °C`
                    : device.statusText
              }
              className="mt-1"
            />
            <p className="text-ink-2 mt-2 text-sm">{device.detail}</p>
            {device.type === "thermostat" && device.roomId && (
              <TempControl roomId={device.roomId} state={state} actions={actions} />
            )}
          </div>
        )}
        {!device && room && (
          <div>
            <p className="font-serif text-xl">{room.name}</p>
            <p className="num text-ink-2 mt-1 text-sm">
              {((room.rect[2] - room.rect[0]) * (room.rect[3] - room.rect[1])).toFixed(0)} m² ·{" "}
              {room.floor === 0 ? "entréplan" : "övre plan"}
            </p>
            {room.hasLamp && (
              <button
                type="button"
                onClick={() => actions.toggleLight(room.id)}
                aria-pressed={!!state.lights[room.id]}
                className="border-line hover:border-copper aria-pressed:border-copper aria-pressed:bg-copper aria-pressed:text-paper mt-3 inline-flex items-center gap-2 rounded-[3px] border px-3 py-1.5 text-sm transition-colors duration-200"
              >
                <span
                  aria-hidden
                  className={`h-2 w-2 rounded-full ${state.lights[room.id] ? "bg-paper" : "bg-ink-2"}`}
                />
                Taklampan: {state.lights[room.id] ? "tänd" : "släckt"} ·{" "}
                {state.lights[room.id] ? u.lampOff : u.lampOn}
              </button>
            )}
            <TempControl roomId={room.id} state={state} actions={actions} />
          </div>
        )}
      </div>

      <div className="border-line border-t pt-4">
        <p className="eyebrow text-ink-2">{u.usageTitle}</p>
        <UsageChart values={hist} unit={u.usageUnit} label={u.usageTitle} />
        <dl className="num mt-3 grid grid-cols-3 gap-2 text-sm">
          {[
            [u.solarNow, now.solar],
            [u.houseNow, now.house],
            [u.carNow, now.car],
          ].map(([k, v]) => (
            <div key={k as string}>
              <dt className="text-ink-2">{k}</dt>
              <dd className="font-semibold">{(v as number).toFixed(1)} kW</dd>
            </div>
          ))}
        </dl>
        <p className="text-ink-2 mt-2 text-xs">{u.usageNote}</p>
      </div>

      <div className="border-line border-t pt-4">
        <p className="eyebrow text-ink-2">{u.roomsLabel}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {villa.rooms.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                aria-pressed={sel?.kind === "room" && sel.id === r.id}
                onClick={() => actions.select({ kind: "room", id: r.id })}
                className="text-ink decoration-line hover:decoration-copper aria-pressed:bg-ink aria-pressed:text-paper rounded-[3px] px-2 py-1 text-sm underline underline-offset-4 aria-pressed:no-underline"
              >
                {r.name}
                {state.lights[r.id] && <span className="sr-only"> (tänt)</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className="eyebrow text-ink-2 mt-4">{u.devicesLabel}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {villa.devices.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                aria-pressed={sel?.kind === "device" && sel.id === d.id}
                onClick={() => actions.select({ kind: "device", id: d.id })}
                className="text-ink decoration-line hover:decoration-copper aria-pressed:bg-ink aria-pressed:text-paper rounded-[3px] px-2 py-1 text-sm underline underline-offset-4 aria-pressed:no-underline"
              >
                {d.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
