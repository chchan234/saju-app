import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();

    // expert_mode_requests 테이블에서 전체 신청 건수 조회
    const { count, error } = await supabase
      .from("expert_mode_requests")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching expert count:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ count: 0 });
  }
}
