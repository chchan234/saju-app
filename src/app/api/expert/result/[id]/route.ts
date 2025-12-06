import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// 공개 결과 조회 API (인증 없이 접근 가능)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "요청 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 분석 결과 조회 (이메일 발송 완료된 건만 공개)
    const { data, error } = await supabase
      .from("expert_mode_requests")
      .select("id, name, birth_year, birth_month, birth_day, gender, analysis_result, created_at, email_status")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이메일이 발송되지 않은 경우 접근 불가
    if (data.email_status !== "sent") {
      return NextResponse.json(
        { success: false, message: "아직 공개되지 않은 결과입니다." },
        { status: 403 }
      );
    }

    // 분석 결과가 없는 경우
    if (!data.analysis_result) {
      return NextResponse.json(
        { success: false, message: "분석이 아직 완료되지 않았습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        id: data.id,
        name: data.name,
        birthYear: data.birth_year,
        birthMonth: data.birth_month,
        birthDay: data.birth_day,
        gender: data.gender,
        analysisResult: data.analysis_result,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching expert result:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
