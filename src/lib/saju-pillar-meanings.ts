/**
 * 60갑자별 기둥 개인 해석 데이터
 * - 년주/월주/일주/시주 각 위치에서의 의미
 */

// ============================================
// 인터페이스 정의
// ============================================

export interface PillarPositionMeaning {
  meaning: string;      // 종합 의미
  detail1: string;      // 세부 해석 1
  detail2: string;      // 세부 해석 2
  detail3: string;      // 세부 해석 3
}

export interface GapjaPillarMeaning {
  name: string;         // 갑자명
  hanja: string;        // 한자
  yearPillar: PillarPositionMeaning;   // 년주 - 조상/가문, 유년기, 사회적 이미지
  monthPillar: PillarPositionMeaning;  // 월주 - 부모/형제, 직업, 청년기
  dayPillar: PillarPositionMeaning;    // 일주 - 핵심 자아, 배우자, 내면
  hourPillar: PillarPositionMeaning;   // 시주 - 자녀, 말년, 내면 욕구
}

// ============================================
// 60갑자별 기둥 의미 데이터
// ============================================

export const GAPJA_PILLAR_MEANINGS: Record<string, GapjaPillarMeaning> = {
  // 1차: 갑자 ~ 계유 (1-10)
  "갑자": {
    name: "갑자",
    hanja: "甲子",
    yearPillar: {
      meaning: "개척자 가문의 후예로, 새로운 시작을 이끄는 기운을 타고났습니다",
      detail1: "조상 중 큰 일을 시작한 선구자가 있으며, 그 개척 정신을 물려받았습니다",
      detail2: "유년기에 독립심이 강했고, 스스로 결정하려는 성향이 일찍 나타났습니다",
      detail3: "사회에서 리더십 있고 진취적인 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 새로운 분야를 개척하며 두각을 나타냅니다",
      detail1: "부모로부터 독립적인 사고방식과 도전 정신을 배웠습니다",
      detail2: "창업, 신사업, 새로운 프로젝트 시작에 적합한 직업운입니다",
      detail3: "20-30대에 중요한 기회가 오며, 과감한 선택이 성공을 이끕니다"
    },
    dayPillar: {
      meaning: "본질적으로 독창적이고 리더십 있는 성격의 소유자입니다",
      detail1: "자신만의 길을 개척하려는 강한 의지가 핵심 정체성입니다",
      detail2: "배우자는 당신의 비전을 이해하고 함께 성장할 수 있는 사람이 좋습니다",
      detail3: "내면에 큰 포부와 야망을 품고 있으며, 이를 실현하려 합니다"
    },
    hourPillar: {
      meaning: "말년에 새로운 도전으로 제2의 인생을 시작합니다",
      detail1: "자녀에게 독립심과 개척 정신을 물려주게 됩니다",
      detail2: "노후에도 새로운 것을 배우고 시작하려는 열정이 있습니다",
      detail3: "인생 후반기에 큰 성취를 이루거나 새로운 시작을 하게 됩니다"
    }
  },
  "을축": {
    name: "을축",
    hanja: "乙丑",
    yearPillar: {
      meaning: "근면하고 실속 있는 가문에서 태어나 안정적인 기반을 물려받았습니다",
      detail1: "조상이 땅과 관련된 일이나 실물 자산으로 기반을 닦았습니다",
      detail2: "유년기에 인내심과 끈기를 자연스럽게 배우며 성장했습니다",
      detail3: "사회에서 신뢰할 수 있고 성실한 사람으로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 꾸준한 노력으로 실력을 쌓아 인정받습니다",
      detail1: "부모에게서 성실함과 실용적인 가치관을 배웠습니다",
      detail2: "안정적이고 전문성을 요하는 직업에서 성공합니다",
      detail3: "20-30대에 기반을 다지는 시기로, 급하지 않게 실력을 쌓으면 됩니다"
    },
    dayPillar: {
      meaning: "본질적으로 끈기 있고 현실적인 성격입니다",
      detail1: "느리지만 확실하게 목표를 달성하는 것이 당신의 방식입니다",
      detail2: "배우자는 안정적이고 함께 가정을 꾸려나갈 수 있는 사람이 좋습니다",
      detail3: "내면에 강한 책임감과 인내력이 자리하고 있습니다"
    },
    hourPillar: {
      meaning: "말년에 안정적이고 풍요로운 삶을 누립니다",
      detail1: "자녀에게 성실함과 꾸준함의 가치를 물려줍니다",
      detail2: "노후에 물질적으로 풍요롭고 안정된 생활을 합니다",
      detail3: "인생 후반기에 그동안 쌓아온 것들의 결실을 거둡니다"
    }
  },
  "병인": {
    name: "병인",
    hanja: "丙寅",
    yearPillar: {
      meaning: "활력 넘치고 리더십 있는 가문의 기운을 타고났습니다",
      detail1: "조상 중 권위 있거나 영향력 있는 인물이 있었습니다",
      detail2: "유년기에 활발하고 자신감 넘치는 아이였습니다",
      detail3: "사회에서 카리스마 있고 당당한 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 열정적으로 도전하며 빠르게 성장합니다",
      detail1: "부모로부터 자신감과 도전 정신을 배웠습니다",
      detail2: "리더 역할이나 사람들 앞에 서는 직업에서 빛납니다",
      detail3: "20-30대에 과감한 도전으로 주목받는 시기입니다"
    },
    dayPillar: {
      meaning: "본질적으로 열정적이고 리더십 있는 성격입니다",
      detail1: "밝은 에너지로 주변을 이끄는 것이 자연스럽습니다",
      detail2: "배우자는 당신을 존경하고 함께 빛날 수 있는 사람이 좋습니다",
      detail3: "내면에 강한 자존심과 성취욕이 있습니다"
    },
    hourPillar: {
      meaning: "말년에도 활력 있게 활동하며 존경받습니다",
      detail1: "자녀에게 자신감과 리더십을 물려줍니다",
      detail2: "노후에도 사회적 활동을 하며 영향력을 유지합니다",
      detail3: "인생 후반기에 명예로운 위치에 오릅니다"
    }
  },
  "정묘": {
    name: "정묘",
    hanja: "丁卯",
    yearPillar: {
      meaning: "예술적 감성과 따뜻함을 가진 가문의 기운을 물려받았습니다",
      detail1: "조상 중 예술가나 문화적 소양이 깊은 분이 계셨습니다",
      detail2: "유년기에 감수성이 풍부하고 섬세한 아이였습니다",
      detail3: "사회에서 따뜻하고 예술적인 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 창의적 재능으로 인정받습니다",
      detail1: "부모에게서 섬세함과 예술적 감각을 배웠습니다",
      detail2: "예술, 디자인, 감성적 소통이 필요한 직업에서 성공합니다",
      detail3: "20-30대에 창의적 영역에서 두각을 나타냅니다"
    },
    dayPillar: {
      meaning: "본질적으로 섬세하고 감성적인 성격입니다",
      detail1: "아름다움과 조화를 추구하는 것이 본성입니다",
      detail2: "배우자는 감정적으로 교감하고 이해해주는 사람이 좋습니다",
      detail3: "내면에 깊은 감성과 예술적 열망이 있습니다"
    },
    hourPillar: {
      meaning: "말년에 예술적 취미나 활동으로 풍요로운 삶을 삽니다",
      detail1: "자녀에게 예술적 감성과 따뜻함을 물려줍니다",
      detail2: "노후에 문화적 활동을 즐기며 여유로운 삶을 삽니다",
      detail3: "인생 후반기에 감성적 만족을 얻습니다"
    }
  },
  "무진": {
    name: "무진",
    hanja: "戊辰",
    yearPillar: {
      meaning: "큰 재물과 권위를 가진 가문의 기운을 타고났습니다",
      detail1: "조상이 부유하거나 사회적 지위가 높았습니다",
      detail2: "유년기에 풍족한 환경에서 자랐거나, 큰 꿈을 품었습니다",
      detail3: "사회에서 능력 있고 신뢰할 수 있는 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 큰 기회를 잡아 성공의 기반을 다집니다",
      detail1: "부모로부터 야망과 실행력을 배웠습니다",
      detail2: "사업, 금융, 부동산 등 재물과 관련된 분야에서 성공합니다",
      detail3: "20-30대에 중요한 기회가 오며, 이를 잘 활용해야 합니다"
    },
    dayPillar: {
      meaning: "본질적으로 포부가 크고 실행력 있는 성격입니다",
      detail1: "큰 일을 도모하고 이루려는 기질이 있습니다",
      detail2: "배우자는 당신의 야망을 지지하고 내조할 수 있는 사람이 좋습니다",
      detail3: "내면에 큰 성공과 부에 대한 열망이 있습니다"
    },
    hourPillar: {
      meaning: "말년에 큰 성취와 풍요를 누립니다",
      detail1: "자녀에게 큰 꿈과 실행력을 물려줍니다",
      detail2: "노후에 재물과 명예를 함께 누리며 삽니다",
      detail3: "인생 후반기에 평생의 노력이 결실을 맺습니다"
    }
  },
  "기사": {
    name: "기사",
    hanja: "己巳",
    yearPillar: {
      meaning: "지혜롭고 영민한 가문의 기운을 타고났습니다",
      detail1: "조상 중 학자나 지식인이 있어 총명함을 물려받았습니다",
      detail2: "유년기에 눈치가 빠르고 영리한 아이였습니다",
      detail3: "사회에서 지적이고 통찰력 있는 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 지식과 전문성으로 인정받습니다",
      detail1: "부모에게서 지적 탐구심과 분석력을 배웠습니다",
      detail2: "연구, 분석, 컨설팅 등 두뇌를 활용하는 직업에서 성공합니다",
      detail3: "20-30대에 전문 분야에서 실력을 인정받는 시기입니다"
    },
    dayPillar: {
      meaning: "본질적으로 영민하고 분석적인 성격입니다",
      detail1: "상황을 빠르게 파악하고 대응하는 능력이 뛰어납니다",
      detail2: "배우자는 지적으로 대화가 통하는 사람이 좋습니다",
      detail3: "내면에 깊은 통찰력과 지혜를 품고 있습니다"
    },
    hourPillar: {
      meaning: "말년에 지혜와 경험으로 존경받습니다",
      detail1: "자녀에게 지적 능력과 통찰력을 물려줍니다",
      detail2: "노후에 지식과 경험을 전수하며 보람을 느낍니다",
      detail3: "인생 후반기에 지혜로운 어른으로 인정받습니다"
    }
  },
  "경오": {
    name: "경오",
    hanja: "庚午",
    yearPillar: {
      meaning: "강인하고 결단력 있는 가문의 기운을 타고났습니다",
      detail1: "조상이 무관이거나 결단력으로 일을 이룬 분이 계셨습니다",
      detail2: "유년기에 활동적이고 경쟁심이 강한 아이였습니다",
      detail3: "사회에서 강인하고 추진력 있는 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 과감한 행동력으로 성과를 냅니다",
      detail1: "부모로부터 결단력과 실행력을 배웠습니다",
      detail2: "경쟁이 치열하거나 빠른 판단이 필요한 분야에서 성공합니다",
      detail3: "20-30대에 과감한 도전으로 빠르게 성장합니다"
    },
    dayPillar: {
      meaning: "본질적으로 결단력 있고 추진력 강한 성격입니다",
      detail1: "목표가 정해지면 빠르게 실행하는 스타일입니다",
      detail2: "배우자는 당신의 에너지를 이해하고 함께할 수 있는 사람이 좋습니다",
      detail3: "내면에 강한 승부욕과 성취욕이 있습니다"
    },
    hourPillar: {
      meaning: "말년에도 활발하게 활동하며 성취를 이룹니다",
      detail1: "자녀에게 추진력과 결단력을 물려줍니다",
      detail2: "노후에도 멈추지 않고 새로운 도전을 합니다",
      detail3: "인생 후반기에 활동적인 삶을 유지합니다"
    }
  },
  "신미": {
    name: "신미",
    hanja: "辛未",
    yearPillar: {
      meaning: "섬세하고 품위 있는 가문의 기운을 타고났습니다",
      detail1: "조상이 예술이나 장인 정신으로 일가를 이룬 분이 계셨습니다",
      detail2: "유년기에 예민하고 완벽주의적인 성향이 있었습니다",
      detail3: "사회에서 세련되고 품격 있는 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 전문성과 섬세함으로 인정받습니다",
      detail1: "부모에게서 꼼꼼함과 완벽을 추구하는 자세를 배웠습니다",
      detail2: "정밀함이 필요한 분야, 예술, 기술직에서 성공합니다",
      detail3: "20-30대에 전문가로서 실력을 쌓아가는 시기입니다"
    },
    dayPillar: {
      meaning: "본질적으로 섬세하고 완벽을 추구하는 성격입니다",
      detail1: "디테일을 중시하고 높은 기준을 가지고 있습니다",
      detail2: "배우자는 당신의 섬세함을 이해하고 배려하는 사람이 좋습니다",
      detail3: "내면에 아름다움과 완벽함에 대한 갈망이 있습니다"
    },
    hourPillar: {
      meaning: "말년에 삶의 질을 높이며 품위 있게 삽니다",
      detail1: "자녀에게 섬세함과 품격을 물려줍니다",
      detail2: "노후에 취미나 예술 활동으로 만족스러운 삶을 삽니다",
      detail3: "인생 후반기에 정서적 풍요를 누립니다"
    }
  },
  "임신": {
    name: "임신",
    hanja: "壬申",
    yearPillar: {
      meaning: "지혜롭고 변화에 능한 가문의 기운을 타고났습니다",
      detail1: "조상이 다재다능하고 적응력이 뛰어난 분이 계셨습니다",
      detail2: "유년기에 호기심이 많고 다양한 것에 관심을 보였습니다",
      detail3: "사회에서 영리하고 융통성 있는 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 다양한 분야에서 능력을 발휘합니다",
      detail1: "부모로부터 적응력과 다재다능함을 배웠습니다",
      detail2: "변화가 많거나 다양한 역할이 필요한 직업에서 성공합니다",
      detail3: "20-30대에 여러 기회를 경험하며 자신에게 맞는 길을 찾습니다"
    },
    dayPillar: {
      meaning: "본질적으로 영리하고 적응력 뛰어난 성격입니다",
      detail1: "상황에 따라 유연하게 대처하는 능력이 있습니다",
      detail2: "배우자는 다양성을 인정하고 함께 변화할 수 있는 사람이 좋습니다",
      detail3: "내면에 끊임없는 호기심과 탐구심이 있습니다"
    },
    hourPillar: {
      meaning: "말년에 다양한 경험을 바탕으로 지혜로운 삶을 삽니다",
      detail1: "자녀에게 적응력과 유연함을 물려줍니다",
      detail2: "노후에 다양한 취미와 관심사로 풍요로운 삶을 삽니다",
      detail3: "인생 후반기에 넓은 식견과 경험으로 존경받습니다"
    }
  },
  "계유": {
    name: "계유",
    hanja: "癸酉",
    yearPillar: {
      meaning: "지적이고 분석적인 가문의 기운을 타고났습니다",
      detail1: "조상 중 학문이나 기술에 뛰어난 분이 계셨습니다",
      detail2: "유년기에 관찰력이 뛰어나고 조용한 성향이었습니다",
      detail3: "사회에서 차분하고 지적인 이미지로 인식됩니다"
    },
    monthPillar: {
      meaning: "청년기에 전문 지식으로 인정받습니다",
      detail1: "부모에게서 분석력과 논리적 사고를 배웠습니다",
      detail2: "연구, IT, 분석 등 전문 분야에서 성공합니다",
      detail3: "20-30대에 지식과 기술을 축적하는 중요한 시기입니다"
    },
    dayPillar: {
      meaning: "본질적으로 분석적이고 논리적인 성격입니다",
      detail1: "깊이 있는 사고와 분석을 즐깁니다",
      detail2: "배우자는 지적 대화가 가능하고 차분한 사람이 좋습니다",
      detail3: "내면에 진리와 지식에 대한 열망이 있습니다"
    },
    hourPillar: {
      meaning: "말년에 지혜와 통찰로 주변에 조언을 줍니다",
      detail1: "자녀에게 논리적 사고력을 물려줍니다",
      detail2: "노후에 지적 활동을 즐기며 성찰하는 삶을 삽니다",
      detail3: "인생 후반기에 깊은 지혜로 존경받습니다"
    }
  }
};

// ============================================
// 기둥 위치별 해석 함수
// ============================================

export type PillarPosition = 'year' | 'month' | 'day' | 'hour';

/**
 * 특정 갑자가 특정 기둥에 있을 때의 개인 해석을 반환
 */
export function getPersonalPillarMeaning(
  gapja: string,
  position: PillarPosition
): PillarPositionMeaning | null {
  const data = GAPJA_PILLAR_MEANINGS[gapja];
  if (!data) return null;

  switch (position) {
    case 'year':
      return data.yearPillar;
    case 'month':
      return data.monthPillar;
    case 'day':
      return data.dayPillar;
    case 'hour':
      return data.hourPillar;
    default:
      return null;
  }
}

/**
 * 사주 전체의 기둥별 개인 해석을 반환
 */
export function getAllPillarMeanings(
  yearGapja: string,
  monthGapja: string,
  dayGapja: string,
  hourGapja?: string
): {
  year: PillarPositionMeaning | null;
  month: PillarPositionMeaning | null;
  day: PillarPositionMeaning | null;
  hour: PillarPositionMeaning | null;
} {
  return {
    year: getPersonalPillarMeaning(yearGapja, 'year'),
    month: getPersonalPillarMeaning(monthGapja, 'month'),
    day: getPersonalPillarMeaning(dayGapja, 'day'),
    hour: hourGapja ? getPersonalPillarMeaning(hourGapja, 'hour') : null
  };
}
