import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ShoppingBag, ArrowLeft, ArrowUp, Sparkles, 
  Check, X, MapPin, Flame, Plus, Download, Truck, ArrowRight,
  LayoutGrid, List
} from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';
import CheckoutDrawer from './CheckoutDrawer';
import WhatsAppIcon from '../common/WhatsAppIcon';
import PwaInstallBanner from '../common/PwaInstallBanner';
import { shareService } from '../../services/shareService';
import { executeSmartSearch } from '../../services/smartSearch';
import { getProductRemaining, getProductRegularPrice, getProductSocialProof } from '../../services/scheduleService';
import { getOptimizedImageUrl } from '../../utils/imageUtils';

export default function CatalogView({ seller, products, onExitToSeller, onOpenSeller, isPreview = false, pwa }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under1500' | 'under3000' | 'offers'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'name_asc'
  const [layoutMode, setLayoutMode] = useState(() => {
    try {
      return localStorage.getItem('catalog_layout_mode') || 'grid';
    } catch (e) {
      return 'grid';
    }
  });

  const handleSelectLayout = (mode) => {
    setLayoutMode(mode);
    try {
      localStorage.setItem('catalog_layout_mode', mode);
    } catch (e) {}
  };

  const [cart, setCart] = useState({}); // { [productId]: quantity }
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [catalogToast, setCatalogToast] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null); // Active product in modal

  // Return to top visibility state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = (seller.phone_raw || seller.phone || '254728222211').replace(/[^0-9]/g, '');

  const isShoesStore = (seller?.id === 'seller_shoe_in_kenya') || 
                       Boolean(seller?.shop_name && seller.shop_name.toLowerCase().includes('shoe'));

  // Only show in-stock products in public catalogue, cleanly isolated per brand
  const inStockProducts = useMemo(() => {
    const pool = (products || []).filter((p) => p.in_stock !== false);
    if (isShoesStore) {
      const shoesOnly = pool.filter(p => p.seller_id === 'seller_shoe_in_kenya' || p.category === 'Sneakers & Kicks' || p.category === "Men's Footwear");
      return shoesOnly.length > 0 ? shoesOnly : pool;
    }
    if (seller?.id === 'seller_beauty_bar_kenya') {
      const beautyOnly = pool.filter(p => p.seller_id === 'seller_beauty_bar_kenya' || p.seller_id === 'seller_glow_secret');
      return beautyOnly.length > 0 ? beautyOnly : pool;
    }
    if (seller?.id === 'seller_glownd') {
      const bagsOnly = pool.filter(p => p.seller_id === 'seller_glownd');
      return bagsOnly.length > 0 ? bagsOnly : pool;
    }
    return pool;
  }, [products, seller, isShoesStore]);

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

  // Extract unique categories and calculate product count per category
  const categoryStats = useMemo(() => {
    const counts = { All: inStockProducts.length };
    inStockProducts.forEach((p) => {
      const cat = p.category || 'Beauty Care';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [inStockProducts]);

  // Priority category ordering
  const CATEGORY_ORDER = [
    'All',
    'Sneakers & Kicks',
    "Men's Footwear",
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
      case 'Sneakers & Kicks': return '👟';
      case "Men's Footwear": return '👞';
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

  // Smart Search & Semantic Filtering
  const searchResult = useMemo(() => {
    return executeSmartSearch(inStockProducts, search, {
      selectedCategory,
      priceFilter,
      sortBy
    });
  }, [inStockProducts, search, selectedCategory, priceFilter, sortBy]);

  const filteredProducts = searchResult.results;

  // Cart Calculations & Handlers
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

  // Single Item Direct Order on WhatsApp
  const handleSingleOrder = async (e, product) => {
    if (e && e.stopPropagation) e.stopPropagation();
    await shareService.orderOnWhatsApp({ product, seller });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-32 selection:bg-emerald-500 selection:text-white">
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

      {/* Clean, Premium Storefront Header */}
      <header className="shadow-xs sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none truncate">
              {seller.shop_name || 'The Beauty Bar Kenya'}
            </h1>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1 truncate mt-1">
              <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{seller.location || 'Jamia Mall, Nairobi CBD'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick Bag / Cart Button */}
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition active:scale-95 flex items-center justify-center cursor-pointer"
              title="Open Order Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center bg-emerald-600 text-white shadow-md animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Chat Action */}
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-xs flex items-center gap-2 flex-shrink-0 transition transform active:scale-95 hover:border-emerald-300"
              title="Chat with shop on WhatsApp"
            >
              <div className="w-5 h-5 rounded-md bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                <WhatsAppIcon className="w-3 h-3 fill-white flex-shrink-0" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-wider">
                  Chat
                </span>
                <span className="text-xs font-black tracking-tight mt-0.5">WhatsApp</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Reassuring Delivery & Trust Bar */}
      <div className="bg-slate-900 text-slate-200 py-2 px-4 border-b border-slate-800">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 truncate text-slate-300">
            <Truck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate font-semibold">Nairobi Same-Day Dispatch • Countrywide Delivery</span>
          </div>
          {seller.mpesa_till && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-slate-800 px-2 py-0.5 rounded-md flex-shrink-0 border border-slate-700">
              <span>Till: <strong>{seller.mpesa_till}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Main Catalog View: Modern 2-Col Grid */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        {/* Simple, Crisp Search Bar */}
        <div className="relative">
          <div className="absolute left-3.5 top-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-emerald-700" />
          </div>
          <input
            type="text"
            placeholder="Search products by brand, concern, or price..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-xs outline-none transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Visual Category Chips with Icons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-0.5">
          {categories.map((cat) => {
            const count = categoryStats[cat] || 0;
            const icon = getCategoryIcon(cat);
            const isCatSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isCatSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{icon}</span>
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isCatSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter & Layout Row */}
        <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setPriceFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                priceFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter('under1500')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                priceFilter === 'under1500'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              &lt; 1.5K
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter('under3000')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                priceFilter === 'under3000'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              1.5K–3K
            </button>
            <button
              type="button"
              onClick={() => setPriceFilter(priceFilter === 'offers' ? 'all' : 'offers')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
                priceFilter === 'offers'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <span>Offers 🔥</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 1-Tap 2-Layout Switcher: Clean Grid vs Detailed List */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleSelectLayout('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                  layoutMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="2-Column Visual Grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectLayout('list')}
                className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                  layoutMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Detailed Showcase List"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-xl font-black">
              🔍
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">
                {search ? `No products found for "${search}"` : 'No products found'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Try searching for another product name, category, or reset your filters.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setPriceFilter('all');
                }}
                className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : layoutMode === 'list' ? (
          /* ======================================================== */
          /* LAYOUT 2: CLEAN DETAILED SHOWCASE LIST                    */
          /* ======================================================== */
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isSelected = Boolean(cart[product.id]);
              const remaining = getProductRemaining(product);
              const regularPrice = getProductRegularPrice(product);
              const savings = regularPrice && regularPrice > product.price ? regularPrice - product.price : null;

              return (
                <article
                  key={product.id}
                  onClick={() => setViewingProduct(product)}
                  className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex gap-3 group active:scale-[0.99]"
                >
                  {/* Product Photo */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-2 flex items-center justify-center">
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
                    {savings ? (
                      <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                        -KES {savings.toLocaleString()}
                      </span>
                    ) : product.badge ? (
                      <span className="absolute top-1.5 left-1.5 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                        {product.badge}
                      </span>
                    ) : null}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                          {product.category || 'Beauty Care'}
                        </span>
                        {product.size && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                            {product.size}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-1 mt-0.5 group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h2>

                      {/* Display Key Benefit Line Directly! */}
                      {product.benefit_line && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-tight font-medium">
                          {product.benefit_line}
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-emerald-700">
                            KES {Number(product.price).toLocaleString()}
                          </span>
                          {regularPrice && regularPrice > product.price && (
                            <span className="text-[10px] text-slate-400 line-through font-semibold">
                              KES {Number(regularPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {remaining !== null && remaining <= 5 && (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>{remaining} left</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleSingleOrder(e, product)}
                          className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-black py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-white flex-shrink-0" />
                          <span>Order on WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleToggleBag(e, product.id)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                          title={isSelected ? 'Remove from Bag' : 'Add to Bag'}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4 stroke-[3px]" />
                          ) : (
                            <Plus className="w-4 h-4 stroke-[2.5px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* ======================================================== */
          /* LAYOUT 1: MODERN 2-COL VISUAL GRID                        */
          /* ======================================================== */
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
                >
                  {/* Product Photo */}
                  <div className="w-full aspect-square relative bg-slate-50 flex items-center justify-center p-2.5 overflow-hidden border-b border-slate-100">
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

                    {/* Badges on top-left */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
                      {savings ? (
                        <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs">
                          Save KES {savings.toLocaleString()}
                        </span>
                      ) : remaining !== null && remaining <= 5 ? (
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>{remaining} left</span>
                        </span>
                      ) : product.badge ? (
                        <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          {product.badge}
                        </span>
                      ) : null}
                    </div>

                    {/* Quick Add To Bag on top-right */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleBag(e, product.id)}
                      className={`absolute top-2 right-2 px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black transition-all shadow-xs z-10 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-white/95 backdrop-blur-xs text-slate-700 hover:bg-white hover:text-emerald-700 border border-slate-200/80'
                      }`}
                      title={isSelected ? 'In your bag' : 'Add to order bag'}
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

                  {/* Card Details */}
                  <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {product.category || 'Beauty Care'}
                      </span>
                      <h2 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5 group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h2>

                      {/* Pricing & Rating */}
                      <div className="flex items-baseline justify-between gap-1 mt-1.5 pt-1 border-t border-slate-100">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm font-black text-emerald-700">
                            KES {Number(product.price).toLocaleString()}
                          </span>
                          {regularPrice && regularPrice > product.price && (
                            <span className="text-[10px] text-slate-400 line-through font-semibold">
                              KES {Number(regularPrice).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {socialProof?.rating && (
                          <span className="text-[10px] text-slate-500 font-extrabold flex items-center gap-0.5">
                            <span className="text-amber-500">★</span>
                            <span>{socialProof.rating}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Primary 1-Tap WhatsApp CTA */}
                    <button
                      type="button"
                      onClick={(e) => handleSingleOrder(e, product)}
                      className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1caa52] text-white font-black py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 text-xs shadow-xs transition active:scale-95 cursor-pointer mt-1"
                      title="Order this product instantly on WhatsApp"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 fill-white flex-shrink-0" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Clean Public Footer */}
      <footer className="w-full mt-12 mb-8 py-8 px-4 text-center text-xs space-y-2 border-t border-slate-200 bg-white">
        <div className="max-w-md mx-auto space-y-2">
          <p className="font-bold text-sm text-slate-900">
            {seller.shop_name || 'The Beauty Bar Kenya'}
          </p>
          <p className="text-[11px] text-slate-500">
            {seller.location || 'Jamia Mall, Shop F47, Nairobi'} • Delivery Across Kenya
          </p>
          <p className="text-[10px] text-slate-400">
            Direct WhatsApp Storefront • Instant Ordering
          </p>

          {seller.mpesa_till && (
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold rounded-full text-slate-800">
                <span>Lipa na M-Pesa Till:</span>
                <span className="font-mono font-black text-emerald-700">
                  {seller.mpesa_till}
                </span>
              </span>
            </div>
          )}

          {/* PWA Install Button for Customers */}
          {pwa && !pwa.isInstalled && (
            <div className="pt-2">
              <button
                type="button"
                onClick={pwa.promptInstall}
                className="inline-flex items-center gap-1.5 text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-emerald-700 px-3.5 py-1.5 rounded-xl transition shadow-2xs active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.2px]" />
                <span>Install {seller.shop_name || 'Beauty Bar'} App</span>
              </button>
            </div>
          )}
        </div>
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 shadow-2xl safe-bottom animate-slide-up">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                <span>{totalCartCount} {totalCartCount === 1 ? 'item' : 'items'} in Bag</span>
              </div>
              <div className="text-base font-black text-emerald-800">
                Total: KES {cartSubtotal.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-[#25D366] hover:from-emerald-700 hover:to-[#20ba5a] active:scale-95 text-white font-black py-3 px-5 rounded-2xl flex items-center gap-2 text-xs shadow-md transition cursor-pointer"
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

      {/* Return to Top Floating Action Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className={`fixed ${
            totalCartCount > 0 ? 'bottom-24' : 'bottom-6'
          } right-4 z-40 p-3 rounded-full bg-slate-900/90 hover:bg-slate-950 active:scale-95 text-white shadow-xl border border-white/20 transition-all duration-300 flex items-center justify-center backdrop-blur-md cursor-pointer animate-fade-in`}
          title="Return to top"
          aria-label="Return to top"
        >
          <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}
