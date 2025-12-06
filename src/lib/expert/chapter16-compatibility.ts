/**
 * 제16장: 궁합 분석
 * 2인 입력 시만 실행
 */

import type { SajuApiResult, FiveElement } from "@/types/saju";
import type { Chapter16Result, ChapterNarrative } from "@/types/expert";

// ============================================
// 타입 정의
// ============================================

type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";
type EarthlyBranchKr = "자" | "축" | "인" | "묘" | "진" | "사" | "오" | "미" | "신" | "유" | "술" | "해";
type RelationshipType = "상생" | "상극" | "비화";
type ScoreRange = "excellent" | "good" | "average" | "challenging";

// ============================================
// 궁합 조합별 상수 (3관계유형 × 4점수대 = 12조합)
// ============================================

const COMPATIBILITY_NARRATIVES: Record<RelationshipType, Record<ScoreRange, {
  intro: string;
  mainAnalysis: string;
  strengthPoints: string[];
  challengePoints: string[];
  advice: string;
  closing: string;
}>> = {
  상생: {
    excellent: {
      intro: "두 분은 오행 상생 관계로, 서로를 자연스럽게 돕고 지지하는 천생연분의 인연입니다. 한 쪽이 다른 쪽에게 에너지를 주고, 받는 쪽은 그 에너지로 더욱 빛나는 아름다운 관계입니다.",
      mainAnalysis: "상생 관계에서 높은 궁합 점수를 받았다는 것은 단순히 오행이 맞는 것을 넘어, 십신 관계와 일주 관계까지 모두 조화롭다는 의미입니다. 서로의 강점이 상대방의 약점을 보완하고, 함께할 때 개인일 때보다 더 큰 시너지를 발휘합니다. 일상에서도 자연스럽게 서로를 배려하고, 갈등이 생겨도 쉽게 화해할 수 있는 관계입니다.",
      strengthPoints: [
        "서로에게 자연스럽게 에너지를 주고받는 관계입니다.",
        "갈등이 생겨도 화해가 쉽고, 오래 가지 않습니다.",
        "함께 성장하고 발전하는 동반자 관계입니다.",
        "서로의 꿈과 목표를 응원하고 지지합니다."
      ],
      challengePoints: [
        "너무 좋은 관계에 안주하여 개인 성장을 소홀히 할 수 있습니다.",
        "한 쪽이 일방적으로 주기만 하면 균형이 깨질 수 있습니다."
      ],
      advice: "천생연분의 인연을 만났습니다. 이 좋은 관계를 당연하게 여기지 말고 감사하는 마음을 유지하세요. 서로에게 표현하고, 함께하는 시간을 소중히 여기세요. 개인의 시간과 공간도 존중하면서 함께 성장해 나가면 평생 함께할 수 있는 관계가 됩니다.",
      closing: "두 분의 만남은 운명적입니다. 이 소중한 인연을 잘 가꾸어 나가기 바랍니다."
    },
    good: {
      intro: "두 분은 오행 상생 관계로, 서로를 자연스럽게 돕는 좋은 인연입니다. 기본적인 조화가 잘 맞아 함께할 때 편안함을 느낍니다.",
      mainAnalysis: "상생 관계의 기본적인 조화로움을 바탕으로 좋은 궁합을 보여줍니다. 서로에게 긍정적인 영향을 주며, 일상에서 자연스럽게 도움을 주고받습니다. 다만 일부 영역에서는 조율이 필요한 부분도 있습니다. 이는 관계를 더욱 성숙하게 만드는 기회가 됩니다.",
      strengthPoints: [
        "기본적인 성향이 잘 맞아 편안합니다.",
        "서로를 지지하고 응원하는 분위기입니다.",
        "갈등이 생겨도 대화로 해결할 수 있습니다."
      ],
      challengePoints: [
        "일부 가치관이나 생활 패턴에서 조율이 필요합니다.",
        "서로의 기대치를 명확히 소통해야 합니다."
      ],
      advice: "좋은 기본기를 가진 관계입니다. 서로의 차이점을 인정하고, 대화를 통해 조율해 나가세요. 작은 갈등을 두려워하지 말고, 오히려 관계를 깊게 하는 기회로 삼으세요.",
      closing: "좋은 인연을 만났습니다. 노력하면 더욱 깊은 관계로 발전할 수 있습니다."
    },
    average: {
      intro: "두 분은 오행 상생 관계로 기본적인 조화는 있지만, 다른 영역에서 조율이 필요한 관계입니다.",
      mainAnalysis: "오행은 상생이지만 십신 관계나 일주 관계에서 충돌 요소가 있어 전체적인 점수가 중간 정도입니다. 서로를 돕고 싶은 마음은 있지만, 방법이나 시기가 맞지 않을 수 있습니다. 이해와 소통이 중요한 관계입니다.",
      strengthPoints: [
        "기본적으로 서로를 돕고 싶은 마음이 있습니다.",
        "노력하면 조화로운 관계가 될 수 있습니다."
      ],
      challengePoints: [
        "도움을 주려는 방식이 다를 수 있습니다.",
        "기대와 현실의 간극이 있을 수 있습니다.",
        "소통 방식의 차이가 갈등을 유발할 수 있습니다."
      ],
      advice: "상생의 기본 에너지를 잘 활용하세요. 서로의 좋은 의도를 인정하고, 표현 방식의 차이를 이해하려 노력하세요. 정기적인 대화 시간을 가지고, 서로의 필요를 명확히 전달하세요.",
      closing: "노력하면 좋은 관계가 될 수 있는 잠재력이 있습니다."
    },
    challenging: {
      intro: "두 분은 오행 상생 관계이지만, 다른 요소들로 인해 도전이 필요한 관계입니다.",
      mainAnalysis: "오행은 상생이나 십신 관계와 일주 관계에서 큰 충돌이 있습니다. 서로를 위하는 마음은 있지만, 그 마음이 잘 전달되지 않거나 오해가 생기기 쉽습니다. 많은 소통과 이해가 필요합니다.",
      strengthPoints: [
        "기본적인 상생 에너지로 화해의 가능성이 있습니다.",
        "노력하면 성장하는 관계가 될 수 있습니다."
      ],
      challengePoints: [
        "의사소통이 어렵고 오해가 자주 생깁니다.",
        "서로의 기대가 크게 다릅니다.",
        "갈등이 오래 지속될 수 있습니다."
      ],
      advice: "상생의 기본 에너지를 믿으세요. 서로의 차이를 인정하고, 기대치를 낮추되 소통은 높이세요. 제3자의 도움이나 상담을 받는 것도 좋은 방법입니다.",
      closing: "어려운 관계이지만, 함께 성장할 수 있는 기회입니다."
    }
  },
  상극: {
    excellent: {
      intro: "두 분은 오행 상극 관계이지만, 다른 요소들이 이를 잘 보완하여 의외로 좋은 궁합을 보입니다. 다름이 오히려 서로를 성장시키는 자극이 됩니다.",
      mainAnalysis: "상극 관계임에도 높은 점수를 받았다는 것은 십신 관계와 일주 관계가 매우 좋다는 의미입니다. 서로 다른 성향이 오히려 새로운 시각을 제공하고, 자극을 주어 성장하게 합니다. 갈등이 있을 수 있지만, 그 갈등을 통해 더 단단한 관계가 됩니다.",
      strengthPoints: [
        "서로 다른 시각이 새로운 가능성을 열어줍니다.",
        "갈등을 통해 성장하는 관계입니다.",
        "지루하지 않고 역동적인 관계입니다."
      ],
      challengePoints: [
        "의견 충돌이 잦을 수 있습니다.",
        "가치관의 차이를 조율해야 합니다."
      ],
      advice: "다름을 두려워하지 마세요. 상극 관계의 긴장감이 오히려 관계를 활기차게 만듭니다. 서로의 다른 점을 배움의 기회로 삼고, 갈등이 생겼을 때 회피하지 말고 건강하게 해결하세요.",
      closing: "다르기 때문에 더 특별한 관계입니다. 이 특별함을 소중히 여기세요."
    },
    good: {
      intro: "두 분은 오행 상극 관계이지만, 서로를 보완하며 좋은 균형을 이루는 관계입니다.",
      mainAnalysis: "상극 관계의 긴장감이 있지만, 다른 요소들이 이를 완화해줍니다. 서로 다른 관점이 때로는 갈등을 일으키지만, 그 차이가 새로운 아이디어와 해결책을 만들어냅니다. 노력하면 서로를 성장시키는 좋은 관계가 될 수 있습니다.",
      strengthPoints: [
        "다른 관점이 문제 해결에 도움이 됩니다.",
        "서로에게 자극이 되어 성장합니다.",
        "노력하면 깊은 이해에 도달할 수 있습니다."
      ],
      challengePoints: [
        "기본적인 접근 방식이 다릅니다.",
        "갈등 해결에 더 많은 노력이 필요합니다.",
        "서로의 방식을 존중하는 연습이 필요합니다."
      ],
      advice: "차이를 인정하고 존중하세요. 상대방의 방식이 틀린 것이 아니라 다른 것임을 이해하세요. 갈등이 생겼을 때 승패를 가리려 하지 말고, 함께 해결책을 찾으세요.",
      closing: "다름 속에서 조화를 찾아가는 여정입니다. 함께 성장하세요."
    },
    average: {
      intro: "두 분은 오행 상극 관계로, 서로 다른 에너지를 가지고 있습니다. 이해와 노력이 필요한 관계입니다.",
      mainAnalysis: "상극 관계의 기본적인 긴장감에 더해 다른 요소들도 중간 정도의 조화를 보입니다. 서로 다른 점이 많아 이해하기 어려울 수 있지만, 그만큼 배울 점도 많습니다. 인내심을 가지고 서로를 알아가는 시간이 필요합니다.",
      strengthPoints: [
        "서로에게서 배울 점이 많습니다.",
        "다양한 관점을 경험할 수 있습니다."
      ],
      challengePoints: [
        "이해하기 어려운 부분이 많습니다.",
        "갈등이 잦고 해결이 쉽지 않습니다.",
        "인내심이 많이 필요합니다."
      ],
      advice: "서두르지 마세요. 서로를 이해하는 데 시간이 걸립니다. 작은 것부터 서로의 차이를 인정하고, 공통점을 찾아가세요. 갈등이 생겼을 때 한 발 물러서서 생각하는 여유를 가지세요.",
      closing: "쉽지 않은 관계이지만, 노력하면 특별한 관계가 될 수 있습니다."
    },
    challenging: {
      intro: "두 분은 오행 상극 관계로, 근본적으로 다른 에너지를 가지고 있습니다. 많은 노력과 이해가 필요한 관계입니다.",
      mainAnalysis: "상극 관계에 더해 다른 요소들도 충돌이 많아 도전적인 관계입니다. 서로를 이해하기 어렵고, 갈등이 자주 발생할 수 있습니다. 그러나 이 관계를 통해 가장 많이 성장할 수도 있습니다. 관계를 유지하려면 많은 인내와 노력이 필요합니다.",
      strengthPoints: [
        "이 관계를 통해 가장 많이 성장할 수 있습니다.",
        "완전히 다른 세계를 경험합니다."
      ],
      challengePoints: [
        "근본적인 가치관 충돌이 있습니다.",
        "갈등이 잦고 깊습니다.",
        "상처를 주고받기 쉽습니다.",
        "지속하기 위해 많은 에너지가 필요합니다."
      ],
      advice: "이 관계를 유지할지 진지하게 고민해보세요. 유지하기로 했다면, 전문 상담의 도움을 받는 것을 권합니다. 서로의 한계를 인정하고, 기대치를 현실적으로 조절하세요. 개인의 시간과 공간을 충분히 확보하세요.",
      closing: "어려운 관계이지만, 진심으로 노력하면 성장의 기회가 될 수 있습니다."
    }
  },
  비화: {
    excellent: {
      intro: "두 분은 같은 오행으로, 서로를 깊이 이해하는 동질감 있는 관계입니다. 다른 요소들도 잘 맞아 매우 좋은 궁합을 보입니다.",
      mainAnalysis: "같은 오행의 비화 관계에 더해 십신과 일주 관계도 좋아 최상의 궁합입니다. 서로를 거울처럼 이해하고, 말하지 않아도 통하는 부분이 많습니다. 비슷한 가치관과 생활 방식으로 갈등이 적고, 함께하는 시간이 편안합니다.",
      strengthPoints: [
        "서로를 깊이 이해합니다.",
        "말하지 않아도 통하는 부분이 많습니다.",
        "비슷한 가치관으로 갈등이 적습니다.",
        "함께하는 시간이 편안합니다."
      ],
      challengePoints: [
        "너무 비슷해서 새로운 자극이 부족할 수 있습니다.",
        "같은 약점을 공유하여 함께 어려움에 빠질 수 있습니다."
      ],
      advice: "편안함에 안주하지 말고, 함께 새로운 도전을 찾으세요. 비슷한 약점을 보완하기 위해 의식적으로 노력하세요. 서로에게 솔직한 피드백을 주고, 함께 성장하세요.",
      closing: "최고의 이해자를 만났습니다. 이 특별한 인연을 소중히 여기세요."
    },
    good: {
      intro: "두 분은 같은 오행으로 서로를 잘 이해하는 관계입니다. 기본적인 조화가 좋습니다.",
      mainAnalysis: "같은 오행의 동질감을 바탕으로 좋은 궁합을 보입니다. 서로의 생각과 감정을 쉽게 이해하고, 편안한 관계를 유지합니다. 다만 비슷함 속에서도 개인의 차이가 있으므로 이를 존중하는 것이 중요합니다.",
      strengthPoints: [
        "서로를 쉽게 이해합니다.",
        "편안하고 안정적인 관계입니다.",
        "공통 관심사가 많습니다."
      ],
      challengePoints: [
        "변화나 자극이 부족할 수 있습니다.",
        "비슷한 관점으로 편향될 수 있습니다."
      ],
      advice: "편안함을 유지하면서도 각자의 영역을 존중하세요. 함께 새로운 것을 경험하고, 서로에게 자극이 되어주세요. 비슷하다고 같다고 생각하지 말고, 차이점도 인정하세요.",
      closing: "좋은 이해자를 만났습니다. 함께 성장해 나가세요."
    },
    average: {
      intro: "두 분은 같은 오행이지만, 다른 요소에서 조율이 필요한 관계입니다.",
      mainAnalysis: "같은 오행의 기본적인 이해는 있지만, 십신이나 일주 관계에서 충돌 요소가 있습니다. 비슷한 듯 다른 부분에서 오히려 갈등이 생길 수 있습니다. 서로를 당연히 이해한다고 가정하지 말고, 적극적으로 소통하세요.",
      strengthPoints: [
        "기본적인 이해의 바탕이 있습니다.",
        "비슷한 경험을 공유합니다."
      ],
      challengePoints: [
        "비슷한 듯 다른 부분에서 갈등이 생깁니다.",
        "상대방이 당연히 알 것이라는 기대가 실망으로 이어질 수 있습니다.",
        "같은 약점으로 함께 어려움에 빠질 수 있습니다."
      ],
      advice: "비슷하다고 모든 것을 알 것이라 가정하지 마세요. 명확하게 소통하고, 서로의 차이점도 인정하세요. 공통의 약점을 보완하기 위해 함께 노력하세요.",
      closing: "비슷함 속의 다름을 이해하면 더 깊은 관계가 됩니다."
    },
    challenging: {
      intro: "두 분은 같은 오행이지만, 다른 요소들로 인해 도전적인 관계입니다.",
      mainAnalysis: "같은 오행임에도 십신과 일주 관계에서 큰 충돌이 있습니다. 비슷한 점이 오히려 경쟁심이나 질투로 이어질 수 있습니다. 서로가 거울처럼 느껴져 자신의 단점을 상대방에게서 보고 불편해할 수 있습니다.",
      strengthPoints: [
        "서로를 통해 자신을 돌아볼 수 있습니다.",
        "깊은 이해에 도달할 가능성이 있습니다."
      ],
      challengePoints: [
        "경쟁심이나 질투가 생길 수 있습니다.",
        "자신의 단점을 상대방에게서 보고 불편해합니다.",
        "비슷한 약점으로 함께 무너질 수 있습니다."
      ],
      advice: "상대방을 경쟁자가 아닌 동반자로 보세요. 자신의 단점을 상대방에게 투사하지 마세요. 서로의 성공을 진심으로 축하하고, 함께 성장하려는 마음을 가지세요.",
      closing: "거울 같은 관계입니다. 자신을 성장시키는 기회로 삼으세요."
    }
  }
};

function getScoreRange(score: number): ScoreRange {
  if (score >= 80) return "excellent";
  if (score >= 65) return "good";
  if (score >= 50) return "average";
  return "challenging";
}

// ============================================
// 기본 분석 함수
// ============================================

function getDayMasterElement(sajuResult: SajuApiResult): FiveElement {
  const stemElementMap: Record<HeavenlyStemKr, FiveElement> = {
    갑: "wood", 을: "wood",
    병: "fire", 정: "fire",
    무: "earth", 기: "earth",
    경: "metal", 신: "metal",
    임: "water", 계: "water"
  };

  const dayStem = sajuResult.dayPillar.cheongan as HeavenlyStemKr;
  return stemElementMap[dayStem] || "earth";
}

function getDayPillarString(sajuResult: SajuApiResult): string {
  const stem = sajuResult.dayPillar.cheongan as string;
  const branch = sajuResult.dayPillar.jiji as string;
  return stem + branch;
}

// ============================================
// 오행 궁합 분석
// ============================================

interface ElementCompatibility {
  person1Element: FiveElement;
  person2Element: FiveElement;
  relationship: "상생" | "상극" | "비화";
  score: number;
  analysis: string;
}

function analyzeElementCompatibility(
  element1: FiveElement,
  element2: FiveElement
): ElementCompatibility {
  // 상생 관계: 목→화→토→금→수→목
  const generatingRelation: Record<FiveElement, FiveElement> = {
    wood: "fire",
    fire: "earth",
    earth: "metal",
    metal: "water",
    water: "wood"
  };

  // 상극 관계: 목→토→수→화→금→목
  const controllingRelation: Record<FiveElement, FiveElement> = {
    wood: "earth",
    earth: "water",
    water: "fire",
    fire: "metal",
    metal: "wood"
  };

  let relationship: "상생" | "상극" | "비화";
  let score: number;
  let analysis: string;

  if (element1 === element2) {
    relationship = "비화";
    score = 70;
    analysis = `두 사람 모두 ${getElementKorean(element1)} 오행으로, 비화 관계입니다. 서로 잘 이해하지만 비슷한 약점을 공유합니다.`;
  } else if (generatingRelation[element1] === element2) {
    relationship = "상생";
    score = 90;
    analysis = `${getElementKorean(element1)}이(가) ${getElementKorean(element2)}을(를) 생하는 상생 관계입니다. 한 쪽이 다른 쪽을 자연스럽게 지원합니다.`;
  } else if (generatingRelation[element2] === element1) {
    relationship = "상생";
    score = 85;
    analysis = `${getElementKorean(element2)}이(가) ${getElementKorean(element1)}을(를) 생하는 상생 관계입니다. 서로를 보완하는 좋은 조합입니다.`;
  } else if (controllingRelation[element1] === element2) {
    relationship = "상극";
    score = 50;
    analysis = `${getElementKorean(element1)}이(가) ${getElementKorean(element2)}을(를) 극하는 상극 관계입니다. 갈등이 있을 수 있으나 노력으로 극복 가능합니다.`;
  } else if (controllingRelation[element2] === element1) {
    relationship = "상극";
    score = 55;
    analysis = `${getElementKorean(element2)}이(가) ${getElementKorean(element1)}을(를) 극하는 상극 관계입니다. 서로 다른 점을 인정하면 성장의 기회가 됩니다.`;
  } else {
    relationship = "비화";
    score = 65;
    analysis = "서로 직접적인 관계가 없어 자유로운 관계입니다. 각자의 영역을 존중하면 좋은 관계를 유지할 수 있습니다.";
  }

  return {
    person1Element: element1,
    person2Element: element2,
    relationship,
    score,
    analysis
  };
}

function getElementKorean(element: FiveElement): string {
  const map: Record<FiveElement, string> = {
    wood: "목(木)",
    fire: "화(火)",
    earth: "토(土)",
    metal: "금(金)",
    water: "수(水)"
  };
  return map[element];
}

// ============================================
// 십신 궁합 분석
// ============================================

interface TenGodCompatibility {
  mutualGods: { person1God: string; person2God: string }[];
  harmony: number;
  analysis: string;
}

function analyzeTenGodCompatibility(
  saju1: SajuApiResult,
  saju2: SajuApiResult
): TenGodCompatibility {
  // 간략화된 십신 궁합 분석
  // 실제로는 서로의 일간을 기준으로 상대방 사주의 십신을 분석해야 함

  const dayStem1 = saju1.dayPillar.cheongan as string;
  const dayStem2 = saju2.dayPillar.cheongan as string;

  // 간략화된 분석
  const mutualGods: { person1God: string; person2God: string }[] = [];

  // 예시: 서로의 일간 관계 분석
  const sipsinMap: Record<string, Record<string, string>> = {
    갑: { 갑: "비견", 을: "겁재", 병: "식신", 정: "상관", 무: "편재", 기: "정재", 경: "편관", 신: "정관", 임: "편인", 계: "정인" },
    을: { 을: "비견", 갑: "겁재", 정: "식신", 병: "상관", 기: "편재", 무: "정재", 신: "편관", 경: "정관", 계: "편인", 임: "정인" },
    병: { 병: "비견", 정: "겁재", 무: "식신", 기: "상관", 경: "편재", 신: "정재", 임: "편관", 계: "정관", 갑: "편인", 을: "정인" },
    정: { 정: "비견", 병: "겁재", 기: "식신", 무: "상관", 신: "편재", 경: "정재", 계: "편관", 임: "정관", 을: "편인", 갑: "정인" },
    무: { 무: "비견", 기: "겁재", 경: "식신", 신: "상관", 임: "편재", 계: "정재", 갑: "편관", 을: "정관", 병: "편인", 정: "정인" },
    기: { 기: "비견", 무: "겁재", 신: "식신", 경: "상관", 계: "편재", 임: "정재", 을: "편관", 갑: "정관", 정: "편인", 병: "정인" },
    경: { 경: "비견", 신: "겁재", 임: "식신", 계: "상관", 갑: "편재", 을: "정재", 병: "편관", 정: "정관", 무: "편인", 기: "정인" },
    신: { 신: "비견", 경: "겁재", 계: "식신", 임: "상관", 을: "편재", 갑: "정재", 정: "편관", 병: "정관", 기: "편인", 무: "정인" },
    임: { 임: "비견", 계: "겁재", 갑: "식신", 을: "상관", 병: "편재", 정: "정재", 무: "편관", 기: "정관", 경: "편인", 신: "정인" },
    계: { 계: "비견", 임: "겁재", 을: "식신", 갑: "상관", 정: "편재", 병: "정재", 기: "편관", 무: "정관", 신: "편인", 경: "정인" }
  };

  const person1SeePerson2 = sipsinMap[dayStem1]?.[dayStem2] || "비견";
  const person2SeePerson1 = sipsinMap[dayStem2]?.[dayStem1] || "비견";

  mutualGods.push({ person1God: person1SeePerson2, person2God: person2SeePerson1 });

  // 조화도 계산
  let harmony = 60;
  const goodCombos = [
    ["정재", "정관"], ["정관", "정재"], ["식신", "정인"], ["정인", "식신"]
  ];
  const badCombos = [
    ["겁재", "겁재"], ["상관", "편관"], ["편관", "상관"]
  ];

  for (const combo of goodCombos) {
    if (
      (person1SeePerson2 === combo[0] && person2SeePerson1 === combo[1]) ||
      (person1SeePerson2 === combo[1] && person2SeePerson1 === combo[0])
    ) {
      harmony += 20;
      break;
    }
  }

  for (const combo of badCombos) {
    if (
      (person1SeePerson2 === combo[0] && person2SeePerson1 === combo[1]) ||
      (person1SeePerson2 === combo[1] && person2SeePerson1 === combo[0])
    ) {
      harmony -= 15;
      break;
    }
  }

  let analysis = "";
  if (harmony >= 80) {
    analysis = "십신 관계가 매우 조화롭습니다. 서로에게 필요한 에너지를 보완해줍니다.";
  } else if (harmony >= 60) {
    analysis = "십신 관계가 보통입니다. 서로의 역할을 이해하면 좋은 관계를 유지할 수 있습니다.";
  } else {
    analysis = "십신 관계에서 갈등 요소가 있습니다. 서로의 차이를 인정하고 노력이 필요합니다.";
  }

  return {
    mutualGods,
    harmony: Math.max(0, Math.min(100, harmony)),
    analysis
  };
}

// ============================================
// 일주 궁합 분석
// ============================================

interface DayPillarCompatibility {
  person1DayPillar: string;
  person2DayPillar: string;
  compatibility: string;
  score: number;
}

function analyzeDayPillarCompatibility(
  saju1: SajuApiResult,
  saju2: SajuApiResult
): DayPillarCompatibility {
  const dayPillar1 = getDayPillarString(saju1);
  const dayPillar2 = getDayPillarString(saju2);

  const stem1 = saju1.dayPillar.cheongan as string;
  const stem2 = saju2.dayPillar.cheongan as string;
  const branch1 = saju1.dayPillar.jiji as string;
  const branch2 = saju2.dayPillar.jiji as string;

  let score = 60;
  let compatibility = "";

  // 천간합 체크
  const stemCombinations: Record<string, string> = {
    갑기: "토", 기갑: "토",
    을경: "금", 경을: "금",
    병신: "수", 신병: "수",
    정임: "목", 임정: "목",
    무계: "화", 계무: "화"
  };

  const stemPair = stem1 + stem2;
  if (stemCombinations[stemPair]) {
    score += 20;
    compatibility += `천간합(${stem1}${stem2} → ${stemCombinations[stemPair]})으로 서로 끌리는 인연입니다. `;
  }

  // 지지 관계 체크 (삼합, 육합, 충, 형)
  const sixHarmony: Record<string, string> = {
    자축: "토", 축자: "토",
    인해: "목", 해인: "목",
    묘술: "화", 술묘: "화",
    진유: "금", 유진: "금",
    사신: "수", 신사: "수",
    오미: "태양/태음", 미오: "태양/태음"
  };

  const branchPair = branch1 + branch2;
  if (sixHarmony[branchPair]) {
    score += 15;
    compatibility += `지지 육합(${branch1}${branch2})으로 일상에서 조화를 이룹니다. `;
  }

  // 충 체크
  const clashes = ["자오", "오자", "축미", "미축", "인신", "신인", "묘유", "유묘", "진술", "술진", "사해", "해사"];
  if (clashes.includes(branchPair)) {
    score -= 15;
    compatibility += `지지 충(${branch1}${branch2})이 있어 갈등 요소가 있습니다. 서로 이해하려는 노력이 필요합니다. `;
  }

  if (!compatibility) {
    compatibility = "특별한 합이나 충 없이 중립적인 관계입니다. 서로의 노력에 따라 관계가 결정됩니다.";
  }

  return {
    person1DayPillar: dayPillar1,
    person2DayPillar: dayPillar2,
    compatibility: compatibility.trim(),
    score: Math.max(0, Math.min(100, score))
  };
}

// ============================================
// 갈등 분석
// ============================================

interface ConflictAnalysis {
  majorConflicts: { area: string; description: string; solution: string }[];
  minorFrictions: string[];
}

function analyzeConflicts(
  element1: FiveElement,
  element2: FiveElement,
  tenGodCompat: TenGodCompatibility,
  dayPillarCompat: DayPillarCompatibility
): ConflictAnalysis {
  const majorConflicts: { area: string; description: string; solution: string }[] = [];
  const minorFrictions: string[] = [];

  // 오행 상극 시 갈등
  const controllingRelation: Record<FiveElement, FiveElement> = {
    wood: "earth",
    earth: "water",
    water: "fire",
    fire: "metal",
    metal: "wood"
  };

  if (controllingRelation[element1] === element2 || controllingRelation[element2] === element1) {
    majorConflicts.push({
      area: "가치관",
      description: "오행 상극으로 인해 기본적인 가치관이나 접근 방식에서 차이가 있습니다.",
      solution: "서로의 다름을 인정하고, 상대방의 관점에서 생각해보려는 노력이 필요합니다."
    });
  }

  // 십신 궁합이 낮을 때
  if (tenGodCompat.harmony < 50) {
    majorConflicts.push({
      area: "역할 기대",
      description: "서로에게 기대하는 역할이 맞지 않아 갈등이 생길 수 있습니다.",
      solution: "명확한 소통으로 서로의 기대를 조율하고, 역할을 재정의해보세요."
    });
  }

  // 일주 충 시
  if (dayPillarCompat.score < 50) {
    majorConflicts.push({
      area: "일상 패턴",
      description: "일상적인 생활 패턴이나 습관에서 부딪히는 부분이 있습니다.",
      solution: "서로의 공간과 시간을 존중하고, 타협점을 찾아보세요."
    });
  }

  // 오행별 잠재적 마찰
  const elementFrictions: Record<FiveElement, string> = {
    wood: "성장 방향이나 목표에 대한 의견 차이",
    fire: "감정 표현 방식이나 열정의 온도 차이",
    earth: "변화에 대한 태도나 안정감의 정의 차이",
    metal: "원칙과 기준에 대한 견해 차이",
    water: "감정 처리 방식이나 깊이의 차이"
  };

  minorFrictions.push(elementFrictions[element1]);
  if (element1 !== element2) {
    minorFrictions.push(elementFrictions[element2]);
  }

  return {
    majorConflicts,
    minorFrictions
  };
}

// ============================================
// 생활 스타일 비교
// ============================================

interface LifestyleComparison {
  financialAttitude: { similarity: number; analysis: string };
  communicationStyle: { similarity: number; analysis: string };
  valueAlignment: { similarity: number; analysis: string };
  futureGoals: { similarity: number; analysis: string };
}

function compareLifestyles(
  element1: FiveElement,
  element2: FiveElement
): LifestyleComparison {
  const sameness = element1 === element2 ? 1 : 0;

  // 오행별 특성 정의
  const elementTraits: Record<FiveElement, {
    financial: string;
    communication: string;
    values: string;
    goals: string;
  }> = {
    wood: {
      financial: "성장과 투자에 관심, 교육비 지출 높음",
      communication: "논리적, 목표 지향적 대화",
      values: "성장, 발전, 자기 계발",
      goals: "자아실현, 성취"
    },
    fire: {
      financial: "활동적 소비, 경험에 투자",
      communication: "열정적, 표현적, 감정적",
      values: "열정, 즐거움, 표현",
      goals: "인정받음, 영향력"
    },
    earth: {
      financial: "저축 중시, 안정적 관리",
      communication: "차분하고 실용적",
      values: "안정, 신뢰, 가족",
      goals: "안정된 삶, 가정의 평화"
    },
    metal: {
      financial: "계획적, 체계적 관리",
      communication: "명확하고 논리적",
      values: "원칙, 정의, 질서",
      goals: "전문성, 인정"
    },
    water: {
      financial: "유동적, 직관적 결정",
      communication: "공감적, 깊이 있는 대화",
      values: "자유, 지혜, 적응",
      goals: "내적 성장, 지혜"
    }
  };

  const traits1 = elementTraits[element1];
  const traits2 = elementTraits[element2];

  // 유사도 계산 (간략화)
  const baseSimilarity = sameness ? 80 : 50;

  // 상생 관계면 유사도 증가
  const generatingRelation: Record<FiveElement, FiveElement> = {
    wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood"
  };

  let bonus = 0;
  if (generatingRelation[element1] === element2 || generatingRelation[element2] === element1) {
    bonus = 15;
  }

  return {
    financialAttitude: {
      similarity: Math.min(100, baseSimilarity + bonus + (Math.random() * 10 - 5)),
      analysis: sameness
        ? `비슷한 재정 관리 스타일입니다: ${traits1.financial}`
        : `다른 재정 관리 스타일입니다. 한 쪽은 ${traits1.financial}, 다른 쪽은 ${traits2.financial}입니다.`
    },
    communicationStyle: {
      similarity: Math.min(100, baseSimilarity + bonus + (Math.random() * 10 - 5)),
      analysis: sameness
        ? `비슷한 소통 방식입니다: ${traits1.communication}`
        : `다른 소통 방식입니다. 한 쪽은 ${traits1.communication}, 다른 쪽은 ${traits2.communication}입니다.`
    },
    valueAlignment: {
      similarity: Math.min(100, baseSimilarity + bonus + 5),
      analysis: sameness
        ? `핵심 가치관이 유사합니다: ${traits1.values}`
        : `다른 가치관을 가지고 있습니다. 한 쪽은 ${traits1.values}을(를), 다른 쪽은 ${traits2.values}을(를) 중시합니다.`
    },
    futureGoals: {
      similarity: Math.min(100, baseSimilarity + bonus),
      analysis: sameness
        ? `비슷한 미래 목표를 가지고 있습니다: ${traits1.goals}`
        : `다른 미래 비전을 가지고 있습니다. 한 쪽은 ${traits1.goals}을(를), 다른 쪽은 ${traits2.goals}을(를) 추구합니다.`
    }
  };
}

// ============================================
// 종합 조언
// ============================================

// ============================================
// Narrative 생성 함수
// ============================================

function generateCompatibilityNarrative(
  overallScore: number,
  elementCompat: ElementCompatibility,
  tenGodCompat: TenGodCompatibility,
  dayPillarCompat: DayPillarCompatibility,
  conflicts: ConflictAnalysis,
  lifestyle: LifestyleComparison
): ChapterNarrative {
  const relationship = elementCompat.relationship;
  const scoreRange = getScoreRange(overallScore);
  const narrativeData = COMPATIBILITY_NARRATIVES[relationship][scoreRange];

  // intro
  const intro = narrativeData.intro;

  // mainAnalysis - 기본 분석 + 상세 정보
  let mainAnalysis = narrativeData.mainAnalysis + " ";
  mainAnalysis += `두 분의 종합 궁합 점수는 ${overallScore}점입니다. `;
  mainAnalysis += `오행 관계는 ${relationship}(${elementCompat.score}점), `;
  mainAnalysis += `십신 조화도는 ${tenGodCompat.harmony}점, `;
  mainAnalysis += `일주 궁합은 ${dayPillarCompat.score}점입니다. `;

  if (dayPillarCompat.compatibility) {
    mainAnalysis += dayPillarCompat.compatibility;
  }

  // details
  const details: string[] = [];

  // 강점
  details.push("• 관계의 강점:");
  narrativeData.strengthPoints.forEach(point => {
    details.push(`  - ${point}`);
  });

  // 갈등 요소
  details.push("• 주의할 점:");
  narrativeData.challengePoints.forEach(point => {
    details.push(`  - ${point}`);
  });

  // 생활 스타일 비교
  details.push("• 생활 스타일 비교:");
  details.push(`  - 재정관: 유사도 ${Math.round(lifestyle.financialAttitude.similarity)}% - ${lifestyle.financialAttitude.analysis}`);
  details.push(`  - 소통방식: 유사도 ${Math.round(lifestyle.communicationStyle.similarity)}% - ${lifestyle.communicationStyle.analysis}`);
  details.push(`  - 가치관: 유사도 ${Math.round(lifestyle.valueAlignment.similarity)}% - ${lifestyle.valueAlignment.analysis}`);
  details.push(`  - 미래목표: 유사도 ${Math.round(lifestyle.futureGoals.similarity)}% - ${lifestyle.futureGoals.analysis}`);

  // 주요 갈등 영역
  if (conflicts.majorConflicts.length > 0) {
    details.push("• 주요 갈등 영역:");
    conflicts.majorConflicts.forEach(conflict => {
      details.push(`  - ${conflict.area}: ${conflict.description}`);
      details.push(`    → 해결법: ${conflict.solution}`);
    });
  }

  // 십신 관계
  if (tenGodCompat.mutualGods.length > 0) {
    const godRelation = tenGodCompat.mutualGods[0];
    details.push(`🔮 십신 관계: 한 쪽은 상대를 ${godRelation.person1God}으로, 다른 쪽은 ${godRelation.person2God}으로 봅니다.`);
    details.push(`  ${tenGodCompat.analysis}`);
  }

  // advice
  const advice = narrativeData.advice;

  // closing
  const closing = narrativeData.closing;

  return { intro, mainAnalysis, details, advice, closing };
}

function generateOverallAdvice(
  overallScore: number,
  elementCompat: ElementCompatibility,
  conflicts: ConflictAnalysis
): string {
  let advice = "";

  if (overallScore >= 80) {
    advice = "매우 좋은 궁합입니다. 서로를 보완하고 지지하는 관계로, 함께할 때 더 큰 시너지를 낼 수 있습니다. ";
  } else if (overallScore >= 65) {
    advice = "좋은 궁합입니다. 서로 다른 점도 있지만 노력하면 조화로운 관계를 유지할 수 있습니다. ";
  } else if (overallScore >= 50) {
    advice = "보통의 궁합입니다. 갈등 요소가 있지만 서로를 이해하려는 노력으로 극복 가능합니다. ";
  } else {
    advice = "도전적인 궁합입니다. 많은 노력이 필요하지만, 차이를 인정하고 성장하면 오히려 단단한 관계가 될 수 있습니다. ";
  }

  // 오행 관계에 따른 조언
  if (elementCompat.relationship === "상생") {
    advice += "오행 상생 관계로 자연스럽게 서로를 돕습니다. 이 강점을 잘 활용하세요.";
  } else if (elementCompat.relationship === "상극") {
    advice += "오행 상극 관계로 갈등이 있을 수 있습니다. 서로의 차이를 성장의 기회로 삼으세요.";
  } else {
    advice += "비슷한 성향으로 이해는 쉽지만, 새로운 자극도 필요합니다.";
  }

  return advice;
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter16(
  saju1: SajuApiResult,
  saju2: SajuApiResult
): Chapter16Result {
  // 기본 분석
  const element1 = getDayMasterElement(saju1);
  const element2 = getDayMasterElement(saju2);

  // 오행 궁합
  const elementCompatibility = analyzeElementCompatibility(element1, element2);

  // 십신 궁합
  const tenGodCompatibility = analyzeTenGodCompatibility(saju1, saju2);

  // 일주 궁합
  const dayPillarCompatibility = analyzeDayPillarCompatibility(saju1, saju2);

  // 갈등 분석
  const conflictAnalysis = analyzeConflicts(
    element1,
    element2,
    tenGodCompatibility,
    dayPillarCompatibility
  );

  // 생활 스타일 비교
  const lifestyleComparison = compareLifestyles(element1, element2);

  // 종합 점수 계산
  const overallScore = Math.round(
    (elementCompatibility.score * 0.3) +
    (tenGodCompatibility.harmony * 0.3) +
    (dayPillarCompatibility.score * 0.2) +
    ((lifestyleComparison.valueAlignment.similarity + lifestyleComparison.futureGoals.similarity) / 2 * 0.2)
  );

  // 종합 조언
  const overallAdvice = generateOverallAdvice(overallScore, elementCompatibility, conflictAnalysis);

  // 서술형 Narrative 생성
  const narrative = generateCompatibilityNarrative(
    overallScore,
    elementCompatibility,
    tenGodCompatibility,
    dayPillarCompatibility,
    conflictAnalysis,
    lifestyleComparison
  );

  return {
    overallScore,
    elementCompatibility,
    tenGodCompatibility,
    dayPillarCompatibility,
    conflictAnalysis,
    lifestyleComparison,
    overallAdvice,
    narrative
  };
}
