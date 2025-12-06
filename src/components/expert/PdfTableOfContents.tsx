/**
 * PDF 목차 페이지 컴포넌트
 * A4 크기 최적화 및 인쇄 대응
 */

interface TocItem {
  chapter: number;
  title: string;
  hanja?: string;
}

const tocItems: TocItem[] = [
  { chapter: 1, title: "명식", hanja: "命式" },
  { chapter: 2, title: "음양오행", hanja: "陰陽五行" },
  { chapter: 3, title: "십성", hanja: "十星" },
  { chapter: 4, title: "격국", hanja: "格局" },
  { chapter: 5, title: "신살", hanja: "神煞" },
  { chapter: 6, title: "12운성", hanja: "十二運星" },
  { chapter: 7, title: "대운", hanja: "大運" },
  { chapter: 8, title: "세운", hanja: "歲運" },
  { chapter: 9, title: "재물운", hanja: "財物運" },
  { chapter: 10, title: "직업운", hanja: "職業運" },
  { chapter: 11, title: "건강운", hanja: "健康運" },
  { chapter: 12, title: "연애 스타일" },
  { chapter: 13, title: "인연의 흐름" },
  { chapter: 14, title: "배우자운" },
  { chapter: 15, title: "가족 관계" },
  { chapter: 16, title: "개운법", hanja: "開運法" },
];

export function PdfTableOfContents() {
  return (
    <div className="pdf-page w-[210mm] min-h-[297mm] mx-auto p-[20mm] relative print:break-after-page" style={{ backgroundColor: '#faf8f5' }}>
      {/* 상단 장식 */}
      <div className="absolute top-[12mm] left-[20mm] right-[20mm] h-[0.5px]" style={{ backgroundColor: '#c4b5a0' }} />

      {/* 페이지 제목 */}
      <div className="text-center mb-16">
        <p className="text-[#8b7355] text-sm tracking-[0.3em] mb-2">CONTENTS</p>
        <h2 className="font-serif text-4xl text-[#3d3127] font-bold tracking-wide">목차</h2>
        <div className="w-24 h-1 mx-auto mt-6" style={{ backgroundColor: '#8b7355' }} />
      </div>

      {/* 목차 리스트 */}
      <div className="space-y-0">
        {tocItems.map((item, idx) => (
          <div
            key={item.chapter}
            className={`flex items-center py-3 ${idx % 2 === 0 ? 'bg-[#f5f0e8]/50' : ''} px-4 rounded`}
          >
            {/* 장 번호 */}
            <span className="text-[#8b7355] font-serif text-base w-20 flex-shrink-0">
              제{item.chapter}장
            </span>

            {/* 제목 */}
            <span className="text-[#3d3127] font-serif text-lg font-medium">
              {item.title}
            </span>

            {/* 한자 */}
            {item.hanja && (
              <span className="text-[#8b7b6f] text-sm ml-2">
                ({item.hanja})
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 부록 섹션 */}
      <div className="mt-10 pt-8 border-t-2 border-[#c4b5a0]">
        <div className="flex items-center py-3 px-4">
          <span className="text-[#8b7355] font-serif text-base w-20 flex-shrink-0">
            부록
          </span>
          <span className="text-[#3d3127] font-serif text-lg font-medium">
            용어 사전 및 자주 묻는 질문
          </span>
        </div>
      </div>
    </div>
  );
}
