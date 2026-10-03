/**
 * Category Definitions, Ordering, and Utilities
 * Unified across Today View, Week View, Catalog View, and Products Inventory.
 */

export const CATEGORY_ORDER = [
  'All',
  'All Shoes & Kicks',
  'Sneakers & Kicks',
  "Men's Footwear",
  'Electronics',
  'Gaming Laptops & Ultrabooks',
  'Monitors & Displays',
  'Smart Tech & Audio',
  'Handbags & Bags',
  'Makeup & Prep',
  'Lip Care',
  'Skincare & Face',
  'Serums & Actives',
  'Health & Wellness',
  'Bath & Body',
  'Sunscreen & SPF',
  'Clothes & Fashion',
  'Fashion & Outfits',
  'Household & Bedding',
  'Bedding & Home',
  'Household & Kitchen'
];

/**
 * Standardized category normalization
 */
export function normalizeCategory(cat) {
  if (!cat) return 'Skincare & Face';
  let c = cat.trim();
  c = c.replace(/&amp;/g, '&');
  if (c === 'Skincare' || c === 'Korean Skincare & Serums' || c === 'Korean Skincare' || c === 'Cleanser' || c === 'Acne face' || c === 'K-Beauty' || c === 'Anti-Ageing') return 'Skincare & Face';
  if (c === 'Foundation' || c === 'Eye Mascara' || c === 'Makeup') return 'Makeup & Prep';
  if (c === 'Brightening serum') return 'Serums & Actives';
  if (c === 'Malibu') return 'Sunscreen & SPF';
  if (c === 'Hair Oil') return 'Bath & Body';
  if (c === 'Health & Wellness' || c === 'BB LAB Collagen') return 'Health & Wellness';
  if (c === 'Classic Clothes' || c === 'Clothes' || c === 'Fashion') return 'Clothes & Fashion';
  if (c === 'Household & Kitchen') return 'Household & Kitchen';
  if (c === 'Household & Bedding' || c === 'Household') return 'Household & Bedding';
  return c;
}

/**
 * Get category emoji visual icon
 */
export function getCategoryIcon(cat) {
  if (!cat) return '🛍️';
  const c = cat.trim();
  const lower = c.toLowerCase();

  if (c === 'All' || lower === 'all') return '✨';
  if (c === 'All Shoes & Kicks' || lower === 'all shoes & kicks' || lower === 'shoes') return '👟';
  if (c === 'Sneakers & Kicks' || lower.includes('sneaker') || lower.includes('kicks')) return '👟';
  if (c === "Men's Footwear" || lower.includes('footwear') || lower.includes('loafer') || lower.includes('boot')) return '👞';
  if (c === 'Electronics' || lower === 'electronics') return '⚡';
  if (lower.includes('laptop') || lower.includes('computer')) return '💻';
  if (lower.includes('monitor') || lower.includes('display')) return '🖥️';
  if (lower.includes('audio') || lower.includes('headphone') || lower.includes('soundcore')) return '🎧';
  if (c === 'Handbags & Bags' || lower.includes('bag') || lower.includes('tote') || lower.includes('clutch')) return '👜';
  if (c === 'Makeup & Prep' || lower.includes('prep') || lower.includes('makeup')) return '👑';
  if (c === 'Lip Care' || lower.includes('lip')) return '💄';
  if (c === 'Skincare & Face' || lower.includes('skin') || lower.includes('face') || lower.includes('cleanser')) return '🧴';
  if (c === 'Serums & Actives' || lower.includes('serum') || lower.includes('active')) return '🧪';
  if (c === 'Health & Wellness' || lower.includes('health') || lower.includes('wellness') || lower.includes('collagen')) return '🌿';
  if (c === 'Bath & Body' || lower.includes('bath') || lower.includes('body')) return '🌸';
  if (c === 'Sunscreen & SPF' || lower.includes('sun') || lower.includes('spf')) return '☀️';
  if (lower.includes('cloth') || lower.includes('fashion') || lower.includes('dress')) return '👗';
  if (lower.includes('household') || lower.includes('bedding') || lower.includes('home')) return '🛏️';
  if (lower.includes('kitchen') || lower.includes('flask')) return '☕';
  return '🛍️';
}

/**
 * Compute exact category statistics and sorted category chips array
 * @param {Array} products Array of product objects
 * @returns {Object} { counts: Object, categoryList: Array<{ id, label, icon, count }> }
 */
export function computeCategoryStats(products = []) {
  const counts = { All: products.length };

  products.forEach((p) => {
    const cat = normalizeCategory(p.category || 'Other');
    counts[cat] = (counts[cat] || 0) + 1;
  });

  // Calculate composite 'All Shoes & Kicks' (Sneakers & Kicks + Men's Footwear)
  const shoeCount = (counts['Sneakers & Kicks'] || 0) + (counts["Men's Footwear"] || 0);
  if (shoeCount > 0) {
    counts['All Shoes & Kicks'] = shoeCount;
  }

  // Calculate composite 'Electronics' (Gaming Laptops + Monitors + Smart Tech + Electronics)
  const electronicsCount =
    (counts['Gaming Laptops & Ultrabooks'] || 0) +
    (counts['Monitors & Displays'] || 0) +
    (counts['Smart Tech & Audio'] || 0) +
    (counts['Electronics'] || 0) +
    (counts['Electronics & Gadgets'] || 0);
  if (electronicsCount > 0) {
    counts['Electronics'] = electronicsCount;
  }

  // Build sorted list of active categories
  const activeKeys = Object.keys(counts).filter((k) => counts[k] > 0);

  activeKeys.sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    const orderA = idxA === -1 ? 99 : idxA;
    const orderB = idxB === -1 ? 99 : idxB;
    return orderA - orderB;
  });

  const categoryList = activeKeys.map((catKey) => ({
    id: catKey === 'All' ? 'all' : catKey,
    rawKey: catKey,
    label: catKey,
    icon: getCategoryIcon(catKey),
    count: counts[catKey]
  }));

  return { counts, categoryList };
}

/**
 * Robust Category Filter for Products
 * @param {Array} products Array of product objects
 * @param {String} categoryFilter Selected category ('all', 'All Shoes & Kicks', 'Sneakers & Kicks', etc.)
 * @returns {Array} Filtered products array
 */
export function filterProductsByCategory(products = [], categoryFilter = 'all') {
  if (!products || products.length === 0) return [];
  const filter = (categoryFilter || 'all').trim();
  const filterLower = filter.toLowerCase();

  if (filter === 'all' || filter === 'All') {
    return products;
  }

  if (
    filter === 'All Shoes & Kicks' ||
    filter === 'shoes' ||
    filterLower === 'all shoes & kicks' ||
    filterLower === 'shoes' ||
    filterLower === 'all shoes'
  ) {
    return products.filter((p) => {
      const cat = p.category || '';
      return (
        cat === 'Sneakers & Kicks' ||
        cat === "Men's Footwear" ||
        cat.toLowerCase().includes('shoe') ||
        cat.toLowerCase().includes('footwear') ||
        cat.toLowerCase().includes('loafer') ||
        cat.toLowerCase().includes('sneaker') ||
        cat.toLowerCase().includes('kicks')
      );
    });
  }

  if (filter === 'Electronics' || filterLower === 'electronics' || filterLower === 'tech') {
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return (
        cat.includes('electronic') ||
        cat.includes('laptop') ||
        cat.includes('monitor') ||
        cat.includes('audio') ||
        cat.includes('tech') ||
        cat.includes('gadget')
      );
    });
  }

  if (
    filter === 'Handbags & Bags' ||
    filter === 'bags' ||
    filterLower === 'handbags & bags' ||
    filterLower === 'bags'
  ) {
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return (
        cat.includes('bag') ||
        cat.includes('tote') ||
        cat.includes('crossbody') ||
        cat.includes('clutch') ||
        cat.includes('purse')
      );
    });
  }

  if (filter === 'beauty' || filterLower === 'beauty & skincare' || filterLower === 'beauty') {
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return (
        cat.includes('beauty') ||
        cat.includes('skin') ||
        cat.includes('lip') ||
        cat.includes('face') ||
        cat.includes('serum') ||
        cat.includes('prep') ||
        cat.includes('makeup') ||
        cat.includes('bath') ||
        cat.includes('body') ||
        cat.includes('sun') ||
        cat.includes('spf') ||
        cat.includes('loreal') ||
        cat.includes('garnier') ||
        cat.includes('hair') ||
        cat.includes('cleanser') ||
        cat.includes('collagen')
      );
    });
  }

  if (
    filter === 'household' ||
    filterLower === 'household & bedding' ||
    filterLower === 'bedding & home'
  ) {
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return (
        cat.includes('household') ||
        cat.includes('bedding') ||
        cat.includes('curtain') ||
        cat.includes('duvet') ||
        cat.includes('carpet') ||
        cat.includes('flask') ||
        cat.includes('kitchen')
      );
    });
  }

  if (
    filter === 'clothes' ||
    filterLower === 'clothes & fashion' ||
    filterLower === 'fashion & outfits'
  ) {
    return products.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return (
        cat.includes('cloth') ||
        cat.includes('fashion') ||
        cat.includes('dress') ||
        cat.includes('apparel') ||
        cat.includes('outfit')
      );
    });
  }

  // Granular / exact category matching
  return products.filter((p) => {
    const rawCat = p.category || '';
    const norm = normalizeCategory(rawCat);
    return (
      rawCat === filter ||
      norm === filter ||
      rawCat.toLowerCase() === filterLower ||
      norm.toLowerCase() === filterLower
    );
  });
}
