/**
 * PDF 챕터 페이지 컴포넌트 - 줄글 형식
 * A4 페이지 분리 및 인쇄 최적화
 */

import React from "react";

interface PdfChapterPageProps {
  chapterNumber: number;
  title: string;
  hanja?: string;
  children: React.ReactNode;
  pageNumber?: number;
}

export function PdfChapterPage({
  chapterNumber,
  title,
  hanja,
  children,
  pageNumber,
}: PdfChapterPageProps) {
  return (
    <div className="pdf-page w-[210mm] min-h-[297mm] mx-auto p-[20mm] relative print:p-[15mm] print:break-after-page print:break-inside-avoid" style={{ backgroundColor: '#faf8f5' }}>
      {/* 페이지 테두리 (인쇄 시) */}
      <div className="hidden print:block absolute inset-[10mm] border border-[#e5ddd0] pointer-events-none" />

      {/* 챕터 헤더 */}
      <header className="mb-10 pb-6 border-b-2 border-[#c4b5a0]">
        {chapterNumber > 0 && (
          <p className="text-[#8b7355] text-sm tracking-[0.3em] mb-2 uppercase">
            Chapter {chapterNumber}
          </p>
        )}
        <h2 className="font-serif text-3xl text-[#3d3127] font-bold tracking-wide">
          {title}
          {hanja && (
            <span className="text-xl text-[#8b7b6f] font-normal ml-3">
              {hanja}
            </span>
          )}
        </h2>
      </header>

      {/* 본문 콘텐츠 */}
      <div className="pdf-content text-[#4a4035] leading-[2] text-[15px] space-y-5">
        {children}
      </div>

      {/* 페이지 번호 - 하단 중앙 */}
      {pageNumber && (
        <div className="absolute bottom-[15mm] left-0 right-0 text-center">
          <span className="text-[#a09080] text-sm font-serif">— {pageNumber} —</span>
        </div>
      )}

      {/* 상단 장식선 */}
      <div className="absolute top-[12mm] left-[20mm] right-[20mm] h-[0.5px] print:left-[15mm] print:right-[15mm]" style={{ backgroundColor: '#c4b5a0' }} />
    </div>
  );
}

/**
 * 소제목 컴포넌트
 */
export function PdfSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-lg text-[#5d4d3d] font-semibold mt-10 mb-4 flex items-center gap-3 print:break-after-avoid">
      <span className="w-1.5 h-6 bg-[#8b7355] rounded-full" />
      {children}
    </h3>
  );
}

/**
 * 본문 단락 컴포넌트 - 들여쓰기 1칸 (0.5em)
 */
export function PdfParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[#4a4035] leading-[2] text-[15px] text-justify indent-[1em] break-inside-avoid">
      {children}
    </p>
  );
}

/**
 * 강조 텍스트 컴포넌트
 */
export function PdfHighlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#8b5a2b] font-semibold">
      {children}
    </span>
  );
}

/**
 * 인용 박스 컴포넌트
 */
export function PdfQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 mx-4 p-6 bg-[#f0ebe3] border-l-4 border-[#8b7355] text-[#5d4d3d] italic rounded-r-lg break-inside-avoid">
      <span className="text-[#8b7355] text-2xl leading-none mr-1">"</span>
      {children}
      <span className="text-[#8b7355] text-2xl leading-none ml-1">"</span>
    </div>
  );
}

/**
 * 간단한 표 컴포넌트 (4주 표시용)
 */
interface PdfSimpleTableProps {
  headers: string[];
  rows: string[][];
}

export function PdfSimpleTable({ headers, rows }: PdfSimpleTableProps) {
  return (
    <table className="w-full my-8 border-collapse break-inside-avoid">
      <thead>
        <tr className="bg-[#e8e0d5]">
          {headers.map((header, idx) => (
            <th
              key={idx}
              className="py-3 px-4 text-center text-[#5d4d3d] text-sm border border-[#c4b5a0] font-semibold"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIdx) => (
          <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-[#faf8f5]" : "bg-[#f5f0e8]"}>
            {row.map((cell, cellIdx) => (
              <td
                key={cellIdx}
                className="py-4 px-4 text-center text-[#3d3127] font-serif text-xl border border-[#d4c5b0]"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * 리스트 컴포넌트
 */
export function PdfList({ items }: { items: string[] }) {
  return (
    <ul className="my-6 space-y-3 pl-2">
      {items.map((item, idx) => (
        <li key={idx} className="text-[#4a4035] leading-[1.8] flex items-start gap-3 break-inside-avoid">
          <span className="text-[#8b7355] mt-1.5 text-lg">◆</span>
          <span className="flex-1">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * 페이지 구분선 컴포넌트 (페이지 내 섹션 구분용)
 */
export function PdfDivider() {
  return (
    <div className="my-10 flex items-center justify-center gap-4">
      <div className="w-16 h-[1px]" style={{ backgroundColor: '#c4b5a0' }} />
      <span className="text-[#c4b5a0] text-lg">✦</span>
      <div className="w-16 h-[1px]" style={{ backgroundColor: '#c4b5a0' }} />
    </div>
  );
}

/**
 * 정보 박스 컴포넌트 (핵심 정보 강조용)
 */
export function PdfInfoBox({
  title,
  children
}: {
  title?: string;
  children: React.ReactNode
}) {
  return (
    <div className="my-8 p-6 border border-[#c4b5a0] rounded-lg break-inside-avoid" style={{ backgroundColor: '#f5f0e8' }}>
      {title && (
        <h4 className="text-[#5d4d3d] font-semibold mb-3 flex items-center gap-2">
          <span className="text-[#8b7355]">▣</span>
          {title}
        </h4>
      )}
      <div className="text-[#4a4035] leading-[1.8]">
        {children}
      </div>
    </div>
  );
}

/**
 * 서술형 풀이 (Narrative) 섹션 컴포넌트
 * 사주 풀이를 자연스러운 이야기체로 표현
 */
interface ChapterNarrative {
  intro: string;
  mainAnalysis: string;
  details?: string[];
  advice: string;
  closing: string;
}

export function PdfNarrativeSection({
  narrative
}: {
  narrative?: ChapterNarrative | null
}) {
  if (!narrative) return null;

  // 텍스트를 문단으로 분리하는 함수
  const renderParagraphs = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => (
      <p
        key={idx}
        className="text-[#4a4035] leading-[2] text-[15px] text-justify indent-[1em] mb-5 break-inside-avoid"
      >
        {paragraph.split('\n').map((line, lineIdx) => (
          <React.Fragment key={lineIdx}>
            {line}
            {lineIdx < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  return (
    <div className="narrative-section space-y-6">
      {/* 도입부 */}
      <div className="intro-section">
        {renderParagraphs(narrative.intro)}
      </div>

      {/* 본문 분석 */}
      <div className="main-analysis-section mt-8">
        {renderParagraphs(narrative.mainAnalysis)}
      </div>

      {/* 상세 설명 */}
      {narrative.details && narrative.details.length > 0 && (
        <div className="details-section my-10">
          {narrative.details.map((detail, idx) => (
            <div key={idx} className="detail-box my-6 p-5 bg-[#f8f5f0] border-l-3 border-[#8b7355] rounded-r-lg break-inside-avoid">
              {renderParagraphs(detail)}
            </div>
          ))}
        </div>
      )}

      {/* 조언 */}
      <div className="advice-section my-10">
        <h4 className="text-[#5d4d3d] font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#8b7355] text-lg">•</span>
          조언
        </h4>
        <div className="p-5 border border-[#c4b5a0] rounded-lg" style={{ backgroundColor: '#f5f0e8' }}>
          {renderParagraphs(narrative.advice)}
        </div>
      </div>

      {/* 마무리 */}
      <div className="closing-section mt-10 p-6 bg-[#f0ebe3] border-l-4 border-[#8b7355] italic rounded-r-lg">
        <p className="text-[#5d4d3d] leading-[2] text-[15px]">
          {narrative.closing}
        </p>
      </div>
    </div>
  );
}

/**
 * 간단한 서술형 섹션 (intro와 mainAnalysis만)
 */
export function PdfNarrativeSimple({
  narrative
}: {
  narrative?: ChapterNarrative | null
}) {
  if (!narrative) return null;

  const renderParagraphs = (text: string) => {
    return text.split('\n\n').map((paragraph, idx) => (
      <p
        key={idx}
        className="text-[#4a4035] leading-[2] text-[15px] text-justify indent-[1em] mb-5 break-inside-avoid"
      >
        {paragraph.split('\n').map((line, lineIdx) => (
          <React.Fragment key={lineIdx}>
            {line}
            {lineIdx < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  return (
    <div className="narrative-simple space-y-6">
      {renderParagraphs(narrative.intro)}
      {renderParagraphs(narrative.mainAnalysis)}
    </div>
  );
}
