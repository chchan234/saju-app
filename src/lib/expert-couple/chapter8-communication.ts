/**
 * 제8장: 소통 방식
 * 일간 기반 의사소통 스타일 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter8Result } from "@/types/expert-couple";

// 일간별 소통 스타일
const ILGAN_COMMUNICATION: Record<string, {
  communicationType: string;
  expressionStyle: string;
  listeningStyle: string;
  conflictStyle: string;
}> = {
  갑: {
    communicationType: "직선적 소통형",
    expressionStyle: "솔직하고 직접적으로 의견을 표현합니다. 에둘러 말하는 것을 어려워해요.",
    listeningStyle: "결론을 빨리 듣고 싶어합니다. 긴 설명보다 핵심을 원해요.",
    conflictStyle: "정면 돌파형입니다. 문제가 있으면 바로 말하고 해결하려 합니다.",
  },
  을: {
    communicationType: "조율형 소통형",
    expressionStyle: "상황과 상대에 맞춰 부드럽게 표현합니다. 분위기를 살피며 말해요.",
    listeningStyle: "공감하며 들어줍니다. 상대방의 감정에 민감하게 반응해요.",
    conflictStyle: "우회적으로 접근합니다. 직접 충돌보다 시간을 두고 해결하려 해요.",
  },
  병: {
    communicationType: "열정적 소통형",
    expressionStyle: "감정을 풍부하게 표현합니다. 이야기할 때 열정이 넘쳐요.",
    listeningStyle: "열심히 반응하며 들어줍니다. 맞장구를 잘 쳐요.",
    conflictStyle: "감정적으로 반응할 수 있어요. 화가 나면 바로 표현합니다.",
  },
  정: {
    communicationType: "세심한 소통형",
    expressionStyle: "따뜻하고 배려있게 표현합니다. 상대방 기분을 많이 생각해요.",
    listeningStyle: "감정적으로 깊이 공감합니다. 상대방의 마음을 잘 읽어요.",
    conflictStyle: "내면에서 많이 고민합니다. 겉으로 표현하지 않아도 속으로 상처받을 수 있어요.",
  },
  무: {
    communicationType: "안정적 소통형",
    expressionStyle: "차분하고 일관되게 표현합니다. 급하게 말하지 않아요.",
    listeningStyle: "침착하게 끝까지 들어줍니다. 성급하게 판단하지 않아요.",
    conflictStyle: "느긋하게 대응합니다. 급하게 해결하려 하지 않고 시간을 둡니다.",
  },
  기: {
    communicationType: "신중한 소통형",
    expressionStyle: "생각을 정리한 후 말합니다. 신중하게 단어를 선택해요.",
    listeningStyle: "조용히 생각하며 들어줍니다. 분석적으로 이해하려 해요.",
    conflictStyle: "내면에서 고민하는 시간이 필요해요. 바로 반응하지 않습니다.",
  },
  경: {
    communicationType: "명확한 소통형",
    expressionStyle: "분명하고 정확하게 표현합니다. 애매한 것을 싫어해요.",
    listeningStyle: "논리적으로 이해하려 합니다. 팩트 위주로 들어요.",
    conflictStyle: "원칙을 중시합니다. 옳고 그름을 따지려 할 수 있어요.",
  },
  신: {
    communicationType: "섬세한 소통형",
    expressionStyle: "정교하고 세련되게 표현합니다. 말의 뉘앙스를 중시해요.",
    listeningStyle: "디테일을 잘 캐치합니다. 말 사이의 의미를 읽어요.",
    conflictStyle: "날카롭게 지적할 수 있어요. 실수를 그냥 넘어가지 못합니다.",
  },
  임: {
    communicationType: "포용적 소통형",
    expressionStyle: "넓은 시야로 이야기합니다. 큰 그림을 보며 말해요.",
    listeningStyle: "다양한 관점을 수용합니다. 열린 마음으로 들어요.",
    conflictStyle: "흘려보내려 합니다. 크게 문제삼지 않으려 해요.",
  },
  계: {
    communicationType: "감성적 소통형",
    expressionStyle: "섬세한 감정을 잘 표현합니다. 분위기를 중시해요.",
    listeningStyle: "직관적으로 상대를 이해합니다. 말하지 않아도 알아채요.",
    conflictStyle: "피하려 할 수 있어요. 갈등 상황 자체를 불편해합니다.",
  },
};

// 소통 궁합 분석
function analyzeCommunicationCompatibility(ilgan1: string, ilgan2: string): {
  score: number;
  analysis: string;
} {
  const style1 = ILGAN_COMMUNICATION[ilgan1];
  const style2 = ILGAN_COMMUNICATION[ilgan2];

  if (!style1 || !style2) {
    return {
      score: 70,
      analysis: "기본적인 소통은 가능하나, 서로의 스타일을 이해하는 노력이 필요합니다.",
    };
  }

  // 소통 유형 궁합 매트릭스 (간소화)
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    직선적: { 직선적: 80, 조율형: 70, 열정적: 85, 세심한: 65, 안정적: 75, 신중한: 70, 명확한: 90, 섬세한: 65, 포용적: 80, 감성적: 60 },
    조율형: { 직선적: 70, 조율형: 85, 열정적: 75, 세심한: 90, 안정적: 85, 신중한: 80, 명확한: 65, 섬세한: 85, 포용적: 90, 감성적: 85 },
    열정적: { 직선적: 85, 조율형: 75, 열정적: 80, 세심한: 70, 안정적: 65, 신중한: 60, 명확한: 70, 섬세한: 65, 포용적: 85, 감성적: 75 },
    세심한: { 직선적: 65, 조율형: 90, 열정적: 70, 세심한: 85, 안정적: 85, 신중한: 90, 명확한: 65, 섬세한: 85, 포용적: 80, 감성적: 95 },
    안정적: { 직선적: 75, 조율형: 85, 열정적: 65, 세심한: 85, 안정적: 90, 신중한: 85, 명확한: 80, 섬세한: 75, 포용적: 85, 감성적: 80 },
    신중한: { 직선적: 70, 조율형: 80, 열정적: 60, 세심한: 90, 안정적: 85, 신중한: 85, 명확한: 80, 섬세한: 85, 포용적: 80, 감성적: 85 },
    명확한: { 직선적: 90, 조율형: 65, 열정적: 70, 세심한: 65, 안정적: 80, 신중한: 80, 명확한: 85, 섬세한: 80, 포용적: 70, 감성적: 60 },
    섬세한: { 직선적: 65, 조율형: 85, 열정적: 65, 세심한: 85, 안정적: 75, 신중한: 85, 명확한: 80, 섬세한: 80, 포용적: 75, 감성적: 85 },
    포용적: { 직선적: 80, 조율형: 90, 열정적: 85, 세심한: 80, 안정적: 85, 신중한: 80, 명확한: 70, 섬세한: 75, 포용적: 85, 감성적: 85 },
    감성적: { 직선적: 60, 조율형: 85, 열정적: 75, 세심한: 95, 안정적: 80, 신중한: 85, 명확한: 60, 섬세한: 85, 포용적: 85, 감성적: 90 },
  };

  const type1 = style1.communicationType.replace(" 소통형", "");
  const type2 = style2.communicationType.replace(" 소통형", "");

  const score = compatibilityMatrix[type1]?.[type2] || 75;

  let analysis = "";
  if (score >= 90) {
    analysis = "소통 방식이 매우 잘 맞습니다. 서로의 말을 자연스럽게 이해하고 공감합니다.";
  } else if (score >= 80) {
    analysis = "소통 궁합이 좋은 편입니다. 약간의 스타일 차이는 있지만 대화가 잘 통합니다.";
  } else if (score >= 70) {
    analysis = "소통에 약간의 노력이 필요합니다. 서로의 표현 방식을 이해하려는 자세가 중요해요.";
  } else {
    analysis = "소통 스타일에 차이가 있습니다. 서로의 방식을 존중하고 맞춰가는 연습이 필요합니다.";
  }

  return { score, analysis };
}

// 오해 포인트 분석
function analyzeMisunderstandingPoints(ilgan1: string, ilgan2: string): string[] {
  const points: string[] = [];

  const style1 = ILGAN_COMMUNICATION[ilgan1];
  const style2 = ILGAN_COMMUNICATION[ilgan2];

  if (!style1 || !style2) return points;

  // 직선적 vs 우회적
  if ((ilgan1 === "갑" || ilgan1 === "경") && (ilgan2 === "을" || ilgan2 === "계")) {
    points.push("직접적인 표현이 너무 날카롭게 느껴질 수 있어요. 반대로 돌려 말하면 답답해할 수 있습니다.");
  }

  // 열정적 vs 신중한
  if ((ilgan1 === "병") && (ilgan2 === "기" || ilgan2 === "신")) {
    points.push("열정적인 반응이 가벼워 보일 수 있고, 신중한 태도가 무관심해 보일 수 있어요.");
  }

  // 명확한 vs 감성적
  if ((ilgan1 === "경" || ilgan1 === "신") && (ilgan2 === "정" || ilgan2 === "계")) {
    points.push("논리적인 접근이 차갑게 느껴질 수 있고, 감정적 표현이 비논리적으로 보일 수 있어요.");
  }

  // 포용적 vs 명확한
  if ((ilgan1 === "임" && ilgan2 === "경") || (ilgan1 === "경" && ilgan2 === "임")) {
    points.push("유연한 태도가 우유부단해 보일 수 있고, 원칙적인 태도가 융통성 없어 보일 수 있어요.");
  }

  // 일반적인 오해 포인트
  if (points.length === 0) {
    points.push("대화 속도나 반응 타이밍의 차이로 오해가 생길 수 있어요.");
    points.push("말하지 않아도 알아주길 바라거나, 다 말해야 알아듣는 스타일 차이가 있을 수 있어요.");
  }

  return points;
}

// 소통 팁 생성
function generateCommunicationTips(ilgan1: string, ilgan2: string, person1Name: string, person2Name: string): string[] {
  const tips: string[] = [];
  const style1 = ILGAN_COMMUNICATION[ilgan1];
  const style2 = ILGAN_COMMUNICATION[ilgan2];

  if (!style1 || !style2) {
    return ["서로의 이야기를 끝까지 들어주세요.", "감정이 격해질 때는 잠시 쉬어가세요."];
  }

  // 직선적 타입에게
  if (ilgan1 === "갑" || ilgan1 === "경") {
    tips.push(`${person1Name}님은 직접적으로 말할 때 한 템포 쉬어가세요. ${person2Name}님이 준비될 시간이 필요해요.`);
  }

  // 세심한/감성적 타입에게
  if (ilgan2 === "정" || ilgan2 === "계") {
    tips.push(`${person2Name}님은 속마음을 말로 표현해주세요. ${person1Name}님이 마음을 읽는 건 어려워요.`);
  }

  // 열정적 타입에게
  if (ilgan1 === "병" || ilgan2 === "병") {
    tips.push("감정이 격해질 때는 5분만 쉬고 이야기해보세요. 후회할 말을 줄일 수 있어요.");
  }

  // 안정적/신중한 타입에게
  if (ilgan1 === "무" || ilgan1 === "기" || ilgan2 === "무" || ilgan2 === "기") {
    tips.push("중요한 이야기는 충분한 시간을 두고 하세요. 급하게 결론 내지 마세요.");
  }

  // 일반 팁
  tips.push("'나는~'으로 시작하는 문장으로 감정을 표현하면 상대방이 덜 방어적이 됩니다.");
  tips.push("상대방이 말할 때 중간에 끊지 않고 끝까지 들어주세요.");

  return tips.slice(0, 5);
}

/**
 * 제8장: 소통 방식 분석
 */
export function analyzeCouple8(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter8Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const style1 = ILGAN_COMMUNICATION[ilgan1] || {
    communicationType: "일반형",
    expressionStyle: "상황에 따라 다양하게 표현합니다.",
    listeningStyle: "상황에 따라 다양하게 반응합니다.",
    conflictStyle: "상황에 따라 대처합니다.",
  };

  const style2 = ILGAN_COMMUNICATION[ilgan2] || {
    communicationType: "일반형",
    expressionStyle: "상황에 따라 다양하게 표현합니다.",
    listeningStyle: "상황에 따라 다양하게 반응합니다.",
    conflictStyle: "상황에 따라 대처합니다.",
  };

  const compatibility = analyzeCommunicationCompatibility(ilgan1, ilgan2);
  const misunderstandingPoints = analyzeMisunderstandingPoints(ilgan1, ilgan2);
  const communicationTips = generateCommunicationTips(ilgan1, ilgan2, person1Name, person2Name);

  return {
    person1Style: style1,
    person2Style: style2,
    compatibility,
    misunderstandingPoints,
    communicationTips,
    narrative: {
      intro: "이번 장에서는 두 분의 소통 방식과 대화 스타일을 분석합니다.",
      mainAnalysis: `${person1Name}님은 ${style1.communicationType}이고, ${person2Name}님은 ${style2.communicationType}입니다.`,
      details: [
        `${person1Name}님의 표현 스타일: ${style1.expressionStyle}`,
        `${person2Name}님의 표현 스타일: ${style2.expressionStyle}`,
        `소통 궁합 점수: ${compatibility.score}점`,
      ],
      advice: compatibility.analysis,
      closing: "다음 장에서는 갈등 패턴과 화해 방법을 살펴보겠습니다.",
    },
  };
}
