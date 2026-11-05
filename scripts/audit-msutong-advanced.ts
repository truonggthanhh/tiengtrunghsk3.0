import { readFile, writeFile } from 'node:fs/promises';
import raw from '../src/data/msutong/advanced-vocabulary.json';
import type { AdvancedWord } from './build-msutong-advanced';
const data = raw as AdvancedWord[];
import beginner from '../src/data/msutong/pdf-vocabulary.json';
import intermediate from '../src/data/msutong/intermediate-vocabulary.json';
import manifest from '../docs/msutong/advanced-source-manifest.json';

const errors: string[] = [];
const ids = new Set<number>([...beginner, ...intermediate].map(w => w.id));
const keys = new Set<string>();
const consumed = new Set<string>();
const sourceKey = (book: string, source: { kind: string; pdfPage: number; row: number; table?: number }) => `${book}/${source.kind}/${source.pdfPage}/${source.table ?? '-'}/${source.row}`;
for (const word of data) {
  const key = `${word.bookSlug}/${word.lesson}/${word.hanzi}/${word.pinyin.replace(/[\s-]/g, '').toLowerCase()}`;
  if (ids.has(word.id) || keys.has(key)) errors.push(`Duplicate card: ${key}`);
  ids.add(word.id); keys.add(key);
  if (!/^(?:AA制|V得了\/V不了|[\p{Script=Han}…]+)$/u.test(word.hanzi) || !word.pinyin || !word.meaning || /\p{Script=Han}/u.test(word.pinyin)) errors.push(`Malformed fields: ${key}`);
  if (word.lesson < 1 || word.lesson > 10 || !word.sources.length) errors.push(`Missing lesson/source: ${key}`);
  for (const source of word.sources) {
    const sk = sourceKey(word.bookSlug, source);
    if (consumed.has(sk)) errors.push(`Reused source: ${sk}`);
    consumed.add(sk);
  }
}
const verified = new Set<string>();
let tableCount = 0, tableRows = 0, indexRows = 0;
const bookSummaries = [];
for (const book of manifest.books) {
  const slug = `quyen-${book.book}`;
  const words = data.filter(w => w.bookSlug === slug);
  const tables = new Map<string, { page: number; rows: string[] }>();
  let current: { page: number; rows: string[] } | undefined;
  for (const line of (await readFile(`src/data/msutong/advanced-reviewed/book${book.book}.tsv`, 'utf8')).trim().split('\n')) {
    if (line.startsWith('@')) {
      const [lesson, table, page] = line.slice(1).split(' ').map(Number);
      const key = `${lesson}/${table}`;
      if (tables.has(key)) errors.push(`Duplicate table header ${slug}/${key}`);
      current = { page, rows: [] }; tables.set(key, current);
    } else current?.rows.push(line);
  }
  if (tables.size !== 60 || book.tables.length !== 60) errors.push(`Expected 60 tables in ${slug}`);
  for (let lesson = 1; lesson <= 10; lesson++) for (let table = 1; table <= 6; table++) {
    const expected = book.tables.find(t => t.lesson === lesson && t.table === table);
    const actual = tables.get(`${lesson}/${table}`);
    if (!expected || !actual || actual.page !== expected.pdfPage || actual.rows.length !== expected.rows) {
      errors.push(`Table census mismatch ${slug}/${lesson}/${table}`); continue;
    }
    tableCount++;
    actual.rows.forEach((line, index) => {
      tableRows++;
      const [hanzi, pinyin, meaning, originalMeaning] = line.split('|');
      const source = { kind: 'vocabulary-table', pdfPage: actual.page, table, row: index + 1 };
      const sk = sourceKey(slug, source);
      const word = words.find(w => w.lesson === lesson && w.hanzi === hanzi && w.pinyin === pinyin && w.meaning.includes(meaning) && w.sources.some(s => sourceKey(slug, s) === sk && s.originalMeaning === originalMeaning));
      if (!word) errors.push(`Missing transcription ${sk}/${hanzi}`);
      verified.add(sk);
    });
  }
  const lines = (await readFile(`src/data/msutong/advanced-reviewed/book${book.book}-index.tsv`, 'utf8')).trim().split('\n');
  if (lines.length !== book.indexSupplementRows) errors.push(`Index count mismatch ${slug}`);
  const pageRows = new Map<number, number>();
  for (const line of lines) {
    const [lesson, page, hanzi, pinyin, meaning] = line.split('|');
    const row = (pageRows.get(Number(page)) ?? 0) + 1; pageRows.set(Number(page), row);
    const sk = sourceKey(slug, { kind: 'index', pdfPage: Number(page), row });
    if (!words.some(w => w.lesson === Number(lesson) && w.hanzi === hanzi && w.pinyin === pinyin && w.meaning.includes(meaning) && w.sources.some(s => sourceKey(slug, s) === sk))) errors.push(`Missing index supplement ${sk}`);
    if (Number(page) < book.indexPages[0] || Number(page) > book.indexPages[1]) errors.push(`Invalid index page ${sk}`);
    verified.add(sk); indexRows++;
  }
  bookSummaries.push({ book: book.book, cards: words.length, tables: tables.size, tableRows: book.tables.reduce((n, t) => n + t.rows, 0), indexSupplementRows: lines.length, lessons: Array.from({ length: 10 }, (_, i) => ({ lesson: i + 1, cards: words.filter(w => w.lesson === i + 1).length })) });
}
if (tableCount !== manifest.totalTables || tableRows !== manifest.totalTableRows) errors.push('Total table census mismatch');
if (consumed.size !== verified.size || [...consumed].some(k => !verified.has(k))) errors.push('Unreviewed or omitted source occurrence');
await writeFile('docs/msutong/advanced-data-audit.json', JSON.stringify({ cards: data.length, tables: tableCount, tableRows, indexSupplementRows: indexRows, sourceOccurrences: consumed.size, books: bookSummaries, errors }, null, 2) + '\n');
const cell = (value: unknown) => { let text = String(value ?? ''); if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; return `"${text.replace(/"/g, '""')}"`; };
const lines = [['id', 'level', 'book', 'lesson', 'hanzi', 'pinyin', 'meaning_vi', 'meaning_source', 'category', 'sources_json'], ...data.map(w => [w.id, 'cao-cap', w.bookSlug, w.lesson, w.hanzi, w.pinyin, w.meaning, w.meaningSource, w.category, JSON.stringify(w.sources)])];
await writeFile('public/data/msutong-advanced-vocabulary.csv', '\uFEFF' + lines.map(line => line.map(cell).join(',')).join('\r\n') + '\r\n');
console.log(`Advanced: ${data.length} cards, ${tableCount} tables, ${tableRows} table entries, ${indexRows} index entries; errors: ${errors.length}.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
