/**
 * 사주 고급 분석 데이터
 * - 조후(調候) 분석
 * - 신살(神殺) 분석
 * - 인간관계 패턴 분석
 * - 직업 적성 심화
 */

import type { Pillar, OhengCount } from "@/types/saju";

// ============================================
// 조후(調候) 분석 - 계절에 따른 오행 조절
// ============================================

export interface JohuAnalysis {
  birthSeason: string;
  seasonElement: string;
  seasonDescription: string;
  neededElement: string;
  neededReason: string;
  balance: "균형" | "과다" | "부족";
  advice: string;
  recommendedActivities: string[];
}

// 월지 → 계절 매핑
const JIJI_TO_SEASON: Record<string, { season: string; element: string; description: string }> = {
  인: { season: "초봄", element: "목", description: "만물이 깨어나는 시작의 계절" },
  묘: { season: "한봄", element: "목", description: "생명력이 가장 왕성한 봄" },
  진: { season: "늦봄", element: "토", description: "봄과 여름 사이 환절기" },
  사: { season: "초여름", element: "화", description: "더위가 시작되는 시기" },
  오: { season: "한여름", element: "화", description: "열기가 가장 강한 여름" },
  미: { season: "늦여름", element: "토", description: "여름과 가을 사이 환절기" },
  신: { season: "초가을", element: "금", description: "서늘함이 시작되는 시기" },
  유: { season: "한가을", element: "금", description: "결실의 계절 가을" },
  술: { season: "늦가을", element: "토", description: "가을과 겨울 사이 환절기" },
  해: { season: "초겨울", element: "수", description: "추위가 시작되는 시기" },
  자: { season: "한겨울", element: "수", description: "가장 추운 겨울" },
  축: { season: "늦겨울", element: "토", description: "겨울과 봄 사이 환절기" },
};

// 계절별 필요 오행
const SEASON_NEEDED_ELEMENT: Record<string, { needed: string; reason: string }> = {
  목: { needed: "금", reason: "봄의 왕성한 목기(木氣)를 적절히 제어해야 합니다" },
  화: { needed: "수", reason: "여름의 뜨거운 화기(火氣)를 식혀야 합니다" },
  금: { needed: "화", reason: "가을의 차가운 금기(金氣)를 따뜻하게 해야 합니다" },
  수: { needed: "화", reason: "겨울의 차가운 수기(水氣)를 따뜻하게 해야 합니다" },
  토: { needed: "목", reason: "환절기의 토기(土氣)에 생기를 불어넣어야 합니다" },
};

export function analyzeJohu(
  monthJiji: string,
  ohengCount: OhengCount,
  yongsin: string
): JohuAnalysis {
  const seasonInfo = JIJI_TO_SEASON[monthJiji] || { season: "알 수 없음", element: "토", description: "" };
  const neededInfo = SEASON_NEEDED_ELEMENT[seasonInfo.element] || { needed: "목", reason: "" };

  // 계절 오행과 사주 오행 비교
  const seasonElementCount = ohengCount[seasonInfo.element as keyof OhengCount] || 0;
  const neededElementCount = ohengCount[neededInfo.needed as keyof OhengCount] || 0;

  let balance: "균형" | "과다" | "부족";
  let advice: string;
  const recommendedActivities: string[] = [];

  if (seasonElementCount >= 3 && neededElementCount === 0) {
    balance = "과다";
    advice = `${seasonInfo.season}에 태어나 ${seasonInfo.element} 기운이 과다합니다. ${neededInfo.needed} 기운을 보충하면 균형을 찾을 수 있습니다.`;
  } else if (neededElementCount >= 2) {
    balance = "균형";
    advice = `${seasonInfo.season}에 태어났지만 ${neededInfo.needed} 기운이 충분해 계절의 기운이 잘 조절됩니다.`;
  } else {
    balance = "부족";
    advice = `${seasonInfo.season}에 태어나 ${neededInfo.needed} 기운 보충이 도움이 됩니다.`;
  }

  // 추천 활동
  switch (neededInfo.needed) {
    case "목":
      recommendedActivities.push("숲 산책", "식물 가꾸기", "등산", "새벽 활동");
      break;
    case "화":
      recommendedActivities.push("햇볕 쬐기", "운동", "사우나", "따뜻한 음식");
      break;
    case "토":
      recommendedActivities.push("명상", "규칙적 생활", "텃밭 가꾸기", "도자기");
      break;
    case "금":
      recommendedActivities.push("정리정돈", "악기 연주", "결단 연습", "단식");
      break;
    case "수":
      recommendedActivities.push("수영", "충분한 수면", "독서", "조용한 환경");
      break;
  }

  return {
    birthSeason: seasonInfo.season,
    seasonElement: seasonInfo.element,
    seasonDescription: seasonInfo.description,
    neededElement: neededInfo.needed,
    neededReason: neededInfo.reason,
    balance,
    advice,
    recommendedActivities,
  };
}

// ============================================
// 신살(神殺) 분석
// ============================================

export interface SinsalInfo {
  name: string;
  hanja: string;
  emoji: string;
  type: "길신" | "흉신" | "중성";
  description: string;
  meaning: string;
  inLife: string;
  advice: string;
}

// 신살 정보
export const SINSAL_INFO: Record<string, SinsalInfo> = {
  도화살: {
    name: "도화살",
    hanja: "桃花殺",
    emoji: "🌸",
    type: "중성",
    description: "복숭아꽃처럼 매력적인 기운을 가진 살",
    meaning: "이성에게 매력적으로 보이며 예술적 감각이 뛰어납니다. 인기가 많고 사교성이 좋습니다.",
    inLife: "연예, 예술, 서비스업에서 빛을 발합니다. 이성 관계가 복잡해질 수 있으니 주의가 필요합니다.",
    advice: "매력을 긍정적인 방향으로 활용하세요. 예술이나 대인관계 분야에서 재능을 발휘할 수 있습니다.",
  },
  역마살: {
    name: "역마살",
    hanja: "驛馬殺",
    emoji: "🐎",
    type: "중성",
    description: "말처럼 이동과 변화가 많은 살",
    meaning: "한 곳에 정착하기 어렵고 변화와 이동이 많습니다. 해외운이 있으며 새로운 것을 추구합니다.",
    inLife: "무역, 여행, 운송, 해외 관련 업무에 적합합니다. 이사나 직장 이동이 잦을 수 있습니다.",
    advice: "변화를 두려워하지 말고 적극 활용하세요. 해외 진출이나 이동이 많은 직업이 잘 맞습니다.",
  },
  문창귀인: {
    name: "문창귀인",
    hanja: "文昌貴人",
    emoji: "📚",
    type: "길신",
    description: "학문과 문서의 귀인",
    meaning: "학업운이 좋고 시험, 자격증, 문서 관련 일이 잘 풀립니다. 지적 능력이 뛰어납니다.",
    inLife: "교육, 연구, 출판, 법률 분야에서 성공할 수 있습니다. 공부를 통해 성장합니다.",
    advice: "평생 학습을 이어가세요. 자격증이나 학위 취득이 인생에 도움이 됩니다.",
  },
  천을귀인: {
    name: "천을귀인",
    hanja: "天乙貴人",
    emoji: "⭐",
    type: "길신",
    description: "하늘이 내린 귀인의 도움",
    meaning: "위기 상황에서 귀인의 도움을 받습니다. 어려울 때 누군가 나타나 도와줍니다.",
    inLife: "큰 위기에서도 반드시 도움을 받습니다. 인복이 좋아 좋은 사람을 만납니다.",
    advice: "평소에 덕을 쌓고 인연을 소중히 하세요. 받은 도움을 다른 이에게 베풀면 더 큰 복이 옵니다.",
  },
  화개살: {
    name: "화개살",
    hanja: "華蓋殺",
    emoji: "🔮",
    type: "중성",
    description: "화려한 덮개, 종교성과 신비성",
    meaning: "영적인 감각이 뛰어나고 종교, 철학에 관심이 많습니다. 예술적 재능도 있습니다.",
    inLife: "종교인, 철학자, 예술가로 성공할 수 있습니다. 때로는 외로움을 느낄 수 있습니다.",
    advice: "영적 탐구를 긍정적으로 발전시키세요. 예술이나 종교 활동이 마음의 평화를 줍니다.",
  },
  백호대살: {
    name: "백호대살",
    hanja: "白虎大殺",
    emoji: "🐯",
    type: "흉신",
    description: "흰 호랑이의 살, 사고와 수술",
    meaning: "사고, 수술, 관재수에 주의가 필요합니다. 강한 에너지로 급격한 변화가 올 수 있습니다.",
    inLife: "외과의사, 군인, 운동선수 등 칼과 관련된 직업에서는 오히려 길하게 작용합니다.",
    advice: "위험한 활동은 피하고 안전에 주의하세요. 정기 건강검진을 받는 것이 좋습니다.",
  },
  양인살: {
    name: "양인살",
    hanja: "羊刃殺",
    emoji: "🗡️",
    type: "흉신",
    description: "양의 날카로운 칼, 강한 기운",
    meaning: "성격이 급하고 과감합니다. 승부욕이 강하며 때로는 충동적일 수 있습니다.",
    inLife: "군인, 경찰, 외과의사, 스포츠 선수에게 유리합니다. 일반인에게는 다툼에 주의해야 합니다.",
    advice: "충동을 자제하고 인내심을 기르세요. 강한 에너지를 운동으로 발산하면 좋습니다.",
  },
  귀문관살: {
    name: "귀문관살",
    hanja: "鬼門關殺",
    emoji: "👻",
    type: "흉신",
    description: "귀신 문의 관문",
    meaning: "영적으로 민감하며 신비한 체험을 할 수 있습니다. 정신적 스트레스에 취약할 수 있습니다.",
    inLife: "무속인, 종교인, 심리상담사로 활동하면 오히려 길하게 작용합니다.",
    advice: "정신 건강에 신경 쓰고 규칙적인 생활을 하세요. 종교나 명상이 도움이 됩니다.",
  },
};

// 신살 판정 로직
// 도화살: 일지 기준 - 자오묘유(인오술일주), 사해인신(신자진일주) 등
const DOHUA_MAP: Record<string, string[]> = {
  인: ["묘"], 오: ["묘"], 술: ["묘"],
  신: ["유"], 자: ["유"], 진: ["유"],
  사: ["오"], 유: ["오"], 축: ["오"],
  해: ["자"], 묘: ["자"], 미: ["자"],
};

// 역마살: 일지 기준
const YEOKMA_MAP: Record<string, string[]> = {
  인: ["신"], 오: ["신"], 술: ["신"],
  신: ["인"], 자: ["인"], 진: ["인"],
  사: ["해"], 유: ["해"], 축: ["해"],
  해: ["사"], 묘: ["사"], 미: ["사"],
};

// 화개살: 일지 기준
const HWAGAE_MAP: Record<string, string[]> = {
  인: ["술"], 오: ["술"], 술: ["술"],
  신: ["진"], 자: ["진"], 진: ["진"],
  사: ["축"], 유: ["축"], 축: ["축"],
  해: ["미"], 묘: ["미"], 미: ["미"],
};

// 천을귀인: 일간 기준
const CHEONUL_MAP: Record<string, string[]> = {
  갑: ["축", "미"], 무: ["축", "미"],
  을: ["자", "신"], 기: ["자", "신"],
  병: ["해", "유"], 정: ["해", "유"],
  경: ["축", "미"], 임: ["묘", "사"],
  신: ["인", "오"], 계: ["묘", "사"],
};

// 문창귀인: 일간 기준
const MUNCHANG_MAP: Record<string, string[]> = {
  갑: ["사"], 을: ["오"],
  병: ["신"], 정: ["유"],
  무: ["신"], 기: ["유"],
  경: ["해"], 신: ["자"],
  임: ["인"], 계: ["묘"],
};

export interface DetectedSinsal {
  name: string;
  info: SinsalInfo;
  foundIn: string; // "년지", "월지", "일지", "시지" 등
}

export function detectSinsals(
  pillars: Pillar[],
  dayCheongan: string,
  dayJiji: string
): DetectedSinsal[] {
  const detected: DetectedSinsal[] = [];
  const pillarNames = ["년지", "월지", "일지", "시지"];

  // 모든 지지 수집
  const allJiji = pillars.map((p) => p.jiji);

  // 도화살 검사
  const dohuaTargets = DOHUA_MAP[dayJiji] || [];
  allJiji.forEach((jiji, idx) => {
    if (dohuaTargets.includes(jiji)) {
      detected.push({
        name: "도화살",
        info: SINSAL_INFO["도화살"],
        foundIn: pillarNames[idx],
      });
    }
  });

  // 역마살 검사
  const yeokmaTargets = YEOKMA_MAP[dayJiji] || [];
  allJiji.forEach((jiji, idx) => {
    if (yeokmaTargets.includes(jiji)) {
      detected.push({
        name: "역마살",
        info: SINSAL_INFO["역마살"],
        foundIn: pillarNames[idx],
      });
    }
  });

  // 화개살 검사
  const hwagaeTargets = HWAGAE_MAP[dayJiji] || [];
  allJiji.forEach((jiji, idx) => {
    if (hwagaeTargets.includes(jiji)) {
      detected.push({
        name: "화개살",
        info: SINSAL_INFO["화개살"],
        foundIn: pillarNames[idx],
      });
    }
  });

  // 천을귀인 검사 (일간 기준)
  const cheonulTargets = CHEONUL_MAP[dayCheongan] || [];
  allJiji.forEach((jiji, idx) => {
    if (cheonulTargets.includes(jiji)) {
      detected.push({
        name: "천을귀인",
        info: SINSAL_INFO["천을귀인"],
        foundIn: pillarNames[idx],
      });
    }
  });

  // 문창귀인 검사 (일간 기준)
  const munchangTargets = MUNCHANG_MAP[dayCheongan] || [];
  allJiji.forEach((jiji, idx) => {
    if (munchangTargets.includes(jiji)) {
      detected.push({
        name: "문창귀인",
        info: SINSAL_INFO["문창귀인"],
        foundIn: pillarNames[idx],
      });
    }
  });

  // 중복 제거 (같은 신살이 여러 곳에 있으면 하나만)
  const uniqueDetected = detected.reduce((acc, curr) => {
    const exists = acc.find((d) => d.name === curr.name);
    if (!exists) {
      acc.push(curr);
    } else {
      // 위치 추가
      exists.foundIn += `, ${curr.foundIn}`;
    }
    return acc;
  }, [] as DetectedSinsal[]);

  return uniqueDetected;
}

// ============================================
// 인간관계 패턴 분석
// ============================================

export interface RelationshipPattern {
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  compatibleTypes: string[];
  advice: string;
}

export const RELATIONSHIP_PATTERNS: Record<string, RelationshipPattern> = {
  비겁형: {
    type: "독립형",
    description: "독립적이고 자기 주장이 강합니다. 대등한 관계를 원하며 지배받는 것을 싫어합니다.",
    strengths: ["독립심", "자신감", "솔직함", "리더십"],
    weaknesses: ["타협 어려움", "고집", "경쟁심 과다"],
    compatibleTypes: ["재성형", "식상형"],
    advice: "상대의 의견도 존중하고 때로는 양보하는 것이 관계를 오래 유지하는 비결입니다.",
  },
  식상형: {
    type: "표현형",
    description: "표현력이 좋고 사교적입니다. 대화를 통해 관계를 발전시키며 주변을 즐겁게 합니다.",
    strengths: ["소통능력", "친화력", "유머감각", "창의성"],
    weaknesses: ["말실수", "비판적", "일관성 부족"],
    compatibleTypes: ["인성형", "비겁형"],
    advice: "말하기 전에 한 번 더 생각하세요. 듣는 것도 소통의 중요한 부분입니다.",
  },
  재성형: {
    type: "실리형",
    description: "실리적이고 현실적입니다. 물질적 안정을 중시하며 계획적으로 관계를 맺습니다.",
    strengths: ["책임감", "성실함", "계획성", "안정추구"],
    weaknesses: ["계산적", "감정표현 부족", "융통성 부족"],
    compatibleTypes: ["관성형", "비겁형"],
    advice: "때로는 손해를 보더라도 진심을 나누세요. 물질보다 마음이 더 중요할 때가 있습니다.",
  },
  관성형: {
    type: "책임형",
    description: "책임감이 강하고 신뢰할 수 있습니다. 질서를 중시하며 약속을 잘 지킵니다.",
    strengths: ["신뢰성", "책임감", "도덕성", "안정감"],
    weaknesses: ["경직됨", "통제욕", "융통성 부족"],
    compatibleTypes: ["인성형", "재성형"],
    advice: "상대를 통제하려 하지 말고 자율성을 존중하세요. 유연한 태도가 관계를 부드럽게 합니다.",
  },
  인성형: {
    type: "보호형",
    description: "배려심이 깊고 보호 본능이 강합니다. 학구적이며 지적인 대화를 좋아합니다.",
    strengths: ["배려심", "지혜", "인내심", "헌신"],
    weaknesses: ["의존적", "우유부단", "과보호"],
    compatibleTypes: ["식상형", "관성형"],
    advice: "상대에게 너무 많이 해주려 하지 마세요. 스스로 설 수 있게 지켜봐 주는 것도 사랑입니다.",
  },
};

export function analyzeRelationshipPattern(
  sipsinDistribution: Record<string, number>
): RelationshipPattern | null {
  // 가장 강한 카테고리 찾기
  const categories = ["비겁", "식상", "재성", "관성", "인성"];
  let maxCategory = "";
  let maxCount = 0;

  for (const cat of categories) {
    const count = sipsinDistribution[cat] || 0;
    if (count > maxCount) {
      maxCount = count;
      maxCategory = cat;
    }
  }

  if (maxCategory && maxCount > 0) {
    return RELATIONSHIP_PATTERNS[maxCategory + "형"] || null;
  }

  return null;
}

// ============================================
// 직업 적성 심화 분석
// ============================================

export interface CareerAptitude {
  category: string;
  description: string;
  suitableCareers: string[];
  workStyle: string;
  successTip: string;
}

export const CAREER_APTITUDES: Record<string, CareerAptitude> = {
  "관성+인성": {
    category: "학구/공직형",
    description: "학문적 소양과 책임감을 겸비하여 공직이나 교육 분야에서 빛을 발합니다.",
    suitableCareers: ["공무원", "교사/교수", "연구원", "판사/검사", "의사", "회계사"],
    workStyle: "체계적이고 꾸준합니다. 규칙을 잘 따르며 안정적인 환경에서 능력을 발휘합니다.",
    successTip: "자격증이나 학위 취득에 투자하세요. 전문성을 쌓으면 인정받습니다.",
  },
  "식상+재성": {
    category: "사업/자영업형",
    description: "창의력과 사업 수완을 갖춰 자영업이나 프리랜서로 성공할 수 있습니다.",
    suitableCareers: ["자영업", "프리랜서", "요식업", "유통/판매", "콘텐츠 크리에이터", "디자이너"],
    workStyle: "자유롭고 창의적입니다. 자신만의 방식으로 일하는 것을 선호합니다.",
    successTip: "아이디어를 현실로 만드는 실행력을 기르세요. 재무 관리도 중요합니다.",
  },
  "관성+재성": {
    category: "경영/관리형",
    description: "조직 관리 능력과 재무 감각이 있어 기업 경영이나 관리직에 적합합니다.",
    suitableCareers: ["기업 임원", "재무 관리자", "은행원", "투자 전문가", "경영 컨설턴트"],
    workStyle: "계획적이고 목표 지향적입니다. 조직을 이끄는 능력이 있습니다.",
    successTip: "리더십과 재무 지식을 함께 갖추세요. MBA 등 경영 공부가 도움됩니다.",
  },
  "비겁+식상": {
    category: "창작/예술형",
    description: "독립적인 창작 활동에서 재능을 발휘합니다. 예술가나 작가에 적합합니다.",
    suitableCareers: ["예술가", "작가", "뮤지션", "배우", "크리에이터", "1인 기업가"],
    workStyle: "자기만의 스타일을 추구합니다. 독창적이고 틀에 박힌 것을 싫어합니다.",
    successTip: "꾸준히 작품 활동을 하세요. 자신만의 개성을 무기로 삼으세요.",
  },
  "인성+식상": {
    category: "기술/전문가형",
    description: "학습 능력과 표현력이 있어 기술 전문가나 교육자로 성공합니다.",
    suitableCareers: ["IT 전문가", "엔지니어", "강사", "코치", "컨설턴트", "번역가"],
    workStyle: "지식을 습득하고 전달하는 것을 좋아합니다. 전문 분야에서 인정받습니다.",
    successTip: "한 분야의 전문가가 되세요. 지식을 나누면 더 큰 기회가 옵니다.",
  },
  "비겁+관성": {
    category: "리더/행정형",
    description: "독립심과 책임감을 갖춰 조직의 리더나 행정가로 성장합니다.",
    suitableCareers: ["임원", "정치인", "군인", "경찰", "행정가", "스포츠 감독"],
    workStyle: "앞장서서 이끄는 것을 좋아합니다. 결단력과 추진력이 있습니다.",
    successTip: "부하를 존중하고 소통하세요. 독단적이면 반발을 살 수 있습니다.",
  },
  "재성+인성": {
    category: "전문직/안정형",
    description: "실리와 학문을 겸비하여 전문 자격을 활용한 안정적 직업에 적합합니다.",
    suitableCareers: ["변호사", "회계사", "세무사", "감정평가사", "약사", "건축사"],
    workStyle: "전문 지식을 바탕으로 실질적인 서비스를 제공합니다.",
    successTip: "자격증을 취득하고 실무 경험을 쌓으세요. 신뢰가 곧 자산입니다.",
  },
};

export function analyzeCareerAptitude(
  sipsinDistribution: Record<string, number>
): CareerAptitude | null {
  // 상위 2개 카테고리 조합으로 직업 적성 판단
  const categories = ["비겁", "식상", "재성", "관성", "인성"];
  const sorted = categories
    .map((cat) => ({ cat, count: sipsinDistribution[cat] || 0 }))
    .sort((a, b) => b.count - a.count);

  if (sorted[0].count === 0) return null;

  // 상위 2개 조합
  const top2 = sorted.slice(0, 2).map((s) => s.cat);

  // 조합 키 생성 (정렬해서 일관성 유지)
  const combinations = [
    top2.join("+"),
    top2.reverse().join("+"),
  ];

  for (const combo of combinations) {
    if (CAREER_APTITUDES[combo]) {
      return CAREER_APTITUDES[combo];
    }
  }

  // 매칭되는 조합이 없으면 가장 강한 카테고리 기반으로
  const singleMappings: Record<string, string> = {
    관성: "관성+인성",
    인성: "인성+식상",
    재성: "재성+인성",
    식상: "식상+재성",
    비겁: "비겁+식상",
  };

  return CAREER_APTITUDES[singleMappings[sorted[0].cat]] || null;
}
