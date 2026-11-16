import { useState } from 'react';
import { CheckCircle2, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { InteractiveClassifierItem, LanguageMode, WordType } from '../types/quranic';
import { speakArabic } from '../utils/arabicAudio';
import { WordTypeLabel } from './WordTypeLabel';

/* 1. Harakaat Interactive Sound & Meaning Explorer */
export function HarakaatExplorer({ languageMode }: { languageMode: LanguageMode }) {
  const presets = [
    {
      id: 'alima',
      arabic: 'عَلِمَ',
      marks: 'زبر + زیر + زبر',
      translit: 'Alima',
      meaningUr: 'اس نے جانا (فعل ماضی معروف)',
      meaningEn: 'He knew (Active past verb)',
      noteUr: 'عین پر زبر اور لام کے نیچے زیر سے کام کرنے والے کا ذکر ہے۔',
    },
    {
      id: 'ulima',
      arabic: 'عُلِمَ',
      marks: 'پیش + زیر + زبر',
      translit: 'Ulima',
      meaningUr: 'وہ جانا گیا (فعل ماضی مجہول)',
      meaningEn: 'It was known (Passive verb)',
      noteUr: 'صرف پہلے حرف پر پیش آنے سے جملہ Passive بن گیا۔',
    },
    {
      id: 'allama',
      arabic: 'عَلَّمَ',
      marks: 'زبر + تشدید زبر + زبر',
      translit: 'Allama',
      meaningUr: 'اس نے سکھایا (باب تفعیل)',
      meaningEn: 'He taught (Causative Form II)',
      noteUr: 'لام پر تشدید لگانے سے معنی "جاننا" سے بدل کر "دوسرے کو سکھانا" ہو گیا۔',
    },
    {
      id: 'ilmun',
      arabic: 'عِلْمٌ',
      marks: 'زیر + جزم + تنوین پیش',
      translit: 'Ilmun',
      meaningUr: 'علم / واقفیت (اسم نکرہ)',
      meaningEn: 'Knowledge (Noun)',
      noteUr: 'آخر میں دو پیش (تنوین) بتاتے ہیں کہ یہ فعل نہیں بلکہ اسم ہے۔',
    },
    {
      id: 'aalimun',
      arabic: 'عَالِمٌ',
      marks: 'الف مدہ + زیر + تنوین پیش',
      translit: 'Aalimun',
      meaningUr: 'جاننے والا (اسم فاعل)',
      meaningEn: 'Scholar / Knower',
      noteUr: 'پہلے حرف کے بعد الف لگانے سے "جاننے والا" بن گیا۔',
    },
  ];

  const [selectedId, setSelectedId] = useState(presets[0].id);
  const current = presets.find((p) => p.id === selectedId) ?? presets[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            حرکات کا زندہ تجربہ — ایک ہی مادہ (ع - ل - م)
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">Click any vowel combination to hear and see how meaning shifts</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => speakArabic(current.arabic)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-urdu-ui">تلفظ سنیں</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2" dir="rtl">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setSelectedId(preset.id);
              speakArabic(preset.arabic);
            }}
            className={`px-4 py-2.5 rounded-lg border text-lg font-arabic transition-colors cursor-pointer ${
              selectedId === preset.id
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            {preset.arabic}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" dir="rtl">
        <div className="bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center text-center border border-slate-100">
          <div className="font-arabic text-5xl text-slate-900 mb-2">{current.arabic}</div>
          <div className="text-xs text-slate-500 font-sans" dir="ltr">
            {current.translit}
          </div>
          <div className="font-urdu-ui text-xs text-emerald-700 font-medium mt-1">{current.marks}</div>
        </div>
        <div className="flex flex-col justify-center space-y-2 text-right">
          <div className="font-urdu text-lg text-slate-900 font-semibold">{current.meaningUr}</div>
          {languageMode === 'bilingual' && (
            <div className="text-xs text-slate-500 font-sans text-left" dir="ltr">
              {current.meaningEn}
            </div>
          )}
          <p className="font-urdu-ui text-sm text-slate-600 leading-relaxed">{current.noteUr}</p>
        </div>
      </div>
    </div>
  );
}

/* 2. Interactive Ism / Fi'l / Harf Classifier */
export function WordClassifierGame({
  items,
  languageMode,
}: {
  items: InteractiveClassifierItem[];
  languageMode: LanguageMode;
}) {
  const [answers, setAnswers] = useState<Record<number, WordType>>({});

  const score = items.filter((item, idx) => answers[idx] === item.correctType).length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            عملی مشق: ہر قرآنی لفظ کو پہچانیں (اِسم، فِعل یا حَرف)
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">Select Ism, Fi’l, or Harf for each word below</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono-tabular text-xs font-semibold text-slate-700">
            {score} / {items.length}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={() => setAnswers({})}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>دوبارہ</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir="rtl">
        {items.map((item, idx) => {
          const chosen = answers[idx];
          const isCorrect = chosen === item.correctType;
          return (
            <div key={item.word} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakArabic(item.word)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    aria-label={`Listen to ${item.transliteration}`}
                  >
                    <Volume2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span className="font-arabic text-2xl text-slate-900">{item.word}</span>
                </div>
                <span className="font-urdu-ui text-xs text-slate-600">{item.meaningUr}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(['ism', 'fil', 'harf'] as WordType[]).map((type) => {
                  const label = type === 'ism' ? 'اِسم' : type === 'fil' ? 'فِعل' : 'حَرف';
                  const active = chosen === type;
                  let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                  if (active) {
                    btnStyle = isCorrect
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'bg-rose-700 border-rose-700 text-white';
                  }
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [idx]: type }))}
                      className={`py-2 px-2 rounded-md border text-xs font-urdu-ui font-semibold transition-colors cursor-pointer ${btnStyle}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {chosen && (
                <div
                  className={`flex items-start gap-2 text-xs font-urdu-ui pt-1 ${
                    isCorrect ? 'text-emerald-800' : 'text-rose-800'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-700" aria-hidden="true" />
                  )}
                  <span>{item.explanationUr}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 3. Interactive I'raab (Case, Number, Definiteness) Simulator */
export function IraabCaseSimulator({ languageMode }: { languageMode: LanguageMode }) {
  const [gramCase, setGramCase] = useState<'raf' | 'nasb' | 'jarr'>('raf');
  const [number, setNumber] = useState<'singular' | 'dual' | 'plural'>('singular');
  const [definite, setDefinite] = useState<boolean>(false);

  const matrix = {
    singular: {
      raf: { indef: 'مُسْلِمٌ', def: 'الْمُسْلِمُ', urRole: 'فاعل (نے) — ایک مسلمان', enRole: 'Nominative (Subject)' },
      nasb: { indef: 'مُسْلِماً', def: 'الْمُسْلِمَ', urRole: 'مفعول (کو) — ایک مسلمان کو', enRole: 'Accusative (Object)' },
      jarr: { indef: 'مُسْلِمٍ', def: 'الْمُسْلِمِ', urRole: 'اضافت / جار (کا، کے لیے) — مسلمان کا', enRole: 'Genitive (Possessive / After Harf Jarr)' },
    },
    dual: {
      raf: { indef: 'مُسْلِمَانِ', def: 'الْمُسْلِمَانِ', urRole: 'فاعل (نے) — دو مسلمان', enRole: 'Nominative Dual' },
      nasb: { indef: 'مُسْلِمَيْنِ', def: 'الْمُسْلِمَيْنِ', urRole: 'مفعول (کو) — دو مسلمانوں کو', enRole: 'Accusative Dual' },
      jarr: { indef: 'مُسْلِمَيْنِ', def: 'الْمُسْلِمَيْنِ', urRole: 'اضافت / جار — دو مسلمانوں کا', enRole: 'Genitive Dual' },
    },
    plural: {
      raf: { indef: 'مُسْلِمُوْنَ', def: 'الْمُسْلِمُوْنَ', urRole: 'فاعل (نے) — سب مسلمان', enRole: 'Nominative Plural' },
      nasb: { indef: 'مُسْلِمِيْنَ', def: 'الْمُسْلِمِيْنَ', urRole: 'مفعول (کو) — سب مسلمانوں کو', enRole: 'Accusative Plural' },
      jarr: { indef: 'مُسْلِمِيْنَ', def: 'الْمُسْلِمِيْنَ', urRole: 'اضافت / جار — سب مسلمانوں کا', enRole: 'Genitive Plural' },
    },
  };

  const result = matrix[number][gramCase];
  const arabicOut = definite ? result.def : result.indef;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            اِعراب اور عدد سیمولیٹر (I’raab & Number Builder)
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">Toggle Case, Number, and Definiteness to watch the ending transform</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => speakArabic(arabicOut)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-urdu-ui">سنیں</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <div className="font-urdu-ui text-xs font-semibold text-slate-600">حالتِ اعراب (Case)</div>
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
            {[
              { id: 'raf', label: 'رفع (پیش)' },
              { id: 'nasb', label: 'نصب (زبر)' },
              { id: 'jarr', label: 'جر (زیر)' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setGramCase(c.id as 'raf' | 'nasb' | 'jarr')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer ${
                  gramCase === c.id ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="font-urdu-ui text-xs font-semibold text-slate-600">عدد (Number)</div>
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
            {[
              { id: 'singular', label: 'واحد (1)' },
              { id: 'dual', label: 'تثنیہ (2)' },
              { id: 'plural', label: 'جمع (3+)' },
            ].map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setNumber(n.id as 'singular' | 'dual' | 'plural')}
                className={`flex-1 py-1.5 px-2 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer ${
                  number === n.id ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="font-urdu-ui text-xs font-semibold text-slate-600">وسعت (Definiteness)</div>
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => setDefinite(false)}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer ${
                !definite ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              نکرہ (بغیر ال)
            </button>
            <button
              type="button"
              onClick={() => setDefinite(true)}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-urdu-ui font-medium transition-colors cursor-pointer ${
                definite ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              معرفہ (ال)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4" dir="rtl">
        <div className="text-center md:text-right">
          <div className="font-arabic text-5xl text-slate-900">{arabicOut}</div>
        </div>
        <div className="text-center md:text-right space-y-1">
          <div className="font-urdu text-lg text-emerald-900 font-semibold">
            {definite ? 'وہ خاص ' : 'کوئی '}
            {result.urRole}
          </div>
          {languageMode === 'bilingual' && (
            <div className="text-xs text-slate-500 font-sans" dir="ltr">
              {result.enRole} · {definite ? 'Definite (with Al-)' : 'Indefinite'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 4. Attached Pronoun & Preposition Combiner */
export function PronounCombiner({ languageMode }: { languageMode: LanguageMode }) {
  const bases = [
    { id: 'rabb', label: 'رَبُّ', meaningUr: 'رب', type: 'noun' },
    { id: 'kitab', label: 'كِتَابُ', meaningUr: 'کتاب', type: 'noun' },
    { id: 'li', label: 'لَـ / لِـ', meaningUr: 'کے لیے', type: 'prep' },
    { id: 'ala', label: 'عَلٰى', meaningUr: 'پر', type: 'prep' },
    { id: 'fee', label: 'فِيْ', meaningUr: 'میں', type: 'prep' },
    { id: 'min', label: 'مِنْ', meaningUr: 'سے / میں سے', type: 'prep' },
  ];

  const pronouns = [
    { id: 'hu', suffix: 'ـهٗ', personUr: 'اس ایک مرد کا / اس', en: 'His / Him' },
    { id: 'hum', suffix: 'ـهُمْ', personUr: 'ان سب کا / ان', en: 'Their / Them' },
    { id: 'ka', suffix: 'ـكَ', personUr: 'تیرے / آپ کا', en: 'Your (sg.)' },
    { id: 'kum', suffix: 'ـكُمْ', personUr: 'تم سب کا / تم', en: 'Your (pl.)' },
    { id: 'naa', suffix: 'ـنَا', personUr: 'ہمارا / ہم', en: 'Our / Us' },
    { id: 'ee', suffix: 'ـيْ', personUr: 'میرا / مجھ', en: 'My / Me' },
  ];

  const [baseId, setBaseId] = useState('rabb');
  const [pronId, setPronId] = useState('kum');

  const combinations: Record<string, Record<string, { ar: string; ur: string }>> = {
    rabb: {
      hu: { ar: 'رَبُّهٗ', ur: 'اس کا رب' },
      hum: { ar: 'رَبُّهُمْ', ur: 'ان سب کا رب' },
      ka: { ar: 'رَبُّكَ', ur: 'آپ کا / تیرا رب' },
      kum: { ar: 'رَبُّكُمْ', ur: 'تم سب کا رب' },
      naa: { ar: 'رَبُّنَا', ur: 'ہمارا رب' },
      ee: { ar: 'رَبِّيْ', ur: 'میرا رب' },
    },
    kitab: {
      hu: { ar: 'كِتَابُهٗ', ur: 'اس کی کتاب' },
      hum: { ar: 'كِتَابُهُمْ', ur: 'ان سب کی کتاب' },
      ka: { ar: 'كِتَابُكَ', ur: 'آپ کی کتاب' },
      kum: { ar: 'كِتَابُكُمْ', ur: 'تمہاری کتاب' },
      naa: { ar: 'كِتَابُنَا', ur: 'ہماری کتاب' },
      ee: { ar: 'كِتَابِيْ', ur: 'میری کتاب' },
    },
    li: {
      hu: { ar: 'لَهٗ', ur: 'اس کے لیے' },
      hum: { ar: 'لَهُمْ', ur: 'ان سب کے لیے' },
      ka: { ar: 'لَكَ', ur: 'تیرے / آپ کے لیے' },
      kum: { ar: 'لَكُمْ', ur: 'تمہارے لیے' },
      naa: { ar: 'لَنَا', ur: 'ہمارے لیے' },
      ee: { ar: 'لِيْ', ur: 'میرے لیے' },
    },
    ala: {
      hu: { ar: 'عَلَيْهِ', ur: 'اس پر' },
      hum: { ar: 'عَلَيْهِمْ', ur: 'ان سب پر' },
      ka: { ar: 'عَلَيْكَ', ur: 'آپ پر' },
      kum: { ar: 'عَلَيْكُمْ', ur: 'تم پر' },
      naa: { ar: 'عَلَيْنَا', ur: 'ہم پر' },
      ee: { ar: 'عَلَيَّ', ur: 'مجھ پر' },
    },
    fee: {
      hu: { ar: 'فِيْهِ', ur: 'اس میں' },
      hum: { ar: 'فِيْهِمْ', ur: 'ان میں' },
      ka: { ar: 'فِيْكَ', ur: 'تجھ میں' },
      kum: { ar: 'فِيْكُمْ', ur: 'تم میں' },
      naa: { ar: 'فِيْنَا', ur: 'ہم میں' },
      ee: { ar: 'فِيَّ', ur: 'مجھ میں' },
    },
    min: {
      hu: { ar: 'مِنْهُ', ur: 'اس سے / اس میں سے' },
      hum: { ar: 'مِنْهُمْ', ur: 'ان میں سے' },
      ka: { ar: 'مِنْكَ', ur: 'آپ سے' },
      kum: { ar: 'مِنْكُمْ', ur: 'تم میں سے' },
      naa: { ar: 'مِنَّا', ur: 'ہم سے' },
      ee: { ar: 'مِنِّيْ', ur: 'مجھ سے' },
    },
  };

  const combined = combinations[baseId][pronId];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            حروفِ جارہ اور ضمائر جوڑیں (Pronoun Combiner)
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">Pick a base word/preposition and attach any pronoun</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => speakArabic(combined.ar)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-urdu-ui">سنیں</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
        <div className="space-y-2">
          <div className="font-urdu-ui text-xs font-semibold text-slate-600">۱۔ اسم یا حرفِ جار چنیں</div>
          <div className="grid grid-cols-3 gap-2">
            {bases.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBaseId(b.id)}
                className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                  baseId === b.id
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-arabic text-xl">{b.label}</div>
                <div className="font-urdu-ui text-[11px] text-slate-500">{b.meaningUr}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-urdu-ui text-xs font-semibold text-slate-600">۲۔ متصل ضمیر چنیں</div>
          <div className="grid grid-cols-3 gap-2">
            {pronouns.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPronId(p.id)}
                className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                  pronId === p.id
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-arabic text-xl">{p.suffix}</div>
                <div className="font-urdu-ui text-[11px] text-slate-500">{p.personUr}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4" dir="rtl">
        <div className="font-arabic text-4xl text-slate-900">{combined.ar}</div>
        <div className="font-urdu text-xl text-emerald-900 font-semibold">{combined.ur}</div>
      </div>
    </div>
  );
}

/* 5. Idaafah & Phrase Builder */
export function IdaafahPhraseBuilder({ languageMode }: { languageMode: LanguageMode }) {
  const examples = [
    {
      id: 'bayt',
      part1Ar: 'بَيْتُ',
      part2Ar: 'اللّٰهِ',
      part1Ur: 'گھر',
      part2Ur: 'اللہ',
      fullUr: 'اللہ کا گھر',
      type: 'مرکبِ اضافی (مضاف + مضاف الیہ)',
      noteUr: 'عربی میں چیز (بیتُ) پہلے اور مالک (اللہِ، زیر کے ساتھ) بعد میں آتا ہے؛ اردو میں "اللہ کا گھر" الٹا پڑھا جاتا ہے۔',
    },
    {
      id: 'yawm',
      part1Ar: 'يَوْمِ',
      part2Ar: 'الدِّيْنِ',
      part1Ur: 'دن',
      part2Ur: 'بدلہ',
      fullUr: 'بدلے کا دن',
      type: 'مرکبِ اضافی (مضاف + مضاف الیہ)',
      noteUr: 'يَوْمِ پر نہ ال ہے نہ تنوین، اور الدِّيْنِ کے آخر میں زیر (حالتِ جر) ہے۔',
    },
    {
      id: 'sirat',
      part1Ar: 'الصِّرَاطَ',
      part2Ar: 'الْمُسْتَقِيْمَ',
      part1Ur: 'راستہ',
      part2Ur: 'سیدھا',
      fullUr: 'سیدھا راستہ',
      type: 'مرکبِ توصیفی (موصوف + صفت)',
      noteUr: 'دونوں پر "ال" اور دونوں پر زبر ہے! اردو میں صفت "سیدھا" پہلے آتی ہے، عربی میں صفت "المستقیم" بعد میں۔',
    },
  ];

  const [selected, setSelected] = useState(examples[0].id);
  const current = examples.find((e) => e.id === selected) ?? examples[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            عربی بمقابلہ اردو ترتیب — مرکبات کا موازنہ
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">See how Arabic word order flips when translating into natural Urdu</p>
          )}
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {examples.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                setSelected(ex.id);
                speakArabic(`${ex.part1Ar} ${ex.part2Ar}`);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-arabic cursor-pointer transition-colors ${
                selected === ex.id ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'text-slate-600'
              }`}
            >
              {ex.part1Ar} {ex.part2Ar}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
        <div className="border border-slate-200 rounded-lg p-4 space-y-2 bg-slate-50/50">
          <div className="font-urdu-ui text-xs font-semibold text-slate-500">عربی ترتیب (دائیں سے بائیں)</div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-white border border-emerald-200 rounded-lg text-center">
              <div className="font-arabic text-2xl text-emerald-900">{current.part1Ar}</div>
              <div className="font-urdu-ui text-xs text-slate-500">۱۔ {current.part1Ur}</div>
            </div>
            <span className="text-slate-400">+</span>
            <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-center">
              <div className="font-arabic text-2xl text-slate-900">{current.part2Ar}</div>
              <div className="font-urdu-ui text-xs text-slate-500">۲۔ {current.part2Ur}</div>
            </div>
          </div>
        </div>

        <div className="border border-emerald-200 rounded-lg p-4 space-y-2 bg-emerald-50/30">
          <div className="font-urdu-ui text-xs font-semibold text-emerald-800">{current.type}</div>
          <div className="font-urdu text-2xl text-emerald-950 font-semibold">{current.fullUr}</div>
          <p className="font-urdu-ui text-xs text-slate-600 leading-relaxed">{current.noteUr}</p>
        </div>
      </div>
    </div>
  );
}

/* 6. Verb Conjugation Explorer (Past & Present) */
export function VerbConjugationExplorer({
  mode,
  languageMode,
}: {
  mode: 'past' | 'present';
  languageMode: LanguageMode;
}) {
  const pastForms = [
    { ar: 'كَتَبَ', suffix: 'ـَ', pronounUr: 'اس ایک مرد نے', meaningUr: 'اس نے لکھا', en: 'He wrote' },
    { ar: 'كَتَبُوْا', suffix: 'ـُوْا', pronounUr: 'ان سب مردوں نے', meaningUr: 'ان سب نے لکھا', en: 'They (m.) wrote' },
    { ar: 'كَتَبَتْ', suffix: 'ـَتْ', pronounUr: 'اس ایک عورت نے', meaningUr: 'اس عورت نے لکھا', en: 'She wrote' },
    { ar: 'كَتَبْتَ', suffix: 'ـْتَ', pronounUr: 'تُو ایک مرد نے', meaningUr: 'تُو نے لکھا', en: 'You (m. sg.) wrote' },
    { ar: 'كَتَبْتُمْ', suffix: 'ـْتُمْ', pronounUr: 'تم سب نے', meaningUr: 'تم سب نے لکھا', en: 'You (pl.) wrote' },
    { ar: 'كَتَبْتُ', suffix: 'ـْتُ', pronounUr: 'میں نے', meaningUr: 'میں نے لکھا', en: 'I wrote' },
    { ar: 'كَتَبْنَا', suffix: 'ـْنَا', pronounUr: 'ہم نے', meaningUr: 'ہم نے لکھا', en: 'We wrote' },
  ];

  const presentForms = [
    { ar: 'يَعْلَمُ', suffix: 'يَـ ... ـُ', pronounUr: 'وہ ایک مرد', meaningUr: 'وہ جانتا ہے / جانے گا', en: 'He knows' },
    { ar: 'يَعْلَمُوْنَ', suffix: 'يَـ ... ـُوْنَ', pronounUr: 'وہ سب مرد', meaningUr: 'وہ سب جانتے ہیں', en: 'They (m.) know' },
    { ar: 'تَعْلَمُ', suffix: 'تَـ ... ـُ', pronounUr: 'تُو / وہ عورت', meaningUr: 'تُو جانتا ہے', en: 'You / She knows' },
    { ar: 'تَعْلَمُوْنَ', suffix: 'تَـ ... ـُوْنَ', pronounUr: 'تم سب', meaningUr: 'تم سب جانتے ہو', en: 'You (pl.) know' },
    { ar: 'أَعْلَمُ', suffix: 'أَ ... ـُ', pronounUr: 'میں', meaningUr: 'میں جانتا ہوں', en: 'I know' },
    { ar: 'نَعْلَمُ', suffix: 'نَـ ... ـُ', pronounUr: 'ہم', meaningUr: 'ہم جانتے ہیں', en: 'We know' },
  ];

  const list = mode === 'past' ? pastForms : presentForms;
  const [activeIdx, setActiveIdx] = useState(0);
  const current = list[activeIdx];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            {mode === 'past' ? 'فعلِ ماضی کے صیغے (Past Conjugation)' : 'فعلِ مضارع کے صیغے (Present/Future Conjugation)'}
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">Click each form to hear pronunciation and see the subject marker</p>
          )}
        </div>
        <WordTypeLabel type="fil" languageMode={languageMode} compact />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" dir="rtl">
        {list.map((item, idx) => (
          <button
            key={item.ar}
            type="button"
            onClick={() => {
              setActiveIdx(idx);
              speakArabic(item.ar);
            }}
            className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
              activeIdx === idx
                ? 'bg-blue-50 border-blue-600 text-blue-950'
                : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <div className="font-arabic text-2xl">{item.ar}</div>
            <div className="font-urdu-ui text-[11px] text-slate-600 mt-1">{item.pronounUr}</div>
          </button>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3" dir="rtl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => speakArabic(current.ar)}
            className="p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 cursor-pointer"
            aria-label="Play Arabic audio"
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          </button>
          <div>
            <div className="font-arabic text-3xl text-slate-900">{current.ar}</div>
            <div className="font-urdu-ui text-xs text-blue-700">علامت: {current.suffix}</div>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <div className="font-urdu text-lg text-slate-900 font-semibold">{current.meaningUr}</div>
          {languageMode === 'bilingual' && <div className="text-xs text-slate-500">{current.en}</div>}
        </div>
      </div>
    </div>
  );
}

/* 7. Derived Verb Forms (Mazeed Feeh) Transformer */
export function DerivedFormsTransformer({ languageMode }: { languageMode: LanguageMode }) {
  const roots = [
    {
      id: 'alm',
      root: 'ع - ل - م',
      core: 'جاننا',
      forms: [
        { bab: 'ثلاثی مجرد', ar: 'عَلِمَ', masdar: 'عِلْمٌ', ur: 'اس نے جانا', note: 'بنیادی فعل' },
        { bab: 'باب تفعیل (فَعَّلَ)', ar: 'عَلَّمَ', masdar: 'تَعْلِيْمٌ', ur: 'اس نے سکھایا', note: 'دوسرے کو کروانا (تعلیم)' },
        { bab: 'باب تفعل (تَفَعَّلَ)', ar: 'تَعَلَّمَ', masdar: 'تَعَلُّمٌ', ur: 'اس نے سیکھا', note: 'خود محنت کر کے سیکھنا' },
      ],
    },
    {
      id: 'slm',
      root: 'س - ل - م',
      core: 'سلامتی',
      forms: [
        { bab: 'ثلاثی مجرد', ar: 'سَلِمَ', masdar: 'سَلَامَةٌ', ur: 'وہ سلامت رہا', note: 'بنیادی حالت' },
        { bab: 'باب تفعیل (فَعَّلَ)', ar: 'سَلَّمَ', masdar: 'تَسْلِيْمٌ', ur: 'اس نے سلامتی بھیجی / تسلیم کیا', note: 'اردو میں "تسلیم" اسی سے' },
        { bab: 'باب إفعال (أَفْعَلَ)', ar: 'أَسْلَمَ', masdar: 'إِسْلَامٌ', ur: 'اس نے خود کو سپرد کر دیا', note: 'مکمل اطاعت (اسلام)' },
      ],
    },
    {
      id: 'gfr',
      root: 'غ - ف - ر',
      core: 'ڈھانپنا / بخشنا',
      forms: [
        { bab: 'ثلاثی مجرد', ar: 'غَفَرَ', masdar: 'مَغْفِرَةٌ', ur: 'اس نے بخش دیا', note: 'اللہ کی طرف سے بخشش' },
        { bab: 'باب استفعال (اِسْتَفْعَلَ)', ar: 'اِسْتَغْفَرَ', masdar: 'اِسْتِغْفَارٌ', ur: 'اس نے بخشش مانگی', note: 'شروع میں اِسْتَـ = مانگنا (استغفار)' },
      ],
    },
  ];

  const [rootId, setRootId] = useState('alm');
  const activeRoot = roots.find((r) => r.id === rootId) ?? roots[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-urdu-ui text-base font-semibold text-slate-900">
            مزید فیہ ابواب: ایک مادہ، مختلف اوزان
          </h4>
          {languageMode === 'bilingual' && (
            <p className="text-xs text-slate-500">Observe how adding pattern letters creates new verbs connected to Urdu masdars</p>
          )}
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {roots.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRootId(r.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-urdu-ui font-medium cursor-pointer ${
                rootId === r.id ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              {r.root}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3" dir="rtl">
        {activeRoot.forms.map((f) => (
          <div key={f.bab} className="border border-slate-200 rounded-lg p-4 space-y-2 bg-slate-50/40">
            <div className="flex items-center justify-between">
              <span className="font-urdu-ui text-xs font-semibold text-emerald-800">{f.bab}</span>
              <button
                type="button"
                onClick={() => speakArabic(f.ar)}
                className="p-1 rounded text-slate-500 hover:text-emerald-700 cursor-pointer"
                aria-label={`Play ${f.ar}`}
              >
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
            <div className="font-arabic text-3xl text-slate-900">{f.ar}</div>
            <div className="font-urdu text-base text-slate-800 font-semibold">{f.ur}</div>
            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
              <span className="font-urdu-ui text-slate-500">اردو مصدر:</span>
              <span className="font-arabic text-lg text-blue-800">{f.masdar}</span>
            </div>
            <p className="font-urdu-ui text-[11px] text-slate-600">{f.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
