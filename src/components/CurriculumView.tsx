import { useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock, Compass, PlayCircle } from 'lucide-react';
import { LESSONS, STAGES } from '../data/curriculumData';
import { LanguageMode, UserProgress } from '../types/quranic';
import { ScholarlyImage } from './ScholarlyImage';

interface CurriculumViewProps {
  progress: UserProgress;
  languageMode: LanguageMode;
  onChangeLanguageMode: (mode: LanguageMode) => void;
  onSelectLesson: (lessonId: string) => void;
  onNavigateTab: (tab: 'roots' | 'grammar' | 'translator' | 'vocabulary') => void;
}

export function CurriculumView({
  progress,
  languageMode,
  onChangeLanguageMode,
  onSelectLesson,
  onNavigateTab,
}: CurriculumViewProps) {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  const completedCount = progress.completedLessonIds.length;
  const totalLessons = LESSONS.length;
  const completionPct = Math.round((completedCount / totalLessons) * 100);

  const nextLesson =
    LESSONS.find((l) => !progress.completedLessonIds.includes(l.id)) ?? LESSONS[0];

  const filteredStages =
    selectedStageFilter === 'all' ? STAGES : STAGES.filter((s) => s.id === selectedStageFilter);

  return (
    <div className="space-y-10">
      {/* Editorial 2-Column Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-slate-200 rounded-2xl p-6 lg:p-10">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6" dir="rtl">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-urdu-ui">
              <span className="font-semibold text-emerald-800">فہمِ قرآن نصاب</span>
              <span aria-hidden="true">·</span>
              <span>صفر سے براہِ راست قرآنی ترجمے تک</span>
              {languageMode === 'bilingual' && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-sans" dir="ltr">For Native Urdu Speakers</span>
                </>
              )}
            </div>

            <h1 className="font-urdu text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-slate-900 leading-[1.85] text-balance">
              اردو کے ذریعے قرآنی عربی سیکھیں اور خود قرآن کا ترجمہ کریں
            </h1>

            <p className="font-urdu-ui text-base text-slate-600 leading-relaxed max-w-2xl">
              آپ پہلے سے اردو میں چالیس فیصد قرآنی الفاظ جانتے ہیں۔ یہ پانچ مرحلوں پر مشتمل عملی کورس آپ کو حرکات،
              اسم و فعل، سہ حرفی مادہ (صرف)، جملے کی ساخت (نحو) اور آخر میں مکمل سورتوں کے لفظ بہ لفظ ترجمے تک
              قدم بہ قدم لے جائے گا۔
            </p>

            {languageMode === 'bilingual' && (
              <p className="text-sm text-slate-500 font-sans leading-relaxed" dir="ltr">
                A structured 5-stage pathway designed specifically for native Urdu speakers — bridging shared Urdu-Arabic
                vocabulary into Ilm-us-Sarf, Ilm-un-Nahw, and independent Quranic translation.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson.id)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 text-white text-sm font-urdu-ui font-semibold hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <PlayCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {completedCount === 0
                  ? 'پہلا سبق شروع کریں'
                  : `جاری رکھیں: سبق ${nextLesson.number}`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('translator')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-urdu-ui font-medium hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Compass className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
              <span>ترکیب و ترجمہ لیب</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectLesson('lesson-gardaan')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-urdu-ui font-medium hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>گردانِ افعال (14 صیغے)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectLesson('lesson-tarkeeb')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-urdu-ui font-medium hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>آیات کی ترکیبِ نحوی</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-64 lg:h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <ScholarlyImage
              src="/src/assets/images/hero_quran_manuscript_1794813916483.jpg"
              alt="Classical Arabic manuscript on a wooden rehal bookstand in morning sunlight"
              className="w-full h-full object-cover"
              fallbackTitle="فہمِ قرآن — Quranic Arabic Study"
            />
          </div>
        </div>
      </section>

      {/* 4-Column KPI Summary Strip (Tabular Numerals) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="font-urdu-ui text-xs text-slate-500">آپ کی پیش رفت</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-bold text-slate-900">{completionPct}%</span>
            <span className="font-urdu-ui text-xs text-emerald-700">
              ({completedCount}/{totalLessons} اسباق)
            </span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="font-urdu-ui text-xs text-slate-500">مکمل تعلیمی مراحل</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-bold text-slate-900">5</span>
            <span className="font-urdu-ui text-xs text-slate-600">بنیادی تا تکمیل</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="font-urdu-ui text-xs text-slate-500">بنیادی مادے اور الفاظ</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-bold text-slate-900">12 + 24</span>
            <span className="font-urdu-ui text-xs text-slate-600">زیادہ استعمال والے</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="font-urdu-ui text-xs text-slate-500">عملی سورتوں کا تجزیہ</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono-tabular text-2xl font-bold text-slate-900">4</span>
            <span className="font-urdu-ui text-xs text-slate-600">لفظ بہ لفظ ترجمہ</span>
          </div>
        </div>
      </section>

      {/* Workspace Toolbar: Stage Filter & Language Preference */}
      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4" dir="rtl">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSelectedStageFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              selectedStageFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تمام مراحل (5)
          </button>
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setSelectedStageFilter(stage.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedStageFilter === stage.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مرحلہ {stage.number}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => onChangeLanguageMode('bilingual')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              languageMode === 'bilingual'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            اردو + English Terms
          </button>
          <button
            type="button"
            onClick={() => onChangeLanguageMode('urdu')}
            className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              languageMode === 'urdu'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            صرف اردو
          </button>
        </div>
      </section>

      {/* Step-by-Step 5 Stages Roadmap */}
      <section className="space-y-8" dir="rtl">
        {filteredStages.map((stage) => {
          const stageLessons = LESSONS.filter((l) => l.stageId === stage.id);
          const stageDoneCount = stageLessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;

          return (
            <div key={stage.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-100">
                <div className="lg:col-span-9 p-6 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-urdu-ui">
                    <span className="font-semibold text-emerald-800">مرحلہ {stage.number}</span>
                    <span aria-hidden="true">·</span>
                    <span>{stage.levelLabelUr}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">
                      {stageDoneCount} / {stageLessons.length} مکمل
                    </span>
                    {languageMode === 'bilingual' && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans" dir="ltr">
                          {stage.titleEn}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="font-urdu text-2xl font-bold text-slate-900">{stage.titleUr}</h2>
                  <p className="font-urdu-ui text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {stage.descriptionUr}
                  </p>
                </div>

                <div className="lg:col-span-3 hidden lg:block border-r border-slate-100 bg-slate-50">
                  <ScholarlyImage
                    src={stage.imageUrl}
                    alt={stage.titleEn}
                    className="w-full h-full object-cover max-h-44"
                    fallbackTitle={stage.titleUr}
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {stageLessons.map((lesson) => {
                  const isCompleted = progress.completedLessonIds.includes(lesson.id);
                  const quizScore = progress.quizScores[lesson.id];

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => onSelectLesson(lesson.id)}
                      className="w-full text-right p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono-tabular font-semibold text-slate-700">
                            سبق {String(lesson.number).padStart(2, '0')}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 font-urdu-ui">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            {lesson.durationMinutes} منٹ
                          </span>
                          {languageMode === 'bilingual' && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-sans" dir="ltr">
                                {lesson.titleEn}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-urdu text-lg font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                          {lesson.titleUr}
                        </h3>
                        <p className="font-urdu-ui text-xs text-slate-600">{lesson.subtitleUr}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-urdu-ui font-semibold text-emerald-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                            <span>مکمل</span>
                            {typeof quizScore === 'number' && (
                              <span className="font-mono-tabular text-slate-500">({quizScore}%)</span>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-urdu-ui font-medium text-slate-600 group-hover:text-emerald-800">
                            <BookOpen className="w-4 h-4" aria-hidden="true" />
                            <span>سبق کھولیں</span>
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 rotate-180 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
