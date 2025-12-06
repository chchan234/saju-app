import { BirthHour, FamilyRelation, FiveElement, RelationshipStatus } from "@/types/saju";

// 시진 옵션 (12지지 기반 시간대)
export const BIRTH_HOUR_OPTIONS: { value: BirthHour; label: string; timeRange: string }[] = [
  { value: "unknown", label: "모름", timeRange: "" },
  { value: "23", label: "자시", timeRange: "23:30 ~ 01:29" },
  { value: "03", label: "축시", timeRange: "01:30 ~ 03:29" },
  { value: "05", label: "인시", timeRange: "03:30 ~ 05:29" },
  { value: "07", label: "묘시", timeRange: "05:30 ~ 07:29" },
  { value: "09", label: "진시", timeRange: "07:30 ~ 09:29" },
  { value: "11", label: "사시", timeRange: "09:30 ~ 11:29" },
  { value: "13", label: "오시", timeRange: "11:30 ~ 13:29" },
  { value: "15", label: "미시", timeRange: "13:30 ~ 15:29" },
  { value: "17", label: "신시", timeRange: "15:30 ~ 17:29" },
  { value: "19", label: "유시", timeRange: "17:30 ~ 19:29" },
  { value: "21", label: "술시", timeRange: "19:30 ~ 21:29" },
  { value: "23-2", label: "해시", timeRange: "21:30 ~ 23:29" },
];

// 가족 관계 옵션
export const FAMILY_RELATION_OPTIONS: { value: FamilyRelation; label: string }[] = [
  { value: "me", label: "본인" },
  { value: "spouse", label: "배우자" },
  { value: "parent", label: "부모" },
  { value: "grandparent", label: "조부모" },
  { value: "sibling", label: "형제/자매" },
  { value: "child", label: "자녀" },
  { value: "relative", label: "친척" },
  { value: "other", label: "기타" },
];

// 천간 (10간)
export const HEAVENLY_STEMS = {
  hanja: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const,
  korean: ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"] as const,
  elements: ["wood", "wood", "fire", "fire", "earth", "earth", "metal", "metal", "water", "water"] as FiveElement[],
};

// 지지 (12지)
export const EARTHLY_BRANCHES = {
  hanja: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const,
  korean: ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"] as const,
  animals: ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"] as const,
  elements: ["water", "earth", "wood", "wood", "earth", "fire", "fire", "earth", "metal", "metal", "earth", "water"] as FiveElement[],
};

// 오행
export const FIVE_ELEMENTS = {
  keys: ["wood", "fire", "earth", "metal", "water"] as FiveElement[],
  korean: ["목", "화", "토", "금", "수"] as const,
  hanja: ["木", "火", "土", "金", "水"] as const,
  colors: {
    wood: "#2E7D32",
    fire: "#C62828",
    earth: "#F9A825",
    metal: "#757575",
    water: "#1565C0",
  },
  bgColors: {
    wood: "bg-green-600",
    fire: "bg-red-700",
    earth: "bg-yellow-600",
    metal: "bg-gray-500",
    water: "bg-blue-700",
  },
};

// 십신 (10개의 신)
export const TEN_GODS = {
  names: ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"] as const,
  categories: {
    비겁: ["비견", "겁재"],
    식상: ["식신", "상관"],
    재성: ["편재", "정재"],
    관성: ["편관", "정관"],
    인성: ["편인", "정인"],
  },
};

// 24절기
export const SOLAR_TERMS = {
  hanja: [
    "立春", "雨水", "驚蟄", "春分", "淸明", "穀雨",
    "立夏", "小滿", "芒種", "夏至", "小暑", "大暑",
    "立秋", "處暑", "白露", "秋分", "寒露", "霜降",
    "立冬", "小雪", "大雪", "冬至", "小寒", "大寒",
  ] as const,
  korean: [
    "입춘", "우수", "경칩", "춘분", "청명", "곡우",
    "입하", "소만", "망종", "하지", "소서", "대서",
    "입추", "처서", "백로", "추분", "한로", "상강",
    "입동", "소설", "대설", "동지", "소한", "대한",
  ] as const,
};

// 년도 범위
export const YEAR_RANGE = {
  min: 1900,
  max: 2100,
};

// ============================================
// 영어 → 한글 변환 함수들
// ============================================

/**
 * 오행 영어를 한글로 변환
 * @param element - 영어 오행 (wood, fire, earth, metal, water)
 * @returns 한글 오행 (목, 화, 토, 금, 수)
 */
export function fiveElementToKorean(element: FiveElement | string): string {
  const map: Record<string, string> = {
    wood: "목",
    fire: "화",
    earth: "토",
    metal: "금",
    water: "수",
  };
  return map[element] || element;
}

/**
 * 관계 상태 영어를 한글로 변환
 * @param status - 영어 관계 상태 (solo, dating, married, divorced)
 * @returns 한글 관계 상태
 */
export function relationshipStatusToKorean(status: RelationshipStatus | string): string {
  const map: Record<string, string> = {
    solo: "솔로",
    dating: "연애 중",
    married: "기혼",
    divorced: "이혼/사별",
  };
  return map[status] || status;
}

/**
 * 직업 상태 영어를 한글로 변환
 * @param status - 영어 직업 상태
 * @returns 한글 직업 상태
 */
export function occupationStatusToKorean(status: string): string {
  const map: Record<string, string> = {
    student: "학생",
    jobseeker: "취업준비생",
    employee: "직장인",
    business: "사업자",
    freelance: "프리랜서",
    homemaker: "전업주부",
  };
  return map[status] || status;
}

/**
 * 성별 영어를 한글로 변환
 * @param gender - 영어 성별 (male, female)
 * @returns 한글 성별
 */
export function genderToKorean(gender: string): string {
  const map: Record<string, string> = {
    male: "남성",
    female: "여성",
  };
  return map[gender] || gender;
}

// ============================================
// 자연스러운 한국어 조사 처리 함수들
// ============================================

/**
 * 받침 유무 확인 (한글 문자의 마지막 받침 존재 여부)
 * @param char - 검사할 한글 문자
 * @returns 받침이 있으면 true, 없으면 false
 */
function hasFinalConsonant(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (code < 0xAC00 || code > 0xD7A3) return false;
  // 종성(받침) 확인: (code - 0xAC00) % 28 !== 0 이면 받침 있음
  return (code - 0xAC00) % 28 !== 0;
}

/**
 * 단어의 마지막 글자 기준 받침 유무 확인
 * @param word - 검사할 단어
 * @returns 받침이 있으면 true
 */
function hasWordFinalConsonant(word: string): boolean {
  if (!word) return false;
  // 숫자, 영어 등의 경우 특수 처리
  const lastChar = word[word.length - 1];

  // 숫자인 경우
  if (/[0-9]/.test(lastChar)) {
    // 0,1,3,6,7,8 = 받침 있음 / 2,4,5,9 = 받침 없음
    return ['0', '1', '3', '6', '7', '8'].includes(lastChar);
  }

  // 영어인 경우 (대부분 받침 있음으로 처리, 모음으로 끝나면 없음)
  if (/[a-zA-Z]/.test(lastChar)) {
    return !['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'].includes(lastChar);
  }

  return hasFinalConsonant(lastChar);
}

/**
 * 적절한 조사 선택
 * @param word - 앞에 오는 단어
 * @param particlePair - 조사 쌍 (예: "이/가", "은/는", "을/를", "과/와", "으로/로")
 * @returns 적절한 조사
 */
export function getParticle(word: string, particlePair: string): string {
  const [withConsonant, withoutConsonant] = particlePair.split('/');
  return hasWordFinalConsonant(word) ? withConsonant : withoutConsonant;
}

/**
 * 단어에 적절한 조사를 붙여서 반환
 * @param word - 단어
 * @param particlePair - 조사 쌍
 * @returns 단어 + 조사
 */
export function addParticle(word: string, particlePair: string): string {
  return word + getParticle(word, particlePair);
}

/**
 * 오행 이름에 맞는 자연스러운 문장 생성
 * @param element - 오행 (목, 화, 토, 금, 수)
 * @param strength - 상태 (과다, 적정, 부족, 없음)
 * @returns 자연스러운 문장
 */
export function getElementStrengthDescription(element: string, strength: string): string {
  const hanjaMap: Record<string, string> = {
    목: "木", 화: "火", 토: "土", 금: "金", 수: "水"
  };
  const hanja = hanjaMap[element] || "";

  switch (strength) {
    case "과다":
      return `${element}(${hanja})의 기운이 넘치는 편입니다`;
    case "부족":
      return `${element}(${hanja}) 기운이 다소 약한 편입니다`;
    case "없음":
      return `${element}(${hanja}) 기운이 사주에 보이지 않습니다`;
    case "적정":
    default:
      return `${element}(${hanja}) 기운이 적절하게 갖춰져 있습니다`;
  }
}
