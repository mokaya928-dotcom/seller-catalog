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
      className={`text-white sticky top-0 z-30 shadow-md transition-all duration-300 border-b ${
        isSlate 
          ? 'bg-gradient-to-r from-slate-950 via-[#0f172a] to-slate-900 border-slate-800' 
          : 'bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 border-emerald-800/80'
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-2.5">
        {/* Row 1: Brand Name, Date & Quick Actions */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 
              className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight truncate drop-shadow-xs"
              style={{ 
                fontFamily: brandFontFamily,
                letterSpacing: '0.015em'
              }}
            >
              {seller.shop_name || 'The Beauty Bar Kenya'}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/90 font-bold mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${pwa && !pwa.isOnline ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span>{todayFormatted}</span>
              {pwa && !pwa.isOnline && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                  Offline
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Quick Palette Toggle (Emerald vs Slate) */}
            <button
              type="button"
              onClick={() => onPaletteChange && onPaletteChange(isSlate ? 'emerald' : 'slate')}
              className="px-2 py-1.5 rounded-xl text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 transition flex items-center gap-1.5 shadow-2xs"
              title={`Theme: ${isSlate ? 'Luxury Slate' : 'Emerald & Gold'}. Click to toggle.`}
            >
              <span 
                className="w-2.5 h-2.5 rounded-full border border-amber-300 shadow-2xs flex-shrink-0" 
                style={{ backgroundColor: isSlate ? '#0f172a' : '#064e3b' }}
              />
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-200">
                {isSlate ? 'Slate' : 'Emerald'}
              </span>
            </button>

            {/* PWA Install Button (if not already installed) */}
            {pwa && !pwa.isInstalled && (
              <button
                type="button"
                onClick={pwa.promptInstall}
                className="px-2 py-1.5 rounded-xl text-[11px] font-black text-amber-300 hover:text-white bg-amber-400/15 hover:bg-amber-400/25 active:bg-amber-400/35 border border-amber-400/30 transition flex items-center gap-1 shadow-2xs active:scale-95"
                title="Install App for fast offline access"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5px] text-amber-300" />
                <span className="text-[10px] uppercase font-black tracking-wider hidden xs:inline">App</span>
              </button>
            )}

            {/* Quick Create Poster Action */}
            {onOpenCreatePoster && (
              <button
                type="button"
                onClick={onOpenCreatePoster}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 border border-amber-300 transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                title="Upload Photo & Generate Instant WhatsApp Flyer"
              >
                <Camera className="w-3.5 h-3.5 stroke-[2.5px] text-slate-950" />
                <span>+ Poster</span>
              </button>
            )}

            {/* Storefront Customer View Link */}
            {onOpenCatalog && (
              <button
                onClick={onOpenCatalog}
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-black text-emerald-950 bg-gradient-to-r from-emerald-300 to-emerald-100 hover:from-white hover:to-emerald-50 border border-emerald-200/80 transition flex items-center gap-1 shadow-sm active:scale-95"
                title="Customer Storefront & Catalogue"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5px] text-emerald-950" />
                <span>Storefront</span>
              </button>
            )}

            {/* Settings Gear */}
            <button
              onClick={onOpenSettings}
              className="w-7 h-7 flex items-center justify-center text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl transition border border-white/15 shadow-2xs active:scale-95"
              aria-label="Shop Brand Settings"
              title="Brand & Shop Settings"
            >
              <Settings className="w-3.5 h-3.5 stroke-[2.2px]" />
            </button>

            {/* Lock Studio Button */}
            {onLock && (
              <button
                type="button"
                onClick={onLock}
                className="w-7 h-7 flex items-center justify-center text-amber-200 hover:text-white bg-amber-400/20 hover:bg-amber-400/30 active:bg-amber-400/40 rounded-xl transition border border-amber-400/30 shadow-2xs active:scale-95 cursor-pointer"
                aria-label="Lock Seller Studio"
                title="Lock Studio (Requires PIN to enter)"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.2px] text-amber-300" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Post Format Ratio Toggle (Status 9:16 vs Group 4:5) */}
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="bg-black/35 backdrop-blur-md p-0.5 rounded-xl flex items-center gap-1 border border-white/10 shadow-inner">
            <button
              onClick={() => onRatioChange('status')}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                ratio === 'status'
                  ? 'bg-white text-emerald-950 shadow-md font-black scale-[1.01]'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${ratio === 'status' ? 'text-emerald-700 stroke-[2.5px]' : 'text-emerald-300/70'}`} />
              <span>Status</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                ratio === 'status' 
                  ? 'bg-emerald-100 text-emerald-900 font-black' 
                  : 'bg-white/10 text-emerald-200/70'
              }`}>
                9:16
              </span>
              {ratio === 'status' && (
                <span className="text-[9px] px-1 py-0.2 rounded font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Active
                </span>
              )}
            </button>

            <button
              onClick={() => onRatioChange('group')}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                ratio === 'group'
                  ? 'bg-white text-emerald-950 shadow-md font-black scale-[1.01]'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className={`w-3.5 h-3.5 ${ratio === 'group' ? 'text-emerald-700 stroke-[2.5px]' : 'text-emerald-300/70'}`} />
              <span>Groups / Posters</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                ratio === 'group' 
                  ? 'bg-emerald-100 text-emerald-900 font-black' 
                  : 'bg-white/10 text-emerald-200/70'
              }`}>
                4:5
              </span>
              {ratio === 'group' && (
                <span className="text-[9px] px-1 py-0.2 rounded font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
