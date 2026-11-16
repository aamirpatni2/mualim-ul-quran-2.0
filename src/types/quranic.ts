export type WordType = 'ism' | 'fil' | 'harf';

export type PrimaryNavTab = 'home' | 'learn' | 'studio' | 'practice' | 'library';

export type LearningMode = 'guided' | 'detailed' | 'exam';

export type LanguageMode = 'urdu' | 'bilingual';

export type VerificationStatus =
  | 'SOURCE VERIFIED'
  | 'EXPERT REVIEWED'
  | 'AI GENERATED — NEEDS REVIEW'
  | 'MULTIPLE RECOGNIZED ANALYSES';

export type StudentLevelId =
  | 'absolute_beginner'
  | 'can_read'
  | 'basic_arabic'
  | 'basic_sarf'
  | 'basic_nahw'
  | 'dars_e_nizami'
  | 'advanced';

export type StudentGoalId =
  | 'understand_quran'
  | 'learn_grammar'
  | 'master_sarf_nahw'
  | 'perform_tarkib'
  | 'dars_e_nizami_subjects'
  | 'all';

export interface OnboardingProfile {
  completed: boolean;
  skipped: boolean;
  level: StudentLevelId;
  goal: StudentGoalId;
  dailyMinutes: 15 | 30 | 45 | 60 | 90;
  dailyWordTarget: 5 | 10 | 20;
  recommendedLessonId: string;
}

export interface LessonExample {
  arabic: string;
  transliteration: string;
  urduLiteral: string;
  urduIdiomatic?: string;
  breakdownNoteUr: string;
  breakdownNoteEn?: string;
  wordType?: WordType;
  root?: string;
}

export interface InteractiveClassifierItem {
  word: string;
  transliteration: string;
  meaningUr: string;
  correctType: WordType;
  explanationUr: string;
}

export interface QuizQuestion {
  id: string;
  promptUr: string;
  promptEn?: string;
  arabicPrompt?: string;
  options: {
    id: string;
    labelUr: string;
    labelEn?: string;
    arabic?: string;
  }[];
  correctOptionId: string;
  explanationUr: string;
}

export interface LessonStep {
  id: string;
  titleUr: string;
  titleEn: string;
  explanationUr: string;
  explanationEn?: string;
  urduBridgeTipUr?: string;
  examples: LessonExample[];
  interactiveWidget?:
    | 'harakaat'
    | 'classifier'
    | 'iraab'
    | 'pronouns'
    | 'idaafah'
    | 'past_tense'
    | 'present_tense'
    | 'gardaan'
    | 'derived_forms'
    | 'sentence_order'
    | 'tarkeeb';
  classifierItems?: InteractiveClassifierItem[];
}

export interface Lesson {
  id: string;
  number: number;
  stageId: string;
  titleUr: string;
  titleEn: string;
  subtitleUr: string;
  durationMinutes: number;
  keyOutcomeUr: string;
  steps: LessonStep[];
  quiz: QuizQuestion[];
}

export interface Stage {
  id: string;
  number: number;
  titleUr: string;
  titleEn: string;
  descriptionUr: string;
  descriptionEn: string;
  levelLabelUr: string;
  levelLabelEn: string;
  imageUrl?: string;
  lessonIds: string[];
}

export interface DerivedForm {
  patternAr: string;
  patternNameUr: string;
  patternNameEn: string;
  wordAr: string;
  transliteration: string;
  meaningUr: string;
  urduFamiliarNote?: string;
  quranRef: string;
  quranExampleAr: string;
  quranExampleUr: string;
}

export interface QuranRoot {
  id: string;
  rootLetters: string;
  transliteration: string;
  coreMeaningUr: string;
  coreMeaningEn: string;
  quranOccurrences: number;
  urduBridgeWords: string[];
  derivedForms: DerivedForm[];
}

export interface AyahWord {
  id: string;
  arabic: string;
  transliteration: string;
  type: WordType;
  root?: string;
  grammarUr: string;
  grammarEn: string;
  wordUr: string;
  noteUr: string;
}

export interface Ayah {
  number: number;
  arabicFull: string;
  translationUr: string;
  translationEn: string;
  words: AyahWord[];
  grammarInsightUr: string;
  urduOrderTokens: string[];
}

export interface SurahModule {
  id: string;
  surahNumber: number;
  nameAr: string;
  nameUr: string;
  nameEn: string;
  difficultyUr: string;
  difficultyEn: string;
  revelationUr: string;
  summaryUr: string;
  ayahs: Ayah[];
}

export type VocabCategory = 'shared' | 'particles' | 'verbs' | 'attributes' | 'concepts';

export interface VocabItem {
  id: string;
  arabic: string;
  transliteration: string;
  lemma?: string;
  root?: string;
  pattern?: string;
  bab?: string;
  tenseOrFormUr?: string;
  type: WordType;
  category: VocabCategory;
  meaningUr: string;
  meaningEn: string;
  occurrences: number;
  occurrenceBasis?: 'word_form' | 'lemma' | 'root';
  surahRef?: string;
  contextualNotesUr?: string;
  urduBridgeNote: string;
  quranExampleAr: string;
  quranExampleUr: string;
  verificationStatus?: VerificationStatus;
}

/* --- AL-MUALLIM 2.0 Glossary, Quran Studio 4-Tab Word & Complete Tarkib --- */

export interface GrammarTerm {
  id: string;
  termAr: string;
  termUr: string;
  termEn: string;
  aliases: string[];
  simpleUrduDef: string;
  arabicDef: string;
  grammaticalRuleUr: string;
  signsUr: string;
  classificationsUr: { title: string; detail: string }[];
  quranExampleAr: string;
  quranExampleRef: string;
  quranExampleUr: string;
  fullTarkibUr: string;
  commonMistakesUr: string;
  practice: {
    questionUr: string;
    arabicPrompt?: string;
    options: { id: string; labelUr: string }[];
    correctId: string;
    explanationUr: string;
  };
  relatedTerms: string[];
  verificationStatus: VerificationStatus;
}

export interface StudioWordAnalysis {
  id: string;
  arabic: string;
  transliteration: string;
  type: WordType;
  verificationStatus: VerificationStatus;
  meaningTab: {
    wordUr: string;
    wordEn: string;
    root?: string;
    lemma?: string;
    classicalMeaningUr: string;
    contextualMeaningUr: string;
    otherOccurrencesNoteUr: string;
  };
  sarfTab: {
    applicable: boolean;
    root?: string;
    originalLetters?: string;
    extraLetters?: string;
    pattern?: string;
    bab?: string;
    wordKindUr: string; // اسم / فعل / حرف
    seeghahUr?: string;
    tenseUr?: string;
    voiceUr?: string; // معلوم / مجہول
    numberUr?: string;
    genderUr?: string;
    mujarradOrMazeedUr?: string;
    relatedDerivatives?: string[];
    nonSarfNoteUr?: string;
  };
  nahwTab: {
    nahwiRoleUr: string;
    nahwiRoleEn: string;
    relationInSentenceUr: string;
    aamilAndMamoolUr: string;
    relevantRulesUr: string;
    connectedWordsUr: string;
  };
  irabTab: {
    stateUr: string; // مرفوع / منصوب / مجرور / مجزوم / مبنی
    signUr: string; // ضمہ / فتحہ / کسرہ / سکون
    visibilityUr: string; // ظاہری / تقدیری / محلی
    morabOrMabniUr: string; // معرب / مبنی
    reasonUr: string;
    fullExplanationUr: string;
  };
  alternativeNoteUr?: string;
}

export interface StudioTarkibRow {
  wordId: string;
  arabicWord: string;
  meaningUr: string;
  sarfiSummaryUr: string;
  nahwiSummaryUr: string;
  irabSummaryUr: string;
  explanationUr: string;
}

export interface StudioAyah {
  number: number;
  arabicFull: string;
  translationUr: string;
  translationEn: string;
  verificationStatus: VerificationStatus;
  sourceReferenceUr: string;
  words: StudioWordAnalysis[];
  tarkibTable: StudioTarkibRow[];
  completeSarfiExplanationUr: string;
  completeNahwiExplanationUr: string;
  sentenceStructureUr: string;
  relevantRulesUr: string[];
  alternativeInterpretations?: {
    titleUr: string;
    explanationUr: string;
    sourceUr: string;
  }[];
}

export interface StudioSurah {
  id: string;
  surahNumber: number;
  nameAr: string;
  nameUr: string;
  nameEn: string;
  revelationUr: string;
  levelUr: string;
  summaryUr: string;
  ayahs: StudioAyah[];
}

export type VocabSrsStage = 'new' | 'learning' | 'needs_revision' | 'mastered';

export interface VocabProgressRecord {
  stage: VocabSrsStage;
  reviewCount: number;
  lastReviewedAt: string;
  nextReviewAt: string;
}

export interface BookmarkItem {
  id: string;
  kind: 'word' | 'verse' | 'lesson' | 'term' | 'tarkib';
  titleUr: string;
  subtitleUr?: string;
  arabic?: string;
  refTarget: {
    tab: PrimaryNavTab;
    surahId?: string;
    ayahNumber?: number;
    wordId?: string;
    lessonId?: string;
    termId?: string;
  };
  createdAt: string;
}

export interface PersonalNote {
  id: string;
  targetType: 'word' | 'verse' | 'term' | 'lesson';
  targetKey: string;
  targetTitle: string;
  content: string;
  updatedAt: string;
}

export interface WeakTopicItem {
  id: string;
  titleUr: string;
  sourceKind: 'quiz' | 'tarkib' | 'vocab' | 'gardaan';
  missedCount: number;
  lessonId?: string;
  termId?: string;
  lastMissedAt: string;
}

export interface ExamAttemptRecord {
  id: string;
  titleUr: string;
  scorePct: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  masteredVocabIds: string[];
  vocabSrs: Record<string, VocabProgressRecord>;
  completedSurahIds: string[];
  lastLessonId: string;
  lastStudioSurahId: string;
  lastStudioAyahNumber: number;
  bookmarks: BookmarkItem[];
  notes: PersonalNote[];
  weakTopics: WeakTopicItem[];
  examHistory: ExamAttemptRecord[];
  dailyChecklist: {
    dateKey: string;
    vocabDone: number;
    grammarDone: boolean;
    verseDone: boolean;
    quizDone: boolean;
  };
  recentActivities: {
    id: string;
    labelUr: string;
    timestamp: string;
  }[];
}
