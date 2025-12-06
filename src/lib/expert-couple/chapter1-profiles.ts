/**
 * 제1장: 두 사람의 명식
 * 각자의 사주 팔자와 일간 관계 분석
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter1Result } from "@/types/expert-couple";
import type { PillarExpertAnalysis } from "@/types/expert";

// 천간 한글 → 한자 매핑
const CHEONGAN_TO_HANJA: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

// 지지 한글 → 한자 매핑
const JIJI_TO_HANJA: Record<string, string> = {
  자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳",
  오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥",
};

// 천간 오행 매핑
const CHEONGAN_OHENG: Record<string, string> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

// 천간 음양 매핑
const CHEONGAN_YINYANG: Record<string, string> = {
  갑: "양", 병: "양", 무: "양", 경: "양", 임: "양",
  을: "음", 정: "음", 기: "음", 신: "음", 계: "음",
};

// 천간별 상세 해석
const CHEONGAN_ANALYSIS: Record<string, { stem: string; meaning: string; character: string }> = {
  갑: { stem: "甲木", meaning: "큰 나무, 대들보", character: "진취적이고 정의로우며 리더십이 있음" },
  을: { stem: "乙木", meaning: "꽃, 덩굴", character: "유연하고 적응력이 좋으며 예술적 감각이 있음" },
  병: { stem: "丙火", meaning: "태양", character: "밝고 적극적이며 열정적임" },
  정: { stem: "丁火", meaning: "촛불, 달빛", character: "섬세하고 따뜻하며 배려심이 깊음" },
  무: { stem: "戊土", meaning: "큰 산, 대지", character: "듬직하고 신뢰감이 있으며 포용력이 넓음" },
  기: { stem: "己土", meaning: "밭, 정원", character: "꼼꼼하고 현실적이며 실용적임" },
  경: { stem: "庚金", meaning: "바위, 칼", character: "강인하고 결단력이 있으며 원칙적임" },
  신: { stem: "辛金", meaning: "보석, 바늘", character: "예리하고 세련되며 완벽주의적임" },
  임: { stem: "壬水", meaning: "큰 강, 바다", character: "지혜롭고 유연하며 포용력이 있음" },
  계: { stem: "癸水", meaning: "비, 이슬", character: "직관적이고 감성적이며 창의적임" },
};

// 지지별 상세 해석
const JIJI_ANALYSIS: Record<string, { branch: string; meaning: string; character: string }> = {
  자: { branch: "子水", meaning: "쥐, 한밤", character: "영리하고 직관적이며 적응력이 좋음" },
  축: { branch: "丑土", meaning: "소, 새벽", character: "성실하고 우직하며 끈기가 있음" },
  인: { branch: "寅木", meaning: "호랑이, 이른 아침", character: "용맹하고 진취적이며 리더십이 있음" },
  묘: { branch: "卯木", meaning: "토끼, 아침", character: "온화하고 예민하며 예술적임" },
  진: { branch: "辰土", meaning: "용, 늦은 아침", character: "카리스마 있고 변화무쌍하며 야망이 있음" },
  사: { branch: "巳火", meaning: "뱀, 한낮", character: "지혜롭고 신중하며 통찰력이 있음" },
  오: { branch: "午火", meaning: "말, 정오", character: "활발하고 열정적이며 사교적임" },
  미: { branch: "未土", meaning: "양, 오후", character: "온순하고 예술적이며 헌신적임" },
  신: { branch: "申金", meaning: "원숭이, 늦은 오후", character: "영리하고 재치있으며 다재다능함" },
  유: { branch: "酉金", meaning: "닭, 저녁", character: "꼼꼼하고 완벽주의적이며 분석적임" },
  술: { branch: "戌土", meaning: "개, 초저녁", character: "충직하고 정의로우며 책임감이 강함" },
  해: { branch: "亥水", meaning: "돼지, 밤", character: "낙천적이고 관대하며 정직함" },
};

// 일간 관계 (십신)
const ILGAN_RELATION: Record<string, Record<string, { type: string; hanja: string; description: string }>> = {
  갑: {
    갑: { type: "비견", hanja: "比肩", description: "동등한 경쟁 관계" },
    을: { type: "겁재", hanja: "劫財", description: "비슷하지만 경쟁적" },
    병: { type: "식신", hanja: "食神", description: "자연스러운 지원" },
    정: { type: "상관", hanja: "傷官", description: "창의적 표현" },
    무: { type: "편재", hanja: "偏財", description: "현실적 파트너십" },
    기: { type: "정재", hanja: "正財", description: "안정적 인연" },
    경: { type: "편관", hanja: "偏官", description: "긴장과 통제" },
    신: { type: "정관", hanja: "正官", description: "책임감 있는 관계" },
    임: { type: "편인", hanja: "偏印", description: "지적 교감" },
    계: { type: "정인", hanja: "正印", description: "정서적 안정" },
  },
  을: {
    갑: { type: "겁재", hanja: "劫財", description: "비슷하지만 보완적" },
    을: { type: "비견", hanja: "比肩", description: "같은 성향으로 공감" },
    병: { type: "상관", hanja: "傷官", description: "창의적 조합" },
    정: { type: "식신", hanja: "食神", description: "편안한 관계" },
    무: { type: "정재", hanja: "正財", description: "안정적 인연" },
    기: { type: "편재", hanja: "偏財", description: "현실적 도움" },
    경: { type: "정관", hanja: "正官", description: "통제와 규율" },
    신: { type: "편관", hanja: "偏官", description: "긴장 관계" },
    임: { type: "정인", hanja: "正印", description: "정서적 교감" },
    계: { type: "편인", hanja: "偏印", description: "지적 연결" },
  },
  병: {
    갑: { type: "편인", hanja: "偏印", description: "지원받는 관계" },
    을: { type: "정인", hanja: "正印", description: "정서적 안정" },
    병: { type: "비견", hanja: "比肩", description: "열정의 충돌" },
    정: { type: "겁재", hanja: "劫財", description: "경쟁적 열정" },
    무: { type: "식신", hanja: "食神", description: "자연스러운 흐름" },
    기: { type: "상관", hanja: "傷官", description: "창의적 표현" },
    경: { type: "편재", hanja: "偏財", description: "현실적 파트너" },
    신: { type: "정재", hanja: "正財", description: "안정적 결합" },
    임: { type: "편관", hanja: "偏官", description: "극과 극" },
    계: { type: "정관", hanja: "正官", description: "억제 관계" },
  },
  정: {
    갑: { type: "정인", hanja: "正印", description: "따뜻한 지지" },
    을: { type: "편인", hanja: "偏印", description: "지적 교류" },
    병: { type: "겁재", hanja: "劫財", description: "열정 경쟁" },
    정: { type: "비견", hanja: "比肩", description: "같은 불꽃" },
    무: { type: "상관", hanja: "傷官", description: "창의적 소통" },
    기: { type: "식신", hanja: "食神", description: "편안한 케어" },
    경: { type: "정재", hanja: "正財", description: "이상적 결합" },
    신: { type: "편재", hanja: "偏財", description: "실질적 관계" },
    임: { type: "정관", hanja: "正官", description: "규율 관계" },
    계: { type: "편관", hanja: "偏官", description: "긴장 관계" },
  },
  무: {
    갑: { type: "편관", hanja: "偏官", description: "목극토 충돌" },
    을: { type: "정관", hanja: "正官", description: "통제 관계" },
    병: { type: "편인", hanja: "偏印", description: "에너지 받음" },
    정: { type: "정인", hanja: "正印", description: "따뜻한 지지" },
    무: { type: "비견", hanja: "比肩", description: "같은 땅" },
    기: { type: "겁재", hanja: "劫財", description: "비슷한 성향" },
    경: { type: "식신", hanja: "食神", description: "자연스러운 흐름" },
    신: { type: "상관", hanja: "傷官", description: "창의적 표현" },
    임: { type: "편재", hanja: "偏財", description: "재물 인연" },
    계: { type: "정재", hanja: "正財", description: "안정적 결합" },
  },
  기: {
    갑: { type: "정관", hanja: "正官", description: "규율 관계" },
    을: { type: "편관", hanja: "偏官", description: "목극토 긴장" },
    병: { type: "정인", hanja: "正印", description: "따뜻한 안정" },
    정: { type: "편인", hanja: "偏印", description: "지적 교류" },
    무: { type: "겁재", hanja: "劫財", description: "비슷한 성향" },
    기: { type: "비견", hanja: "比肩", description: "같은 흙" },
    경: { type: "상관", hanja: "傷官", description: "창의적 조합" },
    신: { type: "식신", hanja: "食神", description: "편안한 관계" },
    임: { type: "정재", hanja: "正財", description: "이상적 결합" },
    계: { type: "편재", hanja: "偏財", description: "현실적 도움" },
  },
  경: {
    갑: { type: "편재", hanja: "偏財", description: "재물 인연" },
    을: { type: "정재", hanja: "正財", description: "안정적 결합" },
    병: { type: "편관", hanja: "偏官", description: "화극금 충돌" },
    정: { type: "정관", hanja: "正官", description: "통제 관계" },
    무: { type: "편인", hanja: "偏印", description: "지원 받음" },
    기: { type: "정인", hanja: "正印", description: "정서적 안정" },
    경: { type: "비견", hanja: "比肩", description: "같은 금속" },
    신: { type: "겁재", hanja: "劫財", description: "경쟁 관계" },
    임: { type: "식신", hanja: "食神", description: "자연스러운 흐름" },
    계: { type: "상관", hanja: "傷官", description: "창의적 소통" },
  },
  신: {
    갑: { type: "정재", hanja: "正財", description: "이상적 결합" },
    을: { type: "편재", hanja: "偏財", description: "재물 인연" },
    병: { type: "정관", hanja: "正官", description: "억제 관계" },
    정: { type: "편관", hanja: "偏官", description: "화극금 긴장" },
    무: { type: "정인", hanja: "正印", description: "따뜻한 지지" },
    기: { type: "편인", hanja: "偏印", description: "지적 교류" },
    경: { type: "겁재", hanja: "劫財", description: "경쟁적" },
    신: { type: "비견", hanja: "比肩", description: "같은 성향" },
    임: { type: "상관", hanja: "傷官", description: "창의적 조합" },
    계: { type: "식신", hanja: "食神", description: "편안한 관계" },
  },
  임: {
    갑: { type: "식신", hanja: "食神", description: "자연스러운 지원" },
    을: { type: "상관", hanja: "傷官", description: "창의적 소통" },
    병: { type: "편재", hanja: "偏財", description: "재물 인연" },
    정: { type: "정재", hanja: "正財", description: "안정적 결합" },
    무: { type: "편관", hanja: "偏官", description: "토극수 충돌" },
    기: { type: "정관", hanja: "正官", description: "통제 관계" },
    경: { type: "편인", hanja: "偏印", description: "지원 관계" },
    신: { type: "정인", hanja: "正印", description: "정서적 안정" },
    임: { type: "비견", hanja: "比肩", description: "같은 물" },
    계: { type: "겁재", hanja: "劫財", description: "비슷한 성향" },
  },
  계: {
    갑: { type: "상관", hanja: "傷官", description: "창의적 표현" },
    을: { type: "식신", hanja: "食神", description: "자연스러운 케어" },
    병: { type: "정재", hanja: "正財", description: "이상적 결합" },
    정: { type: "편재", hanja: "偏財", description: "재물 인연" },
    무: { type: "정관", hanja: "正官", description: "규율 관계" },
    기: { type: "편관", hanja: "偏官", description: "토극수 긴장" },
    경: { type: "정인", hanja: "正印", description: "따뜻한 안정" },
    신: { type: "편인", hanja: "偏印", description: "지적 교류" },
    임: { type: "겁재", hanja: "劫財", description: "비슷한 성향" },
    계: { type: "비견", hanja: "比肩", description: "같은 물" },
  },
};

/**
 * 기둥 분석 생성
 */
function createPillarAnalysis(
  pillar: { cheongan: string; jiji: string; cheonganOheng: string; jijiOheng: string },
  position: string
): PillarExpertAnalysis {
  const cheonganInfo = CHEONGAN_ANALYSIS[pillar.cheongan] || { stem: pillar.cheongan, meaning: "", character: "" };
  const jijiInfo = JIJI_ANALYSIS[pillar.jiji] || { branch: pillar.jiji, meaning: "", character: "" };

  // 한자 변환
  const stemHanja = CHEONGAN_TO_HANJA[pillar.cheongan] || pillar.cheongan;
  const branchHanja = JIJI_TO_HANJA[pillar.jiji] || pillar.jiji;

  return {
    ganZhi: {
      stem: stemHanja as import("@/types/saju").HeavenlyStem,
      stemKr: pillar.cheongan as import("@/types/saju").HeavenlyStemKr,
      branch: branchHanja as import("@/types/saju").EarthlyBranch,
      branchKr: pillar.jiji as import("@/types/saju").EarthlyBranchKr,
      fullHanja: `${stemHanja}${branchHanja}`,
      fullKr: `${pillar.cheongan}${pillar.jiji}`,
    },
    stemAnalysis: `${cheonganInfo.stem}은(는) ${cheonganInfo.meaning}을(를) 상징하며, ${cheonganInfo.character}`,
    branchAnalysis: `${jijiInfo.branch}는 ${jijiInfo.meaning}을(를) 의미하며, ${jijiInfo.character}`,
    combinedMeaning: `${position}의 ${pillar.cheongan}${pillar.jiji}는 ${cheonganInfo.meaning}과 ${jijiInfo.meaning}의 결합으로, ${position}에서의 기운과 운명의 흐름을 나타냅니다.`,
    lifeStage: position === "년주" ? "유년기 (0-15세)" : position === "월주" ? "청년기 (15-30세)" : position === "일주" ? "중년기 (30-45세)" : "장년기 (45세 이후)",
    symbolism: `${pillar.cheonganOheng}(${pillar.cheongan})과 ${pillar.jijiOheng}(${pillar.jiji})의 조화`,
  };
}

/**
 * 제1장: 두 사람의 명식 분석
 */
export function analyzeCouple1(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter1Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  // 일간 관계 분석
  const relation = ILGAN_RELATION[ilgan1]?.[ilgan2] || {
    type: "불명",
    hanja: "不明",
    description: "분석 불가",
  };

  // 일간 오행
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1] || "토";
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2] || "토";

  // 기둥 분석 생성
  const createPersonPillars = (saju: SajuApiResult) => ({
    year: createPillarAnalysis(saju.yearPillar, "년주"),
    month: createPillarAnalysis(saju.monthPillar, "월주"),
    day: createPillarAnalysis(saju.dayPillar, "일주"),
    hour: saju.timePillar.cheongan ? createPillarAnalysis(saju.timePillar, "시주") : null,
  });

  return {
    person1: {
      name: person1Name,
      pillars: createPersonPillars(person1),
      ilganElement: ilgan1Oheng as import("@/types/saju").FiveElementKr,
      ilganAnalysis: CHEONGAN_ANALYSIS[ilgan1]?.character || "",
    },
    person2: {
      name: person2Name,
      pillars: createPersonPillars(person2),
      ilganElement: ilgan2Oheng as import("@/types/saju").FiveElementKr,
      ilganAnalysis: CHEONGAN_ANALYSIS[ilgan2]?.character || "",
    },
    ilganRelation: {
      type: relation.type,
      description: `${person1Name}의 일간 ${ilgan1}과 ${person2Name}의 일간 ${ilgan2}는 ${relation.type}(${relation.hanja}) 관계입니다.`,
      basicCompatibility: relation.description,
    },
    narrative: {
      intro: `두 분의 사주 명식을 살펴보겠습니다. ${person1Name}님과 ${person2Name}님은 각자 고유한 사주 구조를 가지고 있으며, 이를 통해 두 분의 관계가 어떤 특성을 가지는지 알 수 있습니다.`,
      mainAnalysis: `${person1Name}님의 일간은 ${ilgan1}(${ilgan1Oheng})으로 ${CHEONGAN_ANALYSIS[ilgan1]?.meaning || ""}을(를) 상징합니다. ${CHEONGAN_ANALYSIS[ilgan1]?.character || ""} 반면, ${person2Name}님의 일간은 ${ilgan2}(${ilgan2Oheng})으로 ${CHEONGAN_ANALYSIS[ilgan2]?.meaning || ""}을(를) 상징하며, ${CHEONGAN_ANALYSIS[ilgan2]?.character || ""}`,
      details: [
        `일간 관계: ${relation.type}(${relation.hanja}) - ${relation.description}`,
        `${person1Name}님의 핵심 기운: ${ilgan1Oheng}(${ilgan1})`,
        `${person2Name}님의 핵심 기운: ${ilgan2Oheng}(${ilgan2})`,
      ],
      advice: `두 분의 일간 관계를 이해하면 서로를 더 깊이 이해할 수 있습니다. ${relation.type} 관계의 특성을 잘 활용하시면 더 좋은 관계를 만들어갈 수 있습니다.`,
      closing: `다음 장에서는 두 분의 전체적인 궁합 점수와 등급을 살펴보겠습니다.`,
    },
  };
}
