import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  let browser = null;

  try {
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "요청 ID가 필요합니다." },
        { status: 400 }
      );
    }

    console.log("PDF 생성 시작:", requestId);

    // Puppeteer 브라우저 실행
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
      ],
    });

    const page = await browser.newPage();

    // 뷰포트 설정 (A4 비율) - deviceScaleFactor를 1로 낮춰 파일 크기 최적화
    await page.setViewport({
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123, // A4 height in pixels at 96 DPI
      deviceScaleFactor: 1, // 이메일 첨부 크기 제한(40MB) 대응
    });

    // 결과 페이지 URL 구성 (PDF 모드)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/admin/result/${requestId}?mode=pdf`;

    console.log("PDF 생성 URL:", url);

    // 쿠키 설정 (관리자 인증 우회)
    await page.setCookie({
      name: "admin_pdf_mode",
      value: "true",
      domain: new URL(baseUrl).hostname,
    });

    // 페이지 로드
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // 콘텐츠 로딩 대기
    try {
      await page.waitForSelector(".pdf-content", { timeout: 30000 });
    } catch {
      // pdf-content가 없으면 pdfContentRef 대기
      await page.waitForSelector("[data-pdf-content]", { timeout: 30000 });
    }

    // 추가 대기 (이미지, 폰트 등 렌더링)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // PDF 생성
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      preferCSSPageSize: true,
    });

    await browser.close();
    browser = null;

    console.log("PDF 생성 완료, 크기:", pdfBuffer.length);

    // Base64로 인코딩하여 반환
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    return NextResponse.json({
      success: true,
      pdfBase64,
      size: pdfBuffer.length,
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error);

    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      {
        success: false,
        message: `PDF 생성 실패: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 }
    );
  }
}
