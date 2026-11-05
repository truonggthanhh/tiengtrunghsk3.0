import { mkdir, readFile, writeFile } from 'node:fs/promises';
import data from '../src/data/msutong/intermediate-vocabulary.json';
import manifest from '../docs/msutong/intermediate-source-manifest.json';

const errors: string[] = [];
const ids = new Set<number>();
const keys = new Set<string>();
for (const word of data) {
  const key = `${word.bookSlug}|${word.lesson}|${word.hanzi}|${word.pinyin}`;
  if (ids.has(word.id) || keys.has(key)) errors.push(`Duplicate: ${key}`);
  ids.add(word.id); keys.add(key);
  if (!word.hanzi || !word.pinyin || !word.meaning || /[a-zA-Z\u00c0-\u024f]/.test(word.hanzi)) errors.push(`Invalid fields: ${key}`);
  if (word.lesson < 1 || word.lesson > 10 || !word.sources.length) errors.push(`Invalid source/lesson: ${key}`);
}
for (const book of manifest.books) {
  const words = data.filter(word => word.bookSlug === `quyen-${book.book}`);
  let page = 0, column = '', row = 0, kind = 'index', count = 0;
  for (const line of (await readFile(`src/data/msutong/intermediate-reviewed/book${book.book}.tsv`, 'utf8')).trim().split('\n')) {
    if (line.startsWith('@')) { const header = line.slice(1).split(' '); page = Number(header[0]); column = header[1]; kind = header[3] ?? 'index'; row = 0; continue; }
    const [hanzi, meaning, lesson] = line.split('|'); row++; count++;
    if (!words.some(word => word.hanzi === hanzi && word.meaning === meaning && word.lesson === Number(lesson) && word.sources.some(source => source.pdfPage === page && source.column === column && source.row === row && source.kind === kind))) errors.push(`Missing source row ${book.book}/${page}/${column}/${row}`);
  }
  if (count !== book.rows || words.length !== book.rows) errors.push(`Book count drift: ${book.book}`);
  for (const lesson of book.lessons) if (words.filter(word => word.lesson === lesson.lesson).length !== lesson.rows) errors.push(`Lesson count drift: ${book.book}/${lesson.lesson}`);
}
if (data.length !== manifest.totalRows) errors.push('Total count drift');
await writeFile('docs/msutong/intermediate-data-audit.json', JSON.stringify({ ...manifest, uniqueIds: ids.size, errors }, null, 2) + '\n');
const cell = (value: unknown) => { let text = String(value ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
const lines = [['id', 'level', 'book', 'lesson', 'hanzi', 'pinyin', 'meaning_vi', 'meaning_source', 'category', 'sources_json'], ...data.map(word => [word.id, 'trung-cap', word.bookSlug, word.lesson, word.hanzi, word.pinyin, word.meaning, word.meaningSource, word.category, JSON.stringify(word.sources)])];
await mkdir('public/data', { recursive: true });
await writeFile('public/data/msutong-intermediate-vocabulary.csv', '\uFEFF' + lines.map(line => line.map(cell).join(',')).join('\r\n') + '\r\n');
console.log(`Intermediate vocabulary: ${data.length}; unique IDs: ${ids.size}; errors: ${errors.length}.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
