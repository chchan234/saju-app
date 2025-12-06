"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail } from "lucide-react";

export default function ExpertCompletePagePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1410] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-[#2d2319]/90 rounded-2xl p-8 shadow-xl border border-[#3d3127]">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-serif font-bold text-[#e8dcc8] mb-2">
            신청이 완료되었습니다
          </h1>

          <p className="text-[#a89880] mb-6">
            전문가 분석 신청이 정상적으로 접수되었습니다.
          </p>

          {/* 안내 사항 */}
          <div className="bg-amber-900/20 rounded-xl p-4 mb-6 text-left border border-amber-800/30">
            <h3 className="font-medium text-amber-400 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              다음 단계
            </h3>
            <ul className="text-sm text-amber-300/80 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>입금 확인 후 PDF 분석 리포트가 생성됩니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>1-2일 내 입력하신 이메일로 PDF가 발송됩니다.</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => router.push("/")}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
