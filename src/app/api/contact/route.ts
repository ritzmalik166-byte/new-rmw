import { NextResponse } from "next/server";
import {
  COUNTRIES,
  DIAL_CODES,
  HEARD_FROM,
  INQUIRY_REASONS,
  OTP_DIAL_CODE,
  digitsOnly,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "@/lib/contact";
import { isPhoneVerified } from "@/lib/contact-otp";
import { ENQUIRY_URL, postRemote, remoteMessage } from "@/lib/enquiry";

type ContactBody = Record<string, unknown>;

function field(body: ContactBody, key: string, max = 120) {
  const value = body[key];
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (field(body, "website")) return NextResponse.json({ ok: true });

  const firstName = field(body, "firstName", 60);
  const lastName = field(body, "lastName", 60);
  const email = field(body, "email", 160);
  const dial = field(body, "dial", 6);
  const phone = digitsOnly(field(body, "phone", 20));
  const reason = field(body, "reason");
  const country = field(body, "country");
  const heardFrom = field(body, "heardFrom");
  const message = field(body, "message", 2000);
  const verifiedToken = field(body, "verifiedToken", 600);

  const errors: Record<string, string> = {};
  if (!isValidName(firstName)) errors.firstName = "Enter your first name.";
  if (!isValidName(lastName)) errors.lastName = "Enter your last name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  if (!DIAL_CODES.includes(dial as (typeof DIAL_CODES)[number]) || !isValidPhone(dial, phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!INQUIRY_REASONS.includes(reason as (typeof INQUIRY_REASONS)[number])) errors.reason = "Choose a reason.";
  if (!COUNTRIES.some((item) => item.name === country)) errors.country = "Choose your country.";
  if (heardFrom && !HEARD_FROM.includes(heardFrom as (typeof HEARD_FROM)[number])) errors.heardFrom = "Choose an option.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 400 });
  }

  const needsOtp = dial === OTP_DIAL_CODE;
  if (needsOtp && !isPhoneVerified(phone, verifiedToken)) {
    return NextResponse.json(
      { ok: false, error: "Please verify your mobile number with the OTP first.", errors: { phone: "Verify this number." } },
      { status: 400 },
    );
  }

  const submitted = await postRemote(
    ENQUIRY_URL,
    {
      etype: "ContactUs",
      name: `${firstName} ${lastName}`,
      phone,
      email,
      message: [
        `Reason for Inquiry: ${reason}`,
        `Country: ${country}`,
        `How did you hear about us: ${heardFrom || "N/A"}`,
        "",
        `Message: ${message || "N/A"}`,
      ].join("\n"),
    },
    "contact",
  );
  if (!submitted.ok) {
    console.error("[contact] contact-enquiry failed", submitted.status, submitted.body);
    return NextResponse.json(
      { ok: false, error: remoteMessage(submitted.body) || "We couldn't send your enquiry. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
