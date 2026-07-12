<script>
  import AnimeCard from "./AnimeCard.svelte";

  let {
    animeData,
    paginationData,
    isLoading,
    noResults,
    apiError,
    currentPage,
    isTrendingView,
    onPrev,
    onNext,
    onRetry,
  } = $props();

  const skeletons = Array.from({ length: 8 }, (_, i) => i);
</script>

<section id="results" class="w-full scroll-mt-6 text-center">
  {#if isLoading}
    <h2 class="mb-6 mt-12 font-display text-3xl">
      {isTrendingView ? "Trending Now" : "Results"}
    </h2>
    <div class="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {#each skeletons as i (i)}
        <div
          class="w-full animate-pulse overflow-hidden rounded-xl border border-line bg-surface"
        >
          <div class="h-72 bg-surface-raised"></div>
          <div class="space-y-2 p-3">
            <div class="h-4 w-3/4 rounded bg-surface-raised"></div>
            <div class="h-3 w-1/2 rounded bg-surface-raised"></div>
          </div>
          <div class="h-11 bg-background"></div>
        </div>
      {/each}
    </div>
  {:else if animeData.length > 0}
    <h2 class="mb-6 mt-12 font-display text-3xl">
      {isTrendingView ? "Trending Now" : "Results"}
    </h2>
    <div class="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {#each animeData as anime (anime.id)}
        <AnimeCard {anime} />
      {/each}
    </div>
  {:else if noResults}
    <div class="mx-auto mt-12 flex max-w-md flex-col items-center gap-4 rounded-xl bg-surface p-8">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-muted" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <line x1="8" x2="14" y1="11" y2="11" />
      </svg>
      <h2 class="text-2xl font-bold">
        {apiError ? "The anime database is currently unavailable" : "No results found"}
      </h2>
      <p class="text-text-muted">
        {apiError
          ? "Please try again in a moment."
          : "Try loosening your filters — a lower score, fewer genres or a wider release range."}
      </p>
      {#if apiError}
        <button
          type="button"
          class="rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
          onclick={onRetry}
        >
          Retry
        </button>
      {/if}
    </div>
  {/if}

  {#if !isLoading && paginationData?.currentPage && (paginationData.hasNextPage || paginationData.currentPage > 1)}
    <div class="mt-8 flex w-full items-center justify-center gap-3">
      <button
        type="button"
        disabled={currentPage === 1}
        class="w-full max-w-60 rounded-lg bg-surface py-3 font-semibold transition-colors duration-200 hover:bg-surface-raised disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface"
        onclick={onPrev}
      >
        Previous page
      </button>
      <p class="whitespace-nowrap font-bold tabular-nums">
        Page {paginationData.currentPage}
      </p>
      <button
        type="button"
        disabled={!paginationData.hasNextPage}
        class="w-full max-w-60 rounded-lg bg-surface py-3 font-semibold transition-colors duration-200 hover:bg-surface-raised disabled:cursor-default disabled:opacity-40 disabled:hover:bg-surface"
        onclick={onNext}
      >
        Next page
      </button>
    </div>
  {/if}
</section>
