/**
 * Schedule Service
 * - Dynamic post batch generator: post 5, 10, 20, or all available products on demand
 * - Dynamic 24-hour non-repetitive caption engine: auto-regenerates fresh angles every 24 hours per product
 * - Minimal, natural Kenyan commercial English with authentic local touches (Lipa na M-Pesa, Same-Day Dispatch)
 */
import { TIME_SLOTS } from '../data/starterData.js';
import { POST_STYLES } from './canvasRenderer.js';
import { getHarmoniousPaletteForProduct } from './configService.js';

function getDateSeed(dateStr) {
  const str = dateStr || new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getProductDayHash(dateStr, productId) {
  const str = `${dateStr || new Date().toISOString().split('T')[0]}__${productId || 'prod'}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Check if a product category belongs to Beauty & Personal Care
 */
export function isBeautyCategory(category) {
  return getCategoryGroup(category) === 'beauty';
}

/**
 * Get the macro group for any product category: 'shoes' | 'bags' | 'beauty' | 'household' | 'clothes'
 */
export function getCategoryGroup(category) {
  if (!category) return 'beauty';
  const lower = category.toLowerCase().trim();
  if (
    lower.includes('shoe') ||
    lower.includes('loafer') ||
    lower.includes('footwear') ||
    lower.includes('sneaker') ||
    lower.includes('boot') ||
    lower.includes('kicks') ||
    lower.includes('slide') ||
    lower.includes('sandal')
  ) {
    return 'shoes';
  }
  if (
    lower.includes('bag') ||
    lower.includes('handbag') ||
    lower.includes('tote') ||
    lower.includes('crossbody') ||
    lower.includes('clutch') ||
    lower.includes('baguette') ||
    lower.includes('purse')
  ) {
    return 'bags';
  }
  if (
    lower.includes('household') ||
    lower.includes('bedding') ||
    lower.includes('kitchen') ||
    lower.includes('curtain') ||
    lower.includes('carpet') ||
    lower.includes('duvet') ||
    lower.includes('sheet') ||
    lower.includes('pillow') ||
    lower.includes('home')
  ) {
    return 'household';
  }
  if (
    lower.includes('cloth') ||
    lower.includes('fashion') ||
    lower.includes('dress') ||
    lower.includes('wear') ||
    lower.includes('jacket') ||
    lower.includes('hoodie') ||
    lower.includes('polo') ||
    lower.includes('shirt') ||
    lower.includes('trouser') ||
    lower.includes('jean') ||
    lower.includes('apparel') ||
    lower.includes('outfit')
  ) {
    return 'clothes';
  }
  return 'beauty';
}

/**
 * Get remaining stock count for urgency & FOMO
 */
export function getProductRemaining(product) {
  if (!product) return 3;
  if (typeof product.remaining === 'number' && product.remaining >= 0) {
    return product.remaining;
  }
  if (typeof product.stock_qty === 'number' && product.stock_qty >= 0) {
    return product.stock_qty;
  }
  // Deterministic realistic scarcity count (2 to 5 pieces remaining)
  const hash = (product.id || product.name || '')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 4) + 2; // Returns 2, 3, 4, or 5
}

/**
 * Get regular price for strikethrough savings
 */
export function getProductRegularPrice(product) {
  if (!product) return null;
  if (product.regular_price && Number(product.regular_price) > Number(product.price)) {
    return Number(product.regular_price);
  }
  // If promo/featured/sale, show realistic anchor price
  if (product.badge?.includes('sale') || product.badge?.includes('flash') || product.badge?.includes('offer') || product.featured) {
    const raw = Math.round((Number(product.price) * 1.25) / 50) * 50;
    return raw > Number(product.price) ? raw : null;
  }
  return null;
}

/**
 * Get customer rating & reviews social proof
 */
export function getProductSocialProof(product) {
  if (!product) return { rating: '4.9', orders: 28 };
  const hash = (product.id || product.name || '')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rating = (4.8 + ((hash % 3) * 0.1)).toFixed(1);
  const orders = (hash % 35) + 16;
  return { rating, orders };
}

export const scheduleService = {
  /**
   * Find companion product for routine combos / 2-in-1 bundles
   * Stays strictly within the same category/domain so beauty is never mixed with household
   */
  getCompanionProduct(product, productsList) {
    if (!product || !productsList || productsList.length === 0) return null;

    const prodGroup = getCategoryGroup(product.category);

    if (product.companion_id) {
      const match = productsList.find((p) => p.id === product.companion_id);
      if (match && match.id !== product.id && match.in_stock) {
        if (getCategoryGroup(match.category) === prodGroup) {
          return match;
        }
      }
    }

    // First try exact category
    const sameCat = productsList.filter(
      (p) => p.id !== product.id && p.in_stock && (p.category === product.category)
    );
    if (sameCat.length > 0) return sameCat[0];

    // Fall back strictly within the same category group (never mix household with beauty!)
    const sameGroup = productsList.filter(
      (p) => p.id !== product.id && p.in_stock && (getCategoryGroup(p.category) === prodGroup)
    );
    return sameGroup.length > 0 ? sameGroup[0] : null;
  },

  /**
   * Generate daily posts for a given date with category filtering so categories are NEVER mixed!
   * @param {Array} products All products list
   * @param {Object} seller Seller profile
   * @param {String} dateStr YYYY-MM-DD date string
   * @param {String} ratio 'status' or 'group'
   * @param {Number|String} count 5, 10, 20, or 'all'
   * @param {Object} overrides Map of slotId to override data ({ productId, skipped, style })
   */
  generateDailyPosts(products, seller, dateStr, ratio = 'status', count = 5, categoryFilter = 'beauty', overrides = {}, customSchedule = null) {
    let availableProducts = products.filter((p) => p.in_stock);
    if (availableProducts.length === 0) {
      return [];
    }

    // -----------------------------------------------------------
    // CATEGORY FILTERING: NEVER MIX CATEGORIES TOGETHER!
    // -----------------------------------------------------------
    if (categoryFilter === 'shoes') {
      availableProducts = availableProducts.filter((p) => getCategoryGroup(p.category) === 'shoes');
    } else if (categoryFilter === 'bags') {
      availableProducts = availableProducts.filter((p) => getCategoryGroup(p.category) === 'bags');
    } else if (categoryFilter === 'beauty') {
      availableProducts = availableProducts.filter((p) => isBeautyCategory(p.category));
    } else if (categoryFilter === 'household') {
      availableProducts = availableProducts.filter((p) => getCategoryGroup(p.category) === 'household');
    } else if (categoryFilter === 'clothes') {
      availableProducts = availableProducts.filter((p) => getCategoryGroup(p.category) === 'clothes');
    } else if (categoryFilter && categoryFilter !== 'all') {
      availableProducts = availableProducts.filter((p) => p.category === categoryFilter || getCategoryGroup(p.category) === categoryFilter);
    } else if (categoryFilter === 'all') {
      // Group by category so they are structured cleanly
      availableProducts = [...availableProducts].sort((a, b) => {
        const groupA = getCategoryGroup(a.category);
        const groupB = getCategoryGroup(b.category);
        if (groupA !== groupB) return groupA.localeCompare(groupB);
        return (a.category || '').localeCompare(b.category || '');
      });
    }

    if (availableProducts.length === 0) {
      return [];
    }

    const storeProducts = availableProducts;
    const daySeed = getDateSeed(dateStr);
    let rotatedPool = [];

    const featuredStore = storeProducts.filter((p) => p.featured);
    const regularStore = storeProducts.filter((p) => !p.featured);
    const storePool = [...featuredStore, ...regularStore];
    const offset = storePool.length > 0 ? (daySeed % storePool.length) : 0;
    rotatedPool = [
      ...storePool.slice(offset),
      ...storePool.slice(0, offset)
    ];

    // Determine target post count
    let targetCount = count === 'all' ? rotatedPool.length : Number(count) || 5;
    if (targetCount < 1) targetCount = 5;

    // Array of available style IDs
    const styleIds = POST_STYLES.map((s) => s.id);

    // Extended time slot templates for sellers who post 10, 20, or all items
    const extraTimeLabels = [
      { time: '10:15 AM', label: 'Mid-Morning Office Browse', icon: 'Sun' },
      { time: '01:45 PM', label: 'Post-Lunch Restock Drop', icon: 'Clock' },
      { time: '04:15 PM', label: 'Teatime Payday Special', icon: 'Sparkles' },
      { time: '07:15 PM', label: 'Evening Transit & Matatu Scroll', icon: 'Sunset' },
      { time: '09:30 PM', label: 'Late-Night Browsing & Next-Day Orders', icon: 'Moon' },
      { time: '10:45 PM', label: 'Midnight Restock Alert', icon: 'Moon' },
      { time: '11:30 AM', label: 'Flash Midday Discovery', icon: 'Sparkles' },
      { time: '02:00 PM', label: 'Afternoon Beauty Essentials', icon: 'Sun' },
      { time: '05:00 PM', label: 'Rush Hour Must-Have', icon: 'Sunset' },
      { time: '08:15 PM', label: 'Prime Time Status Feature', icon: 'Sparkles' },
    ];

    const posts = [];
    for (let index = 0; index < targetCount; index++) {
      let product = rotatedPool[index % rotatedPool.length];
      
      // Determine slot metadata (uses owner's custom times & enabled slots)
      const activeSchedule = Array.isArray(customSchedule) && customSchedule.length > 0
        ? customSchedule.filter((s) => s.enabled !== false)
        : TIME_SLOTS;

      let slot;
      if (index < activeSchedule.length) {
        slot = activeSchedule[index];
      } else {
        const extraIdx = (index - activeSchedule.length) % extraTimeLabels.length;
        const extra = extraTimeLabels[extraIdx];
        slot = {
          id: `slot_drop_${index + 1}`,
          time: extra.time,
          label: `Drop #${index + 1} • ${extra.label}`,
          icon: extra.icon
        };
      }

      // Check for slot-specific overrides (swapped product, skipped, style override)
      const slotOverride = overrides[slot.id] || {};
      const isSkipped = !!slotOverride.skipped;

      if (slotOverride.productId) {
        const customProduct = products.find((p) => p.id === slotOverride.productId);
        if (customProduct) {
          product = customProduct;
        }
      }

      // Locked architecture: Every post defaults to 'unified_brand'
      // Color theme is harmonized automatically to the product's dominant category
      const harmoniousPal = getHarmoniousPaletteForProduct(product);
      const assignedPalette = slotOverride.palette || harmoniousPal;

      let assignedStyle = slotOverride.style;
      if (!assignedStyle) {
        const rawBadge = String(product.badge || product.promo_tag || '').toLowerCase();
        if (rawBadge.includes('flash') || product.flash_sale) {
          assignedStyle = 'flash_sale';
        } else if (rawBadge.includes('restock') || product.restocked) {
          assignedStyle = 'restock_alerts';
        } else if (rawBadge.includes('bundle')) {
          assignedStyle = 'product_bundles';
        } else if (rawBadge.includes('review') || rawBadge.includes('top seller')) {
          assignedStyle = 'customer_reviews';
        } else {
          assignedStyle = 'unified_brand';
        }
      }
      const companion = this.getCompanionProduct(product, availableProducts);

      const postId = `post_${dateStr}_${slot.id}_${product.id}`;

      posts.push({
        id: postId,
        date: dateStr,
        slotId: slot.id,
        slotNumber: index + 1,
        time: slot.time,
        label: slot.label,
        slotIcon: slot.icon,
        product: product,
        companionProduct: companion,
        allProducts: availableProducts,
        style: assignedStyle,
        palette: assignedPalette,
        aspectRatio: ratio,
        isSkipped,
        isOverridden: !!(slotOverride.productId || slotOverride.style || slotOverride.palette),
        caption: this.generateCaption(product, seller, assignedStyle, companion, dateStr, 'english'),
        captionSwahili: this.generateCaption(product, seller, assignedStyle, companion, dateStr, 'swahili')
      });
    }

    return posts;
  },

  /**
   * Generate 7 consecutive days starting from startDateStr
   */
  getWeekDates(startDateStr) {
    const start = startDateStr ? new Date(startDateStr) : new Date();
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      days.push({
        dateStr,
        dayShort: dayNames[d.getDay()],
        dayNum: d.getDate(),
        monthShort: monthNames[d.getMonth()],
        fullDate: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }),
        isToday: i === 0,
        offset: i
      });
    }
    return days;
  },

  /**
   * Dynamic 24-Hour Non-Repetitive Caption Generator
   * - Automatically rotates across 5 distinct commercial angles every 24 hours per product
   * - Ensures recurring products posted on different days never use repetitive captions
   * - Supports Swahili (Kiswahili) and English commercial copywriting for East African sellers
   */
  generateCaption(product, seller, style = 'price_focus', companionProduct = null, dateStr = null, language = null) {
    if (typeof dateStr === 'string' && (dateStr === 'swahili' || dateStr === 'english' || dateStr === 'kiswahili')) {
      language = dateStr;
      dateStr = null;
    }
    const resolvedLang = (language || (seller && seller.language) || 'english').toLowerCase();
    const isSwahili = resolvedLang === 'swahili' || resolvedLang === 'kiswahili' || resolvedLang === 'sw';
    if (isSwahili) {
      return this.generateSwahiliCaption(product, seller, style, companionProduct, dateStr);
    }
    return this.generateEnglishCaption(product, seller, style, companionProduct, dateStr);
  },

  /**
   * Authentic Kenyan Seller Commercial Swahili Engine
   * Direct, engaging, non-robotic local commercial Swahili as used by real Kenyan merchants
   * on WhatsApp Status, Instagram, and TikTok biashara posts.
   */
  generateSwahiliCaption(product, seller, style = 'price_focus', companionProduct = null, dateStr = null) {
    const formattedPrice = `KES ${Number(product.price).toLocaleString()}`;
    const shop = seller.shop_name || 'Beauty Bar Kenya';
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD';
    const sizeStr = product.size ? ` (${product.size})` : '';

    // Deterministic 24-hour product seed
    const dayHash = getProductDayHash(dateStr, product.id);
    const hookAngle = (dayHash + style.length) % 5;
    const ctaVariant = (dayHash >> 2) % 4;

    // Authentic Kenyan WhatsApp Status Biashara CTAs
    const ctaOptions = [
      `📍 Dukani: *${shop}* (${location})\n📲 WhatsApp / Piga: *${phone}*\n🛵 Nairobi tunatuma na boda siku hiyo hiyo • Parcels mikoani kila siku.\n⚡ Lipa na M-Pesa. Piga screenshot utume kwa WhatsApp kuweka oda!`,
      `📍 *${shop}* • Mzigo Safi & Original 100%\n📲 WhatsApp Moja kwa Moja: *${phone}*\n💬 Tuma screenshot kuthibitisha oda yako haraka. Delivery ya haraka sana!`,
      `🏪 *${shop}* • Tunatuma Mzigo Kote Kenya\n📲 Agiza kwa WhatsApp: *${phone}*\n🟢 Lipa na M-Pesa rahisi na salama. Tunakupakia mzigo mara moja!`,
      `📍 *${shop}* (Pick-up dukani & Boda / Parcel)\n📲 Ulizia au Weka Oda: *${phone}*\n⚡ Lipa na M-Pesa Buy Goods. Tuma picha ya hii post kwa WhatsApp tukuhudumie!`
    ];
    const ctaText = ctaOptions[ctaVariant];

    // ------------------------------------
    // STYLE: 2-IN-1 ROUTINE DUO / BUNDLE OFFER
    // ------------------------------------
    if (style === 'product_bundles' || style === 'bundle_offer') {
      const companion = companionProduct || {
        name: 'Companion Glow Item',
        price: Math.round(product.price * 0.85),
        benefit_line: 'Inakamilisha seti yako vizuri'
      };
      const regularTotal = Number(product.price) + Number(companion.price);
      const savings = Math.max(300, Math.round((regularTotal * 0.12) / 100) * 100);
      const bundlePrice = regularTotal - savings;

      const comboHooks = [
        '🔥 *COMBO DEAL YA NGUVU: CHUKUA ZOTE MBILI KWA PAMOJA!* 🔥',
        '*SETI YA LEO: NUNUA ZOTE MBILI NA U-SAVE PESA!*',
        '💡 *KAMILISHA ROUTINE YAKO NA HII COMBO YA LEO!* 💡'
      ];
      const chosenHook = comboHooks[dayHash % comboHooks.length];

      return `${chosenHook}\n\n` +
        `1️⃣ *${product.name}*${sizeStr} — KES ${Number(product.price).toLocaleString()}\n` +
        `2️⃣ *${companion.name}* — KES ${Number(companion.price).toLocaleString()}\n\n` +
        `💰 Bei ya kawaida ukichukua moja moja: ~KES ${regularTotal.toLocaleString()}~\n` +
        `⚡ *Chukua Seti Nzima Leo: KES ${bundlePrice.toLocaleString()} tu!* (Una-save KES ${savings.toLocaleString()} mzima!)\n\n` +
        `📍 Inapatikana: *${shop}*\n` +
        `📲 *Jinsi ya Kupata Hii Deal:*\n` +
        `WhatsApp / Piga Simu: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Tunatuma Nairobi na boda siku hiyo hiyo & parcels mikoani!`;
    }

    // ------------------------------------
    // STYLE: FLASH SALE / PRICE DROP
    // ------------------------------------
    if (style === 'flash_sale' || style === 'price_drop') {
      const originalPrice = Math.round((Number(product.price) * 1.3) / 50) * 50;
      const savings = originalPrice - Number(product.price);

      const dropHooks = [
        '🔥 *BEI IMESHUKA LEO! FLASH SALE YA KUWAHI!* 🔥',
        '⚡ *OFFER YA LEO PEKEE — SHUKA BEI!* ⚡',
        '🏷️ *PRICE DROP YA UKWELI: USIPITWE NA HII!* 🏷️'
      ];
      const chosenDropHook = dropHooks[dayHash % dropHooks.length];

      return `${chosenDropHook}\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `❌ Ilikuwa: ~KES ${originalPrice.toLocaleString()}~\n` +
        `🔥 *Sasa chukua na: ${formattedPrice} tu!* (Umeokoa KES ${savings.toLocaleString()} mfukoni!)\n\n` +
        `✔ Original 100%, mzigo safi uliothibitishwa.\n` +
        `✔ ${product.benefit_line || 'Matokeo safi na ngozi inabaki natural.'}\n` +
        `📍 *${shop}* (${location})\n\n` +
        `⏳ *Vipande ni vichache sana kwa hii bei ya offer!*\n` +
        `📲 WhatsApp / Piga: *${phone}*\n` +
        `🟢 Lipa na M-Pesa. Tuma screenshot sasa hivi kujiwekea yako!`;
    }

    // ------------------------------------
    // STYLE: CUSTOMER REVIEWS / SOCIAL PROOF
    // ------------------------------------
    if (style === 'customer_reviews' || style === 'review_spotlight') {
      const reviewHooks = [
        '*WATEJA WANASEMA NINI KUHUSU HII? (CUSTOMER REVIEW)*',
        '👑 *FEEDBACK YA UKWELI: VERIFIED BUYER FAVORITE!* 👑',
        '💬 *USHUHUDA WA MTEJA ALIYETUMIA HII BIDHAA!* 💬'
      ];
      const chosenReviewHook = reviewHooks[dayHash % reviewHooks.length];

      const reviewQuote = (product.category || '').toLowerCase().includes('clothes')
        ? '“Material yake ni safi sana na inakaa vizuri mwilini. Delivery ilikuwa ya haraka sana!” — Stacy M., Kilimani'
        : ((product.category || '').toLowerCase().includes('household')
            ? '“Nilipokea mzigo wangu mzuri sana kama ulivyo kwenye picha. Kazi safi kabisa!” — Mary W., Westlands'
            : '“Hii serum ilinisaidia kuondoa madoa ndani ya wiki mbili tu! 100% original kabisa.” — Stacy M., Kilimani');

      return `${chosenReviewHook}\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice}*\n` +
        `Rating: *4.9 / 5.0 (Wateja 120+ Wameridhika Kabisa)*\n\n` +
        `🗣️ *Maoni ya Mteja:*\n` +
        `${reviewQuote} (Verified Order ✓)\n\n` +
        `✔ 100% Original, mzigo uliothibitishwa.\n` +
        `✔ ${product.benefit_line || 'Matokeo safi na ngozi inabaki natural bila madhara.'}\n` +
        `📍 *${shop}* (${location})\n\n` +
        `${ctaText}`;
    }

    // ------------------------------------
    // STYLE: BACK IN STOCK / RESTOCKED / RESTOCK ALERTS
    // ------------------------------------
    if (style === 'restock_alerts' || style === 'back_in_stock' || style === 'restocked') {
      const stockHooks = [
        '🚨 *MZIGO USHARUDI DUKANI TENA LEO!* 🚨',
        '📦 *FRESH RESTOCK NDIO HII IMETUA SASA HIVI!* 📦',
        '⚡ *ILIKUWA IMEISHA, SASA IPO DUKANI TENA!* ⚡'
      ];
      const chosenStockHook = stockHooks[dayHash % stockHooks.length];

      return `${chosenStockHook}\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice} tu!*\n` +
        `✔ ${product.benefit_line || 'Original 100%, kazi safi bila chemicals kali.'}\n` +
        `✔ Mzigo mpya kabisa, sealed direct kutoka store.\n\n` +
        `⚠️ *Unajua vile hii inatoka haraka — wahi mapema kabla haijaisha tena!*\n` +
        `📍 Inapatikana: *${shop}*\n\n` +
        `📲 *Agiza Haraka:*\n` +
        `WhatsApp / Piga Simu: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Delivery ya haraka na boda Nairobi & parcels mikoani!`;
    }

    // ------------------------------------
    // STYLE: LIMITED STOCK / URGENCY
    // ------------------------------------
    if (style === 'limited_stock') {
      return `⚠️ *STOCK NI CHACHE SANA — ZIMEBAKI CHACHE!* ⚠️\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice} tu!*\n` +
        `✔ ${product.benefit_line || 'Original 100%, matokeo ya uhakika.'}\n\n` +
        `🔥 *Zimebaki pieces chache sana kwa shelf, wa kwanza kuagiza ndiye anayepata!*\n` +
        `📍 Inapatikana: *${shop}*\n\n` +
        `📲 *Kuagiza Sasa:*\n` +
        `WhatsApp / Piga: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Tunakutumia popote ulipo Kenya haraka sana!`;
    }

    // ------------------------------------
    // STYLE: LUXURY VOGUE EDITORIAL
    // ------------------------------------
    if (style === 'luxury_editorial' || style === 'editorial' || style === 'vogue') {
      return `✨ *THE SIGNATURE EDIT — HADHI YA JUU & ORIGINAL 100%* ✨\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Special Price: *${formattedPrice}*\n` +
        `✦ ${product.benefit_line || 'Formulation safi ya kiwango cha juu, matokeo ya kuvutia.'} ✦\n\n` +
        `👑 *Kwa wateja wanaopenda vitu original vyenye hadhi na muonekano nadhifu.*\n` +
        `📍 Inapatikana: *${shop}* (${location})\n\n` +
        `📲 *VIP Concierge Ordering:*\n` +
        `WhatsApp / Piga: *${phone}*\n` +
        `🟢 Lipa na M-Pesa. Dispatched siku hiyo hiyo kwa Boda / Parcel!`;
    }

    // ------------------------------------
    // STYLE: NEON STREETWEAR DROP
    // ------------------------------------
    if (style === 'neon_bold' || style === 'streetwear' || style === 'neon') {
      return `⚡ *HIGH DEMAND STREET DROP — FRESH RELEASE LEO!* ⚡\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice} tu!*\n` +
        `✔ ${product.benefit_line || '100% Genuine product, high demand item!'}\n` +
        `🔥 *Fast moving item — mzigo unashuka kwa kasi sana leo!*\n\n` +
        `📍 Dukani: *${shop}* (${location})\n\n` +
        `📲 *Gusa WhatsApp Kujipatia Yako Sasa Hivi:*\n` +
        `WhatsApp / Piga: *${phone}*\n` +
        `⚡ Boda express delivery ndani ya Nairobi & parcels kote nchini!`;
    }

    // ------------------------------------
    // STYLE: STUDIO MINIMALIST
    // ------------------------------------
    if (style === 'minimalist_clean' || style === 'minimal' || style === 'studio_clean') {
      return `🌿 *STUDIO COLLECTION — CLEAN & PURE QUALITY* 🌿\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice}*\n` +
        `✔ ${product.benefit_line || 'Formulation safi na salama kabisa kwa matumizi ya kila siku.'}\n` +
        `✔ Sealed & 100% certified authentic.\n\n` +
        `📍 Inapatikana: *${shop}* (${location})\n\n` +
        `📲 *Kuagiza Direct Kupitia WhatsApp:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Tunakutumia popote ulipo Kenya bila kuchelewa!`;
    }

    // ------------------------------------
    // STYLE: POLAROID INSTANT SNAP
    // ------------------------------------
    if (style === 'polaroid_snap' || style === 'polaroid' || style === 'retro_snap') {
      return `📸 *TODAY'S FAVORITE PICK — CHAGUO MAALUM LA LEO!* 📸\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice} tu!*\n` +
        `✔ ${product.benefit_line || 'Matokeo safi sana, wateja wengi wanaipenda sana hii.'}\n` +
        `🤍 *Kila mtu anayeichukua anarudi kushukuru — usipitwe nayo leo!*\n\n` +
        `📍 *${shop}* (${location})\n\n` +
        `📲 *Piga screenshot ya picha hii uitume kwa WhatsApp kuweka oda:*\n` +
        `WhatsApp / Piga: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Delivery ya haraka na ya uhakika!`;
    }

    // ------------------------------------
    // STYLE: CLEARANCE STARBURST DEAL
    // ------------------------------------
    if (style === 'clearance_deal' || style === 'hot_deal' || style === 'supermarket') {
      const orig = Math.round((Number(product.price) * 1.35) / 50) * 50;
      const sav = orig - Number(product.price);
      return `🔥 *CRAZY CLEARANCE DEAL — BEI YA OFA YA KUTUPA LEO!* 🔥\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `❌ Bei ya kawaida: ~KES ${orig.toLocaleString()}~\n` +
        `💥 *Sasa chukua na: ${formattedPrice} tu!* (Una-save KES ${sav.toLocaleString()} papo hapo!)\n\n` +
        `✔ Original 100% • Bidhaa safi kabisa.\n` +
        `⚠️ *Hii bei ni ya leo pekee kabla stock haijaisha — wahi haraka!*\n\n` +
        `📍 *${shop}* (${location})\n\n` +
        `📲 *Wahi Oda Yako Sasa Hivi:*\n` +
        `WhatsApp / Piga: *${phone}*\n` +
        `🟢 Lipa na M-Pesa Buy Goods • Delivery popote Kenya!`;
    }

    // ------------------------------------
    // CATEGORY 2: HOUSEHOLD & BEDDING SPECIALIZED HOOKS
    // ------------------------------------
    if (getCategoryGroup(product.category) === 'household') {
      const homeHooks = [
        `🛏️ *MASHUKA & HOUSEHOLD KALI SANA!* 🛏️\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Bei ya Leo: *${formattedPrice}*\n\n` +
          `✔ Pendezesha chumba chako kikae smart na executive sana.\n` +
          `✔ ${product.benefit_line || 'Kitambaa kizito, hazichuji rangi wala kupauka na ni rahisi kufua.'}\n` +
          `✔ Mzigo mzuri sana unaovutia na laini sana ukiugusa.\n\n` +
          `${ctaText}`,
        `🔥 *MZIGO MPYA WA NYUMBANI — HOT SELLER WIKI HII!* 🔥\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Bei: *${formattedPrice}*\n\n` +
          `📦 Quality ya hali ya juu kama hadhi ya hoteli chumbani kwako!\n` +
          `💎 *Maelezo:* ${product.benefit_line || 'Material nzito ya kudumu, haikunjamani ovyo.'}\n` +
          `⚡ Wateja wanainyakua kwa kasi — chukua yako mapema!\n\n` +
          `${ctaText}`,
        `🏡 *INUA MUONEKANO WA NYUMBA YAKO LEO* 🏡\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Bei Maalum: *${formattedPrice}*\n\n` +
          `✔ ${product.benefit_line || 'Material laini sana na nakshi za kisasa zinazovutia.'}\n` +
          `🚀 Same-day delivery na boda mjini & parcels za uhakika mikoani kote Kenya.\n` +
          `🟢 Lipa salama kupitia Lipa na M-Pesa.\n\n` +
          `${ctaText}`
      ];
      return homeHooks[dayHash % homeHooks.length];
    }

    // ------------------------------------
    // CATEGORY 3: CLOTHES & FASHION SPECIALIZED HOOKS
    // ------------------------------------
    if (getCategoryGroup(product.category) === 'clothes') {
      const clothesHooks = [
        `👗 *MZIGO WA NGUO MPYA KALI SANA!* 👗\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Bei: *${formattedPrice} tu!*\n\n` +
          `✔ Pendeza na uvutie kila unakopita bila stress!\n` +
          `✔ ${product.benefit_line || 'Material nzuri sana, inakaa vizuri mwilini na haileti joto.'}\n` +
          `✔ Inafaa sana ofisini, kanisani, matembezi na sherehe.\n` +
          `⚡ Pieces ni chache zilizopo dukani leo.\n\n` +
          `${ctaText}`,
        `👑 *OUTFIT KALI YA LEO — PENDEZA KIHALISI* 👑\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Bei: *${formattedPrice}*\n\n` +
          `💎 Muonekano nadhifu unaovutia na material ya heshima.\n` +
          `✔ ${product.benefit_line || 'Material ya kudumu isiyoharibika kirahisi ikifuliwa.'}\n\n` +
          `${ctaText}`
      ];
      return clothesHooks[dayHash % clothesHooks.length];
    }

    // ANGLE 0: Authenticity (Hapa Hatuuzi Fake!)
    if (hookAngle === 0) {
      return `*ORIGINAL 100% — HAPA HATUUZI FAKE!*\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice} tu!*\n\n` +
        `✔ 100% original, mzigo safi unakuja ukiwa sealed direct.\n` +
        `✔ ${product.benefit_line || 'Matokeo mazuri na ya ukweli ukitumia kila siku.'}\n` +
        `✔ Haina kemikali kali wala madhara — safe kabisa kwa ngozi yako.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 1: Fresh Batch / High Demand Urgency
    if (hookAngle === 1) {
      return `🔥 *FRESH BATCH NDIO HII IMEINGIA DUKANI LEO!* 🔥\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice}*\n\n` +
        `📦 Mzigo mpya kabisa ushatua dukani kwetu *${shop}*!\n` +
        `✔ *Kazi Yake:* ${product.benefit_line || 'Matokeo yake ni ya haraka na ya ukweli.'}\n` +
        `⚡ Wateja wanainunua kwa wingi — wahi kabla haijaisha kwa shelf!\n\n` +
        `${ctaText}`;
    }

    // ANGLE 2: Daily Routine Upgrade
    if (hookAngle === 2) {
      return `💡 *GLOW UP YA LEO: UTUNZAJI BORA WA NGOZI!* 💡\n\n` +
        `Unatafuta bidhaa itakayokupa matokeo ya ukweli bila filters?\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice} tu!*\n\n` +
        `🌿 *Kazi Yake:* ${product.benefit_line || 'Inalinda ngozi na kuacha muonekano safi wa kuvutia.'}\n` +
        `💎 Mzigo original unaoleta mabadiliko ya wazi unayotaka kuona.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 3: Fast Delivery & Lipa na M-Pesa Convenience
    if (hookAngle === 3) {
      return `📦 *TUKO TAYARI KUKUTUMIA MZIGO WAKO LEO LEO!* 📦\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Bei: *${formattedPrice}*\n\n` +
        `🚀 Nairobi tunakuletea na boda siku hiyo hiyo; mikoani parcels zinafika kesho asubuhi.\n` +
        `✔ ${product.benefit_line || 'Original 100%, imethibitishwa na ubora wake unaeleweka.'}\n` +
        `🟢 Malipo ni rahisi kupitia Lipa na M-Pesa.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 4: Top Seller / Customer Favorite Recommendation
    return `🔥 *TOP SELLER WIKI HII — INAPENDWA SANA NA WATEJA!* 🔥\n\n` +
      `*${product.name}*${sizeStr}\n` +
      `💰 Bei: *${formattedPrice}*\n\n` +
      `💎 Hii ni moja ya vitu vinavyotoka sana dukani wiki hii!\n` +
      `✔ ${product.benefit_line || 'Ubora wa uhakika na matokeo mazuri sana.'}\n` +
      `✔ Fresh stock ipo dukani sasa hivi tayari kwa kuagizwa.\n\n` +
      `${ctaText}`;
  },

  /**
   * English Commercial Caption Engine with Kenyan Context
   */
  generateEnglishCaption(product, seller, style = 'price_focus', companionProduct = null, dateStr = null) {
    const formattedPrice = `KES ${Number(product.price).toLocaleString()}`;
    const shop = seller.shop_name || 'Beauty Bar Kenya';
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD';
    const sizeStr = product.size ? ` (${product.size})` : '';

    // Deterministic 24-hour product seed
    const dayHash = getProductDayHash(dateStr, product.id);
    const hookAngle = (dayHash + style.length) % 5;
    const ctaVariant = (dayHash >> 2) % 4;

    // ------------------------------------
    // STYLE: 2-IN-1 ROUTINE DUO / BUNDLE OFFER
    // ------------------------------------
    if (style === 'product_bundles' || style === 'bundle_offer') {
      const companion = companionProduct || {
        name: 'Companion Glow Item',
        price: Math.round(product.price * 0.85),
        benefit_line: 'Completes your routine'
      };
      const regularTotal = Number(product.price) + Number(companion.price);
      const savings = Math.max(300, Math.round((regularTotal * 0.12) / 100) * 100);
      const bundlePrice = regularTotal - savings;

      const comboHooks = [
        '*POWER DUO BUNDLE DEAL!*',
        '🔥 *2-IN-1 ROUTINE SAVINGS ALERT!* 🔥',
        '💡 *COMPLETE YOUR ROUTINE & SAVE!* 💡'
      ];
      const chosenHook = comboHooks[dayHash % comboHooks.length];

      return `${chosenHook}\n\n` +
        `1️⃣ *${product.name}*${sizeStr} — KES ${Number(product.price).toLocaleString()}\n` +
        `2️⃣ *${companion.name}* — KES ${Number(companion.price).toLocaleString()}\n\n` +
        `💰 Regular Total: ~KES ${regularTotal.toLocaleString()}~\n` +
        `⚡ *Duo Deal: KES ${bundlePrice.toLocaleString()} only!* (Save KES ${savings.toLocaleString()})\n\n` +
        `📍 Available at *${shop}*\n` +
        `📲 *To Order:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa available • Same-day dispatch across Kenya!`;
    }

    // ------------------------------------
    // STYLE: FLASH SALE / PRICE DROP
    // ------------------------------------
    if (style === 'flash_sale' || style === 'price_drop') {
      const originalPrice = Math.round((Number(product.price) * 1.3) / 50) * 50;
      const savings = originalPrice - Number(product.price);
      
      const dropHooks = [
        '🔥 *LIMITED-TIME FLASH OFFER!* 🔥',
        '⚡ *TODAY\'S SPECIAL PRICE DROP!* ⚡',
        '🏷️ *PRICE DROP ALERT!* 🏷️'
      ];
      const chosenDropHook = dropHooks[dayHash % dropHooks.length];

      return `${chosenDropHook}\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `❌ Was: ~KES ${originalPrice.toLocaleString()}~\n` +
        `🔥 *Now: ${formattedPrice} only!* (Save KES ${savings.toLocaleString()})\n\n` +
        `🌿 *Highlight:* ${product.benefit_line || 'Verified authentic formulation'}\n` +
        `📍 *${shop}* (${location})\n\n` +
        `⏳ *Limited pieces at this offer price!*\n` +
        `📲 WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa. DM or send screenshot to lock yours in!`;
    }

    // ------------------------------------
    // STYLE: CUSTOMER REVIEWS / SOCIAL PROOF
    // ------------------------------------
    if (style === 'customer_reviews' || style === 'review_spotlight') {
      const reviewHooks = [
        '*VERIFIED CUSTOMER FAVORITE (RATED 4.9 / 5.0)*',
        '👑 *WHAT OUR CUSTOMERS ARE SAYING (REVIEW SPOTLIGHT)* 👑',
        '💬 *REAL CUSTOMER RESULTS & REVIEWS!* 💬'
      ];
      const chosenReviewHook = reviewHooks[dayHash % reviewHooks.length];

      const reviewQuote = (product.category || '').toLowerCase().includes('clothes')
        ? '“True to size, breathable fabric and top quality stitching! Delivery was same-day.” — Stacy M., Kilimani'
        : ((product.category || '').toLowerCase().includes('household')
            ? '“Received exactly what was pictured, heavy quality and vibrant colors!” — Mary W., Westlands'
            : '“Cleared my dark spots in 2 weeks! Original product kabisa, 100% repurchasing.” — Stacy M., Kilimani');

      return `${chosenReviewHook}\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n` +
        `Customer Rating: *4.9 / 5.0 (120+ Verified Kenyan Shoppers)*\n\n` +
        `🗣️ *Customer Spotlight:*\n` +
        `${reviewQuote} (Verified Buyer ✓)\n\n` +
        `🌿 *Highlight:* ${product.benefit_line || 'Verified authentic formulation'}\n` +
        `📍 Available at *${shop}* (${location})\n\n` +
        `📲 *Order Yours on WhatsApp:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Same-day Nairobi delivery & countrywide parcels!`;
    }

    // ------------------------------------
    // STYLE: BACK IN STOCK / RESTOCKED / RESTOCK ALERTS
    // ------------------------------------
    if (style === 'restock_alerts' || style === 'back_in_stock' || style === 'restocked') {
      const stockHooks = [
        '🚨 *BACK IN STOCK TODAY!* 🚨',
        '📦 *FRESH RESTOCK JUST LANDED!* 📦',
        '⚡ *RESTOCKED BY POPULAR DEMAND!* ⚡'
      ];
      const chosenStockHook = stockHooks[dayHash % stockHooks.length];

      return `${chosenStockHook}\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n` +
        `🌿 *Details:* ${product.benefit_line || '100% genuine formulation'}\n\n` +
        `⚠️ *Moving very fast — fresh batch ready!*\n` +
        `📍 Available at *${shop}*\n\n` +
        `📲 *Quick Order:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Same-day Nairobi dispatch & countrywide parcels!`;
    }

    // ------------------------------------
    // STYLE: LIMITED STOCK / URGENCY
    // ------------------------------------
    if (style === 'limited_stock') {
      return `⚠️ *LIMITED STOCK REMAINING!* ⚠️\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n` +
        `🌿 *Details:* ${product.benefit_line || '100% genuine formulation'}\n\n` +
        `🔥 *Only a few pieces left in store!*\n` +
        `📍 Available at *${shop}*\n\n` +
        `📲 *To Order:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Delivery available across Kenya!`;
    }

    // ------------------------------------
    // STYLE: LUXURY VOGUE EDITORIAL
    // ------------------------------------
    if (style === 'luxury_editorial' || style === 'editorial' || style === 'vogue') {
      return `✨ *THE SIGNATURE EDIT — AUTHENTIC LUXURY & REFINED QUALITY* ✨\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Curated Price: *${formattedPrice}*\n` +
        `✦ ${product.benefit_line || 'Hand-selected premium formulation • Guaranteed authentic'} ✦\n\n` +
        `👑 *Exclusively available for clients who value 100% genuine formulations and refined results.*\n` +
        `📍 Location: *${shop}* (${location})\n\n` +
        `📲 *VIP Concierge Ordering:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa Buy Goods Till. Same-day Nairobi courier & nationwide dispatch!`;
    }

    // ------------------------------------
    // STYLE: NEON STREETWEAR DROP
    // ------------------------------------
    if (style === 'neon_bold' || style === 'streetwear' || style === 'neon') {
      return `⚡ *HIGH-DEMAND STREET DROP — OFFICIAL STORE RELEASE!* ⚡\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice} only!*\n` +
        `✔ ${product.benefit_line || '100% verified original stock'}\n` +
        `🔥 *Fast-moving release — high demand in store today!*\n\n` +
        `📍 Pick up at: *${shop}* (${location})\n\n` +
        `📲 *Tap WhatsApp to Cop Yours:* \n` +
        `WhatsApp: *${phone}*\n` +
        `⚡ Express Boda dispatch across Nairobi & countrywide parcels!`;
    }

    // ------------------------------------
    // STYLE: STUDIO MINIMALIST
    // ------------------------------------
    if (style === 'minimalist_clean' || style === 'minimal' || style === 'studio_clean') {
      return `🌿 *STUDIO COLLECTION — CLEAN & PURE FORMULATION* 🌿\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n` +
        `✔ ${product.benefit_line || '100% Authentic Quality • Gentle on skin'}\n` +
        `✔ Sealed & certified authentic directly from verified suppliers.\n\n` +
        `📍 Available at *${shop}* (${location})\n\n` +
        `📲 *Order Directly via WhatsApp:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa. Dispatched promptly countrywide!`;
    }

    // ------------------------------------
    // STYLE: POLAROID INSTANT SNAP
    // ------------------------------------
    if (style === 'polaroid_snap' || style === 'polaroid' || style === 'retro_snap') {
      return `📸 *TODAY'S HANDPICKED FAVORITE!* 📸\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice} only!*\n` +
        `🤍 *“${product.benefit_line || 'Absolute must-have for everyday glow!'}”*\n\n` +
        `✨ Hand-selected by our store team for today's status feature.\n` +
        `📍 *${shop}* (${location})\n\n` +
        `📲 *Screenshot this photo & send to WhatsApp to order:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa • Same-day Nairobi & countrywide delivery!`;
    }

    // ------------------------------------
    // STYLE: CLEARANCE STARBURST DEAL
    // ------------------------------------
    if (style === 'clearance_deal' || style === 'hot_deal' || style === 'supermarket') {
      const orig = Math.round((Number(product.price) * 1.35) / 50) * 50;
      const sav = orig - Number(product.price);
      return `🔥 *CRAZY CLEARANCE DEAL — MEGA VALUE SAVINGS TODAY!* 🔥\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `❌ Regular Price: ~KES ${orig.toLocaleString()}~\n` +
        `💥 *Now Only: ${formattedPrice}!* (You Save KES ${sav.toLocaleString()} instantly!)\n\n` +
        `✔ 100% Genuine Original Quality\n` +
        `⚠️ *Clearance stock is limited — first come, first served!*\n\n` +
        `📍 Available at *${shop}* (${location})\n\n` +
        `📲 *Claim Yours Before It Sells Out:*\n` +
        `WhatsApp / Call: *${phone}*\n` +
        `🟢 Lipa na M-Pesa Buy Goods • Countrywide delivery!`;
    }

    // ------------------------------------
    // 5 DYNAMIC 24-HOUR NON-REPETITIVE CAPTION ANGLES (Standard/Price Focus/Benefit/Minimal)
    // ------------------------------------

    // CTA Variations
    const ctaOptions = [
      `📍 *${shop}* (${location})\n📲 WhatsApp / Call: *${phone}*\n⚡ Lipa na M-Pesa available. DM or send screenshot to order!`,
      `📍 Available at *${shop}*\n📲 Direct WhatsApp: *${phone}*\n💬 Send screenshot to confirm your order. Quick same-day dispatch!`,
      `🏪 *${shop}* • Countrywide Deliveries\n📲 Order via WhatsApp: *${phone}*\n🟢 Convenient Lipa na M-Pesa. Dispatched promptly across Kenya!`,
      `📍 *${shop}* (CBD Pick-up & Parcels)\n📲 Inquire or Order: *${phone}*\n⚡ Lipa na M-Pesa Buy Goods. Screenshot this flyer to order!`
    ];
    const ctaText = ctaOptions[ctaVariant];

    // ------------------------------------
    // CATEGORY 2: HOUSEHOLD & BEDDING SPECIALIZED HOOKS
    // ------------------------------------
    if (getCategoryGroup(product.category) === 'household') {
      const homeHooks = [
        `🛏️ *LUXURY BEDROOM & HOME UPGRADE* 🛏️\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Offer Price: *${formattedPrice}*\n\n` +
          `✔ Transform your bedroom with luxury comfort.\n` +
          `✔ ${product.benefit_line || 'Durable, fade-proof and machine washable.'}\n` +
          `✔ Premium quality that looks and feels stunning.\n\n` +
          `${ctaText}`,
        `🔥 *HOT SELLER: COZY HOME ESSENTIAL* 🔥\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Price: *${formattedPrice}*\n\n` +
          `📦 Luxury hotel-grade feel right in your home!\n` +
          `💎 *Details:* ${product.benefit_line || 'Tested quality, long-lasting comfort.'}\n` +
          `⚡ Fast moving stock — order yours before it sells out.\n\n` +
          `${ctaText}`,
        `🏡 *ELEVATE YOUR LIVING SPACE* 🏡\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Special Price: *${formattedPrice}*\n\n` +
          `✔ ${product.benefit_line || 'Super soft micro-fiber & elegant design.'}\n` +
          `🚀 Same-day delivery in town & reliable parcel dispatch countrywide.\n` +
          `🟢 Pay safely via Lipa na M-Pesa.\n\n` +
          `${ctaText}`
      ];
      return homeHooks[dayHash % homeHooks.length];
    }

    // ------------------------------------
    // CATEGORY 3: CLOTHES & FASHION SPECIALIZED HOOKS
    // ------------------------------------
    if (getCategoryGroup(product.category) === 'clothes') {
      const clothesHooks = [
        `👗 *NEW ARRIVAL: CHIC & ELEGANT* 👗\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Price: *${formattedPrice}*\n\n` +
          `✔ Turn heads with this stunning piece!\n` +
          `✔ ${product.benefit_line || 'Premium fabric, flattering fit & comfortable wear.'}\n` +
          `⚡ Limited pieces available in store.\n\n` +
          `${ctaText}`,
        `👑 *ELEGANT LOOK OF THE DAY* 👑\n\n` +
          `*${product.name}*${sizeStr}\n` +
          `💰 Price: *${formattedPrice}*\n\n` +
          `💎 Perfect for office, church, dinner & special occasions.\n` +
          `✔ ${product.benefit_line || 'High-quality fabric that holds its shape.'}\n\n` +
          `${ctaText}`
      ];
      return clothesHooks[dayHash % clothesHooks.length];
    }

    // ANGLE 0: Authenticity & Sealed Packaging (Zero Counterfeits)
    if (hookAngle === 0) {
      return `*100% VERIFIED AUTHENTIC & SEALED*\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n\n` +
        `✔ 100% original, verified genuine store stock.\n` +
        `✔ ${product.benefit_line || 'Visible results with consistent daily care.'}\n` +
        `✔ Sealed packaging with authenticity seal.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 1: Fresh Batch / Limited Restock Urgency
    if (hookAngle === 1) {
      return `🔥 *FRESH BATCH IN STORE TODAY* 🔥\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n\n` +
        `📦 Fresh genuine stock just arrived at *${shop}*!\n` +
        `✔ *Why you\'ll love it:* ${product.benefit_line || 'Essential daily favorite.'}\n` +
        `⚡ High demand item — order early to secure yours today.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 2: Daily Routine Upgrade
    if (hookAngle === 2) {
      return `💡 *YOUR DAILY ROUTINE UPGRADE* 💡\n\n` +
        `Looking for dependable, genuine results?\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n\n` +
        `🌿 *Key Benefit:* ${product.benefit_line || 'Tested and trusted formulation.'}\n` +
        `💎 Authentic quality that delivers visible difference.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 3: Fast Delivery & Lipa na M-Pesa Convenience
    if (hookAngle === 3) {
      return `📦 *READY FOR SAME-DAY DISPATCH* 📦\n\n` +
        `*${product.name}*${sizeStr}\n` +
        `💰 Price: *${formattedPrice}*\n\n` +
        `🚀 Ready for same-day delivery in Nairobi & countrywide parcels.\n` +
        `✔ ${product.benefit_line || 'Original formulation, guaranteed.'}\n` +
        `🟢 Easy payment via Lipa na M-Pesa.\n\n` +
        `${ctaText}`;
    }

    // ANGLE 4: Top Seller / Customer Favorite Recommendation
    return `🔥 *TODAY\'S TOP SELLER PICK* 🔥\n\n` +
      `*${product.name}*${sizeStr}\n` +
      `💰 Price: *${formattedPrice}*\n\n` +
      `💎 One of our most requested customer favorites this week!\n` +
      `✔ ${product.benefit_line || 'Trusted quality and genuine formula.'}\n` +
      `✔ Fresh batch currently available.\n\n` +
      `${ctaText}`;
  }
};
