/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/popoCard',
  trailingSlash: true,
  distDir: 'out',  // 追加
}

module.exports = nextConfig