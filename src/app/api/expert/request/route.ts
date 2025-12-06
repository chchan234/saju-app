import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type {
  BirthHour,
  CalendarType,
  Gender,
  RelationshipStatus,
  OccupationStatus,
} from "@/types/saju";

interface PersonData {
  name: string;
  gender: Gender;
  year: string;
  month: string;
  day: string;
  hour: BirthHour;
  calendarType: CalendarType;
  isLeapMonth: boolean;
  relationshipStatus: RelationshipStatus;
  occupationStatus: OccupationStatus;
  hasChildren: boolean;
}

interface RequestBody {
  email: string;
  person: PersonData;
  partner: PersonData | null;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { email, person, partner } = body;

    // 검증
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "올바른 이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!person.name || !person.year || !person.month || !person.day) {
      return NextResponse.json(
        { success: false, message: "본인 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 시간 파싱 (BirthHour -> 숫자)
    const parseHour = (hour: BirthHour): number => {
      if (hour === "unknown") return 12;
      if (hour === "23-2") return 22; // 해시
      return parseInt(hour, 10);
    };

    // 데이터 삽입
    const insertData = {
      email,
      name: person.name,
      gender: person.gender,
      birth_year: parseInt(person.year),
      birth_month: parseInt(person.month),
      birth_day: parseInt(person.day),
      birth_hour: parseHour(person.hour),
      is_lunar: person.calendarType === "lunar",
      is_leap_month: person.isLeapMonth,
      relationship_status: person.relationshipStatus,
      occupation_status: person.occupationStatus,
      has_children: person.hasChildren,
      partner_info: partner
        ? {
            name: partner.name,
            gender: partner.gender,
            birthYear: parseInt(partner.year),
            birthMonth: parseInt(partner.month),
            birthDay: parseInt(partner.day),
            birthHour: parseHour(partner.hour),
            isLunar: partner.calendarType === "lunar",
            isLeapMonth: partner.isLeapMonth,
          }
        : null,
      pdf_status: "pending",
      email_status: "pending",
    };

    const { data, error } = await supabase
      .from("expert_mode_requests")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error inserting request:", error);
      return NextResponse.json(
        { success: false, message: "신청 저장 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // TODO: PDF 생성 트리거 (Phase 23)
    // await generatePdf(data.id);

    return NextResponse.json({
      success: true,
      message: "신청이 완료되었습니다.",
      requestId: data.id,
    });
  } catch (error) {
    console.error("Error in expert request API:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
