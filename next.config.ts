import type { NextConfig } from "next";

const extraDevOrigins =
  process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const apiProxyTarget = (
  process.env.API_PROXY_TARGET ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:7001"
)
  .replace(/\/$/, "")
  .replace(/^http:\/\/localhost/i, "http://127.0.0.1");

const nextConfig: NextConfig = {
  // Allow HMR / _next dev assets when testing from phone or another machine on the LAN.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.255.254.95",
    ...extraDevOrigins,
  ],
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiProxyTarget}/api/:path*` },
      { source: "/uploads/:path*", destination: `${apiProxyTarget}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
