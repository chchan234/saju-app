/**
 * API 유틸리티
 * Capacitor 앱에서 절대 URL로 API 호출하기 위한 헬퍼
 */

// 모바일 앱용 API 베이스 URL (환경변수 또는 기본값)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * API 엔드포인트 URL 생성
 * - 웹: 상대 경로 사용 (/api/saju)
 * - Capacitor 앱: 절대 경로 사용 (https://saju-studio.com/api/saju)
 */
export function getApiUrl(endpoint: string): string {
  // 환경변수가 설정되어 있으면 절대 URL 사용
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  // 웹에서는 상대 경로 사용
  return endpoint;
}

/**
 * API fetch 래퍼
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
}
