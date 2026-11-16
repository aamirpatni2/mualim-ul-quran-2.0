import { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  FileText,
  NotebookPen,
  Search,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react';
import { ABWAB_REFERENCE, BALAGHA_TOPICS, DARS_E_NIZAMI_BOOKS } from '../data/abwabAndLibraryData';
import { LESSONS } from '../data/curriculumData';
import { GRAMMAR_GLOSSARY } from '../data/glossaryData';
import { VOCABULARY_ITEMS } from '../data/vocabularyData';
import {
  GrammarTerm,
  LanguageMode,
  UserProgress,
  VocabCategory,
} from '../types/quranic';
import { speakArabic, stripTashkeel } from '../utils/arabicAudio';
import { RootLabView } from './RootLabView';
import { VerificationBadge } from './VerificationBadge';
import { WordTypeLabel } from './WordTypeLabel';

export type LibrarySectionId = 'vocab' | 'glossary' | 'roots' | 'abwab' | 'books' | 'saved';

interface LibraryHubViewProps {
  languageMode: LanguageMode;
  progress: UserProgress;
  activeSection: LibrarySectionId;
  onChangeSection: (section: LibrarySectionId) => void;
  onSelectGrammarTerm: (term: GrammarTerm) => void;
  onJumpToLesson: (lessonId: string) => void;
  onJumpToStudio: (surahId: string, ayahNumber: number, wordId?: string) => void;
  onRemoveBookmark: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function LibraryHubView({
  languageMode,
  progress,
  activeSection,
  onChangeSection,
  onSelectGrammarTerm,
  onJumpToLesson,
  onJumpToStudio,
  onRemoveBookmark,
  onDeleteNote,
}: LibraryHubViewProps) {
  // Vocab Dictionary filters
  const [vocabEntryMode, setVocabEntryMode] = useState<'common' | 'surah' | 'root' | 'all'>('common');
  const [vocabCategory, setVocabCategory] = useState<'all' | VocabCategory>('all');
  const [vocabQuery, setVocabQuery] = useState('');
  const [glossaryQuery, setGlossaryQuery] = useState('');

  const sections: { id: LibrarySectionId; labelUr: string }[] = [
    { id: 'vocab', labelUr: 'قرآنی لغت (Vocabulary)' },
    { id: 'glossary', labelUr: 'اصطلاحاتِ نحو و صرف' },
    { id: 'roots', labelUr: 'سہ حرفی مادہ لغت' },
    { id: 'abwab', labelUr: 'ابواب و بلاغت' },
    { id: 'books', labelUr: 'درسِ نظامی کتب' },
    {
      id: 'saved',
      labelUr: `بک مارکس و نوٹس (${progress.bookmarks.length + progress.notes.length})`,
    },
  ];

  const filteredVocab = VOCABULARY_ITEMS.filter((v) => {
    if (vocabEntryMode === 'common' && v.occurrences < 95) return false;
    if (vocabEntryMode === 'surah' && !v.surahRef) return false;
    if (vocabEntryMode === 'root' && !v.root) return false;
    if (vocabCategory !== 'all' && v.category !== vocabCategory) return false;
    if (!vocabQuery.trim()) return true;
    const q = stripTashkeel(vocabQuery.trim()).toLowerCase();
    return (
      stripTashkeel(v.arabic).includes(q) ||
      v.meaningUr.includes(vocabQuery.trim()) ||
      (v.root && stripTashkeel(v.root).includes(q)) ||
      (v.surahRef && v.surahRef.includes(vocabQuery.trim()))
    );
  });

  const filteredGlossary = GRAMMAR_GLOSSARY.filter((g) => {
    if (!glossaryQuery.trim()) return true;
    const q = glossaryQuery.trim().toLowerCase();
    return (
      g.termUr.includes(q) ||
      g.termAr.includes(q) ||
      g.termEn.toLowerCase().includes(q) ||
      g.simpleUrduDef.includes(q)
    );
  });

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <div>
          <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
            علمی لائبریری و حوالہ جات (Reference Library)
          </h1>
          <p className="font-urdu-ui text-sm text-slate-600">
            قرآنی الفاظ کی مستند لغت، صرف و نحو کی اصطلاحات، سہ حرفی مادے، ابواب، درسِ نظامی کتب اور آپ کے ذاتی نوٹس۔
          </p>
        </div>

        <div className="flex flex-nowrap sm:flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChangeSection(s.id)}
              className={`px-3.5 py-2 min-h-[40px] rounded-lg text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
                activeSection === s.id
                  ? 'bg-white text-emerald-800 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s.labelUr}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Quranic Vocabulary Dictionary */}
      {activeSection === 'vocab' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'common', label: 'کثیر الاستعمال الفاظ' },
                    { id: 'surah', label: 'سورۃ کے لحاظ سے' },
                    { id: 'root', label: 'مادہ کے لحاظ سے' },
                    { id: 'all', label: 'تمام الفاظ' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setVocabEntryMode(m.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-urdu-ui cursor-pointer ${
                      vocabEntryMode === m.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={vocabQuery}
                  onChange={(e) => setVocabQuery(e.target.value)}
                  placeholder="لفظ، مادہ یا سورۃ تلاش کریں..."
                  className="w-full pr-9 pl-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-urdu-ui focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs font-urdu-ui">
              {(
                [
                  { id: 'all', label: 'تمام اقسام' },
                  { id: 'shared', label: 'اردو مشترک' },
                  { id: 'particles', label: 'حروف و اسمائے اشارہ/موصول' },
                  { id: 'verbs', label: 'افعال' },
                  { id: 'attributes', label: 'صفاتِ الٰہی' },
                  { id: 'concepts', label: 'قرآنی تصورات' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setVocabCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${
                    vocabCategory === cat.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVocab.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <WordTypeLabel type={item.type} />
                      {item.verificationStatus && (
                        <VerificationBadge status={item.verificationStatus} compact />
                      )}
                    </div>
                    <div className="font-arabic text-3xl text-slate-900">{item.arabic}</div>
                    <div className="font-urdu text-lg font-bold text-slate-900 mt-0.5">
                      {item.meaningUr}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakArabic(item.arabic)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-800 cursor-pointer"
                    aria-label="تلفظ سنیں"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-urdu-ui text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  {item.lemma && <span>اصل: {item.lemma}</span>}
                  {item.root && <span>· مادہ: {item.root}</span>}
                  {item.pattern && <span>· وزن: {item.pattern}</span>}
                  {item.bab && <span>· {item.bab}</span>}
                  <span>
                    · تکرار ({item.occurrenceBasis === 'root' ? 'مادہ' : item.occurrenceBasis === 'lemma' ? 'اصل لفظ' : 'متعین شکل'}):{' '}
                    <strong className="font-mono-tabular">{item.occurrences}</strong>
                  </span>
                </div>

                <p className="font-urdu-ui text-xs text-slate-600 leading-relaxed">
                  {item.urduBridgeNote}
                </p>

                <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-1">
                  <div className="font-arabic text-lg text-slate-900">{item.quranExampleAr}</div>
                  <div className="font-urdu-ui text-xs text-slate-700">
                    {item.quranExampleUr}{' '}
                    {item.surahRef && (
                      <span className="text-emerald-800 font-semibold">({item.surahRef})</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Grammar Glossary (19 Clickable 11-Part Entries) */}
      {activeSection === 'glossary' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm font-urdu-ui text-slate-700">
              کسی بھی اصطلاح پر کلک کر کے اس کی عربی تعریف، قواعد، علامات، ترکیب اور فوری مشق دیکھیں۔
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
                placeholder="اصطلاح تلاش کریں (مثلاً مبتدا، حال)..."
                className="w-full pr-9 pl-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-urdu-ui focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGlossary.map((term) => (
              <button
                key={term.id}
                type="button"
                onClick={() => onSelectGrammarTerm(term)}
                className="text-right bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-5 space-y-2.5 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-arabic text-2xl text-emerald-800">{term.termAr}</span>
                    <VerificationBadge status={term.verificationStatus} compact />
                  </div>
                  <div className="font-urdu text-xl font-bold text-slate-900">{term.termUr}</div>
                  <div className="text-[11px] font-mono text-slate-500" dir="ltr">
                    {term.termEn}
                  </div>
                  <p className="font-urdu-ui text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {term.simpleUrduDef}
                  </p>
                </div>
                <div className="text-xs font-urdu-ui font-bold text-emerald-800 pt-2 border-t border-slate-100">
                  مکمل ١١ نکاتی وضاحت و مشق دیکھیں ←
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Root Dictionary (Preserved RootLabView) */}
      {activeSection === 'roots' && <RootLabView languageMode={languageMode} />}

      {/* Section 4: Abwab & Balagha Quick Reference */}
      {activeSection === 'abwab' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ABWAB_REFERENCE.map((bab) => (
              <div key={bab.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-urdu text-lg font-bold text-slate-900">{bab.nameUr}</h3>
                  <span className="font-arabic text-lg text-emerald-800">{bab.nameAr}</span>
                </div>
                <p className="font-urdu-ui text-xs text-slate-700">{bab.semanticRoleUr}</p>
                <div className="text-xs font-urdu-ui text-slate-500">
                  مثال: <span className="font-arabic text-base text-slate-900">{bab.quranExampleAr}</span> ({bab.quranExampleRef})
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="font-urdu text-xl font-bold text-slate-900">بلاغت کے بنیادی اسالیب</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BALAGHA_TOPICS.map((bal) => (
                <div key={bal.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="font-urdu text-lg font-bold text-slate-900">{bal.titleUr}</div>
                  <p className="font-urdu-ui text-xs text-slate-700">{bal.simpleDefUr}</p>
                  <div className="font-arabic text-base text-emerald-900">{bal.quranExampleAr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Dars-e-Nizami Classical Books Reference */}
      {activeSection === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DARS_E_NIZAMI_BOOKS.map((book) => (
            <div key={book.id} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="text-xs font-urdu-ui font-bold text-emerald-800">
                    {book.subjectUr} · {book.levelUr}
                  </div>
                  <h3 className="font-urdu text-2xl font-bold text-slate-900">{book.titleUr}</h3>
                  <div className="font-arabic text-lg text-slate-600">{book.titleAr}</div>
                </div>
                <VerificationBadge status={book.verificationStatus} compact />
              </div>
              <div className="text-xs font-urdu-ui text-slate-500">مصنف: {book.authorUr}</div>
              <p className="font-urdu-ui text-sm text-slate-700 leading-relaxed">
                {book.descriptionUr}
              </p>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs font-urdu-ui text-emerald-950">
                <Sparkles className="w-3.5 h-3.5 inline ml-1" />
                {book.usageInAcademyUr}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 6: Bookmarks, Personal Notes & Completed Lessons */}
      {activeSection === 'saved' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookmarks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-base font-urdu-ui font-bold text-slate-900">
              <Bookmark className="w-4 h-4 text-amber-600" />
              محفوظ بک مارکس ({progress.bookmarks.length})
            </div>
            {progress.bookmarks.length === 0 ? (
              <p className="font-urdu-ui text-xs text-slate-500 py-4">
                قرآن اسٹوڈیو یا اصطلاحات میں "بک مارک" دبائیں تو وہ یہاں محفوظ ہو جائیں گے۔
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {progress.bookmarks.map((bm) => (
                  <div key={bm.id} className="py-3 flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (bm.refTarget.tab === 'studio' && bm.refTarget.surahId) {
                          onJumpToStudio(
                            bm.refTarget.surahId,
                            bm.refTarget.ayahNumber ?? 1,
                            bm.refTarget.wordId
                          );
                        } else if (bm.refTarget.termId) {
                          const t = GRAMMAR_GLOSSARY.find((g) => g.id === bm.refTarget.termId);
                          if (t) onSelectGrammarTerm(t);
                        } else if (bm.refTarget.lessonId) {
                          onJumpToLesson(bm.refTarget.lessonId);
                        }
                      }}
                      className="text-right space-y-1 flex-1 cursor-pointer hover:text-emerald-800"
                    >
                      <div className="font-urdu-ui text-sm font-bold text-slate-900">
                        {bm.titleUr}
                      </div>
                      {bm.arabic && (
                        <div className="font-arabic text-lg text-emerald-900">{bm.arabic}</div>
                      )}
                      {bm.subtitleUr && (
                        <div className="font-urdu-ui text-xs text-slate-500">{bm.subtitleUr}</div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveBookmark(bm.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      aria-label="بک مارک حذف کریں"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Notes & Completed Lessons */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-base font-urdu-ui font-bold text-slate-900">
                <NotebookPen className="w-4 h-4 text-emerald-700" />
                ذاتی نوٹس ({progress.notes.length})
              </div>
              {progress.notes.length === 0 ? (
                <p className="font-urdu-ui text-xs text-slate-500 py-4">
                  ابھی کوئی ذاتی نوٹ محفوظ نہیں ہے۔ کسی بھی آیت یا اصطلاح پر "ذاتی نوٹ" شامل کریں۔
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {progress.notes.map((n) => (
                    <div key={n.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="font-urdu-ui text-xs font-bold text-emerald-800">
                          {n.targetTitle}
                        </div>
                        <p className="font-urdu-ui text-sm text-slate-800 whitespace-pre-wrap">
                          {n.content}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteNote(n.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label="نوٹ حذف کریں"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-base font-urdu-ui font-bold text-slate-900">
                <BookOpen className="w-4 h-4 text-slate-700" />
                مکمل شدہ اسباق ({progress.completedLessonIds.length})
              </div>
              {progress.completedLessonIds.length === 0 ? (
                <p className="font-urdu-ui text-xs text-slate-500">
                  ابھی کوئی سبق مکمل نہیں ہوا۔ "تعلیم" سیکشن سے پہلا سبق شروع کریں۔
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {progress.completedLessonIds.map((lid) => {
                    const l = LESSONS.find((x) => x.id === lid);
                    if (!l) return null;
                    return (
                      <button
                        key={lid}
                        type="button"
                        onClick={() => onJumpToLesson(lid)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-urdu-ui font-semibold cursor-pointer hover:bg-emerald-100"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        سبق {l.number}: {l.titleUr}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
