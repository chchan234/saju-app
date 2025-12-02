/**
 * 가족 통합 분석 API
 * POST /api/saju/family
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeFamilyCompatibility, type FamilyMemberInfo } from "@/lib/saju-family";
import type { SajuApiResult } from "@/types/saju";

interface FamilyMemberRequest {
  name: string;
  relation: string;
  saju: SajuApiResult;
  timeUnknown: boolean;
}

interface FamilyAnalysisRequest {
  members: FamilyMemberRequest[];
}

export async function POST(request: NextRequest) {
  try {
    const body: FamilyAnalysisRequest = await request.json();
    const { members } = body;

    // 입력 검증
    if (!members || !Array.isArray(members)) {
      return NextResponse.json(
        { error: "가족 구성원 데이터가 필요합니다." },
        { status: 400 }
      );
    }

    if (members.length < 2) {
      return NextResponse.json(
        { error: "가족 분석을 위해 최소 2명의 구성원이 필요합니다." },
        { status: 400 }
      );
    }

    if (members.length > 10) {
      return NextResponse.json(
        { error: "가족 분석은 최대 10명까지 가능합니다." },
        { status: 400 }
      );
    }

    // 각 구성원 데이터 검증
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.saju) {
        return NextResponse.json(
          { error: `${i + 1}번째 구성원의 사주 데이터가 없습니다.` },
          { status: 400 }
        );
      }
      if (!member.saju.dayPillar?.cheongan) {
        return NextResponse.json(
          { error: `${member.name || `${i + 1}번째 구성원`}의 일간 정보가 없습니다.` },
          { status: 400 }
        );
      }
    }

    // FamilyMemberInfo 형식으로 변환
    const familyMembers: FamilyMemberInfo[] = members.map(m => ({
      name: m.name,
      relation: m.relation,
      saju: m.saju,
      timeUnknown: m.timeUnknown,
    }));

    // 가족 분석 수행
    const result = analyzeFamilyCompatibility(familyMembers);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err) {
    console.error("Family analysis error:", err);
    return NextResponse.json(
      { error: "가족 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
