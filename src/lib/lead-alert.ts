
export const LEAD_ALERT_TO = process.env.LEAD_ALERT_TO;

export interface LeadInfo {
  email: string;
  name?: string;
  enquiry?: string;
  message?: string;
  number?: string;
}

const BRAND = {
  name: "Ritz Media World",
  site: "https://ritzmediaworld.com/",
  logo: "https://ritzmediaworld.com/logo.png",
  ink: "#1d1a3a",
  inkSoft: "#4a4766",
  gold: "#b8924a",
  goldLight: "#f6efe1",
  page: "#f3f1ec",
  line: "#ece8df",
  muted: "#8a879c",
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const clean = (s?: string) => (s ?? "").trim();
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export function buildLeadAlertEmail(lead: LeadInfo) {
  const email = clean(lead.email);
  const name = clean(lead.name);
  const enquiry = clean(lead.enquiry);
  const message = clean(lead.message);
  const phone = clean(lead.number);
  console.log("Lead Alert Recevied ", email, name, enquiry, message, phone);


  const serif = "Georgia,'Times New Roman',serif";
  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";

  const when = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const subject = oneLine(`New enquiry OTP requested: ${name || email}${enquiry ? ` (${enquiry})` : ""}`);

  const text = [
    "New enquiry: OTP verification requested",
    `Time (IST): ${when}`,
    "",
    `Name: ${name || "Not provided"}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Enquiry: ${enquiry || "Not provided"}`,
    "",
    "Message:",
    message || "Not provided",
    "",
    "Status: OTP sent, awaiting verification. The lead is not verified yet.",
  ].join("\n");

  const telHref = phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "";

  const notProvided = `<span style="color:${BRAND.muted};font-style:italic;">Not provided</span>`;

  const row = (label: string, valueHtml: string, last = false) => `
    <tr>
      <td valign="top" width="120" style="width:120px;padding:14px 0;${last ? "" : `border-bottom:1px solid ${BRAND.line};`}font-family:${sans};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.gold};font-weight:700;">${label}</td>
      <td valign="top" style="padding:14px 0;${last ? "" : `border-bottom:1px solid ${BRAND.line};`}font-family:${sans};font-size:15px;line-height:22px;color:${BRAND.ink};">${valueHtml}</td>
    </tr>`;

  const nameHtml = name ? esc(name) : notProvided;
  const emailHtml = `<a href="mailto:${encodeURI(email)}" style="color:${BRAND.ink};text-decoration:underline;">${esc(email)}</a>`;
  const phoneHtml = phone
    ? `<a href="${esc(telHref)}" style="color:${BRAND.ink};text-decoration:underline;">${esc(phone)}</a>`
    : notProvided;
  const enquiryHtml = enquiry
    ? `<span style="display:inline-block;background-color:${BRAND.goldLight};border:1px solid #e6d5b0;border-radius:20px;padding:3px 12px;font-size:13px;">${esc(enquiry)}</span>`
    : notProvided;

  const messageHtml = message
    ? `<div style="font-family:${sans};font-size:14px;line-height:23px;color:${BRAND.inkSoft};white-space:pre-wrap;word-break:break-word;">${esc(message)}</div>`
    : notProvided;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.page};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">
    ${esc(name || email)} requested an OTP${enquiry ? ` for ${esc(enquiry)}` : ""}. Verification pending.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.page}" style="background-color:${BRAND.page};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:16px;overflow:hidden;">

              <!-- accent bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="5" bgcolor="${BRAND.gold}" style="height:5px;line-height:5px;font-size:0;background-color:${BRAND.gold};background-image:linear-gradient(90deg,${BRAND.ink},${BRAND.gold},${BRAND.ink});">&nbsp;</td></tr>
              </table>

              <!-- header -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:32px 32px 4px;">
                    <img src="${BRAND.logo}" alt="${BRAND.name}" width="150" style="display:block;border:0;width:150px;max-width:100%;height:auto;font-family:${serif};font-size:18px;color:${BRAND.ink};">
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:20px 40px 0;">
                    <p style="margin:0 0 10px;font-family:${sans};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${BRAND.gold};font-weight:700;">
                      Lead Alert
                    </p>
                    <h1 style="margin:0;font-family:${serif};font-size:26px;line-height:34px;font-weight:normal;color:${BRAND.ink};">
                      New enquiry, OTP requested
                    </h1>
                    <p style="margin:12px 0 0;font-family:${sans};font-size:14px;line-height:22px;color:${BRAND.inkSoft};">
                      Someone just started the verification process on your website. Details below.
                    </p>
                  </td>
                </tr>

                <!-- status pill -->
                <tr>
                  <td align="center" style="padding:20px 40px 4px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="${BRAND.goldLight}" style="background-color:${BRAND.goldLight};border:1px solid #e6d5b0;border-radius:20px;padding:6px 16px;font-family:${sans};font-size:12px;color:${BRAND.ink};">
                          <strong>Status:</strong> OTP sent &middot; awaiting verification
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- details -->
                <tr>
                  <td style="padding:20px 40px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BRAND.line};">
                      ${row("Name", nameHtml)}
                      ${row("Email", emailHtml)}
                      ${row("Phone", phoneHtml)}
                      ${row("Enquiry", enquiryHtml)}
                      ${row("Received", esc(when) + ` <span style="color:${BRAND.muted};font-size:12px;">IST</span>`, true)}
                    </table>
                  </td>
                </tr>

                <!-- message -->
                <tr>
                  <td style="padding:12px 40px 8px;">
                    <p style="margin:0 0 8px;font-family:${sans};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.gold};font-weight:700;">Message</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="3" bgcolor="${BRAND.gold}" style="width:3px;background-color:${BRAND.gold};">&nbsp;</td>
                        <td bgcolor="#faf9f6" style="background-color:#faf9f6;padding:14px 18px;">${messageHtml}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- actions -->
                <tr>
                  <td align="center" style="padding:24px 40px 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td bgcolor="${BRAND.ink}" style="background-color:${BRAND.ink};border-radius:8px;">
                          <a href="mailto:${encodeURI(email)}" style="display:inline-block;padding:12px 26px;font-family:${sans};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Email ${esc(name || "the lead")}</a>
                        </td>
                        ${
                          phone
                            ? `<td width="10">&nbsp;</td>
                        <td style="border:1px solid ${BRAND.ink};border-radius:8px;">
                          <a href="${esc(telHref)}" style="display:inline-block;padding:11px 26px;font-family:${sans};font-size:14px;font-weight:700;color:${BRAND.ink};text-decoration:none;">Call</a>
                        </td>`
                            : ""
                        }
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- caution -->
                <tr>
                  <td style="padding:12px 40px 34px;">
                    <p style="margin:0;font-family:${sans};font-size:12px;line-height:19px;color:${BRAND.muted};text-align:center;">
                      This lead has <strong>not</strong> verified their email yet. Details are exactly as typed by the visitor, so treat them with care until verified.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 16px 0;font-family:${sans};font-size:12px;line-height:18px;color:${BRAND.muted};">
              Internal notification &middot; ${BRAND.name}<br>
              <a href="${BRAND.site}" target="_blank" style="color:${BRAND.muted};text-decoration:underline;">ritzmediaworld.com</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}