/**
 * 전문가 모드 타입 정의
 * 18개 챕터 + 부록 구성
 */

import type {
  Gender,
  RelationshipStatus,
  OccupationStatus,
  AgeGroup,
  ExpertModeConditions,
  FiveElement,
  GanZhi,
  Pillar,
  OhengCount,
} from "./saju";

// ============================================
// 서술형 텍스트 타입 (이야기체 풀이)
// ============================================

// 챕터별 서술형 텍스트 구조
export interface ChapterNarrative {
  intro: string;           // 도입부 (챕터 시작 설명)
  mainAnalysis: string;    // 본론 (핵심 분석 내용)
  details: string[];       // 세부 사항들 (각 항목별 상세 설명)
  advice: string;          // 구체적 조언
  closing: string;         // 마무리 (격려, 요약)
}

// 섹션별 서술형 텍스트 (소제목 단위)
export interface SectionNarrative {
  title: string;           // 소제목
  content: string;         // 본문 (3-5문단)
}

// ============================================
// 공통 기본 타입
// ============================================

// 기둥별 전문가 분석
export interface PillarExpertAnalysis {
  ganZhi: GanZhi;
  stemAnalysis: string;      // 천간 해석
  branchAnalysis: string;    // 지지 해석
  combinedMeaning: string;   // 통합 의미
  lifeStage: string;         // 인생 단계 (0-15세, 15-30세 등)
  symbolism: string;         // 상징적 의미
}

// 오행 상세 분석
export interface ElementDetailedAnalysis {
  element: FiveElement;
  count: number;
  percentage: number;
  strength: "과다" | "적정" | "부족" | "없음";
  personality: string;       // 성격에 미치는 영향
  healthImpact: string;      // 건강에 미치는 영향
  careerHint: string;        // 직업적 성향
}

// 십신 상세 분석
export interface TenGodDetailedAnalysis {
  name: string;              // 십신 이름 (비견, 겁재 등)
  hanja: string;             // 한자 (比肩, 劫財 등)
  count: number;
  positions: string[];       // 위치 (년주 천간, 월주 지지 등)
  basicMeaning: string;      // 기본 의미
  genderSpecificMeaning: string; // 성별별 의미 (남/녀 다름)
  strengthImpact: string;    // 강약에 따른 영향
  relationship: string;      // 다른 십신과의 관계
}

// 신살 분석
export interface SinsalAnalysis {
  name: string;              // 신살 이름
  hanja: string;             // 한자
  position: string;          // 위치
  category: "길신" | "흉신" | "중성";
  basicMeaning: string;
  detailedInterpretation: string;
  lifeImpact: string;
  remedy?: string;           // 흉신의 경우 보완법
}

// 운성 분석
export interface TwelveFortuneAnalysis {
  name: string;              // 운성 이름 (장생, 목욕 등)
  hanja: string;             // 한자
  position: string;          // 기둥 위치
  meaning: string;           // 의미
  lifeStageInterpretation: string;
  advice: string;
}

// 대운 상세 분석
export interface MajorFortuneDetailedAnalysis {
  startAge: number;
  endAge: number;
  ganZhi: GanZhi;
  element: FiveElement;
  isCurrentDaeun: boolean;
  relationToYongsin: "길운" | "흉운" | "평운";
  overallFortune: string;
  careerFortune: string;
  wealthFortune: string;
  healthFortune: string;
  relationshipFortune: string;
  keyEvents: string[];
  advice: string;
}

// 세운 분석
export interface YearlyFortuneDetailedAnalysis {
  year: number;
  ganZhi: GanZhi;
  element: FiveElement;
  age: number;
  relationToYongsin: "길운" | "흉운" | "평운";
  overallScore: number;      // 0-100
  monthlyHighlights: MonthlyFortune[];
  keyAdvice: string;
  cautionPeriod?: string[];
}

// 월별 운세
export interface MonthlyFortune {
  month: number;
  score: number;
  highlight: string;
}

// ============================================
// 챕터별 결과 타입
// ============================================

// 제1장: 기본 명식 분석
export interface Chapter1Result {
  pillars: {
    year: PillarExpertAnalysis;
    month: PillarExpertAnalysis;
    day: PillarExpertAnalysis;
    hour: PillarExpertAnalysis | null;
  };
  gongmang: {
    positions: string[];
    meaning: string;
    lifeImpact: string;
    remedy: string;
  };
  stemRelations: {
    combinations: { stems: string[]; type: string; effect: string }[];
    clashes: { stems: string[]; type: string; effect: string }[];
  };
  branchRelations: {
    combinations: { branches: string[]; type: string; effect: string }[];
    clashes: { branches: string[]; type: string; effect: string }[];
    punishments: { branches: string[]; type: string; effect: string }[];
    harms: { branches: string[]; type: string; effect: string }[];
    destructions: { branches: string[]; type: string; effect: string }[];
  };
  summary: string;
  // 서술형 풀이 (이야기체)
  narrative?: ChapterNarrative;
}

// 제2장: 음양오행 분석
export interface Chapter2Result {
  yinYangBalance: {
    yinCount: number;
    yangCount: number;
    balance: "양성적" | "음성적" | "균형";
    interpretation: string;
  };
  fiveElements: {
    distribution: ElementDetailedAnalysis[];
    dominant: FiveElement;
    weak: FiveElement;
    missing?: FiveElement;
  };
  personalityFromElements: {
    coreTraits: string[];
    strengths: string[];
    weaknesses: string[];
    psychologicalPattern: string;
  };
  bodyConstitution: {
    type: string;
    strongOrgans: string[];
    weakOrgans: string[];
  };
  sinGangSinYak: {
    result: "신강" | "신약" | "중화";
    score: number;         // -100 ~ +100 (음수: 신약, 양수: 신강)
    explanation: string;
    implications: string;
  };
  // 서술형 풀이 (이야기체)
  narrative?: ChapterNarrative;
}

// 제3장: 십성(十星) 분석 (성별 분기)
export interface Chapter3Result {
  tenGods: TenGodDetailedAnalysis[];
  dominantGod: {
    name: string;
    influence: string;
  };
  godBalance: {
    bigyeop: number;      // 비겁 (비견+겁재)
    siksang: number;      // 식상 (식신+상관)
    jaeseong: number;     // 재성 (편재+정재)
    gwanseong: number;    // 관성 (편관+정관)
    inseong: number;      // 인성 (편인+정인)
  };
  genderSpecificAnalysis: {
    gender: Gender;
    jaeseongMeaning: string;  // 남: 아내/돈, 여: 시아버지/돈
    gwanseongMeaning: string; // 남: 자녀/직장, 여: 남편/직장
    siksangMeaning: string;   // 남: 수하/할머니, 여: 자녀
  };
  pillarAnalysis: {
    yearPillar: { stemGod: string; branchGod: string; meaning: string };
    monthPillar: { stemGod: string; branchGod: string; meaning: string };
    dayPillar: { stemGod: string; branchGod: string; meaning: string };
    hourPillar: { stemGod: string; branchGod: string; meaning: string } | null;
  };
  // 서술형 풀이 (이야기체)
  narrative?: ChapterNarrative;
}

// 제4장: 격국(格局) 분석
export interface Chapter4Result {
  mainFormat: {
    name: string;           // 격국 이름 (정관격, 편관격 등)
    hanja: string;
    category: "정격" | "특수격" | "외격";
    establishmentConditions: string[];
    isEstablished: boolean;
    strength: "강" | "중" | "약";
  };
  breakingFactors: {
    exists: boolean;
    factors: string[];
    impact: string;
  };
  formatMeaning: {
    basicCharacter: string;
    careerTendency: string;
    wealthPattern: string;
    relationshipStyle: string;
  };
  formatChangeByDaeun: {
    currentDaeun: string;
    formatStatus: "강화" | "유지" | "약화" | "파격";
    explanation: string;
  };
  narrative?: ChapterNarrative;
}

// 제5장: 살(煞)과 귀인(貴人)
export interface Chapter5Result {
  sinsals: SinsalAnalysis[];
  guiins: SinsalAnalysis[];
  sinsalInteractions: {
    combination: string[];
    effect: string;
  }[];
  overallAssessment: {
    positiveCount: number;
    negativeCount: number;
    dominantInfluence: "길신우세" | "흉신우세" | "균형";
    summary: string;
  };
  narrative?: ChapterNarrative;
}

// 제6장: 십이운성 분석
export interface Chapter6Result {
  fortunesByPillar: {
    yearPillar: TwelveFortuneAnalysis;
    monthPillar: TwelveFortuneAnalysis;
    dayPillar: TwelveFortuneAnalysis;
    hourPillar: TwelveFortuneAnalysis | null;
  };
  lifeFlowGraph: {
    ages: number[];
    scores: number[];
    peaks: number[];
    valleys: number[];
  };
  overallPattern: string;
  keyLifeStages: {
    stage: string;
    age: string;
    fortune: string;
    advice: string;
  }[];
  narrative?: ChapterNarrative;
}

// 제7장: 대운수(大運數) 풀이
export interface Chapter7Result {
  allDaeuns: MajorFortuneDetailedAnalysis[];
  currentDaeun: {
    detail: MajorFortuneDetailedAnalysis;
    remainingYears: number;
    progress: number;       // 0-100%
  };
  transitionPeriod: {
    nextDaeunStart: number;
    transitionAnalysis: string;
    preparationAdvice: string;
  };
  yongsinDaeuns: {
    goodPeriods: { age: string; reason: string }[];
    challengingPeriods: { age: string; reason: string }[];
  };
  lifetimeOverview: string;
  narrative?: ChapterNarrative;
}

// 제8장: 연도별 운세 (세운)
export interface Chapter8Result {
  tenYearForecast: YearlyFortuneDetailedAnalysis[];
  currentYear: {
    detail: YearlyFortuneDetailedAnalysis;
    monthlyFortunes: MonthlyFortune[];
  };
  daesunSeunCombination: {
    currentCombination: string;
    effect: string;
    advice: string;
  };
  bestYears: number[];
  challengingYears: number[];
  // 형살(刑殺) 경고 - 세운 지지와 사주 지지가 형(刑) 관계일 때 경고
  hyeongsalWarning?: {
    hasHyeongsal: boolean;
    warnings: {
      year: number;
      pillar: string;  // 년주, 월주, 일주, 시주
      name: string;    // 인사형(寅巳刑) 등
      warning: string; // 상세 경고 메시지
    }[];
  };
  narrative?: ChapterNarrative;
}

// 제9장: 금전운(재물운)
export interface Chapter9Result {
  wealthType: {
    category: "정재형" | "편재형" | "식상생재형" | "관인상생형";
    description: string;
    earningStyle: string;
    spendingPattern: string;
  };
  wealthByPeriod: {
    current: { score: number; analysis: string };
    fiveYear: { trend: "상승" | "하락" | "유지"; details: string };
    lifetime: { peakAge: number; analysis: string };
  };
  investmentTendency: {
    riskTolerance: "공격형" | "중립형" | "안정형";
    suitableInvestments: string[];
    avoidInvestments: string[];
  };
  wealthRemedy: {
    yongsinColor: string;
    yongsinDirection: string;
    yongsinNumber: string;
    practicalAdvice: string[];
  };
  // 서술형 풀이 (이야기체)
  narrative?: ChapterNarrative;
}

// 제10장: 직업운 (직업상태별 분기)
export interface Chapter10Result {
  careerAptitude: {
    bestFields: string[];
    suitableJobs: string[];
    avoidJobs: string[];
    workStyle: string;
  };
  workplaceStyle: {
    leadershipType: string;
    teamworkStyle: string;
    stressResponse: string;
    idealEnvironment: string;
  };
  careerTimeline: {
    promotionPeriods: { year: number; probability: "높음" | "보통" | "낮음" }[];
    jobChangePeriods: { year: number; advice: string }[];
    startupSuitability: { score: number; analysis: string };
  };
  occupationSpecificAdvice: {
    status: OccupationStatus;
    currentAdvice: string;
    nextSteps: string[];
  };
  // 서술형 풀이 (이야기체)
  narrative?: ChapterNarrative;
}

// 제11장: 건강운 (연령대별 조언)
export interface Chapter11Result {
  elementHealthMap: {
    element: FiveElement;
    organs: string[];
    status: "건강" | "주의" | "취약";
    diseases: string[];
  }[];
  constitutionType: {
    name: string;
    characteristics: string;
    dietAdvice: string;
    exerciseAdvice: string;
  };
  healthWarnings: {
    condition: string;
    preventionAdvice: string;
  }[];
  ageSpecificAdvice: {
    ageGroup: AgeGroup;
    focusAreas: string[];
    lifestyle: string;
    checkupRecommendations: string[];
  };
  narrative?: ChapterNarrative;
}

// 제12장: 연애 성향 분석 (공통)
export interface Chapter12Result {
  loveStyle: {
    type: string;
    description: string;
    attractionPoints: string[];
    turnOffs: string[];
  };
  idealPartner: {
    personality: string[];
    appearance: string;
    compatibility: {
      goodElements: FiveElement[];
      goodZodiac: string[];
    };
  };
  loveWarnings: {
    blindSpots: string[];
    conflictPatterns: string[];
    advice: string;
  };
  attractionScore: {
    charm: number;
    passion: number;
    stability: number;
    communication: number;
  };
  narrative?: ChapterNarrative;
}

// 제13장: 인연과 관계의 흐름 (관계상태별 완전 분기)
export interface Chapter13Result {
  relationshipStatus: RelationshipStatus;

  // 솔로 전용
  soloContent?: {
    singleReason: string;
    meetingTiming: { year: number; season: string; probability: string }[];
    meetingPlaces: string[];
    idealFirstMove: string;
    selfImprovementAdvice: string;
  };

  // 연애중 전용
  datingContent?: {
    relationshipHealth: { score: number; analysis: string };
    developmentForecast: string;
    marriagePossibility: { score: number; timing: string };
    warningSignals: string[];
    deepeningAdvice: string;
  };

  // 기혼 전용
  marriedContent?: {
    spouseRelationship: { score: number; analysis: string };
    conflictPatterns: string[];
    harmonizingAdvice: string;
    renewalTiming: string;
    familyFortune: string;
  };

  // 이혼/사별 전용
  divorcedContent?: {
    healingProgress: string;
    remarriageForecast: { possibility: string; timing: string };
    selfRecoveryAdvice: string;
    newRelationshipTiming: { year: number; advice: string }[];
    emotionalGuidance: string;
  };
  narrative?: ChapterNarrative;
}

// 제14장: 결혼운 심층 분석 (관계상태별 분기)
export interface Chapter14Result {
  relationshipStatus: RelationshipStatus;

  marriageTiming: {
    optimalYears: number[];
    avoidYears: number[];
    analysis: string;
  };

  spouseAnalysis: {
    idealTraits: string[];
    meetingCircumstance: string;
    spouseCareer: string;
    spouseAppearance: string;
    compatibility: string;
  };

  marriageLife: {
    overallFortune: string;
    financialPattern: string;
    communicationStyle: string;
    conflictResolution: string;
  };

  childrenFortune: {
    possibility: "높음" | "보통" | "낮음";
    optimalTiming: string;
    childrenCount: string;
    parentingStyle: string;
  };

  statusSpecificAdvice: string;
  narrative?: ChapterNarrative;
}

// 제15장: 가족 관계 운 (자녀유무 분기)
export interface Chapter15Result {
  hasChildren: boolean;

  parentsFortune: {
    fatherRelation: { score: number; analysis: string };
    motherRelation: { score: number; analysis: string };
    inheritanceFortune: string;
    supportFromParents: string;
  };

  siblingsFortune: {
    relationship: string;
    cooperation: string;
    advice: string;
  };

  // 자녀 있는 경우
  childrenFortune?: {
    overallRelation: string;
    educationAdvice: string;
    conflictPatterns: string[];
    supportAdvice: string;
  };

  // 자녀 없는 경우
  noChildrenContent?: {
    futurePossibility: string;
    alternativeFulfillment: string;
  };

  familyHarmony: {
    score: number;
    strengthAreas: string[];
    improvementAreas: string[];
  };
  narrative?: ChapterNarrative;
}

// 제16장: 궁합 분석 (2인 입력 시만)
export interface Chapter16Result {
  overallScore: number;

  elementCompatibility: {
    person1Element: FiveElement;
    person2Element: FiveElement;
    relationship: "상생" | "상극" | "비화";
    score: number;
    analysis: string;
  };

  tenGodCompatibility: {
    mutualGods: { person1God: string; person2God: string }[];
    harmony: number;
    analysis: string;
  };

  dayPillarCompatibility: {
    person1DayPillar: string;
    person2DayPillar: string;
    compatibility: string;
    score: number;
  };

  conflictAnalysis: {
    majorConflicts: { area: string; description: string; solution: string }[];
    minorFrictions: string[];
  };

  lifestyleComparison: {
    financialAttitude: { similarity: number; analysis: string };
    communicationStyle: { similarity: number; analysis: string };
    valueAlignment: { similarity: number; analysis: string };
    futureGoals: { similarity: number; analysis: string };
  };

  overallAdvice: string;

  narrative: ChapterNarrative;
}

// 제17장: 주의 시기·개운
export interface Chapter17Result {
  comprehensiveRiskPeriods: {
    year: number;
    riskLevel: "높음" | "중간" | "낮음";
    riskAreas: string[];
    advice: string;
  }[];

  yearlyRiskRating: {
    year: number;
    grade: "A" | "B" | "C" | "D" | "F";
    summary: string;
  }[];

  yongsinRemedy: {
    yongsin: FiveElement;
    colors: string[];
    directions: string[];
    numbers: number[];
    foods: string[];
    activities: string[];
    avoidElements: FiveElement[];
  };

  practicalAdvice: {
    daily: string[];
    monthly: string[];
    yearly: string[];
  };

  narrative?: ChapterNarrative;
}

// 제18장: 학업/자격증 운 (학생/취준생용)
export interface Chapter18Result {
  isApplicable: boolean;   // 학생/취준생 여부

  learningStyle: {
    type: string;
    strengths: string[];
    weaknesses: string[];
    studyEnvironment: string;
    studyMethods: string[];
  };

  examFortune: {
    currentYear: { score: number; analysis: string };
    bestMonths: number[];
    avoidMonths: number[];
  };

  suitableFields: {
    academic: string[];
    certifications: string[];
    skills: string[];
  };

  studyAdvice: string;
}

// 부록
export interface AppendixResult {
  glossary: {
    term: string;
    hanja: string;
    definition: string;
    example?: string;
  }[];

  personalNotes: {
    enabled: boolean;
    placeholder: string;
  };

  faq: {
    question: string;
    answer: string;
  }[];
}

// ============================================
// 전문가 모드 최종 결과
// ============================================

export interface ExpertModeResult {
  // 메타 정보
  meta: {
    generatedAt: Date;
    version: string;
    conditions: ExpertModeConditions;
    totalPages: number;
  };

  // 공통 분석 (11개 챕터)
  common: {
    chapter1_myeongshik: Chapter1Result;
    chapter2_eumyangOheng: Chapter2Result;
    chapter4_geokguk: Chapter4Result;
    chapter5_sinsal: Chapter5Result;
    chapter6_sipiUnseong: Chapter6Result;
    chapter7_daeun: Chapter7Result;
    chapter8_yearly: Chapter8Result;
    chapter9_wealth: Chapter9Result;
    chapter12_loveStyle: Chapter12Result;
    chapter17_warning: Chapter17Result;
  };

  // 성별 분기
  genderBranch: {
    chapter3_sipseong: Chapter3Result;
  };

  // 직업상태 분기
  occupationBranch: {
    chapter10_career: Chapter10Result;
    chapter18_study: Chapter18Result | null;  // 학생/취준생만
  };

  // 연령대 분기
  ageBranch: {
    chapter11_health: Chapter11Result;
  };

  // 관계상태 분기 (4가지 버전)
  relationshipBranch: {
    chapter13_relationship: Chapter13Result;
    chapter14_marriage: Chapter14Result;
  };

  // 자녀유무 분기
  childrenBranch: {
    chapter15_family: Chapter15Result;
  };

  // 궁합 (2인 입력 시만)
  compatibility: Chapter16Result | null;

  // 부록
  appendix: AppendixResult;
}

// ============================================
// 유틸리티 함수 타입
// ============================================

// 연령대 계산 함수
export function calculateAgeGroup(birthYear: number): AgeGroup {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age < 30) return "20s";
  if (age < 40) return "30s";
  if (age < 50) return "40s";
  return "50plus";
}
