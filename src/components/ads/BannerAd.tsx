"use client";

import { useEffect } from "react";
import { initializeAdMob, showBannerAd, removeBannerAd } from "@/lib/admob";

/**
 * 배너 광고 컴포넌트
 * 앱 하단에 배너 광고를 표시합니다.
 */
export function BannerAd() {
  useEffect(() => {
    // Capacitor 환경에서만 실행 (웹 브라우저에서는 실행하지 않음)
    const isCapacitor = typeof window !== "undefined" &&
      (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

    if (!isCapacitor) {
      return;
    }

    // AdMob 초기화 및 배너 광고 표시
    const initAds = async () => {
      await initializeAdMob();
      await showBannerAd();
    };

    initAds();

    // 컴포넌트 언마운트 시 배너 제거
    return () => {
      removeBannerAd();
    };
  }, []);

  // 배너 광고는 네이티브 레이어에서 렌더링되므로
  // 하단 여백만 확보 (배너 높이: 약 50-60px)
  return <div className="h-[60px] w-full" />;
}
