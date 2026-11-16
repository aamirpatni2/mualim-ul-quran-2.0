import { useState } from 'react';
import { LanguageMode } from '../types/quranic';
import { GardaanExplorer } from './GardaanExplorer';
import {
  DerivedFormsTransformer,
  HarakaatExplorer,
  IdaafahPhraseBuilder,
  IraabCaseSimulator,
  PronounCombiner,
  VerbConjugationExplorer,
} from './InteractiveGrammarWidgets';

type SandboxTool = 'gardaan' | 'iraab' | 'pronouns' | 'idaafah' | 'verbs' | 'derived' | 'harakaat';

export function GrammarSandboxView({ languageMode }: { languageMode: LanguageMode }) {
  const [activeTool, setActiveTool] = useState<SandboxTool>('gardaan');

  const tools: { id: SandboxTool; labelUr: string; labelEn: string }[] = [
    { id: 'gardaan', labelUr: 'مکمل گردان (14 صیغے)', labelEn: 'Full Gardaan' },
    { id: 'iraab', labelUr: 'اعراب و عدد', labelEn: 'Cases & Number' },
    { id: 'pronouns', labelUr: 'ضمائر و حروف', labelEn: 'Pronouns' },
    { id: 'idaafah', labelUr: 'مرکبِ اضافی و توصیفی', labelEn: 'Phrases' },
    { id: 'verbs', labelUr: 'فعل ماضی و مضارع', labelEn: 'Verb Tense' },
    { id: 'derived', labelUr: 'مزید فیہ ابواب', labelEn: 'Derived Forms' },
    { id: 'harakaat', labelUr: 'حرکات کا اثر', labelEn: 'Harakaat' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="font-urdu text-2xl sm:text-3xl font-bold text-slate-900">
            گردان، نحو و صرف اسٹوڈیو (Gardaan & Grammar Studio)
          </h1>
          <p className="font-urdu-ui text-sm text-slate-600">
            مکمل ۱۴ صیغوں کی گردانِ کبیر و صغیر کی مشق کریں اور دیکھیں کہ اعراب، ضمائر اور ابواب کس طرح معنی بدلتے ہیں۔
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-urdu-ui font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTool === tool.id
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tool.labelUr}
              {languageMode === 'bilingual' && (
                <span className="font-sans opacity-65 mr-1.5">({tool.labelEn})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTool === 'gardaan' && <GardaanExplorer languageMode={languageMode} />}
      {activeTool === 'iraab' && <IraabCaseSimulator languageMode={languageMode} />}
      {activeTool === 'pronouns' && <PronounCombiner languageMode={languageMode} />}
      {activeTool === 'idaafah' && <IdaafahPhraseBuilder languageMode={languageMode} />}
      {activeTool === 'verbs' && (
        <div className="space-y-6">
          <VerbConjugationExplorer mode="past" languageMode={languageMode} />
          <VerbConjugationExplorer mode="present" languageMode={languageMode} />
        </div>
      )}
      {activeTool === 'derived' && <DerivedFormsTransformer languageMode={languageMode} />}
      {activeTool === 'harakaat' && <HarakaatExplorer languageMode={languageMode} />}
    </div>
  );
}
