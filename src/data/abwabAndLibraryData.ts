import { VerificationStatus } from '../types/quranic';

export interface BabReference {
  id: string;
  category: 'mujarrad' | 'mazeed';
  nameUr: string;
  nameAr: string;
  patternMazi: string;
  patternMuzari: string;
  patternMasdar: string;
  semanticRoleUr: string;
  quranExampleAr: string;
  quranExampleRef: string;
  quranExampleUr: string;
  urduFamiliarMasdars: string[];
  verificationStatus: VerificationStatus;
}

export const ABWAB_REFERENCE: BabReference[] = [
  {
    id: 'bab-nasara',
    category: 'mujarrad',
    nameUr: 'باب نَصَرَ يَنْصُرُ',
    nameAr: 'نَصَرَ — يَنْصُرُ',
    patternMazi: 'فَعَلَ',
    patternMuzari: 'يَفْعُلُ',
    patternMasdar: 'نَصْراً',
    semanticRoleUr: 'ثلاثی مجرد کا سب سے کثیر الاستعمال باب؛ عین کلمے پر ماضی میں زبر اور مضارع میں پیش آتی ہے۔',
    quranExampleAr: 'إِنَّ اللّٰهَ يَنْصُرُ مَنْ يَّنْصُرُهٗ',
    quranExampleRef: 'الحج ٢٢:٤٠',
    quranExampleUr: 'بے شک اللہ ضرور اس کی مدد فرماتا ہے جو اس (کے دین) کی مدد کرتا ہے۔',
    urduFamiliarMasdars: ['نُصْرَت', 'خَلْق', 'کِتَابَت', 'ذِکْر', 'شُکْر'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-daraba',
    category: 'mujarrad',
    nameUr: 'باب ضَرَبَ يَضْرِبُ',
    nameAr: 'ضَرَبَ — يَضْرِبُ',
    patternMazi: 'فَعَلَ',
    patternMuzari: 'يَفْعِلُ',
    patternMasdar: 'ضَرْباً',
    semanticRoleUr: 'ماضی میں عین کلمے پر زبر اور مضارع میں زیر آتی ہے۔',
    quranExampleAr: 'وَيَضْرِبُ اللّٰهُ الْأَمْثَالَ لِلنَّاسِ',
    quranExampleRef: 'إبراہیم ١٤:٢٥',
    quranExampleUr: 'اور اللہ لوگوں کے لیے مثالیں بیان فرماتا ہے۔',
    urduFamiliarMasdars: ['صَبْر', 'ظُلْم', 'مَغْفِرَت', 'ہِدَایَت'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-fataha',
    category: 'mujarrad',
    nameUr: 'باب فَتَحَ يَفْتَحُ',
    nameAr: 'فَتَحَ — يَفْتَحُ',
    patternMazi: 'فَعَلَ',
    patternMuzari: 'يَفْتَحُ',
    patternMasdar: 'فَتْحاً',
    semanticRoleUr: 'ماضی اور مضارع دونوں میں عین کلمے پر زبر آتی ہے؛ عموماً حروفِ حلقی میں سے کوئی حرف عین یا لام کلمے پر ہوتا ہے۔',
    quranExampleAr: 'وَهُوَ الْفَتَّاحُ الْعَلِيْمُ',
    quranExampleRef: 'سبا ٣٤:٢٦',
    quranExampleUr: 'اور وہی سب سے بڑا فیصلہ فرمانے والا (کھولنے والا)، سب کچھ جاننے والا ہے۔',
    urduFamiliarMasdars: ['فَتْح', 'جَعْل', 'فِعْل'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-samia',
    category: 'mujarrad',
    nameUr: 'باب سَمِعَ يَسْمَعُ',
    nameAr: 'سَمِعَ — يَسْمَعُ',
    patternMazi: 'فَعِلَ',
    patternMuzari: 'يَفْعَلُ',
    patternMasdar: 'سَمْعاً',
    semanticRoleUr: 'ماضی میں عین کلمے پر زیر اور مضارع میں زبر؛ عموماً ادراک، علم، خوف یا احساس کے معانی کے لیے آتا ہے۔',
    quranExampleAr: 'قَالُوْا سَمِعْنَا وَأَطَعْنَا',
    quranExampleRef: 'البقرۃ ٢:٢٨٥',
    quranExampleUr: 'انہوں نے کہا ہم نے سنا اور اطاعت کی۔',
    urduFamiliarMasdars: ['عِلْم', 'عَمَل', 'سَمْع', 'رَحْمَت'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-karuma',
    category: 'mujarrad',
    nameUr: 'باب كَرُمَ يَكْرُمُ',
    nameAr: 'كَرُمَ — يَكْرُمُ',
    patternMazi: 'فَعُلَ',
    patternMuzari: 'يَفْعُلُ',
    patternMasdar: 'كَرَامَةً',
    semanticRoleUr: 'ماضی اور مضارع دونوں میں پیش؛ یہ باب ہمیشہ لازم (Intransitive) ہوتا ہے اور فطری یا مستقل صفات بتاتا ہے۔',
    quranExampleAr: 'وَلَقَدْ كَرَّمْنَا بَنِيْ آَدَمَ',
    quranExampleRef: 'الإسراء ١٧:٧٠',
    quranExampleUr: 'اور یقیناً ہم نے بنی آدم کو عزت و کرامت بخشی۔',
    urduFamiliarMasdars: ['کَرَم', 'کَرَامَت', 'عَظَمَت', 'کَثْرَت'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-ifaal',
    category: 'mazeed',
    nameUr: 'باب إِفْعَال (أَفْعَلَ يُفْعِلُ)',
    nameAr: 'أَفْعَلَ — يُفْعِلُ — إِفْعَالاً',
    patternMazi: 'أَفْعَلَ',
    patternMuzari: 'يُفْعِلُ',
    patternMasdar: 'إِفْعَالاً',
    semanticRoleUr: 'لازم فعل کو متعدی بناتا ہے یا یکبارگی عمل کو ظاہر کرتا ہے (جیسے نَزَلَ اترا ← أَنْزَلَ اس نے اتارا)۔',
    quranExampleAr: 'إِنَّا أَنْزَلْنٰهُ فِيْ لَيْلَةِ الْقَدْرِ',
    quranExampleRef: 'القدر ٩٧:١',
    quranExampleUr: 'بے شک ہم نے اس (قرآن) کو شبِ قدر میں نازل فرمایا۔',
    urduFamiliarMasdars: ['إِسْلَام', 'إِيمَان', 'إِحْسَان', 'إِنْعَام', 'إِخْلَاص'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-tafeel',
    category: 'mazeed',
    nameUr: 'باب تَفْعِيْل (فَعَّلَ يُفَعِّلُ)',
    nameAr: 'فَعَّلَ — يُفَعِّلُ — تَفْعِيْلاً',
    patternMazi: 'فَعَّلَ',
    patternMuzari: 'يُفَعِّلُ',
    patternMasdar: 'تَفْعِيْلاً',
    semanticRoleUr: 'فعل میں تدریج، تکرار، کثرت یا کسی کو کروانے کا مفہوم (عَلِمَ جانا ← عَلَّمَ سکھایا؛ نَزَّلَ بتدریج اتارا)۔',
    quranExampleAr: 'الَّذِيْ عَلَّمَ بِالْقَلَمِ',
    quranExampleRef: 'العلق ٩٦:٤',
    quranExampleUr: 'جس نے قلم کے ذریعے سکھایا۔',
    urduFamiliarMasdars: ['تَعْلِيم', 'تَسْبِيح', 'تَكْذِيب', 'تَنْزِيل', 'تَصْدِيق'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-mufaalah',
    category: 'mazeed',
    nameUr: 'باب مُفَاعَلَة (فَاعَلَ يُفَاعِلُ)',
    nameAr: 'فَاعَلَ — يُفَاعِلُ — مُفَاعَلَةً',
    patternMazi: 'فَاعَلَ',
    patternMuzari: 'يُفَاعِلُ',
    patternMasdar: 'مُفَاعَلَةً',
    semanticRoleUr: 'دو فریقوں کے درمیان مقابلہ یا باہمی عمل (جیسے جَاهَدَ، قَاتَلَ، نَافَقَ)۔',
    quranExampleAr: 'وَالَّذِيْنَ جَاهَدُوْا فِيْنَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
    quranExampleRef: 'العنکبوت ٢٩:٦٩',
    quranExampleUr: 'اور جنہوں نے ہمارے راستے میں جدوجہد کی ہم ضرور انہیں اپنے راستے دکھائیں گے۔',
    urduFamiliarMasdars: ['مُجَاهَدَت', 'مُحَاسَبَت', 'مُنَافَقَت', 'جِهَاد'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-tafaaool',
    category: 'mazeed',
    nameUr: 'باب تَفَاعُل (تَفَاعَلَ يَتَفَاعَلُ)',
    nameAr: 'تَفَاعَلَ — يَتَفَاعَلُ — تَفَاعُلاً',
    patternMazi: 'تَفَاعَلَ',
    patternMuzari: 'يَتَفَاعَلُ',
    patternMasdar: 'تَفَاعُلاً',
    semanticRoleUr: 'آپس میں ایک دوسرے کے ساتھ مل کر کوئی کام کرنا (Mutual reciprocity)، جیسے تَوَاصَوْا (آپس میں نصیحت کی)۔',
    quranExampleAr: 'وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
    quranExampleRef: 'العصر ١٠٣:٣',
    quranExampleUr: 'اور آپس میں حق کی اور صبر کی نصیحت کی۔',
    urduFamiliarMasdars: ['تَعَاوُن', 'تَفَاهُم', 'تَوَاصِي'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-tafaul',
    category: 'mazeed',
    nameUr: 'باب تَفَعُّل (تَفَعَّلَ يَتَفَعَّلُ)',
    nameAr: 'تَفَعَّلَ — يَتَفَعَّلُ — تَفَعُّلاً',
    patternMazi: 'تَفَعَّلَ',
    patternMuzari: 'يَتَفَعَّلُ',
    patternMasdar: 'تَفَعُّلاً',
    semanticRoleUr: 'باب تفعیل کا اثر خود قبول کرنا یا توجہ و محنت سے کام کرنا (جیسے تَذَكَّرَ، تَفَكَّرَ، تَوَكَّلَ)۔',
    quranExampleAr: 'أَفَلَا تَتَفَكَّرُوْنَ',
    quranExampleRef: 'الأنعام ٦:٥٠',
    quranExampleUr: 'تو کیا تم غور و فکر نہیں کرتے؟',
    urduFamiliarMasdars: ['تَفَكُّر', 'تَدَبُّر', 'تَوَكُّل', 'تَعَلُّم'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-iftiaal',
    category: 'mazeed',
    nameUr: 'باب اِفْتِعَال (اِفْتَعَلَ يَفْتَعِلُ)',
    nameAr: 'اِفْتَعَلَ — يَفْتَعِلُ — اِفْتِعَالاً',
    patternMazi: 'اِفْتَعَلَ',
    patternMuzari: 'يَفْتَعِلُ',
    patternMasdar: 'اِفْتِعَالاً',
    semanticRoleUr: 'فعل کو خود اپنے لیے اختیار کرنا یا اہتمام کے ساتھ انجام دینا (جیسے اِتَّقٰى، اِخْتَلَفَ، اِقْتَرَبَ)۔',
    quranExampleAr: 'إِنَّ الْمُتَّقِيْنَ فِيْ جَنّٰتٍ وَّعُيُوْنٍ',
    quranExampleRef: 'الحجر ١٥:٤٥',
    quranExampleUr: 'بے شک تقویٰ والے باغات اور چشموں میں ہوں گے۔',
    urduFamiliarMasdars: ['اِخْتِلَاف', 'اِجْتِمَاع', 'اِحْتِرَام', 'اِتِّقَاء'],
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bab-istifaal',
    category: 'mazeed',
    nameUr: 'باب اِسْتِفْعَال (اِسْتَفْعَلَ يَسْتَفْعِلُ)',
    nameAr: 'اِسْتَفْعَلَ — يَسْتَفْعِلُ — اِسْتِفْعَالاً',
    patternMazi: 'اِسْتَفْعَلَ',
    patternMuzari: 'يَسْتَفْعِلُ',
    patternMasdar: 'اِسْتِفْعَالاً',
    semanticRoleUr: 'کسی چیز کو مانگنا، طلب کرنا یا سمجھنا (جیسے اِسْتَغْفَرَ بخشش مانگی، نَسْتَعِيْنُ ہم مدد مانگتے ہیں)۔',
    quranExampleAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ',
    quranExampleRef: 'الفاتحہ ١:٥',
    quranExampleUr: 'ہم صرف تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں۔',
    urduFamiliarMasdars: ['اِسْتِغْفَار', 'اِسْتِعَانَت', 'اِسْتِقَامَت', 'اِسْتِكْبَار'],
    verificationStatus: 'SOURCE VERIFIED',
  },
];

export interface BalaghaTopic {
  id: string;
  titleUr: string;
  titleAr: string;
  titleEn: string;
  simpleDefUr: string;
  arabicDef: string;
  quranExampleAr: string;
  quranExampleRef: string;
  quranExampleUr: string;
  analysisUr: string;
  verificationStatus: VerificationStatus;
}

export const BALAGHA_TOPICS: BalaghaTopic[] = [
  {
    id: 'bal-qasr',
    titleUr: 'قصر اور حصر (تخصیص)',
    titleAr: 'القصر والتخصيص',
    titleEn: 'Exclusivity (Qasr & Taqdeem)',
    simpleDefUr: 'کسی بات یا عمل کو صرف ایک ذات یا چیز تک محدود کر دینا — جیسے معمول کو فعل سے پہلے لانا یا إِنَّمَا استعمال کرنا۔',
    arabicDef: 'تَخْصِيْصُ أَمْرٍ بِأَمْرٍ بِطَرِيْقٍ مَّخْصُوْصٍ.',
    quranExampleAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِيْنُ',
    quranExampleRef: 'سورۃ الفاتحہ ١:٥',
    quranExampleUr: 'ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں۔',
    analysisUr: 'مفعول (إِيَّاكَ) کو فعل (نَعْبُدُ) سے پہلے لانے سے غیر اللہ کی عبادت و استعانت کی مکمل نفی ہو گئی۔',
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bal-tashbeeh',
    titleUr: 'تشبیہِ قرآنی',
    titleAr: 'التشبيه',
    titleEn: 'Simile (Tashbeeh)',
    simpleDefUr: 'ایک چیز کو کسی نمایاں صفت میں دوسری چیز جیسا قرار دینا تاکہ مضمون ذہن میں نقش ہو جائے۔',
    arabicDef: 'إِلْحَاقُ أَمْرٍ بِأَمْرٍ فِيْ وَصْفٍ بِأَدَاةٍ لِّغَرَضٍ.',
    quranExampleAr: 'مَثَلُهُمْ كَمَثَلِ الَّذِي اسْتَوْقَدَ نَاراً',
    quranExampleRef: 'سورۃ البقرۃ ٢:١٧',
    quranExampleUr: 'ان کی مثال اس شخص کی سی ہے جس نے آگ جلائی۔',
    analysisUr: 'یہاں منافقین کی محرومی کو اس مسافر سے تشبیہ دی گئی جس کی روشنی یکدم بجھ جائے۔',
    verificationStatus: 'SOURCE VERIFIED',
  },
  {
    id: 'bal-istiarah',
    titleUr: 'استعارہ (Metaphor)',
    titleAr: 'الاستعارة',
    titleEn: 'Metaphor (Isti’arah)',
    simpleDefUr: 'کسی لفظ کو اس کے حقیقی معنی کے بجائے مشابہت کی بنا پر مجازی بلیغ معنی میں استعمال کرنا۔',
    arabicDef: 'لَفْظٌ اسْتُعْمِلَ فِيْ غَيْرِ مَا وُضِعَ لَهٗ لِعَلَاقَةِ الْمُشَابَهَةِ مَعَ قَرِيْنَةٍ مَّانِعَةٍ.',
    quranExampleAr: 'كِتٰبٌ أَنْزَلْنٰهُ إِلَيْكَ لِتُخْرِجَ النَّاسَ مِنَ الظُّلُمٰتِ إِلَى النُّوْرِ',
    quranExampleRef: 'سورۃ إبراہیم ١٤:١',
    quranExampleUr: 'یہ ایک کتاب ہے جو ہم نے آپ کی طرف نازل کی تاکہ آپ لوگوں کو اندھیروں سے نکال کر روشنی کی طرف لائیں۔',
    analysisUr: 'یہاں کفر و جہالت کے لیے "الظُّلُمٰت" (اندھیرے) اور ایمان و ہدایت کے لیے "النُّوْر" (روشنی) بطور استعارہ آیا ہے۔',
    verificationStatus: 'SOURCE VERIFIED',
  },
];

export interface ClassicalBookRef {
  id: string;
  titleUr: string;
  titleAr: string;
  authorUr: string;
  subjectUr: string;
  levelUr: string;
  descriptionUr: string;
  usageInAcademyUr: string;
  verificationStatus: VerificationStatus;
}

export const DARS_E_NIZAMI_BOOKS: ClassicalBookRef[] = [
  {
    id: 'book-meezan',
    titleUr: 'میزان الصرف و منشعب',
    titleAr: 'ميزان الصرف ومنشعب',
    authorUr: 'روایتی درسی نصابِ صرف',
    subjectUr: 'علمِ صرف (ابتدائی)',
    levelUr: 'ابتدائی تا درمیانی',
    descriptionUr: 'عربی افعال کی بنیادی گردانیں، ۱۴ صیغوں کا نظام اور ثلاثی مجرد و مزید فیہ کے ابواب سیکھنے کی بنیاد۔',
    usageInAcademyUr: 'اس ایپ کی مکمل گردان لیب اور ابوابِ ثلاثی کا ڈھانچہ میزان الصرف کی ترتیب پر مبنی ہے۔',
    verificationStatus: 'EXPERT REVIEWED',
  },
  {
    id: 'book-nahw-meer',
    titleUr: 'نحو میر',
    titleAr: 'نحو مير',
    authorUr: 'سید شریف جرجانی رحمہ اللہ',
    subjectUr: 'علمِ نحو (بنیادی)',
    levelUr: 'ابتدائی',
    descriptionUr: 'کلمہ کی تین اقسام (اسم، فعل، حرف)، اعراب، مرفوعات، منصوبات، مجرورات اور جملے کی اقسام کا نہایت مختصر اور جامع اردو و فارسی متن۔',
    usageInAcademyUr: 'سبق ۳ سے ۱۰ اور اصطلاحاتِ نحو کی بنیادی تعریفیں نحو میر کے اصولوں سے مطابقت رکھتی ہیں۔',
    verificationStatus: 'EXPERT REVIEWED',
  },
  {
    id: 'book-hidayatun-nahw',
    titleUr: 'ہدایۃ النحو',
    titleAr: 'هداية النحو',
    authorUr: 'سراج الدین اودھی رحمہ اللہ (یا منسوب)',
    subjectUr: 'علمِ نحو (متوسط)',
    levelUr: 'درمیانی تا اعلیٰ',
    descriptionUr: 'نحو کے تفصیلی قواعد، عوامل، توابع (نعت، بدل، عطف، توکید) اور نحوی تراکیب کا مستند درسی نصاب۔',
    usageInAcademyUr: 'قرآن اسٹوڈیو کی ترکیبِ نحوی اور توابع کی وضاحت میں ہدایۃ النحو کی تقسیم استعمال کی گئی ہے۔',
    verificationStatus: 'EXPERT REVIEWED',
  },
  {
    id: 'book-mufradat',
    titleUr: 'مفردات الفاظ القرآن',
    titleAr: 'المفردات في غريب القرآن',
    authorUr: 'امام راغب اصفہانی رحمہ اللہ (م ٥٠٢ھ)',
    subjectUr: 'قرآنی لغت و معانی',
    levelUr: 'تمام سطحیں',
    descriptionUr: 'قرآن کے ہر سہ حرفی مادے کے بنیادی اور حقیقی مفہوم کو قرآن ہی کے شواہد سے بیان کرنے والی مستند ترین کتاب۔',
    usageInAcademyUr: 'مادہ لیب اور قرآن اسٹوڈیو کے "کلاسیکی لغتی معنی" اسی منہج سے اخذ کیے گئے ہیں۔',
    verificationStatus: 'SOURCE VERIFIED',
  },
];
