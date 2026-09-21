// open library's own subject vocabulary. every slug below was checked against
// the api for depth — a chip that comes back empty is worse than no chip, so
// mythology (64), gothic fiction (48) and knights (21) were dropped, and
// "humor" was swapped for the far better populated "humorous_stories" (889).
// grouped by category for layout, same as the anime genre grid
export const bookSubjects = [
  [
    { Fantasy: "fantasy" },
    { Magic: "magic" },
    { Dragons: "dragons" },
    { Fairy_Tales: "fairy_tales" },
    { Witches: "witches" },
  ],
  [
    { Sci_Fi: "science_fiction" },
    { Time_Travel: "time_travel" },
    { Space: "interplanetary_voyages" },
    { Dystopia: "dystopias" },
  ],
  [
    { Horror: "horror" },
    { Vampires: "vampires" },
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
  ],
  [
    { Adventure: "adventure" },
    { Survival: "survival" },
    { Revenge: "revenge" },
    { Humor: "humorous_stories" },
    { Young_Adult: "young_adult_fiction" },
    { Classics: "classic_literature" },
    { Short_Stories: "short_stories" },
  ],
];

// page counts come from number_of_pages_median, which open library fills in
// for most well-read books. bounds are inclusive
export const bookLengthOptions = [
  { label: "Very short", hint: "under 150 pages", range: "[1 TO 149]", value: "xs" },
  { label: "Short", hint: "150 – 300 pages", range: "[150 TO 299]", value: "s" },
  { label: "Medium", hint: "300 – 450 pages", range: "[300 TO 449]", value: "m" },
  { label: "Long", hint: "450 – 700 pages", range: "[450 TO 699]", value: "l" },
  { label: "Very long", hint: "700+ pages", range: "[700 TO 20000]", value: "xl" },
];

export const bookSortOptions = [
  { label: "Most read", value: "readinglog" },
  { label: "Best rated", value: "rating" },
  { label: "Oldest books", value: "old" },
  { label: "Newest books", value: "new" },
];

// every slug the chips know about, for turning a book's subject_key list back
// into the app's own labels
const subjectLabels = new Map(
  bookSubjects.flat().flatMap((entry) =>
    Object.entries(entry).map(([label, slug]) => [slug, label.replace(/_/g, " ")])
  )
);

// a book's raw `subject` array is a grab-bag: real genres next to machine tags
// (nyt:combined-print-and-e-book-fiction=2024-06-30), library headings
// ("Fiction, thrillers, suspense") and plot trivia ("Schwinn bicycles",
// "lepers"). the cards therefore only show subjects the app has a chip for
export const matchedSubjects = (book) =>
  (book.subject_key ?? [])
    .map((slug) => subjectLabels.get(slug))
    .filter(Boolean);

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
  "subject_key",
].join(",");

// open library indexes far more books than it has readers for, so every
// query carries a reading-list floor to keep unread junk out. sorting by
// rating needs a higher floor: ratings are sparse enough that without one
// the top is all books with a single five-star vote
const readingFloor = (sort) => (sort === "rating" ? 100 : 20);

// the search endpoint takes a lucene-ish query. subject_key is the normalized
// field and matches exactly — the plain `subject` field is tokenized, which
// pulls Harry Potter into "science fiction" and "detective stories".
// unset filters are simply left out. note ratings_average can NOT be
// range-filtered here, the index returns nonsense for it, so the score filter
// runs client-side
export const bookSearchUrl = ({
  includeSubjects = [],
  excludeSubjects = [],
  fromYear,
  toYear,
  length = "",
  sort = "readinglog",
  page = 1,
  perPage = 25,
}) => {
  // subject_key:fiction keeps the list to novels — without it the most-read
  // view is all self-help (Atomic Habits, Rich Dad Poor Dad) — and comics are
  // excluded because graphic novels otherwise top the rating sort
  const parts = [
    `readinglog_count:[${readingFloor(sort)} TO 10000000]`,
    "subject_key:fiction",
    "NOT subject_key:comics",
  ];
  includeSubjects.forEach((s) => parts.push(`subject_key:${s}`));
  excludeSubjects.forEach((s) => parts.push(`NOT subject_key:${s}`));

  const from = parseInt(fromYear, 10);
  const to = parseInt(toYear, 10);
  if (!isNaN(from) || !isNaN(to)) {
    const lower = isNaN(from) ? 1 : from;
    const upper = isNaN(to) ? new Date().getFullYear() : to;
    parts.push(`first_publish_year:[${lower} TO ${upper}]`);
  }

  const bucket = bookLengthOptions.find((option) => option.value === length);
  if (bucket) parts.push(`number_of_pages_median:${bucket.range}`);

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
