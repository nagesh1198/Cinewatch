import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";

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

  if (!Array.isArray(output)) {
    return sources;
  }

  for (const item of output) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const searchItem = item as {
      type?: string;
      results?: Array<{ title?: string; url?: string }>;
    };

    if (searchItem.type !== "web_search_call") {
      continue;
    }

    for (const source of searchItem.results ?? []) {
      if (!source.url || seen.has(source.url)) {
        continue;
      }

      seen.add(source.url);

      let domain = source.url;
      try {
        domain = new URL(source.url).hostname.replace(/^www\./, "");
      } catch {
        domain = source.url;
      }

      sources.push({
        title: source.title || domain,
        url: source.url,
        domain,
      });
    }
  }

  return sources;
}

export async function POST(request: Request) {
  let payload;

  try {
    const body = await request.json();
    payload = cineMatchRequestSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: "Please send a valid CineMatch request payload." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  // Return demo data for now (API calls disabled)
  // return NextResponse.json(buildDemoResponse(payload));
  
  // Uncomment below to enable live API calls

  if (!apiKey) {
    return NextResponse.json(buildDemoResponse(payload));
  }

  const client = new OpenAI({ apiKey });

  try {
    const response = await client.responses.parse({
      model: process.env.OPENAI_MODEL || "gpt-4o",
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

    const parsed = cineMatchResultSchema.parse(response.output_parsed);
    const sources = extractSources(response);

    return NextResponse.json({
      mode: "live",
      sources,
      result: parsed,
    });
  } catch (error) {
    console.error("CineMatch live search failed:", error);

    const fallback = buildDemoResponse(payload);
    fallback.notice =
      "Live web search failed, so CineMatch fell back to demo mode. Add a valid OPENAI_API_KEY and optional OPENAI_MODEL to enable live results.";

    return NextResponse.json(fallback);
  }
  
}
