import { NextResponse } from "next/server";
import { digitsOnly, isIndianMobile, isValidEmail } from "@/lib/contact";
import {
  checkSendLimits,
  clientIp,
  createOtp,
  emailSubject,
  recordSend,
  sendOtpEmail,
  sendOtpSms,
} from "@/lib/contact-otp";

export async function POST(request: Request) {
  let phone = "";
  let email = "";
  let name = "";
  let enquiry = "";
  let message = "";
  let number = ""
  try {
    const body = (await request.json()) as { phone?: unknown; email?: unknown, userName?: string, enquiry_for?: string, message?: string, number?: string };
    phone = typeof body.phone === "string" ? digitsOnly(body.phone) : "";
    email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
    name = body.userName ? body.userName : "";
    enquiry = body.enquiry_for ? body.enquiry_for : "";
    message = body.message ? body.message : "";
    number = body.number ? body.number : ""

  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const byEmail = Boolean(email);
  if (byEmail ? !isValidEmail(email) : !isIndianMobile(phone)) {
    return NextResponse.json(
      { ok: false, error: byEmail ? "Enter a valid email address." : "Enter a valid 10-digit Indian mobile number." },
      { status: 400 },
    );
  }

  const subject = byEmail ? emailSubject(email) : phone;
  const ip = clientIp(request);
  const limit = checkSendLimits(subject, ip);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: limit.error, retryIn: limit.retryIn }, { status: 429 });
  }

  try {
    const { otp, token } = createOtp(subject);

    if (byEmail) await sendOtpEmail(email, otp, name, enquiry, message, number);
    else await sendOtpSms(phone, otp);
    recordSend(subject, ip);
    return NextResponse.json({ ok: true, token });
  } catch (error) {
    console.error("[contact-otp] send failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { ok: false, error: "We couldn't send the OTP right now. Please try again or call us." },
      { status: 502 },
    );
  }
}
