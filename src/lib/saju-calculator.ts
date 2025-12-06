/**
 * 사주팔자 계산 로직
 * - 년주, 월주, 일주, 시주 계산
 * - 오행 분석
 * - 십신 계산
 */

import type { CalendaData, SajuApiResult, Pillar, OhengCount } from "@/types/saju";

// 천간 배열 (갑을병정무기경신임계)
const CHEONGAN_LIST = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
// 지지 배열 (자축인묘진사오미신유술해)
const JIJI_LIST = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

// 천간 오행 매핑
const CHEONGAN_OHENG: Record<string, string> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

// 지지 오행 매핑
const JIJI_OHENG: Record<string, string> = {
  자: "수", 축: "토",
  인: "목", 묘: "목",
  진: "토", 사: "화",
  오: "화", 미: "토",
  신: "금", 유: "금",
  술: "토", 해: "수",
};

// 천간 음양 매핑
const CHEONGAN_YINYANG: Record<string, "양" | "음"> = {
  갑: "양", 을: "음",
  병: "양", 정: "음",
  무: "양", 기: "음",
  경: "양", 신: "음",
  임: "양", 계: "음",
};

// 지지 음양 매핑
const JIJI_YINYANG: Record<string, "양" | "음"> = {
  자: "양", 축: "음",
  인: "양", 묘: "음",
  진: "양", 사: "음",
  오: "양", 미: "음",
  신: "양", 유: "음",
  술: "양", 해: "음",
};

// 십신 계산 (일간 기준)
const SIPSIN_MAP: Record<string, Record<string, string>> = {
  // 일간이 갑목일 때
  갑: { 갑: "비견", 을: "겁재", 병: "식신", 정: "상관", 무: "편재", 기: "정재", 경: "편관", 신: "정관", 임: "편인", 계: "정인" },
  을: { 갑: "겁재", 을: "비견", 병: "상관", 정: "식신", 무: "정재", 기: "편재", 경: "정관", 신: "편관", 임: "정인", 계: "편인" },
  병: { 갑: "편인", 을: "정인", 병: "비견", 정: "겁재", 무: "식신", 기: "상관", 경: "편재", 신: "정재", 임: "편관", 계: "정관" },
  정: { 갑: "정인", 을: "편인", 병: "겁재", 정: "비견", 무: "상관", 기: "식신", 경: "정재", 신: "편재", 임: "정관", 계: "편관" },
  무: { 갑: "편관", 을: "정관", 병: "편인", 정: "정인", 무: "비견", 기: "겁재", 경: "식신", 신: "상관", 임: "편재", 계: "정재" },
  기: { 갑: "정관", 을: "편관", 병: "정인", 정: "편인", 무: "겁재", 기: "비견", 경: "상관", 신: "식신", 임: "정재", 계: "편재" },
  경: { 갑: "편재", 을: "정재", 병: "편관", 정: "정관", 무: "편인", 기: "정인", 경: "비견", 신: "겁재", 임: "식신", 계: "상관" },
  신: { 갑: "정재", 을: "편재", 병: "정관", 정: "편관", 무: "정인", 기: "편인", 경: "겁재", 신: "비견", 임: "상관", 계: "식신" },
  임: { 갑: "식신", 을: "상관", 병: "편재", 정: "정재", 무: "편관", 기: "정관", 경: "편인", 신: "정인", 임: "비견", 계: "겁재" },
  계: { 갑: "상관", 을: "식신", 병: "정재", 정: "편재", 무: "정관", 기: "편관", 경: "정인", 신: "편인", 임: "겁재", 계: "비견" },
};

// 지지 십신 계산 (지지 → 천간 본기 기준)
const JIJI_BONGI: Record<string, string> = {
  자: "계", 축: "기",
  인: "갑", 묘: "을",
  진: "무", 사: "병",
  오: "정", 미: "기",
  신: "경", 유: "신",
  술: "무", 해: "임",
};

// 띠 목록 (12지지 순서)
const DDI_LIST = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];

/**
 * 음력 년도로 띠 계산 (12년 주기)
 */
function getDdiByLunarYear(lunarYear: number): string {
  return DDI_LIST[lunarYear % 12];
}

/**
 * 시주(時柱) 천간 계산
 * 일간에 따라 시주 천간이 결정됨
 */
function calculateSiganCheongan(ilgan: string, sijiIndex: number): string {
  // 갑기일 → 갑자시 시작
  // 을경일 → 병자시 시작
  // 병신일 → 무자시 시작
  // 정임일 → 경자시 시작
  // 무계일 → 임자시 시작
  const startIndexMap: Record<string, number> = {
    갑: 0, 기: 0,  // 갑자시 시작
    을: 2, 경: 2,  // 병자시 시작
    병: 4, 신: 4,  // 무자시 시작
    정: 6, 임: 6,  // 경자시 시작
    무: 8, 계: 8,  // 임자시 시작
  };

  const startIndex = startIndexMap[ilgan] ?? 0;
  return CHEONGAN_LIST[(startIndex + sijiIndex) % 10];
}

/**
 * 시간을 시진(時辰) 인덱스로 변환
 * 정시(正時) 기준 - 각 시진은 해당 시각의 30분부터 시작
 */
export function getTimeIndex(hour: number, minute: number): number {
  // 정시(正時) 기준 시진 체계
  // 자시: 23:30-01:29 (0)
  // 축시: 01:30-03:29 (1)
  // 인시: 03:30-05:29 (2)
  // 묘시: 05:30-07:29 (3)
  // 진시: 07:30-09:29 (4)
  // 사시: 09:30-11:29 (5)
  // 오시: 11:30-13:29 (6)
  // 미시: 13:30-15:29 (7)
  // 신시: 15:30-17:29 (8)
  // 유시: 17:30-19:29 (9)
  // 술시: 19:30-21:29 (10)
  // 해시: 21:30-23:29 (11)
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 23 * 60 + 30 || totalMinutes < 1 * 60 + 30) return 0;  // 자시
  if (totalMinutes < 3 * 60 + 30) return 1;   // 축시
  if (totalMinutes < 5 * 60 + 30) return 2;   // 인시
  if (totalMinutes < 7 * 60 + 30) return 3;   // 묘시
  if (totalMinutes < 9 * 60 + 30) return 4;   // 진시
  if (totalMinutes < 11 * 60 + 30) return 5;  // 사시
  if (totalMinutes < 13 * 60 + 30) return 6;  // 오시
  if (totalMinutes < 15 * 60 + 30) return 7;  // 미시
  if (totalMinutes < 17 * 60 + 30) return 8;  // 신시
  if (totalMinutes < 19 * 60 + 30) return 9;  // 유시
  if (totalMinutes < 21 * 60 + 30) return 10; // 술시
  return 11; // 해시
}

/**
 * 간지에서 천간/지지 분리
 */
function parseGanji(ganji: string): { cheongan: string; jiji: string } | null {
  if (!ganji || ganji.length < 2) return null;
  return {
    cheongan: ganji[0],
    jiji: ganji[1],
  };
}

/**
 * 기둥(Pillar) 생성
 */
function createPillar(ganji: string, ilgan?: string, pillarType?: "year" | "month" | "day" | "hour"): Pillar {
  const parsed = parseGanji(ganji);
  if (!parsed) {
    return {
      cheongan: "",
      jiji: "",
      ganji: ganji || "",
      cheonganOheng: "",
      jijiOheng: "",
      cheonganYinyang: "양",
      jijiYinyang: "양",
    };
  }

  const result: Pillar = {
    cheongan: parsed.cheongan,
    jiji: parsed.jiji,
    ganji: ganji,
    cheonganOheng: CHEONGAN_OHENG[parsed.cheongan] || "",
    jijiOheng: JIJI_OHENG[parsed.jiji] || "",
    cheonganYinyang: CHEONGAN_YINYANG[parsed.cheongan] || "양",
    jijiYinyang: JIJI_YINYANG[parsed.jiji] || "양",
  };

  // 십신 계산 (일간 기준)
  if (ilgan) {
    // 일주의 천간만 "본인(日主)"으로 표시
    // 다른 기둥에서 일간과 같은 천간이 나오면 "비견"으로 처리
    if (pillarType === "day") {
      result.cheonganSipsin = "본인";
    } else if (parsed.cheongan === ilgan) {
      result.cheonganSipsin = "비견";
    } else {
      result.cheonganSipsin = SIPSIN_MAP[ilgan]?.[parsed.cheongan];
    }
    const jijiBongi = JIJI_BONGI[parsed.jiji];
    if (jijiBongi) {
      result.jijiSipsin = SIPSIN_MAP[ilgan]?.[jijiBongi];
    }
  }

  return result;
}

/**
 * 오행 개수 계산
 */
function calculateOhengCount(pillars: Pillar[]): OhengCount {
  const count: OhengCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const pillar of pillars) {
    if (pillar.cheonganOheng && pillar.cheonganOheng in count) {
      count[pillar.cheonganOheng as keyof OhengCount]++;
    }
    if (pillar.jijiOheng && pillar.jijiOheng in count) {
      count[pillar.jijiOheng as keyof OhengCount]++;
    }
  }

  return count;
}

// 오행 상생상극 관계 (억부론 용신 계산용)
type FiveElement = "목" | "화" | "토" | "금" | "수";
const ELEMENT_RELATIONS: Record<FiveElement, {
  same: FiveElement;       // 비겁 (같은 오행)
  generates: FiveElement;  // 식상 (내가 생하는)
  generated: FiveElement;  // 인성 (나를 생하는)
  controls: FiveElement;   // 재성 (내가 극하는)
  controlled: FiveElement; // 관성 (나를 극하는)
}> = {
  목: { same: "목", generates: "화", generated: "수", controls: "토", controlled: "금" },
  화: { same: "화", generates: "토", generated: "목", controls: "금", controlled: "수" },
  토: { same: "토", generates: "금", generated: "화", controls: "수", controlled: "목" },
  금: { same: "금", generates: "수", generated: "토", controls: "목", controlled: "화" },
  수: { same: "수", generates: "목", generated: "금", controls: "화", controlled: "토" }
};

// 월령 득령 점수 (월지에서 일간이 얼마나 힘을 받는지)
const MONTH_ELEMENT_STRENGTH: Record<string, Record<FiveElement, number>> = {
  // 인월(寅) - 목이 왕성
  "인": { 목: 3, 화: 1, 토: -1, 금: -2, 수: 0 },
  // 묘월(卯) - 목이 가장 왕성
  "묘": { 목: 3, 화: 1, 토: -2, 금: -3, 수: 0 },
  // 진월(辰) - 토 기운 (봄의 마지막)
  "진": { 목: 1, 화: 0, 토: 2, 금: -1, 수: 1 },
  // 사월(巳) - 화가 왕성
  "사": { 목: 0, 화: 3, 토: 1, 금: -2, 수: -3 },
  // 오월(午) - 화가 가장 왕성
  "오": { 목: -1, 화: 3, 토: 1, 금: -3, 수: -3 },
  // 미월(未) - 토 기운 (여름의 마지막)
  "미": { 목: -1, 화: 1, 토: 2, 금: 0, 수: -1 },
  // 신월(申) - 금이 왕성
  "신": { 목: -2, 화: -1, 토: 1, 금: 3, 수: 1 },
  // 유월(酉) - 금이 가장 왕성
  "유": { 목: -3, 화: -2, 토: 0, 금: 3, 수: 1 },
  // 술월(戌) - 토 기운 (가을의 마지막)
  "술": { 목: -1, 화: 0, 토: 2, 금: 1, 수: 0 },
  // 해월(亥) - 수가 왕성
  "해": { 목: 1, 화: -3, 토: -1, 금: 0, 수: 3 },
  // 자월(子) - 수가 가장 왕성
  "자": { 목: 1, 화: -3, 토: -2, 금: 1, 수: 3 },
  // 축월(丑) - 토 기운 (겨울의 마지막)
  "축": { 목: 0, 화: -1, 토: 2, 금: 1, 수: 1 }
};

/**
 * 신강/신약 판정 (억부론 기준)
 */
function calculateSinGangSinYak(
  pillars: Pillar[],
  ilganElement: FiveElement,
  monthBranch: string
): "신강" | "신약" | "중화" {
  let score = 0;
  const relations = ELEMENT_RELATIONS[ilganElement];

  // 1. 월령(月令) - 가장 중요 (30%)
  const monthStrength = MONTH_ELEMENT_STRENGTH[monthBranch]?.[ilganElement] || 0;
  score += monthStrength * 15; // -45 ~ +45

  // 2. 사주 내 오행 분포
  for (const pillar of pillars) {
    // 천간 분석
    if (pillar.cheonganOheng) {
      const stemElement = pillar.cheonganOheng as FiveElement;
      if (stemElement === relations.same) score += 8;        // 비겁
      else if (stemElement === relations.generated) score += 6; // 인성
      else if (stemElement === relations.generates) score -= 3; // 식상 (설기)
      else if (stemElement === relations.controls) score -= 4;  // 재성
      else if (stemElement === relations.controlled) score -= 5; // 관성
    }

    // 지지 분석 (지지는 영향력이 더 큼)
    if (pillar.jijiOheng) {
      const branchElement = pillar.jijiOheng as FiveElement;
      if (branchElement === relations.same) score += 10;       // 비겁
      else if (branchElement === relations.generated) score += 8; // 인성
      else if (branchElement === relations.generates) score -= 4; // 식상
      else if (branchElement === relations.controls) score -= 5;  // 재성
      else if (branchElement === relations.controlled) score -= 6; // 관성
    }
  }

  // 점수 범위 조정 및 판정
  score = Math.max(-100, Math.min(100, score));

  if (score >= 25) return "신강";
  if (score <= -25) return "신약";
  return "중화";
}

/**
 * 용신 추천 (억부론 기반)
 * - 신강: 나를 설기(洩氣)하거나 극제(剋制)하는 오행이 용신 (식상, 재성, 관성)
 * - 신약: 나를 생조(生助)하거나 같은 오행이 용신 (인성, 비겁)
 * - 중화: 사주에서 가장 부족한 오행 중 균형에 도움 되는 것
 */
function recommendYongsin(
  ilganElement: FiveElement,
  sinGangSinYak: "신강" | "신약" | "중화",
  ohengCount: OhengCount
): string {
  const relations = ELEMENT_RELATIONS[ilganElement];

  if (sinGangSinYak === "신강") {
    // 신강: 설기(식상) > 재성 > 관성 순으로 용신 선정
    // 단, 사주에 너무 많은 오행은 피함
    const candidates = [
      { element: relations.generates, priority: 1 },  // 식상 (설기)
      { element: relations.controls, priority: 2 },   // 재성
      { element: relations.controlled, priority: 3 }  // 관성
    ];

    // 사주에 가장 적은 것 우선
    candidates.sort((a, b) => {
      const countA = ohengCount[a.element];
      const countB = ohengCount[b.element];
      if (countA !== countB) return countA - countB;
      return a.priority - b.priority;
    });

    return candidates[0].element;
  } else if (sinGangSinYak === "신약") {
    // 신약: 인성 > 비겁 순으로 용신 선정
    const candidates = [
      { element: relations.generated, priority: 1 }, // 인성 (생조)
      { element: relations.same, priority: 2 }       // 비겁
    ];

    // 사주에 가장 적은 것 우선
    candidates.sort((a, b) => {
      const countA = ohengCount[a.element];
      const countB = ohengCount[b.element];
      if (countA !== countB) return countA - countB;
      return a.priority - b.priority;
    });

    return candidates[0].element;
  } else {
    // 중화: 사주의 균형을 위해 가장 부족한 오행
    const entries = Object.entries(ohengCount) as [FiveElement, number][];
    const sorted = [...entries].sort((a, b) => a[1] - b[1]);
    return sorted[0][0];
  }
}

/**
 * 사주팔자 계산 메인 함수
 */
// 60갑자 배열 (순서대로)
const GAPJA_60 = [
  "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
  "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
  "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
  "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
  "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
  "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해",
];

// 천간 합 관계
const CHEONGAN_HAP: Record<string, string> = {
  "갑": "기", "기": "갑",
  "을": "경", "경": "을",
  "병": "신", "신": "병",
  "정": "임", "임": "정",
  "무": "계", "계": "무",
};

// 천간 충 관계
const CHEONGAN_CHUNG: Record<string, string> = {
  "갑": "경", "경": "갑",
  "을": "신", "신": "을",
  "병": "임", "임": "병",
  "정": "계", "계": "정",
};

// 절기 데이터 (월별 절입 절기 - 월주가 바뀌는 절기)
// 각 월의 절입일은 해당 월의 시작을 의미 (예: 2월 절입 = 경칩 = 인월 시작)
const SOLAR_TERMS: Record<number, { name: string; day: number }> = {
  1: { name: "입춘", day: 4 },   // 인월(寅月) 시작
  2: { name: "경칩", day: 6 },   // 묘월(卯月) 시작
  3: { name: "청명", day: 5 },   // 진월(辰月) 시작
  4: { name: "입하", day: 6 },   // 사월(巳月) 시작
  5: { name: "망종", day: 6 },   // 오월(午月) 시작
  6: { name: "소서", day: 7 },   // 미월(未月) 시작
  7: { name: "입추", day: 8 },   // 신월(申月) 시작
  8: { name: "백로", day: 8 },   // 유월(酉月) 시작
  9: { name: "한로", day: 8 },   // 술월(戌月) 시작
  10: { name: "입동", day: 8 },  // 해월(亥月) 시작
  11: { name: "대설", day: 7 },  // 자월(子月) 시작
  12: { name: "소한", day: 6 },  // 축월(丑月) 시작
};

/**
 * 윤년 판별
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 특정 월의 일수 반환 (윤년 고려)
 */
function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
}

/**
 * 대운 순행/역행 결정
 * - 남자 + 년주 양간 → 순행
 * - 남자 + 년주 음간 → 역행
 * - 여자는 반대
 */
function isForwardDirection(yearCheongan: string, gender: "male" | "female"): boolean {
  const isYangGan = CHEONGAN_YINYANG[yearCheongan] === "양";
  const isMale = gender === "male";

  // 남자+양간 또는 여자+음간이면 순행
  return (isMale && isYangGan) || (!isMale && !isYangGan);
}

// 연도별 절기 날짜 타입 (supabase.ts에서 조회한 실제 절기 데이터)
export type TermDates = {
  current: Record<number, number>;  // { 월: 절입일 }
  prev: Record<number, number>;     // 이전 연도 절기 (1월 역행용)
};

/**
 * 실제 절입일 조회 (DB 데이터 우선, 없으면 평균값 fallback)
 */
function getTermDay(
  termDates: TermDates | undefined,
  year: number,
  month: number,
  birthYear: number
): number {
  // termDates가 있으면 실제 절기 데이터 사용
  if (termDates) {
    if (year === birthYear && termDates.current[month]) {
      return termDates.current[month];
    }
    if (year === birthYear - 1 && termDates.prev[month]) {
      return termDates.prev[month];
    }
  }
  // fallback: 평균 절기일
  return SOLAR_TERMS[month]?.day || 6;
}

/**
 * 다음/이전 절기까지의 일수 계산 (실제 절기 데이터 활용)
 *
 * 순행(順行): 생일 → 다음 절기까지의 일수
 * 역행(逆行): 생일 → 직전 절기까지의 일수 (과거로 거슬러 감)
 */
function getDaysToNextTerm(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  isForward: boolean,
  termDates?: TermDates
): number {
  const currentTermDay = getTermDay(termDates, birthYear, birthMonth, birthYear);

  if (isForward) {
    // 순행: 다음 절기까지의 일수
    const nextMonth = birthMonth === 12 ? 1 : birthMonth + 1;
    const nextYear = birthMonth === 12 ? birthYear + 1 : birthYear;
    const nextTermDay = getTermDay(termDates, nextYear, nextMonth, birthYear);

    // 현재 월의 남은 일수 (윤년 고려)
    const daysInCurrentMonth = getDaysInMonth(birthYear, birthMonth);
    const remainingDays = daysInCurrentMonth - birthDay;

    return remainingDays + nextTermDay;
  } else {
    // 역행: 직전 절기까지의 일수 (과거로 거슬러 감)

    if (birthDay >= currentTermDay) {
      // Case 1: 생일이 현재 월 절입일 이후
      // 직전 절기 = 현재 월 절입일
      return birthDay - currentTermDay;
    } else {
      // Case 2: 생일이 현재 월 절입일 이전
      // 직전 절기 = 이전 월 절입일
      const prevMonth = birthMonth === 1 ? 12 : birthMonth - 1;
      const prevYear = birthMonth === 1 ? birthYear - 1 : birthYear;
      const prevTermDay = getTermDay(termDates, prevYear, prevMonth, birthYear);

      // 이전 월의 일수 (윤년 고려)
      const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

      // 이전 월 절입일부터 이전 월 말까지의 일수
      const daysFromPrevTerm = daysInPrevMonth - prevTermDay;

      // 현재 월 1일부터 생일까지의 일수
      const daysInCurrentMonth = birthDay;

      return daysFromPrevTerm + daysInCurrentMonth;
    }
  }
}

/**
 * 대운 시작 나이 계산
 * 3일 = 1세로 환산
 */
function calculateDaeunStartAge(daysToTerm: number): number {
  // 최소 1세부터 시작, 최대 10세
  const startAge = Math.max(1, Math.min(10, Math.round(Math.abs(daysToTerm) / 3)));
  return startAge;
}

/**
 * 대운(大運) 계산
 */
export interface MajorFortuneInfo {
  startAge: number;
  endAge: number;
  ganji: string;
  cheongan: string;
  jiji: string;
  cheonganOheng: string;
  jijiOheng: string;
  element: string;  // 주요 오행 (천간 기준)
  interpretation?: string;
}

export function calculateMajorFortunes(
  yearCheongan: string,
  monthGanji: string,
  gender: "male" | "female",
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  termDates?: TermDates
): MajorFortuneInfo[] {
  const fortunes: MajorFortuneInfo[] = [];

  // 순행/역행 결정
  const isForward = isForwardDirection(yearCheongan, gender);

  // 다음/이전 절기까지 일수 계산 (실제 절기 데이터 활용)
  const daysToTerm = getDaysToNextTerm(birthYear, birthMonth, birthDay, isForward, termDates);

  // 대운 시작 나이
  const startAge = calculateDaeunStartAge(daysToTerm);

  // 월주 인덱스 찾기
  const monthIndex = GAPJA_60.indexOf(monthGanji);
  if (monthIndex === -1) {
    console.error("Invalid month ganji:", monthGanji);
    return fortunes;
  }

  // 8개의 대운 생성 (약 80년)
  for (let i = 0; i < 8; i++) {
    let daeunIndex: number;
    if (isForward) {
      daeunIndex = (monthIndex + i + 1) % 60;
    } else {
      daeunIndex = (monthIndex - i - 1 + 60) % 60;
    }

    const ganji = GAPJA_60[daeunIndex];
    const cheongan = ganji[0];
    const jiji = ganji[1];

    fortunes.push({
      startAge: startAge + (i * 10),
      endAge: startAge + ((i + 1) * 10) - 1,
      ganji,
      cheongan,
      jiji,
      cheonganOheng: CHEONGAN_OHENG[cheongan] || "",
      jijiOheng: JIJI_OHENG[jiji] || "",
      element: CHEONGAN_OHENG[cheongan] || "",
    });
  }

  return fortunes;
}

/**
 * 연운(年運) 계산
 */
export interface YearlyFortuneInfo {
  year: number;
  ganji: string;
  cheongan: string;
  jiji: string;
  cheonganOheng: string;
  jijiOheng: string;
  element: string;
  isHap: boolean;      // 일간과 합
  isChung: boolean;    // 일간과 충
  isYongsinYear: boolean; // 용신 오행의 해
  interpretation?: string;
}

/**
 * 연도를 60갑자로 변환
 */
function yearToGapja(year: number): string {
  const index = (year - 4) % 60;
  return GAPJA_60[index >= 0 ? index : index + 60];
}

/**
 * 입춘 기준 운세 연도 계산
 * 사주학에서 연도는 1월 1일이 아닌 입춘(보통 2월 4일경)을 기준으로 바뀜
 * @param date 기준 날짜
 * @param ipchunDay 해당 연도 입춘일 (기본값: 4일)
 * @returns 입춘 기준 연도
 */
export function getFortuneYear(
  date: Date = new Date(),
  ipchunDay: number = 4
): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-indexed
  const day = date.getDate();

  // 1월이면 무조건 이전 연도
  // 2월 1-3일이면 이전 연도, 2월 4일 이후면 현재 연도 (입춘일 기준)
  if (month === 1) {
    return year - 1;
  }
  if (month === 2 && day < ipchunDay) {
    return year - 1;
  }
  return year;
}

export function calculateYearlyFortunes(
  startYear: number,
  endYear: number,
  ilgan: string,  // 일간
  yongsin: string // 용신 오행
): YearlyFortuneInfo[] {
  const fortunes: YearlyFortuneInfo[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const ganji = yearToGapja(year);
    const cheongan = ganji[0];
    const jiji = ganji[1];
    const cheonganOheng = CHEONGAN_OHENG[cheongan] || "";
    const jijiOheng = JIJI_OHENG[jiji] || "";

    // 일간과의 합/충 관계
    const isHap = CHEONGAN_HAP[ilgan] === cheongan;
    const isChung = CHEONGAN_CHUNG[ilgan] === cheongan;

    // 용신 오행의 해인지
    const isYongsinYear = cheonganOheng === yongsin || jijiOheng === yongsin;

    fortunes.push({
      year,
      ganji,
      cheongan,
      jiji,
      cheonganOheng,
      jijiOheng,
      element: cheonganOheng,
      isHap,
      isChung,
      isYongsinYear,
    });
  }

  return fortunes;
}

export function calculateSaju(
  calendaData: CalendaData,
  birthHour: number,
  birthMinute: number,
  timeUnknown: boolean = false
): SajuApiResult {
  // 년주, 월주, 일주는 DB에서 가져옴
  const yearGanji = calendaData.cd_kyganjee || "";
  const monthGanji = calendaData.cd_kmganjee || "";
  const dayGanji = calendaData.cd_kdganjee || "";

  // 일간 추출
  const dayParsed = parseGanji(dayGanji);
  const ilgan = dayParsed?.cheongan || "";

  // 시주 계산
  const timeIndex = getTimeIndex(birthHour, birthMinute);
  const siCheongan = calculateSiganCheongan(ilgan, timeIndex);
  const siJiji = JIJI_LIST[timeIndex];
  const timeGanji = siCheongan + siJiji;

  // 각 기둥 생성 (pillarType을 전달하여 일주만 "본인"으로 표시)
  const yearPillar = createPillar(yearGanji, ilgan, "year");
  const monthPillar = createPillar(monthGanji, ilgan, "month");
  const dayPillar = createPillar(dayGanji, ilgan, "day");  // 일주의 천간만 "본인"
  const timePillar = timeUnknown
    ? createPillar("", ilgan, "hour")  // 시간 모름이면 빈 기둥
    : createPillar(timeGanji, ilgan, "hour");

  // 오행 카운트 (시간 입력 시 8글자 전체, 미입력 시 6글자만 사용)
  const pillarsForCount = timeUnknown
    ? [yearPillar, monthPillar, dayPillar]
    : [yearPillar, monthPillar, dayPillar, timePillar];
  const ohengCount = calculateOhengCount(pillarsForCount);

  // 일간 오행과 월지 추출
  const ilganElement = (dayPillar.cheonganOheng || "목") as FiveElement;
  const monthBranch = monthPillar.jiji || "";

  // 신강/신약 판정 (억부론 기반)
  const sinGangSinYak = calculateSinGangSinYak(pillarsForCount, ilganElement, monthBranch);

  // 용신 추천 (억부론 기반)
  const yongsin = recommendYongsin(ilganElement, sinGangSinYak, ohengCount);

  // 결과 반환
  return {
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar,
    ohengCount,
    yongsin,
    birthInfo: {
      solarYear: calendaData.cd_sy,
      solarMonth: calendaData.cd_sm,
      solarDay: calendaData.cd_sd,
      lunarYear: calendaData.cd_ly,
      lunarMonth: calendaData.cd_lm,
      lunarDay: calendaData.cd_ld,
      isLeapMonth: calendaData.cd_leap_month === 1,
      hour: birthHour,
      minute: birthMinute,
    },
    meta: {
      ddi: calendaData.cd_ddi || "",              // 입춘 기준 띠 (사주용)
      ddiLunar: getDdiByLunarYear(calendaData.cd_ly),  // 음력 기준 띠 (일반용)
      stars: calendaData.cd_stars || "",
      terms: calendaData.cd_kterms || "",
      weekday: calendaData.cd_kweek || "",
    }
  };
}
