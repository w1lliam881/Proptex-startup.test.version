"use client";

import { Html } from "@react-three/drei";
import type { VillaDevice, VillaDeviceType } from "@/data/demo";
import type { VillaActions, VillaState } from "../state";

const glyph: Record<VillaDeviceType, string> = {
  lamp: "M8 3a3.5 3.5 0 0 1 2 6.4V11H6V9.4A3.5 3.5 0 0 1 8 3zM6.5 13h3",
  thermostat: "M8 2.5v7.2a2.3 2.3 0 1 1-1.6 0V2.5zM10 4h2M10 6.5h2",
  heatpump: "M3 4h10v8H3zM8 6.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z",
  charger: "M9 2.5L5 9h3l-1 4.5L11 7H8z",
  solar: "M2.5 11.5l2-7h7l2 7zM4 8h8M8 4.5v7",
  leak: "M8 2.5C6 6 4.5 7.8 4.5 9.8a3.5 3.5 0 0 0 7 0C11.5 7.8 10 6 8 2.5z",
  meter: "M3 11a5 5 0 1 1 10 0M8 11l2.2-3",
};

export function DeviceMarker({
  device,
  state,
  actions,
}: {
  device: VillaDevice;
  state: VillaState;
  actions: VillaActions;
}) {
  const selected = state.selected?.kind === "device" && state.selected.id === device.id;
  const alarm = state.leak && device.id === "leak-tvatt";
  return (
    <Html position={device.position} center zIndexRange={[20, 10]}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          actions.select(selected ? null : { kind: "device", id: device.id });
        }}
        aria-label={`${device.name}${alarm ? ", larm: läckage" : ""}`}
        aria-pressed={selected}
        className={`grid h-8 w-8 place-items-center rounded-full border shadow-[0_1px_4px_rgba(7,20,38,0.25)] transition-[transform,background-color] duration-200 hover:scale-110 ${
          alarm
            ? "border-bad bg-bad text-paper"
            : selected
              ? "border-copper bg-copper text-paper"
              : "border-line bg-paper text-ink"
        }`}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
          <path
            d={glyph[device.type]}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Html>
  );
}
