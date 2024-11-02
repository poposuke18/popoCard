/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/popoCard',
  // assetPrefixは削除または修正
  // assetPrefix: '/popoCard/',
}

module.exports = nextConfig