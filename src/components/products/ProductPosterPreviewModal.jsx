import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Download, Copy, Share2, Eye, LayoutTemplate, 
  Palette, Languages, Sparkles, Check, Flame, Zap, 
  Smartphone, Layers, RefreshCw 
} from 'lucide-react';
import { canvasRenderer, POST_STYLES } from '../../services/canvasRenderer';
import { shareService } from '../../services/shareService';
import { scheduleService } from '../../services/scheduleService';
import WhatsAppIcon from '../common/WhatsAppIcon';

export default function ProductPosterPreviewModal({
  product,
  seller,
  initialRatio = 'status',
  onClose,
  onShowToast
}) {
  const [currentStyle, setCurrentStyle] = useState(() => {
    if (product.badge === 'flash_sale') return 'flash_sale';
    if (product.badge === 'restocked') return 'restock_alerts';
    return 'unified_brand';
  });

  const [currentRatio, setCurrentRatio] = useState(initialRatio || 'status'); // 'status' (9:16) or 'group' (4:5)
  const [currentPalette, setCurrentPalette] = useState(seller?.palette || 'emerald'); // 'emerald' or 'slate'
  const [captionLang, setCaptionLang] = useState(
    seller?.language === 'swahili' ? 'swahili' : 'english'
  );

  const [renderedImageUrl, setRenderedImageUrl] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [isRendering, setIsRendering] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Generate marketing caption
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const caption = useMemo(() => {
    return scheduleService.generateCaption(
      product,
      seller,
      currentStyle,
      null,
      todayStr,
      captionLang
    );
  }, [product, seller, currentStyle, todayStr, captionLang]);

  // Re-render canvas poster when product, style, ratio, or palette changes
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    canvasRenderer
      .renderPost(product, seller, currentRatio, currentStyle, null, currentPalette)
      .then((dataUrl) => {
        if (!isCurrent) return;
        setRenderedImageUrl(dataUrl);
        const blob = canvasRenderer.dataURLToBlob(dataUrl);
        setImageBlob(blob);
        setIsRendering(false);
      })
      .catch((err) => {
        console.error('Failed to render product poster:', err);
        if (isCurrent) {
          setIsRendering(false);
          if (onShowToast) onShowToast('Could not render poster preview', 'error');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [
    product.id,
    product.name,
    product.price,
    product.photo,
    product.benefit_line,
    seller.brand_color,
    seller.shop_name,
    seller.phone,
    seller.mpesa_till,
    currentRatio,
    currentStyle,
    currentPalette,
    onShowToast
  ]);

  // Handle Share to WhatsApp
  const handleShare = async () => {
    if (!imageBlob || isSharing) return;
    setIsSharing(true);

    const safeName = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentStyle}-${currentRatio}.png`;

    try {
      const result = await shareService.sharePost({
        blob: imageBlob,
        caption: caption,
        filename
      });

      if (result.success) {
        if (onShowToast) {
          onShowToast('✓ Designed poster shared! Caption copied ready to paste.', 'success');
        }
      } else if (result.method === 'cancelled') {
        if (onShowToast) onShowToast('Share closed. Caption copied to clipboard.', 'info');
      }
    } catch (err) {
      console.error('Share failed', err);
      if (onShowToast) onShowToast('Failed to open WhatsApp. Use Save instead.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  // Handle Save / Download Poster
  const handleDownload = () => {
    if (!imageBlob) return;
    const safeName = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentStyle}-${currentRatio}.png`;
    shareService.downloadPosterOnly({ blob: imageBlob, filename });
    if (onShowToast) {
      onShowToast(`✓ Designed poster saved to your device!`, 'success');
    }
  };

  // Handle Copy Caption
  const handleCopyCaption = async () => {
    const success = await shareService.copyText(caption);
    if (success) {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
      if (onShowToast) {
        onShowToast(`✓ Caption copied (${captionLang === 'swahili' ? 'Kiswahili 🇰🇪' : 'English'})!`, 'success');
      }
    } else if (onShowToast) {
      onShowToast('Failed to copy caption', 'error');
    }
  };

  const currentStyleObj = POST_STYLES.find((s) => s.id === currentStyle) || POST_STYLES[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-md w-full max-h-[96vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-white truncate leading-tight">
                {product.name}
              </h3>
              <p className="text-[10px] text-emerald-400 font-bold truncate">
                Official Designed Poster Preview • KES {Number(product.price).toLocaleString()}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition flex-shrink-0 ml-2 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Main Area */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-3 scrollbar-thin">
          {/* Quick Format & Layout Carousel */}
          <div className="space-y-1.5 bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/70">
            <div className="flex items-center justify-between text-xs text-slate-300 px-0.5">
              <span className="font-extrabold flex items-center gap-1.5 text-[11px] text-slate-200">
                <LayoutTemplate className="w-3.5 h-3.5 text-emerald-400" />
                <span>Flyer Layout ({POST_STYLES.length} Designs):</span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentStyleObj.name.split('(')[0].trim()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {POST_STYLES.map((style) => {
                const isSelected = currentStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setCurrentStyle(style.id)}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border text-left cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/40 shadow-sm'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 border-slate-700 hover:border-slate-600'
                    }`}
                    title={`${style.name}: ${style.desc}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: style.accentColor || '#10b981' }}
                    />
                    <span className="whitespace-nowrap">{style.name.split('(')[0].trim()}</span>
                    {style.tag && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-black/30 text-emerald-200' : 'bg-slate-900/60 text-slate-400'
                      }`}>
                        {style.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Controls Strip: Ratio & Palette */}
          <div className="grid grid-cols-2 gap-2">
            {/* Ratio Toggle */}
            <div className="bg-slate-800/60 p-2 rounded-2xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-slate-400" />
                <span>Format:</span>
              </span>
              <div className="inline-flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setCurrentRatio('status')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                    currentRatio === 'status'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="9:16 Fullscreen WhatsApp Status"
                >
                  9:16 Status
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentRatio('group')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                    currentRatio === 'group'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="4:5 WhatsApp Group Feed / Chat"
                >
                  4:5 Feed
                </button>
              </div>
            </div>

            {/* Theme Palette Toggle */}
            <div className="bg-slate-800/60 p-2 rounded-2xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3 h-3 text-slate-400" />
                <span>Theme:</span>
              </span>
              <div className="inline-flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setCurrentPalette('emerald')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition flex items-center gap-1 ${
                    currentPalette === 'emerald'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Emerald & Gold Palette"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Emerald</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPalette('slate')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition flex items-center gap-1 ${
                    currentPalette === 'slate'
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Luxury Slate & Gold Palette"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Slate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Designed Poster Display Container */}
          <div className="relative group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2 min-h-[340px] sm:min-h-[400px]">
            {isRendering && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs rounded-2xl transition-all">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-emerald-300 text-xs font-black mt-3">
                  Rendering Branded Poster...
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  1080px Master Quality • {currentStyleObj.name.split('(')[0]}
                </span>
              </div>
            )}

            {renderedImageUrl ? (
              <img
                src={renderedImageUrl}
                alt={`${product.name} Designed Poster`}
                className={`w-auto object-contain rounded-xl shadow-2xl transition-transform duration-200 ${
                  currentRatio === 'status' ? 'max-h-[56vh] sm:max-h-[62vh]' : 'max-h-[48vh] sm:max-h-[54vh]'
                }`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <span className="text-xs font-bold text-slate-300">Generating Designed Poster...</span>
              </div>
            )}
          </div>

          {/* WhatsApp Caption Section with Language Switcher */}
          <div className="bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/70 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-300 flex items-center gap-1.5 text-[11px]">
                <Languages className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp Caption:</span>
              </span>

              <div className="inline-flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => setCaptionLang('swahili')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                    captionLang === 'swahili'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🇰🇪 Swahili
                </button>
                <button
                  type="button"
                  onClick={() => setCaptionLang('english')}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black transition ${
                    captionLang === 'english'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800 text-[10px] text-slate-300 font-mono whitespace-pre-wrap max-h-18 overflow-y-auto leading-relaxed select-all">
              {caption}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isRendering || !imageBlob}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs border border-slate-700 transition active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
            title="Download designed flyer image only"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden xs:inline">Save</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCaption}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs border border-slate-700 transition active:scale-95 flex-shrink-0 cursor-pointer"
            title="Copy WhatsApp Caption"
          >
            {copiedCaption ? (
              <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
            ) : (
              <Copy className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden xs:inline">{copiedCaption ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            disabled={isRendering || isSharing || !imageBlob}
            className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg transition disabled:opacity-50 cursor-pointer"
            style={{ minHeight: '46px' }}
          >
            <WhatsAppIcon className="w-4 h-4 fill-white flex-shrink-0" />
            <span className="truncate">
              {isSharing ? 'Opening WhatsApp...' : 'Share Poster to WhatsApp'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
