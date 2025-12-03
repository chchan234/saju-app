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
