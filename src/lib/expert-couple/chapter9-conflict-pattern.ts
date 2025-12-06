/**
 * 제9장: 갈등 패턴과 화해법
 * 일간 기반 갈등 스타일 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter9Result } from "@/types/expert-couple";

// 일간별 갈등 패턴
const ILGAN_CONFLICT_PATTERN: Record<string, {
  triggerPoints: string[];
  reactionStyle: string;
  recoveryTime: string;
}> = {
  갑: {
    triggerPoints: ["무시당했다고 느낄 때", "자존심이 상했을 때", "잘못을 지적받았을 때"],
    reactionStyle: "바로 표현하고 정면으로 맞섭니다. 화가 나면 목소리가 커질 수 있어요.",
    recoveryTime: "화를 분출하면 빨리 풀립니다. 대체로 하루 안에 회복해요.",
  },
  을: {
    triggerPoints: ["배려받지 못했을 때", "강요받았을 때", "선택권이 없다고 느낄 때"],
    reactionStyle: "겉으로는 참고 속으로 삭입니다. 우회적으로 불만을 표현해요.",
    recoveryTime: "겉으로 풀린 것 같아도 속에 남아있을 수 있어요. 시간이 좀 걸립니다.",
  },
  병: {
    triggerPoints: ["기대에 못 미쳤을 때", "열정을 무시당했을 때", "관심을 못 받았을 때"],
    reactionStyle: "감정적으로 폭발합니다. 화를 참지 못하고 바로 표현해요.",
    recoveryTime: "화가 빨리 오르는 만큼 빨리 가라앉아요. 몇 시간이면 괜찮아집니다.",
  },
  정: {
    triggerPoints: ["마음을 몰라줄 때", "진심을 의심받을 때", "소외감을 느낄 때"],
    reactionStyle: "속으로 많이 상처받고 우울해합니다. 겉으로 티를 안 내려 해요.",
    recoveryTime: "마음을 열기까지 시간이 오래 걸려요. 진심 어린 사과가 필요합니다.",
  },
  무: {
    triggerPoints: ["안정을 해치는 변화", "급하게 재촉받을 때", "기다림을 요구받을 때"],
    reactionStyle: "느긋하게 대응하거나 무시하는 것처럼 보일 수 있어요.",
    recoveryTime: "크게 동요하지 않지만, 한번 상하면 오래 갑니다. 신뢰 회복이 필요해요.",
  },
  기: {
    triggerPoints: ["비합리적인 상황", "준비 없이 결정해야 할 때", "생각을 무시당했을 때"],
    reactionStyle: "침묵하거나 거리를 둡니다. 혼자 정리할 시간이 필요해요.",
    recoveryTime: "스스로 정리가 되면 풀립니다. 재촉하면 더 오래 걸려요.",
  },
  경: {
    triggerPoints: ["원칙이 무시될 때", "불공정하다고 느낄 때", "약속이 안 지켜졌을 때"],
    reactionStyle: "냉정하고 날카롭게 지적합니다. 말이 칼처럼 날카로울 수 있어요.",
    recoveryTime: "문제가 해결되면 바로 풀립니다. 해결 없이는 풀리지 않아요.",
  },
  신: {
    triggerPoints: ["완벽하지 않을 때", "결점을 지적받았을 때", "세심함을 몰라줄 때"],
    reactionStyle: "날카롭게 반응하거나 예민해집니다. 작은 것에도 신경이 쓰여요.",
    recoveryTime: "스스로 납득이 되어야 풀립니다. 논리적 설명이 필요해요.",
  },
  임: {
    triggerPoints: ["자유를 제한당했을 때", "고여있다고 느낄 때", "새로움이 없을 때"],
    reactionStyle: "가볍게 넘기려 하거나 흘려버립니다. 정면 대결을 피해요.",
    recoveryTime: "쉽게 풀리는 것 같지만 계속 쌓이면 갑자기 떠나버릴 수 있어요.",
  },
  계: {
    triggerPoints: ["감정을 무시당했을 때", "변화를 강요당했을 때", "불안을 느낄 때"],
    reactionStyle: "물처럼 피해 다닙니다. 갈등 상황 자체를 피하려 해요.",
    recoveryTime: "안전하다고 느껴야 풀립니다. 강압적이면 더 멀어져요.",
  },
};

// 공통 갈등 시나리오 분석
function analyzeCommonConflictScenarios(
  ilgan1: string,
  ilgan2: string,
  person1Name: string,
  person2Name: string
): CoupleChapter9Result["commonConflictScenarios"] {
  const scenarios: CoupleChapter9Result["commonConflictScenarios"] = [];

  // 시나리오 1: 결정을 내려야 할 때
  let person1Reaction = "";
  let person2Reaction = "";

  if (["갑", "병", "경"].includes(ilgan1)) {
    person1Reaction = "빨리 결정하고 싶어합니다.";
  } else if (["을", "기", "계"].includes(ilgan1)) {
    person1Reaction = "천천히 생각하고 싶어합니다.";
  } else {
    person1Reaction = "상황을 보며 결정합니다.";
  }

  if (["갑", "병", "경"].includes(ilgan2)) {
    person2Reaction = "빨리 결정하고 싶어합니다.";
  } else if (["을", "기", "계"].includes(ilgan2)) {
    person2Reaction = "천천히 생각하고 싶어합니다.";
  } else {
    person2Reaction = "상황을 보며 결정합니다.";
  }

  const decisionConflict = (person1Reaction !== person2Reaction);
  scenarios.push({
    scenario: "중요한 결정을 내려야 할 때",
    person1Reaction: `${person1Name}님: ${person1Reaction}`,
    person2Reaction: `${person2Name}님: ${person2Reaction}`,
    escalationRisk: decisionConflict ? "보통" : "낮음",
  });

  // 시나리오 2: 약속을 어겼을 때
  if (["경", "갑"].includes(ilgan1)) {
    person1Reaction = "바로 문제를 지적합니다.";
  } else if (["을", "정", "계"].includes(ilgan1)) {
    person1Reaction = "실망하지만 참으려 합니다.";
  } else {
    person1Reaction = "이유를 먼저 들어봅니다.";
  }

  if (["경", "갑"].includes(ilgan2)) {
    person2Reaction = "바로 문제를 지적합니다.";
  } else if (["을", "정", "계"].includes(ilgan2)) {
    person2Reaction = "실망하지만 참으려 합니다.";
  } else {
    person2Reaction = "이유를 먼저 들어봅니다.";
  }

  scenarios.push({
    scenario: "약속을 어겼거나 실망시켰을 때",
    person1Reaction: `${person1Name}님: ${person1Reaction}`,
    person2Reaction: `${person2Name}님: ${person2Reaction}`,
    escalationRisk: (["경", "갑"].includes(ilgan1) && ["을", "정", "계"].includes(ilgan2)) ||
      (["경", "갑"].includes(ilgan2) && ["을", "정", "계"].includes(ilgan1)) ? "높음" : "보통",
  });

  // 시나리오 3: 의견이 다를 때
  if (["갑", "경", "병"].includes(ilgan1)) {
    person1Reaction = "자신의 의견을 강하게 주장합니다.";
  } else if (["을", "무", "임"].includes(ilgan1)) {
    person1Reaction = "상대 의견을 먼저 듣고 조율합니다.";
  } else {
    person1Reaction = "논리적으로 설득하려 합니다.";
  }

  if (["갑", "경", "병"].includes(ilgan2)) {
    person2Reaction = "자신의 의견을 강하게 주장합니다.";
  } else if (["을", "무", "임"].includes(ilgan2)) {
    person2Reaction = "상대 의견을 먼저 듣고 조율합니다.";
  } else {
    person2Reaction = "논리적으로 설득하려 합니다.";
  }

  const bothStrong = ["갑", "경", "병"].includes(ilgan1) && ["갑", "경", "병"].includes(ilgan2);
  scenarios.push({
    scenario: "의견이 서로 다를 때",
    person1Reaction: `${person1Name}님: ${person1Reaction}`,
    person2Reaction: `${person2Name}님: ${person2Reaction}`,
    escalationRisk: bothStrong ? "높음" : "보통",
  });

  return scenarios;
}

// 화해 전략 생성
function generateReconciliationStrategies(ilgan1: string, ilgan2: string, person1Name: string, person2Name: string): string[] {
  const strategies: string[] = [];

  // 상대방 스타일에 맞춘 화해법
  if (["갑", "경"].includes(ilgan2)) {
    strategies.push(`${person2Name}님에게는 문제의 해결책을 함께 제시하세요. 해결되면 바로 풀려요.`);
  }
  if (["을", "정", "계"].includes(ilgan2)) {
    strategies.push(`${person2Name}님에게는 진심 어린 사과와 충분한 시간을 드리세요. 마음이 열릴 때까지 기다려주세요.`);
  }
  if (["병"].includes(ilgan2)) {
    strategies.push(`${person2Name}님과는 감정이 가라앉을 때까지 잠시 거리를 두세요. 금방 괜찮아져요.`);
  }
  if (["무", "기"].includes(ilgan2)) {
    strategies.push(`${person2Name}님에게는 조용히 옆에 있어주세요. 스스로 정리할 시간이 필요해요.`);
  }
  if (["임"].includes(ilgan2)) {
    strategies.push(`${person2Name}님에게는 가볍게 분위기 전환을 제안해보세요. 새로운 활동이 도움돼요.`);
  }

  // 공통 전략
  strategies.push("'미안해'라는 말보다 '내가 ~해서 네가 ~했구나'라고 공감해주세요.");
  strategies.push("화해 후에는 같은 문제가 반복되지 않도록 대화해주세요.");

  return strategies.slice(0, 5);
}

// 예방 팁 생성
function generatePreventionTips(ilgan1: string, ilgan2: string): string[] {
  const tips: string[] = [];

  tips.push("서로의 '지뢰'를 미리 알아두세요. 그 부분은 조심해서 다뤄주세요.");
  tips.push("스트레스 받은 날은 미리 말해주세요. 서로 더 배려할 수 있어요.");
  tips.push("작은 불만도 쌓이기 전에 가볍게 이야기하세요.");
  tips.push("정기적으로 '요즘 어때?' 하고 체크인하는 시간을 가지세요.");

  // 특정 조합에 대한 팁
  if (["갑", "경", "병"].includes(ilgan1) && ["을", "정", "계"].includes(ilgan2)) {
    tips.push("강한 표현을 할 때는 한 번 더 생각해주세요. 상대방은 더 오래 기억해요.");
  }
  if (["을", "정", "계"].includes(ilgan1) && ["갑", "경", "병"].includes(ilgan2)) {
    tips.push("속마음을 말해주세요. 상대방은 말하지 않으면 모를 수 있어요.");
  }

  return tips.slice(0, 5);
}

/**
 * 제9장: 갈등 패턴과 화해법 분석
 */
export function analyzeCouple9(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter9Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const pattern1 = ILGAN_CONFLICT_PATTERN[ilgan1] || {
    triggerPoints: ["스트레스 상황", "피로할 때", "오해가 있을 때"],
    reactionStyle: "상황에 따라 다양하게 반응합니다.",
    recoveryTime: "상황에 따라 다릅니다.",
  };

  const pattern2 = ILGAN_CONFLICT_PATTERN[ilgan2] || {
    triggerPoints: ["스트레스 상황", "피로할 때", "오해가 있을 때"],
    reactionStyle: "상황에 따라 다양하게 반응합니다.",
    recoveryTime: "상황에 따라 다릅니다.",
  };

  const commonConflictScenarios = analyzeCommonConflictScenarios(ilgan1, ilgan2, person1Name, person2Name);
  const reconciliationStrategies = generateReconciliationStrategies(ilgan1, ilgan2, person1Name, person2Name);
  const preventionTips = generatePreventionTips(ilgan1, ilgan2);

  return {
    person1ConflictPattern: pattern1,
    person2ConflictPattern: pattern2,
    commonConflictScenarios,
    reconciliationStrategies,
    preventionTips,
    narrative: {
      intro: "이번 장에서는 두 분의 갈등 패턴과 화해 방법을 분석합니다.",
      mainAnalysis: `${person1Name}님과 ${person2Name}님은 서로 다른 갈등 스타일을 가지고 있습니다. 이를 이해하면 더 건강하게 갈등을 해결할 수 있어요.`,
      details: [
        `${person1Name}님의 회복 시간: ${pattern1.recoveryTime}`,
        `${person2Name}님의 회복 시간: ${pattern2.recoveryTime}`,
      ],
      advice: "갈등은 관계의 자연스러운 부분입니다. 중요한 것은 어떻게 풀어가느냐입니다.",
      closing: "다음 장에서는 연애/결혼 시기를 살펴보겠습니다.",
    },
  };
}
