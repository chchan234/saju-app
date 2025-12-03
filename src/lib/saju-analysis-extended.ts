/**
 * 사주 심층 분석 확장 데이터
 * - 격국(格局) 분석
 * - 건강 체질 분석
 */

import type { Pillar, OhengCount } from "@/types/saju";

// 한국어 조사 처리 (받침 유무에 따라 이/가 선택)
function getSubjectParticle(word: string): string {
  const lastChar = word.charAt(word.length - 1);
  const code = lastChar.charCodeAt(0) - 0xAC00;
  const hasJongseong = code >= 0 && code <= 11171 && code % 28 !== 0;
  return hasJongseong ? "이" : "가";
}

// ============================================
// 격국(格局) 분석
// ============================================

export interface GeokgukInfo {
  name: string;
  hanja: string;
  sipsinBase: string;  // 기반이 되는 십신
  description: string;
  personality: string;
  strengths: string[];
  suitableCareers: string[];
  challenges: string;
  advice: string;
  famous?: string;  // 유명인 예시
}

// 8정격 데이터
export const GEOKGUK_INFO: Record<string, GeokgukInfo> = {
  정관격: {
    name: "정관격",
    hanja: "正官格",
    sipsinBase: "정관",
    description: "월지(월주의 지지)에서 정관이 투출하여 격을 이룬 경우입니다. 질서와 규율을 중시하며 사회적 명예를 추구합니다.",
    personality: "책임감이 강하고 원칙을 중시합니다. 안정적이고 신뢰할 수 있으며 조직 생활에 적합합니다. 규율과 질서를 따르며 사회적 인정을 중요하게 생각합니다.",
    strengths: ["책임감", "신뢰성", "조직력", "명예욕", "도덕성"],
    suitableCareers: ["공무원", "대기업 임원", "판사/검사", "교수", "정치인", "외교관"],
    challenges: "융통성이 부족하고 형식에 얽매일 수 있습니다. 변화에 적응하기 어려울 수 있습니다.",
    advice: "때로는 유연하게 대처하는 것도 필요합니다. 원칙만 고집하지 말고 상황에 맞게 조절하세요.",
    famous: "이순신, 세종대왕 등 역사적 리더들",
  },
  편관격: {
    name: "편관격",
    hanja: "偏官格",
    sipsinBase: "편관",
    description: "월지에서 편관(칠살)이 투출하여 격을 이룬 경우입니다. 강한 추진력과 권력 지향성을 가집니다.",
    personality: "결단력이 있고 추진력이 강합니다. 권력을 추구하며 도전적인 환경에서 빛을 발합니다. 때로는 독단적일 수 있습니다.",
    strengths: ["결단력", "추진력", "카리스마", "위기대처", "리더십"],
    suitableCareers: ["군인", "경찰", "스포츠 선수", "기업 CEO", "외과의사", "구조대원"],
    challenges: "공격적이 되기 쉽고 주변과 마찰이 생길 수 있습니다. 스트레스 관리가 필요합니다.",
    advice: "강함을 지혜롭게 사용하세요. 힘으로 밀어붙이기보다 때로는 부드럽게 접근하세요.",
    famous: "이성계, 나폴레옹 등 군사적 영웅들",
  },
  정인격: {
    name: "정인격",
    hanja: "正印格",
    sipsinBase: "정인",
    description: "월지에서 정인이 투출하여 격을 이룬 경우입니다. 학문과 교육에 재능이 있으며 보호 본능이 강합니다.",
    personality: "학구적이고 인자합니다. 배우고 가르치는 것을 좋아하며 타인을 돌보는 성향이 있습니다. 지식을 쌓고 나누는 것에서 보람을 느낍니다.",
    strengths: ["학문적 능력", "인자함", "교육 재능", "보호 본능", "지혜"],
    suitableCareers: ["교사/교수", "연구원", "작가", "상담사", "의료인", "종교인"],
    challenges: "실천력이 부족하고 생각만 많을 수 있습니다. 의존적이 될 수 있습니다.",
    advice: "배운 것을 실천으로 옮기세요. 생각만 하지 말고 행동으로 보여주세요.",
    famous: "공자, 아인슈타인 등 위대한 학자들",
  },
  편인격: {
    name: "편인격",
    hanja: "偏印格",
    sipsinBase: "편인",
    description: "월지에서 편인이 투출하여 격을 이룬 경우입니다. 독창적인 사고와 특수한 재능을 가집니다.",
    personality: "독창적이고 직관력이 뛰어납니다. 일반적이지 않은 분야에서 재능을 발휘합니다. 신비롭고 영적인 것에 관심이 많습니다.",
    strengths: ["직관력", "창의력", "특수 기술", "영성", "집중력"],
    suitableCareers: ["예술가", "철학자", "IT 전문가", "대체의학", "점술가", "발명가"],
    challenges: "현실 감각이 부족하고 고독해질 수 있습니다. 불규칙한 생활 패턴이 문제가 될 수 있습니다.",
    advice: "현실과 균형을 맞추세요. 독특함을 유지하되 사회와 단절되지 마세요.",
    famous: "다빈치, 테슬라 등 창의적 천재들",
  },
  정재격: {
    name: "정재격",
    hanja: "正財格",
    sipsinBase: "정재",
    description: "월지에서 정재가 투출하여 격을 이룬 경우입니다. 안정적인 재물 관리와 성실함이 특징입니다.",
    personality: "성실하고 검소합니다. 꾸준히 재산을 모으며 안정을 추구합니다. 계획적이고 실용적인 사고를 합니다.",
    strengths: ["성실함", "저축 능력", "계획성", "실용성", "책임감"],
    suitableCareers: ["회계사", "은행원", "재무 관리자", "부동산", "공무원", "자영업"],
    challenges: "융통성이 부족하고 인색해 보일 수 있습니다. 새로운 기회를 놓칠 수 있습니다.",
    advice: "때로는 과감한 투자도 필요합니다. 너무 움켜쥐지 말고 흐름에 맡기세요.",
    famous: "워런 버핏 등 안정적 투자자들",
  },
  편재격: {
    name: "편재격",
    hanja: "偏財格",
    sipsinBase: "편재",
    description: "월지에서 편재가 투출하여 격을 이룬 경우입니다. 사업 수완과 큰 재물을 다루는 능력이 있습니다.",
    personality: "통이 크고 사교적입니다. 큰돈을 벌고 쓰는 것에 거리낌이 없습니다. 사람을 다루는 능력이 뛰어납니다.",
    strengths: ["사업 수완", "사교성", "대범함", "융통성", "인맥"],
    suitableCareers: ["사업가", "무역상", "투자자", "영업", "연예 매니저", "정치인"],
    challenges: "낭비가 심하고 안정성이 부족할 수 있습니다. 한탕주의에 빠질 위험이 있습니다.",
    advice: "큰돈을 벌더라도 안정적인 기반을 유지하세요. 과도한 투기는 피하세요.",
    famous: "정주영, 이병철 등 대기업 창업주들",
  },
  식신격: {
    name: "식신격",
    hanja: "食神格",
    sipsinBase: "식신",
    description: "월지에서 식신이 투출하여 격을 이룬 경우입니다. 먹는 복과 표현력이 뛰어나며 여유로운 삶을 추구합니다.",
    personality: "낙천적이고 여유롭습니다. 먹는 것을 즐기고 표현력이 좋습니다. 주변을 편안하게 해주는 힘이 있습니다.",
    strengths: ["낙천성", "표현력", "요리 재능", "친화력", "여유"],
    suitableCareers: ["요리사", "엔터테이너", "작가", "강사", "서비스업", "푸드 관련"],
    challenges: "게으름에 빠지기 쉽고 결단력이 부족할 수 있습니다. 안일함에 머물 수 있습니다.",
    advice: "여유를 즐기되 목표를 향해 꾸준히 나아가세요. 재능을 낭비하지 마세요.",
    famous: "백종원 등 요식업 거장들",
  },
  상관격: {
    name: "상관격",
    hanja: "傷官格",
    sipsinBase: "상관",
    description: "월지에서 상관이 투출하여 격을 이룬 경우입니다. 창의력과 언변이 뛰어나며 기존 질서에 도전합니다.",
    personality: "창의적이고 독창적입니다. 말재주가 좋고 비판 정신이 강합니다. 틀에 박힌 것을 싫어하며 새로운 것을 추구합니다.",
    strengths: ["창의력", "언변", "예술성", "분석력", "혁신"],
    suitableCareers: ["변호사", "작가", "방송인", "예술가", "컨설턴트", "혁신 기업가"],
    challenges: "권위와 충돌하기 쉽고 인간관계에서 마찰이 생길 수 있습니다.",
    advice: "비판 에너지를 창작으로 승화시키세요. 건설적인 방향으로 재능을 사용하세요.",
    famous: "스티브 잡스 등 혁신적 창업가들",
  },
};

// 격국 판정 함수
export function determineGeokguk(monthPillar: Pillar, dayPillar: Pillar): {
  geokguk: string | null;
  confidence: "높음" | "보통" | "낮음";
  explanation: string;
} {
  // 월주 지지의 본기 확인
  const monthJiji = monthPillar.jiji;
  const monthJijiSipsin = monthPillar.jijiSipsin;

  // 월간(월주 천간)의 십신
  const monthCheonganSipsin = monthPillar.cheonganSipsin;

  // 격국 판정 로직
  // 1. 월지 본기가 월간에 투출했는지 확인
  // 2. 투출하지 않았다면 월지 본기로 격 판정

  let geokguk: string | null = null;
  let confidence: "높음" | "보통" | "낮음" = "보통";
  let explanation = "";

  // 월간의 십신이 격의 기반이 되는 경우 (투출)
  if (monthCheonganSipsin && GEOKGUK_INFO[monthCheonganSipsin + "격"]) {
    geokguk = monthCheonganSipsin + "격";
    confidence = "높음";
    explanation = `월간에 ${monthCheonganSipsin}${getSubjectParticle(monthCheonganSipsin)} 있어 ${geokguk}을 이룹니다.`;
  }
  // 월지 본기로 격 판정
  else if (monthJijiSipsin && GEOKGUK_INFO[monthJijiSipsin + "격"]) {
    geokguk = monthJijiSipsin + "격";
    confidence = "보통";
    explanation = `월지의 ${monthJijiSipsin} 기운으로 ${geokguk}을 이룹니다.`;
  }

  // 격국이 없는 경우
  if (!geokguk) {
    explanation = "명확한 정격(正格)이 드러나지 않습니다. 복합적인 기운을 가지고 있습니다.";
    confidence = "낮음";
  }

  return { geokguk, confidence, explanation };
}

// ============================================
// 건강 체질 분석
// ============================================

export interface OhengHealthInfo {
  oheng: string;
  hanja: string;
  organs: {
    main: string[];
    related: string[];
  };
  bodyParts: string[];
  emotions: string;
  excessSymptoms: string[];
  deficiencySymptoms: string[];
  recommendations: {
    foods: string[];
    activities: string[];
    avoids: string[];
  };
  season: string;
  taste: string;
}

// 오행별 건강 정보
export const OHENG_HEALTH_INFO: Record<string, OhengHealthInfo> = {
  목: {
    oheng: "목",
    hanja: "木",
    organs: {
      main: ["간", "담"],
      related: ["신경계", "근육"],
    },
    bodyParts: ["눈", "손톱", "힘줄", "근육", "사지"],
    emotions: "분노, 스트레스",
    excessSymptoms: [
      "두통이 잦음",
      "눈이 충혈됨",
      "근육 경련",
      "분노 조절 어려움",
      "고혈압",
    ],
    deficiencySymptoms: [
      "시력 저하",
      "손톱이 약함",
      "근력 약화",
      "우울감",
      "피로감",
    ],
    recommendations: {
      foods: ["신맛 음식", "녹색 채소", "시금치", "브로콜리", "신 과일"],
      activities: ["숲 산책", "스트레칭", "요가", "눈 운동"],
      avoids: ["과음", "늦은 취침", "과도한 스트레스"],
    },
    season: "봄",
    taste: "신맛(酸)",
  },
  화: {
    oheng: "화",
    hanja: "火",
    organs: {
      main: ["심장", "소장"],
      related: ["혈관", "순환계"],
    },
    bodyParts: ["혀", "얼굴", "혈액", "맥박"],
    emotions: "기쁨, 흥분",
    excessSymptoms: [
      "불면증",
      "가슴 두근거림",
      "얼굴 붉어짐",
      "조증/흥분",
      "열이 많음",
    ],
    deficiencySymptoms: [
      "손발이 참",
      "저혈압",
      "우울/무기력",
      "순환 장애",
      "말 어눌함",
    ],
    recommendations: {
      foods: ["쓴맛 음식", "붉은 음식", "토마토", "수박", "살구"],
      activities: ["유산소 운동", "명상", "심호흡", "반신욕"],
      avoids: ["과도한 흥분", "자극적 음식", "과로"],
    },
    season: "여름",
    taste: "쓴맛(苦)",
  },
  토: {
    oheng: "토",
    hanja: "土",
    organs: {
      main: ["비장", "위"],
      related: ["소화기", "림프"],
    },
    bodyParts: ["입술", "입", "살", "복부"],
    emotions: "걱정, 사려",
    excessSymptoms: [
      "비만 경향",
      "소화 불량",
      "입 냄새",
      "과도한 걱정",
      "당뇨 주의",
    ],
    deficiencySymptoms: [
      "식욕 저하",
      "소화 장애",
      "근육 약화",
      "무력감",
      "빈혈",
    ],
    recommendations: {
      foods: ["단맛 음식(과일)", "노란 음식", "고구마", "호박", "현미"],
      activities: ["규칙적 식사", "복부 마사지", "가벼운 산책"],
      avoids: ["폭식", "과도한 설탕", "불규칙한 식사"],
    },
    season: "환절기",
    taste: "단맛(甘)",
  },
  금: {
    oheng: "금",
    hanja: "金",
    organs: {
      main: ["폐", "대장"],
      related: ["호흡기", "피부"],
    },
    bodyParts: ["코", "피부", "털", "성대"],
    emotions: "슬픔, 우울",
    excessSymptoms: [
      "피부 건조",
      "변비",
      "호흡기 과민",
      "완벽주의",
      "결벽증",
    ],
    deficiencySymptoms: [
      "잦은 감기",
      "피부 트러블",
      "변비/설사",
      "기력 저하",
      "호흡 곤란",
    ],
    recommendations: {
      foods: ["매운맛 음식(적당히)", "흰 음식", "도라지", "배", "무"],
      activities: ["깊은 호흡", "유산소", "피부 관리", "숲 산책"],
      avoids: ["건조한 환경", "흡연", "미세먼지"],
    },
    season: "가을",
    taste: "매운맛(辛)",
  },
  수: {
    oheng: "수",
    hanja: "水",
    organs: {
      main: ["신장", "방광"],
      related: ["비뇨기", "생식기"],
    },
    bodyParts: ["귀", "뼈", "머리카락", "치아"],
    emotions: "두려움, 공포",
    excessSymptoms: [
      "부종",
      "야간 빈뇨",
      "과도한 두려움",
      "냉증",
      "피로 축적",
    ],
    deficiencySymptoms: [
      "허리 통증",
      "귀 울림",
      "탈모",
      "골다공증 주의",
      "정력 감퇴",
    ],
    recommendations: {
      foods: ["짠맛 음식(적당히)", "검은 음식", "검은콩", "해조류", "견과류"],
      activities: ["충분한 수면", "족욕", "하체 운동", "명상"],
      avoids: ["과도한 성생활", "야근", "추위 노출"],
    },
    season: "겨울",
    taste: "짠맛(鹹)",
  },
};

// 건강 체질 분석 함수
export function analyzeHealthConstitution(ohengCount: OhengCount): {
  strongOheng: string[];
  weakOheng: string[];
  missingOheng: string[];
  primaryConcern: OhengHealthInfo | null;
  secondaryConcern: OhengHealthInfo | null;
  overallAdvice: string;
  vulnerableOrgans: string[];
  recommendations: {
    foods: string[];
    activities: string[];
    avoids: string[];
  };
} {
  const entries = Object.entries(ohengCount) as [string, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const maxCount = sorted[0][1];
  const minCount = sorted[sorted.length - 1][1];

  // 강한/약한/없는 오행 분류
  const strongOheng = sorted.filter(([_, c]) => c === maxCount && c > 0).map(([o]) => o);
  const weakOheng = sorted.filter(([_, c]) => c === minCount && c > 0 && c < maxCount).map(([o]) => o);
  const missingOheng = sorted.filter(([_, c]) => c === 0).map(([o]) => o);

  // 주요 관심 오행 (없거나 가장 약한 오행)
  const concernOheng = missingOheng.length > 0 ? missingOheng[0] : (weakOheng.length > 0 ? weakOheng[0] : null);
  const primaryConcern = concernOheng ? OHENG_HEALTH_INFO[concernOheng] : null;

  // 과다 오행 (가장 강한 오행)
  const excessOheng = strongOheng[0];
  const secondaryConcern = excessOheng ? OHENG_HEALTH_INFO[excessOheng] : null;

  // 취약 장기 파악
  const vulnerableOrgans: string[] = [];
  if (primaryConcern) {
    vulnerableOrgans.push(...primaryConcern.organs.main);
  }
  if (secondaryConcern && maxCount >= 3) {
    vulnerableOrgans.push(...secondaryConcern.organs.main.map(o => o + "(과다 주의)"));
  }

  // 추천 사항 종합
  const recommendations = {
    foods: [] as string[],
    activities: [] as string[],
    avoids: [] as string[],
  };

  if (primaryConcern) {
    recommendations.foods.push(...primaryConcern.recommendations.foods.slice(0, 3));
    recommendations.activities.push(...primaryConcern.recommendations.activities.slice(0, 2));
    recommendations.avoids.push(...primaryConcern.recommendations.avoids.slice(0, 2));
  }

  // 종합 조언
  let overallAdvice = "";
  if (missingOheng.length > 0) {
    overallAdvice = `${missingOheng.join(", ")} 오행이 없어 해당 장기(${missingOheng.map(o => OHENG_HEALTH_INFO[o].organs.main.join(",")).join(", ")})가 취약할 수 있습니다. `;
  }
  if (maxCount >= 3) {
    overallAdvice += `${strongOheng.join(", ")} 오행이 과다하여 ${secondaryConcern?.emotions || ""} 관련 증상에 주의하세요. `;
  }
  if (!overallAdvice) {
    overallAdvice = "오행이 비교적 균형 잡혀 있어 전반적인 건강 관리에 유리합니다.";
  }

  return {
    strongOheng,
    weakOheng,
    missingOheng,
    primaryConcern,
    secondaryConcern,
    overallAdvice,
    vulnerableOrgans,
    recommendations,
  };
}
