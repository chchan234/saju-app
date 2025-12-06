import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Capacitor 앱용 static export (npm run build:mobile 시)
  // 웹 배포 시에는 이 옵션 제거 필요
  ...(process.env.BUILD_TARGET === "mobile" && {
    output: "export",
    trailingSlash: true,
  }),
};

export default nextConfig;
