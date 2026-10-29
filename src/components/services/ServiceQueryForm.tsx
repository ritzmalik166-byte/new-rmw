"use client";

import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { HmArrow } from "@/components/homepage/shared";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { cn } from "@/lib/cn";
import {
  COUNTRIES,
  DIAL_CODES,
  HEARD_FROM,
  INQUIRY_REASONS,
  OTP_DIAL_CODE,
  OTP_LENGTH,
  OTP_RESEND_SECONDS,
  digitsOnly,
  isIndianMobile,
  isValidEmail,
  isValidName,
  isValidPhone,
} from "@/lib/contact";

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  dial: string;
  phone: string;
  reason: string;
  country: string;
  heardFrom: string;
  message: string;
  website: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const COUNTRY_NAMES = COUNTRIES.map((country) => country.name);
type OtpStage = "idle" | "sending" | "sent" | "verifying" | "verified";

const INITIAL: Values = {
  firstName: "",
  lastName: "",
  email: "",
  dial: OTP_DIAL_CODE,
  phone: "",
  reason: INQUIRY_REASONS[0],
  country: "",
  heardFrom: HEARD_FROM[0],
  message: "",
  website: "",
};

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (!isValidName(values.firstName.trim())) errors.firstName = "Enter your first name.";
  if (!isValidName(values.lastName.trim())) errors.lastName = "Enter your last name.";
  if (!isValidEmail(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!isValidPhone(values.dial, values.phone)) {
    errors.phone = values.dial === OTP_DIAL_CODE ? "Enter a 10-digit mobile number." : "Enter a valid phone number.";
  }
  if (!values.country) errors.country = "Choose your country.";
  return errors;
}

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

type ServiceQueryFormProps = {
  service: string;
  title?: string;
  lede?: string;
  doneText?: string;
  /** First line of the message sent to the CRM; defaults to "Service: {service}". */
  context?: string;
  /** Tighter layout for narrow sticky sidebars that must fit within the viewport. */
  compact?: boolean;
  className?: string;
  onClose?: () => void;
};

export function ServiceQueryForm({
  service,
  title = "Quick Inquiry",
  lede = `Tell us what you need for ${service}.`,
  doneText = `Our ${service} team will call you within one working day.`,
  context = `Service: ${service}`,
  compact = false,
  className,
  onClose,
}: ServiceQueryFormProps) {
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
  const [sentName, setSentName] = useState("");

  const bySms = values.dial === OTP_DIAL_CODE;
  const otpLocked = otpStage === "verified" || otpStage === "verifying";
  const otpOpen = otpStage === "sent" || otpStage === "verifying";
  const phoneMax = bySms ? 10 : 14;

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
    update("phone", digitsOnly(event.target.value).slice(0, phoneMax));
    if (bySms && otpStage !== "idle") resetOtp();
  };

  const onEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    update("email", event.target.value);
    if (!bySms && otpStage !== "idle") resetOtp();
  };

  const onDialChange = (dial: string) => {
    update("dial", dial);
    update("phone", values.phone.slice(0, dial === OTP_DIAL_CODE ? 10 : 14));
    resetOtp();
  };

  const onCountryChange = (country: string) => {
    update("country", country);
    const dial = COUNTRIES.find((item) => item.name === country)?.dial;
    if (dial && dial !== values.dial && otpStage !== "verified" && !values.phone) {
      update("dial", dial);
      resetOtp();
    }
  };

  const otpTarget = () => (bySms ? { phone: values.phone } : { email: values.email.trim() });

  const sendOtp = async () => {
    if (bySms && !isIndianMobile(values.phone)) {
      setErrors((current) => ({ ...current, phone: "Enter a 10-digit mobile number." }));
      return;
    }
    if (!bySms && !isValidEmail(values.email.trim())) {
      setErrors((current) => ({ ...current, email: "Enter a valid email address." }));
      return;
    }
    setOtpStage("sending");
    setOtpError("");
    const result = await postJson<{ ok: boolean; token?: string; error?: string; retryIn?: number }>(
      "/api/contact/otp/send",
      otpTarget(),
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
      { ...otpTarget(), otp: code, token: otpToken },
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
    const nextErrors = validate(values);
    if (otpStage !== "verified" && !nextErrors.phone && (bySms || !nextErrors.email)) {
      nextErrors.phone = bySms
        ? "Verify your number with the OTP to continue."
        : "Verify your email with the OTP to continue.";
    }
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.values(nextErrors).some(Boolean)) {
      setSubmitError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    const result = await postJson<{ ok: boolean; error?: string; errors?: Errors }>("/api/contact", {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      message: [context, values.message.trim()].filter(Boolean).join("\n"),
      verifiedToken,
    });
    setSubmitting(false);

    if (result.ok) {
      setSentName(values.firstName.trim());
      return;
    }
    if (result.errors) setErrors(result.errors);
    setSubmitError(result.error ?? "We couldn't send your query. Please try again.");
  };

  const sendAnother = () => {
    setValues(INITIAL);
    setErrors({});
    setSubmitError("");
    resetOtp();
    setSentName("");
  };

  const closeButton = onClose ? (
    <button type="button" className="sd-query-close" aria-label="Close query form" onClick={onClose}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  ) : null;

  if (sentName) {
    return (
      <div className={cn("sd-query", className)} role="status">
        <p className="sd-query-head">
          Query received {closeButton ?? <span aria-hidden>✓</span>}
        </p>
        <div className="sd-query-done">
          <p className="sd-query-done-title">Thank you, {sentName}!</p>
          <p>{doneText}</p>
          <button type="button" className="sd-query-link" onClick={sendAnother}>
            Send another query
          </button>
        </div>
      </div>
    );
  }

  const phoneError = errors.phone || (!otpOpen ? otpError : "");

  return (
    <form className={cn("sd-query", compact && "is-compact", className)} onSubmit={submit} noValidate aria-labelledby={titleId}>
      <p className="sd-query-head">
        <span id={titleId}>{title}</span>
        {closeButton ?? <span aria-hidden>↗</span>}
      </p>

      <div className="sd-query-body">
        <p className="sd-query-lede">
          {lede}
          {compact ? null : " Fields marked * are required."}
        </p>

        <div className="sd-query-pair">
          <label className={cn("sd-query-field", errors.firstName && "has-error")}>
            <span>First name*</span>
            <input
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              aria-invalid={Boolean(errors.firstName)}
              required
            />
            {errors.firstName ? <small>{errors.firstName}</small> : null}
          </label>
          <label className={cn("sd-query-field", errors.lastName && "has-error")}>
            <span>Last name*</span>
            <input
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              aria-invalid={Boolean(errors.lastName)}
              required
            />
            {errors.lastName ? <small>{errors.lastName}</small> : null}
          </label>
        </div>

        <label className={cn("sd-query-field", errors.email && "has-error")}>
          <span>Email*</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={values.email}
            onChange={onEmailChange}
            readOnly={!bySms && otpLocked}
            aria-invalid={Boolean(errors.email)}
            required
          />
          {errors.email ? <small>{errors.email}</small> : null}
        </label>

        <div className={cn("sd-query-field", phoneError && "has-error")}>
          <label htmlFor={phoneId}>Phone*</label>
          <div className="sd-query-phone">
            <SelectMenu
              className="sd-query-select is-dial"
              ariaLabel="Country code"
              value={values.dial}
              options={DIAL_CODES}
              disabled={otpLocked}
              onChange={onDialChange}
            />
            <input
              id={phoneId}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              name="phone"
              placeholder={bySms ? "10-digit mobile" : "Phone number"}
              value={values.phone}
              onChange={onPhoneChange}
              readOnly={bySms && otpLocked}
              aria-invalid={Boolean(phoneError)}
              required
            />
          </div>

          {otpStage === "verified" ? (
            <p className="sd-query-verified">
              <span aria-hidden>✓</span> {bySms ? "Number" : "Email"} verified.{" "}
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
                  ? bySms
                    ? "Send OTP"
                    : "Email OTP to verify"
                  : resendIn > 0
                    ? `Resend OTP in ${resendIn}s`
                    : "Resend OTP"}
            </button>
          )}

          {phoneError ? <small role={otpError ? "alert" : undefined}>{phoneError}</small> : null}

          {otpOpen ? (
            <div className="sd-query-otp">
              <label htmlFor={otpId}>Enter the code sent to {bySms ? `+91 ${values.phone}` : values.email.trim()}</label>
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

        <div className={compact ? "sd-query-pair" : "sd-query-stack"}>
          <div className={cn("sd-query-field", errors.country && "has-error")}>
            <span id={`${uid}-country`}>Country*</span>
            <SelectMenu
              className="sd-query-select"
              labelledBy={`${uid}-country`}
              placeholder={compact ? "Select" : "Select your country"}
              value={values.country}
              options={COUNTRY_NAMES}
              invalid={Boolean(errors.country)}
              onChange={onCountryChange}
            />
            {errors.country ? <small>{errors.country}</small> : null}
          </div>

          <div className="sd-query-field">
            <span id={`${uid}-reason`}>{compact ? "Reason*" : "Reason for inquiry*"}</span>
            <SelectMenu
              className="sd-query-select"
              labelledBy={`${uid}-reason`}
              value={values.reason}
              options={INQUIRY_REASONS}
              onChange={(value) => update("reason", value)}
            />
          </div>
        </div>

        <div className="sd-query-field">
          <span id={`${uid}-heard`}>How did you hear about us?</span>
          <SelectMenu
            className="sd-query-select"
            labelledBy={`${uid}-heard`}
            value={values.heardFrom}
            options={HEARD_FROM}
            onChange={(value) => update("heardFrom", value)}
          />
        </div>

        <label className="sd-query-field">
          <span>Message (optional)</span>
          <textarea
            name="message"
            rows={compact ? 2 : 3}
            maxLength={1900}
            placeholder="Goals, budget or timeline"
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </label>

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

        <button type="submit" className="sd-query-submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send query"}
          <HmArrow />
        </button>
        {submitError ? (
          <p className="sd-query-error" role="alert">
            {submitError}
          </p>
        ) : (
          <p className="sd-query-note">We reply within one working day.</p>
        )}
      </div>
    </form>
  );
}
