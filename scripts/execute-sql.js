/**
 * PostgreSQL 직접 연결로 테이블 생성
 */

require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Supabase 데이터베이스 연결 정보
// 직접 연결을 위해서는 Dashboard > Settings > Database 에서 Connection string 확인 필요
// 또는 pooler 사용

async function main() {
  const projectRef = "ezuuluufeozrrcrqxyuc";
  
  // Supabase Pooler 연결 (Transaction mode)
  // Password는 프로젝트 생성시 설정한 DB 비밀번호
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.log("⚠️  DATABASE_URL 환경 변수가 필요합니다.");
    console.log("\nSupabase Dashboard에서 연결 문자열을 확인하세요:");
    console.log("1. Settings > Database 메뉴");
    console.log("2. Connection string > URI 복사");
    console.log("3. .env.local에 DATABASE_URL=postgresql://... 추가");
    console.log("\n또는 아래 방법을 사용하세요:");
    console.log("\n📌 SQL Editor 직접 사용 (가장 쉬움):");
    console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql`);
    console.log("\n아래 SQL을 복사해서 실행하세요:");
    console.log("─".repeat(50));
    
    const schema = fs.readFileSync(
      path.join(__dirname, "../supabase/schema.sql"),
      "utf-8"
    );
    console.log(schema);
    return;
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log("✅ 데이터베이스 연결 성공");

    const schema = fs.readFileSync(
      path.join(__dirname, "../supabase/schema.sql"),
      "utf-8"
    );

    await client.query(schema);
    console.log("✅ 테이블 생성 완료");
  } catch (err) {
    console.error("❌ 오류:", err.message);
  } finally {
    await client.end();
  }
}

main();
