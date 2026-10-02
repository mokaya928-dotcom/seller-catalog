import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Toast from './components/Toast';
import TodayView from './components/today/TodayView';
import ProductsView from './components/products/ProductsView';
import WeekView from './components/week/WeekView';
import SettingsModal from './components/settings/SettingsModal';
import CatalogView from './components/catalog/CatalogView';
import PwaInstallBanner from './components/common/PwaInstallBanner';
import PinLockScreen from './components/auth/PinLockScreen';
import BulkUploadModal from './components/products/BulkUploadModal';
import TimeSlotScheduleModal from './components/settings/TimeSlotScheduleModal';

import { storageService } from './services/storageService';
import { scheduleService } from './services/scheduleService';
import { notificationService } from './services/notificationService';
import { DEFAULT_SELLER } from './data/starterData';
import { usePwaInstall } from './hooks/usePwaInstall';
import { parseDemoConfigFromUrl, resolveSellerConfig } from './services/configService';

export default function App() {
  const pwa = usePwaInstall();
  
  // Ephemeral 10-Second Pitch Demo Link Parser (?demo=1&shop=...&phone=...&till=...&color=...)
  const demoSellerConfig = useMemo(() => {
    return parseDemoConfigFromUrl();
  }, []);

  const [isDemoPreview, setIsDemoPreview] = useState(Boolean(demoSellerConfig));
  
  // The app is built for the store owner. Customers access via shared ?view=catalog link!
  const getInitialView = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const view = searchParams.get('view');
    if (view === 'catalog' || window.location.hash.includes('catalog')) {
      return 'catalog';
    }
    return 'seller';
  };

  const [viewMode, setViewMode] = useState(getInitialView); // 'catalog' | 'seller'
  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (demoSellerConfig) return true;
    return sessionStorage.getItem('seller_unlocked') === 'true';
  });
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [ratio, setRatio] = useState('status'); // 'status' (9:16) or 'group' (4:5)
  const [seller, setSeller] = useState(() => {
    return demoSellerConfig || DEFAULT_SELLER;
  });
  const [products, setProducts] = useState([]);
  const [postedMap, setPostedMap] = useState({});
  const [todayOverrides, setTodayOverrides] = useState({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTimeScheduleOpen, setIsTimeScheduleOpen] = useState(false);
  const [customSchedule, setCustomSchedule] = useState(() => notificationService.getSchedule());
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isInstantPosterModalOpen, setIsInstantPosterModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync custom posting schedule changes
  useEffect(() => {
    const handleScheduleChange = (e) => {
      if (e.detail) {
        setCustomSchedule(e.detail);
      }
    };
    window.addEventListener('dailypost_schedule_changed', handleScheduleChange);
    return () => window.removeEventListener('dailypost_schedule_changed', handleScheduleChange);
  }, []);

  const handleOpenCreatePoster = () => {
    setActiveTab('today');
    setIsInstantPosterModalOpen(true);
  };

  // Today's date string in YYYY-MM-DD
  const todayDateStr = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load initial data from storageService
  useEffect(() => {
    async function loadData() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const shopParam = (searchParams.get('shop') || searchParams.get('store') || searchParams.get('seller') || '').toLowerCase();

        if (shopParam === 'shoes' || shopParam === 'shoe' || shopParam === 'shoe_in' || shopParam === 'kicks') {
          const preset = await storageService.loadPreset('shoes');
          setSeller(preset.seller);
          setProducts(preset.products);
          const [loadedPosted, loadedOverrides] = await Promise.all([
            storageService.getPostedStatus(todayDateStr),
            storageService.getDayOverrides(todayDateStr)
          ]);
          setPostedMap(loadedPosted);
          setTodayOverrides(loadedOverrides || {});
        } else {
          const [loadedSeller, loadedProducts, loadedPosted, loadedOverrides] = await Promise.all([
            storageService.getSeller(),
            storageService.getProducts(),
            storageService.getPostedStatus(todayDateStr),
            storageService.getDayOverrides(todayDateStr)
          ]);
          if (!demoSellerConfig) {
            setSeller(loadedSeller);
          }
          setProducts(loadedProducts);
          setPostedMap(loadedPosted);
          setTodayOverrides(loadedOverrides || {});
        }
      } catch (err) {
        console.error('Failed to load initial data', err);
        showToast('Could not load data from storage', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [todayDateStr, showToast, demoSellerConfig]);

  const handleSaveDemoToStore = async () => {
    try {
      const toSave = { ...seller, isDemoPreview: false };
      await storageService.updateSeller(toSave);
      setIsDemoPreview(false);
      window.history.replaceState({}, '', window.location.pathname);
      showToast(`Saved "${seller.shop_name}" as your active store!`, 'success');
    } catch (e) {
      showToast('Failed to save store profile', 'error');
    }
  };

  const handleExitDemo = async () => {
    setIsDemoPreview(false);
    window.history.replaceState({}, '', window.location.pathname);
    const persisted = await storageService.getSeller();
    setSeller(persisted);
    showToast('Exited demo preview mode', 'info');
  };

  // Real-time synchronization: live updates across seller and customer phones
  useEffect(() => {
    const unsubscribe = storageService.subscribeToProducts(async () => {
      try {
        const freshProducts = await storageService.getProducts();
        setProducts(freshProducts);
      } catch (err) {
        console.warn('Realtime update refresh error', err);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Update theme color meta tag whenever brand color changes
  useEffect(() => {
    if (seller.brand_color) {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', seller.brand_color);
      }
    }
  }, [seller.brand_color]);

  // Update document title based on viewMode
  useEffect(() => {
    if (viewMode === 'catalog') {
      document.title = `${seller.shop_name || 'Glow House'} | Product Catalogue`;
    } else {
      document.title = `Daily Post | ${seller.shop_name || 'Glow House'}`;
    }
  }, [viewMode, seller.shop_name]);

  const [postLimit, setPostLimit] = useState(5);
  const [postingCategory, setPostingCategory] = useState('beauty');

  // Generate daily posts based on products, seller, today's date, aspect ratio, postLimit, postingCategory, todayOverrides, and customSchedule
  const dailyPosts = useMemo(() => {
    if (products.length === 0) return [];
    return scheduleService.generateDailyPosts(
      products,
      seller,
      todayDateStr,
      ratio,
      postLimit,
      postingCategory,
      todayOverrides,
      customSchedule
    );
  }, [products, seller, todayDateStr, ratio, postLimit, postingCategory, todayOverrides, customSchedule]);

  // Live background notification checker: alerts seller at exact scheduled time slot
  useEffect(() => {
    if (!dailyPosts || dailyPosts.length === 0) return;
    const checkDue = () => {
      notificationService.checkAndNotifyDueSlots(dailyPosts, seller, todayDateStr);
    };
    checkDue();
    const interval = setInterval(checkDue, 30000);
    return () => clearInterval(interval);
  }, [dailyPosts, seller, todayDateStr]);

  // Handle post shared status toggle
  const handleTogglePosted = async (slotId, shared) => {
    const updated = await storageService.setPostShared(todayDateStr, slotId, shared);
    setPostedMap(updated);
  };

  // Instant poster drop product (when triggered from products tab or quick-action)
  const [instantProduct, setInstantProduct] = useState(null);

  const handleGenerateImmediate = (product) => {
    setInstantProduct(product);
    setActiveTab('today');
  };

  // Product CRUD
  const handleAddProduct = async (productData) => {
    const created = await storageService.addProduct(productData);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateProduct = async (id, updates) => {
    const updated = await storageService.updateProduct(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const handleDeleteProduct = async (id) => {
    await storageService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };


  // Bulk Product Import (CSV or Excel)
  const handleBulkImport = async (newProducts, mode) => {
    const updated = await storageService.bulkAddProducts(newProducts, mode);
    setProducts(updated);
    return updated;
  };

  // Full Store Backup Restore
  const handleRestoreBackup = async (backupData) => {
    const result = await storageService.restoreFullBackup(backupData);
    setSeller(result.seller);
    setProducts(result.products);
    const todayPosted = await storageService.getPostedStatus(todayDateStr);
    const todayOver = await storageService.getDayOverrides(todayDateStr);
    setPostedMap(todayPosted);
    setTodayOverrides(todayOver || {});
    return result;
  };

  // Seller settings update
  const handleSaveSettings = async (sellerUpdates) => {
    const updated = await storageService.updateSeller(sellerUpdates);
    setSeller(updated);
    setIsSettingsOpen(false);
    showToast('✓ Brand profile saved!', 'success');
  };

  // Quick 2-Color Master Theme Palette Switcher (Emerald & Gold vs Luxury Slate & Gold)
  const handlePaletteChange = async (paletteKey) => {
    const updated = await storageService.updateSeller({ palette: paletteKey });
    setSeller(updated);
    showToast(
      paletteKey === 'slate'
        ? '✓ Switched to Option B: Luxury Slate & Gold!'
        : '✓ Switched to Option A: Unified Emerald & Gold!',
      'success'
    );
  };

  // Reset to starter defaults
  const handleResetDefaults = async () => {
    const reset = await storageService.resetToDefaults();
    setSeller(reset.seller);
    setProducts(reset.products);
    showToast('✓ Loaded Beauty Bar Kenya Curated Collection with Videos', 'success');
  };

  // Load dedicated store preset (e.g. Shoes Alone)
  const handleLoadStorePreset = async (presetKey) => {
    const loaded = await storageService.loadPreset(presetKey);
    setSeller(loaded.seller);
    setProducts(loaded.products);
    showToast(`✓ Loaded ${loaded.seller.shop_name}!`, 'success');
  };

  // Switch to customer catalogue preview
  const handleOpenCatalog = () => {
    setIsPreview(true);
    setViewMode('catalog');
    window.history.pushState(null, '', '?view=catalog');
  };

  const handleExitCatalog = () => {
    setIsPreview(false);
    setViewMode('seller');
    window.history.pushState(null, '', window.location.pathname);
  };

  const handleOpenSeller = () => {
    setIsPreview(false);
    setViewMode('seller');
    window.history.pushState(null, '', window.location.pathname);
  };

  // Lock Studio session
  const handleLock = () => {
    sessionStorage.removeItem('seller_unlocked');
    setIsUnlocked(false);
    showToast('Studio locked.', 'info');
  };

  // Browser Back/Forward navigation listener
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');
      if (view === 'catalog' || window.location.hash.includes('catalog')) {
        setViewMode('catalog');
      } else {
        setViewMode('seller');
        setIsPreview(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Count unposted items for today's badge
  const pendingCount = dailyPosts.filter((p) => !postedMap[p.slotId]).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-bold text-gray-700">Loading Daily Post...</p>
      </div>
    );
  }

  // -----------------------------------------------------------
  // PUBLIC CUSTOMER VIEW: WhatsApp Storefront & Catalogue
  // -----------------------------------------------------------
  if (viewMode === 'catalog') {
    return (
      <div className="flex flex-col min-h-screen">
        {isDemoPreview && (
          <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-3 py-2 text-xs font-bold flex items-center justify-between shadow-md sticky top-0 z-50">
            <div className="flex items-center gap-2 min-w-0">
              <span className="bg-amber-950/60 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-black flex-shrink-0">
                Demo Pitch Link
              </span>
              <span className="truncate text-[11px] sm:text-xs">
                Previewing as <strong>{seller.shop_name}</strong> (Till: {seller.mpesa_till}) • Ephemeral Preview
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <button
                type="button"
                onClick={handleSaveDemoToStore}
                className="bg-white text-amber-900 hover:bg-amber-50 px-2.5 py-1 rounded-lg text-[11px] font-black transition shadow-xs"
              >
                Save Store
              </button>
              <button
                type="button"
                onClick={handleExitDemo}
                className="text-amber-100 hover:text-white px-2 py-1 text-[11px] font-semibold"
              >
                Exit
              </button>
            </div>
          </div>
        )}
        <CatalogView
          seller={seller}
          products={products}
          isPreview={isPreview}
          onExitToSeller={handleExitCatalog}
          onOpenSeller={handleOpenSeller}
          pwa={pwa}
        />
      </div>
    );
  }

  // -----------------------------------------------------------
  // OWNER SECURITY: PIN Gate for Seller Studio
  // -----------------------------------------------------------
  if (!isUnlocked) {
    return (
      <PinLockScreen
        seller={seller}
        onUnlock={() => setIsUnlocked(true)}
        onShowToast={showToast}
      />
    );
  }

  // -----------------------------------------------------------
  // SELLER TOOL VIEW: Daily Post Generator & Inventory
  // -----------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      {isDemoPreview && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white px-3 py-2 text-xs font-bold flex items-center justify-between shadow-md sticky top-0 z-50">
          <div className="flex items-center gap-2 min-w-0">
            <span className="bg-amber-950/60 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-black flex-shrink-0">
              Demo Pitch Link
            </span>
            <span className="truncate text-[11px] sm:text-xs">
              Previewing for <strong>{seller.shop_name}</strong> (Till: {seller.mpesa_till}) • Ephemeral Preview
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            <button
              type="button"
              onClick={handleSaveDemoToStore}
              className="bg-white text-amber-900 hover:bg-amber-50 px-2.5 py-1 rounded-lg text-[11px] font-black transition shadow-xs"
            >
              Save Store
            </button>
            <button
              type="button"
              onClick={handleExitDemo}
              className="text-amber-100 hover:text-white px-2 py-1 text-[11px] font-semibold"
            >
              Exit
            </button>
          </div>
        </div>
      )}
      {/* Toast Feedback Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Branded Header */}
      <Header
        seller={seller}
        ratio={ratio}
        onRatioChange={setRatio}
        onPaletteChange={handlePaletteChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCatalog={handleOpenCatalog}
        onOpenCreatePoster={handleOpenCreatePoster}
        onLock={handleLock}
        pwa={pwa}
      />

      {/* Main Content Area (Mobile Viewport Max 448px) */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-8">
        {activeTab === 'today' && (
          <TodayView
            posts={dailyPosts}
            seller={seller}
            ratio={ratio}
            postedMap={postedMap}
            postLimit={postLimit}
            onChangePostLimit={setPostLimit}
            postingCategory={postingCategory}
            onChangeCategory={setPostingCategory}
            totalInStock={products.filter((p) => p.in_stock).length}
            allProducts={products}
            onTogglePosted={handleTogglePosted}
            onOpenCatalogPreview={handleOpenCatalog}
            onShowToast={showToast}
            onAddProduct={handleAddProduct}
            instantProduct={instantProduct}
            onClearInstantProduct={() => setInstantProduct(null)}
            isInstantPosterOpen={isInstantPosterModalOpen}
            onCloseInstantPoster={() => setIsInstantPosterModalOpen(false)}
            onOpenTimeSchedule={() => setIsTimeScheduleOpen(true)}
          />
        )}

        {activeTab === 'week' && (
          <WeekView
            products={products}
            seller={seller}
            ratio={ratio}
            todayDateStr={todayDateStr}
            postingCategory={postingCategory}
            onGoToToday={() => setActiveTab('today')}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={products}
            seller={seller}
            ratio={ratio}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onShowToast={showToast}
            onGenerateImmediate={handleGenerateImmediate}
            onOpenBulkModal={() => setIsBulkModalOpen(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingPostCount={pendingCount}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          seller={seller}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSaveSettings}
          onResetDefaults={handleResetDefaults}
          pwa={pwa}
          onOpenBulkModal={() => setIsBulkModalOpen(true)}
          onOpenTimeSchedule={() => setIsTimeScheduleOpen(true)}
          onLoadPreset={handleLoadStorePreset}
        />
      )}

      {/* Time Slot Customizer & Alarms Modal */}
      <TimeSlotScheduleModal
        isOpen={isTimeScheduleOpen}
        onClose={() => setIsTimeScheduleOpen(false)}
        seller={seller}
        onScheduleUpdated={(newSchedule) => {
          setCustomSchedule(newSchedule);
          showToast('✓ Custom posting times and alarm settings saved!', 'success');
        }}
        onShowToast={showToast}
      />

      {/* Bulk CSV / Excel Upload & Store Backup Modal */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        products={products}
        seller={seller}
        todayOverrides={todayOverrides}
        postedMap={postedMap}
        onBulkImport={handleBulkImport}
        onRestoreBackup={handleRestoreBackup}
        onShowToast={showToast}
      />

      {/* Floating PWA Install Banner (Seller Studio Mode) */}
      <PwaInstallBanner
        pwa={pwa}
        seller={seller}
        viewMode="seller"
      />
    </div>
  );
}
