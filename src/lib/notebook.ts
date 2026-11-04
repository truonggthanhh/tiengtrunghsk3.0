import { z } from 'zod';
import type { LearningLanguage } from './auth/navigation';

export const notebookInputSchema = z.object({
  hanzi: z.string().trim().min(1, 'Vui lòng nhập từ hoặc cụm từ.').max(80, 'Từ hoặc cụm từ không được dài quá 80 ký tự.'),
  pronunciation: z.string().trim().max(160, 'Phiên âm không được dài quá 160 ký tự.').default(''),
  meaning: z.string().trim().min(1, 'Vui lòng nhập nghĩa của từ.').max(500, 'Nghĩa của từ không được dài quá 500 ký tự.'),
});
export function parseNotebookInput(input: unknown): NotebookInput {
  const result = notebookInputSchema.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? 'Từ mới chưa hợp lệ.');
  return result.data;
}
const wordSchema = notebookInputSchema.extend({
  id: z.string().min(1).max(100), createdAt: z.string().datetime(),
  attempts: z.number().int().min(0).max(100000).default(0),
  correct: z.number().int().min(0).max(100000).default(0),
}).refine(word => word.correct <= word.attempts, 'Invalid review totals');
const fileSchema = z.object({ version: z.literal(1), language: z.enum(['mandarin', 'cantonese']), words: z.array(wordSchema).max(1000) });
export type NotebookWord = z.infer<typeof wordSchema>;
export type NotebookInput = z.infer<typeof notebookInputSchema>;
export function notebookKey(language: LearningLanguage, userId?: string) { return `haohao.notebook.v1.${language}.${userId || 'guest'}`; }
export function wordIdentity(word: Pick<NotebookInput, 'hanzi' | 'pronunciation'>) { return `${word.hanzi.trim().normalize('NFC')}\u0000${word.pronunciation.trim().normalize('NFC').toLocaleLowerCase()}`; }
export function parseNotebookFile(text: string, language: LearningLanguage): NotebookWord[] {
  if (text.length > 1_000_000) throw new Error('Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 1 MB.');
  let json: unknown;
  try { json = JSON.parse(text); } catch { throw new Error('Tệp không phải JSON hợp lệ. Hãy chọn tệp sổ từ đã xuất.'); }
  const parsed = fileSchema.safeParse(json);
  if (!parsed.success) throw new Error('Tệp sổ từ không đúng định dạng hoặc có dữ liệu không hợp lệ.');
  if (parsed.data.language !== language) throw new Error('Tệp thuộc ngôn ngữ khác. Hãy chuyển sang đúng sổ từ rồi nhập lại.');
  const seen = new Set<string>();
  const ids = new Set<string>();
  return parsed.data.words.filter(word => { const identity = wordIdentity(word); if (seen.has(identity) || ids.has(word.id)) return false; seen.add(identity); ids.add(word.id); return true; });
}
export function mergeNotebookWords(existing: NotebookWord[], incoming: NotebookWord[]): NotebookWord[] {
  const identities = new Set(existing.map(wordIdentity));
  const ids = new Set(existing.map(word => word.id));
  const added = incoming.filter(word => { const identity = wordIdentity(word); if (identities.has(identity) || ids.has(word.id)) return false; identities.add(identity); ids.add(word.id); return true; });
  if (existing.length + added.length > 1000) throw new Error('Sổ từ hỗ trợ tối đa 1.000 từ. Hãy xuất và dọn bớt từ trước khi nhập thêm.');
  return [...existing, ...added];
}
export function notebookMatches(word: NotebookWord, search: string) {
  const fold = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  return fold(`${word.hanzi} ${word.pronunciation} ${word.meaning}`).includes(fold(search.trim()));
}
export function reviewChoices(word: NotebookWord, words: NotebookWord[], random = Math.random): string[] {
  const distractors = [...new Set(words.filter(item => item.meaning !== word.meaning).map(item => item.meaning))];
  const shuffle = <T,>(items: T[]) => { const result = [...items]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result; };
  return shuffle([word.meaning, ...shuffle(distractors).slice(0, 3)]);
}

interface Snapshot { words: NotebookWord[]; warning: string | null; }
const snapshots = new Map<string, Snapshot>();
const listeners = new Map<string, Set<() => void>>();
let listening = false;
function connectStorage() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('storage', event => {
    const keys = event.key ? [event.key] : [...snapshots.keys()];
    for (const key of keys) { snapshots.delete(key); listeners.get(key)?.forEach(listener => listener()); }
  });
}
export function notebookSnapshot(key: string): Snapshot {
  connectStorage();
  if (snapshots.has(key)) return snapshots.get(key)!;
  let result: Snapshot = { words: [], warning: null };
  try {
    const stored = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    if (stored) {
      const parsed = z.array(wordSchema).max(1000).safeParse(JSON.parse(stored));
      result = parsed.success ? { words: parsed.data, warning: null } : { words: [], warning: 'Không đọc được dữ liệu sổ từ cũ trên thiết bị này. Bạn có thể nhập lại từ tệp đã xuất.' };
    }
  } catch { result.warning = 'Trình duyệt đang chặn lưu dữ liệu hoặc sổ từ cũ bị lỗi. Hãy xuất tệp để giữ lại từ của bạn.'; }
  snapshots.set(key, result);
  return result;
}
export function subscribeNotebook(key: string, listener: () => void) {
  connectStorage();
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => { listeners.get(key)?.delete(listener); if (!listeners.get(key)?.size) listeners.delete(key); };
}
export function updateNotebook(key: string, update: (words: NotebookWord[]) => NotebookWord[]) {
  const words = update(notebookSnapshot(key).words);
  if (words.length > 1000) throw new Error('Sổ từ hỗ trợ tối đa 1.000 từ.');
  let warning: string | null = null;
  try { localStorage.setItem(key, JSON.stringify(words)); }
  catch { warning = 'Chưa lưu được trên thiết bị. Hãy xuất tệp trước khi đóng trang.'; }
  snapshots.set(key, { words, warning });
  listeners.get(key)?.forEach(listener => listener());
}
