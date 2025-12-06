import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// 신청 삭제
export async function DELETE(
  _request: NextRequest,
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

    // 요청 삭제
    const { error: deleteError } = await supabase
      .from("expert_couple_requests")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting couple request:", deleteError);
      return NextResponse.json(
        { success: false, message: "삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Error deleting couple request:", error);
    return NextResponse.json(
      { success: false, message: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 신청 상세 조회
export async function GET(
  _request: NextRequest,
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

    // 요청 정보 조회
    const { data: requestData, error: fetchError } = await supabase
      .from("expert_couple_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !requestData) {
      console.error("Error fetching couple request:", fetchError);
      return NextResponse.json(
        { success: false, message: "요청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 응답 데이터 변환
    const response = {
      id: requestData.id,
      createdAt: requestData.created_at,
      email: requestData.email,
      person1: {
        name: requestData.person1_name,
        gender: requestData.person1_gender,
        birthYear: requestData.person1_birth_year,
        birthMonth: requestData.person1_birth_month,
        birthDay: requestData.person1_birth_day,
        birthHour: requestData.person1_birth_hour,
        isLunar: requestData.person1_is_lunar,
        isLeapMonth: requestData.person1_is_leap_month,
      },
      person2: {
        name: requestData.person2_name,
        gender: requestData.person2_gender,
        birthYear: requestData.person2_birth_year,
        birthMonth: requestData.person2_birth_month,
        birthDay: requestData.person2_birth_day,
        birthHour: requestData.person2_birth_hour,
        isLunar: requestData.person2_is_lunar,
        isLeapMonth: requestData.person2_is_leap_month,
      },
      pdfStatus: requestData.pdf_status,
      emailStatus: requestData.email_status,
      emailSentAt: requestData.email_sent_at,
      analysisResult: requestData.analysis_result,
    };

    return NextResponse.json({
      success: true,
      request: response,
    });
  } catch (error) {
    console.error("Error fetching couple request:", error);
    return NextResponse.json(
      { success: false, message: "요청 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
