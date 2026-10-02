import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, Copy, CheckCircle, Clock, Eye, Download, Check, 
  Palette, Languages, Sparkles, LayoutTemplate, Flame, Zap, 
  Camera, Star, Layers, Tag, Maximize2, ShieldCheck, Image as ImageIcon 
} from 'lucide-react';
import { canvasRenderer, POST_STYLES } from '../../services/canvasRenderer';
import { PRIMARY_PALETTES } from '../../services/configService';
import { shareService } from '../../services/shareService';
import { scheduleService } from '../../services/scheduleService';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getOptimizedImageUrl, getProductPhotosPool } from '../../utils/imageUtils';

export default function PostCard({
  post,
  seller,
  ratio,
  isPosted,
  onTogglePosted,
  onShowToast,
  globalCaptionLang = 'english'
}) {
  const companion = post.companionProduct || null;

  // Extract all unique photos for this product, guaranteeing at least 3 reference options for 100% of products
  const allPhotos = useMemo(() => {
    return getProductPhotosPool(post.product, companion);
  }, [post.product, companion]);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const activePhoto = allPhotos[selectedPhotoIndex] || post.product.photo || allPhotos[0];

  const [currentStyle, setCurrentStyle] = useState(post.style || 'unified_brand');
  const [postPalette, setPostPalette] = useState(post.palette || null);
  const [cardLang, setCardLang] = useState(null); // null means inherit globalCaptionLang
  const [renderedImageUrl, setRenderedImageUrl] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [isRendering, setIsRendering] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);

  // Active palette: per-post override or global seller palette
  const activePalette = postPalette || seller.palette || 'emerald';

  // Active caption language: per-card override or global setting
  const activeCaptionLang = cardLang || globalCaptionLang || (seller?.language === 'swahili' ? 'swahili' : 'english');

  // Dynamic caption based on currentStyle, active language, seller, and companion
  const caption = scheduleService.generateCaption(
    post.product,
    seller,
    currentStyle,
    companion,
    post.date,
    activeCaptionLang
  );

  // Re-render canvas image when product, activePhoto, brand, ratio, style, palette, or companion changes
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    const productToRender = {
      ...post.product,
      photo: activePhoto
    };

    canvasRenderer
      .renderPost(productToRender, seller, ratio, currentStyle, companion, activePalette)
      .then((dataUrl) => {
        if (!isCurrent) return;
        setRenderedImageUrl(dataUrl);
        const blob = canvasRenderer.dataURLToBlob(dataUrl);
        setImageBlob(blob);
        setIsRendering(false);
      })
      .catch((err) => {
        console.error('Canvas render error', err);
        if (isCurrent) setIsRendering(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [
    post.product.id,
    post.product.price,
    post.product.name,
    activePhoto,
    seller.brand_color,
    seller.shop_name,
    seller.phone,
    seller.palette,
    activePalette,
    ratio,
    currentStyle,
    companion ? companion.id : null
  ]);

  // Primary Action: Share to WhatsApp (Single Designed Poster Only)
  const handleShare = async () => {
    if (!imageBlob || isSharing) return;
    setIsSharing(true);

    const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentStyle}-${ratio}.png`;

    try {
      const result = await shareService.sharePost({
        blob: imageBlob,
        caption: caption,
        filename
      });

      if (result.success) {
        onTogglePosted(post.slotId, true);
        if (result.method === 'native_share') {
          onShowToast(
            `✓ Designed poster shared & caption copied! Ready to paste on WhatsApp.`,
            'success'
          );
        } else if (result.method === 'desktop_whatsapp_opened' || result.method === 'download_fallback') {
          onShowToast(
            `✓ Designed poster downloaded & WhatsApp opened! Drop poster into chat/status and paste caption.`,
            'success'
          );
        }
      } else if (result.method === 'cancelled') {
        onShowToast('Share closed. Caption still copied to clipboard.', 'info');
      }
    } catch (err) {
      console.error('Sharing failed', err);
      onShowToast('Could not open share sheet. Use download instead.', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  // Download flyer only without launching WhatsApp
  const handleDownloadOnly = () => {
    if (!imageBlob) return;
    const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${currentStyle}-${ratio}.png`;
    shareService.downloadPosterOnly({ blob: imageBlob, filename });
    onShowToast(`✓ Designed poster saved to your device!`, 'success');
  };

  // Copy Caption Only
  const handleCopyCaption = async () => {
    const success = await shareService.copyText(caption);
    if (success) {
      onShowToast(
        `✓ Caption copied (${activeCaptionLang === 'swahili' ? 'Kiswahili 🇰🇪' : 'English'})!`,
        'success'
      );
    } else {
      onShowToast('Failed to copy caption.', 'error');
    }
  };

  const currentStyleObj = POST_STYLES.find((s) => s.id === currentStyle) || POST_STYLES[0];

  return (
    <article className={`bg-white rounded-2xl border transition-all overflow-hidden ${
      isPosted ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm' : 'border-slate-200 shadow-sm hover:border-slate-300'
    }`}>
      {/* Post Header: Time slot + Style Tag + Posted Status */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
            <Clock className="w-3.5 h-3.5" />
          </span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900 leading-tight">
                {post.time}
              </span>
              {post.product.category && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {post.product.category}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-medium">{post.label}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Style Selector Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-400 transition shadow-2xs"
              title="Change Post Style Layout"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[95px] truncate">{currentStyleObj.name.split('(')[0].trim()}</span>
            </button>

            {isStyleMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 animate-fade-in scrollbar-thin"
                onClick={() => setIsStyleMenuOpen(false)}
              >
                <div className="text-[10px] font-extrabold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Select Flyer Format ({POST_STYLES.length} Designs)
                </div>
                {POST_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setCurrentStyle(style.id);
                      onShowToast(`✓ Layout format changed to ${style.name}!`, 'success');
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition flex flex-col cursor-pointer ${
                      currentStyle === style.id
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: style.accentColor || '#10b981' }}
                        />
                        <span>{style.name}</span>
                      </span>
                      {style.tag && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          currentStyle === style.id ? 'bg-white/20 text-emerald-300' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {style.tag}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-normal mt-0.5 ${currentStyle === style.id ? 'text-slate-300' : 'text-slate-400'}`}>
                      {style.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Posted Toggle Tag */}
          <button
            onClick={() => onTogglePosted(post.slotId, !isPosted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isPosted
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Click to toggle posted status"
          >
            {isPosted ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                <span>Posted</span>
              </>
            ) : (
              <span>Mark Posted</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-4 space-y-3.5">
        {/* Color Palette Switcher: 5 Locked Architectural Palettes */}
        <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/90">
          <div className="flex items-center justify-between px-0.5 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>Theme Palette (5 Locked):</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              {PRIMARY_PALETTES.find(p => p.id === activePalette || (p.aliases && p.aliases.includes(activePalette)))?.shortLabel || 'Custom'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {PRIMARY_PALETTES.map((pal) => {
              const isSelected = activePalette === pal.id || (pal.aliases && pal.aliases.includes(activePalette));
              return (
                <button
                  key={pal.id}
                  type="button"
                  onClick={() => setPostPalette(pal.id)}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 border text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                  }`}
                  title={pal.label}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border flex-shrink-0"
                    style={{ backgroundColor: pal.band, borderColor: pal.stripe }}
                  />
                  <span className="whitespace-nowrap">{pal.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Photo Angle Selector (for shoes, bags, skincare) */}
        {allPhotos.length > 1 && (
          <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/90">
            <div className="flex items-center justify-between px-0.5 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Select Photo for Poster ({allPhotos.length} Angles):</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Angle {selectedPhotoIndex + 1}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
              {allPhotos.map((photoUrl, idx) => {
                const isSelected = selectedPhotoIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-11 h-11 rounded-lg overflow-hidden border-2 bg-slate-900 flex-shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105 shadow-sm'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
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

        {/* 10 Flyer Design Formats Carousel (1-Tap Instant Layout Switcher) */}
        <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/90">
          <div className="flex items-center justify-between px-0.5 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5 text-emerald-600" />
              <span>Flyer Design Format ({POST_STYLES.length} Templates):</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {currentStyleObj.name.split('(')[0].trim()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
            {POST_STYLES.map((style) => {
              const isSelected = currentStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    setCurrentStyle(style.id);
                    onShowToast(`✓ Switched layout to ${style.name}!`, 'success');
                  }}
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500/40'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                  }`}
                  title={`${style.name}: ${style.desc}`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: style.accentColor || '#10b981' }}
                  />
                  <span className="whitespace-nowrap">{style.name.split('(')[0].trim()}</span>
                  {style.tag && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-white/20 text-emerald-300' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {style.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rendered Canvas Preview */}
        <div className="relative group bg-slate-900/5 rounded-2xl overflow-hidden border border-slate-200/80 aspect-[4/5] sm:aspect-[9/16] max-h-[380px] flex items-center justify-center">
          {isRendering ? (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <div className="w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Creating branded post...</p>
            </div>
          ) : renderedImageUrl ? (
            <>
              <img
                src={renderedImageUrl}
                alt={post.product.name}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
              />
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-lg text-xs font-semibold backdrop-blur-sm flex items-center gap-1 transition opacity-90 hover:opacity-100"
                aria-label="View Full Post"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-red-500">Failed to render post</div>
          )}
        </div>

        {/* Bundle Duo Companion Banner if in bundle style */}
        {(currentStyle === 'product_bundles' || currentStyle === 'bundle_offer') && companion && (
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-bold text-amber-800 bg-white border border-amber-200 px-1.5 py-0.5 rounded-md flex-shrink-0">2-IN-1</span>
              <div className="truncate">
                <span className="font-bold text-slate-900">Paired with: </span>
                <span className="font-semibold text-slate-700">{companion.name}</span>
              </div>
            </div>
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0">
              KES {Number(companion.price).toLocaleString()}
            </span>
          </div>
        )}

        {/* Product Quick Info */}
        <div className="flex items-start justify-between gap-2">
          <div>
            {post.product.category && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {post.product.category}
                </span>
                {post.product.size && (
                  <span className="text-[10px] font-medium text-slate-400">
                    • {post.product.size}
                  </span>
                )}
              </div>
            )}
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {post.product.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {post.product.benefit_line}
            </p>
          </div>
          <span className="inline-block bg-slate-950 text-white font-extrabold text-sm px-2.5 py-1 rounded-lg flex-shrink-0 shadow-xs">
            KES {Number(post.product.price).toLocaleString()}
          </span>
        </div>

        {/* Caption Bar with Swahili / English Toggle */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>Caption:</span>
          </span>

          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setCardLang('swahili');
                onShowToast('✓ Caption switched to Kiswahili! 🇰🇪', 'info');
              }}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeCaptionLang === 'swahili'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Swahili (Kiswahili) Caption"
            >
              <span>🇰🇪 Swahili</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCardLang('english');
                onShowToast('✓ Caption switched to English!', 'info');
              }}
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeCaptionLang === 'english'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English Caption"
            >
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Caption Snippet */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
          {caption}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-6 gap-2 pt-1">
          <button
            onClick={handleShare}
            disabled={isRendering || isSharing}
            className="col-span-4 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 text-sm"
            style={{ minHeight: '48px' }}
          >
            <WhatsAppIcon className="w-5 h-5 fill-white flex-shrink-0" />
            <span className="truncate">
              {isSharing ? 'Opening WhatsApp...' : 'Share Poster to WhatsApp'}
            </span>
          </button>

          <button
            onClick={handleDownloadOnly}
            disabled={isRendering}
            className="col-span-1 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-slate-200 transition text-[10px]"
            title="Download flyer image only"
            style={{ minHeight: '48px' }}
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Save</span>
          </button>

          <button
            onClick={handleCopyCaption}
            className="col-span-1 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-slate-200 transition text-[10px]"
            title="Copy Caption to clipboard"
            style={{ minHeight: '48px' }}
          >
            <Copy className="w-4 h-4 text-slate-600" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Full Post Modal Preview */}
      {isPreviewOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="relative max-w-sm w-full max-h-[92vh] flex flex-col items-center bg-gray-900 rounded-2xl overflow-hidden p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 text-white">
              <span className="text-xs font-bold truncate pr-2">
                {post.product.name} ({currentStyleObj.name.split('/')[0]})
              </span>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="text-white/80 hover:text-white text-xs font-bold px-2.5 py-1 bg-white/20 rounded-lg flex-shrink-0 cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden relative min-h-[320px]">
              {isRendering && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-950/75 backdrop-blur-xs rounded-xl transition-all">
                  <div className="w-9 h-9 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-emerald-300 text-xs font-bold mt-2">
                    Designing poster with Photo #{selectedPhotoIndex + 1}...
                  </span>
                </div>
              )}
              {renderedImageUrl ? (
                <img 
                  src={renderedImageUrl} 
                  alt="High resolution post" 
                  className="max-h-[62vh] w-auto object-contain rounded-xl shadow-2xl" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                  <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-xs">Preparing poster...</span>
                </div>
              )}
            </div>

            {/* Multi-Photo Angle Selector inside Preview Modal */}
            {allPhotos.length > 1 && (
              <div className="w-full pt-1.5 bg-white/5 rounded-xl p-2 border border-white/10 mt-1">
                <div className="flex items-center justify-between pb-1 text-white">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-200">
                    <ImageIcon className="w-3 h-3 text-emerald-400" />
                    <span>Photo Angle ({allPhotos.length} Angles):</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400">
                    Angle {selectedPhotoIndex + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                  {allPhotos.map((photoUrl, idx) => {
                    const isSelected = selectedPhotoIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`w-9 h-9 rounded-lg overflow-hidden border-2 bg-black flex-shrink-0 transition-all cursor-pointer ${
                          isSelected ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                        title={`Select Photo Angle ${idx + 1}`}
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

            {/* 10 Flyer Design Formats Carousel inside Preview Modal */}
            <div className="w-full pt-2 bg-white/5 rounded-xl p-2.5 border border-white/10 mt-1">
              <div className="flex items-center justify-between pb-1.5 text-white">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-200">
                  <LayoutTemplate className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Choose Flyer Format ({POST_STYLES.length} Designs):</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
                      onClick={() => {
                        setCurrentStyle(style.id);
                        onShowToast(`✓ Layout format changed to ${style.name}!`, 'success');
                      }}
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 border text-left cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400/40'
                          : 'bg-white/10 text-gray-200 hover:bg-white/20 border-white/15'
                      }`}
                      title={`${style.name}: ${style.desc}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: style.accentColor || '#10b981' }}
                      />
                      <span className="whitespace-nowrap">{style.name.split('(')[0].trim()}</span>
                      {style.tag && (
                        <span className={`text-[9px] font-extrabold px-1 py-0.1 rounded ${
                          isSelected ? 'bg-black/30 text-emerald-200' : 'bg-white/15 text-gray-300'
                        }`}>
                          {style.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>



            {/* Caption in Preview Modal with Swahili / English Toggle */}
            <div className="w-full pt-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Languages className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp Caption:</span>
                </span>
                <div className="inline-flex items-center p-0.5 bg-white/10 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setCardLang('swahili')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      activeCaptionLang === 'swahili'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    🇰🇪 Swahili
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardLang('english')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      activeCaptionLang === 'english'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-2 border border-white/10 text-[10px] text-gray-300 font-mono whitespace-pre-wrap max-h-16 overflow-y-auto">
                {caption}
              </div>
            </div>

            <div className="w-full pt-3 flex gap-2">
              <button
                type="button"
                onClick={handleDownloadOnly}
                disabled={isRendering}
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold py-3 px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-xs border border-white/20 transition active:scale-95 flex-shrink-0"
                title="Save designed poster"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Save Poster</span>
              </button>

              <button
                onClick={handleShare}
                disabled={isRendering || isSharing}
                className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition disabled:opacity-50"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white flex-shrink-0" />
                <span className="truncate">
                  {isSharing ? 'Opening WhatsApp...' : 'Share Poster to WhatsApp'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
