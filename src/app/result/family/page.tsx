"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { SajuApiResult } from "@/types/saju";
import type {
  FamilyAnalysisResult,
  PairCompatibility,
  OhengDetailAnalysis,
  ComplementaryRelation,
  FamilyRole,
  RelationTypeAnalysis,
} from "@/lib/saju-family";
import { RELATION_LABELS, analyzeIlganRelationship, type IlganRelationship } from "@/lib/saju-family";
import type { MajorFortuneInfo } from "@/lib/saju-calculator";
import { DAEUN_OHENG_INTERPRETATION } from "@/lib/saju-fortune-data";
import { ChevronDown, ChevronUp, Users, Sparkles, ArrowRight, Star, Heart } from "lucide-react";
import {
  ILJU_SYMBOLS,
  OHENG_BOOSTERS,
  generateGroupStoryIntro,
} from "@/lib/saju-analysis-data";
import {
  PillarCard,
  MysticalIntroCard,
  OhengChart,
  OHENG_COLORS,
  OHENG_TEXT_COLORS,
  OHENG_ICONS,
  BokbiModal,
} from "@/components/saju/SajuUI";
import { getScoreColorClass } from "@/lib/utils";

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1E6] dark:bg-[#1c1917]">
      <Card className="w-full max-w-md mx-4 bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E7F73]" />
            <p className="text-stone-600 dark:text-stone-400 font-serif">가족의 기운을 읽고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const OHENG_BG_LIGHT: Record<string, string> = {
  목: "bg-green-50/50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
  화: "bg-red-50/50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  토: "bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
  금: "bg-stone-50/50 border-stone-200 dark:bg-stone-800/50 dark:border-stone-700",
  수: "bg-blue-50/50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
};

// 점수에 따른 배지 색상
function getScoreBadgeVariant(score: number): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 75) return "default";
  if (score >= 55) return "secondary";
  return "destructive";
}

// 가족 구성원 요약 카드
function FamilyMemberCard({
  saju,
  name,
  gender,
  relation,
  timeUnknown,
}: {
  saju: SajuApiResult;
  name: string;
  gender: "male" | "female";
  relation: string;
  timeUnknown: boolean;
}) {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount, meta } = saju;
  const relationLabel = RELATION_LABELS[relation] || relation;

  return (
    <Card className="flex-1 min-w-[200px] bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
      <CardHeader className="pb-2 border-b border-stone-100 dark:border-stone-800">
        <CardTitle className="text-base flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <span>{gender === "male" ? "👨" : "👩"}</span>
          <Badge variant="outline" className="bg-white dark:bg-black/20">{relationLabel}</Badge>
          <span className="text-sm font-medium">{name || "이름 없음"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {/* 사주 기둥 */}
        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
          <PillarCard pillar={yearPillar} label="년" size="small" />
          <PillarCard pillar={monthPillar} label="월" size="small" />
          <PillarCard pillar={dayPillar} label="일" size="small" />
          {!timeUnknown && <PillarCard pillar={timePillar} label="시" size="small" />}
        </div>

        {/* 시간 미상 안내 */}
        {timeUnknown && (
          <p className="text-center text-[10px] text-orange-600/80 dark:text-orange-400/80 bg-orange-50/50 dark:bg-orange-950/20 py-1 rounded">
            ※ 시간 미상
          </p>
        )}

        {/* 일간 정보 */}
        <div className="text-center text-xs bg-stone-50 dark:bg-stone-900 rounded p-2">
          <span className="text-muted-foreground">일간: </span>
          <span className={`font-medium ${OHENG_TEXT_COLORS[dayPillar.cheonganOheng]}`}>{dayPillar.cheongan}({dayPillar.cheonganOheng})</span>
          <span className="text-muted-foreground ml-2">띠: </span>
          <span className="font-medium">{meta.ddi}띠</span>
        </div>

        {/* 오행 분포 */}
        <div className="flex justify-center gap-1">
          {Object.entries(ohengCount).map(([oheng, count]) => (
            <div key={oheng} className="text-center">
              <div className={`w-5 h-5 rounded-full text-white text-xs flex items-center justify-center ${OHENG_COLORS[oheng]}`}>
                {oheng}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">{count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 구성원 간 궁합 상세 카드 (커플 궁합 수준으로 상세화)
function PairCompatibilityDetailCard({ pair, isOpen, onToggle }: { pair: PairCompatibility; isOpen: boolean; onToggle: () => void }) {
  const { member1Name, member2Name, member1Relation, member2Relation, compatibility } = pair;
  const { totalScore, grade, gradeDescription, ilganAnalysis, jijiAnalysis, summary } = compatibility;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="bg-white/50 dark:bg-stone-900/50 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-800">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
                {RELATION_LABELS[member1Relation] || member1Relation}
              </Badge>
              <span className="font-medium font-serif">{member1Name || "구성원"}</span>
              <span className="text-muted-foreground">↔</span>
              <span className="font-medium font-serif">{member2Name || "구성원"}</span>
              <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
                {RELATION_LABELS[member2Relation] || member2Relation}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getScoreBadgeVariant(totalScore)} className="text-sm">
              {totalScore}점
            </Badge>
            <Badge variant="secondary" className="bg-stone-100 dark:bg-stone-800">{grade}</Badge>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-stone-100 dark:border-stone-800 pt-4">
            {/* 등급 설명 */}
            <p className="text-sm text-muted-foreground">{gradeDescription}</p>

            {/* 일간 관계 - 상세 */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold flex items-center gap-2 text-sm font-serif text-[#8E7F73]">
                일간(日干) 관계
                <Badge variant="outline" className="bg-white dark:bg-black/20">{ilganAnalysis.type}</Badge>
              </h5>
              <p className="text-xs text-muted-foreground">
                일간은 사주에서 나 자신을 나타내며, 두 사람의 일간 관계로 기본적인 궁합을 파악합니다.
              </p>
              <div className="text-center py-2">
                <span className="font-medium text-lg font-serif">{ilganAnalysis.person1Ilgan}</span>
                <span className="mx-3 text-muted-foreground">↔</span>
                <span className="font-medium text-lg font-serif">{ilganAnalysis.person2Ilgan}</span>
              </div>
              <div className="bg-white/50 dark:bg-black/20 rounded p-3">
                <p className="text-sm">{ilganAnalysis.typeDescription}</p>
              </div>
            </div>

            {/* 지지 관계 - 상세 */}
            {(jijiAnalysis.yukap.length > 0 || jijiAnalysis.chung.length > 0 ||
              jijiAnalysis.hyung.length > 0 || jijiAnalysis.hae.length > 0) && (
                <div className="space-y-3">
                  <h5 className="font-semibold text-sm font-serif text-[#5C544A] dark:text-[#D4C5B0]">지지(地支) 관계</h5>

                  {/* 육합 - 좋은 관계 */}
                  {jijiAnalysis.yukap.map((item, i) => (
                    <div key={`yukap-${i}`} className="bg-green-50/50 border border-green-200 dark:border-green-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-600 text-white hover:bg-green-600 border-none">
                          {item.pair} {item.name}
                        </Badge>
                        <span className="text-green-700 dark:text-green-400 text-xs font-medium">조화로운 관계</span>
                      </div>
                      <p className="text-xs text-green-800 dark:text-green-300">{item.description}</p>
                    </div>
                  ))}

                  {/* 충 - 충돌 관계 */}
                  {jijiAnalysis.chung.map((item, i) => (
                    <div key={`chung-${i}`} className="bg-red-50/50 border border-red-200 dark:border-red-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-600 text-white hover:bg-red-600 border-none">
                          {item.pair} {item.name}
                        </Badge>
                        <span className="text-red-700 dark:text-red-400 text-xs font-medium">충돌 관계</span>
                      </div>
                      <p className="text-xs text-red-800 dark:text-red-300">{item.description}</p>
                    </div>
                  ))}

                  {/* 형/해 등 기타 관계 */}
                  {jijiAnalysis.hyung.map((item, i) => (
                    <div key={`hyung-${i}`} className="bg-orange-50/50 border border-orange-200 dark:border-orange-900/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-orange-500 text-white hover:bg-orange-500 border-none">
                          {item.pair} {item.name}
                        </Badge>
                        <span className="text-orange-700 dark:text-orange-400 text-xs font-medium">마찰 관계</span>
                      </div>
                      <p className="text-xs text-orange-800 dark:text-orange-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

            {/* 강점/약점 */}
            <div className="grid grid-cols-2 gap-3">
              {summary.strengths.length > 0 && (
                <div className="space-y-2 p-3 bg-green-50/30 rounded border border-green-100 dark:border-green-900/30">
                  <h5 className="font-semibold text-sm text-green-700 dark:text-green-400 font-serif">강점</h5>
                  <ul className="space-y-1">
                    {summary.strengths.map((item, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 text-stone-700 dark:text-stone-300">
                        <span className="text-green-600 mt-0.5">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.weaknesses.length > 0 && (
                <div className="space-y-2 p-3 bg-red-50/30 rounded border border-red-100 dark:border-red-900/30">
                  <h5 className="font-semibold text-sm text-red-700 dark:text-red-400 font-serif">주의점</h5>
                  <ul className="space-y-1">
                    {summary.weaknesses.map((item, i) => (
                      <li key={i} className="text-xs flex items-start gap-2 text-stone-700 dark:text-stone-300">
                        <span className="text-red-600 mt-0.5">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 조언 */}
            <div className="bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg p-3 border border-[#E8DCC4] dark:border-[#3E3832]">
              <h5 className="font-semibold text-sm mb-1 font-serif text-[#8E7F73]">관계 조언</h5>
              <p className="text-xs text-stone-700 dark:text-stone-300">{summary.advice}</p>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// 오행 상세 분석 카드
function OhengDetailCard({ analysis }: { analysis: OhengDetailAnalysis }) {
  const statusColors = {
    "과잉": "bg-orange-100 text-orange-800 border-orange-300",
    "적정": "bg-green-100 text-green-800 border-green-300",
    "부족": "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className={`rounded-lg p-4 border ${OHENG_BG_LIGHT[analysis.element]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${OHENG_COLORS[analysis.element]}`}>
            {analysis.element}
          </div>
          <span className="font-medium">{analysis.percentage}%</span>
          <span className="text-sm text-muted-foreground">({analysis.count}개)</span>
        </div>
        <Badge className={statusColors[analysis.status]}>
          {analysis.status}
        </Badge>
      </div>
      <p className="text-sm mb-2 text-stone-700 dark:text-stone-300">{analysis.meaning}</p>
      <p className="text-xs text-muted-foreground mb-2">{analysis.advice}</p>
      {analysis.compensators.length > 0 && (
        <div className="text-xs">
          <span className="text-muted-foreground">이 기운이 강한 구성원: </span>
          <span className="font-medium">{analysis.compensators.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

// 상호 보완 관계 카드
function ComplementaryRelationCard({ relation }: { relation: ComplementaryRelation }) {
  return (
    <div className={`rounded-lg p-4 border ${OHENG_BG_LIGHT[relation.giverElement]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
          {RELATION_LABELS[relation.giverRelation] || relation.giverRelation}
        </Badge>
        <span className="font-medium font-serif">{relation.giverName}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium font-serif">{relation.receiverName}</span>
        <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
          {RELATION_LABELS[relation.receiverRelation] || relation.receiverRelation}
        </Badge>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${OHENG_COLORS[relation.giverElement]}`}>
          {relation.giverElement}
        </div>
        <span className={`text-sm font-medium ${OHENG_TEXT_COLORS[relation.giverElement]}`}>
          {relation.giverElement} 기운 보완
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{relation.description}</p>
    </div>
  );
}

// 가족 역할 카드
function FamilyRoleCard({ role }: { role: FamilyRole }) {
  return (
    <div className={`rounded-lg p-4 border ${OHENG_BG_LIGHT[role.element]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
            {RELATION_LABELS[role.memberRelation] || role.memberRelation}
          </Badge>
          <span className="font-medium font-serif">{role.memberName}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${OHENG_COLORS[role.element]}`}>
            {role.element}
          </div>
          <Badge className={`${OHENG_COLORS[role.element]} text-white border-none`}>
            {role.role}
          </Badge>
        </div>
      </div>
      <p className="text-sm mb-2 text-stone-700 dark:text-stone-300">{role.roleDescription}</p>
      <div className="flex flex-wrap gap-1">
        {role.strengths.map((strength, i) => (
          <Badge key={i} variant="secondary" className="text-xs bg-white/50 dark:bg-black/20">
            {strength}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// 가족 스토리 인트로 카드
function FamilyStoryIntroCard({
  memberCount,
  familyScore,
}: {
  memberCount: number;
  familyScore: number;
}) {
  const storyIntro = generateGroupStoryIntro(memberCount, familyScore, true);

  return (
    <MysticalIntroCard
      variant="family"
      title={
        <>
          우리 가족 {memberCount}명의 <br />
          <span className="text-amber-400">"화합과 조화"</span>
        </>
      }
      content={storyIntro}
      footer={<>가족의 행복을 위한 심층 분석</>}
    />
  );
}

// 가족 일주 상징 카드
function FamilyIljuSymbolsCard({ members }: { members: MemberData[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // 각 멤버의 일주 정보 계산
  const membersWithIlju = members.map((member) => {
    const ilju = `${member.saju.dayPillar.cheongan}${member.saju.dayPillar.jiji}`;
    const iljuSymbol = ILJU_SYMBOLS[ilju];
    return {
      ...member,
      ilju,
      iljuSymbol,
    };
  });

  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full">
            <CardTitle className="text-lg flex items-center justify-between font-serif text-[#5C544A] dark:text-[#D4C5B0]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                가족 일주(日柱) 상징
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            일주는 태어난 날의 천간과 지지로 구성되며, 그 사람의 본질적인 성격과 에너지를 나타냅니다.
          </p>

          {/* 간단 요약 - 항상 표시 */}
          <div className="grid gap-3 sm:grid-cols-2">
            {membersWithIlju.map((member, index) => (
              <div
                key={index}
                className="bg-stone-50 dark:bg-stone-900 rounded-lg p-3 border border-stone-100 dark:border-stone-800"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
                    {RELATION_LABELS[member.relation] || member.relation}
                  </Badge>
                  <span className="font-medium text-sm font-serif">{member.name || "구성원"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-white text-sm ${OHENG_COLORS[member.saju.dayPillar.cheonganOheng]}`}>
                      {member.saju.dayPillar.cheongan}
                    </span>
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-white text-sm ${OHENG_COLORS[member.saju.dayPillar.jijiOheng]}`}>
                      {member.saju.dayPillar.jiji}
                    </span>
                  </div>
                  {member.iljuSymbol && (
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      {member.iljuSymbol.nickname}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 상세 설명 - 펼쳤을 때만 */}
          <CollapsibleContent className="space-y-4">
            {membersWithIlju.map((member, index) => (
              member.iljuSymbol && (
                <div
                  key={index}
                  className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
                      {RELATION_LABELS[member.relation] || member.relation}
                    </Badge>
                    <span className="font-semibold font-serif">{member.name || "구성원"}</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">- {member.iljuSymbol.nickname}</span>
                  </div>
                  <p className="text-sm mb-3 text-muted-foreground">
                    {member.iljuSymbol.essence}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/50 dark:bg-black/20 rounded p-2">
                      <span className="text-green-600 dark:text-green-400 font-medium">성격: </span>
                      <span className="text-stone-700 dark:text-stone-300">{member.iljuSymbol.personality}</span>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 rounded p-2">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">인생 주제: </span>
                      <span className="text-stone-700 dark:text-stone-300">{member.iljuSymbol.lifeTheme}</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}

// 가족 오행 보완 조언 카드
function FamilyOhengAdviceCard({ members }: { members: MemberData[] }) {
  const [isOpen, setIsOpen] = useState(false);

  // 가족 전체 오행 합산
  const familyOhengCount: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  members.forEach((member) => {
    Object.entries(member.saju.ohengCount).forEach(([oheng, count]) => {
      familyOhengCount[oheng] += count;
    });
  });

  // 부족한 오행 찾기
  const total = Object.values(familyOhengCount).reduce((a, b) => a + b, 0);
  const weakOhengs = Object.entries(familyOhengCount)
    .filter(([, count]) => count / total < 0.15)
    .map(([oheng]) => oheng);

  // 공통 보완 활동 추천
  const commonActivities: string[] = [];
  const commonFoods: string[] = [];
  weakOhengs.forEach((oheng) => {
    const booster = OHENG_BOOSTERS[oheng];
    if (booster) {
      if (booster.activities) commonActivities.push(...booster.activities.slice(0, 2));
      if (booster.foods) commonFoods.push(...booster.foods.slice(0, 2));
    }
  });

  // 오행이 균형 잡혀 있는 경우 긍정적인 메시지 표시
  if (weakOhengs.length === 0) {
    return (
      <Card className="border-stone-200 dark:border-stone-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
            <Heart className="h-5 w-5 text-green-500" />
            가족 오행 균형
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✨ 가족 전체의 오행이 균형 있게 분포되어 있습니다!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              특별히 보완이 필요한 오행이 없어 가족 간의 조화가 잘 이루어질 수 있습니다.
              현재의 좋은 기운을 유지하며 함께 시간을 보내세요.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full">
            <CardTitle className="text-lg flex items-center justify-between font-serif text-[#5C544A] dark:text-[#D4C5B0]">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                가족 오행 보완 활동
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardTitle>
          </CollapsibleTrigger>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            가족 전체적으로 부족한 오행을 보완하기 위한 활동과 음식을 추천합니다.
          </p>

          <div className="flex flex-wrap gap-2">
            {weakOhengs.map((oheng) => (
              <Badge key={oheng} className={`${OHENG_COLORS[oheng]} text-white border-none`}>
                {oheng} 기운 보충 필요
              </Badge>
            ))}
          </div>

          <CollapsibleContent className="space-y-4">
            {/* 함께 할 수 있는 활동 */}
            {commonActivities.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
                <h5 className="font-semibold text-sm text-green-800 dark:text-green-300 mb-2 font-serif">
                  🏃 함께 할 수 있는 활동
                </h5>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(commonActivities)].slice(0, 6).map((activity, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-white dark:bg-black/20">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 함께 먹으면 좋은 음식 */}
            {commonFoods.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
                <h5 className="font-semibold text-sm text-orange-800 dark:text-orange-300 mb-2 font-serif">
                  🍽️ 함께 먹으면 좋은 음식
                </h5>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(commonFoods)].slice(0, 6).map((food, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-white dark:bg-black/20">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 각 오행별 상세 */}
            {weakOhengs.map((oheng) => {
              const booster = OHENG_BOOSTERS[oheng];
              if (!booster) return null;
              return (
                <div
                  key={oheng}
                  className={`rounded-lg p-4 border ${OHENG_BG_LIGHT[oheng]}`}
                >
                  <h5 className={`font-semibold text-sm mb-2 ${OHENG_TEXT_COLORS[oheng]} font-serif`}>
                    {oheng}({booster.hanja}) 기운 보완
                  </h5>
                  <p className="text-xs text-muted-foreground mb-2">
                    {booster.season}의 기운, {booster.direction} 방향의 에너지
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 dark:text-stone-300">
                    <div>
                      <span className="font-medium">공간: </span>
                      {booster.spaces?.slice(0, 2).join(", ")}
                    </div>
                    <div>
                      <span className="font-medium">물건: </span>
                      {booster.items?.slice(0, 2).join(", ")}
                    </div>
                  </div>
                </div>
              );
            })}
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}

// 구성원 간 궁합 이유 요약 카드
function PairCompatibilityReasonCard({ pairs }: { pairs: PairCompatibility[] }) {
  const [expandedPair, setExpandedPair] = useState<number | null>(null);

  return (
    <Card className="border-stone-200 dark:border-stone-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <span className="text-xl">🔍</span>
          왜 이런 궁합인가요?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          각 구성원 간의 궁합이 좋거나 주의가 필요한 이유입니다
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pairs.map((pair, index) => {
          const { member1Name, member2Name, member1Relation, member2Relation, compatibility } = pair;
          const { ilganAnalysis, ohengAnalysis, totalScore } = compatibility;
          const isExpanded = expandedPair === index;

          // 긍정적/부정적 이유 통합
          const positiveReasons = [
            ...ilganAnalysis.positive,
            ...ohengAnalysis.complementary,
          ];
          const negativeReasons = [
            ...ilganAnalysis.negative,
            ...ohengAnalysis.conflict,
          ];

          return (
            <div
              key={index}
              className="bg-white/50 dark:bg-stone-900/50 rounded-lg border border-stone-200 dark:border-stone-800 overflow-hidden"
            >
              <button
                className="w-full p-3 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                onClick={() => setExpandedPair(isExpanded ? null : index)}
              >
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
                    {RELATION_LABELS[member1Relation] || member1Relation}
                  </Badge>
                  <span className="font-medium font-serif">{member1Name}</span>
                  <span className="text-muted-foreground">↔</span>
                  <span className="font-medium font-serif">{member2Name}</span>
                  <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">
                    {RELATION_LABELS[member2Relation] || member2Relation}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getScoreBadgeVariant(totalScore)} className="text-xs">
                    {totalScore}점
                  </Badge>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-stone-100 dark:border-stone-800 pt-3">
                  {/* 일간 관계 */}
                  <div className="p-3 bg-[#F9F7F2] dark:bg-[#2C2824] rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs bg-white dark:bg-black/20">{ilganAnalysis.type}</Badge>
                      <span className="text-xs font-medium text-[#5C544A] dark:text-[#D4C5B0]">관계</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400">{ilganAnalysis.typeDescription}</p>
                  </div>

                  {/* 잘 맞는 점 / 주의할 점 */}
                  <div className="grid grid-cols-2 gap-2">
                    {positiveReasons.length > 0 && (
                      <div className="p-2 bg-green-50/50 dark:bg-green-950/20 rounded border border-green-100 dark:border-green-900/30">
                        <h5 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1 flex items-center gap-1">
                          <span>💚</span> 잘 맞는 점
                        </h5>
                        <ul className="space-y-0.5">
                          {positiveReasons.slice(0, 2).map((reason, i) => (
                            <li key={i} className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-1">
                              <span className="text-green-600">✓</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {negativeReasons.length > 0 && (
                      <div className="p-2 bg-orange-50/50 dark:bg-orange-950/20 rounded border border-orange-100 dark:border-orange-900/30">
                        <h5 className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1 flex items-center gap-1">
                          <span>⚠️</span> 주의할 점
                        </h5>
                        <ul className="space-y-0.5">
                          {negativeReasons.slice(0, 2).map((reason, i) => (
                            <li key={i} className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-1">
                              <span className="text-orange-600">!</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// 관계 유형별 분석 카드
function RelationTypeCard({ analysis }: { analysis: RelationTypeAnalysis }) {
  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
          <Users className="h-4 w-4" />
          {analysis.relationType} 관계
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis.pairs.map((pair, index) => (
          <div key={index} className="bg-stone-50 dark:bg-stone-900 rounded-lg p-3 space-y-2 border border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium font-serif">{pair.member1Name}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-medium font-serif">{pair.member2Name}</span>
              </div>
              <Badge variant={getScoreBadgeVariant(pair.score)}>{pair.score}점</Badge>
            </div>
            <p className="text-sm text-stone-700 dark:text-stone-300">{pair.characteristics}</p>
            <div className="bg-white/50 dark:bg-black/20 rounded p-2">
              <p className="text-xs"><span className="font-medium">조언:</span> {pair.advice}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 십성 해석 데이터
const SIPSEONG_DESCRIPTIONS: Record<string, { meaning: string; advice: string }> = {
  "비견": { meaning: "같은 기운으로 동등한 관계", advice: "서로의 영역을 존중하고 협력하세요" },
  "겁재": { meaning: "경쟁하는 관계로 자극을 주고받음", advice: "긍정적 경쟁으로 함께 성장하세요" },
  "식신": { meaning: "내가 돌봐주는 관계, 표현의 대상", advice: "관심과 애정 표현을 아끼지 마세요" },
  "상관": { meaning: "내가 다스리는 관계, 통제 욕구", advice: "잔소리보다 격려가 효과적입니다" },
  "편재": { meaning: "내가 지배하는 관계, 실용적 교류", advice: "실질적 도움과 지원을 해주세요" },
  "정재": { meaning: "내가 관리하는 관계, 안정적 유대", advice: "꾸준한 관심으로 신뢰를 쌓으세요" },
  "편관": { meaning: "나를 다스리는 관계, 엄격함", advice: "상대의 기대에 부응하려 노력하세요" },
  "정관": { meaning: "나를 이끄는 관계, 존경 대상", advice: "조언을 경청하고 따르세요" },
  "편인": { meaning: "나를 도와주는 관계, 비공식적 후원", advice: "감사하는 마음을 표현하세요" },
  "정인": { meaning: "나를 양육하는 관계, 헌신적 지원", advice: "그 사랑에 보답하세요" },
};

// 가족 십성 관계 분석 카드
function FamilySipseongRelationCard({
  members,
}: {
  members: { saju: SajuApiResult; name: string; gender: "male" | "female"; relation: string }[];
}) {
  // 모든 가족 쌍의 십성 관계 계산
  const relationships: {
    from: string;
    fromRelation: string;
    to: string;
    toRelation: string;
    sipseong: IlganRelationship;
    reverseSipseong: IlganRelationship;
  }[] = [];

  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const member1 = members[i];
      const member2 = members[j];

      const sipseong = analyzeIlganRelationship(
        member1.saju.dayPillar.cheongan,
        member2.saju.dayPillar.cheongan
      );
      const reverseSipseong = analyzeIlganRelationship(
        member2.saju.dayPillar.cheongan,
        member1.saju.dayPillar.cheongan
      );

      relationships.push({
        from: member1.name,
        fromRelation: member1.relation,
        to: member2.name,
        toRelation: member2.relation,
        sipseong,
        reverseSipseong,
      });
    }
  }

  // 십성 색상
  const getSipseongColor = (sipseong: string) => {
    const positive = ["비견", "식신", "정재", "정관", "정인"];
    const neutral = ["겁재", "상관", "편재", "편관", "편인"];
    if (positive.includes(sipseong)) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    if (neutral.includes(sipseong)) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    return "bg-stone-100 text-stone-800 dark:bg-stone-800/50 dark:text-stone-300 border-stone-200 dark:border-stone-700";
  };

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-serif text-indigo-800 dark:text-indigo-300">
          <span className="text-xl">🔗</span>
          가족 십성 관계도
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          일간(日干) 기준 가족 간 에너지 관계
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 십성 관계표 설명 */}
        <div className="text-xs text-muted-foreground bg-white/50 dark:bg-black/20 p-3 rounded-lg">
          <p>십성(十星)은 일간을 기준으로 상대방의 일간과의 관계를 나타내며, 가족 간의 에너지 흐름을 보여줍니다.</p>
        </div>

        {/* 관계 목록 */}
        <div className="space-y-3">
          {relationships.map((rel, index) => (
            <div key={index} className="bg-white/60 dark:bg-black/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/30">
              {/* 관계 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs bg-white dark:bg-black/30">
                    {RELATION_LABELS[rel.fromRelation] || rel.fromRelation}
                  </Badge>
                  <span className="font-medium font-serif">{rel.from}</span>
                  <span className="text-muted-foreground">↔</span>
                  <span className="font-medium font-serif">{rel.to}</span>
                  <Badge variant="outline" className="text-xs bg-white dark:bg-black/30">
                    {RELATION_LABELS[rel.toRelation] || rel.toRelation}
                  </Badge>
                </div>
              </div>

              {/* 양방향 십성 관계 */}
              <div className="grid grid-cols-2 gap-3">
                {/* A → B */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate">{rel.from}에게</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{rel.to}는</span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg border ${getSipseongColor(rel.sipseong.type)}`}>
                    <div className="font-semibold text-center">{rel.sipseong.type}</div>
                    <div className="text-xs text-center mt-1 opacity-80">
                      {SIPSEONG_DESCRIPTIONS[rel.sipseong.type]?.meaning || rel.sipseong.description}
                    </div>
                  </div>
                </div>

                {/* B → A */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground truncate">{rel.to}에게</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{rel.from}는</span>
                  </div>
                  <div className={`px-3 py-2 rounded-lg border ${getSipseongColor(rel.reverseSipseong.type)}`}>
                    <div className="font-semibold text-center">{rel.reverseSipseong.type}</div>
                    <div className="text-xs text-center mt-1 opacity-80">
                      {SIPSEONG_DESCRIPTIONS[rel.reverseSipseong.type]?.meaning || rel.reverseSipseong.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* 관계 조언 */}
              <div className="mt-3 p-2 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg">
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  <span className="font-medium">💡 조언: </span>
                  {SIPSEONG_DESCRIPTIONS[rel.sipseong.type]?.advice || rel.sipseong.advice || "서로의 다름을 인정하고 존중하세요."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 십성 관계 범례 */}
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-muted-foreground mb-2">십성 관계 유형</h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-muted-foreground">정(正) - 조화로운 관계</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-muted-foreground">편(偏) - 역동적 관계</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 가족 대운 캘린더 컴포넌트
interface FamilyMemberFortune {
  name: string;
  relation: string;
  birthYear: number;
  yongsin: string;
  fortunes: MajorFortuneInfo[];
}

function FamilyFortuneCalendarCard({
  memberFortunes,
}: {
  memberFortunes: FamilyMemberFortune[];
}) {
  const currentYear = new Date().getFullYear();

  // 현재 대운 찾기
  const findCurrentFortune = (fortunes: MajorFortuneInfo[], birthYear: number): MajorFortuneInfo | null => {
    const age = currentYear - birthYear + 1;
    return fortunes.find(f => age >= f.startAge && age < f.startAge + 10) || null;
  };

  // 대운이 용신과 일치하는지 확인
  const isGoldenPeriod = (fortune: MajorFortuneInfo | null, yongsin: string): boolean => {
    if (!fortune) return false;
    return fortune.cheonganOheng === yongsin || fortune.jijiOheng === yongsin;
  };

  // 오행 아이콘
  const getOhengIcon = (oheng: string) => {
    const icons: Record<string, string> = {
      "목": "🌲", "화": "🔥", "토": "⛰️", "금": "⚪", "수": "💧"
    };
    return icons[oheng] || "✨";
  };

  // 10년 단위 타임라인 생성 (현재 ~ +30년)
  const generateTimeline = () => {
    const decades: { startYear: number; endYear: number }[] = [];
    const startDecade = Math.floor(currentYear / 10) * 10;
    for (let i = 0; i < 4; i++) {
      decades.push({
        startYear: startDecade + (i * 10),
        endYear: startDecade + (i * 10) + 9,
      });
    }
    return decades;
  };

  const timeline = generateTimeline();

  // 특정 기간에 해당하는 대운 찾기
  const getFortuneForPeriod = (fortunes: MajorFortuneInfo[], birthYear: number, periodStart: number): MajorFortuneInfo | null => {
    const startAge = periodStart - birthYear + 1;
    const endAge = startAge + 9;
    return fortunes.find(f => {
      const fortuneEndAge = f.startAge + 9;
      return (f.startAge <= endAge && fortuneEndAge >= startAge);
    }) || null;
  };

  // 가족 전체 황금기 분석
  const goldenPeriodsAnalysis = () => {
    const periods: { year: string; members: string[] }[] = [];
    timeline.forEach(decade => {
      const membersInGolden: string[] = [];
      memberFortunes.forEach(member => {
        const fortune = getFortuneForPeriod(member.fortunes, member.birthYear, decade.startYear);
        if (isGoldenPeriod(fortune, member.yongsin)) {
          membersInGolden.push(member.name);
        }
      });
      if (membersInGolden.length > 0) {
        periods.push({
          year: `${decade.startYear}~${decade.endYear}`,
          members: membersInGolden,
        });
      }
    });
    return periods;
  };

  const goldenPeriods = goldenPeriodsAnalysis();

  if (memberFortunes.every(m => m.fortunes.length === 0)) {
    return null;
  }

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 font-serif text-emerald-800 dark:text-emerald-300">
          <span className="text-xl">📅</span>
          가족 대운 캘린더
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          가족 구성원별 대운 흐름과 황금기
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 현재 대운 상태 */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <span>🌟</span> 현재 대운 ({currentYear}년)
          </h5>
          <div className="grid gap-3">
            {memberFortunes.map((member, index) => {
              const currentFortune = findCurrentFortune(member.fortunes, member.birthYear);
              const isGolden = isGoldenPeriod(currentFortune, member.yongsin);

              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    isGolden
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                      : "bg-white/60 border-stone-200 dark:bg-black/20 dark:border-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-white dark:bg-black/30">
                        {RELATION_LABELS[member.relation] || member.relation}
                      </Badge>
                      <span className="font-medium text-sm">{member.name}</span>
                      {isGolden && (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500 text-xs">
                          황금기
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>용신:</span>
                      <span className="font-medium">{member.yongsin}</span>
                      <span>{getOhengIcon(member.yongsin)}</span>
                    </div>
                  </div>
                  {currentFortune ? (
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-serif font-bold">{currentFortune.ganji}</div>
                        <div className="text-xs text-muted-foreground">
                          {currentFortune.cheonganOheng} · {currentFortune.jijiOheng}
                        </div>
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="text-stone-600 dark:text-stone-400">
                          {DAEUN_OHENG_INTERPRETATION[currentFortune.cheonganOheng]?.keywords?.[0] || ""} /
                          {DAEUN_OHENG_INTERPRETATION[currentFortune.jijiOheng]?.keywords?.[0] || ""}
                        </p>
                        <p className="text-muted-foreground mt-1">
                          {member.birthYear + currentFortune.startAge - 1}년 ~{" "}
                          {member.birthYear + currentFortune.startAge + 8}년
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">대운 정보 없음</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 가족 대운 타임라인 */}
        <div className="space-y-3">
          <h5 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <span>📊</span> 향후 대운 흐름
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">구성원</th>
                  {timeline.map((decade, i) => (
                    <th key={i} className="text-center py-2 px-2 font-medium text-muted-foreground">
                      {decade.startYear}~{decade.endYear.toString().slice(-2)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {memberFortunes.map((member, mIndex) => (
                  <tr key={mIndex} className="border-b border-stone-100 dark:border-stone-800">
                    <td className="py-2 px-2">
                      <div className="font-medium truncate max-w-[80px]">{member.name}</div>
                      <div className="text-muted-foreground">{RELATION_LABELS[member.relation] || member.relation}</div>
                    </td>
                    {timeline.map((decade, dIndex) => {
                      const fortune = getFortuneForPeriod(member.fortunes, member.birthYear, decade.startYear);
                      const isGolden = isGoldenPeriod(fortune, member.yongsin);
                      return (
                        <td key={dIndex} className="text-center py-2 px-1">
                          {fortune ? (
                            <div
                              className={`inline-block px-2 py-1 rounded ${
                                isGolden
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-1 ring-amber-300"
                                  : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                              }`}
                            >
                              {fortune.ganji}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 가족 황금기 분석 */}
        {goldenPeriods.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <span>✨</span> 가족 황금기 시기
            </h5>
            <div className="grid gap-2">
              {goldenPeriods.map((period, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <div className="text-sm font-medium text-amber-800 dark:text-amber-300 min-w-[100px]">
                    {period.year}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {period.members.map((name, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100">
                        {name}
                      </Badge>
                    ))}
                    {period.members.length >= Math.ceil(memberFortunes.length / 2) && (
                      <Badge className="bg-amber-500 text-white text-xs ml-1">
                        가족 황금기
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              * 황금기: 대운의 오행이 용신과 일치하는 시기
            </p>
          </div>
        )}

        {/* 대운 캘린더 범례 */}
        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-muted-foreground mb-2">범례</h5>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-1 ring-amber-300">
                甲子
              </div>
              <span className="text-muted-foreground">황금기 (용신 대운)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 rounded bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                甲子
              </div>
              <span className="text-muted-foreground">일반 대운</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 가족 전체 분석 결과 카드
function FamilyAnalysisCard({ analysis }: { analysis: FamilyAnalysisResult }) {
  const {
    familyScore,
    familyGrade,
    familyGradeDescription,
    ohengBalance,
    ohengDetailAnalysis = [],
    complementaryRelations = [],
    familyRoles = [],
    relationTypeAnalysis = [],
    familyStrengths,
    familyWeaknesses,
    familyAdvice,
    pairCompatibilities,
  } = analysis;

  const [openPairIndex, setOpenPairIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* 가족 전체 점수 */}
      <Card className="border-2 border-amber-200 dark:border-amber-900/50 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-serif text-[#5C544A] dark:text-[#D4C5B0]">가족 통합 분석 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 총점 및 등급 */}
          <div className="text-center space-y-2">
            <div className={`text-6xl font-serif font-bold ${getScoreColorClass(familyScore)}`}>
              {familyScore}<span className="text-2xl text-muted-foreground ml-1">점</span>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1 font-serif bg-stone-100 dark:bg-stone-800">
              {familyGrade}
            </Badge>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">{familyGradeDescription}</p>
          </div>
        </CardContent>
      </Card>

      {/* 가족 오행 균형 - 상세 분석 */}
      <Card className="border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
            <Sparkles className="h-5 w-5 text-amber-500" />
            가족 오행 분석
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            가족 구성원 전체의 오행 기운을 합산하고 분석한 결과입니다. 균형 잡힌 오행은 가족의 조화를 높여줍니다.
          </p>

          {/* 차트 (Radar Chart) */}
          <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-4">
            <OhengChart ohengCount={ohengBalance} />
          </div>

          {/* 상세 분석 */}
          {ohengDetailAnalysis.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <h4 className="font-semibold text-sm font-serif text-[#8E7F73]">오행별 상세 분석</h4>
              <div className="grid gap-3">
                {ohengDetailAnalysis.map((analysis) => (
                  <OhengDetailCard key={analysis.element} analysis={analysis} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 구성원 간 궁합 - 상세 보기 (핵심 분석이므로 오행 다음에 배치) */}
      <Card className="border-stone-200 dark:border-stone-800">
        <CardHeader>
          <CardTitle className="text-lg font-serif text-[#5C544A] dark:text-[#D4C5B0]">구성원 간 궁합 상세</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            각 구성원 간의 사주 궁합을 상세하게 분석한 결과입니다. 클릭하면 상세 내용을 볼 수 있습니다.
          </p>
          <div className="space-y-3">
            {pairCompatibilities.map((pair, index) => (
              <PairCompatibilityDetailCard
                key={index}
                pair={pair}
                isOpen={openPairIndex === index}
                onToggle={() => setOpenPairIndex(openPairIndex === index ? null : index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 가족 역할 제안 */}
      {familyRoles.length > 0 && (
        <Card className="border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
              <Star className="h-5 w-5 text-yellow-500" />
              가족 내 역할
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              각 구성원의 사주에서 가장 강한 오행을 기반으로 가족 내 역할을 제안합니다.
            </p>
            <div className="grid gap-3">
              {familyRoles.map((role, index) => (
                <FamilyRoleCard key={index} role={role} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 상호 보완 관계 */}
      {complementaryRelations.length > 0 && (
        <Card className="border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
              <ArrowRight className="h-5 w-5 text-blue-500" />
              상호 보완 관계
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              한 구성원이 다른 구성원에게 부족한 오행 기운을 보완해주는 관계입니다.
            </p>
            <div className="grid gap-3">
              {complementaryRelations.map((relation, index) => (
                <ComplementaryRelationCard key={index} relation={relation} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 관계 유형별 특성 */}
      {relationTypeAnalysis.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 font-serif text-[#5C544A] dark:text-[#D4C5B0]">
            <Users className="h-5 w-5" />
            관계 유형별 분석
          </h3>
          {relationTypeAnalysis.map((analysis, index) => (
            <RelationTypeCard key={index} analysis={analysis} />
          ))}
        </div>
      )}

      {/* 강점 */}
      {familyStrengths.length > 0 && (
        <Card className="border-green-200 bg-green-50/30 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700 dark:text-green-400 font-serif">가족의 강점</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {familyStrengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300">
                  <span className="text-green-600 mt-0.5 shrink-0">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 주의점 */}
      {familyWeaknesses.length > 0 && (
        <Card className="border-red-200 bg-red-50/30 dark:border-red-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700 dark:text-red-400 font-serif">주의가 필요한 점</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {familyWeaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-700 dark:text-stone-300">
                  <span className="text-red-600 mt-0.5 shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 가족 종합 조언 */}
      <Card className="bg-[#F5F1E6] dark:bg-[#2C2824] border border-[#E8DCC4] dark:border-[#3E3832]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-serif text-[#8E7F73]">가족 종합 조언</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">{familyAdvice}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface MemberData {
  name: string;
  relation: string;
  gender: "male" | "female";
  saju: SajuApiResult;
  timeUnknown: boolean;
  majorFortunes: MajorFortuneInfo[];
  birthYear: number;
}

function FamilyResultContent() {
  const router = useRouter();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [analysis, setAnalysis] = useState<FamilyAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberFortunes, setMemberFortunes] = useState<FamilyMemberFortune[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // sessionStorage에서 데이터 읽기
        const stored = sessionStorage.getItem("saju_family");
        if (!stored) {
          setError("분석할 데이터가 없습니다. 다시 입력해주세요.");
          setLoading(false);
          return;
        }

        const familyMembers = JSON.parse(stored);
        if (familyMembers.length < 2) {
          setError("가족 분석을 위해 최소 2명의 구성원이 필요합니다.");
          setLoading(false);
          return;
        }

        // 각 구성원의 사주 계산
        const memberPromises: Promise<MemberData>[] = [];

        for (let i = 0; i < familyMembers.length; i++) {
          const member = familyMembers[i];
          const year = parseInt(member.year);
          const month = parseInt(member.month);
          const day = parseInt(member.day);
          const hour = parseInt(member.hour);
          const minute = parseInt(member.minute);
          const isLunar = member.lunar;
          const name = member.name || `구성원 ${i + 1}`;
          const gender = member.gender || "female";
          const relation = member.relation || "other";
          const timeUnknown = member.timeUnknown;

          if (!year || !month || !day) {
            throw new Error(`${name}의 생년월일 정보가 부족합니다.`);
          }

          const promise = fetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year, month, day, hour, minute,
              isLunar, timeUnknown, gender,
            }),
          })
            .then(res => res.json())
            .then(data => {
              if (!data.data) {
                throw new Error(`${name}의 사주 계산에 실패했습니다.`);
              }
              return {
                name,
                relation,
                gender,
                saju: data.data,
                timeUnknown,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                majorFortunes: (data.data as any).majorFortunes || [],
                birthYear: data.data.birthInfo?.solarYear || year,
              };
            });

          memberPromises.push(promise);
        }

        const memberResults = await Promise.all(memberPromises);
        setMembers(memberResults);

        // 대운 데이터 저장
        setMemberFortunes(memberResults.map(m => ({
          name: m.name,
          relation: m.relation,
          birthYear: m.birthYear,
          yongsin: m.saju.yongsin,
          fortunes: m.majorFortunes,
        })));

        // 가족 분석 API 호출
        const familyRes = await fetch("/api/saju/family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            members: memberResults.map(m => ({
              name: m.name,
              relation: m.relation,
              saju: m.saju,
              timeUnknown: m.timeUnknown,
            })),
          }),
        });

        const familyData = await familyRes.json();
        if (!familyRes.ok) {
          throw new Error(familyData.error || "가족 분석 중 오류가 발생했습니다.");
        }

        setAnalysis(familyData.data);
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

  if (!analysis || members.length < 2) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F5F1E6] dark:bg-[#1c1917] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2 text-[#5C544A] dark:text-[#D4C5B0]">가족 통합 분석</h1>
          <p className="text-muted-foreground">
            {members.length}명의 가족 구성원 사주를 분석한 결과입니다
          </p>
        </header>

        {/* 1. 스토리텔링 인트로 */}
        <FamilyStoryIntroCard
          memberCount={members.length}
          familyScore={analysis.familyScore}
        />

        {/* 2. 가족 구성원 카드 - 기본 정보 먼저 */}
        <Card className="bg-white/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800">
          <CardHeader>
            <CardTitle className="text-lg font-serif text-[#5C544A] dark:text-[#D4C5B0]">가족 구성원</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {members.map((member, index) => (
                <FamilyMemberCard
                  key={index}
                  saju={member.saju}
                  name={member.name}
                  gender={member.gender}
                  relation={member.relation}
                  timeUnknown={member.timeUnknown}
                />
              ))}
            </div>
            {/* 시간 미입력 안내 */}
            {members.some(m => m.timeUnknown) && (
              <div className="text-center text-xs text-blue-600/80 bg-blue-50/50 dark:bg-blue-950/30 py-2 px-3 rounded-lg">
                {members.every(m => m.timeUnknown) ? (
                  <>※ 모든 가족 구성원의 태어난 시간 미입력으로 년/월/일주(6글자) 기준으로 분석했습니다.</>
                ) : (
                  <>
                    ※ {members.filter(m => m.timeUnknown).map(m => m.name || "구성원").join(", ")}님의 시간 미입력으로
                    궁합 비교 시 해당 구성원과의 분석은 년/월/일주(6글자) 기준으로 진행했습니다.
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. 가족 분석 결과 - 점수/오행/역할/궁합 상세 */}
        <FamilyAnalysisCard analysis={analysis} />

        {/* 4. 구성원 간 궁합 이유 요약 */}
        <PairCompatibilityReasonCard pairs={analysis.pairCompatibilities} />

        {/* 5. 가족 일주 상징 */}
        <FamilyIljuSymbolsCard members={members} />

        {/* 6. 가족 십성 관계도 */}
        <FamilySipseongRelationCard members={members} />

        {/* 7. 가족 대운 캘린더 */}
        <FamilyFortuneCalendarCard memberFortunes={memberFortunes} />

        {/* 8. 가족 오행 보완 활동 - 액션 아이템은 마지막에 */}
        <FamilyOhengAdviceCard members={members} />

        {/* 총정리 */}
        <Card className="border-2 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-amber-800 dark:text-amber-300">
              <span className="text-2xl">📋</span>
              총정리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 가족 구성원 요약 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {members.map((member, index) => (
                <div key={index} className="bg-white/60 dark:bg-black/20 rounded-lg p-2 text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {RELATION_LABELS[member.relation] || member.relation}
                  </div>
                  <div className="font-medium text-sm truncate">{member.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <span>{member.saju.dayPillar.ganji}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      {member.saju.yongsin}
                      {OHENG_ICONS[member.saju.yongsin]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 가족 점수 */}
            <div className="text-center py-3 bg-white/60 dark:bg-black/20 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">가족 조화 점수</div>
              <div className={`text-3xl font-bold font-serif ${getScoreColorClass(analysis.familyScore)}`}>
                {analysis.familyScore}점
              </div>
              <Badge className="mt-2">{analysis.familyGrade}</Badge>
            </div>

            {/* 한줄 요약 */}
            <div className="p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 font-medium text-center">
                {analysis.familyAdvice}
              </p>
            </div>

            {/* 핵심 조언 */}
            <div className="grid gap-2">
              {analysis.familyStrengths.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-stone-700 dark:text-stone-300">{analysis.familyStrengths[0]}</span>
                </div>
              )}
              {analysis.familyWeaknesses.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-orange-600 font-bold">!</span>
                  <span className="text-stone-700 dark:text-stone-300">{analysis.familyWeaknesses[0]}</span>
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

      </div>
    </main>
  );
}

export default function FamilyResultPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <FamilyResultContent />
    </Suspense>
  );
}
