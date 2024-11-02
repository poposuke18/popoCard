/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static HTML出力を有効化
  images: {
    unoptimized: true,  // GitHub Pages用に画像最適化を無効化
  },
  basePath: '/popoCard',  // リポジトリ名のみを指定
}

module.exports = nextConfig