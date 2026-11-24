"use client";

import { useLayoutEffect, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import type { Box } from "./walls";

/** Lerfärger: matta, varma toner som en arkitektmodell. */
export const clay = {
  plinth: "#d8cdbb",
  plinthSide: "#bfb19c",
  ground: "#e4dccd",
  lawn: "#d3d2b9",
  wall: "#f1ebe0",
  wallInner: "#e7dece",
  floor: "#dccfba",
  floorUpper: "#e2d6c2",
  roof: "#cdb9a2",
  furniture: "#cbbca6",
  furnitureDark: "#b9a891",
  deck: "#d2bfa3",
  copper: "#b4532a",
  copperLight: "#e58a5b",
  lamp: "#ffd9a8",
  marin: "#17324f",
  solar: "#2b3a4d",
  ok: "#2a7050",
  warn: "#b77a12",
  bad: "#b3362a",
};

export const unitBox = new THREE.BoxGeometry(1, 1, 1);
const whiteMat = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  roughness: 0.93,
  metalness: 0,
});

const matCache = new Map<string, THREE.MeshStandardMaterial>();
/** Återanvänd matta material per färg. */
export function claymat(color: string, rough = 0.92) {
  const key = `${color}-${rough}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0 });
    matCache.set(key, m);
  }
  return m;
}

/** Många lådor i ett anrop (instancing). Färgvariation ger en lätt "ambient occlusion"-känsla. */
export function Boxes({
  boxes,
  color,
  variation = 0.035,
  castShadow = true,
  receiveShadow = true,
  onClick,
  material,
}: {
  boxes: Box[];
  color: string;
  variation?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  material?: THREE.Material;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const mat = material ?? whiteMat;
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const eul = new THREE.Euler();
    const base = new THREE.Color(color);
    const c = new THREE.Color();
    boxes.forEach((b, i) => {
      q.setFromEuler(b.r ? eul.set(...b.r) : eul.set(0, 0, 0));
      m.compose(new THREE.Vector3(...b.p), q, new THREE.Vector3(...b.s));
      mesh.setMatrixAt(i, m);
      // Lägre delar lite mörkare, som damm och skugga i en lermodell
      const shade =
        1 - variation * (1 - Math.min(1, b.p[1] / 3)) - variation * ((i * 7919) % 5) * 0.2;
      mesh.setColorAt(i, c.copy(base).multiplyScalar(shade));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [boxes, color, variation]);
  if (!boxes.length) return null;
  return (
    <instancedMesh
      ref={ref}
      args={[unitBox, mat, boxes.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onClick={onClick}
    />
  );
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Mjuk övergång mot ett målvärde. Begär nya bildrutor bara medan något rör sig. */
export function useEased(target: number, speed = 5) {
  const value = useRef(target);
  const invalidate = useThree((s) => s.invalidate);
  const reduce = useMemo(prefersReducedMotion, []);
  useEffect(() => {
    invalidate();
  }, [target, invalidate]);
  useFrame((_, dt) => {
    const d = target - value.current;
    if (Math.abs(d) < 0.0005) {
      value.current = target;
      return;
    }
    value.current = reduce
      ? target
      : value.current + d * (1 - Math.exp(-speed * Math.min(dt, 0.05)));
    invalidate();
  });
  return value;
}

/** Låt sidan scrolla vertikalt på mobil även när fingret är på modellen. */
export function TouchScrollFix() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    const t = setTimeout(() => (el.style.touchAction = "pan-y"), 0);
    return () => clearTimeout(t);
  }, [gl]);
  return null;
}

/** Mjuk radiell textur till värmekartan */
let radial: THREE.Texture | null = null;
export function radialTexture() {
  if (radial) return radial;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.55, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  radial = new THREE.CanvasTexture(c);
  return radial;
}

export function tempColor(t: number) {
  // 16 °C kall gråblå → 20 °C neutral lera → 25 °C koppar
  const cold = new THREE.Color("#7f9bb3");
  const mid = new THREE.Color("#e8d9c0");
  const warm = new THREE.Color("#c8642f");
  const c = new THREE.Color();
  if (t <= 20) return c.copy(cold).lerp(mid, Math.max(0, (t - 16) / 4));
  return c.copy(mid).lerp(warm, Math.min(1, (t - 20) / 5));
}
