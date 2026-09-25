import React from 'react';
import { Settings, Smartphone, Users, MapPin, ShoppingBag, ShieldCheck, Download, Lock, Camera } from 'lucide-react';

export default function Header({ seller, ratio, onRatioChange, onPaletteChange, onOpenSettings, onOpenCatalog, onOpenCreatePoster, onLock, pwa }) {
  // Format today's date cleanly (e.g., "Thu 24 Sept")
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const todayFormatted = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;

  const isSlate = seller.palette === 'slate';

  const brandFontFamily = seller.brand_font === 'Cinzel'
    ? "'Cinzel', Georgia, serif"
    : seller.brand_font === 'Playfair Display'
    ? "'Playfair Display', Georgia, serif"
    : "'Plus Jakarta Sans', -apple-system, sans-serif";

  return (
    <header 
      className={`text-white sticky top-0 z-30 shadow-sm transition-all duration-300 border-b backdrop-blur-md ${
        isSlate 
          ? 'bg-slate-950/95 border-slate-800' 
          : 'bg-emerald-950/95 border-emerald-900'
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-2.5 space-y-2">
        {/* Row 1: Brand Identity & Quick Tools */}
        <div className="flex items-center justify-between gap-2">
          {/* Shop Title & Date */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 
                className="text-base sm:text-lg font-black text-white tracking-tight leading-none truncate"
                style={{ 
                  fontFamily: brandFontFamily,
                  letterSpacing: '0.015em'
                }}
              >
                {seller.shop_name || 'Daily Post Studio'}
              </h1>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${pwa && !pwa.isOnline ? 'bg-amber-400' : 'bg-emerald-400 ring-2 ring-emerald-400/20 animate-pulse'}`} />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-200/70 font-semibold mt-1">
              <span>{todayFormatted}</span>
              {pwa && !pwa.isOnline && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded">
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Quick Create Poster */}
            {onOpenCreatePoster && (
              <button
                type="button"
                onClick={onOpenCreatePoster}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 transition flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                title="Create New Poster (Upload / Snap)"
              >
                <Camera className="w-3.5 h-3.5 text-amber-300 stroke-[2.2px]" />
                <span className="hidden xs:inline">+ Poster</span>
              </button>
            )}

            {/* Customer Storefront View Link */}
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Open Public Customer Catalogue"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.4px]" />
                <span>Storefront</span>
              </button>
            )}

            {/* Palette Switcher */}
            <button
              type="button"
              onClick={() => onPaletteChange && onPaletteChange(isSlate ? 'emerald' : 'slate')}
              className="w-7 h-7 rounded-lg text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 transition flex items-center justify-center shadow-2xs"
              title={`Switch Theme: currently ${isSlate ? 'Luxury Slate' : 'Emerald'}`}
              aria-label="Toggle Theme Palette"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-xs" 
                style={{ backgroundColor: isSlate ? '#0f172a' : '#047857' }}
              />
            </button>

            {/* PWA App Install */}
            {pwa && !pwa.isInstalled && (
              <button
                type="button"
                onClick={pwa.promptInstall}
                className="w-7 h-7 rounded-lg text-amber-300 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 transition flex items-center justify-center shadow-2xs active:scale-95"
                title="Install PWA App"
                aria-label="Install App"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5px]" />
              </button>
            )}

            {/* Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-7 h-7 rounded-lg text-white/80 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 transition flex items-center justify-center shadow-2xs active:scale-95"
              aria-label="Shop Brand Settings"
              title="Shop Profile & Settings"
            >
              <Settings className="w-3.5 h-3.5 stroke-[2.2px]" />
            </button>

            {/* Lock */}
            {onLock && (
              <button
                type="button"
                onClick={onLock}
                className="w-7 h-7 rounded-lg text-amber-300/80 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                aria-label="Lock Studio"
                title="Lock Studio (Require PIN to enter)"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.2px]" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Segmented Post Aspect Ratio Toggle (Apple-style clean tabs) */}
        <div className="bg-black/30 p-1 rounded-xl flex items-center gap-1 border border-white/10">
          <button
            type="button"
            onClick={() => onRatioChange('status')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-bold ${
              ratio === 'status'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className={`w-3.5 h-3.5 ${ratio === 'status' ? 'text-emerald-700 stroke-[2.5px]' : 'text-white/60'}`} />
            <span>WhatsApp Status</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              ratio === 'status' ? 'bg-slate-100 text-slate-700 font-extrabold' : 'bg-white/10 text-white/60'
            }`}>
              9:16
            </span>
          </button>

          <button
            type="button"
            onClick={() => onRatioChange('group')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-xs font-bold ${
              ratio === 'group'
                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className={`w-3.5 h-3.5 ${ratio === 'group' ? 'text-emerald-700 stroke-[2.5px]' : 'text-white/60'}`} />
            <span>Customer Groups</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              ratio === 'group' ? 'bg-slate-100 text-slate-700 font-extrabold' : 'bg-white/10 text-white/60'
            }`}>
              4:5
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
