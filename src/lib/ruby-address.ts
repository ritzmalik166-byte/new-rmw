/**
 * Ruby's answers come from the upstream chat service (CHAT_API_URL), whose knowledge still has the old office
 * address (402–404, 4th Floor, Tower A1). Until that is updated, every reply is passed through this fix so
 * visitors always see the current address. Safe to keep afterwards: it only touches the old address.
 */
export const RMW_ADDRESS = "7th Floor, Tower A2, Corporate Park, Sector 142, Noida 201305, Uttar Pradesh, India";

// "402–404, 4th Floor, Tower A1, Corporate Park, Sector 142, Greater Noida, Uttar Pradesh 201305, India" and
// the other orders/spellings the bot uses (Unit No. 404…, 4th floor Corporate Park Tower A1…, 402 - 404 …).
const OLD_FULL =
  /(?:Unit\s*(?:No\.?|no)?\s*,?\s*)?(?:40[24](?:\s*[–—-]\s*404)?\s*,?\s*)?4th\s+floor\b[^\n]{0,120}?Sector\s*142(?:\s*,?\s*(?:Greater\s+)?Noida)?(?:\s*,?\s*(?:Uttar\s+Pradesh|UP))?(?:\s*,?\s*(?:-\s*)?201305)?(?:\s*,?\s*India)?/gi;
const OLD_UNIT = /\b(?:Unit\s*(?:No\.?)?\s*)?402\s*[–—-]\s*404\b\s*,?\s*(?:4th\s+floor\s*,?\s*)?/gi;

export function fixRubyAddress(text: string): string {
  if (!/Tower\s*A1|402\s*[–—-]\s*404|4th\s+floor|Greater\s+Noida/i.test(text)) return text;
  let out = text.replace(OLD_FULL, RMW_ADDRESS).replace(OLD_UNIT, "7th Floor, ").replace(/Tower\s*A1\b/gi, "Tower A2");
  // The office is in Noida (Sector 142), not Greater Noida.
  if (/Sector\s*142/i.test(out)) out = out.replace(/Greater\s+Noida/gi, "Noida");
  return out;
}

/** Applies fixRubyAddress to every string inside a parsed JSON reply. */
export function fixRubyAddressDeep<T>(value: T): T {
  if (typeof value === "string") return fixRubyAddress(value) as T;
  if (Array.isArray(value)) return value.map(fixRubyAddressDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fixRubyAddressDeep(v)])) as T;
  }
  return value;
}
