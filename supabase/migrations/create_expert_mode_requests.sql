-- expert_mode_requests 테이블 생성
-- Supabase Dashboard SQL Editor에서 실행하세요

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

-- RLS 정책 설정 (서비스 역할만 접근 가능)
ALTER TABLE expert_mode_requests ENABLE ROW LEVEL SECURITY;

-- 서비스 역할에 대한 정책 (모든 작업 허용)
CREATE POLICY "Allow service role full access" ON expert_mode_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_created_at ON expert_mode_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_pdf_status ON expert_mode_requests(pdf_status);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_email_status ON expert_mode_requests(email_status);
