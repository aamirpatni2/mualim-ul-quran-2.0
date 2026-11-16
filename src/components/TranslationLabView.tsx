import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { SURAH_MODULES } from '../data/surahData';
import { Ayah, AyahWord, LanguageMode, UserProgress } from '../types/quranic';
import { speakArabic, stripTashkeel } from '../utils/arabicAudio';
import { TarkeebStudio } from './TarkeebStudio';
import { WordTypeLabel } from './WordTypeLabel';

interface TranslationLabViewProps {
  languageMode: LanguageMode;
  progress: UserProgress;
  onMarkSurahComplete: (surahId: string) => void;
}

export function TranslationLabView({
  languageMode,
  progress,
  onMarkSurahComplete,
}: TranslationLabViewProps) {
  const [selectedSurahId, setSelectedSurahId] = useState(SURAH_MODULES[0].id);
  const [selectedAyahIndex, setSelectedAyahIndex] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [showTashkeel, setShowTashkeel] = useState(true);
  const [labMode, setLabMode] = useState<'inspect' | 'tarkeeb' | 'translate'>('inspect');
  const [showFullTranslation, setShowFullTranslation] = useState(true);

  // Translation Assembly Challenge state
  const [pickedTokens, setPickedTokens] = useState<string[]>([]);
  const [checkResult, setCheckResult] = useState<'idle' | 'correct' | 'retry'>('idle');

  const surah = SURAH_MODULES.find((s) => s.id === selectedSurahId) ?? SURAH_MODULES[0];
  const ayah: Ayah = surah.ayahs[selectedAyahIndex] ?? surah.ayahs[0];

  const selectedWord: AyahWord =
    ayah.words.find((w) => w.id === selectedWordId) ?? ayah.words[0];

  // Deterministic shuffle of Urdu tokens for the selected ayah
  const availableTokens = useMemo(() => {
    const tokens = [...ayah.urduOrderTokens];
    if (tokens.length <= 1) return tokens;
    // Deterministic rotation + swap so order differs from target
    return tokens
      .map((t, i) => ({ t, sort: ((i * 7 + ayah.number * 3) % tokens.length) }))
      .sort((a, b) => a.sort - b.sort)
      .map((x) => x.t);
  }, [ayah]);

  useEffect(() => {
    setSelectedAyahIndex(0);
    setSelectedWordId(null);
    setPickedTokens([]);
    setCheckResult('idle');
  }, [selectedSurahId]);

  useEffect(() => {
    setSelectedWordId(ayah.words[0]?.id ?? null);
    setPickedTokens([]);
    setCheckResult('idle');
  }, [selectedAyahIndex, ayah]);

  const handleToggleToken = (token: string) => {
    setCheckResult('idle');
    if (pickedTokens.includes(token)) {
      setPickedTokens((prev) => prev.filter((t) => t !== token));
    } else {
      setPickedTokens((prev) => [...prev, token]);
    }
  };

  const handleVerifyTranslation = () => {
    const isExact =
      pickedTokens.length === ayah.urduOrderTokens.length &&
      pickedTokens.every((t, idx) => t === ayah.urduOrderTokens[idx]);
    setCheckResult(isExact ? 'correct' : 'retry');
    if (isExact && selectedAyahIndex === surah.ayahs.length - 1) {
      onMarkSurahComplete(surah.id);
    }
  };

  const isSurahDone = progress.completedSurahIds.includes(surah.id);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Surah Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-urdu-ui">
              <span className="font-semibold text-emerald-800">قرآنی ترجمہ لیب</span>
              <span aria-hidden="true">·</span>
              <span>لفظ بہ لفظ تجزیہ اور خود ترجمہ مشق</span>
              {isSurahDone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    مکمل مشق شدہ
                  </span>
                </>
              )}
            </div>
            <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
              {surah.nameUr} — {surah.nameAr}
            </h1>
            <p className="font-urdu-ui text-sm text-slate-600 max-w-3xl">{surah.summaryUr}</p>
          </div>

          {/* Controls: Lab Mode + Tashkeel Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
              <button
                type="button"
                onClick={() => setLabMode('inspect')}
                className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  labMode === 'inspect' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                لفظ بہ لفظ تجزیہ
              </button>
              <button
                type="button"
                onClick={() => setLabMode('tarkeeb')}
                className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  labMode === 'tarkeeb' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
                }`}
              >
                ترکیبِ نحوی (Tarkeeb)
              </button>
              <button
                type="button"
                onClick={() => setLabMode('translate')}
                className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  labMode === 'translate' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                خود ترجمہ کریں
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowTashkeel((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-urdu-ui font-medium text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              {showTashkeel ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  <span>اعراب: آن</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                  <span>بغیر اعراب مشق</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Surah Selection Tabs (hidden when in Tarkeeb Workshop mode) */}
        {labMode !== 'tarkeeb' && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {SURAH_MODULES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedSurahId(item.id)}
                className={`px-4 py-2 rounded-xl border text-xs font-urdu-ui font-medium transition-colors cursor-pointer ${
                  selectedSurahId === item.id
                    ? 'bg-emerald-700 border-emerald-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.surahNumber}. {item.nameUr}
              </button>
            ))}
          </div>
        )}
      </div>

      {labMode === 'tarkeeb' ? (
        <TarkeebStudio languageMode={languageMode} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ayah List Rail (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
          <div className="px-4 py-3 bg-slate-50 text-xs font-urdu-ui font-bold text-slate-700">
            آیات منتخب کریں ({surah.ayahs.length})
          </div>
          {surah.ayahs.map((a, idx) => (
            <button
              key={a.number}
              type="button"
              onClick={() => setSelectedAyahIndex(idx)}
              className={`w-full text-right p-3.5 transition-colors cursor-pointer space-y-1 ${
                selectedAyahIndex === idx ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-tabular">
                <span className="font-urdu-ui font-semibold text-emerald-800">آیت {a.number}</span>
                <span>{a.words.length} کلمات</span>
              </div>
              <div className="font-arabic text-lg text-slate-900 truncate">
                {showTashkeel ? a.arabicFull : stripTashkeel(a.arabicFull)}
              </div>
            </button>
          ))}
        </div>

        {/* Active Ayah Canvas & Inspector (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            {/* Full Ayah Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="text-xs font-urdu-ui text-slate-500">
                {surah.nameUr} · آیت نمبر <span className="font-mono-tabular font-semibold">{ayah.number}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakArabic(ayah.arabicFull)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-medium hover:bg-emerald-800 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>مکمل آیت سنیں</span>
                </button>
                {labMode === 'inspect' && (
                  <button
                    type="button"
                    onClick={() => setShowFullTranslation((v) => !v)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-urdu-ui text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {showFullTranslation ? 'ترجمہ چھپائیں' : 'ترجمہ دکھائیں'}
                  </button>
                )}
              </div>
            </div>

            {labMode === 'inspect' ? (
              <>
                {/* Clickable Word-by-Word Tokens */}
                <div className="space-y-3">
                  <div className="font-urdu-ui text-xs text-slate-500">
                    کسی بھی عربی لفظ پر کلک کر کے اس کا مادہ، اسم/فعل/حرف اور معنی دیکھیں:
                  </div>
                  <div className="flex flex-wrap gap-3 py-3">
                    {ayah.words.map((word) => {
                      const isActive = selectedWord?.id === word.id;
                      const ringClass =
                        word.type === 'ism'
                          ? 'border-emerald-300 bg-emerald-50/40'
                          : word.type === 'fil'
                          ? 'border-blue-300 bg-blue-50/40'
                          : 'border-amber-300 bg-amber-50/40';

                      return (
                        <button
                          key={word.id}
                          type="button"
                          onClick={() => {
                            setSelectedWordId(word.id);
                            speakArabic(word.arabic);
                          }}
                          className={`px-4 py-3 rounded-xl border transition-all text-center cursor-pointer ${
                            isActive
                              ? `${ringClass} ring-2 ring-emerald-700/30`
                              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="font-arabic text-3xl text-slate-900">
                            {showTashkeel ? word.arabic : stripTashkeel(word.arabic)}
                          </div>
                          <div className="font-urdu-ui text-xs text-slate-700 mt-1">{word.wordUr}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Word Inspector Panel */}
                {selectedWord && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-arabic text-4xl text-slate-900">{selectedWord.arabic}</span>
                        <button
                          type="button"
                          onClick={() => speakArabic(selectedWord.arabic)}
                          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 cursor-pointer"
                          aria-label={`Play ${selectedWord.transliteration}`}
                        >
                          <Volume2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <WordTypeLabel type={selectedWord.type} languageMode={languageMode} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="font-urdu-ui text-[11px] text-slate-500">لفظی اردو معنی</div>
                        <div className="font-urdu text-lg font-bold text-emerald-900">{selectedWord.wordUr}</div>
                      </div>
                      <div>
                        <div className="font-urdu-ui text-[11px] text-slate-500">نحوی و صرفی حیثیت</div>
                        <div className="font-urdu-ui text-sm font-semibold text-slate-800">{selectedWord.grammarUr}</div>
                        {languageMode === 'bilingual' && (
                          <div className="text-xs text-slate-500 font-sans mt-0.5" dir="ltr">
                            {selectedWord.grammarEn}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-urdu-ui text-[11px] text-slate-500">سہ حرفی مادہ (Root)</div>
                        <div className="font-arabic text-2xl text-slate-900">
                          {selectedWord.root ?? 'جامد / حرف'}
                        </div>
                      </div>
                    </div>

                    <p className="font-urdu-ui text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-200/70">
                      {selectedWord.noteUr}
                    </p>
                  </div>
                )}

                {/* Full Verse Translation & Grammar Insight */}
                {showFullTranslation && (
                  <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-5 space-y-2">
                    <div className="font-urdu-ui text-xs font-bold text-emerald-800">با محاورہ اردو ترجمہ</div>
                    <div className="font-urdu text-xl text-slate-900 font-semibold leading-loose">
                      {ayah.translationUr}
                    </div>
                    {languageMode === 'bilingual' && (
                      <div className="text-xs text-slate-600 font-sans" dir="ltr">
                        {ayah.translationEn}
                      </div>
                    )}
                    <div className="pt-2 border-t border-emerald-200/60 font-urdu-ui text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-emerald-900">جملے کی ساخت: </span>
                      {ayah.grammarInsightUr}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Interactive Translation Builder Challenge */
              <div className="space-y-5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-2">
                  <div className="font-urdu-ui text-xs text-slate-500">اس آیت کا اردو ترجمہ ترتیب دیں:</div>
                  <div className="font-arabic text-4xl text-slate-900 leading-loose">
                    {showTashkeel ? ayah.arabicFull : stripTashkeel(ayah.arabicFull)}
                  </div>
                </div>

                {/* Assembled Answer Zone */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-urdu-ui text-slate-600">
                    <span>آپ کا تیار کردہ ترجمہ (درست اردو ترتیب میں چنیں):</span>
                    {pickedTokens.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPickedTokens([]);
                          setCheckResult('idle');
                        }}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>صاف کریں</span>
                      </button>
                    )}
                  </div>
                  <div className="min-h-[68px] p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex flex-wrap gap-2 items-center">
                    {pickedTokens.length === 0 ? (
                      <span className="font-urdu-ui text-xs text-slate-400">
                        نیچے دیے گئے اردو حصوں پر صحیح ترتیب سے کلک کریں...
                      </span>
                    ) : (
                      pickedTokens.map((token, idx) => (
                        <button
                          key={`${token}-${idx}`}
                          type="button"
                          onClick={() => handleToggleToken(token)}
                          className="px-3.5 py-2 rounded-lg bg-emerald-700 text-white font-urdu-ui text-sm hover:bg-emerald-800 cursor-pointer"
                        >
                          {token}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Token Bank */}
                <div className="flex flex-wrap gap-2">
                  {availableTokens.map((token, idx) => {
                    const used = pickedTokens.includes(token);
                    return (
                      <button
                        key={`${token}-${idx}`}
                        type="button"
                        disabled={used}
                        onClick={() => handleToggleToken(token)}
                        className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 font-urdu-ui text-sm hover:border-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {token}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={pickedTokens.length !== ayah.urduOrderTokens.length}
                    onClick={handleVerifyTranslation}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ترجمہ چیک کریں
                  </button>

                  {checkResult === 'correct' && (
                    <div className="inline-flex items-center gap-2 text-xs font-urdu-ui font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      <span>بالکل درست! {ayah.translationUr}</span>
                    </div>
                  )}

                  {checkResult === 'retry' && (
                    <div className="inline-flex items-center gap-2 text-xs font-urdu-ui font-semibold text-rose-800">
                      <XCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />
                      <span>ترتیب پر دوبارہ غور کریں اور کوشش کریں۔</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
