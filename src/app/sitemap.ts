export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/integritetspolicy", "/cookies"].map((p) => ({
    url: `${siteUrl}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.3,
  }));
}
