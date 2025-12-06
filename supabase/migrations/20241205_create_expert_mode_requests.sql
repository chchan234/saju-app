-- 전문가 모드 신청 테이블 생성
-- Supabase SQL Editor에서 실행

CREATE TABLE IF NOT EXISTS expert_mode_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 신청자 정보
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- 본인 사주 정보
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER DEFAULT 12,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
  is_lunar BOOLEAN DEFAULT FALSE,
  is_leap_month BOOLEAN DEFAULT FALSE,

  -- 추가 정보
  relationship_status VARCHAR(20) DEFAULT 'solo' CHECK (relationship_status IN ('solo', 'dating', 'married', 'divorced')),
  occupation_status VARCHAR(20) DEFAULT 'employee' CHECK (occupation_status IN ('student', 'jobseeker', 'employee', 'business', 'freelance', 'homemaker')),
  has_children BOOLEAN DEFAULT FALSE,

  -- 상대방 사주 정보 (궁합용, JSONB로 저장)
  partner_info JSONB DEFAULT NULL,

  -- 상태 관리
  pdf_status VARCHAR(20) DEFAULT 'pending' CHECK (pdf_status IN ('pending', 'generating', 'completed', 'failed')),
  pdf_url TEXT DEFAULT NULL,
  email_status VARCHAR(20) DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed')),
  email_sent_at TIMESTAMPTZ DEFAULT NULL,

  -- 분석 결과 (JSON으로 저장, PDF 생성 시 사용)
  analysis_result JSONB DEFAULT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_created_at ON expert_mode_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_email ON expert_mode_requests(email);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_pdf_status ON expert_mode_requests(pdf_status);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_email_status ON expert_mode_requests(email_status);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_expert_mode_requests_updated_at ON expert_mode_requests;
CREATE TRIGGER update_expert_mode_requests_updated_at
  BEFORE UPDATE ON expert_mode_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 정책
ALTER TABLE expert_mode_requests ENABLE ROW LEVEL SECURITY;

-- 서비스 롤은 모든 작업 허용
CREATE POLICY "Service role can do all" ON expert_mode_requests
  FOR ALL
  USING (auth.role() = 'service_role');

-- 익명 사용자는 INSERT만 허용 (신청)
CREATE POLICY "Anonymous can insert" ON expert_mode_requests
  FOR INSERT
  WITH CHECK (true);
