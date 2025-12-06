import { NextRequest, NextResponse } from "next/server";
import { createServerClient, getTermDatesWithPrevYear } from "@/lib/supabase";
import { generateExpertAnalysis } from "@/lib/expert/pdf-generator";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { calculateSaju, calculateMajorFortunes, calculateYearlyFortunes, getFortuneYear } from "@/lib/saju-calculator";
import { getIlganTraits, getOhengAdvice, analyzeOhengBalance } from "@/lib/saju-traits";
import type {
  Gender,
  RelationshipStatus,
  OccupationStatus,
  SajuApiResult,
  CalendaData,
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

// 내부 사주 계산 함수 (HTTP fetch 대신 직접 계산)
async function calculateSajuInternal(
  year: number,
  month: number,
  day: number,
  hour: number,
  isLunar: boolean,
  isLeapMonth: boolean,
  gender: Gender
): Promise<SajuApiResult> {
  const supabase = createServerClient();
  const timeUnknown = hour === 12;
  const minute = 0;

  // 만세력 데이터 조회
  let query = supabase.from("calenda_data").select("*");

  if (isLunar) {
    query = query
      .eq("cd_ly", year)
      .eq("cd_lm", month)
      .eq("cd_ld", day)
      .eq("cd_leap_month", isLeapMonth ? 1 : 0);
  } else {
    query = query
      .eq("cd_sy", year)
      .eq("cd_sm", month)
      .eq("cd_sd", day);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    throw new Error("해당 날짜의 만세력 데이터를 찾을 수 없습니다.");
  }

  const calendaData = data as CalendaData;

  // 사주 계산
  const result = calculateSaju(calendaData, hour, minute, timeUnknown);

  // 일간 성향 분석
  const ilganTraits = getIlganTraits(result.dayPillar.cheongan);

  // 용신 오행 조언
  const yongsinAdvice = getOhengAdvice(result.yongsin);

  // 오행 균형 분석
  const ohengBalance = analyzeOhengBalance(result.ohengCount);

  // 실제 절기 데이터 조회 (양력 연도 기준)
  const solarYear = calendaData.cd_sy;
  const solarMonth = Number(calendaData.cd_sm);
  const solarDay = Number(calendaData.cd_sd);
  const termDates = await getTermDatesWithPrevYear(solarYear, supabase);

  // 대운 계산
  const majorFortunes = calculateMajorFortunes(
    result.yearPillar.cheongan,
    result.monthPillar.ganji,
    gender,
    solarYear,
    solarMonth,
    solarDay,
    termDates
  );

  // 연운 계산
  const fortuneYear = getFortuneYear();
  const yearlyFortunes = calculateYearlyFortunes(
    fortuneYear - 1,
    fortuneYear + 5,
    result.dayPillar.cheongan,
    result.yongsin
  );

  return {
    ...result,
    majorFortunes,
    yearlyFortunes,
    gender,
    analysis: {
      ilganTraits,
      yongsinAdvice,
      ohengBalance,
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await verifyAdminRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // 레이트 리밋 체크 (분석 생성은 리소스 소모가 큼)
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.ANALYSIS_GENERATION,
      "admin-generate-analysis"
    );
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          message: `분석 생성 요청 한도를 초과했습니다. ${retryAfter}초 후에 다시 시도해주세요.`,
        },
        { status: 429 }
      );
    }

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
