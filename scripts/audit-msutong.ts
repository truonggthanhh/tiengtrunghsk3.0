import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pdfMsutongVocabulary as rows } from '../src/data/msutong/pdf-vocabulary';
import manifest from '../docs/msutong/source-manifest.json';

const errors: string[] = [];
const ids = new Set<number>();
const keys = new Set<string>();
for (const row of rows) {
  if (!Number.isSafeInteger(row.id) || ids.has(row.id)) errors.push(`Invalid or duplicated ID: ${row.id}`);
  ids.add(row.id);
  if (![row.hanzi, row.pinyin, row.meaning].every(value => value.trim())) errors.push(`Missing field: ${row.id}`);
  const key = `${row.bookSlug}|${row.lesson}|${row.hanzi}|${row.pinyin}`;
  if (keys.has(key)) errors.push(`Duplicate: ${key}`);
  keys.add(key);
  if (!/^quyen-[1-4]$/.test(row.bookSlug ?? '') || row.lesson < 1 || row.lesson > 10) errors.push(`Invalid lesson: ${row.id}`);
  if (!row.sources.length || row.sources.some(source => source.pdfPage < 1 || source.row < 1)) errors.push(`Missing source: ${row.id}`);
}
// Independently compare the runtime catalog to every transcribed index row and lesson-table occurrence.
for (const book of manifest.books) {
  let page = 0, column = '', category = '', ordinal = 0, indexRows = 0;
  const words = rows.filter(row => row.bookSlug === `quyen-${book.book}`);
  for (const line of (await readFile(`src/data/msutong/reviewed/book${book.book}.tsv`, 'utf8')).trim().split('\n')) {
    if (line.startsWith('@')) { const header = line.slice(1).split(' '); page = Number(header[0]); column = header[1]; category = header[2]; ordinal = 0; continue; }
    ordinal++; indexRows++;
    const [hanzi] = line.split('|');
    if (!words.some(word => word.hanzi === hanzi && word.sources.some(source => source.kind === 'index' && source.pdfPage === page && source.column === column && source.row === ordinal && ('category' in source && source.category === category)))) errors.push(`Index missing: book ${book.book}, page ${page}, ${column}/${ordinal} ${hanzi}`);
  }
  if (indexRows !== book.indexRows || words.length !== book.rows) errors.push(`Book count drift: ${book.book}`);
  for (const lesson of book.lessons) if (words.filter(word => word.lesson === lesson.lesson).length !== lesson.rows) errors.push(`Lesson count drift: ${book.book}/${lesson.lesson}`);
}
let lessonOccurrences = 0;
for (const line of (await readFile('src/data/msutong/reviewed/lesson-census.txt', 'utf8')).trim().split('\n')) {
  const [book, lesson, page, hanziList] = line.split('|');
  for (const [index, hanzi] of hanziList.split(' ').entries()) {
    lessonOccurrences++;
    if (!rows.some(word => word.bookSlug === `quyen-${book}` && word.lesson === Number(lesson) && word.hanzi === hanzi && word.sources.some(source => source.kind === 'lesson' && source.pdfPage === Number(page) && source.row === index + 1))) errors.push(`Lesson missing: ${book}/${lesson}, ${hanzi}`);
  }
}
if (rows.length !== manifest.totalRows) errors.push('Total count drift');
const report = { pdfVerification: { status: 'reviewed_index_and_lesson_tables', scope: manifest.scope, method: manifest.method }, totalRows: rows.length, uniqueIds: ids.size, indexRows: manifest.books.reduce((sum, book) => sum + book.indexRows, 0), lessonOccurrences, books: manifest.books, corrections: rows.filter(row => row.correction).map(({ id, hanzi, correction }) => ({ id, hanzi, correction })), errors };
await writeFile('docs/msutong-data-audit.json', JSON.stringify(report, null, 2) + '\n');
const exportIndex = process.argv.indexOf('--export');
const destination = resolve(exportIndex === -1 ? 'public/data/msutong-vocabulary.csv' : process.argv[exportIndex + 1] || 'public/data/msutong-vocabulary.csv');
const cell = (value: unknown) => { let text = String(value ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
const lines = [['id', 'book', 'lesson', 'hanzi', 'pinyin', 'meaning_vi', 'category', 'sources_json', 'correction', 'supplementary_examples_json'], ...rows.map(row => [row.id, row.bookSlug, row.lesson, row.hanzi, row.pinyin, row.meaning, row.category, JSON.stringify(row.sources), row.correction, JSON.stringify(row.examples ?? [])])];
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, '\uFEFF' + lines.map(line => line.map(cell).join(',')).join('\r\n') + '\r\n');
console.log(`Reviewed vocabulary: ${rows.length}; index rows: ${report.indexRows}; lesson occurrences: ${lessonOccurrences}; errors: ${errors.length}. CSV: ${destination}`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
