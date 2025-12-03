"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Clock, Calendar, Star, Zap, Heart, Cloud } from "lucide-react";
import type { MajorFortuneInfo, YearlyFortuneInfo } from "@/lib/saju-calculator";
import {
  DAEUN_OHENG_INTERPRETATION,
  YEONUN_STATUS_INTERPRETATION,
  getCurrentDaeun,
  getYeonunStatus,
  getDaeunAgeMeaning,
} from "@/lib/saju-fortune-data";

// 오행 색상 매핑
const OHENG_COLORS: Record<string, string> = {
  목: "bg-green-500",
  화: "bg-red-500",
  토: "bg-yellow-600",
  금: "bg-gray-400",
  수: "bg-blue-500",
};

const OHENG_LIGHT_COLORS: Record<string, string> = {
  목: "bg-green-100 border-green-300 text-green-800",
  화: "bg-red-100 border-red-300 text-red-800",
  토: "bg-yellow-100 border-yellow-400 text-yellow-800",
  금: "bg-gray-100 border-gray-300 text-gray-800",
  수: "bg-blue-100 border-blue-300 text-blue-800",
};

interface DaeunTimelineCardProps {
  majorFortunes: MajorFortuneInfo[];
  birthYear: number;
}

/**
 * 대운 타임라인 카드 컴포넌트
 */
export function DaeunTimelineCard({ majorFortunes, birthYear }: DaeunTimelineCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDaeun, setSelectedDaeun] = useState<MajorFortuneInfo | null>(null);

  // 현재 나이 계산
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1; // 한국 나이

  // 현재 대운 찾기
  const { current: currentDaeun, next: nextDaeun, yearsRemaining } = getCurrentDaeun(
    majorFortunes,
    currentAge
  );

  if (!majorFortunes || majorFortunes.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">10년 단위 운세 흐름</span>
            <span>나의 대운(大運)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 현재 대운 표시 */}
          {currentDaeun && (
            <div className="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">현재 대운</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-serif font-bold text-purple-700 dark:text-purple-300">
                      {currentDaeun.ganji}
                    </span>
                    <Badge className={`${OHENG_COLORS[currentDaeun.element]} text-white`}>
                      {currentDaeun.element}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {currentDaeun.startAge}세 ~ {currentDaeun.endAge}세
                  </p>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    남은 기간: 약 {yearsRemaining}년
                  </p>
                </div>
              </div>
              {DAEUN_OHENG_INTERPRETATION[currentDaeun.element] && (
                <div className="mt-4 space-y-2">
                  <p className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0]">
                    {DAEUN_OHENG_INTERPRETATION[currentDaeun.element].theme}
                  </p>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    {DAEUN_OHENG_INTERPRETATION[currentDaeun.element].fortune}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {DAEUN_OHENG_INTERPRETATION[currentDaeun.element].keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 다음 대운 예고 */}
          {nextDaeun && yearsRemaining <= 3 && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">
                다음 대운 예고 ({nextDaeun.startAge}세부터)
              </p>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg">{nextDaeun.ganji}</span>
                <Badge className={`${OHENG_COLORS[nextDaeun.element]} text-white text-xs`}>
                  {nextDaeun.element}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {DAEUN_OHENG_INTERPRETATION[nextDaeun.element]?.theme}
                </span>
              </div>
            </div>
          )}

          {/* 대운 타임라인 */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
                <span className="font-serif">전체 대운 타임라인 보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="relative">
                {/* 타임라인 선 */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-indigo-300 to-blue-300"></div>

                {/* 대운 항목들 */}
                <div className="space-y-4">
                  {majorFortunes.map((fortune, index) => {
                    const isCurrent = currentDaeun?.ganji === fortune.ganji;
                    const isPast = currentAge > fortune.endAge;
                    const ageMeaning = getDaeunAgeMeaning(fortune.startAge);

                    return (
                      <div
                        key={index}
                        className={`relative pl-14 py-3 pr-4 rounded-lg cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-400"
                            : isPast
                            ? "opacity-60"
                            : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
                        }`}
                        onClick={() => setSelectedDaeun(fortune)}
                      >
                        {/* 타임라인 점 */}
                        <div
                          className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 ${
                            isCurrent
                              ? "bg-purple-500 border-purple-300"
                              : isPast
                              ? "bg-stone-300 border-stone-200"
                              : `${OHENG_COLORS[fortune.element]} border-white`
                          }`}
                        ></div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`font-serif font-bold text-xl ${isCurrent ? "text-purple-700 dark:text-purple-300" : ""}`}>
                              {fortune.ganji}
                            </span>
                            <Badge className={`${OHENG_LIGHT_COLORS[fortune.element]} border`}>
                              {fortune.element}
                            </Badge>
                            {isCurrent && (
                              <Badge className="bg-purple-500 text-white text-xs">현재</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{fortune.startAge}세 ~ {fortune.endAge}세</p>
                            <p className="text-xs text-muted-foreground">{ageMeaning.period}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 선택된 대운 상세 */}
              {selectedDaeun && (
                <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif font-bold text-lg">
                      {selectedDaeun.ganji} 대운 상세
                    </h4>
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedDaeun(null)}
                    >
                      ✕
                    </button>
                  </div>
                  {DAEUN_OHENG_INTERPRETATION[selectedDaeun.element] && (
                    <div className="space-y-3">
                      <p className="font-medium text-[#8E7F73]">
                        {DAEUN_OHENG_INTERPRETATION[selectedDaeun.element].theme}
                      </p>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {DAEUN_OHENG_INTERPRETATION[selectedDaeun.element].fortune}
                      </p>
                      <div className="p-3 bg-white dark:bg-stone-900 rounded border">
                        <p className="text-sm font-medium text-[#5C544A] dark:text-[#D4C5B0] mb-1">조언</p>
                        <p className="text-sm text-muted-foreground">
                          {DAEUN_OHENG_INTERPRETATION[selectedDaeun.element].advice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

interface YearlyFortuneCardProps {
  yearlyFortunes: YearlyFortuneInfo[];
  ilgan: string;
  yongsin: string;
}

/**
 * 연운(세운) 카드 컴포넌트
 */
export function YearlyFortuneCard({ yearlyFortunes, ilgan, yongsin }: YearlyFortuneCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // 올해와 내년 연운
  const thisYear = yearlyFortunes.find((f) => f.year === currentYear);
  const nextYear = yearlyFortunes.find((f) => f.year === currentYear + 1);

  if (!yearlyFortunes || yearlyFortunes.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "yongsinYear":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "hapYear":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "chungYear":
        return <Zap className="w-4 h-4 text-orange-500" />;
      default:
        return <Cloud className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">매년 달라지는 운세</span>
            <span>나의 연운(年運)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 올해와 내년 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 올해 */}
            {thisYear && (
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border-2 border-amber-300 dark:border-amber-700">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-amber-500 text-white">올해</Badge>
                  <span className="text-sm text-muted-foreground">{thisYear.year}년</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-serif font-bold text-amber-700 dark:text-amber-300">
                    {thisYear.ganji}
                  </span>
                  <Badge className={`${OHENG_COLORS[thisYear.element]} text-white`}>
                    {thisYear.element}
                  </Badge>
                </div>
                {(() => {
                  const status = getYeonunStatus(thisYear);
                  const interpretation = YEONUN_STATUS_INTERPRETATION[status];
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium text-amber-700 dark:text-amber-400">
                          {interpretation.emoji} {interpretation.status}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 dark:text-stone-400">
                        {interpretation.description}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 내년 */}
            {nextYear && (
              <div className="p-5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">내년</Badge>
                  <span className="text-sm text-muted-foreground">{nextYear.year}년</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-serif font-bold">
                    {nextYear.ganji}
                  </span>
                  <Badge className={`${OHENG_COLORS[nextYear.element]} text-white`}>
                    {nextYear.element}
                  </Badge>
                </div>
                {(() => {
                  const status = getYeonunStatus(nextYear);
                  const interpretation = YEONUN_STATUS_INTERPRETATION[status];
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="font-medium">
                          {interpretation.emoji} {interpretation.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {interpretation.advice}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* 전체 연운 타임라인 */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
                <span className="font-serif">전체 연운 보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-2">
                {yearlyFortunes.map((fortune) => {
                  const isThisYear = fortune.year === currentYear;
                  const status = getYeonunStatus(fortune);
                  const interpretation = YEONUN_STATUS_INTERPRETATION[status];

                  return (
                    <div
                      key={fortune.year}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isThisYear
                          ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-300"
                          : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium w-12">{fortune.year}</span>
                        <span className="font-serif font-bold">{fortune.ganji}</span>
                        <Badge className={`${OHENG_LIGHT_COLORS[fortune.element]} border text-xs`}>
                          {fortune.element}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="text-sm">
                          {interpretation.emoji} {interpretation.status}
                        </span>
                        {isThisYear && (
                          <Badge className="bg-amber-500 text-white text-xs ml-2">올해</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 연운 범례 */}
              <div className="mt-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
                <p className="text-sm font-medium mb-2">연운 상태 안내</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>행운의 해 (용신 오행)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-3 h-3 text-pink-500" />
                    <span>인연의 해 (합)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-orange-500" />
                    <span>변화의 해 (충)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-3 h-3 text-gray-400" />
                    <span>평온의 해</span>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
