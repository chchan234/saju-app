/**
 * 제2장: 음양오행(陰陽五行) 분석
 * - 음양 균형 분석
 * - 오행 분포 점수화
 * - 성격 및 심리 패턴 분석
 * - 체질 분석
 * - 신강/신약 판정
 */

import type { SajuApiResult, OhengCount, Pillar } from "@/types/saju";
import type { Chapter2Result, ElementDetailedAnalysis } from "@/types/expert";

// ============================================
// 상수 및 데이터
// ============================================

type FiveElementKey = "목" | "화" | "토" | "금" | "수";
type FiveElementEng = "wood" | "fire" | "earth" | "metal" | "water";

// 오행 한글 → 영문 매핑
const ELEMENT_TO_ENG: Record<FiveElementKey, FiveElementEng> = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water",
};

// 오행 한자
const ELEMENT_HANJA: Record<FiveElementKey, string> = {
  목: "木",
  화: "火",
  토: "土",
  금: "金",
  수: "水",
};

// 천간 음양
const CHEONGAN_YINYANG: Record<string, "양" | "음"> = {
  갑: "양", 을: "음",
  병: "양", 정: "음",
  무: "양", 기: "음",
  경: "양", 신: "음",
  임: "양", 계: "음",
};

// 지지 음양
const JIJI_YINYANG: Record<string, "양" | "음"> = {
  자: "양", 축: "음",
  인: "양", 묘: "음",
  진: "양", 사: "음",
  오: "양", 미: "음",
  신: "양", 유: "음",
  술: "양", 해: "음",
};

// 천간 오행
const CHEONGAN_OHENG: Record<string, FiveElementKey> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

// 지지 오행
const JIJI_OHENG: Record<string, FiveElementKey> = {
  자: "수", 축: "토",
  인: "목", 묘: "목",
  진: "토", 사: "화",
  오: "화", 미: "토",
  신: "금", 유: "금",
  술: "토", 해: "수",
};

// 오행별 성격 특성
const ELEMENT_PERSONALITY: Record<FiveElementKey, {
  excess: string[];
  balanced: string[];
  deficient: string[];
  psychology: string;
}> = {
  목: {
    excess: ["고집이 세고 융통성 부족", "화를 잘 내고 성급함", "독단적이고 타협을 모름", "경쟁심이 지나침"],
    balanced: ["진취적이고 추진력 있음", "정의감이 강하고 올곧음", "창의적이고 성장 지향적", "리더십과 결단력 보유"],
    deficient: ["자신감 부족", "우유부단함", "시작하기 어려워함", "의존적 성향"],
    psychology: "목(木)은 성장과 발전의 에너지입니다. 봄의 기운처럼 새로운 시작과 희망을 상징하며, 계획을 세우고 목표를 향해 나아가는 힘을 줍니다.",
  },
  화: {
    excess: ["충동적이고 감정 기복 심함", "과시욕이 강함", "인내심 부족", "쉽게 흥분함"],
    balanced: ["밝고 긍정적", "열정적이고 활동적", "사교적이고 표현력 좋음", "예술적 감각 우수"],
    deficient: ["무기력하고 의욕 없음", "냉담하고 무관심", "표현력 부족", "소극적 태도"],
    psychology: "화(火)는 열정과 밝음의 에너지입니다. 여름의 뜨거운 기운처럼 적극적인 표현과 활동력을 상징하며, 사람들과의 교류에서 빛을 발합니다.",
  },
  토: {
    excess: ["고정관념이 강함", "변화를 두려워함", "지나친 걱정과 근심", "융통성 없음"],
    balanced: ["신뢰감 있고 안정적", "포용력과 중재력 우수", "실용적이고 현실적", "책임감 강함"],
    deficient: ["불안정하고 초조함", "신뢰를 얻기 어려움", "중심이 없고 산만함", "집중력 부족"],
    psychology: "토(土)는 중심과 조화의 에너지입니다. 환절기처럼 다른 오행을 연결하고 조율하며, 안정과 신뢰의 기반을 형성합니다.",
  },
  금: {
    excess: ["비판적이고 까다로움", "완벽주의로 스트레스", "냉정하고 무뚝뚝함", "융통성 부족"],
    balanced: ["결단력 있고 명확함", "원칙적이고 정의로움", "분석력과 판단력 우수", "정돈되고 체계적"],
    deficient: ["우유부단함", "결단력 부족", "자기주장 약함", "쉽게 휘둘림"],
    psychology: "금(金)은 결실과 수확의 에너지입니다. 가을의 서늘함처럼 명확한 판단과 정리정돈의 힘을 주며, 가치를 가려내는 능력을 상징합니다.",
  },
  수: {
    excess: ["의심이 많고 불안함", "지나친 생각으로 행동력 저하", "비밀이 많고 폐쇄적", "두려움이 많음"],
    balanced: ["지혜롭고 통찰력 있음", "적응력과 유연성 우수", "깊은 사고력 보유", "침착하고 냉정함"],
    deficient: ["지혜 부족", "경솔함", "깊이 없는 판단", "적응력 약함"],
    psychology: "수(水)는 지혜와 유연함의 에너지입니다. 겨울의 고요함처럼 깊은 내면의 지혜와 생명의 근원적 힘을 상징합니다.",
  },
};

// 오행별 체질과 장기
const ELEMENT_BODY: Record<FiveElementKey, {
  organs: string[];
  bodyParts: string[];
  constitution: string;
}> = {
  목: {
    organs: ["간(肝)", "담(膽)"],
    bodyParts: ["눈", "근육", "손톱", "힘줄"],
    constitution: "목형 체질은 키가 크고 마른 편이며, 손발이 긴 특징이 있습니다. 성격이 급하고 화를 잘 내면 간에 무리가 갈 수 있습니다.",
  },
  화: {
    organs: ["심장(心)", "소장(小腸)"],
    bodyParts: ["혀", "혈관", "얼굴색"],
    constitution: "화형 체질은 이마가 넓고 턱이 뾰족한 역삼각형 얼굴이 많습니다. 열이 많아 얼굴이 붉어지기 쉽고, 심장과 혈압에 주의가 필요합니다.",
  },
  토: {
    organs: ["비장(脾)", "위장(胃)"],
    bodyParts: ["입술", "살", "근육"],
    constitution: "토형 체질은 체격이 넓고 살집이 있는 편입니다. 소화기관이 약해지기 쉬우므로 과식과 불규칙한 식사에 주의해야 합니다.",
  },
  금: {
    organs: ["폐(肺)", "대장(大腸)"],
    bodyParts: ["코", "피부", "털"],
    constitution: "금형 체질은 피부가 희고 깨끗하며 골격이 단단합니다. 호흡기와 피부가 약해지기 쉬우므로 건조한 환경에 주의해야 합니다.",
  },
  수: {
    organs: ["신장(腎)", "방광(膀胱)"],
    bodyParts: ["귀", "뼈", "머리카락"],
    constitution: "수형 체질은 얼굴이 둥글고 살이 찌기 쉬운 체형입니다. 신장과 방광이 약해지기 쉬우므로 차가운 음식과 과로에 주의해야 합니다.",
  },
};

// 오행별 직업 성향
const ELEMENT_CAREER: Record<FiveElementKey, string> = {
  목: "교육, 출판, 문화예술, 의류, 식물 관련, 스타트업, 기획, 연구개발",
  화: "방송, 연예, 마케팅, 홍보, 요식업, IT, 전자, 광고, 디자인",
  토: "부동산, 건설, 농업, 금융, 공무원, 중개업, 컨설팅, 인사관리",
  금: "금융, 법조, 군인/경찰, 기계, 귀금속, 철강, 회계, 품질관리",
  수: "무역, 유통, 물류, 의료, 교통, 수산업, 음료, 서비스업, 관광",
};

// ============================================
// 서술형 풀이용 상수
// ============================================

// 일간(天干)별 오행 서술형 성격 설명
const DAY_MASTER_ELEMENT_NARRATIVES: Record<FiveElementKey, {
  intro: string;
  personality: string;
  energy: string;
  advice: string;
}> = {
  목: {
    intro: "목(木)의 기운을 타고난 사람입니다. 봄의 새싹처럼 성장하고 뻗어나가려는 에너지가 기본 바탕에 깔려 있습니다.",
    personality: "목의 기운을 가진 사람들은 진취적이고 추진력이 있습니다. 마치 나무가 하늘을 향해 곧게 자라듯이, 목표를 향해 꾸준히 나아가는 성향이 있습니다. 정의감이 강하고 불의를 보면 참지 못하는 올곧은 면도 있습니다.",
    energy: "봄처럼 새로운 시작과 희망의 에너지가 넘칩니다. 계획을 세우고 실행에 옮기는 것을 좋아합니다. 다만 너무 앞만 보고 달리다 보면 주변을 돌아보지 못할 때도 있습니다.",
    advice: "가끔은 멈춰서 휴식을 취하는 것도 성장의 일부입니다. 유연하게 굽힐 줄 아는 대나무처럼, 강함과 부드러움의 조화를 찾아보세요."
  },
  화: {
    intro: "화(火)의 기운을 타고난 사람입니다. 여름 햇살처럼 밝고 따뜻한 에너지가 기본 바탕에 깔려 있습니다.",
    personality: "화의 기운을 가진 사람들은 밝고 열정적입니다. 마치 불꽃처럼 주변을 환하게 비추고, 사람들에게 에너지를 전파하는 능력이 있습니다. 표현력이 풍부하고 사교적인 면이 강합니다.",
    energy: "열정과 활동의 에너지가 넘칩니다. 무언가에 몰입하면 불처럼 타오릅니다. 예술적 감각도 뛰어나고 창의적인 아이디어가 많이 떠오릅니다.",
    advice: "불은 너무 세면 스스로를 태울 수 있습니다. 감정의 기복을 조절하고, 차분하게 내면을 돌아보는 시간도 필요합니다."
  },
  토: {
    intro: "토(土)의 기운을 타고난 사람입니다. 대지처럼 묵직하고 안정적인 에너지가 기본 바탕에 깔려 있습니다.",
    personality: "토의 기운을 가진 사람들은 신뢰감이 있고 포용력이 큽니다. 마치 땅이 모든 것을 품듯이, 주변 사람들을 감싸 안는 넉넉함이 있습니다. 현실적이고 책임감이 강합니다.",
    energy: "안정과 조화의 에너지가 흐릅니다. 급하게 서두르기보다 차분하게 상황을 살피고 중재하는 역할을 잘합니다. 사람들 사이에서 중심을 잡아주는 존재입니다.",
    advice: "변화를 두려워하지 마세요. 땅도 계절에 따라 변하듯이, 적절한 변화는 성장의 밑거름이 됩니다."
  },
  금: {
    intro: "금(金)의 기운을 타고난 사람입니다. 가을 서리처럼 날카롭고 명확한 에너지가 기본 바탕에 깔려 있습니다.",
    personality: "금의 기운을 가진 사람들은 결단력이 있고 원칙적입니다. 마치 칼날처럼 시비를 명확히 가르고, 옳고 그름을 분명히 구분하는 성향이 있습니다. 분석력과 판단력이 뛰어납니다.",
    energy: "정리와 수확의 에너지가 흐릅니다. 복잡한 것을 정돈하고 핵심을 파악하는 능력이 있습니다. 체계적이고 효율적인 것을 좋아합니다.",
    advice: "때로는 완벽하지 않아도 괜찮습니다. 너무 날카로우면 주변이 다칠 수 있으니, 부드러움도 함께 갖추면 좋겠습니다."
  },
  수: {
    intro: "수(水)의 기운을 타고난 사람입니다. 겨울 물처럼 깊고 유연한 에너지가 기본 바탕에 깔려 있습니다.",
    personality: "수의 기운을 가진 사람들은 지혜롭고 통찰력이 있습니다. 마치 물이 낮은 곳으로 흘러가듯이, 상황에 유연하게 적응하고 깊이 생각하는 성향이 있습니다. 침착하고 냉정한 판단이 가능합니다.",
    energy: "지혜와 적응의 에너지가 흐릅니다. 물처럼 어떤 그릇이든 담기듯이, 다양한 환경에서 자신의 역할을 찾아갑니다. 직관력도 뛰어납니다.",
    advice: "물은 고이면 썩습니다. 생각만 하지 말고 행동으로 옮기는 것도 중요합니다. 흐르는 물처럼 계속 움직이세요."
  }
};

// 음양 균형 상태별 서술형 설명
const YIN_YANG_NARRATIVES: Record<"양성적" | "음성적" | "균형", {
  description: string;
  characteristics: string;
  lifePattern: string;
  advice: string;
}> = {
  양성적: {
    description: "사주 전체적으로 양(陽)의 기운이 우세합니다. 밝고 적극적인 에너지가 기본 바탕을 이루고 있습니다.",
    characteristics: "양의 기운이 강한 사람들은 외향적이고 활동적인 성향입니다. 새로운 것에 도전하고, 밖으로 나가서 활동하는 것을 좋아합니다. 리더십도 있고 추진력도 강합니다. 말하는 것보다 행동이 앞서는 편입니다.",
    lifePattern: "활발하게 움직이고 많은 사람을 만나면서 에너지를 얻는 사람입니다. 가만히 있으면 답답하고, 무언가를 해야 직성이 풀립니다. 그래서 바쁘게 살아가는 편입니다.",
    advice: "다만 양의 기운이 너무 강하면 조급해지거나 무리할 수 있습니다. 가끔은 멈춰서 쉬어가세요. 내면을 돌아보는 시간도 꼭 필요합니다."
  },
  음성적: {
    description: "사주 전체적으로 음(陰)의 기운이 우세합니다. 차분하고 신중한 에너지가 기본 바탕을 이루고 있습니다.",
    characteristics: "음의 기운이 강한 사람들은 내향적이고 사색적인 성향입니다. 깊이 생각하고 세심하게 관찰하는 것을 좋아합니다. 급하게 결정하기보다 충분히 고민한 후 움직이는 편입니다.",
    lifePattern: "혼자만의 시간이 필요하고, 조용한 환경에서 에너지를 충전하는 사람입니다. 시끄럽고 복잡한 것보다 차분하고 안정적인 것을 선호합니다.",
    advice: "다만 음의 기운이 너무 강하면 소극적이거나 우유부단해질 수 있습니다. 가끔은 과감하게 밖으로 나서보세요. 적극적인 표현도 연습해보면 좋겠습니다."
  },
  균형: {
    description: "사주에서 음(陰)과 양(陽)이 비교적 균형을 이루고 있습니다. 조화로운 에너지가 기본 바탕을 이루고 있습니다.",
    characteristics: "음양 균형이 잡힌 사람들은 상황에 따라 유연하게 대처할 수 있습니다. 때로는 적극적으로, 때로는 신중하게 상황을 살필 줄 압니다. 내면과 외면의 균형이 잘 맞습니다.",
    lifePattern: "활동적일 때도 있고 조용히 쉴 때도 있는, 자연스러운 리듬으로 살아가는 사람입니다. 극단으로 치우치지 않아서 안정적인 삶을 살아가는 편입니다.",
    advice: "이미 좋은 균형을 가지고 있으니, 이 조화로움을 잘 유지해나가면 됩니다. 어느 한쪽으로 치우치지 않도록 중용의 도를 지켜가세요."
  }
};

// 신강/신약 상태별 서술형 설명
const SIN_GANG_NARRATIVES: Record<"신강" | "신약" | "중화", {
  description: string;
  characteristics: string;
  strengths: string;
  challenges: string;
  advice: string;
}> = {
  신강: {
    description: "일간의 기운이 강한 '신강(身強)' 사주입니다. 자아가 튼튼하고 주관이 뚜렷한 사람입니다.",
    characteristics: "신강한 사람들은 자기 확신이 강하고 추진력이 있습니다. 남에게 휘둘리지 않고 자신의 길을 가는 성향입니다. 어려운 상황에서도 쉽게 무너지지 않는 단단함이 있습니다.",
    strengths: "결단력이 있고 리더십이 뛰어납니다. 사업을 하거나 독립적인 역할을 맡으면 능력을 발휘합니다. 자기 주관대로 일을 밀고 나갈 수 있는 힘이 있습니다.",
    challenges: "다만 너무 강하면 고집으로 나타날 수 있습니다. 남의 말을 잘 안 듣거나 타협을 어려워할 수 있습니다. 혼자서 다 하려다 보면 외로워질 수도 있습니다.",
    advice: "강함도 좋지만, 때로는 물러설 줄도 알아야 합니다. 협력하고 양보하는 것도 진정한 강함입니다. 재성이나 관성의 기운으로 에너지를 발산하면 균형이 맞습니다."
  },
  신약: {
    description: "일간의 기운이 약한 '신약(身弱)' 사주입니다. 섬세하고 적응력이 좋은 사람입니다.",
    characteristics: "신약한 사람들은 유연하고 협력적인 성향입니다. 주변 상황을 잘 살피고 분위기를 읽는 능력이 뛰어납니다. 혼자보다는 함께할 때 힘을 발휘하는 편입니다.",
    strengths: "배려심이 깊고 조화를 중시합니다. 팀에서 일하거나 협력이 필요한 상황에서 빛을 발합니다. 적응력이 좋아서 다양한 환경에서도 잘 어울립니다.",
    challenges: "다만 결단력이 부족하거나 자신감이 흔들릴 때가 있습니다. 남의 의견에 쉽게 휘둘리거나 스스로를 과소평가할 수 있습니다.",
    advice: "자기 자신을 믿는 연습을 해보세요. 작은 성공 경험을 쌓으면서 자신감을 키워가면 됩니다. 비겁이나 인성의 기운이 도움이 되니, 든든한 지원군을 곁에 두세요."
  },
  중화: {
    description: "일간의 기운이 치우침 없이 안정된 '중화(中和)' 사주입니다. 강하지도 약하지도 않은 고른 상태로, 마치 잔잔한 호수처럼 평온한 기운을 가지고 계십니다.",
    characteristics: "이런 사주를 가진 분들은 적응력이 뛰어납니다. 상황을 읽고 유연하게 대처하는 능력이 있어서, 필요하면 앞장서기도 하고 한 발 물러서기도 합니다. 극단에 치우치지 않는 편안함이 있습니다.",
    strengths: "어디서든 자신의 자리를 찾는 능력이 있습니다. 독립적으로도 잘하고 협업에서도 잘 어울립니다. 여러 역할을 자연스럽게 소화할 수 있는 융통성이 강점입니다.",
    challenges: "개성이 뚜렷하지 않다고 느껴지실 때가 있을 수 있습니다. 모든 것에 열려 있다 보니 결정을 미루거나 입장이 불분명해 보이기도 합니다.",
    advice: "균형 감각은 큰 자산입니다. 다만 중요한 순간에는 본인의 목소리를 분명히 내는 것도 필요합니다. 자연스럽게 흐르면서도, 핵심적인 순간에는 확실한 선택을 해보세요."
  }
};

// 일간 오행 × 신강/신약 조합별 상세 서술 (5오행 × 3상태 = 15조합)
const ELEMENT_STRENGTH_DETAILED_NARRATIVES: Record<FiveElementKey, Record<"신강" | "신약" | "중화", {
  intro: string;
  lifeApproach: string;
  careerAdvice: string;
  relationshipTip: string;
  healthFocus: string;
}>> = {
  목: {
    신강: {
      intro: "목(木) 기운이 강한 신강(身強) 사주입니다. 큰 나무가 깊이 뿌리를 내리고 하늘을 향해 곧게 뻗어 올라가듯이, 본인의 주관이 뚜렷하고 추진력이 대단합니다.",
      lifeApproach: "신강한 목 사주는 스스로 길을 개척하는 사람입니다. 남에게 의존하기보다 본인이 앞장서서 이끌어가는 것을 좋아합니다. 새로운 사업을 시작하거나 조직을 이끄는 데 적합하며, 도전적인 목표를 세우고 달성하는 데서 보람을 느낍니다.",
      careerAdvice: "경영, 창업, 교육, 기획, 연구개발 등 리더십과 창의성을 발휘할 수 있는 분야가 잘 맞습니다. 혼자 결정하고 실행할 수 있는 환경에서 능력을 발휘합니다. 다만 너무 독단적으로 가면 팀워크에 문제가 생길 수 있으니 협력도 중요합니다.",
      relationshipTip: "관계에서 주도권을 쥐시려는 경향이 있습니다. 상대방을 이끌어주고 보호해주려는 마음은 좋지만, 상대방의 의견도 존중해주면 더 깊은 관계를 맺을 수 있습니다.",
      healthFocus: "간(肝)과 담(膽)에 열이 쌓이기 쉬우니 스트레스 관리가 중요합니다. 목이나 어깨가 자주 뻣뻣해질 수 있으니 스트레칭을 자주 해주세요. 신 음식이나 녹색 채소가 도움이 됩니다."
    },
    신약: {
      intro: "목(木) 기운이 있으나 신약(身弱) 사주입니다. 나무의 성장 본능은 있지만, 아직 뿌리가 충분히 깊지 않거나 양분이 부족한 상태라고 볼 수 있습니다.",
      lifeApproach: "신약한 목 사주는 주변의 도움을 적극적으로 받는 것이 좋습니다. 수(水)의 기운(지원, 후원)이 있으면 나무가 잘 자라듯이, 좋은 멘토나 후원자를 만나면 크게 성장합니다. 급하게 나서기보다 실력을 쌓으면서 기회를 기다리는 것이 현명합니다.",
      careerAdvice: "처음부터 리더 역할보다는 전문가로서 실력을 쌓는 것이 좋습니다. 팀워크가 중요한 환경이나 안정적인 조직에서 경력을 시작하고, 점점 영역을 넓혀가면 좋겠습니다. 교육, 연구, 컨설팅 분야도 적합합니다.",
      relationshipTip: "관계에서 상대방에게 맞추시려는 경향이 있습니다. 배려심은 좋지만, 본인의 의견도 당당하게 말하는 것이 건강한 관계의 비결입니다.",
      healthFocus: "기력이 떨어지기 쉬우니 충분한 휴식과 영양 섭취가 중요합니다. 면역력이 약해지기 쉬우니 환절기에 특히 건강 관리를 잘 해야 합니다. 산책이나 숲 여행으로 자연의 기운을 받으면 좋습니다."
    },
    중화: {
      intro: "목(木) 기운이 안정적으로 흐르는 중화(中和) 사주입니다. 나무가 곧게 서면서도 바람에 유연하게 흔들리듯, 성장의 에너지가 조화롭게 발현되는 분입니다.",
      lifeApproach: "이런 목 사주는 리더십도 발휘하면서 협력도 잘하는 유연함이 있습니다. 상황에 따라 앞장서기도 하고, 한 발 물러서 조율하기도 하는 지혜로운 면이 있습니다.",
      careerAdvice: "다양한 분야에서 성공할 수 있는 잠재력이 있습니다. 리더 역할도 전문가 역할도 모두 자연스럽게 소화할 수 있으니, 마음이 이끄는 분야를 선택하시면 됩니다.",
      relationshipTip: "관계에서 밀고 당기는 것을 자연스럽게 조절하는 편입니다. 이끌 때는 이끌고, 따를 때는 따르면서 편안한 관계를 만들어갑니다.",
      healthFocus: "안정된 상태를 유지하려면 규칙적인 생활 습관이 중요합니다. 스트레스가 쌓이지 않도록 적절히 해소해 주시고, 자연과 함께하는 시간을 가져보세요."
    }
  },
  화: {
    신강: {
      intro: "화(火) 기운이 강한 신강(身強) 사주입니다. 타오르는 불꽃처럼 열정이 넘치고, 어디서든 주목받는 존재감이 있습니다.",
      lifeApproach: "신강한 화 사주는 적극적으로 세상에 나서는 사람입니다. 불처럼 주변을 밝히고 따뜻하게 하는 능력이 있습니다. 다만 너무 화끈하게 타오르면 스스로 지칠 수 있으니, 에너지 조절이 중요합니다.",
      careerAdvice: "방송, 엔터테인먼트, 정치, 교육, 마케팅 등 사람들 앞에 서는 분야가 잘 맞습니다. 카리스마로 사람들을 이끌거나 영감을 주는 역할에서 빛을 발합니다.",
      relationshipTip: "뜨겁게 다가가는 편이라 상대방이 부담스러워할 수 있습니다. 상대방의 온도에 맞춰 조절하는 것도 필요합니다.",
      healthFocus: "심장과 혈압에 주의해야 합니다. 화를 참으면 안 좋으니 적절히 표현하거나 운동으로 풀어주세요. 수분 섭취를 충분히 하고 충분히 쉬어주세요."
    },
    신약: {
      intro: "화(火) 기운이 있으나 신약(身弱) 사주입니다. 불꽃의 열정은 있지만, 아직 충분히 타오르지 못하거나 바람에 흔들리는 상태라 볼 수 있습니다.",
      lifeApproach: "신약한 화 사주는 혼자 모든 것을 밝히려 하기보다 함께 빛을 내는 것이 좋습니다. 목(木)의 기운(지원, 연료)이 있으면 불이 잘 타오르듯이, 좋은 팀원이나 조력자와 함께하면 더 큰 빛을 내실 수 있습니다.",
      careerAdvice: "처음부터 큰 무대보다는 작은 무대에서 시작하는 것이 좋습니다. 서서히 인지도를 쌓아가면서 영역을 넓히는 것이 안전합니다. 팀워크가 중요한 분야가 잘 맞습니다.",
      relationshipTip: "마음은 뜨겁지만 표현이 어려울 때가 있습니다. 용기를 내서 감정을 표현하면 관계가 더 깊어질 것입니다.",
      healthFocus: "기력이 쉽게 떨어질 수 있습니다. 따뜻하게 몸을 유지하고, 냉한 음식은 피하는 것이 좋습니다. 햇볕을 많이 쬐면 도움이 됩니다."
    },
    중화: {
      intro: "화(火) 기운이 온화하게 발현되는 중화(中和) 사주입니다. 따뜻하되 너무 뜨겁지 않은, 마치 봄볕 같은 포근한 에너지를 가지고 계십니다.",
      lifeApproach: "이런 화 사주는 열정과 절제 사이에서 자연스럽게 균형을 찾습니다. 필요할 때 화끈하게 나서면서도, 상황을 파악하고 한 발 물러서는 분별력이 있습니다.",
      careerAdvice: "여러 분야에서 활약할 수 있는 가능성이 있습니다. 무대 위에서도, 무대 뒤에서도 역할을 잘 소화합니다. 본인의 에너지를 살릴 수 있는 분야를 선택하시면 좋겠습니다.",
      relationshipTip: "따뜻하면서도 부담스럽지 않게 다가가는 능력이 있습니다. 적당한 거리감을 유지하면서도 진심을 전달하는 균형이 있습니다.",
      healthFocus: "화(火)의 기운은 관리가 필요합니다. 심장 건강과 정신 건강에 신경 쓰고, 스트레스를 쌓아두지 말고 적절히 해소해 주세요."
    }
  },
  토: {
    신강: {
      intro: "토(土) 기운이 강한 신강(身強) 사주입니다. 큰 산처럼 묵직하고 든든한 존재감이 있며, 주변 사람들의 의지처가 되는 사람입니다.",
      lifeApproach: "신강한 토 사주는 중심을 잡아주는 역할을 합니다. 조직이나 가정에서 기둥 같은 존재로, 안정감을 주는 사람입니다. 다만 너무 움직이지 않으면 시대 변화에 뒤처질 수 있으니 적당한 유연성도 필요합니다.",
      careerAdvice: "부동산, 건설, 금융, 행정, 컨설팅 등 안정적이고 기반이 중요한 분야에서 빛을 발합니다. 조직의 중심에서 안정을 유지하는 역할이 잘 맞습니다.",
      relationshipTip: "든든한 보호자 역할을 합니다. 다만 너무 보수적이시거나 변화를 싫어하면 갈등이 생길 수 있으니, 새로운 것에 열린 마음을 가지는 것도 좋습니다.",
      healthFocus: "비위(脾胃) 계통에 주의해야 합니다. 과식하거나 불규칙하게 먹으면 소화기에 문제가 올 수 있습니다. 규칙적인 식사와 적당한 운동이 중요합니다."
    },
    신약: {
      intro: "토(土) 기운이 있으나 신약(身弱) 사주입니다. 대지의 안정감을 원하지만, 아직 기반이 완전히 굳어지지 않은 상태라 볼 수 있습니다.",
      lifeApproach: "신약한 토 사주는 탄탄한 기반을 만드는 것이 먼저입니다. 급하게 크게 가려 하지 말고, 작은 것부터 차근차근 쌓아가는 것이 중요합니다. 화(火)의 기운(열정, 지원)이 있으면 땅이 단단해지듯이, 좋은 조력자를 만나면 안정감이 높아집니다.",
      careerAdvice: "안정적인 조직에 소속되는 것이 좋습니다. 공무원이나 대기업처럼 기반이 탄탄한 곳에서 경력을 쌓는 것이 안전합니다.",
      relationshipTip: "안정감을 추구하고, 믿을 수 있는 파트너를 원합니다. 신뢰를 쌓는 데 시간이 걸리시지만, 한 번 맺은 관계는 오래 갑니다.",
      healthFocus: "소화기와 면역력 관리에 신경 써야 합니다. 스트레스를 받으면 위장에 바로 반응이 오실 수 있습니다. 따뜻한 음식 섭취가 도움이 됩니다."
    },
    중화: {
      intro: "토(土) 기운이 편안하게 자리 잡은 중화(中和) 사주입니다. 대지처럼 든든하면서도 유연함을 함께 갖추신 분입니다.",
      lifeApproach: "이런 토 사주는 안정을 추구하면서도 변화에 열려 있습니다. 기반을 지키면서 필요할 때는 새로운 것을 받아들이는 현명함이 있습니다.",
      careerAdvice: "전통적인 분야에서도, 새로운 분야에서도 적응할 수 있습니다. 본인의 관심사와 시장의 흐름을 잘 파악해서 선택하시면 좋겠습니다.",
      relationshipTip: "믿음직스러우면서도 상대방의 변화를 받아들이는 넉넉함이 있습니다. 관계의 기반을 유지하면서도 성장을 함께합니다.",
      healthFocus: "토(土)의 기운은 비위 계통과 관련이 있으니, 소화기 건강에 신경 써야 합니다. 규칙적인 식습관을 유지해 주세요."
    }
  },
  금: {
    신강: {
      intro: "금(金) 기운이 강한 신강(身強) 사주입니다. 단단한 쇠처럼 굳건하고 결단력이 있며, 한 번 결정하면 뒤돌아보지 않는 추진력이 있습니다.",
      lifeApproach: "신강한 금 사주는 스스로의 힘으로 길을 개척하는 사람입니다. 어려운 결정이 필요할 때 주저 없이 선택하고, 그 결과에 책임을 지는 사람입니다. 다만 너무 강하면 부딪히시기 쉬우니, 가끔은 유연함도 필요합니다.",
      careerAdvice: "법조, 군경, 금융, 제조업, 기술 등 결단력과 원칙이 중요한 분야에서 빛을 발합니다. 조직을 이끌거나 위기 상황에서 결정을 내리는 역할이 잘 맞습니다.",
      relationshipTip: "명확하고 직접적입니다. 돌려 말하지 않고 본심을 솔직하게 표현합니다. 상대방에 따라 조절하는 것도 필요합니다.",
      healthFocus: "폐와 대장 계통에 주의해야 합니다. 호흡기 질환에 조심하고, 건조한 환경을 피해주세요. 스트레칭과 마사지가 도움이 됩니다."
    },
    신약: {
      intro: "금(金) 기운이 있으나 신약(身弱) 사주입니다. 결단력과 추진력의 잠재력은 있지만, 아직 충분히 단련되지 않은 상태라 볼 수 있습니다.",
      lifeApproach: "신약한 금 사주는 성급하게 결정하기보다는 충분히 준비한 후에 움직이는 것이 좋습니다. 토(土)의 기운(지지, 기반)이 있으면 금이 빛나듯이, 든든한 지원을 받으면 자신감이 높아집니다.",
      careerAdvice: "처음부터 결정권자가 되기보다는 전문가로서 실력을 쌓는 것이 좋습니다. 기술이나 전문성을 키우면서 점점 영역을 넓혀가는 것이 안전합니다.",
      relationshipTip: "본인의 의견을 표현하는 것이 어려울 때가 있습니다. 건강한 자기주장을 연습하는 것이 좋습니다.",
      healthFocus: "면역력과 호흡기 건강에 신경 써야 합니다. 규칙적인 생활과 적절한 운동으로 체력을 키우는 것이 중요합니다."
    },
    중화: {
      intro: "금(金) 기운이 단단하면서도 부드러운 중화(中和) 사주입니다. 보석처럼 빛나면서도 유연하게 다듬어지는 성질을 가지셨습니다.",
      lifeApproach: "이런 금 사주는 단호함과 융통성을 상황에 맞게 발휘합니다. 원칙을 지키면서도 필요할 때는 예외를 인정하는 지혜가 있어서, 어떤 상황에서도 적절하게 대응합니다.",
      careerAdvice: "리더 역할도, 전문가 역할도 모두 잘 소화할 수 있습니다. 본인의 강점과 관심사를 고려해서 길을 선택하시면 좋겠습니다.",
      relationshipTip: "명확하게 표현하면서도 상대방의 마음을 헤아리는 배려가 있습니다. 솔직하되 상처를 주지 않는 소통 능력이 있습니다.",
      healthFocus: "금(金)의 기운은 호흡기와 관련이 있으니, 폐 건강에 신경 쓰시면 좋습니다. 맑은 공기에서 생활하고, 호흡 운동을 해주는 것이 좋습니다."
    }
  },
  수: {
    신강: {
      intro: "수(水) 기운이 강한 신강(身強) 사주입니다. 넓은 바다처럼 포용력이 크고, 어떤 상황에서도 길을 찾는 지혜가 있습니다.",
      lifeApproach: "신강한 수 사주는 흐름을 타면서도 주도하는 사람입니다. 강이 자연스럽게 바다로 흘러가듯이, 본인만의 방향으로 나아가면서 장애물을 우회하는 지혜가 있습니다.",
      careerAdvice: "무역, 물류, 철학, 컨설팅, 투자 등 넓은 시야와 통찰력이 필요한 분야에서 빛을 발합니다. 장기적인 안목으로 성공하는 경우가 많습니다.",
      relationshipTip: "포용력이 크고 여유가 있습니다. 다만 너무 여유로우면 무심해 보일 수 있으니, 관심을 표현해 주는 것도 필요합니다.",
      healthFocus: "신장과 방광 계통에 주의해야 합니다. 수분 섭취를 충분히 하고, 하체 혈액순환에 신경 써주세요. 규칙적인 운동이 중요합니다."
    },
    신약: {
      intro: "수(水) 기운이 있으나 신약(身弱) 사주입니다. 지혜와 유연함은 있지만, 아직 강한 흐름을 만들지 못하는 상태라 볼 수 있습니다.",
      lifeApproach: "신약한 수 사주는 혼자 큰 강을 만들려 하지 말고, 다른 물줄기들과 합류하는 것이 좋습니다. 금(金)의 기운(지원, 원천)이 있으면 물이 많아지듯이, 좋은 팀이나 조직에 합류하면 함께 더 큰 흐름을 만들 수 있습니다.",
      careerAdvice: "큰 조직의 일원으로서 역할을 다하는 것이 좋습니다. 분석, 기획, 자문 등의 역할이 잘 맞습니다. 팀에서 본인의 지혜를 발휘하는 것이 안전합니다.",
      relationshipTip: "머리로는 이해하지만 표현이 부족할 때가 있습니다. 감정을 표현하는 연습을 하면 관계가 더 깊어질 것입니다.",
      healthFocus: "신장과 비뇨기 계통 건강에 신경 써야 합니다. 찬 것을 피하고 몸을 따뜻하게 유지해 주세요. 활동적인 취미를 가지는 것이 좋습니다."
    },
    중화: {
      intro: "수(水) 기운이 잔잔하게 흐르는 중화(中和) 사주입니다. 맑은 호수처럼 깊이가 있으면서도 고요한 지혜를 갖추신 분입니다.",
      lifeApproach: "이런 수 사주는 사고와 행동의 조화가 좋습니다. 충분히 고려한 후에 움직이고, 상황에 맞게 유연하게 대처하는 통찰력이 있습니다.",
      careerAdvice: "분석과 실행이 모두 요구되는 분야에서 성공할 수 있습니다. 기획부터 실행까지 전 과정을 아우르는 역할이 잘 어울립니다.",
      relationshipTip: "상대방을 깊이 이해하면서도 본인의 마음도 잘 전달합니다. 경청하면서도 말해야 할 때는 분명히 말하는 소통 능력이 있습니다.",
      healthFocus: "수(水)의 기운은 신장과 관련이 있으니, 비뇨기 건강에 신경 쓰시면 좋습니다. 수분 섭취와 하체 운동을 꾸준히 해주세요."
    }
  }
};

// 일간별 오행 강약 계산을 위한 생극 관계
const ELEMENT_RELATIONS: Record<FiveElementKey, {
  generates: FiveElementKey;  // 내가 생하는 (설기)
  generated: FiveElementKey;  // 나를 생하는 (인성)
  controls: FiveElementKey;   // 내가 극하는 (재성)
  controlled: FiveElementKey; // 나를 극하는 (관성)
  same: FiveElementKey;       // 같은 오행 (비겁)
}> = {
  목: { generates: "화", generated: "수", controls: "토", controlled: "금", same: "목" },
  화: { generates: "토", generated: "목", controls: "금", controlled: "수", same: "화" },
  토: { generates: "금", generated: "화", controls: "수", controlled: "목", same: "토" },
  금: { generates: "수", generated: "토", controls: "목", controlled: "화", same: "금" },
  수: { generates: "목", generated: "금", controls: "화", controlled: "토", same: "수" },
};

// 월지별 계절 강약 (월령)
const MONTH_ELEMENT_STRENGTH: Record<string, Record<FiveElementKey, number>> = {
  // 봄 (인묘진) - 목 왕성
  인: { 목: 3, 화: 1, 토: 0, 금: -1, 수: 0 },
  묘: { 목: 3, 화: 1, 토: -1, 금: -1, 수: 0 },
  진: { 목: 1, 화: 1, 토: 2, 금: 0, 수: -1 },
  // 여름 (사오미) - 화 왕성
  사: { 목: 0, 화: 3, 토: 1, 금: -1, 수: -1 },
  오: { 목: -1, 화: 3, 토: 1, 금: -1, 수: -1 },
  미: { 목: -1, 화: 1, 토: 2, 금: 1, 수: -1 },
  // 가을 (신유술) - 금 왕성
  신: { 목: -1, 화: -1, 토: 1, 금: 3, 수: 1 },
  유: { 목: -1, 화: -1, 토: 0, 금: 3, 수: 1 },
  술: { 목: -1, 화: 0, 토: 2, 금: 1, 수: 0 },
  // 겨울 (해자축) - 수 왕성
  해: { 목: 1, 화: -1, 토: -1, 금: 0, 수: 3 },
  자: { 목: 1, 화: -1, 토: -1, 금: 0, 수: 3 },
  축: { 목: -1, 화: -1, 토: 2, 금: 1, 수: 1 },
};

// ============================================
// 분석 함수
// ============================================

/**
 * 음양 균형 분석
 */
function analyzeYinYang(pillars: Pillar[]): Chapter2Result["yinYangBalance"] {
  let yangCount = 0;
  let yinCount = 0;

  for (const pillar of pillars) {
    if (pillar.cheongan) {
      if (CHEONGAN_YINYANG[pillar.cheongan] === "양") yangCount++;
      else yinCount++;
    }
    if (pillar.jiji) {
      if (JIJI_YINYANG[pillar.jiji] === "양") yangCount++;
      else yinCount++;
    }
  }

  let balance: "양성적" | "음성적" | "균형";
  let interpretation = "";

  const total = yangCount + yinCount;
  const yangRatio = total > 0 ? yangCount / total : 0.5;

  if (yangRatio > 0.65) {
    balance = "양성적";
    interpretation = `양(陽)이 ${yangCount}개, 음(陰)이 ${yinCount}개로 양의 기운이 우세합니다. 양성적인 사주는 외향적이고 활동적인 에너지를 가지며, 적극적으로 세상에 나아가려는 성향이 있습니다. 다만 지나치면 조급하거나 무리할 수 있으니 휴식과 내면의 성찰이 필요합니다.`;
  } else if (yangRatio < 0.35) {
    balance = "음성적";
    interpretation = `양(陽)이 ${yangCount}개, 음(陰)이 ${yinCount}개로 음의 기운이 우세합니다. 음성적인 사주는 내향적이고 신중한 에너지를 가지며, 깊은 생각과 세심한 관찰력이 있습니다. 다만 지나치면 소극적이거나 우유부단해질 수 있으니 적극적인 표현과 행동이 필요합니다.`;
  } else {
    balance = "균형";
    interpretation = `양(陽)이 ${yangCount}개, 음(陰)이 ${yinCount}개로 음양이 비교적 균형을 이루고 있습니다. 음양 균형은 상황에 따라 유연하게 대처할 수 있는 능력을 의미하며, 내면과 외면의 조화로운 발전이 가능합니다.`;
  }

  return { yangCount, yinCount, balance, interpretation };
}

/**
 * 오행 분포 상세 분석
 */
function analyzeFiveElements(ohengCount: OhengCount): Chapter2Result["fiveElements"] {
  const total = Object.values(ohengCount).reduce((sum, count) => sum + count, 0);
  const elements: FiveElementKey[] = ["목", "화", "토", "금", "수"];

  const distribution: ElementDetailedAnalysis[] = elements.map((element) => {
    const count = ohengCount[element];
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    let strength: "과다" | "적정" | "부족" | "없음";
    if (count === 0) strength = "없음";
    else if (count === 1) strength = "부족";
    else if (count <= 3) strength = "적정";
    else strength = "과다";

    const personalityData = ELEMENT_PERSONALITY[element];
    const personality = strength === "과다"
      ? personalityData.excess.join(", ")
      : strength === "없음" || strength === "부족"
        ? personalityData.deficient.join(", ")
        : personalityData.balanced.join(", ");

    const bodyData = ELEMENT_BODY[element];
    const healthImpact = strength === "과다"
      ? `${element}(${ELEMENT_HANJA[element]})이 과다하여 ${bodyData.organs.join(", ")}에 열이 쌓이기 쉽습니다.`
      : strength === "없음" || strength === "부족"
        ? `${element}(${ELEMENT_HANJA[element]})이 부족하여 ${bodyData.organs.join(", ")} 기능이 약해지기 쉽습니다.`
        : `${element}(${ELEMENT_HANJA[element]})이 적정하여 ${bodyData.organs.join(", ")} 건강이 양호합니다.`;

    return {
      element: ELEMENT_TO_ENG[element],
      count,
      percentage,
      strength,
      personality,
      healthImpact,
      careerHint: ELEMENT_CAREER[element],
    };
  });

  // 가장 많은/적은 오행 찾기
  const sorted = [...distribution].sort((a, b) => b.count - a.count);
  const dominant = sorted[0];
  const weak = sorted.filter(e => e.count > 0).pop() || sorted[sorted.length - 1];
  const missing = sorted.find(e => e.count === 0);

  return {
    distribution,
    dominant: dominant.element,
    weak: weak.element,
    missing: missing?.element,
  };
}

/**
 * 오행에서 성격 및 심리 패턴 분석
 */
function analyzePersonalityFromElements(
  ohengCount: OhengCount,
  ilganElement: FiveElementKey
): Chapter2Result["personalityFromElements"] {
  const elements: FiveElementKey[] = ["목", "화", "토", "금", "수"];

  // 핵심 성격 특성 (일간 오행 기준)
  const coreTraits = ELEMENT_PERSONALITY[ilganElement].balanced;

  // 강점 (많은 오행 기준)
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const element of elements) {
    const count = ohengCount[element];
    if (count >= 3) {
      // 과다한 오행의 긍정적 측면
      strengths.push(...ELEMENT_PERSONALITY[element].balanced.slice(0, 2));
      // 과다한 오행의 부정적 측면
      weaknesses.push(...ELEMENT_PERSONALITY[element].excess.slice(0, 1));
    } else if (count === 0) {
      // 없는 오행의 부족한 측면
      weaknesses.push(...ELEMENT_PERSONALITY[element].deficient.slice(0, 1));
    }
  }

  // 심리 패턴 분석
  let psychologicalPattern = "";
  const dominantElement = elements.reduce((max, el) =>
    ohengCount[el] > ohengCount[max] ? el : max
  );

  psychologicalPattern = ELEMENT_PERSONALITY[dominantElement].psychology;

  // 없는 오행이 있으면 추가 분석
  const missingElements = elements.filter(el => ohengCount[el] === 0);
  if (missingElements.length > 0) {
    psychologicalPattern += ` 다만 ${missingElements.map(el => el + "(" + ELEMENT_HANJA[el] + ")").join(", ")}의 기운이 없어 해당 영역에서 심리적 보완이 필요합니다.`;
  }

  return {
    coreTraits,
    strengths: [...new Set(strengths)].slice(0, 4),
    weaknesses: [...new Set(weaknesses)].slice(0, 4),
    psychologicalPattern,
  };
}

/**
 * 체질 분석
 */
function analyzeBodyConstitution(
  ohengCount: OhengCount,
  ilganElement: FiveElementKey
): Chapter2Result["bodyConstitution"] {
  const elements: FiveElementKey[] = ["목", "화", "토", "금", "수"];

  // 체질 유형 결정 (가장 많은 오행 또는 일간 기준)
  const dominantElement = elements.reduce((max, el) =>
    ohengCount[el] > ohengCount[max] ? el : max
  );

  const constitutionType = ohengCount[dominantElement] >= 3
    ? dominantElement
    : ilganElement;

  const bodyData = ELEMENT_BODY[constitutionType];

  // 강한 장기 (많은 오행)
  const strongOrgans: string[] = [];
  const weakOrgans: string[] = [];

  for (const element of elements) {
    if (ohengCount[element] >= 3) {
      strongOrgans.push(...ELEMENT_BODY[element].organs);
    } else if (ohengCount[element] === 0) {
      weakOrgans.push(...ELEMENT_BODY[element].organs);
    }
  }

  return {
    type: `${constitutionType}형(${ELEMENT_HANJA[constitutionType]}形) 체질`,
    strongOrgans: strongOrgans.length > 0 ? strongOrgans : ["해당 없음"],
    weakOrgans: weakOrgans.length > 0 ? weakOrgans : ["해당 없음"],
  };
}

/**
 * 신강/신약 판정
 * 일간(日干)의 강약을 판단하는 핵심 분석
 */
function analyzeSinGangSinYak(
  pillars: Pillar[],
  ilganElement: FiveElementKey,
  monthBranch: string
): Chapter2Result["sinGangSinYak"] {
  // 점수 계산
  let score = 0;
  const relations = ELEMENT_RELATIONS[ilganElement];

  // 1. 월령(月令) - 가장 중요 (30%)
  const monthStrength = MONTH_ELEMENT_STRENGTH[monthBranch]?.[ilganElement] || 0;
  score += monthStrength * 15; // -45 ~ +45

  // 2. 사주 내 오행 분포
  for (const pillar of pillars) {
    // 천간 분석
    if (pillar.cheongan) {
      const stemElement = CHEONGAN_OHENG[pillar.cheongan];
      if (stemElement === relations.same) score += 8;        // 비겁
      else if (stemElement === relations.generated) score += 6; // 인성
      else if (stemElement === relations.generates) score -= 3; // 식상 (설기)
      else if (stemElement === relations.controls) score -= 4;  // 재성
      else if (stemElement === relations.controlled) score -= 5; // 관성
    }

    // 지지 분석 (지지는 영향력이 더 큼)
    if (pillar.jiji) {
      const branchElement = JIJI_OHENG[pillar.jiji];
      if (branchElement === relations.same) score += 10;       // 비겁
      else if (branchElement === relations.generated) score += 8; // 인성
      else if (branchElement === relations.generates) score -= 4; // 식상
      else if (branchElement === relations.controls) score -= 5;  // 재성
      else if (branchElement === relations.controlled) score -= 6; // 관성
    }
  }

  // 점수 범위 조정 (-100 ~ +100)
  score = Math.max(-100, Math.min(100, score));

  // 신강/신약/중화 판정
  let result: "신강" | "신약" | "중화";
  let explanation = "";
  let implications = "";

  if (score >= 25) {
    result = "신강";
    explanation = `일간 ${ilganElement}(${ELEMENT_HANJA[ilganElement]})의 기운이 강합니다. 월령의 도움과 사주 내 비겁·인성의 힘으로 자아가 튼튼합니다.`;
    implications = "신강한 사주는 자기 주관이 뚜렷하고 추진력이 있습니다. 재성(財星)이나 관성(官星)으로 기운을 발산해야 균형이 맞습니다. 사업이나 리더 역할에 적합하며, 너무 강하면 고집으로 나타날 수 있으니 협력과 양보를 배워야 합니다.";
  } else if (score <= -25) {
    result = "신약";
    explanation = `일간 ${ilganElement}(${ELEMENT_HANJA[ilganElement]})의 기운이 약합니다. 월령의 극제와 사주 내 식상·재성·관성의 힘으로 자아가 약해져 있습니다.`;
    implications = "신약한 사주는 섬세하고 적응력이 좋지만 결단력이 부족할 수 있습니다. 비겁(比劫)이나 인성(印星)의 도움이 필요합니다. 협력적인 환경에서 힘을 발휘하며, 자기 확신을 키우는 것이 중요합니다.";
  } else {
    result = "중화";
    explanation = `일간 ${ilganElement}(${ELEMENT_HANJA[ilganElement]})의 기운이 균형을 이루고 있습니다. 강하지도 약하지도 않은 중화(中和) 상태입니다.`;
    implications = "중화 사주는 유연성이 높고 상황에 따라 적절히 대응할 수 있습니다. 특별히 보완할 오행보다는 흐름에 따라 자연스럽게 살아가는 것이 좋습니다. 극단을 피하고 중용의 도를 지키면 안정적인 삶을 살 수 있습니다.";
  }

  return {
    result,
    score,
    explanation,
    implications,
  };
}

/**
 * 서술형 풀이 생성
 */
function generateEumyangOhengNarrative(
  ilganElement: FiveElementKey,
  yinYangBalance: "양성적" | "음성적" | "균형",
  sinGangSinYak: "신강" | "신약" | "중화",
  ohengCount: OhengCount
): Chapter2Result["narrative"] {
  const elementNarrative = DAY_MASTER_ELEMENT_NARRATIVES[ilganElement];
  const yinYangNarrative = YIN_YANG_NARRATIVES[yinYangBalance];
  const sinGangNarrative = SIN_GANG_NARRATIVES[sinGangSinYak];

  // 일간 오행 × 신강/신약 조합 내러티브 가져오기
  const elementStrengthNarrative = ELEMENT_STRENGTH_DETAILED_NARRATIVES[ilganElement]?.[sinGangSinYak];

  // 오행 분포 분석
  const elements: FiveElementKey[] = ["목", "화", "토", "금", "수"];
  const excessElements = elements.filter(el => ohengCount[el] >= 4);
  const missingElements = elements.filter(el => ohengCount[el] === 0);
  const weakElements = elements.filter(el => ohengCount[el] === 1);

  // 오행 불균형 설명 생성
  let ohengDetails: string[] = [];

  if (excessElements.length > 0) {
    for (const el of excessElements) {
      const personalityData = ELEMENT_PERSONALITY[el];
      const bodyData = ELEMENT_BODY[el];
      ohengDetails.push(
        `${el}(${ELEMENT_HANJA[el]}) 기운이 ${ohengCount[el]}개나 있어서 상당히 강한 편입니다. ` +
        `이런 사람들은 ${personalityData.balanced.slice(0, 2).join(", ")} 같은 장점이 두드러지지만, ` +
        `너무 강하면 ${personalityData.excess.slice(0, 2).join(", ")} 같은 면이 나타날 수 있습니다. ` +
        `건강 면에서는 ${bodyData.organs.join(", ")}에 열이 쌓이기 쉬우니 주의가 필요합니다.`
      );
    }
  }

  if (missingElements.length > 0) {
    for (const el of missingElements) {
      const personalityData = ELEMENT_PERSONALITY[el];
      const bodyData = ELEMENT_BODY[el];
      ohengDetails.push(
        `사주에 ${el}(${ELEMENT_HANJA[el]}) 기운이 없습니다. ` +
        `이런 경우 ${personalityData.deficient.slice(0, 2).join(", ")} 같은 어려움이 있을 수 있습니다. ` +
        `${bodyData.organs.join(", ")} 건강에도 신경 써주는 것이 좋겠습니다. ` +
        `${el} 기운을 보충하려면 ${ELEMENT_CAREER[el]} 관련 분야에서 활동하거나 해당 오행의 색상, 방위를 활용해보세요.`
      );
    }
  }

  if (weakElements.length > 0 && ohengDetails.length < 3) {
    for (const el of weakElements.slice(0, 2 - missingElements.length)) {
      const personalityData = ELEMENT_PERSONALITY[el];
      ohengDetails.push(
        `${el}(${ELEMENT_HANJA[el]}) 기운이 1개로 조금 약한 편입니다. ` +
        `${personalityData.balanced.slice(0, 1).join("")} 같은 ${el}의 긍정적 특성을 발휘하려면 ` +
        `의식적으로 해당 기운을 보충해주면 좋습니다.`
      );
    }
  }

  // 기본 오행 분포 설명
  if (ohengDetails.length === 0) {
    ohengDetails.push(
      "오행이 비교적 고르게 분포되어 있습니다. 특별히 과다하거나 부족한 기운 없이 균형 잡힌 편입니다. " +
      "이런 사람들은 다양한 분야에서 적응력을 발휘할 수 있습니다."
    );
  }

  // intro 생성 (일간 오행 × 신강/신약 조합 반영)
  let intro = `이제 음양오행에 대해 살펴보겠습니다. ${elementNarrative.intro} ${yinYangNarrative.description}`;

  if (elementStrengthNarrative) {
    intro += `\n\n${elementStrengthNarrative.intro}`;
  }

  // mainAnalysis 생성 (일간 오행 × 신강/신약 조합 반영)
  let mainAnalysis = `
${elementNarrative.personality}

${elementNarrative.energy}

${yinYangNarrative.characteristics} ${yinYangNarrative.lifePattern}

그리고 신강신약 분석 결과를 보면, ${sinGangNarrative.description} ${sinGangNarrative.characteristics}
  `.trim();

  // 일간 오행 × 신강/신약 조합 상세 분석 추가
  if (elementStrengthNarrative) {
    mainAnalysis += `\n\n【${ilganElement}(${ELEMENT_HANJA[ilganElement]}) + ${sinGangSinYak} 조합의 삶의 방식】\n\n${elementStrengthNarrative.lifeApproach}`;
  }

  // details 생성 (일간 오행 × 신강/신약 조합 반영)
  const details = [
    `【오행 분포 분석】\n${ohengDetails.join("\n\n")}`,
    `【신강신약 상세】\n${sinGangNarrative.strengths}\n\n${sinGangNarrative.challenges}`,
  ];

  // 일간 오행 × 신강/신약 조합별 상세 섹션 추가
  if (elementStrengthNarrative) {
    details.push(`【${ilganElement}(${ELEMENT_HANJA[ilganElement]}) ${sinGangSinYak} - 직업과 진로】\n\n${elementStrengthNarrative.careerAdvice}`);
    details.push(`【${ilganElement}(${ELEMENT_HANJA[ilganElement]}) ${sinGangSinYak} - 대인관계와 연애】\n\n${elementStrengthNarrative.relationshipTip}`);
    details.push(`【${ilganElement}(${ELEMENT_HANJA[ilganElement]}) ${sinGangSinYak} - 건강 관리 포인트】\n\n${elementStrengthNarrative.healthFocus}`);
  }

  // advice 생성
  const advice = `${elementNarrative.advice}\n\n${yinYangNarrative.advice}\n\n${sinGangNarrative.advice}`;

  // closing 생성
  const closing = `음양오행의 기본 에너지를 이해했으니, 이제 다음 장에서 더 구체적인 십성(十星) 분석으로 들어가보겠습니다. ` +
    `음양오행이 '무엇으로' 구성되어 있는지를 보여준다면, 십성은 그 기운들이 '어떻게' 작용하는지를 알려줍니다.`;

  return {
    intro,
    mainAnalysis,
    details,
    advice,
    closing,
  };
}

/**
 * 제2장 전체 분석 실행
 */
export function analyzeChapter2(sajuResult: SajuApiResult): Chapter2Result {
  const { yearPillar, monthPillar, dayPillar, timePillar, ohengCount } = sajuResult;
  const pillars = [yearPillar, monthPillar, dayPillar, timePillar];

  // 일간 오행 추출
  const ilgan = dayPillar.cheongan;
  const ilganElement = CHEONGAN_OHENG[ilgan] || "목";

  // 월지 추출
  const monthBranch = monthPillar.jiji;

  // 각 분석 실행
  const yinYangBalance = analyzeYinYang(pillars);
  const fiveElements = analyzeFiveElements(ohengCount);
  const personalityFromElements = analyzePersonalityFromElements(ohengCount, ilganElement);
  const bodyConstitution = analyzeBodyConstitution(ohengCount, ilganElement);
  const sinGangSinYak = analyzeSinGangSinYak(pillars, ilganElement, monthBranch);

  // 서술형 풀이 생성
  const narrative = generateEumyangOhengNarrative(
    ilganElement,
    yinYangBalance.balance,
    sinGangSinYak.result,
    ohengCount
  );

  return {
    yinYangBalance,
    fiveElements,
    personalityFromElements,
    bodyConstitution,
    sinGangSinYak,
    narrative,
  };
}

export default analyzeChapter2;
