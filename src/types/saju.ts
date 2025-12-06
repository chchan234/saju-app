// 성별
export type Gender = "male" | "female";

// 양력/음력
export type CalendarType = "solar" | "lunar";

// ============================================
// 전문가 모드 전용 타입
// ============================================

// 관계 상태 (4가지)
export type RelationshipStatus = "solo" | "dating" | "married" | "divorced";

// 직업 상태 (6가지)
export type OccupationStatus =
  | "student"      // 학생
  | "jobseeker"    // 취업준비생
  | "employee"     // 직장인
  | "business"     // 사업자
  | "freelance"    // 프리랜서
  | "homemaker";   // 전업주부

// 연령대 (자동 계산)
export type AgeGroup = "20s" | "30s" | "40s" | "50plus";

// 전문가 모드 분기 조건
export interface ExpertModeConditions {
  gender: Gender;
  relationshipStatus: RelationshipStatus;
  hasChildren: boolean;
  occupationStatus: OccupationStatus;
  ageGroup: AgeGroup;
}

// 시진 (12지지 기반 시간)
export type BirthHour =
  | "unknown"
  | "23" | "01" // 자시 (23:30 ~ 01:29)
  | "03"        // 축시 (01:30 ~ 03:29)
  | "05"        // 인시 (03:30 ~ 05:29)
  | "07"        // 묘시 (05:30 ~ 07:29)
  | "09"        // 진시 (07:30 ~ 09:29)
  | "11"        // 사시 (09:30 ~ 11:29)
  | "13"        // 오시 (11:30 ~ 13:29)
  | "15"        // 미시 (13:30 ~ 15:29)
  | "17"        // 신시 (15:30 ~ 17:29)
  | "19"        // 유시 (17:30 ~ 19:29)
  | "21"        // 술시 (19:30 ~ 21:29)
  | "23-2";     // 해시 (21:30 ~ 23:29)

// 개인 사주 입력 폼 데이터
export interface IndividualFormData {
  name: string;
  gender: Gender;
  year: number;
  month: number;
  day: number;
  hour: BirthHour;
  calendarType: CalendarType;
}

// 커플 궁합 입력 폼 데이터
export interface CoupleFormData {
  person1: IndividualFormData;
  person2: IndividualFormData;
}

// 가족 관계 유형
export type FamilyRelation =
  | "me"
  | "parent"
  | "grandparent"
  | "sibling"
  | "child"
  | "spouse"
  | "relative"
  | "other";

// 가족 구성원 데이터
export interface FamilyMember extends IndividualFormData {
  relation: FamilyRelation;
}

// 가족 통합 입력 폼 데이터
export interface FamilyFormData {
  members: FamilyMember[];
}

// 천간 (10간)
export type HeavenlyStem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";

// 지지 (12지)
export type EarthlyBranch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type EarthlyBranchKr = "자" | "축" | "인" | "묘" | "진" | "사" | "오" | "미" | "신" | "유" | "술" | "해";

// 오행
export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";
export type FiveElementKr = "목" | "화" | "토" | "금" | "수";
export type FiveElementHanja = "木" | "火" | "土" | "金" | "水";

// 간지 (천간 + 지지)
export interface GanZhi {
  stem: HeavenlyStem;
  stemKr: HeavenlyStemKr;
  branch: EarthlyBranch;
  branchKr: EarthlyBranchKr;
  fullHanja: string; // 예: "甲子"
  fullKr: string;    // 예: "갑자"
}

// 사주팔자 (4주)
export interface FourPillars {
  year: GanZhi;   // 년주
  month: GanZhi;  // 월주
  day: GanZhi;    // 일주
  hour: GanZhi | null; // 시주 (모름인 경우 null)
}

// 오행 분석 결과
export interface FiveElementAnalysis {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: FiveElement;
  weak: FiveElement;
}

// 십신
export type TenGod =
  | "비견" | "겁재"     // 비겁
  | "식신" | "상관"     // 식상
  | "편재" | "정재"     // 재성
  | "편관" | "정관"     // 관성
  | "편인" | "정인";    // 인성

// 십신 분석
export interface TenGodAnalysis {
  god: TenGod;
  element: FiveElement;
  count: number;
}

// 대운 정보
export interface MajorFortune {
  startAge: number;
  endAge: number;
  ganZhi: GanZhi;
  element: FiveElement;
}

// 세운 정보
export interface YearlyFortune {
  year: number;
  ganZhi: GanZhi;
  element: FiveElement;
}

// 사주 분석 결과
export interface SajuResult {
  input: IndividualFormData;
  fourPillars: FourPillars;
  fiveElements: FiveElementAnalysis;
  tenGods: TenGodAnalysis[];
  yongShin: FiveElement; // 용신
  majorFortunes: MajorFortune[]; // 대운
  yearlyFortunes: YearlyFortune[]; // 세운 (올해 기준 ±5년)
  zodiac: string; // 띠
  lunarDate: {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  };
}

// 궁합 결과
export interface CompatibilityResult {
  person1: SajuResult;
  person2: SajuResult;
  overallScore: number; // 0-100
  categories: {
    name: string;
    score: number;
    description: string;
  }[];
  summary: string;
}

// 만세력 DB 레코드
export interface ManseryeokRecord {
  cd_no: number;
  cd_sgi: number;
  cd_sy: number;
  cd_sm: number;
  cd_sd: number;
  cd_ly: number;
  cd_lm: number;
  cd_ld: number;
  cd_hyganjee: string;
  cd_kyganjee: string;
  cd_hmganjee: string;
  cd_kmganjee: string;
  cd_hdganjee: string;
  cd_kdganjee: string;
  cd_hweek: string;
  cd_kweek: string;
  cd_stars: string;
  cd_moon_state: string;
  cd_moon_time: string;
  cd_leap_month: number;
  cd_month_size: number;
  cd_hterms: string;
  cd_kterms: string;
  cd_terms_time: string;
  cd_keventday: string;
  cd_ddi: string;
  cd_sol_plan: string;
  cd_lun_plan: string;
  holiday: number;
}

// Supabase CalendaData 타입 (ManseryeokRecord와 동일)
export type CalendaData = ManseryeokRecord;

// 사주 기둥 (Pillar)
export interface Pillar {
  cheongan: string;      // 천간 (갑, 을, 병, ...)
  jiji: string;          // 지지 (자, 축, 인, ...)
  ganji: string;         // 간지 (갑자, 을축, ...)
  cheonganOheng: string; // 천간 오행
  jijiOheng: string;     // 지지 오행
  cheonganYinyang: "양" | "음";
  jijiYinyang: "양" | "음";
  cheonganSipsin?: string; // 천간 십신
  jijiSipsin?: string;     // 지지 십신
}

// 오행 개수
export interface OhengCount {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

// API 사주 결과 (계산기 반환 타입)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SajuApiResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  timePillar: Pillar;
  ohengCount: OhengCount;
  yongsin: string;
  birthInfo: {
    solarYear: number;
    solarMonth: number;
    solarDay: number;
    lunarYear: number;
    lunarMonth: number;
    lunarDay: number;
    isLeapMonth: boolean;
    hour: number;
    minute: number;
  };
  meta: {
    ddi: string;       // 입춘 기준 띠 (사주용)
    ddiLunar: string;  // 음력 기준 띠 (일반용)
    stars: string;     // 28수
    terms: string;     // 절기
    weekday: string;   // 요일
  };
  // 확장 필드 (API 응답 시 포함)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  majorFortunes?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yearlyFortunes?: any[];
  gender?: Gender;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysis?: any;
}
