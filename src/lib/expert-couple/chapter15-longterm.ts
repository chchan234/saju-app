/**
 * 제15장: 장기 전망
 * 5년/10년 관계 전망 및 평생 궁합 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter15Result } from "@/types/expert-couple";

// 천간 오행
const CHEONGAN_OHENG: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};

// 상생 관계
const SANGSAENG: Record<string, string> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목",
};

// 5년 전망 생성
function generateFiveYearForecast(
  person1: SajuApiResult,
  person2: SajuApiResult
): CoupleChapter15Result["fiveYearForecast"] {
  const currentYear = new Date().getFullYear();
  const forecast: CoupleChapter15Result["fiveYearForecast"] = [];

  const ilgan1Oheng = CHEONGAN_OHENG[person1.dayPillar.cheongan];
  const ilgan2Oheng = CHEONGAN_OHENG[person2.dayPillar.cheongan];

  // 년도별 천간
  const yearGans = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];

  for (let i = 0; i < 5; i++) {
    const year = currentYear + i;
    const ganIndex = (year - 4) % 10;
    const yearGan = yearGans[ganIndex];
    const yearOheng = CHEONGAN_OHENG[yearGan];

    // 관계 점수 계산 (상생 = +10, 상극 = -10, 중립 = 0)
    let baseScore = 75;
    if (SANGSAENG[ilgan1Oheng] === yearOheng || SANGSAENG[ilgan2Oheng] === yearOheng) {
      baseScore += 10;
    }
    if (SANGSAENG[yearOheng] === ilgan1Oheng || SANGSAENG[yearOheng] === ilgan2Oheng) {
      baseScore += 5;
    }

    // 테마와 조언 생성
    let keyTheme = "";
    let advice = "";

    if (i === 0) {
      keyTheme = "기반 다지기";
      advice = "지금의 관계 패턴이 앞으로를 결정해요. 좋은 습관을 만드세요.";
    } else if (i === 1) {
      keyTheme = "성장과 조율";
      advice = "서로의 다름을 인정하고 맞춰가는 시기예요.";
    } else if (i === 2) {
      keyTheme = "안정과 도전";
      advice = "함께 새로운 목표를 세우고 도전해보세요.";
    } else if (i === 3) {
      keyTheme = "깊어지는 유대";
      advice = "더 깊은 이해와 신뢰가 쌓이는 시기예요.";
    } else {
      keyTheme = "결실과 새 시작";
      advice = "그동안의 노력이 열매를 맺고, 새로운 단계로 나아가요.";
    }

    forecast.push({
      year,
      relationshipScore: Math.min(95, Math.max(60, baseScore + Math.floor(Math.random() * 10) - 5)),
      keyTheme,
      advice,
    });
  }

  return forecast;
}

// 10년 비전 생성
function generateTenYearVision(
  ilgan1: string,
  ilgan2: string
): CoupleChapter15Result["tenYearVision"] {
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1];
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2];

  // 상생 관계면 성장, 같은 오행이면 유지, 상극이면 주의
  let overallTrend: "성장" | "유지" | "주의" = "유지";

  if (SANGSAENG[ilgan1Oheng] === ilgan2Oheng || SANGSAENG[ilgan2Oheng] === ilgan1Oheng) {
    overallTrend = "성장";
  } else if (ilgan1Oheng === ilgan2Oheng) {
    overallTrend = "유지";
  }

  const milestones: string[] = [];
  const challenges: string[] = [];
  const opportunities: string[] = [];

  // 마일스톤
  milestones.push("함께하는 의미 있는 경험들이 쌓여갑니다.");
  milestones.push("서로에 대한 이해가 깊어지고 편안해집니다.");
  if (overallTrend === "성장") {
    milestones.push("함께 성장하며 더 단단한 관계가 됩니다.");
  }

  // 도전
  if (["갑", "경"].includes(ilgan1) || ["갑", "경"].includes(ilgan2)) {
    challenges.push("주도권 갈등이 있을 수 있지만, 역할 분담으로 해결됩니다.");
  }
  if (["병", "정"].includes(ilgan1) || ["병", "정"].includes(ilgan2)) {
    challenges.push("감정 기복을 잘 관리해야 합니다.");
  }
  challenges.push("권태기를 극복하고 새로움을 찾아야 합니다.");

  // 기회
  opportunities.push("함께하는 취미나 목표가 관계를 더 단단하게 해줍니다.");
  if (SANGSAENG[ilgan1Oheng] === ilgan2Oheng) {
    opportunities.push("서로가 서로를 성장시키는 관계입니다.");
  }
  opportunities.push("위기를 함께 극복하며 더 강해질 수 있습니다.");

  return {
    overallTrend,
    milestones,
    challenges: challenges.slice(0, 3),
    opportunities: opportunities.slice(0, 3),
  };
}

// 평생 궁합 분석
function analyzeLifetimeCompatibility(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter15Result["lifetimeCompatibility"] {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1];
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2];

  // 기본 점수
  let score = 75;

  // 상생 관계
  if (SANGSAENG[ilgan1Oheng] === ilgan2Oheng || SANGSAENG[ilgan2Oheng] === ilgan1Oheng) {
    score += 10;
  }

  // 같은 오행 (비견 관계)
  if (ilgan1Oheng === ilgan2Oheng) {
    score += 5;
  }

  // 지지 육합 확인
  const jiji1 = [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji];
  const jiji2 = [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji];

  const yukap: Record<string, string> = {
    자: "축", 축: "자", 인: "해", 해: "인",
    묘: "술", 술: "묘", 진: "유", 유: "진",
    사: "신", 신: "사", 오: "미", 미: "오",
  };

  for (const j1 of jiji1) {
    for (const j2 of jiji2) {
      if (yukap[j1] === j2) {
        score += 3;
      }
    }
  }

  score = Math.min(95, Math.max(60, score));

  let analysis = "";
  let keyToSuccess = "";

  if (score >= 85) {
    analysis = `${person1Name}님과 ${person2Name}님은 사주적으로 매우 좋은 궁합입니다. 자연스럽게 서로를 이해하고 조화를 이루는 관계예요.`;
    keyToSuccess = "이 좋은 기운을 유지하려면 서로에 대한 감사함을 잊지 마세요.";
  } else if (score >= 75) {
    analysis = `두 분은 좋은 궁합을 가지고 있습니다. 약간의 노력으로 더욱 조화로운 관계를 만들 수 있어요.`;
    keyToSuccess = "서로의 다름을 인정하고, 강점을 살려주세요.";
  } else if (score >= 65) {
    analysis = `보통 수준의 궁합이지만, 노력에 따라 좋은 관계를 만들 수 있습니다.`;
    keyToSuccess = "의식적으로 소통하고, 갈등을 미루지 마세요.";
  } else {
    analysis = `사주적으로 도전이 있는 관계지만, 사랑과 노력으로 충분히 극복할 수 있습니다.`;
    keyToSuccess = "서로의 방식을 존중하고, 전문가 도움도 고려해보세요.";
  }

  return {
    score,
    analysis,
    keyToSuccess,
  };
}

/**
 * 제15장: 장기 전망 분석
 */
export function analyzeCouple15(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter15Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const fiveYearForecast = generateFiveYearForecast(person1, person2);
  const tenYearVision = generateTenYearVision(ilgan1, ilgan2);
  const lifetimeCompatibility = analyzeLifetimeCompatibility(person1, person2, person1Name, person2Name);

  return {
    fiveYearForecast,
    tenYearVision,
    lifetimeCompatibility,
    narrative: {
      intro: "이번 장에서는 두 분의 장기적인 관계 전망을 살펴봅니다.",
      mainAnalysis: `10년 전망: ${tenYearVision.overallTrend} 추세입니다. 평생 궁합 점수: ${lifetimeCompatibility.score}점`,
      details: [
        `앞으로 5년간의 평균 관계 점수: ${Math.round(fiveYearForecast.reduce((sum, f) => sum + f.relationshipScore, 0) / 5)}점`,
        ...tenYearVision.milestones.slice(0, 2),
      ],
      advice: lifetimeCompatibility.keyToSuccess,
      closing: "마지막 장에서는 종합 조언을 드리겠습니다.",
    },
  };
}
