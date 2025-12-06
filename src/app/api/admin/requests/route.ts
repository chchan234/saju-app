import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

interface ExpertModeRequestRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  gender: string;
  is_lunar: boolean;
  is_leap_month: boolean;
  relationship_status: string;
  occupation_status: string;
  has_children: boolean;
  partner_info: unknown;
  pdf_status: string;
  pdf_url: string | null;
  email_status: string;
  email_sent_at: string | null;
}

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: requests, error } = await supabase
      .from("expert_mode_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);

      // 테이블이 없는 경우 명확한 메시지 반환
      if (error.message?.includes("relation") || error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          {
            success: false,
            requests: [],
            message: "expert_mode_requests table이 존재하지 않습니다. 데이터베이스 설정이 필요합니다."
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
    const formattedRequests = ((requests || []) as ExpertModeRequestRecord[]).map((req) => ({
      id: req.id,
      createdAt: req.created_at,
      name: req.name,
      email: req.email,
      birthYear: req.birth_year,
      birthMonth: req.birth_month,
      birthDay: req.birth_day,
      birthHour: req.birth_hour,
      gender: req.gender,
      isLunar: req.is_lunar,
      isLeapMonth: req.is_leap_month,
      relationshipStatus: req.relationship_status,
      occupationStatus: req.occupation_status,
      hasChildren: req.has_children,
      partnerInfo: req.partner_info,
      pdfStatus: req.pdf_status,
      pdfUrl: req.pdf_url,
      emailStatus: req.email_status,
      emailSentAt: req.email_sent_at,
    }));

    return NextResponse.json({ success: true, requests: formattedRequests });
  } catch (error) {
    console.error("Error in admin requests API:", error);
    return NextResponse.json(
      { requests: [], message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
