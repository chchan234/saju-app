/**
 * 전문가 모드 PDF 생성기
 * 18개 챕터 분석 결과를 PDF로 변환
 */

import type { SajuApiResult, Gender, RelationshipStatus, OccupationStatus } from "@/types/saju";
import type { ExpertModeResult } from "@/types/expert";

// 챕터별 분석 함수 import
import { analyzeChapter1 } from "./chapter1-myeongshik";
import { analyzeChapter2 } from "./chapter2-eumyang-oheng";
import { analyzeChapter3 } from "./chapter3-sipseong";
import { analyzeChapter4 } from "./chapter4-geokguk";
import { analyzeChapter5 } from "./chapter5-sinsal";
import { analyzeChapter6 } from "./chapter6-sipi-unseong";
import { analyzeChapter7 } from "./chapter7-daeun";
import { analyzeChapter8 } from "./chapter8-yearly";
import { analyzeChapter9 } from "./chapter9-wealth";
import { analyzeChapter10 } from "./chapter10-career";
import { analyzeChapter11 } from "./chapter11-health";
import { analyzeChapter12 } from "./chapter12-love-style";
import { analyzeChapter13 } from "./chapter13-relationship";
import { analyzeChapter14 } from "./chapter14-marriage";
import { analyzeChapter15 } from "./chapter15-family";
import { analyzeChapter16 } from "./chapter16-compatibility";
import { analyzeChapter17 } from "./chapter17-warning";
import { analyzeChapter18 } from "./chapter18-study";

export interface GeneratePdfInput {
  sajuResult: SajuApiResult;
  partnerSajuResult?: SajuApiResult;
  gender: Gender;
  relationshipStatus: RelationshipStatus;
  occupationStatus: OccupationStatus;
  hasChildren: boolean;
  birthYear: number;
  name: string;
  partnerName?: string;
}

export interface GeneratePdfOutput {
  success: boolean;
  analysisResult?: ExpertModeResult;
  error?: string;
}

/**
 * 연령대 계산
 */
function calculateAgeGroup(birthYear: number): "20s" | "30s" | "40s" | "50plus" {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  if (age < 30) return "20s";
  if (age < 40) return "30s";
  if (age < 50) return "40s";
  return "50plus";
}

/**
 * 전체 분석 실행
 */
export async function generateExpertAnalysis(
  input: GeneratePdfInput
): Promise<GeneratePdfOutput> {
  try {
    const {
      sajuResult,
      partnerSajuResult,
      gender,
      relationshipStatus,
      occupationStatus,
      hasChildren,
      birthYear,
    } = input;

    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - birthYear;
    const ageGroup = calculateAgeGroup(birthYear);

    // 제2장에서 신강신약 결과 먼저 계산
    const chapter2 = analyzeChapter2(sajuResult);
    const sinGangSinYak = chapter2.sinGangSinYak.result;

    // 각 챕터 분석 실행
    const analysisResult: ExpertModeResult = {
      // 메타 정보
      meta: {
        generatedAt: new Date(),
        version: "1.0.0",
        conditions: {
          gender,
          relationshipStatus,
          hasChildren,
          occupationStatus,
          ageGroup,
        },
        totalPages: 200,
      },

      // 공통 분석
      common: {
        chapter1_myeongshik: analyzeChapter1(sajuResult, sinGangSinYak),
        chapter2_eumyangOheng: chapter2,
        chapter4_geokguk: analyzeChapter4(sajuResult, undefined, sinGangSinYak),
        chapter5_sinsal: analyzeChapter5(sajuResult, sinGangSinYak),
        chapter6_sipiUnseong: analyzeChapter6(sajuResult, sinGangSinYak),
        chapter7_daeun: analyzeChapter7(sajuResult, gender, birthYear, new Date().getMonth() + 1, currentAge, sinGangSinYak),
        chapter8_yearly: analyzeChapter8(sajuResult, gender, currentYear, currentAge, sinGangSinYak),
        chapter9_wealth: analyzeChapter9(sajuResult, gender, currentYear, currentAge, sinGangSinYak),
        chapter12_loveStyle: analyzeChapter12(sajuResult, gender, sinGangSinYak),
        chapter17_warning: analyzeChapter17(sajuResult, gender, currentYear, currentAge, sinGangSinYak),
      },

      // 성별 분기
      genderBranch: {
        chapter3_sipseong: analyzeChapter3(sajuResult, gender, sinGangSinYak),
      },

      // 직업상태 분기
      occupationBranch: {
        chapter10_career: analyzeChapter10(sajuResult, gender, currentYear, currentAge, sinGangSinYak as string, occupationStatus),
        chapter18_study: (occupationStatus === "student" || occupationStatus === "jobseeker")
          ? analyzeChapter18(sajuResult, gender, occupationStatus, currentYear, sinGangSinYak)
          : null,
      },

      // 연령대 분기
      ageBranch: {
        chapter11_health: analyzeChapter11(sajuResult, gender, ageGroup, sinGangSinYak),
      },

      // 관계상태 분기
      relationshipBranch: {
        chapter13_relationship: analyzeChapter13(sajuResult, gender, relationshipStatus, currentYear, sinGangSinYak),
        chapter14_marriage: analyzeChapter14(sajuResult, gender, relationshipStatus, currentYear, currentAge, sinGangSinYak),
      },

      // 자녀유무 분기
      childrenBranch: {
        chapter15_family: analyzeChapter15(sajuResult, gender, hasChildren, sinGangSinYak),
      },

      // 궁합 분석 (상대방 사주가 있을 경우만)
      compatibility: partnerSajuResult
        ? analyzeChapter16(sajuResult, partnerSajuResult)
        : null,

      // 부록
      appendix: {
        glossary: generateGlossary(),
        personalNotes: {
          enabled: true,
          placeholder: "여기에 개인 메모를 작성하세요...",
        },
        faq: generateFaq(),
      },
    };

    return {
      success: true,
      analysisResult,
    };
  } catch (error) {
    console.error("Error generating expert analysis:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "분석 생성 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 용어 사전 생성
 */
function generateGlossary(): Array<{ term: string; hanja: string; definition: string; example?: string }> {
  return [
    { term: "사주팔자", hanja: "四柱八字", definition: "년주, 월주, 일주, 시주의 네 기둥과 각 기둥을 이루는 천간과 지지 여덟 글자" },
    { term: "천간", hanja: "天干", definition: "갑(甲), 을(乙), 병(丙), 정(丁), 무(戊), 기(己), 경(庚), 신(辛), 임(壬), 계(癸) 10가지" },
    { term: "지지", hanja: "地支", definition: "자(子), 축(丑), 인(寅), 묘(卯), 진(辰), 사(巳), 오(午), 미(未), 신(申), 유(酉), 술(戌), 해(亥) 12가지" },
    { term: "일간", hanja: "日干", definition: "일주의 천간으로, 사주의 주인공을 나타냄" },
    { term: "오행", hanja: "五行", definition: "목(木), 화(火), 토(土), 금(金), 수(水)의 다섯 가지 기운" },
    { term: "십신", hanja: "十神", definition: "일간을 기준으로 다른 글자들과의 관계를 나타내는 10가지 분류" },
    { term: "비견", hanja: "比肩", definition: "나와 같은 오행, 같은 음양. 형제, 친구, 경쟁자를 의미" },
    { term: "겁재", hanja: "劫財", definition: "나와 같은 오행, 다른 음양. 강한 경쟁자, 손재수" },
    { term: "식신", hanja: "食神", definition: "내가 생하는 오행, 같은 음양. 먹는 복, 재능, 자녀(여)" },
    { term: "상관", hanja: "傷官", definition: "내가 생하는 오행, 다른 음양. 표현력, 자녀(여), 반항심" },
    { term: "편재", hanja: "偏財", definition: "내가 극하는 오행, 같은 음양. 사업재물, 아버지, 첩(남)" },
    { term: "정재", hanja: "正財", definition: "내가 극하는 오행, 다른 음양. 월급재물, 아내(남)" },
    { term: "편관", hanja: "偏官", definition: "나를 극하는 오행, 같은 음양. 직장상사, 자녀(남), 칠살" },
    { term: "정관", hanja: "正官", definition: "나를 극하는 오행, 다른 음양. 명예, 남편(여), 직장" },
    { term: "편인", hanja: "偏印", definition: "나를 생하는 오행, 같은 음양. 특수학문, 편모" },
    { term: "정인", hanja: "正印", definition: "나를 생하는 오행, 다른 음양. 학문, 어머니" },
    { term: "신강", hanja: "身强", definition: "일간의 힘이 강한 상태" },
    { term: "신약", hanja: "身弱", definition: "일간의 힘이 약한 상태" },
    { term: "용신", hanja: "用神", definition: "사주의 균형을 맞추는 데 필요한 오행" },
    { term: "대운", hanja: "大運", definition: "10년 단위로 변하는 큰 운세" },
    { term: "세운", hanja: "歲運", definition: "매년 바뀌는 연도별 운세" },
    { term: "격국", hanja: "格局", definition: "사주의 기본 틀과 구조" },
    { term: "공망", hanja: "空亡", definition: "비어있는 지지, 약화된 에너지" },
  ];
}

/**
 * FAQ 생성
 */
function generateFaq(): Array<{ question: string; answer: string }> {
  return [
    {
      question: "사주팔자는 정해진 운명인가요?",
      answer: "사주는 타고난 기질과 흐름을 보여주지만, 선택과 노력으로 더 좋은 방향으로 이끌어갈 수 있습니다.",
    },
    {
      question: "신강과 신약 중 뭐가 좋은가요?",
      answer: "어느 쪽이 좋고 나쁜 것이 아니라, 각각에 맞는 운영 방식이 다릅니다. 신강은 에너지를 발산해야 하고, 신약은 에너지를 보충받아야 합니다.",
    },
    {
      question: "대운이 바뀌면 인생도 완전히 바뀌나요?",
      answer: "대운이 바뀌면 10년간의 주제가 달라집니다. 갑작스러운 변화보다는 점진적인 흐름의 변화로 이해하시면 됩니다.",
    },
    {
      question: "시간을 모르면 분석이 정확하지 않나요?",
      answer: "시주가 없어도 년월일주 분석으로 많은 것을 알 수 있습니다. 다만 시주는 말년운과 자녀운에 영향을 주므로 알면 더 정확합니다.",
    },
  ];
}
