import React, { useState } from 'react';
import { 
  X, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, Heart, 
  Share2, HelpCircle, ArrowRight, Play, Image as ImageIcon, 
  ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, Check, Lock, Flame, ShoppingBag
} from 'lucide-react';
import { shareService } from '../../services/shareService';
import { getProductRemaining, getProductRegularPrice, getProductSocialProof } from '../../services/scheduleService';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getOptimizedImageUrl, getProductPhotosPool } from '../../utils/imageUtils';

export default function ProductDetailModal({ product, seller, onClose, onAddToList, isSelected }) {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'ingredients' | 'how_to_use'
  const [isMacroZoom, setIsMacroZoom] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const remaining = getProductRemaining(product);
  const regularPrice = getProductRegularPrice(product);
  const socialProof = getProductSocialProof(product);
  const savings = regularPrice && regularPrice > product.price ? regularPrice - product.price : null;

  // Extract all photos guaranteed to have multiple angles/references for all products
  const photosList = React.useMemo(() => {
    return getProductPhotosPool(product);
  }, [product]);

  const [activeMedia, setActiveMedia] = useState({
    type: 'photo', // 'photo' | 'video'
    index: 0
  });

  const [copiedLink, setCopiedLink] = useState(false);

  const cleanPhone = (seller.phone_raw || seller.phone || '254728222211').replace(/[^0-9]/g, '');

  const handleShareLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?view=catalog&prod=${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - ${seller.shop_name || 'Store'}`,
          text: `Check out ${product.name} (KES ${Number(product.price).toLocaleString()})!`,
          url: url
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    await shareService.copyText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActiveMedia((prev) => ({
      type: 'photo',
      index: prev.index === 0 ? photosList.length - 1 : prev.index - 1
    }));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActiveMedia((prev) => ({
      type: 'photo',
      index: prev.index === photosList.length - 1 ? 0 : prev.index + 1
    }));
  };

  // 1-Tap Inquiry Message (Accompanied by Product Photo)
  const handleInquire = async () => {
    const text = `Hi ${seller.shop_name}! 👋\n\n` +
      `I'm interested in this item from your catalogue:\n` +
      `*${product.name}* (${product.size || ''})\n` +
      `💰 Price: *KES ${Number(product.price).toLocaleString()}*\n\n` +
      `Could you please share delivery details and M-Pesa payment info? Thanks!`;

    await shareService.orderOnWhatsApp({
      product,
      seller,
      customMessage: text
    });
  };

  // 1-Tap Instant Order Message (Accompanied by Product Photo)
  const handleDirectOrder = async () => {
    const text = `Hi ${seller.shop_name}! 👋\n\n` +
      `I'd like to order this item directly from your catalogue:\n` +
      `📦 *${product.name}* (${product.size || ''})\n` +
      `💰 Price: *KES ${Number(product.price).toLocaleString()}*\n` +
      `📍 Delivery: Nairobi / Countrywide\n\n` +
      `Please send Lipa na M-Pesa payment details and estimated delivery time. Thanks!`;

    await shareService.orderOnWhatsApp({
      product,
      seller,
      customMessage: text
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center backdrop-blur-xs animate-fade-in p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-700" />
              <span>100% Authentic Quality</span>
            </span>
            {product.badge && (
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                product.video ? 'bg-purple-100 text-purple-900 border border-purple-200' : 'bg-amber-100 text-amber-900'
              }`}>
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShareLink}
              className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 transition active:scale-95"
              title="Share direct link to this product"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                  <span className="text-[11px] text-emerald-700 font-black">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-[11px] hidden xs:inline font-bold">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Visual Display: Multi-Photo Gallery + Interactive Video Demo + Macro Zoom */}
          <div className="space-y-2.5">
            <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl p-3 flex flex-col items-center justify-center border border-gray-200/80 overflow-hidden shadow-inner group min-h-[280px]">
              {activeMedia.type === 'video' && product.video ? (
                <div className="w-full flex flex-col items-center">
                  <video
                    src={product.video}
                    controls
                    autoPlay
                    playsInline
                    loop
                    className="w-full max-h-72 rounded-2xl object-contain bg-black shadow-lg"
                  />
                  <span className="mt-2 text-[11px] font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Live Application Demo Video
                  </span>
                </div>
              ) : (
                <div 
                  className="relative w-full flex items-center justify-center cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => setIsFullscreen(true)}
                  title="Tap to view full high-resolution image"
                >
                  <img
                    src={getOptimizedImageUrl(photosList[activeMedia.index] || product.photo)}
                    alt={`${product.name} view ${activeMedia.index + 1}`}
                    className={`max-h-64 w-auto object-contain drop-shadow-md rounded-2xl transition-transform duration-300 ${
                      isMacroZoom ? 'scale-175 cursor-zoom-out' : 'group-hover:scale-[1.02]'
                    }`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                    }}
                  />
                  
                  {/* Fullscreen Magnify button */}
                  <span className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-xl backdrop-blur-xs transition flex items-center gap-1 text-[10px] font-bold">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              )}

              {/* Prev / Next photo buttons on main image (only if truly multiple unique photos) */}
              {activeMedia.type === 'photo' && photosList.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition border border-gray-200/80 active:scale-90"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition border border-gray-200/80 active:scale-90"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Index / Status Tag */}
              <div className="absolute top-3 left-3 flex gap-1 z-10">
                {activeMedia.type === 'photo' && photosList.length > 1 && (
                  <span className="bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    📷 {activeMedia.index + 1} / {photosList.length}
                  </span>
                )}
                {product.size && (
                  <span className="bg-black/65 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    Net: {product.size}
                  </span>
                )}
              </div>

              <span className="absolute bottom-3 right-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                In Stock
              </span>
            </div>

            {/* If ONLY 1 photo: Show interactive macro detail inspector for authenticating labels & packaging */}
            {photosList.length === 1 && !product.video && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Original Factory Packaging</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMacroZoom(!isMacroZoom)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 ${
                    isMacroZoom
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {isMacroZoom ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3 text-emerald-600" />}
                  <span>{isMacroZoom ? 'Reset Zoom' : 'Inspect Labels (2x Zoom)'}</span>
                </button>
              </div>
            )}

            {/* Gallery Thumbnail Strip (ONLY if truly multiple unique photos or video) */}
            {(photosList.length > 1 || product.video) && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-none">
                {photosList.map((picUrl, idx) => {
                  const isActive = activeMedia.type === 'photo' && activeMedia.index === idx;
                  const label = idx === 0 ? 'Main View' : `View ${idx + 1}`;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setIsMacroZoom(false);
                        setActiveMedia({ type: 'photo', index: idx });
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 flex flex-col items-center justify-center transition p-1 ${
                        isActive
                          ? 'border-emerald-600 ring-2 ring-emerald-400/30 scale-102'
                          : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={getOptimizedImageUrl(picUrl)} 
                        alt="" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                        }}
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] font-extrabold text-center py-0.2">
                        {label}
                      </span>
                    </button>
                  );
                })}

                {/* Video Demo Thumbnail Chip */}
                {product.video && (
                  <button
                    onClick={() => setActiveMedia({ type: 'video', index: 0 })}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden bg-purple-950 flex flex-col items-center justify-center transition p-1 ${
                      activeMedia.type === 'video'
                        ? 'border-purple-500 ring-2 ring-purple-400/30 scale-102'
                        : 'border-gray-300 hover:border-purple-400 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Play className="w-5 h-5 text-rose-400 fill-current" />
                    <span className="absolute bottom-0 inset-x-0 bg-purple-900/90 text-white text-[9px] font-extrabold text-center py-0.2">
                      Video
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Title, Category & Price Block */}
          <div className="space-y-2 border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">
                {product.category || 'Beauty Care'}
              </span>
              {seller.mpesa_till && (
                <span className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Till: {seller.mpesa_till}</span>
                </span>
              )}
            </div>

            <h1 className="text-lg font-black text-gray-900 leading-snug">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-2.5 pt-1 flex-wrap">
              <span className="text-2xl font-black text-emerald-700">
                KES {Number(product.price).toLocaleString()}
              </span>
              {regularPrice && regularPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-bold">
                  KES {Number(regularPrice).toLocaleString()}
                </span>
              )}
              {savings && (
                <span className="text-xs font-black text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs">
                  <span>Save KES {savings.toLocaleString()}</span>
                  <span className="text-[10px] text-rose-800">({Math.round((savings / regularPrice) * 100)}% OFF)</span>
                </span>
              )}
            </div>

            {/* Stock Availability Status */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <Flame className="w-4 h-4 text-amber-600 fill-current" />
                  <span>Only {remaining} {remaining === 1 ? 'piece' : 'pieces'} in stock</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  ★ {socialProof.rating} ({socialProof.orders} orders)
                </span>
              </div>
              <p className="text-[11px] text-amber-900/90 font-medium">
                Available for same-day Nairobi CBD pickup or express delivery across Kenya
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 p-3 rounded-2xl leading-relaxed">
              {product.benefit_line}
            </p>
          </div>

          {/* Interactive Information Tabs */}
          <div className="space-y-3">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-2.5 text-xs font-black text-center transition border-b-2 ${
                  activeTab === 'about'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                About &amp; Highlights
              </button>
              {product.ingredients && (
                <button
                  type="button"
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex-1 py-2.5 text-xs font-black text-center transition border-b-2 ${
                    activeTab === 'ingredients'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Key Ingredients
                </button>
              )}
              {product.how_to_use && (
                <button
                  type="button"
                  onClick={() => setActiveTab('how_to_use')}
                  className={`flex-1 py-2.5 text-xs font-black text-center transition border-b-2 ${
                    activeTab === 'how_to_use'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  How to Use
                </button>
              )}
            </div>

            <div className="text-xs leading-relaxed text-gray-700 pt-1">
              {activeTab === 'about' && (
                <div className="space-y-3">
                  <p>{product.description || product.benefit_line}</p>
                  {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {product.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-emerald-50/60 border border-emerald-100 p-2 rounded-xl text-[11px] font-bold text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl space-y-1.5">
                  <span className="font-extrabold text-amber-900 text-[11px] uppercase tracking-wider block">
                    Active Formula &amp; Ingredients:
                  </span>
                  <p className="text-amber-950 font-medium">
                    {product.ingredients}
                  </p>
                </div>
              )}

              {activeTab === 'how_to_use' && (
                <div className="bg-blue-50/60 border border-blue-200/60 p-3.5 rounded-2xl space-y-1.5">
                  <span className="font-extrabold text-blue-900 text-[11px] uppercase tracking-wider block">
                    Recommended Application Routine:
                  </span>
                  <p className="text-blue-950 font-medium">
                    {product.how_to_use}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-slate-100 bg-white shadow-xl flex items-center gap-2">
          {onAddToList && (
            <button
              type="button"
              onClick={() => onAddToList(product.id)}
              className={`py-3.5 px-4 rounded-2xl border font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Add to order list"
            >
              {isSelected ? (
                <>
                  <Check className="w-4 h-4 stroke-[3px] text-emerald-600" />
                  <span className="font-bold">In Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-slate-600" />
                  <span className="whitespace-nowrap font-bold">+ Add to Bag</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDirectOrder}
            className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition"
            style={{ minHeight: '48px' }}
          >
            <WhatsAppIcon className="w-4 h-4 fill-white flex-shrink-0" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Fullscreen High-Definition Image Lightbox */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 p-2.5 rounded-full transition z-70"
            aria-label="Close Fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="relative max-w-xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getOptimizedImageUrl(photosList[activeMedia.index] || product.photo)}
              alt={product.name}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
              }}
            />

            {photosList.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/20 active:scale-95 transition"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/20 active:scale-95 transition"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Quick thumbnails strip inside lightbox (only if truly multiple photos) */}
          {photosList.length > 1 && (
            <div 
              className="flex items-center gap-2 p-2 bg-white/10 rounded-2xl backdrop-blur-xs overflow-x-auto max-w-md mt-4"
              onClick={(e) => e.stopPropagation()}
            >
              {photosList.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMedia({ type: 'photo', index: idx })}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-black flex-shrink-0 transition ${
                    activeMedia.type === 'photo' && activeMedia.index === idx ? 'border-emerald-500 scale-105' : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={getOptimizedImageUrl(p)} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/products/bbk-vaseline-lip.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
