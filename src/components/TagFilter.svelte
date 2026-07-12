<script>
  import { tags } from "../lib/anilist.js";

  let {
    selectedTags,
    selectedExcludeTags,
    clickedIncludeBtn,
    clickedExcludeBtn,
    onInclude,
    onExclude,
    onToggleIncludeAll,
    onToggleExcludeAll,
  } = $props();

  // same include/exclude half-button interaction as GenreFilter, kept as a
  // separate component/state so the curated tag list doesn't interfere with
  // genre selection
</script>

<section class="w-full">
  <h2 class="font-display text-3xl md:text-4xl">Any specific themes?</h2>
  <p class="mx-auto mt-4 max-w-xl text-text-muted">
    Click <strong class="text-include">+</strong> to include a tag,
    <strong class="text-exclude">−</strong> to exclude it, and × to clear it
    again.
  </p>

  <div class="mt-6 grid grid-cols-1 gap-2 sm:auto-cols-fr sm:grid-flow-col">
    <button
      type="button"
      aria-pressed={clickedIncludeBtn}
      class="rounded-lg px-5 py-3 font-semibold transition-colors duration-200
        {clickedIncludeBtn
        ? 'bg-include/20 text-include hover:bg-include/30'
        : 'bg-surface hover:bg-surface-raised'}"
      onclick={onToggleIncludeAll}
    >
      {!clickedIncludeBtn ? "Include all" : "Uncheck all"}
    </button>
    <button
      type="button"
      aria-pressed={clickedExcludeBtn}
      class="rounded-lg px-5 py-3 font-semibold transition-colors duration-200
        {clickedExcludeBtn
        ? 'bg-exclude/20 text-exclude hover:bg-exclude/30'
        : 'bg-surface hover:bg-surface-raised'}"
      onclick={onToggleExcludeAll}
    >
      {!clickedExcludeBtn ? "Exclude all" : "Uncheck all"}
    </button>
  </div>

  {#each tags as tagGroup, groupIndex (groupIndex)}
    <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-none lg:auto-cols-fr lg:grid-flow-col">
      {#each tagGroup as tag (tag)}
        {#each Object.entries(tag) as [name, id] (id)}
          {@const included = selectedTags.includes(id)}
          {@const excluded = selectedExcludeTags.includes(id)}
          {@const label = name.replace(/_/g, " ")}
          <div
            class="relative rounded-lg bg-surface px-9 py-3 transition-colors duration-200
              {included
              ? 'outline outline-include'
              : excluded
                ? 'outline outline-exclude'
                : ''}"
          >
            {label}
            <!-- left half excludes (−), shows × to clear when active -->
            <button
              type="button"
              title={excluded ? `Clear ${label}` : `Exclude ${label}`}
              aria-label={excluded ? `Clear ${label}` : `Exclude ${label}`}
              aria-pressed={excluded}
              class="absolute inset-y-0 left-0 flex w-1/2 items-center justify-start rounded-l-lg pl-3 font-bold transition-colors duration-200 active:bg-background
                {excluded
                ? 'bg-exclude/10 hover:bg-surface-raised/80'
                : 'hover:bg-exclude/50'}"
              onclick={() => onExclude(id)}
            >
              {excluded ? "×" : "−"}
            </button>
            <!-- right half includes (+), shows × to clear when active -->
            <button
              type="button"
              title={included ? `Clear ${label}` : `Include ${label}`}
              aria-label={included ? `Clear ${label}` : `Include ${label}`}
              aria-pressed={included}
              class="absolute inset-y-0 right-0 flex w-1/2 items-center justify-end rounded-r-lg pr-3 font-bold transition-colors duration-200 active:bg-background
                {included
                ? 'bg-include/10 hover:bg-surface-raised/80'
                : 'hover:bg-include/50'}"
              onclick={() => onInclude(id)}
            >
              {included ? "×" : "+"}
            </button>
          </div>
        {/each}
      {/each}
    </div>
  {/each}
</section>
