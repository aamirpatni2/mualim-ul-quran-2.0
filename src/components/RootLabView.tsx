import { useState } from 'react';
import { Search, Volume2 } from 'lucide-react';
import { QURAN_ROOTS } from '../data/rootsData';
import { LanguageMode } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';

export function RootLabView({ languageMode }: { languageMode: LanguageMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRootId, setSelectedRootId] = useState(QURAN_ROOTS[0].id);

  const filteredRoots = QURAN_ROOTS.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      r.rootLetters.includes(q) ||
      r.transliteration.toLowerCase().includes(q) ||
      r.coreMeaningUr.includes(q) ||
      r.coreMeaningEn.toLowerCase().includes(q) ||
      r.urduBridgeWords.some((w) => w.includes(q))
    );
  });

  const activeRoot = QURAN_ROOTS.find((r) => r.id === selectedRootId) ?? QURAN_ROOTS[0];

  return (
    <div className="space-y-8" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
              سہ حرفی مادہ لیب (Quranic Root & Morphology Lab)
            </h1>
            <p className="font-urdu-ui text-sm text-slate-600">
              تین بنیادی حروف چنیں اور دیکھیں کہ ایک مادے سے قرآن کے کتنے الفاظ اور اردو اصطلاحات بنتی ہیں۔
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="مادہ یا اردو لفظ تلاش کریں..."
              className="w-full pr-9 pl-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-urdu-ui focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Root Selector Rail (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
          {filteredRoots.length === 0 ? (
            <div className="p-6 text-center text-xs font-urdu-ui text-slate-500">
              کوئی مادہ نہیں ملا۔ دوسرا لفظ آزمائیں۔
            </div>
          ) : (
            filteredRoots.map((root) => {
              const isSelected = root.id === activeRoot.id;
              return (
                <button
                  key={root.id}
                  type="button"
                  onClick={() => setSelectedRootId(root.id)}
                  className={`w-full text-right p-4 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                    isSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-arabic text-2xl text-slate-900 font-bold">{root.rootLetters}</div>
                    <div className="font-urdu-ui text-xs text-slate-600 mt-0.5">{root.coreMeaningUr}</div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className="font-mono-tabular text-xs font-semibold text-emerald-800">
                      {root.quranOccurrences}×
                    </div>
                    {languageMode === 'bilingual' && (
                      <div className="text-[11px] text-slate-400 font-sans" dir="ltr">
                        {root.transliteration}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Selected Root Breakdown Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1.5">
                <div className="text-xs text-slate-500 font-urdu-ui flex items-center gap-2">
                  <span>بنیادی مادہ</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">قرآن میں {activeRoot.quranOccurrences} مرتبہ وارد</span>
                </div>
                <div className="font-arabic text-5xl text-emerald-900">{activeRoot.rootLetters}</div>
                <div className="font-urdu text-xl font-bold text-slate-900">{activeRoot.coreMeaningUr}</div>
                {languageMode === 'bilingual' && (
                  <div className="text-xs text-slate-500 font-sans" dir="ltr">
                    Core sense: {activeRoot.coreMeaningEn}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5 max-w-xs">
                <div className="font-urdu-ui text-xs font-semibold text-slate-700">
                  اردو میں مستعمل ہم خاندان الفاظ
                </div>
                <div className="font-urdu text-base text-emerald-900 leading-relaxed">
                  {activeRoot.urduBridgeWords.join(' · ')}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-urdu-ui text-sm font-bold text-slate-800">
                اس مادے سے بننے والے اہم قرآنی اوزان (Derived Patterns)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeRoot.derivedForms.map((form, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-urdu-ui text-xs font-semibold text-emerald-800">
                          {form.patternNameUr}
                        </div>
                        <div className="text-[11px] text-slate-500 font-arabic">{form.patternAr}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => speakArabic(form.wordAr)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 cursor-pointer"
                        aria-label={`Play ${form.transliteration}`}
                      >
                        <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-arabic text-3xl text-slate-900">{form.wordAr}</span>
                      <span className="font-urdu text-base font-semibold text-slate-800">{form.meaningUr}</span>
                    </div>

                    {form.urduFamiliarNote && (
                      <div className="text-xs font-urdu-ui text-emerald-800">{form.urduFamiliarNote}</div>
                    )}

                    <div className="pt-2.5 border-t border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-urdu-ui">
                        <span>قرآنی مثال ({form.quranRef})</span>
                        <button
                          type="button"
                          onClick={() => speakArabic(form.quranExampleAr)}
                          className="text-emerald-700 hover:underline cursor-pointer"
                        >
                          آیت سنیں
                        </button>
                      </div>
                      <div className="font-arabic text-xl text-slate-900 leading-loose">
                        {form.quranExampleAr}
                      </div>
                      <div className="font-urdu-ui text-xs text-slate-600 leading-relaxed">
                        {form.quranExampleUr}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
