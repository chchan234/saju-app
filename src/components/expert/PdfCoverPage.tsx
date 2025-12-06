/**
 * PDF 표지 페이지 컴포넌트
 * A4 크기 최적화 및 인쇄 대응
 */

interface PdfCoverPageProps {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: string;
  generatedAt: Date;
}

export function PdfCoverPage({
  name,
  birthYear,
  birthMonth,
  birthDay,
  gender,
  generatedAt,
}: PdfCoverPageProps) {
  return (
    <div className="pdf-page w-[210mm] h-[297mm] mx-auto flex flex-col items-center justify-center p-16 relative print:break-after-page" style={{ backgroundColor: '#faf8f5' }}>
      {/* 배경 패턴 - PDF 캡처 호환을 위해 단순화 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />

      {/* 장식 테두리 */}
      <div className="absolute inset-[15mm] border-2 border-[#c4b5a0] rounded-lg" />
      <div className="absolute inset-[18mm] border border-[#d4c5b0] rounded-lg" />

      {/* 모서리 장식 */}
      <div className="absolute top-[15mm] left-[15mm] w-8 h-8 border-t-2 border-l-2 border-[#8b7355] rounded-tl-lg" />
      <div className="absolute top-[15mm] right-[15mm] w-8 h-8 border-t-2 border-r-2 border-[#8b7355] rounded-tr-lg" />
      <div className="absolute bottom-[15mm] left-[15mm] w-8 h-8 border-b-2 border-l-2 border-[#8b7355] rounded-bl-lg" />
      <div className="absolute bottom-[15mm] right-[15mm] w-8 h-8 border-b-2 border-r-2 border-[#8b7355] rounded-br-lg" />

      {/* 상단 장식 */}
      <div className="absolute top-[30mm] left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="w-20 h-[2px]" style={{ backgroundColor: '#8b7355' }} />
        <span className="text-[#8b7355] text-2xl">☰</span>
        <div className="w-20 h-[2px]" style={{ backgroundColor: '#8b7355' }} />
      </div>

      {/* 메인 타이틀 */}
      <div className="text-center mb-20 relative z-10">
        <p className="text-[#8b7355] text-xl tracking-[0.8em] mb-6 font-serif">四柱八字</p>
        <h1 className="font-serif text-6xl text-[#3d3127] font-bold tracking-wider mb-6">
          종합사주풀이
        </h1>
        <p className="text-[#8b7b6f] text-lg tracking-widest">
          COMPREHENSIVE SAJU ANALYSIS
        </p>
        <div className="w-40 h-1 mx-auto mt-8" style={{ backgroundColor: '#8b7355' }} />
      </div>

      {/* 대상자 정보 */}
      <div className="text-center mb-16 relative z-10 px-12 py-8 rounded-lg border border-[#d4c5b0]" style={{ backgroundColor: '#f5f0e8' }}>
        <p className="text-[#8b7355] text-sm tracking-widest mb-3">의뢰인</p>
        <p className="text-[#3d3127] text-3xl font-serif font-bold mb-4">
          {name}
        </p>
        <div className="w-16 h-[1px] bg-[#c4b5a0] mx-auto mb-4" />
        <p className="text-[#6b5b4f] text-lg">
          {birthYear}년 {birthMonth}월 {birthDay}일생
        </p>
        <p className="text-[#8b7b6f] text-base mt-1">
          ({gender === "male" ? "남성" : "여성"})
        </p>
      </div>

      {/* 하단 정보 */}
      <div className="absolute bottom-[35mm] text-center">
        <p className="text-[#8b7b6f] text-sm tracking-wider">
          분석 일자: {generatedAt.toLocaleDateString("ko-KR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* 하단 장식 */}
      <div className="absolute bottom-[25mm] left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="w-20 h-[2px]" style={{ backgroundColor: '#8b7355' }} />
        <span className="text-[#8b7355] text-2xl">☷</span>
        <div className="w-20 h-[2px]" style={{ backgroundColor: '#8b7355' }} />
      </div>

      {/* 페이지 번호 */}
      <div className="absolute bottom-[15mm] left-1/2 -translate-x-1/2">
        <span className="text-[#a09080] text-sm font-serif">— 1 —</span>
      </div>
    </div>
  );
}
