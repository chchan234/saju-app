/**
 * Supabase 테이블 생성 스크립트 (REST API 사용)
 */

require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const SQL = `
-- 기존 테이블 삭제 (있다면)
DROP TABLE IF EXISTS calenda_data;

-- 테이블 생성
CREATE TABLE calenda_data (
  cd_no SERIAL PRIMARY KEY,
  cd_sgi SMALLINT NOT NULL DEFAULT 0,
  cd_sy SMALLINT NOT NULL DEFAULT 0,
  cd_sm SMALLINT NOT NULL DEFAULT 1,
  cd_sd SMALLINT NOT NULL DEFAULT 1,
  cd_ly SMALLINT NOT NULL DEFAULT 0,
  cd_lm SMALLINT NOT NULL DEFAULT 1,
  cd_ld SMALLINT NOT NULL DEFAULT 1,
  cd_hyganjee VARCHAR(6),
  cd_kyganjee VARCHAR(6),
  cd_hmganjee VARCHAR(6),
  cd_kmganjee VARCHAR(6),
  cd_hdganjee VARCHAR(6),
  cd_kdganjee VARCHAR(6),
  cd_hweek CHAR(3),
  cd_kweek CHAR(3),
  cd_stars CHAR(3),
  cd_moon_state CHAR(3),
  cd_moon_time VARCHAR(12),
  cd_leap_month SMALLINT DEFAULT 0,
  cd_month_size SMALLINT DEFAULT 0,
  cd_hterms VARCHAR(6),
  cd_kterms VARCHAR(6),
  cd_terms_time VARCHAR(12),
  cd_keventday VARCHAR(6),
  cd_ddi VARCHAR(10) NOT NULL DEFAULT '쥐',
  cd_sol_plan VARCHAR(50),
  cd_lun_plan VARCHAR(50),
  holiday SMALLINT NOT NULL DEFAULT 0
);

-- 인덱스 생성
CREATE INDEX idx_calenda_solar ON calenda_data (cd_sy, cd_sm, cd_sd);
CREATE INDEX idx_calenda_lunar ON calenda_data (cd_ly, cd_lm, cd_ld, cd_leap_month);
CREATE INDEX idx_calenda_terms ON calenda_data (cd_kterms);

-- RLS 설정
ALTER TABLE calenda_data ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (모든 사용자 허용)
CREATE POLICY "Allow public read access" ON calenda_data
  FOR SELECT USING (true);
`;

async function createTable() {
  console.log("📦 테이블 생성 중...\n");

  // Supabase SQL API endpoint
  const endpoint = `${supabaseUrl}/rest/v1/rpc/`;

  // PostgreSQL 직접 연결을 위해 pg 사용
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ query: SQL }),
  });

  // Supabase는 직접 SQL 실행을 REST API로 지원하지 않음
  // SQL Editor나 psql 직접 연결 필요

  console.log("⚠️  Supabase REST API는 직접 SQL 실행을 지원하지 않습니다.");
  console.log("\n다음 방법 중 하나를 선택하세요:\n");

  console.log("📌 방법 1: Supabase CLI 사용");
  console.log("   npx supabase db push\n");

  console.log("📌 방법 2: SQL Editor 사용 (가장 쉬움)");
  console.log(`   1. ${supabaseUrl.replace(".supabase.co", "")} 대시보드 접속`);
  console.log("   2. SQL Editor 메뉴 클릭");
  console.log("   3. 아래 SQL 복사하여 실행:\n");

  console.log("─".repeat(50));
  console.log(SQL);
  console.log("─".repeat(50));
}

createTable();
