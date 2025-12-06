/**
 * 제5장: 살(煞)과 귀인(貴人) 분석
 * - 신살 상세 해석
 * - 귀인 분석
 * - 신살 상호작용 (복합 신살)
 */

import type { SajuApiResult, Pillar } from "@/types/saju";
import type { Chapter5Result, SinsalAnalysis } from "@/types/expert";

// ============================================
// 상수 및 데이터
// ============================================

// 천을귀인 (天乙貴人) - 일간 기준
const CHEONUL_GUIIN: Record<string, string[]> = {
  갑: ["축", "미"],
  을: ["자", "신"],
  병: ["해", "유"],
  정: ["해", "유"],
  무: ["축", "미"],
  기: ["자", "신"],
  경: ["축", "미"],
  신: ["인", "오"],
  임: ["묘", "사"],
  계: ["묘", "사"],
};

// 문창귀인 (文昌貴人) - 일간 기준
const MUNCHANG_GUIIN: Record<string, string> = {
  갑: "사", 을: "오", 병: "신", 정: "유",
  무: "신", 기: "유", 경: "해", 신: "자",
  임: "인", 계: "묘",
};

// 학당귀인 (學堂貴人) - 일간 기준
const HAKDANG_GUIIN: Record<string, string> = {
  갑: "해", 을: "오", 병: "인", 정: "유",
  무: "인", 기: "유", 경: "사", 신: "자",
  임: "신", 계: "묘",
};

// 태극귀인 (太極貴人) - 일간 기준
const TAEGEUK_GUIIN: Record<string, string[]> = {
  갑: ["자", "오"],
  을: ["자", "오"],
  병: ["묘", "유"],
  정: ["묘", "유"],
  무: ["묘", "유", "축", "미"],
  기: ["묘", "유", "축", "미"],
  경: ["인", "해"],
  신: ["인", "해"],
  임: ["사", "신"],
  계: ["사", "신"],
};

// 역마살 (驛馬殺) - 일지/년지 기준
const YEOKMA: Record<string, string> = {
  인: "신", 오: "신", 술: "신",  // 인오술 → 신
  사: "해", 유: "해", 축: "해",  // 사유축 → 해
  신: "인", 자: "인", 진: "인",  // 신자진 → 인
  해: "사", 묘: "사", 미: "사",  // 해묘미 → 사
};

// 도화살 (桃花殺) - 일지/년지 기준
const DOHWA: Record<string, string> = {
  인: "묘", 오: "묘", 술: "묘",
  사: "오", 유: "오", 축: "오",
  신: "유", 자: "유", 진: "유",
  해: "자", 묘: "자", 미: "자",
};

// 화개살 (華蓋殺) - 일지/년지 기준
const HWAGAE: Record<string, string> = {
  인: "술", 오: "술", 술: "술",
  사: "축", 유: "축", 축: "축",
  신: "진", 자: "진", 진: "진",
  해: "미", 묘: "미", 미: "미",
};

// 공망 (空亡) - 년주/일주 기준
const GONGMANG_TABLE: Record<string, [string, string]> = {
  갑자: ["술", "해"], 을축: ["술", "해"], 병인: ["술", "해"], 정묘: ["술", "해"], 무진: ["술", "해"], 기사: ["술", "해"],
  경오: ["신", "유"], 신미: ["신", "유"], 임신: ["신", "유"], 계유: ["신", "유"], 갑술: ["신", "유"], 을해: ["신", "유"],
  병자: ["오", "미"], 정축: ["오", "미"], 무인: ["오", "미"], 기묘: ["오", "미"], 경진: ["오", "미"], 신사: ["오", "미"],
  임오: ["진", "사"], 계미: ["진", "사"], 갑신: ["진", "사"], 을유: ["진", "사"], 병술: ["진", "사"], 정해: ["진", "사"],
  무자: ["인", "묘"], 기축: ["인", "묘"], 경인: ["인", "묘"], 신묘: ["인", "묘"], 임진: ["인", "묘"], 계사: ["인", "묘"],
  갑오: ["자", "축"], 을미: ["자", "축"], 병신: ["자", "축"], 정유: ["자", "축"], 무술: ["자", "축"], 기해: ["자", "축"],
};

// 양인살 (羊刃殺) - 일간 기준
const YANGIN: Record<string, string> = {
  갑: "묘", 을: "진", 병: "오", 정: "미",
  무: "오", 기: "미", 경: "유", 신: "술",
  임: "자", 계: "축",
};

// 괴강살 (魁罡殺) - 일주 기준
const GWAEGANG: string[] = ["임진", "경술", "경진", "무술"];

// 백호대살 (白虎大煞) - 일지 기준
const BAEKHO: Record<string, string> = {
  자: "묘", 축: "진", 인: "사", 묘: "오",
  진: "미", 사: "신", 오: "유", 미: "술",
  신: "해", 유: "자", 술: "축", 해: "인",
};

// 귀문관살 (鬼門關殺) - 지지 조합
const GWIMUNGWAN: [string, string][] = [
  ["묘", "유"], ["인", "신"], ["사", "해"], ["자", "오"],
];

// 신살 상세 정보
interface SinsalInfo {
  name: string;
  hanja: string;
  category: "길신" | "흉신" | "중성";
  basicMeaning: string;
  detailedInterpretation: string;
  lifeImpact: string;
  remedy?: string;
}

// ============================================
// 신살 × 신강신약 조합별 상세 서술형 상수
// ============================================

type StrengthType = "신강" | "신약" | "중화";

// 신살 조합별 상세 해석 (8신살 × 3신강신약 = 24조합)
const SINSAL_STRENGTH_NARRATIVES: Record<string, Record<StrengthType, {
  manifestation: string;
  lifeAdvice: string;
  careerGuidance: string;
  relationshipImpact: string;
  remedyDetail: string;
}>> = {
  역마살: {
    신강: {
      manifestation: "역마살이 신강과 만나면 강력한 이동과 변화의 에너지가 됩니다. 스스로 움직이고 변화를 주도하는 성향이 강합니다. 해외 진출, 사업 확장, 새로운 도전에서 성공할 가능성이 높습니다. 한 곳에 머물기보다는 활발하게 움직이실 때 기운이 살아납니다.",
      lifeAdvice: "역마의 에너지를 적극적으로 활용하세요. 여행, 출장, 해외 업무를 자청하면 좋은 기회가 옵니다. 다만 너무 자주 옮겨다니면 뿌리를 내리기 어려우니, 기반을 다지신 후에 확장하는 것이 좋습니다.",
      careerGuidance: "무역, 물류, 여행, 항공, 해외 영업 분야에서 두각을 나타내실 수 있습니다. 본사보다 지사, 사무실보다 현장에서 일하는 것이 맞습니다. 창업한다면 이동이 잦은 업종이 유리합니다.",
      relationshipImpact: "바쁘게 움직이시다 보니 가족과의 시간이 부족해질 수 있습니다. 의도적으로 가족과 함께하는 시간을 만들고, 멀리 있더라도 자주 연락하세요. 배우자도 함께 움직이는 것을 즐기는 사람이면 좋습니다.",
      remedyDetail: "이동 에너지를 일에 집중시키고, 개인 생활에서는 안정을 찾는 균형이 필요합니다. 집은 편안하게 꾸미고, 여행할 때와 쉴 때를 구분하세요."
    },
    신약: {
      manifestation: "역마살이 신약과 만나면 이동에 대한 욕구는 있으나 체력적으로 따라가기 어려울 수 있습니다. 원하지 않는 이동이나 변화가 찾아오기도 합니다. 그러나 이를 잘 활용하면 오히려 새로운 환경에서 기회를 찾을 수 있습니다.",
      lifeAdvice: "무리한 이동보다는 계획된 이동을 하세요. 여행을 가더라도 일정을 여유롭게 잡고, 충분히 쉬어가는 것이 좋습니다. 이사나 전근이 생기면 긍정적으로 받아들이시되 건강 관리에 신경 쓰세요.",
      careerGuidance: "이동이 많은 직업보다는 안정적인 직장에서 가끔 출장을 다니는 정도가 적합합니다. 온라인으로 해외와 교류하거나, 재택근무를 병행하는 것도 좋은 방법입니다.",
      relationshipImpact: "잦은 이동으로 인한 스트레스가 관계에 영향을 줄 수 있습니다. 안정적인 환경에서 관계를 유지하는 것이 좋습니다. 배우자나 가족의 지지가 큰 힘이 됩니다.",
      remedyDetail: "역마의 에너지를 정신적인 여행, 즉 독서나 학습으로 대체하는 것도 좋습니다. 명상이나 요가로 내면의 안정을 찾으면 역마의 불안함이 줄어듭니다."
    },
    중화: {
      manifestation: "역마살이 중화와 만나면 이동과 안정 사이에서 균형을 찾을 수 있습니다. 필요할 때 움직이고, 필요할 때 쉬는 유연함이 있습니다. 상황에 맞게 이동의 강도를 조절할 수 있어서 다양한 환경에 적응하기 좋습니다.",
      lifeAdvice: "이동과 정착의 타이밍을 잘 잡으면 됩니다. 20~30대에는 적극적으로 움직이면서 경험을 쌓고, 40대 이후에는 점차 안정을 찾아가는 것이 자연스럽습니다. 본인의 페이스대로 하세요.",
      careerGuidance: "다양한 직업 환경에 적응할 수 있습니다. 본사 근무와 현장 근무를 번갈아 하거나, 국내와 해외를 오가는 일도 잘 소화합니다. 직장을 다니면서 여행 관련 부업을 해도 좋습니다.",
      relationshipImpact: "이동이 많아도 관계를 잘 유지할 수 있는 능력이 있습니다. 다만 상대방의 성향도 고려하여 함께 움직이시거나, 충분히 소통하며 관계를 이어가세요.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 본인의 리듬대로 이동과 휴식을 조절하면 됩니다. 다만 장거리 여행 후에는 충분히 쉬는 것을 잊지 마세요."
    }
  },
  도화살: {
    신강: {
      manifestation: "도화살이 신강과 만나면 강력한 매력과 인기를 발산합니다. 이성에게 매력적으로 보이고, 사람들을 끄는 힘이 있습니다. 대중적인 인기를 얻을 수 있으며, 사교적인 자리에서 빛을 발합니다. 다만 이성 관계가 복잡해질 수 있으니 주의가 필요합니다.",
      lifeAdvice: "도화의 매력을 긍정적으로 활용하세요. 연예, 서비스, 영업, 예술 분야에서 이 매력이 성공의 열쇠가 됩니다. 다만 이성 관계에서는 분별력을 가지고, 진정한 인연과 스쳐 지나가는 인연을 구별하세요.",
      careerGuidance: "연예인, 인플루언서, 영업직, 서비스업, 이벤트 기획 등에서 두각을 나타내실 수 있습니다. 사람을 상대하는 일에서 본인의 매력이 빛납니다. 창업한다면 뷰티, 패션, 엔터테인먼트 분야가 유리합니다.",
      relationshipImpact: "이성에게 인기가 많으니 배우자가 질투할 수 있습니다. 결혼 후에는 가정에 충실하고, 이성 친구 관계도 투명하게 하는 것이 좋습니다. 도화의 에너지를 가족 사랑으로 승화시키세요.",
      remedyDetail: "도화 에너지를 예술 활동이나 창작 활동으로 승화시키세요. 춤, 노래, 그림, 글쓰기 등으로 표현하면 이성 문제로 번지지 않습니다. 취미로 공연이나 전시를 하는 것도 좋습니다."
    },
    신약: {
      manifestation: "도화살이 신약과 만나면 은은한 매력이 있습니다. 강렬하게 끌기보다는 자연스럽게 호감을 얻는 타입입니다. 다만 이성에게 이용당하거나 감정적으로 상처받기 쉬우니 주의가 필요합니다.",
      lifeAdvice: "진심 어린 관계를 추구하세요. 겉모습보다는 마음을 보고, 서로를 존중하는 관계를 맺으세요. 이성 관계에서 너무 빨리 마음을 주지 말고, 상대방을 충분히 알아가신 후에 깊은 관계로 발전시키세요.",
      careerGuidance: "무대 앞에 나서기보다는 뒤에서 지원하는 역할이 편할 수 있습니다. 스타일리스트, 메이크업 아티스트, 이벤트 코디네이터 등 사람의 매력을 돋보이게 하는 일이 잘 맞습니다.",
      relationshipImpact: "감정적으로 예민하니 상처받지 않도록 보호하세요. 본인을 소중히 여기지 않는 사람에게는 거리를 두고, 진심으로 아껴주는 사람을 찾으세요. 혼자 있는 시간도 소중히 하면서 자존감을 키우세요.",
      remedyDetail: "자존감을 높이는 활동이 도움이 됩니다. 자기 계발, 운동, 취미 활동으로 스스로를 가꾸면 더 건강한 관계를 맺을 수 있습니다."
    },
    중화: {
      manifestation: "도화살이 중화와 만나면 매력과 절제가 균형을 이룹니다. 필요할 때 매력을 발산하고, 필요할 때 절제할 수 있습니다. 사람들에게 호감을 주면서도 선을 지키는 능력이 있습니다.",
      lifeAdvice: "도화의 매력을 적절히 활용하면 됩니다. 사회생활에서 좋은 인상을 주고, 이성 관계에서도 적당한 거리감을 유지하면 문제가 생기지 않습니다. 결혼 후에도 매력을 유지하면서 가정도 잘 지키실 수 있습니다.",
      careerGuidance: "다양한 분야에서 대인 관계 능력을 활용할 수 있습니다. 영업, 마케팅, 고객 서비스, 홍보 등에서 좋은 성과를 내고, 본인이 주인공이 되는 것도, 지원하는 역할도 모두 가능합니다.",
      relationshipImpact: "균형 잡힌 관계를 맺을 수 있습니다. 배우자에게 충실하면서도 사회적으로 좋은 인상을 유지하는 것이 가능합니다. 이성 친구와의 관계도 적절히 관리할 수 있습니다.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 본인의 매력을 자연스럽게 발휘하면서 상황에 맞게 조절하면 됩니다."
    }
  },
  화개살: {
    신강: {
      manifestation: "화개살이 신강과 만나면 예술적 재능과 영적 감각이 강력하게 드러납니다. 독자적인 세계관을 가지고, 창작 활동에서 뛰어난 성과를 내실 수 있습니다. 다만 고독을 즐기시다 보니 사회성이 떨어질 수 있습니다.",
      lifeAdvice: "창작 활동이나 예술적 표현에 집중하세요. 혼자만의 시간을 소중히 하시되, 세상과 완전히 단절되지는 마세요. 본인의 작품이나 생각을 세상과 나누면 공감을 얻을 수 있습니다.",
      careerGuidance: "예술가, 작가, 종교인, 철학자, 연구자 분야에서 빛을 발할 수 있습니다. 독창적인 작품 활동이나 깊이 있는 연구에서 성과를 냅니다. 혼자 일하는 환경이 맞습니다.",
      relationshipImpact: "내면 세계가 풍요로우시지만 타인에게 마음을 열기 어려울 수 있습니다. 본인을 이해해주는 소수의 사람과 깊은 관계를 맺고, 정서적 교류를 하는 것이 중요합니다.",
      remedyDetail: "사회적 활동에 조금씩 참여하면서 균형을 잡으세요. 창작 동아리나 종교 모임 등에서 비슷한 관심사를 가진 사람들과 교류하면 고독감이 줄어듭니다."
    },
    신약: {
      manifestation: "화개살이 신약과 만나면 예민하고 섬세한 감성이 있습니다. 예술적 감수성이 뛰어나시지만 우울하거나 외로움을 느끼기 쉽습니다. 내면의 풍요로움을 찾으시되 정서적 안정에도 신경 써야 합니다.",
      lifeAdvice: "정서적 안정을 위한 활동을 규칙적으로 하세요. 명상, 요가, 산책 등으로 마음의 평화를 유지하고, 신뢰할 수 있는 사람과 감정을 나누세요. 혼자만 끌어안지 말고 도움을 요청하는 것도 중요합니다.",
      careerGuidance: "안정적인 환경에서 예술 활동을 하는 것이 좋습니다. 풀타임 예술가보다는 취미로 창작을 하거나, 안정적인 직장을 다니면서 부업으로 예술 활동을 하는 것이 맞습니다.",
      relationshipImpact: "외로움을 느끼기 쉬우니 정서적으로 교류할 수 있는 관계를 만드세요. 배우자나 가까운 친구와 깊은 대화를 나누고, 감정을 표현하는 연습을 하세요.",
      remedyDetail: "심리 상담이나 예술 치료가 도움이 됩니다. 내면의 감정을 건강하게 표현하고 처리하는 방법을 배우면 정서적 안정을 찾을 수 있습니다."
    },
    중화: {
      manifestation: "화개살이 중화와 만나면 예술적 감성과 현실 감각이 균형을 이룹니다. 창작 활동을 하면서도 사회생활에 적응할 수 있습니다. 혼자만의 시간과 사회적 시간을 적절히 배분할 수 있습니다.",
      lifeAdvice: "예술과 현실 사이에서 균형을 잡으면 됩니다. 취미로 창작 활동을 하면서 직장 생활이나 가정생활도 잘 유지하는 것이 가능합니다. 본인만의 창작 시간을 확보하면서 사회적 관계도 유지하세요.",
      careerGuidance: "다양한 분야에서 창의성을 발휘할 수 있습니다. 디자이너, 기획자, 마케터 등 창의적인 일을 하면서도 조직 생활에 적응할 수 있습니다. 부업으로 예술 활동을 병행하는 것도 좋습니다.",
      relationshipImpact: "혼자만의 시간과 함께하는 시간의 균형을 잘 잡을 수 있습니다. 배우자나 친구에게 본인의 필요를 솔직하게 말하고, 서로의 시간을 존중하면 좋은 관계를 유지할 수 있습니다.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 본인의 리듬대로 창작과 휴식, 사회활동의 균형을 잡으면 됩니다."
    }
  },
  양인살: {
    신강: {
      manifestation: "양인살이 신강과 만나면 매우 강력한 결단력과 추진력이 됩니다. 칼처럼 날카롭게 상황을 판단하고 과감하게 행동합니다. 경쟁에서 이기는 힘이 있지만, 지나치면 사고나 충돌이 생길 수 있습니다.",
      lifeAdvice: "날카로운 에너지를 긍정적인 방향으로 쓰세요. 스포츠, 무술, 경쟁이 필요한 분야에서 이 기운을 발산하면 좋습니다. 분노를 조절하는 연습을 하고, 충동적인 결정은 피하세요.",
      careerGuidance: "외과 의사, 군인, 경찰, 운동선수, 소방관 등 결단력이 필요한 직업에서 빛을 발합니다. 경쟁이 치열한 업계에서도 살아남을 수 있는 강인함이 있습니다. 사업을 한다면 강한 추진력으로 성공할 수 있지만, 리스크 관리에 주의하세요.",
      relationshipImpact: "날카로운 성향 때문에 가까운 사람과 충돌하기 쉽습니다. 가족이나 배우자에게는 부드럽게 대하고, 날카로운 에너지는 일에서 발산하세요. 인내심을 기르는 것이 관계에 도움이 됩니다.",
      remedyDetail: "운동이나 무술로 양인의 에너지를 발산하세요. 명상이나 심호흡으로 분노를 다스리고, 중요한 결정은 하루 정도 생각한 후에 하세요."
    },
    신약: {
      manifestation: "양인살이 신약과 만나면 결단력이 있지만 실행에 어려움이 있을 수 있습니다. 날카로운 판단은 하지만 체력이나 자원이 따라가지 못하는 경우가 있습니다. 외부의 공격이나 사고에 주의가 필요합니다.",
      lifeAdvice: "무리한 행동을 삼가고 안전에 신경 쓰세요. 운전이나 위험한 활동에서 특히 주의하고, 건강 검진을 정기적으로 받으세요. 결단을 내릴 때는 주변의 조언을 참고하는 것이 좋습니다.",
      careerGuidance: "위험하거나 체력 소모가 큰 직업보다는 안정적인 환경에서 일하는 것이 맞습니다. 분석, 판단, 기획 역할은 잘하니 관리직이나 전문직에서 능력을 발휘하세요.",
      relationshipImpact: "예민할 수 있으니 감정 조절에 신경 쓰세요. 가까운 사람에게 날카롭게 대하지 않도록 주의하고, 스트레스를 건강하게 해소하는 방법을 찾으세요.",
      remedyDetail: "안전에 각별히 주의하고, 위험한 활동은 피하세요. 요가나 태극권처럼 부드러운 운동으로 에너지를 다스리면 좋습니다."
    },
    중화: {
      manifestation: "양인살이 중화와 만나면 결단력과 신중함이 균형을 이룹니다. 필요할 때 날카롭게 결정하고, 필요할 때 부드럽게 대처할 수 있습니다. 상황에 맞게 에너지의 강도를 조절하는 능력이 있습니다.",
      lifeAdvice: "양인의 결단력을 적절히 활용하면 됩니다. 중요한 순간에는 과감하게 결정하고, 평소에는 부드럽게 지내면 됩니다. 운동이나 경쟁 활동으로 에너지를 발산하는 것도 좋습니다.",
      careerGuidance: "다양한 분야에서 능력을 발휘할 수 있습니다. 관리직, 전문직, 경쟁이 있는 업계 모두에서 적응할 수 있습니다. 본인의 결단력이 필요한 순간에 빛을 발합니다.",
      relationshipImpact: "가까운 사람과의 관계도 잘 유지할 수 있습니다. 필요할 때 단호하게, 평소에는 부드럽게 대하면 됩니다. 갈등이 생겨도 잘 해결하는 능력이 있습니다.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 본인의 에너지를 상황에 맞게 조절하면서 건강하게 발산하면 됩니다."
    }
  },
  괴강살: {
    신강: {
      manifestation: "괴강살이 신강과 만나면 매우 강력한 카리스마와 지도력이 됩니다. 북두칠성의 밝은 별처럼 주변을 압도하는 존재감이 있습니다. 리더로서 두각을 나타내시지만, 고독하거나 배우자 운이 약해질 수 있습니다.",
      lifeAdvice: "강한 카리스마를 리더십으로 승화시키세요. 조직의 수장이나 책임자 역할에서 진가를 발휘합니다. 다만 가정에서는 부드러움을 유지하고, 배우자를 존중하는 것이 중요합니다.",
      careerGuidance: "CEO, 정치인, 군 장성, 판사, 대표 등 권위 있는 위치에서 능력을 발휘합니다. 조직을 이끌고 결정을 내리는 역할이 잘 맞습니다. 권력과 책임이 따르는 위치에서 빛납니다.",
      relationshipImpact: "강한 기운 때문에 배우자와 충돌하기 쉽습니다. 가정에서는 권위보다 사랑으로 대하고, 배우자의 의견도 존중하세요. 일과 가정의 균형을 잘 잡는 것이 중요합니다.",
      remedyDetail: "가정에서 유연함을 기르는 연습을 하세요. 배우자에게 감사를 표현하고, 함께하는 시간을 소중히 하세요. 명상으로 마음의 평화를 찾는 것도 도움이 됩니다."
    },
    신약: {
      manifestation: "괴강살이 신약과 만나면 내면의 강인함은 있으나 외부로 드러나기 어려울 수 있습니다. 리더가 되고 싶으시지만 기회가 오지 않거나, 자신감이 부족할 수 있습니다. 그러나 때가 되면 빛을 발할 수 있습니다.",
      lifeAdvice: "때를 기다리면서 실력을 키우세요. 조급해하지 말고 차근차근 경력을 쌓아가면 언젠가 리더의 위치에 오를 수 있습니다. 자신감을 키우는 활동을 하고, 작은 것부터 책임지는 연습을 하세요.",
      careerGuidance: "부리더나 참모 역할에서 시작하여 점차 리더 위치로 올라가는 것이 좋습니다. 안정적인 조직에서 경험을 쌓으면서 기회를 기다리세요. 전문성을 키우면 존경받는 리더가 될 수 있습니다.",
      relationshipImpact: "관계에서 주도권을 가지시기 어려울 수 있으나, 이것이 오히려 평화로운 관계로 이어질 수 있습니다. 배우자와 동등하게 의논하고 함께 결정하는 것이 좋습니다.",
      remedyDetail: "자존감을 높이는 활동을 하세요. 작은 성공 경험을 쌓으면서 자신감을 키우고, 리더십 교육을 받는 것도 도움이 됩니다."
    },
    중화: {
      manifestation: "괴강살이 중화와 만나면 카리스마와 조화가 균형을 이룹니다. 리더십이 있면서도 팀원들과 소통할 수 있습니다. 권위를 가지면서도 부드럽게 이끄는 능력이 있습니다.",
      lifeAdvice: "리더십을 발휘하시되 독단적이지 않게 하세요. 팀원들의 의견을 듣고 함께 결정하는 협력적 리더십이 잘 맞습니다. 가정에서도 일에서도 균형 잡힌 모습을 보일 수 있습니다.",
      careerGuidance: "다양한 조직에서 리더 역할을 맡을 수 있습니다. 권위적인 조직에서도, 수평적인 조직에서도 적응하면서 이끄실 수 있습니다. 팀을 화합시키는 능력이 있습니다.",
      relationshipImpact: "가정과 일의 균형을 잘 잡을 수 있습니다. 배우자를 존중하면서도 가정을 이끄는 역할을 할 수 있습니다. 관계에서도 리더십을 발휘하시되 부드럽게 하세요.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 본인의 리더십을 상황에 맞게 발휘하면서 주변과 조화를 이루면 됩니다."
    }
  },
  백호대살: {
    신강: {
      manifestation: "백호대살이 신강과 만나면 강한 생명력과 함께 사고나 질병에 대한 저항력이 있습니다. 위험한 상황에서도 살아남는 강인함이 있지만, 무모한 행동으로 사고를 자초할 수도 있습니다.",
      lifeAdvice: "위험한 활동에서 주의하고, 안전 수칙을 지키세요. 운전, 익스트림 스포츠, 위험한 작업에서 각별히 조심하고, 정기적인 건강 검진을 받으세요. 강인함을 과신하지 말고 겸손하게 대처하세요.",
      careerGuidance: "위험 관리, 안전 관련 분야에서 오히려 능력을 발휘할 수 있습니다. 소방관, 경호원, 안전 관리자 등의 직업에서 본인의 강인함이 빛납니다. 다만 본인의 안전도 항상 챙기세요.",
      relationshipImpact: "가족들이 걱정할 수 있으니 위험한 행동은 자제하세요. 사랑하는 사람들을 위해서라도 안전하게 생활하는 것이 중요합니다. 보험이나 대비책을 마련해두는 것도 좋습니다.",
      remedyDetail: "안전에 관한 교육을 받고, 위험 인지 능력을 키우세요. 명상으로 마음의 평화를 찾고, 무모한 행동을 자제하세요. 부적이나 안전을 상징하는 물건을 지니는 것도 심리적 도움이 됩니다."
    },
    신약: {
      manifestation: "백호대살이 신약과 만나면 사고나 질병에 취약할 수 있습니다. 면역력이 약하거나 다치기 쉬우실 수 있으니 건강 관리에 각별히 신경 써야 합니다. 예방이 최선입니다.",
      lifeAdvice: "건강을 최우선으로 챙기세요. 규칙적인 생활, 균형 잡힌 식사, 적당한 운동으로 면역력을 키우고, 정기적으로 건강 검진을 받으세요. 위험한 활동은 피하고, 안전한 환경에서 생활하세요.",
      careerGuidance: "위험하거나 체력 소모가 큰 직업은 피하는 것이 좋습니다. 안전하고 안정적인 환경에서 일하는 것이 맞습니다. 사무직, 재택근무, 교육 분야 등이 적합합니다.",
      relationshipImpact: "가족들에게 건강 상태를 알리고, 정서적 지지를 받으세요. 배우자나 가까운 사람이 돌봐주면 안정을 찾을 수 있습니다. 함께 건강 관리를 하는 것도 좋습니다.",
      remedyDetail: "건강 보험을 충분히 들어두고, 응급 상황에 대비하세요. 안전한 생활 환경을 만들고, 스트레스를 줄이는 활동을 하세요."
    },
    중화: {
      manifestation: "백호대살이 중화와 만나면 주의하면서도 과도하게 두려워하지 않아도 됩니다. 적절한 주의와 대비로 사고를 예방할 수 있습니다. 균형 잡힌 생활로 건강을 유지할 수 있습니다.",
      lifeAdvice: "기본적인 안전 수칙을 지키고 건강 검진을 정기적으로 받으면 됩니다. 너무 두려워할 필요는 없지만, 방심도 금물입니다. 균형 잡힌 생활을 유지하세요.",
      careerGuidance: "특별히 제한되는 직업은 없습니다. 다만 위험한 직종이라면 안전 교육을 철저히 받고 대비하세요. 어떤 분야에서든 안전을 염두에 두면 됩니다.",
      relationshipImpact: "가족들과 함께 건강한 생활을 유지하면 됩니다. 서로의 건강을 챙기고, 안전한 환경을 만들어가세요. 균형 잡힌 생활이 관계에도 좋습니다.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 기본적인 안전과 건강 관리를 유지하면 됩니다."
    }
  },
  귀문관살: {
    신강: {
      manifestation: "귀문관살이 신강과 만나면 강한 영적 감각과 직관력이 됩니다. 눈에 보이지 않는 것을 느끼는 능력이 있고, 사람의 마음을 꿰뚫어 보는 통찰력이 있습니다. 다만 이 감각이 지나치면 정신적으로 힘먹을 수 있습니다.",
      lifeAdvice: "영적 감각을 긍정적으로 활용하세요. 상담, 치유, 예술 분야에서 이 능력을 발휘할 수 있습니다. 다만 부정적인 에너지에 노출되지 않도록 하고, 자신을 보호하는 방법을 배우세요.",
      careerGuidance: "심리상담사, 영적 치유사, 역술가, 예술가 등에서 빛을 발할 수 있습니다. 사람의 내면을 다루는 일에 재능이 있습니다. 다만 너무 무거운 에너지를 많이 받으면 지치니 적절히 조절하세요.",
      relationshipImpact: "상대방의 마음을 잘 읽으시지만, 너무 깊이 들여다보면 관계가 피로해질 수 있습니다. 적당한 거리감을 유지하면서 관계를 맺고, 본인의 에너지를 보호하는 것도 중요합니다.",
      remedyDetail: "명상, 기도, 영적 수련으로 에너지를 정화하고 보호하세요. 부정적인 장소나 사람을 피하고, 자연 속에서 휴식을 취하면 좋습니다."
    },
    신약: {
      manifestation: "귀문관살이 신약과 만나면 정신적으로 예민하고 불안하기 쉽습니다. 우울증, 불안장애, 불면증 등에 취약할 수 있습니다. 그러나 이를 잘 다스리면 깊은 감수성과 예술적 재능으로 발휘할 수 있습니다.",
      lifeAdvice: "정신 건강을 최우선으로 챙기세요. 심리 상담이나 정신과 진료를 받는 것을 두려워하지 말고, 필요하면 전문가의 도움을 받으세요. 규칙적인 생활과 충분한 수면이 중요합니다.",
      careerGuidance: "스트레스가 적고 안정적인 환경에서 일하는 것이 좋습니다. 예술 치료사, 글쓰기, 명상 지도자 등 치유와 관련된 일에서 본인의 경험이 도움이 될 수 있습니다.",
      relationshipImpact: "정서적 지지가 매우 중요합니다. 믿을 수 있는 배우자나 친구가 곁에 있면 큰 힘이 됩니다. 혼자 끌어안지 말고 마음을 나누세요.",
      remedyDetail: "심리 상담, 명상, 예술 치료가 도움이 됩니다. 좋은 에너지가 있는 장소에서 시간을 보내고, 부정적인 것들로부터 거리를 두세요."
    },
    중화: {
      manifestation: "귀문관살이 중화와 만나면 영적 감각과 현실 감각이 균형을 이룹니다. 직관력이 있면서도 일상생활에 잘 적응할 수 있습니다. 필요할 때 내면의 목소리를 듣고, 필요할 때 현실에 집중할 수 있습니다.",
      lifeAdvice: "영적 감각을 일상에서 자연스럽게 활용하면 됩니다. 중요한 결정을 내릴 때 직관을 참고하시되 현실적인 판단도 병행하세요. 균형 잡힌 삶을 살아가면 됩니다.",
      careerGuidance: "다양한 분야에서 직관력을 활용할 수 있습니다. 상담, 기획, 창작 등 사람의 마음을 이해해야 하는 일에서 특히 유리합니다. 일반 직장에서도 통찰력으로 인정받을 수 있습니다.",
      relationshipImpact: "상대방의 마음을 이해하면서도 적절한 거리감을 유지할 수 있습니다. 깊은 관계를 맺으면서도 서로의 경계를 존중하는 건강한 관계를 만들어가실 수 있습니다.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 가끔 명상이나 자연 속 휴식으로 에너지를 정화하면 충분합니다."
    }
  },
  공망: {
    신강: {
      manifestation: "공망이 신강과 만나면 공망이 걸린 영역에서 오히려 독자적인 길을 개척할 수 있습니다. 세속적인 욕심에서 벗어나 정신적 성장에 집중하게 되어, 남들과 다른 방식으로 성공할 수 있습니다.",
      lifeAdvice: "공망이 있다고 해서 해당 영역을 포기하지 마세요. 다른 방식으로 접근하면 됩니다. 물질적인 성공보다 정신적인 만족을 추구하면 오히려 더 큰 것을 얻을 수 있습니다.",
      careerGuidance: "세속적인 성공보다 의미 있는 일을 하는 것이 맞습니다. 종교, 철학, 교육, 봉사 분야에서 진정한 성취감을 느낄 수 있습니다. 돈보다 가치를 추구하면 결국 둘 다 얻을 수 있습니다.",
      relationshipImpact: "공망이 있는 기둥에 따라 해당 관계에서 어려움이 있을 수 있습니다. 그러나 다른 방식으로 관계를 맺으면 됩니다. 조건 없는 사랑, 진정한 우정을 추구하면 더 깊은 관계를 맺을 수 있습니다.",
      remedyDetail: "공망을 두려워하지 말고 그 에너지를 정신적 성장에 활용하세요. 명상, 철학 공부, 봉사 활동이 도움이 됩니다."
    },
    신약: {
      manifestation: "공망이 신약과 만나면 해당 영역에서 공허함이나 결핍을 느끼시기 쉽습니다. 무언가 채워지지 않는 느낌이 들거나, 해당 영역에서 성과가 잘 나지 않을 수 있습니다. 다른 방향으로 에너지를 전환하는 것이 좋습니다.",
      lifeAdvice: "공망이 있는 영역에 너무 매달리지 말고, 다른 영역에서 보상을 찾으세요. 부족한 것에 집중하기보다 가지고 있는 것에 감사하면 공허함이 줄어듭니다. 정신적 성장에 관심을 가지는 것도 좋습니다.",
      careerGuidance: "공망과 관련된 분야보다 다른 분야에서 성공을 찾는 것이 수월합니다. 본인이 잘하고 에너지가 있는 분야에 집중하고, 부족한 부분은 다른 사람과 협력하여 채우세요.",
      relationshipImpact: "해당 관계에서 어려움이 있면 다른 관계에서 위안을 찾으세요. 모든 관계가 완벽할 수는 없으니, 가지고 있는 인연을 소중히 하면 됩니다. 스스로를 사랑하는 것도 중요합니다.",
      remedyDetail: "공망의 공허함을 정신적인 활동으로 채우세요. 종교, 명상, 봉사 활동이 도움이 됩니다. 심리 상담을 받는 것도 좋습니다."
    },
    중화: {
      manifestation: "공망이 중화와 만나면 해당 영역에서 다소의 어려움은 있으나 큰 문제가 되지 않습니다. 공망의 영향을 적절히 관리하면서 일상생활을 영위할 수 있습니다. 필요하면 보완하고, 아니면 다른 데 집중하면 됩니다.",
      lifeAdvice: "공망을 너무 심각하게 받아들이지 마세요. 약간의 어려움은 있을 수 있지만, 다른 영역의 에너지로 보완하면 됩니다. 균형 잡힌 삶을 살아가면 공망의 영향이 줄어듭니다.",
      careerGuidance: "특별히 피할 분야는 없습니다. 공망과 관련된 영역에서 조금 더 노력이 필요할 수는 있지만, 불가능하지는 않습니다. 본인이 원하는 분야에서 꾸준히 노력하면 됩니다.",
      relationshipImpact: "관계에서 약간의 어려움이 있을 수 있지만, 노력으로 극복할 수 있습니다. 소통을 잘하고 진심을 다하면 좋은 관계를 맺을 수 있습니다.",
      remedyDetail: "특별한 보완이 필요하지 않습니다. 공망에 해당하는 영역에서 조금 더 신경 쓰면 충분합니다."
    }
  }
};

// 귀인 조합별 상세 해석 (4귀인 × 3신강신약 = 12조합)
const GUIIN_STRENGTH_NARRATIVES: Record<string, Record<StrengthType, {
  blessing: string;
  activationTiming: string;
  bestUtilization: string;
  relationships: string;
  warning: string;
}>> = {
  천을귀인: {
    신강: {
      blessing: "천을귀인이 신강과 만나면 스스로의 힘으로 성공하면서도 필요할 때 귀인의 도움이 따릅니다. 위기 상황에서 기적적으로 도움이 나타나고, 높은 위치에 있는 사람들의 눈에 띄기 쉽습니다. 사회적 성공 운이 매우 좋습니다.",
      activationTiming: "본인이 적극적으로 움직이실 때 귀인이 나타납니다. 새로운 프로젝트를 시작하거나 도전을 할 때 도와주는 분이 있습니다. 위기에 처해도 누군가 손을 내밀어주니 두려워하지 마세요.",
      bestUtilization: "인맥을 적극적으로 관리하고, 윗사람들에게 예의를 갖추세요. 도움을 받으면 반드시 보답하고, 은혜를 갚는 마음을 가지세요. 그러면 귀인이 계속 나타납니다.",
      relationships: "사회적으로 도움을 주고받을 수 있는 넓은 인맥이 있습니다. 멘토를 찾으시기 쉽고, 스폰서를 만나실 수도 있습니다. 이 인연들을 소중히 하세요.",
      warning: "귀인복을 당연하게 여기면 안 됩니다. 감사하는 마음을 유지하고, 본인도 다른 이의 귀인이 되어주세요."
    },
    신약: {
      blessing: "천을귀인이 신약과 만나면 본인의 힘만으로는 어려우시지만 귀인의 도움으로 난관을 극복합니다. 특히 위급한 상황에서 구원자가 나타나는 경우가 많습니다. 귀인에 의지하시되 점차 독립하는 것이 좋습니다.",
      activationTiming: "어려울 때 귀인이 나타납니다. 본인이 힘드시다고 느낄 때 주변에 도움을 요청하면 누군가 나서줍니다. 부끄러워하지 말고 도움을 받으세요.",
      bestUtilization: "귀인의 도움을 받으면서 본인의 실력도 키워가세요. 도움만 받으시다 보면 독립하기 어려워지니, 조금씩 자립하는 연습을 하세요. 은혜를 갚으려는 마음도 중요합니다.",
      relationships: "본인을 도와주는 사람들과 좋은 관계를 유지하세요. 배우자나 가족, 친구가 귀인 역할을 해주는 경우도 많습니다. 감사한 마음을 자주 표현하세요.",
      warning: "귀인에게 너무 의지하면 본인의 성장이 정체될 수 있습니다. 도움을 받으시되 스스로 설 수 있는 힘을 기르세요."
    },
    중화: {
      blessing: "천을귀인이 중화와 만나면 필요할 때 적절하게 귀인의 도움을 받으면서도 스스로의 힘으로 해결하는 균형이 있습니다. 위기에서 도움이 오지만 일상에서는 본인 힘으로 살아갑니다.",
      activationTiming: "중요한 기로에 서실 때 귀인이 나타납니다. 큰 결정을 내려야 할 때나 새로운 시작을 할 때 조언자나 후원자가 나타나니 열린 마음으로 받아들이세요.",
      bestUtilization: "도움이 필요할 때는 겸손하게 요청하고, 스스로 할 수 있을 때는 독립적으로 하세요. 이 균형이 귀인복을 오래 유지하는 비결입니다.",
      relationships: "다양한 사람들과 좋은 관계를 유지하면 그중에서 귀인이 나타납니다. 특별히 찾지 않아도 자연스럽게 인연이 이어집니다.",
      warning: "귀인복이 있으니 안심하시되, 당연하게 여기시지는 마세요. 감사하는 마음과 베푸는 마음을 유지하세요."
    }
  },
  문창귀인: {
    신강: {
      blessing: "문창귀인이 신강과 만나면 학문과 시험에서 뛰어난 성과를 거두실 수 있습니다. 공부하면 그만큼 결과가 나오고, 자격증 시험이나 입시에서 좋은 운이 따릅니다. 문서 관련 일도 잘 풀립니다.",
      activationTiming: "본격적으로 공부하거나 시험을 준비할 때 기운이 작용합니다. 자격증 취득, 승진 시험, 학위 취득 등에서 좋은 결과가 있습니다. 적극적으로 도전하세요.",
      bestUtilization: "평생 학습하는 자세를 가지세요. 새로운 분야를 배우시거나 자격증을 취득하면 그것이 성공으로 이어집니다. 문서 작성 능력도 키우면 좋습니다.",
      relationships: "지적으로 교류할 수 있는 인연이 많습니다. 스터디 모임이나 학술 그룹에서 좋은 인연을 만나실 수 있습니다. 멘토와 멘티 관계도 좋습니다.",
      warning: "학업 성취에 자만하지 말고 겸손하게 계속 배우세요. 지식을 쌓는 것도 중요하지만 실천하는 것도 중요합니다."
    },
    신약: {
      blessing: "문창귀인이 신약과 만나면 학문에 대한 열정은 있지만 체력이나 집중력이 부족할 수 있습니다. 그러나 꾸준히 노력하면 결과가 나오고, 늦더라도 원하는 자격을 취득할 수 있습니다.",
      activationTiming: "무리하지 말고 본인의 페이스대로 공부하세요. 한 번에 많이 하기보다 매일 조금씩 꾸준히 하는 것이 효과적입니다. 시험 시기를 잘 조절하면 좋은 결과가 있습니다.",
      bestUtilization: "온라인 강의나 스터디 그룹을 활용하여 함께 공부하세요. 혼자 하기보다 함께 하면 동기부여가 됩니다. 건강 관리를 하면서 공부하는 것이 중요합니다.",
      relationships: "공부를 도와주는 분이 있습니다. 과외 선생님, 스터디 멤버, 학습 멘토 등을 통해 도움을 받으세요. 혼자 끙끙대지 말고 도움을 요청하세요.",
      warning: "시험에 떨어져도 너무 낙담하지 마세요. 다시 도전하면 됩니다. 건강을 해치면서까지 공부하지는 마세요."
    },
    중화: {
      blessing: "문창귀인이 중화와 만나면 균형 잡힌 학습 능력이 있습니다. 무리하지 않으면서도 원하는 자격을 취득하고, 시험에서도 좋은 성과를 거두실 수 있습니다.",
      activationTiming: "계획을 세우고 꾸준히 실천하면 됩니다. 급하게 벼락치기 하기보다 여유 있게 준비하면 더 좋은 결과가 있습니다.",
      bestUtilization: "일과 학업의 균형을 잘 잡으면 됩니다. 직장을 다니면서 자격증을 따시거나, 학교를 다니면서 실무 경험을 쌓는 것이 가능합니다.",
      relationships: "배움과 관련된 좋은 인연이 있습니다. 선후배 관계, 동문 관계에서 도움을 주고받을 수 있습니다.",
      warning: "특별한 경고는 없습니다. 현재 하는 방식대로 꾸준히 하면 됩니다."
    }
  },
  학당귀인: {
    신강: {
      blessing: "학당귀인이 신강과 만나면 평생 배움의 자세로 성장하는 사람입니다. 새로운 것을 배우는 것을 즐기고, 지식을 습득하는 능력이 뛰어납니다. 교육자나 연구자로서의 자질이 있습니다.",
      activationTiming: "배움의 기회가 찾아올 때 적극적으로 참여하세요. 세미나, 워크숍, 강좌 등에서 성장할 수 있습니다. 가르치는 일에도 재능이 있으니 강의나 교육 활동을 해보세요.",
      bestUtilization: "배우신 것을 정리하고 다른 사람에게 전달하면 더 깊이 이해할 수 있습니다. 글을 쓰시거나 강의를 하면서 지식을 공유하세요. 그것이 또 다른 배움으로 이어집니다.",
      relationships: "지적 대화를 나눌 수 있는 친구나 동료가 많습니다. 학습 커뮤니티나 독서 모임에서 좋은 인연을 만나실 수 있습니다.",
      warning: "지식만 쌓고 실천하지 않으면 탁상공론이 될 수 있습니다. 배우신 것을 생활에 적용하는 연습을 하세요."
    },
    신약: {
      blessing: "학당귀인이 신약과 만나면 배우고 싶은 마음은 크시지만 여건이 따라주지 않을 수 있습니다. 그러나 조금씩 꾸준히 배워가면 목표를 달성할 수 있습니다. 늦깎이 학생도 성공합니다.",
      activationTiming: "시간이 나실 때 온라인 강의나 독학으로 배움을 이어가세요. 정규 교육이 어려우면 비정규 과정으로도 충분히 성장할 수 있습니다.",
      bestUtilization: "부담 없이 즐기면서 배우세요. 취미로 시작한 것이 전문성으로 이어지실 수 있습니다. 호기심을 잃지 말고 새로운 것에 도전하세요.",
      relationships: "배움을 도와주는 멘토를 찾으면 좋습니다. 혼자 하기보다 가르쳐주는 분의 도움을 받으면 더 빨리 성장합니다.",
      warning: "포기하지 말고 천천히 가세요. 늦더라도 계속 배우면 반드시 성취가 있습니다."
    },
    중화: {
      blessing: "학당귀인이 중화와 만나면 균형 잡힌 학습 능력으로 꾸준히 성장합니다. 특별히 뛰어나지 않아도 꾸준함으로 전문가가 될 수 있습니다.",
      activationTiming: "일상에서 배움의 기회를 놓치지 마세요. 업무 중에도 새로운 것을 배우고, 여가 시간에도 자기 계발을 하면 됩니다.",
      bestUtilization: "배우신 것을 업무나 생활에 바로 적용하면 효과가 배가됩니다. 이론과 실천의 균형을 잘 잡으세요.",
      relationships: "동료들과 지식을 공유하면서 함께 성장할 수 있습니다. 가르치고 배우는 상호작용이 좋습니다.",
      warning: "특별한 경고는 없습니다. 현재 하는 방식대로 꾸준히 하면 됩니다."
    }
  },
  태극귀인: {
    신강: {
      blessing: "태극귀인이 신강과 만나면 강력한 직관력과 영적 감각이 있습니다. 음양의 조화로운 에너지를 가져서 균형 잡힌 판단을 할 수 있습니다. 철학적 깊이와 통찰력이 뛰어납니다.",
      activationTiming: "중요한 결정을 내릴 때 직관을 믿으세요. 논리적으로 분석하기 전에 느껴지는 것이 있면 그것을 참고하세요. 명상이나 기도를 통해 답을 얻는 경우도 있습니다.",
      bestUtilization: "영적 수련이나 철학 공부를 하면 직관력이 더욱 발달합니다. 명상, 요가, 기공 등을 통해 내면의 힘을 키우면 삶의 질이 높아집니다.",
      relationships: "영적인 교류를 나눌 수 있는 인연이 있습니다. 종교 모임, 명상 그룹, 철학 동아리에서 깊은 인연을 만나실 수 있습니다.",
      warning: "영적인 것에만 치우치면 현실에서 동떨어질 수 있습니다. 영성과 현실의 균형을 잘 잡으세요."
    },
    신약: {
      blessing: "태극귀인이 신약과 만나면 섬세한 감성과 영적 감각이 있지만 현실에서 발휘하기 어려울 수 있습니다. 그러나 내면의 풍요로움은 삶에 깊이를 더해줍니다.",
      activationTiming: "조용한 시간을 갖고 내면의 목소리를 들으세요. 급하게 결정하지 말고 직관이 말해주는 것을 기다리세요. 자연 속에서 명상하면 답을 얻을 수 있습니다.",
      bestUtilization: "영적 성장에 집중하면 삶의 의미를 찾을 수 있습니다. 물질적인 성공보다 내면의 평화를 추구하면 행복할 수 있습니다.",
      relationships: "깊이 있는 영적 대화를 나눌 수 있는 분을 만나면 좋습니다. 표면적인 관계보다 진정한 교류가 있는 관계를 추구하세요.",
      warning: "현실에서 너무 도피하지 말고 균형을 잡으세요. 영성은 현실을 피하는 것이 아니라 더 잘 살아가는 힘입니다."
    },
    중화: {
      blessing: "태극귀인이 중화와 만나면 영성과 현실이 조화를 이룹니다. 직관력이 있면서도 현실적인 판단도 할 수 있어서 균형 잡힌 삶을 살 수 있습니다.",
      activationTiming: "일상에서 자연스럽게 직관을 활용하면 됩니다. 중요한 결정에서 느낌을 참고하시되 논리적 분석도 병행하세요.",
      bestUtilization: "명상이나 영적 수련을 일상에 포함시키면 삶의 질이 높아집니다. 아침 명상, 감사 일기 등 간단한 것부터 시작하세요.",
      relationships: "다양한 사람들과 깊이 있는 대화를 나누실 수 있습니다. 영적인 이야기도, 현실적인 이야기도 함께 할 수 있는 친구가 있면 좋습니다.",
      warning: "특별한 경고는 없습니다. 현재 하는 방식대로 영성과 현실의 균형을 유지하면 됩니다."
    }
  }
};

const GUIIN_INFO: Record<string, SinsalInfo> = {
  천을귀인: {
    name: "천을귀인",
    hanja: "天乙貴人",
    category: "길신",
    basicMeaning: "하늘이 도와주는 최고의 귀인성. 어려울 때 도움을 받습니다.",
    detailedInterpretation: "천을귀인은 사주에서 가장 귀한 길신으로, 위기 상황에서 귀인의 도움으로 화를 면하고 복을 받는 길성입니다. 사회생활에서 윗사람의 도움을 받기 쉽고, 어려운 일도 해결되는 경우가 많습니다.",
    lifeImpact: "사회적 성공, 위기 극복 능력, 귀인 복이 있음",
  },
  문창귀인: {
    name: "문창귀인",
    hanja: "文昌貴人",
    category: "길신",
    basicMeaning: "학문과 문서에 관한 귀인. 시험운이 좋습니다.",
    detailedInterpretation: "문창귀인은 학문, 시험, 자격증, 문서 관련 일에 길한 영향을 주는 귀인입니다. 공부를 잘하고 시험 운이 좋으며, 공문서나 계약 관련 일에서 유리합니다.",
    lifeImpact: "학업 성취, 시험 합격, 문서 운 좋음",
  },
  학당귀인: {
    name: "학당귀인",
    hanja: "學堂貴人",
    category: "길신",
    basicMeaning: "학문을 닦는 장소. 배움에 유리합니다.",
    detailedInterpretation: "학당귀인은 학업과 지식 습득에 유리한 귀인으로, 평생 배움의 자세를 가지며 새로운 것을 익히는 능력이 뛰어납니다.",
    lifeImpact: "평생 학습, 지적 능력 우수, 교육 분야 적합",
  },
  태극귀인: {
    name: "태극귀인",
    hanja: "太極貴人",
    category: "길신",
    basicMeaning: "우주의 근본 에너지. 영적 감각이 뛰어납니다.",
    detailedInterpretation: "태극귀인은 음양의 조화로운 에너지를 가진 귀인으로, 직관력과 영적 감각이 뛰어납니다. 종교, 철학, 명상 등에 관심이 많고 깊은 통찰력을 가집니다.",
    lifeImpact: "직관력, 영적 성장, 철학적 깊이",
  },
};

const SINSAL_INFO: Record<string, SinsalInfo> = {
  역마살: {
    name: "역마살",
    hanja: "驛馬殺",
    category: "중성",
    basicMeaning: "이동, 변화, 여행의 기운. 한 곳에 머물기 어렵습니다.",
    detailedInterpretation: "역마살은 이동과 변화의 에너지로, 자주 움직이고 여행이 많습니다. 한 곳에 정착하기 어렵지만, 무역, 물류, 여행 관련 직업에 유리합니다. 좋은 운에서는 해외 진출, 나쁜 운에서는 불안정함으로 나타납니다.",
    lifeImpact: "잦은 이동, 여행 많음, 해외 인연, 변화 추구",
    remedy: "안정적인 직업보다 이동이 많은 직업이 적합하며, 역마 에너지를 긍정적으로 활용하세요.",
  },
  도화살: {
    name: "도화살",
    hanja: "桃花殺",
    category: "중성",
    basicMeaning: "이성을 끄는 매력. 인기와 예술성이 있습니다.",
    detailedInterpretation: "도화살은 복숭아꽃처럼 이성을 끄는 매력의 에너지입니다. 외모가 뛰어나거나 매력적이며, 이성 관계가 많습니다. 연예인, 서비스업, 영업직에 유리하지만, 바람기로 이어질 수도 있습니다.",
    lifeImpact: "이성 인기, 예술적 감각, 서비스업 적합",
    remedy: "도화 에너지를 예술이나 대인 서비스 직업으로 승화시키는 것이 좋습니다.",
  },
  화개살: {
    name: "화개살",
    hanja: "華蓋殺",
    category: "중성",
    basicMeaning: "덮개 아래 홀로 있는 형상. 고독과 예술성이 있습니다.",
    detailedInterpretation: "화개살은 화려한 덮개 아래 홀로 있는 형상으로, 내면이 깊고 예술적 감각이 뛰어납니다. 종교, 철학, 예술에 관심이 많고 고독을 즐기는 면이 있습니다.",
    lifeImpact: "예술적 재능, 종교/철학적 관심, 고독감",
    remedy: "창작 활동이나 명상, 종교 활동으로 내면의 평화를 찾으세요.",
  },
  양인살: {
    name: "양인살",
    hanja: "羊刃殺",
    category: "흉신",
    basicMeaning: "양의 칼날처럼 날카로운 기운. 과감하지만 위험합니다.",
    detailedInterpretation: "양인살은 날카로운 칼날의 에너지로, 결단력과 추진력이 강합니다. 하지만 지나치면 사고, 수술, 분쟁이 따를 수 있습니다. 잘 쓰면 외과 의사, 군인, 운동 선수 등에서 빛을 발합니다.",
    lifeImpact: "결단력, 수술/사고 주의, 승부욕",
    remedy: "양인의 날카로운 기운을 긍정적인 결단력으로 활용하고, 무리한 행동은 피하세요.",
  },
  괴강살: {
    name: "괴강살",
    hanja: "魁罡殺",
    category: "중성",
    basicMeaning: "북두칠성의 기운. 강한 카리스마와 지도력이 있습니다.",
    detailedInterpretation: "괴강살은 북두칠성의 가장 밝은 별의 기운으로, 매우 강한 카리스마와 지도력을 가집니다. 관직이나 군대에서 두각을 나타내지만, 고독하고 배우자 운이 약할 수 있습니다.",
    lifeImpact: "강한 지도력, 카리스마, 고독, 배우자 운 주의",
    remedy: "리더 역할에 집중하되, 가정에서는 유연함을 기르세요.",
  },
  백호대살: {
    name: "백호대살",
    hanja: "白虎大煞",
    category: "흉신",
    basicMeaning: "흰 호랑이의 흉한 기운. 사고와 질병에 주의해야 합니다.",
    detailedInterpretation: "백호대살은 강력한 흉살로, 교통사고, 수술, 급성 질환 등에 주의가 필요합니다. 대운이나 세운에서 만나면 더욱 조심해야 합니다.",
    lifeImpact: "사고 위험, 급성 질병, 수술 가능성",
    remedy: "위험한 활동을 피하고, 건강 검진을 정기적으로 받으세요. 운전 시 특히 주의하세요.",
  },
  귀문관살: {
    name: "귀문관살",
    hanja: "鬼門關殺",
    category: "흉신",
    basicMeaning: "귀신의 문. 정신적 고통이나 우울에 주의해야 합니다.",
    detailedInterpretation: "귀문관살은 귀신의 문이라 하여 정신적 고통, 우울증, 불안장애 등에 취약할 수 있습니다. 하지만 잘 승화하면 영적 감각이나 예술적 재능으로 발휘됩니다.",
    lifeImpact: "정신 건강 주의, 영적 감각, 예민함",
    remedy: "명상이나 심리 상담을 통해 마음의 평화를 유지하세요. 영적 활동으로 승화하면 좋습니다.",
  },
  공망: {
    name: "공망",
    hanja: "空亡",
    category: "중성",
    basicMeaning: "비어있는 상태. 해당 영역이 공허하거나 늦어집니다.",
    detailedInterpretation: "공망은 특정 지지가 비어있는 상태로, 해당 기둥이 상징하는 영역에서 공허함이나 늦음이 있을 수 있습니다. 하지만 세속적 욕심이 적어 정신적 성장에는 유리합니다.",
    lifeImpact: "해당 영역 늦음, 공허함, 정신적 성장",
    remedy: "공망의 에너지를 정신적 성장과 내면 수양으로 활용하세요.",
  },
};

// ============================================
// 분석 함수
// ============================================

/**
 * 귀인 분석
 */
function analyzeGuiins(
  ilgan: string,
  branches: string[]
): SinsalAnalysis[] {
  const guiins: SinsalAnalysis[] = [];

  // 천을귀인
  const cheonulBranches = CHEONUL_GUIIN[ilgan] || [];
  for (const branch of branches) {
    if (cheonulBranches.includes(branch)) {
      const info = GUIIN_INFO["천을귀인"];
      guiins.push({
        ...info,
        position: `${branch}(지지)`,
      });
    }
  }

  // 문창귀인
  const munchangBranch = MUNCHANG_GUIIN[ilgan];
  if (munchangBranch && branches.includes(munchangBranch)) {
    const info = GUIIN_INFO["문창귀인"];
    guiins.push({
      ...info,
      position: `${munchangBranch}(지지)`,
    });
  }

  // 학당귀인
  const hakdangBranch = HAKDANG_GUIIN[ilgan];
  if (hakdangBranch && branches.includes(hakdangBranch)) {
    const info = GUIIN_INFO["학당귀인"];
    guiins.push({
      ...info,
      position: `${hakdangBranch}(지지)`,
    });
  }

  // 태극귀인
  const taegeukBranches = TAEGEUK_GUIIN[ilgan] || [];
  for (const branch of branches) {
    if (taegeukBranches.includes(branch)) {
      const info = GUIIN_INFO["태극귀인"];
      guiins.push({
        ...info,
        position: `${branch}(지지)`,
      });
    }
  }

  return guiins;
}

/**
 * 신살 분석
 */
function analyzeSinsals(
  ilgan: string,
  ilju: string,
  pillars: Pillar[]
): SinsalAnalysis[] {
  const sinsals: SinsalAnalysis[] = [];
  const branches = pillars.map(p => p.jiji).filter(Boolean) as string[];
  const ilji = pillars[2].jiji;
  const yeonji = pillars[0].jiji;

  // 역마살 (일지/년지 기준)
  const yeokmaBase = YEOKMA[ilji];
  if (yeokmaBase && branches.includes(yeokmaBase)) {
    const info = SINSAL_INFO["역마살"];
    sinsals.push({
      ...info,
      position: `${yeokmaBase}(지지)`,
    });
  }

  // 도화살 (일지 기준)
  const dohwaBase = DOHWA[ilji];
  if (dohwaBase && branches.includes(dohwaBase)) {
    const info = SINSAL_INFO["도화살"];
    sinsals.push({
      ...info,
      position: `${dohwaBase}(지지)`,
    });
  }

  // 화개살 (일지 기준)
  const hwagaeBase = HWAGAE[ilji];
  if (hwagaeBase && branches.includes(hwagaeBase)) {
    const info = SINSAL_INFO["화개살"];
    sinsals.push({
      ...info,
      position: `${hwagaeBase}(지지)`,
    });
  }

  // 양인살 (일간 기준)
  const yanginBranch = YANGIN[ilgan];
  if (yanginBranch && branches.includes(yanginBranch)) {
    const info = SINSAL_INFO["양인살"];
    sinsals.push({
      ...info,
      position: `${yanginBranch}(지지)`,
    });
  }

  // 괴강살 (일주 기준)
  if (GWAEGANG.includes(ilju)) {
    const info = SINSAL_INFO["괴강살"];
    sinsals.push({
      ...info,
      position: `${ilju}(일주)`,
    });
  }

  // 백호대살 (일지 기준)
  for (const branch of branches) {
    if (BAEKHO[ilji] === branch && branch !== ilji) {
      const info = SINSAL_INFO["백호대살"];
      sinsals.push({
        ...info,
        position: `${branch}(지지)`,
      });
    }
  }

  // 귀문관살 (지지 조합)
  for (const [b1, b2] of GWIMUNGWAN) {
    if (branches.includes(b1) && branches.includes(b2)) {
      const info = SINSAL_INFO["귀문관살"];
      sinsals.push({
        ...info,
        position: `${b1}-${b2}(지지 조합)`,
      });
    }
  }

  // 공망 (일주 기준)
  const gongmangPair = GONGMANG_TABLE[ilju];
  if (gongmangPair) {
    for (const gm of gongmangPair) {
      if (branches.includes(gm)) {
        const info = SINSAL_INFO["공망"];
        sinsals.push({
          ...info,
          position: `${gm}(지지)`,
        });
      }
    }
  }

  return sinsals;
}

/**
 * 신살 상호작용 분석
 */
function analyzeSinsalInteractions(
  sinsals: SinsalAnalysis[],
  guiins: SinsalAnalysis[]
): Chapter5Result["sinsalInteractions"] {
  const interactions: Chapter5Result["sinsalInteractions"] = [];
  const allNames = [...sinsals.map(s => s.name), ...guiins.map(g => g.name)];

  // 도화살 + 역마살 = 이동 중 이성 인연
  if (allNames.includes("도화살") && allNames.includes("역마살")) {
    interactions.push({
      combination: ["도화살", "역마살"],
      effect: "이동과 여행 중에 이성 인연이 많습니다. 출장이나 여행에서 연애가 시작될 수 있습니다.",
    });
  }

  // 화개살 + 문창귀인 = 학문적 깊이
  if (allNames.includes("화개살") && allNames.includes("문창귀인")) {
    interactions.push({
      combination: ["화개살", "문창귀인"],
      effect: "학문과 예술에 깊은 재능이 있습니다. 연구자나 작가로 성공할 가능성이 높습니다.",
    });
  }

  // 천을귀인 + 양인살 = 위기를 기회로
  if (allNames.includes("천을귀인") && allNames.includes("양인살")) {
    interactions.push({
      combination: ["천을귀인", "양인살"],
      effect: "위기 상황에서 귀인의 도움으로 극복하며, 오히려 더 큰 성공을 거둘 수 있습니다.",
    });
  }

  // 괴강살 + 양인살 = 강한 리더십
  if (allNames.includes("괴강살") && allNames.includes("양인살")) {
    interactions.push({
      combination: ["괴강살", "양인살"],
      effect: "매우 강한 리더십과 결단력을 가집니다. 군인, 경찰, 외과 의사 등에서 두각을 나타냅니다.",
    });
  }

  // 귀문관살 + 화개살 = 영적 감각
  if (allNames.includes("귀문관살") && allNames.includes("화개살")) {
    interactions.push({
      combination: ["귀문관살", "화개살"],
      effect: "영적 감각이 매우 뛰어납니다. 종교인, 역술가, 심리상담사로 적합합니다.",
    });
  }

  // 도화살 + 태극귀인 = 예술적 매력
  if (allNames.includes("도화살") && allNames.includes("태극귀인")) {
    interactions.push({
      combination: ["도화살", "태극귀인"],
      effect: "예술적 재능과 대중적 매력을 갖추고 있습니다. 연예인이나 예술가로 성공할 수 있습니다.",
    });
  }

  return interactions;
}

/**
 * 종합 평가
 */
function assessOverall(
  sinsals: SinsalAnalysis[],
  guiins: SinsalAnalysis[]
): Chapter5Result["overallAssessment"] {
  const positiveCount = guiins.length + sinsals.filter(s => s.category === "길신").length;
  const negativeCount = sinsals.filter(s => s.category === "흉신").length;
  const neutralCount = sinsals.filter(s => s.category === "중성").length;

  let dominantInfluence: "길신우세" | "흉신우세" | "균형";
  let summary = "";

  if (positiveCount > negativeCount + 1) {
    dominantInfluence = "길신우세";
    summary = `사주에 귀인이 ${guiins.length}개, 길신이 우세하여 전반적으로 좋은 기운을 가지고 있습니다. 어려울 때 도움을 받기 쉽고, 인생에서 복을 누릴 가능성이 높습니다.`;
  } else if (negativeCount > positiveCount + 1) {
    dominantInfluence = "흉신우세";
    summary = `사주에 흉살이 ${negativeCount}개로 주의가 필요합니다. 그러나 흉살도 잘 활용하면 강한 결단력이나 특수한 재능으로 발휘될 수 있습니다. 위험한 상황은 피하고, 건강에 유의하세요.`;
  } else {
    dominantInfluence = "균형";
    summary = `길신과 흉신이 균형을 이루고 있어, 상황에 따라 유연하게 대처할 수 있습니다. 귀인의 도움을 받으면서도 흉살의 에너지를 긍정적으로 승화시키는 것이 중요합니다.`;
  }

  return {
    positiveCount,
    negativeCount,
    dominantInfluence,
    summary,
  };
}

/**
 * 신강/신약/중화 타입 결정
 */
function getStrengthKey(sinGangSinYak: string): StrengthType {
  if (sinGangSinYak?.includes("신강")) return "신강";
  if (sinGangSinYak?.includes("신약")) return "신약";
  return "중화";
}

/**
 * 신살 서술형 Narrative 생성
 */
function generateSinsalNarrative(
  sinsals: SinsalAnalysis[],
  guiins: SinsalAnalysis[],
  sinsalInteractions: Chapter5Result["sinsalInteractions"],
  overallAssessment: Chapter5Result["overallAssessment"],
  sinGangSinYak: string
): Chapter5Result["narrative"] {
  const strengthKey = getStrengthKey(sinGangSinYak);
  const strengthLabel = strengthKey === "신강" ? "신강(身強)" : strengthKey === "신약" ? "신약(身弱)" : "중화(中和)";

  // 도입부
  let intro = "이제 신살(神煞)에 대해 살펴보겠습니다. 신살이란 사주에 숨어있는 특별한 기운을 말합니다. '살(煞)'이라고 하면 무섭게 들리실 수 있는데, 실제로는 좋은 기운(길신)도 있고 주의해야 할 기운(흉신)도 있습니다.\n\n";
  intro += `신살은 사주의 '숨겨진 재능'이나 '잠재된 주의사항'을 알려주는 것으로, 잘 활용하면 인생에 큰 도움이 됩니다. 특히 본인이 ${strengthLabel} 사주이신 점을 고려하여 각 신살이 어떻게 작용하는지 상세히 살펴보겠습니다.`;

  // 본론: 귀인과 신살 분석
  let mainAnalysis = "";

  // 귀인 분석 (신강/신약 조합별 상세 적용)
  if (guiins.length > 0) {
    mainAnalysis += "【귀인(貴人)의 기운】\n\n";
    mainAnalysis += `사주에 귀인이 ${guiins.length}개 있습니다. 귀인은 말 그대로 '귀한 사람'을 만나는 복입니다. 어려운 일이 생겨도 도와주는 분이 나타나고, 위기를 넘기실 힘이 있습니다.\n\n`;

    for (const guiin of guiins) {
      mainAnalysis += `• ${guiin.name}(${guiin.hanja})\n`;
      mainAnalysis += `${guiin.detailedInterpretation}\n\n`;

      // 신강/신약 조합별 상세 분석 추가
      const guiinNarrative = GUIIN_STRENGTH_NARRATIVES[guiin.name]?.[strengthKey];
      if (guiinNarrative) {
        mainAnalysis += `【${guiin.name} × ${strengthLabel} 상세 분석】\n`;
        mainAnalysis += `${guiinNarrative.blessing}\n\n`;
        mainAnalysis += `• 활성화 시기: ${guiinNarrative.activationTiming}\n`;
        mainAnalysis += `• 활용 방법: ${guiinNarrative.bestUtilization}\n`;
        mainAnalysis += `• 인간관계: ${guiinNarrative.relationships}\n`;
        mainAnalysis += `• 주의점: ${guiinNarrative.warning}\n\n`;
      }
    }
  } else {
    mainAnalysis += "【귀인(貴人)의 기운】\n\n";
    mainAnalysis += "사주에 뚜렷한 귀인성이 보이지 않습니다. 귀인이 없다고 해서 도움을 받지 못하는 것은 아닙니다. 다만 남에게 의지하기보다 본인의 힘으로 해결하는 성향이 강한 편입니다. 스스로 노력하면서 인복을 쌓아가면 됩니다.\n\n";
  }

  // 신살 분석 (신강/신약 조합별 상세 적용)
  if (sinsals.length > 0) {
    const gilSinsals = sinsals.filter(s => s.category === "길신");
    const hyungSinsals = sinsals.filter(s => s.category === "흉신");
    const jungSinsals = sinsals.filter(s => s.category === "중성");

    if (gilSinsals.length > 0) {
      mainAnalysis += "【길신(吉神)의 기운】\n\n";
      for (const sinsal of gilSinsals) {
        mainAnalysis += `• ${sinsal.name}(${sinsal.hanja})\n`;
        mainAnalysis += `${sinsal.detailedInterpretation}\n`;
        if (sinsal.remedy) {
          mainAnalysis += `→ ${sinsal.remedy}\n`;
        }
        mainAnalysis += "\n";
      }
    }

    if (jungSinsals.length > 0) {
      mainAnalysis += "【중성(中性) 신살의 기운】\n\n";
      mainAnalysis += "중성 신살은 길흉이 정해지지 않은 기운으로, 어떻게 활용하느냐에 따라 좋게도 나쁘게도 작용할 수 있습니다.\n\n";
      for (const sinsal of jungSinsals) {
        mainAnalysis += `• ${sinsal.name}(${sinsal.hanja})\n`;
        mainAnalysis += `${sinsal.detailedInterpretation}\n`;
        if (sinsal.remedy) {
          mainAnalysis += `→ ${sinsal.remedy}\n`;
        }
        mainAnalysis += "\n";

        // 신강/신약 조합별 상세 분석 추가
        const sinsalNarrative = SINSAL_STRENGTH_NARRATIVES[sinsal.name]?.[strengthKey];
        if (sinsalNarrative) {
          mainAnalysis += `【${sinsal.name} × ${strengthLabel} 상세 분석】\n`;
          mainAnalysis += `${sinsalNarrative.manifestation}\n\n`;
          mainAnalysis += `• 삶의 조언: ${sinsalNarrative.lifeAdvice}\n`;
          mainAnalysis += `• 직업 안내: ${sinsalNarrative.careerGuidance}\n`;
          mainAnalysis += `• 관계 영향: ${sinsalNarrative.relationshipImpact}\n`;
          mainAnalysis += `• 개운법: ${sinsalNarrative.remedyDetail}\n\n`;
        }
      }
    }

    if (hyungSinsals.length > 0) {
      mainAnalysis += "【흉신(凶神)의 기운】\n\n";
      mainAnalysis += "흉신이 있다고 해서 나쁜 일만 생기는 것은 아닙니다. 이 기운을 잘 이해하고 주의하면 오히려 강점으로 바꿀 수 있습니다.\n\n";
      for (const sinsal of hyungSinsals) {
        mainAnalysis += `• ${sinsal.name}(${sinsal.hanja})\n`;
        mainAnalysis += `${sinsal.detailedInterpretation}\n`;
        if (sinsal.remedy) {
          mainAnalysis += `→ ${sinsal.remedy}\n`;
        }
        mainAnalysis += "\n";

        // 신강/신약 조합별 상세 분석 추가
        const sinsalNarrative = SINSAL_STRENGTH_NARRATIVES[sinsal.name]?.[strengthKey];
        if (sinsalNarrative) {
          mainAnalysis += `【${sinsal.name} × ${strengthLabel} 상세 분석】\n`;
          mainAnalysis += `${sinsalNarrative.manifestation}\n\n`;
          mainAnalysis += `• 삶의 조언: ${sinsalNarrative.lifeAdvice}\n`;
          mainAnalysis += `• 직업 안내: ${sinsalNarrative.careerGuidance}\n`;
          mainAnalysis += `• 관계 영향: ${sinsalNarrative.relationshipImpact}\n`;
          mainAnalysis += `• 개운법: ${sinsalNarrative.remedyDetail}\n\n`;
        }
      }
    }
  }

  // 상세 분석: 신살 상호작용
  const details: string[] = [];

  if (sinsalInteractions.length > 0) {
    let interactionDetail = "【신살 상호작용 분석】\n\n";
    interactionDetail += "사주에 있는 신살들이 서로 만나서 특별한 기운을 만들어내고 있습니다.\n\n";

    for (const interaction of sinsalInteractions) {
      interactionDetail += `• ${interaction.combination.join(" + ")}\n`;
      interactionDetail += `${interaction.effect}\n\n`;
    }

    details.push(interactionDetail);
  }

  // 종합 평가 detail
  let assessDetail = "【신살 종합 평가】\n\n";
  assessDetail += overallAssessment.summary + "\n\n";

  if (overallAssessment.dominantInfluence === "길신우세") {
    assessDetail += "길신이 우세하니 전반적으로 복이 많으신 편입니다. 귀인의 도움을 받으시기 쉽고, 위기 상황에서도 빠져나오는 힘이 있습니다. 이 복을 당연하게 여기시지 말고 감사하며 살면 더 큰 복이 들어옵니다.";
  } else if (overallAssessment.dominantInfluence === "흉신우세") {
    assessDetail += "흉신이 다소 많으시지만 너무 걱정하지 마세요. 흉신도 잘 활용하면 강한 추진력이나 독특한 재능으로 발휘될 수 있습니다. 다만 건강과 안전에는 평소에 신경 쓰고, 무리한 모험은 피하는 것이 좋습니다.";
  } else {
    assessDetail += "길신과 흉신이 균형을 이루고 있어서, 상황에 따라 유연하게 대처하면 좋습니다. 좋은 기운을 살리고 주의할 기운은 조심하면서 지혜롭게 살아가면 됩니다.";
  }

  details.push(assessDetail);

  // 조언 (신강/신약에 따른 맞춤형)
  let advice = "【신살을 활용한 인생 조언】\n\n";

  if (guiins.length > 0) {
    if (strengthKey === "신강") {
      advice += "• 귀인이 있고 신강하니 본인의 능력으로 성공하면서도 필요할 때 귀인의 도움을 받을 수 있습니다. 적극적으로 도전하시되 감사하는 마음을 잊지 마세요.\n\n";
    } else if (strengthKey === "신약") {
      advice += "• 귀인이 있으니 어려울 때 주변에 도움을 요청하는 것을 두려워하지 마세요. 신약하니 귀인의 도움이 특히 중요합니다. 혼자 해결하려 하지 말고 귀인의 도움을 받으세요.\n\n";
    } else {
      advice += "• 귀인이 있으니 어려울 때 주변에 도움을 요청하는 것을 두려워하지 마세요. 중화이니 필요할 때 귀인의 도움을 받고, 평소에는 스스로의 힘으로 해결하면 됩니다.\n\n";
    }
  }

  const hasYeokma = sinsals.some(s => s.name === "역마살");
  const hasDohwa = sinsals.some(s => s.name === "도화살");
  const hasHwagae = sinsals.some(s => s.name === "화개살");
  const hasYangin = sinsals.some(s => s.name === "양인살");

  if (hasYeokma) {
    const yeokmaAdvice = SINSAL_STRENGTH_NARRATIVES["역마살"]?.[strengthKey];
    if (yeokmaAdvice) {
      advice += `• 역마살과 ${strengthLabel}: ${yeokmaAdvice.lifeAdvice}\n\n`;
    }
  }
  if (hasDohwa) {
    const dohwaAdvice = SINSAL_STRENGTH_NARRATIVES["도화살"]?.[strengthKey];
    if (dohwaAdvice) {
      advice += `• 도화살과 ${strengthLabel}: ${dohwaAdvice.lifeAdvice}\n\n`;
    }
  }
  if (hasHwagae) {
    const hwagaeAdvice = SINSAL_STRENGTH_NARRATIVES["화개살"]?.[strengthKey];
    if (hwagaeAdvice) {
      advice += `• 화개살과 ${strengthLabel}: ${hwagaeAdvice.lifeAdvice}\n\n`;
    }
  }
  if (hasYangin) {
    const yanginAdvice = SINSAL_STRENGTH_NARRATIVES["양인살"]?.[strengthKey];
    if (yanginAdvice) {
      advice += `• 양인살과 ${strengthLabel}: ${yanginAdvice.lifeAdvice}\n\n`;
    }
  }

  if (advice === "【신살을 활용한 인생 조언】\n\n") {
    advice += "• 신살의 특성을 이해하고 장점은 살리면서 단점은 보완해 나가세요. 모든 기운은 활용하기 나름입니다.\n\n";
  }

  // 마무리
  const closing = `이상으로 신살 분석을 마치겠습니다. 신살은 타고난 기운이지만, ${strengthLabel}이신 본인의 사주와 만나 어떻게 작용하는지를 이해하면 더욱 지혜롭게 활용할 수 있습니다. 길신은 감사히 받고, 흉신은 지혜롭게 다스리면서 본인만의 길을 찾아가기 바랍니다.`;

  return {
    intro,
    mainAnalysis,
    details,
    advice,
    closing,
  };
}

/**
 * 제5장 전체 분석 실행
 */
export function analyzeChapter5(sajuResult: SajuApiResult, sinGangSinYak: string): Chapter5Result {
  const { yearPillar, monthPillar, dayPillar, timePillar } = sajuResult;
  const pillars = [yearPillar, monthPillar, dayPillar, timePillar];
  const ilgan = dayPillar.cheongan;
  const ilju = `${dayPillar.cheongan}${dayPillar.jiji}`;
  const branches = pillars.map(p => p.jiji).filter(Boolean) as string[];

  // 귀인 분석
  const guiins = analyzeGuiins(ilgan, branches);

  // 신살 분석
  const sinsals = analyzeSinsals(ilgan, ilju, pillars);

  // 상호작용 분석
  const sinsalInteractions = analyzeSinsalInteractions(sinsals, guiins);

  // 종합 평가
  const overallAssessment = assessOverall(sinsals, guiins);

  // 서술형 Narrative 생성
  const narrative = generateSinsalNarrative(
    sinsals,
    guiins,
    sinsalInteractions,
    overallAssessment,
    sinGangSinYak
  );

  return {
    sinsals,
    guiins,
    sinsalInteractions,
    overallAssessment,
    narrative,
  };
}

export default analyzeChapter5;
