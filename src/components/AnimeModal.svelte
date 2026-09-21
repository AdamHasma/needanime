<script>
  import { animeDetailQuery, fetchWithRetry, stripHtml } from "../lib/anilist.js";

  let { anime, onClose } = $props();

  let isLoading = $state(true);
  let hasError = $state(false);
  let details = $state(null);

  $effect(() => {
    (async () => {
      try {
        const res = await fetchWithRetry("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: animeDetailQuery,
            variables: { id: anime.id },
          }),
        });
        const response = await res.json();
        if (response.errors) throw new Error(response.errors[0].message);
        details = response.data.Media;
      } catch (error) {
        hasError = true;
        console.error(error);
      } finally {
        isLoading = false;
      }
    })();
  });

  // streaming links only — official site/social links aren't worth the space
  const streamingLinks = $derived(
    details?.externalLinks?.filter((link) => link.type === "STREAMING") ?? []
  );

  // anilist trailer ids occasionally carry stray whitespace
  const trailerUrl = $derived(
    details?.trailer?.site === "youtube"
      ? `https://www.youtube.com/watch?v=${details.trailer.id.trim()}`
      : null
  );
  const trailerThumb = $derived(
    details?.trailer?.site === "youtube"
      ? `https://img.youtube.com/vi/${details.trailer.id.trim()}/hqdefault.jpg`
      : null
  );

  const handleKeydown = (e) => {
    if (e.key === "Escape") onClose();
  };

  // only close when the backdrop itself was clicked, not bubbled clicks
  // from the dialog content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
  onclick={handleBackdropClick}
  role="presentation"
>
  <div
    class="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line bg-surface text-left md:flex-row"
    role="dialog"
    aria-modal="true"
    aria-label={anime.title.romaji}
    tabindex="-1"
  >
    <button
      type="button"
      title="Close"
      aria-label="Close"
      class="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-background/70 transition-colors duration-200 hover:bg-background"
      onclick={onClose}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>

    <img
      class="h-48 w-full flex-shrink-0 object-cover md:h-auto md:w-64"
      src={anime.coverImage.extraLarge}
      alt={anime.title.romaji}
    />

    <div class="overflow-y-auto p-5">
      <h3 class="pr-8 text-2xl font-bold leading-tight">{anime.title.romaji}</h3>

      <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
        {#if anime.averageScore !== null}
          <span class="flex items-center gap-1 font-bold text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.94 6.26 6.87.84-5.07 4.73 1.32 6.79L12 17.27l-6.06 3.35 1.32-6.79-5.07-4.73 6.87-.84L12 2z" />
            </svg>
            {anime.averageScore / 10}
          </span>
        {/if}
        <span>{anime.seasonYear ?? anime.startDate.year ?? "unknown"}</span>
        <span>{anime.format}</span>
        {#if !isLoading && details?.episodes}
          <span>{details.episodes} episodes</span>
        {/if}
        {#if !isLoading && details?.duration}
          <span>{details.duration} min/ep</span>
        {/if}
      </div>

      {#if anime.genres.length > 0}
        <div class="mt-3 flex flex-wrap gap-1">
          {#each anime.genres as genre (genre)}
            <span class="rounded border border-line px-1.5 py-0.5 text-xs text-text-muted">
              {genre}
            </span>
          {/each}
        </div>
      {/if}

      {#if anime.description}
        <p class="mt-3 text-sm text-text-muted">{stripHtml(anime.description)}</p>
      {/if}

      {#if isLoading}
        <div class="mt-4 space-y-2">
          <div class="h-4 w-1/3 animate-pulse rounded bg-surface-raised"></div>
          <div class="h-32 w-full animate-pulse rounded bg-surface-raised"></div>
        </div>
      {:else if hasError}
        <p class="mt-4 text-text-muted">Couldn't load more details right now.</p>
      {:else}
        {#if details.studios?.nodes?.[0] || details.source}
          <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
            {#if details.studios?.nodes?.[0]}
              <span>{details.studios.nodes[0].name}</span>
            {/if}
            {#if details.source}
              <span>Source: {details.source.replace(/_/g, " ")}</span>
            {/if}
          </div>
        {/if}

        {#if trailerUrl}
          <a
            href={trailerUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="relative mt-4 block aspect-video overflow-hidden rounded-lg"
          >
            <img src={trailerThumb} alt="Trailer" class="h-full w-full object-cover" />
            <span
              class="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors duration-200 hover:bg-black/10"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="black" fill-opacity="0.5" />
                <path d="M10 8l6 4-6 4V8z" />
              </svg>
            </span>
          </a>
        {/if}

        {#if streamingLinks.length > 0}
          <div class="mt-4 flex flex-wrap gap-2">
            {#each streamingLinks as link (link.url)}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold transition-colors duration-200 hover:bg-surface-raised"
              >
                {link.site}
              </a>
            {/each}
          </div>
        {/if}

        {#if details.recommendations?.nodes?.length > 0}
          <h4 class="mt-4 font-semibold">Similar anime</h4>
          <div class="mt-2 flex gap-3 overflow-x-auto pb-1">
            {#each details.recommendations.nodes as node (node.mediaRecommendation.id)}
              <a
                href={node.mediaRecommendation.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="w-28 flex-shrink-0 transition-transform duration-200 hover:scale-[1.03]"
                title={node.mediaRecommendation.title.romaji}
              >
                <img
                  class="h-40 w-28 rounded-lg object-cover"
                  src={node.mediaRecommendation.coverImage.large}
                  alt={node.mediaRecommendation.title.romaji}
                  loading="lazy"
                />
                <p class="mt-1 line-clamp-2 text-xs text-text-muted">
                  {node.mediaRecommendation.title.romaji}
                </p>
              </a>
            {/each}
          </div>
        {/if}
      {/if}

      <a
        href={anime.siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-4 flex items-center justify-center gap-2 rounded-lg bg-background py-3 font-semibold transition-colors duration-200 hover:bg-surface-raised"
      >
        View on AniList
      </a>
    </div>
  </div>
</div>
