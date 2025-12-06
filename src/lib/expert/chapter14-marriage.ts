/**
 * 제14장: 결혼운 심층 분석
 * 관계상태별 분기
 */

import type { SajuApiResult, FiveElement, Gender, RelationshipStatus } from "@/types/saju";
import type { Chapter14Result, ChapterNarrative } from "@/types/expert";

// ============================================
// 타입 정의
// ============================================

type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";
type StrengthType = "신강" | "신약" | "중화";

// ============================================
// 신강신약 변환 함수
// ============================================

function getStrengthKey(sinGangSinYak: string): StrengthType {
  if (sinGangSinYak === "신강") return "신강";
  if (sinGangSinYak === "신약") return "신약";
  return "중화";
}

// ============================================
// 신강신약 조합별 상수 (5오행 × 3신강신약 = 15조합)
// ============================================

const MARRIAGE_STRENGTH_NARRATIVES: Record<FiveElement, Record<StrengthType, {
  marriageLife: string;
  spouseRelation: string;
  financialLife: string;
  communication: string;
  conflictStyle: string;
  childrenFortune: string;
  advice: string;
}>> = {
  wood: {
    신강: {
      marriageLife: "목 기운이 강한 신강 사주는 결혼 생활에서도 주도적인 역할을 합니다. 가정을 이끌어가는 리더십이 있지만, 배우자의 의견을 무시하거나 자기 방식만 고집하면 갈등이 생길 수 있습니다. 함께 성장하는 부부가 되려면 배우자의 꿈과 비전도 동등하게 존중해야 합니다.",
      spouseRelation: "자기주장이 강해 비슷하게 강한 배우자보다는 유연하고 포용력 있는 배우자와 좋은 궁합입니다. 배우자가 귀하를 지지해주되 적절한 제동 역할도 해줄 때 가장 조화로운 관계가 됩니다. 목표 지향적인 부분을 공유할 수 있는 동반자가 이상적입니다.",
      financialLife: "성장과 발전에 투자하는 것을 좋아합니다. 자녀 교육, 자기계발, 미래 투자에 적극적이지만, 때로는 무리한 투자로 위험을 감수할 수 있습니다. 배우자와 재정 계획을 함께 세우고, 안정과 성장의 균형을 유지하세요.",
      communication: "논리적이고 목표 지향적인 대화를 선호합니다. 자신의 의견을 명확히 표현하지만, 때로는 상대방의 감정보다 논리에 집중해 차갑게 느껴질 수 있습니다. 배우자의 감정에도 귀 기울이고, 공감 표현을 늘리세요.",
      conflictStyle: "갈등 시 자기 주장을 강하게 밀어붙이는 경향이 있습니다. 자존심 싸움으로 번지면 상황이 악화됩니다. 이기는 것보다 관계를 지키는 것이 중요함을 기억하세요. 먼저 한 발 물러서는 여유가 결혼 생활을 지킵니다.",
      childrenFortune: "자녀에게 성취욕과 목표 의식을 심어줍니다. 교육에 관심이 많고 자녀의 발전을 적극 지원합니다. 다만 자녀에게도 너무 높은 기준을 요구하지 않도록 주의하세요. 사랑과 인정의 표현도 중요합니다.",
      advice: "주도하는 것도 좋지만 배우자와 동등한 파트너십을 유지하세요. 중요한 결정은 반드시 함께 내리고, 배우자의 의견을 진심으로 경청하세요. 자존심을 내려놓고 먼저 화해하는 용기가 행복한 결혼의 비결입니다."
    },
    신약: {
      marriageLife: "목 기운이 약한 신약 사주는 결혼 생활에서 배우자에게 맞추는 편입니다. 갈등을 피하려 하고 화합을 중시하여 평화로운 가정을 만들지만, 너무 자신을 낮추면 불만이 쌓일 수 있습니다. 자신의 의견도 표현하면서 균형을 찾아가세요.",
      spouseRelation: "리더십 있고 든든하게 이끌어줄 수 있는 배우자와 좋은 궁합입니다. 다만 너무 의존하면 관계가 불균형해집니다. 배우자를 지지하면서도 자신의 영역과 의견을 지키는 것이 중요합니다. 함께 성장하는 관계를 추구하세요.",
      financialLife: "안정적인 재정 운영을 선호하고 모험을 피합니다. 저축과 안전한 투자를 중시하지만, 때로는 기회를 놓칠 수 있습니다. 배우자와 함께 재정 계획을 세우고, 필요한 투자는 용기 있게 결정하세요.",
      communication: "배우자의 의견을 존중하고 경청하는 편입니다. 갈등을 피하려 하지만, 속마음을 표현하지 않으면 오해가 쌓입니다. 불편한 것도 부드럽게라도 표현하는 연습이 필요합니다.",
      conflictStyle: "갈등 시 참거나 양보하는 경향이 있습니다. 평화를 유지하려 하지만, 억압된 감정이 쌓이면 언젠가 폭발할 수 있습니다. 작은 불만도 그때그때 부드럽게 표현하세요. 솔직한 대화가 더 건강한 관계를 만듭니다.",
      childrenFortune: "자녀에게 헌신적이고 배려심 깊은 부모입니다. 자녀의 필요를 잘 채워주지만, 때로는 자녀의 독립심을 키워주는 것도 필요합니다. 부모 역할에서도 자신의 의견을 표현하세요.",
      advice: "배우자와 대등한 파트너임을 인식하세요. 의견 충돌을 두려워하지 말고, 자신의 생각을 솔직히 표현하세요. 맞추기만 하면 결국 지치게 됩니다. 건강한 결혼은 서로를 존중하는 관계입니다."
    },
    중화: {
      marriageLife: "목 기운이 조화로운 중화 사주는 결혼 생활에서 균형 잡힌 모습을 보입니다. 주도할 때와 따를 때를 잘 구분하며, 배우자와 동등한 파트너십을 유지합니다. 서로의 성장을 응원하면서도 가정의 안정을 지키는 조화로운 부부가 됩니다.",
      spouseRelation: "다양한 유형의 배우자와 조화롭게 지낼 수 있습니다. 서로의 영역을 존중하면서도 함께하는 시간을 소중히 여기는 파트너가 이상적입니다. 함께 성장하고 꿈을 나눌 수 있는 동반자를 찾으세요.",
      financialLife: "안정과 성장의 균형을 잘 유지합니다. 필요한 곳에는 투자하면서도 가정의 재정 기반을 튼튼히 합니다. 배우자와 함께 장단기 재정 목표를 세우고 꾸준히 달성해 가세요.",
      communication: "상황에 맞게 논리와 감정의 균형을 유지합니다. 배우자의 의견을 존중하면서 자신의 생각도 명확히 전달합니다. 서로의 대화 스타일을 이해하고 맞춰가는 성숙함이 있습니다.",
      conflictStyle: "갈등 상황에서 대화로 해결하려 합니다. 서로의 의견을 조율하는 능력이 있어 큰 다툼으로 번지지 않습니다. 다만 너무 합리적으로만 접근하면 감정이 무시당한다고 느낄 수 있으니 공감도 표현하세요.",
      childrenFortune: "자녀 교육에 균형 잡힌 시각으로 접근합니다. 성취와 휴식, 자유와 규율의 균형을 잘 맞춥니다. 자녀의 개성을 존중하면서 필요한 지도를 제공하는 지혜로운 부모가 됩니다.",
      advice: "현재의 균형을 잘 유지하면서 특별한 순간도 만들어가세요. 일상에 안주하지 말고 부부만의 시간을 정기적으로 가지세요. 서로에 대한 감사를 표현하고 함께 성장하는 관계를 이어가세요."
    }
  },
  fire: {
    신강: {
      marriageLife: "화 기운이 강한 신강 사주는 결혼 생활에서도 열정적입니다. 배우자에게 뜨거운 사랑을 표현하고 가정에 활기를 불어넣습니다. 다만 감정 기복이 심하거나 화가 나면 격렬한 다툼으로 번질 수 있습니다. 감정 조절이 행복한 결혼의 열쇠입니다.",
      spouseRelation: "차분하고 안정적인 배우자와 좋은 균형을 이룹니다. 귀하의 열정을 받아주되 중심을 잡아줄 수 있는 파트너가 이상적입니다. 같은 화 기운의 배우자는 열정적이지만 충돌도 잦을 수 있습니다.",
      financialLife: "활동적인 소비 성향이 있습니다. 여행, 문화 생활, 경험에 아낌없이 지출합니다. 즐거움을 중시하지만, 충동 구매를 조심하고 장기적인 재정 계획도 세워야 합니다. 배우자와 지출 기준을 함께 정하세요.",
      communication: "열정적이고 표현적인 대화를 합니다. 감정을 솔직히 표현하며 스킨십도 많습니다. 다만 화가 나면 후회할 말을 할 수 있으니 말을 내뱉기 전에 한 번 생각하세요.",
      conflictStyle: "감정적으로 충돌하면 불이 붙듯 격렬해질 수 있습니다. 화가 나면 후회할 말을 하거나 분위기를 급격히 얼어붙게 만들 수 있습니다. 금방 화해하지만 순간의 상처가 쌓입니다. 화가 날 때 잠시 멈추고 진정하세요.",
      childrenFortune: "활발하고 열정적인 부모입니다. 자녀와 다양한 활동을 함께하며 친구처럼 지냅니다. 다만 감정적으로 대하면 자녀에게도 상처가 될 수 있으니 일관된 태도를 유지하세요.",
      advice: "열정을 유지하되 안정감도 주세요. 화가 날 때는 10초를 세고 말하세요. 일상의 소소한 행복도 즐기는 여유를 가지세요. 불꽃놀이 같은 사랑보다 모닥불 같은 사랑이 오래갑니다."
    },
    신약: {
      marriageLife: "화 기운이 약한 신약 사주는 결혼 생활에서 따뜻하지만 표현이 서툴 수 있습니다. 마음으로는 배우자를 깊이 사랑하지만 겉으로 잘 드러나지 않습니다. 배우자가 사랑받는다고 느끼게 해주는 표현이 필요합니다.",
      spouseRelation: "활발하고 적극적인 배우자와 좋은 균형을 이룹니다. 배우자가 분위기를 이끌고 귀하가 따뜻하게 응해주는 형태가 조화롭습니다. 귀하의 내면의 열정을 알아봐주는 세심한 파트너가 이상적입니다.",
      financialLife: "안정적인 재정 운영을 선호합니다. 충동 구매가 적고 필요한 곳에만 지출합니다. 다만 너무 검소하면 삶의 즐거움이 줄 수 있습니다. 가끔은 여유로운 지출도 가족의 행복에 필요합니다.",
      communication: "마음은 따뜻하지만 표현이 서툽니다. 사랑한다고, 고맙다고 말로 표현하는 연습이 필요합니다. 말이 어려우면 행동으로, 편지로, 작은 선물로 마음을 전하세요.",
      conflictStyle: "갈등을 피하려 하고 참는 편입니다. 평화를 유지하려 하지만 속으로 상처를 받을 수 있습니다. 불편한 것은 차분하게라도 표현하세요. 억압된 감정은 건강에도 해롭습니다.",
      childrenFortune: "따뜻하고 헌신적인 부모입니다. 자녀에게 안정감을 주고 조용히 지지합니다. 다만 사랑 표현을 더 적극적으로 해주세요. 자녀도 부모의 사랑을 확인받고 싶어합니다.",
      advice: "작은 것이라도 사랑 표현을 연습하세요. '사랑해', '고마워'라는 말 한마디가 결혼 생활을 따뜻하게 합니다. 귀하의 따뜻한 마음이 배우자에게 전해지도록 노력하세요."
    },
    중화: {
      marriageLife: "화 기운이 조화로운 중화 사주는 결혼 생활에서 적절한 열정과 안정을 함께 보여줍니다. 로맨틱한 순간과 편안한 일상을 조화롭게 만들어가며, 배우자에게 사랑받는 느낌을 충분히 줍니다. 감정 표현도 적절하고 갈등 상황에서도 대화로 해결하려 합니다.",
      spouseRelation: "다양한 유형의 배우자와 조화롭게 지낼 수 있습니다. 열정과 안정을 함께 추구하는 파트너가 이상적입니다. 함께 즐거움을 나누면서도 일상의 안정을 함께 만들어갈 수 있는 동반자를 찾으세요.",
      financialLife: "즐거움과 안정의 균형을 잘 유지합니다. 필요한 곳에는 즐거운 지출을 하면서도 미래를 위한 저축도 합니다. 배우자와 함께 여행이나 문화 생활을 즐기면서도 재정 건전성을 유지하세요.",
      communication: "감정 표현과 논리적 대화의 균형을 잘 유지합니다. 사랑을 표현하면서도 실용적인 이야기도 나눕니다. 배우자와의 대화에서 따뜻함과 효율성을 모두 갖추고 있습니다.",
      conflictStyle: "감정 조절 능력이 있어 큰 다툼으로 번지지 않습니다. 열이 오르더라도 진정하고 대화할 줄 압니다. 다만 너무 균형만 잡으려 하면 열정이 부족해 보일 수 있으니 가끔은 뜨겁게 표현하세요.",
      childrenFortune: "밝고 따뜻한 부모입니다. 자녀와 즐거운 시간도 보내고 필요한 훈육도 합니다. 균형 잡힌 양육으로 자녀가 정서적으로 안정된 환경에서 자랍니다.",
      advice: "현재의 균형을 유지하면서 가끔은 특별한 순간도 만들어주세요. 기념일을 챙기고 서프라이즈도 해보세요. 일상과 특별함의 조화로 행복한 결혼 생활을 유지하세요."
    }
  },
  earth: {
    신강: {
      marriageLife: "토 기운이 강한 신강 사주는 결혼 생활에서 안정적이고 믿음직합니다. 가정의 경제적·정서적 기반을 든든히 세우며 책임감 있게 배우자를 대합니다. 다만 변화를 싫어하고 고집이 세서 갈등이 생길 수 있습니다.",
      spouseRelation: "유연하고 변화를 즐기는 배우자와 좋은 균형을 이룹니다. 귀하가 안정을 제공하고 배우자가 새로움을 더해주는 형태가 이상적입니다. 너무 비슷하게 고집 센 배우자와는 충돌할 수 있습니다.",
      financialLife: "안정적이고 보수적인 재정 운영을 합니다. 저축과 부동산 등 실물 자산에 관심이 많습니다. 경제적 기반을 튼튼히 하지만, 때로는 새로운 기회에 투자하는 유연함도 필요합니다.",
      communication: "차분하고 실용적인 대화를 합니다. 필요한 이야기를 명확하게 하며 오해가 적습니다. 다만 로맨틱한 표현이 부족해 배우자가 서운해할 수 있습니다. 사랑한다고 말로도 표현하세요.",
      conflictStyle: "자신의 방식을 고집하면 대화가 막힙니다. 배우자가 답답해하면 관계가 경직됩니다. 때로는 변화를 받아들이고 배우자의 의견에 귀 기울이세요. 고집을 내려놓으면 더 평화로운 가정이 됩니다.",
      childrenFortune: "안정적이고 헌신적인 부모입니다. 물질적·정서적 안정을 제공하며 든든한 버팀목이 됩니다. 다만 자녀의 새로운 시도를 막지 말고 응원해 주세요. 변화도 성장의 일부입니다.",
      advice: "안정을 추구하되 가끔은 변화도 즐기세요. 배우자의 새로운 제안에 열린 마음으로 귀 기울이세요. 사랑한다고 말로도 표현하고, 가끔은 계획에 없던 데이트도 해보세요."
    },
    신약: {
      marriageLife: "토 기운이 약한 신약 사주는 결혼 생활에서 배우자에게 많이 의지하는 편입니다. 안정을 원하지만 스스로 만들어가기보다 배우자에게 기대합니다. 지지해주는 배우자와 함께라면 좋은 가정을 이룹니다.",
      spouseRelation: "든든하고 안정적인 배우자와 좋은 궁합입니다. 귀하를 지지하고 기반을 함께 만들어줄 파트너가 이상적입니다. 다만 너무 의존하면 관계가 불균형해지니 함께 성장하려는 노력이 필요합니다.",
      financialLife: "안정을 추구하지만 재정 관리에 자신이 없을 수 있습니다. 배우자와 함께 재정 계획을 세우고 역할을 분담하세요. 작은 것부터 책임지며 자신감을 키워가세요.",
      communication: "배우자의 의견을 잘 따르고 갈등을 피합니다. 다만 자신의 생각을 표현하지 않으면 존중받지 못한다고 느낄 수 있습니다. 자신의 의견도 부드럽게 표현하세요.",
      conflictStyle: "갈등을 피하려 하고 배우자에게 맡기는 편입니다. 평화롭게 보이지만 속으로 불만이 쌓일 수 있습니다. 중요한 결정에서는 목소리를 내세요. 함께 만들어가는 가정이어야 진정한 안정입니다.",
      childrenFortune: "따뜻하고 희생적인 부모입니다. 자녀의 필요를 잘 채워주지만, 부모로서의 권위도 필요할 때가 있습니다. 자녀에게도 자립심을 가르치세요.",
      advice: "배우자와 대등한 파트너로서 역할을 분담하세요. 작은 것부터 스스로 결정하고 책임지는 연습을 하세요. 함께 가정의 기반을 다져간다는 느낌이 결혼의 참맛입니다."
    },
    중화: {
      marriageLife: "토 기운이 조화로운 중화 사주는 결혼 생활에서 안정과 유연함을 함께 보여줍니다. 가정의 안정을 지키면서도 변화에 적응합니다. 배우자와 균형 잡힌 역할 분담을 하며 신뢰로운 관계를 유지합니다.",
      spouseRelation: "다양한 유형의 배우자와 조화롭게 지낼 수 있습니다. 안정을 함께 추구하면서도 새로움을 즐길 줄 아는 파트너가 이상적입니다. 서로 신뢰하고 존중하는 관계를 만들어가세요.",
      financialLife: "안정과 성장의 균형을 잘 유지합니다. 저축을 하면서도 필요한 투자는 합니다. 배우자와 함께 재정 목표를 세우고 꾸준히 달성해 가세요. 경제적으로 든든한 가정을 만들 수 있습니다.",
      communication: "실용적이면서도 따뜻한 대화를 합니다. 필요한 이야기를 하면서도 배우자의 감정을 고려합니다. 안정적이면서도 변화에 열린 소통 방식입니다.",
      conflictStyle: "갈등 상황에서 실용적인 해결책을 찾습니다. 서로 양보하며 조율하는 능력이 있습니다. 다만 너무 현실적으로만 접근하면 로맨스가 부족해 보일 수 있으니 감정적 교류도 중요합니다.",
      childrenFortune: "안정적이면서도 유연한 부모입니다. 자녀에게 든든한 기반을 제공하면서도 새로운 경험을 장려합니다. 균형 잡힌 양육으로 자녀가 안정감과 도전 정신을 모두 갖출 수 있습니다.",
      advice: "안정적인 일상을 유지하면서도 특별한 순간을 만들어가세요. 함께 미래를 계획하고, 가끔은 즉흥적인 것도 즐기세요. 서로에 대한 감사를 잊지 마세요."
    }
  },
  metal: {
    신강: {
      marriageLife: "금 기운이 강한 신강 사주는 결혼 생활에서 명확한 원칙과 기준을 가지고 있습니다. 서로의 경계를 존중하며 체계적인 가정을 만들어갑니다. 다만 감정 표현이 부족하거나 비판적인 태도로 배우자에게 상처를 줄 수 있습니다.",
      spouseRelation: "따뜻하고 감성적인 배우자와 좋은 균형을 이룹니다. 귀하의 논리와 배우자의 감성이 조화를 이루면 이상적입니다. 비슷하게 원칙적인 배우자와는 충돌할 수 있으니 유연함이 필요합니다.",
      financialLife: "계획적이고 체계적인 재정 관리를 합니다. 명확한 예산을 세우고 지출을 통제합니다. 경제적으로 안정적이지만, 때로는 가족의 즐거움을 위한 여유로운 지출도 필요합니다.",
      communication: "명확하고 직설적인 대화를 합니다. 오해 없이 의견을 전달하지만, 때로는 날카로워 상처가 될 수 있습니다. 비판보다 칭찬을, 지적보다 공감을 먼저 해보세요.",
      conflictStyle: "원칙을 고집하면 관계가 경직됩니다. 비판적인 지적이 상처가 되고, 차가운 태도로 배우자가 외로움을 느낄 수 있습니다. 가끔은 원칙보다 관계를 우선하세요. 따뜻한 말 한마디가 갈등을 예방합니다.",
      childrenFortune: "원칙적이고 체계적인 부모입니다. 자녀에게 규율과 올바른 가치관을 가르칩니다. 다만 너무 엄격하면 자녀가 위축될 수 있으니 사랑과 인정의 표현도 충분히 해주세요.",
      advice: "감정 표현을 연습하고 따뜻한 말도 해주세요. 비판보다 칭찬을, 분석보다 공감을 먼저 해보세요. 서로의 공간을 존중하되 친밀한 시간도 만드세요. 가끔은 원칙을 유연하게 적용하세요."
    },
    신약: {
      marriageLife: "금 기운이 약한 신약 사주는 결혼 생활에서 섬세하고 예민한 모습을 보입니다. 배우자의 반응에 민감하고, 작은 말에도 많은 의미를 부여합니다. 내면에는 기준이 있지만 표현하지 못해 오해가 쌓일 수 있습니다.",
      spouseRelation: "따뜻하고 수용적인 배우자와 좋은 궁합입니다. 귀하를 있는 그대로 받아들여주는 파트너가 이상적입니다. 비판적인 배우자와는 상처받기 쉬우니 주의하세요.",
      financialLife: "신중하게 지출하고 안정을 추구합니다. 계획적이지만 결정에 시간이 걸릴 수 있습니다. 배우자와 함께 결정하면 더 자신감 있게 재정을 관리할 수 있습니다.",
      communication: "섬세하고 예민한 편입니다. 배우자의 말에 많은 의미를 찾지만, 자신의 생각은 표현하지 못할 수 있습니다. 솔직하게 마음을 나누는 연습이 필요합니다.",
      conflictStyle: "갈등 시 상처받기 쉽고 마음을 닫을 수 있습니다. 작은 일에도 예민하게 반응하면 배우자가 지칩니다. 모든 것을 분석하지 말고 흘려보내는 여유를 가지세요. 완벽하지 않아도 좋은 관계일 수 있습니다.",
      childrenFortune: "섬세하고 깔끔한 부모입니다. 자녀의 필요를 잘 알아채고 세심하게 챙깁니다. 다만 너무 예민하면 자녀에게도 부담이 될 수 있으니 여유를 가지세요.",
      advice: "자신에게 너무 엄격하지 마세요. 모든 말을 분석하지 말고, 불편한 것은 부드럽게 표현하세요. 완벽하지 않아도 괜찮습니다. 서로의 불완전함을 수용하는 것이 결혼입니다."
    },
    중화: {
      marriageLife: "금 기운이 조화로운 중화 사주는 결혼 생활에서 명확하면서도 따뜻합니다. 원칙이 있지만 유연하게 적용하고, 서로의 경계를 존중하면서도 친밀함을 유지합니다. 품격 있으면서도 인간적인 관계를 만듭니다.",
      spouseRelation: "다양한 유형의 배우자와 조화롭게 지낼 수 있습니다. 논리와 감성을 모두 갖춘 파트너가 이상적입니다. 서로 존중하면서도 따뜻한 관계를 만들어갈 수 있습니다.",
      financialLife: "계획적이면서도 유연한 재정 관리를 합니다. 원칙을 가지고 있지만 상황에 맞게 조정합니다. 가족의 필요와 미래 계획의 균형을 잘 맞춥니다.",
      communication: "명확하면서도 배려 있는 대화를 합니다. 의견을 분명히 전달하면서도 상대방의 감정을 고려합니다. 논리와 감성의 균형이 좋은 소통을 가능하게 합니다.",
      conflictStyle: "갈등 상황에서 논리적으로 대화하되 감정도 고려합니다. 서로 존중하며 해결책을 찾습니다. 다만 너무 품격만 유지하려 하면 진솔함이 부족해 보일 수 있으니 가끔은 있는 그대로의 모습도 보여주세요.",
      childrenFortune: "균형 잡힌 부모입니다. 원칙과 사랑을 조화롭게 적용하며, 자녀에게 체계와 따뜻함을 모두 제공합니다. 자녀가 안정감 속에서 건강하게 성장합니다.",
      advice: "상호 존중하는 관계를 유지하면서 따뜻한 순간도 만드세요. 가끔은 완벽하지 않은 모습도 보여주세요. 논리도 좋지만 감정적 연결도 중요합니다."
    }
  },
  water: {
    신강: {
      marriageLife: "수 기운이 강한 신강 사주는 결혼 생활에서 깊이 있는 교류를 추구합니다. 배우자를 깊이 이해하려 하고 영혼의 동반자 같은 관계를 원합니다. 다만 너무 많이 생각하거나 배우자의 모든 것을 알려 하면 부담이 될 수 있습니다.",
      spouseRelation: "감성적이고 공감 능력이 좋은 배우자와 깊은 교류가 가능합니다. 귀하의 깊이를 이해하고 함께 내면을 나눌 수 있는 파트너가 이상적입니다. 너무 가벼운 사람과는 맞지 않을 수 있습니다.",
      financialLife: "유동적인 재정 운영을 합니다. 투자에 관심이 있으나 변동이 클 수 있습니다. 직관에 따른 결정이 때로는 성공하지만, 안정적인 관리도 병행해야 합니다. 배우자와 함께 균형을 맞추세요.",
      communication: "깊고 감성적인 대화를 좋아합니다. 배우자의 마음을 잘 읽고 깊은 공감을 합니다. 다만 모든 것을 분석하려 하면 가벼운 대화도 무겁게 느껴질 수 있습니다. 때로는 가벼운 수다도 즐기세요.",
      conflictStyle: "상대방의 마음을 읽으려다 오해할 수 있습니다. 너무 깊게 파고들면 배우자가 부담스러워합니다. 감정의 깊이 때문에 사소한 일에도 크게 상처받을 수 있습니다. 때로는 가볍게 넘기는 여유가 필요합니다.",
      childrenFortune: "감성적이고 이해심 깊은 부모입니다. 자녀의 감정을 잘 읽고 정서적 교류가 풍부합니다. 다만 자녀에게 너무 깊이 들어가지 마세요. 자녀도 자신만의 공간이 필요합니다.",
      advice: "깊은 대화와 감정 교류를 자주 하되, 배우자의 공간도 존중하세요. 생각만 하지 말고 행동으로 사랑을 표현하세요. 때로는 가벼운 즐거움도 함께 나누세요."
    },
    신약: {
      marriageLife: "수 기운이 약한 신약 사주는 결혼 생활에서 배우자에게 많이 의지합니다. 감정적으로 깊이 연결되길 원하며, 배우자 없이는 불안함을 느낍니다. 헌신적인 배우자이지만 의존도가 너무 높으면 관계가 불균형해집니다.",
      spouseRelation: "안정감을 주고 방향을 제시해줄 수 있는 배우자와 좋은 궁합입니다. 귀하를 따뜻하게 감싸주되 중심을 잡아줄 파트너가 이상적입니다. 너무 의지하려 하면 부담을 줄 수 있으니 주의하세요.",
      financialLife: "재정 관리에 일관성이 부족할 수 있습니다. 감정에 따라 지출이 변할 수 있습니다. 배우자와 함께 명확한 재정 계획을 세우고 역할을 분담하세요. 안정적인 관리가 마음의 안정에도 도움이 됩니다.",
      communication: "감정적이고 공감을 잘 합니다. 배우자와 깊이 연결되길 원하지만, 너무 의존적이면 대화가 일방적이 될 수 있습니다. 자신의 의견도 표현하고 독립적인 면도 보여주세요.",
      conflictStyle: "갈등 시 감정에 휩쓸리거나 배우자에게 매달릴 수 있습니다. 불안감이 커지면 상황을 악화시킵니다. 자신의 중심을 갖고 차분하게 대화하세요. 배우자도 공간이 필요함을 이해하세요.",
      childrenFortune: "따뜻하고 헌신적인 부모입니다. 자녀를 위해 많은 것을 희생합니다. 다만 자녀에게 너무 의지하지 마세요. 자녀에게도 독립심을 가르치세요.",
      advice: "자신만의 취미와 친구 관계를 유지하세요. 배우자에게만 의존하지 말고 자립적인 면도 키우세요. 감정적으로만 판단하지 말고 이성적으로도 생각해보세요. 함께이면서도 독립적인 관계가 건강합니다."
    },
    중화: {
      marriageLife: "수 기운이 조화로운 중화 사주는 결혼 생활에서 깊이와 유연함을 함께 보여줍니다. 배우자와 깊은 감정 교류를 하면서도 현실적인 문제도 함께 해결합니다. 이해하려 노력하면서 자신의 경계도 유지하는 균형 잡힌 부부가 됩니다.",
      spouseRelation: "감성과 현실감을 모두 갖춘 배우자와 좋은 궁합입니다. 깊은 대화도 나누고 일상의 문제도 함께 해결할 수 있는 파트너가 이상적입니다. 영혼의 동반자이면서 현실의 파트너가 될 수 있습니다.",
      financialLife: "직관과 분석의 균형을 유지합니다. 감으로 기회를 포착하면서도 현실적인 관리를 합니다. 배우자와 함께 장기 계획을 세우고 유연하게 조정해 가세요.",
      communication: "깊이 있으면서도 균형 잡힌 대화를 합니다. 배우자의 감정을 이해하면서도 실용적인 이야기도 나눕니다. 깊이와 가벼움을 오갈 줄 아는 융통성이 있습니다.",
      conflictStyle: "갈등 상황에서 감정과 이성의 균형을 유지합니다. 깊이 있는 대화로 문제를 해결합니다. 다만 너무 깊이 들어가려다 가벼운 즐거움을 놓칠 수 있으니 균형을 유지하세요.",
      childrenFortune: "깊이 있으면서도 균형 잡힌 부모입니다. 자녀의 감정을 이해하면서도 현실적인 지도를 합니다. 정서적 교류와 실질적인 지원을 모두 제공하는 지혜로운 부모가 됩니다.",
      advice: "깊이 있는 대화와 가벼운 즐거움의 균형을 유지하세요. 함께 성장하면서도 여유로운 시간도 가지세요. 서로의 내면을 이해하면서 일상의 소소한 행복도 나누세요."
    }
  }
};

// ============================================
// 기본 분석 함수
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

function analyzePartnerStar(sajuResult: SajuApiResult, gender: Gender): {
  hasPartnerStar: boolean;
  partnerStarCount: number;
  partnerStarStrength: "강함" | "보통" | "약함";
} {
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

  // 배우자 별 (남자: 정재/편재, 여자: 정관/편관)
  let partnerStarCount = 0;
  if (gender === "male") {
    partnerStarCount = sipsinCount["정재"] + sipsinCount["편재"];
  } else {
    partnerStarCount = sipsinCount["정관"] + sipsinCount["편관"];
  }

  let partnerStarStrength: "강함" | "보통" | "약함";
  if (partnerStarCount >= 3) {
    partnerStarStrength = "강함";
  } else if (partnerStarCount >= 1) {
    partnerStarStrength = "보통";
  } else {
    partnerStarStrength = "약함";
  }

  return {
    hasPartnerStar: partnerStarCount > 0,
    partnerStarCount,
    partnerStarStrength
  };
}

// ============================================
// 결혼 시기 분석
// ============================================

interface MarriageTiming {
  optimalYears: number[];
  avoidYears: number[];
  analysis: string;
}

function analyzeMarriageTiming(
  _sajuResult: SajuApiResult,
  partnerStarAnalysis: { hasPartnerStar: boolean; partnerStarCount: number; partnerStarStrength: string },
  currentYear: number,
  currentAge: number,
  relationshipStatus: RelationshipStatus
): MarriageTiming {
  const optimalYears: number[] = [];
  const avoidYears: number[] = [];

  // 간략화된 길흉년 판단
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const age = currentAge + i;

    // 짝수 해를 길년으로 (간략화)
    if (year % 2 === 0 && i <= 5) {
      optimalYears.push(year);
    }

    // 3의 배수 해를 피하는 해로 (간략화)
    if (year % 3 === 0 && i <= 7) {
      avoidYears.push(year);
    }
  }

  // 분석 멘트
  let analysis = "";

  if (relationshipStatus === "married") {
    analysis = "이미 결혼한 상태입니다. 결혼 생활의 질을 높이는 데 집중하세요.";
  } else if (partnerStarAnalysis.hasPartnerStar) {
    const startYear = optimalYears[0] ?? currentYear;
    const endYear = optimalYears[2] ?? optimalYears[1] ?? (currentYear + 4);
    if (partnerStarAnalysis.partnerStarStrength === "강함") {
      analysis = `배우자 별이 강해 결혼 인연이 좋습니다. ${startYear}~${endYear}년 사이가 가장 좋은 시기입니다.`;
    } else {
      analysis = `배우자 별이 있어 결혼 가능성이 있습니다. ${startYear}~${endYear}년 사이를 추천합니다.`;
    }
  } else {
    const laterYear = optimalYears[2] ?? optimalYears[1] ?? optimalYears[0] ?? (currentYear + 4);
    analysis = `배우자 별이 약해 결혼에 신중해야 합니다. 충분히 준비된 후 ${laterYear}년 이후를 고려하세요.`;
  }

  return {
    optimalYears: optimalYears.slice(0, 3),
    avoidYears: avoidYears.slice(0, 2),
    analysis
  };
}

// ============================================
// 배우자 분석
// ============================================

interface SpouseAnalysis {
  idealTraits: string[];
  meetingCircumstance: string;
  spouseCareer: string;
  spouseAppearance: string;
  compatibility: string;
}

function analyzeSpouse(
  dayMasterElement: FiveElement,
  gender: Gender,
  partnerStarStrength: string
): SpouseAnalysis {
  // 오행별 이상적인 배우자 특성
  const idealTraitsByElement: Record<FiveElement, string[]> = {
    wood: ["성장 마인드", "지적인", "활동적인", "꿈이 있는", "자기 계발하는"],
    fire: ["밝고 활발한", "열정적인", "유머 감각", "사교적인", "표현력 좋은"],
    earth: ["안정적인", "성실한", "가정적인", "신뢰할 수 있는", "경제 관념 있는"],
    metal: ["깔끔한", "지적인", "원칙적인", "논리적인", "독립적인"],
    water: ["감성적인", "공감 능력", "유연한", "창의적인", "깊이 있는"]
  };

  // 만남 장소
  const meetingCircumstances: Record<FiveElement, string> = {
    wood: "학교, 스터디 모임, 자기계발 강좌, 취미 동아리 등 성장하는 환경에서 만날 가능성이 높습니다.",
    fire: "모임, 파티, 동호회, 문화 행사, 여행 중 등 사람들이 많은 활기찬 장소에서 만날 가능성이 높습니다.",
    earth: "직장, 소개팅, 친척/지인 소개, 동네 모임 등 신뢰할 수 있는 경로로 만날 가능성이 높습니다.",
    metal: "직장, 전문가 모임, 세미나, 온라인 매칭 앱 등 체계적인 환경에서 만날 가능성이 높습니다.",
    water: "우연한 만남, 여행 중, 온라인 커뮤니티, 감성적인 공간(카페, 전시회) 등에서 만날 가능성이 높습니다."
  };

  // 배우자 직업 경향
  const spouseCareers: Record<FiveElement, string> = {
    wood: "교사, 교수, 의료인, 연구원, 예술가, 자기계발 관련 직종에 종사할 가능성이 있습니다.",
    fire: "엔터테이너, 마케터, 디자이너, 요식업, 이벤트 관련 활기찬 직종에 종사할 가능성이 있습니다.",
    earth: "공무원, 은행원, 부동산, 건설, 안정적인 대기업 등 안정적인 직종에 종사할 가능성이 있습니다.",
    metal: "법조인, 금융인, IT, 엔지니어, 전문직 등 체계적인 직종에 종사할 가능성이 있습니다.",
    water: "연구원, 상담사, 작가, 무역, 여행 관련 유연한 직종에 종사할 가능성이 있습니다."
  };

  // 배우자 외모 경향
  const spouseAppearances: Record<FiveElement, string> = {
    wood: "키가 크고 균형 잡힌 체형, 맑은 눈빛, 단정한 인상을 가질 가능성이 높습니다.",
    fire: "밝고 화사한 인상, 눈빛에 생기가 있고, 패션에 관심이 많은 스타일일 가능성이 높습니다.",
    earth: "편안한 인상, 후덕한 체형, 안정감 있는 분위기를 풍길 가능성이 높습니다.",
    metal: "깔끔하고 세련된 인상, 날카로운 이목구비, 지적인 분위기를 가질 가능성이 높습니다.",
    water: "부드러운 인상, 깊이 있는 눈빛, 신비로운 분위기를 가질 가능성이 높습니다."
  };

  // 궁합
  let compatibility = "";
  if (partnerStarStrength === "강함") {
    compatibility = "배우자 별이 강해 좋은 배우자를 만날 가능성이 높습니다. 서로 조화로운 관계를 유지할 수 있습니다.";
  } else if (partnerStarStrength === "보통") {
    compatibility = "배우자와의 궁합은 노력에 따라 달라집니다. 서로의 차이를 인정하고 맞춰가면 좋은 관계를 만들 수 있습니다.";
  } else {
    compatibility = "배우자 별이 약해 결혼 후 노력이 더 필요할 수 있습니다. 서로를 이해하려는 마음가짐이 중요합니다.";
  }

  return {
    idealTraits: idealTraitsByElement[dayMasterElement],
    meetingCircumstance: meetingCircumstances[dayMasterElement],
    spouseCareer: spouseCareers[dayMasterElement],
    spouseAppearance: spouseAppearances[dayMasterElement],
    compatibility
  };
}

// ============================================
// 결혼 생활 분석
// ============================================

interface MarriageLife {
  overallFortune: string;
  financialPattern: string;
  communicationStyle: string;
  conflictResolution: string;
}

function analyzeMarriageLife(
  dayMasterElement: FiveElement,
  sinGangSinYak: string
): MarriageLife {
  // 오행별 결혼 생활 특성
  const overallFortunes: Record<FiveElement, string> = {
    wood: "함께 성장하며 발전하는 결혼 생활입니다. 서로의 꿈을 응원하고 지지하는 부부가 됩니다.",
    fire: "열정적이고 활기찬 결혼 생활입니다. 다툼도 있지만 화해도 빠르며, 애정 표현이 풍부합니다.",
    earth: "안정적이고 화목한 결혼 생활입니다. 경제적 기반을 다지고 가정의 평화를 중시합니다.",
    metal: "원칙적이고 체계적인 결혼 생활입니다. 서로의 영역을 존중하며 깔끔한 가정을 꾸립니다.",
    water: "감성적이고 깊이 있는 결혼 생활입니다. 정서적 교류가 풍부하고 서로를 잘 이해합니다."
  };

  const financialPatterns: Record<FiveElement, string> = {
    wood: "투자와 성장에 관심이 많습니다. 자녀 교육과 자기계발에 아낌없이 투자합니다.",
    fire: "활동적인 소비 성향이 있습니다. 여행, 문화 생활에 지출하며 즐거운 경험을 중시합니다.",
    earth: "저축과 안정을 중시합니다. 부동산이나 실물 자산에 관심이 많고, 경제적 기반을 튼튼히 합니다.",
    metal: "계획적인 재정 관리를 합니다. 명확한 예산을 세우고 체계적으로 자산을 관리합니다.",
    water: "유동적인 재정 운영을 합니다. 투자에 관심이 있으나 변동이 클 수 있어 안정적인 관리가 필요합니다."
  };

  const communicationStyles: Record<FiveElement, string> = {
    wood: "논리적이고 목표 지향적인 대화를 합니다. 서로의 의견을 존중하며 건설적인 대화를 나눕니다.",
    fire: "열정적이고 표현적인 대화를 합니다. 감정을 솔직히 표현하며 스킨십도 많습니다.",
    earth: "차분하고 실용적인 대화를 합니다. 필요한 이야기를 명확하게 하며 오해가 적습니다.",
    metal: "명확하고 직설적인 대화를 합니다. 때로는 날카로울 수 있어 부드러운 표현이 필요합니다.",
    water: "감성적이고 공감적인 대화를 합니다. 서로의 감정을 잘 읽으며 깊은 대화를 나눕니다."
  };

  // 신강/신약에 따른 갈등 해결 방식
  let conflictResolution = "";
  if (sinGangSinYak === "신강") {
    conflictResolution = "갈등 시 자기 주장이 강해질 수 있습니다. 상대의 입장을 먼저 듣고, 타협점을 찾으려는 노력이 필요합니다. 이기려 하지 말고 관계를 지키려 하세요.";
  } else if (sinGangSinYak === "신약") {
    conflictResolution = "갈등 시 참거나 양보하는 경향이 있습니다. 때로는 자신의 의견도 명확히 표현하세요. 억압된 감정이 쌓이지 않도록 솔직한 대화가 필요합니다.";
  } else {
    conflictResolution = "갈등 시 균형 있게 대처할 수 있습니다. 서로의 의견을 듣고 중간점을 찾는 능력이 있습니다. 이 장점을 잘 활용하세요.";
  }

  return {
    overallFortune: overallFortunes[dayMasterElement],
    financialPattern: financialPatterns[dayMasterElement],
    communicationStyle: communicationStyles[dayMasterElement],
    conflictResolution
  };
}

// ============================================
// 자녀운 분석
// ============================================

interface ChildrenFortune {
  possibility: "높음" | "보통" | "낮음";
  optimalTiming: string;
  childrenCount: string;
  parentingStyle: string;
}

function analyzeChildrenFortune(
  dayMasterElement: FiveElement,
  gender: Gender,
  currentYear: number
): ChildrenFortune {
  // 자녀 가능성 (간략화)
  const possibility: "높음" | "보통" | "낮음" = "보통"; // 실제로는 식상/관성 분석 필요

  // 최적 시기
  const optimalTiming = `${currentYear + 1}~${currentYear + 5}년 사이가 자녀를 갖기에 좋은 시기입니다.`;

  // 자녀 수
  const childrenCount = "1~2명의 자녀가 예상됩니다. 실제로는 부부의 선택과 상황에 따라 달라집니다.";

  // 양육 스타일
  const parentingStyles: Record<FiveElement, string> = {
    wood: "자녀의 성장과 발전을 중시하는 부모입니다. 교육에 관심이 많고, 자녀의 꿈을 적극 지원합니다.",
    fire: "활발하고 열정적인 부모입니다. 다양한 활동을 함께하며, 자녀와 친구처럼 지내려 합니다.",
    earth: "안정적이고 헌신적인 부모입니다. 물질적·정서적 안정을 제공하며, 든든한 버팀목이 됩니다.",
    metal: "원칙적이고 체계적인 부모입니다. 규칙을 중시하고, 자녀에게 올바른 가치관을 심어줍니다.",
    water: "감성적이고 이해심 깊은 부모입니다. 자녀의 감정을 잘 읽고, 정서적 교류를 중시합니다."
  };

  return {
    possibility,
    optimalTiming,
    childrenCount,
    parentingStyle: parentingStyles[dayMasterElement]
  };
}

// ============================================
// 관계상태별 조언
// ============================================

function getStatusSpecificAdvice(
  relationshipStatus: RelationshipStatus,
  partnerStarStrength: string
): string {
  const advices: Record<RelationshipStatus, string> = {
    solo: partnerStarStrength === "강함"
      ? "배우자 별이 강해 좋은 인연을 만날 가능성이 높습니다. 적극적으로 만남에 나서보세요."
      : "결혼보다 자기 성장에 집중하세요. 준비된 사람에게 좋은 인연이 찾아옵니다.",
    dating: "현재 연인과의 결혼을 진지하게 고려할 시기입니다. 서로의 미래 계획을 맞춰보세요.",
    married: "결혼 생활의 질을 높이는 데 집중하세요. 배우자와의 소통을 더욱 강화하고, 함께하는 시간을 늘리세요.",
    divorced: "과거를 정리하고 새로운 시작을 준비하세요. 재혼의 가능성도 열려 있으니 마음을 열어두세요."
  };

  return advices[relationshipStatus];
}

// ============================================
// 오행 한글 명칭
// ============================================

const ELEMENT_NAMES_KR: Record<FiveElement, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

// ============================================
// Narrative 생성 함수
// ============================================

function generateMarriageNarrative(
  dayMasterElement: FiveElement,
  sinGangSinYak: string,
  relationshipStatus: RelationshipStatus,
  marriageTiming: Chapter14Result["marriageTiming"],
  spouseAnalysis: Chapter14Result["spouseAnalysis"],
  marriageLife: Chapter14Result["marriageLife"],
  childrenFortune: Chapter14Result["childrenFortune"],
  statusSpecificAdvice: string
): ChapterNarrative {
  const elementKr = ELEMENT_NAMES_KR[dayMasterElement];
  const strengthText = sinGangSinYak === "신강" ? "주도적이고 자기 주장이 강한" : sinGangSinYak === "신약" ? "배려심 깊고 유연한" : "균형 잡힌";

  // 신강신약 조합별 상수 가져오기
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthNarrative = MARRIAGE_STRENGTH_NARRATIVES[dayMasterElement][strengthKey];

  // 관계 상태에 따른 intro 분기
  let intro = "";
  if (relationshipStatus === "solo") {
    intro = `${elementKr} 오행의 기운과 ${strengthText} 사주 특성을 바탕으로 미래의 결혼 운을 분석해 드립니다. 어떤 배우자를 만나게 될지, 언제 결혼하면 좋을지, 결혼 생활은 어떨지 살펴봅니다.`;
  } else if (relationshipStatus === "dating") {
    intro = `${elementKr} 오행의 기운과 ${strengthText} 사주 특성을 바탕으로 현재 연인과의 결혼 가능성과 미래의 결혼 생활을 분석해 드립니다.`;
  } else if (relationshipStatus === "married") {
    intro = `${elementKr} 오행의 기운과 ${strengthText} 사주 특성이 현재 결혼 생활에 어떤 영향을 미치는지 분석해 드립니다. 더 행복한 부부 관계를 위한 조언도 함께 확인하세요.`;
  } else {
    intro = `${elementKr} 오행의 기운과 ${strengthText} 사주 특성을 바탕으로 새로운 결혼 인연의 가능성을 분석해 드립니다. 재혼 시기와 미래 배우자에 대한 분석을 확인하세요.`;
  }

  // 메인 분석 - 신강신약 조합별 상수 활용
  let mainAnalysis = "";
  if (relationshipStatus === "married") {
    mainAnalysis = `현재 결혼 생활의 특성을 살펴보면, ${strengthNarrative.marriageLife}\n\n재정 관리 측면에서는 ${strengthNarrative.financialLife}\n\n의사소통 방식을 보면, ${strengthNarrative.communication}`;
  } else {
    mainAnalysis = `결혼 시기를 살펴보면, ${marriageTiming.analysis}\n\n배우자의 특성으로는 ${spouseAnalysis.idealTraits.slice(0, 3).join(", ")} 등의 특성을 가진 분과 인연이 예상됩니다. ${strengthNarrative.spouseRelation}\n\n결혼 후 생활 패턴을 보면, ${strengthNarrative.marriageLife}`;
  }

  const details: string[] = [];

  // 결혼 시기
  if (relationshipStatus !== "married") {
    details.push(`• 결혼 적기: ${marriageTiming.optimalYears.join(", ")}년`);
    if (marriageTiming.avoidYears.length > 0) {
      details.push(`• 주의할 해: ${marriageTiming.avoidYears.join(", ")}년`);
    }
  }

  // 배우자 분석
  details.push(`• 이상적인 배우자 특성: ${spouseAnalysis.idealTraits.join(", ")}`);
  details.push(`• 배우자 만남 장소: ${spouseAnalysis.meetingCircumstance.split(".")[0]}`);
  details.push(`• 배우자 직업 경향: ${spouseAnalysis.spouseCareer.split(".")[0]}`);
  details.push(`• 배우자 외모 특성: ${spouseAnalysis.spouseAppearance.split(".")[0]}`);

  // 결혼 생활 - 신강신약 조합별 상수 활용
  details.push(`• 결혼 생활 특성: ${strengthNarrative.marriageLife.split(".")[0]}`);
  details.push(`• 배우자 관계: ${strengthNarrative.spouseRelation.split(".")[0]}`);
  details.push(`• 재정 관리 스타일: ${strengthNarrative.financialLife.split(".")[0]}`);
  details.push(`• 의사소통 방식: ${strengthNarrative.communication.split(".")[0]}`);
  details.push(`• 갈등 해결 방식: ${strengthNarrative.conflictStyle.split(".")[0]}`);

  // 자녀운 - 신강신약 조합별 상수 활용
  details.push(`• 자녀운: ${childrenFortune.possibility} - ${strengthNarrative.childrenFortune.split(".")[0]}`);
  details.push(`• 양육 스타일: ${childrenFortune.parentingStyle.split(".")[0]}`);

  // 조언 - 신강신약 조합별 상수 활용
  const advice = `${statusSpecificAdvice} ${strengthNarrative.advice} 행복한 결혼 생활을 위해서는 서로에 대한 이해와 존중, 그리고 꾸준한 노력이 필요합니다.`;

  // 마무리
  let closing = "";
  if (relationshipStatus === "solo" || relationshipStatus === "divorced") {
    closing = "좋은 인연은 준비된 사람에게 찾아옵니다. 자신을 사랑하고 가꾸면서 행복한 결혼을 준비하기 바랍니다.";
  } else if (relationshipStatus === "dating") {
    closing = "현재의 인연을 소중히 여기고, 함께 행복한 미래를 준비하기 바랍니다. 서로에 대한 확신이 있다면 결혼으로 나아가는 것도 좋은 선택입니다.";
  } else {
    closing = "결혼은 완성이 아니라 시작입니다. 함께하는 매 순간을 소중히 여기며, 더 깊은 사랑으로 나아가기 바랍니다.";
  }

  return { intro, mainAnalysis, details, advice, closing };
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter14(
  sajuResult: SajuApiResult,
  gender: Gender,
  relationshipStatus: RelationshipStatus,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string
): Chapter14Result {
  // 기본 분석
  const dayMasterElement = getDayMasterElement(sajuResult);
  const partnerStarAnalysis = analyzePartnerStar(sajuResult, gender);

  // 결혼 시기
  const marriageTiming = analyzeMarriageTiming(
    sajuResult,
    partnerStarAnalysis,
    currentYear,
    currentAge,
    relationshipStatus
  );

  // 배우자 분석
  const spouseAnalysis = analyzeSpouse(
    dayMasterElement,
    gender,
    partnerStarAnalysis.partnerStarStrength
  );

  // 결혼 생활
  const marriageLife = analyzeMarriageLife(dayMasterElement, sinGangSinYak);

  // 자녀운
  const childrenFortune = analyzeChildrenFortune(dayMasterElement, gender, currentYear);

  // 관계상태별 조언
  const statusSpecificAdvice = getStatusSpecificAdvice(
    relationshipStatus,
    partnerStarAnalysis.partnerStarStrength
  );

  // 서술형 Narrative 생성
  const narrative = generateMarriageNarrative(
    dayMasterElement,
    sinGangSinYak,
    relationshipStatus,
    marriageTiming,
    spouseAnalysis,
    marriageLife,
    childrenFortune,
    statusSpecificAdvice
  );

  return {
    relationshipStatus,
    marriageTiming,
    spouseAnalysis,
    marriageLife,
    childrenFortune,
    statusSpecificAdvice,
    narrative
  };
}
