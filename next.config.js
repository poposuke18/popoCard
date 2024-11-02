/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/popoCard',
  trailingSlash: true,  // 追加
}

module.exports = nextConfig