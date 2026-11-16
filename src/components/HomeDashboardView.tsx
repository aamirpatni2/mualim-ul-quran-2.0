import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Circle,
  Compass,
  Play,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { LESSONS, STAGES } from '../data/curriculumData';
import { QURAN_STUDIO_SURAHS } from '../data/quranStudioData';
import { VOCABULARY_ITEMS } from '../data/vocabularyData';
import {
  LearningMode,
  OnboardingProfile,
  PrimaryNavTab,
  UserProgress,
} from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { AiTutorContext } from './AiTutorDrawer';

interface HomeDashboardViewProps {
  progress: UserProgress;
  profile: OnboardingProfile;
  learningMode: LearningMode;
  onNavigateTab: (tab: PrimaryNavTab) => void;
  onStartLesson: (lessonId: string) => void;
  onOpenQuranStudio: (surahId: string, ayahNumber: number) => void;
  onOpenPracticeArea: (area: 'vocab' | 'quiz' | 'revision' | 'tarkib') => void;
  onOpenOnboarding: () => void;
  onUpdateDailyWordTarget: (target: 5 | 10 | 20) => void;
  onOpenAiTutor: (ctx: AiTutorContext) => void;
}

export function HomeDashboardView({
  progress,
  profile,
  learningMode,
  onNavigateTab,
  onStartLesson,
  onOpenQuranStudio,
  onOpenPracticeArea,
  onOpenOnboarding,
  onUpdateDailyWordTarget,
  onOpenAiTutor,
}: HomeDashboardViewProps) {
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  const resumeLesson =
    LESSONS.find((l) => l.id === progress.lastLessonId) ??
    LESSONS.find((l) => l.id === profile.recommendedLessonId) ??
    LESSONS[0];
  const resumeStage = STAGES.find((s) => s.id === resumeLesson.stageId) ?? STAGES[0];
  const isResumeCompleted = progress.completedLessonIds.includes(resumeLesson.id);

  // Recommended next uncompleted lesson
  const nextRecommended =
    LESSONS.find((l) => !progress.completedLessonIds.includes(l.id)) ?? LESSONS[LESSONS.length - 1];

  // Deterministic Daily Quranic Word based on day of month
  const dayOfMonth = new Date().getDate();
  const dailyWord = VOCABULARY_ITEMS[dayOfMonth % VOCABULARY_ITEMS.length];

  const studioSurah =
    QURAN_STUDIO_SURAHS.find((s) => s.id === progress.lastStudioSurahId) ??
    QURAN_STUDIO_SURAHS[0];

  const completedPct = Math.round((progress.completedLessonIds.length / LESSONS.length) * 100);
  const weakCount = progress.weakTopics.length;
  const vocabTarget = profile.dailyWordTarget;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Main Welcome Area */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="font-arabic text-2xl sm:text-3xl font-bold text-emerald-800">
            السَّلَامُ عَلَيْكُمْ
          </div>
          <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
            آج ہم قرآن کی عربی کا ایک نیا سبق سیکھیں گے۔
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs font-urdu-ui text-slate-500 pt-1">
            <span>روزانہ ہدف: {profile.dailyMinutes} منٹ</span>
            <span aria-hidden="true">·</span>
            <span>نئے الفاظ: {vocabTarget}</span>
            <span aria-hidden="true">·</span>
            <span>
              موڈ:{' '}
              {learningMode === 'guided'
                ? 'رہنمائی (Guided)'
                : learningMode === 'detailed'
                ? 'تفصیلی (Detailed)'
                : 'امتحان (Exam)'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-urdu-ui font-medium text-slate-700 hover:border-slate-300 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            تعلیمی پروفائل تبدیل کریں
          </button>
          <button
            type="button"
            onClick={() => setShowWeeklyReport((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-urdu-ui font-semibold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            {showWeeklyReport ? 'رپورٹ بند کریں' : 'ہفتہ وار رپورٹ دیکھیں'}
          </button>
        </div>
      </section>

      {/* Optional Weekly Progress Report */}
      {showWeeklyReport && (
        <section className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-urdu text-xl font-bold">ہفتہ وار تعلیمی رپورٹ (Weekly Progress)</h2>
              <p className="font-urdu-ui text-xs text-slate-400">
                آپ کی حالیہ مشقوں، اسباق اور امتحانات کا خلاصہ
              </p>
            </div>
            <span className="font-mono-tabular text-xs text-emerald-300" dir="ltr">
              {completedPct}% Curriculum Complete
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-xs font-urdu-ui text-slate-400">مکمل اسباق</div>
              <div className="text-xl font-mono-tabular font-bold text-white">
                {progress.completedLessonIds.length} / {LESSONS.length}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-xs font-urdu-ui text-slate-400">الفاظ کی مہارت</div>
              <div className="text-xl font-mono-tabular font-bold text-emerald-300">
                {progress.masteredVocabIds.length} / {VOCABULARY_ITEMS.length}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-xs font-urdu-ui text-slate-400">محفوظ نوٹس و بک مارکس</div>
              <div className="text-xl font-mono-tabular font-bold text-amber-300">
                {progress.bookmarks.length + progress.notes.length}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-xs font-urdu-ui text-slate-400">دہرائی کے موضوعات</div>
              <div className="text-xl font-mono-tabular font-bold text-rose-300">{weakCount}</div>
            </div>
          </div>

          {progress.examHistory.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-urdu-ui font-semibold text-slate-300">حالیہ امتحانی نتائج:</div>
              <div className="flex flex-wrap gap-2">
                {progress.examHistory.slice(0, 4).map((ex) => (
                  <div
                    key={ex.id}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-urdu-ui flex items-center gap-2"
                  >
                    <span>{ex.titleUr}</span>
                    <span className="font-mono-tabular text-emerald-300" dir="ltr">
                      {ex.scorePct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Primary Action Grid: Continue Learning + Today's Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Primary Card: Continue Learning */}
        <section className="lg:col-span-7 bg-emerald-900 text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs font-urdu-ui text-emerald-200">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <BookOpen className="w-4 h-4 shrink-0" />
                تعلیم جاری رکھیں (Continue Learning)
              </span>
              <span className="font-mono-tabular" dir="ltr">
                {isResumeCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>

            <div className="text-xs font-urdu-ui text-emerald-200/90">
              موجودہ مرحلہ: {resumeStage.titleUr}
            </div>

            <h2 className="font-urdu text-2xl sm:text-3xl font-bold leading-[1.9]">
              سبق {resumeLesson.number}: {resumeLesson.titleUr}
            </h2>
            <p className="font-urdu-ui text-sm text-emerald-100/90 leading-relaxed">
              {resumeLesson.subtitleUr}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-800/80">
            <div className="text-xs font-urdu-ui text-emerald-200">
              اگلا تجویز کردہ سبق: سبق {nextRecommended.number} — {nextRecommended.titleUr}
            </div>
            <button
              type="button"
              onClick={() => onStartLesson(resumeLesson.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-urdu-ui text-sm font-bold hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              سبق جاری رکھیں
            </button>
          </div>
        </section>

        {/* Today's Study Plan */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-urdu text-xl font-bold text-slate-900">آج کا مطالعہ پلان</h2>
              <p className="font-urdu-ui text-xs text-slate-500">آج کے چار مختصر تعلیمی اہداف</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-mono-tabular" dir="ltr">
              {([5, 10, 20] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onUpdateDailyWordTarget(n)}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    vocabTarget === n
                      ? 'bg-white text-emerald-800 font-bold shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  {n}w
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 flex-1">
            <button
              type="button"
              onClick={() => onOpenPracticeArea('vocab')}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {progress.dailyChecklist.vocabDone >= vocabTarget ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="font-urdu-ui text-xs sm:text-sm text-slate-800">
                  ١. قرآن کے {vocabTarget} اہم الفاظ یاد کریں
                </span>
              </div>
              <span className="text-[11px] font-mono-tabular text-slate-500" dir="ltr">
                {Math.min(progress.dailyChecklist.vocabDone, vocabTarget)}/{vocabTarget}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onStartLesson(nextRecommended.id)}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {progress.dailyChecklist.grammarDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="font-urdu-ui text-xs sm:text-sm text-slate-800">
                  ٢. ایک گرامر یا صرفی قاعدہ پڑھیں
                </span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onOpenQuranStudio(studioSurah.id, progress.lastStudioAyahNumber || 1)}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {progress.dailyChecklist.verseDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="font-urdu-ui text-xs sm:text-sm text-slate-800">
                  ٣. ایک منتخب قرآنی آیت کا تجزیہ کریں
                </span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onOpenPracticeArea('quiz')}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors flex items-center justify-between gap-3 text-right cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {progress.dailyChecklist.quizDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                )}
                <span className="font-urdu-ui text-xs sm:text-sm text-slate-800">
                  ٤. مختصر کوئز یا ترکیبِ نحوی مشق مکمل کریں
                </span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </section>
      </div>

      {/* 4 Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Quranic Word */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-urdu-ui font-bold text-emerald-800">آج کا قرآنی لفظ</span>
            <button
              type="button"
              onClick={() => speakArabic(dailyWord.arabic)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-800 cursor-pointer"
              aria-label="لفظ سنیں"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <div className="font-arabic text-3xl text-slate-900">{dailyWord.arabic}</div>
            <div className="font-urdu-ui text-sm font-bold text-slate-800 mt-1">
              {dailyWord.meaningUr}
            </div>
            <p className="font-urdu-ui text-xs text-slate-500 mt-1 line-clamp-2">
              {dailyWord.urduBridgeNote}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenAiTutor({
                contextType: 'word',
                contextTitle: `آج کا لفظ: ${dailyWord.arabic}`,
                arabicText: dailyWord.arabic,
                contextDetails: `Meaning: ${dailyWord.meaningUr}; Root: ${dailyWord.root ?? 'N/A'}`,
              })
            }
            className="text-xs font-urdu-ui font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer pt-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> استادِ معلم سے مزید مثالیں دیکھیں
          </button>
        </div>

        {/* Continue Quran Reading */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-urdu-ui font-bold text-slate-700">
            <Compass className="w-4 h-4 text-emerald-700" />
            قرآن اسٹوڈیو جاری رکھیں
          </div>
          <div>
            <div className="font-arabic text-2xl text-slate-900">{studioSurah.nameAr}</div>
            <div className="font-urdu-ui text-sm font-bold text-slate-800">
              {studioSurah.nameUr} · آیت {progress.lastStudioAyahNumber || 1}
            </div>
            <p className="font-urdu-ui text-xs text-slate-500 mt-1">
              لفظ بہ لفظ صرف، نحو، اعراب اور مکمل ترکیبِ نحوی دیکھیں۔
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenQuranStudio(studioSurah.id, progress.lastStudioAyahNumber || 1)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer w-full"
          >
            قرآن اسٹوڈیو کھولیں
          </button>
        </div>

        {/* Review Difficult Concepts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-urdu-ui font-bold text-amber-800">
            <AlertCircle className="w-4 h-4" />
            مشکل نکات کی دہرائی
          </div>
          <div>
            <div className="text-2xl font-mono-tabular font-bold text-slate-900">
              {weakCount} <span className="text-xs font-urdu-ui font-normal text-slate-500">موضوعات</span>
            </div>
            <p className="font-urdu-ui text-xs text-slate-600 mt-1">
              {weakCount === 0
                ? 'اس وقت کوئی کمزور موضوع درج نہیں — مشقیں جاری رکھیں!'
                : 'غلط جوابات اور منتخب اصطلاحات یہاں دہرائی کے لیے محفوظ ہیں۔'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPracticeArea('revision')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-950 text-xs font-urdu-ui font-semibold hover:bg-amber-100 cursor-pointer w-full"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ریویژن سینٹر کھولیں
          </button>
        </div>

        {/* My Learning Progress */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3">
          <div className="text-xs font-urdu-ui font-bold text-slate-700">میری تعلیمی پیش رفت</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-urdu-ui">
              <span className="text-slate-600">اسباق</span>
              <span className="font-mono-tabular font-semibold" dir="ltr">
                {progress.completedLessonIds.length}/{LESSONS.length}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-700 rounded-full transition-all"
                style={{ width: `${completedPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-urdu-ui pt-1">
              <span className="text-slate-600">بک مارکس / نوٹس</span>
              <span className="font-mono-tabular font-semibold" dir="ltr">
                {progress.bookmarks.length} / {progress.notes.length}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('library')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-urdu-ui font-semibold hover:border-emerald-300 hover:bg-emerald-50/40 cursor-pointer w-full"
          >
            لائبریری و نوٹس دیکھیں
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      {progress.recentActivities.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-urdu-ui text-sm font-bold text-slate-800">حالیہ تعلیمی سرگرمیاں</h3>
          <div className="divide-y divide-slate-100">
            {progress.recentActivities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="py-2 flex items-center justify-between gap-4 text-xs font-urdu-ui text-slate-600"
              >
                <span>{act.labelUr}</span>
                <span className="text-[11px] font-mono-tabular text-slate-400" dir="ltr">
                  {new Date(act.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
