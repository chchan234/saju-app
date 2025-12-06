import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { Gender } from "@/types/saju";
import type { CoupleRelationshipStatus } from "@/types/expert-couple";

interface CouplePersonData {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  isLunar: boolean;
  isLeapMonth: boolean;
  relationshipStatus?: CoupleRelationshipStatus;
}

interface RequestBody {
  email: string;
  person1: CouplePersonData;
  person2: CouplePersonData;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { email, person1, person2 } = body;

    // 검증
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "올바른 이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!person1.name || !person1.birthYear || !person1.birthMonth || !person1.birthDay) {
      return NextResponse.json(
        { success: false, message: "본인 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    if (!person2.name || !person2.birthYear || !person2.birthMonth || !person2.birthDay) {
      return NextResponse.json(
        { success: false, message: "상대방 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 시간 파싱 (-1이면 12시로 기본값)
    const parseHour = (hour: number): number => {
      if (hour === -1) return 12;
      return hour;
    };

    // 데이터 삽입
    const insertData = {
      email,
      person1_name: person1.name,
      person1_gender: person1.gender,
      person1_birth_year: person1.birthYear,
      person1_birth_month: person1.birthMonth,
      person1_birth_day: person1.birthDay,
      person1_birth_hour: parseHour(person1.birthHour),
      person1_is_lunar: person1.isLunar,
      person1_is_leap_month: person1.isLeapMonth,
      person2_name: person2.name,
      person2_gender: person2.gender,
      person2_birth_year: person2.birthYear,
      person2_birth_month: person2.birthMonth,
      person2_birth_day: person2.birthDay,
      person2_birth_hour: parseHour(person2.birthHour),
      person2_is_lunar: person2.isLunar,
      person2_is_leap_month: person2.isLeapMonth,
      relationship_status: person1.relationshipStatus || "unmarried",
      pdf_status: "pending",
      email_status: "pending",
    };

    const { data, error } = await supabase
      .from("expert_couple_requests")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error inserting couple request:", error);
      return NextResponse.json(
        { success: false, message: "신청 저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "신청이 완료되었습니다.",
      requestId: data.id,
    });
  } catch (error) {
    console.error("Error in expert couple request API:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
