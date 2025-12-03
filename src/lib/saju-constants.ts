import {
  TreeDeciduous,
  Flame,
  Mountain,
  Coins,
  Droplets,
  type LucideIcon,
} from "lucide-react";

// ============================================
// 오행(五行) 통합 상수
// ============================================

export type Oheng = "목" | "화" | "토" | "금" | "수";

export interface OhengStyle {
  // 배경색
  bg: string;
  bgLight: string;
  bgSubtle: string;
  bgDark: string;

  // 테두리
  border: string;
  borderDark: string;

  // 텍스트
  text: string;
  textDark: string;

  // 차트용 HEX
  hex: string;

  // 이모지 & 아이콘
  emoji: string;
  icon: LucideIcon;

  // 한자
  hanja: string;
}

/**
 * 오행 통합 색상 시스템
 * 모든 컴포넌트에서 이 상수를 import하여 사용
 */
export const OHENG: Record<Oheng, OhengStyle> = {
  목: {
    bg: "bg-green-600",
    bgLight: "bg-green-100",
    bgSubtle: "bg-green-50",
    bgDark: "dark:bg-green-950/30",
    border: "border-green-300",
    borderDark: "dark:border-green-700",
    text: "text-green-700",
    textDark: "dark:text-green-400",
    hex: "#16a34a",
    emoji: "🌳",
    icon: TreeDeciduous,
    hanja: "木",
  },
  화: {
    bg: "bg-red-600",
    bgLight: "bg-red-100",
    bgSubtle: "bg-red-50",
    bgDark: "dark:bg-red-950/30",
    border: "border-red-300",
    borderDark: "dark:border-red-700",
    text: "text-red-700",
    textDark: "dark:text-red-400",
    hex: "#dc2626",
    emoji: "🔥",
    icon: Flame,
    hanja: "火",
  },
  토: {
    bg: "bg-yellow-600",
    bgLight: "bg-yellow-100",
    bgSubtle: "bg-yellow-50",
    bgDark: "dark:bg-yellow-950/30",
    border: "border-yellow-400",
    borderDark: "dark:border-yellow-700",
    text: "text-yellow-700",
    textDark: "dark:text-yellow-400",
    hex: "#ca8a04",
    emoji: "⛰️",
    icon: Mountain,
    hanja: "土",
  },
  금: {
    bg: "bg-slate-400",
    bgLight: "bg-slate-100",
    bgSubtle: "bg-slate-50",
    bgDark: "dark:bg-slate-950/30",
    border: "border-slate-300",
    borderDark: "dark:border-slate-700",
    text: "text-slate-600",
    textDark: "dark:text-slate-400",
    hex: "#94a3b8",
    emoji: "🪙",
    icon: Coins,
    hanja: "金",
  },
  수: {
    bg: "bg-blue-600",
    bgLight: "bg-blue-100",
    bgSubtle: "bg-blue-50",
    bgDark: "dark:bg-blue-950/30",
    border: "border-blue-300",
    borderDark: "dark:border-blue-700",
    text: "text-blue-700",
    textDark: "dark:text-blue-400",
    hex: "#2563eb",
    emoji: "💧",
    icon: Droplets,
    hanja: "水",
  },
} as const;

// 헬퍼 함수들
export const getOhengBg = (oheng: Oheng) => OHENG[oheng].bg;
export const getOhengText = (oheng: Oheng) => OHENG[oheng].text;
export const getOhengHex = (oheng: Oheng) => OHENG[oheng].hex;
export const getOhengEmoji = (oheng: Oheng) => OHENG[oheng].emoji;
export const getOhengHanja = (oheng: Oheng) => OHENG[oheng].hanja;

// 조합 클래스 생성 헬퍼
export const getOhengBadgeClass = (oheng: Oheng) =>
  `${OHENG[oheng].bgLight} ${OHENG[oheng].border} ${OHENG[oheng].text}`;

export const getOhengCardClass = (oheng: Oheng) =>
  `${OHENG[oheng].bgSubtle} ${OHENG[oheng].bgDark} ${OHENG[oheng].border}`;

// 오행 유효성 검사
export const isValidOheng = (value: string): value is Oheng =>
  ["목", "화", "토", "금", "수"].includes(value);

// ============================================
// 카드 테마 (도메인별 그라데이션)
// ============================================

export interface CardThemeStyle {
  gradient: string;
  accent: string;
  iconBg: string;
}

export const CARD_THEMES = {
  // 사주 기본
  saju: {
    gradient: "from-[#5C544A] via-[#8E7F73] to-[#D4C5B0]",
    accent: "#8E7F73",
    iconBg: "bg-[#F5F1E6] dark:bg-[#2C2824]",
  },

  // 대운 (10년 운세)
  daeun: {
    gradient: "from-purple-500 to-indigo-500",
    accent: "#8b5cf6",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
  },

  // 연운 (매년 운세)
  yeonun: {
    gradient: "from-amber-400 to-orange-500",
    accent: "#f59e0b",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
  },

  // 운세 흐름 (통합 그래프)
  fortuneFlow: {
    gradient: "from-emerald-500 via-blue-500 to-purple-500",
    accent: "#10b981",
    iconBg:
      "bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30",
  },

  // 조후 (계절 분석)
  johu: {
    gradient: "from-orange-400 to-yellow-400",
    accent: "#f97316",
    iconBg: "bg-orange-100 dark:bg-orange-950/30",
  },

  // 신살
  sinsal: {
    gradient: "from-violet-500 to-purple-500",
    accent: "#8b5cf6",
    iconBg: "bg-violet-100 dark:bg-violet-950/30",
  },

  // 인간관계
  relationship: {
    gradient: "from-pink-500 to-rose-500",
    accent: "#ec4899",
    iconBg: "bg-pink-100 dark:bg-pink-950/30",
  },

  // 직업/적성
  career: {
    gradient: "from-cyan-500 to-blue-500",
    accent: "#06b6d4",
    iconBg: "bg-cyan-100 dark:bg-cyan-950/30",
  },

  // 십신
  sipsin: {
    gradient: "from-[#5C544A] via-[#8E7F73] to-[#D4C5B0]",
    accent: "#8E7F73",
    iconBg: "bg-[#F5F1E6] dark:bg-[#2C2824]",
  },

  // 건강
  health: {
    gradient: "from-emerald-500 to-teal-500",
    accent: "#10b981",
    iconBg: "bg-emerald-100 dark:bg-emerald-950/30",
  },

  // 재물
  wealth: {
    gradient: "from-amber-500 to-yellow-500",
    accent: "#f59e0b",
    iconBg: "bg-amber-100 dark:bg-amber-950/30",
  },

  // 스토리텔링/자연 프로필
  nature: {
    gradient: "from-[#8E7F73] via-[#BFA588] to-[#8E7F73]",
    accent: "#8E7F73",
    iconBg: "bg-white/50 dark:bg-black/20",
  },

  // 인생 단계
  lifePhase: {
    gradient: "from-[#6B8E7F] via-[#7DA28F] to-[#6B8E7F]",
    accent: "#6B8E7F",
    iconBg: "bg-[#F5F1E6] dark:bg-[#2C2824]",
  },

  // 인생 여정
  lifeJourney: {
    gradient: "from-[#8E7F73] via-[#BFA588] to-[#6B8E7F]",
    accent: "#8E7F73",
    iconBg: "bg-[#F5F1E6] dark:bg-[#2C2824]",
  },

  // 키워드
  keywords: {
    gradient: "from-[#BFA588] via-[#8E7F73] to-[#BFA588]",
    accent: "#BFA588",
    iconBg: "bg-[#F5F1E6] dark:bg-[#2C2824]",
  },

  // 오행 보완
  ohengBooster: {
    gradient: "from-teal-500 to-emerald-500",
    accent: "#14b8a6",
    iconBg: "bg-teal-100 dark:bg-teal-950/30",
  },

  // 격국
  geokguk: {
    gradient: "from-indigo-500 to-purple-600",
    accent: "#6366f1",
    iconBg: "bg-indigo-100 dark:bg-indigo-950/30",
  },
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

// 카드 테마 헬퍼
export const getCardTheme = (theme: CardTheme): CardThemeStyle =>
  CARD_THEMES[theme];

// ============================================
// 공통 UI 색상
// ============================================

export const UI_COLORS = {
  // 기본 배경
  cardBg: "bg-white/80 dark:bg-stone-900/80",
  sectionBg: "bg-[#F9F7F2] dark:bg-[#2C2824]",
  subtleBg: "bg-stone-50 dark:bg-stone-800/50",

  // 테두리
  cardBorder: "border-[#E8DCC4] dark:border-[#3E3832]",
  sectionBorder: "border-[#D4C5B0] dark:border-[#5C544A]",

  // 텍스트
  primary: "text-[#5C544A] dark:text-[#D4C5B0]",
  secondary: "text-[#8E7F73]",
  accent: "text-[#BFA588]",
} as const;

// ============================================
// 길흉 레벨 스타일
// ============================================

export const FORTUNE_LEVEL_STYLES = {
  최길: {
    badge: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white",
    emoji: "🌟",
  },
  길: {
    badge: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
    emoji: "✨",
  },
  평: {
    badge: "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800",
    emoji: "⚖️",
  },
  흉: {
    badge: "bg-gradient-to-r from-orange-400 to-orange-500 text-white",
    emoji: "⚡",
  },
  최흉: {
    badge: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    emoji: "🌪️",
  },
} as const;

export type FortuneLevel = keyof typeof FORTUNE_LEVEL_STYLES;

export const getFortuneStyle = (level: FortuneLevel) =>
  FORTUNE_LEVEL_STYLES[level];
