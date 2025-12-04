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

/**
 * 용신 추천 (부족한 오행 기반)
 * - 없는 오행(0개)이 있으면 그것을 추천
 * - 없는 게 여러 개면 첫 번째
 * - 없는 게 없으면 가장 적은 오행 추천
 */
function recommendYongsin(ohengCount: OhengCount): string {
  const entries = Object.entries(ohengCount) as [string, number][];
  const sorted = [...entries].sort((a, b) => a[1] - b[1]);

  // 없는 오행(0개) 찾기
  const missing = sorted.filter(([_, count]) => count === 0);
  if (missing.length > 0) {
    return missing[0][0];  // 없는 오행 중 첫 번째
  }

  // 없는 게 없으면 가장 적은 오행
  return sorted[0][0];
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

/**
 * 다음/이전 절기까지의 일수 계산 (윤년 고려, calendaData 활용)
 *
 * 순행(順行): 생일 → 다음 절기까지의 일수
 * 역행(逆行): 생일 → 직전 절기까지의 일수 (과거로 거슬러 감)
 */
function getDaysToNextTerm(
  calendaData: CalendaData,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  isForward: boolean
): number {
  // calendaData에서 절기 정보 확인 (해당 날짜가 절기일 경우)
  // TODO: cd_kterms, cd_terms_time을 활용한 정밀 계산 구현 가능
  // 현재는 평균 절기일 기반으로 계산하되 윤년 처리 적용
  void calendaData; // 향후 정밀 계산용으로 예약

  const currentTermDay = SOLAR_TERMS[birthMonth]?.day || 6;

  if (isForward) {
    // 순행: 다음 절기까지의 일수
    // 다음 월의 절입일까지 계산
    const nextMonth = birthMonth === 12 ? 1 : birthMonth + 1;
    const nextTermDay = SOLAR_TERMS[nextMonth]?.day || 6;

    // 현재 월의 남은 일수 (윤년 고려)
    const daysInCurrentMonth = getDaysInMonth(birthYear, birthMonth);
    const remainingDays = daysInCurrentMonth - birthDay;

    return remainingDays + nextTermDay;
  } else {
    // 역행: 직전 절기까지의 일수 (과거로 거슬러 감)

    if (birthDay >= currentTermDay) {
      // Case 1: 생일이 현재 월 절입일 이후
      // 직전 절기 = 현재 월 절입일
      // 일수 = 생일 - 현재 월 절입일
      return birthDay - currentTermDay;
    } else {
      // Case 2: 생일이 현재 월 절입일 이전
      // 직전 절기 = 이전 월 절입일
      // 일수 = (이전 월 절입일 ~ 이전 월 말) + (현재 월 1일 ~ 생일)

      const prevMonth = birthMonth === 1 ? 12 : birthMonth - 1;
      const prevYear = birthMonth === 1 ? birthYear - 1 : birthYear;
      const prevTermDay = SOLAR_TERMS[prevMonth]?.day || 6;

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
  calendaData: CalendaData,
  yearCheongan: string,
  monthGanji: string,
  gender: "male" | "female",
  birthYear: number,
  birthMonth: number,
  birthDay: number
): MajorFortuneInfo[] {
  const fortunes: MajorFortuneInfo[] = [];

  // 순행/역행 결정
  const isForward = isForwardDirection(yearCheongan, gender);

  // 다음/이전 절기까지 일수 계산 (윤년 고려, calendaData 활용)
  const daysToTerm = getDaysToNextTerm(calendaData, birthYear, birthMonth, birthDay, isForward);

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

  // 용신 추천 (부족한 오행 기반)
  const yongsin = recommendYongsin(ohengCount);

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
