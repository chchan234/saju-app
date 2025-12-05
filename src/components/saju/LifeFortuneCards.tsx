"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Star, Calendar, Clock, Hourglass, Zap } from "lucide-react";
import type { MajorFortuneInfo } from "@/lib/saju-calculator";
import {
  analyzeLifeFortune,
  groupPeriodsByTerm,
  getCategoryYearlyFortunes,
  type CategoryFortune,
  type FortunePeriod,
  type FortuneCategory,
} from "@/lib/saju-life-fortune";

interface LifeFortuneCardsProps {
  majorFortunes: MajorFortuneInfo[];
  ilgan: string;
  gender: "male" | "female";
  birthYear: number;
}

// 별점 렌더링
function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-stone-200 text-stone-200 dark:fill-stone-700 dark:text-stone-700"
          }`}
        />
      ))}
    </span>
  );
}

// 상태 배지
function StatusBadge({ status }: { status: CategoryFortune["currentStatus"] }) {
  const config = {
    excellent: { label: "최고", className: "bg-green-500 text-white" },
    good: { label: "좋음", className: "bg-blue-500 text-white" },
    normal: { label: "보통", className: "bg-stone-400 text-white" },
    caution: { label: "주의", className: "bg-orange-500 text-white" },
  };

  const { label, className } = config[status];
  return <Badge className={`${className} text-xs`}>{label}</Badge>;
}

// 대운 기간 아이템 렌더링
function PeriodItem({ period, showCurrent = true }: { period: FortunePeriod; showCurrent?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded ${
        period.isCurrent && showCurrent
          ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          : "bg-stone-50 dark:bg-stone-800/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">
          {period.startYear}-{period.endYear}년
        </span>
        <span className="text-xs text-muted-foreground">
          ({period.startAge}-{period.endAge}세)
        </span>
        {period.isCurrent && showCurrent && (
          <Badge variant="outline" className="text-[10px] bg-amber-100 dark:bg-amber-900/50 border-amber-300">
            현재
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">{period.sipsin}</span>
        <RatingStars rating={period.rating} />
      </div>
    </div>
  );
}

// 올해 기준 상태 계산
function getThisYearStatus(rating: number): CategoryFortune["currentStatus"] {
  if (rating >= 5) return "excellent";
  if (rating >= 4) return "good";
  if (rating >= 3) return "normal";
  return "caution";
}

// 개별 분야 카드
function CategoryFortuneCard({
  fortune,
  ilgan,
  gender,
  birthYear,
}: {
  fortune: CategoryFortune;
  ilgan: string;
  gender: "male" | "female";
  birthYear: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 현재 대운
  const currentPeriod = fortune.periods.find((p) => p.isCurrent);

  // 대운을 단기/중기/장기로 분류
  const periodGroups = groupPeriodsByTerm(fortune.periods);

  // 세운 (3년치)
  const yearlyFortunes = getCategoryYearlyFortunes(
    fortune.category as FortuneCategory,
    ilgan,
    gender,
    birthYear
  );
  const yearLabels = ["올해", "내년", "내후년"];

  // 올해 세운
  const thisYearFortune = yearlyFortunes[0];
  const thisYearStatus = getThisYearStatus(thisYearFortune.rating);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white/50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{fortune.emoji}</span>
            <div className="text-left">
              <h4 className="font-semibold text-sm">{fortune.label}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>올해</span>
                <RatingStars rating={thisYearFortune.rating} />
                {currentPeriod && (
                  <>
                    <span className="text-stone-300 dark:text-stone-600">·</span>
                    <span className="text-[10px]">대운</span>
                    <RatingStars rating={currentPeriod.rating} />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={thisYearStatus} />
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-stone-100 dark:border-stone-800 pt-4">

            {/* 세운 (올해~내후년) */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                올해~내후년 (세운)
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {yearlyFortunes.map((yf, idx) => (
                  <div
                    key={yf.year}
                    className="bg-amber-50/80 dark:bg-amber-900/20 rounded-lg p-2.5 text-center border border-amber-200/50 dark:border-amber-800/50"
                  >
                    <div className="text-[10px] text-muted-foreground mb-1">
                      {yearLabels[idx]}
                    </div>
                    <div className="text-xs font-medium mb-1">{yf.year}년</div>
                    <RatingStars rating={yf.rating} />
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {yf.sipsin}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 단기 (현재~5년) */}
            {periodGroups.shortTerm.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  단기 (현재~5년, 대운)
                </h5>
                <div className="space-y-1.5">
                  {periodGroups.shortTerm.map((period, idx) => (
                    <PeriodItem key={idx} period={period} />
                  ))}
                </div>
              </div>
            )}

            {/* 중기 (5-15년) */}
            {periodGroups.midTerm.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  중기 (5-15년, 대운)
                </h5>
                <div className="space-y-1.5">
                  {periodGroups.midTerm.map((period, idx) => (
                    <PeriodItem key={idx} period={period} showCurrent={false} />
                  ))}
                </div>
              </div>
            )}

            {/* 장기 (15년+) */}
            {periodGroups.longTerm.length > 0 && (
              <Collapsible>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <span className="flex items-center gap-1">
                      <Hourglass className="h-3 w-3" />
                      장기 (15년+, 대운)
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-1.5 pt-2">
                    {periodGroups.longTerm.map((period, idx) => (
                      <PeriodItem key={idx} period={period} showCurrent={false} />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// 메인 컴포넌트
export function LifeFortuneCard({
  majorFortunes,
  ilgan,
  gender,
  birthYear,
}: LifeFortuneCardsProps) {
  const categoryFortunes = analyzeLifeFortune(
    majorFortunes,
    ilgan,
    gender,
    birthYear
  );

  // 주요 4개 분야만 기본 표시
  const mainCategories = categoryFortunes.filter((cf) =>
    ["career", "love", "wealth", "promotion"].includes(cf.category)
  );
  const otherCategories = categoryFortunes.filter((cf) =>
    ["study", "health"].includes(cf.category)
  );

  const [showAll, setShowAll] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif flex items-center gap-2 text-[#5C544A] dark:text-[#D4C5B0]">
          <span className="text-2xl">🎯</span>
          분야별 시기 운세
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          세운(연운)과 대운을 바탕으로 분야별 시기를 분석합니다
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 분야별 상세 */}
        {mainCategories.map((fortune) => (
          <CategoryFortuneCard
            key={fortune.category}
            fortune={fortune}
            ilgan={ilgan}
            gender={gender}
            birthYear={birthYear}
          />
        ))}

        {/* 더보기 */}
        {!showAll && otherCategories.length > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            + 학업/건강운 더보기
          </button>
        )}

        {showAll &&
          otherCategories.map((fortune) => (
            <CategoryFortuneCard
              key={fortune.category}
              fortune={fortune}
              ilgan={ilgan}
              gender={gender}
              birthYear={birthYear}
            />
          ))}
      </CardContent>
    </Card>
  );
}
