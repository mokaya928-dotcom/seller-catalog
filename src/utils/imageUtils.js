/**
 * Image Utilities & Category Fallback Pools
 * Provides CORS-safe image proxies and fallback reference images
 * so that 100% of products always have at least 3 reference photos for posters.
 */

export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== 'string') return '/products/bbk-vaseline-lip.jpg';
  if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (typeof window !== 'undefined' && url.startsWith(window.location.origin)) {
    return url;
  }
  if (url.includes('images.weserv.nl')) {
    return url;
  }
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
}

export const CATEGORY_COMPANIONS = {
  'Makeup & Prep': [
    '/products/bbk-milani-spray.jpg',
    '/products/bbk-sheglam-palette.jpg',
    '/products/bbk-maybelline-fitme.jpg',
    '/products/bbk-elf-poreless.webp'
  ],
  'Lip Care': [
    '/products/bbk-milani-fruit-oil.jpg',
    '/products/bbk-saltair-lip-oil.jpg',
    '/products/bbk-eos-balm.jpg',
    '/products/bbk-vaseline-lip.jpg',
    '/products/bbk-vaseline-shimmer.jpg'
  ],
  'Bath & Body': [
    '/products/bbk-treehut-mist.jpg',
    '/products/hb-body-wash.webp',
    '/products/hb-aloe-soap.webp'
  ],
  'Sunscreen & SPF': [
    '/products/bbk-teca-sunscreen.jpg',
    '/products/bbk-cerave-cream.jpg'
  ],
  'Skincare & Face': [
    '/products/bbk-cerave-cream.jpg',
    '/products/bbk-cetaphil-water-gel.jpg',
    '/products/bbk-cliganic-rosehip.jpg'
  ],
  'Skincare': [
    '/products/bbk-cerave-cream.jpg',
    '/products/bbk-cetaphil-water-gel.jpg',
    '/products/bbk-cliganic-rosehip.jpg'
  ],
  'Serums & Actives': [
    '/products/bbk-byoma-serum.jpg',
    '/products/bbk-timeless-serum.webp',
    '/products/bbk-minimalist-retinol.jpg',
    '/products/bbk-neutrogena-serum.webp'
  ],
  'Handbags': [
    '/products/glownd/glownd_777.png',
    '/products/glownd/glownd_778.png',
    '/products/glownd/glownd_783.png',
    '/products/glownd/glownd_806.png'
  ],
  'Household & Kitchen': [
    '/products/moh-thermal-flask.jpg',
    '/products/moh-fluffy-carpet.jpg',
    '/products/moh-curtains.jpg'
  ],
  'Fashion': [
    '/products/moh-bomber-jacket.jpg',
    '/products/moh-womens-dress.jpg',
    '/products/moh-khaki-pants.jpg'
  ]
};

export const DEFAULT_FALLBACK_PHOTOS = [
  '/products/bbk-vaseline-lip.jpg',
  '/products/bbk-cerave-cream.jpg',
  '/products/bbk-elf-brightening.webp'
];

/**
 * Returns authentic photos belonging strictly to this product.
 * Never pollutes single-product flyer pools with unrelated companion or category items.
 */
export function getProductPhotosPool(product) {
  if (!product) return [];
  const list = Array.isArray(product.photos) && product.photos.length > 0
    ? product.photos
    : (product.photo ? [product.photo] : (product.image_url ? [product.image_url] : []));
  const unique = Array.from(new Set(list.filter(Boolean)));
  return unique.length > 0 ? unique : (product.photo ? [product.photo] : []);
}
