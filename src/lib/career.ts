export const CAREER_ROLES = [
  "UI/UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Marketing Executive",
  "Content Creator Lifestyle",
  "Video Editor - CGI Specialist",
  "Social Media Executive Spoc",
  "Managing Director's Personal Secretary",
  "Senior Video Editors",
  "Full Stack Developer",
  "AI Video Generation Artist",
  "Sales Executive - Media Agency",
  "Media Sales Manager",
  "Media Influencer Coordinator",
  "SEO Executive",
  "SEO Intern",
] as const;

export const CAREER_TEAMS = [
  "Media & Content",
  "Marketing & Strategy",
  "Design & Creative",
  "Video & Production",
  "Sales & Business",
] as const;

export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const RESUME_ACCEPT = RESUME_EXTENSIONS.join(",");
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const CAREER_UPLOAD_URL = "https://ritzmediaworld.com/api/upload-resume";
export const CAREER_ENQUIRY_URL = "https://ritzmediaworld.com/api/system-settings/contact-enquiry";

export function isCareerRole(value: string) {
  return CAREER_ROLES.includes(value as (typeof CAREER_ROLES)[number]);
}

export function resumeError(file: { name: string; size: number } | null) {
  if (!file || !file.size) return "Attach your resume.";
  const name = file.name.toLowerCase();
  if (!RESUME_EXTENSIONS.some((extension) => name.endsWith(extension))) return "Upload a PDF, DOC or DOCX file.";
  if (file.size > RESUME_MAX_BYTES) return "Keep your resume under 5 MB.";
  return "";
}

export function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
