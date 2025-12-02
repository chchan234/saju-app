import { BirthHour, FamilyRelation, FiveElement } from "@/types/saju";

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
