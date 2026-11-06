import data from './pdf-vocabulary.json';
import intermediate from './intermediate-vocabulary.json';
import advanced from './advanced-vocabulary.json';
import type { MsutongWord } from './so-cap-1-vocab';

export interface PdfMsutongWord extends MsutongWord {
  category: string;
  sources: { kind: string; pdfPage?: number; row: number; column?: string; table?: number; originalMeaning?: string; url?: string; sourceFile?: string }[];
  meaningSource?: string;
  correction?: string;
  exampleSource?: string;
}

// Reviewed source: reviewed/book*.tsv + reviewed/lesson-census.txt.
export const pdfMsutongVocabulary: PdfMsutongWord[] = data;

export const intermediateMsutongVocabulary: PdfMsutongWord[] = intermediate;

export const advancedMsutongVocabulary: PdfMsutongWord[] = advanced;
