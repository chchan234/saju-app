/**
 * 제5장: 오행 충돌 분석
 * 상극 요소, 갈등 원인, 해소법
 */

import type { SajuApiResult, FiveElement } from "@/types/saju";
import type { CoupleChapter5Result } from "@/types/expert-couple";

// 오행 이모지
const OHENG_EMOJI: Record<string, string> = {
  목: "🌳", 화: "🔥", 토: "🏔️", 금: "⚔️", 수: "💧",
};

// 상극 관계 정의 (A가 B를 극함)
const SANGGEUK: Record<string, string> = {
  목: "토", // 목극토
  화: "금", // 화극금
  토: "수", // 토극수
  금: "목", // 금극목
  수: "화", // 수극화
};

// 상극 관계별 갈등 설명
const SANGGEUK_CONFLICTS: Record<string, {
  theme: string;
  description: string;
  warning: string;
  solution: string;
}> = {
  "목토": {
    theme: "성장 vs 안정",
    description: "한 분은 새로운 것을 시도하고 확장하려 하고, 다른 분은 현재에 만족하며 안정을 추구해요.",
    warning: "도전하자는 쪽과 지키자는 쪽이 부딪힐 수 있어요. 변화를 원하는 마음과 안정을 원하는 마음이 충돌합니다.",
    solution: "무엇을 도전하고 무엇을 지킬지 함께 정해보세요. 큰 변화는 함께 논의하고, 작은 도전은 서로 응원해주세요.",
  },
  "화금": {
    theme: "열정 vs 원칙",
    description: "한 분은 감정대로, 분위기대로 행동하고, 다른 분은 규칙과 계획을 중요시해요.",
    warning: "즉흥적인 행동이 계획을 망친다고 느끼거나, 원칙이 답답하게 느껴질 수 있어요.",
    solution: "'네 방식도 이유가 있구나'라고 인정하는 것부터 시작해보세요. 계획과 즉흥 사이의 균형을 찾으세요.",
  },
  "토수": {
    theme: "고정 vs 변화",
    description: "한 분은 안정과 일관성을 원하고, 다른 분은 흐름에 맡기며 변화를 즐겨요.",
    warning: "변화를 거부하는 것처럼 보이거나, 너무 갈대 같다고 느낄 수 있어요.",
    solution: "변하지 않아야 할 것과 변해도 괜찮은 것을 함께 정해보세요. 서로의 리듬을 존중하세요.",
  },
  "금목": {
    theme: "정리 vs 확장",
    description: "한 분은 정리하고 줄이려 하고, 다른 분은 키우고 늘리려 해요.",
    warning: "비우자는 쪽과 채우자는 쪽이 부딪힐 수 있어요. 미니멀리즘과 맥시멀리즘의 충돌입니다.",
    solution: "각자의 영역을 정해서 한쪽은 정리, 한쪽은 확장을 맡아보세요. 공용 공간은 협의하세요.",
  },
  "수화": {
    theme: "신중함 vs 열정",
    description: "한 분은 깊이 생각하고 신중하게 행동하고, 다른 분은 뜨겁게 바로 움직여요.",
    warning: "속도 차이로 답답하거나 성급하다고 느낄 수 있어요. 결정과 행동의 템포가 다릅니다.",
    solution: "큰 결정은 신중하게, 작은 일은 즉흥적으로 - 상황에 따라 번갈아 해보세요.",
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
 * 제5장: 오행 충돌 분석
 */
export function analyzeCouple5(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter5Result {
  const oheng1 = calculateOhengCount(person1);
  const oheng2 = calculateOhengCount(person2);

  // 강한 오행 추출
  const getStrong = (oheng: Record<string, number>) =>
    Object.entries(oheng).filter(([, v]) => v >= 2).map(([k]) => k);

  const person1Strong = getStrong(oheng1);
  const person2Strong = getStrong(oheng2);

  // 충돌 관계 찾기
  const conflicts: CoupleChapter5Result["conflicts"] = [];
  const processedConflicts = new Set<string>();

  for (const s1 of person1Strong) {
    for (const s2 of person2Strong) {
      if (SANGGEUK[s1] === s2 || SANGGEUK[s2] === s1) {
        const conflictKey = [s1, s2].sort().join("");
        if (processedConflicts.has(conflictKey)) continue;
        processedConflicts.add(conflictKey);

        // 상극 데이터 찾기
        const conflictData = SANGGEUK_CONFLICTS[conflictKey] ||
          SANGGEUK_CONFLICTS[[s2, s1].join("")] ||
          SANGGEUK_CONFLICTS[[s1, s2].join("")];

        if (conflictData) {
          conflicts.push({
            elements: [s1 as FiveElement, s2 as FiveElement],
            emojis: [OHENG_EMOJI[s1], OHENG_EMOJI[s2]],
            theme: conflictData.theme,
            description: conflictData.description,
            warning: conflictData.warning,
            solution: conflictData.solution,
          });
        }
      }
    }
  }

  // 충돌 심각도 판단
  let conflictSeverity: CoupleChapter5Result["conflictSeverity"];
  if (conflicts.length >= 3) {
    conflictSeverity = "심각";
  } else if (conflicts.length === 2) {
    conflictSeverity = "보통";
  } else if (conflicts.length === 1) {
    conflictSeverity = "경미";
  } else {
    conflictSeverity = "없음";
  }

  // 관리 조언
  let managementAdvice = "";
  if (conflictSeverity === "심각") {
    managementAdvice = `두 분 사이에는 ${conflicts.length}개의 오행 상극 관계가 있습니다. 근본적인 성향 차이가 있어 갈등이 발생할 수 있지만, 이를 인식하고 미리 대비하면 충분히 극복할 수 있습니다. 중요한 것은 상대방의 방식을 '틀린 것'이 아닌 '다른 것'으로 받아들이는 것입니다.`;
  } else if (conflictSeverity === "보통") {
    managementAdvice = `두 분 사이에 ${conflicts.length}개의 상극 관계가 있습니다. 때때로 의견 차이가 생길 수 있지만, 서로의 다름을 존중하면 오히려 보완적인 관계가 될 수 있습니다.`;
  } else if (conflictSeverity === "경미") {
    managementAdvice = `오행 상극 관계가 1개 있지만 심각한 수준은 아닙니다. 해당 영역에서만 주의하면 큰 문제없이 조화로운 관계를 유지할 수 있습니다.`;
  } else {
    managementAdvice = `두 분 사이에 뚜렷한 오행 상극 관계가 없습니다. 오행적으로 조화로운 구성이며, 큰 충돌 없이 편안한 관계를 유지할 수 있습니다.`;
  }

  return {
    conflicts,
    conflictSeverity,
    managementAdvice,
    narrative: {
      intro: `이번에는 두 분의 오행에서 충돌할 수 있는 부분을 살펴보겠습니다.`,
      mainAnalysis: conflictSeverity === "없음"
        ? `두 분은 오행적으로 큰 충돌 요소가 없습니다. 이는 근본적인 성향 차이로 인한 갈등이 적다는 것을 의미합니다.`
        : `두 분 사이에는 ${conflicts.length}개의 오행 상극 관계가 있습니다. 이는 갈등의 원인이 될 수 있지만, 미리 알고 대비하면 충분히 극복할 수 있습니다.`,
      details: conflicts.map(conflict =>
        `${conflict.emojis[0]}${conflict.emojis[1]} ${conflict.theme}: ${conflict.description}`
      ),
      advice: managementAdvice,
      closing: `다음 장에서는 지지의 육합 관계를 살펴보겠습니다.`,
    },
  };
}
