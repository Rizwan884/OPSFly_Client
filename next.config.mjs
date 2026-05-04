/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the app directory is used
  experimental: {
    appDir: true,
  },
  // Suppress specific warnings if needed
};

export default nextConfig;
