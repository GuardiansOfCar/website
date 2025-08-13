import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 경고: 타입 에러가 있어도 프로덕션 빌드를 강제로 성공시킵니다.
    // 로컬에서 충분히 타입을 검증해야 합니다.
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|rtf|doc|docx)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash].[ext]',
          publicPath: '/_next/',
        },
      },
    });
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
