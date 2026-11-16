import { useState } from 'react';
import { CheckCircle2, Layers, Search, Volume2 } from 'lucide-react';
import { VOCABULARY_ITEMS } from '../data/vocabularyData';
import { LanguageMode, UserProgress, VocabCategory } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { WordTypeLabel } from './WordTypeLabel';

interface VocabularyViewProps {
  languageMode: LanguageMode;
  progress: UserProgress;
  onToggleMastered: (vocabId: string) => void;
}

export function VocabularyView({ languageMode, progress, onToggleMastered }: VocabularyViewProps) {
  const [category, setCategory] = useState<'all' | VocabCategory>('all');
  const [search, setSearch] = useState('');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const categories: { id: 'all' | VocabCategory; labelUr: string }[] = [
    { id: 'all', labelUr: 'تمام الفاظ' },
    { id: 'shared', labelUr: 'اردو سے مشترک' },
    { id: 'particles', labelUr: 'حروف و ضمائر' },
    { id: 'verbs', labelUr: 'کثیر الاستعمال افعال' },
    { id: 'attributes', labelUr: 'صفاتِ الٰہی' },
    { id: 'concepts', labelUr: 'قرآنی تصورات' },
  ];

  const filtered = VOCABULARY_ITEMS.filter((item) => {
    const matchesCat = category === 'all' || item.category === category;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.arabic.includes(q) ||
      item.meaningUr.includes(q) ||
      item.meaningEn.toLowerCase().includes(q) ||
      item.transliteration.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const masteredCount = progress.masteredVocabIds.length;
  const currentCard = filtered[cardIdx % Math.max(1, filtered.length)];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
              قرآنی الفاظ بینک (High-Frequency Vocabulary)
            </h1>
            <p className="font-urdu-ui text-sm text-slate-600">
              قرآن مجید میں ہزاروں بار دہرائے جانے والے بنیادی الفاظ، اردو سے ان کا رشتہ اور قرآنی مثالیں۔
              <span className="font-mono-tabular font-semibold text-emerald-800 mr-2">
                ({masteredCount} / {VOCABULARY_ITEMS.length} یاد شدہ)
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCardIdx(0);
                }}
                placeholder="تلاش کریں..."
                className="pr-9 pl-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-urdu-ui focus:outline-none focus:border-emerald-600"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setFlashcardMode((v) => !v);
                setFlipped(false);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-urdu-ui font-semibold cursor-pointer transition-colors ${
                flashcardMode
                  ? 'bg-emerald-700 border-emerald-700 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{flashcardMode ? 'فہرست دیکھیں' : 'فلیش کارڈ مشق'}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCategory(c.id);
                setCardIdx(0);
                setFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                category === c.id ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
              }`}
            >
              {c.labelUr}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center font-urdu-ui text-sm text-slate-500">
          اس تلاش سے کوئی لفظ نہیں ملا۔
        </div>
      ) : flashcardMode && currentCard ? (
        /* Flashcard Study Mode */
        <div className="max-w-2xl mx-auto space-y-4">
          <div
            onClick={() => setFlipped((f) => !f)}
            className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-5 cursor-pointer hover:border-emerald-300 transition-colors min-h-[300px] flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-3">
              <WordTypeLabel type={currentCard.type} languageMode={languageMode} compact />
              <span className="font-mono-tabular text-xs text-slate-500">
                قرآن میں {currentCard.occurrences}×
              </span>
            </div>

            <div className="font-arabic text-6xl text-slate-900">{currentCard.arabic}</div>

            {!flipped ? (
              <div className="font-urdu-ui text-xs text-slate-400 pt-2">معنی دیکھنے کے لیے کارڈ پر کلک کریں</div>
            ) : (
              <div className="space-y-3 pt-3 border-t border-slate-100 w-full">
                <div className="font-urdu text-2xl font-bold text-emerald-900">{currentCard.meaningUr}</div>
                {languageMode === 'bilingual' && (
                  <div className="text-xs text-slate-500 font-sans" dir="ltr">
                    {currentCard.transliteration} · {currentCard.meaningEn}
                  </div>
                )}
                <p className="font-urdu-ui text-xs text-slate-600">{currentCard.urduBridgeNote}</p>
                <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                  <div className="font-arabic text-xl text-slate-900">{currentCard.quranExampleAr}</div>
                  <div className="font-urdu-ui text-xs text-slate-600">{currentCard.quranExampleUr}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => speakArabic(currentCard.arabic)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-urdu-ui font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>تلفظ سنیں</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleMastered(currentCard.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-urdu-ui font-semibold cursor-pointer ${
                  progress.masteredVocabIds.includes(currentCard.id)
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>{progress.masteredVocabIds.includes(currentCard.id) ? 'یاد ہو گیا' : 'یاد کے طور پر نشان زد کریں'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCardIdx((i) => (i + 1) % filtered.length);
                  setFlipped(false);
                }}
                className="px-5 py-2 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                اگلا لفظ ({(cardIdx % filtered.length) + 1}/{filtered.length})
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Reference Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const mastered = progress.masteredVocabIds.includes(item.id);
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <WordTypeLabel type={item.type} languageMode={languageMode} compact />
                    <span className="font-mono-tabular text-xs text-slate-500">{item.occurrences}×</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="font-arabic text-3xl text-slate-900">{item.arabic}</div>
                    <button
                      type="button"
                      onClick={() => speakArabic(item.arabic)}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-emerald-700 cursor-pointer"
                      aria-label={`Play ${item.transliteration}`}
                    >
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div>
                    <div className="font-urdu text-lg font-bold text-emerald-900">{item.meaningUr}</div>
                    {languageMode === 'bilingual' && (
                      <div className="text-xs text-slate-500 font-sans" dir="ltr">
                        {item.transliteration} · {item.meaningEn}
                      </div>
                    )}
                  </div>

                  <p className="font-urdu-ui text-xs text-slate-600 leading-relaxed">{item.urduBridgeNote}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                    <div className="font-arabic text-lg text-slate-900">{item.quranExampleAr}</div>
                    <div className="font-urdu-ui text-[11px] text-slate-600">{item.quranExampleUr}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleMastered(item.id)}
                    className={`w-full py-2 rounded-lg border text-xs font-urdu-ui font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      mastered
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{mastered ? 'یاد ہو چکا ہے' : 'یاد کے طور پر نشان لگائیں'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
