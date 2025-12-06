import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateExpertAnalysis } from "@/lib/expert/pdf-generator";
import type {
  Gender,
  RelationshipStatus,
  OccupationStatus,
  SajuApiResult,
} from "@/types/saju";

interface PartnerInfo {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  isLunar: boolean;
  isLeapMonth: boolean;
}

// 내부 사주 API 호출 함수
async function calculateSajuInternal(
  year: number,
  month: number,
  day: number,
  hour: number,
  isLunar: boolean,
  isLeapMonth: boolean,
  gender: Gender
): Promise<SajuApiResult> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/saju`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      year,
      month,
      day,
      hour,
      minute: 0,
      isLunar,
      isLeapMonth,
      timeUnknown: hour === 12,
      gender,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "사주 계산 실패");
  }

  const result = await response.json();
  return result.data;
}

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "requestId가 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 요청 정보 조회
    const { data: requestData, error: fetchError } = await supabase
      .from("expert_mode_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !requestData) {
      console.error("Error fetching request:", fetchError);
      return NextResponse.json(
        { success: false, message: "요청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 이미 분석 완료된 경우
    if (requestData.analysis_result) {
      return NextResponse.json({
        success: true,
        message: "이미 분석이 완료되었습니다.",
        analysisResult: requestData.analysis_result,
      });
    }

    // 분석 상태 업데이트
    await supabase
      .from("expert_mode_requests")
      .update({ pdf_status: "generating" })
      .eq("id", requestId);

    // 사주 계산
    const sajuResult = await calculateSajuInternal(
      requestData.birth_year,
      requestData.birth_month,
      requestData.birth_day,
      requestData.birth_hour,
      requestData.is_lunar,
      requestData.is_leap_month,
      requestData.gender as Gender
    );

    // 상대방 사주 계산 (있는 경우)
    let partnerSajuResult = undefined;
    const partnerInfo = requestData.partner_info as PartnerInfo | null;

    if (partnerInfo) {
      partnerSajuResult = await calculateSajuInternal(
        partnerInfo.birthYear,
        partnerInfo.birthMonth,
        partnerInfo.birthDay,
        partnerInfo.birthHour,
        partnerInfo.isLunar,
        partnerInfo.isLeapMonth,
        partnerInfo.gender
      );
    }

    // 전문가 분석 실행
    const analysisOutput = await generateExpertAnalysis({
      sajuResult,
      partnerSajuResult,
      gender: requestData.gender as Gender,
      relationshipStatus: requestData.relationship_status as RelationshipStatus,
      occupationStatus: requestData.occupation_status as OccupationStatus,
      hasChildren: requestData.has_children,
      birthYear: requestData.birth_year,
      name: requestData.name,
      partnerName: partnerInfo?.name,
    });

    if (!analysisOutput.success || !analysisOutput.analysisResult) {
      await supabase
        .from("expert_mode_requests")
        .update({ pdf_status: "failed" })
        .eq("id", requestId);

      return NextResponse.json(
        { success: false, message: analysisOutput.error || "분석 생성 실패" },
        { status: 500 }
      );
    }

    // 분석 결과 저장
    await supabase
      .from("expert_mode_requests")
      .update({
        analysis_result: analysisOutput.analysisResult,
        pdf_status: "completed"
      })
      .eq("id", requestId);

    return NextResponse.json({
      success: true,
      message: "분석 생성 완료",
      analysisResult: analysisOutput.analysisResult,
    });
  } catch (error) {
    console.error("Error generating analysis:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "분석 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
