"use client";

import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { getAttribution } from "@/lib/attribution";
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
import { site } from "@/lib/site";

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
type OtpStage = "idle" | "sending" | "sent" | "verifying" | "verified";

const COUNTRY_NAMES = COUNTRIES.map((country) => country.name);

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

const pillIcons = {
  Branding: (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M8 1.5 14 8 8 14.5 2 8 8 1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  SEO: (
    <svg viewBox="0 0 16 16" aria-hidden>
      <circle cx="7" cy="7" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 10.2 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  "Social Media": (
    <svg viewBox="0 0 16 16" aria-hidden>
      <circle cx="5.5" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11" cy="6.2" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M1.8 13.2c.5-2 2-3 3.7-3s3.2 1 3.7 3M9.2 10.4c1.3-.3 2.4.1 3.2 1.1.6.8 1 1.6 1.2 1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  Performance: (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M2 12.5 6 8l2.4 2.2L14 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10.5 4.5H14V8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
} as const;

function FieldIcon({ name }: { name: "user" | "mail" | "phone" | "tag" | "doc" | "flag" | "globe" | "chat" }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      {name === "user" ? (
        <>
          <circle cx="8" cy="5.2" r="2.2" {...common} />
          <path d="M3.2 13.2c.7-2.3 2.4-3.4 4.8-3.4s4.1 1.1 4.8 3.4" {...common} />
        </>
      ) : null}
      {name === "mail" ? (
        <>
          <rect x="2" y="3.5" width="12" height="9" rx="1.4" {...common} />
          <path d="M2.5 4.5 8 8.5l5.5-4" {...common} />
        </>
      ) : null}
      {name === "phone" ? (
        <path
          d="M4.2 2.8h2.1l1 2.4-1.3 1a8.4 8.4 0 0 0 3.8 3.8l1-1.3 2.4 1v2.1c0 .5-.4.9-.9.9A10.2 10.2 0 0 1 3.3 3.7c0-.5.4-.9.9-.9Z"
          {...common}
        />
      ) : null}
      {name === "tag" ? (
        <path d="M2.5 8.2 8 2.7h4.2V7L7.2 13.7 2.5 8.2Z" {...common} />
      ) : null}
      {name === "doc" ? (
        <>
          <path d="M4 2.5h5.2L12.5 6v7.2H4V2.5Z" {...common} />
          <path d="M9 2.7V6h3.2M6 8.5h4M6 11h3" {...common} />
        </>
      ) : null}
      {name === "flag" ? (
        <path d="M4 13.5V2.8h7.2L9.6 5.4l1.6 2.5H4" {...common} />
      ) : null}
      {name === "globe" ? (
        <>
          <circle cx="8" cy="8" r="5.6" {...common} />
          <path d="M2.6 8h10.8M8 2.4c1.6 1.6 2.3 3.5 2.3 5.6S9.6 12 8 13.6C6.4 12 5.7 10.1 5.7 8S6.4 4 8 2.4Z" {...common} />
        </>
      ) : null}
      {name === "chat" ? (
        <path d="M2.8 3.2h10.4v7.2H7.4L4.6 12.8v-2.4H2.8V3.2Z" {...common} />
      ) : null}
    </svg>
  );
}

export function StartProject({ cta, headingLevel = "p" }: { cta?: string; headingLevel?: "p" | "h2" } = {}) {
  const data = site.startProject;
  const uid = useId();
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

  const accentAt = data.title.indexOf("Free");
  const titleBefore = accentAt >= 0 ? data.title.slice(0, accentAt) : data.title;
  const titleAfter = accentAt >= 0 ? data.title.slice(accentAt + "Free".length) : "";

  const bySms = values.dial === OTP_DIAL_CODE;
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
    update("phone", digitsOnly(event.target.value).slice(0, bySms ? 10 : 14));
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
      {
        ...otpTarget(),
        userName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
        enquiry_for: values.reason,
        message: values.message.trim(),
        number: values.phone,
      },
    );
    if (result.ok && result.token) {
      setOtpToken(result.token);
      setOtp("");
      setOtpStage("sent");
      setResendIn(OTP_RESEND_SECONDS);
      window.setTimeout(() => document.getElementById(otpId)?.focus(), 60);
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
    const result = await postJson<{ ok: boolean; error?: string; errors?: Record<string, string> }>("/api/contact", {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      dial: values.dial,
      phone: values.phone,
      reason: values.reason,
      country: values.country,
      heardFrom: values.heardFrom,
      message: values.message.trim(),
      website: values.website,
      verifiedToken,
      tracking: getAttribution(),
    });
    setSubmitting(false);

    if (result.ok) {
      setSentName(values.firstName.trim());
      setValues(INITIAL);
      setErrors({});
      resetOtp();
      return;
    }
    if (result.errors) {
      // Only keep errors for fields this form renders.
      const known: Errors = {};
      for (const key of Object.keys(INITIAL) as (keyof Values)[]) {
        if (result.errors[key]) known[key] = result.errors[key];
      }
      setErrors(known);
      if (result.errors.phone || result.errors.email) resetOtp();
    }
    setSubmitError(result.error ?? "We couldn't send your request. Please try again.");
  };

  const phoneError = errors.phone || (!otpOpen ? otpError : "");

  const fieldError = (key: keyof Values) =>
    errors[key] ? <small className="audit-error">{errors[key]}</small> : null;

  return (
    <section id="start-a-project" className="audit" aria-label="Start a project">
      <div className="audit-top" aria-hidden />

      <div className="audit-inner">
        <div className="audit-left">
          <div className="audit-copy">
            <p className="audit-kicker">{data.kicker}</p>
            {headingLevel === "h2" ? (
              <h2 className="audit-title">
                {titleBefore}
                {accentAt >= 0 ? <span className="audit-title-accent">Free</span> : null}
                {titleAfter}
              </h2>
            ) : (
              <p className="audit-title">
                {titleBefore}
                {accentAt >= 0 ? <span className="audit-title-accent">Free</span> : null}
                {titleAfter}
              </p>
            )}
            <ul className="audit-pills">
              {data.pills.map((pill) => (
                <li key={pill}>
                  <span className="audit-pill">
                    {pillIcons[pill as keyof typeof pillIcons]}
                    {pill}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="audit-truck">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.highways.truck} alt="Ritz Media World truck carrying a Free Consultation billboard" width={961} height={615} loading="lazy" />
            <p className="audit-billboard">
              <strong>Free Consultation</strong>
              <span>Ritz Media World</span>
            </p>
          </div>
        </div>

        <form className="audit-card" onSubmit={submit} noValidate>
          <div className="audit-notch" aria-hidden>
            <svg viewBox="0 0 24 24">
              <path
                d="M12 3.2c.4 1.8 1.2 2.8 2.6 3.4-1.4.5-2.2 1.6-2.6 3.4-.4-1.8-1.2-2.9-2.6-3.4 1.4-.6 2.2-1.6 2.6-3.4Z"
                fill="currentColor"
              />
              <path
                d="M12 7.2c.2.9.6 1.4 1.3 1.7-.7.3-1.1.8-1.3 1.7-.2-.9-.6-1.4-1.3-1.7.7-.3 1.1-.8 1.3-1.7Z"
                fill="#0f193d"
              />
            </svg>
          </div>

          <p className="audit-card-title">{data.formTitle}</p>

          {sentName ? (
            <div className="audit-done" role="status">
              <p className="audit-done-title">Thank you, {sentName}!</p>
              <p className="audit-note is-success">
                Your request is on its way. Our team will call you within one working day.
              </p>
              <button type="button" className="audit-link" onClick={() => setSentName("")}>
                Send another request
              </button>
            </div>
          ) : (
            <>
              {/* Honeypot: hidden from people, bots fill it and get silently dropped. */}
              <input
                className="audit-trap"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={values.website}
                onChange={(event) => update("website", event.target.value)}
              />

              <div className="audit-fields">
                <label className={cn("audit-field", errors.firstName && "has-error")}>
                  <span className="audit-label">
                    <FieldIcon name="user" />
                    First Name<span aria-hidden>*</span>
                  </span>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    value={values.firstName}
                    onChange={(event) => update("firstName", event.target.value)}
                    aria-invalid={Boolean(errors.firstName)}
                    required
                  />
                  {fieldError("firstName")}
                </label>

                <label className={cn("audit-field", errors.lastName && "has-error")}>
                  <span className="audit-label">
                    <FieldIcon name="user" />
                    Last Name<span aria-hidden>*</span>
                  </span>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    value={values.lastName}
                    onChange={(event) => update("lastName", event.target.value)}
                    aria-invalid={Boolean(errors.lastName)}
                    required
                  />
                  {fieldError("lastName")}
                </label>

                <label className={cn("audit-field", errors.email && "has-error")}>
                  <span className="audit-label">
                    <FieldIcon name="mail" />
                    Your Email<span aria-hidden>*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={values.email}
                    onChange={onEmailChange}
                    readOnly={!bySms && otpLocked}
                    aria-invalid={Boolean(errors.email)}
                    required
                  />
                  {fieldError("email")}
                </label>

                <div className={cn("audit-field", errors.country && "has-error")}>
                  <span id={`${uid}-country`} className="audit-label">
                    <FieldIcon name="globe" />
                    Country<span aria-hidden>*</span>
                  </span>
                  <SelectMenu
                    className="audit-select"
                    name="country"
                    labelledBy={`${uid}-country`}
                    placeholder="Select your country"
                    value={values.country}
                    options={COUNTRY_NAMES}
                    invalid={Boolean(errors.country)}
                    onChange={onCountryChange}
                  />
                  {fieldError("country")}
                </div>

                <div className={cn("audit-field audit-field-wide", phoneError && "has-error")}>
                  <label className="audit-label" htmlFor={phoneId}>
                    <FieldIcon name="phone" />
                    Your Phone<span aria-hidden>*</span>
                  </label>
                  <div className="audit-phone">
                    <SelectMenu
                      className="audit-select audit-dial"
                      ariaLabel="Country code"
                      value={values.dial}
                      options={DIAL_CODES}
                      disabled={otpLocked}
                      onChange={onDialChange}
                    />
                    <input
                      id={phoneId}
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder={bySms ? "10-digit mobile" : "Phone number"}
                      value={values.phone}
                      onChange={onPhoneChange}
                      readOnly={bySms && otpLocked}
                      aria-invalid={Boolean(phoneError)}
                      required
                    />
                    {otpStage === "verified" ? (
                      <span className="audit-verified">
                        <span aria-hidden>✓</span> Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="audit-otp-btn"
                        onClick={sendOtp}
                        disabled={otpStage === "sending" || otpStage === "verifying" || resendIn > 0}
                      >
                        {otpStage === "sending"
                          ? "Sending…"
                          : otpStage === "idle"
                            ? bySms
                              ? "Send OTP"
                              : "Email OTP"
                            : resendIn > 0
                              ? `Resend ${resendIn}s`
                              : "Resend"}
                      </button>
                    )}
                  </div>

                  {phoneError ? (
                    <small className="audit-error" role={otpError ? "alert" : undefined}>
                      {phoneError}
                    </small>
                  ) : otpStage === "verified" ? (
                    <small className="audit-help">
                      {bySms ? "Number" : "Email"} verified.{" "}
                      <button type="button" className="audit-link" onClick={resetOtp}>
                        Change
                      </button>
                    </small>
                  ) : !bySms ? (
                    <small className="audit-help">We&apos;ll email a one-time code to the address above.</small>
                  ) : null}

                  {otpOpen ? (
                    <div className="audit-otp">
                      <label className="audit-help" htmlFor={otpId}>
                        Enter the code sent to {bySms ? `+91 ${values.phone}` : values.email.trim()}
                      </label>
                      <div className="audit-phone">
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
                          className="audit-otp-btn"
                          onClick={() => verify(otp)}
                          disabled={otp.length !== OTP_LENGTH || otpStage === "verifying"}
                        >
                          {otpStage === "verifying" ? "Checking…" : "Verify"}
                        </button>
                      </div>
                      {otpError ? (
                        <small className="audit-error" role="alert">
                          {otpError}
                        </small>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="audit-field">
                  <span id={`${uid}-reason`} className="audit-label">
                    <FieldIcon name="tag" />
                    Reason for Inquiry<span aria-hidden>*</span>
                  </span>
                  <SelectMenu
                    className="audit-select"
                    name="reason"
                    labelledBy={`${uid}-reason`}
                    value={values.reason}
                    options={INQUIRY_REASONS}
                    onChange={(value) => update("reason", value)}
                  />
                </div>

                <div className="audit-field">
                  <span id={`${uid}-heard`} className="audit-label">
                    <FieldIcon name="flag" />
                    How Did You Hear About Us?
                  </span>
                  <SelectMenu
                    className="audit-select"
                    name="heardFrom"
                    labelledBy={`${uid}-heard`}
                    value={values.heardFrom}
                    options={HEARD_FROM}
                    onChange={(value) => update("heardFrom", value)}
                  />
                </div>

                <label className="audit-field audit-field-wide">
                  <span className="audit-label">
                    <FieldIcon name="chat" />
                    Message (optional)
                  </span>
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={2000}
                    placeholder="Tell us about your brand, goals or timeline."
                    value={values.message}
                    onChange={(event) => update("message", event.target.value)}
                  />
                </label>
              </div>

              {submitError ? (
                <p className="audit-note is-error" role="alert">
                  {submitError}
                </p>
              ) : null}

              <div className="audit-actions">
                <button className="audit-submit" type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : (cta ?? data.cta)}
                  <svg viewBox="0 0 20 14" aria-hidden>
                    <path
                      d="M1 9.5h8.2v2.2H1V9.5Zm8.6-1.2 2.2-2.6h5.4l1.6 2.6H9.6Zm1.2 1.2h2.4v1.6h-2.4V9.5Zm6.2 0H18v1.6h-1v-1.6Z"
                      fill="currentColor"
                    />
                    <circle cx="5.2" cy="12.2" r="1.3" fill="currentColor" />
                    <circle cx="15.2" cy="12.2" r="1.3" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* <div className="audit-road" aria-hidden /> */}
    </section>
  );
}
