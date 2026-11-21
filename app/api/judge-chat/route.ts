// POST /api/judge-chat — the "Ask the Judge" chatbot.
// Browser → this route → Gemini (fallback: Groq), with the full transcript + verdict
// in the system prompt → { reply }
import { judgeChat } from "@/lib/ai/agents";
import { errorResponse, readBody } from "@/lib/ai/respond";
import { chatRequest } from "@/lib/ai/schemas";
import { compactScores, compactTranscript } from "@/lib/debate/transcript";

export const maxDuration = 60;
const MAX_QUESTION = 500;
const MAX_HISTORY = 12; // only the latest messages are sent, to save tokens

export async function POST(request: Request) {
  const body = await readBody(request, chatRequest, "chat");
  if ("response" in body) return body.response;
  const { topic, transcript, scores, verdict, messages } = body.data;

  // Invalid input: the last message must be a non-empty user question of sensible length.
  const last = messages[messages.length - 1];
  if (last.role !== "user" || !last.content.trim() || last.content.length > MAX_QUESTION) {
    return Response.json({ error: "invalid_input" }, { status: 400 });
  }
  const history = messages.slice(-MAX_HISTORY);
  while (history.length && history[0].role !== "user") history.shift();

  try {
    const { text, provider } = await judgeChat({
      topic,
      transcript: compactTranscript(transcript),
      scoresText: compactScores(scores),
      verdictJson: JSON.stringify(verdict).slice(0, 4000),
      messages: history,
    });
    return Response.json({ reply: text.trim(), provider });
  } catch (error) {
    return errorResponse(error);
  }
}
