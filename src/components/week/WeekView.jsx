import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Eye, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Download, 
  Sparkles, 
  X, 
  Search, 
  RotateCcw,
  AlertCircle,
  Package,
  Languages
} from 'lucide-react';
import { scheduleService, isBeautyCategory, getCategoryGroup } from '../../services/scheduleService';
import { storageService } from '../../services/storageService';
import { shareService } from '../../services/shareService';
import { canvasRenderer } from '../../services/canvasRenderer';
import WhatsAppIcon from '../common/WhatsAppIcon';

export default function WeekView({
  products,
  seller,
  ratio,
  todayDateStr,
  postingCategory = 'beauty',
  onGoToToday,
  onShowToast
}) {
  // 1. Generate 7 consecutive days starting from today
  const weekDays = useMemo(() => {
    return scheduleService.getWeekDates(todayDateStr);
  }, [todayDateStr]);

  const [selectedDateStr, setSelectedDateStr] = useState(todayDateStr || weekDays[0].dateStr);
  const [dayOverrides, setDayOverrides] = useState({});
  const [dayPostedMap, setDayPostedMap] = useState({});
  const [swapModalSlot, setSwapModalSlot] = useState(null); // slotId when modal open
  const [swapSearchQuery, setSwapSearchQuery] = useState('');
  const [previewPost, setPreviewPost] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [bulkProgressText, setBulkProgressText] = useState('');
  const [weekCaptionLang, setWeekCaptionLang] = useState(
    seller?.language === 'swahili' ? 'swahili' : 'english'
  );

  // Sync if seller.language changes
  useEffect(() => {
    if (seller?.language === 'swahili') {
      setWeekCaptionLang('swahili');
    } else if (seller?.language === 'english' || seller?.language === 'kenyan_mix') {
      setWeekCaptionLang('english');
    }
  }, [seller?.language]);

  // Helper to get formatted caption in current language
  const getPostCaption = (post, lang = weekCaptionLang) => {
    return scheduleService.generateCaption(
      post.product,
      seller,
      post.style || 'price_focus',
      post.companionProduct || null,
      selectedDateStr,
      lang
    );
  };

  // Load overrides & posted map whenever selected date changes
  useEffect(() => {
    let isCurrent = true;
    async function loadDayData() {
      const [overrides, posted] = await Promise.all([
        storageService.getDayOverrides(selectedDateStr),
        storageService.getPostedStatus(selectedDateStr)
      ]);
      if (isCurrent) {
        setDayOverrides(overrides || {});
        setDayPostedMap(posted || {});
      }
    }
    loadDayData();
    return () => {
      isCurrent = false;
    };
  }, [selectedDateStr]);

  // Generate posts for selected date
  const dayPosts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return scheduleService.generateDailyPosts(
      products,
      seller,
      selectedDateStr,
      ratio,
      5,
      postingCategory,
      dayOverrides
    );
  }, [products, seller, selectedDateStr, ratio, postingCategory, dayOverrides]);

  const activeDay = weekDays.find((d) => d.dateStr === selectedDateStr) || weekDays[0];

  // Toggle posted status for a slot on the selected day
  const handleTogglePosted = async (slotId, e) => {
    if (e) e.stopPropagation();
    const current = !!dayPostedMap[slotId];
    const updated = await storageService.setPostShared(selectedDateStr, slotId, !current);
    setDayPostedMap(updated);
    onShowToast(!current ? '✓ Marked as posted!' : 'Post marked as pending', 'info');
  };

  // Skip or Restore a slot
  const handleToggleSkip = async (slotId, currentlySkipped) => {
    if (currentlySkipped) {
      const updated = await storageService.saveDayOverride(selectedDateStr, slotId, { skipped: false });
      setDayOverrides(updated);
      onShowToast('✓ Slot restored to schedule!', 'success');
    } else {
      const updated = await storageService.saveDayOverride(selectedDateStr, slotId, { skipped: true });
      setDayOverrides(updated);
      onShowToast('Slot skipped for this day.', 'info');
    }
  };

  // Open product swap modal
  const handleOpenSwap = (slotId) => {
    setSwapModalSlot(slotId);
    setSwapSearchQuery('');
  };

  // Confirm product swap
  const handleSelectSwapProduct = async (product) => {
    if (!swapModalSlot) return;
    const updated = await storageService.saveDayOverride(selectedDateStr, swapModalSlot, {
      productId: product.id,
      skipped: false
    });
    setDayOverrides(updated);
    setSwapModalSlot(null);
    onShowToast(`✓ Swapped into slot: ${product.name}`, 'success');
  };

  // Reset all overrides for this day
  const handleResetDay = async () => {
    if (window.confirm('Reset this day back to default rotation?')) {
      const updated = await storageService.resetDayOverrides(selectedDateStr);
      setDayOverrides(updated);
      onShowToast('✓ Schedule reset to default rotation', 'info');
    }
  };

  // Preview flyer modal
  const handlePreviewPost = async (post) => {
    setPreviewPost(post);
    setIsPreviewLoading(true);
    try {
      const palette = post.palette || seller.palette || 'emerald';
      const dataUrl = await canvasRenderer.renderPost(
        post.product,
        seller,
        ratio,
        post.style || 'unified_brand',
        post.companionProduct || null,
        palette
      );
      setPreviewImageUrl(dataUrl);
    } catch (err) {
      console.error('Failed to render preview', err);
      onShowToast('Could not render preview', 'error');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Share post directly to WhatsApp from Week View
  const handleSharePost = async (post) => {
    try {
      const palette = post.palette || seller.palette || 'emerald';
      const dataUrl = await canvasRenderer.renderPost(
        post.product,
        seller,
        ratio,
        post.style || 'unified_brand',
        post.companionProduct || null,
        palette
      );
      const blob = canvasRenderer.dataURLToBlob(dataUrl);
      const safeName = post.product.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `${safeName}-${selectedDateStr}.png`;
      const activeCaption = getPostCaption(post, weekCaptionLang);

      const result = await shareService.sharePost({
        blob,
        caption: activeCaption,
        filename
      });

      if (result.success) {
        await storageService.setPostShared(selectedDateStr, post.slotId, true);
        const updated = await storageService.getPostedStatus(selectedDateStr);
        setDayPostedMap(updated);
        onShowToast(`✓ Flyer shared & caption copied (${weekCaptionLang === 'swahili' ? 'Kiswahili 🇰🇪' : 'English'})!`, 'success');
      }
    } catch (err) {
      console.error('Share error', err);
      onShowToast('Could not share post', 'error');
    }
  };

  // Copy caption directly from Week View
  const handleCopyPostCaption = async (post) => {
    const activeCaption = getPostCaption(post, weekCaptionLang);
    const success = await shareService.copyText(activeCaption);
    if (success) {
      onShowToast(`✓ Caption copied (${weekCaptionLang === 'swahili' ? 'Kiswahili 🇰🇪' : 'English'})!`, 'success');
    } else {
      onShowToast('Failed to copy caption', 'error');
    }
  };

  // Bulk download day flyers (.zip)
  const handleBulkDownloadDay = async () => {
    const activePosts = dayPosts.filter((p) => !p.isSkipped);
    if (activePosts.length === 0) {
      onShowToast('No active posts to export for this day', 'info');
      return;
    }

    setIsBulkDownloading(true);
    setBulkProgressText(`Preparing 0 / ${activePosts.length}...`);

    try {
      const result = await shareService.downloadPostsZip(
        activePosts,
        seller,
        ratio,
        (current, total, name) => {
          setBulkProgressText(`Rendering ${current}/${total}: ${name}`);
        },
        weekCaptionLang
      );
      if (result.success) {
        onShowToast(`✓ Downloaded ${activePosts.length} flyers for ${activeDay.dayShort}!`, 'success');
      }
    } catch (err) {
      console.error('Bulk export error', err);
      onShowToast('Failed to export posts zip', 'error');
    } finally {
      setIsBulkDownloading(false);
      setBulkProgressText('');
    }
  };

  // Filter products for swap modal
  const inStockProducts = useMemo(() => {
    return products.filter((p) => p.in_stock);
  }, [products]);

  const filteredSwapProducts = useMemo(() => {
    if (!swapSearchQuery.trim()) return inStockProducts;
    const q = swapSearchQuery.toLowerCase();
    return inStockProducts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.price && String(p.price).includes(q))
    );
  }, [inStockProducts, swapSearchQuery]);

  const hasDayOverrides = Object.keys(dayOverrides).length > 0;
  const activeCount = dayPosts.filter((p) => !p.isSkipped).length;
  const postedCount = dayPosts.filter((p) => !p.isSkipped && dayPostedMap[p.slotId]).length;

  return (
    <div className="space-y-4 pb-12">
      {/* Week Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-slate-700" />
            <span>7-Day Post Calendar</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Preview, swap products &amp; customize upcoming status flyers
          </p>
        </div>

        {activeDay.isToday ? (
          <button
            onClick={onGoToToday}
            className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl shadow-xs transition"
          >
            Today's Studio ➔
          </button>
        ) : (
          <button
            onClick={() => setSelectedDateStr(todayDateStr)}
            className="text-[11px] font-bold bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 shadow-xs transition"
          >
            Jump to Today
          </button>
        )}
      </div>

      {/* 7-Day Horizontal Date Strip */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDateStr(day.dateStr)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition relative ${
                  isSelected
                    ? 'bg-slate-950 text-white font-extrabold shadow-sm'
                    : day.isToday
                    ? 'bg-slate-100 text-slate-900 font-bold border border-slate-300'
                    : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {day.dayShort}
                </span>
                <span className="text-base font-black leading-tight">
                  {day.dayNum}
                </span>
                {day.isToday && (
                  <span className={`text-[9px] font-black uppercase tracking-tighter mt-0.5 ${
                    isSelected ? 'text-amber-400' : 'text-slate-900'
                  }`}>
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Status Bar */}
      <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {activeDay.isToday ? 'Today’s Drops' : `${activeDay.dayShort} Drops`}
          </div>
          <div className="text-sm font-extrabold text-white mt-0.5">
            {activeDay.fullDate}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
            <span>{activeCount} Active Flyers</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{postedCount} Posted</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {hasDayOverrides && (
            <button
              onClick={handleResetDay}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition text-xs flex items-center gap-1 border border-slate-700"
              title="Reset day overrides"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleBulkDownloadDay}
            disabled={isBulkDownloading || activeCount === 0}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isBulkDownloading ? 'Zipping...' : 'Day .ZIP'}</span>
          </button>
        </div>
      </div>

      {bulkProgressText && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pulse">
          <div className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span>{bulkProgressText}</span>
        </div>
      )}

      {/* Caption Language Bar in Week View */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Languages className="w-3.5 h-3.5 text-slate-500" />
          <span>Captions:</span>
        </div>

        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setWeekCaptionLang('swahili');
              onShowToast('✓ Switched week captions to Kiswahili! 🇰🇪', 'info');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              weekCaptionLang === 'swahili'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kiswahili captions"
          >
            <span>🇰🇪 Kiswahili</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setWeekCaptionLang('english');
              onShowToast('✓ Switched week captions to English!', 'info');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              weekCaptionLang === 'english'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="English captions"
          >
            <span>English</span>
          </button>
        </div>
      </div>

      {/* Posts List for Selected Day */}
      <div className="space-y-3">
        {dayPosts.map((post) => {
          const isPosted = !!dayPostedMap[post.slotId];
          const isSkipped = post.isSkipped;
          const isOverridden = post.isOverridden;

          if (isSkipped) {
            return (
              <div
                key={post.id}
                className="bg-gray-100/80 border border-dashed border-gray-300 rounded-2xl p-3 flex items-center justify-between text-gray-500"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-600">
                      {post.time} • <span className="line-through">{post.product.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">
                      Slot Skipped for this day
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSkip(post.slotId, true)}
                  className="text-xs font-bold bg-white text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition shadow-sm"
                >
                  Restore Slot
                </button>
              </div>
            );
          }

          return (
            <div
              key={post.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden p-3.5 shadow-xs ${
                isPosted
                  ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                  : isOverridden
                  ? 'border-amber-300 ring-2 ring-amber-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-slate-200">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{post.time}</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-[170px]">
                    {post.label}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {isOverridden && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      Custom Swapped
                    </span>
                  )}
                  <button
                    onClick={(e) => handleTogglePosted(post.slotId, e)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition ${
                      isPosted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3 h-3 ${isPosted ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{isPosted ? 'Posted' : 'Pending'}</span>
                  </button>
                </div>
              </div>

              {/* Product Info Row */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                  <img
                    src={post.product.photo || (post.product.photos && post.product.photos[0]) || '/products/bbk-vaseline-lip.jpg'}
                    alt={post.product.name}
                    className="w-full h-full object-contain p-1"
                  />
                  {post.product.badge && (
                    <span className="absolute top-0.5 left-0.5 bg-slate-900 text-white font-bold text-[8px] px-1 rounded">
                      {post.product.badge.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
                    {post.product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-extrabold text-slate-900">
                      KES {Number(post.product.price || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {post.product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Caption Snippet */}
              <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-[11px] text-slate-700 font-mono whitespace-pre-wrap max-h-16 overflow-y-auto leading-relaxed">
                {getPostCaption(post)}
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-5 gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handlePreviewPost(post)}
                  className="bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-1 rounded-xl text-[10px] flex flex-col items-center justify-center gap-0.5 transition shadow-2xs"
                  title="Preview Flyer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleOpenSwap(post.slotId)}
                  className="bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-1 rounded-xl text-[10px] flex flex-col items-center justify-center gap-0.5 transition shadow-2xs"
                  title="Swap product in this slot"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                  <span>Swap</span>
                </button>

                <button
                  onClick={() => handleToggleSkip(post.slotId, false)}
                  className="bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 font-bold py-2 px-1 rounded-xl text-[10px] flex flex-col items-center justify-center gap-0.5 transition"
                  title="Skip this slot"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>

                <button
                  onClick={() => handleCopyPostCaption(post)}
                  className="bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2 px-1 rounded-xl text-[10px] flex flex-col items-center justify-center gap-0.5 transition shadow-2xs"
                  title="Copy Caption"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </button>

                <button
                  onClick={() => handleSharePost(post)}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-2 px-1 rounded-xl text-[10px] flex flex-col items-center justify-center gap-0.5 shadow-xs transition"
                  title="Share to WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SWAP PRODUCT MODAL */}
      {swapModalSlot && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSwapModalSlot(null)}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Swap Product for this Slot
                </h3>
                <p className="text-xs text-gray-500">
                  Select any in-stock item to feature on {activeDay.dayShort}
                </p>
              </div>
              <button
                onClick={() => setSwapModalSlot(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 bg-gray-50 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={swapSearchQuery}
                  onChange={(e) => setSwapSearchQuery(e.target.value)}
                  placeholder="Search products by name or category..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredSwapProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs font-medium">
                  No matching in-stock products found
                </div>
              ) : (
                filteredSwapProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectSwapProduct(p)}
                    className="w-full text-left bg-white hover:bg-emerald-50/60 p-2.5 rounded-xl border border-gray-200 hover:border-emerald-300 flex items-center gap-3 transition"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={p.photo || (p.photos && p.photos[0]) || '/products/bbk-vaseline-lip.jpg'}
                        alt={p.name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] font-extrabold text-emerald-700 mt-0.5">
                        KES {Number(p.price).toLocaleString()}
                        <span className="text-gray-400 font-normal ml-2">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Select
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLYER PREVIEW MODAL */}
      {previewPost && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            setPreviewPost(null);
            setPreviewImageUrl(null);
          }}
        >
          <div 
            className="relative max-w-sm w-full max-h-[92vh] flex flex-col items-center bg-gray-900 rounded-2xl overflow-hidden p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 text-white">
              <span className="text-xs font-bold truncate pr-2">
                {previewPost.product.name} ({previewPost.time})
              </span>
              <button 
                onClick={() => {
                  setPreviewPost(null);
                  setPreviewImageUrl(null);
                }}
                className="text-white/80 hover:text-white text-xs font-bold px-2.5 py-1 bg-white/20 rounded-lg flex-shrink-0"
              >
                Close
              </button>
            </div>

            <div className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-[300px]">
              {isPreviewLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-white/70">
                  <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Generating Flyer...</span>
                </div>
              ) : previewImageUrl ? (
                <img 
                  src={previewImageUrl} 
                  alt="Status Flyer" 
                  className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl" 
                />
              ) : null}
            </div>

            {/* Caption in Preview Modal */}
            <div className="w-full pt-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Languages className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp Caption:</span>
                </span>
                <div className="inline-flex items-center p-0.5 bg-white/10 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => setWeekCaptionLang('swahili')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      weekCaptionLang === 'swahili'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    🇰🇪 Swahili
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekCaptionLang('english')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      weekCaptionLang === 'english'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-2.5 border border-white/10 text-[10px] text-gray-300 font-mono whitespace-pre-wrap max-h-16 overflow-y-auto leading-relaxed">
                {getPostCaption(previewPost)}
              </div>
            </div>

            <div className="w-full pt-3 flex gap-2">
              <button
                onClick={() => handleCopyPostCaption(previewPost)}
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold py-3 px-3 rounded-xl flex items-center justify-center gap-1 text-xs border border-white/15 transition"
                title="Copy Caption"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Copy</span>
              </button>

              <button
                onClick={() => handleSharePost(previewPost)}
                className="flex-1 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg transition"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Share to WhatsApp Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
