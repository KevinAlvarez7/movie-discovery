import path from 'path';
import withTM from 'next-transpile-modules';
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  webpack: (config: Configuration) => {
    if (!config.resolve) config.resolve = {};
    config.resolve.alias = { '@': path.resolve(__dirname) };
    return config;
  }
};

export default withTM(['your-package-name'])(nextConfig);