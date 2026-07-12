<script>
  import {
    animeQuery,
    anilistGenres,
    fetchWithRetry,
    genres,
    tags,
  } from "./lib/anilist.js";
  import ScoreFilter from "./components/ScoreFilter.svelte";
  import GenreFilter from "./components/GenreFilter.svelte";
  import TagFilter from "./components/TagFilter.svelte";
  import OptionGroup from "./components/OptionGroup.svelte";
  import ReleaseDateFilter from "./components/ReleaseDateFilter.svelte";
  import StickyCta from "./components/StickyCta.svelte";
  import ResultsSection from "./components/ResultsSection.svelte";
  import AiringCalendar from "./components/AiringCalendar.svelte";

  // search clicked var
  let noResults = $state(false);

  // api error var (429/5xx from anilist after retries)
  let apiError = $state(false);

  // current page integer var
  let currentPage = $state(1);

  // selected rating
  let selectedRating = $state(0);

  // set rating to selected rating, clicking the same rating resets to 0
  const setRating = (rating) => {
    selectedRating = rating === selectedRating ? 0 : rating;
  };

  // selected genres
  let selectedGenres = $state([]);

  // selected exclude genres
  let selectedExcludeGenres = $state([]);

  // every anilist genre/tag name from the genres array
  const allGenreNames = genres.flatMap((group) =>
    group.flatMap((genre) => Object.values(genre))
  );

  // clicked state of include/exclude all buttons
  let clickedIncludeBtn = $state(false);
  let clickedExcludeBtn = $state(false);

  const toggleIncludeBtn = () => {
    if (clickedIncludeBtn) {
      selectedGenres = [];
      selectedExcludeGenres = [];
    } else {
      selectedExcludeGenres = [];
      selectedGenres = [...allGenreNames];
    }
    clickedIncludeBtn = !clickedIncludeBtn;
  };

  const toggleExcludeBtn = () => {
    if (clickedExcludeBtn) {
      selectedExcludeGenres = [];
      selectedGenres = [];
    } else {
      selectedGenres = [];
      selectedExcludeGenres = [...allGenreNames];
    }
    clickedExcludeBtn = !clickedExcludeBtn;
  };

  // toggle genre in include list, removing it from the exclude list
  const addGenre = (genre) => {
    if (!selectedGenres.includes(genre)) {
      selectedGenres = [...selectedGenres, genre];
    } else {
      selectedGenres = selectedGenres.filter((item) => item !== genre);
    }
    if (selectedExcludeGenres.includes(genre)) {
      selectedExcludeGenres = selectedExcludeGenres.filter(
        (item) => item !== genre
      );
    }
  };

  // toggle genre in exclude list, removing it from the include list
  const addExcludeGenre = (genre) => {
    if (!selectedExcludeGenres.includes(genre)) {
      selectedExcludeGenres = [...selectedExcludeGenres, genre];
    } else {
      selectedExcludeGenres = selectedExcludeGenres.filter(
        (item) => item !== genre
      );
    }
    if (selectedGenres.includes(genre)) {
      selectedGenres = selectedGenres.filter((item) => item !== genre);
    }
  };

  // selected tags (curated list, separate from the genre grid above)
  let selectedTags = $state([]);

  // selected exclude tags
  let selectedExcludeTags = $state([]);

  // every curated tag name from the tags array
  const allTagNames = tags.flatMap((group) =>
    group.flatMap((tag) => Object.values(tag))
  );

  // clicked state of tag include/exclude all buttons
  let clickedIncludeTagBtn = $state(false);
  let clickedExcludeTagBtn = $state(false);

  const toggleIncludeTagBtn = () => {
    if (clickedIncludeTagBtn) {
      selectedTags = [];
      selectedExcludeTags = [];
    } else {
      selectedExcludeTags = [];
      selectedTags = [...allTagNames];
    }
    clickedIncludeTagBtn = !clickedIncludeTagBtn;
  };

  const toggleExcludeTagBtn = () => {
    if (clickedExcludeTagBtn) {
      selectedExcludeTags = [];
      selectedTags = [];
    } else {
      selectedTags = [];
      selectedExcludeTags = [...allTagNames];
    }
    clickedExcludeTagBtn = !clickedExcludeTagBtn;
  };

  // toggle tag in include list, removing it from the exclude list
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      selectedTags = [...selectedTags, tag];
    } else {
      selectedTags = selectedTags.filter((item) => item !== tag);
    }
    if (selectedExcludeTags.includes(tag)) {
      selectedExcludeTags = selectedExcludeTags.filter((item) => item !== tag);
    }
  };

  // toggle tag in exclude list, removing it from the include list
  const addExcludeTag = (tag) => {
    if (!selectedExcludeTags.includes(tag)) {
      selectedExcludeTags = [...selectedExcludeTags, tag];
    } else {
      selectedExcludeTags = selectedExcludeTags.filter((item) => item !== tag);
    }
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((item) => item !== tag);
    }
  };

  // anime type
  const animeTypes = [
    { label: "TV", value: "tv" },
    { label: "Movie", value: "movie" },
    { label: "OVA", value: "ova" },
    { label: "ONA", value: "ona" },
  ];

  // selected anime type
  let selectedAnimeType = $state("tv");

  // release year range; an empty "to" means no upper bound
  let fromYear = $state("1980");
  let toYear = $state("");

  // sort button array
  const sortBtns = [
    { label: "Most popular", value: "POPULARITY_DESC" },
    { label: "Best rated", value: "SCORE_DESC" },
    { label: "Oldest anime", value: "START_DATE" },
    { label: "Newest anime", value: "START_DATE_DESC" },
  ];

  let selectedSortBtn = $state("");

  // completed, airing, upcoming
  const statusOptions = [
    { label: "Completed anime", value: "FINISHED" },
    { label: "Airing anime", value: "RELEASING" },
    { label: "Upcoming anime", value: "NOT_YET_RELEASED" },
  ];

  let selectedStatus = $state("");

  // clicking the selected status again removes it
  const setStatus = (value) => {
    selectedStatus = selectedStatus === value ? "" : value;
  };

  // only show franchise starters (entries without an anime prequel)
  let firstSeasonOnly = $state(false);

  // a prequel marks an entry as a sequel when it's a series (TV/TV_SHORT) or
  // shares the entry's own format (catches ONA sequels of ONA series) — but
  // not a plain OVA/movie side story, which real first seasons often have
  // (e.g. JJK 0). some sequels only link to an interquel OVA/special that in
  // turn links to the previous season (e.g. Slime S2, Haikyuu S4), so the
  // prequel's own prequels are checked one level deep too.
  const isSeriesFormat = (format, ownFormat) =>
    format === "TV" || format === "TV_SHORT" || format === ownFormat;
  const hasSeriesPrequel = (m) =>
    m.relations?.edges?.some(
      (e) =>
        e.relationType === "PREQUEL" &&
        (isSeriesFormat(e.node.format, m.format) ||
          e.node.relations?.edges?.some(
            (r) =>
              r.relationType === "PREQUEL" &&
              isSeriesFormat(r.node.format, m.format)
          ))
    );

  // is loading variable
  let isLoading = $state(false);

  // anime data variable
  let animeData = $state([]);

  // pagination data variable
  let paginationData = $state([]);

  // number of active filter dimensions, shown on the sticky CTA
  let activeFilterCount = $derived(
    (selectedRating > 0 ? 1 : 0) +
      (selectedGenres.length > 0 ? 1 : 0) +
      (selectedExcludeGenres.length > 0 ? 1 : 0) +
      (selectedTags.length > 0 ? 1 : 0) +
      (selectedExcludeTags.length > 0 ? 1 : 0) +
      (selectedStatus ? 1 : 0) +
      (selectedSortBtn ? 1 : 0) +
      (firstSeasonOnly ? 1 : 0) +
      (fromYear !== "1980" || toYear !== "" ? 1 : 0)
  );

  // true until the user runs their first real search — the results grid
  // shows trending anime as a default landing view instead of being empty
  let isTrendingView = $state(true);

  const scrollToResults = () => {
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
  };

  // fetch anime with anilist api
  const fetchAnime = async () => {
    // split genre-grid selections into anilist genres vs tags, then merge in
    // the curated tag grid's own selections
    const includeGenres = selectedGenres.filter((g) => anilistGenres.has(g));
    const includeTags = [
      ...selectedGenres.filter((g) => !anilistGenres.has(g)),
      ...selectedTags,
    ];
    const excludeGenres = selectedExcludeGenres.filter((g) =>
      anilistGenres.has(g)
    );
    const excludeTags = [
      ...selectedExcludeGenres.filter((g) => !anilistGenres.has(g)),
      ...selectedExcludeTags,
    ];

    const variables = {
      page: currentPage,
      perPage: 25,
      format: selectedAnimeType.toUpperCase(),
      sort: [selectedSortBtn || "POPULARITY_DESC"],
    };
    // fuzzy date ints (e.g. 19800101); both bounds are exclusive, so the
    // "to" year is sent as Jan 1 of the following year
    const fromY = parseInt(fromYear, 10);
    if (!isNaN(fromY)) variables.startDateGreater = fromY * 10000 + 101;
    const toY = parseInt(toYear, 10);
    if (!isNaN(toY)) variables.startDateLesser = (toY + 1) * 10000 + 101;
    // averageScore_greater is exclusive, -1 keeps the exact score included
    if (selectedRating > 0) variables.minScore = selectedRating * 10 - 1;
    if (includeGenres.length > 0) variables.genreIn = includeGenres;
    if (includeTags.length > 0) variables.tagIn = includeTags;
    if (excludeGenres.length > 0) variables.genreNotIn = excludeGenres;
    if (excludeTags.length > 0) variables.tagNotIn = excludeTags;
    if (selectedStatus) variables.status = selectedStatus;

    try {
      isLoading = true;
      apiError = false;
      noResults = true;
      scrollToResults();
      const res = await fetchWithRetry("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: animeQuery, variables }),
      });
      const response = await res.json();
      if (response.errors) {
        throw new Error(`AniList API error: ${response.errors[0].message}`);
      }
      // AniList has no server-side "no sequels" filter, so drop entries
      // client-side (pages may end up smaller)
      animeData = firstSeasonOnly
        ? response.data.Page.media.filter((m) => !hasSeriesPrequel(m))
        : response.data.Page.media;
      paginationData = response.data.Page.pageInfo;
      isLoading = false;
    } catch (error) {
      isLoading = false;
      paginationData = [];
      apiError = true;
      animeData = [];
      console.error(error);
    }
  };

  // sticky CTA always starts a fresh search on page 1
  const showResults = () => {
    isTrendingView = false;
    currentPage = 1;
    fetchAnime();
  };

  const goToPage = (page) => {
    currentPage = page;
    isTrendingView ? loadTrending(page) : fetchAnime();
  };

  // trending anime shown as the default landing view, before the user runs
  // their first real search
  const loadTrending = async (page = 1) => {
    try {
      isLoading = true;
      const res = await fetchWithRetry("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: animeQuery,
          variables: { page, perPage: 25, sort: ["TRENDING_DESC"] },
        }),
      });
      const response = await res.json();
      if (response.errors) {
        throw new Error(`AniList API error: ${response.errors[0].message}`);
      }
      animeData = response.data.Page.media;
      paginationData = response.data.Page.pageInfo;
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  };

  loadTrending();
</script>

<div class="flex min-h-dvh w-full flex-col items-center bg-background p-6 pb-36 text-text">
  <div class="flex w-full max-w-6xl flex-col items-center">
    <header class="flex w-full flex-col items-center text-center">
      <h1><img width="600" src="/assets/logo.svg" alt="NeedAni.me" /></h1>
      <p class="mt-6 max-w-2xl text-text-muted">
        NeedAni.me makes it easy for you to find a new anime you want to watch
        by using <a
          class="font-bold text-text underline-offset-2 hover:underline"
          href="https://anilist.co/"
          target="_blank"
          rel="noopener noreferrer">AniList's API</a
        >. New Features will be added by time, so don't forget to bookmark it!
      </p>
    </header>

    <AiringCalendar />

    <main class="mt-16 flex w-full flex-col items-center gap-16 text-center">
      <ScoreFilter {selectedRating} onSelect={setRating} />

      <GenreFilter
        {selectedGenres}
        {selectedExcludeGenres}
        {clickedIncludeBtn}
        {clickedExcludeBtn}
        onInclude={addGenre}
        onExclude={addExcludeGenre}
        onToggleIncludeAll={toggleIncludeBtn}
        onToggleExcludeAll={toggleExcludeBtn}
      />

      <TagFilter
        {selectedTags}
        {selectedExcludeTags}
        clickedIncludeBtn={clickedIncludeTagBtn}
        clickedExcludeBtn={clickedExcludeTagBtn}
        onInclude={addTag}
        onExclude={addExcludeTag}
        onToggleIncludeAll={toggleIncludeTagBtn}
        onToggleExcludeAll={toggleExcludeTagBtn}
      />

      <OptionGroup
        title="Type of Anime"
        options={animeTypes}
        selected={selectedAnimeType}
        onSelect={(value) => (selectedAnimeType = value)}
      />

      <ReleaseDateFilter
        {fromYear}
        {toYear}
        onSetFromYear={(year) => (fromYear = year)}
        onSetToYear={(year) => (toYear = year)}
      />

      <div class="flex w-full flex-col items-center gap-4">
        <OptionGroup
          title="Status"
          options={statusOptions}
          selected={selectedStatus}
          onSelect={setStatus}
        />

        <!-- first season only toggle -->
        <button
          type="button"
          aria-pressed={firstSeasonOnly}
          class="flex items-center gap-2 rounded-lg px-5 py-3 font-semibold transition-colors duration-200
            {firstSeasonOnly
            ? 'bg-primary text-white hover:bg-primary-hover'
            : 'bg-surface hover:bg-surface-raised'}"
          onclick={() => (firstSeasonOnly = !firstSeasonOnly)}
        >
          {#if firstSeasonOnly}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          {/if}
          First seasons only
        </button>
      </div>

      <OptionGroup
        title="Sort By"
        options={sortBtns}
        selected={selectedSortBtn}
        onSelect={(value) => (selectedSortBtn = value)}
      />
    </main>
  </div>

  <div class="w-full max-w-[1800px] 2xl:px-3">
    <ResultsSection
      {animeData}
      {paginationData}
      {isLoading}
      {noResults}
      {apiError}
      {currentPage}
      {isTrendingView}
      onPrev={() => goToPage(currentPage - 1)}
      onNext={() => goToPage(currentPage + 1)}
      onRetry={fetchAnime}
    />
  </div>

  <StickyCta {isLoading} filterCount={activeFilterCount} onShow={showResults} />
</div>
