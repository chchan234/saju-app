/**
 * 분야별 시기 운세 분석
 * 대운/연운 데이터를 활용하여 취업, 연애, 승진 등 분야별 좋은 시기 분석
 */

import type { MajorFortuneInfo } from "./saju-calculator";

// 십신 계산 (일간 기준)
const SIPSIN_MAP: Record<string, Record<string, string>> = {
  갑: { 갑: "비견", 을: "겁재", 병: "식신", 정: "상관", 무: "편재", 기: "정재", 경: "편관", 신: "정관", 임: "편인", 계: "정인" },
  을: { 갑: "겁재", 을: "비견", 병: "상관", 정: "식신", 무: "정재", 기: "편재", 경: "정관", 신: "편관", 임: "정인", 계: "편인" },
  병: { 갑: "편인", 을: "정인", 병: "비견", 정: "겁재", 무: "식신", 기: "상관", 경: "편재", 신: "정재", 임: "편관", 계: "정관" },
  정: { 갑: "정인", 을: "편인", 병: "겁재", 정: "비견", 무: "상관", 기: "식신", 경: "정재", 신: "편재", 임: "정관", 계: "편관" },
  무: { 갑: "편관", 을: "정관", 병: "편인", 정: "정인", 무: "비견", 기: "겁재", 경: "식신", 신: "상관", 임: "편재", 계: "정재" },
  기: { 갑: "정관", 을: "편관", 병: "정인", 정: "편인", 무: "겁재", 기: "비견", 경: "상관", 신: "식신", 임: "정재", 계: "편재" },
  경: { 갑: "편재", 을: "정재", 병: "편관", 정: "정관", 무: "편인", 기: "정인", 경: "비견", 신: "겁재", 임: "식신", 계: "상관" },
  신: { 갑: "정재", 을: "편재", 병: "정관", 정: "편관", 무: "정인", 기: "편인", 경: "겁재", 신: "비견", 임: "상관", 계: "식신" },
  임: { 갑: "식신", 을: "상관", 병: "편재", 정: "정재", 무: "편관", 기: "정관", 경: "편인", 신: "정인", 임: "비견", 계: "겁재" },
  계: { 갑: "상관", 을: "식신", 병: "정재", 정: "편재", 무: "정관", 기: "편관", 경: "정인", 신: "편인", 임: "겁재", 계: "비견" },
};

// 지지 본기
const JIJI_BONGI: Record<string, string> = {
  자: "계", 축: "기", 인: "갑", 묘: "을",
  진: "무", 사: "병", 오: "정", 미: "기",
  신: "경", 유: "신", 술: "무", 해: "임",
};

// 분야별 운세 타입
export type FortuneCategory = "career" | "love" | "promotion" | "wealth" | "study" | "health";

// 분야별 운세 정보
export interface CategoryFortune {
  category: FortuneCategory;
  label: string;
  emoji: string;
  periods: FortunePeriod[];
  currentStatus: "excellent" | "good" | "normal" | "caution";
  currentMessage: string;
}

// 운세 시기 정보
export interface FortunePeriod {
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  rating: 1 | 2 | 3 | 4 | 5;
  sipsin: string;
  message: string;
  isCurrent: boolean;
}

// 분야별 관련 십신
const CATEGORY_SIPSIN: Record<FortuneCategory, {
  positive: string[];
  negative: string[];
  description: string;
}> = {
  career: {
    positive: ["정관", "편관", "정인"],
    negative: ["겁재", "상관"],
    description: "취업/직장운",
  },
  love: {
    positive: ["정재", "편재", "정관", "편관"], // 남: 재성, 여: 관성
    negative: ["비견", "겁재"],
    description: "연애/결혼운",
  },
  promotion: {
    positive: ["정관", "정인", "식신"],
    negative: ["편관", "상관"],
    description: "승진/성취운",
  },
  wealth: {
    positive: ["정재", "편재", "식신"],
    negative: ["겁재", "비견"],
    description: "재물운",
  },
  study: {
    positive: ["정인", "편인", "식신"],
    negative: ["편재", "겁재"],
    description: "학업/자격증운",
  },
  health: {
    positive: ["정인", "식신", "비견"],
    negative: ["편관", "상관", "편인"],
    description: "건강운",
  },
};

// 분야별 메타 정보
const CATEGORY_META: Record<FortuneCategory, { label: string; emoji: string }> = {
  career: { label: "취업/직장운", emoji: "💼" },
  love: { label: "연애/결혼운", emoji: "💕" },
  promotion: { label: "승진/성취운", emoji: "📈" },
  wealth: { label: "재물운", emoji: "💰" },
  study: { label: "학업/자격증운", emoji: "📚" },
  health: { label: "건강운", emoji: "🏃" },
};

/**
 * 대운의 십신 계산
 */
function getDaeunSipsin(ilgan: string, daeunCheongan: string): string {
  return SIPSIN_MAP[ilgan]?.[daeunCheongan] || "";
}

/**
 * 대운 지지의 십신 계산 (본기 기준)
 */
function getDaeunJijiSipsin(ilgan: string, daeunJiji: string): string {
  const bongi = JIJI_BONGI[daeunJiji];
  return bongi ? SIPSIN_MAP[ilgan]?.[bongi] || "" : "";
}

/**
 * 십신에 따른 분야별 점수 계산
 */
function calculateCategoryScore(
  category: FortuneCategory,
  cheonganSipsin: string,
  jijiSipsin: string,
  gender: "male" | "female"
): number {
  const categoryInfo = CATEGORY_SIPSIN[category];
  let score = 3; // 기본 점수

  // 연애운은 성별에 따라 다르게 계산
  let positives = [...categoryInfo.positive];
  if (category === "love") {
    if (gender === "male") {
      positives = ["정재", "편재"]; // 남자는 재성이 배우자
    } else {
      positives = ["정관", "편관"]; // 여자는 관성이 배우자
    }
  }

  // 천간 십신 점수
  if (positives.includes(cheonganSipsin)) {
    score += 1.5;
  } else if (categoryInfo.negative.includes(cheonganSipsin)) {
    score -= 1;
  }

  // 지지 십신 점수
  if (positives.includes(jijiSipsin)) {
    score += 1;
  } else if (categoryInfo.negative.includes(jijiSipsin)) {
    score -= 0.5;
  }

  return Math.max(1, Math.min(5, Math.round(score)));
}

/**
 * 점수에 따른 메시지 생성
 */
function generateMessage(
  category: FortuneCategory,
  rating: number,
  cheonganSipsin: string,
  gender: "male" | "female"
): string {
  const messages: Record<FortuneCategory, Record<number, string>> = {
    career: {
      5: `${cheonganSipsin}의 기운이 강해 안정적인 직장을 얻기 좋은 시기입니다.`,
      4: `직장 운이 좋아 새로운 기회가 찾아올 수 있습니다.`,
      3: `평범한 시기입니다. 꾸준히 준비하세요.`,
      2: `변동이 있을 수 있으니 신중하게 결정하세요.`,
      1: `직장에서 어려움이 있을 수 있습니다. 인내가 필요합니다.`,
    },
    love: {
      5: `${gender === "male" ? "재성" : "관성"}의 기운으로 좋은 인연을 만날 수 있는 최고의 시기입니다.`,
      4: `연애운이 좋습니다. 적극적으로 만남을 가져보세요.`,
      3: `평범한 시기입니다. 자기 계발에 집중하세요.`,
      2: `연애에 장애물이 있을 수 있습니다. 서두르지 마세요.`,
      1: `인연이 쉽게 오지 않는 시기입니다. 내면을 가꾸세요.`,
    },
    promotion: {
      5: `${cheonganSipsin}의 영향으로 능력을 인정받고 승진할 수 있는 시기입니다.`,
      4: `성과를 인정받기 좋은 시기입니다.`,
      3: `꾸준히 노력하면 결과가 따라올 시기입니다.`,
      2: `성과가 바로 나타나지 않을 수 있습니다.`,
      1: `인내심을 가지고 기다려야 하는 시기입니다.`,
    },
    wealth: {
      5: `${cheonganSipsin}의 기운으로 재물 운이 크게 상승하는 시기입니다.`,
      4: `재물 운이 좋습니다. 투자에 좋은 기회가 있습니다.`,
      3: `평범한 재물 운입니다. 저축을 권장합니다.`,
      2: `지출이 늘어날 수 있으니 절약하세요.`,
      1: `재정적 어려움이 있을 수 있습니다. 보수적으로 관리하세요.`,
    },
    study: {
      5: `${cheonganSipsin}의 기운으로 학업/자격증 취득에 최적의 시기입니다.`,
      4: `공부가 잘 되는 시기입니다. 집중력이 높아집니다.`,
      3: `꾸준히 노력하면 성과가 있을 시기입니다.`,
      2: `집중이 어려울 수 있습니다. 환경을 바꿔보세요.`,
      1: `학업에 어려움이 있을 수 있습니다. 기초부터 다지세요.`,
    },
    health: {
      5: `건강 운이 좋습니다. 활력이 넘치는 시기입니다.`,
      4: `전반적으로 건강한 시기입니다.`,
      3: `평범한 건강 상태입니다. 규칙적인 생활을 하세요.`,
      2: `건강 관리에 신경 쓰세요. 무리하지 마세요.`,
      1: `건강에 주의가 필요한 시기입니다. 정기 검진을 권장합니다.`,
    },
  };

  return messages[category][rating] || "";
}

/**
 * 분야별 시기 운세 분석
 */
export function analyzeLifeFortune(
  majorFortunes: MajorFortuneInfo[],
  ilgan: string,
  gender: "male" | "female",
  birthYear: number
): CategoryFortune[] {
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1; // 한국 나이

  const categories: FortuneCategory[] = ["career", "love", "promotion", "wealth", "study", "health"];

  return categories.map((category) => {
    const periods: FortunePeriod[] = majorFortunes.map((fortune) => {
      const cheonganSipsin = getDaeunSipsin(ilgan, fortune.cheongan);
      const jijiSipsin = getDaeunJijiSipsin(ilgan, fortune.jiji);
      const rating = calculateCategoryScore(category, cheonganSipsin, jijiSipsin, gender) as 1 | 2 | 3 | 4 | 5;
      const isCurrent = currentAge >= fortune.startAge && currentAge <= fortune.endAge;

      return {
        startAge: fortune.startAge,
        endAge: fortune.endAge,
        startYear: birthYear + fortune.startAge - 1,
        endYear: birthYear + fortune.endAge - 1,
        rating,
        sipsin: cheonganSipsin,
        message: generateMessage(category, rating, cheonganSipsin, gender),
        isCurrent,
      };
    });

    // 현재 시기 찾기
    const currentPeriod = periods.find((p) => p.isCurrent);
    const currentRating = currentPeriod?.rating || 3;

    let currentStatus: CategoryFortune["currentStatus"];
    if (currentRating >= 5) currentStatus = "excellent";
    else if (currentRating >= 4) currentStatus = "good";
    else if (currentRating >= 3) currentStatus = "normal";
    else currentStatus = "caution";

    const currentMessage = currentPeriod?.message || "현재 대운 정보를 확인할 수 없습니다.";

    return {
      category,
      label: CATEGORY_META[category].label,
      emoji: CATEGORY_META[category].emoji,
      periods,
      currentStatus,
      currentMessage,
    };
  });
}

/**
 * 가장 좋은 시기 추천
 */
export function getBestPeriods(
  categoryFortunes: CategoryFortune[],
  birthYear: number
): { category: string; emoji: string; period: FortunePeriod }[] {
  const currentYear = new Date().getFullYear();

  return categoryFortunes
    .map((cf) => {
      // 현재 이후의 가장 좋은 시기 찾기
      const futurePeriods = cf.periods.filter(
        (p) => p.endYear >= currentYear && p.rating >= 4
      );
      const bestPeriod = futurePeriods.sort((a, b) => b.rating - a.rating)[0];

      return bestPeriod
        ? { category: cf.label, emoji: cf.emoji, period: bestPeriod }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.period.rating - a.period.rating);
}
