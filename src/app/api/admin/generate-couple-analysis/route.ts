import { NextRequest, NextResponse } from "next/server";
import { createServerClient, getTermDatesWithPrevYear } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { calculateSaju, calculateMajorFortunes, calculateYearlyFortunes, getFortuneYear } from "@/lib/saju-calculator";
import { getIlganTraits, getOhengAdvice, analyzeOhengBalance } from "@/lib/saju-traits";
import type { Gender, SajuApiResult, CalendaData } from "@/types/saju";
import type { CoupleRelationshipStatus, ExpertCoupleResult } from "@/types/expert-couple";
import {
  analyzeCouple1,
  analyzeCouple2,
  analyzeCouple3,
  analyzeCouple4,
  analyzeCouple5,
  analyzeCouple6,
  analyzeCouple7,
  analyzeCouple8,
  analyzeCouple9,
  analyzeCouple10,
  analyzeCouple11,
  analyzeCouple12,
  analyzeCouple13,
  analyzeCouple14,
  analyzeCouple15,
  analyzeCouple16,
} from "@/lib/expert-couple";

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

    // 레이트 리밋 체크
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.ANALYSIS_GENERATION,
      "admin-generate-couple-analysis"
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
      .from("expert_couple_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !requestData) {
      console.error("Error fetching couple request:", fetchError);
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
      .from("expert_couple_requests")
      .update({ pdf_status: "generating" })
      .eq("id", requestId);

    // Person 1 사주 계산
    const saju1 = await calculateSajuInternal(
      requestData.person1_birth_year,
      requestData.person1_birth_month,
      requestData.person1_birth_day,
      requestData.person1_birth_hour,
      requestData.person1_is_lunar,
      requestData.person1_is_leap_month,
      requestData.person1_gender as Gender
    );

    // Person 2 사주 계산
    const saju2 = await calculateSajuInternal(
      requestData.person2_birth_year,
      requestData.person2_birth_month,
      requestData.person2_birth_day,
      requestData.person2_birth_hour,
      requestData.person2_is_lunar,
      requestData.person2_is_leap_month,
      requestData.person2_gender as Gender
    );

    // 커플 정보 구성
    const person1Info = {
      name: requestData.person1_name,
      gender: requestData.person1_gender as Gender,
      birthYear: requestData.person1_birth_year,
      birthMonth: requestData.person1_birth_month,
      birthDay: requestData.person1_birth_day,
      birthHour: requestData.person1_birth_hour,
      isLunar: requestData.person1_is_lunar,
      isLeapMonth: requestData.person1_is_leap_month,
      relationshipStatus: requestData.relationship_status as CoupleRelationshipStatus,
    };

    const person2Info = {
      name: requestData.person2_name,
      gender: requestData.person2_gender as Gender,
      birthYear: requestData.person2_birth_year,
      birthMonth: requestData.person2_birth_month,
      birthDay: requestData.person2_birth_day,
      birthHour: requestData.person2_birth_hour,
      isLunar: requestData.person2_is_lunar,
      isLeapMonth: requestData.person2_is_leap_month,
      relationshipStatus: requestData.relationship_status as CoupleRelationshipStatus,
    };

    // 16개 챕터 분석 실행
    const name1 = person1Info.name;
    const name2 = person2Info.name;

    const chapter1 = analyzeCouple1(saju1, saju2, name1, name2);
    const chapter2 = analyzeCouple2(saju1, saju2, name1, name2);
    const chapter3 = analyzeCouple3(saju1, saju2, name1, name2);
    const chapter4 = analyzeCouple4(saju1, saju2, name1, name2);
    const chapter5 = analyzeCouple5(saju1, saju2, name1, name2);
    const chapter6 = analyzeCouple6(saju1, saju2, name1, name2);
    const chapter7 = analyzeCouple7(saju1, saju2, name1, name2);
    const chapter8 = analyzeCouple8(saju1, saju2, name1, name2);
    const chapter9 = analyzeCouple9(saju1, saju2, name1, name2);
    const chapter10 = analyzeCouple10(saju1, saju2, name1, name2);
    const chapter11 = analyzeCouple11(saju1, saju2, name1, name2);
    const chapter12 = analyzeCouple12(saju1, saju2, name1, name2);
    const chapter13 = analyzeCouple13(saju1, saju2, name1, name2);
    const chapter14 = analyzeCouple14(saju1, saju2, name1, name2);
    const chapter15 = analyzeCouple15(saju1, saju2, name1, name2);
    const chapter16 = analyzeCouple16(saju1, saju2, name1, name2);

    // 최종 결과 구성
    const analysisResult: ExpertCoupleResult = {
      meta: {
        generatedAt: new Date(),
        version: "1.0",
        person1Name: person1Info.name,
        person2Name: person2Info.name,
        totalPages: 16,
      },
      personInfo: {
        person1: person1Info,
        person2: person2Info,
      },
      sajuData: {
        person1: {
          yearPillar: saju1.yearPillar,
          monthPillar: saju1.monthPillar,
          dayPillar: saju1.dayPillar,
          timePillar: saju1.timePillar,
          ilgan: saju1.dayPillar.cheongan,
          ohengCount: saju1.ohengCount,
          strongElements: Object.entries(saju1.ohengCount)
            .filter(([, count]) => count >= 3)
            .map(([el]) => el) as any[],
          weakElements: Object.entries(saju1.ohengCount)
            .filter(([, count]) => count === 0)
            .map(([el]) => el) as any[],
        },
        person2: {
          yearPillar: saju2.yearPillar,
          monthPillar: saju2.monthPillar,
          dayPillar: saju2.dayPillar,
          timePillar: saju2.timePillar,
          ilgan: saju2.dayPillar.cheongan,
          ohengCount: saju2.ohengCount,
          strongElements: Object.entries(saju2.ohengCount)
            .filter(([, count]) => count >= 3)
            .map(([el]) => el) as any[],
          weakElements: Object.entries(saju2.ohengCount)
            .filter(([, count]) => count === 0)
            .map(([el]) => el) as any[],
        },
      },
      chapters: {
        chapter1_profiles: chapter1,
        chapter2_basicScore: chapter2,
        chapter3_ilganDeep: chapter3,
        chapter4_ohengComplement: chapter4,
        chapter5_ohengConflict: chapter5,
        chapter6_jijiYukap: chapter6,
        chapter7_jijiConflict: chapter7,
        chapter8_communication: chapter8,
        chapter9_conflictPattern: chapter9,
        chapter10_timing: chapter10,
        chapter11_wealth: chapter11,
        chapter12_children: chapter12,
        chapter13_family: chapter13,
        chapter14_crisis: chapter14,
        chapter15_longterm: chapter15,
        chapter16_summary: chapter16,
      },
    };

    // 분석 결과 저장
    await supabase
      .from("expert_couple_requests")
      .update({
        analysis_result: analysisResult,
        pdf_status: "completed",
      })
      .eq("id", requestId);

    return NextResponse.json({
      success: true,
      message: "커플 분석 생성 완료",
      analysisResult,
    });
  } catch (error) {
    console.error("Error generating couple analysis:", error);

    // 실패 시 상태 업데이트
    try {
      const { requestId } = await request.json();
      if (requestId) {
        const supabase = createServerClient();
        await supabase
          .from("expert_couple_requests")
          .update({ pdf_status: "failed" })
          .eq("id", requestId);
      }
    } catch {}

    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "분석 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
