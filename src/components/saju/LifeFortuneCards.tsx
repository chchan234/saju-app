"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Star, TrendingUp, Calendar } from "lucide-react";
import type { MajorFortuneInfo } from "@/lib/saju-calculator";
import {
  analyzeLifeFortune,
  getBestPeriods,
  type CategoryFortune,
  type FortunePeriod,
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

// 개별 분야 카드
function CategoryFortuneCard({
  fortune,
  birthYear,
}: {
  fortune: CategoryFortune;
  birthYear: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // 좋은 시기만 필터링 (rating >= 4)
  const goodPeriods = fortune.periods.filter((p) => p.rating >= 4);
  // 현재 시기
  const currentPeriod = fortune.periods.find((p) => p.isCurrent);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white/50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{fortune.emoji}</span>
            <div className="text-left">
              <h4 className="font-semibold text-sm">{fortune.label}</h4>
              {currentPeriod && (
                <p className="text-xs text-muted-foreground">
                  현재: <RatingStars rating={currentPeriod.rating} />
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={fortune.currentStatus} />
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-stone-100 dark:border-stone-800 pt-4">
            {/* 현재 상태 */}
            {currentPeriod && (
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    현재 ({currentPeriod.startYear}-{currentPeriod.endYear}년)
                  </span>
                  <RatingStars rating={currentPeriod.rating} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentPeriod.message}
                </p>
              </div>
            )}

            {/* 좋은 시기 목록 */}
            {goodPeriods.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  좋은 시기
                </h5>
                <div className="space-y-2">
                  {goodPeriods.map((period, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded ${
                        period.isCurrent
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
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
                        {period.isCurrent && (
                          <Badge variant="outline" className="text-[10px] bg-green-100 dark:bg-green-900/50 border-green-300">
                            현재
                          </Badge>
                        )}
                      </div>
                      <RatingStars rating={period.rating} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 전체 대운 흐름 */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-muted-foreground">전체 흐름</h5>
              <div className="flex gap-1 overflow-x-auto pb-2">
                {fortune.periods.map((period, idx) => (
                  <div
                    key={idx}
                    className={`flex-shrink-0 text-center p-2 rounded min-w-[60px] ${
                      period.isCurrent
                        ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
                        : "bg-stone-100 dark:bg-stone-800/50"
                    }`}
                  >
                    <div className="text-[10px] text-muted-foreground mb-1">
                      {period.startAge}-{period.endAge}세
                    </div>
                    <RatingStars rating={period.rating} />
                    <div className="text-[10px] font-medium mt-1">
                      {period.sipsin || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
  const bestPeriods = getBestPeriods(categoryFortunes, birthYear);

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
          대운 흐름을 바탕으로 분야별 좋은 시기를 분석합니다
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 핵심 추천 시기 */}
        {bestPeriods.length > 0 && (
          <div className="bg-white/70 dark:bg-stone-900/50 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/30">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              주목할 시기
            </h4>
            <div className="space-y-2">
              {bestPeriods.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.emoji}</span>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {item.period.startYear}-{item.period.endYear}년
                    </span>
                    <RatingStars rating={item.period.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 분야별 상세 */}
        <div className="space-y-3">
          {mainCategories.map((fortune) => (
            <CategoryFortuneCard
              key={fortune.category}
              fortune={fortune}
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
                birthYear={birthYear}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
