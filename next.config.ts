import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Phase 4 adds the backend's stable media endpoints as allowed image hosts.
};

export default withNextIntl(nextConfig);
