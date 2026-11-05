import data from './pdf-vocabulary.json';
import type { MsutongWord } from './so-cap-1-vocab';

export interface PdfMsutongWord extends MsutongWord {
  category: string;
  sources: { kind: string; pdfPage: number; row: number; column?: string }[];
  correction?: string;
  exampleSource?: string;
}

// Reviewed source: reviewed/book*.tsv + reviewed/lesson-census.txt.
export const pdfMsutongVocabulary: PdfMsutongWord[] = data;
