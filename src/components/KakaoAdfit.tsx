"use client";

import { useEffect, useRef } from "react";

interface KakaoAdfitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

export function KakaoAdfit({ unit, width, height, className = "" }: KakaoAdfitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // 이미 로드된 경우 스킵
    if (isLoadedRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    // 광고 스크립트가 이미 로드되었는지 확인
    const existingScript = document.querySelector('script[src*="t1.daumcdn.net/kas/static/ba.min.js"]');

    // ins 요소 생성
    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-unit", unit);
    ins.setAttribute("data-ad-width", width.toString());
    ins.setAttribute("data-ad-height", height.toString());
    container.appendChild(ins);

    if (!existingScript) {
      // 스크립트 로드
      const script = document.createElement("script");
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;
      container.appendChild(script);
    } else {
      // 이미 스크립트가 로드된 경우 adfit 재실행
      if (typeof window !== "undefined" && (window as unknown as { adfit?: { render: () => void } }).adfit) {
        (window as unknown as { adfit: { render: () => void } }).adfit.render();
      }
    }

    isLoadedRef.current = true;

    return () => {
      // cleanup
      if (container) {
        container.innerHTML = "";
      }
      isLoadedRef.current = false;
    };
  }, [unit, width, height]);

  return (
    <div
      ref={containerRef}
      className={`flex justify-center ${className}`}
      style={{ minHeight: height }}
    />
  );
}

// 기본 광고 단위 (320x100)
export function KakaoAdfitBanner({ className = "" }: { className?: string }) {
  return (
    <KakaoAdfit
      unit="DAN-VKRJoWEGdNAQLQ0U"
      width={320}
      height={100}
      className={className}
    />
  );
}
