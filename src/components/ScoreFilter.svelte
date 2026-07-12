<script>
  let { selectedRating, onSelect } = $props();

  // simple array of numbers from 1 to 9 (10 is always the upper bound)
  const scoreRating = [1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<section class="w-full">
  <h2 class="font-display text-3xl md:text-4xl">
    Score of: {selectedRating > 0 ? selectedRating + " – 10" : "0 – 10"}
  </h2>
  <div class="mt-6 flex w-full flex-wrap gap-2">
    {#each scoreRating as score (score)}
      <button
        type="button"
        aria-pressed={selectedRating !== 0 && score >= selectedRating}
        class="min-w-12 flex-grow rounded-lg px-5 py-3 font-semibold transition-colors duration-200
          {selectedRating !== 0 && score >= selectedRating
          ? 'bg-primary text-white hover:bg-primary-hover'
          : 'bg-surface hover:bg-surface-raised'}"
        onclick={() => onSelect(score)}
      >
        {score}
      </button>
    {/each}
  </div>
</section>
