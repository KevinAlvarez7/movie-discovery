/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  // Remove the webpack config for now to eliminate potential issues
  experimental: {
    // Add this to potentially help with module resolution
    esmExternals: true
  }
};

module.exports = nextConfig;