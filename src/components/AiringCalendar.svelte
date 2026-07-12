<script>
  import { airingScheduleQuery, fetchWithRetry } from "../lib/anilist.js";

  let isLoading = $state(true);
  let schedule = $state([]);

  $effect(() => {
    (async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const res = await fetchWithRetry("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: airingScheduleQuery,
            variables: { start: now, end: now + 7 * 24 * 60 * 60 },
          }),
        });
        const response = await res.json();
        if (response.errors) throw new Error(response.errors[0].message);
        schedule = response.data.Page.airingSchedules;
      } catch (error) {
        console.error(error);
      } finally {
        isLoading = false;
      }
    })();
  });

  const formatWhen = (airingAt) => {
    const date = new Date(airingAt * 1000);
    const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
    const time = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${weekday} ${time}`;
  };
</script>

{#if !isLoading && schedule.length > 0}
  <section class="mt-10 w-full max-w-6xl text-center">
    <h2 class="font-display text-3xl md:text-4xl">Airing this week</h2>
    <div class="mt-4 flex gap-3 overflow-x-auto pb-2 text-left">
      {#each schedule as entry (`${entry.media.id}-${entry.episode}`)}
        <a
          href={entry.media.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="w-36 flex-shrink-0 overflow-hidden rounded-xl border border-line bg-surface transition-[transform,border-color] duration-300 hover:scale-[1.03] hover:border-primary"
        >
          <div class="relative h-48">
            <img
              class="h-full w-full object-cover"
              src={entry.media.coverImage.large}
              alt={entry.media.title.romaji}
              loading="lazy"
            />
            <span
              class="absolute right-2 top-2 rounded-lg bg-primary px-2 py-1 text-xs font-bold text-white"
            >
              Ep {entry.episode}
            </span>
          </div>
          <div class="p-2">
            <p class="line-clamp-2 text-sm font-semibold leading-tight">
              {entry.media.title.romaji}
            </p>
            <p class="mt-1 text-xs text-text-muted">{formatWhen(entry.airingAt)}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
{/if}
