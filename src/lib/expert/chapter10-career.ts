/**
 * 제10장: 직업운 분석
 * 직업상태별 분기 (직장인/자영업/학생/취준생/무직/주부)
 */

import type { SajuApiResult, FiveElement, Gender, OccupationStatus } from "@/types/saju";
import type { Chapter10Result } from "@/types/expert";

// ============================================
// 서술형 풀이용 상수
// ============================================

// 일간 오행별 직업운 서술형 설명
const DAY_MASTER_CAREER_NARRATIVES: Record<FiveElement, {
  intro: string;
  nature: string;
  bestPath: string;
  warning: string;
}> = {
  wood: {
    intro: "목(木)의 기운을 가진 분은 성장과 발전을 추구하는 직업운을 가지고 있습니다.",
    nature: "나무가 하늘을 향해 뻗어가듯이, 끊임없이 성장하고 발전하려는 욕구가 강합니다. 새로운 것을 배우고 가르치는 일, 사람들을 돕는 일에서 보람을 느낍니다. 창의적인 아이디어가 많고, 정의롭고 올곧은 성향이라 부당한 것을 보면 참지 못합니다.",
    bestPath: "교육, 의료, 예술, 상담, 패션, 환경 분야에서 능력을 발휘할 수 있습니다. 사람을 성장시키고 돕는 일, 창작 활동, 자연과 관련된 일이 잘 맞습니다. 스타트업처럼 성장하는 조직에서 일하는 것도 좋습니다.",
    warning: "다만 너무 이상만 좇다 보면 현실적인 부분을 놓칠 수 있습니다. 급한 성격 때문에 준비가 덜 된 상태에서 일을 벌이기도 합니다. 금융이나 제조업처럼 변화가 적고 규칙적인 일은 답답하게 느껴질 수 있습니다."
  },
  fire: {
    intro: "화(火)의 기운을 가진 분은 열정과 표현을 중시하는 직업운을 가지고 있습니다.",
    nature: "불꽃처럼 밝고 열정적인 에너지가 넘칩니다. 사람들 앞에 나서는 것을 두려워하지 않고, 자신을 표현하는 것을 즐깁니다. 분위기를 밝게 만들고, 주변에 에너지를 전파하는 능력이 있습니다.",
    bestPath: "엔터테인먼트, 마케팅, 홍보, 미디어, IT, 요식업 분야에서 빛을 발할 수 있습니다. 창의적인 일, 사람들과 소통하는 일, 무대에 서는 일이 적합합니다. 동적이고 활발한 분위기의 직장이 맞습니다.",
    warning: "다만 한 곳에 오래 머무르기 어렵고, 단조로운 일에는 쉽게 지칠 수 있습니다. 야근이 많거나 지하에서 일하는 환경은 피하는 것이 좋습니다. 충동적으로 이직을 결정하지 않도록 주의하세요."
  },
  earth: {
    intro: "토(土)의 기운을 가진 분은 안정과 신뢰를 중시하는 직업운을 가지고 있습니다.",
    nature: "대지처럼 묵직하고 안정적인 에너지가 있습니다. 급하게 서두르기보다 차근차근 쌓아가는 것을 좋아합니다. 신뢰감이 있고, 한번 맡은 일은 끝까지 책임지는 성향입니다.",
    bestPath: "부동산, 건설, 금융, 공무원, 농업, 컨설팅 분야에서 능력을 발휘할 수 있습니다. 안정적이고 꾸준한 일, 중재하고 조율하는 역할이 잘 맞습니다. 대기업이나 공공기관 같은 안정된 조직이 적합합니다.",
    warning: "다만 변화를 두려워해서 기회를 놓칠 수 있습니다. 너무 안정만 추구하다 보면 성장이 정체될 수 있으니, 적절한 변화도 받아들이세요. 고위험 투자나 불안정한 스타트업은 스트레스가 될 수 있습니다."
  },
  metal: {
    intro: "금(金)의 기운을 가진 분은 원칙과 체계를 중시하는 직업운을 가지고 있습니다.",
    nature: "칼날처럼 날카롭고 명확한 에너지가 있습니다. 옳고 그름을 분명히 가리고, 체계적이고 논리적으로 일하는 것을 좋아합니다. 분석력이 뛰어나고 완벽주의 성향이 있습니다.",
    bestPath: "법률, 금융, IT, 제조, 군/경찰 분야에서 능력을 발휘할 수 있습니다. 분석하고 판단하는 일, 규칙과 원칙이 명확한 일이 잘 맞습니다. 체계적인 조직에서 전문성을 쌓아가는 것이 좋습니다.",
    warning: "다만 너무 완벽을 추구하다 보면 스트레스를 많이 받을 수 있습니다. 유연성이 필요한 일이나 감성적인 업무는 힘들게 느껴질 수 있습니다. 사람을 상대하는 영업직보다는 전문직이 맞습니다."
  },
  water: {
    intro: "수(水)의 기운을 가진 분은 유연성과 지혜를 중시하는 직업운을 가지고 있습니다.",
    nature: "물처럼 유연하고 적응력이 뛰어난 에너지가 있습니다. 어떤 환경에서도 자신의 역할을 찾아가고, 흐름을 읽는 능력이 탁월합니다. 깊이 생각하고 통찰하는 것을 좋아합니다.",
    bestPath: "무역, 물류, 여행, 연구, 심리상담, 철학 분야에서 능력을 발휘할 수 있습니다. 변화가 많은 일, 사람의 마음을 다루는 일, 연구하고 탐구하는 일이 잘 맞습니다. 다양한 경험을 쌓을 수 있는 환경이 좋습니다.",
    warning: "다만 한 곳에 정착하기 어렵고, 결정을 미루는 경향이 있습니다. 너무 생각만 하다 행동이 늦어질 수 있으니 주의하세요. 반복적이고 정적인 업무는 답답하게 느껴질 수 있습니다."
  }
};

// 오행 × 신강신약 조합별 상세 직업운 서술 (5오행 × 3신강신약 = 15조합)
const ELEMENT_STRENGTH_CAREER_NARRATIVES: Record<FiveElement, {
  신강: {
    careerStyle: string;
    leadershipAdvice: string;
    businessPotential: string;
    growthStrategy: string;
    warningPoints: string;
  };
  신약: {
    careerStyle: string;
    supportAdvice: string;
    stabilityFocus: string;
    growthStrategy: string;
    warningPoints: string;
  };
  중화: {
    careerStyle: string;
    balanceAdvice: string;
    flexibilityStrength: string;
    growthStrategy: string;
    warningPoints: string;
  };
}> = {
  wood: {
    신강: {
      careerStyle: "목(木) 신강이신 분은 독립적이고 추진력 있는 직업 스타일을 가지고 있습니다. 나무가 강하게 뻗어나가듯이, 스스로 길을 개척하고 남들을 이끄는 역할에서 진가를 발휘합니다. 조직에서도 리더십을 발휘할 수 있지만, 사업이나 프리랜서로 독립해도 성공 가능성이 높습니다.",
      leadershipAdvice: "본인의 강한 추진력을 살려 팀을 이끌거나 새로운 프로젝트를 주도하는 역할을 맡으면 좋습니다. 창업을 한다면 교육, 콘텐츠, 헬스케어 분야가 적합합니다. 다만 너무 독선적으로 결정하기보다는 팀원들의 의견도 듣는 것이 장기적으로 유리합니다.",
      businessPotential: "사업가 기질이 있습니다. 특히 사람을 성장시키거나 교육하는 분야에서 창업하면 좋은 결과가 있을 수 있습니다. 온라인 강의, 코칭 비즈니스, 건강 관련 사업 등을 고려해보세요. 초기에는 부업으로 시작해서 안정궤도에 오르면 전업하는 것이 안전합니다.",
      growthStrategy: "현재 위치에서 리더십 역량을 키워가는 것이 좋습니다. 관리자 교육이나 MBA 같은 과정을 통해 경영 역량을 강화하면 더 큰 기회가 올 것입니다. 네트워크도 적극적으로 확장하고, 업계에서 전문가로 인정받는 것을 목표로 하세요.",
      warningPoints: "신강한 목은 때로 고집이 세게 나타날 수 있습니다. 상사나 동료와 충돌하는 일이 생길 수 있으니, 본인이 옳다고 생각해도 표현 방식을 부드럽게 하는 것이 좋습니다. 또한 너무 급하게 일을 벌이면 마무리가 부실해질 수 있으니 한 가지에 집중하는 것이 중요합니다."
    },
    신약: {
      careerStyle: "목(木) 신약이신 분은 협력적이고 유연한 직업 스타일이 맞습니다. 혼자서 모든 것을 하기보다는 좋은 팀과 함께할 때 능력을 발휘합니다. 든든한 조직에서 전문성을 키워가는 것이 안전하고 효과적인 경로입니다.",
      supportAdvice: "큰 조직에서 안정적으로 경력을 쌓아가는 것이 좋습니다. 공기업, 대기업, 학교, 병원 같은 안정적인 환경에서 전문성을 키우면 오래도록 인정받을 수 있습니다. 사업을 하고 싶다면 파트너와 함께 하거나, 프랜차이즈 같은 검증된 모델로 시작하는 것이 안전합니다.",
      stabilityFocus: "재정적 안정이 중요합니다. 이직을 결정할 때는 연봉뿐 아니라 고용 안정성, 복리후생, 성장 가능성을 꼼꼼히 따져보세요. 당장의 고연봉보다는 장기적으로 성장할 수 있는 환경이 본인에게 맞습니다.",
      growthStrategy: "전문 자격증이나 학위를 취득하면 시장 가치가 올라갑니다. 본인 분야의 전문성을 꾸준히 키워가는 것이 가장 확실한 성장 전략입니다. 조급해하지 말고 차근차근 실력을 쌓아가세요.",
      warningPoints: "스트레스에 취약할 수 있으니 건강 관리에 신경 쓰세요. 과도한 업무량이나 야근이 많은 환경은 피하는 것이 좋습니다. 또한 주변 사람들의 의견에 너무 휘둘리지 말고, 본인의 방향을 잡아가는 것도 필요합니다."
    },
    중화: {
      careerStyle: "목(木) 중화인 분은 균형 잡힌 직업 스타일을 가지고 있습니다. 독립적으로 일하는 것도, 팀과 협력하는 것도 모두 잘할 수 있습니다. 상황에 따라 유연하게 역할을 바꿀 수 있어서 다양한 환경에 적응하기 쉽습니다.",
      balanceAdvice: "직장을 다니면서 부업이나 사이드 프로젝트를 병행하기에 좋은 구조입니다. 본업에서 안정적인 수입을 얻으면서, 관심 있는 분야에서 조금씩 경험을 쌓아가면 나중에 새로운 기회로 연결될 수 있습니다.",
      flexibilityStrength: "조직 생활도 잘하고, 필요하면 독립도 할 수 있는 유연함이 강점입니다. 임원까지 올라가는 것도 가능하고, 중간에 창업이나 프리랜서로 전환하는 것도 가능합니다. 본인이 원하는 방향으로 설계해 나가면 됩니다.",
      growthStrategy: "다양한 경험을 쌓는 것이 좋습니다. 한 분야에만 머물지 말고, 관련 영역으로 확장해가면서 T자형 인재가 되면 시장 가치가 높아집니다. 리더십 경험도 쌓고, 실무 전문성도 놓치지 마세요.",
      warningPoints: "중화라서 어느 쪽으로도 갈 수 있다는 것은 반대로 방향을 잡기 어려울 수도 있다는 뜻입니다. 너무 많은 가능성 앞에서 갈팡질팡하지 말고, 본인이 원하는 것이 무엇인지 명확하게 정리하는 시간을 가지세요."
    }
  },
  fire: {
    신강: {
      careerStyle: "화(火) 신강이신 분은 화끈하고 추진력 있는 직업 스타일을 가지고 있습니다. 불꽃처럼 밝고 열정적인 에너지로 주변을 압도하고, 어떤 자리에서든 존재감을 드러냅니다. 무대에 서는 일, 사람을 이끄는 일, 새로운 것을 창조하는 일에서 진가를 발휘합니다.",
      leadershipAdvice: "본인의 강렬한 에너지를 살려 리더 역할을 맡으면 좋습니다. 스타트업 CEO, 프로젝트 매니저, 영업 팀장 같은 역할이 잘 맞습니다. 크리에이터나 연예인처럼 대중 앞에 서는 일도 적합합니다. 본인이 주도할 수 있는 환경에서 가장 빛납니다.",
      businessPotential: "사업 성공 가능성이 높습니다. 특히 엔터테인먼트, 마케팅, 요식업, IT 분야에서 창업하면 좋은 결과가 있을 수 있습니다. 본인의 개성을 살린 브랜드를 만들면 팬이 생길 수 있습니다. 다만 초기에 너무 크게 시작하지 말고, 작게 시작해서 키워가는 것이 안전합니다.",
      growthStrategy: "본인의 강점인 열정과 표현력을 더욱 발전시키세요. 스피치 교육, 퍼스널 브랜딩, SNS 마케팅 역량을 키우면 더 큰 무대로 갈 수 있습니다. 네트워크 확장도 적극적으로 하고, 업계에서 인플루언서가 되는 것을 목표로 하세요.",
      warningPoints: "화가 너무 강하면 충동적인 결정을 하기 쉽습니다. 화가 났을 때 중요한 결정을 하지 말고, 하루 정도 생각한 후에 결정하세요. 또한 다른 사람의 공로를 인정해주고, 팀원들과 성과를 나누는 것이 장기적으로 유리합니다."
    },
    신약: {
      careerStyle: "화(火) 신약이신 분은 열정은 있지만 체력적으로 에너지를 오래 유지하기 어려울 수 있습니다. 순간적으로는 밝게 빛나지만, 그것이 계속되면 지칠 수 있습니다. 안정적인 환경에서 본인의 밝은 에너지를 발휘하는 것이 좋습니다.",
      supportAdvice: "든든한 조직에서 전문성을 키워가는 것이 맞습니다. 마케팅, 디자인, 콘텐츠 분야에서 팀원으로 활동하면서 경험을 쌓는 것이 좋습니다. 사업을 하고 싶다면 파트너가 꼭 필요합니다. 본인은 아이디어와 대외 활동을 맡고, 파트너는 운영과 관리를 맡게 하면 좋습니다.",
      stabilityFocus: "야근이 많거나 체력 소모가 심한 일은 피하는 것이 좋습니다. 건강을 유지하면서 일할 수 있는 환경이 중요합니다. 연봉보다는 워라밸이 좋은 직장을 찾는 것이 장기적으로 더 나을 수 있습니다.",
      growthStrategy: "본인의 창의성을 살릴 수 있는 전문 분야를 정하고, 그 분야에서 깊이를 쌓아가는 것이 좋습니다. 디자인, 글쓰기, 마케팅 기획 같은 분야에서 전문가가 되면 안정적으로 인정받을 수 있습니다.",
      warningPoints: "번아웃에 주의하세요. 열정적으로 일하다가 갑자기 지치는 경우가 있을 수 있습니다. 일과 휴식의 균형을 잘 맞추고, 취미 생활이나 운동으로 에너지를 충전하는 시간이 필요합니다."
    },
    중화: {
      careerStyle: "화(火) 중화인 분은 열정과 안정을 적절히 조화시킬 수 있는 직업 스타일입니다. 밝고 활기찬 에너지가 있으면서도, 무리하지 않고 페이스 조절을 할 수 있습니다. 다양한 환경에서 적응하기 쉽습니다.",
      balanceAdvice: "본인의 창의성과 표현력을 살리면서도 안정적인 수입을 얻을 수 있는 환경이 좋습니다. 대기업 마케팅팀, 방송사, IT 회사 같은 곳에서 활동하면서, 부업으로 콘텐츠 창작을 병행하는 것도 좋습니다.",
      flexibilityStrength: "조직 생활도 잘하고, 필요하면 프리랜서나 창업도 할 수 있는 유연함이 강점입니다. 상황에 따라 역할을 바꿔가면서 본인에게 가장 맞는 형태를 찾아가면 됩니다.",
      growthStrategy: "다양한 분야에서 경험을 쌓는 것이 좋습니다. 마케팅, 디자인, 콘텐츠, 이벤트 등 관련 영역을 넓혀가면서 종합적인 역량을 키우면 시장 가치가 높아집니다.",
      warningPoints: "중화라서 열정과 안정 사이에서 고민하는 경우가 있을 수 있습니다. 본인이 원하는 것이 무엇인지 명확하게 정리하고, 그에 맞는 방향으로 선택하는 것이 중요합니다. 이것저것 다 하려고 하면 어느 것도 제대로 못 할 수 있습니다."
    }
  },
  earth: {
    신강: {
      careerStyle: "토(土) 신강이신 분은 묵직하고 안정적인 직업 스타일을 가지고 있습니다. 대지처럼 든든한 신뢰감으로 주변의 믿음을 받고, 맡은 일을 끝까지 책임지는 성향입니다. 조직의 중심이 되어 사람들을 이끄는 역할에서 진가를 발휘합니다.",
      leadershipAdvice: "본인의 신뢰감을 살려 관리자나 중간 책임자 역할을 맡으면 좋습니다. 팀원들을 안정적으로 이끌고, 갈등을 중재하며, 조직을 단단하게 만드는 역할이 잘 맞습니다. 부동산, 건설, 금융, 공공 분야에서 관리자로 성장하면 좋은 결과가 있을 것입니다.",
      businessPotential: "사업도 가능하지만, 안정적인 분야를 선택하는 것이 좋습니다. 부동산 중개, 건설 관련 사업, 농업, 식품 유통 등이 적합합니다. 한 번에 크게 벌려고 하기보다는 차근차근 규모를 키워나가는 것이 본인 성향에 맞습니다.",
      growthStrategy: "전문 분야에서 깊이를 쌓아가는 것이 좋습니다. 부동산 자격증, 재무 관리사, 세무사 같은 전문 자격을 취득하면 시장 가치가 올라갑니다. 인맥 관리도 중요하니, 업계 내 네트워크를 꾸준히 유지하세요.",
      warningPoints: "토가 너무 강하면 변화를 거부하는 고집이 될 수 있습니다. 세상이 빠르게 변하고 있으니, 새로운 기술이나 트렌드에도 관심을 가지는 것이 좋습니다. 또한 너무 안정만 추구하면 성장 기회를 놓치실 수 있으니, 적절한 도전도 필요합니다."
    },
    신약: {
      careerStyle: "토(土) 신약이신 분은 안정적인 환경에서 일할 때 가장 편안함을 느낍니다. 변화가 많은 환경보다는 예측 가능한 환경에서 꾸준히 일하는 것이 맞습니다. 큰 조직에서 전문성을 키워가는 경로가 적합합니다.",
      supportAdvice: "공기업, 대기업, 공공기관 같은 안정적인 조직에서 일하는 것이 좋습니다. 복리후생이 좋고, 정년이 보장되는 환경에서 장기 근속하면서 전문성을 쌓아가는 것이 안전하고 효과적인 경로입니다.",
      stabilityFocus: "고용 안정성이 가장 중요합니다. 연봉이 조금 낮더라도 안정적인 직장을 선택하는 것이 본인에게 맞습니다. 사업이나 투자는 신중하게 접근하고, 큰 리스크를 감수하는 일은 피하세요.",
      growthStrategy: "한 분야에서 오래 일하면서 전문가로 인정받는 것이 목표입니다. 회계, 세무, 법무, 인사 같은 전문 분야에서 경력을 쌓아가면 시장 가치가 올라갑니다. 자격증 취득도 꾸준히 하세요.",
      warningPoints: "너무 안전만 추구하면 성장이 정체될 수 있습니다. 편안한 것에 안주하지 말고, 조금씩 새로운 것도 배워가는 것이 좋습니다. 또한 주변 사람들에게 너무 많이 양보하지 말고, 본인의 가치도 인정받는 것이 필요합니다."
    },
    중화: {
      careerStyle: "토(土) 중화인 분은 안정과 성장을 적절히 조화시킬 수 있는 직업 스타일입니다. 믿음직스러운 성향이 있으면서도, 필요할 때는 새로운 것에 도전할 수도 있습니다. 조직 생활도 잘하고, 필요하면 독립도 할 수 있습니다.",
      balanceAdvice: "안정적인 본업을 가지면서, 부동산 투자나 부업을 병행하기에 좋은 구조입니다. 직장에서 꾸준히 승진해 나가면서, 여유 자금으로 안정적인 투자를 하는 것이 적합합니다.",
      flexibilityStrength: "상황에 따라 유연하게 대처할 수 있는 것이 강점입니다. 조직 내에서 성장하는 것도 가능하고, 중간에 창업이나 이직을 결정하는 것도 가능합니다. 본인이 원하는 방향으로 설계해 나가면 됩니다.",
      growthStrategy: "본업에서 전문성을 키우면서, 관련 분야로 점점 확장해가는 것이 좋습니다. 예를 들어 회계에서 시작해서 재무 전체로 영역을 넓히시거나, 부동산에서 시작해서 자산 관리 전반으로 확장하는 방식입니다.",
      warningPoints: "중화라서 안정과 도전 사이에서 고민하는 경우가 있을 수 있습니다. 너무 오래 고민하지 말고, 어느 정도 정보를 모으면 결단을 내리는 것이 중요합니다. 완벽한 타이밍은 없으니 준비가 되면 움직이세요."
    }
  },
  metal: {
    신강: {
      careerStyle: "금(金) 신강이신 분은 날카롭고 결단력 있는 직업 스타일을 가지고 있습니다. 칼날처럼 명확하고 단호한 에너지로 목표를 향해 직진하고, 원칙과 논리에 따라 판단합니다. 분석하고 판단하는 역할, 권위 있는 위치에서 진가를 발휘합니다.",
      leadershipAdvice: "본인의 명확한 판단력을 살려 의사결정 역할을 맡으면 좋습니다. 법조계, 금융권, IT 분야에서 관리자나 전문가로 성장하면 좋은 결과가 있을 것입니다. 군인, 경찰, 검찰 같은 권위 있는 직종도 잘 맞습니다.",
      businessPotential: "사업도 가능하지만, 명확한 규칙과 체계가 있는 분야가 좋습니다. 법률 사무소, 세무 회계 사무소, IT 회사 같은 전문 분야에서 창업하면 좋은 결과가 있을 수 있습니다. 본인의 전문성을 기반으로 한 컨설팅 사업도 적합합니다.",
      growthStrategy: "전문 자격증과 경력을 쌓아가는 것이 가장 확실한 성장 전략입니다. 변호사, 회계사, 세무사, 공인중개사 같은 전문 자격을 취득하면 시장 가치가 크게 올라갑니다. 해당 분야에서 최고가 되는 것을 목표로 하세요.",
      warningPoints: "금이 너무 강하면 융통성이 없어 보일 수 있습니다. 원칙도 중요하지만, 때로는 상황에 따라 유연하게 대처하는 것도 필요합니다. 또한 타인의 감정에도 신경 쓰는 것이 대인관계에 도움이 됩니다."
    },
    신약: {
      careerStyle: "금(金) 신약이신 분은 섬세하고 정밀한 직업 스타일이 맞습니다. 날카로움은 있지만 부드럽게 표현되어, 사람들과 조화를 이루면서 일하는 것이 좋습니다. 분석과 판단보다는 실무와 기술 영역에서 전문성을 키워가는 것이 적합합니다.",
      supportAdvice: "체계적인 조직에서 전문성을 키워가는 것이 좋습니다. 대기업 재무팀, 법률 사무소, 회계 법인 같은 곳에서 실무 전문가로 성장하면 안정적으로 인정받을 수 있습니다. 독립하기보다는 조직에서 인정받는 경로가 안전합니다.",
      stabilityFocus: "안정적인 전문직이 가장 맞습니다. 회계사, 세무사, 법무사, 변리사 같은 자격증을 취득하면 오래도록 안정적인 수입을 얻을 수 있습니다. 큰 조직에 소속되어 전문성을 발휘하는 것이 좋습니다.",
      growthStrategy: "한 분야에서 깊이를 쌓아가는 것이 중요합니다. 이것저것 손대시기보다는 한 분야의 최고 전문가가 되는 것을 목표로 하세요. 자격증 취득과 실무 경험을 꾸준히 쌓아가면 시장 가치가 올라갑니다.",
      warningPoints: "완벽주의 성향이 스트레스가 될 수 있습니다. 모든 것을 완벽하게 하려고 하면 지치시기 쉽습니다. 80%의 완성도에서 마무리하는 연습도 필요합니다. 또한 건강 관리에 신경 쓰고, 적절한 휴식을 취하세요."
    },
    중화: {
      careerStyle: "금(金) 중화인 분은 논리와 감성을 균형 있게 활용할 수 있는 직업 스타일입니다. 분석력이 있으면서도 사람들과 소통하는 것도 잘하여, 다양한 역할에서 능력을 발휘할 수 있습니다.",
      balanceAdvice: "전문성과 대인관계 역량을 모두 살릴 수 있는 역할이 좋습니다. 컨설턴트, 기획자, 프로젝트 매니저 같은 역할이 잘 맞습니다. 전문 지식을 기반으로 사람들과 소통하면서 성과를 내는 것이 적합합니다.",
      flexibilityStrength: "조직 생활도 잘하고, 필요하면 독립도 할 수 있는 유연함이 강점입니다. 전문 분야에서 경력을 쌓으시다가 나중에 컨설팅이나 창업으로 전환하는 것도 가능합니다. 상황에 맞게 역할을 바꿔가면 됩니다.",
      growthStrategy: "전문성을 쌓으면서 리더십 역량도 함께 키워가는 것이 좋습니다. 기술적인 역량과 매니지먼트 역량을 모두 갖추면 시장 가치가 크게 올라갑니다. T자형 인재를 목표로 하세요.",
      warningPoints: "원칙과 융통성 사이에서 고민하는 경우가 있을 수 있습니다. 상황에 따라 판단하되, 본인의 핵심 가치는 지켜가는 것이 중요합니다. 너무 이리저리 휘둘리지 말고, 중심을 잡으세요."
    }
  },
  water: {
    신강: {
      careerStyle: "수(水) 신강이신 분은 깊이 있고 통찰력 있는 직업 스타일을 가지고 있습니다. 물이 깊이 스며들듯이, 본질을 꿰뚫어 보는 능력이 있고, 흐름을 읽는 감각이 탁월합니다. 전략을 세우고, 연구하고, 사람의 마음을 다루는 일에서 진가를 발휘합니다.",
      leadershipAdvice: "본인의 통찰력을 살려 전략 기획이나 연구 분야에서 리더 역할을 맡으면 좋습니다. 기업 전략실, 연구소, 컨설팅 회사에서 핵심 인력으로 성장하면 좋은 결과가 있을 것입니다. 투자나 무역 분야에서 큰 그림을 그리는 역할도 잘 맞습니다.",
      businessPotential: "사업 성공 가능성이 높습니다. 특히 흐름을 읽어야 하는 분야에서 창업하면 좋습니다. 무역, 투자, 컨설팅, 교육 분야가 적합합니다. 본인의 통찰력을 기반으로 한 콘텐츠 사업이나 강의 사업도 좋습니다.",
      growthStrategy: "다양한 경험과 지식을 쌓아가는 것이 중요합니다. 한 분야에 갇히지 말고, 관련 영역으로 확장해가면서 큰 그림을 보는 능력을 키우세요. 해외 경험이나 다양한 산업 경험도 도움이 됩니다.",
      warningPoints: "수가 너무 강하면 생각만 하고 행동으로 옮기지 않는 경우가 있습니다. 좋은 아이디어가 있면 실행으로 옮기는 것이 중요합니다. 또한 한 곳에 오래 머무르기 어려울 수 있으니, 잦은 이직은 주의하세요."
    },
    신약: {
      careerStyle: "수(水) 신약이신 분은 유연하고 적응력 있는 직업 스타일이 맞습니다. 깊이 있는 통찰보다는 상황에 맞게 유연하게 대처하는 것이 강점입니다. 안정적인 환경에서 전문성을 키워가는 것이 적합합니다.",
      supportAdvice: "큰 조직에서 안정적으로 경력을 쌓아가는 것이 좋습니다. 연구소, 대학, 공공기관 같은 곳에서 전문가로 성장하면 오래도록 인정받을 수 있습니다. 사업을 하고 싶다면 파트너가 꼭 필요합니다.",
      stabilityFocus: "안정적인 연구직이나 전문직이 가장 맞습니다. 교수, 연구원, 심리상담사 같은 직종에서 전문성을 쌓아가면 안정적으로 인정받을 수 있습니다. 큰 변화보다는 꾸준히 쌓아가는 것이 좋습니다.",
      growthStrategy: "한 분야에서 깊이를 쌓아가는 것이 중요합니다. 석사, 박사 학위를 취득하거나 전문 자격을 얻으면 시장 가치가 올라갑니다. 학문적 성과나 연구 실적을 꾸준히 쌓아가세요.",
      warningPoints: "결정을 미루는 경향이 있으니 주의하세요. 완벽한 정보가 없어도 어느 정도 판단이 되면 결정을 내리는 것이 필요합니다. 또한 너무 생각에 빠져서 현실과 동떨어지지 않도록 주의하세요."
    },
    중화: {
      careerStyle: "수(水) 중화인 분은 통찰력과 실행력을 균형 있게 갖추신 직업 스타일입니다. 상황을 읽는 능력이 있으면서도, 적절한 시점에 행동으로 옮기실 수 있습니다. 다양한 환경에서 적응하기 쉽습니다.",
      balanceAdvice: "안정적인 본업을 가지면서, 부업이나 투자를 통해 흐름을 읽는 능력을 활용하기에 좋은 구조입니다. 직장에서 전략 기획이나 사업 개발 역할을 맡으면서, 개인적으로는 투자나 콘텐츠 창작을 병행하는 것도 좋습니다.",
      flexibilityStrength: "조직 생활도 잘하고, 필요하면 독립도 할 수 있는 유연함이 강점입니다. 컨설턴트, 프리랜서, 창업가 등 다양한 경로가 열려 있습니다. 본인이 원하는 방향으로 설계해 나가면 됩니다.",
      growthStrategy: "다양한 경험을 쌓으면서 본인만의 관점을 만들어가는 것이 중요합니다. 여러 분야를 경험하면서 통합적인 시야를 갖추면 시장에서 희소 가치가 높은 인재가 될 수 있습니다.",
      warningPoints: "너무 많은 가능성 앞에서 갈팡질팡할 수 있습니다. 이것저것 다 할 수 있다고 해서 다 하려고 하면 어느 것도 제대로 못 할 수 있습니다. 선택과 집중이 필요합니다. 본인이 가장 원하는 것이 무엇인지 명확하게 정리하세요."
    }
  }
};

// 직업상태별 서술형 조언
const OCCUPATION_NARRATIVES: Record<OccupationStatus, {
  situation: string;
  advice: string;
  encouragement: string;
}> = {
  employee: {
    situation: "현재 직장인으로 활동하고 있습니다.",
    advice: "조직 안에서 자신의 강점을 살려 전문성을 키워가세요. 상사나 동료와의 관계도 중요하지만, 결국 실력이 인정받는 기반입니다. 현재 하는 일에서 최고가 되려고 노력하다 보면 자연스럽게 기회가 찾아올 것입니다.",
    encouragement: "직장 생활이 때로는 힘들게 느껴질 수 있습니다. 하지만 지금 쌓고 있는 경험과 인맥은 나중에 분명 큰 자산이 될 것입니다. 조급해하지 말고 꾸준히 성장해가세요."
  },
  business: {
    situation: "현재 사업을 하고 있습니다.",
    advice: "사업가에게 가장 중요한 것은 시장의 흐름을 읽고 적응하는 능력입니다. 자신의 강점을 살린 분야에서 차별화된 가치를 제공하세요. 리스크 관리도 중요하니 너무 과감한 투자보다는 안정적인 성장을 추구하세요.",
    encouragement: "사업은 롤러코스터와 같습니다. 좋을 때도 있고 힘들 때도 있습니다. 하지만 자신의 길을 개척한다는 것 자체가 대단한 것입니다. 힘먹을 때 주변의 도움을 받는 것도 지혜입니다."
  },
  freelance: {
    situation: "현재 프리랜서로 활동하고 있습니다.",
    advice: "프리랜서는 자유롭지만 그만큼 자기 관리가 중요합니다. 꾸준한 포트폴리오 관리와 개인 브랜딩이 핵심입니다. 다양한 클라이언트 네트워크를 구축하고, 한 곳에만 의존하지 않도록 분산하세요.",
    encouragement: "혼자 일한다는 것은 외롭고 불안할 때도 있습니다. 하지만 자유롭게 자신의 역량을 펼칠 수 있다는 것은 큰 장점입니다. 건강과 재무 관리에 신경 쓰면서 자신만의 길을 가세요."
  },
  student: {
    situation: "현재 학생으로 공부하고 있습니다.",
    advice: "학창 시절은 다양한 것을 경험하고 배울 수 있는 소중한 시간입니다. 전공 공부도 중요하지만, 다양한 경험을 통해 자신이 정말 하고 싶은 일이 무엇인지 탐색해보세요. 인턴십이나 프로젝트 활동도 좋은 기회입니다.",
    encouragement: "미래가 불안하게 느껴질 수 있습니다. 하지만 지금 열심히 배우고 경험하는 모든 것이 미래의 자산이 될 것입니다. 조급해하지 말고 자신만의 속도로 성장해가세요."
  },
  jobseeker: {
    situation: "현재 취업을 준비하고 있습니다.",
    advice: "취업 준비 기간은 자신을 돌아보고 정리하는 시간입니다. 무작정 지원하기보다는 자신에게 정말 맞는 회사와 직무를 찾으세요. 이력서와 면접 준비도 중요하지만, 실제 역량을 키우는 것이 더 중요합니다.",
    encouragement: "취업이 잘 안 될 때 자존감이 떨어지기 쉽습니다. 하지만 당신의 가치는 취업 여부로 결정되는 것이 아닙니다. 조금 늦더라도 나에게 맞는 곳을 찾는 것이 중요합니다. 포기하지 마세요."
  },
  homemaker: {
    situation: "현재 가정에서 살림을 하고 있습니다.",
    advice: "가정을 돌보는 것도 중요한 일입니다. 하지만 자신만의 영역을 가지는 것도 필요합니다. 관심 있는 분야의 온라인 강의를 듣거나, 재택 근무가 가능한 일을 찾아보는 것도 좋습니다.",
    encouragement: "가사 노동은 눈에 보이지 않지만 가정을 지탱하는 중요한 역할입니다. 하지만 자신의 꿈과 성장도 놓지 마세요. 작은 것부터 시작해서 다시 사회와 연결될 수 있는 기회를 만들어보세요."
  }
};

// ============================================
// 직업 적성 분석
// ============================================

interface CareerAptitude {
  bestFields: string[];
  suitableJobs: string[];
  avoidJobs: string[];
  workStyle: string;
}

// 오행별 직업 적성
const ELEMENT_CAREER_MAP: Record<FiveElement, {
  fields: string[];
  jobs: string[];
  avoid: string[];
  style: string;
}> = {
  wood: {
    fields: ["교육", "의료", "패션", "예술", "농림업"],
    jobs: ["교사", "교수", "의사", "간호사", "디자이너", "작가", "예술가", "농업인", "조경사"],
    avoid: ["금융", "채굴", "제련", "무기"],
    style: "창의적이고 성장 지향적이며, 사람들을 돕는 일에서 보람을 느낍니다"
  },
  fire: {
    fields: ["엔터테인먼트", "마케팅", "홍보", "요식업", "IT"],
    jobs: ["연예인", "방송인", "마케터", "셰프", "개발자", "디자이너", "사진작가", "이벤트 플래너"],
    avoid: ["단조로운 사무직", "야간 근무", "지하 근무"],
    style: "열정적이고 표현력이 뛰어나며, 주목받는 환경에서 능력을 발휘합니다"
  },
  earth: {
    fields: ["부동산", "건설", "농업", "금융", "공무원"],
    jobs: ["공인중개사", "건축가", "은행원", "공무원", "회계사", "감정평가사", "농업인"],
    avoid: ["고위험 투자", "불안정한 스타트업", "유동성 높은 업무"],
    style: "안정적이고 신뢰성이 높으며, 꾸준히 성과를 쌓아가는 스타일입니다"
  },
  metal: {
    fields: ["법률", "금융", "IT", "제조", "군/경"],
    jobs: ["변호사", "검사", "금융분석가", "엔지니어", "군인", "경찰", "회계사", "프로그래머"],
    avoid: ["감성적 업무", "불규칙한 스케줄", "협상이 많은 영업"],
    style: "논리적이고 체계적이며, 명확한 규칙과 구조가 있는 환경을 선호합니다"
  },
  water: {
    fields: ["무역", "물류", "여행", "연구", "심리상담"],
    jobs: ["무역업자", "물류 전문가", "여행가이드", "연구원", "심리상담사", "작가", "철학자"],
    avoid: ["정적인 환경", "반복적 업무", "엄격한 위계 조직"],
    style: "유연하고 적응력이 뛰어나며, 변화와 흐름을 읽는 능력이 탁월합니다"
  }
};

// 십신별 직업 경향
const SIPSIN_CAREER_MAP: Record<string, {
  tendency: string;
  suitable: string[];
  leadership: string;
}> = {
  비견: {
    tendency: "독립적, 경쟁적",
    suitable: ["자영업", "프리랜서", "스포츠", "경쟁 분야"],
    leadership: "동료와 경쟁하며 성장하는 리더십"
  },
  겁재: {
    tendency: "도전적, 모험적",
    suitable: ["영업", "창업", "투자", "모험적 사업"],
    leadership: "과감한 결정으로 기회를 잡는 리더십"
  },
  식신: {
    tendency: "창의적, 표현적",
    suitable: ["요식업", "예술", "교육", "콘텐츠 제작"],
    leadership: "부드럽고 배려하는 서번트 리더십"
  },
  상관: {
    tendency: "혁신적, 비판적",
    suitable: ["연구개발", "비평", "컨설팅", "혁신 분야"],
    leadership: "기존 방식을 혁신하는 변혁적 리더십"
  },
  편재: {
    tendency: "투자적, 역동적",
    suitable: ["투자", "무역", "유통", "부동산"],
    leadership: "기회를 포착하는 기업가적 리더십"
  },
  정재: {
    tendency: "안정적, 계획적",
    suitable: ["금융", "회계", "관리직", "공무원"],
    leadership: "신뢰와 안정을 중시하는 관리형 리더십"
  },
  편관: {
    tendency: "권위적, 추진력",
    suitable: ["군인", "경찰", "정치", "임원"],
    leadership: "강력한 추진력의 카리스마 리더십"
  },
  정관: {
    tendency: "조직적, 책임감",
    suitable: ["공무원", "대기업", "법조계", "관리직"],
    leadership: "규정을 중시하는 원칙형 리더십"
  },
  편인: {
    tendency: "비전통적, 독창적",
    suitable: ["연구", "IT", "예술", "종교/철학"],
    leadership: "독창적 비전으로 이끄는 창의형 리더십"
  },
  정인: {
    tendency: "학구적, 교육적",
    suitable: ["교육", "연구", "출판", "상담"],
    leadership: "지식과 경험을 나누는 멘토형 리더십"
  }
};

// ============================================
// 일간(일주 천간) 추출
// ============================================

type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";

function getDayMasterElement(sajuResult: SajuApiResult): FiveElement {
  const stemElementMap: Record<string, FiveElement> = {
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
// 십신 분석
// ============================================

function analyzeSipsinForCareer(sajuResult: SajuApiResult): {
  dominant: string;
  secondary: string;
  distribution: Record<string, number>;
} {
  const sipsinCount: Record<string, number> = {
    비견: 0, 겁재: 0, 식신: 0, 상관: 0, 편재: 0,
    정재: 0, 편관: 0, 정관: 0, 편인: 0, 정인: 0
  };

  // 각 기둥의 십신 분석 (간략화된 로직)
  const pillars = [
    sajuResult.yearPillar,
    sajuResult.monthPillar,
    sajuResult.dayPillar,
    sajuResult.timePillar
  ];

  const dayStem = sajuResult.dayPillar.cheongan as string;

  pillars.forEach(pillar => {
    if (!pillar) return;

    // 천간 십신 (간략화)
    const stemSipsin = getSipsinFromStem(dayStem, pillar.cheongan as string);
    if (stemSipsin && sipsinCount[stemSipsin] !== undefined) {
      sipsinCount[stemSipsin]++;
    }

    // 지지 장간 십신 (간략화)
    const branchSipsin = getSipsinFromBranch(dayStem, pillar.jiji as string);
    if (branchSipsin && sipsinCount[branchSipsin] !== undefined) {
      sipsinCount[branchSipsin]++;
    }
  });

  // 가장 많은 십신 찾기
  const sorted = Object.entries(sipsinCount)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return {
    dominant: sorted[0]?.[0] || "정관",
    secondary: sorted[1]?.[0] || "정재",
    distribution: sipsinCount
  };
}

function getSipsinFromStem(dayStem: string, targetStem: string): string | null {
  // 간략화된 십신 매핑 로직
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

  return sipsinMap[dayStem]?.[targetStem] || null;
}

function getSipsinFromBranch(dayStem: string, branch: string): string | null {
  // 지지 장간의 본기 기준 십신 (간략화)
  const branchMainStem: Record<string, string> = {
    자: "계", 축: "기", 인: "갑", 묘: "을",
    진: "무", 사: "병", 오: "정", 미: "기",
    신: "경", 유: "신", 술: "무", 해: "임"
  };

  const mainStem = branchMainStem[branch];
  if (!mainStem) return null;

  return getSipsinFromStem(dayStem, mainStem);
}

// ============================================
// 직업 적성 분석
// ============================================

function analyzeCareerAptitude(
  dayMasterElement: FiveElement,
  sipsinAnalysis: { dominant: string; secondary: string; distribution: Record<string, number> }
): CareerAptitude {
  const elementCareer = ELEMENT_CAREER_MAP[dayMasterElement];
  const dominantSipsin = SIPSIN_CAREER_MAP[sipsinAnalysis.dominant];
  const secondarySipsin = SIPSIN_CAREER_MAP[sipsinAnalysis.secondary];

  // 오행 기반 적성 + 십신 기반 적성 결합
  const bestFields = [...new Set([
    ...elementCareer.fields.slice(0, 3),
    ...dominantSipsin.suitable.slice(0, 2)
  ])];

  const suitableJobs = [...new Set([
    ...elementCareer.jobs.slice(0, 5),
    ...dominantSipsin.suitable.slice(0, 2),
    ...(secondarySipsin?.suitable.slice(0, 1) || [])
  ])];

  // 기본 workStyle 생성
  let workStyle = `${elementCareer.style} ${dominantSipsin.tendency} 성향이 강해 ${dominantSipsin.suitable[0]} 분야에서 특히 두각을 나타낼 수 있습니다.`;

  // 무식상(식상 0) 체크 - 식신, 상관 모두 0인 경우
  const siksangCount = (sipsinAnalysis.distribution["식신"] || 0) + (sipsinAnalysis.distribution["상관"] || 0);

  // 무식상일 때 직업 추천 정교화
  let finalSuitableJobs = suitableJobs;
  let finalAvoidJobs = elementCareer.avoid;

  if (siksangCount === 0) {
    workStyle += " 다만 사주에 식상(食傷)이 없어서 창작이나 표현이 중요한 분야에서는 추가적인 노력이 필요할 수 있습니다. 생각을 행동으로 옮기는 것이 서툴 수 있으니, 계획을 세우고 단계적으로 실행하는 연습이 도움됩니다.";

    // 무식상에게 맞는 직업 추가 (규칙적, 체계적, 관리 분야)
    const noSiksangSuitableJobs = [
      "공무원", "행정직", "회계사", "세무사", "은행원",
      "사무관리직", "품질관리", "감사역", "법무사", "관리자"
    ];

    // 창작/표현 관련 직업을 피해야 할 직업에 추가
    const creativeJobs = [
      "예술가", "디자이너", "작가", "크리에이터", "연예인",
      "방송인", "유튜버", "마케터", "광고기획자"
    ];

    // 기존 suitableJobs에서 창작 직업 제거하고 관리 직업 추가
    finalSuitableJobs = [
      ...suitableJobs.filter(job => !creativeJobs.some(c => job.includes(c))),
      ...noSiksangSuitableJobs.slice(0, 3)
    ].slice(0, 8);

    // 피해야 할 직업에 창작 분야 추가
    finalAvoidJobs = [...new Set([...elementCareer.avoid, ...creativeJobs.slice(0, 3)])];
  }

  return {
    bestFields,
    suitableJobs: finalSuitableJobs,
    avoidJobs: finalAvoidJobs,
    workStyle
  };
}

// ============================================
// 직장 스타일 분석
// ============================================

interface WorkplaceStyle {
  leadershipType: string;
  teamworkStyle: string;
  stressResponse: string;
  idealEnvironment: string;
}

function analyzeWorkplaceStyle(
  dayMasterElement: FiveElement,
  sipsinAnalysis: { dominant: string; secondary: string },
  sinGangSinYak: string
): WorkplaceStyle {
  const dominantSipsin = SIPSIN_CAREER_MAP[sipsinAnalysis.dominant];

  // 신강/신약에 따른 스트레스 반응
  let stressResponse = "";
  if (sinGangSinYak === "신강") {
    stressResponse = "스트레스 상황에서도 자신의 방식을 고수하며, 직접 문제를 해결하려는 성향이 강합니다. 때로는 타인의 조언을 구하는 것이 도움이 됩니다.";
  } else if (sinGangSinYak === "신약") {
    stressResponse = "스트레스에 민감하게 반응할 수 있으나, 주변의 지지와 협력을 통해 극복합니다. 혼자 끌어안지 말고 도움을 요청하세요.";
  } else {
    stressResponse = "스트레스를 적절히 관리하며, 상황에 따라 유연하게 대처합니다. 균형 잡힌 접근이 강점입니다.";
  }

  // 오행별 팀워크 스타일
  const teamworkStyles: Record<FiveElement, string> = {
    wood: "성장을 돕는 멘토 역할을 자처하며, 팀원들의 발전을 적극 지원합니다",
    fire: "분위기 메이커로서 팀에 활력을 불어넣고, 열정적으로 프로젝트를 이끕니다",
    earth: "묵묵히 팀을 지탱하는 버팀목 역할을 하며, 안정적인 성과를 만들어냅니다",
    metal: "명확한 기준으로 품질을 관리하며, 체계적인 업무 처리를 선호합니다",
    water: "유연하게 팀원들 사이를 조율하며, 소통의 가교 역할을 합니다"
  };

  // 오행별 이상적인 환경
  const idealEnvironments: Record<FiveElement, string> = {
    wood: "성장 가능성이 있고, 자율성이 보장되는 환경. 창의적인 아이디어를 펼칠 수 있는 곳",
    fire: "인정받을 수 있고, 활기차며 역동적인 환경. 변화와 도전이 있는 곳",
    earth: "안정적이고 체계가 잡힌 환경. 장기적인 성장이 가능한 곳",
    metal: "명확한 규칙과 보상 체계가 있는 환경. 전문성을 인정받을 수 있는 곳",
    water: "유연하고 자유로운 환경. 다양한 경험과 학습 기회가 있는 곳"
  };

  return {
    leadershipType: dominantSipsin.leadership,
    teamworkStyle: teamworkStyles[dayMasterElement],
    stressResponse,
    idealEnvironment: idealEnvironments[dayMasterElement]
  };
}

// ============================================
// 직업 타임라인 분석
// ============================================

interface CareerTimeline {
  promotionPeriods: { year: number; probability: "높음" | "보통" | "낮음" }[];
  jobChangePeriods: { year: number; advice: string }[];
  startupSuitability: { score: number; analysis: string };
}

function analyzeCareerTimeline(
  sajuResult: SajuApiResult,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string,
  sipsinAnalysis: { dominant: string; secondary: string }
): CareerTimeline {
  const promotionPeriods: { year: number; probability: "높음" | "보통" | "낮음" }[] = [];
  const jobChangePeriods: { year: number; advice: string }[] = [];

  // 향후 10년 분석
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const age = currentAge + i;

    // 간략화된 승진/이직 시기 판단
    // 실제로는 세운과 대운의 십신 관계를 분석해야 함
    if (age % 10 === 0 || age % 10 === 5) {
      promotionPeriods.push({
        year,
        probability: i < 3 ? "높음" : "보통"
      });
    }

    // 이직 추천 시기
    if ((year - currentYear) === 2 || (year - currentYear) === 5 || (year - currentYear) === 8) {
      jobChangePeriods.push({
        year,
        advice: getJobChangeAdvice(sipsinAnalysis.dominant, year - currentYear)
      });
    }
  }

  // 창업 적합성 분석
  const startupScore = calculateStartupScore(sipsinAnalysis, sinGangSinYak);

  return {
    promotionPeriods,
    jobChangePeriods,
    startupSuitability: {
      score: startupScore,
      analysis: getStartupAnalysis(startupScore, sipsinAnalysis.dominant)
    }
  };
}

function getJobChangeAdvice(dominantSipsin: string, yearsFromNow: number): string {
  const advices: Record<string, string[]> = {
    비견: ["경쟁력을 키운 후 도전", "동종 업계 내 이동 유리", "독립 창업 고려"],
    겁재: ["리스크 관리 필요", "새로운 분야 도전 가능", "파트너십 신중히"],
    식신: ["자격증 취득 후 이동", "전문성 강화 우선", "교육/컨설팅 분야 고려"],
    상관: ["혁신 기업으로 이동 유리", "스타트업 합류 기회", "프리랜서 전환 검토"],
    편재: ["투자 관련 분야 유리", "규모 있는 조직으로", "해외 진출 검토"],
    정재: ["안정적인 대기업 추천", "복리후생 좋은 곳으로", "장기 근속 유리"],
    편관: ["권한 있는 자리로", "도전적인 환경으로", "리더십 발휘할 곳"],
    정관: ["공공기관 추천", "체계적인 조직으로", "승진 가능성 높은 곳"],
    편인: ["연구/개발 분야로", "자유로운 환경으로", "창의성 발휘할 곳"],
    정인: ["교육/상담 분야로", "안정적인 환경으로", "전문성 인정받는 곳"]
  };

  const sipsinAdvices = advices[dominantSipsin] || advices["정관"];
  const index = Math.min(Math.floor(yearsFromNow / 3), sipsinAdvices.length - 1);
  return sipsinAdvices[index];
}

function calculateStartupScore(
  sipsinAnalysis: { dominant: string; secondary: string },
  sinGangSinYak: string
): number {
  let score = 50; // 기본 점수

  // 신강/신약에 따른 조정
  if (sinGangSinYak === "신강") score += 15;
  else if (sinGangSinYak === "신약") score -= 10;

  // 십신에 따른 조정
  const startupFavorable = ["비견", "겁재", "식신", "상관", "편재"];
  if (startupFavorable.includes(sipsinAnalysis.dominant)) score += 20;
  if (startupFavorable.includes(sipsinAnalysis.secondary)) score += 10;

  const startupUnfavorable = ["정관", "정인"];
  if (startupUnfavorable.includes(sipsinAnalysis.dominant)) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function getStartupAnalysis(score: number, dominantSipsin: string): string {
  if (score >= 70) {
    return `창업 적합성이 높습니다. ${dominantSipsin}의 기질이 사업에 유리하게 작용합니다. 단, 안정적인 수입원을 확보한 후 도전하는 것이 현명합니다.`;
  } else if (score >= 50) {
    return `창업도 가능하지만, 철저한 준비가 필요합니다. 파트너를 찾거나 부업으로 시작하는 것을 권장합니다.`;
  } else {
    return `조직 생활이 더 적합합니다. 안정적인 환경에서 전문성을 키우는 것이 장기적으로 유리합니다. 창업을 원한다면 충분한 경험을 쌓은 후 도전하세요.`;
  }
}

// ============================================
// 직업상태별 조언
// ============================================

interface OccupationSpecificAdvice {
  status: OccupationStatus;
  currentAdvice: string;
  nextSteps: string[];
}

function generateOccupationAdvice(
  occupationStatus: OccupationStatus,
  careerAptitude: CareerAptitude,
  workplaceStyle: WorkplaceStyle,
  careerTimeline: CareerTimeline
): OccupationSpecificAdvice {
  let currentAdvice = "";
  let nextSteps: string[] = [];

  switch (occupationStatus) {
    case "employee":
      currentAdvice = `현재 직장에서 ${workplaceStyle.leadershipType}을 발휘하며 성장할 수 있습니다. ${workplaceStyle.idealEnvironment.split(".")[0]}인지 점검해보세요.`;
      nextSteps = [
        "현재 업무에서 전문성 강화에 집중하세요",
        `${careerAptitude.bestFields[0]} 분야 관련 역량을 개발하세요`,
        careerTimeline.promotionPeriods[0]
          ? `${careerTimeline.promotionPeriods[0].year}년 승진 기회를 노리세요`
          : "다음 승진 기회를 준비하세요",
        "사내 네트워킹을 강화하세요"
      ];
      break;

    case "business":
      currentAdvice = `사업자로서 ${careerAptitude.workStyle.split(".")[0]}의 강점을 살려 사업을 운영하세요. 고객과의 신뢰 구축이 핵심입니다.`;
      nextSteps = [
        `${careerAptitude.bestFields[0]} 관련 서비스 확장을 고려하세요`,
        "온라인 마케팅 역량을 강화하세요",
        "사업 다각화보다 핵심 역량 집중이 유리합니다",
        "재무 관리에 더욱 신경 쓰세요"
      ];
      break;

    case "freelance":
      currentAdvice = `프리랜서로서 ${careerAptitude.workStyle.split(".")[0]}의 강점을 살려 활동하세요. 꾸준한 포트폴리오 관리가 핵심입니다.`;
      nextSteps = [
        `${careerAptitude.bestFields[0]} 관련 프로젝트를 확장하세요`,
        "개인 브랜딩과 온라인 포트폴리오를 강화하세요",
        "다양한 클라이언트 네트워크를 구축하세요",
        "세금 및 재무 관리에 신경 쓰세요"
      ];
      break;

    case "student":
      currentAdvice = `학업에 집중하면서 ${careerAptitude.bestFields.slice(0, 2).join(", ")} 분야에 대한 이해를 넓혀가세요. 다양한 경험이 미래 직업 선택에 도움이 됩니다.`;
      nextSteps = [
        `${careerAptitude.suitableJobs[0]} 관련 인턴십을 경험해보세요`,
        "전공 관련 자격증 취득을 준비하세요",
        "동아리나 프로젝트 활동으로 실무 경험을 쌓으세요",
        "멘토를 찾아 진로 상담을 받아보세요"
      ];
      break;

    case "jobseeker":
      currentAdvice = `${careerAptitude.suitableJobs.slice(0, 3).join(", ")} 등의 직종이 적합합니다. 조급해하지 말고 나에게 맞는 회사를 찾으세요.`;
      nextSteps = [
        `${careerAptitude.bestFields[0]} 분야 기업 리스트를 작성하세요`,
        "이력서와 자기소개서를 직무별로 맞춤 작성하세요",
        "관련 분야 네트워킹 행사에 참여하세요",
        `${careerAptitude.avoidJobs[0]} 같은 분야는 피하는 것이 좋습니다`
      ];
      break;

    case "homemaker":
      currentAdvice = `가정을 돌보면서도 ${careerAptitude.suitableJobs.slice(0, 2).join(", ")} 관련 재택 근무나 파트타임 기회를 모색해볼 수 있습니다.`;
      nextSteps = [
        "온라인 부업이나 재택 근무 기회를 탐색하세요",
        `${careerAptitude.bestFields[0]} 관련 자격증 취득을 고려하세요`,
        "육아/가사와 병행 가능한 프리랜서 일을 찾아보세요",
        "지역 사회 활동으로 네트워크를 넓히세요"
      ];
      break;

    default:
      currentAdvice = "현재 상황에 맞는 커리어 전략을 수립해보세요.";
      nextSteps = [
        "자신의 강점과 관심사를 파악하세요",
        "다양한 직업 정보를 수집하세요",
        "전문가 상담을 받아보세요"
      ];
  }

  return {
    status: occupationStatus,
    currentAdvice,
    nextSteps
  };
}

// ============================================
// 메인 분석 함수
// ============================================

export function analyzeChapter10(
  sajuResult: SajuApiResult,
  _gender: Gender,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string,
  occupationStatus: OccupationStatus
): Chapter10Result {
  // 기본 분석
  const dayMasterElement = getDayMasterElement(sajuResult);
  const sipsinAnalysis = analyzeSipsinForCareer(sajuResult);

  // 직업 적성 분석
  const careerAptitude = analyzeCareerAptitude(dayMasterElement, sipsinAnalysis);

  // 직장 스타일 분석
  const workplaceStyle = analyzeWorkplaceStyle(dayMasterElement, sipsinAnalysis, sinGangSinYak);

  // 커리어 타임라인
  const careerTimeline = analyzeCareerTimeline(sajuResult, currentYear, currentAge, sinGangSinYak, sipsinAnalysis);

  // 직업상태별 조언
  const occupationSpecificAdvice = generateOccupationAdvice(
    occupationStatus,
    careerAptitude,
    workplaceStyle,
    careerTimeline
  );

  // 서술형 풀이 생성
  const narrative = generateCareerNarrative(
    dayMasterElement,
    occupationStatus,
    careerAptitude,
    workplaceStyle,
    sinGangSinYak
  );

  return {
    careerAptitude,
    workplaceStyle,
    careerTimeline,
    occupationSpecificAdvice,
    narrative
  };
}

/**
 * 서술형 풀이 생성
 */
function generateCareerNarrative(
  dayMasterElement: FiveElement,
  occupationStatus: OccupationStatus,
  careerAptitude: CareerAptitude,
  workplaceStyle: Chapter10Result["workplaceStyle"],
  sinGangSinYak: string
): Chapter10Result["narrative"] {
  const elementNarrative = DAY_MASTER_CAREER_NARRATIVES[dayMasterElement];
  const occupationNarrative = OCCUPATION_NARRATIVES[occupationStatus];

  // 신강/신약/중화 키 결정
  const strengthKey: "신강" | "신약" | "중화" = sinGangSinYak?.includes("신강") ? "신강"
    : sinGangSinYak?.includes("신약") ? "신약"
    : "중화";

  // 오행 × 신강신약 조합별 서술 가져오기
  const strengthNarrative = ELEMENT_STRENGTH_CAREER_NARRATIVES[dayMasterElement][strengthKey];

  // intro
  const intro = `이제 직업운에 대해 살펴보겠습니다. ${elementNarrative.intro} ${occupationNarrative.situation}`;

  // mainAnalysis
  let mainAnalysis = `${elementNarrative.nature}\n\n`;
  mainAnalysis += `${elementNarrative.bestPath}\n\n`;
  mainAnalysis += strengthNarrative.careerStyle;

  // details - 오행 × 신강신약 조합별 상세 내용 추가
  const details: string[] = [];

  details.push(
    `【적합한 분야】\n` +
    `${careerAptitude.bestFields.join(", ")} 분야가 잘 맞습니다.\n\n` +
    `【추천 직업】\n` +
    `${careerAptitude.suitableJobs.slice(0, 5).join(", ")} 등이 적합합니다.\n\n` +
    `【피해야 할 분야】\n` +
    `${careerAptitude.avoidJobs.join(", ")} 등은 피하는 것이 좋습니다.`
  );

  details.push(
    `【직장 스타일】\n` +
    `리더십: ${workplaceStyle.leadershipType}\n` +
    `팀워크: ${workplaceStyle.teamworkStyle}\n` +
    `스트레스 대응: ${workplaceStyle.stressResponse}\n` +
    `이상적 환경: ${workplaceStyle.idealEnvironment}`
  );

  // 신강/신약/중화별 상세 조언 추가
  const elementKorean = dayMasterElement === "wood" ? "목" : dayMasterElement === "fire" ? "화" : dayMasterElement === "earth" ? "토" : dayMasterElement === "metal" ? "금" : "수";

  if (strengthKey === "신강") {
    const sinGangNarrative = strengthNarrative as typeof ELEMENT_STRENGTH_CAREER_NARRATIVES["wood"]["신강"];
    details.push(
      `【${elementKorean} 신강 - 리더십과 사업 적성】\n\n` +
      `${sinGangNarrative.leadershipAdvice}\n\n` +
      `${sinGangNarrative.businessPotential}`
    );
  } else if (strengthKey === "신약") {
    const sinYakNarrative = strengthNarrative as typeof ELEMENT_STRENGTH_CAREER_NARRATIVES["wood"]["신약"];
    details.push(
      `【${elementKorean} 신약 - 협력과 안정 전략】\n\n` +
      `${sinYakNarrative.supportAdvice}\n\n` +
      `${sinYakNarrative.stabilityFocus}`
    );
  } else {
    const jungHwaNarrative = strengthNarrative as typeof ELEMENT_STRENGTH_CAREER_NARRATIVES["wood"]["중화"];
    details.push(
      `【${elementKorean} 중화 - 균형과 유연성】\n\n` +
      `${jungHwaNarrative.balanceAdvice}\n\n` +
      `${jungHwaNarrative.flexibilityStrength}`
    );
  }

  details.push(
    `【성장 전략】\n\n${strengthNarrative.growthStrategy}`
  );

  details.push(
    `【주의 사항】\n\n${strengthNarrative.warningPoints}`
  );

  // advice
  const advice = `${occupationNarrative.advice}\n\n${elementNarrative.warning}`;

  // closing
  const closing = `${occupationNarrative.encouragement}\n\n` +
    `직업은 단순히 돈을 버는 수단이 아니라 자신을 표현하고 성장하는 무대입니다. ` +
    `나에게 맞는 일을 찾아가다 보면 분명 좋은 기회가 찾아올 것입니다.`;

  return {
    intro,
    mainAnalysis,
    details,
    advice,
    closing
  };
}
