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
import { ChevronDown, ChevronUp, Sparkles, TreePine, Sun, Mountain, Gem, Waves, Leaf, Flame, Cloud, Wind, Heart, Compass, Star, Target } from "lucide-react";
import type { MajorFortuneInfo } from "@/lib/saju-calculator";
import {
  NATURE_PROFILES,
  DAEUN_STORY_PHASES,
  OHENG_EMOTIONAL_MESSAGES,
  extractCoreKeywords,
  getDaeunStoryPhase,
  generatePersonalityStory,
  enrichDaeunInfo,
  type NatureProfile,
  type DaeunStoryPhase,
  type CoreKeywords,
  type EnrichedDaeunInfo,
} from "@/lib/saju-storytelling";

// 일간에 해당하는 아이콘
const ILGAN_ICONS: Record<string, React.ReactNode> = {
  갑: <TreePine className="w-6 h-6" />,
  을: <Leaf className="w-6 h-6" />,
  병: <Sun className="w-6 h-6" />,
  정: <Flame className="w-6 h-6" />,
  무: <Mountain className="w-6 h-6" />,
  기: <Cloud className="w-6 h-6" />,
  경: <Gem className="w-6 h-6" />,
  신: <Sparkles className="w-6 h-6" />,
  임: <Waves className="w-6 h-6" />,
  계: <Wind className="w-6 h-6" />,
};

// ============================================
// 자연 비유 프로필 카드
// ============================================

interface NatureProfileCardProps {
  ilgan: string;
  name?: string;
}

export function NatureProfileCard({ ilgan, name }: NatureProfileCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const profile = NATURE_PROFILES[ilgan];

  if (!profile) return null;

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-[#F9F7F2] to-[#EDE8DC] dark:from-[#2C2824] dark:to-[#1E1A17] overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-[#8E7F73] via-[#BFA588] to-[#8E7F73]"></div>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/50 dark:bg-black/20 text-[#8E7F73]">
            {ILGAN_ICONS[ilgan] || <Sparkles className="w-6 h-6" />}
          </span>
          <div>
            <span className="block text-xs text-muted-foreground font-sans font-normal tracking-wider uppercase">
              Nature Profile
            </span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">
              {name ? `${name}님은` : "당신은"}
            </span>
          </div>
          <span className="ml-auto text-3xl">{profile.natureEmoji}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 핵심 이미지 */}
        <div className="text-center py-6 px-4 bg-white/60 dark:bg-black/20 rounded-2xl border border-[#E8DCC4]/50 dark:border-[#3E3832]/50">
          <p className="font-serif text-2xl font-bold text-[#5C544A] dark:text-[#D4C5B0] mb-2">
            {profile.natureImage}
          </p>
          <p className="text-sm text-[#8E7F73]">{profile.essence}</p>
        </div>

        {/* 시적 묘사 */}
        <div className="p-5 bg-white/40 dark:bg-black/10 rounded-xl border-l-4 border-[#BFA588]">
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
            "{profile.poeticDescription}"
          </p>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-[#8E7F73]/10"
            >
              <span className="font-serif text-[#8E7F73]">더 깊이 알아보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-[#8E7F73]" /> : <ChevronDown className="w-4 h-4 text-[#8E7F73]" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* 상세 정보 그리드 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/50 dark:bg-black/10 rounded-lg text-center">
                <span className="text-xs text-muted-foreground block mb-1">어울리는 계절</span>
                <span className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0] text-sm">
                  {profile.seasonBestMatch}
                </span>
              </div>
              <div className="p-4 bg-white/50 dark:bg-black/10 rounded-lg text-center">
                <span className="text-xs text-muted-foreground block mb-1">어울리는 시간</span>
                <span className="font-serif font-medium text-[#5C544A] dark:text-[#D4C5B0] text-sm">
                  {profile.timeOfDay}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white/50 dark:bg-black/10 rounded-lg">
              <span className="text-xs text-muted-foreground block mb-2">어울리는 풍경</span>
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {profile.landscape}
              </span>
            </div>

            <div className="p-4 bg-[#8E7F73]/10 rounded-lg">
              <span className="text-xs text-muted-foreground block mb-2">당신의 에너지</span>
              <span className="text-sm font-medium text-[#8E7F73]">
                {profile.elementalPower}
              </span>
            </div>

            {/* 성장 스토리 */}
            <div className="p-5 bg-gradient-to-r from-[#F5F1E6] to-[#EDE8DC] dark:from-[#2C2824] dark:to-[#252119] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <span className="font-serif font-medium text-[#8E7F73] block mb-1">당신의 성장 서사</span>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {profile.growthStory}
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// ============================================
// 종합 키워드 카드
// ============================================

interface CoreKeywordsCardProps {
  ilgan: string;
  yongsin: string;
  geokguk: string | null;
  name?: string;
}

export function CoreKeywordsCard({ ilgan, yongsin, geokguk, name }: CoreKeywordsCardProps) {
  const keywords = extractCoreKeywords(ilgan, yongsin, geokguk);

  const keywordColors = [
    "bg-gradient-to-r from-[#8E7F73] to-[#A69383]",
    "bg-gradient-to-r from-[#BFA588] to-[#D4B896]",
    "bg-gradient-to-r from-[#6B8E7F] to-[#7DA28F]",
  ];

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-[#BFA588] via-[#8E7F73] to-[#BFA588]"></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 font-serif text-lg">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E6] dark:bg-[#2C2824]">
            <Target className="w-5 h-5 text-[#8E7F73]" />
          </span>
          <div>
            <span className="block text-xs text-muted-foreground font-sans font-normal tracking-wider uppercase">
              Core Keywords
            </span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">
              {name ? `${name}님의 핵심 키워드` : "나의 핵심 키워드"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 키워드 배지들 */}
        <div className="flex flex-wrap justify-center gap-3 py-4">
          {keywords.keywords.map((keyword, idx) => (
            <div
              key={keyword}
              className={`px-5 py-2.5 rounded-full text-white font-serif font-medium text-lg shadow-md ${keywordColors[idx] || keywordColors[0]}`}
            >
              {keyword}
            </div>
          ))}
        </div>

        {/* 요약 */}
        <div className="text-center p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {keywords.summary}
          </p>
        </div>

        {/* 키워드 출처 설명 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg text-center">
            <span className="text-muted-foreground block mb-1">일간 기반</span>
            <Badge variant="outline" className="bg-white dark:bg-black/20">
              {keywords.ilganKeyword}
            </Badge>
          </div>
          <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg text-center">
            <span className="text-muted-foreground block mb-1">용신 기반</span>
            <Badge variant="outline" className="bg-white dark:bg-black/20">
              {keywords.yongsinKeyword}
            </Badge>
          </div>
          {keywords.geokgukKeyword && (
            <div className="p-3 bg-stone-50 dark:bg-stone-900/50 rounded-lg text-center">
              <span className="text-muted-foreground block mb-1">격국 기반</span>
              <Badge variant="outline" className="bg-white dark:bg-black/20">
                {keywords.geokgukKeyword}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// 현재 인생 단계 카드
// ============================================

interface LifePhaseCardProps {
  birthYear: number;
  name?: string;
}

export function LifePhaseCard({ birthYear, name }: LifePhaseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1; // 한국식 나이
  const phase = getDaeunStoryPhase(currentAge);

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-[#6B8E7F] via-[#7DA28F] to-[#6B8E7F]"></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-3 font-serif text-lg">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E6] dark:bg-[#2C2824]">
            <Compass className="w-5 h-5 text-[#6B8E7F]" />
          </span>
          <div>
            <span className="block text-xs text-muted-foreground font-sans font-normal tracking-wider uppercase">
              Life Phase
            </span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">
              지금 이 순간, {name ? `${name}님은` : "당신은"}
            </span>
          </div>
          <span className="ml-auto text-3xl">{phase.emoji}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 현재 단계 */}
        <div className="text-center py-6 px-4 bg-gradient-to-br from-[#6B8E7F]/10 to-[#7DA28F]/10 rounded-2xl border border-[#6B8E7F]/20">
          <Badge className="mb-3 bg-[#6B8E7F] hover:bg-[#5A7D6E]">
            만 {currentAge - 1}세 (세는 나이 {currentAge}세)
          </Badge>
          <p className="font-serif text-2xl font-bold text-[#6B8E7F] mb-1">
            {phase.phaseName}
          </p>
          <p className="text-sm text-[#5C544A] dark:text-[#D4C5B0]">
            {phase.theme}
          </p>
        </div>

        {/* 단계 설명 */}
        <div className="p-4 bg-white/50 dark:bg-black/10 rounded-xl">
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {phase.description}
          </p>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-[#6B8E7F]/10"
            >
              <span className="font-serif text-[#6B8E7F]">이 시기의 과제와 기회</span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-[#6B8E7F]" /> : <ChevronDown className="w-4 h-4 text-[#6B8E7F]" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* 인생 과제 */}
            <div className="p-4 border border-stone-200 dark:border-stone-800 rounded-lg">
              <h4 className="font-serif font-medium mb-3 flex items-center gap-2 text-sm text-[#5C544A] dark:text-[#D4C5B0]">
                <Heart className="w-4 h-4 text-[#8E7F73]" />
                이 시기의 인생 과제
              </h4>
              <ul className="space-y-2">
                {phase.lifeTasks.map((task, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2 text-stone-600 dark:text-stone-400">
                    <span className="w-1.5 h-1.5 mt-2 bg-[#8E7F73] rounded-full flex-shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>

            {/* 기회 */}
            <div className="p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-200 dark:border-green-900 rounded-lg">
              <h4 className="font-serif font-medium mb-3 flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                <Star className="w-4 h-4" />
                펼쳐질 기회들
              </h4>
              <ul className="space-y-2">
                {phase.opportunities.map((opp, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2 text-green-600 dark:text-green-300">
                    <span className="w-1.5 h-1.5 mt-2 bg-green-500 rounded-full flex-shrink-0" />
                    {opp}
                  </li>
                ))}
              </ul>
            </div>

            {/* 도전 */}
            <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200 dark:border-orange-900 rounded-lg">
              <h4 className="font-serif font-medium mb-3 flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
                넘어야 할 도전
              </h4>
              <ul className="space-y-2">
                {phase.challenges.map((challenge, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2 text-orange-600 dark:text-orange-300">
                    <span className="w-1.5 h-1.5 mt-2 bg-orange-500 rounded-full flex-shrink-0" />
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>

            {/* 조언 */}
            <div className="p-5 bg-gradient-to-r from-[#F5F1E6] to-[#EDE8DC] dark:from-[#2C2824] dark:to-[#252119] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <span className="font-serif font-medium text-[#8E7F73] block mb-1">이 시기를 위한 조언</span>
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    {phase.advice}
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// ============================================
// 인생 여정 타임라인 (대운 스토리 통합)
// ============================================

// 오행별 색상
const OHENG_COLORS: Record<string, { bg: string; border: string; text: string; darkBg: string }> = {
  목: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", darkBg: "dark:bg-green-950/30" },
  화: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", darkBg: "dark:bg-red-950/30" },
  토: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", darkBg: "dark:bg-yellow-950/30" },
  금: { bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700", darkBg: "dark:bg-slate-950/30" },
  수: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", darkBg: "dark:bg-blue-950/30" },
};

// 길흉별 배지 스타일
const FORTUNE_BADGE_STYLES: Record<string, string> = {
  최길: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
  길: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
  평: "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800",
  흉: "bg-gradient-to-r from-orange-400 to-orange-500 text-white",
  최흉: "bg-gradient-to-r from-red-500 to-red-600 text-white",
};

interface LifeJourneyTimelineProps {
  majorFortunes: MajorFortuneInfo[];
  birthYear: number;
  ilgan?: string;
  yongsin?: string;
  name?: string;
}

export function LifeJourneyTimeline({ majorFortunes, birthYear, ilgan, yongsin, name }: LifeJourneyTimelineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1;

  // 대운에 상세 분석 정보 추가
  const enrichedFortunes: EnrichedDaeunInfo[] = majorFortunes.map((fortune) =>
    enrichDaeunInfo(fortune, ilgan || "갑", yongsin || "목", currentAge, birthYear)
  );

  // 현재 대운 찾기
  const currentFortune = enrichedFortunes.find(f => f.timeStatus === "current");

  // 시점별 해석 가져오기
  const getInterpretation = (fortune: EnrichedDaeunInfo) => {
    switch (fortune.timeStatus) {
      case "past":
        return fortune.sipseongInfo.pastInterpretation;
      case "current":
        return fortune.sipseongInfo.currentInterpretation;
      case "future":
        return fortune.sipseongInfo.futureInterpretation;
    }
  };

  // 시점별 라벨
  const getTimeLabel = (timeStatus: "past" | "current" | "future") => {
    switch (timeStatus) {
      case "past": return { text: "지나온 시기", color: "bg-slate-500" };
      case "current": return { text: "현재", color: "bg-green-600" };
      case "future": return { text: "다가올 시기", color: "bg-blue-500" };
    }
  };

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-[#8E7F73] via-[#BFA588] to-[#6B8E7F]"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-lg">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E6] dark:bg-[#2C2824]">
            <Sparkles className="w-5 h-5 text-[#8E7F73]" />
          </span>
          <div>
            <span className="block text-xs text-muted-foreground font-sans font-normal tracking-wider uppercase">
              Life Journey
            </span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">
              {name ? `${name}님의` : ""} 인생의 여정 이야기
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 현재 대운 요약 */}
        {currentFortune && (
          <div className={`p-4 rounded-xl border-2 ${OHENG_COLORS[currentFortune.element]?.border || "border-stone-300"} ${OHENG_COLORS[currentFortune.element]?.bg || "bg-stone-50"} ${OHENG_COLORS[currentFortune.element]?.darkBg || ""}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white text-xs">현재 대운</Badge>
                <span className="font-serif font-bold text-lg">{currentFortune.ganji}</span>
                <span className="text-lg">{currentFortune.ohengInfo.emoji}</span>
              </div>
              <Badge className={FORTUNE_BADGE_STYLES[currentFortune.fortuneLevel]}>
                {currentFortune.fortuneEmoji} {currentFortune.fortuneLevel}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {currentFortune.sipseongInfo.emoji} {currentFortune.sipseongInfo.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {currentFortune.startAge}~{currentFortune.endAge}세 ({currentFortune.startYear}~{currentFortune.endYear}년)
              </span>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {currentFortune.sipseongInfo.currentInterpretation}
            </p>
            <p className="text-xs text-muted-foreground mt-2 italic">
              {currentFortune.fortuneDescription}
            </p>
          </div>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-[#8E7F73]/10"
            >
              <span className="font-serif text-[#8E7F73]">전체 여정 펼쳐보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-[#8E7F73]" /> : <ChevronDown className="w-4 h-4 text-[#8E7F73]" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              {enrichedFortunes.map((fortune, idx) => {
                const timeLabel = getTimeLabel(fortune.timeStatus);
                const ohengColor = OHENG_COLORS[fortune.element] || OHENG_COLORS["토"];
                const isExpanded = expandedIndex === idx;
                const isCurrent = fortune.timeStatus === "current";

                return (
                  <div
                    key={idx}
                    className={`relative pl-8 pb-6 border-l-2 ${
                      isCurrent
                        ? "border-[#8E7F73]"
                        : fortune.timeStatus === "past"
                        ? "border-stone-300 dark:border-stone-600"
                        : "border-blue-300 dark:border-blue-700"
                    } last:border-transparent last:pb-0`}
                  >
                    {/* 타임라인 마커 */}
                    <div
                      className={`absolute left-[-9px] w-4 h-4 rounded-full ${
                        isCurrent
                          ? "bg-[#8E7F73] ring-4 ring-[#8E7F73]/20"
                          : fortune.timeStatus === "past"
                          ? "bg-stone-400 dark:bg-stone-500"
                          : "bg-blue-400 dark:bg-blue-500"
                      }`}
                    />

                    <div
                      className={`rounded-xl overflow-hidden border ${
                        isCurrent
                          ? `${ohengColor.border} ${ohengColor.bg} ${ohengColor.darkBg}`
                          : fortune.timeStatus === "past"
                          ? "border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 opacity-80"
                          : "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20"
                      }`}
                    >
                      {/* 헤더 영역 */}
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      >
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xl">{fortune.sipseongInfo.emoji}</span>
                          <span className="font-serif font-bold text-[#5C544A] dark:text-[#D4C5B0]">
                            {fortune.sipseongInfo.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {fortune.ganji} ({fortune.ohengInfo.emoji}{fortune.element})
                          </Badge>
                          <Badge
                            variant="outline"
                            className={isCurrent ? "bg-[#8E7F73] text-white border-none" : ""}
                          >
                            {fortune.startAge}~{fortune.endAge}세
                          </Badge>
                          <Badge className={`ml-auto text-xs ${FORTUNE_BADGE_STYLES[fortune.fortuneLevel]}`}>
                            {fortune.fortuneEmoji} {fortune.fortuneLevel}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${timeLabel.color} text-white`}>
                            {timeLabel.text}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {fortune.startYear}~{fortune.endYear}년
                          </span>
                        </div>

                        <p className="text-sm text-stone-700 dark:text-stone-300">
                          <span className="font-medium">{fortune.sipseongInfo.theme}</span> - {fortune.sipseongInfo.shortDesc}
                        </p>

                        <div className="flex items-center justify-center mt-2">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {/* 확장 영역 */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t border-stone-200 dark:border-stone-700 pt-3">
                          {/* 시점별 해석 */}
                          <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                              {getInterpretation(fortune)}
                            </p>
                          </div>

                          {/* 용신 관계 */}
                          <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">용신과의 관계</p>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                              {fortune.fortuneDescription}
                            </p>
                          </div>

                          {/* 오행 특성 */}
                          <div className="p-3 bg-white/60 dark:bg-black/20 rounded-lg">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              {fortune.ohengInfo.name}의 특성
                            </p>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                              {fortune.ohengInfo.interpretation}
                            </p>
                          </div>

                          {/* 기회와 도전 */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-green-50/80 dark:bg-green-950/20 rounded-lg">
                              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">🌟 기회</p>
                              <ul className="text-xs text-green-600 dark:text-green-300 space-y-1">
                                {fortune.sipseongInfo.opportunities.slice(0, 2).map((opp, i) => (
                                  <li key={i}>• {opp}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-3 bg-orange-50/80 dark:bg-orange-950/20 rounded-lg">
                              <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">⚡ 주의</p>
                              <ul className="text-xs text-orange-600 dark:text-orange-300 space-y-1">
                                {fortune.sipseongInfo.challenges.slice(0, 2).map((ch, i) => (
                                  <li key={i}>• {ch}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* 실천 조언 */}
                          <div className="p-3 bg-blue-50/80 dark:bg-blue-950/20 rounded-lg">
                            <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">💡 실천 조언</p>
                            <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                              {fortune.sipseongInfo.actionTips.map((tip, i) => (
                                <li key={i}>• {tip}</li>
                              ))}
                            </ul>
                          </div>

                          {/* 건강 주의 */}
                          <div className="p-3 bg-purple-50/80 dark:bg-purple-950/20 rounded-lg">
                            <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">🩺 건강 포인트</p>
                            <p className="text-xs text-purple-600 dark:text-purple-300">
                              {fortune.ohengInfo.healthFocus}
                            </p>
                          </div>
                        </div>
                      )}
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

// ============================================
// 오행 감성 메시지 카드
// ============================================

interface OhengEmotionalMessageProps {
  yongsin: string;
}

export function OhengEmotionalMessage({ yongsin }: OhengEmotionalMessageProps) {
  const message = OHENG_EMOTIONAL_MESSAGES[yongsin];

  if (!message) return null;

  return (
    <div className="text-center py-4 px-6 bg-gradient-to-r from-[#F9F7F2] via-[#F5F1E6] to-[#F9F7F2] dark:from-[#2C2824] dark:via-[#252119] dark:to-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
      <span className="text-3xl mb-2 block">{message.emoji}</span>
      <p className="text-sm font-serif text-[#5C544A] dark:text-[#D4C5B0] italic">
        "{message.message}"
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        — {yongsin} 기운을 품은 당신에게
      </p>
    </div>
  );
}
