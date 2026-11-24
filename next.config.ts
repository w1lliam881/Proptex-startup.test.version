import type { NextConfig } from "next";

// STATIC_EXPORT=1 bygger en statisk version (utan formulär-API) som kan läggas ut var som helst.
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStatic && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
