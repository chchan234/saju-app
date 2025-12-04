"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BokbiModal } from "@/components/saju/SajuUI";
import type { SajuApiResult } from "@/types/saju";

// SajuResult를 dynamic import로 lazy load하여 초기 번들 크기 감소
// 대형 정적 데이터 파일(saju-analysis-data, saju-sipsin-data 등)이 분리됨
const SajuResult = dynamic(
  () => import("@/components/saju/SajuResult").then((mod) => mod.SajuResult),
  {
    loading: () => (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        <p className="text-muted-foreground text-sm">결과를 불러오는 중...</p>
      </div>
    ),
    ssr: false, // 클라이언트에서만 렌더링
  }
);

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-muted-foreground">사주를 분석하고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultContent() {
  const router = useRouter();
  const [result, setResult] = useState<SajuApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("female");
  const [timeUnknown, setTimeUnknown] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // sessionStorage에서 데이터 읽기
        const stored = sessionStorage.getItem("saju_individual");
        if (!stored) {
          setError("분석할 데이터가 없습니다. 다시 입력해주세요.");
          setLoading(false);
          return;
        }

        const data = JSON.parse(stored);
        const year = parseInt(data.year);
        const month = parseInt(data.month);
        const day = parseInt(data.day);
        const hour = parseInt(data.hour);
        const minute = parseInt(data.minute);
        const isLunar = data.lunar;
        const personName = data.name || "";
        const personGender = data.gender || "female";
        const isTimeUnknown = data.timeUnknown;

        setName(personName);
        setTimeUnknown(isTimeUnknown);
        setGender(personGender);

        if (!year || !month || !day) {
          setError("생년월일 정보가 없습니다.");
          setLoading(false);
          return;
        }

        // API 호출
        const response = await fetch("/api/saju", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year,
            month,
            day,
            hour,
            minute,
            isLunar,
            isLeapMonth: false,
            timeUnknown: isTimeUnknown,
            gender: personGender,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.error || "사주 계산 중 오류가 발생했습니다.");
        }

        setResult(responseData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              <p className="text-muted-foreground">사주를 분석하고 있습니다...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl">😢</div>
              <h2 className="text-xl font-semibold">오류가 발생했습니다</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => router.push("/")} className="mt-4">
                다시 입력하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">사주 분석 결과</h1>
        </header>

        <SajuResult result={result} name={name} timeUnknown={timeUnknown} />

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            새로 분석하기
          </Button>
          <BokbiModal />
        </div>

      </div>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <ResultContent />
    </Suspense>
  );
}
