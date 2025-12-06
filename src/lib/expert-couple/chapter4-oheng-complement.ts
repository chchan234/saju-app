/**
 * 제4장: 오행 보완 분석
 * 부족한 오행을 채워주는 상대, 시너지 분석
 */

import type { SajuApiResult, FiveElement } from "@/types/saju";
import type { CoupleChapter4Result } from "@/types/expert-couple";

// 오행 상세 의미
const OHENG_MEANINGS: Record<string, {
  name: string;
  emoji: string;
  theme: string;
  lackingDescription: string;
  fillsDescription: string;
  benefitTogether: string;
}> = {
  목: {
    name: "나무",
    emoji: "🌳",
    theme: "추진력 · 성장",
    lackingDescription: "새로운 일을 시작하거나 계획을 추진하는 데 어려움을 느낄 수 있어요. 결정을 내리기까지 시간이 오래 걸리고, 변화 앞에서 주저하게 되기도 해요.",
    fillsDescription: "상대방의 진취적인 에너지가 함께 도전하고 성장할 용기를 불어넣어 줘요.",
    benefitTogether: "새로운 일에 함께 도전하고, 서로의 꿈을 향해 나아갈 수 있어요.",
  },
  화: {
    name: "불",
    emoji: "🔥",
    theme: "열정 · 표현력",
    lackingDescription: "감정을 표현하거나 적극적으로 나서는 게 어려울 수 있어요. 소극적으로 보이거나, 사람들 앞에서 자신을 드러내기 힘들어해요.",
    fillsDescription: "상대방의 밝고 활발한 에너지가 삶에 활력을 불어넣어 줘요.",
    benefitTogether: "더 활기차고 즐거운 일상을 만들어가며, 사회적 활동도 함께 즐길 수 있어요.",
  },
  토: {
    name: "흙",
    emoji: "🏔️",
    theme: "안정 · 신뢰",
    lackingDescription: "마음의 중심을 잡거나 안정감을 느끼기 어려울 수 있어요. 현실적인 판단보다 감정에 휘둘리거나, 불안함을 자주 느껴요.",
    fillsDescription: "상대방의 든든하고 현실적인 성향이 마음의 안정감을 줘요.",
    benefitTogether: "관계에 안정적인 기반이 생기고, 서로를 믿고 의지할 수 있어요.",
  },
  금: {
    name: "쇠",
    emoji: "⚔️",
    theme: "결단력 · 실행력",
    lackingDescription: "결정을 내리거나 일을 마무리하는 게 어려울 수 있어요. 이것저것 고민만 하다가 흐지부지되거나, 우선순위를 정하기 힘들어해요.",
    fillsDescription: "상대방의 명확하고 단호한 성향이 결정과 실행을 도와줘요.",
    benefitTogether: "계획을 세우고 실행하는 데 탄력이 붙고, 일을 끝까지 마무리할 수 있어요.",
  },
  수: {
    name: "물",
    emoji: "💧",
    theme: "지혜 · 유연함",
    lackingDescription: "상황에 맞게 유연하게 대처하거나 깊이 생각하는 게 어려울 수 있어요. 고집이 세거나, 변화에 적응하는 데 시간이 오래 걸려요.",
    fillsDescription: "상대방의 유연하고 지혜로운 대처가 여유와 깊이를 더해줘요.",
    benefitTogether: "예상치 못한 상황에서도 함께 유연하게 대처하고, 서로의 감정을 깊이 이해할 수 있어요.",
  },
};

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
 * 강한/약한/없는 오행 추출
 */
function analyzeOheng(ohengCount: Record<string, number>): {
  strong: FiveElement[];
  weak: FiveElement[];
  missing: FiveElement[];
} {
  const strong: FiveElement[] = [];
  const weak: FiveElement[] = [];
  const missing: FiveElement[] = [];

  for (const [element, count] of Object.entries(ohengCount)) {
    if (count >= 2) {
      strong.push(element as FiveElement);
    } else if (count === 0) {
      missing.push(element as FiveElement);
    } else {
      weak.push(element as FiveElement);
    }
  }

  return { strong, weak, missing };
}

/**
 * 제4장: 오행 보완 분석
 */
export function analyzeCouple4(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter4Result {
  const oheng1 = calculateOhengCount(person1);
  const oheng2 = calculateOhengCount(person2);

  const analysis1 = analyzeOheng(oheng1);
  const analysis2 = analyzeOheng(oheng2);

  // 보완 관계 찾기
  const complementaryPairs: CoupleChapter4Result["complementaryPairs"] = [];

  // person1이 부족하고 person2가 채워주는 경우
  for (const missing of [...analysis1.missing, ...analysis1.weak.filter(w => oheng1[w] === 1)]) {
    if (analysis2.strong.includes(missing as FiveElement)) {
      const meaning = OHENG_MEANINGS[missing];
      if (meaning) {
        complementaryPairs.push({
          element: missing as FiveElement,
          emoji: meaning.emoji,
          theme: meaning.theme,
          whoLacks: "person1",
          lackingDescription: meaning.lackingDescription,
          fillsDescription: meaning.fillsDescription,
          benefitTogether: meaning.benefitTogether,
        });
      }
    }
  }

  // person2가 부족하고 person1이 채워주는 경우
  for (const missing of [...analysis2.missing, ...analysis2.weak.filter(w => oheng2[w] === 1)]) {
    if (analysis1.strong.includes(missing as FiveElement)) {
      // 이미 추가된 오행은 제외
      if (!complementaryPairs.some(p => p.element === missing)) {
        const meaning = OHENG_MEANINGS[missing];
        if (meaning) {
          complementaryPairs.push({
            element: missing as FiveElement,
            emoji: meaning.emoji,
            theme: meaning.theme,
            whoLacks: "person2",
            lackingDescription: meaning.lackingDescription,
            fillsDescription: meaning.fillsDescription,
            benefitTogether: meaning.benefitTogether,
          });
        }
      }
    }
  }

  // 시너지 점수 계산 (0-100)
  const synergyScore = Math.min(100, 50 + (complementaryPairs.length * 15));

  // 종합 시너지 설명
  let overallSynergy = "";
  if (complementaryPairs.length >= 3) {
    overallSynergy = `두 분은 오행적으로 매우 훌륭한 보완 관계를 가지고 있습니다. ${complementaryPairs.length}개의 오행에서 서로를 채워주며, 함께 있을 때 더욱 균형 잡힌 에너지를 발휘할 수 있습니다.`;
  } else if (complementaryPairs.length >= 1) {
    overallSynergy = `두 분은 ${complementaryPairs.length}개의 오행에서 서로를 보완합니다. 이러한 보완 관계가 관계에 안정감을 더해줍니다.`;
  } else {
    overallSynergy = `두 분은 오행적으로 비슷한 구성을 가지고 있어, 보완보다는 비슷한 에너지를 공유하는 관계입니다. 함께 강한 부분은 더욱 강해지지만, 부족한 부분은 함께 노력해야 할 수 있습니다.`;
  }

  return {
    person1Elements: {
      strong: analysis1.strong,
      weak: analysis1.weak,
      missing: analysis1.missing,
    },
    person2Elements: {
      strong: analysis2.strong,
      weak: analysis2.weak,
      missing: analysis2.missing,
    },
    complementaryPairs,
    synergyScore,
    overallSynergy,
    narrative: {
      intro: `두 분의 오행 구성이 어떻게 서로를 보완하는지 살펴보겠습니다.`,
      mainAnalysis: `${person1Name}님은 ${analysis1.strong.length > 0 ? analysis1.strong.map(e => `${OHENG_MEANINGS[e]?.name || e}(${e})`).join(", ") + " 기운이 강하고" : "강한 오행이 없고"}, ${analysis1.missing.length > 0 ? analysis1.missing.map(e => `${OHENG_MEANINGS[e]?.name || e}(${e})`).join(", ") + " 기운이 부족합니다" : "부족한 오행이 없습니다"}. ${person2Name}님은 ${analysis2.strong.length > 0 ? analysis2.strong.map(e => `${OHENG_MEANINGS[e]?.name || e}(${e})`).join(", ") + " 기운이 강하고" : "강한 오행이 없고"}, ${analysis2.missing.length > 0 ? analysis2.missing.map(e => `${OHENG_MEANINGS[e]?.name || e}(${e})`).join(", ") + " 기운이 부족합니다" : "부족한 오행이 없습니다"}.`,
      details: complementaryPairs.map(pair =>
        `${pair.emoji} ${pair.theme}: ${pair.whoLacks === "person1" ? person1Name : person2Name}님에게 부족한 ${pair.element} 기운을 ${pair.whoLacks === "person1" ? person2Name : person1Name}님이 채워줍니다. ${pair.benefitTogether}`
      ),
      advice: overallSynergy,
      closing: `다음 장에서는 오행 충돌 관계를 분석하겠습니다.`,
    },
  };
}
