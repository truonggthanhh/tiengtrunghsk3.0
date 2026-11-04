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
