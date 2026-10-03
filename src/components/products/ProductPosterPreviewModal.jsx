import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  X, Download, Copy, Eye, LayoutTemplate, 
  Palette, Languages, Sparkles, Check, Flame, Zap, 
  Smartphone, Layers, RefreshCw, Image as ImageIcon,
  Tag, Star, ShieldCheck
} from 'lucide-react';
import { canvasRenderer, POST_DESIGNS, POST_MOODS } from '../../services/canvasRenderer';
import { PRIMARY_PALETTES, getHarmoniousPaletteForProduct } from '../../services/configService';
import { shareService } from '../../services/shareService';
import { scheduleService } from '../../services/scheduleService';
import { getOptimizedImageUrl, getProductPhotosPool } from '../../utils/imageUtils';
import WhatsAppIcon from '../common/WhatsAppIcon';
import InstagramIcon from '../common/InstagramIcon';

export default function ProductPosterPreviewModal({
  product,
  seller,
  initialRatio = 'status',
  initialPhoto = null,
  initialDesign = 'retail_classic',
  initialMood = null,
  initialPalette = null,
  onClose,
  onShowToast
}) {
  // 1. Design Layout: Retail Classic | Editorial Luxury | Clean Minimalist | Boutique Showcase
  const [currentDesign, setCurrentDesign] = useState(() => {
    if (initialDesign && POST_DESIGNS.some(d => d.id === initialDesign)) return initialDesign;
    return 'retail_classic';
  });

  // 2. Poster Mood / Urgency Feature Badge: Standard | Flash Sale | Bestseller | New Drop | Limited Stock | Premium
  const [currentMood, setCurrentMood] = useState(() => {
    if (initialMood && POST_MOODS.some(m => m.id === initialMood)) return initialMood;
    const badge = String(product?.badge || product?.promo_tag || '').toLowerCase();
    if (badge.includes('flash') || product?.flash_sale) return 'flash_sale';
    if (badge.includes('bestseller') || badge.includes('top rated') || badge.includes('review')) return 'bestseller';
    if (badge.includes('new') || badge.includes('arrival') || badge.includes('restock')) return 'new_arrival';
    if (badge.includes('limit') || badge.includes('scarcity')) return 'limited_stock';
    if (badge.includes('premium') || badge.includes('original')) return 'premium_choice';
    return 'standard';
  });

  // 3. Aspect Ratio: 9:16 Status vs 4:5 Feed
  const [currentRatio, setCurrentRatio] = useState(initialRatio || 'status');

  // 4. In-Preview Color Palette: Adjusted live from the preview modal!
  const [currentPalette, setCurrentPalette] = useState(() => {
    if (initialPalette && PRIMARY_PALETTES.some(p => p.id === initialPalette)) return initialPalette;
    return getHarmoniousPaletteForProduct(product) || seller?.palette || 'forest_amber';
  });

  // 5. WhatsApp Caption Language
  const [captionLang, setCaptionLang] = useState(
    seller?.language === 'swahili' ? 'swahili' : 'english'
  );

  // Extract all photos belonging to this product for preview and poster angle selection
  const photosList = useMemo(() => {
    return getProductPhotosPool(product);
  }, [product]);

  const [activePhoto, setActivePhoto] = useState(() => {
    return initialPhoto || product?.photo || photosList[0] || null;
  });

  useEffect(() => {
    if (initialPhoto) {
      setActivePhoto(initialPhoto);
    } else if (product?.photo) {
      setActivePhoto(product.photo);
    }
  }, [initialPhoto, product]);

  const [renderedImageUrl, setRenderedImageUrl] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [isRendering, setIsRendering] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isSharingFeed, setIsSharingFeed] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // ---------------------------------------------------------------------------
  // NAVIGATION & BROWSER BACK BUTTON TRAPPING:
  // Pushes history state on mount; on hardware/browser Back, cleanly closes modal
  // without kicking the user off the website!
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const stateObj = { modal: 'product_poster_preview', prodId: product?.id };
    window.history.pushState(stateObj, '');

    const handlePopState = (e) => {
      // Browser back button was pressed - close modal gracefully!
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose, product?.id]);

  const handleSafeClose = useCallback(() => {
    // If the top state was pushed by this modal, go back in history
    if (window.history.state && window.history.state.modal === 'product_poster_preview') {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSafeClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSafeClose]);

  // Generate marketing caption matching the chosen mood and language
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const caption = useMemo(() => {
    const moodStyle = currentMood === 'flash_sale' ? 'flash_sale'
      : currentMood === 'bestseller' ? 'customer_reviews'
      : currentMood === 'new_arrival' ? 'restock_alerts'
      : currentDesign;

    return scheduleService.generateCaption(
      product,
      seller,
      moodStyle,
      null,
      todayStr,
      captionLang
    );
  }, [product, seller, currentDesign, currentMood, todayStr, captionLang]);

  // Live Re-render Canvas Poster on any change
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    const productForRender = {
      ...product,
      photo: activePhoto || product.photo,
      selectedPhoto: activePhoto || product.photo,
      selectedMood: currentMood
    };

    canvasRenderer
      .renderPost(
        productForRender,
        seller,
        currentRatio,
        currentDesign,
        null,
        currentPalette,
        currentMood
      )
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
    activePhoto,
    product.benefit_line,
    seller.brand_color,
    seller.shop_name,
    seller.phone,
    seller.mpesa_till,
    currentRatio,
    currentDesign,
    currentMood,
    currentPalette,
    onShowToast
  ]);

  // Handle Share to WhatsApp
  const handleShare = async () => {
    if (!imageBlob || isSharing) return;
    setIsSharing(true);

    const safeName = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentDesign}-${currentMood}-${currentRatio}.png`;

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

  // Handle 1-Tap Instagram / Facebook Feed Share
  const handleShareFeed = async () => {
    if (isSharingFeed) return;
    setIsSharingFeed(true);

    const safeName = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentDesign}-${currentMood}-feed-4x5.png`;

    try {
      // 1. Auto-copy rich sales caption first
      await shareService.copyText(caption);

      // 2. Render 4:5 Feed flyer dynamically if current is status
      let feedBlob = imageBlob;
      if (currentRatio !== 'group') {
        const productToRender = {
          ...product,
          photo: activePhoto,
          selectedPhoto: activePhoto
        };
        const feedDataUrl = await canvasRenderer.renderPost(
          productToRender,
          seller,
          'group', // 4:5 portrait ratio for feed
          currentDesign,
          null,
          currentPalette
        );
        feedBlob = canvasRenderer.dataURLToBlob(feedDataUrl);
      }

      // 3. Save / download the 4:5 flyer
      shareService.downloadPosterOnly({ blob: feedBlob, filename });

      if (onShowToast) {
        onShowToast('✓ Caption copied & 4:5 Feed flyer saved! Open Instagram / Facebook to paste.', 'success');
      }
    } catch (err) {
      console.error('Feed generation failed', err);
      if (onShowToast) onShowToast('Could not generate feed poster.', 'error');
    } finally {
      setIsSharingFeed(false);
    }
  };

  // Handle Save / Download Poster
  const handleDownload = () => {
    if (!imageBlob) return;
    const safeName = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentDesign}-${currentMood}-${currentRatio}.png`;
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

  const activeDesignObj = POST_DESIGNS.find((d) => d.id === currentDesign) || POST_DESIGNS[0];
  const activeMoodObj = POST_MOODS.find((m) => m.id === currentMood) || POST_MOODS[0];
  const activePaletteObj = PRIMARY_PALETTES.find((p) => p.id === currentPalette || (p.aliases && p.aliases.includes(currentPalette))) || PRIMARY_PALETTES[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-md animate-fade-in"
      onClick={handleSafeClose}
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
                Poster Preview &amp; Color Studio • KES {Number(product.price).toLocaleString()}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleSafeClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition flex-shrink-0 ml-2 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Main Control Area */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-3 scrollbar-thin">
          
          {/* ------------------------------------------------------------- */}
          {/* 1. IN-PREVIEW COLOR ADJUSTER ("Adjust colors when I preview")  */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Adjust Poster Colors:</span>
              </span>
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <span 
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: activePaletteObj.band }}
                />
                <span>{activePaletteObj.shortLabel}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {PRIMARY_PALETTES.map((pal) => {
                const isSelected = currentPalette === pal.id || (pal.aliases && pal.aliases.includes(currentPalette));
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setCurrentPalette(pal.id)}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-slate-950 text-white border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
                    }`}
                    title={pal.label}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0"
                      style={{ backgroundColor: pal.band }}
                    />
                    <span>{pal.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 2. MOOD / FEATURE BADGES (Flash Sale, Bestseller, Urgency)    */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Poster Mood &amp; Badge:</span>
              </span>
              <span className="text-[10px] font-bold text-rose-300">
                {activeMoodObj.icon} {activeMoodObj.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {POST_MOODS.map((mood) => {
                const isSelected = currentMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setCurrentMood(mood.id)}
                    className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-400 ring-2 ring-rose-400/40 shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-700/80 hover:border-slate-600'
                    }`}
                    title={mood.desc}
                  >
                    <span>{mood.icon}</span>
                    <span>{mood.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 3. DESIGN LAYOUT & RATIO                                      */}
          {/* ------------------------------------------------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Design Layout Selector */}
            <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <LayoutTemplate className="w-3 h-3 text-emerald-400" />
                  <span>Layout Design:</span>
                </span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
                {POST_DESIGNS.map((design) => {
                  const isSelected = currentDesign === design.id;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setCurrentDesign(design.id)}
                      className={`flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-black transition cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                          : 'bg-slate-900 text-slate-300 border-slate-700/70 hover:border-slate-600'
                      }`}
                      title={design.desc}
                    >
                      {design.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ratio Toggle (9:16 Status vs 4:5 Feed) */}
            <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-slate-400" />
                <span>Format Ratio:</span>
              </span>
              <div className="inline-flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-700 mt-1">
                <button
                  type="button"
                  onClick={() => setCurrentRatio('status')}
                  className={`flex-1 py-1 rounded-md text-[10px] font-black transition cursor-pointer text-center ${
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
                  className={`flex-1 py-1 rounded-md text-[10px] font-black transition cursor-pointer text-center ${
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
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 4. MULTI-PHOTO ANGLE PICKER (Shoes, Bags, Cosmetics)           */}
          {/* ------------------------------------------------------------- */}
          {photosList.length > 1 && (
            <div className="bg-slate-800/80 p-2 rounded-2xl border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-emerald-400" />
                  <span>Choose Photo Angle ({photosList.length} Available):</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400">
                  Angle {photosList.indexOf(activePhoto) >= 0 ? photosList.indexOf(activePhoto) + 1 : 1}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
                {photosList.map((photoUrl, idx) => {
                  const isSelected = activePhoto === photoUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhoto(photoUrl)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-slate-950 flex-shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-105 shadow-md'
                          : 'border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                      }`}
                      title={`Render Photo Angle ${idx + 1} on Poster`}
                    >
                      <img
                        src={getOptimizedImageUrl(photoUrl)}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* 5. LIVE CANVAS PREVIEW DISPLAY                                */}
          {/* ------------------------------------------------------------- */}
          <div className="relative group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-2 min-h-[340px] sm:min-h-[400px]">
            {isRendering && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xs rounded-2xl transition-all">
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-emerald-300 text-xs font-black mt-3">
                  Rendering Branded Poster...
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  1080px Master Quality • {activeDesignObj.name}
                </span>
              </div>
            )}

            {renderedImageUrl ? (
              <img
                src={renderedImageUrl}
                alt={`${product.name} Designed Poster`}
                className={`w-auto object-contain rounded-3xl shadow-2xl transition-transform duration-200 ring-1 ring-slate-800 ${
                  currentRatio === 'status' ? 'max-h-[54vh] sm:max-h-[60vh]' : 'max-h-[46vh] sm:max-h-[52vh]'
                }`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                <span className="text-xs font-bold text-slate-300">Generating Designed Poster...</span>
              </div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* 6. WHATSAPP CAPTION SECTION WITH SWAHILI / ENGLISH SWITCHER   */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-300 flex items-center gap-1.5 text-[11px]">
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Caption:</span>
              </span>

              <div className="inline-flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-700">
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

        {/* ------------------------------------------------------------- */}
        {/* 7. STICKY ACTION FOOTER (Multi-Platform Publishing)           */}
        {/* ------------------------------------------------------------- */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md flex flex-col gap-2 z-10">
          <div className="grid grid-cols-2 gap-2">
            {/* 1. WhatsApp Status & Stories (9:16 Fullscreen Vertical Flyer) */}
            <button
              type="button"
              onClick={handleShare}
              disabled={isRendering || isSharing || !imageBlob}
              className="bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-black py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              style={{ minHeight: '46px' }}
              title="Post 9:16 Vertical Poster directly to WhatsApp Status & Stories"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white flex-shrink-0" />
              <span className="truncate">
                {isSharing ? 'Opening...' : 'Status & Stories'}
              </span>
            </button>

            {/* 2. Instagram & Facebook Feed (4:5 Image + Auto-Copied Caption) */}
            <button
              type="button"
              onClick={handleShareFeed}
              disabled={isRendering || isSharingFeed}
              className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-black py-3 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs sm:text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
              style={{ minHeight: '46px' }}
              title="Save 4:5 Feed Flyer & Auto-Copy Caption for Instagram / Facebook"
            >
              <InstagramIcon className="w-4 h-4 fill-white flex-shrink-0" />
              <span className="truncate">
                {isSharingFeed ? 'Preparing...' : 'Instagram / FB'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs px-1 text-slate-400">
            <span className="text-[10px] text-slate-500">
              ⚡ Status = 9:16 Visual • Feed = 4:5 + Caption
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isRendering || !imageBlob}
                className="hover:text-white font-bold flex items-center gap-1 cursor-pointer transition text-slate-400"
                title="Download flyer image only"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save</span>
              </button>
              <span className="text-slate-600">•</span>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="hover:text-white font-bold flex items-center gap-1 cursor-pointer transition text-slate-400"
                title="Copy caption text to clipboard"
              >
                {copiedCaption ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{copiedCaption ? 'Copied' : 'Copy Caption'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
