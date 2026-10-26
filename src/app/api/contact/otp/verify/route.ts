import { NextResponse } from "next/server";
import { OTP_LENGTH, digitsOnly, isIndianMobile, isValidEmail } from "@/lib/contact";
import { emailSubject, verifyOtp } from "@/lib/contact-otp";

export async function POST(request: Request) {
  let phone = "";
  let email = "";
  let otp = "";
  let token = "";
  try {
    const body = (await request.json()) as { phone?: unknown; email?: unknown; otp?: unknown; token?: unknown };
    phone = typeof body.phone === "string" ? digitsOnly(body.phone) : "";
    email = typeof body.email === "string" ? body.email.trim().slice(0, 160) : "";
    otp = typeof body.otp === "string" ? digitsOnly(body.otp) : "";
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const validSubject = email ? isValidEmail(email) : isIndianMobile(phone);
  if (!validSubject || otp.length !== OTP_LENGTH || !token) {
    return NextResponse.json({ ok: false, error: `Enter the ${OTP_LENGTH}-digit code we sent you.` }, { status: 400 });
  }

  try {
    const result = verifyOtp(email ? emailSubject(email) : phone, otp, token);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("[contact-otp] verify failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Verification is unavailable right now." }, { status: 500 });
  }
}
