import React, { useState } from 'react';
import {
  LayoutGrid, List, Crown, Film, PackageCheck, Pin,
  Zap, Layers, SlidersHorizontal, Palette, Heart, Check,
  Plus, Eye, Share2, Flame, ArrowRight, Clock, Star,
  Minus, ShoppingBag, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { getProductRemaining, getProductRegularPrice, getProductSocialProof } from '../../services/scheduleService';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

export const CATALOG_LAYOUTS = [
  {
    id: 'grid',
    name: 'Modern 2-Col Grid',
    shortName: 'Modern Grid',
    tagline: 'Visual-first cards with big photos & 1-tap bag',
    icon: LayoutGrid,
    badge: 'Default',
    accentColor: 'emerald',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'luxury_lookbook',
    name: 'Vogue Luxury Lookbook',
    shortName: 'Luxury Lookbook',
    tagline: 'Magazine-style full-width cards with serif typography',
    icon: Crown,
    badge: 'Editorial',
    accentColor: 'amber',
    gradient: 'from-amber-600 to-stone-900',
  },
  {
    id: 'story_feed',
    name: 'TikTok Story Feed',
    shortName: 'Story Feed',
    tagline: 'Portrait reels with multi-photo taps & buy overlay',
    icon: Film,
    badge: 'Viral',
    accentColor: 'rose',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    id: 'wholesale_list',
    name: 'Nairobi Duka Wholesale',
    shortName: 'Duka Wholesale',
    tagline: 'High-density B2B order sheet with direct +/- steppers',
    icon: PackageCheck,
    badge: 'B2B Sheet',
    accentColor: 'blue',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'masonry_pins',
    name: 'Pinterest Pinboard',
    shortName: 'Pinterest Pins',
    tagline: 'Staggered discovery pins with dynamic aspect ratios',
    icon: Pin,
    badge: 'Aesthetic',
    accentColor: 'purple',
    gradient: 'from-purple-600 to-indigo-600',
  },
  {
    id: 'flash_deals',
    name: 'Flash Marketplace Deals',
    shortName: 'Flash Deals',
    tagline: 'High-urgency clearance countdowns & claimed bars',
    icon: Zap,
    badge: 'Urgent Deals',
    accentColor: 'red',
    gradient: 'from-rose-600 to-orange-500',
  },
  {
    id: 'minimalist_mono',
    name: 'Minimalist Apple Studio',
    shortName: 'Minimalist',
    tagline: 'Ultra-clean monochrome negative space & hairline borders',
    icon: Layers,
    badge: 'Clean Mono',
    accentColor: 'zinc',
    gradient: 'from-zinc-800 to-black',
  },
  {
    id: 'category_aisles',
    name: 'Department Boutique Aisles',
    shortName: 'Store Aisles',
    tagline: 'Horizontal swipe carousels per beauty category',
    icon: SlidersHorizontal,
    badge: 'Aisle Shelves',
    accentColor: 'teal',
    gradient: 'from-teal-600 to-emerald-800',
  },
  {
    id: 'swatch_gallery',
    name: 'Swatch & Multi-Angle Studio',
    shortName: 'Swatch Studio',
    tagline: 'Interactive photo angle swatches on the card face',
    icon: Palette,
    badge: 'Swatches',
    accentColor: 'fuchsia',
    gradient: 'from-fuchsia-600 to-pink-700',
  },
  {
    id: 'list',
    name: 'Detailed Spec Sheet',
    shortName: 'Detailed List',
    tagline: 'Full benefit lines, ratings, and multi-action controls',
    icon: List,
    badge: 'Deep Specs',
    accentColor: 'slate',
    gradient: 'from-slate-700 to-slate-900',
  },
];

/* ========================================================================= */
/* 1. LUXURY LOOKBOOK VIEW (VOGUE / HIGH FASHION EDITORIAL)                  */
/* ========================================================================= */
export function LuxuryLookbookView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onShareProduct,
  onSingleOrder,
  copiedProdId
}) {
  return (
    <div className="space-y-6">
      <div className="text-center py-2 px-4 bg-stone-900 text-stone-100 rounded-2xl border border-amber-900/40">
        <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300/90 font-serif font-semibold">
          ✦ The Curated Editorial Selection • Nairobi Luxury ✦
        </span>
      </div>

      {products.map((product) => {
        const isSelected = Boolean(cart[product.id]);
        const regularPrice = getProductRegularPrice(product);
        const remaining = getProductRemaining(product);

        return (
          <article
            key={product.id}
            onClick={() => onViewProduct(product)}
            className="bg-[#191816] text-[#f5f2eb] rounded-3xl overflow-hidden border border-amber-400/20 shadow-xl transition-all hover:border-amber-400/40 cursor-pointer group"
          >
            {/* Magazine Header Tag */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between text-[11px] border-b border-white/5">
              <span className="font-serif tracking-widest text-amber-300 uppercase text-[10px]">
                {product.category || 'Luxury Beauty'}
              </span>
              <span className="text-stone-400 text-[10px] font-mono tracking-wider">
                NO. {product.id.slice(-4).toUpperCase()}
              </span>
            </div>

            {/* Hero Image Showcase */}
            <div className="relative aspect-[4/3] bg-gradient-to-b from-[#252320] to-[#191816] flex items-center justify-center p-6 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] pointer-events-none" />
              <img
                src={getOptimizedImageUrl(product.photo)}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/products/bbk-vaseline-lip.jpg';
                }}
                className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 bg-amber-400/90 text-stone-950 font-serif text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-lg">
                  {product.badge}
                </span>
              )}

              {product.size && (
                <span className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-md text-amber-200 text-[10px] font-mono px-2 py-0.5 rounded-md border border-amber-400/20">
                  {product.size}
                </span>
              )}
            </div>

            {/* Editorial Content */}
            <div className="p-5 space-y-3">
              <h2 className="font-serif text-lg font-bold tracking-wide text-white group-hover:text-amber-300 transition">
                {product.name}
              </h2>

              <p className="font-serif italic text-stone-300 text-xs leading-relaxed border-l-2 border-amber-400/50 pl-3">
                "{product.benefit_line || product.description || 'Crafted with premium active botanicals for radiant and lasting results.'}"
              </p>

              {/* Price & Scarcity */}
              <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-xl font-serif font-black text-amber-300 tracking-tight">
                    KES {Number(product.price).toLocaleString()}
                  </span>
                  {regularPrice && regularPrice > product.price && (
                    <span className="ml-2 text-xs text-stone-500 line-through font-serif">
                      KES {Number(regularPrice).toLocaleString()}
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-amber-200/80 font-mono tracking-wider">
                  {remaining} BOTTLES IN NAIROBI
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={(e) => onToggleBag(e, product.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-serif font-bold tracking-wider uppercase transition flex items-center justify-center gap-1.5 border ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-md'
                      : 'bg-transparent text-amber-300 border-amber-400/40 hover:bg-amber-400/10'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      <span>Curated</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                      <span>+ Private Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => onSingleOrder(e, product)}
                  className="bg-gradient-to-r from-emerald-600 to-[#25D366] hover:brightness-110 text-white font-serif font-bold py-2.5 px-3 rounded-xl text-xs tracking-wider flex items-center justify-center gap-1.5 shadow-md transition"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>Concierge Order</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ========================================================================= */
/* 2. TIKTOK / REELS STORY FEED VIEW (PORTRAIT MOBILE-FIRST)                 */
/* ========================================================================= */
export function StoryFeedView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onShareProduct,
  onSingleOrder,
  seller,
  copiedProdId
}) {
  const [photoIndices, setPhotoIndices] = useState({});
  const [likedMap, setLikedMap] = useState({});

  const handleNextPhoto = (e, productId, photosCount) => {
    e.stopPropagation();
    if (photosCount <= 1) return;
    setPhotoIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % photosCount
    }));
  };

  const handlePrevPhoto = (e, productId, photosCount) => {
    e.stopPropagation();
    if (photosCount <= 1) return;
    setPhotoIndices((prev) => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + photosCount) % photosCount
    }));
  };

  const handleToggleLike = (e, productId) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  return (
    <div className="space-y-6">
      {products.map((product) => {
        const isSelected = Boolean(cart[product.id]);
        const photos = product.photos && product.photos.length > 0 ? product.photos : [product.photo];
        const currentIdx = photoIndices[product.id] || 0;
        const currentPhoto = photos[currentIdx] || product.photo;
        const isLiked = Boolean(likedMap[product.id]);
        const socialProof = getProductSocialProof(product);

        return (
          <article
            key={product.id}
            onClick={() => onViewProduct(product)}
            className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 cursor-pointer aspect-[3/4] max-h-[580px] flex flex-col justify-between group"
          >
            {/* Background Product Image */}
            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
              <img
                src={getOptimizedImageUrl(currentPhoto)}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/products/bbk-vaseline-lip.jpg';
                }}
                className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
              />
              {/* Gradient Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />
            </div>

            {/* Top Story Header & Bars */}
            <div className="relative z-10 p-3.5 space-y-2">
              {/* Instagram/TikTok Story Progress Bars */}
              {photos.length > 1 && (
                <div className="flex gap-1">
                  {photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        idx === currentIdx ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Account Pill & Music Vibe */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-[9px]">
                    BB
                  </div>
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    {seller.shop_name || 'Beauty Bar Kenya'}
                  </span>
                </div>

                <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 text-[9px] font-semibold text-rose-300 flex items-center gap-1">
                  <span>🎵 Viral Beauty Pick</span>
                </div>
              </div>
            </div>

            {/* Tap Navigation Zones (Left for prev, Right for next) */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => handlePrevPhoto(e, product.id, photos.length)}
                  className="absolute left-0 top-16 bottom-28 w-1/3 z-10 cursor-w-resize opacity-0"
                  aria-label="Previous photo"
                />
                <button
                  type="button"
                  onClick={(e) => handleNextPhoto(e, product.id, photos.length)}
                  className="absolute right-0 top-16 bottom-28 w-1/3 z-10 cursor-e-resize opacity-0"
                  aria-label="Next photo"
                />
              </>
            )}

            {/* Floating Right Engagement Stack (TikTok style) */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={(e) => handleToggleLike(e, product.id)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white active:scale-125 transition"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`}
                />
                <span className="text-[8px] font-bold mt-0.5">
                  {isLiked ? 'Liked' : socialProof.reviews_count || '128'}
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => onShareProduct(e, product)}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white active:scale-125 transition"
              >
                <Share2 className="w-4 h-4 text-white" />
                <span className="text-[8px] font-bold mt-0.5">Share</span>
              </button>

              <button
                type="button"
                onClick={(e) => onToggleBag(e, product.id)}
                className={`w-10 h-10 rounded-full backdrop-blur-md border flex flex-col items-center justify-center transition active:scale-125 ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-black/50 text-white border-white/20'
                }`}
              >
                {isSelected ? <Check className="w-4 h-4 stroke-[3px]" /> : <Plus className="w-4 h-4 stroke-[3px]" />}
                <span className="text-[8px] font-bold mt-0.5">{isSelected ? 'In Bag' : '+ Bag'}</span>
              </button>
            </div>

            {/* Bottom Frosted Glass Order Bar */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pt-6">
              <div className="space-y-2 pr-14">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-500/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                    {product.category || 'Trending'}
                  </span>
                  <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                    ★ {socialProof.rating}
                  </span>
                </div>

                <h2 className="text-base font-black text-white leading-snug drop-shadow-md">
                  {product.name}
                </h2>

                <p className="text-zinc-300 text-[11px] line-clamp-1">
                  {product.benefit_line || product.description}
                </p>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-lg font-black text-emerald-400">
                    KES {Number(product.price).toLocaleString()}
                  </span>
                  {product.size && (
                    <span className="text-[10px] text-zinc-400">
                      • {product.size}
                    </span>
                  )}
                </div>
              </div>

              {/* Direct Buy Bar */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={(e) => onSingleOrder(e, product)}
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg transition"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>⚡ Instant Order on WhatsApp</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ========================================================================= */
/* 3. NAIROBI DUKA WHOLESALE VIEW (B2B QUICK-ORDER SPREADSHEET)             */
/* ========================================================================= */
export function WholesaleListView({
  products,
  cart,
  onUpdateQuantity,
  onViewProduct,
  onSingleOrder,
  seller
}) {
  const totalUnits = Object.values(cart).reduce((s, q) => s + q, 0);
  const wholesaleTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((prod) => prod.id === id);
    return p ? sum + Number(p.price) * qty : sum;
  }, 0);

  const handleBulkOrderWhatsApp = () => {
    const items = Object.entries(cart)
      .map(([id, qty]) => {
        const p = products.find((prod) => prod.id === id);
        return p ? `• ${p.name} x${qty} = KES ${(Number(p.price) * qty).toLocaleString()}` : null;
      })
      .filter(Boolean);

    if (items.length === 0) return;

    const message = `Halo ${seller.shop_name || 'Beauty Bar'}! I would like to place a WHOLESALE / DUKA BULK ORDER:\n\n${items.join('\n')}\n\n*Total Units:* ${totalUnits}\n*Estimated Order Total:* KES ${wholesaleTotal.toLocaleString()}\n\nPlease confirm availability and payment till. Thank you!`;
    const cleanPhone = (seller.phone_raw || seller.phone || '254728222211').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Wholesale Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-blue-700" />
            <span>Nairobi Duka Wholesale Sheet</span>
          </span>
          <p className="text-[10px] text-blue-700 mt-0.5">
            Use +/- steppers to select quantities for direct bulk dispatch.
          </p>
        </div>
        <span className="bg-blue-700 text-white text-[10px] font-black px-2 py-1 rounded-lg">
          Salon &amp; Retail Ready
        </span>
      </div>

      {/* Spreadsheet Rows */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {products.map((product) => {
          const qty = cart[product.id] || 0;
          const remaining = getProductRemaining(product);

          return (
            <div
              key={product.id}
              onClick={() => onViewProduct(product)}
              className={`p-3 flex items-center gap-3 transition cursor-pointer hover:bg-slate-50 ${
                qty > 0 ? 'bg-blue-50/50' : ''
              }`}
            >
              {/* Product Thumbnail */}
              <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden p-1">
                <img
                  src={getOptimizedImageUrl(product.photo)}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/products/bbk-vaseline-lip.jpg';
                  }}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title & Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {product.category || 'Beauty'}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
                    {remaining} avail
                  </span>
                </div>
                <div className="text-xs font-black text-slate-900 mt-1">
                  KES {Number(product.price).toLocaleString()}
                </div>
              </div>

              {/* Direct Quantity Stepper */}
              <div
                className="flex items-center gap-1.5 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, Math.max(0, qty - 1))}
                  disabled={qty === 0}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                    qty > 0
                      ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[3px]" />
                </button>

                <span className="w-6 text-center text-xs font-black font-mono text-slate-900">
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateQuantity(product.id, qty + 1)}
                  className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center font-bold text-xs transition shadow-2xs"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[3px]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Wholesale Bulk Order Bar */}
      {totalUnits > 0 && (
        <div className="sticky bottom-16 z-30 bg-blue-900 text-white p-3.5 rounded-2xl shadow-xl border border-blue-700 flex items-center justify-between gap-3 animate-fade-in">
          <div>
            <div className="text-[11px] font-bold text-blue-200">
              Wholesale Order ({totalUnits} units)
            </div>
            <div className="text-base font-black text-white">
              KES {wholesaleTotal.toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            onClick={handleBulkOrderWhatsApp}
            className="bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 text-xs shadow-md transition"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
            <span>Submit Wholesale PO</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 4. PINTEREST MASONRY PINBOARD VIEW                                       */
/* ========================================================================= */
export function MasonryPinsView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onSingleOrder
}) {
  return (
    <div className="columns-2 gap-3 space-y-3">
      {products.map((product, idx) => {
        const isSelected = Boolean(cart[product.id]);
        const isTall = idx % 3 === 0;

        return (
          <article
            key={product.id}
            onClick={() => onViewProduct(product)}
            className="break-inside-avoid bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col"
          >
            {/* Image Pin with variable height */}
            <div
              className={`relative bg-slate-50 flex items-center justify-center p-3 overflow-hidden ${
                isTall ? 'aspect-[3/4]' : 'aspect-square'
              }`}
            >
              <img
                src={getOptimizedImageUrl(product.photo)}
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/products/bbk-vaseline-lip.jpg';
                }}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {/* Heart/Bag Button */}
              <button
                type="button"
                onClick={(e) => onToggleBag(e, product.id)}
                className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-md transition active:scale-125 ${
                  isSelected
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/80 text-slate-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSelected ? 'fill-white' : ''}`} />
              </button>

              {/* Floating Price Pill */}
              <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                KES {Number(product.price).toLocaleString()}
              </div>
            </div>

            {/* Pin Details */}
            <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">
                  {product.category || 'Beauty'}
                </span>
                <h3 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug mt-0.5">
                  {product.name}
                </h3>
              </div>

              <div className="pt-2 flex items-center gap-1.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={(e) => onSingleOrder(e, product)}
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-1.5 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 shadow-2xs"
                >
                  <WhatsAppIcon className="w-3 h-3 fill-white" />
                  <span>Order</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ========================================================================= */
/* 5. FLASH DEALS MARKETPLACE VIEW (JUMIA/KILIMALL URGENCY)                  */
/* ========================================================================= */
export function FlashDealsView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onSingleOrder,
  countdown
}) {
  return (
    <div className="space-y-4">
      {/* Top Urgent Deals Ticker */}
      <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-3 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-pulse" />
          <div>
            <span className="text-xs font-black uppercase tracking-wider block">
              ⚡ Flash Clearance Deals
            </span>
            <span className="text-[10px] text-amber-100">
              CBD Courier Closes at 6:00 PM
            </span>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold">
          ⏱️ {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const isSelected = Boolean(cart[product.id]);
          const remaining = getProductRemaining(product);
          const regularPrice = getProductRegularPrice(product);
          const savings = regularPrice && regularPrice > product.price ? regularPrice - product.price : Math.round(product.price * 0.2);
          const fakeOriginal = regularPrice || Math.round(product.price * 1.25);
          const discountPct = Math.round((savings / fakeOriginal) * 100);

          return (
            <article
              key={product.id}
              onClick={() => onViewProduct(product)}
              className="bg-white rounded-2xl overflow-hidden border-2 border-rose-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Image & Discount Badge */}
              <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-3">
                <img
                  src={getOptimizedImageUrl(product.photo)}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/products/bbk-vaseline-lip.jpg';
                  }}
                  className="w-full h-full object-contain"
                />

                <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs animate-pulse">
                  -{discountPct}% OFF
                </span>

                <span className="absolute bottom-2 left-2 bg-amber-400 text-amber-950 font-black text-[8px] px-1.5 py-0.2 rounded">
                  Save KES {savings.toLocaleString()}
                </span>
              </div>

              {/* Flash Details */}
              <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Scarcity Bar */}
                  <div className="mt-1.5 space-y-0.5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-rose-700">
                      <span>🔥 {remaining <= 3 ? 'Almost Gone!' : '82% Claimed'}</span>
                      <span>{remaining} left</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-red-600 w-4/5 rounded-full" />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-sm font-black text-red-600">
                      KES {Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      KES {Number(fakeOriginal).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Instant Claim Button */}
                <button
                  type="button"
                  onClick={(e) => onSingleOrder(e, product)}
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black py-2 px-2 rounded-xl text-[10px] flex items-center justify-center gap-1 shadow-xs transition"
                >
                  <WhatsAppIcon className="w-3 h-3 fill-white" />
                  <span>Claim Deal</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 6. MINIMALIST APPLE / MUJI CLEAN STUDIO                                   */
/* ========================================================================= */
export function MinimalistMonoView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onSingleOrder
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const isSelected = Boolean(cart[product.id]);

          return (
            <article
              key={product.id}
              onClick={() => onViewProduct(product)}
              className="bg-white rounded-xl p-3 border border-zinc-200/90 hover:border-zinc-400 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="aspect-square bg-zinc-50 rounded-lg flex items-center justify-center p-3 relative">
                <img
                  src={getOptimizedImageUrl(product.photo)}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/products/bbk-vaseline-lip.jpg';
                  }}
                  className="w-full h-full object-contain filter group-hover:scale-102 transition"
                />
                <span className="absolute top-1.5 left-1.5 text-[8px] font-mono text-zinc-400 tracking-wider">
                  #{product.id.slice(-4)}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                  {product.category || 'Beauty'}
                </div>
                <h3 className="text-xs font-semibold text-zinc-900 line-clamp-1">
                  {product.name}
                </h3>
                <div className="text-xs font-mono font-bold text-zinc-900 pt-0.5">
                  KES {Number(product.price).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={(e) => onToggleBag(e, product.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-medium transition ${
                    isSelected
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {isSelected ? 'In Bag ✓' : '+ Bag'}
                </button>

                <button
                  type="button"
                  onClick={(e) => onSingleOrder(e, product)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white"
                  title="Order on WhatsApp"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 7. DEPARTMENT STORE AISLES & CAROUSELS VIEW                              */
/* ========================================================================= */
export function CategoryAislesView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onSingleOrder
}) {
  // Group products by category
  const grouped = products.reduce((acc, p) => {
    const cat = p.category || 'Beauty Care';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="space-y-2.5">
          {/* Aisle Header */}
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{category} Aisle</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-bold">
              {items.length} items
            </span>
          </div>

          {/* Horizontal Scrolling Aisle */}
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none snap-x -mx-4 px-4">
            {items.map((product) => {
              const isSelected = Boolean(cart[product.id]);
              const remaining = getProductRemaining(product);

              return (
                <article
                  key={product.id}
                  onClick={() => onViewProduct(product)}
                  className="w-44 flex-shrink-0 snap-start bg-white rounded-2xl border border-slate-200 p-2.5 flex flex-col justify-between shadow-xs hover:shadow-md transition cursor-pointer"
                >
                  <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                    <img
                      src={getOptimizedImageUrl(product.photo)}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/products/bbk-vaseline-lip.jpg';
                      }}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                      {remaining} left
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <h3 className="text-xs font-black text-slate-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-xs font-black text-emerald-700">
                      KES {Number(product.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 mt-2.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={(e) => onToggleBag(e, product.id)}
                      className={`py-1 rounded-lg text-[9px] font-black transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'In Bag' : '+ Bag'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => onSingleOrder(e, product)}
                      className="py-1 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-[9px] font-black flex items-center justify-center gap-0.5"
                    >
                      <WhatsAppIcon className="w-2.5 h-2.5 fill-white" />
                      <span>Order</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ========================================================================= */
/* 8. SWATCH & MULTI-ANGLE STUDIO VIEW                                       */
/* ========================================================================= */
export function SwatchGalleryView({
  products,
  cart,
  onToggleBag,
  onViewProduct,
  onSingleOrder
}) {
  const [activePhotoMap, setActivePhotoMap] = useState({});

  const handleSelectPhoto = (e, productId, photoUrl) => {
    e.stopPropagation();
    setActivePhotoMap((prev) => ({ ...prev, [productId]: photoUrl }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => {
          const isSelected = Boolean(cart[product.id]);
          const photos = product.photos && product.photos.length > 0 ? product.photos : [product.photo];
          const currentPhoto = activePhotoMap[product.id] || product.photo;

          return (
            <article
              key={product.id}
              onClick={() => onViewProduct(product)}
              className="bg-white rounded-2xl overflow-hidden border border-fuchsia-200/80 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              {/* Photo & Angle Swatches */}
              <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-3">
                <img
                  src={getOptimizedImageUrl(currentPhoto)}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/products/bbk-vaseline-lip.jpg';
                  }}
                  className="w-full h-full object-contain"
                />

                {/* Multi-Angle Swatch Dots */}
                {photos.length > 1 && (
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-center gap-1.5 bg-white/80 backdrop-blur-md py-1 px-2 rounded-full border border-fuchsia-200 shadow-xs">
                    {photos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleSelectPhoto(e, product.id, p)}
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${
                          currentPhoto === p
                            ? 'bg-fuchsia-600 border-white ring-2 ring-fuchsia-500 scale-110'
                            : 'bg-slate-300 border-slate-200 hover:bg-slate-400'
                        }`}
                        title={`Angle ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details & Actions */}
              <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-fuchsia-700 uppercase tracking-wider">
                    {product.category || 'Beauty Swatch'}
                  </span>
                  <h3 className="text-xs font-black text-slate-900 line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                  <div className="text-xs font-black text-slate-900 mt-1">
                    KES {Number(product.price).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={(e) => onToggleBag(e, product.id)}
                    className={`py-1.5 rounded-xl text-[10px] font-black transition ${
                      isSelected
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'In Bag' : '+ Bag'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => onSingleOrder(e, product)}
                    className="py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-black flex items-center justify-center gap-1"
                  >
                    <WhatsAppIcon className="w-3 h-3 fill-white" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* MODAL / DRAWER: CHOOSE TODAY'S STOREFRONT LAYOUT                          */
/* ========================================================================= */
export function LayoutSelectorModal({
  isOpen,
  onClose,
  currentLayout,
  onSelectLayout
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="text-emerald-600">🎨</span>
              <span>Storefront Design Layouts (10 Templates)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose how your catalogue looks today. Default remains Modern 2-Col Grid.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {CATALOG_LAYOUTS.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = currentLayout === tpl.id;

            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  onSelectLayout(tpl.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl transition flex items-center gap-3.5 group pt-3 ${
                  isSelected
                    ? 'bg-emerald-50 border-2 border-emerald-500 shadow-xs'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tpl.gradient} text-white flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      {tpl.name}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                        tpl.id === 'grid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tpl.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {tpl.tagline}
                  </p>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] font-medium text-slate-500">
          💡 The layout saves to this browser. Refreshing retains your choice.
        </div>
      </div>
    </div>
  );
}
