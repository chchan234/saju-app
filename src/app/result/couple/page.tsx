"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, Heart, User } from "lucide-react";
import type { SajuApiResult } from "@/types/saju";
import type { CompatibilityResult } from "@/lib/saju-compatibility";
import {
  ILJU_SYMBOLS,
  OHENG_BOOSTERS,
  generateGroupStoryIntro,
} from "@/lib/saju-analysis-data";
import { analyzeIljuCompatibility } from "@/lib/saju-family";
import {
  PillarCard,
  MysticalIntroCard,
  OHENG_COLORS,
  OHENG_TEXT_COLORS,
  OHENG_ICONS,
  BokbiModal,
} from "@/components/saju/SajuUI";

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] dark:bg-[#1c1917]">
      <Card className="w-full max-w-md mx-4 bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E7F73]" />
            <p className="text-stone-600 dark:text-stone-400 font-serif">두 분의 인연을 읽고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 점수에 따른 색상
function getScoreColor(score: number): string {
  if (score >= 85) return "text-pink-600 dark:text-pink-400";
  if (score >= 75) return "text-blue-600 dark:text-blue-400";
  if (score >= 65) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 55) return "text-orange-600 dark:text-orange-400";
  return "text-stone-500 dark:text-stone-400";
}

// 개인 사주 요약 카드
function PersonSummaryCard({
  result,
  name,
  label,
  timeUnknown
}: {
  result: SajuApiResult;
  name: string;
  label: string;
  timeUnknown: boolean;
}) {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount, meta } = result;

  return (
    <Card className="bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 shadow-sm">
      <CardHeader className="pb-2 border-b border-stone-100 dark:border-stone-800">
        <CardTitle className="text-lg flex items-center justify-between font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {label}
          </div>
          {name && <Badge variant="secondary" className="font-sans">{name}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* 사주 기둥 */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          <PillarCard pillar={yearPillar} label="년" size="small" />
          <PillarCard pillar={monthPillar} label="월" size="small" />
          <PillarCard pillar={dayPillar} label="일" size="small" />
          {!timeUnknown && <PillarCard pillar={timePillar} label="시" size="small" />}
        </div>

        {/* 일간 정보 */}
        <div className="text-center text-sm bg-stone-50 dark:bg-stone-900 rounded-lg p-2">
          <span className="text-muted-foreground">일간: </span>
          <span className={`font-medium ${OHENG_TEXT_COLORS[dayPillar.cheonganOheng]}`}>{dayPillar.cheongan}({dayPillar.cheonganOheng})</span>
          <span className="text-muted-foreground ml-3">띠: </span>
          <span className="font-medium">{meta.ddi}띠</span>
        </div>

        {/* 오행 분포 */}
        <div className="flex justify-center gap-2">
          {Object.entries(ohengCount).map(([oheng, count]) => (
            <div key={oheng} className="text-center">
              <div className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center shadow-sm ${OHENG_COLORS[oheng]}`}>
                {oheng}
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 커플 스토리 도입부 카드
function CoupleStoryIntroCard({ score, name1, name2 }: { score: number; name1: string; name2: string }) {
  const storyIntro = generateGroupStoryIntro(2, score, false);

  return (
    <MysticalIntroCard
      variant="couple"
      title={
        <>
          {name1}님과 {name2}님의 <br />
          <span className="text-pink-400">"인연의 깊이"</span>
        </>
      }
      content={storyIntro}
      footer={<>두 분의 사주를 자세히 살펴보겠습니다</>}
    />
  );
}

// 커플 일주 상징 비교 카드
function CoupleIljuCard({ person1, person2, name1, name2 }: {
  person1: SajuApiResult;
  person2: SajuApiResult;
  name1: string;
  name2: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const ilju1 = person1.dayPillar.cheongan + person1.dayPillar.jiji;
  const ilju2 = person2.dayPillar.cheongan + person2.dayPillar.jiji;
  const symbol1 = ILJU_SYMBOLS[ilju1];
  const symbol2 = ILJU_SYMBOLS[ilju2];

  if (!symbol1 && !symbol2) return null;

  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <Sparkles className="w-5 h-5 text-pink-500" />
          두 분의 일주 상징
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Person 1 */}
            <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg border border-[#E8DCC4] dark:border-[#3E3832]">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-white dark:bg-black/20">{name1}</Badge>
                {symbol1 && <span className="text-sm font-medium text-[#8E7F73]">{symbol1.hanja}</span>}
              </div>
              {symbol1 ? (
                <>
                  <p className="font-medium text-lg font-serif text-[#5C544A] dark:text-[#D4C5B0]">&quot;{symbol1.nickname}&quot;</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{symbol1.essence}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">일주 정보 없음</p>
              )}
            </div>

            {/* Person 2 */}
            <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg border border-[#E8DCC4] dark:border-[#3E3832]">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-white dark:bg-black/20">{name2}</Badge>
                {symbol2 && <span className="text-sm font-medium text-[#8E7F73]">{symbol2.hanja}</span>}
              </div>
              {symbol2 ? (
                <>
                  <p className="font-medium text-lg font-serif text-[#5C544A] dark:text-[#D4C5B0]">&quot;{symbol2.nickname}&quot;</p>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{symbol2.essence}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">일주 정보 없음</p>
              )}
            </div>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
              <span className="font-serif text-stone-600 dark:text-stone-400">상세 성향 비교</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {symbol1 && (
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-medium mb-2 font-serif text-[#8E7F73]">{name1}님의 성격</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{symbol1.personality}</p>
                  <p className="text-sm text-[#8E7F73] mt-2 font-medium">인생 주제: {symbol1.lifeTheme}</p>
                </div>
              )}
              {symbol2 && (
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-medium mb-2 font-serif text-[#8E7F73]">{name2}님의 성격</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{symbol2.personality}</p>
                  <p className="text-sm text-[#8E7F73] mt-2 font-medium">인생 주제: {symbol2.lifeTheme}</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 커플 오행 보완 제안 카드
function CoupleOhengAdviceCard({ person1, person2, name1, name2 }: {
  person1: SajuApiResult;
  person2: SajuApiResult;
  name1: string;
  name2: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const yongsin1 = person1.yongsin;
  const yongsin2 = person2.yongsin;
  const booster1 = OHENG_BOOSTERS[yongsin1];
  const booster2 = OHENG_BOOSTERS[yongsin2];

  // 공통 활동 찾기
  const commonActivities = booster1 && booster2
    ? booster1.activities.filter(a => booster2.activities.includes(a))
    : [];

  // 공통 음식 찾기
  const commonFoods = booster1 && booster2
    ? booster1.foods.filter(f => booster2.foods.includes(f))
    : [];

  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <CardHeader>
        <CardTitle className="font-serif text-[#5C544A] dark:text-[#D4C5B0]">함께 하면 좋은 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-4">
            {/* 개인별 보완 오행 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-lg flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{name1}님 보완 오행</span>
                <Badge className={`${OHENG_COLORS[yongsin1]} text-white border-none`}>{yongsin1}</Badge>
              </div>
              <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-lg flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{name2}님 보완 오행</span>
                <Badge className={`${OHENG_COLORS[yongsin2]} text-white border-none`}>{yongsin2}</Badge>
              </div>
            </div>

            {/* 공통 추천 */}
            {commonActivities.length > 0 && (
              <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-100 dark:border-pink-900">
                <h4 className="font-medium mb-2 text-pink-800 dark:text-pink-300 font-serif">두 분 모두에게 좋은 활동</h4>
                <div className="flex flex-wrap gap-2">
                  {commonActivities.map(a => (
                    <Badge key={a} variant="secondary" className="bg-white dark:bg-black/20">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mt-4 hover:bg-stone-100 dark:hover:bg-stone-800">
              <span className="font-serif text-stone-600 dark:text-stone-400">개인별 상세 보완법</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {booster1 && (
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-medium mb-2 font-serif flex items-center gap-2">
                    {name1}님 <span className="text-xs text-muted-foreground">({yongsin1} 보완)</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">방향:</span> {booster1.direction}</p>
                    <p><span className="text-muted-foreground">계절:</span> {booster1.season}</p>
                    <div>
                      <span className="text-muted-foreground">추천 활동:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {booster1.activities.slice(0, 4).map(a => (
                          <Badge key={a} variant="outline" className="text-xs bg-stone-50 dark:bg-stone-900">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {booster2 && (
                <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                  <h4 className="font-medium mb-2 font-serif flex items-center gap-2">
                    {name2}님 <span className="text-xs text-muted-foreground">({yongsin2} 보완)</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">방향:</span> {booster2.direction}</p>
                    <p><span className="text-muted-foreground">계절:</span> {booster2.season}</p>
                    <div>
                      <span className="text-muted-foreground">추천 활동:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {booster2.activities.slice(0, 4).map(a => (
                          <Badge key={a} variant="outline" className="text-xs bg-stone-50 dark:bg-stone-900">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 공통 음식 */}
            {commonFoods.length > 0 && (
              <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                <h4 className="font-medium mb-2 font-serif">함께 먹으면 좋은 음식</h4>
                <div className="flex flex-wrap gap-2">
                  {commonFoods.map(f => (
                    <Badge key={f} variant="secondary" className="bg-stone-100 dark:bg-stone-800">{f}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 궁합 결과 카드
function CompatibilityCard({ compatibility, person1, person2, name1, name2 }: {
  compatibility: CompatibilityResult;
  person1: SajuApiResult;
  person2: SajuApiResult;
  name1: string;
  name2: string;
}) {
  const { totalScore, grade, gradeDescription, ilganAnalysis, jijiAnalysis, summary } = compatibility;
  const [isIljuOpen, setIsIljuOpen] = useState(false);

  // 일주 정보 추출
  const ilju1 = person1.dayPillar.ganji;
  const ilju2 = person2.dayPillar.ganji;
  const iljuAnalysis = ilju1 && ilju2 ? analyzeIljuCompatibility(ilju1, ilju2) : null;
  const { isSpecialMatch, matchInfo, ilganRelation } = iljuAnalysis || { isSpecialMatch: false, matchInfo: undefined, ilganRelation: undefined };

  // 카테고리별 배지 색상
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "천생연분": return "bg-pink-500 text-white hover:bg-pink-600";
      case "상호보완": return "bg-blue-500 text-white hover:bg-blue-600";
      case "동반성장": return "bg-green-500 text-white hover:bg-green-600";
      case "주의필요": return "bg-orange-500 text-white hover:bg-orange-600";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="border-2 border-pink-200 dark:border-pink-900/50 shadow-lg">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-serif text-[#5C544A] dark:text-[#D4C5B0]">궁합 분석 결과</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 총점 및 등급 */}
        <div className="text-center space-y-2">
          <div className={`text-6xl font-serif font-bold ${getScoreColor(totalScore)}`}>
            {totalScore}<span className="text-2xl text-muted-foreground ml-1">점</span>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1 font-serif bg-stone-100 dark:bg-stone-800">
            {grade}
          </Badge>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{gradeDescription}</p>
        </div>

        {/* 일간 관계 */}
        <div className="bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg p-4 space-y-3 border border-[#E8DCC4] dark:border-[#3E3832]">
          <h4 className="font-semibold flex items-center gap-2 font-serif text-[#8E7F73]">
            일간(日干) 관계
            <Badge variant="outline" className="bg-white dark:bg-black/20">{ilganAnalysis.type}</Badge>
          </h4>
          <p className="text-xs text-muted-foreground">
            일간은 사주에서 나 자신을 나타내며, 두 사람의 일간 관계로 기본적인 궁합을 파악합니다.
          </p>
          <div className="text-center py-4 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">{name1}</span>
              <span className="font-serif text-2xl font-bold">{ilganAnalysis.person1Ilgan}</span>
            </div>
            <span className="text-muted-foreground">↔</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">{name2}</span>
              <span className="font-serif text-2xl font-bold">{ilganAnalysis.person2Ilgan}</span>
            </div>
          </div>
          <div className="bg-white/50 dark:bg-black/20 rounded p-3 text-center">
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300">{ilganAnalysis.typeDescription}</p>
          </div>
        </div>

        {/* 지지 관계 */}
        {(jijiAnalysis.yukap.length > 0 || jijiAnalysis.chung.length > 0 ||
          jijiAnalysis.hyung.length > 0 || jijiAnalysis.hae.length > 0) && (
            <div className="space-y-4">
              <h4 className="font-semibold font-serif text-[#5C544A] dark:text-[#D4C5B0]">지지(地支) 관계</h4>

              {/* 육합 - 좋은 관계 */}
              {jijiAnalysis.yukap.length > 0 && (
                <div className="space-y-2">
                  {jijiAnalysis.yukap.map((item, i) => (
                    <div key={`yukap-${i}`} className="bg-green-50/50 border border-green-200 dark:border-green-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-600 text-white hover:bg-green-600 border-none">
                          {item.pair} {item.name}
                        </Badge>
                        <span className="text-green-700 dark:text-green-400 text-sm font-medium">조화로운 관계</span>
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 충 - 충돌 관계 */}
              {jijiAnalysis.chung.length > 0 && (
                <div className="space-y-2">
                  {jijiAnalysis.chung.map((item, i) => (
                    <div key={`chung-${i}`} className="bg-red-50/50 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-600 text-white hover:bg-red-600 border-none">
                          {item.pair} {item.name}
                        </Badge>
                        <span className="text-red-700 dark:text-red-400 text-sm font-medium">충돌 관계</span>
                      </div>
                      <p className="text-sm text-red-800 dark:text-red-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 형/해 등 기타 관계 생략 또는 추가 가능 */}
            </div>
          )}

        {/* 강점/약점 요약 */}
        <div className="grid md:grid-cols-2 gap-4">
          {summary.strengths.length > 0 && (
            <div className="space-y-2 p-4 bg-green-50/30 rounded-lg border border-green-100 dark:border-green-900/30">
              <h4 className="font-semibold text-green-700 dark:text-green-400 font-serif">강점</h4>
              <ul className="space-y-1">
                {summary.strengths.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <span className="text-green-600 mt-0.5">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {summary.weaknesses.length > 0 && (
            <div className="space-y-2 p-4 bg-red-50/30 rounded-lg border border-red-100 dark:border-red-900/30">
              <h4 className="font-semibold text-red-700 dark:text-red-400 font-serif">주의점</h4>
              <ul className="space-y-1">
                {summary.weaknesses.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2 text-stone-700 dark:text-stone-300">
                    <span className="text-red-600 mt-0.5">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 조언 */}
        <div className="bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg p-6 border border-[#E8DCC4] dark:border-[#3E3832]">
          <h4 className="font-semibold mb-2 font-serif text-[#8E7F73]">최종 조언</h4>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{summary.advice}</p>
        </div>

        {/* 일주 관계 분석 (점수/등급 없이 관계만) */}
        {iljuAnalysis && ilju1 && ilju2 && (
          <div className="border-t border-stone-200 dark:border-stone-800 pt-6 space-y-4">
            <h4 className="font-semibold flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
              <Heart className="w-4 h-4 text-pink-500" />
              일주(日柱) 관계 분석
              {isSpecialMatch && matchInfo && (
                <Badge className={getCategoryBadgeColor(matchInfo.category)}>
                  {matchInfo.category}
                </Badge>
              )}
            </h4>

            {/* 일주 비교 */}
            <div className="flex items-center justify-center gap-4">
              <div className="text-center p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800">
                <p className="text-xs text-muted-foreground mb-1">{name1}</p>
                <p className="text-xl font-serif font-bold">{ilju1}</p>
              </div>
              <div className="text-xl font-bold text-pink-500">&amp;</div>
              <div className="text-center p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-100 dark:border-stone-800">
                <p className="text-xs text-muted-foreground mb-1">{name2}</p>
                <p className="text-xl font-serif font-bold">{ilju2}</p>
              </div>
            </div>

            {/* 상세 분석 Collapsible */}
            <Collapsible open={isIljuOpen} onOpenChange={setIsIljuOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
                  <span className="font-serif text-stone-600 dark:text-stone-400">일주 상세 분석 보기</span>
                  {isIljuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4 pt-4">
                {/* 관계 조언 */}
                {ilganRelation && (
                  <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-lg">
                    <h5 className="font-semibold mb-2 font-serif text-sm">관계 조언</h5>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{ilganRelation.advice}</p>
                  </div>
                )}

                {/* 특별 조합 상세 */}
                {isSpecialMatch && matchInfo && (
                  <>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2 font-serif text-sm">맞춤 조언</h5>
                      <p className="text-sm text-stone-600 dark:text-stone-400">{matchInfo.advice}</p>
                    </div>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CoupleResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [person1Result, setPerson1Result] = useState<SajuApiResult | null>(null);
  const [person2Result, setPerson2Result] = useState<SajuApiResult | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [names, setNames] = useState({ person1: "", person2: "" });
  const [timeUnknown, setTimeUnknown] = useState({ person1: false, person2: false });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Person 1 데이터
        const p1Year = parseInt(searchParams.get("p1_year") || "0");
        const p1Month = parseInt(searchParams.get("p1_month") || "0");
        const p1Day = parseInt(searchParams.get("p1_day") || "0");
        const p1Hour = parseInt(searchParams.get("p1_hour") || "0");
        const p1Minute = parseInt(searchParams.get("p1_minute") || "0");
        const p1Lunar = searchParams.get("p1_lunar") === "true";
        const p1Name = searchParams.get("p1_name") || "나";
        const p1TimeUnknown = searchParams.get("p1_timeUnknown") === "true";

        // Person 2 데이터
        const p2Year = parseInt(searchParams.get("p2_year") || "0");
        const p2Month = parseInt(searchParams.get("p2_month") || "0");
        const p2Day = parseInt(searchParams.get("p2_day") || "0");
        const p2Hour = parseInt(searchParams.get("p2_hour") || "0");
        const p2Minute = parseInt(searchParams.get("p2_minute") || "0");
        const p2Lunar = searchParams.get("p2_lunar") === "true";
        const p2Name = searchParams.get("p2_name") || "상대방";
        const p2TimeUnknown = searchParams.get("p2_timeUnknown") === "true";

        setNames({ person1: p1Name, person2: p2Name });
        setTimeUnknown({ person1: p1TimeUnknown, person2: p2TimeUnknown });

        if (!p1Year || !p1Month || !p1Day || !p2Year || !p2Month || !p2Day) {
          setError("생년월일 정보가 부족합니다.");
          setLoading(false);
          return;
        }

        // 두 사람의 사주 계산 API 호출
        const [res1, res2] = await Promise.all([
          fetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year: p1Year, month: p1Month, day: p1Day,
              hour: p1Hour, minute: p1Minute,
              isLunar: p1Lunar, timeUnknown: p1TimeUnknown,
            }),
          }),
          fetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year: p2Year, month: p2Month, day: p2Day,
              hour: p2Hour, minute: p2Minute,
              isLunar: p2Lunar, timeUnknown: p2TimeUnknown,
            }),
          }),
        ]);

        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        if (!res1.ok || !res2.ok) {
          throw new Error(data1.error || data2.error || "사주 계산 중 오류가 발생했습니다.");
        }

        setPerson1Result(data1.data);
        setPerson2Result(data2.data);

        // 궁합 분석 API 호출
        const compatRes = await fetch("/api/saju/compatibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person1: data1.data,
            person2: data2.data,
          }),
        });

        const compatData = await compatRes.json();
        if (!compatRes.ok) {
          throw new Error(compatData.error || "궁합 분석 중 오류가 발생했습니다.");
        }

        setCompatibility(compatData.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] dark:bg-[#1c1917]">
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

  if (!person1Result || !person2Result || !compatibility) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F5F1E6] dark:bg-[#1c1917] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2 text-[#5C544A] dark:text-[#D4C5B0]">커플 궁합 분석</h1>
          <p className="text-muted-foreground">
            두 분의 사주를 바탕으로 분석한 궁합입니다
          </p>
        </header>

        {/* 스토리 도입부 */}
        <CoupleStoryIntroCard
          score={compatibility.totalScore}
          name1={names.person1}
          name2={names.person2}
        />

        {/* 두 사람 사주 요약 */}
        <div className="grid md:grid-cols-2 gap-4">
          <PersonSummaryCard
            result={person1Result}
            name={names.person1}
            label="나"
            timeUnknown={timeUnknown.person1}
          />
          <PersonSummaryCard
            result={person2Result}
            name={names.person2}
            label="상대방"
            timeUnknown={timeUnknown.person2}
          />
        </div>

        {/* 일주 상징 비교 */}
        <CoupleIljuCard
          person1={person1Result}
          person2={person2Result}
          name1={names.person1}
          name2={names.person2}
        />

        {/* 궁합 분석 결과 (일주 관계 포함) */}
        <CompatibilityCard
          compatibility={compatibility}
          person1={person1Result}
          person2={person2Result}
          name1={names.person1}
          name2={names.person2}
        />

        {/* 함께하면 좋은 활동 */}
        <CoupleOhengAdviceCard
          person1={person1Result}
          person2={person2Result}
          name1={names.person1}
          name2={names.person2}
        />

        {/* 버튼 */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => router.push("/")} className="border-stone-300 hover:bg-stone-100">
            새로 분석하기
          </Button>
          <BokbiModal />
        </div>

      </div>
    </main>
  );
}

export default function CoupleResultPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <CoupleResultContent />
    </Suspense>
  );
}
