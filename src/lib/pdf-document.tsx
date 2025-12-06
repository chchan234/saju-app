/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck
// 이 파일은 더 이상 사용되지 않습니다. Puppeteer 기반 PDF 생성으로 대체되었습니다.
"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { ExpertModeResult } from "@/types/expert";

// 한글 폰트 등록 (Google Fonts - Noto Sans KR)
Font.register({
  family: "NotoSansKR",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuozeLTq8H4hfeE.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/notosanskr/v36/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuozeLTq8H4hfeE.ttf",
      fontWeight: 700,
    },
  ],
});

// 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#faf8f5",
    fontFamily: "NotoSansKR",
    fontSize: 11,
    lineHeight: 1.8,
  },
  // 표지
  coverPage: {
    padding: 40,
    backgroundColor: "#faf8f5",
    fontFamily: "NotoSansKR",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  coverBorder: {
    position: "absolute",
    top: 40,
    left: 40,
    right: 40,
    bottom: 40,
    borderWidth: 2,
    borderColor: "#c4b5a0",
    borderRadius: 8,
  },
  coverTitle: {
    fontSize: 14,
    color: "#8b7355",
    letterSpacing: 8,
    marginBottom: 16,
  },
  coverMainTitle: {
    fontSize: 32,
    color: "#3d3127",
    fontWeight: 700,
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 12,
    color: "#8b7b6f",
    letterSpacing: 4,
    marginBottom: 40,
  },
  coverDivider: {
    width: 120,
    height: 2,
    backgroundColor: "#8b7355",
    marginVertical: 24,
  },
  coverInfoBox: {
    backgroundColor: "#f5f0e8",
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d4c5b0",
    alignItems: "center",
    marginTop: 20,
  },
  coverInfoLabel: {
    fontSize: 10,
    color: "#8b7355",
    letterSpacing: 2,
    marginBottom: 8,
  },
  coverInfoName: {
    fontSize: 20,
    color: "#3d3127",
    fontWeight: 700,
    marginBottom: 8,
  },
  coverInfoDate: {
    fontSize: 12,
    color: "#6b5b4f",
  },
  coverFooter: {
    position: "absolute",
    bottom: 60,
    fontSize: 10,
    color: "#8b7b6f",
  },

  // 목차
  tocTitle: {
    fontSize: 24,
    color: "#3d3127",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 8,
  },
  tocSubtitle: {
    fontSize: 10,
    color: "#8b7355",
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 30,
  },
  tocItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5ddd0",
    borderStyle: "dotted",
  },
  tocChapter: {
    fontSize: 10,
    color: "#8b7355",
    width: 50,
  },
  tocItemTitle: {
    fontSize: 11,
    color: "#3d3127",
    flex: 1,
  },
  tocHanja: {
    fontSize: 10,
    color: "#8b7b6f",
  },

  // 챕터 헤더
  chapterHeader: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#c4b5a0",
  },
  chapterNumber: {
    fontSize: 10,
    color: "#8b7355",
    letterSpacing: 2,
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 20,
    color: "#3d3127",
    fontWeight: 700,
  },
  chapterHanja: {
    fontSize: 14,
    color: "#8b7b6f",
    marginLeft: 8,
  },

  // 본문
  paragraph: {
    marginBottom: 12,
    color: "#4a4035",
    textAlign: "justify",
  },
  subtitle: {
    fontSize: 13,
    color: "#5d4d3d",
    fontWeight: 700,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  subtitleBar: {
    width: 4,
    height: 16,
    backgroundColor: "#8b7355",
    marginRight: 8,
    borderRadius: 2,
  },

  // 테이블
  table: {
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#c4b5a0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e8e0d5",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    color: "#5d4d3d",
    fontWeight: 700,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#c4b5a0",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#d4c5b0",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    color: "#3d3127",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#d4c5b0",
  },

  // 사주 차트
  sajuChart: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 12,
  },
  sajuPillar: {
    alignItems: "center",
  },
  sajuPillarName: {
    fontSize: 10,
    color: "#8b7355",
    marginBottom: 8,
  },
  sajuStem: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  sajuBranch: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  sajuChar: {
    fontSize: 18,
    fontWeight: 700,
  },
  sajuCharKr: {
    fontSize: 8,
  },

  // 정보 박스
  infoBox: {
    backgroundColor: "#f5f0e8",
    padding: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c4b5a0",
    marginVertical: 12,
  },
  infoBoxTitle: {
    fontSize: 11,
    color: "#5d4d3d",
    fontWeight: 700,
    marginBottom: 8,
  },

  // 인용 박스
  quoteBox: {
    backgroundColor: "#f0ebe3",
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#8b7355",
    borderRadius: 4,
    marginVertical: 12,
  },
  quoteText: {
    fontSize: 11,
    color: "#5d4d3d",
    fontStyle: "italic",
  },

  // 리스트
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  listBullet: {
    width: 16,
    fontSize: 10,
    color: "#8b7355",
  },
  listText: {
    flex: 1,
    fontSize: 11,
    color: "#4a4035",
  },

  // 페이지 번호
  pageNumber: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#a09080",
  },

  // 오행 색상
  woodBg: { backgroundColor: "#e8f5e9", borderColor: "#4caf50" },
  fireBg: { backgroundColor: "#ffebee", borderColor: "#f44336" },
  earthBg: { backgroundColor: "#fff8e1", borderColor: "#ffc107" },
  metalBg: { backgroundColor: "#eceff1", borderColor: "#90a4ae" },
  waterBg: { backgroundColor: "#e3f2fd", borderColor: "#2196f3" },
  woodText: { color: "#1b5e20" },
  fireText: { color: "#b71c1c" },
  earthText: { color: "#f57f17" },
  metalText: { color: "#37474f" },
  waterText: { color: "#0d47a1" },
});

// 오행별 스타일 가져오기
const getElementStyle = (element: string): { bg: Style; text: Style } => {
  const map: Record<string, { bg: Style; text: Style }> = {
    목: { bg: styles.woodBg, text: styles.woodText },
    wood: { bg: styles.woodBg, text: styles.woodText },
    화: { bg: styles.fireBg, text: styles.fireText },
    fire: { bg: styles.fireBg, text: styles.fireText },
    토: { bg: styles.earthBg, text: styles.earthText },
    earth: { bg: styles.earthBg, text: styles.earthText },
    금: { bg: styles.metalBg, text: styles.metalText },
    metal: { bg: styles.metalBg, text: styles.metalText },
    수: { bg: styles.waterBg, text: styles.waterText },
    water: { bg: styles.waterBg, text: styles.waterText },
  };
  return map[element] || map["토"];
};

// 목차 항목
const TOC_ITEMS = [
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

// 표지 페이지
function CoverPage({
  name,
  birthYear,
  birthMonth,
  birthDay,
  gender,
  generatedAt,
}: {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: string;
  generatedAt: Date;
}) {
  return (
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverBorder} />
      <Text style={styles.coverTitle}>四柱八字</Text>
      <Text style={styles.coverMainTitle}>종합사주풀이</Text>
      <Text style={styles.coverSubtitle}>COMPREHENSIVE SAJU ANALYSIS</Text>
      <View style={styles.coverDivider} />
      <View style={styles.coverInfoBox}>
        <Text style={styles.coverInfoLabel}>의뢰인</Text>
        <Text style={styles.coverInfoName}>{name}</Text>
        <View style={{ width: 40, height: 1, backgroundColor: "#c4b5a0", marginVertical: 8 }} />
        <Text style={styles.coverInfoDate}>
          {birthYear}년 {birthMonth}월 {birthDay}일생
        </Text>
        <Text style={{ fontSize: 10, color: "#8b7b6f", marginTop: 4 }}>
          ({gender === "male" ? "남성" : "여성"})
        </Text>
      </View>
      <Text style={styles.coverFooter}>
        분석 일자: {generatedAt.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    </Page>
  );
}

// 목차 페이지
function TableOfContentsPage() {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.tocSubtitle}>CONTENTS</Text>
      <Text style={styles.tocTitle}>목차</Text>
      <View style={{ width: 80, height: 2, backgroundColor: "#8b7355", alignSelf: "center", marginBottom: 30 }} />
      {TOC_ITEMS.map((item) => (
        <View key={item.chapter} style={styles.tocItem}>
          <Text style={styles.tocChapter}>제{item.chapter}장</Text>
          <Text style={styles.tocItemTitle}>{item.title}</Text>
          {item.hanja && <Text style={styles.tocHanja}>({item.hanja})</Text>}
        </View>
      ))}
      <Text style={styles.pageNumber}>— 2 —</Text>
    </Page>
  );
}

// 챕터 헤더 컴포넌트
function ChapterHeader({ number, title, hanja }: { number: number; title: string; hanja?: string }) {
  return (
    <View style={styles.chapterHeader}>
      <Text style={styles.chapterNumber}>CHAPTER {number}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.chapterTitle}>{title}</Text>
        {hanja && <Text style={styles.chapterHanja}>{hanja}</Text>}
      </View>
    </View>
  );
}

// 소제목 컴포넌트
function Subtitle({ children }: { children: string }) {
  return (
    <View style={styles.subtitle}>
      <View style={styles.subtitleBar} />
      <Text>{children}</Text>
    </View>
  );
}

// 단락 컴포넌트
function Paragraph({ children }: { children: string }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

// 리스트 컴포넌트
function ListItem({ children }: { children: string }) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listBullet}>•</Text>
      <Text style={styles.listText}>{children}</Text>
    </View>
  );
}

// 인용 박스 컴포넌트
function QuoteBox({ children }: { children: string }) {
  return (
    <View style={styles.quoteBox}>
      <Text style={styles.quoteText}>"{children}"</Text>
    </View>
  );
}

// 정보 박스 컴포넌트
function InfoBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.infoBox}>
      {title && <Text style={styles.infoBoxTitle}>▣ {title}</Text>}
      {children}
    </View>
  );
}

// 사주 차트 컴포넌트
function SajuChart({ pillars }: { pillars: { name: string; stem: string; stemKr: string; stemElement: string; branch: string; branchKr: string; branchElement: string }[] }) {
  return (
    <View style={styles.sajuChart}>
      {pillars.map((pillar, idx) => {
        const stemStyle = getElementStyle(pillar.stemElement);
        const branchStyle = getElementStyle(pillar.branchElement);
        return (
          <View key={idx} style={styles.sajuPillar}>
            <Text style={styles.sajuPillarName}>{pillar.name}</Text>
            <View style={[styles.sajuStem, stemStyle.bg]}>
              <Text style={[styles.sajuChar, stemStyle.text]}>{pillar.stem}</Text>
              <Text style={[styles.sajuCharKr, stemStyle.text]}>{pillar.stemKr}</Text>
            </View>
            <View style={[styles.sajuBranch, branchStyle.bg]}>
              <Text style={[styles.sajuChar, branchStyle.text]}>{pillar.branch}</Text>
              <Text style={[styles.sajuCharKr, branchStyle.text]}>{pillar.branchKr}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// 테이블 컴포넌트
function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {headers.map((header, idx) => (
          <Text key={idx} style={styles.tableHeaderCell}>{header}</Text>
        ))}
      </View>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.tableRow}>
          {row.map((cell, cellIdx) => (
            <Text key={cellIdx} style={styles.tableCell}>{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

// 메인 PDF 문서 컴포넌트
interface SajuPdfDocumentProps {
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: string;
  createdAt: string;
  analysis: ExpertModeResult;
}

export function SajuPdfDocument({
  name,
  birthYear,
  birthMonth,
  birthDay,
  gender,
  createdAt,
  analysis,
}: SajuPdfDocumentProps) {
  const generatedAt = new Date(createdAt || Date.now());
  const ch1 = analysis.common.chapter1_myeongshik;
  const ch2 = analysis.common.chapter2_eumyangOheng;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ch3 = (analysis.common as any).chapter3_sipseong;

  // 사주 기둥 데이터 준비
  const pillars = [];
  if (ch1?.pillars) {
    const p = ch1.pillars;
    if (p.year) {
      pillars.push({
        name: "년주",
        stem: p.year.ganZhi.stem,
        stemKr: p.year.ganZhi.stemKr,
        stemElement: p.year.ganZhi.stemElement || "목",
        branch: p.year.ganZhi.branch,
        branchKr: p.year.ganZhi.branchKr,
        branchElement: p.year.ganZhi.branchElement || "수",
      });
    }
    if (p.month) {
      pillars.push({
        name: "월주",
        stem: p.month.ganZhi.stem,
        stemKr: p.month.ganZhi.stemKr,
        stemElement: p.month.ganZhi.stemElement || "목",
        branch: p.month.ganZhi.branch,
        branchKr: p.month.ganZhi.branchKr,
        branchElement: p.month.ganZhi.branchElement || "수",
      });
    }
    if (p.day) {
      pillars.push({
        name: "일주",
        stem: p.day.ganZhi.stem,
        stemKr: p.day.ganZhi.stemKr,
        stemElement: p.day.ganZhi.stemElement || "목",
        branch: p.day.ganZhi.branch,
        branchKr: p.day.ganZhi.branchKr,
        branchElement: p.day.ganZhi.branchElement || "수",
      });
    }
    if (p.hour) {
      pillars.push({
        name: "시주",
        stem: p.hour.ganZhi.stem,
        stemKr: p.hour.ganZhi.stemKr,
        stemElement: p.hour.ganZhi.stemElement || "목",
        branch: p.hour.ganZhi.branch,
        branchKr: p.hour.ganZhi.branchKr,
        branchElement: p.hour.ganZhi.branchElement || "수",
      });
    }
  }

  return (
    <Document>
      {/* 표지 */}
      <CoverPage
        name={name}
        birthYear={birthYear}
        birthMonth={birthMonth}
        birthDay={birthDay}
        gender={gender}
        generatedAt={generatedAt}
      />

      {/* 목차 */}
      <TableOfContentsPage />

      {/* 제1장: 명식 */}
      {ch1 && (
        <Page size="A4" style={styles.page}>
          <ChapterHeader number={1} title="명식" hanja="命式" />

          <Paragraph>
            사주명리학에서 명식(命式)은 한 사람의 운명을 담은 고유한 설계도입니다.
            태어난 년, 월, 일, 시를 천간(天干)과 지지(地支)로 표현하여 여덟 글자로 구성됩니다.
          </Paragraph>

          <Subtitle>사주 구성</Subtitle>

          {pillars.length > 0 && <SajuChart pillars={pillars} />}

          <SimpleTable
            headers={["년주(年柱)", "월주(月柱)", "일주(日柱)", "시주(時柱)"]}
            rows={[
              [
                ch1.pillars.year?.ganZhi.stemKr || "-",
                ch1.pillars.month?.ganZhi.stemKr || "-",
                ch1.pillars.day?.ganZhi.stemKr || "-",
                ch1.pillars.hour?.ganZhi.stemKr || "-",
              ],
              [
                ch1.pillars.year?.ganZhi.branchKr || "-",
                ch1.pillars.month?.ganZhi.branchKr || "-",
                ch1.pillars.day?.ganZhi.branchKr || "-",
                ch1.pillars.hour?.ganZhi.branchKr || "-",
              ],
            ]}
          />

          {ch1.narrative && (
            <>
              <Subtitle>명식 해설</Subtitle>
              <Paragraph>{ch1.narrative.intro}</Paragraph>
              <Paragraph>{ch1.narrative.mainAnalysis}</Paragraph>
              {ch1.narrative.advice && (
                <InfoBox title="조언">
                  <Paragraph>{ch1.narrative.advice}</Paragraph>
                </InfoBox>
              )}
            </>
          )}

          <Text style={styles.pageNumber}>— 3 —</Text>
        </Page>
      )}

      {/* 제2장: 음양오행 */}
      {ch2 && (
        <Page size="A4" style={styles.page}>
          <ChapterHeader number={2} title="음양오행" hanja="陰陽五行" />

          <Paragraph>
            음양오행은 동양 철학의 핵심으로, 우주 만물의 변화와 조화를 설명하는 이론입니다.
            목(木), 화(火), 토(土), 금(金), 수(水)의 다섯 가지 기운이 상생과 상극의 관계 속에서 균형을 이룹니다.
          </Paragraph>

          {ch2.narrative && (
            <>
              <Subtitle>오행 분석</Subtitle>
              <Paragraph>{ch2.narrative.intro}</Paragraph>
              <Paragraph>{ch2.narrative.mainAnalysis}</Paragraph>
              {ch2.narrative.advice && (
                <InfoBox title="조언">
                  <Paragraph>{ch2.narrative.advice}</Paragraph>
                </InfoBox>
              )}
            </>
          )}

          <Text style={styles.pageNumber}>— 4 —</Text>
        </Page>
      )}

      {/* 제3장: 십성 */}
      {ch3 && (
        <Page size="A4" style={styles.page}>
          <ChapterHeader number={3} title="십성" hanja="十星" />

          <Paragraph>
            십성(十星)은 일간을 기준으로 다른 천간과의 관계를 나타내는 것으로,
            비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인의 열 가지로 구성됩니다.
          </Paragraph>

          {ch3.narrative && (
            <>
              <Subtitle>십성 분석</Subtitle>
              <Paragraph>{ch3.narrative.intro}</Paragraph>
              <Paragraph>{ch3.narrative.mainAnalysis}</Paragraph>
              {ch3.narrative.advice && (
                <InfoBox title="조언">
                  <Paragraph>{ch3.narrative.advice}</Paragraph>
                </InfoBox>
              )}
            </>
          )}

          <Text style={styles.pageNumber}>— 5 —</Text>
        </Page>
      )}

      {/* 추가 챕터들... (분량 관계상 핵심만 포함) */}

      {/* 마지막 페이지 - 개운법 */}
      {analysis.common.chapter16_gaeunbeop && (
        <Page size="A4" style={styles.page}>
          <ChapterHeader number={16} title="개운법" hanja="開運法" />

          <Paragraph>
            개운법(開運法)은 운을 열어 더 나은 삶을 만들어가는 방법입니다.
            사주의 부족한 부분을 보완하고 강한 부분을 활용하여 조화로운 삶을 추구합니다.
          </Paragraph>

          {analysis.common.chapter16_gaeunbeop.narrative && (
            <>
              <Subtitle>개운 방법</Subtitle>
              <Paragraph>{analysis.common.chapter16_gaeunbeop.narrative.intro}</Paragraph>
              <Paragraph>{analysis.common.chapter16_gaeunbeop.narrative.mainAnalysis}</Paragraph>
              {analysis.common.chapter16_gaeunbeop.narrative.advice && (
                <QuoteBox>{analysis.common.chapter16_gaeunbeop.narrative.advice}</QuoteBox>
              )}
            </>
          )}

          <View style={{ marginTop: 40, alignItems: "center" }}>
            <View style={{ width: 60, height: 1, backgroundColor: "#c4b5a0", marginBottom: 20 }} />
            <Text style={{ fontSize: 10, color: "#8b7b6f", textAlign: "center" }}>
              본 리포트는 정통사주 전문가 모드를 통해 생성되었습니다.
            </Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

// PDF Blob 생성 함수
export async function generateSajuPdfBlob(props: SajuPdfDocumentProps): Promise<Blob> {
  const doc = <SajuPdfDocument {...props} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

// Base64 변환 함수
export async function pdfBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// PDF 다운로드 함수
export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
