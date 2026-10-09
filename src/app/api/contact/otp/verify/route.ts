import { NextResponse } from "next/server";
import { OTP_LENGTH, digitsOnly, isIndianMobile } from "@/lib/contact";
import { verifyOtp } from "@/lib/contact-otp";

export async function POST(request: Request) {
  let phone = "";
  let otp = "";
  let token = "";
  try {
    const body = (await request.json()) as { phone?: unknown; otp?: unknown; token?: unknown };
    phone = typeof body.phone === "string" ? digitsOnly(body.phone) : "";
    otp = typeof body.otp === "string" ? digitsOnly(body.otp) : "";
    token = typeof body.token === "string" ? body.token : "";
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!isIndianMobile(phone) || otp.length !== OTP_LENGTH || !token) {
    return NextResponse.json({ ok: false, error: `Enter the ${OTP_LENGTH}-digit code we sent you.` }, { status: 400 });
  }

  try {
    const result = verifyOtp(phone, otp, token);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch (error) {
    console.error("[contact-otp] verify failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, error: "Verification is unavailable right now." }, { status: 500 });
  }
}
