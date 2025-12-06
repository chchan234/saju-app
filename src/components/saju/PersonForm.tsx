"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BIRTH_HOUR_OPTIONS, YEAR_RANGE } from "@/lib/constants";
import { BirthHour, CalendarType, Gender, RelationshipStatus, OccupationStatus } from "@/types/saju";

interface PersonFormProps {
  prefix: string;
  title?: string;
  showRelation?: boolean;
  relationValue?: string;
  onRelationChange?: (value: string) => void;
  relationDisabled?: boolean;
  // 전문가 모드 필드 표시 여부
  showExpertFields?: boolean;
  // 다크 모드 여부
  darkMode?: boolean;
  values: {
    name: string;
    gender: Gender;
    year: string;
    month: string;
    day: string;
    hour: BirthHour;
    calendarType: CalendarType;
    isLeapMonth: boolean;
    // 전문가 모드 전용 필드
    relationshipStatus?: RelationshipStatus;
    hasChildren?: boolean;
    occupationStatus?: OccupationStatus;
  };
  onChange: (field: string, value: string | boolean) => void;
}

export function PersonForm({
  prefix,
  title,
  showRelation,
  relationValue,
  onRelationChange,
  relationDisabled,
  showExpertFields = false,
  darkMode = false,
  values,
  onChange,
}: PersonFormProps) {
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  // 다크 모드 스타일 (커스텀 브라운)
  const containerClass = darkMode
    ? "space-y-4 rounded-xl bg-[#3d3127]/30 p-4 border border-[#4d4137]/50"
    : "space-y-4 rounded-xl bg-white/40 p-4 border border-white/50";
  const titleClass = darkMode
    ? "font-serif text-lg text-[#e8dcc8] border-b border-dashed border-[#4d4137] pb-2"
    : "font-serif text-lg text-primary border-b border-dashed border-secondary pb-2";
  const labelClass = darkMode ? "text-[#c8bca8]" : "";
  const inputClass = darkMode
    ? "bg-[#3d3127]/50 border-[#4d4137] text-[#e8dcc8] placeholder:text-[#7a6a5a] focus:border-[#5d5147] focus:ring-[#5d5147]"
    : "";
  const radioLabelClass = darkMode ? "font-normal cursor-pointer text-[#c8bca8]" : "font-normal cursor-pointer";
  const mutedClass = darkMode ? "text-[#a89880]" : "text-muted-foreground";

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange("year", value);
    // 4자리 입력 시 월 필드로 자동 이동
    if (value.length === 4) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange("month", value);
    // 2자리 입력 시 일 필드로 자동 이동
    if (value.length === 2) {
      dayRef.current?.focus();
    }
  };

  return (
    <div className={containerClass}>
      {title && (
        <h3 className={titleClass}>
          {title}
        </h3>
      )}

      {showRelation && (
        <div className="space-y-2">
          <Label className={labelClass}>관계</Label>
          <Select
            value={relationValue}
            onValueChange={onRelationChange}
            disabled={relationDisabled}
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder="관계 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">본인</SelectItem>
              <SelectItem value="spouse">배우자</SelectItem>
              <SelectItem value="parent">부모</SelectItem>
              <SelectItem value="grandparent">조부모</SelectItem>
              <SelectItem value="sibling">형제/자매</SelectItem>
              <SelectItem value="child">자녀</SelectItem>
              <SelectItem value="relative">친척</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`${prefix}-name`} className={labelClass}>이름</Label>
        <Input
          id={`${prefix}-name`}
          placeholder="이름을 입력하세요"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>성별</Label>
        <RadioGroup
          value={values.gender}
          onValueChange={(v) => onChange("gender", v)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id={`${prefix}-female`} />
            <Label htmlFor={`${prefix}-female`} className={radioLabelClass}>
              여성
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id={`${prefix}-male`} />
            <Label htmlFor={`${prefix}-male`} className={radioLabelClass}>
              남성
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>생년월일</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            placeholder="YYYY"
            min={YEAR_RANGE.min}
            max={YEAR_RANGE.max}
            value={values.year}
            onChange={handleYearChange}
            className={`text-center ${inputClass}`}
            maxLength={4}
          />
          <Input
            ref={monthRef}
            type="number"
            placeholder="MM"
            min={1}
            max={12}
            value={values.month}
            onChange={handleMonthChange}
            className={`text-center ${inputClass}`}
            maxLength={2}
          />
          <Input
            ref={dayRef}
            type="number"
            placeholder="DD"
            min={1}
            max={31}
            value={values.day}
            onChange={(e) => onChange("day", e.target.value)}
            className={`text-center ${inputClass}`}
            maxLength={2}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>태어난 시간</Label>
        <Select
          value={values.hour}
          onValueChange={(v) => onChange("hour", v)}
        >
          <SelectTrigger className={inputClass}>
            <SelectValue placeholder="시간 선택" />
          </SelectTrigger>
          <SelectContent>
            {BIRTH_HOUR_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value === "unknown"
                  ? option.label
                  : `${option.label} (${option.timeRange})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className={labelClass}>양력/음력</Label>
        <RadioGroup
          value={values.calendarType}
          onValueChange={(v) => onChange("calendarType", v)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solar" id={`${prefix}-solar`} />
            <Label htmlFor={`${prefix}-solar`} className={radioLabelClass}>
              양력
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lunar" id={`${prefix}-lunar`} />
            <Label htmlFor={`${prefix}-lunar`} className={radioLabelClass}>
              음력
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* 음력 선택 시 윤달 체크박스 표시 */}
      {values.calendarType === "lunar" && (
        <div className="flex items-center space-x-2 pl-1">
          <Checkbox
            id={`${prefix}-leap`}
            checked={values.isLeapMonth}
            onCheckedChange={(checked) => onChange("isLeapMonth", checked === true)}
          />
          <Label
            htmlFor={`${prefix}-leap`}
            className={`font-normal cursor-pointer text-sm ${mutedClass}`}
          >
            윤달
          </Label>
        </div>
      )}

      {/* 전문가 모드 전용 필드 */}
      {showExpertFields && (
        <>
          {/* 관계 상태 */}
          <div className={`space-y-2 pt-4 border-t border-dashed ${darkMode ? "border-[#4d4137]/50" : "border-secondary/50"}`}>
            <Label className={darkMode ? "text-[#e8dcc8] font-medium" : "text-primary font-medium"}>현재 관계 상태</Label>
            <RadioGroup
              value={values.relationshipStatus || "solo"}
              onValueChange={(v) => onChange("relationshipStatus", v)}
              className="grid grid-cols-2 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solo" id={`${prefix}-solo`} />
                <Label htmlFor={`${prefix}-solo`} className={`font-normal cursor-pointer text-sm ${darkMode ? "text-[#c8bca8]" : ""}`}>
                  솔로 (연애 안함)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dating" id={`${prefix}-dating`} />
                <Label htmlFor={`${prefix}-dating`} className={`font-normal cursor-pointer text-sm ${darkMode ? "text-[#c8bca8]" : ""}`}>
                  연애중
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="married" id={`${prefix}-married`} />
                <Label htmlFor={`${prefix}-married`} className={`font-normal cursor-pointer text-sm ${darkMode ? "text-[#c8bca8]" : ""}`}>
                  기혼
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="divorced" id={`${prefix}-divorced`} />
                <Label htmlFor={`${prefix}-divorced`} className={`font-normal cursor-pointer text-sm ${darkMode ? "text-[#c8bca8]" : ""}`}>
                  이혼/사별
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 자녀 유무 (기혼/이혼사별 시만 표시) */}
          {(values.relationshipStatus === "married" || values.relationshipStatus === "divorced") && (
            <div className="space-y-2">
              <Label className={labelClass}>자녀 유무</Label>
              <RadioGroup
                value={values.hasChildren ? "yes" : "no"}
                onValueChange={(v) => onChange("hasChildren", v === "yes")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${prefix}-hasChildren-yes`} />
                  <Label htmlFor={`${prefix}-hasChildren-yes`} className={radioLabelClass}>
                    있음
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${prefix}-hasChildren-no`} />
                  <Label htmlFor={`${prefix}-hasChildren-no`} className={radioLabelClass}>
                    없음
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* 직업 상태 */}
          <div className="space-y-2">
            <Label className={labelClass}>직업 상태 (선택)</Label>
            <Select
              value={values.occupationStatus || ""}
              onValueChange={(v) => onChange("occupationStatus", v)}
            >
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder="직업 상태 선택 (선택사항)" />
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
            <p className={`text-xs ${mutedClass}`}>
              직업 상태에 따른 맞춤형 직업운/학업운 분석을 받으실 수 있습니다.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
