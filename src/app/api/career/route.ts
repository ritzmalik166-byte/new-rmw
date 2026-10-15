import { NextResponse } from "next/server";
import { CAREER_UPLOAD_URL, isCareerRole, resumeError } from "@/lib/career";
import { digitsOnly, isIndianMobile, isValidEmail, isValidName } from "@/lib/contact";
import { isPhoneVerified } from "@/lib/contact-otp";
import { ENQUIRY_URL, postRemote, remoteMessage } from "@/lib/enquiry";

function text(form: FormData, key: string, max = 120) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (text(form, "website")) return NextResponse.json({ ok: true });

  const name = text(form, "name", 60);
  const email = text(form, "email", 160);
  const phone = digitsOnly(text(form, "phone", 20));
  const role = text(form, "role");
  const message = text(form, "message", 2000);
  const verifiedToken = text(form, "verifiedToken", 600);
  const resumeEntry = form.get("resume");
  const resume = resumeEntry instanceof File ? resumeEntry : null;

  const errors: Record<string, string> = {};
  if (!isValidName(name)) errors.name = "Enter your full name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!isIndianMobile(phone)) errors.phone = "Enter a 10-digit mobile number.";
  if (!isCareerRole(role)) errors.role = "Choose the role you're applying for.";
  const fileError = resumeError(resume);
  if (fileError) errors.resume = fileError;
  if (message.length < 10) errors.message = "Tell us a little about yourself (at least 10 characters).";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  if (!isPhoneVerified(phone, verifiedToken)) {
    return NextResponse.json(
      { ok: false, error: "Please verify your mobile number with the OTP first.", errors: { phone: "Verify this number." } },
      { status: 400 },
    );
  }

  const upload = new FormData();
  upload.append("resume", resume as File, (resume as File).name);
  const uploaded = await postRemote(CAREER_UPLOAD_URL, upload, "career");
  const filePath = typeof uploaded.body?.filePath === "string" ? uploaded.body.filePath : "";
  if (!uploaded.ok || !filePath) {
    console.error("[career] upload-resume failed", uploaded.status, uploaded.body);
    return NextResponse.json(
      { ok: false, error: remoteMessage(uploaded.body) || "We couldn't upload your resume. Please try again." },
      { status: 502 },
    );
  }

  const enquiry = new FormData();
  enquiry.append("name", name);
  enquiry.append("email", email);
  enquiry.append("phone", phone);
  enquiry.append("category", role);
  enquiry.append("message", message);
  enquiry.append("resumePath", filePath);
  enquiry.append("etype", "career");
  const submitted = await postRemote(ENQUIRY_URL, enquiry, "career");
  if (!submitted.ok) {
    console.error("[career] contact-enquiry failed", submitted.status, submitted.body);
    return NextResponse.json(
      { ok: false, error: remoteMessage(submitted.body) || "We couldn't submit your application. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
