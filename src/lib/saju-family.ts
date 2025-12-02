/**
 * 가족 통합 분석 로직
 * - 각 가족 구성원의 사주 분석
 * - 구성원 간 궁합 분석
 * - 가족 전체 조화도 분석
 * - 일간 관계 분석
 * - 일주 궁합 분석
 */

import type { SajuApiResult } from "@/types/saju";
import { analyzeCompatibility, type CompatibilityResult } from "./saju-compatibility";

// ============================================
// 일간(日干) 관계 분석 - 십성 기반
// ============================================

// 십성 타입
export type SipseongType =
  | "비견" | "겁재"
  | "식신" | "상관"
  | "편재" | "정재"
  | "편관" | "정관"
  | "편인" | "정인";

// 일간 관계 정보
export interface IlganRelationship {
  type: SipseongType;
  description: string;
  compatibility: "상" | "중상" | "중" | "중하" | "하";
  dynamics: string;
  advice: string;
}

// 천간 정보 (오행, 음양)
const CHEONGAN_INFO: Record<string, { element: string; yin: boolean }> = {
  갑: { element: "목", yin: false },
  을: { element: "목", yin: true },
  병: { element: "화", yin: false },
  정: { element: "화", yin: true },
  무: { element: "토", yin: false },
  기: { element: "토", yin: true },
  경: { element: "금", yin: false },
  신: { element: "금", yin: true },
  임: { element: "수", yin: false },
  계: { element: "수", yin: true },
};

// 오행 상생 관계 (A → B: A가 B를 생함)
const OHENG_GENERATE: Record<string, string> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목"
};

// 오행 상극 관계 (A → B: A가 B를 극함)
const OHENG_CONTROL: Record<string, string> = {
  목: "토", 토: "수", 수: "화", 화: "금", 금: "목"
};

// 역상생 (나를 생하는 오행)
const OHENG_GENERATED_BY: Record<string, string> = {
  목: "수", 화: "목", 토: "화", 금: "토", 수: "금"
};

// 역상극 (나를 극하는 오행)
const OHENG_CONTROLLED_BY: Record<string, string> = {
  목: "금", 화: "수", 토: "목", 금: "화", 수: "토"
};

/**
 * 두 일간 간의 십성 관계 계산
 */
function calculateSipseong(ilgan1: string, ilgan2: string): SipseongType {
  const info1 = CHEONGAN_INFO[ilgan1];
  const info2 = CHEONGAN_INFO[ilgan2];

  if (!info1 || !info2) return "비견"; // 기본값

  const sameYin = info1.yin === info2.yin;

  // 같은 오행
  if (info1.element === info2.element) {
    return sameYin ? "비견" : "겁재";
  }

  // 내가 생하는 오행
  if (OHENG_GENERATE[info1.element] === info2.element) {
    return sameYin ? "식신" : "상관";
  }

  // 내가 극하는 오행
  if (OHENG_CONTROL[info1.element] === info2.element) {
    return sameYin ? "편재" : "정재";
  }

  // 나를 극하는 오행
  if (OHENG_CONTROLLED_BY[info1.element] === info2.element) {
    return sameYin ? "편관" : "정관";
  }

  // 나를 생하는 오행
  if (OHENG_GENERATED_BY[info1.element] === info2.element) {
    return sameYin ? "편인" : "정인";
  }

  return "비견";
}

// 십성별 관계 설명 데이터
const SIPSEONG_DESCRIPTIONS: Record<SipseongType, {
  meaning: string;
  coupleAdvice: string;
  familyAdvice: string;
  compatibility: "상" | "중상" | "중" | "중하" | "하";
}> = {
  비견: {
    meaning: "같은 기운을 가진 동료 관계입니다. 서로를 가장 잘 이해하지만, 경쟁심이 생길 수 있습니다.",
    coupleAdvice: "비슷한 성향이라 편안하지만, 너무 비슷해서 자극이 부족할 수 있습니다. 각자의 영역을 만들고 서로의 성장을 응원하세요.",
    familyAdvice: "동질감이 강해 유대감이 깊습니다. 하지만 같은 것을 원할 때 충돌이 있을 수 있으니, 양보하는 미덕을 기르세요.",
    compatibility: "중상",
  },
  겁재: {
    meaning: "같은 오행이지만 음양이 달라 협력과 경쟁이 공존합니다. 서로를 자극하는 관계입니다.",
    coupleAdvice: "끌어당기는 힘이 있지만, 때로는 경쟁적이 될 수 있습니다. 공동의 목표를 세우고 함께 성장하세요.",
    familyAdvice: "서로를 자극하며 발전하는 관계입니다. 경쟁보다는 협력에 초점을 맞추면 시너지가 큽니다.",
    compatibility: "중",
  },
  식신: {
    meaning: "한 사람이 다른 사람을 편안하게 돌봐주는 관계입니다. 자연스러운 보살핌이 있습니다.",
    coupleAdvice: "한 사람이 자연스럽게 상대를 챙기는 관계입니다. 받는 쪽도 감사를 표현하고 때로는 역할을 바꿔보세요.",
    familyAdvice: "온화하고 안정적인 관계입니다. 서로를 편안하게 하는 에너지가 흘러 가정에 평화를 가져옵니다.",
    compatibility: "상",
  },
  상관: {
    meaning: "한 사람이 다른 사람에게 도전과 자극을 주는 관계입니다. 성장의 기회가 됩니다.",
    coupleAdvice: "날카로운 피드백을 주고받는 관계입니다. 비판이 아닌 건설적 조언으로 서로를 발전시키세요.",
    familyAdvice: "직설적인 소통이 있는 관계입니다. 말하는 방식에 신경 쓰면 서로에게 큰 도움이 됩니다.",
    compatibility: "중하",
  },
  편재: {
    meaning: "한 사람이 다른 사람을 관리하고 이끄는 경향이 있습니다. 현실적인 관계입니다.",
    coupleAdvice: "실용적인 파트너십을 이룰 수 있습니다. 통제보다는 신뢰를 바탕으로 관계를 발전시키세요.",
    familyAdvice: "경제적, 현실적 측면에서 서로 도움이 되는 관계입니다. 물질적 것 외에 감정적 교류도 중요합니다.",
    compatibility: "중상",
  },
  정재: {
    meaning: "안정적이고 헌신적인 관계입니다. 한 사람이 다른 사람에게 충실하게 다가갑니다.",
    coupleAdvice: "안정적이고 성실한 관계를 만들 수 있습니다. 서로에게 책임감을 갖고 꾸준히 노력하세요.",
    familyAdvice: "신뢰와 책임감이 있는 관계입니다. 서로에게 의지가 되는 든든한 가족입니다.",
    compatibility: "상",
  },
  편관: {
    meaning: "한 사람이 다른 사람에게 도전이 되는 관계입니다. 긴장감이 있지만 성장의 동력이 됩니다.",
    coupleAdvice: "서로에게 자극과 도전이 되는 관계입니다. 갈등을 성장의 기회로 삼고, 존중을 잃지 마세요.",
    familyAdvice: "때로 부딪히지만 서로를 강하게 만드는 관계입니다. 권위보다 대화로 문제를 해결하세요.",
    compatibility: "중하",
  },
  정관: {
    meaning: "질서와 원칙이 있는 관계입니다. 서로를 올바른 방향으로 이끌어줍니다.",
    coupleAdvice: "서로에게 좋은 영향을 주는 관계입니다. 규칙과 약속을 지키며 신뢰를 쌓아가세요.",
    familyAdvice: "질서와 예의가 있는 관계입니다. 서로를 존중하며 가정의 규범을 함께 만들어가세요.",
    compatibility: "상",
  },
  편인: {
    meaning: "한 사람이 다른 사람에게 독특한 방식으로 도움을 주는 관계입니다. 비전통적인 지원이 있습니다.",
    coupleAdvice: "색다른 방식으로 서로를 이해하는 관계입니다. 상대의 독특함을 인정하고 포용하세요.",
    familyAdvice: "특별한 유대감이 있지만 때로 오해가 생길 수 있습니다. 열린 마음으로 소통하세요.",
    compatibility: "중",
  },
  정인: {
    meaning: "한 사람이 다른 사람에게 자연스럽게 도움과 지혜를 주는 관계입니다. 보호와 가르침이 있습니다.",
    coupleAdvice: "자연스럽게 서로를 돌보는 관계입니다. 한 사람이 지나치게 일방적으로 주기만 하지 않도록 균형을 맞추세요.",
    familyAdvice: "자연스러운 보호와 가르침이 있는 관계입니다. 지혜로운 조언을 주고받으며 함께 성장하세요.",
    compatibility: "상",
  },
};

/**
 * 두 일간 간의 관계 분석
 */
export function analyzeIlganRelationship(ilgan1: string, ilgan2: string, context: "couple" | "family" = "family"): IlganRelationship {
  const sipseong = calculateSipseong(ilgan1, ilgan2);
  const descInfo = SIPSEONG_DESCRIPTIONS[sipseong];

  return {
    type: sipseong,
    description: descInfo.meaning,
    compatibility: descInfo.compatibility,
    dynamics: context === "couple" ? descInfo.coupleAdvice : descInfo.familyAdvice,
    advice: context === "couple" ? descInfo.coupleAdvice : descInfo.familyAdvice,
  };
}

/**
 * 사주 결과에서 일간 추출
 */
export function extractIlgan(saju: SajuApiResult): string {
  // 일간은 dayPillar의 천간
  return saju.dayPillar?.cheongan || "";
}

// ============================================
// 일주(日柱) 궁합 분석
// ============================================

// 특별 일주 궁합 데이터
export interface SpecialIljuMatch {
  pair: [string, string];
  category: "천생연분" | "상호보완" | "동반성장" | "주의필요";
  score: number;
  reason: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

// 특별 일주 궁합 목록
const SPECIAL_ILJU_MATCHES: SpecialIljuMatch[] = [
  // 천생연분 조합
  {
    pair: ["갑자", "기사"],
    category: "천생연분",
    score: 95,
    reason: "갑기합(甲己合)으로 완벽한 조화를 이룹니다. 나무와 땅이 만나 풍요로운 결실을 맺습니다.",
    strengths: ["깊은 정서적 교감", "서로를 완성시키는 관계", "자연스러운 역할 분담"],
    challenges: ["서로에 대한 의존도가 높아질 수 있음"],
    advice: "서로의 독립성도 유지하면서 깊은 유대를 발전시키세요."
  },
  {
    pair: ["을축", "경신"],
    category: "천생연분",
    score: 93,
    reason: "을경합(乙庚合)으로 음양이 조화롭게 결합합니다. 부드러움과 강함이 서로를 보완합니다.",
    strengths: ["상호 보완적 성격", "안정적인 관계 유지", "서로의 약점을 채워줌"],
    challenges: ["때로는 주도권 다툼이 있을 수 있음"],
    advice: "서로의 강점을 인정하고 역할을 나누세요."
  },
  {
    pair: ["병인", "신유"],
    category: "천생연분",
    score: 92,
    reason: "병신합(丙辛合)으로 불과 금의 정화된 조화입니다. 열정과 냉정의 균형을 이룹니다.",
    strengths: ["서로 다른 매력으로 끌림", "균형 잡힌 의사결정", "감정과 이성의 조화"],
    challenges: ["가치관 차이로 갈등 가능"],
    advice: "서로의 다른 관점을 존중하고 대화로 조율하세요."
  },
  {
    pair: ["정묘", "임오"],
    category: "천생연분",
    score: 94,
    reason: "정임합(丁壬合)으로 작은 불과 큰 물의 신비로운 조화입니다. 깊은 영적 교감이 있습니다.",
    strengths: ["깊은 감정적 유대", "영적인 연결감", "서로를 성장시킴"],
    challenges: ["감정적으로 복잡해질 수 있음"],
    advice: "감정에만 의존하지 말고 현실적인 기반도 함께 만드세요."
  },
  {
    pair: ["무진", "계해"],
    category: "천생연분",
    score: 91,
    reason: "무계합(戊癸合)으로 큰 산과 작은 물의 조화입니다. 안정과 유연함이 공존합니다.",
    strengths: ["안정적인 기반 위에 유연함", "서로를 든든하게 지지", "장기적인 관계 유지"],
    challenges: ["변화를 꺼리는 경향"],
    advice: "안정 속에서도 새로운 시도를 함께 해보세요."
  },

  // 상호보완 조합
  {
    pair: ["갑인", "기유"],
    category: "상호보완",
    score: 85,
    reason: "목과 토의 상생 속에 합의 기운이 더해져 서로를 보완합니다.",
    strengths: ["서로의 부족한 점을 채워줌", "균형 잡힌 관계", "함께 성장하는 느낌"],
    challenges: ["가끔 속도 차이가 생김"],
    advice: "서로의 페이스를 존중하며 함께 가세요."
  },
  {
    pair: ["을해", "경오"],
    category: "상호보완",
    score: 83,
    reason: "강한 금이 부드러운 목을 다듬어 발전시키는 관계입니다.",
    strengths: ["서로에게 자극이 됨", "성장 지향적 관계", "목표 달성에 효과적"],
    challenges: ["때로 비판적이 될 수 있음"],
    advice: "건설적인 피드백으로 서로를 발전시키세요."
  },
  {
    pair: ["병오", "신해"],
    category: "상호보완",
    score: 84,
    reason: "화의 열정과 금의 냉철함이 조화를 이루어 균형 잡힌 관계를 만듭니다.",
    strengths: ["감정과 이성의 균형", "결정의 균형", "서로를 진정시킴"],
    challenges: ["접근 방식이 다름"],
    advice: "서로의 방식을 인정하고 장점을 취하세요."
  },
  {
    pair: ["정미", "임자"],
    category: "상호보완",
    score: 86,
    reason: "작은 불과 큰 물이 적절한 긴장감 속에 성장하는 관계입니다.",
    strengths: ["서로를 발전시킴", "긴장감이 활력이 됨", "도전적인 성장"],
    challenges: ["갈등이 깊어질 수 있음"],
    advice: "갈등을 성장의 기회로 전환하세요."
  },

  // 동반성장 조합
  {
    pair: ["갑자", "갑오"],
    category: "동반성장",
    score: 78,
    reason: "같은 갑목이지만 다른 지지로 서로를 비추며 성장합니다.",
    strengths: ["서로를 잘 이해함", "함께 도전 가능", "경쟁이 성장 동력"],
    challenges: ["경쟁심이 과해질 수 있음"],
    advice: "경쟁보다 협력에 초점을 맞추세요."
  },
  {
    pair: ["을축", "을미"],
    category: "동반성장",
    score: 76,
    reason: "같은 을목이 서로를 거울처럼 비추는 관계입니다.",
    strengths: ["깊은 이해", "비슷한 가치관", "안정적 동반자"],
    challenges: ["자극이 부족할 수 있음"],
    advice: "새로운 경험을 함께 하며 활력을 더하세요."
  },
  {
    pair: ["병인", "병신"],
    category: "동반성장",
    score: 77,
    reason: "같은 병화가 서로의 열정을 더욱 불타오르게 합니다.",
    strengths: ["열정적인 관계", "함께 도전", "활력 넘침"],
    challenges: ["함께 과열될 수 있음"],
    advice: "때로는 쉬어가며 균형을 유지하세요."
  },

  // 주의필요 조합
  {
    pair: ["갑인", "경신"],
    category: "주의필요",
    score: 55,
    reason: "금극목(金克木)의 관계로 강한 긴장감이 있습니다. 갈등이 자주 발생할 수 있습니다.",
    strengths: ["서로를 단련시킴", "강한 사람으로 성장", "위기 시 강해짐"],
    challenges: ["갈등이 잦음", "상처를 주고받음", "지치기 쉬움"],
    advice: "서로의 다름을 인정하고, 직접적인 충돌을 피하세요. 제3자의 중재가 도움됩니다."
  },
  {
    pair: ["병오", "임자"],
    category: "주의필요",
    score: 52,
    reason: "수극화(水克火)의 관계로 근본적인 충돌이 있습니다. 물과 불처럼 서로를 소멸시킬 수 있습니다.",
    strengths: ["강렬한 끌림", "변화의 가능성", "극적인 관계"],
    challenges: ["상극 관계", "소모적 다툼", "상처가 깊음"],
    advice: "적당한 거리를 유지하고, 감정적 충돌 시 24시간 냉각기를 가지세요."
  },
  {
    pair: ["무진", "갑인"],
    category: "주의필요",
    score: 58,
    reason: "목극토(木克土)의 관계로 한 사람이 다른 사람을 누르는 경향이 있습니다.",
    strengths: ["확실한 역할 구분", "발전 가능성", "도전과 응전"],
    challenges: ["힘의 불균형", "억압감", "자존심 충돌"],
    advice: "주도권 다툼을 피하고, 각자의 영역을 존중하세요."
  },
  {
    pair: ["경신", "병오"],
    category: "주의필요",
    score: 54,
    reason: "화극금(火克金)의 관계로 열정과 냉정이 충돌합니다.",
    strengths: ["서로를 제련시킴", "정화의 기회", "변화 가능성"],
    challenges: ["가치관 충돌", "접근 방식 차이", "지속적 갈등"],
    advice: "서로의 방식을 존중하고, 공통의 목표를 찾으세요."
  },
];

/**
 * 일주 궁합 분석
 */
export function analyzeIljuCompatibility(ilju1: string, ilju2: string): {
  isSpecialMatch: boolean;
  matchInfo?: SpecialIljuMatch;
  generalCompatibility: {
    score: number;
    grade: string;
    description: string;
  };
  ilganRelation: IlganRelationship;
} {
  // 일간 추출 (일주의 첫 글자)
  const ilgan1 = ilju1.charAt(0);
  const ilgan2 = ilju2.charAt(0);

  // 일간 관계 분석
  const ilganRelation = analyzeIlganRelationship(ilgan1, ilgan2, "couple");

  // 특별 조합 찾기
  const specialMatch = SPECIAL_ILJU_MATCHES.find(
    m => (m.pair[0] === ilju1 && m.pair[1] === ilju2) || (m.pair[0] === ilju2 && m.pair[1] === ilju1)
  );

  // 일반 궁합 점수 계산
  let baseScore: number;
  switch (ilganRelation.compatibility) {
    case "상": baseScore = 85; break;
    case "중상": baseScore = 75; break;
    case "중": baseScore = 65; break;
    case "중하": baseScore = 55; break;
    case "하": baseScore = 45; break;
    default: baseScore = 65;
  }

  // 지지 궁합 가산점 (간단한 계산)
  const jiji1 = ilju1.charAt(1);
  const jiji2 = ilju2.charAt(1);
  let jijiBonus = 0;

  // 지지 삼합/육합 체크 (간략화)
  const samhap = [
    ["인", "오", "술"], // 화국
    ["신", "자", "진"], // 수국
    ["사", "유", "축"], // 금국
    ["해", "묘", "미"], // 목국
  ];

  const yukhap: [string, string][] = [
    ["자", "축"], ["인", "해"], ["묘", "술"],
    ["진", "유"], ["사", "신"], ["오", "미"],
  ];

  // 지지 충(沖) - 정반대 위치
  const chung: [string, string][] = [
    ["자", "오"], ["축", "미"], ["인", "신"],
    ["묘", "유"], ["진", "술"], ["사", "해"],
  ];

  // 지지 형(刑) - 갈등 관계
  const hyung: [string, string][] = [
    ["인", "사"], ["사", "신"], ["인", "신"], // 무은지형
    ["축", "술"], ["술", "미"], ["축", "미"], // 지세지형
    ["자", "묘"], // 무례지형
  ];

  // 지지 해(害) - 해로운 관계
  const hae: [string, string][] = [
    ["자", "미"], ["축", "오"], ["인", "사"],
    ["묘", "진"], ["신", "해"], ["유", "술"],
  ];

  // 삼합 체크
  for (const group of samhap) {
    if (group.includes(jiji1) && group.includes(jiji2)) {
      jijiBonus += 10;
      break;
    }
  }

  // 육합 체크
  for (const [a, b] of yukhap) {
    if ((jiji1 === a && jiji2 === b) || (jiji1 === b && jiji2 === a)) {
      jijiBonus += 8;
      break;
    }
  }

  // 충 체크 (감점)
  for (const [a, b] of chung) {
    if ((jiji1 === a && jiji2 === b) || (jiji1 === b && jiji2 === a)) {
      jijiBonus -= 8;
      break;
    }
  }

  // 형 체크 (감점)
  for (const [a, b] of hyung) {
    if ((jiji1 === a && jiji2 === b) || (jiji1 === b && jiji2 === a)) {
      jijiBonus -= 5;
      break;
    }
  }

  // 해 체크 (감점)
  for (const [a, b] of hae) {
    if ((jiji1 === a && jiji2 === b) || (jiji1 === b && jiji2 === a)) {
      jijiBonus -= 3;
      break;
    }
  }

  const finalScore = Math.max(30, Math.min(100, baseScore + jijiBonus));

  // 등급 결정
  let grade: string;
  let description: string;

  if (finalScore >= 85) {
    grade = "천생연분";
    description = "서로를 완벽하게 보완하는 최상의 궁합입니다.";
  } else if (finalScore >= 75) {
    grade = "좋은 궁합";
    description = "서로에게 좋은 영향을 주는 조화로운 관계입니다.";
  } else if (finalScore >= 65) {
    grade = "무난한 궁합";
    description = "노력하면 좋은 관계를 유지할 수 있습니다.";
  } else if (finalScore >= 55) {
    grade = "보통 궁합";
    description = "차이점을 이해하고 존중하면 발전할 수 있습니다.";
  } else {
    grade = "노력 필요";
    description = "서로의 다름을 인정하고 배려가 필요합니다.";
  }

  return {
    isSpecialMatch: !!specialMatch,
    matchInfo: specialMatch,
    generalCompatibility: {
      score: finalScore,
      grade,
      description,
    },
    ilganRelation,
  };
}

/**
 * 사주에서 일주 추출
 */
export function extractIlju(saju: SajuApiResult): string {
  // 일주는 dayPillar의 간지
  return saju.dayPillar?.ganji || "";
}

// 가족 관계 한글 라벨
export const RELATION_LABELS: Record<string, string> = {
  me: "본인",
  parent: "부모님",
  grandparent: "조부모님",
  sibling: "형제/자매",
  child: "자녀",
  spouse: "배우자",
  relative: "친척",
  other: "기타",
};

// 가족 구성원 정보
export interface FamilyMemberInfo {
  name: string;
  relation: string;
  saju: SajuApiResult;
  timeUnknown: boolean;
}

// 구성원 간 궁합 결과
export interface PairCompatibility {
  member1Index: number;
  member2Index: number;
  member1Name: string;
  member2Name: string;
  member1Relation: string;
  member2Relation: string;
  compatibility: CompatibilityResult;
}

// 오행 상세 분석
export interface OhengDetailAnalysis {
  element: string;
  count: number;
  percentage: number;
  status: "과잉" | "적정" | "부족";
  meaning: string;
  advice: string;
  compensators: string[]; // 이 오행을 보완해주는 구성원 이름들
}

// 상호 보완 관계
export interface ComplementaryRelation {
  giverName: string;
  giverRelation: string;
  receiverName: string;
  receiverRelation: string;
  giverElement: string;
  receiverLackElement: string;
  description: string;
  benefit: string;           // 보완 효과 요약
  specificEffects: string[]; // 구체적인 효과들
}

// 가족 역할
export interface FamilyRole {
  memberName: string;
  memberRelation: string;
  role: string;
  roleDescription: string;
  element: string;
  strengths: string[];
}

// 관계별 특성 분석
export interface RelationTypeAnalysis {
  relationType: string; // "부모-자녀", "형제", "부부" 등
  pairs: {
    member1Name: string;
    member1Relation: string;
    member2Name: string;
    member2Relation: string;
    score: number;
    characteristics: string;
    advice: string;
  }[];
}

// 가족 분석 전체 결과
export interface FamilyAnalysisResult {
  members: FamilyMemberInfo[];
  pairCompatibilities: PairCompatibility[];
  familyScore: number;
  familyGrade: string;
  familyGradeDescription: string;
  ohengBalance: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  ohengDetailAnalysis: OhengDetailAnalysis[];
  complementaryRelations: ComplementaryRelation[];
  familyRoles: FamilyRole[];
  relationTypeAnalysis: RelationTypeAnalysis[];
  familyStrengths: string[];
  familyWeaknesses: string[];
  familyAdvice: string;
}

/**
 * 가족 등급 계산
 */
function getFamilyGrade(score: number): { grade: string; description: string } {
  if (score >= 85) return { grade: "화목한 가정", description: "가족 모두가 서로를 이해하고 지지하는 아름다운 가정입니다." };
  if (score >= 75) return { grade: "조화로운 가정", description: "전반적으로 좋은 관계를 유지하며, 작은 노력으로 더 좋아질 수 있습니다." };
  if (score >= 65) return { grade: "평범한 가정", description: "일반적인 가정의 모습입니다. 소통에 더 신경 쓰면 좋겠습니다." };
  if (score >= 55) return { grade: "노력이 필요한 가정", description: "갈등 요소가 있지만, 서로 이해하려는 노력이 있다면 극복할 수 있습니다." };
  return { grade: "주의가 필요한 가정", description: "가족 간 차이가 큽니다. 서로의 다름을 인정하고 존중하는 것이 중요합니다." };
}

/**
 * 가족 종합 조언 생성
 */
function generateFamilyAdvice(
  pairCompatibilities: PairCompatibility[],
  familyScore: number,
  ohengBalance: FamilyAnalysisResult["ohengBalance"]
): { strengths: string[]; weaknesses: string[]; advice: string } {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // 오행 균형 분석
  const ohengValues = Object.values(ohengBalance);
  const maxOheng = Math.max(...ohengValues);
  const minOheng = Math.min(...ohengValues);
  const ohengDiff = maxOheng - minOheng;

  const dominantOheng = (Object.entries(ohengBalance) as [string, number][])
    .filter(([_, v]) => v === maxOheng)
    .map(([k]) => k);
  const weakOheng = (Object.entries(ohengBalance) as [string, number][])
    .filter(([_, v]) => v === minOheng)
    .map(([k]) => k);

  if (ohengDiff <= 2) {
    strengths.push("가족 전체의 오행이 균형 있게 분포되어 있어 조화로운 에너지를 가지고 있습니다.");
  } else {
    if (dominantOheng.length > 0) {
      strengths.push(`가족 전체적으로 ${dominantOheng.join(", ")} 기운이 강해 ${getOhengCharacteristic(dominantOheng[0])} 특성이 두드러집니다.`);
    }
    if (weakOheng.length > 0 && minOheng < 2) {
      weaknesses.push(`${weakOheng.join(", ")} 기운이 부족하여 ${getOhengLack(weakOheng[0])} 보완이 필요합니다.`);
    }
  }

  // 궁합 분석
  const goodPairs = pairCompatibilities.filter(p => p.compatibility.totalScore >= 75);
  const badPairs = pairCompatibilities.filter(p => p.compatibility.totalScore < 55);

  if (goodPairs.length > 0) {
    const bestPair = goodPairs.reduce((a, b) =>
      a.compatibility.totalScore > b.compatibility.totalScore ? a : b
    );
    strengths.push(
      `${bestPair.member1Name}(${RELATION_LABELS[bestPair.member1Relation] || bestPair.member1Relation})와 ` +
      `${bestPair.member2Name}(${RELATION_LABELS[bestPair.member2Relation] || bestPair.member2Relation}) 사이의 ` +
      `궁합이 특히 좋아(${bestPair.compatibility.totalScore}점) 가족의 중심축이 됩니다.`
    );
  }

  if (badPairs.length > 0) {
    const worstPair = badPairs.reduce((a, b) =>
      a.compatibility.totalScore < b.compatibility.totalScore ? a : b
    );
    weaknesses.push(
      `${worstPair.member1Name}(${RELATION_LABELS[worstPair.member1Relation] || worstPair.member1Relation})와 ` +
      `${worstPair.member2Name}(${RELATION_LABELS[worstPair.member2Relation] || worstPair.member2Relation}) 사이에 ` +
      `갈등 요소가 있습니다(${worstPair.compatibility.totalScore}점). 서로의 차이를 이해하려는 노력이 필요합니다.`
    );
  }

  // 종합 조언 생성
  let advice = "";
  if (familyScore >= 85) {
    advice = "가족 모두가 서로를 이해하고 지지하는 아름다운 관계입니다. " +
      "이 좋은 기운을 유지하기 위해 정기적인 가족 모임과 대화의 시간을 갖는 것이 좋습니다. " +
      "서로에게 감사를 표현하고, 함께하는 시간을 소중히 여기세요.";
  } else if (familyScore >= 75) {
    advice = "전반적으로 조화로운 가족 관계를 유지하고 있습니다. " +
      `${badPairs.length > 0 ? "일부 갈등 요소가 있지만, 서로 이해하려는 마음으로 극복할 수 있습니다. " : ""}` +
      "가족 구성원 각자의 장점을 인정하고 격려해주세요. 함께 식사하며 대화하는 시간이 관계를 더욱 돈독하게 합니다.";
  } else if (familyScore >= 65) {
    advice = "평범한 가족 관계입니다. 좋은 점도 있고 개선이 필요한 점도 있습니다. " +
      "갈등이 생겼을 때 감정적으로 대응하기보다 차분하게 이야기를 나누세요. " +
      "각자의 공간과 시간을 존중하면서도, 중요한 일은 함께 결정하는 것이 좋습니다. " +
      "작은 것이라도 함께하는 활동을 늘려보세요.";
  } else if (familyScore >= 55) {
    advice = "가족 간에 근본적인 성향 차이가 있어 갈등이 생기기 쉽습니다. " +
      "하지만 가족이기에 서로를 바꾸려 하기보다 있는 그대로를 받아들이는 것이 중요합니다. " +
      "대화할 때는 '너'보다 '나'를 주어로 사용하여 감정을 표현하세요. " +
      "필요하다면 가족 상담을 받아보는 것도 도움이 됩니다.";
  } else {
    advice = "가족 구성원 간 차이가 커서 갈등이 자주 발생할 수 있습니다. " +
      "하지만 사주는 경향성일 뿐, 운명을 결정하지 않습니다. " +
      "서로 다르다는 것을 인정하고, 그 다름이 오히려 가족을 더 풍요롭게 만들 수 있음을 기억하세요. " +
      "갈등 상황에서는 24시간 냉각 시간을 두고, 차분해진 후 대화하세요. " +
      "전문 가족 상담사의 도움을 받는 것을 권장합니다.";
  }

  return { strengths, weaknesses, advice };
}

/**
 * 오행 특성 설명
 */
function getOhengCharacteristic(oheng: string): string {
  const characteristics: Record<string, string> = {
    목: "성장과 발전, 창의성",
    화: "열정과 활력, 표현력",
    토: "안정과 신뢰, 중재력",
    금: "결단력과 정의감, 원칙",
    수: "지혜와 유연성, 포용력",
  };
  return characteristics[oheng] || "";
}

/**
 * 오행 부족 시 설명
 */
function getOhengLack(oheng: string): string {
  const lacks: Record<string, string> = {
    목: "계획성과 추진력의",
    화: "열정과 적극성의",
    토: "안정감과 신뢰의",
    금: "결단력과 실행력의",
    수: "유연성과 소통의",
  };
  return lacks[oheng] || "";
}

/**
 * 오행 상세 정보
 */
const OHENG_DETAIL_INFO: Record<string, {
  meaning: string;
  excess: string;
  lack: string;
  role: string;
  roleDescription: string;
  strengths: string[];
}> = {
  목: {
    meaning: "성장, 발전, 창의성, 계획, 시작의 기운",
    excess: "가족 내 변화와 도전 욕구가 강해 안정감이 부족할 수 있습니다. 때로는 현실에 안주하는 여유도 필요합니다.",
    lack: "새로운 시작이나 변화에 소극적일 수 있습니다. 가족이 함께 새로운 활동을 시도해보세요.",
    role: "개척자",
    roleDescription: "새로운 아이디어와 변화를 이끄는 역할입니다. 가족에게 신선한 자극을 줍니다.",
    strengths: ["창의적 문제해결", "새로운 시도 주도", "성장 동력 제공"],
  },
  화: {
    meaning: "열정, 활력, 표현, 소통, 따뜻함의 기운",
    excess: "감정 표현이 격해지기 쉽고 충동적인 결정이 있을 수 있습니다. 차분함을 의식적으로 유지하세요.",
    lack: "가족 분위기가 다소 차갑거나 활력이 부족할 수 있습니다. 함께 즐거운 활동을 늘려보세요.",
    role: "동력원",
    roleDescription: "가족에게 활력과 열정을 불어넣는 역할입니다. 분위기 메이커입니다.",
    strengths: ["분위기 활성화", "적극적 소통", "열정적 참여"],
  },
  토: {
    meaning: "안정, 신뢰, 중재, 포용, 든든함의 기운",
    excess: "변화를 거부하고 고집이 세질 수 있습니다. 새로운 것에 대한 유연성을 기르세요.",
    lack: "가족의 중심이 흔들리기 쉽습니다. 정기적인 가족 모임으로 유대감을 강화하세요.",
    role: "조율자",
    roleDescription: "가족 간 갈등을 중재하고 균형을 잡아주는 역할입니다. 가족의 중심입니다.",
    strengths: ["갈등 중재", "안정감 제공", "균형 유지"],
  },
  금: {
    meaning: "결단력, 정의, 원칙, 실행력, 책임의 기운",
    excess: "규칙과 원칙에 엄격해 융통성이 부족할 수 있습니다. 예외를 인정하는 너그러움도 필요합니다.",
    lack: "결정이 늦어지거나 실행력이 부족할 수 있습니다. 작은 일부터 결단하는 연습을 하세요.",
    role: "실행자",
    roleDescription: "계획을 실행에 옮기고 책임지는 역할입니다. 가족의 약속을 지킵니다.",
    strengths: ["결단력", "책임감", "원칙 수호"],
  },
  수: {
    meaning: "지혜, 유연성, 포용, 적응력, 깊이의 기운",
    excess: "깊이 생각하느라 결정이 늦어지고 우유부단해 보일 수 있습니다. 때론 직관을 믿으세요.",
    lack: "소통이 부족하거나 서로의 마음을 이해하기 어려울 수 있습니다. 대화 시간을 늘리세요.",
    role: "지혜자",
    roleDescription: "깊은 통찰로 가족에게 조언하는 역할입니다. 어려운 상황에서 해답을 제시합니다.",
    strengths: ["통찰력", "경청", "지혜로운 조언"],
  },
};

/**
 * 오행 보완 효과 데이터
 * - 부족한 오행이 보완되면 어떤 효과가 있는지 설명
 */
const OHENG_COMPLEMENT_BENEFITS: Record<string, {
  benefit: string;
  specificEffects: string[];
}> = {
  목: {
    benefit: "계획성과 추진력이 강화됩니다",
    specificEffects: [
      "새로운 시작에 대한 용기가 생깁니다",
      "창의력과 아이디어가 풍부해집니다",
      "성장과 발전의 동력을 얻습니다",
      "도전 정신이 높아집니다"
    ]
  },
  화: {
    benefit: "열정과 표현력이 강화됩니다",
    specificEffects: [
      "대인관계가 활발해집니다",
      "적극적인 소통 능력이 향상됩니다",
      "활력과 에너지가 증가합니다",
      "감정 표현이 자연스러워집니다"
    ]
  },
  토: {
    benefit: "안정감과 신뢰가 강화됩니다",
    specificEffects: [
      "마음의 중심이 잡힙니다",
      "꾸준함과 인내력이 향상됩니다",
      "신뢰할 수 있는 관계가 구축됩니다",
      "현실적인 판단력이 좋아집니다"
    ]
  },
  금: {
    benefit: "결단력과 실행력이 강화됩니다",
    specificEffects: [
      "명확한 판단력이 향상됩니다",
      "일 처리 능력이 상승합니다",
      "원칙과 정의감이 확립됩니다",
      "책임감이 강해집니다"
    ]
  },
  수: {
    benefit: "지혜와 유연성이 강화됩니다",
    specificEffects: [
      "깊은 사고력이 향상됩니다",
      "소통과 경청 능력이 증가합니다",
      "적응력이 강화됩니다",
      "통찰력이 깊어집니다"
    ]
  }
};

/**
 * 오행 상세 분석 생성
 */
function analyzeOhengDetail(
  ohengBalance: FamilyAnalysisResult["ohengBalance"],
  members: FamilyMemberInfo[]
): OhengDetailAnalysis[] {
  const total = Object.values(ohengBalance).reduce((sum, v) => sum + v, 0);
  const average = total / 5;
  const results: OhengDetailAnalysis[] = [];

  for (const [element, count] of Object.entries(ohengBalance)) {
    const percentage = Math.round((count / total) * 100);
    let status: "과잉" | "적정" | "부족";
    let meaning: string;
    let advice: string;

    const info = OHENG_DETAIL_INFO[element];

    if (count > average * 1.5) {
      status = "과잉";
      meaning = `${info.meaning} - 가족 전체에 ${element} 기운이 넘칩니다.`;
      advice = info.excess;
    } else if (count < average * 0.5) {
      status = "부족";
      meaning = `${info.meaning} - 가족 전체에 ${element} 기운이 부족합니다.`;
      advice = info.lack;
    } else {
      status = "적정";
      meaning = `${info.meaning} - 적절한 수준입니다.`;
      advice = `${element} 기운이 균형 있게 유지되고 있습니다. 현재 상태를 잘 유지하세요.`;
    }

    // 이 오행을 많이 가진 구성원 찾기 (보완자)
    const compensators = members
      .filter(m => m.saju.ohengCount[element as keyof typeof m.saju.ohengCount] >= 2)
      .map(m => m.name || "이름없음");

    results.push({
      element,
      count,
      percentage,
      status,
      meaning,
      advice,
      compensators,
    });
  }

  return results;
}

/**
 * 상호 보완 관계 분석
 */
function analyzeComplementaryRelations(
  members: FamilyMemberInfo[]
): ComplementaryRelation[] {
  const relations: ComplementaryRelation[] = [];
  const ohengOrder = ["목", "화", "토", "금", "수"];

  // 각 구성원의 부족한 오행 찾기
  for (const receiver of members) {
    const receiverOheng = receiver.saju.ohengCount;
    const totalOheng = Object.values(receiverOheng).reduce((sum, v) => sum + v, 0);
    const avgOheng = totalOheng / 5;

    // 부족한 오행 찾기 (평균의 50% 미만)
    const lackElements = ohengOrder.filter(
      e => receiverOheng[e as keyof typeof receiverOheng] < avgOheng * 0.5
    );

    for (const lackElement of lackElements) {
      // 이 오행을 보완해줄 수 있는 구성원 찾기
      for (const giver of members) {
        if (giver === receiver) continue;

        const giverOheng = giver.saju.ohengCount;
        const giverTotal = Object.values(giverOheng).reduce((sum, v) => sum + v, 0);
        const giverAvg = giverTotal / 5;

        // 이 오행이 풍부한 사람 (평균의 150% 이상)
        if (giverOheng[lackElement as keyof typeof giverOheng] >= giverAvg * 1.5) {
          const info = OHENG_DETAIL_INFO[lackElement];
          const benefitInfo = OHENG_COMPLEMENT_BENEFITS[lackElement];
          relations.push({
            giverName: giver.name || "구성원",
            giverRelation: giver.relation,
            receiverName: receiver.name || "구성원",
            receiverRelation: receiver.relation,
            giverElement: lackElement,
            receiverLackElement: lackElement,
            description: `${giver.name}의 강한 ${lackElement}(${info.meaning.split(",")[0]}) 기운이 ${receiver.name}에게 부족한 ${lackElement} 기운을 보완해줍니다.`,
            benefit: benefitInfo.benefit,
            specificEffects: benefitInfo.specificEffects,
          });
        }
      }
    }
  }

  return relations;
}

/**
 * 가족 역할 분석
 */
function analyzeFamilyRoles(members: FamilyMemberInfo[]): FamilyRole[] {
  const roles: FamilyRole[] = [];
  const ohengOrder = ["목", "화", "토", "금", "수"] as const;

  for (const member of members) {
    const oheng = member.saju.ohengCount;
    const total = Object.values(oheng).reduce((sum, v) => sum + v, 0);

    // 가장 강한 오행 찾기
    let maxElement = "토";
    let maxCount = 0;

    for (const e of ohengOrder) {
      if (oheng[e] > maxCount) {
        maxCount = oheng[e];
        maxElement = e;
      }
    }

    const info = OHENG_DETAIL_INFO[maxElement];
    roles.push({
      memberName: member.name || "구성원",
      memberRelation: member.relation,
      role: info.role,
      roleDescription: info.roleDescription,
      element: maxElement,
      strengths: info.strengths,
    });
  }

  return roles;
}

/**
 * 관계 유형 판별
 */
function getRelationType(relation1: string, relation2: string): string | null {
  const parentRelations = ["parent", "grandparent"];
  const childRelations = ["child"];
  const siblingRelations = ["sibling"];
  const spouseRelations = ["spouse"];

  // 부모-자녀 관계
  if (
    (parentRelations.includes(relation1) && (childRelations.includes(relation2) || relation2 === "me")) ||
    (parentRelations.includes(relation2) && (childRelations.includes(relation1) || relation1 === "me")) ||
    (relation1 === "me" && parentRelations.includes(relation2)) ||
    (relation2 === "me" && parentRelations.includes(relation1))
  ) {
    return "부모-자녀";
  }

  // 형제 관계
  if (siblingRelations.includes(relation1) || siblingRelations.includes(relation2)) {
    if (relation1 === "me" || relation2 === "me" || siblingRelations.includes(relation1) && siblingRelations.includes(relation2)) {
      return "형제";
    }
  }

  // 부부 관계
  if (spouseRelations.includes(relation1) || spouseRelations.includes(relation2)) {
    return "부부";
  }

  // 조부모-손자녀
  if (
    (relation1 === "grandparent" && (relation2 === "me" || childRelations.includes(relation2))) ||
    (relation2 === "grandparent" && (relation1 === "me" || childRelations.includes(relation1)))
  ) {
    return "조부모-손자녀";
  }

  return null;
}

/**
 * 관계 유형별 특성 및 조언
 */
const RELATION_TYPE_ADVICE: Record<string, {
  highScore: { characteristics: string; advice: string };
  midScore: { characteristics: string; advice: string };
  lowScore: { characteristics: string; advice: string };
}> = {
  "부모-자녀": {
    highScore: {
      characteristics: "서로를 깊이 이해하고 존중하는 이상적인 부모-자녀 관계입니다. 자연스러운 소통이 이루어집니다.",
      advice: "이 좋은 관계를 유지하면서, 자녀의 독립심도 존중해주세요. 부모의 경험과 자녀의 새로운 시각이 조화를 이룹니다.",
    },
    midScore: {
      characteristics: "일반적인 부모-자녀 관계입니다. 때로는 세대 차이로 의견 충돌이 있지만 기본적인 유대는 견고합니다.",
      advice: "서로의 입장에서 생각해보는 시간을 가지세요. 부모는 조언하되 강요하지 않고, 자녀는 경청하되 자신의 생각도 표현하세요.",
    },
    lowScore: {
      characteristics: "근본적인 성향 차이로 갈등이 자주 발생할 수 있습니다. 기대와 현실의 간극이 클 수 있습니다.",
      advice: "서로를 바꾸려 하기보다 다름을 인정하세요. 짧지만 질 좋은 대화를 자주 나누고, 공통 관심사를 찾아보세요.",
    },
  },
  "형제": {
    highScore: {
      characteristics: "서로를 가장 잘 이해하는 든든한 형제 관계입니다. 경쟁보다 협력이 자연스럽습니다.",
      advice: "평생의 동반자로서 서로의 성장을 응원하세요. 각자의 영역을 존중하면서도 어려울 때 힘이 되어주세요.",
    },
    midScore: {
      characteristics: "일반적인 형제 관계로, 때로는 다투지만 결국 화해하는 사이입니다.",
      advice: "어린 시절의 경쟁심을 내려놓고 성인으로서 새로운 관계를 만들어가세요. 정기적인 연락과 모임이 도움됩니다.",
    },
    lowScore: {
      characteristics: "성향 차이가 커서 가까이 있으면 충돌하기 쉽습니다. 하지만 피는 물보다 진합니다.",
      advice: "적당한 거리를 유지하면서 서로를 존중하세요. 비교하지 말고 각자의 길을 인정해주세요.",
    },
  },
  "부부": {
    highScore: {
      characteristics: "서로를 보완하며 함께 성장하는 이상적인 부부 관계입니다. 갈등도 성숙하게 해결합니다.",
      advice: "좋은 관계에 안주하지 말고 계속 노력하세요. 서로에게 감사를 표현하고, 둘만의 시간을 소중히 하세요.",
    },
    midScore: {
      characteristics: "일반적인 부부 관계로, 장단점이 공존합니다. 서로 맞춰가는 과정에 있습니다.",
      advice: "상대방의 변화를 기대하기보다 나부터 변화하세요. 정기적인 대화 시간을 갖고, 작은 것에 감사하세요.",
    },
    lowScore: {
      characteristics: "근본적인 성향 차이가 있어 갈등이 잦을 수 있습니다. 하지만 다름이 오히려 보완이 될 수 있습니다.",
      advice: "서로의 다름을 결점이 아닌 특성으로 받아들이세요. 필요하다면 전문 상담을 받는 것도 좋습니다.",
    },
  },
  "조부모-손자녀": {
    highScore: {
      characteristics: "세대를 넘어 깊은 유대감이 있습니다. 조부모의 지혜와 손자녀의 활력이 조화롭습니다.",
      advice: "자주 만나고 소통하세요. 조부모의 이야기와 손자녀의 새로운 세계가 서로에게 선물이 됩니다.",
    },
    midScore: {
      characteristics: "일반적인 조손 관계입니다. 세대 차이가 있지만 기본적인 애정은 있습니다.",
      advice: "각자의 방식으로 사랑을 표현하세요. 조부모는 경험을, 손자녀는 새로운 것을 나눠주세요.",
    },
    lowScore: {
      characteristics: "세대 차이가 커서 서로를 이해하기 어려울 수 있습니다.",
      advice: "공통 관심사를 찾아보세요. 함께 식사하거나 산책하는 것만으로도 관계가 좋아질 수 있습니다.",
    },
  },
};

/**
 * 관계별 특성 분석
 */
function analyzeRelationTypes(
  pairCompatibilities: PairCompatibility[]
): RelationTypeAnalysis[] {
  const relationGroups: Record<string, RelationTypeAnalysis["pairs"]> = {};

  for (const pair of pairCompatibilities) {
    const relationType = getRelationType(pair.member1Relation, pair.member2Relation);
    if (!relationType) continue;

    if (!relationGroups[relationType]) {
      relationGroups[relationType] = [];
    }

    const score = pair.compatibility.totalScore;
    const adviceInfo = RELATION_TYPE_ADVICE[relationType];

    let characteristics: string;
    let advice: string;

    if (score >= 75) {
      characteristics = adviceInfo.highScore.characteristics;
      advice = adviceInfo.highScore.advice;
    } else if (score >= 55) {
      characteristics = adviceInfo.midScore.characteristics;
      advice = adviceInfo.midScore.advice;
    } else {
      characteristics = adviceInfo.lowScore.characteristics;
      advice = adviceInfo.lowScore.advice;
    }

    relationGroups[relationType].push({
      member1Name: pair.member1Name,
      member1Relation: pair.member1Relation,
      member2Name: pair.member2Name,
      member2Relation: pair.member2Relation,
      score,
      characteristics,
      advice,
    });
  }

  return Object.entries(relationGroups).map(([relationType, pairs]) => ({
    relationType,
    pairs,
  }));
}

/**
 * 가족 통합 분석 메인 함수
 */
export function analyzeFamilyCompatibility(
  members: FamilyMemberInfo[]
): FamilyAnalysisResult {
  // 2명 이상이어야 분석 가능
  if (members.length < 2) {
    throw new Error("가족 분석을 위해 최소 2명의 구성원이 필요합니다.");
  }

  // 모든 구성원 조합의 궁합 분석
  const pairCompatibilities: PairCompatibility[] = [];
  for (let i = 0; i < members.length; i++) {
    for (let j = i + 1; j < members.length; j++) {
      const compatibility = analyzeCompatibility(members[i].saju, members[j].saju);
      pairCompatibilities.push({
        member1Index: i,
        member2Index: j,
        member1Name: members[i].name || `구성원 ${i + 1}`,
        member2Name: members[j].name || `구성원 ${j + 1}`,
        member1Relation: members[i].relation,
        member2Relation: members[j].relation,
        compatibility,
      });
    }
  }

  // 가족 전체 점수 계산 (모든 쌍의 평균)
  const familyScore = Math.round(
    pairCompatibilities.reduce((sum, p) => sum + p.compatibility.totalScore, 0) /
    pairCompatibilities.length
  );

  const { grade: familyGrade, description: familyGradeDescription } = getFamilyGrade(familyScore);

  // 가족 전체 오행 균형 계산
  const ohengBalance = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  for (const member of members) {
    ohengBalance.목 += member.saju.ohengCount.목;
    ohengBalance.화 += member.saju.ohengCount.화;
    ohengBalance.토 += member.saju.ohengCount.토;
    ohengBalance.금 += member.saju.ohengCount.금;
    ohengBalance.수 += member.saju.ohengCount.수;
  }

  // 종합 조언 생성
  const { strengths, weaknesses, advice } = generateFamilyAdvice(
    pairCompatibilities,
    familyScore,
    ohengBalance
  );

  // 오행 상세 분석
  const ohengDetailAnalysis = analyzeOhengDetail(ohengBalance, members);

  // 상호 보완 관계 분석
  const complementaryRelations = analyzeComplementaryRelations(members);

  // 가족 역할 분석
  const familyRoles = analyzeFamilyRoles(members);

  // 관계별 특성 분석
  const relationTypeAnalysis = analyzeRelationTypes(pairCompatibilities);

  return {
    members,
    pairCompatibilities,
    familyScore,
    familyGrade,
    familyGradeDescription,
    ohengBalance,
    ohengDetailAnalysis,
    complementaryRelations,
    familyRoles,
    relationTypeAnalysis,
    familyStrengths: strengths,
    familyWeaknesses: weaknesses,
    familyAdvice: advice,
  };
}
