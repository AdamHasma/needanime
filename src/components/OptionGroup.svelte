<script>
  let { title, options, selected, onSelect } = $props();
</script>

<section class="w-full">
  <h2 class="font-display text-3xl md:text-4xl">{title}</h2>
  <div class="mt-6 flex flex-wrap justify-center gap-2">
    {#each options as option (option.value)}
      <button
        type="button"
        aria-pressed={selected === option.value}
        class="min-w-32 rounded-lg px-5 py-3 font-semibold transition-colors duration-200
          {selected === option.value
          ? 'bg-primary text-white hover:bg-primary-hover'
          : 'bg-surface hover:bg-surface-raised'}"
        onclick={() => onSelect(option.value)}
      >
        {option.label}
      </button>
    {/each}
  </div>
</section>
