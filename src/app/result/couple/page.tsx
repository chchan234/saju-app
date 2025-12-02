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
import { ChevronDown, ChevronUp, Sparkles, Heart, Info, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { SajuApiResult } from "@/types/saju";
import type { CompatibilityResult } from "@/lib/saju-compatibility";
import {
  ILJU_SYMBOLS,
  OHENG_BOOSTERS,
  generateGroupStoryIntro,
} from "@/lib/saju-analysis-data";
import { analyzeIljuCompatibility } from "@/lib/saju-family";

function LoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-muted-foreground">궁합을 분석하고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 후원 정보 버튼
function DonationInfoButton() {
  const [copied, setCopied] = useState(false);
  const accountNumber = "3333-01-5848626";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API 실패 시 fallback
      const textArea = document.createElement("textarea");
      textArea.value = accountNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Info className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            서비스 안내
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            이 서비스는 개인 서버에서 운영되고 있습니다.
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <p className="text-sm font-medium">
              후원해주시면 감사하겠습니다 🙏
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-background rounded border text-sm font-mono">
                카카오뱅크 {accountNumber}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600">계좌번호가 복사되었습니다!</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

// 점수에 따른 색상
function getScoreColor(score: number): string {
  if (score >= 85) return "text-green-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 65) return "text-yellow-600";
  if (score >= 55) return "text-orange-600";
  return "text-red-600";
}

// 미니 사주 카드
function MiniPillarCard({ pillar, label }: { pillar: { cheongan: string; jiji: string; cheonganOheng: string; jijiOheng: string }; label: string }) {
  if (!pillar.cheongan) return null;

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-col items-center gap-1">
        <span className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${OHENG_COLORS[pillar.cheonganOheng] || "bg-gray-400"}`}>
          {pillar.cheongan}
        </span>
        <span className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${OHENG_COLORS[pillar.jijiOheng] || "bg-gray-400"}`}>
          {pillar.jiji}
        </span>
      </div>
    </div>
  );
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {label}
          {name && <Badge variant="outline">{name}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 사주 기둥 */}
        <div className="flex justify-center gap-3">
          <MiniPillarCard pillar={yearPillar} label="년" />
          <MiniPillarCard pillar={monthPillar} label="월" />
          <MiniPillarCard pillar={dayPillar} label="일" />
          {!timeUnknown && <MiniPillarCard pillar={timePillar} label="시" />}
        </div>

        {/* 일간 정보 */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">일간: </span>
          <span className="font-medium">{dayPillar.cheongan}({dayPillar.cheonganOheng})</span>
          <span className="text-muted-foreground ml-2">띠: </span>
          <span className="font-medium">{meta.ddi}띠</span>
        </div>

        {/* 오행 분포 */}
        <div className="flex justify-center gap-2">
          {Object.entries(ohengCount).map(([oheng, count]) => (
            <div key={oheng} className="text-center">
              <div className={`w-6 h-6 rounded text-white text-xs flex items-center justify-center ${OHENG_COLORS[oheng]}`}>
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

// 커플 스토리 도입부 카드
function CoupleStoryIntroCard({ score, name1, name2 }: { score: number; name1: string; name2: string }) {
  const storyIntro = generateGroupStoryIntro(2, score, false);

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-primary/5 dark:from-pink-950/20 dark:to-primary/5 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Heart className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <p className="font-medium text-lg">
              {name1}님과 {name2}님의 인연
            </p>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {storyIntro}
            </div>
            <p className="text-sm text-primary font-medium">
              두 분의 사주를 자세히 살펴보겠습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          두 분의 일주 상징
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Person 1 */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{name1}</Badge>
                {symbol1 && <span className="text-sm font-medium">{symbol1.hanja}</span>}
              </div>
              {symbol1 ? (
                <>
                  <p className="font-medium text-primary">&quot;{symbol1.nickname}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-1">{symbol1.essence}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">일주 정보 없음</p>
              )}
            </div>

            {/* Person 2 */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{name2}</Badge>
                {symbol2 && <span className="text-sm font-medium">{symbol2.hanja}</span>}
              </div>
              {symbol2 ? (
                <>
                  <p className="font-medium text-primary">&quot;{symbol2.nickname}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-1">{symbol2.essence}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">일주 정보 없음</p>
              )}
            </div>
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>상세 성향 비교</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {symbol1 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{name1}님의 성격</h4>
                  <p className="text-sm text-muted-foreground">{symbol1.personality}</p>
                  <p className="text-sm text-primary mt-2">인생 주제: {symbol1.lifeTheme}</p>
                </div>
              )}
              {symbol2 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{name2}님의 성격</h4>
                  <p className="text-sm text-muted-foreground">{symbol2.personality}</p>
                  <p className="text-sm text-primary mt-2">인생 주제: {symbol2.lifeTheme}</p>
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
    <Card>
      <CardHeader>
        <CardTitle>함께 하면 좋은 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-4">
            {/* 개인별 보완 오행 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">{name1}님 보완 오행:</span>
                <Badge className={`ml-2 ${OHENG_COLORS[yongsin1]}`}>{yongsin1}</Badge>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">{name2}님 보완 오행:</span>
                <Badge className={`ml-2 ${OHENG_COLORS[yongsin2]}`}>{yongsin2}</Badge>
              </div>
            </div>

            {/* 공통 추천 */}
            {commonActivities.length > 0 && (
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">두 분 모두에게 좋은 활동</h4>
                <div className="flex flex-wrap gap-2">
                  {commonActivities.map(a => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mt-4">
              <span>개인별 상세 보완법</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {booster1 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{name1}님 - {yongsin1} 보완</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">방향:</span> {booster1.direction}</p>
                    <p><span className="text-muted-foreground">계절:</span> {booster1.season}</p>
                    <div>
                      <span className="text-muted-foreground">추천 활동:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {booster1.activities.slice(0, 4).map(a => (
                          <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {booster2 && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{name2}님 - {yongsin2} 보완</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">방향:</span> {booster2.direction}</p>
                    <p><span className="text-muted-foreground">계절:</span> {booster2.season}</p>
                    <div>
                      <span className="text-muted-foreground">추천 활동:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {booster2.activities.slice(0, 4).map(a => (
                          <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 공통 음식 */}
            {commonFoods.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">함께 먹으면 좋은 음식</h4>
                <div className="flex flex-wrap gap-2">
                  {commonFoods.map(f => (
                    <Badge key={f} variant="secondary">{f}</Badge>
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
      case "천생연분": return "bg-pink-500 text-white";
      case "상호보완": return "bg-blue-500 text-white";
      case "동반성장": return "bg-green-500 text-white";
      case "주의필요": return "bg-orange-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">궁합 분석 결과</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 총점 및 등급 */}
        <div className="text-center space-y-2">
          <div className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
            {totalScore}점
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {grade}
          </Badge>
          <p className="text-muted-foreground text-sm">{gradeDescription}</p>
        </div>

        {/* 일간 관계 */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            일간(日干) 관계
            <Badge variant="outline">{ilganAnalysis.type}</Badge>
          </h4>
          <p className="text-xs text-muted-foreground">
            일간은 사주에서 나 자신을 나타내며, 두 사람의 일간 관계로 기본적인 궁합을 파악합니다.
          </p>
          <div className="text-center py-2">
            <span className="font-medium text-lg">{ilganAnalysis.person1Ilgan}</span>
            <span className="mx-3 text-muted-foreground">↔</span>
            <span className="font-medium text-lg">{ilganAnalysis.person2Ilgan}</span>
          </div>
          <div className="bg-background/50 rounded p-3">
            <p className="text-sm">{ilganAnalysis.typeDescription}</p>
          </div>
        </div>

        {/* 지지 관계 */}
        {(jijiAnalysis.yukap.length > 0 || jijiAnalysis.chung.length > 0 ||
          jijiAnalysis.hyung.length > 0 || jijiAnalysis.hae.length > 0) && (
          <div className="space-y-4">
            <h4 className="font-semibold">지지(地支) 관계</h4>
            <p className="text-sm text-muted-foreground">
              지지는 사주의 땅의 기운으로, 두 사람 사주에 있는 지지들 사이의 관계를 분석합니다.
            </p>

            {/* 육합 - 좋은 관계 */}
            {jijiAnalysis.yukap.length > 0 && (
              <div className="space-y-2">
                {jijiAnalysis.yukap.map((item, i) => (
                  <div key={`yukap-${i}`} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-green-500 text-white hover:bg-green-500">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-green-700 text-sm font-medium">조화로운 관계</span>
                    </div>
                    <p className="text-sm text-green-800">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 충 - 충돌 관계 */}
            {jijiAnalysis.chung.length > 0 && (
              <div className="space-y-2">
                {jijiAnalysis.chung.map((item, i) => (
                  <div key={`chung-${i}`} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-red-500 text-white hover:bg-red-500">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-red-700 text-sm font-medium">충돌 관계</span>
                    </div>
                    <p className="text-sm text-red-800">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 형 - 갈등 관계 */}
            {jijiAnalysis.hyung.length > 0 && (
              <div className="space-y-2">
                {jijiAnalysis.hyung.map((item, i) => (
                  <div key={`hyung-${i}`} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-orange-700 text-sm font-medium">마찰 관계</span>
                    </div>
                    <p className="text-sm text-orange-800">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 해 - 해로운 관계 */}
            {jijiAnalysis.hae.length > 0 && (
              <div className="space-y-2">
                {jijiAnalysis.hae.map((item, i) => (
                  <div key={`hae-${i}`} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">
                        {item.pair} {item.name}
                      </Badge>
                      <span className="text-yellow-700 text-sm font-medium">주의 필요</span>
                    </div>
                    <p className="text-sm text-yellow-800">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 강점 */}
        {summary.strengths.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-green-700">강점</h4>
            <ul className="space-y-1">
              {summary.strengths.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 약점 / 주의점 */}
        {summary.weaknesses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-700">주의점</h4>
            <ul className="space-y-1">
              {summary.weaknesses.map((item, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 조언 */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h4 className="font-semibold mb-2">조언</h4>
          <p className="text-sm">{summary.advice}</p>
        </div>

        {/* 일주 관계 분석 (점수/등급 없이 관계만) */}
        {iljuAnalysis && ilju1 && ilju2 && (
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
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
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{name1}</p>
                <p className="text-2xl font-bold">{ilju1}</p>
              </div>
              <div className="text-2xl font-bold text-pink-500">&amp;</div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{name2}</p>
                <p className="text-2xl font-bold">{ilju2}</p>
              </div>
            </div>

            {/* 일간 관계 요약 */}
            {ilganRelation && (
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">일간 관계:</span>
                  <Badge variant="outline">{ilganRelation.type}</Badge>
                  <Badge variant="outline" className={
                    ilganRelation.compatibility === "상" ? "border-green-500 text-green-600" :
                    ilganRelation.compatibility === "중상" ? "border-blue-500 text-blue-600" :
                    ilganRelation.compatibility === "중" ? "border-yellow-500 text-yellow-600" :
                    ilganRelation.compatibility === "중하" ? "border-orange-500 text-orange-600" :
                    "border-red-500 text-red-600"
                  }>
                    궁합 {ilganRelation.compatibility}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{ilganRelation.description}</p>
              </div>
            )}

            {/* 특별 조합인 경우 */}
            {isSpecialMatch && matchInfo && (
              <div className={`rounded-lg p-4 ${
                matchInfo.category === "천생연분" ? "bg-pink-50 border border-pink-200" :
                matchInfo.category === "상호보완" ? "bg-blue-50 border border-blue-200" :
                matchInfo.category === "동반성장" ? "bg-green-50 border border-green-200" :
                "bg-orange-50 border border-orange-200"
              }`}>
                <h5 className="font-semibold mb-2">특별한 인연입니다!</h5>
                <p className="text-sm mb-3">{matchInfo.reason}</p>
              </div>
            )}

            {/* 상세 분석 Collapsible */}
            <Collapsible open={isIljuOpen} onOpenChange={setIsIljuOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span>일주 상세 분석 보기</span>
                  {isIljuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-4 pt-4">
                {/* 관계 조언 */}
                {ilganRelation && (
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h5 className="font-semibold mb-2">관계 조언</h5>
                    <p className="text-sm">{ilganRelation.advice}</p>
                  </div>
                )}

                {/* 특별 조합 상세 */}
                {isSpecialMatch && matchInfo && (
                  <>
                    {/* 강점 */}
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-700 mb-2">강점</h5>
                      <ul className="space-y-1">
                        {matchInfo.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                            <span>+</span><span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 주의점 */}
                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold text-orange-700 mb-2">주의할 점</h5>
                      <ul className="space-y-1">
                        {matchInfo.challenges.map((c, i) => (
                          <li key={i} className="text-sm text-orange-800 flex items-start gap-2">
                            <span>!</span><span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 맞춤 조언 */}
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-semibold mb-2">맞춤 조언</h5>
                      <p className="text-sm">{matchInfo.advice}</p>
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

  if (!person1Result || !person2Result || !compatibility) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">커플 궁합 분석</h1>
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
          <Button variant="outline" onClick={() => router.push("/")}>
            새로 분석하기
          </Button>
          <DonationInfoButton />
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>※ 본 결과는 참고용이며, 실제 관계는 서로의 노력에 따라 달라집니다.</p>
        </footer>
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
