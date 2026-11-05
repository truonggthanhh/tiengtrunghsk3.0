# Source audit and regression checks

The audit ran full project-reference TypeScript checks and ESLint across the checkout, with targeted review of authentication, shared Mandarin/Cantonese data, exercises, gamification, and dictionary handlers.

## Fixed

- Blog detail hooks changed order after loading; both languages now render safely and execute the view-count RPC.
- Mandarin comments incorrectly required Cantonese auth and queried its database. Comment clients, sessions, moderation caches, and Cantonese query caches are now isolated.
- PostgREST to-one relations are normalized for profiles and lesson course access.
- Cantonese practice callbacks repeatedly triggered parent updates; flashcards now attach completion callbacks and multiple-choice number keys register functions correctly. Typing in inputs no longer triggers exercise hotkeys.
- Auth callbacks no longer await Supabase requests while holding the auth lock. Late profile and gamification responses cannot overwrite another account's state.
- Game dashboard passes required progress, streak, mission, and badge data. XP callbacks are available to game pages, and Mandarin rewards use compare-and-swap updates to avoid overwriting concurrent rewards.
- Achievement checks read refreshed point totals. Zero-day streaks and malformed quiz inputs no longer receive reward XP.
- Missions no longer fabricate progress on a random timer; reward eligibility no longer rejects completed targets.
- Card-pack handlers validate counts, use supported reward source names, persist fallback cards, and fail instead of reporting unsaved cards as collected. Legacy API handlers use a local server adapter contract, with broken imports and reward function calls corrected.
- Dictionary edge-function template syntax and invalid pagination/mode handling are fixed.
- Corrupt pinyin storage no longer crashes the app. Vocabulary/SRS types preserve textbook metadata, progress indicators expose their accessible value, and HanziWriter uses its supported load-error callback.
- Production builds now check the frontend, Vite configuration, maintenance scripts, and Node tests (`tsc -b`) instead of an empty root project.

## Follow-up fixes

- Resolved all reported ESLint errors and warnings using typed data, checked exceptions, and separate component/context exports.
- Validate generated exercise payloads with Zod before rendering or grading; string `false` is normalized correctly and out-of-range correct-choice indices are rejected.
- Review pages restore their state from cached query results and use stable attachment callbacks; the test covers an actual remount against the same query cache.
- YouTube pages share a loader and own one player/timer per song, disposing both on unmount. Playback callbacks no longer create leaking intervals.
- AI voice callbacks use the current chat session. Initialization and notification callbacks have stable dependencies, and analytics uses the selected language's backend.
- Streak updates run after points have loaded without creating a mutation/refetch loop. Textbook lesson selections remain stable between answer renders.
- Maintenance scripts and regression tests are included in TypeScript checking. Dictionary validator escape fixes are regression-tested.

## Reproduce

- `npm run typecheck`
- `npm run build`
- `npm test` — Node regression tests, including actual dictionary/card handler execution with mocked dependencies.
- `npm run test:browser` — starts temporary Vite/Chromium processes, exercises loading-to-content renders and exercise interactions, then cleans up. Requires local listening sockets and Chromium; use the supported execution approval mechanism if the command sandbox blocks these.
- `npm run lint` — passes with zero errors and zero warnings. No lint rules were disabled.

Browser and handler tests mock Supabase. They establish local behavior, not live database permissions or production deployment readiness.

## Remaining backend and feature limitations

- `src/pages/api` contains server handlers, but Vite does not register server routes. The local adapter type does not create a server. Hosting these endpoints requires an actual server adapter and server-only Supabase configuration.
- Several game screens still use local demonstration state (bosses, wheel spins, card collection, missions). Reload persistence and authoritative rewards require backend integration; removing the random mission timer does not implement real mission tracking.
- Unused helpers in `src/lib/gamification/eventHandler.ts` still explicitly throw for unimplemented card-pack/boss/wheel operations; they are not active page implementations.
- The checkout contains multiple historical `user_progress` schema definitions (exercise rows versus per-user XP). The schema installed in the live projects, RLS, RPCs, OAuth, AI credentials, and database migrations were not verified or changed. No production data was mutated.
- OAuth sign-in, microphone recognition, live AI calls, and authenticated end-to-end persistence need the actual services and accounts to validate.

## Verified locally

- ESLint: zero errors, zero warnings.
- TypeScript: frontend, Vite configuration, maintenance scripts, and Node regression tests.
- Node: 20 regression tests passed; none skipped.
- Chromium: the UI redesign passed 44 regression cases at widths 320, 390, 768, and 1440 pixels. Content recovery coverage extended the suite to 52 cases; Msutong navigation/selection coverage extends it to 57, verified at widths 320, 1280, and 1440 pixels. The route smoke case mounts 22 actual application routes; other cases cover both languages, account changes, auth failures, admin mutations, profile saves, notebooks, navigation/search, libraries, flashcard controls, cached review remounts, and YouTube cleanup.
- Backend calls in these tests are mocked. Live Supabase/OAuth/AI and production hosting remain outside the verified results above.

The prepared source is available in the cloud checkout. Updated startup and verification instructions were saved to the environment draft. Publication is a separate platform action; no Publish tool is available in this chat. No production data was mutated.


## Learning, account, and administration upgrade — 2026-11-04

- Both language sections now share validated email login, signup, confirmation resend, Google error handling, and password recovery screens. Login returns to a safe page in the same language; password reset is available at `/mandarin/forgot-password` and `/cantonese/forgot-password`.
- Session initialization subscribes before reading the initial session, ignores late initial responses, times out stalled initialization, and clears the relevant query caches on account changes, including changes between provider remounts. SDK auth callback detection is restricted to the matching language's routes. Progress initialization stops on failed lookups instead of inserting after a read error.
- Profile editing validates avatar URLs and names, preserves unsaved drafts during refetches, verifies the current account and the updated row, and invalidates the appropriate language's profile cache. Logout recovers from failures and prevents repeated requests.
- User management checks the current server profile role, keys queries and UI state by the acting account, supports name/full-ID search, role filters, and 20-row pages. Role changes require confirmation, prohibit editing one's own role, recheck the acting administrator, and use a conditional update. Email display degrades gracefully when the existing `auth_users` view is unavailable. Backend RLS remains the enforcement boundary; browser checks do not replace it.
- `/mandarin/notebook` and `/cantonese/notebook` provide separate local vocabulary notebooks per language and signed-in account (or guest). Save from dictionary/flashcards, add/edit/remove words, search without Vietnamese accents, filter weak/unreviewed words, review up to 20 words with flashcards or meaning questions, retry missed words, and export/import validated JSON backups. Capacity is 1,000 words per notebook. Data is stored in this browser; it is not synchronized through Supabase. Storage failures show a warning so learners can export before leaving.
- Headers and the Cantonese navigation now fit mobile screens; shared theme handling avoids language-switch resets. Flashcard child buttons and keyboard controls no longer flip cards unintentionally; dictionary and speaker controls have improved dark-mode contrast. Saved Jyutping settings survive initial mount.
- Mandarin course access now follows the actual asynchronous access query instead of freezing its initial denied state.

### Verification and deployment notes

Run the commands above, plus `HSK_TEST_MOBILE=1 npm run test:browser` for the mobile viewport. The viewport runs repeat the same browser cases; they are not distinct scenarios to add together. They use mocked Supabase responses. No production users or records were changed.

Live Google sign-in, confirmation email delivery, password recovery, RPC behavior, and database RLS have not been verified against either production Supabase project. Each project's Auth URL configuration must allow its intended production destinations in its own language namespace, including `/mandarin/update-password` or `/cantonese/update-password`. Existing backend/demo limitations listed above still apply.

Production build succeeds. Vite still reports large shared chunks; this upgrade does not claim a measured performance improvement. Source is prepared for GitHub; Vercel deployment is handled by the repository owner.


## Visual and UX redesign

See [UX_UI_UPGRADE.md](UX_UI_UPGRADE.md) for the shipped interfaces, interaction changes, screenshots, verification commands, and limits. The redesign uses shared navigation and learning libraries for both languages and does not change backend roles or production data.


## Content loading recovery — Supabase availability

The reported song/blog loading failure affected both languages. The owner confirmed that the Supabase projects needed restoration and that songs and posts reappeared after restoring the service. Opening a REST root without API headers is not a test of the application's authenticated REST request; the SDK sends the configured public API key automatically.

- Song/blog lists and detail pages now provide a readable failure state and an explicit retry action.
- A failed background refresh keeps already loaded content visible with a notice; a connection failure is not rendered as a newly empty library.
- Content queries may refetch on reconnect/window focus according to query freshness. Existing automatic retry defaults remain in effect.
- Song lists request only ID, title, and artist; lyrics are fetched by the detail page.
- Eight browser regressions cover initial failure/retry and failed background refreshes for both lists and detail pages in both languages.
- Supabase projects, API keys, server routing, and production records were not changed.

The final source passes lint, TypeScript, build, 16 Node tests, and 52 browser cases at desktop/mobile widths. Backend responses in automated tests are mocked. Live recovery was confirmed by the owner; direct production checks remain blocked by the cloud environment's network policy.


## Msutong navigation and existing-data audit

See [MSUTONG_RECOVERY.md](MSUTONG_RECOVERY.md) and [the generated inventory](docs/msutong-data-audit.json). The four books are visible from the Mandarin homepage and desktop navigation. Saved learning links retain their selected lessons, invalid IDs no longer match numeric prefixes, and changing flashcard selections resets the batch. Synonymous entries for the same Hanzi are excluded from distractors.

The source contains 1,309 existing rows across 40 lessons, including 600 rows from existing extension files; four within-lesson Hanzi/pinyin groups require review. No vocabulary rows were invented, removed, or marked as PDF-verified. All four supplied PDFs exceed the tool's 32 MiB transfer cap and could not be read. Full PDF extraction and completeness verification remain blocked pending smaller or split files.
