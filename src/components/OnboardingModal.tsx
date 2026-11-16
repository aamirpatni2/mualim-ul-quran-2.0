import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, GraduationCap, Target } from 'lucide-react';
import {
  LearningMode,
  OnboardingProfile,
  StudentGoalId,
  StudentLevelId,
} from '../types/quranic';

interface OnboardingModalProps {
  isOpen: boolean;
  initialProfile: OnboardingProfile;
  onComplete: (profile: OnboardingProfile, suggestedMode: LearningMode) => void;
  onSkip: () => void;
}

const LEVEL_OPTIONS: {
  id: StudentLevelId;
  labelUr: string;
  labelEn: string;
  recommendedLessonId: string;
  suggestedMode: LearningMode;
}[] = [
  {
    id: 'absolute_beginner',
    labelUr: 'بالکل ابتدائی (عربی حروف و حرکات سے آغاز)',
    labelEn: 'Absolute Beginner',
    recommendedLessonId: 'lesson-1',
    suggestedMode: 'guided',
  },
  {
    id: 'can_read',
    labelUr: 'قرآن پڑھ لیتا ہوں مگر معنی نہیں سمجھتا',
    labelEn: 'Can read Arabic, cannot understand',
    recommendedLessonId: 'lesson-2',
    suggestedMode: 'guided',
  },
  {
    id: 'basic_arabic',
    labelUr: 'بنیادی عربی الفاظ و جملے جانتا ہوں',
    labelEn: 'Basic Arabic',
    recommendedLessonId: 'lesson-4',
    suggestedMode: 'guided',
  },
  {
    id: 'basic_sarf',
    labelUr: 'بنیادی علمِ صرف (مادہ و فعل) جانتا ہوں',
    labelEn: 'Know basic Sarf',
    recommendedLessonId: 'lesson-gardaan',
    suggestedMode: 'detailed',
  },
  {
    id: 'basic_nahw',
    labelUr: 'بنیادی علمِ نحو (مبتدا، خبر، فاعل) جانتا ہوں',
    labelEn: 'Know basic Nahw',
    recommendedLessonId: 'lesson-tarkeeb',
    suggestedMode: 'detailed',
  },
  {
    id: 'dars_e_nizami',
    labelUr: 'درسِ نظامی کا طالب علم ہوں',
    labelEn: 'Dars-e-Nizami student',
    recommendedLessonId: 'lesson-tarkeeb',
    suggestedMode: 'detailed',
  },
  {
    id: 'advanced',
    labelUr: 'اعلیٰ عربی، بلاغت اور گہری ترکیب کا طالب علم',
    labelEn: 'Advanced Arabic student',
    recommendedLessonId: 'lesson-15',
    suggestedMode: 'detailed',
  },
];

const GOAL_OPTIONS: { id: StudentGoalId; labelUr: string }[] = [
  { id: 'understand_quran', labelUr: 'قرآنِ مجید کو براہِ راست سمجھنا' },
  { id: 'learn_grammar', labelUr: 'عربی گرامر (قواعد) سیکھنا' },
  { id: 'master_sarf_nahw', labelUr: 'علمِ صرف اور علمِ نحو میں مہارت' },
  { id: 'perform_tarkib', labelUr: 'قرآنی آیات کی ترکیبِ نحوی کرنا' },
  { id: 'dars_e_nizami_subjects', labelUr: 'درسِ نظامی کے عربی مضامین کی تکمیل' },
  { id: 'all', labelUr: 'مندرجہ بالا تمام مقاصد' },
];

const TIME_OPTIONS: { minutes: 15 | 30 | 45 | 60 | 90; labelUr: string; wordTarget: 5 | 10 | 20 }[] = [
  { minutes: 15, labelUr: '١٥ منٹ روزانہ', wordTarget: 5 },
  { minutes: 30, labelUr: '٣٠ منٹ روزانہ', wordTarget: 10 },
  { minutes: 45, labelUr: '٤٥ منٹ روزانہ', wordTarget: 10 },
  { minutes: 60, labelUr: '٦٠ منٹ روزانہ', wordTarget: 20 },
  { minutes: 90, labelUr: '٦٠ منٹ سے زیادہ', wordTarget: 20 },
];

export function OnboardingModal({
  isOpen,
  initialProfile,
  onComplete,
  onSkip,
}: OnboardingModalProps) {
  const [level, setLevel] = useState<StudentLevelId>(initialProfile.level);
  const [goal, setGoal] = useState<StudentGoalId>(initialProfile.goal);
  const [dailyMinutes, setDailyMinutes] = useState<15 | 30 | 45 | 60 | 90>(
    initialProfile.dailyMinutes
  );

  if (!isOpen) return null;

  const handleSave = () => {
    const levelMeta = LEVEL_OPTIONS.find((l) => l.id === level) ?? LEVEL_OPTIONS[0];
    const timeMeta = TIME_OPTIONS.find((t) => t.minutes === dailyMinutes) ?? TIME_OPTIONS[1];

    // Never place a beginner directly into advanced Tarkib regardless of goal
    const isBeginner =
      level === 'absolute_beginner' || level === 'can_read' || level === 'basic_arabic';
    let recommendedLessonId = levelMeta.recommendedLessonId;
    if (!isBeginner && goal === 'perform_tarkib') {
      recommendedLessonId = 'lesson-tarkeeb';
    }

    onComplete(
      {
        completed: true,
        skipped: false,
        level,
        goal,
        dailyMinutes,
        dailyWordTarget: timeMeta.wordTarget,
        recommendedLessonId,
      },
      levelMeta.suggestedMode
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        dir="rtl"
        className="bg-white w-full max-w-2xl max-h-[92dvh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-urdu text-2xl font-bold">المعلّم ٢.٠ میں خوش آمدید</h2>
            <p className="font-urdu-ui text-xs text-slate-300">
              تین مختصر سوالات کے جواب دیں تاکہ آپ کے لیے موزوں تعلیمی نصاب اور روزانہ کا ہدف مقرر کیا جا سکے۔
            </p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-urdu-ui text-slate-300 hover:text-white underline cursor-pointer shrink-0"
          >
            ابھی چھوڑیں (Skip)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question A: Level */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-urdu-ui font-bold text-slate-900">
              <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
              ١. اس وقت عربی زبان میں آپ کی سطح کیا ہے؟
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LEVEL_OPTIONS.map((opt) => {
                const active = level === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLevel(opt.id)}
                    className={`p-3 rounded-xl border text-right transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-urdu-ui text-xs sm:text-sm">{opt.labelUr}</div>
                      <div className="text-[11px] text-slate-500 font-sans" dir="ltr">
                        {opt.labelEn}
                      </div>
                    </div>
                    {active && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Question B: Primary Goal */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-urdu-ui font-bold text-slate-900">
              <Target className="w-4 h-4 text-emerald-700 shrink-0" />
              ٢. آپ کا بنیادی تعلیمی مقصد کیا ہے؟
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {GOAL_OPTIONS.map((opt) => {
                const active = goal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setGoal(opt.id)}
                    className={`p-3 rounded-xl border text-right font-urdu-ui text-xs sm:text-sm cursor-pointer transition-colors ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt.labelUr}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Question C: Daily Time */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-urdu-ui font-bold text-slate-900">
              <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
              ٣. آپ روزانہ کتنا وقت مطالعہ کر سکتے ہیں؟
            </div>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((opt) => {
                const active = dailyMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    type="button"
                    onClick={() => setDailyMinutes(opt.minutes)}
                    className={`px-3.5 py-2 rounded-xl border font-urdu-ui text-xs sm:text-sm cursor-pointer transition-colors ${
                      active
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt.labelUr}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="px-4 sm:px-6 py-3.5 sm:py-4 pb-[max(0.875rem,env(safe-area-inset-bottom))] border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <span className="font-urdu-ui text-xs text-slate-500">
            آپ بعد میں کسی بھی وقت اپنا تعلیمی پروفائل تبدیل کر سکتے ہیں۔
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
          >
            اپنا تعلیمی راستہ بنائیں
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
