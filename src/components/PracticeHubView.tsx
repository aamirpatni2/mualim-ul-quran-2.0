import { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FlipHorizontal,
  GitMerge,
  RefreshCw,
  RotateCcw,
  Timer,
  Volume2,
  XCircle,
} from 'lucide-react';
import { findGrammarTermByText } from '../data/glossaryData';
import { VOCABULARY_ITEMS } from '../data/vocabularyData';
import {
  ExamAttemptRecord,
  GrammarTerm,
  LanguageMode,
  LearningMode,
  UserProgress,
  VocabSrsStage,
} from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { GardaanExplorer } from './GardaanExplorer';
import { TarkeebStudio } from './TarkeebStudio';

export type PracticeAreaId = 'vocab' | 'gardaan' | 'tarkib' | 'exam' | 'revision';

interface PracticeHubViewProps {
  languageMode: LanguageMode;
  learningMode: LearningMode;
  progress: UserProgress;
  activeArea: PracticeAreaId;
  onChangeArea: (area: PracticeAreaId) => void;
  onUpdateVocabSrs: (vocabId: string, stage: VocabSrsStage) => void;
  onRecordExamAttempt: (record: ExamAttemptRecord, missedTopics: string[]) => void;
  onResolveWeakTopic: (id: string) => void;
  onSelectGrammarTerm: (term: GrammarTerm) => void;
}

interface ExamQuestion {
  id: string;
  topicUr: string;
  termHint?: string;
  promptUr: string;
  arabicPrompt: string;
  options: { id: string; labelUr: string }[];
  correctId: string;
  explanationUr: string;
}

const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'ex-1',
    topicUr: 'مبتدا اور خبر کی پہچان',
    termHint: 'مبتدا',
    promptUr: 'آیت "اَللّٰهُ الصَّمَدُ" میں لفظ "الصَّمَدُ" کی نحوی ترکیب کیا ہے؟',
    arabicPrompt: 'اَللّٰهُ الصَّمَدُ',
    options: [
      { id: 'a', labelUr: 'خبرِ مبتدا (مرفوع)' },
      { id: 'b', labelUr: 'مفعول بہ (منصوب)' },
      { id: 'c', labelUr: 'مضاف الیہ (مجرور)' },
    ],
    correctId: 'a',
    explanationUr: 'اَللّٰهُ مبتدا ہے اور الصَّمَدُ اس کی خبر مرفوع ہے۔',
  },
  {
    id: 'ex-2',
    topicUr: 'فعلِ مجہول اور نائب فاعل',
    termHint: 'نائب فاعل',
    promptUr: '"لَمْ يَلِدْ وَلَمْ يُوْلَدْ" میں "يُوْلَدْ" کی ضمیرِ مستتر کی نحوی حیثیت کیا ہے؟',
    arabicPrompt: 'وَلَمْ يُوْلَدْ',
    options: [
      { id: 'a', labelUr: 'فاعل' },
      { id: 'b', labelUr: 'نائب فاعل (کیونکہ فعل مجہول ہے)' },
      { id: 'c', labelUr: 'مفعول بہ' },
    ],
    correctId: 'b',
    explanationUr: 'يُوْلَدْ مضارع مجہول مجزوم ہے؛ فعل مجہول کے بعد ہمیشہ نائب فاعل ہوتا ہے۔',
  },
  {
    id: 'ex-3',
    topicUr: 'اسمِ إِنَّ کا اعراب',
    termHint: 'منصوب',
    promptUr: '"إِنَّ الْإِنْسَانَ لَفِيْ خُسْرٍ" میں "الْإِنْسَانَ" پر زبر کیوں آیا؟',
    arabicPrompt: 'إِنَّ الْإِنْسَانَ لَفِيْ خُسْرٍ',
    options: [
      { id: 'a', labelUr: 'اسمِ إِنَّ ہونے کے باعث منصوب ہے' },
      { id: 'b', labelUr: 'فاعل ہونے کے باعث' },
      { id: 'c', labelUr: 'حرفِ جر کی وجہ سے' },
    ],
    correctId: 'a',
    explanationUr: 'إِنَّ اپنے اسم کو نصب دیتا ہے اور خبر کو رفع۔',
  },
  {
    id: 'ex-4',
    topicUr: 'مضاف الیہ اور جمع مذکر سالم کا جر',
    termHint: 'مضاف الیہ',
    promptUr: '"رَبِّ الْعٰلَمِيْنَ" میں "الْعٰلَمِيْنَ" کس حالت میں ہے اور علامت کیا ہے؟',
    arabicPrompt: 'رَبِّ الْعٰلَمِيْنَ',
    options: [
      { id: 'a', labelUr: 'مجرور ہے (مضاف الیہ) اور علامت یاء (ـِيْنَ) ہے' },
      { id: 'b', labelUr: 'مرفوع ہے' },
      { id: 'c', labelUr: 'مجزوم ہے' },
    ],
    correctId: 'a',
    explanationUr: 'جمع مذکر سالم اور اس سے ملحق اسماء حالتِ جر میں "ـِيْنَ" کے ساتھ آتے ہیں۔',
  },
  {
    id: 'ex-5',
    topicUr: 'تقدیمِ مفعول اور قصر',
    termHint: 'مفعول بہ',
    promptUr: '"إِيَّاكَ نَعْبُدُ" میں "إِيَّاكَ" فعل سے پہلے کیوں لایا گیا؟',
    arabicPrompt: 'إِيَّاكَ نَعْبُدُ',
    options: [
      { id: 'a', labelUr: 'حصر و تخصیص ("صرف تیری ہی") پیدا کرنے کے لیے' },
      { id: 'b', labelUr: 'کیونکہ عربی میں مفعول ہمیشہ پہلے آتا ہے' },
      { id: 'c', labelUr: 'کیونکہ وہ مبتدا ہے' },
    ],
    correctId: 'a',
    explanationUr: 'تقدیمِ مفعول علمِ بلاغت میں اختصاص (صرف/ہی) کا مفہوم دیتا ہے۔',
  },
  {
    id: 'ex-6',
    topicUr: 'ترجمہ: سورۃ العصر',
    promptUr: '"وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ" کا درست اردو ترجمہ منتخب کریں:',
    arabicPrompt: 'وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    options: [
      { id: 'a', labelUr: 'اور انہوں نے آپس میں حق کی نصیحت کی اور آپس میں صبر کی نصیحت کی۔' },
      { id: 'b', labelUr: 'اور انہوں نے حق سے منہ موڑا۔' },
      { id: 'c', labelUr: 'اور ان سے صبر کے بارے میں پوچھا جائے گا۔' },
    ],
    correctId: 'a',
    explanationUr: 'تَوَاصَوْا بابِ تَفَاعُل سے ہے جس کا معنی باہمی (آپس میں ایک دوسرے کو) نصیحت کرنا ہے۔',
  },
];

export function PracticeHubView({
  languageMode,
  learningMode,
  progress,
  activeArea,
  onChangeArea,
  onUpdateVocabSrs,
  onRecordExamAttempt,
  onResolveWeakTopic,
  onSelectGrammarTerm,
}: PracticeHubViewProps) {
  // Vocab practice state
  const [sessionCount, setSessionCount] = useState<number>(10);
  const [customCountInput, setCustomCountInput] = useState('12');
  const [direction, setDirection] = useState<'ar_to_ur' | 'ur_to_ar'>('ar_to_ur');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Exam state
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  const deck = VOCABULARY_ITEMS.slice(0, Math.min(sessionCount, VOCABULARY_ITEMS.length));
  const currentCard = deck[cardIdx % deck.length];
  const currentSrs: VocabSrsStage = progress.vocabSrs[currentCard.id]?.stage ?? 'new';

  const areas: { id: PracticeAreaId; labelUr: string; icon: typeof FlipHorizontal }[] = [
    { id: 'vocab', labelUr: 'الفاظ فلیش کارڈز و دہرائی', icon: FlipHorizontal },
    { id: 'gardaan', labelUr: 'گردان مشق', icon: RefreshCw },
    { id: 'tarkib', labelUr: 'ترکیبِ نحوی پریکٹس', icon: GitMerge },
    { id: 'exam', labelUr: 'امتحانی پرچہ (Exam)', icon: ClipboardCheck },
    { id: 'revision', labelUr: `کمزور نکات (${progress.weakTopics.length})`, icon: AlertCircle },
  ];

  const handleSubmitExam = () => {
    setExamSubmitted(true);
    let correct = 0;
    const missed: string[] = [];
    for (const q of EXAM_QUESTIONS) {
      if (examAnswers[q.id] === q.correctId) {
        correct++;
      } else {
        missed.push(q.topicUr);
      }
    }
    const scorePct = Math.round((correct / EXAM_QUESTIONS.length) * 100);
    onRecordExamAttempt(
      {
        id: `exam-${Date.now()}`,
        titleUr: 'ترکیب، صرف و نحو جامع امتحان',
        scorePct,
        totalQuestions: EXAM_QUESTIONS.length,
        correctAnswers: correct,
        completedAt: new Date().toISOString(),
      },
      missed
    );
  };

  const srsLabel: Record<VocabSrsStage, string> = {
    new: 'نیا (New)',
    learning: 'زیرِ مطالعہ (Learning)',
    needs_revision: 'دہرائی مطلوب (Needs Revision)',
    mastered: 'یاد ہو گیا (Mastered)',
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Practice Sub-nav */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
              مشق و امتحان سینٹر (Practice & Exams)
            </h1>
            <p className="font-urdu-ui text-sm text-slate-600">
              الفاظ کی گردان، صرف و نحو، ترکیبِ آیات اور امتحانی پرچوں کے ذریعے اپنی مہارت پختہ کریں۔
            </p>
          </div>
          {learningMode === 'exam' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-amber-300 text-xs font-urdu-ui">
              <Timer className="w-3.5 h-3.5" /> امتحانی موڈ فعال ہے
            </span>
          )}
        </div>

        <div className="flex flex-nowrap sm:flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {areas.map((a) => {
            const Icon = a.icon;
            const active = activeArea === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onChangeArea(a.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-emerald-800 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {a.labelUr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area 1: Configurable Vocabulary Flashcards & SRS */}
      {activeArea === 'vocab' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-urdu-ui font-bold text-slate-700">الفاظ کی تعداد:</span>
              {[5, 10, 20].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setSessionCount(n);
                    setCardIdx(0);
                    setFlipped(false);
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono-tabular cursor-pointer ${
                    sessionCount === n
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {n}
                </button>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={VOCABULARY_ITEMS.length}
                  value={customCountInput}
                  onChange={(e) => {
                    setCustomCountInput(e.target.value);
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= VOCABULARY_ITEMS.length) {
                      setSessionCount(val);
                      setCardIdx(0);
                    }
                  }}
                  className="w-14 px-2 py-1 rounded-lg border border-slate-200 text-xs font-mono-tabular text-center"
                />
                <span className="text-xs font-urdu-ui text-slate-500">حسبِ منشا</span>
              </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-urdu-ui">
              <button
                type="button"
                onClick={() => {
                  setDirection('ar_to_ur');
                  setFlipped(false);
                }}
                className={`px-3 py-1 rounded cursor-pointer ${
                  direction === 'ar_to_ur' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600'
                }`}
              >
                عربی ← اردو
              </button>
              <button
                type="button"
                onClick={() => {
                  setDirection('ur_to_ar');
                  setFlipped(false);
                }}
                className={`px-3 py-1 rounded cursor-pointer ${
                  direction === 'ur_to_ar' ? 'bg-white text-emerald-800 font-bold shadow-sm' : 'text-slate-600'
                }`}
              >
                اردو ← عربی
              </button>
            </div>
          </div>

          {/* Flashcard */}
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between text-xs font-urdu-ui text-slate-500">
              <span>
                کارڈ {(cardIdx % deck.length) + 1} از {deck.length}
              </span>
              <span className="font-semibold text-emerald-800">حالت: {srsLabel[currentSrs]}</span>
            </div>

            <div
              onClick={() => setFlipped((v) => !v)}
              className="min-h-[240px] p-6 sm:p-8 rounded-2xl border-2 border-slate-200 bg-[#FAFBF9] hover:border-emerald-400 transition-colors flex flex-col items-center justify-center text-center gap-4 cursor-pointer"
            >
              {!flipped ? (
                direction === 'ar_to_ur' ? (
                  <>
                    <div className="font-arabic text-5xl text-slate-900">{currentCard.arabic}</div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakArabic(currentCard.arabic);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui text-slate-700 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> تلفظ سنیں
                    </button>
                    <p className="text-xs font-urdu-ui text-slate-400">
                      معنی دیکھنے کے لیے کارڈ پر کلک کریں
                    </p>
                  </>
                ) : (
                  <>
                    <div className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
                      {currentCard.meaningUr}
                    </div>
                    <p className="text-xs font-urdu-ui text-slate-400">
                      عربی لفظ دیکھنے کے لیے کارڈ پر کلک کریں
                    </p>
                  </>
                )
              ) : (
                <div className="space-y-3 w-full">
                  <div className="font-arabic text-4xl text-emerald-900">{currentCard.arabic}</div>
                  <div className="font-urdu text-xl font-bold text-slate-900">
                    {currentCard.meaningUr}
                  </div>
                  {currentCard.root && (
                    <div className="text-xs font-urdu-ui text-slate-600">
                      مادہ: <span className="font-arabic text-base">{currentCard.root}</span> ·{' '}
                      {currentCard.tenseOrFormUr ?? currentCard.type}
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-urdu-ui text-slate-700">
                    <div className="font-arabic text-lg text-slate-900 mb-1">
                      {currentCard.quranExampleAr}
                    </div>
                    {currentCard.quranExampleUr}
                  </div>
                </div>
              )}
            </div>

            {/* SRS Feedback Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateVocabSrs(currentCard.id, 'needs_revision');
                  setFlipped(false);
                  setCardIdx((i) => (i + 1) % deck.length);
                }}
                className="py-2.5 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-urdu-ui font-semibold hover:bg-amber-100 cursor-pointer"
              >
                دوبارہ دہرانا ہے
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateVocabSrs(currentCard.id, 'learning');
                  setFlipped(false);
                  setCardIdx((i) => (i + 1) % deck.length);
                }}
                className="py-2.5 rounded-xl border border-sky-300 bg-sky-50 text-sky-900 text-xs font-urdu-ui font-semibold hover:bg-sky-100 cursor-pointer"
              >
                سمجھ آ رہا ہے
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateVocabSrs(currentCard.id, 'mastered');
                  setFlipped(false);
                  setCardIdx((i) => (i + 1) % deck.length);
                }}
                className="py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                مکمل یاد ہو گیا ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Area 2: Gardaan Practice */}
      {activeArea === 'gardaan' && <GardaanExplorer languageMode={languageMode} />}

      {/* Area 3: Tarkib Practice */}
      {activeArea === 'tarkib' && <TarkeebStudio languageMode={languageMode} />}

      {/* Area 4: Deferred-Feedback Examination Mode */}
      {activeArea === 'exam' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-urdu text-2xl font-bold text-slate-900">
                جامع امتحانی پرچہ (ترکیب، صرف، نحو و ترجمہ)
              </h2>
              <p className="font-urdu-ui text-xs text-slate-600">
                امتحانی اصول: تمام سوالات مکمل کر کے "پرچہ جمع کرائیں" دبائیں؛ نتائج اور اصلاح آخر میں ظاہر ہوں گے۔
              </p>
            </div>
            {examSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setExamAnswers({});
                  setExamSubmitted(false);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-urdu-ui font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> نیا امتحان دیں
              </button>
            )}
          </div>

          <div className="space-y-5">
            {EXAM_QUESTIONS.map((q, idx) => {
              const chosen = examAnswers[q.id];
              const isCorrect = chosen === q.correctId;
              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-urdu-ui text-slate-500">
                    <span>
                      سوال {idx + 1} از {EXAM_QUESTIONS.length} · {q.topicUr}
                    </span>
                    {examSubmitted &&
                      (isCorrect ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> درست
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> غلط
                        </span>
                      ))}
                  </div>
                  <p className="font-urdu-ui text-sm font-bold text-slate-900">{q.promptUr}</p>
                  <div className="font-arabic text-2xl text-slate-900 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 inline-block">
                    {q.arabicPrompt}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = chosen === opt.id;
                      const right = opt.id === q.correctId;
                      let cls = 'border-slate-200 bg-white hover:border-emerald-300';
                      if (examSubmitted) {
                        if (right) cls = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                        else if (selected) cls = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else if (selected) {
                        cls = 'border-emerald-700 bg-emerald-50/70 font-semibold';
                      }
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={examSubmitted}
                          onClick={() => setExamAnswers((p) => ({ ...p, [q.id]: opt.id }))}
                          className={`w-full text-right px-3.5 py-2.5 rounded-lg border text-sm font-urdu-ui cursor-pointer ${cls}`}
                        >
                          {opt.labelUr}
                        </button>
                      );
                    })}
                  </div>
                  {examSubmitted && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-urdu-ui text-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <span>{q.explanationUr}</span>
                      {q.termHint && (
                        <button
                          type="button"
                          onClick={() => {
                            const t = findGrammarTermByText(q.termHint!);
                            if (t) onSelectGrammarTerm(t);
                          }}
                          className="text-emerald-800 font-bold hover:underline cursor-pointer"
                        >
                          اصطلاح "{q.termHint}" دیکھیں
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!examSubmitted && (
            <div className="flex justify-end">
              <button
                type="button"
                disabled={Object.keys(examAnswers).length < EXAM_QUESTIONS.length}
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-urdu-ui font-bold disabled:opacity-40 hover:bg-emerald-800 cursor-pointer"
              >
                امتحانی پرچہ جمع کرائیں ({Object.keys(examAnswers).length}/{EXAM_QUESTIONS.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Area 5: Weak-Topic Revision Center */}
      {activeArea === 'revision' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="font-urdu text-2xl font-bold text-slate-900">
              کمزور موضوعات اور دہرائی سینٹر (Revision Center)
            </h2>
            <p className="font-urdu-ui text-xs text-slate-600">
              کوئز، امتحان یا اصطلاحاتِ نحو سے شامل کیے گئے مشکل موضوعات یہاں جمع ہوتے ہیں۔
            </p>
          </div>

          {progress.weakTopics.length === 0 ? (
            <div className="p-8 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
              <BookOpen className="w-6 h-6 text-emerald-700 mx-auto" />
              <div className="font-urdu-ui text-sm font-bold text-slate-800">
                دہرائی فہرست اس وقت خالی ہے
              </div>
              <p className="font-urdu-ui text-xs text-slate-500">
                اگر کسی امتحان میں کوئی سوال غلط ہو یا آپ کسی اصطلاح کو "دہرائی میں شامل کریں" دبائیں تو وہ یہاں خودکار طریقے سے محفوظ ہو جائے گی۔
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {progress.weakTopics.map((wt) => {
                const matchedTerm = wt.termId ? findGrammarTermByText(wt.termId) : undefined;
                return (
                  <div
                    key={wt.id}
                    className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50"
                  >
                    <div className="space-y-0.5">
                      <div className="font-urdu-ui text-sm font-bold text-slate-900">
                        {wt.titleUr}
                      </div>
                      <div className="text-xs font-urdu-ui text-slate-500">
                        دہرائی کی ضرورت ({wt.missedCount} بار)
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {matchedTerm && (
                        <button
                          type="button"
                          onClick={() => onSelectGrammarTerm(matchedTerm)}
                          className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-urdu-ui font-semibold cursor-pointer"
                        >
                          قاعدہ پڑھیں
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onResolveWeakTopic(wt.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-urdu-ui hover:bg-emerald-800 cursor-pointer"
                      >
                        مکمل دہرالیا ✓
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
