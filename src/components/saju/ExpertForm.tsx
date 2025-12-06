"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonForm } from "./PersonForm";
import { Send, Copy, Check, CreditCard, Star, Mail } from "lucide-react";
import type {
  BirthHour,
  CalendarType,
  Gender,
  RelationshipStatus,
  OccupationStatus,
} from "@/types/saju";
import { BIRTH_HOUR_OPTIONS } from "@/lib/constants";

interface PersonData {
  name: string;
  gender: Gender;
  year: string;
  month: string;
  day: string;
  hour: BirthHour;
  calendarType: CalendarType;
  isLeapMonth: boolean;
}

interface ExpertPersonData extends PersonData {
  relationshipStatus: RelationshipStatus;
  occupationStatus: OccupationStatus;
  hasChildren: boolean;
}

interface FamilyMemberData extends PersonData {
  relation: string;
}

const defaultPerson: PersonData = {
  name: "",
  gender: "female",
  year: "",
  month: "",
  day: "",
  hour: "unknown",
  calendarType: "solar",
  isLeapMonth: false,
};

const defaultExpertPerson: ExpertPersonData = {
  ...defaultPerson,
  relationshipStatus: "solo",
  occupationStatus: "employee",
  hasChildren: false,
};

// 다크 모드용 스타일 (커스텀 브라운)
const darkInputClass = "bg-[#3d3127]/50 border-[#4d4137] text-[#e8dcc8] placeholder:text-[#7a6a5a] focus:border-[#5d5147] focus:ring-[#5d5147]";
const darkLabelClass = "text-[#c8bca8]";
const darkRadioLabelClass = "cursor-pointer text-sm text-[#c8bca8]";

// 분석 비용
const ANALYSIS_PRICE = 50000;
const BANK_ACCOUNT = "3333-01-5848626";
const BANK_NAME = "카카오뱅크";

// 헬퍼 함수들
const getGenderLabel = (gender: Gender) => gender === "female" ? "여성" : "남성";
const getCalendarLabel = (type: CalendarType) => type === "solar" ? "양력" : "음력";
const getHourLabel = (hour: BirthHour) => {
  const option = BIRTH_HOUR_OPTIONS.find(o => o.value === hour);
  return option ? (hour === "unknown" ? option.label : `${option.label} (${option.timeRange})`) : hour;
};
const getRelationshipLabel = (status: RelationshipStatus) => {
  const labels: Record<RelationshipStatus, string> = {
    solo: "솔로",
    dating: "연애중",
    married: "기혼",
    divorced: "이혼/사별",
  };
  return labels[status];
};
const getOccupationLabel = (status: OccupationStatus) => {
  const labels: Record<OccupationStatus, string> = {
    student: "학생",
    jobseeker: "취업준비생",
    employee: "직장인",
    business: "사업자",
    freelance: "프리랜서",
    homemaker: "전업주부",
  };
  return labels[status];
};

export function ExpertForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  // 모달 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingSubmitType, setPendingSubmitType] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // 개인 사주 폼 상태
  const [individual, setIndividual] = useState<ExpertPersonData>(defaultExpertPerson);

  // 후기 상태
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [reviewsFetched, setReviewsFetched] = useState(false);

  // 후기 탭 선택 시 데이터 로드
  useEffect(() => {
    if (activeTab === "reviews" && !reviewsFetched) {
      fetchReviews();
    }
  }, [activeTab, reviewsFetched]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch("/api/reviews?limit=1");
      const data = await res.json();
      if (data.stats) {
        setAverageRating(data.stats.averageRating || 0);
        setTotalReviews(data.stats.totalCount || 0);
        setReviewsFetched(true);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  // 커플 궁합 폼 상태 (추후 업데이트 시 사용)
  // const [couple, setCouple] = useState({
  //   person1: { ...defaultPerson },
  //   person2: { ...defaultPerson, gender: "male" as Gender },
  // });
  // const [coupleRelationshipStatus, setCoupleRelationshipStatus] = useState<"married" | "unmarried">("unmarried");

  // 가족 통합 폼 상태 (추후 업데이트 시 사용)
  // const [family, setFamily] = useState<FamilyMemberData[]>([
  //   { ...defaultPerson, relation: "me" },
  // ]);

  // 개인 폼 핸들러
  const handleIndividualChange = (field: string, value: string | boolean) => {
    setIndividual((prev) => ({ ...prev, [field]: value }));
  };

  // 커플 폼 핸들러 (추후 업데이트 시 사용)
  // const handleCoupleChange = (person: "person1" | "person2", field: string, value: string | boolean) => {
  //   setCouple((prev) => ({
  //     ...prev,
  //     [person]: { ...prev[person], [field]: value },
  //   }));
  // };

  // 가족 폼 핸들러 (추후 업데이트 시 사용)
  // const handleFamilyChange = (index: number, field: string, value: string | boolean) => {
  //   setFamily((prev) => {
  //     const newFamily = [...prev];
  //     newFamily[index] = { ...newFamily[index], [field]: value };
  //     return newFamily;
  //   });
  // };
  // const addFamilyMember = () => {
  //   setFamily((prev) => [
  //     ...prev,
  //     { ...defaultPerson, relation: "" },
  //   ]);
  // };
  // const removeFamilyMember = (index: number) => {
  //   if (index === 0) return;
  //   setFamily((prev) => prev.filter((_, i) => i !== index));
  // };

  // 유효성 검증
  const validateForm = (type: string): boolean => {
    if (!email || !email.includes("@")) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return false;
    }

    switch (type) {
      case "individual":
        if (!individual.name || !individual.year || !individual.month || !individual.day) {
          alert("이름과 생년월일을 입력해주세요.");
          return false;
        }
        break;
      // 추후 업데이트 시 활성화
      // case "couple":
      // case "family":
    }
    return true;
  };

  // 확인 모달 열기
  const handleOpenConfirmModal = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    if (!validateForm(type)) return;
    setPendingSubmitType(type);
    setShowConfirmModal(true);
  };

  // 확인 후 결제 모달로 이동
  const handleConfirmInfo = () => {
    setShowConfirmModal(false);
    setShowPaymentModal(true);
  };

  // 계좌번호 복사
  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("계좌번호: " + BANK_ACCOUNT);
    }
  };

  // 최종 제출
  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setShowPaymentModal(false);

    try {
      const apiUrl = "/api/expert/request";
      let requestData;

      switch (pendingSubmitType) {
        case "individual":
          requestData = {
            email,
            person: individual,
            partner: null,
          };
          break;

        // 추후 업데이트 시 활성화
        // case "couple":
        // case "family":

        default:
          return;
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/expert/complete");
      } else {
        alert(`신청 실패: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 정보 요약 렌더링
  const renderInfoSummary = () => {
    switch (pendingSubmitType) {
      case "individual":
        return (
          <div className="space-y-2 text-sm">
            <InfoRow label="이름" value={individual.name} />
            <InfoRow label="성별" value={getGenderLabel(individual.gender)} />
            <InfoRow label="생년월일" value={`${individual.year}년 ${individual.month}월 ${individual.day}일 (${getCalendarLabel(individual.calendarType)})`} />
            <InfoRow label="태어난 시간" value={getHourLabel(individual.hour)} />
            <InfoRow label="관계 상태" value={getRelationshipLabel(individual.relationshipStatus)} />
            <InfoRow label="직업 상태" value={getOccupationLabel(individual.occupationStatus)} />
            <InfoRow label="이메일" value={email} />
          </div>
        );
      // 추후 업데이트 시 활성화
      // case "couple":
      // case "family":
    }
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-[#3d3127]/50">
          <TabsTrigger value="individual" className="font-serif text-xs sm:text-sm text-[#a89880] data-[state=active]:text-[#e8dcc8] data-[state=active]:bg-[#4d4137]">
            개인 사주
          </TabsTrigger>
          <TabsTrigger value="couple" className="font-serif text-xs sm:text-sm text-[#a89880] data-[state=active]:text-[#e8dcc8] data-[state=active]:bg-[#4d4137]">
            연인/부부
          </TabsTrigger>
          <TabsTrigger value="family" className="font-serif text-xs sm:text-sm text-[#a89880] data-[state=active]:text-[#e8dcc8] data-[state=active]:bg-[#4d4137]">
            가족 통합
          </TabsTrigger>
          <TabsTrigger value="reviews" className="font-serif text-xs sm:text-sm text-[#a89880] data-[state=active]:text-[#e8dcc8] data-[state=active]:bg-[#4d4137] flex items-center gap-1">
            <Star className="w-3 h-3" />
            후기
          </TabsTrigger>
        </TabsList>

        {/* 개인 사주 폼 */}
        <TabsContent value="individual">
          <form onSubmit={(e) => handleOpenConfirmModal(e, "individual")} className="space-y-4">
            <PersonForm
              prefix="expert-individual"
              values={individual}
              onChange={handleIndividualChange}
              darkMode
            />

            {/* 추가 정보 */}
            <ExtraInfoFields
              values={individual}
              onChange={handleIndividualChange}
              prefix="individual"
            />

            {/* 이메일 */}
            <div className="space-y-2">
              <Label className={`text-sm ${darkLabelClass}`}>이메일 (PDF 수신용)</Label>
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={darkInputClass}
              />
            </div>

            <SubmitButton isLoading={isLoading} />
          </form>
        </TabsContent>

        {/* 커플 궁합 폼 - 추후 업데이트 예정 */}
        <TabsContent value="couple">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <h3 className="text-lg font-medium text-[#e8dcc8]">연인/부부 궁합 분석</h3>
            <p className="text-[#a89880] text-center text-sm">
              서비스 준비 중입니다.<br />
              빠른 시일 내에 업데이트될 예정입니다.
            </p>
            <div className="px-4 py-2 bg-amber-900/20 rounded-full border border-amber-800/30">
              <span className="text-amber-400 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </TabsContent>

        {/* 가족 통합 폼 - 추후 업데이트 예정 */}
        <TabsContent value="family">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <h3 className="text-lg font-medium text-[#e8dcc8]">가족 통합 분석</h3>
            <p className="text-[#a89880] text-center text-sm">
              서비스 준비 중입니다.<br />
              빠른 시일 내에 업데이트될 예정입니다.
            </p>
            <div className="px-4 py-2 bg-amber-900/20 rounded-full border border-amber-800/30">
              <span className="text-amber-400 text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </TabsContent>

        {/* 후기 탭 */}
        <TabsContent value="reviews">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {reviewsLoading ? (
              <div className="text-center text-[#a89880]">
                후기를 불러오는 중...
              </div>
            ) : (
              <>
                {/* 별점 표시 */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-10 h-10 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-[#4d4137]"}`}
                    />
                  ))}
                </div>

                {/* 평균 점수 */}
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#e8dcc8]">
                    {averageRating.toFixed(1)} / 5.0
                  </p>
                  <p className="text-[#a89880] mt-1">
                    총 {totalReviews}개 후기
                  </p>
                </div>

                {/* 후기 보기 버튼 */}
                <Button
                  className="px-8 bg-[#4d4137] hover:bg-[#5d5147] text-[#e8dcc8]"
                  onClick={() => router.push("/reviews")}
                >
                  후기 보기
                </Button>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 정보 확인 모달 */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-[#2d2319] border-[#3d3127] text-[#e8dcc8] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#e8dcc8]">입력 정보 확인</DialogTitle>
            <DialogDescription className="text-[#a89880]">
              입력하신 정보가 맞는지 확인해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-[#3d3127]/50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
            {renderInfoSummary()}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="bg-transparent border-[#4d4137] text-[#c8bca8] hover:bg-[#3d3127]"
            >
              수정하기
            </Button>
            <Button
              onClick={handleConfirmInfo}
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계좌 안내 모달 */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-[#2d2319] border-[#3d3127] text-[#e8dcc8] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#e8dcc8] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              결제 안내
            </DialogTitle>
            <DialogDescription className="text-[#a89880]">
              아래 계좌로 입금 후 신청을 완료해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 금액 */}
            <div className="bg-amber-900/30 rounded-lg p-4 text-center border border-amber-800/50">
              <p className="text-sm text-amber-400 mb-1">분석 비용</p>
              <p className="text-3xl font-bold text-amber-300">
                {ANALYSIS_PRICE.toLocaleString()}원
              </p>
            </div>

            {/* 계좌 정보 */}
            <div className="bg-[#3d3127]/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#a89880] text-sm">입금 은행</span>
                <span className="text-[#e8dcc8] font-medium">{BANK_NAME}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#a89880] text-sm">계좌번호</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#e8dcc8] font-medium font-mono">{BANK_ACCOUNT}</span>
                  <button
                    type="button"
                    onClick={handleCopyAccount}
                    className="p-1 hover:bg-[#4d4137] rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#a89880]" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#a89880] text-sm">입금자명</span>
                <span className="text-[#e8dcc8] font-medium">
                  {individual.name || "본인"}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#7a6a5a] text-center">
              입금 확인 후 1-2일 내 이메일로 PDF가 발송됩니다.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              className="bg-transparent border-[#4d4137] text-[#c8bca8] hover:bg-[#3d3127]"
            >
              취소
            </Button>
            <Button
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
            >
              {isLoading ? "신청 중..." : "입금 완료, 신청하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// 정보 행 컴포넌트
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#a89880]">{label}</span>
      <span className="text-[#e8dcc8]">{value}</span>
    </div>
  );
}

// 추가 정보 필드 컴포넌트
function ExtraInfoFields({
  values,
  onChange,
  prefix,
}: {
  values: ExpertPersonData;
  onChange: (field: string, value: string | boolean) => void;
  prefix: string;
}) {
  return (
    <div className="space-y-4 pt-2 border-t border-[#4d4137]/50">
      {/* 관계 상태 */}
      <div className="space-y-2">
        <Label className={`text-sm ${darkLabelClass}`}>현재 관계 상태</Label>
        <RadioGroup
          value={values.relationshipStatus}
          onValueChange={(v) => onChange("relationshipStatus", v)}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo" id={`${prefix}-status-solo`} />
            <Label htmlFor={`${prefix}-status-solo`} className={darkRadioLabelClass}>
              솔로
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dating" id={`${prefix}-status-dating`} />
            <Label htmlFor={`${prefix}-status-dating`} className={darkRadioLabelClass}>
              연애중
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="married" id={`${prefix}-status-married`} />
            <Label htmlFor={`${prefix}-status-married`} className={darkRadioLabelClass}>
              기혼
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="divorced" id={`${prefix}-status-divorced`} />
            <Label htmlFor={`${prefix}-status-divorced`} className={darkRadioLabelClass}>
              이혼/사별
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 자녀 유무 */}
      {(values.relationshipStatus === "married" ||
        values.relationshipStatus === "divorced") && (
        <div className="space-y-2">
          <Label className={`text-sm ${darkLabelClass}`}>자녀 유무</Label>
          <RadioGroup
            value={values.hasChildren ? "yes" : "no"}
            onValueChange={(v) => onChange("hasChildren", v === "yes")}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${prefix}-children-yes`} />
              <Label htmlFor={`${prefix}-children-yes`} className={darkRadioLabelClass}>
                있음
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${prefix}-children-no`} />
              <Label htmlFor={`${prefix}-children-no`} className={darkRadioLabelClass}>
                없음
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* 직업 상태 */}
      <div className="space-y-2">
        <Label className={`text-sm ${darkLabelClass}`}>직업 상태</Label>
        <Select
          value={values.occupationStatus}
          onValueChange={(v) => onChange("occupationStatus", v)}
        >
          <SelectTrigger className={darkInputClass}>
            <SelectValue placeholder="직업 상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">학생</SelectItem>
            <SelectItem value="jobseeker">취업준비생</SelectItem>
            <SelectItem value="employee">직장인</SelectItem>
            <SelectItem value="business">사업자</SelectItem>
            <SelectItem value="freelance">프리랜서</SelectItem>
            <SelectItem value="homemaker">전업주부</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-center text-sm text-amber-400">
          분석 비용: {ANALYSIS_PRICE.toLocaleString()}원
        </p>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 font-serif bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
        >
          {isLoading ? (
            "신청 중..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              전문가 분석 신청하기
            </>
          )}
        </Button>
      </div>

      {/* 문의하기 */}
      <div className="pt-3 border-t border-[#4d4137]/50">
        <div className="flex items-center justify-center gap-2 text-[#a89880]">
          <Mail className="w-3.5 h-3.5" />
          <span className="text-xs">문의:</span>
          <a
            href="mailto:coldcow11@gmail.com"
            className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
          >
            coldcow11@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
