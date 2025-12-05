import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// GET: 후기 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = createServerClient();

    // 후기 목록 조회
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json({ error: "후기를 불러올 수 없습니다." }, { status: 500 });
    }

    // 통계 조회 (평균 별점, 총 개수)
    const { data: stats, error: statsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("is_visible", true);

    if (statsError) {
      console.error("Error fetching stats:", statsError);
    }

    const totalCount = stats?.length || 0;
    const averageRating = totalCount > 0
      ? stats!.reduce((sum, r) => sum + r.rating, 0) / totalCount
      : 0;

    return NextResponse.json({
      reviews,
      stats: {
        totalCount,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

// POST: 후기 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, rating, reviewType, message } = body;

    // 유효성 검사
    if (!nickname || nickname.length > 20) {
      return NextResponse.json({ error: "닉네임은 1-20자 이내로 입력해주세요." }, { status: 400 });
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "별점은 1-5 사이로 입력해주세요." }, { status: 400 });
    }

    if (!["personal", "couple", "family"].includes(reviewType)) {
      return NextResponse.json({ error: "올바른 분석 종류를 선택해주세요." }, { status: 400 });
    }

    if (!message || message.length > 300) {
      return NextResponse.json({ error: "후기는 1-300자 이내로 입력해주세요." }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        nickname,
        rating,
        review_type: reviewType,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting review:", error);
      return NextResponse.json({ error: "후기 등록에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true, review: data });
  } catch (error) {
    console.error("Error in POST /api/reviews:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
