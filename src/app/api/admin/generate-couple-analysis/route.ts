import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Gender, SajuApiResult } from "@/types/saju";
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
