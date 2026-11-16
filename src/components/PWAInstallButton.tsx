import { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Share,
  Smartphone,
  WifiOff,
  X,
} from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton({ compact = false }: { compact?: boolean }) {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInIframe, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  // Native Chromium / Android / Desktop install prompt
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 text-white text-xs font-urdu-ui font-semibold hover:bg-emerald-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[38px]"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>{compact ? 'اینڈرائیڈ انسٹال' : 'اینڈرائیڈ ایپ انسٹال کریں'}</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowGuideModal(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-[11px] font-urdu-ui font-semibold hover:bg-emerald-100 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[38px]"
      >
        <Smartphone className="w-3.5 h-3.5 shrink-0" />
        <span>{compact ? 'اینڈرائیڈ ایپ' : 'موبائل میں انسٹال'}</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md max-h-[90dvh] rounded-t-2xl sm:rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden flex flex-col pb-safe"
          >
            {/* Mobile Drag Handle */}
            <div className="sm:hidden pt-2.5 pb-1 bg-emerald-900 flex justify-center">
              <span className="w-10 h-1 rounded-full bg-emerald-700" />
            </div>

            <div className="px-5 py-3.5 border-b border-slate-100 bg-emerald-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-300 shrink-0" />
                <h3 className="font-urdu text-lg font-bold">
                  {isAndroid ? 'اینڈرائیڈ موبائل پر ایپ انسٹال کریں' : 'موبائل پر ایپ انسٹال کریں'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-emerald-100 hover:bg-emerald-800 cursor-pointer"
                aria-label="بند کریں"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 font-urdu-ui text-sm text-slate-700 overflow-y-auto">
              {isInIframe && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="text-xs font-bold text-amber-950">
                    پیش نظارہ (Preview) سے براہِ راست انسٹال نہیں ہوتا:
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    ایپ کو اپنے فون پر انسٹال کرنے کے لیے پہلے اسے الگ <strong>Chrome</strong> ٹیب میں کھولیں:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={typeof window !== 'undefined' ? window.location.origin : '/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      الگ Chrome ٹیب میں کھولیں
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 bg-white text-amber-950 text-xs font-semibold hover:bg-amber-100 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedUrl ? 'لنک کاپی ہو گیا' : 'ایپ لنک کاپی کریں'}
                    </button>
                  </div>
                </div>
              )}

              {isIOS ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900">iPhone / iPad (Safari):</div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm">
                    <li>
                      اس ایپ کو <strong>Safari</strong> براؤزر میں کھولیں۔
                    </li>
                    <li className="flex items-center gap-1.5 flex-wrap">
                      نیچے موجود <Share className="w-4 h-4 text-sky-600 inline" />{' '}
                      <strong>Share</strong> بٹن پر ٹیپ کریں۔
                    </li>
                    <li>
                      نیچے اسکرول کر کے <strong>Add to Home Screen</strong> پر ٹیپ کریں، پھر{' '}
                      <strong>Add</strong> دبائیں۔
                    </li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div className="font-bold text-emerald-950">
                      طریقہ ١: Android Chrome میں فوری ایپ (WebAPK) انسٹال
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm">
                      <li>ایپ لنک کو اینڈرائیڈ کے <strong>Chrome</strong> میں الگ ٹیب میں کھولیں۔</li>
                      <li>اوپر دائیں کونے میں تین نقطوں (<strong>⋮</strong>) پر ٹیپ کریں۔</li>
                      <li>
                        <strong>Add to Home screen</strong> یا <strong>Install app</strong> ←{' '}
                        <strong>Install</strong> دبائیں۔
                      </li>
                      <li>آپ کے Pixel / Android App Drawer میں حقیقی موبائل ایپ بن جائے گی۔</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900">
                      طریقہ ٢: الگ APK فائل حاصل کرنے کا طریقہ
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      اگر آپ کو شیئر کرنے کے لیے باقاعدہ <strong>.apk</strong> فائل چاہیے تو پہلے اوپر{' '}
                      <strong>Publish / Share</strong> کر کے پبلک لنک بنائیں، پھر اسے{' '}
                      <span className="font-mono text-[11px]" dir="ltr">pwabuilder.com</span>{' '}
                      میں ڈال کر Android APK پیکج ڈاؤن لوڈ کر لیں۔
                    </p>
                  </div>
                </>
              )}

              <p className="text-xs text-slate-500 leading-relaxed">
                انسٹال ہونے کے بعد یہ ایپ بغیر براؤزر بار کے مکمل اینڈرائیڈ ایپ کی طرح کھلے گی اور تمام اسباق، گردان، ترکیب اور لغت آف لائن بھی دستیاب رہیں گے۔
              </p>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
              >
                سمجھ آ گیا
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      dir="rtl"
      className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-urdu-ui font-semibold text-white shadow-lg"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>آف لائن موڈ — محفوظ شدہ اسباق و لغت دستیاب ہیں</span>
    </div>
  );
}
