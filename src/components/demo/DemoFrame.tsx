"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { demo } from "@/content/sv";
import type { SceneProps } from "./three/SceneCanvas";
import { FallbackIllustration } from "./Fallback";

const SceneCanvas = dynamic(() => import("./three/SceneCanvas"), { ssr: false });

export type Support = "checking" | "ok" | "no-webgl" | "weak";

function detect(): Support {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("no3d")) return "no-webgl";
    if (params.has("weak")) return "weak";
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return "no-webgl";
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (
      (nav.deviceMemory && nav.deviceMemory <= 1) ||
      (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2)
    )
      return "weak";
    return "ok";
  } catch {
    return "no-webgl";
  }
}

/** Laddar 3D först när ytan närmar sig skärmen, och pausar renderingen när den inte syns. */
export function DemoFrame({
  scene,
  className = "",
  dark = false,
  overlay,
  ...sceneProps
}: Omit<SceneProps, "active" | "onReady"> & {
  className?: string;
  dark?: boolean;
  overlay?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [support, setSupport] = useState<Support>("checking");
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => setSupport(detect()), []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!near || ready) return;
    const t = setTimeout(() => setSlow(true), 3500);
    return () => clearTimeout(t);
  }, [near, ready]);

  const show3d = support === "ok";
  return (
    <div ref={ref} className={`relative ${className}`}>
      {show3d && near && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <SceneCanvas
            scene={scene}
            {...sceneProps}
            active={visible}
            onReady={() => setReady(true)}
          />
        </div>
      )}
      {(support === "checking" || (show3d && !ready)) && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div
            className={`flex flex-col items-center gap-3 text-sm ${dark ? "text-paper-muted" : "text-ink-2"}`}
            role="status"
          >
            <FallbackIllustration
              scene={scene}
              dark={dark}
              className="h-auto w-[min(70%,380px)] opacity-60"
            />
            <span>{demo.loading}</span>
            {slow && <span className="text-xs">{demo.loadingSlow}</span>}
          </div>
        </div>
      )}
      {(support === "no-webgl" || support === "weak") && (
        <div className="absolute inset-0 flex flex-col items-start justify-center gap-4 p-6 md:p-10">
          <FallbackIllustration
            scene={scene}
            dark={dark}
            className="h-auto w-full max-w-[520px] self-center"
          />
          <div className={`measure ${dark ? "text-paper" : "text-ink"}`}>
            <p className="font-serif text-xl">{demo.fallback.title}</p>
            <p className={`mt-1 text-sm ${dark ? "text-paper-muted" : "text-ink-2"}`}>
              {support === "weak" ? demo.fallback.textWeak : demo.fallback.textNoWebgl}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold">
              <a
                href="#kontakt"
                className={
                  dark
                    ? "text-copper-light underline underline-offset-4"
                    : "text-copper underline underline-offset-4"
                }
              >
                {demo.fallback.book}
              </a>
              {support === "weak" && (
                <button
                  type="button"
                  onClick={() => setSupport("ok")}
                  className="underline underline-offset-4"
                >
                  {demo.fallback.tryAnyway}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {show3d && ready && overlay}
    </div>
  );
}
