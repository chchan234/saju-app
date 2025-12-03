"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Mountain,
    Flame,
    Droplets,
    Coins,
    TreeDeciduous,
    Sparkles,
    ChevronUp,
    ChevronDown,
    Copy,
    Check,
} from "lucide-react";
import { useState } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import type { Pillar, OhengCount } from "@/types/saju";

// --- Bokbi (Fortune Fee) Modal ---

export function BokbiModal() {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const accountNumber = "3333-01-5848626";

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling envelope when clicking copy
        try {
            await navigator.clipboard.writeText(accountNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = accountNumber;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const openEnvelope = () => {
        if (!isEnvelopeOpen) {
            setIsEnvelopeOpen(true);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setIsEnvelopeOpen(false); // Reset on close
        }}>
            <DialogTrigger asChild>
                <Button
                    className="bg-[#BFA588] hover:bg-[#A89070] text-[#2C2824] font-serif border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                    <span className="mr-2">🧧</span> 복채 봉투 건네기
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#F5F1E6] dark:bg-[#2C2824] border-[#D4C5B0] dark:border-[#5C544A] p-0 overflow-visible border-0 shadow-2xl">
                <div className="relative p-8 pt-12 flex flex-col items-center text-center min-h-[500px]">
                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-[#F5F1E6] dark:bg-[#2C2824] rounded-lg overflow-hidden">
                        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/korean-paper.png')] mix-blend-multiply"></div>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#BFA588] via-[#D4C5B0] to-[#BFA588]"></div>
                    </div>

                    <DialogHeader className="mb-8 relative z-10">
                        <DialogTitle className="text-2xl font-serif font-bold text-[#5C544A] dark:text-[#D4C5B0] flex flex-col items-center gap-3">
                            <span className="text-xs font-sans font-medium text-[#8E7F73] tracking-[0.3em] uppercase">Energy Exchange</span>
                            <span className="text-3xl">복채(福債)를 건네다</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative z-10 w-full max-w-[280px] mx-auto flex flex-col items-center">
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-7 break-keep mb-8 font-medium">
                            "복비는 단순한 비용이 아니라,<br />
                            당신의 운명을 긍정적으로 바꾸는<br />
                            <span className="font-bold text-[#BFA588] underline decoration-[#BFA588]/50 underline-offset-4">에너지의 교환</span>입니다."
                        </p>

                        {/* --- REALISTIC ENVELOPE COMPONENT --- */}
                        <div
                            className={`relative w-full cursor-pointer group perspective-1000 transition-all duration-500 ${isEnvelopeOpen ? 'h-56' : 'h-40'}`}
                            onClick={openEnvelope}
                        >
                            {/* 1. LAYER: BACK (Inside of Envelope) */}
                            {/* This is the dark inside part visible when opened */}
                            <div className="absolute inset-0 bg-[#8E7F73] dark:bg-[#3E3832] rounded-b-lg shadow-inner overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-black/20"></div>
                            </div>

                            {/* 2. LAYER: CONTENT (Money/Card) */}
                            {/* Slides UP from BEHIND the Front layer, but IN FRONT of the Back layer */}
                            <div
                                className={`absolute left-3 right-3 h-32 bg-white dark:bg-[#1a1a1a] rounded shadow-md flex flex-col items-center justify-center p-4 transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) border border-stone-100 dark:border-stone-700
                                ${isEnvelopeOpen ? 'bottom-24 z-30' : 'bottom-2 z-10'}`}
                                style={{
                                    transitionDelay: isEnvelopeOpen ? '300ms' : '0ms', // Wait for flap to open
                                    pointerEvents: isEnvelopeOpen ? 'auto' : 'none'
                                }}
                            >
                                <div className="w-full h-full border border-stone-200 dark:border-stone-600 rounded flex flex-col items-center justify-center relative overflow-hidden">
                                    {/* Watermark/Pattern on money */}
                                    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400 to-transparent"></div>

                                    <p className="text-[10px] text-stone-400 mb-1 uppercase tracking-wider">KakaoBank</p>
                                    <p className="font-mono font-bold text-stone-700 dark:text-stone-300 text-lg tracking-wider z-10">3333-01-5848626</p>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="relative z-50 mt-3 h-8 text-xs gap-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                                        <span className={copied ? "text-green-700 font-medium" : "text-stone-600"}>
                                            {copied ? "복사완료" : "계좌번호 복사"}
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* 3. LAYER: FRONT (The Pocket) */}
                            {/* Covers the bottom of the content. Highest Z-index for body parts. */}
                            <div
                                className="absolute inset-0 z-20 pointer-events-none"
                            >
                                {/* Using SVG for precise envelope shape with V-cut */}
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="drop-shadow-md">
                                    <defs>
                                        <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise" />
                                            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                                            <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
                                        </filter>
                                    </defs>
                                    {/* Main Body Path */}
                                    <path
                                        d="M0,0 L50,55 L100,0 L100,100 L0,100 Z"
                                        className="fill-[#D4C5B0] dark:fill-[#5C5044]"
                                    />
                                    {/* Left Fold Shadow (Subtle) */}
                                    <path d="M0,0 L50,55 L0,100 Z" className="fill-black/5 mix-blend-multiply" />
                                    {/* Right Fold Shadow (Subtle) */}
                                    <path d="M100,0 L50,55 L100,100 Z" className="fill-black/10 mix-blend-multiply" />
                                </svg>

                                {/* Seal (Stays on the front body when open? No, seal usually breaks or is on flap. Let's put it on the flap for realism, or just decorative on body) */}
                                {/* Actually, if the seal is "locking" the flap, it should move with the flap or break. 
                                    Let's keep it simple: A seal on the flap is better. Removing from here. */}
                            </div>

                            {/* 4. LAYER: FLAP (The Lid) */}
                            {/* Rotates from the top. */}
                            <div
                                className="absolute top-0 left-0 w-full h-[55%] origin-top"
                                style={{
                                    transform: isEnvelopeOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                    transformStyle: 'preserve-3d',
                                    zIndex: isEnvelopeOpen ? 5 : 30,
                                    transition: 'transform 500ms ease-in-out, z-index 0ms linear 250ms'
                                }}
                            >
                                {/* Flap Front (Visible when closed) */}
                                <div className="absolute inset-0 backface-hidden">
                                    <svg width="100%" height="100%" viewBox="0 0 100 55" preserveAspectRatio="none" className="drop-shadow-lg">
                                        <path d="M0,0 L50,55 L100,0 Z" className="fill-[#C5B4A0] dark:fill-[#4A4036]" />
                                        {/* Texture Overlay */}
                                        <path d="M0,0 L50,55 L100,0 Z" className="fill-black/5 mix-blend-multiply" />
                                    </svg>

                                    {/* Seal - Attached to Flap Front */}
                                    <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 translate-y-1/2 w-10 h-10 bg-[#8B0000] rounded-full shadow-lg flex items-center justify-center border-2 border-[#A52A2A]">
                                        <span className="text-[#D4AF37] font-serif font-bold text-lg">福</span>
                                    </div>
                                </div>

                                {/* Flap Back (Visible when open) */}
                                <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateX(180deg)' }}>
                                    <svg width="100%" height="100%" viewBox="0 0 100 55" preserveAspectRatio="none">
                                        {/* Fixed Path: Upright Triangle (Base at bottom 55, Tip at top 0)
                                            When rotated 180 (Back Face) -> Becomes Inverted (Base at top 0, Tip at bottom 55)
                                            When rotated 180 (Container) -> Becomes Upright (Base at hinge, Tip pointing up)
                                        */}
                                        <path d="M0,55 L50,0 L100,55 Z" className="fill-[#BFA588] dark:fill-[#5C5044]" />
                                        {/* Texture Overlay for Back Face */}
                                        <path d="M0,55 L50,0 L100,55 Z" className="fill-black/5 mix-blend-multiply" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {!isEnvelopeOpen && (
                            <p className="text-xs text-stone-500 animate-pulse mt-8">
                                봉투를 터치하여 열어보세요
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

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
