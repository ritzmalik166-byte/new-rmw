"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ContactSelect } from "@/components/contact/ContactSelect";
import { CAREER_ROLES, RESUME_ACCEPT, formatBytes, resumeError } from "@/lib/career";
import { cn } from "@/lib/cn";
import {
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  digitsOnly,
  isIndianMobile,
  isValidEmail,
  isValidName,
} from "@/lib/contact";

type Values = {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  website: string;
};

type Field = keyof Values | "resume";
type Errors = Partial<Record<Field, string>>;
type OtpStage = "idle" | "sending" | "sent" | "verifying" | "verified";

const INITIAL: Values = { name: "", email: "", phone: "", role: "", message: "", website: "" };

function validate(values: Values, resume: File | null): Errors {
  const errors: Errors = {};
  if (!isValidName(values.name.trim())) errors.name = "Enter your full name.";
  if (!isValidEmail(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!isIndianMobile(values.phone)) errors.phone = "Enter a 10-digit mobile number.";
  if (!values.role) errors.role = "Choose the role you're applying for.";
  const fileError = resumeError(resume);
  if (fileError) errors.resume = fileError;
  if (values.message.trim().length < 10) errors.message = "Tell us a little about yourself (at least 10 characters).";
  return errors;
}

async function post<T>(url: string, body: BodyInit, json = true): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: json ? { "Content-Type": "application/json" } : undefined,
    body,
  });
  return (await response.json().catch(() => ({ ok: false, error: "Something went wrong. Please try again." }))) as T;
}

export function CareerForm() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [otpStage, setOtpStage] = useState<OtpStage>("idle");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sentName, setSentName] = useState("");
  const [sentOn, setSentOn] = useState("");
  const doneRef = useRef<HTMLHeadingElement>(null);

  const phoneLocked = otpStage === "verified" || otpStage === "verifying";
  const otpOpen = otpStage === "sent" || otpStage === "verifying";

  useEffect(() => {
    if (sentName) doneRef.current?.focus({ preventScroll: true });
  }, [sentName]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [resendIn]);

  const resetOtp = () => {
    setOtpStage("idle");
    setOtp("");
    setOtpToken("");
    setVerifiedToken("");
    setOtpError("");
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (touched[key]) setErrors(validate(next, resume));
      return next;
    });
  };

  const blur = (key: Field) => {
    setTouched((current) => ({ ...current, [key]: true }));
    setErrors(validate(values, resume));
  };

  const pickFile = (file: File | null) => {
    setResume(file);
    setTouched((current) => ({ ...current, resume: true }));
    setErrors(validate(values, file));
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) pickFile(file);
  };

  const clearFile = () => {
    if (fileRef.current) fileRef.current.value = "";
    pickFile(null);
  };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    update("phone", digitsOnly(event.target.value).slice(0, 10));
    if (otpStage !== "idle") resetOtp();
  };

  const sendOtp = async () => {
    if (!isIndianMobile(values.phone)) {
      setTouched((current) => ({ ...current, phone: true }));
      setErrors(validate(values, resume));
      return;
    }
    setOtpStage("sending");
    setOtpError("");
    const result = await post<{ ok: boolean; token?: string; error?: string; retryIn?: number }>(
      "/api/contact/otp/send",
      JSON.stringify({ phone: values.phone }),
    );
    if (result.ok && result.token) {
      setOtpToken(result.token);
      setOtp("");
      setOtpStage("sent");
      setResendIn(OTP_RESEND_SECONDS);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 60);
    } else {
      setOtpStage(otpToken ? "sent" : "idle");
      setOtpError(result.error ?? "We couldn't send the OTP. Please try again.");
      if (result.retryIn) setResendIn(result.retryIn);
    }
  };

  const verify = async (code: string) => {
    if (code.length !== OTP_LENGTH || otpStage === "verifying") return;
    setOtpStage("verifying");
    setOtpError("");
    const result = await post<{ ok: boolean; verifiedToken?: string; error?: string }>(
      "/api/contact/otp/verify",
      JSON.stringify({ phone: values.phone, otp: code, token: otpToken }),
    );
    if (result.ok && result.verifiedToken) {
      setVerifiedToken(result.verifiedToken);
      setOtpStage("verified");
      setErrors((current) => ({ ...current, phone: undefined }));
    } else {
      setOtpStage("sent");
      setOtpError(result.error ?? "That code didn't work. Please try again.");
      setOtp("");
      window.setTimeout(() => otpRefs.current[0]?.focus(), 60);
    }
  };

  const setOtpDigit = (index: number, raw: string) => {
    const digit = digitsOnly(raw).slice(-1);
    const chars = otp.padEnd(OTP_LENGTH, " ").split("");
    chars[index] = digit || " ";
    const next = chars.join("").replace(/\s+$/, "");
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
    const clean = next.replace(/\s/g, "");
    if (clean.length === OTP_LENGTH) void verify(clean);
  };

  const onOtpKey = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === "Backspace" && !otp[index]?.trim()) || event.key === "ArrowLeft") {
      if (index > 0) otpRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const onOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const code = digitsOnly(event.clipboardData.getData("text")).slice(0, OTP_LENGTH);
    if (!code) return;
    event.preventDefault();
    setOtp(code);
    otpRefs.current[Math.min(code.length, OTP_LENGTH - 1)]?.focus();
    if (code.length === OTP_LENGTH) void verify(code);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values, resume);
    setTouched({ name: true, email: true, phone: true, role: true, resume: true, message: true });
    if (otpStage !== "verified" && !nextErrors.phone) {
      nextErrors.phone = "Verify your number with the OTP to continue.";
    }
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.values(nextErrors).some(Boolean) || !resume) {
      setSubmitError("Please fix the highlighted fields.");
      return;
    }

    const body = new FormData();
    body.set("name", values.name.trim());
    body.set("email", values.email.trim());
    body.set("phone", values.phone);
    body.set("role", values.role);
    body.set("message", values.message);
    body.set("website", values.website);
    body.set("verifiedToken", verifiedToken);
    body.set("resume", resume);

    setSubmitting(true);
    const result = await post<{ ok: boolean; error?: string; errors?: Errors }>("/api/career", body, false);
    setSubmitting(false);

    if (result.ok) {
      setSentOn(
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
      );
      setSentName(values.name.trim().split(/\s+/)[0]);
      return;
    }
    if (result.errors) setErrors(result.errors);
    setSubmitError(result.error ?? "We couldn't send your application. Please try again.");
  };

  const applyAgain = () => {
    setValues(INITIAL);
    clearFile();
    setTouched({});
    setErrors({});
    setSubmitError("");
    resetOtp();
    setSentName("");
  };

  const show = (key: Field) => (errors[key] && touched[key] ? errors[key] : "");
  const otpBoxes = Array.from({ length: OTP_LENGTH }, (_, index) => otp[index]?.trim() ?? "");
  const phoneError = show("phone") || (!otpOpen && otpError ? otpError : "");

  return (
    <form className={cn("ct-slip cr-slip", sentName && "is-booked")} onSubmit={submit} noValidate>
      <div className="ct-slip-body" inert={Boolean(sentName)}>
        <header className="ct-slip-head">
          <div>
            <p className="ct-slip-brand">Ritz Media World Roadways</p>
            <p className="ct-slip-sub">Crew application · Job card</p>
          </div>
          <p className="ct-slip-note">
            Fields marked <span aria-hidden>*</span>
            <span className="sr-only">with an asterisk</span> are required
          </p>
        </header>

        <div className="ct-fields">
          <label className={cn("ct-field ct-f-half", show("name") && "has-error")}>
            <span className="ct-label">
              Full name<span aria-hidden>*</span>
            </span>
            <input
              className="ct-input"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              onBlur={() => blur("name")}
              aria-invalid={Boolean(show("name"))}
              required
            />
            {show("name") ? <span className="ct-error">{show("name")}</span> : null}
          </label>

          <label className={cn("ct-field ct-f-half", show("email") && "has-error")}>
            <span className="ct-label">
              Email address<span aria-hidden>*</span>
            </span>
            <input
              className="ct-input"
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              onBlur={() => blur("email")}
              aria-invalid={Boolean(show("email"))}
              required
            />
            {show("email") ? <span className="ct-error">{show("email")}</span> : null}
          </label>

          <div className={cn("ct-field ct-phone ct-f-half", phoneError && "has-error")}>
            <label className="ct-label" htmlFor="cr-phone">
              Phone number<span aria-hidden>*</span>
            </label>
            <div className="ct-phone-row">
              <span className="cr-dial" aria-hidden>
                +91
              </span>
              <input
                id="cr-phone"
                className="ct-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                name="phone"
                placeholder="10-digit mobile"
                value={values.phone}
                onChange={onPhoneChange}
                onBlur={() => blur("phone")}
                readOnly={phoneLocked}
                aria-invalid={Boolean(phoneError)}
                aria-describedby="cr-phone-help"
                required
              />
              {otpStage === "verified" ? (
                <span className="ct-verified">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  Verified
                </span>
              ) : (
                <button
                  type="button"
                  className="ct-otp-send"
                  onClick={sendOtp}
                  disabled={otpStage === "sending" || otpStage === "verifying" || resendIn > 0}
                >
                  {otpStage === "sending"
                    ? "Sending…"
                    : otpStage === "idle"
                      ? "Send OTP"
                      : resendIn > 0
                        ? `Resend ${resendIn}s`
                        : "Resend"}
                </button>
              )}
            </div>
            {phoneError ? (
              <span id="cr-phone-help" className="ct-error" role={otpError ? "alert" : undefined}>
                {phoneError}
              </span>
            ) : otpStage === "verified" ? (
              <span id="cr-phone-help" className="ct-help">
                Number verified.{" "}
                <button type="button" className="ct-link" onClick={resetOtp}>
                  Use a different number
                </button>
              </span>
            ) : (
              <span id="cr-phone-help" className="ct-help sr-only">
                We&rsquo;ll text you a one-time code to confirm it&rsquo;s you.
              </span>
            )}

            {otpOpen ? (
              <div className="ct-otp" role="group" aria-labelledby="cr-otp-label">
                <p id="cr-otp-label" className="ct-otp-title">
                  Enter the code <span>Sent to +91 {values.phone}</span>
                </p>
                <div className="ct-otp-boxes">
                  {otpBoxes.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        otpRefs.current[index] = node;
                      }}
                      className="ct-otp-box"
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={digit}
                      aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                      onChange={(event) => setOtpDigit(index, event.target.value)}
                      onKeyDown={(event) => onOtpKey(index, event)}
                      onPaste={onOtpPaste}
                      disabled={otpStage === "verifying"}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="ct-btn is-small"
                  onClick={() => verify(otp.replace(/\s/g, ""))}
                  disabled={otp.replace(/\s/g, "").length !== OTP_LENGTH || otpStage === "verifying"}
                >
                  {otpStage === "verifying" ? "Checking…" : "Verify"}
                </button>
                {otpError ? (
                  <p className="ct-error ct-otp-error" role="alert">
                    {otpError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <ContactSelect
            className="ct-f-half"
            label="Applying for"
            required
            placeholder="Choose a role"
            value={values.role}
            options={CAREER_ROLES}
            onChange={(role) => {
              update("role", role);
              setTouched((current) => ({ ...current, role: true }));
              setErrors(validate({ ...values, role }, resume));
            }}
            error={show("role") || undefined}
          />

          <div className={cn("ct-field ct-f-full", show("resume") && "has-error")}>
            <span id="cr-resume-label" className="ct-label">
              Upload resume<span aria-hidden>*</span>
            </span>
            <label
              className={cn("cr-drop", dragging && "is-over", resume && "has-file")}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <input
                ref={fileRef}
                className="cr-drop-input"
                type="file"
                name="resume"
                accept={RESUME_ACCEPT}
                aria-labelledby="cr-resume-label"
                aria-invalid={Boolean(show("resume"))}
                onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
              />
              <span className="cr-drop-icon" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5M12 18v-6M9.5 14.5 12 12l2.5 2.5" />
                </svg>
              </span>
              {resume ? (
                <span className="cr-drop-text">
                  <strong>{resume.name}</strong>
                  <span>{formatBytes(resume.size)} · click to replace</span>
                </span>
              ) : (
                <span className="cr-drop-text">
                  <strong>Drop your resume here or browse</strong>
                  <span>PDF, DOC or DOCX · up to 5 MB</span>
                </span>
              )}
            </label>
            {resume ? (
              <button type="button" className="cr-drop-clear" onClick={clearFile} aria-label="Remove resume">
                ×
              </button>
            ) : null}
            {show("resume") ? <span className="ct-error">{show("resume")}</span> : null}
          </div>
        </div>

        <label className={cn("ct-field ct-f-message", show("message") && "has-error")}>
          <span className="ct-label">
            Message<span aria-hidden>*</span>
          </span>
          <textarea
            className="ct-input ct-textarea"
            name="message"
            rows={3}
            maxLength={2000}
            placeholder="Tell us a little about yourself and your work."
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={Boolean(show("message"))}
            required
          />
          {show("message") ? <span className="ct-error">{show("message")}</span> : null}
        </label>

        <div className="ct-honeypot" aria-hidden>
          <label>
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              name="website"
              value={values.website}
              onChange={(event) => update("website", event.target.value)}
            />
          </label>
        </div>

        <footer className="ct-slip-foot">
          <button type="submit" className="ct-btn is-hot" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit application"}
            <svg viewBox="0 0 32 20" aria-hidden className="ct-btn-truck">
              <path d="M2 3h17v11H2zM19 7h6l4 4v3H19z" />
              <circle cx="8" cy="16" r="2.4" />
              <circle cx="24" cy="16" r="2.4" />
            </svg>
          </button>
          {submitError ? (
            <p className="ct-error ct-submit-error" role="alert">
              {submitError}
            </p>
          ) : (
            <p className="ct-help">Your details are shared only with our HR team and used only for hiring.</p>
          )}
        </footer>
      </div>

      {sentName ? (
        <div className="ct-booked" role="status">
          <svg className="ct-stamp" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <path id="cr-stamp-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
            </defs>
            <circle cx="100" cy="100" r="94" className="ct-stamp-line is-thick" />
            <circle cx="100" cy="100" r="86" className="ct-stamp-line" />
            <circle cx="100" cy="100" r="56" className="ct-stamp-line" />
            <text className="ct-stamp-ring">
              <textPath href="#cr-stamp-ring" startOffset="0">
                RITZ MEDIA WORLD ★ APPLICATION RECEIVED ★ NOIDA ★
              </textPath>
            </text>
            <path className="ct-stamp-tick" d="M76 96l17 17 32-36" />
            <text x="100" y="135" className="ct-stamp-date">
              {sentOn}
            </text>
          </svg>

          <div className="ct-booked-body">
            <p className="ct-booked-kicker">
              <span className="ct-booked-tick" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              Application received
            </p>
            <h2 ref={doneRef} tabIndex={-1} className="ct-booked-title">
              Thank you, {sentName}!
            </h2>
            <p className="ct-booked-copy">
              Your application for {values.role} is on the road. If your profile fits, our HR team
              will call you within a few working days.
            </p>
            <button type="button" className="ct-btn" onClick={applyAgain}>
              Submit another application
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
