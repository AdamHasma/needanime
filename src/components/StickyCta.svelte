<script>
  let { isLoading, filterCount, onShow } = $props();
</script>

<div
  class="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
>
  <button
    type="button"
    title="Show results"
    disabled={isLoading}
    class="pointer-events-auto w-full max-w-md rounded-xl bg-primary px-8 py-4 font-display text-xl text-white shadow-[0px_0px_27px_1px_rgba(243,1,117,0.76)] transition-all duration-300 hover:bg-primary-hover hover:shadow-[0px_0px_37px_1px_rgba(243,1,117,1)] disabled:cursor-default disabled:opacity-80"
    onclick={onShow}
  >
    {#if isLoading}
      <svg
        class="inline-block"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <g fill="#fafafa">
          <g class="nc-loop-dots-24-icon-f">
            <circle cx="4" cy="12" fill="#fafafa" r="3" />
            <circle cx="12" cy="12" r="3" />
            <circle cx="20" cy="12" fill="#fafafa" r="3" />
          </g>
        </g>
      </svg>
    {:else}
      Show me!{filterCount > 0
        ? ` · ${filterCount} filter${filterCount > 1 ? "s" : ""}`
        : ""}
    {/if}
  </button>
</div>

<style>
  .nc-loop-dots-24-icon-f {
    --animation-duration: 1s;
  }
  .nc-loop-dots-24-icon-f * {
    opacity: 0.4;
    transform: scale(0.7);
  }
  .nc-loop-dots-24-icon-f :nth-child(1),
  .nc-loop-dots-24-icon-f :nth-child(3) {
    animation: nc-loop-dots-anim-2b var(--animation-duration) infinite linear;
  }
  .nc-loop-dots-24-icon-f :nth-child(1) {
    transform-origin: 4px 12px;
  }
  .nc-loop-dots-24-icon-f :nth-child(2) {
    animation: nc-loop-dots-anim-1b calc(var(--animation-duration) / 2)
      infinite linear;
    animation-delay: calc(var(--animation-duration) / 4);
    transform-origin: 12px 12px;
  }
  .nc-loop-dots-24-icon-f :nth-child(3) {
    animation-delay: calc(var(--animation-duration) / 2);
    transform-origin: 20px 12px;
  }
  @keyframes nc-loop-dots-anim-1b {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(0.7);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes nc-loop-dots-anim-2b {
    0%,
    100%,
    66% {
      opacity: 0.4;
      transform: scale(0.7);
    }
    33% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
