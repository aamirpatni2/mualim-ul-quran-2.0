import { BookOpen, GitBranch, Link2 } from 'lucide-react';
import { LanguageMode, WordType } from '../types/quranic';

interface WordTypeLabelProps {
  type: WordType;
  languageMode?: LanguageMode;
  compact?: boolean;
}

const TYPE_META: Record<
  WordType,
  {
    ur: string;
    en: string;
    textClass: string;
    borderClass: string;
    bgClass: string;
    Icon: typeof BookOpen;
  }
> = {
  ism: {
    ur: 'اِسْم',
    en: 'Noun / Ism',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    bgClass: 'bg-emerald-50/70',
    Icon: BookOpen,
  },
  fil: {
    ur: 'فِعْل',
    en: 'Verb / Fi’l',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200',
    bgClass: 'bg-blue-50/70',
    Icon: GitBranch,
  },
  harf: {
    ur: 'حَرْف',
    en: 'Particle / Harf',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    bgClass: 'bg-amber-50/70',
    Icon: Link2,
  },
};

export function WordTypeLabel({ type, languageMode = 'bilingual', compact = false }: WordTypeLabelProps) {
  const meta = TYPE_META[type];
  const Icon = meta.Icon;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${meta.textClass}`}>
        <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span className="font-urdu-ui">{meta.ur}</span>
        {languageMode === 'bilingual' && <span className="font-sans opacity-75">· {meta.en.split(' / ')[0]}</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium whitespace-nowrap shrink-0 ${meta.bgClass} ${meta.borderClass} ${meta.textClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="font-urdu-ui font-semibold">{meta.ur}</span>
      {languageMode === 'bilingual' && <span className="font-sans opacity-80">({meta.en})</span>}
    </span>
  );
}
