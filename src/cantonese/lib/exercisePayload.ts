import { z } from 'zod';

/** Validate stored/generated exercises before components read their fields. */
export const rawExerciseSchema = z.object({ description: z.string().optional(), items: z.array(z.unknown()) });
export type RawExercisePayload = z.infer<typeof rawExerciseSchema>;
export interface ExerciseHooks {
  getScore: () => { score: number; total: number };
  getAnswers: () => unknown;
}
export interface ExerciseSessionInput {
  lesson_id: string; user_id: string; type: string; count: number;
  score: number; total: number; answers: unknown; duration_seconds?: number;
}
const payload = <T extends z.ZodTypeAny>(item: T) => z.object({ description: z.string().optional(), items: z.array(item) });
export const flashcardSchema = payload(z.object({
  word: z.string().optional(), front: z.string().optional(),
  jyutping: z.string().optional(), frontJyutping: z.string().optional(),
  vi: z.string().optional(), back: z.string().optional(),
}));
export const fillBlankSchema = payload(z.object({
  sentence: z.string().optional(), sentenceJyutping: z.string().optional(),
  sentenceBefore: z.string().optional(), sentenceAfter: z.string().optional(),
  sentenceBeforeJyutping: z.string().optional(), sentenceAfterJyutping: z.string().optional(),
  answer: z.string().min(1), hint: z.string().optional(),
}));
export const multipleChoiceSchema = payload(z.object({
  question: z.string(), questionJyutping: z.string().optional(),
  choices: z.array(z.string()), choicesJyutping: z.array(z.string()).optional(),
  correct: z.number().int().nonnegative(),
}).refine(item => item.correct < item.choices.length, 'Correct choice is out of range'));
export const trueFalseSchema = payload(z.object({
  statement: z.string(), statementJyutping: z.string().optional(),
  answer: z.union([z.boolean(), z.enum(['true', 'false']).transform(value => value === 'true')]),
}));
export const reorderSchema = payload(z.object({
  words: z.array(z.string()).optional(), solution: z.array(z.string()).optional(),
  wordsJyutping: z.array(z.string()).optional(), solutionJyutping: z.array(z.string()).optional(),
  shuffled: z.array(z.string()).optional(), correct: z.array(z.string()).optional(),
  shuffledJyutping: z.array(z.string()).optional(), correctJyutping: z.array(z.string()).optional(),
  translation: z.string().optional(),
}));
export const hanziSchema = payload(z.object({
  char: z.string().optional(), character: z.string().optional(), hint: z.string().optional(),
  meaning: z.string().optional(), jyutping: z.string().optional(), strokes: z.number().optional(),
}));
export const reviewSchema = z.object({
  fill_blank: fillBlankSchema.shape.items,
  multichoice: multipleChoiceSchema.shape.items,
  true_false: trueFalseSchema.shape.items,
  reorder: reorderSchema.shape.items,
});
export type ReviewPayload = z.infer<typeof reviewSchema>;
