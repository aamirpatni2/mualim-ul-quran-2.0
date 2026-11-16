import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, Volume2, XCircle } from 'lucide-react';
import { LESSONS, STAGES } from '../data/curriculumData';
import { LanguageMode, Lesson, UserProgress } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import {
  DerivedFormsTransformer,
  HarakaatExplorer,
  IdaafahPhraseBuilder,
  IraabCaseSimulator,
  PronounCombiner,
  VerbConjugationExplorer,
  WordClassifierGame,
} from './InteractiveGrammarWidgets';
import { GardaanExplorer } from './GardaanExplorer';
import { TarkeebStudio } from './TarkeebStudio';
import { WordTypeLabel } from './WordTypeLabel';

interface LessonWorkspaceProps {
  lessonId: string;
  languageMode: LanguageMode;
  progress: UserProgress;
  onCompleteLesson: (lessonId: string, scorePct: number) => void;
  onSelectLesson: (lessonId: string) => void;
  onBackToCurriculum: () => void;
}

export function LessonWorkspace({
  lessonId,
  languageMode,
  progress,
  onCompleteLesson,
  onSelectLesson,
  onBackToCurriculum,
}: LessonWorkspaceProps) {
  const lesson: Lesson = LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0];
  const stage = STAGES.find((s) => s.id === lesson.stageId) ?? STAGES[0];
  const nextLesson = LESSONS.find((l) => l.number === lesson.number + 1);

  // stepIndex === lesson.steps.length means we are on the Quiz step
  const [stepIndex, setStepIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [lessonId]);

  const isQuizPhase = stepIndex >= lesson.steps.length;
  const activeStep = lesson.steps[Math.min(stepIndex, lesson.steps.length - 1)];
  const totalPhases = lesson.steps.length + 1;

  const correctQuizCount = lesson.quiz.filter((q) => quizAnswers[q.id] === q.correctOptionId).length;
  const quizScorePct = Math.round((correctQuizCount / lesson.quiz.length) * 100);
  const isCompleted = progress.completedLessonIds.includes(lesson.id);

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    onCompleteLesson(lesson.id, quizScorePct);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Lesson Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4" dir="rtl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCurriculum}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>نصاب پر واپس</span>
          </button>
          <div className="text-xs text-slate-500 font-urdu-ui flex items-center gap-2">
            <span>مرحلہ {stage.number}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-800">سبق {lesson.number}</span>
            {isCompleted && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  مکمل
                </span>
              </>
            )}
          </div>
        </div>

        <div className="font-mono-tabular text-xs text-slate-600">
          Step {stepIndex + 1} / {totalPhases}
        </div>
      </div>

      {/* Two-Zone Educational Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Interactive Stage (Left/Center 8 cols) */}
        <div className="lg:col-span-8 space-y-6" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
                {lesson.number}. {lesson.titleUr}
              </h1>
              {languageMode === 'bilingual' && (
                <p className="text-sm text-slate-500 font-sans" dir="ltr">
                  {lesson.titleEn}
                </p>
              )}
              <p className="font-urdu-ui text-sm text-emerald-800 font-medium">{lesson.keyOutcomeUr}</p>
            </div>

            {!isQuizPhase ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-urdu text-xl font-bold text-slate-900">{activeStep.titleUr}</h2>
                    {languageMode === 'bilingual' && (
                      <span className="text-xs text-slate-500 font-sans" dir="ltr">
                        {activeStep.titleEn}
                      </span>
                    )}
                  </div>
                  <p className="font-urdu-ui text-base text-slate-700 leading-loose">{activeStep.explanationUr}</p>
                </div>

                {activeStep.urduBridgeTipUr && (
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-1">
                    <div className="font-urdu-ui text-xs font-bold text-emerald-800">اردو بولنے والوں کے لیے خاص نکتہ</div>
                    <p className="font-urdu-ui text-sm text-emerald-950 leading-relaxed">
                      {activeStep.urduBridgeTipUr}
                    </p>
                  </div>
                )}

                {/* Examples Grid */}
                {activeStep.examples.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-urdu-ui text-sm font-semibold text-slate-700">قرآنی و نحوی مثالیں</h3>
                    <div className="space-y-3">
                      {activeStep.examples.map((ex, i) => (
                        <div
                          key={i}
                          className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 flex flex-col gap-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => speakArabic(ex.arabic)}
                                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors cursor-pointer shrink-0"
                                aria-label={`Listen to ${ex.transliteration}`}
                              >
                                <Volume2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <div className="font-arabic text-2xl sm:text-3xl text-slate-900">{ex.arabic}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {ex.wordType && (
                                <WordTypeLabel type={ex.wordType} languageMode={languageMode} compact />
                              )}
                              {ex.root && (
                                <span className="text-xs font-urdu-ui text-slate-500">مادہ: {ex.root}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-baseline justify-between gap-2 pt-2 border-t border-slate-200/70">
                            <div className="font-urdu text-base font-semibold text-emerald-900">
                              {ex.urduLiteral}
                            </div>
                            {languageMode === 'bilingual' && (
                              <div className="text-xs text-slate-500 font-sans" dir="ltr">
                                {ex.transliteration}
                              </div>
                            )}
                          </div>
                          <p className="font-urdu-ui text-xs text-slate-600 leading-relaxed">{ex.breakdownNoteUr}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Embedded Interactive Widget */}
                {activeStep.interactiveWidget === 'harakaat' && (
                  <HarakaatExplorer languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'classifier' && activeStep.classifierItems && (
                  <WordClassifierGame items={activeStep.classifierItems} languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'iraab' && (
                  <IraabCaseSimulator languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'pronouns' && (
                  <PronounCombiner languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'idaafah' && (
                  <IdaafahPhraseBuilder languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'past_tense' && (
                  <VerbConjugationExplorer mode="past" languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'present_tense' && (
                  <VerbConjugationExplorer mode="present" languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'derived_forms' && (
                  <DerivedFormsTransformer languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'gardaan' && (
                  <GardaanExplorer languageMode={languageMode} />
                )}
                {activeStep.interactiveWidget === 'tarkeeb' && (
                  <TarkeebStudio languageMode={languageMode} />
                )}
              </div>
            ) : (
              /* Mastery Quiz Phase */
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-800">
                  <HelpCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <h2 className="font-urdu text-xl font-bold text-slate-900">سبق کا عملی جائزہ (Mastery Check)</h2>
                </div>

                <div className="space-y-5">
                  {lesson.quiz.map((q, qIdx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isRight = selectedOpt === q.correctOptionId;

                    return (
                      <div key={q.id} className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-50/40">
                        <div className="space-y-2">
                          <div className="font-urdu-ui text-sm font-semibold text-slate-900">
                            {qIdx + 1}. {q.promptUr}
                          </div>
                          {q.arabicPrompt && (
                            <div className="flex items-center gap-3 pt-1">
                              <span className="font-arabic text-3xl text-slate-900">{q.arabicPrompt}</span>
                              <button
                                type="button"
                                onClick={() => speakArabic(q.arabicPrompt!)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 cursor-pointer"
                                aria-label="Play question Arabic"
                              >
                                <Volume2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isSelected = selectedOpt === opt.id;
                            let optClass = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
                            if (quizSubmitted) {
                              if (opt.id === q.correctOptionId) {
                                optClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                              } else if (isSelected && opt.id !== q.correctOptionId) {
                                optClass = 'bg-rose-50 border-rose-500 text-rose-900';
                              }
                            } else if (isSelected) {
                              optClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                            }

                            return (
                              <button
                                key={opt.id}
                                type="button"
                                disabled={quizSubmitted}
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                                className={`w-full text-right px-4 py-3 rounded-lg border text-sm font-urdu-ui transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optClass}`}
                              >
                                <span>{opt.labelUr}</span>
                                {opt.arabic && <span className="font-arabic text-xl">{opt.arabic}</span>}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div
                            className={`flex items-start gap-2 text-xs font-urdu-ui pt-1 ${
                              isRight ? 'text-emerald-800' : 'text-rose-800'
                            }`}
                          >
                            {isRight ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" aria-hidden="true" />
                            ) : (
                              <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" aria-hidden="true" />
                            )}
                            <span>{q.explanationUr}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                    onClick={handleSubmitQuiz}
                    className="px-6 py-3 rounded-xl bg-emerald-700 text-white text-sm font-urdu-ui font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    جوابات چیک کریں اور سبق مکمل کریں
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-urdu text-lg font-bold text-emerald-950">
                        ماشاء اللہ! اسکور: {correctQuizCount} از {lesson.quiz.length} ({quizScorePct}%)
                      </div>
                      <p className="font-urdu-ui text-xs text-emerald-800">
                        یہ سبق آپ کی پیش رفت میں محفوظ ہو گیا ہے۔
                      </p>
                    </div>
                    {nextLesson && (
                      <button
                        type="button"
                        onClick={() => onSelectLesson(nextLesson.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
                      >
                        <span>اگلا سبق: {nextLesson.number}. {nextLesson.titleUr}</span>
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step Navigation Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <button
                type="button"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-urdu-ui font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                <span>پچھلا مرحلہ</span>
              </button>

              {!isQuizPhase && (
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
                >
                  <span>
                    {stepIndex === lesson.steps.length - 1 ? 'آخری مرحلہ: عملی جائزہ (Quiz)' : 'اگلا مرحلہ'}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Control & Step Deck (4 cols) */}
        <aside className="lg:col-span-4 space-y-5" dir="rtl">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-urdu-ui text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              اس سبق کے مراحل
            </h3>
            <div className="space-y-1.5">
              {lesson.steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  className={`w-full text-right px-3 py-2.5 rounded-lg text-xs font-urdu-ui transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    stepIndex === idx
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">
                    {idx + 1}. {step.titleUr}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStepIndex(lesson.steps.length)}
                className={`w-full text-right px-3 py-2.5 rounded-lg text-xs font-urdu-ui transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                  isQuizPhase
                    ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{lesson.steps.length + 1}. عملی جائزہ (Quiz)</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-urdu-ui text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              کلیدی علامات (Quick Key)
            </h3>
            <div className="space-y-2.5 text-xs font-urdu-ui text-slate-600">
              <div className="flex items-center justify-between">
                <WordTypeLabel type="ism" languageMode={languageMode} compact />
                <span>ال یا تنوین (ٌ ً ٍ)</span>
              </div>
              <div className="flex items-center justify-between">
                <WordTypeLabel type="fil" languageMode={languageMode} compact />
                <span>زمانہ + کام</span>
              </div>
              <div className="flex items-center justify-between">
                <WordTypeLabel type="harf" languageMode={languageMode} compact />
                <span>مِنْ، فِيْ، عَلٰى، وَ، إِنَّ</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
