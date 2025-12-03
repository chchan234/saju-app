import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SajuForm } from "@/components/saju/SajuForm";

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
