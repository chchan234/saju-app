/**
 * Supabase 데이터베이스 설정 스크립트
 * - 테이블 생성
 * - CSV 데이터 업로드
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

async function createTable() {
  console.log("📦 테이블 생성 중...");

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS calenda_data (
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
  `;

  const { error } = await supabase.rpc("exec_sql", { sql: createTableSQL });

  if (error) {
    // RPC가 없으면 REST API로 직접 실행
    console.log("ℹ️  RPC 사용 불가, REST API로 시도...");
    return false;
  }

  console.log("✅ 테이블 생성 완료");
  return true;
}

async function importData() {
  console.log("📊 데이터 가져오는 중...");

  const csvPath = path.join(__dirname, "../supabase/data.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",");

  console.log(`총 ${lines.length - 1} 레코드 처리 예정`);

  const batchSize = 500;
  let processed = 0;
  let errors = 0;

  for (let i = 1; i < lines.length; i += batchSize) {
    const batch = [];
    const end = Math.min(i + batchSize, lines.length);

    for (let j = i; j < end; j++) {
      if (!lines[j].trim()) continue;

      const values = parseCSVLine(lines[j]);
      if (values.length !== headers.length) continue;

      const record = {};
      headers.forEach((header, idx) => {
        let value = values[idx];
        // 빈 문자열은 null로
        if (value === "" || value === "NULL") {
          record[header] = null;
        } else if (
          ["cd_no", "cd_sgi", "cd_sy", "cd_sm", "cd_sd", "cd_ly", "cd_lm", "cd_ld", "cd_leap_month", "cd_month_size", "holiday"].includes(header)
        ) {
          record[header] = parseInt(value, 10);
        } else {
          record[header] = value;
        }
      });

      // cd_no는 자동 생성되므로 제외
      delete record.cd_no;
      batch.push(record);
    }

    if (batch.length > 0) {
      const { error } = await supabase.from("calenda_data").insert(batch);

      if (error) {
        console.error(`❌ 배치 ${Math.floor(i / batchSize) + 1} 오류:`, error.message);
        errors++;
      } else {
        processed += batch.length;
        const progress = ((processed / (lines.length - 1)) * 100).toFixed(1);
        process.stdout.write(`\r⏳ 진행률: ${progress}% (${processed}/${lines.length - 1})`);
      }
    }
  }

  console.log(`\n✅ 데이터 업로드 완료: ${processed}건 성공, ${errors}건 오류`);
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

async function createIndexes() {
  console.log("🔍 인덱스 생성 중...");

  // 인덱스는 supabase client로 직접 생성 불가
  // SQL Editor에서 수동으로 실행 필요
  console.log("ℹ️  인덱스는 Supabase SQL Editor에서 수동으로 생성해주세요:");
  console.log("   CREATE INDEX idx_calenda_solar ON calenda_data (cd_sy, cd_sm, cd_sd);");
}

async function main() {
  console.log("🚀 Supabase 데이터베이스 설정 시작\n");

  // 테이블 존재 여부 확인
  const { data, error } = await supabase
    .from("calenda_data")
    .select("cd_no")
    .limit(1);

  if (error && error.code === "42P01") {
    console.log("⚠️  테이블이 없습니다. Supabase SQL Editor에서 먼저 테이블을 생성해주세요.");
    console.log("📝 supabase/schema.sql 파일의 내용을 실행하세요.");
    return;
  }

  if (data && data.length > 0) {
    console.log("ℹ️  이미 데이터가 존재합니다. 업로드를 건너뜁니다.");

    const { count } = await supabase
      .from("calenda_data")
      .select("*", { count: "exact", head: true });

    console.log(`📊 현재 레코드 수: ${count}`);
    return;
  }

  // 데이터 업로드
  await importData();
  await createIndexes();

  console.log("\n🎉 설정 완료!");
}

main().catch(console.error);
