/**
 * 제17장: 주의 시기·개운법
 */

import type { SajuApiResult, FiveElement, Gender } from "@/types/saju";
import type { Chapter17Result, ChapterNarrative } from "@/types/expert";

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

const WARNING_STRENGTH_NARRATIVES: Record<FiveElement, Record<StrengthType, {
  riskPattern: string;
  strengthWeakness: string;
  remedyApproach: string;
  dailyPractice: string;
  mindsetAdvice: string;
}>> = {
  wood: {
    신강: {
      riskPattern: "목 기운이 강한 신강 사주는 과욕, 무리한 도전, 과로에서 위험이 생깁니다. 너무 앞서 나가려다 실패하거나, 몸이 따라가지 못할 수 있습니다. 분노 조절이 안 되면 대인관계와 건강 모두 해칩니다. 특히 간 건강과 혈압에 주의하세요.",
      strengthWeakness: "강한 추진력과 리더십이 장점이지만, 고집과 과욕이 단점입니다. 남의 말을 듣지 않고 밀어붙이다가 큰 낭패를 볼 수 있습니다. 분노가 폭발하면 회복이 어렵습니다.",
      remedyApproach: "용신의 기운을 보강하되, 화(火) 오행으로 에너지를 발산하세요. 운동이나 창작 활동으로 과잉 에너지를 해소하면 좋습니다. 분노를 다스리는 명상이나 호흡법도 추천합니다.",
      dailyPractice: "아침 스트레칭으로 하루를 시작하세요. 분노가 올라올 때 10초를 세고 반응하세요. 녹색 식물을 곁에 두고 자연의 기운을 느끼세요. 과로하지 말고 휴식을 챙기세요.",
      mindsetAdvice: "느려도 괜찮습니다. 혼자 다 하려 하지 말고 도움을 받으세요. 이기는 것보다 함께 가는 것이 더 멀리 갑니다. 분노를 내려놓고 여유를 가지세요."
    },
    신약: {
      riskPattern: "목 기운이 약한 신약 사주는 자신감 부족, 결단력 저하에서 위험이 생깁니다. 기회가 와도 잡지 못하고, 시작은 있는데 완주가 어렵습니다. 남의 눈치를 보다가 자기 것을 놓칠 수 있습니다. 면역력 저하와 피로에 주의하세요.",
      strengthWeakness: "배려심과 협력 능력이 장점이지만, 우유부단함과 의존성이 단점입니다. 결정을 미루다가 타이밍을 놓치고, 남에게 끌려다닐 수 있습니다.",
      remedyApproach: "용신인 수(水) 오행으로 에너지를 보충하세요. 자신감을 키우는 활동과 작은 성공 경험을 쌓으세요. 스스로 결정하는 연습을 하고, 지지해주는 사람들과 함께하세요.",
      dailyPractice: "매일 작은 목표를 세우고 달성하세요. 스스로 결정하는 연습을 하세요. 물을 충분히 말고 수분을 유지하세요. 자신을 인정하는 긍정적 자기 대화를 하세요.",
      mindsetAdvice: "당신도 충분히 잘하고 있습니다. 남과 비교하지 말고 어제의 자신과 비교하세요. 작은 것부터 스스로 결정하면 자신감이 생깁니다. 도움받는 것도 능력입니다."
    },
    중화: {
      riskPattern: "목 기운이 조화로운 중화 사주는 균형이 깨질 때 위험이 생깁니다. 과도한 스트레스나 환경 변화가 균형을 무너뜨릴 수 있습니다. 현상에 안주하다 성장을 멈추거나, 변화에 너무 민감해질 수 있습니다.",
      strengthWeakness: "균형 잡힌 시각과 적응력이 장점이지만, 뚜렷한 강점이 없어 보일 수 있습니다. 어정쩡한 위치에서 앞으로 나가기 어려울 때가 있습니다.",
      remedyApproach: "현재의 균형을 유지하면서 조금씩 도전하세요. 극단적인 변화보다 점진적인 성장이 맞습니다. 자신의 강점을 찾아 더 발전시키세요.",
      dailyPractice: "규칙적인 일상을 유지하면서 작은 변화를 더하세요. 균형 잡힌 식단과 수면을 유지하세요. 자연 속에서 시간을 보내며 에너지를 충전하세요.",
      mindsetAdvice: "균형이 당신의 강점입니다. 남들처럼 극적이지 않아도 됩니다. 꾸준함이 결국 승리합니다. 현재에 감사하면서 조금씩 성장하세요."
    }
  },
  fire: {
    신강: {
      riskPattern: "화 기운이 강한 신강 사주는 충동, 감정 폭발, 무모한 행동에서 위험이 생깁니다. 화가 나면 후회할 말과 행동을 하고, 열정이 넘쳐 무리할 수 있습니다. 심장, 혈압, 눈 건강에 주의하세요. 화재, 화상에도 조심하세요.",
      strengthWeakness: "열정과 추진력이 장점이지만, 충동성과 감정 기복이 단점입니다. 빠른 시작은 좋지만 끝이 안 좋을 수 있습니다. 관계를 태워먹을 수 있습니다.",
      remedyApproach: "용신의 기운을 보강하되, 토(土) 오행으로 에너지를 안정시키세요. 차분한 활동과 명상으로 열기를 식히세요. 물을 가까이하고 시원한 환경을 만드세요.",
      dailyPractice: "화가 날 때 10초를 세고 반응하세요. 찬물을 마시거나 시원한 곳에서 진정하세요. 충동적 결정을 피하고 하루 생각해보세요. 감사 일기를 쓰며 긍정적 에너지를 유지하세요.",
      mindsetAdvice: "뜨거운 것도 좋지만 태우면 남는 게 없습니다. 잠시 멈추고 생각하세요. 열정은 유지하되 통제하세요. 화해가 이기는 것보다 낫습니다."
    },
    신약: {
      riskPattern: "화 기운이 약한 신약 사주는 열정 상실, 우울감, 의욕 저하에서 위험이 생깁니다. 시작해도 금방 식고, 사람들 앞에 나서기 어렵습니다. 추위를 타고 순환이 안 될 수 있습니다. 심장, 혈액순환에 주의하세요.",
      strengthWeakness: "차분함과 사려깊음이 장점이지만, 소극성과 위축이 단점입니다. 기회가 와도 나서지 못하고, 존재감이 약해질 수 있습니다.",
      remedyApproach: "용신인 목(木) 오행으로 에너지를 생성하세요. 활동적인 취미와 사교 활동으로 열기를 올리세요. 따뜻한 환경과 밝은 색상을 활용하세요.",
      dailyPractice: "매일 30분 이상 몸을 움직이세요. 밝고 따뜻한 색상의 옷을 입으세요. 사람들과 어울리는 시간을 만드세요. 자신의 장점을 인정하고 표현하세요.",
      mindsetAdvice: "당신 안에도 불꽃이 있습니다. 작은 것부터 시작해서 열정을 키우세요. 나서는 연습을 하세요. 움츠러들지 말고 펼쳐보세요."
    },
    중화: {
      riskPattern: "화 기운이 조화로운 중화 사주는 지나친 안정 추구나 변화에의 저항에서 위험이 생깁니다. 열정과 안정 사이에서 방향을 잃을 수 있습니다. 현상 유지에 안주하면 도태될 수 있습니다.",
      strengthWeakness: "열정과 차분함의 균형이 장점이지만, 어느 쪽으로도 확실하지 않을 수 있습니다. 결정적 순간에 힘을 발휘하기 어려울 때가 있습니다.",
      remedyApproach: "균형을 유지하면서 필요할 때 열정을 발휘하세요. 중요한 순간에는 과감하게 나서세요. 일상에서 작은 모험을 즐기세요.",
      dailyPractice: "규칙적인 일상에 가끔 새로운 시도를 더하세요. 열정적인 취미를 유지하세요. 사람들과 교류하며 에너지를 주고받으세요.",
      mindsetAdvice: "균형이 당신의 강점입니다. 필요할 때 불꽃을 피울 줄 알면 됩니다. 모든 순간 타오를 필요는 없습니다. 때를 기다렸다가 폭발하세요."
    }
  },
  earth: {
    신강: {
      riskPattern: "토 기운이 강한 신강 사주는 고집, 변화 거부, 정체에서 위험이 생깁니다. 새로운 것을 받아들이지 않고 고집부리다가 시대에 뒤처질 수 있습니다. 소화기 문제, 비만, 당뇨에 주의하세요. 부동산, 계약 문제도 조심하세요.",
      strengthWeakness: "안정감과 신뢰성이 장점이지만, 고집불통과 융통성 부족이 단점입니다. 변화를 두려워하면 기회를 놓칩니다.",
      remedyApproach: "용신의 기운을 보강하되, 금(金) 오행으로 에너지를 흘려보내세요. 새로운 것을 배우고 변화를 수용하세요. 가벼운 운동으로 기운을 순환시키세요.",
      dailyPractice: "매일 새로운 것 하나씩 시도하세요. 식사량을 조절하고 규칙적으로 운동하세요. 다른 사람의 의견에 귀 기울이세요. 정리정돈으로 에너지를 순환시키세요.",
      mindsetAdvice: "안정도 중요하지만 변화도 필요합니다. 고집을 내려놓으면 더 넓은 세상이 보입니다. 가끔은 새로운 길을 가보세요. 유연함이 진정한 힘입니다."
    },
    신약: {
      riskPattern: "토 기운이 약한 신약 사주는 불안정, 자신감 부족, 기반 없음에서 위험이 생깁니다. 의지할 곳이 없다고 느끼고, 경제적·정서적으로 불안할 수 있습니다. 소화 불량, 피로, 무기력에 주의하세요.",
      strengthWeakness: "유연성과 적응력이 장점이지만, 불안정함과 자신감 부족이 단점입니다. 기반을 다지지 못해 흔들릴 수 있습니다.",
      remedyApproach: "용신인 화(火) 오행으로 에너지를 보충하세요. 안정적인 기반을 다지는 활동에 집중하세요. 지지해주는 사람들과 함께하세요.",
      dailyPractice: "작은 것부터 안정적인 습관을 만드세요. 따뜻한 음식을 규칙적으로 드세요. 신뢰할 수 있는 사람들과 관계를 유지하세요. 자신의 공간을 아늑하게 꾸미세요.",
      mindsetAdvice: "기반은 스스로 만들어가는 것입니다. 작은 것부터 쌓아가세요. 불안할 때 도움을 요청해도 됩니다. 당신도 충분히 안정을 만들 수 있습니다."
    },
    중화: {
      riskPattern: "토 기운이 조화로운 중화 사주는 과도한 안정 추구나 변화 회피에서 위험이 생깁니다. 현상 유지에 안주하면 성장이 멈춥니다. 균형 잡힌 것이 오히려 특색 없어 보일 수 있습니다.",
      strengthWeakness: "안정과 유연함의 균형이 장점이지만, 뚜렷한 강점이 부족해 보일 수 있습니다. 결정적 순간에 돋보이기 어려울 때가 있습니다.",
      remedyApproach: "균형을 유지하면서 조금씩 영역을 확장하세요. 안정적인 기반 위에서 새로운 도전을 하세요. 자신만의 강점을 찾아 발전시키세요.",
      dailyPractice: "안정적인 일상을 유지하면서 작은 모험을 더하세요. 새로운 것을 배우고 경험하세요. 자신만의 전문 영역을 만들어가세요.",
      mindsetAdvice: "균형이 당신의 힘입니다. 튀지 않아도 됩니다. 꾸준히 쌓아가면 결국 큰 성취가 됩니다. 안정 속에서 성장을 추구하세요."
    }
  },
  metal: {
    신강: {
      riskPattern: "금 기운이 강한 신강 사주는 완벽주의, 비판, 냉정함에서 위험이 생깁니다. 남을 비판하고 잘못을 지적하다가 관계가 망가질 수 있습니다. 자신에게도 엄격해서 스트레스를 받습니다. 폐, 호흡기, 피부에 주의하세요. 법적 분쟁도 조심하세요.",
      strengthWeakness: "명확함과 체계성이 장점이지만, 냉정함과 비판적 태도가 단점입니다. 상처를 주는 말로 관계를 해칠 수 있습니다.",
      remedyApproach: "용신의 기운을 보강하되, 수(水) 오행으로 에너지를 부드럽게 하세요. 비판보다 칭찬을, 지적보다 공감을 먼저 하세요. 호흡 운동과 명상으로 마음을 누그러뜨리세요.",
      dailyPractice: "매일 한 사람에게 칭찬이나 감사를 표현하세요. 호흡 운동이나 명상을 하세요. 완벽하지 않아도 괜찮다고 스스로에게 말하세요. 따뜻한 말을 연습하세요.",
      mindsetAdvice: "옳은 것보다 따뜻한 것이 더 중요할 때가 있습니다. 비판을 줄이고 이해를 늘리세요. 완벽하지 않아도 괜찮습니다. 부드러움이 진정한 강함입니다."
    },
    신약: {
      riskPattern: "금 기운이 약한 신약 사주는 예민함, 자존감 저하, 결정 장애에서 위험이 생깁니다. 남의 말에 상처받고, 자신을 비난합니다. 결정을 미루고 우유부단해질 수 있습니다. 호흡기, 면역력에 주의하세요.",
      strengthWeakness: "섬세함과 감수성이 장점이지만, 예민함과 자기비판이 단점입니다. 작은 일에도 크게 상처받고 오래 갑니다.",
      remedyApproach: "용신인 토(土) 오행으로 에너지를 안정시키세요. 자존감을 키우는 활동과 성공 경험을 쌓으세요. 자신을 있는 그대로 받아들이세요.",
      dailyPractice: "매일 자신에게 칭찬하세요. 작은 결정도 스스로 내리는 연습을 하세요. 규칙적인 호흡 운동으로 안정감을 찾으세요. 자신을 비난하는 생각을 알아차리고 멈추세요.",
      mindsetAdvice: "당신은 생각보다 괜찮은 사람입니다. 남의 말에 너무 휘둘리지 마세요. 모든 것을 분석하지 말고 흘려보내세요. 자신을 사랑하는 것이 먼저입니다."
    },
    중화: {
      riskPattern: "금 기운이 조화로운 중화 사주는 너무 합리적이거나 감정을 억압하는 데서 위험이 생깁니다. 감정을 무시하면 결국 터집니다. 관계에서 거리감이 느껴질 수 있습니다.",
      strengthWeakness: "명확함과 따뜻함의 균형이 장점이지만, 어느 쪽으로도 확실하지 않을 수 있습니다. 감정 표현이 서툴러 보일 때가 있습니다.",
      remedyApproach: "균형을 유지하면서 감정 표현을 연습하세요. 합리성과 함께 따뜻함도 보여주세요. 때로는 불완전한 모습도 드러내세요.",
      dailyPractice: "감정을 알아차리고 표현하는 연습을 하세요. 가끔은 논리를 내려놓고 마음을 따르세요. 따뜻한 관계를 위해 먼저 다가가세요.",
      mindsetAdvice: "항상 옳을 필요 없습니다. 감정도 중요합니다. 완벽한 균형보다 진솔한 관계가 낫습니다. 가끔은 어수선해도 괜찮습니다."
    }
  },
  water: {
    신강: {
      riskPattern: "수 기운이 강한 신강 사주는 과도한 생각, 감정에 빠지기, 변덕에서 위험이 생깁니다. 너무 깊이 파고들어 우울해지거나, 이것저것 손대다 끝을 못 봅니다. 신장, 방광, 생식기에 주의하세요. 금전 손실도 조심하세요.",
      strengthWeakness: "직관력과 적응력이 장점이지만, 변덕과 감정 과잉이 단점입니다. 깊이 빠지면 헤어나오기 어렵습니다.",
      remedyApproach: "용신의 기운을 보강하되, 목(木) 오행으로 에너지를 생성하세요. 생각을 행동으로 옮기고, 목표에 집중하세요. 밖으로 나가 활동하고 에너지를 순환시키세요.",
      dailyPractice: "생각만 하지 말고 행동으로 옮기세요. 하나에 집중하고 끝까지 해보세요. 물을 가까이하되 따뜻하게 유지하세요. 우울해지면 밖으로 나가세요.",
      mindsetAdvice: "생각이 많은 것은 장점이지만 행동이 필요합니다. 모든 것을 다 알려 하지 마세요. 흘러가듯 가볍게, 하지만 방향은 유지하세요. 깊이와 가벼움의 균형을 찾으세요."
    },
    신약: {
      riskPattern: "수 기운이 약한 신약 사주는 두려움, 의존, 방향 상실에서 위험이 생깁니다. 흐름을 읽지 못하고 기회를 놓칩니다. 남에게 휘둘리고 주체성을 잃을 수 있습니다. 신장 기능, 부종, 피로에 주의하세요.",
      strengthWeakness: "안정 추구와 신중함이 장점이지만, 두려움과 의존성이 단점입니다. 변화가 두려워 제자리걸음 할 수 있습니다.",
      remedyApproach: "용신인 금(金) 오행으로 에너지를 보충하세요. 자신감을 키우고 독립심을 길러세요. 작은 것부터 스스로 결정하고 행동하세요.",
      dailyPractice: "물을 충분히 마시세요. 작은 것부터 스스로 결정하세요. 두려움에 맞서는 작은 도전을 하세요. 자신의 직관을 믿는 연습을 하세요.",
      mindsetAdvice: "두려워도 한 발을 내딛으세요. 당신의 직관도 맞을 때가 있습니다. 흐름을 따르되 자신의 방향도 가지세요. 의존에서 벗어나 자립의 기쁨을 느껴보세요."
    },
    중화: {
      riskPattern: "수 기운이 조화로운 중화 사주는 지나친 유연함이나 방향 상실에서 위험이 생깁니다. 너무 흘러가다 보면 목표를 잃을 수 있습니다. 균형 잡힌 것이 오히려 특색 없어 보일 수 있습니다.",
      strengthWeakness: "직관과 안정의 균형이 장점이지만, 뚜렷한 방향이 없어 보일 수 있습니다. 깊이와 가벼움 사이에서 갈팡질팡할 때가 있습니다.",
      remedyApproach: "균형을 유지하면서 명확한 목표를 세우세요. 직관을 따르되 계획도 세우세요. 깊이 있는 관계와 다양한 경험의 균형을 찾으세요.",
      dailyPractice: "목표를 명확히 하고 매일 조금씩 나아가세요. 직관과 논리를 함께 사용하세요. 깊은 관계와 다양한 만남의 균형을 유지하세요.",
      mindsetAdvice: "흐르되 방향을 잃지 마세요. 균형이 당신의 힘입니다. 깊이와 넓이를 모두 가지세요. 유연함 속에 단단함을 유지하세요."
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

// 용신(필요 오행) 결정
function determineYongsin(
  dayMasterElement: FiveElement,
  sinGangSinYak: string
): FiveElement {
  const elementRelations: Record<FiveElement, {
    generates: FiveElement;
    generatedBy: FiveElement;
    controls: FiveElement;
    controlledBy: FiveElement;
  }> = {
    wood: { generates: "fire", generatedBy: "water", controls: "earth", controlledBy: "metal" },
    fire: { generates: "earth", generatedBy: "wood", controls: "metal", controlledBy: "water" },
    earth: { generates: "metal", generatedBy: "fire", controls: "water", controlledBy: "wood" },
    metal: { generates: "water", generatedBy: "earth", controls: "wood", controlledBy: "fire" },
    water: { generates: "wood", generatedBy: "metal", controls: "fire", controlledBy: "earth" }
  };

  const relations = elementRelations[dayMasterElement];

  // 신강: 나를 설하거나 극하는 오행이 용신
  // 신약: 나를 생해주거나 같은 오행이 용신
  if (sinGangSinYak === "신강") {
    return relations.generates; // 식상 (설기)
  } else if (sinGangSinYak === "신약") {
    return relations.generatedBy; // 인성 (생조)
  } else {
    return dayMasterElement; // 중화는 비겁
  }
}

// ============================================
// 위험 시기 분석
// ============================================

interface ComprehensiveRiskPeriod {
  year: number;
  riskLevel: "높음" | "중간" | "낮음";
  riskAreas: string[];
  advice: string;
  score: number;  // 8장과 동일한 점수 기반 계산 (0-100)
}

function analyzeRiskPeriods(
  _sajuResult: SajuApiResult,
  dayMasterElement: FiveElement,
  currentYear: number,
  currentAge: number,
  yongsinElement: FiveElement,
  sinGangSinYak: string
): ComprehensiveRiskPeriod[] {
  const riskPeriods: ComprehensiveRiskPeriod[] = [];

  // 향후 10년 분석
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const age = currentAge + i;

    // 8장과 동일한 점수 기반 위험도 계산 (용신 고려)
    const yearElement = getYearElement(year);
    const score = calculateYearScore(dayMasterElement, yearElement, yongsinElement, sinGangSinYak);
    const risk = scoreToRiskLevel(score, yearElement);

    const riskAreas: string[] = [];
    let advice = "";

    if (risk.level !== "낮음") {
      // 오행별 위험 영역
      const elementRisks: Record<FiveElement, string[]> = {
        wood: ["간 건강", "분노 조절", "과로"],
        fire: ["심장 건강", "감정 기복", "화재 주의"],
        earth: ["소화기 건강", "부동산 문제", "과식"],
        metal: ["호흡기 건강", "법적 문제", "대인관계 갈등"],
        water: ["신장 건강", "금전 손실", "우울감"]
      };

      riskAreas.push(...elementRisks[risk.conflictElement].slice(0, 2));

      if (age % 10 === 0) {
        riskAreas.push("대운 교체기");
      }

      advice = generateRiskAdvice(risk.level, riskAreas);
    } else {
      advice = "특별한 위험 요소 없이 안정적인 해입니다. 현재의 계획을 꾸준히 실행하세요.";
    }

    riskPeriods.push({
      year,
      riskLevel: risk.level,
      riskAreas,
      advice,
      score
    });
  }

  return riskPeriods;
}

function getYearElement(year: number): FiveElement {
  // 연도의 천간으로 오행 결정 (간략화)
  const stems: HeavenlyStemKr[] = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const stemIndex = (year - 4) % 10;
  const stem = stems[stemIndex];

  const stemElementMap: Record<HeavenlyStemKr, FiveElement> = {
    갑: "wood", 을: "wood",
    병: "fire", 정: "fire",
    무: "earth", 기: "earth",
    경: "metal", 신: "metal",
    임: "water", 계: "water"
  };

  return stemElementMap[stem];
}

/**
 * 8장과 동일한 점수 기반 연도 운세 계산
 * 용신을 고려하여 일관된 점수 산출
 */
function calculateYearScore(
  dayMasterElement: FiveElement,
  yearElement: FiveElement,
  yongsinElement: FiveElement,
  sinGangSinYak: string
): number {
  const elementRelations: Record<FiveElement, {
    generates: FiveElement;
    generatedBy: FiveElement;
    controls: FiveElement;
    controlledBy: FiveElement;
  }> = {
    wood: { generates: "fire", generatedBy: "water", controls: "earth", controlledBy: "metal" },
    fire: { generates: "earth", generatedBy: "wood", controls: "metal", controlledBy: "water" },
    earth: { generates: "metal", generatedBy: "fire", controls: "water", controlledBy: "wood" },
    metal: { generates: "water", generatedBy: "earth", controls: "wood", controlledBy: "fire" },
    water: { generates: "wood", generatedBy: "metal", controls: "fire", controlledBy: "earth" }
  };

  const relations = elementRelations[dayMasterElement];
  let baseRating = 50;
  const isStrong = sinGangSinYak === "신강";

  // 용신운 여부 (가장 중요) - 8장과 동일
  if (yearElement === yongsinElement) {
    baseRating += 30;
  }

  // 오행 관계에 따른 점수 - 8장과 동일
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
 * 점수를 기반으로 위험도 레벨 결정
 * 8장의 getRelationToYongsinByScore와 동일한 기준 적용
 */
function scoreToRiskLevel(
  score: number,
  yearElement: FiveElement
): { level: "높음" | "중간" | "낮음"; conflictElement: FiveElement } {
  // 8장 기준: 70점 이상 = 길운, 45점 이하 = 흉운
  if (score >= 70) {
    return { level: "낮음", conflictElement: yearElement };  // 낮음 = 위험 낮음 = 좋은 해
  } else if (score <= 45) {
    return { level: "높음", conflictElement: yearElement };  // 높음 = 위험 높음 = 나쁜 해
  } else {
    return { level: "중간", conflictElement: yearElement };
  }
}

function generateRiskAdvice(riskLevel: "높음" | "중간" | "낮음", riskAreas: string[]): string {
  if (riskLevel === "높음") {
    return `주의가 필요한 해입니다. ${riskAreas.join(", ")}에 특히 신경 쓰세요. 중요한 결정은 신중하게 하고, 건강 검진을 받아보세요.`;
  } else if (riskLevel === "중간") {
    return `보통 수준의 주의가 필요합니다. ${riskAreas.join(", ")}을(를) 조심하되, 과도하게 위축될 필요는 없습니다.`;
  }
  return "";
}

// ============================================
// 연도별 등급
// ============================================

interface YearlyRiskRating {
  year: number;
  grade: "A" | "B" | "C" | "D" | "F";
  summary: string;
}

/**
 * 점수 기반으로 연도별 등급 계산
 * 8장의 점수 체계와 일관성 유지
 * - 70점 이상: A등급 (길운)
 * - 55-69점: B등급 (양호)
 * - 46-54점: C등급 (평운)
 * - 45점 이하: D등급 (흉운)
 */
function calculateYearlyRatings(
  riskPeriods: ComprehensiveRiskPeriod[]
): YearlyRiskRating[] {
  return riskPeriods.map(period => {
    let grade: "A" | "B" | "C" | "D" | "F";
    let summary = "";
    const score = period.score;

    // 점수 기반 등급 결정 (8장과 일관성 유지)
    if (score >= 70) {
      grade = "A";
      summary = "운이 좋은 해입니다. 새로운 시작과 도전에 좋습니다.";
    } else if (score >= 55) {
      grade = "B";
      summary = "양호한 해입니다. 꾸준히 노력하면 좋은 결과가 있습니다.";
    } else if (score >= 46) {
      grade = "C";
      summary = "보통의 해입니다. 현상 유지에 집중하세요.";
    } else {
      grade = "D";
      summary = "주의가 필요한 해입니다. 건강과 재정 관리에 신중함이 필요합니다.";
    }

    return {
      year: period.year,
      grade,
      summary
    };
  });
}

// ============================================
// 용신 개운법
// ============================================

interface YongsinRemedy {
  yongsin: FiveElement;
  colors: string[];
  directions: string[];
  numbers: number[];
  foods: string[];
  activities: string[];
  avoidElements: FiveElement[];
}

function generateYongsinRemedy(
  yongsin: FiveElement,
  dayMasterElement: FiveElement
): YongsinRemedy {
  const elementColors: Record<FiveElement, string[]> = {
    wood: ["초록색", "청록색", "연두색"],
    fire: ["빨간색", "주황색", "분홍색"],
    earth: ["노란색", "베이지색", "갈색"],
    metal: ["흰색", "은색", "금색"],
    water: ["검정색", "파란색", "남색"]
  };

  const elementDirections: Record<FiveElement, string[]> = {
    wood: ["동쪽", "동남쪽"],
    fire: ["남쪽"],
    earth: ["중앙", "동북쪽", "서남쪽"],
    metal: ["서쪽", "서북쪽"],
    water: ["북쪽"]
  };

  const elementNumbers: Record<FiveElement, number[]> = {
    wood: [3, 8],
    fire: [2, 7],
    earth: [5, 10],
    metal: [4, 9],
    water: [1, 6]
  };

  const elementFoods: Record<FiveElement, string[]> = {
    wood: ["녹색 채소", "신맛 음식", "나물류", "부추", "미나리"],
    fire: ["쓴맛 음식", "붉은 음식", "토마토", "고추", "커피"],
    earth: ["단맛 음식", "곡류", "고구마", "호박", "대추"],
    metal: ["매운 음식", "흰 음식", "무", "배", "도라지"],
    water: ["짠맛 음식", "검은 음식", "검은콩", "해조류", "흑임자"]
  };

  const elementActivities: Record<FiveElement, string[]> = {
    wood: ["등산", "조깅", "스트레칭", "식물 기르기", "독서"],
    fire: ["춤", "운동", "파티", "예술 활동", "열정적 취미"],
    earth: ["요가", "명상", "원예", "요리", "집 꾸미기"],
    metal: ["호흡 운동", "단전호흡", "정리정돈", "금속 공예", "규칙적 운동"],
    water: ["수영", "온천", "명상", "여행", "음악 감상"]
  };

  // 피해야 할 오행 (용신을 극하는 오행)
  const controllingRelation: Record<FiveElement, FiveElement> = {
    wood: "metal",
    fire: "water",
    earth: "wood",
    metal: "fire",
    water: "earth"
  };

  const avoidElements: FiveElement[] = [controllingRelation[yongsin]];

  return {
    yongsin,
    colors: elementColors[yongsin],
    directions: elementDirections[yongsin],
    numbers: elementNumbers[yongsin],
    foods: elementFoods[yongsin],
    activities: elementActivities[yongsin],
    avoidElements
  };
}

// ============================================
// 실천 조언
// ============================================

interface PracticalAdvice {
  daily: string[];
  monthly: string[];
  yearly: string[];
}

function generatePracticalAdvice(
  yongsinRemedy: YongsinRemedy,
  dayMasterElement: FiveElement
): PracticalAdvice {
  const daily: string[] = [
    `${yongsinRemedy.colors[0]} 계열의 옷이나 소품을 착용하세요`,
    `${yongsinRemedy.activities[0]}을(를) 매일 조금씩 실천하세요`,
    `${yongsinRemedy.foods[0]}을(를) 식단에 포함하세요`,
    "아침에 감사 일기나 명상으로 하루를 시작하세요",
    "긍정적인 마음가짐을 유지하세요"
  ];

  const monthly: string[] = [
    `${yongsinRemedy.directions[0]} 방향으로 짧은 여행을 계획하세요`,
    "한 달에 한 번 이상 자연에서 시간을 보내세요",
    "새로운 인연을 만나는 모임에 참여해보세요",
    "재정 상황을 점검하고 목표를 세우세요",
    "건강 체크를 정기적으로 하세요"
  ];

  const yearly: string[] = [
    `${yongsinRemedy.directions[0]} 방향으로 큰 여행이나 이사를 고려하세요`,
    "연초에 1년 목표를 세우고 분기별로 점검하세요",
    "종합 건강검진을 받으세요",
    "관계를 정리하고 좋은 인연을 넓히세요",
    "재무 계획을 점검하고 투자를 검토하세요"
  ];

  // 오행별 특별 조언 추가
  const elementAdvice: Record<FiveElement, string> = {
    wood: "새로운 것을 배우고 성장하는 데 투자하세요",
    fire: "열정을 잃지 말고 사람들과 어울리세요",
    earth: "안정적인 기반을 다지고 가족과 시간을 보내세요",
    metal: "명확한 목표를 세우고 체계적으로 실행하세요",
    water: "직관을 믿고 유연하게 변화에 대응하세요"
  };

  yearly.push(elementAdvice[dayMasterElement]);

  return {
    daily,
    monthly,
    yearly
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

function generateWarningNarrative(
  dayMasterElement: FiveElement,
  sinGangSinYak: string,
  comprehensiveRiskPeriods: Chapter17Result["comprehensiveRiskPeriods"],
  yearlyRiskRating: Chapter17Result["yearlyRiskRating"],
  yongsinRemedy: Chapter17Result["yongsinRemedy"],
  practicalAdvice: Chapter17Result["practicalAdvice"]
): ChapterNarrative {
  const elementKr = ELEMENT_NAMES_KR[dayMasterElement];
  const yongsinKr = ELEMENT_NAMES_KR[yongsinRemedy.yongsin];
  const strengthText = sinGangSinYak === "신강" ? "강한 기운을 가진" : sinGangSinYak === "신약" ? "보완이 필요한" : "균형 잡힌";

  // 신강신약 조합별 상수 가져오기
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthNarrative = WARNING_STRENGTH_NARRATIVES[dayMasterElement][strengthKey];

  // 위험 시기 분석 (표에 표시되는 5년 범위에서만 추출)
  const displayedYears = comprehensiveRiskPeriods.slice(0, 5);
  const highRiskYears = displayedYears.filter((p) => p.riskLevel === "높음").map((p) => p.year);
  const goodYears = yearlyRiskRating.slice(0, 5).filter((r) => r.grade === "A" || r.grade === "B").map((r) => r.year);

  // intro
  const intro = `${elementKr} 오행의 기운과 ${strengthText} 사주 특성을 바탕으로 향후 5년간의 주의 시기와 맞춤형 개운법을 안내해 드립니다. 용신(用神)은 ${yongsinKr}(${yongsinRemedy.yongsin}) 오행으로, 이 기운을 보강하면 운세를 더욱 향상시킬 수 있습니다.`;

  // 메인 분석 - 신강신약 조합별 상수 활용
  let mainAnalysis = `【위험 패턴 분석】\n\n${strengthNarrative.riskPattern}\n\n`;

  mainAnalysis += `【향후 5년 전망】\n\n`;
  if (highRiskYears.length > 0) {
    mainAnalysis += `향후 5년 중 ${highRiskYears.join(", ")}년에는 특별한 주의가 필요합니다. `;
  } else {
    mainAnalysis += `향후 5년간 특별히 위험한 시기는 없습니다. `;
  }

  if (goodYears.length > 0) {
    mainAnalysis += `반면, ${goodYears.slice(0, 3).join(", ")}년은 운이 좋은 시기로, 새로운 시작이나 도전에 적합합니다.`;
  }

  mainAnalysis += `\n\n【강점과 약점】\n\n${strengthNarrative.strengthWeakness}`;

  mainAnalysis += `\n\n【개운 접근법】\n\n${strengthNarrative.remedyApproach} 용신인 ${yongsinKr} 오행의 기운을 활용하여 운세를 보강하기 바랍니다.`;

  const details: string[] = [];

  // 강점과 약점 분석
  details.push(`• 강점과 약점:`);
  details.push(`  ${strengthNarrative.strengthWeakness}`);

  // 연도별 등급
  details.push(`• 연도별 운세 등급:`);
  yearlyRiskRating.slice(0, 5).forEach((rating) => {
    details.push(`  - ${rating.year}년: ${rating.grade}등급 - ${rating.summary}`);
  });

  // 주의 시기
  if (highRiskYears.length > 0) {
    details.push(`• 주의 시기: ${highRiskYears.join(", ")}년`);
    const highRiskPeriod = comprehensiveRiskPeriods.find((p) => p.riskLevel === "높음");
    if (highRiskPeriod && highRiskPeriod.riskAreas.length > 0) {
      details.push(`• 주의 영역: ${highRiskPeriod.riskAreas.join(", ")}`);
    }
  }

  // 개운 접근법
  details.push(`• 개운 접근법:`);
  details.push(`  ${strengthNarrative.remedyApproach}`);

  // 용신 개운법
  details.push(`• 용신(用神): ${yongsinKr}(${yongsinRemedy.yongsin}) 오행`);
  details.push(`• 개운 색상: ${yongsinRemedy.colors.join(", ")}`);
  details.push(`• 개운 방위: ${yongsinRemedy.directions.join(", ")}`);
  details.push(`• 개운 숫자: ${yongsinRemedy.numbers.join(", ")}`);
  details.push(`• 개운 음식: ${yongsinRemedy.foods.join(", ")}`);
  details.push(`• 개운 활동: ${yongsinRemedy.activities.join(", ")}`);

  // 피해야 할 오행
  if (yongsinRemedy.avoidElements.length > 0) {
    const avoidElementsKr = yongsinRemedy.avoidElements.map((e) => ELEMENT_NAMES_KR[e]).join(", ");
    details.push(`• 피해야 할 오행: ${avoidElementsKr}`);
  }

  // 일상 실천 - 신강신약 조합별 상수 활용
  details.push(`• 일상 실천:`);
  details.push(`  ${strengthNarrative.dailyPractice}`);
  details.push(`  - ${practicalAdvice.daily[0]}`);

  // 월간/연간 실천
  details.push(`• 월간 실천: ${practicalAdvice.monthly[0]}`);
  details.push(`• 연간 실천: ${practicalAdvice.yearly[0]}`);

  // 조언 - 신강신약 조합별 상수 활용
  let advice = `【마음가짐 조언】\n\n${strengthNarrative.mindsetAdvice}\n\n`;
  advice += `【일상 실천법】\n\n${strengthNarrative.dailyPractice}\n\n`;
  advice += `【용신 활용법】\n\n용신인 ${yongsinKr} 오행을 보강하기 위해 ${yongsinRemedy.colors.join(", ")} 계열의 색상을 활용하세요. ${yongsinRemedy.activities.join(", ")} 등의 활동을 일상에서 실천해 보세요. ${yongsinRemedy.directions.join(", ")} 방향으로의 여행이나 활동도 도움이 됩니다.\n\n피해야 할 기운은 ${yongsinRemedy.avoidElements.map(e => ELEMENT_NAMES_KR[e]).join(", ")} 오행입니다.`;

  // 마무리
  const closing = "운명은 정해진 것이 아니라 스스로 만들어가는 것입니다. 용신의 기운을 활용하고, 주의 시기에는 신중함으로 대처하여 더 나은 미래를 만들어 가기 바랍니다.";

  return { intro, mainAnalysis, details, advice, closing };
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter17(
  sajuResult: SajuApiResult,
  _gender: Gender,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string
): Chapter17Result {
  // 기본 분석
  const dayMasterElement = getDayMasterElement(sajuResult);
  const yongsin = determineYongsin(dayMasterElement, sinGangSinYak);

  // 위험 시기 분석
  const comprehensiveRiskPeriods = analyzeRiskPeriods(
    sajuResult,
    dayMasterElement,
    currentYear,
    currentAge,
    yongsin,
    sinGangSinYak
  );

  // 연도별 등급
  const yearlyRiskRating = calculateYearlyRatings(comprehensiveRiskPeriods);

  // 용신 개운법
  const yongsinRemedy = generateYongsinRemedy(yongsin, dayMasterElement);

  // 실천 조언
  const practicalAdvice = generatePracticalAdvice(yongsinRemedy, dayMasterElement);

  // 서술형 Narrative 생성
  const narrative = generateWarningNarrative(
    dayMasterElement,
    sinGangSinYak,
    comprehensiveRiskPeriods,
    yearlyRiskRating,
    yongsinRemedy,
    practicalAdvice
  );

  return {
    comprehensiveRiskPeriods,
    yearlyRiskRating,
    yongsinRemedy,
    practicalAdvice,
    narrative
  };
}
