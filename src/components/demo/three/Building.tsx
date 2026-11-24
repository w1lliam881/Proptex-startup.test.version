"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { building, aptTypes, type AptType, type Apartment } from "@/data/demo";
import type { BuildingActions, BuildingState } from "../state";
import { wall, win, door, block, type Box } from "./walls";
import { Boxes, clay, claymat, unitBox, useEased } from "./shared";

const SH = building.storeyHeight;
const X2 = building.w / 2;
const Z2 = building.d / 2;
const GAP = 3.4;
const ET = 0.3;

export const explodeOffset = (index: number) => SH + index * GAP; // index 0 = källare

/* ---------- Lägenhetstyper: byggs en gång, återanvänds ---------- */

const typeFurniture: Record<AptType["id"], Box[]> = {
  "1rok": [
    block(0.3, 0, 3.4, 2.2, 0.5, 5.4),
    block(3.2, 0, 0.2, 5.8, 0.9, 0.8),
    block(3.4, 0, 4.2, 5.4, 0.42, 5.0),
  ],
  "2rok": [
    block(0.3, 0, 3.6, 2.3, 0.5, 5.6),
    block(5.0, 0, 3.4, 7.4, 0.42, 4.2),
    block(7.2, 0, 0.2, 8.8, 0.9, 2.2),
    block(1.0, 0, 0.6, 3.6, 0.5, 2.4),
  ],
  "3rok": [
    block(0.3, 0, 4.2, 2.3, 0.5, 6.2),
    block(0.3, 0, 0.4, 2.2, 0.5, 2.2),
    block(4.2, 0, 0.2, 7.6, 0.9, 0.8),
    block(5.0, 0, 4.4, 6.4, 0.5, 6.2),
    block(7.6, 0, 4.6, 9.6, 0.42, 5.4),
  ],
};

/** Typens innerväggar och möbler i lokala koordinater, beräknade en gång per typ. */
const typeGeometry = Object.fromEntries(
  aptTypes.map((ty) => [
    ty.id,
    {
      walls: ty.walls.flatMap(([x1, z1, x2, z2, d]) =>
        wall(x1, z1, x2, z2, { h: SH - 0.3, t: 0.1, openings: d === null ? [] : [door(d)] }),
      ),
      furniture: typeFurniture[ty.id],
    },
  ]),
) as Record<AptType["id"], { walls: Box[]; furniture: Box[] }>;

/** Placera en typs lådor på en lägenhets plats (med spegling). */
function place(boxes: Box[], a: Apartment, d: number): Box[] {
  return boxes.map((b) => ({
    p: [a.x + b.p[0], b.p[1], a.mirrorZ ? a.z + (d - b.p[2]) : a.z + b.p[2]],
    s: b.s,
  }));
}

function floorStructure(): Box[] {
  const h = SH - 0.3;
  const winsLong = (skip: number[][]) => {
    const list = [];
    for (let x = 1.25; x < building.w; x += 2.5) {
      const wx = x - X2;
      if (skip.some(([a, b]) => wx > a && wx < b)) continue;
      list.push(win(x, 1.3, 0.85, 2.2));
    }
    return list;
  };
  const stairSkip = building.stairs.map((s) => [s.x, s.x + s.w]);
  const stairWins = building.stairs.map((s) => ({
    at: s.x + s.w / 2 + X2,
    w: 1.2,
    y0: 0.3,
    y1: h - 0.2,
  }));
  const e = ET / 2;
  return [
    ...wall(-X2 - e, Z2, X2 + e, Z2, {
      h,
      t: ET,
      openings: [...winsLong(stairSkip), ...stairWins],
    }),
    ...wall(-X2 - e, -Z2, X2 + e, -Z2, {
      h,
      t: ET,
      openings: [...winsLong(stairSkip), ...stairWins],
    }),
    ...wall(-X2, -Z2, -X2, Z2, {
      h,
      t: ET,
      openings: [win(3.5, 1.3, 0.85, 2.2), win(10.5, 1.3, 0.85, 2.2)],
    }),
    ...wall(X2, -Z2, X2, Z2, {
      h,
      t: ET,
      openings: [win(3.5, 1.3, 0.85, 2.2), win(10.5, 1.3, 0.85, 2.2)],
    }),
    // mittvägg mellan fram- och bakre lägenheter (inte i trapphusen)
    ...wall(-X2, 0, -10, 0, { h, t: 0.2 }),
    ...wall(-6, 0, 6, 0, { h, t: 0.2 }),
    ...wall(10, 0, X2, 0, { h, t: 0.2 }),
    // lägenhetsskiljande väggar och trapphusväggar med entrédörrar
    ...wall(-10, -Z2, -10, Z2, { h, t: 0.2, openings: [door(3.2), door(10.6)] }),
    ...wall(-6, -Z2, -6, Z2, { h, t: 0.2, openings: [door(3.2), door(10.6)] }),
    ...wall(0, -Z2, 0, Z2, { h, t: 0.2 }),
    ...wall(6, -Z2, 6, Z2, { h, t: 0.2, openings: [door(3.2), door(10.6)] }),
    ...wall(10, -Z2, 10, Z2, { h, t: 0.2, openings: [door(10.6)] }),
    ...wall(11, -Z2, 11, -4.5, { h, t: 0.15 }),
    ...wall(10, -4.5, 11, -4.5, { h, t: 0.15 }),
  ];
}

function stairBoxes(): { light: Box[]; dark: Box[] } {
  const light: Box[] = [];
  const dark: Box[] = [];
  building.stairs.forEach((s) => {
    // två trapplopp
    for (let i = 0; i < 9; i++) {
      light.push(block(s.x + 0.2, 0, 1.2 + i * 0.28, s.x + 1.9, (i + 1) * 0.16, 1.48 + i * 0.28));
      light.push(
        block(s.x + 2.1, 1.45, 5.2 - i * 0.28, s.x + 3.8, 1.45 + (i + 1) * 0.16, 5.48 - i * 0.28),
      );
    }
    light.push(block(s.x + 0.2, 1.3, 4.0, s.x + 3.8, 1.45, 6.6));
    // hisschakt
    dark.push(block(s.x + 0.6, 0, -3.2, s.x + 3.4, SH - 0.3, -0.6));
  });
  return { light, dark };
}

const structure = floorStructure();
const stairs = stairBoxes();

/* ---------- Färger per läge ---------- */

const typeTone: Record<AptType["id"], string> = {
  "1rok": "#e6d9c3",
  "2rok": "#d9c6a8",
  "3rok": "#cbb391",
};
const energyLow = new THREE.Color("#8ea7bb");
const energyMid = new THREE.Color("#e6dac6");
const energyHigh = new THREE.Color("#c25a2a");

function tileColor(a: Apartment, state: BuildingState): THREE.Color {
  const sel = state.selected;
  if (sel?.kind === "apartment" && sel.id === a.id) return new THREE.Color(clay.copper);
  if (state.mode === "energy") {
    const v = a.energyIndex;
    return v < 1
      ? energyMid.clone().lerp(energyLow, Math.min(1, (1 - v) / 0.2))
      : energyMid.clone().lerp(energyHigh, Math.min(1, (v - 1) / 0.35));
  }
  if (state.mode === "maintenance" && a.id === building.ticket.apartmentId)
    return new THREE.Color(clay.copperLight);
  if (sel?.kind === "type")
    return new THREE.Color(sel.typeId === a.typeId ? clay.copperLight : "#e9e2d5");
  if (sel?.kind === "floor" && sel.floor === a.floor)
    return new THREE.Color(typeTone[a.typeId]).multiplyScalar(1.04);
  if (state.mode === "overview") return new THREE.Color(typeTone[a.typeId]);
  return new THREE.Color("#e4dac9");
}

/* ---------- Komponenter ---------- */

function Tiles({
  apartments,
  state,
  onPick,
}: {
  apartments: Apartment[];
  state: BuildingState;
  onPick: (a: Apartment) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    apartments.forEach((a, i) => {
      const ty = aptTypes.find((x) => x.id === a.typeId)!;
      m.compose(
        new THREE.Vector3(a.x + ty.w / 2, 0.03, a.z + ty.d / 2),
        q,
        new THREE.Vector3(ty.w - 0.25, 0.06, ty.d - 0.25),
      );
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [apartments]);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    apartments.forEach((a, i) => mesh.setColorAt(i, tileColor(a, state)));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    invalidate();
  }, [apartments, state, invalidate]);
  return (
    <instancedMesh
      ref={ref}
      args={[unitBox, claymat("#ffffff", 0.95), apartments.length]}
      receiveShadow
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (e.instanceId !== undefined) onPick(apartments[e.instanceId]);
      }}
    />
  );
}

/** Sänker väggarna när våningarna lyfts isär, så att planen går att läsa uppifrån. */
function CutWalls({ exploded, children }: { exploded: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const v = useEased(exploded ? 1 : 0, 4);
  useFrame(() => {
    if (ref.current) ref.current.scale.y = 1 - v.current * 0.6;
  });
  return <group ref={ref}>{children}</group>;
}

function StoreyContent({
  floor,
  state,
  actions,
}: {
  floor: number;
  state: BuildingState;
  actions: BuildingActions;
}) {
  const apartments = useMemo(() => building.apartments.filter((a) => a.floor === floor), [floor]);
  const interior = useMemo(
    () => ({
      walls: apartments.flatMap((a) =>
        place(typeGeometry[a.typeId].walls, a, aptTypes.find((x) => x.id === a.typeId)!.d),
      ),
      furniture: apartments.flatMap((a) =>
        place(typeGeometry[a.typeId].furniture, a, aptTypes.find((x) => x.id === a.typeId)!.d),
      ),
    }),
    [apartments],
  );
  const floorSelected = state.selected?.kind === "floor" && state.selected.floor === floor;
  const wallTint = useMemo(() => {
    if (state.mode !== "energy") return floorSelected ? "#f3dccb" : clay.wall;
    const avg = apartments.reduce((s, a) => s + a.energyIndex, 0) / apartments.length;
    return avg > 1.02 ? "#efd6c4" : avg < 0.97 ? "#dfe4e6" : clay.wall;
  }, [state.mode, apartments, floorSelected]);
  return (
    <>
      <Boxes
        boxes={[block(-X2, -0.25, -Z2, X2, 0, Z2)]}
        color={floorSelected ? clay.copperLight : clay.wallInner}
        variation={0}
        onClick={(e) => {
          e.stopPropagation();
          actions.select({ kind: "floor", floor });
        }}
      />
      <Tiles
        apartments={apartments}
        state={state}
        onPick={(a) => actions.select({ kind: "apartment", id: a.id })}
      />
      <CutWalls exploded={state.exploded}>
        <Boxes boxes={structure} color={wallTint} key={wallTint} />
        <Boxes boxes={interior.walls} color={clay.wallInner} />
        <Boxes
          boxes={stairs.dark}
          color={state.mode === "compliance" ? clay.warn : clay.marin}
          variation={0}
          key={state.mode}
        />
      </CutWalls>
      <Boxes boxes={interior.furniture} color={clay.furnitureDark} />
      <Boxes boxes={stairs.light} color={clay.furniture} />
      {state.mode === "maintenance" && floor === 4 && (
        <Html position={[3, 1.6, -3.5]} center zIndexRange={[20, 10]}>
          <span className="bg-paper text-ink pointer-events-none inline-flex items-center gap-1.5 rounded-[3px] px-2 py-1 text-xs font-semibold whitespace-nowrap shadow">
            <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
              <path d="M8 2.5l6 11H2z" fill="none" stroke="#8A5A0C" strokeWidth="1.8" />
            </svg>
            Felanmälan, lgh 1304
          </span>
        </Html>
      )}
    </>
  );
}

function Basement({ state, actions }: { state: BuildingState; actions: BuildingActions }) {
  const walls = useMemo(
    () => [
      ...wall(-X2, -Z2, X2, -Z2, { h: SH - 0.3, t: ET }),
      ...wall(-X2, Z2, X2, Z2, { h: SH - 0.3, t: ET }),
      ...wall(-X2, -Z2, -X2, Z2, { h: SH - 0.3, t: ET }),
      ...wall(X2, -Z2, X2, Z2, { h: SH - 0.3, t: ET }),
      ...wall(-X2, 0, -6, 0, { h: SH - 0.3, t: 0.2, openings: [door(6)] }),
      ...wall(6, 0, X2, 0, { h: SH - 0.3, t: 0.2, openings: [door(8)] }),
      ...wall(-6, -Z2, -6, Z2, { h: SH - 0.3, t: 0.2, openings: [door(10.5)] }),
      ...wall(6, -Z2, 6, Z2, { h: SH - 0.3, t: 0.2, openings: [door(10.5)] }),
      ...wall(-10, -Z2, -10, 0, { h: SH - 0.3, t: 0.2, openings: [door(3)] }),
      ...wall(10, -Z2, 10, 0, { h: SH - 0.3, t: 0.2, openings: [door(3)] }),
    ],
    [],
  );
  const equipment = useMemo(
    () => [
      block(-19, 0, -6.4, -16.5, 1.8, -4.8), // fjärrvärmecentral
      block(-15.5, 0, -6.6, -13, 2.0, -6.1), // elcentral
      ...[0, 1, 2].map((i) => block(11 + i * 1.0, 0, -6.6, 11.8 + i * 1.0, 0.85, -5.9)), // tvättmaskiner
      ...Array.from({ length: 10 }, (_, i) =>
        block(-5.5 + i * 1.1, 0, 4.2, -4.6 + i * 1.1, 2.2, 6.6),
      ), // förråd
    ],
    [],
  );
  return (
    <>
      <Boxes
        boxes={[block(-X2, -0.25, -Z2, X2, 0, Z2)]}
        color={
          state.selected?.kind === "floor" && state.selected.floor === 0
            ? clay.copperLight
            : clay.floor
        }
        variation={0}
        onClick={(e) => {
          e.stopPropagation();
          actions.select({ kind: "floor", floor: 0 });
        }}
      />
      <Boxes boxes={walls} color={clay.wallInner} />
      <Boxes boxes={equipment} color={clay.furnitureDark} />
      <Boxes boxes={stairs.light} color={clay.furniture} />
      <Boxes boxes={stairs.dark} color={clay.marin} variation={0} />
    </>
  );
}

function RoofLevel({ state, actions }: { state: BuildingState; actions: BuildingActions }) {
  const parapet = useMemo(
    () => [
      block(-X2 - 0.15, 0, Z2 - 0.3, X2 + 0.15, 0.6, Z2),
      block(-X2 - 0.15, 0, -Z2, X2 + 0.15, 0.6, -Z2 + 0.3),
      block(-X2 - 0.15, 0, -Z2, -X2 + 0.15, 0.6, Z2),
      block(X2 - 0.15, 0, -Z2, X2 + 0.15, 0.6, Z2),
      ...building.stairs.map((s) => block(s.x + 0.3, 0, -3.6, s.x + 3.7, 2.2, 0.2)), // hissmaskinrum
    ],
    [],
  );
  const panels = useMemo(() => {
    const list: Box[] = [];
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 12; c++)
        list.push({
          p: [-4 + c * 1.9, 0.55, -5 + r * 3.0 + (r > 1 ? 1.4 : 0)],
          s: [1.75, 0.06, 1.1],
          r: [0.35, 0, 0],
        });
    return list;
  }, []);
  const ftxSel = state.selected?.kind === "ftx";
  const anomaly = state.mode === "energy" || state.mode === "compliance" || ftxSel;
  const v = building.ventilation;
  return (
    <>
      <Boxes boxes={[block(-X2, -0.3, -Z2, X2, 0, Z2)]} color={clay.roof} variation={0} />
      <Boxes boxes={parapet} color={clay.wall} />
      <Boxes boxes={panels} color={clay.solar} variation={0.01} />
      <group position={v.position}>
        <mesh
          position={[0, 0.9, 0]}
          scale={[4.2, 1.8, 2.6]}
          geometry={unitBox}
          material={claymat(anomaly ? clay.copper : clay.furniture)}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            actions.select({ kind: "ftx" });
          }}
        />
        <mesh
          position={[2.6, 0.6, 0]}
          scale={[1.0, 0.6, 0.6]}
          geometry={unitBox}
          material={claymat(clay.furnitureDark)}
          castShadow
        />
        {anomaly && <Pulse />}
        <Html position={[0, 2.6, 0]} center zIndexRange={[20, 10]}>
          <button
            type="button"
            onClick={() => actions.select({ kind: "ftx" })}
            aria-label={`${v.name}: ${v.statusText}`}
            className={`inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-1 text-xs font-semibold whitespace-nowrap shadow transition-colors duration-200 ${
              ftxSel
                ? "border-copper bg-copper text-paper"
                : "border-line bg-paper text-ink hover:border-copper"
            }`}
          >
            {anomaly && (
              <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
                <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M8 4.8v3.8M8 11v.1"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
            FTX{anomaly ? ` · ${v.statusText}` : ""}
          </button>
        </Html>
      </group>
    </>
  );
}

function Pulse() {
  const ref = useRef<THREE.Mesh>(null);
  const tt = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  useFrame((_, dt) => {
    tt.current = (tt.current + dt * 0.6) % 1;
    if (ref.current) {
      const s = 1 + tt.current * 1.6;
      ref.current.scale.set(s, s, s);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - tt.current);
    }
    invalidate();
  });
  return (
    <mesh ref={ref} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2.6, 2.8, 48]} />
      <meshBasicMaterial color={clay.copper} transparent depthWrite={false} />
    </mesh>
  );
}

function Level({
  index,
  exploded,
  children,
  label,
  onLabel,
  selected,
}: {
  index: number;
  exploded: boolean;
  children: React.ReactNode;
  label: string;
  onLabel: () => void;
  selected: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const e = useEased(exploded ? 1 : 0, 3 - index * 0.15);
  const base = (index - 1) * SH;
  useFrame(() => {
    if (ref.current) ref.current.position.y = base + e.current * explodeOffset(index);
  });
  return (
    <group ref={ref} position={[0, base, 0]}>
      {children}
      {exploded && (
        <Html position={[-X2 - 1.2, 0.6, Z2]} center zIndexRange={[20, 10]}>
          <button
            type="button"
            onClick={onLabel}
            aria-pressed={selected}
            className={`rounded-[3px] border px-2 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
              selected
                ? "border-copper bg-copper text-paper"
                : "border-line bg-paper/90 text-ink hover:border-copper"
            }`}
          >
            {label}
          </button>
        </Html>
      )}
    </group>
  );
}

export function BuildingModel({
  state,
  actions,
}: {
  state: BuildingState;
  actions: BuildingActions;
}) {
  const ground = useMemo(
    () => [
      block(-30, -3.4, Z2 + 0.05, 30, -0.02, 16),
      block(-30, -3.4, -16, 30, -0.02, -Z2 - 0.05),
      block(-30, -3.4, -Z2 - 0.05, -X2 - 0.05, -0.02, Z2 + 0.05),
      block(X2 + 0.05, -3.4, -Z2 - 0.05, 30, -0.02, Z2 + 0.05),
    ],
    [],
  );
  const site = useMemo(
    () => [
      ...building.stairs.map((s) => block(s.x + 0.8, -0.02, Z2, s.x + 3.2, 0.02, 16)), // gångar
      block(-28, -0.02, 9, 28, 0.03, 9.8), // trottoar
    ],
    [],
  );
  const sel = state.selected;
  return (
    <group onPointerMissed={() => actions.select(null)}>
      <Boxes boxes={ground} color={clay.plinth} variation={0} />
      <Boxes boxes={site} color={clay.deck} variation={0} />
      <Level
        index={0}
        exploded={state.exploded}
        label={building.floorNames[0]}
        onLabel={() => actions.select({ kind: "floor", floor: 0 })}
        selected={sel?.kind === "floor" && sel.floor === 0}
      >
        <group position={[0, 0, 0]}>
          <Basement state={state} actions={actions} />
        </group>
      </Level>
      {Array.from({ length: building.floors }, (_, i) => i + 1).map((f) => (
        <Level
          key={f}
          index={f}
          exploded={state.exploded}
          label={building.floorNames[f]}
          onLabel={() => actions.select({ kind: "floor", floor: f })}
          selected={sel?.kind === "floor" && sel.floor === f}
        >
          <StoreyContent floor={f} state={state} actions={actions} />
        </Level>
      ))}
      <Level
        index={building.floors + 1}
        exploded={state.exploded}
        label="Tak"
        onLabel={() => actions.select({ kind: "ftx" })}
        selected={sel?.kind === "ftx"}
      >
        <RoofLevel state={state} actions={actions} />
      </Level>
    </group>
  );
}
