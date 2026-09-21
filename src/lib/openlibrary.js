// open library's own subject vocabulary — every entry below was checked
// against the api for depth, anything thinner than ~150 well-read books was
// dropped (cyberpunk has 21, robots 137, outer space 46): a chip that comes
// back empty is worse than no chip at all.
// grouped by category for layout, same as the anime genre grid
export const bookSubjects = [
  [
    { Fantasy: "fantasy" },
    { Magic: "magic" },
    { Dragons: "dragons" },
    { Mythology: "mythology" },
    { Fairy_Tales: "fairy_tales" },
  ],
  [
    { Sci_Fi: "science_fiction" },
    { Time_Travel: "time_travel" },
    { Space: "interplanetary_voyages" },
    { Dystopia: "dystopia" },
  ],
  [
    { Horror: "horror" },
    { Gothic: "gothic_fiction" },
    { Vampires: "vampires" },
    { Witches: "witches" },
    { Ghosts: "ghost_stories" },
  ],
  [
    { Mystery: "mystery" },
    { Detective: "detective_and_mystery_stories" },
    { Thriller: "thriller" },
    { Crime: "crime" },
    { Spy: "spy_stories" },
    { Assassins: "assassins" },
  ],
  [
    { Romance: "romance" },
    { Love_Stories: "love_stories" },
    { Drama: "drama" },
    { Coming_of_Age: "coming_of_age" },
    { Psychological: "psychological_fiction" },
  ],
  [
    { Historical: "historical_fiction" },
    { War: "war_stories" },
    { Western: "western_stories" },
    { Political: "political_fiction" },
    { Philosophy: "philosophy" },
    { Satire: "satire" },
    { Humor: "humor" },
  ],
  [
    { Adventure: "adventure" },
    { Survival: "survival" },
    { Revenge: "revenge" },
    { Knights: "knights" },
    { Young_Adult: "young_adult_fiction" },
    { Classics: "classic_literature" },
    { Short_Stories: "short_stories" },
  ],
];

export const bookSortOptions = [
  { label: "Most read", value: "readinglog" },
  { label: "Best rated", value: "rating" },
  { label: "Oldest books", value: "old" },
  { label: "Newest books", value: "new" },
];

// only the fields the cards actually render — the default response is huge
const fields = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "ratings_average",
  "ratings_count",
  "readinglog_count",
  "number_of_pages_median",
  "cover_i",
  "subject",
].join(",");

// open library indexes far more books than it has readers for, so every
// query carries a reading-list floor to keep unread junk out. sorting by
// rating needs a higher floor: ratings are sparse enough that without one
// the top is all books with a single five-star vote
const readingFloor = (sort) => (sort === "rating" ? 100 : 20);

// the search endpoint takes a lucene-ish query. unset filters are simply
// left out — note ratings_average can NOT be range-filtered here, the index
// returns nonsense for it, so the score filter runs client-side
export const bookSearchUrl = ({
  includeSubjects = [],
  excludeSubjects = [],
  fromYear,
  toYear,
  sort = "readinglog",
  page = 1,
  perPage = 25,
}) => {
  // subject:fiction keeps the list to novels — without it the most-read
  // view is all self-help (Atomic Habits, Rich Dad Poor Dad) — and comics
  // are excluded because graphic novels otherwise top the rating sort
  const parts = [
    `readinglog_count:[${readingFloor(sort)} TO 10000000]`,
    "subject:fiction",
    "NOT subject:comics",
  ];
  includeSubjects.forEach((s) => parts.push(`subject:${s}`));
  excludeSubjects.forEach((s) => parts.push(`NOT subject:${s}`));
  const from = parseInt(fromYear, 10);
  const to = parseInt(toYear, 10);
  if (!isNaN(from) || !isNaN(to)) {
    const lower = isNaN(from) ? 1 : from;
    const upper = isNaN(to) ? new Date().getFullYear() : to;
    parts.push(`first_publish_year:[${lower} TO ${upper}]`);
  }
  const query = parts.join(" AND ");
  return `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=${fields}&sort=${sort}&page=${page}&limit=${perPage}`;
};

export const coverUrl = (id, size = "L") =>
  `https://covers.openlibrary.org/b/id/${id}-${size}.jpg`;

// open library rates 0–5, the rest of the app talks in 0–10
export const toTenScale = (rating) => Math.round(rating * 2 * 10) / 10;

// descriptions don't come with the search response — fetched per book when
// the synopsis is opened. the field is either a plain string or {value}
export const fetchBookDescription = async (key) => {
  const res = await fetch(`https://openlibrary.org${key}.json`);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  const data = await res.json();
  const description = data.description ?? data.first_sentence;
  return typeof description === "object" ? description?.value : description;
};
