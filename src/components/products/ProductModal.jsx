import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Upload, Check, Zap, Sparkles, Flame, Search, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { STARTER_PRODUCTS, CURATED_PRODUCTS } from '../../data/starterData';

// Common beauty brand abbreviations & Kenyan retail search synonyms
const BRAND_SYNONYMS = {
  elf: ['e.l.f.', 'elf', 'putty primer', 'c-bright', 'power grip', 'halo glow', 'poreless'],
  'e.l.f.': ['e.l.f.', 'elf', 'putty primer', 'c-bright', 'power grip'],
  lrp: ['la roche', 'posay', 'anthelios', 'uvmune', 'effaclar', 'cicaplast'],
  'la roche': ['la roche', 'posay', 'anthelios', 'uvmune'],
  to: ['the ordinary', 'ordinary', 'niacinamide', 'hyaluronic', 'glycolic', 'salicylic'],
  ordinary: ['the ordinary', 'ordinary', 'niacinamide', 'hyaluronic'],
  cerave: ['cerave', 'sa smoothing', 'foaming cleanser', 'hydrating cleanser', 'daily moisturizing'],
  sa: ['sa smoothing', 'salicylic', 'cerave sa'],
  snail: ['cosrx', 'snail 96', 'snail mucin', 'mucin power essence', 'snail 92'],
  cosrx: ['cosrx', 'snail 96', 'salicylic daily gentle', 'low ph good morning'],
  dr: ['dr. rashel', 'dr rashel', 'vitamin c brightening', '24k gold', 'hyaluronic'],
  'dr rashel': ['dr. rashel', 'dr rashel', 'vitamin c', 'brightening'],
  'dr. rashel': ['dr. rashel', 'dr rashel'],
  vaseline: ['vaseline', 'rosy lips', 'lip therapy', 'cocoa butter', 'gluta hya'],
  vas: ['vaseline', 'rosy lips', 'lip therapy'],
  sheglam: ['sheglam', 'liquid blush', 'color bloom', 'matte blush'],
  sheg: ['sheglam', 'liquid blush'],
  maybelline: ['maybelline', 'fit me', 'sky high', 'instant age rewind', 'superstay'],
  mayb: ['maybelline', 'fit me', 'sky high'],
  garnier: ['garnier', 'micellar water', 'bright complete', 'vitamin c serum'],
  spf: ['sunscreen', 'spf 50', 'spf 40', 'sunblock', 'uvmune', 'anthelios'],
  sunscreen: ['sunscreen', 'spf 50', 'spf 40', 'sunblock', 'anthelios', 'skin1004'],
  vitc: ['vitamin c', 'c-bright', 'brightening', 'radiance', 'glow'],
  'vit c': ['vitamin c', 'c-bright', 'brightening', 'radiance', 'glow'],
  niacinamide: ['niacinamide', '10% niacinamide', 'zinc', 'blemish'],
  retinol: ['retinol', '0.2% retinol', 'anti-aging'],
  hyaluronic: ['hyaluronic', 'hyaluronic acid', 'hydration', 'marine hyaluronics'],
  salicylic: ['salicylic', 'salicylic acid', 'bha', 'acne control'],
  acne: ['salicylic', 'spot rescue', 'blemish', 'tea tree', 'cleanser'],
  glow: ['vitamin c', 'brightening', 'radiance', 'c-bright', 'squalane'],
  bedding: ['duvet', 'bedsheet', 'bedding', 'pillow', 'household'],
  duvet: ['duvet', 'bedding', 'household']
};

// 1-Tap Quick Brand Preset Chips
const QUICK_BRAND_PRESETS = [
  { label: 'e.l.f.', term: 'elf', icon: '👑' },
  { label: 'CeraVe', term: 'cerave', icon: '🧴' },
  { label: 'The Ordinary', term: 'ordinary', icon: '✨' },
  { label: 'Sunscreen SPF', term: 'spf', icon: '☀️' },
  { label: 'Snail Mucin', term: 'snail', icon: '🐌' },
  { label: 'Dr. Rashel', term: 'dr rashel', icon: '🍊' },
  { label: 'Vaseline Lip', term: 'vaseline', icon: '💄' },
  { label: 'Sheglam', term: 'sheglam', icon: '🌸' },
  { label: 'Acne & Salicylic', term: 'salicylic', icon: '🎯' }
];

export default function ProductModal({
  product,
  onClose,
  onSave,
  onSaveAndGenerate,
  initialCategory,
  isInstantGenerate = false,
  allProducts = []
}) {
  const isEditing = Boolean(product && product.id);

  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [regularPrice, setRegularPrice] = useState(product ? (product.regular_price || '') : '');
  const [remaining, setRemaining] = useState(product ? (product.remaining ?? product.stock_qty ?? 3) : 3);
  const [benefitLine, setBenefitLine] = useState(product ? product.benefit_line : '');
  
  const hasInitialRealPhoto = Boolean(
    (product?.photos && product.photos.length > 0) || 
    (product?.photo && !product.photo.includes('orange-soap'))
  );
  const [hasUserUploadedPhoto, setHasUserUploadedPhoto] = useState(hasInitialRealPhoto);

  const initialPhotos = Array.isArray(product?.photos) && product.photos.length > 0
    ? product.photos
    : (product?.photo ? [product.photo] : ['/products/orange-soap.svg']);

  const [photos, setPhotos] = useState(initialPhotos);
  const [inStock, setInStock] = useState(product ? product.in_stock : true);
  const [featured, setFeatured] = useState(product ? product.featured : false);
  const [badge, setBadge] = useState(product ? (product.badge || '') : (isInstantGenerate ? '⚡ New Arrival' : ''));
  const [category, setCategory] = useState(
    product
      ? (product.category || 'Skincare & Face')
      : (initialCategory || 'Skincare & Face')
  );
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const PRESET_CATEGORIES = useMemo(() => new Set([
    'Sneakers & Kicks', "Men's Footwear", 'Handbags & Bags',
    'Skincare & Face', 'Bath & Body', 'Lip Care', 'Makeup & Prep',
    'Serums & Actives', 'Korean Skincare & Serums', 'Sunscreen & SPF',
    'Hair & Wellness', 'Household & Bedding', 'Household & Kitchen', 'Classic Clothes'
  ]), []);

  const customExistingCategories = useMemo(() => {
    const list = new Set();
    if (product?.category && !PRESET_CATEGORIES.has(product.category)) {
      list.add(product.category);
    }
    (allProducts || []).forEach((p) => {
      if (p.category && !PRESET_CATEGORIES.has(p.category)) {
        list.add(p.category);
      }
    });
    return Array.from(list);
  }, [allProducts, product, PRESET_CATEGORIES]);

  const [isCompressing, setIsCompressing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoFilledName, setAutoFilledName] = useState('');
  const searchContainerRef = useRef(null);

  // Pool of catalog items for smart type matching
  const referenceCatalog = useMemo(() => {
    const pool = Array.isArray(allProducts) && allProducts.length > 0 ? allProducts : CURATED_PRODUCTS;
    const seen = new Set();
    const list = [];
    for (const p of pool) {
      if (p?.name && !seen.has(p.name.toLowerCase().trim())) {
        seen.add(p.name.toLowerCase().trim());
        list.push(p);
      }
    }
    return list;
  }, [allProducts]);

  // Compute smart suggestions based on name input
  const suggestions = useMemo(() => {
    const query = name.trim().toLowerCase();
    if (query.length < 2) return [];

    // Check abbreviation synonyms
    const expandedTerms = [query];
    if (BRAND_SYNONYMS[query]) {
      expandedTerms.push(...BRAND_SYNONYMS[query]);
    }
    // Also check partial word abbreviations (e.g. if query starts with or contains abbreviation)
    for (const [abbr, words] of Object.entries(BRAND_SYNONYMS)) {
      if (query.startsWith(abbr) || query.includes(abbr)) {
        expandedTerms.push(...words);
      }
    }

    const tokens = query.split(/\s+/).filter(Boolean);

    return referenceCatalog.filter((item) => {
      const itemName = (item.name || '').toLowerCase();
      const itemCat = (item.category || '').toLowerCase();
      const itemBenefit = (item.benefit_line || '').toLowerCase();

      // Direct match
      if (itemName.includes(query) || itemCat.includes(query)) return true;

      // Synonym expansion match
      for (const term of expandedTerms) {
        if (itemName.includes(term)) return true;
      }

      // Multi-token match
      if (tokens.length > 1) {
        const allTokensMatch = tokens.every(
          (tok) => itemName.includes(tok) || itemCat.includes(tok) || itemBenefit.includes(tok)
        );
        if (allTokensMatch) return true;
      }

      return false;
    }).slice(0, 6);
  }, [name, referenceCatalog]);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Apply a smart suggestion to auto-fill all fields in 1 tap
  const handleApplySmartMatch = (matched) => {
    setName(matched.name);
    setPrice(matched.price || '');
    const regPrice = matched.regular_price 
      ? matched.regular_price 
      : (matched.price ? Math.round((matched.price * 1.25) / 50) * 50 : '');
    setRegularPrice(regPrice);
    if (matched.benefit_line) setBenefitLine(matched.benefit_line);
    if (matched.category) setCategory(matched.category);
    if (matched.badge) setBadge(matched.badge);

    // If seller has NOT uploaded a custom photo, use the catalog photo
    if (!hasUserUploadedPhoto) {
      const matchedPhotos = Array.isArray(matched.photos) && matched.photos.length > 0
        ? matched.photos
        : (matched.photo ? [matched.photo] : []);
      if (matchedPhotos.length > 0) {
        setPhotos(matchedPhotos);
      }
    }

    setShowSuggestions(false);
    setAutoFilledName(matched.name);
    setTimeout(() => setAutoFilledName(''), 3500);
  };

  // Quick brand preset click
  const handleSelectPreset = (term) => {
    setName(term);
    setShowSuggestions(true);
  };

  // Compress a single image file into high-quality WebP (<100KB)
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1600; // Ultra high-definition resolution for crystal-clear 1080x1920 posts
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Preserve high visual fidelity (0.94) to eliminate compression artifacts/blurriness
          let compressed = canvas.toDataURL('image/webp', 0.94);
          if (!compressed.startsWith('data:image/webp')) {
            compressed = canvas.toDataURL('image/jpeg', 0.94);
          }
          resolve(compressed);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle multiple file uploads
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsCompressing(true);
    try {
      const compressedList = await Promise.all(files.map(compressImage));
      // If previous photos were default placeholder, replace them; otherwise append
      setPhotos((prev) => {
        const hasPlaceholder = prev.some((p) => p.includes('orange-soap.svg'));
        return hasPlaceholder ? compressedList : [...prev, ...compressedList];
      });
      setHasUserUploadedPhoto(true);
    } catch (err) {
      console.error('Failed to compress uploaded photos', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = (indexToRemove) => {
    if (photos.length <= 1) return;
    setPhotos((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const setPrimaryPhoto = (indexToPrimary) => {
    if (indexToPrimary === 0) return;
    setPhotos((prev) => {
      const selected = prev[indexToPrimary];
      const others = prev.filter((_, i) => i !== indexToPrimary);
      return [selected, ...others];
    });
  };

  const buildProductData = () => {
    if (!name.trim() || !price || !benefitLine.trim()) return null;
    return {
      ...(product || {}),
      name: name.trim(),
      price: Number(price),
      regular_price: regularPrice ? Number(regularPrice) : null,
      remaining: remaining !== '' ? Number(remaining) : 3,
      stock_qty: remaining !== '' ? Number(remaining) : 3,
      benefit_line: benefitLine.trim(),
      category: isCustomCategory && customCategoryInput.trim() ? customCategoryInput.trim() : (category || 'Skincare & Face'),
      photo: photos[0],
      photos: photos,
      in_stock: inStock,
      featured,
      badge: badge
    };
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const data = buildProductData();
    if (!data) return;
    onSave(data);
  };

  const handleSaveAndGenerate = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const data = buildProductData();
    if (!data) return;
    if (onSaveAndGenerate) {
      onSaveAndGenerate(data);
    } else {
      onSave(data, { generateImmediately: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/90">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-gray-900">
                {isInstantGenerate ? '⚡ Instant Flyer Generator' : isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              {isInstantGenerate && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                  Instant Drop
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {isInstantGenerate
                ? 'Upload a photo, type name/abbreviation to auto-fill, and get your flyer!'
                : 'Manage product details, pricing, and photo gallery'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Smart Type Brand Quick Pick Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Smart Type Quick Pick</span>
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Tap to auto-fill</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {QUICK_BRAND_PRESETS.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => handleSelectPreset(b.term)}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 text-gray-700 whitespace-nowrap transition border border-gray-200/80 active:scale-95 shadow-2xs"
                >
                  <span className="mr-1">{b.icon}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Name with Smart Autocomplete */}
          <div ref={searchContainerRef} className="relative space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Name *
              </label>
              {autoFilledName ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Auto-filled!</span>
                </span>
              ) : (
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Type abbr: elf, cerave, vit c, snail...
                </span>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setName(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="e.g. elf, cerave, vit c, snail mucin, sunscreen..."
                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-sm outline-none bg-white pr-9"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                <Wand2 className="w-4 h-4" />
              </div>
            </div>

            {/* Smart Suggestions Floating Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto animate-fade-in divide-y divide-gray-100">
                <div className="bg-emerald-50/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center justify-between">
                  <span>💡 Smart Matches (Tap to Auto-fill):</span>
                  <span className="text-emerald-700 font-mono font-bold">{suggestions.length} found</span>
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id || item.name}
                    type="button"
                    onClick={() => handleApplySmartMatch(item)}
                    className="w-full p-2.5 flex items-center gap-3 hover:bg-emerald-50/50 transition text-left cursor-pointer group"
                  >
                    <img
                      src={item.photo || (Array.isArray(item.photos) && item.photos[0]) || '/products/orange-soap.svg'}
                      alt=""
                      className="w-10 h-10 rounded-xl object-contain bg-gray-50 border border-gray-200 flex-shrink-0 p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-gray-900 truncate group-hover:text-emerald-800">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-black text-emerald-700">
                          KES {Number(item.price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-500 px-1.5 py-0.2 rounded bg-gray-100 font-medium">
                          {item.category || 'Skincare'}
                        </span>
                      </div>
                      {item.benefit_line && (
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {item.benefit_line}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price & Scarcity Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Selling Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Selling Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">KES</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1200"
                  className="w-full pl-12 pr-2.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 font-bold text-sm outline-none"
                />
              </div>
            </div>

            {/* Original / Strikethrough Price */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider truncate">
                  Original Price
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">Discount</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">KES</span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)}
                  placeholder="1600"
                  className="w-full pl-12 pr-2.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 font-bold text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Units Remaining (Scarcity & Urgency trigger) */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-rose-600 fill-current" />
                <span>Units Remaining (Urgency)</span>
              </label>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md border border-rose-200">
                Shows "Only X left!"
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="99"
                value={remaining}
                onChange={(e) => setRemaining(e.target.value)}
                placeholder="3"
                className="w-16 px-2 py-2 rounded-xl border border-amber-300 bg-white font-black text-sm text-center focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
                {[1, 2, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRemaining(num)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition border whitespace-nowrap ${
                      Number(remaining) === num
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                        : 'bg-white text-gray-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {num <= 2 ? `🔥 ${num} left` : `${num} left`}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-amber-900/80 font-medium">
              Scarcity drives WhatsApp buyers to order immediately before stock runs out.
            </p>
          </div>

          {/* Benefit Line with 1-Tap Quick Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                One Key Benefit *
              </label>
              <span className="text-[10px] text-gray-400 font-medium">Highlighted on flyer</span>
            </div>
            <input
              type="text"
              required
              value={benefitLine}
              onChange={(e) => setBenefitLine(e.target.value)}
              placeholder="e.g. 100% Genuine • Deep hydration & radiant glow"
              className="w-full px-3.5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-sm outline-none"
            />
            {/* Quick 1-Click Suggestions */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">Quick fill:</span>
              {[
                '✨ Radiant glow & dark spot fading',
                '☀️ Invisible SPF 50 shield • Zero white cast',
                '💧 Deep 24hr moisture • Plump, dewy skin',
                '👑 Flawless makeup grip • Blurs visible pores',
                '🎯 Fades active acne & blemish control',
                '🌿 Barrier repair • Calms redness & irritation'
              ].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setBenefitLine(sug)}
                  className="text-[10px] font-semibold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-600 px-2 py-0.5 rounded-lg whitespace-nowrap transition border border-gray-200"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Product Category Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Category *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomCategory(!isCustomCategory);
                  if (!isCustomCategory) setCustomCategoryInput('');
                }}
                className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                {isCustomCategory ? '← Choose from list' : '+ Type custom category'}
              </button>
            </div>

            {isCustomCategory ? (
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  value={customCategoryInput}
                  onChange={(e) => {
                    setCustomCategoryInput(e.target.value);
                    setCategory(e.target.value);
                  }}
                  placeholder="e.g. Sneakers & Kicks, Perfumes, Watches..."
                  className="w-full px-3.5 py-3 rounded-xl border border-emerald-500 focus:ring-2 focus:ring-emerald-500 font-semibold text-sm outline-none bg-emerald-50/30"
                  autoFocus
                />
                <p className="text-[10px] text-gray-400">
                  New category will automatically appear as an inventory filter chip.
                </p>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomCategory(true);
                    setCustomCategoryInput('');
                  } else {
                    setCategory(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-sm outline-none bg-white cursor-pointer"
              >
                <optgroup label="👟 Footwear & Sneakers">
                  <option value="Sneakers & Kicks">👟 Sneakers &amp; Kicks</option>
                  <option value="Men's Footwear">👞 Men's Footwear &amp; Loafers</option>
                </optgroup>
                <optgroup label="👜 Handbags & Luxury Bags">
                  <option value="Handbags & Bags">👜 Handbags &amp; Bags</option>
                </optgroup>
                <optgroup label="🌸 Category 1: Beauty & Personal Care">
                  <option value="Skincare & Face">🧴 Skincare &amp; Face</option>
                  <option value="Bath & Body">🛁 Bath &amp; Body</option>
                  <option value="Lip Care">💄 Lip Care</option>
                  <option value="Makeup & Prep">👑 Makeup &amp; Prep</option>
                  <option value="Serums & Actives">🧪 Serums &amp; Actives</option>
                  <option value="Korean Skincare & Serums">✨ Korean Skincare &amp; Serums</option>
                  <option value="Sunscreen & SPF">☀️ Sunscreen &amp; SPF</option>
                  <option value="Hair & Wellness">🌿 Hair &amp; Wellness</option>
                </optgroup>
                <optgroup label="🛏️ Category 2: Household & Bedding">
                  <option value="Household & Bedding">🛏️ Household &amp; Bedding</option>
                  <option value="Household & Kitchen">☕ Household &amp; Kitchen</option>
                </optgroup>
                <optgroup label="👗 Category 3: Clothes & Fashion">
                  <option value="Classic Clothes">👗 Classic Clothes &amp; Fashion</option>
                </optgroup>

                {customExistingCategories.length > 0 && (
                  <optgroup label="🏷️ Other Store Categories">
                    {customExistingCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                )}

                <option value="__custom__">➕ + Add New Custom Category...</option>
              </select>
            )}
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              ✓ Prevents category mixing: posts are routed to this category's dedicated queue.
            </p>
          </div>

          {/* Multi-Photo Picker & Reference Gallery */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Product Photos &amp; Angles ({photos.length})
              </label>
              <span className="text-[10px] text-gray-500 font-medium">1st photo is Main Hero</span>
            </div>

            {/* Photo List Display */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {photos.map((p, idx) => (
                <div 
                  key={idx} 
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden bg-gray-50 p-1 flex flex-col items-center justify-center group shadow-2xs ${
                    idx === 0 ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-gray-300'
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-contain" />
                  
                  {/* Primary indicator badge */}
                  <span className={`absolute top-1 left-1 text-[8px] font-black px-1 rounded-sm text-white ${
                    idx === 0 ? 'bg-emerald-600' : 'bg-black/60'
                  }`}>
                    {idx === 0 ? 'MAIN' : `#${idx + 1}`}
                  </span>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 p-1">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => setPrimaryPhoto(idx)}
                        className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm hover:bg-emerald-700"
                        title="Set as Main Photo"
                      >
                        Make Main
                      </button>
                    )}
                    {photos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm hover:bg-red-700"
                        title="Remove Photo"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Upload Additional Photos Button */}
              <label className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-emerald-50/40 transition p-1 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <Upload className="w-5 h-5 text-emerald-600 mb-0.5" />
                <span className="text-[10px] font-bold text-gray-700 leading-tight">
                  {isCompressing ? 'Adding...' : '+ Add Photo'}
                </span>
              </label>
            </div>
            <p className="text-[11px] text-gray-500">
              Snap with your phone camera or select image files. Auto-compressed in high-definition for fast WhatsApp sharing.
            </p>
          </div>

          {/* Promotional Badge (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Flyer Badge Tag (Optional)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. ⚡ New Arrival, 🔥 Bestseller, 🇰🇪 Kenya Favorite"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-semibold text-xs outline-none"
            />
          </div>

          {/* Stock & Feature Toggles */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-200">
            <div>
              <span className="text-xs font-bold text-gray-900 block">In-Stock Status</span>
              <span className="text-[10px] text-gray-500">Enable to show in daily rotations</span>
            </div>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            {/* Primary Instant Drop Action */}
            <button
              type="button"
              onClick={handleSaveAndGenerate}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg transition active:scale-[0.99] text-xs flex items-center justify-center gap-2 border border-amber-300"
              style={{ minHeight: '48px' }}
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Save &amp; Generate Design Flyer Immediately</span>
            </button>

            {/* Standard Catalog Save Button */}
            {!isInstantGenerate && (
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition active:scale-[0.99] text-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3px]" />
                <span>Save to Catalog (Standard)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
