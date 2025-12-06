/**
 * 제18장: 학업/자격증 운
 * 학생/취준생용 (isApplicable로 판별)
 */

import type { SajuApiResult, FiveElement, Gender, OccupationStatus } from "@/types/saju";
import type { Chapter18Result } from "@/types/expert";

// ============================================
// 타입 정의
// ============================================

type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";

// ============================================
// 기본 분석 함수
// ============================================

function getDayMasterElement(sajuResult: SajuApiResult): FiveElement {
  const stemElementMap: Record<HeavenlyStemKr, FiveElement> = {
    갑: "wood", 을: "wood",
    병: "fire", 정: "fire",
    무: "earth", 기: "earth",
    경: "metal", 신: "metal",
    임: "water", 계: "water"
  };

  const dayStem = sajuResult.dayPillar.cheongan as HeavenlyStemKr;
  return stemElementMap[dayStem] || "earth";
}

// 십신 분석
function analyzeSipsin(sajuResult: SajuApiResult): {
  dominant: string;
  inseongStrength: number;
  siksangStrength: number;
} {
  const sipsinCount: Record<string, number> = {
    비견: 0, 겁재: 0, 식신: 0, 상관: 0, 편재: 0,
    정재: 0, 편관: 0, 정관: 0, 편인: 0, 정인: 0
  };

  const dayStem = sajuResult.dayPillar.cheongan as string;
  const pillars = [
    sajuResult.yearPillar,
    sajuResult.monthPillar,
    sajuResult.dayPillar,
    sajuResult.timePillar
  ];

  const sipsinMap: Record<string, Record<string, string>> = {
    갑: { 갑: "비견", 을: "겁재", 병: "식신", 정: "상관", 무: "편재", 기: "정재", 경: "편관", 신: "정관", 임: "편인", 계: "정인" },
    을: { 을: "비견", 갑: "겁재", 정: "식신", 병: "상관", 기: "편재", 무: "정재", 신: "편관", 경: "정관", 계: "편인", 임: "정인" },
    병: { 병: "비견", 정: "겁재", 무: "식신", 기: "상관", 경: "편재", 신: "정재", 임: "편관", 계: "정관", 갑: "편인", 을: "정인" },
    정: { 정: "비견", 병: "겁재", 기: "식신", 무: "상관", 신: "편재", 경: "정재", 계: "편관", 임: "정관", 을: "편인", 갑: "정인" },
    무: { 무: "비견", 기: "겁재", 경: "식신", 신: "상관", 임: "편재", 계: "정재", 갑: "편관", 을: "정관", 병: "편인", 정: "정인" },
    기: { 기: "비견", 무: "겁재", 신: "식신", 경: "상관", 계: "편재", 임: "정재", 을: "편관", 갑: "정관", 정: "편인", 병: "정인" },
    경: { 경: "비견", 신: "겁재", 임: "식신", 계: "상관", 갑: "편재", 을: "정재", 병: "편관", 정: "정관", 무: "편인", 기: "정인" },
    신: { 신: "비견", 경: "겁재", 계: "식신", 임: "상관", 을: "편재", 갑: "정재", 정: "편관", 병: "정관", 기: "편인", 무: "정인" },
    임: { 임: "비견", 계: "겁재", 갑: "식신", 을: "상관", 병: "편재", 정: "정재", 무: "편관", 기: "정관", 경: "편인", 신: "정인" },
    계: { 계: "비견", 임: "겁재", 을: "식신", 갑: "상관", 정: "편재", 병: "정재", 기: "편관", 무: "정관", 신: "편인", 경: "정인" }
  };

  pillars.forEach(pillar => {
    if (!pillar) return;
    const stem = pillar.cheongan as string;
    const sipsin = sipsinMap[dayStem]?.[stem];
    if (sipsin && sipsinCount[sipsin] !== undefined) {
      sipsinCount[sipsin]++;
    }
  });

  const sorted = Object.entries(sipsinCount)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  // 인성(학업): 편인 + 정인
  const inseongStrength = sipsinCount["편인"] + sipsinCount["정인"];
  // 식상(표현/창작): 식신 + 상관
  const siksangStrength = sipsinCount["식신"] + sipsinCount["상관"];

  return {
    dominant: sorted[0]?.[0] || "정인",
    inseongStrength,
    siksangStrength
  };
}

// ============================================
// 학습 스타일 분석
// ============================================

interface LearningStyle {
  type: string;
  strengths: string[];
  weaknesses: string[];
  studyEnvironment: string;
  studyMethods: string[];
}

function analyzeLearningStyle(
  dayMasterElement: FiveElement,
  sipsinAnalysis: { dominant: string; inseongStrength: number; siksangStrength: number },
  sinGangSinYak: string
): LearningStyle {
  // 오행별 학습 스타일
  const elementLearningStyles: Record<FiveElement, {
    type: string;
    strengths: string[];
    weaknesses: string[];
    environment: string;
    methods: string[];
  }> = {
    wood: {
      type: "성장형 학습자",
      strengths: ["목표 지향적", "체계적 계획 수립", "자기주도 학습"],
      weaknesses: ["완벽주의로 스트레스", "융통성 부족", "과도한 경쟁심"],
      environment: "조용하고 질서 있는 환경, 자연광이 드는 공간",
      methods: ["마인드맵", "목표 설정 학습", "스터디 그룹", "계획표 활용"]
    },
    fire: {
      type: "열정형 학습자",
      strengths: ["높은 집중력", "빠른 이해력", "프레젠테이션 능력"],
      weaknesses: ["지속력 부족", "충동적 학습", "지루함을 못 참음"],
      environment: "활기차고 자극적인 환경, 함께 공부하는 분위기",
      methods: ["토론식 학습", "게임화 학습", "짧은 집중 시간 활용", "발표 연습"]
    },
    earth: {
      type: "안정형 학습자",
      strengths: ["꾸준한 노력", "기초 탄탄", "암기력 우수"],
      weaknesses: ["변화 적응 어려움", "창의성 부족", "속도 느림"],
      environment: "익숙하고 편안한 환경, 집이나 단골 카페",
      methods: ["반복 학습", "요약 노트", "규칙적인 학습 루틴", "기출 문제 풀이"]
    },
    metal: {
      type: "분석형 학습자",
      strengths: ["논리적 사고", "비판적 분석", "정확성 추구"],
      weaknesses: ["과도한 분석", "감성적 과목 어려움", "완벽주의"],
      environment: "깔끔하게 정리된 공간, 체계적인 자료 정돈",
      methods: ["논리적 구조화", "비교 분석표", "시험 전략 수립", "오답 노트"]
    },
    water: {
      type: "직관형 학습자",
      strengths: ["창의적 사고", "통찰력", "유연한 적응"],
      weaknesses: ["집중력 분산", "체계성 부족", "기분에 따른 학습"],
      environment: "조용하고 영감을 주는 공간, 물 소리나 음악",
      methods: ["연상 학습", "스토리텔링", "자유로운 탐구", "이미지화"]
    }
  };

  const baseStyle = elementLearningStyles[dayMasterElement];

  // 십신에 따른 조정
  let additionalStrength = "";
  let additionalWeakness = "";

  if (sipsinAnalysis.inseongStrength >= 2) {
    additionalStrength = "학문에 대한 타고난 재능";
  } else if (sipsinAnalysis.inseongStrength === 0) {
    additionalWeakness = "장시간 학습에 어려움";
  }

  if (sipsinAnalysis.siksangStrength >= 2) {
    additionalStrength = additionalStrength || "창의적 표현 능력";
  }

  // 신강/신약 조정
  if (sinGangSinYak === "신강") {
    baseStyle.strengths.push("자신감 있는 학습 태도");
    baseStyle.weaknesses.push("타인의 조언을 무시할 수 있음");
  } else if (sinGangSinYak === "신약") {
    baseStyle.strengths.push("협력 학습에 강함");
    baseStyle.weaknesses.push("자신감 부족으로 포기하기 쉬움");
  }

  if (additionalStrength) baseStyle.strengths.push(additionalStrength);
  if (additionalWeakness) baseStyle.weaknesses.push(additionalWeakness);

  return {
    type: baseStyle.type,
    strengths: baseStyle.strengths.slice(0, 4),
    weaknesses: baseStyle.weaknesses.slice(0, 3),
    studyEnvironment: baseStyle.environment,
    studyMethods: baseStyle.methods
  };
}

// ============================================
// 시험운 분석
// ============================================

interface ExamFortune {
  currentYear: { score: number; analysis: string };
  bestMonths: number[];
  avoidMonths: number[];
}

function analyzeExamFortune(
  dayMasterElement: FiveElement,
  sipsinAnalysis: { dominant: string; inseongStrength: number; siksangStrength: number },
  currentYear: number
): ExamFortune {
  // 기본 점수 (인성 강도에 따라)
  let score = 50 + (sipsinAnalysis.inseongStrength * 15);

  // 오행별 조정
  const elementBonus: Record<FiveElement, number> = {
    wood: 5,  // 목은 성장, 학습에 유리
    fire: 0,  // 화는 집중력 좋지만 지속력 약함
    earth: 10, // 토는 안정적인 학습
    metal: 10, // 금은 분석력, 시험에 강함
    water: 5  // 수는 직관적 이해
  };
  score += elementBonus[dayMasterElement];

  score = Math.min(100, Math.max(0, score));

  let analysis = "";
  if (score >= 80) {
    analysis = "시험운이 매우 좋습니다. 자신감을 갖고 도전하세요. 충분히 좋은 결과를 얻을 수 있습니다.";
  } else if (score >= 60) {
    analysis = "시험운이 양호합니다. 꾸준한 노력으로 원하는 결과를 얻을 수 있습니다.";
  } else if (score >= 40) {
    analysis = "시험운이 보통입니다. 평소보다 더 많은 노력이 필요합니다. 전략적으로 준비하세요.";
  } else {
    analysis = "시험운이 약한 편입니다. 장기적인 계획으로 준비하고, 멘탈 관리에 신경 쓰세요.";
  }

  // 길한 달 (간략화된 로직)
  // 인성이 들어오는 달이 길
  const bestMonths = [1, 4, 7, 10]; // 계절의 시작 (간략화)
  const avoidMonths = [6, 12]; // 휴식이 필요한 시기

  return {
    currentYear: { score, analysis },
    bestMonths,
    avoidMonths
  };
}

// ============================================
// 적합 분야 분석
// ============================================

interface SuitableFields {
  academic: string[];
  certifications: string[];
  skills: string[];
}

function analyzeSuitableFields(
  dayMasterElement: FiveElement,
  sipsinAnalysis: { dominant: string; inseongStrength: number; siksangStrength: number }
): SuitableFields {
  // 오행별 학문 분야
  const elementAcademics: Record<FiveElement, string[]> = {
    wood: ["교육학", "의학", "생명과학", "환경학", "체육"],
    fire: ["예술", "엔터테인먼트", "광고홍보", "심리학", "정치학"],
    earth: ["경영학", "경제학", "부동산학", "농학", "건축"],
    metal: ["법학", "공학", "컴퓨터공학", "금융", "회계"],
    water: ["철학", "문학", "심리학", "해양학", "외국어"]
  };

  // 오행별 자격증
  const elementCertifications: Record<FiveElement, string[]> = {
    wood: ["교원자격증", "간호사", "운동지도사", "사회복지사"],
    fire: ["공인중개사", "마케팅자격증", "미용사", "요리사"],
    earth: ["공인회계사", "세무사", "감정평가사", "주택관리사"],
    metal: ["변호사", "변리사", "정보처리기사", "기술사"],
    water: ["심리상담사", "번역가", "관광통역안내사", "조주기능사"]
  };

  // 오행별 스킬
  const elementSkills: Record<FiveElement, string[]> = {
    wood: ["리더십", "기획력", "교육 스킬", "프레젠테이션"],
    fire: ["커뮤니케이션", "마케팅", "디자인", "퍼포먼스"],
    earth: ["재무관리", "프로젝트관리", "데이터분석", "협상"],
    metal: ["프로그래밍", "분석력", "문서작성", "논리적사고"],
    water: ["외국어", "창의력", "공감능력", "적응력"]
  };

  // 십신에 따른 추가
  const sipsinSkills: Record<string, string[]> = {
    정인: ["학습능력", "교육"],
    편인: ["연구", "기술"],
    식신: ["요리", "예술"],
    상관: ["창작", "혁신"],
    정관: ["관리", "리더십"],
    편관: ["도전", "모험"],
    정재: ["재무", "안정"],
    편재: ["투자", "사업"]
  };

  const skills = [
    ...elementSkills[dayMasterElement].slice(0, 3),
    ...(sipsinSkills[sipsinAnalysis.dominant]?.slice(0, 1) || [])
  ];

  return {
    academic: elementAcademics[dayMasterElement],
    certifications: elementCertifications[dayMasterElement],
    skills: [...new Set(skills)]
  };
}

// ============================================
// 학업 조언
// ============================================

function generateStudyAdvice(
  learningStyle: LearningStyle,
  examFortune: ExamFortune,
  dayMasterElement: FiveElement
): string {
  const baseAdvice: Record<FiveElement, string> = {
    wood: "목표를 명확히 세우고 단계별로 성장해가세요. 경쟁보다는 어제의 나와 비교하며 발전하세요.",
    fire: "관심 있는 주제로 시작해서 점점 범위를 넓히세요. 열정을 유지하되 꾸준함도 기르세요.",
    earth: "기초를 탄탄히 다지고 꾸준히 반복하세요. 급하게 하지 말고 자신의 속도를 지키세요.",
    metal: "논리적으로 구조화하고 체계적으로 학습하세요. 완벽을 추구하되 과도한 스트레스는 피하세요.",
    water: "호기심을 따라가며 다양하게 탐구하세요. 때로는 흐름에 맡기되, 마무리는 확실히 하세요."
  };

  let advice = baseAdvice[dayMasterElement] + " ";

  if (examFortune.currentYear.score >= 70) {
    advice += `올해는 시험운이 좋으니 목표를 높게 잡아도 좋습니다. ${examFortune.bestMonths.join(", ")}월이 특히 좋습니다.`;
  } else if (examFortune.currentYear.score >= 50) {
    advice += `올해는 꾸준한 노력이 결과로 이어집니다. ${examFortune.avoidMonths.join(", ")}월에는 충분한 휴식도 필요합니다.`;
  } else {
    advice += "올해는 장기적인 계획으로 기초를 다지는 해로 삼으세요. 결과보다 과정에 집중하세요.";
  }

  return advice;
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter18(
  sajuResult: SajuApiResult,
  _gender: Gender,
  occupationStatus: OccupationStatus,
  currentYear: number,
  sinGangSinYak: string
): Chapter18Result {
  // 적용 대상 판별 (학생 또는 취준생)
  const isApplicable = occupationStatus === "student" || occupationStatus === "jobseeker";

  // 기본 분석
  const dayMasterElement = getDayMasterElement(sajuResult);
  const sipsinAnalysis = analyzeSipsin(sajuResult);

  // 학습 스타일
  const learningStyle = analyzeLearningStyle(dayMasterElement, sipsinAnalysis, sinGangSinYak);

  // 시험운
  const examFortune = analyzeExamFortune(dayMasterElement, sipsinAnalysis, currentYear);

  // 적합 분야
  const suitableFields = analyzeSuitableFields(dayMasterElement, sipsinAnalysis);

  // 학업 조언
  const studyAdvice = generateStudyAdvice(learningStyle, examFortune, dayMasterElement);

  return {
    isApplicable,
    learningStyle,
    examFortune,
    suitableFields,
    studyAdvice
  };
}
