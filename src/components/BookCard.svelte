<script>
  import {
    coverUrl,
    fetchBookDescription,
    matchedSubjects,
    toTenScale,
  } from "../lib/openlibrary.js";

  let { book } = $props();

  let showSynopsis = $state(false);
  let description = $state(null);
  let descriptionLoaded = $state(false);

  // descriptions aren't part of the search response, so each one costs its
  // own request — only worth making when the synopsis is actually opened
  const toggleSynopsis = async () => {
    showSynopsis = !showSynopsis;
    if (!showSynopsis || descriptionLoaded) return;
    descriptionLoaded = true;
    try {
      description = await fetchBookDescription(book.key);
    } catch (error) {
      console.error(error);
    }
  };

  const author = $derived(book.author_name?.[0] ?? "Unknown author");
  const subjects = $derived(matchedSubjects(book));
  const score = $derived(
    book.ratings_average ? toTenScale(book.ratings_average) : null
  );
</script>

<article
  class="flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color] duration-300 hover:scale-[1.02] hover:border-primary"
>
  <div class="relative h-72">
    {#if book.cover_i}
      <img
        class="h-full w-full object-cover"
        src={coverUrl(book.cover_i)}
        alt={book.title}
        loading="lazy"
      />
    {:else}
      <div class="flex h-full w-full items-center justify-center bg-surface-raised text-text-muted">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 7v14" />
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
      </div>
    {/if}
    {#if score !== null}
      <span
        class="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-sm font-bold text-white"
        title="Average rating"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.94 6.26 6.87.84-5.07 4.73 1.32 6.79L12 17.27l-6.06 3.35 1.32-6.79-5.07-4.73 6.87-.84L12 2z" />
        </svg>
        {score}
      </span>
    {/if}
    <div
      class="absolute bottom-0 left-0 right-0 flex flex-col justify-end bg-gradient-to-t from-background to-background/0 p-3 pt-10"
    >
      <h3 class="text-left text-xl font-bold leading-tight">{book.title}</h3>
      <p class="text-left text-sm text-text-muted">{author}</p>
    </div>
  </div>

  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line p-3 text-sm text-text-muted">
    <span class="flex items-center gap-1.5" title="First published">
      <img src="/assets/calendar.svg" alt="" width="16" height="16" />
      {book.first_publish_year ?? "unknown"}
    </span>
    {#if book.number_of_pages_median}
      <span class="flex items-center gap-1.5" title="Length">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 7v14" />
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
        {book.number_of_pages_median} pages
      </span>
    {/if}
    <span class="flex items-center gap-1.5" title="Readers on Open Library">
      <img src="/assets/multiple.svg" alt="" width="16" height="16" />
      {book.readinglog_count?.toLocaleString("en-US") ?? "–"}
    </span>
  </div>

  {#if subjects.length > 0}
    <div class="flex flex-wrap gap-1 p-3 pb-0">
      {#each subjects.slice(0, 5) as subject (subject)}
        <span class="rounded border border-line px-1.5 py-0.5 text-xs text-text-muted">
          {subject}
        </span>
      {/each}
    </div>
  {/if}

  <button
    type="button"
    aria-expanded={showSynopsis}
    class="flex items-center p-3 transition-colors duration-200 hover:bg-surface-raised"
    onclick={toggleSynopsis}
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
      {#if description}
        {description.split(" ").slice(0, 50).join(" ")}...
      {:else if descriptionLoaded}
        No synopsis available
      {:else}
        Loading...
      {/if}
    </p>
  {/if}

  <a
    href="https://openlibrary.org{book.key}"
    target="_blank"
    rel="noopener noreferrer"
    title="Show more information"
    class="mt-auto flex w-full items-center justify-center gap-2 bg-background py-3 font-semibold transition-colors duration-200 hover:bg-surface-raised"
  >
    View on Open Library
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none" aria-hidden="true">
      <path d="M14 3L5.99998 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M8.49998 3H14V8.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M11 11V14H3V6H6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </a>
</article>
