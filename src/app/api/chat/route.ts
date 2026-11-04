import { NextResponse } from "next/server";

const CHAT_API_URL = "https://api.ritzmediaworld.in/api/v1/chat";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { message?: unknown }).message !== "string" ||
    !(body as { message: string }).message.trim()
  ) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ message: (body as { message: string }).message.trim() }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("[chat] upstream request failed", error);
    return NextResponse.json(
      { error: "The chatbot is temporarily unavailable." },
      { status: 502 },
    );
  }

  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
  });
}
