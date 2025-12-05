import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SajuForm } from "@/components/saju/SajuForm";
import { ViewCount } from "@/components/ViewCount";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <header className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="font-serif text-5xl font-semibold text-primary tracking-tight">
            운명
          </h1>
          <p className="font-serif text-muted-foreground">
            당신의 삶에 숨겨진 이야기를 찾아드립니다.
          </p>
          <div className="pt-2 flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 bg-muted/50 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              개인정보 수집 없음 · 데이터 저장 안함
            </span>
            <ViewCount />
          </div>
        </header>

        {/* 메인 카드 */}
        <Card className="backdrop-blur-xl bg-card/80 border-white/60 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-serif text-xl">사주 풀이</CardTitle>
            <CardDescription>
              정확한 풀이를 위해 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SajuForm />
            <p className="text-center text-[11px] text-muted-foreground/60 mt-4 pt-3 border-t border-border/50">
              입력하신 정보는 분석 후 즉시 삭제됩니다
            </p>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <footer className="text-center text-sm text-muted-foreground/60 animate-in fade-in duration-700 delay-500">
          <p>© 2025 운명. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
