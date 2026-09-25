import React, { useState } from 'react';
import { 
  Download, Smartphone, Share, PlusSquare, X, Sparkles, CheckCircle2, 
  WifiOff, Wifi, MoreVertical, Monitor, ArrowRight, ShieldCheck, Zap 
} from 'lucide-react';

export default function PwaInstallBanner({
  pwa,
  seller,
  viewMode = 'seller',
  hasSelectedItems = false
}) {
  const {
    canInstall,
    isInstalled,
    isDismissed,
    isIOS,
    isAndroid,
    isOnline,
    showOnlineRecovery,
    guideMode,
    setGuideMode,
    promptInstall,
    dismissBanner
  } = pwa;

  // Active guide tab if modal is open: default to current OS or 'android'
  const [activeTab, setActiveTab] = useState(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'desktop';
  });

  // Keep activeTab aligned when modal opens with a specific mode
  React.useEffect(() => {
    if (guideMode) {
      setActiveTab(guideMode);
    }
  }, [guideMode]);

  // If already installed or dismissed, do not render floating banner
  const showBanner = !isInstalled && !isDismissed;

  const isSlate = seller?.palette === 'slate';
  const shopName = seller?.shop_name || 'The Beauty Bar Kenya';

  const bannerTitle = viewMode === 'seller' 
    ? 'Daily Post Studio App' 
    : `${shopName}`;

  const bannerSubtitle = viewMode === 'seller'
    ? '1-tap WhatsApp flyer generator • Works 100% offline'
    : 'Shop authentic beauty offline • 1-tap WhatsApp ordering';

  // Bottom positioning offset depending on viewMode and active bottom bars
  const positionClasses = viewMode === 'seller'
    ? 'bottom-[68px] sm:bottom-6'
    : hasSelectedItems
    ? 'bottom-[84px] sm:bottom-6'
    : 'bottom-4 sm:bottom-6';

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. REAL-TIME CONNECTIVITY STATUS TOAST / PILL */}
      {/* ------------------------------------------------------------- */}
      {!isOnline && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed top-14 left-0 right-0 z-50 px-3 pointer-events-none animate-slide-down"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <div className="bg-amber-500 text-slate-950 font-bold text-xs py-2 px-3.5 rounded-full shadow-lg border border-amber-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <WifiOff className="w-4 h-4 text-slate-950 flex-shrink-0 animate-pulse" />
                <span className="truncate">
                  Offline Mode Active • Flyers &amp; Catalog work 100% offline
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/15 px-2 py-0.5 rounded-full flex-shrink-0">
                Local
              </span>
            </div>
          </div>
        </div>
      )}

      {showOnlineRecovery && (
        <div 
          role="status" 
          aria-live="polite"
          className="fixed top-14 left-0 right-0 z-50 px-3 pointer-events-none animate-slide-down"
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <div className="bg-emerald-600 text-white font-bold text-xs py-2 px-3.5 rounded-full shadow-lg border border-emerald-400 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Wifi className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                <span className="truncate">
                  Back Online • Catalog synchronized
                </span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full flex-shrink-0">
                Synced
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. FLOATING PWA INSTALL BANNER */}
      {/* ------------------------------------------------------------- */}
      {showBanner && (
        <aside 
          aria-label="Install App"
          className={`fixed left-0 right-0 z-40 px-3 pointer-events-none transition-all duration-300 ${positionClasses}`}
        >
          <div className="max-w-md mx-auto pointer-events-auto">
            <div 
              className={`rounded-2xl p-3 shadow-2xl border backdrop-blur-md transition-all duration-200 ${
                isSlate 
                  ? 'bg-slate-950/95 border-amber-400/30 text-white shadow-black/60' 
                  : 'bg-[#043327]/95 border-emerald-400/35 text-white shadow-emerald-950/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Custom App Icon */}
                <div className="relative flex-shrink-0">
                  <img
                    src="/icon-192.png"
                    alt="App Icon"
                    className="w-12 h-12 rounded-xl shadow-md border border-amber-300/40 object-cover"
                    width="48"
                    height="48"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-emerald-950 rounded-full p-0.5 shadow-xs">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                </div>

                {/* Text Description */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xs sm:text-sm font-black tracking-tight leading-tight truncate">
                      {bannerTitle}
                    </h2>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      PWA
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-200/90 leading-snug line-clamp-2 mt-0.5 font-medium">
                    {bannerSubtitle}
                  </p>
                </div>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={dismissBanner}
                  className="text-gray-300 hover:text-white p-1 rounded-lg hover:bg-white/10 active:scale-95 transition flex-shrink-0"
                  aria-label="Dismiss install banner"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={promptInstall}
                  className="flex-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.98] text-emerald-950 font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
                  style={{ minHeight: '38px' }}
                >
                  {isIOS ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>Add to Home Screen</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
                      <span>Install App (1-Tap)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={dismissBanner}
                  className="text-[11px] font-bold text-gray-300 hover:text-white px-2.5 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. MULTI-PLATFORM STEP-BY-STEP INSTALL GUIDE MODAL */}
      {/* ------------------------------------------------------------- */}
      {guideMode && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setGuideMode(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-5 text-gray-900 border border-gray-100 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <img
                  src="/icon-192.png"
                  alt="App Icon"
                  className="w-11 h-11 rounded-2xl shadow-sm border border-emerald-100 object-cover"
                  width="44"
                  height="44"
                />
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                    Install Daily Post App
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Works offline • 0 data required
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuideMode(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
                aria-label="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-3.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'android' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'ios' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                  activeTab === 'desktop' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Mac</span>
              </button>
            </div>

            {/* ----------------- TAB A: ANDROID (Chrome / Edge / Samsung) ----------------- */}
            {activeTab === 'android' && (
              <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    1
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Tap the <strong className="text-gray-900">three dots (⋮)</strong> menu in the top-right corner of Chrome:
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-gray-800 font-bold shadow-2xs">
                      <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[11px]">Browser Menu</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    2
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Tap <strong className="text-gray-900">Install app</strong> or <strong className="text-gray-900">Add to Home screen</strong>:
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-emerald-700 font-bold shadow-2xs">
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px]">Install app</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    3
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Tap <strong className="text-emerald-700">Install</strong> to confirm.
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      ✓ Instant launch icon on home screen • 100% offline
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB B: iOS (Safari) ----------------- */}
            {activeTab === 'ios' && (
              <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    1
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Tap the <strong className="text-gray-900">Share</strong> button in Safari's bottom toolbar:
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-blue-600 font-bold shadow-2xs">
                      <Share className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Share</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    2
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Scroll down and tap <strong className="text-gray-900">Add to Home Screen</strong>:
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-gray-900 font-bold shadow-2xs">
                      <PlusSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px]">Add to Home Screen</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    3
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Tap <strong className="text-emerald-700">Add</strong> in the top-right corner.
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      ✓ Full-screen app • No Safari URL bars
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- TAB C: DESKTOP (Chrome / Edge / Windows / Mac) ----------------- */}
            {activeTab === 'desktop' && (
              <div className="space-y-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    1
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Look at the <strong className="text-gray-900">right side of your browser address bar</strong>.
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1 bg-white px-2 py-0.5 rounded-lg border border-gray-200 text-emerald-700 font-bold shadow-2xs">
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[11px]">Install Icon (⊕ or 🗂️)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    2
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Click <strong className="text-gray-900">Install</strong> on the browser pop-up.
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      A dedicated desktop window will open immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    3
                  </div>
                  <div className="flex-1 text-gray-700">
                    <p className="leading-relaxed">
                      Launch anytime from your <strong className="text-emerald-700">Desktop or Taskbar</strong>.
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      ✓ Instant opening • Works offline
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Offline highlights badge */}
            <div className="mt-3 bg-emerald-50 rounded-xl p-2.5 border border-emerald-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-[11px] text-emerald-900 font-medium leading-tight">
                <strong>Why install?</strong> Generate WhatsApp status flyers with 0 mobile data usage.
              </p>
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={() => setGuideMode(null)}
              className="w-full mt-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
