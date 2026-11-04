import { NextResponse } from "next/server";

/* Ruby's conversations are stored by the old site's backend so they keep
   landing in the same admin panel (Admin → Chats). */
const CHAT_LOG_URL = "https://rmw.ritzmediaworld.in/api/chatting";

type ChatLog = { user_message: string; bot_reply: string; user_id: string };

function readLog(body: unknown): ChatLog | null {
  const message = (body as { message?: Partial<ChatLog> } | null)?.message;
  if (!message) return null;
  const { user_message, bot_reply, user_id } = message;
  if (![user_message, bot_reply, user_id].every((v) => typeof v === "string" && v.trim())) {
    return null;
  }
  return { user_message: user_message!, bot_reply: bot_reply!, user_id: user_id! };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const log = readLog(body);
  if (!log) {
    return NextResponse.json({ error: "user_message, bot_reply and user_id are required." }, { status: 400 });
  }

  // The backend records the visitor's IP, so pass the real one along.
  const forwardedFor =
    request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;

  try {
    const response = await fetch(CHAT_LOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(forwardedFor ? { "X-Forwarded-For": forwardedFor } : {}),
      },
      body: JSON.stringify({ message: log }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
    });
  } catch (error) {
    console.error("[chat/log] upstream request failed", error);
    return NextResponse.json({ error: "Chat history is temporarily unavailable." }, { status: 502 });
  }
}
