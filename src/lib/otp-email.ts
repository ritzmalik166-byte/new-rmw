
const BRAND = {
  name: "Ritz Media World",
  site: "https://ritzmediaworld.com/",
  logo: "https://ritzmediaworld.com/logo.png",
  email: "info@ritzmediaworld.com",
  phones: [
    { label: "+91 7290002168", href: "tel:+917290002168" },
    { label: "+91 9220516777", href: "tel:+919220516777" },
  ],
  addressLines: [
    "402–404, 4th Floor, Corporate Park, Tower A1,",
    "Sector 142, Noida 201305",
  ],
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=402%E2%80%93404%2C%204th%20Floor%2C%20Corporate%20Park%2C%20Tower%20A1%2C%20Sector%20142%2C%20Noida%20201305",
  replyTime: "Within one working day",
  // Colours
  ink: "#1d1a3a",
  inkSoft: "#4a4766",
  gold: "#b8924a",
  goldLight: "#f6efe1",
  page: "#f3f1ec",
  muted: "#8a879c",
};

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildOtpEmail(otp: string, validMinutes = 10) {
  const code = escapeHtml(otp);
  const serif = "Georgia,'Times New Roman',serif";
  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";

  const subject = `${otp} is your ${BRAND.name} verification code`;

  const text = [
    `${BRAND.name} — Verify your enquiry`,
    "",
    `Your one-time verification code is: ${otp}`,
    `It is valid for ${validMinutes} minutes. Please do not share it with anyone.`,
    "",
    "If you didn't request this, you can safely ignore this email.",
    "",
    "—",
    BRAND.name,
    BRAND.addressLines.join(" "),
    `Call: ${BRAND.phones.map((p) => p.label).join(" / ")}`,
    `Email: ${BRAND.email}`,
    `Reply time: ${BRAND.replyTime}`,
    BRAND.site,
  ].join("\n");

  const phoneLinks = BRAND.phones
    .map(
      (p) =>
        `<a href="${p.href}" style="color:#ffffff;text-decoration:none;">${p.label}</a>`
    )
    .join(`<span style="color:${BRAND.gold};"> &nbsp;|&nbsp; </span>`);

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.page};-webkit-text-size-adjust:100%;">
  <!-- Preheader (inbox preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">
    Your verification code is ${code}. Valid for ${validMinutes} minutes.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.page}" style="background-color:${BRAND.page};">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

          <!-- Card -->
          <tr>
            <td bgcolor="#ffffff" style="background-color:#ffffff;border-radius:16px 16px 0 0;overflow:hidden;">

              <!-- Gold accent bar -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="5" bgcolor="${BRAND.gold}" style="height:5px;line-height:5px;font-size:0;background-color:${BRAND.gold};background-image:linear-gradient(90deg,${BRAND.ink},${BRAND.gold},${BRAND.ink});">&nbsp;</td></tr>
              </table>

              <!-- Logo -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:36px 32px 8px;">
                    <a href="${BRAND.site}" target="_blank" style="text-decoration:none;">
                      <img src="${BRAND.logo}" alt="${BRAND.name}" width="170" style="display:block;border:0;outline:none;text-decoration:none;width:170px;max-width:100%;height:auto;font-family:${serif};font-size:20px;color:${BRAND.ink};">
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:20px 40px 0;">
                    <p style="margin:0 0 10px;font-family:${sans};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${BRAND.gold};font-weight:700;">
                      Secure Verification
                    </p>
                    <h1 style="margin:0;font-family:${serif};font-size:28px;line-height:36px;font-weight:normal;color:${BRAND.ink};">
                      Verify your enquiry
                    </h1>
                    <p style="margin:16px 0 0;font-family:${sans};font-size:15px;line-height:24px;color:${BRAND.inkSoft};">
                      Thank you for reaching out to ${BRAND.name}. Please use the one-time code below to confirm your email address and complete your enquiry.
                    </p>
                  </td>
                </tr>

                <!-- OTP box -->
                <tr>
                  <td align="center" style="padding:28px 40px 8px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:400px;">
                      <tr>
                        <td align="center" bgcolor="${BRAND.goldLight}" style="background-color:${BRAND.goldLight};border:1px solid #e6d5b0;border-radius:12px;padding:22px 16px;">
                          <p style="margin:0 0 6px;font-family:${sans};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${BRAND.inkSoft};">
                            Your one-time code
                          </p>
                          <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:38px;line-height:46px;font-weight:700;letter-spacing:10px;color:${BRAND.ink};padding-left:10px;">
                            ${code}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:18px 40px 0;">
                    <p style="margin:0;font-family:${sans};font-size:14px;line-height:22px;color:${BRAND.inkSoft};">
                      This code is valid for <strong style="color:${BRAND.ink};">${validMinutes} minutes</strong>.
                    </p>
                  </td>
                </tr>

                <!-- Security note -->
                <tr>
                  <td style="padding:28px 40px 36px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="3" bgcolor="${BRAND.gold}" style="background-color:${BRAND.gold};width:3px;">&nbsp;</td>
                        <td style="padding:6px 0 6px 16px;font-family:${sans};font-size:13px;line-height:20px;color:${BRAND.inkSoft};">
                          <strong style="color:${BRAND.ink};">Keep it private.</strong>
                          Never share this code with anyone. Our team will never ask you for it.
                          If you didn&rsquo;t request this, you can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer / contact -->
          <tr>
            <td bgcolor="${BRAND.ink}" style="background-color:${BRAND.ink};border-radius:0 0 16px 16px;padding:32px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-family:${serif};font-size:18px;color:#ffffff;padding-bottom:4px;">
                    ${BRAND.name}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="40" height="2" bgcolor="${BRAND.gold}" style="width:40px;height:2px;line-height:2px;font-size:0;background-color:${BRAND.gold};">&nbsp;</td></tr></table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:${sans};font-size:13px;line-height:21px;color:#cfcde0;padding-bottom:14px;">
                    <span style="color:${BRAND.gold};font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Visit</span><br>
                    ${BRAND.addressLines.join("<br>")}<br>
                    <a href="${BRAND.mapUrl}" target="_blank" style="color:${BRAND.gold};text-decoration:none;font-weight:700;">Get directions &rarr;</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:${sans};font-size:13px;line-height:21px;color:#cfcde0;padding-bottom:14px;">
                    <span style="color:${BRAND.gold};font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Call</span><br>
                    ${phoneLinks}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:${sans};font-size:13px;line-height:21px;color:#cfcde0;padding-bottom:14px;">
                    <span style="color:${BRAND.gold};font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Email</span><br>
                    <a href="mailto:${BRAND.email}" style="color:#ffffff;text-decoration:none;">${BRAND.email}</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:${sans};font-size:13px;line-height:21px;color:#cfcde0;">
                    <span style="color:${BRAND.gold};font-weight:700;letter-spacing:1px;text-transform:uppercase;font-size:11px;">Reply time</span><br>
                    ${BRAND.replyTime}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Legal line -->
          <tr>
            <td align="center" style="padding:20px 16px 0;font-family:${sans};font-size:12px;line-height:18px;color:${BRAND.muted};">
              This is an automated message, please do not reply to it.<br>
              &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
              &nbsp;&middot;&nbsp;
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