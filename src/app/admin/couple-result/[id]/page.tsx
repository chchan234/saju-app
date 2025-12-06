"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Printer, Download, Send } from "lucide-react";
import type { ExpertCoupleResult } from "@/types/expert-couple";
import { fiveElementToKorean } from "@/lib/constants";
import { generatePdfFromElement, pdfBlobToBase64, downloadPdf } from "@/lib/pdf-generator";

// PDF 컴포넌트
import { PdfCoupleCoverPage } from "@/components/expert/PdfCoupleCoverPage";
import { PdfCoupleTableOfContents } from "@/components/expert/PdfCoupleTableOfContents";
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

interface CoupleRequestData {
  id: string;
  email: string;
  person1_name: string;
  person1_gender: string;
  person1_birth_year: number;
  person1_birth_month: number;
  person1_birth_day: number;
  person1_birth_hour: number;
  person2_name: string;
  person2_gender: string;
  person2_birth_year: number;
  person2_birth_month: number;
  person2_birth_day: number;
  person2_birth_hour: number;
  relationship_status: string;
  analysis_result: ExpertCoupleResult | null;
  created_at: string;
}

export default function AdminCoupleResultPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const requestId = params.id as string;
  const action = searchParams.get("action");
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CoupleRequestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [autoSendTriggered, setAutoSendTriggered] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem("admin_verified");
    if (verified !== "true") {
      router.push("/admin/verify");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/couple-requests/${requestId}`, {
          credentials: "include",
        });

        // 인증 실패 시 로그인 페이지로 리다이렉트
        if (res.status === 401) {
          sessionStorage.removeItem("admin_verified");
          sessionStorage.removeItem("admin_verified_at");
          router.push("/admin/verify");
          return;
        }

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
  }, [requestId, router]);

  // action=send인 경우 자동으로 이메일 발송 시작
  useEffect(() => {
    if (action === "send" && data && !autoSendTriggered && pdfContentRef.current) {
      setAutoSendTriggered(true);
      const timer = setTimeout(() => {
        handleSendEmail();
      }, 1500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, data, autoSendTriggered]);

  const handlePrint = () => {
    window.print();
  };

  // PDF 다운로드
  const handleDownloadPdf = async () => {
    if (!pdfContentRef.current || !data) return;

    setIsGeneratingPdf(true);
    try {
      const pdfBlob = await generatePdfFromElement({
        element: pdfContentRef.current,
      });
      downloadPdf(pdfBlob, `${data.person1_name}_${data.person2_name}_궁합분석_리포트.pdf`);
    } catch (err) {
      console.error("PDF 생성 오류:", err);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 이메일 발송
  const handleSendEmail = async () => {
    if (!pdfContentRef.current || !data) return;

    const confirmed = window.confirm(
      `${data.email}로 궁합 분석 리포트를 발송하시겠습니까?`
    );
    if (!confirmed) return;

    setIsSendingEmail(true);
    try {
      const pdfBlob = await generatePdfFromElement({
        element: pdfContentRef.current,
      });
      const pdfBase64 = await pdfBlobToBase64(pdfBlob);

      const res = await fetch("/api/admin/send-couple-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: data.id,
          pdfBase64,
        }),
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/verify");
        return;
      }

      const result = await res.json();
      if (result.success) {
        alert("이메일이 성공적으로 발송되었습니다.");
      } else {
        alert(`이메일 발송 실패: ${result.message}`);
      }
    } catch (err) {
      console.error("이메일 발송 오류:", err);
      alert("이메일 발송 중 오류가 발생했습니다.");
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

  const analysis = data.analysis_result;

  return (
    <>
      {/* 인쇄 시 숨겨지는 컨트롤 바 */}
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
            <span className="text-sm text-gray-600">
              {data.person1_name} ♥ {data.person2_name} 궁합 분석
            </span>
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
                className="bg-pink-600 hover:bg-pink-500 text-white"
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

      {/* PDF 콘텐츠 */}
      <div ref={pdfContentRef} className="pt-16 print:pt-0">
        {/* 표지 */}
        <PdfCoupleCoverPage
          person1Name={data.person1_name}
          person1BirthYear={data.person1_birth_year}
          person1BirthMonth={data.person1_birth_month}
          person1BirthDay={data.person1_birth_day}
          person1Gender={data.person1_gender}
          person2Name={data.person2_name}
          person2BirthYear={data.person2_birth_year}
          person2BirthMonth={data.person2_birth_month}
          person2BirthDay={data.person2_birth_day}
          person2Gender={data.person2_gender}
          generatedAt={new Date(data.created_at || Date.now())}
        />

        {/* 목차 */}
        <PdfCoupleTableOfContents />

        {/* 제1장: 두 사람의 명식 */}
        {analysis?.chapters.chapter1_profiles && (
          <PdfChapterPage chapterNumber={1} title="두 사람의 명식" hanja="命式">
            <PdfParagraph>
              사주명리학에서 명식(命式)은 개인의 운명을 담은 우주적 설계도입니다.
              두 분의 사주를 각각 분석하고, 서로의 일간(日干) 관계를 통해 기본적인 궁합을 살펴봅니다.
            </PdfParagraph>

            <PdfSubtitle>{analysis.chapters.chapter1_profiles.person1.name}님의 사주</PdfSubtitle>
            <PdfSimpleTable
              headers={["년주(年柱)", "월주(月柱)", "일주(日柱)", "시주(時柱)"]}
              rows={[
                [
                  analysis.chapters.chapter1_profiles.person1.pillars.year?.ganZhi.stemKr || "-",
                  analysis.chapters.chapter1_profiles.person1.pillars.month?.ganZhi.stemKr || "-",
                  analysis.chapters.chapter1_profiles.person1.pillars.day?.ganZhi.stemKr || "-",
                  analysis.chapters.chapter1_profiles.person1.pillars.hour?.ganZhi.stemKr || "-",
                ],
                [
                  analysis.chapters.chapter1_profiles.person1.pillars.year?.ganZhi.branchKr || "-",
                  analysis.chapters.chapter1_profiles.person1.pillars.month?.ganZhi.branchKr || "-",
                  analysis.chapters.chapter1_profiles.person1.pillars.day?.ganZhi.branchKr || "-",
                  analysis.chapters.chapter1_profiles.person1.pillars.hour?.ganZhi.branchKr || "-",
                ],
              ]}
            />
            <PdfParagraph>
              일간 {analysis.chapters.chapter1_profiles.person1.ilganElement}의 기운을 가진 {analysis.chapters.chapter1_profiles.person1.name}님은
              {" "}{analysis.chapters.chapter1_profiles.person1.ilganAnalysis}
            </PdfParagraph>

            <PdfSubtitle>{analysis.chapters.chapter1_profiles.person2.name}님의 사주</PdfSubtitle>
            <PdfSimpleTable
              headers={["년주(年柱)", "월주(月柱)", "일주(日柱)", "시주(時柱)"]}
              rows={[
                [
                  analysis.chapters.chapter1_profiles.person2.pillars.year?.ganZhi.stemKr || "-",
                  analysis.chapters.chapter1_profiles.person2.pillars.month?.ganZhi.stemKr || "-",
                  analysis.chapters.chapter1_profiles.person2.pillars.day?.ganZhi.stemKr || "-",
                  analysis.chapters.chapter1_profiles.person2.pillars.hour?.ganZhi.stemKr || "-",
                ],
                [
                  analysis.chapters.chapter1_profiles.person2.pillars.year?.ganZhi.branchKr || "-",
                  analysis.chapters.chapter1_profiles.person2.pillars.month?.ganZhi.branchKr || "-",
                  analysis.chapters.chapter1_profiles.person2.pillars.day?.ganZhi.branchKr || "-",
                  analysis.chapters.chapter1_profiles.person2.pillars.hour?.ganZhi.branchKr || "-",
                ],
              ]}
            />
            <PdfParagraph>
              일간 {analysis.chapters.chapter1_profiles.person2.ilganElement}의 기운을 가진 {analysis.chapters.chapter1_profiles.person2.name}님은
              {" "}{analysis.chapters.chapter1_profiles.person2.ilganAnalysis}
            </PdfParagraph>

            <PdfSubtitle>일간 관계 분석</PdfSubtitle>
            <PdfParagraph>
              두 분의 일간 관계는 <PdfHighlight>{analysis.chapters.chapter1_profiles.ilganRelation.type}</PdfHighlight>입니다.
              {" "}{analysis.chapters.chapter1_profiles.ilganRelation.description}
            </PdfParagraph>
            <PdfQuote>
              {analysis.chapters.chapter1_profiles.ilganRelation.basicCompatibility}
            </PdfQuote>

            {analysis.chapters.chapter1_profiles.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter1_profiles.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제2장: 기본 궁합 점수 */}
        {analysis?.chapters.chapter2_basicScore && (
          <PdfChapterPage chapterNumber={2} title="기본 궁합 점수" hanja="合婚點數">
            <PdfParagraph>
              두 분의 사주를 종합적으로 분석하여 기본 궁합 점수를 산출했습니다.
              일간 궁합, 지지 관계, 오행 보완/충돌 등 여러 요소를 고려한 결과입니다.
            </PdfParagraph>

            <div className="my-10 p-8 bg-gradient-to-br from-[#f5f0e8] to-[#ebe5db] border-2 border-[#c4b5a0] rounded-xl text-center">
              <p className="text-[#8b7355] text-sm tracking-widest mb-2">종합 궁합 점수</p>
              <p className="text-6xl font-bold text-[#3d3127] font-serif mb-4">
                {analysis.chapters.chapter2_basicScore.totalScore}
                <span className="text-2xl text-[#8b7b6f] ml-2">/ 100</span>
              </p>
              <p className="text-xl text-[#5d4d3d] font-medium">
                {analysis.chapters.chapter2_basicScore.grade}
              </p>
              <p className="text-[#6b5b4f] mt-2">
                {analysis.chapters.chapter2_basicScore.gradeDescription}
              </p>
            </div>

            <PdfSubtitle>점수 구성</PdfSubtitle>
            <PdfList items={[
              `일간 궁합: ${analysis.chapters.chapter2_basicScore.scoreBreakdown.ilganScore}점`,
              `지지 관계: ${analysis.chapters.chapter2_basicScore.scoreBreakdown.jijiScore}점`,
              `오행 조화: ${analysis.chapters.chapter2_basicScore.scoreBreakdown.ohengScore}점`,
            ]} />

            <PdfSubtitle>종합 평가</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter2_basicScore.overallAssessment}
            </PdfParagraph>

            {analysis.chapters.chapter2_basicScore.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter2_basicScore.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제3장: 일간 궁합 심층 */}
        {analysis?.chapters.chapter3_ilganDeep && (
          <PdfChapterPage chapterNumber={3} title="일간 궁합 심층" hanja="日干深層">
            <PdfParagraph>
              일간(日干)은 사주에서 자신을 나타내는 가장 핵심적인 요소입니다.
              두 분의 일간 관계를 심층적으로 분석하여 관계의 역학을 파악합니다.
            </PdfParagraph>

            <PdfSubtitle>일간 관계: {analysis.chapters.chapter3_ilganDeep.sipsinType}</PdfSubtitle>
            <PdfParagraph>
              {data.person1_name}님의 일간 <PdfHighlight>{analysis.chapters.chapter3_ilganDeep.person1Ilgan}</PdfHighlight>과
              {" "}{data.person2_name}님의 일간 <PdfHighlight>{analysis.chapters.chapter3_ilganDeep.person2Ilgan}</PdfHighlight>은
              {" "}{analysis.chapters.chapter3_ilganDeep.sipsinType}({analysis.chapters.chapter3_ilganDeep.sipsinHanja}) 관계입니다.
            </PdfParagraph>
            <PdfParagraph>
              {analysis.chapters.chapter3_ilganDeep.sipsinDescription}
            </PdfParagraph>

            <PdfSubtitle>관계의 강점</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter3_ilganDeep.strengths} />

            <PdfSubtitle>주의할 점</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter3_ilganDeep.weaknesses} />

            <PdfSubtitle>관계 역학</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter3_ilganDeep.relationshipDynamics}
            </PdfParagraph>
            <PdfParagraph>
              힘의 균형: <PdfHighlight>
                {analysis.chapters.chapter3_ilganDeep.powerBalance === "person1우세"
                  ? `${data.person1_name}님 우세`
                  : analysis.chapters.chapter3_ilganDeep.powerBalance === "person2우세"
                    ? `${data.person2_name}님 우세`
                    : "균형"}
              </PdfHighlight>
            </PdfParagraph>

            <PdfSubtitle>조언</PdfSubtitle>
            <PdfQuote>
              {analysis.chapters.chapter3_ilganDeep.advice}
            </PdfQuote>

            {analysis.chapters.chapter3_ilganDeep.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter3_ilganDeep.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제4장: 오행 보완 분석 */}
        {analysis?.chapters.chapter4_ohengComplement && (
          <PdfChapterPage chapterNumber={4} title="오행 보완 분석" hanja="五行補完">
            <PdfParagraph>
              오행(五行)은 목(木), 화(火), 토(土), 금(金), 수(水)의 다섯 가지 기운입니다.
              두 분이 서로 부족한 오행을 채워줄 수 있는지 분석합니다.
            </PdfParagraph>

            <PdfSubtitle>{data.person1_name}님의 오행 분포</PdfSubtitle>
            <PdfParagraph>
              강한 오행: {analysis.chapters.chapter4_ohengComplement.person1Elements.strong.map(e => fiveElementToKorean(e)).join(", ") || "없음"}
              {" "}| 약한 오행: {analysis.chapters.chapter4_ohengComplement.person1Elements.weak.map(e => fiveElementToKorean(e)).join(", ") || "없음"}
              {" "}| 없는 오행: {analysis.chapters.chapter4_ohengComplement.person1Elements.missing.map(e => fiveElementToKorean(e)).join(", ") || "없음"}
            </PdfParagraph>

            <PdfSubtitle>{data.person2_name}님의 오행 분포</PdfSubtitle>
            <PdfParagraph>
              강한 오행: {analysis.chapters.chapter4_ohengComplement.person2Elements.strong.map(e => fiveElementToKorean(e)).join(", ") || "없음"}
              {" "}| 약한 오행: {analysis.chapters.chapter4_ohengComplement.person2Elements.weak.map(e => fiveElementToKorean(e)).join(", ") || "없음"}
              {" "}| 없는 오행: {analysis.chapters.chapter4_ohengComplement.person2Elements.missing.map(e => fiveElementToKorean(e)).join(", ") || "없음"}
            </PdfParagraph>

            {analysis.chapters.chapter4_ohengComplement.complementaryPairs.length > 0 && (
              <>
                <PdfSubtitle>상호 보완 관계</PdfSubtitle>
                {analysis.chapters.chapter4_ohengComplement.complementaryPairs.map((pair, idx) => (
                  <div key={idx} className="mb-6 p-4 bg-[#f8f5f0] rounded-lg border-l-4 border-[#8b7355]">
                    <p className="text-[#5d4d3d] font-medium mb-2">
                      {pair.emoji} {fiveElementToKorean(pair.element)} - {pair.theme}
                    </p>
                    <PdfParagraph>
                      {pair.whoLacks === "person1" ? data.person1_name : data.person2_name}님에게 부족한 {fiveElementToKorean(pair.element)}을
                      {" "}{pair.whoLacks === "person1" ? data.person2_name : data.person1_name}님이 채워줍니다.
                      {" "}{pair.benefitTogether}
                    </PdfParagraph>
                  </div>
                ))}
              </>
            )}

            <PdfSubtitle>시너지 점수: {analysis.chapters.chapter4_ohengComplement.synergyScore}점</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter4_ohengComplement.overallSynergy}
            </PdfParagraph>

            {analysis.chapters.chapter4_ohengComplement.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter4_ohengComplement.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제5장: 오행 충돌 분석 */}
        {analysis?.chapters.chapter5_ohengConflict && (
          <PdfChapterPage chapterNumber={5} title="오행 충돌 분석" hanja="五行衝突">
            <PdfParagraph>
              오행 간에는 상생(相生)과 상극(相剋)의 관계가 있습니다.
              두 분 사이에 충돌할 수 있는 오행 관계를 분석합니다.
            </PdfParagraph>

            <PdfSubtitle>
              충돌 정도: <PdfHighlight>{analysis.chapters.chapter5_ohengConflict.conflictSeverity}</PdfHighlight>
            </PdfSubtitle>

            {analysis.chapters.chapter5_ohengConflict.conflicts.length > 0 ? (
              <>
                <PdfSubtitle>충돌 요소</PdfSubtitle>
                {analysis.chapters.chapter5_ohengConflict.conflicts.map((conflict, idx) => (
                  <div key={idx} className="mb-6 p-4 bg-[#fff8f5] rounded-lg border-l-4 border-[#d4a574]">
                    <p className="text-[#5d4d3d] font-medium mb-2">
                      {conflict.emojis[0]} {fiveElementToKorean(conflict.elements[0])} vs {conflict.emojis[1]} {fiveElementToKorean(conflict.elements[1])} - {conflict.theme}
                    </p>
                    <PdfParagraph>{conflict.description}</PdfParagraph>
                    <p className="text-[#c4956a] text-sm mt-2">
                      주의: {conflict.warning}
                    </p>
                    <p className="text-[#6b8e5a] text-sm mt-1">
                      해결책: {conflict.solution}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <PdfParagraph>
                두 분 사이에 심각한 오행 충돌은 발견되지 않았습니다.
              </PdfParagraph>
            )}

            <PdfSubtitle>충돌 관리 조언</PdfSubtitle>
            <PdfQuote>
              {analysis.chapters.chapter5_ohengConflict.managementAdvice}
            </PdfQuote>

            {analysis.chapters.chapter5_ohengConflict.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter5_ohengConflict.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제6장: 지지 육합 분석 */}
        {analysis?.chapters.chapter6_jijiYukap && (
          <PdfChapterPage chapterNumber={6} title="지지 육합 분석" hanja="六合">
            <PdfParagraph>
              육합(六合)은 지지(地支) 간의 조화로운 결합을 의미합니다.
              두 분의 사주에서 육합 관계가 있는지 분석합니다.
            </PdfParagraph>

            {analysis.chapters.chapter6_jijiYukap.hasYukap ? (
              <>
                <PdfSubtitle>육합 관계 발견</PdfSubtitle>
                {analysis.chapters.chapter6_jijiYukap.yukaps.map((yukap, idx) => (
                  <div key={idx} className="mb-6 p-4 bg-[#f5f8f0] rounded-lg border-l-4 border-[#6b8e5a]">
                    <p className="text-[#5d4d3d] font-medium mb-2">
                      {yukap.pair} 합
                    </p>
                    <PdfParagraph>{yukap.description}</PdfParagraph>
                    <p className="text-[#6b8e5a] text-sm mt-2">
                      긍정적 효과: {yukap.positiveEffect}
                    </p>
                  </div>
                ))}
              </>
            ) : (
              <PdfParagraph>
                두 분의 사주에서 육합 관계는 발견되지 않았습니다.
                그러나 이것이 궁합이 나쁘다는 의미는 아닙니다.
              </PdfParagraph>
            )}

            <PdfSubtitle>종합 평가</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter6_jijiYukap.overallHarmony}
            </PdfParagraph>

            {analysis.chapters.chapter6_jijiYukap.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter6_jijiYukap.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제7장: 지지 충·형·해 분석 */}
        {analysis?.chapters.chapter7_jijiConflict && (
          <PdfChapterPage chapterNumber={7} title="지지 충·형·해" hanja="沖刑害">
            <PdfParagraph>
              충(沖), 형(刑), 해(害)는 지지 간의 갈등 관계를 나타냅니다.
              두 분 사이에 이러한 관계가 있는지 분석하고 대처법을 제시합니다.
            </PdfParagraph>

            <PdfSubtitle>
              전체 위험도: <PdfHighlight>{analysis.chapters.chapter7_jijiConflict.overallRisk}</PdfHighlight>
              {" "}(총 {analysis.chapters.chapter7_jijiConflict.totalNegativeCount}개)
            </PdfSubtitle>

            {analysis.chapters.chapter7_jijiConflict.chungs.length > 0 && (
              <>
                <PdfSubtitle>충(沖) 관계</PdfSubtitle>
                {analysis.chapters.chapter7_jijiConflict.chungs.map((chung, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-[#fff8f5] rounded-lg">
                    <p className="text-[#5d4d3d] font-medium">{chung.pair}</p>
                    <PdfParagraph>{chung.description}</PdfParagraph>
                    <p className="text-[#6b8e5a] text-sm mt-1">해결책: {chung.solution}</p>
                  </div>
                ))}
              </>
            )}

            {analysis.chapters.chapter7_jijiConflict.hyungs.length > 0 && (
              <>
                <PdfSubtitle>형(刑) 관계</PdfSubtitle>
                {analysis.chapters.chapter7_jijiConflict.hyungs.map((hyung, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-[#fff8f5] rounded-lg">
                    <p className="text-[#5d4d3d] font-medium">{hyung.pair}</p>
                    <PdfParagraph>{hyung.description}</PdfParagraph>
                    <p className="text-[#6b8e5a] text-sm mt-1">해결책: {hyung.solution}</p>
                  </div>
                ))}
              </>
            )}

            {analysis.chapters.chapter7_jijiConflict.haes.length > 0 && (
              <>
                <PdfSubtitle>해(害) 관계</PdfSubtitle>
                {analysis.chapters.chapter7_jijiConflict.haes.map((hae, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-[#fff8f5] rounded-lg">
                    <p className="text-[#5d4d3d] font-medium">{hae.pair}</p>
                    <PdfParagraph>{hae.description}</PdfParagraph>
                    <p className="text-[#6b8e5a] text-sm mt-1">해결책: {hae.solution}</p>
                  </div>
                ))}
              </>
            )}

            {analysis.chapters.chapter7_jijiConflict.totalNegativeCount === 0 && (
              <PdfParagraph>
                두 분의 사주에서 충·형·해 관계가 발견되지 않았습니다.
                지지 간의 갈등 요소가 적어 관계가 안정적일 수 있습니다.
              </PdfParagraph>
            )}

            <PdfSubtitle>관리 조언</PdfSubtitle>
            <PdfQuote>
              {analysis.chapters.chapter7_jijiConflict.managementAdvice}
            </PdfQuote>

            {analysis.chapters.chapter7_jijiConflict.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter7_jijiConflict.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제8장: 소통 방식 */}
        {analysis?.chapters.chapter8_communication && (
          <PdfChapterPage chapterNumber={8} title="소통 방식" hanja="疏通">
            <PdfParagraph>
              사주는 개인의 소통 스타일을 반영합니다.
              두 분의 소통 방식을 분석하여 더 나은 대화를 위한 조언을 드립니다.
            </PdfParagraph>

            <PdfSubtitle>{data.person1_name}님의 소통 스타일</PdfSubtitle>
            <PdfParagraph>
              소통 유형: {analysis.chapters.chapter8_communication.person1Style.communicationType}
            </PdfParagraph>
            <PdfList items={[
              `표현 방식: ${analysis.chapters.chapter8_communication.person1Style.expressionStyle}`,
              `경청 스타일: ${analysis.chapters.chapter8_communication.person1Style.listeningStyle}`,
              `갈등 시 반응: ${analysis.chapters.chapter8_communication.person1Style.conflictStyle}`,
            ]} />

            <PdfSubtitle>{data.person2_name}님의 소통 스타일</PdfSubtitle>
            <PdfParagraph>
              소통 유형: {analysis.chapters.chapter8_communication.person2Style.communicationType}
            </PdfParagraph>
            <PdfList items={[
              `표현 방식: ${analysis.chapters.chapter8_communication.person2Style.expressionStyle}`,
              `경청 스타일: ${analysis.chapters.chapter8_communication.person2Style.listeningStyle}`,
              `갈등 시 반응: ${analysis.chapters.chapter8_communication.person2Style.conflictStyle}`,
            ]} />

            <PdfSubtitle>소통 궁합: {analysis.chapters.chapter8_communication.compatibility.score}점</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter8_communication.compatibility.analysis}
            </PdfParagraph>

            {analysis.chapters.chapter8_communication.misunderstandingPoints.length > 0 && (
              <>
                <PdfSubtitle>오해가 생기기 쉬운 지점</PdfSubtitle>
                <PdfList items={analysis.chapters.chapter8_communication.misunderstandingPoints} />
              </>
            )}

            <PdfSubtitle>소통 개선 팁</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter8_communication.communicationTips} />

            {analysis.chapters.chapter8_communication.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter8_communication.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제9장: 갈등 패턴과 화해법 */}
        {analysis?.chapters.chapter9_conflictPattern && (
          <PdfChapterPage chapterNumber={9} title="갈등 패턴과 화해법" hanja="葛藤和解">
            <PdfParagraph>
              모든 관계에는 갈등이 있습니다. 중요한 것은 어떻게 해결하느냐입니다.
              두 분의 갈등 패턴을 분석하고 화해 전략을 제시합니다.
            </PdfParagraph>

            <PdfSubtitle>{data.person1_name}님의 갈등 패턴</PdfSubtitle>
            <PdfList items={[
              `반응 스타일: ${analysis.chapters.chapter9_conflictPattern.person1ConflictPattern.reactionStyle}`,
              `회복 시간: ${analysis.chapters.chapter9_conflictPattern.person1ConflictPattern.recoveryTime}`,
              ...analysis.chapters.chapter9_conflictPattern.person1ConflictPattern.triggerPoints.map(t => `촉발 요인: ${t}`),
            ]} />

            <PdfSubtitle>{data.person2_name}님의 갈등 패턴</PdfSubtitle>
            <PdfList items={[
              `반응 스타일: ${analysis.chapters.chapter9_conflictPattern.person2ConflictPattern.reactionStyle}`,
              `회복 시간: ${analysis.chapters.chapter9_conflictPattern.person2ConflictPattern.recoveryTime}`,
              ...analysis.chapters.chapter9_conflictPattern.person2ConflictPattern.triggerPoints.map(t => `촉발 요인: ${t}`),
            ]} />

            {analysis.chapters.chapter9_conflictPattern.commonConflictScenarios.length > 0 && (
              <>
                <PdfSubtitle>예상되는 갈등 상황</PdfSubtitle>
                {analysis.chapters.chapter9_conflictPattern.commonConflictScenarios.map((scenario, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-[#f8f5f0] rounded-lg">
                    <p className="text-[#5d4d3d] font-medium mb-2">{scenario.scenario}</p>
                    <p className="text-sm text-[#6b5b4f]">
                      {data.person1_name}: {scenario.person1Reaction}
                    </p>
                    <p className="text-sm text-[#6b5b4f]">
                      {data.person2_name}: {scenario.person2Reaction}
                    </p>
                    <p className="text-sm text-[#c4956a] mt-1">
                      갈등 확대 위험: {scenario.escalationRisk}
                    </p>
                  </div>
                ))}
              </>
            )}

            <PdfSubtitle>화해 전략</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter9_conflictPattern.reconciliationStrategies} />

            <PdfSubtitle>갈등 예방 팁</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter9_conflictPattern.preventionTips} />

            {analysis.chapters.chapter9_conflictPattern.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter9_conflictPattern.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제10장: 연애/결혼 시기 */}
        {analysis?.chapters.chapter10_timing && (
          <PdfChapterPage chapterNumber={10} title="연애/결혼 시기" hanja="時期">
            <PdfParagraph>
              대운과 세운을 분석하여 두 분의 연애와 결혼에 좋은 시기를 살펴봅니다.
            </PdfParagraph>

            <PdfSubtitle>{data.person1_name}님의 운세 흐름</PdfSubtitle>
            <PdfParagraph>
              현재 대운: {analysis.chapters.chapter10_timing.person1Timeline.currentDaeun}
            </PdfParagraph>
            <PdfParagraph>
              연애/결혼 운: {analysis.chapters.chapter10_timing.person1Timeline.relationshipFortune}
            </PdfParagraph>

            <PdfSubtitle>{data.person2_name}님의 운세 흐름</PdfSubtitle>
            <PdfParagraph>
              현재 대운: {analysis.chapters.chapter10_timing.person2Timeline.currentDaeun}
            </PdfParagraph>
            <PdfParagraph>
              연애/결혼 운: {analysis.chapters.chapter10_timing.person2Timeline.relationshipFortune}
            </PdfParagraph>

            {analysis.chapters.chapter10_timing.optimalMarriageYears.length > 0 && (
              <>
                <PdfSubtitle>결혼에 좋은 해</PdfSubtitle>
                <PdfParagraph>
                  {analysis.chapters.chapter10_timing.optimalMarriageYears.join("년, ")}년
                </PdfParagraph>
              </>
            )}

            {analysis.chapters.chapter10_timing.avoidMarriageYears.length > 0 && (
              <>
                <PdfSubtitle>주의가 필요한 해</PdfSubtitle>
                <PdfParagraph>
                  {analysis.chapters.chapter10_timing.avoidMarriageYears.join("년, ")}년
                </PdfParagraph>
              </>
            )}

            {analysis.chapters.chapter10_timing.sharedGoodPeriods.length > 0 && (
              <>
                <PdfSubtitle>함께 좋은 시기</PdfSubtitle>
                {analysis.chapters.chapter10_timing.sharedGoodPeriods.map((period, idx) => (
                  <div key={idx} className="mb-3">
                    <p className="text-[#5d4d3d] font-medium">{period.year}년</p>
                    <PdfParagraph>{period.reason} - {period.recommendation}</PdfParagraph>
                  </div>
                ))}
              </>
            )}

            {analysis.chapters.chapter10_timing.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter10_timing.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제11장: 재물 궁합 */}
        {analysis?.chapters.chapter11_wealth && (
          <PdfChapterPage chapterNumber={11} title="재물 궁합" hanja="財物">
            <PdfParagraph>
              재물에 대한 두 분의 태도와 습관을 분석하여 경제적 조화를 살펴봅니다.
            </PdfParagraph>

            <PdfSubtitle>{data.person1_name}님의 재물 스타일</PdfSubtitle>
            <PdfList items={[
              `수입 패턴: ${analysis.chapters.chapter11_wealth.person1MoneyStyle.earningPattern}`,
              `지출 패턴: ${analysis.chapters.chapter11_wealth.person1MoneyStyle.spendingPattern}`,
              `저축 태도: ${analysis.chapters.chapter11_wealth.person1MoneyStyle.savingAttitude}`,
              `투자 성향: ${analysis.chapters.chapter11_wealth.person1MoneyStyle.investmentStyle}`,
            ]} />

            <PdfSubtitle>{data.person2_name}님의 재물 스타일</PdfSubtitle>
            <PdfList items={[
              `수입 패턴: ${analysis.chapters.chapter11_wealth.person2MoneyStyle.earningPattern}`,
              `지출 패턴: ${analysis.chapters.chapter11_wealth.person2MoneyStyle.spendingPattern}`,
              `저축 태도: ${analysis.chapters.chapter11_wealth.person2MoneyStyle.savingAttitude}`,
              `투자 성향: ${analysis.chapters.chapter11_wealth.person2MoneyStyle.investmentStyle}`,
            ]} />

            <PdfSubtitle>재물 궁합: {analysis.chapters.chapter11_wealth.financialCompatibility.score}점</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter11_wealth.financialCompatibility.analysis}
            </PdfParagraph>

            <PdfSubtitle>공동 재정 조언</PdfSubtitle>
            <PdfList items={[
              `예산 관리: ${analysis.chapters.chapter11_wealth.jointFinanceAdvice.budgetManagement}`,
              `저축 전략: ${analysis.chapters.chapter11_wealth.jointFinanceAdvice.savingsStrategy}`,
              `투자 접근: ${analysis.chapters.chapter11_wealth.jointFinanceAdvice.investmentApproach}`,
              `갈등 예방: ${analysis.chapters.chapter11_wealth.jointFinanceAdvice.conflictPrevention}`,
            ]} />

            <PdfSubtitle>재물 전망</PdfSubtitle>
            <PdfParagraph>
              단기(1-3년): {analysis.chapters.chapter11_wealth.wealthForecast.shortTerm}
            </PdfParagraph>
            <PdfParagraph>
              중기(3-10년): {analysis.chapters.chapter11_wealth.wealthForecast.midTerm}
            </PdfParagraph>
            <PdfParagraph>
              장기(10년+): {analysis.chapters.chapter11_wealth.wealthForecast.longTerm}
            </PdfParagraph>

            {analysis.chapters.chapter11_wealth.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter11_wealth.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제12장: 자녀 궁합 */}
        {analysis?.chapters.chapter12_children && (
          <PdfChapterPage chapterNumber={12} title="자녀 궁합" hanja="子女">
            <PdfParagraph>
              자녀에 대한 두 분의 운세와 양육 스타일을 분석합니다.
            </PdfParagraph>

            <PdfSubtitle>자녀 운</PdfSubtitle>
            <PdfParagraph>
              {data.person1_name}님: {analysis.chapters.chapter12_children.childrenPossibility.person1Fortune}
            </PdfParagraph>
            <PdfParagraph>
              {data.person2_name}님: {analysis.chapters.chapter12_children.childrenPossibility.person2Fortune}
            </PdfParagraph>
            <PdfParagraph>
              두 분의 결합 운: <PdfHighlight>{analysis.chapters.chapter12_children.childrenPossibility.combinedFortune}</PdfHighlight>
            </PdfParagraph>
            <PdfParagraph>
              {analysis.chapters.chapter12_children.childrenPossibility.analysis}
            </PdfParagraph>

            {analysis.chapters.chapter12_children.optimalConceptionYears.length > 0 && (
              <>
                <PdfSubtitle>좋은 시기</PdfSubtitle>
                <PdfParagraph>
                  {analysis.chapters.chapter12_children.optimalConceptionYears.join("년, ")}년
                </PdfParagraph>
              </>
            )}

            <PdfSubtitle>양육 스타일</PdfSubtitle>
            <PdfParagraph>
              {data.person1_name}님: {analysis.chapters.chapter12_children.parentingStyles.person1Style}
            </PdfParagraph>
            <PdfParagraph>
              {data.person2_name}님: {analysis.chapters.chapter12_children.parentingStyles.person2Style}
            </PdfParagraph>
            <PdfParagraph>
              궁합: {analysis.chapters.chapter12_children.parentingStyles.compatibility}
            </PdfParagraph>

            <PdfSubtitle>자녀 교육</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter12_children.childEducationApproach.advice}
            </PdfParagraph>

            {analysis.chapters.chapter12_children.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter12_children.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제13장: 시댁/처가 관계 */}
        {analysis?.chapters.chapter13_family && (
          <PdfChapterPage chapterNumber={13} title="시댁/처가 관계" hanja="家族">
            <PdfParagraph>
              양가 가족과의 관계를 분석하여 원만한 관계를 위한 조언을 드립니다.
            </PdfParagraph>

            <PdfSubtitle>{data.person1_name}님과 상대 가족</PdfSubtitle>
            <PdfParagraph>
              궁합: {analysis.chapters.chapter13_family.person1FamilyRelation.inLawCompatibility}
            </PdfParagraph>
            {analysis.chapters.chapter13_family.person1FamilyRelation.potentialIssues.length > 0 && (
              <PdfList items={analysis.chapters.chapter13_family.person1FamilyRelation.potentialIssues.map(i => `주의: ${i}`)} />
            )}
            <PdfParagraph>
              조언: {analysis.chapters.chapter13_family.person1FamilyRelation.managementAdvice}
            </PdfParagraph>

            <PdfSubtitle>{data.person2_name}님과 상대 가족</PdfSubtitle>
            <PdfParagraph>
              궁합: {analysis.chapters.chapter13_family.person2FamilyRelation.inLawCompatibility}
            </PdfParagraph>
            {analysis.chapters.chapter13_family.person2FamilyRelation.potentialIssues.length > 0 && (
              <PdfList items={analysis.chapters.chapter13_family.person2FamilyRelation.potentialIssues.map(i => `주의: ${i}`)} />
            )}
            <PdfParagraph>
              조언: {analysis.chapters.chapter13_family.person2FamilyRelation.managementAdvice}
            </PdfParagraph>

            <PdfSubtitle>
              전체 가족 조화: <PdfHighlight>{analysis.chapters.chapter13_family.familyDynamics.overallHarmony}</PdfHighlight>
            </PdfSubtitle>
            <PdfQuote>
              {analysis.chapters.chapter13_family.familyDynamics.keyAdvice}
            </PdfQuote>

            <PdfSubtitle>경계 설정 조언</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter13_family.boundarySettings} />

            {analysis.chapters.chapter13_family.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter13_family.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제14장: 위기 시기와 주의점 */}
        {analysis?.chapters.chapter14_crisis && (
          <PdfChapterPage chapterNumber={14} title="위기 시기와 주의점" hanja="危機">
            <PdfParagraph>
              관계에서 주의가 필요한 시기와 취약점을 분석하여 예방책을 제시합니다.
            </PdfParagraph>

            {analysis.chapters.chapter14_crisis.crisisPeriods.length > 0 && (
              <>
                <PdfSubtitle>주의 시기</PdfSubtitle>
                {analysis.chapters.chapter14_crisis.crisisPeriods.map((period, idx) => (
                  <div key={idx} className="mb-4 p-4 bg-[#fff8f5] rounded-lg border-l-4 border-[#d4a574]">
                    <p className="text-[#5d4d3d] font-medium">
                      {period.year}년 - 위험도: {period.riskLevel}
                    </p>
                    <p className="text-sm text-[#6b5b4f] mt-1">
                      위험 요소: {period.riskAreas.join(", ")}
                    </p>
                    <p className="text-sm text-[#6b8e5a] mt-1">
                      예방책: {period.preventionAdvice}
                    </p>
                  </div>
                ))}
              </>
            )}

            <PdfSubtitle>공통 취약점</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter14_crisis.commonVulnerabilities} />

            <PdfSubtitle>위험 신호</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter14_crisis.warningSignals} />

            <PdfSubtitle>비상 시 조언</PdfSubtitle>
            <PdfQuote>
              {analysis.chapters.chapter14_crisis.emergencyAdvice}
            </PdfQuote>

            {analysis.chapters.chapter14_crisis.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter14_crisis.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제15장: 장기 전망 */}
        {analysis?.chapters.chapter15_longterm && (
          <PdfChapterPage chapterNumber={15} title="장기 전망" hanja="展望">
            <PdfParagraph>
              두 분의 관계가 앞으로 어떻게 발전할지 장기적 전망을 살펴봅니다.
            </PdfParagraph>

            <PdfSubtitle>향후 5년 전망</PdfSubtitle>
            {analysis.chapters.chapter15_longterm.fiveYearForecast.map((forecast, idx) => (
              <div key={idx} className="mb-3">
                <p className="text-[#5d4d3d] font-medium">
                  {forecast.year}년 ({forecast.relationshipScore}점) - {forecast.keyTheme}
                </p>
                <PdfParagraph>{forecast.advice}</PdfParagraph>
              </div>
            ))}

            <PdfSubtitle>10년 비전</PdfSubtitle>
            <PdfParagraph>
              전체 추세: <PdfHighlight>{analysis.chapters.chapter15_longterm.tenYearVision.overallTrend}</PdfHighlight>
            </PdfParagraph>
            <PdfList items={[
              ...analysis.chapters.chapter15_longterm.tenYearVision.milestones.map(m => `이정표: ${m}`),
              ...analysis.chapters.chapter15_longterm.tenYearVision.opportunities.map(o => `기회: ${o}`),
            ]} />

            {analysis.chapters.chapter15_longterm.tenYearVision.challenges.length > 0 && (
              <>
                <PdfSubtitle>도전 과제</PdfSubtitle>
                <PdfList items={analysis.chapters.chapter15_longterm.tenYearVision.challenges} />
              </>
            )}

            <PdfSubtitle>평생 궁합: {analysis.chapters.chapter15_longterm.lifetimeCompatibility.score}점</PdfSubtitle>
            <PdfParagraph>
              {analysis.chapters.chapter15_longterm.lifetimeCompatibility.analysis}
            </PdfParagraph>
            <PdfQuote>
              성공의 열쇠: {analysis.chapters.chapter15_longterm.lifetimeCompatibility.keyToSuccess}
            </PdfQuote>

            {analysis.chapters.chapter15_longterm.narrative && (
              <>
                <PdfDivider />
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter15_longterm.narrative} />
              </>
            )}
          </PdfChapterPage>
        )}

        {/* 제16장: 종합 조언 */}
        {analysis?.chapters.chapter16_summary && (
          <PdfChapterPage chapterNumber={16} title="종합 조언" hanja="總合">
            <PdfParagraph>
              지금까지의 분석을 종합하여 두 분의 관계를 위한 핵심 조언을 정리합니다.
            </PdfParagraph>

            <PdfSubtitle>핵심 강점</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter16_summary.coreStrengths} />

            <PdfSubtitle>주의할 약점</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter16_summary.coreWeaknesses} />

            <PdfSubtitle>꼭 해야 할 것</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter16_summary.mustDoList} />

            <PdfSubtitle>피해야 할 것</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter16_summary.mustAvoidList} />

            <PdfSubtitle>일상 습관 추천</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter16_summary.dailyHabits} />

            <PdfSubtitle>소통 규칙</PdfSubtitle>
            <PdfList items={analysis.chapters.chapter16_summary.communicationRules} />

            <PdfDivider />

            <div className="my-10 p-8 bg-gradient-to-br from-[#f5f0e8] to-[#ebe5db] border-2 border-[#c4b5a0] rounded-xl text-center">
              <p className="text-[#8b7355] text-sm tracking-widest mb-4">FINAL MESSAGE</p>
              <p className="text-xl text-[#3d3127] font-serif leading-relaxed">
                {analysis.chapters.chapter16_summary.finalMessage}
              </p>
            </div>

            {analysis.chapters.chapter16_summary.narrative && (
              <>
                <PdfSubtitle>상세 풀이</PdfSubtitle>
                <PdfNarrativeSection narrative={analysis.chapters.chapter16_summary.narrative} />
              </>
            )}
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

          h2, h3, h4 {
            break-after: avoid;
          }

          p, li, tr {
            break-inside: avoid;
          }

          table {
            break-inside: avoid;
          }

          .bg-gradient-to-b,
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

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
