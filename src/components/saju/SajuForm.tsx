"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonForm } from "./PersonForm";
import { BirthHour, CalendarType, Gender } from "@/types/saju";

interface PersonData {
  name: string;
  gender: Gender;
  year: string;
  month: string;
  day: string;
  hour: BirthHour;
  calendarType: CalendarType;
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
    person2: { ...defaultPerson, gender: "male" as Gender },
  });

  // 가족 통합 폼 상태
  const [family, setFamily] = useState<FamilyMemberData[]>([
    { ...defaultPerson, relation: "me" },
  ]);

  // 개인 폼 핸들러
  const handleIndividualChange = (field: string, value: string) => {
    setIndividual((prev) => ({ ...prev, [field]: value }));
  };

  // 커플 폼 핸들러
  const handleCoupleChange = (person: "person1" | "person2", field: string, value: string) => {
    setCouple((prev) => ({
      ...prev,
      [person]: { ...prev[person], [field]: value },
    }));
  };

  // 가족 폼 핸들러
  const handleFamilyChange = (index: number, field: string, value: string) => {
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

  // 시진을 시간으로 변환
  const parseHourToTime = (birthHour: BirthHour): { hour: number; minute: number } => {
    const hourMap: Record<BirthHour, number> = {
      "unknown": 12, // 기본값: 정오
      "23": 23, "01": 0,  // 자시
      "03": 2,            // 축시
      "05": 4,            // 인시
      "07": 6,            // 묘시
      "09": 8,            // 진시
      "11": 10,           // 사시
      "13": 12,           // 오시
      "15": 14,           // 미시
      "17": 16,           // 신시
      "19": 18,           // 유시
      "21": 20,           // 술시
      "23-2": 22,         // 해시
    };
    return { hour: hourMap[birthHour] ?? 12, minute: 0 };
  };

  // 개인 사주 결과 페이지로 이동
  const navigateToResult = (person: PersonData) => {
    const isTimeUnknown = person.hour === "unknown";
    const time = parseHourToTime(person.hour);
    const params = new URLSearchParams({
      year: person.year,
      month: person.month,
      day: person.day,
      hour: time.hour.toString(),
      minute: time.minute.toString(),
      lunar: (person.calendarType === "lunar").toString(),
      name: person.name,
      ...(isTimeUnknown && { timeUnknown: "true" }),
    });
    router.push(`/result?${params.toString()}`);
  };

  // 커플 궁합 결과 페이지로 이동
  const navigateToCoupleResult = (person1: PersonData, person2: PersonData) => {
    const p1TimeUnknown = person1.hour === "unknown";
    const p2TimeUnknown = person2.hour === "unknown";
    const time1 = parseHourToTime(person1.hour);
    const time2 = parseHourToTime(person2.hour);

    const params = new URLSearchParams({
      // Person 1
      p1_year: person1.year,
      p1_month: person1.month,
      p1_day: person1.day,
      p1_hour: time1.hour.toString(),
      p1_minute: time1.minute.toString(),
      p1_lunar: (person1.calendarType === "lunar").toString(),
      p1_name: person1.name || "나",
      ...(p1TimeUnknown && { p1_timeUnknown: "true" }),
      // Person 2
      p2_year: person2.year,
      p2_month: person2.month,
      p2_day: person2.day,
      p2_hour: time2.hour.toString(),
      p2_minute: time2.minute.toString(),
      p2_lunar: (person2.calendarType === "lunar").toString(),
      p2_name: person2.name || "상대방",
      ...(p2TimeUnknown && { p2_timeUnknown: "true" }),
    });
    router.push(`/result/couple?${params.toString()}`);
  };

  // 가족 통합 결과 페이지로 이동
  const navigateToFamilyResult = (members: FamilyMemberData[]) => {
    const params = new URLSearchParams({
      count: members.length.toString(),
    });

    members.forEach((member, index) => {
      const timeUnknown = member.hour === "unknown";
      const time = parseHourToTime(member.hour);

      params.append(`m${index}_year`, member.year);
      params.append(`m${index}_month`, member.month);
      params.append(`m${index}_day`, member.day);
      params.append(`m${index}_hour`, time.hour.toString());
      params.append(`m${index}_minute`, time.minute.toString());
      params.append(`m${index}_lunar`, (member.calendarType === "lunar").toString());
      params.append(`m${index}_name`, member.name || `구성원 ${index + 1}`);
      params.append(`m${index}_relation`, member.relation || "other");
      if (timeUnknown) {
        params.append(`m${index}_timeUnknown`, "true");
      }
    });

    router.push(`/result/family?${params.toString()}`);
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
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="individual" className="font-serif">
          개인 사주
        </TabsTrigger>
        <TabsTrigger value="couple" className="font-serif">
          연인/부부
        </TabsTrigger>
        <TabsTrigger value="family" className="font-serif">
          가족 통합
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
