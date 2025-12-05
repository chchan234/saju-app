/**
 * 사주 분석 조회수 API
 * GET /api/saju/count
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("saju_view_count")
      .select("count")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("카운트 조회 실패:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: data?.count || 0 });
  } catch (err) {
    console.error("카운트 조회 오류:", err);
    return NextResponse.json({ count: 0 });
  }
}
