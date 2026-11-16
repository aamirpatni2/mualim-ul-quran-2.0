import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  BookOpen,
  CheckCircle2,
  NotebookPen,
  Sparkles,
  Volume2,
  X,
  XCircle,
} from 'lucide-react';
import { findGrammarTermByText } from '../data/glossaryData';
import { GrammarTerm, LearningMode } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { VerificationBadge } from './VerificationBadge';

interface GrammarTermModalProps {
  term: GrammarTerm | null;
  learningMode: LearningMode;
  isBookmarked: boolean;
  existingNote: string;
  onClose: () => void;
  onSelectRelatedTerm: (term: GrammarTerm) => void;
  onToggleBookmark: (term: GrammarTerm) => void;
  onSaveNote: (term: GrammarTerm, note: string) => void;
  onAddRevision: (term: GrammarTerm) => void;
  onAskAiTutor: (term: GrammarTerm) => void;
}

export function GrammarTermModal({
  term,
  learningMode,
  isBookmarked,
  existingNote,
  onClose,
  onSelectRelatedTerm,
  onToggleBookmark,
  onSaveNote,
  onAddRevision,
  onAskAiTutor,
}: GrammarTermModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checkedPractice, setCheckedPractice] = useState(false);
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [noteDraft, setNoteDraft] = useState(existingNote);
  const [revisionAdded, setRevisionAdded] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setCheckedPractice(false);
    setShowNoteBox(false);
    setNoteDraft(existingNote);
    setRevisionAdded(false);
  }, [term?.id, existingNote]);

  if (!term) return null;

  const isCorrect = selectedOption === term.practice.correctId;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grammar-term-title"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        className="bg-white w-full sm:max-w-3xl max-h-[90dvh] rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden pb-safe"
      >
        <div className="sm:hidden pt-2 pb-1 bg-slate-50/90 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-slate-300" />
        </div>
        {/* Sticky Modal Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-slate-200 bg-slate-50/90 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={term.verificationStatus} compact />
              <span className="text-xs text-slate-500 font-mono" dir="ltr">
                {term.termEn}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 id="grammar-term-title" className="font-urdu text-2xl font-bold text-slate-900">
                {term.termUr}
              </h2>
              <span className="font-arabic text-2xl text-emerald-800">{term.termAr}</span>
              <button
                type="button"
                onClick={() => speakArabic(term.termAr)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-800 hover:border-emerald-300 cursor-pointer"
                aria-label="عربی تلفظ سنیں"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 cursor-pointer shrink-0"
            aria-label="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleBookmark(term)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-urdu-ui cursor-pointer transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {isBookmarked ? 'محفوظ شدہ (Bookmarked)' : 'بک مارک کریں'}
          </button>

          <button
            type="button"
            onClick={() => {
              onAddRevision(term);
              setRevisionAdded(true);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-urdu-ui cursor-pointer transition-colors ${
              revisionAdded
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {revisionAdded ? 'دہرائی فہرست میں شامل' : 'دہرائی میں شامل کریں'}
          </button>

          <button
            type="button"
            onClick={() => setShowNoteBox((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui text-slate-700 hover:border-slate-300 cursor-pointer"
          >
            <NotebookPen className="w-3.5 h-3.5" />
            ذاتی نوٹ
          </button>

          <button
            type="button"
            onClick={() => onAskAiTutor(term)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-urdu-ui hover:bg-emerald-800 cursor-pointer mr-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            استادِ معلم سے مزید سمجھیں
          </button>
        </div>

        {/* Optional Personal Note Editor */}
        {showNoteBox && (
          <div className="px-5 py-3 bg-amber-50/50 border-b border-amber-200 space-y-2">
            <label className="block text-xs font-urdu-ui font-semibold text-amber-950">
              اس اصطلاح کے متعلق اپنا ذاتی نوٹ لکھیں:
            </label>
            <textarea
              rows={2}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="اپنی یاددہانی یا کلاس کا نوٹ یہاں محفوظ کریں..."
              className="w-full p-2.5 rounded-lg border border-amber-200 bg-white text-sm font-urdu-ui focus:outline-none focus:border-emerald-600"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteBox(false)}
                className="px-3 py-1 text-xs font-urdu-ui text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                منسوخ
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveNote(term, noteDraft);
                  setShowNoteBox(false);
                }}
                className="px-3.5 py-1 rounded-md bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                نوٹ محفوظ کریں
              </button>
            </div>
          </div>
        )}

        {/* 11-Section Educational Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1 & 2: Simple Urdu Definition */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <div className="text-xs font-urdu-ui font-bold text-emerald-900">
              ١. آسان اردو تعریف
            </div>
            <p className="font-urdu text-base text-slate-900 leading-[2.15]">
              {term.simpleUrduDef}
            </p>
          </div>

          {/* 3: Arabic Definition (always shown in Detailed, expandable or clean in Guided) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-urdu-ui font-bold text-slate-700">
                ٢. عربی کلاسیکی تعریف ({learningMode === 'guided' ? 'بنیادی مطالعہ' : 'درسِ نظامی حوالہ'})
              </span>
              <button
                type="button"
                onClick={() => speakArabic(term.arabicDef)}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-urdu-ui"
              >
                <Volume2 className="w-3.5 h-3.5" /> سنیں
              </button>
            </div>
            <p className="font-arabic text-xl text-slate-900 leading-[2.1]">{term.arabicDef}</p>
          </div>

          {/* 4 & 5: Grammatical Rule & Signs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="text-xs font-urdu-ui font-bold text-slate-700">٣. بنیادی قاعدہ و حکم</div>
              <p className="font-urdu-ui text-sm text-slate-800 leading-relaxed">
                {term.grammaticalRuleUr}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="text-xs font-urdu-ui font-bold text-slate-700">٤. پہچان کی علامات</div>
              <p className="font-urdu-ui text-sm text-slate-800 leading-relaxed">{term.signsUr}</p>
            </div>
          </div>

          {/* 6: Classifications */}
          <div className="space-y-2">
            <div className="text-xs font-urdu-ui font-bold text-slate-700">٥. اہم اقسام و صورتیں</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {term.classificationsUr.map((cls, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
                  <div className="font-urdu-ui text-sm font-bold text-slate-900">{cls.title}</div>
                  <p className="font-urdu-ui text-xs text-slate-600 leading-relaxed">{cls.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7 & 8: Quranic Example + Full Tarkib */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-urdu-ui font-bold text-emerald-900">
                ٦. قرآنی مثال اور مکمل ترکیب
              </span>
              <span className="text-xs font-urdu-ui text-slate-500">{term.quranExampleRef}</span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="font-arabic text-2xl text-slate-900">{term.quranExampleAr}</p>
              <button
                type="button"
                onClick={() => speakArabic(term.quranExampleAr)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-800 cursor-pointer shrink-0"
                aria-label="مثال سنیں"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="font-urdu text-sm text-slate-700">ترجمہ: {term.quranExampleUr}</p>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="text-xs font-urdu-ui font-semibold text-slate-600">ترکیبِ نحوی:</div>
              <pre className="font-urdu-ui text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {term.fullTarkibUr}
              </pre>
            </div>
          </div>

          {/* 9: Common Mistakes */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-urdu-ui font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              ٧. عام غلطی جس سے بچنا ضروری ہے
            </div>
            <p className="font-urdu-ui text-sm text-amber-950 leading-relaxed">
              {term.commonMistakesUr}
            </p>
          </div>

          {/* 10: Mini Practice */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="text-xs font-urdu-ui font-bold text-slate-800">٨. فوری مشق (Mini Practice)</div>
            <p className="font-urdu-ui text-sm font-medium text-slate-900">{term.practice.questionUr}</p>
            {term.practice.arabicPrompt && (
              <div className="font-arabic text-2xl text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200 inline-block">
                {term.practice.arabicPrompt}
              </div>
            )}
            <div className="space-y-2">
              {term.practice.options.map((opt) => {
                const chosen = selectedOption === opt.id;
                const isAnswer = opt.id === term.practice.correctId;
                let style = 'border-slate-200 bg-white hover:border-emerald-300';
                if (checkedPractice) {
                  if (isAnswer) style = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                  else if (chosen) style = 'border-rose-400 bg-rose-50 text-rose-950';
                } else if (chosen) {
                  style = 'border-emerald-600 bg-emerald-50/70';
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={checkedPractice}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-right px-3.5 py-2.5 rounded-lg border text-sm font-urdu-ui flex items-center justify-between gap-2 cursor-pointer transition-colors ${style}`}
                  >
                    <span>{opt.labelUr}</span>
                    {checkedPractice && isAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                    {checkedPractice && chosen && !isAnswer && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {!checkedPractice ? (
              <button
                type="button"
                disabled={!selectedOption}
                onClick={() => setCheckedPractice(true)}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-semibold disabled:opacity-40 hover:bg-emerald-800 cursor-pointer"
              >
                جواب چیک کریں
              </button>
            ) : (
              <div
                className={`p-3 rounded-lg text-xs font-urdu-ui leading-relaxed border ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <strong>{isCorrect ? 'ماشاءاللہ! درست جواب: ' : 'توجہ فرمائیں: '}</strong>
                {term.practice.explanationUr}
              </div>
            )}
          </div>

          {/* 11: Related Clickable Terms */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-xs font-urdu-ui font-bold text-slate-600">٩. متعلقہ اصطلاحات</div>
            <div className="flex flex-wrap gap-2">
              {term.relatedTerms.map((relText) => {
                const matched = findGrammarTermByText(relText);
                return matched ? (
                  <button
                    key={relText}
                    type="button"
                    onClick={() => onSelectRelatedTerm(matched)}
                    className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-900 text-xs font-urdu-ui font-semibold hover:bg-emerald-100 cursor-pointer"
                  >
                    {relText} ←
                  </button>
                ) : (
                  <span
                    key={relText}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-xs font-urdu-ui"
                  >
                    {relText}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
