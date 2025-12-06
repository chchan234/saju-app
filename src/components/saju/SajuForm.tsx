"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonForm } from "./PersonForm";
import { BirthHour, CalendarType, Gender } from "@/types/saju";
import { Star } from "lucide-react";

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

export function SajuForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("individual");
  const [isLoading, setIsLoading] = useState(false);

  // 개인 사주 폼 상태
  const [individual, setIndividual] = useState<PersonData>(defaultPerson);

  // 커플 궁합 폼 상태
  const [couple, setCouple] = useState({
    person1: { ...defaultPerson },
    person2: { ...defaultPerson, gender: "female" as Gender },
  });

  // 가족 통합 폼 상태
  const [family, setFamily] = useState<FamilyMemberData[]>([
    { ...defaultPerson, relation: "me" },
  ]);

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

  // 개인 폼 핸들러
  const handleIndividualChange = (field: string, value: string | boolean) => {
    setIndividual((prev) => ({ ...prev, [field]: value }));
  };

  // 커플 폼 핸들러
  const handleCoupleChange = (person: "person1" | "person2", field: string, value: string | boolean) => {
    setCouple((prev) => ({
      ...prev,
      [person]: { ...prev[person], [field]: value },
    }));
  };

  // 가족 폼 핸들러
  const handleFamilyChange = (index: number, field: string, value: string | boolean) => {
    setFamily((prev) => {
      const newFamily = [...prev];
      newFamily[index] = { ...newFamily[index], [field]: value };
      return newFamily;
    });
  };

  // 가족 구성원 추가
  const addFamilyMember = () => {
    setFamily((prev) => [
      ...prev,
      { ...defaultPerson, relation: "" },
    ]);
  };

  // 가족 구성원 삭제
  const removeFamilyMember = (index: number) => {
    if (index === 0) return; // 본인은 삭제 불가
    setFamily((prev) => prev.filter((_, i) => i !== index));
  };

  // 시진을 시간으로 변환 (정시 기준: 각 시진은 해당 시각의 30분부터 시작)
  const parseHourToTime = (birthHour: BirthHour): { hour: number; minute: number } => {
    // 정시(正時) 기준 - getTimeIndex와 일치하도록 각 시진의 시작 시간 사용
    // 자시: 23:30-01:29, 축시: 01:30-03:29, 인시: 03:30-05:29 ...
    const hourMinuteMap: Record<BirthHour, { hour: number; minute: number }> = {
      "unknown": { hour: 12, minute: 0 },  // 기본값: 정오
      "23": { hour: 23, minute: 30 },      // 자시 (23:30~01:29) - 야자시
      "01": { hour: 0, minute: 30 },       // 자시 (00:30~01:29) - 조자시
      "03": { hour: 1, minute: 30 },       // 축시 (01:30~03:29)
      "05": { hour: 3, minute: 30 },       // 인시 (03:30~05:29)
      "07": { hour: 5, minute: 30 },       // 묘시 (05:30~07:29)
      "09": { hour: 7, minute: 30 },       // 진시 (07:30~09:29)
      "11": { hour: 9, minute: 30 },       // 사시 (09:30~11:29)
      "13": { hour: 11, minute: 30 },      // 오시 (11:30~13:29)
      "15": { hour: 13, minute: 30 },      // 미시 (13:30~15:29)
      "17": { hour: 15, minute: 30 },      // 신시 (15:30~17:29)
      "19": { hour: 17, minute: 30 },      // 유시 (17:30~19:29)
      "21": { hour: 19, minute: 30 },      // 술시 (19:30~21:29)
      "23-2": { hour: 21, minute: 30 },    // 해시 (21:30~23:29)
    };
    return hourMinuteMap[birthHour] ?? { hour: 12, minute: 0 };
  };

  // 개인 사주 결과 페이지로 이동
  const navigateToResult = (person: PersonData) => {
    const isTimeUnknown = person.hour === "unknown";
    const time = parseHourToTime(person.hour);
    const isLunar = person.calendarType === "lunar";
    const data = {
      year: person.year,
      month: person.month,
      day: person.day,
      hour: time.hour.toString(),
      minute: time.minute.toString(),
      lunar: isLunar,
      leap: isLunar && person.isLeapMonth,
      name: person.name,
      gender: person.gender,
      timeUnknown: isTimeUnknown,
    };
    sessionStorage.setItem("saju_individual", JSON.stringify(data));
    router.push("/result");
  };

  // 커플 궁합 결과 페이지로 이동
  const navigateToCoupleResult = (person1: PersonData, person2: PersonData) => {
    const p1TimeUnknown = person1.hour === "unknown";
    const p2TimeUnknown = person2.hour === "unknown";
    const time1 = parseHourToTime(person1.hour);
    const time2 = parseHourToTime(person2.hour);
    const p1IsLunar = person1.calendarType === "lunar";
    const p2IsLunar = person2.calendarType === "lunar";

    const data = {
      person1: {
        year: person1.year,
        month: person1.month,
        day: person1.day,
        hour: time1.hour.toString(),
        minute: time1.minute.toString(),
        lunar: p1IsLunar,
        leap: p1IsLunar && person1.isLeapMonth,
        name: person1.name || "나",
        gender: person1.gender,
        timeUnknown: p1TimeUnknown,
      },
      person2: {
        year: person2.year,
        month: person2.month,
        day: person2.day,
        hour: time2.hour.toString(),
        minute: time2.minute.toString(),
        lunar: p2IsLunar,
        leap: p2IsLunar && person2.isLeapMonth,
        name: person2.name || "상대방",
        gender: person2.gender,
        timeUnknown: p2TimeUnknown,
      },
    };
    sessionStorage.setItem("saju_couple", JSON.stringify(data));
    router.push("/result/couple");
  };

  // 가족 통합 결과 페이지로 이동
  const navigateToFamilyResult = (members: FamilyMemberData[]) => {
    const data = members.map((member, index) => {
      const timeUnknown = member.hour === "unknown";
      const time = parseHourToTime(member.hour);
      const isLunar = member.calendarType === "lunar";
      return {
        year: member.year,
        month: member.month,
        day: member.day,
        hour: time.hour.toString(),
        minute: time.minute.toString(),
        lunar: isLunar,
        leap: isLunar && member.isLeapMonth,
        name: member.name || `구성원 ${index + 1}`,
        gender: member.gender,
        relation: member.relation || "other",
        timeUnknown,
      };
    });
    sessionStorage.setItem("saju_family", JSON.stringify(data));
    router.push("/result/family");
  };

  // 시크릿 어드민 진입 체크
  const checkSecretAdminAccess = (member: FamilyMemberData): boolean => {
    return (
      member.name.toLowerCase() === "admin" &&
      member.gender === "male" &&
      member.calendarType === "lunar" &&
      member.isLeapMonth === true &&
      !member.year &&
      !member.month &&
      !member.day
    );
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      switch (type) {
        case "individual":
          // 입력값 검증
          if (!individual.year || !individual.month || !individual.day) {
            alert("생년월일을 입력해주세요.");
            return;
          }
          navigateToResult(individual);
          break;

        case "couple":
          if (!couple.person1.year || !couple.person1.month || !couple.person1.day) {
            alert("본인의 생년월일을 입력해주세요.");
            return;
          }
          if (!couple.person2.year || !couple.person2.month || !couple.person2.day) {
            alert("상대방의 생년월일을 입력해주세요.");
            return;
          }
          navigateToCoupleResult(couple.person1, couple.person2);
          break;

        case "family":
          // 시크릿 어드민 진입 체크 (첫 번째 구성원만 체크)
          if (family.length === 1 && checkSecretAdminAccess(family[0])) {
            router.push("/admin/verify");
            return;
          }

          // 최소 2명 이상의 구성원 필요
          if (family.length < 2) {
            alert("가족 분석을 위해 최소 2명의 구성원이 필요합니다.");
            return;
          }
          // 각 구성원 검증
          for (let i = 0; i < family.length; i++) {
            const member = family[i];
            if (!member.year || !member.month || !member.day) {
              alert(`${member.name || `${i + 1}번째 구성원`}의 생년월일을 입력해주세요.`);
              return;
            }
          }
          navigateToFamilyResult(family);
          break;

        default:
          return;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="individual" className="font-serif text-xs sm:text-sm">
          개인 사주
        </TabsTrigger>
        <TabsTrigger value="couple" className="font-serif text-xs sm:text-sm">
          연인/부부
        </TabsTrigger>
        <TabsTrigger value="family" className="font-serif text-xs sm:text-sm">
          가족 통합
        </TabsTrigger>
        <TabsTrigger value="reviews" className="font-serif text-xs sm:text-sm flex items-center gap-1">
          <Star className="w-3 h-3" />
          후기
        </TabsTrigger>
      </TabsList>

      {/* 개인 사주 폼 */}
      <TabsContent value="individual">
        <form onSubmit={(e) => handleSubmit(e, "individual")} className="space-y-6">
          <PersonForm
            prefix="individual"
            values={individual}
            onChange={handleIndividualChange}
          />
          <SubmitButton isLoading={isLoading} text="내 운명 확인하기" />
        </form>
      </TabsContent>

      {/* 커플 궁합 폼 */}
      <TabsContent value="couple">
        <form onSubmit={(e) => handleSubmit(e, "couple")} className="space-y-6">
          <PersonForm
            prefix="couple-1"
            title="나의 정보"
            values={couple.person1}
            onChange={(field, value) => handleCoupleChange("person1", field, value)}
          />

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xl text-accent">&amp;</span>
            </div>
          </div>

          <PersonForm
            prefix="couple-2"
            title="상대방 정보"
            values={couple.person2}
            onChange={(field, value) => handleCoupleChange("person2", field, value)}
          />

          <SubmitButton isLoading={isLoading} text="궁합 확인하기" />
        </form>
      </TabsContent>

      {/* 가족 통합 폼 */}
      <TabsContent value="family">
        <form onSubmit={(e) => handleSubmit(e, "family")} className="space-y-6">
          {family.map((member, index) => (
            <div key={index} className="relative">
              <PersonForm
                prefix={`family-${index}`}
                title={index === 0 ? "가족 구성원 1 (본인)" : `가족 구성원 ${index + 1}`}
                showRelation
                relationValue={member.relation}
                onRelationChange={(value) => handleFamilyChange(index, "relation", value)}
                relationDisabled={index === 0}
                values={member}
                onChange={(field, value) => handleFamilyChange(index, field, value)}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeFamilyMember(index)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                >
                  X
                </button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addFamilyMember}
            className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
          >
            + 가족 구성원 추가
          </Button>

          <SubmitButton isLoading={isLoading} text="가족 운세 확인하기" />
        </form>
      </TabsContent>

      {/* 후기 탭 */}
      <TabsContent value="reviews">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {reviewsLoading ? (
            <div className="text-center text-muted-foreground">
              후기를 불러오는 중...
            </div>
          ) : (
            <>
              {/* 별점 표시 */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-10 h-10 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>

              {/* 평균 점수 */}
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">
                  {averageRating.toFixed(1)} / 5.0
                </p>
                <p className="text-muted-foreground mt-1">
                  총 {totalReviews}개 후기
                </p>
              </div>

              {/* 후기 보기 버튼 */}
              <Button
                className="px-8"
                onClick={() => router.push("/reviews")}
              >
                후기 보기
              </Button>
            </>
          )}
        </div>
      </TabsContent>

    </Tabs>
  );
}

function SubmitButton({ isLoading, text }: { isLoading: boolean; text: string }) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity relative overflow-hidden group"
    >
      <span className="relative z-10">
        {isLoading ? "운명을 읽는 중..." : text}
      </span>
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </Button>
  );
}
