"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SajuResult } from "@/components/saju/SajuResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SajuApiResult } from "@/types/saju";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<SajuApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [timeUnknown, setTimeUnknown] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // URL 파라미터에서 데이터 추출
        const year = parseInt(searchParams.get("year") || "0");
        const month = parseInt(searchParams.get("month") || "0");
        const day = parseInt(searchParams.get("day") || "0");
        const hour = parseInt(searchParams.get("hour") || "0");
        const minute = parseInt(searchParams.get("minute") || "0");
        const isLunar = searchParams.get("lunar") === "true";
        const isLeapMonth = searchParams.get("leap") === "true";
        const personName = searchParams.get("name") || "";
        const isTimeUnknown = searchParams.get("timeUnknown") === "true";

        setName(personName);
        setTimeUnknown(isTimeUnknown);

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
            isLeapMonth,
            timeUnknown: isTimeUnknown,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "사주 계산 중 오류가 발생했습니다.");
        }

        setResult(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams]);

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
          <p className="text-muted-foreground">
            AI 기반 정밀 사주 분석
          </p>
        </header>

        <SajuResult result={result} name={name} timeUnknown={timeUnknown} />

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            새로 분석하기
          </Button>
          <Button onClick={() => window.print()}>
            결과 인쇄하기
          </Button>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>※ 본 결과는 참고용이며, 전문 역학인의 상담을 권장합니다.</p>
        </footer>
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
