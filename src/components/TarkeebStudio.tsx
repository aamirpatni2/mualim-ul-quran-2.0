import { useEffect, useState } from 'react';
import { CheckCircle2, GitMerge, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { AYAH_TARKEEB_LIST, AyahTarkeeb } from '../data/tarkeebData';
import { LanguageMode } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { WordTypeLabel } from './WordTypeLabel';

export function TarkeebStudio({ languageMode }: { languageMode: LanguageMode }) {
  const [selectedAyahId, setSelectedAyahId] = useState(AYAH_TARKEEB_LIST[0].id);
  const [mode, setMode] = useState<'learn' | 'practice'>('learn');
  const [activeSegId, setActiveSegId] = useState<string>(AYAH_TARKEEB_LIST[0].segments[0].id);
  const [userRoles, setUserRoles] = useState<Record<string, string>>({});
  const [practiceChecked, setPracticeChecked] = useState(false);

  const ayah: AyahTarkeeb =
    AYAH_TARKEEB_LIST.find((a) => a.id === selectedAyahId) ?? AYAH_TARKEEB_LIST[0];
  const activeSegment =
    ayah.segments.find((s) => s.id === activeSegId) ?? ayah.segments[0];

  useEffect(() => {
    setActiveSegId(ayah.segments[0].id);
    setUserRoles({});
    setPracticeChecked(false);
  }, [ayah]);

  const correctCount = ayah.segments.filter((s) => userRoles[s.id] === s.roleUr).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6" dir="rtl">
      {/* Header & Mode Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-800">
            <GitMerge className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="font-urdu-ui text-xs font-bold">قرآنی آیات کی ترکیبِ نحوی</span>
          </div>
          <h3 className="font-urdu text-xl sm:text-2xl font-bold text-slate-900">
            ترکیبِ نحوی اسٹوڈیو (Ayah Tarkeeb Workshop)
          </h3>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500 font-sans" dir="ltr">
              Understand how each word connects grammatically (Mubtada/Khabar, Fi’l/Fa’il/Maf’ool, Mudaf/Ilayhi)
            </p>
          )}
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
          <button
            type="button"
            onClick={() => setMode('learn')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
              mode === 'learn' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            ترکیب سیکھیں
          </button>
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-urdu-ui font-medium cursor-pointer whitespace-nowrap shrink-0 ${
              mode === 'practice' ? 'bg-white text-emerald-800 shadow-sm font-semibold' : 'text-slate-600'
            }`}
          >
            خود ترکیب کریں
          </button>
        </div>
      </div>

      {/* Ayah Selector */}
      <div className="flex flex-wrap gap-2">
        {AYAH_TARKEEB_LIST.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedAyahId(item.id)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-urdu-ui transition-colors cursor-pointer ${
              item.id === ayah.id
                ? 'bg-emerald-700 border-emerald-700 text-white font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {item.surahRefUr}
          </button>
        ))}
      </div>

      {/* Selected Ayah Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-urdu-ui">
          <span>
            {ayah.surahRefUr} · قسمِ جملہ: <strong className="text-emerald-800">{ayah.sentenceTypeUr}</strong>
          </span>
          <button
            type="button"
            onClick={() => speakArabic(ayah.arabicFull)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>آیت سنیں</span>
          </button>
        </div>
        <div className="font-arabic text-3xl sm:text-4xl text-slate-900 leading-loose">{ayah.arabicFull}</div>
        <div className="font-urdu text-lg text-slate-700">{ayah.translationUr}</div>
      </div>

      {mode === 'learn' ? (
        <div className="space-y-6">
          {/* Interactive Segment Cards */}
          <div className="space-y-2">
            <div className="font-urdu-ui text-xs text-slate-500">
              ہر حصے پر کلک کر کے اس کا نحوی منصب اور اعراب کی وجہ دیکھیں:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ayah.segments.map((seg) => {
                const isActive = seg.id === activeSegment.id;
                return (
                  <button
                    key={seg.id}
                    type="button"
                    onClick={() => {
                      setActiveSegId(seg.id);
                      speakArabic(seg.arabic);
                    }}
                    className={`p-4 rounded-xl border text-right transition-colors cursor-pointer space-y-2 ${
                      isActive
                        ? 'bg-emerald-50/70 border-emerald-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <WordTypeLabel type={seg.type} languageMode={languageMode} compact />
                    </div>
                    <div className="font-arabic text-3xl text-slate-900">{seg.arabic}</div>
                    <div className="font-urdu-ui text-xs font-bold text-emerald-900">{seg.roleUr}</div>
                    <div className="font-urdu-ui text-xs text-slate-500">{seg.urduWord}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Segment Case-Reason Callout */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-4 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-urdu-ui text-xs font-bold text-emerald-900">
                "{activeSegment.arabic}" کی ترکیب اور اعراب کی وجہ ({activeSegment.roleUr})
              </span>
              {languageMode === 'bilingual' && (
                <span className="text-xs text-slate-500 font-sans" dir="ltr">
                  {activeSegment.roleEn}
                </span>
              )}
            </div>
            <p className="font-urdu-ui text-sm text-slate-700 leading-relaxed">{activeSegment.caseReasonUr}</p>
          </div>

          {/* Step-by-Step Tarkeeb Tree Chain */}
          <div className="space-y-3">
            <h4 className="font-urdu-ui text-sm font-bold text-slate-800">
              مرحلہ وار ترکیبِ نحوی (Step-by-Step Tarkeeb Chain)
            </h4>
            <div className="space-y-3">
              {ayah.tarkeebSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-urdu-ui text-xs font-bold text-emerald-800">
                      مرحلہ {step.stepNumber}
                    </span>
                    <span className="font-urdu-ui text-xs font-semibold text-slate-700">
                      نتیجہ: {step.resultLabelUr}
                    </span>
                  </div>
                  <div className="font-urdu-ui text-sm sm:text-base font-bold text-slate-900">
                    {step.formulaUr}
                  </div>
                  <p className="font-urdu-ui text-xs text-slate-600 leading-relaxed">{step.explanationUr}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Interactive Tarkeeb Practice */
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-urdu-ui text-xs text-slate-600">
              ہر لفظ کے لیے درست نحوی کردار (Role) منتخب کریں اور پھر چیک کریں:
            </div>
            {Object.keys(userRoles).length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setUserRoles({});
                  setPracticeChecked(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-urdu-ui text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>دوبارہ شروع کریں</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ayah.segments.map((seg) => {
              const chosen = userRoles[seg.id];
              const isCorrect = chosen === seg.roleUr;

              return (
                <div key={seg.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-arabic text-3xl text-slate-900">{seg.arabic}</span>
                    <span className="font-urdu-ui text-xs text-slate-500">{seg.urduWord}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {ayah.roleChoicesUr.map((role) => {
                      const isPicked = chosen === role;
                      let cls = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                      if (practiceChecked) {
                        if (role === seg.roleUr) {
                          cls = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-semibold';
                        } else if (isPicked && role !== seg.roleUr) {
                          cls = 'bg-rose-50 border-rose-500 text-rose-900';
                        }
                      } else if (isPicked) {
                        cls = 'bg-emerald-700 border-emerald-700 text-white font-semibold';
                      }

                      return (
                        <button
                          key={role}
                          type="button"
                          disabled={practiceChecked}
                          onClick={() => setUserRoles((prev) => ({ ...prev, [seg.id]: role }))}
                          className={`px-3 py-2 rounded-lg border text-xs font-urdu-ui text-right transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>

                  {practiceChecked && (
                    <div
                      className={`flex items-start gap-2 text-xs font-urdu-ui ${
                        isCorrect ? 'text-emerald-800' : 'text-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" aria-hidden="true" />
                      )}
                      <span>{seg.caseReasonUr}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={Object.keys(userRoles).length < ayah.segments.length}
              onClick={() => setPracticeChecked(true)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ترکیب چیک کریں
            </button>

            {practiceChecked && (
              <span className="font-urdu-ui text-sm font-bold text-emerald-900">
                نتیجہ: {correctCount} از {ayah.segments.length} درست
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
