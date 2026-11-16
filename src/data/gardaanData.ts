export type GardaanTenseId =
  | 'mazi_maroof'
  | 'mazi_majhool'
  | 'muzari_maroof'
  | 'muzari_majhool'
  | 'amr'
  | 'nahi';

export interface GardaanSeeghah {
  index: number;
  seeghahUr: string;
  seeghahEn: string;
  arabic: string;
  marker: string;
  urduMeaning: string;
  groupUr: 'غائب' | 'حاضر' | 'متکلم';
}

export interface GardaanVerbPreset {
  id: string;
  rootLetters: string;
  babNameUr: string;
  babNameEn: string;
  baseMeaningUr: string;
  sagheer: {
    mazi: string;
    muzari: string;
    masdar: string;
    faail: string;
    mafool: string;
    amr: string;
    nahi: string;
  };
  tenses: Record<GardaanTenseId, GardaanSeeghah[]>;
}

export const TENSE_LABELS: { id: GardaanTenseId; labelUr: string; labelEn: string }[] = [
  { id: 'mazi_maroof', labelUr: 'فعلِ ماضی معروف', labelEn: 'Past Active' },
  { id: 'mazi_majhool', labelUr: 'فعلِ ماضی مجہول', labelEn: 'Past Passive' },
  { id: 'muzari_maroof', labelUr: 'فعلِ مضارع معروف', labelEn: 'Present/Future Active' },
  { id: 'muzari_majhool', labelUr: 'فعلِ مضارع مجہول', labelEn: 'Present/Future Passive' },
  { id: 'amr', labelUr: 'فعلِ امر', labelEn: 'Imperative' },
  { id: 'nahi', labelUr: 'فعلِ نہی', labelEn: 'Prohibitive' },
];

interface VerbConfig {
  id: string;
  rootLetters: string;
  babNameUr: string;
  babNameEn: string;
  baseMeaningUr: string;
  // Stem letters: C1, C2, C3 and middle vowel for mazi/muzari/amr
  c1: string;
  c2: string;
  c3: string;
  maziV2: string; // e.g. َ or ِ
  muzariV2: string; // e.g. َ or ُ or ِ
  amrHamza: string; // اِ or اُ
  masdarAr: string;
  urduPastStem: string; // e.g. 'لکھا' / 'مدد کی' / 'جانا' / 'کھولا' / 'سنا'
  urduPresStem: string; // e.g. 'لکھ' / 'مدد کر' / 'جان' / 'کھول' / 'سن'
  urduImpSg: string; // e.g. 'لکھ' / 'مدد کر'
  urduImpPl: string; // e.g. 'لکھو' / 'مدد کرو'
  urduPassPast: string; // e.g. 'لکھا گیا' / 'مدد کی گئی'
  urduPassPres: string; // e.g. 'لکھا جا' / 'مدد کی جا'
}

const VERB_CONFIGS: VerbConfig[] = [
  {
    id: 'faala',
    rootLetters: 'ف - ع - ل',
    babNameUr: 'ترازو: باب فَتَحَ يَفْتَحُ',
    babNameEn: 'Standard Scale (F-A-L)',
    baseMeaningUr: 'کرنا',
    c1: 'ف',
    c2: 'ع',
    c3: 'ل',
    maziV2: 'َ',
    muzariV2: 'َ',
    amrHamza: 'اِ',
    masdarAr: 'فَعْلاً',
    urduPastStem: 'کیا',
    urduPresStem: 'کر',
    urduImpSg: 'کر',
    urduImpPl: 'کرو',
    urduPassPast: 'کیا گیا',
    urduPassPres: 'کیا جا',
  },
  {
    id: 'nasara',
    rootLetters: 'ن - ص - ر',
    babNameUr: 'باب نَصَرَ يَنْصُرُ',
    babNameEn: 'Nasara / Yansuru',
    baseMeaningUr: 'مدد کرنا',
    c1: 'ن',
    c2: 'ص',
    c3: 'ر',
    maziV2: 'َ',
    muzariV2: 'ُ',
    amrHamza: 'اُ',
    masdarAr: 'نَصْراً',
    urduPastStem: 'مدد کی',
    urduPresStem: 'مدد کر',
    urduImpSg: 'مدد کر',
    urduImpPl: 'مدد کرو',
    urduPassPast: 'مدد کی گئی',
    urduPassPres: 'مدد کی جا',
  },
  {
    id: 'kataba',
    rootLetters: 'ک - ت - ب',
    babNameUr: 'باب نَصَرَ يَنْصُرُ',
    babNameEn: 'Kataba / Yaktubu',
    baseMeaningUr: 'لکھنا / فرض کرنا',
    c1: 'ك',
    c2: 'ت',
    c3: 'ب',
    maziV2: 'َ',
    muzariV2: 'ُ',
    amrHamza: 'اُ',
    masdarAr: 'كِتَابَةً',
    urduPastStem: 'لکھا',
    urduPresStem: 'لکھ',
    urduImpSg: 'لکھ',
    urduImpPl: 'لکھو',
    urduPassPast: 'لکھا گیا',
    urduPassPres: 'لکھا جا',
  },
  {
    id: 'alima',
    rootLetters: 'ع - ل - م',
    babNameUr: 'باب سَمِعَ يَسْمَعُ',
    babNameEn: 'Alima / Ya’lamu',
    baseMeaningUr: 'جاننا',
    c1: 'ع',
    c2: 'ل',
    c3: 'م',
    maziV2: 'ِ',
    muzariV2: 'َ',
    amrHamza: 'اِ',
    masdarAr: 'عِلْماً',
    urduPastStem: 'جانا',
    urduPresStem: 'جان',
    urduImpSg: 'جان لے',
    urduImpPl: 'جان لو',
    urduPassPast: 'جانا گیا',
    urduPassPres: 'جانا جا',
  },
  {
    id: 'samia',
    rootLetters: 'س - م - ع',
    babNameUr: 'باب سَمِعَ يَسْمَعُ',
    babNameEn: 'Sami’a / Yasma’u',
    baseMeaningUr: 'سننا',
    c1: 'س',
    c2: 'م',
    c3: 'ع',
    maziV2: 'ِ',
    muzariV2: 'َ',
    amrHamza: 'اِ',
    masdarAr: 'سَمْعاً',
    urduPastStem: 'سنا',
    urduPresStem: 'سن',
    urduImpSg: 'سن',
    urduImpPl: 'سنو',
    urduPassPast: 'سنا گیا',
    urduPassPres: 'سنا جا',
  },
  {
    id: 'fataha',
    rootLetters: 'ف - ت - ح',
    babNameUr: 'باب فَتَحَ يَفْتَحُ',
    babNameEn: 'Fataha / Yaftahu',
    baseMeaningUr: 'کھولنا / فتح دینا',
    c1: 'ف',
    c2: 'ت',
    c3: 'ح',
    maziV2: 'َ',
    muzariV2: 'َ',
    amrHamza: 'اِ',
    masdarAr: 'فَتْحاً',
    urduPastStem: 'کھولا',
    urduPresStem: 'کھول',
    urduImpSg: 'کھول',
    urduImpPl: 'کھولو',
    urduPassPast: 'کھولا گیا',
    urduPassPres: 'کھولا جا',
  },
];

function buildGardaan(cfg: VerbConfig): GardaanVerbPreset {
  const { c1, c2, c3, maziV2, muzariV2, amrHamza } = cfg;

  const maziBase = `${c1}َ${c2}${maziV2}${c3}`;
  const maziPassBase = `${c1}ُ${c2}ِ${c3}`;
  const muzStem = `${c1}ْ${c2}${muzariV2}${c3}`;
  const muzPassStem = `${c1}ْ${c2}َ${c3}`;
  const amrStem = `${amrHamza}${c1}ْ${c2}${muzariV2}${c3}`;

  const mazi_maroof: GardaanSeeghah[] = [
    { index: 1, groupUr: 'غائب', seeghahUr: 'واحد مذکر غائب', seeghahEn: '3rd Masc. Sg.', arabic: `${maziBase}َ`, marker: 'ـَ', urduMeaning: `اس ایک مرد نے ${cfg.urduPastStem}` },
    { index: 2, groupUr: 'غائب', seeghahUr: 'تثنیہ مذکر غائب', seeghahEn: '3rd Masc. Dual', arabic: `${maziBase}َا`, marker: 'ـَا', urduMeaning: `ان دو مردوں نے ${cfg.urduPastStem}` },
    { index: 3, groupUr: 'غائب', seeghahUr: 'جمع مذکر غائب', seeghahEn: '3rd Masc. Pl.', arabic: `${maziBase}ُوْا`, marker: 'ـُوْا', urduMeaning: `ان سب مردوں نے ${cfg.urduPastStem}` },
    { index: 4, groupUr: 'غائب', seeghahUr: 'واحد مؤنث غائب', seeghahEn: '3rd Fem. Sg.', arabic: `${maziBase}َتْ`, marker: 'ـَتْ', urduMeaning: `اس ایک عورت نے ${cfg.urduPastStem}` },
    { index: 5, groupUr: 'غائب', seeghahUr: 'تثنیہ مؤنث غائب', seeghahEn: '3rd Fem. Dual', arabic: `${maziBase}َتَا`, marker: 'ـَتَا', urduMeaning: `ان دو عورتوں نے ${cfg.urduPastStem}` },
    { index: 6, groupUr: 'غائب', seeghahUr: 'جمع مؤنث غائب', seeghahEn: '3rd Fem. Pl.', arabic: `${maziBase}ْنَ`, marker: 'ـْنَ', urduMeaning: `ان سب عورتوں نے ${cfg.urduPastStem}` },
    { index: 7, groupUr: 'حاضر', seeghahUr: 'واحد مذکر حاضر', seeghahEn: '2nd Masc. Sg.', arabic: `${maziBase}ْتَ`, marker: 'ـْتَ', urduMeaning: `تُو ایک مرد نے ${cfg.urduPastStem}` },
    { index: 8, groupUr: 'حاضر', seeghahUr: 'تثنیہ مذکر حاضر', seeghahEn: '2nd Masc. Dual', arabic: `${maziBase}ْتُمَا`, marker: 'ـْتُمَا', urduMeaning: `تم دو مردوں نے ${cfg.urduPastStem}` },
    { index: 9, groupUr: 'حاضر', seeghahUr: 'جمع مذکر حاضر', seeghahEn: '2nd Masc. Pl.', arabic: `${maziBase}ْتُمْ`, marker: 'ـْتُمْ', urduMeaning: `تم سب مردوں نے ${cfg.urduPastStem}` },
    { index: 10, groupUr: 'حاضر', seeghahUr: 'واحد مؤنث حاضر', seeghahEn: '2nd Fem. Sg.', arabic: `${maziBase}ْتِ`, marker: 'ـْتِ', urduMeaning: `تُو ایک عورت نے ${cfg.urduPastStem}` },
    { index: 11, groupUr: 'حاضر', seeghahUr: 'تثنیہ مؤنث حاضر', seeghahEn: '2nd Fem. Dual', arabic: `${maziBase}ْتُمَا`, marker: 'ـْتُمَا', urduMeaning: `تم دو عورتوں نے ${cfg.urduPastStem}` },
    { index: 12, groupUr: 'حاضر', seeghahUr: 'جمع مؤنث حاضر', seeghahEn: '2nd Fem. Pl.', arabic: `${maziBase}ْتُنَّ`, marker: 'ـْتُنَّ', urduMeaning: `تم سب عورتوں نے ${cfg.urduPastStem}` },
    { index: 13, groupUr: 'متکلم', seeghahUr: 'واحد متکلم', seeghahEn: '1st Sg.', arabic: `${maziBase}ْتُ`, marker: 'ـْتُ', urduMeaning: `میں نے ${cfg.urduPastStem}` },
    { index: 14, groupUr: 'متکلم', seeghahUr: 'جمع متکلم', seeghahEn: '1st Pl.', arabic: `${maziBase}ْنَا`, marker: 'ـْنَا', urduMeaning: `ہم نے ${cfg.urduPastStem}` },
  ];

  const mazi_majhool: GardaanSeeghah[] = [
    { index: 1, groupUr: 'غائب', seeghahUr: 'واحد مذکر غائب', seeghahEn: '3rd Masc. Sg.', arabic: `${maziPassBase}َ`, marker: 'فُعِلَ', urduMeaning: `وہ ایک (مذکر) ${cfg.urduPassPast}` },
    { index: 2, groupUr: 'غائب', seeghahUr: 'تثنیہ مذکر غائب', seeghahEn: '3rd Masc. Dual', arabic: `${maziPassBase}َا`, marker: 'ـَا', urduMeaning: `وہ دو ${cfg.urduPassPast}` },
    { index: 3, groupUr: 'غائب', seeghahUr: 'جمع مذکر غائب', seeghahEn: '3rd Masc. Pl.', arabic: `${maziPassBase}ُوْا`, marker: 'ـُوْا', urduMeaning: `وہ سب ${cfg.urduPassPast}` },
    { index: 4, groupUr: 'غائب', seeghahUr: 'واحد مؤنث غائب', seeghahEn: '3rd Fem. Sg.', arabic: `${maziPassBase}َتْ`, marker: 'ـَتْ', urduMeaning: `وہ ایک (مؤنث) ${cfg.urduPassPast}` },
    { index: 5, groupUr: 'غائب', seeghahUr: 'تثنیہ مؤنث غائب', seeghahEn: '3rd Fem. Dual', arabic: `${maziPassBase}َتَا`, marker: 'ـَتَا', urduMeaning: `وہ دو عورتیں ${cfg.urduPassPast}` },
    { index: 6, groupUr: 'غائب', seeghahUr: 'جمع مؤنث غائب', seeghahEn: '3rd Fem. Pl.', arabic: `${maziPassBase}ْنَ`, marker: 'ـْنَ', urduMeaning: `وہ سب عورتیں ${cfg.urduPassPast}` },
    { index: 7, groupUr: 'حاضر', seeghahUr: 'واحد مذکر حاضر', seeghahEn: '2nd Masc. Sg.', arabic: `${maziPassBase}ْتَ`, marker: 'ـْتَ', urduMeaning: `تُو ${cfg.urduPassPast}` },
    { index: 8, groupUr: 'حاضر', seeghahUr: 'تثنیہ مذکر حاضر', seeghahEn: '2nd Masc. Dual', arabic: `${maziPassBase}ْتُمَا`, marker: 'ـْتُمَا', urduMeaning: `تم دو ${cfg.urduPassPast}` },
    { index: 9, groupUr: 'حاضر', seeghahUr: 'جمع مذکر حاضر', seeghahEn: '2nd Masc. Pl.', arabic: `${maziPassBase}ْتُمْ`, marker: 'ـْتُمْ', urduMeaning: `تم سب ${cfg.urduPassPast}` },
    { index: 10, groupUr: 'حاضر', seeghahUr: 'واحد مؤنث حاضر', seeghahEn: '2nd Fem. Sg.', arabic: `${maziPassBase}ْتِ`, marker: 'ـْتِ', urduMeaning: `تُو (مؤنث) ${cfg.urduPassPast}` },
    { index: 11, groupUr: 'حاضر', seeghahUr: 'تثنیہ مؤنث حاضر', seeghahEn: '2nd Fem. Dual', arabic: `${maziPassBase}ْتُمَا`, marker: 'ـْتُمَا', urduMeaning: `تم دو (مؤنث) ${cfg.urduPassPast}` },
    { index: 12, groupUr: 'حاضر', seeghahUr: 'جمع مؤنث حاضر', seeghahEn: '2nd Fem. Pl.', arabic: `${maziPassBase}ْتُنَّ`, marker: 'ـْتُنَّ', urduMeaning: `تم سب (مؤنث) ${cfg.urduPassPast}` },
    { index: 13, groupUr: 'متکلم', seeghahUr: 'واحد متکلم', seeghahEn: '1st Sg.', arabic: `${maziPassBase}ْتُ`, marker: 'ـْتُ', urduMeaning: `میں ${cfg.urduPassPast}` },
    { index: 14, groupUr: 'متکلم', seeghahUr: 'جمع متکلم', seeghahEn: '1st Pl.', arabic: `${maziPassBase}ْنَا`, marker: 'ـْنَا', urduMeaning: `ہم ${cfg.urduPassPast}` },
  ];

  const muzari_maroof: GardaanSeeghah[] = [
    { index: 1, groupUr: 'غائب', seeghahUr: 'واحد مذکر غائب', seeghahEn: '3rd Masc. Sg.', arabic: `يَ${muzStem}ُ`, marker: 'يَـ ... ـُ', urduMeaning: `وہ ایک مرد ${cfg.urduPresStem}تا ہے` },
    { index: 2, groupUr: 'غائب', seeghahUr: 'تثنیہ مذکر غائب', seeghahEn: '3rd Masc. Dual', arabic: `يَ${muzStem}َانِ`, marker: 'يَـ ... ـَانِ', urduMeaning: `وہ دو مرد ${cfg.urduPresStem}تے ہیں` },
    { index: 3, groupUr: 'غائب', seeghahUr: 'جمع مذکر غائب', seeghahEn: '3rd Masc. Pl.', arabic: `يَ${muzStem}ُوْنَ`, marker: 'يَـ ... ـُوْنَ', urduMeaning: `وہ سب مرد ${cfg.urduPresStem}تے ہیں` },
    { index: 4, groupUr: 'غائب', seeghahUr: 'واحد مؤنث غائب', seeghahEn: '3rd Fem. Sg.', arabic: `تَ${muzStem}ُ`, marker: 'تَـ ... ـُ', urduMeaning: `وہ ایک عورت ${cfg.urduPresStem}تی ہے` },
    { index: 5, groupUr: 'غائب', seeghahUr: 'تثنیہ مؤنث غائب', seeghahEn: '3rd Fem. Dual', arabic: `تَ${muzStem}َانِ`, marker: 'تَـ ... ـَانِ', urduMeaning: `وہ دو عورتیں ${cfg.urduPresStem}تی ہیں` },
    { index: 6, groupUr: 'غائب', seeghahUr: 'جمع مؤنث غائب', seeghahEn: '3rd Fem. Pl.', arabic: `يَ${muzStem}ْنَ`, marker: 'يَـ ... ـْنَ', urduMeaning: `وہ سب عورتیں ${cfg.urduPresStem}تی ہیں` },
    { index: 7, groupUr: 'حاضر', seeghahUr: 'واحد مذکر حاضر', seeghahEn: '2nd Masc. Sg.', arabic: `تَ${muzStem}ُ`, marker: 'تَـ ... ـُ', urduMeaning: `تُو ایک مرد ${cfg.urduPresStem}تا ہے` },
    { index: 8, groupUr: 'حاضر', seeghahUr: 'تثنیہ مذکر حاضر', seeghahEn: '2nd Masc. Dual', arabic: `تَ${muzStem}َانِ`, marker: 'تَـ ... ـَانِ', urduMeaning: `تم دو مرد ${cfg.urduPresStem}تے ہو` },
    { index: 9, groupUr: 'حاضر', seeghahUr: 'جمع مذکر حاضر', seeghahEn: '2nd Masc. Pl.', arabic: `تَ${muzStem}ُوْنَ`, marker: 'تَـ ... ـُوْنَ', urduMeaning: `تم سب مرد ${cfg.urduPresStem}تے ہو` },
    { index: 10, groupUr: 'حاضر', seeghahUr: 'واحد مؤنث حاضر', seeghahEn: '2nd Fem. Sg.', arabic: `تَ${muzStem}ِيْنَ`, marker: 'تَـ ... ـِيْنَ', urduMeaning: `تُو ایک عورت ${cfg.urduPresStem}تی ہے` },
    { index: 11, groupUr: 'حاضر', seeghahUr: 'تثنیہ مؤنث حاضر', seeghahEn: '2nd Fem. Dual', arabic: `تَ${muzStem}َانِ`, marker: 'تَـ ... ـَانِ', urduMeaning: `تم دو عورتیں ${cfg.urduPresStem}تی ہو` },
    { index: 12, groupUr: 'حاضر', seeghahUr: 'جمع مؤنث حاضر', seeghahEn: '2nd Fem. Pl.', arabic: `تَ${muzStem}ْنَ`, marker: 'تَـ ... ـْنَ', urduMeaning: `تم سب عورتیں ${cfg.urduPresStem}تی ہو` },
    { index: 13, groupUr: 'متکلم', seeghahUr: 'واحد متکلم', seeghahEn: '1st Sg.', arabic: `أَ${muzStem}ُ`, marker: 'أَ ... ـُ', urduMeaning: `میں ${cfg.urduPresStem}تا ہوں` },
    { index: 14, groupUr: 'متکلم', seeghahUr: 'جمع متکلم', seeghahEn: '1st Pl.', arabic: `نَ${muzStem}ُ`, marker: 'نَـ ... ـُ', urduMeaning: `ہم ${cfg.urduPresStem}تے ہیں` },
  ];

  const muzari_majhool: GardaanSeeghah[] = [
    { index: 1, groupUr: 'غائب', seeghahUr: 'واحد مذکر غائب', seeghahEn: '3rd Masc. Sg.', arabic: `يُ${muzPassStem}ُ`, marker: 'يُـ ... ـَـُ', urduMeaning: `وہ ${cfg.urduPassPres}تا ہے` },
    { index: 2, groupUr: 'غائب', seeghahUr: 'تثنیہ مذکر غائب', seeghahEn: '3rd Masc. Dual', arabic: `يُ${muzPassStem}َانِ`, marker: 'يُـ ... ـَانِ', urduMeaning: `وہ دو ${cfg.urduPassPres}تے ہیں` },
    { index: 3, groupUr: 'غائب', seeghahUr: 'جمع مذکر غائب', seeghahEn: '3rd Masc. Pl.', arabic: `يُ${muzPassStem}ُوْنَ`, marker: 'يُـ ... ـُوْنَ', urduMeaning: `وہ سب ${cfg.urduPassPres}تے ہیں` },
    { index: 4, groupUr: 'غائب', seeghahUr: 'واحد مؤنث غائب', seeghahEn: '3rd Fem. Sg.', arabic: `تُ${muzPassStem}ُ`, marker: 'تُـ ... ـُ', urduMeaning: `وہ (مؤنث) ${cfg.urduPassPres}تی ہے` },
    { index: 5, groupUr: 'غائب', seeghahUr: 'تثنیہ مؤنث غائب', seeghahEn: '3rd Fem. Dual', arabic: `تُ${muzPassStem}َانِ`, marker: 'تُـ ... ـَانِ', urduMeaning: `وہ دو (مؤنث) ${cfg.urduPassPres}تی ہیں` },
    { index: 6, groupUr: 'غائب', seeghahUr: 'جمع مؤنث غائب', seeghahEn: '3rd Fem. Pl.', arabic: `يُ${muzPassStem}ْنَ`, marker: 'يُـ ... ـْنَ', urduMeaning: `وہ سب (مؤنث) ${cfg.urduPassPres}تی ہیں` },
    { index: 7, groupUr: 'حاضر', seeghahUr: 'واحد مذکر حاضر', seeghahEn: '2nd Masc. Sg.', arabic: `تُ${muzPassStem}ُ`, marker: 'تُـ ... ـُ', urduMeaning: `تُو ${cfg.urduPassPres}تا ہے` },
    { index: 8, groupUr: 'حاضر', seeghahUr: 'تثنیہ مذکر حاضر', seeghahEn: '2nd Masc. Dual', arabic: `تُ${muzPassStem}َانِ`, marker: 'تُـ ... ـَانِ', urduMeaning: `تم دو ${cfg.urduPassPres}تے ہو` },
    { index: 9, groupUr: 'حاضر', seeghahUr: 'جمع مذکر حاضر', seeghahEn: '2nd Masc. Pl.', arabic: `تُ${muzPassStem}ُوْنَ`, marker: 'تُـ ... ـُوْنَ', urduMeaning: `تم سب ${cfg.urduPassPres}تے ہو` },
    { index: 10, groupUr: 'حاضر', seeghahUr: 'واحد مؤنث حاضر', seeghahEn: '2nd Fem. Sg.', arabic: `تُ${muzPassStem}ِيْنَ`, marker: 'تُـ ... ـِيْنَ', urduMeaning: `تُو (مؤنث) ${cfg.urduPassPres}تی ہے` },
    { index: 11, groupUr: 'حاضر', seeghahUr: 'تثنیہ مؤنث حاضر', seeghahEn: '2nd Fem. Dual', arabic: `تُ${muzPassStem}َانِ`, marker: 'تُـ ... ـَانِ', urduMeaning: `تم دو (مؤنث) ${cfg.urduPassPres}تی ہو` },
    { index: 12, groupUr: 'حاضر', seeghahUr: 'جمع مؤنث حاضر', seeghahEn: '2nd Fem. Pl.', arabic: `تُ${muzPassStem}ْنَ`, marker: 'تُـ ... ـْنَ', urduMeaning: `تم سب (مؤنث) ${cfg.urduPassPres}تی ہو` },
    { index: 13, groupUr: 'متکلم', seeghahUr: 'واحد متکلم', seeghahEn: '1st Sg.', arabic: `أُ${muzPassStem}ُ`, marker: 'أُ ... ـُ', urduMeaning: `میں ${cfg.urduPassPres}تا ہوں` },
    { index: 14, groupUr: 'متکلم', seeghahUr: 'جمع متکلم', seeghahEn: '1st Pl.', arabic: `نُ${muzPassStem}ُ`, marker: 'نُـ ... ـُ', urduMeaning: `ہم ${cfg.urduPassPres}تے ہیں` },
  ];

  const amr: GardaanSeeghah[] = [
    { index: 1, groupUr: 'حاضر', seeghahUr: 'واحد مذکر حاضر', seeghahEn: '2nd Masc. Sg.', arabic: `${amrStem}ْ`, marker: 'ـْ (جزم)', urduMeaning: `تُو ${cfg.urduImpSg}` },
    { index: 2, groupUr: 'حاضر', seeghahUr: 'تثنیہ مذکر حاضر', seeghahEn: '2nd Masc. Dual', arabic: `${amrStem}َا`, marker: 'ـَا', urduMeaning: `تم دو ${cfg.urduImpPl}` },
    { index: 3, groupUr: 'حاضر', seeghahUr: 'جمع مذکر حاضر', seeghahEn: '2nd Masc. Pl.', arabic: `${amrStem}ُوْا`, marker: 'ـُوْا', urduMeaning: `تم سب ${cfg.urduImpPl}` },
    { index: 4, groupUr: 'حاضر', seeghahUr: 'واحد مؤنث حاضر', seeghahEn: '2nd Fem. Sg.', arabic: `${amrStem}ِيْ`, marker: 'ـِيْ', urduMeaning: `تُو (عورت) ${cfg.urduImpSg}` },
    { index: 5, groupUr: 'حاضر', seeghahUr: 'تثنیہ مؤنث حاضر', seeghahEn: '2nd Fem. Dual', arabic: `${amrStem}َا`, marker: 'ـَا', urduMeaning: `تم دو عورتیں ${cfg.urduImpPl}` },
    { index: 6, groupUr: 'حاضر', seeghahUr: 'جمع مؤنث حاضر', seeghahEn: '2nd Fem. Pl.', arabic: `${amrStem}ْنَ`, marker: 'ـْنَ', urduMeaning: `تم سب عورتیں ${cfg.urduImpPl}` },
  ];

  const nahi: GardaanSeeghah[] = [
    { index: 1, groupUr: 'حاضر', seeghahUr: 'واحد مذکر حاضر', seeghahEn: '2nd Masc. Sg.', arabic: `لَا تَ${muzStem}ْ`, marker: 'لَا تَـ ... ـْ', urduMeaning: `تُو مت ${cfg.urduImpSg}` },
    { index: 2, groupUr: 'حاضر', seeghahUr: 'تثنیہ مذکر حاضر', seeghahEn: '2nd Masc. Dual', arabic: `لَا تَ${muzStem}َا`, marker: 'لَا تَـ ... ـَا', urduMeaning: `تم دو مت ${cfg.urduImpPl}` },
    { index: 3, groupUr: 'حاضر', seeghahUr: 'جمع مذکر حاضر', seeghahEn: '2nd Masc. Pl.', arabic: `لَا تَ${muzStem}ُوْا`, marker: 'لَا تَـ ... ـُوْا', urduMeaning: `تم سب مت ${cfg.urduImpPl}` },
    { index: 4, groupUr: 'حاضر', seeghahUr: 'واحد مؤنث حاضر', seeghahEn: '2nd Fem. Sg.', arabic: `لَا تَ${muzStem}ِيْ`, marker: 'لَا تَـ ... ـِيْ', urduMeaning: `تُو (عورت) مت ${cfg.urduImpSg}` },
    { index: 5, groupUr: 'حاضر', seeghahUr: 'تثنیہ مؤنث حاضر', seeghahEn: '2nd Fem. Dual', arabic: `لَا تَ${muzStem}َا`, marker: 'لَا تَـ ... ـَا', urduMeaning: `تم دو عورتیں مت ${cfg.urduImpPl}` },
    { index: 6, groupUr: 'حاضر', seeghahUr: 'جمع مؤنث حاضر', seeghahEn: '2nd Fem. Pl.', arabic: `لَا تَ${muzStem}ْنَ`, marker: 'لَا تَـ ... ـْنَ', urduMeaning: `تم سب عورتیں مت ${cfg.urduImpPl}` },
  ];

  return {
    id: cfg.id,
    rootLetters: cfg.rootLetters,
    babNameUr: cfg.babNameUr,
    babNameEn: cfg.babNameEn,
    baseMeaningUr: cfg.baseMeaningUr,
    sagheer: {
      mazi: `${maziBase}َ`,
      muzari: `يَ${muzStem}ُ`,
      masdar: cfg.masdarAr,
      faail: `${c1}َا${c2}ِ${c3}ٌ`,
      mafool: `مَ${c1}ْ${c2}ُوْ${c3}ٌ`,
      amr: `${amrStem}ْ`,
      nahi: `لَا تَ${muzStem}ْ`,
    },
    tenses: {
      mazi_maroof,
      mazi_majhool,
      muzari_maroof,
      muzari_majhool,
      amr,
      nahi,
    },
  };
}

export const GARDAAN_VERBS: GardaanVerbPreset[] = VERB_CONFIGS.map(buildGardaan);
