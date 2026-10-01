/**
 * Text Utilities for Kenyan E-Commerce & Daily Post Pipeline
 * Decodes all HTML entities from scraped WooCommerce/WordPress feeds
 * and ensures safe, clean typographic rendering across canvases and captions.
 */

export function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return str === undefined ? '' : str;

  return str
    // Common HTML entities from WordPress / WooCommerce
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&#8211;/g, '–')
    .replace(/&ndash;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&mdash;/g, '—')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&trade;/g, '™')
    .replace(/&reg;/g, '®')
    .replace(/&copy;/g, '©')
    // Numeric decimal entities: &#123;
    .replace(/&#(\d+);/g, (match, dec) => {
      const code = parseInt(dec, 10);
      return !isNaN(code) ? String.fromCharCode(code) : match;
    })
    // Numeric hex entities: &#x1a;
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
      const code = parseInt(hex, 16);
      return !isNaN(code) ? String.fromCharCode(code) : match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes all user-facing text fields of a product in one clean call
 */
export function normalizeProductText(product) {
  if (!product) return null;
  const normalized = { ...product };
  if (product.name) normalized.name = decodeHtmlEntities(product.name);
  if (product.benefit_line) normalized.benefit_line = decodeHtmlEntities(product.benefit_line);
  if (product.description) normalized.description = decodeHtmlEntities(product.description);
  if (product.badge) normalized.badge = decodeHtmlEntities(product.badge);
  if (product.category) normalized.category = decodeHtmlEntities(product.category);
  if (product.size) normalized.size = decodeHtmlEntities(product.size);
  return normalized;
}

/**
 * Validates product object integrity before canvas rendering.
 * Returns { valid: boolean, errors: string[] }
 */
export function validateProductForRender(product) {
  const errors = [];
  if (!product || typeof product !== 'object') {
    return { valid: false, errors: ['Product object is null or invalid'] };
  }
  if (!product.id) {
    errors.push('Missing product ID');
  }
  if (!product.name || !String(product.name).trim()) {
    errors.push('Missing product name/title');
  }
  const photo = product.photo || (Array.isArray(product.photos) && product.photos[0]) || product.image_url;
  if (!photo || !String(photo).trim()) {
    errors.push('Missing product photo/image');
  }
  const price = Number(product.price);
  if (isNaN(price) || price <= 0) {
    errors.push('Missing or invalid price');
  }
  return {
    valid: errors.length === 0,
    errors,
    isCritical: errors.some(e => e.includes('name') || e.includes('photo') || e.includes('null'))
  };
}

