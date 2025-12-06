import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// JWT 설정
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.ADMIN_PASSWORD || "fallback-secret-change-me"
);
const JWT_ISSUER = "saju-admin";
const JWT_EXPIRATION = "1h"; // 1시간

// 쿠키 이름
const ADMIN_TOKEN_COOKIE = "admin_token";

// 인증 결과 타입
export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

/**
 * JWT 토큰 생성
 */
export async function createAdminToken(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * JWT 토큰 검증
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/**
 * 요청에서 Admin 토큰 추출 및 검증
 */
export async function verifyAdminRequest(request: NextRequest): Promise<AuthResult> {
  // 1. Authorization 헤더에서 Bearer 토큰 확인
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (await verifyAdminToken(token)) {
      return { authenticated: true };
    }
  }

  // 2. 쿠키에서 토큰 확인
  const cookieToken = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  if (cookieToken && (await verifyAdminToken(cookieToken))) {
    return { authenticated: true };
  }

  return { authenticated: false, error: "인증이 필요합니다." };
}

/**
 * Admin 인증 미들웨어 래퍼
 * API 라우트에서 사용: withAdminAuth(handler)
 */
export function withAdminAuth<T>(
  handler: (request: NextRequest, context: T) => Promise<NextResponse>
): (request: NextRequest, context: T) => Promise<NextResponse> {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const authResult = await verifyAdminRequest(request);

    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.error || "Unauthorized" },
        { status: 401 }
      );
    }

    return handler(request, context);
  };
}

/**
 * 서버 컴포넌트/액션에서 Admin 인증 확인
 */
export async function checkAdminAuth(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

    if (!token) {
      return { authenticated: false, error: "토큰이 없습니다." };
    }

    const isValid = await verifyAdminToken(token);
    if (!isValid) {
      return { authenticated: false, error: "유효하지 않은 토큰입니다." };
    }

    return { authenticated: true };
  } catch {
    return { authenticated: false, error: "인증 확인 중 오류가 발생했습니다." };
  }
}

/**
 * 인증 응답 생성 (로그인 성공 시)
 */
export async function createAuthResponse(
  data: object = { success: true }
): Promise<NextResponse> {
  const token = await createAdminToken();

  const response = NextResponse.json(data);

  // HTTP-only 쿠키로 토큰 설정
  response.cookies.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60, // 1시간
    path: "/",
  });

  return response;
}

/**
 * 로그아웃 응답 생성
 */
export function createLogoutResponse(): NextResponse {
  const response = NextResponse.json({ success: true });

  // 쿠키 삭제
  response.cookies.set(ADMIN_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
