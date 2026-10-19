type TextBlockContent = { text: string };
type ChoiceBlockContent = { answers: { title: string; isTrue: boolean }[] };
type LetterBlockContent = { kana: string; id: string; exercise: boolean; stencil?: boolean };
type RuleBlockContent = { rules: string[] };
type TableBlockContent = { table: string[][] };
type SequenceBlockContent = { sequence: string[] };
type TitleBlockContent = { title: string; sub_title: string };
type MatchingBlockContent = { pairs: string[][] };
type ImageBlockContent = { url: string; alt?: string };

export type LessonBlockText = {
  block_order: number;
  id: string;
  type: "text";
  content: TextBlockContent;
};
export type LessonBlockChoice = {
  block_order: number;
  id: string;
  type: "choice";
  content: ChoiceBlockContent;
};
export type LessonBlockLetter = {
  block_order: number;
  id: string;
  type: "letter";
  content: LetterBlockContent;
};
export type LessonBlockRule = {
  block_order: number;
  id: string;
  type: "rule";
  content: RuleBlockContent;
};
export type LessonBlockTable = {
  block_order: number;
  id: string;
  type: "table";
  content: TableBlockContent;
};
export type LessonBlockSequence = {
  block_order: number;
  id: string;
  type: "sequence";
  content: SequenceBlockContent;
};
export type LessonBlockTitle = {
  block_order: number;
  id: string;
  type: "title";
  content: TitleBlockContent;
};
export type LessonBlockMatching = {
  block_order: number;
  id: string;
  type: "matching";
  content: MatchingBlockContent;
};

export type LessonBlockImage = {
  block_order: number;
  id: string;
  type: "image";
  content: ImageBlockContent;
};

export type AnyLessonBlock =
  | LessonBlockText
  | LessonBlockChoice
  | LessonBlockLetter
  | LessonBlockRule
  | LessonBlockTable
  | LessonBlockSequence
  | LessonBlockTitle
  | LessonBlockMatching
  | LessonBlockImage;

export type InfoLessonScreen = {
  id: string;
  screen_order: number;
  title: string;
  blocks: AnyLessonBlock[];
};
