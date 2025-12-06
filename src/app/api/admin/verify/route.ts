import { NextRequest, NextResponse } from "next/server";
import { createAuthResponse, createLogoutResponse } from "@/lib/admin-auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // 레이트 리밋 체크 (브루트포스 방지)
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.LOGIN_ATTEMPT,
      "admin-login"
    );

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          message: `로그인 시도 횟수를 초과했습니다. ${retryAfter}초 후에 다시 시도해주세요.`,
        },
        {
          status: 429,
          headers: { "Retry-After": retryAfter.toString() },
        }
      );
    }

    const { password } = await request.json();

    // 환경변수에서 어드민 비밀번호 가져오기
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 디버깅용 로그 (프로덕션에서 확인 후 삭제)
    console.log("Input password:", password, "Type:", typeof password);
    console.log("Admin password exists:", !!adminPassword, "Length:", adminPassword?.length);

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류" },
        { status: 500 }
      );
    }

    // 비밀번호 검증
    if (password === adminPassword) {
      // JWT 토큰 발급 및 HTTP-only 쿠키 설정
      return await createAuthResponse({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 로그아웃 엔드포인트
export async function DELETE() {
  return createLogoutResponse();
}
