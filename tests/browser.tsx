import MsutongPage from '../src/pages/MsutongPage';
import MsutongFlashcardPage from '../src/pages/msutong/MsutongFlashcardPage';
import { getVocabularyByMsutong } from '../src/data';
import MandarinBlogList from '../src/mandarin/pages/BlogPage';
import CantoneseBlogList from '../src/cantonese/pages/BlogPage';
import CantoneseSongDetail from '../src/cantonese/pages/SongDetail';
import MandarinFlashcardPage from '../src/pages/FlashcardPage';
import SongLibrary from '../src/components/learning/SongLibrary';
import DictionaryPage from '../src/pages/DictionaryPage';
import LearningHeader from '../src/components/layout/LearningHeader';
import CourseExplorer from '../src/components/home/CourseExplorer';
import PhraseCard from '../src/components/home/PhraseCard';
import CantoneseLessons from '../src/cantonese/pages/Lessons';
import { useRecentLesson } from '../src/hooks/useRecentLesson';
import { recentLessonKey } from '../src/lib/learningNavigation';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, useLocation, Link } from 'react-router-dom';
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
import '../src/globals.css';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { useLearningSession } from '../src/hooks/useLearningSession';
import LoginScreen from '../src/components/auth/LoginScreen';
import PasswordRecoveryScreen from '../src/components/auth/PasswordRecoveryScreen';
import UserManagement from '../src/components/admin/UserManagement';
import VocabularyNotebook from '../src/pages/VocabularyNotebook';
import { SessionContext as MandarinSessionContext } from '../src/components/SessionContextProvider.shared';
import { SessionContext as CantoneseSessionContext } from '../src/cantonese/components/providers/SessionContextProvider.shared';
import { notebookKey, notebookSnapshot, updateNotebook } from '../src/lib/notebook';
import ProfileEditor from '../src/components/auth/ProfileEditor';
import { useQuery } from '@tanstack/react-query';
import { useCourseAccess } from '../src/hooks/useCourseAccess';
import MandarinFlashcard from '../src/components/Flashcard';
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
    let single = false;
    const builder = new Proxy({}, { get: (_target, key) => key === 'then'
      ? (resolve: (result: unknown) => void) => setTimeout(() => resolve({ data: !single && ['songs', 'blog_posts', 'lessons'].includes(table) ? [value] : value, error: null, count: 0 }), 40)
      : () => { if (key === 'single' || key === 'maybeSingle') single = true; return builder; } });
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
  for (const [path, expected] of [['/', 'Chọn phương ngữ'], ['/mandarin', 'HSK'], ['/cantonese', 'Một câu tiếng Quảng'], ['/mandarin/blog/sample', 'Regression blog'], ['/cantonese/blog/sample', 'Regression blog'], ['/mandarin/notebook', 'Sổ từ tiếng Trung'], ['/cantonese/notebook', 'Sổ từ Quảng Đông'], ['/mandarin/forgot-password', 'Quên mật khẩu'], ['/cantonese/forgot-password', 'Quên mật khẩu'], ['/mandarin/update-password', 'Liên kết không hợp lệ'], ['/cantonese/update-password', 'Liên kết không hợp lệ'], ['/mandarin/login', 'Chào mừng bạn trở lại'], ['/cantonese/login', 'Chào mừng bạn trở lại'], ['/mandarin/songs', 'Để giai điệu dẫn đường'], ['/cantonese/songs', 'Để giai điệu dẫn đường'], ['/mandarin/blog', 'Góc đọc'], ['/cantonese/blog', 'Góc đọc'], ['/mandarin/dictionary', 'Tra một từ.'], ['/cantonese/lessons', 'Một bài học.'], ['/mandarin/hsk/1/flashcard', 'Flashcards HSK 1'], ['/mandarin/msutong', 'Học theo quyển.'], ['/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-1-lesson-1', 'Flashcard']]) {
    history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    await delay(50);
    await until(() => Boolean(host.textContent?.includes(expected))).catch(error => { throw new Error(`Route ${path}: ${String(error)}`); });
    assert(!host.textContent?.includes('Oops! Có lỗi xảy ra'), `Route crashed: ${path}`);
    assert(document.documentElement.scrollWidth <= window.innerWidth + 2, `Route overflows viewport: ${path} (${document.documentElement.scrollWidth}/${window.innerWidth})`);
  }
});

function fakeSession(id: string): Session {
  return { access_token: 'test-only-access', refresh_token: 'test-only-refresh', token_type: 'bearer', expires_in: 3600,
    user: { id, aud: 'authenticated', created_at: '2026-11-04T00:00:00Z', email: `${id}@example.test`, app_metadata: {}, user_metadata: {} } };
}
function setInput(selector: string, value: string) {
  const input = host.querySelector<HTMLInputElement>(selector);
  assert(input, `Missing input: ${selector}`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
  input!.dispatchEvent(new Event('input', { bubbles: true }));
}
function clickText(text: string, scope: ParentNode = host) {
  const button = [...scope.querySelectorAll<HTMLButtonElement>('button')].find(item => item.textContent?.trim() === text);
  assert(button, `Missing button: ${text}`); button!.click();
}
export function AuthProbe({ language }: { language: 'mandarin' | 'cantonese' }) {
  const { session, isLoading } = useLearningSession(language);
  return <output>{isLoading ? 'loading' : session?.user.id ?? 'signed-out'}</output>;
}
for (const language of ['mandarin', 'cantonese'] as const) {
  const sdk = language === 'mandarin' ? mandarin : cantonese;
  const Provider = language === 'mandarin' ? MandarinSession : CantoneseSession;
  await check(`${language} auth: stale initial response cannot undo sign-out or keep private caches`, async () => {
    const listeners = new Set<(event: AuthChangeEvent, session: Session | null) => void>();
    let initial!: (result: unknown) => void;
    sdk.auth.getSession = (() => new Promise(resolve => { initial = resolve; })) as never;
    sdk.auth.onAuthStateChange = ((callback: (event: AuthChangeEvent, session: Session | null) => void) => { listeners.add(callback); return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } }; }) as never;
    const query = client();
    const privateKey = language === 'mandarin' ? ['userPoints', 'old'] : ['cantonese', 'private', 'old'];
    const otherKey = language === 'mandarin' ? ['cantonese', 'keep'] : ['mandarin', 'keep'];
    query.setQueryData(privateKey, 'private'); query.setQueryData(otherKey, 'keep');
    try {
      root.render(<QueryClientProvider client={query}><Provider><AuthProbe language={language} /></Provider></QueryClientProvider>);
      await until(() => listeners.size > 0);
      for (const callback of listeners) assert(callback('SIGNED_IN', fakeSession('old')) === undefined, 'Auth callback must return synchronously');
      await until(() => host.querySelector('output')?.textContent === 'old');
      for (const callback of listeners) callback('SIGNED_OUT', null);
      initial({ data: { session: fakeSession('old') }, error: null });
      await until(() => host.querySelector('output')?.textContent === 'signed-out');
      assert(query.getQueryData(privateKey) === undefined, 'Private data must be removed on sign-out');
      assert(query.getQueryData(otherKey) === 'keep', 'Other language cache must survive');
    } finally { mockClient(sdk, language); }
  });
  await check(`${language} login: trimmed email, visible password, failure recovery, and duplicate-submit guard`, async () => {
    let calls = 0; let submittedEmail = ''; let settle!: (result: unknown) => void;
    sdk.auth.signInWithPassword = ((input: { email: string }) => { calls++; submittedEmail = input.email; return new Promise(resolve => { settle = resolve; }); }) as never;
    root.render(<MemoryRouter><LoginScreen client={sdk} language={language} session={null} isLoading={false} /></MemoryRouter>);
    await delay(30);
    setInput('#auth-email', 'Learner@example.test'); setInput('#auth-password', 'secret-password');
    await delay(10);
    host.querySelector<HTMLButtonElement>('[aria-label="Hiện mật khẩu"]')!.click();
    await delay(10); assert(host.querySelector<HTMLInputElement>('#auth-password')?.type === 'text', 'Password toggle must work');
    const form = host.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    assert(calls === 1 && submittedEmail === 'Learner@example.test', 'Only one request may be sent');
    settle({ data: { session: null }, error: new Error('Invalid login credentials') });
    await until(() => Boolean(host.querySelector('[role="alert"]')?.textContent?.includes('Email hoặc mật khẩu')));
    assert(!host.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled, 'Form must unlock after failure');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    assert(calls === 2, 'A failed login must be retryable');
    settle({ data: { session: fakeSession('new') }, error: null });
    await until(() => Boolean(host.textContent?.includes('Đăng nhập thành công')));
  });
  await check(`${language} signup: password confirmation and email verification without premature login`, async () => {
    let calls = 0;
    sdk.auth.signUp = (() => { calls++; return Promise.resolve({ data: { user: { identities: [{}] }, session: null }, error: null }); }) as never;
    root.render(<MemoryRouter><LoginScreen client={sdk} language={language} session={null} isLoading={false} /></MemoryRouter>);
    await delay(20); clickText('Tạo tài khoản'); await delay(20);
    setInput('#auth-email', 'new@example.test'); setInput('#auth-password', 'password12'); setInput('#auth-confirmation', 'password34'); await delay(10);
    host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await until(() => Boolean(host.textContent?.includes('Mật khẩu xác nhận không khớp')));
    assert(calls === 0, 'Mismatched passwords must never reach the SDK');
    setInput('#auth-confirmation', 'password12'); await delay(10);
    host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await until(() => Boolean(host.textContent?.includes('Hãy mở email')));
    assert(calls === 1 && host.textContent?.includes('Gửi lại email xác nhận'), 'Verification must be clearly actionable');
  });
  await check(`${language} password recovery: network rejection unlocks the form`, async () => {
    sdk.auth.resetPasswordForEmail = (() => Promise.reject(new Error('Network fetch failed'))) as never;
    root.render(<MemoryRouter><PasswordRecoveryScreen client={sdk} language={language} session={null} isLoading={false} /></MemoryRouter>);
    await delay(20); setInput('#reset-email', 'user@example.test'); await delay(10);
    host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await until(() => Boolean(host.querySelector('[role="alert"]')?.textContent?.includes('Kết nối')));
    assert(!host.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled, 'Recovery must unlock after network error');
  });
  await check(`${language} notebook: add/search words, grade once, and retry only missed words`, async () => {
    updateNotebook(notebookKey(language), () => []);
    root.render(<MemoryRouter><VocabularyNotebook language={language} /></MemoryRouter>);
    await delay(30);
    for (const word of [{ hanzi: '你好', pronunciation: 'hello', meaning: 'Xin chào' }, { hanzi: '再见', pronunciation: 'bye', meaning: 'Tạm biệt' }]) {
      setInput('#notebook-hanzi', word.hanzi); setInput('#notebook-pronunciation', word.pronunciation); setInput('#notebook-meaning', word.meaning); await delay(10);
      host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); await delay(30);
    }
    assert(host.querySelectorAll('article').length === 2, 'Both saved words must render');
    setInput('[aria-label="Tìm trong sổ từ"]', 'xin chao'); await delay(20);
    assert(host.querySelectorAll('article').length === 1, 'Vietnamese search should work without accents');
    setInput('[aria-label="Tìm trong sổ từ"]', ''); await delay(20); clickText('Luyện chọn nghĩa'); await delay(20);
    const first = host.querySelector('[aria-label="Ôn sổ từ"] h2')!.textContent!;
    const wrong = first === '你好' ? 'Tạm biệt' : 'Xin chào';
    clickText(wrong); clickText(wrong); await delay(20);
    assert(notebookSnapshot(notebookKey(language)).words.find(word => word.hanzi === first)?.attempts === 1, 'Double clicks must count only once');
    clickText('Từ tiếp theo'); await delay(20);
    const second = host.querySelector('[aria-label="Ôn sổ từ"] h2')!.textContent!;
    clickText(second === '你好' ? 'Xin chào' : 'Tạm biệt'); await delay(20); clickText('Xem kết quả'); await delay(20);
    assert(host.textContent?.includes('1/2'), 'Summary must reflect the actual answers');
    clickText('Ôn lại từ chưa nhớ'); await delay(20);
    assert(host.querySelector('[aria-label="Ôn sổ từ"] h2')!.textContent === first, 'Only the missed word should repeat');
    assert(host.querySelectorAll('[aria-label="Ôn sổ từ"] button').length >= 3, 'Retry keeps distractors from the original word set');
  });
  await check(`${language} notebook: switching accounts hides private words immediately`, async () => {
    const Context = language === 'mandarin' ? MandarinSessionContext : CantoneseSessionContext;
    updateNotebook(notebookKey(language, 'A'), () => [{ id: 'private', hanzi: '私密词', pronunciation: 'private', meaning: 'Private word', createdAt: '2026-11-04T00:00:00.000Z', attempts: 0, correct: 0 }]);
    updateNotebook(notebookKey(language, 'B'), () => []);
    const render = (id: string) => root.render(<MemoryRouter><Context.Provider value={{ session: fakeSession(id), isLoading: false }}><VocabularyNotebook language={language} /></Context.Provider></MemoryRouter>);
    render('A'); await until(() => Boolean(host.textContent?.includes('私密词')));
    render('B'); await delay(40);
    assert(!host.textContent?.includes('私密词'), 'Another account must not see the previous account notebook');
  });
}

function adminFixture(sdk: typeof mandarin, allow = true) {
  const actor = fakeSession('00000000-0000-0000-0000-000000000001');
  const ordinary = fakeSession('00000000-0000-0000-0000-000000000099');
  const rows = [{ id: actor.user.id, first_name: 'Admin', last_name: 'Tester', role: allow ? 'admin' : 'user' },
    ...Array.from({ length: 20 }, (_, i) => ({ id: `00000000-0000-0000-0000-${String(i + 2).padStart(12, '0')}`, first_name: `Learner ${i + 1}`, last_name: 'Test', role: 'user' }))];
  let lists = 0; const writes: string[] = [];
  sdk.auth.getUser = (() => Promise.resolve({ data: { user: actor.user }, error: null })) as never;
  sdk.from = ((table: string) => {
    const filters: Record<string, unknown> = {};
    let singular = false; let update: { role: string } | null = null; let range = [0, 19]; let pattern = '';
    const builder = new Proxy({}, { get: (_target, name) => {
      if (name === 'then') return (resolve: (value: unknown) => void) => setTimeout(() => {
        if (table === 'auth_users') return resolve({ data: rows.map(row => ({ id: row.id, email: `${row.first_name.replace(/ /g, '')}@example.test` })), error: null });
        if (update) {
          const row = rows.find(item => item.id === filters.id && item.role === filters.role);
          if (row) { row.role = update.role; writes.push(row.id); }
          return resolve({ data: row ? { id: row.id, role: row.role } : null, error: null });
        }
        if (singular) return resolve({ data: { role: filters.id === actor.user.id && allow ? 'admin' : 'user' }, error: null });
        lists++;
        let selected = rows.filter(row => !filters.role || row.role === filters.role);
        if (filters.id) selected = selected.filter(row => row.id === filters.id);
        if (pattern) {
          const parts = [...pattern.matchAll(/first_name\.ilike\."%([^"%]+)%"/g)].map(match => match[1].toLowerCase());
          selected = selected.filter(row => parts.every(part => `${row.first_name} ${row.last_name}`.toLowerCase().includes(part)));
        }
        resolve({ data: selected.slice(range[0], range[1] + 1), count: selected.length, error: null });
      }, singular && filters.id === actor.user.id ? 60 : 15);
      if (name === 'eq') return (key: string, value: unknown) => { filters[key] = value; return builder; };
      if (name === 'range') return (start: number, end: number) => { range = [start, end]; return builder; };
      if (name === 'or') return (value: string) => { pattern = value; return builder; };
      if (name === 'maybeSingle' || name === 'single') return () => { singular = true; return builder; };
      if (name === 'update') return (value: { role: string }) => { update = value; return builder; };
      return () => builder;
    } });
    return builder;
  }) as never;
  return { actor, ordinary, rows, writes, lists: () => lists };
}
for (const language of ['mandarin', 'cantonese'] as const) {
  const sdk = language === 'mandarin' ? mandarin : cantonese;
  const Context = language === 'mandarin' ? MandarinSessionContext : CantoneseSessionContext;
  await check(`${language} user management: pagination, search, self protection, and confirmed role changes`, async () => {
    const fixture = adminFixture(sdk);
    try {
      root.render(<QueryClientProvider client={client()}><Context.Provider value={{ session: fixture.actor, isLoading: false }}><UserManagement language={language} /></Context.Provider></QueryClientProvider>);
      await until(() => host.querySelectorAll('tbody tr').length === 20);
      const ownRow = [...host.querySelectorAll('tbody tr')].find(row => row.textContent?.includes('(Bạn)'))!;
      assert(ownRow.querySelector<HTMLButtonElement>('button')!.disabled, 'Admins must not change their own role');
      const target = [...host.querySelectorAll('tbody tr')].find(row => row.querySelector('td')?.textContent === 'Learner 1 Test')!;
      target.querySelector<HTMLButtonElement>('button')!.click(); await delay(30);
      assert(fixture.writes.length === 0, 'Opening confirmation must not change permissions');
      clickText('Hủy', document); await delay(30);
      assert(fixture.writes.length === 0, 'Cancelling must not change permissions');
      target.querySelector<HTMLButtonElement>('button')!.click(); await delay(30);
      const confirm = [...document.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent?.trim() === 'Xác nhận đổi quyền')!;
      confirm.click(); confirm.click();
      await until(() => fixture.writes.length === 1 && !document.querySelector('[role="alertdialog"]'));
      assert(fixture.rows[1].role === 'admin', 'Confirmed role change must be persisted');
      assert(fixture.writes.length === 1, 'Rapid confirm clicks must not duplicate mutations');
      await until(() => ![...host.querySelectorAll<HTMLButtonElement>('button')].find(button => button.textContent === 'Sau')!.disabled);
      clickText('Sau'); await until(() => Boolean(host.textContent?.includes('Trang 2 / 2')) && host.querySelectorAll('tbody tr').length === 1);
      setInput('[aria-label="Tìm người dùng"]', 'Nobody');
      await until(() => Boolean(host.textContent?.includes('Không tìm thấy người dùng phù hợp')));
    } finally { mockClient(sdk, language); }
  });
  await check(`${language} user management: a late admin response cannot expose data to the next account`, async () => {
    const fixture = adminFixture(sdk);
    const query = client();
    const render = (session: Session) => root.render(<QueryClientProvider client={query}><Context.Provider value={{ session, isLoading: false }}><UserManagement language={language} /></Context.Provider></QueryClientProvider>);
    try {
      render(fixture.actor); await delay(8); render(fixture.ordinary);
      await until(() => Boolean(host.textContent?.includes('Chỉ quản trị viên')));
      await delay(100);
      assert(host.querySelector('table') === null && fixture.lists() === 0, 'No user list may be fetched/rendered for the next non-admin account');
    } finally { mockClient(sdk, language); }
  });
}

export function ProfileEditorHarness({ language, session }: { language: 'mandarin' | 'cantonese'; session: Session }) {
  const sdk = language === 'mandarin' ? mandarin : cantonese;
  const profile = useQuery({ queryKey: [language, 'current-profile', session.user.id], queryFn: async () => {
    const { data } = await sdk.from('profiles').select('first_name,last_name,avatar_url').eq('id', session.user.id).maybeSingle();
    return data;
  } });
  return profile.data ? <ProfileEditor key={session.user.id} client={sdk} language={language} session={session} profile={profile.data} /> : <p>Loading editor</p>;
}
for (const language of ['mandarin', 'cantonese'] as const) {
  await check(`${language} profile: validate avatar, preserve drafts on refetch, and verify saving`, async () => {
    const sdk = language === 'mandarin' ? mandarin : cantonese;
    const account = fakeSession('profile-user');
    const stored = { id: account.user.id, first_name: 'Original', last_name: 'Name', avatar_url: '' };
    let writes = 0;
    sdk.auth.getUser = (() => Promise.resolve({ data: { user: account.user }, error: null })) as never;
    sdk.from = (() => {
      let update: Partial<typeof stored> | null = null;
      const builder = new Proxy({}, { get: (_target, name) => {
        if (name === 'then') return (resolve: (value: unknown) => void) => setTimeout(() => { if (update) { Object.assign(stored, update); writes++; } resolve({ data: { ...stored }, error: null }); }, 20);
        if (name === 'update') return (value: Partial<typeof stored>) => { update = value; return builder; };
        return () => builder;
      } }); return builder;
    }) as never;
    const query = client();
    try {
      root.render(<QueryClientProvider client={query}><ProfileEditorHarness language={language} session={account} /></QueryClientProvider>);
      await until(() => Boolean(host.querySelector('#profile-first')));
      setInput('#profile-first', 'Updated'); setInput('#profile-avatar', 'javascript:alert(1)'); await delay(15);
      host.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await until(() => Boolean(host.querySelector('[role="alert"]')?.textContent?.includes('http')));
      assert(writes === 0, 'Invalid avatar protocol must not reach the backend');
      stored.first_name = 'Changed remotely';
      await query.invalidateQueries({ queryKey: [language, 'current-profile', account.user.id] });
      assert(host.querySelector<HTMLInputElement>('#profile-first')!.value === 'Updated', 'Background refresh must not overwrite a draft');
      setInput('#profile-avatar', 'https://example.test/avatar.png'); await delay(15);
      const form = host.querySelector('form')!; form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await until(() => Boolean(host.textContent?.includes('Đã lưu thông tin cá nhân')));
      assert(writes === 1 && stored.first_name === 'Updated', 'Save must update the intended account once');
      assert(host.querySelector<HTMLInputElement>('#profile-first')!.value === 'Updated', 'Saved profile must remain visible');
    } finally { mockClient(sdk, language); }
  });
}
export function CourseAccessProbe() {
  const access = useCourseAccess('hsk_1');
  return <output>{access.isLoading ? 'loading' : access.data.hasAccess ? 'unlocked' : 'locked'}</output>;
}
await check('Mandarin course access follows the actual async result instead of caching initial denial', async () => {
  let allowed = true;
  mandarin.rpc = (() => new Promise(resolve => setTimeout(() => resolve({ data: allowed, error: null }), 70))) as never;
  mandarin.from = ((table: string) => {
    const builder = new Proxy({}, { get: (_target, name) => name === 'then' ? (resolve: (value: unknown) => void) => setTimeout(() => resolve({ data: table === 'courses' ? { id: 'course-one' } : { role: 'user' }, error: null }), 20) : () => builder });
    return builder;
  }) as never;
  const query = client();
  try {
    root.render(<QueryClientProvider client={query}><MandarinSessionContext.Provider value={{ session: fakeSession('learner'), isLoading: false }}><CourseAccessProbe /></MandarinSessionContext.Provider></QueryClientProvider>);
    await until(() => host.querySelector('output')?.textContent === 'unlocked');
    allowed = false;
    await query.invalidateQueries({ queryKey: ['checkCourseAccess', 'learner', 'course-one'] });
    await until(() => host.querySelector('output')?.textContent === 'locked');
  } finally { mockClient(mandarin, 'mandarin'); }
});

for (const language of ['mandarin', 'cantonese'] as const) {
  await check(`${language} flashcards: save to notebook without flipping and keep child keyboard actions separate`, async () => {
    updateNotebook(notebookKey(language), () => []);
    root.render(language === 'mandarin' ? <MandarinFlashcard hanzi="你好" pinyin="nǐ hǎo" meaning="Xin chào" /> : <Flashcard data={{ items: [{ word: '你好', jyutping: 'nei5 hou2', vi: 'Xin chào' }] }} />);
    await delay(25);
    host.querySelector<HTMLButtonElement>('[aria-label="Lưu từ 你好"]')!.click();
    await until(() => notebookSnapshot(notebookKey(language)).words.length === 1);
    const flip = host.querySelector('[role="button"]')!;
    assert(flip.getAttribute('aria-pressed') === 'false', 'Saving must not flip the flashcard');
    const sound = host.querySelector<HTMLButtonElement>('[aria-label="Nghe phát âm"]');
    assert(sound, 'Audio control must have an accessible label');
    sound!.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await delay(20);
    assert(flip.getAttribute('aria-pressed') === 'false', 'Child button keyboard events must not flip the parent');
  });
}
export function NavigationProbe() {
  const location = useLocation();
  return <output data-route>{location.pathname + location.hash}</output>;
}
export function RecentLessonProbe() {
  const recent = useRecentLesson('mandarin');
  return <output data-recent>{recent?.label ?? 'no-recent-lesson'}</output>;
}
await check('Course explorer changes level, filters skills, and recovers from empty searches', async () => {
  root.render(<MemoryRouter><CourseExplorer /></MemoryRouter>);
  await delay(25);
  clickText('HSK 4'); clickText('Nghe & nói'); await delay(20);
  let exercises = [...host.querySelectorAll<HTMLAnchorElement>('.exercise-choice')];
  assert(exercises.length === 3 && exercises.every(link => link.pathname.startsWith('/mandarin/hsk/4/')), 'All filtered exercises must use the selected level');
  clickText('Tất cả'); await delay(15);
  setInput('[aria-label="Tìm dạng bài tập"]', 'dien tu'); await delay(20);
  assert(host.querySelector<HTMLAnchorElement>('.exercise-choice')?.pathname === '/mandarin/hsk/4/fill-in-the-blank', 'Searching without accents must also match uppercase Đ');
  setInput('[aria-label="Tìm dạng bài tập"]', 'khong-co-bai-nay'); await delay(20);
  assert(host.querySelectorAll('.exercise-choice').length === 0 && host.textContent?.includes('Chưa tìm thấy'), 'Empty search needs an actionable state');
  clickText('Xóa bộ lọc và xem tất cả'); await delay(20);
  exercises = [...host.querySelectorAll<HTMLAnchorElement>('.exercise-choice')];
  assert(exercises.length === 10 && exercises.every(link => link.pathname.startsWith('/mandarin/hsk/4/')), 'Resetting filters must preserve the chosen level');
});
for (const language of ['mandarin', 'cantonese'] as const) {
  await check(`${language} quick search opens with Ctrl K and navigates by keyboard`, async () => {
    root.render(<QueryClientProvider client={client()}><MemoryRouter initialEntries={[`/${language}`]}><LearningHeader language={language} pronunciation onTogglePronunciation={() => {}} /><NavigationProbe /></MemoryRouter></QueryClientProvider>);
    await delay(30);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
    await until(() => Boolean(document.querySelector('[role="dialog"] [cmdk-input]')));
    const input = document.querySelector<HTMLInputElement>('[role="dialog"] [cmdk-input]')!;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'so tu');
    input.dispatchEvent(new Event('input', { bubbles: true })); await delay(25);
    assert(document.querySelector('[role="dialog"] [cmdk-item][data-selected="true"]')?.textContent?.includes('Sổ từ cá nhân'), 'Search should rank the notebook first without Vietnamese accents');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await until(() => host.querySelector('[data-route]')?.textContent === `/${language}/notebook`);
    await until(() => !document.querySelector('[role="dialog"]'));
  });
  await check(`${language} mobile menu closes after navigation and exposes the other language`, async () => {
    root.render(<QueryClientProvider client={client()}><MemoryRouter initialEntries={[`/${language}`]}><LearningHeader language={language} pronunciation onTogglePronunciation={() => {}} /><NavigationProbe /></MemoryRouter></QueryClientProvider>);
    await delay(25);
    host.querySelector<HTMLButtonElement>('[aria-label="Mở menu học tập"]')!.click();
    await until(() => Boolean(document.querySelector('[role="dialog"] nav')));
    const menu = document.querySelector('[role="dialog"]')!;
    const other = language === 'mandarin' ? '/cantonese' : '/mandarin';
    assert(menu.querySelector(`a[href="${other}"]`), 'Language switching must be available in the mobile menu');
    menu.querySelector<HTMLAnchorElement>(`a[href="/${language}/songs"]`)!.click();
    await until(() => host.querySelector('[data-route]')?.textContent === `/${language}/songs`);
    await until(() => !document.querySelector('[role="dialog"]'));
  });
  await check(`${language} phrase card reveals, saves, and resets when the suggestion changes`, async () => {
    updateNotebook(notebookKey(language), () => []);
    root.render(<MemoryRouter><PhraseCard language={language} /></MemoryRouter>); await delay(20);
    assert(!host.querySelector('[role="status"]'), 'Meaning starts hidden');
    clickText('Đoán nghĩa rồi chạm để xem'); await delay(20);
    assert(host.querySelector('[role="status"]')?.textContent === 'Cứ từ từ thôi', 'Reveal must show the current phrase meaning');
    clickText('Lưu từ'); await delay(20);
    assert(notebookSnapshot(notebookKey(language)).words[0]?.meaning === 'Cứ từ từ thôi', 'Saving must keep the actual phrase and meaning');
    host.querySelector<HTMLButtonElement>('[aria-label="Đổi câu gợi ý"]')!.click(); await delay(20);
    assert(!host.querySelector('[role="status"]'), 'Changing suggestions must hide the new meaning again');
  });
}
await check('Recent lesson is scoped to the current account and rejects invalid stored destinations', async () => {
  localStorage.setItem(recentLessonKey('mandarin', 'A'), '/mandarin/hsk/3/flashcard');
  localStorage.setItem(recentLessonKey('mandarin', 'B'), 'https://example.test/account');
  const render = (id: string) => root.render(<MemoryRouter initialEntries={['/mandarin']}><MandarinSessionContext.Provider value={{ session: fakeSession(id), isLoading: false }}><RecentLessonProbe /></MandarinSessionContext.Provider></MemoryRouter>);
  render('A'); await until(() => host.querySelector('[data-recent]')?.textContent === 'HSK 3 · Flashcard');
  render('B'); await delay(25);
  assert(host.querySelector('[data-recent]')?.textContent === 'no-recent-lesson', 'A new account must never inherit the previous account destination');
});
await check('Cantonese lesson library respects course access and supports accent-insensitive search and list view', async () => {
  const items = [
    { id: 'one', title: 'Chào buổi sáng', description: 'Lời chào', course_id: 'free', courses: { id: 'free', name: 'Nhập môn', is_free: true } },
    { id: 'two', title: 'Đi chợ', description: 'Mua sắm', course_id: 'paid', courses: { id: 'paid', name: 'Hội thoại', is_free: false } },
    { id: 'locked', title: 'Unavailable lesson', description: '', course_id: 'other', courses: { id: 'other', name: 'Khác', is_free: false } },
  ];
  cantonese.from = ((table: string) => {
    const builder = new Proxy({}, { get: (_target, name) => name === 'then' ? (resolve: (value: unknown) => void) => setTimeout(() => resolve({ data: table === 'lessons' ? items : [{ course_id: 'paid' }], error: null }), 20) : () => builder });
    return builder;
  }) as never;
  try {
    root.render(<QueryClientProvider client={client()}><MemoryRouter><CantoneseSessionContext.Provider value={{ session: fakeSession('reader'), isLoading: false }}><CantoneseLessons /></CantoneseSessionContext.Provider></MemoryRouter></QueryClientProvider>);
    await until(() => host.querySelectorAll('.library-lesson').length === 2);
    assert(!host.textContent?.includes('Unavailable lesson'), 'Courses without access must remain excluded');
    setInput('[aria-label="Tìm bài học"]', 'chao buoi sang'); await delay(25);
    assert(host.querySelectorAll('.library-lesson').length === 1 && host.textContent?.includes('Chào buổi sáng'), 'Vietnamese search should ignore accents');
    setInput('[aria-label="Tìm bài học"]', 'di cho'); await delay(20);
    assert(host.querySelector<HTMLAnchorElement>('.library-lesson')?.pathname === '/cantonese/lessons/two', 'Search must also match titles beginning with uppercase Đ');
    setInput('[aria-label="Tìm bài học"]', 'nothing'); await delay(20); clickText('Xóa bộ lọc'); await delay(20);
    assert(host.querySelectorAll('.library-lesson').length === 2, 'Reset must restore the accessible library');
    host.querySelector<HTMLButtonElement>('[aria-label="Xem dạng danh sách"]')!.click(); await delay(20);
    assert(host.querySelector('[aria-label="Xem dạng danh sách"]')?.getAttribute('aria-pressed') === 'true', 'View toggle must expose its selected state');
  } finally { mockClient(cantonese, 'cantonese'); }
});
for (const language of ['mandarin', 'cantonese'] as const) {
  await check(`${language} song library retries failed loads and searches titles or artists`, async () => {
    const sdk = language === 'mandarin' ? mandarin : cantonese;
    let failing = true;
    sdk.from = (() => {
      const builder = new Proxy({}, { get: (_target, name) => name === 'then' ? (resolve: (value: unknown) => void) => setTimeout(() => resolve(failing ? { data: null, error: { message: 'Test connection failure' } } : { data: [{ id: 'song-one', title: 'Một ngày mới', artist: 'Nghệ sĩ A' }, { id: 'song-two', title: 'Hello', artist: 'Đặng An' }], error: null }), 20) : () => builder });
      return builder;
    }) as never;
    try {
      root.render(<QueryClientProvider client={client()}><MemoryRouter><SongLibrary language={language} /></MemoryRouter></QueryClientProvider>);
      await until(() => Boolean(host.querySelector('[role="alert"]')));
      failing = false; clickText('Thử lại');
      await until(() => host.querySelectorAll('.library-lesson').length === 2);
      setInput('[aria-label="Tìm bài hát"]', 'nghe si'); await delay(20);
      assert(host.querySelectorAll('.library-lesson').length === 1, 'Artists should be searchable without accents');
      setInput('[aria-label="Tìm bài hát"]', 'dang an'); await delay(20);
      assert(host.querySelector<HTMLAnchorElement>('.library-lesson')?.pathname === `/${language}/songs/song-two`, 'Artist search must normalize uppercase Đ');
      setInput('[aria-label="Tìm bài hát"]', 'no-matching-song'); await delay(20); clickText('Xóa tìm kiếm'); await delay(20);
      assert(host.querySelectorAll('.library-lesson').length === 2, 'Empty search must offer a working reset');
      assert(host.querySelector<HTMLAnchorElement>('.library-lesson')?.pathname === `/${language}/songs/song-one`, 'Song links must stay in their own language');
    } finally { mockClient(sdk, language); }
  });
}
await check('Dictionary results save to the notebook and expose keyboard-accessible detail buttons', async () => {
  updateNotebook(notebookKey('mandarin'), () => []);
  mandarin.rpc = (() => Promise.resolve({ data: [{ id: 1, simplified: '你好', traditional: '你好', pinyin_number: 'ni3 hao3', pinyin_tone: 'nǐ hǎo', vietnamese: 'Xin chào', hsk_level: 1 }], error: null })) as never;
  mandarin.from = (() => {
    const builder = new Proxy({}, { get: (_target, name) => name === 'then' ? (resolve: (value: unknown) => void) => resolve({ data: [], count: 1, error: null }) : () => builder });
    return builder;
  }) as never;
  try {
    root.render(<QueryClientProvider client={client()}><MemoryRouter><DictionaryPage /></MemoryRouter></QueryClientProvider>);
    await delay(20); setInput('[aria-label="Tra từ điển"]', '你好');
    await until(() => Boolean(host.querySelector('[aria-label="Xem chi tiết từ 你好"]')));
    clickText('Lưu từ'); await delay(20);
    assert(notebookSnapshot(notebookKey('mandarin')).words[0]?.hanzi === '你好', 'Dictionary save must store the selected entry');
    assert(!document.querySelector('[role="dialog"]'), 'Saving a word must not unexpectedly open its detail dialog');
    host.querySelector<HTMLButtonElement>('[aria-label="Xem chi tiết từ 你好"]')!.click();
    await until(() => Boolean(document.querySelector('[role="dialog"]')));
    assert(document.querySelector('[role="dialog"]')?.textContent?.includes('Xin chào'), 'Details must show the selected entry');
  } finally { mockClient(mandarin, 'mandarin'); }
});
await check('HSK flashcard keyboard shortcuts leave search inputs alone and changing level resets the batch', async () => {
  root.render(<QueryClientProvider client={client()}><MemoryRouter initialEntries={['/mandarin/hsk/1/flashcard']}><MandarinSessionContext.Provider value={{ session: null, isLoading: false }}><PinyinProvider><Link data-change-level to="/mandarin/hsk/2/flashcard">Change level</Link><Routes><Route path="/mandarin/hsk/:level/flashcard" element={<MandarinFlashcardPage />} /></Routes></PinyinProvider></MandarinSessionContext.Provider></MemoryRouter></QueryClientProvider>);
  await until(() => Boolean(host.textContent?.includes('Flashcards HSK 1')));
  const before = host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow');
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
  await until(() => Boolean(document.querySelector('[role="dialog"] [cmdk-input]')));
  document.querySelector('[role="dialog"] [cmdk-input]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
  await delay(20);
  assert(host.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow') === before, 'Moving the search caret must not move the flashcard');
  document.querySelector('[role="dialog"] [cmdk-input]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
  await until(() => !document.querySelector('[role="dialog"]'));
  clickText('Đợt tiếp theo'); await delay(20);
  assert(host.querySelector('[role="combobox"]')?.textContent?.startsWith('Đợt 2'), 'Test must move beyond the first batch');
  host.querySelector<HTMLAnchorElement>('[data-change-level]')!.click();
  await until(() => Boolean(host.textContent?.includes('Flashcards HSK 2')));
  assert(host.querySelector('[role="combobox"]')?.textContent?.startsWith('Đợt 1'), 'A new HSK level must start in a valid first batch');
});
for (const language of ['mandarin', 'cantonese'] as const) for (const kind of ['songs', 'blog'] as const) {
  await check(`${language} ${kind} library recovers initial fetch failures and keeps loaded content during failed refreshes`, async () => {
    const sdk = language === 'mandarin' ? mandarin : cantonese;
    const query = client();
    let failing = true;
    const record = kind === 'songs' ? { id: 'song-one', title: 'Bài hát đã tải', artist: 'Nghệ sĩ' } : { ...post, title: 'Bài viết đã tải', excerpt: 'Nội dung hiện có', profiles: null };
    const title = record.title;
    sdk.from = (() => {
      const builder = new Proxy({}, { get: (_target, name) => name === 'then' ? (resolve: (value: unknown) => void) => setTimeout(() => resolve(failing ? { data: null, error: { message: 'TypeError: Failed to fetch' } } : { data: [record], error: null }), 20) : () => builder });
      return builder;
    }) as never;
    try {
      const Blog = language === 'mandarin' ? MandarinBlogList : CantoneseBlogList;
      root.render(<QueryClientProvider client={query}><MemoryRouter>{kind === 'songs' ? <SongLibrary language={language} /> : <Blog />}</MemoryRouter></QueryClientProvider>);
      await until(() => Boolean(host.querySelector('[role="alert"]')));
      assert(!host.textContent?.includes('TypeError'), 'Initial network failures must have a readable message and a retry action');
      failing = false; clickText('Thử lại');
      await until(() => Boolean(host.textContent?.includes(title)));
      failing = true;
      const key = kind === 'songs' ? language === 'mandarin' ? ['songs'] : ['cantonese', 'songs'] : language === 'mandarin' ? ['blog-posts', 'mandarin'] : ['cantonese', 'blog-posts', 'cantonese'];
      await query.refetchQueries({ queryKey: key });
      await until(() => Boolean(host.textContent?.includes('Đang hiển thị nội dung đã tải trước đó')));
      assert(host.textContent?.includes(title), 'A failed background refresh must not hide previously loaded content');
      assert(!host.textContent?.includes('TypeError'), 'Raw fetch errors must not replace content');
      failing = false; clickText('Thử lại');
      await until(() => !host.textContent?.includes('Đang hiển thị nội dung đã tải trước đó'));
      assert(host.textContent?.includes(title), 'Retry must keep the library usable');
    } finally { mockClient(sdk, language); }
  });
  await check(`${language} ${kind} details keep loaded content when refreshing fails`, async () => {
    const sdk = language === 'mandarin' ? mandarin : cantonese;
    const Context = language === 'mandarin' ? MandarinSessionContext : CantoneseSessionContext;
    const query = client();
    let failing = false;
    const song = { id: 'song-one', title: 'Bài hát vẫn còn', artist: 'Nghệ sĩ', youtube_video_id: null, lrc: '' };
    const article = { ...post, title: 'Bài viết vẫn còn', profiles: null };
    sdk.from = ((table: string) => {
      const content = table === 'songs' || table === 'blog_posts';
      const builder = new Proxy({}, { get: (_target, name) => name === 'then' ? (resolve: (value: unknown) => void) => setTimeout(() => resolve(content && failing ? { data: null, error: { message: 'TypeError: Failed to fetch' } } : { data: table === 'songs' ? song : table === 'blog_posts' ? article : [], error: null }), 20) : () => builder });
      return builder;
    }) as never;
    try {
      const Blog = language === 'mandarin' ? MandarinBlog : CantoneseBlog;
      const Song = language === 'mandarin' ? SongDetail : CantoneseSongDetail;
      const route = kind === 'songs' ? '/songs/:songId' : '/blog/:slug';
      root.render(<QueryClientProvider client={query}><MemoryRouter initialEntries={[kind === 'songs' ? '/songs/song-one' : '/blog/sample']}><Context.Provider value={{ session: null, isLoading: false }}><Routes><Route path={route} element={kind === 'songs' ? <Song /> : <Blog />} /></Routes></Context.Provider></MemoryRouter></QueryClientProvider>);
      const title = kind === 'songs' ? song.title : article.title;
      await until(() => Boolean(host.textContent?.includes(title)));
      const key = kind === 'songs' ? language === 'mandarin' ? ['song', 'song-one'] : ['cantonese', 'song', 'song-one'] : language === 'mandarin' ? ['blog-post', 'sample'] : ['cantonese', 'blog-post', 'sample'];
      failing = true; await query.refetchQueries({ queryKey: key });
      await until(() => Boolean(host.textContent?.includes('Đang hiển thị nội dung đã tải trước đó')));
      assert(host.textContent?.includes(title), 'Details must stay visible after a failed refresh');
      failing = false; clickText('Thử lại');
      await until(() => !host.textContent?.includes('Đang hiển thị nội dung đã tải trước đó'));
      assert(host.textContent?.includes(title), 'Successful retry must retain the original content');
    } finally { mockClient(sdk, language); }
  });
}
function renderMsutong(node: React.ReactNode, entry = '/mandarin/msutong', authenticated = true) {
  root.render(<QueryClientProvider client={client()}><MemoryRouter initialEntries={[entry]}><MandarinSessionContext.Provider value={{ session: authenticated ? fakeSession('msutong-learner') : null, isLoading: false }}><PinyinProvider>{node}</PinyinProvider></MandarinSessionContext.Provider></MemoryRouter></QueryClientProvider>);
}
await check('Msutong exposes all four books and passes exactly the selected lessons to activities', async () => {
  renderMsutong(<MsutongPage />); await delay(30);
  for (let book = 1; book <= 4; book++) {
    const selectBook = host.querySelector<HTMLButtonElement>(`[aria-label="Chọn Quyển ${book}"]`)!;
    selectBook.click(); await delay(20);
    const lessonId = `quyen-${book}-lesson-1`;
    host.querySelector<HTMLButtonElement>(`[aria-label="Quyển ${book} · Bài 1"]`)!.click(); await delay(20);
    const flashcard = host.querySelector<HTMLAnchorElement>('a[href*="/msutong/msutong-flashcard?"]');
    assert(flashcard, `Book ${book} must have an activity link`);
    assert(new URL(flashcard!.href).searchParams.get('lessonIds') === lessonId, 'Practice must receive the selected book/lesson');
    assert(host.textContent?.includes(`${getVocabularyByMsutong('so-cap', [lessonId]).length} mục từ theo PDF`), 'Counts must use the actual dataset');
    selectBook.click(); await delay(20);
    assert(!host.querySelector('a[href*="/msutong/msutong-flashcard?"]'), 'Unselecting a book must remove its hidden lesson selections');
  }
  clickText('Chọn cả 4 quyển'); await delay(20); clickText('Chọn tất cả bài'); await delay(20);
  assert(host.textContent?.includes('40 bài đã chọn · 812 mục từ'), 'Selecting all 40 lessons includes every reviewed PDF entry');
  assert(document.documentElement.scrollWidth <= window.innerWidth + 2, 'The full four-book selection must fit the viewport');
});
await check('Msutong restores legacy back-navigation URLs and rejects malformed lesson IDs', async () => {
  renderMsutong(<><Link data-invalid-msutong to="/mandarin/msutong?level=so-cap&bookSlugs=quyen-1&lessonIds=quyen-1-lesson-1junk">Liên kết lỗi</Link><MsutongPage /></>, '/mandarin/msutong?level=so-cap&lessonIds=quyen-2-lesson-3&step=exercise'); await delay(25);
  assert(host.querySelector('[aria-label="Chọn Quyển 2"]')?.getAttribute('aria-pressed') === 'true', 'Legacy URLs must restore their book');
  assert(host.querySelector('[aria-label="Quyển 2 · Bài 3"]')?.getAttribute('aria-pressed') === 'true', 'Legacy URLs must restore their lesson');
  assert(host.querySelector('a[href*="/msutong/msutong-flashcard?"]'), 'The restored selection must remain usable');
  host.querySelector<HTMLAnchorElement>('[data-invalid-msutong]')!.click(); await delay(20);
  assert(host.textContent?.includes('Một số mã bài'), 'Malformed lesson selections need a recovery message');
  assert(!host.querySelector('a[href*="/msutong/msutong-flashcard?"]'), 'Malformed IDs must not silently select another lesson');
});
await check('Msutong guest login keeps the book preselected from the homepage', async () => {
  const entry = '/mandarin/msutong?level=so-cap&bookSlugs=quyen-4';
  renderMsutong(<MsutongPage />, entry, false); await delay(25);
  const login = host.querySelector<HTMLAnchorElement>('main a[href*="/mandarin/login?"]')!;
  assert(login && new URL(login.href).searchParams.get('returnUrl') === entry, 'Signing in must return to the selected book');
});
await check('Msutong flashcards reset an out-of-date batch after changing lesson selection', async () => {
  renderMsutong(<><Link data-change-msutong to="/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-2-lesson-1">Đổi bộ bài</Link><Routes><Route path="/mandarin/msutong/msutong-flashcard" element={<MsutongFlashcardPage />} /></Routes></>, '/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-1-lesson-3');
  await until(() => Boolean(host.querySelector('[role="combobox"]')));
  clickText('Đợt tiếp theo'); await delay(20);
  assert(host.querySelector('[role="combobox"]')?.textContent?.startsWith('Đợt 2'), 'The test must move beyond the first batch');
  host.querySelector<HTMLAnchorElement>('[data-change-msutong]')!.click(); await delay(30);
  assert(host.querySelector('[role="combobox"]')?.textContent?.startsWith('Đợt 1'), 'Switching lessons must reset the batch');
  assert(host.querySelector('.flashcard-front p')?.textContent === getVocabularyByMsutong('so-cap', ['quyen-2-lesson-1'])[0].hanzi, 'The card must come from the new lesson');
  assert(document.documentElement.scrollWidth <= window.innerWidth + 2, 'Msutong controls must fit the viewport');
});
export function MsutongRecentProbe() {
  const recent = useRecentLesson('mandarin');
  return <><output data-msutong-recent>{recent?.href ?? ''}</output><Link data-next-msutong to="/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-3-lesson-2">Bộ tiếp theo</Link><Link data-home-msutong to="/mandarin">Trang học</Link></>;
}
await check('Msutong continue-learning retains query selection, including when only search parameters change', async () => {
  renderMsutong(<MsutongRecentProbe />, '/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-1-lesson-1');
  await until(() => Boolean(host.querySelector('[data-msutong-recent]')?.textContent?.includes('quyen-1-lesson-1')));
  host.querySelector<HTMLAnchorElement>('[data-next-msutong]')!.click();
  await until(() => Boolean(host.querySelector('[data-msutong-recent]')?.textContent?.includes('quyen-3-lesson-2')));
  host.querySelector<HTMLAnchorElement>('[data-home-msutong]')!.click(); await delay(20);
  assert(host.querySelector('[data-msutong-recent]')?.textContent?.includes('quyen-3-lesson-2'), 'Returning home must keep the complete last lesson URL');
});

await check('Mandarin flashcard keeps pinyin on the answer side and respects the visibility setting', async () => {
  root.render(<MandarinFlashcard hanzi="你好" pinyin="nǐ hǎo" meaning="Xin chào" showPinyin />);
  await delay(25);
  assert(host.querySelector('.flashcard-front')?.textContent?.trim() === '你好', 'The Hanzi side must not reveal pinyin');
  assert(host.querySelector('.flashcard-back')?.textContent?.includes('nǐ hǎo'), 'The answer side should retain pinyin');
  const flip = host.querySelector('[role="button"]')!;
  flip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  await delay(20);
  assert(flip.getAttribute('aria-pressed') === 'true', 'Keyboard flipping must reveal the answer');
  root.render(<MandarinFlashcard hanzi="你好" pinyin="nǐ hǎo" meaning="Xin chào" showPinyin={false} />);
  await delay(20);
  assert(!host.querySelector('.flashcard-back')?.textContent?.includes('nǐ hǎo'), 'Hide-pinyin must apply to the answer side');
});
await check('Msutong intermediate selection exposes 40 lessons, exports its catalog and clears selection on level change', async () => {
  renderMsutong(<MsutongPage />);
  await delay(25);
  clickText('Trung cấp'); await delay(25);
  clickText('Chọn cả 4 quyển'); await delay(20);
  clickText('Chọn tất cả bài'); await delay(25);
  assert(host.textContent?.includes('40 bài đã chọn · 1076 mục từ'), 'All intermediate entries must be selectable');
  const link = host.querySelector<HTMLAnchorElement>('a[href*="/msutong/msutong-flashcard?"]');
  assert(new URL(link!.href).searchParams.get('level') === 'trung-cap', 'Activities must retain the intermediate level');
  assert(host.querySelector('a[download]')?.getAttribute('href') === '/data/msutong-intermediate-vocabulary.csv', 'CSV must match the selected level');
  clickText('Sơ cấp'); await delay(25);
  assert(!host.querySelector('a[href*="/msutong/msutong-flashcard?"]'), 'A level change clears the earlier selections');
});
await check('Msutong flashcards switch levels without showing the other catalog', async () => {
  renderMsutong(<><Link data-intermediate-switch to="/mandarin/msutong/msutong-flashcard?level=trung-cap&lessonIds=quyen-1-lesson-1">Trung cấp</Link><Routes><Route path="/mandarin/msutong/msutong-flashcard" element={<MsutongFlashcardPage />} /></Routes></>, '/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-1-lesson-1');
  await delay(25);
  host.querySelector<HTMLAnchorElement>('[data-intermediate-switch]')!.click(); await delay(30);
  assert(host.querySelector('.flashcard-front p')?.textContent === getVocabularyByMsutong('trung-cap', ['quyen-1-lesson-1'])[0].hanzi, 'The selected level must supply the card');
  assert(host.querySelector('.flashcard-front p')?.textContent !== getVocabularyByMsutong('so-cap', ['quyen-1-lesson-1'])[0].hanzi, 'Beginner words must not leak into the intermediate lesson');
  assert(document.documentElement.scrollWidth <= window.innerWidth + 2, 'The page must fit the viewport');
});
(window as unknown as { __showDesignRoute: (path: string, dark: boolean) => Promise<void> }).__showDesignRoute = async (path, dark) => {
  const { default: App } = await import('../src/App');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  history.replaceState(null, '', path);
  root.render(<App />);
  window.dispatchEvent(new PopStateEvent('popstate'));
  await delay(700);
  document.documentElement.classList.toggle('dark', dark);
  if (!path.includes('#')) window.scrollTo({ top: 0, behavior: 'instant' });
  await delay(100);
};
(window as unknown as { __regressionResults: typeof results }).__regressionResults = results;
