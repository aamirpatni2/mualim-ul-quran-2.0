import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import { ABWAB_REFERENCE, BALAGHA_TOPICS } from '../data/abwabAndLibraryData';
import { LESSONS, STAGES } from '../data/curriculumData';
import { findGrammarTermByText } from '../data/glossaryData';
import { STRUCTURED_CONCEPTS, StructuredGrammarConcept } from '../data/sarfNahwConceptsData';
import {
  GrammarTerm,
  LanguageMode,
  LearningMode,
  UserProgress,
} from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { AiTutorContext } from './AiTutorDrawer';
import { ClickableGrammarText } from './ClickableGrammarText';
import { GardaanExplorer } from './GardaanExplorer';
import { GrammarSandboxView } from './GrammarSandboxView';
import { LessonWorkspace } from './LessonWorkspace';
import { VerificationBadge } from './VerificationBadge';

export type LearnTrackId =
  | 'curriculum'
  | 'sarf_concepts'
  | 'gardaan'
  | 'abwab'
  | 'nahw_irab'
  | 'balagha'
  | 'classical';

interface LearnHubViewProps {
  languageMode: LanguageMode;
  learningMode: LearningMode;
  progress: UserProgress;
  activeLessonId: string | null;
  activeTrack: LearnTrackId;
  onChangeTrack: (track: LearnTrackId) => void;
  onSelectLesson: (lessonId: string) => void;
  onCloseLesson: () => void;
  onCompleteLesson: (lessonId: string, scorePct: number) => void;
  onSelectGrammarTerm: (term: GrammarTerm) => void;
  onOpenAiTutor: (ctx: AiTutorContext) => void;
  onLogWeakTopic: (titleUr: string, sourceKind: 'quiz' | 'tarkib' | 'vocab' | 'gardaan') => void;
}

export function LearnHubView({
  languageMode,
  learningMode,
  progress,
  activeLessonId,
  activeTrack,
  onChangeTrack,
  onSelectLesson,
  onCloseLesson,
  onCompleteLesson,
  onSelectGrammarTerm,
  onOpenAiTutor,
  onLogWeakTopic,
}: LearnHubViewProps) {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(STRUCTURED_CONCEPTS[0].id);
  const [conceptAnswers, setConceptAnswers] = useState<Record<string, string>>({});
  const [conceptChecked, setConceptChecked] = useState<Record<string, boolean>>({});
  const [babFilter, setBabFilter] = useState<'all' | 'mujarrad' | 'mazeed'>('all');

  if (activeLessonId) {
    return (
      <div className="space-y-4">
        <LessonWorkspace
          lessonId={activeLessonId}
          languageMode={languageMode}
          progress={progress}
          onCompleteLesson={onCompleteLesson}
          onSelectLesson={onSelectLesson}
          onBackToCurriculum={onCloseLesson}
        />
      </div>
    );
  }

  const tracks: { id: LearnTrackId; labelUr: string; labelEn: string }[] = [
    { id: 'curriculum', labelUr: 'بنیادی تا اعلیٰ اسباق (١٧)', labelEn: '17-Lesson Path' },
    { id: 'sarf_concepts', labelUr: 'علمِ صرف و مشتقات', labelEn: 'Ilm-ul-Sarf' },
    { id: 'gardaan', labelUr: 'مکمل گردان (١٤ صیغے)', labelEn: 'Complete Gardaan' },
    { id: 'abwab', labelUr: 'ابوابِ ثلاثی و مزید فیہ', labelEn: 'Abwab' },
    { id: 'nahw_irab', labelUr: 'علمِ نحو و اعراب', labelEn: 'Nahw & I’rab' },
    { id: 'balagha', labelUr: 'علمِ بلاغت', labelEn: 'Ilm-ul-Balagha' },
    { id: 'classical', labelUr: 'عربیِ کلاسیکی و توابع', labelEn: 'Classical Arabic' },
  ];

  const renderConceptModule = (concept: StructuredGrammarConcept) => {
    const chosen = conceptAnswers[concept.id];
    const checked = Boolean(conceptChecked[concept.id]);
    const isCorrect = chosen === concept.quickCheck.correctId;

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={concept.verificationStatus} compact />
              <span className="text-xs font-mono text-slate-500" dir="ltr">
                {concept.titleEn}
              </span>
            </div>
            <h2 className="font-urdu text-2xl font-bold text-slate-900">{concept.titleUr}</h2>
            <div className="font-arabic text-xl text-emerald-800">{concept.titleAr}</div>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenAiTutor({
                contextType: 'lesson',
                contextTitle: concept.titleUr,
                arabicText: concept.quranExamples[0]?.arabic,
                contextDetails: concept.simpleSummaryUr,
              })
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            استادِ معلم سے پوچھیں
          </button>
        </div>

        {/* 1. Simple Summary */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
          <div className="text-xs font-urdu-ui font-bold text-emerald-900">آسان تعارف</div>
          <p className="font-urdu-ui text-sm text-slate-900 leading-relaxed">
            <ClickableGrammarText text={concept.simpleSummaryUr} onSelectTerm={onSelectGrammarTerm} />
          </p>
        </div>

        {/* 2. Classical Arabic Definition (Highlighted in Detailed Mode) */}
        {learningMode !== 'guided' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-xs font-urdu-ui font-bold text-slate-700">
              عربی کلاسیکی تعریف (درسِ نظامی)
            </div>
            <p className="font-arabic text-xl text-slate-900">{concept.arabicDefinition}</p>
          </div>
        )}

        {/* 3. Rule & Usage + Signs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-urdu-ui font-bold text-slate-800">قاعدہ و استعمال</div>
            <p className="font-urdu-ui text-sm text-slate-700 leading-relaxed">
              <ClickableGrammarText text={concept.ruleAndUsageUr} onSelectTerm={onSelectGrammarTerm} />
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-urdu-ui font-bold text-slate-800">پہچان کی علامات</div>
            <ul className="space-y-1.5 list-disc list-inside text-sm font-urdu-ui text-slate-700">
              {concept.signsUr.map((s, idx) => (
                <li key={idx}>
                  <ClickableGrammarText text={s} onSelectTerm={onSelectGrammarTerm} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Patterns / Forms */}
        <div className="space-y-2">
          <div className="text-xs font-urdu-ui font-bold text-slate-800">اہم اوزان و صورتیں</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {concept.patternsOrForms.map((pf, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3"
              >
                <span className="font-urdu-ui text-xs text-slate-700">
                  <ClickableGrammarText text={pf.meaningUr} onSelectTerm={onSelectGrammarTerm} />
                </span>
                <span className="font-arabic text-lg font-bold text-emerald-900 shrink-0">
                  {pf.labelAr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Exceptions & Common Mistakes */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
          <div className="text-xs font-urdu-ui font-bold text-amber-900">
            استثناءات اور عام غلطیاں
          </div>
          <p className="font-urdu-ui text-sm text-amber-950 leading-relaxed">
            <ClickableGrammarText
              text={concept.exceptionsAndMistakesUr}
              onSelectTerm={onSelectGrammarTerm}
            />
          </p>
        </div>

        {/* 6. Quranic Examples */}
        <div className="space-y-3">
          <div className="text-xs font-urdu-ui font-bold text-slate-800">قرآنی شواہد و ترکیب</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {concept.quranExamples.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-emerald-200 bg-white space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-urdu-ui text-emerald-800 font-semibold">
                    {ex.ref}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakArabic(ex.arabic)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-800 cursor-pointer"
                    aria-label="آیت سنیں"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-arabic text-xl text-slate-900">{ex.arabic}</p>
                <p className="font-urdu text-sm text-slate-700">{ex.translationUr}</p>
                <p className="font-urdu-ui text-xs text-slate-600 border-t border-slate-100 pt-2">
                  <ClickableGrammarText text={ex.tarkibNoteUr} onSelectTerm={onSelectGrammarTerm} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Quick Check */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="text-xs font-urdu-ui font-bold text-slate-800">فوری مشق (Practice)</div>
          <p className="font-urdu-ui text-sm font-medium text-slate-900">
            {concept.quickCheck.questionUr}
          </p>
          <div className="font-arabic text-2xl text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200 inline-block">
            {concept.quickCheck.arabicPrompt}
          </div>
          <div className="space-y-2">
            {concept.quickCheck.options.map((opt) => {
              const isSelected = chosen === opt.id;
              const isRight = opt.id === concept.quickCheck.correctId;
              let cls = 'border-slate-200 bg-white hover:border-emerald-300';
              if (checked && learningMode !== 'exam') {
                if (isRight) cls = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                else if (isSelected) cls = 'border-rose-400 bg-rose-50 text-rose-950';
              } else if (isSelected) {
                cls = 'border-emerald-600 bg-emerald-50/70';
              }
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={checked}
                  onClick={() => setConceptAnswers((p) => ({ ...p, [concept.id]: opt.id }))}
                  className={`w-full text-right px-3.5 py-2.5 rounded-lg border text-sm font-urdu-ui flex items-center justify-between gap-2 cursor-pointer ${cls}`}
                >
                  <span>{opt.labelUr}</span>
                  {checked && isRight && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  {checked && isSelected && !isRight && (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>
          {!checked ? (
            <button
              type="button"
              disabled={!chosen}
              onClick={() => {
                setConceptChecked((p) => ({ ...p, [concept.id]: true }));
                if (chosen !== concept.quickCheck.correctId) {
                  onLogWeakTopic(concept.titleUr, 'quiz');
                }
              }}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-semibold disabled:opacity-40 hover:bg-emerald-800 cursor-pointer"
            >
              جواب کی تصدیق کریں
            </button>
          ) : (
            <div
              className={`p-3 rounded-lg border text-xs font-urdu-ui ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {concept.quickCheck.explanationUr}
            </div>
          )}
        </div>

        {/* Related clickable glossary terms */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-urdu-ui font-bold text-slate-600">متعلقہ اصطلاحات:</span>
          {concept.relatedTermIds.map((tid) => {
            const term = findGrammarTermByText(tid) ??
              (() => {
                // also match by id
                return undefined;
              })();
            if (!term) return null;
            return (
              <button
                key={tid}
                type="button"
                onClick={() => onSelectGrammarTerm(term)}
                className="px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-urdu-ui cursor-pointer hover:bg-emerald-100"
              >
                {term.termUr}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header + 7 Subject Track Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
              تعلیمی نصاب (Learn Academy)
            </h1>
            <p className="font-urdu-ui text-sm text-slate-600">
              بنیادی عربی سے علمِ صرف، مکمل گردان، ابواب، علمِ نحو، اعراب، بلاغت اور کلاسیکی عربی تک مرحلہ وار سفر۔
            </p>
          </div>
          <div className="text-xs font-urdu-ui text-emerald-800 font-semibold flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            مکمل اسباق: {progress.completedLessonIds.length} / {LESSONS.length}
          </div>
        </div>

        <div className="flex flex-nowrap sm:flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {tracks.map((tr) => {
            const active = activeTrack === tr.id;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => onChangeTrack(tr.id)}
                className={`px-3 py-2 min-h-[40px] rounded-lg text-xs font-urdu-ui font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  active
                    ? 'bg-white text-emerald-800 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tr.labelUr}
                {languageMode === 'bilingual' && (
                  <span className="font-sans opacity-65 mr-1.5" dir="ltr">
                    ({tr.labelEn})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Track 1: 17-Lesson Progressive Path (Stages 1 to 5) */}
      {activeTrack === 'curriculum' && (
        <div className="space-y-6">
          {STAGES.map((stage) => {
            const stageLessons = LESSONS.filter((l) => l.stageId === stage.id);
            const completedInStage = stageLessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;

            return (
              <section
                key={stage.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-urdu-ui font-bold text-emerald-800">
                      <Layers className="w-4 h-4" />
                      مرحلہ {stage.number} · {stage.levelLabelUr}
                    </div>
                    <h2 className="font-urdu text-xl sm:text-2xl font-bold text-slate-900">
                      {stage.titleUr}
                    </h2>
                    <p className="font-urdu-ui text-xs sm:text-sm text-slate-600">
                      {stage.descriptionUr}
                    </p>
                  </div>
                  <div className="text-xs font-mono-tabular font-semibold text-slate-600" dir="ltr">
                    {completedInStage}/{stageLessons.length} Completed
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {stageLessons.map((lesson) => {
                    const done = progress.completedLessonIds.includes(lesson.id);
                    const score = progress.quizScores[lesson.id];
                    return (
                      <div
                        key={lesson.id}
                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono-tabular text-sm font-bold shrink-0 mt-0.5 ${
                              done
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {done ? <CheckCircle2 className="w-5 h-5" /> : lesson.number}
                          </div>
                          <div className="space-y-1">
                            <div className="font-urdu text-lg font-bold text-slate-900">
                              {lesson.titleUr}
                            </div>
                            <p className="font-urdu-ui text-xs text-slate-600">{lesson.subtitleUr}</p>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-urdu-ui text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {lesson.durationMinutes} منٹ
                              </span>
                              <span>·</span>
                              <span>{lesson.keyOutcomeUr}</span>
                              {score !== undefined && (
                                <>
                                  <span>·</span>
                                  <span className="text-emerald-800 font-semibold font-mono-tabular">
                                    کوئز: {score}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectLesson(lesson.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-urdu-ui font-semibold whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                            done
                              ? 'border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                              : 'bg-emerald-700 text-white hover:bg-emerald-800'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {done ? 'دوبارہ پڑھیں' : 'سبق کھولیں'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Track 2: Ilm-ul-Sarf Concepts */}
      {activeTrack === 'sarf_concepts' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STRUCTURED_CONCEPTS.filter((c) => c.discipline === 'sarf').map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedConceptId(c.id)}
                className={`px-4 py-2 rounded-xl border text-xs font-urdu-ui font-semibold cursor-pointer ${
                  selectedConceptId === c.id ||
                  !STRUCTURED_CONCEPTS.some((x) => x.id === selectedConceptId && x.discipline === 'sarf')
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {c.titleUr}
              </button>
            ))}
          </div>
          {renderConceptModule(
            STRUCTURED_CONCEPTS.find((c) => c.id === selectedConceptId && c.discipline === 'sarf') ??
              STRUCTURED_CONCEPTS.find((c) => c.discipline === 'sarf')!
          )}
        </div>
      )}

      {/* Track 3: Complete Gardaan (Existing Component Preserved) */}
      {activeTrack === 'gardaan' && <GardaanExplorer languageMode={languageMode} />}

      {/* Track 4: Abwab Reference & Semantic Guide */}
      {activeTrack === 'abwab' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-urdu text-xl font-bold text-slate-900">
                ثلاثی مجرد و مزید فیہ کے مشہور قرآنی ابواب
              </h2>
              <p className="font-urdu-ui text-xs text-slate-600">
                باب بدلنے سے مادے کے معنی میں کیا تبدیلی آتی ہے — مثلاً ع-ل-م سے عَلِمَ (جانا) اور عَلَّمَ (سکھایا)۔
              </p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1 text-xs font-urdu-ui">
              {(
                [
                  { id: 'all', label: 'تمام (١٢)' },
                  { id: 'mujarrad', label: 'ثلاثی مجرد' },
                  { id: 'mazeed', label: 'ثلاثی مزید فیہ' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setBabFilter(f.id)}
                  className={`px-3 py-1.5 rounded-md cursor-pointer ${
                    babFilter === f.id ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ABWAB_REFERENCE.filter((b) => babFilter === 'all' || b.category === babFilter).map((bab) => (
              <div key={bab.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-urdu-ui font-bold text-emerald-800">
                      {bab.category === 'mujarrad' ? 'ثلاثی مجرد' : 'ثلاثی مزید فیہ'}
                    </div>
                    <h3 className="font-urdu text-xl font-bold text-slate-900">{bab.nameUr}</h3>
                  </div>
                  <VerificationBadge status={bab.verificationStatus} compact />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-[10px] font-urdu-ui text-slate-500">ماضی</div>
                    <div className="font-arabic text-lg text-slate-900">{bab.patternMazi}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-urdu-ui text-slate-500">مضارع</div>
                    <div className="font-arabic text-lg text-slate-900">{bab.patternMuzari}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-urdu-ui text-slate-500">مصدر</div>
                    <div className="font-arabic text-lg text-emerald-800">{bab.patternMasdar}</div>
                  </div>
                </div>

                <p className="font-urdu-ui text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {bab.semanticRoleUr}
                </p>

                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-urdu-ui text-emerald-900">
                    <span>{bab.quranExampleRef}</span>
                    <button
                      type="button"
                      onClick={() => speakArabic(bab.quranExampleAr)}
                      className="text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> سنیں
                    </button>
                  </div>
                  <div className="font-arabic text-lg text-slate-900">{bab.quranExampleAr}</div>
                  <div className="font-urdu-ui text-xs text-slate-700">{bab.quranExampleUr}</div>
                </div>

                <div className="text-xs font-urdu-ui text-slate-500">
                  اردو کے مانوس مصادر: <span className="text-slate-800 font-semibold">{bab.urduFamiliarMasdars.join('، ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track 5: Ilm-un-Nahw & I'rab */}
      {activeTrack === 'nahw_irab' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {STRUCTURED_CONCEPTS.filter((c) => c.discipline === 'nahw').map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedConceptId(c.id)}
                className={`px-4 py-2 rounded-xl border text-xs font-urdu-ui font-semibold cursor-pointer ${
                  selectedConceptId === c.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {c.titleUr}
              </button>
            ))}
          </div>
          {renderConceptModule(
            STRUCTURED_CONCEPTS.find((c) => c.id === selectedConceptId && c.discipline === 'nahw') ??
              STRUCTURED_CONCEPTS.find((c) => c.discipline === 'nahw')!
          )}
          <GrammarSandboxView languageMode={languageMode} />
        </div>
      )}

      {/* Track 6: Ilm-ul-Balagha */}
      {activeTrack === 'balagha' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {BALAGHA_TOPICS.map((bal) => (
            <div key={bal.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <VerificationBadge status={bal.verificationStatus} compact />
                  <span className="font-arabic text-lg text-emerald-800">{bal.titleAr}</span>
                </div>
                <h3 className="font-urdu text-xl font-bold text-slate-900">{bal.titleUr}</h3>
                <p className="font-urdu-ui text-sm text-slate-700 leading-relaxed">{bal.simpleDefUr}</p>
                {learningMode !== 'guided' && (
                  <p className="font-arabic text-base text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {bal.arabicDef}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-urdu-ui text-emerald-800 font-semibold">
                  {bal.quranExampleRef}
                </div>
                <div className="font-arabic text-xl text-slate-900">{bal.quranExampleAr}</div>
                <p className="font-urdu-ui text-xs text-slate-600">{bal.quranExampleUr}</p>
                <p className="font-urdu-ui text-xs text-emerald-950 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                  <ClickableGrammarText text={bal.analysisUr} onSelectTerm={onSelectGrammarTerm} />
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Track 7: Advanced Classical Arabic */}
      {activeTrack === 'classical' && (
        <div className="space-y-4">
          {STRUCTURED_CONCEPTS.filter((c) => c.discipline === 'classical').map((c) => (
            <div key={c.id}>{renderConceptModule(c)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
