#!/bin/bash
# 모바일 앱 빌드 스크립트
# API 라우트를 임시로 제외하고 static export 수행

set -e

# 에러 발생 시 API 폴더 복원
cleanup() {
  if [ -d "src/app/_api_backup" ]; then
    mv src/app/_api_backup src/app/api
    echo "✓ API 폴더 복원"
  fi
}
trap cleanup EXIT

echo "🔧 모바일 빌드 준비 중..."

# 기존 빌드 캐시 삭제
rm -rf .next
echo "✓ 빌드 캐시 삭제"

# API 폴더 임시 이동
if [ -d "src/app/api" ]; then
  mv src/app/api src/app/_api_backup
  echo "✓ API 폴더 임시 이동"
fi

# 환경변수 설정 및 빌드
export NEXT_PUBLIC_API_URL=https://saju-studio.com
export BUILD_TARGET=mobile

echo "🔨 Next.js 빌드 시작..."
npx next build

echo "✅ 모바일 빌드 완료! out/ 폴더에 정적 파일 생성됨"
