"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SajuForm } from "@/components/saju/SajuForm";
import { ExpertForm } from "@/components/saju/ExpertForm";
import { ViewCount } from "@/components/ViewCount";
import { KakaoAdfitBanner } from "@/components/KakaoAdfit";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, X } from "lucide-react";

export default function Home() {
  const [isExpertMode, setIsExpertMode] = useState(false);

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${
        isExpertMode ? "bg-[#1a1410]" : ""
      }`}
    >
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <header className="text-center space-y-2">
          <h1 className={`font-serif text-5xl font-semibold tracking-tight transition-colors duration-700 ${
            isExpertMode ? "text-[#e8dcc8]" : "text-primary"
          }`}>
            운명
          </h1>
          <p className={`font-serif transition-colors duration-700 ${
            isExpertMode ? "text-[#a89880]" : "text-muted-foreground"
          }`}>
            당신의 삶에 숨겨진 이야기를 찾아드립니다.
          </p>
          <div className="pt-2 flex flex-col items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors duration-700 ${
              isExpertMode
                ? "text-[#a89880] bg-[#2d2319]"
                : "text-muted-foreground/70 bg-muted/50"
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              개인정보 수집 없음 · 데이터 저장 안함
            </span>
            <ViewCount
              mode={isExpertMode ? "expert" : "normal"}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors duration-700 ${
                isExpertMode
                  ? "text-[#a89880] bg-[#2d2319]"
                  : "text-muted-foreground/70 bg-muted/50"
              }`}
            />
          </div>
        </header>

        {/* 메인 카드 */}
        <Card className={`backdrop-blur-xl shadow-lg transition-colors duration-700 ${
          isExpertMode
            ? "bg-[#2d2319]/95 border-[#3d3127]"
            : "bg-card/80 border-white/60"
        }`}>
          <CardHeader className="text-center pb-2">
            <CardTitle className={`font-serif text-xl transition-colors duration-700 ${
              isExpertMode ? "text-[#e8dcc8]" : ""
            }`}>사주 풀이</CardTitle>
            <CardDescription className={`transition-colors duration-700 ${
              isExpertMode ? "text-[#a89880]" : ""
            }`}>
              정확한 풀이를 위해 정보를 입력해주세요.
            </CardDescription>
            {/* 전문가모드 토글 */}
            <div className="relative flex items-center justify-center pt-3">
              <Switch
                checked={isExpertMode}
                onCheckedChange={setIsExpertMode}
                id="expert-mode"
              />
              <label
                htmlFor="expert-mode"
                className={`text-xs flex items-center gap-1 cursor-pointer transition-colors duration-700 ml-2 ${
                  isExpertMode ? "text-amber-500 font-medium" : "text-muted-foreground"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                전문가모드
              </label>
              {isExpertMode && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="absolute right-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition-colors">
                      샘플
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-[#1a1410] border-[#3d3127] p-0" aria-describedby={undefined}>
                    <DialogTitle className="sr-only">전문가 사주 분석 샘플</DialogTitle>
                    <DialogDescription className="sr-only">전문가 사주 분석 결과 샘플 이미지</DialogDescription>
                    <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-[#1a1410]/95 backdrop-blur border-b border-[#3d3127]">
                      <span className="text-[#e8dcc8] text-sm font-medium">전문가 사주 분석 샘플 (60페이지)</span>
                      <DialogTrigger asChild>
                        <button className="text-[#a89880] hover:text-[#e8dcc8] transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </DialogTrigger>
                    </div>
                    <div className="p-4">
                      <Image
                        src="/sample-result.jpg"
                        alt="전문가 사주 분석 샘플"
                        width={1200}
                        height={1600}
                        className="w-full h-auto rounded-lg"
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isExpertMode ? <ExpertForm /> : <SajuForm />}
            <p className={`text-center text-[11px] mt-4 pt-3 border-t transition-colors duration-700 ${
              isExpertMode
                ? "text-[#7a6a5a] border-[#3d3127]"
                : "text-muted-foreground/60 border-border/50"
            }`}>
              입력하신 정보는 분석 후 즉시 삭제됩니다
            </p>
          </CardContent>
        </Card>

        {/* 광고 - 일반 모드에서만 */}
        {!isExpertMode && (
          <div>
            <KakaoAdfitBanner />
          </div>
        )}

        {/* 푸터 */}
        <footer className={`text-center text-sm transition-colors duration-700 ${
          isExpertMode ? "text-[#7a6a5a]" : "text-muted-foreground/60"
        }`}>
          <p>© 2025 운명. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
