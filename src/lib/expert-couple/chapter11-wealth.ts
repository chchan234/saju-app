/**
 * 제11장: 재물 궁합
 * 일간 기반 재물 스타일 및 금전 궁합 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter11Result } from "@/types/expert-couple";

// 일간별 재물 스타일
const ILGAN_MONEY_STYLE: Record<string, {
  earningPattern: string;
  spendingPattern: string;
  savingAttitude: string;
  investmentStyle: string;
}> = {
  갑: {
    earningPattern: "리더십을 발휘하며 수입을 창출합니다. 주도적으로 기회를 만들어요.",
    spendingPattern: "크게 쓰는 경향이 있어요. 체면이나 품위 유지에 신경 씁니다.",
    savingAttitude: "저축보다는 투자나 성장에 관심이 많아요.",
    investmentStyle: "공격적 투자 성향. 성장 가능성에 베팅합니다.",
  },
  을: {
    earningPattern: "협력과 네트워킹으로 수입을 만듭니다. 꾸준히 기회를 잡아요.",
    spendingPattern: "필요한 곳에만 씁니다. 실용적 소비를 해요.",
    savingAttitude: "착실하게 모으는 편이에요. 안전자산을 선호합니다.",
    investmentStyle: "안정적 투자 성향. 리스크를 피하고 꾸준함을 추구해요.",
  },
  병: {
    earningPattern: "열정과 아이디어로 수입을 창출합니다. 화려한 성과를 내요.",
    spendingPattern: "감정에 따라 충동구매할 수 있어요. 기분이 좋으면 씀씀이가 커져요.",
    savingAttitude: "모으는 것보다 쓰는 것을 좋아해요. 현재를 즐깁니다.",
    investmentStyle: "모험적 투자 성향. 대박을 꿈꾸는 스타일이에요.",
  },
  정: {
    earningPattern: "꼼꼼하게 관리하며 수입을 유지합니다. 안정적 수입을 선호해요.",
    spendingPattern: "사랑하는 사람을 위해서는 아끼지 않아요. 감정적 소비를 해요.",
    savingAttitude: "미래를 위해 저축하려 노력해요. 불안하면 더 모으려 해요.",
    investmentStyle: "보수적 투자 성향. 원금 보장을 중시해요.",
  },
  무: {
    earningPattern: "믿음직하게 꾸준히 벌어요. 안정적인 수입원을 만듭니다.",
    spendingPattern: "큰 변화 없이 일정하게 써요. 계획적 소비를 합니다.",
    savingAttitude: "저축을 중요시해요. 든든한 기반을 만들려 합니다.",
    investmentStyle: "안정지향 투자. 부동산이나 예금을 선호해요.",
  },
  기: {
    earningPattern: "실속 있게 수입을 관리해요. 작은 기회도 놓치지 않습니다.",
    spendingPattern: "알뜰하게 써요. 가성비를 중요시합니다.",
    savingAttitude: "차곡차곡 모으는 편이에요. 티끌 모아 태산 스타일이에요.",
    investmentStyle: "신중한 투자. 오래 검토하고 결정해요.",
  },
  경: {
    earningPattern: "능력으로 정당하게 벌어요. 성과에 따른 보상을 중시합니다.",
    spendingPattern: "가치 있다고 판단되면 과감하게 써요. 합리적 소비를 해요.",
    savingAttitude: "목표가 있으면 철저히 저축해요. 계획대로 실행합니다.",
    investmentStyle: "원칙적 투자. 분석 후 결정하고, 정한 원칙을 지켜요.",
  },
  신: {
    earningPattern: "전문성으로 수입을 창출해요. 섬세한 능력이 빛납니다.",
    spendingPattern: "품질 좋은 것에 투자해요. 싸구려는 사지 않아요.",
    savingAttitude: "체계적으로 관리해요. 명확한 목표액이 있어요.",
    investmentStyle: "분석적 투자. 데이터와 트렌드를 연구해요.",
  },
  임: {
    earningPattern: "다양한 경로로 수입을 만들어요. 여러 파이프라인이 있어요.",
    spendingPattern: "자유롭게 써요. 원하는 것에는 아끼지 않아요.",
    savingAttitude: "저축이 어려울 수 있어요. 흐름에 맡기는 편이에요.",
    investmentStyle: "유동적 투자. 트렌드에 민감하게 반응해요.",
  },
  계: {
    earningPattern: "직관으로 기회를 잡아요. 때를 기다릴 줄 알아요.",
    spendingPattern: "감정에 따라 쓸 수 있어요. 분위기에 휩쓸리기도 해요.",
    savingAttitude: "불규칙할 수 있어요. 마음이 편해야 모을 수 있어요.",
    investmentStyle: "감각적 투자. 느낌과 직관을 신뢰해요.",
  },
};

// 재물 궁합 점수 계산
function calculateFinancialCompatibility(ilgan1: string, ilgan2: string): {
  score: number;
  analysis: string;
} {
  const style1 = ILGAN_MONEY_STYLE[ilgan1];
  const style2 = ILGAN_MONEY_STYLE[ilgan2];

  if (!style1 || !style2) {
    return { score: 70, analysis: "재물 관리 방식에 대한 대화가 필요합니다." };
  }

  // 안정형 + 안정형 = 높은 점수
  const stableTypes = ["을", "무", "기", "경"];
  // 공격형 + 공격형 = 변동 가능
  const aggressiveTypes = ["갑", "병", "임"];
  // 감성형
  const emotionalTypes = ["정", "계", "신"];

  let score = 75;
  let analysis = "";

  if (stableTypes.includes(ilgan1) && stableTypes.includes(ilgan2)) {
    score = 90;
    analysis = "재물 관리에 있어 두 분 다 안정을 추구합니다. 함께 꾸준히 재산을 불릴 수 있어요.";
  } else if (aggressiveTypes.includes(ilgan1) && aggressiveTypes.includes(ilgan2)) {
    score = 70;
    analysis = "두 분 다 적극적인 재물 스타일입니다. 리스크 관리에 함께 신경 쓰면 좋겠어요.";
  } else if (stableTypes.includes(ilgan1) && aggressiveTypes.includes(ilgan2)) {
    score = 80;
    analysis = "한 분은 안정을, 한 분은 성장을 추구해요. 역할을 나누면 균형 잡힌 재무 관리가 가능합니다.";
  } else if (emotionalTypes.includes(ilgan1) || emotionalTypes.includes(ilgan2)) {
    score = 75;
    analysis = "감정에 따른 소비 패턴이 있을 수 있어요. 중요한 재정 결정은 함께 상의하세요.";
  } else {
    score = 78;
    analysis = "서로 다른 재물 스타일을 가지고 있어요. 각자의 강점을 살리면 시너지가 날 수 있습니다.";
  }

  return { score, analysis };
}

// 공동 재무 조언 생성
function generateJointFinanceAdvice(ilgan1: string, ilgan2: string): CoupleChapter11Result["jointFinanceAdvice"] {
  const style1 = ILGAN_MONEY_STYLE[ilgan1];
  const style2 = ILGAN_MONEY_STYLE[ilgan2];

  let budgetManagement = "";
  let savingsStrategy = "";
  let investmentApproach = "";
  let conflictPrevention = "";

  // 둘 다 저축형
  if (["을", "무", "기", "경"].includes(ilgan1) && ["을", "무", "기", "경"].includes(ilgan2)) {
    budgetManagement = "공동 가계부를 작성하면 더욱 체계적으로 관리할 수 있어요.";
    savingsStrategy = "공동 저축 목표를 세우고 함께 달성해보세요. 두 분의 강점이에요.";
    investmentApproach = "안정적인 분산투자가 두 분에게 잘 맞아요.";
    conflictPrevention = "너무 아끼다 보면 삶의 즐거움을 놓칠 수 있어요. 가끔은 자신에게 선물하세요.";
  }
  // 둘 다 공격형
  else if (["갑", "병", "임"].includes(ilgan1) && ["갑", "병", "임"].includes(ilgan2)) {
    budgetManagement = "최소한의 고정 저축을 정해두고 나머지로 자유롭게 관리하세요.";
    savingsStrategy = "비상금은 반드시 따로 마련해두세요. 예상치 못한 상황에 대비가 필요해요.";
    investmentApproach = "투자 금액의 한도를 정해두고, 그 안에서 자유롭게 투자하세요.";
    conflictPrevention = "큰 지출은 반드시 상의하는 규칙을 만드세요.";
  }
  // 안정형 + 공격형
  else if ((["을", "무", "기", "경"].includes(ilgan1) && ["갑", "병", "임"].includes(ilgan2)) ||
    (["갑", "병", "임"].includes(ilgan1) && ["을", "무", "기", "경"].includes(ilgan2))) {
    budgetManagement = "필수 지출과 자유 지출을 나눠서 관리하세요. 역할 분담이 핵심이에요.";
    savingsStrategy = "안정적인 저축은 한 분이, 투자는 다른 분이 맡아보세요.";
    investmentApproach = "코어-위성 전략이 좋아요. 안정 자산과 공격 자산을 나눠 투자하세요.";
    conflictPrevention = "서로의 방식을 비판하지 말고, 각자의 역할을 존중하세요.";
  }
  // 감성형 포함
  else {
    budgetManagement = "정기적으로 재정 상황을 함께 점검하는 시간을 가지세요.";
    savingsStrategy = "자동이체로 저축을 설정해두면 편안하게 모을 수 있어요.";
    investmentApproach = "전문가의 도움을 받거나, 검증된 상품 위주로 투자하세요.";
    conflictPrevention = "돈 문제로 감정이 상하지 않도록 정기적인 대화가 중요해요.";
  }

  return {
    budgetManagement,
    savingsStrategy,
    investmentApproach,
    conflictPrevention,
  };
}

// 재물 전망 생성
function generateWealthForecast(ilgan1: string, ilgan2: string): CoupleChapter11Result["wealthForecast"] {
  // 안정형 조합
  if (["을", "무", "기", "경"].includes(ilgan1) && ["을", "무", "기", "경"].includes(ilgan2)) {
    return {
      shortTerm: "안정적인 재정 기반을 마련할 수 있어요. 꾸준함이 강점입니다.",
      midTerm: "착실히 자산을 불려갈 수 있어요. 큰 변동 없이 성장합니다.",
      longTerm: "든든한 노후 자금을 마련할 수 있어요. 계획대로 목표에 도달합니다.",
    };
  }
  // 공격형 조합
  if (["갑", "병", "임"].includes(ilgan1) && ["갑", "병", "임"].includes(ilgan2)) {
    return {
      shortTerm: "변동이 있을 수 있지만 기회도 많아요. 리스크 관리가 중요합니다.",
      midTerm: "큰 성공과 실패가 교차할 수 있어요. 비상금 확보가 필수예요.",
      longTerm: "큰 성과를 거둘 수 있지만, 안정 자산 비중도 늘려가세요.",
    };
  }
  // 혼합형
  return {
    shortTerm: "균형 잡힌 재정 관리가 가능해요. 각자의 강점을 살리세요.",
    midTerm: "안정과 성장 모두를 추구할 수 있어요. 역할 분담이 핵심이에요.",
    longTerm: "함께 노력하면 풍요로운 미래를 만들 수 있어요.",
  };
}

/**
 * 제11장: 재물 궁합 분석
 */
export function analyzeCouple11(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter11Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const style1 = ILGAN_MONEY_STYLE[ilgan1] || {
    earningPattern: "다양한 방법으로 수입을 창출합니다.",
    spendingPattern: "상황에 따라 소비 패턴이 달라집니다.",
    savingAttitude: "저축에 대한 태도가 유연합니다.",
    investmentStyle: "다양한 투자 방식을 고려합니다.",
  };

  const style2 = ILGAN_MONEY_STYLE[ilgan2] || {
    earningPattern: "다양한 방법으로 수입을 창출합니다.",
    spendingPattern: "상황에 따라 소비 패턴이 달라집니다.",
    savingAttitude: "저축에 대한 태도가 유연합니다.",
    investmentStyle: "다양한 투자 방식을 고려합니다.",
  };

  const financialCompatibility = calculateFinancialCompatibility(ilgan1, ilgan2);
  const jointFinanceAdvice = generateJointFinanceAdvice(ilgan1, ilgan2);
  const wealthForecast = generateWealthForecast(ilgan1, ilgan2);

  return {
    person1MoneyStyle: style1,
    person2MoneyStyle: style2,
    financialCompatibility,
    jointFinanceAdvice,
    wealthForecast,
    narrative: {
      intro: "이번 장에서는 두 분의 재물 궁합을 분석합니다.",
      mainAnalysis: `${person1Name}님과 ${person2Name}님의 재물 궁합 점수는 ${financialCompatibility.score}점입니다.`,
      details: [
        `${person1Name}님의 소비 패턴: ${style1.spendingPattern}`,
        `${person2Name}님의 소비 패턴: ${style2.spendingPattern}`,
      ],
      advice: financialCompatibility.analysis,
      closing: "다음 장에서는 자녀 궁합을 살펴보겠습니다.",
    },
  };
}
