import React, { useState } from 'react';
import { X, Check, RotateCcw, ShieldCheck, Store, MapPin, CreditCard, Sparkles, Download, CheckCircle2, Smartphone, Lock, Eye, EyeOff, FileSpreadsheet, Database, Clock, BellRing } from 'lucide-react';
import { BEAUTY_BAR_SELLER, GLOW_HOUSE_SELLER, HALAL_BEAUTY_SELLER, MOH_037_SELLER } from '../../data/starterData';

const BRAND_PALETTES = [
  { name: 'Glownd Pink', hex: '#fa31df', dark: '#be185d' },
  { name: 'Emerald Green', hex: '#047857', dark: '#064e3b' },
  { name: 'Forest Green', hex: '#15803d', dark: '#14532d' },
  { name: 'Teal Green', hex: '#0d9488', dark: '#115e59' },
  { name: 'Rose Glow', hex: '#be185d', dark: '#881337' },
  { name: 'Royal Purple', hex: '#7e22ce', dark: '#581c87' },
  { name: 'Midnight Black', hex: '#18181b', dark: '#09090b' },
];

export default function SettingsModal({ seller, onClose, onSave, onResetDefaults, pwa, onOpenBulkModal, onOpenTimeSchedule }) {
  const [shopName, setShopName] = useState(seller.shop_name || '');
  const [phone, setPhone] = useState(seller.phone || '');
  const [location, setLocation] = useState(seller.location || '');
  const [mpesaTill, setMpesaTill] = useState(seller.mpesa_till || '');
  const [brandColor, setBrandColor] = useState(seller.brand_color || '#047857');
  const [palette, setPalette] = useState(seller.palette || 'emerald');
  const [language, setLanguage] = useState(seller.language || 'kenyan_mix');
  const [pin, setPin] = useState(seller.pin || localStorage.getItem('dailypost_owner_pin') || '1234');
  const [showPin, setShowPin] = useState(false);

  const applyPreset = (preset) => {
    setShopName(preset.shop_name);
    setPhone(preset.phone);
    setLocation(preset.location);
    setMpesaTill(preset.mpesa_till || '');
    setBrandColor(preset.brand_color);
    setPalette(preset.palette || 'emerald');
    setLanguage(preset.language || 'kenyan_mix');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedPalette = BRAND_PALETTES.find((p) => p.hex.toLowerCase() === brandColor.toLowerCase());
    
    onSave({
      shop_name: shopName.trim(),
      phone: phone.trim(),
      phone_raw: phone.replace(/[^0-9]/g, ''),
      location: location.trim(),
      mpesa_till: mpesaTill.trim(),
      brand_color: brandColor,
      brand_color_dark: matchedPalette ? matchedPalette.dark : '#064e3b',
      palette: palette,
      language,
      pin: pin.trim() || '1234'
    });
  };

  const handleReset = async () => {
    if (window.confirm('Reset all products and brand info back to the full 100+ Beauty Bar Kenya catalogue?')) {
      await onResetDefaults();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-gray-900">
              Brand &amp; Seller Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Quick Demo Presets */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Shop Preset</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset(GLOWND_SELLER)}
                className="p-2.5 rounded-xl border border-fuchsia-300 bg-fuchsia-50 text-[11px] font-black text-fuchsia-900 hover:bg-fuchsia-100 transition text-center shadow-2xs col-span-2 flex items-center justify-center gap-1.5"
              >
                <span>👜</span>
                <span>GLOWND Bags & Luxury Handbags (Nairobi)</span>
              </button>
              <button
                type="button"
                onClick={() => applyPreset(MOH_037_SELLER)}
                className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-[11px] font-black text-rose-900 hover:bg-rose-100 transition text-center shadow-2xs"
              >
                MOH 037 Collection ❤️ (Kakamega)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(BEAUTY_BAR_SELLER)}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-[11px] font-bold text-emerald-900 hover:bg-emerald-100 transition text-center"
              >
                Beauty Bar (Nairobi)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(GLOW_HOUSE_SELLER)}
                className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-[11px] font-bold text-blue-900 hover:bg-blue-100 transition text-center"
              >
                Glow House (Kakamega)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(HALAL_BEAUTY_SELLER)}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 text-[11px] font-bold text-purple-900 hover:bg-purple-100 transition text-center"
              >
                Halal Beauty (Jamia)
              </button>
            </div>
          </div>

          {/* Shop Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Shop Name (appears on every post image &amp; catalogue)
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. The Beauty Bar Kenya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 font-bold text-xs outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-500" />
              <span>Physical Location / Pickup Point</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Jamia Mall, Shop F47, Nairobi or Mega Mall Kakamega"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 font-bold text-xs outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              WhatsApp / Call Phone Number
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +254 728 222 211"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 font-bold text-xs outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1">Baked directly into post flyers &amp; WhatsApp order links.</p>
          </div>

          {/* M-Pesa Till / Pochi */}
          <div>
            <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lipa na M-Pesa Buy Goods Till / Pochi Number</span>
            </label>
            <input
              type="text"
              value={mpesaTill}
              onChange={(e) => setMpesaTill(e.target.value)}
              placeholder="e.g. 582910"
              className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 focus:ring-2 focus:ring-emerald-500 font-black text-xs text-emerald-950 outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1">Creates instant trust on both the flyer graphics and customer catalogue.</p>
          </div>

          {/* 2-Color Unified Flyer Theme */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Master Flyer Theme (Zero Color Clashing)</span>
              <span className="text-[10px] text-emerald-700 font-extrabold uppercase">2-Color Harmony</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setPalette('emerald');
                  setBrandColor('#064e3b');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  palette === 'emerald'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#064e3b] border-2 border-[#f59e0b] shadow-2xs" />
                  <span className="font-extrabold text-xs text-gray-900">Emerald &amp; Gold</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Header, footer, offer box &amp; badges match rich brand green with champagne gold accents.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPalette('slate');
                  setBrandColor('#0f172a');
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  palette === 'slate'
                    ? 'border-slate-900 bg-slate-100 ring-2 ring-slate-900/20 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#0f172a] border-2 border-[#f59e0b] shadow-2xs" />
                  <span className="font-extrabold text-xs text-gray-900">Luxury Slate</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Header, footer, offer box &amp; badges match sleek onyx slate with warm gold accents.
                </p>
              </button>
            </div>
          </div>

          {/* Brand Color */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Custom Brand Accent (Optional)
            </label>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              {BRAND_PALETTES.map((palette) => (
                <button
                  type="button"
                  key={palette.hex}
                  onClick={() => setBrandColor(palette.hex)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border transition text-left text-xs font-semibold ${
                    brandColor.toLowerCase() === palette.hex.toLowerCase()
                      ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900/10'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: palette.hex }}
                  />
                  <span className="truncate text-[11px]">{palette.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-9 h-9 rounded-xl cursor-pointer border border-gray-300 p-0.5"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs font-mono font-bold"
              />
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Caption Language &amp; Tone
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'kenyan_mix', label: 'Kenyan Mix (English + Swahili)', desc: 'Natural local commerce tone (Recommended)' },
                { id: 'swahili', label: 'Kiswahili Pekee', desc: 'Ujumbe safi wa Kiswahili' },
                { id: 'english', label: 'English Only', desc: 'Standard business English' },
              ].map((lang) => (
                <label
                  key={lang.id}
                  className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer transition ${
                    language === lang.id
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.id}
                    checked={language === lang.id}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-900">{lang.label}</div>
                    <div className="text-[10px] text-gray-500">{lang.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Daily Posting Schedule & Alarms */}
          <div className="bg-gradient-to-r from-teal-50/90 to-emerald-50/90 border border-teal-200/90 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-700 stroke-[2.5px]" />
                <span>Posting Schedule &amp; Alarms</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-200/70 text-teal-900 font-mono">
                Custom Times
              </span>
            </div>
            <p className="text-[11px] text-teal-900 leading-tight">
              Adjust your daily posting windows (e.g. 08:30 AM, 12:30 PM, 06:00 PM), choose your alert chime, and sync sleep-proof alarms to your phone.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenTimeSchedule) onOpenTimeSchedule();
              }}
              className="w-full bg-white border border-teal-300 hover:bg-teal-100/60 text-teal-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-teal-700" />
              <span>Customize Posting Times &amp; Alarms</span>
            </button>
          </div>

          {/* App & Offline Installation Section */}
          {pwa && (
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src="/icon-192.png"
                    alt="App Icon"
                    className="w-10 h-10 rounded-xl shadow-xs border border-amber-300/60 object-cover flex-shrink-0"
                    width="40"
                    height="40"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <span>Seller Studio App</span>
                      {pwa.isInstalled ? (
                        <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Installed
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                          Ready to Install
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-emerald-800 font-medium truncate mt-0.5">
                      {pwa.isInstalled 
                        ? 'Runs full screen & 100% offline from home screen' 
                        : 'Install to home screen for 1-tap flyer creation'}
                    </div>
                  </div>
                </div>
              </div>

              {!pwa.isInstalled && (
                <button
                  type="button"
                  onClick={pwa.promptInstall}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  {pwa.isIOS ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>How to Install on iPhone / iPad</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Install App to Home Screen</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Owner Security PIN Section */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 stroke-[2.5px]" />
                <span>Owner Security PIN</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-mono">
                4 Digits
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight">
              Protects your Seller Studio, Daily Post schedule, and pricing from unauthorized access.
            </p>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                placeholder="1234"
                className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-sm font-mono font-bold tracking-widest text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-950 p-1"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Data, Bulk Spreadsheets & Backup Section */}
          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5px]" />
                <span>Inventory Spreadsheets &amp; Backup</span>
              </label>
            </div>
            <p className="text-[11px] text-emerald-900 leading-tight">
              Bulk upload products from Excel/CSV, export your catalogue, or download a complete store snapshot.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenBulkModal) onOpenBulkModal();
              }}
              className="w-full bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-900 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Open Bulk Upload, Export &amp; Backup</span>
            </button>
          </div>

          {/* App Installation & Offline Mode Card */}
          {pwa && (
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 rounded-2xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600 stroke-[2.5px]" />
                  <span>App Installation &amp; Offline Mode</span>
                </label>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  pwa.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {pwa.isOnline ? 'Online (Synced)' : 'Offline (Local)'}
                </span>
              </div>
              <p className="text-[11px] text-blue-900 leading-tight">
                Daily Post is a Progressive Web App (PWA) with full offline caching. You can generate WhatsApp status flyers even in basements or without mobile bundles.
              </p>
              
              <div className="flex items-center gap-2 pt-1">
                {pwa.isInstalled ? (
                  <div className="flex-1 bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs py-2 px-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>App is Installed on this device ✓</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      pwa.resetDismissal();
                      pwa.promptInstall();
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Install App to Home Screen</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
              style={{ minHeight: '48px' }}
            >
              <Check className="w-4 h-4 stroke-[3px]" />
              <span>Save Brand Profile</span>
            </button>
          </div>

          {/* Reset Defaults Option */}
          <div className="pt-3 border-t border-gray-200 text-center">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 hover:text-rose-600 transition p-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Beauty Bar Kenya (100+ Products Collection)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
