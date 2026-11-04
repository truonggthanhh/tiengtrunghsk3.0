import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase as mandarin } from '../src/integrations/supabase/client';
import { supabase as cantonese } from '../src/cantonese/integrations/supabase/client';
import { SessionContextProvider as MandarinSession } from '../src/components/SessionContextProvider';
import CantoneseSession from '../src/cantonese/components/providers/SessionContextProvider';
import MandarinBlog from '../src/mandarin/pages/BlogDetailPage';
import CantoneseBlog from '../src/cantonese/pages/BlogDetailPage';
import { GamificationProvider } from '../src/components/gamification/GamificationProvider';
import Dashboard from '../src/components/gamification/GamificationDashboard';
import Flashcard from '../src/cantonese/components/practice/Flashcard';
import MultipleChoice from '../src/cantonese/components/practice/MultipleChoice';
import useHotkeys from '../src/cantonese/hooks/useHotkeys';
import { PinyinProvider } from '../src/contexts/PinyinContext';
import { usePinyin } from '../src/contexts/PinyinContext.shared';
import { Progress } from '../src/components/ui/progress';

import ReviewPage from '../src/cantonese/pages/ReviewPage';
import SongDetail from '../src/pages/SongDetail';
const results: { name: string; passed: boolean; error?: string }[] = [];
const host = document.getElementById('root')!;
let root = createRoot(host);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const seen: string[] = [];
const post = { id: 'post-1', title: 'Regression blog', slug: 'sample', content: '<p>Safe article</p><img src=x onerror="window.injected=true">', published_at: '2026-01-01', tags: [], profiles: [{ first_name: 'Author', last_name: 'Test' }] };
let signedIn = false;
const user = { id: 'user-1' };
const progress = { user_id: user.id, total_xp: 120, current_level: 2, current_streak: 1, longest_streak: 3 };
function mockClient(client: typeof mandarin, language: string) {
  client.auth.getSession = async () => ({ data: { session: signedIn ? { user } : null }, error: null }) as never;
  client.auth.getUser = async () => ({ data: { user: signedIn ? user : null }, error: null }) as never;
  client.auth.onAuthStateChange = (() => ({ data: { subscription: { unsubscribe() {} } } })) as never;
  client.rpc = (() => Promise.resolve({ data: null, error: null })) as never;
  client.from = ((table: string) => {
    seen.push(`${language}:${table}`);
    const value = table === 'lessons' ? { user_id: 'user-1' } : table === 'review_tests' ? { payload: { fill_blank: [{ sentence: 'Fill _____', answer: 'sample' }], multichoice: [{ question: 'Cached review question', choices: ['A', 'B'], correct: 0 }], true_false: [{ statement: 'True statement', answer: true }], reorder: [{ words: ['我'], solution: ['我'] }] } } : table === 'songs' ? { id: 'song-1', title: 'Regression song', youtube_video_id: 'video-1', lrc: '[00:01.00]Lyric one' } : table === 'blog_posts' ? post : table === 'user_progress' ? progress : table === 'level_definitions' ? { id: 2, level_number: 2, xp_required: 100, title: 'Level 2' } : [];
    const builder = new Proxy({}, { get: (_target, key) => key === 'then'
      ? (resolve: (result: unknown) => void) => setTimeout(() => resolve({ data: value, error: null, count: 0 }), 40)
      : () => builder });
    return builder;
  }) as never;
}
mockClient(mandarin, 'mandarin'); mockClient(cantonese, 'cantonese');
async function check(name: string, run: () => Promise<void>) {
  try { await run(); results.push({ name, passed: true }); }
  catch (error) { results.push({ name, passed: false, error: String(error) }); }
  root.unmount(); host.innerHTML = ''; root = createRoot(host);
}
function client() { return new QueryClient({ defaultOptions: { queries: { retry: false } } }); }
for (const language of ['mandarin', 'cantonese']) {
  await check(`${language} blog: loading to article and correct comment client`, async () => {
    seen.length = 0;
    const Provider = language === 'mandarin' ? MandarinSession : CantoneseSession;
    const Blog = language === 'mandarin' ? MandarinBlog : CantoneseBlog;
    root.render(<QueryClientProvider client={client()}><MemoryRouter initialEntries={['/blog/sample']}><Provider><Routes><Route path="/blog/:slug" element={<Blog />} /></Routes></Provider></MemoryRouter></QueryClientProvider>);
    await delay(20);
    assert(host.textContent?.includes('Đang tải bài viết'), 'Must exercise the initial loading render');
    await delay(500);
    assert(host.textContent?.includes('Regression blog'), 'Article should render after loading without hook errors');
    assert(seen.includes(`${language}:blog_comments`), 'Comments must use this language Supabase project');
    assert(!seen.includes(`${language === 'mandarin' ? 'cantonese' : 'mandarin'}:blog_comments`), 'Comments must not cross projects');
    assert(!host.querySelector('[onerror]'), 'Article must be sanitized');
  });
}
await check('Gamification dashboard renders fetched missions and badges without missing-prop crashes', async () => {
  signedIn = true;
  root.render(<GamificationProvider><Dashboard /></GamificationProvider>);
  await delay(900);
  assert(host.textContent?.includes('Hành Trình Gamification'), 'Dashboard should render fetched progress');
  assert(!host.textContent?.includes('NaN'), 'XP must have numeric inputs');
});
await check('Exercise progress exposes the value and indicator class', async () => {
  root.render(<Progress value={35} indicatorClassName="exercise-color" />);
  await delay(30);
  assert(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') === '35', 'Accessible progress value is required');
  assert(host.querySelector('.exercise-color'), 'Exercise indicator class must be applied');
});
export function PracticeHarness({ mode }: { mode: 'flashcard' | 'choice' }) {
  const [hooks, setHooks] = React.useState<{ getScore: () => { score: number; total: number } } | null>(null);
  const [flip, setFlip] = React.useState<() => void>(() => () => {});
  const [prev, setPrev] = React.useState<() => void>(() => () => {});
  const [next, setNext] = React.useState<() => void>(() => () => {});
  const [pick, setPick] = React.useState<(i: number) => void>(() => () => {});
  const attach = React.useCallback((value: typeof hooks) => setHooks(value), []);
  const controls = React.useMemo(() => ({ setFlip, setPrev, setNext, setPick }), []);
  const data = React.useMemo(() => ({ items: mode === 'choice'
    ? [{ question: 'Question', choices: ['Yes', 'No'], correct: 0 }]
    : [{ word: '你好', vi: 'Xin chào' }] }), [mode]);
  useHotkeys({ onFlip: flip, onPrev: prev, onNext: next, onPick: pick });
  return <><input id="typing-test" /><output>{hooks ? `${hooks.getScore().score}/${hooks.getScore().total}` : 'unattached'}</output>
    {mode === 'choice' ? <MultipleChoice data={data} onAttach={attach} hotkeyControls={controls} />
      : <Flashcard data={data} onAttach={attach} hotkeyControls={controls} />}</>;
}
await check('Flashcards attach completion callbacks without a render loop', async () => {
  root.render(<PracticeHarness mode="flashcard" />);
  await delay(100);
  assert(host.querySelector('output')?.textContent === '0/1', 'Flashcard must expose its completion total');
  window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  await delay(30);
  assert(host.textContent?.includes('Xin chào'), 'Space must flip the card');
});
await check('Choice hotkeys register callbacks and do not consume input typing', async () => {
  root.render(<PracticeHarness mode="choice" />);
  await delay(100);
  host.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
  await delay(30);
  assert(host.querySelector('output')?.textContent === '0/1', 'Typing in an input must not select an answer');
  window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
  await delay(50);
  assert(host.querySelector('output')?.textContent === '1/1', 'Number key must select the first answer');
});
export function PinyinProbe() { const { showPinyin } = usePinyin(); return <output>{String(showPinyin)}</output>; }
await check('Corrupt saved pinyin preference does not crash the app', async () => {
  localStorage.setItem('showPinyin', 'invalid-json');
  root.render(<PinyinProvider><PinyinProbe /></PinyinProvider>);
  await delay(30);
  assert(host.querySelector('output')?.textContent === 'true', 'Corrupt preference must fall back to showing pinyin');
});
async function until(predicate: () => boolean) {
  for (let i = 0; i < 100; i++) { if (predicate()) return; await delay(40); }
  throw new Error('Timed out waiting for rendered content');
}
await check('Review exercises remain usable after remounting with a cached query', async () => {
  signedIn = false;
  const cachedClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
  const render = () => root.render(<QueryClientProvider client={cachedClient}><MemoryRouter initialEntries={['/review/lesson-1']}><CantoneseSession><Routes><Route path="/review/:lessonId" element={<ReviewPage />} /></Routes></CantoneseSession></MemoryRouter></QueryClientProvider>);
  render();
  await until(() => Boolean(host.textContent?.includes('Cached review question')));
  root.unmount(); host.innerHTML = ''; root = createRoot(host);
  render();
  await until(() => Boolean(host.textContent?.includes('Cached review question')));
  assert(host.querySelectorAll('input[type="radio"]').length === 2, 'Cached review must still render its choices');
});
await check('Song player owns one player and cleans it up on unmount', async () => {
  let created = 0; let destroyed = 0; let seeks = 0; let polls = 0;
  const previousApi = window.YT;
  window.YT = { PlayerState: { PLAYING: 1 }, Player: class {
    constructor() { created++; }
    destroy() { destroyed++; }
    getCurrentTime() { polls++; return 1; }
    seekTo() { seeks++; }
    playVideo() {}
  } };
  try {
    root.render(<QueryClientProvider client={client()}><MemoryRouter initialEntries={['/songs/song-1']}><Routes><Route path="/songs/:songId" element={<SongDetail />} /></Routes></MemoryRouter></QueryClientProvider>);
    await until(() => created === 1);
    await delay(220);
    assert(polls >= 1, 'Song player must update lyric timing');
    const lyric = [...host.querySelectorAll('div')].find(element => element.textContent?.trim() === 'Lyric one' && element.children.length === 0);
    lyric?.click();
    assert(seeks === 1, 'Clicking a lyric must seek the owned player');
    root.unmount(); host.innerHTML = ''; root = createRoot(host);
    const before = polls;
    await delay(180);
    assert(created === 1 && destroyed === 1, 'Player must be created and destroyed exactly once');
    assert(polls === before, 'Polling must stop after unmount');
  } finally { window.YT = previousApi; }
});
await check('Main app routes mount with their actual providers', async () => {
  signedIn = false;
  const { default: App } = await import('../src/App');
  history.replaceState(null, '', '/');
  root.render(<App />);
  for (const [path, expected] of [['/', 'Chọn phương ngữ'], ['/mandarin', 'HSK'], ['/cantonese', 'Quảng Đông'], ['/mandarin/blog/sample', 'Regression blog'], ['/cantonese/blog/sample', 'Regression blog']]) {
    history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    await until(() => Boolean(host.textContent?.includes(expected)));
    assert(!host.textContent?.includes('Oops! Có lỗi xảy ra'), `Route crashed: ${path}`);
  }
});
(window as unknown as { __regressionResults: typeof results }).__regressionResults = results;
