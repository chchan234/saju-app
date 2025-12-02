"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Mountain,
    Flame,
    Droplets,
    Coins,
    TreeDeciduous,
    Sparkles,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import type { Pillar, OhengCount } from "@/types/saju";

// --- Constants ---

export const OHENG_COLORS: Record<string, string> = {
    목: "bg-green-600",
    화: "bg-red-600",
    토: "bg-yellow-600",
    금: "bg-slate-400",
    수: "bg-blue-600",
};

export const OHENG_TEXT_COLORS: Record<string, string> = {
    목: "text-green-700",
    화: "text-red-700",
    토: "text-yellow-700",
    금: "text-slate-600",
    수: "text-blue-700",
};

export const OHENG_CHART_COLORS: Record<string, string> = {
    목: "#16a34a", // green-600
    화: "#dc2626", // red-600
    토: "#ca8a04", // yellow-600
    금: "#94a3b8", // slate-400
    수: "#2563eb", // blue-600
};

export const OHENG_ICONS: Record<string, React.ReactNode> = {
    목: <TreeDeciduous className="w-4 h-4" />,
    화: <Flame className="w-4 h-4" />,
    토: <Mountain className="w-4 h-4" />,
    금: <Coins className="w-4 h-4" />,
    수: <Droplets className="w-4 h-4" />,
};

// --- Components ---

// 1. Mystical Intro Card (Hero Section Wrapper)
interface MysticalIntroCardProps {
    title: React.ReactNode;
    subtitle?: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
    variant?: "default" | "couple" | "family";
}

export function MysticalIntroCard({ title, subtitle, content, footer, variant = "default" }: MysticalIntroCardProps) {
    // Variant-based styling adjustments could go here
    const accentColor = variant === "couple" ? "#EC4899" : variant === "family" ? "#D97706" : "#BFA588"; // Pink for couple, Amber for family, Beige for default
    const accentClass = variant === "couple" ? "text-pink-400" : variant === "family" ? "text-amber-400" : "text-[#BFA588]";

    return (
        <div className="relative overflow-hidden rounded-xl bg-[#2C2824] text-[#E8DCC4] p-8 shadow-xl">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#BFA588] blur-3xl"></div>
                <div className="absolute top-20 right-10 w-60 h-60 rounded-full bg-[#8E7F73] blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 mb-2">
                    <Sparkles className={`w-6 h-6 ${accentClass}`} />
                </div>

                {subtitle && (
                    <p className={`font-serif text-lg italic tracking-wide ${accentClass} opacity-80`}>
                        {subtitle}
                    </p>
                )}

                <div className="space-y-2 my-2">
                    <div className="text-2xl md:text-3xl font-serif font-bold leading-relaxed">
                        {title}
                    </div>
                </div>

                <div className={`w-16 h-px bg-gradient-to-r from-transparent via-${variant === 'couple' ? 'pink' : variant === 'family' ? 'amber' : '[#BFA588]'}/50 to-transparent my-2`}></div>

                <div className="text-sm md:text-base text-[#E8DCC4]/80 max-w-lg leading-relaxed">
                    {content}
                </div>

                {footer && (
                    <div className="mt-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// 2. Pillar Card (Wooden Tablet Style)
export function PillarCard({ pillar, label, size = "default" }: { pillar: Pillar; label: string; size?: "default" | "small" }) {
    const isSmall = size === "small";
    const widthClass = isSmall ? "w-16" : "w-20";
    const heightClass = isSmall ? "h-24" : "h-32";
    const textClass = isSmall ? "text-2xl" : "text-3xl";
    const labelClass = isSmall ? "text-xs" : "text-sm";

    return (
        <div className="flex flex-col items-center gap-2 md:gap-3">
            <span className={`${labelClass} font-serif text-stone-600 dark:text-stone-400 font-medium tracking-widest`}>{label}</span>
            <div className="relative group">
                {/* Wood Effect Background */}
                <div className="absolute inset-0 bg-[#E8DCC4] dark:bg-[#3E3832] rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform duration-300 shadow-md border border-[#D4C5B0] dark:border-[#5C544A]"></div>

                <div className={`relative flex flex-col items-center justify-center ${widthClass} ${heightClass} bg-[#F5F1E6] dark:bg-[#2C2824] border-2 border-[#8E7F73] dark:border-[#A89F91] rounded-lg shadow-inner p-1 md:p-2 transform -rotate-1 group-hover:rotate-0 transition-transform duration-300`}>
                    {/* Cheongan */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full border-b border-dashed border-[#8E7F73]/30">
                        <span className={`${textClass} font-serif font-bold ${OHENG_TEXT_COLORS[pillar.cheonganOheng]}`}>
                            {pillar.cheongan}
                        </span>
                        {!isSmall && <span className="text-[10px] text-muted-foreground mt-1 font-sans">{pillar.cheonganOheng}</span>}
                    </div>

                    {/* Jiji */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <span className={`${textClass} font-serif font-bold ${OHENG_TEXT_COLORS[pillar.jijiOheng]}`}>
                            {pillar.jiji}
                        </span>
                        {!isSmall && <span className="text-[10px] text-muted-foreground mt-1 font-sans">{pillar.jijiOheng}</span>}
                    </div>
                </div>
            </div>

            {/* Sipsin Info (Optional/Small) */}
            {!isSmall && (
                <div className="flex flex-col items-center gap-1 mt-1">
                    {pillar.cheonganSipsin && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-white/50 dark:bg-black/20 border-stone-300">
                            {pillar.cheonganSipsin}
                        </Badge>
                    )}
                    {pillar.jijiSipsin && (
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-white/50 dark:bg-black/20 border-stone-300">
                            {pillar.jijiSipsin}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}

// 3. Oheng Radar Chart
export function OhengChart({ ohengCount }: { ohengCount: OhengCount }) {
    const data = [
        { subject: "목(나무)", A: ohengCount["목"], fullMark: 5, fill: OHENG_CHART_COLORS["목"] },
        { subject: "화(불)", A: ohengCount["화"], fullMark: 5, fill: OHENG_CHART_COLORS["화"] },
        { subject: "토(흙)", A: ohengCount["토"], fullMark: 5, fill: OHENG_CHART_COLORS["토"] },
        { subject: "금(쇠)", A: ohengCount["금"], fullMark: 5, fill: OHENG_CHART_COLORS["금"] },
        { subject: "수(물)", A: ohengCount["수"], fullMark: 5, fill: OHENG_CHART_COLORS["수"] },
    ];

    return (
        <div className="w-full h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12, fontFamily: 'var(--font-serif)' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar
                        name="오행 분포"
                        dataKey="A"
                        stroke="#8E7F73"
                        strokeWidth={2}
                        fill="#D4C5B0"
                        fillOpacity={0.5}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Center Decoration */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                <div className="w-32 h-32 rounded-full border-4 border-stone-400"></div>
            </div>
        </div>
    );
}
