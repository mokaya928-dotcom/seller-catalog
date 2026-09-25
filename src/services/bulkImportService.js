/**
 * Bulk Import & Store Backup Service
 * - Reads & parses Excel (.xlsx, .xls) and CSV (.csv) spreadsheets
 * - Intelligent column recognition & value normalization
 * - Generates pre-populated sample templates for Kenyan sellers
 * - Exports inventory to Excel (.xlsx) and CSV (.csv)
 * - Complete Full Store Backup & Restore (JSON)
 */
import * as XLSX from 'xlsx';

// Standard known categories in Daily Post
export const KNOWN_CATEGORIES = [
  'Makeup & Prep',
  'Lip Care',
  'Handbags & Bags',
  'Bath & Body',
  'Sunscreen & SPF',
  'Skincare & Face',
  'Serums & Actives',
  'Classic Clothes',
  'Household & Bedding'
];

/**
 * Intelligent Column Aliases Map
 * Matches common variations of column headers from POS, Shopify, WooCommerce, Excel sheets
 */
const COLUMN_ALIASES = {
  name: [
    'name', 'product name', 'product_name', 'title', 'item', 'product', 'item name', 'item_name', 'description title'
  ],
  price: [
    'price', 'selling price', 'selling_price', 'price (kes)', 'price kes', 'kes price', 'amount', 'cost', 'retail price', 'our price', 'offer price'
  ],
  regular_price: [
    'regular price', 'regular_price', 'original price', 'original_price', 'was price', 'old price', 'msrp', 'list price', 'market price', 'before'
  ],
  category: [
    'category', 'product category', 'collection', 'department', 'type', 'group', 'tag'
  ],
  size: [
    'size', 'volume', 'weight', 'net weight', 'capacity', 'spec', 'variant'
  ],
  benefit_line: [
    'benefit', 'benefit line', 'benefit_line', 'tagline', 'subtitle', 'hook', 'summary', 'one-liner', 'key benefit', 'short description'
  ],
  photo: [
    'photo', 'image', 'photo url', 'image url', 'image_url', 'photos', 'picture', 'thumbnail', 'pic', 'photo link'
  ],
  video: [
    'video', 'video url', 'video_url', 'reel', 'clip', 'video link'
  ],
  badge: [
    'badge', 'tag', 'label', 'promo', 'highlight tag', 'sticker'
  ],
  in_stock: [
    'in stock', 'in_stock', 'stock', 'available', 'status', 'stock status', 'availability', 'is available'
  ],
  remaining: [
    'remaining', 'stock_qty', 'stock qty', 'quantity', 'qty', 'count', 'inventory', 'items left'
  ],
  featured: [
    'featured', 'is featured', 'is_featured', 'spotlight', 'star'
  ],
  ingredients: [
    'ingredients', 'key ingredients', 'composition', 'active ingredients', 'materials'
  ],
  how_to_use: [
    'how to use', 'how_to_use', 'directions', 'usage', 'instructions', 'application'
  ],
  highlights: [
    'highlights', 'key features', 'features', 'bullet points', 'key points'
  ],
  description: [
    'description', 'details', 'about', 'notes', 'long description', 'body'
  ],
  id: [
    'id', 'product id', 'product_id', 'sku', 'code', 'item code'
  ]
};

/**
 * Clean & normalize a string key for matching
 */
function cleanKey(key) {
  if (!key) return '';
  return String(key)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Match a header string to one of our standard product field keys
 * Prioritizes exact matches, followed by longest specific aliases
 */
function matchHeaderToField(header) {
  const cleaned = cleanKey(header);
  if (!cleaned) return null;

  // 1. Exact match first across all fields
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    if (aliases.includes(cleaned)) {
      return field;
    }
  }

  // 2. Substring match: check longer, more specific aliases first (e.g. "regular price" before "price")
  const sortedAliases = [];
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const alias of aliases) {
      sortedAliases.push({ field, alias, len: alias.length });
    }
  }
  sortedAliases.sort((a, b) => b.len - a.len);

  for (const { field, alias } of sortedAliases) {
    if (cleaned.includes(alias)) {
      return field;
    }
  }

  return null;
}

/**
 * Clean numeric prices like "KES 1,800", "1,800/=", "$12", etc.
 */
function parsePrice(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

/**
 * Clean boolean flags like "yes", "true", "1", "in stock", "available"
 */
function parseBoolean(val, defaultVal = true) {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  if (['true', 'yes', '1', 'in stock', 'instock', 'available', 'y', 'active'].includes(s)) return true;
  if (['false', 'no', '0', 'out of stock', 'outofstock', 'sold out', 'n', 'inactive'].includes(s)) return false;
  return defaultVal;
}

/**
 * Extract size from product name if size column is missing (e.g. "Cerave 473ml")
 */
function extractSizeFromName(name) {
  if (!name) return '';
  const match = name.match(/\b(\d+(?:\.\d+)?\s*(?:ml|g|kg|l|oz|fl\s*oz|pcs|pc|capsules|tabs|tablets|shades|pack))\b/i);
  return match ? match[1].trim() : '';
}

/**
 * Best-effort match of freeform category string to known app categories
 */
function normalizeCategory(raw) {
  if (!raw) return 'Skincare & Face';
  const clean = String(raw).trim().toLowerCase();
  
  if (clean.includes('make') || clean.includes('primer') || clean.includes('powder') || clean.includes('foundation') || clean.includes('conceal')) {
    return 'Makeup & Prep';
  }
  if (clean.includes('lip') || clean.includes('gloss') || clean.includes('balm')) {
    return 'Lip Care';
  }
  if (clean.includes('sun') || clean.includes('spf') || clean.includes('uv')) {
    return 'Sunscreen & SPF';
  }
  if (clean.includes('serum') || clean.includes('active') || clean.includes('niacin') || clean.includes('retinol') || clean.includes('acid')) {
    return 'Serums & Actives';
  }
  if (clean.includes('bath') || clean.includes('body') || clean.includes('lotion') || clean.includes('wash') || clean.includes('scrub')) {
    return 'Bath & Body';
  }
  if (clean.includes('cloth') || clean.includes('wear') || clean.includes('dress') || clean.includes('shirt') || clean.includes('pant')) {
    return 'Classic Clothes';
  }
  if (clean.includes('house') || clean.includes('bed') || clean.includes('sheet') || clean.includes('duvet') || clean.includes('pillow') || clean.includes('home')) {
    return 'Household & Bedding';
  }
  if (clean.includes('bag') || clean.includes('handbag') || clean.includes('tote') || clean.includes('crossbody') || clean.includes('clutch') || clean.includes('purse')) {
    return 'Handbags & Bags';
  }
  if (clean.includes('face') || clean.includes('skin') || clean.includes('cream') || clean.includes('moistur')) {
    return 'Skincare & Face';
  }

  // Preserve user custom category capitalized
  return String(raw).trim();
}

/**
 * Parse uploaded Excel or CSV file
 */
export async function parseProductsFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('Spreadsheet has no sheets');
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Parse sheet to JSON array
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

        if (!rawRows || rawRows.length === 0) {
          throw new Error('Spreadsheet contains no data rows');
        }

        // Detect column mappings across all keys in the sheet
        const allKeys = new Set();
        rawRows.forEach((r) => Object.keys(r || {}).forEach((k) => allKeys.add(k)));
        const headerMapping = {};
        allKeys.forEach((key) => {
          const matchedField = matchHeaderToField(key);
          if (matchedField) {
            headerMapping[key] = matchedField;
          }
        });

        const validProducts = [];
        const invalidRows = [];
        const warnings = [];

        rawRows.forEach((row, index) => {
          const rowNumber = index + 2; // +1 for 0-index, +1 for header row
          
          // Map properties using headerMapping (preserving non-empty values)
          const item = {};
          Object.entries(row).forEach(([colKey, colVal]) => {
            const field = headerMapping[colKey];
            if (field) {
              const hasExistingVal = item[field] !== undefined && String(item[field]).trim() !== '';
              const hasNewVal = colVal !== undefined && colVal !== null && String(colVal).trim() !== '';
              if (!hasExistingVal || hasNewVal) {
                item[field] = colVal;
              }
            }
          });

          // Product Name is mandatory
          const name = String(item.name || '').trim();
          if (!name) {
            invalidRows.push({
              rowNumber,
              data: row,
              reason: 'Missing Product Name'
            });
            return;
          }

          const price = parsePrice(item.price);
          const regularPriceRaw = parsePrice(item.regular_price);
          const regularPrice = regularPriceRaw > price ? regularPriceRaw : undefined;

          if (price === 0) {
            warnings.push(`Row ${rowNumber} ("${name}"): Price is 0 or missing.`);
          }

          const category = normalizeCategory(item.category);
          const size = String(item.size || '').trim() || extractSizeFromName(name);
          const inStock = parseBoolean(item.in_stock, true);
          const featured = parseBoolean(item.featured, false);
          const remaining = parseInt(item.remaining, 10) || 5;

          // Parse photos
          let photos = [];
          if (item.photo) {
            const rawPhoto = String(item.photo).trim();
            // Split if multiple URLs separated by comma, semicolon, or newline
            if (rawPhoto.includes(',') || rawPhoto.includes(';') || rawPhoto.includes('\n')) {
              photos = rawPhoto.split(/[,;\n]+/).map((u) => u.trim()).filter(Boolean);
            } else {
              photos = [rawPhoto];
            }
          }

          // Fallback image if none provided
          if (photos.length === 0) {
            photos = ['/products/bbk-cerave-cream.jpg'];
          }

          const primaryPhoto = photos[0];

          // Parse highlights
          let highlights = [];
          if (item.highlights) {
            const rawH = String(item.highlights).trim();
            if (rawH.includes(';') || rawH.includes('|') || rawH.includes('\n')) {
              highlights = rawH.split(/[;|\n]+/).map((h) => h.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
            } else if (rawH.includes(',')) {
              highlights = rawH.split(',').map((h) => h.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
            } else if (rawH) {
              highlights = [rawH];
            }
          }

          // Generate benefit line if missing
          let benefitLine = String(item.benefit_line || '').trim();
          if (!benefitLine && item.description) {
            const firstSentence = String(item.description).split(/[.!?]\s+/)[0];
            if (firstSentence && firstSentence.length < 110) {
              benefitLine = firstSentence.trim();
            }
          }
          if (!benefitLine) {
            benefitLine = `Premium quality ${name} available in stock now`;
          }

          // Unique ID
          const existingId = String(item.id || '').trim();
          const cleanId = existingId && existingId.length > 3
            ? existingId
            : `prod_bulk_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 4)}`;

          const normalizedProduct = {
            id: cleanId,
            name,
            price,
            regular_price: regularPrice,
            category,
            size,
            benefit_line: benefitLine,
            photo: primaryPhoto,
            photos,
            video: String(item.video || '').trim() || undefined,
            in_stock: inStock,
            remaining,
            featured,
            badge: String(item.badge || '').trim() || (featured ? 'Featured' : undefined),
            ingredients: String(item.ingredients || '').trim() || undefined,
            how_to_use: String(item.how_to_use || '').trim() || undefined,
            highlights: highlights.length > 0 ? highlights : undefined,
            description: String(item.description || '').trim() || undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          validProducts.push(normalizedProduct);
        });

        resolve({
          fileName: file.name,
          fileSize: file.size,
          sheetName,
          totalRows: rawRows.length,
          validProducts,
          invalidRows,
          warnings,
          headersFound: Object.keys(headerMapping)
        });
      } catch (err) {
        console.error('File parsing error', err);
        reject(new Error(`Failed to parse file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file from disk'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 6 Realistic Sample Products for Kenyan Retail/Beauty Stores
 */
export const SAMPLE_PRODUCTS = [
  {
    'Product Name': 'Cerave Hydrating Facial Cleanser 473ml',
    'Price (KES)': 2800,
    'Regular Price (KES)': 3200,
    'Category': 'Skincare & Face',
    'In Stock': 'Yes',
    'Stock Qty': 8,
    'Size': '473ml',
    'Benefit Line': 'Cleanses, hydrates & restores protective skin barrier with 3 ceramides',
    'Badge': 'Bestseller 🌟',
    'Featured': 'Yes',
    'Photo URL': '/products/bbk-cerave-cream.jpg',
    'Video URL': '',
    'Key Highlights': 'Non-foaming lotion formula; Infused with MVE Technology; Fragrance free',
    'Ingredients': '3 Essential Ceramides (1, 3, 6-II), Hyaluronic Acid, Glycerin',
    'How To Use': 'Wet skin with lukewarm water. Massage cleanser gently into skin in circular motions. Rinse well.',
    'Description': 'Developed with dermatologists, CeraVe Hydrating Facial Cleanser is a gentle face wash with ingredients like ceramides and hyaluronic acid that work to restore the skins natural barrier.'
  },
  {
    'Product Name': 'e.l.f. Power Grip Primer with 4% Niacinamide',
    'Price (KES)': 1850,
    'Regular Price (KES)': 2200,
    'Category': 'Makeup & Prep',
    'In Stock': 'Yes',
    'Stock Qty': 10,
    'Size': '24ml',
    'Benefit Line': 'Gel-based hydrating face primer that grips makeup for 24-hour flawless wear',
    'Badge': 'Viral TikTok 🔥',
    'Featured': 'Yes',
    'Photo URL': '/products/bbk-elf-poreless.webp',
    'Video URL': '',
    'Key Highlights': 'Grips makeup for all-day wear; Infused with 4% Niacinamide; Dewy glowing finish',
    'Ingredients': '4% Niacinamide, Hyaluronic Acid, Water (Aqua), Glycerin',
    'How To Use': 'Apply evenly to face before makeup using your fingertips to pat into the skin. Wait 30 seconds before makeup.',
    'Description': 'The sticky gel primer that went viral worldwide! Formulated with 4% Niacinamide to help even out skin tone and brighten while holding onto your makeup.'
  },
  {
    'Product Name': 'Maybelline SuperStay Matte Ink Liquid Lipstick',
    'Price (KES)': 1450,
    'Regular Price (KES)': 1750,
    'Category': 'Lip Care',
    'In Stock': 'Yes',
    'Stock Qty': 15,
    'Size': '5ml',
    'Benefit Line': 'Up to 16HR saturated liquid matte wear that will not transfer or smudge',
    'Badge': 'Transfer-Proof 💄',
    'Featured': 'No',
    'Photo URL': '/products/bbk-bellazuri-lipstick.jpg',
    'Video URL': '',
    'Key Highlights': 'Up to 16HR intense wear; Precision arrow applicator; Kissproof & maskproof',
    'Ingredients': 'Dimethicone, Trimethylsiloxysilicate, Isododecane, Saturated Color Pigments',
    'How To Use': 'Step 1: Apply liquid lipstick in the center of your upper lip. Step 2: Follow the contours of your mouth.',
    'Description': 'Ink your lips in up to 16-hour saturated liquid matte. SuperStay Matte Ink features a unique arrow applicator for precise application.'
  },
  {
    'Product Name': 'Nivea Sun Protect & Moisture SPF 50+ Lotion',
    'Price (KES)': 2100,
    'Regular Price (KES)': 2400,
    'Category': 'Sunscreen & SPF',
    'In Stock': 'Yes',
    'Stock Qty': 6,
    'Size': '200ml',
    'Benefit Line': 'Immediate UVA/UVB protection with deep 48H skin moisture',
    'Badge': 'UV Shield ☀️',
    'Featured': 'No',
    'Photo URL': '/products/bbk-cetaphil-water-gel.jpg',
    'Video URL': '',
    'Key Highlights': 'Broad spectrum SPF 50+; Water resistant; Non-greasy quick absorption',
    'Ingredients': 'UVA & UVB Broad Spectrum Filters, Vitamin E, Glycerin',
    'How To Use': 'Apply generously before sun exposure and reapply frequently, especially after swimming, perspiring, or toweling.',
    'Description': 'NIVEA SUN Protect & Moisture Lotion provides immediate UV protection and 48h moisture for your skin. Water-resistant formula.'
  },
  {
    'Product Name': 'The Ordinary Niacinamide 10% + Zinc 1% High-Strength Serum',
    'Price (KES)': 1950,
    'Regular Price (KES)': 2300,
    'Category': 'Serums & Actives',
    'In Stock': 'Yes',
    'Stock Qty': 7,
    'Size': '30ml',
    'Benefit Line': 'Reduces the appearance of blemishes, enlarged pores and regulates excess sebum',
    'Badge': 'Top Pick 🧪',
    'Featured': 'Yes',
    'Photo URL': '/products/bbk-byoma-serum.jpg',
    'Video URL': '',
    'Key Highlights': '10% Niacinamide (Vitamin B3); 1% Zinc PCA; Targets breakouts & uneven texture',
    'Ingredients': 'Aqua, Niacinamide, Zinc PCA, Tamarindus Indica Seed Gum, Pentylene Glycol',
    'How To Use': 'Apply to entire face morning and evening before heavier creams.',
    'Description': 'Niacinamide 10% + Zinc 1% is a water-based serum that boosts skin brightness, improves skin smoothness and reinforces the skin barrier over time.'
  },
  {
    'Product Name': '100% Egyptian Cotton Luxury Duvet Cover Set (6x6)',
    'Price (KES)': 4800,
    'Regular Price (KES)': 5500,
    'Category': 'Household & Bedding',
    'In Stock': 'Yes',
    'Stock Qty': 4,
    'Size': '6x6 King',
    'Benefit Line': 'Ultra-soft 400 thread count breathable Egyptian cotton with 4 pillowcases',
    'Badge': '5-Star Quality 🛏️',
    'Featured': 'No',
    'Photo URL': '/products/bbk-magnesium.webp',
    'Video URL': '',
    'Key Highlights': '400 Thread Count; 1 Duvet Cover + 1 Fitted Sheet + 4 Pillowcases; Fade & wrinkle resistant',
    'Ingredients': '100% Long-Staple Egyptian Combed Cotton',
    'How To Use': 'Machine wash cold on gentle cycle. Tumble dry low or hang dry in shade.',
    'Description': 'Transform your bedroom into a luxury presidential suite. Made from 100% natural breathable long-staple cotton.'
  }
];

/**
 * Download pre-formatted Excel template (.xlsx)
 */
export function downloadSampleExcel() {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_PRODUCTS);

  // Set nice column widths
  ws['!cols'] = [
    { wch: 38 }, // Product Name
    { wch: 14 }, // Price (KES)
    { wch: 18 }, // Regular Price (KES)
    { wch: 22 }, // Category
    { wch: 10 }, // In Stock
    { wch: 12 }, // Stock Qty
    { wch: 12 }, // Size
    { wch: 50 }, // Benefit Line
    { wch: 20 }, // Badge
    { wch: 10 }, // Featured
    { wch: 32 }, // Photo URL
    { wch: 20 }, // Video URL
    { wch: 45 }, // Key Highlights
    { wch: 45 }, // Ingredients
    { wch: 50 }, // How To Use
    { wch: 60 }  // Description
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products Template');

  XLSX.writeFile(wb, 'DailyPost_Kenyan_Store_Products_Template.xlsx');
}

/**
 * Download pre-formatted CSV template (.csv)
 */
export function downloadSampleCsv() {
  const ws = XLSX.utils.json_to_sheet(SAMPLE_PRODUCTS);
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  
  // Add UTF-8 BOM so Excel opens with proper character rendering
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBrowserDownload(blob, 'DailyPost_Kenyan_Store_Products_Template.csv');
}

/**
 * Export current inventory to Excel (.xlsx)
 */
export function exportProductsToExcel(products, shopName = 'Store') {
  const rows = products.map((p) => ({
    'Product ID': p.id,
    'Product Name': p.name,
    'Price (KES)': p.price,
    'Regular Price (KES)': p.regular_price || '',
    'Category': p.category || 'General',
    'In Stock': p.in_stock ? 'Yes' : 'No',
    'Stock Qty': p.remaining ?? p.stock_qty ?? 5,
    'Size': p.size || '',
    'Benefit Line': p.benefit_line || '',
    'Badge': p.badge || '',
    'Featured': p.featured ? 'Yes' : 'No',
    'Photo URL': p.photo || (p.photos?.[0] || ''),
    'Additional Photos': Array.isArray(p.photos) && p.photos.length > 1 ? p.photos.slice(1).join(' ; ') : '',
    'Video URL': p.video || '',
    'Key Highlights': Array.isArray(p.highlights) ? p.highlights.join(' ; ') : '',
    'Ingredients': p.ingredients || '',
    'How To Use': p.how_to_use || '',
    'Description': p.description || ''
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  ws['!cols'] = [
    { wch: 22 }, // Product ID
    { wch: 38 }, // Product Name
    { wch: 14 }, // Price (KES)
    { wch: 18 }, // Regular Price (KES)
    { wch: 20 }, // Category
    { wch: 10 }, // In Stock
    { wch: 10 }, // Stock Qty
    { wch: 12 }, // Size
    { wch: 45 }, // Benefit Line
    { wch: 18 }, // Badge
    { wch: 10 }, // Featured
    { wch: 35 }, // Photo URL
    { wch: 35 }, // Additional Photos
    { wch: 25 }, // Video URL
    { wch: 40 }, // Key Highlights
    { wch: 40 }, // Ingredients
    { wch: 45 }, // How To Use
    { wch: 50 }  // Description
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  const cleanShopName = shopName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `${cleanShopName}_Products_${dateStr}.xlsx`);
}

/**
 * Export current inventory to CSV (.csv)
 */
export function exportProductsToCsv(products, shopName = 'Store') {
  const rows = products.map((p) => ({
    'Product ID': p.id,
    'Product Name': p.name,
    'Price (KES)': p.price,
    'Regular Price (KES)': p.regular_price || '',
    'Category': p.category || 'General',
    'In Stock': p.in_stock ? 'Yes' : 'No',
    'Stock Qty': p.remaining ?? p.stock_qty ?? 5,
    'Size': p.size || '',
    'Benefit Line': p.benefit_line || '',
    'Badge': p.badge || '',
    'Featured': p.featured ? 'Yes' : 'No',
    'Photo URL': p.photo || (p.photos?.[0] || ''),
    'Additional Photos': Array.isArray(p.photos) && p.photos.length > 1 ? p.photos.slice(1).join(' ; ') : '',
    'Video URL': p.video || '',
    'Key Highlights': Array.isArray(p.highlights) ? p.highlights.join(' ; ') : '',
    'Ingredients': p.ingredients || '',
    'How To Use': p.how_to_use || '',
    'Description': p.description || ''
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const csvContent = XLSX.utils.sheet_to_csv(ws);

  const cleanShopName = shopName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBrowserDownload(blob, `${cleanShopName}_Products_${dateStr}.csv`);
}

/**
 * Full Store Backup: Exports complete seller profile, products, overrides & preferences
 */
export function exportFullStoreBackup(seller, products, todayOverrides = {}, postedMap = {}) {
  const dateStr = new Date().toISOString().split('T')[0];
  const backupObject = {
    app: 'Daily Post & WhatsApp Catalogue',
    version: '1.0',
    backup_type: 'full_store_snapshot',
    exported_at: new Date().toISOString(),
    seller: {
      ...seller
    },
    products: products.map((p) => ({
      ...p,
      photos: Array.isArray(p.photos) ? p.photos : (p.photo ? [p.photo] : [])
    })),
    today_overrides: todayOverrides,
    posted_map: postedMap,
    metadata: {
      total_products: products.length,
      in_stock_count: products.filter((p) => p.in_stock).length,
      featured_count: products.filter((p) => p.featured).length,
      shop_name: seller.shop_name,
      phone: seller.phone,
      mpesa_till: seller.mpesa_till,
      palette: seller.palette
    }
  };

  const jsonString = JSON.stringify(backupObject, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const cleanShopName = (seller.shop_name || 'My_Store').replace(/[^a-zA-Z0-9_-]/g, '_');
  triggerBrowserDownload(blob, `${cleanShopName}_FullBackup_${dateStr}.json`);
}

/**
 * Validate and read a Full Store Backup JSON file
 */
export async function parseBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('File content is not valid JSON');
        }

        // Validate essentials
        const hasSeller = Boolean(parsed.seller && typeof parsed.seller === 'object' && parsed.seller.shop_name);
        const hasProducts = Boolean(Array.isArray(parsed.products));

        if (!hasSeller && !hasProducts) {
          throw new Error('This file does not appear to be a valid Daily Post store backup (missing seller or products).');
        }

        const validProducts = (parsed.products || []).filter((p) => p && p.name);

        resolve({
          isValid: true,
          seller: parsed.seller || null,
          products: validProducts,
          todayOverrides: parsed.today_overrides || {},
          postedMap: parsed.posted_map || {},
          exportedAt: parsed.exported_at || null,
          metadata: parsed.metadata || {
            shop_name: parsed.seller?.shop_name || 'Restored Shop',
            total_products: validProducts.length
          }
        });
      } catch (err) {
        reject(new Error(`Failed to read backup: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file from disk'));
    reader.readAsText(file);
  });
}

/**
 * Helper to trigger file download in browser
 */
function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
