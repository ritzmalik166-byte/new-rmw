import { NextResponse } from "next/server";

type AuditBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  subject?: string;
  message?: string;
  website?: string;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: AuditBody;

  try {
    body = (await request.json()) as AuditBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const phone = asString(body.phone);
  const service = asString(body.service);
  const subject = asString(body.subject);
  const message = asString(body.message);
  const website = asString(body.website);

  if (!name || !email || !phone || !service || !subject) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  // Honeypot filled in: a bot. Pretend it worked so it doesn't retry.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  console.info("[audit] new enquiry", { name, email, phone, service, subject, message: message.slice(0, 280) });

  return NextResponse.json({ ok: true });
}
