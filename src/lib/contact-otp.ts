import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { OTP_LENGTH, OTP_RESEND_SECONDS } from "@/lib/contact";

const OTP_TTL_MS = 10 * 60 * 1000;
const VERIFIED_TTL_MS = 30 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_SENDS_PER_PHONE_PER_HOUR = 5;
const MAX_SENDS_PER_IP_PER_HOUR = 15;

const DEFAULT_TEMPLATE =
  "{otp} is your OTP to verify your enquiry with Ritz Media World. It is valid for 10 minutes. Do not share it with anyone.";

type OtpPayload = { kind: "otp"; phone: string; exp: number; hash: string };
type VerifiedPayload = { kind: "verified"; phone: string; exp: number };

function secret() {
  const value = process.env.OTP_SECRET;
  if (!value || value.length < 16) throw new Error("OTP_SECRET is not configured.");
  return value;
}

function hmac(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function sign(payload: OtpPayload | VerifiedPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

function unsign<T extends OtpPayload | VerifiedPayload>(token: string, kind: T["kind"]): T | null {
  const [body, signature] = token.split(".");
  if (!body || !signature || !safeEqual(signature, hmac(body))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
    if (payload.kind !== kind || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/* Best-effort in-memory limits; they reset when the server restarts. */
const sendLog = new Map<string, number[]>();
const verifyAttempts = new Map<string, number>();

function recentHits(key: string, windowMs: number) {
  const now = Date.now();
  const hits = (sendLog.get(key) ?? []).filter((time) => now - time < windowMs);
  sendLog.set(key, hits);
  return hits;
}

export type SendCheck = { ok: true } | { ok: false; error: string; retryIn?: number };

export function checkSendLimits(phone: string, ip: string): SendCheck {
  const phoneHits = recentHits(`phone:${phone}`, 60 * 60 * 1000);
  const ipHits = recentHits(`ip:${ip}`, 60 * 60 * 1000);
  const last = phoneHits.at(-1);
  if (last && Date.now() - last < OTP_RESEND_SECONDS * 1000) {
    const retryIn = Math.ceil((OTP_RESEND_SECONDS * 1000 - (Date.now() - last)) / 1000);
    return { ok: false, error: `Please wait ${retryIn}s before requesting another OTP.`, retryIn };
  }
  if (phoneHits.length >= MAX_SENDS_PER_PHONE_PER_HOUR || ipHits.length >= MAX_SENDS_PER_IP_PER_HOUR) {
    return { ok: false, error: "Too many OTP requests. Please try again in an hour, or call us directly." };
  }
  return { ok: true };
}

export function recordSend(phone: string, ip: string) {
  const now = Date.now();
  for (const key of [`phone:${phone}`, `ip:${ip}`]) {
    sendLog.set(key, [...(sendLog.get(key) ?? []), now]);
  }
  if (verifyAttempts.size > 5000) verifyAttempts.clear();
}

export function createOtp(phone: string) {
  const otp = String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
  const exp = Date.now() + OTP_TTL_MS;
  const token = sign({ kind: "otp", phone, exp, hash: hmac(`${phone}:${otp}:${exp}`) });
  return { otp, token };
}

export type VerifyResult = { ok: true; verifiedToken: string } | { ok: false; error: string };

export function verifyOtp(phone: string, otp: string, token: string): VerifyResult {
  const payload = unsign<OtpPayload>(token, "otp");
  if (!payload || payload.phone !== phone) {
    return { ok: false, error: "This OTP has expired. Please request a new one." };
  }

  const attempts = (verifyAttempts.get(token) ?? 0) + 1;
  verifyAttempts.set(token, attempts);
  if (attempts > MAX_VERIFY_ATTEMPTS) {
    return { ok: false, error: "Too many wrong attempts. Please request a new OTP." };
  }

  if (!safeEqual(payload.hash, hmac(`${phone}:${otp}:${payload.exp}`))) {
    const left = MAX_VERIFY_ATTEMPTS - attempts;
    return { ok: false, error: left > 0 ? `That code is not right. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many wrong attempts. Please request a new OTP." };
  }

  verifyAttempts.delete(token);
  return { ok: true, verifiedToken: sign({ kind: "verified", phone, exp: Date.now() + VERIFIED_TTL_MS }) };
}

export function isPhoneVerified(phone: string, verifiedToken: string) {
  const payload = unsign<VerifiedPayload>(verifiedToken, "verified");
  return Boolean(payload && payload.phone === phone);
}

export async function sendOtpSms(phone: string, otp: string) {
  const url = process.env.SMS_API_URL;
  const apikey = process.env.SMS_API_KEY;
  const senderid = process.env.SMS_SENDER_ID;
  if (!url || !apikey || !senderid) throw new Error("SMS gateway is not configured.");

  const template = process.env.SMS_OTP_TEMPLATE || DEFAULT_TEMPLATE;
  const params = new URLSearchParams({
    apikey,
    senderid,
    number: phone,
    message: template.replace("{otp}", otp),
  });
  if (process.env.SMS_TEMPLATE_ID) params.set("templateid", process.env.SMS_TEMPLATE_ID);

  const response = await fetch(`${url}?${params}`, { cache: "no-store", signal: AbortSignal.timeout(12000) });
  const text = await response.text();
  let status = "";
  try {
    status = String((JSON.parse(text) as { status?: unknown }).status ?? "").toLowerCase();
  } catch {
    status = response.ok ? "unknown" : "false";
  }
  if (!response.ok || status === "false" || status === "error") {
    console.error("[contact-otp] SMS gateway rejected the request", { status: response.status, body: text.slice(0, 200) });
    throw new Error("SMS gateway rejected the request.");
  }
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}
