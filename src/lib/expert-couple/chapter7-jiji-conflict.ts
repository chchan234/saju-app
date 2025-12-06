/**
 * 제7장: 지지 충·형·해 분석
 * 충돌 관계별 주의점 및 조언
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter7Result } from "@/types/expert-couple";

// 지지 충 관계
const JIJI_CHUNG: Record<string, { match: string; description: string; conflictArea: string; solution: string }> = {
  자: { match: "오", description: "자오충(子午沖) - 북방 물과 남방 불의 정면충돌", conflictArea: "감정과 열정의 충돌로 감정적 대립이 잦음", solution: "서로의 페이스를 존중하고 감정 표현 방식의 차이를 인정하세요" },
  오: { match: "자", description: "오자충(午子沖) - 뜨거운 열정과 차가운 이성의 충돌", conflictArea: "속도와 온도의 차이로 답답함 발생", solution: "감정적 대응을 피하고 냉정함을 유지하려 노력하세요" },
  축: { match: "미", description: "축미충(丑未沖) - 두 흙의 충돌로 가치관 대립", conflictArea: "고집과 신념의 충돌, 양보가 어려움", solution: "서로의 가치관을 존중하고 타협점을 찾으세요" },
  미: { match: "축", description: "미축충(未丑沖) - 서로 다른 신념의 충돌", conflictArea: "원칙과 기준의 차이로 갈등", solution: "무조건적인 설득보다 이해를 먼저 시도하세요" },
  인: { match: "신", description: "인신충(寅申沖) - 나무와 쇠의 충돌로 행동방식 차이", conflictArea: "추진력과 실행력의 차이로 마찰", solution: "각자의 방식을 존중하고 역할 분담을 명확히 하세요" },
  신: { match: "인", description: "신인충(申寅沖) - 실행력의 차이로 갈등", conflictArea: "목표는 같으나 방법이 달라 충돌", solution: "서로의 장점을 인정하고 협력하면 큰 일을 이룰 수 있습니다" },
  묘: { match: "유", description: "묘유충(卯酉沖) - 나무와 쇠의 충돌로 소통방식 차이", conflictArea: "표현과 전달 방식의 차이로 오해 발생", solution: "상대방의 말을 끝까지 듣고 반응하는 연습을 하세요" },
  유: { match: "묘", description: "유묘충(酉卯沖) - 표현 방식의 차이로 오해", conflictArea: "말과 행동의 불일치로 신뢰 손상", solution: "진심을 전할 때는 말보다 행동으로 보여주세요" },
  진: { match: "술", description: "진술충(辰戌沖) - 두 흙의 충돌로 주도권 다툼", conflictArea: "권력과 리더십의 충돌", solution: "역할을 명확히 분담하고 서로의 영역을 존중하세요" },
  술: { match: "진", description: "술진충(戌辰沖) - 리더십의 충돌", conflictArea: "서로 양보하기 어려운 상황", solution: "중요한 결정은 함께 상의하세요" },
  사: { match: "해", description: "사해충(巳亥沖) - 불과 물의 극렬한 대립", conflictArea: "근본적인 기질 차이로 갈등이 심함", solution: "많은 이해와 인내가 필요합니다. 다름을 인정하세요" },
  해: { match: "사", description: "해사충(亥巳沖) - 근본적인 기질의 차이", conflictArea: "생활 방식과 성격이 정반대", solution: "서로 다르다는 것을 인정하고 보완점으로 활용하세요" },
};

// 지지 형 관계
const JIJI_HYUNG: Record<string, { matches: string[]; descriptions: Record<string, { description: string; conflictArea: string; solution: string }> }> = {
  인: {
    matches: ["사", "신"],
    descriptions: {
      사: { description: "인사형(寅巳刑) - 무은지형(無恩之刑)", conflictArea: "베풀어도 인정받지 못한다고 느낌", solution: "감사의 마음을 자주 표현하세요" },
      신: { description: "인신형(寅申刑) - 활동성의 충돌", conflictArea: "서로의 방식에 간섭하다 마찰", solution: "각자의 방식을 존중하고 결과로 평가하세요" },
    },
  },
  사: {
    matches: ["인", "신"],
    descriptions: {
      인: { description: "사인형(巳寅刑) - 기대와 현실의 차이", conflictArea: "기대에 못 미쳐 실망", solution: "서로에 대한 기대치를 낮추세요" },
      신: { description: "사신형(巳申刑) - 변화와 안정 사이의 갈등", conflictArea: "서로의 니즈가 충돌", solution: "균형 있게 충족시키려 노력하세요" },
    },
  },
  신: {
    matches: ["인", "사"],
    descriptions: {
      인: { description: "신인형(申寅刑) - 실행 방식의 차이", conflictArea: "목표는 같으나 방법이 다름", solution: "방법의 차이를 인정하세요" },
      사: { description: "신사형(申巳刑) - 계획과 즉흥의 충돌", conflictArea: "예상치 못한 변화에 갈등", solution: "중요한 일은 미리 상의하세요" },
    },
  },
  축: {
    matches: ["술", "미"],
    descriptions: {
      술: { description: "축술형(丑戌刑) - 지세지형(持勢之刑)", conflictArea: "권력과 체면의 다툼", solution: "동등한 파트너로 대하세요" },
      미: { description: "축미형(丑未刑) - 고집과 신념의 충돌", conflictArea: "타협점 찾기 어려움", solution: "제3자의 조언을 구하세요" },
    },
  },
  술: {
    matches: ["축", "미"],
    descriptions: {
      축: { description: "술축형(戌丑刑) - 자존심 싸움", conflictArea: "이기려 하다 관계 손상", solution: "이기려 하지 말고 관계를 지키세요" },
      미: { description: "술미형(戌未刑) - 신뢰의 문제", conflictArea: "의심과 오해가 쌓임", solution: "약속을 지키고 일관된 태도를 유지하세요" },
    },
  },
  미: {
    matches: ["축", "술"],
    descriptions: {
      축: { description: "미축형(未丑刑) - 가치관의 대립", conflictArea: "서로의 기준을 강요", solution: "기준을 강요하지 마세요" },
      술: { description: "미술형(未戌刑) - 의심과 오해", conflictArea: "신뢰가 흔들림", solution: "솔직하게 대화하고 오해를 풀으세요" },
    },
  },
  자: {
    matches: ["묘"],
    descriptions: {
      묘: { description: "자묘형(子卯刑) - 무례지형(無禮之刑)", conflictArea: "서로에게 무례하게 대하기 쉬움", solution: "존중하는 태도와 말투를 유지하세요" },
    },
  },
  묘: {
    matches: ["자"],
    descriptions: {
      자: { description: "묘자형(卯子刑) - 서로의 행동이 불쾌하게 느껴짐", conflictArea: "사소한 것에 예민해짐", solution: "감정이 상하면 잠시 후 대화하세요" },
    },
  },
};

// 지지 해 관계
const JIJI_HAE: Record<string, { match: string; description: string; conflictArea: string; solution: string }> = {
  자: { match: "미", description: "자미해(子未害)", conflictArea: "서로의 노력이 무너지기 쉬움", solution: "중요한 결정은 충분히 상의하세요" },
  미: { match: "자", description: "미자해(未子害)", conflictArea: "뜻하지 않게 손해를 끼침", solution: "재정 문제는 신중하게 접근하세요" },
  축: { match: "오", description: "축오해(丑午害)", conflictArea: "서로의 발전을 방해하게 됨", solution: "상대방의 성장을 진심으로 응원하세요" },
  오: { match: "축", description: "오축해(午丑害)", conflictArea: "열정과 신중함의 충돌", solution: "급하게 결정하지 말고 의견을 들어보세요" },
  인: { match: "사", description: "인사해(寅巳害)", conflictArea: "은혜가 원수가 되기 쉬움", solution: "베풀 때 대가를 기대하지 마세요" },
  사: { match: "인", description: "사인해(巳寅害)", conflictArea: "도우려다 해가 됨", solution: "도움이 필요한지 먼저 물어보세요" },
  묘: { match: "진", description: "묘진해(卯辰害)", conflictArea: "사소한 오해가 큰 갈등으로", solution: "작은 문제도 그때그때 해결하세요" },
  진: { match: "묘", description: "진묘해(辰卯害)", conflictArea: "의견 충돌이 잦고 타협이 어려움", solution: "시간을 두고 다시 이야기하세요" },
  신: { match: "해", description: "신해해(申亥害)", conflictArea: "계획이 자주 틀어짐", solution: "중요한 약속은 여유를 두고 잡으세요" },
  해: { match: "신", description: "해신해(亥申害)", conflictArea: "기대와 결과의 차이로 실망", solution: "기대치를 현실적으로 조정하세요" },
  유: { match: "술", description: "유술해(酉戌害)", conflictArea: "가까운 사이에서 상처 주고받음", solution: "친밀할수록 더 예의를 지키세요" },
  술: { match: "유", description: "술유해(戌酉害)", conflictArea: "사소한 말다툼이 큰 갈등", solution: "감정적으로 말하기 전에 생각하세요" },
};

/**
 * 제7장: 지지 충·형·해 분석
 */
export function analyzeCouple7(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter7Result {
  // 지지 추출
  const hasTime = person1.timePillar.cheongan && person2.timePillar.cheongan;
  const jiji1 = hasTime
    ? [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji, person1.timePillar.jiji]
    : [person1.yearPillar.jiji, person1.monthPillar.jiji, person1.dayPillar.jiji];
  const jiji2 = hasTime
    ? [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji, person2.timePillar.jiji]
    : [person2.yearPillar.jiji, person2.monthPillar.jiji, person2.dayPillar.jiji];

  const chungs: CoupleChapter7Result["chungs"] = [];
  const hyungs: CoupleChapter7Result["hyungs"] = [];
  const haes: CoupleChapter7Result["haes"] = [];
  const processedPairs = new Set<string>();

  for (const j1 of jiji1.filter(Boolean)) {
    for (const j2 of jiji2.filter(Boolean)) {
      const pairKey = [j1, j2].sort().join("-");

      // 충 체크
      if (JIJI_CHUNG[j1]?.match === j2 && !processedPairs.has(`chung-${pairKey}`)) {
        processedPairs.add(`chung-${pairKey}`);
        const info = JIJI_CHUNG[j1];
        chungs.push({ pair: `${j1}-${j2}`, description: info.description, conflictArea: info.conflictArea, solution: info.solution });
      }

      // 형 체크
      if (JIJI_HYUNG[j1]?.matches.includes(j2) && !processedPairs.has(`hyung-${pairKey}`)) {
        processedPairs.add(`hyung-${pairKey}`);
        const info = JIJI_HYUNG[j1].descriptions[j2];
        if (info) {
          hyungs.push({ pair: `${j1}-${j2}`, description: info.description, conflictArea: info.conflictArea, solution: info.solution });
        }
      }

      // 해 체크
      if (JIJI_HAE[j1]?.match === j2 && !processedPairs.has(`hae-${pairKey}`)) {
        processedPairs.add(`hae-${pairKey}`);
        const info = JIJI_HAE[j1];
        haes.push({ pair: `${j1}-${j2}`, description: info.description, conflictArea: info.conflictArea, solution: info.solution });
      }
    }
  }

  const totalNegativeCount = chungs.length + hyungs.length + haes.length;

  // 전체 위험도 판단
  let overallRisk: CoupleChapter7Result["overallRisk"];
  if (totalNegativeCount >= 4) {
    overallRisk = "높음";
  } else if (totalNegativeCount >= 2) {
    overallRisk = "보통";
  } else if (totalNegativeCount >= 1) {
    overallRisk = "낮음";
  } else {
    overallRisk = "없음";
  }

  // 관리 조언
  let managementAdvice = "";
  if (overallRisk === "높음") {
    managementAdvice = `두 분 사이에는 여러 개의 지지 충돌 관계가 있습니다. 이는 관계에서 갈등이 발생할 수 있는 요소들입니다. 하지만 이를 미리 알고 준비하면 충분히 극복할 수 있습니다. 갈등 상황에서 감정적으로 대응하지 말고, 시간을 두고 차분하게 대화하세요.`;
  } else if (overallRisk === "보통") {
    managementAdvice = `몇 가지 주의할 지지 관계가 있지만 심각한 수준은 아닙니다. 해당 영역에서 갈등이 생길 수 있으니 미리 인식하고 대비하면 좋습니다.`;
  } else if (overallRisk === "낮음") {
    managementAdvice = `지지 충돌 관계가 적어 큰 어려움 없이 조화로운 관계를 유지할 수 있습니다.`;
  } else {
    managementAdvice = `두 분 사이에 뚜렷한 지지 충돌 관계가 없습니다. 이는 근본적인 갈등 요소가 적다는 좋은 징표입니다.`;
  }

  return {
    chungs,
    hyungs,
    haes,
    totalNegativeCount,
    overallRisk,
    managementAdvice,
    narrative: {
      intro: `지지의 충(沖), 형(刑), 해(害) 관계는 두 사람 사이의 잠재적 갈등 요소를 나타냅니다. 이를 미리 알면 갈등을 예방하고 관리하는 데 도움이 됩니다.`,
      mainAnalysis: totalNegativeCount > 0
        ? `${person1Name}님과 ${person2Name}님 사이에는 충 ${chungs.length}개, 형 ${hyungs.length}개, 해 ${haes.length}개의 갈등 요소가 있습니다.`
        : `두 분 사이에는 뚜렷한 지지 충돌 관계가 없습니다.`,
      details: [
        ...chungs.map(c => `충(沖) ${c.pair}: ${c.conflictArea}. ${c.solution}`),
        ...hyungs.map(h => `형(刑) ${h.pair}: ${h.conflictArea}. ${h.solution}`),
        ...haes.map(h => `해(害) ${h.pair}: ${h.conflictArea}. ${h.solution}`),
      ],
      advice: managementAdvice,
      closing: `다음 장에서는 두 분의 소통 방식을 분석하겠습니다.`,
    },
  };
}
