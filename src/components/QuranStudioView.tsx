import { useEffect, useState } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileSpreadsheet,
  GitMerge,
  Maximize2,
  NotebookPen,
  Printer,
  Search,
  Sparkles,
  Type,
  Volume2,
  X,
} from 'lucide-react';
import { QURAN_STUDIO_SURAHS } from '../data/quranStudioData';
import {
  GrammarTerm,
  LanguageMode,
  LearningMode,
  StudioAyah,
  StudioSurah,
  StudioWordAnalysis,
  UserProgress,
} from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { AiTutorContext } from './AiTutorDrawer';
import { ClickableGrammarText } from './ClickableGrammarText';
import { VerificationBadge } from './VerificationBadge';
import { WordTypeLabel } from './WordTypeLabel';

interface QuranStudioViewProps {
  languageMode: LanguageMode;
  learningMode: LearningMode;
  progress: UserProgress;
  selectedSurahId: string;
  selectedAyahNumber: number;
  selectedWordId: string | null;
  onSelectLocation: (surahId: string, ayahNumber: number, wordId?: string | null) => void;
  onSelectGrammarTerm: (term: GrammarTerm) => void;
  onOpenAiTutor: (ctx: AiTutorContext) => void;
  onOpenRootInLibrary: (rootLetters: string) => void;
  onToggleBookmark: (item: {
    id: string;
    kind: 'word' | 'verse' | 'tarkib';
    titleUr: string;
    subtitleUr: string;
    arabic: string;
    surahId: string;
    ayahNumber: number;
    wordId?: string;
  }) => void;
  onSaveNote: (targetKey: string, targetTitle: string, targetType: 'word' | 'verse', content: string) => void;
  onMarkVerseAnalyzed: (surahId: string) => void;
}

type WordTab = 'meaning' | 'sarf' | 'nahw' | 'irab';

export function QuranStudioView({
  languageMode,
  learningMode,
  progress,
  selectedSurahId,
  selectedAyahNumber,
  selectedWordId,
  onSelectLocation,
  onSelectGrammarTerm,
  onOpenAiTutor,
  onOpenRootInLibrary,
  onToggleBookmark,
  onSaveNote,
  onMarkVerseAnalyzed,
}: QuranStudioViewProps) {
  const surah: StudioSurah =
    QURAN_STUDIO_SURAHS.find((s) => s.id === selectedSurahId) ?? QURAN_STUDIO_SURAHS[0];
  const ayah: StudioAyah =
    surah.ayahs.find((a) => a.number === selectedAyahNumber) ?? surah.ayahs[0];
  const activeWord: StudioWordAnalysis =
    ayah.words.find((w) => w.id === selectedWordId) ?? ayah.words[0];

  const [wordTab, setWordTab] = useState<WordTab>('meaning');
  const [mobileWordSheetOpen, setMobileWordSheetOpen] = useState(false);
  const [showFullTarkibModal, setShowFullTarkibModal] = useState(false);
  const [tarkibDetailLevel, setTarkibDetailLevel] = useState<'simple' | 'detailed'>(
    learningMode === 'guided' ? 'simple' : 'detailed'
  );
  const [hideTarkibExplanations, setHideTarkibExplanations] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [studioViewMode, setStudioViewMode] = useState<'reading' | 'grammar'>(
    learningMode === 'guided' ? 'reading' : 'grammar'
  );
  const [fontSizeStep, setFontSizeStep] = useState<0 | 1 | 2>(1);
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const verseNoteKey = `verse-${surah.id}-${ayah.number}`;
  const existingVerseNote =
    progress.notes.find((n) => n.targetKey === verseNoteKey)?.content ?? '';
  const [noteDraft, setNoteDraft] = useState(existingVerseNote);

  useEffect(() => {
    setNoteDraft(existingVerseNote);
    setShowNoteEditor(false);
  }, [verseNoteKey, existingVerseNote]);

  useEffect(() => {
    setTarkibDetailLevel(learningMode === 'guided' ? 'simple' : 'detailed');
  }, [learningMode]);

  const ayahIdx = surah.ayahs.findIndex((a) => a.number === ayah.number);
  const prevAyah = ayahIdx > 0 ? surah.ayahs[ayahIdx - 1] : null;
  const nextAyah = ayahIdx < surah.ayahs.length - 1 ? surah.ayahs[ayahIdx + 1] : null;

  const fontSizeClass =
    fontSizeStep === 0
      ? 'text-2xl sm:text-3xl'
      : fontSizeStep === 1
      ? 'text-3xl sm:text-4xl'
      : 'text-4xl sm:text-5xl';

  const isVerseBookmarked = progress.bookmarks.some(
    (b) => b.id === `bm-verse-${surah.id}-${ayah.number}`
  );
  const isWordBookmarked = progress.bookmarks.some((b) => b.id === `bm-word-${activeWord.id}`);

  const handleWordClick = (word: StudioWordAnalysis) => {
    onSelectLocation(surah.id, ayah.number, word.id);
    setMobileWordSheetOpen(true);
    onMarkVerseAnalyzed(surah.id);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Studio Top Control Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-urdu text-2xl font-bold text-slate-900">
                قرآن اسٹوڈیو (Quran Linguistic Studio)
              </h1>
              <VerificationBadge status={ayah.verificationStatus} compact />
            </div>
            <p className="font-urdu-ui text-xs text-slate-500">
              کسی بھی عربی لفظ پر کلک کریں — دائیں/نیچے ٤ ٹیبز میں معنی، صرف، نحو اور اعراب کھل جائے گا۔
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Simple Reading vs Detailed Grammar Mode */}
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1 text-xs font-urdu-ui">
              <button
                type="button"
                onClick={() => setStudioViewMode('reading')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  studioViewMode === 'reading'
                    ? 'bg-white text-emerald-800 font-bold shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                آسان مطالعہ
              </button>
              <button
                type="button"
                onClick={() => setStudioViewMode('grammar')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  studioViewMode === 'grammar'
                    ? 'bg-white text-emerald-800 font-bold shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                تفصیلی گرامر
              </button>
            </div>

            {/* Translation Toggle */}
            <button
              type="button"
              onClick={() => setShowTranslation((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui text-slate-700 hover:border-slate-300 cursor-pointer"
            >
              {showTranslation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              ترجمہ
            </button>

            {/* Font Size Control */}
            <button
              type="button"
              onClick={() => setFontSizeStep((s) => ((s + 1) % 3) as 0 | 1 | 2)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui text-slate-700 hover:border-slate-300 cursor-pointer"
              title="عربی خط کا سائز بدلیں"
            >
              <Type className="w-3.5 h-3.5" />
              خط
            </button>
          </div>
        </div>

        {/* Surah & Ayah Selectors + Prev/Next */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {QURAN_STUDIO_SURAHS.map((s) => {
              const active = s.id === surah.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectLocation(s.id, s.ayahs[0].number, s.ayahs[0].words[0].id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-urdu-ui font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {s.surahNumber}. {s.nameUr}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevAyah}
              onClick={() => prevAyah && onSelectLocation(surah.id, prevAyah.number, prevAyah.words[0].id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-urdu-ui text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" /> پچھلی آیت
            </button>
            <div className="flex items-center gap-1">
              {surah.ayahs.map((a) => (
                <button
                  key={a.number}
                  type="button"
                  onClick={() => onSelectLocation(surah.id, a.number, a.words[0].id)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono-tabular font-bold cursor-pointer ${
                    a.number === ayah.number
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {a.number}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!nextAyah}
              onClick={() => nextAyah && onSelectLocation(surah.id, nextAyah.number, nextAyah.words[0].id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-urdu-ui text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
            >
              اگلی آیت <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Split Workspace: Verse Canvas + Desktop 4-Tab Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Right Main Ayah Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5">
            {/* Verse Header & Productivity Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="text-xs font-urdu-ui font-bold text-emerald-800">
                {surah.nameUr} ({surah.surahNumber}:{ayah.number}) · {surah.revelationUr}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakArabic(ayah.arabicFull)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-urdu-ui text-slate-700 hover:border-emerald-300 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> تلاوت
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onToggleBookmark({
                      id: `bm-verse-${surah.id}-${ayah.number}`,
                      kind: 'verse',
                      titleUr: `${surah.nameUr} · آیت ${ayah.number}`,
                      subtitleUr: ayah.translationUr,
                      arabic: ayah.arabicFull,
                      surahId: surah.id,
                      ayahNumber: ayah.number,
                    })
                  }
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-urdu-ui cursor-pointer ${
                    isVerseBookmarked
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  {isVerseBookmarked ? 'محفوظ' : 'بک مارک'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoteEditor((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-urdu-ui text-slate-700 hover:border-slate-300 cursor-pointer"
                >
                  <NotebookPen className="w-3.5 h-3.5" /> نوٹ
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenAiTutor({
                      contextType: 'verse',
                      contextTitle: `${surah.nameUr} آیت ${ayah.number}`,
                      arabicText: ayah.arabicFull,
                      contextDetails: `${ayah.translationUr} | ${ayah.sentenceStructureUr}`,
                    })
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-urdu-ui hover:bg-emerald-800 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> استادِ معلم
                </button>
              </div>
            </div>

            {showNoteEditor && (
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
                <label className="block text-xs font-urdu-ui font-semibold text-amber-950">
                  اس آیت کے لیے ذاتی نوٹ:
                </label>
                <textarea
                  rows={2}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="تفسیر، ترکیب یا اپنا نکتہ یہاں محفوظ کریں..."
                  className="w-full p-2 rounded-lg border border-amber-200 bg-white text-sm font-urdu-ui focus:outline-none focus:border-emerald-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNoteEditor(false)}
                    className="px-3 py-1 text-xs font-urdu-ui text-slate-600 cursor-pointer"
                  >
                    بند کریں
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSaveNote(
                        verseNoteKey,
                        `${surah.nameUr} آیت ${ayah.number}`,
                        'verse',
                        noteDraft
                      );
                      setShowNoteEditor(false);
                    }}
                    className="px-3.5 py-1 rounded-md bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
                  >
                    محفوظ کریں
                  </button>
                </div>
              </div>
            )}

            {/* Clickable Arabic Words Canvas */}
            <div className="py-4 px-3 rounded-2xl bg-[#FAFBF9] border border-slate-200/80 flex flex-wrap items-center gap-3 sm:gap-4 leading-[2.4]">
              {ayah.words.map((w) => {
                const isSelected = w.id === activeWord.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleWordClick(w)}
                    className={`group px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 shadow-sm ring-1 ring-emerald-700/20'
                        : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <span className={`font-arabic text-slate-900 ${fontSizeClass}`}>
                      {w.arabic}
                    </span>
                    <span className="font-urdu-ui text-xs text-slate-600">
                      {w.meaningTab.wordUr}
                    </span>
                    {studioViewMode === 'grammar' && (
                      <span className="text-[10px] font-urdu-ui font-semibold text-emerald-800">
                        {w.nahwTab.nahwiRoleUr}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Translation & Sentence Overview */}
            {showTranslation && (
              <div className="space-y-2 pt-2">
                <p className="font-urdu text-lg sm:text-xl text-slate-900 leading-[2.1]">
                  {ayah.translationUr}
                </p>
                {languageMode === 'bilingual' && (
                  <p className="text-sm text-slate-600 font-sans" dir="ltr">
                    {ayah.translationEn}
                  </p>
                )}
              </div>
            )}

            {/* Prominent [ مکمل ترکیب دیکھیں ] Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-urdu-ui text-slate-600">
                <span className="font-bold text-slate-800">جملے کا ڈھانچہ: </span>
                <ClickableGrammarText
                  text={ayah.sentenceStructureUr}
                  onSelectTerm={onSelectGrammarTerm}
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowFullTarkibModal(true);
                  onMarkVerseAnalyzed(surah.id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-urdu-ui font-bold hover:bg-emerald-800 transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <GitMerge className="w-4 h-4" />
                مکمل ترکیب دیکھیں
              </button>
            </div>
          </div>

          {/* Inline Sentence Rules Preview */}
          {studioViewMode === 'grammar' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-urdu-ui text-sm font-bold text-slate-900">
                  آیت کے اہم صرفی و نحوی اصول
                </h3>
                <span className="text-[11px] font-urdu-ui text-slate-500">
                  حوالہ: {ayah.sourceReferenceUr}
                </span>
              </div>
              <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm font-urdu-ui text-slate-700">
                {ayah.relevantRulesUr.map((r, i) => (
                  <li key={i}>
                    <ClickableGrammarText text={r} onSelectTerm={onSelectGrammarTerm} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop 4-Tab Word Analysis Panel (5 cols) */}
        <aside className="hidden lg:block lg:col-span-5 bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-20">
          {renderWordAnalysisPanel()}
        </aside>
      </div>

      {/* Mobile Bottom Sheet for Word Analysis */}
      {mobileWordSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[1px] flex items-end"
          onClick={() => setMobileWordSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[88dvh] bg-white rounded-t-2xl overflow-y-auto shadow-2xl pb-safe"
          >
            <div className="sticky top-0 z-10 bg-white px-4 pt-2 pb-2.5 border-b border-slate-200 space-y-1.5">
              <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-urdu-ui font-bold text-slate-700">لفظ کا مکمل تجزیہ</span>
                <button
                  type="button"
                  onClick={() => setMobileWordSheetOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                  aria-label="بند کریں"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {renderWordAnalysisPanel()}
          </div>
        </div>
      )}

      {/* Full Complete Tarkib Modal [ مکمل ترکیب دیکھیں ] */}
      {showFullTarkibModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-5"
          onClick={() => setShowFullTarkibModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-5xl max-h-[94dvh] rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden pb-safe"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-urdu-ui text-emerald-300 font-semibold">
                    {surah.nameUr} · آیت {ayah.number}
                  </span>
                  <VerificationBadge status={ayah.verificationStatus} compact />
                </div>
                <h2 className="font-urdu text-xl sm:text-2xl font-bold">
                  مکمل ترکیبِ نحوی و صرفی تجزیہ
                </h2>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-urdu-ui hover:bg-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> پرنٹ / شیٹ
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullTarkibModal(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                  aria-label="بند کریں"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 no-print">
              <div className="flex items-center gap-2">
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg text-xs font-urdu-ui">
                  <button
                    type="button"
                    onClick={() => setTarkibDetailLevel('simple')}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      tarkibDetailLevel === 'simple'
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    آسان ترکیب
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarkibDetailLevel('detailed')}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      tarkibDetailLevel === 'detailed'
                        ? 'bg-emerald-700 text-white font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    تفصیلی درسِ نظامی ترکیب
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setHideTarkibExplanations((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui text-slate-700 hover:border-slate-300 cursor-pointer"
                >
                  {hideTarkibExplanations ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  {hideTarkibExplanations ? 'توضیحات دکھائیں' : 'خود آزمائش: توضیحات چھپائیں'}
                </button>
              </div>

              <span className="text-xs font-urdu-ui text-slate-500">
                ماخذ: {ayah.sourceReferenceUr}
              </span>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Ayah Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-center space-y-2">
                <div className="font-arabic text-3xl text-slate-900">{ayah.arabicFull}</div>
                <div className="font-urdu text-base text-slate-700">{ayah.translationUr}</div>
              </div>

              {/* Word-by-Word Tarkib Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-slate-100 text-xs font-urdu-ui font-bold text-slate-800">
                    <tr>
                      <th className="p-3 border-b border-slate-200">عربی لفظ</th>
                      <th className="p-3 border-b border-slate-200">لفظی معنی</th>
                      <th className="p-3 border-b border-slate-200">صرفی تجزیہ</th>
                      <th className="p-3 border-b border-slate-200">نحوی ترکیب</th>
                      <th className="p-3 border-b border-slate-200">اعراب</th>
                      {!hideTarkibExplanations && (
                        <th className="p-3 border-b border-slate-200">توضیح</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-urdu-ui">
                    {ayah.tarkibTable.map((row) => (
                      <tr key={row.wordId} className="hover:bg-emerald-50/30">
                        <td className="p-3 font-arabic text-xl font-bold text-slate-900 whitespace-nowrap">
                          {row.arabicWord}
                        </td>
                        <td className="p-3 text-slate-800 font-medium">{row.meaningUr}</td>
                        <td className="p-3 text-slate-700">
                          <ClickableGrammarText
                            text={row.sarfiSummaryUr}
                            onSelectTerm={onSelectGrammarTerm}
                          />
                        </td>
                        <td className="p-3 font-semibold text-emerald-900">
                          <ClickableGrammarText
                            text={row.nahwiSummaryUr}
                            onSelectTerm={onSelectGrammarTerm}
                          />
                        </td>
                        <td className="p-3 text-slate-700">
                          <ClickableGrammarText
                            text={row.irabSummaryUr}
                            onSelectTerm={onSelectGrammarTerm}
                          />
                        </td>
                        {!hideTarkibExplanations && (
                          <td className="p-3 text-slate-600">
                            <ClickableGrammarText
                              text={row.explanationUr}
                              onSelectTerm={onSelectGrammarTerm}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Complete Sarfi, Nahwi & Sentence Explanations */}
              {!hideTarkibExplanations && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="text-xs font-urdu-ui font-bold text-slate-800">
                      مجموعی صرفی خلاصہ
                    </div>
                    <p className="font-urdu-ui text-sm text-slate-700 leading-relaxed">
                      <ClickableGrammarText
                        text={ayah.completeSarfiExplanationUr}
                        onSelectTerm={onSelectGrammarTerm}
                      />
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="text-xs font-urdu-ui font-bold text-slate-800">
                      مجموعی نحوی ترکیب
                    </div>
                    <p className="font-urdu-ui text-sm text-slate-700 leading-relaxed">
                      <ClickableGrammarText
                        text={ayah.completeNahwiExplanationUr}
                        onSelectTerm={onSelectGrammarTerm}
                      />
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Rules & Alternative Interpretations */}
              {tarkibDetailLevel === 'detailed' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-white space-y-2">
                    <div className="text-xs font-urdu-ui font-bold text-emerald-900">
                      متعلقہ قواعدِ نحو و صرف
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm font-urdu-ui text-slate-700">
                      {ayah.relevantRulesUr.map((rule, i) => (
                        <li key={i}>
                          <ClickableGrammarText text={rule} onSelectTerm={onSelectGrammarTerm} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {ayah.alternativeInterpretations &&
                    ayah.alternativeInterpretations.length > 0 && (
                      <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-urdu-ui font-bold text-indigo-900">
                            متبادل مستند نحوی آراء (Alternative Recognized Analyses)
                          </span>
                          <VerificationBadge status="MULTIPLE RECOGNIZED ANALYSES" compact />
                        </div>
                        {ayah.alternativeInterpretations.map((alt, i) => (
                          <div key={i} className="space-y-1 pt-1">
                            <div className="font-urdu-ui text-sm font-bold text-slate-900">
                              {alt.titleUr}
                            </div>
                            <p className="font-urdu-ui text-xs sm:text-sm text-slate-700 leading-relaxed">
                              <ClickableGrammarText
                                text={alt.explanationUr}
                                onSelectTerm={onSelectGrammarTerm}
                              />
                            </p>
                            <div className="text-[11px] font-urdu-ui text-indigo-800">
                              حوالہ: {alt.sourceUr}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderWordAnalysisPanel() {
    const tabs: { id: WordTab; labelUr: string }[] = [
      { id: 'meaning', labelUr: '١. معنی' },
      { id: 'sarf', labelUr: '٢. صرف' },
      { id: 'nahw', labelUr: '٣. نحو' },
      { id: 'irab', labelUr: '٤. اعراب' },
    ];

    return (
      <div className="flex flex-col">
        {/* Selected Word Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <WordTypeLabel type={activeWord.type} />
                <VerificationBadge status={activeWord.verificationStatus} compact />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="font-arabic text-4xl text-slate-900">{activeWord.arabic}</span>
                <span className="text-xs font-mono text-slate-500" dir="ltr">
                  {activeWord.transliteration}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => speakArabic(activeWord.arabic)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-emerald-800 cursor-pointer"
                aria-label="لفظ سنیں"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onToggleBookmark({
                    id: `bm-word-${activeWord.id}`,
                    kind: 'word',
                    titleUr: `${activeWord.arabic} — ${activeWord.meaningTab.wordUr}`,
                    subtitleUr: `${surah.nameUr} (${surah.surahNumber}:${ayah.number}) · ${activeWord.nahwTab.nahwiRoleUr}`,
                    arabic: activeWord.arabic,
                    surahId: surah.id,
                    ayahNumber: ayah.number,
                    wordId: activeWord.id,
                  })
                }
                className={`p-2 rounded-lg border cursor-pointer ${
                  isWordBookmarked
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                aria-label="لفظ بک مارک کریں"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-slate-200/70 p-1 rounded-xl">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setWordTab(t.id)}
                className={`py-2 rounded-lg text-xs font-urdu-ui font-bold cursor-pointer transition-colors ${
                  wordTab === t.id
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.labelUr}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Tab Content */}
        <div className="p-5 space-y-4 text-sm font-urdu-ui">
          {wordTab === 'meaning' && (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500">لفظی معنی</div>
                <div className="font-urdu text-xl font-bold text-slate-900">
                  {activeWord.meaningTab.wordUr}
                </div>
                {languageMode === 'bilingual' && (
                  <div className="text-xs text-slate-500 font-sans" dir="ltr">
                    {activeWord.meaningTab.wordEn}
                  </div>
                )}
              </div>

              {(activeWord.meaningTab.root || activeWord.meaningTab.lemma) && (
                <div className="grid grid-cols-2 gap-2.5">
                  {activeWord.meaningTab.root && (
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                      <div className="text-[11px] text-emerald-800">سہ حرفی مادہ</div>
                      <div className="font-arabic text-xl font-bold text-emerald-950">
                        {activeWord.meaningTab.root}
                      </div>
                    </div>
                  )}
                  {activeWord.meaningTab.lemma && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] text-slate-500">اصل لفظ (Lemma)</div>
                      <div className="font-arabic text-xl font-bold text-slate-900">
                        {activeWord.meaningTab.lemma}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700">کلاسیکی لغتی معنی</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeWord.meaningTab.classicalMeaningUr}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700">آیت کے سیاق میں معنی</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {activeWord.meaningTab.contextualMeaningUr}
                </p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {activeWord.meaningTab.otherOccurrencesNoteUr}
              </p>
            </div>
          )}

          {wordTab === 'sarf' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500">کلمہ کی قسم</div>
                  <div className="font-bold text-slate-900">{activeWord.sarfTab.wordKindUr}</div>
                </div>
                {activeWord.sarfTab.root && (
                  <button
                    type="button"
                    onClick={() => onOpenRootInLibrary(activeWord.sarfTab.root!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 cursor-pointer"
                  >
                    <Search className="w-3 h-3" /> مادہ ایکسپلورر
                  </button>
                )}
              </div>

              {!activeWord.sarfTab.applicable && activeWord.sarfTab.nonSarfNoteUr ? (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {activeWord.sarfTab.nonSarfNoteUr}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {activeWord.sarfTab.root && (
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">مادہ</span>
                      <span className="font-arabic text-lg font-bold text-slate-900">
                        {activeWord.sarfTab.root}
                      </span>
                    </div>
                  )}
                  {activeWord.sarfTab.pattern && (
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">صرفی وزن</span>
                      <span className="font-arabic text-base font-bold text-slate-900">
                        {activeWord.sarfTab.pattern}
                      </span>
                    </div>
                  )}
                  {activeWord.sarfTab.bab && (
                    <div className="p-2.5 rounded-lg border border-slate-200 col-span-2">
                      <span className="text-slate-500 block">باب</span>
                      <span className="font-bold text-emerald-900">{activeWord.sarfTab.bab}</span>
                    </div>
                  )}
                  {activeWord.sarfTab.seeghahUr && (
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">صیغہ</span>
                      <span className="font-bold text-slate-900">{activeWord.sarfTab.seeghahUr}</span>
                    </div>
                  )}
                  {activeWord.sarfTab.tenseUr && (
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">زمانہ</span>
                      <span className="font-bold text-slate-900">{activeWord.sarfTab.tenseUr}</span>
                    </div>
                  )}
                  {activeWord.sarfTab.voiceUr && (
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">معروف / مجہول</span>
                      <span className="font-bold text-slate-900">{activeWord.sarfTab.voiceUr}</span>
                    </div>
                  )}
                  {activeWord.sarfTab.numberUr && (
                    <div className="p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">عدد و جنس</span>
                      <span className="font-bold text-slate-900">
                        {activeWord.sarfTab.numberUr} {activeWord.sarfTab.genderUr ?? ''}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeWord.sarfTab.relatedDerivatives &&
                activeWord.sarfTab.relatedDerivatives.length > 0 && (
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700">اسی مادے کے دیگر الفاظ</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeWord.sarfTab.relatedDerivatives.map((d, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-800"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {wordTab === 'nahw' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="text-[11px] text-emerald-800">نحوی حیثیت (اصطلاح پر کلک کریں)</div>
                <div className="font-urdu text-xl font-bold text-slate-900">
                  <ClickableGrammarText
                    text={activeWord.nahwTab.nahwiRoleUr}
                    onSelectTerm={onSelectGrammarTerm}
                  />
                </div>
                {languageMode === 'bilingual' && (
                  <div className="text-xs text-slate-600 font-sans" dir="ltr">
                    {activeWord.nahwTab.nahwiRoleEn}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700">جملے میں تعلق</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <ClickableGrammarText
                    text={activeWord.nahwTab.relationInSentenceUr}
                    onSelectTerm={onSelectGrammarTerm}
                  />
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700">عامل اور معمول</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <ClickableGrammarText
                    text={activeWord.nahwTab.aamilAndMamoolUr}
                    onSelectTerm={onSelectGrammarTerm}
                  />
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="text-xs font-bold text-slate-700">متعلقہ نحوی قاعدہ</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <ClickableGrammarText
                    text={activeWord.nahwTab.relevantRulesUr}
                    onSelectTerm={onSelectGrammarTerm}
                  />
                </p>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-bold">جڑے ہوئے الفاظ: </span>
                {activeWord.nahwTab.connectedWordsUr}
              </div>
            </div>
          )}

          {wordTab === 'irab' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <div className="text-[11px] text-emerald-800">اعرابی حالت</div>
                  <div className="font-bold text-base text-slate-900">
                    <ClickableGrammarText
                      text={activeWord.irabTab.stateUr}
                      onSelectTerm={onSelectGrammarTerm}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] text-slate-500">معرب / مبنی</div>
                  <div className="font-bold text-base text-slate-900">
                    {activeWord.irabTab.morabOrMabniUr} ({activeWord.irabTab.visibilityUr})
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700">اعراب کی علامت</div>
                <p className="text-xs sm:text-sm text-slate-800">{activeWord.irabTab.signUr}</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="text-xs font-bold text-slate-700">اعرابی سبب</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <ClickableGrammarText
                    text={activeWord.irabTab.reasonUr}
                    onSelectTerm={onSelectGrammarTerm}
                  />
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-xs font-bold text-slate-700">مکمل عربی إعراب</div>
                <p className="font-arabic text-lg text-slate-900 leading-[2.0]">
                  {activeWord.irabTab.fullExplanationUr}
                </p>
              </div>
            </div>
          )}

          {activeWord.alternativeNoteUr && (
            <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 text-xs text-indigo-950 leading-relaxed">
              <span className="font-bold">دوسرا مستند قول: </span>
              <ClickableGrammarText
                text={activeWord.alternativeNoteUr}
                onSelectTerm={onSelectGrammarTerm}
              />
            </div>
          )}

          {/* Panel Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowFullTarkibModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-300 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" /> پوری آیت کی ترکیب
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenAiTutor({
                  contextType: 'word',
                  contextTitle: `لفظ: ${activeWord.arabic} (${surah.nameUr} ${surah.surahNumber}:${ayah.number})`,
                  arabicText: activeWord.arabic,
                  contextDetails: `Meaning: ${activeWord.meaningTab.wordUr}; Sarf: ${activeWord.sarfTab.wordKindUr}; Nahw: ${activeWord.nahwTab.nahwiRoleUr}; I'rab: ${activeWord.irabTab.stateUr}`,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> استادِ معلم سے پوچھیں
            </button>
          </div>
        </div>
      </div>
    );
  }
}
