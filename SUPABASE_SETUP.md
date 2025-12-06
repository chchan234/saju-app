# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `saju-app` (원하는 이름)
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: Northeast Asia (Tokyo) - 한국에서 가장 빠름
4. "Create new project" 클릭 후 생성 완료까지 대기 (~2분)

## 2. 환경 변수 설정

1. Supabase Dashboard > Settings > API 로 이동
2. 다음 값들을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIs...`

3. `.env.local` 파일 생성:
```bash
cp .env.example .env.local
```

4. `.env.local` 파일 편집:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. 테이블 생성

1. Supabase Dashboard > SQL Editor 로 이동
2. "New query" 클릭
3. `supabase/schema.sql` 파일 내용을 복사하여 붙여넣기
4. "Run" 클릭

### 3-1. 조회수 테이블 RLS 확인
- 위 `schema.sql`에 `saju_view_count` 테이블과 RLS 정책이 포함되어 있습니다.
- 기존에 테이블을 만들어 둔 경우 아래 쿼리로 RLS를 켜고 정책을 추가하세요.

```sql
ALTER TABLE public.saju_view_count ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read saju_view_count" ON public.saju_view_count
  FOR SELECT USING (true);

CREATE POLICY "Allow service role update saju_view_count" ON public.saju_view_count
  FOR UPDATE USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

INSERT INTO public.saju_view_count (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
```

## 4. 데이터 가져오기

### 방법 1: CSV 업로드 (권장)

1. CSV 파일 생성:
```bash
node scripts/convert-sql.js
```

2. Supabase Dashboard > Table Editor > calenda_data 테이블 선택
3. "Insert" > "Import data from CSV" 클릭
4. `supabase/data.csv` 파일 업로드

### 방법 2: SQL 직접 실행 (대용량 주의)

⚠️ 73,000+ 레코드로 인해 시간이 오래 걸릴 수 있습니다.

1. SQL Editor에서 INSERT 문 직접 실행
2. 또는 Supabase CLI 사용:
```bash
supabase db push
```

## 5. 데이터 확인

SQL Editor에서 테스트 쿼리 실행:

```sql
-- 전체 레코드 수 확인
SELECT COUNT(*) FROM calenda_data;

-- 특정 날짜 조회 테스트
SELECT * FROM calenda_data
WHERE cd_sy = 1990 AND cd_sm = 1 AND cd_sd = 1;

-- 입춘 날짜 확인
SELECT * FROM calenda_data
WHERE cd_kterms = '입춘' AND cd_sy = 2024;
```

## 6. API 테스트

개발 서버 재시작 후 API 테스트:

```bash
npm run dev
```

브라우저에서 `http://localhost:3001` 접속 후 폼 제출 테스트.

## 문제 해결

### RLS 정책 오류
```sql
-- RLS가 활성화되어 있지만 정책이 없는 경우
CREATE POLICY "Allow public read access" ON calenda_data
  FOR SELECT USING (true);
```

### 한글 인코딩 문제
CSV 파일이 UTF-8로 저장되어 있는지 확인하세요.

### 타임아웃 오류
대용량 데이터 삽입 시 배치 처리를 권장합니다.
