/**
 * 커플 전문가 모드 타입 정의
 * 16개 챕터 구성 (두 사람의 궁합 중심)
 */

import type {
  Gender,
  FiveElement,
  FiveElementKr,
  GanZhi,
  Pillar,
} from "./saju";

import type {
  ChapterNarrative,
  PillarExpertAnalysis,
} from "./expert";

// ============================================
// 커플 분석 기본 타입
// ============================================

// 관계 상태 (커플용 - 기혼/미혼만)
export type CoupleRelationshipStatus = "married" | "unmarried";

// 개인 정보 (커플 중 1인)
export interface CouplePersonInfo {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  isLunar: boolean;
  isLeapMonth: boolean;
  relationshipStatus?: CoupleRelationshipStatus;
}

// 사주 데이터 (분석 결과)
export interface CoupleSajuData {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  timePillar: Pillar | null;
  ilgan: string;  // 일간
  ohengCount: { 목: number; 화: number; 토: number; 금: number; 수: number };
  strongElements: FiveElement[];
  weakElements: FiveElement[];
}

// ============================================
// 챕터별 결과 타입 (16개 챕터)
// ============================================

// 제1장: 두 사람의 명식
export interface CoupleChapter1Result {
  person1: {
    name: string;
    pillars: {
      year: PillarExpertAnalysis;
      month: PillarExpertAnalysis;
      day: PillarExpertAnalysis;
      hour: PillarExpertAnalysis | null;
    };
    ilganElement: FiveElementKr;
    ilganAnalysis: string;
  };
  person2: {
    name: string;
    pillars: {
      year: PillarExpertAnalysis;
      month: PillarExpertAnalysis;
      day: PillarExpertAnalysis;
      hour: PillarExpertAnalysis | null;
    };
    ilganElement: FiveElementKr;
    ilganAnalysis: string;
  };
  ilganRelation: {
    type: string;  // 십신 (비견, 식신, 정재 등)
    description: string;
    basicCompatibility: string;
  };
  narrative?: ChapterNarrative;
}

// 제2장: 기본 궁합 점수
export interface CoupleChapter2Result {
  totalScore: number;  // 0-100
  grade: "천생연분" | "좋은 인연" | "보통 인연" | "노력 필요" | "주의 필요";
  gradeDescription: string;
  scoreBreakdown: {
    ilganScore: number;      // 일간 궁합 점수
    jijiScore: number;       // 지지 관계 점수
    ohengScore: number;      // 오행 보완/충돌 점수
  };
  overallAssessment: string;
  narrative?: ChapterNarrative;
}

// 제3장: 일간 궁합 심층
export interface CoupleChapter3Result {
  person1Ilgan: string;
  person2Ilgan: string;
  sipsinType: string;  // 십신 관계 (비견, 식신, 정재 등)
  sipsinHanja: string;
  sipsinDescription: string;  // 십신에 대한 상세 설명
  strengths: string[];
  weaknesses: string[];
  relationshipDynamics: string;  // 관계 역학
  powerBalance: "person1우세" | "person2우세" | "균형";
  advice: string;
  narrative?: ChapterNarrative;
}

// 제4장: 오행 보완 분석
export interface CoupleChapter4Result {
  person1Elements: {
    strong: FiveElement[];
    weak: FiveElement[];
    missing: FiveElement[];
  };
  person2Elements: {
    strong: FiveElement[];
    weak: FiveElement[];
    missing: FiveElement[];
  };
  complementaryPairs: {
    element: FiveElement;
    emoji: string;
    theme: string;
    whoLacks: "person1" | "person2";
    lackingDescription: string;
    fillsDescription: string;
    benefitTogether: string;
  }[];
  synergyScore: number;  // 0-100
  overallSynergy: string;
  narrative?: ChapterNarrative;
}

// 제5장: 오행 충돌 분석
export interface CoupleChapter5Result {
  conflicts: {
    elements: [FiveElement, FiveElement];
    emojis: [string, string];
    theme: string;
    description: string;
    warning: string;
    solution: string;
  }[];
  conflictSeverity: "심각" | "보통" | "경미" | "없음";
  managementAdvice: string;
  narrative?: ChapterNarrative;
}

// 제6장: 지지 육합 분석
export interface CoupleChapter6Result {
  yukaps: {
    pair: string;  // "자-축"
    person1Branch: string;
    person2Branch: string;
    description: string;
    positiveEffect: string;
  }[];
  hasYukap: boolean;
  overallHarmony: string;
  narrative?: ChapterNarrative;
}

// 제7장: 지지 충·형·해 분석
export interface CoupleChapter7Result {
  chungs: {
    pair: string;
    description: string;
    conflictArea: string;
    solution: string;
  }[];
  hyungs: {
    pair: string;
    description: string;
    conflictArea: string;
    solution: string;
  }[];
  haes: {
    pair: string;
    description: string;
    conflictArea: string;
    solution: string;
  }[];
  totalNegativeCount: number;
  overallRisk: "높음" | "보통" | "낮음" | "없음";
  managementAdvice: string;
  narrative?: ChapterNarrative;
}

// 제8장: 소통 방식
export interface CoupleChapter8Result {
  person1Style: {
    communicationType: string;
    expressionStyle: string;
    listeningStyle: string;
    conflictStyle: string;
  };
  person2Style: {
    communicationType: string;
    expressionStyle: string;
    listeningStyle: string;
    conflictStyle: string;
  };
  compatibility: {
    score: number;
    analysis: string;
  };
  misunderstandingPoints: string[];
  communicationTips: string[];
  narrative?: ChapterNarrative;
}

// 제9장: 갈등 패턴과 화해법
export interface CoupleChapter9Result {
  person1ConflictPattern: {
    triggerPoints: string[];
    reactionStyle: string;
    recoveryTime: string;
  };
  person2ConflictPattern: {
    triggerPoints: string[];
    reactionStyle: string;
    recoveryTime: string;
  };
  commonConflictScenarios: {
    scenario: string;
    person1Reaction: string;
    person2Reaction: string;
    escalationRisk: "높음" | "보통" | "낮음";
  }[];
  reconciliationStrategies: string[];
  preventionTips: string[];
  narrative?: ChapterNarrative;
}

// 제10장: 연애/결혼 시기
export interface CoupleChapter10Result {
  person1Timeline: {
    currentDaeun: string;
    relationshipFortune: string;
    goodYears: number[];
    challengingYears: number[];
  };
  person2Timeline: {
    currentDaeun: string;
    relationshipFortune: string;
    goodYears: number[];
    challengingYears: number[];
  };
  sharedGoodPeriods: {
    year: number;
    reason: string;
    recommendation: string;
  }[];
  sharedChallengingPeriods: {
    year: number;
    reason: string;
    advice: string;
  }[];
  optimalMarriageYears: number[];
  avoidMarriageYears: number[];
  narrative?: ChapterNarrative;
}

// 제11장: 재물 궁합
export interface CoupleChapter11Result {
  person1MoneyStyle: {
    earningPattern: string;
    spendingPattern: string;
    savingAttitude: string;
    investmentStyle: string;
  };
  person2MoneyStyle: {
    earningPattern: string;
    spendingPattern: string;
    savingAttitude: string;
    investmentStyle: string;
  };
  financialCompatibility: {
    score: number;
    analysis: string;
  };
  jointFinanceAdvice: {
    budgetManagement: string;
    savingsStrategy: string;
    investmentApproach: string;
    conflictPrevention: string;
  };
  wealthForecast: {
    shortTerm: string;  // 1-3년
    midTerm: string;    // 3-10년
    longTerm: string;   // 10년+
  };
  narrative?: ChapterNarrative;
}

// 제12장: 자녀 궁합
export interface CoupleChapter12Result {
  childrenPossibility: {
    person1Fortune: string;
    person2Fortune: string;
    combinedFortune: "높음" | "보통" | "낮음";
    analysis: string;
  };
  optimalConceptionYears: number[];
  parentingStyles: {
    person1Style: string;
    person2Style: string;
    compatibility: string;
  };
  childEducationApproach: {
    agreement: string[];
    potentialConflicts: string[];
    advice: string;
  };
  narrative?: ChapterNarrative;
}

// 제13장: 시댁/처가 관계
export interface CoupleChapter13Result {
  person1FamilyRelation: {
    inLawCompatibility: string;
    potentialIssues: string[];
    managementAdvice: string;
  };
  person2FamilyRelation: {
    inLawCompatibility: string;
    potentialIssues: string[];
    managementAdvice: string;
  };
  familyDynamics: {
    overallHarmony: "좋음" | "보통" | "어려움";
    keyAdvice: string;
  };
  boundarySettings: string[];
  narrative?: ChapterNarrative;
}

// 제14장: 위기 시기와 주의점
export interface CoupleChapter14Result {
  crisisPeriods: {
    year: number;
    riskLevel: "높음" | "보통" | "낮음";
    riskAreas: string[];
    preventionAdvice: string;
  }[];
  commonVulnerabilities: string[];
  warningSignals: string[];
  emergencyAdvice: string;
  narrative?: ChapterNarrative;
}

// 제15장: 장기 전망
export interface CoupleChapter15Result {
  fiveYearForecast: {
    year: number;
    relationshipScore: number;
    keyTheme: string;
    advice: string;
  }[];
  tenYearVision: {
    overallTrend: "성장" | "유지" | "주의";
    milestones: string[];
    challenges: string[];
    opportunities: string[];
  };
  lifetimeCompatibility: {
    score: number;
    analysis: string;
    keyToSuccess: string;
  };
  narrative?: ChapterNarrative;
}

// 제16장: 종합 조언
export interface CoupleChapter16Result {
  coreStrengths: string[];
  coreWeaknesses: string[];
  mustDoList: string[];
  mustAvoidList: string[];
  dailyHabits: string[];
  communicationRules: string[];
  finalMessage: string;
  narrative?: ChapterNarrative;
}

// ============================================
// 커플 전문가 모드 최종 결과
// ============================================

export interface ExpertCoupleResult {
  // 메타 정보
  meta: {
    generatedAt: Date;
    version: string;
    person1Name: string;
    person2Name: string;
    totalPages: number;
  };

  // 기본 정보
  personInfo: {
    person1: CouplePersonInfo;
    person2: CouplePersonInfo;
  };

  // 사주 데이터
  sajuData: {
    person1: CoupleSajuData;
    person2: CoupleSajuData;
  };

  // 16개 챕터 결과
  chapters: {
    chapter1_profiles: CoupleChapter1Result;
    chapter2_basicScore: CoupleChapter2Result;
    chapter3_ilganDeep: CoupleChapter3Result;
    chapter4_ohengComplement: CoupleChapter4Result;
    chapter5_ohengConflict: CoupleChapter5Result;
    chapter6_jijiYukap: CoupleChapter6Result;
    chapter7_jijiConflict: CoupleChapter7Result;
    chapter8_communication: CoupleChapter8Result;
    chapter9_conflictPattern: CoupleChapter9Result;
    chapter10_timing: CoupleChapter10Result;
    chapter11_wealth: CoupleChapter11Result;
    chapter12_children: CoupleChapter12Result;
    chapter13_family: CoupleChapter13Result;
    chapter14_crisis: CoupleChapter14Result;
    chapter15_longterm: CoupleChapter15Result;
    chapter16_summary: CoupleChapter16Result;
  };
}

// ============================================
// DB 저장용 타입
// ============================================

export interface ExpertCoupleRequest {
  id: string;
  createdAt: string;
  email: string;
  person1: CouplePersonInfo;
  person2: CouplePersonInfo;
  pdfStatus: "pending" | "generating" | "completed" | "failed";
  emailStatus: "pending" | "sent" | "failed";
  emailSentAt?: string;
  analysisResult?: ExpertCoupleResult;
}
