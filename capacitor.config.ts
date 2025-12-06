import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.sajustudio.app",
  appName: "운명",
  webDir: "out",
  server: {
    // iOS CORS 문제 해결을 위해 hostname 설정
    hostname: "saju-studio.com",
    androidScheme: "https",
    iosScheme: "https",
  },
  plugins: {
    // 네이티브 HTTP로 fetch 패치하여 CORS 우회
    CapacitorHttp: {
      enabled: true,
    },
  },
  ios: {
    contentInset: "automatic",
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
