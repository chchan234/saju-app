import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // 환경변수에서 어드민 비밀번호 가져오기
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류" },
        { status: 500 }
      );
    }

    // 비밀번호 검증
    if (password === adminPassword) {
      return NextResponse.json({ success: true });
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
