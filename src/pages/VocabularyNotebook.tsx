import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Download, Upload, Search, Trash2, Pencil, Plus, Brain, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { useNotebook } from '@/hooks/useNotebook';
import { useLearningSession } from '@/hooks/useLearningSession';
import { notebookKey, notebookMatches, parseNotebookFile, type NotebookWord } from '@/lib/notebook';
import type { LearningLanguage } from '@/lib/auth/navigation';
import { toError } from '@/lib/errors';
import NotebookReview from '@/components/learning/NotebookReview';
import SpeakerButton from '@/components/SpeakerButton';

export default function VocabularyNotebook({ language }: { language: LearningLanguage }) {
  const { session } = useLearningSession(language);
  return <NotebookPage key={notebookKey(language, session?.user.id)} language={language} />;
}
const weak = (word: NotebookWord) => word.attempts > 0 && word.correct / word.attempts < 0.7;

function NotebookPage({ language }: { language: LearningLanguage }) {
  const notebook = useNotebook(language);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [hanzi, setHanzi] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [meaning, setMeaning] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<NotebookWord | null>(null);
  const [review, setReview] = useState<{ words: NotebookWord[]; mode: 'cards' | 'quiz' } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const upload = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const filtered = useMemo(() => notebook.words.filter(word => notebookMatches(word, search) && (filter === 'all' || (filter === 'weak' ? weak(word) : word.attempts === 0))).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [notebook.words, search, filter]);
  const attempts = notebook.words.reduce((total, word) => total + word.attempts, 0);
  const correct = notebook.words.reduce((total, word) => total + word.correct, 0);
  function clearForm() { setEditing(null); setHanzi(''); setPronunciation(''); setMeaning(''); }
  function save(event: FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    try {
      if (editing) { notebook.edit(editing, { hanzi, pronunciation, meaning }); setMessage('Đã cập nhật từ.'); }
      else setMessage(notebook.add({ hanzi, pronunciation, meaning }) ? 'Đã thêm từ mới vào sổ.' : 'Từ này đã có trong sổ.');
      clearForm();
    } catch (failure) { setError(toError(failure).message); }
  }
  function exportFile() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, language, words: notebook.words }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `haohao-${language}-notebook.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importFile(file?: File) {
    if (!file) return;
    setError(''); setMessage('');
    try {
      if (file.size > 1_000_000) throw new Error('Tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 1 MB.');
      const words = parseNotebookFile(await file.text(), language);
      notebook.importWords(words); setMessage('Đã nhập sổ từ. Những từ trùng được giữ nguyên.');
    } catch (failure) { setError(toError(failure).message); }
    finally { if (upload.current) upload.current.value = ''; }
  }
  function start(mode: 'cards' | 'quiz') {
    const words = [...filtered];
    for (let i = words.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [words[i], words[j]] = [words[j], words[i]]; }
    // Keep two distinct meanings even when a large filtered list has many synonyms.
    if (mode === 'quiz' && words.length > 1) {
      const different = words.findIndex(word => word.meaning !== words[0].meaning);
      if (different > 1) [words[1], words[different]] = [words[different], words[1]];
    }
    setReview({ words: words.slice(0, 20), mode }); setMessage(''); setError('');
  }
  return <main className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6">
    <Link to={`/${language}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><ArrowLeft className="h-4 w-4" />Về trang học</Link>
    <section className="rounded-3xl border bg-gradient-to-br from-violet-500/10 via-card to-cyan-500/10 p-6 sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><BookMarked className="h-5 w-5" />Góc học tập cá nhân</div><h1 className="text-3xl font-bold tracking-tight">Sổ từ {language === 'mandarin' ? 'tiếng Trung' : 'Quảng Đông'}</h1><p className="mt-3 max-w-xl text-sm text-muted-foreground">Lưu từ từ flashcard hoặc tự thêm, rồi luyện riêng những từ bạn chưa nhớ. Dữ liệu lưu trên trình duyệt này; xuất tệp để giữ bản sao hoặc chuyển thiết bị.</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={!notebook.words.length} onClick={exportFile}><Download className="mr-2 h-4 w-4" />Xuất sổ từ</Button><Button variant="outline" onClick={() => upload.current?.click()}><Upload className="mr-2 h-4 w-4" />Nhập sổ từ</Button><input ref={upload} type="file" accept=".json,application/json" className="hidden" aria-label="Nhập tệp sổ từ" onChange={event => void importFile(event.target.files?.[0])} /></div></div>
      <div className="mt-6 grid grid-cols-3 gap-3">{[[notebook.words.length, 'Từ đã lưu'], [notebook.words.filter(weak).length, 'Từ cần ôn'], [attempts ? `${Math.round(correct / attempts * 100)}%` : '—', 'Tỉ lệ nhớ khi ôn']].map(([value, label]) => <div key={label} className="rounded-2xl border bg-background/70 p-3 sm:p-4"><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div>
    </section>
    {notebook.warning && <p role="alert" className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">{notebook.warning}</p>}
    {message && <p role="status" className="rounded-xl bg-emerald-500/10 p-3 text-sm">{message}</p>}
    {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {review ? <NotebookReview words={review.words} mode={review.mode} language={language} onAnswer={notebook.review} onExit={() => setReview(null)} /> : <>
      <div className="flex flex-wrap gap-3"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="search" aria-label="Tìm trong sổ từ" placeholder="Tìm chữ Hán, phiên âm hoặc nghĩa…" value={search} onChange={event => setSearch(event.target.value)} className="pl-9" /></div><Select value={filter} onValueChange={setFilter}><SelectTrigger aria-label="Lọc từ" className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả từ</SelectItem><SelectItem value="weak">Từ cần ôn</SelectItem><SelectItem value="new">Chưa luyện lần nào</SelectItem></SelectContent></Select><Button disabled={!filtered.length} onClick={() => start('cards')}><BookMarked className="mr-2 h-4 w-4" />Ôn flashcard</Button><Button variant="outline" disabled={new Set(filtered.map(word => word.meaning)).size < 2} onClick={() => start('quiz')}><Brain className="mr-2 h-4 w-4" />Luyện chọn nghĩa</Button></div>
      <p className="text-xs text-muted-foreground">Mỗi lượt ôn tối đa 20 từ trong danh sách đang lọc. Chế độ chọn nghĩa cần ít nhất 2 nghĩa khác nhau.</p>
      {!filtered.length ? <div className="space-y-3 rounded-2xl border border-dashed p-8 text-center"><BookMarked className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="text-lg font-semibold">{notebook.words.length ? 'Không có từ phù hợp' : 'Bắt đầu với từ đầu tiên của bạn'}</h2><p className="text-sm text-muted-foreground">{notebook.words.length ? 'Thử thay đổi từ khóa hoặc bộ lọc.' : 'Thêm từ bên dưới hoặc bấm “Lưu từ” khi học flashcard.'}</p><Button asChild variant="outline"><Link to={language === 'mandarin' ? '/mandarin/hsk/1/flashcard' : '/cantonese/lessons'}>Mở bài học</Link></Button></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(word => <article key={word.id} className="flex flex-col rounded-2xl border bg-card p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><h2 className="break-words text-3xl font-semibold">{word.hanzi}</h2><SpeakerButton className="bg-primary/10 text-primary hover:bg-primary/20" text={word.hanzi} language={language === 'mandarin' ? 'zh-CN' : 'zh-HK'} /></div><p className="mt-2 text-sm text-primary">{word.pronunciation || 'Chưa có phiên âm'}</p><p className="mt-3 flex-1 whitespace-pre-wrap break-words text-sm">{word.meaning}</p><div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t pt-3"><p className="text-xs text-muted-foreground">{word.attempts ? `${word.correct}/${word.attempts} lần nhớ đúng` : 'Chưa ôn tập'}</p><div className="flex gap-1"><Button variant="ghost" size="icon" aria-label={`Sửa từ ${word.hanzi}`} onClick={() => { setEditing(word.id); setHanzi(word.hanzi); setPronunciation(word.pronunciation); setMeaning(word.meaning); form.current?.scrollIntoView({ behavior: 'smooth' }); }}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label={`Xóa từ ${word.hanzi}`} onClick={() => setDeleting(word)}><Trash2 className="h-4 w-4" /></Button></div></div></article>)}</div>}
      <form ref={form} onSubmit={save} className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6"><h2 className="flex items-center gap-2 text-xl font-semibold"><Plus className="h-5 w-5" />{editing ? 'Sửa từ đã lưu' : 'Thêm từ vào sổ'}</h2><div className="grid gap-4 sm:grid-cols-3"><div className="space-y-2"><Label htmlFor="notebook-hanzi">Chữ Hán / cụm từ</Label><Input id="notebook-hanzi" required maxLength={80} value={hanzi} onChange={event => setHanzi(event.target.value)} placeholder="你好" /></div><div className="space-y-2"><Label htmlFor="notebook-pronunciation">{language === 'mandarin' ? 'Pinyin' : 'Jyutping'}</Label><Input id="notebook-pronunciation" maxLength={160} value={pronunciation} onChange={event => setPronunciation(event.target.value)} placeholder={language === 'mandarin' ? 'nǐ hǎo' : 'nei5 hou2'} /></div><div className="space-y-2"><Label htmlFor="notebook-meaning">Nghĩa tiếng Việt</Label><Input id="notebook-meaning" required maxLength={500} value={meaning} onChange={event => setMeaning(event.target.value)} placeholder="Xin chào" /></div></div><div className="flex gap-3"><Button type="submit">{editing ? 'Lưu thay đổi' : 'Thêm từ'}</Button>{editing && <Button type="button" variant="outline" onClick={clearForm}>Hủy sửa</Button>}</div></form>
    </>}
    <AlertDialog open={Boolean(deleting)} onOpenChange={open => !open && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa từ đã lưu?</AlertDialogTitle><AlertDialogDescription>Xóa “{deleting?.hanzi}” khỏi sổ từ và lịch sử ôn của từ này.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Giữ lại</AlertDialogCancel><Button variant="destructive" onClick={() => { if (deleting) notebook.remove(deleting.id); setDeleting(null); }}>Xóa từ</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </main>;
}
