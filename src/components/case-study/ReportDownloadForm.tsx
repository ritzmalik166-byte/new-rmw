"use client";

import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { HmArrow } from "@/components/homepage/shared";
import { cn } from "@/lib/cn";
import {
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  digitsOnly,
  isIndianMobile,
  isValidEmail,
  isValidName,
} from "@/lib/contact";
import type { CaseStudyReport } from "@/lib/case-studies";

type Values = { name: string; email: string; phone: string; website: string };
type Errors = Partial<Record<keyof Values, string>>;
type OtpStage = "idle" | "sending" | "sent" | "verifying" | "verified";

const INITIAL: Values = { name: "", email: "", phone: "", website: "" };

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  return ((await response?.json().catch(() => null)) ?? {
    ok: false,
    error: "Something went wrong. Please try again.",
  }) as T;
}

function startDownload(file: string) {
  const link = document.createElement("a");
  link.href = file;
  link.download = file.split("/").pop() ?? "";
  document.body.append(link);
  link.click();
  link.remove();
}

export function ReportDownloadForm({ report, onClose }: { report: CaseStudyReport; onClose: () => void }) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const phoneId = `${uid}-phone`;
  const otpId = `${uid}-otp`;
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});

  const [otpStage, setOtpStage] = useState<OtpStage>("idle");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [file, setFile] = useState("");

  const otpLocked = otpStage === "verified" || otpStage === "verifying";
  const otpOpen = otpStage === "sent" || otpStage === "verifying";

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
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    update("phone", digitsOnly(event.target.value).slice(0, 10));
    if (otpStage !== "idle") resetOtp();
  };

  const sendOtp = async () => {
    if (!isIndianMobile(values.phone)) {
      setErrors((current) => ({ ...current, phone: "Enter a 10-digit Indian mobile number." }));
      return;
    }
    setOtpStage("sending");
    setOtpError("");
    const result = await postJson<{ ok: boolean; token?: string; error?: string; retryIn?: number }>(
      "/api/contact/otp/send",
      { phone: values.phone },
    );
    if (result.ok && result.token) {
      setOtpToken(result.token);
      setOtp("");
      setOtpStage("sent");
      setResendIn(OTP_RESEND_SECONDS);
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
    const result = await postJson<{ ok: boolean; verifiedToken?: string; error?: string }>(
      "/api/contact/otp/verify",
      { phone: values.phone, otp: code, token: otpToken },
    );
    if (result.ok && result.verifiedToken) {
      setVerifiedToken(result.verifiedToken);
      setOtpStage("verified");
      setErrors((current) => ({ ...current, phone: undefined }));
    } else {
      setOtpStage("sent");
      setOtpError(result.error ?? "That code didn't work. Please try again.");
      setOtp("");
    }
  };

  const onOtpChange = (event: ChangeEvent<HTMLInputElement>) => {
    const code = digitsOnly(event.target.value).slice(0, OTP_LENGTH);
    setOtp(code);
    if (code.length === OTP_LENGTH) void verify(code);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {};
    if (!isValidName(values.name.trim())) nextErrors.name = "Enter your name.";
    if (!isValidEmail(values.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!isIndianMobile(values.phone)) nextErrors.phone = "Enter a 10-digit Indian mobile number.";
    else if (otpStage !== "verified") nextErrors.phone = "Verify your number with the OTP to continue.";
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    const result = await postJson<{ ok: boolean; file?: string; error?: string; errors?: Errors }>("/api/reports", {
      reportId: report.id,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone,
      website: values.website,
      verifiedToken,
    });
    setSubmitting(false);

    if (result.ok && result.file) {
      setFile(result.file);
      startDownload(result.file);
      return;
    }
    if (result.errors) setErrors(result.errors);
    setSubmitError(result.error ?? "We couldn't start the download. Please try again.");
  };

  const closeButton = (
    <button type="button" className="sd-query-close" aria-label="Close" onClick={onClose}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );

  if (file) {
    return (
      <div className="sd-query is-sheet" role="status">
        <p className="sd-query-head">Download started {closeButton}</p>
        <div className="sd-query-done">
          <p className="sd-query-done-title">Thank you, {values.name.trim().split(/\s+/)[0]}!</p>
          <p>{report.title} is downloading now.</p>
          <a className="sd-query-link" href={file} download>
            Download didn&apos;t start? Click here
          </a>
        </div>
      </div>
    );
  }

  const phoneError = errors.phone || (!otpOpen ? otpError : "");

  return (
    <form className="sd-query is-sheet" onSubmit={submit} noValidate aria-labelledby={titleId}>
      <p className="sd-query-head">
        <span id={titleId}>Download report</span>
        {closeButton}
      </p>

      <div className="sd-query-body">
        <p className="sd-query-lede">
          Verify your mobile number to download {report.title} ({report.period}).
        </p>

        <label className={cn("sd-query-field", errors.name && "has-error")}>
          <span>Name*</span>
          <input
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            required
          />
          {errors.name ? <small>{errors.name}</small> : null}
        </label>

        <label className={cn("sd-query-field", errors.email && "has-error")}>
          <span>Email*</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email ? <small>{errors.email}</small> : null}
        </label>

        <div className={cn("sd-query-field", phoneError && "has-error")}>
          <label htmlFor={phoneId}>Mobile number*</label>
          <div className="sd-query-phone">
            <span className="sd-query-dial" aria-hidden>
              +91
            </span>
            <input
              id={phoneId}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              name="phone"
              placeholder="10-digit mobile"
              value={values.phone}
              onChange={onPhoneChange}
              readOnly={otpLocked}
              aria-invalid={Boolean(phoneError)}
              required
            />
          </div>

          {otpStage === "verified" ? (
            <p className="sd-query-verified">
              <span aria-hidden>✓</span> Number verified.{" "}
              <button type="button" className="sd-query-link" onClick={resetOtp}>
                Change
              </button>
            </p>
          ) : (
            <button
              type="button"
              className="sd-query-otp-send"
              onClick={sendOtp}
              disabled={otpStage === "sending" || otpStage === "verifying" || resendIn > 0}
            >
              {otpStage === "sending"
                ? "Sending…"
                : otpStage === "idle"
                  ? "Send OTP"
                  : resendIn > 0
                    ? `Resend OTP in ${resendIn}s`
                    : "Resend OTP"}
            </button>
          )}

          {phoneError ? <small role={otpError ? "alert" : undefined}>{phoneError}</small> : null}

          {otpOpen ? (
            <div className="sd-query-otp">
              <label htmlFor={otpId}>Enter the code sent to +91 {values.phone}</label>
              <div className="sd-query-otp-row">
                <input
                  id={otpId}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={OTP_LENGTH}
                  placeholder={"•".repeat(OTP_LENGTH)}
                  value={otp}
                  onChange={onOtpChange}
                  disabled={otpStage === "verifying"}
                />
                <button
                  type="button"
                  className="sd-query-otp-send"
                  onClick={() => verify(otp)}
                  disabled={otp.length !== OTP_LENGTH || otpStage === "verifying"}
                >
                  {otpStage === "verifying" ? "Checking…" : "Verify"}
                </button>
              </div>
              {otpError ? <small role="alert">{otpError}</small> : null}
            </div>
          ) : null}
        </div>

        <div className="sd-query-trap" aria-hidden>
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

        <button
          type="submit"
          className="sd-query-submit"
          disabled={submitting || otpStage !== "verified"}
          aria-busy={submitting}
        >
          {submitting ? "Preparing…" : "Download report"}
          <HmArrow />
        </button>
        {submitError ? (
          <p className="sd-query-error" role="alert">
            {submitError}
          </p>
        ) : (
          <p className="sd-query-note">
            {otpStage === "verified" ? "You're verified. Your PDF is ready." : "Verify your number to unlock the download."}
          </p>
        )}
      </div>
    </form>
  );
}
