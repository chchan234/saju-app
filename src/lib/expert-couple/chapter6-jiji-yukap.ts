/**
 * 제6장: 지지 육합 분석
 * 합(合) 관계별 상세 의미
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter6Result } from "@/types/expert-couple";

// 지지 육합 관계
const JIJI_YUKAP: Record<string, { match: string; description: string; positiveEffect: string }> = {
  자: {
    match: "축",
    description: "자축합(子丑合) - 물(水)과 흙(土)이 만나 토로 변합니다.",
    positiveEffect: "서로의 부족함을 채워주며 안정적인 관계를 만들어갑니다. 현실적이면서도 감성적인 균형을 맞춥니다.",
  },
  축: {
    match: "자",
    description: "축자합(丑子合) - 흙(土)과 물(水)이 조화를 이룹니다.",
    positiveEffect: "든든한 기반 위에 유연함이 더해져 안정적이면서도 적응력 있는 관계가 됩니다.",
  },
  인: {
    match: "해",
    description: "인해합(寅亥合) - 나무(木)와 물(水)이 상생하여 목으로 변합니다.",
    positiveEffect: "서로에게 영감을 주고 함께 성장하는 관계입니다. 새로운 시작과 발전을 함께합니다.",
  },
  해: {
    match: "인",
    description: "해인합(亥寅合) - 물(水)이 나무(木)를 키웁니다.",
    positiveEffect: "물이 나무를 키우듯, 서로를 지지하고 성장시키는 아름다운 조합입니다.",
  },
  묘: {
    match: "술",
    description: "묘술합(卯戌合) - 나무(木)와 흙(土)이 만나 화로 변합니다.",
    positiveEffect: "이상과 현실의 균형을 이루며 실질적인 결과물을 만들어냅니다.",
  },
  술: {
    match: "묘",
    description: "술묘합(戌卯合) - 흙(土)이 나무(木)에게 뿌리내릴 기반을 제공합니다.",
    positiveEffect: "안정감 있는 파트너십으로 서로에게 든든한 버팀목이 됩니다.",
  },
  진: {
    match: "유",
    description: "진유합(辰酉合) - 흙(土)과 쇠(金)가 합하여 금으로 변합니다.",
    positiveEffect: "목표를 향해 함께 나아가는 관계입니다. 강인한 결속력을 보입니다.",
  },
  유: {
    match: "진",
    description: "유진합(酉辰合) - 쇠(金)와 흙(土)이 서로를 단단하게 만듭니다.",
    positiveEffect: "신뢰와 책임감이 바탕이 되는 관계입니다. 함께하면 더욱 강해집니다.",
  },
  사: {
    match: "신",
    description: "사신합(巳申合) - 불(火)과 쇠(金)가 만나 수로 변합니다.",
    positiveEffect: "변화와 혁신을 만들어냅니다. 서로의 열정이 시너지를 냅니다.",
  },
  신: {
    match: "사",
    description: "신사합(申巳合) - 쇠(金)와 불(火)이 조화를 이룹니다.",
    positiveEffect: "활력 넘치는 관계를 형성합니다. 서로 자극을 주며 발전합니다.",
  },
  오: {
    match: "미",
    description: "오미합(午未合) - 불(火)과 흙(土)이 만나 화토로 변합니다.",
    positiveEffect: "정서적으로 깊이 연결된 관계입니다. 따뜻한 에너지를 공유합니다.",
  },
  미: {
    match: "오",
    description: "미오합(未午合) - 흙(土)과 불(火)이 서로를 따뜻하게 감쌉니다.",
    positiveEffect: "정서적 안정을 주며 서로에게 위안이 됩니다. 가정적인 화목함을 만듭니다.",
  },
};

/**
 * 제6장: 지지 육합 분석
 */
export function analyzeCouple6(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter6Result {
  // 지지 추출
  const hasTime = person1.timePillar.cheongan && person2.timePillar.cheongan;
  const jiji1 = hasTime
    ? [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji, person1.timePillar.jiji]
    : [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji];
  const jiji2 = hasTime
    ? [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji, person2.timePillar.jiji]
    : [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji];

  // 육합 찾기
  const yukaps: CoupleChapter6Result["yukaps"] = [];
  const processedPairs = new Set<string>();

  for (const j1 of jiji1.filter(Boolean)) {
    for (const j2 of jiji2.filter(Boolean)) {
      if (JIJI_YUKAP[j1]?.match === j2) {
        const pairKey = [j1, j2].sort().join("-");
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          const yukapInfo = JIJI_YUKAP[j1];
          yukaps.push({
            pair: `${j1}-${j2}`,
            person1Branch: j1,
            person2Branch: j2,
            description: yukapInfo.description,
            positiveEffect: yukapInfo.positiveEffect,
          });
        }
      }
    }
  }

  const hasYukap = yukaps.length > 0;

  // 종합 조화 설명
  let overallHarmony = "";
  if (yukaps.length >= 3) {
    overallHarmony = `두 분 사이에는 ${yukaps.length}개의 육합이 있습니다! 이는 매우 드문 경우로, 사주적으로 천생연분에 가까운 조합입니다. 자연스럽게 서로에게 끌리고 함께 있으면 편안함을 느낍니다.`;
  } else if (yukaps.length === 2) {
    overallHarmony = `두 분 사이에 2개의 육합이 있습니다. 서로에게 강한 끌림이 있으며, 함께 있을 때 조화로운 에너지가 흐릅니다. 좋은 궁합의 징표입니다.`;
  } else if (yukaps.length === 1) {
    overallHarmony = `두 분 사이에 1개의 육합이 있습니다. 이 육합이 관계에 안정감과 조화를 더해줍니다. 서로를 이해하고 맞춰가는 데 도움이 됩니다.`;
  } else {
    overallHarmony = `두 분 사이에 뚜렷한 육합은 없습니다. 하지만 이것이 궁합이 나쁘다는 의미는 아닙니다. 다른 요소들에서 좋은 조화를 찾을 수 있습니다.`;
  }

  return {
    yukaps,
    hasYukap,
    overallHarmony,
    narrative: {
      intro: `지지의 육합(六合)은 두 사람 사이의 자연스러운 조화와 끌림을 나타냅니다. 육합이 있으면 서로에게 편안함을 느끼고 자연스럽게 맞춰갑니다.`,
      mainAnalysis: hasYukap
        ? `${person1Name}님과 ${person2Name}님 사이에는 ${yukaps.length}개의 육합이 발견되었습니다.`
        : `두 분 사이에는 뚜렷한 육합이 없지만, 이것이 궁합에 결정적인 영향을 미치지는 않습니다.`,
      details: yukaps.map(yukap =>
        `${yukap.pair}: ${yukap.description} ${yukap.positiveEffect}`
      ),
      advice: overallHarmony,
      closing: `다음 장에서는 지지의 충, 형, 해 관계를 살펴보겠습니다.`,
    },
  };
}
