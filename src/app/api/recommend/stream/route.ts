import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
  buildCineMatchInstructions,
  buildCineMatchUserPrompt,
} from "@/lib/cinematch-prompt";
import { buildDemoResponse } from "@/lib/demo-data";
import {
  cineMatchRequestSchema,
  cineMatchResultSchema,
  type CineMatchSource,
} from "@/lib/schemas";

export const runtime = "nodejs";

function formatSseEvent(event: string, payload: unknown) {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
}

function todayInIndia() {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

function extractSources(response: unknown): CineMatchSource[] {
  const seen = new Set<string>();
  const sources: CineMatchSource[] = [];
  const output =
    response && typeof response === "object" && "output" in response
      ? (response as { output?: unknown }).output
      : undefined;

  if (!Array.isArray(output)) return sources;

  for (const item of output) {
    if (!item || typeof item !== "object") continue;

    const searchItem = item as {
      type?: string;
      results?: Array<{ title?: string; url?: string }>;
    };

    if (searchItem.type !== "web_search_call") continue;

    for (const source of searchItem.results ?? []) {
      if (!source.url || seen.has(source.url)) continue;
      seen.add(source.url);

      let domain = source.url;
      try {
        domain = new URL(source.url).hostname.replace(/^www\./, "");
      } catch {
        domain = source.url;
      }

      sources.push({ title: source.title || domain, url: source.url, domain });
    }
  }

  return sources;
}

const sseHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
};

export async function POST(request: Request) {
  let payload;

  try {
    const body = await request.json();
    payload = cineMatchRequestSchema.parse(body);
  } catch {
    return new Response(
      JSON.stringify({ error: "Please send a valid CineMatch request payload." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const encoder = new TextEncoder();

  if (!apiKey) {
    const fallback = buildDemoResponse(payload);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(formatSseEvent("done", fallback)));
        controller.close();
      },
    });
    return new Response(stream, { status: 200, headers: sseHeaders });
  }

  const client = new OpenAI({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(encoder.encode(formatSseEvent(event, data)));

      try {
        const openaiStream = await client.responses.create({
          model: process.env.OPENAI_MODEL || "gpt-4o",
          stream: true,
          instructions: buildCineMatchInstructions(todayInIndia()),
          input: buildCineMatchUserPrompt(payload),
          max_output_tokens: 5000,
          include: ["web_search_call.results"],
          tools: [
            {
              type: "web_search",
              user_location: {
                type: "approximate",
                country: "IN",
                region: "India",
                timezone: "Asia/Kolkata",
              },
            },
          ],
          text: {
            format: zodTextFormat(cineMatchResultSchema, "cinematch_result"),
          },
        });

        let fullText = "";
        let completedResponse: unknown = null;

        for await (const event of openaiStream) {
          const e = event as {
            type: string;
            delta?: string;
            text?: { value?: string };
            item?: { type?: string };
            response?: unknown;
          };

          if (e.type === "response.output_item.added" && e.item?.type === "web_search_call") {
            send("delta", { text: "Searching the web for current availability and reviews…" });
          } else if (e.type === "response.output_text.delta" && e.delta) {
            fullText += e.delta;
          } else if (e.type === "response.output_text.done" && e.text?.value) {
            fullText = e.text.value;
          } else if (e.type === "response.completed") {
            completedResponse = e.response;
          }
        }

        const completedResp = completedResponse as { output_parsed?: unknown } | null;
        const raw = completedResp?.output_parsed ?? JSON.parse(fullText);
        const parsed = cineMatchResultSchema.parse(raw);
        console.log("CineMatch parsed result:", completedResponse);
        const sources = extractSources(completedResponse);

        send("done", { mode: "live", sources, result: parsed });
      } catch (error) {
        console.error("CineMatch streaming error:", error);
        const fallback = buildDemoResponse(payload);
        fallback.notice =
          "Live web search failed, so CineMatch fell back to demo mode. Add a valid OPENAI_API_KEY and optional OPENAI_MODEL to enable live results.";
        send("done", fallback);
      }

      controller.close();
    },
  });

  return new Response(stream, { status: 200, headers: sseHeaders });
}
