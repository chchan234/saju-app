import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, message: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    // Supabase REST API를 통해 SQL 실행 (pg_execute 사용)
    const sql = `
      CREATE TABLE IF NOT EXISTS expert_mode_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        birth_year INTEGER NOT NULL,
        birth_month INTEGER NOT NULL,
        birth_day INTEGER NOT NULL,
        birth_hour INTEGER NOT NULL DEFAULT 12,
        gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
        is_lunar BOOLEAN DEFAULT false,
        is_leap_month BOOLEAN DEFAULT false,
        relationship_status TEXT NOT NULL CHECK (relationship_status IN ('solo', 'dating', 'married', 'divorced')),
        occupation_status TEXT NOT NULL CHECK (occupation_status IN ('employee', 'business', 'student', 'jobseeker', 'freelance', 'homemaker', 'retired', 'other')),
        has_children BOOLEAN DEFAULT false,
        partner_info JSONB,
        pdf_status TEXT DEFAULT 'pending' CHECK (pdf_status IN ('pending', 'generating', 'completed', 'failed')),
        email_status TEXT DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed')),
        email_sent_at TIMESTAMP WITH TIME ZONE,
        analysis_result JSONB,
        pdf_url TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_created_at ON expert_mode_requests(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_pdf_status ON expert_mode_requests(pdf_status);
      CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_email_status ON expert_mode_requests(email_status);
    `;

    // Supabase SQL 실행 API 호출
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      // exec_sql RPC가 없는 경우, 직접 테이블 존재 여부 확인
      const checkResponse = await fetch(`${supabaseUrl}/rest/v1/expert_mode_requests?limit=0`, {
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
        },
      });

      if (checkResponse.status === 404 || checkResponse.status === 400) {
        // 테이블이 없는 경우 - 수동 생성 안내
        return NextResponse.json({
          success: false,
          message: "테이블이 존재하지 않습니다. Supabase Dashboard에서 수동으로 생성해주세요.",
          sql: sql.trim(),
          instructions: [
            "1. Supabase Dashboard (https://supabase.com/dashboard)에 접속",
            "2. 프로젝트 선택",
            "3. SQL Editor 메뉴 클릭",
            "4. 아래 SQL 쿼리 실행"
          ]
        }, { status: 400 });
      }

      // 테이블이 이미 존재하는 경우
      if (checkResponse.ok) {
        return NextResponse.json({
          success: true,
          message: "테이블이 이미 존재합니다.",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Database initialization failed"
      },
      { status: 500 }
    );
  }
}

// GET 요청으로 테이블 상태 확인
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { success: false, message: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/expert_mode_requests?limit=0`, {
      headers: {
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "테이블이 존재합니다.",
        tableExists: true
      });
    }

    return NextResponse.json({
      success: false,
      message: "테이블이 존재하지 않습니다.",
      tableExists: false,
      sql: `
CREATE TABLE IF NOT EXISTS expert_mode_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER NOT NULL DEFAULT 12,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  is_lunar BOOLEAN DEFAULT false,
  is_leap_month BOOLEAN DEFAULT false,
  relationship_status TEXT NOT NULL CHECK (relationship_status IN ('solo', 'dating', 'married', 'divorced')),
  occupation_status TEXT NOT NULL CHECK (occupation_status IN ('employee', 'business', 'student', 'jobseeker', 'freelance', 'homemaker', 'retired', 'other')),
  has_children BOOLEAN DEFAULT false,
  partner_info JSONB,
  pdf_status TEXT DEFAULT 'pending' CHECK (pdf_status IN ('pending', 'generating', 'completed', 'failed')),
  email_status TEXT DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed')),
  email_sent_at TIMESTAMP WITH TIME ZONE,
  analysis_result JSONB,
  pdf_url TEXT
);

ALTER TABLE expert_mode_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON expert_mode_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_created_at ON expert_mode_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_pdf_status ON expert_mode_requests(pdf_status);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_email_status ON expert_mode_requests(email_status);
      `.trim()
    });
  } catch (error) {
    console.error("Error checking table:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check table status" },
      { status: 500 }
    );
  }
}
