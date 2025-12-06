/**
 * PDF 인포그래픽 컴포넌트 모음
 * A4 페이지 인쇄 최적화, 시각적 정보 표현
 */

import React from "react";
import { FIVE_ELEMENTS, HEAVENLY_STEMS, EARTHLY_BRANCHES } from "@/lib/constants";
import { FiveElement } from "@/types/saju";
import { withPostposition } from "@/lib/utils";

// ============================================
// 1. 사주팔자 도표 (Four Pillars Chart)
// ============================================

interface SajuPillar {
  name: string;
  heavenlyStem: { hanja: string; korean: string; element: FiveElement };
  earthlyBranch: { hanja: string; korean: string; element: FiveElement; animal: string };
}

interface PdfSajuChartProps {
  pillars: SajuPillar[];
  title?: string;
}

export function PdfSajuChart({ pillars, title = "사주팔자 명식" }: PdfSajuChartProps) {
  const getElementColor = (element: FiveElement) => {
    const colors: Record<FiveElement, { bg: string; text: string; border: string }> = {
      wood: { bg: "#e8f5e9", text: "#1b5e20", border: "#4caf50" },
      fire: { bg: "#ffebee", text: "#b71c1c", border: "#f44336" },
      earth: { bg: "#fff8e1", text: "#f57f17", border: "#ffc107" },
      metal: { bg: "#eceff1", text: "#37474f", border: "#90a4ae" },
      water: { bg: "#e3f2fd", text: "#0d47a1", border: "#2196f3" },
    };
    return colors[element] || colors.earth;
  };

  return (
    <div className="my-8 break-inside-avoid">
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-4">
        {title}
      </h4>
      <div className="flex justify-center gap-3">
        {pillars.map((pillar, idx) => {
          const stemColor = getElementColor(pillar.heavenlyStem.element);
          const branchColor = getElementColor(pillar.earthlyBranch.element);

          return (
            <div key={idx} className="text-center">
              {/* 주 이름 */}
              <div className="text-[#8b7355] text-sm mb-2 font-medium">
                {pillar.name}
              </div>

              {/* 천간 */}
              <div
                className="w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 mb-1"
                style={{
                  backgroundColor: stemColor.bg,
                  borderColor: stemColor.border,
                  color: stemColor.text,
                }}
              >
                <span className="text-2xl font-serif font-bold">
                  {pillar.heavenlyStem.hanja}
                </span>
                <span className="text-xs">{pillar.heavenlyStem.korean}</span>
              </div>

              {/* 지지 */}
              <div
                className="w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2"
                style={{
                  backgroundColor: branchColor.bg,
                  borderColor: branchColor.border,
                  color: branchColor.text,
                }}
              >
                <span className="text-2xl font-serif font-bold">
                  {pillar.earthlyBranch.hanja}
                </span>
                <span className="text-xs">
                  {pillar.earthlyBranch.korean}({pillar.earthlyBranch.animal})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="flex justify-center gap-4 mt-4 text-xs text-[#8b7b6f]">
        {(["wood", "fire", "earth", "metal", "water"] as FiveElement[]).map((elem) => {
          const color = getElementColor(elem);
          const koreanNames = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
          return (
            <div key={elem} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: color.bg, borderColor: color.border }}
              />
              <span>{koreanNames[elem]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 2. 오행 분포 차트 (Five Elements Distribution)
// ============================================

interface ElementDistribution {
  element: FiveElement;
  count: number;
  percentage: number;
}

interface PdfElementChartProps {
  distribution: ElementDistribution[];
  title?: string;
}

export function PdfElementChart({ distribution, title = "오행 분포" }: PdfElementChartProps) {
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  const getElementInfo = (element: FiveElement) => {
    const info: Record<FiveElement, { korean: string; hanja: string; color: string; bgColor: string }> = {
      wood: { korean: "목", hanja: "木", color: "#2e7d32", bgColor: "#c8e6c9" },
      fire: { korean: "화", hanja: "火", color: "#c62828", bgColor: "#ffcdd2" },
      earth: { korean: "토", hanja: "土", color: "#f57f17", bgColor: "#fff9c4" },
      metal: { korean: "금", hanja: "金", color: "#546e7a", bgColor: "#cfd8dc" },
      water: { korean: "수", hanja: "水", color: "#1565c0", bgColor: "#bbdefb" },
    };
    return info[element];
  };

  return (
    <div className="my-8 p-6 rounded-lg border border-[#d4c5b0] break-inside-avoid" style={{ backgroundColor: '#faf8f5' }}>
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-6">
        {title}
      </h4>

      {/* 막대 그래프 */}
      <div className="space-y-3">
        {distribution.map((item) => {
          const info = getElementInfo(item.element);
          const barWidth = (item.count / maxCount) * 100;

          return (
            <div key={item.element} className="flex items-center gap-3">
              {/* 오행 라벨 */}
              <div className="w-12 text-right">
                <span className="font-serif text-lg" style={{ color: info.color }}>
                  {info.hanja}
                </span>
                <span className="text-sm text-[#8b7b6f] ml-1">{info.korean}</span>
              </div>

              {/* 막대 */}
              <div className="flex-1 h-8 bg-[#e8e0d5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-3 transition-all"
                  style={{
                    width: `${Math.max(barWidth, 10)}%`,
                    backgroundColor: info.bgColor,
                    borderRight: `4px solid ${info.color}`,
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: info.color }}>
                    {item.count}개
                  </span>
                </div>
              </div>

              {/* 퍼센트 */}
              <div className="w-12 text-right text-sm text-[#8b7b6f]">
                {item.percentage}%
              </div>
            </div>
          );
        })}
      </div>

      {/* 요약 */}
      <div className="mt-6 pt-4 border-t border-[#d4c5b0] text-center">
        <p className="text-sm text-[#6b5b4f]">
          총 {distribution.reduce((sum, d) => sum + d.count, 0)}개의 오행 중{" "}
          <span className="font-semibold" style={{ color: getElementInfo(distribution.sort((a, b) => b.count - a.count)[0]?.element || "earth").color }}>
            {withPostposition(getElementInfo(distribution.sort((a, b) => b.count - a.count)[0]?.element || "earth").korean, "이/가")}
          </span>{" "}
          가장 많습니다
        </p>
      </div>
    </div>
  );
}

// ============================================
// 3. 음양 균형 게이지 (Yin-Yang Balance)
// ============================================

interface PdfYinYangGaugeProps {
  yinPercentage: number; // 0-100
  yangPercentage: number; // 0-100
  title?: string;
}

export function PdfYinYangGauge({ yinPercentage, yangPercentage, title = "음양 균형" }: PdfYinYangGaugeProps) {
  const getBalanceDescription = () => {
    const diff = Math.abs(yinPercentage - yangPercentage);
    if (diff <= 10) return { text: "음양이 조화롭게 균형을 이루고 있습니다.", status: "균형" };
    if (yinPercentage > yangPercentage) {
      if (diff > 30) return { text: "음의 기운이 강하게 작용하고 있습니다.", status: "음 우세" };
      return { text: "음의 기운이 약간 더 강합니다.", status: "음 우세" };
    } else {
      if (diff > 30) return { text: "양의 기운이 강하게 작용하고 있습니다.", status: "양 우세" };
      return { text: "양의 기운이 약간 더 강합니다.", status: "양 우세" };
    }
  };

  const balance = getBalanceDescription();

  return (
    <div className="my-8 p-6 rounded-lg border border-[#d4c5b0] break-inside-avoid" style={{ backgroundColor: '#faf8f5' }}>
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-6">
        {title}
      </h4>

      {/* 태극 심볼 */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          {/* 배경 원 */}
          <div className="absolute inset-0 rounded-full border-2 border-[#8b7355] overflow-hidden flex">
            <div className="w-1/2 h-full bg-[#1a237e]" />
            <div className="w-1/2 h-full bg-[#f5f5f5]" />
          </div>
          {/* 중앙 표시 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-serif text-[#8b7355]">☯</span>
          </div>
        </div>
      </div>

      {/* 막대 게이지 */}
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#1a237e] font-medium">음(陰)</span>
          <span className="text-[#b71c1c] font-medium">양(陽)</span>
        </div>

        <div className="h-6 rounded-full overflow-hidden relative" style={{ backgroundColor: '#e0e0e0' }}>
          {/* 음 영역 */}
          <div
            className="absolute left-0 top-0 h-full bg-[#1a237e]/70 rounded-l-full"
            style={{ width: `${yinPercentage}%` }}
          />
          {/* 양 영역 */}
          <div
            className="absolute right-0 top-0 h-full bg-[#b71c1c]/70 rounded-r-full"
            style={{ width: `${yangPercentage}%` }}
          />
          {/* 중앙선 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#8b7355]" />
        </div>

        <div className="flex justify-between text-lg font-semibold mt-1">
          <span className="text-[#1a237e]">{yinPercentage}%</span>
          <span className="text-[#b71c1c]">{yangPercentage}%</span>
        </div>
      </div>

      {/* 상태 설명 */}
      <div className="mt-6 text-center">
        <span className="inline-block px-4 py-1 bg-[#f5f0e8] rounded-full text-sm text-[#5d4d3d] border border-[#c4b5a0]">
          {balance.status}
        </span>
        <p className="mt-2 text-sm text-[#6b5b4f]">{balance.text}</p>
      </div>
    </div>
  );
}

// ============================================
// 4. 대운 타임라인 (Major Luck Timeline)
// ============================================

interface DaeunPeriod {
  startAge: number;
  endAge: number;
  heavenlyStem: string;
  earthlyBranch: string;
  element: FiveElement;
  description: string;
  isCurrent?: boolean;
}

interface PdfDaeunTimelineProps {
  periods: DaeunPeriod[];
  currentAge?: number;
  title?: string;
}

export function PdfDaeunTimeline({ periods, currentAge, title = "대운 흐름도" }: PdfDaeunTimelineProps) {
  const getElementColor = (element: FiveElement) => {
    const colors: Record<FiveElement, string> = {
      wood: "#4caf50",
      fire: "#f44336",
      earth: "#ff9800",
      metal: "#9e9e9e",
      water: "#2196f3",
    };
    return colors[element];
  };

  return (
    <div className="my-8 p-6 bg-[#faf8f5] rounded-lg border border-[#d4c5b0] break-inside-avoid">
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-6">
        {title}
      </h4>

      {/* 타임라인 */}
      <div className="relative">
        {/* 중앙 선 */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#c4b5a0]" />

        <div className="space-y-4">
          {periods.map((period, idx) => (
            <div key={idx} className="relative pl-16">
              {/* 노드 */}
              <div
                className="absolute left-4 w-5 h-5 rounded-full border-2 border-white"
                style={{
                  backgroundColor: getElementColor(period.element),
                  boxShadow: period.isCurrent ? "0 0 0 3px rgba(139, 115, 85, 0.3)" : "none",
                }}
              />

              {/* 내용 */}
              <div
                className={`p-3 rounded-lg border ${
                  period.isCurrent
                    ? "bg-[#f5f0e8] border-[#8b7355]"
                    : "bg-white border-[#e5ddd0]"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-lg font-serif font-bold" style={{ color: getElementColor(period.element) }}>
                    {period.heavenlyStem}{period.earthlyBranch}
                  </span>
                  <span className="text-sm text-[#8b7b6f]">
                    {period.startAge}세 ~ {period.endAge}세
                  </span>
                  {period.isCurrent && (
                    <span className="text-xs bg-[#8b7355] text-white px-2 py-0.5 rounded-full">
                      현재
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#6b5b4f]">{period.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// 5. 세운 캘린더 (Yearly Fortune Calendar)
// ============================================

interface YearlyFortune {
  year: number;
  heavenlyStem: string;
  earthlyBranch: string;
  animal: string;
  element: FiveElement;
  rating: 1 | 2 | 3 | 4 | 5; // 1: 흉, 5: 대길
  summary: string;
  isCurrent?: boolean;
}

interface PdfYearlyCalendarProps {
  years: YearlyFortune[];
  title?: string;
}

export function PdfYearlyCalendar({ years, title = "세운 전망" }: PdfYearlyCalendarProps) {
  const getRatingInfo = (rating: number) => {
    const info = [
      { label: "주의", color: "#d32f2f", bg: "#ffebee" },
      { label: "보통 이하", color: "#f57c00", bg: "#fff3e0" },
      { label: "보통", color: "#fbc02d", bg: "#fffde7" },
      { label: "좋음", color: "#689f38", bg: "#f1f8e9" },
      { label: "대길", color: "#2e7d32", bg: "#e8f5e9" },
    ];
    return info[rating - 1] || info[2];
  };

  return (
    <div className="my-8 p-6 bg-[#faf8f5] rounded-lg border border-[#d4c5b0] break-inside-avoid">
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-6">
        {title}
      </h4>

      <div className="grid grid-cols-3 gap-3">
        {years.map((year) => {
          const ratingInfo = getRatingInfo(year.rating);

          return (
            <div
              key={year.year}
              className={`p-3 rounded-lg border-2 ${
                year.isCurrent ? "ring-2 ring-[#8b7355] ring-offset-2" : ""
              }`}
              style={{
                backgroundColor: ratingInfo.bg,
                borderColor: ratingInfo.color,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-[#3d3127]">
                  {year.year}년
                </span>
                <span className="text-xl">{year.animal}</span>
              </div>

              <div className="text-center mb-2">
                <span className="text-xl font-serif">
                  {year.heavenlyStem}{year.earthlyBranch}
                </span>
              </div>

              {/* 게이지바 */}
              <div className="mb-2">
                <div className="w-full h-2 bg-[#e8e0d5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(year.rating / 5) * 100}%`,
                      backgroundColor: ratingInfo.color,
                    }}
                  />
                </div>
                <p className="text-xs text-center mt-1" style={{ color: ratingInfo.color }}>
                  {ratingInfo.label}
                </p>
              </div>

              <p className="text-xs text-center text-[#6b5b4f]">{year.summary}</p>

              {year.isCurrent && (
                <div className="mt-2 text-center">
                  <span className="text-xs bg-[#8b7355] text-white px-2 py-0.5 rounded-full">
                    올해
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 6. 건강 바디맵 (Health Body Map)
// ============================================

interface HealthArea {
  area: string;
  element: FiveElement;
  status: "good" | "caution" | "warning";
  description: string;
}

interface PdfHealthMapProps {
  areas: HealthArea[];
  title?: string;
}

export function PdfHealthMap({ areas, title = "오행별 건강 지도" }: PdfHealthMapProps) {
  const getStatusInfo = (status: HealthArea["status"]) => {
    const info = {
      good: { label: "양호", color: "#4caf50", bg: "#e8f5e9", icon: "✓" },
      caution: { label: "주의", color: "#ff9800", bg: "#fff3e0", icon: "!" },
      warning: { label: "관리 필요", color: "#f44336", bg: "#ffebee", icon: "⚠" },
    };
    return info[status];
  };

  const getElementInfo = (element: FiveElement) => {
    const info: Record<FiveElement, { korean: string; hanja: string; organs: string }> = {
      wood: { korean: "목", hanja: "木", organs: "간, 담, 눈, 근육" },
      fire: { korean: "화", hanja: "火", organs: "심장, 소장, 혀, 혈액" },
      earth: { korean: "토", hanja: "土", organs: "비장, 위, 입, 살" },
      metal: { korean: "금", hanja: "金", organs: "폐, 대장, 코, 피부" },
      water: { korean: "수", hanja: "水", organs: "신장, 방광, 귀, 뼈" },
    };
    return info[element];
  };

  return (
    <div className="my-8 p-6 bg-[#faf8f5] rounded-lg border border-[#d4c5b0] break-inside-avoid">
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-6">
        {title}
      </h4>

      {/* 상태 범례 */}
      <div className="flex justify-center gap-4 mb-6">
        {(["good", "caution", "warning"] as const).map((status) => {
          const info = getStatusInfo(status);
          return (
            <div key={status} className="flex items-center gap-1 text-sm">
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-xs text-white"
                style={{ backgroundColor: info.color }}
              >
                {info.icon}
              </span>
              <span className="text-[#6b5b4f]">{info.label}</span>
            </div>
          );
        })}
      </div>

      {/* 건강 영역 카드 */}
      <div className="space-y-3">
        {areas.map((area, idx) => {
          const statusInfo = getStatusInfo(area.status);
          const elemInfo = getElementInfo(area.element);

          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-lg border"
              style={{
                backgroundColor: statusInfo.bg,
                borderColor: statusInfo.color,
              }}
            >
              {/* 오행 표시 */}
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-serif"
                  style={{ backgroundColor: FIVE_ELEMENTS.colors[area.element] }}
                >
                  {elemInfo.hanja}
                </div>
                <span className="text-xs text-[#8b7b6f] mt-1">{elemInfo.korean}</span>
              </div>

              {/* 내용 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#3d3127]">{area.area}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-sm text-[#6b5b4f] mb-1">{area.description}</p>
                <p className="text-xs text-[#a09080]">관련 부위: {elemInfo.organs}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 7. 궁합 스코어 카드 (Compatibility Score)
// ============================================

interface CompatibilityScore {
  category: string;
  score: number; // 0-100
  description: string;
}

interface PdfCompatibilityCardProps {
  scores: CompatibilityScore[];
  overallScore: number;
  title?: string;
  partnerInfo?: string;
}

export function PdfCompatibilityCard({
  scores,
  overallScore,
  title = "궁합 분석",
  partnerInfo,
}: PdfCompatibilityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: "#2e7d32", label: "매우 좋음" };
    if (score >= 60) return { color: "#689f38", label: "좋음" };
    if (score >= 40) return { color: "#fbc02d", label: "보통" };
    if (score >= 20) return { color: "#f57c00", label: "주의" };
    return { color: "#d32f2f", label: "어려움" };
  };

  const overall = getScoreColor(overallScore);

  return (
    <div className="my-8 p-6 rounded-lg border border-[#f8bbd0] break-inside-avoid" style={{ backgroundColor: '#fce4ec' }}>
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-2">
        {title}
      </h4>
      {partnerInfo && (
        <p className="text-center text-sm text-[#8b7b6f] mb-6">{partnerInfo}</p>
      )}

      {/* 총점 원형 게이지 */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* 배경 원 */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="12"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke={overall.color}
              strokeWidth="12"
              strokeDasharray={`${(overallScore / 100) * 352} 352`}
              strokeLinecap="round"
            />
          </svg>
          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: overall.color }}>
              {overallScore}
            </span>
            <span className="text-xs text-[#8b7b6f]">{overall.label}</span>
          </div>
        </div>
      </div>

      {/* 세부 점수 */}
      <div className="space-y-3">
        {scores.map((score, idx) => {
          const info = getScoreColor(score.score);

          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#5d4d3d] font-medium">{score.category}</span>
                <span style={{ color: info.color }}>{score.score}점</span>
              </div>
              <div className="h-2 bg-[#e8e0d5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${score.score}%`,
                    backgroundColor: info.color,
                  }}
                />
              </div>
              <p className="text-xs text-[#8b7b6f] mt-1">{score.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// 8. 십성 분포 차트 (Ten Gods Distribution)
// ============================================

interface TenGodItem {
  name: string;
  count: number;
  description: string;
}

interface PdfTenGodsChartProps {
  gods: TenGodItem[];
  title?: string;
}

export function PdfTenGodsChart({ gods, title = "십성 분포" }: PdfTenGodsChartProps) {
  const maxCount = Math.max(...gods.map(g => g.count), 1);

  const getGodCategory = (name: string) => {
    const categories: Record<string, { category: string; color: string }> = {
      비견: { category: "비겁", color: "#4caf50" },
      겁재: { category: "비겁", color: "#4caf50" },
      식신: { category: "식상", color: "#ff9800" },
      상관: { category: "식상", color: "#ff9800" },
      편재: { category: "재성", color: "#ffc107" },
      정재: { category: "재성", color: "#ffc107" },
      편관: { category: "관성", color: "#2196f3" },
      정관: { category: "관성", color: "#2196f3" },
      편인: { category: "인성", color: "#9c27b0" },
      정인: { category: "인성", color: "#9c27b0" },
    };
    return categories[name] || { category: "기타", color: "#9e9e9e" };
  };

  return (
    <div className="my-8 p-6 bg-[#faf8f5] rounded-lg border border-[#d4c5b0] break-inside-avoid">
      <h4 className="text-center text-[#5d4d3d] font-serif text-lg font-semibold mb-6">
        {title}
      </h4>

      {/* 범례 */}
      <div className="flex justify-center gap-3 mb-4 text-xs">
        {[
          { label: "비겁", color: "#4caf50" },
          { label: "식상", color: "#ff9800" },
          { label: "재성", color: "#ffc107" },
          { label: "관성", color: "#2196f3" },
          { label: "인성", color: "#9c27b0" },
        ].map((cat) => (
          <div key={cat.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            <span className="text-[#6b5b4f]">{cat.label}</span>
          </div>
        ))}
      </div>

      {/* 그래프 */}
      <div className="grid grid-cols-2 gap-2">
        {gods.map((god) => {
          const { color } = getGodCategory(god.name);
          const barWidth = (god.count / maxCount) * 100;

          return (
            <div key={god.name} className="flex items-center gap-2">
              <span className="w-10 text-sm text-[#5d4d3d] font-medium">{god.name}</span>
              <div className="flex-1 h-5 bg-[#e8e0d5] rounded overflow-hidden">
                <div
                  className="h-full rounded flex items-center justify-end pr-1"
                  style={{
                    width: `${Math.max(barWidth, god.count > 0 ? 15 : 0)}%`,
                    backgroundColor: color,
                  }}
                >
                  {god.count > 0 && (
                    <span className="text-xs text-white font-medium">{god.count}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 해석 */}
      <div className="mt-4 pt-4 border-t border-[#d4c5b0] space-y-2">
        {gods.filter(g => g.count > 0).map((g) => {
          const { color } = getGodCategory(g.name);
          return (
            <div key={g.name} className="flex items-start gap-2">
              <span
                className="text-sm font-medium shrink-0 w-10"
                style={{ color }}
              >
                {g.name}
              </span>
              <p className="text-sm text-[#6b5b4f]">
                {g.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
