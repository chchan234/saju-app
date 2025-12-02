import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "운명 - 당신의 이야기를 듣다",
  description: "사주팔자로 알아보는 당신의 운명. 정확한 만세력 데이터 기반의 사주 풀이 서비스.",
  keywords: ["사주", "팔자", "운명", "궁합", "만세력", "오행", "용신"],
  openGraph: {
    title: "운명 - 당신의 이야기를 듣다",
    description: "사주팔자로 알아보는 당신의 운명",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${notoSerifKR.variable} font-sans antialiased`}
      >
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-secondary/30 blur-3xl" />
          <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] rounded-full bg-accent/20 blur-3xl" />
        </div>
        {children}
      </body>
    </html>
  );
}
