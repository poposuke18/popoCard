/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/popoCard',
  assetPrefix: '/popoCard/',
}

module.exports = nextConfig