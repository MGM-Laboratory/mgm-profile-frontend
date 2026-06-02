import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Standalone output: a self-contained server bundle for the production Docker
  // image (no node_modules copy needed). See deploy/Dockerfile.
  output: "standalone",
};

export default withNextIntl(nextConfig);
