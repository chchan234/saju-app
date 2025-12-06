import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 한국어 조사 자동 처리 유틸리티
 * 마지막 글자의 받침 유무에 따라 적절한 조사를 선택합니다.
 */

/**
 * 마지막 글자에 받침이 있는지 확인
 * @param str 검사할 문자열
 * @returns 받침이 있으면 true, 없으면 false
 */
export function hasBatchim(str: string): boolean {
  if (!str || str.length === 0) return false;

  // 괄호와 그 안의 내용을 제거 (한자 표기 등 무시)
  // 예: "정축(丁丑)" -> "정축"
  const cleanStr = str.replace(/\([^)]*\)/g, "").trim();
  const targetStr = cleanStr.length > 0 ? cleanStr : str;

  const lastChar = targetStr[targetStr.length - 1];
  const code = lastChar.charCodeAt(0);

  // 한글 범위 체크 (가-힣: 44032-55203)
  if (code < 44032 || code > 55203) {
    // 숫자나 영문의 경우
    // 숫자: 0,1,3,6,7,8 은 받침 있는 것처럼 처리
    if (/[013678]$/.test(targetStr)) return true;
    // 영문: l,m,n,r 등은 받침 있는 것처럼 처리
    if (/[lmnrLMNR]$/.test(targetStr)) return true;
    return false;
  }

  // 한글 받침 계산: (charCode - 44032) % 28
  // 28로 나눈 나머지가 0이면 받침 없음
  return (code - 44032) % 28 !== 0;
}

/**
 * 마지막 글자가 ㄹ 받침인지 확인
 * @param str 검사할 문자열
 * @returns ㄹ 받침이면 true
 */
export function hasRieulBatchim(str: string): boolean {
  if (!str || str.length === 0) return false;

  // 괄호와 그 안의 내용을 제거 (한자 표기 등 무시)
  const cleanStr = str.replace(/\([^)]*\)/g, "").trim();
  const targetStr = cleanStr.length > 0 ? cleanStr : str;

  const lastChar = targetStr[targetStr.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code < 44032 || code > 55203) return false;

  // ㄹ 받침은 종성 인덱스 8
  return (code - 44032) % 28 === 8;
}

/**
 * 조사 타입
 */
export type PostpositionType =
  | "은/는" | "이/가" | "을/를" | "과/와"
  | "으로/로" | "아/야" | "이라/라" | "이에요/예요";

/**
 * 조사 선택
 * @param str 대상 문자열
 * @param type 조사 타입
 * @returns 적절한 조사
 */
export function getPostposition(str: string, type: PostpositionType): string {
  const hasFinal = hasBatchim(str);
  const hasRieul = hasRieulBatchim(str);

  switch (type) {
    case "은/는":
      return hasFinal ? "은" : "는";
    case "이/가":
      return hasFinal ? "이" : "가";
    case "을/를":
      return hasFinal ? "을" : "를";
    case "과/와":
      return hasFinal ? "과" : "와";
    case "으로/로":
      // ㄹ 받침이거나 받침이 없으면 "로", 그 외 받침이 있으면 "으로"
      return (hasRieul || !hasFinal) ? "로" : "으로";
    case "아/야":
      return hasFinal ? "아" : "야";
    case "이라/라":
      return hasFinal ? "이라" : "라";
    case "이에요/예요":
      return hasFinal ? "이에요" : "예요";
    default:
      return "";
  }
}

/**
 * 문자열에 조사를 붙여서 반환
 * @param str 대상 문자열
 * @param type 조사 타입
 * @returns 조사가 붙은 문자열
 */
export function withPostposition(str: string, type: PostpositionType): string {
  if (!str) return "";
  return str + getPostposition(str, type);
}

/**
 * 이름에 "님"을 붙이고 조사 처리
 * @param name 이름
 * @param type 조사 타입
 * @returns "이름님" + 조사
 */
export function withNamePostposition(name: string, type: PostpositionType): string {
  if (!name) return "";
  const nameWithHonorific = name + "님";
  return nameWithHonorific + getPostposition(nameWithHonorific, type);
}

/**
 * 점수 색상 유틸리티
 * 일관된 점수 색상을 위한 통합 함수
 */

/**
 * 점수에 따른 Tailwind 텍스트 색상 클래스 반환
 * @param score 점수 (0-100)
 * @returns Tailwind 색상 클래스
 */
export function getScoreColorClass(score: number): string {
  if (score >= 85) return "text-green-600 dark:text-green-400";  // 매우 좋음
  if (score >= 75) return "text-blue-600 dark:text-blue-400";    // 좋음
  if (score >= 65) return "text-yellow-600 dark:text-yellow-400"; // 보통
  if (score >= 55) return "text-orange-600 dark:text-orange-400"; // 주의
  return "text-stone-500 dark:text-stone-400";                    // 낮음
}

/**
 * 점수에 따른 HEX 색상 반환 (차트용)
 * @param score 점수 (0-100)
 * @returns HEX 색상 코드
 */
export function getScoreColorHex(score: number): string {
  if (score >= 85) return "#22c55e"; // green-500 - 매우 좋음
  if (score >= 75) return "#3b82f6"; // blue-500 - 좋음
  if (score >= 65) return "#eab308"; // yellow-500 - 보통
  if (score >= 55) return "#f97316"; // orange-500 - 주의
  return "#78716c";                   // stone-500 - 낮음
}

/**
 * 점수에 따른 배경색 클래스 반환 (배지/태그용)
 * @param score 점수 (0-100)
 * @returns Tailwind 배경색 클래스
 */
export function getScoreBgClass(score: number): string {
  if (score >= 85) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  if (score >= 75) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  if (score >= 65) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  if (score >= 55) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
  return "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300";
}
