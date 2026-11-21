import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// SECURITY: browser hardening headers for every page and API route.
// - CSP: only our own scripts, styles, fonts and API (no third-party code can load).
//   Next.js needs inline scripts for hydration; dev mode also needs eval for hot reload.
// - frame-ancestors / X-Frame-Options: nobody can embed the site to trick clicks.
// - nosniff, Referrer-Policy, Permissions-Policy: standard hardening.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Tailwind CSS v4 runs as a Turbopack loader for .css files.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Make sure the Case Library JSON and prompt files ship with the server functions on Vercel
  // (they are read with fs at request time).
  outputFileTracingIncludes: {
    "/*": ["./data/cases/**/*", "./prompts/**/*"],
  },
  poweredByHeader: false, // don't advertise the framework
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
