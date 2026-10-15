import { NextResponse } from "next/server";
import { digitsOnly, isIndianMobile } from "@/lib/contact";
import { checkSendLimits, clientIp, createOtp, recordSend, sendOtpSms } from "@/lib/contact-otp";

export async function POST(request: Request) {
  let phone = "";
  try {
    const body = (await request.json()) as { phone?: unknown };
    phone = typeof body.phone === "string" ? digitsOnly(body.phone) : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isIndianMobile(phone)) {
    return NextResponse.json({ ok: false, error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
  }

  const ip = clientIp(request);
  const limit = checkSendLimits(phone, ip);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: limit.error, retryIn: limit.retryIn }, { status: 429 });
  }

  try {
    const { otp, token } = createOtp(phone);
    await sendOtpSms(phone, otp);
    recordSend(phone, ip);
    return NextResponse.json({ ok: true, token });
  } catch (error) {
    console.error("[contact-otp] send failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send the OTP right now. Please try again or call us." },
      { status: 502 },
    );
  }
}
