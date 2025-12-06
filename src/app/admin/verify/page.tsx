"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminVerifyPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include", // 쿠키 포함
      });

      const data = await res.json();

      if (res.status === 429) {
        setError(data.message || "로그인 시도 횟수를 초과했습니다.");
        return;
      }

      if (data.success) {
        // JWT 토큰이 HTTP-only 쿠키로 설정됨
        // 클라이언트 상태도 유지 (UI 표시용)
        sessionStorage.setItem("admin_verified", "true");
        sessionStorage.setItem("admin_verified_at", Date.now().toString());
        router.push("/admin");
      } else {
        setError(data.message || "비밀번호가 일치하지 않습니다.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      <div className="w-full max-w-md p-8">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative bg-stone-800/50 backdrop-blur-sm border border-stone-700/50 rounded-2xl p-8 shadow-2xl">
          {/* 헤더 */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-stone-600/20 flex items-center justify-center mb-4 border border-amber-500/30">
              <Lock className="w-8 h-8 text-amber-500/80" />
            </div>
            <h1 className="text-xl font-serif text-stone-200">관리자 인증</h1>
            <p className="text-sm text-stone-500 mt-2">접근 권한을 확인합니다</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-stone-400">
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="bg-stone-900/50 border-stone-700 text-stone-200 placeholder:text-stone-600 pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border-none"
            >
              {isLoading ? "확인 중..." : "확인"}
            </Button>
          </form>

          {/* 뒤로가기 */}
          <button
            onClick={() => router.push("/")}
            className="w-full mt-4 text-sm text-stone-500 hover:text-stone-400 transition-colors"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
