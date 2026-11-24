"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { VillaModel } from "./Villa";
import { BuildingModel } from "./Building";
import { TouchScrollFix, prefersReducedMotion } from "./shared";
import type { BuildingActions, BuildingState, VillaActions, VillaState } from "../state";

export interface SceneProps {
  scene: "villa" | "building";
  variant: "hero" | "full";
  active: boolean;
  villaState?: VillaState;
  villaActions?: VillaActions;
  buildingState?: BuildingState;
  buildingActions?: BuildingActions;
  onReady?: () => void;
}

type View = { target: [number, number, number]; distance: number };

/** Mjuk kameraövergång när vyn byts. Släpper kontrollen till användaren när den är framme. */
function CameraRig({ view, dir, intro }: { view: View; dir: THREE.Vector3; intro: boolean }) {
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const moving = useRef(true);
  const reduce = useMemo(prefersReducedMotion, []);
  const aspect = size.width / Math.max(1, size.height);
  const fit = aspect < 1.2 ? Math.pow(1.2 / aspect, 0.55) : 1;
  const distance = view.distance * fit;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      const start = distance * (intro && !reduce ? 1.35 : 1);
      camera.position.copy(
        new THREE.Vector3(...view.target).add(dir.clone().multiplyScalar(start)),
      );
      camera.lookAt(...view.target);
    }
    moving.current = true;
    invalidate();
  }, [view.target, distance, camera, dir, intro, reduce, invalidate, view]);

  useFrame((_, dt) => {
    if (!controls || !moving.current) return;
    const k = reduce ? 1 : 1 - Math.exp(-3 * Math.min(dt, 0.05));
    const tgt = new THREE.Vector3(...view.target);
    controls.target.lerp(tgt, k);
    const offset = camera.position.clone().sub(controls.target);
    const d = offset.length();
    const nd = d + (distance - d) * k;
    camera.position.copy(controls.target).add(offset.normalize().multiplyScalar(nd));
    controls.update();
    if (controls.target.distanceTo(tgt) < 0.01 && Math.abs(nd - distance) < 0.02)
      moving.current = false;
    invalidate();
  });
  return null;
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}

export default function SceneCanvas(props: SceneProps) {
  const { scene, variant, active } = props;
  const isVilla = scene === "villa";
  const exploded = props.buildingState?.exploded;
  const lifted = props.villaState?.roofLifted;
  const view: View = useMemo(() => {
    if (isVilla)
      return lifted
        ? { target: [1, 4.4, 0.5], distance: 45 }
        : { target: [1, 2.8, 0.8], distance: 38 };
    return exploded ? { target: [0, 16, 0], distance: 108 } : { target: [0, 5.5, 0], distance: 74 };
  }, [isVilla, lifted, exploded]);
  const dir = useMemo(
    () =>
      isVilla
        ? new THREE.Vector3(0.62, 0.52, 0.82).normalize()
        : new THREE.Vector3(0.5, 0.62, 0.9).normalize(),
    [isVilla],
  );
  const coarse = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      frameloop={active ? "demand" : "never"}
      dpr={[1, 2]}
      shadows="soft"
      flat
      camera={{ fov: 30, near: 0.5, far: 400, position: [20, 18, 26] }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <hemisphereLight args={["#fff6ea", "#6b5a48", variant === "hero" ? 1.05 : 1.25]} />
      <directionalLight
        position={isVilla ? [10, 22, 14] : [26, 46, 30]}
        intensity={variant === "hero" ? 2.1 : 1.9}
        color="#fff0dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={isVilla ? [-16, 16, 16, -16, 1, 70] : [-40, 40, 40, -40, 1, 160]}
        />
      </directionalLight>
      <directionalLight position={[-14, 10, -8]} intensity={0.35} color="#dfe8f2" />

      {isVilla && props.villaState && props.villaActions && (
        <VillaModel
          state={props.villaState}
          actions={props.villaActions}
          markers={variant === "full"}
          annotations={variant === "hero"}
        />
      )}
      {!isVilla && props.buildingState && props.buildingActions && (
        <BuildingModel state={props.buildingState} actions={props.buildingActions} />
      )}

      <ContactShadows
        position={[0, 0.012, 0]}
        scale={isVilla ? 30 : 70}
        blur={2.6}
        far={isVilla ? 3 : 5}
        opacity={0.35}
        resolution={512}
        frames={1}
        color="#3b2f24"
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={!coarse}
        enableDamping
        dampingFactor={0.12}
        minPolarAngle={0.25}
        maxPolarAngle={1.32}
        minDistance={isVilla ? 14 : 36}
        maxDistance={isVilla ? 90 : 190}
        rotateSpeed={0.6}
      />
      <CameraRig view={view} dir={dir} intro={variant === "hero"} />
      <TouchScrollFix />
      <ReadySignal onReady={props.onReady} />
    </Canvas>
  );
}
