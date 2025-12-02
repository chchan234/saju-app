/**
 * 커플 궁합 분석 API
 * POST /api/saju/compatibility
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeCompatibility } from "@/lib/saju-compatibility";
import type { SajuApiResult } from "@/types/saju";

interface CompatibilityRequest {
  person1: SajuApiResult;
  person2: SajuApiResult;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompatibilityRequest = await request.json();
    const { person1, person2 } = body;

    // 입력 검증
    if (!person1 || !person2) {
      return NextResponse.json(
        { error: "두 사람의 사주 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    if (!person1.dayPillar?.cheongan || !person2.dayPillar?.cheongan) {
      return NextResponse.json(
        { error: "일간 정보가 없습니다." },
        { status: 400 }
      );
    }

    // 궁합 분석
    const result = analyzeCompatibility(person1, person2);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error("Compatibility analysis error:", err);
    return NextResponse.json(
      { error: "궁합 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
