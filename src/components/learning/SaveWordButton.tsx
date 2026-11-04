import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotebook } from '@/hooks/useNotebook';
import { wordIdentity, notebookSnapshot } from '@/lib/notebook';
import type { LearningLanguage } from '@/lib/auth/navigation';
import { toError } from '@/lib/errors';
import { toast } from 'sonner';

export default function SaveWordButton({ language, hanzi, pronunciation = '', meaning }: { language: LearningLanguage; hanzi: string; pronunciation?: string; meaning: string }) {
  const notebook = useNotebook(language);
  const word = { hanzi, pronunciation, meaning };
  const saved = notebook.words.find(item => wordIdentity(item) === wordIdentity(word));
  return <Button type="button" variant="outline" size="sm" aria-pressed={Boolean(saved)} aria-label={saved ? `Bỏ lưu từ ${hanzi}` : `Lưu từ ${hanzi}`} onClick={event => {
    event.stopPropagation();
    try {
      if (saved) notebook.remove(saved.id); else notebook.add(word);
      const warning = notebookSnapshot(notebook.key).warning;
      if (warning) toast.warning(warning);
      else toast.success(saved ? 'Đã bỏ lưu từ.' : 'Đã thêm vào sổ từ cá nhân.');
    } catch (error) { toast.error(toError(error).message); }
  }}>{saved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}{saved ? 'Đã lưu từ' : 'Lưu từ'}</Button>;
}
