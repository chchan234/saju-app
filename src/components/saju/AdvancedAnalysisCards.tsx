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
import {
  ChevronDown,
  ChevronUp,
  Sun,
  Sparkles,
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Pillar, OhengCount } from "@/types/saju";
import {
  analyzeJohu,
  detectSinsals,
  analyzeRelationshipPattern,
  analyzeCareerAptitude,
  type JohuAnalysis,
  type DetectedSinsal,
  type RelationshipPattern,
  type CareerAptitude,
} from "@/lib/saju-advanced-analysis";
import { OHENG, type Oheng, isValidOheng } from "@/lib/saju-constants";

// 오행 이모지 헬퍼 함수
const getOhengEmoji = (oheng: string) =>
  isValidOheng(oheng) ? OHENG[oheng as Oheng].emoji : "⚪";

// ============================================
// 조후(調候) 카드 - 계절 오행 분석
// ============================================

interface JohuCardProps {
  monthJiji: string;
  ohengCount: OhengCount;
  yongsin: string;
}

export function JohuCard({ monthJiji, ohengCount, yongsin }: JohuCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const analysis = analyzeJohu(monthJiji, ohengCount, yongsin);

  const SEASON_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    봄: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    여름: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    가을: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    겨울: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  };

  const getSeasonKey = (season: string): string => {
    if (season.includes("봄")) return "봄";
    if (season.includes("여름")) return "여름";
    if (season.includes("가을")) return "가을";
    if (season.includes("겨울")) return "겨울";
    return "봄";
  };

  const SEASON_EMOJI: Record<string, string> = {
    봄: "🌸",
    여름: "☀️",
    가을: "🍂",
    겨울: "❄️",
  };

  const seasonKey = getSeasonKey(analysis.birthSeason);
  const colors = SEASON_COLORS[seasonKey] || SEASON_COLORS.봄;

  const getBalanceColor = () => {
    switch (analysis.balance) {
      case "균형": return "bg-green-500";
      case "과다": return "bg-orange-500";
      case "부족": return "bg-yellow-500";
    }
  };

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/30">
            <Sun className="w-5 h-5 text-orange-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">계절 조절</span>
            <span className="text-orange-700 dark:text-orange-300">조후(調候) 분석</span>
          </div>
          <Badge className={`${getBalanceColor()} ml-auto`}>
            {analysis.balance}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 태어난 계절 */}
        <div className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{SEASON_EMOJI[seasonKey]}</span>
            <div>
              <p className={`font-serif font-bold text-xl ${colors.text}`}>
                {analysis.birthSeason} 출생
              </p>
              <p className="text-sm text-muted-foreground">
                {analysis.seasonDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 조후 설명 */}
        <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
          <div className="flex items-start gap-2">
            <span className="text-xl">{getOhengEmoji(analysis.neededElement)}</span>
            <div>
              <p className="font-medium text-sm text-stone-700 dark:text-stone-300 mb-1">
                필요한 기운: {analysis.neededElement}(
                {isValidOheng(analysis.neededElement) ? OHENG[analysis.neededElement as Oheng].hanja : ""})
              </p>
              <p className="text-sm text-muted-foreground">{analysis.neededReason}</p>
            </div>
          </div>
        </div>

        {/* 종합 조언 */}
        <p className="text-sm text-stone-700 dark:text-stone-300">{analysis.advice}</p>

        {/* 용신과 조후 비교 설명 */}
        {yongsin !== analysis.neededElement && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ℹ️ <strong>용신({yongsin})과 조후({analysis.neededElement})가 다릅니다.</strong>
              <br />
              <span className="text-muted-foreground">
                용신은 사주 전체의 오행 균형을 맞추는 기운이고, 조후는 태어난 계절을 조절하는 기운입니다.
                두 기운이 다를 경우, 상황에 따라 적절히 활용하면 됩니다.
              </span>
            </p>
          </div>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-orange-50 dark:hover:bg-orange-950/20">
              <span className="font-serif">보완 활동 보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* 추천 활동 */}
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-sm mb-3 text-orange-700 dark:text-orange-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {analysis.neededElement} 기운 보충 활동
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.recommendedActivities.map((activity) => (
                  <Badge key={activity} variant="outline" className="border-orange-300 text-orange-700">
                    {activity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 조후 원리 설명 */}
            <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 조후(調候)란 계절의 기운을 조절하는 것입니다.
                {seasonKey}에 태어난 분은 {analysis.seasonElement} 기운이 강하므로,
                {analysis.neededElement} 기운으로 균형을 맞추면 운의 흐름이 좋아집니다.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// ============================================
// 신살(神殺) 카드
// ============================================

interface SinsalCardProps {
  pillars: Pillar[];
  dayCheongan: string;
  dayJiji: string;
}

export function SinsalCard({ pillars, dayCheongan, dayJiji }: SinsalCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const detectedSinsals = detectSinsals(pillars, dayCheongan, dayJiji);

  const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    길신: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    흉신: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    중성: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  };

  const gilCount = detectedSinsals.filter((s) => s.info.type === "길신").length;
  const hyungCount = detectedSinsals.filter((s) => s.info.type === "흉신").length;

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/30">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">특별한 기운</span>
            <span className="text-violet-700 dark:text-violet-300">신살(神殺) 분석</span>
          </div>
          <div className="flex gap-1 ml-auto">
            {gilCount > 0 && <Badge className="bg-blue-500">{gilCount} 길신</Badge>}
            {hyungCount > 0 && <Badge className="bg-red-500">{hyungCount} 흉신</Badge>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {detectedSinsals.length === 0 ? (
          <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <p className="text-sm text-muted-foreground text-center">
              특별한 신살이 발견되지 않았습니다.
              <br />
              균형 잡힌 사주로 볼 수 있습니다.
            </p>
          </div>
        ) : (
          <>
            {/* 신살 목록 (간략) */}
            <div className="grid grid-cols-2 gap-2">
              {detectedSinsals.map((sinsal) => {
                const colors = TYPE_COLORS[sinsal.info.type];
                return (
                  <div
                    key={sinsal.name}
                    className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sinsal.info.emoji}</span>
                      <div>
                        <p className={`font-serif font-bold ${colors.text}`}>
                          {sinsal.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sinsal.foundIn}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 요약 */}
            <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
              <p className="text-sm text-stone-700 dark:text-stone-300">
                {detectedSinsals.length}개의 신살이 발견되었습니다.
                {gilCount > hyungCount && " 길신이 많아 전반적으로 좋은 운의 흐름을 가지고 있습니다."}
                {hyungCount > gilCount && " 흉신이 있지만 이를 잘 활용하면 오히려 강점이 될 수 있습니다."}
                {gilCount === hyungCount && " 길신과 흉신이 균형을 이루고 있습니다."}
              </p>
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between hover:bg-violet-50 dark:hover:bg-violet-950/20">
                  <span className="font-serif">상세 해석 보기</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {detectedSinsals.map((sinsal) => {
                  const colors = TYPE_COLORS[sinsal.info.type];
                  return (
                    <div
                      key={sinsal.name}
                      className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{sinsal.info.emoji}</span>
                        <div>
                          <p className={`font-serif font-bold ${colors.text}`}>
                            {sinsal.name} ({sinsal.info.hanja})
                          </p>
                          <Badge variant="outline" className={`text-xs ${colors.border} ${colors.text}`}>
                            {sinsal.info.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-stone-600 dark:text-stone-400">
                          {sinsal.info.description}
                        </p>
                        <p className="text-sm">{sinsal.info.meaning}</p>

                        <div className="pt-2 border-t border-current/10">
                          <p className="text-xs font-medium mb-1">실생활에서</p>
                          <p className="text-sm text-muted-foreground">{sinsal.info.inLife}</p>
                        </div>

                        <div className={`p-2 rounded ${sinsal.info.type === "흉신" ? "bg-red-100/50" : "bg-blue-100/50"}`}>
                          <p className="text-xs">
                            💡 <strong>조언:</strong> {sinsal.info.advice}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    ⚠️ 신살은 참고 사항입니다. 흉신도 직업이나 상황에 따라 오히려 유리하게 작용할 수 있으며,
                    길신이 있다고 해서 노력 없이 좋은 일이 생기는 것은 아닙니다.
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// 인간관계 패턴 카드
// ============================================

interface RelationshipPatternCardProps {
  sipsinDistribution: Record<string, number>;
}

export function RelationshipPatternCard({ sipsinDistribution }: RelationshipPatternCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pattern = analyzeRelationshipPattern(sipsinDistribution);

  if (!pattern) {
    return (
      <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-serif text-xl">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950/30">
              <Users className="w-5 h-5 text-pink-600" />
            </span>
            <div>
              <span className="block text-sm text-muted-foreground font-sans font-normal">십신 기반</span>
              <span className="text-pink-700 dark:text-pink-300">인간관계 패턴</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            십신 분포를 분석할 수 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950/30">
            <Users className="w-5 h-5 text-pink-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">십신 기반</span>
            <span className="text-pink-700 dark:text-pink-300">인간관계 패턴</span>
          </div>
          <Badge className="bg-pink-500 ml-auto">{pattern.type}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 패턴 타입 */}
        <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border border-pink-200 dark:border-pink-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👥</span>
            <div>
              <p className="font-serif font-bold text-xl text-pink-700 dark:text-pink-300">
                {pattern.type}
              </p>
              <p className="text-sm text-muted-foreground">
                인간관계 스타일
              </p>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <p className="text-sm text-stone-700 dark:text-stone-300">{pattern.description}</p>

        {/* 강점 */}
        <div className="flex flex-wrap gap-2">
          {pattern.strengths.map((s) => (
            <Badge key={s} variant="secondary" className="bg-pink-100 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300">
              ✓ {s}
            </Badge>
          ))}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-pink-50 dark:hover:bg-pink-950/20">
              <span className="font-serif">관계 상세 분석</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* 주의점 */}
            <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
              <h4 className="font-medium text-sm mb-2 text-orange-700 dark:text-orange-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                관계에서 주의할 점
              </h4>
              <div className="flex flex-wrap gap-1">
                {pattern.weaknesses.map((w) => (
                  <Badge key={w} variant="outline" className="text-xs border-orange-300 text-orange-600">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 궁합 타입 */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">💕 잘 맞는 관계 유형</h4>
              <div className="flex flex-wrap gap-2">
                {pattern.compatibleTypes.map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
            </div>

            {/* 조언 */}
            <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <h4 className="font-medium text-sm mb-1 text-pink-700 dark:text-pink-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                관계 조언
              </h4>
              <p className="text-sm text-pink-600 dark:text-pink-300">{pattern.advice}</p>
            </div>

            {/* 설명 */}
            <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 인간관계 패턴은 사주의 십신 분포에 따라 결정됩니다.
                이는 타고난 성향을 나타내며, 후천적 노력으로 단점을 보완하고
                강점을 더욱 발전시킬 수 있습니다.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}

// ============================================
// 직업 적성 심화 카드
// ============================================

interface CareerAptitudeCardProps {
  sipsinDistribution: Record<string, number>;
}

export function CareerAptitudeCard({ sipsinDistribution }: CareerAptitudeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const aptitude = analyzeCareerAptitude(sipsinDistribution);

  if (!aptitude) {
    return (
      <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-serif text-xl">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/30">
              <Briefcase className="w-5 h-5 text-cyan-600" />
            </span>
            <div>
              <span className="block text-sm text-muted-foreground font-sans font-normal">십신 조합</span>
              <span className="text-cyan-700 dark:text-cyan-300">직업 적성 심화</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            십신 분포를 분석할 수 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/30">
            <Briefcase className="w-5 h-5 text-cyan-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">십신 조합</span>
            <span className="text-cyan-700 dark:text-cyan-300">직업 적성 심화</span>
          </div>
          <Badge className="bg-cyan-500 ml-auto">{aptitude.category}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 적성 유형 */}
        <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💼</span>
            <div>
              <p className="font-serif font-bold text-xl text-cyan-700 dark:text-cyan-300">
                {aptitude.category}
              </p>
              <p className="text-sm text-muted-foreground">
                직업 적성 유형
              </p>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <p className="text-sm text-stone-700 dark:text-stone-300">{aptitude.description}</p>

        {/* 추천 직업 (간략) */}
        <div className="flex flex-wrap gap-2">
          {aptitude.suitableCareers.slice(0, 4).map((career) => (
            <Badge key={career} variant="secondary" className="bg-cyan-100 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300">
              {career}
            </Badge>
          ))}
          {aptitude.suitableCareers.length > 4 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{aptitude.suitableCareers.length - 4}
            </Badge>
          )}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-cyan-50 dark:hover:bg-cyan-950/20">
              <span className="font-serif">상세 직업 분석</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* 모든 추천 직업 */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">💼 추천 직업/분야</h4>
              <div className="flex flex-wrap gap-1">
                {aptitude.suitableCareers.map((career) => (
                  <Badge key={career} variant="outline" className="text-xs">{career}</Badge>
                ))}
              </div>
            </div>

            {/* 업무 스타일 */}
            <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
              <h4 className="font-medium text-sm mb-1">🎯 업무 스타일</h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">{aptitude.workStyle}</p>
            </div>

            {/* 성공 팁 */}
            <div className="p-4 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <h4 className="font-medium text-sm mb-1 text-cyan-700 dark:text-cyan-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                성공 TIP
              </h4>
              <p className="text-sm text-cyan-600 dark:text-cyan-300">{aptitude.successTip}</p>
            </div>

            {/* 설명 */}
            <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
              <p className="text-xs text-muted-foreground">
                💡 직업 적성은 사주의 십신 조합을 기반으로 합니다.
                가장 강한 두 가지 십신 카테고리의 조합이 직업 성향을 결정합니다.
                이는 타고난 적성이며, 관심사와 노력에 따라 다양한 분야에서 성공할 수 있습니다.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
