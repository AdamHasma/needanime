# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

NeedAni.me — a single-page anime discovery app. The user sets filters (score, genres to include/exclude, type, release date range, status, sort order) and clicks "Show me!" to fetch matching anime from the public [AniList GraphQL API](https://docs.anilist.co/) (`https://graphql.anilist.co`, no auth, ~90 req/min) and render them as cards with pagination.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — serve the production build locally

There is no test suite, linter, or type checker configured in this project.

## Architecture

This is a Vite + Svelte 5 app:

- `index.html` — Vite entry point, loads `/src/main.js` as a module. Static `<link>`s point at the Google Fonts (Jersey 20/Poppins) and the favicon/manifest files in `public/`. Do not add unlayered stylesheets here — they override Tailwind's layered utilities (this is why normalize.css was removed; Tailwind v4's Preflight covers the reset).
- `src/main.js` — mounts `App.svelte` onto `document.body` using Svelte 5's `mount()` API and imports `src/app.css`.
- `src/App.svelte` — the orchestrator: owns all filter state, all handlers, `fetchAnime()`, and composes the components. There is no router and no external state store — everything is component state declared with `$state()`, passed to components via props and callback props.
- `src/lib/anilist.js` — the AniList GraphQL query (`animeQuery`), `fetchWithRetry`, `stripHtml`, the `genres` display array and the `anilistGenres` set.
- `src/components/` — one component per UI block: `ScoreFilter`, `GenreFilter`, `OptionGroup` (shared by Type/Status/Sort), `ReleaseDateFilter`, `StickyCta` (the fixed "Show me!" bar), `ResultsSection` (skeletons, empty/error states, pagination), `AnimeCard`.
- `src/app.css` — Tailwind v4 entry point (`@import "tailwindcss"`) plus a `@theme` block with the design tokens: dark palette (`--color-background/surface/surface-raised`), brand pink `--color-primary: #f30175`, `--color-include`/`--color-exclude` for the genre states, and the font tokens (`--font-display: Jersey 20`, `--font-sans: Poppins`). Also global `:focus-visible` ring and a `prefers-reduced-motion` kill switch. Tailwind v4 is CSS-first: there is no `tailwind.config.js`.
- `public/assets/` — SVG icons referenced by absolute path (e.g. `/assets/calendar.svg`).

### State and event conventions

- All mutable UI state uses Svelte 5 runes (`$state`, `$derived`); there are no `$:` reactive statements or stores.
- Event handlers use Svelte 5 property syntax (`onclick={...}`, `oninput={...}`), not the legacy `on:click` directive syntax.
- Selected/toggle buttons carry `aria-pressed`; simple show/hide toggles (e.g. the synopsis in `AnimeCard`) use component-local `$state`.
- Score scales differ between UI and API: the filter buttons and card display use MyAnimeList-style 0–10, but AniList's `averageScore` is 0–100 — `fetchAnime()` multiplies the selected rating by 10 (minus 1, since `averageScore_greater` is exclusive) and the card markup divides `averageScore` by 10. AniList `description` strings contain HTML tags, stripped via the `stripHtml` helper before display.
- `fetchAnime()` (in `App.svelte`) POSTs `animeQuery` to `https://graphql.anilist.co`, building the `variables` object from the filter state; unset filters are omitted from `variables` entirely so AniList ignores them (passing explicit `null` would filter differently). Requests go through `fetchWithRetry`, which retries 429/5xx responses twice with backoff; a final failure sets `apiError`, which switches the empty state to an API-unavailable message with a retry button. While loading, `ResultsSection` renders skeleton cards; the sticky CTA resets `currentPage` to 1, pagination keeps the page.

### Genre model

`genres` is a hardcoded array of arrays of `{ DisplayLabel: "AniList name" }` objects, grouped by category for layout purposes (each inner array renders as one centered flex-wrap row of content-sized chips). The keys are display labels (underscores render as spaces); the values are exact AniList genre/tag names — note `Harem` maps to the AniList tag `"Female Harem"` and `Game` to `"Video Games"`. AniList distinguishes genres from tags: the `anilistGenres` set lists which values are genres, and `fetchAnime()` splits the selections into `genre_in`/`genre_not_in` vs `tag_in`/`tag_not_in` accordingly. `selectedGenres` / `selectedExcludeGenres` hold these name strings directly and are mutually exclusive per genre (adding a genre to include removes it from exclude, and vice versa). In the UI each genre chip has two half-width overlay buttons (the user's own design — do not replace it): the left half excludes (`−`), the right half includes (`+`), and the active side shows `×` to clear the state again; the chip gets a green/red outline while active (`GenreFilter`).
