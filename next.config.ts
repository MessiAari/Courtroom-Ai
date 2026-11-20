import type { NextConfig } from "next";

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
};

export default nextConfig;
