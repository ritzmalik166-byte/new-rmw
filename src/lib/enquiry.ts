export const ENQUIRY_URL = "https://ritzmediaworld.com/api/system-settings/contact-enquiry";

export type RemoteBody = Record<string, unknown> | null;

export async function postRemote(url: string, payload: FormData | Record<string, string>, tag: string) {
  const init: RequestInit =
    payload instanceof FormData
      ? { body: payload }
      : { body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } };
  try {
    const response = await fetch(url, { method: "POST", ...init, cache: "no-store", signal: AbortSignal.timeout(30_000) });
    const json = (await response.json().catch(() => null)) as RemoteBody;
    const ok =
      json?.success !== false &&
      json?.ok !== false &&
      (response.ok || json?.success === true || json?.ok === true || json?.status === "success");
    return { ok, status: response.status, body: json };
  } catch (error) {
    console.error(`[${tag}] request failed`, url, error);
    return { ok: false, status: 0, body: null as RemoteBody };
  }
}

export function remoteMessage(body: RemoteBody) {
  if (typeof body?.message === "string") return body.message;
  if (typeof body?.error === "string") return body.error;
  return "";
}
