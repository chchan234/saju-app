/**
 * 제8장: 연도별 운세 (歲運/세운) 분석
 *
 * 주요 분석 내용:
 * 1. 10년 세운 예측
 * 2. 현재 연도 상세 분석
 * 3. 대운+세운 조합 분석
 * 4. 최고의 해 / 도전적인 해
 */

import type { SajuApiResult, FiveElement, GanZhi, Gender } from "@/types/saju";
import type {
  Chapter8Result,
  YearlyFortuneDetailedAnalysis,
  MonthlyFortune,
} from "@/types/expert";

// ==================== 타입 정의 ====================

type FiveElementKey = "목" | "화" | "토" | "금" | "수";
type HeavenlyStem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
type EarthlyBranch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";
type EarthlyBranchKr = "자" | "축" | "인" | "묘" | "진" | "사" | "오" | "미" | "신" | "유" | "술" | "해";

// ==================== 상수 정의 ====================

const STEMS_KR: HeavenlyStemKr[] = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const BRANCHES_KR: EarthlyBranchKr[] = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

const STEM_HANJA: Record<HeavenlyStemKr, HeavenlyStem> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊",
  기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};

const BRANCH_HANJA: Record<EarthlyBranchKr, EarthlyBranch> = {
  자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳",
  오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥",
};

const STEM_ELEMENTS: Record<HeavenlyStemKr, FiveElement> = {
  갑: "wood", 을: "wood",
  병: "fire", 정: "fire",
  무: "earth", 기: "earth",
  경: "metal", 신: "metal",
  임: "water", 계: "water",
};

const BRANCH_ELEMENTS: Record<EarthlyBranchKr, FiveElement> = {
  자: "water", 축: "earth", 인: "wood", 묘: "wood",
  진: "earth", 사: "fire", 오: "fire", 미: "earth",
  신: "metal", 유: "metal", 술: "earth", 해: "water",
};

const ELEMENT_KR_TO_EN: Record<FiveElementKey, FiveElement> = {
  목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water",
};

const ELEMENT_EN_TO_KR: Record<FiveElement, FiveElementKey> = {
  wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
};

// 오행 생극 관계 (영문 기준)
const ELEMENT_RELATIONS: Record<
  FiveElement,
  { generates: FiveElement; controls: FiveElement; generatedBy: FiveElement; controlledBy: FiveElement }
> = {
  wood: { generates: "fire", controls: "earth", generatedBy: "water", controlledBy: "metal" },
  fire: { generates: "earth", controls: "metal", generatedBy: "wood", controlledBy: "water" },
  earth: { generates: "metal", controls: "water", generatedBy: "fire", controlledBy: "wood" },
  metal: { generates: "water", controls: "wood", generatedBy: "earth", controlledBy: "fire" },
  water: { generates: "wood", controls: "fire", generatedBy: "metal", controlledBy: "earth" },
};

// 년운 키워드
const YEAR_KEYWORDS: Record<FiveElement, Record<FiveElement, string>> = {
  wood: {
    wood: "성장·확장",
    fire: "발전·빛남",
    earth: "개척·도전",
    metal: "시련·단련",
    water: "지원·성장",
  },
  fire: {
    wood: "에너지·활력",
    fire: "정열·성공",
    earth: "결실·안정",
    metal: "긴장·갈등",
    water: "억제·조절",
  },
  earth: {
    wood: "압박·변화",
    fire: "발전·확장",
    earth: "안정·신뢰",
    metal: "결실·수확",
    water: "도전·관리",
  },
  metal: {
    wood: "극복·성장",
    fire: "시련·정화",
    earth: "지원·안정",
    metal: "단단·강화",
    water: "발휘·표현",
  },
  water: {
    wood: "시작·기획",
    fire: "극복·도전",
    earth: "억제·통제",
    metal: "지원·흐름",
    water: "지혜·유연",
  },
};

// 신강신약 타입 정의
type StrengthType = "신강" | "신약" | "중화";

// 세운 오행별 × 신강신약별 상세 운세 해석 (75조합 = 5오행 × 3신강신약 × 5분야)
const SEUN_STRENGTH_NARRATIVES: Record<FiveElement, Record<StrengthType, {
  overall: string;
  career: string;
  wealth: string;
  health: string;
  relationship: string;
}>> = {
  wood: {
    신강: {
      overall: "신강 사주에 목(木) 세운이 왔습니다. 올해는 성장과 확장의 에너지가 강하게 작용하는 해입니다. 신강한 분에게는 이미 강한 기운에 목의 성장 에너지가 더해져 매우 활발한 한 해가 될 것입니다. 다만 에너지가 과해지지 않도록 적절한 조절이 필요합니다.",
      career: "올해 직업운은 새로운 시작과 도전에 유리한 해입니다. 신규 프로젝트, 창업, 사업 확장 등에서 성과를 기대할 수 있습니다. 다만 지나친 확장 욕심은 금물이며, 체계적인 계획 하에 추진하기 바랍니다. 교육, 출판, 환경 관련 분야에서 특히 두각을 나타내실 수 있습니다. 리더십을 발휘하되 독단적 결정은 피하세요.",
      wealth: "올해 재물운은 적극적인 투자에 적합한 해입니다. 성장형 자산에 투자하면 좋은 수익을 기대할 수 있습니다. 다만 과도한 투자는 삼가고 리스크 관리에 신경 쓰세요. 새로운 수입원을 개척할 수 있으며, 부업이나 사이드 비즈니스도 고려해 볼 만합니다. 지출 관리도 중요합니다.",
      health: "올해 건강운에서는 간(肝)과 담(膽) 건강에 특히 주의해야 합니다. 에너지가 넘치는 만큼 과로에 주의하고, 스트레스 관리가 중요합니다. 분노나 짜증을 억누르지 말고 적절히 해소하세요. 스트레칭, 요가, 산책 등 유연성 운동이 좋으며, 술은 줄이는 것이 좋습니다.",
      relationship: "올해 인간관계운은 적극적으로 인맥을 확장하기 좋은 해입니다. 새로운 만남이 많고 네트워킹 기회가 풍부합니다. 다만 지나친 주장이나 고집으로 갈등이 생길 수 있으니 경청하는 자세가 필요합니다. 후배나 아랫사람과의 관계에서 멘토 역할을 하면 보람을 느낄 수 있습니다."
    },
    신약: {
      overall: "신약 사주에 목(木) 세운이 왔습니다. 올해는 그동안 위축되었던 기운이 회복되고 새로운 활력을 얻는 해입니다. 신약한 분에게 목 세운은 생명력과 자신감을 불어넣어 주는 좋은 시기입니다. 자신감을 가지고 적극적으로 나아가기 바랍니다.",
      career: "올해 직업운은 그동안 기회를 잡지 못했던 사람들에게 새로운 전환점이 됩니다. 승진, 이직, 새로운 프로젝트 참여 등의 기회가 올 수 있습니다. 처음에는 부담스러우실 수 있지만 점차 자신감이 생깁니다. 창의적인 분야, 교육, 기획 업무에서 능력을 인정받을 수 있습니다.",
      wealth: "올해 재물운은 서서히 좋아지는 흐름입니다. 급격한 재물 증가보다는 꾸준한 성장이 기대됩니다. 종잣돈을 마련하기 좋은 해이며, 새로운 부업이나 추가 수입원을 개척할 수 있습니다. 무리한 투자나 빚은 피하고, 저축에 집중하기 바랍니다.",
      health: "올해 건강운은 간과 담 기능이 회복되면서 전반적인 체력이 좋아집니다. 그동안 허약했던 사람들도 활력이 생기고 면역력이 강화됩니다. 다만 갑자기 무리하면 안 되고 서서히 운동량을 늘려가세요. 녹색 채소와 신맛 나는 음식이 도움이 됩니다.",
      relationship: "올해 인간관계운은 그동안 조용했던 사회생활이 활발해지는 해입니다. 새로운 친구, 동료, 멘토를 만나실 수 있으며, 이들이 인생에 긍정적인 영향을 미칩니다. 적극적으로 모임에 참여하고 자신을 표현하세요. 연애 운도 상승합니다."
    },
    중화: {
      overall: "중화 사주에 목(木) 세운이 왔습니다. 올해는 균형 잡힌 성장과 발전이 이루어지는 해입니다. 안정 속에서 새로운 기회를 찾을 수 있으며, 무리하지 않으면서도 의미 있는 발전을 이룰 수 있습니다.",
      career: "올해 직업운은 안정 속에서 성장하는 해입니다. 현재 직장에서의 승진이나 역할 확대가 자연스럽게 이루어지며, 새로운 프로젝트를 맡으시게 됩니다. 창업보다는 기존 기반 위에서의 확장이 유리합니다. 교육, 기획 관련 업무에서 능력을 발휘합니다.",
      wealth: "올해 재물운은 안정적인 성장세를 보입니다. 급격한 증가보다는 꾸준한 수입 증가와 자산 형성이 이루어집니다. 적립식 투자, 장기 펀드가 적합하며, 무리한 투자보다는 여유 자금 내에서 안전하게 운용하는 것이 좋습니다.",
      health: "올해 건강운은 전반적으로 양호합니다. 간과 담 건강도 무난하며 체력이 꾸준히 유지됩니다. 규칙적인 생활 습관을 유지하고, 가벼운 운동과 스트레칭을 꾸준히 하면 건강을 잘 유지할 수 있습니다.",
      relationship: "올해 인간관계운은 안정 속에서 새로운 인연이 더해지는 해입니다. 기존 관계는 더욱 돈독해지고, 새로운 만남도 자연스럽게 이루어집니다. 사교 모임이나 취미 활동을 통해 다양한 사람들을 만나면 좋습니다."
    }
  },
  fire: {
    신강: {
      overall: "신강 사주에 화(火) 세운이 왔습니다. 올해는 열정과 표현력이 극대화되는 해입니다. 신강한 분에게 화 세운은 매우 활발하고 화려한 한 해를 예고합니다. 다만 에너지가 과열되지 않도록 조절하는 것이 중요합니다.",
      career: "올해 직업운은 화려한 활약이 기대되는 해입니다. 마케팅, 홍보, 영업, 엔터테인먼트 등 표현하는 분야에서 크게 성공할 수 있습니다. 프레젠테이션, 강연 등에서 빛을 발하며 인지도가 상승합니다. 다만 지나친 욕심이나 조급함은 피하세요.",
      wealth: "올해 재물운은 수입이 늘어나지만 지출도 함께 증가하는 해입니다. 화려한 소비 욕구가 강해지므로 과소비에 주의해야 합니다. 저축 계획을 세우고 지키기 바랍니다. 투자는 단기보다 중장기가 유리합니다.",
      health: "올해 건강운에서는 심장, 혈압, 혈관 건강에 특히 신경 써야 합니다. 흥분하기 쉬우므로 심혈관에 부담이 갈 수 있습니다. 스트레스 관리가 중요하며, 명상, 심호흡이 도움이 됩니다. 맵고 자극적인 음식은 줄이세요.",
      relationship: "올해 인간관계운은 매우 활발하고 화려한 해입니다. 사교 활동이 늘어나고 많은 사람들의 주목을 받습니다. 이성에게 인기가 높아지지만, 불같은 성격이 드러나면 갈등이 생길 수 있으니 감정 조절에 신경 쓰세요."
    },
    신약: {
      overall: "신약 사주에 화(火) 세운이 왔습니다. 올해는 자신감과 표현력이 높아지는 좋은 해입니다. 그동안 숨어 있던 재능과 매력이 드러나고, 주변 사람들에게 인정받으시게 됩니다. 적극적으로 자신을 표현하고 기회를 잡기 바랍니다.",
      career: "올해 직업운은 그동안 묻혀 있던 능력이 빛을 발하는 해입니다. 승진, 발탁의 기회가 오며, 특히 홍보, 마케팅, 서비스업, 예술 분야에서 두각을 나타냅니다. 프레젠테이션이나 발표에서 좋은 평가를 받고 인정받습니다.",
      wealth: "올해 재물운은 서서히 상승하는 흐름입니다. 그동안 막혀 있던 재물이 풀리기 시작하고 새로운 수입원이 생깁니다. 본업에서의 성과가 인정받아 급여나 보너스가 오르고, 부업도 시작하기 좋습니다.",
      health: "올해 건강운은 심장과 소장 기능이 활성화되면서 혈액 순환이 좋아집니다. 그동안 손발이 차거나 냉증이 있었던 사람들은 호전되고 체력도 향상됩니다. 따뜻한 음식과 붉은색 식품이 도움이 됩니다.",
      relationship: "올해 인간관계운은 그동안 조용했던 사회생활이 활발해지는 해입니다. 자신감이 생기면서 더 많은 사람들과 교류하게 되고 매력이 발산됩니다. 연애 운이 좋아져 새로운 이성을 만나시거나 기존 관계가 발전합니다."
    },
    중화: {
      overall: "중화 사주에 화(火) 세운이 왔습니다. 올해는 활력이 넘치면서도 안정감을 유지할 수 있는 해입니다. 적극적으로 자신을 표현하고 기회를 잡으시되, 지나치게 흥분하거나 과열되지 않도록 조절하면 좋은 성과를 거두실 수 있습니다.",
      career: "올해 직업운은 안정 속에서 빛나는 해입니다. 현재 위치에서 인정받고 승진하거나 더 좋은 조건으로 이직할 수 있습니다. 마케팅, 홍보, 서비스업에서 능력을 발휘하며, 프레젠테이션이나 협상에서 좋은 결과를 얻습니다.",
      wealth: "올해 재물운은 균형 잡힌 성장세를 보입니다. 수입이 늘어나면서 생활의 질도 향상되지만, 과소비에 빠지지 않도록 주의하세요. 저축과 소비의 균형을 잘 맞추면 자산이 꾸준히 늘어납니다.",
      health: "올해 건강운은 전반적으로 양호하며 활력이 넘칩니다. 심장과 혈관 건강도 무난하지만, 스트레스나 과로가 쌓이지 않도록 주의하세요. 규칙적인 운동과 충분한 휴식이 중요합니다.",
      relationship: "올해 인간관계운은 적극적이면서도 조화로운 해입니다. 사교 활동이 활발해지고 다양한 사람들을 만나시지만, 깊이 있는 관계도 유지합니다. 연애 운이 좋아 좋은 인연을 만나시거나 기존 관계가 더욱 발전합니다."
    }
  },
  earth: {
    신강: {
      overall: "신강 사주에 토(土) 세운이 왔습니다. 올해는 안정과 기반을 다지는 해입니다. 신강한 분에게 토 세운은 지나치게 보수적이 되거나 답답해질 수 있으니, 새로운 도전도 병행하기 바랍니다.",
      career: "올해 직업운은 안정을 추구하게 되는 해입니다. 부동산, 금융, 농업, 건설 등 토 관련 분야에서 성과가 있으며, 기존 사업의 기반을 다지시기 좋습니다. 다만 변화를 두려워하면 성장이 멈출 수 있으니 자기 계발에도 힘쓰세요.",
      wealth: "올해 재물운은 안정적인 자산 관리에 좋은 해입니다. 부동산 투자, 저축, 장기 투자 상품이 유리하며, 꾸준한 자산 증식이 이루어집니다. 사업 확장보다는 내실을 다지고 불필요한 지출을 줄이세요.",
      health: "올해 건강운에서는 비위(脾胃), 소화기 건강에 신경 써야 합니다. 과식이나 불규칙한 식사가 소화 장애를 일으킬 수 있으니 규칙적인 식사 습관을 유지하세요. 체중 관리에도 신경 쓰고 황색 식품이 도움이 됩니다.",
      relationship: "올해 인간관계운은 신뢰를 바탕으로 한 관계가 강화되는 해입니다. 오래된 친구, 가족과의 관계가 돈독해지고 믿을 수 있는 사람들과의 유대가 깊어집니다. 결혼이나 가정 안정에 좋은 시기입니다."
    },
    신약: {
      overall: "신약 사주에 토(土) 세운이 왔습니다. 올해는 안정과 기반을 다지는 중요한 해입니다. 그동안 불안정했던 상황이 안정되고 뿌리를 내릴 수 있는 기회가 옵니다. 급하게 서두르지 말고 차근차근 기반을 다지세요.",
      career: "올해 직업운은 안정적인 직장을 얻거나 현재 위치가 안정되는 해입니다. 그동안 불안정했던 고용 상태가 정규직으로 전환되거나 믿을 수 있는 직장에 자리 잡으시게 됩니다. 부동산, 금융, 행정 분야가 유리합니다.",
      wealth: "올해 재물운은 그동안 불안정했던 재정이 안정되는 해입니다. 꾸준한 수입이 생기고 저축을 시작할 수 있게 됩니다. 부동산이나 적금 등 안정적인 자산 형성이 유리하며, 빚을 정리하기 좋은 시기입니다.",
      health: "올해 건강운은 비위 기능이 강화되어 소화 흡수력이 좋아집니다. 그동안 식욕이 없거나 소화가 안 됐던 사람들은 호전되고 체력도 회복됩니다. 규칙적인 식사와 충분한 영양 섭취가 중요합니다.",
      relationship: "올해 인간관계운은 그동안 불안정했던 관계가 안정되는 해입니다. 믿을 수 있는 사람들과의 유대가 깊어지고 진정한 친구나 조력자를 만나실 수 있습니다. 결혼을 고려하는 사람들에게 좋은 시기입니다."
    },
    중화: {
      overall: "중화 사주에 토(土) 세운이 왔습니다. 올해는 흔들림 없이 기반을 다지면서 성장할 수 있는 해입니다. 급격한 변화보다는 꾸준한 발전이 이루어지며, 안정 속에서 착실하게 성과를 쌓아가는 시기입니다.",
      career: "올해 직업운은 안정적인 성장이 이루어지는 해입니다. 현재 직장에서 입지가 굳건해지고 전문성을 인정받아 핵심 인력으로 자리매김합니다. 부동산, 금융, 행정, 교육 등 안정적인 분야에서 성과가 있습니다.",
      wealth: "올해 재물운은 꾸준한 자산 증식이 이루어지는 해입니다. 부동산 투자, 저축, 연금 상품 등 안정적인 자산 형성이 유리하며, 착실한 성장이 기대됩니다. 무리한 투자는 피하기 바랍니다.",
      health: "올해 건강운은 전반적으로 안정적입니다. 소화기 건강도 무난하며 체력이 꾸준히 유지됩니다. 규칙적인 식사와 생활 습관을 유지하면 큰 문제 없이 건강하게 지내실 수 있습니다.",
      relationship: "올해 인간관계운은 안정적이고 신뢰 있는 관계가 유지되는 해입니다. 가족, 친구, 동료들과의 관계가 원만하고 믿을 수 있는 사람들과의 유대가 깊어집니다. 결혼이나 가정 안정에 좋은 시기입니다."
    }
  },
  metal: {
    신강: {
      overall: "신강 사주에 금(金) 세운이 왔습니다. 올해는 결단력과 실행력이 강해지는 해입니다. 신강한 분에게 금 세운은 강력한 추진력을 발휘하지만, 지나치면 냉정해지거나 갈등이 생길 수 있으니 유연성도 함께 갖추기 바랍니다.",
      career: "올해 직업운은 강력한 결단력과 실행력이 발휘되는 해입니다. 법조, 군인, 경찰, 금융, 의료 등 결단력이 요구되는 분야에서 성과를 냅니다. 조직을 이끌거나 중요한 결정을 내리는 위치에 오를 수 있습니다.",
      wealth: "올해 재물운은 결단력 있는 투자로 수익을 내실 수 있는 해입니다. 재물 정리와 관리에 좋으며 불필요한 자산을 정리하고 효율적으로 재편하면 좋습니다. 투자 수익이나 급여 인상이 기대됩니다.",
      health: "올해 건강운에서는 폐(肺)와 대장, 호흡기, 피부 건강에 신경 써야 합니다. 스트레스로 인한 피부 트러블이나 호흡기 질환에 주의하고 건조한 환경은 피하세요. 심호흡, 명상이 도움이 됩니다.",
      relationship: "올해 인간관계운은 정리와 명확함이 특징인 해입니다. 불필요한 관계는 정리되고 진정으로 필요한 관계만 남게 됩니다. 냉정함과 따뜻함의 균형을 유지하고, 깊고 신뢰 있는 관계를 형성하세요."
    },
    신약: {
      overall: "신약 사주에 금(金) 세운이 왔습니다. 올해는 결단력과 실행력이 높아지는 해입니다. 그동안 우유부단했거나 결정을 미뤘던 사람들이 올해 명확한 판단을 내리시게 됩니다. 다만 지나친 경직성은 피하세요.",
      career: "올해 직업운은 그동안 결단을 내리지 못했던 일들이 정리되는 해입니다. 이직, 창업, 부서 이동 등 중요한 결정을 내리시게 되며 이 결정이 좋은 결과를 가져옵니다. 법조, 행정, 금융, 기술 분야에서 능력을 발휘합니다.",
      wealth: "올해 재물운은 재정 상황이 명확해지고 정리되는 해입니다. 그동안 불분명했던 재정 문제가 해결되고 수입과 지출이 체계화됩니다. 금융 상품이나 채권 투자가 유리하며 빚 정리에도 좋은 시기입니다.",
      health: "올해 건강운은 폐와 호흡기 기능이 강화되어 면역력이 향상됩니다. 그동안 감기에 자주 걸렸거나 호흡기가 약했던 사람들은 호전되고 체력도 회복됩니다. 금연을 시도하기 좋은 시기입니다.",
      relationship: "올해 인간관계운은 그동안 애매했던 관계가 명확해지는 해입니다. 진정한 친구가 누구인지 알게 되고 불필요한 관계는 자연스럽게 정리됩니다. 깊고 의미 있는 관계가 형성됩니다."
    },
    중화: {
      overall: "중화 사주에 금(金) 세운이 왔습니다. 올해는 명확하게 판단하면서도 지나치게 날카로워지지 않는 좋은 해입니다. 필요한 결정은 과감하게 내리시되 주변과의 조화도 유지하면 좋은 성과를 거두실 수 있습니다.",
      career: "올해 직업운은 명확한 판단력으로 성과를 내는 해입니다. 분석, 기획, 금융, 법무 등 논리와 판단력이 요구되는 분야에서 능력을 발휘하며 중요한 의사결정에 참여하게 됩니다. 승진이나 역할 확대가 자연스럽게 이루어집니다.",
      wealth: "올해 재물운은 효율적인 재정 관리로 자산이 증가하는 해입니다. 불필요한 지출을 줄이고 필요한 곳에 투자하면 좋은 수익을 얻습니다. 금융 상품, 채권, 배당주 등 안정적이면서도 수익성 있는 투자가 유리합니다.",
      health: "올해 건강운은 전반적으로 양호하며 폐와 호흡기 건강도 무난합니다. 규칙적인 생활과 적당한 운동으로 건강을 유지하면 되며, 건조한 환경은 피하고 적절한 습도를 유지하세요.",
      relationship: "올해 인간관계운은 명확하고 신뢰 있는 관계가 유지되는 해입니다. 불필요한 사교보다는 의미 있는 관계에 집중하게 되며 진정한 친구와 조력자가 누구인지 명확해집니다."
    }
  },
  water: {
    신강: {
      overall: "신강 사주에 수(水) 세운이 왔습니다. 올해는 유연함과 지혜가 빛을 발하는 해입니다. 신강한 분에게 수 세운은 다양한 분야에서 활약하지만, 흐름이 너무 빨라질 수 있으니 한곳에 집중하는 것도 필요합니다.",
      career: "올해 직업운은 다양한 기회가 찾아오는 해입니다. 무역, 유통, IT, 학문, 연구 등 유동적인 분야에서 성과가 있으며 해외 진출이나 이직의 기회도 많습니다. 다만 너무 많은 기회를 쫓으면 어느 것도 잡지 못할 수 있으니 선택과 집중이 필요합니다.",
      wealth: "올해 재물운은 유동적인 재물이 많이 흐르는 해입니다. 수입이 늘어나지만 지출도 함께 증가하므로 재물 관리에 신경 써야 합니다. 무역, 유통, 해외 투자에서 수익이 있으며 저축 계획을 세우고 지키기 바랍니다.",
      health: "올해 건강운에서는 신장(腎)과 방광, 생식기 건강에 신경 써야 합니다. 과로나 스트레스로 인한 신장 기능 저하에 주의하고 충분한 수분 섭취와 휴식이 중요합니다. 검은색 식품이 도움이 됩니다.",
      relationship: "올해 인간관계운은 매우 활발하고 다양해지는 해입니다. 많은 사람들을 만나고 인맥이 넓어지지만, 깊이보다는 넓이가 우선되기 쉽습니다. 지적인 교류가 활발해지고 다양한 분야의 사람들과 대화를 나누시게 됩니다."
    },
    신약: {
      overall: "신약 사주에 수(水) 세운이 왔습니다. 올해는 지혜와 통찰력이 높아지는 좋은 해입니다. 그동안 막혀 있던 생각이 풀리고 명석한 판단력이 생깁니다. 물처럼 유연하게 상황에 적응하면서 지혜롭게 기회를 잡으세요.",
      career: "올해 직업운은 지적 능력이 빛을 발하는 해입니다. 연구, 학문, IT, 컨설팅, 무역 등 지식 기반 분야에서 성과가 있으며 자격증이나 학위 취득에도 좋습니다. 해외 관련 기회가 있으며 외국어 실력이 도움이 됩니다.",
      wealth: "올해 재물운은 서서히 흐름이 좋아지는 해입니다. 그동안 막혀 있던 재물 흐름이 풀리고 새로운 수입원이 생깁니다. 지식이나 기술을 활용한 수입이 좋으며 온라인 비즈니스나 콘텐츠 제작도 유리합니다.",
      health: "올해 건강운은 신장과 방광 기능이 강화되어 노폐물 배출이 원활해집니다. 그동안 부종이 있거나 피로감이 심했던 사람들은 호전되고 활력이 생깁니다. 충분한 수분 섭취와 규칙적인 생활이 중요합니다.",
      relationship: "올해 인간관계운은 지적인 교류가 활발해지는 해입니다. 비슷한 관심사를 가진 사람들과 만나 깊은 대화를 나누시게 되며 멘토나 조력자를 만나실 수 있습니다. 연애 운도 좋아지며 대화가 잘 통하는 상대를 만나시게 됩니다."
    },
    중화: {
      overall: "중화 사주에 수(水) 세운이 왔습니다. 올해는 유연함과 지혜가 조화를 이루는 해입니다. 상황에 맞게 적응하면서 지혜로운 판단을 내릴 수 있습니다. 물처럼 흐르되 방향을 잃지 않으면 원하는 곳에 도달할 수 있습니다.",
      career: "올해 직업운은 지적 능력과 적응력이 빛을 발하는 해입니다. 연구, 기획, 컨설팅, IT, 무역 등 지식 기반 분야에서 성과가 있으며 변화하는 환경에 유연하게 대응하는 능력이 인정받습니다. 해외 관련 기회가 있습니다.",
      wealth: "올해 재물운은 유동적이면서도 안정적인 흐름을 보입니다. 수입이 꾸준히 증가하며 다양한 경로로 재물이 들어옵니다. 저축과 투자의 균형을 잘 맞추면 자산이 꾸준히 늘어납니다.",
      health: "올해 건강운은 전반적으로 양호하며 신장과 방광 건강도 무난합니다. 충분한 수분 섭취와 규칙적인 생활이 중요하며 과로하지 않도록 주의하세요. 허리 건강에도 신경 쓰고 장시간 앉아 있는 것은 피하세요.",
      relationship: "올해 인간관계운은 유연하고 조화로운 해입니다. 다양한 사람들과 원만하게 교류하며 지적인 대화를 통해 깊은 유대를 형성합니다. 해외 인연이나 다른 분야의 사람들과의 교류가 활발합니다."
    }
  }
};

// 신강신약 키 변환 헬퍼
function getStrengthKey(sinGangSinYak: string): StrengthType {
  if (sinGangSinYak === "신강") return "신강";
  if (sinGangSinYak === "신약") return "신약";
  return "중화";
}

// ==================== 형살(刑殺) 정의 ====================

/**
 * 형살(刑殺) 관계 정의
 * 寅巳申 - 삼형살 (무은지형, 無恩之刑): 은혜가 없는 형벌
 * 丑戌未 - 삼형살 (지세지형, 持勢之刑): 권세를 믿는 형벌
 * 子卯 - 무례지형 (無禮之刑): 예의가 없는 형벌
 * 辰辰, 午午, 酉酉, 亥亥 - 자형 (自刑): 스스로를 해치는 형벌
 */
const HYEONGSAL_PAIRS: Record<EarthlyBranchKr, EarthlyBranchKr[]> = {
  인: ["사", "신"], // 寅巳申 삼형살
  사: ["인", "신"], // 寅巳申 삼형살
  신: ["인", "사"], // 寅巳申 삼형살
  축: ["술", "미"], // 丑戌未 삼형살
  술: ["축", "미"], // 丑戌未 삼형살
  미: ["축", "술"], // 丑戌未 삼형살
  자: ["묘"],       // 子卯 무례지형
  묘: ["자"],       // 子卯 무례지형
  진: ["진"],       // 自刑
  오: ["오"],       // 自刑
  유: ["유"],       // 自刑
  해: ["해"],       // 自刑
};

// 형살 설명
const HYEONGSAL_DESCRIPTIONS: Record<string, { name: string; warning: string }> = {
  "인-사": {
    name: "인사형(寅巳刑)",
    warning: "인사형은 '무은지형(無恩之刑)'으로, 은혜를 배반하는 기운입니다. 신뢰했던 관계에서 실망이 생기거나, 협력 관계에 갈등이 발생할 수 있습니다. 계약이나 투자에 각별히 주의하고, 중요한 결정은 신중하게 내리세요."
  },
  "인-신": {
    name: "인신형(寅申刑)",
    warning: "인신형은 삼형살의 일부로, 급격한 변화나 예상치 못한 사건이 발생할 수 있습니다. 건강 관리와 안전에 주의하고, 무리한 확장이나 모험은 자제하세요."
  },
  "사-신": {
    name: "사신형(巳申刑)",
    warning: "사신형은 삼형살의 일부로, 금전이나 사업에서 예상치 못한 손실이 있을 수 있습니다. 특히 사신형은 '선합후형(先合後刑)'의 특성이 있어, 처음에는 일이 순조롭게 풀리다가 나중에 문제가 생길 수 있습니다. 계약서 조항을 꼼꼼히 살피고, 구두 약속보다 문서화를 권장합니다. 투자와 계약에 신중을 기하고, 법적 문제에도 주의하세요."
  },
  "축-술": {
    name: "축술형(丑戌刑)",
    warning: "축술형은 '지세지형(持勢之刑)'으로, 권력이나 지위를 두고 다툼이 생길 수 있습니다. 직장 내 갈등이나 권력 투쟁에 휘말리지 않도록 주의하세요."
  },
  "축-미": {
    name: "축미형(丑未刑)",
    warning: "축미형은 삼형살의 일부로, 고집이나 아집으로 인한 갈등이 생길 수 있습니다. 유연한 사고와 타협의 자세가 필요합니다."
  },
  "술-미": {
    name: "술미형(戌未刑)",
    warning: "술미형은 삼형살의 일부로, 완고한 태도나 편견으로 인한 문제가 발생할 수 있습니다. 열린 마음으로 소통하세요."
  },
  "자-묘": {
    name: "자묘형(子卯刑)",
    warning: "자묘형은 '무례지형(無禮之刑)'으로, 예의를 잃거나 도리에 어긋나는 행동으로 화를 자초할 수 있습니다. 언행에 주의하고 예의를 갖추세요."
  },
};

/**
 * 사주 지지와 세운 지지 사이의 형살 확인
 */
function checkHyeongsal(
  sajuResult: SajuApiResult,
  yearBranch: EarthlyBranchKr
): { hasHyeongsal: boolean; hyeongsalInfo: { pillar: string; name: string; warning: string }[] } {
  const branches: { pillar: string; branch: EarthlyBranchKr }[] = [
    { pillar: "년주", branch: sajuResult.yearPillar.jiji as EarthlyBranchKr },
    { pillar: "월주", branch: sajuResult.monthPillar.jiji as EarthlyBranchKr },
    { pillar: "일주", branch: sajuResult.dayPillar.jiji as EarthlyBranchKr },
  ];

  // 시주가 있으면 추가
  if (sajuResult.timePillar?.jiji) {
    branches.push({ pillar: "시주", branch: sajuResult.timePillar.jiji as EarthlyBranchKr });
  }

  const hyeongsalInfo: { pillar: string; name: string; warning: string }[] = [];

  for (const { pillar, branch } of branches) {
    const pairs = HYEONGSAL_PAIRS[branch];
    if (pairs && pairs.includes(yearBranch)) {
      // 형살 키 생성 (알파벳 순서로 정렬)
      const sortedPair = [branch, yearBranch].sort().join("-");
      const info = HYEONGSAL_DESCRIPTIONS[sortedPair];
      if (info) {
        hyeongsalInfo.push({
          pillar,
          name: info.name,
          warning: info.warning
        });
      }
    }
  }

  return {
    hasHyeongsal: hyeongsalInfo.length > 0,
    hyeongsalInfo
  };
}

// ==================== 유틸리티 함수 ====================

function createGanZhi(stemKr: HeavenlyStemKr, branchKr: EarthlyBranchKr): GanZhi {
  return {
    stem: STEM_HANJA[stemKr],
    stemKr: stemKr,
    branch: BRANCH_HANJA[branchKr],
    branchKr: branchKr,
    fullHanja: `${STEM_HANJA[stemKr]}${BRANCH_HANJA[branchKr]}`,
    fullKr: `${stemKr}${branchKr}`,
  };
}

function getYearGanZhi(year: number): GanZhi {
  // 1984년은 갑자년 기준
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 4) % 12 + 12) % 12;
  const stem = STEMS_KR[stemIndex];
  const branch = BRANCHES_KR[branchIndex];
  return createGanZhi(stem, branch);
}

function getDayMasterElement(sajuResult: SajuApiResult): FiveElement {
  const dayCheongan = sajuResult.dayPillar.cheongan as HeavenlyStemKr;
  return STEM_ELEMENTS[dayCheongan] || "wood";
}

function getYongsinElement(sajuResult: SajuApiResult): FiveElement {
  const yongsinKr = sajuResult.yongsin as FiveElementKey;
  return ELEMENT_KR_TO_EN[yongsinKr] || "wood";
}

function calculateRelation(
  dayMasterElement: FiveElement,
  targetElement: FiveElement
): string {
  if (dayMasterElement === targetElement) {
    return "비겁 (동기, 경쟁)";
  }
  const relations = ELEMENT_RELATIONS[dayMasterElement];
  if (relations.generates === targetElement) {
    return "식상 (표현, 창작)";
  }
  if (relations.controls === targetElement) {
    return "재성 (재물, 관리)";
  }
  if (relations.generatedBy === targetElement) {
    return "인성 (학습, 지원)";
  }
  if (relations.controlledBy === targetElement) {
    return "관성 (권위, 책임)";
  }
  return "중립";
}

function calculateYearRating(
  dayMasterElement: FiveElement,
  yearElement: FiveElement,
  yongsinElement: FiveElement,
  sinGangSinYak: string
): number {
  const relations = ELEMENT_RELATIONS[dayMasterElement];
  let baseRating = 50;
  const isStrong = sinGangSinYak === "신강";

  // 용신운 여부 (가장 중요)
  if (yearElement === yongsinElement) {
    baseRating += 30;
  }

  // 오행 관계에 따른 점수
  if (relations.generatedBy === yearElement) {
    baseRating += isStrong ? -10 : 15;
  } else if (relations.generates === yearElement) {
    baseRating += isStrong ? 15 : -5;
  } else if (relations.controls === yearElement) {
    baseRating += isStrong ? 20 : -10;
  } else if (relations.controlledBy === yearElement) {
    baseRating += isStrong ? 5 : -5;
  } else if (dayMasterElement === yearElement) {
    baseRating += isStrong ? -5 : 10;
  }

  // 범위 제한
  return Math.max(0, Math.min(100, baseRating));
}

/**
 * 점수 기반으로 길흉 라벨 결정 (점수와 라벨의 일관성 보장)
 * - 70점 이상: 길운
 * - 45점 이하: 흉운 (Chapter 17의 D등급 "주의" 기준과 일치)
 * - 그 외: 평운
 */
function getRelationToYongsinByScore(
  overallScore: number
): "길운" | "흉운" | "평운" {
  if (overallScore >= 70) {
    return "길운";
  }
  if (overallScore <= 45) {
    return "흉운";
  }
  return "평운";
}

// ==================== 분석 함수 ====================

/**
 * 10년 세운 예측 생성
 */
function generateTenYearForecast(
  sajuResult: SajuApiResult,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string
): YearlyFortuneDetailedAnalysis[] {
  const dayMasterElement = getDayMasterElement(sajuResult);
  const yongsinElement = getYongsinElement(sajuResult);
  const forecasts: YearlyFortuneDetailedAnalysis[] = [];

  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const age = currentAge + i;
    const ganZhi = getYearGanZhi(year);
    const yearElement = STEM_ELEMENTS[ganZhi.stemKr as HeavenlyStemKr];

    const overallScore = calculateYearRating(
      dayMasterElement,
      yearElement,
      yongsinElement,
      sinGangSinYak
    );

    // 점수 기반으로 길흉 라벨 결정 (점수와 라벨의 일관성 보장)
    const relationToYongsin = getRelationToYongsinByScore(overallScore);
    const keyword = YEAR_KEYWORDS[dayMasterElement]?.[yearElement] || "변화·적응";

    // 월별 하이라이트 생성 (간단 버전)
    const monthlyHighlights = generateMonthlyHighlights(
      dayMasterElement,
      year,
      overallScore
    );

    forecasts.push({
      year,
      ganZhi,
      element: yearElement,
      age,
      relationToYongsin,
      overallScore,
      monthlyHighlights,
      keyAdvice: generateKeyAdvice(
        dayMasterElement,
        yearElement,
        relationToYongsin,
        sinGangSinYak
      ),
      cautionPeriod: generateCautionPeriods(overallScore),
    });
  }

  return forecasts;
}

function generateMonthlyHighlights(
  dayMaster: FiveElement,
  year: number,
  baseScore: number
): MonthlyFortune[] {
  const highlights: MonthlyFortune[] = [];
  const monthDescriptions: Record<number, string> = {
    1: "새해 시작, 계획 수립의 달",
    2: "준비와 기획의 시기",
    3: "본격적인 활동 시작",
    4: "성장과 발전의 달",
    5: "안정과 결실 추구",
    6: "중간 점검 시기",
    7: "활발한 활동기",
    8: "수확과 성과의 달",
    9: "정리와 변화 준비",
    10: "마무리 준비 시작",
    11: "성찰과 계획의 달",
    12: "한 해 마무리",
  };

  for (let month = 1; month <= 12; month++) {
    // 월별 점수 변동 (기본 점수 기반 ±20 범위)
    const monthVariation = Math.sin((month * Math.PI) / 6) * 15;
    const monthScore = Math.max(0, Math.min(100, Math.round(baseScore + monthVariation)));

    highlights.push({
      month,
      score: monthScore,
      highlight: monthDescriptions[month],
    });
  }

  return highlights;
}

function generateKeyAdvice(
  dayMaster: FiveElement,
  yearElement: FiveElement,
  relationToYongsin: "길운" | "흉운" | "평운",
  sinGangSinYak: string
): string {
  const strengthKey = getStrengthKey(sinGangSinYak);
  const narrative = SEUN_STRENGTH_NARRATIVES[yearElement]?.[strengthKey];

  if (narrative) {
    // 관계에 따라 적절한 narrative 선택
    if (relationToYongsin === "길운") {
      return `${narrative.overall} 특히 직업적으로는 ${narrative.career.slice(0, 50)}...`;
    }
    if (relationToYongsin === "흉운") {
      // 흉운일 때 건강 텍스트에서 "양호" 관련 표현을 "주의 필요"로 변환
      const adjustedHealth = narrative.health
        .replace(/전반적으로 양호/g, "전반적으로 주의가 필요")
        .replace(/양호하며/g, "주의가 필요하며")
        .replace(/양호합니다/g, "주의가 필요합니다")
        .replace(/무난합니다/g, "주의가 필요합니다");
      return `신중함이 필요한 해입니다. ${adjustedHealth} 건강 관리와 인간관계에 집중하세요.`;
    }
    // 평운
    return narrative.overall;
  }

  // 폴백 로직
  const isStrong = sinGangSinYak === "신강";
  const relations = ELEMENT_RELATIONS[dayMaster];

  if (relationToYongsin === "길운") {
    return "용신운이 작용하는 좋은 해입니다. 적극적인 도전과 새로운 시작에 좋습니다.";
  }

  if (relationToYongsin === "흉운") {
    return "신중함이 필요한 해입니다. 무리한 확장보다는 기반을 다지는 데 집중하세요.";
  }

  // 평운일 때 오행 관계에 따른 조언
  if (relations.generatedBy === yearElement) {
    return isStrong
      ? "지나친 의존보다 자립심을 키우세요. 배움은 좋으나 실행력도 중요합니다."
      : "적극적으로 배움의 기회를 찾고, 주변의 도움을 받아들이세요.";
  }

  if (relations.generates === yearElement) {
    return isStrong
      ? "창의성을 발휘하고 표현할 좋은 시기입니다. 적극적으로 활동하세요."
      : "에너지 소모에 주의하고, 무리하지 않는 선에서 표현하세요.";
  }

  if (relations.controls === yearElement) {
    return isStrong
      ? "재물 운이 좋습니다. 적극적인 투자와 사업 확장을 고려해보세요."
      : "욕심을 줄이고 안정적인 재테크에 집중하세요.";
  }

  return "균형 잡힌 생활과 유연한 대처가 필요한 시기입니다.";
}

function generateCautionPeriods(overallScore: number): string[] {
  const periods: string[] = [];

  if (overallScore < 40) {
    periods.push("상반기: 중요 결정 보류 권장");
    periods.push("하반기: 건강 관리에 특별히 주의");
  } else if (overallScore < 60) {
    periods.push("연중: 무리한 확장 자제");
  }

  return periods;
}

/**
 * 현재 연도 상세 분석
 */
function analyzeCurrentYear(
  sajuResult: SajuApiResult,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string
): {
  detail: YearlyFortuneDetailedAnalysis;
  monthlyFortunes: MonthlyFortune[];
} {
  const dayMasterElement = getDayMasterElement(sajuResult);
  const yongsinElement = getYongsinElement(sajuResult);
  const ganZhi = getYearGanZhi(currentYear);
  const yearElement = STEM_ELEMENTS[ganZhi.stemKr as HeavenlyStemKr];

  const overallScore = calculateYearRating(
    dayMasterElement,
    yearElement,
    yongsinElement,
    sinGangSinYak
  );

  // 점수 기반으로 길흉 라벨 결정 (점수와 라벨의 일관성 보장)
  const relationToYongsin = getRelationToYongsinByScore(overallScore);
  const monthlyFortunes = generateDetailedMonthlyFortunes(
    dayMasterElement,
    currentYear,
    overallScore
  );

  return {
    detail: {
      year: currentYear,
      ganZhi,
      element: yearElement,
      age: currentAge,
      relationToYongsin,
      overallScore,
      monthlyHighlights: monthlyFortunes,
      keyAdvice: generateKeyAdvice(
        dayMasterElement,
        yearElement,
        relationToYongsin,
        sinGangSinYak
      ),
      cautionPeriod: generateCautionPeriods(overallScore),
    },
    monthlyFortunes,
  };
}

function generateDetailedMonthlyFortunes(
  dayMaster: FiveElement,
  year: number,
  baseScore: number
): MonthlyFortune[] {
  const fortunes: MonthlyFortune[] = [];
  const monthDetails: Record<number, { keyword: string; focus: string }> = {
    1: { keyword: "계획", focus: "새해 목표 설정과 구체적인 실행 계획을 세우세요" },
    2: { keyword: "준비", focus: "봄을 맞이할 준비와 기반 마련에 집중하세요" },
    3: { keyword: "시작", focus: "새로운 프로젝트나 활동을 시작하기 좋은 달입니다" },
    4: { keyword: "성장", focus: "꾸준한 노력이 성과로 이어지는 시기입니다" },
    5: { keyword: "발전", focus: "그동안의 노력이 가시적인 결과로 나타납니다" },
    6: { keyword: "점검", focus: "상반기를 돌아보고 하반기를 계획하세요" },
    7: { keyword: "활동", focus: "적극적인 대외 활동과 네트워킹에 좋습니다" },
    8: { keyword: "수확", focus: "성과를 거두고 다음 단계를 준비하세요" },
    9: { keyword: "정리", focus: "불필요한 것을 정리하고 핵심에 집중하세요" },
    10: { keyword: "마무리", focus: "연말을 향한 마무리 작업을 시작하세요" },
    11: { keyword: "성찰", focus: "한 해를 되돌아보며 배움을 정리하세요" },
    12: { keyword: "완성", focus: "올해를 잘 마무리하고 내년을 준비하세요" },
  };

  for (let month = 1; month <= 12; month++) {
    const monthVariation = Math.sin((month * Math.PI) / 6) * 15;
    const score = Math.max(0, Math.min(100, Math.round(baseScore + monthVariation)));
    const detail = monthDetails[month];

    fortunes.push({
      month,
      score,
      highlight: `${detail.keyword}: ${detail.focus}`,
    });
  }

  return fortunes;
}

/**
 * 대운+세운 조합 분석
 */
function analyzeDaesunSeunCombination(
  sajuResult: SajuApiResult,
  currentYear: number,
  currentAge: number,
  currentDaeunGanji?: string
): {
  currentCombination: string;
  effect: string;
  advice: string;
} {
  const yearGanZhi = getYearGanZhi(currentYear);
  const dayMasterElement = getDayMasterElement(sajuResult);
  const yongsinElement = getYongsinElement(sajuResult);

  // 대운 간지가 없으면 추정
  const daeunGanji = currentDaeunGanji || estimateCurrentDaeun(currentAge);
  const yearElement = STEM_ELEMENTS[yearGanZhi.stemKr as HeavenlyStemKr];

  // 대운 오행 추정 (간지 첫 글자로)
  const daeunStem = daeunGanji.charAt(0) as HeavenlyStemKr;
  const daeunElement = STEM_ELEMENTS[daeunStem] || "wood";

  // 조합 분석
  const combination = `대운 ${daeunGanji}(${ELEMENT_EN_TO_KR[daeunElement]}) + 세운 ${yearGanZhi.fullKr}(${ELEMENT_EN_TO_KR[yearElement]})`;

  let effect: string;
  let advice: string;

  // 대운과 세운이 같은 오행
  if (daeunElement === yearElement) {
    effect = "대운과 세운이 같은 기운으로 해당 오행의 영향이 강하게 작용합니다.";
    if (yearElement === yongsinElement) {
      advice = "용신 기운이 강화되어 매우 좋은 시기입니다. 적극적으로 행동하세요.";
    } else {
      advice = "한 가지 기운이 과도할 수 있으니 균형을 유지하세요.";
    }
  }
  // 대운과 세운이 상생
  else if (
    ELEMENT_RELATIONS[daeunElement].generates === yearElement ||
    ELEMENT_RELATIONS[yearElement].generates === daeunElement
  ) {
    effect = "대운과 세운이 상생하여 순조로운 흐름이 예상됩니다.";
    advice = "긍정적인 에너지를 활용하여 새로운 도전에 나서세요.";
  }
  // 대운과 세운이 상극
  else if (
    ELEMENT_RELATIONS[daeunElement].controls === yearElement ||
    ELEMENT_RELATIONS[yearElement].controls === daeunElement
  ) {
    effect = "대운과 세운 사이에 긴장이 있어 변화가 예상됩니다.";
    advice = "신중하게 판단하고, 갈등 상황에서는 유연하게 대처하세요.";
  }
  // 기타
  else {
    effect = "대운과 세운이 각자의 역할을 하며 안정적인 흐름을 보입니다.";
    advice = "균형 잡힌 접근으로 꾸준히 전진하세요.";
  }

  return {
    currentCombination: combination,
    effect,
    advice,
  };
}

function estimateCurrentDaeun(currentAge: number): string {
  // 간단한 대운 추정 (10년 단위)
  const daeunCycle = Math.floor(currentAge / 10);
  const ganjiIndex = daeunCycle % 60;
  const SIXTY_GANJI = [
    "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
    "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
    "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
    "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
    "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
    "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해",
  ];
  return SIXTY_GANJI[ganjiIndex];
}

/**
 * 최고의 해 / 도전적인 해 식별
 */
function identifyBestAndChallengingYears(
  forecasts: YearlyFortuneDetailedAnalysis[]
): { bestYears: number[]; challengingYears: number[] } {
  const bestYears = forecasts
    .filter((f) => f.overallScore >= 70)
    .map((f) => f.year);

  const challengingYears = forecasts
    .filter((f) => f.overallScore < 40)
    .map((f) => f.year);

  return { bestYears, challengingYears };
}

// ==================== Narrative 생성 함수 ====================

/**
 * 세운(歲運) 서술형 Narrative 생성
 */
function generateSeunNarrative(
  tenYearForecast: YearlyFortuneDetailedAnalysis[],
  currentYearAnalysis: {
    detail: YearlyFortuneDetailedAnalysis;
    monthlyFortunes: MonthlyFortune[];
  },
  daesunSeunCombination: Chapter8Result["daesunSeunCombination"],
  bestYears: number[],
  challengingYears: number[],
  hyeongsalWarning?: Chapter8Result["hyeongsalWarning"]
): Chapter8Result["narrative"] {
  // 도입부
  let intro = "이제 세운(歲運)에 대해 살펴보겠습니다. 세운은 매년 바뀌는 해의 기운으로, 그해에 어떤 일이 일어날지, 어떤 기회와 도전이 있을지를 알려줍니다.\n\n";
  intro += "대운이 10년 단위의 큰 흐름이라면, 세운은 그 안에서 1년 단위로 세부적인 변화를 보여줍니다. 같은 대운 안에서도 세운에 따라 해마다 운의 색깔이 달라질 수 있습니다.";

  // 본론: 현재 연도 분석
  const cd = currentYearAnalysis.detail;
  const yearElementKr = ELEMENT_EN_TO_KR[cd.element];

  let mainAnalysis = `【${cd.year}년 (${cd.ganZhi.fullKr}년) 운세】\n\n`;
  mainAnalysis += `올해는 '${cd.ganZhi.fullKr}(${cd.ganZhi.fullHanja})' 해입니다. ${yearElementKr}(${getElementHanja(yearElementKr)})의 기운이 한 해를 지배합니다.\n\n`;

  // 용신과의 관계
  if (cd.relationToYongsin === "길운") {
    mainAnalysis += "올해는 용신운(用神運)이 작용하여 전반적으로 좋은 해입니다. 하는 일이 순조롭고, 노력에 비례한 성과를 얻을 수 있습니다. ";
    mainAnalysis += "새로운 시작이나 중요한 결정을 하기에 좋은 시기입니다. 기회가 왔을 때 적극적으로 잡기 바랍니다.\n\n";
  } else if (cd.relationToYongsin === "흉운") {
    mainAnalysis += "올해는 다소 주의가 필요한 해입니다. 무리한 확장이나 모험보다는 안정을 유지하면서 내실을 다지는 것이 좋습니다. ";
    mainAnalysis += "어려움이 있더라도 포기하지 말고, 이 시기를 지혜롭게 넘기면 다음 해에 더 좋은 기회가 옵니다.\n\n";
  } else {
    mainAnalysis += "올해는 평탄한 해입니다. 급격한 변화보다는 꾸준히 해오던 일을 지속하면서 기반을 다지는 것이 좋습니다. ";
    mainAnalysis += "현재의 안정을 유지하면서 다음을 준비하세요.\n\n";
  }

  mainAnalysis += `올해 운세 점수: ${cd.overallScore}점 (100점 만점)\n\n`;
  mainAnalysis += `${cd.keyAdvice}\n\n`;

  // 대운+세운 조합
  mainAnalysis += "【대운과 세운의 조합】\n\n";
  mainAnalysis += `현재 ${daesunSeunCombination.currentCombination}의 조합입니다.\n\n`;
  mainAnalysis += `${daesunSeunCombination.effect}\n\n`;
  mainAnalysis += `${daesunSeunCombination.advice}\n\n`;

  // 상세 분석
  const details: string[] = [];

  // 월별 운세
  let monthlyDetail = "【월별 운세 흐름】\n\n";
  monthlyDetail += `${cd.year}년의 월별 운세 흐름을 살펴보겠습니다.\n\n`;

  for (const month of currentYearAnalysis.monthlyFortunes) {
    const scoreSymbol = month.score >= 70 ? "○" : month.score >= 50 ? "□" : "△";
    monthlyDetail += `• ${month.month}월 [${scoreSymbol}] ${month.highlight}\n`;
  }
  monthlyDetail += "\n○: 좋은 달 / □: 평탄한 달 / △: 주의가 필요한 달";
  details.push(monthlyDetail);

  // 10년 세운 전망
  let tenYearDetail = "【향후 10년 세운 전망】\n\n";
  tenYearDetail += "앞으로 10년간의 세운 흐름을 간략히 살펴보겠습니다.\n\n";

  for (const forecast of tenYearForecast) {
    const elementKr = ELEMENT_EN_TO_KR[forecast.element];
    const symbol = forecast.relationToYongsin === "길운" ? "○" :
                   forecast.relationToYongsin === "흉운" ? "△" : "□";
    tenYearDetail += `• ${forecast.year}년(${forecast.ganZhi.fullKr}): ${elementKr}운 [${symbol}] - ${forecast.overallScore}점\n`;
  }
  tenYearDetail += "\n○: 용신운(좋은 해) / □: 평운 / △: 주의가 필요한 해";
  details.push(tenYearDetail);

  // 좋은 해와 주의할 해
  if (bestYears.length > 0 || challengingYears.length > 0) {
    let yearsDetail = "【특별히 주목할 해】\n\n";

    if (bestYears.length > 0) {
      yearsDetail += `• 좋은 해: ${bestYears.join("년, ")}년\n`;
      yearsDetail += "이 해들은 용신운이 강하게 작용하여 성과를 내기 좋은 시기다. 중요한 결정이나 새로운 시작을 하기에 좋다.\n\n";
    }

    if (challengingYears.length > 0) {
      yearsDetail += `• 주의가 필요한 해: ${challengingYears.join("년, ")}년\n`;
      yearsDetail += "이 해들은 다소 도전적인 시기다. 무리하지 말고 건강과 인간관계에 신경 쓰면서 안정적으로 보내는 것이 좋다.\n\n";
    }

    details.push(yearsDetail);
  }

  // 형살(刑殺) 경고 - 사주 지지와 세운 지지가 형(刑) 관계일 때
  if (hyeongsalWarning?.hasHyeongsal && hyeongsalWarning.warnings.length > 0) {
    let hyeongsalDetail = "【⚠️ 형살(刑殺) 주의 연도】\n\n";
    hyeongsalDetail += "형살(刑殺)은 지지(地支) 간의 충돌로, 해당 연도에 특별한 주의가 필요합니다. 형(刑)은 예상치 못한 사건, 관계의 갈등, 건강 문제 등을 암시할 수 있으므로 미리 대비하는 것이 좋습니다.\n\n";

    // 연도별로 그룹화
    const warningsByYear = new Map<number, typeof hyeongsalWarning.warnings>();
    for (const warning of hyeongsalWarning.warnings) {
      if (!warningsByYear.has(warning.year)) {
        warningsByYear.set(warning.year, []);
      }
      warningsByYear.get(warning.year)!.push(warning);
    }

    // 현재 연도 형살 먼저 표시
    const currentYear = currentYearAnalysis.detail.year;
    if (warningsByYear.has(currentYear)) {
      const currentWarnings = warningsByYear.get(currentYear)!;
      hyeongsalDetail += `🚨 【${currentYear}년 형살 경고】\n\n`;
      for (const w of currentWarnings) {
        hyeongsalDetail += `• ${w.pillar}의 ${w.name}\n`;
        hyeongsalDetail += `  ${w.warning}\n\n`;
      }
      warningsByYear.delete(currentYear);
    }

    // 나머지 연도 형살
    if (warningsByYear.size > 0) {
      hyeongsalDetail += "【향후 형살 주의 연도】\n\n";
      for (const [year, warnings] of warningsByYear) {
        for (const w of warnings) {
          hyeongsalDetail += `• ${year}년: ${w.pillar}의 ${w.name}\n`;
        }
      }
      hyeongsalDetail += "\n위 연도에는 중요한 계약이나 투자, 대인관계에서 더욱 신중하게 접근하시기 바랍니다.";
    }

    details.push(hyeongsalDetail);
  }

  // 조언
  let advice = "【세운을 활용하는 방법】\n\n";
  advice += "세운은 그해의 분위기와 흐름을 알려주는 것입니다. 좋은 세운이라고 해서 가만히 있으면 저절로 좋은 일이 생기는 것도 아니고, ";
  advice += "나쁜 세운이라고 해서 반드시 안 좋은 일만 생기는 것도 아닙니다.\n\n";

  advice += "중요한 것은 각 해의 성격을 이해하고, 그에 맞게 전략적으로 대처하는 것입니다.\n\n";

  advice += "• 용신운 해: 적극적으로 도전하고, 새로운 시작을 해도 좋습니다.\n";
  advice += "• 기신운 해: 무리하지 말고, 안정을 유지하면서 다음을 준비하세요.\n";
  advice += "• 평운 해: 꾸준히 해오던 일을 지속하면서 기반을 다지세요.\n\n";

  if (cd.cautionPeriod && cd.cautionPeriod.length > 0) {
    advice += "【올해 특별 주의 사항】\n\n";
    for (const caution of cd.cautionPeriod) {
      advice += `• ${caution}\n`;
    }
  }

  // 마무리
  const closing = "이상으로 세운 분석을 마치겠습니다. 세운은 매년 바뀌는 것이므로, 매년 초에 그해의 운세를 확인하고 한 해를 계획하면 도움이 됩니다. 좋은 해에는 적극적으로 활동하고, 어려운 해에는 인내하면서 다음을 준비하면 인생의 파도를 지혜롭게 타실 수 있습니다.";

  return {
    intro,
    mainAnalysis,
    details,
    advice,
    closing,
  };
}

/**
 * 오행 한자 반환
 */
function getElementHanja(element: FiveElementKey): string {
  const hanjaMap: Record<FiveElementKey, string> = {
    목: "木", 화: "火", 토: "土", 금: "金", 수: "水",
  };
  return hanjaMap[element];
}

// ==================== 메인 분석 함수 ====================

/**
 * 10년간 형살 경고 생성
 */
function generateHyeongsalWarnings(
  sajuResult: SajuApiResult,
  tenYearForecast: YearlyFortuneDetailedAnalysis[]
): NonNullable<Chapter8Result["hyeongsalWarning"]> {
  const warnings: NonNullable<Chapter8Result["hyeongsalWarning"]>["warnings"] = [];

  for (const forecast of tenYearForecast) {
    const yearBranch = forecast.ganZhi.branchKr as EarthlyBranchKr;
    const hyeongsalResult = checkHyeongsal(sajuResult, yearBranch);

    if (hyeongsalResult.hasHyeongsal) {
      for (const info of hyeongsalResult.hyeongsalInfo) {
        warnings.push({
          year: forecast.year,
          pillar: info.pillar,
          name: info.name,
          warning: info.warning
        });
      }
    }
  }

  return {
    hasHyeongsal: warnings.length > 0,
    warnings
  };
}

export function analyzeChapter8(
  sajuResult: SajuApiResult,
  _gender: Gender,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string,
  currentDaeunGanji?: string
): Chapter8Result {
  // 10년 세운 예측
  const tenYearForecast = generateTenYearForecast(
    sajuResult,
    currentYear,
    currentAge,
    sinGangSinYak
  );

  // 현재 연도 상세 분석
  const currentYearAnalysis = analyzeCurrentYear(
    sajuResult,
    currentYear,
    currentAge,
    sinGangSinYak
  );

  // 대운+세운 조합 분석
  const daesunSeunCombination = analyzeDaesunSeunCombination(
    sajuResult,
    currentYear,
    currentAge,
    currentDaeunGanji
  );

  // 최고의 해 / 도전적인 해 식별
  const { bestYears, challengingYears } = identifyBestAndChallengingYears(tenYearForecast);

  // 형살(刑殺) 경고 생성
  const hyeongsalWarning = generateHyeongsalWarnings(sajuResult, tenYearForecast);

  // 서술형 Narrative 생성
  const narrative = generateSeunNarrative(
    tenYearForecast,
    currentYearAnalysis,
    daesunSeunCombination,
    bestYears,
    challengingYears,
    hyeongsalWarning
  );

  return {
    tenYearForecast,
    currentYear: currentYearAnalysis,
    daesunSeunCombination,
    bestYears,
    challengingYears,
    hyeongsalWarning,
    narrative,
  };
}
