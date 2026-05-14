/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude the legacy sub-project from compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack(config) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /milestone-mentor-app/,
    };
    return config;
  },
};

module.exports = nextConfig;
