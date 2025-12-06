/**
 * 제15장: 가족 관계 운
 * 자녀유무 분기
 */

import type { SajuApiResult, FiveElement, Gender } from "@/types/saju";
import type { Chapter15Result, ChapterNarrative } from "@/types/expert";

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

const FAMILY_STRENGTH_NARRATIVES: Record<FiveElement, Record<StrengthType, {
  parentRelation: string;
  siblingRelation: string;
  childrenRelation: string;
  familyRole: string;
  harmonyAdvice: string;
}>> = {
  wood: {
    신강: {
      parentRelation: "목 기운이 강한 신강 사주는 부모와의 관계에서 독립심이 강합니다. 일찍부터 자기 길을 개척하려 하여 부모님과 갈등이 있었을 수 있습니다. 부모님의 간섭을 싫어하지만, 마음 깊은 곳에서는 인정받고 싶은 욕구가 있습니다. 성공하여 부모님께 효도하려는 마음이 강합니다.",
      siblingRelation: "형제자매와 경쟁 관계가 생기기 쉽습니다. 서로 앞서 나가려는 성향이 있어 갈등이 있을 수 있지만, 위기 상황에서는 강한 유대감을 보입니다. 각자 독립하여 성공한 후에 관계가 더 좋아지는 경향이 있습니다.",
      childrenRelation: "자녀에게 성취와 발전을 강조합니다. 교육에 관심이 많고 자녀의 꿈을 적극 지원합니다. 다만 자녀에게 과도한 기대를 하거나 자신의 기준을 강요하면 갈등이 생깁니다. 자녀의 선택을 존중하고 격려해 주세요.",
      familyRole: "가정에서 목표를 세우고 이끌어가는 역할을 합니다. 가족의 발전을 위해 헌신하지만, 가족 구성원의 의견도 경청해야 합니다. 가장으로서의 책임감은 강하지만 소통에 더 신경 쓰세요.",
      harmonyAdvice: "가족에게 인정받으려면 성공으로 증명하려 하지 말고 사랑과 관심을 직접 표현하세요. 고집을 내려놓고 가족의 의견을 존중하면 더 화목해집니다. 함께 성장하는 가정을 만드세요."
    },
    신약: {
      parentRelation: "목 기운이 약한 신약 사주는 부모님의 지원에 많이 의지합니다. 부모님과 친밀한 관계를 유지하며, 특히 어머니와의 유대가 강합니다. 부모님의 인정과 지지를 받을 때 자신감이 생깁니다. 감사의 마음을 자주 표현하세요.",
      siblingRelation: "형제자매와 조화로운 관계를 추구합니다. 갈등을 피하고 화합을 중시하여 형제 사이에서 중재자 역할을 하기도 합니다. 다만 너무 맞추다 보면 자신의 의견이 무시될 수 있으니 표현도 필요합니다.",
      childrenRelation: "자녀에게 헌신적이고 지지적인 부모입니다. 자녀의 필요를 잘 채워주며 성장을 따뜻하게 응원합니다. 다만 자녀에게 너무 맞추면 훈육이 어려울 수 있으니 필요한 경계는 세우세요.",
      familyRole: "가정에서 조화와 화합을 추구하는 역할입니다. 가족 구성원들 사이의 갈등을 중재하고 분위기를 부드럽게 만듭니다. 자신의 필요도 표현하면서 균형을 유지하세요.",
      harmonyAdvice: "가족에게 맞추기만 하지 말고 자신의 의견도 부드럽게 표현하세요. 부모님께 감사하면서도 독립적인 면을 키워가세요. 가족과 함께 성장하는 관계를 만드세요."
    },
    중화: {
      parentRelation: "목 기운이 조화로운 중화 사주는 부모님과 균형 잡힌 관계를 유지합니다. 독립심도 있지만 부모님의 조언도 귀담아 듣습니다. 적당한 거리를 유지하면서 필요할 때 서로 지지하는 건강한 관계입니다.",
      siblingRelation: "형제자매와 적절한 관계를 유지합니다. 경쟁보다는 협력을, 의존보다는 자립을 추구하면서 균형 잡힌 형제 관계를 만듭니다. 필요할 때 서로 돕고 지지하는 관계입니다.",
      childrenRelation: "자녀에게 균형 잡힌 양육을 제공합니다. 기대와 격려, 지도와 자율성의 균형을 잘 맞춥니다. 자녀의 성장을 응원하면서도 필요한 경계를 세우는 지혜로운 부모입니다.",
      familyRole: "가정에서 균형을 유지하는 역할입니다. 발전을 추구하면서도 안정을 지키고, 가족 구성원 모두의 의견을 조율합니다. 자연스러운 리더십으로 가정을 이끕니다.",
      harmonyAdvice: "현재의 균형을 유지하면서 특별한 순간도 만드세요. 정기적인 가족 시간을 갖고 소통을 이어가세요. 서로의 성장을 응원하면서 함께하는 가정을 만드세요."
    }
  },
  fire: {
    신강: {
      parentRelation: "화 기운이 강한 신강 사주는 부모님과 열정적인 관계입니다. 감정 표현이 풍부하여 사랑도 많이 주고받지만, 충돌할 때는 격렬할 수 있습니다. 부모님과 화해도 빠르지만, 순간의 말 실수가 상처가 될 수 있으니 주의하세요.",
      siblingRelation: "형제자매와 활기찬 관계입니다. 함께 놀고 웃고 때로는 격렬하게 다투기도 합니다. 열정적인 만큼 갈등도 있지만 화해도 빠릅니다. 감정에 휩쓸리지 않도록 조절이 필요합니다.",
      childrenRelation: "자녀와 열정적이고 친구 같은 관계를 추구합니다. 함께 활동하고 웃는 시간이 많습니다. 다만 감정적으로 대하면 자녀에게 상처가 될 수 있으니 일관된 태도를 유지하세요.",
      familyRole: "가정에 활기와 열정을 불어넣는 역할입니다. 분위기 메이커로서 가족 행사를 주도합니다. 다만 감정 조절이 안 되면 가정 분위기를 흐릴 수 있으니 주의하세요.",
      harmonyAdvice: "화가 날 때 잠시 멈추고 진정하세요. 열정은 좋지만 상대방의 감정도 고려해야 합니다. 따뜻함은 유지하되 안정감도 주세요. 가족과 함께 즐거운 추억을 많이 만드세요."
    },
    신약: {
      parentRelation: "화 기운이 약한 신약 사주는 부모님에게 따뜻하지만 표현이 서툴 수 있습니다. 마음은 깊이 사랑하지만 겉으로 드러내지 못합니다. 부모님도 귀하의 마음을 알아봐 주면 좋겠지만, 표현하는 연습도 필요합니다.",
      siblingRelation: "형제자매와 조용하고 따뜻한 관계입니다. 큰 갈등 없이 평화로운 관계를 유지하지만, 서로 속마음을 나누지 못하는 경우도 있습니다. 가끔은 속 깊은 대화를 나눠보세요.",
      childrenRelation: "자녀에게 따뜻하고 헌신적인 부모입니다. 조용히 지지하고 응원합니다. 다만 사랑 표현을 더 적극적으로 해주세요. 자녀도 부모의 사랑을 확인받고 싶어합니다.",
      familyRole: "가정에서 조용한 지지자 역할입니다. 화려하게 나서지 않지만 가족을 따뜻하게 감싸줍니다. 자신의 존재감을 조금 더 드러내도 좋습니다.",
      harmonyAdvice: "작은 것이라도 사랑 표현을 연습하세요. '사랑해', '고마워'라는 말 한마디가 가정을 따뜻하게 합니다. 귀하의 따뜻한 마음이 가족에게 전해지도록 노력하세요."
    },
    중화: {
      parentRelation: "화 기운이 조화로운 중화 사주는 부모님과 적절한 열정과 안정을 보여줍니다. 사랑 표현도 적절하고 갈등 시에도 대화로 해결합니다. 따뜻하면서도 안정적인 관계를 유지합니다.",
      siblingRelation: "형제자매와 활기차면서도 안정적인 관계입니다. 즐거움을 나누고 필요할 때 서로 지지합니다. 감정 기복 없이 꾸준한 관계를 유지할 수 있습니다.",
      childrenRelation: "자녀에게 따뜻하면서도 균형 잡힌 부모입니다. 사랑 표현과 훈육의 균형을 잘 맞추며, 자녀와 즐거운 시간도 보내고 필요한 지도도 합니다.",
      familyRole: "가정에 활기와 안정을 함께 주는 역할입니다. 즐거운 순간을 만들면서도 가정의 안정을 지킵니다. 자연스러운 리더십으로 분위기를 이끕니다.",
      harmonyAdvice: "현재의 균형을 유지하면서 특별한 순간도 만드세요. 가족과 함께 여행이나 활동을 하며 추억을 쌓으세요. 일상과 특별함의 조화로 행복한 가정을 만드세요."
    }
  },
  earth: {
    신강: {
      parentRelation: "토 기운이 강한 신강 사주는 부모님에 대한 책임감이 강합니다. 부모님을 안정적으로 모시려 하고, 가족의 경제적 기반을 책임지려 합니다. 다만 고집이 세서 부모님과 의견 충돌이 있을 수 있습니다.",
      siblingRelation: "형제자매에게 든든한 버팀목이 되려 합니다. 형제가 어려울 때 도와주고 지원합니다. 다만 자신의 방식을 강요하면 갈등이 생길 수 있으니 형제의 의견도 존중하세요.",
      childrenRelation: "자녀에게 안정적이고 헌신적인 부모입니다. 물질적·정서적 기반을 제공하며 든든한 버팀목이 됩니다. 다만 변화를 싫어하여 자녀의 새로운 시도를 막을 수 있으니 주의하세요.",
      familyRole: "가정의 안정을 책임지는 중심 역할입니다. 가족의 경제적 기반을 다지고 물질적 안정을 제공합니다. 다만 로맨스나 재미가 부족할 수 있으니 여유도 가지세요.",
      harmonyAdvice: "안정을 추구하되 가끔은 변화도 즐기세요. 가족의 새로운 제안에 열린 마음을 가지세요. 사랑한다고 말로도 표현하고 가끔은 계획에 없던 활동도 해보세요."
    },
    신약: {
      parentRelation: "토 기운이 약한 신약 사주는 부모님에게 많이 의지합니다. 부모님의 지원이 자신감의 근원이 되며, 부모님과 함께 살거나 자주 연락하는 것을 선호합니다. 독립에 대한 불안이 있을 수 있습니다.",
      siblingRelation: "형제자매에게 의지하는 편입니다. 형제가 든든하게 지지해주면 안정감을 느낍니다. 다만 너무 의존하면 관계가 불균형해지니 자립적인 면도 키우세요.",
      childrenRelation: "자녀에게 따뜻하고 희생적인 부모입니다. 자녀를 위해 많은 것을 희생합니다. 다만 자녀에게 너무 의지하지 마세요. 부모로서의 권위도 필요합니다.",
      familyRole: "가정에서 조화를 추구하며 가족에게 맞추는 역할입니다. 갈등을 피하고 평화를 유지하려 합니다. 자신의 의견도 표현하면서 균형을 유지하세요.",
      harmonyAdvice: "가족에게 의지하면서도 자립적인 면을 키우세요. 작은 것부터 스스로 결정하고 책임지는 연습을 하세요. 함께 가정을 이끌어간다는 느낌이 중요합니다."
    },
    중화: {
      parentRelation: "토 기운이 조화로운 중화 사주는 부모님과 안정적이면서도 독립적인 관계입니다. 적당한 거리를 유지하면서 필요할 때 서로 지지합니다. 신뢰를 바탕으로 한 건강한 관계입니다.",
      siblingRelation: "형제자매와 안정적이면서도 균형 잡힌 관계입니다. 서로 의지하면서도 각자의 삶을 존중합니다. 필요할 때 도움을 주고받는 건강한 관계입니다.",
      childrenRelation: "자녀에게 안정적이면서도 유연한 부모입니다. 든든한 기반을 제공하면서도 새로운 경험을 장려합니다. 균형 잡힌 양육으로 자녀가 안정감 속에서 자랍니다.",
      familyRole: "가정의 안정과 변화의 균형을 유지하는 역할입니다. 가족에게 든든한 기반을 제공하면서도 새로운 시도에 열린 자세입니다. 신뢰받는 가족 구성원입니다.",
      harmonyAdvice: "안정적인 일상을 유지하면서 특별한 순간도 만들어가세요. 가족과 함께 미래를 계획하고 가끔은 즉흥적인 것도 즐기세요. 서로에 대한 감사를 잊지 마세요."
    }
  },
  metal: {
    신강: {
      parentRelation: "금 기운이 강한 신강 사주는 부모님에 대한 기준이 명확합니다. 부모님을 공경하지만, 원칙적인 면이 있어 비판적일 수 있습니다. 부모님의 잘못을 지적하기도 하는데, 따뜻함도 함께 표현해야 관계가 좋아집니다.",
      siblingRelation: "형제자매와 명확한 경계를 유지합니다. 각자의 영역을 존중하며 간섭하지 않습니다. 다만 너무 거리를 두면 서먹해질 수 있으니 가끔은 따뜻한 관심도 보여주세요.",
      childrenRelation: "자녀에게 원칙과 가치관을 강조합니다. 규율을 가르치고 올바른 길로 이끌려 합니다. 다만 너무 엄격하면 자녀가 위축될 수 있으니 사랑과 인정의 표현도 충분히 하세요.",
      familyRole: "가정에서 원칙과 체계를 세우는 역할입니다. 규칙을 만들고 가족이 따르기를 기대합니다. 다만 유연성도 필요하며, 가족의 감정도 고려해야 합니다.",
      harmonyAdvice: "비판보다 칭찬을, 지적보다 공감을 먼저 해보세요. 원칙도 중요하지만 가족의 마음도 중요합니다. 따뜻한 말과 행동으로 사랑을 표현하세요."
    },
    신약: {
      parentRelation: "금 기운이 약한 신약 사주는 부모님의 인정을 갈망합니다. 부모님의 기대에 부응하려 노력하며, 비판에 민감합니다. 스스로를 인정하고 부모님과의 관계에서도 자신감을 가지세요.",
      siblingRelation: "형제자매의 눈치를 보는 편입니다. 갈등을 피하고 맞추려 하지만, 속으로 상처받을 수 있습니다. 자신의 의견도 표현하고 형제와 대등한 관계를 만드세요.",
      childrenRelation: "자녀에게 섬세하고 세심한 부모입니다. 자녀의 필요를 잘 알아채고 챙깁니다. 다만 너무 예민하면 자녀에게도 부담이 될 수 있으니 여유를 가지세요.",
      familyRole: "가정에서 조화를 추구하며 가족의 눈치를 보는 역할입니다. 갈등을 피하고 평화를 유지하려 하지만, 자신의 의견도 중요합니다.",
      harmonyAdvice: "자신에게 너무 엄격하지 마세요. 완벽하지 않아도 괜찮습니다. 가족에게 사랑받고 있음을 인식하고 자신의 의견도 부드럽게 표현하세요."
    },
    중화: {
      parentRelation: "금 기운이 조화로운 중화 사주는 부모님과 명확하면서도 따뜻한 관계입니다. 원칙이 있지만 유연하게 적용하고, 부모님을 존경하면서도 자신의 의견도 표현합니다.",
      siblingRelation: "형제자매와 존중하면서도 친밀한 관계입니다. 각자의 영역을 지키면서도 필요할 때 도움을 주고받습니다. 균형 잡힌 형제 관계입니다.",
      childrenRelation: "자녀에게 균형 잡힌 부모입니다. 원칙과 사랑을 조화롭게 적용하며, 체계와 따뜻함을 모두 제공합니다. 자녀가 안정감 속에서 건강하게 성장합니다.",
      familyRole: "가정에서 원칙과 따뜻함의 균형을 유지하는 역할입니다. 필요한 규칙을 세우면서도 가족의 감정을 고려합니다. 존경받는 가족 구성원입니다.",
      harmonyAdvice: "상호 존중하는 관계를 유지하면서 따뜻한 순간도 만드세요. 가끔은 완벽하지 않은 모습도 보여주세요. 가족과 함께하는 시간을 소중히 하세요."
    }
  },
  water: {
    신강: {
      parentRelation: "수 기운이 강한 신강 사주는 부모님과 깊은 정서적 교류를 원합니다. 부모님을 깊이 이해하려 하고, 영혼의 대화를 나누고 싶어합니다. 다만 너무 깊이 파고들면 부담스러울 수 있으니 적당한 거리도 필요합니다.",
      siblingRelation: "형제자매와 깊은 정서적 연결을 추구합니다. 속 깊은 대화를 나누고 서로의 마음을 이해하려 합니다. 다만 모든 것을 알려 하면 형제가 부담스러워할 수 있습니다.",
      childrenRelation: "자녀와 깊은 정서적 교류를 합니다. 자녀의 감정을 잘 읽고 공감합니다. 다만 자녀에게 너무 깊이 들어가지 마세요. 자녀도 자신만의 공간이 필요합니다.",
      familyRole: "가정에서 정서적 중심 역할입니다. 가족의 감정을 읽고 깊이 있는 대화를 이끕니다. 다만 가벼운 즐거움도 함께 나누세요.",
      harmonyAdvice: "깊은 대화와 감정 교류도 좋지만 가족의 공간도 존중하세요. 때로는 가벼운 수다나 활동도 함께 하세요. 생각만 하지 말고 행동으로도 사랑을 표현하세요."
    },
    신약: {
      parentRelation: "수 기운이 약한 신약 사주는 부모님에게 정서적으로 많이 의지합니다. 부모님의 사랑과 인정이 자신감의 원천입니다. 부모님 없이는 불안함을 느낄 수 있으니 자립심도 키우세요.",
      siblingRelation: "형제자매에게 정서적으로 의지합니다. 형제의 지지가 마음의 안정이 됩니다. 다만 너무 의존하면 형제가 부담스러워할 수 있으니 균형을 유지하세요.",
      childrenRelation: "자녀에게 따뜻하고 헌신적인 부모입니다. 자녀를 위해 많은 것을 희생합니다. 다만 자녀에게 정서적으로 너무 의지하지 마세요. 자녀도 독립해야 합니다.",
      familyRole: "가정에서 정서적 지지를 받으며 조화를 추구하는 역할입니다. 가족의 사랑이 필요하며, 그 사랑에 보답하려 합니다.",
      harmonyAdvice: "자신만의 취미와 관계를 유지하세요. 가족에게만 의존하지 말고 자립적인 면도 키우세요. 감정적으로만 판단하지 말고 이성적으로도 생각해보세요."
    },
    중화: {
      parentRelation: "수 기운이 조화로운 중화 사주는 부모님과 깊이 있으면서도 균형 잡힌 관계입니다. 정서적 교류를 하면서도 적당한 거리를 유지합니다. 이해와 존중의 관계입니다.",
      siblingRelation: "형제자매와 깊이 있으면서도 건강한 관계입니다. 서로의 마음을 이해하면서도 각자의 삶을 존중합니다. 필요할 때 깊이 있는 대화를 나눕니다.",
      childrenRelation: "자녀와 깊이 있으면서도 균형 잡힌 관계입니다. 정서적 교류와 실질적 지원을 모두 제공합니다. 자녀의 독립도 지지하는 지혜로운 부모입니다.",
      familyRole: "가정에서 정서적 깊이와 현실적 안정의 균형을 유지하는 역할입니다. 가족의 마음을 읽으면서도 실질적인 문제도 해결합니다.",
      harmonyAdvice: "깊이 있는 대화와 가벼운 즐거움의 균형을 유지하세요. 가족과 함께 성장하면서도 여유로운 시간도 가지세요. 서로의 마음을 이해하면서 일상의 행복도 나누세요."
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

// 십신 분석
function analyzeSipsin(sajuResult: SajuApiResult): Record<string, number> {
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

  return sipsinCount;
}

// ============================================
// 부모운 분석
// ============================================

interface ParentsFortune {
  fatherRelation: { score: number; analysis: string };
  motherRelation: { score: number; analysis: string };
  inheritanceFortune: string;
  supportFromParents: string;
}

function analyzeParentsFortune(
  dayMasterElement: FiveElement,
  sipsinCount: Record<string, number>,
  sinGangSinYak: string
): ParentsFortune {
  // 부모 관련 십신: 인성(편인/정인)이 어머니, 재성(편재/정재)이 아버지(남자 기준)
  const inseongCount = sipsinCount["편인"] + sipsinCount["정인"];
  const jaeseongCount = sipsinCount["편재"] + sipsinCount["정재"];

  // 아버지 관계
  let fatherScore = 60;
  let fatherAnalysis = "";

  if (jaeseongCount >= 2) {
    fatherScore += 20;
    fatherAnalysis = "아버지와의 관계가 좋은 편입니다. 경제적 지원이나 사업적 조언을 받을 가능성이 높습니다.";
  } else if (jaeseongCount === 1) {
    fatherScore += 10;
    fatherAnalysis = "아버지와 보통의 관계입니다. 필요할 때 도움을 받을 수 있습니다.";
  } else {
    fatherAnalysis = "아버지와의 인연이 약한 편입니다. 어려서 떨어져 살았거나 관계가 소원할 수 있습니다.";
  }

  // 어머니 관계
  let motherScore = 60;
  let motherAnalysis = "";

  if (inseongCount >= 2) {
    motherScore += 20;
    motherAnalysis = "어머니와의 관계가 좋은 편입니다. 정서적 지지와 조언을 많이 받습니다.";
  } else if (inseongCount === 1) {
    motherScore += 10;
    motherAnalysis = "어머니와 보통의 관계입니다. 필요할 때 정서적 지원을 받을 수 있습니다.";
  } else {
    motherAnalysis = "어머니와의 인연이 약한 편입니다. 일찍 독립했거나 관계가 서먹할 수 있습니다.";
  }

  // 신강/신약에 따른 조정
  if (sinGangSinYak === "신약") {
    motherScore += 5;
    motherAnalysis += " 신약 사주로 부모의 도움이 더욱 필요하고 감사하게 느껴집니다.";
  }

  // 상속운 (재성/인성 개수와 일관성 있게 판단)
  let inheritanceFortune = "";
  if (jaeseongCount >= 2 && inseongCount >= 1) {
    inheritanceFortune = "부모로부터 물질적·정신적 유산을 모두 받을 가능성이 높습니다. 가업을 이어받거나 재산을 물려받을 수 있습니다.";
  } else if (jaeseongCount >= 2) {
    inheritanceFortune = "아버지 쪽에서 재산이나 사업 기회를 물려받을 가능성이 있습니다.";
  } else if (inseongCount >= 2) {
    inheritanceFortune = "어머니 쪽에서 정서적 지원이나 교육적 투자를 받을 가능성이 높습니다.";
  } else if (jaeseongCount === 1 || inseongCount === 1) {
    inheritanceFortune = "큰 상속보다는 본인의 노력으로 기반을 다지는 타입입니다. 다만 필요할 때 부모님의 조언이나 작은 도움은 받을 수 있습니다.";
  } else {
    inheritanceFortune = "상속보다는 자수성가하는 타입입니다. 스스로 기반을 다지는 것이 중요합니다.";
  }

  // 부모 지원
  const supportFromParents: Record<FiveElement, string> = {
    wood: "부모님의 성장을 응원하는 지원을 받습니다. 교육이나 자기계발에 대한 투자를 받을 가능성이 높습니다.",
    fire: "부모님과 활기차고 열정적인 관계입니다. 정서적 격려와 응원을 많이 받습니다.",
    earth: "부모님의 안정적인 지원을 받습니다. 경제적 기반이나 주거 지원을 받을 가능성이 있습니다.",
    metal: "부모님의 원칙적인 가르침을 받습니다. 올바른 가치관과 삶의 지혜를 물려받습니다.",
    water: "부모님의 깊은 사랑을 받습니다. 정서적으로 깊이 연결되어 있으며 이해심이 많습니다."
  };

  return {
    fatherRelation: { score: Math.min(100, fatherScore), analysis: fatherAnalysis },
    motherRelation: { score: Math.min(100, motherScore), analysis: motherAnalysis },
    inheritanceFortune,
    supportFromParents: supportFromParents[dayMasterElement]
  };
}

// ============================================
// 형제운 분석
// ============================================

interface SiblingsFortune {
  relationship: string;
  cooperation: string;
  advice: string;
}

function analyzeSiblingsFortune(
  dayMasterElement: FiveElement,
  sipsinCount: Record<string, number>
): SiblingsFortune {
  // 형제 관련 십신: 비겁(비견/겁재)
  const bigyeopCount = sipsinCount["비견"] + sipsinCount["겁재"];

  let relationship = "";
  let cooperation = "";

  if (bigyeopCount >= 2) {
    relationship = "형제자매와의 인연이 강합니다. 형제가 여럿이거나, 관계가 긴밀합니다. 다만 경쟁 관계가 생길 수도 있습니다.";
    cooperation = "형제자매와 협력하면 큰 시너지를 낼 수 있습니다. 공동 사업이나 프로젝트도 고려해볼 만합니다.";
  } else if (bigyeopCount === 1) {
    relationship = "형제자매와 보통의 관계입니다. 필요할 때 서로 돕는 관계입니다.";
    cooperation = "형제자매와 적당한 거리를 유지하면서 협력하는 것이 좋습니다.";
  } else {
    relationship = "형제자매와의 인연이 약합니다. 독자이거나 형제와 떨어져 살 가능성이 있습니다.";
    cooperation = "형제보다는 친구나 동료와의 협력이 더 중요합니다.";
  }

  // 오행별 형제 관계 조언
  const advices: Record<FiveElement, string> = {
    wood: "형제와 함께 성장하고 발전하는 관계를 만드세요. 서로의 목표를 응원해주세요.",
    fire: "형제와 활기찬 관계를 유지하세요. 가끔 함께 여행이나 활동을 해보세요.",
    earth: "형제와 안정적인 관계를 유지하세요. 가족 모임을 정기적으로 갖는 것이 좋습니다.",
    metal: "형제와 명확한 경계를 지키면서도 필요할 때 도와주세요. 서로의 영역을 존중하세요.",
    water: "형제와 깊은 대화를 나누세요. 정서적으로 연결되는 것이 중요합니다."
  };

  return {
    relationship,
    cooperation,
    advice: advices[dayMasterElement]
  };
}

// ============================================
// 자녀운 분석 (자녀 있는 경우)
// ============================================

interface ChildrenFortuneContent {
  overallRelation: string;
  educationAdvice: string;
  conflictPatterns: string[];
  supportAdvice: string;
}

function analyzeChildrenFortuneContent(
  dayMasterElement: FiveElement,
  gender: Gender,
  sipsinCount: Record<string, number>,
  sinGangSinYak: string
): ChildrenFortuneContent {
  // 자녀 관련 십신: 남자는 관성(편관/정관), 여자는 식상(식신/상관)
  let childStarCount: number;
  if (gender === "male") {
    childStarCount = sipsinCount["편관"] + sipsinCount["정관"];
  } else {
    childStarCount = sipsinCount["식신"] + sipsinCount["상관"];
  }

  let overallRelation = "";
  if (childStarCount >= 2) {
    overallRelation = "자녀와의 인연이 강합니다. 자녀 수가 많거나 관계가 매우 긴밀합니다.";
  } else if (childStarCount === 1) {
    overallRelation = "자녀와 보통의 관계입니다. 적당한 거리를 유지하면서 사랑을 표현하세요.";
  } else {
    overallRelation = "자녀와의 인연이 약하거나 자녀가 적을 수 있습니다. 질적인 관계에 집중하세요.";
  }

  // 오행별 교육 조언
  const educationAdvices: Record<FiveElement, string> = {
    wood: "자녀의 성장과 발전을 중시합니다. 자녀가 스스로 결정하고 성장할 수 있도록 지원하세요. 과도한 기대보다는 격려가 중요합니다.",
    fire: "자녀와 활발하게 소통하며 함께 활동합니다. 자녀의 열정을 지지하되, 감정 조절도 가르쳐주세요.",
    earth: "자녀에게 안정감을 제공합니다. 일관된 양육 방식과 따뜻한 가정 환경이 중요합니다.",
    metal: "자녀에게 원칙과 가치관을 가르칩니다. 규칙이 필요하지만, 융통성도 보여주세요.",
    water: "자녀의 감정을 잘 읽고 공감합니다. 정서적 교류를 중시하되, 과잉보호를 주의하세요."
  };

  // 갈등 패턴
  const conflictPatterns: string[] = [];
  if (sinGangSinYak === "신강") {
    conflictPatterns.push("자녀에게 자신의 기준을 강요할 수 있습니다. 자녀의 개성을 존중하세요.");
  } else if (sinGangSinYak === "신약") {
    conflictPatterns.push("자녀에게 지나치게 맞추다가 훈육이 안 될 수 있습니다. 적절한 경계가 필요합니다.");
  }

  const elementConflicts: Record<FiveElement, string> = {
    wood: "자녀의 성장 방향이 기대와 다를 때 갈등이 생깁니다",
    fire: "감정적으로 부딪힐 수 있으나 화해도 빠릅니다",
    earth: "변화를 원하는 자녀와 안정을 추구하는 부모 사이 갈등이 있을 수 있습니다",
    metal: "원칙적인 태도가 자녀에게 부담이 될 수 있습니다",
    water: "감정적으로 얽혀 객관적 판단이 어려울 수 있습니다"
  };
  conflictPatterns.push(elementConflicts[dayMasterElement]);

  // 지원 조언
  const supportAdvices: Record<FiveElement, string> = {
    wood: "자녀의 교육과 자기계발에 투자하세요. 다양한 경험을 제공하고 자녀의 꿈을 응원하세요.",
    fire: "자녀와 함께 하는 시간을 늘리세요. 여행, 취미 활동 등을 통해 추억을 만드세요.",
    earth: "자녀에게 안정적인 환경을 제공하세요. 경제적 지원과 함께 정서적 지지도 중요합니다.",
    metal: "자녀에게 올바른 가치관을 가르치세요. 삶의 지혜와 판단력을 키워주세요.",
    water: "자녀의 감정에 귀 기울이세요. 대화를 통해 깊은 유대감을 형성하세요."
  };

  return {
    overallRelation,
    educationAdvice: educationAdvices[dayMasterElement],
    conflictPatterns,
    supportAdvice: supportAdvices[dayMasterElement]
  };
}

// ============================================
// 무자녀 분석
// ============================================

interface NoChildrenContent {
  futurePossibility: string;
  alternativeFulfillment: string;
}

function analyzeNoChildrenContent(
  dayMasterElement: FiveElement,
  gender: Gender,
  sipsinCount: Record<string, number>
): NoChildrenContent {
  // 자녀 별 분석
  let childStarCount: number;
  if (gender === "male") {
    childStarCount = sipsinCount["편관"] + sipsinCount["정관"];
  } else {
    childStarCount = sipsinCount["식신"] + sipsinCount["상관"];
  }

  let futurePossibility = "";
  if (childStarCount >= 1) {
    futurePossibility = "사주에 자녀 별이 있어 향후 자녀를 가질 가능성이 있습니다. 때가 되면 자연스럽게 인연이 닿을 것입니다.";
  } else {
    futurePossibility = "사주에 자녀 별이 약해 자녀에 대한 인연이 강하지 않습니다. 자녀 계획은 신중하게 결정하세요.";
  }

  // 대안적 성취
  const alternativeFulfillments: Record<FiveElement, string> = {
    wood: "자녀 대신 멘티나 후배를 키우는 것으로 성취감을 느낄 수 있습니다. 교육이나 지도에서 보람을 찾으세요.",
    fire: "창작 활동이나 프로젝트를 통해 자녀를 키우는 것과 같은 성취감을 느낄 수 있습니다. 열정을 쏟을 수 있는 일을 찾으세요.",
    earth: "가족이나 주변 사람들을 돌보는 것에서 만족을 느낄 수 있습니다. 공동체에 기여하는 삶을 살아보세요.",
    metal: "전문 분야에서의 성취나 가르침을 통해 보람을 느낄 수 있습니다. 지식과 경험을 나누세요.",
    water: "예술이나 영적 활동을 통해 내적 성취를 느낄 수 있습니다. 깊이 있는 관계를 형성하세요."
  };

  return {
    futurePossibility,
    alternativeFulfillment: alternativeFulfillments[dayMasterElement]
  };
}

// ============================================
// 가족 화합 분석
// ============================================

interface FamilyHarmony {
  score: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

function analyzeFamilyHarmony(
  dayMasterElement: FiveElement,
  sipsinCount: Record<string, number>,
  sinGangSinYak: string
): FamilyHarmony {
  let score = 60;
  const strengthAreas: string[] = [];
  const improvementAreas: string[] = [];

  // 인성이 있으면 가족 화합 점수 상승
  if (sipsinCount["정인"] >= 1) {
    score += 10;
    strengthAreas.push("가족 간 정서적 유대가 강함");
  }

  // 비겁이 적당하면 형제 관계 좋음
  if (sipsinCount["비견"] + sipsinCount["겁재"] === 1) {
    score += 5;
    strengthAreas.push("형제자매와 적절한 관계 유지");
  } else if (sipsinCount["비견"] + sipsinCount["겁재"] >= 2) {
    improvementAreas.push("형제 간 경쟁이나 갈등 주의");
  }

  // 재성이 있으면 경제적 안정
  if (sipsinCount["정재"] + sipsinCount["편재"] >= 1) {
    score += 5;
    strengthAreas.push("가정의 경제적 기반 안정");
  } else {
    improvementAreas.push("가정 경제 관리에 신경 필요");
  }

  // 오행별 강점/약점
  const elementStrengths: Record<FiveElement, string> = {
    wood: "가족 성장을 함께 도모함",
    fire: "활기차고 따뜻한 가정 분위기",
    earth: "안정적이고 든든한 가정",
    metal: "원칙이 있는 체계적인 가정",
    water: "정서적으로 깊이 연결된 가정"
  };
  strengthAreas.push(elementStrengths[dayMasterElement]);

  const elementWeaknesses: Record<FiveElement, string> = {
    wood: "개인 성장에 집중하느라 가족 시간 부족",
    fire: "감정 기복으로 가족 갈등",
    earth: "변화를 싫어해 관계가 정체될 수 있음",
    metal: "비판적 태도로 가족에게 상처줄 수 있음",
    water: "감정에 휩쓸려 객관성 부족"
  };
  improvementAreas.push(elementWeaknesses[dayMasterElement]);

  // 신강/신약 조정
  if (sinGangSinYak === "신강") {
    improvementAreas.push("가족에게 자기 주장을 강요하지 않도록 주의");
  } else if (sinGangSinYak === "신약") {
    strengthAreas.push("가족의 지원에 감사하는 마음");
  }

  return {
    score: Math.min(100, score),
    strengthAreas,
    improvementAreas
  };
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

function generateFamilyNarrative(
  dayMasterElement: FiveElement,
  sinGangSinYak: string,
  hasChildren: boolean,
  parentsFortune: Chapter15Result["parentsFortune"],
  siblingsFortune: Chapter15Result["siblingsFortune"],
  familyHarmony: Chapter15Result["familyHarmony"],
  childrenFortune?: Chapter15Result["childrenFortune"],
  noChildrenContent?: Chapter15Result["noChildrenContent"]
): ChapterNarrative {
  const elementKr = ELEMENT_NAMES_KR[dayMasterElement];
  const strengthText = sinGangSinYak === "신강" ? "독립적이고 자기 주장이 강한" : sinGangSinYak === "신약" ? "가족에게 의지하고 조화를 추구하는" : "균형 잡힌";

  // 신강신약 조합별 상수 가져오기
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthNarrative = FAMILY_STRENGTH_NARRATIVES[dayMasterElement][strengthKey];

  // intro
  const intro = `${elementKr} 오행의 기운과 ${strengthText} 사주 특성이 가족 관계에 어떤 영향을 미치는지 분석해 드립니다. 부모님, 형제자매${hasChildren ? ", 자녀" : ""}와의 관계를 살펴보고, 더 화목한 가정을 만들기 위한 조언을 확인하세요.`;

  // 메인 분석 - 신강신약 조합별 상수 활용
  const mainAnalysis = `가족 화합 점수는 ${familyHarmony.score}점으로 평가됩니다.\n\n【부모님과의 관계】\n${strengthNarrative.parentRelation}\n\n【형제자매와의 관계】\n${strengthNarrative.siblingRelation}\n\n【가정에서의 역할】\n${strengthNarrative.familyRole}`;

  const details: string[] = [];

  // 부모운 - 신강신약 조합별 상수 활용
  details.push(`• 부모님 관계: ${strengthNarrative.parentRelation}`);
  details.push(`• 아버지 관계: ${parentsFortune.fatherRelation.score}점 - ${parentsFortune.fatherRelation.analysis}`);
  details.push(`• 어머니 관계: ${parentsFortune.motherRelation.score}점 - ${parentsFortune.motherRelation.analysis}`);
  details.push(`• 상속운: ${parentsFortune.inheritanceFortune}`);
  details.push(`• 부모님 지원: ${parentsFortune.supportFromParents}`);

  // 형제운 - 신강신약 조합별 상수 활용
  details.push(`• 형제자매 관계: ${strengthNarrative.siblingRelation}`);
  details.push(`• 형제 협력: ${siblingsFortune.cooperation}`);
  details.push(`• 형제 관계 조언: ${siblingsFortune.advice}`);

  // 자녀운 (자녀 있는 경우) - 신강신약 조합별 상수 활용
  if (hasChildren && childrenFortune) {
    details.push(`• 자녀 관계: ${strengthNarrative.childrenRelation}`);
    details.push(`• 교육 조언: ${childrenFortune.educationAdvice}`);
    if (childrenFortune.conflictPatterns.length > 0) {
      details.push(`• 자녀 갈등 패턴: ${childrenFortune.conflictPatterns.join(", ")}`);
    }
    details.push(`• 자녀 지원 조언: ${childrenFortune.supportAdvice}`);
  }

  // 무자녀 (자녀 없는 경우)
  if (!hasChildren && noChildrenContent) {
    details.push(`• 향후 자녀 가능성: ${noChildrenContent.futurePossibility}`);
    details.push(`• 대안적 성취: ${noChildrenContent.alternativeFulfillment}`);
  }

  // 가정에서의 역할 - 신강신약 조합별 상수 활용
  details.push(`• 가정에서의 역할: ${strengthNarrative.familyRole}`);

  // 가족 화합
  details.push(`• 가족 화합 점수: ${familyHarmony.score}점`);
  if (familyHarmony.strengthAreas.length > 0) {
    details.push(`• 강점 영역: ${familyHarmony.strengthAreas.join(", ")}`);
  }
  if (familyHarmony.improvementAreas.length > 0) {
    details.push(`• 개선 영역: ${familyHarmony.improvementAreas.join(", ")}`);
  }

  // 조언 - 신강신약 조합별 상수 활용
  let advice = "";
  if (hasChildren && childrenFortune) {
    advice = `【가족 화합을 위한 조언】\n\n${strengthNarrative.harmonyAdvice}\n\n【자녀와의 관계】\n${strengthNarrative.childrenRelation}\n\n【자녀 양육 방향】\n${childrenFortune.supportAdvice}\n\n가족은 서로 다른 개성을 가진 사람들이 모인 공동체입니다. 각자의 개성을 존중하면서 화합을 추구하는 것이 중요합니다.`;
  } else {
    advice = `【가족 화합을 위한 조언】\n\n${strengthNarrative.harmonyAdvice}\n\n가족 관계는 노력으로 더 좋아질 수 있습니다. 정기적인 소통과 관심이 화목한 가정의 열쇠입니다.`;
  }

  // 마무리
  const closing = "가족은 우리 삶의 가장 든든한 버팀목입니다. 서로에 대한 이해와 존중, 그리고 꾸준한 관심으로 더욱 화목한 가정을 만들어 가기 바랍니다.";

  return { intro, mainAnalysis, details, advice, closing };
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter15(
  sajuResult: SajuApiResult,
  gender: Gender,
  hasChildren: boolean,
  sinGangSinYak: string
): Chapter15Result {
  // 기본 분석
  const dayMasterElement = getDayMasterElement(sajuResult);
  const sipsinCount = analyzeSipsin(sajuResult);

  // 부모운
  const parentsFortune = analyzeParentsFortune(dayMasterElement, sipsinCount, sinGangSinYak);

  // 형제운
  const siblingsFortune = analyzeSiblingsFortune(dayMasterElement, sipsinCount);

  // 가족 화합
  const familyHarmony = analyzeFamilyHarmony(dayMasterElement, sipsinCount, sinGangSinYak);

  // 결과 구성
  const result: Chapter15Result = {
    hasChildren,
    parentsFortune,
    siblingsFortune,
    familyHarmony
  };

  // 자녀 유무에 따른 분기
  if (hasChildren) {
    result.childrenFortune = analyzeChildrenFortuneContent(
      dayMasterElement,
      gender,
      sipsinCount,
      sinGangSinYak
    );
  } else {
    result.noChildrenContent = analyzeNoChildrenContent(
      dayMasterElement,
      gender,
      sipsinCount
    );
  }

  // 서술형 Narrative 생성
  result.narrative = generateFamilyNarrative(
    dayMasterElement,
    sinGangSinYak,
    hasChildren,
    parentsFortune,
    siblingsFortune,
    familyHarmony,
    result.childrenFortune,
    result.noChildrenContent
  );

  return result;
}
