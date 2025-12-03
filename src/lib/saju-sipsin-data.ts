/**
 * 십신(十神) 상세 해석 데이터
 * 일간을 기준으로 다른 천간/지지와의 관계를 나타내는 10가지 신
 */

// 십신 카테고리
export type SipsinCategory = "비겁" | "식상" | "재성" | "관성" | "인성";

// 십신 상세 정보
export interface SipsinInfo {
  name: string;
  hanja: string;
  category: SipsinCategory;
  yinyang: "양" | "음";
  keyword: string;
  emoji: string;
  meaning: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  inCareer: string;
  inRelationship: string;
  inWealth: string;
  inHealth: string;
  advice: string;
  // 기둥별 의미
  inYear: string;   // 년주에 있을 때
  inMonth: string;  // 월주에 있을 때
  inDay: string;    // 일주(일지)에 있을 때
  inHour: string;   // 시주에 있을 때
}

// 십신 상세 해석 데이터
export const SIPSIN_DETAIL: Record<string, SipsinInfo> = {
  비견: {
    name: "비견",
    hanja: "比肩",
    category: "비겁",
    yinyang: "양",
    keyword: "자존심, 경쟁심, 독립심",
    emoji: "🤝",
    meaning: "나와 같은 오행, 같은 음양의 기운으로 '어깨를 나란히 한다'는 뜻입니다. 형제자매, 동료, 경쟁자를 의미합니다.",
    personality: "자존심이 강하고 독립적이며 자기 주장이 뚜렷합니다. 남에게 지기 싫어하고 스스로 해결하려는 성향이 강합니다.",
    strengths: ["독립심", "자신감", "추진력", "리더십", "결단력"],
    weaknesses: ["고집", "융통성 부족", "타협 어려움", "독단적"],
    inCareer: "독립적인 사업, 프리랜서, 전문직이 잘 맞습니다. 조직 내에서는 리더 역할을 맡거나 독자적인 영역을 확보해야 합니다.",
    inRelationship: "평등한 관계를 원하며, 지배받는 것을 싫어합니다. 서로 존중하는 동반자 관계가 이상적입니다.",
    inWealth: "남과 나누기보다 홀로 버는 것을 선호합니다. 동업보다 단독 사업이 유리할 수 있습니다.",
    inHealth: "과로나 스트레스로 인한 근육통, 두통에 주의하세요.",
    advice: "때로는 협력하고 양보하는 것이 더 큰 성공을 가져옵니다. 경쟁심을 건강하게 승화시키세요.",
    inYear: "어린 시절 형제자매와의 경쟁이 있거나, 가족 중 경쟁 관계가 있을 수 있습니다. 독립심이 일찍 형성됩니다.",
    inMonth: "청년기에 동료나 친구와 경쟁하며 성장합니다. 또래 집단에서 리더 역할을 하거나 독자적인 위치를 원합니다.",
    inDay: "배우자와 대등한 관계를 원합니다. 가정 내에서도 독립적인 영역이 필요합니다.",
    inHour: "말년에 독립적인 삶을 추구합니다. 자녀와도 서로 독립적인 관계를 유지합니다.",
  },

  겁재: {
    name: "겁재",
    hanja: "劫財",
    category: "비겁",
    yinyang: "음",
    keyword: "승부욕, 도전정신, 재물경쟁",
    emoji: "⚔️",
    meaning: "나와 같은 오행이지만 음양이 다른 기운으로 '재물을 빼앗는다'는 뜻입니다. 강한 경쟁심과 승부욕을 나타냅니다.",
    personality: "승부욕이 강하고 도전적입니다. 목표를 위해 과감하게 행동하며, 때로는 무리해서라도 목적을 이루려 합니다.",
    strengths: ["도전정신", "승부근성", "적극성", "순발력", "배포"],
    weaknesses: ["무리함", "충동적", "재물 손실 가능", "도박성"],
    inCareer: "경쟁이 치열한 분야에서 빛을 발합니다. 영업, 스포츠, 투자 등 승부가 있는 일에 적합합니다.",
    inRelationship: "열정적이지만 때로는 상대를 지배하려 합니다. 갈등이 생기면 물러서지 않습니다.",
    inWealth: "큰돈을 벌 수도, 잃을 수도 있습니다. 투기적인 재테크보다 안정적인 수입원을 유지하세요.",
    inHealth: "무리한 활동으로 인한 부상, 사고에 주의하세요.",
    advice: "무리한 승부는 피하고, 계산된 도전을 하세요. 재물 관리에 신중해야 합니다.",
    inYear: "어린 시절 형제와 재물이나 관심을 두고 경쟁했을 수 있습니다.",
    inMonth: "청년기에 친구나 동료와의 경쟁에서 이기려고 무리할 수 있습니다.",
    inDay: "배우자와 재물 문제로 갈등이 생길 수 있습니다. 경제권 분리가 도움이 됩니다.",
    inHour: "말년에 자녀와 재물 문제가 생길 수 있습니다. 미리 재산 계획을 세우세요.",
  },

  식신: {
    name: "식신",
    hanja: "食神",
    category: "식상",
    yinyang: "양",
    keyword: "먹는복, 표현력, 여유",
    emoji: "🍽️",
    meaning: "내가 생(生)하는 오행 중 같은 음양의 기운입니다. '먹을 복'을 의미하며 의식주가 풍족함을 나타냅니다.",
    personality: "여유롭고 낙천적이며 먹는 것을 즐깁니다. 표현력이 좋고 예술적 감각이 있으며, 타인을 즐겁게 해주는 재능이 있습니다.",
    strengths: ["낙천성", "표현력", "요리 재능", "예술성", "친화력"],
    weaknesses: ["게으름", "안일함", "과식", "결단력 부족"],
    inCareer: "요식업, 예술, 엔터테인먼트, 교육 등 창의력과 표현력이 필요한 분야에서 두각을 나타냅니다.",
    inRelationship: "편안하고 따뜻한 분위기를 만들어 관계가 원만합니다. 가정적인 면이 강합니다.",
    inWealth: "먹고살 걱정은 없지만, 큰 부를 추구하기보다 여유로운 삶을 선호합니다.",
    inHealth: "과식이나 비만에 주의하세요. 소화기 건강을 챙기세요.",
    advice: "게으름에 빠지지 말고 목표를 향해 꾸준히 노력하세요. 재능을 살려 표현하는 일을 하면 좋습니다.",
    inYear: "유복한 가정에서 자랐거나, 어린 시절 먹는 것에 부족함이 없었습니다.",
    inMonth: "청년기에 재능을 발휘하고 표현할 기회가 많습니다.",
    inDay: "배우자가 요리를 잘하거나 가정이 화목합니다. 부부간 정이 깊습니다.",
    inHour: "말년에 자녀 덕을 보거나, 편안한 노후를 보냅니다.",
  },

  상관: {
    name: "상관",
    hanja: "傷官",
    category: "식상",
    yinyang: "음",
    keyword: "창의력, 반항심, 언변",
    emoji: "🎭",
    meaning: "내가 생(生)하는 오행 중 다른 음양의 기운입니다. '관(官)을 상하게 한다'는 뜻으로 기존 질서에 도전하는 기운입니다.",
    personality: "창의적이고 독창적이며 틀에 박힌 것을 싫어합니다. 말재주가 뛰어나고 비판 정신이 강합니다.",
    strengths: ["창의력", "언변", "예술성", "분석력", "독창성"],
    weaknesses: ["반항심", "비판적", "권위에 도전", "인간관계 갈등"],
    inCareer: "예술, 방송, 작가, 변호사, 컨설턴트 등 창의력과 언변이 필요한 분야에 적합합니다.",
    inRelationship: "상대의 단점을 지적하는 경향이 있어 갈등이 생길 수 있습니다. 비판보다 칭찬을 연습하세요.",
    inWealth: "창의적인 아이디어로 돈을 벌 수 있지만, 권위자와 충돌하면 손해를 볼 수 있습니다.",
    inHealth: "신경성 질환, 호흡기에 주의하세요.",
    advice: "비판 에너지를 창작으로 승화시키세요. 권위에 대한 반항심을 조절하면 성공할 수 있습니다.",
    inYear: "어린 시절 권위적인 환경에 반발했거나, 독특한 개성을 보였습니다.",
    inMonth: "청년기에 기존 체제에 도전하거나 창의적인 분야에서 두각을 나타냅니다.",
    inDay: "배우자와 의견 충돌이 잦을 수 있습니다. 서로의 개성을 존중하세요.",
    inHour: "말년에 자녀와 의견 차이가 있을 수 있습니다. 세대 차이를 인정하세요.",
  },

  편재: {
    name: "편재",
    hanja: "偏財",
    category: "재성",
    yinyang: "양",
    keyword: "투자, 사업, 아버지",
    emoji: "💰",
    meaning: "내가 극(克)하는 오행 중 다른 음양의 기운입니다. 예상치 못한 재물, 사업, 투자를 의미합니다.",
    personality: "통이 크고 사교적이며 사람을 잘 다룹니다. 돈에 대한 욕심이 있지만 쓸 때는 화끈하게 씁니다.",
    strengths: ["사교성", "추진력", "사업 수완", "대범함", "융통성"],
    weaknesses: ["낭비", "투기", "바람기 가능", "변덕"],
    inCareer: "사업, 무역, 금융, 영업 등 재물을 다루고 사람을 만나는 일에 적합합니다.",
    inRelationship: "매력적이고 인기가 많지만, 한 사람에게 집중하기 어려울 수 있습니다.",
    inWealth: "돈을 잘 벌지만 잘 쓰기도 합니다. 한탕주의보다 꾸준한 재테크가 필요합니다.",
    inHealth: "과음, 과식에 주의하세요. 간 건강을 챙기세요.",
    advice: "사업 확장 시 무리하지 마세요. 안정적인 수입원을 유지하면서 투자하세요.",
    inYear: "가업이 있거나 어린 시절 아버지의 영향이 큽니다.",
    inMonth: "청년기에 사업이나 투자로 돈을 벌 기회가 있습니다.",
    inDay: "배우자가 경제 활동을 하거나, 재물 복이 있습니다.",
    inHour: "말년에 사업이나 투자로 재물을 모을 수 있습니다.",
  },

  정재: {
    name: "정재",
    hanja: "正財",
    category: "재성",
    yinyang: "음",
    keyword: "안정적 수입, 월급, 아내",
    emoji: "🏦",
    meaning: "내가 극(克)하는 오행 중 같은 음양의 기운입니다. 안정적인 재물, 월급, 저축을 의미합니다.",
    personality: "성실하고 검소하며 계획적입니다. 안정을 추구하고 낭비를 싫어합니다.",
    strengths: ["성실함", "계획성", "절약", "책임감", "신뢰성"],
    weaknesses: ["융통성 부족", "인색함", "소심함", "모험 기피"],
    inCareer: "안정적인 직장, 공무원, 금융, 회계 등 꾸준한 수입이 보장되는 일에 적합합니다.",
    inRelationship: "가정적이고 책임감 있는 파트너입니다. 헌신적이지만 표현이 서툴 수 있습니다.",
    inWealth: "큰 부보다는 안정적인 재산을 꾸준히 쌓아갑니다. 투기보다 저축과 안전한 투자를 선호합니다.",
    inHealth: "소화기, 비장에 주의하세요.",
    advice: "때로는 적절한 투자와 소비도 필요합니다. 너무 움켜쥐지 마세요.",
    inYear: "부모님이 안정적인 직업을 가졌거나, 가정 형편이 안정적이었습니다.",
    inMonth: "청년기에 안정적인 직장을 얻거나 꾸준히 자산을 형성합니다.",
    inDay: "배우자가 알뜰하거나, 가정 경제가 안정적입니다.",
    inHour: "말년에 안정적인 재산을 가지고 편안하게 지냅니다.",
  },

  편관: {
    name: "편관",
    hanja: "偏官",
    category: "관성",
    yinyang: "양",
    keyword: "권력, 통제, 스트레스",
    emoji: "⚖️",
    meaning: "나를 극(克)하는 오행 중 다른 음양의 기운입니다. '칠살(七殺)'이라고도 하며 강한 압박과 도전을 의미합니다.",
    personality: "카리스마가 있고 결단력이 강합니다. 통제하려는 성향이 있으며 권력을 추구합니다.",
    strengths: ["결단력", "카리스마", "추진력", "위기대처", "용맹"],
    weaknesses: ["독선", "공격성", "스트레스", "인내 부족"],
    inCareer: "군인, 경찰, 경쟁이 치열한 업계, 권력 기관 등에서 능력을 발휘합니다.",
    inRelationship: "주도권을 쥐려고 하며, 상대를 통제하려는 경향이 있습니다.",
    inWealth: "권력이나 지위를 통해 재물을 얻습니다. 정치, 권력 관련 분야에서 성공할 수 있습니다.",
    inHealth: "스트레스성 질환, 혈압에 주의하세요.",
    advice: "공격성을 조절하고 타인을 존중하세요. 권력을 긍정적으로 사용하세요.",
    inYear: "어린 시절 엄격한 환경에서 자랐거나, 권위적인 아버지의 영향을 받았습니다.",
    inMonth: "청년기에 경쟁이 치열한 환경에서 성장합니다.",
    inDay: "배우자가 강한 성격이거나, 가정 내 갈등이 있을 수 있습니다.",
    inHour: "말년에 권력이나 지위를 얻거나, 자녀가 강한 성격을 가집니다.",
  },

  정관: {
    name: "정관",
    hanja: "正官",
    category: "관성",
    yinyang: "음",
    keyword: "명예, 직장, 남편",
    emoji: "🏛️",
    meaning: "나를 극(克)하는 오행 중 같은 음양의 기운입니다. 올바른 규율, 명예, 직업적 성취를 의미합니다.",
    personality: "책임감 있고 규율을 중시합니다. 사회적 체면과 명예를 중요하게 생각합니다.",
    strengths: ["책임감", "신뢰", "명예", "도덕성", "안정성"],
    weaknesses: ["형식주의", "경직됨", "융통성 부족", "권위주의"],
    inCareer: "공무원, 대기업, 전문직 등 사회적으로 인정받는 안정적인 직업에 적합합니다.",
    inRelationship: "책임감 있는 파트너이지만, 형식과 체면을 중시해 융통성이 부족할 수 있습니다.",
    inWealth: "직장 생활을 통해 안정적인 수입을 얻습니다. 명예와 함께 재물도 따라옵니다.",
    inHealth: "과로에 주의하세요. 정신적 스트레스를 관리하세요.",
    advice: "형식에 너무 얽매이지 말고, 때로는 유연하게 대처하세요.",
    inYear: "가문의 명예가 있거나, 부모님이 사회적으로 존경받는 분이셨습니다.",
    inMonth: "청년기에 좋은 직장을 얻거나 사회적 지위가 상승합니다.",
    inDay: "여성에게는 좋은 남편을 만날 수 있음을 의미합니다. 가정이 안정적입니다.",
    inHour: "말년에 명예와 존경을 받습니다. 자녀도 사회적으로 성공합니다.",
  },

  편인: {
    name: "편인",
    hanja: "偏印",
    category: "인성",
    yinyang: "양",
    keyword: "학문, 예술, 계모",
    emoji: "🎓",
    meaning: "나를 생(生)해주는 오행 중 다른 음양의 기운입니다. '도식(倒食)'이라고도 하며 독특한 학문이나 기술을 의미합니다.",
    personality: "독창적이고 직관력이 뛰어납니다. 비주류 학문이나 신비로운 것에 관심이 많습니다.",
    strengths: ["직관력", "창의력", "특수 재능", "영성", "집중력"],
    weaknesses: ["비현실적", "고독", "불안정", "식복 약함"],
    inCareer: "철학, 종교, 예술, 대체의학, IT 등 특수한 분야에서 재능을 발휘합니다.",
    inRelationship: "독특한 매력이 있지만, 혼자만의 시간이 필요합니다.",
    inWealth: "특수한 재능이나 기술로 돈을 법니다. 일반적인 방법보다 독특한 방식으로 성공합니다.",
    inHealth: "불규칙한 식사, 소화 장애에 주의하세요.",
    advice: "현실 감각을 키우고, 규칙적인 생활 습관을 가지세요.",
    inYear: "어머니와의 관계가 복잡하거나, 특이한 가정환경에서 자랐을 수 있습니다.",
    inMonth: "청년기에 독특한 분야에서 공부하거나 기술을 익힙니다.",
    inDay: "배우자가 독특한 직업을 가지거나, 가정생활이 일반적이지 않을 수 있습니다.",
    inHour: "말년에 종교나 철학에 심취하거나, 은둔적인 삶을 살 수 있습니다.",
  },

  정인: {
    name: "정인",
    hanja: "正印",
    category: "인성",
    yinyang: "음",
    keyword: "어머니, 학업, 자격증",
    emoji: "📚",
    meaning: "나를 생(生)해주는 오행 중 같은 음양의 기운입니다. 올바른 학문, 자격, 인장(도장)을 의미합니다.",
    personality: "학구적이고 인자하며 보호적입니다. 배움을 좋아하고 가르치는 것에도 재능이 있습니다.",
    strengths: ["학구열", "인자함", "보호본능", "지혜", "교육 재능"],
    weaknesses: ["의존성", "게으름", "우유부단", "과보호"],
    inCareer: "교육, 연구, 의료, 복지 등 배우고 가르치는 분야에 적합합니다.",
    inRelationship: "헌신적이고 보호적인 파트너입니다. 상대를 돌보는 것을 좋아합니다.",
    inWealth: "학문이나 자격증을 통해 안정적인 수입을 얻습니다.",
    inHealth: "과도한 사고로 인한 두통, 피로에 주의하세요.",
    advice: "실천력을 키우세요. 배운 것을 행동으로 옮기는 것이 중요합니다.",
    inYear: "어머니의 사랑을 많이 받았거나, 교육 환경이 좋았습니다.",
    inMonth: "청년기에 학업 성취가 좋거나, 자격증을 취득합니다.",
    inDay: "배우자가 교육적이거나, 가정 내 배움의 분위기가 있습니다.",
    inHour: "말년에 후학을 양성하거나, 자녀의 학업이 뛰어납니다.",
  },
};

// 십신 카테고리별 정보
export const SIPSIN_CATEGORY_INFO: Record<SipsinCategory, {
  name: string;
  friendlyName: string;
  hanja: string;
  description: string;
  friendlyDescription: string;
  members: string[];
  element: string;
  color: string;
}> = {
  비겁: {
    name: "비겁",
    friendlyName: "자기 주도력",
    hanja: "比劫",
    description: "나와 같은 오행으로, 형제자매, 동료, 경쟁자를 의미합니다.",
    friendlyDescription: "자신만의 길을 가려는 독립심이 강합니다. 주체적이고 당당하며, 경쟁에서 지지 않으려는 성향이 있습니다.",
    members: ["비견", "겁재"],
    element: "같은 오행",
    color: "#6B7280",  // gray
  },
  식상: {
    name: "식상",
    friendlyName: "표현력·창의력",
    hanja: "食傷",
    description: "내가 생(生)해주는 오행으로, 표현력, 창의력, 자녀를 의미합니다.",
    friendlyDescription: "아이디어가 풍부하고 자기표현을 잘합니다. 예술적 감각과 말재주가 뛰어나며, 새로운 것을 만들어내는 능력이 있습니다.",
    members: ["식신", "상관"],
    element: "내가 생",
    color: "#10B981",  // green
  },
  재성: {
    name: "재성",
    friendlyName: "현실 감각",
    hanja: "財星",
    description: "내가 극(克)하는 오행으로, 재물, 아버지, 아내(남자의 경우)를 의미합니다.",
    friendlyDescription: "돈과 물질에 대한 감각이 뛰어납니다. 실용적이고 현실적이며, 재물을 모으고 관리하는 능력이 있습니다.",
    members: ["편재", "정재"],
    element: "내가 극",
    color: "#F59E0B",  // amber
  },
  관성: {
    name: "관성",
    friendlyName: "책임감·리더십",
    hanja: "官星",
    description: "나를 극(克)하는 오행으로, 직업, 명예, 남편(여자의 경우)을 의미합니다.",
    friendlyDescription: "사회적 책임감과 명예를 중시합니다. 규율을 잘 지키고, 조직에서 인정받으려는 성향이 강합니다.",
    members: ["편관", "정관"],
    element: "나를 극",
    color: "#EF4444",  // red
  },
  인성: {
    name: "인성",
    friendlyName: "학습·안정 추구",
    hanja: "印星",
    description: "나를 생(生)해주는 오행으로, 학문, 어머니, 보호를 의미합니다.",
    friendlyDescription: "배우고 익히는 것을 좋아합니다. 안정을 추구하고, 지식과 지혜를 쌓아가는 성향이 있습니다.",
    members: ["편인", "정인"],
    element: "나를 생",
    color: "#3B82F6",  // blue
  },
};

// 십신 분포 분석 함수
export function analyzeSipsinDistribution(
  pillars: { cheonganSipsin?: string; jijiSipsin?: string }[]
): {
  distribution: Record<SipsinCategory, number>;
  dominant: SipsinCategory | null;
  weak: SipsinCategory | null;
  analysis: string;
} {
  const distribution: Record<SipsinCategory, number> = {
    비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0
  };

  // 십신 개수 세기
  for (const pillar of pillars) {
    if (pillar.cheonganSipsin) {
      const info = SIPSIN_DETAIL[pillar.cheonganSipsin];
      if (info) distribution[info.category]++;
    }
    if (pillar.jijiSipsin) {
      const info = SIPSIN_DETAIL[pillar.jijiSipsin];
      if (info) distribution[info.category]++;
    }
  }

  // 가장 많은/적은 카테고리 찾기
  const entries = Object.entries(distribution) as [SipsinCategory, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);

  const dominant = sorted[0][1] > 0 ? sorted[0][0] : null;
  const weak = sorted[sorted.length - 1][1] === 0 ? sorted[sorted.length - 1][0] : null;

  // 분석 문구 생성
  let analysis = "";
  if (dominant) {
    const dominantInfo = SIPSIN_CATEGORY_INFO[dominant];
    analysis = `${dominantInfo.friendlyName} 성향이 두드러집니다. ${dominantInfo.friendlyDescription}`;
  }
  if (weak) {
    const weakInfo = SIPSIN_CATEGORY_INFO[weak];
    analysis += ` 다만, ${weakInfo.friendlyName} 영역에서 보완이 필요합니다.`;
  }

  return { distribution, dominant, weak, analysis };
}

// 기둥별 십신 해석 가져오기
export function getSipsinPillarMeaning(
  sipsin: string,
  pillarPosition: "year" | "month" | "day" | "hour"
): string {
  const info = SIPSIN_DETAIL[sipsin];
  if (!info) return "";

  switch (pillarPosition) {
    case "year": return info.inYear;
    case "month": return info.inMonth;
    case "day": return info.inDay;
    case "hour": return info.inHour;
    default: return "";
  }
}

// 재물운 분석 (재성 기반)
export function analyzeWealthFromSipsin(
  pillars: { cheonganSipsin?: string; jijiSipsin?: string; ganji: string }[]
): {
  hasJaesung: boolean;
  jaesungPositions: string[];
  wealthType: "편재형" | "정재형" | "혼합형" | "없음";
  analysis: string;
  advice: string;
} {
  const jaesungPositions: string[] = [];
  let pyeonjaeCnt = 0;
  let jungjaeCnt = 0;
  const pillarNames = ["년주", "월주", "일주", "시주"];

  pillars.forEach((pillar, idx) => {
    if (pillar.cheonganSipsin === "편재" || pillar.jijiSipsin === "편재") {
      pyeonjaeCnt++;
      jaesungPositions.push(`${pillarNames[idx]}에 편재`);
    }
    if (pillar.cheonganSipsin === "정재" || pillar.jijiSipsin === "정재") {
      jungjaeCnt++;
      jaesungPositions.push(`${pillarNames[idx]}에 정재`);
    }
  });

  const hasJaesung = pyeonjaeCnt > 0 || jungjaeCnt > 0;
  let wealthType: "편재형" | "정재형" | "혼합형" | "없음";
  let analysis = "";
  let advice = "";

  if (pyeonjaeCnt > 0 && jungjaeCnt > 0) {
    wealthType = "혼합형";
    analysis = "편재와 정재가 함께 있어 사업과 안정적인 수입을 모두 추구할 수 있습니다. 투자와 저축의 균형을 잘 맞추면 재물운이 좋습니다.";
    advice = "기본적인 안정 수입을 확보한 상태에서 추가적인 투자를 하세요.";
  } else if (pyeonjaeCnt > 0) {
    wealthType = "편재형";
    analysis = "편재가 있어 사업, 투자, 외부 활동으로 돈을 버는 성향이 있습니다. 한 번에 큰돈을 벌 수 있지만 관리가 필요합니다.";
    advice = "수입이 불규칙할 수 있으니 저축 습관을 들이세요. 과도한 투기는 피하세요.";
  } else if (jungjaeCnt > 0) {
    wealthType = "정재형";
    analysis = "정재가 있어 직장이나 안정적인 수입원을 통해 꾸준히 재산을 모으는 성향입니다. 급격한 부보다 점진적인 축적에 유리합니다.";
    advice = "꾸준히 저축하고 장기 투자를 하세요. 급한 투자 권유는 거절하세요.";
  } else {
    wealthType = "없음";
    analysis = "재성이 사주에 없어 돈에 대한 집착이 적거나, 다른 방식으로 재물을 얻습니다. 식상생재(창의력으로 돈 벌기)나 관인상생(직위로 돈 벌기)의 방식이 유리합니다.";
    advice = "재능이나 전문성을 키워 간접적으로 재물을 얻는 방향으로 노력하세요.";
  }

  return { hasJaesung, jaesungPositions, wealthType, analysis, advice };
}
