/**
 * Smart Search Engine for Beauty Bar Kenya & Kenyan Retail Catalog
 * 
 * Features:
 * 1. Multi-token (word-order independent) semantic matching
 * 2. Kenyan beauty concerns & ingredients synonym dictionary (e.g. "glow" -> Vitamin C, Brightening; "pimples" -> Salicylic Acid)
 * 3. Natural language price & intent extraction ("under 1500", "below 2k", "deals", "video demo")
 * 4. Typo tolerance & fuzzy distance matching ("smar search", "sunscren", "cerve", "vasline")
 * 5. Transparent "Did you mean?" suggestions and reason badges
 */

// Popular high-intent Smart Search presets
export const SMART_PRESETS = [
  { id: 'under1500', label: 'Under 1.5K', query: 'under 1500', icon: '⚡', color: 'emerald' },
  { id: 'under3000', label: 'Under 3K', query: 'under 3000', icon: '💰', color: 'emerald' },
  { id: 'vitc', label: 'Vitamin C Glow', query: 'vitamin c glow', icon: '🍊', color: 'amber' },
  { id: 'acne', label: 'Acne & Blemish', query: 'acne salicylic', icon: '🎯', color: 'rose' },
  { id: 'spf', label: 'Sunscreen SPF', query: 'sunscreen spf', icon: '☀️', color: 'amber' },
  { id: 'retinol', label: 'Retinol & Age', query: 'retinol', icon: '✨', color: 'purple' },
  { id: 'cerave', label: 'CeraVe Skin', query: 'cerave', icon: '🧴', color: 'blue' },
  { id: 'lipcare', label: 'Lip Balms', query: 'lip balm therapy', icon: '💄', color: 'pink' },
  { id: 'primers', label: 'e.l.f. Primers', query: 'elf primer', icon: '👑', color: 'emerald' },
  { id: 'offers', label: 'Offers & Deals', query: 'offers', icon: '🔥', color: 'amber' },
  { id: 'household', label: 'Bedding & Home', query: 'bedding household', icon: '🛏️', color: 'teal' },
  { id: 'clothes', label: 'Dresses & Clothes', query: 'dress clothes', icon: '👗', color: 'pink' }
];

// Canonical beauty and retail vocabulary for spell checking & fuzzy suggestions
const VOCABULARY = [
  'smart', 'search', 'sunscreen', 'primer', 'vaseline', 'cerave', 'maybelline',
  'sheglam', 'serum', 'retinol', 'niacinamide', 'hyaluronic', 'salicylic',
  'vitamin', 'vit c', 'concealer', 'cleanser', 'moisturizer', 'eyeshadow',
  'lipstick', 'lotion', 'duvet', 'bedding', 'dress', 'powder', 'squalane',
  'spf', 'glow', 'acne', 'brightening', 'hydrate', 'facial', 'essence',
  'pores', 'matte', 'collagen', 'cream', 'scrub', 'foundation', 'toner'
];

// Common typo corrections map
const COMMON_TYPOS = {
  'smar': 'smart',
  'smarr': 'smart',
  'sunscren': 'sunscreen',
  'suncreen': 'sunscreen',
  'sunblock': 'sunscreen',
  'suncreem': 'sunscreen',
  'cerve': 'cerave',
  'ceravee': 'cerave',
  'vasline': 'vaseline',
  'vaselin': 'vaseline',
  'maybeline': 'maybelline',
  'mabeline': 'maybelline',
  'sheglme': 'sheglam',
  'sheglam': 'sheglam',
  'retnol': 'retinol',
  'ritinol': 'retinol',
  'niacinmid': 'niacinamide',
  'niaciamide': 'niacinamide',
  'hyalronic': 'hyaluronic',
  'hyaloronic': 'hyaluronic',
  'salicilic': 'salicylic',
  'salicylic': 'salicylic',
  'primr': 'primer',
  'primar': 'primer',
  'conceler': 'concealer',
  'conclear': 'concealer',
  'moisturiser': 'moisturizer',
  'moisturzer': 'moisturizer',
  'lipstic': 'lipstick',
  'lipgloss': 'lip gloss',
  'vitaminc': 'vitamin c',
  'duvets': 'duvet',
  'bedsheets': 'bedding',
  'clothes': 'clothes'
};

// Kenyan shopper concerns, ingredients, & shopping synonyms
const SYNONYM_MAP = {
  glow: ['vitamin c', 'brightening', 'radiance', 'glow', 'squalane', 'niacinamide', 'illuminating'],
  radiance: ['vitamin c', 'brightening', 'radiance', 'glow', 'squalane'],
  brightening: ['vitamin c', 'brightening', 'radiant', 'glow', 'niacinamide', 'kojic'],
  dull: ['vitamin c', 'brightening', 'exfoliating', 'glow', 'radiance'],
  
  acne: ['salicylic', 'salicylic acid', 'blemish', 'spot rescue', 'acne', 'tea tree', 'bha', 'poreless', 'cleanser'],
  pimple: ['salicylic', 'salicylic acid', 'blemish', 'spot rescue', 'acne', 'tea tree', 'cleanser'],
  pimples: ['salicylic', 'salicylic acid', 'blemish', 'spot rescue', 'acne', 'tea tree', 'cleanser'],
  breakout: ['salicylic', 'salicylic acid', 'blemish', 'acne', 'spot rescue'],
  breakouts: ['salicylic', 'salicylic acid', 'blemish', 'acne', 'spot rescue'],
  blemish: ['salicylic', 'salicylic acid', 'blemish', 'spot rescue', 'acne', 'niacinamide'],
  
  'dark spot': ['vitamin c', 'brightening', 'spot rescue', 'kojic', 'alpha arbutin', 'tranexamic', 'niacinamide'],
  'dark spots': ['vitamin c', 'brightening', 'spot rescue', 'kojic', 'alpha arbutin', 'tranexamic', 'niacinamide'],
  hyperpigmentation: ['vitamin c', 'brightening', 'spot rescue', 'kojic', 'alpha arbutin', 'tranexamic'],
  pigmentation: ['vitamin c', 'brightening', 'spot rescue', 'kojic', 'alpha arbutin'],
  scars: ['vitamin c', 'brightening', 'spot rescue', 'retinol', 'rosehip'],
  
  dry: ['hyaluronic', 'hyaluronic acid', 'ceramide', 'glycerin', 'vaseline', 'squalane', 'moisturizer', 'hydrating', 'moisture'],
  hydration: ['hyaluronic', 'hyaluronic acid', 'ceramide', 'glycerin', 'vaseline', 'squalane', 'hydrating', 'moisture'],
  hydrate: ['hyaluronic', 'hyaluronic acid', 'ceramide', 'glycerin', 'squalane', 'hydrating', 'moisture'],
  moisture: ['hyaluronic', 'ceramide', 'glycerin', 'vaseline', 'squalane', 'moisturizer', 'hydrating'],
  
  sun: ['sunscreen', 'spf', 'sunblock', 'uv protection', 'broad spectrum'],
  sunscreen: ['sunscreen', 'spf', 'sunblock', 'sun shield'],
  sunblock: ['sunscreen', 'spf', 'sunblock'],
  spf: ['sunscreen', 'spf', 'sunblock'],
  
  wrinkles: ['retinol', 'collagen', 'peptide', 'firming', 'anti-aging'],
  aging: ['retinol', 'collagen', 'peptide', 'firming', 'anti-aging'],
  'anti aging': ['retinol', 'collagen', 'peptide', 'firming', 'anti-aging'],
  mature: ['retinol', 'collagen', 'peptide', 'firming', 'anti-aging'],
  
  pores: ['poreless', 'pores', 'matte', 'niacinamide', 'squalane', 'primer', 'salicylic'],
  oily: ['matte', 'mattifying', 'poreless', 'niacinamide', 'salicylic', 'pores', 'oil-free'],
  shine: ['matte', 'mattifying', 'poreless', 'primer', 'oil-free'],
  
  lip: ['lip', 'lip balm', 'vaseline lip', 'butter', 'gloss', 'lip care'],
  
  bag: ['bag', 'handbag', 'tote', 'crossbody', 'shoulder bag', 'clutch', 'croc', 'baguette'],
  bags: ['bag', 'handbag', 'tote', 'crossbody', 'shoulder bag', 'clutch', 'croc', 'baguette'],
  handbag: ['handbag', 'bag', 'tote', 'crossbody', 'shoulder bag', 'clutch'],
  handbags: ['handbag', 'bag', 'tote', 'crossbody', 'shoulder bag', 'clutch'],
  tote: ['tote', 'tote bag', 'shoulder bag', 'handbag'],
  crossbody: ['crossbody', 'crossbody bag', 'shoulder bag', 'mini bag'],
  shoulder: ['shoulder bag', 'handbag', 'tote', 'crossbody'],
  clutch: ['clutch', 'clasp', 'evening bag', 'mini bag'],
  croc: ['croc', 'crocodile', 'textured', 'luxury croc'],
  lips: ['lip', 'lip balm', 'vaseline lip', 'butter', 'gloss', 'lip care'],
  lipbalm: ['lip balm', 'lip', 'vaseline lip', 'butter'],
  
  primer: ['primer', 'elf', 'putty', 'poreless', 'prep', 'base'],
  elf: ['e.l.f.', 'elf', 'primer', 'putty', 'poreless', 'brightening'],
  
  bedding: ['bedding', 'duvet', 'sheets', 'bed', 'pillow', 'household'],
  duvet: ['duvet', 'bedding', 'sheets', 'bed', 'household'],
  kitchen: ['kitchen', 'household', 'flask', 'cooker', 'pot', 'pan'],
  clothes: ['classic clothes', 'dress', 'fashion', 'outfit', 'clothes', 'clothing'],
  dress: ['classic clothes', 'dress', 'fashion', 'outfit', 'clothes']
};

/**
 * Checks whether a text field matches a keyword with word-boundary awareness
 */
export function fieldMatchesKeyword(field = '', kw = '') {
  if (!field || !kw) return false;
  if (kw.length <= 3) {
    // For short words (e.g. 'uv', 'spf', 'bed'), ensure it matches at a word boundary
    // to avoid 'uv' falsely matching 'duvet'
    const regex = new RegExp(`(?:^|\\s)${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$|[0-9])`, 'i');
    return regex.test(field);
  }
  return field.includes(kw);
}

/**
 * Clean & normalize a string (strip punctuation, lower-case, uniform spaces)
 */
export function normalizeText(str = '') {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Standard Levenshtein Distance for typo tolerance
 */
export function levenshteinDistance(s1, s2) {
  if (!s1 || !s2) return (s1 || '').length + (s2 || '').length;
  if (s1 === s2) return 0;
  
  const m = s1.length;
  const n = s2.length;
  
  // Quick length cutoff
  if (Math.abs(m - n) > 2) return 99;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Extract natural language intent & price filters from raw search query
 * Examples:
 * - "under 1500" -> { maxPrice: 1500, cleanQuery: "" }
 * - "under 2k sunscreen" -> { maxPrice: 2000, cleanQuery: "sunscreen" }
 * - "< 3000" -> { maxPrice: 3000, cleanQuery: "" }
 * - "offers" / "on sale" -> { onlyOffers: true, cleanQuery: "" }
 * - "video demo" -> { onlyVideo: true, cleanQuery: "" }
 */
export function parseNaturalLanguageQuery(rawQuery = '') {
  let text = rawQuery.trim().toLowerCase();
  const filters = {
    maxPrice: null,
    minPrice: null,
    onlyOffers: false,
    onlyVideo: false,
    cleanQuery: ''
  };

  if (!text) return filters;

  // 1. Detect Price Constraints: e.g. "under 1500", "under 1.5k", "< 2000", "below 3000", "less than 2500"
  const underPriceRegex = /(?:under|below|less\s+than|max|<|<=)\s*(?:kes|ksh)?\s*(\d+(?:\.\d+)?)\s*(k|k\s+shilling|kes|ksh)?/i;
  const underMatch = text.match(underPriceRegex);
  if (underMatch) {
    let num = parseFloat(underMatch[1]);
    if (underMatch[2] && underMatch[2].toLowerCase().startsWith('k')) {
      num *= 1000;
    }
    filters.maxPrice = num;
    text = text.replace(underMatch[0], ' ');
  }

  // Detect Above Constraints: e.g. "above 2000", "> 1500", "over 2000", "min 2000"
  const abovePriceRegex = /(?:above|over|more\s+than|min|>|>=)\s*(?:kes|ksh)?\s*(\d+(?:\.\d+)?)\s*(k|k\s+shilling|kes|ksh)?/i;
  const aboveMatch = text.match(abovePriceRegex);
  if (aboveMatch) {
    let num = parseFloat(aboveMatch[1]);
    if (aboveMatch[2] && aboveMatch[2].toLowerCase().startsWith('k')) {
      num *= 1000;
    }
    filters.minPrice = num;
    text = text.replace(aboveMatch[0], ' ');
  }

  // 2. Detect Offers/Deals intent
  if (/\b(offer|offers|sale|discount|deal|deals|cheapest|cheap|budget|affordable)\b/i.test(text)) {
    filters.onlyOffers = true;
    text = text.replace(/\b(offer|offers|sale|discount|deal|deals)\b/gi, ' ');
  }

  // 3. Detect Video Demo intent
  if (/\b(video|demo|clip|watch)\b/i.test(text)) {
    filters.onlyVideo = true;
    text = text.replace(/\b(video|demo|clip|watch)\b/gi, ' ');
  }

  // Clean trailing spaces
  filters.cleanQuery = normalizeText(text);
  return filters;
}

/**
 * Suggest spelling corrections / "Did you mean?"
 */
export function getTypoSuggestion(rawQuery = '') {
  const norm = normalizeText(rawQuery);
  if (!norm) return null;

  // Direct special cases like "smar search"
  if (norm.startsWith('smar') && (norm.includes('search') || norm.length <= 5)) {
    return 'smart search';
  }

  const words = norm.split(' ');
  let wasCorrected = false;
  const correctedWords = words.map((word) => {
    if (COMMON_TYPOS[word]) {
      wasCorrected = true;
      return COMMON_TYPOS[word];
    }
    
    // Check against vocabulary if word is at least 4 letters
    if (word.length >= 4) {
      for (const vocab of VOCABULARY) {
        if (word !== vocab && levenshteinDistance(word, vocab) <= 2) {
          wasCorrected = true;
          return vocab;
        }
      }
    }
    return word;
  });

  if (wasCorrected) {
    const suggested = correctedWords.join(' ');
    return suggested !== norm ? suggested : null;
  }

  return null;
}

/**
 * Expand query tokens with synonyms
 */
function expandTokensWithSynonyms(tokens) {
  const expanded = new Set(tokens);
  
  tokens.forEach((t) => {
    // Check direct word synonym
    if (SYNONYM_MAP[t]) {
      SYNONYM_MAP[t].forEach((syn) => expanded.add(syn));
    }
    // Check 2-word combinations
    for (const [key, synList] of Object.entries(SYNONYM_MAP)) {
      if (t === key || t.includes(key)) {
        synList.forEach((syn) => expanded.add(syn));
      }
    }
  });

  return Array.from(expanded);
}

/**
 * Execute Smart Search across a product array
 * 
 * @param {Array} products - List of product items
 * @param {string} rawQuery - Shopper's search query (e.g. "smar search", "under 1500 sunscreen", "vit c glow")
 * @param {Object} options - { selectedCategory, priceFilter, sortBy }
 * @returns {Object} - { results: Array, didYouMean: string|null, detectedFilters: Object, totalMatches: number }
 */
export function executeSmartSearch(products = [], rawQuery = '', options = {}) {
  const {
    selectedCategory = 'All',
    priceFilter = 'all', // 'all' | 'under1500' | 'under3000' | 'offers'
    sortBy = 'featured'
  } = options;

  const parsed = parseNaturalLanguageQuery(rawQuery);
  const didYouMean = getTypoSuggestion(rawQuery);
  
  // Use cleanQuery if present, otherwise fall back to raw
  let queryText = parsed.cleanQuery || '';
  
  // If user searched "smar search" or "smart search", treat as showcase of featured top items with video & offers
  const isSmartSearchKeyword = queryText === 'smar search' || queryText === 'smart search' || queryText === 'smart';

  // Normalize tokens
  const baseTokens = queryText ? queryText.split(' ').filter(Boolean) : [];
  const expandedTokens = expandTokensWithSynonyms(baseTokens);

  const scoredProducts = [];

  for (const product of products) {
    // 1. In-stock check (storefront only evaluates available items)
    if (options.inStockOnly !== false && product.in_stock === false) {
      continue;
    }

    // 2. Category Check
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else {
      matchesCategory = (product.category || 'Beauty Care') === selectedCategory;
    }

    if (!matchesCategory) continue;

    // 3. Price Filter Check
    const price = Number(product.price) || 0;
    let matchesPrice = true;

    // UI Pill Price Filter
    if (priceFilter === 'under1500' && price > 1500) matchesPrice = false;
    if (priceFilter === 'under3000' && (price <= 1500 || price > 3000)) matchesPrice = false;
    if (priceFilter === 'few_left') {
      const rem = typeof product.remaining === 'number' ? product.remaining : (((product.id || '').charCodeAt(0) || 7) % 4 + 2);
      if (rem > 4) matchesPrice = false;
    }
    if (priceFilter === 'offers') {
      const isOffer = Boolean(product.badge && product.badge.includes('Offer')) || Boolean(product.regular_price && product.regular_price > price);
      if (!isOffer) matchesPrice = false;
    }

    // Natural Language Extracted Price Constraints
    if (parsed.maxPrice !== null && price > parsed.maxPrice) matchesPrice = false;
    if (parsed.minPrice !== null && price < parsed.minPrice) matchesPrice = false;
    if (parsed.onlyOffers) {
      const hasOffer = Boolean(product.badge && (product.badge.includes('Offer') || product.badge.includes('Flash') || product.badge.includes('100%'))) ||
                       Boolean(product.regular_price && product.regular_price > price);
      if (!hasOffer && !product.featured) matchesPrice = false;
    }
    if (parsed.onlyVideo && !product.video) {
      matchesPrice = false;
    }

    if (!matchesPrice) continue;

    // 4. Text Scoring & Match Reason Determination
    let score = 0;
    const matchReasons = [];

    if (isSmartSearchKeyword) {
      // Smart search keyword showcase: featured, video demos, bundles, bestsellers
      score = 50;
      if (product.featured) { score += 40; matchReasons.push('⭐ Featured Selection'); }
      if (product.video) { score += 30; matchReasons.push('🎥 Video Demo'); }
      if (product.regular_price && product.regular_price > price) { score += 20; matchReasons.push('🔥 Discount Offer'); }
      if (product.ingredients) { score += 10; }
    } else if (baseTokens.length > 0) {
      // Prepare normalized searchable text fields
      const normName = normalizeText(product.name || '');
      const normBenefit = normalizeText(product.benefit_line || '');
      const normCat = normalizeText(product.category || '');
      const normDesc = normalizeText(product.description || '');
      const normIngredients = normalizeText(product.ingredients || '');
      const normHighlights = normalizeText((product.highlights || []).join(' '));
      const normBadge = normalizeText(product.badge || '');

      let matchedBaseTokens = 0;
      let matchedExpandedTokens = 0;

      for (const token of baseTokens) {
        // Special case: "elf" matches "e.l.f."
        const isElf = token === 'elf' && (normName.includes('e l f') || normName.includes('elf'));

        if (fieldMatchesKeyword(normName, token) || isElf) {
          score += 60;
          matchedBaseTokens++;
          if (!matchReasons.includes('Matched Title')) matchReasons.push('Title Match');
        } else if (fieldMatchesKeyword(normBenefit, token)) {
          score += 35;
          matchedBaseTokens++;
          if (!matchReasons.includes('Key Benefit')) matchReasons.push('Key Benefit');
        } else if (fieldMatchesKeyword(normCat, token)) {
          score += 25;
          matchedBaseTokens++;
        } else if (fieldMatchesKeyword(normIngredients, token)) {
          score += 30;
          matchedBaseTokens++;
          matchReasons.push(`Active: ${token.toUpperCase()}`);
        } else if (fieldMatchesKeyword(normHighlights, token)) {
          score += 20;
          matchedBaseTokens++;
        } else if (fieldMatchesKeyword(normDesc, token)) {
          score += 15;
          matchedBaseTokens++;
        } else if (fieldMatchesKeyword(normBadge, token)) {
          score += 20;
          matchedBaseTokens++;
        }
      }

      // Check expanded synonyms if base tokens didn't match or to boost semantic relevance
      for (const syn of expandedTokens) {
        if (!baseTokens.includes(syn)) {
          if (
            fieldMatchesKeyword(normName, syn) ||
            fieldMatchesKeyword(normBenefit, syn) ||
            fieldMatchesKeyword(normIngredients, syn) ||
            fieldMatchesKeyword(normDesc, syn)
          ) {
            score += 20;
            matchedExpandedTokens++;
            if (matchReasons.length < 2) {
              matchReasons.push(`Matched: ${syn}`);
            }
          }
        }
      }

      // Exact full query match bonus
      if (normName.includes(queryText)) {
        score += 80;
      }

      // If user typed multi-tokens, we require that at least 1 base token or strong expanded synonym matched
      const hasMatch = matchedBaseTokens > 0 || (matchedExpandedTokens > 0 && score >= 20);

      // Fuzzy backup: if 0 matches and user typed a word, check if fuzzy suggestion matches
      if (!hasMatch && didYouMean) {
        const fuzzyTokens = didYouMean.split(' ');
        for (const ft of fuzzyTokens) {
          if (normName.includes(ft) || normBenefit.includes(ft) || normIngredients.includes(ft)) {
            score += 25;
            matchReasons.push(`Fuzzy: ${ft}`);
            break;
          }
        }
      }

      if (score === 0) {
        continue; // No match for this query
      }
    } else {
      // Empty query: base score
      score = 10;
    }

    // Attribute boosters
    if (product.featured) score += 15;
    if (product.video) score += 10;
    if (parsed.maxPrice !== null && price <= parsed.maxPrice) {
      matchReasons.push(`Under KES ${parsed.maxPrice.toLocaleString()}`);
    }

    scoredProducts.push({
      product,
      score,
      matchReasons: Array.from(new Set(matchReasons)).slice(0, 2)
    });
  }

  // 5. Sorting
  scoredProducts.sort((a, b) => {
    if (sortBy === 'price_asc') return Number(a.product.price) - Number(b.product.price);
    if (sortBy === 'price_desc') return Number(b.product.price) - Number(a.product.price);
    if (sortBy === 'name_asc') return a.product.name.localeCompare(b.product.name);

    // If there is an active search query, rank primarily by relevance score
    if (queryText && !isSmartSearchKeyword) {
      if (b.score !== a.score) return b.score - a.score;
    }

    // Featured items first
    if (a.product.featured && !b.product.featured) return -1;
    if (!a.product.featured && b.product.featured) return 1;

    // Highest score next
    if (b.score !== a.score) return b.score - a.score;

    return products.indexOf(a.product) - products.indexOf(b.product);
  });

  return {
    results: scoredProducts.map((sp) => ({
      ...sp.product,
      _searchScore: sp.score,
      _matchReasons: sp.matchReasons
    })),
    didYouMean,
    detectedFilters: parsed,
    totalMatches: scoredProducts.length
  };
}
