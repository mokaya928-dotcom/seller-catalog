import React, { useState, useEffect } from 'react';
import { Share2, Copy, CheckCircle, Clock, Eye, Download, Check, Palette, Languages } from 'lucide-react';
import { canvasRenderer, POST_STYLES } from '../../services/canvasRenderer';
import { shareService } from '../../services/shareService';
import { scheduleService } from '../../services/scheduleService';
import WhatsAppIcon from '../common/WhatsAppIcon';

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
  const hasRefPhotos = Array.isArray(post.product.photos) && post.product.photos.length > 1;

  const [currentStyle, setCurrentStyle] = useState(post.style || 'price_focus');
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

  // Re-render canvas image when product, brand, ratio, style, palette, or companion changes
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    canvasRenderer
      .renderPost(post.product, seller, ratio, currentStyle, companion, activePalette)
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
    const filename = `${safeName}-${currentStyle}-${ratio}.png`;

    try {
      // If user enabled references, fetch additional product photos as blobs
      let refBlobs = [];
      let refNames = [];

      if (includeReferences && hasRefPhotos) {
        const extraPhotos = post.product.photos.slice(1);
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
              ? `✓ Post + ${refBlobs.length} reference photos shared! Caption copied.`
              : '✓ Post shared & caption copied! Ready to paste on WhatsApp.',
            'success'
          );
        } else if (result.method === 'desktop_whatsapp_opened' || result.method === 'download_fallback') {
          onShowToast(
            '✓ Flyer downloaded & WhatsApp opened! Drop flyer into chat/status and paste caption.',
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
    onShowToast('✓ High-res poster saved to your device!', 'success');
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
      isPosted ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm' : 'border-gray-200 shadow-sm hover:border-gray-300'
    }`}>
      {/* Post Header: Time slot + Style Tag + Posted Status */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/90 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            <Clock className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-extrabold text-gray-900 leading-tight">
                {post.time}
              </span>
              {post.product.category && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {post.product.category}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">{post.label}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Style Selector Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-emerald-500 transition shadow-2xs"
              title="Change Post Style Layout"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[85px] truncate">{currentStyleObj.name.split('/')[0]}</span>
            </button>

            {isStyleMenuOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 z-30 animate-fade-in"
                onClick={() => setIsStyleMenuOpen(false)}
              >
                <div className="text-[10px] font-extrabold text-gray-400 px-2 py-1 uppercase tracking-wider">
                  Select Post Layout Style
                </div>
                {POST_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCurrentStyle(style.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs transition flex flex-col ${
                      currentStyle === style.id
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-gray-700 hover:bg-gray-50 font-medium'
                    }`}
                  >
                    <span>{style.name}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{style.desc}</span>
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
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
          <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-gray-400" />
            <span>Theme:</span>
          </span>

          <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg border border-gray-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setPostPalette('emerald')}
              className={`px-2 py-1 rounded-md text-[11px] font-black transition-all flex items-center gap-1.5 ${
                activePalette === 'emerald'
                  ? 'bg-white text-emerald-950 shadow-xs border border-emerald-300'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Emerald & Gold Palette"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#064e3b] border border-[#f59e0b]" />
              <span>Emerald &amp; Gold</span>
            </button>
            <button
              type="button"
              onClick={() => setPostPalette('slate')}
              className={`px-2 py-1 rounded-md text-[11px] font-black transition-all flex items-center gap-1.5 ${
                activePalette === 'slate'
                  ? 'bg-white text-slate-950 shadow-xs border border-slate-400'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Luxury Slate & Gold Palette"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f172a] border border-[#f59e0b]" />
              <span>Luxury Slate</span>
            </button>
          </div>
        </div>

        {/* Rendered Canvas Preview */}
        <div className="relative group bg-gray-100 rounded-xl overflow-hidden border border-gray-200 aspect-[4/5] sm:aspect-[9/16] max-h-[380px] flex items-center justify-center">
          {isRendering ? (
            <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-gray-500">Creating branded post...</p>
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
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-black text-rose-700 bg-white border border-rose-200 px-1.5 py-0.5 rounded-md flex-shrink-0">2-IN-1</span>
              <div className="truncate">
                <span className="font-bold text-rose-950">Paired with: </span>
                <span className="font-semibold text-rose-800">{companion.name}</span>
              </div>
            </div>
            <span className="font-extrabold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 flex-shrink-0">
              KES {Number(companion.price).toLocaleString()}
            </span>
          </div>
        )}

        {/* Multi-Photo WhatsApp Album Switcher */}
        {hasRefPhotos && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📸</span>
              <div>
                <div className="text-xs font-bold text-emerald-950">
                  Share with {post.product.photos.length - 1} Reference Photos
                </div>
                <div className="text-[10px] text-emerald-700">
                  Texture swatch &amp; packaging sent in 1 tap to WhatsApp
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
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        )}

        {/* Product Quick Info */}
        <div className="flex items-start justify-between gap-2">
          <div>
            {post.product.category && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {post.product.category}
                </span>
                {post.product.size && (
                  <span className="text-[10px] font-semibold text-gray-500">
                    • {post.product.size}
                  </span>
                )}
              </div>
            )}
            <h3 className="text-base font-bold text-gray-900 leading-snug">
              {post.product.name}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
              {post.product.benefit_line}
            </p>
          </div>
          <span className="inline-block bg-slate-900 text-white font-extrabold text-sm px-2.5 py-1 rounded-lg flex-shrink-0">
            KES {Number(post.product.price).toLocaleString()}
          </span>
        </div>

        {/* Caption Bar with Swahili / English Toggle */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>Caption:</span>
          </span>

          <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg border border-gray-200 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setCardLang('swahili');
                onShowToast('✓ Caption switched to Kiswahili! 🇰🇪', 'info');
              }}
              className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all flex items-center gap-1 ${
                activeCaptionLang === 'swahili'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
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
              className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all flex items-center gap-1 ${
                activeCaptionLang === 'english'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="English Caption"
            >
              <span>English</span>
            </button>
          </div>
        </div>

        {/* Caption Snippet */}
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-700 leading-relaxed font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
          {caption}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-6 gap-2 pt-1">
          <button
            onClick={handleShare}
            disabled={isRendering || isSharing}
            className="col-span-4 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 text-sm"
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
            className="col-span-1 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-bold py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-gray-300 transition text-[10px]"
            title="Download flyer image only"
            style={{ minHeight: '48px' }}
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span>Save</span>
          </button>

          <button
            onClick={handleCopyCaption}
            className="col-span-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-bold py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-gray-300 transition text-[10px]"
            title="Copy Caption to clipboard"
            style={{ minHeight: '48px' }}
          >
            <Copy className="w-4 h-4 text-gray-600" />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Full Post Modal Preview */}
      {isPreviewOpen && renderedImageUrl && (
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
                className="text-white/80 hover:text-white text-xs font-bold px-2.5 py-1 bg-white/20 rounded-lg flex-shrink-0"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
              <img 
                src={renderedImageUrl} 
                alt="High resolution post" 
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl" 
              />
            </div>

            {/* Attached Reference Photos in Preview */}
            {hasRefPhotos && (
              <div className="w-full pt-2">
                <div className="text-[10px] font-bold text-gray-400 mb-1">
                  Attached Reference Photos ({post.product.photos.length - 1}):
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {post.product.photos.slice(1).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="w-12 h-12 rounded-lg object-contain bg-black/40 border border-white/20 flex-shrink-0"
                    />
                  ))}
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
                onClick={handleShare}
                className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>
                  {includeReferences && hasRefPhotos
                    ? `Share Post + ${post.product.photos.length - 1} Photos`
                    : 'Share to WhatsApp'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
