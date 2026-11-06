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

The compressed PDFs were subsequently received successfully (587 scanned pages). The active catalog now contains 812 reviewed lesson entries: 200 / 220 / 198 / 194 by book, reconciling 805 appendix rows and 807 lesson-table occurrences. All 40 lesson tables and 16 appendix pages were visually compared. Legacy source files remain in Git history and the repository, but their unverified extensions are no longer mixed into the PDF catalog. Scope, source hashes, corrections and per-lesson totals are recorded in the manifest and audit. Practice examples and reading passages remain supplementary content.

## Msutong intermediate catalog and flashcard recall

The Mandarin flashcard front no longer reveals pinyin; its answer face respects the existing pinyin toggle. The intermediate catalog adds 1,076 entries across 40 lessons and a separate level selector with level-preserving activity/resume URLs. All 1,072 appendix entries were transcribed from page images; four additional lesson-table names were added. Vietnamese meanings are editorial glosses and pinyin is dictionary-assisted with reviewed overrides. See [scope and reconstruction](docs/msutong/INTERMEDIATE.md) and [audit](docs/msutong/intermediate-data-audit.json).

## Msutong advanced catalog

Added 1,515 cards across four advanced books and 40 lessons, with every one of the 240 vocabulary tables visually transcribed (1,410 entries including constituent rows). Another 107 appendix source rows supplement or corroborate the lesson tables; every source occurrence is retained. Book 2 keeps its original English glosses and labels Vietnamese translations, while index-only Vietnamese glosses are editorial. See [scope and reproduction](docs/msutong/ADVANCED.md) and [table coverage audit](docs/msutong/advanced-data-audit.json).

Three-level activity selection, CSV downloads, flashcard citations, and resume labels now include advanced. Pronunciation skips placeholder patterns and wraps long entries. Validation: all three data audits, lint, typecheck, 23 Node tests, and 61 Chromium cases at 1440px and 320px passed. Browser tests use mocked Supabase clients.


## Textbook practice coverage and community catalogs

Added 534 authored sentences (with phrase tiles, Vietnamese translations and pinyin), plus 89 original passages and 178 comprehension questions. Supplementary content is stored separately from the reviewed PDF vocabulary and labelled in activities. All 120 Msutong lessons now have reading and at least six distinct sentences; all 277 lessons/groups across the six catalogs have at least six distinct completion/scramble sentences. Sentence completion hides full pinyin until answering and uses the translation to disambiguate the requested meaning. Scramble accepts declared alternative orders and shows explicit success feedback. Changing selections resets sentence/reading sessions.

Imported 4,796 community word-list entries: Boya Elementary II second edition (836), Hanyu Jiaocheng book 2 as labelled by its source file (1,046; edition unconfirmed), and HSK Standard Course 1–5 in seven volumes (2,914). These are partial series, not a verified replacement for every publisher book. Existing local examples are reused for matching words, with additional authored examples to fill two thin HSK groups. New catalogs support vocabulary activities, sentence practice, CSV export and selection-preserving navigation. There are no separate passages for every community chapter.

Xiehanzi.com remains inaccessible through the environment proxy (403 CONNECT); these lists come from public GitHub community repositories, not a direct clone of Xiehanzi. Source hashes, corrections, scope and licensing are recorded in [the library documentation](docs/textbooks/README.md). Boya's original CSV and GPL license are distributed with its derived export. No production database updates are needed.

Validation: rebuilding both data libraries and the coverage audit passed, all three PDF audits passed with unchanged catalog counts (812 / 1,076 / 1,515), lint and TypeScript passed, 25 Node tests passed, and 65 Chromium cases passed at both 1440px and 320px. Production build passed (Vite still reports large bundle chunks). Browser backend responses are mocked; AI-provider requests were not live-tested.

## Cantonese assigned lesson visibility

The library filtered paid-course lessons using only course grants, dropping lessons granted individually by `set_user_lesson_access`. Both the library and detail page now consult the existing `user_lesson_access` records with account-scoped cache keys. They share permission evaluation for direct grants, course grants, free lessons, creators and admins. Detail waits for grants before denying access and reports lookup errors; the library retry refreshes lesson grants too. Supabase RLS remains unchanged and authoritative.

Validation: lint, TypeScript, 25 Node tests, and 66 Chromium cases at 1440px and 320px passed. The library regression includes a directly assigned lesson inside an otherwise inaccessible course, and keeps an unrelated lesson hidden. Additional assertions cover creators, admins and logged-out users. Browser responses are mocked; live account data was not inspected.

## Textbook family navigation and legal information

The homepage and `/mandarin/textbooks` now present four families first: Msutong, Boya, Hanyu and HSK Standard Course. Choosing one opens its scoped catalog; only Msutong exposes the three-level selector. Existing level/book/lesson URLs and activity routes remain usable, and the header labels the entry “Giáo trình”.

Added five public legal pages and links from both homepages, the language gateway and login. Text reflects the supplied operator display name HaoHao, contact disneychanelmovie@gmail.com, no current course sales and no service for under-16s. Separate unchecked acknowledgements cover age, terms and necessary account data processing in email signup/Google access. Email signup metadata carries the policy version and timestamp; this is not an immutable legal audit log. Policies disclose Supabase projects, browser storage, AI, speech, third-party content and the lack of an automatic retention schedule.

See [the legal review and remaining operational work](docs/legal/REVIEW.md). Government legal sources are blocked by the environment proxy, so current legislation/guidance was not verified against primary text. This change does not establish legal compliance, supplier agreements, cross-border filings, copyright clearance or a durable OAuth consent record. Production account data and external filings were not changed.

Validation: lint, TypeScript, production build, 25 Node tests and 70 Chromium cases passed at desktop/320px. An additional 390px mobile run passed with visual inspection of textbook and policy screenshots. Vite continues to warn about existing large chunks.
