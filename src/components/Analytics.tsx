import Script from "next/script";

/**
 * Integritetsvänlig statistik (t.ex. Plausible eller självhostad motsvarighet) utan cookies.
 * Avstängd som standard. Slå på med NEXT_PUBLIC_ANALYTICS_ENABLED=true och ange
 * NEXT_PUBLIC_ANALYTICS_DOMAIN och NEXT_PUBLIC_ANALYTICS_SRC. Uppdatera då cookie- och integritetssidan.
 */
export function Analytics() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return null;
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  if (!src || !domain) return null;
  return <Script defer data-domain={domain} src={src} strategy="afterInteractive" />;
}
