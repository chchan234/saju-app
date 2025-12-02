/**
 * 사주팔자 계산 API
 * POST /api/saju
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateSaju } from "@/lib/saju-calculator";
import { getIlganTraits, getOhengAdvice, analyzeOhengBalance } from "@/lib/saju-traits";
import type { CalendaData } from "@/types/saju";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SajuRequest {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  isLunar?: boolean;
  isLeapMonth?: boolean;
  timeUnknown?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: SajuRequest = await request.json();
    const { year, month, day, hour, minute, isLunar = false, isLeapMonth = false, timeUnknown = false } = body;

    // 입력 검증
    if (!year || !month || !day || hour === undefined || minute === undefined) {
      return NextResponse.json(
        { error: "생년월일시 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 날짜 범위 검증 (1900-2100)
    if (year < 1900 || year > 2100) {
      return NextResponse.json(
        { error: "1900년부터 2100년 사이의 날짜만 지원합니다." },
        { status: 400 }
      );
    }

    // 만세력 데이터 조회
    let query = supabase.from("calenda_data").select("*");

    if (isLunar) {
      // 음력 조회
      query = query
        .eq("cd_ly", year)
        .eq("cd_lm", month)
        .eq("cd_ld", day)
        .eq("cd_leap_month", isLeapMonth ? 1 : 0);
    } else {
      // 양력 조회
      query = query
        .eq("cd_sy", year)
        .eq("cd_sm", month)
        .eq("cd_sd", day);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "해당 날짜의 만세력 데이터를 찾을 수 없습니다." },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        analysis: {
          ilganTraits,
          yongsinAdvice,
          ohengBalance,
        }
      },
    });

  } catch (err) {
    console.error("Saju calculation error:", err);
    return NextResponse.json(
      { error: "사주 계산 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 특정 날짜 만세력 조회 API
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const year = parseInt(searchParams.get("year") || "0");
  const month = parseInt(searchParams.get("month") || "0");
  const day = parseInt(searchParams.get("day") || "0");
  const isLunar = searchParams.get("lunar") === "true";

  if (!year || !month || !day) {
    return NextResponse.json(
      { error: "year, month, day 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  let query = supabase.from("calenda_data").select("*");

  if (isLunar) {
    query = query
      .eq("cd_ly", year)
      .eq("cd_lm", month)
      .eq("cd_ld", day);
  } else {
    query = query
      .eq("cd_sy", year)
      .eq("cd_sm", month)
      .eq("cd_sd", day);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: data,
  });
}
