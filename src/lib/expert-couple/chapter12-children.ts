/**
 * 제12장: 자녀 궁합
 * 자녀운 및 양육 스타일 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter12Result } from "@/types/expert-couple";

// 일간별 양육 스타일
const ILGAN_PARENTING: Record<string, {
  style: string;
  strength: string;
  challenge: string;
}> = {
  갑: {
    style: "리더형 부모",
    strength: "자녀에게 비전과 방향을 제시해줍니다. 독립심을 키워줘요.",
    challenge: "너무 주도적이면 자녀가 주눅 들 수 있어요. 경청도 중요해요.",
  },
  을: {
    style: "조율형 부모",
    strength: "자녀의 눈높이에 맞춰 소통합니다. 공감을 잘 해줘요.",
    challenge: "때로는 단호함이 필요해요. 규칙도 중요합니다.",
  },
  병: {
    style: "열정형 부모",
    strength: "자녀와 함께 놀고 즐기는 것을 좋아해요. 에너지가 넘쳐요.",
    challenge: "감정 기복이 자녀에게 영향 줄 수 있어요. 일관성이 필요해요.",
  },
  정: {
    style: "따뜻한 부모",
    strength: "자녀의 감정을 잘 읽고 정서적 안정감을 줍니다.",
    challenge: "과보호 경향이 있을 수 있어요. 독립심도 길러주세요.",
  },
  무: {
    style: "든든한 부모",
    strength: "안정적이고 일관된 양육을 합니다. 믿음직해요.",
    challenge: "변화에 유연하게 대처하는 것도 필요해요.",
  },
  기: {
    style: "세심한 부모",
    strength: "자녀의 필요를 잘 챙기고 꼼꼼하게 돌봅니다.",
    challenge: "너무 걱정이 많으면 자녀에게 부담이 될 수 있어요.",
  },
  경: {
    style: "원칙형 부모",
    strength: "옳고 그름을 명확히 가르치고, 규칙을 중시해요.",
    challenge: "너무 엄격하면 자녀가 위축될 수 있어요. 칭찬도 필요해요.",
  },
  신: {
    style: "완벽주의 부모",
    strength: "자녀 교육에 정성을 쏟고 최고의 것을 주려 해요.",
    challenge: "자녀에게 너무 높은 기대를 할 수 있어요. 있는 그대로도 충분해요.",
  },
  임: {
    style: "자유형 부모",
    strength: "자녀의 자유와 창의성을 존중합니다. 열린 사고를 해요.",
    challenge: "너무 방임하면 안 돼요. 적절한 가이드도 필요합니다.",
  },
  계: {
    style: "감성형 부모",
    strength: "자녀와 감정적으로 깊이 연결됩니다. 직관으로 필요를 알아채요.",
    challenge: "자녀의 감정에 너무 동화되지 않도록 주의하세요.",
  },
};

// 자녀운 분석 (시주 기반, 없으면 일주 기반)
function analyzeChildrenFortune(saju: SajuApiResult): string {
  // 시주가 있으면 시주로, 없으면 일주로 판단
  const pillar = saju.timePillar.cheongan ? saju.timePillar : saju.dayPillar;
  const oheng = pillar.jijiOheng;

  const fortunes: Record<string, string> = {
    목: "자녀가 창의적이고 성장 지향적일 수 있어요. 교육에 관심을 기울이면 좋습니다.",
    화: "활발하고 밝은 자녀를 기대할 수 있어요. 에너지를 건설적으로 쓰도록 도와주세요.",
    토: "안정적이고 믿음직한 자녀를 기대할 수 있어요. 꾸준함이 강점이 됩니다.",
    금: "똑똑하고 논리적인 자녀를 기대할 수 있어요. 감정 표현도 격려해주세요.",
    수: "지혜롭고 적응력 있는 자녀를 기대할 수 있어요. 안정감을 주는 것이 중요해요.",
  };

  return fortunes[oheng] || "자녀와 함께 성장하는 기쁨을 누릴 수 있어요.";
}

// 최적 출산 시기 계산
function calculateOptimalConceptionYears(person1: SajuApiResult, person2: SajuApiResult): number[] {
  const currentYear = new Date().getFullYear();
  const optimalYears: number[] = [];

  // 년도별 지지
  const yearJijis = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

  // 일지 기준 육합 년도 찾기
  const dayJiji1 = person1.dayPillar.jiji;
  const dayJiji2 = person2.dayPillar.jiji;

  // 육합 관계
  const yukap: Record<string, string> = {
    자: "축", 축: "자", 인: "해", 해: "인",
    묘: "술", 술: "묘", 진: "유", 유: "진",
    사: "신", 신: "사", 오: "미", 미: "오",
  };

  for (let year = currentYear; year <= currentYear + 10; year++) {
    const jijiIndex = (year - 4) % 12;
    const yearJiji = yearJijis[jijiIndex];

    // 두 사람 중 한 명의 일지와 육합이 되는 해
    if (yukap[dayJiji1] === yearJiji || yukap[dayJiji2] === yearJiji) {
      optimalYears.push(year);
    }
  }

  // 최소 2개 이상 반환
  if (optimalYears.length < 2) {
    for (let year = currentYear + 1; year <= currentYear + 5; year++) {
      if (!optimalYears.includes(year)) {
        optimalYears.push(year);
        if (optimalYears.length >= 2) break;
      }
    }
  }

  return optimalYears.slice(0, 3);
}

// 양육 궁합 분석
function analyzeParentingCompatibility(ilgan1: string, ilgan2: string): string {
  const style1 = ILGAN_PARENTING[ilgan1];
  const style2 = ILGAN_PARENTING[ilgan2];

  if (!style1 || !style2) {
    return "서로의 양육 스타일을 존중하며 협력하면 좋은 부모가 될 수 있어요.";
  }

  // 원칙형 + 자유형 조합
  if ((ilgan1 === "경" && ilgan2 === "임") || (ilgan1 === "임" && ilgan2 === "경")) {
    return "한 분은 규칙을, 한 분은 자유를 담당하면 균형 잡힌 양육이 가능해요. 역할 분담이 핵심입니다.";
  }

  // 따뜻한 + 원칙형 조합
  if ((["정", "을"].includes(ilgan1) && ["경", "갑"].includes(ilgan2)) ||
    (["경", "갑"].includes(ilgan1) && ["정", "을"].includes(ilgan2))) {
    return "정서적 지지와 규율을 함께 제공할 수 있어요. 이상적인 조합이에요.";
  }

  // 둘 다 자유형
  if (["임", "계", "병"].includes(ilgan1) && ["임", "계", "병"].includes(ilgan2)) {
    return "두 분 다 자유로운 양육 스타일이에요. 일관된 규칙을 함께 정해두면 좋겠어요.";
  }

  // 둘 다 원칙형
  if (["경", "갑", "신"].includes(ilgan1) && ["경", "갑", "신"].includes(ilgan2)) {
    return "두 분 다 체계적인 양육을 하실 거예요. 때로는 유연함과 놀이도 필요해요.";
  }

  return "서로의 양육 방식을 존중하고 강점을 살리면 좋은 부모 파트너십을 만들 수 있어요.";
}

// 교육 접근법 분석
function analyzeChildEducationApproach(ilgan1: string, ilgan2: string): CoupleChapter12Result["childEducationApproach"] {
  const agreement: string[] = [];
  const potentialConflicts: string[] = [];
  let advice = "";

  // 공통 가치관
  if (["경", "갑", "신"].includes(ilgan1) || ["경", "갑", "신"].includes(ilgan2)) {
    agreement.push("교육의 중요성을 공감합니다.");
  }
  if (["을", "정", "무"].includes(ilgan1) || ["을", "정", "무"].includes(ilgan2)) {
    agreement.push("아이의 정서 발달을 중시합니다.");
  }
  if (["병", "임"].includes(ilgan1) || ["병", "임"].includes(ilgan2)) {
    agreement.push("창의성과 경험 학습을 중요시합니다.");
  }

  // 잠재적 갈등
  if ((["경", "신"].includes(ilgan1) && ["임", "병"].includes(ilgan2)) ||
    (["임", "병"].includes(ilgan1) && ["경", "신"].includes(ilgan2))) {
    potentialConflicts.push("학원 vs 놀이 시간 배분에서 의견이 다를 수 있어요.");
    potentialConflicts.push("성적 vs 경험 중시 관점이 다를 수 있어요.");
  }

  if ((["갑", "경"].includes(ilgan1) && ["을", "계"].includes(ilgan2)) ||
    (["을", "계"].includes(ilgan1) && ["갑", "경"].includes(ilgan2))) {
    potentialConflicts.push("엄격함 vs 부드러움의 균형을 찾아야 해요.");
  }

  if (agreement.length === 0) {
    agreement.push("아이의 행복을 최우선으로 생각합니다.");
  }

  if (potentialConflicts.length === 0) {
    potentialConflicts.push("큰 갈등 요소는 없지만, 구체적인 교육 방법은 미리 대화해보세요.");
  }

  advice = "교육관은 미리 충분히 대화해두세요. 아이 앞에서 의견이 갈리면 혼란스러울 수 있어요.";

  return { agreement, potentialConflicts, advice };
}

/**
 * 제12장: 자녀 궁합 분석
 */
export function analyzeCouple12(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter12Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const person1Fortune = analyzeChildrenFortune(person1);
  const person2Fortune = analyzeChildrenFortune(person2);
  const optimalConceptionYears = calculateOptimalConceptionYears(person1, person2);
  const parentingCompatibility = analyzeParentingCompatibility(ilgan1, ilgan2);
  const childEducationApproach = analyzeChildEducationApproach(ilgan1, ilgan2);

  const parent1 = ILGAN_PARENTING[ilgan1] || {
    style: "조화형 부모",
    strength: "균형 있게 자녀를 돌봅니다.",
    challenge: "상황에 따라 유연하게 대처하세요.",
  };

  const parent2 = ILGAN_PARENTING[ilgan2] || {
    style: "조화형 부모",
    strength: "균형 있게 자녀를 돌봅니다.",
    challenge: "상황에 따라 유연하게 대처하세요.",
  };

  // 종합 자녀 운세
  let combinedFortune: "높음" | "보통" | "낮음" = "보통";
  if (optimalConceptionYears.length >= 2) {
    combinedFortune = "높음";
  }

  return {
    childrenPossibility: {
      person1Fortune,
      person2Fortune,
      combinedFortune,
      analysis: parentingCompatibility,
    },
    optimalConceptionYears,
    parentingStyles: {
      person1Style: `${parent1.style}: ${parent1.strength}`,
      person2Style: `${parent2.style}: ${parent2.strength}`,
      compatibility: parentingCompatibility,
    },
    childEducationApproach,
    narrative: {
      intro: "이번 장에서는 두 분의 자녀 궁합을 살펴봅니다.",
      mainAnalysis: `${person1Name}님은 ${parent1.style}이고, ${person2Name}님은 ${parent2.style}입니다.`,
      details: [
        `좋은 출산 시기: ${optimalConceptionYears.join(", ")}년`,
        `${person1Name}님 주의점: ${parent1.challenge}`,
        `${person2Name}님 주의점: ${parent2.challenge}`,
      ],
      advice: childEducationApproach.advice,
      closing: "다음 장에서는 시댁/처가 관계를 살펴보겠습니다.",
    },
  };
}
