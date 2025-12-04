import { describe, it, expect } from "vitest";
import { getTimeIndex } from "./saju-calculator";

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
