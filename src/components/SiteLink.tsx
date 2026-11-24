import Link from "next/link";
import type { ComponentProps } from "react";

const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Interna länkar. I den statiska förhandsversionen blir de relativa så att sidan fungerar var den än ligger. */
export function SiteLink({
  href,
  base = "./",
  ...rest
}: Omit<ComponentProps<"a">, "href"> & { href: string; base?: string }) {
  if (!isStatic) return <Link href={href} {...rest} />;
  const [path, hash] = href.split("#");
  const p = path.replace(/^\//, "");
  const rel = base + (p ? `${p.replace(/\/$/, "")}/index.html` : "") + (hash ? `#${hash}` : "");
  return <a href={rel} {...rest} />;
}
