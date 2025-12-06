/**
 * 제2장: 기본 궁합 점수
 * 총점, 등급, 종합 평가
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter2Result } from "@/types/expert-couple";

// 일간 궁합 점수 테이블
const ILGAN_SCORES: Record<string, Record<string, number>> = {
  갑: { 갑: 60, 을: 70, 병: 85, 정: 80, 무: 75, 기: 90, 경: 50, 신: 55, 임: 80, 계: 85 },
  을: { 갑: 70, 을: 60, 병: 80, 정: 85, 무: 90, 기: 75, 경: 55, 신: 50, 임: 85, 계: 80 },
  병: { 갑: 85, 을: 80, 병: 60, 정: 70, 무: 85, 기: 80, 경: 75, 신: 90, 임: 50, 계: 55 },
  정: { 갑: 80, 을: 85, 병: 70, 정: 60, 무: 80, 기: 85, 경: 90, 신: 75, 임: 55, 계: 50 },
  무: { 갑: 50, 을: 55, 병: 80, 정: 85, 무: 60, 기: 70, 경: 85, 신: 80, 임: 75, 계: 90 },
  기: { 갑: 55, 을: 50, 병: 85, 정: 80, 무: 70, 기: 60, 경: 80, 신: 85, 임: 90, 계: 75 },
  경: { 갑: 75, 을: 90, 병: 50, 정: 55, 무: 80, 기: 85, 경: 60, 신: 70, 임: 85, 계: 80 },
  신: { 갑: 90, 을: 75, 병: 55, 정: 50, 무: 85, 기: 80, 경: 70, 신: 60, 임: 80, 계: 85 },
  임: { 갑: 85, 을: 80, 병: 75, 정: 90, 무: 50, 기: 55, 경: 80, 신: 85, 임: 60, 계: 70 },
  계: { 갑: 80, 을: 85, 병: 90, 정: 75, 무: 55, 기: 50, 경: 85, 신: 80, 임: 70, 계: 60 },
};

// 지지 육합
const JIJI_YUKAP: Record<string, string> = {
  자: "축", 축: "자", 인: "해", 해: "인",
  묘: "술", 술: "묘", 진: "유", 유: "진",
  사: "신", 신: "사", 오: "미", 미: "오",
};

// 지지 충
const JIJI_CHUNG: Record<string, string> = {
  자: "오", 오: "자", 축: "미", 미: "축",
  인: "신", 신: "인", 묘: "유", 유: "묘",
  진: "술", 술: "진", 사: "해", 해: "사",
};

// 지지 형
const JIJI_HYUNG: Record<string, string[]> = {
  인: ["사", "신"], 사: ["인", "신"], 신: ["인", "사"],
  축: ["술", "미"], 술: ["축", "미"], 미: ["축", "술"],
  자: ["묘"], 묘: ["자"],
};

// 지지 해
const JIJI_HAE: Record<string, string> = {
  자: "미", 미: "자", 축: "오", 오: "축",
  인: "사", 사: "인", 묘: "진", 진: "묘",
  신: "해", 해: "신", 유: "술", 술: "유",
};

/**
 * 등급 계산
 */
function getGrade(score: number): { grade: CoupleChapter2Result["grade"]; description: string } {
  if (score >= 85) return { grade: "천생연분", description: "매우 좋은 궁합입니다. 자연스럽게 서로를 이해하고 보완합니다." };
  if (score >= 75) return { grade: "좋은 인연", description: "좋은 궁합입니다. 노력하면 더 좋아질 수 있습니다." };
  if (score >= 65) return { grade: "보통 인연", description: "평범한 궁합입니다. 서로 이해하려는 노력이 필요합니다." };
  if (score >= 55) return { grade: "노력 필요", description: "쉽지 않은 궁합입니다. 갈등을 조절하는 지혜가 필요합니다." };
  return { grade: "주의 필요", description: "어려운 궁합입니다. 서로의 차이를 인정하고 존중해야 합니다." };
}

/**
 * 지지 관계 분석 및 점수 계산
 */
function analyzeJijiScore(jiji1: string[], jiji2: string[]): {
  score: number;
  yukapCount: number;
  chungCount: number;
  hyungCount: number;
  haeCount: number;
} {
  let yukapCount = 0;
  let chungCount = 0;
  let hyungCount = 0;
  let haeCount = 0;

  const processedPairs = new Set<string>();

  for (const j1 of jiji1) {
    for (const j2 of jiji2) {
      const pairKey = [j1, j2].sort().join("-");

      // 육합
      if (JIJI_YUKAP[j1] === j2 && !processedPairs.has(`yukap-${pairKey}`)) {
        processedPairs.add(`yukap-${pairKey}`);
        yukapCount++;
      }

      // 충
      if (JIJI_CHUNG[j1] === j2 && !processedPairs.has(`chung-${pairKey}`)) {
        processedPairs.add(`chung-${pairKey}`);
        chungCount++;
      }

      // 형
      if (JIJI_HYUNG[j1]?.includes(j2) && !processedPairs.has(`hyung-${pairKey}`)) {
        processedPairs.add(`hyung-${pairKey}`);
        hyungCount++;
      }

      // 해
      if (JIJI_HAE[j1] === j2 && !processedPairs.has(`hae-${pairKey}`)) {
        processedPairs.add(`hae-${pairKey}`);
        haeCount++;
      }
    }
  }

  // 점수 계산
  const score = (yukapCount * 5) - (chungCount * 8) - (hyungCount * 5) - (haeCount * 3);

  return { score, yukapCount, chungCount, hyungCount, haeCount };
}

/**
 * 오행 보완/충돌 점수 계산
 */
function analyzeOhengScore(oheng1: Record<string, number>, oheng2: Record<string, number>): number {
  const getStrong = (oheng: Record<string, number>) =>
    Object.entries(oheng).filter(([, v]) => v >= 2).map(([k]) => k);
  const getWeak = (oheng: Record<string, number>) =>
    Object.entries(oheng).filter(([, v]) => v === 0).map(([k]) => k);

  const person1Strong = getStrong(oheng1);
  const person1Weak = getWeak(oheng1);
  const person2Strong = getStrong(oheng2);
  const person2Weak = getWeak(oheng2);

  // 보완 점수
  let complementScore = 0;
  for (const weak of person1Weak) {
    if (person2Strong.includes(weak)) complementScore += 3;
  }
  for (const weak of person2Weak) {
    if (person1Strong.includes(weak)) complementScore += 3;
  }

  // 상극 관계 점수
  const SANGGEUK: Record<string, string> = {
    목: "토", 화: "금", 토: "수", 금: "목", 수: "화"
  };

  let conflictScore = 0;
  for (const s1 of person1Strong) {
    for (const s2 of person2Strong) {
      if (SANGGEUK[s1] === s2 || SANGGEUK[s2] === s1) {
        conflictScore -= 4;
      }
    }
  }

  return complementScore + conflictScore;
}

/**
 * 오행 카운트 계산
 */
function calculateOhengCount(saju: SajuApiResult): Record<string, number> {
  const count: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  const pillars = [saju.yearPillar, saju.monthPillar, saju.dayPillar];
  if (saju.timePillar.cheongan) {
    pillars.push(saju.timePillar);
  }

  for (const pillar of pillars) {
    if (pillar.cheonganOheng && pillar.cheonganOheng in count) {
      count[pillar.cheonganOheng]++;
    }
    if (pillar.jijiOheng && pillar.jijiOheng in count) {
      count[pillar.jijiOheng]++;
    }
  }

  return count;
}

/**
 * 제2장: 기본 궁합 점수 분석
 */
export function analyzeCouple2(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter2Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  // 일간 점수
  const ilganScore = ILGAN_SCORES[ilgan1]?.[ilgan2] || 60;

  // 지지 추출
  const hasTime = person1.timePillar.cheongan && person2.timePillar.cheongan;
  const jiji1 = hasTime
    ? [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji, person1.timePillar.jiji]
    : [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji];
  const jiji2 = hasTime
    ? [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji, person2.timePillar.jiji]
    : [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji];

  // 지지 점수
  const jijiResult = analyzeJijiScore(jiji1.filter(Boolean), jiji2.filter(Boolean));

  // 오행 점수
  const oheng1 = calculateOhengCount(person1);
  const oheng2 = calculateOhengCount(person2);
  const ohengScore = analyzeOhengScore(oheng1, oheng2);

  // 총점 계산
  let totalScore = ilganScore + jijiResult.score + ohengScore;
  totalScore = Math.max(30, Math.min(100, totalScore));

  const { grade, description: gradeDescription } = getGrade(totalScore);

  // 종합 평가 생성
  let overallAssessment = "";
  if (totalScore >= 85) {
    overallAssessment = `${person1Name}님과 ${person2Name}님은 사주적으로 매우 잘 맞는 인연입니다. 서로를 자연스럽게 이해하고 지지할 수 있는 조합으로, 함께하면 더 큰 시너지를 발휘할 수 있습니다.`;
  } else if (totalScore >= 75) {
    overallAssessment = `두 분은 좋은 궁합을 가지고 있습니다. 기본적인 조화가 좋으며, 서로의 장점을 잘 살려줄 수 있는 관계입니다. 함께 성장하고 발전할 수 있는 파트너십을 만들어갈 수 있습니다.`;
  } else if (totalScore >= 65) {
    overallAssessment = `두 분의 궁합은 평범한 편입니다. 좋은 점도 있고 주의할 점도 있는 균형 잡힌 관계입니다. 서로를 이해하려는 꾸준한 노력이 있다면 더 좋은 관계로 발전할 수 있습니다.`;
  } else if (totalScore >= 55) {
    overallAssessment = `두 분의 관계는 노력이 필요한 궁합입니다. 성격이나 가치관의 차이로 인해 갈등이 발생할 수 있습니다. 하지만 이를 극복했을 때 더 깊은 유대감을 느낄 수 있습니다.`;
  } else {
    overallAssessment = `두 분의 궁합에는 도전적인 요소가 많습니다. 근본적인 성향 차이로 인해 갈등이 자주 발생할 수 있습니다. 서로에 대한 깊은 이해와 존중이 필요합니다.`;
  }

  return {
    totalScore,
    grade,
    gradeDescription,
    scoreBreakdown: {
      ilganScore,
      jijiScore: jijiResult.score,
      ohengScore,
    },
    overallAssessment,
    narrative: {
      intro: `두 분의 궁합을 종합적으로 분석한 결과를 말씀드리겠습니다.`,
      mainAnalysis: `${person1Name}님과 ${person2Name}님의 종합 궁합 점수는 ${totalScore}점으로, "${grade}" 등급입니다. ${gradeDescription}`,
      details: [
        `일간 궁합 점수: ${ilganScore}점 (${ilgan1}과 ${ilgan2}의 관계)`,
        `지지 관계 점수: ${jijiResult.score >= 0 ? "+" : ""}${jijiResult.score}점 (육합 ${jijiResult.yukapCount}개, 충 ${jijiResult.chungCount}개, 형 ${jijiResult.hyungCount}개, 해 ${jijiResult.haeCount}개)`,
        `오행 보완/충돌 점수: ${ohengScore >= 0 ? "+" : ""}${ohengScore}점`,
      ],
      advice: overallAssessment,
      closing: `다음 장에서는 두 분의 일간 관계를 더 깊이 분석해보겠습니다.`,
    },
  };
}
