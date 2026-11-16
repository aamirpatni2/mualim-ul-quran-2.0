import { Fragment, useMemo } from 'react';
import { GRAMMAR_GLOSSARY } from '../data/glossaryData';
import { GrammarTerm } from '../types/quranic';

interface ClickableGrammarTextProps {
  text: string;
  onSelectTerm: (term: GrammarTerm) => void;
  className?: string;
}

interface MatchEntry {
  alias: string;
  term: GrammarTerm;
}

const SORTED_MATCH_ENTRIES: MatchEntry[] = (() => {
  const entries: MatchEntry[] = [];
  for (const term of GRAMMAR_GLOSSARY) {
    const candidates = new Set<string>([term.termUr, term.termAr, ...term.aliases]);
    for (const c of candidates) {
      if (c && c.trim().length >= 2) {
        entries.push({ alias: c.trim(), term });
      }
    }
  }
  return entries.sort((a, b) => b.alias.length - a.alias.length);
})();

export function ClickableGrammarText({
  text,
  onSelectTerm,
  className = '',
}: ClickableGrammarTextProps) {
  const segments = useMemo(() => {
    if (!text) return [{ text: '', term: null as GrammarTerm | null }];

    const result: { text: string; term: GrammarTerm | null }[] = [];
    let cursor = 0;

    while (cursor < text.length) {
      let bestMatch: { index: number; entry: MatchEntry } | null = null;

      for (const entry of SORTED_MATCH_ENTRIES) {
        const idx = text.indexOf(entry.alias, cursor);
        if (idx === -1) continue;
        // Verify clean word boundary around Arabic/Urdu letters so substrings inside unrelated words don't trigger falsely
        const charBefore = idx > 0 ? text[idx - 1] : ' ';
        const charAfter = idx + entry.alias.length < text.length ? text[idx + entry.alias.length] : ' ';
        const isLetter = (ch: string) => /[\u0600-\u06FFa-zA-Z0-9]/.test(ch);
        if (isLetter(charBefore) || isLetter(charAfter)) continue;

        if (
          !bestMatch ||
          idx < bestMatch.index ||
          (idx === bestMatch.index && entry.alias.length > bestMatch.entry.alias.length)
        ) {
          bestMatch = { index: idx, entry };
        }
      }

      if (!bestMatch) {
        result.push({ text: text.slice(cursor), term: null });
        break;
      }

      if (bestMatch.index > cursor) {
        result.push({ text: text.slice(cursor, bestMatch.index), term: null });
      }
      result.push({
        text: text.slice(bestMatch.index, bestMatch.index + bestMatch.entry.alias.length),
        term: bestMatch.entry.term,
      });
      cursor = bestMatch.index + bestMatch.entry.alias.length;
    }

    return result;
  }, [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) =>
        seg.term ? (
          <button
            key={`${seg.term.id}-${idx}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectTerm(seg.term!);
            }}
            title={`${seg.term.termUr} (${seg.term.termEn}) — تفصیل دیکھیں`}
            className="inline text-emerald-800 font-semibold underline decoration-emerald-500/70 decoration-dotted underline-offset-4 hover:bg-emerald-50 hover:text-emerald-950 rounded px-0.5 transition-colors cursor-pointer"
          >
            {seg.text}
          </button>
        ) : (
          <Fragment key={idx}>{seg.text}</Fragment>
        )
      )}
    </span>
  );
}
