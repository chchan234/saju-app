import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface ExpertCoupleRequestRecord {
  id: string;
  created_at: string;
  email: string;
  person1_name: string;
  person1_gender: string;
  person1_birth_year: number;
  person1_birth_month: number;
  person1_birth_day: number;
  person1_birth_hour: number;
  person1_is_lunar: boolean;
  person1_is_leap_month: boolean;
  person2_name: string;
  person2_gender: string;
  person2_birth_year: number;
  person2_birth_month: number;
  person2_birth_day: number;
  person2_birth_hour: number;
  person2_is_lunar: boolean;
  person2_is_leap_month: boolean;
  pdf_status: string;
  pdf_url: string | null;
  email_status: string;
  email_sent_at: string | null;
}

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: requests, error } = await supabase
      .from("expert_couple_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching couple requests:", error);

      // 테이블이 없는 경우 명확한 메시지 반환
      if (error.message?.includes("relation") || error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            success: false,
            requests: [],
            message: "expert_couple_requests table이 존재하지 않습니다. 데이터베이스 설정이 필요합니다."
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: false, requests: [], message: `데이터 조회 중 오류가 발생했습니다: ${error.message}` },
        { status: 500 }
      );
    }

    // 데이터 형식 변환 (snake_case -> camelCase)
    const formattedRequests = ((requests || []) as ExpertCoupleRequestRecord[]).map((req) => ({
      id: req.id,
      createdAt: req.created_at,
      email: req.email,
      person1: {
        name: req.person1_name,
        gender: req.person1_gender,
        birthYear: req.person1_birth_year,
        birthMonth: req.person1_birth_month,
        birthDay: req.person1_birth_day,
        birthHour: req.person1_birth_hour,
        isLunar: req.person1_is_lunar,
        isLeapMonth: req.person1_is_leap_month,
      },
      person2: {
        name: req.person2_name,
        gender: req.person2_gender,
        birthYear: req.person2_birth_year,
        birthMonth: req.person2_birth_month,
        birthDay: req.person2_birth_day,
        birthHour: req.person2_birth_hour,
        isLunar: req.person2_is_lunar,
        isLeapMonth: req.person2_is_leap_month,
      },
      pdfStatus: req.pdf_status,
      pdfUrl: req.pdf_url,
      emailStatus: req.email_status,
      emailSentAt: req.email_sent_at,
    }));

    return NextResponse.json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error("Error in admin couple requests API:", error);
    return NextResponse.json(
      { requests: [], message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
