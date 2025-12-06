/**
 * 제10장: 연애/결혼 시기
 * 대운 기반 관계 운세 및 최적 결혼 시기 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter10Result } from "@/types/expert-couple";

// 천간 오행
const CHEONGAN_OHENG: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};

// 일간별 관계운 좋은 오행
const ILGAN_GOOD_ELEMENTS: Record<string, string[]> = {
  갑: ["수", "화"], // 인성(수)과 식상(화)
  을: ["수", "화"],
  병: ["목", "토"],
  정: ["목", "토"],
  무: ["화", "금"],
  기: ["화", "금"],
  경: ["토", "수"],
  신: ["토", "수"],
  임: ["금", "목"],
  계: ["금", "목"],
};

// 현재 연도 기준으로 가까운 년도들의 운세 계산
function calculateYearlyFortune(ilgan: string, currentYear: number): {
  goodYears: number[];
  challengingYears: number[];
} {
  const goodYears: number[] = [];
  const challengingYears: number[] = [];
  const goodElements = ILGAN_GOOD_ELEMENTS[ilgan] || [];

  // 년도별 천간
  const yearGans = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];

  for (let year = currentYear; year <= currentYear + 10; year++) {
    const ganIndex = (year - 4) % 10;
    const yearGan = yearGans[ganIndex];
    const yearElement = CHEONGAN_OHENG[yearGan];

    if (goodElements.includes(yearElement)) {
      goodYears.push(year);
    } else {
      // 상극 관계면 도전적인 해
      const challengeElements = getChallengingElements(ilgan);
      if (challengeElements.includes(yearElement)) {
        challengingYears.push(year);
      }
    }
  }

  return { goodYears: goodYears.slice(0, 3), challengingYears: challengingYears.slice(0, 3) };
}

// 도전적인 오행 (상극)
function getChallengingElements(ilgan: string): string[] {
  const element = CHEONGAN_OHENG[ilgan];
  const challenges: Record<string, string[]> = {
    목: ["금"],
    화: ["수"],
    토: ["목"],
    금: ["화"],
    수: ["토"],
  };
  return challenges[element] || [];
}

// 공통 좋은 시기 분석
function analyzeSharedGoodPeriods(
  person1Years: number[],
  person2Years: number[]
): CoupleChapter10Result["sharedGoodPeriods"] {
  const sharedGood: CoupleChapter10Result["sharedGoodPeriods"] = [];

  for (const year of person1Years) {
    if (person2Years.includes(year)) {
      sharedGood.push({
        year,
        reason: "두 분 모두에게 관계운이 좋은 해입니다.",
        recommendation: "이 시기에 중요한 결정을 하거나 함께하는 시간을 늘려보세요.",
      });
    }
  }

  if (sharedGood.length === 0 && person1Years.length > 0) {
    sharedGood.push({
      year: person1Years[0],
      reason: "한 분에게 특히 좋은 시기입니다.",
      recommendation: "상대방을 더 배려하고 지지해주는 시간으로 활용하세요.",
    });
  }

  return sharedGood.slice(0, 3);
}

// 공통 도전 시기 분석
function analyzeSharedChallengingPeriods(
  person1Challenges: number[],
  person2Challenges: number[]
): CoupleChapter10Result["sharedChallengingPeriods"] {
  const sharedChallenges: CoupleChapter10Result["sharedChallengingPeriods"] = [];

  for (const year of person1Challenges) {
    if (person2Challenges.includes(year)) {
      sharedChallenges.push({
        year,
        reason: "두 분 모두에게 도전이 될 수 있는 시기입니다.",
        advice: "서로에게 더 많이 의지하고, 큰 결정은 신중하게 하세요.",
      });
    }
  }

  return sharedChallenges.slice(0, 2);
}

// 최적 결혼 시기 계산
function calculateOptimalMarriageYears(
  person1Good: number[],
  person2Good: number[],
  currentYear: number
): number[] {
  const optimal: number[] = [];

  // 둘 다 좋은 해
  for (const year of person1Good) {
    if (person2Good.includes(year)) {
      optimal.push(year);
    }
  }

  // 없으면 한 명이라도 좋은 해
  if (optimal.length === 0) {
    const allGood = [...new Set([...person1Good, ...person2Good])].sort();
    optimal.push(...allGood.slice(0, 2));
  }

  return optimal.filter(y => y >= currentYear).slice(0, 3);
}

// 피해야 할 결혼 시기 계산
function calculateAvoidMarriageYears(
  person1Challenges: number[],
  person2Challenges: number[],
  currentYear: number
): number[] {
  const avoid: number[] = [];

  // 둘 다 도전적인 해
  for (const year of person1Challenges) {
    if (person2Challenges.includes(year)) {
      avoid.push(year);
    }
  }

  return avoid.filter(y => y >= currentYear).slice(0, 2);
}

// 현재 대운 간략 분석
function getCurrentDaeunAnalysis(ilgan: string): string {
  // 실제로는 생년월일 기반 대운 계산 필요
  // 여기서는 일간 기반 일반적인 설명 제공
  const descriptions: Record<string, string> = {
    갑: "현재 성장과 발전의 기운이 함께합니다. 새로운 시작에 좋은 시기예요.",
    을: "유연하게 적응하며 기회를 잡을 수 있는 시기입니다.",
    병: "열정이 넘치는 시기입니다. 적극적으로 표현해보세요.",
    정: "내면의 성장에 집중하기 좋은 시기입니다.",
    무: "안정을 다지며 기반을 만들기 좋은 시기예요.",
    기: "차근차근 계획을 실행하기 좋은 때입니다.",
    경: "결실을 거두기 좋은 시기입니다. 목표를 향해 나아가세요.",
    신: "정교하게 다듬어가는 시기입니다. 디테일에 신경 쓰세요.",
    임: "새로운 흐름을 받아들이기 좋은 시기예요.",
    계: "내면의 지혜가 깊어지는 시기입니다.",
  };
  return descriptions[ilgan] || "변화와 성장의 시기입니다.";
}

// 관계운 분석
function getRelationshipFortune(ilgan: string): string {
  const fortunes: Record<string, string> = {
    갑: "새로운 만남이나 관계 발전에 좋은 기운이 있습니다.",
    을: "기존 관계를 더 깊게 만들어가기 좋은 시기예요.",
    병: "열정적인 사랑을 경험할 수 있는 시기입니다.",
    정: "따뜻하고 안정적인 관계를 만들어갈 수 있어요.",
    무: "신뢰를 쌓고 기반을 다지기 좋은 시기입니다.",
    기: "서로를 더 잘 이해하게 되는 시기예요.",
    경: "진지한 결정을 내리기에 좋은 시기입니다.",
    신: "세심하게 배려하며 관계를 가꿀 수 있어요.",
    임: "자유롭고 편안한 관계를 즐길 수 있는 시기입니다.",
    계: "감성적으로 깊이 연결될 수 있는 시기예요.",
  };
  return fortunes[ilgan] || "관계에 긍정적인 변화가 있을 수 있습니다.";
}

/**
 * 제10장: 연애/결혼 시기 분석
 */
export function analyzeCouple10(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter10Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;
  const currentYear = new Date().getFullYear();

  const person1Fortune = calculateYearlyFortune(ilgan1, currentYear);
  const person2Fortune = calculateYearlyFortune(ilgan2, currentYear);

  const sharedGoodPeriods = analyzeSharedGoodPeriods(person1Fortune.goodYears, person2Fortune.goodYears);
  const sharedChallengingPeriods = analyzeSharedChallengingPeriods(person1Fortune.challengingYears, person2Fortune.challengingYears);
  const optimalMarriageYears = calculateOptimalMarriageYears(person1Fortune.goodYears, person2Fortune.goodYears, currentYear);
  const avoidMarriageYears = calculateAvoidMarriageYears(person1Fortune.challengingYears, person2Fortune.challengingYears, currentYear);

  return {
    person1Timeline: {
      currentDaeun: getCurrentDaeunAnalysis(ilgan1),
      relationshipFortune: getRelationshipFortune(ilgan1),
      goodYears: person1Fortune.goodYears,
      challengingYears: person1Fortune.challengingYears,
    },
    person2Timeline: {
      currentDaeun: getCurrentDaeunAnalysis(ilgan2),
      relationshipFortune: getRelationshipFortune(ilgan2),
      goodYears: person2Fortune.goodYears,
      challengingYears: person2Fortune.challengingYears,
    },
    sharedGoodPeriods,
    sharedChallengingPeriods,
    optimalMarriageYears,
    avoidMarriageYears,
    narrative: {
      intro: "이번 장에서는 두 분의 연애/결혼 시기를 분석합니다.",
      mainAnalysis: optimalMarriageYears.length > 0
        ? `두 분에게 좋은 결혼 시기는 ${optimalMarriageYears.join(", ")}년입니다.`
        : "향후 10년 내 다양한 시기에 좋은 기회가 있습니다.",
      details: [
        `${person1Name}님의 좋은 해: ${person1Fortune.goodYears.join(", ")}년`,
        `${person2Name}님의 좋은 해: ${person2Fortune.goodYears.join(", ")}년`,
      ],
      advice: "사주의 시기는 참고 사항일 뿐입니다. 두 분의 마음이 맞을 때가 가장 좋은 때예요.",
      closing: "다음 장에서는 재물 궁합을 살펴보겠습니다.",
    },
  };
}
