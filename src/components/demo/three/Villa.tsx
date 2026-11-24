"use client";

import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { villa, type VillaDevice } from "@/data/demo";
import { hero as heroText } from "@/content/sv";
import type { VillaActions, VillaState } from "../state";
import { wall, win, door, block, type Box } from "./walls";
import { Boxes, clay, claymat, radialTexture, tempColor, unitBox, useEased } from "./shared";
import { DeviceMarker } from "./Markers";

const H = villa.storeyHeight;
const W2 = villa.footprint.w / 2;
const D2 = villa.footprint.d / 2;
const ET = 0.25; // ytterväggens tjocklek
const IT = 0.1; // innervägg
const pitch = (villa.roofPitchDeg * Math.PI) / 180;
const rise = D2 * Math.tan(pitch);

/* ---------- Geometri, byggs en gång ---------- */

function exteriorWalls(floor: 0 | 1) {
  const e = ET / 2;
  const front =
    floor === 0
      ? [win(2 + e, 1.4), win(4 + e, 1.2), door(7 + e, 1.0), win(10.3 + e, 0.6, 1.4, 2.0)]
      : [win(2.5 + e, 1.4), win(6.75 + e, 1.8), win(10.2 + e, 1.2)];
  const back =
    floor === 0
      ? [{ at: 2.8 + e, w: 2.6, y0: 0, y1: 2.2 }, win(8.5 + e, 1.8, 1.05), win(10.8 + e, 0.8, 1.05)]
      : [win(2.5 + e, 1.4), win(6.8 + e, 1.6), win(10.3 + e, 0.6, 1.4, 2.0)];
  const left = floor === 0 ? [win(2.5, 1.4), win(7.3, 1.6)] : [win(2.2, 1.2), win(6.8, 1.2)];
  const right =
    floor === 0 ? [win(2, 1.4, 1.05), door(5.5, 0.9)] : [win(1.5, 0.6, 1.4, 2.0), win(6, 1.2)];
  const fixed = [
    ...wall(-W2 - e, -D2, W2 + e, -D2, { h: H, t: ET, openings: back }),
    ...wall(-W2, -D2, -W2, D2, { h: H, t: ET, openings: left }),
  ];
  // Fram- och högervägg kan "skäras" ner som i ett dockhus
  const cut = [
    ...wall(-W2 - e, D2, W2 + e, D2, { h: H, t: ET, openings: front }),
    ...wall(W2, -D2, W2, D2, { h: H, t: ET, openings: right }),
  ];
  return { fixed, cut };
}

function interiorWalls(floor: 0 | 1): Box[] {
  const h = H - 0.02;
  if (floor === 0)
    return [
      ...wall(-0.5, -D2, -0.5, D2, {
        h,
        t: IT,
        openings: [{ at: 2.3, w: 2.6, y0: 0, y1: 2.3 }, door(7)],
      }),
      ...wall(-W2, 1, -5, 1, { h, t: IT }),
      ...wall(-0.5, 0, W2, 0, { h, t: IT, openings: [door(1.5)] }),
      ...wall(2.5, 0, 2.5, D2, { h, t: IT, openings: [door(1.1), door(3.4)] }),
      ...wall(2.5, 2.2, W2, 2.2, { h, t: IT }),
    ];
  return [
    ...wall(-1, -D2, -1, D2, { h, t: IT, openings: [door(3.5), door(5.7)] }),
    ...wall(-W2, 0, -1, 0, { h, t: IT }),
    ...wall(2.5, -D2, 2.5, D2, { h, t: IT, openings: [door(2), door(5.5)] }),
    ...wall(2.5, -1.5, W2, -1.5, { h, t: IT }),
  ];
}

function furniture(floor: 0 | 1): { light: Box[]; dark: Box[] } {
  if (floor === 0)
    return {
      light: [
        // soffa
        block(-5.8, 0, -3.6, -4.9, 0.42, -1.2),
        block(-5.8, 0.42, -3.6, -5.55, 0.8, -1.2),
        // soffbord
        block(-4.3, 0, -2.9, -3.5, 0.38, -1.9),
        // matbord + stolar
        block(-4.4, 0.7, 1.9, -2.2, 0.76, 3.5),
        block(-3.5, 0, 2.5, -3.1, 0.7, 2.9),
        // kök: bänk och ö
        block(0.0, 0, -4.35, 5.85, 0.9, -3.75),
        block(1.3, 0, -2.4, 3.9, 0.92, -1.5),
        // tvättmaskiner
        block(4.65, 0, 0.12, 5.85, 0.85, 0.72),
        // badkar / dusch
        block(4.4, 0, 3.6, 5.85, 0.5, 4.35),
      ],
      dark: [
        block(-2.0, 0, -4.35, -0.75, 0.5, -3.95), // tv-bänk
        ...[2.0, 2.9].flatMap((z) => [
          block(-4.75, 0, z - 0.2, -4.35, 0.46, z + 0.2),
          block(-2.25, 0, z - 0.2, -1.85, 0.46, z + 0.2),
        ]),
        // trappa i hallen
        ...Array.from({ length: 12 }, (_, i) =>
          block(-0.35, 0, 0.35 + i * 0.25, 0.65, (i + 1) * (H / 12), 0.6 + i * 0.25),
        ),
      ],
    };
  return {
    light: [
      // sängar
      block(-5.85, 0, -4.1, -3.85, 0.5, -2.3),
      block(-5.85, 0, 0.6, -4.0, 0.5, 2.0),
      block(3.9, 0, 2.6, 5.85, 0.5, 4.0),
      // allrum: soffa
      block(-0.85, 0, -3.8, 0.0, 0.42, -1.6),
      // badkar
      block(4.1, 0, -4.35, 5.85, 0.55, -3.6),
    ],
    dark: [
      block(-5.95, 0, -4.1, -5.8, 1.0, -2.3),
      block(-5.95, 0, 0.6, -5.8, 1.0, 2.0),
      block(5.8, 0, 2.6, 5.95, 1.0, 4.0),
      block(0.6, 0, -1.2, 2.2, 0.02, 1.4), // matta
    ],
  };
}

function upperSlab(): Box[] {
  // Bjälklag med hål för trappan
  const y0 = -0.2;
  const y1 = 0;
  return [
    block(-W2, y0, -D2, -0.35, y1, D2),
    block(0.65, y0, -D2, W2, y1, D2),
    block(-0.35, y0, -D2, 0.65, y1, 0.35),
    block(-0.35, y0, 3.35, 0.65, y1, D2),
  ];
}

const site: { ground: Box[]; light: Box[]; dark: Box[] } = {
  ground: [block(-9.5, -0.7, -7, 11.5, 0, 10)],
  light: [
    block(-6.6, 0, 4.7, -1.4, 0.1, 7.8), // uteplats (trädäck)
    block(0.5, 0, 4.6, 1.5, 0.04, 10), // gång
    block(6.3, 0, -1.4, 10.0, 0.04, 4.9), // carportens platta
  ],
  dark: [
    block(-4.6, 0.1, 5.6, -2.8, 0.82, 6.6), // utebord
    // carport: stolpar och tak
    ...[
      [6.55, -1.2],
      [9.75, -1.2],
      [9.75, 4.7],
    ].map(([x, z]) => block(x - 0.08, 0, z - 0.08, x + 0.08, 2.45, z + 0.08)),
    block(6.15, 2.45, -1.5, 10.1, 2.58, 5.0),
    // bil
    block(7.2, 0.25, -0.4, 9.1, 0.95, 3.9),
    block(7.35, 0.95, 0.5, 8.95, 1.45, 2.9),
  ],
};

/* ---------- Komponenter ---------- */

function RoomFloor({
  room,
  lit,
  temp,
  heatmap,
  leak,
  selected,
  onClick,
}: {
  room: (typeof villa.rooms)[number];
  lit: boolean;
  temp: number;
  heatmap: boolean;
  leak: boolean;
  selected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  const [x0, z0, x1, z1] = room.rect;
  const w = x1 - x0;
  const d = z1 - z0;
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: room.floor === 0 ? clay.floor : clay.floorUpper,
        roughness: 0.95,
        emissive: new THREE.Color(clay.lamp),
        emissiveIntensity: 0,
      }),
    [room.floor],
  );
  const heatMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: radialTexture(),
        transparent: true,
        depthWrite: false,
        opacity: 0,
        color: "#ffffff",
      }),
    [],
  );
  const lampMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: clay.furniture,
        emissive: new THREE.Color(clay.lamp),
        emissiveIntensity: 0,
      }),
    [],
  );
  const glow = useEased(lit ? 1 : 0, 6);
  const heat = useEased(heatmap || leak ? 1 : 0, 5);
  const sel = useEased(selected ? 1 : 0, 8);
  const pulse = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  const leakColor = useMemo(() => new THREE.Color(clay.bad), []);

  useFrame((_, dt) => {
    mat.emissiveIntensity = glow.current * 0.55 + sel.current * 0.08;
    lampMat.emissiveIntensity = glow.current * 1.6;
    if (leak) {
      pulse.current += dt;
      heatMat.color.copy(leakColor);
      heatMat.opacity = heat.current * (0.45 + Math.sin(pulse.current * 3) * 0.2);
      invalidate();
    } else {
      heatMat.color.copy(tempColor(temp));
      heatMat.opacity = heat.current * 0.85;
    }
  });

  return (
    <group>
      <mesh
        position={[(x0 + x1) / 2, 0.03, (z0 + z1) / 2]}
        scale={[w - 0.02, 0.06, d - 0.02]}
        geometry={unitBox}
        material={mat}
        receiveShadow
        onClick={onClick}
      />
      <mesh
        position={[(x0 + x1) / 2, 0.075, (z0 + z1) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[w * 1.15, d * 1.15, 1]}
        material={heatMat}
        renderOrder={2}
      >
        <planeGeometry args={[1, 1]} />
      </mesh>
      {room.hasLamp && (
        <group position={[(x0 + x1) / 2, H - 0.45, (z0 + z1) / 2]}>
          <mesh
            position={[0, 0.25, 0]}
            scale={[0.02, 0.5, 0.02]}
            geometry={unitBox}
            material={claymat(clay.furnitureDark)}
          />
          <mesh material={lampMat} castShadow>
            <cylinderGeometry args={[0.08, 0.26, 0.2, 18]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Floor({
  floor,
  state,
  actions,
  markers,
}: {
  floor: 0 | 1;
  state: VillaState;
  actions: VillaActions;
  markers: boolean;
}) {
  const geo = useMemo(
    () => ({ ext: exteriorWalls(floor), int: interiorWalls(floor), furn: furniture(floor) }),
    [floor],
  );
  const cutRef = useRef<THREE.Group>(null);
  const cut = useEased(state.roofLifted ? 1 : 0, 4);
  useFrame(() => {
    if (cutRef.current) cutRef.current.scale.y = 1 - cut.current * 0.62;
  });
  const rooms = villa.rooms.filter((r) => r.floor === floor);
  const devices = state.roofLifted ? villa.devices.filter((d) => d.floor === floor) : [];
  return (
    <group>
      {floor === 0 && <Boxes boxes={[block(-W2, -0.02, -D2, W2, 0.02, D2)]} color={clay.floor} />}
      {floor === 1 && <Boxes boxes={upperSlab()} color={clay.wallInner} />}
      <Boxes boxes={geo.ext.fixed} color={clay.wall} />
      <group ref={cutRef}>
        <Boxes boxes={geo.ext.cut} color={clay.wall} />
      </group>
      <Boxes boxes={geo.int} color={clay.wallInner} />
      <Boxes boxes={geo.furn.light} color={clay.furniture} />
      <Boxes boxes={geo.furn.dark} color={clay.furnitureDark} />
      {rooms.map((r) => (
        <RoomFloor
          key={r.id}
          room={r}
          lit={!!state.lights[r.id]}
          temp={state.temps[r.id]}
          heatmap={state.heatmap}
          leak={state.leak && r.id === "tvatt"}
          selected={state.selected?.kind === "room" && state.selected.id === r.id}
          onClick={(e) => {
            e.stopPropagation();
            if (!markers && r.hasLamp) actions.toggleLight(r.id);
            else actions.select({ kind: "room", id: r.id });
          }}
        />
      ))}
      {markers &&
        devices.map((d) => <DeviceMarker key={d.id} device={d} state={state} actions={actions} />)}
    </group>
  );
}

function Roof({
  state,
  actions,
  markers,
  annotations,
}: {
  state: VillaState;
  actions: VillaActions;
  markers: boolean;
  annotations: boolean;
}) {
  const slope = (D2 + 0.45) / Math.cos(pitch);
  const zc = (D2 + 0.45) / 2;
  const yc = H * 2 + rise - ((D2 + 0.45) / 2) * Math.tan(pitch);
  const gable = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-D2, 0);
    s.lineTo(D2, 0);
    s.lineTo(0, rise);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: ET, bevelEnabled: false });
    g.rotateY(Math.PI / 2);
    return g;
  }, []);
  const panels = useMemo(() => {
    const list: Box[] = [];
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 8; c++)
        list.push({
          p: [-5.3 + c * 1.08 + 0.5, 0.12, -1.6 + r * 1.78 + 0.85],
          s: [1.02, 0.05, 1.7],
        });
    return list;
  }, []);
  const solar = villa.devices.find((d) => d.id === "solar")!;
  return (
    <group>
      <mesh
        position={[0, yc, zc]}
        rotation={[pitch, 0, 0]}
        scale={[W2 * 2 + 0.8, 0.16, slope]}
        geometry={unitBox}
        material={claymat(clay.roof)}
        castShadow
        receiveShadow
      />
      <mesh
        position={[0, yc, -zc]}
        rotation={[-pitch, 0, 0]}
        scale={[W2 * 2 + 0.8, 0.16, slope]}
        geometry={unitBox}
        material={claymat(clay.roof)}
        castShadow
        receiveShadow
      />
      <mesh position={[-W2, H * 2, 0]} geometry={gable} material={claymat(clay.wall)} castShadow />
      <mesh
        position={[W2 - ET, H * 2, 0]}
        geometry={gable}
        material={claymat(clay.wall)}
        castShadow
      />
      <group position={[0, yc, zc]} rotation={[pitch, 0, 0]}>
        <Boxes boxes={panels} color={clay.solar} variation={0.01} />
      </group>
      {markers && <DeviceMarker device={solar} state={state} actions={actions} />}
      {annotations && (
        <Annotation position={[-3.6, 6.6, 2.0]} side="left">
          {heroText.annotations.solar}
        </Annotation>
      )}
    </group>
  );
}

function EnergyFlow({
  active,
  roofOffset,
}: {
  active: boolean;
  roofOffset: React.RefObject<number>;
}) {
  const count = 10;
  const ref = useRef<THREE.InstancedMesh>(null);
  const t = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  const vis = useEased(active ? 1 : 0, 5);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: clay.copperLight,
        emissive: new THREE.Color(clay.copper),
        emissiveIntensity: 0.8,
        transparent: true,
      }),
    [],
  );
  const sun = useMemo(() => new THREE.Vector3(-9, 12.5, 7), []);
  useFrame((_, dt) => {
    const mesh = ref.current;
    if (!mesh) return;
    mat.opacity = vis.current;
    mesh.visible = vis.current > 0.01;
    if (!mesh.visible) return;
    t.current += dt * 0.25;
    const ro = roofOffset.current ?? 0;
    const panel = new THREE.Vector3(-1.5, 6.2 + ro, 2.3);
    const paths = [
      new THREE.CatmullRomCurve3([sun, new THREE.Vector3(-5, 10, 4.5), panel]),
      new THREE.CatmullRomCurve3([
        panel,
        new THREE.Vector3(3.5, 5.4 + ro * 0.5, 4.9),
        new THREE.Vector3(0.6, 1.8, 4.7),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.6, 1.8, 4.7),
        new THREE.Vector3(4, 1.6, 5),
        new THREE.Vector3(6.3, 1.2, 3.6),
        new THREE.Vector3(7.3, 0.9, 2.4),
      ]),
    ];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    let i = 0;
    paths.forEach((p, pi) => {
      for (let k = 0; k < count; k++) {
        const u = (k / count + t.current + pi * 0.13) % 1;
        const s = 0.11 * Math.sin(u * Math.PI) + 0.02;
        m.compose(p.getPoint(u), q, new THREE.Vector3(s, s, s));
        mesh.setMatrixAt(i++, m);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
    invalidate();
  });
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, mat, count * 3]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 10]} />
      </instancedMesh>
      <mesh position={sun} visible={active}>
        <sphereGeometry args={[0.55, 24, 18]} />
        <meshStandardMaterial
          color={clay.copperLight}
          emissive={clay.copperLight}
          emissiveIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

function Trees() {
  const trees: [number, number, number][] = [
    [-8, -5.2, 1.3],
    [-8.2, 8.4, 0.9],
  ];
  return (
    <group>
      {trees.map(([x, z, r], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh
            position={[0, 0.6, 0]}
            scale={[0.12, 1.2, 0.12]}
            geometry={unitBox}
            material={claymat(clay.furnitureDark)}
            castShadow
          />
          <mesh position={[0, 1.2 + r, 0]} material={claymat(clay.lawn)} castShadow>
            <icosahedronGeometry args={[r, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Annotation({
  position,
  children,
  side = "right",
}: {
  position: [number, number, number];
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <Html position={position} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div
        className={`relative hidden sm:block ${side === "left" ? "-translate-x-full" : ""}`}
        aria-hidden
      >
        <svg
          width="56"
          height="40"
          className={`absolute top-[-40px] ${side === "left" ? "right-0 -scale-x-100" : "left-0"}`}
        >
          <circle cx="2.5" cy="37.5" r="2.5" fill="#E58A5B" />
          <path
            d="M3 37 L 30 8 L 56 8"
            fill="none"
            stroke="#F6F2EA"
            strokeOpacity="0.7"
            strokeWidth="1"
          />
        </svg>
        <p
          className={`bg-marin/85 text-paper absolute top-[-54px] rounded-[3px] px-1.5 py-0.5 font-serif text-[15px] leading-tight whitespace-nowrap ${side === "left" ? "right-[60px]" : "left-[60px]"}`}
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 14' }}
        >
          {children}
        </p>
      </div>
    </Html>
  );
}

export function VillaModel({
  state,
  actions,
  markers = true,
  annotations = false,
}: {
  state: VillaState;
  actions: VillaActions;
  markers?: boolean;
  annotations?: boolean;
}) {
  const upper = useRef<THREE.Group>(null);
  const roof = useRef<THREE.Group>(null);
  const lift = useEased(state.roofLifted ? 1 : 0, 3.2);
  const roofOffset = useRef(0);
  useFrame(() => {
    if (upper.current) upper.current.position.y = H + lift.current * 2.4;
    if (roof.current) {
      roofOffset.current = lift.current * 6.2;
      roof.current.position.y = roofOffset.current;
      roof.current.position.z = -lift.current * 2.5;
      roof.current.rotation.x = -lift.current * 0.12;
    }
  });
  const leakDevice = villa.devices.find((d) => d.id === "leak-tvatt") as VillaDevice;
  return (
    <group onPointerMissed={() => actions.select(null)}>
      <Boxes boxes={site.ground} color={clay.plinth} variation={0} />
      <Boxes boxes={site.light} color={clay.deck} />
      <Boxes boxes={site.dark} color={clay.furnitureDark} />
      <Trees />
      <group>
        <Floor floor={0} state={state} actions={actions} markers={markers} />
      </group>
      <group ref={upper} position={[0, H, 0]}>
        <Floor floor={1} state={state} actions={actions} markers={markers} />
      </group>
      <group ref={roof}>
        <Roof state={state} actions={actions} markers={markers} annotations={annotations} />
      </group>
      {/* Utedelar som inte följer planen */}
      <mesh
        position={[6.4, 0.45, -3.2]}
        scale={[0.45, 0.9, 1.0]}
        geometry={unitBox}
        material={claymat(state.selected?.id === "heatpump" ? clay.copper : clay.furniture)}
        castShadow
      />
      <mesh
        position={[6.2, 1.2, 3.6]}
        scale={[0.12, 0.4, 0.3]}
        geometry={unitBox}
        material={claymat(clay.copper)}
        castShadow
      />
      {markers &&
        villa.devices
          .filter((d) => d.floor === "outside")
          .map((d) => <DeviceMarker key={d.id} device={d} state={state} actions={actions} />)}
      <EnergyFlow active={state.flow} roofOffset={roofOffset} />
      {state.leak && <LeakRing device={leakDevice} />}
      {annotations && (
        <>
          <Annotation position={[6.6, 0.9, -3.2]} side="left">
            {heroText.annotations.heatpump}
          </Annotation>
          <Annotation position={[6.25, 1.4, 3.6]}>{heroText.annotations.charger}</Annotation>
        </>
      )}
    </group>
  );
}

function LeakRing({ device }: { device: VillaDevice }) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  useFrame((_, dt) => {
    t.current = (t.current + dt * 0.8) % 1;
    if (ref.current) {
      const s = 0.3 + t.current * 1.4;
      ref.current.scale.set(s, s, s);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 1 - t.current;
    }
    invalidate();
  });
  return (
    <mesh
      ref={ref}
      position={[device.position[0], 0.12, device.position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.8, 0.95, 40]} />
      <meshBasicMaterial color={clay.bad} transparent depthWrite={false} />
    </mesh>
  );
}
