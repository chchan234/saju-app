"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Home, FileText } from "lucide-react";
import Link from "next/link";

interface ResultData {
  id: string;
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: string;
  createdAt: string;
}

export default function ExpertResultPage() {
  const params = useParams();
  const requestId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 공개 API 사용
        const res = await fetch(`/api/expert/result/${requestId}`);
        const result = await res.json();
        if (result.success) {
          setData(result.result);
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
  }, [requestId]);

  // PDF 다운로드 (공개 API 사용)
  const handleDownloadPdf = async () => {
    if (!data) {
      alert("분석 결과가 없습니다.");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      console.log("PDF 생성 요청 시작...");
      // 공개 PDF API 사용
      const res = await fetch("/api/expert/generate-pdf", {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d5]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#8b7355] mx-auto mb-4" />
          <p className="text-[#8b7b6f]">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d5]">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-[#3d3127] mb-2">결과를 찾을 수 없습니다</h2>
          <p className="text-[#8b7b6f] mb-6">{error || "요청하신 분석 결과를 찾을 수 없습니다."}</p>
          <Link href="/">
            <Button variant="outline" className="border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d5] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-[#8b7355] to-[#6b5344] p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            전문가 사주 분석 리포트
          </h1>
          <p className="text-white/80 text-sm">
            Expert Saju Analysis Report
          </p>
        </div>

        {/* 본문 */}
        <div className="p-8">
          {/* 사용자 정보 */}
          <div className="bg-[#f5f0e8] rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#3d3127] mb-4 text-center">
              {data.name}님의 분석 결과
            </h2>
            <div className="space-y-2 text-sm text-[#6b5b4f]">
              <div className="flex justify-between">
                <span>생년월일</span>
                <span className="font-medium">{data.birthYear}년 {data.birthMonth}월 {data.birthDay}일</span>
              </div>
              <div className="flex justify-between">
                <span>성별</span>
                <span className="font-medium">{data.gender === "male" ? "남성" : "여성"}</span>
              </div>
              <div className="flex justify-between">
                <span>분석일</span>
                <span className="font-medium">
                  {new Date(data.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="text-center mb-6">
            <p className="text-[#6b5b4f] text-sm leading-relaxed">
              아래 버튼을 클릭하시면<br />
              상세한 분석 리포트를 PDF로 다운로드하실 수 있습니다.
            </p>
          </div>

          {/* 다운로드 버튼 */}
          <Button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full bg-[#8b7355] hover:bg-[#6b5344] text-white py-6 text-lg font-semibold rounded-xl"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                PDF 생성 중... (약 15초 소요)
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                PDF 리포트 다운로드
              </>
            )}
          </Button>

          {/* 홈으로 링크 */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#8b7355] hover:underline">
              정통사주 홈으로 돌아가기
            </Link>
          </div>
        </div>

        {/* 푸터 */}
        <div className="bg-[#f5f0e8] px-8 py-4 text-center">
          <p className="text-xs text-[#8b7b6f]">
            본 리포트는 정통사주 전문가 모드 서비스를 통해 생성되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
