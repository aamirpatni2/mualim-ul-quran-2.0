import { useState } from 'react';
import { BookOpen, HelpCircle, Loader2, Send, Sparkles, X } from 'lucide-react';
import { LearningMode } from '../types/quranic';
import { VerificationBadge } from './VerificationBadge';

export interface AiTutorContext {
  contextType: 'word' | 'verse' | 'term' | 'lesson';
  contextTitle: string;
  arabicText?: string;
  contextDetails?: string;
}

interface TutorMessage {
  id: string;
  role: 'user' | 'tutor';
  label?: string;
  text: string;
}

interface AiTutorDrawerProps {
  isOpen: boolean;
  context: AiTutorContext | null;
  learningMode: LearningMode;
  studentLevel: string;
  onClose: () => void;
}

export function AiTutorDrawer({
  isOpen,
  context,
  learningMode,
  studentLevel,
  onClose,
}: AiTutorDrawerProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeCtx: AiTutorContext = context ?? {
    contextType: 'lesson',
    contextTitle: 'قرآنی عربی عمومی رہنمائی',
    arabicText: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
    contextDetails: 'General Quranic Arabic learning inquiry',
  };

  const callTutor = async (
    action: 'explain' | 'examples' | 'test' | 'ask',
    userLabel: string,
    customQ?: string
  ) => {
    setErrorMsg(null);
    setLoading(true);
    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: customQ ? customQ : userLabel,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          contextType: activeCtx.contextType,
          contextTitle: activeCtx.contextTitle,
          arabicText: activeCtx.arabicText,
          contextDetails: activeCtx.contextDetails,
          learningMode,
          studentLevel,
          customQuestion: customQ,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'استادِ معلم سے رابطہ نہیں ہو سکا۔');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `t-${Date.now()}`,
            role: 'tutor',
            label: 'AI GENERATED — NEEDS REVIEW',
            text: data.reply,
          },
        ]);
      }
    } catch {
      setErrorMsg('نیٹ ورک خرابی کے باعث جواب موصول نہیں ہو سکا۔ دوبارہ کوشش کریں۔');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;
    setQuestion('');
    callTutor('ask', trimmed, trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[1px] flex justify-end"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="استادِ معلم — قرآنی عربی ٹیوٹر"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        className="w-full max-w-lg bg-white h-dvh border-r border-slate-200 shadow-2xl flex flex-col pt-safe"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <h2 className="font-urdu text-lg font-bold">استادِ معلم (Quranic AI Tutor)</h2>
            </div>
            <p className="font-urdu-ui text-xs text-slate-300">
              موجودہ موضوع: {activeCtx.contextTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Banner + Academic Caution */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <VerificationBadge status="AI GENERATED — NEEDS REVIEW" compact />
            <span className="text-[11px] font-urdu-ui text-slate-500">
              موڈ:{' '}
              {learningMode === 'guided'
                ? 'رہنمائی موڈ'
                : learningMode === 'detailed'
                ? 'تفصیلی مطالعہ'
                : 'امتحانی موڈ'}
            </span>
          </div>
          {activeCtx.arabicText && (
            <div className="font-arabic text-xl text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              {activeCtx.arabicText}
            </div>
          )}

          {/* Three Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              disabled={loading}
              onClick={() => callTutor('explain', 'اسے آسان اردو میں سمجھائیں')}
              className="px-2.5 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-urdu-ui font-semibold hover:bg-emerald-100 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              یہ سمجھائیں
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => callTutor('examples', 'قرآن سے مزید مثالیں دیں')}
              className="px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-urdu-ui font-semibold hover:bg-slate-100 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              مزید مثالیں
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => callTutor('test', 'میری سمجھ کا امتحان لیں')}
              className="px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-urdu-ui font-semibold hover:bg-slate-100 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              میرا ٹیسٹ لیں
            </button>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-center">
              <p className="font-urdu text-base text-slate-800">
                السلام عليكم! اوپر دیے گئے بٹنوں میں سے کوئی منتخب کریں یا اپنا سوال نیچے لکھیں۔
              </p>
              <p className="font-urdu-ui text-xs text-slate-500">
                استادِ معلم آپ کے منتخب لفظ، آیت یا قاعدے کے مطابق جواب دے گا۔ اہم علمی نکات کی تصدیق کے لیے مستند لغت یا استاد سے رجوع کریں۔
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl p-4 space-y-2 ${
                m.role === 'user'
                  ? 'bg-emerald-700 text-white mr-8'
                  : 'bg-slate-50 border border-slate-200 text-slate-900 ml-4'
              }`}
            >
              {m.role === 'tutor' && (
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
                  <span className="text-[11px] font-urdu-ui font-bold text-emerald-800">
                    استادِ معلم
                  </span>
                  <VerificationBadge status="AI GENERATED — NEEDS REVIEW" compact />
                </div>
              )}
              <div className="font-urdu-ui text-sm whitespace-pre-wrap leading-relaxed">
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-urdu-ui text-slate-600">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700 shrink-0" />
              جواب تیار کیا جا رہا ہے...
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-urdu-ui text-rose-800">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Custom Question Input */}
        <form
          onSubmit={handleSubmitCustom}
          className="p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="صرف، نحو یا اس آیت کے بارے میں کوئی سوال پوچھیں..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-urdu-ui focus:outline-none focus:border-emerald-600"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 cursor-pointer shrink-0"
            aria-label="سوال بھیجیں"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </aside>
    </div>
  );
}
