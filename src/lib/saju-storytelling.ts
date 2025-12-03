/**
 * 사주 감성 스토리텔링 데이터 (Phase 4)
 * - 자연 비유 프로필
 * - 대운 전환점 스토리
 * - 종합 키워드 추출
 */

import type { OhengCount, Pillar } from "@/types/saju";
import type { MajorFortuneInfo } from "@/lib/saju-calculator";
import { ILGAN_TRAITS } from "@/lib/saju-traits";
import { GEOKGUK_INFO } from "@/lib/saju-analysis-extended";

// ============================================
// 4.1 자연 비유 프로필 (일간별)
// ============================================

export interface NatureProfile {
  ilgan: string;
  hanja: string;
  natureImage: string;         // 자연 이미지
  natureEmoji: string;         // 이모지
  essence: string;             // 본질 설명
  poeticDescription: string;   // 시적 묘사
  seasonBestMatch: string;     // 잘 맞는 계절
  timeOfDay: string;           // 어울리는 시간대
  landscape: string;           // 어울리는 풍경
  elementalPower: string;      // 원소적 힘
  growthStory: string;         // 성장 서사
}

export const NATURE_PROFILES: Record<string, NatureProfile> = {
  갑: {
    ilgan: "갑",
    hanja: "甲",
    natureImage: "하늘을 향해 뻗은 큰 소나무",
    natureEmoji: "🌲",
    essence: "곧게 뻗어 오르는 대지의 기둥",
    poeticDescription: "당신은 폭풍에도 흔들리지 않는 고목과 같습니다. 깊이 뿌리내린 신념 위에 하늘을 향해 가지를 뻗으며, 그늘로 많은 이들을 품어주는 존재입니다.",
    seasonBestMatch: "이른 봄, 새싹이 돋아나는 계절",
    timeOfDay: "동이 트는 새벽",
    landscape: "울창한 숲 속, 높은 산의 능선",
    elementalPower: "성장과 확장의 에너지",
    growthStory: "씨앗에서 시작해 하늘을 찌를 듯한 거목이 되기까지, 당신의 인생은 끊임없는 상승의 여정입니다.",
  },
  을: {
    ilgan: "을",
    hanja: "乙",
    natureImage: "바람에 흔들리는 부드러운 풀꽃",
    natureEmoji: "🌸",
    essence: "유연하게 적응하는 생명의 힘",
    poeticDescription: "당신은 담장을 타고 오르는 덩굴처럼 어떤 환경에서도 길을 찾아갑니다. 부드러움 속에 숨은 강인함으로, 꺾이지 않고 피어나는 꽃입니다.",
    seasonBestMatch: "만개하는 봄",
    timeOfDay: "이슬 맺힌 아침",
    landscape: "화사한 정원, 꽃이 만발한 들판",
    elementalPower: "적응과 연결의 에너지",
    growthStory: "작은 씨앗이 바위틈에서도 꽃을 피우듯, 당신은 어디서든 아름다움을 발견하고 창조합니다.",
  },
  병: {
    ilgan: "병",
    hanja: "丙",
    natureImage: "세상을 비추는 찬란한 태양",
    natureEmoji: "☀️",
    essence: "모든 것을 밝히는 생명의 근원",
    poeticDescription: "당신은 구름 뒤에서도 결코 사라지지 않는 태양입니다. 그 빛으로 어둠을 몰아내고, 따스함으로 얼어붙은 마음을 녹이는 존재입니다.",
    seasonBestMatch: "한여름 정오",
    timeOfDay: "태양이 가장 높은 대낮",
    landscape: "탁 트인 바다 위, 황금빛 사막",
    elementalPower: "열정과 확산의 에너지",
    growthStory: "동쪽에서 떠올라 온 세상을 비추고, 저물어서도 내일의 희망을 약속하는 것이 당신의 여정입니다.",
  },
  정: {
    ilgan: "정",
    hanja: "丁",
    natureImage: "어둠 속을 밝히는 은은한 촛불",
    natureEmoji: "🕯️",
    essence: "깊은 밤을 지키는 따뜻한 빛",
    poeticDescription: "당신은 폭풍 속에서도 꺼지지 않는 등불입니다. 화려하지 않지만 꼭 필요한 곳에 빛을 비추며, 지친 영혼에게 쉼터를 안내합니다.",
    seasonBestMatch: "늦가을 저녁",
    timeOfDay: "별이 뜨는 초저녁",
    landscape: "고요한 산사, 책으로 가득한 서재",
    elementalPower: "집중과 심화의 에너지",
    growthStory: "작은 불꽃에서 시작해 어둠 속 길잡이가 되기까지, 당신은 내면의 빛을 키워가는 여정을 걷습니다.",
  },
  무: {
    ilgan: "무",
    hanja: "戊",
    natureImage: "만물을 품은 넓은 대지와 산",
    natureEmoji: "🏔️",
    essence: "흔들리지 않는 대지의 중심",
    poeticDescription: "당신은 오랜 세월을 버텨온 산맥과 같습니다. 그 위에 나무가 자라고 물이 흐르며, 모든 생명이 당신을 믿고 기대는 존재입니다.",
    seasonBestMatch: "풍요로운 늦여름",
    timeOfDay: "해질녘 황혼",
    landscape: "광활한 들판, 옹골찬 언덕",
    elementalPower: "안정과 포용의 에너지",
    growthStory: "티끌이 모여 산이 되듯, 당신은 묵묵한 노력으로 모두가 의지할 수 있는 존재가 됩니다.",
  },
  기: {
    ilgan: "기",
    hanja: "己",
    natureImage: "생명을 키우는 비옥한 텃밭",
    natureEmoji: "🌾",
    essence: "모든 것을 자라게 하는 부드러운 흙",
    poeticDescription: "당신은 씨앗을 품어 싹을 틔우는 텃밭과 같습니다. 눈에 띄지 않는 곳에서 묵묵히 영양을 공급하며, 결실의 순간을 준비합니다.",
    seasonBestMatch: "수확의 가을",
    timeOfDay: "노을 지는 오후",
    landscape: "정갈한 정원, 풍성한 논밭",
    elementalPower: "양육과 조화의 에너지",
    growthStory: "황무지를 옥토로 바꾸듯, 당신은 주변의 모든 것에 가치를 부여하고 성장시킵니다.",
  },
  경: {
    ilgan: "경",
    hanja: "庚",
    natureImage: "단단한 바위와 날카로운 쇠",
    natureEmoji: "⚔️",
    essence: "불의를 베는 정의의 칼날",
    poeticDescription: "당신은 세월에 닳지 않는 바위이자, 옳은 것을 위해 빛나는 검입니다. 단단함 속에 숨은 정의로운 마음으로 혼란을 바로잡습니다.",
    seasonBestMatch: "서늘한 초가을",
    timeOfDay: "맑은 아침",
    landscape: "험준한 절벽, 장인의 대장간",
    elementalPower: "결단과 정화의 에너지",
    growthStory: "거친 광석이 명검으로 다듬어지듯, 당신은 시련을 통해 더욱 빛나는 존재가 됩니다.",
  },
  신: {
    ilgan: "신",
    hanja: "辛",
    natureImage: "세공된 보석과 맑은 거울",
    natureEmoji: "💎",
    essence: "진실을 비추는 투명한 결정체",
    poeticDescription: "당신은 원석에서 빛나는 보석이 되기까지 고통을 견뎌온 존재입니다. 그 빛은 진짜와 가짜를 구별하며, 예민한 감각으로 아름다움을 창조합니다.",
    seasonBestMatch: "청명한 가을 하늘",
    timeOfDay: "달빛 비치는 밤",
    landscape: "수정 동굴, 고요한 호수 위",
    elementalPower: "정제와 완성의 에너지",
    growthStory: "거친 세공의 과정을 통해 빛나는 보석이 되듯, 당신은 삶의 어려움을 아름다움으로 승화시킵니다.",
  },
  임: {
    ilgan: "임",
    hanja: "壬",
    natureImage: "끝없이 흐르는 넓은 강과 바다",
    natureEmoji: "🌊",
    essence: "모든 것을 품고 흐르는 거대한 물",
    poeticDescription: "당신은 산을 돌아가고 바위를 넘어 결국 바다에 닿는 강물입니다. 막힘이 없는 자유로운 흐름으로 세상의 지혜를 모아갑니다.",
    seasonBestMatch: "깊은 겨울",
    timeOfDay: "고요한 밤",
    landscape: "드넓은 바다, 장엄한 폭포",
    elementalPower: "흐름과 포용의 에너지",
    growthStory: "작은 샘에서 시작해 온 세상을 품는 바다가 되기까지, 당신은 경계 없이 흐르며 성장합니다.",
  },
  계: {
    ilgan: "계",
    hanja: "癸",
    natureImage: "고요히 내리는 빗방울과 이슬",
    natureEmoji: "💧",
    essence: "스며들어 적시는 생명의 물방울",
    poeticDescription: "당신은 소리 없이 내려 대지를 적시는 비와 같습니다. 눈에 띄지 않지만 모든 생명의 근원이 되며, 깊은 직관으로 보이지 않는 것을 봅니다.",
    seasonBestMatch: "겨울에서 봄으로 가는 길목",
    timeOfDay: "새벽안개가 피어오르는 시간",
    landscape: "안개 낀 호수, 이슬 맺힌 숲",
    elementalPower: "침투와 정화의 에너지",
    growthStory: "눈에 보이지 않는 곳까지 스며드는 물처럼, 당신은 조용히 깊은 영향력을 발휘합니다.",
  },
};

// ============================================
// 4.2 대운 전환점 스토리
// ============================================

export interface DaeunStoryPhase {
  ageRange: string;           // 나이대
  phaseName: string;          // 시기 이름
  emoji: string;              // 이모지
  theme: string;              // 주제
  description: string;        // 설명
  energy: string;             // 에너지
  lifeTasks: string[];        // 인생 과제
  opportunities: string[];    // 기회
  challenges: string[];       // 도전
  advice: string;             // 조언
}

export const DAEUN_STORY_PHASES: Record<string, DaeunStoryPhase> = {
  "0-10": {
    ageRange: "0~10세",
    phaseName: "씨앗의 시기",
    emoji: "🌱",
    theme: "잠재력의 형성",
    description: "세상에 첫발을 내딛고, 무한한 가능성을 품은 씨앗이 땅속에서 자라날 준비를 합니다.",
    energy: "순수한 가능성의 에너지",
    lifeTasks: ["기본적인 신뢰감 형성", "세상에 대한 호기심 발달", "가족과의 유대감 형성"],
    opportunities: ["타고난 재능의 발현", "첫 번째 열정의 발견", "지지해주는 어른들과의 만남"],
    challenges: ["환경 적응", "기본 규칙 학습", "자아 인식의 시작"],
    advice: "이 시기에 받은 사랑과 안정감은 평생의 자양분이 됩니다.",
  },
  "10-20": {
    ageRange: "10~20세",
    phaseName: "새싹의 시기",
    emoji: "🌿",
    theme: "정체성의 탐색",
    description: "땅을 뚫고 올라온 새싹이 햇빛을 향해 고개를 들며, 자신만의 방향을 찾아갑니다.",
    energy: "성장과 탐색의 에너지",
    lifeTasks: ["자아 정체성 확립", "학업과 재능 발굴", "또래 관계 형성"],
    opportunities: ["숨겨진 재능 발견", "인생의 멘토 만남", "첫 번째 꿈 설정"],
    challenges: ["방황과 혼란", "또래 압력", "진로 고민"],
    advice: "실패해도 괜찮습니다. 지금의 시행착오가 미래의 지혜가 됩니다.",
  },
  "20-30": {
    ageRange: "20~30세",
    phaseName: "성장의 시기",
    emoji: "🌳",
    theme: "기반의 구축",
    description: "어린 나무가 가지를 뻗으며 성장하듯, 사회로 나아가 자신의 자리를 만들어갑니다.",
    energy: "확장과 도전의 에너지",
    lifeTasks: ["사회적 역할 확립", "경제적 독립", "인간관계 심화"],
    opportunities: ["커리어 도약", "의미 있는 관계 형성", "자신만의 길 발견"],
    challenges: ["현실과 이상의 괴리", "경쟁 스트레스", "선택의 무게"],
    advice: "조급해하지 마세요. 뿌리가 깊어야 나무가 높이 자랍니다.",
  },
  "30-40": {
    ageRange: "30~40세",
    phaseName: "꽃피는 시기",
    emoji: "🌸",
    theme: "능력의 개화",
    description: "오랜 성장 끝에 마침내 꽃을 피우듯, 당신의 재능과 노력이 빛을 발합니다.",
    energy: "발현과 성취의 에너지",
    lifeTasks: ["전문성 확립", "리더십 발휘", "균형 있는 삶 추구"],
    opportunities: ["커리어 정점 도달", "영향력 확대", "후배 양성"],
    challenges: ["번아웃 위험", "가정과 일의 균형", "건강 관리"],
    advice: "꽃이 피었을 때 향기를 나누세요. 나눔이 더 큰 성취를 가져옵니다.",
  },
  "40-50": {
    ageRange: "40~50세",
    phaseName: "열매의 시기",
    emoji: "🍎",
    theme: "결실과 성찰",
    description: "꽃이 지고 열매가 맺히듯, 지금까지의 노력이 구체적인 결과로 나타납니다.",
    energy: "결실과 책임의 에너지",
    lifeTasks: ["성과 정리", "다음 세대 지원", "인생 후반 준비"],
    opportunities: ["안정적 성과 향유", "지혜의 전수", "새로운 도전"],
    challenges: ["중년의 위기", "건강 문제", "역할 변화 적응"],
    advice: "열매를 맺었다면 씨앗도 생각하세요. 다음 세대를 위한 준비가 필요합니다.",
  },
  "50-60": {
    ageRange: "50~60세",
    phaseName: "수확의 시기",
    emoji: "🌾",
    theme: "정리와 전환",
    description: "풍성한 수확을 거두며, 인생의 다음 장을 준비하는 전환의 시간입니다.",
    energy: "정리와 감사의 에너지",
    lifeTasks: ["인생 정리", "건강 관리 강화", "관계 재정립"],
    opportunities: ["제2의 인생 시작", "취미와 열정 추구", "손주와의 관계"],
    challenges: ["은퇴 적응", "건강 관리", "정체성 재정립"],
    advice: "거둔 것에 감사하고, 아직 심을 수 있는 씨앗을 찾으세요.",
  },
  "60-70": {
    ageRange: "60~70세",
    phaseName: "지혜의 시기",
    emoji: "🦉",
    theme: "통찰과 전수",
    description: "긴 세월의 경험이 지혜가 되어, 후대에 빛이 되어주는 시기입니다.",
    energy: "성찰과 나눔의 에너지",
    lifeTasks: ["지혜 전수", "삶의 의미 성찰", "평화로운 일상"],
    opportunities: ["존경받는 어른 역할", "인생 경험 나눔", "영적 성장"],
    challenges: ["건강 유지", "변화하는 세상 적응", "고독감"],
    advice: "당신의 이야기가 누군가에게는 등불이 됩니다. 나누세요.",
  },
  "70-80": {
    ageRange: "70~80세",
    phaseName: "고요한 빛의 시기",
    emoji: "🌅",
    theme: "평화와 완성",
    description: "노을처럼 은은하게 빛나며, 삶의 여정을 아름답게 마무리합니다.",
    energy: "평화와 완성의 에너지",
    lifeTasks: ["마음의 평화 유지", "소중한 관계 감사", "삶의 완성"],
    opportunities: ["내면의 평화", "가족과의 깊은 유대", "삶의 의미 발견"],
    challenges: ["건강 관리", "상실감 극복", "변화 수용"],
    advice: "지금 이 순간이 선물입니다. 하루하루를 감사히 보내세요.",
  },
};

/**
 * 나이에 해당하는 대운 스토리 단계 반환
 */
export function getDaeunStoryPhase(age: number): DaeunStoryPhase {
  if (age < 10) return DAEUN_STORY_PHASES["0-10"];
  if (age < 20) return DAEUN_STORY_PHASES["10-20"];
  if (age < 30) return DAEUN_STORY_PHASES["20-30"];
  if (age < 40) return DAEUN_STORY_PHASES["30-40"];
  if (age < 50) return DAEUN_STORY_PHASES["40-50"];
  if (age < 60) return DAEUN_STORY_PHASES["50-60"];
  if (age < 70) return DAEUN_STORY_PHASES["60-70"];
  return DAEUN_STORY_PHASES["70-80"];
}

/**
 * 대운 정보에 스토리 추가
 */
export function enrichDaeunWithStory(daeun: MajorFortuneInfo): MajorFortuneInfo & { story: DaeunStoryPhase } {
  const story = getDaeunStoryPhase(daeun.startAge);
  return { ...daeun, story };
}

// ============================================
// 4.3 종합 키워드 추출
// ============================================

// 일간별 핵심 키워드
const ILGAN_KEYWORDS: Record<string, string[]> = {
  갑: ["리더십", "추진력", "정의감", "개척정신"],
  을: ["적응력", "유연함", "협력", "섬세함"],
  병: ["열정", "표현력", "밝음", "창의성"],
  정: ["집중력", "섬세함", "따뜻함", "직관력"],
  무: ["안정감", "신뢰", "포용력", "현실감각"],
  기: ["실용성", "배려", "조율능력", "꼼꼼함"],
  경: ["결단력", "정의", "원칙", "용기"],
  신: ["완벽추구", "미적감각", "분석력", "정교함"],
  임: ["지혜", "자유", "포용", "통찰력"],
  계: ["직관", "영감", "감수성", "이해력"],
};

// 용신(오행)별 보완 키워드
const YONGSIN_KEYWORDS: Record<string, string[]> = {
  목: ["성장", "창의", "도전", "새로움"],
  화: ["표현", "열정", "사교", "활력"],
  토: ["안정", "신뢰", "중심", "균형"],
  금: ["결단", "원칙", "정리", "명확"],
  수: ["지혜", "유연", "깊이", "통찰"],
};

// 격국별 직업/재능 키워드
const GEOKGUK_KEYWORDS: Record<string, string[]> = {
  정관격: ["조직력", "책임감", "명예", "안정추구"],
  편관격: ["추진력", "카리스마", "도전", "리더십"],
  정인격: ["학구열", "지혜", "교육", "보호본능"],
  편인격: ["창의력", "직관", "전문성", "독창성"],
  정재격: ["성실", "저축", "계획성", "안정"],
  편재격: ["사업수완", "사교력", "융통성", "대범함"],
  식신격: ["표현력", "여유", "친화력", "낙천성"],
  상관격: ["창의", "언변", "혁신", "비판정신"],
};

export interface CoreKeywords {
  keywords: string[];           // 핵심 키워드 3개
  ilganKeyword: string;         // 일간 기반 키워드
  yongsinKeyword: string;       // 용신 기반 키워드
  geokgukKeyword: string | null; // 격국 기반 키워드
  summary: string;              // 한 줄 요약
  fullDescription: string;      // 상세 설명
}

/**
 * 종합 키워드 추출
 */
export function extractCoreKeywords(
  ilgan: string,
  yongsin: string,
  geokguk: string | null
): CoreKeywords {
  const ilganKws = ILGAN_KEYWORDS[ilgan] || [];
  const yongsinKws = YONGSIN_KEYWORDS[yongsin] || [];
  const geokgukKws = geokguk ? GEOKGUK_KEYWORDS[geokguk] || [] : [];

  // 각 영역에서 하나씩 선택 (랜덤 대신 첫 번째 선택으로 일관성 유지)
  const ilganKeyword = ilganKws[0] || "개성";
  const yongsinKeyword = yongsinKws[0] || "균형";
  const geokgukKeyword = geokgukKws[0] || null;

  const keywords = [
    ilganKeyword,
    yongsinKeyword,
    geokgukKeyword,
  ].filter(Boolean) as string[];

  // 한 줄 요약 생성
  const summary = generateKeywordSummary(ilgan, yongsin, geokguk, keywords);
  const fullDescription = generateFullDescription(ilgan, yongsin, geokguk);

  return {
    keywords,
    ilganKeyword,
    yongsinKeyword,
    geokgukKeyword,
    summary,
    fullDescription,
  };
}

function generateKeywordSummary(
  ilgan: string,
  yongsin: string,
  geokguk: string | null,
  keywords: string[]
): string {
  const ilganTraits = ILGAN_TRAITS[ilgan];
  const ilganType = ilganTraits?.type || "독특한 개성의";

  if (geokguk) {
    const geokgukInfo = GEOKGUK_INFO[geokguk];
    return `${ilganType}으로서 ${yongsin}의 기운을 품고, ${geokgukInfo?.name || "특별한"} 에너지를 발휘합니다.`;
  }

  return `${ilganType}으로서 ${yongsin}의 기운이 삶의 균형을 가져다줍니다.`;
}

function generateFullDescription(
  ilgan: string,
  yongsin: string,
  geokguk: string | null
): string {
  const ilganTraits = ILGAN_TRAITS[ilgan];
  const natureProfile = NATURE_PROFILES[ilgan];

  let description = `당신은 ${natureProfile?.natureImage || "독특한 존재"}와 같은 분입니다. `;
  description += `${ilganTraits?.personality?.slice(0, 50) || "특별한 매력을 가진"} `;
  description += `${yongsin} 기운을 보완하면 더욱 빛날 수 있습니다.`;

  if (geokguk) {
    const geokgukInfo = GEOKGUK_INFO[geokguk];
    description += ` ${geokgukInfo?.description?.slice(0, 50) || ""}`;
  }

  return description;
}

// ============================================
// 통합 스토리 생성기
// ============================================

export interface PersonalityStory {
  natureProfile: NatureProfile;
  coreKeywords: CoreKeywords;
  currentPhase: DaeunStoryPhase;
  poeticIntro: string;
  lifeJourneyNarrative: string;
}

/**
 * 종합 인생 스토리 생성
 */
export function generatePersonalityStory(
  ilgan: string,
  yongsin: string,
  geokguk: string | null,
  currentAge: number
): PersonalityStory {
  const natureProfile = NATURE_PROFILES[ilgan] || NATURE_PROFILES["갑"];
  const coreKeywords = extractCoreKeywords(ilgan, yongsin, geokguk);
  const currentPhase = getDaeunStoryPhase(currentAge);

  const poeticIntro = generatePoeticIntro(natureProfile, coreKeywords);
  const lifeJourneyNarrative = generateLifeJourneyNarrative(
    natureProfile,
    currentPhase,
    coreKeywords
  );

  return {
    natureProfile,
    coreKeywords,
    currentPhase,
    poeticIntro,
    lifeJourneyNarrative,
  };
}

function generatePoeticIntro(
  natureProfile: NatureProfile,
  coreKeywords: CoreKeywords
): string {
  return `${natureProfile.poeticDescription}\n\n당신의 삶을 관통하는 세 가지 키워드: ${coreKeywords.keywords.join(" · ")}`;
}

function generateLifeJourneyNarrative(
  natureProfile: NatureProfile,
  currentPhase: DaeunStoryPhase,
  coreKeywords: CoreKeywords
): string {
  return `${natureProfile.growthStory}\n\n지금 당신은 '${currentPhase.phaseName}'를 지나고 있습니다. ${currentPhase.description}\n\n${coreKeywords.summary}`;
}

// ============================================
// 오행별 감성 메시지
// ============================================

export const OHENG_EMOTIONAL_MESSAGES: Record<string, { emoji: string; message: string }> = {
  목: {
    emoji: "🌿",
    message: "나무처럼 위로 자라며, 주변에 그늘을 드리워주세요.",
  },
  화: {
    emoji: "🔥",
    message: "태양처럼 밝게 빛나며, 세상을 따뜻하게 비춰주세요.",
  },
  토: {
    emoji: "🏔️",
    message: "대지처럼 듬직하게, 모두가 기댈 수 있는 존재가 되세요.",
  },
  금: {
    emoji: "✨",
    message: "보석처럼 빛나며, 진정한 가치를 발휘하세요.",
  },
  수: {
    emoji: "💧",
    message: "물처럼 유연하게, 어디든 스며들어 생명을 전하세요.",
  },
};

// ============================================
// 4.4 대운 십성별 해석 데이터
// ============================================

export type DaeunSipseongType =
  | "비견" | "겁재"
  | "식신" | "상관"
  | "편재" | "정재"
  | "편관" | "정관"
  | "편인" | "정인";

export interface DaeunSipseongInfo {
  name: string;
  hanja: string;
  emoji: string;
  shortDesc: string;           // 한 줄 설명
  theme: string;               // 이 대운의 주제
  // 시점별 해석
  pastInterpretation: string;  // 과거 대운일 때 (배운 것)
  currentInterpretation: string; // 현재 대운일 때 (지금 일어나는 일)
  futureInterpretation: string;  // 미래 대운일 때 (준비할 것)
  // 구체적 조언
  opportunities: string[];     // 기회
  challenges: string[];        // 주의할 점
  actionTips: string[];        // 실천 조언
  // 관계/직업
  relationships: string;       // 인간관계 특성
  career: string;              // 직업/재물 특성
}

export const DAEUN_SIPSEONG_INFO: Record<DaeunSipseongType, DaeunSipseongInfo> = {
  비견: {
    name: "비견운",
    hanja: "比肩運",
    emoji: "🤝",
    shortDesc: "나와 같은 기운, 동료와 경쟁의 시기",
    theme: "자아 확립과 독립",
    pastInterpretation: "형제자매나 친구들과의 관계에서 경쟁과 협력을 배운 시기입니다. 자신만의 정체성을 확립하려 노력했을 것입니다.",
    currentInterpretation: "자신감이 높아지고 독립심이 강해지는 시기입니다. 동료나 친구와 함께하는 활동에서 시너지가 납니다. 다만 경쟁 상황도 늘어날 수 있습니다.",
    futureInterpretation: "독립적인 활동이 좋은 결과를 가져올 시기가 옵니다. 협력할 파트너를 미리 만들어두고, 경쟁에서 이길 수 있는 실력을 키우세요.",
    opportunities: ["동업 및 파트너십", "자기 브랜딩", "네트워킹 확장", "독립/창업"],
    challenges: ["경쟁으로 인한 스트레스", "재물 분산", "고집으로 인한 갈등"],
    actionTips: ["협력할 동료를 만드세요", "경쟁보다 협력에 초점을", "자기만의 영역을 확보하세요"],
    relationships: "친구, 동료와의 관계가 활발해집니다. 비슷한 사람들과 어울리며 자극받습니다.",
    career: "동업, 프리랜서, 독립 사업에 유리합니다. 경쟁이 치열한 분야에서 두각을 나타낼 수 있습니다.",
  },
  겁재: {
    name: "겁재운",
    hanja: "劫財運",
    emoji: "⚡",
    shortDesc: "역동적인 에너지, 도전과 변화의 시기",
    theme: "적극적 행동과 변화",
    pastInterpretation: "역동적이고 변화가 많았던 시기입니다. 재물이 들어오고 나감이 잦았고, 과감한 결정을 내렸을 것입니다.",
    currentInterpretation: "활동적이고 적극적인 에너지가 넘칩니다. 새로운 도전을 두려워하지 않게 됩니다. 단, 재정 관리에 주의가 필요합니다.",
    futureInterpretation: "변화와 도전의 시기가 옵니다. 리스크 관리 능력을 키우고, 충동적인 투자는 피할 수 있도록 준비하세요.",
    opportunities: ["새로운 도전", "적극적인 투자", "변화를 통한 성장", "스포츠/액티비티"],
    challenges: ["재물 손실 가능성", "충동적 결정", "다툼이나 소송"],
    actionTips: ["큰 투자 전 신중히 검토", "저축 습관 유지", "분쟁은 피하세요"],
    relationships: "경쟁적이지만 활력 있는 관계입니다. 라이벌이 친구가 되기도 합니다.",
    career: "영업, 스포츠, 투자 분야에서 활약할 수 있습니다. 변동성이 큰 업종에 적합합니다.",
  },
  식신: {
    name: "식신운",
    hanja: "食神運",
    emoji: "🍀",
    shortDesc: "여유와 표현력, 즐거움의 시기",
    theme: "창의적 표현과 풍요",
    pastInterpretation: "편안하고 여유로운 시기였습니다. 먹고 즐기는 것에 관심이 많았고, 재능을 발휘하며 인정받았을 것입니다.",
    currentInterpretation: "표현력과 창의력이 살아나는 시기입니다. 예술, 요리, 콘텐츠 제작 등에서 빛을 발합니다. 건강하고 여유로운 에너지가 흐릅니다.",
    futureInterpretation: "재능을 꽃피울 시기가 옵니다. 창작 활동이나 표현할 수 있는 채널을 미리 준비해두면 좋습니다.",
    opportunities: ["창작 활동", "맛집/요리 관련", "콘텐츠 제작", "교육/강의"],
    challenges: ["게으름과 나태", "체중 증가", "너무 편한 것만 추구"],
    actionTips: ["창의적 취미를 시작하세요", "표현하는 활동을 늘리세요", "적당한 운동을 병행하세요"],
    relationships: "편안하고 즐거운 관계를 맺습니다. 함께 맛있는 것을 먹으며 친해집니다.",
    career: "요식업, 예술, 교육, 콘텐츠 분야에서 성과를 낼 수 있습니다.",
  },
  상관: {
    name: "상관운",
    hanja: "傷官運",
    emoji: "🎨",
    shortDesc: "창의와 혁신, 기존 틀을 깨는 시기",
    theme: "혁신과 자기표현",
    pastInterpretation: "기존의 틀을 깨고 새로운 시도를 했던 시기입니다. 창의적이었지만 윗사람과 갈등도 있었을 수 있습니다.",
    currentInterpretation: "독창적인 아이디어가 넘치고 표현 욕구가 강해집니다. 기존 방식에 반기를 들고 혁신을 추구합니다. 말과 글로 영향력을 발휘합니다.",
    futureInterpretation: "창의력이 폭발하는 시기가 옵니다. 자기 표현 채널(블로그, 유튜브, 창작 등)을 미리 준비하세요. 윗사람과의 관계도 신경 쓰세요.",
    opportunities: ["창의적 사업", "예술/디자인", "1인 미디어", "프리랜서"],
    challenges: ["윗사람과 갈등", "너무 날카로운 언행", "조직 부적응"],
    actionTips: ["표현하되 상대를 배려하세요", "독립적인 영역을 만드세요", "날카로운 말은 자제"],
    relationships: "솔직하고 직설적인 소통을 합니다. 가식 없는 관계를 추구합니다.",
    career: "작가, 디자이너, 유튜버, 프리랜서 등 창의적이고 독립적인 직종에 유리합니다.",
  },
  편재: {
    name: "편재운",
    hanja: "偏財運",
    emoji: "💰",
    shortDesc: "재물과 사교, 활동적인 시기",
    theme: "재물 활동과 사교",
    pastInterpretation: "돈이 들어오고 나감이 활발했던 시기입니다. 사교 활동이 많았고, 아버지나 남성 어른의 영향이 있었을 수 있습니다.",
    currentInterpretation: "재물 활동이 활발해지고 사교력이 좋아집니다. 투자, 사업, 부업 등에서 기회가 생깁니다. 이성 관계도 활발해질 수 있습니다.",
    futureInterpretation: "재테크나 사업의 기회가 오는 시기입니다. 인맥을 넓혀두고, 투자 공부를 미리 해두면 좋습니다.",
    opportunities: ["투자 수익", "사업 확장", "이성 만남", "넓은 인맥"],
    challenges: ["돈이 새기 쉬움", "바람기 주의", "충동 구매"],
    actionTips: ["수입의 일부는 반드시 저축", "장기 투자 위주로", "유흥비 관리"],
    relationships: "사교적이고 넓은 인맥을 형성합니다. 이성에게 인기가 있습니다.",
    career: "영업, 무역, 투자, 유통 등 돈이 오가는 분야에서 능력을 발휘합니다.",
  },
  정재: {
    name: "정재운",
    hanja: "正財運",
    emoji: "🏦",
    shortDesc: "안정적 재물, 성실함의 시기",
    theme: "안정적 축적과 성실",
    pastInterpretation: "꾸준히 모으고 저축했던 시기입니다. 성실하게 일하며 안정적인 기반을 다졌을 것입니다.",
    currentInterpretation: "정당한 노력에 대한 보상이 주어지는 시기입니다. 월급, 저축, 부동산 등 안정적인 재물이 쌓입니다. 성실함이 빛을 발합니다.",
    futureInterpretation: "안정적인 수입이 예상되는 시기가 옵니다. 저축 계획을 세우고, 부동산 등 장기 자산을 준비해두면 좋습니다.",
    opportunities: ["안정적 수입", "부동산 투자", "승진/연봉 인상", "결혼"],
    challenges: ["재미없고 지루함", "융통성 부족", "기회비용"],
    actionTips: ["장기 재테크 계획 수립", "안정적인 투자 위주로", "작은 사치도 허용하세요"],
    relationships: "안정적이고 책임감 있는 관계를 형성합니다. 결혼에 유리한 시기입니다.",
    career: "공무원, 대기업, 금융, 부동산 등 안정적인 직종에서 성과를 냅니다.",
  },
  편관: {
    name: "편관운",
    hanja: "偏官運",
    emoji: "⚔️",
    shortDesc: "도전과 시련, 성장의 시기",
    theme: "시련을 통한 성장",
    pastInterpretation: "도전과 시련이 많았던 시기입니다. 힘들었지만 그만큼 강해졌고, 위기 대처 능력을 키웠을 것입니다.",
    currentInterpretation: "압박감과 도전이 동시에 오는 시기입니다. 경쟁이 치열하고 스트레스가 있지만, 이를 이겨내면 크게 성장합니다. 리더십이 발휘됩니다.",
    futureInterpretation: "도전적인 시기가 옵니다. 체력과 정신력을 미리 키워두고, 위기 대처 능력을 갖추세요. 힘든 만큼 성장합니다.",
    opportunities: ["승진/권력", "리더 역할", "경쟁에서 승리", "위기 극복 후 도약"],
    challenges: ["스트레스/압박", "건강 문제", "사고/부상 주의", "관재구설"],
    actionTips: ["건강 관리 철저히", "무리하지 말 것", "법적 문제 조심", "스트레스 해소법 마련"],
    relationships: "긴장감 있는 관계가 많습니다. 경쟁자가 생기지만 서로 성장시킵니다.",
    career: "군인, 경찰, 외과의사, 운동선수 등 강인함이 필요한 분야에서 두각을 나타냅니다.",
  },
  정관: {
    name: "정관운",
    hanja: "正官運",
    emoji: "👔",
    shortDesc: "명예와 책임, 안정의 시기",
    theme: "사회적 인정과 책임",
    pastInterpretation: "사회적으로 인정받고 안정된 시기였습니다. 조직에서 역할을 맡았거나, 사회적 지위가 올랐을 것입니다.",
    currentInterpretation: "명예와 지위가 상승하는 시기입니다. 조직에서 인정받고 승진 기회가 옵니다. 사회적 책임도 늘어나지만 보람 있습니다.",
    futureInterpretation: "사회적 인정을 받을 시기가 옵니다. 자격증, 직위, 역할을 준비해두면 좋습니다. 책임질 수 있는 준비를 하세요.",
    opportunities: ["승진", "사회적 인정", "결혼(여성)", "안정적 직장"],
    challenges: ["책임감 부담", "자유 제한", "틀에 박힌 생활"],
    actionTips: ["맡은 바 책임을 다하세요", "신뢰를 쌓으세요", "규칙을 존중하되 유연성도"],
    relationships: "예의 바르고 격식 있는 관계를 형성합니다. 윗사람과의 관계가 좋아집니다.",
    career: "공무원, 대기업 임원, 관리자, 교사 등 사회적 지위와 책임이 따르는 직종에 유리합니다.",
  },
  편인: {
    name: "편인운",
    hanja: "偏印運",
    emoji: "🔮",
    shortDesc: "독특한 지혜, 영적 성장의 시기",
    theme: "비전통적 학습과 통찰",
    pastInterpretation: "독특하고 비전통적인 것에 관심을 가졌던 시기입니다. 특별한 기술이나 지식을 습득했을 수 있습니다.",
    currentInterpretation: "직관력과 통찰력이 높아지는 시기입니다. 특별한 기술, 자격증, 전문 분야에서 두각을 나타냅니다. 영적/철학적 관심도 높아집니다.",
    futureInterpretation: "특별한 재능이 빛을 발할 시기가 옵니다. 전문 기술이나 자격증을 준비해두세요. 명상, 철학 공부도 좋습니다.",
    opportunities: ["전문 기술 습득", "자격증", "영적 성장", "독특한 분야 성공"],
    challenges: ["고독감", "의심병", "현실과 괴리", "건강(소화기)"],
    actionTips: ["전문성을 키우세요", "명상/요가 추천", "현실 감각을 유지하세요"],
    relationships: "깊고 독특한 관계를 추구합니다. 소수의 사람과 깊이 교류합니다.",
    career: "IT, 연구원, 의료, 상담, 종교, 예술 등 전문성이 필요한 분야에서 성과를 냅니다.",
  },
  정인: {
    name: "정인운",
    hanja: "正印運",
    emoji: "📚",
    shortDesc: "학습과 지혜, 보호의 시기",
    theme: "배움과 지혜의 성장",
    pastInterpretation: "공부하고 배우는 것이 즐거웠던 시기입니다. 어머니나 스승의 도움을 받았을 수 있습니다.",
    currentInterpretation: "학습 능력이 극대화되는 시기입니다. 공부, 자격증, 학위 취득에 유리합니다. 지혜로운 사람들의 도움을 받습니다.",
    futureInterpretation: "배움의 기회가 오는 시기입니다. 공부하고 싶은 것, 얻고 싶은 자격증을 미리 정해두세요. 멘토를 찾아두면 좋습니다.",
    opportunities: ["학위/자격증 취득", "멘토와의 만남", "지혜 성장", "문서 관련 이득"],
    challenges: ["행동력 부족", "우유부단", "과보호 경향"],
    actionTips: ["배우고 싶은 것을 시작하세요", "독서를 늘리세요", "배운 것을 실천하세요"],
    relationships: "지적이고 따뜻한 관계를 형성합니다. 어른들의 도움을 잘 받습니다.",
    career: "교육, 학계, 연구, 출판, 상담 등 지식과 관련된 분야에서 빛을 발합니다.",
  },
};

// ============================================
// 4.5 대운 오행별 의미 데이터
// ============================================

export interface DaeunOhengInfo {
  name: string;
  hanja: string;
  emoji: string;
  theme: string;
  energy: string;
  interpretation: string;
  yongsinMatch: string;      // 용신과 일치할 때
  yongsinConflict: string;   // 용신과 상극일 때
  healthFocus: string;       // 건강 주의사항
  luckyAreas: string[];      // 좋은 분야
}

export const DAEUN_OHENG_INFO: Record<string, DaeunOhengInfo> = {
  목: {
    name: "목운",
    hanja: "木運",
    emoji: "🌳",
    theme: "성장과 시작",
    energy: "위로 뻗어나가는 상승 에너지",
    interpretation: "새로운 시작, 성장, 도전의 시기입니다. 계획을 세우고 추진하기 좋습니다. 봄처럼 싹이 트는 때입니다.",
    yongsinMatch: "용신과 일치! 모든 일이 순조롭고 건강하며 발전하는 최고의 시기입니다.",
    yongsinConflict: "용신과 상충됩니다. 무리한 확장은 피하고 현상 유지에 집중하세요.",
    healthFocus: "간, 담, 눈, 근육에 주의하세요.",
    luckyAreas: ["창업", "교육", "출판", "의류", "농업", "가구"],
  },
  화: {
    name: "화운",
    hanja: "火運",
    emoji: "🔥",
    theme: "열정과 표현",
    energy: "위로 타오르는 확산 에너지",
    interpretation: "열정이 넘치고 표현력이 강해지는 시기입니다. 인간관계가 활발해지고 인기가 상승합니다. 적극적으로 나서면 좋습니다.",
    yongsinMatch: "용신과 일치! 열정이 성과로 이어지고, 인기와 명예가 상승합니다.",
    yongsinConflict: "용신과 상충됩니다. 과한 열정이 화를 부를 수 있으니 차분함을 유지하세요.",
    healthFocus: "심장, 혈압, 눈, 소장에 주의하세요.",
    luckyAreas: ["엔터테인먼트", "마케팅", "요식업", "뷰티", "조명", "에너지"],
  },
  토: {
    name: "토운",
    hanja: "土運",
    emoji: "🏔️",
    theme: "안정과 중심",
    energy: "중심을 잡아주는 안정 에너지",
    interpretation: "안정적인 시기입니다. 기반을 다지고 내실을 키우기 좋습니다. 급한 변화보다 꾸준함이 빛을 발합니다.",
    yongsinMatch: "용신과 일치! 안정 속에서 착실한 성장을 이루는 좋은 시기입니다.",
    yongsinConflict: "용신과 상충됩니다. 지나친 보수적 태도가 기회를 놓칠 수 있으니 적당한 변화도 수용하세요.",
    healthFocus: "비장, 위장, 피부, 근육에 주의하세요.",
    luckyAreas: ["부동산", "건설", "농업", "창고", "중개", "요식업"],
  },
  금: {
    name: "금운",
    hanja: "金運",
    emoji: "⚔️",
    theme: "결단과 정리",
    energy: "수렴하고 정리하는 에너지",
    interpretation: "결단력이 생기고 정리정돈의 시기입니다. 불필요한 것을 버리고 핵심에 집중하세요. 원칙과 정의가 중요해집니다.",
    yongsinMatch: "용신과 일치! 명확한 판단력으로 좋은 성과를 내는 시기입니다.",
    yongsinConflict: "용신과 상충됩니다. 너무 냉정하면 관계가 상할 수 있으니 유연함도 필요합니다.",
    healthFocus: "폐, 대장, 피부, 호흡기에 주의하세요.",
    luckyAreas: ["금융", "법률", "군경", "금속", "기계", "자동차"],
  },
  수: {
    name: "수운",
    hanja: "水運",
    emoji: "💧",
    theme: "지혜와 유연함",
    energy: "아래로 스며드는 유연 에너지",
    interpretation: "지혜롭고 유연해지는 시기입니다. 깊이 생각하고 내면을 성찰하기 좋습니다. 흐르는 물처럼 상황에 적응하세요.",
    yongsinMatch: "용신과 일치! 지혜가 빛나고 모든 것이 순리대로 흘러가는 좋은 시기입니다.",
    yongsinConflict: "용신과 상충됩니다. 우유부단함을 경계하고 때로는 결단도 필요합니다.",
    healthFocus: "신장, 방광, 생식기, 귀에 주의하세요.",
    luckyAreas: ["IT", "물류", "유통", "수산업", "음료", "여행"],
  },
};

// ============================================
// 4.6 대운 분석 함수들
// ============================================

// 천간 정보 (오행, 음양)
const CHEONGAN_INFO: Record<string, { element: string; yin: boolean }> = {
  갑: { element: "목", yin: false },
  을: { element: "목", yin: true },
  병: { element: "화", yin: false },
  정: { element: "화", yin: true },
  무: { element: "토", yin: false },
  기: { element: "토", yin: true },
  경: { element: "금", yin: false },
  신: { element: "금", yin: true },
  임: { element: "수", yin: false },
  계: { element: "수", yin: true },
};

// 오행 상생 관계
const OHENG_GENERATE: Record<string, string> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목"
};

// 오행 상극 관계
const OHENG_CONTROL: Record<string, string> = {
  목: "토", 토: "수", 수: "화", 화: "금", 금: "목"
};

// 나를 생하는 오행
const OHENG_GENERATED_BY: Record<string, string> = {
  목: "수", 화: "목", 토: "화", 금: "토", 수: "금"
};

// 나를 극하는 오행
const OHENG_CONTROLLED_BY: Record<string, string> = {
  목: "금", 화: "수", 토: "목", 금: "화", 수: "토"
};

/**
 * 일간과 대운 천간의 십성 관계 계산
 */
export function calculateDaeunSipseong(ilgan: string, daeunCheongan: string): DaeunSipseongType {
  const ilganInfo = CHEONGAN_INFO[ilgan];
  const daeunInfo = CHEONGAN_INFO[daeunCheongan];

  if (!ilganInfo || !daeunInfo) return "비견";

  const sameYin = ilganInfo.yin === daeunInfo.yin;

  // 같은 오행
  if (ilganInfo.element === daeunInfo.element) {
    return sameYin ? "비견" : "겁재";
  }

  // 내가 생하는 오행
  if (OHENG_GENERATE[ilganInfo.element] === daeunInfo.element) {
    return sameYin ? "식신" : "상관";
  }

  // 내가 극하는 오행
  if (OHENG_CONTROL[ilganInfo.element] === daeunInfo.element) {
    return sameYin ? "편재" : "정재";
  }

  // 나를 극하는 오행
  if (OHENG_CONTROLLED_BY[ilganInfo.element] === daeunInfo.element) {
    return sameYin ? "편관" : "정관";
  }

  // 나를 생하는 오행
  if (OHENG_GENERATED_BY[ilganInfo.element] === daeunInfo.element) {
    return sameYin ? "편인" : "정인";
  }

  return "비견";
}

/**
 * 용신과 대운 오행의 관계 판단
 */
export type DaeunFortuneLevel = "최길" | "길" | "평" | "흉" | "최흉";

export function evaluateDaeunFortune(yongsin: string, daeunElement: string): {
  level: DaeunFortuneLevel;
  emoji: string;
  description: string;
} {
  // 용신과 같은 오행
  if (yongsin === daeunElement) {
    return {
      level: "최길",
      emoji: "⭐",
      description: "용신 대운! 가장 좋은 시기입니다."
    };
  }

  // 용신을 생하는 오행
  if (OHENG_GENERATE[daeunElement] === yongsin) {
    return {
      level: "길",
      emoji: "🍀",
      description: "용신을 도와주는 좋은 시기입니다."
    };
  }

  // 용신이 생하는 오행 (설기)
  if (OHENG_GENERATE[yongsin] === daeunElement) {
    return {
      level: "평",
      emoji: "😐",
      description: "무난한 시기입니다. 에너지 분산에 주의하세요."
    };
  }

  // 용신을 극하는 오행
  if (OHENG_CONTROL[daeunElement] === yongsin) {
    return {
      level: "흉",
      emoji: "⚠️",
      description: "용신과 충돌합니다. 주의가 필요한 시기입니다."
    };
  }

  // 용신에게 극을 당하는 오행
  if (OHENG_CONTROL[yongsin] === daeunElement) {
    return {
      level: "평",
      emoji: "😐",
      description: "큰 문제는 없지만 적극적인 추진은 피하세요."
    };
  }

  return {
    level: "평",
    emoji: "😐",
    description: "평범한 시기입니다."
  };
}

/**
 * 대운 종합 분석 결과 인터페이스
 */
export interface EnrichedDaeunInfo {
  // 기본 대운 정보
  ganji: string;
  cheongan: string;
  jiji: string;
  element: string;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  // 십성 분석
  sipseong: DaeunSipseongType;
  sipseongInfo: DaeunSipseongInfo;
  // 오행 분석
  ohengInfo: DaeunOhengInfo;
  // 용신 관계
  fortuneLevel: DaeunFortuneLevel;
  fortuneEmoji: string;
  fortuneDescription: string;
  // 시점
  timeStatus: "past" | "current" | "future";
  // 일반 스토리
  story: DaeunStoryPhase;
}

/**
 * 대운에 상세 분석 정보 추가
 */
export function enrichDaeunInfo(
  daeun: MajorFortuneInfo,
  ilgan: string,
  yongsin: string,
  currentAge: number,
  birthYear?: number
): EnrichedDaeunInfo {
  const cheongan = daeun.ganji.charAt(0);
  const jiji = daeun.ganji.charAt(1);

  // 십성 계산
  const sipseong = calculateDaeunSipseong(ilgan, cheongan);
  const sipseongInfo = DAEUN_SIPSEONG_INFO[sipseong];

  // 오행 정보
  const ohengInfo = DAEUN_OHENG_INFO[daeun.element] || DAEUN_OHENG_INFO["토"];

  // 용신과의 관계
  const fortune = evaluateDaeunFortune(yongsin, daeun.element);

  // 시점 판단
  let timeStatus: "past" | "current" | "future";
  if (currentAge > daeun.endAge) {
    timeStatus = "past";
  } else if (currentAge >= daeun.startAge && currentAge <= daeun.endAge) {
    timeStatus = "current";
  } else {
    timeStatus = "future";
  }

  // 일반 스토리
  const story = getDaeunStoryPhase(daeun.startAge);

  // 연도 계산 (birthYear가 제공된 경우)
  const currentYear = new Date().getFullYear();
  const calculatedBirthYear = birthYear || (currentYear - currentAge + 1);
  const startYear = calculatedBirthYear + daeun.startAge - 1;
  const endYear = calculatedBirthYear + daeun.endAge - 1;

  return {
    ganji: daeun.ganji,
    cheongan,
    jiji,
    element: daeun.element,
    startAge: daeun.startAge,
    endAge: daeun.endAge,
    startYear,
    endYear,
    sipseong,
    sipseongInfo,
    ohengInfo,
    fortuneLevel: fortune.level,
    fortuneEmoji: fortune.emoji,
    fortuneDescription: fortune.description,
    timeStatus,
    story,
  };
}
