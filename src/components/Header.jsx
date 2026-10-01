import React from 'react';
import { Settings, Smartphone, Users, ShoppingBag, Download, Lock } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Header({ seller, ratio, onRatioChange, onPaletteChange, onOpenSettings, onOpenCatalog, onOpenCreatePoster, onLock, pwa }) {
  const { theme, isAirbnb, isApple, toggleTheme } = useTheme();

  // Format today's date cleanly (e.g., "Thu 24 Sept")
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const todayFormatted = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;

  return (
    <header 
      className="sticky top-0 z-30 transition-all duration-300"
      style={{
        backgroundColor: 'var(--theme-header-bg)',
        backdropFilter: 'var(--theme-header-backdrop)',
        WebkitBackdropFilter: 'var(--theme-header-backdrop)',
        borderBottom: 'var(--theme-header-border)',
        boxShadow: 'var(--theme-header-shadow)',
        fontFamily: 'var(--theme-font-family)',
        color: 'var(--theme-header-text)'
      }}
    >
      <div 
        className="max-w-md mx-auto space-y-2"
        style={{
          padding: '10px var(--theme-spacing-base)'
        }}
      >
        {/* Row 1: Brand Identity & Quick Tools */}
        <div className="flex items-center justify-between gap-2">
          {/* Shop Title & Date */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 
                className="text-base sm:text-lg font-black tracking-tight leading-none truncate"
                style={{ 
                  color: 'var(--theme-header-text)',
                  fontFamily: 'var(--theme-font-display)',
                  letterSpacing: 'var(--theme-letter-spacing-display)'
                }}
              >
                {seller.shop_name || 'Daily Post Studio'}
              </h1>
              <span 
                className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" 
                style={{
                  backgroundColor: pwa && !pwa.isOnline ? '#f59e0b' : 'var(--theme-color-primary)'
                }}
              />
            </div>
            <div 
              className="flex items-center gap-2 text-[10px] font-semibold mt-1"
              style={{ color: 'var(--theme-color-muted)' }}
            >
              <span>{todayFormatted}</span>
              {pwa && !pwa.isOnline && (
                <span 
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#f59e0b'
                  }}
                >
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Customer Storefront View Link */}
            {onOpenCatalog && (
              <button
                type="button"
                onClick={onOpenCatalog}
                className="px-2.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                style={{
                  backgroundColor: 'var(--theme-color-primary)',
                  color: 'var(--theme-color-on-primary)',
                  borderRadius: 'var(--theme-radius-button)'
                }}
                title="Open Public Customer Catalogue"
              >
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.4px]" />
                <span>Storefront</span>
              </button>
            )}

            {/* Token Theme Switcher: Airbnb ↔ Apple */}
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2 py-1 text-[11px] font-extrabold border transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
              style={{
                backgroundColor: 'var(--theme-color-surface-soft)',
                borderColor: 'var(--theme-color-border-hairline)',
                color: 'var(--theme-color-ink)',
                borderRadius: 'var(--theme-radius-badge)'
              }}
              title={`Active Design System: ${isAirbnb ? 'Airbnb (Rausch)' : 'Apple (SF Pro)'}. Click to switch.`}
              aria-label="Toggle Design System"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full shadow-2xs flex-shrink-0"
                style={{
                  backgroundColor: isAirbnb ? '#ff385c' : '#0071e3'
                }}
              />
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {isAirbnb ? 'Airbnb' : 'Apple'}
              </span>
            </button>

            {/* PWA App Install */}
            {pwa && !pwa.isInstalled && (
              <button
                type="button"
                onClick={pwa.promptInstall}
                className="w-7 h-7 border transition flex items-center justify-center shadow-2xs active:scale-95"
                style={{
                  backgroundColor: 'var(--theme-color-surface-soft)',
                  borderColor: 'var(--theme-color-border-hairline)',
                  color: 'var(--theme-color-primary)',
                  borderRadius: 'var(--theme-radius-button)'
                }}
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
              className="w-7 h-7 border transition flex items-center justify-center shadow-2xs active:scale-95"
              style={{
                backgroundColor: 'var(--theme-color-surface-soft)',
                borderColor: 'var(--theme-color-border-hairline)',
                color: 'var(--theme-color-muted)',
                borderRadius: 'var(--theme-radius-button)'
              }}
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
                className="w-7 h-7 border transition flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: 'var(--theme-color-surface-soft)',
                  borderColor: 'var(--theme-color-border-hairline)',
                  color: 'var(--theme-color-muted)',
                  borderRadius: 'var(--theme-radius-button)'
                }}
                aria-label="Lock Studio"
                title="Lock Studio (Require PIN to enter)"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.2px]" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Segmented Post Aspect Ratio Toggle */}
        <div 
          className="p-1 flex items-center gap-1 border"
          style={{
            backgroundColor: 'var(--theme-color-surface-soft)',
            borderColor: 'var(--theme-color-border-hairline)',
            borderRadius: 'var(--theme-radius-button)'
          }}
        >
          <button
            type="button"
            onClick={() => onRatioChange('status')}
            className="flex-1 py-1.5 px-3 flex items-center justify-center gap-2 transition-all text-xs font-bold"
            style={{
              backgroundColor: ratio === 'status' ? 'var(--theme-color-surface-card)' : 'transparent',
              color: ratio === 'status' ? 'var(--theme-color-ink)' : 'var(--theme-color-muted)',
              borderRadius: 'var(--theme-radius-button)',
              boxShadow: ratio === 'status' ? 'var(--theme-shadow-badge)' : 'none'
            }}
          >
            <Smartphone 
              className="w-3.5 h-3.5" 
              style={{
                color: ratio === 'status' ? 'var(--theme-color-primary)' : 'var(--theme-color-muted)'
              }}
            />
            <span>WhatsApp Status</span>
            <span 
              className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold"
              style={{
                backgroundColor: ratio === 'status' ? 'var(--theme-color-surface-soft)' : 'transparent',
                color: 'var(--theme-color-muted)'
              }}
            >
              9:16
            </span>
          </button>

          <button
            type="button"
            onClick={() => onRatioChange('group')}
            className="flex-1 py-1.5 px-3 flex items-center justify-center gap-2 transition-all text-xs font-bold"
            style={{
              backgroundColor: ratio === 'group' ? 'var(--theme-color-surface-card)' : 'transparent',
              color: ratio === 'group' ? 'var(--theme-color-ink)' : 'var(--theme-color-muted)',
              borderRadius: 'var(--theme-radius-button)',
              boxShadow: ratio === 'group' ? 'var(--theme-shadow-badge)' : 'none'
            }}
          >
            <Users 
              className="w-3.5 h-3.5" 
              style={{
                color: ratio === 'group' ? 'var(--theme-color-primary)' : 'var(--theme-color-muted)'
              }}
            />
            <span>Customer Groups</span>
            <span 
              className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold"
              style={{
                backgroundColor: ratio === 'group' ? 'var(--theme-color-surface-soft)' : 'transparent',
                color: 'var(--theme-color-muted)'
              }}
            >
              4:5
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
