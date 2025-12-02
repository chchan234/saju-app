import { createClient } from "@supabase/supabase-js";
import { ManseryeokRecord } from "@/types/saju";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드용 클라이언트 (service role key 사용)
export const createServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// 양력 날짜로 만세력 데이터 조회
export async function getManseryeokBySolarDate(
  year: number,
  month: number,
  day: number
): Promise<ManseryeokRecord | null> {
  const { data, error } = await supabase
    .from("calenda_data")
    .select("*")
    .eq("cd_sy", year)
    .eq("cd_sm", month)
    .eq("cd_sd", day)
    .single();

  if (error) {
    console.error("Error fetching manseryeok data:", error);
    return null;
  }

  return data as ManseryeokRecord;
}

// 음력 날짜로 만세력 데이터 조회
export async function getManseryeokByLunarDate(
  year: number,
  month: number,
  day: number,
  isLeapMonth: boolean = false
): Promise<ManseryeokRecord | null> {
  const { data, error } = await supabase
    .from("calenda_data")
    .select("*")
    .eq("cd_ly", year)
    .eq("cd_lm", month)
    .eq("cd_ld", day)
    .eq("cd_leap_month", isLeapMonth ? 1 : 0)
    .single();

  if (error) {
    console.error("Error fetching manseryeok data:", error);
    return null;
  }

  return data as ManseryeokRecord;
}

// 양력 날짜 범위로 만세력 데이터 조회
export async function getManseryeokRange(
  startYear: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number
): Promise<ManseryeokRecord[]> {
  // 시작/종료 날짜를 숫자로 변환 (YYYYMMDD)
  const startNum = startYear * 10000 + startMonth * 100 + startDay;
  const endNum = endYear * 10000 + endMonth * 100 + endDay;

  const { data, error } = await supabase
    .from("calenda_data")
    .select("*")
    .gte("cd_sy", startYear)
    .lte("cd_sy", endYear)
    .order("cd_sy", { ascending: true })
    .order("cd_sm", { ascending: true })
    .order("cd_sd", { ascending: true });

  if (error) {
    console.error("Error fetching manseryeok range:", error);
    return [];
  }

  // 정확한 날짜 범위 필터링
  return (data as ManseryeokRecord[]).filter((record) => {
    const recordNum =
      record.cd_sy * 10000 + Number(record.cd_sm) * 100 + Number(record.cd_sd);
    return recordNum >= startNum && recordNum <= endNum;
  });
}

// 특정 년도의 입춘 날짜 조회
export async function getIpchunDate(year: number): Promise<ManseryeokRecord | null> {
  const { data, error } = await supabase
    .from("calenda_data")
    .select("*")
    .eq("cd_sy", year)
    .eq("cd_kterms", "입춘")
    .single();

  if (error) {
    console.error("Error fetching ipchun date:", error);
    return null;
  }

  return data as ManseryeokRecord;
}

// 특정 년월의 절기 날짜 조회 (월주 계산용)
export async function getJeolgiForMonth(
  year: number,
  month: number
): Promise<ManseryeokRecord | null> {
  // 각 월의 절기 (절입일 기준)
  const jeolgiByMonth: Record<number, string> = {
    1: "소한",
    2: "입춘",
    3: "경칩",
    4: "청명",
    5: "입하",
    6: "망종",
    7: "소서",
    8: "입추",
    9: "백로",
    10: "한로",
    11: "입동",
    12: "대설",
  };

  const targetJeolgi = jeolgiByMonth[month];

  const { data, error } = await supabase
    .from("calenda_data")
    .select("*")
    .eq("cd_sy", year)
    .eq("cd_kterms", targetJeolgi)
    .single();

  if (error) {
    // 12월 대설의 경우 전년도 확인
    if (month === 12) {
      const prevYearData = await supabase
        .from("calenda_data")
        .select("*")
        .eq("cd_sy", year - 1)
        .eq("cd_kterms", targetJeolgi)
        .single();

      if (prevYearData.data) {
        return prevYearData.data as ManseryeokRecord;
      }
    }
    console.error("Error fetching jeolgi date:", error);
    return null;
  }

  return data as ManseryeokRecord;
}
