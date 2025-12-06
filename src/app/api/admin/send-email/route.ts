import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { Resend } from "resend";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// 런타임에만 초기화 (빌드 시점 에러 방지)
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// PDF 크기 제한 (25MB - Resend 권장 제한)
const MAX_PDF_SIZE_MB = 25;
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authResult = await verifyAdminRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // 레이트 리밋 체크 (이메일 발송 비용 및 스팸 방지)
    const rateLimitResult = checkRateLimit(
      request,
      RATE_LIMITS.EMAIL_SEND,
      "admin-send-email"
    );
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          message: `이메일 발송 요청 한도를 초과했습니다. ${retryAfter}초 후에 다시 시도해주세요.`,
        },
        { status: 429 }
      );
    }

    const { requestId, pdfBase64 } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "요청 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // PDF 크기 확인
    const pdfSizeBytes = pdfBase64 ? Buffer.from(pdfBase64, "base64").length : 0;
    const pdfSizeMB = pdfSizeBytes / (1024 * 1024);
    const isPdfTooLarge = pdfSizeBytes > MAX_PDF_SIZE_BYTES;

    console.log(`PDF 크기: ${pdfSizeMB.toFixed(2)}MB, 제한 초과: ${isPdfTooLarge}`);

    const supabase = createServerClient();

    // 신청 정보 조회
    const { data: requestData, error: fetchError } = await supabase
      .from("expert_mode_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !requestData) {
      return NextResponse.json(
        { success: false, message: "신청 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 분석 결과가 없는 경우
    if (!requestData.analysis_result) {
      return NextResponse.json(
        { success: false, message: "분석 결과가 없습니다." },
        { status: 400 }
      );
    }

    // 웹 링크 생성 (전문가 모드 공개 결과 페이지)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const viewUrl = `${baseUrl}/expert/result/${requestId}`;

    // 이메일 발송 (PDF 크기에 따라 첨부 여부 결정)
    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: "정통사주 <noreply@saju-studio.com>",
      to: [requestData.email],
      subject: `[정통사주] ${requestData.name}님의 전문가 분석 리포트가 도착했습니다`,
      html: isPdfTooLarge
        ? `
        <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b7355 0%, #6b5344 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #fff; font-size: 24px; margin: 0;">정통사주 전문가 분석</h1>
            <p style="color: rgba(255,255,255,0.8); margin-top: 10px;">Expert Saju Analysis</p>
          </div>

          <div style="background: #f5f0e8; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #8b7355; font-size: 18px; margin-bottom: 15px;">
              안녕하세요, ${requestData.name}님 🙏
            </h2>
            <p style="color: #5a5a5a; line-height: 1.8;">
              요청하신 전문가 사주 분석 리포트가 완성되었습니다.
              <br /><br />
              리포트 파일이 용량이 커서 아래 버튼을 클릭하시면 웹에서 확인하고 PDF를 다운로드하실 수 있습니다.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${viewUrl}" style="display: inline-block; background: #8b7355; color: #fff; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                분석 리포트 확인하기 →
              </a>
            </div>

            <p style="color: #888; font-size: 12px; text-align: center;">
              위 버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br />
              <a href="${viewUrl}" style="color: #8b7355;">${viewUrl}</a>
            </p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #856404; font-size: 13px; margin: 0;">
              📌 본 리포트에는 다음 내용이 포함되어 있습니다:
            </p>
            <ul style="color: #856404; font-size: 13px; line-height: 1.8; padding-left: 20px; margin-bottom: 0;">
              <li>사주 명식 분석</li>
              <li>오행 및 십신 분석</li>
              <li>성격과 기질 분석</li>
              <li>건강, 재물, 직업운</li>
              <li>대운과 세운 분석</li>
              <li>그 외 다양한 인생 영역별 분석</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px; background: #fff; border-radius: 10px; border: 1px solid #e0d5c5;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              본 메일은 정통사주 전문가 모드 서비스에서 발송되었습니다.
              <br />
              문의사항이 있으시면 회신해 주세요.
            </p>
          </div>
        </div>
      `
        : `
        <div style="font-family: 'Noto Sans KR', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b7355 0%, #6b5344 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #fff; font-size: 24px; margin: 0;">정통사주 전문가 분석</h1>
            <p style="color: rgba(255,255,255,0.8); margin-top: 10px;">Expert Saju Analysis</p>
          </div>

          <div style="background: #f5f0e8; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #8b7355; font-size: 18px; margin-bottom: 15px;">
              안녕하세요, ${requestData.name}님 🙏
            </h2>
            <p style="color: #5a5a5a; line-height: 1.8;">
              요청하신 전문가 사주 분석 리포트가 완성되었습니다.
              <br /><br />
              첨부된 PDF 파일에서 상세한 분석 내용을 확인하실 수 있습니다.
              본 리포트에는 다음 내용이 포함되어 있습니다:
            </p>
            <ul style="color: #5a5a5a; line-height: 2; padding-left: 20px;">
              <li>사주 명식 분석</li>
              <li>오행 분석</li>
              <li>십신 분석</li>
              <li>성격과 기질 분석</li>
              <li>건강 운세</li>
              <li>대운과 세운 분석</li>
              <li>그 외 다양한 인생 영역별 분석</li>
            </ul>
          </div>

          <div style="text-align: center; padding: 20px; background: #fff; border-radius: 10px; border: 1px solid #e0d5c5;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              본 메일은 정통사주 전문가 모드 서비스에서 발송되었습니다.
              <br />
              문의사항이 있으시면 회신해 주세요.
            </p>
          </div>
        </div>
      `,
    };

    // PDF가 작으면 첨부
    if (!isPdfTooLarge && pdfBase64) {
      emailOptions.attachments = [
        {
          filename: `${requestData.name}_사주분석_리포트.pdf`,
          content: pdfBase64,
        },
      ];
    }

    const resend = getResend();
    const { data: emailResult, error: emailError } = await resend.emails.send(emailOptions);

    if (emailError) {
      console.error("Email send error:", emailError);
      return NextResponse.json(
        { success: false, message: `이메일 발송 실패: ${emailError.message}` },
        { status: 500 }
      );
    }

    // 이메일 발송 상태 업데이트
    const { error: updateError } = await supabase
      .from("expert_mode_requests")
      .update({
        email_status: "sent",
        email_sent_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (updateError) {
      console.error("Error updating email status:", updateError);
    }

    return NextResponse.json({
      success: true,
      message: isPdfTooLarge
        ? "이메일이 발송되었습니다. (PDF 용량이 커서 웹 링크로 대체)"
        : "이메일이 성공적으로 발송되었습니다.",
      emailId: emailResult?.id,
      pdfAttached: !isPdfTooLarge,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
