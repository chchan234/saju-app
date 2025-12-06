/**
 * 제13장: 시댁/처가 관계
 * 일간 기반 확장 가족 관계 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter13Result } from "@/types/expert-couple";

// 일간별 확장 가족 관계 스타일
const ILGAN_FAMILY_STYLE: Record<string, {
  inLawApproach: string;
  strength: string;
  challenge: string;
}> = {
  갑: {
    inLawApproach: "주도적이고 적극적으로 관계를 만들어갑니다.",
    strength: "리더십을 발휘해 가족 행사를 이끌 수 있어요.",
    challenge: "너무 주도적이면 시부모/장인장모님이 불편할 수 있어요. 존중이 먼저예요.",
  },
  을: {
    inLawApproach: "부드럽고 조화롭게 관계를 맺어갑니다.",
    strength: "눈치가 빠르고 상황에 맞게 행동해요. 갈등을 잘 피해요.",
    challenge: "너무 맞추다 보면 스트레스 받을 수 있어요. 자신의 경계도 지키세요.",
  },
  병: {
    inLawApproach: "밝고 친근하게 다가갑니다.",
    strength: "분위기를 밝게 만들고 즐거운 시간을 만들어요.",
    challenge: "감정 표현이 너무 강하면 부담스러울 수 있어요. 적당히 조절하세요.",
  },
  정: {
    inLawApproach: "따뜻하고 정성스럽게 대합니다.",
    strength: "진심 어린 배려로 마음을 얻을 수 있어요.",
    challenge: "너무 감정이입하면 상처받기 쉬워요. 적당한 거리도 필요해요.",
  },
  무: {
    inLawApproach: "믿음직하고 안정적으로 관계를 유지합니다.",
    strength: "꾸준하고 변함없는 모습으로 신뢰를 얻어요.",
    challenge: "변화를 꺼리면 새로운 관계 형성이 어려울 수 있어요.",
  },
  기: {
    inLawApproach: "세심하고 배려 깊게 챙깁니다.",
    strength: "작은 것까지 잘 챙겨서 좋은 인상을 줘요.",
    challenge: "너무 걱정이 많으면 오히려 부담스러울 수 있어요.",
  },
  경: {
    inLawApproach: "예의 바르고 원칙적으로 대합니다.",
    strength: "예절을 잘 지키고 신뢰감을 줍니다.",
    challenge: "너무 딱딱하면 친밀감 형성이 어려워요. 가끔은 유연하게요.",
  },
  신: {
    inLawApproach: "정중하고 세련되게 관계를 맺습니다.",
    strength: "격식을 잘 갖추고 품위 있게 행동해요.",
    challenge: "완벽주의가 부담이 될 수 있어요. 자연스러움도 중요해요.",
  },
  임: {
    inLawApproach: "자유롭고 편하게 지내려 합니다.",
    strength: "부담 없이 편안한 관계를 만들어요.",
    challenge: "너무 자유로우면 예의 없어 보일 수 있어요. 기본 예절은 지키세요.",
  },
  계: {
    inLawApproach: "조용하고 은근하게 관계를 맺습니다.",
    strength: "부드럽게 스며들 듯 자연스럽게 가까워져요.",
    challenge: "너무 수동적이면 관심 없어 보일 수 있어요. 적극성도 필요해요.",
  },
};

// 시댁/처가 관계 분석
function analyzeInLawRelation(
  ilgan: string,
  spouseName: string
): CoupleChapter13Result["person1FamilyRelation"] {
  const style = ILGAN_FAMILY_STYLE[ilgan];

  if (!style) {
    return {
      inLawCompatibility: "조화로운 관계를 만들어갈 수 있습니다.",
      potentialIssues: ["관계 형성에 시간이 필요할 수 있어요."],
      managementAdvice: "진심 어린 태도로 다가가면 좋은 관계를 만들 수 있어요.",
    };
  }

  const potentialIssues: string[] = [];

  // 잠재적 이슈 생성
  if (["갑", "병"].includes(ilgan)) {
    potentialIssues.push("너무 자기주장이 강하면 충돌이 있을 수 있어요.");
  }
  if (["을", "계"].includes(ilgan)) {
    potentialIssues.push("속마음을 표현하지 않으면 오해가 생길 수 있어요.");
  }
  if (["경", "신"].includes(ilgan)) {
    potentialIssues.push("너무 원칙적이면 관계가 딱딱해질 수 있어요.");
  }
  if (["임"].includes(ilgan)) {
    potentialIssues.push("자유로운 태도가 예의 없어 보일 수 있어요.");
  }

  if (potentialIssues.length === 0) {
    potentialIssues.push("큰 문제는 없지만 기본 예의와 배려는 항상 필요해요.");
  }

  return {
    inLawCompatibility: style.inLawApproach,
    potentialIssues,
    managementAdvice: `${style.strength} ${style.challenge}`,
  };
}

// 가족 역학 분석
function analyzeFamilyDynamics(ilgan1: string, ilgan2: string): CoupleChapter13Result["familyDynamics"] {
  // 둘 다 조화형
  if (["을", "정", "무", "기"].includes(ilgan1) && ["을", "정", "무", "기"].includes(ilgan2)) {
    return {
      overallHarmony: "좋음",
      keyAdvice: "두 분 다 가족 관계에서 조화를 중시해요. 양가 모두와 좋은 관계를 유지할 수 있어요.",
    };
  }

  // 한 명은 조화형, 한 명은 적극형
  if ((["을", "정", "무", "기"].includes(ilgan1) && ["갑", "병", "경"].includes(ilgan2)) ||
    (["갑", "병", "경"].includes(ilgan1) && ["을", "정", "무", "기"].includes(ilgan2))) {
    return {
      overallHarmony: "보통",
      keyAdvice: "한 분이 관계를 주도하고, 한 분이 조율하는 역할을 맡으면 균형이 잡혀요.",
    };
  }

  // 둘 다 적극형
  if (["갑", "병", "경"].includes(ilgan1) && ["갑", "병", "경"].includes(ilgan2)) {
    return {
      overallHarmony: "어려움",
      keyAdvice: "두 분 다 주도적이라 양가 사이에서 갈등이 생길 수 있어요. 서로의 가족을 존중하는 대화가 필요해요.",
    };
  }

  // 둘 다 자유형/수동형
  if (["임", "계"].includes(ilgan1) && ["임", "계"].includes(ilgan2)) {
    return {
      overallHarmony: "보통",
      keyAdvice: "두 분 다 적극적이지 않아서 가족 관계가 소원해질 수 있어요. 정기적인 연락과 방문을 계획하세요.",
    };
  }

  return {
    overallHarmony: "보통",
    keyAdvice: "서로의 가족 스타일을 이해하고 존중하면 좋은 관계를 유지할 수 있어요.",
  };
}

// 경계 설정 조언
function generateBoundarySettings(ilgan1: string, ilgan2: string): string[] {
  const boundaries: string[] = [];

  boundaries.push("부부의 의견을 먼저 정하고 양가에 전달하세요. 일관성이 중요해요.");
  boundaries.push("양가 방문 빈도와 명절 일정은 미리 대화로 정해두세요.");
  boundaries.push("경제적 지원은 두 분이 함께 결정하세요. 한쪽만 결정하면 갈등이 생겨요.");

  // 특정 조합에 대한 추가 조언
  if (["을", "정", "계"].includes(ilgan1) || ["을", "정", "계"].includes(ilgan2)) {
    boundaries.push("'우리 부부의 생각은 이래요'라고 명확히 말하는 연습을 하세요.");
  }

  if (["갑", "경"].includes(ilgan1) || ["갑", "경"].includes(ilgan2)) {
    boundaries.push("상대 배우자의 가족을 비판하지 마세요. 내 가족 문제는 내가 말해요.");
  }

  return boundaries.slice(0, 5);
}

/**
 * 제13장: 시댁/처가 관계 분석
 */
export function analyzeCouple13(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter13Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const person1FamilyRelation = analyzeInLawRelation(ilgan1, person2Name);
  const person2FamilyRelation = analyzeInLawRelation(ilgan2, person1Name);
  const familyDynamics = analyzeFamilyDynamics(ilgan1, ilgan2);
  const boundarySettings = generateBoundarySettings(ilgan1, ilgan2);

  return {
    person1FamilyRelation,
    person2FamilyRelation,
    familyDynamics,
    boundarySettings,
    narrative: {
      intro: "이번 장에서는 시댁/처가와의 관계를 분석합니다.",
      mainAnalysis: `전반적인 확장 가족 관계 전망: ${familyDynamics.overallHarmony}`,
      details: [
        `${person1Name}님의 접근법: ${person1FamilyRelation.inLawCompatibility}`,
        `${person2Name}님의 접근법: ${person2FamilyRelation.inLawCompatibility}`,
      ],
      advice: familyDynamics.keyAdvice,
      closing: "다음 장에서는 위기 시기와 주의점을 살펴보겠습니다.",
    },
  };
}
