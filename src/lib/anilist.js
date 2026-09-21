// values are anilist genre/tag names (key is only the display label),
// grouped by category — each inner array renders as one grid row
export const genres = [
  [{ Action: "Action" }, { Martial_Arts: "Martial Arts" }],
  [
    { Adventure: "Adventure" },
    { Historical: "Historical" },
    { Space: "Space" },
  ],
  [
    { Comedy: "Comedy" },
    { Drama: "Drama" },
    { Music: "Music" },
    { School: "School" },
    { Sports: "Sports" },
    { Slice_of_Life: "Slice of Life" },
  ],
  [
    { Fantasy: "Fantasy" },
    { Game: "Video Games" },
    { Magic: "Magic" },
    { Mecha: "Mecha" },
    { Sci_Fi: "Sci-Fi" },
    { Super_Power: "Super Power" },
  ],
  [
    { Horror: "Horror" },
    { Mystery: "Mystery" },
    { Psychological: "Psychological" },
    { Supernatural: "Supernatural" },
    { Thriller: "Thriller" },
  ],
  [
    { Shounen: "Shounen" },
    { Shoujo: "Shoujo" },
    { Kids: "Kids" },
    { Seinen: "Seinen" },
  ],
  [{ Romance: "Romance" }, { Harem: "Female Harem" }],
];

// curated anilist tags (not genres), grouped for the tag filter grid below
// the genre grid — same include/exclude interaction, sent via tag_in/tag_not_in
export const tags = [
  [
    { Isekai: "Isekai" },
    { Reincarnation: "Reincarnation" },
    { Mythology: "Mythology" },
    { Fairy_Tale: "Fairy Tale" },
  ],
  [
    { Time_Skip: "Time Skip" },
    { Time_Loop: "Time Loop" },
    { Post_Apocalyptic: "Post-Apocalyptic" },
    { Dystopian: "Dystopian" },
  ],
  [
    { Assassins: "Assassins" },
    { Ninja: "Ninja" },
    { Samurai: "Samurai" },
    { Pirates: "Pirates" },
    { Military: "Military" },
  ],
  [
    { Revenge: "Revenge" },
    { Tragedy: "Tragedy" },
    { Coming_of_Age: "Coming of Age" },
    { Villainess: "Villainess" },
  ],
  [
    { Cyberpunk: "Cyberpunk" },
    { Space_Opera: "Space Opera" },
    { Superhero: "Superhero" },
    { Robots: "Robots" },
  ],
  [
    { Idol: "Idol" },
    { Otaku_Culture: "Otaku Culture" },
    { School_Club: "School Club" },
    { Iyashikei: "Iyashikei" },
  ],
  [
    { Zombie: "Zombie" },
    { Vampire: "Vampire" },
    { Gore: "Gore" },
    { Body_Horror: "Body Horror" },
  ],
];

// anilist treats these as genres — everything else in the genre grid is a tag
// and has to be sent via tag_in/tag_not_in instead of genre_in/genre_not_in
export const anilistGenres = new Set([
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
]);

// anilist descriptions contain html tags (<br>, <i>, ...)
export const stripHtml = (html) =>
  html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "");

// fetch with retry on 429/5xx (anilist is rate limited)
export const fetchWithRetry = async (url, options, retries = 2) => {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (attempt >= retries || (res.status !== 429 && res.status < 500)) {
      throw new Error(`AniList API error: ${res.status}`);
    }
    // wait 1s, then 2s before retrying
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
  }
};

// anilist graphql query — unset variables are omitted from the variables
// object, anilist then ignores those filters entirely
export const animeQuery = `query ($page: Int, $perPage: Int, $format: MediaFormat, $status: MediaStatus, $minScore: Int, $genreIn: [String], $genreNotIn: [String], $tagIn: [String], $tagNotIn: [String], $startDateGreater: FuzzyDateInt, $startDateLesser: FuzzyDateInt, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { currentPage hasNextPage }
    media(type: ANIME, isAdult: false, format: $format, status: $status, averageScore_greater: $minScore, genre_in: $genreIn, genre_not_in: $genreNotIn, tag_in: $tagIn, tag_not_in: $tagNotIn, startDate_greater: $startDateGreater, startDate_lesser: $startDateLesser, sort: $sort) {
      id
      title { romaji }
      coverImage { extraLarge }
      seasonYear
      startDate { year }
      format
      averageScore
      popularity
      genres
      description
      siteUrl
      relations {
        edges {
          relationType
          node {
            format
            relations {
              edges {
                relationType
                node { format }
              }
            }
          }
        }
      }
    }
  }
}`;

// fetched on demand when the "Learn more" modal opens — kept out of
// animeQuery so the results grid doesn't pay for data most cards never show
export const animeDetailQuery = `query ($id: Int) {
  Media(id: $id) {
    episodes
    duration
    source
    studios(isMain: true) {
      nodes { name }
    }
    trailer { id site }
    externalLinks {
      site
      url
      type
    }
    recommendations(sort: RATING_DESC, perPage: 6) {
      nodes {
        mediaRecommendation {
          id
          title { romaji }
          coverImage { large }
          averageScore
          siteUrl
        }
      }
    }
  }
}`;

// airing schedule for the "airing this week" calendar
export const airingScheduleQuery = `query ($start: Int, $end: Int) {
  Page(page: 1, perPage: 50) {
    airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
      airingAt
      episode
      media {
        id
        title { romaji }
        coverImage { large }
        siteUrl
      }
    }
  }
}`;
