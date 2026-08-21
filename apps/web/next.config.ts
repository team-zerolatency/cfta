import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@cfta/ui"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"), // monorepo root
};

export default nextConfig;