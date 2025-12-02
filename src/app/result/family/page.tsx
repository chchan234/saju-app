"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { RELATION_LABELS } from "@/lib/saju-family";
import { ChevronDown, ChevronUp, Users, Sparkles, ArrowRight, Star, Heart } from "lucide-react";
import {
  ILJU_SYMBOLS,
  OHENG_BOOSTERS,
  generateGroupStoryIntro,
} from "@/lib/saju-analysis-data";

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-muted-foreground">가족 궁합을 분석하고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 오행 색상
const OHENG_COLORS: Record<string, string> = {
  목: "bg-green-500",
  화: "bg-red-500",
  토: "bg-yellow-600",
  금: "bg-gray-300",
  수: "bg-blue-500",
};

const OHENG_TEXT_COLORS: Record<string, string> = {
  목: "text-green-600",
  화: "text-red-600",
  토: "text-yellow-700",
  금: "text-gray-600",
  수: "text-blue-600",
};

const OHENG_BG_LIGHT: Record<string, string> = {
  목: "bg-green-50 border-green-200",
  화: "bg-red-50 border-red-200",
  토: "bg-yellow-50 border-yellow-200",
  금: "bg-gray-50 border-gray-200",
  수: "bg-blue-50 border-blue-200",
};

// 점수에 따른 색상
function getScoreColor(score: number): string {
  if (score >= 85) return "text-green-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 65) return "text-yellow-600";
  if (score >= 55) return "text-orange-600";
  return "text-red-600";
}

// 점수에 따른 배지 색상
function getScoreBadgeVariant(score: number): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 75) return "default";
  if (score >= 55) return "secondary";
  return "destructive";
}

// 미니 사주 카드
function MiniPillarCard({ pillar, label }: { pillar: { cheongan: string; jiji: string; cheonganOheng: string; jijiOheng: string }; label: string }) {
  if (!pillar.cheongan) return null;

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-col items-center gap-1">
        <span className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs ${OHENG_COLORS[pillar.cheonganOheng] || "bg-gray-400"}`}>
          {pillar.cheongan}
        </span>
        <span className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs ${OHENG_COLORS[pillar.jijiOheng] || "bg-gray-400"}`}>
          {pillar.jiji}
        </span>
      </div>
    </div>
  );
}

// 가족 구성원 요약 카드
function FamilyMemberCard({
  saju,
  name,
  relation,
  timeUnknown,
}: {
  saju: SajuApiResult;
  name: string;
  relation: string;
  timeUnknown: boolean;
}) {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount, meta } = saju;
  const relationLabel = RELATION_LABELS[relation] || relation;

  return (
    <Card className="flex-1 min-w-[200px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Badge variant="outline">{relationLabel}</Badge>
          <span className="text-sm font-medium">{name || "이름 없음"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 사주 기둥 */}
        <div className="flex justify-center gap-2">
          <MiniPillarCard pillar={yearPillar} label="년" />
          <MiniPillarCard pillar={monthPillar} label="월" />
          <MiniPillarCard pillar={dayPillar} label="일" />
          {!timeUnknown && <MiniPillarCard pillar={timePillar} label="시" />}
        </div>

        {/* 일간 정보 */}
        <div className="text-center text-xs">
          <span className="text-muted-foreground">일간: </span>
          <span className="font-medium">{dayPillar.cheongan}({dayPillar.cheonganOheng})</span>
          <span className="text-muted-foreground ml-2">띠: </span>
          <span className="font-medium">{meta.ddi}띠</span>
        </div>

        {/* 오행 분포 */}
        <div className="flex justify-center gap-1">
          {Object.entries(ohengCount).map(([oheng, count]) => (
            <div key={oheng} className="text-center">
              <div className={`w-5 h-5 rounded text-white text-xs flex items-center justify-center ${OHENG_COLORS[oheng]}`}>
                {oheng}
              </div>
              <span className="text-xs">{count}</span>
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
      <div className="bg-muted/30 rounded-lg overflow-hidden border">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-xs">
                {RELATION_LABELS[member1Relation] || member1Relation}
              </Badge>
              <span className="font-medium">{member1Name || "구성원"}</span>
              <span className="text-muted-foreground">↔</span>
              <span className="font-medium">{member2Name || "구성원"}</span>
              <Badge variant="outline" className="text-xs">
                {RELATION_LABELS[member2Relation] || member2Relation}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getScoreBadgeVariant(totalScore)} className="text-sm">
              {totalScore}점
            </Badge>
            <Badge variant="secondary">{grade}</Badge>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t pt-4">
            {/* 등급 설명 */}
            <p className="text-sm text-muted-foreground">{gradeDescription}</p>

            {/* 일간 관계 - 상세 */}
            <div className="bg-background/50 rounded-lg p-4 space-y-3">
              <h5 className="font-semibold flex items-center gap-2 text-sm">
                일간(日干) 관계
                <Badge variant="outline">{ilganAnalysis.type}</Badge>
              </h5>
              <p className="text-xs text-muted-foreground">
                일간은 사주에서 나 자신을 나타내며, 두 사람의 일간 관계로 기본적인 궁합을 파악합니다.
              </p>
              <div className="text-center py-2">
                <span className="font-medium text-lg">{ilganAnalysis.person1Ilgan}</span>
                <span className="mx-3 text-muted-foreground">↔</span>
                <span className="font-medium text-lg">{ilganAnalysis.person2Ilgan}</span>
              </div>
              <div className="bg-muted/50 rounded p-3">
                <p className="text-sm">{ilganAnalysis.typeDescription}</p>
              </div>
            </div>

            {/* 지지 관계 - 상세 */}
            {(jijiAnalysis.yukap.length > 0 || jijiAnalysis.chung.length > 0 ||
              jijiAnalysis.hyung.length > 0 || jijiAnalysis.hae.length > 0) && (
              <div className="space-y-3">
                <h5 className="font-semibold text-sm">지지(地支) 관계</h5>
                <p className="text-xs text-muted-foreground">
                  지지는 사주의 땅의 기운으로, 두 사람 사주에 있는 지지들 사이의 관계를 분석합니다.
                </p>

                {/* 육합 - 좋은 관계 */}
                {jijiAnalysis.yukap.map((item, i) => (
                  <div key={`yukap-${i}`} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-500 text-white hover:bg-green-500">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-green-700 text-xs font-medium">조화로운 관계</span>
                    </div>
                    <p className="text-xs text-green-800">{item.description}</p>
                  </div>
                ))}

                {/* 충 - 충돌 관계 */}
                {jijiAnalysis.chung.map((item, i) => (
                  <div key={`chung-${i}`} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-red-500 text-white hover:bg-red-500">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-red-700 text-xs font-medium">충돌 관계</span>
                    </div>
                    <p className="text-xs text-red-800">{item.description}</p>
                  </div>
                ))}

                {/* 형 - 마찰 관계 */}
                {jijiAnalysis.hyung.map((item, i) => (
                  <div key={`hyung-${i}`} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-orange-700 text-xs font-medium">마찰 관계</span>
                    </div>
                    <p className="text-xs text-orange-800">{item.description}</p>
                  </div>
                ))}

                {/* 해 - 주의 필요 */}
                {jijiAnalysis.hae.map((item, i) => (
                  <div key={`hae-${i}`} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-yellow-700 text-xs font-medium">주의 필요</span>
                    </div>
                    <p className="text-xs text-yellow-800">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 강점 */}
            {summary.strengths.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-semibold text-sm text-green-700">이 관계의 강점</h5>
                <ul className="space-y-1">
                  {summary.strengths.map((item, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 주의점 */}
            {summary.weaknesses.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-semibold text-sm text-red-700">주의할 점</h5>
                <ul className="space-y-1">
                  {summary.weaknesses.map((item, i) => (
                    <li key={i} className="text-xs flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">-</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 조언 */}
            <div className="bg-primary/5 rounded-lg p-3">
              <h5 className="font-semibold text-sm mb-1">관계 조언</h5>
              <p className="text-xs">{summary.advice}</p>
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
          <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-medium ${OHENG_COLORS[analysis.element]}`}>
            {analysis.element}
          </div>
          <span className="font-medium">{analysis.percentage}%</span>
          <span className="text-sm text-muted-foreground">({analysis.count}개)</span>
        </div>
        <Badge className={statusColors[analysis.status]}>
          {analysis.status}
        </Badge>
      </div>
      <p className="text-sm mb-2">{analysis.meaning}</p>
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
        <Badge variant="outline" className="text-xs">
          {RELATION_LABELS[relation.giverRelation] || relation.giverRelation}
        </Badge>
        <span className="font-medium">{relation.giverName}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{relation.receiverName}</span>
        <Badge variant="outline" className="text-xs">
          {RELATION_LABELS[relation.receiverRelation] || relation.receiverRelation}
        </Badge>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs ${OHENG_COLORS[relation.giverElement]}`}>
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
          <Badge variant="outline" className="text-xs">
            {RELATION_LABELS[role.memberRelation] || role.memberRelation}
          </Badge>
          <span className="font-medium">{role.memberName}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs ${OHENG_COLORS[role.element]}`}>
            {role.element}
          </div>
          <Badge className={`${OHENG_COLORS[role.element]} text-white`}>
            {role.role}
          </Badge>
        </div>
      </div>
      <p className="text-sm mb-2">{role.roleDescription}</p>
      <div className="flex flex-wrap gap-1">
        {role.strengths.map((strength, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
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
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="pt-6">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold text-amber-600">Family</div>
          <p className="text-sm text-amber-800 leading-relaxed italic">
            "{storyIntro}"
          </p>
        </div>
      </CardContent>
    </Card>
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
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full">
            <CardTitle className="text-lg flex items-center justify-between">
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
                className="bg-muted/30 rounded-lg p-3 border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {RELATION_LABELS[member.relation] || member.relation}
                  </Badge>
                  <span className="font-medium text-sm">{member.name || "구성원"}</span>
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
                    <span className="text-sm font-medium text-amber-700">
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
                  className="bg-amber-50/50 rounded-lg p-4 border border-amber-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {RELATION_LABELS[member.relation] || member.relation}
                    </Badge>
                    <span className="font-semibold">{member.name || "구성원"}</span>
                    <span className="text-amber-700">- {member.iljuSymbol.nickname}</span>
                  </div>
                  <p className="text-sm mb-3 text-muted-foreground">
                    {member.iljuSymbol.essence}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/50 rounded p-2">
                      <span className="text-green-600 font-medium">성격: </span>
                      {member.iljuSymbol.personality}
                    </div>
                    <div className="bg-white/50 rounded p-2">
                      <span className="text-blue-600 font-medium">인생 주제: </span>
                      {member.iljuSymbol.lifeTheme}
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

  if (weakOhengs.length === 0) return null;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="w-full">
            <CardTitle className="text-lg flex items-center justify-between">
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
              <Badge key={oheng} className={`${OHENG_COLORS[oheng]} text-white`}>
                {oheng} 기운 보충 필요
              </Badge>
            ))}
          </div>

          <CollapsibleContent className="space-y-4">
            {/* 함께 할 수 있는 활동 */}
            {commonActivities.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h5 className="font-semibold text-sm text-green-800 mb-2">
                  🏃 함께 할 수 있는 활동
                </h5>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(commonActivities)].slice(0, 6).map((activity, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 함께 먹으면 좋은 음식 */}
            {commonFoods.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h5 className="font-semibold text-sm text-orange-800 mb-2">
                  🍽️ 함께 먹으면 좋은 음식
                </h5>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(commonFoods)].slice(0, 6).map((food, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
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
                  <h5 className={`font-semibold text-sm mb-2 ${OHENG_TEXT_COLORS[oheng]}`}>
                    {oheng}({booster.hanja}) 기운 보완
                  </h5>
                  <p className="text-xs text-muted-foreground mb-2">
                    {booster.season}의 기운, {booster.direction} 방향의 에너지
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
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

// 관계 유형별 분석 카드
function RelationTypeCard({ analysis }: { analysis: RelationTypeAnalysis }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          {analysis.relationType} 관계
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {analysis.pairs.map((pair, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{pair.member1Name}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-medium">{pair.member2Name}</span>
              </div>
              <Badge variant={getScoreBadgeVariant(pair.score)}>{pair.score}점</Badge>
            </div>
            <p className="text-sm">{pair.characteristics}</p>
            <div className="bg-primary/5 rounded p-2">
              <p className="text-xs"><span className="font-medium">조언:</span> {pair.advice}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// 가족 오행 균형 차트
function OhengBalanceChart({ balance }: { balance: FamilyAnalysisResult["ohengBalance"] }) {
  const total = Object.values(balance).reduce((sum, v) => sum + v, 0);
  const maxValue = Math.max(...Object.values(balance));

  return (
    <div className="space-y-2">
      {(Object.entries(balance) as [string, number][]).map(([oheng, count]) => (
        <div key={oheng} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${OHENG_COLORS[oheng]}`}>
            {oheng}
          </div>
          <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
            <div
              className={`h-full ${OHENG_COLORS[oheng]} transition-all`}
              style={{ width: `${(count / maxValue) * 100}%` }}
            />
          </div>
          <span className="text-sm w-16 text-right">
            {count}개 ({Math.round((count / total) * 100)}%)
          </span>
        </div>
      ))}
    </div>
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
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">가족 통합 분석 결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 총점 및 등급 */}
          <div className="text-center space-y-2">
            <div className={`text-5xl font-bold ${getScoreColor(familyScore)}`}>
              {familyScore}점
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {familyGrade}
            </Badge>
            <p className="text-muted-foreground text-sm">{familyGradeDescription}</p>
          </div>
        </CardContent>
      </Card>

      {/* 가족 오행 균형 - 상세 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            가족 오행 분석
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            가족 구성원 전체의 오행 기운을 합산하고 분석한 결과입니다. 균형 잡힌 오행은 가족의 조화를 높여줍니다.
          </p>

          {/* 차트 */}
          <OhengBalanceChart balance={ohengBalance} />

          {/* 상세 분석 */}
          {ohengDetailAnalysis.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm">오행별 상세 분석</h4>
              <div className="grid gap-3">
                {ohengDetailAnalysis.map((analysis) => (
                  <OhengDetailCard key={analysis.element} analysis={analysis} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 가족 역할 제안 */}
      {familyRoles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
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
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            관계 유형별 분석
          </h3>
          {relationTypeAnalysis.map((analysis, index) => (
            <RelationTypeCard key={index} analysis={analysis} />
          ))}
        </div>
      )}

      {/* 구성원 간 궁합 - 상세 보기 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">구성원 간 궁합 상세</CardTitle>
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

      {/* 강점 */}
      {familyStrengths.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700">가족의 강점</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {familyStrengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700">주의가 필요한 점</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {familyWeaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 mt-0.5 shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 가족 종합 조언 */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">가족 종합 조언</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{familyAdvice}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface MemberData {
  name: string;
  relation: string;
  saju: SajuApiResult;
  timeUnknown: boolean;
}

function FamilyResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [analysis, setAnalysis] = useState<FamilyAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 가족 구성원 수 확인
        const memberCount = parseInt(searchParams.get("count") || "0");
        if (memberCount < 2) {
          setError("가족 분석을 위해 최소 2명의 구성원이 필요합니다.");
          setLoading(false);
          return;
        }

        // 각 구성원의 사주 계산
        const memberPromises: Promise<MemberData>[] = [];

        for (let i = 0; i < memberCount; i++) {
          const year = parseInt(searchParams.get(`m${i}_year`) || "0");
          const month = parseInt(searchParams.get(`m${i}_month`) || "0");
          const day = parseInt(searchParams.get(`m${i}_day`) || "0");
          const hour = parseInt(searchParams.get(`m${i}_hour`) || "12");
          const minute = parseInt(searchParams.get(`m${i}_minute`) || "0");
          const isLunar = searchParams.get(`m${i}_lunar`) === "true";
          const name = searchParams.get(`m${i}_name`) || `구성원 ${i + 1}`;
          const relation = searchParams.get(`m${i}_relation`) || "other";
          const timeUnknown = searchParams.get(`m${i}_timeUnknown`) === "true";

          if (!year || !month || !day) {
            throw new Error(`${name}의 생년월일 정보가 부족합니다.`);
          }

          const promise = fetch("/api/saju", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              year, month, day, hour, minute,
              isLunar, timeUnknown,
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
                saju: data.data,
                timeUnknown,
              };
            });

          memberPromises.push(promise);
        }

        const memberResults = await Promise.all(memberPromises);
        setMembers(memberResults);

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
  }, [searchParams]);

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
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
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">가족 통합 분석</h1>
          <p className="text-muted-foreground">
            {members.length}명의 가족 구성원 사주를 분석한 결과입니다
          </p>
        </header>

        {/* 스토리텔링 인트로 */}
        <FamilyStoryIntroCard
          memberCount={members.length}
          familyScore={analysis.familyScore}
        />

        {/* 가족 일주 상징 */}
        <FamilyIljuSymbolsCard members={members} />

        {/* 가족 오행 보완 활동 */}
        <FamilyOhengAdviceCard members={members} />

        {/* 가족 구성원 카드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">가족 구성원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {members.map((member, index) => (
                <FamilyMemberCard
                  key={index}
                  saju={member.saju}
                  name={member.name}
                  relation={member.relation}
                  timeUnknown={member.timeUnknown}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 가족 분석 결과 */}
        <FamilyAnalysisCard analysis={analysis} />

        {/* 버튼 */}
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            새로 분석하기
          </Button>
          <Button onClick={() => window.print()}>
            결과 인쇄하기
          </Button>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>※ 본 결과는 참고용이며, 가족 관계는 서로의 이해와 노력에 따라 달라집니다.</p>
        </footer>
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
