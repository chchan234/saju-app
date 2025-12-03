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
import { ChevronDown, ChevronUp, Crown, Stethoscope, AlertCircle, CheckCircle } from "lucide-react";
import type { Pillar, OhengCount } from "@/types/saju";
import {
  determineGeokguk,
  GEOKGUK_INFO,
  analyzeHealthConstitution,
  OHENG_HEALTH_INFO,
} from "@/lib/saju-analysis-extended";
import { OHENG, type Oheng, isValidOheng } from "@/lib/saju-constants";

// 오행 색상 조합 생성 (text + bg + border)
const getOhengColorClass = (oheng: string) => {
  if (!isValidOheng(oheng)) return "text-gray-600 bg-gray-50 border-gray-200";
  const o = OHENG[oheng as Oheng];
  return `${o.text} ${o.bgSubtle} ${o.border}`;
};

// ============================================
// 격국(格局) 카드
// ============================================

interface GeokgukCardProps {
  monthPillar: Pillar;
  dayPillar: Pillar;
}

export function GeokgukCard({ monthPillar, dayPillar }: GeokgukCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { geokguk, confidence, explanation } = determineGeokguk(monthPillar, dayPillar);

  const geokgukInfo = geokguk ? GEOKGUK_INFO[geokguk] : null;

  const getConfidenceColor = () => {
    switch (confidence) {
      case "높음": return "bg-green-500";
      case "보통": return "bg-yellow-500";
      case "낮음": return "bg-gray-400";
    }
  };

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/30">
            <Crown className="w-5 h-5 text-purple-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">사주의 틀</span>
            <span className="text-purple-700 dark:text-purple-300">격국(格局) 분석</span>
          </div>
          {geokguk && (
            <Badge className={`${getConfidenceColor()} ml-auto`}>
              {confidence}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 격국 결과 */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <p className="font-serif font-bold text-xl text-purple-700 dark:text-purple-300">
                {geokguk || "복합 격국"}
              </p>
              <p className="text-sm text-muted-foreground">
                {geokgukInfo?.hanja || ""}
              </p>
            </div>
          </div>
        </div>

        {/* 설명 */}
        <p className="text-sm text-stone-700 dark:text-stone-300">{explanation}</p>

        {geokgukInfo && (
          <>
            <p className="text-sm text-muted-foreground">{geokgukInfo.description}</p>

            {/* 성격 */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-serif font-medium mb-2 text-sm text-purple-700 dark:text-purple-400">
                {geokguk} 성격
              </h4>
              <p className="text-sm text-stone-600 dark:text-stone-400">{geokgukInfo.personality}</p>
            </div>

            {/* 강점 */}
            <div className="flex flex-wrap gap-2">
              {geokgukInfo.strengths.map((s) => (
                <Badge key={s} variant="secondary" className="bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300">
                  {s}
                </Badge>
              ))}
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between hover:bg-purple-50 dark:hover:bg-purple-950/20">
                  <span className="font-serif">상세 분석 보기</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4">
                {/* 적합 직업 */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">💼 적합한 직업/분야</h4>
                  <div className="flex flex-wrap gap-1">
                    {geokgukInfo.suitableCareers.map((c) => (
                      <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </div>

                {/* 도전과제 */}
                <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 rounded-lg border border-orange-200/50 dark:border-orange-800/50">
                  <h4 className="font-medium text-sm mb-1 text-orange-700 dark:text-orange-400">⚠️ 주의할 점</h4>
                  <p className="text-sm text-orange-600 dark:text-orange-300">{geokgukInfo.challenges}</p>
                </div>

                {/* 조언 */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-medium text-sm mb-1 text-purple-700 dark:text-purple-400">💡 {geokguk}을 위한 조언</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300">{geokgukInfo.advice}</p>
                </div>

                {/* 유명인 */}
                {geokgukInfo.famous && (
                  <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      ✨ 이런 격국의 유명인: {geokgukInfo.famous}
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {!geokgukInfo && (
          <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-lg">
            <p className="text-sm text-muted-foreground">
              정격(正格)이 명확하지 않은 경우, 여러 기운이 복합적으로 작용합니다.
              이는 다양한 재능과 가능성을 의미할 수 있습니다.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// 건강 체질 카드
// ============================================

interface HealthConstitutionCardProps {
  ohengCount: OhengCount;
}

export function HealthConstitutionCard({ ohengCount }: HealthConstitutionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const analysis = analyzeHealthConstitution(ohengCount);

  return (
    <Card className="border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">오행 기반</span>
            <span className="text-emerald-700 dark:text-emerald-300">건강 체질 분석</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 오행 상태 요약 */}
        <div className="grid grid-cols-3 gap-2">
          {analysis.strongOheng.length > 0 && (
            <div className="p-3 border rounded-lg bg-orange-50/50 dark:bg-orange-950/10">
              <p className="text-xs text-muted-foreground mb-1">과다</p>
              <div className="flex flex-wrap gap-1">
                {analysis.strongOheng.map((o) => (
                  <Badge key={o} variant="outline" className="text-orange-600 border-orange-300">{o}</Badge>
                ))}
              </div>
            </div>
          )}
          {analysis.weakOheng.length > 0 && (
            <div className="p-3 border rounded-lg bg-yellow-50/50 dark:bg-yellow-950/10">
              <p className="text-xs text-muted-foreground mb-1">부족</p>
              <div className="flex flex-wrap gap-1">
                {analysis.weakOheng.map((o) => (
                  <Badge key={o} variant="outline" className="text-yellow-600 border-yellow-300">{o}</Badge>
                ))}
              </div>
            </div>
          )}
          {analysis.missingOheng.length > 0 && (
            <div className="p-3 border rounded-lg bg-red-50/50 dark:bg-red-950/10">
              <p className="text-xs text-muted-foreground mb-1">없음</p>
              <div className="flex flex-wrap gap-1">
                {analysis.missingOheng.map((o) => (
                  <Badge key={o} variant="outline" className="text-red-600 border-red-300">{o}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 종합 조언 */}
        <div className="p-4 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-xl border border-[#E8DCC4] dark:border-[#3E3832]">
          <p className="text-sm text-stone-700 dark:text-stone-300">{analysis.overallAdvice}</p>
        </div>

        {/* 취약 장기 */}
        {analysis.vulnerableOrgans.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-red-50/50 dark:bg-red-950/10 rounded-lg border border-red-200/50 dark:border-red-800/50">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              주의 장기: {analysis.vulnerableOrgans.join(", ")}
            </p>
          </div>
        )}

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
              <span className="font-serif">상세 건강 정보 보기</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            {/* 부족/없는 오행 상세 */}
            {analysis.primaryConcern && (
              <div className={`p-4 rounded-lg border ${getOhengColorClass(analysis.primaryConcern.oheng)}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{isValidOheng(analysis.primaryConcern.oheng) ? OHENG[analysis.primaryConcern.oheng as Oheng].emoji : "⚪"}</span>
                  <h4 className="font-serif font-medium">
                    {analysis.primaryConcern.oheng}({analysis.primaryConcern.hanja}) 보강 필요
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-1">관련 장기</p>
                    <p className="text-sm">{analysis.primaryConcern.organs.main.join(", ")}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1">부족 시 증상</p>
                    <ul className="text-sm space-y-0.5">
                      {analysis.primaryConcern.deficiencySymptoms.slice(0, 3).map((s) => (
                        <li key={s} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-current rounded-full" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 과다 오행 상세 */}
            {analysis.secondaryConcern && ohengCount[analysis.secondaryConcern.oheng as keyof OhengCount] >= 3 && (
              <div className={`p-4 rounded-lg border ${getOhengColorClass(analysis.secondaryConcern.oheng)}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{isValidOheng(analysis.secondaryConcern.oheng) ? OHENG[analysis.secondaryConcern.oheng as Oheng].emoji : "⚪"}</span>
                  <h4 className="font-serif font-medium">
                    {analysis.secondaryConcern.oheng}({analysis.secondaryConcern.hanja}) 과다 주의
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-1">과다 시 증상</p>
                    <ul className="text-sm space-y-0.5">
                      {analysis.secondaryConcern.excessSymptoms.slice(0, 3).map((s) => (
                        <li key={s} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-current rounded-full" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-1">관련 감정</p>
                    <p className="text-sm">{analysis.secondaryConcern.emotions}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 추천 사항 */}
            {analysis.recommendations.foods.length > 0 && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-medium text-sm mb-3 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  건강 추천 사항
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-medium mb-1 text-emerald-600">추천 음식</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.recommendations.foods.map((f) => (
                        <Badge key={f} variant="outline" className="text-xs border-emerald-300">{f}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1 text-emerald-600">추천 활동</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.recommendations.activities.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs border-emerald-300">{a}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1 text-red-500">피해야 할 것</p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.recommendations.avoids.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs border-red-300 text-red-600">{a}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 계절/맛 정보 */}
            {analysis.primaryConcern && (
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  💡 {analysis.primaryConcern.oheng} 기운 보강 TIP: {analysis.primaryConcern.season}에 더 신경쓰고, {analysis.primaryConcern.taste}을 적절히 섭취하세요.
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
