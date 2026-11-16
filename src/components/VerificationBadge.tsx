import { AlertCircle, CheckCircle2, GitBranch, ShieldCheck } from 'lucide-react';
import { VerificationStatus } from '../types/quranic';

export function VerificationBadge({
  status,
  compact = false,
}: {
  status: VerificationStatus;
  compact?: boolean;
}) {
  const config: Record<
    VerificationStatus,
    { labelUr: string; labelEn: string; cls: string; Icon: typeof CheckCircle2 }
  > = {
    'SOURCE VERIFIED': {
      labelUr: 'مستند ماخذ سے تصدیق شدہ',
      labelEn: 'SOURCE VERIFIED',
      cls: 'text-emerald-800 bg-emerald-50 border-emerald-200',
      Icon: ShieldCheck,
    },
    'EXPERT REVIEWED': {
      labelUr: 'علمی نظرِ ثانی شدہ',
      labelEn: 'EXPERT REVIEWED',
      cls: 'text-sky-800 bg-sky-50 border-sky-200',
      Icon: CheckCircle2,
    },
    'AI GENERATED — NEEDS REVIEW': {
      labelUr: 'اے آئی معاونت — علمی تحقیق مطلوب',
      labelEn: 'AI GENERATED — NEEDS REVIEW',
      cls: 'text-amber-800 bg-amber-50 border-amber-200',
      Icon: AlertCircle,
    },
    'MULTIPLE RECOGNIZED ANALYSES': {
      labelUr: 'متعدد مستند نحوی آراء موجود ہیں',
      labelEn: 'MULTIPLE RECOGNIZED ANALYSES',
      cls: 'text-indigo-800 bg-indigo-50 border-indigo-200',
      Icon: GitBranch,
    },
  };

  const item = config[status];
  const Icon = item.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-medium whitespace-nowrap shrink-0 ${item.cls}`}
      title={item.labelUr}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span dir="ltr" className="font-mono tracking-tight">
        {compact ? item.labelEn : `${item.labelEn}`}
      </span>
    </span>
  );
}
