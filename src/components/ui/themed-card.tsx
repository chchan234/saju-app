"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CARD_THEMES, type CardTheme } from "@/lib/saju-constants";
import type { LucideIcon } from "lucide-react";

interface ThemedCardProps {
  theme: CardTheme;
  icon: LucideIcon;
  label: string;
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

/**
 * 테마가 적용된 카드 컴포넌트
 * 도메인별 그라데이션 바와 아이콘 스타일이 자동 적용됩니다.
 */
export function ThemedCard({
  theme,
  icon: Icon,
  label,
  title,
  children,
  headerRight,
  className = "",
}: ThemedCardProps) {
  const t = CARD_THEMES[theme];

  return (
    <Card
      className={`border-none shadow-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm overflow-hidden ${className}`}
    >
      {/* 테마별 그라데이션 바 */}
      <div className={`h-2 bg-gradient-to-r ${t.gradient}`} />

      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-serif text-xl">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full ${t.iconBg}`}
          >
            <Icon className="w-5 h-5" style={{ color: t.accent }} />
          </span>
          <div>
            <span className="block text-sm text-muted-foreground font-sans font-normal">
              {label}
            </span>
            <span className="text-[#5C544A] dark:text-[#D4C5B0]">{title}</span>
          </div>
          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </CardTitle>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}

/**
 * 테마 그라데이션 바만 렌더링하는 컴포넌트
 * 기존 카드 구조를 유지하면서 그라데이션만 적용할 때 사용
 */
export function ThemeGradientBar({ theme }: { theme: CardTheme }) {
  const t = CARD_THEMES[theme];
  return <div className={`h-2 bg-gradient-to-r ${t.gradient}`} />;
}

/**
 * 테마 아이콘 래퍼 컴포넌트
 * 아이콘에 테마 스타일을 적용할 때 사용
 */
export function ThemeIconWrapper({
  theme,
  icon: Icon,
  size = "default",
}: {
  theme: CardTheme;
  icon: LucideIcon;
  size?: "default" | "small" | "large";
}) {
  const t = CARD_THEMES[theme];
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-12 h-12",
  };
  const iconSizes = {
    small: "w-4 h-4",
    default: "w-5 h-5",
    large: "w-6 h-6",
  };

  return (
    <span
      className={`flex items-center justify-center rounded-full ${sizeClasses[size]} ${t.iconBg}`}
    >
      <Icon className={iconSizes[size]} style={{ color: t.accent }} />
    </span>
  );
}
