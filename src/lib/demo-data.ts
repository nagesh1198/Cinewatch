import type {
  CineMatchApiResponse,
  CineMatchRecommendation,
  CineMatchRequest,
  CineMatchResult,
} from "@/lib/schemas";

type DemoCategory = "comfort" | "thrill" | "reflective";

type DemoSeed = Omit<CineMatchRecommendation, "rank" | "why_perfect_for_you">;

const noFree = [] as CineMatchRecommendation["watch_now"]["free"];

function provider(
  platform: string,
  url: string,
  plan = "Check current plan"
): CineMatchRecommendation["watch_now"]["subscription"][number] {
  return { platform, plan, url };
}

function rent(
  platform: string,
  price = "Check current rent",
  url = "https://tv.apple.com"
): CineMatchRecommendation["watch_now"]["rent"][number] {
  return { platform, price, url };
}

function buy(
  platform: string,
  price = "Check current buy price",
  url = "https://tv.apple.com"
): CineMatchRecommendation["watch_now"]["buy"][number] {
  return { platform, price, url };
}

const demoCatalog: Record<DemoCategory, DemoSeed[]> = {
  comfort: [
    {
      title: "Panchayat",
      year: "2020",
      type: "Series",
      genre: ["Comedy", "Drama"],
      language: "Hindi",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMTllYzQ0MzctZTI4Ny00YTE3LTlkYjQtMWQ1MGFkNDJmNWFhXkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_SX300.jpg",
      imdb_rating: "8.9/10",
      rotten_tomatoes_critics: "Not widely listed",
      rotten_tomatoes_audience: "Not widely listed",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Frequently praised as funny, grounded, and deeply comforting without feeling sugary.",
      runtime_or_seasons: "3 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Amazon Prime Video", "https://www.primevideo.com")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 9,
        mood_match: 10,
        rewatchability: 9,
        hidden_gem: 6,
        final_match: 8.6,
      },
      trigger_warning: "Mild village politics",
      age_rating: "U/A 13+",
      similar_to: ["Ted Lasso", "Gullak", "The Detectorists"],
      best_watched: "Alone or with family on an easy evening",
    },
    {
      title: "Ted Lasso",
      year: "2020",
      type: "Series",
      genre: ["Comedy", "Sport", "Drama"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMTdmZjBjMmQtODI3OC00OTE4LTk0NzEtNTFkNzEzYmM2YzZiXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
      imdb_rating: "8.8/10",
      rotten_tomatoes_critics: "90%",
      rotten_tomatoes_audience: "85%",
      reddit_sentiment: "Overwhelmingly Positive",
      reddit_quote:
        "People return to it when they want something warm, funny, and emotionally steadying.",
      runtime_or_seasons: "3 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Apple TV+", "https://tv.apple.com")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 9,
        mood_match: 9,
        rewatchability: 9,
        hidden_gem: 4,
        final_match: 8,
      },
      trigger_warning: "Occasional strong language",
      age_rating: "U/A 16+",
      similar_to: ["Shrinking", "Trying", "Friday Night Lights"],
      best_watched: "With a partner or solo when you want to feel better fast",
    },
    {
      title: "Derry Girls",
      year: "2018",
      type: "Series",
      genre: ["Comedy", "Coming-of-age"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMTg3NTM5NzY0Nl5BMl5BanBnXkFtZTgwODg5NjQ4NTM@._V1_SX300.jpg",
      imdb_rating: "8.5/10",
      rotten_tomatoes_critics: "99%",
      rotten_tomatoes_audience: "95%",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Usually described as chaotic comfort television with extremely high joke density.",
      runtime_or_seasons: "3 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Netflix", "https://www.netflix.com/in")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 9,
        mood_match: 9,
        rewatchability: 8,
        hidden_gem: 5,
        final_match: 7.8,
      },
      trigger_warning: "Strong language",
      age_rating: "U/A 16+",
      similar_to: ["Sex Education", "Booksmart", "Everything Sucks!"],
      best_watched: "With friends when you want laughs immediately",
    },
    {
      title: "Somebody Feed Phil",
      year: "2018",
      type: "Series",
      genre: ["Travel", "Food", "Documentary"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMTY4NzA5MzY3NV5BMl5BanBnXkFtZTgwMzY3MjQ3NTM@._V1_SX300.jpg",
      imdb_rating: "8.3/10",
      rotten_tomatoes_critics: "95%",
      rotten_tomatoes_audience: "93%",
      reddit_sentiment: "Positive",
      reddit_quote:
        "Recommended as cozy, low-stress viewing that still feels lively and uplifting.",
      runtime_or_seasons: "7 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Netflix", "https://www.netflix.com/in")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 8,
        mood_match: 9,
        rewatchability: 7,
        hidden_gem: 6,
        final_match: 7.6,
      },
      trigger_warning: "None",
      age_rating: "U",
      similar_to: ["Chef's Table", "Somebody Somewhere", "The Great British Bake Off"],
      best_watched: "Anytime you want zero emotional friction",
    },
    {
      title: "The Intern",
      year: "2015",
      type: "Movie",
      genre: ["Comedy", "Drama"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMTUyNjE5NjI5OF5BMl5BanBnXkFtZTgwNzYzMzU3NjE@._V1_SX300.jpg",
      imdb_rating: "7.1/10",
      rotten_tomatoes_critics: "60%",
      rotten_tomatoes_audience: "73%",
      reddit_sentiment: "Positive",
      reddit_quote:
        "Often mentioned as a gentle, reliable comfort movie with almost no sharp edges.",
      runtime_or_seasons: "2h 1m",
      watch_now: {
        free: noFree,
        subscription: [],
        rent: [rent("Apple TV")],
        buy: [buy("Apple TV")],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 7,
        reddit_sentiment: 7,
        mood_match: 8,
        rewatchability: 8,
        hidden_gem: 4,
        final_match: 6.8,
      },
      trigger_warning: "Mild workplace tension",
      age_rating: "U/A 13+",
      similar_to: ["Julie & Julia", "Chef", "Morning Glory"],
      best_watched: "Alone with dinner or a quiet weekend wind-down",
    },
  ],
  thrill: [
    {
      title: "Arcane",
      year: "2021",
      type: "Series",
      genre: ["Animation", "Action", "Fantasy"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BYmU5OWM5ZTAtNjUzOC00NmUyLTgyOWMtMjlkNjdlMDAzMzU1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
      imdb_rating: "9.0/10",
      rotten_tomatoes_critics: "100%",
      rotten_tomatoes_audience: "96%",
      reddit_sentiment: "Overwhelmingly Positive",
      reddit_quote:
        "Regularly called one of the sharpest, most visually electric binge watches around.",
      runtime_or_seasons: "2 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Netflix", "https://www.netflix.com/in")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 10,
        mood_match: 10,
        rewatchability: 9,
        hidden_gem: 4,
        final_match: 8.4,
      },
      trigger_warning: "Violence, grief",
      age_rating: "A",
      similar_to: ["Blue Eye Samurai", "Cyberpunk: Edgerunners", "Spider-Verse"],
      best_watched: "With friends or solo when you want to lock in hard",
    },
    {
      title: "Blue Eye Samurai",
      year: "2023",
      type: "Anime",
      genre: ["Action", "Drama", "Animation"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BZjBmNzBkMzMtNzIyOC00MDU1LWE3MjQtZGMyNWE1NTNmYzViXkEyXkFqcGdeQXVyMTUzMTg4Nzgz._V1_SX300.jpg",
      imdb_rating: "8.7/10",
      rotten_tomatoes_critics: "97%",
      rotten_tomatoes_audience: "95%",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Loved for the fight choreography, adult storytelling, and relentless momentum.",
      runtime_or_seasons: "1 Season",
      watch_now: {
        free: noFree,
        subscription: [provider("Netflix", "https://www.netflix.com/in")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 9,
        mood_match: 9,
        rewatchability: 8,
        hidden_gem: 6,
        final_match: 8.2,
      },
      trigger_warning: "Graphic violence, sexual content",
      age_rating: "A",
      similar_to: ["Arcane", "Samurai Champloo", "Kill Bill"],
      best_watched: "Late night when you want something stylish and intense",
    },
    {
      title: "Reacher",
      year: "2022",
      type: "Series",
      genre: ["Action", "Thriller", "Crime"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BNzQ4MGYzYzAtNjJlOC00NTdkLTlmNTAtMmZjMzZmZTg2YTEzXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg",
      imdb_rating: "8.0/10",
      rotten_tomatoes_critics: "95%",
      rotten_tomatoes_audience: "84%",
      reddit_sentiment: "Positive",
      reddit_quote:
        "Frequently recommended as clean, satisfying, no-nonsense fun when you want pace over complexity.",
      runtime_or_seasons: "3 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Amazon Prime Video", "https://www.primevideo.com")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 8,
        mood_match: 8,
        rewatchability: 8,
        hidden_gem: 4,
        final_match: 7.2,
      },
      trigger_warning: "Violence, strong language",
      age_rating: "A",
      similar_to: ["Jack Ryan", "Banshee", "The Night Agent"],
      best_watched: "With friends when you want a high-hit-rate binge",
    },
    {
      title: "The Family Man",
      year: "2019",
      type: "Series",
      genre: ["Action", "Thriller", "Drama"],
      language: "Hindi",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMzQ5NGQwNzYtNWJmZC00ZjE3LWI0ZjQtMjQ1YWI5OWY3ZjE5XkEyXkFqcGdeQXVyMTIzMzg0MTM2._V1_SX300.jpg",
      imdb_rating: "8.7/10",
      rotten_tomatoes_critics: "Not widely listed",
      rotten_tomatoes_audience: "Not widely listed",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Gets recommended a lot for balancing spy-thriller tension with genuinely fun character work.",
      runtime_or_seasons: "2 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Amazon Prime Video", "https://www.primevideo.com")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 9,
        mood_match: 8,
        rewatchability: 8,
        hidden_gem: 5,
        final_match: 7.8,
      },
      trigger_warning: "Violence, terrorism themes",
      age_rating: "A",
      similar_to: ["Special Ops", "Fauda", "Homeland"],
      best_watched: "With a partner or solo when you want a fast binge",
    },
    {
      title: "Top Gun: Maverick",
      year: "2022",
      type: "Movie",
      genre: ["Action", "Drama"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg",
      imdb_rating: "8.2/10",
      rotten_tomatoes_critics: "96%",
      rotten_tomatoes_audience: "99%",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Reddit usually treats it like a premium crowd-pleaser that absolutely delivers on adrenaline.",
      runtime_or_seasons: "2h 10m",
      watch_now: {
        free: noFree,
        subscription: [],
        rent: [rent("Apple TV"), rent("Amazon Video", "Check current rent", "https://www.primevideo.com")],
        buy: [buy("Apple TV"), buy("Amazon Video", "Check current buy price", "https://www.primevideo.com")],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 9,
        mood_match: 8,
        rewatchability: 9,
        hidden_gem: 3,
        final_match: 7.4,
      },
      trigger_warning: "Combat danger, grief",
      age_rating: "U/A 13+",
      similar_to: ["Mission: Impossible - Fallout", "Rush", "Ford v Ferrari"],
      best_watched: "With friends on a big screen night",
    },
  ],
  reflective: [
    {
      title: "The Bear",
      year: "2022",
      type: "Series",
      genre: ["Drama", "Comedy"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BMmFkZGQxN2YtODNlYS00MzM5LTkwOTYtNWMzYmQ2MGIwMmQ0XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
      imdb_rating: "8.6/10",
      rotten_tomatoes_critics: "99%",
      rotten_tomatoes_audience: "92%",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Often recommended to people who want something intense, smart, and emotionally charged.",
      runtime_or_seasons: "3 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Disney+ Hotstar", "https://www.hotstar.com/in")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 9,
        mood_match: 10,
        rewatchability: 7,
        hidden_gem: 4,
        final_match: 7.8,
      },
      trigger_warning: "Anxiety, shouting, grief",
      age_rating: "A",
      similar_to: ["Boiling Point", "Shameless", "Ramy"],
      best_watched: "Alone when you want something sharp and emotionally alive",
    },
    {
      title: "Severance",
      year: "2022",
      type: "Series",
      genre: ["Sci-Fi", "Thriller", "Drama"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BYzg2OTQ3M2QtNDYzNy00OTZiLWJjNzAtY2MwOWYzZTgzYzAyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
      imdb_rating: "8.7/10",
      rotten_tomatoes_critics: "96%",
      rotten_tomatoes_audience: "89%",
      reddit_sentiment: "Overwhelmingly Positive",
      reddit_quote:
        "A go-to pick when people want something smart, unsettling, and easy to obsess over.",
      runtime_or_seasons: "2 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Apple TV+", "https://tv.apple.com")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 9,
        reddit_sentiment: 10,
        mood_match: 9,
        rewatchability: 8,
        hidden_gem: 5,
        final_match: 8.2,
      },
      trigger_warning: "Psychological tension",
      age_rating: "A",
      similar_to: ["Black Mirror", "Homecoming", "Dark"],
      best_watched: "Solo when you want a true rabbit-hole binge",
    },
    {
      title: "Maid",
      year: "2021",
      type: "Mini-Series",
      genre: ["Drama"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BZjA3ODhiNmYtOGJjZS00NzA4LWIzZjQtNjY4MjA4ODc5ZjY3XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
      imdb_rating: "8.3/10",
      rotten_tomatoes_critics: "94%",
      rotten_tomatoes_audience: "88%",
      reddit_sentiment: "Positive",
      reddit_quote:
        "Praised as deeply human and well-acted, though definitely not weightless viewing.",
      runtime_or_seasons: "1 Season",
      watch_now: {
        free: noFree,
        subscription: [provider("Netflix", "https://www.netflix.com/in")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 8,
        mood_match: 8,
        rewatchability: 6,
        hidden_gem: 6,
        final_match: 7.2,
      },
      trigger_warning: "Domestic abuse, poverty",
      age_rating: "A",
      similar_to: ["Normal People", "Unbelievable", "Pieces of Her"],
      best_watched: "Alone when you have room for something emotionally heavier",
    },
    {
      title: "Paatal Lok",
      year: "2020",
      type: "Series",
      genre: ["Crime", "Thriller", "Drama"],
      language: "Hindi",
      poster_image: "https://m.media-amazon.com/images/M/MV5BODk5NTIyNDYtZjAwNC00Zjg5LWE3ZjYtNzViZWQ4MzE3NmY4XkEyXkFqcGdeQXVyODQ5NDUwMDk@._V1_SX300.jpg",
      imdb_rating: "8.1/10",
      rotten_tomatoes_critics: "Not widely listed",
      rotten_tomatoes_audience: "Not widely listed",
      reddit_sentiment: "Very Positive",
      reddit_quote:
        "Shows up a lot in threads about gripping Indian series that feel weighty and well made.",
      runtime_or_seasons: "2 Seasons",
      watch_now: {
        free: noFree,
        subscription: [provider("Amazon Prime Video", "https://www.primevideo.com")],
        rent: [],
        buy: [],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 9,
        mood_match: 8,
        rewatchability: 7,
        hidden_gem: 5,
        final_match: 7.4,
      },
      trigger_warning: "Violence, caste and political themes",
      age_rating: "A",
      similar_to: ["Sacred Games", "Delhi Crime", "Mindhunter"],
      best_watched: "Solo or with a partner when you want something gripping",
    },
    {
      title: "The Holdovers",
      year: "2023",
      type: "Movie",
      genre: ["Comedy", "Drama"],
      language: "English",
      poster_image: "https://m.media-amazon.com/images/M/MV5BNDc2MzNkMjMtZDY5NC00NmQ3LWI5ODEtZTNhNzRhNzhhYjE4XkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_SX300.jpg",
      imdb_rating: "7.9/10",
      rotten_tomatoes_critics: "97%",
      rotten_tomatoes_audience: "92%",
      reddit_sentiment: "Positive",
      reddit_quote:
        "Usually described as melancholic but deeply rewarding, especially if you want something human-scaled.",
      runtime_or_seasons: "2h 13m",
      watch_now: {
        free: noFree,
        subscription: [],
        rent: [rent("Apple TV")],
        buy: [buy("Apple TV")],
        not_available_note:
          "Demo mode sample data. Add OPENAI_API_KEY to verify current India availability and pricing live.",
      },
      scores: {
        imdb: 8,
        reddit_sentiment: 8,
        mood_match: 8,
        rewatchability: 7,
        hidden_gem: 5,
        final_match: 7.2,
      },
      trigger_warning: "Grief, depression, substance use",
      age_rating: "A",
      similar_to: ["Sideways", "Dead Poets Society", "The Station Agent"],
      best_watched: "Alone on a slower evening",
    },
  ],
};

function detectCategory(request: CineMatchRequest): DemoCategory {
  const text = `${request.mood} ${request.avoid}`.toLowerCase();

  if (
    text.includes("comfort") ||
    text.includes("cozy") ||
    text.includes("light") ||
    text.includes("heartbreak") ||
    request.energy === "brain-off"
  ) {
    return "comfort";
  }

  if (
    text.includes("thrill") ||
    text.includes("adrenaline") ||
    text.includes("action") ||
    text.includes("hype") ||
    text.includes("pumped")
  ) {
    return "thrill";
  }

  return "reflective";
}

function buildReason(category: DemoCategory, request: CineMatchRequest, title: string) {
  const languageLine =
    request.languages.includes("Any") || request.languages.length === 0
      ? "It also keeps the language choice open."
      : `It lines up with your current language mix: ${request.languages.join(", ")}.`;

  const contextLine =
    request.watchWith === "friends"
      ? "It has the kind of instant hook that plays well in a shared room."
      : request.watchWith === "family"
        ? "It is comparatively easier to settle into together without constant explanation."
        : request.watchWith === "partner"
          ? "It gives you something engaging to share without turning the night too heavy."
          : "It works especially well when you want to disappear into something on your own terms.";

  const categoryLine =
    category === "comfort"
      ? `${title} is a strong match because you sound like you need something reassuring, funny, or emotionally steady rather than punishing.`
      : category === "thrill"
        ? `${title} fits because your prompt reads like you want momentum, stakes, and a high hit-rate watch that starts working quickly.`
        : `${title} makes sense because you seem open to something textured, thoughtful, and a little more emotionally or intellectually engaged.`;

  return `${categoryLine} ${contextLine} ${languageLine}`;
}

function buildMoodAnalysis(category: DemoCategory, request: CineMatchRequest) {
  if (category === "comfort") {
    return `You need a low-friction watch that can settle your brain without feeling disposable, especially for a ${request.watchWith} session.`;
  }

  if (category === "thrill") {
    return `You need something propulsive and high-reward that grabs fast and keeps the energy up for a ${request.watchWith} watch.`;
  }

  return `You need something emotionally intelligent or idea-rich that still feels watchable tonight, not homework.`;
}

export function buildDemoResponse(request: CineMatchRequest): CineMatchApiResponse {
  const category = detectCategory(request);
  const seeds = demoCatalog[category];

  const recommendations = seeds.map((seed, index) => ({
    ...seed,
    rank: index + 1,
    why_perfect_for_you: buildReason(category, request, seed.title),
  }));

  const topPick = recommendations[0];
  const heroPlatform =
    topPick.watch_now.subscription[0]?.platform ??
    topPick.watch_now.free[0]?.platform ??
    topPick.watch_now.rent[0]?.platform ??
    "Official site";

  const heroUrl =
    topPick.watch_now.subscription[0]?.url ??
    topPick.watch_now.free[0]?.url ??
    topPick.watch_now.rent[0]?.url ??
    topPick.watch_now.buy[0]?.url ??
    "https://www.justwatch.com/in";

  const result: CineMatchResult = {
    mood_analysis: buildMoodAnalysis(category, request),
    on_right_now: {
      platform: heroPlatform,
      title: topPick.title,
      tagline:
        category === "thrill"
          ? "The quickest route to a genuinely locked-in night."
          : category === "comfort"
            ? "A reliable mood reset without asking too much from you."
            : "A sharp, rewarding pick if you want something with a little depth tonight.",
      imdb: topPick.imdb_rating,
      streaming_url: heroUrl,
    },
    recommendations,
  };

  return {
    mode: "demo",
    notice:
      "Demo mode is active. Add OPENAI_API_KEY in your environment to switch CineMatch to live web-verified search and current India availability.",
    sources: [],
    result,
  };
}
