-- 만세력 데이터 테이블 (Supabase PostgreSQL용)
-- 원본: MySQL 스키마를 PostgreSQL로 변환

-- 테이블 생성
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

-- 인덱스 생성 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_calenda_solar ON calenda_data (cd_sy, cd_sm, cd_sd);
CREATE INDEX IF NOT EXISTS idx_calenda_lunar ON calenda_data (cd_ly, cd_lm, cd_ld, cd_leap_month);
CREATE INDEX IF NOT EXISTS idx_calenda_terms ON calenda_data (cd_kterms);
CREATE INDEX IF NOT EXISTS idx_calenda_year ON calenda_data (cd_sy);

-- Row Level Security (RLS) 설정
ALTER TABLE calenda_data ENABLE ROW LEVEL SECURITY;

-- 읽기 전용 정책 (모든 사용자 조회 허용)
CREATE POLICY "Allow public read access" ON calenda_data
  FOR SELECT USING (true);

-- 테이블 코멘트
COMMENT ON TABLE calenda_data IS '만세력 데이터 (1900-2100)';
COMMENT ON COLUMN calenda_data.cd_no IS '시퀀스';
COMMENT ON COLUMN calenda_data.cd_sgi IS '단기년도';
COMMENT ON COLUMN calenda_data.cd_sy IS '양력 년도';
COMMENT ON COLUMN calenda_data.cd_sm IS '양력 월';
COMMENT ON COLUMN calenda_data.cd_sd IS '양력 일';
COMMENT ON COLUMN calenda_data.cd_ly IS '음력 년도';
COMMENT ON COLUMN calenda_data.cd_lm IS '음력 월';
COMMENT ON COLUMN calenda_data.cd_ld IS '음력 일';
COMMENT ON COLUMN calenda_data.cd_hyganjee IS '년간지 (한문) - 입춘 기준';
COMMENT ON COLUMN calenda_data.cd_kyganjee IS '년간지 (한글) - 입춘 기준';
COMMENT ON COLUMN calenda_data.cd_hmganjee IS '월간지 (한문) - 절기 기준';
COMMENT ON COLUMN calenda_data.cd_kmganjee IS '월간지 (한글) - 절기 기준';
COMMENT ON COLUMN calenda_data.cd_hdganjee IS '일간지 (한문)';
COMMENT ON COLUMN calenda_data.cd_kdganjee IS '일간지 (한글)';
COMMENT ON COLUMN calenda_data.cd_hweek IS '요일 (한문)';
COMMENT ON COLUMN calenda_data.cd_kweek IS '요일 (한글)';
COMMENT ON COLUMN calenda_data.cd_stars IS '28수';
COMMENT ON COLUMN calenda_data.cd_moon_state IS '월령 (삭/망)';
COMMENT ON COLUMN calenda_data.cd_moon_time IS '삭/망 시간';
COMMENT ON COLUMN calenda_data.cd_leap_month IS '윤달 (0:평달, 1:윤달)';
COMMENT ON COLUMN calenda_data.cd_month_size IS '달 크기 (0:소월29일, 1:대월30일)';
COMMENT ON COLUMN calenda_data.cd_hterms IS '24절기 (한문)';
COMMENT ON COLUMN calenda_data.cd_kterms IS '24절기 (한글)';
COMMENT ON COLUMN calenda_data.cd_terms_time IS '절입시간';
COMMENT ON COLUMN calenda_data.cd_keventday IS '특정 기념일';
COMMENT ON COLUMN calenda_data.cd_ddi IS '띠';
COMMENT ON COLUMN calenda_data.cd_sol_plan IS '양력 기념일';
COMMENT ON COLUMN calenda_data.cd_lun_plan IS '음력 기념일';
COMMENT ON COLUMN calenda_data.holiday IS '공휴일 (0:아님, 1:공휴일)';

-- --------------------------------------------------
-- 사주 조회수 테이블 (공개 API용, 단일 행)
CREATE TABLE IF NOT EXISTS saju_view_count (
  id SMALLINT PRIMARY KEY DEFAULT 1,
  count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  CONSTRAINT saju_view_count_single_row CHECK (id = 1)
);

-- RLS 활성화
ALTER TABLE saju_view_count ENABLE ROW LEVEL SECURITY;

-- 익명 조회 허용 (GET /api/saju/count)
CREATE POLICY "Allow public read saju_view_count" ON saju_view_count
  FOR SELECT USING (true);

-- 서비스 롤만 업데이트 가능 (POST /api/saju 내부 카운트 증가)
CREATE POLICY "Allow service role update saju_view_count" ON saju_view_count
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 초기 행 생성 (없으면 삽입)
INSERT INTO saju_view_count (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
