import { NextRequest, NextResponse } from "next/server";

// 레이트 리밋 설정 타입
interface RateLimitConfig {
  interval: number; // 시간 창 (밀리초)
  maxRequests: number; // 최대 요청 수
}

// IP별 요청 기록
interface RequestRecord {
  count: number;
  resetAt: number;
}

// 메모리 기반 저장소 (프로덕션에서는 Redis 권장)
const requestStore = new Map<string, RequestRecord>();

// 주기적 정리 (메모리 누수 방지)
const CLEANUP_INTERVAL = 60 * 1000; // 1분
let lastCleanup = Date.now();

function cleanupExpiredRecords(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  for (const [key, record] of requestStore.entries()) {
    if (record.resetAt < now) {
      requestStore.delete(key);
    }
  }
  lastCleanup = now;
}

/**
 * IP 주소 추출
 */
function getClientIP(request: NextRequest): string {
  // Vercel/Cloudflare 등의 프록시 헤더 확인
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // 기본값 (로컬 개발)
  return "127.0.0.1";
}

/**
 * 레이트 리밋 체크
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  keyPrefix: string = "default"
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupExpiredRecords();

  const ip = getClientIP(request);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const record = requestStore.get(key);

  // 기존 기록이 없거나 만료된 경우
  if (!record || record.resetAt < now) {
    const newRecord: RequestRecord = {
      count: 1,
      resetAt: now + config.interval,
    };
    requestStore.set(key, newRecord);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newRecord.resetAt,
    };
  }

  // 요청 수 증가
  record.count += 1;

  // 제한 초과 확인
  if (record.count > config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * 레이트 리밋 미들웨어 래퍼
 */
export function withRateLimit<T>(
  handler: (request: NextRequest, context: T) => Promise<NextResponse>,
  config: RateLimitConfig,
  keyPrefix: string = "api"
): (request: NextRequest, context: T) => Promise<NextResponse> {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const result = checkRateLimit(request, config, keyPrefix);

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

      return NextResponse.json(
        {
          success: false,
          message: "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
          retryAfter,
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(request, context);

    // 레이트 리밋 헤더 추가
    response.headers.set("X-RateLimit-Limit", config.maxRequests.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set(
      "X-RateLimit-Reset",
      Math.ceil(result.resetAt / 1000).toString()
    );

    return response;
  };
}

// 사전 정의된 레이트 리밋 설정
export const RATE_LIMITS = {
  // PDF 생성: 분당 5회
  PDF_GENERATION: {
    interval: 60 * 1000,
    maxRequests: 5,
  },
  // 이메일 발송: 분당 10회
  EMAIL_SEND: {
    interval: 60 * 1000,
    maxRequests: 10,
  },
  // 분석 생성: 분당 10회
  ANALYSIS_GENERATION: {
    interval: 60 * 1000,
    maxRequests: 10,
  },
  // 일반 Admin API: 분당 60회
  ADMIN_API: {
    interval: 60 * 1000,
    maxRequests: 60,
  },
  // 로그인 시도: 분당 5회 (브루트포스 방지)
  LOGIN_ATTEMPT: {
    interval: 60 * 1000,
    maxRequests: 5,
  },
} as const;
