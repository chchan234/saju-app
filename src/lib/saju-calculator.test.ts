import { describe, it, expect } from "vitest";
import {
  getTimeIndex,
  getFortuneYear,
  calculateYearlyFortunes,
} from "./saju-calculator";

describe("getTimeIndex - 시진 경계값 테스트", () => {
  // 자시: 23:30-01:29
  describe("자시 (23:30 ~ 01:29)", () => {
    it("23:30은 자시(0)여야 함", () => {
      expect(getTimeIndex(23, 30)).toBe(0);
    });

    it("23:59은 자시(0)여야 함", () => {
      expect(getTimeIndex(23, 59)).toBe(0);
    });

    it("00:00은 자시(0)여야 함", () => {
      expect(getTimeIndex(0, 0)).toBe(0);
    });

    it("01:00은 자시(0)여야 함 (이전에는 축시로 잘못 분류됨)", () => {
      expect(getTimeIndex(1, 0)).toBe(0);
    });

    it("01:29은 자시(0)여야 함", () => {
      expect(getTimeIndex(1, 29)).toBe(0);
    });
  });

  // 축시: 01:30-03:29
  describe("축시 (01:30 ~ 03:29)", () => {
    it("01:30은 축시(1)여야 함", () => {
      expect(getTimeIndex(1, 30)).toBe(1);
    });

    it("02:00은 축시(1)여야 함", () => {
      expect(getTimeIndex(2, 0)).toBe(1);
    });

    it("03:29은 축시(1)여야 함", () => {
      expect(getTimeIndex(3, 29)).toBe(1);
    });
  });

  // 인시: 03:30-05:29
  describe("인시 (03:30 ~ 05:29)", () => {
    it("03:30은 인시(2)여야 함", () => {
      expect(getTimeIndex(3, 30)).toBe(2);
    });

    it("05:29은 인시(2)여야 함", () => {
      expect(getTimeIndex(5, 29)).toBe(2);
    });
  });

  // 묘시: 05:30-07:29
  describe("묘시 (05:30 ~ 07:29)", () => {
    it("05:30은 묘시(3)여야 함", () => {
      expect(getTimeIndex(5, 30)).toBe(3);
    });

    it("07:29은 묘시(3)여야 함", () => {
      expect(getTimeIndex(7, 29)).toBe(3);
    });
  });

  // 진시: 07:30-09:29
  describe("진시 (07:30 ~ 09:29)", () => {
    it("07:30은 진시(4)여야 함", () => {
      expect(getTimeIndex(7, 30)).toBe(4);
    });

    it("09:29은 진시(4)여야 함", () => {
      expect(getTimeIndex(9, 29)).toBe(4);
    });
  });

  // 사시: 09:30-11:29
  describe("사시 (09:30 ~ 11:29)", () => {
    it("09:30은 사시(5)여야 함", () => {
      expect(getTimeIndex(9, 30)).toBe(5);
    });

    it("11:29은 사시(5)여야 함", () => {
      expect(getTimeIndex(11, 29)).toBe(5);
    });
  });

  // 오시: 11:30-13:29
  describe("오시 (11:30 ~ 13:29)", () => {
    it("11:30은 오시(6)여야 함", () => {
      expect(getTimeIndex(11, 30)).toBe(6);
    });

    it("12:00은 오시(6)여야 함", () => {
      expect(getTimeIndex(12, 0)).toBe(6);
    });

    it("13:29은 오시(6)여야 함", () => {
      expect(getTimeIndex(13, 29)).toBe(6);
    });
  });

  // 미시: 13:30-15:29
  describe("미시 (13:30 ~ 15:29)", () => {
    it("13:30은 미시(7)여야 함", () => {
      expect(getTimeIndex(13, 30)).toBe(7);
    });

    it("15:29은 미시(7)여야 함", () => {
      expect(getTimeIndex(15, 29)).toBe(7);
    });
  });

  // 신시: 15:30-17:29
  describe("신시 (15:30 ~ 17:29)", () => {
    it("15:30은 신시(8)여야 함", () => {
      expect(getTimeIndex(15, 30)).toBe(8);
    });

    it("17:29은 신시(8)여야 함", () => {
      expect(getTimeIndex(17, 29)).toBe(8);
    });
  });

  // 유시: 17:30-19:29
  describe("유시 (17:30 ~ 19:29)", () => {
    it("17:30은 유시(9)여야 함", () => {
      expect(getTimeIndex(17, 30)).toBe(9);
    });

    it("19:29은 유시(9)여야 함", () => {
      expect(getTimeIndex(19, 29)).toBe(9);
    });
  });

  // 술시: 19:30-21:29
  describe("술시 (19:30 ~ 21:29)", () => {
    it("19:30은 술시(10)여야 함", () => {
      expect(getTimeIndex(19, 30)).toBe(10);
    });

    it("21:29은 술시(10)여야 함", () => {
      expect(getTimeIndex(21, 29)).toBe(10);
    });
  });

  // 해시: 21:30-23:29
  describe("해시 (21:30 ~ 23:29)", () => {
    it("21:30은 해시(11)여야 함", () => {
      expect(getTimeIndex(21, 30)).toBe(11);
    });

    it("23:00은 해시(11)여야 함", () => {
      expect(getTimeIndex(23, 0)).toBe(11);
    });

    it("23:29은 해시(11)여야 함", () => {
      expect(getTimeIndex(23, 29)).toBe(11);
    });
  });

  // 자시 경계 직전 (해시의 끝)
  describe("자시/해시 경계", () => {
    it("23:29은 해시(11)여야 함", () => {
      expect(getTimeIndex(23, 29)).toBe(11);
    });

    it("23:30은 자시(0)여야 함", () => {
      expect(getTimeIndex(23, 30)).toBe(0);
    });
  });
});

describe("getFortuneYear - 입춘 기준 연도 테스트", () => {
  describe("1월은 항상 전년도", () => {
    it("2025년 1월 1일 → 2024년", () => {
      expect(getFortuneYear(new Date(2025, 0, 1))).toBe(2024);
    });

    it("2025년 1월 31일 → 2024년", () => {
      expect(getFortuneYear(new Date(2025, 0, 31))).toBe(2024);
    });
  });

  describe("2월 입춘 전은 전년도", () => {
    it("2025년 2월 1일 → 2024년", () => {
      expect(getFortuneYear(new Date(2025, 1, 1))).toBe(2024);
    });

    it("2025년 2월 3일 → 2024년", () => {
      expect(getFortuneYear(new Date(2025, 1, 3))).toBe(2024);
    });
  });

  describe("2월 입춘일(4일) 이후는 당해년도", () => {
    it("2025년 2월 4일 → 2025년", () => {
      expect(getFortuneYear(new Date(2025, 1, 4))).toBe(2025);
    });

    it("2025년 2월 28일 → 2025년", () => {
      expect(getFortuneYear(new Date(2025, 1, 28))).toBe(2025);
    });
  });

  describe("3월 이후는 당해년도", () => {
    it("2025년 3월 1일 → 2025년", () => {
      expect(getFortuneYear(new Date(2025, 2, 1))).toBe(2025);
    });

    it("2025년 12월 31일 → 2025년", () => {
      expect(getFortuneYear(new Date(2025, 11, 31))).toBe(2025);
    });
  });

  describe("커스텀 입춘일 지원", () => {
    it("입춘일 5일 기준: 2월 4일 → 2024년", () => {
      expect(getFortuneYear(new Date(2025, 1, 4), 5)).toBe(2024);
    });

    it("입춘일 5일 기준: 2월 5일 → 2025년", () => {
      expect(getFortuneYear(new Date(2025, 1, 5), 5)).toBe(2025);
    });
  });
});

describe("calculateYearlyFortunes - 연운 계산 테스트", () => {
  // 갑(甲) 일간, 용신 목(木) 기준 테스트
  const ilgan = "갑";
  const yongsin = "목";

  describe("연운 범위 계산", () => {
    it("2024~2029년 연운 계산 시 6개의 결과 반환", () => {
      const result = calculateYearlyFortunes(2024, 2029, ilgan, yongsin);
      expect(result).toHaveLength(6);
    });

    it("각 연운에 year, ganji, cheongan, jiji 포함", () => {
      const result = calculateYearlyFortunes(2024, 2024, ilgan, yongsin);
      expect(result[0]).toHaveProperty("year", 2024);
      expect(result[0]).toHaveProperty("ganji");
      expect(result[0]).toHaveProperty("cheongan");
      expect(result[0]).toHaveProperty("jiji");
    });
  });

  describe("2024년 갑진년 검증", () => {
    it("2024년은 갑진년", () => {
      const result = calculateYearlyFortunes(2024, 2024, ilgan, yongsin);
      expect(result[0].ganji).toBe("갑진");
      expect(result[0].cheongan).toBe("갑");
      expect(result[0].jiji).toBe("진");
    });
  });

  describe("2025년 을사년 검증", () => {
    it("2025년은 을사년", () => {
      const result = calculateYearlyFortunes(2025, 2025, ilgan, yongsin);
      expect(result[0].ganji).toBe("을사");
      expect(result[0].cheongan).toBe("을");
      expect(result[0].jiji).toBe("사");
    });
  });

  describe("연운 용신 해당 여부", () => {
    it("isYongsinYear 프로퍼티 존재", () => {
      const result = calculateYearlyFortunes(2024, 2024, ilgan, yongsin);
      expect(result[0]).toHaveProperty("isYongsinYear");
    });

    it("갑(목) 일간에 목 용신 → 2024년(갑진) 용신년 체크", () => {
      const result = calculateYearlyFortunes(2024, 2024, ilgan, "목");
      // 갑은 목 오행이므로 용신년에 해당
      expect(result[0].isYongsinYear).toBe(true);
    });
  });
});
