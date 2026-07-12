<script>
  let { fromYear, toYear, onSetFromYear, onSetToYear } = $props();

  const currentYear = new Date().getFullYear();
  const MIN_YEAR = 1963;
  // one extra step past the current year means "no upper bound"
  const MAX_YEAR = currentYear + 1;

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  // numeric handle positions derived from the string props;
  // an empty/invalid "to" sits on the "Any" stop at the far right
  const fromV = $derived.by(() => {
    const y = parseInt(fromYear, 10);
    return clamp(isNaN(y) ? MIN_YEAR : y, MIN_YEAR, MAX_YEAR);
  });
  const toV = $derived.by(() => {
    const y = parseInt(toYear, 10);
    return clamp(isNaN(y) ? MAX_YEAR : y, MIN_YEAR, MAX_YEAR);
  });

  const handleFrom = (e) => {
    onSetFromYear(String(Math.min(+e.target.value, toV)));
  };
  const handleTo = (e) => {
    const v = Math.max(+e.target.value, fromV);
    onSetToYear(v >= MAX_YEAR ? "" : String(v));
  };

  // when both thumbs overlap, the top input must be the one that can
  // still move: near the right edge that's "from", otherwise "to"
  const fromOnTop = $derived(fromV > (MIN_YEAR + MAX_YEAR) / 2);

  const pct = (v) => ((v - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
</script>

<section class="w-full">
  <h2 class="font-display text-3xl md:text-4xl">Release date</h2>
  <div class="mx-auto mt-6 flex w-full max-w-xl flex-col gap-3">
    <div class="flex items-baseline justify-between">
      <div class="flex flex-col items-start">
        <span class="font-semibold text-text-muted">From</span>
        <span class="text-xl font-bold tabular-nums">{fromV}</span>
      </div>
      <div class="flex flex-col items-end">
        <span class="font-semibold text-text-muted">To</span>
        <span class="text-xl font-bold tabular-nums">{toV >= MAX_YEAR ? "Any" : toV}</span>
      </div>
    </div>
    <div class="relative h-6">
      <!-- track -->
      <div class="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-surface-raised"></div>
      <!-- selected range -->
      <div
        class="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
        style="left: {pct(fromV)}%; width: {pct(toV) - pct(fromV)}%"
      ></div>
      <input
        type="range"
        aria-label="From year"
        min={MIN_YEAR}
        max={MAX_YEAR}
        value={fromV}
        class:on-top={fromOnTop}
        oninput={handleFrom}
      />
      <input
        type="range"
        aria-label="To year"
        min={MIN_YEAR}
        max={MAX_YEAR}
        value={toV}
        class:on-top={!fromOnTop}
        oninput={handleTo}
      />
    </div>
    <div class="flex justify-between text-sm font-semibold text-text-muted">
      <span>{MIN_YEAR}</span>
      <span>Any</span>
    </div>
  </div>
</section>

<style>
  /* two overlaid native sliders form the dual-handle range: the inputs
     ignore pointer events, only their thumbs catch them */
  input[type="range"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    background: none;
    pointer-events: none;
    appearance: none;
    -webkit-appearance: none;
  }

  input[type="range"].on-top {
    z-index: 1;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    border-radius: 9999px;
    background: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-background);
    cursor: grab;
    pointer-events: auto;
  }

  input[type="range"]::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    border-radius: 9999px;
    background: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-background);
    cursor: grab;
    pointer-events: auto;
  }

  input[type="range"]:active::-webkit-slider-thumb {
    cursor: grabbing;
  }

  input[type="range"]:active::-moz-range-thumb {
    cursor: grabbing;
  }
</style>
