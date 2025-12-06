/**
 * 커플 전문가 모드 분석 모듈 인덱스
 * 16개 챕터 분석 함수 통합
 */

// 제1장: 두 사람의 명식
export { analyzeCouple1 } from "./chapter1-profiles";

// 제2장: 기본 궁합 점수
export { analyzeCouple2 } from "./chapter2-basic-score";

// 제3장: 일간 궁합 심층
export { analyzeCouple3 } from "./chapter3-ilgan-deep";

// 제4장: 오행 보완 분석
export { analyzeCouple4 } from "./chapter4-oheng-complement";

// 제5장: 오행 충돌 분석
export { analyzeCouple5 } from "./chapter5-oheng-conflict";

// 제6장: 지지 육합 분석
export { analyzeCouple6 } from "./chapter6-jiji-yukap";

// 제7장: 지지 충·형·해 분석
export { analyzeCouple7 } from "./chapter7-jiji-conflict";

// 제8장: 소통 방식
export { analyzeCouple8 } from "./chapter8-communication";

// 제9장: 갈등 패턴과 화해법
export { analyzeCouple9 } from "./chapter9-conflict-pattern";

// 제10장: 연애/결혼 시기
export { analyzeCouple10 } from "./chapter10-timing";

// 제11장: 재물 궁합
export { analyzeCouple11 } from "./chapter11-wealth";

// 제12장: 자녀 궁합
export { analyzeCouple12 } from "./chapter12-children";

// 제13장: 시댁/처가 관계
export { analyzeCouple13 } from "./chapter13-family";

// 제14장: 위기 시기와 주의점
export { analyzeCouple14 } from "./chapter14-crisis";

// 제15장: 장기 전망
export { analyzeCouple15 } from "./chapter15-longterm";

// 제16장: 종합 조언
export { analyzeCouple16 } from "./chapter16-summary";

// 타입 재내보내기
export type {
  CoupleChapter1Result,
  CoupleChapter2Result,
  CoupleChapter3Result,
  CoupleChapter4Result,
  CoupleChapter5Result,
  CoupleChapter6Result,
  CoupleChapter7Result,
  CoupleChapter8Result,
  CoupleChapter9Result,
  CoupleChapter10Result,
  CoupleChapter11Result,
  CoupleChapter12Result,
  CoupleChapter13Result,
  CoupleChapter14Result,
  CoupleChapter15Result,
  CoupleChapter16Result,
  ExpertCoupleResult,
  CouplePersonInfo,
  CoupleSajuData,
} from "@/types/expert-couple";
