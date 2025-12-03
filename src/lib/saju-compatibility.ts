/**
 * 커플 궁합 분석 로직
 * - 일간 관계 분석
 * - 오행 상생/상극 분석
 * - 지지 관계 분석
 */

import type { SajuApiResult } from "@/types/saju";

// ============================================
// 오행 상세 의미 데이터 (궁합 분석용)
// ============================================

interface OhengMeaning {
  name: string;           // 한자명
  friendlyName: string;   // 친근한 이름
  emoji: string;          // 이모지
  theme: string;          // 핵심 테마
  lifeAspects: string[];  // 삶에서 의미하는 것들
  lackingDescription: string;  // 부족할 때 어떤 점이 힘든지
  partnerFillsDescription: string;  // 상대방이 채워주면 어떻게 좋은지
  togetherBenefit: string;  // 함께하면 생기는 이점
}

const OHENG_MEANINGS: Record<string, OhengMeaning> = {
  목: {
    name: "목",
    friendlyName: "나무",
    emoji: "🌳",
    theme: "추진력 · 성장",
    lifeAspects: ["새로운 시작", "계획 수립", "도전 정신", "진취성", "창의적 아이디어"],
    lackingDescription: "새로운 일을 시작하거나 계획을 추진하는 데 어려움을 느낄 수 있어요. 결정을 내리기까지 시간이 오래 걸리고, 변화 앞에서 주저하게 되기도 해요.",
    partnerFillsDescription: "상대방의 진취적인 에너지가 함께 도전하고 성장할 용기를 불어넣어 줘요.",
    togetherBenefit: "새로운 일에 함께 도전하고, 서로의 꿈을 향해 나아갈 수 있어요.",
  },
  화: {
    name: "화",
    friendlyName: "불",
    emoji: "🔥",
    theme: "열정 · 표현력",
    lifeAspects: ["감정 표현", "적극성", "사교 활동", "열정", "활력"],
    lackingDescription: "감정을 표현하거나 적극적으로 나서는 게 어려울 수 있어요. 소극적으로 보이거나, 사람들 앞에서 자신을 드러내기 힘들어해요.",
    partnerFillsDescription: "상대방의 밝고 활발한 에너지가 삶에 활력을 불어넣어 줘요.",
    togetherBenefit: "더 활기차고 즐거운 일상을 만들어가며, 사회적 활동도 함께 즐길 수 있어요.",
  },
  토: {
    name: "토",
    friendlyName: "흙",
    emoji: "🏔️",
    theme: "안정 · 신뢰",
    lifeAspects: ["안정감", "현실 감각", "중심 잡기", "신뢰", "꾸준함"],
    lackingDescription: "마음의 중심을 잡거나 안정감을 느끼기 어려울 수 있어요. 현실적인 판단보다 감정에 휘둘리거나, 불안함을 자주 느껴요.",
    partnerFillsDescription: "상대방의 든든하고 현실적인 성향이 마음의 안정감을 줘요.",
    togetherBenefit: "관계에 안정적인 기반이 생기고, 서로를 믿고 의지할 수 있어요.",
  },
  금: {
    name: "금",
    friendlyName: "쇠",
    emoji: "⚔️",
    theme: "결단력 · 실행력",
    lifeAspects: ["결정력", "원칙", "정리 정돈", "실행력", "마무리"],
    lackingDescription: "결정을 내리거나 일을 마무리하는 게 어려울 수 있어요. 이것저것 고민만 하다가 흐지부지되거나, 우선순위를 정하기 힘들어해요.",
    partnerFillsDescription: "상대방의 명확하고 단호한 성향이 결정과 실행을 도와줘요.",
    togetherBenefit: "계획을 세우고 실행하는 데 탄력이 붙고, 일을 끝까지 마무리할 수 있어요.",
  },
  수: {
    name: "수",
    friendlyName: "물",
    emoji: "💧",
    theme: "지혜 · 유연함",
    lifeAspects: ["유연한 사고", "깊은 생각", "적응력", "지혜", "감정 이해"],
    lackingDescription: "상황에 맞게 유연하게 대처하거나 깊이 생각하는 게 어려울 수 있어요. 고집이 세거나, 변화에 적응하는 데 시간이 오래 걸려요.",
    partnerFillsDescription: "상대방의 유연하고 지혜로운 대처가 여유와 깊이를 더해줘요.",
    togetherBenefit: "예상치 못한 상황에서도 함께 유연하게 대처하고, 서로의 감정을 깊이 이해할 수 있어요.",
  },
};

// 오행 상극 관계별 갈등 설명
interface SanggeukConflict {
  element1: string;
  element2: string;
  theme: string;
  description: string;
  warning: string;
  advice: string;
}

const SANGGEUK_CONFLICTS: Record<string, SanggeukConflict> = {
  "목토": {
    element1: "목",
    element2: "토",
    theme: "성장 vs 안정",
    description: "한 분은 새로운 것을 시도하고 확장하려 하고, 다른 분은 현재에 만족하며 안정을 추구해요.",
    warning: "도전하자는 쪽과 지키자는 쪽이 부딪힐 수 있어요.",
    advice: "무엇을 도전하고 무엇을 지킬지 함께 정해보세요. 둘 다 옳은 방향이에요.",
  },
  "금화": {
    element1: "금",
    element2: "화",
    theme: "열정 vs 원칙",
    description: "한 분은 감정대로, 분위기대로 행동하고, 다른 분은 규칙과 계획을 중요시해요.",
    warning: "즉흥적인 행동이 계획을 망친다고 느끼거나, 원칙이 답답하게 느껴질 수 있어요.",
    advice: "'네 방식도 이유가 있구나'라고 인정하는 것부터 시작해보세요.",
  },
  "수토": {
    element1: "수",
    element2: "토",
    theme: "고정 vs 변화",
    description: "한 분은 안정과 일관성을 원하고, 다른 분은 흐름에 맡기며 변화를 즐겨요.",
    warning: "변화를 거부하는 것처럼 보이거나, 너무 갈대 같다고 느낄 수 있어요.",
    advice: "변하지 않아야 할 것과 변해도 괜찮은 것을 함께 정해보세요.",
  },
  "금목": {
    element1: "금",
    element2: "목",
    theme: "정리 vs 확장",
    description: "한 분은 정리하고 줄이려 하고, 다른 분은 키우고 늘리려 해요.",
    warning: "비우자는 쪽과 채우자는 쪽이 부딪힐 수 있어요.",
    advice: "각자의 영역을 정해서 한쪽은 정리, 한쪽은 확장을 맡아보세요.",
  },
  "수화": {
    element1: "수",
    element2: "화",
    theme: "신중함 vs 열정",
    description: "한 분은 깊이 생각하고 신중하게 행동하고, 다른 분은 뜨겁게 바로 움직여요.",
    warning: "속도 차이로 답답하거나 성급하다고 느낄 수 있어요.",
    advice: "큰 결정은 신중하게, 작은 일은 즉흥적으로 - 상황에 따라 번갈아 해보세요.",
  },
};

// 오행 이름을 친근한 형식으로 변환 (예: "목" → "나무(목)")
function getOhengFriendlyName(oheng: string): string {
  const info = OHENG_MEANINGS[oheng];
  return info ? `${info.friendlyName}(${info.name})` : oheng;
}

// 십신(十神) 상세 설명
const SIPSIN_DESCRIPTIONS: Record<string, string> = {
  비견: "비견(比肩)은 나와 같은 오행으로, 친구나 동료 같은 관계입니다. 서로 대등한 위치에서 경쟁하기도 하고 협력하기도 합니다. 비슷한 성향이라 이해는 빠르지만, 주도권 다툼이 생길 수 있습니다.",
  겁재: "겁재(劫財)는 나와 비슷한 오행으로, 형제자매나 가까운 동료 같은 관계입니다. 서로 도움을 주고받지만, 때로는 재물이나 이익 문제로 갈등이 생길 수 있습니다.",
  식신: "식신(食神)은 내가 자연스럽게 표현하고 베푸는 관계입니다. 편안하고 여유로운 분위기를 만들며, 서로의 성장을 도와줍니다. 가장 조화로운 관계 중 하나입니다.",
  상관: "상관(傷官)은 창의적이고 자유로운 표현의 관계입니다. 새로운 것을 함께 시도하고 활발하게 소통합니다. 단, 갈등 시 말로 상처를 줄 수 있어 언어 표현에 주의가 필요합니다.",
  편재: "편재(偏財)는 현실적이고 실용적인 파트너십입니다. 재물과 실질적인 면에서 도움을 주고받습니다. 감정보다 실리 중심이 될 수 있어 정서적 교류에 신경 써야 합니다.",
  정재: "정재(正財)는 가장 안정적인 인연 중 하나입니다. 신뢰를 바탕으로 오래 지속되는 관계이며, 서로에게 든든한 파트너가 됩니다. 다만 변화가 적어 지루해질 수 있습니다.",
  편관: "편관(偏官)은 긴장과 자극이 있는 관계입니다. 강렬한 끌림이 있지만, 한쪽이 다른 쪽을 통제하거나 억누르려 할 수 있습니다. 갈등이 잦고 스트레스가 생기기 쉬우니 서로 존중하는 태도가 중요합니다.",
  정관: "정관(正官)은 책임감과 규율이 있는 관계입니다. 서로 예의를 지키고 신뢰를 쌓아갑니다. 다만 형식적이고 딱딱해질 수 있어, 자유로운 소통을 위한 노력이 필요합니다.",
  편인: "편인(偏印)은 지적 교감과 영감을 나누는 관계입니다. 깊은 대화가 가능하고 서로에게 배울 점이 많습니다. 다만 현실보다 이상에 치우칠 수 있어 균형이 필요합니다.",
  정인: "정인(正印)은 정서적으로 가장 안정적인 관계입니다. 따뜻하게 보살피고 지지해주며, 함께 있으면 안정감을 느낍니다. 다만 지나친 의존 관계가 되지 않도록 주의해야 합니다.",
};

// 일간 궁합 관계 (긍정/부정 균형)
const ILGAN_COMPATIBILITY: Record<string, Record<string, {
  score: number;
  type: string;
  description: string;
  positive: string[];
  negative: string[];
}>> = {
  // 갑목
  갑: {
    갑: { score: 60, type: "비견", description: "같은 성향으로 경쟁 관계", positive: ["서로 이해가 빠름", "동등한 파트너십"], negative: ["주도권 다툼 가능", "양보가 어려움"] },
    을: { score: 70, type: "겁재", description: "비슷하지만 보완적", positive: ["서로 도움이 됨", "협력이 가능"], negative: ["질투나 시기 발생 가능", "재물 문제 갈등"] },
    병: { score: 85, type: "식신", description: "자연스러운 지원 관계", positive: ["편안한 관계", "서로 성장 도움"], negative: ["지나친 편안함에 나태해질 수 있음"] },
    정: { score: 80, type: "상관", description: "창의적 시너지", positive: ["새로운 것 함께 도전", "활발한 소통"], negative: ["갈등 시 말로 상처줄 수 있음", "감정 기복"] },
    무: { score: 75, type: "편재", description: "현실적 파트너십", positive: ["실질적 도움", "재물운 상승"], negative: ["물질 중심 관계 될 수 있음", "감정 교류 부족"] },
    기: { score: 90, type: "정재", description: "안정적인 인연", positive: ["신뢰 기반 관계", "오래 지속됨"], negative: ["변화 없이 지루해질 수 있음"] },
    경: { score: 50, type: "편관", description: "긴장과 통제 관계", positive: ["서로 자극이 됨", "성장 동력"], negative: ["스트레스 많음", "한쪽이 억눌림", "갈등 잦음"] },
    신: { score: 55, type: "정관", description: "책임감 있는 관계", positive: ["서로 예의 지킴", "신뢰 형성"], negative: ["딱딱하고 형식적", "자유로움 부족"] },
    임: { score: 80, type: "편인", description: "지적 교감", positive: ["깊은 대화 가능", "서로 배움"], negative: ["현실감각 부족할 수 있음"] },
    계: { score: 85, type: "정인", description: "정서적 안정", positive: ["따뜻한 보살핌", "안정감"], negative: ["의존적 관계 될 수 있음"] },
  },
  을: {
    갑: { score: 70, type: "겁재", description: "비슷하지만 보완적", positive: ["서로 도움이 됨"], negative: ["주도권 갈등"] },
    을: { score: 60, type: "비견", description: "같은 성향으로 경쟁", positive: ["깊은 공감대"], negative: ["우유부단해질 수 있음", "결정 어려움"] },
    병: { score: 80, type: "상관", description: "창의적 조합", positive: ["재미있는 관계"], negative: ["감정적 충돌 가능"] },
    정: { score: 85, type: "식신", description: "편안한 관계", positive: ["자연스러운 케어"], negative: ["너무 편해서 긴장감 없음"] },
    무: { score: 90, type: "정재", description: "안정적 인연", positive: ["믿음직한 파트너"], negative: ["보수적 성향"] },
    기: { score: 75, type: "편재", description: "현실적 도움", positive: ["실질적 지원"], negative: ["감정보다 실리 중심"] },
    경: { score: 55, type: "정관", description: "통제와 규율", positive: ["안정된 구조"], negative: ["자유 제한", "숨막힘"] },
    신: { score: 50, type: "편관", description: "긴장 관계", positive: ["자극적"], negative: ["스트레스", "억압감", "갈등 多"] },
    임: { score: 85, type: "정인", description: "정서적 교감", positive: ["따뜻한 지지"], negative: ["의존 가능성"] },
    계: { score: 80, type: "편인", description: "지적 연결", positive: ["영감 교환"], negative: ["현실 도피 경향"] },
  },
  병: {
    갑: { score: 85, type: "편인", description: "지원받는 관계", positive: ["성장 도움"], negative: ["한쪽이 희생적"] },
    을: { score: 80, type: "정인", description: "정서적 안정", positive: ["안정감 제공"], negative: ["수동적 관계"] },
    병: { score: 60, type: "비견", description: "열정의 충돌", positive: ["에너지 넘침"], negative: ["둘 다 강해서 충돌", "타협 어려움"] },
    정: { score: 70, type: "겁재", description: "경쟁적 열정", positive: ["서로 자극"], negative: ["질투, 경쟁심"] },
    무: { score: 85, type: "식신", description: "자연스러운 흐름", positive: ["편안함"], negative: ["나태해질 수 있음"] },
    기: { score: 80, type: "상관", description: "창의적 표현", positive: ["재미있음"], negative: ["감정적 충돌"] },
    경: { score: 75, type: "편재", description: "현실적 파트너", positive: ["실질적 도움"], negative: ["감정 소통 부족"] },
    신: { score: 90, type: "정재", description: "안정적 결합", positive: ["신뢰와 안정"], negative: ["변화 부족"] },
    임: { score: 50, type: "편관", description: "극과 극", positive: ["강렬한 끌림"], negative: ["충돌 심함", "물불 관계", "상처 多"] },
    계: { score: 55, type: "정관", description: "억제 관계", positive: ["절제력 생김"], negative: ["자유 제한", "답답함"] },
  },
  정: {
    갑: { score: 80, type: "정인", description: "따뜻한 지지", positive: ["안정감"], negative: ["의존 경향"] },
    을: { score: 85, type: "편인", description: "지적 교류", positive: ["성장 도움"], negative: ["현실성 부족"] },
    병: { score: 70, type: "겁재", description: "열정 경쟁", positive: ["활력"], negative: ["주도권 갈등"] },
    정: { score: 60, type: "비견", description: "같은 불꽃", positive: ["깊은 공감"], negative: ["둘 다 예민해서 상처 주고받음"] },
    무: { score: 80, type: "상관", description: "창의적 소통", positive: ["표현력 좋음"], negative: ["말로 상처"] },
    기: { score: 85, type: "식신", description: "편안한 케어", positive: ["자연스러운 돌봄"], negative: ["긴장감 없음"] },
    경: { score: 90, type: "정재", description: "이상적 결합", positive: ["안정과 신뢰"], negative: ["고정관념"] },
    신: { score: 75, type: "편재", description: "실질적 관계", positive: ["현실적 도움"], negative: ["감정 교류 부족"] },
    임: { score: 55, type: "정관", description: "규율 관계", positive: ["체계적"], negative: ["자유 부족", "억압감"] },
    계: { score: 50, type: "편관", description: "긴장 관계", positive: ["자극적"], negative: ["갈등 심함", "스트레스 多"] },
  },
  무: {
    갑: { score: 50, type: "편관", description: "목극토 충돌", positive: ["자극과 변화"], negative: ["스트레스 심함", "한쪽이 억눌림", "근본적 갈등"] },
    을: { score: 55, type: "정관", description: "통제 관계", positive: ["안정된 구조"], negative: ["자유 제한"] },
    병: { score: 80, type: "편인", description: "에너지 받음", positive: ["활력 충전"], negative: ["의존 가능"] },
    정: { score: 85, type: "정인", description: "따뜻한 지지", positive: ["정서적 안정"], negative: ["수동적"] },
    무: { score: 60, type: "비견", description: "같은 땅", positive: ["안정감"], negative: ["답답함", "변화 없음", "고집 충돌"] },
    기: { score: 70, type: "겁재", description: "비슷한 성향", positive: ["이해가 빠름"], negative: ["재물 갈등 가능"] },
    경: { score: 85, type: "식신", description: "자연스러운 흐름", positive: ["서로 도움"], negative: ["나태해질 수 있음"] },
    신: { score: 80, type: "상관", description: "창의적 표현", positive: ["새로운 시도"], negative: ["감정적 충돌"] },
    임: { score: 75, type: "편재", description: "재물 인연", positive: ["현실적 도움"], negative: ["물질 중심"] },
    계: { score: 90, type: "정재", description: "안정적 결합", positive: ["신뢰와 지속"], negative: ["변화 부족"] },
  },
  기: {
    갑: { score: 55, type: "정관", description: "규율 관계", positive: ["체계적"], negative: ["딱딱함"] },
    을: { score: 50, type: "편관", description: "목극토 긴장", positive: ["변화 자극"], negative: ["스트레스", "갈등 심함"] },
    병: { score: 85, type: "정인", description: "따뜻한 안정", positive: ["정서적 지지"], negative: ["의존 경향"] },
    정: { score: 80, type: "편인", description: "지적 교류", positive: ["성장"], negative: ["현실성 부족"] },
    무: { score: 70, type: "겁재", description: "비슷한 성향", positive: ["공감대"], negative: ["고집 충돌"] },
    기: { score: 60, type: "비견", description: "같은 흙", positive: ["안정"], negative: ["우유부단", "변화 없음"] },
    경: { score: 80, type: "상관", description: "창의적 조합", positive: ["재미있음"], negative: ["감정 충돌"] },
    신: { score: 85, type: "식신", description: "편안한 관계", positive: ["자연스러움"], negative: ["긴장감 없음"] },
    임: { score: 90, type: "정재", description: "이상적 결합", positive: ["안정과 신뢰"], negative: ["보수적"] },
    계: { score: 75, type: "편재", description: "현실적 도움", positive: ["실질적"], negative: ["감정 소통 부족"] },
  },
  경: {
    갑: { score: 75, type: "편재", description: "재물 인연", positive: ["현실적 도움"], negative: ["물질 중심"] },
    을: { score: 90, type: "정재", description: "안정적 결합", positive: ["신뢰", "오래 감"], negative: ["변화 부족"] },
    병: { score: 50, type: "편관", description: "화극금 충돌", positive: ["강렬한 끌림"], negative: ["심한 갈등", "상처 多", "스트레스"] },
    정: { score: 55, type: "정관", description: "통제 관계", positive: ["절제력"], negative: ["억압감"] },
    무: { score: 80, type: "편인", description: "지원 받음", positive: ["성장 도움"], negative: ["의존 가능"] },
    기: { score: 85, type: "정인", description: "정서적 안정", positive: ["따뜻함"], negative: ["수동적"] },
    경: { score: 60, type: "비견", description: "같은 금속", positive: ["강한 유대"], negative: ["둘 다 강해서 충돌", "타협 어려움"] },
    신: { score: 70, type: "겁재", description: "경쟁 관계", positive: ["서로 자극"], negative: ["질투, 경쟁심"] },
    임: { score: 85, type: "식신", description: "자연스러운 흐름", positive: ["편안함"], negative: ["나태해질 수 있음"] },
    계: { score: 80, type: "상관", description: "창의적 소통", positive: ["활발함"], negative: ["감정적 충돌"] },
  },
  신: {
    갑: { score: 90, type: "정재", description: "이상적 결합", positive: ["안정과 신뢰"], negative: ["고정관념"] },
    을: { score: 75, type: "편재", description: "재물 인연", positive: ["실질적 도움"], negative: ["감정 부족"] },
    병: { score: 55, type: "정관", description: "억제 관계", positive: ["절제"], negative: ["답답함"] },
    정: { score: 50, type: "편관", description: "화극금 긴장", positive: ["자극적"], negative: ["갈등 심함", "스트레스 多"] },
    무: { score: 85, type: "정인", description: "따뜻한 지지", positive: ["안정감"], negative: ["의존 경향"] },
    기: { score: 80, type: "편인", description: "지적 교류", positive: ["성장"], negative: ["현실성 부족"] },
    경: { score: 70, type: "겁재", description: "경쟁적", positive: ["자극"], negative: ["질투"] },
    신: { score: 60, type: "비견", description: "같은 성향", positive: ["공감"], negative: ["둘 다 예리해서 상처", "날카로움"] },
    임: { score: 80, type: "상관", description: "창의적 조합", positive: ["새로운 시도"], negative: ["감정 충돌"] },
    계: { score: 85, type: "식신", description: "편안한 관계", positive: ["자연스러움"], negative: ["긴장감 없음"] },
  },
  임: {
    갑: { score: 85, type: "식신", description: "자연스러운 지원", positive: ["성장 도움"], negative: ["나태해질 수 있음"] },
    을: { score: 80, type: "상관", description: "창의적 소통", positive: ["활발함"], negative: ["감정적 충돌"] },
    병: { score: 75, type: "편재", description: "재물 인연", positive: ["현실적"], negative: ["물질 중심"] },
    정: { score: 90, type: "정재", description: "안정적 결합", positive: ["신뢰", "지속"], negative: ["보수적"] },
    무: { score: 50, type: "편관", description: "토극수 충돌", positive: ["변화 자극"], negative: ["스트레스 심함", "억압", "갈등"] },
    기: { score: 55, type: "정관", description: "통제 관계", positive: ["안정"], negative: ["자유 제한"] },
    경: { score: 80, type: "편인", description: "지원 관계", positive: ["성장"], negative: ["의존"] },
    신: { score: 85, type: "정인", description: "정서적 안정", positive: ["따뜻함"], negative: ["수동적"] },
    임: { score: 60, type: "비견", description: "같은 물", positive: ["깊은 공감"], negative: ["방향 없이 흐름", "우유부단"] },
    계: { score: 70, type: "겁재", description: "비슷한 성향", positive: ["이해 빠름"], negative: ["결정력 부족"] },
  },
  계: {
    갑: { score: 80, type: "상관", description: "창의적 표현", positive: ["새로운 시도"], negative: ["감정 충돌"] },
    을: { score: 85, type: "식신", description: "자연스러운 케어", positive: ["편안함"], negative: ["긴장감 없음"] },
    병: { score: 90, type: "정재", description: "이상적 결합", positive: ["안정과 신뢰"], negative: ["변화 부족"] },
    정: { score: 75, type: "편재", description: "재물 인연", positive: ["현실적"], negative: ["감정 부족"] },
    무: { score: 55, type: "정관", description: "규율 관계", positive: ["체계적"], negative: ["딱딱함"] },
    기: { score: 50, type: "편관", description: "토극수 긴장", positive: ["자극"], negative: ["갈등 심함", "스트레스", "억압"] },
    경: { score: 85, type: "정인", description: "따뜻한 안정", positive: ["안정감"], negative: ["의존"] },
    신: { score: 80, type: "편인", description: "지적 교류", positive: ["성장"], negative: ["현실성 부족"] },
    임: { score: 70, type: "겁재", description: "비슷한 성향", positive: ["공감대"], negative: ["우유부단"] },
    계: { score: 60, type: "비견", description: "같은 물", positive: ["깊은 이해"], negative: ["방향성 부족", "결정 어려움"] },
  },
};

// 지지 육합 (좋은 관계) - 상세 설명 포함
const JIJI_YUKAP: Record<string, { match: string; description: string }> = {
  자: { match: "축", description: "자축합(子丑合) - 물(水)과 흙(土)이 만나 단단한 기반을 형성합니다. 서로의 부족함을 채워주며 안정적인 관계를 만들어갑니다." },
  축: { match: "자", description: "축자합(丑子合) - 흙(土)과 물(水)이 조화를 이루어 현실적이면서도 감성적인 균형을 맞춥니다." },
  인: { match: "해", description: "인해합(寅亥合) - 나무(木)와 물(水)이 상생하여 성장과 발전을 도모합니다. 서로에게 영감을 주고 함께 성장하는 관계입니다." },
  해: { match: "인", description: "해인합(亥寅合) - 물(水)이 나무(木)를 키우듯, 서로를 지지하고 성장시키는 아름다운 조합입니다." },
  묘: { match: "술", description: "묘술합(卯戌合) - 나무(木)와 흙(土)이 만나 실질적인 결과물을 만들어냅니다. 이상과 현실의 균형을 이룹니다." },
  술: { match: "묘", description: "술묘합(戌卯合) - 흙(土)이 나무(木)에게 뿌리내릴 기반을 제공합니다. 안정감 있는 파트너십입니다." },
  진: { match: "유", description: "진유합(辰酉合) - 흙(土)과 쇠(金)가 합하여 강인한 결속력을 보입니다. 목표를 향해 함께 나아가는 관계입니다." },
  유: { match: "진", description: "유진합(酉辰合) - 쇠(金)와 흙(土)이 서로를 단단하게 만듭니다. 신뢰와 책임감이 바탕이 되는 관계입니다." },
  사: { match: "신", description: "사신합(巳申合) - 불(火)과 쇠(金)가 만나 변화와 혁신을 만들어냅니다. 서로의 열정이 시너지를 냅니다." },
  신: { match: "사", description: "신사합(申巳合) - 쇠(金)와 불(火)이 조화를 이루어 활력 넘치는 관계를 형성합니다." },
  오: { match: "미", description: "오미합(午未合) - 불(火)과 흙(土)이 따뜻한 에너지를 만듭니다. 정서적으로 깊이 연결된 관계입니다." },
  미: { match: "오", description: "미오합(未午合) - 흙(土)과 불(火)이 서로를 따뜻하게 감싸며 정서적 안정을 줍니다." },
};

// 지지 충 (충돌 관계) - 상세 설명 포함
const JIJI_CHUNG: Record<string, { match: string; description: string }> = {
  자: { match: "오", description: "자오충(子午沖) - 북방 물(水)과 남방 불(火)의 정면충돌입니다. 감정과 열정이 부딪쳐 갈등이 생기기 쉽습니다. 서로의 페이스를 존중하고 감정 표현 방식의 차이를 인정해야 합니다." },
  오: { match: "자", description: "오자충(午子沖) - 뜨거운 열정과 차가운 이성이 부딪칩니다. 감정적 대응을 피하고 냉정함을 유지하려는 노력이 필요합니다." },
  축: { match: "미", description: "축미충(丑未沖) - 두 흙(土)의 충돌로 가치관과 고집의 대립이 일어납니다. 서로 양보하기 어려워 갈등이 오래갈 수 있으니 타협점을 찾으려 노력해야 합니다." },
  미: { match: "축", description: "미축충(未丑沖) - 서로 다른 신념의 충돌입니다. 상대방의 가치관을 존중하고 무조건적인 설득보다 이해를 먼저 시도해야 합니다." },
  인: { match: "신", description: "인신충(寅申沖) - 나무(木)와 쇠(金)의 충돌로 행동 방식과 추진력의 차이로 갈등이 생깁니다. 각자의 방식을 존중하고 역할 분담을 명확히 하면 오히려 강력한 팀이 될 수 있습니다." },
  신: { match: "인", description: "신인충(申寅沖) - 실행력의 차이로 갈등이 생기기 쉽습니다. 서로의 장점을 인정하고 협력하면 큰 일을 이룰 수 있는 조합이기도 합니다." },
  묘: { match: "유", description: "묘유충(卯酉沖) - 나무(木)와 쇠(金)의 충돌로 소통 방식의 차이가 갈등을 유발합니다. 대화할 때 상대방의 말을 끝까지 듣고 반응하는 연습이 필요합니다." },
  유: { match: "묘", description: "유묘충(酉卯沖) - 표현 방식의 차이로 오해가 생기기 쉽습니다. 진심을 전할 때는 말보다 행동으로 보여주는 것이 효과적입니다." },
  진: { match: "술", description: "진술충(辰戌沖) - 두 흙(土)의 충돌로 권력과 주도권 다툼이 생기기 쉽습니다. 중요한 결정은 함께 상의하고, 각자의 영역을 존중하는 것이 좋습니다." },
  술: { match: "진", description: "술진충(戌辰沖) - 리더십의 충돌입니다. 서로 양보하기 어려우므로 역할을 명확히 분담하는 것이 관계 유지에 도움이 됩니다." },
  사: { match: "해", description: "사해충(巳亥沖) - 불(火)과 물(水)의 충돌로 가장 극렬한 대립입니다. 성격과 생활 방식이 정반대일 수 있어 많은 이해와 인내가 필요합니다." },
  해: { match: "사", description: "해사충(亥巳沖) - 근본적인 기질의 차이가 있습니다. 서로 다르다는 것을 인정하고, 그 다름이 오히려 보완이 될 수 있음을 기억하세요." },
};

// 지지 형 (갈등 관계) - 상세 설명 포함
const JIJI_HYUNG: Record<string, { matches: string[]; descriptions: Record<string, string> }> = {
  인: {
    matches: ["사", "신"],
    descriptions: {
      사: "인사형(寅巳刑) - 무은지형(無恩之刑)으로 은혜를 모르는 형벌입니다. 서로 베풀어도 인정받지 못한다고 느낄 수 있어, 감사의 마음을 자주 표현하는 것이 중요합니다.",
      신: "인신형(寅申刑) - 활동성의 충돌로 서로의 방식에 간섭하다 마찰이 생깁니다. 각자의 방식을 존중하고 결과로 평가하는 자세가 필요합니다."
    }
  },
  사: {
    matches: ["인", "신"],
    descriptions: {
      인: "사인형(巳寅刑) - 기대와 현실의 차이로 갈등이 생깁니다. 서로에 대한 기대치를 낮추고 있는 그대로를 받아들이세요.",
      신: "사신형(巳申刑) - 변화와 안정 사이의 갈등입니다. 서로의 니즈를 균형 있게 충족시키려 노력해야 합니다."
    }
  },
  신: {
    matches: ["인", "사"],
    descriptions: {
      인: "신인형(申寅刑) - 실행 방식의 차이로 충돌합니다. 목표는 같으나 방법이 다름을 인정해야 합니다.",
      사: "신사형(申巳刑) - 계획과 즉흥의 충돌입니다. 중요한 일은 미리 상의하는 습관을 들이세요."
    }
  },
  축: {
    matches: ["술", "미"],
    descriptions: {
      술: "축술형(丑戌刑) - 지세지형(持勢之刑)으로 권력과 체면의 다툼입니다. 서로 낮추려 하지 말고 동등한 파트너로 대하세요.",
      미: "축미형(丑未刑) - 고집과 신념의 충돌입니다. 타협점을 찾기 어려우니 제3자의 조언을 구하는 것도 방법입니다."
    }
  },
  술: {
    matches: ["축", "미"],
    descriptions: {
      축: "술축형(戌丑刑) - 자존심 싸움이 될 수 있습니다. 이기려 하지 말고 관계를 지키려는 마음이 중요합니다.",
      미: "술미형(戌未刑) - 신뢰의 문제가 생기기 쉽습니다. 약속을 지키고 일관된 태도를 유지하세요."
    }
  },
  미: {
    matches: ["축", "술"],
    descriptions: {
      축: "미축형(未丑刑) - 가치관의 대립입니다. 서로의 기준을 강요하지 않는 것이 중요합니다.",
      술: "미술형(未戌刑) - 의심과 오해가 쌓이기 쉽습니다. 솔직하게 대화하고 오해를 즉시 풀어야 합니다."
    }
  },
  자: {
    matches: ["묘"],
    descriptions: {
      묘: "자묘형(子卯刑) - 무례지형(無禮之刑)으로 예의 없는 형벌입니다. 서로에게 무례하게 대하기 쉬우니, 항상 존중하는 태도와 말투를 유지하세요."
    }
  },
  묘: {
    matches: ["자"],
    descriptions: {
      자: "묘자형(卯子刑) - 서로의 행동이 불쾌하게 느껴질 수 있습니다. 감정이 상하면 바로 표현하기보다 잠시 냉정해진 후 대화하세요."
    }
  },
};

// 지지 해 (해로운 관계) - 상세 설명 포함
const JIJI_HAE: Record<string, { match: string; description: string }> = {
  자: { match: "미", description: "자미해(子未害) - 서로의 노력이 무너지기 쉬운 관계입니다. 중요한 결정이나 계획은 상대방과 충분히 상의한 후 진행하고, 각자의 일에 대해 간섭보다 응원을 보내주세요." },
  미: { match: "자", description: "미자해(未子害) - 뜻하지 않게 서로에게 손해를 끼칠 수 있습니다. 재정 문제나 중요한 사안에서는 신중하게 접근하고 투명하게 소통하세요." },
  축: { match: "오", description: "축오해(丑午害) - 서로의 발전을 방해하게 되기 쉽습니다. 상대방의 성장을 진심으로 응원하고, 질투나 견제의 마음을 경계해야 합니다." },
  오: { match: "축", description: "오축해(午丑害) - 열정과 신중함이 충돌합니다. 급하게 결정하지 말고 상대방의 의견을 들어본 후 행동하세요." },
  인: { match: "사", description: "인사해(寅巳害) - 은혜가 원수가 되기 쉬운 관계입니다. 베풀 때 대가를 기대하지 말고, 받을 때는 감사를 충분히 표현하세요." },
  사: { match: "인", description: "사인해(巳寅害) - 서로 도우려다 오히려 해가 되기 쉽습니다. 도움이 필요한지 먼저 물어보고, 원치 않는 도움은 강요하지 마세요." },
  묘: { match: "진", description: "묘진해(卯辰害) - 사소한 오해가 큰 갈등으로 번지기 쉽습니다. 작은 문제도 그때그때 해결하고 넘어가지 않으면 관계가 악화될 수 있습니다." },
  진: { match: "묘", description: "진묘해(辰卯害) - 의견 충돌이 잦고 타협이 어렵습니다. 이견이 있을 때는 일단 시간을 두고 생각해본 후 다시 이야기하세요." },
  신: { match: "해", description: "신해해(申亥害) - 계획이 자주 틀어지기 쉬운 관계입니다. 중요한 약속이나 계획은 여유를 두고 잡고, 변경이 생기면 미리 알려주세요." },
  해: { match: "신", description: "해신해(亥申害) - 기대와 결과의 차이로 실망하기 쉽습니다. 서로에 대한 기대치를 현실적으로 조정하고, 작은 것에도 만족하려 노력하세요." },
  유: { match: "술", description: "유술해(酉戌害) - 가까운 사이에서 상처를 주고받기 쉽습니다. 친밀할수록 더 예의를 지키고, 말 한마디에 상처받지 않도록 서로 조심하세요." },
  술: { match: "유", description: "술유해(戌酉害) - 사소한 말다툼이 큰 갈등이 되기 쉽습니다. 감정적으로 말하기 전에 한 번 더 생각하고, 후회할 말은 삼가세요." },
};

// 지지 관계 아이템 인터페이스
interface JijiRelationItem {
  pair: string;           // 예: "자-축"
  name: string;           // 예: "육합"
  description: string;    // 상세 설명
}

// 보완 관계 상세 정보 (export)
export interface OhengComplementaryDetail {
  element: string;
  emoji: string;
  theme: string;
  whoLacks: "person1" | "person2";  // 누가 부족한지
  title: string;           // 제목 (예: "열정 · 표현력 보완")
  lackingText: string;     // 부족한 사람의 상황 설명
  fillsText: string;       // 채워주는 효과 설명
  benefitText: string;     // 함께하면 좋은 점
}

// 상극 관계 상세 정보 (export)
export interface OhengConflictDetail {
  elements: [string, string];
  emojis: [string, string];
  theme: string;
  title: string;           // 제목 (예: "열정 vs 원칙")
  description: string;     // 상황 설명
  warning: string;         // 주의할 점
  advice: string;          // 조언
}

export interface CompatibilityResult {
  totalScore: number;
  grade: string;
  gradeDescription: string;
  ilganAnalysis: {
    person1Ilgan: string;
    person2Ilgan: string;
    score: number;
    type: string;
    description: string;
    typeDescription: string;  // 십신에 대한 상세 설명
    positive: string[];
    negative: string[];
  };
  jijiAnalysis: {
    yukap: JijiRelationItem[];      // 육합 (좋음)
    chung: JijiRelationItem[];      // 충 (나쁨)
    hyung: JijiRelationItem[];      // 형 (갈등)
    hae: JijiRelationItem[];        // 해 (해로움)
  };
  ohengAnalysis: {
    person1Strong: string[];
    person1Weak: string[];
    person2Strong: string[];
    person2Weak: string[];
    complementary: string[];  // 서로 보완되는 오행 (기존 형식)
    complementaryDetails: OhengComplementaryDetail[];  // 상세 정보
    conflict: string[];       // 서로 충돌하는 오행 (기존 형식)
    conflictDetails: OhengConflictDetail[];  // 상세 정보
  };
  summary: {
    strengths: string[];
    weaknesses: string[];
    advice: string;
  };
  // 시간 정보
  timeInfo: {
    person1TimeUnknown: boolean;
    person2TimeUnknown: boolean;
    usingReducedPillars: boolean;  // 한 명이라도 시간 미입력 시 true
  };
}

/**
 * 등급 계산
 */
function getGrade(score: number): { grade: string; description: string } {
  if (score >= 85) return { grade: "천생연분", description: "매우 좋은 궁합입니다. 자연스럽게 서로를 이해하고 보완합니다." };
  if (score >= 75) return { grade: "좋은 인연", description: "좋은 궁합입니다. 노력하면 더 좋아질 수 있습니다." };
  if (score >= 65) return { grade: "보통 인연", description: "평범한 궁합입니다. 서로 이해하려는 노력이 필요합니다." };
  if (score >= 55) return { grade: "노력 필요", description: "쉽지 않은 궁합입니다. 갈등을 조절하는 지혜가 필요합니다." };
  return { grade: "주의 필요", description: "어려운 궁합입니다. 서로의 차이를 인정하고 존중해야 합니다." };
}

/**
 * 지지 관계 분석
 */
function analyzeJijiRelations(jiji1: string[], jiji2: string[]): {
  yukap: JijiRelationItem[];
  chung: JijiRelationItem[];
  hyung: JijiRelationItem[];
  hae: JijiRelationItem[];
} {
  const yukap: JijiRelationItem[] = [];
  const chung: JijiRelationItem[] = [];
  const hyung: JijiRelationItem[] = [];
  const hae: JijiRelationItem[] = [];

  // 중복 방지를 위한 Set
  const processedPairs = new Set<string>();

  for (const j1 of jiji1) {
    for (const j2 of jiji2) {
      const pairKey = [j1, j2].sort().join("-");

      // 육합 체크
      if (JIJI_YUKAP[j1]?.match === j2 && !processedPairs.has(`yukap-${pairKey}`)) {
        processedPairs.add(`yukap-${pairKey}`);
        yukap.push({
          pair: `${j1}-${j2}`,
          name: "육합",
          description: JIJI_YUKAP[j1].description
        });
      }

      // 충 체크
      if (JIJI_CHUNG[j1]?.match === j2 && !processedPairs.has(`chung-${pairKey}`)) {
        processedPairs.add(`chung-${pairKey}`);
        chung.push({
          pair: `${j1}-${j2}`,
          name: "충",
          description: JIJI_CHUNG[j1].description
        });
      }

      // 형 체크
      if (JIJI_HYUNG[j1]?.matches.includes(j2) && !processedPairs.has(`hyung-${pairKey}`)) {
        processedPairs.add(`hyung-${pairKey}`);
        hyung.push({
          pair: `${j1}-${j2}`,
          name: "형",
          description: JIJI_HYUNG[j1].descriptions[j2] || ""
        });
      }

      // 해 체크
      if (JIJI_HAE[j1]?.match === j2 && !processedPairs.has(`hae-${pairKey}`)) {
        processedPairs.add(`hae-${pairKey}`);
        hae.push({
          pair: `${j1}-${j2}`,
          name: "해",
          description: JIJI_HAE[j1].description
        });
      }
    }
  }

  return { yukap, chung, hyung, hae };
}

/**
 * 오행 상생상극 분석
 */
function analyzeOhengRelation(oheng1: { 목: number; 화: number; 토: number; 금: number; 수: number }, oheng2: { 목: number; 화: number; 토: number; 금: number; 수: number }): {
  person1Strong: string[];
  person1Weak: string[];
  person2Strong: string[];
  person2Weak: string[];
  complementary: string[];
  complementaryDetails: OhengComplementaryDetail[];
  conflict: string[];
  conflictDetails: OhengConflictDetail[];
} {
  const getStrong = (oheng: { 목: number; 화: number; 토: number; 금: number; 수: number }) =>
    (Object.entries(oheng) as [string, number][]).filter(([_, v]) => v >= 2).map(([k]) => k);
  const getWeak = (oheng: { 목: number; 화: number; 토: number; 금: number; 수: number }) =>
    (Object.entries(oheng) as [string, number][]).filter(([_, v]) => v === 0).map(([k]) => k);

  const person1Strong = getStrong(oheng1);
  const person1Weak = getWeak(oheng1);
  const person2Strong = getStrong(oheng2);
  const person2Weak = getWeak(oheng2);

  // 보완 관계: 한쪽이 부족한 것을 다른 쪽이 가지고 있음
  const complementary: string[] = [];
  const complementaryDetails: OhengComplementaryDetail[] = [];
  const processedWeak: string[] = [];

  // person1이 부족하고 person2가 채워주는 경우
  for (const weak of person1Weak) {
    if (person2Strong.includes(weak)) {
      const meaning = OHENG_MEANINGS[weak];
      if (meaning) {
        // 기존 형식 (하위 호환)
        complementary.push(`${meaning.emoji} ${meaning.theme} 보완: 본인에게 부족한 ${meaning.friendlyName}(${weak}) 기운을 상대방이 채워줍니다.`);

        // 새로운 상세 형식
        complementaryDetails.push({
          element: weak,
          emoji: meaning.emoji,
          theme: meaning.theme,
          whoLacks: "person1",
          title: `${meaning.theme} 보완`,
          lackingText: meaning.lackingDescription,
          fillsText: meaning.partnerFillsDescription,
          benefitText: meaning.togetherBenefit,
        });
      }
      processedWeak.push(weak);
    }
  }

  // person2가 부족하고 person1이 채워주는 경우
  for (const weak of person2Weak) {
    if (person1Strong.includes(weak) && !processedWeak.includes(weak)) {
      const meaning = OHENG_MEANINGS[weak];
      if (meaning) {
        // 기존 형식 (하위 호환)
        complementary.push(`${meaning.emoji} ${meaning.theme} 보완: 상대방에게 부족한 ${meaning.friendlyName}(${weak}) 기운을 본인이 채워줍니다.`);

        // 새로운 상세 형식
        complementaryDetails.push({
          element: weak,
          emoji: meaning.emoji,
          theme: meaning.theme,
          whoLacks: "person2",
          title: `${meaning.theme} 보완`,
          lackingText: meaning.lackingDescription,
          fillsText: meaning.partnerFillsDescription.replace("상대방", "본인"),
          benefitText: meaning.togetherBenefit,
        });
      }
    }
  }

  // 상극 관계 체크
  const conflict: string[] = [];
  const conflictDetails: OhengConflictDetail[] = [];
  const SANGGEUK: Record<string, string> = {
    목: "토", 화: "금", 토: "수", 금: "목", 수: "화"
  };
  const processedConflicts: string[] = [];

  for (const s1 of person1Strong) {
    for (const s2 of person2Strong) {
      if (SANGGEUK[s1] === s2 || SANGGEUK[s2] === s1) {
        // 중복 방지
        const conflictKey = [s1, s2].sort().join("");
        if (processedConflicts.includes(conflictKey)) continue;
        processedConflicts.push(conflictKey);

        // 상극 데이터 찾기
        const conflictData = SANGGEUK_CONFLICTS[conflictKey] || SANGGEUK_CONFLICTS[[s2, s1].sort().join("")];
        const meaning1 = OHENG_MEANINGS[s1];
        const meaning2 = OHENG_MEANINGS[s2];

        if (conflictData && meaning1 && meaning2) {
          // 기존 형식 (하위 호환)
          conflict.push(`${meaning1.emoji}${meaning2.emoji} ${conflictData.theme}: ${conflictData.warning}`);

          // 새로운 상세 형식
          conflictDetails.push({
            elements: [s1, s2],
            emojis: [meaning1.emoji, meaning2.emoji],
            theme: conflictData.theme,
            title: conflictData.theme,
            description: conflictData.description,
            warning: conflictData.warning,
            advice: conflictData.advice,
          });
        } else {
          // 데이터가 없는 경우 기본 메시지
          conflict.push(`${meaning1?.emoji || ""}${meaning2?.emoji || ""} ${getOhengFriendlyName(s1)}와 ${getOhengFriendlyName(s2)}의 기운이 부딪힐 수 있습니다`);
        }
      }
    }
  }

  return {
    person1Strong,
    person1Weak,
    person2Strong,
    person2Weak,
    complementary,
    complementaryDetails,
    conflict,
    conflictDetails,
  };
}

/**
 * 종합 조언 생성
 */
function generateSummary(
  ilganAnalysis: CompatibilityResult["ilganAnalysis"],
  jijiAnalysis: CompatibilityResult["jijiAnalysis"],
  ohengAnalysis: CompatibilityResult["ohengAnalysis"],
  totalScore: number
): CompatibilityResult["summary"] {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // 일간 분석 반영 - 더 자세하게 풀어서 작성
  const ilganType = ilganAnalysis.type;
  if (ilganAnalysis.positive.length > 0) {
    ilganAnalysis.positive.forEach(pos => {
      strengths.push(`${ilganType} 관계의 장점: ${pos}`);
    });
  }
  if (ilganAnalysis.negative.length > 0) {
    ilganAnalysis.negative.forEach(neg => {
      weaknesses.push(`${ilganType} 관계에서 주의할 점: ${neg}`);
    });
  }

  // 지지 분석 반영 - 각 관계의 고유 설명 사용
  if (jijiAnalysis.yukap.length > 0) {
    jijiAnalysis.yukap.forEach(item => {
      strengths.push(`육합(六合)의 조화: ${item.description}`);
    });
  }

  if (jijiAnalysis.chung.length > 0) {
    jijiAnalysis.chung.forEach(item => {
      weaknesses.push(`충(沖)의 갈등: ${item.description}`);
    });
  }

  if (jijiAnalysis.hyung.length > 0) {
    jijiAnalysis.hyung.forEach(item => {
      weaknesses.push(`형(刑)의 마찰: ${item.description}`);
    });
  }

  if (jijiAnalysis.hae.length > 0) {
    jijiAnalysis.hae.forEach(item => {
      weaknesses.push(`해(害)의 손실: ${item.description}`);
    });
  }

  // 오행 분석 반영 - 더 자세하게
  if (ohengAnalysis.complementary.length > 0) {
    strengths.push(`오행의 상생(相生) 보완: ${ohengAnalysis.complementary.join(" / ")} 한 분에게 부족한 오행을 다른 분이 채워주어, 함께 있을 때 더 균형 잡힌 에너지를 느끼실 수 있습니다.`);
  }

  if (ohengAnalysis.conflict.length > 0) {
    weaknesses.push(`오행의 상극(相剋): ${ohengAnalysis.conflict.join(" / ")} 근본적인 기질 차이가 있을 수 있지만, 서로의 성향이 다르다는 것을 인정하고 그 차이를 보완점으로 활용하려는 노력이 필요합니다.`);
  }

  // 종합 조언 생성 - 점수와 분석 결과를 바탕으로 구체적인 조언
  let advice = "";

  const hasYukap = jijiAnalysis.yukap.length > 0;
  const hasChung = jijiAnalysis.chung.length > 0;
  const hasHyung = jijiAnalysis.hyung.length > 0;
  const hasHae = jijiAnalysis.hae.length > 0;
  const negativeJijiCount = jijiAnalysis.chung.length + jijiAnalysis.hyung.length + jijiAnalysis.hae.length;

  if (totalScore >= 85) {
    advice = `두 분은 사주적으로 매우 잘 맞는 인연입니다. ${hasYukap ? "육합의 조화로운 기운이 관계를 더욱 돈독하게 해줍니다. " : ""}일간의 ${ilganType} 관계는 서로를 자연스럽게 이해하고 지지할 수 있는 좋은 조합입니다. 현재의 좋은 기운을 유지하면서, 서로에 대한 감사와 애정을 꾸준히 표현해주세요. 좋은 관계일수록 당연하게 여기지 않고 소중히 여기는 마음이 중요합니다.`;
  } else if (totalScore >= 75) {
    advice = `두 분은 좋은 궁합을 가지고 있습니다. ${hasYukap ? "육합이 있어 기본적인 조화가 좋고, " : ""}서로의 장점을 잘 살려줄 수 있는 관계입니다. ${negativeJijiCount > 0 ? "다만 일부 갈등 요소가 있으니, 갈등이 생겼을 때 감정적으로 대응하기보다 차분하게 대화로 풀어나가세요. " : ""}함께 성장하고 발전할 수 있는 파트너십을 만들어갈 수 있습니다. 서로의 꿈과 목표를 응원하고, 함께 이루어나가는 기쁨을 누리세요.`;
  } else if (totalScore >= 65) {
    advice = `두 분의 궁합은 평범한 편입니다. 좋은 점도 있고 주의할 점도 있는 균형 잡힌 관계입니다. ${hasChung ? "충(沖)의 기운이 있어 의견 대립이 생길 수 있으니, 서로의 의견을 끝까지 듣고 타협점을 찾으려 노력해주세요. " : ""}${hasHyung ? "형(刑)의 기운으로 말다툼이 생기기 쉬우니, 화가 날 때는 잠시 시간을 두고 냉정해진 후 대화하세요. " : ""}관계는 타고나는 것이 아니라 함께 만들어가는 것입니다. 서로를 이해하려는 꾸준한 노력이 있다면 더 좋은 관계로 발전할 수 있습니다.`;
  } else if (totalScore >= 55) {
    advice = `두 분의 관계는 노력이 필요한 궁합입니다. ${hasChung ? "충(沖)으로 인해 감정적 충돌이 잦을 수 있고, " : ""}${hasHyung ? "형(刑)으로 서로에게 상처를 주기 쉬우며, " : ""}${hasHae ? "해(害)로 의도치 않은 손해가 생길 수 있습니다. " : ""}하지만 어려운 만큼 이를 극복했을 때 더 깊은 유대감을 느낄 수 있습니다. 갈등이 생겼을 때는 이기려 하지 말고, 관계를 지키려는 마음을 먼저 가지세요. 서로의 다름을 인정하고, 그 차이가 오히려 서로를 보완해줄 수 있음을 기억하세요. 필요하다면 제3자의 조언이나 전문 상담을 받아보는 것도 도움이 됩니다.`;
  } else {
    advice = `두 분의 궁합에는 도전적인 요소가 많습니다. ${negativeJijiCount > 0 ? "지지 관계에서 여러 갈등 요소가 발견되어 " : ""}근본적인 성향 차이로 인해 갈등이 자주 발생할 수 있습니다. 하지만 사주는 경향성을 보여줄 뿐, 운명을 결정짓지 않습니다. 서로에 대한 진정한 사랑과 존중이 있다면 어떤 어려움도 극복할 수 있습니다. 중요한 것은 갈등 상황에서 감정을 조절하는 것입니다. 화가 날 때는 즉각 반응하지 말고, 24시간 정도 시간을 두고 생각해보세요. 서로의 공간과 시간을 존중하고, 상대방을 바꾸려 하기보다 있는 그대로를 받아들이려 노력하세요. 필요하다면 전문 상담사의 도움을 받는 것도 좋은 방법입니다.`;
  }

  return { strengths, weaknesses, advice };
}

/**
 * 기둥들로부터 오행 카운트 계산
 */
function calculateOhengFromPillars(pillars: SajuApiResult["yearPillar"][]): { 목: number; 화: number; 토: number; 금: number; 수: number } {
  const count = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const pillar of pillars) {
    if (pillar.cheonganOheng && pillar.cheonganOheng in count) {
      count[pillar.cheonganOheng as keyof typeof count]++;
    }
    if (pillar.jijiOheng && pillar.jijiOheng in count) {
      count[pillar.jijiOheng as keyof typeof count]++;
    }
  }

  return count;
}

/**
 * 커플 궁합 분석 메인 함수
 */
export function analyzeCompatibility(
  person1: SajuApiResult,
  person2: SajuApiResult
): CompatibilityResult {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  // 시간 입력 여부 확인 (timePillar.cheongan이 비어있으면 시간 미입력)
  const person1TimeUnknown = !person1.timePillar.cheongan;
  const person2TimeUnknown = !person2.timePillar.cheongan;
  const usingReducedPillars = person1TimeUnknown || person2TimeUnknown;

  // 일간 궁합 분석
  const ilganData = ILGAN_COMPATIBILITY[ilgan1]?.[ilgan2] || {
    score: 60,
    type: "불명",
    description: "분석 불가",
    positive: [],
    negative: [],
  };

  const ilganAnalysis = {
    person1Ilgan: ilgan1,
    person2Ilgan: ilgan2,
    ...ilganData,
    typeDescription: SIPSIN_DESCRIPTIONS[ilganData.type] || "",
  };

  // 지지 추출 (한 명이라도 시간 미입력이면 둘 다 3기둥, 둘 다 입력하면 4기둥)
  const jiji1 = usingReducedPillars
    ? [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji]
    : [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji, person1.timePillar.jiji];
  const jiji2 = usingReducedPillars
    ? [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji]
    : [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji, person2.timePillar.jiji];

  // 지지 관계 분석
  const jijiAnalysis = analyzeJijiRelations(jiji1.filter(Boolean), jiji2.filter(Boolean));

  // 오행 분석 (일관된 기준으로 재계산)
  const pillars1 = usingReducedPillars
    ? [person1.yearPillar, person1.monthPillar, person1.dayPillar]
    : [person1.yearPillar, person1.monthPillar, person1.dayPillar, person1.timePillar];
  const pillars2 = usingReducedPillars
    ? [person2.yearPillar, person2.monthPillar, person2.dayPillar]
    : [person2.yearPillar, person2.monthPillar, person2.dayPillar, person2.timePillar];

  const oheng1 = calculateOhengFromPillars(pillars1);
  const oheng2 = calculateOhengFromPillars(pillars2);
  const ohengAnalysis = analyzeOhengRelation(oheng1, oheng2);

  // 점수 계산
  let totalScore = ilganData.score;

  // 지지 관계 점수 조정
  totalScore += jijiAnalysis.yukap.length * 5;  // 육합당 +5
  totalScore -= jijiAnalysis.chung.length * 8;  // 충당 -8
  totalScore -= jijiAnalysis.hyung.length * 5;  // 형당 -5
  totalScore -= jijiAnalysis.hae.length * 3;    // 해당 -3

  // 오행 보완/충돌 점수
  totalScore += ohengAnalysis.complementary.length * 3;
  totalScore -= ohengAnalysis.conflict.length * 4;

  // 점수 범위 제한
  totalScore = Math.max(30, Math.min(100, totalScore));

  const { grade, description: gradeDescription } = getGrade(totalScore);

  // 종합 요약 (점수 포함하여 더 구체적인 조언 생성)
  const summary = generateSummary(ilganAnalysis, jijiAnalysis, ohengAnalysis, totalScore);

  return {
    totalScore,
    grade,
    gradeDescription,
    ilganAnalysis,
    jijiAnalysis,
    ohengAnalysis,
    summary,
    timeInfo: {
      person1TimeUnknown,
      person2TimeUnknown,
      usingReducedPillars,
    },
  };
}
