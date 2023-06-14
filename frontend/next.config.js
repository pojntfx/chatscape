const withPWA = require("@imbios/next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/app-build-manifest\.json$/],
  register: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true }, // We need this to support static output
  experimental: {
    appDir: true,
  },
};

module.exports = withPWA(nextConfig);
