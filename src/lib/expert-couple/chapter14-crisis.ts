/**
 * 제14장: 위기 시기와 주의점
 * 관계 위기 시기 예측 및 예방 조언
 */

import type { SajuApiResult } from "@/types/saju";
import type { CoupleChapter14Result } from "@/types/expert-couple";

// 천간 오행
const CHEONGAN_OHENG: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토",
  기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};

// 지지 오행
const JIJI_OHENG: Record<string, string> = {
  자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화",
  오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수",
};

// 상극 관계
const SANGGEUK: Record<string, string> = {
  목: "금", 화: "수", 토: "목", 금: "화", 수: "토",
};

// 년도별 천간 지지 계산
function getYearGanJi(year: number): { gan: string; ji: string } {
  const gans = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"];
  const jis = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"];

  const ganIndex = (year - 4) % 10;
  const jiIndex = (year - 4) % 12;

  return { gan: gans[ganIndex], ji: jis[jiIndex] };
}

// 위기 시기 계산
function calculateCrisisPeriods(
  person1: SajuApiResult,
  person2: SajuApiResult
): CoupleChapter14Result["crisisPeriods"] {
  const currentYear = new Date().getFullYear();
  const crisisPeriods: CoupleChapter14Result["crisisPeriods"] = [];

  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;
  const ilgan1Oheng = CHEONGAN_OHENG[ilgan1];
  const ilgan2Oheng = CHEONGAN_OHENG[ilgan2];

  for (let year = currentYear; year <= currentYear + 10; year++) {
    const { gan, ji } = getYearGanJi(year);
    const yearGanOheng = CHEONGAN_OHENG[gan];
    const yearJiOheng = JIJI_OHENG[ji];

    const riskAreas: string[] = [];
    let riskLevel: "높음" | "보통" | "낮음" = "낮음";

    // 두 사람 모두에게 상극인 해
    const isConflict1 = SANGGEUK[ilgan1Oheng] === yearGanOheng || SANGGEUK[ilgan1Oheng] === yearJiOheng;
    const isConflict2 = SANGGEUK[ilgan2Oheng] === yearGanOheng || SANGGEUK[ilgan2Oheng] === yearJiOheng;

    if (isConflict1 && isConflict2) {
      riskLevel = "높음";
      riskAreas.push("두 분 모두 에너지가 낮아지는 시기입니다.");
      riskAreas.push("스트레스로 인한 다툼이 많아질 수 있어요.");
    } else if (isConflict1 || isConflict2) {
      riskLevel = "보통";
      if (isConflict1) {
        riskAreas.push(`${year}년은 한 분에게 도전적인 시기입니다.`);
      } else {
        riskAreas.push(`${year}년은 한 분에게 힘든 시기일 수 있어요.`);
      }
      riskAreas.push("상대방의 지지가 특히 필요한 시기예요.");
    }

    // 특정 조합의 추가 위험
    if ((ilgan1 === "경" || ilgan2 === "경") && (gan === "갑" || gan === "을")) {
      riskAreas.push("원칙과 성장 사이의 갈등이 있을 수 있어요.");
      if (riskLevel === "낮음") riskLevel = "보통";
    }

    if (riskLevel !== "낮음") {
      crisisPeriods.push({
        year,
        riskLevel,
        riskAreas,
        preventionAdvice: riskLevel === "높음"
          ? "이 시기에는 큰 결정을 미루고, 서로에게 더 많이 의지하세요."
          : "스트레스 관리에 신경 쓰고, 정기적인 대화 시간을 가지세요.",
      });
    }
  }

  return crisisPeriods.slice(0, 5);
}

// 공통 취약점 분석
function analyzeCommonVulnerabilities(ilgan1: string, ilgan2: string): string[] {
  const vulnerabilities: string[] = [];

  // 둘 다 강한 성격
  if (["갑", "병", "경"].includes(ilgan1) && ["갑", "병", "경"].includes(ilgan2)) {
    vulnerabilities.push("두 분 다 주도적이라 주도권 다툼이 있을 수 있어요.");
    vulnerabilities.push("서로 양보하지 않으면 갈등이 깊어질 수 있어요.");
  }

  // 둘 다 감정적
  if (["정", "계"].includes(ilgan1) && ["정", "계"].includes(ilgan2)) {
    vulnerabilities.push("감정에 휩쓸려 오해가 커질 수 있어요.");
    vulnerabilities.push("말하지 않고 기대하면 실망이 생겨요.");
  }

  // 소통 스타일 차이
  if ((["갑", "경"].includes(ilgan1) && ["을", "계"].includes(ilgan2)) ||
    (["을", "계"].includes(ilgan1) && ["갑", "경"].includes(ilgan2))) {
    vulnerabilities.push("직접적 표현과 우회적 표현의 차이로 오해가 생길 수 있어요.");
  }

  // 에너지 차이
  if ((["병", "갑"].includes(ilgan1) && ["무", "기"].includes(ilgan2)) ||
    (["무", "기"].includes(ilgan1) && ["병", "갑"].includes(ilgan2))) {
    vulnerabilities.push("활동적 vs 안정적 리듬 차이로 피로감이 생길 수 있어요.");
  }

  if (vulnerabilities.length === 0) {
    vulnerabilities.push("스트레스 상황에서 서로의 대처 방식이 달라 당황할 수 있어요.");
    vulnerabilities.push("바쁜 시기에 소통이 줄어들면 멀어질 수 있어요.");
  }

  return vulnerabilities.slice(0, 4);
}

// 경고 신호 생성
function generateWarningSignals(ilgan1: string, ilgan2: string): string[] {
  const signals: string[] = [];

  signals.push("대화가 줄고 각자의 시간만 늘어날 때");
  signals.push("작은 일에도 짜증이 나거나 화가 날 때");
  signals.push("상대방의 장점보다 단점이 먼저 보일 때");
  signals.push("함께하는 것보다 혼자가 편하다고 느낄 때");

  // 특정 유형에 대한 경고
  if (["병", "갑"].includes(ilgan1) || ["병", "갑"].includes(ilgan2)) {
    signals.push("열정이 식고 무기력해질 때 - 관계에도 영향을 줄 수 있어요.");
  }

  if (["정", "계"].includes(ilgan1) || ["정", "계"].includes(ilgan2)) {
    signals.push("속마음을 말하지 않고 삭이는 시간이 길어질 때");
  }

  return signals.slice(0, 5);
}

// 비상 조언 생성
function generateEmergencyAdvice(ilgan1: string, ilgan2: string): string {
  const baseAdvice = "위기 상황에서는 즉시 대화 시간을 마련하세요. 필요하다면 전문 상담사의 도움을 받는 것도 좋은 방법입니다.";

  let additionalAdvice = "";

  if (["갑", "경"].includes(ilgan1) || ["갑", "경"].includes(ilgan2)) {
    additionalAdvice = " 승패를 가리려 하지 말고, 관계 유지가 목표임을 기억하세요.";
  } else if (["정", "계"].includes(ilgan1) && ["정", "계"].includes(ilgan2)) {
    additionalAdvice = " 감정이 격해지면 잠시 쉬고, 글로 마음을 정리해서 전달하는 것도 도움이 됩니다.";
  } else if (["임"].includes(ilgan1) || ["임"].includes(ilgan2)) {
    additionalAdvice = " 도망가고 싶은 마음이 들어도, 문제를 직면하는 것이 결국 해결책입니다.";
  }

  return baseAdvice + additionalAdvice;
}

/**
 * 제14장: 위기 시기와 주의점 분석
 */
export function analyzeCouple14(
  person1: SajuApiResult,
  person2: SajuApiResult,
  person1Name: string,
  person2Name: string
): CoupleChapter14Result {
  const ilgan1 = person1.dayPillar.cheongan;
  const ilgan2 = person2.dayPillar.cheongan;

  const crisisPeriods = calculateCrisisPeriods(person1, person2);
  const commonVulnerabilities = analyzeCommonVulnerabilities(ilgan1, ilgan2);
  const warningSignals = generateWarningSignals(ilgan1, ilgan2);
  const emergencyAdvice = generateEmergencyAdvice(ilgan1, ilgan2);

  const highRiskPeriods = crisisPeriods.filter(p => p.riskLevel === "높음");

  return {
    crisisPeriods,
    commonVulnerabilities,
    warningSignals,
    emergencyAdvice,
    narrative: {
      intro: "이번 장에서는 관계에서 주의가 필요한 시기와 예방법을 살펴봅니다.",
      mainAnalysis: highRiskPeriods.length > 0
        ? `향후 10년 내 ${highRiskPeriods.length}개의 주의 시기가 있습니다. 미리 알고 대비하면 충분히 극복할 수 있어요.`
        : "큰 위기 시기는 없지만, 일상적인 관계 관리는 항상 필요해요.",
      details: crisisPeriods.slice(0, 3).map(p =>
        `${p.year}년: ${p.riskLevel} 위험 - ${p.riskAreas[0]}`
      ),
      advice: emergencyAdvice,
      closing: "다음 장에서는 장기 전망을 살펴보겠습니다.",
    },
  };
}
