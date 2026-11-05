import { readFileSync, writeFileSync } from 'node:fs';

export interface AdvancedSource {
  kind: 'vocabulary-table' | 'index';
  pdfPage: number;
  row: number;
  table?: number;
  originalMeaning?: string;
}
export interface AdvancedWord {
  id: number;
  bookSlug: string;
  lesson: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  category: string;
  meaningSource: string;
  sources: AdvancedSource[];
}

// Transcriptions contain manually reviewed tones. Never generate pinyin from
// isolated characters: polyphonic words and grammar patterns need context.
export function buildAdvancedVocabulary(): AdvancedWord[] {
  const words: AdvancedWord[] = [];
  const keys = new Map<string, AdvancedWord>();
  const ordinals = new Map<string, number>();
  function add(book: number, lesson: number, hanzi: string, pinyin: string, meaning: string, meaningSource: string, source: AdvancedSource) {
    if (!hanzi || !pinyin || !meaning || lesson < 1 || lesson > 10) throw new Error(`Invalid row: ${book}/${lesson}/${hanzi}`);
    const key = `${book}|${lesson}|${hanzi}|${pinyin.toLowerCase().replace(/[\s-]/g, '')}`;
    const previous = keys.get(key);
    if (previous) {
      previous.sources.push(source);
      if (previous.meaning !== meaning) previous.meaning += `; ${meaning}`;
      return;
    }
    const lessonKey = `${book}/${lesson}`;
    const ordinal = (ordinals.get(lessonKey) ?? 0) + 1;
    ordinals.set(lessonKey, ordinal);
    const word: AdvancedWord = {
      id: 1000000 + book * 100000 + lesson * 1000 + ordinal,
      bookSlug: `quyen-${book}`, lesson, hanzi, pinyin, meaning,
      category: /[A-ZV]|……/.test(hanzi) ? 'pattern' : 'vocabulary',
      meaningSource, sources: [source],
    };
    keys.set(key, word); words.push(word);
  }
  for (let book = 1; book <= 4; book++) {
    let lesson = 0, table = 0, pdfPage = 0, row = 0;
    const directory = 'src/data/msutong/advanced-reviewed/';
    for (const line of readFileSync(`${directory}book${book}.tsv`, 'utf8').trim().split('\n')) {
      if (line.startsWith('@')) {
        [lesson, table, pdfPage] = line.slice(1).split(' ').map(Number);
        row = 0; continue;
      }
      const [hanzi, pinyin, meaning, originalMeaning] = line.split('|');
      if (line.split('|').length !== (book === 2 ? 4 : 3)) throw new Error(`Malformed table row: ${line}`);
      add(book, lesson, hanzi, pinyin, meaning, book === 2 ? 'translated-from-source-english' : 'reviewed-source-vietnamese', {
        kind: 'vocabulary-table', pdfPage, table, row: ++row,
        ...(originalMeaning ? { originalMeaning } : {}),
      });
    }
    const pageRows = new Map<number, number>();
    for (const line of readFileSync(`${directory}book${book}-index.tsv`, 'utf8').trim().split('\n')) {
      const [lessonText, pageText, hanzi, pinyin, meaning] = line.split('|');
      if (line.split('|').length !== 5) throw new Error(`Malformed index row: ${line}`);
      const page = Number(pageText);
      const ordinal = (pageRows.get(page) ?? 0) + 1;
      pageRows.set(page, ordinal);
      add(book, Number(lessonText), hanzi, pinyin, meaning, 'editorial-vietnamese', { kind: 'index', pdfPage: page, row: ordinal });
    }
  }
  return words.sort((a, b) => a.id - b.id);
}

const data = buildAdvancedVocabulary();
writeFileSync('src/data/msutong/advanced-vocabulary.json', JSON.stringify(data, null, 2) + '\n');
console.log(`Advanced: ${data.length} cards, ${data.reduce((n, w) => n + w.sources.length, 0)} source occurrences.`);
