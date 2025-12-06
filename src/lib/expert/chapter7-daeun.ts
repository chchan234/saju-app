/**
 * 제7장: 대운수(大運數) 풀이
 * - 0-100세 대운 분석
 * - 현재 대운 심층 분석
 * - 교운기 분석
 * - 용신 대운 판정
 */

import type { SajuApiResult, Gender, FiveElement, GanZhi } from "@/types/saju";
import type { Chapter7Result, MajorFortuneDetailedAnalysis } from "@/types/expert";

// 한글 오행을 영문으로 변환
const ELEMENT_KR_TO_EN: Record<FiveElementKey, FiveElement> = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water",
};

// ============================================
// 상수 및 데이터
// ============================================

type FiveElementKey = "목" | "화" | "토" | "금" | "수";

// 60갑자 순서
const SIXTY_GANJI: string[] = [
  "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
  "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
  "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
  "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
  "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
  "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해",
];

// 천간 오행
const CHEONGAN_OHENG: Record<string, FiveElementKey> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

// 천간 음양
const CHEONGAN_YINYANG: Record<string, "양" | "음"> = {
  갑: "양", 을: "음",
  병: "양", 정: "음",
  무: "양", 기: "음",
  경: "양", 신: "음",
  임: "양", 계: "음",
};

// 오행 생극 관계
const ELEMENT_RELATIONS: Record<FiveElementKey, {
  same: FiveElementKey;
  generates: FiveElementKey;
  controls: FiveElementKey;
  controlled: FiveElementKey;
  generated: FiveElementKey;
}> = {
  목: { same: "목", generates: "화", controls: "토", controlled: "금", generated: "수" },
  화: { same: "화", generates: "토", controls: "금", controlled: "수", generated: "목" },
  토: { same: "토", generates: "금", controls: "수", controlled: "목", generated: "화" },
  금: { same: "금", generates: "수", controls: "목", controlled: "화", generated: "토" },
  수: { same: "수", generates: "목", controls: "화", controlled: "토", generated: "금" },
};

// 대운 오행별 운세 해석 (기본)
const DAEUN_FORTUNE_BY_ELEMENT: Record<FiveElementKey, {
  career: string;
  wealth: string;
  health: string;
  relationship: string;
}> = {
  목: {
    career: "새로운 시작과 성장의 기회가 있습니다. 창업, 신규 사업, 교육 분야에 유리합니다.",
    wealth: "투자와 사업 확장에 적합한 시기입니다. 장기적인 성장을 목표로 하세요.",
    health: "간과 담, 근육 건강에 신경 쓰세요. 스트레칭과 유연성 운동이 좋습니다.",
    relationship: "인맥이 확장되고 새로운 만남이 많습니다. 적극적으로 네트워킹하세요.",
  },
  화: {
    career: "홍보, 마케팅, 영업 등 표현하는 일에서 성과가 있습니다. 인지도가 높아집니다.",
    wealth: "활발한 경제 활동으로 수입이 늘어납니다. 단, 과소비에 주의하세요.",
    health: "심장과 혈압에 주의하세요. 스트레스 관리와 명상이 도움이 됩니다.",
    relationship: "이성 관계가 활발해지고 사교 활동이 많아집니다. 열정적인 만남이 있습니다.",
  },
  토: {
    career: "안정적인 직장 생활이나 부동산, 금융 분야에서 성과가 있습니다. 기반을 다지는 시기입니다.",
    wealth: "저축과 부동산 투자에 좋은 시기입니다. 안정적인 재산 증식이 가능합니다.",
    health: "소화기관과 위장 건강에 신경 쓰세요. 규칙적인 식사가 중요합니다.",
    relationship: "신뢰할 수 있는 관계가 형성됩니다. 결혼이나 가정 안정에 좋은 시기입니다.",
  },
  금: {
    career: "결단력이 요구되는 일에서 성과가 있습니다. 법조, 군인, 금융 분야에 유리합니다.",
    wealth: "투자 수익이나 급여 인상이 기대됩니다. 재물 정리와 관리에 좋은 시기입니다.",
    health: "폐와 호흡기, 피부 건강에 주의하세요. 건조한 환경을 피하세요.",
    relationship: "정리되고 명확한 관계가 형성됩니다. 불필요한 인연은 정리됩니다.",
  },
  수: {
    career: "연구, 학문, 무역, 유통 분야에서 성과가 있습니다. 지혜와 통찰이 빛을 발합니다.",
    wealth: "유동적인 재물이 흐릅니다. 무역이나 유통 관련 투자가 유리합니다.",
    health: "신장과 방광, 생식기 건강에 주의하세요. 충분한 수분 섭취가 중요합니다.",
    relationship: "지적인 교류가 활발해지고 깊은 대화를 나눌 수 있는 인연이 있습니다.",
  },
};

// 신강신약 타입 정의
type StrengthType = "신강" | "신약" | "중화";

// 대운 오행별 × 신강신약별 상세 운세 해석 (75조합 = 5오행 × 3신강신약 × 5분야)
const DAEUN_STRENGTH_NARRATIVES: Record<FiveElementKey, Record<StrengthType, {
  overall: string;
  career: string;
  wealth: string;
  health: string;
  relationship: string;
}>> = {
  목: {
    신강: {
      overall: "신강 사주에 목(木) 대운이 왔습니다. 신강한 분에게 목 대운은 이미 강한 기운에 성장 에너지가 더해지는 시기입니다. 지나친 확장보다는 에너지를 적절히 발산하는 것이 중요합니다. 새로운 도전과 사업 확장의 기회가 있지만, 무리한 추진보다는 체계적인 계획이 필요합니다.",
      career: "신강한 분의 목 대운 직업운은 추진력이 매우 강해지는 시기입니다. 창업, 신규 사업, 프로젝트 리더 역할에 적합하며, 특히 교육, 출판, 환경 관련 분야에서 두각을 나타내실 수 있습니다. 다만 지나친 자신감으로 인한 독단적 결정은 피하고, 팀원들과의 협력을 통해 시너지를 내기 바랍니다. 경쟁에서 승리할 수 있는 기운이 있으나, 경쟁자와의 갈등에도 주의하세요.",
      wealth: "신강 목 대운의 재물운은 적극적인 투자와 사업 확장에 유리한 시기입니다. 장기적인 성장형 투자가 좋으며, 주식이나 펀드 등 성장주에 관심을 가지면 좋겠습니다. 다만 지나친 투자 욕심은 금물입니다. 부동산보다는 동산이나 사업 투자에 더 유리하며, 새로운 수입원을 개척할 수 있는 시기입니다. 공동 투자보다는 개인 투자가 유리합니다.",
      health: "신강 목 대운에는 간(肝)과 담(膽) 건강에 특히 신경 써야 합니다. 에너지가 넘치는 만큼 과로로 인한 피로 누적에 주의하고, 스트레스성 간 기능 저하를 예방하세요. 분노나 짜증을 참지 말고 적절히 표현하시되, 격렬한 감정 표출은 삼가세요. 스트레칭, 요가, 산책 등 유연성 운동이 좋으며, 술은 가급적 줄이는 것이 좋습니다.",
      relationship: "신강 목 대운의 인간관계는 적극적으로 인맥을 확장하기 좋은 시기입니다. 리더십을 발휘하여 새로운 모임을 주도하거나, 네트워킹 활동에 참여하면 좋은 인연을 만나실 수 있습니다. 다만 지나친 주장이나 고집으로 인해 갈등이 생길 수 있으니, 상대방의 의견도 경청하기 바랍니다. 후배나 아랫사람과의 관계에서 멘토 역할을 하면 보람을 느낄 수 있습니다."
    },
    신약: {
      overall: "신약 사주에 목(木) 대운이 왔습니다. 신약한 분에게 목 대운은 생명력과 활력을 불어넣어 주는 매우 좋은 시기입니다. 그동안 움츠러들었던 기운이 회복되고, 새로운 시작을 할 수 있는 에너지가 충만해집니다. 자신감을 가지고 적극적으로 나아가기 바랍니다.",
      career: "신약한 분의 목 대운 직업운은 그동안 기회를 잡지 못했던 사람들에게 새로운 전환점이 됩니다. 창의적인 분야, 교육, 컨설팅, 기획 업무에서 능력을 인정받을 수 있으며, 승진이나 이직의 기회도 찾아옵니다. 처음에는 조금 버거우실 수 있지만, 점차 자신감이 생기면서 성과를 내시게 됩니다. 새로운 기술이나 자격증 취득에도 좋은 시기입니다.",
      wealth: "신약 목 대운의 재물운은 서서히 좋아지는 흐름입니다. 급격한 재물 증가보다는 꾸준히 성장하는 형태로, 종잣돈을 마련하기 좋은 시기입니다. 새로운 부업이나 투잡을 시작하면 안정적인 추가 수입을 얻을 수 있습니다. 무리한 대출이나 빚은 피하고, 실력을 쌓으면서 자연스럽게 수입이 늘어나도록 하세요. 적금이나 장기 투자 상품이 유리합니다.",
      health: "신약 목 대운에는 간과 담 기능이 회복되면서 전반적인 체력이 좋아집니다. 그동안 허약했던 사람들도 활력이 생기고, 면역력이 강화됩니다. 다만 갑자기 무리하면 안 되고, 서서히 운동량을 늘려가세요. 산책, 등산, 수영 등 유산소 운동이 좋으며, 충분한 수면과 규칙적인 생활이 중요합니다. 녹색 채소와 신맛 나는 음식이 도움이 됩니다.",
      relationship: "신약 목 대운의 인간관계는 그동안 위축되었던 사회생활이 활발해지는 시기입니다. 새로운 친구, 동료, 멘토를 만나실 수 있으며, 이들이 인생에 긍정적인 영향을 미칩니다. 적극적으로 모임에 참여하고, 자신을 표현하기 바랍니다. 형제자매나 친구들과의 관계도 좋아지며, 그들로부터 도움을 받을 수 있습니다. 연애 운도 상승하여 좋은 인연을 만나실 수 있습니다."
    },
    중화: {
      overall: "중화 사주에 목(木) 대운이 왔습니다. 균형 잡힌 사주에 목 대운은 성장과 발전의 기회를 가져다주면서도 안정감을 유지할 수 있는 시기입니다. 새로운 도전과 현상 유지 사이에서 적절한 균형을 찾으면, 순조로운 발전을 이룰 수 있습니다.",
      career: "중화 사주의 목 대운 직업운은 안정 속에서 성장하는 시기입니다. 현재 직장에서의 승진이나 역할 확대가 자연스럽게 이루어지며, 새로운 프로젝트나 업무를 맡으시게 됩니다. 창업보다는 기존 기반 위에서의 확장이 유리하며, 교육, 기획, 인사 관련 업무에서 능력을 발휘합니다. 부업이나 사이드 프로젝트도 본업에 지장이 없는 선에서 시도해 볼 만합니다.",
      wealth: "중화 목 대운의 재물운은 안정적인 성장세를 보입니다. 급격한 재물 증가보다는 꾸준한 수입 증가와 자산 형성이 이루어집니다. 적립식 투자, 장기 펀드, 저축성 보험 등이 적합하며, 주식 투자 시에도 성장주와 안정주를 균형 있게 배분하면 좋겠습니다. 무리한 투자보다는 여유 자금 내에서 안전하게 운용하는 것이 좋습니다.",
      health: "중화 목 대운에는 전반적인 건강 상태가 양호합니다. 간과 담 건강도 무난하며, 체력이 꾸준히 유지됩니다. 다만 과로나 스트레스가 쌓이지 않도록 주의하고, 규칙적인 생활 습관을 유지하세요. 가벼운 운동과 스트레칭을 꾸준히 하고, 충분한 휴식을 취하면 건강을 잘 유지할 수 있습니다. 술은 적당히 먹고, 피로할 때는 쉬어가세요.",
      relationship: "중화 목 대운의 인간관계는 안정 속에서 새로운 인연이 더해지는 시기입니다. 기존 관계는 더욱 돈독해지고, 새로운 만남도 자연스럽게 이루어집니다. 사교 모임이나 취미 활동을 통해 다양한 사람들을 만나면 좋으며, 이 시기에 만난 인연이 오래 지속됩니다. 가족 관계도 화목하며, 형제자매와의 협력이 원활합니다."
    }
  },
  화: {
    신강: {
      overall: "신강 사주에 화(火) 대운이 왔습니다. 이미 강한 기운에 화의 열정과 표현력이 더해져 매우 활발한 시기가 됩니다. 에너지가 넘치시므로 이를 적절히 표출하고 관리하는 것이 중요합니다. 화려한 성과를 내실 수 있지만, 과열되지 않도록 조절이 필요합니다.",
      career: "신강한 분의 화 대운 직업운은 화려한 활약이 기대되는 시기입니다. 마케팅, 홍보, 영업, 엔터테인먼트, 방송 등 표현하고 알리는 분야에서 크게 성공할 수 있습니다. 대중 앞에 나서는 일, 프레젠테이션, 강연 등에서 빛을 발하며, 인지도가 상승합니다. 다만 지나친 욕심이나 조급함은 화를 부를 수 있으니, 차분하게 진행하기 바랍니다. 경쟁에서 승리하지만, 적을 만들지 않도록 주의하세요.",
      wealth: "신강 화 대운의 재물운은 수입은 늘어나지만 지출도 함께 증가하는 시기입니다. 화려한 소비 욕구가 강해지므로 과소비에 주의해야 합니다. 돈이 들어오는 만큼 나가기 쉬우니, 저축 계획을 세우고 지키기 바랍니다. 투자는 단기보다 중장기가 유리하며, 충동적인 투자 결정은 삼가세요. 사업 투자나 마케팅 비용은 효과가 있으나, 투자 대비 수익을 잘 계산하세요.",
      health: "신강 화 대운에는 심장, 혈압, 혈관 건강에 특히 신경 써야 합니다. 에너지가 넘치는 만큼 흥분하기 쉽고, 이로 인해 심혈관에 부담이 갈 수 있습니다. 스트레스 관리가 매우 중요하며, 명상, 심호흡, 차분한 취미 활동이 도움이 됩니다. 맵고 자극적인 음식은 줄이고, 충분한 수면을 취하세요. 규칙적인 유산소 운동으로 혈액 순환을 원활하게 하고, 정기적인 건강 검진을 받기 바랍니다.",
      relationship: "신강 화 대운의 인간관계는 매우 활발하고 화려해지는 시기입니다. 사교 활동이 늘어나고, 많은 사람들의 주목을 받습니다. 이성에게 인기가 높아지고, 연애 운도 상승합니다. 다만 불같은 성격이 드러나면 갈등이 생길 수 있으니, 감정 조절에 신경 쓰세요. 배우자나 파트너와의 관계에서도 열정적이지만 다툼이 생길 수 있으니, 서로 양보하는 자세가 필요합니다. 친구나 동료들과의 관계는 화려하지만 깊이가 부족할 수 있습니다."
    },
    신약: {
      overall: "신약 사주에 화(火) 대운이 왔습니다. 신약한 분에게 화 대운은 자신감과 표현력을 높여주는 좋은 시기입니다. 그동안 숨어 있던 재능과 매력이 드러나고, 주변 사람들에게 인정받으시게 됩니다. 적극적으로 자신을 표현하고 기회를 잡기 바랍니다.",
      career: "신약한 분의 화 대운 직업운은 그동안 묻혀 있던 능력이 빛을 발하는 시기입니다. 승진, 영전, 발탁의 기회가 오며, 특히 홍보, 마케팅, 서비스업, 예술 분야에서 두각을 나타냅니다. 프레젠테이션이나 발표에서 좋은 평가를 받고, 상사나 클라이언트에게 인정받습니다. 자신감을 가지고 적극적으로 기회를 잡으세요. 처음에는 부담스러우시겠지만, 하다 보면 자신감이 생깁니다.",
      wealth: "신약 화 대운의 재물운은 서서히 상승하는 흐름입니다. 그동안 막혀 있던 재물이 풀리기 시작하고, 새로운 수입원이 생깁니다. 본업에서의 성과가 인정받아 급여나 보너스가 오르고, 부업이나 투잡도 시작하기 좋습니다. 다만 돈이 들어오기 시작하면 쓰고 싶은 욕구도 커지니, 절제하기 바랍니다. 안정적인 저축을 우선시하고, 여유 자금이 생기면 투자를 고려하세요.",
      health: "신약 화 대운에는 심장과 소장 기능이 활성화되면서 혈액 순환이 좋아집니다. 그동안 손발이 차거나 냉증이 있었던 사람들은 호전되고, 체력도 향상됩니다. 다만 갑자기 활동량이 늘어나면 피로가 쌓일 수 있으니, 무리하지 말고 충분히 쉬세요. 따뜻한 음식과 붉은색 식품이 도움이 되며, 적당한 운동으로 체력을 기르기 바랍니다. 카페인은 적당히 먹고, 충분한 수면을 취하세요.",
      relationship: "신약 화 대운의 인간관계는 그동안 조용했던 사회생활이 활발해지는 시기입니다. 자신감이 생기면서 더 많은 사람들과 교류하게 되고, 매력이 발산되면서 인기가 상승합니다. 연애 운이 좋아져 새로운 이성을 만나시거나, 기존 관계가 발전합니다. 친구, 동료들과의 관계도 좋아지며, 모임에서 중심 역할을 하게 됩니다. 다만 너무 많은 관계를 유지하려 하면 피곤해지니, 중요한 관계에 집중하세요."
    },
    중화: {
      overall: "중화 사주에 화(火) 대운이 왔습니다. 균형 잡힌 사주에 화의 에너지가 더해져 활력이 넘치면서도 안정감을 유지할 수 있습니다. 적극적으로 자신을 표현하고 기회를 잡으시되, 지나치게 흥분하거나 과열되지 않도록 조절하면 좋은 성과를 거두실 수 있습니다.",
      career: "중화 사주의 화 대운 직업운은 안정 속에서 빛나는 시기입니다. 현재 위치에서 인정받고 승진하거나, 더 좋은 조건으로 이직할 수 있습니다. 마케팅, 홍보, 서비스업에서 능력을 발휘하며, 프레젠테이션이나 협상에서 좋은 결과를 얻습니다. 본업에 충실하면서 인맥을 넓히면, 다양한 기회가 찾아옵니다. 창업보다는 기존 조직에서의 성장이 더 유리합니다.",
      wealth: "중화 화 대운의 재물운은 균형 잡힌 성장세를 보입니다. 수입이 늘어나면서 생활의 질도 향상되지만, 과소비에 빠지지 않도록 주의하세요. 저축과 소비의 균형을 잘 맞추면 자산이 꾸준히 늘어납니다. 투자는 분산 투자가 좋으며, 한곳에 몰빵하는 것은 피하세요. 사업 투자보다는 금융 투자가 무난하며, 여유 자금 내에서 안전하게 운용하기 바랍니다.",
      health: "중화 화 대운에는 전반적인 건강 상태가 양호하며 활력이 넘칩니다. 심장과 혈관 건강도 무난하지만, 스트레스나 과로가 쌓이지 않도록 주의하세요. 규칙적인 운동과 충분한 휴식이 중요하며, 명상이나 요가 등으로 마음의 안정을 찾으면 좋습니다. 맵고 자극적인 음식은 적당히 먹고, 술과 담배는 줄이기 바랍니다. 정기 건강 검진을 통해 관리해 나가세요.",
      relationship: "중화 화 대운의 인간관계는 적극적이면서도 조화로운 시기입니다. 사교 활동이 활발해지고 다양한 사람들을 만나시지만, 깊이 있는 관계도 유지합니다. 연애 운이 좋아 좋은 인연을 만나시거나, 기존 관계가 더욱 발전합니다. 가족, 친구, 동료들과의 관계도 화목하며, 모임에서 분위기를 이끄는 역할을 합니다. 갈등이 생기더라도 대화로 잘 풀어가실 수 있습니다."
    }
  },
  토: {
    신강: {
      overall: "신강 사주에 토(土) 대운이 왔습니다. 이미 강한 기운에 토의 안정 에너지가 더해지면, 지나치게 보수적이거나 답답해질 수 있습니다. 적극적인 에너지를 발산하면서도 기반을 다지는 균형이 필요합니다. 현실에 안주하지 말고 새로운 도전도 병행하기 바랍니다.",
      career: "신강한 분의 토 대운 직업운은 안정을 추구하게 되는 시기입니다. 부동산, 금융, 농업, 건설 등 토 관련 분야에서 성과가 있으며, 기존 사업의 기반을 튼튼히 다지시기 좋습니다. 다만 변화와 도전을 두려워하면 성장이 멈출 수 있습니다. 안정 속에서도 새로운 시도를 하고, 자기 계발에 힘쓰세요. 승진보다는 현 위치에서의 역할 강화가 이루어지며, 전문성을 높이는 것이 유리합니다.",
      wealth: "신강 토 대운의 재물운은 안정적인 자산 관리에 좋은 시기입니다. 부동산 투자, 저축, 장기 투자 상품이 유리하며, 급격한 재물 증가보다는 꾸준한 자산 증식이 이루어집니다. 다만 지나치게 보수적으로만 운용하면 기회를 놓칠 수 있으니, 일부 자금은 성장형 투자에 배분하기 바랍니다. 사업 확장보다는 내실을 다지고, 불필요한 지출을 줄여 저축을 늘리세요.",
      health: "신강 토 대운에는 비위(脾胃), 즉 소화기 건강에 신경 써야 합니다. 과식이나 불규칙한 식사가 소화 장애를 일으킬 수 있으니, 규칙적인 식사 습관을 유지하세요. 스트레스로 인한 위장 질환도 주의하고, 단 음식이나 기름진 음식은 줄이기 바랍니다. 적당한 운동으로 신진대사를 활성화하고, 체중 관리에도 신경 쓰세요. 황색 식품(호박, 고구마, 단호박 등)이 도움이 됩니다.",
      relationship: "신강 토 대운의 인간관계는 신뢰를 바탕으로 한 관계가 강화되는 시기입니다. 오래된 친구, 가족과의 관계가 더욱 돈독해지고, 믿을 수 있는 사람들과의 유대가 깊어집니다. 다만 새로운 인연을 만드는 것에는 소극적이 될 수 있으니, 열린 마음을 가지기 바랍니다. 결혼이나 가정 안정에 좋은 시기이며, 배우자나 파트너와의 관계가 안정됩니다. 부동산이나 주거 관련 결정도 무난하게 이루어집니다."
    },
    신약: {
      overall: "신약 사주에 토(土) 대운이 왔습니다. 신약한 분에게 토 대운은 안정과 기반을 다지는 중요한 시기입니다. 그동안 불안정했던 상황이 안정되고, 뿌리를 내릴 수 있는 기회가 옵니다. 급하게 서두르지 말고 차근차근 기반을 다지면, 단단한 토대 위에서 성장할 수 있습니다.",
      career: "신약한 분의 토 대운 직업운은 안정적인 직장을 얻거나 현재 위치가 안정되는 시기입니다. 그동안 불안정했던 고용 상태가 정규직으로 전환되거나, 믿을 수 있는 직장에 자리 잡으시게 됩니다. 부동산, 금융, 행정, 공무원 등 안정적인 분야가 유리하며, 기존 업무에서 전문성을 쌓는 것이 좋습니다. 창업보다는 취업이 유리하고, 급격한 변화보다는 현 위치에서의 성장을 추구하세요.",
      wealth: "신약 토 대운의 재물운은 그동안 불안정했던 재정이 안정되는 시기입니다. 꾸준한 수입이 생기고, 저축을 시작할 수 있게 됩니다. 부동산이나 저축성 보험, 적금 등 안정적인 자산 형성이 유리하며, 급하게 돈을 벌려 하지 말고 차근차근 모아가세요. 빚을 갚고 재정을 정리하기 좋은 시기이며, 불필요한 지출을 줄이면 여유 자금이 생깁니다. 작은 것부터 모으면 큰 자산이 됩니다.",
      health: "신약 토 대운에는 비위 기능이 강화되어 소화 흡수력이 좋아집니다. 그동안 식욕이 없거나 소화가 잘 안 됐던 사람들은 호전되고, 체력도 회복됩니다. 규칙적인 식사와 충분한 영양 섭취가 중요하며, 너무 차가운 음식은 피하고 따뜻한 음식을 드세요. 적당한 운동으로 근육을 키우면 기초 체력이 향상됩니다. 황토색 음식(잡곡, 뿌리채소)이 도움이 되며, 과식은 피하기 바랍니다.",
      relationship: "신약 토 대운의 인간관계는 그동안 불안정했던 관계가 안정되는 시기입니다. 믿을 수 있는 사람들과의 유대가 깊어지고, 진정한 친구나 조력자를 만나실 수 있습니다. 가족 관계도 안정되며, 특히 부모님이나 어른과의 관계가 좋아집니다. 결혼을 고려하는 사람들에게는 안정적인 결혼 상대를 만나시기 좋은 시기이며, 주거 안정도 이루어집니다. 새로운 관계보다는 기존 관계의 강화가 이루어집니다."
    },
    중화: {
      overall: "중화 사주에 토(土) 대운이 왔습니다. 균형 잡힌 사주에 토의 안정 에너지가 더해져, 흔들림 없이 기반을 다지면서 성장할 수 있습니다. 급격한 변화보다는 꾸준한 발전이 이루어지며, 안정 속에서 착실하게 성과를 쌓아가는 시기입니다.",
      career: "중화 사주의 토 대운 직업운은 안정적인 성장이 이루어지는 시기입니다. 현재 직장에서 입지가 굳건해지고, 전문성을 인정받아 핵심 인력으로 자리매김합니다. 부동산, 금융, 행정, 교육 등 안정적인 분야에서 성과가 있으며, 조직 내에서의 신뢰가 두터워집니다. 창업보다는 조직 내 성장이 유리하며, 급격한 변화보다는 현 위치에서의 역량 강화에 집중하기 바랍니다.",
      wealth: "중화 토 대운의 재물운은 꾸준한 자산 증식이 이루어지는 시기입니다. 부동산 투자, 저축, 연금 상품 등 안정적인 자산 형성이 유리하며, 급격한 재물 증가보다는 착실한 성장이 기대됩니다. 수입과 지출의 균형을 잘 맞추면 여유 자금이 쌓이고, 이를 장기 투자에 활용하면 좋습니다. 사업 확장보다는 내실을 다지고, 무리한 투자는 피하기 바랍니다.",
      health: "중화 토 대운에는 전반적인 건강 상태가 안정적입니다. 소화기 건강도 무난하며, 체력이 꾸준히 유지됩니다. 규칙적인 식사와 생활 습관을 유지하면 큰 문제 없이 건강하게 지내실 수 있습니다. 적당한 운동으로 체중을 관리하고, 과식이나 야식은 피하세요. 스트레스가 쌓이지 않도록 취미 생활을 즐기고, 충분한 휴식을 취하기 바랍니다.",
      relationship: "중화 토 대운의 인간관계는 안정적이고 신뢰 있는 관계가 유지되는 시기입니다. 가족, 친구, 동료들과의 관계가 원만하고, 믿을 수 있는 사람들과의 유대가 깊어집니다. 결혼이나 가정 안정에 좋은 시기이며, 부동산이나 주거 관련 결정도 무난하게 이루어집니다. 새로운 인연보다는 기존 관계의 강화가 이루어지며, 오래 알고 지낸 사람들과의 협력이 빛을 발합니다."
    }
  },
  금: {
    신강: {
      overall: "신강 사주에 금(金) 대운이 왔습니다. 이미 강한 기운에 금의 결단력과 날카로움이 더해지면, 강력한 추진력을 발휘하지만 지나치면 냉정해지거나 갈등이 생길 수 있습니다. 결단력을 적절히 발휘하시되, 유연성도 함께 갖추기 바랍니다.",
      career: "신강한 분의 금 대운 직업운은 강력한 결단력과 실행력이 발휘되는 시기입니다. 법조, 군인, 경찰, 금융, 의료 등 결단력이 요구되는 분야에서 성과를 내시며, 조직을 이끌거나 중요한 결정을 내리는 위치에 오를 수 있습니다. 다만 지나친 강압적 태도는 반발을 살 수 있으니, 부드러운 리더십도 필요합니다. 경쟁에서 승리하지만, 원만한 관계도 유지하기 바랍니다. 구조조정이나 정리가 필요한 업무에서 능력을 발휘합니다.",
      wealth: "신강 금 대운의 재물운은 결단력 있는 투자로 수익을 내실 수 있는 시기입니다. 재물 정리와 관리에 좋으며, 불필요한 자산을 정리하고 효율적으로 재편하면 좋습니다. 다만 지나치게 공격적인 투자는 손실을 부를 수 있으니, 냉정하게 판단하세요. 투자 수익이나 급여 인상이 기대되며, 부업이나 사이드 비즈니스에서도 성과가 있습니다. 빚 정리나 재정 건전화에도 좋은 시기입니다.",
      health: "신강 금 대운에는 폐(肺)와 대장, 호흡기, 피부 건강에 신경 써야 합니다. 스트레스로 인한 피부 트러블이나 호흡기 질환에 주의하고, 건조한 환경은 피하세요. 분노나 억압된 감정이 건강에 영향을 줄 수 있으니, 적절히 표현하고 해소하기 바랍니다. 심호흡, 명상, 숲 산책 등이 도움이 되며, 흰색 식품(무, 배, 도라지)이 폐 건강에 좋습니다. 피부 관리에도 신경 쓰세요.",
      relationship: "신강 금 대운의 인간관계는 정리와 명확함이 특징인 시기입니다. 불필요한 관계는 정리되고, 진정으로 필요한 관계만 남게 됩니다. 이 시기에 멀어지는 인연은 어차피 필요 없는 인연이니 아쉬워하지 마세요. 다만 너무 차갑게 대하면 좋은 인연도 떠날 수 있으니, 냉정함과 따뜻함의 균형을 유지하세요. 새로운 인연보다는 기존 관계의 질적 향상이 이루어지며, 깊고 신뢰 있는 관계가 형성됩니다."
    },
    신약: {
      overall: "신약 사주에 금(金) 대운이 왔습니다. 신약한 분에게 금 대운은 결단력과 실행력을 높여주는 시기입니다. 그동안 우유부단했거나 결정을 미뤘던 사람들이 이 시기에 명확한 판단을 내리시게 됩니다. 다만 지나친 경직성은 피하고 유연성도 유지하세요.",
      career: "신약한 분의 금 대운 직업운은 그동안 결단을 내리지 못했던 일들이 정리되는 시기입니다. 이직, 창업, 부서 이동 등 중요한 결정을 내리시게 되며, 이 결정이 좋은 결과를 가져옵니다. 법조, 행정, 금융, 기술 분야에서 능력을 발휘하며, 분석력과 판단력이 인정받습니다. 처음에는 부담스러우시겠지만, 결단을 내리면 상황이 명확해집니다. 전문 자격증 취득이나 기술 습득에도 좋은 시기입니다.",
      wealth: "신약 금 대운의 재물운은 재정 상황이 명확해지고 정리되는 시기입니다. 그동안 불분명했던 재정 문제가 해결되고, 수입과 지출이 체계화됩니다. 불필요한 지출을 줄이고 저축을 늘리면 재정이 안정됩니다. 투자는 분석적으로 접근하면 좋은 결과가 있으며, 금융 상품이나 채권 투자가 유리합니다. 빚이 있다면 정리하기 좋은 시기이며, 재정 계획을 새로 세우기 바랍니다.",
      health: "신약 금 대운에는 폐와 호흡기 기능이 강화되어 면역력이 향상됩니다. 그동안 감기에 자주 걸렸거나 호흡기가 약했던 사람들은 호전되고, 체력도 회복됩니다. 규칙적인 운동과 충분한 수면이 중요하며, 신선한 공기를 마시는 것이 좋습니다. 피부 건강도 좋아지며, 흰색 식품(배, 무, 마늘)이 도움이 됩니다. 금연을 시도하기 좋은 시기이며, 호흡 명상이 추천됩니다.",
      relationship: "신약 금 대운의 인간관계는 그동안 애매했던 관계가 명확해지는 시기입니다. 진정한 친구가 누구인지 알게 되고, 불필요한 관계는 자연스럽게 정리됩니다. 새로운 인연 중에서도 신뢰할 수 있는 사람을 만나시게 되며, 깊고 의미 있는 관계가 형성됩니다. 결혼을 고려하는 사람들은 상대방에 대한 명확한 판단을 내리시게 되며, 현명한 선택을 할 수 있습니다. 가족 관계도 정리되고 명확해집니다."
    },
    중화: {
      overall: "중화 사주에 금(金) 대운이 왔습니다. 균형 잡힌 사주에 금의 결단력이 더해져, 명확하게 판단하면서도 지나치게 날카로워지지 않는 좋은 시기입니다. 필요한 결정은 과감하게 내리시되, 주변과의 조화도 유지하면 좋은 성과를 거두실 수 있습니다.",
      career: "중화 사주의 금 대운 직업운은 명확한 판단력으로 성과를 내는 시기입니다. 분석, 기획, 금융, 법무 등 논리와 판단력이 요구되는 분야에서 능력을 발휘하며, 중요한 의사결정에 참여하게 됩니다. 승진이나 역할 확대가 자연스럽게 이루어지며, 전문성을 인정받습니다. 불필요한 업무나 비효율적인 프로세스를 정리하고 효율화하는 능력이 빛을 발합니다.",
      wealth: "중화 금 대운의 재물운은 효율적인 재정 관리로 자산이 증가하는 시기입니다. 불필요한 지출을 줄이고 필요한 곳에 투자하면 좋은 수익을 얻습니다. 금융 상품, 채권, 배당주 등 안정적이면서도 수익성 있는 투자가 유리하며, 재정 계획을 세우고 실행하면 자산이 늘어납니다. 급여 인상이나 부업 수입도 기대되며, 재물 정리에도 좋은 시기입니다.",
      health: "중화 금 대운에는 전반적인 건강 상태가 양호하며, 폐와 호흡기 건강도 무난합니다. 규칙적인 생활과 적당한 운동으로 건강을 유지하면 되며, 건조한 환경은 피하고 적절한 습도를 유지하세요. 스트레스를 받으면 피부에 반응이 나타날 수 있으니, 스트레스 관리에 신경 쓰기 바랍니다. 심호흡과 명상이 도움이 되며, 흰색 식품을 적당히 섭취하세요.",
      relationship: "중화 금 대운의 인간관계는 명확하고 신뢰 있는 관계가 유지되는 시기입니다. 불필요한 사교보다는 의미 있는 관계에 집중하게 되며, 진정한 친구와 조력자가 누구인지 명확해집니다. 가족이나 가까운 사람들과의 관계가 더욱 돈독해지며, 서로에 대한 신뢰가 깊어집니다. 새로운 인연도 신뢰를 바탕으로 시작되며, 오래 지속될 관계가 형성됩니다."
    }
  },
  수: {
    신강: {
      overall: "신강 사주에 수(水) 대운이 왔습니다. 이미 강한 기운에 수의 유연함과 지혜가 더해지면, 다양한 분야에서 활약하지만 흐름이 너무 빨라질 수 있습니다. 지혜롭게 판단하되, 한곳에 집중하는 것도 필요합니다. 물처럼 유연하되 방향성을 잃지 마세요.",
      career: "신강한 분의 수 대운 직업운은 다양한 기회가 찾아오는 시기입니다. 무역, 유통, IT, 학문, 연구 등 유동적인 분야에서 성과가 있으며, 해외 진출이나 이직의 기회도 많습니다. 다만 너무 많은 기회를 쫓으면 어느 것도 제대로 잡지 못할 수 있으니, 선택과 집중이 필요합니다. 지적 능력과 통찰력이 빛을 발하며, 컨설팅이나 기획 업무에서 두각을 나타냅니다. 변화를 두려워하지 마시되, 신중하게 결정하세요.",
      wealth: "신강 수 대운의 재물운은 유동적인 재물이 많이 흐르는 시기입니다. 수입이 늘어나지만 지출도 함께 증가하므로, 재물 관리에 신경 써야 합니다. 무역, 유통, 해외 투자 등 유동적인 분야에서 수익이 있으며, 단기 투자도 괜찮습니다. 다만 돈이 들어오는 만큼 나가기 쉬우니, 저축 계획을 세우고 지키기 바랍니다. 투기성 투자는 피하고, 정보에 기반한 투자를 하세요.",
      health: "신강 수 대운에는 신장(腎)과 방광, 생식기 건강에 신경 써야 합니다. 과로나 스트레스로 인한 신장 기능 저하에 주의하고, 충분한 수분 섭취와 휴식이 중요합니다. 지나친 음주나 카페인 섭취는 피하고, 따뜻한 음료와 검은색 식품(검은콩, 흑미, 해조류)이 도움이 됩니다. 허리 건강에도 주의하고, 무리한 활동은 삼가세요. 충분한 수면과 규칙적인 생활이 필수입니다.",
      relationship: "신강 수 대운의 인간관계는 매우 활발하고 다양해지는 시기입니다. 많은 사람들을 만나고 인맥이 넓어지지만, 깊이보다는 넓이가 우선되기 쉽습니다. 지적인 교류가 활발해지고, 다양한 분야의 사람들과 대화를 나누시게 됩니다. 다만 관계가 유동적이므로 진정한 친구를 구별하는 안목이 필요합니다. 이성 관계도 활발하지만 쉽게 시작되고 끝날 수 있으니, 진지한 관계를 원하면 신중하게 선택하세요."
    },
    신약: {
      overall: "신약 사주에 수(水) 대운이 왔습니다. 신약한 분에게 수 대운은 지혜와 통찰력을 높여주는 좋은 시기입니다. 그동안 막혀 있던 생각이 풀리고, 명석한 판단력이 생깁니다. 물처럼 유연하게 상황에 적응하면서, 지혜롭게 기회를 잡기 바랍니다.",
      career: "신약한 분의 수 대운 직업운은 지적 능력이 빛을 발하는 시기입니다. 연구, 학문, IT, 컨설팅, 무역 등 지식 기반 분야에서 성과가 있으며, 자격증 취득이나 학위 취득에도 좋습니다. 그동안 능력을 인정받지 못했던 사람들이 이 시기에 실력을 발휘하게 됩니다. 해외 관련 기회가 있으며, 외국어 실력이 도움이 됩니다. 새로운 분야를 배우시거나 전문성을 높이시기에 적합한 시기입니다.",
      wealth: "신약 수 대운의 재물운은 서서히 흐름이 좋아지는 시기입니다. 그동안 막혀 있던 재물 흐름이 풀리고, 새로운 수입원이 생깁니다. 지식이나 기술을 활용한 수입이 좋으며, 온라인 비즈니스나 콘텐츠 제작 등도 유리합니다. 무리한 투자보다는 실력을 쌓으면서 자연스럽게 수입이 늘어나도록 하세요. 해외 관련 투자나 외화 자산도 고려해 볼 만합니다. 유동 자산과 저축의 균형을 맞추기 바랍니다.",
      health: "신약 수 대운에는 신장과 방광 기능이 강화되어 노폐물 배출이 원활해집니다. 그동안 부종이 있거나 피로감이 심했던 사람들은 호전되고, 활력이 생깁니다. 충분한 수분 섭취와 규칙적인 배뇨 습관이 중요하며, 검은색 식품(검은콩, 흑미, 해조류)이 도움이 됩니다. 허리 건강에도 신경 쓰고, 적당한 운동으로 순환을 돕세요. 충분한 수면과 휴식이 체력 회복에 도움이 됩니다.",
      relationship: "신약 수 대운의 인간관계는 지적인 교류가 활발해지는 시기입니다. 비슷한 관심사를 가진 사람들과 만나 깊은 대화를 나누시게 되며, 멘토나 조력자를 만나실 수 있습니다. 학습 모임이나 스터디 그룹에 참여하면 좋은 인연을 만들고, 지적 성장도 이룰 수 있습니다. 연애 운도 좋아지며, 대화가 잘 통하는 상대를 만나시게 됩니다. 온라인이나 SNS를 통한 인연도 의미 있을 수 있습니다."
    },
    중화: {
      overall: "중화 사주에 수(水) 대운이 왔습니다. 균형 잡힌 사주에 수의 유연함과 지혜가 더해져, 상황에 맞게 적응하면서 지혜로운 판단을 내릴 수 있습니다. 물처럼 흐르되 방향을 잃지 않으면, 원하는 곳에 도달할 수 있습니다.",
      career: "중화 사주의 수 대운 직업운은 지적 능력과 적응력이 빛을 발하는 시기입니다. 연구, 기획, 컨설팅, IT, 무역 등 지식 기반 분야에서 성과가 있으며, 변화하는 환경에 유연하게 대응하는 능력이 인정받습니다. 해외 관련 기회가 있으며, 새로운 분야를 배우시거나 역량을 확장하기 좋습니다. 안정적인 성장 속에서 다양한 경험을 쌓으시며, 폭넓은 전문성을 갖추시게 됩니다.",
      wealth: "중화 수 대운의 재물운은 유동적이면서도 안정적인 흐름을 보입니다. 수입이 꾸준히 증가하며, 다양한 경로로 재물이 들어옵니다. 무역, IT, 콘텐츠 등 유동적인 분야에서 수익이 있으며, 해외 투자나 외화 자산도 고려해 볼 만합니다. 저축과 투자의 균형을 잘 맞추면 자산이 꾸준히 늘어납니다. 급격한 투자보다는 장기적인 관점에서 안전하게 운용하기 바랍니다.",
      health: "중화 수 대운에는 전반적인 건강 상태가 양호하며, 신장과 방광 건강도 무난합니다. 충분한 수분 섭취와 규칙적인 생활이 중요하며, 과로하지 않도록 주의하세요. 적당한 운동과 충분한 휴식으로 체력을 유지하면 되며, 검은색 식품이 도움이 됩니다. 허리 건강에도 신경 쓰고, 장시간 앉아 있는 것은 피하세요. 스트레스 관리를 위해 물가나 자연 속에서 휴식을 취하면 좋습니다.",
      relationship: "중화 수 대운의 인간관계는 유연하고 조화로운 시기입니다. 다양한 사람들과 원만하게 교류하며, 지적인 대화를 통해 깊은 유대를 형성합니다. 새로운 인연도 자연스럽게 만나고, 기존 관계도 원만하게 유지합니다. 해외 인연이나 다른 분야의 사람들과의 교류가 활발하며, 시야가 넓어집니다. 연애 운도 좋으며, 대화가 잘 통하는 상대와의 인연이 기대됩니다."
    }
  }
};

// 신강신약 키 변환 헬퍼
function getStrengthKey(sinGangSinYak: string): StrengthType {
  if (sinGangSinYak === "신강") return "신강";
  if (sinGangSinYak === "신약") return "신약";
  return "중화";
}

// ============================================
// 분석 함수
// ============================================

/**
 * 대운 시작 나이 계산 (간략화)
 */
function calculateDaeunStartAge(
  birthYear: number,
  birthMonth: number,
  gender: Gender,
  yearStemYinyang: "양" | "음"
): number {
  // 대운 시작 나이 계산 (간략화된 버전)
  // 실제로는 절기를 기준으로 정확히 계산해야 함
  const isYangNam = gender === "male" && yearStemYinyang === "양";
  const isUmNam = gender === "male" && yearStemYinyang === "음";
  const isYangYeo = gender === "female" && yearStemYinyang === "양";
  const isUmYeo = gender === "female" && yearStemYinyang === "음";

  // 순행: 양남, 음녀 / 역행: 음남, 양녀
  const isForward = isYangNam || isUmYeo;

  // 간략화: 절기까지의 거리를 월로 계산 (대략적)
  let monthsToSeason: number;
  if (isForward) {
    monthsToSeason = ((13 - birthMonth) % 12) || 12;
  } else {
    monthsToSeason = birthMonth;
  }

  // 3개월 = 1년 대운
  const startAge = Math.round(monthsToSeason / 3);
  return Math.max(1, Math.min(startAge, 10)); // 1~10세 사이
}

/**
 * 다음 대운 간지 계산
 */
function getNextDaeunGanZhi(
  monthGanZhi: string,
  index: number,
  isForward: boolean
): string {
  const currentIndex = SIXTY_GANJI.indexOf(monthGanZhi);
  let nextIndex: number;

  if (isForward) {
    nextIndex = (currentIndex + index) % 60;
  } else {
    nextIndex = (currentIndex - index + 60) % 60;
  }

  return SIXTY_GANJI[nextIndex];
}

/**
 * 대운이 용신 대운인지 판정
 */
function checkYongsinDaeun(
  daeunElement: FiveElementKey,
  ilganElement: FiveElementKey,
  sinGangSinYak: "신강" | "신약" | "중화"
): "길운" | "흉운" | "평운" {
  const relations = ELEMENT_RELATIONS[ilganElement];

  if (sinGangSinYak === "신강") {
    // 신강: 식상, 재성, 관성이 용신 (설기)
    if (daeunElement === relations.generates) return "길운"; // 식상
    if (daeunElement === relations.controls) return "길운";  // 재성
    if (daeunElement === relations.controlled) return "평운"; // 관성 (제어)
    if (daeunElement === relations.same) return "흉운";      // 비겁 (너무 강해짐)
    return "평운";
  } else if (sinGangSinYak === "신약") {
    // 신약: 비겁, 인성이 용신 (도움)
    if (daeunElement === relations.same) return "길운";      // 비겁
    if (daeunElement === relations.generated) return "길운"; // 인성
    if (daeunElement === relations.controlled) return "흉운"; // 관성 (극)
    return "평운";
  } else {
    // 중화: 균형 유지
    return "평운";
  }
}

/**
 * GanZhi 객체 생성 헬퍼
 */
function createGanZhi(ganZhiStr: string): GanZhi {
  const gan = ganZhiStr[0];
  const ji = ganZhiStr[1];

  // 천간 영문/한자 매핑
  const stemMap: Record<string, { stem: string; hanja: string }> = {
    갑: { stem: "gap", hanja: "甲" },
    을: { stem: "eul", hanja: "乙" },
    병: { stem: "byeong", hanja: "丙" },
    정: { stem: "jeong", hanja: "丁" },
    무: { stem: "mu", hanja: "戊" },
    기: { stem: "gi", hanja: "己" },
    경: { stem: "gyeong", hanja: "庚" },
    신: { stem: "sin", hanja: "辛" },
    임: { stem: "im", hanja: "壬" },
    계: { stem: "gye", hanja: "癸" },
  };

  // 지지 영문/한자 매핑
  const branchMap: Record<string, { branch: string; hanja: string }> = {
    자: { branch: "ja", hanja: "子" },
    축: { branch: "chuk", hanja: "丑" },
    인: { branch: "in", hanja: "寅" },
    묘: { branch: "myo", hanja: "卯" },
    진: { branch: "jin", hanja: "辰" },
    사: { branch: "sa", hanja: "巳" },
    오: { branch: "o", hanja: "午" },
    미: { branch: "mi", hanja: "未" },
    신: { branch: "shin", hanja: "申" },
    유: { branch: "yu", hanja: "酉" },
    술: { branch: "sul", hanja: "戌" },
    해: { branch: "hae", hanja: "亥" },
  };

  const stemInfo = stemMap[gan] || { stem: "gap", hanja: "甲" };
  const branchInfo = branchMap[ji] || { branch: "ja", hanja: "子" };

  return {
    stem: stemInfo.stem as GanZhi["stem"],
    stemKr: gan as GanZhi["stemKr"],
    branch: branchInfo.branch as GanZhi["branch"],
    branchKr: ji as GanZhi["branchKr"],
    fullHanja: `${stemInfo.hanja}${branchInfo.hanja}`,
    fullKr: ganZhiStr,
  };
}

/**
 * 개별 대운 분석
 */
function analyzeSingleDaeun(
  ganZhiStr: string,
  startAge: number,
  endAge: number,
  currentAge: number,
  ilganElement: FiveElementKey,
  sinGangSinYak: "신강" | "신약" | "중화"
): MajorFortuneDetailedAnalysis {
  const daeunGan = ganZhiStr[0];
  const daeunElement = CHEONGAN_OHENG[daeunGan];
  const isCurrentDaeun = currentAge >= startAge && currentAge < endAge;

  const relationToYongsin = checkYongsinDaeun(daeunElement, ilganElement, sinGangSinYak);

  // 신강신약별 상세 텍스트 가져오기
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthNarrative = DAEUN_STRENGTH_NARRATIVES[daeunElement][strengthKey];
  const fortuneInfo = DAEUN_FORTUNE_BY_ELEMENT[daeunElement];

  // 신강신약별 상세 overall 텍스트 사용
  const overallFortune = strengthNarrative.overall;

  const keyEvents = generateKeyEvents(daeunElement, relationToYongsin, startAge);
  const ganZhi = createGanZhi(ganZhiStr);

  return {
    startAge,
    endAge,
    ganZhi,
    element: ELEMENT_KR_TO_EN[daeunElement],
    isCurrentDaeun,
    relationToYongsin,
    overallFortune,
    // 신강신약별 상세 텍스트 사용
    careerFortune: strengthNarrative.career,
    wealthFortune: strengthNarrative.wealth,
    healthFortune: strengthNarrative.health,
    relationshipFortune: strengthNarrative.relationship,
    keyEvents,
    advice: generateAdvice(relationToYongsin, daeunElement, sinGangSinYak),
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

/**
 * 주요 이벤트 생성
 */
function generateKeyEvents(
  element: FiveElementKey,
  relation: "길운" | "흉운" | "평운",
  startAge: number
): string[] {
  const events: string[] = [];

  if (relation === "길운") {
    if (element === "목") events.push("새로운 사업 시작 기회", "학업/자격증 취득");
    if (element === "화") events.push("승진 또는 인지도 상승", "중요한 발표/프레젠테이션");
    if (element === "토") events.push("부동산 관련 기회", "안정적인 기반 마련");
    if (element === "금") events.push("중요한 결정의 시기", "재물 수확");
    if (element === "수") events.push("해외 기회", "학문적 성취");
  } else if (relation === "흉운") {
    events.push("건강 관리 필요", "신중한 결정 필요");
  } else {
    events.push("꾸준한 노력 유지", "현상 유지 및 준비");
  }

  return events;
}

/**
 * 조언 생성 (신강신약별 상세 조언)
 */
function generateAdvice(
  relation: "길운" | "흉운" | "평운",
  element: FiveElementKey,
  sinGangSinYak: "신강" | "신약" | "중화"
): string {
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthNarrative = DAEUN_STRENGTH_NARRATIVES[element][strengthKey];

  // 기본 조언에 신강신약별 특성 추가
  if (relation === "길운") {
    if (sinGangSinYak === "신강") {
      return `${element} 대운의 좋은 기운을 적극 활용하되, 지나친 욕심은 금물입니다. 에너지가 넘치시므로 주변과의 조화를 이루면서 도전하기 바랍니다. ${strengthNarrative.career.slice(0, 100)}...`;
    } else if (sinGangSinYak === "신약") {
      return `${element} 대운이 큰 힘이 되어주는 시기입니다. 자신감을 가지고 그동안 미뤄왔던 도전을 시작하세요. 이 시기를 잘 활용하면 인생의 전환점이 될 수 있습니다.`;
    }
    return `${element} 대운의 좋은 기운과 함께 균형 잡힌 발전이 이루어집니다. 현재의 안정을 유지하면서 기회를 잡기 바랍니다.`;
  } else if (relation === "흉운") {
    if (sinGangSinYak === "신강") {
      return `${element} 대운에서는 에너지가 과해질 수 있으니 무리하지 말고 조절하세요. 건강과 인간관계에 신경 쓰고, 보수적으로 운영하기 바랍니다.`;
    } else if (sinGangSinYak === "신약") {
      return `${element} 대운이 부담이 될 수 있으니 무리하지 마세요. 체력 관리에 유의하고, 큰 결정은 신중하게 하기 바랍니다. 내실을 다지는 시기로 삼으세요.`;
    }
    return `${element} 대운에서는 현상 유지를 권장합니다. 무리한 도전보다는 안정을 추구하고, 다음 기회를 준비하세요.`;
  }
  // 평운
  if (sinGangSinYak === "신강") {
    return `${element} 대운에서는 에너지를 적절히 발산하면서 현재 상황을 유지하세요. 급격한 변화보다는 꾸준한 노력이 중요합니다.`;
  } else if (sinGangSinYak === "신약") {
    return `${element} 대운에서는 차분하게 실력을 쌓고 기반을 다지세요. 무리하지 말고 꾸준히 노력하면 좋은 결과가 있을 것입니다.`;
  }
  return `${element} 대운에서는 균형을 유지하면서 다음 기회를 준비하세요. 현재 상황에서 최선을 다하기 바랍니다.`;
}

/**
 * 대운수 서술형 Narrative 생성
 */
function generateDaeunNarrative(
  allDaeuns: MajorFortuneDetailedAnalysis[],
  currentDaeun: Chapter7Result["currentDaeun"],
  transitionPeriod: Chapter7Result["transitionPeriod"],
  yongsinDaeuns: Chapter7Result["yongsinDaeuns"],
  lifetimeOverview: string
): Chapter7Result["narrative"] {
  // 도입부
  let intro = "이제 대운수(大運數)에 대해 살펴보겠습니다. 대운은 10년마다 바뀌는 큰 운의 흐름으로, 인생의 대략적인 방향과 기복을 알려주는 중요한 지표입니다.\n\n";
  intro += "사주팔자가 타고난 그릇이라면, 대운은 그 그릇에 무엇이 담기느냐를 보여줍니다. 같은 사주를 가진 사람이라도 대운의 흐름에 따라 인생의 궤적이 달라질 수 있습니다.";

  // 본론: 현재 대운 분석
  const cd = currentDaeun.detail;
  const elementKr = getElementKrFromEn(cd.element);
  const elementHanja = getElementHanja(elementKr);

  let mainAnalysis = "【현재 대운 분석】\n\n";
  mainAnalysis += `현재 ${cd.startAge}세부터 ${cd.endAge}세까지 '${cd.ganZhi.fullKr}(${cd.ganZhi.fullHanja})' 대운이 운행 중입니다. `;
  mainAnalysis += `이 대운은 ${elementKr}(${elementHanja})의 기운이 주가 되는 시기입니다.\n\n`;

  mainAnalysis += `${cd.overallFortune}\n\n`;

  mainAnalysis += `현재 이 대운이 ${currentDaeun.progress}% 정도 진행되었으며, 앞으로 ${currentDaeun.remainingYears}년이 남아 있습니다.\n\n`;

  // 용신과의 관계에 따른 상세 해석
  if (cd.relationToYongsin === "길운") {
    mainAnalysis += "이 대운은 용신(用神)을 돕는 '길운(吉運)'입니다. 전반적으로 하는 일이 순조롭고, 노력에 대한 결실을 얻기 좋은 시기입니다. ";
    mainAnalysis += "적극적으로 기회를 잡고, 새로운 도전을 두려워하지 마세요.\n\n";
  } else if (cd.relationToYongsin === "흉운") {
    mainAnalysis += "이 대운은 기신(忌神)이 작용하는 시기로, 주의가 필요합니다. 무리한 확장보다는 안정을 추구하고, ";
    mainAnalysis += "건강 관리와 인간관계에 신경을 쓰는 것이 좋습니다. 어려움이 있더라도 이 시기를 잘 버티면 다음 기회가 옵니다.\n\n";
  } else {
    mainAnalysis += "이 대운은 평탄한 시기입니다. 급격한 변화보다는 꾸준히 기반을 다지면서 실력을 쌓는 것이 좋습니다. ";
    mainAnalysis += "현재의 안정을 유지하면서 다음 기회를 준비하세요.\n\n";
  }

  // 분야별 운세
  mainAnalysis += "【현재 대운의 분야별 운세】\n\n";
  mainAnalysis += `• 직업/사업: ${cd.careerFortune}\n\n`;
  mainAnalysis += `• 재물/금전: ${cd.wealthFortune}\n\n`;
  mainAnalysis += `• 건강: ${cd.healthFortune}\n\n`;
  mainAnalysis += `• 인간관계: ${cd.relationshipFortune}\n\n`;

  // 상세 분석
  const details: string[] = [];

  // 전체 대운 흐름
  let flowDetail = "【평생 대운의 흐름】\n\n";
  flowDetail += "귀하의 평생 대운 흐름을 간략히 살펴보겠습니다.\n\n";

  for (const daeun of allDaeuns) {
    const daeunElementKr = getElementKrFromEn(daeun.element);
    const relation = daeun.relationToYongsin === "길운" ? "○" :
                     daeun.relationToYongsin === "흉운" ? "△" : "□";
    flowDetail += `• ${daeun.startAge}-${daeun.endAge}세: ${daeun.ganZhi.fullKr}(${daeunElementKr}) [${relation}]\n`;
  }
  flowDetail += "\n○: 길운(용신 운) / □: 평운 / △: 주의가 필요한 시기\n\n";
  flowDetail += lifetimeOverview;
  details.push(flowDetail);

  // 용신 대운 분석
  let yongsinDetail = "【용신 대운과 기신 대운】\n\n";

  if (yongsinDaeuns.goodPeriods.length > 0) {
    yongsinDetail += "• 용신 대운(좋은 시기)\n";
    for (const period of yongsinDaeuns.goodPeriods) {
      yongsinDetail += `  - ${period.age}: ${period.reason}\n`;
    }
    yongsinDetail += "\n이 시기에는 적극적으로 도전하고 기회를 잡는 것이 좋다.\n\n";
  }

  if (yongsinDaeuns.challengingPeriods.length > 0) {
    yongsinDetail += "• 주의가 필요한 대운\n";
    for (const period of yongsinDaeuns.challengingPeriods) {
      yongsinDetail += `  - ${period.age}: ${period.reason}\n`;
    }
    yongsinDetail += "\n이 시기에는 무리하지 말고 안정을 추구하는 것이 좋다.\n\n";
  }
  details.push(yongsinDetail);

  // 교운기 분석
  let transitionDetail = "【교운기(交運期) 분석】\n\n";
  transitionDetail += `다음 대운으로 바뀌는 시기는 ${transitionPeriod.nextDaeunStart}세입니다. `;
  transitionDetail += `${transitionPeriod.transitionAnalysis}\n\n`;
  transitionDetail += "교운기는 대운이 바뀌는 시점으로, 인생의 전환점이 될 수 있습니다. ";
  transitionDetail += "이 시기에는 큰 변화가 생기거나, 새로운 기회와 도전이 찾아올 수 있습니다.\n\n";
  transitionDetail += `${transitionPeriod.preparationAdvice}`;
  details.push(transitionDetail);

  // 조언
  let advice = "【대운을 활용하는 방법】\n\n";
  advice += "대운의 길흉은 절대적인 것이 아닙니다. 길운이라고 해서 가만히 있으면 저절로 좋은 일이 생기는 것도 아니고, ";
  advice += "흉운이라고 해서 반드시 나쁜 일만 생기는 것도 아닙니다.\n\n";

  advice += "중요한 것은 각 대운의 성격을 이해하고, 그에 맞게 전략적으로 대처하는 것입니다.\n\n";

  advice += "• 길운 시기: 적극적으로 도전하고, 기회를 잡으세요. 새로운 시작에 좋은 시기입니다.\n";
  advice += "• 흉운 시기: 무리하지 말고, 안정을 유지하세요. 실력을 쌓고 다음을 준비하는 시기입니다.\n";
  advice += "• 평운 시기: 꾸준히 노력하면서 기반을 다지세요.\n\n";

  advice += `현재 ${cd.ganZhi.fullKr} 대운에서는 ${cd.advice}`;

  // 마무리
  const closing = "이상으로 대운수 분석을 마치겠습니다. 대운은 10년이라는 긴 주기로 운행되므로, 단기적인 변화에 일희일비하기보다는 큰 그림을 보면서 인생을 계획하기 바랍니다. 좋은 대운이 오면 적극적으로 활용하고, 어려운 대운이 오면 인내하면서 내실을 다지면 반드시 다시 좋은 시기가 옵니다.";

  return {
    intro,
    mainAnalysis,
    details,
    advice,
    closing,
  };
}

/**
 * 영문 오행을 한글로 변환
 */
function getElementKrFromEn(element: FiveElement): FiveElementKey {
  const map: Record<FiveElement, FiveElementKey> = {
    wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
  };
  return map[element];
}

/**
 * 제7장 전체 분석 실행
 */
export function analyzeChapter7(
  sajuResult: SajuApiResult,
  gender: Gender,
  birthYear: number,
  birthMonth: number,
  currentAge: number,
  sinGangSinYak: "신강" | "신약" | "중화" = "중화"
): Chapter7Result {
  const { yearPillar, monthPillar, dayPillar } = sajuResult;
  const ilganElement = CHEONGAN_OHENG[dayPillar.cheongan];
  const yearStemYinyang = CHEONGAN_YINYANG[yearPillar.cheongan];

  const monthGanZhi = `${monthPillar.cheongan}${monthPillar.jiji}`;

  // 대운 시작 나이 계산
  const daeunStartAge = calculateDaeunStartAge(birthYear, birthMonth, gender, yearStemYinyang);

  // 순행/역행 결정
  const isYangNam = gender === "male" && yearStemYinyang === "양";
  const isUmYeo = gender === "female" && yearStemYinyang === "음";
  const isForward = isYangNam || isUmYeo;

  // 모든 대운 생성 (0~100세)
  const allDaeuns: MajorFortuneDetailedAnalysis[] = [];
  let currentDaeunDetail: MajorFortuneDetailedAnalysis | null = null;

  for (let i = 0; i <= 10; i++) {
    const startAge = daeunStartAge + i * 10;
    const endAge = startAge + 10;

    const ganZhi = getNextDaeunGanZhi(monthGanZhi, i + 1, isForward);
    const daeun = analyzeSingleDaeun(
      ganZhi, startAge, endAge, currentAge, ilganElement, sinGangSinYak
    );

    allDaeuns.push(daeun);

    if (daeun.isCurrentDaeun) {
      currentDaeunDetail = daeun;
    }
  }

  // 현재 대운이 없으면 첫 번째 대운 사용
  if (!currentDaeunDetail) {
    currentDaeunDetail = allDaeuns[0];
  }

  // 현재 대운 진행률 계산
  const progress = currentDaeunDetail
    ? Math.round(((currentAge - currentDaeunDetail.startAge) / 10) * 100)
    : 0;

  // 교운기 분석
  const currentIndex = allDaeuns.findIndex(d => d.isCurrentDaeun);
  const nextDaeun = allDaeuns[currentIndex + 1];

  // 다음 대운 오행 한글
  const getElementKr = (element: FiveElement): FiveElementKey => {
    const map: Record<FiveElement, FiveElementKey> = {
      wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
    };
    return map[element];
  };

  const transitionPeriod = {
    nextDaeunStart: nextDaeun ? nextDaeun.startAge : currentDaeunDetail!.endAge,
    transitionAnalysis: nextDaeun
      ? `다음 대운 ${nextDaeun.ganZhi.fullKr}(${getElementKr(nextDaeun.element)})로 전환됩니다. 교운기에는 변화가 시작되므로 준비가 필요합니다.`
      : "마지막 대운입니다.",
    preparationAdvice: nextDaeun
      ? `${getElementKr(nextDaeun.element)} 기운에 맞는 준비를 하세요. ${DAEUN_FORTUNE_BY_ELEMENT[getElementKr(nextDaeun.element)].career}`
      : "현재 대운의 기운을 잘 마무리하세요.",
  };

  // 용신 대운 분류
  const goodPeriods = allDaeuns
    .filter(d => d.relationToYongsin === "길운")
    .map(d => ({ age: `${d.startAge}-${d.endAge}세`, reason: `${d.ganZhi.fullKr} 대운이 용신을 돕습니다.` }));

  const challengingPeriods = allDaeuns
    .filter(d => d.relationToYongsin === "흉운")
    .map(d => ({ age: `${d.startAge}-${d.endAge}세`, reason: `${d.ganZhi.fullKr} 대운이 기신으로 작용합니다.` }));

  // 평생 개요
  const goodCount = goodPeriods.length;
  const badCount = challengingPeriods.length;
  let lifetimeOverview = "";

  if (goodCount > badCount + 2) {
    lifetimeOverview = "전체적으로 용신 대운이 많아 순탄한 인생 흐름이 예상됩니다. 좋은 시기를 잘 활용하고, 어려운 시기에는 조심하세요.";
  } else if (badCount > goodCount + 2) {
    lifetimeOverview = "도전적인 대운이 많지만, 이를 통해 내면적으로 성장하게 됩니다. 어려운 시기에는 무리하지 말고 내실을 다지세요.";
  } else {
    lifetimeOverview = "길운과 흉운이 균형을 이루어 다양한 경험을 하게 됩니다. 각 시기에 맞는 전략으로 대처하세요.";
  }

  // 현재 대운 객체 생성
  const currentDaeunObj = {
    detail: currentDaeunDetail!,
    remainingYears: currentDaeunDetail!.endAge - currentAge,
    progress,
  };

  const yongsinDaeuns = {
    goodPeriods,
    challengingPeriods,
  };

  // 서술형 Narrative 생성
  const narrative = generateDaeunNarrative(
    allDaeuns,
    currentDaeunObj,
    transitionPeriod,
    yongsinDaeuns,
    lifetimeOverview
  );

  return {
    allDaeuns,
    currentDaeun: currentDaeunObj,
    transitionPeriod,
    yongsinDaeuns,
    lifetimeOverview,
    narrative,
  };
}

export default analyzeChapter7;
