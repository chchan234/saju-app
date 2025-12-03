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
import { ChevronDown, ChevronUp, Briefcase, Heart, HeartHandshake, Wallet } from "lucide-react";
import type { Pillar } from "@/types/saju";
import {
  SIPSIN_DETAIL,
  SIPSIN_CATEGORY_INFO,
  analyzeSipsinDistribution,
  getSipsinPillarMeaning,
  analyzeWealthFromSipsin,
  type SipsinCategory,
  type SipsinInfo,
} from "@/lib/saju-sipsin-data";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface SipsinDetailCardProps {
  pillars: Pillar[];
  timeUnknown?: boolean;
}

// 십신 분포 차트 컴포넌트
function SipsinDistributionChart({
  distribution,
}: {
  distribution: Record<SipsinCategory, number>;
}) {
  const chartData = Object.entries(distribution).map(([category, count]) => ({
    category: SIPSIN_CATEGORY_INFO[category as SipsinCategory].name,
    value: count,
    fullMark: 4,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="#E8DCC4" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "#5C544A", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 4]}
          tick={{ fill: "#8E7F73", fontSize: 10 }}
        />
        <Radar
          name="십신 분포"
          dataKey="value"
          stroke="#8E7F73"
          fill="#8E7F73"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// 개별 십신 상세 정보
function SipsinInfoPanel({ sipsin, pillarName }: { sipsin: string; pillarName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const info = SIPSIN_DETAIL[sipsin];
  if (!info) return null;

  const categoryInfo = SIPSIN_CATEGORY_INFO[info.category];
  const pillarPosition = pillarName === "년주" ? "year" :
                         pillarName === "월주" ? "month" :
                         pillarName === "일주" ? "day" : "hour";
  const pillarMeaning = getSipsinPillarMeaning(sipsin, pillarPosition);

  return (
    <div className="p-4 border rounded-lg bg-white/50 dark:bg-stone-900/50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{info.emoji}</span>
        <span className="font-serif font-bold text-lg">{info.name}</span>
        <Badge
          variant="outline"
          style={{ borderColor: categoryInfo.color, color: categoryInfo.color }}
        >
          {categoryInfo.name}
        </Badge>
        <Badge variant="secondary" className="ml-auto">{pillarName}</Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-3">{info.meaning}</p>

      {/* 기둥별 특별 의미 */}
      <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg mb-3 border border-[#E8DCC4] dark:border-[#3E3832]">
        <p className="text-sm font-medium text-[#5C544A] dark:text-[#D4C5B0]">
          📍 {pillarName}에 있는 {info.name}의 의미
        </p>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{pillarMeaning}</p>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span className="text-sm">상세 성향 보기</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          {/* 키워드 */}
          <div className="flex flex-wrap gap-1">
            {info.keyword.split(", ").map((kw) => (
              <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
            ))}
          </div>

          {/* 성격 */}
          <p className="text-sm text-stone-700 dark:text-stone-300">{info.personality}</p>

          {/* 강점/약점 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-900">
              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">강점</p>
              <div className="flex flex-wrap gap-1">
                {info.strengths.slice(0, 3).map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px] border-green-300">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-900">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">약점</p>
              <div className="flex flex-wrap gap-1">
                {info.weaknesses.slice(0, 3).map((w) => (
                  <Badge key={w} variant="outline" className="text-[10px] border-orange-300">{w}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 영역별 해석 */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 border rounded">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Briefcase className="w-3 h-3" /> 직업/커리어
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">{info.inCareer}</p>
            </div>
            <div className="p-2 border rounded">
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Heart className="w-3 h-3" /> 연애/관계
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">{info.inRelationship}</p>
            </div>
          </div>

          {/* 조언 */}
          <div className="p-3 bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg border border-[#E8DCC4] dark:border-[#3E3832]">
            <p className="text-sm text-[#8E7F73] font-medium">💡 조언</p>
            <p className="text-sm text-stone-700 dark:text-stone-300 mt-1">{info.advice}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// 메인 십신 상세 카드
export function SipsinDetailCard({ pillars, timeUnknown = false }: SipsinDetailCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 십신 분포 분석
  const { distribution, dominant, weak, analysis } = analyzeSipsinDistribution(pillars);

  // 각 기둥의 십신 정보 추출
  const pillarNames = ["년주", "월주", "일주", ...(timeUnknown ? [] : ["시주"])];
  const pillarSipsins: { pillarName: string; cheonganSipsin?: string; jijiSipsin?: string }[] = [];

  pillars.forEach((pillar, idx) => {
    if (idx < pillarNames.length) {
      pillarSipsins.push({
        pillarName: pillarNames[idx],
        cheonganSipsin: pillar.cheonganSipsin,
        jijiSipsin: pillar.jijiSipsin,
      });
    }
  });

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#5C544A] via-[#8E7F73] to-[#D4C5B0]"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E6] dark:bg-[#2C2824]">
            <HeartHandshake className="w-5 h-5 text-[#8E7F73]" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">십신(十神) 분석</span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">나와 세상의 관계</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 분포 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 차트 */}
          <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-4">
            <SipsinDistributionChart distribution={distribution} />
          </div>

          {/* 분석 텍스트 */}
          <div className="space-y-3">
            {/* 카테고리별 개수 */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(distribution).map(([cat, count]) => {
                const catInfo = SIPSIN_CATEGORY_INFO[cat as SipsinCategory];
                return (
                  <Badge
                    key={cat}
                    variant="outline"
                    style={{ borderColor: catInfo.color, color: catInfo.color }}
                    className="px-2 py-1"
                  >
                    {catInfo.name} {count}개
                  </Badge>
                );
              })}
            </div>

            {/* 강한/약한 카테고리 */}
            {dominant && (
              <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg">
                <p className="text-sm font-medium text-[#5C544A] dark:text-[#D4C5B0] mb-1">
                  ✨ 가장 강한 영역: {SIPSIN_CATEGORY_INFO[dominant].name}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {SIPSIN_CATEGORY_INFO[dominant].description}
                </p>
              </div>
            )}

            {weak && (
              <div className="p-3 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-200/50 dark:border-orange-900/50">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-1">
                  ⚠️ 보완 필요: {SIPSIN_CATEGORY_INFO[weak].name}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-300">
                  {SIPSIN_CATEGORY_INFO[weak].description}
                </p>
              </div>
            )}

            {/* 종합 분석 */}
            <p className="text-sm text-muted-foreground">{analysis}</p>
          </div>
        </div>

        {/* 상세 보기 */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
              <span className="font-serif">기둥별 십신 상세 보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-4">
            {pillarSipsins.map(({ pillarName, cheonganSipsin, jijiSipsin }) => (
              <div key={pillarName} className="space-y-2">
                <h4 className="font-serif font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#8E7F73] rounded-full"></span>
                  {pillarName}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-3">
                  {cheonganSipsin && (
                    <div className="flex items-center gap-2 p-2 border rounded bg-white/30 dark:bg-black/10">
                      <Badge variant="outline" className="text-xs">천간</Badge>
                      <span className="text-sm">{SIPSIN_DETAIL[cheonganSipsin]?.emoji} {cheonganSipsin}</span>
                    </div>
                  )}
                  {jijiSipsin && (
                    <div className="flex items-center gap-2 p-2 border rounded bg-white/30 dark:bg-black/10">
                      <Badge variant="outline" className="text-xs">지지</Badge>
                      <span className="text-sm">{SIPSIN_DETAIL[jijiSipsin]?.emoji} {jijiSipsin}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 개별 십신 상세 */}
            <div className="pt-4 border-t mt-4">
              <h4 className="font-serif font-medium mb-3">주요 십신 상세 해석</h4>
              <div className="space-y-3">
                {pillarSipsins.map(({ pillarName, cheonganSipsin }) => (
                  cheonganSipsin && (
                    <SipsinInfoPanel
                      key={`${pillarName}-${cheonganSipsin}`}
                      sipsin={cheonganSipsin}
                      pillarName={pillarName}
                    />
                  )
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 재물운 카드
interface WealthFortuneCardProps {
  pillars: (Pillar & { ganji: string })[];
}

export function WealthFortuneCard({ pillars }: WealthFortuneCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wealthAnalysis = analyzeWealthFromSipsin(pillars);

  // 아이콘 선택
  const getWealthIcon = () => {
    switch (wealthAnalysis.wealthType) {
      case "편재형": return "💸";
      case "정재형": return "🏦";
      case "혼합형": return "💰";
      default: return "📊";
    }
  };

  const getWealthTypeColor = () => {
    switch (wealthAnalysis.wealthType) {
      case "편재형": return "text-amber-600 dark:text-amber-400";
      case "정재형": return "text-blue-600 dark:text-blue-400";
      case "혼합형": return "text-green-600 dark:text-green-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/30">
            <Wallet className="w-5 h-5 text-amber-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">십신 기반</span>
            <span>재물운 분석</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 재물 유형 */}
        <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getWealthIcon()}</span>
            <div>
              <p className={`font-serif font-bold text-lg ${getWealthTypeColor()}`}>
                {wealthAnalysis.wealthType === "없음" ? "창의적 재물 유형" : wealthAnalysis.wealthType}
              </p>
              <p className="text-sm text-muted-foreground">
                {wealthAnalysis.jaesungPositions.length > 0
                  ? wealthAnalysis.jaesungPositions.join(", ")
                  : "재성 없음 - 다른 방식으로 재물 획득"}
              </p>
            </div>
          </div>
        </div>

        {/* 분석 */}
        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {wealthAnalysis.analysis}
        </p>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-serif">재물운 조언 더보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            {/* 조언 */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2">💡 재물운 활용 조언</p>
              <p className="text-sm text-amber-600 dark:text-amber-300">{wealthAnalysis.advice}</p>
            </div>

            {/* 재성 유형별 특징 */}
            {wealthAnalysis.hasJaesung && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {wealthAnalysis.jaesungPositions.some(p => p.includes("편재")) && (
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm mb-1">편재 특징</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• 사업/투자 수완</li>
                      <li>• 외부 활동으로 수입</li>
                      <li>• 큰돈을 다룸</li>
                    </ul>
                  </div>
                )}
                {wealthAnalysis.jaesungPositions.some(p => p.includes("정재")) && (
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm mb-1">정재 특징</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• 안정적 수입원</li>
                      <li>• 저축/관리 능력</li>
                      <li>• 꾸준한 축적</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
