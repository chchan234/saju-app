/**
 * 전문가 모드 분석 모듈 인덱스
 * 18개 챕터 분석 함수 통합
 */

// 제1장: 기본 명식 분석
export { analyzeChapter1 } from "./chapter1-myeongshik";

// 제2장: 음양오행 분석
export { analyzeChapter2 } from "./chapter2-eumyang-oheng";

// 제3장: 십성 분석
export { analyzeChapter3 } from "./chapter3-sipseong";

// 제4장: 격국 분석
export { analyzeChapter4 } from "./chapter4-geokguk";

// 제5장: 살과 귀인
export { analyzeChapter5 } from "./chapter5-sinsal";

// 제6장: 십이운성
export { analyzeChapter6 } from "./chapter6-sipi-unseong";

// 제7장: 대운수 풀이
export { analyzeChapter7 } from "./chapter7-daeun";

// 제8장: 연도별 운세
export { analyzeChapter8 } from "./chapter8-yearly";

// 제9장: 금전운
export { analyzeChapter9 } from "./chapter9-wealth";

// 제10장: 직업운
export { analyzeChapter10 } from "./chapter10-career";

// 제11장: 건강운
export { analyzeChapter11 } from "./chapter11-health";

// 제12장: 연애 성향
export { analyzeChapter12 } from "./chapter12-love-style";

// 제13장: 인연의 흐름
export { analyzeChapter13 } from "./chapter13-relationship";

// 제14장: 결혼운 심층
export { analyzeChapter14 } from "./chapter14-marriage";

// 제15장: 가족 관계 운
export { analyzeChapter15 } from "./chapter15-family";

// 제16장: 궁합 분석
export { analyzeChapter16 } from "./chapter16-compatibility";

// 제17장: 주의 시기·개운법
export { analyzeChapter17 } from "./chapter17-warning";

// 제18장: 학업운
export { analyzeChapter18 } from "./chapter18-study";

// 타입 재내보내기
export type {
  Chapter1Result,
  Chapter2Result,
  Chapter3Result,
  Chapter4Result,
  Chapter5Result,
  Chapter6Result,
  Chapter7Result,
  Chapter8Result,
  Chapter9Result,
  Chapter10Result,
  Chapter11Result,
  Chapter12Result,
  Chapter13Result,
  Chapter14Result,
  Chapter15Result,
  Chapter16Result,
  Chapter17Result,
  Chapter18Result,
  ExpertModeResult,
  PillarExpertAnalysis,
} from "@/types/expert";
