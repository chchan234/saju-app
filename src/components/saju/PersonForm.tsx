"use client";

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
import { BIRTH_HOUR_OPTIONS, YEAR_RANGE } from "@/lib/constants";
import { BirthHour, CalendarType, Gender } from "@/types/saju";

interface PersonFormProps {
  prefix: string;
  title?: string;
  showRelation?: boolean;
  relationValue?: string;
  onRelationChange?: (value: string) => void;
  relationDisabled?: boolean;
  values: {
    name: string;
    gender: Gender;
    year: string;
    month: string;
    day: string;
    hour: BirthHour;
    calendarType: CalendarType;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonForm({
  prefix,
  title,
  showRelation,
  relationValue,
  onRelationChange,
  relationDisabled,
  values,
  onChange,
}: PersonFormProps) {
  return (
    <div className="space-y-4 rounded-xl bg-white/40 p-4 border border-white/50">
      {title && (
        <h3 className="font-serif text-lg text-primary border-b border-dashed border-secondary pb-2">
          {title}
        </h3>
      )}

      {showRelation && (
        <div className="space-y-2">
          <Label>관계</Label>
          <Select
            value={relationValue}
            onValueChange={onRelationChange}
            disabled={relationDisabled}
          >
            <SelectTrigger>
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
        <Label htmlFor={`${prefix}-name`}>이름</Label>
        <Input
          id={`${prefix}-name`}
          placeholder="이름을 입력하세요"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>성별</Label>
        <RadioGroup
          value={values.gender}
          onValueChange={(v) => onChange("gender", v)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id={`${prefix}-female`} />
            <Label htmlFor={`${prefix}-female`} className="font-normal cursor-pointer">
              여성
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id={`${prefix}-male`} />
            <Label htmlFor={`${prefix}-male`} className="font-normal cursor-pointer">
              남성
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>생년월일</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            placeholder="YYYY"
            min={YEAR_RANGE.min}
            max={YEAR_RANGE.max}
            value={values.year}
            onChange={(e) => onChange("year", e.target.value)}
            className="text-center"
          />
          <Input
            type="number"
            placeholder="MM"
            min={1}
            max={12}
            value={values.month}
            onChange={(e) => onChange("month", e.target.value)}
            className="text-center"
          />
          <Input
            type="number"
            placeholder="DD"
            min={1}
            max={31}
            value={values.day}
            onChange={(e) => onChange("day", e.target.value)}
            className="text-center"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>태어난 시간</Label>
        <Select
          value={values.hour}
          onValueChange={(v) => onChange("hour", v)}
        >
          <SelectTrigger>
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
        <Label>양력/음력</Label>
        <RadioGroup
          value={values.calendarType}
          onValueChange={(v) => onChange("calendarType", v)}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solar" id={`${prefix}-solar`} />
            <Label htmlFor={`${prefix}-solar`} className="font-normal cursor-pointer">
              양력
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lunar" id={`${prefix}-lunar`} />
            <Label htmlFor={`${prefix}-lunar`} className="font-normal cursor-pointer">
              음력
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
