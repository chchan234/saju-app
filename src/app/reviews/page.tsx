"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, ArrowLeft } from "lucide-react";

interface Review {
  id: string;
  nickname: string;
  rating: number;
  review_type: string;
  message: string;
  created_at: string;
}

const REVIEW_TYPE_LABELS: Record<string, string> = {
  personal: "개인 운세",
  couple: "연인/부부 궁합",
  family: "가족 통합",
};

function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR");
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<{ totalCount: number; averageRating: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewType, setReviewType] = useState<string>("");
  const [message, setMessage] = useState("");

  // 후기 목록 로드
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews?limit=50");
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 후기 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!reviewType) {
      alert("분석 종류를 선택해주세요.");
      return;
    }
    if (!message.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          rating,
          reviewType,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "후기 등록에 실패했습니다.");
        return;
      }

      // 성공 시 폼 초기화 및 목록 새로고침
      setNickname("");
      setRating(5);
      setReviewType("");
      setMessage("");
      fetchReviews();
      alert("후기가 등록되었습니다. 감사합니다!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("후기 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">적중 후기</h1>
            {stats && (
              <p className="text-muted-foreground text-sm">
                평균 {stats.averageRating.toFixed(1)}점 · {stats.totalCount}개 후기
              </p>
            )}
          </div>
        </header>

        {/* 후기 작성 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">후기 남기기</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    placeholder="닉네임 (최대 20자)"
                    maxLength={20}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewType">분석 종류</Label>
                  <Select value={reviewType} onValueChange={setReviewType}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">개인 운세</SelectItem>
                      <SelectItem value="couple">연인/부부 궁합</SelectItem>
                      <SelectItem value="family">가족 통합</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>별점</Label>
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">후기 내용</Label>
                <Textarea
                  id="message"
                  placeholder="사주 분석이 어땠는지 후기를 남겨주세요! (최대 300자)"
                  maxLength={300}
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length}/300
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "등록 중..." : "후기 등록하기"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 후기 목록 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">모든 후기</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                아직 후기가 없습니다. 첫 번째 후기를 남겨주세요!
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="font-medium">{review.nickname}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {REVIEW_TYPE_LABELS[review.review_type] || review.review_type}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(review.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90">{review.message}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
