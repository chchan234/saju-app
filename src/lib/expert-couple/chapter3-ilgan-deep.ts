/**
 * 제3장: 일간 궁합 심층
 * 십신 관계 상세 해석, 장단점
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter3Result } from "@/types/expert-couple";

// 십신 상세 설명
const SIPSIN_DETAILS: Record<string, {
  description: string;
  strengths: string[];
  weaknesses: string[];
  dynamics: string;
  powerBalance: "person1우세" | "person2우세" | "균형";
  advice: string;
}> = {
  비견: {
    description: "비견(比肩)은 나와 같은 오행으로, 친구나 동료 같은 관계입니다. 서로 대등한 위치에서 경쟁하기도 하고 협력하기도 합니다.",
    strengths: ["서로 이해가 빠름", "동등한 파트너십", "깊은 공감대 형성", "비슷한 가치관 공유"],
    weaknesses: ["주도권 다툼 가능", "양보가 어려움", "경쟁 심리 발생", "비슷해서 지루해질 수 있음"],
    dynamics: "두 분은 거울처럼 닮은 부분이 많아 서로를 빠르게 이해할 수 있지만, 그만큼 부딪히는 부분도 생길 수 있습니다.",
    powerBalance: "균형",
    advice: "서로의 영역을 존중하고, 경쟁보다 협력을 선택하세요. 공동의 목표를 세우면 강력한 팀이 될 수 있습니다.",
  },
  겁재: {
    description: "겁재(劫財)는 나와 비슷한 오행으로, 형제자매나 가까운 동료 같은 관계입니다. 서로 도움을 주고받지만, 때로는 재물이나 이익 문제로 갈등이 생길 수 있습니다.",
    strengths: ["서로 도움이 됨", "협력이 가능", "비슷한 에너지", "함께 성장 가능"],
    weaknesses: ["질투나 시기 발생 가능", "재물 문제 갈등", "경쟁적 성향", "소유욕 충돌"],
    dynamics: "비슷하지만 약간의 차이가 있어 보완적일 수 있으나, 같은 것을 원할 때 충돌이 생깁니다.",
    powerBalance: "균형",
    advice: "재정 문제는 미리 명확히 정리하고, 서로의 성과를 진심으로 축하해주세요.",
  },
  식신: {
    description: "식신(食神)은 내가 자연스럽게 표현하고 베푸는 관계입니다. 편안하고 여유로운 분위기를 만들며, 서로의 성장을 도와줍니다.",
    strengths: ["편안한 관계", "서로 성장 도움", "자연스러운 케어", "여유로운 분위기"],
    weaknesses: ["지나친 편안함에 나태해질 수 있음", "긴장감 부족", "발전 동력 저하 가능"],
    dynamics: "가장 조화로운 관계 중 하나입니다. 함께 있으면 마음이 편안해지고 자연스럽게 서로를 돌봅니다.",
    powerBalance: "person1우세",
    advice: "편안함 속에서도 함께 성장할 목표를 세우세요. 서로에게 새로운 자극을 주는 것도 중요합니다.",
  },
  상관: {
    description: "상관(傷官)은 창의적이고 자유로운 표현의 관계입니다. 새로운 것을 함께 시도하고 활발하게 소통합니다.",
    strengths: ["새로운 것 함께 도전", "활발한 소통", "창의적 시너지", "재미있는 관계"],
    weaknesses: ["갈등 시 말로 상처줄 수 있음", "감정 기복", "과격한 표현", "비판적 성향"],
    dynamics: "함께 있으면 창의적인 아이디어가 넘치고 재미있는 시간을 보낼 수 있지만, 갈등 시 말로 상처를 주기 쉽습니다.",
    powerBalance: "person1우세",
    advice: "감정이 격해졌을 때는 잠시 멈추고 생각하세요. 말의 힘을 긍정적으로 사용하면 관계가 더욱 빛납니다.",
  },
  편재: {
    description: "편재(偏財)는 현실적이고 실용적인 파트너십입니다. 재물과 실질적인 면에서 도움을 주고받습니다.",
    strengths: ["실질적 도움", "재물운 상승", "현실적 파트너", "실용적 관계"],
    weaknesses: ["물질 중심 관계 될 수 있음", "감정 교류 부족", "계산적 성향", "로맨스 부족"],
    dynamics: "현실적인 측면에서 서로에게 도움이 되는 관계입니다. 함께하면 재정적으로 안정될 가능성이 높습니다.",
    powerBalance: "person1우세",
    advice: "물질적인 것 외에도 감정적 교류를 소홀히 하지 마세요. 함께하는 특별한 시간을 만들어가세요.",
  },
  정재: {
    description: "정재(正財)는 가장 안정적인 인연 중 하나입니다. 신뢰를 바탕으로 오래 지속되는 관계이며, 서로에게 든든한 파트너가 됩니다.",
    strengths: ["신뢰 기반 관계", "오래 지속됨", "안정적", "든든한 파트너"],
    weaknesses: ["변화 없이 지루해질 수 있음", "보수적 성향", "새로움 부족", "관성적 관계"],
    dynamics: "결혼 궁합으로 가장 이상적인 관계 중 하나입니다. 시간이 지날수록 신뢰가 깊어집니다.",
    powerBalance: "person1우세",
    advice: "안정 속에서도 새로운 것을 함께 시도해보세요. 데이트의 설렘을 잃지 마세요.",
  },
  편관: {
    description: "편관(偏官)은 긴장과 자극이 있는 관계입니다. 강렬한 끌림이 있지만, 한쪽이 다른 쪽을 통제하거나 억누르려 할 수 있습니다.",
    strengths: ["서로 자극이 됨", "성장 동력", "강렬한 끌림", "긴장감 유지"],
    weaknesses: ["스트레스 많음", "한쪽이 억눌림", "갈등 잦음", "권력 다툼"],
    dynamics: "강렬한 끌림이 있지만 관계 유지가 쉽지 않습니다. 서로 존중하는 태도가 매우 중요합니다.",
    powerBalance: "person2우세",
    advice: "상대방을 통제하려 하지 말고 존중하세요. 서로의 독립성을 인정하는 것이 관계의 열쇠입니다.",
  },
  정관: {
    description: "정관(正官)은 책임감과 규율이 있는 관계입니다. 서로 예의를 지키고 신뢰를 쌓아갑니다.",
    strengths: ["서로 예의 지킴", "신뢰 형성", "책임감 있음", "안정적 구조"],
    weaknesses: ["딱딱하고 형식적", "자유로움 부족", "솔직한 표현 어려움", "거리감"],
    dynamics: "예의 바르고 책임감 있는 관계이지만, 때로는 너무 형식적이어서 진정한 감정 교류가 어려울 수 있습니다.",
    powerBalance: "person2우세",
    advice: "형식적인 관계를 넘어 진심으로 소통하세요. 가끔은 규칙을 깨고 즉흥적인 시간을 가져보세요.",
  },
  편인: {
    description: "편인(偏印)은 지적 교감과 영감을 나누는 관계입니다. 깊은 대화가 가능하고 서로에게 배울 점이 많습니다.",
    strengths: ["깊은 대화 가능", "서로 배움", "지적 자극", "영감 교환"],
    weaknesses: ["현실감각 부족할 수 있음", "이상에 치우침", "실행력 부족", "공상적"],
    dynamics: "정신적으로 깊이 연결될 수 있는 관계입니다. 함께 공부하거나 철학적 대화를 나누면 더욱 가까워집니다.",
    powerBalance: "person2우세",
    advice: "지적인 교류와 함께 현실적인 부분도 신경 쓰세요. 이상과 현실의 균형을 맞추는 것이 중요합니다.",
  },
  정인: {
    description: "정인(正印)은 정서적으로 가장 안정적인 관계입니다. 따뜻하게 보살피고 지지해주며, 함께 있으면 안정감을 느낍니다.",
    strengths: ["따뜻한 보살핌", "안정감", "정서적 지지", "무조건적 사랑"],
    weaknesses: ["의존적 관계 될 수 있음", "과보호", "독립성 저하", "성장 제한"],
    dynamics: "가장 따뜻하고 안정적인 관계 중 하나입니다. 서로에게 안식처가 되어줍니다.",
    powerBalance: "person2우세",
    advice: "서로를 보살피되, 지나친 의존은 피하세요. 각자의 독립적인 영역도 존중해주세요.",
  },
};

// 일간 관계 매핑
const ILGAN_RELATION: Record<string, Record<string, string>> = {
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

// 십신 한자
const SIPSIN_HANJA: Record<string, string> = {
  비견: "比肩", 겁재: "劫財", 식신: "食神", 상관: "傷官", 편재: "偏財",
  정재: "正財", 편관: "偏官", 정관: "正官", 편인: "偏印", 정인: "正印",
};

/**
 * 제3장: 일간 궁합 심층 분석
 */
export function analyzeCouple3(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter3Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  // 십신 관계 찾기
  const sipsinType = ILGAN_RELATION[ilgan1]?.[ilgan2] || "비견";
  const sipsinHanja = SIPSIN_HANJA[sipsinType] || "";
  const details = SIPSIN_DETAILS[sipsinType] || SIPSIN_DETAILS["비견"];

  return {
    person1Ilgan: ilgan1,
    person2Ilgan: ilgan2,
    sipsinType,
    sipsinHanja,
    sipsinDescription: details.description,
    strengths: details.strengths,
    weaknesses: details.weaknesses,
    relationshipDynamics: details.dynamics,
    powerBalance: details.powerBalance,
    advice: details.advice,
    narrative: {
      intro: `${person1Name}님의 일간 ${ilgan1}과 ${person2Name}님의 일간 ${ilgan2}의 관계를 심층 분석해보겠습니다.`,
      mainAnalysis: `두 분은 ${sipsinType}(${sipsinHanja}) 관계입니다. ${details.description}`,
      details: [
        `관계의 장점: ${details.strengths.join(", ")}`,
        `주의할 점: ${details.weaknesses.join(", ")}`,
        `관계 역학: ${details.dynamics}`,
        `힘의 균형: ${details.powerBalance === "균형" ? "대등한 관계" : details.powerBalance === "person1우세" ? `${person1Name}님이 주도권을 가지기 쉬움` : `${person2Name}님이 주도권을 가지기 쉬움`}`,
      ],
      advice: details.advice,
      closing: `다음 장에서는 두 분의 오행이 어떻게 서로를 보완하는지 살펴보겠습니다.`,
    },
  };
}
