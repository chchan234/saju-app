/**
 * PDF 커플 목차 페이지 컴포넌트
 * 16개 챕터 구성
 */

const COUPLE_CHAPTERS = [
  { number: 1, title: "두 사람의 명식", hanja: "命式" },
  { number: 2, title: "기본 궁합 점수", hanja: "合婚點數" },
  { number: 3, title: "일간 궁합 심층", hanja: "日干深層" },
  { number: 4, title: "오행 보완 분석", hanja: "五行補完" },
  { number: 5, title: "오행 충돌 분석", hanja: "五行衝突" },
  { number: 6, title: "지지 육합 분석", hanja: "六合" },
  { number: 7, title: "지지 충·형·해", hanja: "沖刑害" },
  { number: 8, title: "소통 방식", hanja: "疏通" },
  { number: 9, title: "갈등 패턴과 화해법", hanja: "葛藤和解" },
  { number: 10, title: "연애/결혼 시기", hanja: "時期" },
  { number: 11, title: "재물 궁합", hanja: "財物" },
  { number: 12, title: "자녀 궁합", hanja: "子女" },
  { number: 13, title: "시댁/처가 관계", hanja: "家族" },
  { number: 14, title: "위기 시기와 주의점", hanja: "危機" },
  { number: 15, title: "장기 전망", hanja: "展望" },
  { number: 16, title: "종합 조언", hanja: "總合" },
];

export function PdfCoupleTableOfContents() {
  return (
    <div className="pdf-page w-[210mm] min-h-[297mm] mx-auto p-[20mm] relative print:p-[15mm] print:break-after-page" style={{ backgroundColor: '#faf8f5' }}>
      {/* 페이지 테두리 */}
      <div className="absolute inset-[10mm] border border-[#e5ddd0] pointer-events-none" />

      {/* 상단 장식 */}
      <div className="absolute top-[12mm] left-[20mm] right-[20mm] h-[0.5px]" style={{ backgroundColor: '#c4b5a0' }} />

      {/* 타이틀 */}
      <header className="text-center mb-12 pt-4">
        <p className="text-[#8b7355] text-sm tracking-[0.3em] mb-2">CONTENTS</p>
        <h2 className="font-serif text-3xl text-[#3d3127] font-bold tracking-wide">
          목차
        </h2>
        <div className="w-24 h-1 mx-auto mt-4" style={{ backgroundColor: '#8b7355' }} />
      </header>

      {/* 목차 리스트 */}
      <div className="space-y-3">
        {COUPLE_CHAPTERS.map((chapter) => (
          <div
            key={chapter.number}
            className="flex items-center gap-4 py-2 border-b border-dotted border-[#d4c5b0]"
          >
            <span className="text-[#8b7355] text-sm font-serif w-8">
              {String(chapter.number).padStart(2, '0')}
            </span>
            <span className="flex-1 text-[#3d3127] text-base font-medium">
              {chapter.title}
            </span>
            <span className="text-[#8b7b6f] text-sm font-serif">
              {chapter.hanja}
            </span>
          </div>
        ))}
      </div>

      {/* 페이지 번호 */}
      <div className="absolute bottom-[15mm] left-0 right-0 text-center">
        <span className="text-[#a09080] text-sm font-serif">— 2 —</span>
      </div>
    </div>
  );
}
