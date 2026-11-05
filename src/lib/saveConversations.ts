import "server-only";

type ConversationMessage = {
  user_message: string;
  bot_reply: string;
  user_id: string | null;
};

export async function saveConversations(messages: ConversationMessage) {
  try {
    const response = await fetch(
      "https://rmw.ritzmediaworld.in/api/chatting",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: messages,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Conversation saving failed (${response.status}): ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving conversations:", error);
    return null;
  }
}