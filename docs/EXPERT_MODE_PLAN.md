# 정통사주 전문가 모드 개발 계획서

## 프로젝트 개요

- **목표**: 180~250페이지 분량의 전문가 수준 사주 해석 PDF 제공
- **타겟**: 심층적인 사주 분석을 원하는 사용자
- **운영 방식**: 수동 결제 + 관리자 PDF 발송 시스템
- **핵심 차별점**:
  - 관계 상태별 맞춤 콘텐츠 (솔로/연애중/기혼/이혼사별)
  - 성별 분기 해석 (관성/재성 남녀 차이)
  - 직업 상태별 분기 (학생/직장인/사업자/프리랜서)
  - 전문 용어 해설 시스템 (툴팁 + 한자 병기)
  - 18개 챕터 + 부록 구성

---

## 서비스 흐름

### 사용자 흐름
```
전문가 모드 페이지 접속
→ 계좌 정보 확인 후 입금
→ 사주 정보 + 이메일 + 추가정보 입력
→ 신청 완료 (DB 저장 + PDF 자동 생성)
→ 이메일로 PDF 수신 대기
```

### 관리자 흐름
```
가족 통합서비스 페이지에서 시크릿 진입
→ 비밀번호 입력
→ 어드민 페이지 접속
→ 신청 목록 확인 (PDF 생성 완료 상태)
→ 보내기 버튼 클릭
→ 신청자 이메일로 PDF 자동 발송
```

### 시크릿 어드민 진입 조건
| 필드 | 값 |
|------|-----|
| 이름 | `admin` |
| 성별 | `남성` |
| 음력 | `체크` |
| 윤달 | `체크` |
| 날짜 | **비어있음** |
| 액션 | `가족운세 확인하기` 버튼 클릭 |

→ 비밀번호 입력 페이지로 이동
→ 비밀번호 일치 시 어드민 페이지로 이동

---

## 진행 현황

| Phase | 상태 | 파일 | 마지막 업데이트 |
|-------|------|------|----------------|
| 1 | ✅ 완료 | `src/types/saju.ts`, `src/types/expert.ts` | 2024-12 |
| 2 | ✅ 완료 | `src/lib/expert/chapter1-myeongshik.ts` | 2024-12 |
| 3 | ✅ 완료 | `src/lib/expert/chapter2-eumyang-oheng.ts` | 2024-12 |
| 4 | ✅ 완료 | `src/lib/expert/chapter3-sipseong.ts` | 2024-12 |
| 5 | ✅ 완료 | `src/lib/expert/chapter4-geokguk.ts` | 2024-12 |
| 6 | ✅ 완료 | `src/lib/expert/chapter5-sinsal.ts` | 2024-12 |
| 7 | ✅ 완료 | `src/lib/expert/chapter6-sipi-unseong.ts` | 2024-12 |
| 8 | ✅ 완료 | `src/lib/expert/chapter7-daeun.ts` | 2024-12 |
| 9 | ✅ 완료 | `src/lib/expert/chapter8-yearly.ts` | 2024-12 |
| 10 | ✅ 완료 | `src/lib/expert/chapter9-wealth.ts` | 2024-12 |
| 11 | ✅ 완료 | `src/lib/expert/chapter10-career.ts` | 2024-12 |
| 12 | ✅ 완료 | `src/lib/expert/chapter11-health.ts` | 2024-12 |
| 13 | ✅ 완료 | `src/lib/expert/chapter12-love-style.ts` | 2024-12 |
| 14 | ✅ 완료 | `src/lib/expert/chapter13-relationship.ts` | 2024-12 |
| 15 | ✅ 완료 | `src/lib/expert/chapter14-marriage.ts` | 2024-12 |
| 16 | ✅ 완료 | `src/lib/expert/chapter15-family.ts` | 2024-12 |
| 17 | ✅ 완료 | `src/lib/expert/chapter16-compatibility.ts` | 2024-12 |
| 18 | ✅ 완료 | `src/lib/expert/chapter17-warning.ts` | 2024-12 |
| 19 | ✅ 완료 | `src/lib/expert/chapter18-study.ts` | 2024-12 |
| 20 | 🔲 대기 | 사용자용 전문가 모드 신청 페이지 | - |
| 21 | 🔲 대기 | 어드민 시크릿 진입 + 비밀번호 페이지 | - |
| 22 | 🔲 대기 | 어드민 페이지 (신청 목록 + 발송) | - |
| 23 | 🔲 대기 | PDF 생성 시스템 | - |
| 24 | 🔲 대기 | 이메일 발송 시스템 | - |

---

## 전체 목차 구조 (18개 챕터)

| 장 | 제목 | 분량 | 분기 조건 | 상태 |
|----|------|------|----------|------|
| 1 | 기본 명식 분석 | 15~20p | 공통 | ✅ |
| 2 | 음양오행 분석 | 15~20p | 공통 | ✅ |
| 3 | 십성(十星) 분석 | 20~25p | **성별 분기** | ✅ |
| 4 | 격국(格局) 분석 | 15~20p | 공통 | ✅ |
| 5 | 살(煞)과 귀인(貴人) | 15~20p | 공통 | ✅ |
| 6 | 십이운성 분석 | 10~15p | 공통 | ✅ |
| 7 | 대운수(大運數) 풀이 | 20~25p | 공통 | ✅ |
| 8 | 연도별 운세 (세운) | 15~20p | 공통 | ✅ |
| 9 | 금전운(재물운) | 20~25p | 공통 | ✅ |
| 10 | 직업운 | 15~20p | **직업상태별 분기** | ✅ |
| 11 | 건강운 | 10~15p | **연령대별 조언** | ✅ |
| 12 | 연애 성향 분석 | 15~20p | 공통 | ✅ |
| 13 | 인연과 관계의 흐름 | 25~35p | **관계상태별 분기** | ✅ |
| 14 | 결혼운 심층 분석 | 20~30p | **관계상태별 분기** | ✅ |
| 15 | 가족 관계 운 | 10~15p | **자녀유무 분기** | ✅ |
| 16 | 궁합 분석 | 25~35p | 2인 입력 시만 | ✅ |
| 17 | 주의 시기·개운 | 10~15p | 공통 | ✅ |
| 18 | 학업/자격증 운 | 10p | **학생/취준생용** | ✅ |
| 부록 | 용어 사전/메모/FAQ | 5~10p | 공통 | 🔲 |
| **총합** | | **180~250p** | | |

---

## 남은 Phase 상세 (20-24)

### Phase 20: 사용자용 전문가 모드 신청 페이지

**파일**: `src/app/expert/page.tsx`

**구성 요소**:
- 서비스 소개 섹션 (180~250페이지 전문 분석 설명)
- 계좌 정보 안내 (입금 계좌, 금액)
- 신청 폼:
  - 본인 사주 정보 (이름, 생년월일시, 성별, 음력/양력)
  - 상대방 사주 정보 (궁합 원할 경우, 선택)
  - 추가 정보 (관계상태, 직업상태, 자녀유무)
  - 이메일 주소 (PDF 수신용)
- 신청 완료 시 DB 저장
- 신청 시 자동으로 18개 챕터 분석 + PDF 생성 트리거

---

### Phase 21: 어드민 시크릿 진입 시스템

**수정 파일**: `src/app/family/page.tsx` (또는 해당 가족 통합서비스 페이지)

**구현 내용**:
- 폼 제출 시 시크릿 조건 체크:
  ```typescript
  if (
    name === 'admin' &&
    gender === 'male' &&
    isLunar === true &&
    isLeapMonth === true &&
    !birthDate  // 날짜 비어있음
  ) {
    // 비밀번호 입력 페이지로 이동
    router.push('/admin/verify');
  }
  ```

**새 파일**: `src/app/admin/verify/page.tsx`
- 비밀번호 입력 폼
- 환경변수에서 비밀번호 검증 (`ADMIN_PASSWORD`)
- 일치 시 어드민 페이지로 이동
- 불일치 시 에러 메시지

---

### Phase 22: 어드민 페이지

**파일**: `src/app/admin/page.tsx`

**구성 요소**:
- 인증 체크 (비밀번호 검증 완료 세션/토큰 확인)
- 신청 목록 테이블:
  - 신청일시
  - 신청자 이름
  - 이메일
  - 사주 정보 요약
  - PDF 생성 상태 (생성중/완료/실패)
  - 발송 상태 (미발송/발송완료)
  - `보내기` 버튼
- 보내기 클릭 시:
  - 해당 이메일로 PDF 첨부 발송
  - 발송 상태 업데이트

---

### Phase 23: PDF 생성 시스템

**파일**: `src/lib/expert/pdf-generator.ts`

**라이브러리**: `@react-pdf/renderer` 또는 `puppeteer`

**구현 내용**:
- 18개 챕터 분석 결과를 PDF 레이아웃으로 변환
- 페이지 구성:
  - 표지 (사용자 이름, 생년월일, 생성일)
  - 목차
  - 18개 챕터 내용
  - 부록 (용어 사전)
- 한글 폰트 지원 (Noto Sans KR 등)
- 차트/그래프 렌더링 (십이운성 흐름, 오행 분포 등)

---

### Phase 24: 이메일 발송 시스템

**파일**: `src/lib/email/send-pdf.ts`

**라이브러리**: `nodemailer` 또는 `@sendgrid/mail` 또는 `resend`

**구현 내용**:
- PDF 파일 첨부 이메일 발송
- 이메일 템플릿:
  - 제목: "정통사주 전문가 분석 리포트가 도착했습니다"
  - 본문: 간단한 안내 + PDF 첨부
- 발송 성공/실패 로깅
- 어드민 페이지에서 발송 상태 업데이트

---

## 데이터베이스 스키마 (신청 관리용)

```typescript
// Supabase 또는 사용 중인 DB

interface ExpertModeRequest {
  id: string;
  createdAt: Date;

  // 신청자 정보
  name: string;
  email: string;

  // 본인 사주
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  gender: 'male' | 'female';
  isLunar: boolean;
  isLeapMonth: boolean;

  // 추가 정보
  relationshipStatus: RelationshipStatus;
  occupationStatus: OccupationStatus;
  hasChildren: boolean;

  // 상대방 사주 (궁합용, 선택)
  partnerInfo?: {
    name: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    gender: 'male' | 'female';
    isLunar: boolean;
    isLeapMonth: boolean;
  };

  // 상태 관리
  pdfStatus: 'pending' | 'generating' | 'completed' | 'failed';
  pdfUrl?: string;  // 생성된 PDF 저장 경로
  emailStatus: 'pending' | 'sent' | 'failed';
  emailSentAt?: Date;
}
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14+ (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 데이터베이스 | Supabase (PostgreSQL) |
| PDF 생성 | @react-pdf/renderer 또는 puppeteer |
| 이메일 발송 | Resend 또는 Nodemailer |
| 파일 저장 | Supabase Storage 또는 S3 |

---

## 예상 작업량

| Phase | 내용 | 복잡도 | 상태 |
|-------|------|--------|------|
| 1-19 | 18개 챕터 분석 로직 | - | ✅ 완료 |
| 20 | 사용자 신청 페이지 | 중간 | 🔲 |
| 21 | 시크릿 진입 + 비밀번호 | 낮음 | 🔲 |
| 22 | 어드민 페이지 | 중간 | 🔲 |
| 23 | PDF 생성 시스템 | 높음 | 🔲 |
| 24 | 이메일 발송 시스템 | 중간 | 🔲 |

**진행률**: 79% 완료 (19/24 phases)

---

## 다음 단계

**Phase 20 (사용자 신청 페이지)부터 순차 진행**

우선순위:
1. Phase 21: 시크릿 진입 시스템 (빠르게 구현 가능)
2. Phase 22: 어드민 페이지 골격
3. Phase 20: 사용자 신청 페이지
4. Phase 23: PDF 생성
5. Phase 24: 이메일 발송
