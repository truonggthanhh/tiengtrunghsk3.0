import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { oneRelation } from '../src/lib/relations';
import { XP_REWARDS, calculateLevel } from '../src/lib/gamification/xpRules';

test('to-one relations accept object, array, and missing results', () => {
  const profile = { first_name: 'Test' };
  assert.equal(oneRelation(profile), profile);
  assert.equal(oneRelation([profile]), profile);
  assert.equal(oneRelation([]), null);
  assert.equal(oneRelation(null), null);
  assert.equal(oneRelation(undefined), null);
});

test('zero-day streaks and invalid quiz results never award XP', () => {
  for (const streak of [0, -7, NaN, Infinity, 1.5]) assert.equal(XP_REWARDS.streak_milestone(streak), 0);
  assert.equal(XP_REWARDS.streak_milestone(7), 100);
  assert.equal(XP_REWARDS.streak_milestone(30), 500);
  assert.equal(XP_REWARDS.streak_milestone(100), 1000);
  for (const [score, total] of [[0, 0], [-1, 10], [11, 10], [NaN, 10], [1, Infinity]]) assert.equal(XP_REWARDS.quiz_complete(score, total), 0);
  assert.equal(XP_REWARDS.quiz_complete(10, 10), 100);
  assert.equal(XP_REWARDS.quiz_complete(9, 10), 80);
});

test('level boundaries match the accumulated XP thresholds', () => {
  assert.equal(calculateLevel(99), 1);
  assert.equal(calculateLevel(100), 2);
  assert.equal(calculateLevel(249), 2);
  assert.equal(calculateLevel(250), 3);
  assert.equal(calculateLevel(20000), 10);
});

// Execute the actual Deno handler with only its remote imports and environment stubbed.
// This covers syntax as well as validation without requiring a live Supabase project.
function dictionaryHandler() {
  const source = readFileSync(new URL('../supabase/functions/dictionary-lookup/index.ts', import.meta.url), 'utf8')
    .replace(/^import .* from .*$/gm, '');
  let handler: (request: Request) => Promise<Response>;
  let calls = 0;
  const context = vm.createContext({
    URL, Response, console,
    Deno: { env: { get: () => 'test' } },
    serve: (callback: typeof handler) => { handler = callback; },
    createClient: () => { calls++; throw new Error('Validation should run before database access'); },
  });
  vm.runInContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText, context);
  return { request: (query: string) => handler(new Request(`https://example.test/dictionary?${query}`)), calls: () => calls };
}

test('dictionary rejects malformed pagination and unsupported search modes without database access', async () => {
  const api = dictionaryHandler();
  for (const query of ['q=test&page=nope', 'q=test&page=1.5', 'q=test&pageSize=NaN', 'q=test&page=-1', 'q=test&pageSize=0', 'q=test&mode=other', 'q=test&page=9007199254740991&pageSize=30', 'page=1']) {
    const response = await api.request(query);
    assert.equal(response.status, 400, query);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  }
  assert.equal(api.calls(), 0);
});

function cardPackHandler(failInsert = false) {
  const source = readFileSync(new URL('../src/pages/api/gamification/cards/open-pack.ts', import.meta.url), 'utf8')
    .replace(/^import .* from .*$/gm, '').replace(/import\.meta\.env\.\w+/g, "'test'").replace('export const POST', 'const POST');
  let saved = 0;
  const db = {
    auth: { getUser: async () => ({ data: { user: { id: 'user' } }, error: null }) },
    from: () => {
      const chain = {
        select: () => chain, eq: () => chain,
        limit: async () => ({ data: saved === 0 ? [{ id: 'common-card' }] : [], error: null }),
        insert: () => { saved++; return chain; },
        single: async () => ({ data: failInsert ? null : { id: 'saved-card', card_id: 'common-card' }, error: failInsert ? new Error('Insert denied') : null }),
      };
      return chain;
    },
  };
  const context = vm.createContext({ Response, console: { error() {} }, createClient: () => db, selectRarityByWeight: () => 'common' });
  vm.runInContext(ts.transpileModule(source + '\nglobalThis.handler = POST;', { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText, context);
  return { saved: () => saved, request: (pack_size: unknown) => context.handler({ request: new Request('https://example.test/cards', { method: 'POST', body: JSON.stringify({ pack_size }) }), cookies: { get: () => ({ value: 'test-token' }) } }) as Promise<Response> };
}

test('card pack rejects invalid counts before saving any cards', async () => {
  const api = cardPackHandler();
  for (const size of [-1, 0, 1.5, 101, '3']) assert.equal((await api.request(size)).status, 400);
  assert.equal(api.saved(), 0);
});

test('card pack never reports an unsaved card as successfully collected', async () => {
  assert.equal((await cardPackHandler(true).request(1)).status, 500);
  const api = cardPackHandler();
  const response = await api.request(1);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).cards[0].id, 'saved-card');
  assert.equal(api.saved(), 1);
});

test('external errors are normalized without assuming the thrown value is an Error', async () => {
  const { toError } = await import('../src/lib/errors');
  assert.equal(toError({ message: 'SDK error' }).message, 'SDK error');
  assert.equal(toError('Network error').message, 'Network error');
  assert.ok(toError(null) instanceof Error);
});

test('generated exercise payloads reject invalid answers and normalize false correctly', async () => {
  const { multipleChoiceSchema, trueFalseSchema, fillBlankSchema } = await import('../src/cantonese/lib/exercisePayload');
  assert.equal(multipleChoiceSchema.safeParse({ items: [{ question: '?', choices: ['A'], correct: 3 }] }).success, false);
  assert.equal(fillBlankSchema.safeParse({ items: [{ sentence: '_____', answer: '' }] }).success, false);
  assert.equal(trueFalseSchema.parse({ items: [{ statement: 'Test', answer: 'false' }] }).items[0].answer, false);
});

test('maintenance dictionary validators accept hyphens without corrupting pinyin identifiers', () => {
  const source = readFileSync(new URL('../scripts/check-dictionary-errors.ts', import.meta.url), 'utf8')
    .replace(/^import .* from .*$/gm, '').replace(/\nmain\(\)\.catch[\s\S]*$/, '');
  const context = vm.createContext({ console, process: { env: {} }, createClient: () => ({}) });
  vm.runInContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText, context);
  assert.equal(context.isValidPinyin('píng-ān').valid, true);
  assert.equal(context.isValidHanzi('你好').valid, true);
  assert.equal(context.isValidPinyin('bad!').valid, false);
});

test('login return destinations stay inside their language and never loop back to auth', async () => {
  const { safeReturnPath, isAuthRouteForLanguage } = await import('../src/lib/auth/navigation');
  assert.equal(safeReturnPath('/mandarin/hsk/2/flashcard?count=10#word', 'mandarin'), '/mandarin/hsk/2/flashcard?count=10#word');
  for (const value of ['//evil.test', 'https://evil.test', '/cantonese/lessons', '/mandarin/../../evil', '/mandarin/login?returnUrl=/mandarin/login', '/mandarin/forgot-password', '/mandarin\\evil', '/mandarin/\nfoo']) assert.equal(safeReturnPath(value, 'mandarin'), '/mandarin', value);
  assert.equal(isAuthRouteForLanguage('/cantonese/login', 'mandarin'), false);
  assert.equal(isAuthRouteForLanguage('/cantonese/login', 'cantonese'), true);
  assert.equal(isAuthRouteForLanguage('/mandarinish', 'mandarin'), false);
});

test('OAuth cleanup preserves route filters, state, and ordinary anchors', async () => {
  const { cleanAuthUrl } = await import('../src/lib/auth/navigation');
  assert.equal(cleanAuthUrl('https://app.test/cantonese/lessons?lessonIds=1,2&code=abc&state=oauth#lesson'), '/cantonese/lessons?lessonIds=1%2C2#lesson');
  assert.equal(cleanAuthUrl('https://app.test/mandarin/hsk/1?returnUrl=%2Fmandarin#word'), '/mandarin/hsk/1?returnUrl=%2Fmandarin#word');
  const cleaned = cleanAuthUrl('https://app.test/cantonese/update-password?theme=dark#access_token=secret&refresh_token=other&type=recovery&keep=yes');
  assert.equal(cleaned, '/cantonese/update-password?theme=dark#keep=yes');
  assert.ok(!cleaned.includes('secret'));
});

test('private query invalidation keeps the other language intact', async () => {
  const { isLanguageQuery } = await import('../src/lib/auth/navigation');
  assert.equal(isLanguageQuery(['cantonese', 'admin-users'], 'mandarin'), false);
  assert.equal(isLanguageQuery(['blog-comments', 'cantonese', 'id'], 'mandarin'), false);
  assert.equal(isLanguageQuery(['userPoints', 'old-user'], 'mandarin'), true);
  assert.equal(isLanguageQuery(['blog-comments', 'mandarin', 'id'], 'mandarin'), true);
});

test('admin user filters escape PostgREST punctuation and distinguish exact UUID lookups', async () => {
  const { userNameFilter, isFullUserId, userDisplayName } = await import('../src/lib/adminUsers');
  assert.equal(isFullUserId('00000000-0000-0000-0000-000000000001'), true);
  assert.equal(isFullUserId('00000000'), false);
  assert.ok(userNameFilter('Lan Anh').includes('and(or('));
  assert.ok(userNameFilter('a"b%').includes('a\\"b\\%'));
  assert.equal(userDisplayName({ first_name: null, last_name: null }), 'Chưa có tên');
});

test('notebook imports validate language, totals, size, and duplicate identities', async () => {
  const { parseNotebookFile, mergeNotebookWords, notebookMatches, notebookKey, reviewChoices } = await import('../src/lib/notebook');
  const first = { id: 'one', hanzi: '你好', pronunciation: 'nǐ hǎo', meaning: 'Xin chào', createdAt: '2026-11-04T00:00:00.000Z', attempts: 2, correct: 1 };
  const second = { ...first, id: 'two', hanzi: '再见', meaning: 'Tạm biệt' };
  const text = JSON.stringify({ version: 1, language: 'mandarin', words: [first, { ...first, id: 'duplicate' }, second] });
  assert.equal(parseNotebookFile(text, 'mandarin').length, 2);
  assert.throws(() => parseNotebookFile(text, 'cantonese'), /ngôn ngữ khác/);
  assert.throws(() => parseNotebookFile('x'.repeat(1_000_001), 'mandarin'), /quá lớn/);
  assert.throws(() => parseNotebookFile('{broken', 'mandarin'), /JSON/);
  assert.throws(() => parseNotebookFile(JSON.stringify({ version: 1, language: 'mandarin', words: [{ ...first, correct: 10 }] }), 'mandarin'), /không hợp lệ/);
  assert.equal(mergeNotebookWords([first], [first, second]).length, 2);
  assert.equal(notebookMatches(first, 'xin chao'), true);
  assert.notEqual(notebookKey('mandarin', 'A'), notebookKey('cantonese', 'A'));
  assert.notEqual(notebookKey('mandarin', 'A'), notebookKey('mandarin', 'B'));
  const choices = reviewChoices(first, [first, second, { ...second, id: 'third' }], () => 0.5);
  assert.equal(new Set(choices).size, choices.length);
  assert.ok(choices.includes(first.meaning));
});


test('recent learning destinations accept known learning routes and isolate languages and accounts', async () => {
  const { describeRecentLesson, recentLessonKey } = await import('../src/lib/learningNavigation');
  assert.equal(describeRecentLesson('/mandarin/hsk/2/flashcard?returnUrl=evil', 'mandarin')?.href, '/mandarin/hsk/2/flashcard');
  for (const path of ['//evil.test', 'https://evil.test', '/mandarin/login', '/mandarin/admin', '/mandarin/hsk/99/flashcard', '/mandarin/hsk/1/not-an-exercise', '/cantonese/lessons/one']) assert.equal(describeRecentLesson(path, 'mandarin'), null);
  assert.equal(describeRecentLesson('/cantonese/practice/lesson-one/flashcard', 'cantonese')?.href, '/cantonese/practice/lesson-one/flashcard');
  assert.notEqual(recentLessonKey('mandarin', 'A'), recentLessonKey('mandarin', 'B'));
  assert.notEqual(recentLessonKey('mandarin', 'A'), recentLessonKey('cantonese', 'A'));
});


test('Vietnamese navigation search handles uppercase Đ, decomposed accents, spacing, and Chinese characters', async () => {
  const { normalizeSearchText } = await import('../src/lib/searchText');
  assert.equal(normalizeSearchText('ĐIỀN TỪ'), 'dien tu');
  assert.equal(normalizeSearchText('  Đặng   An  '), 'dang an');
  assert.equal(normalizeSearchText('Lời chào'.normalize('NFD')), 'loi chao');
  assert.equal(normalizeSearchText('你好 粵語'), '你好 粵語');
});

test('every existing Msutong book and lesson is retrievable without losing rows or mixing books', async () => {
  const { getFullMsutongVocabularyByLevel, getVocabularyByMsutong } = await import('../src/data/index');
  const all = getFullMsutongVocabularyByLevel('so-cap');
  assert.equal(all.length, 812, 'Reviewed union of all four PDF indexes and 40 lesson tables');
  assert.equal(new Set(all.map(word => word.id)).size, all.length);
  for (let book = 1; book <= 4; book++) for (let lesson = 1; lesson <= 10; lesson++) {
    const id = `quyen-${book}-lesson-${lesson}`;
    const words = getVocabularyByMsutong('so-cap', [id]);
    assert(words.length > 0, id);
    assert.deepEqual(words.map(word => word.id), all.filter(word => word.bookSlug === `quyen-${book}` && word.lesson === lesson).map(word => word.id));
    assert.deepEqual(getVocabularyByMsutong('so-cap', [id, id]).map(word => word.id), words.map(word => word.id));
    assert(words.every(word => word.hanzi.trim() && word.pinyin.trim() && word.meaning.trim()));
  }
  assert.deepEqual(getVocabularyByMsutong('so-cap', ['quyen-1-lesson-1oops', 'quyen-5-lesson-1', 'quyen-1-lesson-0', 'quyen-1-lesson-01']), []);
});

test('Msutong resume links retain book/lesson selection and discard unrelated URL credentials', async () => {
  const { describeRecentLesson } = await import('../src/lib/learningNavigation');
  const recent = describeRecentLesson('/mandarin/msutong/msutong-flashcard?level=so-cap&lessonIds=quyen-2-lesson-3,quyen-4-lesson-1&code=private-code&access_token=private-token', 'mandarin');
  assert(recent);
  const url = new URL(recent.href, 'https://app.test');
  assert.equal(url.searchParams.get('lessonIds'), 'quyen-2-lesson-3,quyen-4-lesson-1');
  assert.equal(url.searchParams.get('books'), 'Quyển 2, Quyển 4');
  assert(!recent.href.includes('private-'));
  for (const path of ['/mandarin/msutong/msutong-flashcard', '/mandarin/msutong/msutong-unknown?lessonIds=quyen-1-lesson-1', '/mandarin/msutong/msutong-flashcard?level=unknown-level&lessonIds=quyen-1-lesson-1']) assert.equal(describeRecentLesson(path, 'mandarin'), null);
});

test('Msutong meaning distractors never mark another translation of the same Hanzi as wrong', async () => {
  const { getFullMsutongVocabularyByLevel } = await import('../src/data/index');
  const { getMsutongDistractors } = await import('../src/lib/msutongSelection');
  const all = getFullMsutongVocabularyByLevel('so-cap');
  const effort = all.filter(word => word.hanzi === '号');
  assert(effort.length >= 2, 'Cover the reviewed meanings of 号 across books and lessons');
  const wrong = getMsutongDistractors(all, effort[0], 'meaning');
  for (const word of effort) assert(!wrong.includes(word.meaning.trim()));
  const candidates = [{ hanzi: '行', pinyin: 'xíng', meaning: 'được' }, { hanzi: '行', pinyin: 'háng', meaning: 'ngành' }, { hanzi: '好', pinyin: 'hǎo', meaning: 'tốt' }];
  assert.deepEqual(getMsutongDistractors(candidates, candidates[0], 'pinyin'), ['hǎo']);
});

test('Msutong reading selection rejects malformed lesson IDs instead of matching a numeric prefix', async () => {
  const { getReadingComprehensionByMsutong } = await import('../src/data/index');
  const all = getReadingComprehensionByMsutong('so-cap', []);
  assert(all.length > 0);
  assert.deepEqual(getReadingComprehensionByMsutong('so-cap', ['quyen-1-lesson-1junk']), []);
  const passage = all[0];
  const selection = getReadingComprehensionByMsutong('so-cap', [`${passage.bookSlug}-lesson-${passage.lesson}`]);
  assert(selection.some(item => item.id === passage.id));
  assert(selection.every(item => item.bookSlug === passage.bookSlug && item.lesson === passage.lesson));
});


test('Msutong PDF vocabulary keeps source corrections, constituents, variants and polyphonic entries', async () => {
  const { pdfMsutongVocabulary: words } = await import('../src/data/msutong/pdf-vocabulary');
  const { acceptsMsutongAnswer } = await import('../src/lib/msutongSelection');
  assert(words.every(word => word.sources.length > 0));
  assert.deepEqual([1, 2, 3, 4].map(book => words.filter(word => word.bookSlug === `quyen-${book}`).length), [200, 220, 198, 194]);
  assert(words.some(word => word.hanzi === '们' && word.lesson === 1 && word.bookSlug === 'quyen-1'));
  assert(words.some(word => word.hanzi === '很' && word.lesson === 3 && word.bookSlug === 'quyen-1'));
  assert.equal(words.find(word => word.hanzi === '旅行' && word.bookSlug === 'quyen-2')?.lesson, 5);
  assert.equal(words.filter(word => word.hanzi === '长' && word.bookSlug === 'quyen-3').length, 2);
  assert(words.find(word => word.hanzi === '人气')?.correction);
  assert(acceptsMsutongAnswer('哪里', '哪儿/哪里'));
  assert(acceptsMsutongAnswer('一点儿', '（一）点儿'));
  assert(acceptsMsutongAnswer('点儿', '（一）点儿'));
  assert(acceptsMsutongAnswer('填写', '填（写）'));
  assert(!acceptsMsutongAnswer('那里', '哪儿/哪里'));
});


test('Msutong intermediate catalog isolates all four books and retains intermediate resume links', async () => {
  const { getFullMsutongVocabularyByLevel, getVocabularyByMsutong, getReadingComprehensionByMsutong } = await import('../src/data/index');
  const { describeRecentLesson } = await import('../src/lib/learningNavigation');
  const all = getFullMsutongVocabularyByLevel('trung-cap');
  assert.equal(all.length, 1076);
  assert.deepEqual([1, 2, 3, 4].map(book => all.filter(word => word.bookSlug === `quyen-${book}`).length), [273, 355, 239, 209]);
  const beginnerIds = new Set(getFullMsutongVocabularyByLevel('so-cap').map(word => word.id));
  assert(all.every(word => !beginnerIds.has(word.id)));
  for (let book = 1; book <= 4; book++) for (let lesson = 1; lesson <= 10; lesson++) {
    const id = `quyen-${book}-lesson-${lesson}`;
    const selected = getVocabularyByMsutong('trung-cap', [id]);
    assert(selected.length > 0);
    assert.deepEqual(selected.map(word => word.id), all.filter(word => word.bookSlug === `quyen-${book}` && word.lesson === lesson).map(word => word.id));
  }
  const url = '/mandarin/msutong/msutong-flashcard?level=trung-cap&lessonIds=quyen-3-lesson-2';
  assert.equal(new URL(describeRecentLesson(url, 'mandarin')!.href, 'https://test.local').searchParams.get('level'), 'trung-cap');
  assert.deepEqual(getReadingComprehensionByMsutong('trung-cap', ['quyen-1-lesson-1']), []);
  assert.equal(all.find(word => word.hanzi === '待')?.pinyin, 'dāi');
  assert.equal(all.find(word => word.hanzi === '臭味相投')?.pinyin, 'chòuwèi xiāngtóu');
  assert.equal(all.find(word => word.hanzi === '卷')?.pinyin, 'juàn');
  assert.equal(all.find(word => word.hanzi === '种')?.pinyin, 'zhòng');
  assert(all.some(word => word.hanzi === '田中爱子' && word.bookSlug === 'quyen-3'));
});


test('Msutong advanced retrieves all 40 lessons, all six tables and preserves source-language meanings', async () => {
  const { advancedMsutongVocabulary: all } = await import('../src/data/msutong/pdf-vocabulary');
  const { getFullMsutongVocabularyByLevel, getVocabularyByMsutong } = await import('../src/data/index');
  const { describeRecentLesson } = await import('../src/lib/learningNavigation');
  assert.equal(all.length, 1515);
  assert.deepEqual([1, 2, 3, 4].map(book => all.filter(word => word.bookSlug === `quyen-${book}`).length), [443, 408, 338, 326]);
  const previousIds = new Set(['so-cap', 'trung-cap'].flatMap(level => getFullMsutongVocabularyByLevel(level).map(word => word.id)));
  assert(all.every(word => !previousIds.has(word.id)));
  for (let book = 1; book <= 4; book++) for (let lesson = 1; lesson <= 10; lesson++) {
    const id = `quyen-${book}-lesson-${lesson}`;
    const words = all.filter(word => word.bookSlug === `quyen-${book}` && word.lesson === lesson);
    assert.deepEqual(getVocabularyByMsutong('cao-cap', [id, id]).map(w => w.id), words.map(w => w.id));
    assert.deepEqual([...new Set(words.flatMap(w => w.sources.filter(s => s.kind === 'vocabulary-table').map(s => s.table)))].sort(), [1, 2, 3, 4, 5, 6]);
  }
  assert.equal(all.flatMap(w => w.sources).filter(s => s.kind === 'vocabulary-table').length, 1410);
  assert(all.some(w => w.hanzi === '手续' && w.sources.some(s => s.pdfPage === 62 && s.table === 3)));
  assert(all.some(w => w.hanzi === '营养' && w.sources.some(s => s.pdfPage === 48 && s.table === 6)));
  assert(all.some(w => w.hanzi === '申报' && w.sources.some(s => s.pdfPage === 107 && s.table === 5)));
  assert(all.some(w => w.hanzi === '志愿者' && w.meaningSource === 'editorial-vietnamese'));
  assert(all.some(w => w.hanzi === '录用' && w.meaningSource === 'translated-from-source-english' && w.sources.some(s => s.originalMeaning === 'to hire, to employ')));
  assert.equal(all.find(w => w.hanzi === '背')?.pinyin, 'bēi');
  assert.equal(all.find(w => w.hanzi === '为')?.pinyin, 'wéi');
  assert.equal(all.find(w => w.hanzi === '降妖除怪')?.pinyin, 'xiángyāo-chúguài');
  const recent = describeRecentLesson('/mandarin/msutong/msutong-flashcard?level=cao-cap&lessonIds=quyen-4-lesson-10', 'mandarin');
  assert(recent?.label.includes('Cao cấp'));
  assert.equal(new URL(recent!.href, 'https://test.local').searchParams.get('level'), 'cao-cap');
});
