/**
 * Storage Service
 * Hybrid persistence layer:
 * - Backed by Supabase cloud database when credentials are configured.
 * - Gracefully falls back to browser localStorage for offline support or local development.
 * - Zero UI breaking changes.
 */
import { DEFAULT_SELLER, STARTER_PRODUCTS, BEAUTY_BAR_SELLER, CURATED_PRODUCTS, GLOW_HOUSE_SELLER, SHOE_IN_SELLER, SHOE_IN_PRODUCTS, OREWA_SELLER, OREWA_PRODUCTS } from '../data/starterData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const KEYS = {
  SELLER: 'dailypost_seller_v11',
  PRODUCTS: 'dailypost_products_v13',
  POSTS_PREFIX: 'dailypost_posts_v11_',
  POSTED_STATUS_PREFIX: 'dailypost_posted_v11_',
  OVERRIDES_PREFIX: 'dailypost_overrides_v11_'
};

// Resilient network timeout wrapper to prevent app hang
const withTimeout = (promise, ms = 3500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase request timeout')), ms))
  ]);
};

export const storageService = {
  /**
   * Check if Supabase cloud sync is active
   */
  isCloudConnected() {
    return isSupabaseConfigured;
  },

  /**
   * Fetch current seller profile
   */
  async getSeller() {
    const ownerPin = localStorage.getItem('dailypost_owner_pin') || '1234';
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('sellers')
            .select('*')
            .limit(1)
            .maybeSingle(),
          3500
        );

        if (!error && data) {
          const withPin = { ...data, pin: data.pin || ownerPin };
          localStorage.setItem(KEYS.SELLER, JSON.stringify(withPin));
          return withPin;
        }
      } catch (e) {
        console.warn('Supabase getSeller error, falling back to local storage', e);
      }
    }

    try {
      const stored = localStorage.getItem(KEYS.SELLER);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...parsed, pin: parsed.pin || ownerPin };
      }
    } catch (e) {
      console.warn('Error reading seller from localStorage', e);
    }

    // Initialize with default
    const def = { ...DEFAULT_SELLER, pin: ownerPin };
    localStorage.setItem(KEYS.SELLER, JSON.stringify(def));
    return def;
  },

  /**
   * Update seller profile (shop name, phone, brand color, language, pin)
   */
  async updateSeller(sellerUpdates) {
    if (sellerUpdates.pin) {
      localStorage.setItem('dailypost_owner_pin', String(sellerUpdates.pin));
    }
    const current = await this.getSeller();
    const updated = { ...current, ...sellerUpdates, updated_at: new Date().toISOString() };
    localStorage.setItem(KEYS.SELLER, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        // Strip pin before upserting to avoid schema mismatch if pin column is not yet added in Supabase
        const { pin, ...supabasePayload } = updated;
        const { data, error } = await supabase
          .from('sellers')
          .upsert(supabasePayload, { onConflict: 'id' })
          .select()
          .maybeSingle();

        if (!error && data) {
          return { ...data, pin: updated.pin };
        }
      } catch (e) {
        console.warn('Supabase updateSeller error', e);
      }
    }

    return updated;
  },

  /**
   * Fetch all products
   */
  async getProducts() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false }),
          4000
        );

        if (!error && Array.isArray(data)) {
          if (data.length > 0) {
            const normalized = data.map((p) => ({
              ...p,
              photos: Array.isArray(p.photos) && p.photos.length > 0 ? p.photos : (p.photo ? [p.photo] : [])
            }));
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(normalized));
            return normalized;
          }

          // If Supabase table is empty on first run, auto-seed starter products
          console.log('Seeding initial curated products to Supabase...');
          const toSeed = CURATED_PRODUCTS.map((p) => ({
            ...p,
            photos: Array.isArray(p.photos) ? p.photos : (p.photo ? [p.photo] : [])
          }));
          await supabase.from('products').insert(toSeed);
          localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(toSeed));
          return toSeed;
        }
      } catch (e) {
        console.warn('Supabase getProducts error, falling back to localStorage', e);
      }
    }

    try {
      const stored = localStorage.getItem(KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasLegacyDuplicates = parsed.some((p) => p.name && (p.name.includes('Loafer Dark-tan') || p.name.includes('Horsebit Loafer Dark-tan')));
          if (hasBenable || missingShoes || hasLegacyDuplicates) {
            localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(STARTER_PRODUCTS));
            return STARTER_PRODUCTS;
          }
          return parsed.map((p) => ({
            ...p,
            photos: Array.isArray(p.photos) && p.photos.length > 0 ? p.photos : (p.photo ? [p.photo] : [])
          }));
        }
      }
    } catch (e) {
      console.warn('Error reading products from localStorage', e);
    }

    // Seed initial products locally
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(STARTER_PRODUCTS));
    return STARTER_PRODUCTS;
  },

  /**
   * Save entire products array
   */
  async saveProducts(products) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(products, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase saveProducts error', e);
      }
    }

    return products;
  },

  /**
   * Add a new product
   */
  async addProduct(product) {
    const products = await this.getProducts();
    const seller = await this.getSeller();
    const newProduct = {
      ...product,
      id: product.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      seller_id: seller.id,
      in_stock: product.in_stock ?? true,
      featured: product.featured ?? false,
      photos: Array.isArray(product.photos) && product.photos.length > 0 
        ? product.photos 
        : (product.photo ? [product.photo] : []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updated = [newProduct, ...products];
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([newProduct])
          .select()
          .maybeSingle();

        if (!error && data) {
          return {
            ...data,
            photos: Array.isArray(data.photos) && data.photos.length > 0 ? data.photos : (data.photo ? [data.photo] : [])
          };
        }
      } catch (e) {
        console.warn('Supabase addProduct error', e);
      }
    }

    return newProduct;
  },

  /**
   * Update an existing product (e.g. price change, stock toggle)
   */
  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));
    const targetProduct = updated.find((p) => p.id === id);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .maybeSingle();

        if (!error && data) {
          return {
            ...data,
            photos: Array.isArray(data.photos) && data.photos.length > 0 ? data.photos : (data.photo ? [data.photo] : [])
          };
        }
      } catch (e) {
        console.warn('Supabase updateProduct error', e);
      }
    }

    return targetProduct;
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteProduct error', e);
      }
    }

    return true;
  },

  /**
   * Bulk add or replace products from CSV / Excel import
   * @param {Array} newProducts - Array of parsed product objects
   * @param {'append'|'replace'} mode - Whether to append to existing or replace all
   */
  async bulkAddProducts(newProducts, mode = 'append') {
    const existing = await this.getProducts();
    const seller = await this.getSeller();

    const normalizedNew = newProducts.map((p, idx) => ({
      ...p,
      id: p.id || `prod_bulk_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      seller_id: p.seller_id || seller.id,
      in_stock: p.in_stock ?? true,
      featured: p.featured ?? false,
      photos: Array.isArray(p.photos) && p.photos.length > 0 
        ? p.photos 
        : (p.photo ? [p.photo] : ['/products/bbk-cerave-cream.jpg']),
      created_at: p.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    let combined;
    if (mode === 'replace') {
      combined = normalizedNew;
    } else {
      // Append mode: merge new with existing, updating any matching IDs
      const newIdSet = new Set(normalizedNew.map((p) => p.id));
      const remainingExisting = existing.filter((p) => !newIdSet.has(p.id));
      combined = [...normalizedNew, ...remainingExisting];
    }

    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(combined));

    if (isSupabaseConfigured && supabase) {
      try {
        if (mode === 'replace') {
          // If replacing completely, clear existing products for this seller
          await supabase.from('products').delete().eq('seller_id', seller.id);
        }
        // Chunk inserts/upserts in batches of 40 to avoid request size limits
        const batchSize = 40;
        for (let i = 0; i < combined.length; i += batchSize) {
          const batch = combined.slice(i, i + batchSize);
          await supabase.from('products').upsert(batch, { onConflict: 'id' });
        }
      } catch (e) {
        console.warn('Supabase bulkAddProducts error', e);
      }
    }

    return combined;
  },

  /**
   * Restore full store backup (seller profile + products + schedule overrides)
   */
  async restoreFullBackup(backupData) {
    let restoredSeller = null;
    let restoredProducts = null;

    if (backupData.seller) {
      restoredSeller = await this.updateSeller(backupData.seller);
    }

    if (Array.isArray(backupData.products) && backupData.products.length > 0) {
      restoredProducts = await this.bulkAddProducts(backupData.products, 'replace');
    }

    const today = new Date().toISOString().split('T')[0];
    if (backupData.today_overrides) {
      localStorage.setItem(`${KEYS.OVERRIDES_PREFIX}${today}`, JSON.stringify(backupData.today_overrides));
    }

    if (backupData.posted_map) {
      localStorage.setItem(`${KEYS.POSTED_STATUS_PREFIX}${today}`, JSON.stringify(backupData.posted_map));
    }

    return {
      seller: restoredSeller || (await this.getSeller()),
      products: restoredProducts || (await this.getProducts())
    };
  },

  /**
   * Get all data for a complete store backup snapshot
   */
  async getFullBackupData(dateStr) {
    const today = dateStr || new Date().toISOString().split('T')[0];
    const [seller, products, overrides, posted] = await Promise.all([
      this.getSeller(),
      this.getProducts(),
      this.getDayOverrides(today),
      this.getPostedStatus(today)
    ]);

    return {
      seller,
      products,
      today_overrides: overrides,
      posted_map: posted
    };
  },


  /**
   * Realtime subscription for live multi-device updates
   */
  subscribeToProducts(onUpdate) {
    if (!isSupabaseConfigured || !supabase) return () => {};
    try {
      const channel = supabase
        .channel('realtime:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          onUpdate?.(payload);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Supabase subscription error', e);
      return () => {};
    }
  },

  /**
   * Get shared status map for a given day (e.g. '2026-09-24')
   */
  async getPostedStatus(dateStr) {
    try {
      const key = `${KEYS.POSTED_STATUS_PREFIX}${dateStr}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  /**
   * Toggle or set post shared status
   */
  async setPostShared(dateStr, slotId, shared = true) {
    const current = await this.getPostedStatus(dateStr);
    const updated = { ...current, [slotId]: shared };
    localStorage.setItem(`${KEYS.POSTED_STATUS_PREFIX}${dateStr}`, JSON.stringify(updated));
    return updated;
  },

  /**
   * Get custom schedule overrides for a given day (swapped products, skipped slots)
   */
  async getDayOverrides(dateStr) {
    try {
      const key = `${KEYS.OVERRIDES_PREFIX}${dateStr}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  /**
   * Save a single slot override for a given date
   */
  async saveDayOverride(dateStr, slotId, overrideData) {
    const current = await this.getDayOverrides(dateStr);
    const updated = {
      ...current,
      [slotId]: {
        ...(current[slotId] || {}),
        ...overrideData
      }
    };
    localStorage.setItem(`${KEYS.OVERRIDES_PREFIX}${dateStr}`, JSON.stringify(updated));
    return updated;
  },

  /**
   * Clear an override for a specific slot on a given date
   */
  async clearDayOverride(dateStr, slotId) {
    const current = await this.getDayOverrides(dateStr);
    delete current[slotId];
    localStorage.setItem(`${KEYS.OVERRIDES_PREFIX}${dateStr}`, JSON.stringify(current));
    return current;
  },

  /**
   * Reset all custom overrides for a day back to default rotation
   */
  async resetDayOverrides(dateStr) {
    localStorage.removeItem(`${KEYS.OVERRIDES_PREFIX}${dateStr}`);
    return {};
  },

  /**
   * Reset data to starter defaults (Beauty Bar Kenya Curated Products with Videos)
   */
  async resetToDefaults() {
    localStorage.setItem(KEYS.SELLER, JSON.stringify(BEAUTY_BAR_SELLER));
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(CURATED_PRODUCTS));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('sellers').upsert(BEAUTY_BAR_SELLER, { onConflict: 'id' });
        await supabase.from('products').upsert(CURATED_PRODUCTS, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase resetToDefaults error', e);
      }
    }

    return { seller: BEAUTY_BAR_SELLER, products: CURATED_PRODUCTS };
  },

  /**
   * Switch between seller presets (Halal Beauty Nairobi vs Glow House Kakamega)
   */
  async loadPreset(presetName) {
    if (presetName === 'orewa' || presetName === 'orewa_limited') {
      localStorage.setItem(KEYS.SELLER, JSON.stringify(OREWA_SELLER));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(OREWA_PRODUCTS));
      return { seller: OREWA_SELLER, products: OREWA_PRODUCTS };
    }
    if (presetName === 'halal') {
      return this.resetToDefaults();
    }
    if (presetName === 'shoes' || presetName === 'shoe_in') {
      localStorage.setItem(KEYS.SELLER, JSON.stringify(SHOE_IN_SELLER));
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SHOE_IN_PRODUCTS));
      return { seller: SHOE_IN_SELLER, products: SHOE_IN_PRODUCTS };
    }
    // Glow House Kakamega
    localStorage.setItem(KEYS.SELLER, JSON.stringify(GLOW_HOUSE_SELLER));
    return { seller: GLOW_HOUSE_SELLER, products: await this.getProducts() };
  }
};
