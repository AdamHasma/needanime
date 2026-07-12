<script>
  import { stripHtml } from "../lib/anilist.js";
  import AnimeModal from "./AnimeModal.svelte";

  let { anime } = $props();

  let showSynopsis = $state(false);
  let showModal = $state(false);
</script>

<article
  class="flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color] duration-300 hover:scale-[1.02] hover:border-primary"
>
  <div class="relative h-72">
    <img
      class="h-full w-full object-cover"
      src={anime.coverImage.extraLarge}
      alt={anime.title.romaji}
      loading="lazy"
    />
    {#if anime.averageScore !== null}
      <span
        class="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-sm font-bold text-white"
        title="Average score"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.94 6.26 6.87.84-5.07 4.73 1.32 6.79L12 17.27l-6.06 3.35 1.32-6.79-5.07-4.73 6.87-.84L12 2z" />
        </svg>
        {anime.averageScore / 10}
      </span>
    {/if}
    <div
      class="absolute bottom-0 left-0 right-0 flex flex-col justify-end bg-gradient-to-t from-background to-background/0 p-3 pt-10"
    >
      <h3 class="text-left text-xl font-bold leading-tight">
        {anime.title.romaji}
      </h3>
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line p-3 text-sm text-text-muted">
    <span class="flex items-center gap-1.5" title="Release year">
      <img src="/assets/calendar.svg" alt="" width="16" height="16" />
      {anime.seasonYear ?? anime.startDate.year ?? "unknown"}
    </span>
    <span class="flex items-center gap-1.5" title="Format">
      <img src="/assets/cinema.svg" alt="" width="16" height="16" />
      {anime.format}
    </span>
    <span class="flex items-center gap-1.5" title="Popularity">
      <img src="/assets/multiple.svg" alt="" width="16" height="16" />
      {anime.popularity !== 0 ? anime.popularity.toLocaleString("en-US") : "–"}
    </span>
  </div>

  {#if anime.genres.length > 0}
    <div class="flex flex-wrap gap-1 p-3 pb-0">
      {#each anime.genres as genre (genre)}
        <span class="rounded border border-line px-1.5 py-0.5 text-xs text-text-muted">
          {genre}
        </span>
      {/each}
    </div>
  {/if}

  <button
    type="button"
    aria-expanded={showSynopsis}
    class="flex items-center p-3 transition-colors duration-200 hover:bg-surface-raised"
    onclick={() => (showSynopsis = !showSynopsis)}
  >
    Synopsis
    <svg
      class="ml-1 transition-transform duration-300 {showSynopsis ? 'rotate-90' : ''}"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <g stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="none" stroke="currentColor">
        <polyline points="10,8 14,12 10,16" />
      </g>
    </svg>
  </button>
  {#if showSynopsis}
    <p class="px-3 pb-3 text-left text-sm text-text-muted">
      <!-- limit 50 words on anime.description -->
      {#if anime.description}
        {stripHtml(anime.description).split(" ").slice(0, 50).join(" ")}...
      {:else}
        No synopsis available
      {/if}
    </p>
  {/if}

  <button
    type="button"
    title="Show more information"
    class="mt-auto flex w-full items-center justify-center gap-2 bg-background py-3 font-semibold transition-colors duration-200 hover:bg-surface-raised"
    onclick={() => (showModal = true)}
  >
    Learn more
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" aria-hidden="true">
      <path d="M14 3L5.99998 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.49998 3H14V8.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11 11V14H3V6H6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</article>

{#if showModal}
  <AnimeModal {anime} onClose={() => (showModal = false)} />
{/if}
