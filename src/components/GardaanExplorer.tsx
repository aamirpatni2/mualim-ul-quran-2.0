import { useState } from 'react';
import { CheckCircle2, RefreshCw, Volume2, XCircle } from 'lucide-react';
import { GARDAAN_VERBS, GardaanTenseId, TENSE_LABELS } from '../data/gardaanData';
import { LanguageMode } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';

export function GardaanExplorer({ languageMode }: { languageMode: LanguageMode }) {
  const [verbId, setVerbId] = useState(GARDAAN_VERBS[1].id); // Default to ن-ص-ر
  const [tenseId, setTenseId] = useState<GardaanTenseId>('mazi_maroof');
  const [viewMode, setViewMode] = useState<'kabeer' | 'sagheer' | 'drill'>('kabeer');
  const [drillIdx, setDrillIdx] = useState(2);
  const [selectedGuess, setSelectedGuess] = useState<number | null>(null);

  const verb = GARDAAN_VERBS.find((v) => v.id === verbId) ?? GARDAAN_VERBS[0];
  const seeghahs = verb.tenses[tenseId];
  const activeTenseMeta = TENSE_LABELS.find((t) => t.id === tenseId) ?? TENSE_LABELS[0];

  const groups: ('غائب' | 'حاضر' | 'متکلم')[] = ['غائب', 'حاضر', 'متکلم'];

  // Drill state helpers
  const targetSeeghah = seeghahs[drillIdx % seeghahs.length];
  const drillChoices = (() => {
    const indices = new Set<number>([drillIdx % seeghahs.length]);
    let offset = 1;
    while (indices.size < Math.min(4, seeghahs.length)) {
      indices.add((drillIdx + offset * 2) % seeghahs.length);
      offset++;
    }
    return Array.from(indices).sort((a, b) => a - b);
  })();

  const handleNextDrill = () => {
    setSelectedGuess(null);
    setDrillIdx((prev) => (prev + 3) % seeghahs.length);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5" dir="rtl">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-urdu text-xl font-bold text-slate-900">
            مکمل گردان لیب (Complete Verb Gardaan Trainer)
          </h3>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500 font-sans" dir="ltr">
              Explore all 14 Seeghahs across Active/Passive Past, Present, Imperative & Prohibitive
            </p>
          )}
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
          <button
            type="button"
            onClick={() => setViewMode('kabeer')}
            className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'kabeer' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            گردانِ کبیر ({seeghahs.length} صیغے)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sagheer')}
            className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'sagheer' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            گردانِ صغیر
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('drill');
              setSelectedGuess(null);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
              viewMode === 'drill' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            صیغہ پہچان مشق
          </button>
        </div>
      </div>

      {/* Verb Root Picker */}
      <div className="space-y-2">
        <div className="font-urdu-ui text-xs font-semibold text-slate-600">۱۔ فعل / مادہ منتخب کریں</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {GARDAAN_VERBS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setVerbId(v.id);
                setSelectedGuess(null);
                speakArabic(v.sagheer.mazi);
              }}
              className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                v.id === verb.id
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="font-arabic text-xl font-bold">{v.sagheer.mazi}</div>
              <div className="font-urdu-ui text-[11px] text-slate-600">{v.baseMeaningUr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tense Picker (for Kabeer and Drill modes) */}
      {viewMode !== 'sagheer' && (
        <div className="space-y-2">
          <div className="font-urdu-ui text-xs font-semibold text-slate-600">۲۔ زمانہ / گردان منتخب کریں</div>
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl">
            {TENSE_LABELS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTenseId(t.id);
                  setSelectedGuess(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  tenseId === t.id
                    ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.labelUr}
                {languageMode === 'bilingual' && (
                  <span className="font-sans opacity-65 mr-1">({t.labelEn})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 1: Complete 14-Seeghah Gardaan Table */}
      {viewMode === 'kabeer' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-urdu-ui text-slate-500">
            <span>
              {verb.babNameUr} · مادہ ({verb.rootLetters}) · {activeTenseMeta.labelUr}
            </span>
            <span>کسی بھی صیغے پر کلک کر کے تلفظ سنیں</span>
          </div>

          {groups.map((grp) => {
            const grpItems = seeghahs.filter((s) => s.groupUr === grp);
            if (grpItems.length === 0) return null;

            return (
              <div key={grp} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-urdu-ui text-xs font-bold text-slate-800">
                    صیغہ ہائے {grp} ({grp === 'غائب' ? '3rd Person' : grp === 'حاضر' ? '2nd Person' : '1st Person'})
                  </span>
                  <span className="font-mono-tabular text-[11px] text-slate-500">{grpItems.length} صیغے</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {grpItems.map((item) => (
                    <div
                      key={item.index}
                      onClick={() => speakArabic(item.arabic)}
                      className="px-4 py-3 grid grid-cols-12 items-center gap-3 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                    >
                      <div className="col-span-1 font-mono-tabular text-xs text-slate-400">
                        {String(item.index).padStart(2, '0')}
                      </div>
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                        <span className="font-arabic text-2xl sm:text-3xl text-slate-900">{item.arabic}</span>
                      </div>
                      <div className="col-span-6 sm:col-span-3 space-y-0.5">
                        <div className="font-urdu-ui text-xs font-semibold text-slate-800">{item.seeghahUr}</div>
                        <div className="font-mono-tabular text-[11px] text-emerald-700">علامت: {item.marker}</div>
                      </div>
                      <div className="col-span-12 sm:col-span-4 flex items-center justify-between gap-2">
                        <span className="font-urdu text-base text-emerald-950 font-semibold">{item.urduMeaning}</span>
                        {languageMode === 'bilingual' && (
                          <span className="text-[11px] text-slate-400 font-sans hidden md:inline" dir="ltr">
                            {item.seeghahEn}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 2: Gardaan-e-Sagheer (Summary) */}
      {viewMode === 'sagheer' && (
        <div className="space-y-4">
          <div className="font-urdu-ui text-xs text-slate-600">
            گردانِ صغیر کسی بھی فعل کا خلاصہ ہے جس سے ماضی، مضارع، مصدر، فاعل، مفعول، امر اور نہی ایک نظر میں یاد ہو جاتے ہیں:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { title: 'ماضی', ar: verb.sagheer.mazi, note: 'کام ہو گیا' },
              { title: 'مضارع', ar: verb.sagheer.muzari, note: 'کرتا ہے / کرے گا' },
              { title: 'مصدر', ar: verb.sagheer.masdar, note: 'کام کا نام' },
              { title: 'اسمِ فاعل', ar: verb.sagheer.faail, note: 'کرنے والا' },
              { title: 'اسمِ مفعول', ar: verb.sagheer.mafool, note: 'جس پر کام ہو' },
              { title: 'فعلِ امر', ar: verb.sagheer.amr, note: 'حکم (کرو)' },
              { title: 'فعلِ نہی', ar: verb.sagheer.nahi, note: 'منع (مت کرو)' },
            ].map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => speakArabic(card.ar)}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-500 text-center space-y-2 cursor-pointer transition-colors"
              >
                <div className="font-urdu-ui text-xs font-bold text-emerald-800">{card.title}</div>
                <div className="font-arabic text-2xl sm:text-3xl text-slate-900">{card.ar}</div>
                <div className="font-urdu-ui text-[11px] text-slate-500">{card.note}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: Interactive Seeghah Recognition Drill */}
      {viewMode === 'drill' && targetSeeghah && (
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-urdu-ui text-xs font-semibold text-slate-600">
              صیغہ پہچانیں ({activeTenseMeta.labelUr})
            </span>
            <button
              type="button"
              onClick={handleNextDrill}
              className="inline-flex items-center gap-1.5 text-xs font-urdu-ui text-emerald-800 hover:underline cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>اگلا سوال</span>
            </button>
          </div>

          <div className="text-center py-4 space-y-2 bg-white rounded-xl border border-slate-200">
            <div className="font-arabic text-5xl text-slate-900">{targetSeeghah.arabic}</div>
            <button
              type="button"
              onClick={() => speakArabic(targetSeeghah.arabic)}
              className="inline-flex items-center gap-1 text-xs font-urdu-ui text-emerald-700 hover:underline cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>آواز سنیں</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {drillChoices.map((idx) => {
              const opt = seeghahs[idx];
              const isSelected = selectedGuess === idx;
              const isCorrect = idx === drillIdx % seeghahs.length;

              let btnClass = 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
              if (selectedGuess !== null) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-50 border-rose-500 text-rose-900';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedGuess !== null}
                  onClick={() => setSelectedGuess(idx)}
                  className={`p-3.5 rounded-xl border text-right transition-colors cursor-pointer disabled:cursor-default space-y-1 ${btnClass}`}
                >
                  <div className="font-urdu-ui text-xs font-bold">{opt.seeghahUr}</div>
                  <div className="font-urdu text-sm text-slate-600">{opt.urduMeaning}</div>
                </button>
              );
            })}
          </div>

          {selectedGuess !== null && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div
                className={`inline-flex items-center gap-2 text-xs font-urdu-ui font-semibold ${
                  selectedGuess === drillIdx % seeghahs.length ? 'text-emerald-800' : 'text-rose-800'
                }`}
              >
                {selectedGuess === drillIdx % seeghahs.length ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    <span>بالکل درست! علامت ({targetSeeghah.marker}) — {targetSeeghah.urduMeaning}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />
                    <span>
                      درست جواب: {targetSeeghah.seeghahUr} ({targetSeeghah.urduMeaning})
                    </span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleNextDrill}
                className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 cursor-pointer"
              >
                اگلا صیغہ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
