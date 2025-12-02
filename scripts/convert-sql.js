/**
 * MySQL INSERT 문을 PostgreSQL COPY 형식으로 변환
 * 사용법: node scripts/convert-sql.js
 */

const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "../../20080402.sql");
const outputFile = path.join(__dirname, "../supabase/data.csv");

function convertMySQLToCSV() {
  console.log("Reading MySQL dump file...");
  const content = fs.readFileSync(inputFile, "utf-8");

  // INSERT 문만 추출
  const insertRegex = /INSERT INTO calenda_data VALUES \(([^)]+)\);/g;
  const rows = [];
  let match;

  while ((match = insertRegex.exec(content)) !== null) {
    const values = match[1];
    // 값 파싱 (쉼표로 분리하되, 따옴표 안의 쉼표는 무시)
    const parsed = parseValues(values);
    rows.push(parsed);
  }

  console.log(`Found ${rows.length} records`);

  // CSV 헤더
  const headers = [
    "cd_no",
    "cd_sgi",
    "cd_sy",
    "cd_sm",
    "cd_sd",
    "cd_ly",
    "cd_lm",
    "cd_ld",
    "cd_hyganjee",
    "cd_kyganjee",
    "cd_hmganjee",
    "cd_kmganjee",
    "cd_hdganjee",
    "cd_kdganjee",
    "cd_hweek",
    "cd_kweek",
    "cd_stars",
    "cd_moon_state",
    "cd_moon_time",
    "cd_leap_month",
    "cd_month_size",
    "cd_hterms",
    "cd_kterms",
    "cd_terms_time",
    "cd_keventday",
    "cd_ddi",
    "cd_sol_plan",
    "cd_lun_plan",
    "holiday",
  ];

  // CSV 생성
  const csvLines = [headers.join(",")];

  for (const row of rows) {
    const csvRow = row.map((val, idx) => {
      // NULL 처리
      if (val === "NULL" || val === "'NULL'" || val === null) {
        return "";
      }
      // 따옴표 제거
      let cleaned = val.replace(/^'|'$/g, "");
      // CSV 이스케이프 (쌍따옴표 포함 시)
      if (cleaned.includes(",") || cleaned.includes('"')) {
        cleaned = `"${cleaned.replace(/"/g, '""')}"`;
      }
      return cleaned;
    });
    csvLines.push(csvRow.join(","));
  }

  fs.writeFileSync(outputFile, csvLines.join("\n"), "utf-8");
  console.log(`CSV file created: ${outputFile}`);
  console.log(`Total records: ${rows.length}`);
}

function parseValues(valuesStr) {
  const result = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];

    if (char === "'" && valuesStr[i - 1] !== "\\") {
      inQuote = !inQuote;
      current += char;
    } else if (char === "," && !inQuote) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

convertMySQLToCSV();
