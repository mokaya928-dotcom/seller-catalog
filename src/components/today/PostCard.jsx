import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, Copy, CheckCircle, Clock, Eye, Download, Check, 
  Palette, Languages, Sparkles, LayoutTemplate, Flame, Zap, 
  Camera, Star, Layers, Tag, Maximize2, ShieldCheck 
} from 'lucide-react';
import { canvasRenderer, POST_STYLES } from '../../services/canvasRenderer';
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
  const hasRefPhotos = allPhotos.length > 1; // Always true for all products!
  const activePhoto = allPhotos[selectedPhotoIndex] || allPhotos[0] || post.product.photo;

  // Reset selected photo if product changes
  useEffect(() => {
    setSelectedPhotoIndex(0);
  }, [post.product.id]);

  const [currentStyle, setCurrentStyle] = useState(post.style || 'unified_brand');
  const [postPalette, setPostPalette] = useState(post.palette || null);
  const [cardLang, setCardLang] = useState(null); // null means inherit globalCaptionLang
  const [includeReferences, setIncludeReferences] = useState(hasRefPhotos);
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

  // Primary Action: Share to WhatsApp (Single post or Multi-Image Set)
  const handleShare = async () => {
    if (!imageBlob || isSharing) return;
    setIsSharing(true);

    const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const photoSuffix = allPhotos.length > 1 ? `-ref${selectedPhotoIndex + 1}` : '';
    const filename = `${safeName}${photoSuffix}-${currentStyle}-${ratio}.png`;

    try {
      // If user enabled references, fetch additional product photos as blobs (excluding currently active poster photo)
      let refBlobs = [];
      let refNames = [];

      if (includeReferences && hasRefPhotos) {
        const extraPhotos = allPhotos.filter((_, idx) => idx !== selectedPhotoIndex);
        const fetchedBlobs = await Promise.all(
          extraPhotos.map((url) => shareService.urlToBlob(url))
        );
        refBlobs = fetchedBlobs.filter(Boolean);
        refNames = refBlobs.map((_, i) => `${safeName}-ref-${i + 1}.webp`);
      }

      const result = await shareService.sharePost({
        blob: imageBlob,
        blobs: refBlobs,
        caption: caption,
        filename,
        filenames: refNames
      });

      if (result.success) {
        onTogglePosted(post.slotId, true);
        const totalPhotos = 1 + (refBlobs.length || 0);
        if (result.method === 'native_share') {
          onShowToast(
            totalPhotos > 1
              ? `✓ Poster (Photo #${selectedPhotoIndex + 1}) + ${refBlobs.length} reference photos shared! Caption copied.`
              : `✓ Poster (Photo #${selectedPhotoIndex + 1}) shared & caption copied! Ready to paste on WhatsApp.`,
            'success'
          );
        } else if (result.method === 'desktop_whatsapp_opened' || result.method === 'download_fallback') {
          onShowToast(
            `✓ Poster #${selectedPhotoIndex + 1} downloaded & WhatsApp opened! Drop poster into chat/status and paste caption.`,
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
    const photoSuffix = allPhotos.length > 1 ? `-photo${selectedPhotoIndex + 1}` : '';
    const filename = `${safeName}${photoSuffix}-${currentStyle}-${ratio}.png`;
    shareService.downloadPosterOnly({ blob: imageBlob, filename });
    onShowToast(`✓ Poster variation #${selectedPhotoIndex + 1} saved to your device!`, 'success');
  };

  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Helper: Render all photos into high-res branded poster blobs
  const renderAllPosterBlobs = async () => {
    const posterBlobs = [];
    const posterFilenames = [];
    const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    for (let i = 0; i < allPhotos.length; i++) {
      const productWithPhoto = {
        ...post.product,
        photo: allPhotos[i]
      };
      const dataUrl = await canvasRenderer.renderPost(
        productWithPhoto,
        seller,
        ratio,
        currentStyle,
        companion,
        activePalette
      );
      const blob = canvasRenderer.dataURLToBlob(dataUrl);
      if (blob) {
        posterBlobs.push(blob);
        posterFilenames.push(`${safeName}-poster-${i + 1}-${currentStyle}-${ratio}.png`);
      }
    }
    return { posterBlobs, posterFilenames };
  };

  // Action: Share ALL photos as individual branded posters to WhatsApp simultaneously
  const handleShareAllPosters = async () => {
    if (isSharing || isBatchProcessing) return;
    setIsBatchProcessing(true);
    onShowToast(`🎨 Designing all ${allPhotos.length} branded posters for WhatsApp...`, 'info');

    try {
      const { posterBlobs, posterFilenames } = await renderAllPosterBlobs();
      if (posterBlobs.length === 0) throw new Error('No posters rendered');

      const primaryBlob = posterBlobs[0];
      const additionalBlobs = posterBlobs.slice(1);
      const primaryName = posterFilenames[0];
      const additionalNames = posterFilenames.slice(1);

      const result = await shareService.sharePost({
        blob: primaryBlob,
        blobs: additionalBlobs,
        caption: caption,
        filename: primaryName,
        filenames: additionalNames
      });

      if (result.success) {
        onTogglePosted(post.slotId, true);
        if (result.method === 'native_share') {
          onShowToast(`✓ All ${posterBlobs.length} branded posters shared to WhatsApp! Caption copied.`, 'success');
        } else {
          onShowToast(`✓ All ${posterBlobs.length} branded posters downloaded & WhatsApp opened!`, 'success');
        }
      } else if (result.method === 'cancelled') {
        onShowToast('Share cancelled. Caption copied to clipboard.', 'info');
      }
    } catch (err) {
      console.error('Failed to share all posters', err);
      onShowToast('Could not share all posters', 'error');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  // Action: Download all designed posters as a clean ZIP bundle
  const handleDownloadAllPosters = async () => {
    if (isBatchProcessing) return;
    setIsBatchProcessing(true);
    onShowToast(`📦 Packaging all ${allPhotos.length} posters into ZIP...`, 'info');

    try {
      const { posterBlobs, posterFilenames } = await renderAllPosterBlobs();
      const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      await shareService.downloadProductPostersZip({
        blobs: posterBlobs,
        filenames: posterFilenames,
        caption: caption,
        zipName: `${safeName}-all-${allPhotos.length}-posters.zip`
      });
      onShowToast(`✓ All ${allPhotos.length} designed posters saved as .zip!`, 'success');
    } catch (err) {
      console.error('Failed to zip posters', err);
      // Fallback: download sequentially
      try {
        const { posterBlobs, posterFilenames } = await renderAllPosterBlobs();
        posterBlobs.forEach((blob, idx) => {
          shareService.downloadPosterOnly({ blob, filename: posterFilenames[idx] });
        });
        onShowToast(`✓ Saved all ${posterBlobs.length} posters!`, 'success');
      } catch (e2) {
        onShowToast('Failed to save posters', 'error');
      }
    } finally {
      setIsBatchProcessing(false);
    }
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
        {/* Color Palette Switcher: Option A vs Option B */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span>Theme:</span>
          </span>

          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setPostPalette('emerald')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                activePalette === 'emerald'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Emerald & Gold Palette"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#064e3b] border border-[#f59e0b]" />
              <span>Emerald &amp; Gold</span>
            </button>
            <button
              type="button"
              onClick={() => setPostPalette('slate')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                activePalette === 'slate'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Luxury Slate & Gold Palette"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a] border border-[#f59e0b]" />
              <span>Luxury Slate</span>
            </button>
          </div>
        </div>

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

        {/* Reference Photos: Tap any to redesign poster with that photo */}
        {hasRefPhotos && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reference Photos ({allPhotos.length}):</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Photo {selectedPhotoIndex + 1} of {allPhotos.length} in Poster
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Tap any photo to instantly change the poster so you have multiple references to post:
            </p>
            <div className="flex items-center gap-2 overflow-x-auto pt-0.5 pb-1 scrollbar-thin">
              {allPhotos.map((url, i) => {
                const isSelected = selectedPhotoIndex === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedPhotoIndex(i);
                      onShowToast(`✓ Poster redesigned with Reference Photo #${i + 1}!`, 'success');
                    }}
                    className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all p-0.5 border text-left group cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 border-emerald-500 scale-102 bg-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-400 bg-white opacity-70 hover:opacity-100'
                    }`}
                    title={`Click to design flyer with Photo #${i + 1}`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img 
                        src={getOptimizedImageUrl(url)} 
                        alt="" 
                        className="w-full h-full object-contain p-0.5"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                        }}
                      />
                    </div>
                    <div className={`text-[9px] font-bold text-center py-0.5 rounded-b-md ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      {i === 0 ? 'Main' : `Ref #${i}`}
                    </div>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Batch Actions for Boss to post/save all */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleShareAllPosters}
                disabled={isBatchProcessing || isSharing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
                title={`Post all ${allPhotos.length} designed posters together to WhatsApp`}
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white flex-shrink-0" />
                <span className="truncate">
                  {isBatchProcessing ? `Designing ${allPhotos.length} posters...` : `Post All ${allPhotos.length} to WhatsApp`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadAllPosters}
                disabled={isBatchProcessing}
                className="bg-white hover:bg-slate-100 text-slate-700 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs border border-slate-300 transition shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50 flex-shrink-0"
                title={`Download all ${allPhotos.length} designed posters in a ZIP bundle`}
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Save All ({allPhotos.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Multi-Photo WhatsApp Album Switcher */}
        {hasRefPhotos && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📸</span>
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Attach {allPhotos.length - 1} Reference Photos with Poster
                </div>
                <div className="text-[10px] text-slate-500">
                  Sends poster + all extra angles together in 1 tap to WhatsApp
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={includeReferences}
                onChange={(e) => setIncludeReferences(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
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
              {isSharing
                ? 'Opening WhatsApp...'
                : includeReferences && hasRefPhotos
                ? `Share + ${post.product.photos.length - 1} Photos`
                : 'Share to WhatsApp'}
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

            {/* Attached Reference Photos in Preview - Click any to change poster! */}
            {hasRefPhotos && (
              <div className="w-full pt-2 bg-white/5 rounded-xl p-2.5 border border-white/10 mt-1">
                <div className="flex items-center justify-between pb-1.5 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Design Poster from Photos ({allPhotos.length}):</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Photo #{selectedPhotoIndex + 1} in Poster
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 pb-2">
                  Tap any photo below to instantly redesign the poster with that angle/photo:
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                  {allPhotos.map((url, i) => {
                    const isSelected = selectedPhotoIndex === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSelectedPhotoIndex(i);
                          onShowToast(`✓ Poster updated to Reference Photo #${i + 1}!`, 'success');
                        }}
                        className={`relative rounded-xl overflow-hidden flex-shrink-0 transition-all p-1 border text-left group cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-emerald-400 border-emerald-400 scale-105 bg-emerald-950/40 shadow-lg'
                            : 'border-white/20 hover:border-white/40 bg-black/40 opacity-70 hover:opacity-100'
                        }`}
                        title={`Click to design flyer with Photo #${i + 1}`}
                      >
                        <div className="w-13 h-13 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
                          <img 
                            src={getOptimizedImageUrl(url)} 
                            alt="" 
                            className="w-full h-full object-contain p-0.5"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                            }}
                          />
                        </div>
                        <div className={`text-[9px] font-bold text-center py-0.5 mt-0.5 rounded ${
                          isSelected ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-gray-400'
                        }`}>
                          {i === 0 ? 'Main' : `Ref #${i}`}
                        </div>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Batch Actions inside Preview Modal for Boss */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10 mt-1">
                  <button
                    type="button"
                    onClick={handleShareAllPosters}
                    disabled={isBatchProcessing || isSharing}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs transition active:scale-95 disabled:opacity-50"
                    title={`Post all ${allPhotos.length} designed posters together to WhatsApp`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-white flex-shrink-0" />
                    <span className="truncate">{isBatchProcessing ? `Designing ${allPhotos.length} posters...` : `Post All ${allPhotos.length} Posters to WhatsApp`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadAllPosters}
                    disabled={isBatchProcessing}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs border border-white/20 transition active:scale-95 disabled:opacity-50 flex-shrink-0"
                    title={`Save all ${allPhotos.length} posters as a ZIP bundle`}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save All ({allPhotos.length}) .zip</span>
                  </button>
                </div>
              </div>
            )}

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
                title="Save this specific flyer variation"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Save Poster #{selectedPhotoIndex + 1}</span>
              </button>

              <button
                onClick={handleShare}
                disabled={isRendering || isSharing}
                className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition disabled:opacity-50"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white flex-shrink-0" />
                <span className="truncate">
                  {isSharing
                    ? 'Opening WhatsApp...'
                    : includeReferences && hasRefPhotos
                    ? `Share Poster #${selectedPhotoIndex + 1} + ${allPhotos.length - 1} Photos`
                    : `Share Poster #${selectedPhotoIndex + 1} to WhatsApp`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
