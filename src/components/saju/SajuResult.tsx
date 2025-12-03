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
import { ChevronDown, ChevronUp, Sparkles, Mountain, Flame, Droplets, Coins, TreeDeciduous, Scroll, User, Heart, Briefcase, Brain, MessageCircle } from "lucide-react";
import type { SajuApiResult, Pillar, OhengCount } from "@/types/saju";
import type { MajorFortuneInfo, YearlyFortuneInfo } from "@/lib/saju-calculator";
import { DaeunTimelineCard, YearlyFortuneCard, FortuneFlowChart } from "@/components/saju/FortuneCards";
import { SipsinDetailCard, WealthFortuneCard } from "@/components/saju/SipsinCards";
import { GeokgukCard, HealthConstitutionCard } from "@/components/saju/AnalysisCards";
import {
  JohuCard,
  SinsalCard,
  RelationshipPatternCard,
  CareerAptitudeCard,
} from "@/components/saju/AdvancedAnalysisCards";
import {
  NatureProfileCard,
  CoreKeywordsCard,
  LifePhaseCard,
  LifeJourneyTimeline,
  OhengEmotionalMessage,
} from "@/components/saju/StorytellingCards";
import { analyzeSipsinDistribution } from "@/lib/saju-sipsin-data";
import { determineGeokguk } from "@/lib/saju-analysis-extended";
import { getIlganTraits, type IlganTraits, type OhengAdvice } from "@/lib/saju-traits";
import {
  ILJU_SYMBOLS,
  UNSEONG_INFO,
  OHENG_BOOSTERS,
  PILLAR_MEANINGS,
  CHEONGAN_HAP_INFO,
  CHEONGAN_CHUNG_INFO,
  generateStoryIntro,
  type IljuSymbol,
} from "@/lib/saju-analysis-data";
import { getAllPillarMeanings, type PillarPositionMeaning } from "@/lib/saju-pillar-meanings";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface SajuResultProps {
  result: SajuApiResult & {
    majorFortunes?: MajorFortuneInfo[];
    yearlyFortunes?: YearlyFortuneInfo[];
    gender?: "male" | "female";
    analysis?: {
      ilganTraits: IlganTraits | null;
      yongsinAdvice: OhengAdvice | null;
      ohengBalance: {
        strong: string[];
        weak: string[];
        missing: string[];
        dominant: string;
        advice: string;
      };
    };
  };
  name?: string;
  timeUnknown?: boolean;
}

import {
  OHENG_COLORS,
  OHENG_TEXT_COLORS,
  OHENG_ICONS,
  PillarCard,
  OhengChart,
  MysticalIntroCard,
} from "@/components/saju/SajuUI";

// 오행 차트용 색상 코드 (Hex) - This constant is now only used within OhengChart, which is moved.
// If it's still needed elsewhere, it should be imported or redefined.
// For now, it's removed as per the instruction's implied scope.


// 스토리 도입부 컴포넌트 (개선된 디자인)
function StoryIntroCard({ ilju, dominantOheng, name }: { ilju: string; dominantOheng: string; name?: string }) {
  const symbol = ILJU_SYMBOLS[ilju];
  const storyIntro = generateStoryIntro(ilju, dominantOheng, symbol);

  return (
    <MysticalIntroCard
      title={
        <>
          {name ? `${name}님의 운명은` : "당신의 운명은"} <br />
          <span className="text-[#BFA588]">"{storyIntro.characterSummary}"</span>
        </>
      }
      subtitle={storyIntro.seasonGreeting}
      content={storyIntro.closingRemark}
      footer={<>인생 주제: {storyIntro.lifeTheme}</>}
    />
  );
}

// 일주 상징 카드 컴포넌트
function IljuSymbolCard({ ilju, symbol }: { ilju: string; symbol: IljuSymbol }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#8E7F73] to-[#D4C5B0]"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-12 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 text-base font-bold text-[#8E7F73]">
            {symbol.hanja}
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">당신의 일주</span>
            <span>"{symbol.nickname}"</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-5 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎋</span>
              <div>
                <p className="font-serif text-lg font-medium text-[#5C544A] dark:text-[#D4C5B0] mb-1">{symbol.symbol}</p>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{symbol.essence}</p>
              </div>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
                <span className="font-serif">상세 성향 더보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                <h4 className="font-serif font-medium mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#8E7F73] rounded-full"></span>
                  성격 특성
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{symbol.personality}</p>
              </div>
              <div className="p-4 bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg">
                <h4 className="font-serif font-medium mb-2 text-[#8E7F73]">인생 주제</h4>
                <p className="text-sm text-stone-700 dark:text-stone-300">{symbol.lifeTheme}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

// 기둥별 영역 설명 카드
function PillarMeaningsCard({ timeUnknown }: { timeUnknown: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const pillars = timeUnknown
    ? ["년주", "월주", "일주"]
    : ["년주", "월주", "일주", "시주"];

  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <CardHeader>
        <CardTitle className="font-serif">사주 기둥별 의미</CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm text-muted-foreground">내 인생의 시기별 의미 확인하기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pillars.map((pillarName) => {
                const pillar = PILLAR_MEANINGS[pillarName];
                if (!pillar) return null;
                return (
                  <div key={pillarName} className="p-4 border border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-[#5C544A] dark:text-[#D4C5B0]">{pillar.name}</span>
                        <span className="text-xs text-muted-foreground">({pillar.hanja})</span>
                      </div>
                      <Badge variant="secondary" className="bg-white dark:bg-stone-800">{pillar.ageRange}</Badge>
                    </div>
                    <p className="text-sm font-medium text-[#8E7F73] mb-1">{pillar.lifeArea}</p>
                    <p className="text-xs text-muted-foreground mb-2">{pillar.characteristics}</p>
                    <div className="flex flex-wrap gap-1">
                      {pillar.represents.slice(0, 3).map((item) => (
                        <Badge key={item} variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-stone-200">{item}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 오행 보완법 상세 카드
function OhengBoosterDetailCard({ yongsin }: { yongsin: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const booster = OHENG_BOOSTERS[yongsin];

  if (!booster) return null;

  return (
    <Card className="border-l-4 border-l-[#8E7F73]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <span className={`p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 ${OHENG_TEXT_COLORS[yongsin]}`}>{OHENG_ICONS[yongsin]}</span>
          <span>나에게 필요한 기운: {yongsin}({booster.hanja})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg text-center border border-[#E8DCC4] dark:border-[#3E3832]">
              <span className="text-xs text-muted-foreground block mb-1">방향</span>
              <span className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0]">{booster.direction}</span>
            </div>
            <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg text-center border border-[#E8DCC4] dark:border-[#3E3832]">
              <span className="text-xs text-muted-foreground block mb-1">계절</span>
              <span className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0]">{booster.season}</span>
            </div>
            <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg text-center border border-[#E8DCC4] dark:border-[#3E3832]">
              <span className="text-xs text-muted-foreground block mb-1">행운 숫자</span>
              <span className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0]">{booster.numbers.join(", ")}</span>
            </div>
            <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg text-center border border-[#E8DCC4] dark:border-[#3E3832]">
              <span className="text-xs text-muted-foreground block mb-1">추천 색상</span>
              <span className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0]">{booster.color[0]}</span>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="font-serif">운을 높이는 방법 더보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 색상 */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-serif font-medium mb-2 text-sm text-muted-foreground">추천 색상</h4>
                  <div className="flex flex-wrap gap-2">
                    {booster.color.map((c) => (
                      <Badge key={c} variant="outline" className="bg-white">{c}</Badge>
                    ))}
                  </div>
                </div>

                {/* 음식 */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-serif font-medium mb-2 text-sm text-muted-foreground">추천 음식</h4>
                  <div className="flex flex-wrap gap-2">
                    {booster.foods.map((f) => (
                      <Badge key={f} variant="secondary">{f}</Badge>
                    ))}
                  </div>
                </div>

                {/* 활동 */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-serif font-medium mb-2 text-sm text-muted-foreground">추천 활동</h4>
                  <div className="flex flex-wrap gap-2">
                    {booster.activities.map((a) => (
                      <Badge key={a} variant="outline" className="bg-white">{a}</Badge>
                    ))}
                  </div>
                </div>

                {/* 직업/분야 */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-serif font-medium mb-2 text-sm text-muted-foreground">추천 직업/분야</h4>
                  <div className="flex flex-wrap gap-2">
                    {booster.careers.map((c) => (
                      <Badge key={c} variant="secondary">{c}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* 일상 습관 */}
              <div className="p-4 bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg">
                <h4 className="font-serif font-medium mb-2 text-[#8E7F73]">일상 습관</h4>
                <ul className="space-y-1">
                  {booster.habits.map((h) => (
                    <li key={h} className="text-sm flex items-center gap-2 text-stone-700 dark:text-stone-300">
                      <span className="w-1.5 h-1.5 bg-[#8E7F73] rounded-full" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 주의사항 */}
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                <h4 className="font-medium mb-1 text-orange-700 dark:text-orange-400 text-sm">⚠️ 과잉 시 주의</h4>
                <p className="text-xs text-orange-600 dark:text-orange-300">{booster.warning}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

// 천간 합/충 분석 카드
function CheonganRelationsCard({ pillars }: { pillars: Pillar[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // 천간들 추출
  const cheongans = pillars.map(p => p.cheongan);

  // 합 찾기
  const hapPairs: { hap: typeof CHEONGAN_HAP_INFO[string]; pair: [string, string] }[] = [];
  const hapMap: Record<string, string> = {
    "갑": "기", "기": "갑",
    "을": "경", "경": "을",
    "병": "신", "신": "병",
    "정": "임", "임": "정",
    "무": "계", "계": "무"
  };

  for (let i = 0; i < cheongans.length; i++) {
    for (let j = i + 1; j < cheongans.length; j++) {
      if (hapMap[cheongans[i]] === cheongans[j]) {
        const pairKey = [cheongans[i], cheongans[j]].sort().join("");
        const hapInfo = CHEONGAN_HAP_INFO[pairKey] || CHEONGAN_HAP_INFO[[cheongans[j], cheongans[i]].sort().join("")];
        if (hapInfo) {
          hapPairs.push({ hap: hapInfo, pair: [cheongans[i], cheongans[j]] });
        }
      }
    }
  }

  // 충 찾기
  const chungPairs: { chung: typeof CHEONGAN_CHUNG_INFO[string]; pair: [string, string] }[] = [];
  const chungMap: Record<string, string> = {
    "갑": "경", "경": "갑",
    "을": "신", "신": "을",
    "병": "임", "임": "병",
    "정": "계", "계": "정"
  };

  for (let i = 0; i < cheongans.length; i++) {
    for (let j = i + 1; j < cheongans.length; j++) {
      if (chungMap[cheongans[i]] === cheongans[j]) {
        const pairKey = [cheongans[i], cheongans[j]].sort().join("");
        const chungInfo = CHEONGAN_CHUNG_INFO[pairKey] || CHEONGAN_CHUNG_INFO[[cheongans[j], cheongans[i]].sort().join("")];
        if (chungInfo) {
          chungPairs.push({ chung: chungInfo, pair: [cheongans[i], cheongans[j]] });
        }
      }
    }
  }

  if (hapPairs.length === 0 && chungPairs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">천간 관계 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 요약 */}
          <div className="flex flex-wrap gap-2">
            {hapPairs.length > 0 && (
              <Badge className="bg-blue-600 hover:bg-blue-700">합(合) {hapPairs.length}개</Badge>
            )}
            {chungPairs.length > 0 && (
              <Badge className="bg-red-600 hover:bg-red-700">충(沖) {chungPairs.length}개</Badge>
            )}
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span>상세 분석 보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* 합 */}
              {hapPairs.map(({ hap, pair }) => (
                <div key={pair.join("")} className="p-4 border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-500">{hap.name}</Badge>
                    <span className="text-sm text-muted-foreground">{hap.hanja}</span>
                    <span className="text-sm">→ {hap.resultElement} 생성</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{hap.meaning}</p>
                  <p className="text-sm text-muted-foreground mb-2">{hap.characteristics}</p>
                  <div className="p-3 bg-white dark:bg-background rounded border mt-2">
                    <p className="text-sm"><span className="font-medium">관계에서:</span> {hap.inRelationship}</p>
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">[TIP] {hap.advice}</p>
                </div>
              ))}

              {/* 충 */}
              {chungPairs.map(({ chung, pair }) => (
                <div key={pair.join("")} className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-red-500">{chung.name}</Badge>
                    <span className="text-sm text-muted-foreground">{chung.hanja}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{chung.meaning}</p>
                  <p className="text-sm text-muted-foreground mb-2">{chung.characteristics}</p>
                  <div className="p-3 bg-white dark:bg-background rounded border mt-2">
                    <p className="text-sm"><span className="font-medium">관계에서:</span> {chung.inRelationship}</p>
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">[TIP] {chung.resolution}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

// 기둥별 개인 해석 카드
function PersonalPillarMeaningsCard({
  yearGapja,
  monthGapja,
  dayGapja,
  hourGapja,
  timeUnknown,
}: {
  yearGapja: string;
  monthGapja: string;
  dayGapja: string;
  hourGapja?: string;
  timeUnknown: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const meanings = getAllPillarMeanings(yearGapja, monthGapja, dayGapja, hourGapja);

  const pillarLabels = [
    { key: "year", label: "년주", gapja: yearGapja, emoji: "🌱" },
    { key: "month", label: "월주", gapja: monthGapja, emoji: "🌿" },
    { key: "day", label: "일주", gapja: dayGapja, emoji: "🌳" },
    ...(timeUnknown ? [] : [{ key: "hour", label: "시주", gapja: hourGapja || "", emoji: "🍎" }]),
  ];

  const getMeaning = (key: string): PillarPositionMeaning | null => {
    switch (key) {
      case "year": return meanings.year;
      case "month": return meanings.month;
      case "day": return meanings.day;
      case "hour": return meanings.hour;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Scroll className="w-5 h-5 text-[#8E7F73]" />
          나의 기둥별 해석
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          각 기둥(년주/월주/일주/시주)에 있는 글자가 당신의 인생 시기에 미치는 영향입니다.
        </p>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {pillarLabels.map(({ key, label, gapja, emoji }) => {
            const meaning = getMeaning(key);
            if (!meaning) return null;
            return (
              <div key={key} className="p-3 border rounded-lg bg-[#F9F7F2] dark:bg-[#2C2824] border-[#E8DCC4] dark:border-[#3E3832]">
                <div className="flex items-center gap-2 mb-1">
                  <span>{emoji}</span>
                  <span className="font-serif font-medium">{label}</span>
                  <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">{gapja}</Badge>
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300">{meaning.meaning}</p>
              </div>
            );
          })}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="font-serif">상세 해석 전체 보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {pillarLabels.map(({ key, label, gapja, emoji }) => {
              const meaning = getMeaning(key);
              if (!meaning) return null;
              return (
                <div key={key} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{emoji}</span>
                    <span className="font-bold text-lg font-serif">{label}</span>
                    <Badge className="bg-[#8E7F73]/10 text-[#8E7F73] border-[#8E7F73]/20">{gapja}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{meaning.meaning}</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-[#8E7F73]/60 rounded-full flex-shrink-0" />
                        {meaning.detail1}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-[#8E7F73]/60 rounded-full flex-shrink-0" />
                        {meaning.detail2}
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 mt-2 bg-[#8E7F73]/60 rounded-full flex-shrink-0" />
                        {meaning.detail3}
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 일간 성향 분석 카드
function IlganTraitsCard({ ilgan }: { ilgan: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const traits = getIlganTraits(ilgan);

  if (!traits) return null;

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#5C544A] to-[#8E7F73]"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E6] dark:bg-[#2C2824] text-lg">
            <User className="w-5 h-5 text-[#8E7F73]" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">일간(日干) 성향</span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">{traits.type}</span>
          </div>
          <Badge className="ml-auto bg-[#8E7F73]/10 text-[#8E7F73] border-[#8E7F73]/20">
            {traits.name}({traits.hanja}) · {traits.oheng} · {traits.yinyang}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 상징 & 키워드 */}
          <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl">🌟</span>
              <div>
                <p className="font-serif text-base font-medium text-[#5C544A] dark:text-[#D4C5B0] mb-1">
                  상징: {traits.symbol}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {traits.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-white/80 dark:bg-black/20 text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 성격 설명 */}
          <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {traits.personality}
            </p>
          </div>

          {/* 강점/약점 요약 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-2">💪 강점</p>
              <div className="flex flex-wrap gap-1">
                {traits.strengths.slice(0, 3).map((s) => (
                  <Badge key={s} variant="outline" className="text-[10px] bg-white/50 dark:bg-black/20 border-green-300">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-2">⚠️ 약점</p>
              <div className="flex flex-wrap gap-1">
                {traits.weaknesses.slice(0, 3).map((w) => (
                  <Badge key={w} variant="outline" className="text-[10px] bg-white/50 dark:bg-black/20 border-orange-300">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
                <span className="font-serif">상세 성향 분석 더보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* 스타일 분석 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-serif font-medium mb-2 flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4 text-[#8E7F73]" />
                    의사결정 스타일
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{traits.decisionStyle}</p>
                </div>
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-serif font-medium mb-2 flex items-center gap-2 text-sm">
                    <MessageCircle className="w-4 h-4 text-[#8E7F73]" />
                    관계 스타일
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{traits.relationStyle}</p>
                </div>
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-serif font-medium mb-2 flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-[#8E7F73]" />
                    업무 스타일
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{traits.workStyle}</p>
                </div>
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-serif font-medium mb-2 flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-[#8E7F73]" />
                    연애 스타일
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{traits.loveStyle}</p>
                </div>
              </div>

              {/* 스트레스 패턴 */}
              <div className="p-4 bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-900 rounded-lg">
                <h4 className="font-medium mb-1 text-red-700 dark:text-red-400 text-sm">😰 스트레스 받는 상황</h4>
                <p className="text-sm text-red-600 dark:text-red-300">{traits.stressPattern}</p>
              </div>

              {/* 조언 */}
              <div className="p-4 bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg border border-[#E8DCC4] dark:border-[#3E3832]">
                <h4 className="font-serif font-medium mb-2 text-[#8E7F73]">💡 당신을 위한 조언</h4>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{traits.advice}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

export function SajuResult({ result, name, timeUnknown = false }: SajuResultProps) {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount, yongsin, birthInfo, meta, majorFortunes, yearlyFortunes } = result;

  // 오행 개수 정렬
  const sortedOheng = Object.entries(ohengCount).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedOheng[0][1];
  const minCount = sortedOheng[sortedOheng.length - 1][1];

  // 동점인 오행 모두 찾기
  const maxOhengList = sortedOheng.filter(([_, count]) => count === maxCount);
  const minOhengList = sortedOheng.filter(([_, count]) => count === minCount);

  // 일주 계산 (일간 + 일지)
  const ilju = dayPillar.cheongan + dayPillar.jiji;
  const iljuSymbol = ILJU_SYMBOLS[ilju];
  const dominantOheng = maxOhengList[0][0];

  // 기둥별 갑자 계산
  const yearGapja = yearPillar.cheongan + yearPillar.jiji;
  const monthGapja = monthPillar.cheongan + monthPillar.jiji;
  const dayGapja = ilju; // 일주와 동일
  const hourGapja = timeUnknown ? undefined : timePillar.cheongan + timePillar.jiji;

  // 기둥 배열
  const pillars = timeUnknown
    ? [yearPillar, monthPillar, dayPillar]
    : [yearPillar, monthPillar, dayPillar, timePillar];

  // 격국 계산 (Phase 4 키워드 추출에 필요)
  const geokgukResult = determineGeokguk(monthPillar, dayPillar);
  const geokgukName = geokgukResult.geokguk;

  // 십신 분포 미리 계산 (여러 곳에서 사용)
  const sipsinDistribution = analyzeSipsinDistribution(pillars).distribution;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ========== 1. 도입부 ========== */}
      {/* 스토리텔링 도입부 */}
      <StoryIntroCard ilju={ilju} dominantOheng={dominantOheng} name={name} />

      {/* ========== 2. 기본 정보 ========== */}
      <Card className="overflow-hidden border-none shadow-sm bg-white/50 dark:bg-stone-900/50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{birthInfo.solarYear}.{birthInfo.solarMonth}.{birthInfo.solarDay}</span>
            </div>
            <div className="w-px h-3 bg-stone-300"></div>
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>{timeUnknown ? "시간 모름" : `${String(birthInfo.hour).padStart(2, "0")}:${String(birthInfo.minute).padStart(2, "0")}`}</span>
            </div>
            <div className="w-px h-3 bg-stone-300"></div>
            <div className="flex items-center gap-1">
              <span>🐯</span>
              <span>{meta.ddiLunar}띠</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========== 3. 사주 기둥 ========== */}
      <section className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="font-serif text-2xl font-bold text-[#5C544A] dark:text-[#D4C5B0]">
            {timeUnknown ? "나의 삼주(三柱)" : "나의 사주(四柱)"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            당신이 태어난 순간의 우주적 기운입니다
          </p>
        </div>

        <div className="flex justify-center gap-3 md:gap-6 overflow-x-auto py-4 px-2">
          {!timeUnknown && <PillarCard pillar={timePillar} label="시주 (말년)" />}
          <PillarCard pillar={dayPillar} label="일주 (중년)" />
          <PillarCard pillar={monthPillar} label="월주 (청년)" />
          <PillarCard pillar={yearPillar} label="년주 (초년)" />
        </div>

        {timeUnknown && (
          <p className="text-center text-xs text-orange-600/80 bg-orange-50/50 py-2 rounded-lg mx-auto max-w-md">
            ※ 태어난 시간을 모르면 말년운과 자식운을 나타내는 '시주'를 정확히 알 수 없습니다.
          </p>
        )}
      </section>

      {/* ========== 4. 나의 정체성 ========== */}
      {/* 일주 상징/별명 */}
      {iljuSymbol && <IljuSymbolCard ilju={ilju} symbol={iljuSymbol} />}

      {/* 일간 성향 분석 */}
      <IlganTraitsCard ilgan={dayPillar.cheongan} />

      {/* 자연 비유 프로필 */}
      <NatureProfileCard ilgan={dayPillar.cheongan} name={name} />

      {/* 종합 키워드 */}
      <CoreKeywordsCard
        ilgan={dayPillar.cheongan}
        yongsin={yongsin}
        geokguk={geokgukName}
        name={name}
      />

      {/* ========== 5. 오행 분석 ========== */}
      {/* 오행 감성 메시지 */}
      <OhengEmotionalMessage yongsin={yongsin} />

      {/* 오행 분석 (Radar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">오행의 균형 (五行)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-stone-50 dark:bg-stone-900/50 rounded-xl p-4">
              <OhengChart ohengCount={ohengCount} />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">가장 강한 기운</h4>
                <div className="flex flex-wrap gap-2">
                  {maxOhengList.map(([element, count]) => (
                    <Badge key={element} className={`${OHENG_COLORS[element]} text-white border-none px-3 py-1`}>
                      {element} ({count}개)
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  당신의 성향과 재능을 주도하는 핵심 에너지입니다.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">부족하거나 없는 기운</h4>
                <div className="flex flex-wrap gap-2">
                  {minOhengList.map(([element, count]) => (
                    <Badge key={element} variant="outline" className="border-stone-300">
                      {element} ({count}개)
                    </Badge>
                  ))}
                </div>
                {minCount === 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    ※ 없는 오행은 살면서 의식적으로 보완하면 좋습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 오행 보완법 */}
      {yongsin && <OhengBoosterDetailCard yongsin={yongsin} />}

      {/* ========== 6. 성격/적성 분석 ========== */}
      {/* 십신 상세 분석 */}
      <SipsinDetailCard pillars={pillars} timeUnknown={timeUnknown} />

      {/* 격국 분석 */}
      <GeokgukCard monthPillar={monthPillar} dayPillar={dayPillar} />

      {/* 인간관계 패턴 분석 */}
      <RelationshipPatternCard sipsinDistribution={sipsinDistribution} />

      {/* 직업 적성 심화 분석 */}
      <CareerAptitudeCard sipsinDistribution={sipsinDistribution} />

      {/* ========== 7. 운세 분석 ========== */}
      {/* 재물운 분석 */}
      <WealthFortuneCard pillars={pillars.map(p => ({ ...p, ganji: p.cheongan + p.jiji }))} />

      {/* 건강 체질 분석 */}
      <HealthConstitutionCard ohengCount={ohengCount} />

      {/* 조후(調候) 분석 */}
      <JohuCard
        monthJiji={monthPillar.jiji}
        ohengCount={ohengCount}
        yongsin={yongsin}
      />

      {/* 신살(神殺) 분석 */}
      <SinsalCard
        pillars={pillars}
        dayCheongan={dayPillar.cheongan}
        dayJiji={dayPillar.jiji}
      />

      {/* ========== 8. 시간 흐름 (대운/연운) ========== */}
      {/* 현재 인생 단계 */}
      <LifePhaseCard birthYear={birthInfo.solarYear} name={name} />

      {/* 대운+연운 통합 그래프 */}
      {majorFortunes && majorFortunes.length > 0 && yearlyFortunes && yearlyFortunes.length > 0 && (
        <FortuneFlowChart
          majorFortunes={majorFortunes}
          yearlyFortunes={yearlyFortunes}
          birthYear={birthInfo.solarYear}
          yongsin={yongsin}
        />
      )}

      {/* 대운(大運) 타임라인 */}
      {majorFortunes && majorFortunes.length > 0 && (
        <DaeunTimelineCard
          majorFortunes={majorFortunes}
          birthYear={birthInfo.solarYear}
        />
      )}

      {/* 인생 여정 타임라인 */}
      {majorFortunes && majorFortunes.length > 0 && (
        <LifeJourneyTimeline
          majorFortunes={majorFortunes}
          birthYear={birthInfo.solarYear}
        />
      )}

      {/* 연운(年運) 카드 */}
      {yearlyFortunes && yearlyFortunes.length > 0 && (
        <YearlyFortuneCard
          yearlyFortunes={yearlyFortunes}
          ilgan={dayPillar.cheongan}
          yongsin={yongsin}
        />
      )}

      {/* ========== 9. 참고 정보 ========== */}
      {/* 사주 기둥별 영역 설명 */}
      <PillarMeaningsCard timeUnknown={timeUnknown} />

      {/* 천간 관계 분석 (합/충) */}
      <CheonganRelationsCard pillars={pillars} />

      {/* 나의 기둥별 개인 해석 */}
      <PersonalPillarMeaningsCard
        yearGapja={yearGapja}
        monthGapja={monthGapja}
        dayGapja={dayGapja}
        hourGapja={hourGapja}
        timeUnknown={timeUnknown}
      />

      {/* ========== 10. 총정리 ========== */}
      <Card className="border-2 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-serif text-[#5C544A] dark:text-[#D4C5B0] flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            사주 총정리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 핵심 정보 요약 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white/70 dark:bg-stone-900/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">일주</p>
              <p className="font-serif font-bold text-lg text-[#5C544A] dark:text-[#D4C5B0]">{ilju}</p>
              {iljuSymbol && <p className="text-xs text-amber-600">{iljuSymbol.nickname}</p>}
            </div>
            <div className="p-3 bg-white/70 dark:bg-stone-900/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">용신</p>
              <p className="font-serif font-bold text-lg text-[#5C544A] dark:text-[#D4C5B0]">{yongsin}</p>
              <p className="text-xs text-amber-600">보완 오행</p>
            </div>
            <div className="p-3 bg-white/70 dark:bg-stone-900/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">격국</p>
              <p className="font-serif font-bold text-lg text-[#5C544A] dark:text-[#D4C5B0]">{geokgukName}</p>
            </div>
            <div className="p-3 bg-white/70 dark:bg-stone-900/50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">주요 오행</p>
              <p className="font-serif font-bold text-lg text-[#5C544A] dark:text-[#D4C5B0]">{dominantOheng}</p>
              <p className="text-xs text-amber-600">{maxCount}개로 가장 강함</p>
            </div>
          </div>

          {/* 한 줄 요약 */}
          <div className="p-5 bg-white/80 dark:bg-stone-900/60 rounded-xl border border-amber-200 dark:border-amber-800">
            <p className="text-center text-stone-700 dark:text-stone-300 leading-relaxed">
              <span className="font-medium text-[#8E7F73]">{name || "당신"}</span>은(는){" "}
              <span className="font-medium text-[#5C544A] dark:text-[#D4C5B0]">{iljuSymbol?.nickname || ilju}</span>의 기운을 가진{" "}
              <span className={`font-medium ${OHENG_TEXT_COLORS[dominantOheng]}`}>{dominantOheng}</span> 성향의 인물로,{" "}
              <span className="font-medium text-[#5C544A] dark:text-[#D4C5B0]">{geokgukName}</span>의 구조를 갖추고 있습니다.{" "}
              <span className={`font-medium ${OHENG_TEXT_COLORS[yongsin]}`}>{yongsin}</span>의 기운을 보강하면 더욱 균형 잡힌 삶을 살 수 있습니다.
            </p>
          </div>

          {/* 핵심 조언 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 text-sm">💪 강점</h4>
              <p className="text-xs text-green-600 dark:text-green-300">
                {dominantOheng === "목" && "성장과 창의성, 리더십이 뛰어납니다."}
                {dominantOheng === "화" && "열정과 표현력, 소통 능력이 탁월합니다."}
                {dominantOheng === "토" && "안정감과 신뢰성, 중재 능력이 강합니다."}
                {dominantOheng === "금" && "결단력과 정의감, 실행력이 뛰어납니다."}
                {dominantOheng === "수" && "지혜와 통찰력, 적응력이 탁월합니다."}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2 text-sm">🎯 추천 방향</h4>
              <p className="text-xs text-blue-600 dark:text-blue-300">
                {yongsin === "목" && "자기계발, 교육, 창의적 활동을 추천합니다."}
                {yongsin === "화" && "표현력 개발, 대인관계 확장을 추천합니다."}
                {yongsin === "토" && "안정적 기반 구축, 신뢰 관계 형성을 추천합니다."}
                {yongsin === "금" && "목표 설정, 결단력 있는 실행을 추천합니다."}
                {yongsin === "수" && "학습과 연구, 내면 성찰을 추천합니다."}
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2 text-sm">⚠️ 주의할 점</h4>
              <p className="text-xs text-orange-600 dark:text-orange-300">
                {dominantOheng === "목" && "조급함과 고집을 줄이고 유연성을 기르세요."}
                {dominantOheng === "화" && "충동적 결정을 피하고 차분함을 유지하세요."}
                {dominantOheng === "토" && "고집과 완고함을 줄이고 변화를 받아들이세요."}
                {dominantOheng === "금" && "지나친 완벽주의를 경계하고 여유를 가지세요."}
                {dominantOheng === "수" && "우유부단함을 줄이고 결단력을 기르세요."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
