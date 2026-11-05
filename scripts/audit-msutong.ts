import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { msutong_so_cap_1_vocab } from '../src/data/msutong/so-cap-1-vocab';
import { msutong_so_cap_2_vocab } from '../src/data/msutong/so-cap-2-vocab';
import { msutong_so_cap_3_vocab } from '../src/data/msutong/so-cap-3-vocab';
import { msutong_so_cap_4_vocab } from '../src/data/msutong/so-cap-4-vocab';
import { soCap1ExtendedVocabulary } from '../src/data/msutong/so-cap-1-extended';
import { soCap2ExtendedVocabulary } from '../src/data/msutong/so-cap-2-extended';
import { soCap3ExtendedVocabulary } from '../src/data/msutong/so-cap-3-extended';
import { soCap4ExtendedVocabulary } from '../src/data/msutong/so-cap-4-extended';

const books = [msutong_so_cap_1_vocab, msutong_so_cap_2_vocab, msutong_so_cap_3_vocab, msutong_so_cap_4_vocab];
const extensions = [soCap1ExtendedVocabulary, soCap2ExtendedVocabulary, soCap3ExtendedVocabulary, soCap4ExtendedVocabulary];
const rows = books.flatMap((words, index) => [
  ...words.map(word => ({ ...word, sourceType: 'existing-vocabulary', sourceFile: `src/data/msutong/so-cap-${index + 1}-vocab.ts` })),
  ...extensions[index].map(word => ({ ...word, sourceType: 'existing-extension', sourceFile: `src/data/msutong/so-cap-${index + 1}-extended.ts` })),
]);
const errors: string[] = [];
const ids = new Set<number>();
const groups = new Map<string, typeof rows>();
for (const row of rows) {
  if (!Number.isSafeInteger(row.id) || ids.has(row.id)) errors.push(`Invalid or duplicated ID: ${row.id}`);
  ids.add(row.id);
  if (![row.hanzi, row.pinyin, row.meaning].every(value => typeof value === 'string' && value.trim())) errors.push(`Missing vocabulary field: ${row.id}`);
  if (!/^quyen-[1-4]$/.test(row.bookSlug ?? '') || !Number.isSafeInteger(row.lesson) || row.lesson < 1) errors.push(`Invalid book/lesson: ${row.id}`);
  const key = `${row.bookSlug}|${row.lesson}|${row.hanzi.trim().normalize('NFC')}|${row.pinyin.trim().normalize('NFC')}`;
  groups.set(key, [...(groups.get(key) ?? []), row]);
}
const report = {
  pdfVerification: { status: 'pending_pdf_comparison', reason: 'All four uploaded PDFs exceed the 32 MiB file-transfer limit; their contents have not been read or verified.', requiredNextInput: 'PDFs split into ordered parts below 32 MiB, or compressed PDFs below that limit.' },
  totalExistingRows: rows.length,
  existingVocabularyRows: books.reduce((count, words) => count + words.length, 0),
  existingExtensionRows: extensions.reduce((count, words) => count + words.length, 0),
  uniqueIds: ids.size,
  books: books.map((words, index) => {
    const selected = rows.filter(row => row.bookSlug === `quyen-${index + 1}`);
    const lessonNumbers = [...new Set(selected.map(word => word.lesson))].sort((a, b) => a - b);
    return { book: `quyen-${index + 1}`, existingVocabularyRows: words.length, existingExtensionRows: extensions[index].length, total: selected.length, lessons: lessonNumbers.map(lesson => ({ lesson, rows: selected.filter(row => row.lesson === lesson).length })) };
  }),
  duplicateGroupsNeedingReview: [...groups.values()].filter(group => group.length > 1).map(group => ({ book: group[0].bookSlug, lesson: group[0].lesson, hanzi: group[0].hanzi, pinyin: group[0].pinyin, entries: group.map(row => ({ id: row.id, meaning: row.meaning, sourceFile: row.sourceFile })) })),
  errors,
};
const reportPath = resolve('docs/msutong-data-audit.json');
await mkdir(dirname(reportPath), { recursive: true });
await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
const exportIndex = process.argv.indexOf('--export');
if (exportIndex !== -1) {
  if (!process.argv[exportIndex + 1]) throw new Error('Supply a CSV destination after --export.');
  const destination = resolve(process.argv[exportIndex + 1]);
  const cell = (value: unknown) => { let text = String(value ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
  const lines = [['id', 'book', 'lesson', 'hanzi', 'pinyin', 'meaning', 'examples_json', 'source_type', 'source_file', 'pdf_verification'], ...rows.map(row => [row.id, row.bookSlug, row.lesson, row.hanzi, row.pinyin, row.meaning, JSON.stringify(row.examples ?? []), row.sourceType, row.sourceFile, 'pending_pdf_comparison'])];
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, '\uFEFF' + lines.map(line => line.map(cell).join(',')).join('\r\n') + '\r\n');
  console.log(`Existing-data CSV: ${destination}`);
}
console.log(`Existing rows: ${rows.length}; duplicate groups to review: ${report.duplicateGroupsNeedingReview.length}; structural errors: ${errors.length}. PDF comparison pending.`);
if (errors.length) process.exitCode = 1;
