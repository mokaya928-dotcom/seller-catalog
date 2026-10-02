/**
 * Config Engine & Dynamic Palette Resolver for Kenyan E-Commerce & Daily Post Pipeline
 * 
 * SellerConfig is the single source of truth for seller brand identity across:
 * - Canvas flyer renderers
 * - Customer storefront catalog layouts
 * - WhatsApp post captions and social proof notifications
 * - 10-second ephemeral URL demo links (?demo=1&shop=...&phone=...&till=...&color=...)
 */

// Canonical Seller #001: The Beauty Bar Kenya
export const BEAUTY_BAR_SELLER_CONFIG = {
  id: 'seller_beauty_bar_kenya',
  shop_name: 'The Beauty Bar Kenya',
  location: 'Jamia Mall, Shop F47 (1st Flr), Nairobi CBD',
  phone: '+254 728 222 211',
  phone_raw: '254728222211',
  brand_color: '#064e3b',
  brand_secondary: '#047857',
  palette: 'emerald',
  brand_font: 'Cinzel',
  language: 'kenyan_mix',
  mpesa_till: '582910',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Countrywide Delivery via Wells Fargo / G4S / Boda'
};

export const DEFAULT_SELLER_CONFIG = BEAUTY_BAR_SELLER_CONFIG;

// Preset Palettes conforming to the LOCKED single template architecture
export const STATIC_PALETTES = {
  forest_amber: {
    id: 'forest_amber',
    name: 'Forest Green & Amber (Default)',
    label: 'Forest Green + Amber',
    band: '#064e3b',
    stripe: '#f59e0b',
    priceBg: '#064e3b',
    badge: '#0f172a',
    subtext: '#047857',
    primary: '#064e3b',
    accent: '#f59e0b',
    accentBorder: '#f59e0b',
    headerSubtext: '#fef3c7',
    locationText: '#e2e8f0',
    benefitText: '#047857',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#064e3b',
    mpesaBorder: '#f59e0b',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#f59e0b'
  },
  emerald: {
    id: 'emerald',
    name: 'Forest Green & Amber (Default)',
    label: 'Forest Green + Amber',
    band: '#064e3b',
    stripe: '#f59e0b',
    priceBg: '#064e3b',
    badge: '#0f172a',
    subtext: '#047857',
    primary: '#064e3b',
    accent: '#f59e0b',
    accentBorder: '#f59e0b',
    headerSubtext: '#fef3c7',
    locationText: '#e2e8f0',
    benefitText: '#047857',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#064e3b',
    mpesaBorder: '#f59e0b',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#f59e0b'
  },
  deep_teal_gold: {
    id: 'deep_teal_gold',
    name: 'Deep Teal & Gold',
    label: 'Deep Teal + Gold (Body Care & Dove)',
    band: '#0e5e6f',
    stripe: '#e5a93b',
    priceBg: '#0e5e6f',
    badge: '#0e5e6f',
    subtext: '#0f766e',
    primary: '#0e5e6f',
    accent: '#e5a93b',
    accentBorder: '#e5a93b',
    headerSubtext: '#e2e8f0',
    locationText: '#cbd5e1',
    benefitText: '#0f766e',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#0e5e6f',
    mpesaBorder: '#e5a93b',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#e5a93b'
  },
  teal: {
    id: 'teal',
    name: 'Deep Teal & Gold',
    label: 'Deep Teal + Gold (Body Care & Dove)',
    band: '#0e5e6f',
    stripe: '#e5a93b',
    priceBg: '#0e5e6f',
    badge: '#0e5e6f',
    subtext: '#0f766e',
    primary: '#0e5e6f',
    accent: '#e5a93b',
    accentBorder: '#e5a93b',
    headerSubtext: '#e2e8f0',
    locationText: '#cbd5e1',
    benefitText: '#0f766e',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#0e5e6f',
    mpesaBorder: '#e5a93b',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#e5a93b'
  },
  midnight_navy_amber: {
    id: 'midnight_navy_amber',
    name: 'Midnight Navy & Amber',
    label: 'Midnight Navy + Amber (Bags & Bedding)',
    band: '#0f172a',
    stripe: '#d97706',
    priceBg: '#0f172a',
    badge: '#1e293b',
    subtext: '#475569',
    primary: '#0f172a',
    accent: '#d97706',
    accentBorder: '#d97706',
    headerSubtext: '#e2e8f0',
    locationText: '#94a3b8',
    benefitText: '#475569',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#0f172a',
    mpesaBorder: '#d97706',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#fbbf24'
  },
  slate: {
    id: 'slate',
    name: 'Midnight Navy & Amber',
    label: 'Midnight Navy + Amber (Bags & Bedding)',
    band: '#0f172a',
    stripe: '#d97706',
    priceBg: '#0f172a',
    badge: '#1e293b',
    subtext: '#475569',
    primary: '#0f172a',
    accent: '#d97706',
    accentBorder: '#d97706',
    headerSubtext: '#e2e8f0',
    locationText: '#94a3b8',
    benefitText: '#475569',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#0f172a',
    mpesaBorder: '#d97706',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#fbbf24'
  },
  burgundy_gold: {
    id: 'burgundy_gold',
    name: 'Burgundy & Gold',
    label: 'Burgundy + Gold (Lipsticks & Glosses)',
    band: '#5b1425',
    stripe: '#eab308',
    priceBg: '#5b1425',
    badge: '#5b1425',
    subtext: '#831843',
    primary: '#5b1425',
    accent: '#eab308',
    accentBorder: '#eab308',
    headerSubtext: '#fef3c7',
    locationText: '#fcd34d',
    benefitText: '#831843',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#5b1425',
    mpesaBorder: '#eab308',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#eab308'
  },
  dusty_rose_charcoal: {
    id: 'dusty_rose_charcoal',
    name: 'Dusty Rose & Charcoal',
    label: 'Dusty Rose + Charcoal (Pink & Soft Products)',
    band: '#88304e',
    stripe: '#f4c2d1',
    priceBg: '#334155',
    badge: '#334155',
    subtext: '#64748b',
    primary: '#88304e',
    accent: '#f4c2d1',
    accentBorder: '#f4c2d1',
    headerSubtext: '#fdf2f8',
    locationText: '#fce7f3',
    benefitText: '#64748b',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#334155',
    mpesaBorder: '#f4c2d1',
    mpesaText: '#ffffff',
    cardBorder: '#e2e8f0',
    priceColor: '#f4c2d1'
  }
};

/**
 * 5 Locked Theme Palettes for 1-Tap Poster & Storefront Switching
 */
export const PRIMARY_PALETTES = [
  { id: 'forest_amber', label: 'Forest Green & Amber', shortLabel: 'Forest & Amber', band: '#064e3b', stripe: '#f59e0b', aliases: ['emerald', 'forest_amber'] },
  { id: 'deep_teal_gold', label: 'Deep Teal & Gold', shortLabel: 'Teal & Gold', band: '#0e5e6f', stripe: '#e5a93b', aliases: ['teal', 'deep_teal_gold'] },
  { id: 'midnight_navy_amber', label: 'Midnight Navy & Amber', shortLabel: 'Navy & Amber', band: '#0f172a', stripe: '#d97706', aliases: ['slate', 'midnight_navy_amber'] },
  { id: 'burgundy_gold', label: 'Burgundy & Gold', shortLabel: 'Burgundy & Gold', band: '#5b1425', stripe: '#eab308', aliases: ['burgundy_gold'] },
  { id: 'dusty_rose_charcoal', label: 'Dusty Rose & Charcoal', shortLabel: 'Rose & Slate', band: '#88304e', stripe: '#f4c2d1', aliases: ['dusty_rose_charcoal'] }
];

/**
 * Curated Registry of Supported Brand Fonts
 */
export const SUPPORTED_BRAND_FONTS = {
  Cinzel: {
    name: 'Cinzel',
    category: 'serif',
    vibe: 'Luxury Serif • High-End Beauty & Jewelry',
    cssFamily: '"Cinzel", Georgia, serif'
  },
  'Playfair Display': {
    name: 'Playfair Display',
    category: 'serif',
    vibe: 'Editorial Boutique • High-End Fashion & Cosmetics',
    cssFamily: '"Playfair Display", Georgia, serif'
  },
  'Plus Jakarta Sans': {
    name: 'Plus Jakarta Sans',
    category: 'sans-serif',
    vibe: 'Clean Modern • Fast Moving Retail & Everyday Essentials',
    cssFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  Montserrat: {
    name: 'Montserrat',
    category: 'sans-serif',
    vibe: 'Bold Contemporary • Urban Streetwear & Handbags',
    cssFamily: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  'Cormorant Garamond': {
    name: 'Cormorant Garamond',
    category: 'serif',
    vibe: 'Classic Prestige • Spas, Perfumery & Organic Skincare',
    cssFamily: '"Cormorant Garamond", Garamond, Georgia, serif'
  },
  Syne: {
    name: 'Syne',
    category: 'sans-serif',
    vibe: 'Avant-Garde • Trend-Forward Apparel & Bags',
    cssFamily: '"Syne", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  'Bodoni Moda': {
    name: 'Bodoni Moda',
    category: 'serif',
    vibe: 'Vogue Luxury • Premium Accessories & Leather Goods',
    cssFamily: '"Bodoni Moda", Didot, Georgia, serif'
  }
};

/**
 * Validates a SellerConfig object
 */
export function validateSellerConfig(config) {
  const errors = [];
  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['SellerConfig must be an object'] };
  }
  if (!config.shop_name || !String(config.shop_name).trim()) {
    errors.push('shop_name is required');
  }
  if (!config.phone || !String(config.phone).trim()) {
    errors.push('phone is required');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Safely resolves seller configuration with guaranteed fallback to Beauty Bar Kenya (Seller #001)
 */
export function resolveSellerConfig(sellerInput) {
  if (!sellerInput || typeof sellerInput !== 'object') {
    return { ...BEAUTY_BAR_SELLER_CONFIG };
  }

  const phone = sellerInput.phone || BEAUTY_BAR_SELLER_CONFIG.phone;
  const rawDigits = String(phone).replace(/[^0-9]/g, '');

  return {
    ...BEAUTY_BAR_SELLER_CONFIG,
    ...sellerInput,
    id: sellerInput.id || BEAUTY_BAR_SELLER_CONFIG.id,
    shop_name: (sellerInput.shop_name && String(sellerInput.shop_name).trim()) || BEAUTY_BAR_SELLER_CONFIG.shop_name,
    location: (sellerInput.location && String(sellerInput.location).trim()) || BEAUTY_BAR_SELLER_CONFIG.location,
    phone: phone,
    phone_raw: rawDigits || BEAUTY_BAR_SELLER_CONFIG.phone_raw,
    brand_color: isValidHex(sellerInput.brand_color) ? sellerInput.brand_color : BEAUTY_BAR_SELLER_CONFIG.brand_color,
    brand_secondary: isValidHex(sellerInput.brand_secondary) ? sellerInput.brand_secondary : BEAUTY_BAR_SELLER_CONFIG.brand_secondary,
    brand_font: sellerInput.brand_font && SUPPORTED_BRAND_FONTS[sellerInput.brand_font] ? sellerInput.brand_font : BEAUTY_BAR_SELLER_CONFIG.brand_font,
    mpesa_till: (sellerInput.mpesa_till && String(sellerInput.mpesa_till).trim()) || BEAUTY_BAR_SELLER_CONFIG.mpesa_till,
    mpesa_type: sellerInput.mpesa_type || BEAUTY_BAR_SELLER_CONFIG.mpesa_type,
    delivery_info: sellerInput.delivery_info || BEAUTY_BAR_SELLER_CONFIG.delivery_info,
    language: sellerInput.language || BEAUTY_BAR_SELLER_CONFIG.language
  };
}

/**
 * Validates 3 or 6 digit hex color
 */
export function isValidHex(hex) {
  return typeof hex === 'string' && /^#([0-9A-Fa-f]{3}){1,2}$/.test(hex.trim());
}

/**
 * Converts any hex string to RGB [r, g, b]
 */
export function hexToRgb(hex) {
  let clean = String(hex || '#000000').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return [0, 0, 0];
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Calculates standard perceived luminance (0 - 255)
 * Formula: Y = 0.299*R + 0.587*G + 0.114*B
 */
export function getLuminance(r, g, b) {
  return (0.299 * r) + (0.587 * g) + (0.114 * b);
}

/**
 * Dynamic Palette Resolver
 * Generates an entire cohesive luxury theme from ANY single hex color
 * with automatic contrast calculations for light/dark text, champagne/gold accents, and badge tones.
 */
export function resolvePalette(sellerOrHex, override) {
  // If an override is passed or the input matches static palettes
  const overrideKey = override && String(override).toLowerCase();
  if (overrideKey && STATIC_PALETTES[overrideKey]) {
    return STATIC_PALETTES[overrideKey];
  }

  // Extract base color
  let baseHex = '#064e3b';
  let namedPalette = null;

  if (typeof sellerOrHex === 'string') {
    if (STATIC_PALETTES[sellerOrHex.toLowerCase()]) {
      return STATIC_PALETTES[sellerOrHex.toLowerCase()];
    }
    if (isValidHex(sellerOrHex)) {
      baseHex = sellerOrHex.trim();
    }
  } else if (sellerOrHex && typeof sellerOrHex === 'object') {
    if (sellerOrHex.palette && STATIC_PALETTES[sellerOrHex.palette.toLowerCase()]) {
      namedPalette = STATIC_PALETTES[sellerOrHex.palette.toLowerCase()];
    }
    if (isValidHex(sellerOrHex.brand_color)) {
      baseHex = sellerOrHex.brand_color.trim();
    }
  }

  // If seller explicitly selected named 'slate' or 'emerald' and hasn't changed hex
  if (namedPalette && (baseHex === '#064e3b' || baseHex === '#0f172a')) {
    return namedPalette;
  }

  // Generate dynamic palette from baseHex
  const [r, g, b] = hexToRgb(baseHex);
  const lum = getLuminance(r, g, b);
  const isDarkPrimary = lum < 140;

  // Determine complementary / luxury warm accent
  // For deep colors (emerald, navy, plum, burgundy, black), warm champagne gold (#f59e0b / #fbbf24) is elite
  // For hot pink or yellow/orange, tune accent to ensure striking contrast
  let accent = '#f59e0b';
  let accentBorder = '#f59e0b';
  let glow = 'rgba(245, 158, 11, 0.25)';

  // If base color is already yellowish / warm gold (high red & green, low blue)
  if (r > 180 && g > 150 && b < 100) {
    // Brand is gold or yellow -> use obsidian dark or deep crimson accent
    accent = '#0f172a';
    accentBorder = '#1e293b';
    glow = 'rgba(15, 23, 42, 0.25)';
  } else if (r > 200 && g < 80 && b > 140) {
    // Brand is hot pink / magenta (#fa31df) -> luminous warm amber accent
    accent = '#fbbf24';
    accentBorder = '#f59e0b';
    glow = 'rgba(251, 191, 36, 0.3)';
  } else if (lum > 180) {
    // Brand is very light pastel -> deepen accent for legibility
    accent = '#b45309';
    accentBorder = '#92400e';
    glow = 'rgba(180, 83, 9, 0.2)';
  }

  const headerSubtext = isDarkPrimary ? '#fef3c7' : '#1e293b';
  const locationText = isDarkPrimary ? '#e2e8f0' : '#334155';
  const footerSubtext = isDarkPrimary ? '#cbd5e1' : '#475569';
  const mpesaText = '#ffffff';

  return {
    id: `dyn_${baseHex.replace('#', '')}`,
    name: 'Dynamic Brand Palette',
    label: `Dynamic (${baseHex})`,
    primary: baseHex,
    accent: accent,
    accentBorder: accentBorder,
    headerSubtext: headerSubtext,
    locationText: locationText,
    benefitText: isDarkPrimary ? '#94a3b8' : '#475569',
    glow: glow,
    footerSubtext: footerSubtext,
    mpesaBg: isDarkPrimary ? baseHex : '#0f172a',
    mpesaBorder: accent,
    mpesaText: mpesaText,
    cardBorder: glow.replace('0.25', '0.45').replace('0.3', '0.45'),
    priceColor: accent,
    isDarkPrimary: isDarkPrimary
  };
}

/**
 * On-Demand Font Loader for Canvas & Web Typography
 * Ensures web fonts are loaded and ready before canvas render routines draw text.
 */
export async function ensureBrandFontLoaded(fontFamily) {
  if (!fontFamily || typeof document === 'undefined') return;

  const fontInfo = SUPPORTED_BRAND_FONTS[fontFamily];
  const targetFamily = fontInfo ? fontInfo.name : fontFamily;

  // System fonts need no fetch
  if (targetFamily === 'system-ui' || targetFamily.toLowerCase().includes('sans-serif')) {
    return;
  }

  // 1. Check if font is already loaded in browser font set
  try {
    if (document.fonts && document.fonts.check(`bold 16px "${targetFamily}"`)) {
      return;
    }
  } catch (e) {
    // Proceed to load if check fails
  }

  // 2. Inject Google Fonts stylesheet link dynamically if not already present
  const fontLinkId = `gfont-${targetFamily.toLowerCase().replace(/\s+/g, '-')}`;
  if (!document.getElementById(fontLinkId)) {
    const link = document.createElement('link');
    link.id = fontLinkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(targetFamily)}:wght@400;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }

  // 3. Guarantee font is parsed and ready BEFORE canvas draw executes
  try {
    if (document.fonts && document.fonts.load) {
      await document.fonts.load(`bold 24px "${targetFamily}"`);
      await document.fonts.ready;
    }
  } catch (err) {
    console.warn(`Font "${targetFamily}" load failed; canvas will use fallback serif/sans-serif.`, err);
  }
}

/**
 * Parses Ephemeral URL Demo Link Query Parameters
 * e.g. ?demo=1&shop=Glamour+Boutique&phone=0712345678&till=987654&color=%23b91c1c&font=Playfair+Display
 * Returns a transient SellerConfig preview object or null if not in demo mode.
 * 
 * IMPORTANT: This does NOT write to localStorage or Supabase persistence.
 */
export function parseDemoConfigFromUrl(search = (typeof window !== 'undefined' ? window.location.search : '')) {
  if (!search) return null;

  try {
    const params = new URLSearchParams(search);
    const isDemo = params.get('demo') === '1' || params.get('demo') === 'true';
    const shop = params.get('shop');
    const phone = params.get('phone');
    const till = params.get('till');
    const color = params.get('color');
    const font = params.get('font');
    const location = params.get('location');

    // Trigger demo mode if demo flag is set OR at least 2 key branding params are supplied
    if (!isDemo && !shop && !till) {
      return null;
    }

    const demoConfig = {
      ...BEAUTY_BAR_SELLER_CONFIG,
      id: 'demo_ephemeral_seller',
      isDemoPreview: true,
      shop_name: shop ? decodeURIComponent(shop).trim() : 'Demo Boutique Kenya',
      phone: phone ? decodeURIComponent(phone).trim() : BEAUTY_BAR_SELLER_CONFIG.phone,
      phone_raw: phone ? phone.replace(/[^0-9]/g, '') : BEAUTY_BAR_SELLER_CONFIG.phone_raw,
      location: location ? decodeURIComponent(location).trim() : 'Nairobi CBD • Fast Delivery',
      mpesa_till: till ? decodeURIComponent(till).trim() : '889900',
      brand_color: isValidHex(color) ? color.trim() : (color && isValidHex('#' + color) ? '#' + color.trim() : '#b91c1c'),
      brand_font: font && SUPPORTED_BRAND_FONTS[decodeURIComponent(font)] ? decodeURIComponent(font) : 'Playfair Display'
    };

    return resolveSellerConfig(demoConfig);
  } catch (e) {
    console.warn('Failed to parse demo params from URL', e);
    return null;
  }
}
