import type { NextConfig } from "next";

const basePathFromEnv = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const normalizedBasePath =
  basePathFromEnv && basePathFromEnv !== "/"
    ? basePathFromEnv.startsWith("/")
      ? basePathFromEnv
      : `/${basePathFromEnv}`
    : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: normalizedBasePath || undefined,
  assetPrefix: normalizedBasePath || undefined,
};

export default nextConfig;
