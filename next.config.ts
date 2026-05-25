import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
