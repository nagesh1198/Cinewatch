import { z } from "zod";

export const watchFreeOptionSchema = z.object({
  platform: z.string().min(1),
  note: z.string().min(1),
  url: z.string().min(1),
});

export const watchSubscriptionOptionSchema = z.object({
  platform: z.string().min(1),
  plan: z.string().min(1),
  url: z.string().min(1),
});

export const watchRentOptionSchema = z.object({
  platform: z.string().min(1),
  price: z.string().min(1),
  url: z.string().min(1),
});

export const watchBuyOptionSchema = z.object({
  platform: z.string().min(1),
  price: z.string().min(1),
  url: z.string().min(1),
});

export const cineMatchRequestSchema = z.object({
  mood: z.string().trim().min(10).max(500),
  energy: z.enum(["brain-off", "balanced", "dialed-in"]),
  watchWith: z.enum(["alone", "partner", "friends", "family"]),
  time: z.enum(["under-90", "movie-night", "long-haul", "binge"]),
  format: z.enum(["movie", "series", "anime", "documentary", "anything"]),
  languages: z.array(z.string().min(1)).min(1).max(6),
  avoid: z.string().trim().max(200).default(""),
});

export const cineMatchRecommendationSchema = z.object({
  rank: z.number().int().min(1).max(5),
  title: z.string().min(1),
  year: z.string().min(1),
  type: z.string().min(1),
  genre: z.array(z.string().min(1)).min(1).max(5),
  language: z.string().min(1),
  poster_image: z.string().default(""),
  imdb_rating: z.string().min(1),
  rotten_tomatoes_critics: z.string().min(1),
  rotten_tomatoes_audience: z.string().min(1),
  reddit_sentiment: z.string().min(1),
  reddit_quote: z.string().min(1),
  runtime_or_seasons: z.string().min(1),
  why_perfect_for_you: z.string().min(1),
  watch_now: z.object({
    free: z.array(watchFreeOptionSchema),
    subscription: z.array(watchSubscriptionOptionSchema),
    rent: z.array(watchRentOptionSchema),
    buy: z.array(watchBuyOptionSchema),
    not_available_note: z.string().min(1),
  }),
  scores: z.object({
    imdb: z.number().min(1).max(10),
    reddit_sentiment: z.number().min(1).max(10),
    mood_match: z.number().min(1).max(10),
    rewatchability: z.number().min(1).max(10),
    hidden_gem: z.number().min(1).max(10),
    final_match: z.number().min(1).max(10),
  }),
  trigger_warning: z.string().min(1),
  age_rating: z.string().min(1),
  similar_to: z.array(z.string().min(1)).min(2).max(4),
  best_watched: z.string().min(1),
});

export const cineMatchResultSchema = z.object({
  mood_analysis: z.string().min(1),
  on_right_now: z.object({
    platform: z.string().min(1),
    title: z.string().min(1),
    tagline: z.string().min(1),
    imdb: z.string().min(1),
    streaming_url: z.string().min(1),
  }),
  recommendations: z.array(cineMatchRecommendationSchema).length(5),
});

export const cineMatchSourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  domain: z.string().min(1),
});

export const cineMatchApiResponseSchema = z.object({
  mode: z.enum(["live", "demo"]),
  notice: z.string().optional(),
  sources: z.array(cineMatchSourceSchema),
  result: cineMatchResultSchema,
});

export type CineMatchRequest = z.infer<typeof cineMatchRequestSchema>;
export type CineMatchResult = z.infer<typeof cineMatchResultSchema>;
export type CineMatchRecommendation = z.infer<
  typeof cineMatchRecommendationSchema
>;
export type CineMatchApiResponse = z.infer<typeof cineMatchApiResponseSchema>;
export type CineMatchSource = z.infer<typeof cineMatchSourceSchema>;
