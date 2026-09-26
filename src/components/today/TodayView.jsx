import React, { useState, useMemo, useEffect } from 'react';
import PostCard from './PostCard';
import ShareCatalogBanner from './ShareCatalogBanner';
import ProductModal from '../products/ProductModal';
import { Sparkles, CheckCircle2, AlertCircle, Plus, Zap, RefreshCw, Flame, ShoppingBag, Tag, Layers, Download, Package, Languages, Camera, Clock } from 'lucide-react';
import { isBeautyCategory, getCategoryGroup, scheduleService } from '../../services/scheduleService';
import { shareService } from '../../services/shareService';

export default function TodayView({
  posts,
  seller,
  ratio,
  postedMap,
  postLimit = 5,
  onChangePostLimit,
  postingCategory = 'beauty',
  onChangeCategory,
  totalInStock = 0,
  allProducts = [],
  onTogglePosted,
  onOpenCatalogPreview,
  onShowToast,
  onAddProduct,
  instantProduct,
  onClearInstantProduct,
  isInstantPosterOpen,
  onCloseInstantPoster,
  onOpenTimeSchedule
}) {
  const [selectedQuickAddId, setSelectedQuickAddId] = useState('');
  const [customQueuedProducts, setCustomQueuedProducts] = useState([]);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [bulkProgressText, setBulkProgressText] = useState('');
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Sync external open request (e.g. from Header + Poster button)
  useEffect(() => {
    if (isInstantPosterOpen) {
      setIsNewProductModalOpen(true);
      if (onCloseInstantPoster) onCloseInstantPoster();
    }
  }, [isInstantPosterOpen, onCloseInstantPoster]);
  const [globalCaptionLang, setGlobalCaptionLang] = useState(
    seller?.language === 'swahili' ? 'swahili' : 'english'
  );

  // Sync if seller.language updates from settings modal
  useEffect(() => {
    if (seller?.language === 'swahili') {
      setGlobalCaptionLang('swahili');
    } else if (seller?.language === 'english' || seller?.language === 'kenyan_mix') {
      setGlobalCaptionLang('english');
    }
  }, [seller?.language]);

  const inStockProducts = useMemo(() => allProducts.filter((p) => p.in_stock), [allProducts]);

  // Compute category breakdown
  const categoryStats = useMemo(() => {
    let beauty = 0;
    let household = 0;
    let clothes = 0;
    let bags = 0;
    const catCounts = {};

    inStockProducts.forEach((p) => {
      const cat = p.category || 'Beauty Care';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
      const group = getCategoryGroup(cat);
      if (group === 'bags') bags++;
      else if (group === 'household') household++;
      else if (group === 'clothes') clothes++;
      else if (isBeautyCategory(cat)) beauty++;
    });

    return {
      all: inStockProducts.length,
      bags,
      beauty,
      household,
      clothes,
      catCounts
    };
  }, [inStockProducts]);

  // Dynamic Category Selector Tabs
  const categoryTabs = useMemo(() => {
    const tabs = [
      { id: 'bags', label: 'Handbags & Bags', icon: '👜', count: categoryStats.bags },
      { id: 'beauty', label: 'Beauty Posts', icon: '🌸', count: categoryStats.beauty },
      { id: 'household', label: 'Household & Bedding', icon: '🛏️', count: categoryStats.household },
      { id: 'clothes', label: 'Clothes & Fashion', icon: '👗', count: categoryStats.clothes },
      { id: 'Makeup & Prep', label: 'Make Up', icon: '👑', count: categoryStats.catCounts['Makeup & Prep'] || 0 },
      { id: 'Lip Care', label: 'Lip Care', icon: '💄', count: categoryStats.catCounts['Lip Care'] || 0 },
      { id: 'Bath & Body', label: 'Bath & Body', icon: '🛁', count: categoryStats.catCounts['Bath & Body'] || 0 },
      { id: 'Skincare & Face', label: 'Skincare', icon: '🧴', count: (categoryStats.catCounts['Skincare & Face'] || 0) + (categoryStats.catCounts['Skincare'] || 0) },
      { id: 'Serums & Actives', label: 'Serums', icon: '🧪', count: categoryStats.catCounts['Serums & Actives'] || 0 },
      { id: 'Sunscreen & SPF', label: 'SPF', icon: '☀️', count: categoryStats.catCounts['Sunscreen & SPF'] || 0 }
    ].filter(t => t.count > 0 || t.id === 'bags' || t.id === 'beauty' || t.id === 'household' || t.id === 'clothes');

    tabs.push({ id: 'all', label: 'All Products (Grouped)', icon: '🛍️', count: categoryStats.all });

    return tabs;
  }, [categoryStats]);

  const activeCategoryCount = useMemo(() => {
    const found = categoryTabs.find(t => t.id === postingCategory);
    return found ? found.count : categoryStats.beauty;
  }, [categoryTabs, postingCategory, categoryStats.beauty]);

  const totalPosts = posts.length + customQueuedProducts.length;
  const postedCount = posts.filter((p) => postedMap[p.slotId]).length;
  const progressPercent = totalPosts > 0 ? (postedCount / totalPosts) * 100 : 0;

  // Handler to add 5 more posts in the current category
  const handleAddMorePosts = () => {
    const current = typeof postLimit === 'number' ? postLimit : 5;
    const nextLimit = Math.min(current + 5, activeCategoryCount || 100);
    onChangePostLimit(nextLimit);
    onShowToast(`✓ Added 5 more ${postingCategory === 'beauty' ? 'Beauty' : postingCategory} posts to queue!`, 'success');
  };

  // Handler to show all in-stock products in the current category
  const handleShowAll = () => {
    onChangePostLimit('all');
    onShowToast(`✓ Generated flyers for all ${activeCategoryCount} ${postingCategory === 'beauty' ? 'Beauty' : postingCategory} items!`, 'success');
  };

  // Automatically queue instant product if passed as prop from external view (e.g. Products tab)
  useEffect(() => {
    if (instantProduct) {
      const match = typeof instantProduct === 'string'
        ? allProducts.find((p) => p.id === instantProduct)
        : instantProduct;
      if (match) {
        handleQuickAdd(match.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (onClearInstantProduct) onClearInstantProduct();
    }
  }, [instantProduct, allProducts]);

  // Handler for quick adding a specific product from inventory
  const handleQuickAdd = (productId) => {
    if (!productId) return;
    const match = allProducts.find((p) => p.id === productId);
    if (!match) return;

    // Check if already in custom queued products
    if (customQueuedProducts.some((p) => p.product.id === match.id)) {
      onShowToast(`"${match.name}" is already in your queue!`, 'info');
      setSelectedQuickAddId('');
      return;
    }

    const newSlotId = `slot_custom_${Date.now()}`;
    const newPost = {
      id: `post_custom_${match.id}_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      slotId: newSlotId,
      slotNumber: totalPosts + 1,
      time: 'Instant Drop',
      label: `Instant Post • ${match.name}`,
      slotIcon: 'Zap',
      product: match,
      companionProduct: null,
      allProducts: allProducts,
      style: 'unified_brand',
      aspectRatio: ratio,
      caption: scheduleService.generateCaption(match, seller, 'unified_brand', null, null, globalCaptionLang)
    };

    setCustomQueuedProducts((prev) => [newPost, ...prev]);
    setSelectedQuickAddId('');
    onShowToast(`✓ Added "${match.name}" flyer to today's queue!`, 'success');
  };

  // Handler to add a brand new product and immediately generate its design flyer
  const handleAddNewProductAndGenerate = async (productData) => {
    try {
      if (!onAddProduct) {
        onShowToast('Product storage not connected', 'error');
        return;
      }
      const created = await onAddProduct(productData);
      if (!created) return;

      const newSlotId = `slot_custom_${Date.now()}`;
      const newPost = {
        id: `post_custom_${created.id}_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        slotId: newSlotId,
        slotNumber: 1,
        time: 'Instant Drop',
        label: `⚡ New Arrival • ${created.name}`,
        slotIcon: 'Zap',
        product: created,
        companionProduct: null,
        allProducts: [created, ...allProducts],
        style: 'unified_brand',
        aspectRatio: ratio,
        caption: scheduleService.generateCaption(created, seller, 'unified_brand', null, null, globalCaptionLang)
      };

      setCustomQueuedProducts((prev) => [newPost, ...prev]);
      setIsNewProductModalOpen(false);

      // Scroll smoothly to top so merchant immediately sees their freshly rendered flyer
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onShowToast(`✓ "${created.name}" added & flyer generated immediately!`, 'success');
    } catch (err) {
      console.error('Error adding new product and generating design', err);
      onShowToast('Could not save product', 'error');
    }
  };

  // 1-Click Bulk Download: Packages all current flyers + captions into a single .zip
  const handleBulkDownload = async () => {
    if (isBulkDownloading || allDisplayPosts.length === 0) return;
    setIsBulkDownloading(true);
    setBulkProgressText('Packaging flyers...');

    try {
      const result = await shareService.downloadPostsZip(
        allDisplayPosts,
        seller,
        ratio,
        (current, total, productName) => {
          setBulkProgressText(`Flyer ${current}/${total}: ${productName.slice(0, 16)}...`);
        },
        globalCaptionLang
      );
      if (result.success) {
        onShowToast(`✓ Downloaded ${result.count} flyers + captions in 1 ZIP bundle!`, 'success');
      } else {
        onShowToast('Could not create ZIP file', 'error');
      }
    } catch (err) {
      console.error('Bulk download error', err);
      onShowToast('Failed to create ZIP bundle', 'error');
    } finally {
      setIsBulkDownloading(false);
      setBulkProgressText('');
    }
  };

  if (posts.length === 0 && customQueuedProducts.length === 0) {
    return (
      <div className="py-12 px-4 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">No in-stock products in this category</h2>
        <p className="text-sm text-gray-600 mb-6">
          Switch to another category above or turn on the in-stock switch in the Products tab.
        </p>
        <button
          onClick={() => onChangeCategory && onChangeCategory('beauty')}
          className="bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm"
        >
          View Beauty Posts ({categoryStats.beauty})
        </button>
      </div>
    );
  }

  const allDisplayPosts = [...customQueuedProducts, ...posts];

  return (
    <div className="space-y-4 pb-20">
      {/* 1. Prioritized Customer Storefront Link Card */}
      <ShareCatalogBanner
        seller={seller}
        onOpenPreview={onOpenCatalogPreview}
        onShowToast={onShowToast}
      />

      {/* 2. Instant Poster Studio Action Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center flex-shrink-0">
            <Camera className="w-5 h-5 stroke-[2.2px]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Create New Poster
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                Snap / Upload
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              Upload product photo or snap camera for an instant flyer
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsNewProductModalOpen(true)}
          className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 flex-shrink-0 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
          <span>+ Create Poster</span>
        </button>
      </div>

      {/* Category Selection Bar: NEVER MIX CATEGORIES! */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span>Posting Category</span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            {activeCategoryCount} items
          </span>
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categoryTabs.map((tab) => {
            const isActive = postingCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (onChangeCategory) onChangeCategory(tab.id);
                  onShowToast(`✓ Category: ${tab.label}`, 'info');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Progress & Batch Control Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Today's Post Queue
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenTimeSchedule && (
              <button
                type="button"
                onClick={onOpenTimeSchedule}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1 active:scale-95 cursor-pointer"
                title="Adjust daily posting schedule times & alarms"
              >
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Times &amp; Alarms</span>
              </button>
            )}
            <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {postedCount} of {totalPosts} Posted
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Queue Length Selector Pills */}
        <div className="pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Batch Size ({postingCategory === 'beauty' ? 'Beauty' : postingCategory}):
            </span>
            <span className="text-[11px] text-slate-500">
              {activeCategoryCount} items in category
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[5, 10, 20].map((num) => (
              <button
                key={num}
                onClick={() => {
                  onChangePostLimit(num);
                  onShowToast(`✓ Set schedule to ${num} posts.`, 'info');
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  postLimit === num
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {num} Posts
              </button>
            ))}

            <button
              onClick={handleShowAll}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                postLimit === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              All ({activeCategoryCount})
            </button>
          </div>
        </div>

        {/* Global Caption Language Switcher: Swahili vs English */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>Caption Language:</span>
          </div>

          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setGlobalCaptionLang('swahili');
                onShowToast('✓ Switched all captions to Kiswahili! 🇰🇪', 'info');
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                globalCaptionLang === 'swahili'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Set all captions to Kiswahili"
            >
              <span>🇰🇪 Kiswahili</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setGlobalCaptionLang('english');
                onShowToast('✓ Switched all captions to English!', 'info');
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                globalCaptionLang === 'english'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Set all captions to English"
            >
              <span>English</span>
            </button>
          </div>
        </div>

        {/* 1-Click Bulk Export All Flyers */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleBulkDownload}
            disabled={isBulkDownloading || allDisplayPosts.length === 0}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            title="Download all scheduled flyers and captions as a single .zip file"
          >
            {isBulkDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="truncate">{bulkProgressText || 'Packaging Flyers...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-300 stroke-[2.2px]" />
                <span>Download All {allDisplayPosts.length} Flyers (.ZIP Bundle)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 text-white font-mono">
                  1-Click
                </span>
              </>
            )}
          </button>
        </div>

        {/* Category Guard & 24hr Auto-Regeneration Explainer */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Category-Pure Posting:</strong> Posts stay strictly within your selected category so products like bedding or clothes never mix with your beauty drops.
          </span>
        </div>
      </div>

      {/* Quick Add Any Product Dropdown with Optgroups */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex items-center gap-2">
        <ShoppingBag className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <select
          value={selectedQuickAddId}
          onChange={(e) => {
            if (e.target.value === '__NEW_PRODUCT__') {
              setIsNewProductModalOpen(true);
              setSelectedQuickAddId('');
              return;
            }
            setSelectedQuickAddId(e.target.value);
            if (e.target.value) handleQuickAdd(e.target.value);
          }}
          className="flex-1 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="">+ Post any specific product right now...</option>
          <option value="__NEW_PRODUCT__" className="font-bold text-amber-900 bg-amber-50">
            ✨ + Have a new product? Generate flyer immediately...
          </option>
          {categoryStats.beauty > 0 && (
            <optgroup label="🌸 Beauty & Personal Care">
              {inStockProducts
                .filter((p) => isBeautyCategory(p.category))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — KES {Number(p.price).toLocaleString()} ({p.category})
                  </option>
                ))}
            </optgroup>
          )}
          {categoryStats.household > 0 && (
            <optgroup label="🛏️ Household & Bedding">
              {inStockProducts
                .filter((p) => getCategoryGroup(p.category) === 'household')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — KES {Number(p.price).toLocaleString()}
                  </option>
                ))}
            </optgroup>
          )}
          {categoryStats.clothes > 0 && (
            <optgroup label="👗 Clothes & Fashion">
              {inStockProducts
                .filter((p) => getCategoryGroup(p.category) === 'clothes')
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — KES {Number(p.price).toLocaleString()}
                  </option>
                ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* Post Cards Feed */}
      <div className="space-y-4">
        {allDisplayPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            seller={seller}
            ratio={ratio}
            isPosted={!!postedMap[post.slotId]}
            onTogglePosted={onTogglePosted}
            onShowToast={onShowToast}
            globalCaptionLang={globalCaptionLang}
          />
        ))}
      </div>

      {/* Bottom Load More & Expansion Buttons */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleAddMorePosts}
          className="w-full bg-white hover:bg-gray-50 text-emerald-800 border-2 border-dashed border-emerald-300 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] text-sm"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>+ Load 5 More {postingCategory === 'beauty' ? 'Beauty' : postingCategory} Posts</span>
        </button>

        {postLimit !== 'all' && (
          <button
            onClick={handleShowAll}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition text-xs border border-emerald-200"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Generate Posters for All {activeCategoryCount} {postingCategory === 'beauty' ? 'Beauty' : postingCategory} Items</span>
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* NEW PRODUCT IMMEDIATE DESIGN GENERATOR ("DOWN THERE" OPTION)  */}
      {/* ------------------------------------------------------------- */}
      <div className="mt-4 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-5 border-2 border-amber-400/40 text-white shadow-xl relative overflow-hidden space-y-3.5">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg font-black flex-shrink-0">
              <Zap className="w-6 h-6 fill-current stroke-[2.5px]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-white leading-tight">
                  Have a New Product?
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                  Instant Drop
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                Generate its flyer design immediately
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-emerald-100/85 leading-relaxed relative">
          Just unpacked a delivery or fresh arrival? Snap a photo, set price, and create a high-res WhatsApp flyer in seconds. Ready to post immediately!
        </p>

        {/* 1-Click Action Button */}
        <button
          type="button"
          onClick={() => setIsNewProductModalOpen(true)}
          className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-lg transition active:scale-[0.98] text-xs flex items-center justify-center gap-2 border border-amber-300 relative group"
        >
          <Sparkles className="w-4 h-4 fill-slate-950 group-hover:rotate-12 transition-transform" />
          <span>+ Add New Product &amp; Generate Flyer Immediately</span>
        </button>

        {/* Or Quick-Pick existing product right down there as well */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2">
          <span className="text-[10px] text-emerald-200/70 whitespace-nowrap font-medium">Or existing item:</span>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value === '__NEW_PRODUCT__') {
                setIsNewProductModalOpen(true);
              } else if (e.target.value) {
                handleQuickAdd(e.target.value);
              }
            }}
            className="flex-1 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl px-2.5 py-1.5 text-white text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="" className="text-gray-900">Select product to drop immediately...</option>
            <option value="__NEW_PRODUCT__" className="text-amber-900 font-bold bg-amber-100">
              ✨ + Add Brand New Product...
            </option>
            {inStockProducts.map((p) => (
              <option key={p.id} value={p.id} className="text-gray-900">
                {p.name} — KES {Number(p.price).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal for adding a new product with immediate flyer generation */}
      {isNewProductModalOpen && (
        <ProductModal
          isInstantGenerate={true}
          allProducts={allProducts}
          initialCategory={
            postingCategory === 'all' || postingCategory === 'beauty'
              ? 'Skincare & Face'
              : postingCategory === 'household'
              ? 'Household & Bedding'
              : postingCategory === 'clothes'
              ? 'Classic Clothes'
              : postingCategory
          }
          onClose={() => setIsNewProductModalOpen(false)}
          onSave={handleAddNewProductAndGenerate}
          onSaveAndGenerate={handleAddNewProductAndGenerate}
        />
      )}
    </div>
  );
}
