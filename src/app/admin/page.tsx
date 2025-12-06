"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Send,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  LogOut,
  Eye,
  Sparkles,
  Database,
  Copy,
  AlertTriangle,
  Trash2,
  Users,
  Heart,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpertModeRequest {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: "male" | "female";
  pdfStatus: "pending" | "generating" | "completed" | "failed";
  emailStatus: "pending" | "sent" | "failed";
  emailSentAt?: string;
}

interface CoupleRequest {
  id: string;
  createdAt: string;
  email: string;
  person1Name: string;
  person1Gender: "male" | "female";
  person1BirthYear: number;
  person1BirthMonth: number;
  person1BirthDay: number;
  person2Name: string;
  person2Gender: "male" | "female";
  person2BirthYear: number;
  person2BirthMonth: number;
  person2BirthDay: number;
  relationshipStatus: "married" | "unmarried";
  pdfStatus: "pending" | "generating" | "completed" | "failed";
  emailStatus: "pending" | "sent" | "failed";
  emailSentAt?: string;
}

const TABLE_CREATION_SQL = `CREATE TABLE IF NOT EXISTS expert_mode_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  birth_month INTEGER NOT NULL,
  birth_day INTEGER NOT NULL,
  birth_hour INTEGER NOT NULL DEFAULT 12,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  is_lunar BOOLEAN DEFAULT false,
  is_leap_month BOOLEAN DEFAULT false,
  relationship_status TEXT NOT NULL CHECK (relationship_status IN ('solo', 'dating', 'married', 'divorced')),
  occupation_status TEXT NOT NULL CHECK (occupation_status IN ('employee', 'business', 'student', 'jobseeker', 'freelance', 'homemaker', 'retired', 'other')),
  has_children BOOLEAN DEFAULT false,
  partner_info JSONB,
  pdf_status TEXT DEFAULT 'pending' CHECK (pdf_status IN ('pending', 'generating', 'completed', 'failed')),
  email_status TEXT DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed')),
  email_sent_at TIMESTAMP WITH TIME ZONE,
  analysis_result JSONB,
  pdf_url TEXT
);

ALTER TABLE expert_mode_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON expert_mode_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_created_at ON expert_mode_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_pdf_status ON expert_mode_requests(pdf_status);
CREATE INDEX IF NOT EXISTS idx_expert_mode_requests_email_status ON expert_mode_requests(email_status);`;

export default function AdminPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState<ExpertModeRequest[]>([]);
  const [coupleRequests, setCoupleRequests] = useState<CoupleRequest[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("individual");

  // 인증 상태 확인
  useEffect(() => {
    const verified = sessionStorage.getItem("admin_verified");
    const verifiedAt = sessionStorage.getItem("admin_verified_at");

    if (verified === "true" && verifiedAt) {
      // 1시간 이내 인증인지 확인
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - parseInt(verifiedAt) < oneHour) {
        setIsVerified(true);
        fetchRequests();
        fetchCoupleRequests();
      } else {
        // 세션 만료
        sessionStorage.removeItem("admin_verified");
        sessionStorage.removeItem("admin_verified_at");
        router.push("/admin/verify");
      }
    } else {
      router.push("/admin/verify");
    }

    setIsLoading(false);
  }, [router]);

  // 개인 신청 목록 조회
  const fetchRequests = async () => {
    try {
      setDbError(null);
      const res = await fetch("/api/admin/requests", {
        credentials: "include",
      });

      // 인증 실패 시 로그인 페이지로 리다이렉트
      if (res.status === 401) {
        sessionStorage.removeItem("admin_verified");
        sessionStorage.removeItem("admin_verified_at");
        router.push("/admin/verify");
        return;
      }

      const data = await res.json();

      if (!data.success || data.message?.toLowerCase().includes("table")) {
        // 테이블이 없거나 오류가 발생한 경우
        setDbError(data.message || "데이터베이스 오류");
        setRequests([]);
        return;
      }

      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setDbError("데이터베이스 연결에 실패했습니다.");
    }
  };

  // 커플 신청 목록 조회
  const fetchCoupleRequests = async () => {
    try {
      const res = await fetch("/api/admin/couple-requests", {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/verify");
        return;
      }

      const data = await res.json();

      if (data.success && data.requests) {
        setCoupleRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching couple requests:", error);
    }
  };

  // 전체 새로고침
  const refreshAll = () => {
    fetchRequests();
    fetchCoupleRequests();
  };

  // SQL 복사
  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(TABLE_CREATION_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // 분석 생성
  const handleGenerateAnalysis = async (requestId: string) => {
    setGeneratingId(requestId);
    try {
      const res = await fetch("/api/admin/generate-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/verify");
        return;
      }

      const data = await res.json();
      if (data.success) {
        fetchRequests();
        alert("분석이 성공적으로 생성되었습니다.");
      } else {
        alert(`생성 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error generating analysis:", error);
      alert("분석 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingId(null);
    }
  };

  // 분석 결과 보기
  const handleViewAnalysis = (requestId: string) => {
    router.push(`/admin/result/${requestId}`);
  };

  // PDF 이메일 발송 - 결과 페이지로 이동하여 발송
  const handleSendEmail = (requestId: string) => {
    router.push(`/admin/result/${requestId}?action=send`);
  };

  // 개인 신청 삭제
  const handleDelete = async (requestId: string) => {
    setDeletingId(requestId);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/verify");
        return;
      }

      const data = await res.json();
      if (data.success) {
        fetchRequests();
        alert("성공적으로 삭제되었습니다.");
      } else {
        alert(`삭제 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // 커플 신청 삭제
  const handleCoupleDelete = async (requestId: string) => {
    setDeletingId(requestId);
    try {
      const res = await fetch(`/api/admin/couple-requests/${requestId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/verify");
        return;
      }

      const data = await res.json();
      if (data.success) {
        fetchCoupleRequests();
        alert("성공적으로 삭제되었습니다.");
      } else {
        alert(`삭제 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting couple request:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  // 커플 분석 생성
  const handleGenerateCoupleAnalysis = async (requestId: string) => {
    setGeneratingId(requestId);
    try {
      const res = await fetch("/api/admin/generate-couple-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/admin/verify");
        return;
      }

      const data = await res.json();
      if (data.success) {
        fetchCoupleRequests();
        alert("커플 분석이 성공적으로 생성되었습니다.");
      } else {
        alert(`생성 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error generating couple analysis:", error);
      alert("분석 생성 중 오류가 발생했습니다.");
    } finally {
      setGeneratingId(null);
    }
  };

  // 커플 분석 결과 보기
  const handleViewCoupleAnalysis = (requestId: string) => {
    router.push(`/admin/couple-result/${requestId}`);
  };

  // 커플 이메일 발송 - 결과 페이지로 이동
  const handleSendCoupleEmail = (requestId: string) => {
    router.push(`/admin/couple-result/${requestId}?action=send`);
  };

  // 로그아웃
  const handleLogout = async () => {
    try {
      // 서버에서 쿠키 삭제
      await fetch("/api/admin/verify", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    // 클라이언트 상태 정리
    sessionStorage.removeItem("admin_verified");
    sessionStorage.removeItem("admin_verified_at");
    router.push("/");
  };

  // PDF 상태 뱃지
  const getPdfStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            생성완료
          </Badge>
        );
      case "generating":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            생성중
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            실패
          </Badge>
        );
      default:
        return (
          <Badge className="bg-stone-500/20 text-stone-400 border-stone-500/30">
            <Clock className="w-3 h-3 mr-1" />
            대기중
          </Badge>
        );
    }
  };

  // 이메일 상태 뱃지
  const getEmailStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            발송완료
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            실패
          </Badge>
        );
      default:
        return (
          <Badge className="bg-stone-500/20 text-stone-400 border-stone-500/30">
            <Clock className="w-3 h-3 mr-1" />
            미발송
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isVerified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      {/* 헤더 */}
      <header className="border-b border-stone-700/50 bg-stone-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-600/20 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-5 h-5 text-amber-500/80" />
            </div>
            <div>
              <h1 className="text-lg font-serif text-stone-200">
                전문가 모드 관리자
              </h1>
              <p className="text-xs text-stone-500">Expert Mode Admin</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshAll}
              className="text-stone-400 hover:text-stone-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 데이터베이스 오류 알림 */}
        {dbError && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Database className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  데이터베이스 설정 필요
                </h3>
                <p className="text-stone-400 mt-1 mb-4">
                  테이블이 생성되지 않았습니다. Supabase Dashboard에서 아래 SQL을 실행해주세요.
                </p>

                <div className="relative">
                  <pre className="bg-stone-900/80 border border-stone-700 rounded-lg p-4 overflow-x-auto text-sm text-stone-300 max-h-64 overflow-y-auto">
                    {TABLE_CREATION_SQL}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopySQL}
                    className="absolute top-2 right-2 border-stone-600 text-stone-400 hover:bg-stone-700"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        복사
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 text-sm text-stone-500">
                  <p className="font-medium mb-2">설정 방법:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:underline"
                      >
                        Supabase Dashboard
                      </a>
                      에 로그인
                    </li>
                    <li>프로젝트 선택 → SQL Editor 메뉴 클릭</li>
                    <li>위 SQL 복사 후 붙여넣기</li>
                    <li>&quot;Run&quot; 버튼 클릭</li>
                    <li>이 페이지 새로고침</li>
                  </ol>
                </div>

                <Button
                  onClick={fetchRequests}
                  className="mt-4 bg-amber-600 hover:bg-amber-500"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  테이블 확인 후 새로고침
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 탭 UI */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-stone-800/50 border border-stone-700/50 mb-6">
            <TabsTrigger
              value="individual"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              개인 분석
            </TabsTrigger>
            <TabsTrigger
              value="couple"
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
            >
              <Heart className="w-4 h-4 mr-2" />
              커플 분석
            </TabsTrigger>
          </TabsList>

          {/* 개인 분석 탭 */}
          <TabsContent value="individual">
            {/* 개인 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">전체 신청</p>
                <p className="text-2xl font-bold text-stone-200">{requests.length}</p>
              </div>
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">PDF 생성 완료</p>
                <p className="text-2xl font-bold text-green-400">
                  {requests.filter((r) => r.pdfStatus === "completed").length}
                </p>
              </div>
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">발송 완료</p>
                <p className="text-2xl font-bold text-blue-400">
                  {requests.filter((r) => r.emailStatus === "sent").length}
                </p>
              </div>
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">발송 대기</p>
                <p className="text-2xl font-bold text-amber-400">
                  {
                    requests.filter(
                      (r) =>
                        r.pdfStatus === "completed" && r.emailStatus === "pending"
                    ).length
                  }
                </p>
              </div>
            </div>

            {/* 개인 신청 목록 테이블 */}
            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-stone-700/50">
                <h2 className="text-lg font-medium text-stone-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  개인 전문가 모드 신청 목록
                </h2>
              </div>

              {requests.length === 0 ? (
                <div className="p-12 text-center text-stone-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>아직 신청 내역이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-stone-700/50 hover:bg-stone-700/20">
                      <TableHead className="text-stone-400">신청일</TableHead>
                      <TableHead className="text-stone-400">이름</TableHead>
                      <TableHead className="text-stone-400">이메일</TableHead>
                      <TableHead className="text-stone-400">생년월일</TableHead>
                      <TableHead className="text-stone-400">PDF 상태</TableHead>
                      <TableHead className="text-stone-400">발송 상태</TableHead>
                      <TableHead className="text-stone-400 text-right">
                        액션
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-stone-700/50 hover:bg-stone-700/20"
                      >
                        <TableCell className="text-stone-300 text-sm">
                          {new Date(request.createdAt).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-stone-200 font-medium">
                          {request.name}
                        </TableCell>
                        <TableCell className="text-stone-300 text-sm">
                          {request.email}
                        </TableCell>
                        <TableCell className="text-stone-300 text-sm">
                          {request.birthYear}.{request.birthMonth}.{request.birthDay}
                          <span className="text-stone-500 ml-1">
                            ({request.gender === "male" ? "남" : "여"})
                          </span>
                        </TableCell>
                        <TableCell>{getPdfStatusBadge(request.pdfStatus)}</TableCell>
                        <TableCell>
                          {getEmailStatusBadge(request.emailStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* 분석 생성 버튼 */}
                            {request.pdfStatus === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={generatingId === request.id}
                                onClick={() => handleGenerateAnalysis(request.id)}
                                className="border-amber-600 text-amber-500 hover:bg-amber-600/10"
                              >
                                {generatingId === request.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    분석 생성
                                  </>
                                )}
                              </Button>
                            )}

                            {/* 결과 보기 버튼 */}
                            {request.pdfStatus === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewAnalysis(request.id)}
                                className="border-blue-500 text-blue-400 hover:bg-blue-600/10"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                결과 보기
                              </Button>
                            )}

                            {/* 이메일 발송 버튼 */}
                            <Button
                              size="sm"
                              disabled={
                                request.pdfStatus !== "completed" ||
                                request.emailStatus === "sent" ||
                                sendingId === request.id
                              }
                              onClick={() => handleSendEmail(request.id)}
                              className="bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                            >
                              {sendingId === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-1" />
                                  보내기
                                </>
                              )}
                            </Button>

                            {/* 삭제 버튼 */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={deletingId === request.id}
                                  className="border-red-500/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
                                >
                                  {deletingId === request.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-stone-800 border-stone-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-stone-200">
                                    신청 삭제 확인
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-stone-400">
                                    <span className="font-medium text-stone-300">{request.name}</span>님의 신청을 삭제하시겠습니까?
                                    <br />
                                    이 작업은 되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600">
                                    취소
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(request.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white"
                                  >
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* 커플 분석 탭 */}
          <TabsContent value="couple">
            {/* 커플 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">전체 커플 신청</p>
                <p className="text-2xl font-bold text-stone-200">{coupleRequests.length}</p>
              </div>
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">PDF 생성 완료</p>
                <p className="text-2xl font-bold text-green-400">
                  {coupleRequests.filter((r) => r.pdfStatus === "completed").length}
                </p>
              </div>
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">발송 완료</p>
                <p className="text-2xl font-bold text-blue-400">
                  {coupleRequests.filter((r) => r.emailStatus === "sent").length}
                </p>
              </div>
              <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl p-4">
                <p className="text-sm text-stone-500">발송 대기</p>
                <p className="text-2xl font-bold text-pink-400">
                  {
                    coupleRequests.filter(
                      (r) =>
                        r.pdfStatus === "completed" && r.emailStatus === "pending"
                    ).length
                  }
                </p>
              </div>
            </div>

            {/* 커플 신청 목록 테이블 */}
            <div className="bg-stone-800/50 border border-stone-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-stone-700/50">
                <h2 className="text-lg font-medium text-stone-200 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  커플 전문가 모드 신청 목록
                </h2>
              </div>

              {coupleRequests.length === 0 ? (
                <div className="p-12 text-center text-stone-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>아직 커플 신청 내역이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-stone-700/50 hover:bg-stone-700/20">
                      <TableHead className="text-stone-400">신청일</TableHead>
                      <TableHead className="text-stone-400">첫번째 분</TableHead>
                      <TableHead className="text-stone-400">두번째 분</TableHead>
                      <TableHead className="text-stone-400">이메일</TableHead>
                      <TableHead className="text-stone-400">관계</TableHead>
                      <TableHead className="text-stone-400">PDF 상태</TableHead>
                      <TableHead className="text-stone-400">발송 상태</TableHead>
                      <TableHead className="text-stone-400 text-right">
                        액션
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupleRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-stone-700/50 hover:bg-stone-700/20"
                      >
                        <TableCell className="text-stone-300 text-sm">
                          {new Date(request.createdAt).toLocaleDateString("ko-KR")}
                        </TableCell>
                        <TableCell className="text-stone-200">
                          <div className="flex flex-col">
                            <span className="font-medium">{request.person1Name}</span>
                            <span className="text-xs text-stone-500">
                              {request.person1BirthYear}.{request.person1BirthMonth}.{request.person1BirthDay}
                              ({request.person1Gender === "male" ? "남" : "여"})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-stone-200">
                          <div className="flex flex-col">
                            <span className="font-medium">{request.person2Name}</span>
                            <span className="text-xs text-stone-500">
                              {request.person2BirthYear}.{request.person2BirthMonth}.{request.person2BirthDay}
                              ({request.person2Gender === "male" ? "남" : "여"})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-stone-300 text-sm">
                          {request.email}
                        </TableCell>
                        <TableCell>
                          <Badge className={request.relationshipStatus === "married"
                            ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                            : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                          }>
                            {request.relationshipStatus === "married" ? "기혼" : "미혼"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPdfStatusBadge(request.pdfStatus)}</TableCell>
                        <TableCell>
                          {getEmailStatusBadge(request.emailStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* 분석 생성 버튼 */}
                            {request.pdfStatus === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={generatingId === request.id}
                                onClick={() => handleGenerateCoupleAnalysis(request.id)}
                                className="border-pink-600 text-pink-500 hover:bg-pink-600/10"
                              >
                                {generatingId === request.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    분석 생성
                                  </>
                                )}
                              </Button>
                            )}

                            {/* 결과 보기 버튼 */}
                            {request.pdfStatus === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewCoupleAnalysis(request.id)}
                                className="border-blue-500 text-blue-400 hover:bg-blue-600/10"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                결과 보기
                              </Button>
                            )}

                            {/* 이메일 발송 버튼 */}
                            <Button
                              size="sm"
                              disabled={
                                request.pdfStatus !== "completed" ||
                                request.emailStatus === "sent" ||
                                sendingId === request.id
                              }
                              onClick={() => handleSendCoupleEmail(request.id)}
                              className="bg-pink-600 hover:bg-pink-500 text-white disabled:opacity-50"
                            >
                              {sendingId === request.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-1" />
                                  보내기
                                </>
                              )}
                            </Button>

                            {/* 삭제 버튼 */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={deletingId === request.id}
                                  className="border-red-500/50 text-red-400 hover:bg-red-600/10 hover:text-red-300"
                                >
                                  {deletingId === request.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-stone-800 border-stone-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-stone-200">
                                    커플 신청 삭제 확인
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-stone-400">
                                    <span className="font-medium text-stone-300">{request.person1Name}</span>님과{" "}
                                    <span className="font-medium text-stone-300">{request.person2Name}</span>님의 커플 신청을 삭제하시겠습니까?
                                    <br />
                                    이 작업은 되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-stone-700 border-stone-600 text-stone-300 hover:bg-stone-600">
                                    취소
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCoupleDelete(request.id)}
                                    className="bg-red-600 hover:bg-red-500 text-white"
                                  >
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
