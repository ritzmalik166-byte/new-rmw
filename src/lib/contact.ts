export const INQUIRY_REASONS = ["General Inquiry", "New Project", "RFP Submission", "Partnership"] as const;

export const COUNTRIES = [
  { name: "India", dial: "+91" },
  { name: "UAE", dial: "+971" },
  { name: "UK", dial: "+44" },
  { name: "Singapore", dial: "+65" },
  { name: "USA", dial: "+1" },
] as const;

export const HEARD_FROM = ["Search Engine", "Social Media", "Referral", "Advertisement", "Other"] as const;

export const DIAL_CODES = COUNTRIES.map((country) => country.dial);

/** OTP is sent through an Indian DLT gateway, so only +91 mobiles can be verified by SMS. */
export const OTP_DIAL_CODE = "+91";

export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 30;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function isIndianMobile(phone: string) {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isValidPhone(dial: string, phone: string) {
  if (dial === OTP_DIAL_CODE) return isIndianMobile(phone);
  return /^\d{6,14}$/.test(phone);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isValidName(name: string) {
  return /^[\p{L}][\p{L}\s.'-]{0,59}$/u.test(name);
}
