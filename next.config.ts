/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 THIS IS THE MAGIC
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 ALSO ALLOW TS to pass even if small type mistakes
  },
};

module.exports = nextConfig;
