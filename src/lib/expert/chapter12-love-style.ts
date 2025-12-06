/**
 * 제12장: 연애 성향 분석
 * 공통 분석 (성별/관계상태 무관)
 */

import type { SajuApiResult, FiveElement, Gender } from "@/types/saju";
import type { Chapter12Result } from "@/types/expert";

// ============================================
// 타입 정의
// ============================================

type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";
type EarthlyBranchKr = "자" | "축" | "인" | "묘" | "진" | "사" | "오" | "미" | "신" | "유" | "술" | "해";
type StrengthType = "신강" | "신약" | "중화";

// ============================================
// 연애 유형 상수
// ============================================

interface LoveStyleInfo {
  type: string;
  description: string;
  attractionPoints: string[];
  turnOffs: string[];
}

const ELEMENT_LOVE_STYLES: Record<FiveElement, LoveStyleInfo> = {
  wood: {
    type: "성장형 연애",
    description: "함께 성장하고 발전하는 관계를 추구합니다. 파트너의 꿈과 목표를 응원하며, 서로 자극이 되는 관계를 원합니다.",
    attractionPoints: ["성장 마인드", "비전 공유", "지적인 대화", "자기 계발하는 모습"],
    turnOffs: ["정체되어 있는 사람", "의존적인 태도", "변화를 두려워함", "꿈이 없는 사람"]
  },
  fire: {
    type: "열정형 연애",
    description: "뜨겁고 열정적인 사랑을 추구합니다. 스킨십과 표현에 적극적이며, 연애 자체를 즐깁니다.",
    attractionPoints: ["화끈한 성격", "적극적인 표현", "유머 감각", "밝은 에너지"],
    turnOffs: ["무덤덤한 반응", "감정 표현 인색", "지루한 데이트", "열정 없는 사람"]
  },
  earth: {
    type: "안정형 연애",
    description: "믿음직하고 안정적인 관계를 추구합니다. 천천히 신뢰를 쌓아가며, 오래 지속되는 사랑을 원합니다.",
    attractionPoints: ["진실됨", "안정감", "책임감", "가정적인 모습"],
    turnOffs: ["변덕스러운 사람", "약속을 안 지킴", "과한 자유로움", "경제관념 없음"]
  },
  metal: {
    type: "원칙형 연애",
    description: "명확한 기준과 원칙을 가지고 연애합니다. 서로의 시간과 공간을 존중하며, 깊이 있는 관계를 추구합니다.",
    attractionPoints: ["자기 주관", "깔끔함", "지적임", "독립적"],
    turnOffs: ["우유부단함", "경계 무시", "논리 없는 주장", "지저분함"]
  },
  water: {
    type: "감성형 연애",
    description: "깊은 감정적 교류를 추구합니다. 공감과 이해를 중시하며, 영혼의 교류 같은 연애를 원합니다.",
    attractionPoints: ["감수성", "공감 능력", "깊은 대화", "신비로움"],
    turnOffs: ["감정적으로 둔함", "공감 부족", "피상적 대화", "비밀이 없음"]
  }
};

// 십신별 연애 경향
const SIPSIN_LOVE_STYLES: Record<string, {
  male: string;
  female: string;
  commonTraits: string[];
}> = {
  비견: {
    male: "친구 같은 연인을 원하며, 동등한 관계를 추구합니다. 경쟁심이 발동할 수 있습니다.",
    female: "친구 같은 연인을 원하며, 자신만의 영역을 존중받길 원합니다.",
    commonTraits: ["친구 같은 관계", "동등한 파트너", "독립성 중시"]
  },
  겁재: {
    male: "질투심이 강하고 소유욕이 있습니다. 사랑에 올인하는 스타일입니다.",
    female: "사랑에 과감하며, 경쟁자가 있으면 더 타오릅니다.",
    commonTraits: ["열정적", "소유욕", "질투심", "적극적 구애"]
  },
  식신: {
    male: "편안하고 다정한 연애를 합니다. 맛있는 것 먹고 즐기는 데이트를 좋아합니다.",
    female: "포근한 사랑을 주며, 연인을 잘 챙깁니다. 요리로 마음을 표현합니다.",
    commonTraits: ["편안함", "배려", "식사 데이트", "안정감 추구"]
  },
  상관: {
    male: "자유롭고 창의적인 연애를 원합니다. 구속을 싫어하고 새로운 것을 시도합니다.",
    female: "감정 표현이 솔직하고 직설적입니다. 지루한 연애는 못 참습니다.",
    commonTraits: ["자유로움", "솔직함", "창의적", "구속 싫어함"]
  },
  편재: {
    male: "연애도 투자처럼 접근할 수 있습니다. 매력적인 사람에게 끌립니다.",
    female: "활동적이고 사교적인 연애를 즐깁니다. 다양한 경험을 추구합니다.",
    commonTraits: ["활동적", "사교적", "외모 중시", "다양한 경험"]
  },
  정재: {
    male: "진지하고 책임감 있는 연애를 합니다. 결혼을 염두에 둔 만남을 선호합니다.",
    female: "안정적이고 믿을 수 있는 연인을 원합니다. 경제력을 중시합니다.",
    commonTraits: ["진지함", "책임감", "안정 추구", "결혼 지향"]
  },
  편관: {
    male: "카리스마 있고 주도적인 연애를 합니다. 밀고 당기기에 능합니다.",
    female: "강인한 매력에 끌립니다. 도전적인 연애를 즐깁니다.",
    commonTraits: ["주도적", "카리스마", "밀당", "도전적"]
  },
  정관: {
    male: "예의 바르고 신사적인 연애를 합니다. 규칙적인 만남을 선호합니다.",
    female: "품격 있는 연애를 추구합니다. 사회적 체면을 중시합니다.",
    commonTraits: ["예의 바름", "품격", "규칙적", "체면 중시"]
  },
  편인: {
    male: "독특하고 개성 있는 연애를 추구합니다. 영적 교류를 중시합니다.",
    female: "일반적이지 않은 만남을 선호합니다. 깊은 대화를 중시합니다.",
    commonTraits: ["독특함", "영적 교류", "깊은 대화", "비주류"]
  },
  정인: {
    male: "정신적 교류를 중시합니다. 연인을 가르치려는 경향이 있습니다.",
    female: "지적인 연인을 선호합니다. 배움이 있는 관계를 원합니다.",
    commonTraits: ["지적 교류", "배움", "멘토 역할", "정신적 사랑"]
  }
};

// 띠별 궁합
const ZODIAC_COMPATIBILITY: Record<EarthlyBranchKr, {
  best: EarthlyBranchKr[];
  good: EarthlyBranchKr[];
  avoid: EarthlyBranchKr[];
}> = {
  자: { best: ["축", "신"], good: ["진", "사"], avoid: ["오", "미", "묘"] },
  축: { best: ["자", "사"], good: ["유", "신"], avoid: ["미", "술", "오"] },
  인: { best: ["해", "오"], good: ["술", "묘"], avoid: ["신", "사", "해"] },
  묘: { best: ["술", "해"], good: ["미", "인"], avoid: ["유", "자", "진"] },
  진: { best: ["유", "자"], good: ["신", "축"], avoid: ["술", "묘", "진"] },
  사: { best: ["신", "축"], good: ["유", "자"], avoid: ["해", "인", "사"] },
  오: { best: ["미", "인"], good: ["술", "해"], avoid: ["자", "축", "오"] },
  미: { best: ["오", "묘"], good: ["해", "인"], avoid: ["축", "자", "술"] },
  신: { best: ["사", "자"], good: ["진", "축"], avoid: ["인", "해", "신"] },
  유: { best: ["진", "축"], good: ["사", "자"], avoid: ["묘", "술", "유"] },
  술: { best: ["묘", "인"], good: ["오", "미"], avoid: ["진", "유", "축"] },
  해: { best: ["인", "묘"], good: ["미", "오"], avoid: ["사", "신", "해"] }
};

// ============================================
// 신강신약별 연애 성향 상수 (5오행 × 3신강신약 = 15조합)
// ============================================

const LOVE_STRENGTH_NARRATIVES: Record<FiveElement, Record<StrengthType, {
  style: string;
  attraction: string;
  approach: string;
  relationship: string;
  warnings: string;
  advice: string;
}>> = {
  wood: {
    신강: {
      style: "목 기운이 강한 신강 사주는 연애에서도 주도적이고 진취적인 모습을 보입니다. 자신만의 확고한 연애관이 있으며, 상대방을 이끌어가려는 성향이 강합니다. 목표 지향적인 연애를 하며, 상대방과 함께 성장하는 관계를 추구합니다. 자존심이 강해 먼저 다가가는 것을 어려워할 수 있으나, 한번 마음을 정하면 적극적으로 밀어붙이는 추진력이 있습니다.",
      attraction: "신강 목 일간은 자신감 넘치고 독립적인 사람에게 끌립니다. 지적이고 비전이 있으며, 함께 성장할 수 있는 파트너를 원합니다. 무기력하거나 의존적인 사람에게는 매력을 느끼지 못하며, 자신만의 목표와 꿈이 있는 사람에게 강하게 끌립니다. 외모보다는 내면의 가치관과 성장 가능성을 중시합니다.",
      approach: "신강 목 일간은 연애할 때 계획적이고 전략적으로 접근합니다. 먼저 상대방을 관찰하고 분석한 후, 확신이 들면 적극적으로 다가갑니다. 데이트도 의미 있는 활동 위주로 계획하며, 단순히 시간을 보내기보다 함께 배우고 경험하는 것을 선호합니다. 자신의 비전을 공유하고 상대방의 꿈을 응원하는 방식으로 사랑을 표현합니다.",
      relationship: "관계에서 리더 역할을 자연스럽게 맡으며, 중요한 결정은 본인이 주도하려 합니다. 상대방의 성장을 진심으로 응원하지만, 때로는 자신의 기준을 강요할 수 있습니다. 갈등 상황에서는 논리적으로 해결하려 하나, 자존심 때문에 먼저 화해하기 어려워합니다. 장기적인 관계를 선호하며, 미래를 함께 계획하는 것을 중요하게 여깁니다.",
      warnings: "지나친 주도성이 상대방을 숨막히게 할 수 있습니다. 자신의 기준만 옳다고 생각하거나, 상대방의 의견을 무시하는 경향을 조심해야 합니다. 자존심 싸움으로 관계가 악화될 수 있으며, 상대방도 성장할 시간이 필요함을 인정해야 합니다.",
      advice: "귀하는 강한 에너지와 비전을 가진 연인입니다. 이 에너지를 상대방을 끌어올리는 데 사용하되, 상대의 속도도 존중하세요. 때로는 한 발 물러나 상대방이 주도하게 해주는 여유가 더 좋은 관계를 만듭니다. 자존심보다 관계가 소중함을 기억하고, 먼저 손 내미는 용기를 가지세요."
    },
    신약: {
      style: "목 기운이 약한 신약 사주는 연애에서 섬세하고 배려심 깊은 모습을 보입니다. 상대방의 감정과 필요를 잘 캐치하며, 조화로운 관계를 추구합니다. 다만 자신의 의견을 표현하는 것이 어려울 수 있고, 상대방에게 맞추다 보면 자신을 잃을 수 있습니다. 눈치가 빠르고 상대방의 기분을 잘 맞춰주는 타입입니다.",
      attraction: "신약 목 일간은 안정감 있고 든든한 사람에게 끌립니다. 자신을 지지해주고 응원해주는 파트너를 원하며, 지나치게 강압적인 사람에게는 부담을 느낍니다. 다정하고 따뜻한 사람, 자신의 꿈을 인정해주는 사람에게 마음을 엽니다. 함께 있으면 편안함을 느끼는 사람을 선호합니다.",
      approach: "신약 목 일간은 연애할 때 조심스럽고 신중하게 접근합니다. 먼저 다가가기보다 상대방의 신호를 기다리며, 거절에 대한 두려움이 있습니다. 은근히 관심을 표현하거나, 친구로 시작해 연인으로 발전하는 패턴을 선호합니다. 말보다는 행동으로 마음을 표현하며, 작은 배려로 사랑을 전합니다.",
      relationship: "관계에서 화합과 조화를 중시하며, 갈등을 피하려는 경향이 있습니다. 상대방의 의견을 존중하지만, 자신의 생각을 표현하지 못해 불만이 쌓일 수 있습니다. 헌신적인 연인이지만, 너무 맞추다 보면 상대방이 귀하를 당연시할 수 있습니다. 안정적인 관계를 원하며, 변화보다는 익숙함을 선호합니다.",
      warnings: "자신의 욕구와 의견을 억누르다 갑자기 폭발할 수 있습니다. 상대방에게 너무 맞추면 자존감이 떨어지고, 관계의 균형이 무너질 수 있습니다. 갈등을 피하다 문제가 커질 수 있으며, 때로는 불편한 대화도 필요합니다.",
      advice: "귀하의 배려심과 섬세함은 큰 장점입니다. 하지만 좋은 관계는 서로의 의견을 나눌 때 만들어집니다. 귀하의 생각과 감정도 중요하니, 용기를 내어 표현해 보세요. 상대방이 귀하를 존중하지 않는다면 그것은 좋은 관계가 아닙니다. 자신의 가치를 알고 당당히 사랑받으시길 바랍니다."
    },
    중화: {
      style: "목 기운이 조화로운 중화 사주는 연애에서 균형 잡힌 모습을 보입니다. 주도할 때는 주도하고, 양보할 때는 양보하는 유연성이 있습니다. 상대방과 동등한 파트너십을 추구하며, 함께 성장하는 관계를 자연스럽게 만들어갑니다. 자신의 비전도 있지만 상대방의 꿈도 존중하는 성숙한 연애를 합니다.",
      attraction: "중화 목 일간은 균형 감각이 있고 성숙한 사람에게 끌립니다. 지나치게 의존적이거나 지나치게 독립적인 사람보다, 적절한 거리를 유지하면서도 친밀할 수 있는 사람을 선호합니다. 자신만의 영역이 있으면서도 함께하는 시간을 소중히 여기는 파트너를 원합니다.",
      approach: "중화 목 일간은 연애할 때 자연스럽게 접근합니다. 관심이 있으면 적절히 표현하되 부담스럽지 않게, 기다릴 때와 다가갈 때를 잘 구분합니다. 상대방의 반응을 보며 속도를 조절하는 센스가 있으며, 억지스럽지 않은 만남을 선호합니다. 대화를 통해 서로를 알아가는 과정을 즐깁니다.",
      relationship: "관계에서 동등한 파트너십을 자연스럽게 형성합니다. 서로의 영역을 존중하면서도 함께하는 시간을 소중히 여깁니다. 갈등 상황에서는 대화로 해결하려 하며, 일방적인 희생보다 상호 양보를 추구합니다. 장기적으로 안정적인 관계를 유지하는 능력이 있습니다.",
      warnings: "때로는 결단력이 부족해 보일 수 있습니다. 모든 것을 조율하려다 정작 중요한 결정을 미루거나, 양쪽 모두를 만족시키려다 어느 쪽도 만족시키지 못할 수 있습니다. 필요할 때는 명확한 입장을 취하는 것도 중요합니다.",
      advice: "귀하의 균형 감각은 관계에서 큰 자산입니다. 이 능력을 활용해 건강한 관계를 만들어가시되, 때로는 과감한 결정도 필요함을 기억하세요. 모든 것을 완벽하게 조율하려 하지 말고, 때로는 흐름에 맡기는 여유도 가지시길 바랍니다."
    }
  },
  fire: {
    신강: {
      style: "화 기운이 강한 신강 사주는 연애에서 열정적이고 적극적인 모습을 보입니다. 사랑에 빠지면 불꽃처럼 타오르며, 감정 표현에 거침이 없습니다. 연애 자체를 즐기는 타입이며, 상대방을 기쁘게 해주고 싶어합니다. 매력적이고 카리스마 있어 이성에게 인기가 많지만, 식을 때는 빠르게 식을 수 있습니다.",
      attraction: "신강 화 일간은 밝고 에너지 넘치는 사람에게 끌립니다. 함께 있으면 즐겁고, 삶을 즐길 줄 아는 파트너를 원합니다. 무덤덤하거나 감정 표현이 적은 사람에게는 답답함을 느끼며, 적극적으로 반응해주는 사람에게 더 매력을 느낍니다. 외모와 분위기를 중시하며, 화끈한 사랑을 원합니다.",
      approach: "신강 화 일간은 연애할 때 직진형입니다. 마음에 드는 사람이 있으면 적극적으로 다가가며, 밀당보다 솔직한 고백을 선호합니다. 로맨틱한 이벤트를 좋아하고, 상대방을 설레게 하는 것을 즐깁니다. 관심 표현에 주저함이 없으며, 거절당해도 쉽게 포기하지 않는 추진력이 있습니다.",
      relationship: "관계에서 드라마틱한 사랑을 추구합니다. 평범한 일상보다 특별한 순간들을 만들고 싶어하며, 상대방에게 많은 관심과 애정을 쏟습니다. 다만 감정 기복이 있을 수 있고, 화가 나면 격렬한 다툼으로 이어질 수 있습니다. 금방 화해하는 타입이지만, 순간적인 말실수에 주의가 필요합니다.",
      warnings: "열정이 식으면 갑자기 관계에 흥미를 잃을 수 있습니다. 새로운 자극을 계속 원하다 보면 오래된 관계가 지루하게 느껴질 수 있습니다. 순간적인 감정에 휩쓸려 후회할 말이나 행동을 할 수 있으며, 상대방의 감정을 배려하지 못할 수 있습니다.",
      advice: "귀하의 열정과 표현력은 연애에서 큰 매력입니다. 하지만 관계는 불꽃놀이가 아니라 모닥불 같아야 오래갑니다. 초반의 열정을 유지하려 무리하기보다, 차분하게 타오르는 사랑도 아름다움을 알아가시길 바랍니다. 화가 날 때 잠시 멈추고, 말하기 전에 한 번 더 생각해 보세요."
    },
    신약: {
      style: "화 기운이 약한 신약 사주는 연애에서 따뜻하고 다정한 모습을 보입니다. 열정이 겉으로 드러나지 않지만, 마음속에서는 깊이 사랑합니다. 표현이 서툴 수 있어 상대방이 사랑받는다고 느끼지 못할 수 있습니다. 조용히 헌신하는 타입이며, 안정적인 사랑을 추구합니다.",
      attraction: "신약 화 일간은 활발하고 밝은 사람에게 끌립니다. 자신이 표현하지 못하는 것을 대신해줄 수 있는 적극적인 파트너를 원합니다. 너무 조용하거나 무미건조한 사람보다, 생기를 불어넣어 줄 수 있는 사람에게 마음을 엽니다. 함께 있으면 에너지를 받는 느낌이 드는 사람을 선호합니다.",
      approach: "신약 화 일간은 연애할 때 수줍고 소극적으로 보일 수 있습니다. 마음이 있어도 먼저 다가가기 어렵고, 상대방이 다가와주기를 기다립니다. 표현은 서툴지만 행동으로 마음을 보여주며, 기다려주는 사람에게 마음을 엽니다. 시간을 두고 천천히 마음을 열어가는 타입입니다.",
      relationship: "관계에서 조용히 헌신하며, 상대방을 위해 많은 것을 참습니다. 갈등을 피하려 하고, 자신의 불만을 표현하지 못해 속으로 삭일 수 있습니다. 안정적인 관계를 원하지만, 때로는 변화와 새로움도 필요합니다. 상대방의 관심과 인정을 받을 때 더 빛나는 타입입니다.",
      warnings: "자신의 감정을 억누르다 갑자기 폭발할 수 있습니다. 상대방이 귀하의 마음을 몰라 서운할 수 있으며, 표현하지 않으면 사랑도 전해지지 않습니다. 너무 참기만 하면 관계의 불균형이 생길 수 있습니다.",
      advice: "귀하의 따뜻한 마음은 분명 존재합니다. 하지만 그 마음을 표현해야 상대방도 알 수 있습니다. 작은 것부터 시작해 보세요. '사랑해', '고마워' 같은 말 한마디가 관계를 더 따뜻하게 만듭니다. 귀하의 감정도 중요하니, 불편한 것은 부드럽게라도 표현하는 연습을 해보세요."
    },
    중화: {
      style: "화 기운이 조화로운 중화 사주는 연애에서 적절한 열정과 차분함을 함께 보여줍니다. 필요할 때는 뜨겁게, 필요할 때는 차분하게 감정을 조절할 줄 압니다. 상대방에게 충분한 관심과 애정을 표현하면서도, 지나치지 않은 균형을 유지합니다. 연애를 즐기면서도 안정적인 관계를 만들어갑니다.",
      attraction: "중화 화 일간은 다양한 매력을 가진 사람에게 끌립니다. 열정적이면서도 안정감 있는, 재미있으면서도 진지한 면이 있는 복합적인 매력의 소유자를 선호합니다. 극단적인 성격보다 균형 잡힌 사람에게 끌리며, 함께 성장할 수 있는 파트너를 원합니다.",
      approach: "중화 화 일간은 연애할 때 자연스럽게 다가갑니다. 상황에 맞게 적극적일 때와 기다릴 때를 구분하며, 억지스럽지 않은 만남을 선호합니다. 상대방의 반응을 보며 속도를 조절하고, 서로에게 부담이 되지 않는 방식으로 관계를 발전시킵니다.",
      relationship: "관계에서 열정과 안정의 균형을 잘 유지합니다. 특별한 날에는 로맨틱하게, 일상에서는 편안하게 함께합니다. 감정 표현도 적절하고, 갈등 상황에서도 감정적으로 대처하기보다 대화로 해결하려 합니다. 장기적으로 건강한 관계를 유지하는 능력이 있습니다.",
      warnings: "너무 균형을 잡으려다 열정이 부족하게 느껴질 수 있습니다. 때로는 예측 불가능한 서프라이즈나 뜨거운 감정 표현도 관계에 필요합니다. 모든 것을 적당히 하려다 특별함이 사라질 수 있습니다.",
      advice: "귀하의 균형 감각은 안정적인 관계의 토대입니다. 하지만 가끔은 통제를 놓고 순수한 열정에 빠져보는 것도 좋습니다. 계산되지 않은 사랑의 순간들이 관계를 더 특별하게 만들 수 있습니다. 때로는 바보 같아도 괜찮습니다."
    }
  },
  earth: {
    신강: {
      style: "토 기운이 강한 신강 사주는 연애에서 안정적이고 믿음직한 모습을 보입니다. 한번 시작한 관계를 오래 유지하며, 책임감 있게 상대방을 대합니다. 결혼을 염두에 둔 진지한 만남을 선호하고, 가벼운 연애보다 의미 있는 관계를 추구합니다. 말보다 행동으로 사랑을 증명하는 타입입니다.",
      attraction: "신강 토 일간은 진실되고 성실한 사람에게 끌립니다. 화려함보다 진정성, 말보다 행동으로 보여주는 사람을 선호합니다. 경제적으로 안정되어 있고, 미래에 대한 계획이 있는 사람에게 매력을 느낍니다. 가정적이고 책임감 있는 파트너를 원합니다.",
      approach: "신강 토 일간은 연애할 때 천천히 신중하게 접근합니다. 상대방을 오래 관찰하고 확신이 들면 진지하게 다가갑니다. 로맨틱한 표현보다 실질적인 도움을 주는 방식으로 마음을 보여주며, 약속을 지키고 꾸준히 연락하는 것으로 신뢰를 쌓습니다.",
      relationship: "관계에서 든든한 버팀목 역할을 합니다. 어려울 때 함께하고, 경제적으로도 정서적으로도 안정감을 줍니다. 다만 변화를 싫어해 관계가 정체될 수 있고, 고집이 세서 상대방의 의견을 받아들이기 어려울 수 있습니다. 장기적인 관계에서 더 빛나는 타입입니다.",
      warnings: "지나친 안정 추구가 관계를 지루하게 만들 수 있습니다. 변화를 두려워하면 성장이 멈추고, 고집을 부리면 소통이 막힙니다. 실용성만 강조하다 로맨스가 사라질 수 있으며, 감정 표현의 부족으로 상대방이 서운할 수 있습니다.",
      advice: "귀하의 안정감과 신뢰성은 관계의 기반입니다. 하지만 때로는 변화도, 로맨스도 필요합니다. 가끔은 계획에 없던 데이트도 하고, 깜짝 선물도 해보세요. 상대방에게 사랑한다고 말로도 표현해 주세요. 마음으로만 느끼면 상대방은 알 수 없습니다."
    },
    신약: {
      style: "토 기운이 약한 신약 사주는 연애에서 순응적이고 맞춰주는 모습을 보입니다. 상대방의 필요를 잘 채워주고, 갈등을 피하려 합니다. 다만 자신의 의견을 내세우지 못해 관계에서 밀리기 쉽고, 상대방에게 휘둘릴 수 있습니다. 안정적인 관계를 원하지만, 주도권을 상대에게 맡기는 경향이 있습니다.",
      attraction: "신약 토 일간은 리더십 있고 결단력 있는 사람에게 끌립니다. 자신을 이끌어줄 수 있는 든든한 파트너를 원하며, 보호받는 느낌을 주는 사람에게 마음을 엽니다. 너무 우유부단한 사람보다, 명확한 방향성이 있는 사람을 선호합니다.",
      approach: "신약 토 일간은 연애할 때 수동적으로 보일 수 있습니다. 먼저 다가가기보다 상대방의 관심을 기다리며, 호의에 순응하는 방식으로 관계가 시작됩니다. 자신보다 상대방의 편의를 먼저 생각하고, 맞춰주는 것으로 사랑을 표현합니다.",
      relationship: "관계에서 서포터 역할을 잘합니다. 상대방을 위해 많은 것을 양보하고 맞춰주지만, 자신의 욕구는 뒤로 미룹니다. 갈등을 피하려 참다 보면 불만이 쌓이고, 관계의 불균형이 생길 수 있습니다. 안정적인 관계를 원하지만, 스스로 만들어가기보다 상대방에게 의존하는 경향이 있습니다.",
      warnings: "너무 맞춰주기만 하면 상대방이 당연시하게 됩니다. 자신의 의견이 없는 것처럼 보여 매력이 떨어질 수 있고, 참다가 폭발하면 관계가 한순간에 무너질 수 있습니다. 자존감을 잃지 않는 것이 중요합니다.",
      advice: "귀하의 배려심과 순응성은 관계를 부드럽게 합니다. 하지만 좋은 관계는 일방적인 희생 위에 세워지지 않습니다. 귀하의 의견과 필요도 중요하니 용기를 내어 표현하세요. 상대방이 귀하를 존중하지 않는다면, 그 관계가 정말 안정적인 것인지 돌아보시길 바랍니다."
    },
    중화: {
      style: "토 기운이 조화로운 중화 사주는 연애에서 안정과 유연함을 함께 보여줍니다. 믿음직하면서도 변화에 적응하고, 실용적이면서도 로맨스를 즐깁니다. 상대방과 균형 잡힌 관계를 만들어가며, 서로의 역할을 자연스럽게 분담합니다. 장기적으로 안정적인 관계를 유지하는 능력이 있습니다.",
      attraction: "중화 토 일간은 균형 잡힌 사람에게 끌립니다. 안정감이 있으면서도 재미있고, 현실적이면서도 꿈이 있는 파트너를 원합니다. 극단적인 성격보다 조화로운 사람을 선호하며, 함께 현실적인 미래를 계획할 수 있는 사람에게 매력을 느낍니다.",
      approach: "중화 토 일간은 연애할 때 자연스럽고 진정성 있게 다가갑니다. 과하지도 부족하지도 않게 관심을 표현하며, 상대방과 신뢰를 쌓아가는 과정을 중시합니다. 실용적인 도움과 정서적인 지지를 함께 제공하며 사랑을 표현합니다.",
      relationship: "관계에서 파트너십을 중시합니다. 서로의 역할을 인정하고, 함께 의사결정을 합니다. 안정적인 일상을 만들어가면서도 가끔은 특별한 순간들을 계획합니다. 갈등 상황에서는 실용적인 해결책을 찾으려 하며, 장기적인 관점에서 관계를 바라봅니다.",
      warnings: "때로는 너무 현실적으로 보여 로맨스가 부족하게 느껴질 수 있습니다. 모든 것을 계획하고 통제하려 하면 자발성이 사라질 수 있습니다. 균형을 잡으려다 결단을 미루거나, 어느 쪽에도 강하게 헌신하지 않는 것처럼 보일 수 있습니다.",
      advice: "귀하의 균형 감각은 건강한 관계의 기반입니다. 이 장점을 살려 안정적이면서도 따뜻한 관계를 만들어가세요. 때로는 계획 없이 즉흥적인 것도 즐기고, 실용성보다 순수한 감정에 집중하는 순간도 만들어보세요."
    }
  },
  metal: {
    신강: {
      style: "금 기운이 강한 신강 사주는 연애에서 명확하고 원칙적인 모습을 보입니다. 자신만의 연애 기준이 확고하며, 그 기준에 맞지 않으면 쉽게 마음을 열지 않습니다. 깔끔하고 세련된 연애를 추구하며, 감정보다 이성적 판단을 중시합니다. 쿨한 매력이 있지만, 차갑게 느껴질 수 있습니다.",
      attraction: "신강 금 일간은 깔끔하고 지적인 사람에게 끌립니다. 자기 관리가 철저하고, 논리적이며, 자신만의 기준이 있는 사람을 선호합니다. 지저분하거나 우유부단한 사람에게는 매력을 느끼지 못하며, 존경할 수 있는 점이 있는 파트너를 원합니다.",
      approach: "신강 금 일간은 연애할 때 신중하고 계산적으로 보일 수 있습니다. 감정적으로 휘둘리기보다 상대방을 냉정하게 평가하며, 기준에 부합해야 관심을 보입니다. 다가가는 방식도 깔끔하고 명확하며, 애매한 관계를 싫어합니다. 의도와 목적을 분명히 합니다.",
      relationship: "관계에서 경계를 명확히 합니다. 서로의 공간과 시간을 존중하며, 지나친 간섭을 싫어합니다. 약속은 반드시 지키고, 상대방에게도 같은 기준을 요구합니다. 깊은 애정이 있어도 표현이 절제되어 차갑게 느껴질 수 있습니다. 신뢰를 중시하며, 배신은 용서하기 어렵습니다.",
      warnings: "지나친 원칙주의가 관계를 경직시킬 수 있습니다. 비판적인 태도가 상대방에게 상처를 줄 수 있고, 감정 표현의 부족으로 사랑받지 못한다고 느끼게 할 수 있습니다. 완벽을 추구하다 어느 누구도 만족시키지 못할 수 있습니다.",
      advice: "귀하의 명확함과 기준은 좋은 관계의 기반이 될 수 있습니다. 하지만 사람은 완벽하지 않고, 관계도 마찬가지입니다. 때로는 기준을 유연하게 적용하고, 감정적으로 연결되는 경험도 필요합니다. 사랑한다면 말과 행동으로도 표현해 주세요. 마음으로만 느끼는 사랑은 상대방에게 닿지 않습니다."
    },
    신약: {
      style: "금 기운이 약한 신약 사주는 연애에서 섬세하고 예민한 모습을 보입니다. 상대방의 반응에 민감하고, 거절에 대한 두려움이 있습니다. 내면에는 명확한 기준이 있지만 표현하지 못하고, 상대방에게 맞추려다 자신의 가치관과 충돌할 수 있습니다. 완벽한 사랑을 꿈꾸지만 현실과의 괴리에 힘들어합니다.",
      attraction: "신약 금 일간은 따뜻하고 수용적인 사람에게 끌립니다. 자신의 섬세함을 이해해주고, 있는 그대로 받아들여주는 파트너를 원합니다. 비판적이거나 거칠은 사람에게는 마음을 닫으며, 안전하게 느껴지는 사람에게 천천히 마음을 엽니다.",
      approach: "신약 금 일간은 연애할 때 조심스럽고 방어적입니다. 상처받을까 봐 먼저 다가가기 어렵고, 상대방의 호의가 확실해야 마음을 엽니다. 완벽하게 준비된 느낌이 들어야 고백하며, 거절을 견디기 힘들어합니다. 친구로 시작해 천천히 발전하는 관계를 선호합니다.",
      relationship: "관계에서 상대방의 반응에 예민합니다. 작은 말이나 행동에도 많은 의미를 부여하고, 오해가 생기기 쉽습니다. 내면의 기준과 상대방의 기대 사이에서 갈등하며, 자신의 생각을 표현하지 못해 오해가 쌓일 수 있습니다. 깊은 신뢰가 쌓이면 헌신적인 연인이 됩니다.",
      warnings: "지나친 예민함이 관계를 피곤하게 할 수 있습니다. 모든 것을 분석하고 의미를 찾으려 하면 자발성이 사라집니다. 완벽한 관계를 원하다 현실의 관계에 만족하지 못할 수 있습니다.",
      advice: "귀하의 섬세함은 상대방을 깊이 이해할 수 있는 능력입니다. 하지만 그 예민함이 자신을 지치게 하지 않도록 주의하세요. 모든 것이 완벽할 필요 없습니다. 작은 불완전함도 수용하고, 상대방의 말과 행동을 너무 깊게 분석하지 마세요. 때로는 흘려보내는 여유도 필요합니다."
    },
    중화: {
      style: "금 기운이 조화로운 중화 사주는 연애에서 명확하면서도 유연한 모습을 보입니다. 자신의 기준이 있지만 상대방에 따라 조율할 줄 알고, 이성적이면서도 감정적 교류를 즐깁니다. 세련되고 품격 있는 연애를 추구하면서도, 따뜻함을 잃지 않습니다. 균형 잡힌 관계를 만들어갑니다.",
      attraction: "중화 금 일간은 교양 있고 균형 잡힌 사람에게 끌립니다. 지적이면서도 따뜻하고, 자기 관리가 되면서도 유연한 파트너를 원합니다. 극단적인 성격보다 조화로운 사람을 선호하며, 서로 존중하며 성장할 수 있는 관계를 추구합니다.",
      approach: "중화 금 일간은 연애할 때 자연스럽고 품격 있게 다가갑니다. 과하지 않게 관심을 표현하면서도 진심을 전달하며, 상대방의 반응에 따라 속도를 조절합니다. 깔끔하고 명확한 의사소통을 하면서도, 감정적인 연결도 중시합니다.",
      relationship: "관계에서 상호 존중을 중시합니다. 서로의 공간을 존중하면서도 친밀한 시간을 만들고, 이성과 감성의 균형을 유지합니다. 문제가 생기면 논리적으로 대화하되 감정도 고려합니다. 장기적으로 성숙한 관계를 만들어가는 능력이 있습니다.",
      warnings: "균형을 잡으려다 열정이 부족해 보일 수 있습니다. 항상 품격을 유지하려 하면 진솔한 감정 표현이 어려울 수 있습니다. 때로는 체면을 버리고 솔직해지는 것도 필요합니다.",
      advice: "귀하의 균형 감각과 품격은 성숙한 관계의 기반입니다. 이 장점을 살려 서로 존중하는 아름다운 관계를 만들어가세요. 하지만 가끔은 완벽하지 않은 모습을 보여줘도 괜찮습니다. 진솔한 감정이 오히려 관계를 더 깊게 만들 수 있습니다."
    }
  },
  water: {
    신강: {
      style: "수 기운이 강한 신강 사주는 연애에서 깊이 있고 지혜로운 모습을 보입니다. 감정의 깊이가 있어 한번 사랑에 빠지면 깊게 빠지며, 상대방을 깊이 이해하려 합니다. 통찰력이 있어 상대방의 마음을 잘 읽지만, 때로는 너무 많이 생각해 행동으로 옮기지 못할 수 있습니다. 신비로운 매력이 있습니다.",
      attraction: "신강 수 일간은 깊이 있고 지적인 사람에게 끌립니다. 피상적인 대화보다 영혼을 나눌 수 있는 깊은 대화를 할 수 있는 파트너를 원합니다. 신비롭거나 독특한 매력이 있는 사람, 자신만의 세계가 있는 사람에게 강하게 끌립니다. 겉모습보다 내면의 깊이를 중시합니다.",
      approach: "신강 수 일간은 연애할 때 관찰하고 분석하는 시간이 깁니다. 상대방을 파악한 후 전략적으로 접근하며, 은밀하게 관심을 표현합니다. 직접적인 고백보다 분위기를 만들어가며, 상대방이 먼저 다가오게 유도하기도 합니다. 미스터리한 매력으로 상대를 끌어당깁니다.",
      relationship: "관계에서 깊은 정서적 교류를 추구합니다. 표면적인 관계에 만족하지 못하고, 영혼의 동반자 같은 깊은 연결을 원합니다. 상대방의 마음을 읽는 능력이 뛰어나지만, 그만큼 많은 것을 기대하게 됩니다. 비밀을 공유하고 깊은 신뢰를 쌓아가는 관계를 만듭니다.",
      warnings: "너무 깊게 생각하다 행동하지 못할 수 있습니다. 상대방의 마음을 읽으려다 실제와 다른 해석을 할 수 있고, 자신만의 상상에 빠질 수 있습니다. 모든 것을 알려고 하면 상대방이 부담스러워할 수 있습니다.",
      advice: "귀하의 깊이와 통찰력은 진정한 사랑을 할 수 있는 능력입니다. 하지만 생각만 하지 말고 행동으로 옮기는 용기도 필요합니다. 상대방의 모든 것을 알려고 하기보다, 시간을 두고 자연스럽게 알아가세요. 때로는 생각을 멈추고 현재의 순간을 느끼는 것도 중요합니다."
    },
    신약: {
      style: "수 기운이 약한 신약 사주는 연애에서 감성적이고 순응적인 모습을 보입니다. 감정에 휩쓸리기 쉽고, 상대방에게 맞추다 자신을 잃을 수 있습니다. 로맨틱한 사랑을 꿈꾸지만 현실과의 괴리에 힘들어할 수 있습니다. 사랑에 의존적이 될 수 있으며, 혼자 있는 것을 두려워합니다.",
      attraction: "신약 수 일간은 안정감 있고 방향성이 명확한 사람에게 끌립니다. 자신을 이끌어줄 수 있는 강한 파트너를 원하며, 혼란스러울 때 중심을 잡아줄 수 있는 사람에게 마음을 엽니다. 보호받는 느낌을 주는 사람, 결단력 있는 사람을 선호합니다.",
      approach: "신약 수 일간은 연애할 때 흐름에 따라가는 경향이 있습니다. 적극적으로 다가가기보다 상대방의 리드를 따르며, 분위기에 순응합니다. 거절이 두려워 명확한 표현을 피하고, 상대방의 신호를 기다립니다. 로맨틱한 상황에서 마음을 열기 쉽습니다.",
      relationship: "관계에서 상대방에게 많이 의존합니다. 감정적으로 연결되는 것을 중요하게 여기며, 상대방 없이는 불안함을 느낍니다. 헌신적인 연인이지만, 자신의 의견이 없어 보이거나 너무 맞추다 보면 매력이 떨어질 수 있습니다. 이별에 매우 취약합니다.",
      warnings: "지나친 감정 의존이 관계를 불건강하게 만들 수 있습니다. 상대방 없이는 살 수 없다는 마음이 집착으로 보일 수 있고, 상대방에게 부담이 됩니다. 자신의 정체성을 유지하는 것이 중요합니다.",
      advice: "귀하의 감성과 헌신은 아름다운 사랑의 요소입니다. 하지만 건강한 관계는 두 사람 모두 독립적일 때 가능합니다. 연인이 전부가 아니라, 귀하의 삶에서 중요한 한 부분임을 기억하세요. 자신만의 취미, 친구, 목표를 가지고 당당하게 살아가세요. 그것이 오히려 관계를 더 건강하게 만듭니다."
    },
    중화: {
      style: "수 기운이 조화로운 중화 사주는 연애에서 깊이와 유연함을 함께 보여줍니다. 감정적 교류를 중시하면서도 이성적 판단을 잃지 않습니다. 상대방을 이해하려 노력하면서도 자신을 잃지 않으며, 균형 잡힌 사랑을 합니다. 직관과 논리를 함께 사용해 관계를 발전시킵니다.",
      attraction: "중화 수 일간은 깊이 있으면서도 균형 잡힌 사람에게 끌립니다. 감성적이면서도 현실적이고, 깊이 있으면서도 유연한 파트너를 원합니다. 서로의 내면을 이해하며 성장할 수 있는 관계를 추구하며, 영혼의 동반자 같은 연결을 원합니다.",
      approach: "중화 수 일간은 연애할 때 자연스럽게 깊어지는 관계를 선호합니다. 의미 있는 대화를 통해 서로를 알아가며, 감정과 이성의 균형을 유지합니다. 상대방의 마음을 읽으면서도 자신의 감정도 솔직하게 표현합니다. 서두르지 않고 깊이 있는 관계를 만들어갑니다.",
      relationship: "관계에서 정서적 깊이와 실용적 균형을 함께 추구합니다. 깊은 대화와 감정 공유를 중시하면서도, 현실적인 문제도 함께 해결합니다. 상대방을 이해하려 노력하면서 자신의 경계도 유지합니다. 장기적으로 깊고 안정적인 관계를 만들어가는 능력이 있습니다.",
      warnings: "너무 깊이 들어가려다 가볍게 즐기는 순간을 놓칠 수 있습니다. 모든 관계에서 의미를 찾으려 하면 피곤해질 수 있습니다. 때로는 단순하게 즐기는 것도 필요합니다.",
      advice: "귀하의 깊이와 균형 감각은 진정한 파트너십을 만들 수 있는 능력입니다. 이 장점을 살려 영혼의 동반자를 찾아가세요. 하지만 가끔은 생각을 멈추고 순간을 즐기는 여유도 가지세요. 모든 순간이 깊어야 하는 것은 아닙니다. 가벼운 즐거움도 사랑의 일부입니다."
    }
  }
};

// ============================================
// 신강신약 키 변환 함수
// ============================================

function getStrengthKey(sinGangSinYak: string): StrengthType {
  if (sinGangSinYak === "신강") return "신강";
  if (sinGangSinYak === "신약") return "신약";
  return "중화";
}

// ============================================
// 일간 오행 추출
// ============================================

function getDayMasterElement(sajuResult: SajuApiResult): FiveElement {
  const stemElementMap: Record<HeavenlyStemKr, FiveElement> = {
    갑: "wood", 을: "wood",
    병: "fire", 정: "fire",
    무: "earth", 기: "earth",
    경: "metal", 신: "metal",
    임: "water", 계: "water"
  };

  const dayStem = sajuResult.dayPillar.cheongan as HeavenlyStemKr;
  return stemElementMap[dayStem] || "earth";
}

// ============================================
// 띠(지지) 추출
// ============================================

function getYearBranch(sajuResult: SajuApiResult): EarthlyBranchKr {
  return sajuResult.yearPillar.jiji as EarthlyBranchKr;
}

// ============================================
// 십신 분석
// ============================================

function getDominantSipsin(sajuResult: SajuApiResult): string {
  const sipsinCount: Record<string, number> = {
    비견: 0, 겁재: 0, 식신: 0, 상관: 0, 편재: 0,
    정재: 0, 편관: 0, 정관: 0, 편인: 0, 정인: 0
  };

  const dayStem = sajuResult.dayPillar.cheongan as string;
  const pillars = [
    sajuResult.yearPillar,
    sajuResult.monthPillar,
    sajuResult.dayPillar,
    sajuResult.timePillar
  ];

  const sipsinMap: Record<string, Record<string, string>> = {
    갑: { 갑: "비견", 을: "겁재", 병: "식신", 정: "상관", 무: "편재", 기: "정재", 경: "편관", 신: "정관", 임: "편인", 계: "정인" },
    을: { 을: "비견", 갑: "겁재", 정: "식신", 병: "상관", 기: "편재", 무: "정재", 신: "편관", 경: "정관", 계: "편인", 임: "정인" },
    병: { 병: "비견", 정: "겁재", 무: "식신", 기: "상관", 경: "편재", 신: "정재", 임: "편관", 계: "정관", 갑: "편인", 을: "정인" },
    정: { 정: "비견", 병: "겁재", 기: "식신", 무: "상관", 신: "편재", 경: "정재", 계: "편관", 임: "정관", 을: "편인", 갑: "정인" },
    무: { 무: "비견", 기: "겁재", 경: "식신", 신: "상관", 임: "편재", 계: "정재", 갑: "편관", 을: "정관", 병: "편인", 정: "정인" },
    기: { 기: "비견", 무: "겁재", 신: "식신", 경: "상관", 계: "편재", 임: "정재", 을: "편관", 갑: "정관", 정: "편인", 병: "정인" },
    경: { 경: "비견", 신: "겁재", 임: "식신", 계: "상관", 갑: "편재", 을: "정재", 병: "편관", 정: "정관", 무: "편인", 기: "정인" },
    신: { 신: "비견", 경: "겁재", 계: "식신", 임: "상관", 을: "편재", 갑: "정재", 정: "편관", 병: "정관", 기: "편인", 무: "정인" },
    임: { 임: "비견", 계: "겁재", 갑: "식신", 을: "상관", 병: "편재", 정: "정재", 무: "편관", 기: "정관", 경: "편인", 신: "정인" },
    계: { 계: "비견", 임: "겁재", 을: "식신", 갑: "상관", 정: "편재", 병: "정재", 기: "편관", 무: "정관", 신: "편인", 경: "정인" }
  };

  pillars.forEach(pillar => {
    if (!pillar) return;
    const stem = pillar.cheongan as string;
    const sipsin = sipsinMap[dayStem]?.[stem];
    if (sipsin && sipsinCount[sipsin] !== undefined) {
      sipsinCount[sipsin]++;
    }
  });

  const sorted = Object.entries(sipsinCount)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return sorted[0]?.[0] || "정재";
}

// ============================================
// 연애 스타일 분석
// ============================================

interface LoveStyle {
  type: string;
  description: string;
  attractionPoints: string[];
  turnOffs: string[];
}

function analyzeLoveStyle(
  dayMasterElement: FiveElement,
  dominantSipsin: string,
  gender: Gender
): LoveStyle {
  const elementStyle = ELEMENT_LOVE_STYLES[dayMasterElement];
  const sipsinStyle = SIPSIN_LOVE_STYLES[dominantSipsin];

  // 성별에 따른 십신 특성 선택
  const genderSpecificTrait = gender === "male"
    ? sipsinStyle?.male
    : sipsinStyle?.female;

  return {
    type: `${elementStyle.type} + ${dominantSipsin} 기질`,
    description: `${elementStyle.description} ${genderSpecificTrait || ""}`,
    attractionPoints: [...elementStyle.attractionPoints, ...(sipsinStyle?.commonTraits.slice(0, 2) || [])],
    turnOffs: elementStyle.turnOffs
  };
}

// ============================================
// 이상형 분석
// ============================================

interface IdealPartner {
  personality: string[];
  appearance: string;
  compatibility: {
    goodElements: FiveElement[];
    goodZodiac: string[];
  };
}

function analyzeIdealPartner(
  dayMasterElement: FiveElement,
  yearBranch: EarthlyBranchKr,
  dominantSipsin: string
): IdealPartner {
  // 상생 오행 찾기
  const elementRelations: Record<FiveElement, { generates: FiveElement; generatedBy: FiveElement }> = {
    wood: { generates: "fire", generatedBy: "water" },
    fire: { generates: "earth", generatedBy: "wood" },
    earth: { generates: "metal", generatedBy: "fire" },
    metal: { generates: "water", generatedBy: "earth" },
    water: { generates: "wood", generatedBy: "metal" }
  };

  const goodElements: FiveElement[] = [
    elementRelations[dayMasterElement].generatedBy, // 나를 생해주는 오행
    elementRelations[dayMasterElement].generates    // 내가 생하는 오행
  ];

  // 띠 궁합
  const zodiacCompat = ZODIAC_COMPATIBILITY[yearBranch];
  const goodZodiac: string[] = [
    ...zodiacCompat.best.map(z => getZodiacName(z)),
    ...zodiacCompat.good.slice(0, 1).map(z => getZodiacName(z))
  ];

  // 십신별 이상형 특성
  const sipsinIdealTraits: Record<string, string[]> = {
    비견: ["자립적인", "동등한 위치의", "친구 같은"],
    겁재: ["매력적인", "경쟁심 자극하는", "강한"],
    식신: ["따뜻한", "요리 잘하는", "편안한"],
    상관: ["창의적인", "자유로운", "개성 있는"],
    편재: ["활동적인", "사교적인", "매력적인"],
    정재: ["안정적인", "신뢰할 수 있는", "성실한"],
    편관: ["카리스마 있는", "주도적인", "강인한"],
    정관: ["품격 있는", "예의 바른", "신사적인"],
    편인: ["독특한", "깊이 있는", "지적인"],
    정인: ["지적인", "배움 있는", "교양 있는"]
  };

  // 오행별 외모 경향
  const elementAppearance: Record<FiveElement, string> = {
    wood: "키가 크고 균형 잡힌 체형, 맑은 눈빛, 단정한 스타일을 가진 사람에게 끌립니다.",
    fire: "밝고 화사한 인상, 활기찬 분위기, 세련된 패션 감각을 가진 사람에게 끌립니다.",
    earth: "안정감 있는 체형, 온화한 인상, 편안한 분위기를 풍기는 사람에게 끌립니다.",
    metal: "깔끔하고 단정한 외모, 지적인 인상, 세련된 분위기를 가진 사람에게 끌립니다.",
    water: "신비로운 분위기, 깊이 있는 눈빛, 유연하고 부드러운 인상의 사람에게 끌립니다."
  };

  return {
    personality: sipsinIdealTraits[dominantSipsin] || sipsinIdealTraits["정재"],
    appearance: elementAppearance[dayMasterElement],
    compatibility: {
      goodElements,
      goodZodiac
    }
  };
}

function getZodiacName(branch: EarthlyBranchKr): string {
  const zodiacNames: Record<EarthlyBranchKr, string> = {
    자: "쥐띠", 축: "소띠", 인: "호랑이띠", 묘: "토끼띠",
    진: "용띠", 사: "뱀띠", 오: "말띠", 미: "양띠",
    신: "원숭이띠", 유: "닭띠", 술: "개띠", 해: "돼지띠"
  };
  return zodiacNames[branch];
}

// ============================================
// 연애 경고 분석
// ============================================

interface LoveWarnings {
  blindSpots: string[];
  conflictPatterns: string[];
  advice: string;
}

function analyzeLoveWarnings(
  dayMasterElement: FiveElement,
  dominantSipsin: string,
  sinGangSinYak: string
): LoveWarnings {
  const elementWarnings: Record<FiveElement, { blindSpot: string; conflict: string }> = {
    wood: {
      blindSpot: "상대의 의견보다 자신의 성장을 우선시할 수 있음",
      conflict: "자존심 싸움으로 갈등이 확대될 수 있음"
    },
    fire: {
      blindSpot: "감정에 휩쓸려 과도한 기대를 할 수 있음",
      conflict: "순간적인 분노로 후회할 말을 할 수 있음"
    },
    earth: {
      blindSpot: "변화를 두려워해 관계가 정체될 수 있음",
      conflict: "고집으로 인해 대화가 막힐 수 있음"
    },
    metal: {
      blindSpot: "감정 표현이 인색해 오해받을 수 있음",
      conflict: "비판적 태도로 상대에게 상처를 줄 수 있음"
    },
    water: {
      blindSpot: "감정에 빠져 현실을 놓칠 수 있음",
      conflict: "우유부단함으로 결정 장애가 올 수 있음"
    }
  };

  const sipsinWarnings: Record<string, string> = {
    비견: "경쟁심이 관계를 해칠 수 있습니다",
    겁재: "질투심과 소유욕을 조절하세요",
    식신: "지나친 편안함이 매력을 잃게 할 수 있습니다",
    상관: "너무 솔직한 말이 상처가 될 수 있습니다",
    편재: "여러 이성에 대한 관심을 조심하세요",
    정재: "지나친 현실성이 로맨스를 죽일 수 있습니다",
    편관: "지배하려는 태도를 조심하세요",
    정관: "지나친 원칙이 관계를 경직시킬 수 있습니다",
    편인: "현실과 동떨어진 기대를 조심하세요",
    정인: "가르치려 하지 말고 들어주세요"
  };

  const elemWarning = elementWarnings[dayMasterElement];

  let advice = "";
  if (sinGangSinYak === "신강") {
    advice = "자신감은 좋지만, 상대의 의견과 감정에도 귀 기울이세요. 관계는 혼자 이끄는 것이 아닙니다.";
  } else if (sinGangSinYak === "신약") {
    advice = "상대에게 맞추느라 자신을 잃지 마세요. 당신의 가치를 알고 당당하게 표현하세요.";
  } else {
    advice = "균형 잡힌 관계를 유지하고 있습니다. 지금처럼 서로 존중하며 사랑하세요.";
  }

  return {
    blindSpots: [elemWarning.blindSpot, sipsinWarnings[dominantSipsin] || ""],
    conflictPatterns: [elemWarning.conflict],
    advice
  };
}

// ============================================
// 매력 점수 분석
// ============================================

interface AttractionScore {
  charm: number;
  passion: number;
  stability: number;
  communication: number;
}

function analyzeAttractionScore(
  dayMasterElement: FiveElement,
  dominantSipsin: string,
  sinGangSinYak: string
): AttractionScore {
  // 기본 점수 60점
  const baseScore = 60;

  // 오행별 특화 점수
  const elementScores: Record<FiveElement, { charm: number; passion: number; stability: number; communication: number }> = {
    wood: { charm: 10, passion: 10, stability: 5, communication: 15 },
    fire: { charm: 20, passion: 25, stability: 0, communication: 10 },
    earth: { charm: 5, passion: 5, stability: 25, communication: 10 },
    metal: { charm: 10, passion: 5, stability: 15, communication: 5 },
    water: { charm: 15, passion: 15, stability: 5, communication: 20 }
  };

  // 십신별 보정
  const sipsinBonus: Record<string, { charm: number; passion: number; stability: number; communication: number }> = {
    비견: { charm: 0, passion: 5, stability: 5, communication: 5 },
    겁재: { charm: 5, passion: 15, stability: -5, communication: 0 },
    식신: { charm: 10, passion: 5, stability: 10, communication: 10 },
    상관: { charm: 15, passion: 10, stability: -5, communication: 5 },
    편재: { charm: 10, passion: 10, stability: 0, communication: 5 },
    정재: { charm: 0, passion: 0, stability: 20, communication: 5 },
    편관: { charm: 5, passion: 15, stability: 5, communication: 0 },
    정관: { charm: 0, passion: 0, stability: 15, communication: 10 },
    편인: { charm: 10, passion: 5, stability: 0, communication: 5 },
    정인: { charm: 5, passion: 0, stability: 10, communication: 15 }
  };

  const elemScore = elementScores[dayMasterElement];
  const sipsinScore = sipsinBonus[dominantSipsin] || sipsinBonus["정재"];

  // 신강/신약 보정
  let sinBonus = { charm: 0, passion: 0, stability: 0, communication: 0 };
  if (sinGangSinYak === "신강") {
    sinBonus = { charm: 5, passion: 5, stability: 0, communication: -5 };
  } else if (sinGangSinYak === "신약") {
    sinBonus = { charm: 0, passion: -5, stability: 5, communication: 5 };
  }

  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  return {
    charm: clamp(baseScore + elemScore.charm + sipsinScore.charm + sinBonus.charm),
    passion: clamp(baseScore + elemScore.passion + sipsinScore.passion + sinBonus.passion),
    stability: clamp(baseScore + elemScore.stability + sipsinScore.stability + sinBonus.stability),
    communication: clamp(baseScore + elemScore.communication + sipsinScore.communication + sinBonus.communication)
  };
}

// ============================================
// 오행 한글명
// ============================================

const ELEMENT_NAMES_KR: Record<FiveElement, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)"
};

// ============================================
// Narrative 생성 함수
// ============================================

/**
 * 연애 성향 서술형 Narrative 생성
 */
function generateLoveNarrative(
  loveStyle: LoveStyle,
  idealPartner: IdealPartner,
  loveWarnings: LoveWarnings,
  attractionScore: AttractionScore,
  dayMasterElement: FiveElement,
  gender: Gender,
  sinGangSinYak: string
): Chapter12Result["narrative"] {
  // 신강신약별 상수 가져오기
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthNarrative = LOVE_STRENGTH_NARRATIVES[dayMasterElement]?.[strengthKey];

  // 도입부
  let intro = "이제 연애 성향에 대해 살펴보겠습니다. 사주에서 연애운을 보는 것은 단순히 '언제 만나느냐'를 보는 것이 아닙니다. ";
  intro += "귀하의 사주 구조 자체가 어떤 연애 스타일을 가지고 있는지, 어떤 사람에게 끌리는지, 관계에서 어떤 패턴을 보이는지를 알려줍니다.\n\n";
  intro += "이 분석은 성별과 관계 상태에 관계없이 적용되는 기본적인 연애 성향입니다.";

  // 본론: 연애 스타일
  let mainAnalysis = "【귀하의 연애 스타일】\n\n";
  mainAnalysis += `귀하의 연애 유형은 '${loveStyle.type}'입니다.\n\n`;
  mainAnalysis += `${loveStyle.description}\n\n`;

  // 일간 오행에 따른 연애 특성
  mainAnalysis += `일간이 ${ELEMENT_NAMES_KR[dayMasterElement]}인 귀하는 `;

  switch (dayMasterElement) {
    case "wood":
      mainAnalysis += "연인과 함께 성장하는 것을 중요하게 여깁니다. 상대가 정체되어 있으면 답답함을 느낄 수 있고, 서로 자극이 되는 관계를 원합니다.";
      break;
    case "fire":
      mainAnalysis += "사랑할 때 뜨겁게 사랑하는 타입입니다. 감정 표현에 적극적이고, 연애 자체를 즐깁니다. 다만 불같은 성격 때문에 다툼도 격렬할 수 있습니다.";
      break;
    case "earth":
      mainAnalysis += "천천히 믿음을 쌓아가는 연애를 합니다. 처음에는 다가가기 어려워 보일 수 있지만, 한번 마음을 주면 오래 가는 사랑을 합니다.";
      break;
    case "metal":
      mainAnalysis += "명확한 기준과 원칙을 가지고 연애합니다. 서로의 시간과 공간을 존중하며, 깊이 있는 관계를 추구합니다.";
      break;
    case "water":
      mainAnalysis += "깊은 감정적 교류를 추구합니다. 표면적인 관계보다는 영혼의 교류 같은 깊은 사랑을 원합니다. 감수성이 풍부하고 상대의 감정을 잘 읽습니다.";
      break;
  }
  mainAnalysis += "\n\n";

  // 매력 포인트
  mainAnalysis += "【귀하의 매력 포인트】\n\n";
  for (const point of loveStyle.attractionPoints) {
    mainAnalysis += `• ${point}\n`;
  }
  mainAnalysis += "\n";

  // 상대가 힘들어하는 부분
  mainAnalysis += "【상대가 힘들어할 수 있는 부분】\n\n";
  for (const turnOff of loveStyle.turnOffs) {
    mainAnalysis += `• ${turnOff}\n`;
  }
  mainAnalysis += "\n";

  // 신강신약별 연애 성향 추가
  if (strengthNarrative) {
    mainAnalysis += "【신강신약별 연애 성향 심층 분석】\n\n";
    mainAnalysis += `• 연애 스타일 특성\n${strengthNarrative.style}\n\n`;
    mainAnalysis += `• 끌리는 이성 유형\n${strengthNarrative.attraction}\n\n`;
    mainAnalysis += `• 연애 접근 방식\n${strengthNarrative.approach}\n\n`;
  }

  // 상세 분석
  const details: string[] = [];

  // 이상형 분석
  let idealDetail = "【귀하의 이상형】\n\n";
  idealDetail += "• 성격적으로 끌리는 타입\n";
  for (const personality of idealPartner.personality) {
    idealDetail += `  - ${personality}\n`;
  }
  idealDetail += "\n";
  idealDetail += "• 외모적으로 끌리는 타입\n";
  idealDetail += `  ${idealPartner.appearance}\n\n`;
  idealDetail += "• 궁합이 좋은 상대\n";
  idealDetail += `  - 오행: ${idealPartner.compatibility.goodElements.map(e => ELEMENT_NAMES_KR[e]).join(", ")} 일간을 가진 분\n`;
  idealDetail += `  - 띠: ${idealPartner.compatibility.goodZodiac.join(", ")}\n`;
  details.push(idealDetail);

  // 매력 점수
  let scoreDetail = "【연애 매력 분석】\n\n";
  scoreDetail += `• 매력도: ${attractionScore.charm}점 - `;
  scoreDetail += attractionScore.charm >= 80 ? "눈에 띄는 매력의 소유자입니다.\n" :
                 attractionScore.charm >= 60 ? "자연스러운 매력이 있습니다.\n" :
                 "내면의 매력을 더 표현해 보세요.\n";

  scoreDetail += `• 열정도: ${attractionScore.passion}점 - `;
  scoreDetail += attractionScore.passion >= 80 ? "뜨거운 사랑을 하는 타입입니다.\n" :
                 attractionScore.passion >= 60 ? "적당한 열정을 유지합니다.\n" :
                 "감정 표현을 좀 더 적극적으로 해보세요.\n";

  scoreDetail += `• 안정감: ${attractionScore.stability}점 - `;
  scoreDetail += attractionScore.stability >= 80 ? "믿음직한 연인입니다.\n" :
                 attractionScore.stability >= 60 ? "안정과 변화의 균형을 유지합니다.\n" :
                 "관계에서 일관성을 보여주면 좋습니다.\n";

  scoreDetail += `• 소통력: ${attractionScore.communication}점 - `;
  scoreDetail += attractionScore.communication >= 80 ? "대화가 잘 통하는 연인입니다.\n" :
                 attractionScore.communication >= 60 ? "소통에 큰 문제가 없습니다.\n" :
                 "상대의 말에 더 귀 기울여 보세요.\n";
  details.push(scoreDetail);

  // 신강신약별 관계 패턴 및 조언
  if (strengthNarrative) {
    let strengthDetail = "【신강신약별 관계 패턴 및 조언】\n\n";
    strengthDetail += `• 관계에서의 패턴\n${strengthNarrative.relationship}\n\n`;
    strengthDetail += `• 주의해야 할 점\n${strengthNarrative.warnings}\n\n`;
    strengthDetail += `• 연애 조언\n${strengthNarrative.advice}`;
    details.push(strengthDetail);
  }

  // 조언
  let advice = "【연애에서 주의할 점】\n\n";

  if (loveWarnings.blindSpots.length > 0) {
    advice += "• 연애의 맹점\n";
    for (const blindSpot of loveWarnings.blindSpots.filter(Boolean)) {
      advice += `  - ${blindSpot}\n`;
    }
    advice += "\n";
  }

  if (loveWarnings.conflictPatterns.length > 0) {
    advice += "• 갈등 패턴\n";
    for (const pattern of loveWarnings.conflictPatterns) {
      advice += `  - ${pattern}\n`;
    }
    advice += "\n";
  }

  advice += "• 조언\n";
  advice += `  ${loveWarnings.advice}\n\n`;

  advice += "좋은 연애를 위한 핵심은 자신을 알고 상대를 이해하는 것입니다. 귀하의 강점은 살리고, 약점은 보완하면 더 좋은 관계를 만들 수 있습니다.";

  // 마무리
  const closing = "이상으로 연애 성향 분석을 마치겠습니다. 이 분석은 귀하의 기본적인 연애 스타일을 보여주는 것입니다. 실제 관계에서는 상대방과의 상호작용에 따라 다양하게 변할 수 있습니다. 중요한 것은 서로를 이해하고 존중하며, 함께 성장하는 관계를 만들어 가는 것입니다.";

  return {
    intro,
    mainAnalysis,
    details,
    advice,
    closing,
  };
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter12(
  sajuResult: SajuApiResult,
  gender: Gender,
  sinGangSinYak: string
): Chapter12Result {
  // 기본 분석
  const dayMasterElement = getDayMasterElement(sajuResult);
  const yearBranch = getYearBranch(sajuResult);
  const dominantSipsin = getDominantSipsin(sajuResult);

  // 연애 스타일
  const loveStyle = analyzeLoveStyle(dayMasterElement, dominantSipsin, gender);

  // 이상형
  const idealPartner = analyzeIdealPartner(dayMasterElement, yearBranch, dominantSipsin);

  // 연애 경고
  const loveWarnings = analyzeLoveWarnings(dayMasterElement, dominantSipsin, sinGangSinYak);

  // 매력 점수
  const attractionScore = analyzeAttractionScore(dayMasterElement, dominantSipsin, sinGangSinYak);

  // 서술형 Narrative 생성
  const narrative = generateLoveNarrative(
    loveStyle,
    idealPartner,
    loveWarnings,
    attractionScore,
    dayMasterElement,
    gender,
    sinGangSinYak
  );

  return {
    loveStyle,
    idealPartner,
    loveWarnings,
    attractionScore,
    narrative,
  };
}
