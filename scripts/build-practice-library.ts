import { readFileSync, writeFileSync } from 'node:fs';
import { pinyin } from 'pinyin-pro';
import { getMsutongDistractors } from '../src/lib/msutongSelection';
import { getFullMsutongVocabularyByLevel } from '../src/data/index';
const sentences = [];
const readings = [];
const clean = (s: string) => s.replace(/[\p{P}\p{Z}\s]/gu, '');
for (const [level, file] of [['so-cap', 'beginner'], ['trung-cap', 'intermediate'], ['cao-cap', 'advanced'], ['hsk-standard', 'hsk-standard']]) {
  const vocabulary = getFullMsutongVocabularyByLevel(level);
  let book = 0, lesson = 0, group: typeof sentences = [], header: string[] = [];
  function finish() {
    if (!group.length) return;
    if (group.length !== 6) throw new Error(`Expected six authored sentences: ${level}/${book}/${lesson}`);
    const shift = (book + lesson) % 4;
    const options = header.slice(3);
    const target = vocabulary.find(w => w.id === group[0].wordId)!;
    const lexicalOptions = [target.meaning, ...getMsutongDistractors(vocabulary, target, 'meaning').slice(0, 3)];
    readings.push({ id: 8000000 + ['so-cap', 'trung-cap', 'cao-cap', 'hsk-standard'].indexOf(level) * 100000 + book * 1000 + lesson, level, bookSlug: `quyen-${book}`, lesson, title: header[1], passage: group.map(s => s.sentence).join(''), source: 'editorial-practice', questions: [
      { questionText: header[2], options: [...options.slice(shift), ...options.slice(0, shift)], correctAnswerIndex: (4 - shift) % 4, explanation: `Đối chiếu các chi tiết trong đoạn “${header[1]}”.` },
      { questionText: `Trong đoạn văn, “${target.hanzi}” mang nghĩa nào?`, options: [...lexicalOptions.slice(shift), ...lexicalOptions.slice(0, shift)], correctAnswerIndex: (4 - shift) % 4, explanation: group[0].translation },
    ] });
  }
  for (const line of readFileSync(`src/data/practice/msutong-${file}.tsv`, 'utf8').trim().split('\n')) {
    if (line.startsWith('@')) { finish(); header = line.split('|'); if (header.length !== 7) throw new Error(`Malformed header ${line}`); [book, lesson] = header[0].slice(1).split('.').map(Number); group = []; continue; }
    const [target, segmented, translation, alternatives] = line.split('|');
    const word = vocabulary.find(w => w.bookSlug === `quyen-${book}` && w.lesson === lesson && w.hanzi === target);
    if (!word) throw new Error(`Unknown target ${level}/${book}/${lesson}/${target}`);
    const segments = segmented.split(' ').filter(Boolean);
    const sentence = segments.join('');
    if (sentence.split(target).length !== 2) throw new Error(`Target must appear exactly once: ${sentence}/${target}`);
    const acceptedSentences = alternatives ? alternatives.split('~') : [];
    for (const alt of acceptedSentences) if ([...clean(alt)].sort().join('') !== [...clean(sentence)].sort().join('')) throw new Error(`Alternative changes tokens: ${alt}`);
    const row = { id: `${level}-${book}-${lesson}-${group.length + 1}`, level, bookSlug: `quyen-${book}`, lesson, wordId: word.id, target, sentence, segments, translation, pinyin: pinyin(sentence, { toneType: 'symbol' }), source: 'editorial-practice', acceptedSentences };
    group.push(row); sentences.push(row);
  }
  finish();
}
writeFileSync('src/data/practice/sentences.json', JSON.stringify(sentences, null, 2) + '\n');
writeFileSync('src/data/practice/readings.json', JSON.stringify(readings, null, 2) + '\n');
console.log(`${sentences.length} authored sentences; ${readings.length} original passages.`);
