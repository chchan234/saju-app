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

// ============================================
// 천간(天干) 통합 상수 - 전문가모드용
// ============================================

export type CheonganKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";
export type CheonganHanja = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";

export interface CheonganInfo {
  korean: CheonganKr;
  hanja: CheonganHanja;
  oheng: Oheng;
  yinYang: "양" | "음";
  nature: string; // 자연물 비유
  characteristics: string; // 성격 특성
  bodyPart: string; // 신체 부위
}

export const CHEONGAN: Record<CheonganHanja, CheonganInfo> = {
  "甲": {
    korean: "갑",
    hanja: "甲",
    oheng: "목",
    yinYang: "양",
    nature: "큰 나무, 대들보, 소나무",
    characteristics: "진취적, 리더십, 강직함, 개척 정신",
    bodyPart: "머리, 담낭",
  },
  "乙": {
    korean: "을",
    hanja: "乙",
    oheng: "목",
    yinYang: "음",
    nature: "화초, 덩굴, 풀",
    characteristics: "유연함, 적응력, 섬세함, 예술성",
    bodyPart: "목, 간",
  },
  "丙": {
    korean: "병",
    hanja: "丙",
    oheng: "화",
    yinYang: "양",
    nature: "태양, 큰 불",
    characteristics: "열정적, 밝음, 적극성, 명예욕",
    bodyPart: "어깨, 소장",
  },
  "丁": {
    korean: "정",
    hanja: "丁",
    oheng: "화",
    yinYang: "음",
    nature: "촛불, 등불, 달빛",
    characteristics: "섬세함, 문학적 감성, 인내, 배려",
    bodyPart: "가슴, 심장",
  },
  "戊": {
    korean: "무",
    hanja: "戊",
    oheng: "토",
    yinYang: "양",
    nature: "산, 제방, 큰 바위",
    characteristics: "신뢰감, 묵직함, 포용력, 중재력",
    bodyPart: "코, 위장",
  },
  "己": {
    korean: "기",
    hanja: "己",
    oheng: "토",
    yinYang: "음",
    nature: "논밭, 정원, 비옥한 땅",
    characteristics: "실용적, 꼼꼼함, 생산성, 모성애",
    bodyPart: "배, 비장",
  },
  "庚": {
    korean: "경",
    hanja: "庚",
    oheng: "금",
    yinYang: "양",
    nature: "바위, 철, 칼",
    characteristics: "결단력, 의리, 강인함, 정의감",
    bodyPart: "대장, 뼈",
  },
  "辛": {
    korean: "신",
    hanja: "辛",
    oheng: "금",
    yinYang: "음",
    nature: "보석, 귀금속, 바늘",
    characteristics: "예민함, 완벽주의, 우아함, 예리함",
    bodyPart: "폐, 피부",
  },
  "壬": {
    korean: "임",
    hanja: "壬",
    oheng: "수",
    yinYang: "양",
    nature: "바다, 큰 강, 호수",
    characteristics: "지혜로움, 포용력, 융통성, 깊이",
    bodyPart: "신장, 방광",
  },
  "癸": {
    korean: "계",
    hanja: "癸",
    oheng: "수",
    yinYang: "음",
    nature: "비, 이슬, 샘물",
    characteristics: "직관력, 감수성, 적응력, 영성",
    bodyPart: "생식기, 혈액",
  },
} as const;

// 한글 천간으로 정보 조회
export const CHEONGAN_KR: Record<CheonganKr, CheonganInfo> = {
  "갑": CHEONGAN["甲"],
  "을": CHEONGAN["乙"],
  "병": CHEONGAN["丙"],
  "정": CHEONGAN["丁"],
  "무": CHEONGAN["戊"],
  "기": CHEONGAN["己"],
  "경": CHEONGAN["庚"],
  "신": CHEONGAN["辛"],
  "임": CHEONGAN["壬"],
  "계": CHEONGAN["癸"],
} as const;

// ============================================
// 지지(地支) 통합 상수 - 전문가모드용
// ============================================

export type JijiKr = "자" | "축" | "인" | "묘" | "진" | "사" | "오" | "미" | "신" | "유" | "술" | "해";
export type JijiHanja = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";

export interface JijiInfo {
  korean: JijiKr;
  hanja: JijiHanja;
  oheng: Oheng;
  yinYang: "양" | "음";
  animal: string;
  month: number; // 해당 월 (음력 기준)
  hour: string; // 해당 시간대
  direction: string; // 방위
  season: string; // 계절
  characteristics: string;
}

export const JIJI: Record<JijiHanja, JijiInfo> = {
  "子": {
    korean: "자",
    hanja: "子",
    oheng: "수",
    yinYang: "양",
    animal: "쥐",
    month: 11,
    hour: "23:30~01:29",
    direction: "북",
    season: "한겨울",
    characteristics: "지혜, 민첩함, 번식력, 새로운 시작",
  },
  "丑": {
    korean: "축",
    hanja: "丑",
    oheng: "토",
    yinYang: "음",
    animal: "소",
    month: 12,
    hour: "01:30~03:29",
    direction: "북동",
    season: "늦겨울",
    characteristics: "근면, 인내, 신뢰, 묵묵함",
  },
  "寅": {
    korean: "인",
    hanja: "寅",
    oheng: "목",
    yinYang: "양",
    animal: "호랑이",
    month: 1,
    hour: "03:30~05:29",
    direction: "동북",
    season: "이른 봄",
    characteristics: "용맹, 권위, 독립심, 리더십",
  },
  "卯": {
    korean: "묘",
    hanja: "卯",
    oheng: "목",
    yinYang: "음",
    animal: "토끼",
    month: 2,
    hour: "05:30~07:29",
    direction: "동",
    season: "봄",
    characteristics: "온순함, 예술성, 민감함, 평화",
  },
  "辰": {
    korean: "진",
    hanja: "辰",
    oheng: "토",
    yinYang: "양",
    animal: "용",
    month: 3,
    hour: "07:30~09:29",
    direction: "동남",
    season: "늦봄",
    characteristics: "권위, 변화, 신비, 성공욕",
  },
  "巳": {
    korean: "사",
    hanja: "巳",
    oheng: "화",
    yinYang: "음",
    animal: "뱀",
    month: 4,
    hour: "09:30~11:29",
    direction: "남동",
    season: "초여름",
    characteristics: "지혜, 직관력, 신중함, 통찰",
  },
  "午": {
    korean: "오",
    hanja: "午",
    oheng: "화",
    yinYang: "양",
    animal: "말",
    month: 5,
    hour: "11:30~13:29",
    direction: "남",
    season: "한여름",
    characteristics: "열정, 활동성, 자유로움, 명예",
  },
  "未": {
    korean: "미",
    hanja: "未",
    oheng: "토",
    yinYang: "음",
    animal: "양",
    month: 6,
    hour: "13:30~15:29",
    direction: "남서",
    season: "늦여름",
    characteristics: "온순함, 예술성, 희생정신, 섬세함",
  },
  "申": {
    korean: "신",
    hanja: "申",
    oheng: "금",
    yinYang: "양",
    animal: "원숭이",
    month: 7,
    hour: "15:30~17:29",
    direction: "서남",
    season: "초가을",
    characteristics: "영리함, 재치, 융통성, 호기심",
  },
  "酉": {
    korean: "유",
    hanja: "酉",
    oheng: "금",
    yinYang: "음",
    animal: "닭",
    month: 8,
    hour: "17:30~19:29",
    direction: "서",
    season: "가을",
    characteristics: "정확함, 꼼꼼함, 근면, 예리함",
  },
  "戌": {
    korean: "술",
    hanja: "戌",
    oheng: "토",
    yinYang: "양",
    animal: "개",
    month: 9,
    hour: "19:30~21:29",
    direction: "서북",
    season: "늦가을",
    characteristics: "충성심, 정의감, 보호본능, 직관",
  },
  "亥": {
    korean: "해",
    hanja: "亥",
    oheng: "수",
    yinYang: "음",
    animal: "돼지",
    month: 10,
    hour: "21:30~23:29",
    direction: "북서",
    season: "초겨울",
    characteristics: "복덕, 관대함, 정직함, 풍요",
  },
} as const;

// 한글 지지로 정보 조회
export const JIJI_KR: Record<JijiKr, JijiInfo> = {
  "자": JIJI["子"],
  "축": JIJI["丑"],
  "인": JIJI["寅"],
  "묘": JIJI["卯"],
  "진": JIJI["辰"],
  "사": JIJI["巳"],
  "오": JIJI["午"],
  "미": JIJI["未"],
  "신": JIJI["申"],
  "유": JIJI["酉"],
  "술": JIJI["戌"],
  "해": JIJI["亥"],
} as const;

// ============================================
// 사주 기둥(柱) 설명 상수 - 전문가모드용
// ============================================

export interface PillarInfo {
  name: string;
  hanja: string;
  represents: string[];
  lifeStage: string;
  ageRange: string;
  symbolism: string;
  detailedMeaning: string;
}

export const PILLARS: Record<"year" | "month" | "day" | "hour", PillarInfo> = {
  year: {
    name: "년주",
    hanja: "年柱",
    represents: ["조상", "윗사람", "사회적 환경", "국가", "기업"],
    lifeStage: "유년기",
    ageRange: "0~15세",
    symbolism: "뿌리와 기반, 가문과 혈통",
    detailedMeaning: "년주는 조상으로부터 물려받은 기운과 사회적 배경을 나타냅니다. 어린 시절의 환경과 가정의 분위기, 부모님의 사회적 위치 등이 반영됩니다. 또한 평생 동안 사회와 맺는 관계의 기본 틀을 보여줍니다.",
  },
  month: {
    name: "월주",
    hanja: "月柱",
    represents: ["부모", "형제", "직장 상사", "사회적 활동"],
    lifeStage: "청년기",
    ageRange: "16~30세",
    symbolism: "줄기와 성장, 사회로 나아가는 힘",
    detailedMeaning: "월주는 부모와 형제의 인연, 그리고 청년기의 사회 진출을 나타냅니다. 직업 선택과 사회생활의 방향성, 상사나 선배와의 관계 등이 드러납니다. 월령(月令)은 사주의 기운을 판단하는 가장 중요한 기준이 됩니다.",
  },
  day: {
    name: "일주",
    hanja: "日柱",
    represents: ["본인", "배우자", "가정", "내면"],
    lifeStage: "중년기",
    ageRange: "31~45세",
    symbolism: "꽃과 열매, 자아와 가정",
    detailedMeaning: "일주는 사주의 핵심으로, 일간(日干)은 바로 나 자신입니다. 일지(日支)는 배우자와 가정을 상징합니다. 중년기의 활동과 결혼 생활, 그리고 내면의 진정한 성격이 이 기둥에 담겨 있습니다. 모든 십신은 일간을 기준으로 계산됩니다.",
  },
  hour: {
    name: "시주",
    hanja: "時柱",
    represents: ["자녀", "제자", "아랫사람", "말년"],
    lifeStage: "노년기",
    ageRange: "46세 이후",
    symbolism: "열매와 결실, 다음 세대",
    detailedMeaning: "시주는 자녀와 말년의 삶을 나타냅니다. 자녀와의 관계, 후배나 제자와의 인연, 그리고 인생 후반부의 성취와 여유를 보여줍니다. 시주가 좋으면 말년이 편안하고, 자녀 복이 있습니다.",
  },
} as const;

// ============================================
// 십신(十神) 상세 설명 상수 - 전문가모드용
// ============================================

export type SipsinName = "비견" | "겁재" | "식신" | "상관" | "편재" | "정재" | "편관" | "정관" | "편인" | "정인";
export type SipsinGroup = "비겁" | "식상" | "재성" | "관성" | "인성";

export interface SipsinInfo {
  name: SipsinName;
  hanja: string;
  group: SipsinGroup;
  relation: string; // 오행 관계
  basicMeaning: string;
  positiveTraits: string[];
  negativeTraits: string[];
  symbolism: string;
  maleInterpretation: string;
  femaleInterpretation: string;
}

export const SIPSIN: Record<SipsinName, SipsinInfo> = {
  "비견": {
    name: "비견",
    hanja: "比肩",
    group: "비겁",
    relation: "나와 같은 오행, 같은 음양",
    basicMeaning: "어깨를 나란히 하는 동료, 형제, 친구, 경쟁자를 상징합니다.",
    positiveTraits: ["독립심", "자주성", "협력 능력", "동료와의 유대", "자존감"],
    negativeTraits: ["고집", "경쟁심 과다", "분쟁", "재물 분산", "타협 어려움"],
    symbolism: "함께 가는 동반자이자 때로는 경쟁 상대입니다. 나와 같은 기운이므로 힘이 되기도, 부딪히기도 합니다.",
    maleInterpretation: "형제, 친구, 사업 동료를 나타냅니다. 비견이 많으면 독립심이 강하고, 남에게 기대지 않으려 합니다. 다만 혼자 하려는 경향이 강해 협력이 필요한 상황에서 어려움을 겪을 수 있습니다.",
    femaleInterpretation: "자매, 친구, 경쟁 여성을 나타냅니다. 비견이 많으면 자립심이 강하고 사회 활동에 적극적입니다. 배우자와의 관계에서 주도권을 가지려 할 수 있어, 상호 존중이 중요합니다.",
  },
  "겁재": {
    name: "겁재",
    hanja: "劫財",
    group: "비겁",
    relation: "나와 같은 오행, 다른 음양",
    basicMeaning: "재물을 빼앗는다는 의미로, 형제나 친구 중에서도 다툼과 경쟁의 관계입니다.",
    positiveTraits: ["추진력", "결단력", "투쟁심", "적극성", "승부욕"],
    negativeTraits: ["재물 손실", "다툼", "배신", "과격함", "충동적"],
    symbolism: "경쟁과 분쟁의 에너지입니다. 강한 추진력이 되기도 하지만, 조절하지 못하면 손실을 가져옵니다.",
    maleInterpretation: "의형제, 친구 중 갈등 관계를 나타냅니다. 겁재가 강하면 추진력은 있으나 재물 관리에 주의가 필요합니다. 투자나 보증에 신중해야 하며, 동업보다는 단독 사업이 맞습니다.",
    femaleInterpretation: "친구나 동료 중 갈등 관계를 나타냅니다. 겁재가 강하면 사회적으로 활동적이지만, 이성 문제에서 경쟁자가 생길 수 있습니다. 배우자와의 신뢰 관계를 잘 유지하는 것이 중요합니다.",
  },
  "식신": {
    name: "식신",
    hanja: "食神",
    group: "식상",
    relation: "내가 생하는 오행, 같은 음양",
    basicMeaning: "내가 만들어낸 결과물입니다. 요리사가 음식을 만들듯, 내 에너지를 표현하고 생산하는 능력입니다.",
    positiveTraits: ["창의력", "표현력", "여유로움", "낙천적 성격", "재능"],
    negativeTraits: ["게으름", "방탕", "과식", "현실 안주", "나태"],
    symbolism: "복록(福祿)의 별입니다. 먹고 사는 문제를 해결하고, 삶의 즐거움을 누리는 에너지입니다.",
    maleInterpretation: "부하직원, 아랫사람, 할머니(외가)를 상징합니다. 식신이 있으면 먹는 복이 있고 창작 활동에 재능이 있습니다. 요리, 글쓰기, 예술 분야에서 능력을 발휘할 수 있습니다.",
    femaleInterpretation: "자녀, 특히 딸을 상징합니다. 출산과 양육의 에너지이며 자녀복을 나타냅니다. 식신이 좋은 위치에 있으면 순산하고, 자녀와의 관계가 원만합니다.",
  },
  "상관": {
    name: "상관",
    hanja: "傷官",
    group: "식상",
    relation: "내가 생하는 오행, 다른 음양",
    basicMeaning: "정관을 상하게 한다는 의미입니다. 표현력과 재능이 뛰어나지만 반항심과 비판 정신도 강합니다.",
    positiveTraits: ["뛰어난 재능", "언변", "예술성", "자유분방", "창의적 사고"],
    negativeTraits: ["반항", "관재구설", "불손", "이기적", "권위 부정"],
    symbolism: "관(정관)을 상하게 하여 직장이나 남편운에 영향을 줍니다. 하지만 예술과 표현의 재능이기도 합니다.",
    maleInterpretation: "수하 직원 중에서도 까다로운 관계, 할머니(친가)를 나타냅니다. 상관이 강하면 말솜씨가 뛰어나고 비판력이 있습니다. 다만 상사와 마찰이 생길 수 있으니 표현에 신중함이 필요합니다.",
    femaleInterpretation: "자녀, 특히 아들을 나타냅니다. 상관이 많으면 남편운에 영향을 주어 결혼 생활에 파란이 있을 수 있습니다. 하지만 예술, 방송, 교육 분야에서 재능을 발휘할 수 있습니다.",
  },
  "편재": {
    name: "편재",
    hanja: "偏財",
    group: "재성",
    relation: "내가 극하는 오행, 같은 음양",
    basicMeaning: "유동적인 재물, 투자, 사업 자금을 상징합니다. 흘러다니는 큰 돈입니다.",
    positiveTraits: ["사업 수완", "투자 감각", "융통성", "활동적", "기회 포착"],
    negativeTraits: ["투기", "낭비", "불안정한 재정", "바람기", "산만함"],
    symbolism: "흘러다니는 돈으로 변동이 심합니다. 크게 벌 수도, 크게 잃을 수도 있는 에너지입니다.",
    maleInterpretation: "아버지, 첩, 유동 자산을 상징합니다. 편재가 좋으면 사업 수완이 있고 투자로 재물을 모을 수 있습니다. 다만 이성 관계에서 복잡해질 수 있으니 절제가 필요합니다.",
    femaleInterpretation: "시어머니(편모), 유동 자산, 사업 자금을 의미합니다. 편재가 좋으면 경제 관념이 뛰어나고 투자나 사업에서 성과를 낼 수 있습니다.",
  },
  "정재": {
    name: "정재",
    hanja: "正財",
    group: "재성",
    relation: "내가 극하는 오행, 다른 음양",
    basicMeaning: "정해진 급여, 저축, 고정 자산을 상징합니다. 안정적이지만 큰 변동은 없습니다.",
    positiveTraits: ["안정된 수입", "저축 능력", "실속", "계획적", "신뢰"],
    negativeTraits: ["인색함", "융통성 부족", "소심함", "재물 집착", "보수적"],
    symbolism: "정해진 급여와 고정 자산으로 안정적입니다. 꾸준히 모아가는 재물입니다.",
    maleInterpretation: "아내, 본처, 고정 수입을 상징합니다. 정재가 좋으면 결혼 인연이 좋고 안정적인 가정을 이룹니다. 직장 생활로 꾸준히 재물을 모으는 유형입니다.",
    femaleInterpretation: "시어머니(정모), 고정 자산, 안정된 재물을 의미합니다. 정재가 좋으면 살림을 잘하고 저축 능력이 뛰어납니다.",
  },
  "편관": {
    name: "편관",
    hanja: "偏官",
    group: "관성",
    relation: "나를 극하는 오행, 같은 음양",
    basicMeaning: "칠살(七殺)이라고도 합니다. 강한 압박과 통제의 에너지로, 권위와 스트레스를 상징합니다.",
    positiveTraits: ["카리스마", "추진력", "지도력", "결단력", "권위"],
    negativeTraits: ["압박", "질병", "사고", "권위주의", "독선"],
    symbolism: "강한 압박과 통제의 에너지입니다. 잘 다스리면 리더십이 되고, 못 다스리면 재앙이 됩니다.",
    maleInterpretation: "직장에서의 상사, 권위, 자녀(아들)를 상징합니다. 편관이 강하면 카리스마가 있고 조직을 이끄는 능력이 있습니다. 다만 스트레스 관리에 신경 써야 합니다.",
    femaleInterpretation: "내연남, 애인, 스트레스 요인을 의미합니다. 편관이 강하면 이성에게 끌리는 매력이 있지만, 결혼 전 연애가 복잡해질 수 있습니다. 정관과 함께 있으면 관살혼잡으로 주의가 필요합니다.",
  },
  "정관": {
    name: "정관",
    hanja: "正官",
    group: "관성",
    relation: "나를 극하는 오행, 다른 음양",
    basicMeaning: "바른 관직이라는 의미입니다. 정당한 권위와 직장 생활, 명예를 상징합니다.",
    positiveTraits: ["책임감", "신용", "공직 적성", "명예", "질서"],
    negativeTraits: ["융통성 부족", "경직", "과중한 책임", "스트레스", "체면 중시"],
    symbolism: "정당한 권위와 질서를 상징합니다. 조직 내에서 인정받고 승진하는 에너지입니다.",
    maleInterpretation: "직장, 상사, 자녀(딸)를 상징합니다. 정관이 좋으면 직장 생활에서 인정받고 승진 기회가 많습니다. 공직이나 대기업에서 안정적인 경력을 쌓을 수 있습니다.",
    femaleInterpretation: "남편, 정식 배우자를 의미합니다. 정관이 좋은 위치에 있으면 좋은 배우자를 만나 안정적인 결혼 생활을 합니다. 정관이 하나면 일부종사의 인연입니다.",
  },
  "편인": {
    name: "편인",
    hanja: "偏印",
    group: "인성",
    relation: "나를 생하는 오행, 같은 음양",
    basicMeaning: "효신(梟神)이라고도 합니다. 특수한 학문, 영적 감각, 직관력을 상징합니다.",
    positiveTraits: ["특수 재능", "영적 감각", "직관력", "연구 능력", "독창성"],
    negativeTraits: ["편협함", "고독", "의지 부족", "도식(倒食)", "변덕"],
    symbolism: "식신을 해쳐 복록을 빼앗기도 하지만, 특수한 재능과 직관력의 원천이기도 합니다.",
    maleInterpretation: "계모, 특수한 학문, 종교 등을 상징합니다. 편인이 좋으면 의학, 역술, 예술 등 특수 분야에서 재능을 발휘합니다. 다만 일반적인 사회생활보다는 전문 분야가 맞습니다.",
    femaleInterpretation: "계모, 시어머니와의 관계, 직관력을 나타냅니다. 편인이 좋으면 영적 감각이 발달하고 예지력이 있습니다. 다만 식신을 극하므로 자녀와의 관계에 신경을 써야 할 수 있습니다.",
  },
  "정인": {
    name: "정인",
    hanja: "正印",
    group: "인성",
    relation: "나를 생하는 오행, 다른 음양",
    basicMeaning: "바른 인장이라는 의미입니다. 학문, 자격증, 어머니, 귀인을 상징합니다.",
    positiveTraits: ["학문", "자격증", "지혜", "어머니 복", "후원"],
    negativeTraits: ["의존적", "나태", "게으름", "결단력 부족", "수동적"],
    symbolism: "학문과 지혜, 후원을 상징합니다. 배움을 통해 성장하고 귀인의 도움을 받는 에너지입니다.",
    maleInterpretation: "어머니, 학문, 자격증, 귀인을 상징합니다. 정인이 좋으면 학업에서 성과를 내고, 어머니의 도움을 많이 받습니다. 자격증이나 학위를 통해 사회적 지위를 얻습니다.",
    femaleInterpretation: "어머니, 시어머니, 학문을 나타냅니다. 정인이 좋으면 학업 운이 좋고, 시어머니와의 관계도 원만합니다. 교육이나 연구 분야에서 성과를 낼 수 있습니다.",
  },
} as const;

// 십신 그룹 정보
export const SIPSIN_GROUPS: Record<SipsinGroup, {
  members: SipsinName[];
  meaning: string;
  characteristics: string;
}> = {
  "비겁": {
    members: ["비견", "겁재"],
    meaning: "나와 같은 오행 - 형제, 동료, 경쟁자",
    characteristics: "독립심, 자존심, 경쟁심을 나타냅니다. 많으면 형제나 친구가 많고 경쟁이 심하며, 적으면 독자적이고 외로울 수 있습니다.",
  },
  "식상": {
    members: ["식신", "상관"],
    meaning: "내가 생하는 오행 - 표현, 창작, 자녀",
    characteristics: "표현력, 창의력, 재능을 나타냅니다. 많으면 예술적이고 말이 많으며, 적으면 과묵하고 실용적입니다.",
  },
  "재성": {
    members: ["편재", "정재"],
    meaning: "내가 극하는 오행 - 재물, 아버지, 아내",
    characteristics: "재물 운, 경제 관념을 나타냅니다. 많으면 돈을 잘 벌지만 나가는 것도 많고, 적으면 재물에 담백합니다.",
  },
  "관성": {
    members: ["편관", "정관"],
    meaning: "나를 극하는 오행 - 직장, 명예, 남편",
    characteristics: "직장 운, 사회적 지위를 나타냅니다. 많으면 책임이 무겁고 스트레스가 많으며, 적으면 자유롭지만 사회적 인정이 약합니다.",
  },
  "인성": {
    members: ["편인", "정인"],
    meaning: "나를 생하는 오행 - 학문, 어머니, 귀인",
    characteristics: "학업 운, 후원을 나타냅니다. 많으면 학문적이고 게으를 수 있으며, 적으면 실천적이지만 배움이 부족할 수 있습니다.",
  },
} as const;

// ============================================
// 헬퍼 함수들 - 전문가모드용
// ============================================

// 천간 한자 → 오행 변환
export const getCheonganOheng = (hanja: string): Oheng | null => {
  const info = CHEONGAN[hanja as CheonganHanja];
  return info ? info.oheng : null;
};

// 천간 한글 → 오행 변환
export const getCheonganOhengByKr = (korean: string): Oheng | null => {
  const info = CHEONGAN_KR[korean as CheonganKr];
  return info ? info.oheng : null;
};

// 지지 한자 → 오행 변환
export const getJijiOheng = (hanja: string): Oheng | null => {
  const info = JIJI[hanja as JijiHanja];
  return info ? info.oheng : null;
};

// 지지 한글 → 오행 변환
export const getJijiOhengByKr = (korean: string): Oheng | null => {
  const info = JIJI_KR[korean as JijiKr];
  return info ? info.oheng : null;
};

// 지지 한자 → 동물 변환
export const getJijiAnimal = (hanja: string): string | null => {
  const info = JIJI[hanja as JijiHanja];
  return info ? info.animal : null;
};

// 지지 한글 → 동물 변환
export const getJijiAnimalByKr = (korean: string): string | null => {
  const info = JIJI_KR[korean as JijiKr];
  return info ? info.animal : null;
};

// ============================================
// 챕터별 인트로 및 설명 상수 - 전문가모드 PDF용
// ============================================

export interface ChapterIntro {
  title: string;
  hanja: string;
  intro: string;
  concepts: { term: string; meaning: string }[];
}

export const CHAPTER_INTROS: Record<string, ChapterIntro> = {
  // 제1장: 명식
  myeongshik: {
    title: "명식",
    hanja: "命式",
    intro: "사주팔자(四柱八字)는 태어난 년, 월, 일, 시의 네 기둥(四柱)과 각 기둥을 이루는 천간(天干)과 지지(地支) 여덟 글자(八字)를 의미합니다. 이는 우리가 태어난 순간의 우주적 에너지를 담고 있으며, 평생의 기본적인 성향과 운명의 흐름을 보여줍니다.",
    concepts: [
      { term: "천간(天干)", meaning: "하늘의 기운으로, 갑을병정무기경신임계의 10가지입니다. 외적으로 드러나는 성격과 에너지를 나타냅니다." },
      { term: "지지(地支)", meaning: "땅의 기운으로, 자축인묘진사오미신유술해의 12가지입니다. 내면의 성격과 잠재된 에너지를 나타냅니다." },
      { term: "사주(四柱)", meaning: "년주, 월주, 일주, 시주의 네 기둥입니다. 각각 삶의 다른 영역과 시기를 담당합니다." },
    ],
  },

  // 제2장: 음양오행
  eumyangOheng: {
    title: "음양오행",
    hanja: "陰陽五行",
    intro: "음양오행은 동양 철학의 근간이 되는 개념으로, 모든 만물은 음(陰)과 양(陽)의 조화, 그리고 목(木), 화(火), 토(土), 금(金), 수(水) 다섯 가지 기운의 순환으로 이루어집니다. 사주에서 음양의 균형과 오행의 분포는 성격, 건강, 운세를 해석하는 기본 틀입니다.",
    concepts: [
      { term: "음양(陰陽)", meaning: "모든 것은 음과 양의 두 가지 기운으로 나뉩니다. 양은 적극적이고 외향적인 기운, 음은 수용적이고 내향적인 기운입니다." },
      { term: "오행(五行)", meaning: "목화토금수 다섯 가지 기운입니다. 서로 생(生)하고 극(剋)하며 균형을 이룹니다." },
      { term: "신강신약(身强身弱)", meaning: "일간(나 자신)의 기운이 강한지 약한지를 판단합니다. 이에 따라 필요한 오행과 피해야 할 오행이 결정됩니다." },
    ],
  },

  // 제3장: 십성
  sipseong: {
    title: "십성",
    hanja: "十星",
    intro: "십성(十星), 또는 십신(十神)은 일간을 기준으로 다른 글자들과의 관계를 나타내는 열 가지 분류입니다. 비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인으로 나뉘며, 각각 인생에서의 관계와 역할, 성격의 특성을 상징합니다. 사주에서 어떤 십신이 많고 적은지에 따라 그 사람의 성향과 인생 패턴이 드러납니다.",
    concepts: [
      { term: "비겁(比劫)", meaning: "비견과 겁재. 나와 같은 오행으로, 형제, 친구, 경쟁자를 상징합니다." },
      { term: "식상(食傷)", meaning: "식신과 상관. 내가 생하는 오행으로, 표현력, 창의력, 자녀를 상징합니다." },
      { term: "재성(財星)", meaning: "편재와 정재. 내가 극하는 오행으로, 재물, 아버지, 아내를 상징합니다." },
      { term: "관성(官星)", meaning: "편관과 정관. 나를 극하는 오행으로, 직장, 명예, 남편을 상징합니다." },
      { term: "인성(印星)", meaning: "편인과 정인. 나를 생하는 오행으로, 학문, 어머니, 귀인을 상징합니다." },
    ],
  },

  // 제4장: 격국
  geokguk: {
    title: "격국",
    hanja: "格局",
    intro: "격국(格局)은 사주의 기본 틀과 구조를 의미합니다. 마치 집의 설계도와 같이, 타고난 인생의 큰 틀을 보여주며, 어떤 방향으로 삶을 이끌어가면 좋을지 알려줍니다. 격국은 월지(月支)를 중심으로 판단하며, 내격(內格)과 외격(外格)으로 크게 나뉩니다.",
    concepts: [
      { term: "내격(內格)", meaning: "정격이라고도 하며, 일반적인 사주 구조입니다. 식신격, 상관격, 편재격, 정재격, 편관격, 정관격, 편인격, 정인격 등이 있습니다." },
      { term: "외격(外格)", meaning: "특별한 구조의 사주입니다. 종격(從格), 화격(化格) 등이 있으며, 특수한 해석이 필요합니다." },
      { term: "용신(用神)", meaning: "사주의 균형을 맞추는 데 필요한 오행입니다. 격국에 따라 용신이 결정됩니다." },
    ],
  },

  // 제5장: 신살
  sinsal: {
    title: "신살",
    hanja: "神煞",
    intro: "신살(神煞)은 사주에 나타나는 특별한 기운들로, 길한 기운인 귀인(貴人)과 주의가 필요한 살(煞)로 구분됩니다. 신살은 타고난 행운과 주의해야 할 점을 알려주며, 삶의 특별한 패턴이나 재능을 나타내기도 합니다.",
    concepts: [
      { term: "귀인(貴人)", meaning: "도움을 주는 귀한 사람을 만나게 하는 기운입니다. 천을귀인, 문창귀인, 태극귀인 등이 있습니다." },
      { term: "역마살(驛馬殺)", meaning: "이동과 변화가 많은 기운입니다. 활용하기에 따라 해외 진출, 사업 확장의 기회가 됩니다." },
      { term: "도화살(桃花殺)", meaning: "이성에게 매력적으로 보이는 기운입니다. 예술적 재능과도 연결됩니다." },
      { term: "화개살(華蓋殺)", meaning: "예술적, 종교적 재능을 나타내는 기운입니다. 고독을 즐기는 성향과도 연결됩니다." },
    ],
  },

  // 제6장: 12운성
  sipiUnseong: {
    title: "12운성",
    hanja: "十二運星",
    intro: "12운성은 인간의 일생을 열두 단계로 나누어 표현한 것입니다. 태(胎)에서 시작하여 양(養), 장생(長生), 목욕(沐浴), 관대(冠帶), 건록(建祿), 제왕(帝旺), 쇠(衰), 병(病), 사(死), 묘(墓), 절(絶)의 순환을 거칩니다. 각 기둥에 어떤 12운성이 있는지에 따라 삶의 에너지 상태를 파악할 수 있습니다.",
    concepts: [
      { term: "장생(長生)", meaning: "생명이 태어나는 시기입니다. 새로운 시작, 성장의 에너지를 상징합니다." },
      { term: "제왕(帝旺)", meaning: "가장 왕성한 시기입니다. 최고의 기운과 성취를 상징합니다." },
      { term: "묘(墓)", meaning: "에너지가 저장되는 시기입니다. 잠재력과 내면의 힘을 상징합니다." },
    ],
  },

  // 제7장: 대운
  daeun: {
    title: "대운",
    hanja: "大運",
    intro: "대운(大運)은 10년 단위로 변하는 큰 운세의 흐름입니다. 인생의 계절과 같아서, 봄처럼 성장하는 시기, 여름처럼 결실을 맺는 시기, 가을처럼 수확하는 시기, 겨울처럼 준비하는 시기가 순환합니다. 대운은 월주(月柱)를 기준으로 계산되며, 남녀와 음양에 따라 순행 또는 역행합니다.",
    concepts: [
      { term: "대운 시작 나이", meaning: "태어난 시점부터 다음 절기까지의 일수를 계산하여 대운이 시작되는 나이를 구합니다." },
      { term: "순행/역행", meaning: "양년생 남자와 음년생 여자는 순행, 음년생 남자와 양년생 여자는 역행합니다." },
      { term: "대운과 용신", meaning: "대운이 용신과 맞으면 좋은 시기, 기신과 맞으면 주의가 필요한 시기입니다." },
    ],
  },

  // 제8장: 세운
  yearly: {
    title: "세운",
    hanja: "歲運",
    intro: "세운(歲運)은 매년 바뀌는 연도별 운세입니다. 대운이 10년의 큰 흐름이라면, 세운은 그 안에서의 세부적인 변화를 보여줍니다. 매년 바뀌는 연주(年柱)와 사주 원국, 대운의 상호작용을 분석하여 한 해의 길흉을 판단합니다.",
    concepts: [
      { term: "태세(太歲)", meaning: "그 해의 년주입니다. 사주 원국과의 관계에 따라 한 해의 운세가 결정됩니다." },
      { term: "세운과 대운의 관계", meaning: "대운이 좋아도 세운이 나쁘면 그 해는 주의가 필요합니다. 반대의 경우도 마찬가지입니다." },
    ],
  },

  // 제9장: 재물운
  wealth: {
    title: "재물운",
    hanja: "財物運",
    intro: "재물운은 돈과 재산에 관한 운세입니다. 어떤 방식으로 돈을 벌고, 어떤 투자가 적합하며, 재물과 관련하여 주의할 점은 무엇인지를 알려줍니다. 사주에서 재성(財星)의 상태와 용신과의 관계를 통해 재물 패턴을 파악합니다.",
    concepts: [
      { term: "편재(偏財)", meaning: "유동적인 재물, 투자, 사업 자금을 상징합니다. 큰 돈을 벌 수도, 잃을 수도 있습니다." },
      { term: "정재(正財)", meaning: "고정적인 수입, 급여, 저축을 상징합니다. 안정적이지만 큰 변동은 없습니다." },
      { term: "재다신약(財多身弱)", meaning: "재성이 많고 신약하면 돈을 벌어도 지키기 어려울 수 있습니다." },
    ],
  },

  // 제10장: 직업운
  career: {
    title: "직업운",
    hanja: "職業運",
    intro: "직업운은 일과 성공에 관한 운세입니다. 어떤 분야에서 능력을 발휘할 수 있으며, 어떤 직업이 적합한지를 알려줍니다. 사주의 격국, 용신, 십신의 분포를 종합하여 적성과 진로를 분석합니다.",
    concepts: [
      { term: "격국과 직업", meaning: "정관격은 공직, 식신격은 기술직, 편재격은 사업 등 격국에 따라 적합한 직업군이 있습니다." },
      { term: "용신과 직업", meaning: "용신 오행과 관련된 직업을 선택하면 성공 확률이 높아집니다." },
    ],
  },

  // 제11장: 건강운
  health: {
    title: "건강운",
    hanja: "健康運",
    intro: "건강운은 몸과 마음의 건강에 관한 운세입니다. 타고난 체질과 주의해야 할 건강 문제, 그리고 건강을 유지하기 위한 방법을 알려줍니다. 오행의 균형과 부족한 기운을 분석하여 취약한 장기와 질병 경향을 파악합니다.",
    concepts: [
      { term: "오행과 장기", meaning: "목은 간/담, 화는 심장/소장, 토는 비장/위장, 금은 폐/대장, 수는 신장/방광과 연결됩니다." },
      { term: "오행 불균형과 질병", meaning: "부족하거나 과다한 오행은 해당 장기에 문제를 일으킬 수 있습니다." },
    ],
  },

  // 제12장: 연애 스타일
  loveStyle: {
    title: "연애 스타일",
    hanja: "戀愛",
    intro: "연애 스타일은 사랑하는 방식과 이상형에 관한 분석입니다. 어떤 방식으로 사랑하고, 어떤 사람에게 끌리는지, 연애에서 주의할 점은 무엇인지를 알려줍니다. 사주의 일지(日支), 도화살, 관성/재성의 상태를 통해 연애 패턴을 파악합니다.",
    concepts: [
      { term: "일지(日支)와 배우자", meaning: "일지는 배우자의 성향과 결혼 생활을 나타냅니다." },
      { term: "도화살과 매력", meaning: "도화살이 있으면 이성에게 매력적으로 보이고, 연애 기회가 많습니다." },
    ],
  },

  // 제13장: 인연의 흐름
  relationship: {
    title: "인연과 관계의 흐름",
    hanja: "姻緣",
    intro: "인연의 흐름은 현재 관계 상태에 따른 맞춤 분석입니다. 솔로, 연애 중, 기혼 등 상황에 따라 다른 조언을 드립니다. 언제 좋은 인연을 만날 수 있는지, 현재 관계를 어떻게 발전시킬지, 결혼 생활에서 주의할 점은 무엇인지 등을 분석합니다.",
    concepts: [
      { term: "인연의 시기", meaning: "대운과 세운에서 관성(여성) 또는 재성(남성)이 들어오는 시기에 인연을 만날 가능성이 높습니다." },
      { term: "관계의 발전", meaning: "현재 연애 중이라면 결혼까지 발전할 수 있는지, 주의할 점은 무엇인지 분석합니다." },
    ],
  },

  // 제14장: 배우자운
  marriage: {
    title: "배우자운",
    hanja: "配偶者運",
    intro: "배우자운은 평생의 반려자에 관한 분석입니다. 어떤 배우자를 만나게 되며, 결혼 생활은 어떻게 될지를 알려줍니다. 일지(日支)의 상태, 관성(여성) 또는 재성(남성)의 분포, 대운의 흐름을 통해 배우자의 성향과 결혼 시기를 분석합니다.",
    concepts: [
      { term: "일지와 배우자", meaning: "일지는 배우자 궁입니다. 일지의 상태가 좋으면 배우자 복이 있습니다." },
      { term: "결혼 적령기", meaning: "대운과 세운에서 결혼에 적합한 시기를 판단합니다." },
    ],
  },

  // 제15장: 가족 관계
  family: {
    title: "가족 관계",
    hanja: "家族",
    intro: "가족 관계는 혈연의 인연에 관한 분석입니다. 부모, 형제, 자녀와의 관계와 가족 화합을 위한 조언을 드립니다. 사주의 각 기둥과 십신을 통해 가족 관계의 패턴을 분석합니다.",
    concepts: [
      { term: "년주와 조상/부모", meaning: "년주는 조상과 부모, 어린 시절의 가정 환경을 나타냅니다." },
      { term: "시주와 자녀", meaning: "시주는 자녀와 말년을 나타냅니다. 시주가 좋으면 자녀 복이 있습니다." },
      { term: "비겁과 형제", meaning: "비견과 겁재는 형제자매를 상징합니다." },
    ],
  },

  // 제17장: 개운법
  warning: {
    title: "주의 시기 및 개운법",
    hanja: "開運法",
    intro: "개운법(開運法)은 운을 여는 방법입니다. 주의해야 할 시기와 운을 좋게 만드는 방법을 알려드립니다. 용신(用神)을 활용한 개운법, 신살에 대한 대처법, 연도별 주의사항 등을 종합하여 조언합니다.",
    concepts: [
      { term: "용신 활용", meaning: "용신 오행에 해당하는 색상, 방향, 음식, 활동을 생활에 적용합니다." },
      { term: "기신 회피", meaning: "기신 오행에 해당하는 것은 가급적 피하거나 조심합니다." },
      { term: "신살 대처", meaning: "흉살이 있다면 해당하는 개운법으로 액을 줄일 수 있습니다." },
    ],
  },
} as const;

// ============================================
// 오행 상생상극 설명 상수
// ============================================

export const OHENG_RELATIONS = {
  // 상생 관계
  sangsaeng: {
    description: "상생(相生)은 서로 돕고 낳아주는 관계입니다.",
    relations: [
      { from: "목", to: "화", meaning: "목생화(木生火): 나무가 불을 피웁니다." },
      { from: "화", to: "토", meaning: "화생토(火生土): 불이 타고 나면 재가 되어 흙이 됩니다." },
      { from: "토", to: "금", meaning: "토생금(土生金): 흙 속에서 광물(금속)이 생겨납니다." },
      { from: "금", to: "수", meaning: "금생수(金生水): 금속이 차가워지면 물방울이 맺힙니다." },
      { from: "수", to: "목", meaning: "수생목(水生木): 물이 나무를 자라게 합니다." },
    ],
  },
  // 상극 관계
  sanggeuk: {
    description: "상극(相剋)은 서로 억제하고 극하는 관계입니다.",
    relations: [
      { from: "목", to: "토", meaning: "목극토(木剋土): 나무가 흙의 양분을 빼앗습니다." },
      { from: "토", to: "수", meaning: "토극수(土剋水): 흙이 물을 막습니다." },
      { from: "수", to: "화", meaning: "수극화(水剋火): 물이 불을 끕니다." },
      { from: "화", to: "금", meaning: "화극금(火剋金): 불이 금속을 녹입니다." },
      { from: "금", to: "목", meaning: "금극목(金剋木): 금속(도끼)이 나무를 벱니다." },
    ],
  },
} as const;
