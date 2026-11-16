import { useMemo, useState } from 'react';
import { BookOpen, FileText, GitMerge, Languages, Search, Sparkles, X } from 'lucide-react';
import { ABWAB_REFERENCE, DARS_E_NIZAMI_BOOKS } from '../data/abwabAndLibraryData';
import { LESSONS } from '../data/curriculumData';
import { GRAMMAR_GLOSSARY } from '../data/glossaryData';
import { QURAN_STUDIO_SURAHS } from '../data/quranStudioData';
import { QURAN_ROOTS } from '../data/rootsData';
import { VOCABULARY_ITEMS } from '../data/vocabularyData';
import { GrammarTerm, PrimaryNavTab } from '../types/quranic';
import { stripTashkeel } from '../utils/arabicAudio';

export interface SearchJumpTarget {
  tab: PrimaryNavTab;
  lessonId?: string;
  surahId?: string;
  ayahNumber?: number;
  wordId?: string;
  rootId?: string;
  term?: GrammarTerm;
  librarySection?: 'vocab' | 'glossary' | 'roots' | 'abwab' | 'books';
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJump: (target: SearchJumpTarget) => void;
}

interface SearchResultItem {
  id: string;
  categoryUr: string;
  titleUr: string;
  arabic?: string;
  subtitleUr: string;
  icon: 'studio' | 'term' | 'root' | 'lesson' | 'vocab' | 'book';
  target: SearchJumpTarget;
}

export function GlobalSearchModal({ isOpen, onClose, onJump }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResultItem[]>(() => {
    const raw = query.trim();
    if (!raw) return [];
    const qClean = stripTashkeel(raw).toLowerCase();
    const out: SearchResultItem[] = [];

    // 1. Grammar Glossary Terms
    for (const term of GRAMMAR_GLOSSARY) {
      if (
        stripTashkeel(term.termUr).includes(qClean) ||
        stripTashkeel(term.termAr).includes(qClean) ||
        term.termEn.toLowerCase().includes(qClean) ||
        term.aliases.some((a) => stripTashkeel(a).includes(qClean))
      ) {
        out.push({
          id: `term-${term.id}`,
          categoryUr: 'نحوی و صرفی اصطلاح',
          titleUr: `${term.termUr} (${term.termEn})`,
          arabic: term.termAr,
          subtitleUr: term.simpleUrduDef,
          icon: 'term',
          target: { tab: 'library', term },
        });
      }
    }

    // 2. Quran Studio Words & Verses (with or without Harakaat)
    for (const surah of QURAN_STUDIO_SURAHS) {
      for (const ayah of surah.ayahs) {
        const ayahClean = stripTashkeel(ayah.arabicFull);
        if (
          ayahClean.includes(qClean) ||
          ayah.translationUr.includes(raw) ||
          surah.nameUr.includes(raw)
        ) {
          out.push({
            id: `ayah-${surah.id}-${ayah.number}`,
            categoryUr: `قرآن اسٹوڈیو · ${surah.nameUr} آیت ${ayah.number}`,
            titleUr: ayah.translationUr,
            arabic: ayah.arabicFull,
            subtitleUr: ayah.sentenceStructureUr,
            icon: 'studio',
            target: { tab: 'studio', surahId: surah.id, ayahNumber: ayah.number },
          });
        }
        for (const w of ayah.words) {
          if (
            stripTashkeel(w.arabic).includes(qClean) ||
            w.meaningTab.wordUr.includes(raw) ||
            (w.meaningTab.root && stripTashkeel(w.meaningTab.root).includes(qClean))
          ) {
            out.push({
              id: `word-${w.id}`,
              categoryUr: `قرآنی لفظ · ${surah.nameUr} (${surah.surahNumber}:${ayah.number})`,
              titleUr: `${w.meaningTab.wordUr} — ${w.nahwTab.nahwiRoleUr}`,
              arabic: w.arabic,
              subtitleUr: w.meaningTab.root ? `مادہ: ${w.meaningTab.root}` : w.irabTab.stateUr,
              icon: 'studio',
              target: {
                tab: 'studio',
                surahId: surah.id,
                ayahNumber: ayah.number,
                wordId: w.id,
              },
            });
          }
        }
      }
    }

    // 3. Roots
    for (const root of QURAN_ROOTS) {
      if (
        stripTashkeel(root.rootLetters).includes(qClean) ||
        stripTashkeel(root.rootLetters.replace(/\s+/g, '')).includes(qClean.replace(/\s+/g, '')) ||
        root.transliteration.toLowerCase().includes(qClean) ||
        root.coreMeaningUr.includes(raw)
      ) {
        out.push({
          id: `root-${root.id}`,
          categoryUr: 'سہ حرفی مادہ',
          titleUr: `${root.rootLetters} — ${root.coreMeaningUr}`,
          arabic: root.rootLetters,
          subtitleUr: `قرآنی تکرار: ${root.quranOccurrences} · اردو الفاظ: ${root.urduBridgeWords.join('، ')}`,
          icon: 'root',
          target: { tab: 'library', librarySection: 'roots', rootId: root.id },
        });
      }
    }

    // 4. Lessons
    for (const lesson of LESSONS) {
      if (
        lesson.titleUr.includes(raw) ||
        lesson.titleEn.toLowerCase().includes(qClean) ||
        lesson.subtitleUr.includes(raw)
      ) {
        out.push({
          id: `lesson-${lesson.id}`,
          categoryUr: `سبق نمبر ${lesson.number}`,
          titleUr: lesson.titleUr,
          subtitleUr: lesson.subtitleUr,
          icon: 'lesson',
          target: { tab: 'learn', lessonId: lesson.id },
        });
      }
    }

    // 5. Vocabulary
    for (const v of VOCABULARY_ITEMS) {
      if (
        stripTashkeel(v.arabic).includes(qClean) ||
        v.meaningUr.includes(raw) ||
        (v.root && stripTashkeel(v.root).includes(qClean))
      ) {
        out.push({
          id: `vocab-${v.id}`,
          categoryUr: 'قرآنی لغت',
          titleUr: `${v.meaningUr} (${v.meaningEn})`,
          arabic: v.arabic,
          subtitleUr: v.urduBridgeNote,
          icon: 'vocab',
          target: { tab: 'library', librarySection: 'vocab' },
        });
      }
    }

    // 6. Abwab & Classical Books
    for (const bab of ABWAB_REFERENCE) {
      if (stripTashkeel(bab.nameUr).includes(qClean) || bab.semanticRoleUr.includes(raw)) {
        out.push({
          id: `bab-${bab.id}`,
          categoryUr: 'ابوابِ صرف',
          titleUr: bab.nameUr,
          arabic: bab.nameAr,
          subtitleUr: bab.semanticRoleUr,
          icon: 'book',
          target: { tab: 'library', librarySection: 'abwab' },
        });
      }
    }

    for (const book of DARS_E_NIZAMI_BOOKS) {
      if (book.titleUr.includes(raw) || book.descriptionUr.includes(raw)) {
        out.push({
          id: `book-${book.id}`,
          categoryUr: 'درسِ نظامی کتاب',
          titleUr: book.titleUr,
          arabic: book.titleAr,
          subtitleUr: book.descriptionUr,
          icon: 'book',
          target: { tab: 'library', librarySection: 'books' },
        });
      }
    }

    return out.slice(0, 24);
  }, [query]);

  if (!isOpen) return null;

  const iconMap = {
    studio: Sparkles,
    term: GitMerge,
    root: Languages,
    lesson: BookOpen,
    vocab: FileText,
    book: BookOpen,
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-[2px] flex items-start justify-center p-3 sm:pt-16"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[82dvh]"
      >
        <div className="px-4 py-3.5 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-700 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="عربی لفظ (بلا حرکات یا حرکات سمیت)، مادہ، اصطلاح (مثلاً مبتدا)، باب یا سبق تلاش کریں..."
            className="flex-1 bg-transparent text-sm sm:text-base font-urdu-ui text-slate-900 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="تلاش بند کریں"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {!query.trim() ? (
            <div className="p-6 space-y-3 text-center">
              <p className="font-urdu-ui text-sm text-slate-600">
                کسی بھی موضوع تک فوری پہنچنے کے لیے سرچ کریں:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['الصمد', 'مبتدا', 'ع ل م', 'گردان', 'نحو میر', 'باب إفعال'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setQuery(chip)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-urdu-ui text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center font-urdu-ui text-sm text-slate-500">
              "{query}" سے متعلق کوئی نتیجہ نہیں ملا۔ عربی مادہ یا آسان اردو لفظ آزمائیں۔
            </div>
          ) : (
            results.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onJump(item.target);
                    onClose();
                  }}
                  className="w-full text-right px-5 py-3.5 hover:bg-emerald-50/60 transition-colors flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 text-emerald-800 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-[11px] font-urdu-ui font-semibold text-emerald-800">
                        {item.categoryUr}
                      </div>
                      <div className="font-urdu-ui text-sm font-bold text-slate-900 truncate">
                        {item.titleUr}
                      </div>
                      <p className="font-urdu-ui text-xs text-slate-500 line-clamp-1">
                        {item.subtitleUr}
                      </p>
                    </div>
                  </div>
                  {item.arabic && (
                    <span className="font-arabic text-xl text-slate-900 shrink-0">
                      {item.arabic}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
