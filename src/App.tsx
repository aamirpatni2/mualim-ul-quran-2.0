/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  BookOpen,
  Compass,
  Dumbbell,
  Home,
  Library,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Sparkles,
} from 'lucide-react';
import { AiTutorContext, AiTutorDrawer } from './components/AiTutorDrawer';
import { GlobalSearchModal, SearchJumpTarget } from './components/GlobalSearchModal';
import { GrammarTermModal } from './components/GrammarTermModal';
import { HomeDashboardView } from './components/HomeDashboardView';
import { LearnHubView, LearnTrackId } from './components/LearnHubView';
import { LibraryHubView, LibrarySectionId } from './components/LibraryHubView';
import { OnboardingModal } from './components/OnboardingModal';
import { PracticeAreaId, PracticeHubView } from './components/PracticeHubView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';
import { QuranStudioView } from './components/QuranStudioView';
import { LESSONS } from './data/curriculumData';
import { QURAN_STUDIO_SURAHS } from './data/quranStudioData';
import {
  ExamAttemptRecord,
  GrammarTerm,
  LanguageMode,
  LearningMode,
  OnboardingProfile,
  PrimaryNavTab,
  UserProgress,
  VocabSrsStage,
} from './types/quranic';

const PROGRESS_STORAGE_KEY = 'al_muallim_progress_v2';
const LEGACY_STORAGE_KEY = 'fehm_ul_quran_progress_v1';
const PROFILE_STORAGE_KEY = 'al_muallim_profile_v2';
const LEARNING_MODE_KEY = 'al_muallim_learning_mode_v2';
const LANG_MODE_KEY = 'fehm_ul_quran_lang_mode_v1';

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_PROFILE: OnboardingProfile = {
  completed: false,
  skipped: false,
  level: 'absolute_beginner',
  goal: 'understand_quran',
  dailyMinutes: 30,
  dailyWordTarget: 10,
  recommendedLessonId: 'lesson-1',
};

const DEFAULT_PROGRESS: UserProgress = {
  completedLessonIds: [],
  quizScores: {},
  masteredVocabIds: [],
  vocabSrs: {},
  completedSurahIds: [],
  lastLessonId: 'lesson-1',
  lastStudioSurahId: QURAN_STUDIO_SURAHS[0].id,
  lastStudioAyahNumber: 2,
  bookmarks: [],
  notes: [],
  weakTopics: [],
  examHistory: [],
  dailyChecklist: {
    dateKey: getTodayKey(),
    vocabDone: 0,
    grammarDone: false,
    verseDone: false,
    quizDone: false,
  },
  recentActivities: [],
};

function loadInitialProgress(): UserProgress {
  try {
    const rawV2 = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<UserProgress>;
      const todayKey = getTodayKey();
      const checklist =
        parsed.dailyChecklist && parsed.dailyChecklist.dateKey === todayKey
          ? parsed.dailyChecklist
          : { ...DEFAULT_PROGRESS.dailyChecklist, dateKey: todayKey };

      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
        quizScores: parsed.quizScores && typeof parsed.quizScores === 'object' ? parsed.quizScores : {},
        masteredVocabIds: Array.isArray(parsed.masteredVocabIds) ? parsed.masteredVocabIds : [],
        vocabSrs: parsed.vocabSrs && typeof parsed.vocabSrs === 'object' ? parsed.vocabSrs : {},
        completedSurahIds: Array.isArray(parsed.completedSurahIds) ? parsed.completedSurahIds : [],
        bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
        notes: Array.isArray(parsed.notes) ? parsed.notes : [],
        weakTopics: Array.isArray(parsed.weakTopics) ? parsed.weakTopics : [],
        examHistory: Array.isArray(parsed.examHistory) ? parsed.examHistory : [],
        recentActivities: Array.isArray(parsed.recentActivities) ? parsed.recentActivities : [],
        dailyChecklist: checklist,
      };
    }
    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawLegacy) {
      const legacy = JSON.parse(rawLegacy) as Partial<UserProgress>;
      return {
        ...DEFAULT_PROGRESS,
        completedLessonIds: Array.isArray(legacy.completedLessonIds) ? legacy.completedLessonIds : [],
        quizScores: legacy.quizScores ?? {},
        masteredVocabIds: Array.isArray(legacy.masteredVocabIds) ? legacy.masteredVocabIds : [],
        completedSurahIds: Array.isArray(legacy.completedSurahIds) ? legacy.completedSurahIds : [],
        lastLessonId: legacy.lastLessonId ?? 'lesson-1',
      };
    }
  } catch {
    // Fallback cleanly
  }
  return DEFAULT_PROGRESS;
}

function loadInitialProfile(): OnboardingProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<OnboardingProfile>) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

const VALID_TABS: PrimaryNavTab[] = ['home', 'learn', 'studio', 'practice', 'library'];
const VALID_TRACKS: LearnTrackId[] = [
  'curriculum',
  'sarf_concepts',
  'gardaan',
  'abwab',
  'nahw_irab',
  'balagha',
  'classical',
];

function getInitialRouteParams(): { tab: PrimaryNavTab; track: LearnTrackId } {
  try {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as PrimaryNavTab | null;
    const trackParam = params.get('track') as LearnTrackId | null;
    return {
      tab: tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'home',
      track: trackParam && VALID_TRACKS.includes(trackParam) ? trackParam : 'curriculum',
    };
  } catch {
    return { tab: 'home', track: 'curriculum' };
  }
}

export default function App() {
  const initialRoute = getInitialRouteParams();
  const [activeTab, setActiveTab] = useState<PrimaryNavTab>(initialRoute.tab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(loadInitialProgress);
  const [profile, setProfile] = useState<OnboardingProfile>(loadInitialProfile);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(
    () => !profile.completed && !profile.skipped
  );

  const [learningMode, setLearningMode] = useState<LearningMode>(() => {
    try {
      const saved = localStorage.getItem(LEARNING_MODE_KEY);
      if (saved === 'detailed' || saved === 'exam' || saved === 'guided') return saved;
    } catch {
      // Ignore
    }
    return 'guided';
  });

  const [languageMode, setLanguageMode] = useState<LanguageMode>(() => {
    try {
      return localStorage.getItem(LANG_MODE_KEY) === 'urdu' ? 'urdu' : 'bilingual';
    } catch {
      return 'bilingual';
    }
  });

  // Sub-navigation states across the 5 Primary Workspaces
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [learnTrack, setLearnTrack] = useState<LearnTrackId>(initialRoute.track);
  const [studioSurahId, setStudioSurahId] = useState<string>(
    () => progress.lastStudioSurahId || QURAN_STUDIO_SURAHS[0].id
  );
  const [studioAyahNumber, setStudioAyahNumber] = useState<number>(
    () => progress.lastStudioAyahNumber || 2
  );
  const [studioWordId, setStudioWordId] = useState<string | null>(null);
  const [practiceArea, setPracticeArea] = useState<PracticeAreaId>('vocab');
  const [librarySection, setLibrarySection] = useState<LibrarySectionId>('vocab');

  // Global overlays
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeGrammarTerm, setActiveGrammarTerm] = useState<GrammarTerm | null>(null);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [aiTutorContext, setAiTutorContext] = useState<AiTutorContext | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore quota errors
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(LEARNING_MODE_KEY, learningMode);
    } catch {
      // Ignore
    }
  }, [learningMode]);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_MODE_KEY, languageMode);
    } catch {
      // Ignore
    }
  }, [languageMode]);

  // Ctrl+K / Cmd+K global search shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const pushActivity = (labelUr: string) => {
    setProgress((prev) => ({
      ...prev,
      recentActivities: [
        { id: `act-${Date.now()}`, labelUr, timestamp: new Date().toISOString() },
        ...prev.recentActivities.slice(0, 14),
      ],
    }));
  };

  const handleStartLesson = (lessonId: string) => {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    setActiveTab('learn');
    setLearnTrack('curriculum');
    setActiveLessonId(lessonId);
    setProgress((prev) => ({ ...prev, lastLessonId: lessonId }));
    if (lesson) pushActivity(`سبق ${lesson.number} کا مطالعہ: ${lesson.titleUr}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLesson = (lessonId: string, scorePct: number) => {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    setProgress((prev) => ({
      ...prev,
      completedLessonIds: prev.completedLessonIds.includes(lessonId)
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId],
      quizScores: {
        ...prev.quizScores,
        [lessonId]: Math.max(prev.quizScores[lessonId] ?? 0, scorePct),
      },
      dailyChecklist: {
        ...prev.dailyChecklist,
        grammarDone: true,
        quizDone: true,
      },
    }));
    if (lesson) pushActivity(`سبق ${lesson.number} مکمل (${scorePct}%)`);
  };

  const handleOpenQuranStudio = (surahId: string, ayahNumber: number, wordId?: string | null) => {
    setStudioSurahId(surahId);
    setStudioAyahNumber(ayahNumber);
    setStudioWordId(wordId ?? null);
    setActiveTab('studio');
    setProgress((prev) => ({
      ...prev,
      lastStudioSurahId: surahId,
      lastStudioAyahNumber: ayahNumber,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateVocabSrs = (vocabId: string, stage: VocabSrsStage) => {
    const now = new Date().toISOString();
    setProgress((prev) => {
      const prevRec = prev.vocabSrs[vocabId];
      const nextMastered =
        stage === 'mastered'
          ? Array.from(new Set([...prev.masteredVocabIds, vocabId]))
          : prev.masteredVocabIds.filter((id) => id !== vocabId);

      return {
        ...prev,
        masteredVocabIds: nextMastered,
        vocabSrs: {
          ...prev.vocabSrs,
          [vocabId]: {
            stage,
            reviewCount: (prevRec?.reviewCount ?? 0) + 1,
            lastReviewedAt: now,
            nextReviewAt: now,
          },
        },
        dailyChecklist: {
          ...prev.dailyChecklist,
          vocabDone: prev.dailyChecklist.vocabDone + 1,
        },
      };
    });
  };

  const handleLogWeakTopic = (
    titleUr: string,
    sourceKind: 'quiz' | 'tarkib' | 'vocab' | 'gardaan',
    termId?: string
  ) => {
    setProgress((prev) => {
      const existing = prev.weakTopics.find((w) => w.titleUr === titleUr);
      const updated = existing
        ? prev.weakTopics.map((w) =>
            w.titleUr === titleUr
              ? { ...w, missedCount: w.missedCount + 1, lastMissedAt: new Date().toISOString() }
              : w
          )
        : [
            {
              id: `wt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              titleUr,
              sourceKind,
              missedCount: 1,
              termId,
              lastMissedAt: new Date().toISOString(),
            },
            ...prev.weakTopics,
          ];
      return { ...prev, weakTopics: updated };
    });
  };

  const handleRecordExamAttempt = (record: ExamAttemptRecord, missedTopics: string[]) => {
    setProgress((prev) => {
      const weak = [...prev.weakTopics];
      for (const topic of missedTopics) {
        const idx = weak.findIndex((w) => w.titleUr === topic);
        if (idx >= 0) {
          weak[idx] = {
            ...weak[idx],
            missedCount: weak[idx].missedCount + 1,
            lastMissedAt: record.completedAt,
          };
        } else {
          weak.unshift({
            id: `wt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            titleUr: topic,
            sourceKind: 'tarkib',
            missedCount: 1,
            lastMissedAt: record.completedAt,
          });
        }
      }
      return {
        ...prev,
        examHistory: [record, ...prev.examHistory],
        weakTopics: weak,
        dailyChecklist: { ...prev.dailyChecklist, quizDone: true },
      };
    });
    pushActivity(`امتحانی پرچہ مکمل (${record.scorePct}%)`);
  };

  const handleToggleBookmark = (item: {
    id: string;
    kind: 'word' | 'verse' | 'lesson' | 'term' | 'tarkib';
    titleUr: string;
    subtitleUr?: string;
    arabic?: string;
    refTarget: {
      tab: PrimaryNavTab;
      surahId?: string;
      ayahNumber?: number;
      wordId?: string;
      lessonId?: string;
      termId?: string;
    };
  }) => {
    setProgress((prev) => {
      const exists = prev.bookmarks.some((b) => b.id === item.id);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter((b) => b.id !== item.id)
          : [{ ...item, createdAt: new Date().toISOString() }, ...prev.bookmarks],
      };
    });
  };

  const handleSaveNote = (
    targetKey: string,
    targetTitle: string,
    targetType: 'word' | 'verse' | 'term' | 'lesson',
    content: string
  ) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    setProgress((prev) => {
      const exists = prev.notes.some((n) => n.targetKey === targetKey);
      const notes = exists
        ? prev.notes.map((n) =>
            n.targetKey === targetKey
              ? { ...n, content: trimmed, updatedAt: new Date().toISOString() }
              : n
          )
        : [
            {
              id: `note-${Date.now()}`,
              targetType,
              targetKey,
              targetTitle,
              content: trimmed,
              updatedAt: new Date().toISOString(),
            },
            ...prev.notes,
          ];
      return { ...prev, notes };
    });
  };

  const handleSearchJump = (target: SearchJumpTarget) => {
    if (target.term) {
      setActiveGrammarTerm(target.term);
      return;
    }
    if (target.tab === 'studio' && target.surahId) {
      handleOpenQuranStudio(target.surahId, target.ayahNumber ?? 1, target.wordId);
      return;
    }
    if (target.tab === 'learn' && target.lessonId) {
      handleStartLesson(target.lessonId);
      return;
    }
    if (target.tab === 'library') {
      setActiveTab('library');
      if (target.librarySection) setLibrarySection(target.librarySection);
      return;
    }
    setActiveTab(target.tab);
  };

  const navDestinations: {
    id: PrimaryNavTab;
    labelUr: string;
    labelEn: string;
    Icon: typeof Home;
  }[] = [
    { id: 'home', labelUr: 'ہوم', labelEn: 'HOME', Icon: Home },
    { id: 'learn', labelUr: 'تعلیم', labelEn: 'LEARN', Icon: BookOpen },
    { id: 'studio', labelUr: 'قرآن اسٹوڈیو', labelEn: 'QURAN STUDIO', Icon: Compass },
    { id: 'practice', labelUr: 'مشق', labelEn: 'PRACTICE', Icon: Dumbbell },
    { id: 'library', labelUr: 'لائبریری', labelEn: 'LIBRARY', Icon: Library },
  ];

  return (
    <div className="min-h-dvh flex bg-[#F7F8F6] text-slate-900" dir="rtl">
      {/* Desktop Collapsible Sidebar (Right-docked for RTL) */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 text-slate-100 border-l border-slate-800 sticky top-0 h-screen shrink-0 transition-all no-print ${
          sidebarCollapsed ? 'w-[76px]' : 'w-60'
        }`}
      >
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between gap-2">
          {!sidebarCollapsed && (
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="text-right cursor-pointer min-w-0"
            >
              <div className="font-urdu text-lg font-bold text-white leading-tight truncate">
                المعلّم ٢.٠
              </div>
              <div className="text-[10px] font-mono text-emerald-300 truncate" dir="ltr">
                AL-MUALLIM ACADEMY
              </div>
            </button>
          )}
          <button
            type="button"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer mx-auto"
            aria-label={sidebarCollapsed ? 'سائیڈ بار کھولیں' : 'سائیڈ بار سمیٹیں'}
          >
            {sidebarCollapsed ? (
              <PanelRightOpen className="w-4 h-4" />
            ) : (
              <PanelRightClose className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1.5">
          {navDestinations.map(({ id, labelUr, labelEn, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  if (id !== 'learn') setActiveLessonId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                title={labelUr}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start min-w-0">
                    <span className="font-urdu-ui text-sm leading-snug">{labelUr}</span>
                    {languageMode === 'bilingual' && (
                      <span className="text-[10px] font-mono opacity-65" dir="ltr">
                        {labelEn}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-slate-800 space-y-2 text-xs font-urdu-ui text-slate-400">
            <div className="flex justify-between">
              <span>مکمل اسباق</span>
              <span className="font-mono-tabular text-emerald-300" dir="ltr">
                {progress.completedLessonIds.length}/{LESSONS.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setAiTutorContext({
                  contextType: 'lesson',
                  contextTitle: 'قرآنی عربی عمومی رہنمائی',
                });
                setAiTutorOpen(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-800 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              استادِ معلم (AI Tutor)
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
        {/* Compact Global Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 pt-safe no-print">
          <div className="h-14 sm:h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="md:hidden font-urdu text-lg font-bold text-emerald-900 whitespace-nowrap cursor-pointer"
              >
                المعلّم ٢.٠
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="تلاش کریں"
                className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-400 text-xs font-urdu-ui text-slate-600 cursor-pointer min-w-0 sm:w-72 justify-between min-h-[38px]"
              >
                <span className="inline-flex items-center gap-1.5 truncate">
                  <Search className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="hidden xs:inline sm:inline truncate">تلاش: لفظ، مادہ، اصطلاح...</span>
                  <span className="xs:hidden sm:hidden">تلاش</span>
                </span>
                <kbd
                  className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400"
                  dir="ltr"
                >
                  Ctrl+K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* 3-Way Learning Mode Switcher (Desktop / Tablet) */}
              <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl gap-0.5 text-[11px] font-urdu-ui">
                {(
                  [
                    { id: 'guided', label: 'رہنمائی' },
                    { id: 'detailed', label: 'تفصیلی' },
                    { id: 'exam', label: 'امتحان' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setLearningMode(m.id)}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer whitespace-nowrap ${
                      learningMode === m.id
                        ? 'bg-white text-emerald-800 font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Language Mode Toggle */}
              <button
                type="button"
                onClick={() => setLanguageMode((m) => (m === 'urdu' ? 'bilingual' : 'urdu'))}
                className="px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-[11px] font-urdu-ui font-semibold text-slate-700 hover:border-slate-300 cursor-pointer whitespace-nowrap min-h-[38px]"
              >
                {languageMode === 'urdu' ? 'اردو' : 'اردو+EN'}
              </button>

              <PWAInstallButton compact />

              <button
                type="button"
                onClick={() => {
                  setAiTutorContext({
                    contextType: 'lesson',
                    contextTitle: 'قرآنی عربی فوری سوال',
                  });
                  setAiTutorOpen(true);
                }}
                className="md:hidden p-2 rounded-xl bg-slate-900 text-amber-300 cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                aria-label="استادِ معلم"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Compact Mode Switcher Strip */}
          <div className="sm:hidden px-3 pb-2 flex items-center justify-between gap-2 border-t border-slate-100 pt-1.5 bg-slate-50/70">
            <span className="text-[11px] font-urdu-ui text-slate-500 whitespace-nowrap">
              تعلیمی موڈ:
            </span>
            <div className="flex bg-slate-200/70 p-0.5 rounded-lg gap-0.5 text-[11px] font-urdu-ui flex-1 max-w-[260px]">
              {(
                [
                  { id: 'guided', label: 'رہنمائی' },
                  { id: 'detailed', label: 'تفصیلی' },
                  { id: 'exam', label: 'امتحان' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLearningMode(m.id)}
                  className={`flex-1 py-1 rounded-md cursor-pointer whitespace-nowrap text-center ${
                    learningMode === m.id
                      ? 'bg-white text-emerald-800 font-bold shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Active Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
          {activeTab === 'home' && (
            <HomeDashboardView
              progress={progress}
              profile={profile}
              learningMode={learningMode}
              onNavigateTab={(t) => setActiveTab(t)}
              onStartLesson={handleStartLesson}
              onOpenQuranStudio={(sId, aNum) => handleOpenQuranStudio(sId, aNum)}
              onOpenPracticeArea={(area) => {
                setPracticeArea(area === 'quiz' ? 'exam' : area);
                setActiveTab('practice');
              }}
              onOpenOnboarding={() => setShowOnboarding(true)}
              onUpdateDailyWordTarget={(target) =>
                setProfile((p) => ({ ...p, dailyWordTarget: target }))
              }
              onOpenAiTutor={(ctx) => {
                setAiTutorContext(ctx);
                setAiTutorOpen(true);
              }}
            />
          )}

          {activeTab === 'learn' && (
            <LearnHubView
              languageMode={languageMode}
              learningMode={learningMode}
              progress={progress}
              activeLessonId={activeLessonId}
              activeTrack={learnTrack}
              onChangeTrack={setLearnTrack}
              onSelectLesson={handleStartLesson}
              onCloseLesson={() => setActiveLessonId(null)}
              onCompleteLesson={handleCompleteLesson}
              onSelectGrammarTerm={(t) => setActiveGrammarTerm(t)}
              onOpenAiTutor={(ctx) => {
                setAiTutorContext(ctx);
                setAiTutorOpen(true);
              }}
              onLogWeakTopic={(title, kind) => handleLogWeakTopic(title, kind)}
            />
          )}

          {activeTab === 'studio' && (
            <QuranStudioView
              languageMode={languageMode}
              learningMode={learningMode}
              progress={progress}
              selectedSurahId={studioSurahId}
              selectedAyahNumber={studioAyahNumber}
              selectedWordId={studioWordId}
              onSelectLocation={(sId, aNum, wId) => {
                setStudioSurahId(sId);
                setStudioAyahNumber(aNum);
                setStudioWordId(wId ?? null);
                setProgress((p) => ({
                  ...p,
                  lastStudioSurahId: sId,
                  lastStudioAyahNumber: aNum,
                }));
              }}
              onSelectGrammarTerm={(t) => setActiveGrammarTerm(t)}
              onOpenAiTutor={(ctx) => {
                setAiTutorContext(ctx);
                setAiTutorOpen(true);
              }}
              onOpenRootInLibrary={() => {
                setLibrarySection('roots');
                setActiveTab('library');
              }}
              onToggleBookmark={(bm) =>
                handleToggleBookmark({
                  id: bm.id,
                  kind: bm.kind,
                  titleUr: bm.titleUr,
                  subtitleUr: bm.subtitleUr,
                  arabic: bm.arabic,
                  refTarget: {
                    tab: 'studio',
                    surahId: bm.surahId,
                    ayahNumber: bm.ayahNumber,
                    wordId: bm.wordId,
                  },
                })
              }
              onSaveNote={(key, title, type, content) => handleSaveNote(key, title, type, content)}
              onMarkVerseAnalyzed={(sId) =>
                setProgress((prev) => ({
                  ...prev,
                  completedSurahIds: prev.completedSurahIds.includes(sId)
                    ? prev.completedSurahIds
                    : [...prev.completedSurahIds, sId],
                  dailyChecklist: { ...prev.dailyChecklist, verseDone: true },
                }))
              }
            />
          )}

          {activeTab === 'practice' && (
            <PracticeHubView
              languageMode={languageMode}
              learningMode={learningMode}
              progress={progress}
              activeArea={practiceArea}
              onChangeArea={setPracticeArea}
              onUpdateVocabSrs={handleUpdateVocabSrs}
              onRecordExamAttempt={handleRecordExamAttempt}
              onResolveWeakTopic={(id) =>
                setProgress((p) => ({
                  ...p,
                  weakTopics: p.weakTopics.filter((w) => w.id !== id),
                }))
              }
              onSelectGrammarTerm={(t) => setActiveGrammarTerm(t)}
            />
          )}

          {activeTab === 'library' && (
            <LibraryHubView
              languageMode={languageMode}
              progress={progress}
              activeSection={librarySection}
              onChangeSection={setLibrarySection}
              onSelectGrammarTerm={(t) => setActiveGrammarTerm(t)}
              onJumpToLesson={handleStartLesson}
              onJumpToStudio={(sId, aNum, wId) => handleOpenQuranStudio(sId, aNum, wId)}
              onRemoveBookmark={(id) =>
                setProgress((p) => ({
                  ...p,
                  bookmarks: p.bookmarks.filter((b) => b.id !== id),
                }))
              }
              onDeleteNote={(id) =>
                setProgress((p) => ({
                  ...p,
                  notes: p.notes.filter((n) => n.id !== id),
                }))
              }
            />
          )}
        </main>
      </div>

      {/* Android Material 3 Style Bottom 5-Destination Navigation Bar */}
      <nav
        aria-label="بنیادی مینو"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-[0_-4px_20px_rgba(15,23,42,0.06)] no-print"
      >
        <div className="grid grid-cols-5 min-h-[60px] px-1">
          {navDestinations.map(({ id, labelUr, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveTab(id);
                  if (id !== 'learn') setActiveLessonId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center gap-0.5 py-1.5 cursor-pointer transition-colors ${
                  active ? 'text-emerald-900 font-bold' : 'text-slate-500 active:text-slate-800'
                }`}
              >
                <span
                  className={`px-3.5 py-1 rounded-full transition-colors ${
                    active ? 'bg-emerald-100 text-emerald-800' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-urdu-ui whitespace-nowrap leading-tight">
                  {labelUr}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global Overlays */}
      <OnboardingModal
        isOpen={showOnboarding}
        initialProfile={profile}
        onComplete={(newProfile, suggestedMode) => {
          setProfile(newProfile);
          setLearningMode(suggestedMode);
          setShowOnboarding(false);
          setProgress((p) => ({ ...p, lastLessonId: newProfile.recommendedLessonId }));
        }}
        onSkip={() => {
          setProfile((p) => ({ ...p, skipped: true }));
          setShowOnboarding(false);
        }}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJump={handleSearchJump}
      />

      <GrammarTermModal
        term={activeGrammarTerm}
        learningMode={learningMode}
        isBookmarked={
          activeGrammarTerm
            ? progress.bookmarks.some((b) => b.id === `bm-term-${activeGrammarTerm.id}`)
            : false
        }
        existingNote={
          activeGrammarTerm
            ? progress.notes.find((n) => n.targetKey === `term-${activeGrammarTerm.id}`)?.content ??
              ''
            : ''
        }
        onClose={() => setActiveGrammarTerm(null)}
        onSelectRelatedTerm={(t) => setActiveGrammarTerm(t)}
        onToggleBookmark={(t) =>
          handleToggleBookmark({
            id: `bm-term-${t.id}`,
            kind: 'term',
            titleUr: t.termUr,
            subtitleUr: t.simpleUrduDef,
            arabic: t.termAr,
            refTarget: { tab: 'library', termId: t.id },
          })
        }
        onSaveNote={(t, content) => handleSaveNote(`term-${t.id}`, t.termUr, 'term', content)}
        onAddRevision={(t) => handleLogWeakTopic(t.termUr, 'tarkib', t.id)}
        onAskAiTutor={(t) => {
          setAiTutorContext({
            contextType: 'term',
            contextTitle: `نحوی اصطلاح: ${t.termUr} (${t.termAr})`,
            arabicText: t.quranExampleAr,
            contextDetails: `${t.simpleUrduDef} | Rule: ${t.grammaticalRuleUr}`,
          });
          setAiTutorOpen(true);
        }}
      />

      <AiTutorDrawer
        isOpen={aiTutorOpen}
        context={aiTutorContext}
        learningMode={learningMode}
        studentLevel={profile.level}
        onClose={() => setAiTutorOpen(false)}
      />

      <OfflineIndicator />
    </div>
  );
}
