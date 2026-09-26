import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  MessageCircle, Search, ShieldCheck, CheckCircle2, ShoppingBag, 
  ArrowLeft, Phone, Share2, Sparkles, Eye, Info, ChevronRight, 
  Check, X, Filter, SlidersHorizontal, MapPin, LayoutGrid, List,
  Droplet, Sun, Flame, Play, Plus, Zap, Lock, Download,
  Clock, Truck, Store, Copy, ArrowRight
} from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import CheckoutDrawer from './CheckoutDrawer';
import LiveSocialProofTicker from './LiveSocialProofTicker';
import WhatsAppIcon from '../common/WhatsAppIcon';
import PwaInstallBanner from '../common/PwaInstallBanner';
import { shareService } from '../../services/shareService';
import { executeSmartSearch, SMART_PRESETS } from '../../services/smartSearch';
import { getProductRemaining, getProductRegularPrice, getProductSocialProof } from '../../services/scheduleService';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

export default function CatalogView({ seller, products, onExitToSeller, onOpenSeller, isPreview = false, pwa }) {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under1500' | 'under3000' | 'offers'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'name_asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (Visual-First 2-Col) | 'list' (Detailed)
  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [copiedProdId, setCopiedProdId] = useState(null);
  const [catalogToast, setCatalogToast] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null); // Active product in modal

  // Close smart suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const cleanPhone = (seller.phone_raw || seller.phone || '254728222211').replace(/[^0-9]/g, '');
  const isSlate = seller.palette === 'slate';

  const brandFontFamily = seller.brand_font === 'Cinzel'
    ? "'Cinzel', Georgia, serif"
    : seller.brand_font === 'Playfair Display'
    ? "'Playfair Display', Georgia, serif"
    : "'Plus Jakarta Sans', -apple-system, sans-serif";

  // Only show in-stock products in public catalogue
  const inStockProducts = useMemo(() => products.filter((p) => p.in_stock), [products]);

  // Deep Linking: Auto-open product modal if URL has ?prod=... or ?view=catalog&prod=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('prod');
    if (prodId && inStockProducts.length > 0) {
      const found = inStockProducts.find(p => p.id === prodId || p.id.toLowerCase() === prodId.toLowerCase());
      if (found) {
        setViewingProduct(found);
      }
    }
  }, [inStockProducts]);

  // Urgent CBD Rider Dispatch Countdown (6:00 PM cutoff)
  const [countdown, setCountdown] = useState({ hours: 3, minutes: 42, seconds: 15 });
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(18, 0, 0, 0);
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diff = Math.max(0, target - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ hours, minutes, seconds });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Extract unique categories and calculate product count per category
  const categoryStats = useMemo(() => {
    const counts = { All: inStockProducts.length };
    inStockProducts.forEach((p) => {
      const cat = p.category || 'Beauty Care';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [inStockProducts]);

  // Priority category ordering: Handbags & Bags, Make Up, Lip Care...
  const CATEGORY_ORDER = [
    'All',
    'Handbags & Bags',
    'Makeup & Prep',
    'Lip Care',
    'Bath & Body',
    'Sunscreen & SPF',
    'Skincare & Face',
    'Serums & Actives',
    'Classic Clothes',
    'Household & Bedding',
    'Household & Kitchen'
  ];

  const categories = useMemo(() => {
    const rawCats = Object.keys(categoryStats).filter((c) => c !== 'All');

    return ['All', ...rawCats].sort((a, b) => {
      const idxA = CATEGORY_ORDER.indexOf(a);
      const idxB = CATEGORY_ORDER.indexOf(b);
      const orderA = idxA === -1 ? 90 : idxA;
      const orderB = idxB === -1 ? 90 : idxB;
      return orderA - orderB;
    });
  }, [categoryStats]);

  // Category visual icons map
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'All': return '✨';
      case 'Handbags & Bags': return '👜';
      case 'Makeup & Prep': return '👑';
      case 'Lip Care': return '💄';
      case 'Bath & Body': return '🌸';
      case 'Sunscreen & SPF': return '☀️';
      case 'Skincare & Face': return '🧴';
      case 'Serums & Actives': return '🧪';
      case 'Classic Clothes': return '👗';
      case 'Household & Bedding': return '🛏️';
      case 'Household & Kitchen': return '☕';
      case 'Hair & Wellness': return '🌿';
      default: return '🛍️';
    }
  };

  // Smart Search & Multi-Token Semantic Filtering
  const searchResult = useMemo(() => {
    return executeSmartSearch(inStockProducts, search, {
      selectedCategory,
      priceFilter,
      sortBy
    });
  }, [inStockProducts, search, selectedCategory, priceFilter, sortBy]);

  const filteredProducts = searchResult.results;
  const didYouMean = searchResult.didYouMean;
  const detectedFilters = searchResult.detectedFilters;

  // Rich Cart Calculations & Handlers
  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const p = inStockProducts.find((prod) => prod.id === id);
      return p ? sum + Number(p.price) * qty : sum;
    }, 0);
  }, [cart, inStockProducts]);

  const selectedProductList = inStockProducts.filter((p) => Boolean(cart[p.id]));
  const selectedTotal = cartSubtotal;

  const handleToggleBag = (e, productId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCart((prev) => {
      if (prev[productId]) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: 1 };
    });
  };

  const handleAddToCart = (e, productId, qty = 1) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setCart((prev) => {
      const current = prev[productId] || 0;
      return { ...prev, [productId]: current + qty };
    });
    setCatalogToast('Item added to order bag! 🛍️');
    setTimeout(() => setCatalogToast(null), 2500);
  };

  const handleUpdateCartQuantity = (productId, newQty) => {
    setCart((prev) => {
      if (newQty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const handleRemoveCartItem = (productId) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Direct Product Link Share with 1-Tap Copy
  const handleShareProduct = async (e, product) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}?view=catalog&prod=${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - ${seller.shop_name || 'Store'}`,
          text: `Check out ${product.name} (KES ${Number(product.price).toLocaleString()}) at ${seller.shop_name}!`,
          url
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    await shareService.copyText(url);
    setCopiedProdId(product.id);
    setCatalogToast('Link copied! Share it directly on WhatsApp Status 🔗');
    setTimeout(() => {
      setCopiedProdId(null);
      setCatalogToast(null);
    }, 2500);
  };

  // Single Item Order on WhatsApp (Accompanied by Product Photo)
  const handleSingleOrder = async (e, product) => {
    e.stopPropagation();
    await shareService.orderOnWhatsApp({ product, seller });
  };

  // Multi-Item Order fallback
  const handleMultiOrder = async () => {
    if (selectedProductList.length === 0) return;
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 pb-32 selection:bg-emerald-500 selection:text-white">
      {/* Top Banner for Seller Exit (Only shown during Preview Mode) */}
      {isPreview && onExitToSeller && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs flex items-center justify-between font-semibold sticky top-0 z-40 border-b border-white/10 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold">Storefront Preview Mode</span>
          </div>
          <button
            onClick={onExitToSeller}
            className="flex items-center gap-1 text-emerald-300 hover:text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Seller Studio</span>
          </button>
        </div>
      )}

      {/* Sleek, Compact Luxury Branded Header */}
      <header 
        className={`text-white shadow-md relative overflow-hidden transition-all duration-300 border-b sticky top-0 z-30 ${
          isSlate 
            ? 'bg-gradient-to-r from-slate-950 via-[#0f172a] to-slate-900 border-slate-800' 
            : 'bg-gradient-to-r from-emerald-950 via-[#064e3b] to-emerald-900 border-emerald-800/80'
        }`}
      >
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 
              className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white truncate drop-shadow-sm"
              style={{ 
                fontFamily: brandFontFamily,
                letterSpacing: '0.02em'
              }}
            >
              {seller.shop_name || 'The Beauty Bar Kenya'}
            </h1>
            <p className="text-xs text-emerald-100/85 font-medium flex items-center gap-1 truncate mt-1">
              <MapPin className="w-3 h-3 text-amber-300 flex-shrink-0" />
              <span className="truncate">{seller.location || 'Jamia Mall, Nairobi CBD'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick Bag / Cart Button */}
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="relative bg-white/15 hover:bg-white/25 active:bg-white/35 text-white p-2 rounded-xl transition border border-white/20 active:scale-95 flex items-center justify-center"
              title="Open Order Bag"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Quick Install Action for Customers */}
            {pwa && !pwa.isInstalled && (
              <button
                type="button"
                onClick={pwa.promptInstall}
                className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 hover:text-white border border-amber-400/40 font-bold px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 text-xs"
                title="Install Store App for fast offline shopping"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.4px] text-amber-300" />
                <span className="hidden xs:inline text-[11px] font-black uppercase tracking-wider">Install</span>
              </button>
            )}

            {/* Direct WhatsApp Chat Action */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-950 hover:bg-emerald-50 active:bg-emerald-100 font-extrabold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 flex-shrink-0 transition transform active:scale-95 border border-emerald-100"
              title="Chat with shop on WhatsApp"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white flex-shrink-0" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-wider">Chat</span>
                <span className="text-xs font-black text-gray-950 tracking-tight mt-0.5">WhatsApp</span>
              </div>
            </a>
          </div>
        </div>
      </header>
 
      {/* Calm, Reassuring Storefront Dispatch & Guarantees Bar (Non-sticky to keep products front & center) */}
      <div className="bg-slate-900 text-slate-200 py-2 px-4 border-b border-slate-800">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 truncate text-slate-300">
            <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate font-semibold">Nairobi Same-Day Dispatch &bull; Lipa na M-Pesa</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-300 bg-slate-800/90 px-2 py-0.5 rounded-md flex-shrink-0 border border-slate-700/80">
            <Clock className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span>Order cut-off: {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m</span>
          </div>
        </div>
      </div>

      {/* Main Catalog Discovery */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        {/* Trust & Peace of Mind Pillars */}
        <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 bg-white rounded-2xl border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs">
          <div className="flex items-center justify-center gap-1 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">100% Original</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-center border-x border-slate-200">
            <Store className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
            <span className="truncate">Jamia Mall Shop</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">Countrywide Parcel</span>
          </div>
        </div>
        {/* Smart Search Bar with On-Demand Floating Suggestions */}
        <div ref={searchRef} className="relative z-30 space-y-1.5">
          <div className="relative">
            <div className="absolute left-3.5 top-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-emerald-700" />
            </div>
            <input
              type="text"
              placeholder="Search products by brand, concern, or price..."
              value={search}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl border border-gray-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-xs outline-none transition"
            />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg flex items-center gap-1 transition ${
                  isSearchOpen
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
                title="Toggle smart search shortcuts"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Smart</span>
              </button>
            </div>
          </div>

          {/* FLOATING SMART SUGGESTIONS DROPDOWN (ONLY SHOWN WHEN USER TRYS TO SEARCH) */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-3 space-y-2.5 z-40 animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-gray-700">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Smart Search Shortcuts</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-700 text-xs p-0.5"
                  title="Close suggestions"
                >
                  ✕
                </button>
              </div>

              {/* Suggestions Categories */}
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                    Skin Concerns &amp; Actives
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SMART_PRESETS.filter(p => ['vitc', 'acne', 'spf', 'retinol', 'cerave', 'lipcare'].includes(p.id)).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSearch(preset.query);
                          setIsSearchOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 active:scale-95"
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                    Budget &amp; Popular
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SMART_PRESETS.filter(p => !['vitc', 'acne', 'spf', 'retinol', 'cerave', 'lipcare'].includes(p.id)).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSearch(preset.query);
                          setIsSearchOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-900 active:scale-95"
                      >
                        <span>{preset.icon}</span>
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* "Did you mean?" Typo Correction Banner */}
          {didYouMean && didYouMean !== search.toLowerCase().trim() && (
            <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-2.5 flex items-center justify-between text-xs text-emerald-950 shadow-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-base">💡</span>
                <div>
                  <span className="font-medium text-emerald-800">Did you mean: </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch(didYouMean);
                      setIsSearchOpen(false);
                    }}
                    className="font-bold text-emerald-900 underline decoration-emerald-500 underline-offset-2 hover:text-emerald-700 transition"
                  >
                    "{didYouMean}"
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearch(didYouMean);
                  setIsSearchOpen(false);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs px-3 py-1 rounded-xl transition shadow-xs"
              >
                Search "{didYouMean}"
              </button>
            </div>
          )}

          {/* Active Detected Natural Language Filters */}
          {(detectedFilters?.maxPrice !== null || detectedFilters?.onlyOffers || detectedFilters?.onlyVideo) && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-xs font-semibold text-gray-500">Filter:</span>
              {detectedFilters.maxPrice !== null && (
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <span>Price ≤ KES {detectedFilters.maxPrice.toLocaleString()}</span>
                </span>
              )}
              {detectedFilters.onlyOffers && (
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <span>Discounts &amp; Offers</span>
                </span>
              )}
              {detectedFilters.onlyVideo && (
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                  <span>Video Demos</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Visual Category Chips with Icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const count = categoryStats[cat] || 0;
            const icon = getCategoryIcon(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{icon}</span>
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls: Price Filter + Grid/List Visual Toggle */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {/* Quick Price Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                priceFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPriceFilter('under1500')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                priceFilter === 'under1500'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              &lt; 1.5K
            </button>
            <button
              onClick={() => setPriceFilter('under3000')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                priceFilter === 'under3000'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              1.5K–3K
            </button>
            <button
              onClick={() => setPriceFilter(priceFilter === 'offers' ? 'all' : 'offers')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                priceFilter === 'offers'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Special Offers
            </button>
            <button
              onClick={() => setPriceFilter(priceFilter === 'few_left' ? 'all' : 'few_left')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1 ${
                priceFilter === 'few_left'
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span>Few Left</span>
            </button>
          </div>

          {/* Visual Mode Switcher (Grid vs List) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Visual 2-Column Grid (Recognize by bottle/packaging)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Detailed List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Recognition Counter */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 px-1">
          <span>Showing {filteredProducts.length} items</span>
          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Tap photo for zoom &amp; details</span>
          </span>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black">
              🔍
            </div>
            <div>
              <p className="text-sm font-black text-gray-800">
                {search ? `No exact products found for "${search}"` : 'No products found'}
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Try searching by skin concern (e.g. acne, glow, dry), brand (e.g. e.l.f., CeraVe), or a budget (e.g. under 1500).
              </p>
            </div>

            {/* Smart Suggested Recovery Queries */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearch('vitamin c glow')}
                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition"
              >
                🍊 Vitamin C Glow
              </button>
              <button
                type="button"
                onClick={() => setSearch('sunscreen spf')}
                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition"
              >
                ☀️ Sunscreen SPF
              </button>
              <button
                type="button"
                onClick={() => setSearch('under 1500')}
                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition"
              >
                ⚡ Under 1,500 KES
              </button>
              <button
                type="button"
                onClick={() => setSearch('lip balm therapy')}
                className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition"
              >
                💄 Lip Care
              </button>
            </div>

            <div>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setPriceFilter('all');
                }}
                className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* ======================================================== */
          /* VISUAL RECOGNITION 2-COLUMN GRID (PRIMARY DEFAULT)       */
          /* Big photos, large prices, minimal text, instant scanning */
          /* ======================================================== */
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => {
              const isSelected = Boolean(cart[product.id]);
              const remaining = getProductRemaining(product);
              const regularPrice = getProductRegularPrice(product);
              const socialProof = getProductSocialProof(product);
              const savings = regularPrice && regularPrice > product.price ? regularPrice - product.price : null;

              return (
                <article
                  key={product.id}
                  onClick={() => setViewingProduct(product)}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer relative group flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* HERO PRODUCT PHOTO */}
                  <div className="w-full aspect-square bg-slate-50 relative flex items-center justify-center p-2 overflow-hidden border-b border-slate-100">
                    <img
                      src={getOptimizedImageUrl(product.photo)}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/products/bbk-vaseline-lip.jpg';
                      }}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300 transform"
                    />

                    {/* Floating Price Tag on Image (Instant Visual Recognition) */}
                    <div className="absolute bottom-2 left-2 bg-slate-950/90 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow-xs backdrop-blur-xs flex items-center gap-1.5 flex-wrap">
                      <span>KES {Number(product.price).toLocaleString()}</span>
                      {regularPrice && regularPrice > product.price && (
                        <span className="line-through text-slate-400 text-[10px] font-medium">
                          KES {Number(regularPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Badge: Offer / Category / Savings */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                      {savings ? (
                        <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs">
                          Save KES {savings.toLocaleString()}
                        </span>
                      ) : product.video ? (
                        <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>Video</span>
                        </span>
                      ) : product.badge ? (
                        <span className="bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-2xs">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>

                    {/* Top-Right: Quick Add To Bag Toggle */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleBag(e, product.id)}
                      className={`absolute top-2 right-2 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold transition shadow-xs z-10 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/95 text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:bg-white'
                      }`}
                      title={isSelected ? "In your bag" : "Add to order bag"}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3px]" />
                          <span>In Bag</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 stroke-[2.5px]" />
                          <span>+ Bag</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Clean Visual Card Info */}
                  <div className="p-2.5 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {product.category || 'Beauty Care'}
                      </div>
                      <h2 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-slate-700 transition">
                        {product.name}
                      </h2>
                      {search && product._matchReasons && product._matchReasons.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          {product._matchReasons.map((reason, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium px-1.5 py-0.5 rounded-md">
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stock & Rating */}
                      <div className="flex items-center justify-between gap-1 pt-1.5 mt-1 border-t border-slate-100 text-[10px]">
                        <span className="font-semibold text-amber-800">
                          🔥 {remaining} left
                        </span>
                        <span className="text-slate-400 font-medium flex items-center gap-0.5">
                          <span className="text-amber-500">★</span>
                          <span>{socialProof.rating}</span>
                        </span>
                      </div>
                    </div>

                    {/* 1-Tap WhatsApp Direct Button */}
                    <button
                      type="button"
                      onClick={(e) => handleSingleOrder(e, product)}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-bold py-2.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-xs transition transform active:scale-95"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 fill-white flex-shrink-0" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ======================================================== */
          /* DETAILED LIST VIEW (FOR DEEP BROWSING & TEXT READING)   */
          /* ======================================================== */
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isSelected = Boolean(cart[product.id]);
              const remaining = getProductRemaining(product);
              const regularPrice = getProductRegularPrice(product);
              const socialProof = getProductSocialProof(product);
              const savings = regularPrice && regularPrice > product.price ? regularPrice - product.price : null;

              return (
                <article
                  key={product.id}
                  onClick={() => setViewingProduct(product)}
                  className={`bg-white rounded-3xl p-3.5 border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-gray-200 shadow-sm hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 relative flex items-center justify-center p-1 shadow-2xs">
                      <img
                        src={getOptimizedImageUrl(product.photo)}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/products/bbk-vaseline-lip.jpg';
                        }}
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      {product.size && (
                        <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 py-0.2 rounded backdrop-blur-2xs">
                          {product.size}
                        </span>
                      )}
                      {savings ? (
                        <span className="absolute top-1 left-1 bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs">
                          Save KES {savings.toLocaleString()}
                        </span>
                      ) : product.badge ? (
                        <span className="absolute top-1 left-1 bg-emerald-700 text-white text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs">
                          {product.badge}
                        </span>
                      ) : null}
                      {product.photos && new Set(product.photos).size > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-bold px-1 py-0.2 rounded backdrop-blur-2xs">
                          📷 {new Set(product.photos).size}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                            {product.category || 'Beauty Care'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-extrabold flex items-center gap-0.5">
                            <span className="text-amber-500">★</span>
                            <span>{socialProof.rating}</span>
                          </span>
                        </div>
                        <h2 className="text-xs font-black text-gray-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-emerald-700 transition">
                          {product.name}
                        </h2>
                        {search && product._matchReasons && product._matchReasons.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap mt-1">
                            {product._matchReasons.map((reason, idx) => (
                              <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                                {reason}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {product.benefit_line}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-gray-100 flex-wrap gap-1.5">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-emerald-700">
                            KES {Number(product.price).toLocaleString()}
                          </span>
                          {regularPrice && regularPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through font-bold">
                              KES {Number(regularPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                            <Flame className="w-2.5 h-2.5 text-rose-600 fill-current animate-pulse" />
                            <span>{remaining} left</span>
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleToggleBag(e, product.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black transition ${
                              isSelected
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3px]" />
                                <span>In Bag</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 stroke-[3px]" />
                                <span>+ Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingProduct(product);
                      }}
                      className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-extrabold py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-[11px] transition border border-gray-200"
                    >
                      <Eye className="w-3 h-3 text-gray-600" />
                      <span>Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShareProduct(e, product)}
                      className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800 font-extrabold py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-[11px] transition border border-gray-200"
                      title="Copy link to product"
                    >
                      {copiedProdId === product.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />
                          <span className="text-emerald-700 font-black">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3 text-gray-600" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSingleOrder(e, product)}
                      className="bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-black py-2 px-2 rounded-xl flex items-center justify-center gap-1 text-[11px] shadow-xs transition"
                    >
                      <WhatsAppIcon className="w-3 h-3 fill-white" />
                      <span>Order</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Public Footer with Discreet Merchant Entrance */}
      <footer className="max-w-md mx-auto px-4 mt-12 mb-8 text-center text-xs text-gray-500 space-y-2">
        <div className="h-px bg-gray-200 w-24 mx-auto mb-4" />
        <p className="font-bold text-gray-700">
          {seller.shop_name || 'The Beauty Bar Kenya'}
        </p>
        <p className="text-[11px] text-gray-400">
          {seller.location || 'Jamia Mall, Shop F47, Nairobi'} • Delivery Across Kenya
        </p>
        <p className="text-[10px] text-gray-400">
          Direct WhatsApp Storefront • Instant Ordering
        </p>

        {seller.mpesa_till && (
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] font-bold">
              <span>Lipa na M-Pesa Till:</span>
              <span className="font-mono font-black text-emerald-800">{seller.mpesa_till}</span>
            </span>
          </div>
        )}

        {/* PWA Install Button for Customers */}
        {pwa && !pwa.isInstalled && (
          <div className="pt-2">
            <button
              type="button"
              onClick={pwa.promptInstall}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 px-3.5 py-1.5 rounded-full transition shadow-2xs active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>Install {seller.shop_name || 'Beauty Bar'} App</span>
            </button>
          </div>
        )}
      </footer>

      {/* Floating PWA Install Banner */}
      {pwa && (
        <PwaInstallBanner
          pwa={pwa}
          seller={seller}
          viewMode="catalog"
          hasSelectedItems={selectedProductList.length > 0}
        />
      )}

      {/* Floating Order Bag Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 shadow-2xl safe-bottom animate-slide-up">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                <span>{totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in Bag</span>
              </div>
              <div className="text-base font-black text-emerald-800">
                Total: KES {cartSubtotal.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-[#25D366] hover:from-emerald-700 hover:to-[#20ba5a] active:scale-95 text-white font-black py-3 px-5 rounded-2xl flex items-center gap-2 text-xs shadow-md transition"
              style={{ minHeight: '48px' }}
            >
              <span>Review Bag &amp; Order</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-Up WhatsApp Checkout Drawer */}
      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        products={inStockProducts}
        seller={seller}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Live Social Proof Ticker (Polite & won't obstruct order bag) */}
      <LiveSocialProofTicker products={inStockProducts} hasCartItems={totalCartCount > 0} />

      {/* Quick Catalog Toast for Link Copying & Add To Bag */}
      {catalogToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-xl border border-white/20 animate-fade-in flex items-center gap-2 max-w-[90vw]">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
          <span className="truncate">{catalogToast}</span>
        </div>
      )}

      {/* Product Detail Modal */}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          seller={seller}
          onClose={() => setViewingProduct(null)}
          onAddToList={(id) => handleToggleBag(null, id)}
          isSelected={Boolean(cart[viewingProduct.id])}
        />
      )}
    </div>
  );
}
