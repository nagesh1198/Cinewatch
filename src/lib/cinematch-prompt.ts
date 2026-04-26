import type { CineMatchRequest } from "@/lib/schemas";

const platformGroups = [
  "India-first: Disney+ Hotstar, JioCinema, SonyLIV, ZEE5, MX Player, Aha, Sun NXT, Manorama MAX, Hoichoi",
  "Global available in India: Netflix India, Amazon Prime Video, Apple TV+, Mubi, Lionsgate Play, DocuBay, EPIC ON, Hulu",
  "Major global platforms: Netflix, Amazon Prime Video, Disney+, Hulu, HBO Max, Paramount+, Peacock, Discovery+, BritBox, Shudder, Criterion Channel, Kanopy, Tubi, Pluto TV, Freevee",
  "Free or ad-supported: YouTube, Tubi, Pluto TV, Plex, Crackle, IMDb TV, Vudu Free",
  "Rent or buy: Google Play Movies, Apple TV / iTunes, Amazon Video, BookMyShow Stream, Hungama Play, Vudu, Microsoft Store, YouTube Movies",
];

export function buildCineMatchInstructions(todayLabel: string) {
  return `
CineMatch AI - ${todayLabel}

Find 5 perfect matches for user's mood. Use web search for current India streaming + global availability.

Language: "Any" = global titles. "Hindi" = Hindi only.

Score each: imdb, reddit_sentiment, mood_match, rewatchability, hidden_gem, final_match (1-10).

CRITICAL - poster_image MUST be a real, working URL:
- Search IMDb for "[movie title] poster" and extract the image URL
- Format: https://m.media-amazon.com/images/M/... (IMDb/Amazon CDN URLs work best)
- If poster unavailable, use empty string ""
- ALWAYS test URL format: must include full domain and file extension

Include: poster_image (working IMDb/Amazon URL), ratings, community buzz, streaming links.

Platforms: ${platformGroups.map((group) => group).join(" | ")}

Output: Valid JSON only.
`.trim();
}

export function buildCineMatchUserPrompt(request: CineMatchRequest) {
  const languageInstruction =
    request.languages.length === 1 && request.languages[0] === "Any"
      ? "Language: Any (global best matches)"
      : `Language: ${request.languages.join(", ")} (prefer these)`;

  return `
User request:
Mood: ${request.mood}
Energy: ${request.energy}
With: ${request.watchWith}
Time: ${request.time}
Format: ${request.format}
${languageInstruction}
Avoid: ${request.avoid || "None"}

Location: India - prioritize streaming availability.
`.trim();
}
