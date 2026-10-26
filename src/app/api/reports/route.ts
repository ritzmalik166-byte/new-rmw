import { NextResponse } from "next/server";
import { CASE_STUDY_REPORTS } from "@/lib/case-studies";
import { digitsOnly, isIndianMobile, isValidEmail, isValidName } from "@/lib/contact";
import { isVerified } from "@/lib/contact-otp";
import { ENQUIRY_URL, postRemote, remoteMessage } from "@/lib/enquiry";
import { REPORT_FILES } from "@/lib/report-files";

type Body = Record<string, unknown>;

function field(body: Body, key: string, max = 120) {
  const value = body[key];
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const reportId = field(body, "reportId", 40);
  const report = CASE_STUDY_REPORTS.find((item) => item.id === reportId);
  const file = REPORT_FILES[reportId];
  if (!report || !file) {
    return NextResponse.json({ ok: false, error: "That report is not available." }, { status: 404 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (field(body, "website")) return NextResponse.json({ ok: true });

  const name = field(body, "name", 60);
  const email = field(body, "email", 160);
  const phone = digitsOnly(field(body, "phone", 20));

  const errors: Record<string, string> = {};
  if (!isValidName(name)) errors.name = "Enter your name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isIndianMobile(phone)) errors.phone = "Enter a 10-digit mobile number.";
  else if (!isVerified(phone, field(body, "verifiedToken", 600))) errors.phone = "Verify this number with the OTP.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  const submitted = await postRemote(
    ENQUIRY_URL,
    {
      etype: "ContactUs",
      name,
      phone,
      email,
      message: `Report download: ${report.title} (${report.period})`,
    },
    "reports",
  );
  if (!submitted.ok) {
    console.error("[reports] contact-enquiry failed", submitted.status, submitted.body);
    return NextResponse.json(
      { ok: false, error: remoteMessage(submitted.body) || "We couldn't process your request. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, file });
}
