/**
 * Supabase 연결 테스트 스크립트
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("🔗 Supabase 연결 테스트");
console.log("URL:", supabaseUrl);
console.log("Key:", supabaseKey ? "✅ 설정됨" : "❌ 없음");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // 테이블 존재 여부 확인
    const { data, error } = await supabase
      .from("calenda_data")
      .select("cd_no")
      .limit(1);

    if (error) {
      if (error.code === "42P01") {
        console.log("⚠️  calenda_data 테이블이 없습니다.");
        console.log("📝 Supabase SQL Editor에서 schema.sql을 실행해주세요.");
      } else {
        console.error("❌ 오류:", error.message);
      }
      return;
    }

    if (data && data.length > 0) {
      console.log("✅ 연결 성공! 테이블에 데이터가 있습니다.");

      // 데이터 개수 확인
      const { count } = await supabase
        .from("calenda_data")
        .select("*", { count: "exact", head: true });

      console.log(`📊 총 레코드 수: ${count}`);
    } else {
      console.log("✅ 연결 성공! 테이블은 있지만 데이터가 비어있습니다.");
      console.log("📝 CSV 파일을 업로드해주세요.");
    }
  } catch (err) {
    console.error("❌ 연결 실패:", err.message);
  }
}

testConnection();
