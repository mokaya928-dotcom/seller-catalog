/**
 * Production-Grade Master Canvas Renderer
 * 
 * High-Converting Commercial Flyer Templates for Kenyan WhatsApp Status & Groups:
 * 1. Brand Master ('unified_brand'): High-impact retail layout with category pill & offer container
 * 2. Flash Sales ('flash_sale'): High-urgency deal with strikethrough price, savings pill & countdown ribbon
 * 3. Customer Reviews ('customer_reviews'): Top customer rating, verified buyer quote bubble & social proof
 * 4. Product Bundles ('product_bundles'): 2-in-1 routine combo with side-by-side showcase & bundle discount
 * 5. Restock Alerts ('restock_alerts'): Fresh batch announcement with scarcity meter ("Only X left")
 * 
 * Design Standards:
 * - Clean, bold, authentic retail store typography (NO AI sparkle stars or emoji clutter).
 * - Full 1080x1920 (Status 9:16) and 1080x1350 (Group 4:5) canvas support without distortion.
 * - Product images auto-trimmed with bounds detection to fill card big and sharp.
 * - 2-color brand architecture: Option A (Emerald & Gold) vs Option B (Luxury Slate & Gold).
 * - Straight edges with rounded corners only. No slanted cuts.
 * - Titles wrap up to 2 lines cleanly without ellipsis "...".
 * - Price is prominently displayed in dedicated high-impact container.
 * - WhatsApp number & Lipa na M-Pesa till clearly stated in footer.
 */

import { resolveSellerConfig, resolvePalette as dynamicResolvePalette, ensureBrandFontLoaded, SUPPORTED_BRAND_FONTS, STATIC_PALETTES, PRIMARY_PALETTES } from './configService.js';
import { decodeHtmlEntities, normalizeProductText, validateProductForRender } from '../utils/textUtils.js';
import { CATEGORY_SKIN_RENDERERS, detectCategorySkin } from './categorySkinRenderer.js';
import {
  roundRect,
  drawLeftAlignedWrappedTitle,
  drawArchCard,
  drawCircularSeal,
  drawBarcodeGraphic,
  drawWashiTape,
  drawCornerCrosshairs,
  drawScarcityMeter,
  drawSizeSelectorStrip,
  drawSpeechBubble,
  drawStarburst,
  drawEditorialBorder
} from '../utils/canvasDesignHelpers.js';

function loadImage(src, timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);

    let targetSrc = src;
    const isHttp = typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'));
    const isSameOrigin = typeof window !== 'undefined' && isHttp && src.startsWith(window.location.origin);

    if (isHttp && !isSameOrigin && !src.includes('images.weserv.nl')) {
      targetSrc = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        console.warn(`Image load timed out: ${src}`);
        resolve(null);
      }
    }, timeoutMs);

    const finish = (result) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(result);
      }
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => finish(img);

    img.onerror = () => {
      // If CORS proxy failed, attempt direct load as fallback
      if (targetSrc !== src && !settled) {
        const directImg = new Image();
        directImg.crossOrigin = 'anonymous';
        directImg.onload = () => finish(directImg);
        directImg.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          finish(null);
        };
        directImg.src = src;
        return;
      }
      console.warn(`Failed to load image at: ${src}`);
      finish(null);
    };

    img.src = targetSrc;
  });
}

/**
 * Robust image loader for canvas: Loads candidate photo,
 * and if unavailable falls back to alternate photos so the flyer never has an empty void.
 */
async function loadProductImage(product, primarySrc) {
  const candidate = primarySrc || product?.photo || product?.image_url;
  let img = await loadImage(candidate);
  if (img) return img;

  // Fallback 1: Try alternate photos in product.photos
  if (Array.isArray(product?.photos)) {
    for (const alt of product.photos) {
      if (alt && alt !== candidate) {
        img = await loadImage(alt);
        if (img) return img;
      }
    }
  }

  // Fallback 2: Try product.image_url
  if (product?.image_url && product.image_url !== candidate) {
    img = await loadImage(product.image_url);
    if (img) return img;
  }

  // Fallback 3: Reliable local fallback image
  return await loadImage('/products/bbk-vaseline-lip.jpg');
}


/**
 * Auto-detect actual product bounding box to trim excessive white/empty margins.
 */
function getProductBounds(img) {
  try {
    const canvas = document.createElement('canvas');
    const sampleW = Math.min(img.width, 320);
    const sampleH = Math.round((img.height * sampleW) / img.width);
    if (!sampleW || !sampleH) {
      return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
    }

    canvas.width = sampleW;
    canvas.height = sampleH;
    const sCtx = canvas.getContext('2d');
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(img, 0, 0, sampleW, sampleH);

    const imgData = sCtx.getImageData(0, 0, sampleW, sampleH).data;

    const cornerR = imgData[0];
    const cornerG = imgData[1];
    const cornerB = imgData[2];

    let minX = sampleW, maxX = 0, minY = sampleH, maxY = 0;
    let nonBgCount = 0;

    for (let y = 0; y < sampleH; y++) {
      for (let x = 0; x < sampleW; x++) {
        const idx = (y * sampleW + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];

        if (a < 20) continue;

        const isCornerBg = (
          Math.abs(r - cornerR) < 18 &&
          Math.abs(g - cornerG) < 18 &&
          Math.abs(b - cornerB) < 18
        );
        const isWhiteBg = (r > 246 && g > 246 && b > 246);

        if (!isCornerBg && !isWhiteBg) {
          nonBgCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    if (nonBgCount < 100 || contentW < 30 || contentH < 30) {
      return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
    }

    const scaleX = img.width / sampleW;
    const scaleY = img.height / sampleH;
    const padW = Math.round(contentW * 0.04);
    const padH = Math.round(contentH * 0.04);

    const cropX = Math.max(0, Math.round((minX - padW) * scaleX));
    const cropY = Math.max(0, Math.round((minY - padH) * scaleY));
    const cropW = Math.min(img.width - cropX, Math.round((contentW + padW * 2) * scaleX));
    const cropH = Math.min(img.height - cropY, Math.round((contentH + padH * 2) * scaleY));

    return { sx: cropX, sy: cropY, sWidth: cropW, sHeight: cropH };
  } catch {
    return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
  }
}

/**
 * Defensive Title Wrapper that decodes entities, auto-wraps, and respects caller color/fonts
 */
function drawWrappedTitleWithoutTruncation(ctx, text, centerX, startY, maxWidth, initialSize, minSize = 18, textColor = null, targetFontFamily = null) {
  const cleanText = decodeHtmlEntities(String(text || '').trim());
  if (!cleanText) return { endY: startY, totalHeight: 0, fontSize: initialSize, linesCount: 0 };

  const fontFamily = targetFontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  let fontSize = initialSize;
  let lines = [];
  const words = cleanText.split(/\s+/);

  while (fontSize >= minSize) {
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    if (lines.length <= 2) break;
    fontSize -= 2;
  }

  while (lines.length > 2 && fontSize > 14) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
  }

  // Ensure lines count never pushes layout beyond 3 lines
  if (lines.length > 3 && fontSize <= 14) {
    lines = lines.slice(0, 3);
  }

  if (textColor) {
    ctx.fillStyle = textColor;
  }
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px ${fontFamily}`;

  const lineHeight = Math.round(fontSize * 1.25);
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });

  const totalHeight = lines.length * lineHeight;
  return {
    fontSize,
    linesCount: lines.length,
    totalHeight,
    endY: startY + (lines.length - 1) * lineHeight
  };
}

/**
 * Defensive benefit line: auto-shrinks long copy and prevents canvas edge overflow
 */
function drawDefensiveBenefit(ctx, text, centerX, y, maxWidth, initialSize = 22, minSize = 13, color = null, fontFamily = null) {
  const clean = decodeHtmlEntities(String(text || '').trim());
  if (!clean) return y;

  const fam = fontFamily || 'system-ui, -apple-system, sans-serif';
  let size = initialSize;
  ctx.font = `700 ${size}px ${fam}`;

  while (ctx.measureText(clean).width > maxWidth && size > minSize) {
    size -= 1;
    ctx.font = `700 ${size}px ${fam}`;
  }

  let finalStr = clean;
  if (ctx.measureText(finalStr).width > maxWidth) {
    while (finalStr.length > 12 && ctx.measureText(finalStr + '...').width > maxWidth) {
      finalStr = finalStr.slice(0, -3).trim();
    }
    finalStr = finalStr + '...';
  }

  if (color) ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.font = `700 ${size}px ${fam}`;
  ctx.fillText(finalStr, centerX, y);
  return y;
}



export const POST_STYLES = [
  {
    id: 'unified_brand',
    name: 'Brand Master (Default)',
    tag: 'Flagship',
    badgeText: 'AUTHENTIC ORIGINAL',
    desc: 'Clean unified retail layout with category tag & offer pill',
    icon: 'ShieldCheck',
    accentColor: '#064e3b'
  },
  {
    id: 'luxury_editorial',
    name: 'Luxury Vogue Editorial',
    tag: 'High Fashion',
    badgeText: 'SIGNATURE EDIT',
    desc: 'Deep obsidian & champagne gold frame with luxury serif typography',
    icon: 'Sparkles',
    accentColor: '#d4af37'
  },
  {
    id: 'flash_sale',
    name: '24H Flash Sale',
    tag: 'Urgency',
    badgeText: 'FLASH SALE • TODAY ONLY',
    desc: 'High-urgency banner, strikethrough price & instant savings badge',
    icon: 'Flame',
    accentColor: '#ef4444'
  },
  {
    id: 'minimalist_clean',
    name: 'Studio Minimalist',
    tag: 'Clean Aesthetic',
    badgeText: 'STUDIO EDITION',
    desc: 'Airy white aesthetic, generous negative space & floating drop shadow',
    icon: 'Maximize2',
    accentColor: '#334155'
  },
  {
    id: 'neon_bold',
    name: 'Neon Streetwear Drop',
    tag: 'High Energy',
    badgeText: 'STREET DROP',
    desc: 'Jet black background with glowing electric neon & bold street typography',
    icon: 'Zap',
    accentColor: '#10b981'
  },
  {
    id: 'customer_reviews',
    name: 'Verified Customer Review',
    tag: 'Social Proof',
    badgeText: 'RATED 4.9 / 5.0',
    desc: '5-star gold rating bar, quote bubble & verified buyer social proof',
    icon: 'Star',
    accentColor: '#f59e0b'
  },
  {
    id: 'polaroid_snap',
    name: 'Polaroid Instant Snap',
    tag: 'Lifestyle',
    badgeText: 'DAILY PICK ✨',
    desc: 'Warm parchment Polaroid photo frame with handwritten lifestyle notes',
    icon: 'Camera',
    accentColor: '#b45309'
  },
  {
    id: 'restock_alerts',
    name: 'Fresh Restock Alert',
    tag: 'Scarcity',
    badgeText: 'JUST RESTOCKED',
    desc: 'Fresh shipment announcement with limited stock urgency meter',
    icon: 'PackageCheck',
    accentColor: '#0284c7'
  },
  {
    id: 'product_bundles',
    name: 'Routine Combo Bundle',
    tag: '2-in-1 Value',
    badgeText: 'BUNDLE & SAVE',
    desc: '2-in-1 combo routine pairing two items with package savings',
    icon: 'Layers',
    accentColor: '#8b5cf6'
  },
  {
    id: 'clearance_deal',
    name: 'Clearance Starburst Deal',
    tag: 'Hot Discount',
    badgeText: 'HOT DEAL • SAVE BIG',
    desc: 'Vibrant retail starburst clearance badge with maximum price contrast',
    icon: 'Tag',
    accentColor: '#dc2626'
  },
  {
    id: 'editorial_maison',
    name: 'Maison Luxury Editorial',
    tag: 'Handbags & Luxury',
    badgeText: 'PARISIAN EDIT',
    desc: 'Deep obsidian & cognac luxury frame, gold rules, high-fashion typography',
    icon: 'Sparkles',
    accentColor: '#d4af37'
  },
  {
    id: 'gloss_studio',
    name: 'Gloss Studio',
    tag: 'Makeup & Beauty',
    badgeText: 'STUDIO GLOW',
    desc: 'High-contrast studio, vibrant accent glow, formulation highlights',
    icon: 'Sparkles',
    accentColor: '#ec4899'
  },
  {
    id: 'pastel_boutique',
    name: 'Pastel Boutique',
    tag: 'Lip Care & Pastels',
    badgeText: 'HYDRATION ESSENTIAL',
    desc: 'Soft pastel warmth, playful pill badges, organic hydration focus',
    icon: 'Sparkles',
    accentColor: '#fb7185'
  },
  {
    id: 'botanical_spa',
    name: 'Botanical Spa',
    tag: 'Bath & Body',
    badgeText: '100% ORGANIC BOTANICAL',
    desc: 'Eucalyptus & sage spa tones, botanical ingredients badge',
    icon: 'ShieldCheck',
    accentColor: '#059669'
  },
  {
    id: 'clinical_apothecary',
    name: 'Clinical Apothecary',
    tag: 'Skincare & Serums',
    badgeText: 'DERMATOLOGICALLY TESTED',
    desc: 'Lab-clean aesthetic, active ingredient grid, clinical trust markers',
    icon: 'ShieldCheck',
    accentColor: '#0284c7'
  },
  {
    id: 'lookbook_atelier',
    name: 'Atelier Lookbook',
    tag: 'Fashion & Apparel',
    badgeText: 'NEW COLLECTION',
    desc: 'Modern streetwear lookbook, prominent size strip (S-XL), bold layout',
    icon: 'Zap',
    accentColor: '#0f172a'
  },
  {
    id: 'warm_living',
    name: 'Warm Living',
    tag: 'Home & Bedding',
    badgeText: 'HOME COMFORT',
    desc: 'Warm terracotta & amber tones, dimensions tag, delivery guarantee',
    icon: 'Tag',
    accentColor: '#ea580c'
  }
];

export const UNIFIED_PALETTES = STATIC_PALETTES;
export const LOCKED_PALETTES = PRIMARY_PALETTES;

function resolvePalette(seller, override) {
  return dynamicResolvePalette(seller, override);
}

function getCategorySizeText(product) {
  const isClothes = product.category && (
    product.category.toLowerCase().includes('clothes') ||
    product.category.toLowerCase().includes('clothing') ||
    product.category.toLowerCase().includes('fashion') ||
    product.category.toLowerCase().includes('dress')
  );
  const isHousehold = product.category && (
    product.category.toLowerCase().includes('household') ||
    product.category.toLowerCase().includes('bedding') ||
    product.category.toLowerCase().includes('kitchen')
  );

  if (product.sizes) return `SIZES: ${String(product.sizes).toUpperCase()}`;
  if (product.size) {
    if (isClothes) return `SIZE: ${String(product.size).toUpperCase()}`;
    if (isHousehold) return String(product.size).toUpperCase();
    return `NET ${String(product.size).toUpperCase()}`;
  }
  if (isClothes) return 'SIZES: S • M • L • XL';
  if (product.category) return String(product.category).toUpperCase();
  return 'AUTHENTIC';
}

function drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, subtitle, brandFont = 'Cinzel') {
  ctx.fillStyle = palette.primary;
  ctx.fillRect(0, 0, width, headerH);

  // Top & Bottom Gold Rules
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  // Subtitle (Clean Bold Retail Typography - No AI Stars)
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = '900 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(subtitle, width / 2, isStatus ? 44 : 36);

  // Shop Name in authentic Brand Font
  const fontObj = brandFont && SUPPORTED_BRAND_FONTS[brandFont];
  const fontFam = fontObj ? fontObj.name : (brandFont || 'Cinzel');
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 36px "${fontFam}", "Cinzel", system-ui, -apple-system, sans-serif`;
  ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

  // Location
  ctx.font = '600 17px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = palette.locationText;
  ctx.fillText(location, width / 2, isStatus ? 136 : 112);
}

function drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, mpesaTill, ctaHeader) {
  const footerY = height - footerH;

  ctx.fillStyle = palette.primary;
  ctx.fillRect(0, footerY, width, footerH);

  // Gold Top Separator Line
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, footerY, width, 8);

  // CTA Header (Clean Bold Retail Typography)
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = `900 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(ctaHeader, width / 2, footerY + (isStatus ? 48 : 34));

  // Large WhatsApp Number
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

  // Screenshot helper
  ctx.fillStyle = palette.footerSubtext;
  ctx.font = `600 ${isStatus ? 20 : 15}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('Screenshot this post to order • Countrywide Delivery', width / 2, footerY + (isStatus ? 174 : 124));

  // M-Pesa Pill
  const mpesaW = isStatus ? 760 : 660;
  const mpesaH = isStatus ? 48 : 38;
  const mpesaX = (width - mpesaW) / 2;
  const mpesaY = footerY + (isStatus ? 212 : 150);

  ctx.fillStyle = palette.mpesaBg;
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
  ctx.fill();

  ctx.strokeStyle = palette.mpesaBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
  ctx.stroke();

  ctx.fillStyle = palette.mpesaText;
  ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
  const mpesaText = mpesaTill
    ? `Lipa na M-Pesa Buy Goods Till: ${mpesaTill} • Same-Day Dispatch`
    : 'Lipa na M-Pesa Available • Same-Day Dispatch Across Kenya';
  ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));
}

function drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius = 28) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius);
  ctx.stroke();
}

/**
 * Centered Title & Benefit line renderer - Guaranteed never thrown to corners
 * Auto-wraps up to 2 lines without ellipsis truncation
 */
function drawCenteredTitleAndBenefit(ctx, title, benefit, centerX, startY, maxWidth, isStatus, textColor = '#0f172a', benefitColor = '#047857', brandFont = null) {
  const cleanTitle = decodeHtmlEntities(String(title || '').trim());
  const fontFam = brandFont || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  let initialFontSize = isStatus ? 40 : 28;
  let minFontSize = isStatus ? 24 : 18;
  let fontSize = initialFontSize;
  let lines = [];
  const words = cleanTitle.split(/\s+/);

  while (fontSize >= minFontSize) {
    ctx.font = `900 ${fontSize}px ${fontFam}`;
    lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    if (lines.length <= 2) break;
    fontSize -= 2;
  }

  if (lines.length > 2) {
    lines = [lines[0], lines.slice(1).join(' ')];
    while (fontSize > minFontSize && (ctx.measureText(lines[1]).width > maxWidth || ctx.measureText(lines[0]).width > maxWidth)) {
      fontSize -= 1;
      ctx.font = `900 ${fontSize}px ${fontFam}`;
    }
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px ${fontFam}`;

  const lineHeight = Math.round(fontSize * 1.15) + (isStatus ? 6 : 4);
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });

  const titleEndY = startY + (lines.length - 1) * lineHeight;

  // Benefit Line
  const benefitY = titleEndY + (isStatus ? 40 : 28);
  const cleanBenefit = decodeHtmlEntities(String(benefit || '').trim());
  if (cleanBenefit) {
    let benefitSize = isStatus ? 22 : 16;
    ctx.font = `700 ${benefitSize}px system-ui, -apple-system, sans-serif`;
    while (ctx.measureText(cleanBenefit).width > maxWidth && benefitSize > (isStatus ? 15 : 12)) {
      benefitSize -= 1;
      ctx.font = `700 ${benefitSize}px system-ui, -apple-system, sans-serif`;
    }
    ctx.fillStyle = benefitColor;
    ctx.textAlign = 'center';
    ctx.fillText(cleanBenefit, centerX, benefitY);
  }

  return {
    titleEndY,
    benefitY,
    nextY: benefitY + (isStatus ? 30 : 20)
  };
}

/**
 * Centered Dedicated High-Impact Offer POP Rectangle with gold border
 */
function drawSharedOfferPopRectangle(ctx, centerX, y, width, height, isStatus, fill = '#064e3b', outline = '#f59e0b', kicker = '✦ SPECIAL OFFER PRICE • IN STOCK ✦', kickerColor = '#f59e0b', price = 'KES 1,850', wasPrice = null) {
  const x = Math.round(centerX - width / 2);
  const cornerRadius = 22;

  // Outer gold glow
  ctx.save();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
  roundRect(ctx, x - 3, y - 3, width + 6, height + 6, cornerRadius + 2);
  ctx.fill();
  ctx.restore();

  // Box fill
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, width, height, cornerRadius);
  ctx.fill();

  // Gold outline
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  roundRect(ctx, x, y, width, height, cornerRadius);
  ctx.stroke();

  // Kicker
  const kickerY = y + (isStatus ? 28 : 22);
  ctx.fillStyle = kickerColor;
  ctx.textAlign = 'center';
  ctx.font = `800 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(kicker, centerX, kickerY);

  // Price
  const priceY = y + (isStatus ? 76 : 58);
  if (wasPrice) {
    const wasFont = `800 ${isStatus ? 24 : 17}px system-ui, -apple-system, sans-serif`;
    const nowFont = `900 ${isStatus ? 54 : 38}px system-ui, -apple-system, sans-serif`;
    
    ctx.font = wasFont;
    const wasW = ctx.measureText(wasPrice).width;
    ctx.font = nowFont;
    const nowW = ctx.measureText(price).width;
    const gap = isStatus ? 22 : 14;
    const totalW = wasW + gap + nowW;
    const wasX = centerX - totalW / 2 + wasW / 2;
    const nowX = centerX + totalW / 2 - nowW / 2;

    ctx.fillStyle = '#fca5a5';
    ctx.font = wasFont;
    ctx.textAlign = 'center';
    ctx.fillText(wasPrice, wasX, priceY - 2);

    // Strikethrough line
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wasX - wasW / 2 - 3, priceY - (isStatus ? 8 : 6));
    ctx.lineTo(wasX + wasW / 2 + 3, priceY - (isStatus ? 8 : 6));
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = nowFont;
    ctx.textAlign = 'center';
    ctx.fillText(price, nowX, priceY);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 60 : 44}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(price, centerX, priceY);
  }
}


export const canvasRenderer = {
  /**
   * Main render entry point - Dispatches dynamically to the chosen flyer style
   */
  async renderPost(product, seller, ratio = 'status', style = 'unified_brand', companionProduct = null, paletteOverride = null) {
    const config = resolveSellerConfig(seller);
    const cleanProduct = normalizeProductText(product) || product;
    const cleanCompanion = companionProduct ? (normalizeProductText(companionProduct) || companionProduct) : null;

    // Fail-soft validation: Loud log for developer/admin, graceful fail-soft card for seller
    const validation = validateProductForRender(cleanProduct);
    if (!validation.valid) {
      console.error(`[Render Validation Error] Product ID: "${cleanProduct?.id || 'unknown'}" | Errors:`, validation.errors);
      if (validation.isCritical) {
        return this.renderDefensiveFallbackPost(cleanProduct, config, ratio, validation.errors);
      }
    }

    if (config.brand_font) {
      try {
        await ensureBrandFontLoaded(config.brand_font);
      } catch (err) {
        // Safe non-blocking fallback
      }
    }

    const s = String(style || '').toLowerCase().trim();

    // 1. Direct Category Skin dispatch
    if (CATEGORY_SKIN_RENDERERS[s]) {
      return CATEGORY_SKIN_RENDERERS[s](cleanProduct, config, ratio, paletteOverride);
    }

    // 2. Intelligent Auto Category Skin Detection
    if (s === 'auto' || s === 'category_smart') {
      const autoSkin = detectCategorySkin(cleanProduct.category);
      if (autoSkin && CATEGORY_SKIN_RENDERERS[autoSkin]) {
        return CATEGORY_SKIN_RENDERERS[autoSkin](cleanProduct, config, ratio, paletteOverride);
      }
    }

    if (s === 'flash_sale' || s === 'price_drop') {
      return this.renderFlashSalePost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'customer_reviews' || s === 'review_spotlight') {
      return this.renderCustomerReviewPost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'product_bundles' || s === 'bundle_offer') {
      return this.renderProductBundlePost(cleanProduct, cleanCompanion, config, ratio, paletteOverride);
    }
    if (s === 'restock_alerts' || s === 'restocked' || s === 'back_in_stock' || s === 'limited_stock') {
      return this.renderRestockAlertPost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'luxury_editorial' || s === 'editorial' || s === 'vogue') {
      return this.renderLuxuryEditorialPost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'neon_bold' || s === 'streetwear' || s === 'neon') {
      return this.renderNeonBoldPost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'minimalist_clean' || s === 'minimal' || s === 'studio_clean') {
      return this.renderMinimalistPost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'polaroid_snap' || s === 'polaroid' || s === 'retro_snap') {
      return this.renderPolaroidPost(cleanProduct, config, ratio, paletteOverride);
    }
    if (s === 'clearance_deal' || s === 'hot_deal' || s === 'supermarket') {
      return this.renderClearanceDealPost(cleanProduct, config, ratio, paletteOverride);
    }

    // Default Brand Master layout ('unified_brand')
    return this.renderUnifiedPost(cleanProduct, config, ratio, style, paletteOverride);
  },

  /**
   * 1. Brand Master Flyer ('unified_brand') - Flagship Main Design
   */
  async renderUnifiedPost(product, seller, ratio = 'status', overrideStyle = null, paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const palette = resolvePalette(config, paletteOverride);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar (170px for status / 135px for group)
    const headerH = isStatus ? 170 : 135;
    
    // Category-smart header kicker
    let headerKicker = '✦ 100% AUTHENTIC • VERIFIED QUALITY ✦';
    let headerLocation = location;
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('household') || cat.includes('bedding') || cat.includes('kitchen')) {
      headerKicker = '✦ CATEGORY 2 • HOUSEHOLD & BEDDING ✦';
      headerLocation = "Owira's Luxury Home Collection • Countrywide Dispatch";
    } else if (cat.includes('bag')) {
      headerKicker = '✦ LUXURY HANDBAGS & LEATHER ACCESSORIES ✦';
    } else if (cat.includes('cloth') || cat.includes('fashion') || cat.includes('dress')) {
      headerKicker = '✦ PREMIUM FASHION & STREETWEAR ✦';
    }

    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, headerLocation, headerKicker, config.brand_font);

    // 2. The Main Product Showcase Card (ONE LARGE RECTANGLE!)
    const boxX = 60;
    const boxWidth = width - 120; // 960px
    const boxY = headerH + (isStatus ? 25 : 15); // 195px / 150px
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, 28);

    // Size / Authentic pill badge top-left
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Promo badge top-right if turned on
    if (product.badge || product.promo_tag) {
      const badgeTxt = String(product.badge || product.promo_tag).replace(/[✦★✨⭐]/g, '').trim().toUpperCase();
      if (badgeTxt) {
        ctx.fillStyle = badgeTxt.includes('SALE') ? '#dc2626' : palette.accent;
        const bW = Math.max(160, Math.round(ctx.measureText(badgeTxt).width + 36));
        roundRect(ctx, boxX + boxWidth - bW - 24, boxY + 22, bW, 42, 12);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 14px system-ui, -apple-system, sans-serif';
        ctx.fillText(badgeTxt, boxX + boxWidth - bW / 2 - 24, boxY + 47);
      }
    }

    // Hero Product Image - Auto-detected bounds so it fills ~80% to 85% of this large card!
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 90 : 60;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 15 : 10) + Math.round((boxHeight - (isStatus ? 15 : 10) - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // 3. Product Title & Benefit (Centered, clear spacing, wraps cleanly without ellipsis)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const cleanBenefit = product.benefit_line
      ? `✔ ${product.benefit_line}`
      : '✔ Plant-based cleansers & moisturizers • 92% natural';

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      cleanBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      palette.titleText || '#0f172a',
      palette.benefitText || '#047857',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      palette.primary,
      palette.accent,
      '✦ SPECIAL OFFER PRICE • IN STOCK ✦',
      palette.accent,
      formattedPrice
    );

    // 5. Bottom WhatsApp Footer Panel (Centered!)
    const footerH = isStatus ? 300 : 250;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ TO INQUIRE OR ORDER ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 2. Flash Sale Flyer ('flash_sale')
   * High-urgency deal with countdown ribbon, strikethrough regular price & flash savings
   */
  async renderFlashSalePost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const palette = resolvePalette(config, paletteOverride);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);

    const priceNum = Number(product.price || 0);
    const regPrice = product.regular_price && Number(product.regular_price) > priceNum
      ? Number(product.regular_price)
      : Math.round((priceNum * 1.3) / 50) * 50;
    const savings = Math.max(300, regPrice - priceNum);

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar
    const headerH = isStatus ? 170 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '⚡ 24-HOUR FLASH SALE • SPECIAL PRICE DROP ⚡', config.brand_font);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, 28);

    // Size / Category pill top-left
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Flash Sale Pill
    const flashTagW = isStatus ? 240 : 190;
    ctx.fillStyle = '#dc2626';
    roundRect(ctx, boxX + boxWidth - flashTagW - 24, boxY + 22, flashTagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('🔥 FLASH SALE • TODAY ONLY', boxX + boxWidth - flashTagW / 2 - 24, boxY + 47);

    // Hero Product Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 170 : 110;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 20 : 12) + Math.round((maxH - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // Urgency countdown bar at bottom of hero card
    const ribW = boxWidth - (isStatus ? 100 : 60);
    const ribH = isStatus ? 50 : 38;
    const ribX = boxX + (boxWidth - ribW) / 2;
    const ribY = boxY + boxHeight - ribH - (isStatus ? 20 : 12);
    ctx.fillStyle = '#fef2f2';
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = `900 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⏰ OFFER ENDS AT MIDNIGHT • LIMITED UNITS AT THIS PRICE', width / 2, ribY + ribH / 2 + (isStatus ? 5 : 4));

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const cleanBenefit = product.benefit_line
      ? `✔ ${product.benefit_line}`
      : '✔ Clears blemishes, fades dark spots & refines pores';

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      cleanBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#0f172a',
      '#475569',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered with strikethrough!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    const wasPriceStr = `WAS ~${regPrice.toLocaleString()}~`;
    const nowPriceStr = `KES ${priceNum.toLocaleString()}`;

    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      '#7f1d1d',
      '#f59e0b',
      `✦ FLASH DEAL PRICE • SAVE KES ${savings.toLocaleString()} ✦`,
      '#fef08a',
      nowPriceStr,
      wasPriceStr
    );

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 250;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ CLAIM THIS FLASH SALE DEAL ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 3. Customer Reviews Flyer ('customer_reviews')
   * Top customer rating, verified buyer quote bubble & social proof
   */
  async renderCustomerReviewPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const palette = resolvePalette(config, paletteOverride);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar
    const headerH = isStatus ? 170 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '✦ VERIFIED BUYER FAVORITE • 5-STAR RATED ✦', config.brand_font);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, 28);

    // Size / Category pill top-left
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Gold 5-Star Rating Badge
    const rateTagW = isStatus ? 240 : 190;
    ctx.fillStyle = '#f59e0b';
    roundRect(ctx, boxX + boxWidth - rateTagW - 24, boxY + 22, rateTagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('★★★★★ 4.9 RATING', boxX + boxWidth - rateTagW / 2 - 24, boxY + 47);

    // Hero Product Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 180 : 120;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 20 : 12) + Math.round((maxH - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // Frosted Testimonial Quote Bubble at bottom of hero card
    const qW = boxWidth - (isStatus ? 80 : 50);
    const qH = isStatus ? 120 : 85;
    const qX = boxX + (boxWidth - qW) / 2;
    const qY = boxY + boxHeight - qH - (isStatus ? 20 : 12);

    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, qX, qY, qW, qH, 18);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    roundRect(ctx, qX, qY, qW, qH, 18);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#f59e0b';
    ctx.font = `900 ${isStatus ? 48 : 34}px Georgia, serif`;
    ctx.textAlign = 'left';
    ctx.fillText('“', qX + (isStatus ? 24 : 16), qY + (isStatus ? 44 : 32));

    const cat = (product.category || '').toLowerCase();
    const isClothes = cat.includes('clothes') || cat.includes('clothing') || cat.includes('dress');
    const isHousehold = cat.includes('household') || cat.includes('bedding') || cat.includes('kitchen');

    const quoteTxt = isClothes
      ? '“True to size, breathable fabric and top quality stitching! Delivery was same-day.”'
      : (isHousehold
          ? '“Received exactly what was pictured, heavy quality and vibrant colors!”'
          : '“Cleared my dark spots in 2 weeks! Original product kabisa, 100% repurchasing.”');

    ctx.fillStyle = '#0f172a';
    ctx.font = `700 ${isStatus ? 18 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(quoteTxt, qX + (isStatus ? 60 : 42), qY + (isStatus ? 36 : 28));

    ctx.fillStyle = '#047857';
    ctx.font = `800 ${isStatus ? 15 : 11}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('— Stacy M., Kilimani • Verified Buyer ✓ (5/5 Stars)', qX + (isStatus ? 60 : 42), qY + (isStatus ? 76 : 56));

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const reviewBenefit = '★★★★★ 120+ Verified 5-Star Reviews from Kenyan Shoppers';

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      reviewBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#0f172a',
      '#b45309',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      palette.primary,
      palette.accent,
      '✦ TOP-RATED CUSTOMER FAVORITE • IN STOCK ✦',
      palette.accent,
      formattedPrice
    );

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 250;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ TO ORDER THIS 5-STAR FAVORITE ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 4. Product Bundle Flyer ('product_bundles')
   * 2-in-1 combo routine showcase with bundle discount
   */
  async renderProductBundlePost(product, companionProduct, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const palette = resolvePalette(config, paletteOverride);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;

    const price1 = Number(product.price || 0);
    const compPrice = companionProduct ? Number(companionProduct.price || 0) : Math.round(price1 * 0.85);
    const combinedTotal = price1 + compPrice;
    const savings = Math.max(400, Math.round((combinedTotal * 0.15) / 50) * 50);
    const bundlePrice = combinedTotal - savings;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '✦ 2-IN-1 ROUTINE COMBO • BUNDLE & SAVE ✦', config.brand_font);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, 28);

    // Top-Left Category Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = 200;
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('2-IN-1 ROUTINE', boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Bundle Savings Pill
    const bW = 200;
    ctx.fillStyle = '#10b981';
    roundRect(ctx, boxX + boxWidth - bW - 24, boxY + 22, bW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('🎁 BUNDLE & SAVE', boxX + boxWidth - bW / 2 - 24, boxY + 47);

    // Load Images (Main + Companion)
    const heroImg = await loadProductImage(product, product.photo);
    const compImg = companionProduct ? await loadProductImage(companionProduct, companionProduct.photo) : null;

    if (heroImg && compImg) {
      const sideW = Math.round((boxWidth - 140) / 2);
      const sideH = isStatus ? 720 : 420;

      // Left Image (Main)
      const b1 = getProductBounds(heroImg);
      const scale1 = Math.min((sideW - 30) / b1.sWidth, (sideH - 30) / b1.sHeight);
      const dw1 = Math.round(b1.sWidth * scale1);
      const dh1 = Math.round(b1.sHeight * scale1);
      ctx.drawImage(heroImg, b1.sx, b1.sy, b1.sWidth, b1.sHeight,
        boxX + 40 + Math.round((sideW - dw1) / 2),
        boxY + 70 + Math.round((sideH - dh1) / 2),
        dw1, dh1);

      // Center PLUS Badge
      const plusCx = boxX + boxWidth / 2;
      const plusCy = boxY + 70 + sideH / 2;
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(plusCx, plusCy, isStatus ? 28 : 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${isStatus ? 32 : 24}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('+', plusCx, plusCy + (isStatus ? 10 : 8));

      // Right Image (Companion)
      const b2 = getProductBounds(compImg);
      const scale2 = Math.min((sideW - 30) / b2.sWidth, (sideH - 30) / b2.sHeight);
      const dw2 = Math.round(b2.sWidth * scale2);
      const dh2 = Math.round(b2.sHeight * scale2);
      ctx.drawImage(compImg, b2.sx, b2.sy, b2.sWidth, b2.sHeight,
        boxX + boxWidth - 40 - sideW + Math.round((sideW - dw2) / 2),
        boxY + 70 + Math.round((sideH - dh2) / 2),
        dw2, dh2);

      // Dual labels below each image
      const lblY = boxY + 80 + sideH;
      const lblH = isStatus ? 40 : 32;

      ctx.fillStyle = '#f1f5f9';
      roundRect(ctx, boxX + 40, lblY, sideW, lblH, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = `800 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(`1. ${product.name.slice(0, 24)}`, boxX + 40 + sideW / 2, lblY + lblH / 2 + 5);

      ctx.fillStyle = '#f1f5f9';
      roundRect(ctx, boxX + boxWidth - 40 - sideW, lblY, sideW, lblH, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`2. ${companionProduct.name.slice(0, 24)}`, boxX + boxWidth - 40 - sideW / 2, lblY + lblH / 2 + 5);
    } else if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const maxW = boxWidth - 80;
      const maxH = boxHeight - (isStatus ? 160 : 100);
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 60 + Math.round((maxH - dh) / 2),
        dw, dh);
    }

    // Savings ribbon at bottom of card
    const ribW = boxWidth - (isStatus ? 100 : 60);
    const ribH = isStatus ? 50 : 38;
    const ribX = boxX + (boxWidth - ribW) / 2;
    const ribY = boxY + boxHeight - ribH - (isStatus ? 20 : 12);

    ctx.fillStyle = '#ecfdf5';
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = `900 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('✨ 2-STEP COMPLETE ROUTINE FOR FASTER GLOW RESULTS', width / 2, ribY + ribH / 2 + (isStatus ? 5 : 4));

    // 3. Product Title & Benefit (Centered!)
    const comboTitle = companionProduct
      ? `${product.name} + ${companionProduct.name} Duo`
      : `${product.name} 2-in-1 Routine Combo`;
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const bundleBenefit = '✔ Perfect 2-Step Daily Routine • Bundle & Save';

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      comboTitle,
      bundleBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#0f172a',
      '#475569',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 600 : 500;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      palette.primary,
      palette.accent,
      `✦ 2-IN-1 COMBO DEAL • SAVE KES ${savings.toLocaleString()} ✦`,
      '#fef08a',
      `KES ${bundlePrice.toLocaleString()} BUNDLE`
    );

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 250;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ CLAIM THIS 2-IN-1 BUNDLE ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 5. Restock Alert Flyer ('restock_alerts')
   * Fresh batch announcement with FOMO scarcity meter
   */
  async renderRestockAlertPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const palette = resolvePalette(config, paletteOverride);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;
    const remainingCount = product.remaining || product.stock_qty || 4;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '⚡ JUST RESTOCKED • FRESH SHIPMENT LANDED ⚡', config.brand_font);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, 28);

    // Size / Category pill top-left
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Restock Badge
    const restockTagW = isStatus ? 220 : 180;
    ctx.fillStyle = '#059669';
    roundRect(ctx, boxX + boxWidth - restockTagW - 24, boxY + 22, restockTagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('⚡ JUST RESTOCKED', boxX + boxWidth - restockTagW / 2 - 24, boxY + 47);

    // Hero Product Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 170 : 110;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 20 : 12) + Math.round((maxH - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // Scarcity Meter ribbon at bottom of card
    const ribW = boxWidth - (isStatus ? 100 : 60);
    const ribH = isStatus ? 50 : 38;
    const ribX = boxX + (boxWidth - ribW) / 2;
    const ribY = boxY + boxHeight - ribH - (isStatus ? 20 : 12);

    ctx.fillStyle = '#fef3c7';
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`⚠️ ONLY ${remainingCount} PIECES REMAINING IN STOCK • SELLING FAST`, width / 2, ribY + ribH / 2 + (isStatus ? 5 : 4));

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const restockBenefit = '✔ Fresh Shipment Just Landed • Original Import Quality';

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      restockBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#0f172a',
      '#475569',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      palette.primary,
      palette.accent,
      '✦ BACK BY POPULAR DEMAND • READY TO DISPATCH ✦',
      '#fef08a',
      formattedPrice
    );

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 250;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ GRAB YOURS BEFORE IT SELLS OUT AGAIN:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 6. Luxury Vogue Editorial Flyer ('luxury_editorial')
   */
  async renderLuxuryEditorialPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const brandFont = config.brand_font || 'Cinzel';
    const fontObj = SUPPORTED_BRAND_FONTS[brandFont];
    const luxuryFontFam = fontObj ? fontObj.cssFamily : `"${brandFont}", Georgia, serif`;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Deep Obsidian / Noir Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Subtle gold outer frame
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Luxury Editorial Masthead
    const headerH = isStatus ? 170 : 135;
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, 0, width, 8);
    ctx.fillRect(0, headerH - 8, width, 8);

    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.font = `700 ${isStatus ? 16 : 12}px ${luxuryFontFam}`;
    ctx.fillText('—  V O G U E   C U R A T E D   E D I T I O N  —', width / 2, isStatus ? 44 : 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 38 : 30}px ${luxuryFontFam}`;
    ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `500 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(location, width / 2, isStatus ? 136 : 112);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;

    ctx.save();
    ctx.fillStyle = '#101624';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.2)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 6;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.stroke();

    // Top-Left Signature Edit Badge
    ctx.font = `700 13px ${luxuryFontFam}`;
    const sigBadgeW = 190;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
    roundRect(ctx, boxX + 24, boxY + 22, sigBadgeW, 40, 12);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    roundRect(ctx, boxX + 24, boxY + 22, sigBadgeW, 40, 12);
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.textAlign = 'center';
    ctx.fillText('SIGNATURE EDIT', boxX + 24 + sigBadgeW / 2, boxY + 47);

    // Top-Right Authentic Badge
    const authW = 180;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
    roundRect(ctx, boxX + boxWidth - authW - 24, boxY + 22, authW, 40, 12);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    roundRect(ctx, boxX + boxWidth - authW - 24, boxY + 22, authW, 40, 12);
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.fillText('100% AUTHENTIC', boxX + boxWidth - authW / 2 - 24, boxY + 47);

    // Hero Image with warm center glow
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const cx = boxX + boxWidth / 2;
      const cy = boxY + boxHeight / 2;
      const aura = ctx.createRadialGradient(cx, cy, 40, cx, cy, boxWidth * 0.42);
      aura.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
      aura.addColorStop(0.7, 'rgba(212, 175, 55, 0.04)');
      aura.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(boxX + 10, boxY + 10, boxWidth - 20, boxHeight - 20);

      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 90 : 60;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 15 : 10) + Math.round((boxHeight - (isStatus ? 15 : 10) - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const luxuryBenefit = `✦ ${product.benefit_line || 'Certified Original Formulation • Import Quality'} ✦`;

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      luxuryBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#ffffff',
      '#d4af37',
      luxuryFontFam
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      '#101624',
      '#d4af37',
      '✦ CURATED LUXURY EDIT • IN STOCK ✦',
      '#d4af37',
      formattedPrice
    );

    // 5. Luxury Footer
    const footerH = isStatus ? 300 : 250;
    const footerY = height - footerH;

    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, footerY, width, footerH);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, footerY, width, 8);

    ctx.fillStyle = '#d4af37';
    ctx.font = `800 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ VIP CONCIERGE ORDERING VIA WHATSAPP:', width / 2, footerY + (isStatus ? 48 : 34));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 ${isStatus ? 19 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Dispatched via Wells Fargo / G4S / Boda • Same-Day Dispatch', width / 2, footerY + (isStatus ? 174 : 124));

    const mpesaW = isStatus ? 760 : 660;
    const mpesaH = isStatus ? 48 : 38;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 212 : 150);

    ctx.fillStyle = '#101624';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    const mpesaText = config.mpesa_till
      ? `Lipa na M-Pesa Buy Goods Till: ${config.mpesa_till} • Certified Payment`
      : 'Lipa na M-Pesa Available • Official Receipt Issued';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));

    return canvas.toDataURL('image/png');
  },

  /**
   * 7. Neon Streetwear Drop Flyer ('neon_bold')
   */
  async renderNeonBoldPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Pure Matte Jet Black Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Neon Frame
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar
    const headerH = isStatus ? 170 : 135;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, width, 8);
    ctx.fillRect(0, headerH - 8, width, 8);

    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.font = `900 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('⚡ HIGH DEMAND DROP // OFFICIAL STREET RELEASE ⚡', width / 2, isStatus ? 44 : 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 40 : 32}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

    ctx.fillStyle = '#10b981';
    ctx.font = `800 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`// ${location.toUpperCase()} //`, width / 2, isStatus ? 136 : 112);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;

    ctx.save();
    ctx.fillStyle = '#141418';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 24;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.stroke();

    // Top-Left Neon Street Tag
    ctx.fillStyle = '#10b981';
    const tagW = Math.max(170, Math.round(ctx.measureText(sizeText).width + 36));
    roundRect(ctx, boxX + 24, boxY + 22, tagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`STREET // ${sizeText}`, boxX + 24 + tagW / 2, boxY + 47);

    // Top-Right Cyber Yellow Tag
    const rightTagW = 180;
    ctx.fillStyle = '#facc15';
    roundRect(ctx, boxX + boxWidth - rightTagW - 24, boxY + 22, rightTagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('100% AUTHENTIC', boxX + boxWidth - rightTagW / 2 - 24, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 90 : 60;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 15 : 10) + Math.round((boxHeight - (isStatus ? 15 : 10) - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const streetBenefit = `// ${product.benefit_line || 'Verified Original Stock • Express Same-Day Pickup'} //`;

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      streetBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#ffffff',
      '#10b981',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      '#141418',
      '#10b981',
      '⚡ OFFICIAL STREET DROP PRICE ⚡',
      '#10b981',
      formattedPrice
    );

    // 5. Footer
    const footerH = isStatus ? 300 : 250;
    const footerY = height - footerH;

    ctx.fillStyle = '#141418';
    ctx.fillRect(0, footerY, width, footerH);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, footerY, width, 8);

    ctx.fillStyle = '#10b981';
    ctx.font = `900 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('⚡ TAP TO COP ON WHATSAPP NOW:', width / 2, footerY + (isStatus ? 48 : 34));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

    ctx.fillStyle = '#a1a1aa';
    ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Express Dispatch Across Nairobi • Send Screenshot to Lock Order', width / 2, footerY + (isStatus ? 174 : 124));

    const mpesaW = isStatus ? 760 : 660;
    const mpesaH = isStatus ? 48 : 38;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 212 : 150);

    ctx.fillStyle = '#09090b';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = `800 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
    const mpesaText = config.mpesa_till
      ? `Lipa na M-Pesa Buy Goods: ${config.mpesa_till} • Instant Confirmation`
      : 'Lipa na M-Pesa Buy Goods Available • Instant Dispatch';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));

    return canvas.toDataURL('image/png');
  },

  /**
   * 8. Studio Minimalist Flyer ('minimalist_clean')
   */
  async renderMinimalistPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Header
    const headerH = isStatus ? 170 : 135;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 0, width, 8);
    ctx.fillRect(0, headerH - 8, width, 8);

    ctx.fillStyle = '#fef3c7';
    ctx.textAlign = 'center';
    ctx.font = `800 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('✦ STUDIO MINIMALIST • AUTHENTIC SELECTION ✦', width / 2, isStatus ? 44 : 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 38 : 30}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(location, width / 2, isStatus ? 136 : 112);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, 28);

    // Top-Left Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = '#0f172a';
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Badge
    const rightTagW = 190;
    ctx.fillStyle = '#334155';
    roundRect(ctx, boxX + boxWidth - rightTagW - 24, boxY + 22, rightTagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('STUDIO EDITION', boxX + boxWidth - rightTagW / 2 - 24, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 90 : 60;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 15 : 10) + Math.round((boxHeight - (isStatus ? 15 : 10) - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const cleanBenefit = `• ${product.benefit_line || 'Verified Authentic Formula • Clean Formulation'}`;

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      cleanBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#0f172a',
      '#64748b',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      '#0f172a',
      '#d97706',
      '✦ SPECIAL OFFER PRICE • IN STOCK ✦',
      '#d97706',
      formattedPrice
    );

    // 5. Footer
    const footerH = isStatus ? 300 : 250;
    const palette = {
      primary: '#0f172a',
      accent: '#d97706',
      footerSubtext: '#cbd5e1',
      mpesaBg: '#0f172a',
      mpesaBorder: '#d97706',
      mpesaText: '#ffffff'
    };
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ TO INQUIRE OR ORDER ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 9. Polaroid Instant Snap Flyer ('polaroid_snap')
   */
  async renderPolaroidPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Warm paper background
    ctx.fillStyle = '#f6f2ec';
    ctx.fillRect(0, 0, width, height);

    // Outer frame
    ctx.strokeStyle = '#e7e0d6';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Boutique Header
    const headerH = isStatus ? 170 : 135;
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, width, 8);
    ctx.fillRect(0, headerH - 8, width, 8);

    ctx.fillStyle = '#fde68a';
    ctx.textAlign = 'center';
    ctx.font = `800 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('✨ TODAY\'S HANDPICKED FAVORITE ✨', width / 2, isStatus ? 44 : 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 38 : 30}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

    ctx.fillStyle = '#fef3c7';
    ctx.font = `600 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(location, width / 2, isStatus ? 136 : 112);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(69, 26, 3, 0.16)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 6;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#e7e0d6';
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.stroke();

    // Washi Tape at Top-Center of Card
    drawWashiTape(ctx, width / 2, boxY, isStatus ? 210 : 160, 36, -0.025, 'rgba(217, 195, 170, 0.92)', 'rgba(180, 150, 120, 0.45)');

    // Top-Left Category Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = '#b45309';
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Pill
    const tagW = 180;
    ctx.fillStyle = '#78350f';
    roundRect(ctx, boxX + boxWidth - tagW - 24, boxY + 22, tagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('DAILY PICK ✨', boxX + boxWidth - tagW / 2 - 24, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 90 : 60;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 15 : 10) + Math.round((boxHeight - (isStatus ? 15 : 10) - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const polaroidBenefit = `✔ ${product.benefit_line || 'Clean, authentic results with zero harmful additives.'}`;

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      polaroidBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#451a03',
      '#78350f',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      '#451a03',
      '#b45309',
      '✦ HANDPICKED PRICE • IN STOCK ✦',
      '#fde68a',
      formattedPrice
    );

    // 5. Footer
    const footerH = isStatus ? 300 : 250;
    const palette = {
      primary: '#451a03',
      accent: '#b45309',
      footerSubtext: '#fef3c7',
      mpesaBg: '#ffffff',
      mpesaBorder: '#b45309',
      mpesaText: '#451a03'
    };
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ SCREENSHOT TO ORDER ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 10. Clearance Starburst Deal Flyer ('clearance_deal')
   */
  async renderClearanceDealPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const shopName = (config.shop_name).toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const sizeText = getCategorySizeText(product);
    const priceNum = Number(product.price || 0);
    const originalPrice = Math.round((priceNum * 1.35) / 50) * 50;
    const savings = originalPrice - priceNum;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#fca5a5';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Top Header Bar
    const headerH = isStatus ? 170 : 135;
    ctx.fillStyle = '#881337';
    ctx.fillRect(0, 0, width, headerH);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, width, 8);
    ctx.fillRect(0, headerH - 8, width, 8);

    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'center';
    ctx.font = `900 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('🔥 CRAZY CLEARANCE DEAL • BEI YA OFA LEO 🔥', width / 2, isStatus ? 44 : 36);

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 38 : 30}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

    ctx.fillStyle = '#fef08a';
    ctx.font = `700 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`CLEARANCE SALE • ${location.toUpperCase()}`, width / 2, isStatus ? 136 : 112);

    // 2. The Main Product Showcase Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(136, 19, 55, 0.2)';
    ctx.shadowBlur = 28;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
    ctx.stroke();

    // Top-Left Pill
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(170, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = '#881337';
    roundRect(ctx, boxX + 24, boxY + 22, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 24 + catBadgeW / 2, boxY + 47);

    // Top-Right Hot Deal Pill
    const hotTagW = 190;
    ctx.fillStyle = '#facc15';
    roundRect(ctx, boxX + boxWidth - hotTagW - 24, boxY + 22, hotTagW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#881337';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('HOT CLEARANCE 🔥', boxX + boxWidth - hotTagW / 2 - 24, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const padW = isStatus ? 70 : 50;
      const padH = isStatus ? 170 : 110;
      const maxW = boxWidth - padW;
      const maxH = boxHeight - padH;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      const bx = boxX + Math.round((boxWidth - dw) / 2);
      const by = boxY + (isStatus ? 20 : 12) + Math.round((maxH - dh) / 2);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight, bx, by, dw, dh);
    }

    // Clearance countdown / urgency ribbon at bottom of card
    const ribW = boxWidth - (isStatus ? 100 : 60);
    const ribH = isStatus ? 50 : 38;
    const ribX = boxX + (boxWidth - ribW) / 2;
    const ribY = boxY + boxHeight - ribH - (isStatus ? 20 : 12);
    ctx.fillStyle = '#fef2f2';
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    roundRect(ctx, ribX, ribY, ribW, ribH, 14);
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = `900 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('💥 WAREHOUSE CLEARANCE • LIMITED UNITS REMAINING', width / 2, ribY + ribH / 2 + (isStatus ? 5 : 4));

    // 3. Product Title & Benefit (Centered!)
    const titleStartY = boxY + boxHeight + (isStatus ? 40 : 26);
    const clearanceBenefit = `✔ ${product.benefit_line || 'Warehouse Clearance • All Sales Final • Grab Now'}`;

    const textResult = drawCenteredTitleAndBenefit(
      ctx,
      product.name,
      clearanceBenefit,
      width / 2,
      titleStartY,
      boxWidth,
      isStatus,
      '#0f172a',
      '#881337',
      config.brand_font
    );

    // 4. Dedicated Offer POP Rectangle (Centered with strikethrough!)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 92;
    const wasPriceStr = `WAS ~${originalPrice.toLocaleString()}~`;
    const nowPriceStr = `KES ${priceNum.toLocaleString()}`;

    drawSharedOfferPopRectangle(
      ctx,
      width / 2,
      textResult.nextY,
      offerW,
      offerH,
      isStatus,
      '#881337',
      '#facc15',
      `✦ CRAZY CLEARANCE PRICE • SAVE KES ${savings.toLocaleString()} ✦`,
      '#facc15',
      nowPriceStr,
      wasPriceStr
    );

    // 5. Footer
    const footerH = isStatus ? 300 : 250;
    const palette = {
      primary: '#881337',
      accent: '#facc15',
      footerSubtext: '#fef08a',
      mpesaBg: '#881337',
      mpesaBorder: '#facc15',
      mpesaText: '#ffffff'
    };
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, '⚡ HURRY! CLAIM ON WHATSAPP BEFORE STOCK CLEARS:');

    return canvas.toDataURL('image/png');
  },

  /**
   * Legacy Style Aliases for Full Backward Compatibility
   */
  async renderPriceFocusStyle(product, seller, ratio) {
    return this.renderUnifiedPost(product, seller, ratio);
  },
  async renderPriceDropStyle(product, seller, ratio) {
    return this.renderFlashSalePost(product, seller, ratio);
  },
  async renderBackInStockStyle(product, seller, ratio) {
    return this.renderRestockAlertPost(product, seller, ratio);
  },
  async renderBenefitFocusStyle(product, seller, ratio) {
    return this.renderCustomerReviewPost(product, seller, ratio);
  },
  async renderSimplePhotoStyle(product, seller, ratio) {
    return this.renderUnifiedPost(product, seller, ratio);
  },
  async renderBundleOfferStyle(product, companionProduct, seller, ratio) {
    return this.renderProductBundlePost(product, companionProduct, seller, ratio);
  },
  /**
   * Resilient, fail-soft defensive fallback poster when product validation catches defects.
   * Ensures the merchant at 11 PM never sees a broken/blank screen.
   */
  async renderDefensiveFallbackPost(product, seller, ratio = 'status', errors = []) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const config = resolveSellerConfig(seller);
    const shopName = (config.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = config.phone;
    const location = config.location;
    const palette = dynamicResolvePalette(seller);

    // Deep Brand Slate Base
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // 1. Header
    const headerH = isStatus ? 170 : 140;
    ctx.fillStyle = '#d4af37';
    ctx.font = '700 15px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('• OFFICIAL STORE CATALOG •', width / 2, isStatus ? 75 : 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px Georgia, serif';
    ctx.fillText(shopName, width / 2, isStatus ? 122 : 100);

    ctx.font = '500 15px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(location, width / 2, isStatus ? 156 : 128);

    // 2. Hero Card Box
    const boxX = 65;
    const boxWidth = width - 130;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 880 : 540;

    ctx.fillStyle = '#1e293b';
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
    ctx.stroke();

    // Try to load photo if exists, else graceful crest
    let drawnPhoto = false;
    const photoCandidate = product?.photo || (Array.isArray(product?.photos) && product.photos[0]) || product?.image_url;
    if (photoCandidate) {
      try {
        const heroImg = await loadProductImage(product, photoCandidate);
        if (heroImg) {
          const bounds = getProductBounds(heroImg);
          const pad = isStatus ? 40 : 25;
          const maxW = boxWidth - pad * 2;
          const maxH = boxHeight - pad * 2;
          const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
          const dw = Math.round(bounds.sWidth * scale);
          const dh = Math.round(bounds.sHeight * scale);
          ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
            boxX + Math.round((boxWidth - dw) / 2),
            boxY + Math.round((boxHeight - dh) / 2),
            dw, dh);
          drawnPhoto = true;
        }
      } catch (_) {}
    }

    if (!drawnPhoto) {
      ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
      ctx.beginPath();
      ctx.arc(width / 2, boxY + boxHeight / 2 - 20, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#d4af37';
      ctx.font = '900 48px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', width / 2, boxY + boxHeight / 2 - 4);

      ctx.font = '700 18px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('AUTHENTIC KENYAN STORE ITEM', width / 2, boxY + boxHeight / 2 + 50);
      ctx.font = '500 14px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Contact WhatsApp for Real-Time Photos & Pricing', width / 2, boxY + boxHeight / 2 + 76);
    }

    // 3. Product Title
    const titleStartY = boxY + boxHeight + (isStatus ? 36 : 24);
    const titleText = decodeHtmlEntities(product?.name || 'Exclusive Kenyan Store Item');
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, titleText, width / 2, titleStartY, boxWidth - 40, isStatus ? 34 : 26, 18, '#ffffff');

    // Subtitle
    const benefitY = titleResult.endY + (isStatus ? 30 : 20);
    const benefitText = decodeHtmlEntities(product?.benefit_line || '100% Verified Quality • Fast Same-Day Dispatch Across Kenya');
    drawDefensiveBenefit(ctx, `✦ ${benefitText} ✦`, width / 2, benefitY, boxWidth - 40, isStatus ? 18 : 14, 12, '#d4af37');

    // 4. Price Plaque
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 110 : 88;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 24 : 16);

    ctx.fillStyle = '#1e293b';
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.stroke();

    const priceNum = Number(product?.price || 0);
    const priceDisplay = priceNum > 0 ? `KES ${priceNum.toLocaleString()}` : 'PRICE ON INQUIRY';
    ctx.fillStyle = '#d4af37';
    ctx.font = `700 ${isStatus ? 14 : 12}px Georgia, serif`;
    ctx.fillText('— OFFICIAL PRICE —', width / 2, offerY + (isStatus ? 30 : 24));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 56 : 42}px Georgia, serif`;
    ctx.fillText(priceDisplay, width / 2, offerY + (isStatus ? 82 : 64));

    // 5. Shared Footer
    const footerH = isStatus ? 280 : 230;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, config.mpesa_till, 'ORDER / INQUIRE ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * Convert Data URL to Blob for sharing
   */
  dataURLToBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
};
