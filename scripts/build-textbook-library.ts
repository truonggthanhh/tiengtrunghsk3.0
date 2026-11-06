import { readFileSync, writeFileSync } from 'node:fs';
import { convert, pinyin as makePinyin } from 'pinyin-pro';
import sources from '../src/data/textbooks/source-rows.json';
import { getVocabularyByLevel } from '../src/data/index';
import { pdfMsutongVocabulary, intermediateMsutongVocabulary, advancedMsutongVocabulary } from '../src/data/msutong/pdf-vocabulary';
const local = [...getVocabularyByLevel('6'), ...pdfMsutongVocabulary, ...intermediateMsutongVocabulary, ...advancedMsutongVocabulary];
const extra = new Map(readFileSync('src/data/textbooks/vietnamese-glosses.tsv', 'utf8').trim().split('\n').map(line => line.split('|') as [string, string]));
const urls: Record<string, string> = { boya: 'https://github.com/jay-pee/BoyaChinese_Elementary_II_Vocabulary_List', 'han-ngu': 'https://github.com/kevinstadler/pleco-flashcards', 'hsk-standard': 'https://github.com/joelypoley/hsk_standard_course_vocab' };
const replacements: Record<string, string> = { 'エ人': '工人', '只有……オ……': '只有……才……', '尽(カ)': '尽(力)', '內容': '内容', '何況': '何况', '丟': '丢', '賞心悅目': '赏心悦目', '贏': '赢', '蒙胧': '朦胧', '知感': '质感' };
const normalized = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\s'’]/g, '');
const rows = []; const seen = new Set<string>(); const missing: Record<string, string[]> = {};
for (const [index, source] of sources.entries()) {
  const hanzi = source.hanzi === '阿' && source.originalMeaning.includes('at the end') ? '啊' : replacements[source.hanzi] ?? source.hanzi;
  const pinyin = source.pinyin ? source.pinyin.replace(/([a-zA-ZüÜvV:]+)([0-5])/g, (token, syllable: string, tone: string) => tone === '5' || tone === '0' ? syllable.replace(/u:|v/g, 'ü') : convert(token, { format: 'numToSymbol' })) : makePinyin(hanzi);
  const correctedPinyin: Record<string, string> = { '面积': 'miànjī', '出来': 'chūlái', '起来': 'qǐlái', '结果': 'jiéguǒ' };
  const reviewedPinyin = correctedPinyin[hanzi] ?? pinyin;
  const matches = local.filter(w => w.hanzi === hanzi);
  const match = matches.find(w => normalized(w.pinyin) === normalized(pinyin)) ?? matches[0];
  const properName = /name of|name \(of|surname|family name|name of a person/i.test(source.originalMeaning);
  const meaning = extra.get(hanzi) ?? match?.meaning ?? (properName ? `Tên riêng: ${pinyin}` : source.originalMeaning);
  if (!meaning) { (missing[source.level] ??= []).push(hanzi); continue; }
  const key = `${source.level}/${source.bookSlug}/${source.lesson}/${hanzi}/${normalized(pinyin)}`;
  if (seen.has(key)) continue; seen.add(key);
  const examples = matches.flatMap(w => w.examples ?? []).filter(e => e.hanzi.includes(hanzi));
  rows.push({ id: 20000000 + index, level: source.level, bookSlug: source.bookSlug, lesson: source.lesson, hanzi, pinyin: reviewedPinyin, meaning, meaningLanguage: extra.has(hanzi) || match || properName ? 'vi' : 'en', category: 'vocabulary', sources: [{ kind: 'community-wordlist', row: index + 1, url: urls[source.level], sourceFile: source.sourceFile, originalHanzi: source.hanzi }], ...(examples.length ? { examples: [...new Map(examples.map(e => [e.hanzi, e])).values()].slice(0, 4) } : {}) });
}
if (Object.keys(missing).length) throw new Error(`Missing glosses: ${JSON.stringify(missing)}`);
writeFileSync('src/data/textbooks/vocabulary.json', JSON.stringify(rows, null, 2) + '\n');
const summary = [...new Set(rows.map(w => w.level))].map(level => ({ level, words: rows.filter(w => w.level === level).length, englishGlosses: rows.filter(w => w.level === level && w.meaningLanguage === 'en').map(w => w.hanzi), lessons: new Set(rows.filter(w => w.level === level).map(w => w.bookSlug + '/' + w.lesson)).size }));
writeFileSync('docs/textbooks/import-audit.json', JSON.stringify({ sourceRows: sources.length, imported: rows.length, duplicateOccurrences: sources.length - rows.length, summary }, null, 2) + '\n');
console.log(summary.map(s => ({ ...s, englishGlosses: s.englishGlosses.length })));

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
for (const level of Object.keys(urls)) {
  const selected = rows.filter(word => word.level === level);
  const lines = [['id', 'book', 'lesson', 'hanzi', 'pinyin', 'meaning_vi', 'sources_json'], ...selected.map(word => [word.id, word.bookSlug, word.lesson, word.hanzi, word.pinyin, word.meaning, JSON.stringify(word.sources)])];
  writeFileSync(`public/data/textbooks/${level}-vocabulary.csv`, '\uFEFF' + lines.map(line => line.map(csvCell).join(',')).join('\r\n') + '\r\n');
}
