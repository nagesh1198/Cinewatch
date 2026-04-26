"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import {
  Brain,
  Clapperboard,
  Copy,
  Film,
  HeartHandshake,
  LoaderCircle,
  MonitorPlay,
  MoonStar,
  Popcorn,
  Search,
  Sparkles,
  Ticket,
  Tv,
  Users,
} from "lucide-react";

import type {
  CineMatchApiResponse,
  CineMatchRecommendation,
  CineMatchRequest,
} from "@/lib/schemas";

const quickPrompts = [
  "I want something comforting after a rough week, funny but not dumb, and ideally easy to watch alone.",
  "Need a high-energy watch for friends tonight. No slow burn, no homework, just something that absolutely lands.",
  "I'm in a reflective mood and want a smart series that feels emotionally real, not just prestige for the sake of it.",
];

const watchWithOptions = [
  { value: "alone", label: "Alone", icon: MoonStar },
  { value: "partner", label: "Partner", icon: HeartHandshake },
  { value: "friends", label: "Friends", icon: Users },
  { value: "family", label: "Family", icon: Tv },
] as const satisfies ReadonlyArray<{
  value: CineMatchRequest["watchWith"];
  label: string;
  icon: typeof MoonStar;
}>;

const energyOptions = [
  { value: "brain-off", label: "Brain-off" },
  { value: "balanced", label: "Balanced" },
  { value: "dialed-in", label: "Dialed in" },
] as const satisfies ReadonlyArray<{
  value: CineMatchRequest["energy"];
  label: string;
}>;

const formatOptions = [
  { value: "movie", label: "Movie" },
  { value: "series", label: "Series" },
  { value: "anime", label: "Anime" },
  { value: "documentary", label: "Doc" },
  { value: "anything", label: "Anything" },
] as const satisfies ReadonlyArray<{
  value: CineMatchRequest["format"];
  label: string;
}>;

const timeOptions = [
  { value: "under-90", label: "Under 90 min" },
  { value: "movie-night", label: "Movie night" },
  { value: "long-haul", label: "Long film" },
  { value: "binge", label: "Binge me" },
] as const satisfies ReadonlyArray<{
  value: CineMatchRequest["time"];
  label: string;
}>;

const languageOptions = ["Any", "English", "Hindi", "Tamil", "Telugu", "Korean", "Japanese"];

const initialForm: CineMatchRequest = {
  mood: quickPrompts[0],
  energy: "balanced",
  watchWith: "alone",
  time: "movie-night",
  format: "anything",
  languages: ["Any"],
  avoid: "",
};

function isHttpUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

function formatScore(value: number) {
  return value.toFixed(1);
}

function scoreTone(value: number) {
  if (value >= 8.5) return "text-[var(--accent-green)]";
  if (value >= 7) return "text-[var(--accent-teal)]";
  return "text-[var(--accent-coral)]";
}

function ListSection({
  title,
  items,
  empty,
}: {
  title: string;
  items: Array<{ platform: string; url: string } & Record<string, string>>;
  empty: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        {title}
      </p>
      {items.length ? (
        <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
          {items.map((item) => (
            <li key={`${title}-${item.platform}-${item.url}`}>
              <a
                className="inline-flex items-center gap-2 font-medium text-[var(--ink)] transition hover:text-[var(--accent-coral)]"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <Ticket className="h-4 w-4" />
                <span>{item.platform}</span>
              </a>
              {"plan" in item ? <span className="ml-2 text-[var(--muted)]">{item.plan}</span> : null}
              {"price" in item ? (
                <span className="ml-2 text-[var(--muted)]">{item.price}</span>
              ) : null}
              {"note" in item ? <span className="ml-2 text-[var(--muted)]">{item.note}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--muted)]">{empty}</p>
      )}
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: CineMatchRecommendation;
}) {
  return (
    <article className="rounded-[8px] border border-[var(--line)] bg-white/85 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-ink)] text-sm font-semibold text-white">
              {recommendation.rank}
            </span>
            <div>
              <h3 className="font-display text-2xl leading-none text-[var(--ink)]">
                {recommendation.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {recommendation.year} • {recommendation.type} • {recommendation.language}
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--ink-soft)]">
            {recommendation.genre.join(" • ")} • {recommendation.runtime_or_seasons}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            Final Match
          </p>
          <p className={`text-3xl font-semibold ${scoreTone(recommendation.scores.final_match)}`}>
            {formatScore(recommendation.scores.final_match)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div className="grid gap-3 lg:grid-cols-[80px,1fr]">
          <div className="lg:order-first self-start w-[80px]">
            {recommendation.poster_image ? (
              <img
                src={recommendation.poster_image}
                alt={`${recommendation.title} poster`}
                className="w-full rounded-[6px] object-cover shadow-[var(--soft-shadow)]"
                style={{ aspectRatio: "200/300" }}
              />
            ) : (
              <div className="w-full rounded-[6px] bg-gradient-to-br from-[var(--muted)] to-[var(--ink-soft)] flex items-center justify-center shadow-[var(--soft-shadow)]" style={{ aspectRatio: "2/3" }}>
                <Film className="w-5 h-5 text-[var(--ink)]" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-[15px] leading-7 text-[var(--ink)]">
              {recommendation.why_perfect_for_you}
            </p>

            <div className="space-y-2 text-sm text-[var(--ink-soft)]">
              <p>
                <span className="font-semibold text-[var(--ink)]">Community pulse:</span>{" "}
                {recommendation.reddit_sentiment}. {recommendation.reddit_quote}
              </p>
              <p>
                <span className="font-semibold text-[var(--ink)]">Best watched:</span>{" "}
                {recommendation.best_watched}
              </p>
              <p>
                <span className="font-semibold text-[var(--ink)]">Similar to:</span>{" "}
                {recommendation.similar_to.join(", ")}
              </p>
              <p>
                <span className="font-semibold text-[var(--ink)]">Heads up:</span>{" "}
                {recommendation.trigger_warning} • {recommendation.age_rating}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ListSection
            title="Free"
            items={recommendation.watch_now.free}
            empty="No free India option verified."
          />
          <ListSection
            title="Subscription"
            items={recommendation.watch_now.subscription}
            empty="No subscription option verified."
          />
          <ListSection
            title="Rent"
            items={recommendation.watch_now.rent}
            empty="No rental option verified."
          />
          <ListSection
            title="Buy"
            items={recommendation.watch_now.buy}
            empty="No purchase option verified."
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--line)] pt-4 text-sm text-[var(--ink-soft)]">
        <span>IMDb {recommendation.imdb_rating}</span>
        <span>RT Critics {recommendation.rotten_tomatoes_critics}</span>
        <span>RT Audience {recommendation.rotten_tomatoes_audience}</span>
        <span>IMDb score {recommendation.scores.imdb}/10</span>
        <span>Rewatch {recommendation.scores.rewatchability}/10</span>
        <span>Hidden gem {recommendation.scores.hidden_gem}/10</span>
      </div>

      <p className="mt-3 text-sm text-[var(--muted)]">
        {recommendation.watch_now.not_available_note}
      </p>
    </article>
  );
}

export function CineMatchApp() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<CineMatchApiResponse | null>(null);
  const [error, setError] = useState("");
  const [view, setView] = useState<"guide" | "json">("guide");
  const [isPending, startTransition] = useTransition();
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const rawJson = result ? JSON.stringify(result, null, 2) : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStreamingText("");
    setResult(null);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/recommend/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start CineMatch stream");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventType = "";

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7); // Remove "event: " prefix
          } else if (line.startsWith("data: ")) {
            const dataStr = line.slice(6); // Remove "data: " prefix

            if (eventType === "delta") {
              // Delta events contain JSON with a text field
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  setStreamingText((prev) => prev + data.text);
                }
              } catch (parseError) {
                console.error("Failed to parse delta event:", parseError);
              }
            } else if (eventType === "done" || eventType === "error") {
              // Done and error events contain JSON
              try {
                const data = JSON.parse(dataStr);

                if (data.error || eventType === "error") {
                  setError(data.message || data.error || "Streaming error occurred");
                  setIsStreaming(false);
                  return;
                }

                if (data.result) {
                  startTransition(() => {
                    setResult(data);
                    setView("guide");
                  });
                  setIsStreaming(false);
                  return;
                }
              } catch (parseError) {
                console.error("Failed to parse SSE data:", parseError);
              }
            }
            // Reset event type for next event
            eventType = "";
          }
        }
      }
    } catch (submissionError) {
      setIsStreaming(false);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "CineMatch hit an unexpected error."
      );
    }
  }

  function toggleLanguage(language: string) {
    setForm((current) => {
      if (language === "Any") {
        return { ...current, languages: ["Any"] };
      }

      const withoutAny = current.languages.filter((item) => item !== "Any");
      const exists = withoutAny.includes(language);
      const next = exists
        ? withoutAny.filter((item) => item !== language)
        : [...withoutAny, language];

      return {
        ...current,
        languages: next.length ? next : ["Any"],
      };
    });
  }

  async function copyJson() {
    if (!rawJson) {
      return;
    }

    await navigator.clipboard.writeText(rawJson);
  }

  const spotlight = result?.result.on_right_now;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <header className="grid gap-5 border-b border-[var(--line)] pb-5 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              <Clapperboard className="h-4 w-4" />
              CineMatch
            </div>
            <div className="max-w-3xl space-y-3">
              <h1 className="font-display text-4xl leading-[0.95] text-[var(--ink)] sm:text-5xl">
                Mood-first picks with real watch-now routes for India.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
                Describe tonight’s vibe, choose how much brainpower you have left, and
                CineMatch will turn that into a ranked watch guide with platform links,
                pricing notes, and a raw JSON view.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-[8px] border border-[var(--line)] bg-white/70 p-4 shadow-[var(--soft-shadow)] backdrop-blur sm:grid-cols-3">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Checks
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink)]">
                Reddit, IMDb, Rotten Tomatoes, Letterboxd, X, and official platform pages.
              </p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Platforms
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink)]">
                Netflix, Hotstar, Prime Video, JioCinema, SonyLIV, Mubi, YouTube, and more.
              </p>
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                Output
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink)]">
                A ranked top five, instant watch link, and copy-ready JSON for downstream use.
              </p>
            </div>
          </div>
        </header>

        <main className="mt-6 grid flex-1 gap-6 xl:items-start xl:grid-cols-[430px,minmax(0,1fr)]">
          <aside className="xl:self-start">
            <form
              className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Prompt
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-[var(--ink)]">
                    Build tonight’s queue
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-gold-soft)] px-3 py-1 text-xs font-semibold text-[var(--ink)]">
                  <Search className="h-4 w-4" />
                  India-first
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    Mood or situation
                  </span>
                  <textarea
                    className="min-h-36 w-full rounded-[8px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-coral)] focus:ring-2 focus:ring-[var(--accent-coral-soft)]"
                    value={form.mood}
                    minLength={10}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, mood: event.target.value }))
                    }
                    placeholder="I'm tired, want something warm and funny, and I do not want a bleak ending."
                  />
                </label>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">Quick starts</span>
                  <div className="grid gap-2">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="rounded-[8px] border border-[var(--line)] bg-[var(--panel)] px-3 py-3 text-left text-sm leading-6 text-[var(--ink-soft)] transition hover:border-[var(--accent-coral)] hover:text-[var(--ink)]"
                        onClick={() => setForm((current) => ({ ...current, mood: prompt }))}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">Who’s watching</span>
                  <div className="grid grid-cols-2 gap-2">
                    {watchWithOptions.map((option) => {
                      const Icon = option.icon;
                      const active = form.watchWith === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`inline-flex items-center justify-center gap-2 rounded-[8px] border px-3 py-3 text-sm font-medium transition ${
                            active
                              ? "border-[var(--accent-coral)] bg-[var(--accent-coral-soft)] text-[var(--ink)]"
                              : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-soft)] hover:border-[var(--accent-coral)]"
                          }`}
                          onClick={() =>
                            setForm((current) => ({ ...current, watchWith: option.value }))
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">Energy</span>
                  <div className="grid grid-cols-3 gap-2">
                    {energyOptions.map((option) => {
                      const active = form.energy === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`rounded-[8px] border px-3 py-3 text-sm font-medium transition ${
                            active
                              ? "border-[var(--accent-teal)] bg-[var(--accent-teal-soft)] text-[var(--ink)]"
                              : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-soft)] hover:border-[var(--accent-teal)]"
                          }`}
                          onClick={() =>
                            setForm((current) => ({ ...current, energy: option.value }))
                          }
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Time</span>
                    <div className="relative">
                      <MonitorPlay className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                      <select
                        className="w-full appearance-none rounded-[8px] border border-[var(--line)] bg-[var(--panel)] py-3 pl-10 pr-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-teal)] focus:ring-2 focus:ring-[var(--accent-teal-soft)]"
                        value={form.time}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            time: event.target.value as CineMatchRequest["time"],
                          }))
                        }
                      >
                        {timeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-[var(--ink)]">Format</span>
                    <div className="relative">
                      <Film className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                      <select
                        className="w-full appearance-none rounded-[8px] border border-[var(--line)] bg-[var(--panel)] py-3 pl-10 pr-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent-teal)] focus:ring-2 focus:ring-[var(--accent-teal-soft)]"
                        value={form.format}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            format: event.target.value as CineMatchRequest["format"],
                          }))
                        }
                      >
                        {formatOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">Languages</span>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((language) => {
                      const active = form.languages.includes(language);
                      return (
                        <button
                          key={language}
                          type="button"
                          className={`rounded-[999px] border px-3 py-2 text-sm font-medium transition ${
                            active
                              ? "border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] text-[var(--ink)]"
                              : "border-[var(--line)] bg-[var(--panel)] text-[var(--ink-soft)] hover:border-[var(--accent-gold)]"
                          }`}
                          onClick={() => toggleLanguage(language)}
                        >
                          {language}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--ink)]">
                    Avoid if possible
                  </span>
                  <input
                    className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent-coral)] focus:ring-2 focus:ring-[var(--accent-coral-soft)]"
                    value={form.avoid}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, avoid: event.target.value }))
                    }
                    placeholder="bleak endings, gore, very slow pacing"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--accent-ink)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-coral)] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isPending || isStreaming || !form.mood.trim()}
                >
                  {isPending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Find my top 5
                </button>

                <p className="text-xs leading-6 text-[var(--muted)]">
                  With an `OPENAI_API_KEY`, this hits live web search for current availability.
                  Without one, the app falls back to a polished demo mode so the interface still
                  works end to end.
                </p>

                {error ? (
                  <p className="rounded-[8px] border border-[var(--accent-coral)] bg-[var(--accent-coral-soft)] px-3 py-3 text-sm text-[var(--ink)]">
                    {error}
                  </p>
                ) : null}
              </div>
            </form>
          </aside>

          <section className="space-y-5">
            <div className="relative overflow-hidden rounded-[8px] border border-[var(--line)] bg-[var(--accent-ink)] text-white shadow-[var(--soft-shadow)]">
              <Image
                src="/cinematch-backdrop.png"
                alt="Cinematic living room backdrop"
                fill
                priority
                sizes="(max-width: 1279px) 100vw, 70vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(12,20,16,0.92),rgba(12,20,16,0.58),rgba(12,20,16,0.4))]" />
              <div className="relative grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:py-8">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                    <Popcorn className="h-4 w-4" />
                    {result?.mode === "live" ? "Live web search" : "Ready to recommend"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                      On right now
                    </p>
                    <h2 className="mt-2 font-display text-4xl leading-none text-white sm:text-5xl">
                      {spotlight?.title || "Tell me the mood and I’ll narrow the field fast."}
                    </h2>
                  </div>
                  <p className="max-w-xl text-base leading-7 text-white/82">
                    {spotlight?.tagline ||
                      "CineMatch is set up to translate a messy feeling into something watchable tonight, then show you exactly where the title lives across Indian platforms."}
                  </p>
                  {spotlight ? (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/84">
                      <span>{spotlight.platform}</span>
                      <span>{spotlight.imdb}</span>
                      {isHttpUrl(spotlight.streaming_url) ? (
                        <a
                          className="inline-flex items-center gap-2 rounded-[8px] border border-white/18 bg-white/10 px-3 py-2 font-medium text-white transition hover:bg-white/18"
                          href={spotlight.streaming_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Ticket className="h-4 w-4" />
                          Watch route
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3 self-end">
                  <div className="rounded-[8px] border border-white/12 bg-black/24 p-4 backdrop-blur">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                      Search sweep
                    </p>
                    <div className="mt-3 grid gap-2 text-sm text-white/82 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Reddit mood match
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        IMDb + RT checks
                      </div>
                      <div className="flex items-center gap-2">
                        <Tv className="h-4 w-4" />
                        India platform sweep
                      </div>
                      <div className="flex items-center gap-2">
                        <Film className="h-4 w-4" />
                        Free / rent / buy routes
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[8px] border border-white/12 bg-black/24 p-4 backdrop-blur">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                      Best first prompt
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/82">
                      “I’m mentally fried, watching with my partner, want something sharp but not
                      heavy, and please avoid a bleak ending.”
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {result?.notice ? (
              <div className="rounded-[8px] border border-[var(--accent-gold)] bg-[var(--accent-gold-soft)] px-4 py-3 text-sm text-[var(--ink)]">
                {result.notice}
              </div>
            ) : null}

            {isPending && !isStreaming && !streamingText ? (
              <div className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
                <div className="flex items-center gap-3 text-[var(--ink)]">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Searching Reddit, IMDb, Rotten Tomatoes, platform catalogs, and current India
                  streaming routes.
                </div>
              </div>
            ) : null}

            {isStreaming || streamingText ? (
              <div className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
                <div className="flex items-center gap-3 text-[var(--ink)]">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--ink)] mb-2">
                      Building your CineMatch recommendations...
                    </p>
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                      {streamingText}
                      <span className="animate-pulse">|</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {result ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                      Mood analysis
                    </p>
                    <p className="mt-1 max-w-3xl text-base leading-7 text-[var(--ink)]">
                      {result.result.mood_analysis}
                    </p>
                  </div>

                  <div className="inline-flex rounded-[8px] border border-[var(--line)] bg-white/76 p-1 shadow-[var(--soft-shadow)] backdrop-blur">
                    <button
                      type="button"
                      className={`rounded-[6px] px-3 py-2 text-sm font-medium transition ${
                        view === "guide"
                          ? "bg-[var(--accent-ink)] text-white"
                          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                      }`}
                      onClick={() => setView("guide")}
                    >
                      Guide view
                    </button>
                    <button
                      type="button"
                      className={`rounded-[6px] px-3 py-2 text-sm font-medium transition ${
                        view === "json"
                          ? "bg-[var(--accent-ink)] text-white"
                          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                      }`}
                      onClick={() => setView("json")}
                    >
                      JSON view
                    </button>
                  </div>
                </div>

                {view === "guide" ? (
                  <div className="space-y-4">
                    {result.result.recommendations.map((recommendation) => (
                      <RecommendationCard
                        key={`${recommendation.rank}-${recommendation.title}`}
                        recommendation={recommendation}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[8px] border border-[var(--line)] bg-[#111814] shadow-[var(--soft-shadow)]">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-white/72">
                      <span>Copy-ready JSON payload</span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-[6px] border border-white/12 bg-white/8 px-3 py-2 font-medium text-white transition hover:bg-white/14"
                        onClick={copyJson}
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm leading-7 text-[#dce8d5]">
                      {rawJson}
                    </pre>
                  </div>
                )}

                <div className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                        Sources
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">
                        {result.sources.length
                          ? "Live web sources captured from the search sweep."
                          : "Demo mode does not include live source capture."}
                      </p>
                    </div>
                  </div>

                  {result.sources.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.sources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm text-[var(--ink)] transition hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral)]"
                        >
                          <span className="font-medium">{source.domain}</span>
                          <span className="text-[var(--muted)]">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Result shape
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                    The backend returns structured JSON with one hero pick and five ranked
                    recommendations, each carrying platform instructions for free, subscription,
                    rent, and buy routes.
                  </p>
                </div>
                <div className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    India-first sweep
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                    The live route is tuned for Netflix India, Hotstar, Prime Video, JioCinema,
                    SonyLIV, Mubi, YouTube, and the long tail of local platforms named in your
                    original product brief.
                  </p>
                </div>
                <div className="rounded-[8px] border border-[var(--line)] bg-white/76 p-5 shadow-[var(--soft-shadow)] backdrop-blur">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Good inputs
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">
                    Mention mood, how social the watch is, how much focus you have left, time,
                    and anything you want to avoid. That is enough for a sharp first pass.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
