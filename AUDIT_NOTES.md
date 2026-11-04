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
- Node: 9 regression tests passed; none skipped.
- Chromium: 10 regression tests passed, including mounting 5 actual application routes, a cached review remount, and YouTube cleanup.
- Backend calls in these tests are mocked. Live Supabase/OAuth/AI and production hosting remain outside the verified results above.

The prepared source is available in the cloud checkout. Updated startup and verification instructions were saved to the environment draft. Publication is a separate platform action; no Publish tool is available in this chat. No production data was mutated.
