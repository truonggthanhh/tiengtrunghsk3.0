import { useCallback, useSyncExternalStore } from 'react';
import { useLearningSession } from '@/hooks/useLearningSession';
import { notebookKey, notebookSnapshot, subscribeNotebook, updateNotebook, parseNotebookInput, mergeNotebookWords, wordIdentity, type NotebookInput, type NotebookWord } from '@/lib/notebook';
import type { LearningLanguage } from '@/lib/auth/navigation';

export function useNotebook(language: LearningLanguage) {
  const { session } = useLearningSession(language);
  const key = notebookKey(language, session?.user.id);
  const subscribe = useCallback((listener: () => void) => subscribeNotebook(key, listener), [key]);
  const getSnapshot = useCallback(() => notebookSnapshot(key), [key]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  function add(input: NotebookInput) {
    const parsed = parseNotebookInput(input);
    const current = notebookSnapshot(key).words;
    if (current.some(word => wordIdentity(word) === wordIdentity(parsed))) return false;
    updateNotebook(key, words => [...words, { ...parsed, id: crypto.randomUUID(), createdAt: new Date().toISOString(), attempts: 0, correct: 0 }]);
    return true;
  }
  function remove(id: string) { updateNotebook(key, words => words.filter(word => word.id !== id)); }
  function edit(id: string, input: NotebookInput) {
    const parsed = parseNotebookInput(input);
    updateNotebook(key, words => {
      if (words.some(word => word.id !== id && wordIdentity(word) === wordIdentity(parsed))) throw new Error('Từ này đã có trong sổ.');
      return words.map(word => word.id === id ? { ...word, ...parsed } : word);
    });
  }
  function review(id: string, correct: boolean) {
    updateNotebook(key, words => words.map(word => word.id === id ? { ...word, attempts: Math.min(100000, word.attempts + 1), correct: Math.min(100000, word.correct + (correct ? 1 : 0)) } : word));
  }
  function importWords(incoming: NotebookWord[]) { updateNotebook(key, words => mergeNotebookWords(words, incoming)); }
  return { ...snapshot, key, add, remove, edit, review, importWords };
}
