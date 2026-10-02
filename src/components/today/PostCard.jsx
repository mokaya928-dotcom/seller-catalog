import React, { useState, useEffect, useMemo } from 'react';
import { 
  Share2, Copy, CheckCircle, Clock, Eye, Download, Check, 
  Palette, Languages, Sparkles, LayoutTemplate, Flame, Zap, 
  Camera, Star, Layers, Tag, Maximize2, ShieldCheck, Image as ImageIcon 
} from 'lucide-react';
import { canvasRenderer } from '../../services/canvasRenderer';
import { getHarmoniousPaletteForProduct } from '../../services/configService';
import { shareService } from '../../services/shareService';
import { scheduleService } from '../../services/scheduleService';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getOptimizedImageUrl, getProductPhotosPool } from '../../utils/imageUtils';
import ProductPosterPreviewModal from '../products/ProductPosterPreviewModal';

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

  // Extract all unique photos for this product
  const allPhotos = useMemo(() => {
    return getProductPhotosPool(post.product, companion);
  }, [post.product, companion]);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const activePhoto = allPhotos[selectedPhotoIndex] || post.product.photo || allPhotos[0];

  const [cardLang, setCardLang] = useState(null); // null means inherit globalCaptionLang
  const [renderedImageUrl, setRenderedImageUrl] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [isRendering, setIsRendering] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Active palette: uses seller's brand palette or harmonious product palette
  const activePalette = seller.palette || getHarmoniousPaletteForProduct(post.product) || 'forest_amber';

  // Active caption language: per-card override or global setting
  const activeCaptionLang = cardLang || globalCaptionLang || (seller?.language === 'swahili' ? 'swahili' : 'english');

  // Dynamic caption based on active language, seller, and companion
  const caption = useMemo(() => {
    return scheduleService.generateCaption(
      post.product,
      seller,
      'retail_classic',
      companion,
      post.date,
      activeCaptionLang
    );
  }, [post.product, seller, companion, post.date, activeCaptionLang]);

  // Re-render canvas image when product, activePhoto, brand, or ratio changes
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    const productToRender = {
      ...post.product,
      photo: activePhoto,
      selectedPhoto: activePhoto
    };

    canvasRenderer
      .renderPost(productToRender, seller, ratio, 'retail_classic', companion, activePalette)
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
    companion ? companion.id : null
  ]);

  // Primary Action: Share to WhatsApp
  const handleShare = async () => {
    if (!imageBlob || isSharing) return;
    setIsSharing(true);

    const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${safeName}-${ratio}.png`;

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
    const filename = `${safeName}-${ratio}.png`;
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

  return (
    <article className={`bg-white rounded-2xl border transition-all overflow-hidden ${
      isPosted ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm' : 'border-slate-200 shadow-sm hover:border-slate-300'
    }`}>
      {/* Post Header: Time slot + Posted Status */}
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

        {/* Posted Toggle Tag */}
        <button
          type="button"
          onClick={() => onTogglePosted(post.slotId, !isPosted)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

      {/* Main Card Content */}
      <div className="p-4 space-y-3.5">

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

        {/* Rendered Canvas Preview with Click-To-Open Overlay */}
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
                className="w-full h-full object-contain cursor-pointer rounded-2xl"
                onClick={() => setIsPreviewOpen(true)}
              />
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="absolute top-3 right-3 bg-slate-900/85 hover:bg-slate-950 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm flex items-center gap-1.5 transition shadow-md cursor-pointer"
                aria-label="Adjust Colors & Preview Poster"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Adjust Colors &amp; Preview</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-red-500">Failed to render post</div>
          )}
        </div>

        {/* Dedicated 1-Click "Adjust Colors, Mood & Preview Poster" Button */}
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Adjust Colors, Mood &amp; Customize Poster</span>
        </button>

        {/* Bundle Duo Companion Banner if companion exists */}
        {companion && (
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
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
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
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
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
            type="button"
            onClick={handleShare}
            disabled={isRendering || isSharing}
            className="col-span-4 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 text-sm cursor-pointer"
            style={{ minHeight: '48px' }}
          >
            <WhatsAppIcon className="w-5 h-5 fill-white flex-shrink-0" />
            <span className="truncate">
              {isSharing ? 'Opening WhatsApp...' : 'Share Poster to WhatsApp'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadOnly}
            disabled={isRendering}
            className="col-span-1 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-slate-200 transition text-[10px] cursor-pointer"
            title="Download flyer image only"
            style={{ minHeight: '48px' }}
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCaption}
            className="col-span-1 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-slate-200 transition text-[10px] cursor-pointer"
            title="Copy Caption to clipboard"
            style={{ minHeight: '48px' }}
          >
            <Copy className="w-4 h-4 text-slate-600" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Full Poster Preview Modal (with In-Preview Color & Mood Adjuster) */}
      {isPreviewOpen && (
        <ProductPosterPreviewModal
          product={{
            ...post.product,
            photo: activePhoto,
            selectedPhoto: activePhoto
          }}
          seller={seller}
          initialRatio={ratio}
          initialPhoto={activePhoto}
          initialDesign="retail_classic"
          initialPalette={activePalette}
          onClose={() => setIsPreviewOpen(false)}
          onShowToast={onShowToast}
        />
      )}
    </article>
  );
}
