/**
 * 제16장: 종합 조언
 * 전체 분석 요약 및 실천 가이드
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter16Result } from "@/types/expert-couple";

// 천간 오행
const CHEONGAN_OHENG: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};

// 상생 관계
const SANGSAENG: Record<string, string> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목",
};

// 상극 관계
const SANGGEUK: Record<string, string> = {
  목: "토", 화: "금", 토: "수", 금: "목", 수: "화",
};

// 핵심 강점 분석
function analyzeCoreStrengths(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): string[] {
  const strengths: string[] = [];
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1];
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2];

  // 상생 관계
  if (SANGSAENG[ilgan1Oheng] === ilgan2Oheng) {
    strengths.push(`${person1Name}님이 ${person2Name}님을 성장시키고 지지하는 관계입니다.`);
  }
  if (SANGSAENG[ilgan2Oheng] === ilgan1Oheng) {
    strengths.push(`${person2Name}님이 ${person1Name}님에게 에너지와 영감을 주는 관계입니다.`);
  }

  // 같은 오행
  if (ilgan1Oheng === ilgan2Oheng) {
    strengths.push("서로를 잘 이해하고 공감할 수 있는 관계입니다.");
  }

  // 일간별 조합 강점
  if (["갑", "을"].includes(ilgan1) && ["임", "계"].includes(ilgan2)) {
    strengths.push("서로에게 영감을 주며 함께 성장하는 관계입니다.");
  }
  if (["병", "정"].includes(ilgan1) && ["갑", "을"].includes(ilgan2)) {
    strengths.push("열정과 성장이 함께하는 활기찬 관계입니다.");
  }
  if (["무", "기"].includes(ilgan1) && ["병", "정"].includes(ilgan2)) {
    strengths.push("안정과 열정이 조화를 이루는 관계입니다.");
  }
  if (["경", "신"].includes(ilgan1) && ["무", "기"].includes(ilgan2)) {
    strengths.push("신뢰와 안정을 바탕으로 결실을 맺는 관계입니다.");
  }

  // 기본 강점
  if (strengths.length === 0) {
    strengths.push("서로 다른 관점을 가져와 넓은 시야를 갖게 됩니다.");
  }
  strengths.push("함께 노력하면 어떤 어려움도 극복할 수 있습니다.");

  return strengths.slice(0, 5);
}

// 핵심 약점 분석
function analyzeCoreWeaknesses(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): string[] {
  const weaknesses: string[] = [];
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1];
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2];

  // 상극 관계
  if (SANGGEUK[ilgan1Oheng] === ilgan2Oheng) {
    weaknesses.push("의견 충돌이 있을 때 서로 물러서기 어려울 수 있습니다.");
  }
  if (SANGGEUK[ilgan2Oheng] === ilgan1Oheng) {
    weaknesses.push("가치관 차이로 갈등이 생길 수 있습니다.");
  }

  // 성격 조합 약점
  if (["갑", "경"].includes(ilgan1) && ["갑", "경"].includes(ilgan2)) {
    weaknesses.push("둘 다 강한 성격이라 주도권 다툼이 있을 수 있습니다.");
  }
  if (["정", "계"].includes(ilgan1) && ["정", "계"].includes(ilgan2)) {
    weaknesses.push("감정에 치우쳐 합리적 판단이 어려울 수 있습니다.");
  }
  if (["을", "계"].includes(ilgan1) && ["을", "계"].includes(ilgan2)) {
    weaknesses.push("소극적 소통으로 오해가 쌓일 수 있습니다.");
  }

  // 기본 약점
  if (weaknesses.length === 0) {
    weaknesses.push("바쁜 일상에서 관계 관리를 소홀히 할 수 있습니다.");
  }

  return weaknesses.slice(0, 4);
}

// 반드시 해야 할 것들
function generateMustDoList(ilgan1: string, ilgan2: string, person1Name: string, person2Name: string): string[] {
  const mustDo: string[] = [];

  mustDo.push("주 1회 이상 진지한 대화 시간을 가지세요.");
  mustDo.push("서로의 장점을 자주 말해주세요.");
  mustDo.push("중요한 결정은 반드시 함께 상의하세요.");

  // 조합별 추가
  if (["갑", "병", "경"].includes(ilgan1) || ["갑", "병", "경"].includes(ilgan2)) {
    mustDo.push("상대방의 의견을 끝까지 경청하세요.");
  }
  if (["정", "계"].includes(ilgan1) || ["정", "계"].includes(ilgan2)) {
    mustDo.push("속마음을 말로 표현하는 연습을 하세요.");
  }
  if (["무", "기"].includes(ilgan1) || ["무", "기"].includes(ilgan2)) {
    mustDo.push("가끔은 새로운 경험과 변화를 시도하세요.");
  }

  return mustDo.slice(0, 5);
}

// 피해야 할 것들
function generateMustAvoidList(ilgan1: string, ilgan2: string): string[] {
  const mustAvoid: string[] = [];

  mustAvoid.push("감정이 격해졌을 때 중요한 대화를 하지 마세요.");
  mustAvoid.push("상대방 가족을 비난하지 마세요.");
  mustAvoid.push("과거의 실수를 반복해서 꺼내지 마세요.");

  // 조합별 추가
  if (["갑", "경"].includes(ilgan1) || ["갑", "경"].includes(ilgan2)) {
    mustAvoid.push("'항상', '절대' 같은 극단적 표현은 피하세요.");
  }
  if (["병"].includes(ilgan1) || ["병"].includes(ilgan2)) {
    mustAvoid.push("화가 났을 때 충동적으로 행동하지 마세요.");
  }
  if (["임", "계"].includes(ilgan1) || ["임", "계"].includes(ilgan2)) {
    mustAvoid.push("문제를 회피하고 도망가지 마세요.");
  }

  return mustAvoid.slice(0, 5);
}

// 일상 습관
function generateDailyHabits(): string[] {
  return [
    "아침에 일어나면 '좋은 아침' 인사를 나누세요.",
    "하루 5분 이상 눈을 맞추고 대화하세요.",
    "감사한 점 하나씩 말해주세요.",
    "자기 전에 '오늘 어땠어?' 하고 물어보세요.",
    "스킨십을 자주 나누세요. 작은 터치도 좋습니다.",
  ];
}

// 소통 규칙
function generateCommunicationRules(ilgan1: string, ilgan2: string): string[] {
  const rules: string[] = [];

  rules.push("상대방이 말할 때 중간에 끊지 마세요.");
  rules.push("'너는~' 대신 '나는~'으로 시작하세요.");
  rules.push("비판할 때는 해결책도 함께 제안하세요.");

  // 조합별 추가
  if ((["갑", "경"].includes(ilgan1) && ["을", "계"].includes(ilgan2)) ||
    (["을", "계"].includes(ilgan1) && ["갑", "경"].includes(ilgan2))) {
    rules.push("직접적 표현과 우회적 표현의 차이를 이해하세요.");
    rules.push("강한 표현은 한 번 더 생각하고, 속마음은 말로 표현하세요.");
  }

  rules.push("갈등이 해결되면 그 자리에서 정리하고 넘어가세요.");

  return rules.slice(0, 5);
}

// 최종 메시지 생성
function generateFinalMessage(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): string {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1];
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2];

  let baseMessage = `${person1Name}님과 ${person2Name}님, 두 분의 사주를 깊이 분석해보았습니다. `;

  // 궁합 수준에 따른 메시지
  if (SANGSAENG[ilgan1Oheng] === ilgan2Oheng || SANGSAENG[ilgan2Oheng] === ilgan1Oheng) {
    baseMessage += "두 분은 서로를 성장시키는 좋은 인연입니다. ";
  } else if (ilgan1Oheng === ilgan2Oheng) {
    baseMessage += "두 분은 서로를 잘 이해할 수 있는 관계입니다. ";
  } else {
    baseMessage += "두 분은 서로 다른 에너지를 가지고 있어 보완적인 관계가 될 수 있습니다. ";
  }

  baseMessage += "사주는 두 분의 관계를 이해하는 하나의 도구일 뿐입니다. ";
  baseMessage += "결국 가장 중요한 것은 서로를 향한 마음과 노력입니다. ";
  baseMessage += "이 분석이 두 분의 관계를 더 깊이 이해하고, 더 행복한 미래를 만들어가는 데 도움이 되길 바랍니다. ";
  baseMessage += "두 분의 앞날에 늘 사랑과 행복이 가득하기를 진심으로 바랍니다. 💕";

  return baseMessage;
}

/**
 * 제16장: 종합 조언
 */
export function analyzeCouple16(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter16Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const coreStrengths = analyzeCoreStrengths(person1, person2, person1Name, person2Name);
  const coreWeaknesses = analyzeCoreWeaknesses(person1, person2, person1Name, person2Name);
  const mustDoList = generateMustDoList(ilgan1, ilgan2, person1Name, person2Name);
  const mustAvoidList = generateMustAvoidList(ilgan1, ilgan2);
  const dailyHabits = generateDailyHabits();
  const communicationRules = generateCommunicationRules(ilgan1, ilgan2);
  const finalMessage = generateFinalMessage(person1, person2, person1Name, person2Name);

  return {
    coreStrengths,
    coreWeaknesses,
    mustDoList,
    mustAvoidList,
    dailyHabits,
    communicationRules,
    finalMessage,
    narrative: {
      intro: "마지막으로, 지금까지의 모든 분석을 종합하여 실천 가이드를 드립니다.",
      mainAnalysis: `${person1Name}님과 ${person2Name}님만을 위한 맞춤 조언입니다.`,
      details: [
        `핵심 강점 ${coreStrengths.length}개, 주의점 ${coreWeaknesses.length}개를 발견했습니다.`,
        `매일 실천할 수 있는 ${dailyHabits.length}가지 습관을 추천드립니다.`,
      ],
      advice: "가장 중요한 것은 서로를 향한 마음과 꾸준한 노력입니다.",
      closing: "두 분의 행복한 미래를 진심으로 응원합니다! 💕",
    },
  };
}
