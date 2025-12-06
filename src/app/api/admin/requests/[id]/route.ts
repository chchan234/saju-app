import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// 신청 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const authResult = await verifyAdminRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // 레이트 리밋 체크
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.ADMIN_API,
      "admin-requests-delete"
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "요청 한도 초과" },
        { status: 429 }
      );
    }

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
      .from("expert_mode_requests")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting request:", deleteError);
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
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { success: false, message: "삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 인증 확인
    const authResult = await verifyAdminRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // 레이트 리밋 체크
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.ADMIN_API,
      "admin-requests-get"
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, message: "요청 한도 초과" },
        { status: 429 }
      );
    }

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
      .from("expert_mode_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !requestData) {
      console.error("Error fetching request:", fetchError);
      return NextResponse.json(
        { success: false, message: "요청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 응답 데이터 변환
    const response = {
      id: requestData.id,
      createdAt: requestData.created_at,
      name: requestData.name,
      email: requestData.email,
      birthYear: requestData.birth_year,
      birthMonth: requestData.birth_month,
      birthDay: requestData.birth_day,
      birthHour: requestData.birth_hour,
      gender: requestData.gender,
      isLunar: requestData.is_lunar,
      isLeapMonth: requestData.is_leap_month,
      relationshipStatus: requestData.relationship_status,
      occupationStatus: requestData.occupation_status,
      hasChildren: requestData.has_children,
      partnerInfo: requestData.partner_info,
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
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { success: false, message: "요청 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
