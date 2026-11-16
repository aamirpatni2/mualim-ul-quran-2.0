import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ScholarlyImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ScholarlyImage({ src, alt, className = '', fallbackTitle }: ScholarlyImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50/40 to-slate-200 text-slate-600 p-6 text-center ${className}`}
      >
        <BookOpen className="w-8 h-8 text-emerald-700 mb-2" aria-hidden="true" />
        {fallbackTitle && <span className="text-sm font-medium text-slate-700">{fallbackTitle}</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
