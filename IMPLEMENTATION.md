# 사주팔자 웹앱 구현 문서

## 프로젝트 개요

Next.js 16 + Supabase 기반 사주팔자 분석 웹 애플리케이션

### 기술 스택
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Card, Badge, Button, Input, Label, Tabs)
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Data**: 만세력 데이터 73,442건 (1900-2100년)

---

## 구현 완료 기능

### 1. 사주팔자 계산 (`/api/saju`)

**파일**: `src/lib/saju-calculator.ts`

#### 핵심 기능
- 년주, 월주, 일주, 시주 계산
- 천간/지지 오행 매핑
- 음양 판별
- 십신 계산 (일간 기준)
- 오행 개수 분석
- 보충 오행(용신) 추천

#### 시주 계산 로직
```typescript
// 일간에 따른 시주 천간 결정
갑/기일 → 갑자시 시작
을/경일 → 병자시 시작
병/신일 → 무자시 시작
정/임일 → 경자시 시작
무/계일 → 임자시 시작
```

#### 십신 계산
- 10천간 × 10천간 = 100가지 십신 매핑
- 지지는 본기(本氣) 기준으로 십신 계산
- **모든 기둥에 십신 계산** (년주, 월주, 일주, 시주)

```typescript
// 각 기둥 생성 시 일간(ilgan)을 전달하여 십신 계산
const yearPillar = createPillar(yearGanji, ilgan);
const monthPillar = createPillar(monthGanji, ilgan);
const dayPillar = createPillar(dayGanji, ilgan);  // 일주도 십신 필요
const timePillar = createPillar(timeGanji, ilgan);
```

> **버그 수정**: 기존에 일주 생성 시 `createPillar(dayGanji)` 형태로 호출하여 십신이 계산되지 않았던 문제를 `createPillar(dayGanji, ilgan)`으로 수정

### 2. 띠 계산 (이중 기준)

**배경**: 띠 계산에는 두 가지 기준이 있음
- **음력 설날 기준**: 일반적으로 사용하는 띠
- **입춘 기준**: 사주학에서 사용하는 띠

**구현**:
```typescript
meta: {
  ddi: string;       // 입춘 기준 띠 (사주용) - DB에서 조회
  ddiLunar: string;  // 음력 기준 띠 (일반용) - 음력년도 % 12로 계산
}
```

**UI 표시**: 두 띠가 다를 경우 둘 다 표시
```
띠: 쥐띠 (음력 기준)
사주 띠: 소띠 (입춘 기준)
```

### 3. 시간 모름 처리

**기능**: 태어난 시간을 모르는 경우 시주 없이 삼주(三柱)로 분석

#### 구현 흐름
```
SajuForm (hour="unknown")
  → URL param: timeUnknown=true
  → result/page.tsx에서 읽기
  → API 호출 시 timeUnknown: true 전달
  → saju-calculator에서 시주 빈 값으로 처리
  → SajuResult에서 시주 숨김
```

#### 주요 변경사항

**1. SajuForm.tsx** - URL 파라미터 추가
```typescript
const navigateToResult = (person: PersonData) => {
  const isTimeUnknown = person.hour === "unknown";
  const params = new URLSearchParams({
    // ...기존 파라미터
    ...(isTimeUnknown && { timeUnknown: "true" }),
  });
};
```

**2. result/page.tsx** - timeUnknown 상태 관리
```typescript
const [timeUnknown, setTimeUnknown] = useState(false);
const isTimeUnknown = searchParams.get("timeUnknown") === "true";
setTimeUnknown(isTimeUnknown);
// API 호출 시 포함
body: JSON.stringify({ ...params, timeUnknown: isTimeUnknown })
// 컴포넌트에 전달
<SajuResult result={result} name={name} timeUnknown={timeUnknown} />
```

**3. saju-calculator.ts** - 시주 및 오행 계산
```typescript
export function calculateSaju(
  calendaData: CalendaData,
  birthHour: number,
  birthMinute: number,
  timeUnknown: boolean = false  // 새 파라미터
): SajuApiResult {
  // 시주: 시간 모름이면 빈 기둥
  const timePillar = timeUnknown
    ? createPillar("", ilgan)
    : createPillar(timeGanji, ilgan);

  // 오행 카운트: 시간 모름이면 시주 제외 (6글자)
  const pillarsForCount = timeUnknown
    ? [yearPillar, monthPillar, dayPillar]
    : [yearPillar, monthPillar, dayPillar, timePillar];
}
```

**4. SajuResult.tsx** - 조건부 렌더링
```typescript
interface SajuResultProps {
  result: SajuApiResult & { analysis?: {...} };
  name?: string;
  timeUnknown?: boolean;  // 새 prop
}

// 시간 표시
<span>{timeUnknown ? "모름" : `${hour}:${minute.toString().padStart(2, "0")}`}</span>

// 시주 카드 조건부 렌더링
{!timeUnknown && <PillarCard pillar={timePillar} label="시주" />}
```

#### 오행 분석 차이
| 구분 | 시간 알 때 | 시간 모를 때 |
|------|-----------|-------------|
| 분석 기둥 | 4주 (팔자) | 3주 (삼주) |
| 오행 글자 | 8글자 | 6글자 |
| 시주 표시 | O | X |

---

### 4. 오행 분석

#### 오행 개수 계산
- 시간 알 때: 4주 × 2(천간+지지) = 8글자의 오행 집계
- 시간 모를 때: 3주 × 2(천간+지지) = 6글자의 오행 집계
- 목, 화, 토, 금, 수 각각의 개수

#### 동점 처리
- 가장 많은/적은 오행이 동점일 경우 모두 표시
```typescript
const maxOhengList = sortedOheng.filter(([_, count]) => count === maxCount);
const minOhengList = sortedOheng.filter(([_, count]) => count === minCount);
```

#### 보충 오행(용신) 추천 로직
```typescript
// 우선순위:
// 1. 없는 오행(0개)이 있으면 그것을 추천
// 2. 없는 게 없으면 가장 적은 오행 추천
```

### 5. 성향 분석 템플릿

**파일**: `src/lib/saju-traits.ts`

#### 일간별 성향 (10천간)
각 일간에 대해 다음 정보 제공:
- 한자/오행/음양
- 상징 (예: 갑 = 큰 나무)
- 성향 타입 (예: "개척자형 리더")
- 핵심 키워드 4개
- 강점 5개
- 약점 4개
- 상세 성향: 성격, 의사결정, 대인관계, 업무, 연애, 스트레스 패턴
- 발전 조언

#### 오행별 생활 조언 (5행)
각 오행에 대해 다음 정보 제공:
- 본성 설명
- 추천 색상, 방향, 계절
- 행운의 숫자
- 추천 직업/분야
- 좋은 습관 / 피해야 할 것
- 건강 관리 포인트
- 추천 아이템, 음식

### 7. 분석 강화 데이터 (`saju-analysis-data.ts`)

**파일**: `src/lib/saju-analysis-data.ts` (약 1100줄)

#### 60갑자 일주 상징 (`ILJU_SYMBOLS`)
각 일주에 대해 다음 정보 제공:
- `name`: 일주 이름 (예: "갑자")
- `hanja`: 한자 (예: "甲子")
- `nickname`: 별명 (예: "바다 위의 큰 나무")
- `symbol`: 상징 이미지
- `essence`: 본질 설명
- `personality`: 성격 특성
- `lifeTheme`: 인생 주제

```typescript
ILJU_SYMBOLS["갑자"] = {
  name: "갑자",
  hanja: "甲子",
  nickname: "바다 위의 큰 나무",
  symbol: "🌊🌲",
  essence: "넓은 바다 위에 우뚝 선 큰 나무처럼...",
  personality: "진취적이고 개척 정신이 강함",
  lifeTheme: "새로운 시작과 혁신"
}
```

#### 12운성 정보 (`UNSEONG_INFO`)
| 운성 | 의미 | 특성 |
|------|------|------|
| 장생 | 탄생, 시작 | 새로운 시작의 에너지 |
| 목욕 | 성장, 정화 | 성장통과 변화의 시기 |
| 관대 | 활동, 성인 | 사회 진출의 시기 |
| 건록 | 전성, 안정 | 자립과 성취의 시기 |
| 제왕 | 절정, 권위 | 영향력과 통솔의 시기 |
| 쇠 | 전환, 변화 | 성찰과 조정의 시기 |
| 병 | 쇠약, 휴식 | 회복과 재충전의 시기 |
| 사 | 소멸, 마무리 | 정리와 종결의 시기 |
| 묘 | 잠복, 저장 | 준비와 축적의 시기 |
| 절 | 단절, 공허 | 비움과 새 출발 준비 |
| 태 | 잉태, 시작 | 새 생명의 싹틈 |
| 양 | 성장, 준비 | 형체를 갖춰가는 시기 |

#### 오행 보완법 상세 (`OHENG_BOOSTERS`)
각 오행에 대해 다음 정보 제공:
- `color`: 보완 색상
- `direction`: 방향
- `season`: 계절
- `numbers`: 행운 숫자
- `foods`: 추천 음식
- `activities`: 추천 활동
- `careers`: 직업/활동 분야
- `items`: 물건/소품
- `spaces`: 공간/환경
- `habits`: 일상 습관
- `mindset`: 마음가짐
- `warning`: 과잉 시 주의

#### 기둥별 영역 설명 (`PILLAR_MEANINGS`)
| 기둥 | 시간대 | 영역 | 관계 |
|------|--------|------|------|
| 년주 | 출생~15세 | 사회/환경 | 조상/조부모 |
| 월주 | 15~30세 | 성장/직업 | 부모/직장 |
| 일주 | 30~45세 | 본질/결혼 | 본인/배우자 |
| 시주 | 45세 이후 | 말년/결실 | 자녀/제자 |

#### 천간 합/충 정보
**천간 합 (`CHEONGAN_HAP_INFO`)**:
- 갑+기 = 토 (중정지합)
- 을+경 = 금 (인의지합)
- 병+신 = 수 (위엄지합)
- 정+임 = 목 (인수지합)
- 무+계 = 화 (무정지합)

**천간 충 (`CHEONGAN_CHUNG_INFO`)**:
- 갑↔경: 금극목 (권력 충돌)
- 을↔신: 금극목 (섬세한 갈등)
- 병↔임: 수극화 (열정과 냉정)
- 정↔계: 수극화 (감성 충돌)

#### 스토리텔링 생성 함수
```typescript
// 개인용 스토리 인트로
generateStoryIntro(ilgan: string, yongsin: string): string

// 그룹용(커플/가족) 스토리 인트로
generateGroupStoryIntro(memberCount: number, score: number, isFamily?: boolean): string
```

### 8. 커플 궁합 분석 (`/result/couple`)

**파일**: `src/lib/saju-compatibility.ts`

#### 분석 항목

**1. 일간 관계 분석**
- 10×10 천간 조합 (100가지)
- 각 조합별 점수 (50~90점)
- 십신 유형: 비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인
- **긍정 요소**: 서로 도움이 되는 점
- **부정 요소**: 갈등 가능성 (정확한 분석을 위해 부정적 요소도 표시)

```typescript
// 예시: 갑-경 관계 (편관)
{
  score: 50,
  type: "편관",
  description: "긴장과 통제 관계",
  positive: ["서로 자극이 됨", "성장 동력"],
  negative: ["스트레스 많음", "한쪽이 억눌림", "갈등 잦음"]
}
```

**2. 지지 관계 분석**
| 관계 | 의미 | 점수 영향 |
|------|------|----------|
| 육합 | 좋은 조화 | +5점 |
| 충 | 충돌 관계 | -8점 |
| 형 | 갈등 관계 | -5점 |
| 해 | 해로운 관계 | -3점 |

**3. 오행 분석**
- 서로 보완되는 오행 (한쪽 부족 ↔ 다른 쪽 풍부)
- 상극 관계 오행 (목↔토, 화↔금, 토↔수, 금↔목, 수↔화)

#### 점수 및 등급
```typescript
// 점수 범위: 30~100점
if (score >= 85) return "천생연분";
if (score >= 75) return "좋은 인연";
if (score >= 65) return "보통 인연";
if (score >= 55) return "노력 필요";
return "주의 필요";
```

#### UI 구성
1. **두 사람 사주 요약**: 미니 사주 카드 (년월일시 + 오행 분포)
2. **총점 및 등급**: 점수 + 등급 배지
3. **일간 관계**: 십신 유형 및 설명
4. **지지 관계**: 육합/충/형/해 배지
5. **강점**: 긍정적 요소 목록
6. **주의점**: 부정적 요소 목록 (정확한 분석 제공)
7. **조언**: 관계별 맞춤 조언

---

### 9. UI 컴포넌트

**파일**: `src/components/saju/SajuResult.tsx`

#### 표시 카드 목록 (개인 결과)
1. **스토리텔링 인트로**: 계절감 있는 맞춤 인사말
2. **기본 정보**: 양력/음력 날짜, 시간, 요일, 띠
3. **일주 상징 카드**: 60갑자 별명, 본질, 성격, 인생 주제
4. **기둥별 영역 설명**: 년주/월주/일주/시주의 인생 영역
5. **사주 기둥**: 년주/월주/일주/시주 시각화 (천간+지지+오행+음양+십신)
6. **천간 관계 분석**: 사주 내 천간 합/충 해석
7. **오행 분석**: 막대 차트 + 분석 결과 (가장 많은/적은 오행, 보충 추천)
8. **오행 보완법 상세**: 음식, 활동, 물건, 공간, 습관 등 실생활 조언
9. **일간 성향 분석**: 핵심 요약, 강점/주의점, 상세 성향 6가지, 조언
10. **보충 오행 생활 조언**: 색상, 방향, 직업, 습관, 건강, 계절, 숫자, 음식
11. **오행 균형 분석**: 강한/약한/없는 오행 표시

#### 커플 결과 추가 카드
- **스토리텔링 인트로**: 궁합 점수 기반 인사말
- **일주 상징 비교**: 두 사람의 60갑자 별명 비교
- **공통 오행 보완 활동**: 함께 할 수 있는 활동/음식

#### 가족 결과 추가 카드
- **스토리텔링 인트로**: 가족 점수 기반 따뜻한 인사말
- **가족 일주 상징**: 모든 구성원의 60갑자 별명
- **가족 오행 보완 활동**: 가족이 함께 할 수 있는 활동/음식

---

## 파일 구조

```
src/
├── app/
│   ├── api/
│   │   └── saju/
│   │       ├── route.ts              # 사주 계산 API
│   │       └── compatibility/
│   │           └── route.ts          # 궁합 분석 API
│   ├── result/
│   │   ├── page.tsx                  # 개인 결과 페이지
│   │   └── couple/
│   │       └── page.tsx              # 커플 궁합 결과 페이지
│   ├── page.tsx                      # 메인 입력 폼
│   └── layout.tsx
├── components/
│   ├── saju/
│   │   ├── SajuForm.tsx              # 생년월일시 입력 폼
│   │   ├── SajuResult.tsx            # 개인 결과 표시 컴포넌트
│   │   └── PersonForm.tsx            # 개인 정보 입력 폼
│   └── ui/                           # shadcn/ui 컴포넌트
├── lib/
│   ├── saju-calculator.ts            # 사주 계산 로직
│   ├── saju-traits.ts                # 성향 분석 템플릿
│   ├── saju-compatibility.ts         # 궁합 분석 로직
│   ├── saju-family.ts                # 가족 분석 로직
│   ├── saju-analysis-data.ts         # 분석 강화 데이터 (60갑자, 12운성, 오행 보완법)
│   └── supabase.ts                   # Supabase 클라이언트
└── types/
    └── saju.ts                       # 타입 정의
```

---

## API 명세

### POST /api/saju

사주팔자 계산

**Request Body**:
```json
{
  "year": 1997,
  "month": 2,
  "day": 5,
  "hour": 12,
  "minute": 0,
  "isLunar": false,
  "isLeapMonth": false,
  "timeUnknown": false
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "yearPillar": { "cheongan": "정", "jiji": "축", ... },
    "monthPillar": { ... },
    "dayPillar": { "cheongan": "무", "jiji": "인", "cheonganSipsin": "비견", "jijiSipsin": "편관", ... },
    "timePillar": { ... },
    "ohengCount": { "목": 2, "화": 2, "토": 3, "금": 0, "수": 1 },
    "yongsin": "금",
    "birthInfo": { ... },
    "meta": { "ddi": "소", "ddiLunar": "쥐", ... },
    "analysis": {
      "ilganTraits": { "type": "든든한 현실주의자", ... },
      "yongsinAdvice": { "colors": ["흰색", "은색"], ... },
      "ohengBalance": { "strong": ["토"], "weak": ["수"], "missing": ["금"], ... }
    }
  }
}
```

### POST /api/saju/compatibility

커플 궁합 분석

**Request Body**:
```json
{
  "person1": { /* SajuApiResult */ },
  "person2": { /* SajuApiResult */ }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalScore": 75,
    "grade": "좋은 인연",
    "gradeDescription": "좋은 궁합입니다. 노력하면 더 좋아질 수 있습니다.",
    "ilganAnalysis": {
      "person1Ilgan": "갑",
      "person2Ilgan": "기",
      "score": 90,
      "type": "정재",
      "description": "안정적인 인연",
      "positive": ["신뢰 기반 관계", "오래 지속됨"],
      "negative": ["변화 없이 지루해질 수 있음"]
    },
    "jijiAnalysis": {
      "yukap": ["인-해 육합"],
      "chung": [],
      "hyung": [],
      "hae": []
    },
    "ohengAnalysis": {
      "person1Strong": ["목", "화"],
      "person1Weak": ["금"],
      "person2Strong": ["금", "토"],
      "person2Weak": ["목"],
      "complementary": ["금 (상대방이 보완)", "목 (본인이 보완)"],
      "conflict": []
    },
    "summary": {
      "strengths": ["신뢰 기반 관계", "지지 육합으로 자연스러운 조화"],
      "weaknesses": ["변화 없이 지루해질 수 있음"],
      "advice": "서로에게 좋은 영향을 주는 관계입니다."
    }
  }
}
```

---

### GET /api/saju

만세력 데이터 조회

**Query Parameters**:
- `year`: 연도
- `month`: 월
- `day`: 일
- `lunar`: "true" | "false"

---

## 데이터베이스

### calenda_data 테이블

만세력 데이터 73,442건 (1900-2100년)

**주요 컬럼**:
| 컬럼 | 설명 |
|------|------|
| cd_sy, cd_sm, cd_sd | 양력 년/월/일 |
| cd_ly, cd_lm, cd_ld | 음력 년/월/일 |
| cd_leap_month | 윤달 여부 (0/1) |
| cd_kyganjee | 년주 간지 (한글) |
| cd_kmganjee | 월주 간지 (한글) |
| cd_kdganjee | 일주 간지 (한글) |
| cd_ddi | 띠 (입춘 기준) |
| cd_kweek | 요일 |
| cd_kterms | 절기 |

---

## 버그 수정 이력

### 2025-12-02

#### 1. 일주 십신 미표시 수정
- **문제**: 일주에 십신(정인, 상관, 편재 등)이 표시되지 않음
- **원인**: `createPillar(dayGanji)` 호출 시 일간(`ilgan`) 파라미터 누락
- **해결**: `createPillar(dayGanji, ilgan)`으로 수정

#### 2. 오행 동점 표시 수정
- **문제**: 가장 많은/적은 오행이 동점일 때 첫 번째만 표시 (예: 목2, 화2, 토2 → 목만 표시)
- **해결**: `filter()`로 동점 오행 모두 추출하여 표시
```typescript
const maxOhengList = sortedOheng.filter(([_, count]) => count === maxCount);
```

#### 3. 용신 로직 개선
- **문제**: 기존 상생 기반 로직이 복잡하고 직관적이지 않음
- **해결**: 단순화된 "보충 오행" 로직으로 변경
  - 없는 오행(0개) 우선 추천
  - 없으면 가장 적은 오행 추천
- **UI 변경**: "추천 용신" → "보충 추천", "용신 해설" → "보충 오행 해설"

#### 4. 시간 모름 처리
- **문제**: "모름" 선택 시 12시로 계산되고 시주가 표시됨
- **해결**:
  - `timeUnknown` 파라미터 전체 흐름 구현
  - 시주 빈 값으로 처리
  - 오행 계산 시 시주 제외 (6글자)
  - UI에서 시주 숨김 및 시간 "모름" 표시

#### 5. 커플 궁합 기능 구현
- **기존**: 커플 탭에서 첫 번째 사람 결과만 표시 (TODO 상태)
- **구현**:
  - `saju-compatibility.ts`: 궁합 분석 로직 (일간/지지/오행 관계)
  - `/result/couple/page.tsx`: 커플 결과 페이지
  - `/api/saju/compatibility`: 궁합 API
  - `SajuForm.tsx`: 커플 라우팅 추가
- **특징**: 긍정/부정 요소 균형 있게 표시 (정확한 분석)

#### 6. 분석 강화 기능 구현 (개인/커플/가족)
- **신규 데이터 파일**: `saju-analysis-data.ts` (약 1100줄)
  - 60갑자 일주 상징 (`ILJU_SYMBOLS`)
  - 12운성 정보 (`UNSEONG_INFO`)
  - 오행 보완법 상세 (`OHENG_BOOSTERS`)
  - 기둥별 영역 설명 (`PILLAR_MEANINGS`)
  - 천간 합/충 정보 (`CHEONGAN_HAP_INFO`, `CHEONGAN_CHUNG_INFO`)
  - 스토리텔링 생성 함수 (`generateStoryIntro`, `generateGroupStoryIntro`)

- **개인 결과 페이지 업데이트** (`SajuResult.tsx`):
  - `StoryIntroCard`: 계절감 있는 맞춤 인사말
  - `IljuSymbolCard`: 일주 상징/별명 표시 (Collapsible)
  - `PillarMeaningsCard`: 기둥별 영역 설명 (Collapsible)
  - `OhengBoosterDetailCard`: 오행 보완법 상세 (음식/활동/물건/공간/습관)
  - `CheonganRelationsCard`: 천간 합/충 분석

- **커플 결과 페이지 업데이트** (`/result/couple/page.tsx`):
  - `CoupleStoryIntroCard`: 궁합 점수 기반 인사말
  - `CoupleIljuCard`: 두 사람의 일주 별명 비교
  - `CoupleOhengAdviceCard`: 공통 오행 보완 활동/음식

- **가족 결과 페이지 업데이트** (`/result/family/page.tsx`):
  - `FamilyStoryIntroCard`: 가족 점수 기반 따뜻한 인사말
  - `FamilyIljuSymbolsCard`: 모든 구성원의 일주 별명
  - `FamilyOhengAdviceCard`: 가족이 함께 할 수 있는 활동/음식

---

## 전문가 분석 PDF 기능 (Expert Mode)

### 개요
전문가 분석 모드는 18개 챕터로 구성된 약 150페이지 분량의 상세 사주 분석 PDF를 생성합니다.

### 구현 완료 기능

#### 1. PDF 레이아웃 시스템
- A4 크기 페이지 분리 (210mm × 297mm)
- 인쇄 최적화 스타일
- 챕터별 페이지 구분

#### 2. PDF 컴포넌트 (`/src/components/expert/`)
- `PdfCoverPage.tsx`: 표지 페이지
- `PdfTableOfContents.tsx`: 목차
- `PdfChapterPage.tsx`: 챕터 페이지 레이아웃
  - `PdfSubtitle`: 소제목
  - `PdfParagraph`: 본문 단락 (들여쓰기 1em)
  - `PdfHighlight`: 강조 텍스트
  - `PdfQuote`: 인용 박스
  - `PdfSimpleTable`: 표
  - `PdfList`: 목록
  - `PdfDivider`: 구분선
  - `PdfInfoBox`: 정보 박스
  - `PdfNarrativeSection`: 서술형 풀이 섹션 ✅ (2025-12-06)
  - `PdfNarrativeSimple`: 간단 서술형 섹션 ✅ (2025-12-06)
- `PdfInfographics.tsx`: 인포그래픽 컴포넌트
  - `PdfSajuChart`: 사주 차트
  - `PdfElementChart`: 오행 분포 차트
  - `PdfYinYangGauge`: 음양 게이지
  - `PdfDaeunTimeline`: 대운 타임라인
  - `PdfYearlyCalendar`: 세운 캘린더
  - `PdfHealthMap`: 건강 바디맵
  - `PdfCompatibilityCard`: 궁합 카드
  - `PdfTenGodsChart`: 십신 분포 차트

#### 3. 챕터 분석 엔진 (`/src/lib/expert/`)
| 챕터 | 파일 | Narrative | 조합 수 | 상태 |
|------|------|-----------|---------|------|
| 1. 명식 | `chapter1-myeongshik.ts` | ✅ | 30조합 (10일간 × 3신강신약) | 완료 |
| 2. 음양오행 | `chapter2-eumyang-oheng.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 3. 십성 | `chapter3-sipseong.ts` | ✅ | 60조합 (10십신 × 2성별 × 3신강신약) | 완료 |
| 4. 격국 | `chapter4-geokguk.ts` | ✅ | 30조합 (10격국 × 3신강신약) | 완료 |
| 5. 신살 | `chapter5-sinsal.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 6. 12운성 | `chapter6-12unseong.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 7. 대운 | `chapter7-daeun.ts` | ✅ | 75조합 (5오행 × 5대운오행 × 3신강신약) | 완료 |
| 8. 세운 | `chapter8-yearly.ts` | ✅ | 75조합 (5오행 × 5세운오행 × 3신강신약) | 완료 |
| 9. 재물운 | `chapter9-wealth.ts` | ✅ | 12조합 (4재물유형 × 3신강신약) | 완료 |
| 10. 직업운 | `chapter10-career.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 11. 건강운 | `chapter11-health.ts` | ✅ | 60조합 (5오행 × 4연령대 × 3신강신약) | 완료 |
| 12. 연애 스타일 | `chapter12-love-style.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 13. 인연의 흐름 | `chapter13-relationship.ts` | ✅ | 60조합 (5오행 × 4관계상태 × 3신강신약) | 완료 |
| 14. 배우자운 | `chapter14-marriage.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 15. 가족 관계 | `chapter15-family.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 16. 궁합 분석 | `chapter16-compatibility.ts` | ✅ | 12조합 (3관계유형 × 4점수대) | 완료 |
| 17. 개운법 | `chapter17-warning.ts` | ✅ | 15조합 (5오행 × 3신강신약) | 완료 |
| 부록 | `appendix.ts` | - | - | 기본 구현 |

**총 조합 수: 489개** (전 챕터 완료)

#### 4. Narrative (서술형 풀이) 시스템
규칙 기반 텍스트 생성 엔진으로, AI 없이 조합별 맞춤 텍스트 생성

**ChapterNarrative 구조**:
```typescript
interface ChapterNarrative {
  intro: string;        // 도입부
  mainAnalysis: string; // 본문 분석
  details?: string[];   // 상세 설명 (선택)
  advice: string;       // 조언
  closing: string;      // 마무리
}
```

**조합 방식**:
- 일간(10) × 오행(5) × 신강신약(3) = 150+ 조합
- 각 조합에 맞는 텍스트 상수 정의
- 동적으로 조합하여 개인화된 풀이 생성

---

## 향후 작업 (Expert Mode)

### 🔴 긴급 (말투 규칙) ⚠️ 중요
모든 narrative 텍스트는 **"~입니다" 체**를 사용합니다.

**올바른 예시:**
- "당신은 ~한 성향을 가지고 있습니다."
- "이 시기에는 ~하는 것이 좋습니다."
- "~한 특징이 나타납니다."

**피해야 할 표현:**
- ❌ `~이에요`, `~해요` (너무 가벼움)
- ❌ `~이십니다`, `~하십니다` (너무 높임)
- ❌ `~거든요`, `~네요` (구어체)
- ❌ `~것이옵니다` (과도한 높임)

**적용 완료 파일:** chapter1, 2, 3, 4, 9, 10

### 🟡 Narrative 추가 작업
**완료:**
- [x] Chapter 1: 명식 (30조합)
- [x] Chapter 2: 음양오행 (15조합)
- [x] Chapter 3: 십성 (60조합)
- [x] Chapter 4: 격국 (30조합)
- [x] Chapter 5: 신살 (15조합) ✅ (2025-12-06)
- [x] Chapter 6: 12운성 (15조합) ✅ (2025-12-06)
- [x] Chapter 7: 대운 (75조합) ✅ (2025-12-06)
- [x] Chapter 8: 세운 (75조합) ✅ (2025-12-06)
- [x] Chapter 9: 재물운 (12조합)
- [x] Chapter 10: 직업운 (15조합)
- [x] Chapter 11: 건강운 (60조합) ✅ (2025-12-06)
- [x] Chapter 12: 연애 스타일 (15조합) ✅ (2025-12-06)
- [x] Chapter 13: 인연의 흐름 (60조합) ✅ (2025-12-06)
- [x] Chapter 14: 배우자운 (15조합) ✅ (2025-12-06)
- [x] Chapter 15: 가족 관계 (15조합) ✅ (2025-12-06)
- [x] Chapter 16: 궁합 분석 (12조합) ✅ (2025-12-06)
- [x] Chapter 17: 개운법 (15조합) ✅ (2025-12-06)

**남은 작업:**
- [ ] 부록: 용어 사전 확장

### 🟢 페이지 수 확장 (완료) ✅
- [x] Chapter 1: 30조합 추가 ✅ (2025-12-06)
- [x] Chapter 2: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 3: 60조합 추가 ✅ (2025-12-06)
- [x] Chapter 4: 30조합 추가 ✅ (2025-12-06)
- [x] Chapter 5: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 6: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 7: 75조합 추가 ✅ (2025-12-06)
- [x] Chapter 8: 75조합 추가 ✅ (2025-12-06)
- [x] Chapter 9: 12조합 추가 ✅ (2025-12-06)
- [x] Chapter 10: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 11: 60조합 추가 ✅ (2025-12-06)
- [x] Chapter 12: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 13: 60조합 추가 ✅ (2025-12-06)
- [x] Chapter 14: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 15: 15조합 추가 ✅ (2025-12-06)
- [x] Chapter 16: 12조합 추가 ✅ (2025-12-06)
- [x] Chapter 17: 15조합 추가 ✅ (2025-12-06)
- **총 조합 수: 489개** (목표 달성)

---

## 향후 개선 사항 (기본 기능)

### 완료된 기능
- [x] 궁합 분석 기능 ✅ (2025-12-02 완료)
- [x] 가족 통합 분석 기능 ✅ (2025-12-02 완료)
- [x] 60갑자 일주 상징/별명 ✅ (2025-12-02 완료)
- [x] 12운성 분석 ✅ (2025-12-02 완료)
- [x] 오행 보완법 상세화 ✅ (2025-12-02 완료)
- [x] 기둥별 영역 설명 ✅ (2025-12-02 완료)
- [x] 천간 합/충 상세 해석 ✅ (2025-12-02 완료)
- [x] 스토리텔링 도입부 ✅ (2025-12-02 완료)
- [x] 전문가 분석 PDF 기본 구조 ✅ (2025-12-05 완료)
- [x] Narrative 컴포넌트 및 5개 챕터 적용 ✅ (2025-12-06 완료)
- [x] PDF 내보내기 ✅ (Expert Mode로 구현)

### 남은 작업
- [ ] 대운(大運) 계산 및 표시
- [ ] 세운(歲運) 계산 및 표시
- [ ] 상세 명리학 해설 추가

---

## 참고 자료

### 명리학 출처
- 적천수 (滴天髓)
- 자평진전 (子平眞詮)
- 궁통보감 (窮通寶鑑)

### 기술 문서
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
