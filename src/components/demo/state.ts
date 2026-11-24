"use client";

import { useCallback, useMemo, useState } from "react";
import { villa, building } from "@/data/demo";

export type VillaSelection = { kind: "room" | "device"; id: string } | null;

export interface VillaState {
  lights: Record<string, boolean>;
  temps: Record<string, number>;
  roofLifted: boolean;
  flow: boolean;
  heatmap: boolean;
  leak: boolean;
  selected: VillaSelection;
}

export interface VillaActions {
  toggleLight: (roomId: string) => void;
  setTemp: (roomId: string, t: number) => void;
  setRoof: (v: boolean) => void;
  setFlow: (v: boolean) => void;
  setHeatmap: (v: boolean) => void;
  setLeak: (v: boolean) => void;
  select: (s: VillaSelection) => void;
}

export function useVillaState(initial?: Partial<VillaState>) {
  const [state, setState] = useState<VillaState>(() => ({
    lights: Object.fromEntries(villa.rooms.filter((r) => r.hasLamp).map((r) => [r.id, false])),
    temps: Object.fromEntries(villa.rooms.map((r) => [r.id, r.temp])),
    roofLifted: false,
    flow: false,
    heatmap: false,
    leak: false,
    selected: null,
    ...initial,
  }));
  const patch = useCallback((p: Partial<VillaState>) => setState((s) => ({ ...s, ...p })), []);
  const actions: VillaActions = useMemo(
    () => ({
      toggleLight: (id) =>
        setState((s) => ({ ...s, lights: { ...s.lights, [id]: !s.lights[id] } })),
      setTemp: (id, t) => setState((s) => ({ ...s, temps: { ...s.temps, [id]: t } })),
      setRoof: (v) => patch({ roofLifted: v }),
      setFlow: (v) => patch({ flow: v }),
      setHeatmap: (v) =>
        setState((s) => ({ ...s, heatmap: v, roofLifted: v ? true : s.roofLifted })),
      setLeak: (v) =>
        setState((s) => ({
          ...s,
          leak: v,
          roofLifted: v ? true : s.roofLifted,
          selected: v ? { kind: "device", id: "leak-tvatt" } : s.selected,
        })),
      select: (sel) =>
        setState((s) => {
          const indoor =
            sel &&
            (sel.kind === "room" ||
              villa.devices.find((d) => d.id === sel.id)?.floor === 0 ||
              villa.devices.find((d) => d.id === sel.id)?.floor === 1);
          return { ...s, selected: sel, roofLifted: indoor ? true : s.roofLifted };
        }),
    }),
    [patch],
  );
  return [state, actions] as const;
}

export type BuildingMode = "overview" | "energy" | "compliance" | "maintenance";
export type BuildingSelection =
  | { kind: "apartment"; id: string }
  | { kind: "floor"; floor: number }
  | { kind: "ftx" }
  | { kind: "type"; typeId: string }
  | null;

export interface BuildingState {
  mode: BuildingMode;
  exploded: boolean;
  selected: BuildingSelection;
}

export function useBuildingState() {
  const [state, setState] = useState<BuildingState>({
    mode: "overview",
    exploded: false,
    selected: null,
  });
  const actions = useMemo(
    () => ({
      setMode: (mode: BuildingMode) =>
        setState((s) => ({
          ...s,
          mode,
          exploded: mode === "energy" || mode === "maintenance" ? true : s.exploded,
          selected:
            mode === "energy"
              ? { kind: "ftx" as const }
              : mode === "maintenance"
                ? { kind: "apartment" as const, id: building.ticket.apartmentId }
                : s.selected,
        })),
      setExploded: (exploded: boolean) => setState((s) => ({ ...s, exploded })),
      select: (selected: BuildingSelection) => setState((s) => ({ ...s, selected })),
    }),
    [],
  );
  return [state, actions] as const;
}

export type BuildingActions = ReturnType<typeof useBuildingState>[1];
