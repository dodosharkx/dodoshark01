import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 启用现代图片格式，自动优化为 AVIF 和 WebP
    formats: ['image/avif', 'image/webp'],
    qualities: [68, 70, 72, 74, 75],
    // 设备尺寸断点，用于响应式图片
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸变体
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 允许的外部图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },
  // 压缩输出
  compress: true,
};

export default nextConfig;
