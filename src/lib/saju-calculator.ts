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
 */
export function getTimeIndex(hour: number, minute: number): number {
  // 자시: 23:00-01:00 (0)
  // 축시: 01:00-03:00 (1)
  // 인시: 03:00-05:00 (2)
  // ...
  const totalMinutes = hour * 60 + minute;

  if (totalMinutes >= 23 * 60 || totalMinutes < 1 * 60) return 0;  // 자시
  if (totalMinutes < 3 * 60) return 1;   // 축시
  if (totalMinutes < 5 * 60) return 2;   // 인시
  if (totalMinutes < 7 * 60) return 3;   // 묘시
  if (totalMinutes < 9 * 60) return 4;   // 진시
  if (totalMinutes < 11 * 60) return 5;  // 사시
  if (totalMinutes < 13 * 60) return 6;  // 오시
  if (totalMinutes < 15 * 60) return 7;  // 미시
  if (totalMinutes < 17 * 60) return 8;  // 신시
  if (totalMinutes < 19 * 60) return 9;  // 유시
  if (totalMinutes < 21 * 60) return 10; // 술시
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
function createPillar(ganji: string, ilgan?: string): Pillar {
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
    result.cheonganSipsin = SIPSIN_MAP[ilgan]?.[parsed.cheongan];
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

  // 각 기둥 생성
  const yearPillar = createPillar(yearGanji, ilgan);
  const monthPillar = createPillar(monthGanji, ilgan);
  const dayPillar = createPillar(dayGanji, ilgan);  // 일주도 십신 계산 필요
  const timePillar = timeUnknown
    ? createPillar("", ilgan)  // 시간 모름이면 빈 기둥
    : createPillar(timeGanji, ilgan);

  // 오행 카운트 (시간 모름이면 시주 제외)
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
