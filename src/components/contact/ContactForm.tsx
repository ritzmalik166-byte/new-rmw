"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ContactSelect } from "@/components/contact/ContactSelect";
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
  });
  return (await response.json().catch(() => ({ ok: false, error: "Something went wrong. Please try again." }))) as T;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});

  const [otpStage, setOtpStage] = useState<OtpStage>("idle");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sentName, setSentName] = useState("");
  const [bookedOn, setBookedOn] = useState("");
  const bookedRef = useRef<HTMLHeadingElement>(null);

  const needsOtp = values.dial === OTP_DIAL_CODE;
  const phoneLocked = otpStage === "verified" || otpStage === "verifying";
  const otpOpen = needsOtp && (otpStage === "sent" || otpStage === "verifying");

  useEffect(() => {
    if (sentName) bookedRef.current?.focus({ preventScroll: true });
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
    setOtpMessage("");
    setOtpError("");
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (touched[key]) setErrors(validate(next));
      return next;
    });
  };

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const max = values.dial === OTP_DIAL_CODE ? 10 : 14;
    update("phone", digitsOnly(event.target.value).slice(0, max));
    if (otpStage !== "idle") resetOtp();
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

  const blur = (key: keyof Values) => {
    setTouched((current) => ({ ...current, [key]: true }));
    setErrors(validate(values));
  };

  const sendOtp = async () => {
    if (!isIndianMobile(values.phone)) {
      setTouched((current) => ({ ...current, phone: true }));
      setErrors(validate(values));
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
      setOtpMessage(`Sent to +91 ${values.phone}`);
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
    const result = await postJson<{ ok: boolean; verifiedToken?: string; error?: string }>(
      "/api/contact/otp/verify",
      { phone: values.phone, otp: code, token: otpToken },
    );
    if (result.ok && result.verifiedToken) {
      setVerifiedToken(result.verifiedToken);
      setOtpStage("verified");
      setOtpMessage("");
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
    if (event.key === "Backspace" && !otp[index]?.trim() && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
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
    const nextErrors = validate(values);
    setTouched({ firstName: true, lastName: true, email: true, phone: true, country: true });
    if (needsOtp && otpStage !== "verified" && !nextErrors.phone) {
      nextErrors.phone = "Verify your number with the OTP to continue.";
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
      verifiedToken,
    });
    setSubmitting(false);

    if (result.ok) {
      setBookedOn(
        new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
      );
      setSentName(values.firstName.trim());
      return;
    }
    if (result.errors) setErrors(result.errors);
    setSubmitError(result.error ?? "We couldn't send your enquiry. Please try again.");
  };

  const bookAnother = () => {
    setValues(INITIAL);
    setTouched({});
    setErrors({});
    setSubmitError("");
    resetOtp();
    setSentName("");
  };

  const otpBoxes = Array.from({ length: OTP_LENGTH }, (_, index) => otp[index]?.trim() ?? "");
  const phoneError = errors.phone && touched.phone ? errors.phone : !otpOpen && otpError ? otpError : "";

  return (
    <form className={cn("ct-slip", sentName && "is-booked")} onSubmit={submit} noValidate>
      <div className="ct-slip-body" inert={Boolean(sentName)}>
        <header className="ct-slip-head">
          <div>
            <p className="ct-slip-brand">RMW Roadways</p>
            <p className="ct-slip-sub">Booking slip · Enquiry</p>
          </div>
          <p className="ct-slip-note">
            Fields marked <span aria-hidden>*</span>
            <span className="sr-only">with an asterisk</span> are required
          </p>
        </header>

        <div className="ct-fields">
          <label className={cn("ct-field ct-f-name", errors.firstName && touched.firstName && "has-error")}>
            <span className="ct-label">
              First name<span aria-hidden>*</span>
            </span>
            <input
              className="ct-input"
              name="firstName"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              onBlur={() => blur("firstName")}
              aria-invalid={Boolean(errors.firstName && touched.firstName)}
              required
            />
            {errors.firstName && touched.firstName ? <span className="ct-error">{errors.firstName}</span> : null}
          </label>
          <label className={cn("ct-field ct-f-name", errors.lastName && touched.lastName && "has-error")}>
            <span className="ct-label">
              Last name<span aria-hidden>*</span>
            </span>
            <input
              className="ct-input"
              name="lastName"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              onBlur={() => blur("lastName")}
              aria-invalid={Boolean(errors.lastName && touched.lastName)}
              required
            />
            {errors.lastName && touched.lastName ? <span className="ct-error">{errors.lastName}</span> : null}
          </label>
          <label className={cn("ct-field ct-f-name", errors.email && touched.email && "has-error")}>
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
              aria-invalid={Boolean(errors.email && touched.email)}
              required
            />
            {errors.email && touched.email ? <span className="ct-error">{errors.email}</span> : null}
          </label>

          <div className={cn("ct-field ct-phone ct-f-half", phoneError && "has-error")}>
            <label className="ct-label" htmlFor="ct-phone">
              Phone number<span aria-hidden>*</span>
            </label>
            <div className="ct-phone-row">
              <ContactSelect
                compact
                label="Country code"
                value={values.dial}
                options={DIAL_CODES}
                onChange={onDialChange}
              />
              <input
                id="ct-phone"
                className="ct-input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                name="phone"
                placeholder={needsOtp ? "10-digit mobile" : "Phone number"}
                value={values.phone}
                onChange={onPhoneChange}
                onBlur={() => blur("phone")}
                readOnly={phoneLocked}
                aria-invalid={Boolean(phoneError)}
                aria-describedby="ct-phone-help"
                required
              />
              {otpStage === "verified" ? (
                <span className="ct-verified">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                  Verified
                </span>
              ) : needsOtp ? (
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
              ) : null}
            </div>
            {phoneError ? (
              <span id="ct-phone-help" className="ct-error" role={otpError ? "alert" : undefined}>
                {phoneError}
              </span>
            ) : otpStage === "verified" ? (
              <span id="ct-phone-help" className="ct-help">
                Number verified.{" "}
                <button type="button" className="ct-link" onClick={resetOtp}>
                  Use a different number
                </button>
              </span>
            ) : (
              <span id="ct-phone-help" className={cn("ct-help", needsOtp && "sr-only")}>
                {needsOtp
                  ? "We'll text you a one-time code to confirm it's you."
                  : "We'll confirm international numbers by call."}
              </span>
            )}

            {otpOpen ? (
              <div className="ct-otp" role="group" aria-labelledby="ct-otp-label">
                <p id="ct-otp-label" className="ct-otp-title">
                  Enter the code <span>{otpMessage}</span>
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
            label="Country"
            required
            placeholder="Select your country"
            value={values.country}
            options={COUNTRIES.map((country) => country.name)}
            onChange={onCountryChange}
            error={errors.country && touched.country ? errors.country : undefined}
          />
          <ContactSelect
            className="ct-f-half"
            label="Reason for inquiry"
            required
            value={values.reason}
            options={INQUIRY_REASONS}
            onChange={(value) => update("reason", value)}
          />
          <ContactSelect
            className="ct-f-half"
            label="How did you hear about us?"
            value={values.heardFrom}
            options={HEARD_FROM}
            onChange={(value) => update("heardFrom", value)}
          />
        </div>

        <label className="ct-field ct-f-message">
          <span className="ct-label">Message (optional)</span>
          <textarea
            className="ct-input ct-textarea"
            name="message"
            rows={3}
            maxLength={2000}
            placeholder="Tell us about your brand, goals or timeline."
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
          />
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
            {submitting ? "Booking…" : "Book my consignment"}
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
            <p className="ct-help">We reply within one working day. No spam, ever.</p>
          )}
        </footer>
      </div>

      {sentName ? (
        <div className="ct-booked" role="status">
          <svg className="ct-stamp" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <path id="ct-stamp-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
            </defs>
            <circle cx="100" cy="100" r="94" className="ct-stamp-line is-thick" />
            <circle cx="100" cy="100" r="86" className="ct-stamp-line" />
            <circle cx="100" cy="100" r="56" className="ct-stamp-line" />
            <text className="ct-stamp-ring">
              <textPath href="#ct-stamp-ring" startOffset="0">
                RMW ROADWAYS ★ CONSIGNMENT BOOKED ★ NOIDA ★
              </textPath>
            </text>
            <path className="ct-stamp-tick" d="M76 96l17 17 32-36" />
            <text x="100" y="135" className="ct-stamp-date">
              {bookedOn}
            </text>
          </svg>

          <div className="ct-booked-body">
            <p className="ct-booked-kicker">
              <span className="ct-booked-tick" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              Consignment booked
            </p>
            <h2 ref={bookedRef} tabIndex={-1} className="ct-booked-title">
              Thank you, {sentName}!
            </h2>
            <p className="ct-booked-copy">
              Your enquiry form is filled and on the road. The right person from our team will call
              you within one working day.
            </p>
            <button type="button" className="ct-btn" onClick={bookAnother}>
              Send another enquiry
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
