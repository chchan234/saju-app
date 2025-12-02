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
import { ChevronDown, ChevronUp, Sparkles, Mountain, Flame, Droplets, Coins, TreeDeciduous } from "lucide-react";
import type { SajuApiResult, Pillar, OhengCount } from "@/types/saju";
import type { IlganTraits, OhengAdvice } from "@/lib/saju-traits";
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

interface SajuResultProps {
  result: SajuApiResult & {
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

// 오행 색상
const OHENG_COLORS: Record<string, string> = {
  목: "bg-green-500",
  화: "bg-red-500",
  토: "bg-yellow-600",
  금: "bg-gray-400",
  수: "bg-blue-500",
};

// 오행 텍스트 색상
const OHENG_TEXT_COLORS: Record<string, string> = {
  목: "text-green-600",
  화: "text-red-600",
  토: "text-yellow-700",
  금: "text-gray-600",
  수: "text-blue-600",
};

// 오행 아이콘
const OHENG_ICONS: Record<string, React.ReactNode> = {
  목: <TreeDeciduous className="w-4 h-4" />,
  화: <Flame className="w-4 h-4" />,
  토: <Mountain className="w-4 h-4" />,
  금: <Coins className="w-4 h-4" />,
  수: <Droplets className="w-4 h-4" />,
};

// 기둥 컴포넌트
function PillarCard({ pillar, label }: { pillar: Pillar; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex flex-col items-center border rounded-lg p-3 min-w-[80px] bg-card">
        {/* 천간 */}
        <div className="flex flex-col items-center mb-2">
          <span className={`text-2xl font-bold ${OHENG_TEXT_COLORS[pillar.cheonganOheng]}`}>
            {pillar.cheongan}
          </span>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline" className={`text-xs ${OHENG_TEXT_COLORS[pillar.cheonganOheng]}`}>
              {pillar.cheonganOheng}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {pillar.cheonganYinyang}
            </Badge>
          </div>
          {pillar.cheonganSipsin && (
            <span className="text-xs text-muted-foreground mt-1">{pillar.cheonganSipsin}</span>
          )}
        </div>

        <div className="w-full h-px bg-border my-2" />

        {/* 지지 */}
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-bold ${OHENG_TEXT_COLORS[pillar.jijiOheng]}`}>
            {pillar.jiji}
          </span>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline" className={`text-xs ${OHENG_TEXT_COLORS[pillar.jijiOheng]}`}>
              {pillar.jijiOheng}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {pillar.jijiYinyang}
            </Badge>
          </div>
          {pillar.jijiSipsin && (
            <span className="text-xs text-muted-foreground mt-1">{pillar.jijiSipsin}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// 오행 차트 컴포넌트
function OhengChart({ ohengCount }: { ohengCount: OhengCount }) {
  const total = Object.values(ohengCount).reduce((a, b) => a + b, 0);
  const maxCount = Math.max(...Object.values(ohengCount));

  return (
    <div className="space-y-3">
      {(Object.entries(ohengCount) as [keyof OhengCount, number][]).map(([element, count]) => (
        <div key={element} className="flex items-center gap-3">
          <span className={`w-8 text-lg font-bold ${OHENG_TEXT_COLORS[element]}`}>{element}</span>
          <div className="flex-1 bg-secondary rounded-full h-6 overflow-hidden">
            <div
              className={`h-full ${OHENG_COLORS[element]} transition-all duration-500`}
              style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
            />
          </div>
          <span className="w-8 text-center font-mono">{count}</span>
          <span className="w-12 text-sm text-muted-foreground">
            ({total > 0 ? Math.round((count / total) * 100) : 0}%)
          </span>
        </div>
      ))}
    </div>
  );
}

// 스토리 도입부 컴포넌트
function StoryIntroCard({ ilju, dominantOheng, name }: { ilju: string; dominantOheng: string; name?: string }) {
  const symbol = ILJU_SYMBOLS[ilju];
  const storyIntro = generateStoryIntro(ilju, dominantOheng, symbol);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <p className="text-muted-foreground italic">{storyIntro.seasonGreeting}</p>
            {name && (
              <p className="font-medium text-lg">
                {name}님, {storyIntro.characterSummary}
              </p>
            )}
            {!name && (
              <p className="font-medium text-lg">{storyIntro.characterSummary}</p>
            )}
            <p className="text-sm text-muted-foreground">
              당신의 인생 주제: <span className="text-foreground font-medium">{storyIntro.lifeTheme}</span>
            </p>
            <p className="text-sm text-primary font-medium">{storyIntro.closingRemark}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 일주 상징 카드 컴포넌트
function IljuSymbolCard({ ilju, symbol }: { ilju: string; symbol: IljuSymbol }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{symbol.hanja}</span>
          일주 - &quot;{symbol.nickname}&quot;
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border-l-4 border-primary">
            <p className="text-lg font-medium mb-2">🎋 {symbol.symbol}</p>
            <p className="text-muted-foreground">{symbol.essence}</p>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span>상세 성향 보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">성격 특성</h4>
                <p className="text-sm text-muted-foreground">{symbol.personality}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">인생 주제</h4>
                <p className="text-sm">{symbol.lifeTheme}</p>
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
    <Card>
      <CardHeader>
        <CardTitle>사주 기둥별 영역</CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mb-4">
              <span className="text-sm text-muted-foreground">각 기둥이 담당하는 인생 영역을 확인하세요</span>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            {pillars.map((pillarName) => {
              const pillar = PILLAR_MEANINGS[pillarName];
              if (!pillar) return null;
              return (
                <div key={pillarName} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">{pillar.name}</span>
                    <span className="text-sm text-muted-foreground">({pillar.hanja})</span>
                    <Badge variant="outline">{pillar.ageRange}</Badge>
                  </div>
                  <p className="text-sm font-medium text-primary mb-2">{pillar.lifeArea}</p>
                  <p className="text-sm text-muted-foreground mb-2">{pillar.characteristics}</p>
                  <div className="flex flex-wrap gap-1">
                    {pillar.represents.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                    ))}
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

// 오행 보완법 상세 카드
function OhengBoosterDetailCard({ yongsin }: { yongsin: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const booster = OHENG_BOOSTERS[yongsin];

  if (!booster) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={OHENG_TEXT_COLORS[yongsin]}>{OHENG_ICONS[yongsin]}</span>
          {yongsin}({booster.hanja}) 기운 보완법
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-muted rounded-lg text-center">
              <span className="text-xs text-muted-foreground block">방향</span>
              <span className="font-medium">{booster.direction}</span>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <span className="text-xs text-muted-foreground block">계절</span>
              <span className="font-medium">{booster.season}</span>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <span className="text-xs text-muted-foreground block">행운 숫자</span>
              <span className="font-medium">{booster.numbers.join(", ")}</span>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <span className="text-xs text-muted-foreground block">추천 색상</span>
              <span className="font-medium">{booster.color[0]}</span>
            </div>
          </div>

          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span>상세 보완법 보기</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* 색상 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 색상</h4>
                <div className="flex flex-wrap gap-2">
                  {booster.color.map((c) => (
                    <Badge key={c} variant="outline">{c}</Badge>
                  ))}
                </div>
              </div>

              {/* 음식 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 음식</h4>
                <div className="flex flex-wrap gap-2">
                  {booster.foods.map((f) => (
                    <Badge key={f} variant="secondary">{f}</Badge>
                  ))}
                </div>
              </div>

              {/* 활동 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 활동</h4>
                <div className="flex flex-wrap gap-2">
                  {booster.activities.map((a) => (
                    <Badge key={a} variant="outline">{a}</Badge>
                  ))}
                </div>
              </div>

              {/* 직업/분야 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 직업/분야</h4>
                <div className="flex flex-wrap gap-2">
                  {booster.careers.map((c) => (
                    <Badge key={c} variant="secondary">{c}</Badge>
                  ))}
                </div>
              </div>

              {/* 소품 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 소품</h4>
                <div className="flex flex-wrap gap-2">
                  {booster.items.map((i) => (
                    <Badge key={i} variant="outline">{i}</Badge>
                  ))}
                </div>
              </div>

              {/* 공간 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 공간</h4>
                <div className="flex flex-wrap gap-2">
                  {booster.spaces.map((s) => (
                    <Badge key={s} variant="secondary">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* 일상 습관 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">일상 습관</h4>
                <ul className="space-y-1">
                  {booster.habits.map((h) => (
                    <li key={h} className="text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 마음가짐 */}
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-medium mb-2">마음가짐</h4>
                <p className="text-sm">{booster.mindset}</p>
              </div>

              {/* 주의사항 */}
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                <h4 className="font-medium mb-2 text-orange-700 dark:text-orange-400">과잉 시 주의</h4>
                <p className="text-sm text-orange-600 dark:text-orange-300">{booster.warning}</p>
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
        <CardTitle>천간 관계 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 요약 */}
          <div className="flex flex-wrap gap-2">
            {hapPairs.length > 0 && (
              <Badge className="bg-blue-500">합(合) {hapPairs.length}개</Badge>
            )}
            {chungPairs.length > 0 && (
              <Badge className="bg-orange-500">충(沖) {chungPairs.length}개</Badge>
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
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">💡 {hap.advice}</p>
                </div>
              ))}

              {/* 충 */}
              {chungPairs.map(({ chung, pair }) => (
                <div key={pair.join("")} className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-orange-500">{chung.name}</Badge>
                    <span className="text-sm text-muted-foreground">{chung.hanja}</span>
                  </div>
                  <p className="text-sm font-medium mb-2">{chung.meaning}</p>
                  <p className="text-sm text-muted-foreground mb-2">{chung.characteristics}</p>
                  <div className="p-3 bg-white dark:bg-background rounded border mt-2">
                    <p className="text-sm"><span className="font-medium">관계에서:</span> {chung.inRelationship}</p>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">💡 {chung.resolution}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

export function SajuResult({ result, name, timeUnknown = false }: SajuResultProps) {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount, yongsin, birthInfo, meta } = result;

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

  // 기둥 배열
  const pillars = timeUnknown
    ? [yearPillar, monthPillar, dayPillar]
    : [yearPillar, monthPillar, dayPillar, timePillar];

  return (
    <div className="space-y-6">
      {/* 스토리텔링 도입부 */}
      <StoryIntroCard ilju={ilju} dominantOheng={dominantOheng} name={name} />

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {name && <span>{name}님의</span>}
            사주팔자
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">양력: </span>
              <span className="font-medium">
                {birthInfo.solarYear}년 {birthInfo.solarMonth}월 {birthInfo.solarDay}일
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">음력: </span>
              <span className="font-medium">
                {birthInfo.lunarYear}년 {birthInfo.lunarMonth}월 {birthInfo.lunarDay}일
                {birthInfo.isLeapMonth && " (윤달)"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">시간: </span>
              <span className="font-medium">
                {timeUnknown ? "모름" : `${String(birthInfo.hour).padStart(2, "0")}:${String(birthInfo.minute).padStart(2, "0")}`}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">요일: </span>
              <span className="font-medium">{meta.weekday?.trim()}요일</span>
            </div>
          </div>

          {/* 띠 정보 */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">띠:</span>
              <Badge variant="default" className="text-sm">
                {meta.ddiLunar}띠
              </Badge>
              <span className="text-xs text-muted-foreground">(음력 기준)</span>
            </div>
            {meta.ddi !== meta.ddiLunar && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">사주 띠:</span>
                <Badge variant="outline" className="text-sm">
                  {meta.ddi}띠
                </Badge>
                <span className="text-xs text-muted-foreground">(입춘 기준)</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 사주 기둥 */}
      <Card>
        <CardHeader>
          <CardTitle>{timeUnknown ? "삼주 (三柱)" : "사주 (四柱)"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 md:gap-8 overflow-x-auto py-2">
            {!timeUnknown && <PillarCard pillar={timePillar} label="시주" />}
            <PillarCard pillar={dayPillar} label="일주" />
            <PillarCard pillar={monthPillar} label="월주" />
            <PillarCard pillar={yearPillar} label="년주" />
          </div>
          {timeUnknown && (
            <p className="text-center text-sm text-orange-600 mt-4">
              태어난 시간을 모르면 시주를 알 수 없어 삼주(三柱)로 분석합니다.
            </p>
          )}
          <p className="text-center text-sm text-muted-foreground mt-4">
            일간(日干): <span className={`font-bold ${OHENG_TEXT_COLORS[dayPillar.cheonganOheng]}`}>
              {dayPillar.cheongan}({dayPillar.cheonganOheng})
            </span>
            {" "}기준으로 십신을 계산합니다
          </p>
        </CardContent>
      </Card>

      {/* 일주 상징/별명 */}
      {iljuSymbol && <IljuSymbolCard ilju={ilju} symbol={iljuSymbol} />}

      {/* 사주 기둥별 영역 설명 */}
      <PillarMeaningsCard timeUnknown={timeUnknown} />

      {/* 천간 관계 분석 (합/충) */}
      <CheonganRelationsCard pillars={pillars} />

      {/* 오행 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>오행 분석 (五行)</CardTitle>
        </CardHeader>
        <CardContent>
          {timeUnknown && (
            <p className="text-sm text-orange-600 mb-4 p-3 bg-orange-50 rounded-lg">
              시간을 모르면 시주가 제외되어 6글자 기준으로 분석됩니다. 정확한 분석을 위해 태어난 시간을 확인해보세요.
            </p>
          )}
          <OhengChart ohengCount={ohengCount} />

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">분석 결과</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">가장 많은 오행:</span>
                {maxOhengList.map(([element, count]) => (
                  <Badge key={element} className={OHENG_COLORS[element]}>
                    {element} ({count}개)
                  </Badge>
                ))}
              </li>
              <li className="flex items-center gap-2 flex-wrap">
                <span className="text-muted-foreground">가장 적은 오행:</span>
                {minOhengList.map(([element, count]) => (
                  <Badge key={element} variant="outline" className={OHENG_TEXT_COLORS[element]}>
                    {element} ({count}개)
                  </Badge>
                ))}
                {minCount === 0 && <span className="text-destructive text-xs">(보충 필요)</span>}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-muted-foreground">보충 추천:</span>
                <Badge className={OHENG_COLORS[yongsin]}>{yongsin}</Badge>
                <span className="text-xs text-muted-foreground">
                  ({minCount === 0 ? "없는 오행" : "가장 적은 오행"})
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 보충 오행 상세 보완법 */}
      <OhengBoosterDetailCard yongsin={yongsin} />

      {/* 일간 성향 분석 */}
      {result.analysis?.ilganTraits && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${OHENG_TEXT_COLORS[result.analysis.ilganTraits.oheng]}`}>
                {result.analysis.ilganTraits.hanja}
              </span>
              일간 성향 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 핵심 요약 */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="default" className={OHENG_COLORS[result.analysis.ilganTraits.oheng]}>
                    {result.analysis.ilganTraits.oheng}({result.analysis.ilganTraits.yinyang})
                  </Badge>
                  <span className="font-medium text-lg">{result.analysis.ilganTraits.type}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.analysis.ilganTraits.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline">{keyword}</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.analysis.ilganTraits.symbol}
                </p>
              </div>

              {/* 강점과 약점 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 text-green-600">강점</h4>
                  <ul className="space-y-1 text-sm">
                    {result.analysis.ilganTraits.strengths.map((strength) => (
                      <li key={strength} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 text-orange-600">주의점</h4>
                  <ul className="space-y-1 text-sm">
                    {result.analysis.ilganTraits.weaknesses.map((weakness) => (
                      <li key={weakness} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 상세 성향 */}
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">성격</h4>
                  <p className="text-sm text-muted-foreground">{result.analysis.ilganTraits.personality}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">의사결정 스타일</h4>
                  <p className="text-sm text-muted-foreground">{result.analysis.ilganTraits.decisionStyle}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">대인관계</h4>
                  <p className="text-sm text-muted-foreground">{result.analysis.ilganTraits.relationStyle}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">업무 스타일</h4>
                  <p className="text-sm text-muted-foreground">{result.analysis.ilganTraits.workStyle}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">연애 스타일</h4>
                  <p className="text-sm text-muted-foreground">{result.analysis.ilganTraits.loveStyle}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">스트레스 패턴</h4>
                  <p className="text-sm text-muted-foreground">{result.analysis.ilganTraits.stressPattern}</p>
                </div>
              </div>

              {/* 조언 */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-medium mb-2">발전을 위한 조언</h4>
                <p className="text-sm">{result.analysis.ilganTraits.advice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 보충 오행 생활 조언 */}
      {result.analysis?.yongsinAdvice && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              보충 오행 생활 조언
              <Badge className={`${OHENG_COLORS[result.analysis.yongsinAdvice.name]} text-white`}>
                {result.analysis.yongsinAdvice.name}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                {result.analysis.yongsinAdvice.description}
              </p>

              {/* 보완 방법 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">추천 색상</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.yongsinAdvice.colors.map((color) => (
                      <Badge key={color} variant="outline">{color}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">추천 방향</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.yongsinAdvice.directions.map((dir) => (
                      <Badge key={dir} variant="outline">{dir}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 직업/분야</h4>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.yongsinAdvice.careers.map((career) => (
                    <Badge key={career} variant="secondary">{career}</Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">일상 습관 추천</h4>
                <ul className="space-y-2 text-sm">
                  {result.analysis.yongsinAdvice.habits.map((habit) => (
                    <li key={habit} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 mt-2 bg-primary rounded-full flex-shrink-0" />
                      {habit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">건강 관리</h4>
                <p className="text-sm text-muted-foreground">{result.analysis.yongsinAdvice.health}</p>
              </div>

              {/* 계절/숫자 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <span className="text-sm text-muted-foreground">좋은 계절</span>
                  <p className="font-medium mt-1">{result.analysis.yongsinAdvice.seasons}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <span className="text-sm text-muted-foreground">행운의 숫자</span>
                  <p className="font-medium mt-1">{result.analysis.yongsinAdvice.numbers.join(", ")}</p>
                </div>
              </div>

              {/* 추천 음식 */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">추천 음식</h4>
                <div className="flex flex-wrap gap-2">
                  {result.analysis.yongsinAdvice.food.map((item) => (
                    <Badge key={item} variant="outline">{item}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 오행 균형 분석 */}
      {result.analysis?.ohengBalance && (
        <Card>
          <CardHeader>
            <CardTitle>오행 균형 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.analysis.ohengBalance.strong.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-600">강한 오행</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.ohengBalance.strong.map((e) => (
                        <Badge key={e} className={OHENG_COLORS[e]}>{e}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.analysis.ohengBalance.weak.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-orange-600">약한 오행</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.ohengBalance.weak.map((e) => (
                        <Badge key={e} variant="outline" className={OHENG_TEXT_COLORS[e]}>{e}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.analysis.ohengBalance.missing.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-red-600">없는 오행</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.ohengBalance.missing.map((e) => (
                        <Badge key={e} variant="destructive">{e}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{result.analysis.ohengBalance.advice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
