"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, Heart } from "lucide-react";
import { KakaoAdfitCoupleBanner } from "@/components/KakaoAdfit";
import type { SajuApiResult } from "@/types/saju";
import { type CompatibilityResult, getIlganCompatibilityScore } from "@/lib/saju-compatibility";
import {
  ILJU_SYMBOLS,
  OHENG_BOOSTERS,
  generateGroupStoryIntro,
} from "@/lib/saju-analysis-data";
import { analyzeIljuCompatibility, analyzeIlganRelationship, type IlganRelationship } from "@/lib/saju-family";
import type { MajorFortuneInfo } from "@/lib/saju-calculator";
import { DAEUN_OHENG_INTERPRETATION } from "@/lib/saju-fortune-data";
import { getScoreColorClass } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
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

// 개인 사주 요약 카드
function PersonSummaryCard({
  result,
  label,
  gender,
  timeUnknown
}: {
  result: SajuApiResult;
  label: string;
  gender: "male" | "female";
  timeUnknown: boolean;
}) {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount, meta } = result;

  return (
    <Card className="bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 shadow-sm">
      <CardHeader className="pb-2 border-b border-stone-100 dark:border-stone-800">
        <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <span className="text-base">{gender === "male" ? "👨" : "👩"}</span>
          {label}
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

        {/* 시간 미상 안내 */}
        {timeUnknown && (
          <p className="text-center text-xs text-orange-600/80 dark:text-orange-400/80 bg-orange-50/50 dark:bg-orange-950/20 py-1.5 rounded-lg">
            ※ 태어난 시간 미상
          </p>
        )}

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

// 배우자궁 분석 카드
function SpousePalaceCard({
  person1,
  person2,
  name1,
  name2,
  gender1,
  gender2,
}: {
  person1: SajuApiResult;
  person2: SajuApiResult;
  name1: string;
  name2: string;
  gender1: "male" | "female";
  gender2: "male" | "female";
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 일지 (배우자궁) - 일주의 지지
  const spousePalace1 = person1.dayPillar.jiji;
  const spousePalace2 = person2.dayPillar.jiji;

  // 십성 관계 분석 (배우자궁 지지와 상대 일간)
  // Note: 배우자궁은 지지인데, 십성 계산은 천간 기반이므로
  // 여기서는 일간-일간 관계로 해석
  const relation1 = analyzeIlganRelationship(person1.dayPillar.cheongan, person2.dayPillar.cheongan, "couple");
  const relation2 = analyzeIlganRelationship(person2.dayPillar.cheongan, person1.dayPillar.cheongan, "couple");

  // 지지에서 한자 가져오기
  const JIJI_HANJA: Record<string, string> = {
    자: "子", 축: "丑", 인: "寅", 묘: "卯",
    진: "辰", 사: "巳", 오: "午", 미: "未",
    신: "申", 유: "酉", 술: "戌", 해: "亥",
  };

  // 성별에 따른 배우자 십성 해석
  const getSpouseInterpretation = (gender: "male" | "female", relation: IlganRelationship) => {
    // 남자의 경우: 재성(편재/정재)이 아내를 나타냄
    // 여자의 경우: 관성(편관/정관)이 남편을 나타냄
    const sipseong = relation.type;

    if (gender === "male") {
      if (sipseong === "정재" || sipseong === "편재") {
        return "이상적인 배우자 관계입니다. 자연스럽게 상대방을 아끼고 보살피게 됩니다.";
      }
      if (sipseong === "정관" || sipseong === "편관") {
        return "상대방으로부터 도전받는 느낌을 받을 수 있지만, 이는 서로를 성장시키는 관계가 됩니다.";
      }
      if (sipseong === "정인" || sipseong === "편인") {
        return "상대방이 지혜와 도움을 주는 관계입니다. 의지가 되는 파트너입니다.";
      }
      if (sipseong === "식신" || sipseong === "상관") {
        return "상대방을 자연스럽게 돌보고 표현하게 됩니다. 감정 표현이 풍부한 관계입니다.";
      }
      if (sipseong === "비견" || sipseong === "겁재") {
        return "동등한 파트너로서 서로를 이해하지만, 경쟁심이 생길 수 있어 배려가 필요합니다.";
      }
    } else {
      if (sipseong === "정관" || sipseong === "편관") {
        return "이상적인 배우자 관계입니다. 상대방이 든든한 지지자가 됩니다.";
      }
      if (sipseong === "정재" || sipseong === "편재") {
        return "상대방을 돌보고 싶은 마음이 생기는 관계입니다. 실질적인 도움을 주고받습니다.";
      }
      if (sipseong === "정인" || sipseong === "편인") {
        return "상대방이 지혜와 도움을 주는 관계입니다. 배움이 있는 파트너십입니다.";
      }
      if (sipseong === "식신" || sipseong === "상관") {
        return "자신을 표현하고 상대방을 돌보는 관계입니다. 창의적인 에너지가 흐릅니다.";
      }
      if (sipseong === "비견" || sipseong === "겁재") {
        return "동등한 파트너로서 서로를 이해하지만, 각자의 영역을 존중하는 것이 중요합니다.";
      }
    }
    return relation.dynamics;
  };

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
      <CardHeader>
        <CardTitle className="font-serif text-[#5C544A] dark:text-[#D4C5B0] flex items-center gap-2">
          <span className="text-xl">💑</span>
          배우자궁 분석
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          일주의 지지(일지)는 배우자의 자리를 나타냅니다
        </p>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-4">
            {/* Person 1의 배우자궁 분석 */}
            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-rose-800 dark:text-rose-200">
                <span>{gender1 === "male" ? "👨" : "👩"}</span>
                <span>{name1}님의 배우자궁</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold px-3 py-1 rounded ${OHENG_COLORS[person1.dayPillar.jijiOheng]} text-white`}>
                  {JIJI_HANJA[spousePalace1] || spousePalace1}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{spousePalace1}</span>
                  <span className="text-muted-foreground mx-1">·</span>
                  <span className={OHENG_TEXT_COLORS[person1.dayPillar.jijiOheng]}>{person1.dayPillar.jijiOheng}</span>
                </div>
              </div>
              <div className="mt-2 text-sm space-y-1">
                <p className="text-muted-foreground">
                  → 상대방 {name2}님의 일간: <span className={`font-medium ${OHENG_TEXT_COLORS[person2.dayPillar.cheonganOheng]}`}>{person2.dayPillar.cheongan}</span>
                </p>
                <p className="text-muted-foreground">
                  → 관계: <Badge variant="outline" className="ml-1">{relation1.type}</Badge>
                </p>
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 bg-white/50 dark:bg-black/20 p-2 rounded">
                {getSpouseInterpretation(gender1, relation1)}
              </p>
            </div>

            {/* Person 2의 배우자궁 분석 */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                <span>{gender2 === "male" ? "👨" : "👩"}</span>
                <span>{name2}님의 배우자궁</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-bold px-3 py-1 rounded ${OHENG_COLORS[person2.dayPillar.jijiOheng]} text-white`}>
                  {JIJI_HANJA[spousePalace2] || spousePalace2}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">{spousePalace2}</span>
                  <span className="text-muted-foreground mx-1">·</span>
                  <span className={OHENG_TEXT_COLORS[person2.dayPillar.jijiOheng]}>{person2.dayPillar.jijiOheng}</span>
                </div>
              </div>
              <div className="mt-2 text-sm space-y-1">
                <p className="text-muted-foreground">
                  → 상대방 {name1}님의 일간: <span className={`font-medium ${OHENG_TEXT_COLORS[person1.dayPillar.cheonganOheng]}`}>{person1.dayPillar.cheongan}</span>
                </p>
                <p className="text-muted-foreground">
                  → 관계: <Badge variant="outline" className="ml-1">{relation2.type}</Badge>
                </p>
              </div>
              <p className="text-sm text-stone-700 dark:text-stone-300 bg-white/50 dark:bg-black/20 p-2 rounded">
                {getSpouseInterpretation(gender2, relation2)}
              </p>
            </div>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground hover:text-foreground">
              {isOpen ? (
                <>
                  접기 <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  상세 해석 보기 <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-amber-800 dark:text-amber-200">배우자궁이란?</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                사주에서 일주(日柱)의 지지를 &apos;배우자궁&apos;이라 합니다. 이 자리는 배우자의 성향과
                부부 관계의 특성을 나타냅니다. 배우자궁의 오행과 상대방의 일간(日干)을 비교하면
                두 사람이 어떤 에너지로 만나는지 알 수 있습니다.
              </p>

              <div className="border-t border-amber-200 dark:border-amber-800 pt-3">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">십성별 배우자 관계</h4>
                <div className="grid gap-2 text-xs">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="shrink-0">비견·겁재</Badge>
                    <span className="text-muted-foreground">동등한 파트너, 친구 같은 관계</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="shrink-0">식신·상관</Badge>
                    <span className="text-muted-foreground">돌봄을 주는 관계, 표현력이 풍부</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="shrink-0">편재·정재</Badge>
                    <span className="text-muted-foreground">현실적 관계, 남자에게는 아내의 자리</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="shrink-0">편관·정관</Badge>
                    <span className="text-muted-foreground">도전과 책임 관계, 여자에게는 남편의 자리</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="shrink-0">편인·정인</Badge>
                    <span className="text-muted-foreground">지혜와 도움을 주는 관계</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 십성 관계 분석 카드
function SipseongRelationCard({
  person1,
  person2,
  name1,
  name2,
  gender1,
  gender2,
}: {
  person1: SajuApiResult;
  person2: SajuApiResult;
  name1: string;
  name2: string;
  gender1: "male" | "female";
  gender2: "male" | "female";
}) {
  const [isOpen, setIsOpen] = useState(false);

  // 양방향 십성 관계 분석
  const relation1to2 = analyzeIlganRelationship(person1.dayPillar.cheongan, person2.dayPillar.cheongan, "couple");
  const relation2to1 = analyzeIlganRelationship(person2.dayPillar.cheongan, person1.dayPillar.cheongan, "couple");

  // 십성별 한자
  const SIPSEONG_HANJA: Record<string, string> = {
    비견: "比肩", 겁재: "劫財",
    식신: "食神", 상관: "傷官",
    편재: "偏財", 정재: "正財",
    편관: "偏官", 정관: "正官",
    편인: "偏印", 정인: "正印",
  };

  // 십성별 간단 설명
  const SIPSEONG_SHORT: Record<string, string> = {
    비견: "동등한 동료",
    겁재: "경쟁적 동료",
    식신: "편안한 돌봄",
    상관: "자극적 표현",
    편재: "현실적 관계",
    정재: "헌신적 관계",
    편관: "도전적 관계",
    정관: "책임감 관계",
    편인: "독특한 지원",
    정인: "지혜로운 지원",
  };

  // 호환성 점수 색상
  const getCompatColor = (compat: string) => {
    switch (compat) {
      case "상": return "text-green-600 dark:text-green-400";
      case "중상": return "text-emerald-600 dark:text-emerald-400";
      case "중": return "text-amber-600 dark:text-amber-400";
      case "중하": return "text-orange-600 dark:text-orange-400";
      case "하": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  // 관계 종합 평가 (실제 궁합 점수 기반)
  const getOverallAssessment = () => {
    // ILGAN_COMPATIBILITY의 실제 점수 사용 (50-90 범위)
    const score1 = getIlganCompatibilityScore(person1.dayPillar.cheongan, person2.dayPillar.cheongan);
    const score2 = getIlganCompatibilityScore(person2.dayPillar.cheongan, person1.dayPillar.cheongan);
    const avg = (score1 + score2) / 2;

    // 전체 궁합 점수와 일관된 기준 적용
    if (avg >= 85) return { grade: "최상의 조합", desc: "서로를 완벽하게 보완하는 이상적인 관계입니다.", emoji: "💕" };
    if (avg >= 75) return { grade: "좋은 조합", desc: "서로에게 좋은 영향을 주는 조화로운 관계입니다.", emoji: "💝" };
    if (avg >= 65) return { grade: "무난한 조합", desc: "노력하면 좋은 관계를 유지할 수 있습니다.", emoji: "💛" };
    if (avg >= 55) return { grade: "노력 필요", desc: "서로의 차이를 이해하고 배려가 필요합니다.", emoji: "🧡" };
    return { grade: "주의 필요", desc: "근본적인 성향 차이가 있어 많은 노력이 필요합니다.", emoji: "💔" };
  };

  const assessment = getOverallAssessment();

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
      <CardHeader>
        <CardTitle className="font-serif text-[#5C544A] dark:text-[#D4C5B0] flex items-center gap-2">
          <span className="text-xl">🔮</span>
          십성 관계 분석
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          두 일간(日干)의 십성 관계로 보는 상호작용
        </p>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* 종합 평가 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl mr-2">{assessment.emoji}</span>
                <span className="font-medium text-purple-800 dark:text-purple-200">{assessment.grade}</span>
              </div>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">{assessment.desc}</p>
          </div>

          {/* 양방향 관계 */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Person1 → Person2 */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{gender1 === "male" ? "👨" : "👩"}</span>
                <span className="font-medium text-sm">{name1}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm">{gender2 === "male" ? "👨" : "👩"}</span>
                <span className="font-medium text-sm">{name2}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {relation1to2.type}
                </Badge>
                <span className="text-xs text-muted-foreground">({SIPSEONG_HANJA[relation1to2.type]})</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{SIPSEONG_SHORT[relation1to2.type]}</p>
              <p className={`text-xs font-medium ${getCompatColor(relation1to2.compatibility)}`}>
                호환성: {relation1to2.compatibility}
              </p>
            </div>

            {/* Person2 → Person1 */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">{gender2 === "male" ? "👨" : "👩"}</span>
                <span className="font-medium text-sm">{name2}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-sm">{gender1 === "male" ? "👨" : "👩"}</span>
                <span className="font-medium text-sm">{name1}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                  {relation2to1.type}
                </Badge>
                <span className="text-xs text-muted-foreground">({SIPSEONG_HANJA[relation2to1.type]})</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{SIPSEONG_SHORT[relation2to1.type]}</p>
              <p className={`text-xs font-medium ${getCompatColor(relation2to1.compatibility)}`}>
                호환성: {relation2to1.compatibility}
              </p>
            </div>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground hover:text-foreground">
              {isOpen ? (
                <>
                  접기 <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  상세 해석 보기 <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-4 animate-in slide-in-from-top-2">
            {/* Person1 → Person2 상세 */}
            <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                {name1}님이 {name2}님을 바라보는 관계
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">{relation1to2.description}</p>
              <div className="border-t border-purple-200 dark:border-purple-800 pt-2 mt-2">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-300">조언:</p>
                <p className="text-xs text-stone-600 dark:text-stone-400">{relation1to2.advice}</p>
              </div>
            </div>

            {/* Person2 → Person1 상세 */}
            <div className="bg-pink-50/50 dark:bg-pink-950/20 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-pink-800 dark:text-pink-200 text-sm">
                {name2}님이 {name1}님을 바라보는 관계
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">{relation2to1.description}</p>
              <div className="border-t border-pink-200 dark:border-pink-800 pt-2 mt-2">
                <p className="text-xs font-medium text-pink-700 dark:text-pink-300">조언:</p>
                <p className="text-xs text-stone-600 dark:text-stone-400">{relation2to1.advice}</p>
              </div>
            </div>

            {/* 십성 해설 */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">십성이란?</h4>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                십성(十星)은 나의 일간을 기준으로 다른 천간과의 관계를 나타내는 10가지 유형입니다.
                같은 오행인지, 내가 생하는 오행인지, 내가 극하는 오행인지, 나를 극하는 오행인지,
                나를 생하는 오행인지에 따라 비견·겁재, 식신·상관, 편재·정재, 편관·정관, 편인·정인으로 나뉩니다.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// 대운 흐름 비교 카드
function CoupleFortuneComparisonCard({
  fortunes1,
  fortunes2,
  name1,
  name2,
  birthYear1,
  birthYear2,
  yongsin1,
  yongsin2,
}: {
  fortunes1: MajorFortuneInfo[];
  fortunes2: MajorFortuneInfo[];
  name1: string;
  name2: string;
  birthYear1: number;
  birthYear2: number;
  yongsin1: string;
  yongsin2: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  // 현재 나이 계산 (한국 나이)
  const currentAge1 = currentYear - birthYear1 + 1;
  const currentAge2 = currentYear - birthYear2 + 1;

  // 현재 대운 찾기
  const findCurrentFortune = (fortunes: MajorFortuneInfo[], age: number) => {
    return fortunes.find(f => f.startAge <= age && f.endAge >= age);
  };

  const currentFortune1 = findCurrentFortune(fortunes1, currentAge1);
  const currentFortune2 = findCurrentFortune(fortunes2, currentAge2);

  // 대운이 용신과 일치하면 황금기
  const isGoldenPeriod = (fortune: MajorFortuneInfo | undefined, yongsin: string) => {
    if (!fortune) return false;
    return fortune.element === yongsin;
  };

  // 두 사람의 황금기 오버랩 찾기
  const findGoldenOverlaps = () => {
    const overlaps: { period: string; elements: string[] }[] = [];
    const currentDecade = Math.floor(currentYear / 10) * 10;

    // 향후 50년 체크
    for (let year = currentDecade; year <= currentDecade + 50; year += 10) {
      const age1AtYear = year - birthYear1 + 1;
      const age2AtYear = year - birthYear2 + 1;

      const fortune1AtYear = fortunes1.find(f => f.startAge <= age1AtYear && f.endAge >= age1AtYear);
      const fortune2AtYear = fortunes2.find(f => f.startAge <= age2AtYear && f.endAge >= age2AtYear);

      if (fortune1AtYear && fortune2AtYear) {
        const is1Golden = fortune1AtYear.element === yongsin1;
        const is2Golden = fortune2AtYear.element === yongsin2;

        if (is1Golden && is2Golden) {
          overlaps.push({
            period: `${year}년대`,
            elements: [fortune1AtYear.element, fortune2AtYear.element],
          });
        }
      }
    }
    return overlaps;
  };

  const goldenOverlaps = findGoldenOverlaps();

  if (!fortunes1.length && !fortunes2.length) {
    return null;
  }

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
      <CardHeader>
        <CardTitle className="font-serif text-[#5C544A] dark:text-[#D4C5B0] flex items-center gap-2">
          <span className="text-xl">⏰</span>
          대운 흐름 비교
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          두 분의 10년 대운 흐름을 비교합니다
        </p>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* 현재 대운 비교 */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Person 1 현재 대운 */}
            <div className={`rounded-lg p-4 ${isGoldenPeriod(currentFortune1, yongsin1) ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" : "bg-stone-50 dark:bg-stone-900"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{name1}님 현재 대운</span>
                {isGoldenPeriod(currentFortune1, yongsin1) && (
                  <Badge className="bg-amber-500 text-white text-xs">황금기</Badge>
                )}
              </div>
              {currentFortune1 ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-serif font-bold">{currentFortune1.ganji}</span>
                    <Badge className={`${OHENG_COLORS[currentFortune1.element]} text-white`}>
                      {currentFortune1.element}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentFortune1.startAge}세 ~ {currentFortune1.endAge}세 ({currentAge1}세)
                  </p>
                  {DAEUN_OHENG_INTERPRETATION[currentFortune1.element] && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                      {DAEUN_OHENG_INTERPRETATION[currentFortune1.element].theme}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">대운 정보 없음</p>
              )}
            </div>

            {/* Person 2 현재 대운 */}
            <div className={`rounded-lg p-4 ${isGoldenPeriod(currentFortune2, yongsin2) ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" : "bg-stone-50 dark:bg-stone-900"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{name2}님 현재 대운</span>
                {isGoldenPeriod(currentFortune2, yongsin2) && (
                  <Badge className="bg-amber-500 text-white text-xs">황금기</Badge>
                )}
              </div>
              {currentFortune2 ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-serif font-bold">{currentFortune2.ganji}</span>
                    <Badge className={`${OHENG_COLORS[currentFortune2.element]} text-white`}>
                      {currentFortune2.element}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {currentFortune2.startAge}세 ~ {currentFortune2.endAge}세 ({currentAge2}세)
                  </p>
                  {DAEUN_OHENG_INTERPRETATION[currentFortune2.element] && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                      {DAEUN_OHENG_INTERPRETATION[currentFortune2.element].theme}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">대운 정보 없음</p>
              )}
            </div>
          </div>

          {/* 황금기 오버랩 */}
          {goldenOverlaps.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-4 mb-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-amber-800 dark:text-amber-200 text-sm">함께하는 황금기</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
                두 분 모두 용신(필요한 오행)이 들어오는 행운의 시기입니다
              </p>
              <div className="flex flex-wrap gap-2">
                {goldenOverlaps.map((overlap, i) => (
                  <Badge key={i} className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {overlap.period}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground hover:text-foreground">
              {isOpen ? (
                <>
                  접기 <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  전체 대운 타임라인 보기 <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-4 animate-in slide-in-from-top-2">
            {/* 타임라인 비교 */}
            <div className="space-y-4">
              {/* Person 1 타임라인 */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-stone-700 dark:text-stone-300">{name1}님의 대운 흐름</h4>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {fortunes1.slice(0, 6).map((fortune, i) => {
                    const isCurrentFortune = fortune === currentFortune1;
                    const isGolden = fortune.element === yongsin1;
                    return (
                      <div
                        key={i}
                        className={`flex-shrink-0 px-3 py-2 rounded text-center text-xs ${
                          isCurrentFortune
                            ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/50"
                            : isGolden
                              ? "bg-amber-50 dark:bg-amber-950/30"
                              : "bg-stone-100 dark:bg-stone-800"
                        }`}
                      >
                        <div className="font-serif font-bold">{fortune.ganji}</div>
                        <div className={`text-xs ${OHENG_TEXT_COLORS[fortune.element]}`}>{fortune.element}</div>
                        <div className="text-muted-foreground text-[10px]">{fortune.startAge}-{fortune.endAge}세</div>
                        {isGolden && <span className="text-amber-500 text-[10px]">★</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Person 2 타임라인 */}
              <div>
                <h4 className="font-medium text-sm mb-2 text-stone-700 dark:text-stone-300">{name2}님의 대운 흐름</h4>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {fortunes2.slice(0, 6).map((fortune, i) => {
                    const isCurrentFortune = fortune === currentFortune2;
                    const isGolden = fortune.element === yongsin2;
                    return (
                      <div
                        key={i}
                        className={`flex-shrink-0 px-3 py-2 rounded text-center text-xs ${
                          isCurrentFortune
                            ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/50"
                            : isGolden
                              ? "bg-amber-50 dark:bg-amber-950/30"
                              : "bg-stone-100 dark:bg-stone-800"
                        }`}
                      >
                        <div className="font-serif font-bold">{fortune.ganji}</div>
                        <div className={`text-xs ${OHENG_TEXT_COLORS[fortune.element]}`}>{fortune.element}</div>
                        <div className="text-muted-foreground text-[10px]">{fortune.startAge}-{fortune.endAge}세</div>
                        {isGolden && <span className="text-amber-500 text-[10px]">★</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 범례 */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2 border-t border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded ring-2 ring-purple-500 bg-purple-50"></div>
                  <span>현재 대운</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span>황금기 (용신 대운)</span>
                </div>
              </div>
            </div>

            {/* 대운 해설 */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">대운이란?</h4>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                대운(大運)은 10년 단위로 변하는 인생의 큰 흐름입니다. 사주의 월주를 기준으로 순행 또는 역행하며
                각 대운의 오행이 용신과 일치하면 &apos;황금기&apos;로, 행운이 따르는 시기입니다.
                두 분의 황금기가 겹치는 시기에 함께 중요한 결정을 하면 좋습니다.
              </p>
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

// 궁합 이유 카드 (왜 잘 맞는가/안 맞는가)
function CompatibilityReasonCard({ compatibility, name1, name2 }: {
  compatibility: CompatibilityResult;
  name1: string;
  name2: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { ilganAnalysis, ohengAnalysis } = compatibility;

  // 긍정적 요소들 통합
  const positiveReasons = [
    ...ilganAnalysis.positive.map(p => ({ text: p, source: "일간 관계" })),
    ...ohengAnalysis.complementary.map(c => ({ text: c, source: "오행 조화" })),
  ];

  // 부정적 요소들 통합
  const negativeReasons = [
    ...ilganAnalysis.negative.map(n => ({ text: n, source: "일간 관계" })),
    ...ohengAnalysis.conflict.map(c => ({ text: c, source: "오행 상극" })),
  ];

  return (
    <Card className="border-stone-200 dark:border-stone-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <span className="text-xl">🔍</span>
          왜 이런 궁합인가요?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {name1}님과 {name2}님의 사주를 비교한 결과입니다
        </p>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          {/* 일간 관계 설명 */}
          <div className="mb-4 p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg border border-[#E8DCC4] dark:border-[#3E3832]">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-white dark:bg-black/20">{ilganAnalysis.type}</Badge>
              <span className="text-sm font-medium text-[#5C544A] dark:text-[#D4C5B0]">관계</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {ilganAnalysis.typeDescription}
            </p>
          </div>

          {/* 요약: 잘 맞는 점과 주의할 점 */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* 잘 맞는 점 */}
            {positiveReasons.length > 0 && (
              <div className="p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                  <span>💚</span> 잘 맞는 점
                </h4>
                <ul className="space-y-1.5">
                  {positiveReasons.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-stone-700 dark:text-stone-300">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 주의할 점 */}
            {negativeReasons.length > 0 && (
              <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
                <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                  <span>⚠️</span> 주의할 점
                </h4>
                <ul className="space-y-1.5">
                  {negativeReasons.slice(0, 3).map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2 text-stone-700 dark:text-stone-300">
                      <span className="text-orange-600 mt-0.5">!</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-stone-100 dark:hover:bg-stone-800">
              <span className="font-serif text-stone-600 dark:text-stone-400">상세 분석 보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-4">
            {/* 오행 분석 */}
            <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
              <h4 className="font-semibold mb-3 font-serif text-[#5C544A] dark:text-[#D4C5B0]">오행 균형 분석</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">{name1}님</p>
                  <div className="space-y-1">
                    {ohengAnalysis.person1Strong.length > 0 && (
                      <p className="text-stone-700 dark:text-stone-300">
                        <span className="text-blue-600">강한 기운:</span> {ohengAnalysis.person1Strong.join(", ")}
                      </p>
                    )}
                    {ohengAnalysis.person1Weak.length > 0 && (
                      <p className="text-stone-700 dark:text-stone-300">
                        <span className="text-orange-600">약한 기운:</span> {ohengAnalysis.person1Weak.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">{name2}님</p>
                  <div className="space-y-1">
                    {ohengAnalysis.person2Strong.length > 0 && (
                      <p className="text-stone-700 dark:text-stone-300">
                        <span className="text-blue-600">강한 기운:</span> {ohengAnalysis.person2Strong.join(", ")}
                      </p>
                    )}
                    {ohengAnalysis.person2Weak.length > 0 && (
                      <p className="text-stone-700 dark:text-stone-300">
                        <span className="text-orange-600">약한 기운:</span> {ohengAnalysis.person2Weak.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 보완 관계 상세 */}
              {ohengAnalysis.complementaryDetails && ohengAnalysis.complementaryDetails.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h5 className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                    ✨ 서로 채워주는 부분
                  </h5>
                  {ohengAnalysis.complementaryDetails.map((detail, idx) => (
                    <div key={idx} className="p-4 bg-green-50/50 dark:bg-green-950/10 rounded-lg border border-green-100 dark:border-green-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{detail.emoji}</span>
                        <span className="font-medium text-green-800 dark:text-green-300">{detail.title}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-stone-600 dark:text-stone-400">
                          <span className="text-green-600 dark:text-green-500 font-medium">
                            {detail.whoLacks === "person1" ? "본인의 상황:" : "상대방의 상황:"}
                          </span>{" "}
                          {detail.lackingText}
                        </p>
                        <p className="text-stone-600 dark:text-stone-400">
                          <span className="text-green-600 dark:text-green-500 font-medium">채워주는 효과:</span>{" "}
                          {detail.fillsText}
                        </p>
                        <p className="text-green-700 dark:text-green-400 font-medium mt-2 pt-2 border-t border-green-100 dark:border-green-900/30">
                          💑 {detail.benefitText}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 상극 관계 상세 */}
              {ohengAnalysis.conflictDetails && ohengAnalysis.conflictDetails.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h5 className="font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
                    ⚡ 주의가 필요한 부분
                  </h5>
                  {ohengAnalysis.conflictDetails.map((detail, idx) => (
                    <div key={idx} className="p-4 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-100 dark:border-orange-900/30">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{detail.emojis[0]}{detail.emojis[1]}</span>
                        <span className="font-medium text-orange-800 dark:text-orange-300">{detail.title}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-stone-600 dark:text-stone-400">{detail.description}</p>
                        <p className="text-orange-600 dark:text-orange-400">
                          <span className="font-medium">⚠️ 주의:</span> {detail.warning}
                        </p>
                        <p className="text-blue-700 dark:text-blue-400 font-medium mt-2 pt-2 border-t border-orange-100 dark:border-orange-900/30">
                          💡 {detail.advice}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 모든 이유 상세 */}
            {(positiveReasons.length > 3 || negativeReasons.length > 3) && (
              <div className="grid md:grid-cols-2 gap-4">
                {positiveReasons.length > 3 && (
                  <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                    <h5 className="font-medium mb-2 text-green-700 dark:text-green-400">추가 강점</h5>
                    <ul className="space-y-1">
                      {positiveReasons.slice(3).map((item, i) => (
                        <li key={i} className="text-sm text-stone-600 dark:text-stone-400">• {item.text}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {negativeReasons.length > 3 && (
                  <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
                    <h5 className="font-medium mb-2 text-orange-700 dark:text-orange-400">추가 주의점</h5>
                    <ul className="space-y-1">
                      {negativeReasons.slice(3).map((item, i) => (
                        <li key={i} className="text-sm text-stone-600 dark:text-stone-400">• {item.text}</li>
                      ))}
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
          <div className={`text-6xl font-serif font-bold ${getScoreColorClass(totalScore)}`}>
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

export function CoupleResultContent() {
  const router = useRouter();
  const [person1Result, setPerson1Result] = useState<SajuApiResult | null>(null);
  const [person2Result, setPerson2Result] = useState<SajuApiResult | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [names, setNames] = useState({ person1: "", person2: "" });
  const [genders, setGenders] = useState<{ person1: "male" | "female"; person2: "male" | "female" }>({ person1: "female", person2: "female" });
  const [timeUnknown, setTimeUnknown] = useState({ person1: false, person2: false });
  const [majorFortunes, setMajorFortunes] = useState<{ person1: MajorFortuneInfo[]; person2: MajorFortuneInfo[] }>({ person1: [], person2: [] });
  const [birthYears, setBirthYears] = useState<{ person1: number; person2: number }>({ person1: 2000, person2: 2000 });

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // sessionStorage에서 데이터 읽기
        const stored = sessionStorage.getItem("saju_couple");
        if (!stored) {
          setError("분석할 데이터가 없습니다. 다시 입력해주세요.");
          setLoading(false);
          return;
        }

        const data = JSON.parse(stored);
        const { person1, person2 } = data;

        // Person 1 데이터
        const p1Year = parseInt(person1.year);
        const p1Month = parseInt(person1.month);
        const p1Day = parseInt(person1.day);
        const p1Hour = parseInt(person1.hour);
        const p1Minute = parseInt(person1.minute);
        const p1Lunar = person1.lunar;
        const p1LeapMonth = person1.leap || false;
        const p1Name = person1.name || "첫 번째 분";
        const p1Gender = person1.gender || "female";
        const p1TimeUnknown = person1.timeUnknown;

        // Person 2 데이터
        const p2Year = parseInt(person2.year);
        const p2Month = parseInt(person2.month);
        const p2Day = parseInt(person2.day);
        const p2Hour = parseInt(person2.hour);
        const p2Minute = parseInt(person2.minute);
        const p2Lunar = person2.lunar;
        const p2LeapMonth = person2.leap || false;
        const p2Name = person2.name || "두 번째 분";
        const p2Gender = person2.gender || "female";
        const p2TimeUnknown = person2.timeUnknown;

        setNames({ person1: p1Name, person2: p2Name });
        setGenders({ person1: p1Gender, person2: p2Gender });
        setTimeUnknown({ person1: p1TimeUnknown, person2: p2TimeUnknown });

        if (!p1Year || !p1Month || !p1Day || !p2Year || !p2Month || !p2Day) {
          setError("생년월일 정보가 부족합니다.");
          setLoading(false);
          return;
        }

        // 두 사람의 사주 계산 API 호출
        const [res1, res2] = await Promise.all([
          apiFetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year: p1Year, month: p1Month, day: p1Day,
              hour: p1Hour, minute: p1Minute,
              isLunar: p1Lunar, isLeapMonth: p1LeapMonth,
              timeUnknown: p1TimeUnknown,
              gender: p1Gender,
            }),
          }),
          apiFetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year: p2Year, month: p2Month, day: p2Day,
              hour: p2Hour, minute: p2Minute,
              isLunar: p2Lunar, isLeapMonth: p2LeapMonth,
              timeUnknown: p2TimeUnknown,
              gender: p2Gender,
            }),
          }),
        ]);

        const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

        if (!res1.ok || !res2.ok) {
          throw new Error(data1.error || data2.error || "사주 계산 중 오류가 발생했습니다.");
        }

        setPerson1Result(data1.data);
        setPerson2Result(data2.data);

        // 대운 데이터 저장
        setMajorFortunes({
          person1: data1.data.majorFortunes || [],
          person2: data2.data.majorFortunes || [],
        });

        // 생년 저장
        setBirthYears({
          person1: data1.data.birthInfo?.solarYear || p1Year,
          person2: data2.data.birthInfo?.solarYear || p2Year,
        });

        // 궁합 분석 API 호출
        const compatRes = await apiFetch("/api/saju/compatibility", {
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
  }, []);

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
            label={names.person1}
            gender={genders.person1}
            timeUnknown={timeUnknown.person1}
          />
          <PersonSummaryCard
            result={person2Result}
            label={names.person2}
            gender={genders.person2}
            timeUnknown={timeUnknown.person2}
          />
        </div>

        {/* 시간 미입력 안내 */}
        {compatibility.timeInfo?.usingReducedPillars && (
          <div className="text-center text-xs text-blue-600/80 bg-blue-50/50 dark:bg-blue-950/30 py-2 px-3 rounded-lg">
            {compatibility.timeInfo.person1TimeUnknown && compatibility.timeInfo.person2TimeUnknown ? (
              <>※ 두 분 모두 태어난 시간 미입력으로 년/월/일주(6글자) 기준으로 분석했습니다.</>
            ) : compatibility.timeInfo.person1TimeUnknown ? (
              <>※ {names.person1}님의 시간 미입력으로 두 분 모두 년/월/일주(6글자) 기준으로 분석했습니다.</>
            ) : (
              <>※ {names.person2}님의 시간 미입력으로 두 분 모두 년/월/일주(6글자) 기준으로 분석했습니다.</>
            )}
          </div>
        )}

        {/* 일주 상징 비교 */}
        <CoupleIljuCard
          person1={person1Result}
          person2={person2Result}
          name1={names.person1}
          name2={names.person2}
        />

        {/* 배우자궁 분석 */}
        <SpousePalaceCard
          person1={person1Result}
          person2={person2Result}
          name1={names.person1}
          name2={names.person2}
          gender1={genders.person1}
          gender2={genders.person2}
        />

        {/* 십성 관계 분석 */}
        <SipseongRelationCard
          person1={person1Result}
          person2={person2Result}
          name1={names.person1}
          name2={names.person2}
          gender1={genders.person1}
          gender2={genders.person2}
        />

        {/* 대운 흐름 비교 */}
        <CoupleFortuneComparisonCard
          fortunes1={majorFortunes.person1}
          fortunes2={majorFortunes.person2}
          name1={names.person1}
          name2={names.person2}
          birthYear1={birthYears.person1}
          birthYear2={birthYears.person2}
          yongsin1={person1Result.yongsin}
          yongsin2={person2Result.yongsin}
        />

        {/* 궁합 이유 (왜 잘 맞는가/안 맞는가) */}
        <CompatibilityReasonCard
          compatibility={compatibility}
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

        {/* 총정리 */}
        <Card className="border-2 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-amber-800 dark:text-amber-300">
              <span className="text-2xl">📋</span>
              총정리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 핵심 요약 */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{names.person1}</div>
                <div className="font-medium text-sm flex items-center gap-1">
                  <span>{person1Result.dayPillar.ganji}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    {person1Result.yongsin}
                    {OHENG_ICONS[person1Result.yongsin]}
                  </span>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">{names.person2}</div>
                <div className="font-medium text-sm flex items-center gap-1">
                  <span>{person2Result.dayPillar.ganji}</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    {person2Result.yongsin}
                    {OHENG_ICONS[person2Result.yongsin]}
                  </span>
                </div>
              </div>
            </div>

            {/* 궁합 점수 */}
            <div className="text-center py-3 bg-white/60 dark:bg-black/20 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">궁합 점수</div>
              <div className={`text-3xl font-bold font-serif ${getScoreColorClass(compatibility.totalScore)}`}>
                {compatibility.totalScore}점
              </div>
              <Badge className="mt-2">{compatibility.grade}</Badge>
            </div>

            {/* 한줄 요약 */}
            <div className="p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 font-medium text-center">
                {compatibility.summary.advice}
              </p>
            </div>

            {/* 핵심 조언 */}
            <div className="grid gap-2">
              {compatibility.summary.strengths.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-stone-700 dark:text-stone-300">{compatibility.summary.strengths[0]}</span>
                </div>
              )}
              {compatibility.summary.weaknesses.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 font-bold">!</span>
                  <span className="text-stone-700 dark:text-stone-300">{compatibility.summary.weaknesses[0]}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 버튼 */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => router.push("/")} className="border-stone-300 hover:bg-stone-100">
            새로 분석하기
          </Button>
          <BokbiModal />
        </div>

        {/* 광고 */}
        <div className="mt-8">
          <KakaoAdfitCoupleBanner />
        </div>
      </div>
    </main>
  );
}

