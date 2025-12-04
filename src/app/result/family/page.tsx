"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] dark:bg-[#1c1917]">
      <Card className="w-full max-w-md mx-4 bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E7F73]" />
            <p className="text-stone-600 dark:text-stone-400 font-serif">가족의 기운을 읽고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// FamilyResultContent를 dynamic import로 lazy load하여 초기 번들 크기 감소
// 대형 정적 데이터 파일(saju-analysis-data 등)이 분리됨
const FamilyResultContent = dynamic(
  () => import("@/components/saju/FamilyResultContent").then((mod) => mod.FamilyResultContent),
  {
    loading: () => <LoadingCard />,
    ssr: false, // 클라이언트에서만 렌더링
  }
);

export default function FamilyResultPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <FamilyResultContent />
    </Suspense>
  );
}
