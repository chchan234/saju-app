import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

interface PdfGeneratorOptions {
  element: HTMLElement;
  filename?: string;
  margin?: number;
}

/**
 * 폰트 로딩 완료 대기
 */
async function waitForFonts(): Promise<void> {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  // 추가 대기 시간 (렌더링 안정화)
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * Gradient 클래스에서 시작/종료 색상 추출
 */
function getGradientFallbackColor(className: string): string {
  // Tailwind gradient 클래스에서 색상 추출 시도
  const fromMatch = className.match(/from-\[([^\]]+)\]/);
  const toMatch = className.match(/to-\[([^\]]+)\]/);

  if (fromMatch) return fromMatch[1];
  if (toMatch) return toMatch[1];

  // 기본 fallback
  return "#f5f0e8";
}

/**
 * HTML 요소를 PDF로 변환하여 Blob 반환
 * A4 크기: 210mm x 297mm
 * 자연스러운 페이지 브레이크 적용
 */
export async function generatePdfFromElement(
  options: PdfGeneratorOptions
): Promise<Blob> {
  const { element, margin = 10 } = options;

  // 폰트 로딩 대기
  await waitForFonts();

  // A4 크기 설정 (mm)
  const a4Width = 210;
  const a4Height = 297;
  const contentWidth = a4Width - margin * 2;
  const contentHeight = a4Height - margin * 2;

  // PDF 문서 생성
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // HTML 요소를 캔버스로 변환 (html2canvas-pro는 oklch, lab 등 지원)
  const canvas = await html2canvas(element, {
    scale: 2, // 고해상도
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#f5f0e8",
    logging: true, // 디버깅용으로 활성화
    removeContainer: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    ignoreElements: (el) => {
      // print:hidden 클래스가 있는 요소 무시
      return el.classList?.contains("print:hidden") || false;
    },
    onclone: (clonedDoc, clonedElement) => {
      // 클론된 문서 전체에 기본 배경색 적용
      clonedDoc.body.style.backgroundColor = "#f5f0e8";

      // 클론된 요소에 명시적 배경색 적용
      clonedElement.style.backgroundColor = "#f5f0e8";
      clonedElement.style.color = "#333333";

      // 모든 요소에 대해 gradient를 solid color로 변환
      const allElements = clonedElement.querySelectorAll("*");
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          const className = el.className || "";

          // gradient 클래스가 있는 요소 처리
          if (typeof className === 'string' && className.includes("gradient")) {
            const fallbackColor = getGradientFallbackColor(className);
            el.style.background = fallbackColor;
            el.style.backgroundImage = "none";
          }

          // bg- 클래스가 있지만 배경이 없는 요소에 명시적 색상 적용
          if (typeof className === 'string' && className.includes("bg-")) {
            const computed = window.getComputedStyle(el);
            if (computed.backgroundColor === "rgba(0, 0, 0, 0)" ||
                computed.backgroundColor === "transparent") {
              // Tailwind 색상 추출 시도
              const bgMatch = className.match(/bg-\[([^\]]+)\]/);
              if (bgMatch) {
                el.style.backgroundColor = bgMatch[1];
              }
            }
          }

          // PDF 페이지 클래스가 있는 요소에 명시적 배경
          if (typeof className === 'string' && className.includes("pdf-page")) {
            el.style.backgroundColor = "#faf8f5";
          }
        }
      });

      // 특정 배경색 클래스들에 대한 명시적 처리
      const bgElements = clonedElement.querySelectorAll(
        '.bg-\\[\\#f5f0e8\\], .bg-\\[\\#faf8f5\\], .bg-\\[\\#f0ebe3\\]'
      );
      bgElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          const className = el.className || "";
          if (className.includes("bg-[#f5f0e8]")) {
            el.style.backgroundColor = "#f5f0e8";
          } else if (className.includes("bg-[#faf8f5]")) {
            el.style.backgroundColor = "#faf8f5";
          } else if (className.includes("bg-[#f0ebe3]")) {
            el.style.backgroundColor = "#f0ebe3";
          }
        }
      });
    },
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);

  // 이미지 비율 계산
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // 필요한 페이지 수 계산
  const totalPages = Math.ceil(imgHeight / contentHeight);

  // 페이지별로 이미지 분할
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      pdf.addPage();
    }

    // 현재 페이지에 맞는 영역 추출
    const sourceY = page * contentHeight * (canvas.width / contentWidth);
    const sourceHeight = Math.min(
      contentHeight * (canvas.width / contentWidth),
      canvas.height - sourceY
    );

    // 캔버스에서 현재 페이지 영역 추출
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sourceHeight;
    const ctx = pageCanvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        sourceHeight,
        0,
        0,
        canvas.width,
        sourceHeight
      );

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;

      pdf.addImage(pageImgData, "JPEG", margin, margin, imgWidth, pageImgHeight);
    }
  }

  // Blob으로 반환
  return pdf.output("blob");
}

/**
 * PDF Blob을 Base64 문자열로 변환
 */
export async function pdfBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // data:application/pdf;base64, 부분 제거
      const base64Data = base64.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * PDF 다운로드
 */
export function downloadPdf(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * PDF 새 창에서 열기 (미리보기)
 */
export function openPdfInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
