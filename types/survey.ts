import z from 'zod'

export type QuestionType =
  | 'checkbox'
  | 'radio'
  | 'multiselect'
  | 'singleselect'
  | 'text'
  | 'date'
  | 'rating';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  required?: boolean;
}

// Zod schemas for options
const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, { message: 'Option text is required' }),
});

// Base question schema
const baseQuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, { message: 'Question title is required' }),
  required: z.boolean().optional(),
});

// Schemas for each question type
const selectQuestionSchema = baseQuestionSchema.extend({
  type: z.enum(['checkbox', 'radio', 'multiselect', 'singleselect']),
  options: z.array(optionSchema).min(1, { message: 'At least one option is required' }),
});

const textQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('text'),
});

const dateQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('date'),
});

const ratingQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('rating'),
});

// Discriminated union for all question types
export const questionSchema = z.discriminatedUnion('type', [
  selectQuestionSchema,
  textQuestionSchema,
  dateQuestionSchema,
  ratingQuestionSchema,
]);

export const surveySchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string(),
  questions: z.array(questionSchema).min(1, { message: 'At least one question is required' }),
})

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  showProgress?: boolean;
  createdAt: string;
  modifiedAt?: string;
}

export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
}
