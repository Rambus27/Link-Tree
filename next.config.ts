import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module; exclude it from webpack bundling
  // so it runs only server-side via Node.js
  serverExternalPackages: ["better-sqlite3"],

  // Profile pictures are rendered via plain <img> tags (not next/image),
  // so no remotePatterns are needed here. Add them only if you switch to
  // the <Image> component and want to restrict to specific domains.
};

export default nextConfig;
