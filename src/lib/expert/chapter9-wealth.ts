/**
 * 제9장: 금전운(재물운) 분석
 *
 * 주요 분석 내용:
 * 1. 재물 유형 분석 (정재형/편재형/식상생재형/관인상생형)
 * 2. 시기별 재물운 흐름
 * 3. 투자 성향 분석
 * 4. 재물 개운법
 */

import type { SajuApiResult, FiveElement, Gender } from "@/types/saju";
import type { Chapter9Result } from "@/types/expert";

// ==================== 타입 정의 ====================

type FiveElementKey = "목" | "화" | "토" | "금" | "수";
type HeavenlyStemKr = "갑" | "을" | "병" | "정" | "무" | "기" | "경" | "신" | "임" | "계";

type WealthType = "정재형" | "편재형" | "식상생재형" | "관인상생형";
type RiskTolerance = "공격형" | "중립형" | "안정형";

// ==================== 타입 정의 (서술형) ====================

interface WealthNarrativeKey {
  dayMaster: HeavenlyStemKr;
  wealthType: WealthType;
  sinGangSinYak: "신강" | "신약" | "중화";
}

// ==================== 상수 정의 ====================

const STEM_ELEMENTS: Record<HeavenlyStemKr, FiveElement> = {
  갑: "wood", 을: "wood",
  병: "fire", 정: "fire",
  무: "earth", 기: "earth",
  경: "metal", 신: "metal",
  임: "water", 계: "water",
};

const ELEMENT_KR_TO_EN: Record<FiveElementKey, FiveElement> = {
  목: "wood", 화: "fire", 토: "earth", 금: "metal", 수: "water",
};

const ELEMENT_EN_TO_KR: Record<FiveElement, FiveElementKey> = {
  wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
};

// 오행 생극 관계
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

// 재물 유형별 설명
const WEALTH_TYPE_DESCRIPTIONS: Record<WealthType, {
  description: string;
  earningStyle: string;
  spendingPattern: string;
  characteristics: string[];
}> = {
  "정재형": {
    description: "안정적이고 계획적인 재물 운용을 선호합니다. 정기적인 수입과 저축을 중시합니다.",
    earningStyle: "정기 급여, 안정적 수입원을 통한 꾸준한 재물 축적",
    spendingPattern: "계획적 지출, 저축 우선, 필요한 곳에만 소비",
    characteristics: [
      "안정적인 직장 수입 선호",
      "장기 투자와 저축에 강점",
      "무리한 투자나 도박 기피",
      "가계부 관리에 철저",
      "노후 대비에 관심이 많음",
    ],
  },
  "편재형": {
    description: "유동적이고 투기적인 재물 운용에 재능이 있습니다. 큰 수익을 노리는 경향이 있습니다.",
    earningStyle: "투자 수익, 사업 소득, 부업 등 다양한 수입원 활용",
    spendingPattern: "과감한 지출, 돈을 굴리는 것을 좋아함, 때로는 충동 구매",
    characteristics: [
      "투자와 사업에 관심",
      "위험을 감수하는 성향",
      "돈의 흐름을 읽는 능력",
      "여러 수입원 보유",
      "재물 변동이 큰 편",
    ],
  },
  "식상생재형": {
    description: "재능과 기술을 통해 재물을 획득합니다. 창작물이나 서비스로 수익을 창출합니다.",
    earningStyle: "재능 기반 수입, 창작 활동, 기술직, 프리랜서 활동",
    spendingPattern: "자기 발전에 투자, 취미나 경험에 아낌없이 지출",
    characteristics: [
      "기술이나 재능으로 돈을 벌음",
      "창의적 활동에서 수익 창출",
      "자기 계발 투자에 적극적",
      "경험과 여행에 돈을 씀",
      "인적 네트워크가 재산",
    ],
  },
  "관인상생형": {
    description: "조직과 학습을 통해 재물을 축적합니다. 승진과 자격증이 재물로 연결됩니다.",
    earningStyle: "승진을 통한 급여 상승, 자격증/학위 활용, 전문직 수입",
    spendingPattern: "교육과 자격증에 투자, 체면 유지 비용, 계획적 저축",
    characteristics: [
      "학력/자격증이 재산",
      "조직 내 승진이 재물 증가로 연결",
      "안정적이지만 상한선 있음",
      "퇴직 후 수입 감소 우려",
      "명예와 재물을 동시 추구",
    ],
  },
};

// 투자 성향별 추천/비추천
const INVESTMENT_RECOMMENDATIONS: Record<RiskTolerance, {
  suitable: string[];
  avoid: string[];
  strategy: string;
}> = {
  "공격형": {
    suitable: ["주식 직접 투자", "부동산 개발", "스타트업 투자", "해외 투자", "암호화폐"],
    avoid: ["예금", "채권", "보험 저축"],
    strategy: "고위험 고수익 전략. 분산 투자로 리스크 관리 필요.",
  },
  "중립형": {
    suitable: ["혼합형 펀드", "ETF", "부동산 리츠", "배당주", "적금"],
    avoid: ["레버리지 투자", "단기 투기"],
    strategy: "안정과 수익의 균형. 장기 분산 투자 권장.",
  },
  "안정형": {
    suitable: ["예금", "적금", "국채", "보험 저축", "안정형 펀드"],
    avoid: ["주식 직접 투자", "암호화폐", "선물/옵션"],
    strategy: "원금 보전 최우선. 물가 상승률 이상의 수익 추구.",
  },
};

// ==================== 서술형 텍스트 데이터베이스 ====================

// 일간별 재물 성향 기본 설명
const DAY_MASTER_WEALTH_TRAITS: Record<HeavenlyStemKr, {
  name: string;
  element: string;
  yinYang: "양" | "음";
  baseTraits: string;
  wealthApproach: string;
  moneyPersonality: string;
}> = {
  "갑": {
    name: "갑목(甲木)",
    element: "목",
    yinYang: "양",
    baseTraits: "큰 나무처럼 곧고 우직한 성품을 가진 사람입니다. 자존심이 강하고 독립심이 뛰어나시지만, 그만큼 남에게 고개 숙이는 것을 어려워하는 편입니다.",
    wealthApproach: "재물을 대하는 태도가 참 당당합니다. 돈을 벌 때도 정정당당하게 벌고 싶어하고, 비굴하게 돈을 구하는 것은 체질적으로 못 하는 사람입니다. 그래서 때로는 좋은 기회가 와도 자존심 때문에 놓치는 경우가 있습니다. 하지만 이런 성품이 오히려 장기적으로는 신뢰를 쌓아서 큰 재물로 돌아오기도 합니다.",
    moneyPersonality: "갑목 일간이신 사람들은 보통 큰 돈에 관심이 있고, 소소하게 아끼는 것보다는 크게 벌어서 크게 쓰는 스타일입니다. 지출할 때도 당당하게 내는 편이고, 가격 흥정 같은 것은 잘 못하는 경우가 많습니다.",
  },
  "을": {
    name: "을목(乙木)",
    element: "목",
    yinYang: "음",
    baseTraits: "덩굴이나 풀처럼 유연하고 적응력이 뛰어나신 사람입니다. 상황에 따라 잘 휘어지실 줄 알고, 사람들 사이에서 조화롭게 지내는 능력이 있습니다.",
    wealthApproach: "재물을 대하는 방식이 굉장히 현실적입니다. 갑목처럼 큰 것만 노리시기보다는 작은 것부터 차곡차곡 모으는 타입입니다. 융통성이 있다 보니 여러 가지 수입원을 만드는 것도 잘하고, 사람 관계를 통해 돈이 들어오는 경우도 많습니다.",
    moneyPersonality: "을목 일간이신 사람들은 알뜰살뜰하게 모으는 편입니다. 필요하면 허리띠 졸라매는 것도 잘 하고, 세일이나 할인 같은 것도 잘 챙기는 실속파입니다. 다만 가끔 너무 소심하게 모으시다가 큰 기회를 놓치는 경우도 있습니다.",
  },
  "병": {
    name: "병화(丙火)",
    element: "화",
    yinYang: "양",
    baseTraits: "태양처럼 밝고 화려한 성품을 가졌습니다. 어디서든 눈에 띄고, 사람들에게 따뜻함을 주는 사람입니다. 낙천적이고 긍정적인 에너지가 넘칩니다.",
    wealthApproach: "돈을 벌 때도 화끈하고, 쓸 때도 화끈한 편입니다. 돈 앞에서 쩨쩨하게 구는 것이 체질적으로 안 맞습니다. 그래서 한 번 마음먹으면 과감하게 투자하는 경향이 있습니다. 성공하면 크게 성공하는데, 실패하면 또 크게 잃는 양면이 있습니다.",
    moneyPersonality: "병화 일간이신 사람들은 돈을 모으는 재미보다 쓰는 재미를 더 아는 편입니다. 선물을 잘 하고, 밥값을 잘 내고, 주변 사람들에게 베푸는 것을 좋아합니다. 다만 이런 성향 때문에 정작 본인 저축은 좀 부족할 수 있습니다.",
  },
  "정": {
    name: "정화(丁火)",
    element: "화",
    yinYang: "음",
    baseTraits: "촛불이나 등불처럼 은은하고 따뜻한 사람입니다. 병화처럼 화려하지는 않지만, 꾸준하고 안정적인 빛을 내는 사람입니다. 섬세하고 예민한 부분이 있습니다.",
    wealthApproach: "재물을 대하는 태도가 신중하고 꼼꼼합니다. 충동적으로 돈을 쓰는 일이 별로 없고, 항상 생각을 하고 결정하는 편입니다. 다만 너무 오래 고민하다가 좋은 기회를 놓치는 경우도 종종 있습니다.",
    moneyPersonality: "정화 일간이신 사람들은 통장 관리를 잘 하는 편입니다. 어디에 얼마 썼는지 대충은 기억하고, 불필요한 지출을 줄이시려고 노력합니다. 다만 스트레스를 받으면 충동 구매를 하는 경향이 있어서 이 부분은 주의가 필요합니다.",
  },
  "무": {
    name: "무토(戊土)",
    element: "토",
    yinYang: "양",
    baseTraits: "큰 산이나 바위처럼 든든하고 믿음직스러운 사람입니다. 한번 마음먹으신 것은 쉽게 바꾸지 않고, 주변 사람들에게 안정감을 주는 사람입니다.",
    wealthApproach: "재물에 대해서도 느긋하고 여유로우신 편입니다. 급하게 돈을 벌어야겠다는 조급함보다는, 천천히 쌓아가면 된다는 마인드를 가졌습니다. 그래서 장기 투자나 부동산 같은 안정적인 자산에 관심이 많습니다.",
    moneyPersonality: "무토 일간이신 사람들은 한 번 정한 소비 패턴을 잘 안 바꾸는 편입니다. 매달 고정적으로 저축하는 것도 잘 하고, 갑자기 큰 돈을 쓰는 일도 별로 없습니다. 다만 변화에 적응하는 것이 느려서 새로운 투자 기회를 잡는 것은 좀 어려울 수 있습니다.",
  },
  "기": {
    name: "기토(己土)",
    element: "토",
    yinYang: "음",
    baseTraits: "기름진 밭처럼 모든 것을 받아들이고 키워내는 사람입니다. 포용력이 크고, 사람들을 품어주는 따뜻한 성품을 가졌습니다.",
    wealthApproach: "재물도 서두르지 않고 차근차근 모으는 타입입니다. 씨앗을 뿌리고 열매를 기다리듯, 인내심을 가지고 재물을 키워가는 사람입니다. 그래서 단기간에 큰 돈을 버는 것은 어려우시지만, 장기적으로 보면 꾸준히 자산이 늘어나는 스타일입니다.",
    moneyPersonality: "기토 일간이신 사람들은 주변 사람들 챙기시느라 본인 것은 후순위로 미루는 경우가 많습니다. 자녀나 가족을 위해서는 아낌없이 쓰면서도 정작 본인을 위해서는 잘 안 쓰는 편입니다. 이런 희생정신이 장점이기도 하지만, 노후 준비는 꼭 챙겨야 합니다.",
  },
  "경": {
    name: "경금(庚金)",
    element: "금",
    yinYang: "양",
    baseTraits: "무쇠나 바위처럼 단단하고 결단력이 있는 사람입니다. 호불호가 명확하고, 한번 결정하면 뒤돌아보지 않는 추진력이 있습니다.",
    wealthApproach: "재물에 대해서도 호불호가 확실합니다. 번다고 생각하면 과감하게 투자하고, 아니다 싶으면 미련 없이 손절하는 스타일입니다. 이런 과감함이 큰 수익으로 이어지기도 하지만, 성급한 판단으로 손실을 보시기도 합니다.",
    moneyPersonality: "경금 일간이신 사람들은 돈 관리에 있어서도 원칙이 뚜렷한 편입니다. 이건 써야 할 돈, 이건 안 써야 할 돈을 명확하게 구분합니다. 다만 가끔 융통성이 부족해서 좋은 기회인데도 원칙에 안 맞다고 거부하는 경우가 있습니다.",
  },
  "신": {
    name: "신금(辛金)",
    element: "금",
    yinYang: "음",
    baseTraits: "보석이나 정제된 금속처럼 섬세하고 예리한 사람입니다. 미적 감각이 뛰어나고, 디테일을 놓치지 않는 눈이 있습니다.",
    wealthApproach: "재물을 다루실 때도 섬세하고 정확합니다. 가계부를 쓰시거나 지출 내역을 꼼꼼하게 체크하는 사람들이 많습니다. 작은 누수도 못 참는 성격이라 절약을 잘 하는 편입니다.",
    moneyPersonality: "신금 일간이신 사람들은 품질에 대한 기준이 높으신 편입니다. 싼 것보다는 좋은 것을 사시려고 하고, 가성비보다는 가심비를 중요하게 생각합니다. 그래서 지출이 좀 높아질 수 있는데, 대신 한번 사신 것은 오래 쓰는 편입니다.",
  },
  "임": {
    name: "임수(壬水)",
    element: "수",
    yinYang: "양",
    baseTraits: "큰 바다나 강물처럼 포용력이 크고 지혜로우신 사람입니다. 어떤 상황에서도 흔들리지 않는 깊은 내면을 가졌고, 큰 그림을 보는 눈이 있습니다.",
    wealthApproach: "재물을 보는 시야가 넓으신 편입니다. 당장 눈앞의 이익보다는 장기적인 관점에서 돈을 바라봅니다. 그래서 단기 수익보다는 장기 투자를 선호하고, 부동산이나 주식 같은 자산 투자에 관심이 많습니다.",
    moneyPersonality: "임수 일간이신 사람들은 돈의 흐름을 읽는 능력이 있습니다. 경제 뉴스나 시장 동향에 관심이 많고, 타이밍을 잡는 센스가 있습니다. 다만 너무 큰 그림만 보시다가 디테일한 관리를 놓치는 경우가 있습니다.",
  },
  "계": {
    name: "계수(癸水)",
    element: "수",
    yinYang: "음",
    baseTraits: "맑은 샘물이나 이슬처럼 순수하고 맑은 사람입니다. 감수성이 풍부하고, 직관력이 뛰어나신 사람입니다.",
    wealthApproach: "재물을 대하는 태도가 담백한 편입니다. 돈에 너무 집착하지 않으면서도, 필요할 때는 꼭 있게 되는 신기한 운이 있습니다. 직관적으로 투자 판단을 하는 경우가 많은데, 의외로 맞아떨어지는 경우가 많습니다.",
    moneyPersonality: "계수 일간이신 사람들은 물질적인 풍요보다는 정신적인 풍요를 더 중요하게 생각하는 편입니다. 그래서 돈을 벌기 위해 무리해서 일하기보다는 균형 잡힌 삶을 추구합니다. 다만 너무 무욕하다 보면 재물 축적이 어려울 수 있습니다.",
  },
};

// 재물유형별 상세 서술 (4유형 × 3신강신약 = 12조합)
const WEALTH_TYPE_NARRATIVES: Record<WealthType, {
  신강: {
    intro: string;
    mainAnalysis: string;
    details: string[];
    advice: string;
    closing: string;
  };
  신약: {
    intro: string;
    mainAnalysis: string;
    details: string[];
    advice: string;
    closing: string;
  };
  중화: {
    intro: string;
    mainAnalysis: string;
    details: string[];
    advice: string;
    closing: string;
  };
}> = {
  "정재형": {
    신강: {
      intro: "사주를 살펴보니 정재(正財)의 기운이 뚜렷하게 보입니다. 정재는 '바른 재물', '정당한 재물'이라는 뜻으로, 이 기운을 가진 사람들은 안정적이고 계획적인 재물 운용에 타고난 재능이 있습니다.",
      mainAnalysis: "게다가 신강(身强)하니 이 정재의 기운을 잘 감당할 수 있습니다. 신강하다는 것은 일간의 힘이 강하다는 뜻으로, 쉽게 말하면 본인의 그릇이 커서 재물이 들어와도 잘 담아두실 수 있다는 것입니다. 정재를 가진 신강한 사람들은 직장에서 꾸준히 일하면서 월급을 차곡차곡 모으는 것이 가장 잘 맞습니다. 급하게 큰 돈을 노리시기보다는 10년, 20년 장기 계획을 세우고 꾸준히 실천해나가는 것이 본인에게 딱 맞는 재물 전략입니다.",
      details: [
        "정재형이면서 신강한 사람들의 가장 큰 강점은 '꾸준함'입니다. 남들이 지치거나 포기할 때도 묵묵히 자기 길을 가는 인내심이 있습니다. 이것이 재물 축적에서는 정말 큰 장점입니다. 복리의 마법을 누릴 수 있는 사람들입니다.",
        "직장 생활에서도 인정받으시기 쉽습니다. 맡은 일을 책임감 있게 완수하고, 신뢰를 쌓아가시기 때문입니다. 그래서 승진도 잘 되는 편이고, 승진에 따른 연봉 상승이 재물 증가의 주요 통로가 될 것입니다.",
        "다만 조심해야 할 것이 있습니다. 정재형 사람들은 너무 안정만 추구하다가 좋은 투자 기회를 놓치는 경우가 있습니다. 신강하니 어느 정도의 리스크는 감당할 수 있습니다. 원금이 보장되는 안전한 것만 고집하지 말고, 전체 자산의 20-30% 정도는 조금 공격적인 투자에 넣어보는 것도 괜찮습니다.",
        "또 한 가지, 정재형 사람들은 '내 돈'에 대한 집착이 강한 편입니다. 물론 좋은 의미에서의 집착이긴 하지만, 이것이 너무 심해지면 인색해 보일 수 있습니다. 특히 가족이나 가까운 사람들에게는 적절하게 쓰는 것도 필요합니다. 돈은 돌고 도는 것이기 때문입니다.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 우선 비상금으로 월 생활비의 6개월 치는 확보해두고, 나머지는 적립식 펀드나 ETF에 꾸준히 넣어두세요. 부동산에 관심이 있다면 무리하지 않는 선에서 청약이나 소액 투자를 시작해봐도 좋겠습니다. 그리고 혹시 부업이나 투잡에 관심이 있다면, 본업에 지장이 없는 선에서 시도해보는 것도 나쁘지 않습니다. 정재형이라고 해서 무조건 한 곳에서만 수입을 얻어야 하는 것은 아닙니다.",
      closing: "정재형 신강이신 사람들은 재물복이 있는 편입니다. 다만 그 복이 한꺼번에 폭발적으로 오는 것이 아니라 꾸준히, 천천히 쌓이는 스타일입니다. 그러니 조급해하지 말고 본인만의 속도로 차곡차곡 모아가세요. 남들 부러워할 필요 없습니다. 60대가 됐을 때 뒤돌아보면 누구보다 탄탄한 자산을 가지고 있을 것입니다.",
    },
    신약: {
      intro: "사주를 보니 정재(正財)의 기운이 있습니다. 정재는 안정적이고 계획적인 재물을 의미하는데, 다만 신약(身弱)하니 이 재물을 온전히 감당하기가 조금 버거우실 수 있습니다.",
      mainAnalysis: "신약하다는 것은 일간의 힘이 약하다는 뜻으로, 쉽게 말하면 본인의 그릇이 조금 작으신 편이라 큰 재물이 들어오면 오히려 부담이 될 수 있다는 것입니다. 그래서 정재가 있어도 너무 큰 돈을 욕심내시기보다는, 본인이 감당할 수 있는 규모 내에서 안정적으로 운용하는 것이 좋습니다. 무리해서 큰 투자를 하거나 빚을 내서 사업을 하면 오히려 건강을 해치시거나 스트레스로 힘들어지실 수 있습니다.",
      details: [
        "정재형이면서 신약한 사람들은 '몸이 재산'입니다. 건강해야 일도 하고 돈도 버는 것입니다. 그런데 무리해서 돈을 벌려고 하면 건강을 잃고, 건강을 잃으면 번 돈은 다 의료비로 나가시게 됩니다. 이런 악순환에 빠지면 안 되니 항상 건강 관리를 최우선으로 생각하세요.",
        "직장 생활하면서 안정적인 월급을 받는 것이 가장 잘 맞습니다. 사업이나 투자보다는 고정 수입이 있는 환경이 본인에게 맞습니다. 만약 사업을 하고 싶으시다면 혼자 하기보다는 든든한 파트너와 함께 하는 것이 좋습니다.",
        "저축을 할 때도 너무 무리하지 마세요. 월급의 50%를 저축하시겠다고 하면서 생활이 너무 빠듯해지면 스트레스 받고 그것이 건강에 좋지 않습니다. 적당히 30% 정도만 저축하고 나머지로는 맛있는 것도 먹고, 여행도 다니면서 스트레스 관리를 하세요.",
        "대출이나 빚은 최대한 피하는 것이 좋습니다. 신약한 사람들은 빚의 압박감을 심하게 느낍니다. 내 집 마련도 무리해서 영끌하기보다는 전세나 월세로 지내시다가 여유가 생기면 그때 구입하는 것이 낫습니다.",
      ],
      advice: "앞으로의 재물 전략은 '안전 제일'입니다. 원금 보장형 상품 위주로 투자하고, 주식이나 암호화폐 같은 변동성 큰 상품은 정말 여유 자금으로만 소액 투자하세요. 그리고 보험 정리 한 번 해보세요. 필요 이상으로 보험료를 내고 있면 그것도 줄이고, 대신 실비 보험이나 건강 보험은 꼭 챙기세요. 무엇보다 건강 검진 정기적으로 받고, 운동도 꾸준히 하세요. 그것이 최고의 재테크입니다.",
      closing: "신약하다고 해서 재물운이 나쁘신 것이 아닙니다. 그냥 본인에게 맞는 방식으로 재물을 모아야 한다는 것입니다. 무리하지 않으면서 건강하게 오래오래 일하는 것이 가장 좋은 전략입니다. 토끼와 거북이 경주 아시지요? 본인은 거북이 스타일입니다. 천천히 가시지만 결국에는 목표에 도달하는 사람입니다.",
    },
    중화: {
      intro: "사주를 살펴보니 정재(正財)의 기운이 보입니다. 정재는 '바른 재물', '정당한 재물'을 의미하며, 이 기운을 가진 사람들은 안정적이고 계획적인 재물 운용에 재능이 있습니다.",
      mainAnalysis: "특히 중화(中和)의 상태이니 재물을 다루는 데 있어서 균형 잡힌 접근이 가능합니다. 중화란 신강도 신약도 아닌 균형 잡힌 상태를 말합니다. 이런 사람들은 공격과 수비를 상황에 따라 적절히 조절할 수 있는 유연함이 있습니다. 정재형 중화인 사람들은 안정적인 월급을 기반으로 하되, 때로는 적극적인 투자도 하고, 때로는 보수적으로 지키는 것이 가능합니다. 본인의 상황과 시장 상황을 잘 읽으면서 균형 있게 운용하면 됩니다.",
      details: [
        "정재형 중화인 사람들의 가장 큰 강점은 '균형감각'입니다. 너무 욕심내지도 않고, 너무 소극적이지도 않은 적절한 중용의 태도를 가졌습니다. 이것이 재물 관리에서는 큰 장점이 됩니다. 과욕으로 실패하지도 않고, 기회를 다 놓치지도 않습니다.",
        "직장 생활과 투자를 병행하기에 좋은 구조입니다. 고정 수입으로 생활 기반을 안정시키면서, 여유 자금으로는 주식이나 펀드, 부동산 등에 분산 투자하는 전략이 잘 맞습니다. 한쪽에만 치우치지 않는 것이 핵심입니다.",
        "재물 결정을 내릴 때 큰 고민 없이 적절한 판단을 하는 편입니다. 직관과 분석력이 적절히 조화를 이루고 있어서, 좋은 기회를 알아보면서도 위험한 것은 피할 줄 압니다. 다만 가끔 중간에서 애매하게 결정을 미루는 경향이 있으니 이 점은 주의하세요.",
        "인간관계에서도 균형을 잘 잡는 편입니다. 너무 베풀어서 손해보지도 않고, 너무 인색해서 관계가 멀어지지도 않습니다. 이런 성향이 사업이나 투자에서 좋은 파트너를 만나시게 해줄 수 있습니다.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 본인의 균형 잡힌 성향을 활용해서 포트폴리오를 다각화하세요. 안전 자산 50%, 중위험 자산 30%, 고위험 자산 20% 정도의 비율로 분산 투자하는 것이 적합합니다. 시장 상황이 좋을 때는 고위험 비율을 조금 높이고, 불안할 때는 안전 자산 비율을 높이는 유연한 운용이 가능합니다. 본업에서의 성장도 포기하지 말고, 승진이나 이직을 통한 연봉 상승도 병행하세요.",
      closing: "정재형 중화인 사람들은 재물운이 안정적인 편입니다. 대박은 어려울 수 있지만 쪽박도 피할 수 있습니다. 꾸준히 균형 잡힌 전략으로 재물을 늘려가면, 50대에는 경제적 자유에 가까워지실 수 있습니다. 본인의 균형감각을 믿고, 급하지 않게 장기적인 관점으로 재물을 키워가세요.",
    },
  },
  "편재형": {
    신강: {
      intro: "사주를 살펴보니 편재(偏財)의 기운이 강하게 보입니다. 편재는 '치우친 재물', '유동적인 재물'이라는 뜻으로, 쉽게 말하면 투자나 사업, 부업 같은 곳에서 재물을 얻는 타입입니다.",
      mainAnalysis: "게다가 신강(身强)하니 이 편재의 기운을 마음껏 휘두르실 수 있습니다. 신강하면서 편재가 있는 사람들은 사업가 기질이 있고, 돈을 벌 때도 과감하고 공격적인 전략을 쓰실 수 있습니다. 한 마디로 '큰 돈을 만지실 수 있는 그릇'을 가진 것입니다. 다만 편재의 특성상 돈이 들어왔다 나갔다 변동이 심할 수 있습니다. 그래서 돈 관리를 잘 해야 합니다. 벌 때 많이 벌더라도 쓸 때도 많이 쓰면 남는 것이 없기 때문입니다.",
      details: [
        "편재형 신강이신 사람들의 가장 큰 강점은 '배짱'입니다. 남들이 무서워서 못하는 투자도 과감하게 할 수 있고, 기회가 왔을 때 망설이지 않고 잡는 결단력이 있습니다. 이것이 큰 성공으로 이어지는 경우가 많습니다.",
        "여러 가지 수입원을 가지는 것이 좋습니다. 직장만 다니시기보다는 부업이나 투자, 사업 등을 병행하면서 수입을 다각화하세요. 편재형은 한 곳에서만 돈을 벌면 재미없어하는 타입입니다. 다양한 곳에서 돈이 들어와야 활력이 생깁니다.",
        "다만 조심해야 할 것이 있습니다. 편재형 사람들은 도박이나 투기에 빠지시기 쉽습니다. '한 방'에 대한 로망이 있기 때문입니다. 물론 운이 좋을 때는 한 방에 크게 버시기도 하지만, 이것이 습관이 되면 위험합니다. 투자와 투기의 경계를 명확하게 지키세요.",
        "또 한 가지, 인간관계에서 돈 문제가 생기기 쉽습니다. 친구나 지인에게 돈을 빌려줬다가 못 받으시거나, 동업했다가 배신당하는 경우가 있을 수 있습니다. 아무리 친한 사이라도 돈 문제는 확실하게 하고, 보증은 절대 서지 마세요.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 우선 공격적인 투자 비중을 전체 자산의 40% 정도로 제한하세요. 나머지 60%는 안전 자산으로 지키세요. 수익이 나면 일정 비율은 무조건 빼서 안전 자산으로 옮기세요. 사업을 한다면 처음부터 크게 시작하지 말고, 작게 시작해서 키워나가세요. 그리고 혼자 하기보다는 본인의 약점을 보완해줄 수 있는 파트너를 찾으세요.",
      closing: "편재형 신강이신 사람들은 재물에 있어서 롤러코스터를 타는 인생입니다. 올라갈 때는 하늘 높이 올라가고, 내려갈 때는 쭉 내려갑니다. 이것이 스릴 있고 재미있겠지만, 나이가 먹을수록은 이 변동폭을 줄여나가는 것이 좋습니다. 50대 이후에는 안정적인 현금 흐름을 만들어두는 것이 중요합니다.",
    },
    신약: {
      intro: "사주를 보니 편재(偏財)의 기운이 있습니다. 편재는 투자나 사업에서 재물을 얻는 타입인데, 다만 신약(身弱)하니 이 편재를 다루는 것이 좀 버거우실 수 있습니다.",
      mainAnalysis: "신약하면서 편재가 있는 사람들은 마음속으로는 큰 돈을 벌고 싶고 사업도 하고 싶으신데, 실제로 실행에 옮기면 체력적으로나 정신적으로 힘들 수 있습니다. 편재는 에너지를 많이 소모하는 재물이기 때문입니다. 그래서 무리하면 돈은 좀 벌더라도 건강을 잃으시거나 스트레스로 힘들어지실 수 있습니다.",
      details: [
        "편재형 신약이신 사람들은 큰 욕심을 버리는 것이 좋습니다. 물론 편재가 있으니 투자나 사업에 대한 관심이 있겠지만, 규모를 줄여야 합니다. 직접 사업을 하기보다는 잘하는 사람에게 투자하는 방식이 더 나을 수 있습니다.",
        "직장 생활을 기본으로 하면서 부업이나 투자를 '취미' 수준으로 하는 것이 맞습니다. 부업에 올인하거나 전업 투자자가 되면 압박감에 힘들어집니다. 안정적인 월급이 있어야 마음 편하게 투자도 할 수 있습니다.",
        "주식이나 암호화폐 투자를 한다면 절대 빚내서 하지 마세요. 여유 자금으로만 하고, 손실이 나도 생활에 지장이 없는 정도로만 투자하세요. 그리고 단타보다는 장기 투자가 본인에게 맞습니다. 매일 차트 보면서 사고팔면 스트레스로 건강 해칩니다.",
        "동업이나 공동 투자는 신중하게 생각하세요. 본인이 주도하기보다는 믿을 수 있는 사람을 잘 골라서 소액으로 참여하는 것이 좋습니다. 그리고 계약서는 꼭 쓰고, 돈 관련 내용은 문서로 남겨두세요.",
      ],
      advice: "앞으로의 재물 전략은 '작게, 안전하게'입니다. 투자는 전체 자산의 20% 이내로 제한하고, 나머지 80%는 안전 자산으로 지키세요. 그리고 건강 관리에 투자하세요. 헬스장 회원권이나 건강식품 같은 것이 돈 낭비가 아닙니다. 건강해야 오래 일하고 오래 버는 것입니다. 보험 정리도 해보고, 특히 실비 보험이나 암 보험은 꼭 챙기세요.",
      closing: "편재형 신약이신 사람들도 재물운이 없으신 것이 아닙니다. 다만 '큰 욕심을 버리면 작은 행복이 온다'는 마음으로 접근해야 합니다. 억만장자가 못 되더라도, 건강하고 안정적인 생활을 하는 것이 더 행복한 것입니다. 본인에게 맞는 규모로, 무리하지 않으면서 재물을 모아가세요.",
    },
    중화: {
      intro: "사주를 보니 편재(偏財)의 기운이 있습니다. 편재는 '치우친 재물', '유동적인 재물'을 의미하며, 투자나 사업, 부업 등에서 재물을 얻는 타입입니다.",
      mainAnalysis: "중화(中和)의 상태이니 편재의 도전적인 기운을 적절히 활용할 수 있습니다. 중화란 신강도 신약도 아닌 균형 잡힌 상태로, 공격적인 투자와 방어적인 운용을 상황에 맞게 조절할 수 있습니다. 편재형 중화인 사람들은 사업이나 투자에 도전하시되, 무모하게 올인하기보다는 계산된 리스크를 감수하는 것이 맞습니다. 직장을 다니면서 부업이나 투자를 병행하는 것이 가장 이상적인 형태입니다.",
      details: [
        "편재형 중화인 사람들의 강점은 '조절된 과감함'입니다. 기회가 보이면 잡을 줄 아시되, 무모하게 달려들지는 않습니다. 이성과 감각이 적절히 균형을 이루고 있어서, 투자 판단에서 큰 실수를 피할 수 있습니다.",
        "여러 수입원을 가지는 것이 좋습니다. 본업 외에 부업, 투자, 부동산 임대 수입 등 다양한 채널에서 수입이 들어오게 만드세요. 다만 한 가지에 올인하기보다는 분산하는 것이 중화의 기운에 맞습니다.",
        "투자를 할 때 리스크 관리에 신경 쓰면 좋은 결과가 있습니다. 손절 라인을 미리 정해두고, 수익이 나면 일정 부분은 반드시 빼두세요. '욕심을 버리면 돈이 따라온다'는 마음가짐이 본인에게 맞습니다.",
        "동업이나 파트너십도 신중하게 접근하면 성공 가능성이 있습니다. 본인이 전면에 나서기보다는 투자자 역할이나 기획 역할로 참여하는 것이 좋습니다. 실무는 믿을 수 있는 파트너에게 맡기세요.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 안전 자산과 투자 자산의 비율을 6:4 정도로 유지하세요. 시장이 좋을 때는 5:5까지 높여도 되지만, 7:3 이상 공격적으로 가시지는 마세요. 부업이나 사이드 프로젝트에 관심이 있다면 시작해보시되, 본업을 포기하지는 마세요. 3-5년간 부업을 키워서 본업 수입을 넘기면 그때 진지하게 전환을 고려해도 됩니다.",
      closing: "편재형 중화인 사람들은 적절한 도전과 적절한 안정을 모두 누릴 수 있는 사람들입니다. 너무 무서워서 아무것도 안 하면 편재의 기운을 낭비하는 것이고, 너무 무모하게 달려먹으면 탈이 납니다. 중용의 도를 지키면서 꾸준히 자산을 불려가면, 남들보다 더 다채롭고 풍요로운 재물 인생을 살 수 있습니다.",
    },
  },
  "식상생재형": {
    신강: {
      intro: "사주를 보니 식상생재(食傷生財)의 구조가 보입니다. 이것은 정말 좋은 구조입니다. 식상은 재능과 표현력을 의미하고, 이 식상이 재성(財星)을 생해주니 '재능으로 돈을 버신다'는 뜻입니다.",
      mainAnalysis: "게다가 신강(身强)하니 이 구조가 더욱 빛을 발합니다. 식상생재 구조를 가진 신강한 사람들은 본인의 재능이나 기술, 아이디어로 돈을 버는 능력이 뛰어납니다. 창작 활동이나 서비스업, 프리랜서 활동에서 큰 성과를 내실 수 있습니다. 직장을 다니더라도 본인만의 특별한 능력으로 인정받는 사람들입니다.",
      details: [
        "식상생재 신강이신 사람들의 가장 큰 강점은 '아이디어를 돈으로 바꾸는 능력'입니다. 머릿속에 떠오른 생각을 실제로 구현해서 그것으로 수익을 창출할 수 있습니다. 남들이 보지 못하는 기회를 보는 눈도 있습니다.",
        "본인만의 콘텐츠나 브랜드를 만드는 것이 좋습니다. 유튜브, 블로그, SNS 같은 개인 미디어를 활용하거나, 본인만의 제품이나 서비스를 만들어보세요. 처음에는 부업으로 시작하더라도 나중에는 본업이 될 수도 있습니다.",
        "다만 조심해야 할 것이 있습니다. 식상이 강한 사람들은 돈 쓰는 것도 좋아합니다. 특히 취미나 여가 활동, 여행, 맛집 탐방 같은 곳에 돈을 많이 쓰는 편입니다. 버는 것도 잘하지만 쓰는 것도 잘해서 정작 모이는 돈이 없을 수 있습니다.",
        "자기 계발에 투자하는 것은 좋지만, 그것이 정말 수익으로 연결되는지 점검해보세요. 배우는 것은 많은데 실제로 써먹지 못하면 그것은 낭비입니다. 배우신 것을 어떻게 돈으로 연결시킬지 항상 생각하세요.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 우선 본인만의 수익 모델을 하나 만들어보세요. 본업 외에 본인의 재능으로 돈을 벌 수 있는 채널을 하나 구축하는 것입니다. 처음 1-2년은 투자 기간이라고 생각하고, 3년 차부터 본격적인 수익이 나게끔 계획을 세우세요. 그리고 버신 돈의 최소 30%는 자동으로 저축되게 시스템을 만들어두세요. 식상형은 수입이 불규칙할 수 있으니, 좋을 때 많이 모아둬야 합니다.",
      closing: "식상생재 신강이신 사람들은 '크리에이터' 기질이 있습니다. 남들이 못 만드는 것을 만들어내고, 그것으로 가치를 창출하는 사람들입니다. 요즘 같은 시대에 정말 귀한 능력입니다. 이 능력을 잘 활용하면 단순히 월급쟁이로 사는 것보다 훨씬 더 큰 재물을 만들 수 있습니다.",
    },
    신약: {
      intro: "사주를 보니 식상생재(食傷生財)의 구조가 있습니다. 이것은 재능으로 돈을 버신다는 좋은 의미인데, 다만 신약(身弱)하니 이 구조를 활용하는 것이 좀 힘들 수 있습니다.",
      mainAnalysis: "식상은 에너지를 많이 쓰는 기운입니다. 창작 활동이나 표현 활동을 하려면 체력과 정신력이 많이 필요하기 때문입니다. 신약한 사람들은 이 에너지가 부족하니, 무리해서 활동하면 금방 지치고 건강을 해칠 수 있습니다. 그래서 본인의 체력과 컨디션을 잘 관리하면서 적당히 활동하는 것이 중요합니다.",
      details: [
        "식상생재 신약이신 사람들은 '선택과 집중'이 중요합니다. 여러 가지를 동시에 하려고 하지 말고, 가장 자신 있는 한 가지에 집중하세요. 에너지가 제한되어 있으니 분산하면 어느 것도 제대로 못합니다.",
        "혼자서 다 하려고 하지 마세요. 본인은 아이디어를 내고 방향을 잡으시되, 실제 실행은 다른 사람의 도움을 받는 것이 좋습니다. 팀으로 일하거나, 외주를 활용하는 방식을 권합니다.",
        "작은 규모로 시작하세요. 처음부터 큰 프로젝트를 벌이면 중간에 힘이 빠져서 완성을 못 할 수 있습니다. 작은 것부터 시작해서 성공 경험을 쌓고, 점점 규모를 키워나가세요.",
        "수입이 불규칙할 수 있으니 고정 수입원은 꼭 유지하세요. 직장을 다니면서 부업으로 창작 활동을 하는 것이 안전합니다. 전업 크리에이터가 되려면 최소 1년 치 생활비를 모아두고 시작하세요.",
      ],
      advice: "앞으로의 재물 전략은 '무리하지 않기'입니다. 본인의 재능을 돈으로 연결시키시되, 건강을 해치지 않는 범위 내에서 하세요. 돈보다 건강이 먼저입니다. 그리고 쉬는 시간을 꼭 챙기세요. 식상이 강한 사람들은 쉬는 것도 능력입니다. 충분히 쉬어야 좋은 아이디어도 나오고, 다시 활동할 에너지도 충전됩니다.",
      closing: "식상생재 신약이신 사람들도 재능이 있는 것은 맞습니다. 다만 그 재능을 표현하는 방식을 조금 조절해야 합니다. 너무 열정적으로 달려가시다가 번아웃 오면 안 됩니다. 마라톤하듯이 페이스 조절하면서 꾸준히 가면 결국에는 좋은 결과가 있을 것입니다.",
    },
    중화: {
      intro: "사주를 보니 식상생재(食傷生財)의 구조가 있습니다. 이것은 '재능으로 돈을 버신다'는 좋은 의미입니다. 식상은 재능과 표현력을 의미하고, 이것이 재성을 생하니 본인의 능력이 재물로 연결되는 구조입니다.",
      mainAnalysis: "중화(中和)의 상태이니 이 식상생재 구조를 안정적으로 활용할 수 있습니다. 중화란 신강도 신약도 아닌 균형 잡힌 상태로, 창작 활동과 휴식의 밸런스를 적절히 맞추실 수 있습니다. 식상생재 중화인 사람들은 재능을 활용하시되 무리하지 않는 것이 가능합니다. 본업에서 전문성을 키우면서 부업으로 창작 활동이나 콘텐츠 제작을 하는 것이 가장 적합합니다.",
      details: [
        "식상생재 중화인 사람들의 강점은 '지속 가능한 창작력'입니다. 너무 불태우지도 않고, 너무 게으르지도 않은 적절한 페이스로 활동할 수 있습니다. 이것이 장기적으로 보면 더 많은 수익을 가져다 줍니다.",
        "본업과 부업을 병행하기에 좋은 구조입니다. 직장에서 안정적인 수입을 얻으면서, 여가 시간에 유튜브, 블로그, SNS, 부업 등을 통해 추가 수입을 만드세요. 무리하지 않으면서도 꾸준히 하면 몇 년 안에 의미 있는 수익이 될 수 있습니다.",
        "재능을 너무 많은 곳에 분산하지 마세요. 2-3가지 정도에 집중하는 것이 좋습니다. 본인이 가장 잘하는 것, 가장 즐기는 것을 중심으로 선택과 집중을 하세요.",
        "네트워크가 재산입니다. 식상생재 구조는 사람들과의 교류를 통해 기회가 생기는 경우가 많습니다. 온라인, 오프라인 모임에 적절히 참여하면서 인맥을 넓혀가세요. 다만 무리할 필요는 없고, 본인 페이스에 맞게 하세요.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 본인의 재능을 상품화할 수 있는 채널을 하나 만들어보세요. 블로그, 유튜브, 온라인 강의, 전자책 등 본인에게 맞는 형태로 시작하면 됩니다. 처음 1-2년은 수익보다 콘텐츠와 팬층을 쌓는 데 집중하고, 3년 차부터 본격적인 수익화를 도모하세요. 수입의 30%는 저축하고, 자기 계발에도 20% 정도는 투자하세요.",
      closing: "식상생재 중화인 사람들은 재능과 안정을 모두 가질 수 있는 사람들입니다. 창작자의 감성과 직장인의 안정성을 적절히 조화시키면, 경제적으로도 정신적으로도 풍요로운 삶을 만들 수 있습니다. 급하게 성공을 노리시지 말고, 꾸준히 본인만의 콘텐츠와 브랜드를 키워가세요.",
    },
  },
  "관인상생형": {
    신강: {
      intro: "사주를 살펴보니 관인상생(官印相生)의 구조가 보입니다. 이것은 직장이나 조직에서 인정받으면서 그에 따른 보상으로 재물을 얻으신다는 의미입니다.",
      mainAnalysis: "관인상생 구조에 신강(身强)까지 갖췄으니, 조직 생활에서 두각을 나타내실 수 있습니다. 관성(官星)은 직장, 지위, 규율을 의미하고, 인성(印星)은 학력, 자격증, 지식을 의미합니다. 이 두 가지가 서로 도와주니 '공부 열심히 해서 좋은 직장 다니고, 승진해서 연봉 올리는' 전형적인 엘리트 코스에 잘 맞는 것입니다.",
      details: [
        "관인상생 신강이신 사람들의 가장 큰 강점은 '시스템 안에서 성장하는 능력'입니다. 회사나 조직의 문화를 잘 이해하고, 그 안에서 인정받으면서 올라가는 사람들입니다. 정치적 감각도 좋습니다.",
        "학력이나 자격증이 재물과 직결됩니다. 좋은 대학을 나오시거나, 전문 자격증을 따면 그만큼 연봉이 올라가고 더 좋은 기회가 옵니다. 그래서 자기 계발에 투자하는 것이 곧 재테크입니다.",
        "다만 조심해야 할 것이 있습니다. 관인상생형 사람들은 '체면'을 중요하게 생각합니다. 그래서 체면 유지하느라 돈을 쓰는 경우가 있습니다. 차도 좋은 것 타야 하고, 옷도 좋은 것 입어야 합니다. 이런 체면 비용을 조절해야 실제로 모이는 돈이 있습니다.",
        "조직에 너무 의존하면 안 됩니다. 지금은 직장이 잘 나가도 언젠가는 퇴직하게 됩니다. 퇴직 후의 삶도 준비해야 합니다. 40대부터는 제2의 커리어를 생각해보고, 50대에는 본격적으로 준비하세요.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 우선 현재 직장에서 최대한 성과를 내고 승진을 노리세요. 동시에 필요한 자격증이나 학위가 있다면 취득하세요. 연봉 협상 시 근거가 됩니다. 저축은 연봉의 30% 이상 하려고 노력하고, 퇴직연금이나 IRP 같은 노후 준비도 챙기세요. 그리고 네트워크를 잘 관리하세요. 언제 어디서 기회가 올지 모르기 때문입니다.",
      closing: "관인상생 신강이신 사람들은 사회적으로 성공하는 사람들이 많습니다. 안정적인 고수입을 올리면서 사회적 지위도 얻는 것입니다. 다만 그 과정에서 스트레스를 많이 받을 수 있으니 건강 관리와 스트레스 관리도 잘 해야 합니다. 일과 삶의 균형을 찾으면서 성장해나가세요.",
    },
    신약: {
      intro: "사주를 보니 관인상생(官印相生)의 구조가 있습니다. 직장이나 조직에서 인정받으면서 재물을 얻는 구조인데, 다만 신약(身弱)하니 조직 생활의 압박이 좀 힘먹을 수 있습니다.",
      mainAnalysis: "관성(官星)은 직장과 규율을 의미하는데, 이것이 강하면 본인을 억압하는 느낌이 듭니다. 신약한 사람들은 이 억압을 버텨내기가 힘듭니다. 상사의 압박, 회사의 규율, 성과에 대한 부담 등이 스트레스로 다가올 수 있습니다. 그래서 승진을 해도 그것이 마냥 좋지만은 않을 수 있습니다. 책임은 늘어나는데 체력이 안 따라가기 때문입니다.",
      details: [
        "관인상생 신약이신 사람들은 '적당한 위치'를 찾는 것이 중요합니다. 너무 높이 올라가면 부담이 커지고, 너무 낮은 위치에 있면 답답합니다. 본인이 감당할 수 있는 적당한 선을 찾으세요.",
        "대기업이나 공기업 같은 큰 조직보다는 중소기업이나 작은 조직이 맞을 수 있습니다. 경쟁이 너무 치열하거나 문화가 엄격한 곳은 본인에게 맞지 않습니다. 자유로운 분위기에서 본인 페이스대로 일할 수 있는 곳이 좋습니다.",
        "학력이나 자격증은 여전히 중요합니다. 다만 이것 때문에 너무 무리하지는 마세요. 야간 대학원 다니면서 직장도 다니면서 자격증 공부까지 하면 몸이 남아나질 않습니다. 하나씩 차근차근 하세요.",
        "퇴직 후 대비가 더 중요합니다. 신약한 사람들은 60세까지 풀타임으로 일하기 어려울 수 있습니다. 50대 초반부터는 파트타임이나 프리랜서 형태로 전환하는 것을 고려해보고, 그에 맞춰 재정 계획을 세우세요.",
      ],
      advice: "앞으로의 재물 전략은 '롱런'입니다. 단기간에 많이 버시려고 하지 말고, 오래오래 안정적으로 버는 것을 목표로 하세요. 무리해서 승진하기보다는 본인 건강 지켜가면서 적당한 위치에서 오래 다니는 것이 낫습니다. 그리고 저축과 보험은 꼭 챙기세요. 연금저축, 퇴직연금, 실비보험 같은 것은 필수입니다.",
      closing: "관인상생 신약이신 사람들은 조금 다른 접근이 필요합니다. 남들처럼 승승장구하기보다는 본인만의 페이스로 안정적인 삶을 만들어가세요. 건강하고 스트레스 적게 받으면서 오래오래 일하는 것이 결국에는 더 많은 재물을 모으는 길입니다.",
    },
    중화: {
      intro: "사주를 보니 관인상생(官印相生)의 구조가 있습니다. 관인상생은 직장이나 조직에서 인정받으면서 그에 따른 보상으로 재물을 얻는 구조입니다. 관성은 직장과 지위, 인성은 학력과 자격증을 의미합니다.",
      mainAnalysis: "중화(中和)의 상태이니 조직 생활을 안정적으로 해나가실 수 있습니다. 중화란 신강도 신약도 아닌 균형 잡힌 상태로, 조직의 압박을 적절히 버텨내면서도 무리하지 않는 것이 가능합니다. 관인상생 중화인 사람들은 직장에서 꾸준히 성장하면서, 부업이나 투자도 적절히 병행할 수 있습니다. 한쪽에만 치우치지 않는 것이 핵심입니다.",
      details: [
        "관인상생 중화인 사람들의 강점은 '균형 잡힌 조직 생활'입니다. 너무 눈치 보면서 스트레스받지도 않고, 너무 자기주장만 하다가 찍히지도 않습니다. 적절한 선에서 본인의 역할을 해나가면서 인정받을 수 있습니다.",
        "승진을 원하면 충분히 할 수 있지만, 그것이 인생의 전부는 아닙니다. 본인이 원하는 만큼만 올라가면 됩니다. 임원을 목표로 하든, 중간 관리자에서 만족하든, 본인의 선택에 따라 다르게 설계할 수 있습니다.",
        "학력이나 자격증 취득에 있어서도 균형 있게 접근하세요. 필요한 것은 따시되, 스펙을 위한 스펙은 지양하세요. 실무에서 인정받으면서 필요한 자격은 하나씩 취득해나가면 됩니다.",
        "직장 외의 수입원도 만들어보세요. 투자나 부업을 통해 수입을 다각화하면 직장에 대한 의존도가 낮아지고, 심리적으로도 더 여유가 생깁니다. 다만 본업에 지장이 가지 않는 범위 내에서 하세요.",
      ],
      advice: "앞으로 5년간 재물 전략을 말하겠습니다. 직장에서의 성장과 외부 수입원 개발을 균형 있게 진행하세요. 연봉 협상은 적극적으로 하시되, 그것만으로 만족하지 말고 투자나 부업도 병행하세요. 저축은 월 수입의 30-40%를 목표로 하고, 그 중 절반은 안전 자산, 절반은 투자 자산으로 운용하세요. 50대 이후를 대비해서 연금저축과 퇴직연금도 꼭 챙기세요.",
      closing: "관인상생 중화인 사람들은 직장과 개인 생활의 균형을 잘 잡을 수 있는 사람들입니다. 조직 생활에 너무 함몰되지 말고, 본인만의 삶과 자산도 균형 있게 키워가세요. 60대에 퇴직했을 때 직장 밖에서도 안정적인 수입이 있으면, 정말 행복한 노후를 보내실 수 있습니다.",
    },
  },
};

// 오행별 재물 방향/색상
const ELEMENT_WEALTH_REMEDY: Record<FiveElement, {
  direction: string;
  color: string;
  number: string;
  activities: string[];
}> = {
  wood: {
    direction: "동쪽",
    color: "청색, 녹색",
    number: "3, 8",
    activities: ["나무 관련 사업", "교육", "출판", "의류", "농업"],
  },
  fire: {
    direction: "남쪽",
    color: "적색, 자주색",
    number: "2, 7",
    activities: ["IT", "전기", "에너지", "엔터테인먼트", "광고"],
  },
  earth: {
    direction: "중앙, 남서, 북동",
    color: "황색, 갈색",
    number: "5, 10",
    activities: ["부동산", "건설", "농업", "중개업", "보험"],
  },
  metal: {
    direction: "서쪽",
    color: "백색, 금색",
    number: "4, 9",
    activities: ["금융", "법률", "의료기기", "자동차", "귀금속"],
  },
  water: {
    direction: "북쪽",
    color: "흑색, 남색",
    number: "1, 6",
    activities: ["무역", "물류", "음료", "여행", "수산업"],
  },
};

// ==================== 분석 함수 ====================

/**
 * 일간 오행 추출
 */
function getDayMasterElement(sajuResult: SajuApiResult): FiveElement {
  const dayCheongan = sajuResult.dayPillar.cheongan as HeavenlyStemKr;
  return STEM_ELEMENTS[dayCheongan] || "wood";
}

/**
 * 용신 오행 추출
 */
function getYongsinElement(sajuResult: SajuApiResult): FiveElement {
  const yongsinKr = sajuResult.yongsin as FiveElementKey;
  return ELEMENT_KR_TO_EN[yongsinKr] || "wood";
}

/**
 * 재성 오행 계산 (일간이 극하는 오행)
 */
function getWealthElement(dayMasterElement: FiveElement): FiveElement {
  return ELEMENT_RELATIONS[dayMasterElement].controls;
}

/**
 * 사주에서 오행 개수 계산
 */
function countElements(sajuResult: SajuApiResult): Record<FiveElementKey, number> {
  return sajuResult.ohengCount;
}

/**
 * 십신 강도 분석 (간단 버전)
 */
function analyzeSipsinStrength(sajuResult: SajuApiResult): {
  jaeseong: number;
  siksang: number;
  bigyeop: number;
  gwanseong: number;
  inseong: number;
} {
  const dayMaster = getDayMasterElement(sajuResult);
  const ohengCount = countElements(sajuResult);

  // 재성: 일간이 극하는 오행
  const wealthElement = ELEMENT_RELATIONS[dayMaster].controls;
  const wealthKr = ELEMENT_EN_TO_KR[wealthElement];

  // 식상: 일간이 생하는 오행
  const outputElement = ELEMENT_RELATIONS[dayMaster].generates;
  const outputKr = ELEMENT_EN_TO_KR[outputElement];

  // 비겁: 일간과 같은 오행
  const selfKr = ELEMENT_EN_TO_KR[dayMaster];

  // 관성: 일간을 극하는 오행
  const authorityElement = ELEMENT_RELATIONS[dayMaster].controlledBy;
  const authorityKr = ELEMENT_EN_TO_KR[authorityElement];

  // 인성: 일간을 생하는 오행
  const supportElement = ELEMENT_RELATIONS[dayMaster].generatedBy;
  const supportKr = ELEMENT_EN_TO_KR[supportElement];

  return {
    jaeseong: ohengCount[wealthKr] || 0,
    siksang: ohengCount[outputKr] || 0,
    bigyeop: ohengCount[selfKr] || 0,
    gwanseong: ohengCount[authorityKr] || 0,
    inseong: ohengCount[supportKr] || 0,
  };
}

/**
 * 재물 유형 판정
 */
function determineWealthType(
  sipsinStrength: ReturnType<typeof analyzeSipsinStrength>,
  sinGangSinYak: string
): WealthType {
  const { jaeseong, siksang, bigyeop, gwanseong, inseong } = sipsinStrength;

  // 식상생재: 식상이 강하고 재성도 있음
  if (siksang >= 2 && jaeseong >= 1) {
    return "식상생재형";
  }

  // 관인상생: 관성과 인성이 강함
  if (gwanseong >= 1 && inseong >= 1) {
    return "관인상생형";
  }

  // 편재형: 재성이 많거나 비겁이 강함 (도전적)
  if (jaeseong >= 3 || (bigyeop >= 3 && jaeseong >= 1)) {
    return "편재형";
  }

  // 정재형: 기본값, 안정적
  return "정재형";
}

/**
 * 투자 성향 판정
 */
function determineRiskTolerance(
  sipsinStrength: ReturnType<typeof analyzeSipsinStrength>,
  sinGangSinYak: string
): RiskTolerance {
  const { jaeseong, siksang, bigyeop, inseong } = sipsinStrength;
  const isStrong = sinGangSinYak === "신강";

  // 신강 + 재성 강함 = 공격형
  if (isStrong && jaeseong >= 2) {
    return "공격형";
  }

  // 식상 강함 = 공격형 (표현과 도전)
  if (siksang >= 3) {
    return "공격형";
  }

  // 인성 강함 or 신약 = 안정형
  if (inseong >= 3 || sinGangSinYak === "신약") {
    return "안정형";
  }

  // 비겁 강함 = 중립형 (경쟁적이지만 안정 추구)
  if (bigyeop >= 3) {
    return "중립형";
  }

  return "중립형";
}

/**
 * 시기별 재물운 분석
 */
function analyzeWealthByPeriod(
  sajuResult: SajuApiResult,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string
): {
  current: { score: number; analysis: string };
  fiveYear: { trend: "상승" | "하락" | "유지"; details: string };
  lifetime: { peakAge: number; analysis: string };
} {
  const dayMaster = getDayMasterElement(sajuResult);
  const yongsin = getYongsinElement(sajuResult);
  const wealthElement = getWealthElement(dayMaster);
  const isStrong = sinGangSinYak === "신강";

  // 현재 재물운 점수 (60-80 범위)
  let currentScore = 60;
  if (wealthElement === yongsin) {
    currentScore += 15; // 재성이 용신이면 좋음
  }
  if (isStrong) {
    currentScore += 10; // 신강이면 재성 감당 가능
  }
  currentScore = Math.min(100, Math.max(0, currentScore));

  const currentAnalysis = currentScore >= 70
    ? "현재 재물운이 좋은 시기입니다. 적극적인 재테크 활동이 성과를 낼 수 있습니다."
    : currentScore >= 50
      ? "현재 재물운은 평이합니다. 안정적인 운용이 중요합니다."
      : "현재는 재물운이 다소 약합니다. 보수적인 재정 관리를 권합니다.";

  // 5년 전망 (간단 추정)
  let fiveYearTrend: "상승" | "하락" | "유지" = "유지";
  let fiveYearDetails = "";

  // 대운 기반 추정 (간단 버전)
  const ageDecade = Math.floor(currentAge / 10);
  if (ageDecade >= 3 && ageDecade <= 5) {
    fiveYearTrend = "상승";
    fiveYearDetails = "30-50대는 경제 활동의 전성기로, 재물 축적에 유리한 시기입니다.";
  } else if (ageDecade >= 6) {
    fiveYearTrend = "유지";
    fiveYearDetails = "안정적인 자산 관리와 노후 대비에 집중하는 것이 좋습니다.";
  } else {
    fiveYearTrend = "상승";
    fiveYearDetails = "경력 성장과 함께 수입 증가가 예상됩니다.";
  }

  // 인생 재물 정점 (간단 추정)
  let peakAge = 45;
  if (isStrong) {
    peakAge = 40; // 신강은 일찍 정점
  } else {
    peakAge = 50; // 신약은 늦게 정점
  }

  return {
    current: { score: currentScore, analysis: currentAnalysis },
    fiveYear: { trend: fiveYearTrend, details: fiveYearDetails },
    lifetime: {
      peakAge,
      analysis: `${peakAge}세 전후가 재물운의 정점으로 예상됩니다. 이 시기에 모은 자산이 노후의 기반이 됩니다.`,
    },
  };
}

/**
 * 재물 위험 요소 분석
 */
function analyzeWealthRisks(
  sipsinStrength: ReturnType<typeof analyzeSipsinStrength>,
  sinGangSinYak: string
): {
  lossRisk: string[];
  timingRisk: string[];
} {
  const { jaeseong, bigyeop, siksang, gwanseong } = sipsinStrength;
  const lossRisk: string[] = [];
  const timingRisk: string[] = [];

  // 비겁 과다 - 경쟁자로 인한 손실
  if (bigyeop >= 3) {
    lossRisk.push("동업자나 친구로 인한 금전 손실 주의");
    lossRisk.push("보증이나 공동 투자는 피하세요");
  }

  // 식상 과다 - 과소비 경향
  if (siksang >= 3) {
    lossRisk.push("충동적 소비와 과소비 경향");
    lossRisk.push("취미나 여가에 과도한 지출 주의");
  }

  // 관성 과다 - 직장 관련 손실
  if (gwanseong >= 3) {
    lossRisk.push("직장 스트레스로 인한 건강 비용 증가");
    lossRisk.push("세금이나 벌금 관련 지출 주의");
  }

  // 재성 과다 + 신약 - 재물 감당 어려움
  if (jaeseong >= 3 && sinGangSinYak === "신약") {
    lossRisk.push("큰 재물이 오히려 부담이 될 수 있음");
    lossRisk.push("재산 관리에 전문가 도움 필요");
  }

  // 시기적 위험
  timingRisk.push("대운/세운에서 비겁이 강해지는 시기 주의");
  timingRisk.push("관성이 강해지는 시기는 지출이 늘어남");

  if (lossRisk.length === 0) {
    lossRisk.push("특별한 재물 손실 위험 요소가 없습니다");
  }

  return { lossRisk, timingRisk };
}

/**
 * 재물 개운법 생성
 */
function generateWealthRemedy(
  yongsinElement: FiveElement,
  wealthType: WealthType
): {
  yongsinColor: string;
  yongsinDirection: string;
  yongsinNumber: string;
  practicalAdvice: string[];
} {
  const remedy = ELEMENT_WEALTH_REMEDY[yongsinElement];

  const practicalAdvice: string[] = [
    `${remedy.direction} 방향이 재물 방위입니다. 가능하면 이 방향에서 일하세요.`,
    `${remedy.color} 계열의 지갑이나 소품이 재물운에 도움이 됩니다.`,
    `숫자 ${remedy.number}이 행운의 숫자입니다.`,
  ];

  // 재물 유형별 추가 조언
  switch (wealthType) {
    case "정재형":
      practicalAdvice.push("정기적인 저축과 장기 투자를 유지하세요.");
      practicalAdvice.push("안정적인 직장에서의 승진에 집중하세요.");
      break;
    case "편재형":
      practicalAdvice.push("분산 투자로 리스크를 관리하세요.");
      practicalAdvice.push("부업이나 투자 공부에 시간을 투자하세요.");
      break;
    case "식상생재형":
      practicalAdvice.push("재능 개발에 투자하세요.");
      practicalAdvice.push("창작물이나 서비스로 수입을 다각화하세요.");
      break;
    case "관인상생형":
      practicalAdvice.push("자격증이나 학위 취득이 재물 증가로 이어집니다.");
      practicalAdvice.push("조직 내 인정을 통한 승진을 목표로 하세요.");
      break;
  }

  // 용신 오행 활동 추천
  practicalAdvice.push(`${remedy.activities.join(", ")} 관련 활동이 재물운에 유리합니다.`);

  return {
    yongsinColor: remedy.color,
    yongsinDirection: remedy.direction,
    yongsinNumber: remedy.number,
    practicalAdvice,
  };
}

// ==================== 서술형 텍스트 생성 함수 ====================

/**
 * 재물운 서술형 텍스트 생성
 * 일간 × 재물유형 × 신강신약 조합으로 개인화된 텍스트 생성
 */
function generateWealthNarrative(
  dayMaster: HeavenlyStemKr,
  wealthType: WealthType,
  sinGangSinYak: string,
  currentAge: number
): {
  intro: string;
  mainAnalysis: string;
  details: string[];
  advice: string;
  closing: string;
} {
  // 일간별 기본 성향 가져오기
  const dayMasterTraits = DAY_MASTER_WEALTH_TRAITS[dayMaster];

  // 신강/신약/중화 키 결정
  const strengthKey: "신강" | "신약" | "중화" = sinGangSinYak?.includes("신강") ? "신강"
    : sinGangSinYak?.includes("신약") ? "신약"
    : "중화";

  // 재물유형별 서술 가져오기
  const typeNarrative = WEALTH_TYPE_NARRATIVES[wealthType][strengthKey];

  // 연령대별 추가 조언 생성
  let ageSpecificAdvice = "";
  if (currentAge < 30) {
    ageSpecificAdvice = "\n\n아직 젊으신 나이이니 실패해도 다시 일어설 시간이 충분합니다. 지금은 다양한 경험을 쌓으면서 본인에게 맞는 재물 스타일을 찾아가는 시기입니다. 무엇이든 시도해보고, 배움에 투자하세요.";
  } else if (currentAge < 40) {
    ageSpecificAdvice = "\n\n30대는 재물을 본격적으로 불려나가는 시기입니다. 이제는 방향이 어느 정도 정해졌을 것이니, 그 방향으로 집중적으로 투자하면 좋겠습니다. 가정이 있다면 가족의 미래도 함께 설계해보세요.";
  } else if (currentAge < 50) {
    ageSpecificAdvice = "\n\n40대는 재물의 정점을 향해 가는 시기입니다. 지금까지 쌓아오신 것들이 열매를 맺기 시작하는 때입니다. 다만 건강도 챙겨야 합니다. 돈 벌다가 건강 잃으면 안 됩니다.";
  } else {
    ageSpecificAdvice = "\n\n50대 이후는 쌓아오신 것을 지키면서 노후를 준비하는 시기입니다. 너무 공격적인 투자보다는 안정적인 현금 흐름을 만드는 데 집중하세요. 그리고 제2의 인생도 생각해보세요.";
  }

  // 일간 특성을 포함한 도입부 생성
  const customIntro = `${dayMasterTraits.name} 일간이신 분의 사주를 살펴보겠습니다.\n\n${dayMasterTraits.baseTraits}\n\n${dayMasterTraits.wealthApproach}\n\n${typeNarrative.intro}`;

  // 상세 분석에 일간 특성 추가
  const customMainAnalysis = `${typeNarrative.mainAnalysis}\n\n${dayMasterTraits.moneyPersonality}`;

  // 연령대별 조언을 advice에 추가
  const customAdvice = typeNarrative.advice + ageSpecificAdvice;

  return {
    intro: customIntro,
    mainAnalysis: customMainAnalysis,
    details: typeNarrative.details,
    advice: customAdvice,
    closing: typeNarrative.closing,
  };
}

// ==================== 메인 분석 함수 ====================

export function analyzeChapter9(
  sajuResult: SajuApiResult,
  _gender: Gender,
  currentYear: number,
  currentAge: number,
  sinGangSinYak: string
): Chapter9Result {
  // 기본 분석
  const dayMaster = getDayMasterElement(sajuResult);
  const yongsin = getYongsinElement(sajuResult);
  const sipsinStrength = analyzeSipsinStrength(sajuResult);

  // 재물 유형 판정
  const wealthTypeCategory = determineWealthType(sipsinStrength, sinGangSinYak);
  const wealthTypeInfo = WEALTH_TYPE_DESCRIPTIONS[wealthTypeCategory];

  // 투자 성향 판정
  const riskTolerance = determineRiskTolerance(sipsinStrength, sinGangSinYak);
  const investmentInfo = INVESTMENT_RECOMMENDATIONS[riskTolerance];

  // 시기별 재물운
  const wealthByPeriod = analyzeWealthByPeriod(
    sajuResult,
    currentYear,
    currentAge,
    sinGangSinYak
  );

  // 위험 요소
  const risks = analyzeWealthRisks(sipsinStrength, sinGangSinYak);

  // 개운법
  const remedy = generateWealthRemedy(yongsin, wealthTypeCategory);

  // 식상생재 여부 확인
  const hasShikSangSaengJae = sipsinStrength.siksang >= 2 && sipsinStrength.jaeseong >= 1;

  // 비겁 위협 확인
  const hasBiGeopThreat = sipsinStrength.bigyeop >= 3 && sipsinStrength.jaeseong >= 1;

  // 일간 천간 추출
  const dayCheongan = sajuResult.dayPillar.cheongan as HeavenlyStemKr;

  // 서술형 텍스트 생성
  const narrative = generateWealthNarrative(
    dayCheongan,
    wealthTypeCategory,
    sinGangSinYak,
    currentAge
  );

  return {
    wealthType: {
      category: wealthTypeCategory,
      description: wealthTypeInfo.description,
      earningStyle: wealthTypeInfo.earningStyle,
      spendingPattern: wealthTypeInfo.spendingPattern,
    },
    wealthByPeriod,
    investmentTendency: {
      riskTolerance,
      suitableInvestments: investmentInfo.suitable,
      avoidInvestments: investmentInfo.avoid,
    },
    wealthRemedy: remedy,
    narrative,
  };
}
