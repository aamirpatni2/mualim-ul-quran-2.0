import { WordType } from '../types/quranic';

export interface TarkeebSegment {
  id: string;
  arabic: string;
  type: WordType;
  roleUr: string; // e.g., 'مبتدا', 'خبر', 'مضاف', 'مضاف الیہ', 'جار و مجرور', 'فعل', 'مفعولِ مقدم'
  roleEn: string;
  caseReasonUr: string; // Why it has pesh/zabar/zer
  urduWord: string;
}

export interface TarkeebStep {
  stepNumber: number;
  formulaUr: string; // e.g., 'مضاف (بَيْتُ) + مضاف الیہ (اللّٰهِ) = مرکبِ اضافی'
  resultLabelUr: string;
  explanationUr: string;
}

export interface AyahTarkeeb {
  id: string;
  surahRefUr: string;
  arabicFull: string;
  sentenceTypeUr: string; // e.g., 'جملہ اسمیہ خبریہ' | 'جملہ فعلیہ انشائیہ'
  sentenceTypeEn: string;
  translationUr: string;
  segments: TarkeebSegment[];
  tarkeebSteps: TarkeebStep[];
  roleChoicesUr: string[]; // Options for interactive practice
}

export const AYAH_TARKEEB_LIST: AyahTarkeeb[] = [
  {
    id: 'tarkeeb-hamd',
    surahRefUr: 'سورۃ الفاتحہ ۱:۲',
    arabicFull: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ',
    sentenceTypeUr: 'جملہ اسمیہ خبریہ',
    sentenceTypeEn: 'Nominal Declarative Sentence',
    translationUr: 'تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔',
    roleChoicesUr: ['مبتدا', 'جار و مجرور (متعلقِ خبر)', 'مضاف (صفت)', 'مضاف الیہ'],
    segments: [
      {
        id: 'th-1',
        arabic: 'اَلْحَمْدُ',
        type: 'ism',
        roleUr: 'مبتدا',
        roleEn: 'Subject (Mubtada)',
        caseReasonUr: 'مبتدا ہمیشہ حالتِ رفع (پیش) میں ہوتا ہے، اور "ال" معرفہ ہونے کی دلیل ہے۔',
        urduWord: 'تمام تعریفیں',
      },
      {
        id: 'th-2',
        arabic: 'لِلّٰهِ',
        type: 'harf',
        roleUr: 'جار و مجرور (متعلقِ خبر)',
        roleEn: 'Prepositional Phrase (Predicate)',
        caseReasonUr: 'حرفِ جار (لِ) کی وجہ سے اسمِ جلالت (اللّٰهِ) حالتِ جر (زیر) میں ہے۔',
        urduWord: 'اللہ کے لیے (ہیں)',
      },
      {
        id: 'th-3',
        arabic: 'رَبِّ',
        type: 'ism',
        roleUr: 'مضاف (صفت)',
        roleEn: 'Mudaf (Attribute of Allah)',
        caseReasonUr: 'اللّٰهِ کی صفت ہونے کی وجہ سے حالتِ جر (زیر) میں ہے اور مضاف ہونے کی وجہ سے بغیر تنوین/ال ہے۔',
        urduWord: 'پالنے والا رب',
      },
      {
        id: 'th-4',
        arabic: 'الْعٰلَمِيْنَ',
        type: 'ism',
        roleUr: 'مضاف الیہ',
        roleEn: 'Mudaf Ilayhi (Genitive Plural)',
        caseReasonUr: 'مضاف الیہ ہمیشہ مجرور ہوتا ہے؛ جمع مذکر سالم میں حالتِ جر کی علامت "ـِیْنَ" ہے۔',
        urduWord: 'تمام جہانوں کا',
      },
    ],
    tarkeebSteps: [
      {
        stepNumber: 1,
        formulaUr: 'رَبِّ (مضاف) + الْعٰلَمِيْنَ (مضاف الیہ) ← مرکبِ اضافی',
        resultLabelUr: 'تمام جہانوں کا رب',
        explanationUr: 'پہلے آخر کے دو لفظوں کا ربط جوڑیں: رَبِّ بغیر ال کے مضاف ہے اور الْعٰلَمِيْنَ مجرور ہو کر مضاف الیہ ہے۔',
      },
      {
        stepNumber: 2,
        formulaUr: 'لِـ (حرفِ جار) + اللّٰهِ (مجرور) + رَبِّ الْعٰلَمِيْنَ (صفت) ← متعلق بمحذوف خبر',
        resultLabelUr: 'تمام جہانوں کے رب اللہ کے لیے (ثابت ہے)',
        explanationUr: 'جار و مجرور مل کر محذوف "ثَابِتٌ / كَائِنٌ" سے متعلق ہو کر خبر بن جاتے ہیں۔',
      },
      {
        stepNumber: 3,
        formulaUr: 'اَلْحَمْدُ (مبتدا) + لِلّٰهِ رَبِّ الْعٰلَمِيْنَ (خبر) ← جملہ اسمیہ خبریہ',
        resultLabelUr: 'تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔',
        explanationUr: 'مبتدا اور خبر مل کر مکمل جملہ اسمیہ بن گیا، اس لیے اردو ترجمے میں "ہیں" آتا ہے۔',
      },
    ],
  },
  {
    id: 'tarkeeb-iyyaka',
    surahRefUr: 'سورۃ الفاتحہ ۱:۵',
    arabicFull: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ',
    sentenceTypeUr: 'جملہ فعلیہ (معطوف و معطوف علیہ)',
    sentenceTypeEn: 'Conjoined Verbal Sentences',
    translationUr: 'ہم صرف تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔',
    roleChoicesUr: ['مفعولِ بہ مقدم', 'فعل + فاعل (نَحْنُ)', 'حرفِ عطف + مفعولِ مقدم', 'فعل مضارع + فاعل'],
    segments: [
      {
        id: 'ti-1',
        arabic: 'إِيَّاكَ',
        type: 'ism',
        roleUr: 'مفعولِ بہ مقدم',
        roleEn: 'Fronted Object Pronoun',
        caseReasonUr: 'منصوب ضمیر منفصل؛ فعل سے پہلے آنے سے حصر ("صرف تیری ہی") پیدا ہوا۔',
        urduWord: 'صرف تیری ہی',
      },
      {
        id: 'ti-2',
        arabic: 'نَعْبُدُ',
        type: 'fil',
        roleUr: 'فعل + فاعل (نَحْنُ)',
        roleEn: 'Present Verb + Hidden Subject (We)',
        caseReasonUr: 'فعل مضارع مرفوع؛ شروع میں "نَـ" کے اندر فاعل "ہم" پوشیدہ ہے۔',
        urduWord: 'ہم عبادت کرتے ہیں',
      },
      {
        id: 'ti-3',
        arabic: 'وَإِيَّاكَ',
        type: 'harf',
        roleUr: 'حرفِ عطف + مفعولِ مقدم',
        roleEn: 'Conjunction + Fronted Object',
        caseReasonUr: '"وَ" دو جملوں کو جوڑ رہا ہے اور إِيَّاكَ دوبارہ مفعولِ مقدم ہے۔',
        urduWord: 'اور صرف تجھ ہی سے',
      },
      {
        id: 'ti-4',
        arabic: 'نَسْتَعِيْنُ',
        type: 'fil',
        roleUr: 'فعل مضارع + فاعل',
        roleEn: 'Form X Verb + Hidden Subject (We)',
        caseReasonUr: 'بابِ استفعال کا مضارع مرفوع؛ فاعل "نَحْنُ" (ہم) پوشیدہ ہے۔',
        urduWord: 'ہم مدد مانگتے ہیں',
      },
    ],
    tarkeebSteps: [
      {
        stepNumber: 1,
        formulaUr: 'إِيَّاكَ (مفعولِ مقدم) + نَعْبُدُ (فعل مع فاعل: نَحْنُ) ← جملہ فعلیہ اولیٰ',
        resultLabelUr: 'ہم صرف تیری ہی عبادت کرتے ہیں',
        explanationUr: 'عام ترتیب نَعْبُدُكَ تھی؛ مفعول کو الگ کر کے پہلے لانے سے معنی میں اختصاص ("صرف تیری ہی") آیا۔',
      },
      {
        stepNumber: 2,
        formulaUr: 'وَ (حرفِ عطف) + إِيَّاكَ نَسْتَعِيْنُ (جملہ فعلیہ ثانیہ) ← معطوف',
        resultLabelUr: 'اور صرف تجھ ہی سے مدد مانگتے ہیں',
        explanationUr: 'دونوں جملہ فعلیہ "وَ" کے ذریعے آپس میں جڑ کر بندے کا عہد مکمل کرتے ہیں۔',
      },
    ],
  },
  {
    id: 'tarkeeb-ikhlas',
    surahRefUr: 'سورۃ الإخلاص ۱۱۲:۱',
    arabicFull: 'قُلْ هُوَ اللّٰهُ أَحَدٌ',
    sentenceTypeUr: 'جملہ فعلیہ (قول + مقولہ)',
    sentenceTypeEn: 'Imperative + Nominal Clause',
    translationUr: 'کہہ دیجیے کہ وہ اللہ ایک ہے۔',
    roleChoicesUr: ['فعلِ امر + فاعل (أَنْتَ)', 'ضمیرِ شان (مبتدا اول)', 'مبتدا ثانی', 'خبر'],
    segments: [
      {
        id: 'tx-1',
        arabic: 'قُلْ',
        type: 'fil',
        roleUr: 'فعلِ امر + فاعل (أَنْتَ)',
        roleEn: 'Imperative Verb + Hidden Subject (You)',
        caseReasonUr: 'فعلِ امر مبنی بر سکون (جزم)؛ اس میں فاعل أَنْتَ (آپ) پوشیدہ ہے۔',
        urduWord: 'آپ کہہ دیجیے',
      },
      {
        id: 'tx-2',
        arabic: 'هُوَ',
        type: 'ism',
        roleUr: 'ضمیرِ شان (مبتدا اول)',
        roleEn: 'Pronoun of Fact (Mubtada 1)',
        caseReasonUr: 'ضمیرِ منفصل مرفوع؛ یہ آنے والی عظیم حقیقت کی طرف اشارہ کرتی ہے۔',
        urduWord: 'حقیقت یہ ہے کہ وہ',
      },
      {
        id: 'tx-3',
        arabic: 'اللّٰهُ',
        type: 'ism',
        roleUr: 'مبتدا ثانی',
        roleEn: 'Subject 2 (Mubtada 2)',
        caseReasonUr: 'حالتِ رفع (پیش) میں ہے، اگلے لفظ کی خبر کا مبتدا۔',
        urduWord: 'اللہ',
      },
      {
        id: 'tx-4',
        arabic: 'أَحَدٌ',
        type: 'ism',
        roleUr: 'خبر',
        roleEn: 'Predicate (Khabar)',
        caseReasonUr: 'نکرہ مرفوع (دو پیش) ہو کر اللّٰهُ کی خبر بن رہا ہے۔',
        urduWord: 'یکتا (ایک) ہے',
      },
    ],
    tarkeebSteps: [
      {
        stepNumber: 1,
        formulaUr: 'اللّٰهُ (مبتدا ثانی) + أَحَدٌ (خبر) ← جملہ اسمیہ صغریٰ',
        resultLabelUr: 'اللہ ایک (یکتا) ہے',
        explanationUr: 'معرفہ اسم اللّٰهُ اور نکرہ صفت أَحَدٌ مل کر جملہ اسمیہ بنتے ہیں۔',
      },
      {
        stepNumber: 2,
        formulaUr: 'هُوَ (مبتدا اول) + [اللّٰهُ أَحَدٌ] (خبر) ← مقول القول',
        resultLabelUr: 'وہ اللہ ایک ہے',
        explanationUr: 'پورا جملہ اسمیہ مل کر قُلْ (کہہ دیجیے) کی بات یعنی مقولہ (Object of saying) بنتا ہے۔',
      },
      {
        stepNumber: 3,
        formulaUr: 'قُلْ (فعل امر + فاعل) + مقولہ ← جملہ فعلیہ انشائیہ',
        resultLabelUr: 'کہہ دیجیے کہ وہ اللہ ایک ہے۔',
        explanationUr: 'امر کا جملہ ہونے کی وجہ سے پوری آیت جملہ فعلیہ انشائیہ کہلاتی ہے۔',
      },
    ],
  },
  {
    id: 'tarkeeb-asr',
    surahRefUr: 'سورۃ العصر ۱۰۳:۲',
    arabicFull: 'إِنَّ الْإِنْسَانَ لَفِيْ خُسْرٍ',
    sentenceTypeUr: 'جملہ اسمیہ مؤکدہ',
    sentenceTypeEn: 'Emphatic Nominal Sentence',
    translationUr: 'بے شک انسان یقیناً خسارے میں ہے۔',
    roleChoicesUr: ['حرفِ مشبہ بالفعل', 'اِسمِ إِنَّ (منصوب)', 'لامِ تاکید + جار و مجرور (خبرِ إِنَّ)'],
    segments: [
      {
        id: 'ta-1',
        arabic: 'إِنَّ',
        type: 'harf',
        roleUr: 'حرفِ مشبہ بالفعل',
        roleEn: 'Emphatic Particle (Inna)',
        caseReasonUr: 'اپنے اسم کو حالتِ نصب (زبر) اور خبر کو رفع دیتا ہے۔',
        urduWord: 'بے شک',
      },
      {
        id: 'ta-2',
        arabic: 'الْإِنْسَانَ',
        type: 'ism',
        roleUr: 'اِسمِ إِنَّ (منصوب)',
        roleEn: 'Subject of Inna (Accusative)',
        caseReasonUr: 'إِنَّ کی وجہ سے آخر میں زبر (حالتِ نصب) آیا ہے۔',
        urduWord: 'انسان',
      },
      {
        id: 'ta-3',
        arabic: 'لَفِيْ خُسْرٍ',
        type: 'harf',
        roleUr: 'لامِ تاکید + جار و مجرور (خبرِ إِنَّ)',
        roleEn: 'Emphatic Lam + Prepositional Predicate',
        caseReasonUr: 'لَـ تاکید کے لیے، فِيْ حرفِ جار، اور خُسْرٍ حالتِ جر (دو زیر) میں ہے؛ یہ مل کر إِنَّ کی خبر ہیں۔',
        urduWord: 'یقیناً خسارے میں ہے',
      },
    ],
    tarkeebSteps: [
      {
        stepNumber: 1,
        formulaUr: 'فِيْ (حرفِ جار) + خُسْرٍ (مجرور) ← متعلقِ خبر',
        resultLabelUr: 'خسارے میں',
        explanationUr: 'فِيْ نے خُسْرٍ کو حالتِ جر (دو زیر) دیا اور دونوں مل کر خبر کے متعلق بنے۔',
      },
      {
        stepNumber: 2,
        formulaUr: 'إِنَّ (حرفِ تاکید) + الْإِنْسَانَ (اسمِ إِنَّ) + لَفِيْ خُسْرٍ (خبرِ إِنَّ) ← جملہ اسمیہ مؤکدہ',
        resultLabelUr: 'بے شک انسان یقیناً خسارے میں ہے۔',
        explanationUr: 'إِنَّ اور لَـ کی دوہری تاکید نے جملے میں قطعی یقین پیدا کر دیا۔',
      },
    ],
  },
  {
    id: 'tarkeeb-maasabireen',
    surahRefUr: 'سورۃ البقرۃ ۲:۱۵۳',
    arabicFull: 'إِنَّ اللّٰهَ مَعَ الصّٰبِرِيْنَ',
    sentenceTypeUr: 'جملہ اسمیہ مؤکدہ',
    sentenceTypeEn: 'Emphatic Nominal Sentence',
    translationUr: 'بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔',
    roleChoicesUr: ['حرفِ مشبہ بالفعل', 'اِسمِ إِنَّ (منصوب)', 'مضاف (ظرفِ مکان)', 'مضاف الیہ (مجرور)'],
    segments: [
      {
        id: 'tm-1',
        arabic: 'إِنَّ',
        type: 'harf',
        roleUr: 'حرفِ مشبہ بالفعل',
        roleEn: 'Particle of Emphasis',
        caseReasonUr: 'اسم کو زبر (نصب) دیتا ہے۔',
        urduWord: 'بے شک',
      },
      {
        id: 'tm-2',
        arabic: 'اللّٰهَ',
        type: 'ism',
        roleUr: 'اِسمِ إِنَّ (منصوب)',
        roleEn: 'Subject of Inna',
        caseReasonUr: 'إِنَّ کا اسم ہونے کی وجہ سے آخری "ہ" پر زبر آئی۔',
        urduWord: 'اللہ',
      },
      {
        id: 'tm-3',
        arabic: 'مَعَ',
        type: 'ism',
        roleUr: 'مضاف (ظرفِ مکان)',
        roleEn: 'Adverbial Noun (Mudaf)',
        caseReasonUr: 'مَعَ ظرفِ معیت (ساتھ) ہے اور اگلے اسم کی طرف مضاف ہے۔',
        urduWord: 'کے ساتھ (ہے)',
      },
      {
        id: 'tm-4',
        arabic: 'الصّٰبِرِيْنَ',
        type: 'ism',
        roleUr: 'مضاف الیہ (مجرور)',
        roleEn: 'Mudaf Ilayhi (Genitive Plural)',
        caseReasonUr: 'مَعَ کا مضاف الیہ ہونے کی وجہ سے حالتِ جر میں ہے؛ جمع مذکر کی جر علامت "ـِيْنَ" ہے۔',
        urduWord: 'صبر کرنے والوں',
      },
    ],
    tarkeebSteps: [
      {
        stepNumber: 1,
        formulaUr: 'مَعَ (مضاف) + الصّٰبِرِيْنَ (مضاف الیہ) ← مرکبِ اضافی متعلق بمحذوف خبر',
        resultLabelUr: 'صبر کرنے والوں کے ساتھ',
        explanationUr: 'مَعَ کے بعد آنے والا اسم مضاف الیہ بن کر حالتِ جر (الصّٰبِرِیْنَ) میں آتا ہے۔',
      },
      {
        stepNumber: 2,
        formulaUr: 'إِنَّ + اللّٰهَ (اسمِ إِنَّ) + مَعَ الصّٰبِرِيْنَ (خبرِ إِنَّ) ← جملہ اسمیہ مؤکدہ',
        resultLabelUr: 'بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔',
        explanationUr: 'اسمِ إِنَّ منصوب (اللّٰهَ) اور ظرفی خبر مل کر مکمل جملہ اسمیہ بناتی ہے۔',
      },
    ],
  },
];
