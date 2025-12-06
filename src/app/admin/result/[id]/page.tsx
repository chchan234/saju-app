"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Printer, Download, Send } from "lucide-react";
import type { ExpertModeResult } from "@/types/expert";
import {
  fiveElementToKorean,
  relationshipStatusToKorean,
  getElementStrengthDescription
} from "@/lib/constants";

// 전문가모드용 풍부한 상수들
import {
  CHEONGAN,
  JIJI,
  JIJI_KR,
  PILLARS,
  SIPSIN,
  SIPSIN_GROUPS,
  CHAPTER_INTROS,
  OHENG_RELATIONS,
  type CheonganHanja,
  type JijiHanja,
  type JijiKr,
  type SipsinName,
} from "@/lib/saju-constants";

// PDF 컴포넌트
import { PdfCoverPage } from "@/components/expert/PdfCoverPage";
import { PdfTableOfContents } from "@/components/expert/PdfTableOfContents";
import {
  PdfChapterPage,
  PdfSubtitle,
  PdfParagraph,
  PdfHighlight,
  PdfSimpleTable,
  PdfList,
  PdfQuote,
  PdfDivider,
  PdfNarrativeSection,
} from "@/components/expert/PdfChapterPage";

// 인포그래픽 컴포넌트
import {
  PdfSajuChart,
  PdfElementChart,
  PdfYinYangGauge,
  PdfDaeunTimeline,
  PdfYearlyCalendar,
  PdfHealthMap,
  PdfCompatibilityCard,
  PdfTenGodsChart,
} from "@/components/expert/PdfInfographics";

interface RequestData {
  id: string;
  name: string;
  email: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: string;
  relationshipStatus: string;
  occupationStatus: string;
  hasChildren: boolean;
  analysisResult: ExpertModeResult | null;
  createdAt: string;
}

export default function AdminResultPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const requestId = params.id as string;
  const action = searchParams.get("action");
  const mode = searchParams.get("mode"); // PDF 모드 확인
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<RequestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [autoSendTriggered, setAutoSendTriggered] = useState(false);

  // PDF 모드일 때는 인증 체크 건너뛰기
  const isPdfMode = mode === "pdf";

  useEffect(() => {
    // PDF 모드가 아닐 때만 인증 체크
    if (!isPdfMode) {
      const verified = sessionStorage.getItem("admin_verified");
      if (verified !== "true") {
        router.push("/admin/verify");
        return;
      }
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/requests/${requestId}`);
        const result = await res.json();
        if (result.success) {
          setData(result.request);
        } else {
          setError(result.message || "데이터를 불러올 수 없습니다.");
        }
      } catch {
        setError("데이터 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [requestId, router, isPdfMode]);

  // action=send인 경우 자동으로 이메일 발송 시작
  useEffect(() => {
    if (action === "send" && data && data.analysisResult && !autoSendTriggered) {
      setAutoSendTriggered(true);
      // 약간의 딜레이 후 이메일 발송 시작
      const timer = setTimeout(() => {
        handleSendEmail();
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, data, autoSendTriggered]);

  const handlePrint = () => {
    window.print();
  };

  // PDF 다운로드 (Puppeteer 서버사이드 생성)
  const handleDownloadPdf = async () => {
    if (!data || !data.analysisResult) {
      alert("분석 결과가 없습니다.");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      console.log("Puppeteer PDF 생성 요청 시작...");
      const res = await fetch("/api/admin/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: data.id }),
      });

      const result = await res.json();
      if (result.success && result.pdfBase64) {
        // Base64를 Blob으로 변환
        const byteCharacters = atob(result.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

        // 다운로드
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${data.name}_사주분석_리포트.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("PDF 다운로드 완료");
      } else {
        throw new Error(result.message || "PDF 생성 실패");
      }
    } catch (err) {
      console.error("PDF 생성 오류:", err);
      alert(`PDF 생성 중 오류가 발생했습니다: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 이메일 발송 (Puppeteer 서버사이드 PDF 생성)
  const handleSendEmail = async () => {
    if (!data || !data.analysisResult) {
      alert("분석 결과가 없습니다.");
      return;
    }

    const confirmed = window.confirm(
      `${data.email}로 분석 리포트를 발송하시겠습니까?`
    );
    if (!confirmed) return;

    setIsSendingEmail(true);
    try {
      console.log("Puppeteer PDF 생성 시작...");
      // Puppeteer로 PDF 생성
      const pdfRes = await fetch("/api/admin/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: data.id }),
      });

      const pdfResult = await pdfRes.json();
      if (!pdfResult.success || !pdfResult.pdfBase64) {
        throw new Error(pdfResult.message || "PDF 생성 실패");
      }
      console.log("PDF 생성 완료, 크기:", pdfResult.size);

      // 이메일 발송 API 호출
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: data.id,
          pdfBase64: pdfResult.pdfBase64,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("이메일이 성공적으로 발송되었습니다.");
      } else {
        alert(`이메일 발송 실패: ${result.message}`);
      }
    } catch (err) {
      console.error("이메일 발송 오류:", err);
      alert(`이메일 발송 중 오류가 발생했습니다: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8b7355]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "데이터를 찾을 수 없습니다."}</p>
          <Button onClick={() => router.push("/admin")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const analysis = data.analysisResult;

  return (
    <>
      {/* 인쇄/PDF 모드 시 숨겨지는 컨트롤 바 */}
      {!isPdfMode && (
        <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{data.name}님의 분석 결과</span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownloadPdf}
                  size="sm"
                  variant="outline"
                  disabled={isGeneratingPdf}
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  PDF 다운로드
                </Button>
                <Button
                  onClick={handleSendEmail}
                  size="sm"
                  disabled={isSendingEmail}
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  {isSendingEmail ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  이메일 발송
                </Button>
                <Button onClick={handlePrint} size="sm" variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  인쇄
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF 콘텐츠 */}
      <div
        ref={pdfContentRef}
        className={`${isPdfMode ? '' : 'pt-16'} print:pt-0 bg-[#f5f0e8] pdf-content`}
        style={{ backgroundColor: '#f5f0e8', color: '#333333' }}
        data-pdf-content="true"
      >
        {/* 표지 */}
        <PdfCoverPage
          name={data.name}
          birthYear={data.birthYear}
          birthMonth={data.birthMonth}
          birthDay={data.birthDay}
          gender={data.gender}
          generatedAt={new Date(data.createdAt || Date.now())}
        />

        {/* 목차 */}
        <PdfTableOfContents />

        {/* 제1장: 명식 */}
        {analysis?.common.chapter1_myeongshik && (
          <PdfChapterPage chapterNumber={1} title="명식" hanja="命式" >
            <PdfParagraph>
              {CHAPTER_INTROS.myeongshik.intro}
            </PdfParagraph>

            <PdfSubtitle>사주의 네 기둥</PdfSubtitle>
            <PdfParagraph>
              사주는 년주(年柱), 월주(月柱), 일주(日柱), 시주(時柱)의 네 기둥으로 이루어집니다.
              {PILLARS.year.represents.includes("조상") && ` 년주는 ${PILLARS.year.symbolism}을 의미하며 ${PILLARS.year.ageRange}의 운을 관장합니다.`}
              {` 월주는 ${PILLARS.month.symbolism}을 나타내고 ${PILLARS.month.ageRange}의 운을 담당합니다.`}
              {` 일주는 ${PILLARS.day.symbolism}을 상징하며 ${PILLARS.day.ageRange}의 운을 보여줍니다.`}
              {` 시주는 ${PILLARS.hour.symbolism}을 의미하고 ${PILLARS.hour.ageRange}의 운세를 나타냅니다.`}
            </PdfParagraph>

            <PdfSubtitle>사주 구성</PdfSubtitle>

            {/* 사주팔자 인포그래픽 */}
            {(() => {
              // 천간에서 오행을 영문으로 변환하는 함수
              const getOhengToElement = (oheng: string): import("@/types/saju").FiveElement => {
                const map: Record<string, import("@/types/saju").FiveElement> = {
                  "목": "wood", "화": "fire", "토": "earth", "금": "metal", "수": "water"
                };
                return map[oheng] || "wood";
              };

              // CHEONGAN과 JIJI 상수를 활용하여 매핑
              const getStemElement = (stem: string): import("@/types/saju").FiveElement => {
                const info = CHEONGAN[stem as CheonganHanja];
                return info ? getOhengToElement(info.oheng) : "wood";
              };

              const getBranchElement = (branch: string): import("@/types/saju").FiveElement => {
                const info = JIJI[branch as JijiHanja];
                return info ? getOhengToElement(info.oheng) : "water";
              };

              const getBranchAnimal = (branch: string): string => {
                // 한자와 한글 모두 지원
                const infoHanja = JIJI[branch as JijiHanja];
                if (infoHanja) return infoHanja.animal;
                const infoKr = JIJI_KR[branch as JijiKr];
                return infoKr ? infoKr.animal : "쥐";
              };

              const pillars = analysis.common.chapter1_myeongshik.pillars;
              return (
                <PdfSajuChart
                  pillars={[
                    {
                      name: "년주",
                      heavenlyStem: {
                        hanja: pillars.year?.ganZhi.stem || "甲",
                        korean: pillars.year?.ganZhi.stemKr || "갑",
                        element: getStemElement(pillars.year?.ganZhi.stem || "甲"),
                      },
                      earthlyBranch: {
                        hanja: pillars.year?.ganZhi.branch || "子",
                        korean: pillars.year?.ganZhi.branchKr || "자",
                        element: getBranchElement(pillars.year?.ganZhi.branch || "子"),
                        animal: getBranchAnimal(pillars.year?.ganZhi.branch || "子"),
                      },
                    },
                    {
                      name: "월주",
                      heavenlyStem: {
                        hanja: pillars.month?.ganZhi.stem || "甲",
                        korean: pillars.month?.ganZhi.stemKr || "갑",
                        element: getStemElement(pillars.month?.ganZhi.stem || "甲"),
                      },
                      earthlyBranch: {
                        hanja: pillars.month?.ganZhi.branch || "子",
                        korean: pillars.month?.ganZhi.branchKr || "자",
                        element: getBranchElement(pillars.month?.ganZhi.branch || "子"),
                        animal: getBranchAnimal(pillars.month?.ganZhi.branch || "子"),
                      },
                    },
                    {
                      name: "일주",
                      heavenlyStem: {
                        hanja: pillars.day?.ganZhi.stem || "甲",
                        korean: pillars.day?.ganZhi.stemKr || "갑",
                        element: getStemElement(pillars.day?.ganZhi.stem || "甲"),
                      },
                      earthlyBranch: {
                        hanja: pillars.day?.ganZhi.branch || "子",
                        korean: pillars.day?.ganZhi.branchKr || "자",
                        element: getBranchElement(pillars.day?.ganZhi.branch || "子"),
                        animal: getBranchAnimal(pillars.day?.ganZhi.branch || "子"),
                      },
                    },
                    ...(pillars.hour ? [{
                      name: "시주",
                      heavenlyStem: {
                        hanja: pillars.hour.ganZhi.stem || "甲",
                        korean: pillars.hour.ganZhi.stemKr || "갑",
                        element: getStemElement(pillars.hour.ganZhi.stem || "甲"),
                      },
                      earthlyBranch: {
                        hanja: pillars.hour.ganZhi.branch || "子",
                        korean: pillars.hour.ganZhi.branchKr || "자",
                        element: getBranchElement(pillars.hour.ganZhi.branch || "子"),
                        animal: getBranchAnimal(pillars.hour.ganZhi.branch || "子"),
                      },
                    }] : []),
                  ]}
                />
              );
            })()}

            <PdfSimpleTable
              headers={["년주(年柱)", "월주(月柱)", "일주(日柱)", "시주(時柱)"]}
              rows={[
                [
                  analysis.common.chapter1_myeongshik.pillars.year?.ganZhi.stemKr || "-",
                  analysis.common.chapter1_myeongshik.pillars.month?.ganZhi.stemKr || "-",
                  analysis.common.chapter1_myeongshik.pillars.day?.ganZhi.stemKr || "-",
                  analysis.common.chapter1_myeongshik.pillars.hour?.ganZhi.stemKr || "-",
                ],
                [
                  analysis.common.chapter1_myeongshik.pillars.year?.ganZhi.branchKr || "-",
                  analysis.common.chapter1_myeongshik.pillars.month?.ganZhi.branchKr || "-",
                  analysis.common.chapter1_myeongshik.pillars.day?.ganZhi.branchKr || "-",
                  analysis.common.chapter1_myeongshik.pillars.hour?.ganZhi.branchKr || "-",
                ],
              ]}
            />

            {/* 년주 해석 */}
            {(() => {
              const yearStem = analysis.common.chapter1_myeongshik.pillars.year?.ganZhi.stem as CheonganHanja;
              const yearBranch = analysis.common.chapter1_myeongshik.pillars.year?.ganZhi.branch as JijiHanja;
              const stemInfo = yearStem ? CHEONGAN[yearStem] : null;
              const branchInfo = yearBranch ? JIJI[yearBranch] : null;
              return (
                <>
                  <PdfSubtitle>년주 해석 - {PILLARS.year.hanja}</PdfSubtitle>
                  <PdfParagraph>
                    {PILLARS.year.detailedMeaning}
                  </PdfParagraph>
                  {stemInfo && branchInfo && (
                    <PdfParagraph>
                      천간 {stemInfo.korean}({stemInfo.hanja})은 {stemInfo.oheng}의 기운으로 {stemInfo.nature}의 성질을 가지며,
                      {stemInfo.characteristics}의 특성을 나타냅니다.
                      지지 {branchInfo.korean}({branchInfo.hanja})은 {branchInfo.animal}띠로 {branchInfo.season}의 기운을 담고 있으며,
                      {branchInfo.characteristics}의 특징이 있습니다.
                    </PdfParagraph>
                  )}
                  <PdfParagraph>
                    {analysis.common.chapter1_myeongshik.pillars.year?.combinedMeaning}
                  </PdfParagraph>
                </>
              );
            })()}

            {/* 월주 해석 */}
            {(() => {
              const monthStem = analysis.common.chapter1_myeongshik.pillars.month?.ganZhi.stem as CheonganHanja;
              const monthBranch = analysis.common.chapter1_myeongshik.pillars.month?.ganZhi.branch as JijiHanja;
              const stemInfo = monthStem ? CHEONGAN[monthStem] : null;
              const branchInfo = monthBranch ? JIJI[monthBranch] : null;
              return (
                <>
                  <PdfSubtitle>월주 해석 - {PILLARS.month.hanja}</PdfSubtitle>
                  <PdfParagraph>
                    {PILLARS.month.detailedMeaning}
                  </PdfParagraph>
                  {stemInfo && branchInfo && (
                    <PdfParagraph>
                      천간 {stemInfo.korean}({stemInfo.hanja})은 {stemInfo.oheng}의 기운으로 {stemInfo.nature}의 성질을 가지며,
                      {stemInfo.characteristics}의 특성을 나타냅니다.
                      지지 {branchInfo.korean}({branchInfo.hanja})은 {branchInfo.animal}띠로 {branchInfo.month}월의 기운을 담고 있으며,
                      {branchInfo.direction}방향, {branchInfo.characteristics}의 특징이 있습니다.
                    </PdfParagraph>
                  )}
                  <PdfParagraph>
                    {analysis.common.chapter1_myeongshik.pillars.month?.combinedMeaning}
                  </PdfParagraph>
                </>
              );
            })()}

            {/* 일주 해석 */}
            {(() => {
              const dayStem = analysis.common.chapter1_myeongshik.pillars.day?.ganZhi.stem as CheonganHanja;
              const dayBranch = analysis.common.chapter1_myeongshik.pillars.day?.ganZhi.branch as JijiHanja;
              const stemInfo = dayStem ? CHEONGAN[dayStem] : null;
              const branchInfo = dayBranch ? JIJI[dayBranch] : null;
              return (
                <>
                  <PdfSubtitle>일주 해석 - {PILLARS.day.hanja}</PdfSubtitle>
                  <PdfParagraph>
                    {PILLARS.day.detailedMeaning}
                  </PdfParagraph>
                  {stemInfo && branchInfo && (
                    <PdfParagraph>
                      일간 {stemInfo.korean}({stemInfo.hanja})은 본인의 본질적 성격을 나타내며, {stemInfo.oheng}의 기운으로 {stemInfo.nature}의 성질을 가집니다.
                      {stemInfo.characteristics}의 특성이 기본 성향입니다. 신체적으로는 {stemInfo.bodyPart}와 연관됩니다.
                      일지 {branchInfo.korean}({branchInfo.hanja})은 {branchInfo.animal}의 기운으로 배우자궁을 나타내며,
                      {branchInfo.characteristics}의 특징이 내면과 가정생활에 영향을 줍니다.
                    </PdfParagraph>
                  )}
                  <PdfParagraph>
                    {analysis.common.chapter1_myeongshik.pillars.day?.combinedMeaning}
                  </PdfParagraph>
                </>
              );
            })()}

            {/* 시주 해석 */}
            {analysis.common.chapter1_myeongshik.pillars.hour && (() => {
              const hourStem = analysis.common.chapter1_myeongshik.pillars.hour?.ganZhi.stem as CheonganHanja;
              const hourBranch = analysis.common.chapter1_myeongshik.pillars.hour?.ganZhi.branch as JijiHanja;
              const stemInfo = hourStem ? CHEONGAN[hourStem] : null;
              const branchInfo = hourBranch ? JIJI[hourBranch] : null;
              return (
                <>
                  <PdfSubtitle>시주 해석 - {PILLARS.hour.hanja}</PdfSubtitle>
                  <PdfParagraph>
                    {PILLARS.hour.detailedMeaning}
                  </PdfParagraph>
                  {stemInfo && branchInfo && (
                    <PdfParagraph>
                      천간 {stemInfo.korean}({stemInfo.hanja})은 {stemInfo.oheng}의 기운으로 {stemInfo.nature}의 성질을 가지며,
                      {stemInfo.characteristics}의 특성을 나타냅니다.
                      지지 {branchInfo.korean}({branchInfo.hanja})은 {branchInfo.animal}의 기운으로 {branchInfo.hour} 시간대에 해당하며,
                      {branchInfo.characteristics}의 특징이 자녀운과 말년에 영향을 줍니다.
                    </PdfParagraph>
                  )}
                  <PdfParagraph>
                    {analysis.common.chapter1_myeongshik.pillars.hour?.combinedMeaning}
                  </PdfParagraph>
                </>
              );
            })()}

            <PdfSubtitle>종합 해석</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter1_myeongshik.summary}
            </PdfParagraph>

            {/* 서술형 풀이 */}
            {analysis.common.chapter1_myeongshik.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.common.chapter1_myeongshik.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제2장: 음양오행 */}
        {analysis?.common.chapter2_eumyangOheng && (
          <PdfChapterPage chapterNumber={2} title="음양오행" hanja="陰陽五行" >
            <PdfParagraph>
              {CHAPTER_INTROS.eumyangOheng.intro}
            </PdfParagraph>

            <PdfSubtitle>신강신약 판정</PdfSubtitle>
            <PdfParagraph>
              <PdfHighlight>{data.name}</PdfHighlight>님의 일간(日干) 기운을 분석한 결과,
              <PdfHighlight> {analysis.common.chapter2_eumyangOheng.sinGangSinYak.result}</PdfHighlight>으로
              판정되었습니다. {analysis.common.chapter2_eumyangOheng.sinGangSinYak.explanation}
            </PdfParagraph>
            <PdfQuote>
              {analysis.common.chapter2_eumyangOheng.sinGangSinYak.implications}
            </PdfQuote>

            <PdfSubtitle>음양 균형</PdfSubtitle>
            <PdfParagraph>
              양(陽)의 기운이 {analysis.common.chapter2_eumyangOheng.yinYangBalance.yangCount}개,
              음(陰)의 기운이 {analysis.common.chapter2_eumyangOheng.yinYangBalance.yinCount}개로
              {analysis.common.chapter2_eumyangOheng.yinYangBalance.balance} 성향을 보입니다.
              {analysis.common.chapter2_eumyangOheng.yinYangBalance.interpretation}
            </PdfParagraph>

            <PdfSubtitle>음양 균형</PdfSubtitle>

            {/* 음양 균형 인포그래픽 */}
            <PdfYinYangGauge
              yinPercentage={Math.round((analysis.common.chapter2_eumyangOheng.yinYangBalance.yinCount /
                (analysis.common.chapter2_eumyangOheng.yinYangBalance.yinCount + analysis.common.chapter2_eumyangOheng.yinYangBalance.yangCount)) * 100)}
              yangPercentage={Math.round((analysis.common.chapter2_eumyangOheng.yinYangBalance.yangCount /
                (analysis.common.chapter2_eumyangOheng.yinYangBalance.yinCount + analysis.common.chapter2_eumyangOheng.yinYangBalance.yangCount)) * 100)}
            />

            <PdfSubtitle>오행 분포</PdfSubtitle>

            {/* 오행 분포 인포그래픽 */}
            <PdfElementChart
              distribution={analysis.common.chapter2_eumyangOheng.fiveElements.distribution.map(elem => ({
                element: elem.element as import("@/types/saju").FiveElement,
                count: elem.count,
                percentage: elem.percentage,
              }))}
            />

            <PdfParagraph>
              {analysis.common.chapter2_eumyangOheng.fiveElements.distribution
                .filter(e => e.strength === "과다" || e.strength === "부족" || e.strength === "없음")
                .map(e => getElementStrengthDescription(fiveElementToKorean(e.element), e.strength) + ". ")
                .join("")}
            </PdfParagraph>

            <PdfDivider />

            <PdfSubtitle>오행 상생상극</PdfSubtitle>
            <PdfParagraph>
              {OHENG_RELATIONS.sangsaeng.description}
              {" "}
              {OHENG_RELATIONS.sangsaeng.relations.map(r => r.meaning).join(" ")}
            </PdfParagraph>
            <PdfParagraph>
              {OHENG_RELATIONS.sanggeuk.description}
              {" "}
              {OHENG_RELATIONS.sanggeuk.relations.map(r => r.meaning).join(" ")}
            </PdfParagraph>

            {/* 서술형 풀이 */}
            {analysis.common.chapter2_eumyangOheng.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.common.chapter2_eumyangOheng.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제3장: 십성 */}
        {analysis?.genderBranch.chapter3_sipseong && (
          <PdfChapterPage chapterNumber={3} title="십성" hanja="十星" >
            <PdfParagraph>
              {CHAPTER_INTROS.sipseong.intro}
            </PdfParagraph>

            <PdfSubtitle>십신의 다섯 그룹</PdfSubtitle>
            <PdfParagraph>
              십신은 비겁(비견/겁재), 식상(식신/상관), 재성(편재/정재), 관성(편관/정관), 인성(편인/정인)의 다섯 그룹으로 나뉩니다.
              {Object.entries(SIPSIN_GROUPS).map(([groupName, group]) => ` ${groupName}은 ${group.meaning.split(" - ")[1] || group.meaning}을 나타냅니다.`).join("")}
            </PdfParagraph>

            <PdfSubtitle>주요 십신: {analysis.genderBranch.chapter3_sipseong.dominantGod.name}</PdfSubtitle>
            {(() => {
              const dominantName = analysis.genderBranch.chapter3_sipseong.dominantGod.name as SipsinName;
              const sipsinInfo = SIPSIN[dominantName];
              return (
                <>
                  {sipsinInfo && (
                    <PdfParagraph>
                      {sipsinInfo.name}({sipsinInfo.hanja})은 {sipsinInfo.group} 그룹에 속하며, {sipsinInfo.relation}입니다.
                      {sipsinInfo.basicMeaning} 긍정적으로는 {sipsinInfo.positiveTraits.slice(0, 3).join(", ")}의 특성이 있고,
                      과할 경우 {sipsinInfo.negativeTraits.slice(0, 2).join(", ")} 등이 나타날 수 있습니다.
                      {data.gender === "male" ? sipsinInfo.maleInterpretation : sipsinInfo.femaleInterpretation}
                    </PdfParagraph>
                  )}
                  <PdfParagraph>
                    {analysis.genderBranch.chapter3_sipseong.dominantGod.influence}
                  </PdfParagraph>
                </>
              );
            })()}

            <PdfSubtitle>십신 분석</PdfSubtitle>

            {/* 십성 분포 인포그래픽 */}
            <PdfTenGodsChart
              gods={analysis.genderBranch.chapter3_sipseong.tenGods.map(god => ({
                name: god.name,
                count: god.count,
                description: god.genderSpecificMeaning,
              }))}
            />

            {analysis.genderBranch.chapter3_sipseong.tenGods.slice(0, 6).map((god) => {
              const sipsinInfo = SIPSIN[god.name as SipsinName];
              return (
                <div key={god.name} className="mb-4">
                  <p className="text-[#5d4d3d] font-medium mb-1">
                    {god.name} ({god.hanja}) - {god.count}개
                  </p>
                  {sipsinInfo && (
                    <PdfParagraph>
                      {sipsinInfo.symbolism}
                    </PdfParagraph>
                  )}
                  <PdfParagraph>
                    {god.genderSpecificMeaning}
                  </PdfParagraph>
                </div>
              );
            })}

            {/* 서술형 풀이 */}
            {analysis.genderBranch.chapter3_sipseong.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.genderBranch.chapter3_sipseong.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제4장: 격국 */}
        {analysis?.common.chapter4_geokguk && (
          <PdfChapterPage chapterNumber={4} title="격국" hanja="格局" >
            <PdfParagraph>
              {CHAPTER_INTROS.geokguk.intro}
            </PdfParagraph>

            <PdfSubtitle>격국의 종류</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.geokguk.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>
              {data.name}님의 격국: {analysis.common.chapter4_geokguk.mainFormat.name} ({analysis.common.chapter4_geokguk.mainFormat.hanja})
            </PdfSubtitle>
            <PdfParagraph>
              분류: {analysis.common.chapter4_geokguk.mainFormat.category} | 강도: {analysis.common.chapter4_geokguk.mainFormat.strength}
            </PdfParagraph>
            <PdfParagraph>
              {analysis.common.chapter4_geokguk.formatMeaning.basicCharacter}
            </PdfParagraph>

            <PdfSubtitle>성격과 기질</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter4_geokguk.mainFormat.name}은 {analysis.common.chapter4_geokguk.mainFormat.category === "정격"
                ? "일반적인 사주 구조로, 균형 잡힌 삶의 방향을 추구합니다."
                : "특수한 사주 구조로, 독특한 삶의 패턴과 성취 방식을 가집니다."}
              {" "}격국의 강도가 {analysis.common.chapter4_geokguk.mainFormat.strength}이므로,
              {analysis.common.chapter4_geokguk.mainFormat.strength === "강"
                ? " 해당 격국의 특성이 매우 뚜렷하게 나타나며 일관된 방향성을 보입니다."
                : analysis.common.chapter4_geokguk.mainFormat.strength === "중"
                  ? " 해당 격국의 특성이 적절히 발현되며 상황에 따라 유연하게 대처합니다."
                  : " 해당 격국의 특성이 은은하게 나타나며 다른 요소들의 영향도 받습니다."}
            </PdfParagraph>

            <PdfSubtitle>직업 성향</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter4_geokguk.formatMeaning.careerTendency}
            </PdfParagraph>

            <PdfSubtitle>재물 패턴</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter4_geokguk.formatMeaning.wealthPattern}
            </PdfParagraph>

            <PdfSubtitle>인간관계 스타일</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter4_geokguk.mainFormat.category === "정격"
                ? `${analysis.common.chapter4_geokguk.mainFormat.name}은 대인관계에서 ${
                    analysis.common.chapter4_geokguk.mainFormat.name.includes("관")
                      ? "권위와 책임감을 중시하며, 조직 내에서 리더십을 발휘하는 경향이 있습니다. 상하 관계를 명확히 하고 체계적인 관계를 선호합니다."
                      : analysis.common.chapter4_geokguk.mainFormat.name.includes("재")
                        ? "실리적이고 현실적인 관계를 추구하며, 경제적 이해관계를 중심으로 네트워크를 형성합니다. 사업 파트너십에 능합니다."
                        : analysis.common.chapter4_geokguk.mainFormat.name.includes("인")
                          ? "지식과 학문을 매개로 한 관계를 중시하며, 스승이나 멘토 역할을 잘 수행합니다. 깊이 있는 대화를 선호합니다."
                          : analysis.common.chapter4_geokguk.mainFormat.name.includes("식") || analysis.common.chapter4_geokguk.mainFormat.name.includes("상")
                            ? "자유롭고 창의적인 관계를 추구하며, 예술이나 아이디어를 공유하는 사람들과 잘 어울립니다. 표현력이 풍부합니다."
                            : "자기 주장이 강하고 독립적인 관계를 추구합니다. 동등한 입장에서의 협력 관계를 선호합니다."
                  }`
                : "특수 격국으로서 일반적인 대인관계 패턴과 다른 독특한 스타일을 보입니다. 깊이 있는 소수의 관계를 선호하거나, 특정 분야에서 독보적인 위치를 추구합니다."}
            </PdfParagraph>

            {/* 서술형 풀이 - chapter4에 narrative가 있다면 표시 */}
            {analysis.common.chapter4_geokguk.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.common.chapter4_geokguk.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제5장: 신살 */}
        {analysis?.common.chapter5_sinsal && (
          <PdfChapterPage chapterNumber={5} title="신살" hanja="神煞" >
            <PdfParagraph>
              {CHAPTER_INTROS.sinsal.intro}
            </PdfParagraph>

            <PdfSubtitle>신살의 개념</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.sinsal.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>신살 종합 분석</PdfSubtitle>
            <PdfParagraph>
              {data.name}님의 사주에는 총 {analysis.common.chapter5_sinsal.guiins.length}개의 귀인과 {analysis.common.chapter5_sinsal.sinsals.length}개의 신살이 있습니다.
              {analysis.common.chapter5_sinsal.guiins.length > analysis.common.chapter5_sinsal.sinsals.length
                ? " 길신이 흉살보다 많아 전반적으로 귀인의 도움을 받기 쉬운 사주입니다. 어려운 상황에서도 주변의 도움으로 위기를 넘기는 경우가 많습니다."
                : analysis.common.chapter5_sinsal.guiins.length < analysis.common.chapter5_sinsal.sinsals.length
                  ? " 신살이 귀인보다 많지만, 이는 강한 에너지를 가졌다는 의미이기도 합니다. 신살의 에너지를 잘 활용하면 오히려 큰 성취를 이룰 수 있습니다."
                  : " 귀인과 신살이 균형을 이루고 있어, 좋은 기회와 도전이 함께 찾아옵니다. 지혜롭게 대처하면 성장의 발판이 됩니다."}
            </PdfParagraph>

            <PdfSubtitle>길신 (貴人) - 도움과 행운의 별</PdfSubtitle>
            <PdfParagraph>
              귀인은 삶에서 도움을 주는 귀한 존재를 만나게 하는 별입니다. 사회생활에서 후원자나 조력자를 만나기 쉽고, 위기 상황에서 예상치 못한 도움을 받습니다.
            </PdfParagraph>
            {analysis.common.chapter5_sinsal.guiins.slice(0, 5).map((item, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-[#5d4d3d] font-medium mb-1">
                  {item.name} ({item.hanja})
                </p>
                <PdfParagraph>
                  {item.detailedInterpretation}
                </PdfParagraph>
              </div>
            ))}

            <PdfDivider />

            <PdfSubtitle>신살 (煞) - 주의와 성장의 별</PdfSubtitle>
            <PdfParagraph>
              신살은 주의가 필요한 에너지이지만, 그 자체로 나쁜 것이 아닙니다. 강한 에너지를 담고 있어 잘 활용하면 오히려 특별한 능력이 되고, 적절한 보완법으로 부정적 영향을 줄일 수 있습니다.
            </PdfParagraph>
            {analysis.common.chapter5_sinsal.sinsals.slice(0, 5).map((item, idx) => (
              <div key={idx} className="mb-4">
                <p className="text-[#5d4d3d] font-medium mb-1">
                  {item.name} ({item.hanja})
                </p>
                <PdfParagraph>
                  {item.detailedInterpretation}
                </PdfParagraph>
                {item.remedy && (
                  <p className="text-[#6b8e5a] text-sm mt-1 pl-4">
                    ▸ 보완법: {item.remedy}
                  </p>
                )}
              </div>
            ))}

            {/* 신살 활용 조언 */}
            <PdfSubtitle>신살 활용 조언</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter5_sinsal.guiins.some(g => g.name.includes("귀인"))
                ? "귀인이 있는 사주는 평소 인간관계를 소중히 하면 좋습니다. 윗사람이나 선배와의 관계를 잘 유지하면 중요한 순간에 도움을 받습니다. "
                : ""}
              {analysis.common.chapter5_sinsal.sinsals.some(s => s.name.includes("역마"))
                ? "역마살은 이동과 변화의 에너지입니다. 해외 진출, 여행 관련 사업, 영업직 등에서 능력을 발휘할 수 있습니다. "
                : ""}
              {analysis.common.chapter5_sinsal.sinsals.some(s => s.name.includes("도화"))
                ? "도화살은 매력과 예술적 재능을 나타냅니다. 연예, 예술, 서비스업 등 사람을 상대하는 분야에서 빛을 발합니다. "
                : ""}
              {analysis.common.chapter5_sinsal.sinsals.some(s => s.name.includes("화개"))
                ? "화개살은 깊은 통찰력과 예술적 감각을 나타냅니다. 종교, 철학, 예술, 학문 분야에서 성취를 이룰 수 있습니다. "
                : ""}
              신살의 에너지를 두려워하지 말고, 그 특성을 이해하고 활용하는 지혜가 필요합니다.
            </PdfParagraph>

            {/* 서술형 풀이 */}
            {analysis.common.chapter5_sinsal.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.common.chapter5_sinsal.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제6장: 12운성 */}
        {analysis?.common.chapter6_sipiUnseong && (
          <PdfChapterPage chapterNumber={6} title="12운성" hanja="十二運星" >
            <PdfParagraph>
              {CHAPTER_INTROS.sipiUnseong.intro}
            </PdfParagraph>

            <PdfSubtitle>12운성의 의미</PdfSubtitle>
            <PdfParagraph>
              12운성은 생명의 순환을 12단계로 표현합니다. 태(胎)는 잉태의 단계, 양(養)은 양육의 단계, 장생(長生)은 탄생과 성장, 목욕(沐浴)은 세상에 나온 첫 단계, 관대(冠帶)는 성인이 되는 단계, 건록(建祿)은 사회 진출, 제왕(帝旺)은 최고 전성기, 쇠(衰)는 내려가는 단계, 병(病)은 약해지는 단계, 사(死)는 기운이 다하는 단계, 묘(墓)는 저장되는 단계, 절(絶)은 끝과 새로운 시작을 의미합니다.
            </PdfParagraph>

            <PdfSubtitle>12운성의 에너지 분류</PdfSubtitle>
            <PdfParagraph>
              12운성은 크게 왕성한 기운(장생, 관대, 건록, 제왕)과 쇠퇴하는 기운(쇠, 병, 사, 묘, 절)으로 나눌 수 있습니다. 왕성한 운성이 많으면 적극적이고 활동적인 삶을, 쇠퇴하는 운성이 많으면 내면적이고 사색적인 삶을 지향합니다. 그러나 묘(墓)나 절(絶)이 반드시 나쁜 것은 아니며, 잠재된 에너지나 영적 통찰력을 의미하기도 합니다.
            </PdfParagraph>

            <PdfSubtitle>{data.name}님의 12운성 분석</PdfSubtitle>
            {["yearPillar", "monthPillar", "dayPillar"].map((key) => {
              const pillar = analysis.common.chapter6_sipiUnseong.fortunesByPillar[
                key as keyof typeof analysis.common.chapter6_sipiUnseong.fortunesByPillar
              ];
              if (!pillar) return null;
              const labels = { yearPillar: "년주", monthPillar: "월주", dayPillar: "일주" };
              const pillarMeaning = {
                yearPillar: "조상과 유년기의 운",
                monthPillar: "부모와 청년기의 운",
                dayPillar: "본인과 중년기의 운"
              };
              return (
                <div key={key} className="mb-4">
                  <p className="text-[#5d4d3d] font-medium mb-1">
                    {labels[key as keyof typeof labels]} ({pillarMeaning[key as keyof typeof pillarMeaning]}): {pillar.name}
                  </p>
                  <PdfParagraph>
                    {pillar.meaning}
                    {pillar.name === "제왕" && " 이 시기에 가장 강한 에너지와 성취를 경험합니다."}
                    {pillar.name === "장생" && " 새로운 시작과 성장의 기운이 강합니다."}
                    {pillar.name === "건록" && " 안정적인 발전과 사회적 성취가 기대됩니다."}
                    {pillar.name === "관대" && " 명예와 인정을 받는 시기입니다."}
                    {pillar.name === "목욕" && " 변화와 정화의 기운이 있습니다."}
                    {pillar.name === "묘" && " 내면의 잠재력이 축적되어 있습니다."}
                  </PdfParagraph>
                </div>
              );
            })}

            <PdfSubtitle>삶의 에너지 흐름</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter6_sipiUnseong.overallPattern}
            </PdfParagraph>

            <PdfSubtitle>12운성 활용 조언</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const pillars = analysis.common.chapter6_sipiUnseong.fortunesByPillar;
                const names = [pillars.yearPillar?.name, pillars.monthPillar?.name, pillars.dayPillar?.name].filter(Boolean);
                const hasStrong = names.some(n => ["제왕", "건록", "관대", "장생"].includes(n || ""));
                const hasWeak = names.some(n => ["병", "사", "묘", "절"].includes(n || ""));

                if (hasStrong && !hasWeak) {
                  return "12운성 전반적으로 왕성한 기운을 가지고 있어 적극적인 활동과 도전이 어울립니다. 자신감을 가지고 목표를 향해 나아가되, 지나친 과욕은 경계하세요.";
                } else if (!hasStrong && hasWeak) {
                  return "12운성이 내면을 향하는 기운이 많아 사색적이고 영적인 성향이 있습니다. 명상, 학문, 예술 등 내면을 발전시키는 활동이 좋습니다. 때가 되면 축적된 에너지가 발현됩니다.";
                } else {
                  return "왕성한 기운과 내면적 기운이 조화를 이루고 있어, 외부 활동과 내면 성찰을 균형 있게 하면 좋습니다. 상황에 따라 적극적으로 나서거나 때로는 물러서서 관조하는 지혜가 필요합니다.";
                }
              })()}
            </PdfParagraph>

            {/* 서술형 풀이 */}
            {analysis.common.chapter6_sipiUnseong.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.common.chapter6_sipiUnseong.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제7장: 대운 */}
        {analysis?.common.chapter7_daeun && (
          <PdfChapterPage chapterNumber={7} title="대운" hanja="大運" >
            <PdfParagraph>
              {CHAPTER_INTROS.daeun.intro}
            </PdfParagraph>

            <PdfSubtitle>대운의 원리</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.daeun.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>현재 대운: {analysis.common.chapter7_daeun.currentDaeun.detail.ganZhi.fullKr}</PdfSubtitle>
            <PdfParagraph>
              현재 {analysis.common.chapter7_daeun.currentDaeun.detail.startAge}세부터
              {analysis.common.chapter7_daeun.currentDaeun.detail.endAge}세까지의 대운 중에 있으며,
              <PdfHighlight> {analysis.common.chapter7_daeun.currentDaeun.detail.ganZhi.fullKr}</PdfHighlight> 대운이
              {analysis.common.chapter7_daeun.currentDaeun.progress}% 진행되었습니다.
              이 시기는 {analysis.common.chapter7_daeun.currentDaeun.detail.relationToYongsin}의 성격을 띱니다.
            </PdfParagraph>

            {/* 현재 대운 상세 해석 */}
            {(() => {
              const currentStem = analysis.common.chapter7_daeun.currentDaeun.detail.ganZhi.stem as CheonganHanja;
              const currentBranch = analysis.common.chapter7_daeun.currentDaeun.detail.ganZhi.branch as JijiHanja;
              const stemInfo = CHEONGAN[currentStem];
              const branchInfo = JIJI[currentBranch];
              return stemInfo && branchInfo ? (
                <PdfParagraph>
                  천간 {stemInfo.korean}({stemInfo.hanja})은 {stemInfo.oheng}의 기운으로 {stemInfo.characteristics}의 특성을 가지며,
                  지지 {branchInfo.korean}({branchInfo.hanja})은 {branchInfo.animal}의 기운으로 {branchInfo.characteristics}의 특성을 나타냅니다.
                  이 대운 동안 {stemInfo.nature}처럼 {stemInfo.oheng}의 에너지가 주도하여 {
                    stemInfo.oheng === "목" ? "성장과 발전, 새로운 시작의 기회가 많습니다." :
                    stemInfo.oheng === "화" ? "열정과 표현, 인정받는 일이 많아집니다." :
                    stemInfo.oheng === "토" ? "안정과 중재, 기반을 다지는 시기입니다." :
                    stemInfo.oheng === "금" ? "결단과 실행, 결실을 맺는 시기입니다." :
                    "지혜와 유연함, 내면을 성장시키는 시기입니다."
                  }
                </PdfParagraph>
              ) : null;
            })()}

            <PdfSubtitle>대운 흐름</PdfSubtitle>

            {/* 대운 타임라인 인포그래픽 */}
            {(() => {
              const getOhengToElement = (oheng: string): import("@/types/saju").FiveElement => {
                const map: Record<string, import("@/types/saju").FiveElement> = {
                  "목": "wood", "화": "fire", "토": "earth", "금": "metal", "수": "water"
                };
                return map[oheng] || "wood";
              };
              const getStemElement = (stem: string): import("@/types/saju").FiveElement => {
                const info = CHEONGAN[stem as CheonganHanja];
                return info ? getOhengToElement(info.oheng) : "earth";
              };
              const currentAge = new Date().getFullYear() - data.birthYear;
              return (
                <PdfDaeunTimeline
                  periods={analysis.common.chapter7_daeun.allDaeuns.slice(0, 6).map((daeun, idx) => ({
                    startAge: daeun.startAge,
                    endAge: daeun.endAge,
                    heavenlyStem: daeun.ganZhi.stemKr,
                    earthlyBranch: daeun.ganZhi.branchKr,
                    element: getStemElement(daeun.ganZhi.stem),
                    description: daeun.relationToYongsin + " 운세",
                    isCurrent: daeun.startAge <= currentAge && daeun.endAge >= currentAge,
                  }))}
                  currentAge={currentAge}
                />
              );
            })()}

            <PdfSubtitle>대운별 흐름 요약</PdfSubtitle>
            {analysis.common.chapter7_daeun.allDaeuns.slice(0, 6).map((daeun) => {
              const stemInfo = CHEONGAN[daeun.ganZhi.stem as CheonganHanja];
              return (
                <div key={daeun.startAge} className="mb-2">
                  <p className="text-[#5d4d3d] font-medium">
                    {daeun.startAge}~{daeun.endAge}세: {daeun.ganZhi.fullKr} ({daeun.relationToYongsin})
                  </p>
                  {stemInfo && (
                    <p className="text-[#6b5b4f] text-sm pl-4">
                      {stemInfo.oheng}의 기운이 주도하는 시기로, {stemInfo.characteristics}의 특성이 강화됩니다.
                    </p>
                  )}
                </div>
              );
            })}

            <PdfSubtitle>인생 전체 개요</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter7_daeun.lifetimeOverview}
            </PdfParagraph>

            <PdfSubtitle>대운 활용 조언</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const currentRelation = analysis.common.chapter7_daeun.currentDaeun.detail.relationToYongsin;
                if (currentRelation.includes("용신") || currentRelation.includes("길")) {
                  return "현재 대운이 용신과 조화를 이루어 좋은 시기입니다. 적극적인 도전과 투자가 좋은 결실을 맺을 수 있습니다. 이 시기의 기회를 놓치지 마시고, 평소 하고 싶었던 일을 실행에 옮기세요.";
                } else if (currentRelation.includes("기신") || currentRelation.includes("흉")) {
                  return "현재 대운이 도전적인 시기입니다. 무리한 확장보다는 내실을 다지고, 건강과 인간관계에 더 신경 쓰세요. 이 시기를 잘 견디면 다음 대운에서 크게 도약할 수 있습니다.";
                } else {
                  return "현재 대운은 안정적인 시기입니다. 급격한 변화보다는 꾸준한 노력이 좋은 결과를 가져옵니다. 기초를 다지고 내공을 쌓는 시간으로 활용하세요.";
                }
              })()}
            </PdfParagraph>

            {analysis.common.chapter7_daeun.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.common.chapter7_daeun.narrative.intro}</PdfParagraph>
                {analysis.common.chapter7_daeun.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.common.chapter7_daeun.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제8장: 세운 */}
        {analysis?.common.chapter8_yearly && (
          <PdfChapterPage chapterNumber={8} title="세운" hanja="歲運" >
            <PdfParagraph>
              {CHAPTER_INTROS.yearly.intro}
            </PdfParagraph>

            <PdfSubtitle>세운의 원리</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.yearly.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>올해 운세: {new Date().getFullYear()}년</PdfSubtitle>
            {(() => {
              const currentYear = analysis.common.chapter8_yearly.currentYear;
              const currentYearForecast = analysis.common.chapter8_yearly.tenYearForecast.find(
                y => y.year === new Date().getFullYear()
              );
              const overallScore = currentYearForecast?.overallScore || 50;
              const stemInfo = CHEONGAN[currentYear.detail.ganZhi.stem as CheonganHanja];
              const branchInfo = JIJI[currentYear.detail.ganZhi.branch as JijiHanja];
              return (
                <>
                  <PdfParagraph>
                    올해는 {currentYear.detail.ganZhi.fullKr}년으로, 운세 점수는 {overallScore}점입니다.
                    {overallScore >= 70 ? " 전반적으로 좋은 기운이 흐르는 해입니다." :
                     overallScore >= 50 ? " 안정적인 흐름 속에서 기회를 찾을 수 있는 해입니다." :
                     " 주의가 필요한 부분이 있으니 신중하게 행동하세요."}
                  </PdfParagraph>
                  {stemInfo && branchInfo && (
                    <PdfParagraph>
                      {stemInfo.korean}({stemInfo.hanja})은 {stemInfo.oheng}의 기운이며 {stemInfo.characteristics}의 특성을,
                      {branchInfo.korean}({branchInfo.hanja})은 {branchInfo.animal}띠의 해로 {branchInfo.characteristics}의 에너지를 가집니다.
                      이 해는 {currentYear.detail.relationToYongsin}의 성격을 띠므로,
                      {currentYear.detail.relationToYongsin.includes("용신") || currentYear.detail.relationToYongsin.includes("길")
                        ? " 적극적인 활동이 좋은 결과를 가져올 것입니다."
                        : currentYear.detail.relationToYongsin.includes("기신") || currentYear.detail.relationToYongsin.includes("흉")
                          ? " 보수적인 접근과 신중한 결정이 필요합니다."
                          : " 균형 잡힌 접근이 좋습니다."}
                    </PdfParagraph>
                  )}
                  <PdfQuote>
                    {currentYear.detail.keyAdvice}
                  </PdfQuote>
                </>
              );
            })()}

            <PdfSubtitle>향후 10년 운세 흐름</PdfSubtitle>

            {/* 세운 캘린더 인포그래픽 */}
            {(() => {
              const getOhengToElement = (oheng: string): import("@/types/saju").FiveElement => {
                const map: Record<string, import("@/types/saju").FiveElement> = {
                  "목": "wood", "화": "fire", "토": "earth", "금": "metal", "수": "water"
                };
                return map[oheng] || "wood";
              };
              const getStemElement = (stem: string): import("@/types/saju").FiveElement => {
                const info = CHEONGAN[stem as CheonganHanja];
                return info ? getOhengToElement(info.oheng) : "earth";
              };
              const getBranchAnimal = (branch: string): string => {
                // 한자와 한글 모두 지원
                const infoHanja = JIJI[branch as JijiHanja];
                if (infoHanja) return infoHanja.animal;
                const infoKr = JIJI_KR[branch as JijiKr];
                return infoKr ? infoKr.animal : "용";
              };
              return (
                <PdfYearlyCalendar
                  years={analysis.common.chapter8_yearly.tenYearForecast.slice(0, 6).map((year) => ({
                    year: year.year,
                    heavenlyStem: year.ganZhi.stemKr,
                    earthlyBranch: year.ganZhi.branchKr,
                    animal: getBranchAnimal(year.ganZhi.branch),
                    element: getStemElement(year.ganZhi.stem),
                    rating: Math.min(5, Math.max(1, Math.round(year.overallScore / 20))) as 1 | 2 | 3 | 4 | 5,
                    summary: year.relationToYongsin,
                    isCurrent: year.year === new Date().getFullYear(),
                  }))}
                />
              );
            })()}

            <PdfSubtitle>연도별 상세 운세</PdfSubtitle>
            {analysis.common.chapter8_yearly.tenYearForecast.slice(0, 5).map((year) => {
              const stemInfo = CHEONGAN[year.ganZhi.stem as CheonganHanja];
              const branchInfo = JIJI[year.ganZhi.branch as JijiHanja];
              const scoreLabel = year.overallScore >= 80 ? "최길" : year.overallScore >= 60 ? "길" : year.overallScore >= 40 ? "평" : "주의";
              return (
                <div key={year.year} className="mb-3">
                  <p className="text-[#5d4d3d] font-medium">
                    {year.year}년 ({year.ganZhi.fullKr}, {branchInfo?.animal || ""}띠) - {year.overallScore}점 [{scoreLabel}]
                  </p>
                  <p className="text-[#6b5b4f] text-sm pl-4">
                    {stemInfo?.oheng || ""}의 기운이 흐르는 해. {year.relationToYongsin}.
                    {year.overallScore >= 70 ? " 도전과 확장에 좋은 해입니다." :
                     year.overallScore >= 50 ? " 안정적인 성장을 추구하세요." :
                     " 건강과 재정 관리에 주의가 필요합니다."}
                  </p>
                </div>
              );
            })}

            <PdfSubtitle>세운 활용 조언</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const goodYears = analysis.common.chapter8_yearly.tenYearForecast.filter(y => y.overallScore >= 70);
                const cautionYears = analysis.common.chapter8_yearly.tenYearForecast.filter(y => y.overallScore < 50);
                let advice = "";
                if (goodYears.length > 0) {
                  advice += `${goodYears.slice(0, 3).map(y => y.year).join(", ")}년은 특히 좋은 기운이 흐르므로, 중요한 결정이나 새로운 시작을 계획하기 좋습니다. `;
                }
                if (cautionYears.length > 0) {
                  advice += `${cautionYears.slice(0, 2).map(y => y.year).join(", ")}년은 신중함이 필요한 시기입니다. 무리한 투자나 큰 변화는 피하고, 건강 관리에 신경 쓰세요. `;
                }
                advice += "매년의 운세는 대운과 함께 작용하므로, 대운의 흐름도 함께 고려하여 판단하시기 바랍니다.";
                return advice;
              })()}
            </PdfParagraph>

            {analysis.common.chapter8_yearly.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.common.chapter8_yearly.narrative.intro}</PdfParagraph>
                {analysis.common.chapter8_yearly.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.common.chapter8_yearly.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제9장: 재물운 */}
        {analysis?.common.chapter9_wealth && (
          <PdfChapterPage chapterNumber={9} title="재물운" hanja="財物運" >
            <PdfParagraph>
              {CHAPTER_INTROS.wealth.intro}
            </PdfParagraph>

            <PdfSubtitle>재물 유형: {analysis.common.chapter9_wealth.wealthType.category}</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter9_wealth.wealthType.description}
            </PdfParagraph>

            <PdfSubtitle>수입 스타일</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter9_wealth.wealthType.earningStyle}
            </PdfParagraph>

            <PdfSubtitle>지출 패턴</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter9_wealth.wealthType.spendingPattern}
            </PdfParagraph>

            <PdfSubtitle>투자 성향</PdfSubtitle>
            <PdfParagraph>
              위험 감수 성향: {analysis.common.chapter9_wealth.investmentTendency.riskTolerance}
            </PdfParagraph>
            <PdfList items={[
              `적합한 투자: ${analysis.common.chapter9_wealth.investmentTendency.suitableInvestments.join(", ")}`,
              `피해야 할 투자: ${analysis.common.chapter9_wealth.investmentTendency.avoidInvestments.join(", ")}`,
            ]} />

            {/* 서술형 풀이 */}
            {analysis.common.chapter9_wealth.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.common.chapter9_wealth.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제10장: 직업운 */}
        {analysis?.occupationBranch.chapter10_career && (
          <PdfChapterPage chapterNumber={10} title="직업운" hanja="職業運" >
            <PdfParagraph>
              {CHAPTER_INTROS.career.intro}
            </PdfParagraph>

            <PdfSubtitle>적성 분야</PdfSubtitle>
            <PdfParagraph>
              {analysis.occupationBranch.chapter10_career.careerAptitude.bestFields.join(", ")}
            </PdfParagraph>

            <PdfSubtitle>추천 직업</PdfSubtitle>
            <PdfList items={analysis.occupationBranch.chapter10_career.careerAptitude.suitableJobs} />

            <PdfSubtitle>업무 스타일</PdfSubtitle>
            <PdfParagraph>
              리더십 유형: {analysis.occupationBranch.chapter10_career.workplaceStyle.leadershipType}
            </PdfParagraph>
            <PdfParagraph>
              팀워크 스타일: {analysis.occupationBranch.chapter10_career.workplaceStyle.teamworkStyle}
            </PdfParagraph>

            <PdfSubtitle>현재 상태에 대한 조언</PdfSubtitle>
            <PdfParagraph>
              {analysis.occupationBranch.chapter10_career.occupationSpecificAdvice.currentAdvice}
            </PdfParagraph>

            {/* 서술형 풀이 */}
            {analysis.occupationBranch.chapter10_career.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.occupationBranch.chapter10_career.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제11장: 건강운 */}
        {analysis?.ageBranch.chapter11_health && (
          <PdfChapterPage chapterNumber={11} title="건강운" hanja="健康運" >
            <PdfParagraph>
              {CHAPTER_INTROS.health.intro}
            </PdfParagraph>

            <PdfSubtitle>오행과 건강의 원리</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.health.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>체질 분석: {analysis.ageBranch.chapter11_health.constitutionType.name}</PdfSubtitle>
            <PdfParagraph>
              {data.name}님은 {analysis.ageBranch.chapter11_health.constitutionType.name}입니다.
              {analysis.ageBranch.chapter11_health.constitutionType.characteristics}
            </PdfParagraph>
            <PdfParagraph>
              이 체질은 특정 장기나 기능이 상대적으로 강하거나 약할 수 있으므로, 자신의 체질 특성을 이해하고 균형을 맞추는 것이 중요합니다.
            </PdfParagraph>

            <PdfSubtitle>식이 조언</PdfSubtitle>
            <PdfParagraph>
              {analysis.ageBranch.chapter11_health.constitutionType.dietAdvice}
            </PdfParagraph>

            <PdfSubtitle>운동 조언</PdfSubtitle>
            <PdfParagraph>
              {analysis.ageBranch.chapter11_health.constitutionType.exerciseAdvice}
            </PdfParagraph>

            <PdfSubtitle>오행별 건강 분석</PdfSubtitle>

            {/* 건강 바디맵 인포그래픽 */}
            <PdfHealthMap
              areas={analysis.ageBranch.chapter11_health.elementHealthMap.map((elem) => ({
                area: elem.organs.join(", "),
                element: elem.element as import("@/types/saju").FiveElement,
                status: elem.status === "취약" ? "warning" : elem.status === "주의" ? "caution" : "good",
                description: elem.status === "건강"
                  ? `${fiveElementToKorean(elem.element)} 계통이 양호한 상태입니다.`
                  : `${fiveElementToKorean(elem.element)} 계통 관리가 필요합니다. 주의 질환: ${elem.diseases.slice(0, 2).join(", ")}`,
              }))}
            />

            {analysis.ageBranch.chapter11_health.elementHealthMap.map((elem) => (
              <div key={elem.element} className="mb-3">
                <p className="text-[#5d4d3d] font-medium">
                  {fiveElementToKorean(elem.element)}({elem.element === "wood" ? "木" : elem.element === "fire" ? "火" : elem.element === "earth" ? "土" : elem.element === "metal" ? "金" : "水"})
                  <span className={`ml-2 ${elem.status === "취약" ? "text-red-600" : elem.status === "주의" ? "text-amber-600" : "text-green-600"}`}>
                    [{elem.status}]
                  </span>
                </p>
                <p className="text-[#6b5b4f] text-sm pl-4">
                  관련 장기: {elem.organs.join(", ")}
                  {elem.status !== "건강" && elem.diseases.length > 0 && (
                    <> | 주의 질환: {elem.diseases.slice(0, 3).join(", ")}</>
                  )}
                </p>
              </div>
            ))}

            <PdfSubtitle>건강 관리 종합 조언</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const weakElements = analysis.ageBranch.chapter11_health.elementHealthMap.filter(e => e.status === "취약" || e.status === "주의");
                const strongElements = analysis.ageBranch.chapter11_health.elementHealthMap.filter(e => e.status === "건강");
                let advice = "";

                if (weakElements.length > 0) {
                  advice += `${weakElements.map(e => fiveElementToKorean(e.element)).join(", ")} 계통의 장기가 상대적으로 약하므로 특별한 관리가 필요합니다. `;
                  weakElements.forEach(e => {
                    if (e.element === "wood") advice += "간과 담낭 건강을 위해 음주를 자제하고, 스트레스 관리에 신경 쓰세요. ";
                    else if (e.element === "fire") advice += "심장과 혈액순환을 위해 규칙적인 유산소 운동을 권합니다. ";
                    else if (e.element === "earth") advice += "소화기 건강을 위해 규칙적인 식사와 적절한 휴식이 중요합니다. ";
                    else if (e.element === "metal") advice += "호흡기 건강을 위해 깨끗한 공기와 적절한 습도 유지가 좋습니다. ";
                    else if (e.element === "water") advice += "신장과 비뇨기 건강을 위해 충분한 수분 섭취와 과로를 피하세요. ";
                  });
                }

                if (strongElements.length > 0) {
                  advice += `${strongElements.map(e => fiveElementToKorean(e.element)).join(", ")} 계통은 비교적 양호하지만, 지나치게 강한 기운도 균형을 깨뜨릴 수 있으니 과신하지 마세요.`;
                }

                return advice || "전반적으로 균형 잡힌 건강 상태입니다. 규칙적인 생활과 적절한 운동으로 현재 상태를 유지하세요.";
              })()}
            </PdfParagraph>

            <PdfSubtitle>계절별 건강 관리</PdfSubtitle>
            <PdfParagraph>
              봄(목)에는 간 건강에 주의하고, 여름(화)에는 심장과 혈압 관리를, 환절기(토)에는 소화기를, 가을(금)에는 호흡기를, 겨울(수)에는 신장과 관절 건강에 신경 쓰세요.
              계절에 맞는 음식과 활동을 선택하면 오행의 균형을 유지하는 데 도움이 됩니다.
            </PdfParagraph>

            {analysis.ageBranch.chapter11_health.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.ageBranch.chapter11_health.narrative.intro}</PdfParagraph>
                {analysis.ageBranch.chapter11_health.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.ageBranch.chapter11_health.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제12장: 연애 스타일 */}
        {analysis?.common.chapter12_loveStyle && (
          <PdfChapterPage chapterNumber={12} title="연애 스타일" >
            <PdfParagraph>
              {CHAPTER_INTROS.loveStyle.intro}
            </PdfParagraph>

            <PdfSubtitle>연애와 사주의 관계</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.loveStyle.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>{data.name}님의 연애 유형: {analysis.common.chapter12_loveStyle.loveStyle.type}</PdfSubtitle>
            <PdfParagraph>
              {analysis.common.chapter12_loveStyle.loveStyle.description}
            </PdfParagraph>
            <PdfParagraph>
              {analysis.common.chapter12_loveStyle.loveStyle.type.includes("열정") || analysis.common.chapter12_loveStyle.loveStyle.type.includes("적극")
                ? "연애에 있어 주도적이고 적극적인 편으로, 상대방에게 먼저 다가가는 것을 두려워하지 않습니다. 감정 표현이 풍부하고 사랑에 빠지면 온 마음을 다합니다."
                : analysis.common.chapter12_loveStyle.loveStyle.type.includes("신중") || analysis.common.chapter12_loveStyle.loveStyle.type.includes("안정")
                  ? "연애에 있어 신중하고 천천히 관계를 발전시키는 편입니다. 믿음과 신뢰를 바탕으로 한 안정적인 사랑을 추구하며, 한번 사랑하면 오래 지속됩니다."
                  : "연애에 있어 자연스러운 만남과 감정의 흐름을 중시합니다. 상대방을 존중하면서도 자신만의 개성을 유지하는 균형 잡힌 사랑을 추구합니다."}
            </PdfParagraph>

            <PdfSubtitle>매력 포인트</PdfSubtitle>
            <PdfParagraph>
              {data.name}님만의 특별한 매력은 다음과 같습니다:
            </PdfParagraph>
            <PdfList items={analysis.common.chapter12_loveStyle.loveStyle.attractionPoints} />

            <PdfSubtitle>이상형 분석</PdfSubtitle>
            <PdfParagraph>
              사주 분석에 따르면, {data.name}님에게 잘 맞는 이상형은 다음과 같습니다.
            </PdfParagraph>
            <PdfParagraph>
              성격적 이상형: {analysis.common.chapter12_loveStyle.idealPartner.personality.join(", ")}
            </PdfParagraph>
            <PdfParagraph>
              외모적 이상형: {analysis.common.chapter12_loveStyle.idealPartner.appearance}
            </PdfParagraph>
            <PdfParagraph>
              {data.gender === "male"
                ? "남성의 경우 재성(財星)이 배우자를 나타내므로, 재성의 특성에 맞는 분을 만나면 좋은 인연이 될 가능성이 높습니다."
                : "여성의 경우 관성(官星)이 배우자를 나타내므로, 관성의 특성에 맞는 분을 만나면 좋은 인연이 될 가능성이 높습니다."}
            </PdfParagraph>

            <PdfSubtitle>연애 시 강점과 약점</PdfSubtitle>
            <PdfParagraph>
              강점: {analysis.common.chapter12_loveStyle.loveStyle.attractionPoints.slice(0, 2).join(", ")}
              {" "}등이 연애에서 {data.name}님의 큰 강점입니다.
            </PdfParagraph>
            <PdfParagraph>
              주의점: {analysis.common.chapter12_loveStyle.loveWarnings.advice}
            </PdfParagraph>

            <PdfSubtitle>연애 조언</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const loveType = analysis.common.chapter12_loveStyle.loveStyle.type;
                if (loveType.includes("열정") || loveType.includes("적극")) {
                  return "열정적인 사랑도 좋지만, 때로는 상대방의 속도에 맞춰주는 여유가 필요합니다. 감정의 파도에 휩쓸리기보다 이성적인 판단도 함께 해주세요.";
                } else if (loveType.includes("신중") || loveType.includes("안정")) {
                  return "신중함은 장점이지만, 지나치면 기회를 놓칠 수 있습니다. 때로는 용기를 내어 먼저 마음을 표현하는 것도 필요합니다.";
                } else {
                  return "자연스러운 감정의 흐름을 따르되, 중요한 순간에는 용기 있는 결정을 내려주세요. 진심어린 소통이 좋은 관계의 기초가 됩니다.";
                }
              })()}
            </PdfParagraph>

            {analysis.common.chapter12_loveStyle.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.common.chapter12_loveStyle.narrative.intro}</PdfParagraph>
                {analysis.common.chapter12_loveStyle.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.common.chapter12_loveStyle.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제13장: 인연의 흐름 */}
        {analysis?.relationshipBranch.chapter13_relationship && (
          <PdfChapterPage chapterNumber={13} title="인연과 관계의 흐름" >
            <PdfParagraph>
              {CHAPTER_INTROS.relationship.intro}
            </PdfParagraph>

            <PdfSubtitle>인연과 사주</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.relationship.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>현재 상태: {relationshipStatusToKorean(analysis.relationshipBranch.chapter13_relationship.relationshipStatus)}</PdfSubtitle>
            <PdfParagraph>
              {data.name}님의 현재 관계 상태에 맞춰 사주적 분석과 조언을 드립니다.
              {data.gender === "male"
                ? " 남성의 경우 재성(財星)이 이성 인연을 나타내며, 대운과 세운에서 재성이 들어올 때 좋은 인연을 만날 가능성이 높습니다."
                : " 여성의 경우 관성(官星)이 이성 인연을 나타내며, 대운과 세운에서 관성이 들어올 때 좋은 인연을 만날 가능성이 높습니다."}
            </PdfParagraph>

            {analysis.relationshipBranch.chapter13_relationship.soloContent && (
              <>
                <PdfSubtitle>솔로인 이유 분석</PdfSubtitle>
                <PdfParagraph>
                  {analysis.relationshipBranch.chapter13_relationship.soloContent.singleReason}
                </PdfParagraph>
                <PdfParagraph>
                  사주적으로 인연의 시기가 맞지 않거나, 본인의 에너지가 다른 곳(학업, 커리어 등)에 집중되어 있을 수 있습니다.
                  이는 부정적인 것이 아니라, 인생의 우선순위에 따른 자연스러운 흐름입니다.
                </PdfParagraph>
                <PdfSubtitle>인연을 만날 수 있는 장소</PdfSubtitle>
                <PdfParagraph>
                  {data.name}님의 사주 특성에 맞는 만남의 장소는 다음과 같습니다:
                </PdfParagraph>
                <PdfList items={analysis.relationshipBranch.chapter13_relationship.soloContent.meetingPlaces} />
                <PdfSubtitle>인연 운 활성화 조언</PdfSubtitle>
                <PdfParagraph>
                  좋은 인연을 만나기 위해서는 자신의 용신에 맞는 활동을 늘리고, 새로운 환경에 적극적으로 노출되는 것이 좋습니다.
                  또한 자기 자신을 가꾸고 내면의 매력을 키우는 것이 결국 좋은 인연을 끌어당기는 원동력이 됩니다.
                </PdfParagraph>
              </>
            )}

            {analysis.relationshipBranch.chapter13_relationship.datingContent && (
              <>
                <PdfSubtitle>현재 관계 분석</PdfSubtitle>
                <PdfParagraph>
                  {analysis.relationshipBranch.chapter13_relationship.datingContent.developmentForecast}
                </PdfParagraph>
                <PdfSubtitle>관계 발전 조언</PdfSubtitle>
                <PdfParagraph>
                  현재 연애 중이라면 상대방과의 사주 궁합도 중요하지만, 더 중요한 것은 서로에 대한 이해와 존중입니다.
                  사주는 방향을 제시할 뿐, 관계의 성공은 두 사람의 노력에 달려 있습니다.
                  서로의 장단점을 인정하고, 열린 소통을 유지하세요.
                </PdfParagraph>
              </>
            )}

            {analysis.relationshipBranch.chapter13_relationship.marriedContent && (
              <>
                <PdfSubtitle>결혼 생활 분석</PdfSubtitle>
                <PdfParagraph>
                  {analysis.relationshipBranch.chapter13_relationship.marriedContent.harmonizingAdvice}
                </PdfParagraph>
                <PdfSubtitle>부부 화합 조언</PdfSubtitle>
                <PdfParagraph>
                  결혼 생활에서 가장 중요한 것은 서로에 대한 존중과 배려입니다. 사주적으로 맞지 않는 부분이 있더라도,
                  이해와 양보를 통해 극복할 수 있습니다. 특히 대화를 통해 서로의 기대와 필요를 솔직하게 나누는 것이 중요합니다.
                </PdfParagraph>
              </>
            )}

            <PdfSubtitle>인연 운 시기</PdfSubtitle>
            <PdfParagraph>
              인연 운이 좋은 시기는 대운과 세운에서 배우자 관련 십신(남성은 재성, 여성은 관성)이 들어오는 때입니다.
              이 시기에 적극적으로 활동하면 좋은 인연을 만날 가능성이 높아집니다.
              단, 사주는 참고 사항일 뿐이며, 언제든 좋은 인연은 찾아올 수 있습니다.
            </PdfParagraph>

            {analysis.relationshipBranch.chapter13_relationship.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.relationshipBranch.chapter13_relationship.narrative.intro}</PdfParagraph>
                {analysis.relationshipBranch.chapter13_relationship.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.relationshipBranch.chapter13_relationship.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제14장: 배우자운 */}
        {analysis?.relationshipBranch.chapter14_marriage && (
          <PdfChapterPage chapterNumber={14} title="배우자운" >
            <PdfParagraph>
              {CHAPTER_INTROS.marriage.intro}
            </PdfParagraph>

            <PdfSubtitle>배우자 궁과 십신</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.marriage.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>배우자 상(像) - 만나게 될 배우자의 특성</PdfSubtitle>
            <PdfParagraph>
              {data.name}님의 사주에서 나타나는 배우자의 성격적 특성은 다음과 같습니다:
            </PdfParagraph>
            <PdfList items={analysis.relationshipBranch.chapter14_marriage.spouseAnalysis.idealTraits} />
            <PdfParagraph>
              외모적 특성: {analysis.relationshipBranch.chapter14_marriage.spouseAnalysis.spouseAppearance}
            </PdfParagraph>
            <PdfParagraph>
              {data.gender === "male"
                ? "남성의 배우자 궁은 일지(日支)와 재성(財星)으로 분석합니다. 일지의 상태가 좋고 재성이 건강하면 배우자 복이 있습니다."
                : "여성의 배우자 궁은 일지(日支)와 관성(官星)으로 분석합니다. 일지의 상태가 좋고 관성이 건강하면 배우자 복이 있습니다."}
            </PdfParagraph>

            <PdfSubtitle>결혼 적령기 분석</PdfSubtitle>
            <PdfParagraph>
              사주 분석에 따른 결혼에 좋은 시기: {analysis.relationshipBranch.chapter14_marriage.marriageTiming.optimalYears.join(", ")}년
            </PdfParagraph>
            <PdfParagraph>
              {analysis.relationshipBranch.chapter14_marriage.marriageTiming.analysis}
            </PdfParagraph>
            <PdfParagraph>
              이 시기는 대운과 세운에서 결혼에 유리한 기운이 들어오는 때입니다.
              단, 이는 통계적 경향일 뿐이며, 실제 결혼 시기는 개인의 선택과 상황에 따라 달라질 수 있습니다.
            </PdfParagraph>

            <PdfSubtitle>결혼 생활 전망</PdfSubtitle>
            <PdfParagraph>
              {analysis.relationshipBranch.chapter14_marriage.marriageLife.overallFortune}
            </PdfParagraph>

            <PdfSubtitle>부부 소통 스타일</PdfSubtitle>
            <PdfParagraph>
              {analysis.relationshipBranch.chapter14_marriage.marriageLife.communicationStyle}
            </PdfParagraph>
            <PdfParagraph>
              원만한 결혼 생활을 위해서는 서로의 소통 스타일을 이해하고 존중하는 것이 중요합니다.
              의견 차이가 있을 때 감정적으로 반응하기보다, 차분하게 대화하는 습관을 기르세요.
            </PdfParagraph>

            <PdfSubtitle>배우자운 향상 조언</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const traits = analysis.relationshipBranch.chapter14_marriage.spouseAnalysis.idealTraits;
                let advice = "좋은 배우자를 만나고 행복한 결혼 생활을 위해서는 ";
                if (traits.some(t => t.includes("성실") || t.includes("안정"))) {
                  advice += "안정적이고 신뢰할 수 있는 모습을 보여주는 것이 중요합니다. ";
                } else if (traits.some(t => t.includes("활동") || t.includes("적극"))) {
                  advice += "활기차고 긍정적인 에너지를 유지하는 것이 도움이 됩니다. ";
                } else {
                  advice += "자신만의 매력과 장점을 발전시키는 것이 중요합니다. ";
                }
                advice += "또한 용신에 맞는 색상과 방향을 활용하면 배우자 운을 높이는 데 도움이 될 수 있습니다.";
                return advice;
              })()}
            </PdfParagraph>

            {analysis.relationshipBranch.chapter14_marriage.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.relationshipBranch.chapter14_marriage.narrative.intro}</PdfParagraph>
                {analysis.relationshipBranch.chapter14_marriage.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.relationshipBranch.chapter14_marriage.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제15장: 가족 관계 */}
        {analysis?.childrenBranch.chapter15_family && (
          <PdfChapterPage chapterNumber={15} title="가족 관계" >
            <PdfParagraph>
              {CHAPTER_INTROS.family.intro}
            </PdfParagraph>

            <PdfSubtitle>가족과 사주의 관계</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.family.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>부모 관계</PdfSubtitle>
            <PdfParagraph>
              사주에서 부모 관계는 년주와 월주, 그리고 인성(印星)과 재성(財星)으로 분석합니다.
              편인과 정인은 어머니를, 편재와 정재는 아버지를 상징합니다.
            </PdfParagraph>
            <PdfParagraph>
              부친과의 관계: {analysis.childrenBranch.chapter15_family.parentsFortune.fatherRelation.analysis}
            </PdfParagraph>
            <PdfParagraph>
              모친과의 관계: {analysis.childrenBranch.chapter15_family.parentsFortune.motherRelation.analysis}
            </PdfParagraph>
            <PdfParagraph>
              부모와의 관계가 사주적으로 어렵게 나와도, 이해와 노력을 통해 개선할 수 있습니다.
              특히 성인이 된 후에는 부모를 한 인간으로 이해하려는 노력이 관계 개선에 큰 도움이 됩니다.
            </PdfParagraph>

            <PdfSubtitle>형제 관계</PdfSubtitle>
            <PdfParagraph>
              형제 관계는 비겁(비견과 겁재)으로 분석합니다. 비겁이 적절하면 형제 복이 있고, 과다하면 경쟁이 있을 수 있습니다.
            </PdfParagraph>
            <PdfParagraph>
              {analysis.childrenBranch.chapter15_family.siblingsFortune.relationship}
            </PdfParagraph>
            <PdfParagraph>
              조언: {analysis.childrenBranch.chapter15_family.siblingsFortune.advice}
            </PdfParagraph>

            {analysis.childrenBranch.chapter15_family.childrenFortune && (
              <>
                <PdfSubtitle>자녀 관계</PdfSubtitle>
                <PdfParagraph>
                  자녀 관계는 시주와 식상(식신과 상관)으로 분석합니다. 시주가 좋으면 자녀 복이 있고, 식상이 건강하면 자녀와의 관계가 원만합니다.
                </PdfParagraph>
                <PdfParagraph>
                  {analysis.childrenBranch.chapter15_family.childrenFortune.overallRelation}
                </PdfParagraph>
                <PdfParagraph>
                  교육 조언: {analysis.childrenBranch.chapter15_family.childrenFortune.educationAdvice}
                </PdfParagraph>
                <PdfParagraph>
                  자녀 교육에서 가장 중요한 것은 자녀의 타고난 성향을 이해하고 존중하는 것입니다.
                  부모의 기대를 강요하기보다, 자녀의 잠재력을 발견하고 응원해주세요.
                </PdfParagraph>
              </>
            )}

            <PdfSubtitle>가족 화합도 분석</PdfSubtitle>
            <PdfParagraph>
              {data.name}님의 가족 화합도 점수는 {analysis.childrenBranch.chapter15_family.familyHarmony.score}점입니다.
              {analysis.childrenBranch.chapter15_family.familyHarmony.score >= 80
                ? " 전반적으로 가족과의 관계가 원만한 편입니다."
                : analysis.childrenBranch.chapter15_family.familyHarmony.score >= 60
                  ? " 가족과의 관계는 보통 수준이며, 노력에 따라 더 좋아질 수 있습니다."
                  : " 가족 관계에서 어려움이 있을 수 있지만, 이해와 소통으로 개선할 수 있습니다."}
            </PdfParagraph>
            <PdfList items={[
              `강점 영역: ${analysis.childrenBranch.chapter15_family.familyHarmony.strengthAreas.join(", ")}`,
              `개선 필요 영역: ${analysis.childrenBranch.chapter15_family.familyHarmony.improvementAreas.join(", ")}`,
            ]} />

            <PdfSubtitle>가족 관계 향상 조언</PdfSubtitle>
            <PdfParagraph>
              가족은 선택할 수 없는 인연이지만, 그 관계의 질은 노력에 따라 달라집니다.
              사주적으로 어려움이 예상되더라도, 열린 마음으로 소통하고 상대방의 입장을 이해하려 노력하면
              관계는 반드시 개선됩니다. 특히 명절이나 가족 모임 때 적극적으로 대화하고, 작은 것부터 배려를 실천해보세요.
            </PdfParagraph>

            {analysis.childrenBranch.chapter15_family.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.childrenBranch.chapter15_family.narrative.intro}</PdfParagraph>
                {analysis.childrenBranch.chapter15_family.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.childrenBranch.chapter15_family.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제17장: 개운법 */}
        {analysis?.common.chapter17_warning && (
          <PdfChapterPage chapterNumber={17} title="주의 시기 및 개운법" hanja="開運法" >
            <PdfParagraph>
              {CHAPTER_INTROS.warning.intro}
            </PdfParagraph>

            <PdfSubtitle>개운법의 원리</PdfSubtitle>
            <PdfParagraph>
              {CHAPTER_INTROS.warning.concepts.map(c => `${c.term}: ${c.meaning}`).join(" ")}
            </PdfParagraph>

            <PdfSubtitle>연도별 운세 등급</PdfSubtitle>
            <PdfParagraph>
              아래는 향후 5년간의 연도별 운세 등급입니다. A는 최길, B는 길, C는 평, D는 주의, F는 위험 등급입니다.
            </PdfParagraph>
            {analysis.common.chapter17_warning.yearlyRiskRating.slice(0, 5).map((year) => (
              <div key={year.year} className="mb-3">
                <p className="text-[#5d4d3d] font-medium">
                  {year.year}년
                  <span className={`ml-2 font-bold ${
                    year.grade === "A" || year.grade === "B" ? "text-green-600" :
                    year.grade === "C" ? "text-amber-600" : "text-red-600"
                  }`}>
                    [등급 {year.grade}]
                  </span>
                </p>
                <p className="text-[#6b5b4f] text-sm pl-4">
                  {year.summary}
                  {year.grade === "A" || year.grade === "B"
                    ? " 적극적인 활동과 새로운 도전이 좋은 결과를 가져올 시기입니다."
                    : year.grade === "C"
                      ? " 안정적인 흐름을 유지하며 내실을 다지는 것이 좋습니다."
                      : " 신중한 판단과 건강 관리에 특별히 주의가 필요합니다."}
                </p>
              </div>
            ))}

            <PdfSubtitle>{data.name}님의 용신(用神)</PdfSubtitle>
            <PdfParagraph>
              용신은 사주의 균형을 맞추는 데 필요한 오행입니다.
              {data.name}님의 용신은 <PdfHighlight>{fiveElementToKorean(analysis.common.chapter17_warning.yongsinRemedy.yongsin)}</PdfHighlight>입니다.
              용신에 해당하는 색상, 방향, 음식, 활동을 생활에 적용하면 운을 높이는 데 도움이 됩니다.
            </PdfParagraph>

            <PdfSubtitle>용신 기반 개운법</PdfSubtitle>
            <PdfParagraph>
              아래의 개운법을 일상생활에 적용해보세요:
            </PdfParagraph>
            <PdfList items={[
              `길한 색상: ${analysis.common.chapter17_warning.yongsinRemedy.colors.join(", ")} - 옷, 소품, 인테리어 등에 활용하세요`,
              `길한 방향: ${analysis.common.chapter17_warning.yongsinRemedy.directions.join(", ")} - 이사, 여행, 중요한 미팅 시 고려하세요`,
              `길한 음식: ${analysis.common.chapter17_warning.yongsinRemedy.foods.join(", ")} - 평소 식단에 포함시키세요`,
              `추천 활동: ${analysis.common.chapter17_warning.yongsinRemedy.activities.join(", ")} - 취미나 운동으로 삼아보세요`,
            ]} />

            <PdfSubtitle>시기별 대처법</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const ratings = analysis.common.chapter17_warning.yearlyRiskRating;
                const goodYears = ratings.filter(y => y.grade === "A" || y.grade === "B");
                const badYears = ratings.filter(y => y.grade === "D" || y.grade === "F");

                let advice = "";
                if (goodYears.length > 0) {
                  advice += `${goodYears.slice(0, 2).map(y => y.year).join(", ")}년은 운세가 좋은 시기입니다. 이 시기에 중요한 결정(이직, 결혼, 투자 등)을 실행하면 좋은 결과를 얻을 가능성이 높습니다. `;
                }
                if (badYears.length > 0) {
                  advice += `${badYears.slice(0, 2).map(y => y.year).join(", ")}년은 주의가 필요한 시기입니다. 큰 변화보다는 현상 유지에 집중하고, 건강 검진과 재정 관리에 신경 쓰세요. `;
                }
                advice += "어떤 시기든 용신을 활용한 개운법을 꾸준히 실천하면 어려움을 최소화할 수 있습니다.";
                return advice;
              })()}
            </PdfParagraph>

            <PdfSubtitle>일상 속 개운 실천법</PdfSubtitle>
            <PdfParagraph>
              {(() => {
                const yongsin = analysis.common.chapter17_warning.yongsinRemedy.yongsin;
                if (yongsin === "wood") {
                  return "목(木) 용신: 아침에 산책하거나 식물을 가꾸세요. 녹색 계열의 옷을 입고, 채소 위주의 식사를 하면 좋습니다. 동쪽 방향으로 책상이나 침대를 배치해보세요.";
                } else if (yongsin === "fire") {
                  return "화(火) 용신: 밝은 조명을 사용하고, 빨간색이나 주황색 소품을 활용하세요. 따뜻한 음식을 먹고, 남쪽 방향에서 햇빛을 받으면 기운이 올라갑니다.";
                } else if (yongsin === "earth") {
                  return "토(土) 용신: 안정적인 일상을 유지하고, 황토색이나 베이지 톤을 활용하세요. 곡류와 뿌리채소를 먹고, 중앙이나 중심부에 자리를 잡으면 좋습니다.";
                } else if (yongsin === "metal") {
                  return "금(金) 용신: 정돈된 환경을 유지하고, 흰색이나 금색을 활용하세요. 단백질 위주의 식사를 하고, 서쪽 방향을 활용하면 기운이 올라갑니다.";
                } else {
                  return "수(水) 용신: 물을 자주 마시고, 검정색이나 파란색을 활용하세요. 해산물을 먹고, 북쪽 방향을 활용하면 좋습니다. 명상이나 독서로 마음을 안정시키세요.";
                }
              })()}
            </PdfParagraph>

            {analysis.common.chapter17_warning.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfParagraph>{analysis.common.chapter17_warning.narrative.intro}</PdfParagraph>
                {analysis.common.chapter17_warning.narrative.details.map((detail, idx) => (
                  <PdfParagraph key={idx}>{detail}</PdfParagraph>
                ))}
                <PdfParagraph>{analysis.common.chapter17_warning.narrative.closing}</PdfParagraph>
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 부록: 용어 사전 */}
        {analysis?.appendix && (
          <PdfChapterPage chapterNumber={0} title="부록: 용어 사전" >
            <PdfParagraph>
              사주 분석에 사용된 주요 용어들의 설명입니다. 사주명리학의 기초 개념부터 심화 용어까지 정리하여 보다 깊은 이해를 돕습니다.
            </PdfParagraph>

            {analysis.appendix.glossary.slice(0, 15).map((item, idx) => (
              <div key={idx} className="mb-3">
                <p className="text-[#5d4d3d] font-medium">
                  {item.term} ({item.hanja})
                </p>
                <p className="text-[#6b5b4f] text-sm pl-4">
                  {item.definition}
                </p>
              </div>
            ))}
          </PdfChapterPage>
        )}

        {/* FAQ */}
        {analysis?.appendix?.faq && (
          <PdfChapterPage chapterNumber={0} title="자주 묻는 질문" >
            {analysis.appendix.faq.map((item, idx) => (
              <div key={idx} className="mb-6">
                <p className="text-[#5d4d3d] font-medium mb-2">
                  Q. {item.question}
                </p>
                <PdfParagraph>
                  A. {item.answer}
                </PdfParagraph>
              </div>
            ))}
          </PdfChapterPage>
        )}
      </div>

      {/* 인쇄 스타일 - A4 최적화 */}
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          .pdf-page {
            width: 210mm !important;
            min-height: 297mm !important;
            height: auto;
            page-break-after: always;
            page-break-inside: avoid;
            break-after: page;
            break-inside: avoid;
            box-sizing: border-box;
            overflow: hidden;
          }

          .pdf-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          /* 요소별 페이지 분리 방지 */
          h2, h3, h4 {
            break-after: avoid;
          }

          p, li, tr {
            break-inside: avoid;
          }

          table {
            break-inside: avoid;
          }

          /* 배경 그라데이션 인쇄 */
          .bg-gradient-to-b,
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        /* 화면용 스타일 */
        @media screen {
          .pdf-page {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }
        }
      `}</style>
    </>
  );
}
