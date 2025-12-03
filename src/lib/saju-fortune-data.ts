/**
 * 대운/연운 해석 데이터
 */

// 오행별 대운 해석
export const DAEUN_OHENG_INTERPRETATION: Record<string, {
  theme: string;
  fortune: string;
  advice: string;
  keywords: string[];
}> = {
  목: {
    theme: "성장과 시작의 시기",
    fortune: "새로운 시작, 확장, 발전의 기운이 강한 시기입니다. 새로운 도전이나 학업, 자기계발에 좋은 시기입니다.",
    advice: "이 시기에는 새로운 것을 시작하고 배우는 데 집중하세요. 계획을 세우고 장기적인 비전을 그려보세요.",
    keywords: ["성장", "시작", "학습", "발전", "확장"],
  },
  화: {
    theme: "열정과 표현의 시기",
    fortune: "열정, 표현력, 인기가 높아지는 시기입니다. 대인관계가 활발해지고 자신을 표현하는 일에 강점이 생깁니다.",
    advice: "적극적으로 자신을 드러내고 활동하세요. 단, 성급한 판단이나 충동적인 행동은 자제해야 합니다.",
    keywords: ["열정", "인기", "표현", "활력", "창의"],
  },
  토: {
    theme: "안정과 기반의 시기",
    fortune: "안정, 중재, 기반 구축의 시기입니다. 부동산이나 재산 관련 일, 인간관계의 중심이 되는 시기입니다.",
    advice: "급진적인 변화보다 안정적인 기반을 다지는 데 집중하세요. 신뢰를 쌓고 중심을 잡는 것이 중요합니다.",
    keywords: ["안정", "기반", "신뢰", "중심", "부동산"],
  },
  금: {
    theme: "결실과 정리의 시기",
    fortune: "수확, 결단, 정리의 기운이 강한 시기입니다. 그동안 쌓아온 것을 거두고 정리하는 시기입니다.",
    advice: "결단력을 발휘하고 불필요한 것은 과감히 정리하세요. 재물운이 좋아질 수 있습니다.",
    keywords: ["결실", "결단", "정리", "재물", "수확"],
  },
  수: {
    theme: "지혜와 성찰의 시기",
    fortune: "지혜, 성찰, 내면 탐구의 시기입니다. 학문이나 연구에 좋은 시기이며 직관력이 높아집니다.",
    advice: "조용히 내면을 돌아보고 지혜를 쌓는 시기입니다. 무리한 활동보다 깊이 있는 사고가 필요합니다.",
    keywords: ["지혜", "성찰", "학문", "직관", "내면"],
  },
};

// 연운 상태별 해석
export const YEONUN_STATUS_INTERPRETATION: Record<string, {
  emoji: string;
  status: string;
  description: string;
  advice: string;
}> = {
  hapYear: {
    emoji: "💑",
    status: "인연의 해",
    description: "일간과 합(合)하는 해로, 좋은 인연이나 협력 관계가 형성되기 좋은 시기입니다.",
    advice: "새로운 관계를 맺거나 협력 프로젝트를 진행하기 좋습니다. 결혼이나 계약에도 좋은 시기입니다.",
  },
  chungYear: {
    emoji: "⚡",
    status: "변화의 해",
    description: "일간과 충(沖)하는 해로, 변화와 움직임이 많은 시기입니다.",
    advice: "변화를 두려워하지 말고 유연하게 대처하세요. 이사, 이직, 여행 등 이동수가 있을 수 있습니다.",
  },
  yongsinYear: {
    emoji: "🌟",
    status: "행운의 해",
    description: "용신 오행이 들어오는 해로, 전반적으로 운세가 상승하는 시기입니다.",
    advice: "적극적으로 기회를 잡으세요. 평소 하고 싶었던 일을 시작하기 좋은 시기입니다.",
  },
  neutral: {
    emoji: "☁️",
    status: "평온의 해",
    description: "특별한 길흉 없이 평온하게 흘러가는 해입니다.",
    advice: "큰 변화보다 꾸준한 일상을 유지하며 내실을 다지는 것이 좋습니다.",
  },
};

// 대운 시기별 의미
export const DAEUN_AGE_MEANING: Record<string, {
  period: string;
  theme: string;
  description: string;
}> = {
  "1-9": {
    period: "유년기",
    theme: "씨앗의 시기",
    description: "인생의 기반이 형성되는 시기로, 가정환경과 교육의 영향을 크게 받습니다.",
  },
  "10-19": {
    period: "청소년기",
    theme: "새싹의 시기",
    description: "자아가 형성되고 학업과 진로를 탐색하는 중요한 시기입니다.",
  },
  "20-29": {
    period: "청년기",
    theme: "성장의 시기",
    description: "사회 진출과 자립, 연애와 결혼 등 인생의 기틀을 잡는 시기입니다.",
  },
  "30-39": {
    period: "장년초기",
    theme: "발전의 시기",
    description: "커리어를 발전시키고 가정을 이루며 사회적 위치를 확립하는 시기입니다.",
  },
  "40-49": {
    period: "장년기",
    theme: "성숙의 시기",
    description: "인생의 중반, 그동안 쌓아온 것을 바탕으로 안정을 추구하는 시기입니다.",
  },
  "50-59": {
    period: "중년기",
    theme: "수확의 시기",
    description: "인생의 결실을 거두고 후반기를 준비하는 시기입니다.",
  },
  "60-69": {
    period: "노년초기",
    theme: "지혜의 시기",
    description: "삶의 지혜를 나누고 새로운 의미를 찾는 시기입니다.",
  },
  "70+": {
    period: "노년기",
    theme: "완성의 시기",
    description: "인생을 정리하고 평화로운 삶을 추구하는 시기입니다.",
  },
};

// 현재 대운 판단
export function getCurrentDaeun(
  majorFortunes: { startAge: number; endAge: number; ganji: string; element: string }[],
  currentAge: number
): { current: typeof majorFortunes[0] | null; next: typeof majorFortunes[0] | null; yearsRemaining: number } {
  let current = null;
  let next = null;
  let yearsRemaining = 0;

  for (let i = 0; i < majorFortunes.length; i++) {
    const fortune = majorFortunes[i];
    if (currentAge >= fortune.startAge && currentAge <= fortune.endAge) {
      current = fortune;
      yearsRemaining = fortune.endAge - currentAge + 1;
      if (i + 1 < majorFortunes.length) {
        next = majorFortunes[i + 1];
      }
      break;
    }
  }

  return { current, next, yearsRemaining };
}

// 연운 상태 판단
export function getYeonunStatus(yeonun: {
  isHap: boolean;
  isChung: boolean;
  isYongsinYear: boolean;
}): keyof typeof YEONUN_STATUS_INTERPRETATION {
  if (yeonun.isYongsinYear) return "yongsinYear";
  if (yeonun.isHap) return "hapYear";
  if (yeonun.isChung) return "chungYear";
  return "neutral";
}

// 대운 시기 의미 가져오기
export function getDaeunAgeMeaning(startAge: number): typeof DAEUN_AGE_MEANING[string] {
  if (startAge < 10) return DAEUN_AGE_MEANING["1-9"];
  if (startAge < 20) return DAEUN_AGE_MEANING["10-19"];
  if (startAge < 30) return DAEUN_AGE_MEANING["20-29"];
  if (startAge < 40) return DAEUN_AGE_MEANING["30-39"];
  if (startAge < 50) return DAEUN_AGE_MEANING["40-49"];
  if (startAge < 60) return DAEUN_AGE_MEANING["50-59"];
  if (startAge < 70) return DAEUN_AGE_MEANING["60-69"];
  return DAEUN_AGE_MEANING["70+"];
}
